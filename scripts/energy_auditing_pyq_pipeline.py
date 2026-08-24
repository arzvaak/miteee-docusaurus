#!/usr/bin/env python3
"""Inventory, download, extract, and OCR Energy Auditing PYQs.

This pipeline is deliberately source-first.  It admits only Semester 7
Electrical papers whose source metadata contains the predecessor codes
``ELE 423`` or ``ELE 4006``.  The current course code (``ELE 4446``) is kept
as context in the manifest but is never used to rewrite historical papers.

The API snapshot, downloaded PDFs, native text, OCR response, and per-page
OCR markdown are written below ``tmp/energy-auditing/pyq`` by default.  Only
the compact manifest is intended to be committed.  Mistral credentials are
read from the process environment for the duration of a run and are never
written to a file, request packet, log, or manifest.

Examples::

    # Fetch the live API, download admitted papers, and extract native text.
    python scripts/energy_auditing_pyq_pipeline.py

    # Also send each PDF to Mistral OCR when MISTRAL_API_KEY is present.
    MISTRAL_API_KEY=... python scripts/energy_auditing_pyq_pipeline.py --ocr

    # Fail the run if the API does not expose the planned ten records.
    python scripts/energy_auditing_pyq_pipeline.py --strict-count

The initial search response currently exposes nine exact predecessor-code
records.  The approved 2021 ELE-4006 record has a blank ``branch`` field, so
the runner fetches that record by its API id and admits it only because its
category is Electrical and its id is explicitly allow-listed below.  This
preserves ten source records without broadening the blank-branch admission
rule to unrelated papers.
"""

from __future__ import annotations

import argparse
import base64
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urljoin

try:
    import requests  # type: ignore
except ImportError:  # pragma: no cover - the repository runtime normally has requests
    requests = None  # type: ignore


