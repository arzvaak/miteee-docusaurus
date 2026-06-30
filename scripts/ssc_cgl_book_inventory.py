"""Inventory user-provided SSC CGL books and build the OCR queue.

The user-provided book corpus is now the authoritative SSC CGL MCQ source. This
script does not OCR or import questions; it records source metadata and creates
page chunks for Mistral OCR with image extraction enabled.
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

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BOOKS_ROOT = Path(r"G:\SSC BOOKS")
DEFAULT_MANIFEST = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "manifest.json"
DEFAULT_QUEUE = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "mistral-ocr-queue.json"
DEFAULT_MODEL = "mistral-ocr-latest"


@dataclass(frozen=True)
class KnownBook:
    id: str
    fileName: str
    title: str
    role: str
    section: str | None
    purpose: str
    chunkPages: int
    priority: int
    sourceFormat: str = "pdf"


KNOWN_BOOKS = [
    KnownBook(
        id="ssc-maths-6800-mcq",
        fileName="1000747369-SSC-Maths-6800-MCQ-Book-2026-Eduquity-Based-New-Pattern-Chapterwise.pdf",
        title="SSC Maths 6800 MCQ Book 2026 Eduquity Based New Pattern Chapterwise",
        role="mcq_corpus",
        section="quantitative-aptitude",
        purpose="mcq_extraction",
        chunkPages=20,
        priority=1,
    ),
    KnownBook(
        id="pinnacle-ssc-reasoning",
        fileName="PINNACLE SSC REASONING.htm",
        title="Pinnacle SSC Reasoning English Medium",
        role="mcq_corpus",
        section="reasoning",
        purpose="html_asset_extraction",
        chunkPages=25,
        priority=2,
        sourceFormat="scribd_html",
    ),
    KnownBook(
        id="pinnacle-ssc-english",
        fileName="751426926-Pinnacle-English-Book-for-Ssc-Exams.pdf",
        title="Pinnacle English Book for SSC Exams",
        role="mcq_corpus",
        section="english-comprehension",
        purpose="mcq_extraction",
        chunkPages=25,
        priority=3,
    ),
    KnownBook(
        id="pinnacle-ssc-general-studies",
        fileName="1024586786-Pinnacle-SSC-General-Studies-GS-8th-Edition-English-Medium.pdf",
        title="Pinnacle SSC General Studies GS 8th Edition English Medium",
        role="mcq_corpus",
        section="general-awareness",
        purpose="mcq_extraction",
        chunkPages=25,
        priority=4,
    ),
    KnownBook(
        id="lucent-gk-english",
        fileName="374612740-Lucent-GK-English-Sscpot-com.pdf",
        title="Lucent General Knowledge English",
        role="static_gk_reference",
        section="general-awareness",
        purpose="deepseek_static_gk_reference",
        chunkPages=15,
        priority=5,
    ),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_sample(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()[:500]


def inspect_pdf(path: Path) -> dict[str, Any]:
    reader = PdfReader(str(path))
    sample_pages = min(10, len(reader.pages))
    extractable = 0
    samples: list[dict[str, Any]] = []
    for index in range(sample_pages):
        try:
            text = reader.pages[index].extract_text() or ""
        except Exception as exc:
            text = ""
            samples.append({"page": index + 1, "error": repr(exc), "charCount": 0, "sample": ""})
            continue
        if len(text.strip()) >= 80:
            extractable += 1
        samples.append({
            "page": index + 1,
            "charCount": len(text),
            "sample": normalize_sample(text),
        })
    return {
        "pageCount": len(reader.pages),
        "hasOutline": bool(getattr(reader, "outline", []) or []),
        "textExtractablePagesSampled": extractable,
        "sampledPages": sample_pages,
        "samples": samples,
    }


def inspect_scribd_html(path: Path) -> dict[str, Any]:
    html = path.read_text(encoding="utf-8", errors="ignore")
    page_numbers = {int(match) for match in re.findall(r"\bouter_page_(\d{1,4})\b", html)}
    page_numbers.update(int(match) for match in re.findall(r"/pages/(\d{1,4})-[a-z0-9]+\.jsonp", html))
    q_like = len(re.findall(r"\bQ\.?\s*\d{1,4}", html, flags=re.IGNORECASE))
    page_count = max(page_numbers) if page_numbers else 1
    sample = normalize_sample(re.sub(r"<[^>]+>", " ", html))
    return {
        "pageCount": page_count,
        "hasOutline": False,
        "textExtractablePagesSampled": 0,
        "sampledPages": min(10, page_count),
        "samples": [
            {
                "page": 1,
                "charCount": len(html),
                "sample": sample,
            }
        ],
        "htmlPageAssetCount": len(page_numbers),
        "questionSignalsInShell": q_like,
    }


def inspect_source(path: Path, source_format: str) -> dict[str, Any]:
    if source_format == "scribd_html":
        return inspect_scribd_html(path)
    return inspect_pdf(path)


def build_manifest(books_root: Path, model: str) -> dict[str, Any]:
    sources = []
    for book in KNOWN_BOOKS:
        file_path = books_root / book.fileName
        if not file_path.exists():
            raise FileNotFoundError(f"book not found: {file_path}")
        inspection = inspect_source(file_path, book.sourceFormat)
        source = {
            "id": book.id,
            "title": book.title,
            "fileName": book.fileName,
            "file": str(file_path.resolve()),
            "sourceType": "book_user_provided",
            "role": book.role,
            "section": book.section,
            "purpose": book.purpose,
            "sourceFormat": book.sourceFormat,
            "priority": book.priority,
            "pageCount": inspection["pageCount"],
            "sha256": sha256_file(file_path),
            "textExtractablePagesSampled": inspection["textExtractablePagesSampled"],
            "sampledPages": inspection["sampledPages"],
            "hasOutline": inspection["hasOutline"],
            "ocrModel": model,
            "includeImages": True,
            "deepseekUse": "Use as grounded reference for exhaustive SSC CGL notes; cite page/chapter provenance in local metadata.",
            "samples": inspection["samples"],
        }
        if book.sourceFormat == "scribd_html":
            source["htmlPageAssetCount"] = inspection.get("htmlPageAssetCount", 0)
            source["questionSignalsInShell"] = inspection.get("questionSignalsInShell", 0)
        sources.append(source)
    return {
        "generatedAt": now_iso(),
        "booksRoot": str(books_root.resolve()),
        "corpusPolicy": {
            "replaceExistingMcqs": True,
            "oldCorpusStatus": "disabled",
            "activeQuestionSourceType": "book_user_provided",
            "notesProvider": "deepseek",
            "ocrProvider": "mistral",
            "ocrModel": model,
            "includeImages": True,
        },
        "sources": sources,
    }


def build_queue(manifest: dict[str, Any], model: str) -> dict[str, Any]:
    jobs = []
    for source in manifest["sources"]:
        source_id = str(source["id"])
        page_count = int(source["pageCount"])
        known = next(book for book in KNOWN_BOOKS if book.id == source_id)
        for start in range(1, page_count + 1, known.chunkPages):
            end = min(page_count, start + known.chunkPages - 1)
            jobs.append({
                "id": f"{source_id}-p{start:04d}-p{end:04d}",
                "sourceId": source_id,
                "sourceType": "book_user_provided",
                "file": source["file"],
                "startPage": start,
                "endPage": end,
                "pageCount": end - start + 1,
                "purpose": known.purpose,
                "sourceFormat": str(source.get("sourceFormat") or known.sourceFormat),
                "model": model,
                "includeImages": True,
                "status": "queued",
                "outputRoot": str((ROOT / "data" / "exams" / "ssc-cgl" / "book-ocr" / source_id).resolve()),
                "reviewOnly": True,
            })
    return {
        "generatedAt": now_iso(),
        "model": model,
        "includeImages": True,
        "rankedEligible": False,
        "jobs": jobs,
        "warnings": [
            "OCR queue is review-only and must not be imported directly into ranked tests.",
            "DeepSeek notes must use grounded OCR/book excerpts and request diagrams/images where useful.",
        ],
    }


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Inventory uploaded SSC CGL books and build Mistral OCR queue.")
    parser.add_argument("--books-root", type=Path, default=DEFAULT_BOOKS_ROOT)
    parser.add_argument("--manifest-path", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--queue-path", type=Path, default=DEFAULT_QUEUE)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    manifest = build_manifest(args.books_root, args.model)
    queue = build_queue(manifest, args.model)
    write_json(args.manifest_path, manifest)
    write_json(args.queue_path, queue)
    print(f"registered {len(manifest['sources'])} books and {len(queue['jobs'])} OCR jobs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
