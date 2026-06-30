"""Extract page text from SSC CGL PDFs into an OCR/segmentation review folder.

This is the bridge between downloaded source files and question ingestion. It
does not create ranked questions. It produces page text, source hashes, and
review metadata so OCR/segmentation can be audited before any question enters
practice.
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
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review"


@dataclass
class PageExtraction:
    pageNumber: int
    textPath: str
    charCount: int
    questionSignals: int
    extractionMethod: str


@dataclass
class ExtractionReport:
    sourceId: str
    sourceType: str
    sourceFile: str
    sourceUrl: str | None
    sha256: str
    extractedAt: str
    pageCount: int
    extractionStatus: str
    reviewStatus: str
    ocrRequired: bool
    questionSignals: int
    pages: list[PageExtraction]
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def normalize_text(value: str) -> str:
    return re.sub(r"[ \t]+", " ", re.sub(r"\r\n?", "\n", value or "")).strip()


def count_question_signals(text: str) -> int:
    patterns = [
        r"\bQ(?:uestion)?\.?\s*\d+",
        r"^\s*\d+\s*[\).]",
        r"\bAnswer\s*[:\-]",
        r"\([a-dA-D]\)",
    ]
    total = 0
    for pattern in patterns:
        total += len(re.findall(pattern, text, flags=re.IGNORECASE | re.MULTILINE))
    return total


def looks_like_saved_paper_shell(page_texts: list[str], question_signals: int) -> bool:
    combined = "\n".join(page_texts)
    has_saved_paper_navigation = bool(re.search(
        r"Click Here to Challenge Question No\.|Click Here for PART-|Correct Option selected",
        combined,
        flags=re.IGNORECASE,
    ))
    has_question_placeholders = bool(re.search(r"\bQ\.?\s*No\.?\s*:", combined, flags=re.IGNORECASE))
    return has_saved_paper_navigation and has_question_placeholders and question_signals == 0


def extract_plain_text_fixture(source_file: Path) -> list[str]:
    return [normalize_text(source_file.read_text(encoding="utf-8", errors="ignore"))]


def extract_pdf_pages(source_file: Path) -> list[str]:
    try:
        from pypdf import PdfReader  # type: ignore
    except Exception as exc:
        raise RuntimeError("pypdf is required for PDF text extraction; install requirements-ssc.txt") from exc

    reader = PdfReader(str(source_file))
    pages: list[str] = []
    for page in reader.pages:
        try:
            pages.append(normalize_text(page.extract_text() or ""))
        except Exception:
            pages.append("")
    return pages


def build_report(
    source_file: Path,
    source_id: str,
    source_type: str,
    source_url: str | None,
    output_root: Path,
    allow_plain_text_fixture: bool = False,
) -> ExtractionReport:
    if allow_plain_text_fixture:
        page_texts = extract_plain_text_fixture(source_file)
        extraction_method = "plain_text_fixture"
    else:
        page_texts = extract_pdf_pages(source_file)
        extraction_method = "pypdf"

    source_root = output_root / safe_slug(source_id)
    pages_root = source_root / "pages"
    pages_root.mkdir(parents=True, exist_ok=True)

    page_reports: list[PageExtraction] = []
    total_question_signals = 0
    nonempty_pages = 0
    for index, text in enumerate(page_texts, start=1):
        if text:
            nonempty_pages += 1
        signals = count_question_signals(text)
        total_question_signals += signals
        text_path = pages_root / f"page-{index:03d}.txt"
        text_path.write_text(text + ("\n" if text else ""), encoding="utf-8")
        page_reports.append(PageExtraction(
            pageNumber=index,
            textPath=str(text_path.resolve()),
            charCount=len(text),
            questionSignals=signals,
            extractionMethod=extraction_method,
        ))

    skeleton_extraction = source_type == "web_pdf_unverified" and looks_like_saved_paper_shell(page_texts, total_question_signals)
    ocr_required = nonempty_pages == 0 or skeleton_extraction
    extraction_status = "ocr_required" if ocr_required else "text_extracted"
    warnings = [
        "Extracted text is not a reviewed question bank.",
        "Question segmentation and answer-key alignment must be reviewed before ranked practice.",
    ]
    if nonempty_pages == 0:
        warnings.append("No embedded text was extracted; render pages and OCR before segmentation.")
    if skeleton_extraction:
        warnings.append("Extracted text looks like a saved-paper skeleton with question placeholders; OCR is required to recover stems and options.")
    if source_type == "web_pdf_unverified":
        warnings.append("web_pdf_unverified sources cannot enter ranked tests without rights and provenance review.")

    return ExtractionReport(
        sourceId=source_id,
        sourceType=source_type,
        sourceFile=str(source_file.resolve()),
        sourceUrl=source_url,
        sha256=sha256_file(source_file),
        extractedAt=now_iso(),
        pageCount=len(page_texts),
        extractionStatus=extraction_status,
        reviewStatus="needs_ocr" if ocr_required else "needs_segmentation_review",
        ocrRequired=ocr_required,
        questionSignals=total_question_signals,
        pages=page_reports,
        warnings=warnings,
    )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Extract SSC CGL PDF text for OCR/segmentation review.")
    parser.add_argument("source_file", type=Path)
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--source-type", required=True, choices=[
        "official_open",
        "official_login_personal",
        "user_provided",
        "web_pdf_unverified",
        "copyright_risk_reference",
    ])
    parser.add_argument("--source-url")
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--allow-plain-text-fixture", action="store_true")
    args = parser.parse_args()

    if not args.source_file.exists():
        parser.error(f"source file not found: {args.source_file}")
    if args.source_type == "copyright_risk_reference":
        parser.error("copyright-risk references are metadata-only and must not be extracted")

    report = build_report(
        args.source_file,
        args.source_id,
        args.source_type,
        args.source_url,
        args.output_root,
        args.allow_plain_text_fixture,
    )
    report_root = args.output_root / safe_slug(args.source_id)
    report_root.mkdir(parents=True, exist_ok=True)
    report_path = report_root / "extraction-report.json"
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote extraction report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
