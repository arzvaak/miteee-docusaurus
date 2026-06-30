"""Extract selected uploaded SSC book pages into review-only artifacts.

This stage is for user-provided books that now drive the SSC CGL corpus. It
keeps extraction chapter-sized, preserves page provenance, and never promotes
questions into ranked tests.
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
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "manifest.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "book-review"


@dataclass
class BookPageExtraction:
    pageNumber: int
    textPath: str
    charCount: int
    questionSignals: int
    extractionMethod: str


@dataclass
class BookExtractionReport:
    sourceId: str
    sourceType: str
    sourceFile: str
    sourceUrl: str | None
    title: str
    role: str
    section: str | None
    chapterSlug: str
    chapterTitle: str
    sha256: str
    extractedAt: str
    sourcePageCount: int
    startPage: int
    endPage: int
    pageCount: int
    extractionStatus: str
    reviewStatus: str
    rankedEligible: bool
    ocrRequired: bool
    ocrModel: str
    includeImages: bool
    questionSignals: int
    pages: list[BookPageExtraction]
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def normalize_text(value: str) -> str:
    normalized = re.sub(r"\r\n?", "\n", value or "")
    normalized = re.sub(r"[ \t]+", " ", normalized)
    return normalized.strip()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def count_question_signals(text: str) -> int:
    patterns = [
        r"\bQ\.?\s*\d{1,4}\s*[\).]",
        r"\bQ(?:uestion)?\.?\s*\d{1,4}",
        r"^\s*\d{1,4}\s*[\).]",
        r"\([a-dA-D]\)",
        r"\bAnswer\s*Key\b",
    ]
    return sum(len(re.findall(pattern, text, flags=re.IGNORECASE | re.MULTILINE)) for pattern in patterns)


def read_manifest(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def find_source(manifest: dict[str, Any], source_id: str) -> dict[str, Any]:
    for source in manifest.get("sources", []):
        if source.get("id") == source_id:
            return source
    raise ValueError(f"source id not found in book manifest: {source_id}")


def split_plain_text_fixture(source_file: Path) -> list[str]:
    return [normalize_text(page) for page in source_file.read_text(encoding="utf-8", errors="ignore").split("\f")]


def extract_pdf_range(source_file: Path, start_page: int, end_page: int) -> tuple[int, list[str]]:
    try:
        from pypdf import PdfReader  # type: ignore
    except Exception as exc:
        raise RuntimeError("pypdf is required for uploaded-book extraction; install requirements-ssc.txt") from exc

    reader = PdfReader(str(source_file))
    total_pages = len(reader.pages)
    texts: list[str] = []
    for page_number in range(start_page, end_page + 1):
        try:
            texts.append(normalize_text(reader.pages[page_number - 1].extract_text() or ""))
        except Exception:
            texts.append("")
    return total_pages, texts


def validate_range(start_page: int, end_page: int, page_count: int) -> None:
    if start_page < 1:
        raise ValueError("--start-page must be 1 or greater")
    if end_page < start_page:
        raise ValueError("--end-page must be greater than or equal to --start-page")
    if end_page > page_count:
        raise ValueError(f"page range {start_page}-{end_page} exceeds source page count {page_count}")


def build_report(
    manifest_path: Path,
    source_id: str,
    chapter_slug: str,
    chapter_title: str,
    start_page: int,
    end_page: int,
    output_root: Path,
    allow_plain_text_fixture: bool = False,
) -> BookExtractionReport:
    manifest = read_manifest(manifest_path)
    corpus_policy = manifest.get("corpusPolicy", {})
    source = find_source(manifest, source_id)
    if source.get("sourceType") != "book_user_provided":
        raise ValueError("book extraction only accepts book_user_provided sources")

    source_file = Path(str(source.get("file") or ""))
    if not source_file.exists():
        raise FileNotFoundError(f"book source file not found: {source_file}")

    if allow_plain_text_fixture:
        all_pages = split_plain_text_fixture(source_file)
        source_page_count = len(all_pages)
        validate_range(start_page, end_page, source_page_count)
        selected_texts = all_pages[start_page - 1:end_page]
        extraction_method = "plain_text_fixture"
    else:
        source_page_count = int(source.get("pageCount") or 0)
        if source_page_count:
            validate_range(start_page, end_page, source_page_count)
        source_page_count, selected_texts = extract_pdf_range(source_file, start_page, end_page)
        validate_range(start_page, end_page, source_page_count)
        extraction_method = "pypdf_book_text"

    slug = safe_slug(chapter_slug)
    source_root = output_root / safe_slug(source_id) / f"{slug}-p{start_page:03d}-p{end_page:03d}"
    pages_root = source_root / "pages"
    pages_root.mkdir(parents=True, exist_ok=True)

    page_reports: list[BookPageExtraction] = []
    total_question_signals = 0
    nonempty_pages = 0
    for offset, text in enumerate(selected_texts):
        page_number = start_page + offset
        if text:
            nonempty_pages += 1
        signals = count_question_signals(text)
        total_question_signals += signals
        text_path = pages_root / f"page-{page_number:03d}.txt"
        text_path.write_text(text + ("\n" if text else ""), encoding="utf-8")
        page_reports.append(BookPageExtraction(
            pageNumber=page_number,
            textPath=str(text_path.resolve()),
            charCount=len(text),
            questionSignals=signals,
            extractionMethod=extraction_method,
        ))

    ocr_model = str(source.get("ocrModel") or corpus_policy.get("ocrModel") or "mistral-ocr-latest")
    include_images = bool(source.get("includeImages", corpus_policy.get("includeImages", True)))
    ocr_required = nonempty_pages == 0
    warnings = [
        "Uploaded-book extraction is review-only and cannot enter ranked tests directly.",
        "Agent answer-key, duplicate, topic, and provenance review must pass before promotion.",
    ]
    if ocr_required:
        warnings.append(f"No embedded text was extracted; queue this range for {ocr_model} OCR with includeImages=true.")

    return BookExtractionReport(
        sourceId=source_id,
        sourceType=str(source.get("sourceType")),
        sourceFile=str(source_file.resolve()),
        sourceUrl=source.get("sourceUrl"),
        title=str(source.get("title") or source_id),
        role=str(source.get("role") or "mcq_corpus"),
        section=source.get("section"),
        chapterSlug=slug,
        chapterTitle=chapter_title,
        sha256=sha256_file(source_file),
        extractedAt=now_iso(),
        sourcePageCount=source_page_count,
        startPage=start_page,
        endPage=end_page,
        pageCount=len(selected_texts),
        extractionStatus="ocr_required" if ocr_required else "text_extracted",
        reviewStatus="needs_ocr" if ocr_required else "needs_segmentation_review",
        rankedEligible=False,
        ocrRequired=ocr_required,
        ocrModel=ocr_model,
        includeImages=include_images,
        questionSignals=total_question_signals,
        pages=page_reports,
        warnings=warnings,
    )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Extract selected uploaded SSC book pages into review-only artifacts.")
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--chapter-slug", required=True)
    parser.add_argument("--chapter-title", required=True)
    parser.add_argument("--start-page", type=int, required=True)
    parser.add_argument("--end-page", type=int, required=True)
    parser.add_argument("--manifest-path", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--allow-plain-text-fixture", action="store_true")
    args = parser.parse_args()

    if not args.manifest_path.exists():
        parser.error(f"book manifest not found: {args.manifest_path}")

    try:
        report = build_report(
            args.manifest_path,
            args.source_id,
            args.chapter_slug,
            args.chapter_title,
            args.start_page,
            args.end_page,
            args.output_root,
            args.allow_plain_text_fixture,
        )
    except Exception as exc:
        parser.error(str(exc))

    report_root = args.output_root / safe_slug(args.source_id) / f"{report.chapterSlug}-p{report.startPage:03d}-p{report.endPage:03d}"
    report_root.mkdir(parents=True, exist_ok=True)
    report_path = report_root / "extraction-report.json"
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote uploaded-book extraction report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
