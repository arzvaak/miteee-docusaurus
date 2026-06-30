"""Align review-only SSC CGL question candidates with an answer key.

This stage still does not create ranked questions. A matched answer only moves a
candidate to topic/duplicate/provenance review. Mismatches stay quarantined.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANDIDATES = ROOT / "data" / "exams" / "ssc-cgl" / "segments" / "official-ssc-2026-cgl-notice" / "question-candidates.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "aligned"


@dataclass
class AlignmentIssue:
    candidateId: str
    questionNumber: str
    status: str
    candidateAnswer: str | None
    answerKey: str | None


@dataclass
class AlignmentReport:
    generatedAt: str
    answerKeySourceId: str | None
    totalCandidates: int
    matched: int
    mismatched: int
    missing: int
    rankedEligible: bool
    alignedPath: str
    issues: list[AlignmentIssue]
    warnings: list[str]


VALID_OPTIONS = {"a", "b", "c", "d"}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_option(value: object) -> str | None:
    if value is None:
        return None
    text = str(value).strip().lower()
    match = re.search(r"\b([a-d])\b", text)
    return match.group(1) if match else None


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_answer_key(path: Path) -> tuple[str | None, dict[str, dict]]:
    payload = load_json(path)
    if isinstance(payload, list):
        entries = payload
        source_id = None
    else:
        entries = payload.get("answers", [])
        source_id = payload.get("sourceId")
    answer_by_number: dict[str, dict] = {}
    for entry in entries:
        question_number = str(entry.get("questionNumber") or entry.get("question") or "").strip()
        option = normalize_option(entry.get("correctOption") or entry.get("answer"))
        if question_number and option in VALID_OPTIONS:
            answer_by_number[question_number] = {
                "correctOption": option,
                "explanation": entry.get("explanation") or "",
                "raw": entry,
            }
    return source_id, answer_by_number


def align_candidates(candidates: list[dict], answer_by_number: dict[str, dict]) -> tuple[list[dict], list[AlignmentIssue]]:
    aligned: list[dict] = []
    issues: list[AlignmentIssue] = []
    for candidate in candidates:
        item = dict(candidate)
        question_number = str(item.get("questionNumber") or "").strip()
        candidate_answer = normalize_option(item.get("answerKeyCandidate"))
        answer = answer_by_number.get(question_number)
        key_answer = answer.get("correctOption") if answer else None

        item["rankedEligible"] = False
        if not answer:
            item["correctOption"] = None
            item["alignmentStatus"] = "missing_answer_key"
            item["reviewStatus"] = "missing_answer_key"
            issues.append(AlignmentIssue(str(item.get("id")), question_number, "missing_answer_key", candidate_answer, None))
        elif candidate_answer and candidate_answer != key_answer:
            item["correctOption"] = None
            item["alignmentStatus"] = "answer_key_mismatch"
            item["reviewStatus"] = "answer_key_mismatch"
            item["answerKeyExpected"] = key_answer
            issues.append(AlignmentIssue(str(item.get("id")), question_number, "answer_key_mismatch", candidate_answer, key_answer))
        else:
            item["correctOption"] = key_answer
            item["alignmentStatus"] = "matched"
            item["reviewStatus"] = "needs_topic_duplicate_review"
            item["explanation"] = answer.get("explanation") or ""
        aligned.append(item)
    return aligned, issues


def write_outputs(candidates: list[dict], answer_key_source_id: str | None, output_root: Path) -> AlignmentReport:
    output_root.mkdir(parents=True, exist_ok=True)
    aligned_path = output_root / "aligned-candidates.json"
    aligned_path.write_text(json.dumps(candidates, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    matched = sum(1 for item in candidates if item.get("alignmentStatus") == "matched")
    mismatched = sum(1 for item in candidates if item.get("alignmentStatus") == "answer_key_mismatch")
    missing = sum(1 for item in candidates if item.get("alignmentStatus") == "missing_answer_key")
    issues = [
        AlignmentIssue(
            str(item.get("id")),
            str(item.get("questionNumber") or ""),
            str(item.get("alignmentStatus")),
            normalize_option(item.get("answerKeyCandidate")),
            item.get("answerKeyExpected") or item.get("correctOption"),
        )
        for item in candidates
        if item.get("alignmentStatus") != "matched"
    ]
    report = AlignmentReport(
        generatedAt=now_iso(),
        answerKeySourceId=answer_key_source_id,
        totalCandidates=len(candidates),
        matched=matched,
        mismatched=mismatched,
        missing=missing,
        rankedEligible=False,
        alignedPath=str(aligned_path.resolve()),
        issues=issues,
        warnings=[
            "Aligned candidates are still not ranked questions.",
            "Matched answers require topic tagging, duplicate detection, and provenance review.",
            "Mismatched or missing answer keys must remain quarantined.",
        ],
    )
    (output_root / "alignment-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Align SSC CGL review candidates with an answer key.")
    parser.add_argument("--candidates", type=Path, default=DEFAULT_CANDIDATES)
    parser.add_argument("--answer-key", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    if not args.candidates.exists():
        parser.error(f"candidate file not found: {args.candidates}")
    if not args.answer_key.exists():
        parser.error(f"answer key not found: {args.answer_key}")

    candidates = load_json(args.candidates)
    if not isinstance(candidates, list):
        parser.error("candidate file must contain a JSON array")
    answer_key_source_id, answer_by_number = load_answer_key(args.answer_key)
    aligned, _issues = align_candidates(candidates, answer_by_number)
    report = write_outputs(aligned, answer_key_source_id, args.output_root)
    print(f"aligned {report.matched}/{report.totalCandidates}; mismatched {report.mismatched}; missing {report.missing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
