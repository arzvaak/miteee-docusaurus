"""Align Mistral-OCR book candidates with solution-marker answers.

Uploaded SSC books often place answers in later OCR solution pages as lines like
``Sol.227.(c)``. This stage extracts those answers and moves matched candidates
to topic/duplicate review. It never promotes rows into ranked practice.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANDIDATES = ROOT / "data" / "exams" / "ssc-cgl" / "book-segments-mistral" / "ssc-maths-6800-mcq" / "ocr-range-p0021-p0040-p021-p040" / "question-candidates.json"
DEFAULT_EXTRACTION_REPORT = ROOT / "data" / "exams" / "ssc-cgl" / "book-ocr" / "ssc-maths-6800-mcq-ocr-range-p0021-p0040-p021-p040" / "extraction-report.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "aligned-mistral"

VALID_OPTIONS = {"a", "b", "c", "d"}
SOLUTION_MARKER = re.compile(
    r"\bSol(?:ution)?\s*[:.]?\s*(\d{1,4})\s*\.?\s*[\(\[]\s*([a-dA-D])\s*[\)\]]",
    re.IGNORECASE,
)


@dataclass
class ExtractedAnswer:
    questionNumber: str
    correctOption: str
    pageNumber: int
    evidenceText: str
    sourceType: str


@dataclass
class OcrAnswerAlignmentReport:
    generatedAt: str
    sourceId: str
    sourceType: str
    totalCandidates: int
    extractedAnswers: int
    matched: int
    mismatched: int
    missing: int
    rankedEligible: bool
    alignedPath: str
    answerKeyPath: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_markdown_line(value: str) -> str:
    text = re.sub(r"[*_`#]+", "", value or "")
    return re.sub(r"\s+", " ", text).strip()


def normalize_option(value: object) -> str | None:
    if value is None:
        return None
    option = str(value).strip().lower()
    return option if option in VALID_OPTIONS else None


def extract_answers(extraction_report: dict) -> dict[str, ExtractedAnswer]:
    answers: dict[str, ExtractedAnswer] = {}
    for page in extraction_report.get("pages", []):
        if not isinstance(page, dict):
            continue
        page_number = int(page.get("pageNumber") or 0)
        text_path = Path(str(page.get("textPath") or ""))
        if not text_path.exists():
            continue
        for raw_line in text_path.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = normalize_markdown_line(raw_line)
            if not line:
                continue
            match = SOLUTION_MARKER.search(line)
            if not match:
                continue
            question_number = match.group(1).strip()
            option = normalize_option(match.group(2))
            if not option:
                continue
            answers.setdefault(question_number, ExtractedAnswer(
                questionNumber=question_number,
                correctOption=option,
                pageNumber=page_number,
                evidenceText=line[:500],
                sourceType="mistral_ocr_solution_marker",
            ))
    return answers


def align_candidates(candidates: list[dict], answers: dict[str, ExtractedAnswer]) -> tuple[list[dict], int, int, int]:
    aligned: list[dict] = []
    matched = 0
    mismatched = 0
    missing = 0
    for candidate in candidates:
        item = dict(candidate)
        item["rankedEligible"] = False
        question_number = str(item.get("questionNumber") or "").strip()
        extracted = answers.get(question_number)
        candidate_answer = normalize_option(item.get("answerKeyCandidate"))

        if not extracted:
            item["correctOption"] = None
            item["alignmentStatus"] = "missing_answer_key"
            item["reviewStatus"] = "missing_answer_key"
            missing += 1
        elif candidate_answer and candidate_answer != extracted.correctOption:
            item["correctOption"] = None
            item["alignmentStatus"] = "answer_key_mismatch"
            item["reviewStatus"] = "answer_key_mismatch"
            item["answerKeyExpected"] = extracted.correctOption
            item["answerEvidence"] = asdict(extracted)
            mismatched += 1
        else:
            item["correctOption"] = extracted.correctOption
            item["answerKeyCandidate"] = extracted.correctOption
            item["alignmentStatus"] = "matched"
            item["reviewStatus"] = "needs_topic_duplicate_review"
            item["answerEvidence"] = asdict(extracted)
            matched += 1
        aligned.append(item)
    return aligned, matched, mismatched, missing


def write_outputs(
    aligned: list[dict],
    answers: dict[str, ExtractedAnswer],
    extraction_report: dict,
    output_root: Path,
    matched: int,
    mismatched: int,
    missing: int,
) -> OcrAnswerAlignmentReport:
    output_root.mkdir(parents=True, exist_ok=True)
    aligned_path = output_root / "aligned-candidates.json"
    answer_key_path = output_root / "extracted-ocr-answer-key.json"
    report_path = output_root / "ocr-answer-alignment-report.json"
    aligned_path.write_text(json.dumps(aligned, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    answer_rows = [asdict(answer) for answer in sorted(answers.values(), key=lambda item: int(item.questionNumber))]
    answer_key_path.write_text(json.dumps(answer_rows, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report = OcrAnswerAlignmentReport(
        generatedAt=now_iso(),
        sourceId=str(extraction_report.get("sourceId") or "unknown-source"),
        sourceType=str(extraction_report.get("sourceType") or "book_user_provided"),
        totalCandidates=len(aligned),
        extractedAnswers=len(answers),
        matched=matched,
        mismatched=mismatched,
        missing=missing,
        rankedEligible=False,
        alignedPath=str(aligned_path.resolve()),
        answerKeyPath=str(answer_key_path.resolve()),
        warnings=[
            "OCR solution-marker alignment is not ranked promotion.",
            "Matched rows still require topic, duplicate, provenance, and final curation review.",
            "Rows without OCR solution markers remain quarantined for separate answer-key extraction or agent solving.",
        ],
    )
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Align Mistral-OCR SSC book candidates using OCR solution markers.")
    parser.add_argument("--candidates", type=Path, default=DEFAULT_CANDIDATES)
    parser.add_argument("--extraction-report", type=Path, default=DEFAULT_EXTRACTION_REPORT)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    if not args.candidates.exists():
        parser.error(f"candidate file not found: {args.candidates}")
    if not args.extraction_report.exists():
        parser.error(f"extraction report not found: {args.extraction_report}")

    candidates = load_json(args.candidates)
    extraction_report = load_json(args.extraction_report)
    if not isinstance(candidates, list):
        parser.error("candidate file must contain a JSON array")
    if not isinstance(extraction_report, dict):
        parser.error("extraction report must contain a JSON object")

    answers = extract_answers(extraction_report)
    aligned, matched, mismatched, missing = align_candidates(candidates, answers)
    report = write_outputs(aligned, answers, extraction_report, args.output_root, matched, mismatched, missing)
    print(
        f"ocr answers matched {report.matched}/{report.totalCandidates}; "
        f"extracted {report.extractedAnswers}; mismatched {report.mismatched}; missing {report.missing}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
