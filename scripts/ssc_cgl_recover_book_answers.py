"""Recover SSC book answers when OCR solutions live outside the question chunk.

The Maths 6800 book stores many questions in one page range and the matching
solution markers in later pages. This stage uses the chapter page index to
match answers by (chapter, question number), then updates aligned candidates
without using global question-number guesses.
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
DEFAULT_DATA_DIR = ROOT / "data" / "exams" / "ssc-cgl"
DEFAULT_SOURCE_ID = "ssc-maths-6800-mcq"
DEFAULT_CHAPTER_INDEX = DEFAULT_DATA_DIR / "book-sources" / "ssc-maths-6800-chapters.json"
DEFAULT_OCR_ROOT = DEFAULT_DATA_DIR / "book-ocr"
DEFAULT_ALIGNED_ROOT = DEFAULT_DATA_DIR / "aligned-mistral"

VALID_OPTIONS = {"a", "b", "c", "d"}
SOLUTION_MARKER = re.compile(
    r"\bSol(?:ution)?\s*[:.]?\s*(\d{1,4})\s*\.?\s*[\(\[]\s*([a-dA-D])\s*[\)\]]",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class ChapterRange:
    slug: str
    title: str
    question_start: int
    question_end: int
    answer_start: int
    answer_end: int


@dataclass
class RecoveredAnswer:
    questionNumber: str
    correctOption: str
    pageNumber: int
    evidenceText: str
    sourceType: str
    chapterSlug: str
    chapterTitle: str


@dataclass
class RecoveryReport:
    generatedAt: str
    sourceId: str
    answerMarkersByChapter: int
    scannedCandidates: int
    recovered: int
    alreadyMatched: int
    stillMissing: int
    chapterUnresolved: int
    filesUpdated: int
    reportPath: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def normalize_markdown_line(value: str) -> str:
    text = re.sub(r"[*_`#]+", "", value or "")
    return re.sub(r"\s+", " ", text).strip()


def normalize_option(value: object) -> str | None:
    option = str(value or "").strip().lower()
    return option if option in VALID_OPTIONS else None


def normalize_question_number(value: object) -> str | None:
    match = re.search(r"\d{1,4}", str(value or ""))
    return str(int(match.group(0))) if match else None


def page_range(raw: dict, key: str, offset: int) -> tuple[int, int]:
    values = raw.get(key)
    if not isinstance(values, list) or len(values) != 2:
        return (0, -1)
    start = int(values[0]) + offset
    end = int(values[1]) + offset
    return (min(start, end), max(start, end))


def load_chapters(path: Path) -> list[ChapterRange]:
    payload = load_json(path)
    offset = int(payload.get("printedToPdfPageOffset") or 0)
    chapters: list[ChapterRange] = []
    for raw in payload.get("chapters", []):
        if not isinstance(raw, dict):
            continue
        question_start, question_end = page_range(raw, "questionPrintedPages", offset)
        answer_key_start, answer_key_end = page_range(raw, "answerKeyPrintedPages", offset)
        solution_start, solution_end = page_range(raw, "solutionPrintedPages", offset)
        answer_start = min(value for value in [answer_key_start, solution_start] if value > 0)
        answer_end = max(answer_key_end, solution_end)
        chapters.append(ChapterRange(
            slug=str(raw.get("slug") or ""),
            title=str(raw.get("title") or raw.get("slug") or ""),
            question_start=question_start,
            question_end=question_end,
            answer_start=answer_start,
            answer_end=answer_end,
        ))
    return [chapter for chapter in chapters if chapter.slug]


def chapter_for_question_page(chapters: list[ChapterRange], page_number: int) -> ChapterRange | None:
    matches = [chapter for chapter in chapters if chapter.question_start <= page_number <= chapter.question_end]
    return matches[0] if matches else None


def chapter_for_answer_page(chapters: list[ChapterRange], page_number: int) -> ChapterRange | None:
    matches = [chapter for chapter in chapters if chapter.answer_start <= page_number <= chapter.answer_end]
    if not matches:
        return None
    matches.sort(key=lambda chapter: (chapter.answer_end - chapter.answer_start, chapter.question_start))
    return matches[0]


def source_from_report_path(path: Path) -> str:
    return re.sub(r"-ocr-range-.*$", "", path.parent.name)


def extract_answers_by_chapter(ocr_root: Path, source_id: str, chapters: list[ChapterRange]) -> dict[tuple[str, str], RecoveredAnswer]:
    answers: dict[tuple[str, str], RecoveredAnswer] = {}
    for report_path in sorted(ocr_root.glob(f"{source_id}*/extraction-report.json")):
        report = load_json(report_path)
        if not isinstance(report, dict):
            continue
        if str(report.get("sourceId") or source_from_report_path(report_path)) != source_id:
            continue
        for page in report.get("pages", []):
            if not isinstance(page, dict):
                continue
            page_number = int(page.get("pageNumber") or 0)
            chapter = chapter_for_answer_page(chapters, page_number)
            if not chapter:
                continue
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
                question_number = normalize_question_number(match.group(1))
                option = normalize_option(match.group(2))
                if not question_number or not option:
                    continue
                answers.setdefault((chapter.slug, question_number), RecoveredAnswer(
                    questionNumber=question_number,
                    correctOption=option,
                    pageNumber=page_number,
                    evidenceText=line[:500],
                    sourceType="mistral_ocr_solution_marker_cross_range",
                    chapterSlug=chapter.slug,
                    chapterTitle=chapter.title,
                ))
    return answers


def extract_forward_answers(ocr_root: Path, source_id: str) -> dict[str, list[RecoveredAnswer]]:
    answers: dict[str, list[RecoveredAnswer]] = {}
    for report_path in sorted(ocr_root.glob(f"{source_id}*/extraction-report.json")):
        report = load_json(report_path)
        if not isinstance(report, dict):
            continue
        if str(report.get("sourceId") or source_from_report_path(report_path)) != source_id:
            continue
        for page in report.get("pages", []):
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
                question_number = normalize_question_number(match.group(1))
                option = normalize_option(match.group(2))
                if not question_number or not option:
                    continue
                answers.setdefault(question_number, []).append(RecoveredAnswer(
                    questionNumber=question_number,
                    correctOption=option,
                    pageNumber=page_number,
                    evidenceText=line[:500],
                    sourceType="mistral_ocr_solution_marker_forward_range",
                    chapterSlug="",
                    chapterTitle="",
                ))
    for answer_rows in answers.values():
        answer_rows.sort(key=lambda answer: answer.pageNumber)
    return answers


def candidate_is_missing_answer(candidate: dict) -> bool:
    status = str(candidate.get("alignmentStatus") or candidate.get("reviewStatus") or "")
    return candidate.get("correctOption") in (None, "") or status in {"missing_answer_key", "answer_key_mismatch"}


def recover_file(
    path: Path,
    chapters: list[ChapterRange],
    answers: dict[tuple[str, str], RecoveredAnswer],
    forward_answers: dict[str, list[RecoveredAnswer]] | None = None,
    page_window: int = 0,
) -> tuple[int, int, int, int, bool]:
    candidates = load_json(path)
    if not isinstance(candidates, list):
        return (0, 0, 0, 0, False)
    recovered = 0
    already_matched = 0
    still_missing = 0
    chapter_unresolved = 0
    changed = False
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        if not candidate_is_missing_answer(candidate):
            already_matched += 1
            continue
        page_number = int(candidate.get("pageNumber") or 0)
        chapter = chapter_for_question_page(chapters, page_number)
        question_number = normalize_question_number(candidate.get("questionNumber"))
        if not chapter or not question_number:
            chapter_unresolved += 1
            continue
        answer = answers.get((chapter.slug, question_number))
        if not answer and forward_answers and page_window > 0:
            forward_matches = [
                forward_answer for forward_answer in forward_answers.get(question_number, [])
                if page_number <= forward_answer.pageNumber <= page_number + page_window
            ]
            if len(forward_matches) == 1:
                answer = forward_matches[0]
        if not answer:
            still_missing += 1
            candidate["chapterSlug"] = chapter.slug
            candidate["chapterTitle"] = chapter.title
            provenance = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
            provenance["chapterSlug"] = chapter.slug
            provenance["chapterTitle"] = chapter.title
            candidate["provenance"] = provenance
            changed = True
            continue
        candidate["chapterSlug"] = chapter.slug
        candidate["chapterTitle"] = chapter.title
        candidate["correctOption"] = answer.correctOption
        candidate["answerKeyCandidate"] = answer.correctOption
        candidate["alignmentStatus"] = "matched"
        candidate["reviewStatus"] = "needs_topic_duplicate_review"
        candidate["answerEvidence"] = asdict(answer)
        provenance = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
        provenance["chapterSlug"] = chapter.slug
        provenance["chapterTitle"] = chapter.title
        candidate["provenance"] = provenance
        recovered += 1
        changed = True
    if changed:
        write_json(path, candidates)
    return (len([item for item in candidates if isinstance(item, dict)]), recovered, already_matched, still_missing + chapter_unresolved, changed)


def recover_file_forward(path: Path, answers: dict[str, list[RecoveredAnswer]], page_window: int) -> tuple[int, int, int, int, bool]:
    candidates = load_json(path)
    if not isinstance(candidates, list):
        return (0, 0, 0, 0, False)
    recovered = 0
    already_matched = 0
    still_missing = 0
    changed = False
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        if not candidate_is_missing_answer(candidate):
            already_matched += 1
            continue
        page_number = int(candidate.get("pageNumber") or 0)
        question_number = normalize_question_number(candidate.get("questionNumber"))
        if not question_number:
            still_missing += 1
            continue
        matches = [
            answer for answer in answers.get(question_number, [])
            if page_number <= answer.pageNumber <= page_number + page_window
        ]
        if len(matches) != 1:
            still_missing += 1
            continue
        answer = matches[0]
        candidate["correctOption"] = answer.correctOption
        candidate["answerKeyCandidate"] = answer.correctOption
        candidate["alignmentStatus"] = "matched"
        candidate["reviewStatus"] = "needs_topic_duplicate_review"
        candidate["answerEvidence"] = asdict(answer)
        recovered += 1
        changed = True
    if changed:
        write_json(path, candidates)
    return (len([item for item in candidates if isinstance(item, dict)]), recovered, already_matched, still_missing, changed)


def recover_answers(source_id: str, chapter_index: Path, ocr_root: Path, aligned_root: Path, page_window: int = 0) -> RecoveryReport:
    chapters = load_chapters(chapter_index)
    answers = extract_answers_by_chapter(ocr_root, source_id, chapters)
    forward_answers = extract_forward_answers(ocr_root, source_id) if page_window > 0 else None
    scanned = 0
    recovered = 0
    already_matched = 0
    unresolved = 0
    files_updated = 0
    source_aligned_root = aligned_root / source_id
    for path in sorted(source_aligned_root.glob("**/aligned-candidates.json")):
        file_scanned, file_recovered, file_already, file_unresolved, changed = recover_file(
            path,
            chapters,
            answers,
            forward_answers=forward_answers,
            page_window=page_window,
        )
        scanned += file_scanned
        recovered += file_recovered
        already_matched += file_already
        unresolved += file_unresolved
        if changed:
            files_updated += 1
    report_path = source_aligned_root / "cross-range-answer-recovery-report.json"
    report = RecoveryReport(
        generatedAt=now_iso(),
        sourceId=source_id,
        answerMarkersByChapter=len(answers),
        scannedCandidates=scanned,
        recovered=recovered,
        alreadyMatched=already_matched,
        stillMissing=unresolved,
        chapterUnresolved=0,
        filesUpdated=files_updated,
        reportPath=str(report_path.resolve()),
        warnings=[
            "Recovered answers are matched only by chapter page range and question number.",
            *((
                f"Rows still missing after chapter recovery may use same-source forward solution markers within {page_window} pages."
            ,) if page_window > 0 else ()),
            "This does not invent answers and does not bypass exact-copy-only duplicate policy.",
        ],
    )
    write_json(report_path, asdict(report))
    return report


def recover_answers_forward(source_id: str, ocr_root: Path, aligned_root: Path, page_window: int) -> RecoveryReport:
    answers = extract_forward_answers(ocr_root, source_id)
    scanned = 0
    recovered = 0
    already_matched = 0
    unresolved = 0
    files_updated = 0
    source_aligned_root = aligned_root / source_id
    for path in sorted(source_aligned_root.glob("**/aligned-candidates.json")):
        file_scanned, file_recovered, file_already, file_unresolved, changed = recover_file_forward(path, answers, page_window)
        scanned += file_scanned
        recovered += file_recovered
        already_matched += file_already
        unresolved += file_unresolved
        if changed:
            files_updated += 1
    report_path = source_aligned_root / "forward-range-answer-recovery-report.json"
    report = RecoveryReport(
        generatedAt=now_iso(),
        sourceId=source_id,
        answerMarkersByChapter=sum(len(rows) for rows in answers.values()),
        scannedCandidates=scanned,
        recovered=recovered,
        alreadyMatched=already_matched,
        stillMissing=unresolved,
        chapterUnresolved=0,
        filesUpdated=files_updated,
        reportPath=str(report_path.resolve()),
        warnings=[
            f"Recovered answers are matched only by same source, same question number, and answer page within {page_window} pages after the question page.",
            "This does not invent answers and does not bypass exact-copy-only duplicate policy.",
        ],
    )
    write_json(report_path, asdict(report))
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Recover cross-range SSC book answer markers by chapter.")
    parser.add_argument("--source-id", default=DEFAULT_SOURCE_ID)
    parser.add_argument("--chapter-index", type=Path)
    parser.add_argument("--no-chapter-index", action="store_true", help="Use forward answer matching only, even for sources with a default chapter index.")
    parser.add_argument("--ocr-root", type=Path, default=DEFAULT_OCR_ROOT)
    parser.add_argument("--aligned-root", type=Path, default=DEFAULT_ALIGNED_ROOT)
    parser.add_argument("--sequential-page-window", type=int, default=0)
    args = parser.parse_args()

    if not args.ocr_root.exists():
        parser.error(f"OCR root not found: {args.ocr_root}")
    if not (args.aligned_root / args.source_id).exists():
        parser.error(f"aligned source root not found: {args.aligned_root / args.source_id}")

    chapter_index = None if args.no_chapter_index else args.chapter_index
    if chapter_index is None and not args.no_chapter_index and args.source_id == DEFAULT_SOURCE_ID and DEFAULT_CHAPTER_INDEX.exists():
        chapter_index = DEFAULT_CHAPTER_INDEX
    if chapter_index is not None:
        if not chapter_index.exists():
            parser.error(f"chapter index not found: {chapter_index}")
        report = recover_answers(args.source_id, chapter_index, args.ocr_root, args.aligned_root, args.sequential_page_window)
    else:
        if args.sequential_page_window <= 0:
            parser.error("--sequential-page-window is required when --chapter-index is not provided")
        report = recover_answers_forward(args.source_id, args.ocr_root, args.aligned_root, args.sequential_page_window)
    print(
        f"recovered {report.recovered}/{report.scannedCandidates}; "
        f"answer markers {report.answerMarkersByChapter}; "
        f"already matched {report.alreadyMatched}; still missing {report.stillMissing}; "
        f"files updated {report.filesUpdated}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
