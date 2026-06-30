"""Run Mistral OCR for SSC CGL sources that the extractor marked needs_ocr.

The output remains review-only. This script converts OCR markdown into the same
page-text extraction-report shape that the segmenter already understands, but it
does not segment, align, review, or promote any question.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import sys
import tempfile
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review" / "drishti-ssc-cgl-pyq-pdf-ssc-cgl-tier-1-question-paper-bilingual-23-september-2-e96394e91c8" / "extraction-report.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review"
MISTRAL_OCR_URL = "https://api.mistral.ai/v1/ocr"
DEFAULT_MODEL = "mistral-ocr-latest"


@dataclass
class PageExtraction:
    pageNumber: int
    textPath: str
    charCount: int
    questionSignals: int
    extractionMethod: str


@dataclass
class OcrRunReport:
    generatedAt: str
    sourceId: str
    sourceType: str
    provider: str
    model: str
    pageCount: int
    markdownChars: int
    questionSignals: int
    rankedEligible: bool
    rawOcrPath: str
    outputExtractionReport: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def normalize_text(value: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", value or "")).strip()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def count_question_signals(text: str) -> int:
    patterns = [
        r"\bQ(?:uestion)?\.?\s*(?:No\.?\s*:)?\s*\d+",
        r"^\s*\d+\s*[\).]",
        r"\b(?:Answer|Correct\s+Answer)\s*[:\-]",
        r"\([a-dA-D]\)",
    ]
    total = 0
    for pattern in patterns:
        total += len(re.findall(pattern, text, flags=re.IGNORECASE | re.MULTILINE))
    return total


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def mistral_api_key() -> str | None:
    return os.environ.get("MISTRAL_API_KEY") or os.environ.get("MISTRAL_API_KEY_2") or os.environ.get("MISTRAK_API_KEY")


def ocr_output_slug(extraction_report: dict) -> str:
    source_id = str(extraction_report.get("sourceId") or "unknown-source")
    chapter_slug = str(extraction_report.get("chapterSlug") or "").strip()
    start_page = extraction_report.get("startPage")
    end_page = extraction_report.get("endPage")
    if chapter_slug and start_page and end_page:
        return safe_slug(f"{source_id}-{chapter_slug}-p{int(start_page):03d}-p{int(end_page):03d}")
    return safe_slug(source_id)


def selected_pdf_page_range(extraction_report: dict) -> tuple[int, int] | None:
    start_page = extraction_report.get("startPage")
    end_page = extraction_report.get("endPage")
    if not isinstance(start_page, int) or not isinstance(end_page, int):
        return None
    if start_page < 1 or end_page < start_page:
        return None
    return start_page, end_page


def build_selected_page_pdf(source_file: Path, start_page: int, end_page: int) -> Path:
    try:
        from pypdf import PdfReader, PdfWriter  # type: ignore
    except ImportError as exc:
        raise RuntimeError("pypdf is required for selected-page Mistral OCR; install requirements-ssc.txt") from exc

    reader = PdfReader(str(source_file))
    if end_page > len(reader.pages):
        raise RuntimeError(f"OCR page range {start_page}-{end_page} exceeds PDF length {len(reader.pages)}")

    writer = PdfWriter()
    for page_number in range(start_page, end_page + 1):
        writer.add_page(reader.pages[page_number - 1])

    handle = tempfile.NamedTemporaryFile(prefix="ssc-cgl-ocr-pages-", suffix=".pdf", delete=False)
    temp_path = Path(handle.name)
    handle.close()
    with temp_path.open("wb") as output:
        writer.write(output)
    return temp_path


def prepare_ocr_source_file(extraction_report: dict, source_file: Path) -> tuple[Path, bool]:
    page_range = selected_pdf_page_range(extraction_report)
    if not page_range:
        return source_file, False
    return build_selected_page_pdf(source_file, page_range[0], page_range[1]), True


def build_document_payload(source_file: Path) -> dict[str, str]:
    encoded = base64.b64encode(source_file.read_bytes()).decode("ascii")
    return {"type": "document_url", "document_url": f"data:application/pdf;base64,{encoded}"}


def call_mistral_ocr(source_file: Path, api_key: str, model: str) -> dict:
    try:
        import requests  # type: ignore
    except ImportError as exc:
        raise RuntimeError("requests is required for live Mistral OCR calls; install requirements-ssc.txt") from exc

    payload = {
        "model": model,
        "document": build_document_payload(source_file),
        "include_image_base64": True,
        "image_min_size": 0,
        "table_format": "markdown",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    for attempt in range(1, 6):
        response = requests.post(MISTRAL_OCR_URL, headers=headers, json=payload, timeout=360)
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 5:
            retry_after = response.headers.get("retry-after")
            delay = float(retry_after) if retry_after and retry_after.isdigit() else min(60, 2**attempt)
            time.sleep(delay)
            continue
        response.raise_for_status()
        return response.json()
    raise RuntimeError("Mistral OCR did not return after retries")


def normalize_pages(raw_response: dict) -> list[dict]:
    pages = []
    for index, page in enumerate(raw_response.get("pages") or []):
        if hasattr(page, "model_dump"):
            page_data = page.model_dump()
        elif isinstance(page, dict):
            page_data = dict(page)
        else:
            page_data = dict(page)
        page_data.setdefault("index", index)
        page_data["markdown"] = normalize_text(str(page_data.get("markdown") or ""))
        page_data["images"] = [
            {key: value for key, value in image.items() if key != "image_base64"}
            for image in (page_data.get("images") or [])
            if isinstance(image, dict)
        ]
        pages.append(page_data)
    return pages


def write_ocr_outputs(extraction_report: dict, raw_response: dict, output_root: Path, model: str) -> OcrRunReport:
    source_id = str(extraction_report.get("sourceId") or "unknown-source")
    source_type = str(extraction_report.get("sourceType") or "web_pdf_unverified")
    source_file = Path(str(extraction_report.get("sourceFile") or ""))
    source_url = extraction_report.get("sourceUrl")
    source_root = output_root / ocr_output_slug(extraction_report)
    pages_root = source_root / "pages-ocr"
    pages_root.mkdir(parents=True, exist_ok=True)

    pages = normalize_pages(raw_response)
    page_reports: list[PageExtraction] = []
    total_signals = 0
    markdown_chars = 0
    page_start = int(extraction_report.get("startPage") or 1)
    for index, page in enumerate(pages):
        page_number = page_start + index
        markdown = str(page.get("markdown") or "")
        signals = count_question_signals(markdown)
        total_signals += signals
        markdown_chars += len(markdown)
        text_path = pages_root / f"page-{page_number:03d}.txt"
        text_path.write_text(markdown + ("\n" if markdown else ""), encoding="utf-8")
        page_reports.append(PageExtraction(
            pageNumber=page_number,
            textPath=str(text_path.resolve()),
            charCount=len(markdown),
            questionSignals=signals,
            extractionMethod="mistral_ocr",
        ))

    raw_ocr_path = source_root / "mistral-ocr.json"
    raw_ocr_path.write_text(json.dumps({
        "provider": "mistral",
        "model": model,
        "sourceId": source_id,
        "sourceType": source_type,
        "sourceUrl": source_url,
        "pages": pages,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    warnings = [
        "Mistral OCR output is not a reviewed question bank.",
        "OCR text is not ranked; segment, answer-key align, topic-tag, duplicate-check, and model-agent review before curated use.",
    ]
    if source_type == "web_pdf_unverified":
        warnings.append("web_pdf_unverified sources cannot enter ranked tests without rights and provenance review.")

    updated_extraction = {
        "sourceId": source_id,
        "sourceType": source_type,
        "sourceFile": str(source_file.resolve()) if source_file else None,
        "sourceUrl": source_url,
        "title": extraction_report.get("title"),
        "role": extraction_report.get("role"),
        "section": extraction_report.get("section"),
        "chapterSlug": extraction_report.get("chapterSlug"),
        "chapterTitle": extraction_report.get("chapterTitle"),
        "sha256": sha256_file(source_file) if source_file.exists() else extraction_report.get("sha256", ""),
        "extractedAt": now_iso(),
        "sourcePageCount": extraction_report.get("sourcePageCount"),
        "startPage": extraction_report.get("startPage"),
        "endPage": extraction_report.get("endPage"),
        "pageCount": len(pages),
        "extractionStatus": "ocr_text_extracted" if pages else "ocr_empty",
        "reviewStatus": "needs_segmentation_review" if pages else "needs_ocr_review",
        "ocrRequired": False if pages else True,
        "ocrProvider": "mistral",
        "ocrModel": model,
        "questionSignals": total_signals,
        "pages": [asdict(page) for page in page_reports],
        "warnings": warnings,
    }
    extraction_path = source_root / "extraction-report.json"
    extraction_path.write_text(json.dumps(updated_extraction, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    report = OcrRunReport(
        generatedAt=now_iso(),
        sourceId=source_id,
        sourceType=source_type,
        provider="mistral",
        model=model,
        pageCount=len(pages),
        markdownChars=markdown_chars,
        questionSignals=total_signals,
        rankedEligible=False,
        rawOcrPath=str(raw_ocr_path.resolve()),
        outputExtractionReport=str(extraction_path.resolve()),
        warnings=warnings,
    )
    (source_root / "mistral-ocr-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def write_dry_run_packet(extraction_report: dict, output_root: Path, model: str) -> OcrRunReport:
    source_id = str(extraction_report.get("sourceId") or "unknown-source")
    source_type = str(extraction_report.get("sourceType") or "web_pdf_unverified")
    source_file = Path(str(extraction_report.get("sourceFile") or ""))
    source_root = output_root / ocr_output_slug(extraction_report)
    source_root.mkdir(parents=True, exist_ok=True)
    packet_path = source_root / "mistral-ocr-request-packet.json"
    packet_path.write_text(json.dumps({
        "sourceId": source_id,
        "sourceType": source_type,
        "sourceFile": str(source_file.resolve()) if source_file else None,
        "chapterSlug": extraction_report.get("chapterSlug"),
        "startPage": extraction_report.get("startPage"),
        "endPage": extraction_report.get("endPage"),
        "model": model,
        "endpoint": MISTRAL_OCR_URL,
        "rankedEligible": False,
        "status": "queued_dry_run",
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report = OcrRunReport(
        generatedAt=now_iso(),
        sourceId=source_id,
        sourceType=source_type,
        provider="mistral",
        model=model,
        pageCount=0,
        markdownChars=0,
        questionSignals=0,
        rankedEligible=False,
        rawOcrPath="",
        outputExtractionReport=str(Path(extraction_report.get("sourceFile") or "").resolve()) if extraction_report.get("sourceFile") else "",
        warnings=[
            "Dry run only: no OCR call was made.",
            "No ranked practice data is produced by this stage.",
        ],
    )
    (source_root / "mistral-ocr-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Run Mistral OCR for an SSC CGL needs_ocr extraction report.")
    parser.add_argument("--extraction-report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--model", default=os.environ.get("MISTRAL_OCR_MODEL", DEFAULT_MODEL))
    parser.add_argument("--raw-response", type=Path, help="Use an already-saved Mistral OCR JSON response instead of calling the API.")
    parser.add_argument("--dry-run", action="store_true", help="Write the request packet only; do not call Mistral or update extraction pages.")
    parser.add_argument("--force", action="store_true", help="Allow OCR even if the extraction report is not currently needs_ocr.")
    args = parser.parse_args()

    if not args.extraction_report.exists():
        parser.error(f"extraction report not found: {args.extraction_report}")
    extraction_report = load_json(args.extraction_report)
    source_type = str(extraction_report.get("sourceType") or "")
    if source_type == "copyright_risk_reference":
        parser.error("copyright-risk references are metadata-only and must not be OCRed")
    if extraction_report.get("ocrRequired") is not True and not args.force:
        parser.error("extraction report is not marked ocrRequired; pass --force to re-run")

    source_file = Path(str(extraction_report.get("sourceFile") or ""))
    if not source_file.exists() and not args.dry_run:
        parser.error(f"source file not found: {source_file}")

    if args.dry_run:
        report = write_dry_run_packet(extraction_report, args.output_root, args.model)
    else:
        if args.raw_response:
            raw_response = load_json(args.raw_response)
        else:
            api_key = mistral_api_key()
            if not api_key:
                parser.error("Set MISTRAL_API_KEY, MISTRAL_API_KEY_2, or MISTRAK_API_KEY before live OCR.")
            ocr_source_file, should_delete = prepare_ocr_source_file(extraction_report, source_file)
            try:
                raw_response = call_mistral_ocr(ocr_source_file, api_key, args.model)
            finally:
                if should_delete:
                    try:
                        ocr_source_file.unlink()
                    except OSError:
                        pass
        report = write_ocr_outputs(extraction_report, raw_response, args.output_root, args.model)

    print(
        f"ocr source {report.sourceId}; pages {report.pageCount}; "
        f"signals {report.questionSignals}; rankedEligible {report.rankedEligible}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
