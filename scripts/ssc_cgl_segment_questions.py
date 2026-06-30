"""Segment extracted SSC CGL page text into review-only MCQ candidates.

This script does not create ranked questions. It prepares candidate MCQs for
manual answer-key, topic, duplicate, and provenance review.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review" / "official-ssc-2026-cgl-notice" / "extraction-report.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "segments"


@dataclass
class CandidateOption:
    id: str
    text: str


@dataclass
class QuestionCandidate:
    id: str
    sourceId: str
    sourceType: str
    sourceUrl: str | None
    chapterSlug: str | None
    chapterTitle: str | None
    pageNumber: int
    questionNumber: str
    stem: str
    options: list[CandidateOption]
    answerKeyCandidate: str | None
    reviewStatus: str
    rankedEligible: bool
    provenance: dict
    rawTextSha1: str


@dataclass
class SegmentationReport:
    sourceId: str
    sourceType: str
    sourceUrl: str | None
    generatedAt: str
    pageCount: int
    pagesScanned: int
    candidateCount: int
    reviewStatus: str
    rankedEligible: bool
    outputPath: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def normalize_text(value: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", value or "")).strip()


def raw_sha1(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()


QUESTION_START = re.compile(r"(?im)^\s*(?:[-*]\s*)?(?:\*\*)?\s*(?:Q(?:uestion)?\.?\s*)?(?:No\.?\s*[:.-]?\s*)?(\d{1,3})[\).:]?\s*(?:\*\*)?\.?\s+(.+)")
BOOK_QUESTION_START = re.compile(
    r"(?im)(?<!\w)(?:[-*][ \t]*)?(?:\*\*)?[ \t]*Q\.?[ \t]*(\d{1,4})(?:[\).])?[ \t]*(?:\*\*)?\.?[ \t]*(.*?)(?=\s+(?:[-*][ \t]*)?(?:\*\*)?[ \t]*Q\.?[ \t]*\d{1,4}(?:[\).])?|$)"
)
CLOZE_SET_START = re.compile(r"(?im)^\s*(?:#+\s*)?(?:\*\*)?\s*SET\s+\d+\.?\s*(?:Q\s*\(\s*(\d{1,4})\s*[-–]\s*(\d{1,4})\s*\))?.*$")
CLOZE_NUMBERED_OPTION = re.compile(r"(?<!\d)(\d{1,4})\.\s*(?=\(?a\))", re.IGNORECASE)
SAVED_PAPER_QUESTION_START = re.compile(r"(?im)^\s*(?:[-*]\s*)?(?:\*\*)?\s*Q\.?\s*No\.?\s*[:.-]?\s*(\d{1,3})[\).:]?\s*(?:\*\*)?\.?\s+(.+)")
CRACKU_QUESTION_START = re.compile(r"(?im)^\s*SSC\s+CGL\b.+?\bQuestion\s+(\d{1,3})\s*$")
OPTION_LINE = re.compile(r"(?im)^\s*[\(\[]?([a-dA-D])[\)\].]\s+(.+)")
INLINE_OPTION_MARKER = re.compile(r"(?i)(?<!\w)[\(\[]([a-d])[\)\].]\s*")
ANSWER_LINE = re.compile(r"(?im)^\s*(?:Answer|Ans\.?|Correct\s+Answer)\s*[:\-]?\s*([a-dA-D])\b")
SOLUTION_ANSWER_LINE = re.compile(r"(?im)^\s*(?:[-*]\s*)?(?:\*\*)?\s*Sol\.?\s*\d{1,4}\.?\s*[\(\[]([a-dA-D])[\)\]]")
SOLUTION_HEADER_LINE = re.compile(r"(?im)^\s*(?:#+\s*)?(?:\*\*)?\s*Solution\s*[:-]")
SAVED_PAPER_NOISE = re.compile(
    r"^(?:Click Here|Exam Level|Test Date|Test Time|Correct Option|Save / Print|Not Answered|Not Attempted|PART-[A-D]|SSC\b|I acknowledge|The candidates may note|#|\*\*|\[tbl-\d+\.md\]|!\[img-\d+\.)",
    flags=re.IGNORECASE,
)
PAGE_MARKER_LINE = re.compile(r"(?im)^\s*\[\[SSC_PAGE_START:\d+\]\]\s*$")
IMAGE_MARKDOWN = re.compile(r"!\[[^\]]*\]\([^)]+\)")
OPTION_LABEL_LINE = re.compile(r"^\s*[\(\[]([a-dA-D])[\)\]]\s*$")
FIGURE_OPTION_HINT = re.compile(r"\b(?:figure|embedded|paper\s+fold|mirror|water\s+image|cube|dice|transparent\s+sheet)\b", re.IGNORECASE)
BOOK_NOISE_LINE = re.compile(
    r"^(?:Pinnacle|TG\s*@|Search on TG|Day:\s*|#\s*Practice Questions|Practice Questions)$",
    flags=re.IGNORECASE,
)


def iter_blocks(text: str, source_type: str | None = None) -> list[tuple[str, str, int]]:
    if source_type == "book_user_provided":
        pattern = BOOK_QUESTION_START
    elif CRACKU_QUESTION_START.search(text):
        pattern = CRACKU_QUESTION_START
    elif re.search(r"(?im)^\s*Q\.?\s*No\.?\s*[:.-]?\s*\d+", text):
        pattern = SAVED_PAPER_QUESTION_START
    else:
        pattern = QUESTION_START
    matches = list(pattern.finditer(text))
    blocks: list[tuple[str, str, int]] = []
    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = normalize_text(text[start:end])
        if block:
            blocks.append((match.group(1), block, match.start(1)))
    return blocks


def split_blocks(text: str) -> list[tuple[str, str]]:
    return [(question_number, block) for question_number, block, _start in iter_blocks(text)]


def parse_candidate(
    block: str,
    question_number: str,
    source_id: str,
    source_type: str,
    source_url: str | None,
    chapter_slug: str | None,
    chapter_title: str | None,
    page_number: int,
) -> QuestionCandidate | None:
    block = normalize_text(PAGE_MARKER_LINE.sub("", block))
    cracku_start_match = CRACKU_QUESTION_START.search(block)
    if cracku_start_match:
        stem, options = parse_cracku_html_options(block, cracku_start_match)
        start_match = cracku_start_match
    else:
        start_match = BOOK_QUESTION_START.search(block) if source_type == "book_user_provided" else QUESTION_START.search(block)
        if not start_match:
            return None
        options = [CandidateOption(match.group(1).lower(), normalize_text(match.group(2))) for match in OPTION_LINE.finditer(block)]
        option_ids = {option.id for option in options}

        if len(options) == 4 and option_ids == {"a", "b", "c", "d"}:
            first_option = OPTION_LINE.search(block)
            if not first_option:
                return None
            stem = normalize_text(block[start_match.end(1):first_option.start()])
            stem = re.sub(r"^[\).]?\s*", "", stem).strip()
            if (len(stem) < 8 or is_image_only_text(stem)) and IMAGE_MARKDOWN.search(block):
                stem, options = parse_image_heavy_book_question(block, start_match)
        else:
            stem, options = parse_inline_labeled_options(block, start_match)
            if (len(stem) < 8 or is_image_only_text(stem)) and IMAGE_MARKDOWN.search(block):
                stem, options = parse_image_heavy_book_question(block, start_match)
            if has_empty_or_label_only_options(options):
                stem, options = "", []
            if len(options) != 4:
                stem, options = parse_saved_paper_unlabeled_options(block, start_match)
            if has_empty_or_label_only_options(options):
                stem, options = "", []
            if len(options) != 4:
                stem, options = parse_image_heavy_book_question(block, start_match)
            if len(options) != 4:
                return None

    if len(options) != 4 or any(len(option.text) < 1 for option in options):
        return None
    if len(stem) < 8:
        return None

    answer_match = ANSWER_LINE.search(block) or SOLUTION_ANSWER_LINE.search(block)
    answer = answer_match.group(1).lower() if answer_match else None
    candidate_hash = raw_sha1(f"{source_id}|{page_number}|{question_number}|{stem}")[:14]
    return QuestionCandidate(
        id=f"seg-{safe_slug(source_id)}-p{page_number:03d}-q{question_number}-{candidate_hash}",
        sourceId=source_id,
        sourceType=source_type,
        sourceUrl=source_url,
        chapterSlug=chapter_slug,
        chapterTitle=chapter_title,
        pageNumber=page_number,
        questionNumber=question_number,
        stem=stem,
        options=options,
        answerKeyCandidate=answer,
        reviewStatus="needs_answer_key_review",
        rankedEligible=False,
        provenance={
            "sourceId": source_id,
            "sourceType": source_type,
            "url": source_url,
            "chapterSlug": chapter_slug,
            "chapterTitle": chapter_title,
            "pageNumber": page_number,
            "requiresManualReview": True,
        },
        rawTextSha1=raw_sha1(block),
    )


def parse_cracku_html_options(block: str, start_match: re.Match[str]) -> tuple[str, list[CandidateOption]]:
    lines = [
        normalize_text(line)
        for line in block[start_match.end():].splitlines()
        if normalize_text(line)
    ]
    filtered = [
        line
        for line in lines
        if line.lower() not in {"report", "view solution"}
        and not ANSWER_LINE.match(line)
    ]
    label_indices = [
        index
        for index, line in enumerate(filtered)
        if line in {"A", "B", "C", "D"}
    ]
    if len(label_indices) < 4:
        return "", []

    first_run: list[int] | None = None
    for index in range(0, len(label_indices) - 3):
        labels = [filtered[label_indices[index + offset]] for offset in range(4)]
        if labels == ["A", "B", "C", "D"]:
            first_run = label_indices[index:index + 4]
            break
    if first_run is None:
        return "", []

    stem_lines = filtered[:first_run[0]]
    option_texts: list[str] = []
    for option_index, start in enumerate(first_run):
        end = first_run[option_index + 1] if option_index + 1 < len(first_run) else len(filtered)
        option_texts.append(normalize_text("\n".join(filtered[start + 1:end])))

    options = [
        CandidateOption(option_id, option_text)
        for option_id, option_text in zip(["a", "b", "c", "d"], option_texts)
    ]
    return normalize_text("\n".join(stem_lines)), options


def parse_inline_labeled_options(block: str, start_match: re.Match[str]) -> tuple[str, list[CandidateOption]]:
    markers = list(INLINE_OPTION_MARKER.finditer(block))
    if len(markers) < 4:
        return "", []

    option_run: list[re.Match[str]] | None = None
    for index in range(0, len(markers) - 3):
        labels = [markers[index + offset].group(1).lower() for offset in range(4)]
        if labels == ["a", "b", "c", "d"]:
            option_run = markers[index:index + 4]
            break
    if option_run is None:
        return "", []

    first_option = option_run[0]
    stem = normalize_text("\n".join([
        start_match.group(2),
        block[start_match.end():first_option.start()],
    ]))
    stem = re.sub(r"^[\).]?\s*", "", stem).strip()
    option_texts: list[str] = []
    for option_index, marker in enumerate(option_run):
        end = option_run[option_index + 1].start() if option_index + 1 < len(option_run) else len(block)
        option_texts.append(strip_answer_tail(block[marker.end():end]))

    options = [
        CandidateOption(option_id, option_text)
        for option_id, option_text in zip(["a", "b", "c", "d"], option_texts)
    ]
    return stem, options


def strip_answer_tail(value: str) -> str:
    answer_match = ANSWER_LINE.search(value) or SOLUTION_ANSWER_LINE.search(value) or SOLUTION_HEADER_LINE.search(value)
    if answer_match:
        value = value[:answer_match.start()]
    value = re.sub(r"(?:\n\s*[-*]\s*)+$", "", value)
    return normalize_text(value)


def dedupe_consecutive_lines(lines: list[str]) -> list[str]:
    deduped: list[str] = []
    for line in lines:
        if not deduped or deduped[-1] != line:
            deduped.append(line)
    return deduped


def parse_saved_paper_unlabeled_options(block: str, start_match: re.Match[str]) -> tuple[str, list[CandidateOption]]:
    first_line = normalize_text(start_match.group(2))
    tail = block[start_match.end():]
    raw_lines = [normalize_text(line) for line in tail.splitlines()]
    lines = [
        line
        for line in raw_lines
        if line
        and not ANSWER_LINE.match(line)
        and not SAVED_PAPER_QUESTION_START.match(line)
        and not SAVED_PAPER_NOISE.match(line)
    ]
    deduped = dedupe_consecutive_lines(lines)
    if len(deduped) < 4:
        return first_line, []

    has_numbered_stem_lines = any(re.match(r"^\d{1,2}\.\s+", line) for line in deduped[:-4])
    if len(deduped) >= 8 and not has_numbered_stem_lines:
        option_texts = [
            normalize_text("\n".join(deduped[index:index + 2]))
            for index in range(len(deduped) - 8, len(deduped), 2)
        ]
        stem_lines = [first_line, *deduped[:-8]]
    else:
        option_texts = deduped[-4:]
        stem_lines = [first_line, *deduped[:-4]]
    options = [
        CandidateOption(option_id, option_text)
        for option_id, option_text in zip(["a", "b", "c", "d"], option_texts)
    ]
    return normalize_text("\n".join(stem_lines)), options


def clean_book_line(line: str) -> str:
    line = normalize_text(line)
    if not line or BOOK_NOISE_LINE.match(line):
        return ""
    return line


def is_image_only_text(value: str) -> bool:
    if not IMAGE_MARKDOWN.search(value):
        return False
    remainder = IMAGE_MARKDOWN.sub("", value)
    remainder = re.sub(r"(?:\(?\bX\b\)?|#+)", "", remainder, flags=re.IGNORECASE)
    return not normalize_text(remainder)


def parse_image_heavy_book_question(block: str, start_match: re.Match[str]) -> tuple[str, list[CandidateOption]]:
    first_line = normalize_text(start_match.group(2))
    tail = block[start_match.end():]
    lines = [clean_book_line(line) for line in [first_line, *tail.splitlines()]]
    lines = [line for line in lines if line and not PAGE_MARKER_LINE.match(line)]
    has_image = any(IMAGE_MARKDOWN.search(line) for line in lines)
    has_figure_hint = FIGURE_OPTION_HINT.search("\n".join([first_line, *lines])) is not None

    label_rows: list[tuple[str, int]] = []
    for index, line in enumerate(lines):
        match = OPTION_LABEL_LINE.match(line)
        if match:
            label_rows.append((match.group(1).lower(), index))
    has_label_only_option_block = len(label_rows) >= 2 and all(
        OPTION_LABEL_LINE.match(line) or line in {"(X)", "X"}
        for line in lines
    )
    if not has_image and not has_figure_hint and not has_label_only_option_block:
        return "", []

    option_text_by_id: dict[str, str] = {}
    first_label_index: int | None = None
    for option_id in ["a", "b", "c", "d"]:
        row = next(((label, index) for label, index in label_rows if label == option_id), None)
        if not row:
            continue
        _label, index = row
        first_label_index = index if first_label_index is None else min(first_label_index, index)
        next_indices = [next_index for _next_label, next_index in label_rows if next_index > index]
        end = min(next_indices) if next_indices else len(lines)
        body = [
            line for line in lines[index + 1:end]
            if not OPTION_LABEL_LINE.match(line)
        ]
        option_text_by_id[option_id] = normalize_text("\n".join(body)) or f"Option {option_id.upper()} (see figure)"

    if len(option_text_by_id) != 4:
        option_text_by_id = {option_id: f"Option {option_id.upper()} (see figure)" for option_id in ["a", "b", "c", "d"]}
        stem_lines = lines
    else:
        stem_lines = lines[:first_label_index or 0]
        if not stem_lines:
            stem_lines = [line for line in lines if IMAGE_MARKDOWN.search(line)]

    stem_parts = [first_line, *stem_lines]
    stem = normalize_text("\n".join(part for part in stem_parts if part))
    stem_has_only_images = is_image_only_text(stem)
    if (len(stem) < 8 or stem_has_only_images) and IMAGE_MARKDOWN.search(block):
        stem = normalize_text("\n".join(["Select the correct option from the figure.", *stem_lines]))
    if len(stem) < 8 and has_label_only_option_block:
        stem = "Non-verbal figure question preserved from OCR label-only block."
    options = [
        CandidateOption(option_id, option_text_by_id[option_id])
        for option_id in ["a", "b", "c", "d"]
    ]
    return stem, options


def has_empty_or_label_only_options(options: list[CandidateOption]) -> bool:
    if len(options) != 4:
        return False
    return any(
        not option.text.strip() or OPTION_LABEL_LINE.match(option.text.strip())
        for option in options
    )


def parse_cloze_option_row(row: str) -> list[CandidateOption]:
    markers = list(INLINE_OPTION_MARKER.finditer(row))
    if len(markers) < 4:
        return []
    option_run: list[re.Match[str]] | None = None
    for index in range(0, len(markers) - 3):
        labels = [markers[index + offset].group(1).lower() for offset in range(4)]
        if labels == ["a", "b", "c", "d"]:
            option_run = markers[index:index + 4]
            break
    if option_run is None:
        return []
    options: list[CandidateOption] = []
    for option_index, marker in enumerate(option_run):
        end = option_run[option_index + 1].start() if option_index + 1 < len(option_run) else len(row)
        option_text = strip_answer_tail(row[marker.end():end])
        options.append(CandidateOption(marker.group(1).lower(), option_text))
    if len(options) != 4 or any(not option.text for option in options):
        return []
    return options


def parse_cloze_book_candidates(
    text: str,
    source_id: str,
    source_type: str,
    source_url: str | None,
    chapter_slug: str | None,
    chapter_title: str | None,
    page_spans: list[tuple[int, int, int]],
) -> list[QuestionCandidate]:
    if source_type != "book_user_provided":
        return []

    set_matches = list(CLOZE_SET_START.finditer(text))
    candidates: list[QuestionCandidate] = []
    for set_index, set_match in enumerate(set_matches):
        set_start = set_match.start()
        next_set_start = set_matches[set_index + 1].start() if set_index + 1 < len(set_matches) else len(text)
        set_block = text[set_start:next_set_start]
        solution_match = re.search(r"(?im)^\s*(?:#+\s*)?(?:\*\*)?\s*Solution\s*[:-]", set_block)
        if solution_match:
            set_block = set_block[:solution_match.start()]
        option_matches = list(CLOZE_NUMBERED_OPTION.finditer(set_block))
        if not option_matches:
            continue

        passage = normalize_text(set_block[set_match.end() - set_start:option_matches[0].start()])
        if len(passage) < 20 or "____" not in passage:
            continue

        for option_index, option_match in enumerate(option_matches):
            question_number = option_match.group(1)
            row_end = option_matches[option_index + 1].start() if option_index + 1 < len(option_matches) else len(set_block)
            row = normalize_text(set_block[option_match.start():row_end])
            next_set_inside_row = CLOZE_SET_START.search(row[1:])
            if next_set_inside_row:
                row = row[:next_set_inside_row.start() + 1]
            row = re.sub(r"^\s*\d{1,4}\.\s*", "", row)
            options = parse_cloze_option_row(row)
            if len(options) != 4:
                continue
            absolute_start = set_start + option_match.start()
            page_number = next((number for start, end, number in page_spans if start <= absolute_start < end), 0)
            stem = normalize_text(f"Blank {question_number} in the cloze passage:\n{passage}")
            candidate_hash = raw_sha1(f"{source_id}|{page_number}|{question_number}|{stem}")[:14]
            candidates.append(QuestionCandidate(
                id=f"seg-{safe_slug(source_id)}-p{page_number:03d}-q{question_number}-{candidate_hash}",
                sourceId=source_id,
                sourceType=source_type,
                sourceUrl=source_url,
                chapterSlug=chapter_slug,
                chapterTitle=chapter_title,
                pageNumber=page_number,
                questionNumber=question_number,
                stem=stem,
                options=options,
                answerKeyCandidate=None,
                reviewStatus="needs_answer_key_review",
                rankedEligible=False,
                provenance={
                    "sourceId": source_id,
                    "sourceType": source_type,
                    "url": source_url,
                    "chapterSlug": chapter_slug,
                    "chapterTitle": chapter_title,
                    "pageNumber": page_number,
                    "requiresManualReview": True,
                },
                rawTextSha1=raw_sha1(row),
            ))
    return candidates


def segment_pages(extraction_report: dict) -> list[QuestionCandidate]:
    source_id = str(extraction_report.get("sourceId") or "unknown-source")
    source_type = str(extraction_report.get("sourceType") or "web_pdf_unverified")
    source_url = extraction_report.get("sourceUrl")
    chapter_slug = extraction_report.get("chapterSlug")
    chapter_title = extraction_report.get("chapterTitle")
    candidates: list[QuestionCandidate] = []
    combined_parts: list[str] = []
    page_spans: list[tuple[int, int, int]] = []
    cursor = 0
    for page in extraction_report.get("pages", []):
        text_path = Path(str(page.get("textPath") or ""))
        if not text_path.exists():
            continue
        page_number = int(page.get("pageNumber") or 0)
        text = text_path.read_text(encoding="utf-8", errors="ignore")
        marker = f"\n\n[[SSC_PAGE_START:{page_number}]]\n\n"
        combined_parts.append(marker)
        cursor += len(marker)
        start = cursor
        combined_parts.append(text)
        cursor += len(text)
        page_spans.append((start, cursor, page_number))
    combined_text = "".join(combined_parts)
    seen_ids: set[str] = set()
    for question_number, block, start_offset in iter_blocks(combined_text, source_type):
        page_number = next((number for start, end, number in page_spans if start <= start_offset < end), 0)
        candidate = parse_candidate(block, question_number, source_id, source_type, source_url, chapter_slug, chapter_title, page_number)
        if candidate and candidate.id not in seen_ids:
            candidates.append(candidate)
            seen_ids.add(candidate.id)
    for candidate in parse_cloze_book_candidates(combined_text, source_id, source_type, source_url, chapter_slug, chapter_title, page_spans):
        if candidate.id not in seen_ids:
            candidates.append(candidate)
            seen_ids.add(candidate.id)
    return candidates


def source_output_root(output_root: Path, extraction_report: dict, source_id: str) -> Path:
    source_root = output_root / safe_slug(source_id)
    chapter_slug = extraction_report.get("chapterSlug")
    start_page = extraction_report.get("startPage")
    end_page = extraction_report.get("endPage")
    if chapter_slug and start_page and end_page:
        return source_root / f"{safe_slug(str(chapter_slug))}-p{int(start_page):03d}-p{int(end_page):03d}"
    return source_root


def write_outputs(extraction_report: dict, candidates: list[QuestionCandidate], output_root: Path) -> SegmentationReport:
    source_id = str(extraction_report.get("sourceId") or "unknown-source")
    source_type = str(extraction_report.get("sourceType") or "web_pdf_unverified")
    source_url = extraction_report.get("sourceUrl")
    source_root = source_output_root(output_root, extraction_report, source_id)
    source_root.mkdir(parents=True, exist_ok=True)
    candidates_path = source_root / "question-candidates.json"
    candidates_path.write_text(json.dumps([asdict(candidate) for candidate in candidates], indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report = SegmentationReport(
        sourceId=source_id,
        sourceType=source_type,
        sourceUrl=source_url,
        generatedAt=now_iso(),
        pageCount=int(extraction_report.get("pageCount") or len(extraction_report.get("pages", []))),
        pagesScanned=len(extraction_report.get("pages", [])),
        candidateCount=len(candidates),
        reviewStatus="needs_answer_key_review" if candidates else "no_mcq_candidates_found",
        rankedEligible=False,
        outputPath=str(candidates_path.resolve()),
        warnings=[
            "Segmented candidates are not ranked questions.",
            "Every candidate requires answer-key, topic, duplicate, and provenance review.",
            "Do not publish or use in timed ranked tests until reviewStatus becomes reviewed in a separate curated dataset.",
        ],
    )
    (source_root / "segmentation-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Segment extracted SSC CGL page text into review-only MCQ candidates.")
    parser.add_argument("--extraction-report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    if not args.extraction_report.exists():
        parser.error(f"extraction report not found: {args.extraction_report}")
    extraction_report = json.loads(args.extraction_report.read_text(encoding="utf-8"))
    candidates = segment_pages(extraction_report)
    report = write_outputs(extraction_report, candidates, args.output_root)
    print(f"wrote {report.candidateCount} review-only question candidates for {report.sourceId}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