ROOT = Path(__file__).resolve().parents[1]
API_ORIGIN = "https://pyq.arzvak.com"
API_ENDPOINT = f"{API_ORIGIN}/api/papers"
DEFAULT_TEMP_ROOT = ROOT / "tmp" / "energy-auditing" / "pyq"
DEFAULT_MANIFEST = ROOT / "data" / "sources" / "energy-auditing" / "pyq-manifest.json"
DEFAULT_MODEL = "mistral-ocr-latest"
MISTRAL_OCR_ENDPOINT = "https://api.mistral.ai/v1/ocr"
EXPECTED_PAPER_COUNT = 10
# The API's list response omits this row when the branch filter is applied,
# although its detail endpoint is a valid Semester 7 Electrical paper.  Keep
# this narrow allow-list explicit and provenance-visible rather than accepting
# arbitrary blank-branch records.
APPROVED_SUPPLEMENTAL_IDS = (
    "0734f852-6aa9-4bbb-88d8-337945389721",
)
DEFAULT_QUERY = {
    "search": "Energy Auditing",
    "semester": "Semester 7",
    "branch": "Electrical",
    "limit": "160",
    "offset": "0",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def json_dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_space(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def safe_slug(value: str, max_length: int = 100) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:max_length].strip("-") or "paper"


def relative_to_root(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT.resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def api_get_json(url: str, timeout: int = 90) -> dict[str, Any]:
    if requests is None:
        raise RuntimeError("requests is required to query pyq.arzvak.com")
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("PYQ API response was not a JSON object")
    return payload


def request_url(query: dict[str, str]) -> str:
    from urllib.parse import urlencode

    return f"{API_ENDPOINT}?{urlencode(query)}"


def load_api_snapshot(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"API snapshot is not a JSON object: {path}")
    return payload


def source_code_from_row(row: dict[str, Any]) -> str | None:
    """Return the exact predecessor code found in source metadata.

    API fields are not consistently populated (some rows have
    ``derived_subject_code``, others ``subject_code``), so all source-facing
    fields are inspected.  The word boundary avoids accepting ELE 4230 or a
    code embedded in an unrelated number.
    """

    fields = (
        "derived_subject_code",
        "subject_code",
        "subject_name",
        "title",
        "pdf_url",
        "storage_url",
    )
    blob = " ".join(normalize_space(row.get(key)) for key in fields)
    match = re.search(r"\bELE\s*(?:[-–—]\s*)?(423|4006)\b", blob, flags=re.IGNORECASE)
    if not match:
        return None
    return f"ELE {match.group(1)}"


def title_exam_qualifier(row: dict[str, Any]) -> str | None:
    title = normalize_space(row.get("title"))
    if re.search(r"\bmake\s*[- ]?up\b", title, flags=re.IGNORECASE):
        return "Makeup"
    if re.search(r"\bregular\b", title, flags=re.IGNORECASE):
        return "Regular"
    return None


def select_admitted_papers(
    rows: Iterable[dict[str, Any]],
    allow_blank_branch_ids: Iterable[str] = (),
) -> list[dict[str, Any]]:
    """Apply the historical-source admission policy and sort deterministically."""

    admitted: list[dict[str, Any]] = []
    allow_blank = set(allow_blank_branch_ids)
    seen_ids: set[str] = set()
    for row in rows:
        if not isinstance(row, dict):
            continue
        if normalize_space(row.get("semester")).casefold() != "semester 7":
            continue
        paper_id = normalize_space(row.get("id"))
        branch = normalize_space(row.get("branch"))
        category = normalize_space(row.get("category"))
        branch_is_electrical = branch.casefold() == "electrical"
        approved_blank_branch = not branch and category.casefold() == "electrical" and paper_id in allow_blank
        if not branch_is_electrical and not approved_blank_branch:
            continue
        code = source_code_from_row(row)
        if code is None:
            continue
        if not paper_id or paper_id in seen_ids:
            continue
        seen_ids.add(paper_id)
        copy = dict(row)
        copy["predecessorCode"] = code
        copy["titleExamQualifier"] = title_exam_qualifier(row)
        warnings: list[str] = []
        if approved_blank_branch:
            warnings.append("missing branch metadata; admitted via category=Electrical and approved API id")
        api_exam_type = normalize_space(row.get("exam_type")) or None
        title_qualifier = copy["titleExamQualifier"]
        if api_exam_type and title_qualifier and api_exam_type.casefold() != title_qualifier.casefold():
            warnings.append(
                f"API exam_type={api_exam_type!r} conflicts with title qualifier={title_qualifier!r}"
            )
        copy["metadataWarnings"] = warnings
        admitted.append(copy)

    def sort_key(row: dict[str, Any]) -> tuple[int, int, str, str]:
        try:
            year = int(str(row.get("year") or "0"))
        except ValueError:
            year = 0
        exam_type = normalize_space(row.get("exam_type")).casefold()
        exam_rank = 0 if exam_type == "regular" else 1 if exam_type == "makeup" else 2
        return year, exam_rank, normalize_space(row.get("predecessorCode")), normalize_space(row.get("id"))

    return sorted(admitted, key=sort_key)


def paper_slug(row: dict[str, Any]) -> str:
    year = normalize_space(row.get("year")) or "unknown-year"
    exam_type = normalize_space(row.get("exam_type")) or "unknown-exam"
    code = normalize_space(row.get("predecessorCode"))
    paper_id = normalize_space(row.get("id"))
    return safe_slug(f"{year}-{exam_type}-{code}-{paper_id[:8]}")


def download_file(urls: list[str], destination: Path, force: bool = False) -> tuple[str, list[str]]:
    """Download from the first successful URL and return it plus warnings."""

    if requests is None:
        raise RuntimeError("requests is required to download PYQ PDFs")
    destination.parent.mkdir(parents=True, exist_ok=True)
    warnings: list[str] = []
    if destination.is_file() and destination.stat().st_size > 0 and not force:
        return urls[0], warnings

    for index, url in enumerate(urls):
        part = destination.with_name(destination.name + ".part")
        try:
            response = requests.get(url, stream=True, timeout=180)
            response.raise_for_status()
            with part.open("wb") as handle:
                for chunk in response.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        handle.write(chunk)
            if part.stat().st_size == 0:
                raise RuntimeError("empty response")
            part.replace(destination)
            if index > 0:
                warnings.append(f"primary source failed; downloaded fallback URL {url}")
            return url, warnings
        except Exception as exc:
            if part.exists():
                part.unlink()
            warnings.append(f"download failed for source {url}: {type(exc).__name__}")
    raise RuntimeError(f"all source URLs failed for {destination.name}")


def pdf_page_count(path: Path) -> int:
    try:
        result = subprocess.run(
            ["pdfinfo", str(path)],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        result = None
    if result and result.returncode == 0:
        match = re.search(r"^Pages:\s*(\d+)\s*$", result.stdout, flags=re.MULTILINE)
        if match:
            return int(match.group(1))
    raise RuntimeError(f"could not read PDF page count for {path.name}; install pdfinfo")


def extract_native_page(path: Path, page_number: int) -> str:
    try:
        result = subprocess.run(
            ["pdftotext", "-f", str(page_number), "-l", str(page_number), "-layout", "-enc", "UTF-8", str(path), "-"],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=90,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError(f"could not run pdftotext for {path.name}") from exc
    if result.returncode != 0:
        raise RuntimeError(f"pdftotext failed for {path.name} page {page_number}")
    return result.stdout.strip()


def extract_native_text(path: Path) -> tuple[int, list[dict[str, Any]]]:
    page_count = pdf_page_count(path)
    pages: list[dict[str, Any]] = []
    for page_number in range(1, page_count + 1):
        text = extract_native_page(path, page_number)
        pages.append(
            {
                "pageNumber": page_number,
                "text": text,
                "charCount": len(text),
                "extractionMethod": "pdftotext-layout",
            }
        )
    return page_count, pages


def mistral_api_key() -> tuple[str | None, str | None]:
    """Read a key only from the current process; return value and env name."""

    for env_name in ("MISTRAL_API_KEY", "MISTRAL_API_KEY_2", "MISTRAK_API_KEY"):
        value = os.environ.get(env_name)
        if value:
            return value, env_name
    return None, None


def call_mistral_ocr(path: Path, api_key: str, model: str) -> dict[str, Any]:
    if requests is None:
        raise RuntimeError("requests is required for Mistral OCR")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    payload = {
        "model": model,
        "document": {
            "type": "document_url",
            "document_url": f"data:application/pdf;base64,{encoded}",
        },
        "include_image_base64": False,
        "table_format": "markdown",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    for attempt in range(1, 6):
        try:
            response = requests.post(MISTRAL_OCR_ENDPOINT, headers=headers, json=payload, timeout=900)
        except requests.RequestException as exc:  # type: ignore[union-attr]
            if attempt == 5:
                raise RuntimeError(f"Mistral OCR request failed: {type(exc).__name__}") from exc
            time.sleep(min(60, 2**attempt))
            continue
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 5:
            retry_after = response.headers.get("retry-after", "")
            try:
                delay = float(retry_after)
            except ValueError:
                delay = float(min(60, 2**attempt))
            time.sleep(max(0.0, min(60.0, delay)))
            continue
        if response.status_code >= 400:
            # Do not include response text: providers can echo request details.
            raise RuntimeError(f"Mistral OCR returned HTTP {response.status_code}")
        result = response.json()
        if not isinstance(result, dict):
            raise RuntimeError("Mistral OCR response was not a JSON object")
        return result
    raise RuntimeError("Mistral OCR did not return after retries")


def confidence_fields(value: Any, path: str = "") -> list[dict[str, Any]]:
    """Collect provider confidence values without assuming a response schema."""

    found: list[dict[str, Any]] = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}" if path else str(key)
            if "confidence" in key.casefold():
                found.append({"path": child_path, "value": child})
            found.extend(confidence_fields(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.extend(confidence_fields(child, f"{path}[{index}]"))
    return found


def normalize_ocr_pages(raw: dict[str, Any]) -> list[dict[str, Any]]:
    pages: list[dict[str, Any]] = []
    for index, raw_page in enumerate(raw.get("pages") or []):
        page = dict(raw_page) if isinstance(raw_page, dict) else {}
        raw_index = page.get("index", index)
        try:
            page_number = int(raw_index) + 1
        except (TypeError, ValueError):
            page_number = index + 1
        markdown = str(page.get("markdown") or "").strip()
        pages.append(
            {
                "pageNumber": page_number,
                "markdown": markdown,
                "charCount": len(markdown),
                "confidence": confidence_fields(page),
                "rawKeys": sorted(page.keys()),
            }
        )
    return pages


def normalized_compare(left: str, right: str) -> float | None:
    left_norm = re.sub(r"\s+", " ", left or "").strip().casefold()
    right_norm = re.sub(r"\s+", " ", right or "").strip().casefold()
    if not left_norm or not right_norm:
        return None
    return round(difflib.SequenceMatcher(a=left_norm, b=right_norm).ratio(), 6)


def build_reconciliation(native_pages: list[dict[str, Any]], ocr_pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    native_by_page = {int(page["pageNumber"]): page for page in native_pages}
    ocr_by_page = {int(page["pageNumber"]): page for page in ocr_pages}
    page_numbers = sorted(set(native_by_page) | set(ocr_by_page))
    rows: list[dict[str, Any]] = []
    for page_number in page_numbers:
        native = native_by_page.get(page_number, {})
        ocr = ocr_by_page.get(page_number, {})
        rows.append(
            {
                "pageNumber": page_number,
                "nativeCharCount": int(native.get("charCount") or 0),
                "ocrCharCount": int(ocr.get("charCount") or 0),
                "nativePresent": bool(native.get("text")),
                "ocrPresent": bool(ocr.get("markdown")),
                "normalizedSimilarity": normalized_compare(
                    str(native.get("text") or ""), str(ocr.get("markdown") or "")
                ),
            }
        )
    return rows


def write_extraction_record(
    path: Path,
    row: dict[str, Any],
    local_pdf: Path,
    source_url_used: str,
    native_page_count: int,
    native_pages: list[dict[str, Any]],
    ocr_status: str,
    ocr_model: str,
    ocr_raw_path: Path | None,
    ocr_page_dir: Path | None,
    ocr_pages: list[dict[str, Any]],
    ocr_error: str | None = None,
) -> dict[str, Any]:
    record = {
        "schemaVersion": 1,
        "paperId": normalize_space(row.get("id")),
        "predecessorCode": normalize_space(row.get("predecessorCode")),
        "title": normalize_space(row.get("title")),
        "year": normalize_space(row.get("year")),
        "examType": normalize_space(row.get("exam_type")),
        "sourceUrlUsed": source_url_used,
        "localPdfPath": relative_to_root(local_pdf),
        "sha256": sha256_file(local_pdf),
        "bytes": local_pdf.stat().st_size,
        "native": {
            "tool": "pdftotext-layout",
            "pageCount": native_page_count,
            "pages": native_pages,
        },
        "ocr": {
            "provider": "mistral",
            "model": ocr_model,
            "endpoint": MISTRAL_OCR_ENDPOINT,
            "status": ocr_status,
            "rawResponsePath": relative_to_root(ocr_raw_path) if ocr_raw_path else None,
            "pageMarkdownDir": relative_to_root(ocr_page_dir) if ocr_page_dir else None,
            "pages": ocr_pages,
            "confidenceFieldCount": sum(len(page.get("confidence") or []) for page in ocr_pages),
            "error": ocr_error,
        },
        "reconciliation": build_reconciliation(native_pages, ocr_pages),
    }
    json_dump(path, record)
    return record


def process_paper(
    row: dict[str, Any],
    temp_root: Path,
    model: str,
    run_ocr: bool,
    force_download: bool,
) -> dict[str, Any]:
    slug = paper_slug(row)
    local_pdf = temp_root / "papers" / f"{slug}.pdf"
    storage_url = normalize_space(row.get("storage_url"))
    pdf_url = normalize_space(row.get("pdf_url"))
    urls: list[str] = []
    if storage_url:
        urls.append(storage_url if storage_url.startswith("http") else urljoin(API_ORIGIN, storage_url))
    if pdf_url and pdf_url not in urls:
        urls.append(pdf_url)
    source_url_used, download_warnings = download_file(urls, local_pdf, force=force_download)

    page_count, native_pages = extract_native_text(local_pdf)
    ocr_status = "not_requested"
    ocr_raw_path: Path | None = None
    ocr_page_dir: Path | None = None
    ocr_pages: list[dict[str, Any]] = []
    ocr_error: str | None = None
    ocr_model = model

    if run_ocr:
        api_key, _ = mistral_api_key()
        if not api_key:
            ocr_status = "pending_missing_process_key"
            ocr_error = "Set MISTRAL_API_KEY (or a supported process-only alias) to run OCR."
        else:
            try:
                raw = call_mistral_ocr(local_pdf, api_key, model)
                ocr_root = temp_root / "ocr" / slug
                ocr_root.mkdir(parents=True, exist_ok=True)
                ocr_raw_path = ocr_root / "mistral-ocr.json"
                json_dump(ocr_raw_path, raw)
                ocr_page_dir = ocr_root / "pages"
                ocr_page_dir.mkdir(parents=True, exist_ok=True)
                ocr_pages = normalize_ocr_pages(raw)
                for page in ocr_pages:
                    page_number = int(page["pageNumber"])
                    markdown_path = ocr_page_dir / f"page-{page_number:03d}.md"
                    markdown_path.write_text(str(page.get("markdown") or "") + "\n", encoding="utf-8")
                ocr_status = "complete"
            except Exception as exc:
                ocr_status = "failed"
                ocr_error = f"{type(exc).__name__}: {exc}"

    extraction_path = temp_root / "extraction" / f"{slug}.json"
    extraction = write_extraction_record(
        extraction_path,
        row,
        local_pdf,
        source_url_used,
        page_count,
        native_pages,
        ocr_status,
        ocr_model,
        ocr_raw_path,
        ocr_page_dir,
        ocr_pages,
        ocr_error,
    )
    api_exam_type = normalize_space(row.get("exam_type")) or None
    return {
        "id": normalize_space(row.get("id")),
        "year": normalize_space(row.get("year")) or None,
        "examType": api_exam_type,
        "titleExamQualifier": row.get("titleExamQualifier"),
        "predecessorCode": normalize_space(row.get("predecessorCode")),
        "title": normalize_space(row.get("title")),
        "subjectName": normalize_space(row.get("subject_name")),
        "branch": normalize_space(row.get("branch")),
        "semester": normalize_space(row.get("semester")),
        "apiUrl": f"{API_ENDPOINT}/{normalize_space(row.get('id'))}",
        "pdfUrl": pdf_url or None,
        "storageUrl": storage_url or None,
        "sourceUrlUsed": source_url_used,
        "localPdfPath": relative_to_root(local_pdf),
        "sha256": extraction["sha256"],
        "bytes": extraction["bytes"],
        "pageCount": page_count,
        "nativeExtractionPath": relative_to_root(extraction_path),
        "ocr": {
            "provider": "mistral",
            "model": model,
            "status": ocr_status,
            "rawResponsePath": relative_to_root(ocr_raw_path) if ocr_raw_path else None,
            "pageMarkdownDir": relative_to_root(ocr_page_dir) if ocr_page_dir else None,
            "pageCount": len(ocr_pages),
            "confidenceFieldCount": sum(len(page.get("confidence") or []) for page in ocr_pages),
            "error": ocr_error,
        },
        "metadataWarnings": list(row.get("metadataWarnings") or []) + download_warnings,
    }


def build_manifest(
    api_payload: dict[str, Any],
    api_snapshot_path: Path,
    query: dict[str, str],
    request: str,
    supplemental_detail_paths: list[Path],
    papers: list[dict[str, Any]],
    run_ocr: bool,
    model: str,
) -> dict[str, Any]:
    api_rows = api_payload.get("data") or []
    admitted_count = len(papers)
    warnings: list[str] = []
    if admitted_count != EXPECTED_PAPER_COUNT:
        warnings.append(
            "The live API exposes "
            f"{admitted_count} exact ELE 423/ELE 4006 records after approved detail lookups, while the plan expects "
            f"{EXPECTED_PAPER_COUNT}."
        )
    if not run_ocr:
        warnings.append("OCR was not requested; rerun with --ocr and a process-only MISTRAL_API_KEY.")
    return {
        "schemaVersion": 1,
        "generatedAt": now_iso(),
        "course": {
            "courseCode": "SEM7-EA",
            "title": "Energy Auditing",
            "currentCode": "ELE 4446",
        },
        "sourcePolicy": {
            "acceptedHistoricalCodes": ["ELE 423", "ELE 4006"],
            "historicalLabel": "Semester 7 predecessor-code PYQ",
            "currentCodeIsNotRewritten": True,
            "answersAreUnreviewedSourceMaterial": True,
        },
        "api": {
            "endpoint": API_ENDPOINT,
            "requestUrl": request,
            "query": query,
            "retrievedAt": now_iso(),
            "reportedCount": api_payload.get("count"),
            "returnedRows": len(api_rows) if isinstance(api_rows, list) else 0,
            "snapshotPath": relative_to_root(api_snapshot_path),
            "snapshotSha256": sha256_file(api_snapshot_path),
            "supplementalDetailPaths": [relative_to_root(path) for path in supplemental_detail_paths],
            "supplementalDetailIds": list(APPROVED_SUPPLEMENTAL_IDS),
        },
        "expectedPaperCount": EXPECTED_PAPER_COUNT,
        "admittedPaperCount": admitted_count,
        "countStatus": "complete" if admitted_count == EXPECTED_PAPER_COUNT else "discrepancy",
        "ocrPolicy": {
            "provider": "mistral",
            "model": model,
            "endpoint": MISTRAL_OCR_ENDPOINT,
            "requestedThisRun": run_ocr,
            "credentialStorage": "process environment only; never persisted",
        },
        "warnings": warnings,
        "papers": papers,
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--temp-root", type=Path, default=DEFAULT_TEMP_ROOT)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--api-snapshot", type=Path, help="Use an existing API JSON snapshot instead of fetching.")
    parser.add_argument("--ocr", action="store_true", help="Run Mistral OCR when a process-only key is available.")
    parser.add_argument("--model", default=os.environ.get("MISTRAL_OCR_MODEL", DEFAULT_MODEL))
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--strict-count", action="store_true", help="Exit 2 unless exactly ten papers are admitted.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    temp_root: Path = args.temp_root
    temp_root.mkdir(parents=True, exist_ok=True)
    api_dir = temp_root / "api"
    api_dir.mkdir(parents=True, exist_ok=True)
    snapshot_path = args.api_snapshot or api_dir / "papers.json"
    query = dict(DEFAULT_QUERY)
    request = request_url(query)

    if args.api_snapshot:
        api_payload = load_api_snapshot(args.api_snapshot)
    else:
        api_payload = api_get_json(request)
        json_dump(snapshot_path, api_payload)

    raw_rows = api_payload.get("data") or []
    if not isinstance(raw_rows, list):
        raise RuntimeError("PYQ API data field was not a list")
    # Work on a copy so the committed manifest's API counts remain the exact
    # list-response counts; approved detail lookups are reported separately.
    rows = list(raw_rows)
    supplemental_detail_paths: list[Path] = []
    row_ids = {normalize_space(row.get("id")) for row in rows if isinstance(row, dict)}
    for paper_id in APPROVED_SUPPLEMENTAL_IDS:
        if paper_id in row_ids:
            continue
        detail_url = f"{API_ENDPOINT}/{paper_id}"
        detail_payload = api_get_json(detail_url)
        detail_row = detail_payload.get("data")
        if not isinstance(detail_row, dict):
            raise RuntimeError(f"approved supplemental API detail had no row: {paper_id}")
        rows.append(detail_row)
        row_ids.add(paper_id)
        detail_path = api_dir / f"paper-{paper_id}.json"
        json_dump(detail_path, detail_payload)
        supplemental_detail_paths.append(detail_path)
    admitted = select_admitted_papers(rows, APPROVED_SUPPLEMENTAL_IDS)

    processed: list[dict[str, Any]] = []
    for index, row in enumerate(admitted, start=1):
        print(f"Processing PYQ {index}/{len(admitted)}: {normalize_space(row.get('year'))} {normalize_space(row.get('predecessorCode'))} {normalize_space(row.get('exam_type'))}")
        processed.append(process_paper(row, temp_root, args.model, args.ocr, args.force_download))

    manifest = build_manifest(
        api_payload,
        snapshot_path,
        query,
        request,
        supplemental_detail_paths,
        processed,
        args.ocr,
        args.model,
    )
    json_dump(args.manifest, manifest)
    print(json.dumps({
        "manifest": relative_to_root(args.manifest),
        "admittedPaperCount": len(processed),
        "expectedPaperCount": EXPECTED_PAPER_COUNT,
        "ocrStatuses": {status: sum(1 for paper in processed if paper["ocr"]["status"] == status) for status in sorted({paper["ocr"]["status"] for paper in processed})},
    }, ensure_ascii=False))
    if args.strict_count and len(processed) != EXPECTED_PAPER_COUNT:
        return 2
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
    except Exception as exc:
        print(f"energy auditing PYQ pipeline failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
