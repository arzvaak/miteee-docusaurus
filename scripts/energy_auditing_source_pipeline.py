#!/usr/bin/env python3
"""Inventory, extract, OCR, and reconcile the Energy Auditing source decks.

This is deliberately a source pipeline, not a note author.  I keep the
original PPTX files, native slide extraction, raw Mistral responses, and a
per-slide reconciliation in a caller-selected untracked workspace (the
default is ``tmp/energy-auditing``).  The only intended tracked output is the
small source manifest passed with ``--manifest``.

The OCR phase reads my API key from the environment only.  I never include
the key in a report, request log, exception, or output file.

Typical use:

    python scripts/energy_auditing_source_pipeline.py \
      --phase native \
      --manifest tmp/energy-auditing/source-manifest.json

    MISTRAL_API_KEY=... python scripts/energy_auditing_source_pipeline.py \
      --phase all \
      --manifest data/sources/energy-auditing/source-manifest.json

The OCR endpoint accepts PPTX files as a document data URL.  Raw responses
are retained so later authoring or validation can inspect the exact page and
block payload returned by Mistral.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import mimetypes
import os
import posixpath
import re
import shutil
import subprocess
import sys
import time
import zipfile
from collections.abc import Iterable, Mapping
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path, PurePosixPath
from typing import Any
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ARCHIVE = Path("/home/sushi/Downloads/OneDrive_2026-08-24.zip")
DEFAULT_OUTPUT = ROOT / "tmp" / "energy-auditing"
DEFAULT_MANIFEST = ROOT / "data" / "sources" / "energy-auditing" / "source-manifest.json"
MISTRAL_OCR_URL = "https://api.mistral.ai/v1/ocr"
DEFAULT_MISTRAL_MODEL = "mistral-ocr-latest"
COURSE_PREFIX = "Energy Auditing (ELE 4446)/"
EXPECTED_DECKS = 35
EXPECTED_LECTURES = 23
EXPECTED_TUTORIALS = 12
EXPECTED_SLIDES = 851


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_ws(value: str) -> str:
    value = value.replace("\u00a0", " ")
    value = re.sub(r"[ \t\r\f\v]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return "\n".join(line.rstrip() for line in value.strip().splitlines()).strip()


def xml_local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def xml_attr(element: ET.Element, name: str) -> str | None:
    for key, value in element.attrib.items():
        if xml_local_name(key) == name:
            return value
    return None


def element_text(element: ET.Element) -> str:
    return normalize_ws(" ".join(
        (child.text or "")
        for child in element.iter()
        if xml_local_name(child.tag) == "t" and child.text
    ))


def text_nodes(element: ET.Element) -> list[str]:
    return [
        normalize_ws(child.text or "")
        for child in element.iter()
        if xml_local_name(child.tag) == "t" and normalize_ws(child.text or "")
    ]


def safe_slug(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value[:120] or "source"


def deck_identity(package_name: str) -> dict[str, Any]:
    filename = Path(package_name).name
    match = re.match(r"(?P<kind>L|T)(?P<number>\d+)-(?P<title>.+)\.pptx$", filename, re.IGNORECASE)
    if not match:
        raise ValueError(f"Energy Auditing source does not match L##/T## naming: {package_name}")
    kind = match.group("kind").upper()
    number = int(match.group("number"))
    title = Path(match.group("title")).stem
    # I keep duplicate sequence numbers distinct (the two T09 tutorial decks).
    source_id = safe_slug(f"{kind}{number:02d}-{title}")
    return {
        "id": source_id,
        "kind": "lecture" if kind == "L" else "tutorial",
        "prefix": kind,
        "sequence": number,
        "filename": filename,
        "packagePath": package_name,
    }


def sort_deck_names(names: Iterable[str]) -> list[str]:
    def key(name: str) -> tuple[int, int, str]:
        identity = deck_identity(name)
        return (0 if identity["kind"] == "lecture" else 1, int(identity["sequence"]), name.lower())

    return sorted(names, key=key)


def source_deck_infos(archive: Path) -> list[dict[str, Any]]:
    if not archive.is_file():
        raise FileNotFoundError(f"source archive not found: {archive}")
    with zipfile.ZipFile(archive) as handle:
        names = [
            info.filename
            for info in handle.infolist()
            if info.filename.lower().endswith(".pptx")
            and info.filename.startswith(COURSE_PREFIX)
            and not info.is_dir()
        ]
        if len(names) != EXPECTED_DECKS:
            raise RuntimeError(f"expected {EXPECTED_DECKS} Energy Auditing decks, found {len(names)}")
        return [deck_identity(name) for name in sort_deck_names(names)]


def safe_target(root: Path, relative: str) -> Path:
    destination = (root / relative).resolve()
    root_resolved = root.resolve()
    try:
        destination.relative_to(root_resolved)
    except ValueError as exc:
        raise RuntimeError(f"archive path escapes extraction root: {relative}") from exc
    return destination


def extract_deck_file(archive: Path, package_path: str, destination: Path, force: bool = False) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and not force:
        return
    with zipfile.ZipFile(archive) as handle, handle.open(package_path) as source, destination.open("wb") as target:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            target.write(chunk)


def relationship_target(slide_path: str, target: str) -> str:
    if target.startswith("/"):
        return posixpath.normpath(target.lstrip("/"))
    return posixpath.normpath(posixpath.join(posixpath.dirname(slide_path), target))


def parse_relationships(package: zipfile.ZipFile, slide_path: str) -> list[dict[str, Any]]:
    rel_path = posixpath.join(
        posixpath.dirname(slide_path), "_rels", f"{posixpath.basename(slide_path)}.rels"
    )
    if rel_path not in package.namelist():
        return []
    root = ET.fromstring(package.read(rel_path))
    relationships: list[dict[str, Any]] = []
    for relationship in root.iter():
        if xml_local_name(relationship.tag) != "Relationship":
            continue
        target = str(relationship.attrib.get("Target") or "")
        resolved = relationship_target(slide_path, target) if target else ""
        package_entry = None
        if resolved in package.namelist():
            info = package.getinfo(resolved)
            package_entry = {
                "packagePath": resolved,
                "bytes": info.file_size,
                "sha256": sha256_bytes(package.read(resolved)),
            }
        relationships.append({
            "id": relationship.attrib.get("Id"),
            "type": relationship.attrib.get("Type"),
            "target": target,
            "targetMode": relationship.attrib.get("TargetMode"),
            "resolved": resolved,
            "packageEntry": package_entry,
        })
    return relationships


def parse_notes(package: zipfile.ZipFile, notes_path: str) -> dict[str, Any]:
    root = ET.fromstring(package.read(notes_path))
    paragraphs: list[str] = []
    for shape in root.iter():
        if xml_local_name(shape.tag) != "sp":
            continue
        text = "\n".join(text_nodes(shape)).strip()
        if text:
            paragraphs.append(text)
    return {
        "packagePath": notes_path,
        "text": normalize_ws("\n".join(paragraphs)),
        "paragraphs": paragraphs,
    }


def parse_table(table: ET.Element) -> list[list[str]]:
    rows: list[list[str]] = []
    for row in table.iter():
        if xml_local_name(row.tag) != "tr":
            continue
        cells: list[str] = []
        for cell in row:
            if xml_local_name(cell.tag) != "tc":
                continue
            cells.append(element_text(cell))
        if cells:
            rows.append(cells)
    return rows


def parse_slide(package: zipfile.ZipFile, slide_path: str, number: int) -> dict[str, Any]:
    root = ET.fromstring(package.read(slide_path))
    shape_tree = next((element for element in root.iter() if xml_local_name(element.tag) == "spTree"), root)
    shapes: list[dict[str, Any]] = []
    tables: list[dict[str, Any]] = []
    equations: list[dict[str, Any]] = []
    slide_text_parts: list[str] = []
    for index, child in enumerate(list(shape_tree)):
        local = xml_local_name(child.tag)
        if local in {"nvGrpSpPr", "grpSpPr"}:
            continue
        shape_text = "\n".join(text_nodes(child)).strip()
        if shape_text:
            slide_text_parts.append(shape_text)
        record: dict[str, Any] = {
            "index": index,
            "type": local,
            "text": shape_text,
        }
        placeholder = next((element for element in child.iter() if xml_local_name(element.tag) == "ph"), None)
        if placeholder is not None:
            record["placeholder"] = {
                key: xml_attr(placeholder, key)
                for key in ("type", "idx", "sz", "orient")
                if xml_attr(placeholder, key) is not None
            }
        shapes.append(record)
        for table in child.iter():
            if xml_local_name(table.tag) == "tbl":
                tables.append({"shapeIndex": index, "rows": parse_table(table)})
    for element in root.iter():
        local = xml_local_name(element.tag)
        if local not in {"oMath", "oMathPara"}:
            continue
        equations.append({
            "text": element_text(element),
            "xml": ET.tostring(element, encoding="unicode"),
        })
    relationships = parse_relationships(package, slide_path)
    media = [
        relation["packageEntry"] | {
            "relationshipId": relation.get("id"),
            "relationshipType": relation.get("type"),
            "target": relation.get("target"),
        }
        for relation in relationships
        if relation.get("packageEntry") and (
            "/media/" in str(relation["packageEntry"].get("packagePath"))
            or str(relation.get("type") or "").lower().endswith(('/image', '/audio', '/video'))
        )
    ]
    notes = None
    for relation in relationships:
        resolved = str(relation.get("resolved") or "")
        if "/notesSlides/" in resolved and resolved in package.namelist():
            notes = parse_notes(package, resolved)
            break
    return {
        "slideIndex": number - 1,
        "slideNumber": number,
        "packagePath": slide_path,
        "text": normalize_ws("\n".join(slide_text_parts)),
        "shapes": shapes,
        "tables": tables,
        "equations": equations,
        "relationships": relationships,
        "media": media,
        "speakerNotes": notes,
    }


def slide_paths(package: zipfile.ZipFile) -> list[str]:
    paths = [
        name
        for name in package.namelist()
        if re.fullmatch(r"ppt/slides/slide\d+\.xml", name, flags=re.IGNORECASE)
    ]
    return sorted(paths, key=lambda value: int(re.search(r"slide(\d+)", value, re.IGNORECASE).group(1)))


def extract_native(deck_path: Path, identity: Mapping[str, Any], output_path: Path) -> dict[str, Any]:
    output_root = output_path.parent.parent
    media_root = output_path.parent / "assets" / str(identity["id"])
    media_root.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(deck_path) as package:
        paths = slide_paths(package)
        slides = [
            parse_slide(package, path, int(re.search(r"slide(\d+)", path, re.IGNORECASE).group(1)))
            for path in paths
        ]
        package_entries: list[dict[str, Any]] = []
        extracted_by_package_path: dict[str, str] = {}
        for info in package.infolist():
            if info.is_dir() or "/media/" not in info.filename:
                continue
            content = package.read(info.filename)
            # I preserve the package-relative media name while keeping all
            # extracted bytes inside the isolated pipeline workspace.
            relative_media = PurePosixPath(info.filename).relative_to("ppt/media")
            destination = media_root.joinpath(*relative_media.parts)
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(content)
            extracted_path = str(destination.relative_to(output_root)).replace("\\", "/")
            extracted_by_package_path[info.filename] = extracted_path
            package_entries.append({
                "path": info.filename,
                "bytes": info.file_size,
                "sha256": sha256_bytes(content),
                "extractedPath": extracted_path,
            })
    for slide in slides:
        for media in slide.get("media", []):
            package_path = media.get("packagePath")
            if package_path in extracted_by_package_path:
                media["extractedPath"] = extracted_by_package_path[package_path]
    result = {
        "schemaVersion": 1,
        "generatedAt": now_iso(),
        "source": dict(identity),
        "deck": {
            "path": deck_path.name,
            "bytes": deck_path.stat().st_size,
            "sha256": sha256_file(deck_path),
            "slideCount": len(slides),
        },
        "mediaPackageEntries": package_entries,
        "slides": slides,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return result


def archive_sha256(path: Path) -> str:
    return sha256_file(path)


def manifest_relative_path(path: Path, output_root: Path) -> str:
    """Return a stable repo-relative artifact path when possible."""
    resolved = path.resolve()
    try:
        return str(resolved.relative_to(ROOT)).replace("\\", "/")
    except ValueError:
        return str(resolved.relative_to(output_root.resolve())).replace("\\", "/")


def resolve_workspace_path(value: str, output_root: Path) -> Path:
    """Resolve either a workspace-relative or repo-relative manifest path."""
    candidate = Path(value)
    if candidate.is_absolute():
        return candidate
    workspace_candidate = output_root / candidate
    if workspace_candidate.is_file():
        return workspace_candidate
    repo_candidate = ROOT / candidate
    if repo_candidate.is_file():
        return repo_candidate
    return workspace_candidate


def build_native_workspace(
    archive: Path,
    output_root: Path,
    manifest_path: Path,
    force: bool = False,
) -> dict[str, Any]:
    output_root.mkdir(parents=True, exist_ok=True)
    source_root = output_root / "source"
    native_root = output_root / "native"
    identities = source_deck_infos(archive)
    source_records: list[dict[str, Any]] = []
    with zipfile.ZipFile(archive) as package:
        by_path = {info.filename: info for info in package.infolist()}
        for identity in identities:
            package_path = str(identity["packagePath"])
            info = by_path[package_path]
            destination = source_root / f"{identity['id']}.pptx"
            extract_deck_file(archive, package_path, destination, force=force)
            native_path = native_root / f"{identity['id']}.json"
            if native_path.exists() and not force:
                native_result = json.loads(native_path.read_text(encoding="utf-8"))
            else:
                native_result = extract_native(destination, identity, native_path)
            record = {
                **identity,
                "bytes": info.file_size,
                "sha256": sha256_file(destination),
                "slideCount": int(native_result["deck"]["slideCount"]),
                "nativePath": manifest_relative_path(native_path, output_root),
                "extractedPath": manifest_relative_path(destination, output_root),
            }
            source_records.append(record)
    lectures = [record for record in source_records if record["kind"] == "lecture"]
    tutorials = [record for record in source_records if record["kind"] == "tutorial"]
    total_slides = sum(int(record["slideCount"]) for record in source_records)
    archive_digest = archive_sha256(archive)
    manifest = {
        "schemaVersion": 1,
        "course": {
            "code": "ELE 4446",
            "name": "Energy Auditing",
            "studyOsId": "SEM7-EA",
        },
        "generatedAt": now_iso(),
        "archive": {
            "name": archive.name,
            "sha256": archive_digest,
            "entryCount": len(package.namelist()),
            "deckCount": len(source_records),
        },
        "expectedCounts": {
            "decks": EXPECTED_DECKS,
            "lectures": EXPECTED_LECTURES,
            "tutorials": EXPECTED_TUTORIALS,
            "slides": EXPECTED_SLIDES,
        },
        "actualCounts": {
            "decks": len(source_records),
            "lectures": len(lectures),
            "tutorials": len(tutorials),
            "slides": total_slides,
        },
        "files": source_records,
        "specialCases": [
            {
                "id": "t09-electricmotors-fans-pumps",
                "note": "Tutorial T09 Electric Motors/Fans/Pumps is a separate deck from T09 HVAC Systems.",
            },
            {
                "id": "t09-hvac-systems",
                "note": "Tutorial T09 HVAC Systems is a separate deck from T09 Electric Motors/Fans/Pumps.",
            },
        ],
    }
    if manifest["actualCounts"] != manifest["expectedCounts"]:
        raise RuntimeError(
            "Energy Auditing source counts do not match the plan: "
            f"expected {manifest['expectedCounts']}, actual {manifest['actualCounts']}"
        )
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (output_root / "native-summary.json").write_text(
        json.dumps({"generatedAt": now_iso(), "manifest": str(manifest_path), "counts": manifest["actualCounts"]}, indent=2)
        + "\n",
        encoding="utf-8",
    )
    return manifest


def require_api_key(env_name: str) -> str:
    value = os.environ.get(env_name, "").strip()
    if not value:
        raise RuntimeError(
            f"{env_name} is not set; OCR is fail-closed. "
            f"Run the native phase first, then rerun with {env_name} in the process environment."
        )
    return value


def data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def redact(value: str, secret: str) -> str:
    return value.replace(secret, "[REDACTED]") if secret else value


class MistralOcrRequestError(RuntimeError):
    """HTTP failure with structured fields needed for safe transport fallback."""

    def __init__(
        self,
        message: str,
        status_code: int,
        code: str | None = None,
        error_type: str | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.error_type = error_type


def call_mistral_ocr(
    deck_path: Path,
    api_key: str,
    model: str,
    include_image_base64: bool,
    timeout: int = 900,
) -> dict[str, Any]:
    try:
        import requests  # type: ignore
    except ImportError as exc:
        raise RuntimeError("requests is required for the Mistral OCR phase") from exc
    payload = {
        "model": model,
        "document": {"type": "document_url", "document_url": data_url(deck_path)},
        "include_image_base64": include_image_base64,
        "table_format": "markdown",
        "include_blocks": True,
        # I request block granularity so page aggregates and per-block
        # confidence objects are retained without the much larger word output.
        # I retain the raw response verbatim below.
        "confidence_scores_granularity": "block",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    for attempt in range(1, 7):
        response = requests.post(MISTRAL_OCR_URL, headers=headers, json=payload, timeout=timeout)
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 6:
            retry_after = response.headers.get("retry-after", "")
            delay = float(retry_after) if re.fullmatch(r"\d+(?:\.\d+)?", retry_after) else min(60, 2**attempt)
            time.sleep(delay)
            continue
        if not response.ok:
            error_code = None
            error_type = None
            try:
                error_payload = response.json()
                if isinstance(error_payload, Mapping):
                    error_code = error_payload.get("code")
                    error_type = error_payload.get("type")
                    nested_error = error_payload.get("error")
                    if error_code is None and isinstance(nested_error, Mapping):
                        error_code = nested_error.get("code")
                    if error_type is None and isinstance(nested_error, Mapping):
                        error_type = nested_error.get("type")
            except ValueError:
                pass
            raise MistralOcrRequestError(
                f"Mistral OCR request failed for {deck_path.name} ({response.status_code}): "
                f"{redact(response.text[:500], api_key)}",
                status_code=response.status_code,
                code=str(error_code) if error_code else None,
                error_type=str(error_type) if error_type else None,
            )
        result = response.json()
        if not isinstance(result, dict):
            raise RuntimeError(f"Mistral OCR returned a non-object response for {deck_path.name}")
        return result
    raise RuntimeError(f"Mistral OCR request exhausted retries for {deck_path.name}")


def convert_parser_invalid_pptx_to_pdf(
    source_path: Path,
    identity: Mapping[str, Any],
    output_root: Path,
    force: bool,
) -> tuple[Path, dict[str, Any]]:
    """Convert only a Mistral parser-invalid deck, preserving source identity."""
    fallback_root = output_root / "ocr-fallback" / str(identity["id"])
    fallback_root.mkdir(parents=True, exist_ok=True)
    conversion_path = fallback_root / "conversion.json"
    pdf_path = fallback_root / f"{source_path.stem}.pdf"
    source_sha256 = sha256_file(source_path)
    if conversion_path.is_file() and pdf_path.is_file() and not force:
        existing = json.loads(conversion_path.read_text(encoding="utf-8"))
        if existing.get("sourceSha256") == source_sha256 and existing.get("pdfSha256") == sha256_file(pdf_path):
            return pdf_path, existing

    executable = shutil.which("libreoffice") or shutil.which("soffice")
    if not executable:
        raise RuntimeError("LibreOffice/soffice is required for parser-invalid PPTX fallback")
    profile = fallback_root / "profile"
    profile.mkdir(parents=True, exist_ok=True)
    command = [
        executable,
        "--headless",
        f"-env:UserInstallation={profile.as_uri()}",
        "--convert-to",
        "pdf:impress_pdf_Export",
        "--outdir",
        str(fallback_root),
        str(source_path),
    ]
    result = subprocess.run(
        command,
        cwd=fallback_root,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=900,
        check=False,
    )
    if result.returncode != 0:
        details = (result.stderr or result.stdout or "conversion failed").strip()[-600:]
        raise RuntimeError(f"LibreOffice PPTX-to-PDF conversion failed ({result.returncode}): {details}")
    if not pdf_path.is_file():
        candidates = sorted(fallback_root.glob("*.pdf"))
        if len(candidates) == 1:
            candidates[0].replace(pdf_path)
    if not pdf_path.is_file():
        raise RuntimeError(f"LibreOffice completed without producing {pdf_path.name}")
    metadata = {
        "schemaVersion": 1,
        "status": "ok",
        "transport": "pdf_conversion",
        "warning": (
            "Mistral rejected the original PPTX as document_parser_invalid_file; "
            "OCR used a LibreOffice PDF conversion while native extraction remains sourced from the original deck."
        ),
        "sourcePath": manifest_relative_path(source_path, output_root),
        "sourceSha256": source_sha256,
        "pdfPath": manifest_relative_path(pdf_path, output_root),
        "pdfSha256": sha256_file(pdf_path),
        "command": command,
        "generatedAt": now_iso(),
    }
    conversion_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return pdf_path, metadata


def confidence_value(value: Any) -> Any:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return value
    if isinstance(value, str) and re.fullmatch(r"\d+(?:\.\d+)?", value.strip()):
        return float(value)
    return value


def normalize_ocr_page(page: Mapping[str, Any], index: int) -> dict[str, Any]:
    blocks = page.get("blocks")
    if not isinstance(blocks, list):
        blocks = []
    block_confidences: list[dict[str, Any]] = []
    for block_index, block in enumerate(blocks):
        if not isinstance(block, Mapping):
            block_confidences.append({"index": block_index, "confidence": None})
            continue
        confidence = block.get("confidence_scores")
        if confidence is None:
            for key in ("confidence", "score", "confidence_score"):
                if key in block:
                    confidence = confidence_value(block.get(key))
                    break
        block_confidences.append({
            "index": block_index,
            "type": block.get("type"),
            "confidence": confidence,
        })
    page_confidence = page.get("confidence_scores")
    if page_confidence is None:
        for key in ("confidence", "score", "confidence_score"):
            if key in page:
                page_confidence = confidence_value(page.get(key))
                break
    images = page.get("images")
    if not isinstance(images, list):
        images = []
    # I do not duplicate image base64 in normalized/reconciled files.  I keep
    # the raw response untouched so I can recover the exact bytes later.
    image_metadata = [
        {key: value for key, value in image.items() if key not in {"image_base64", "base64"}}
        for image in images
        if isinstance(image, Mapping)
    ]
    return {
        "pageIndex": index,
        "pageNumber": index + 1,
        "markdown": str(page.get("markdown") or ""),
        "confidence": page_confidence,
        "confidenceScores": page.get("confidence_scores"),
        "blockConfidences": block_confidences,
        "blocks": blocks,
        "images": image_metadata,
        "rawKeys": sorted(str(key) for key in page.keys()),
    }


def write_ocr_outputs(
    identity: Mapping[str, Any],
    ocr_input_path: Path,
    raw_response: dict[str, Any],
    output_root: Path,
    model: str,
    api_key: str,
    original_source_sha256: str,
    transport: str = "pptx",
    transport_metadata: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    target = output_root / "ocr" / str(identity["id"])
    target.mkdir(parents=True, exist_ok=True)
    raw_path = target / "response.json"
    raw_path.write_text(json.dumps(raw_response, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    raw_pages = raw_response.get("pages")
    if not isinstance(raw_pages, list):
        raw_pages = []
    pages = [
        normalize_ocr_page(page, index)
        for index, page in enumerate(raw_pages)
        if isinstance(page, Mapping)
    ]
    pages_path = target / "pages.json"
    pages_path.write_text(json.dumps(pages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {
        "schemaVersion": 1,
        "generatedAt": now_iso(),
        "source": dict(identity),
        "provider": "mistral",
        "model": model,
        "status": "ok",
        "confidenceScoresGranularity": "block",
        "sourceSha256": original_source_sha256,
        "ocrInputSha256": sha256_file(ocr_input_path),
        "ocrInputPath": manifest_relative_path(ocr_input_path, output_root),
        "transport": transport,
        "transportWarning": (transport_metadata or {}).get("warning"),
        "transportMetadata": dict(transport_metadata) if transport_metadata else None,
        "pageCount": len(pages),
        "slideCount": int(identity.get("slideCount") or 0),
        "pageCountMatchesSlideCount": len(pages) == int(identity.get("slideCount") or 0),
        "markdownChars": sum(len(str(page.get("markdown") or "")) for page in pages),
        "pages": [
            {
                "pageIndex": page["pageIndex"],
                "pageNumber": page["pageNumber"],
                "confidence": page.get("confidence"),
                "confidenceScores": page.get("confidenceScores"),
                "blockCount": len(page.get("blocks") or []),
                "blockConfidences": page.get("blockConfidences") or [],
            }
            for page in pages
        ],
        "rawResponsePath": str(raw_path.relative_to(output_root)).replace("\\", "/"),
        "normalizedPagesPath": str(pages_path.relative_to(output_root)).replace("\\", "/"),
    }
    (target / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # I use this value only to prove that my key was supplied in this process.
    # I never persist it; keeping the argument explicit also makes accidental
    # logging of it harder during later refactors.
    del api_key
    return report


def load_manifest(manifest_path: Path) -> dict[str, Any]:
    if not manifest_path.is_file():
        raise FileNotFoundError(f"source manifest not found: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict) or not isinstance(manifest.get("files"), list):
        raise ValueError(f"invalid Energy Auditing source manifest: {manifest_path}")
    return manifest


def known_parser_invalid_error(error_path: Path, source_sha256: str) -> bool:
    """Detect a prior same-source parser rejection without retrying the PPTX."""
    if not error_path.is_file():
        return False
    try:
        payload = json.loads(error_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    if not isinstance(payload, Mapping) or payload.get("status") != "error":
        return False
    source = payload.get("source")
    if isinstance(source, Mapping) and source.get("sha256") not in {None, source_sha256}:
        return False
    serialized = json.dumps(payload, ensure_ascii=False)
    return "document_parser_invalid_file" in serialized or '"code": "3740"' in serialized


def run_ocr(
    manifest_path: Path,
    output_root: Path,
    api_key_env: str,
    model: str,
    force: bool,
    include_image_base64: bool,
    only_ids: set[str] | None = None,
) -> dict[str, Any]:
    api_key = require_api_key(api_key_env)
    manifest = load_manifest(manifest_path)
    native_root = output_root / "source"
    results: list[dict[str, Any]] = []
    for file_record in manifest["files"]:
        identity = file_record
        if only_ids is not None and str(file_record["id"]) not in only_ids:
            continue
        source_path = resolve_workspace_path(str(file_record["extractedPath"]), output_root)
        target = output_root / "ocr" / str(file_record["id"])
        report_path = target / "report.json"
        error_path = target / "error.json"
        skip_known_invalid_pptx = known_parser_invalid_error(error_path, str(file_record["sha256"]))
        if report_path.is_file() and not force:
            existing_report = json.loads(report_path.read_text(encoding="utf-8"))
            if (
                existing_report.get("status") == "ok"
                and existing_report.get("sourceSha256") == file_record.get("sha256")
                and existing_report.get("model") == model
                and existing_report.get("confidenceScoresGranularity") == "block"
            ):
                results.append(existing_report)
                error_path.unlink(missing_ok=True)
                print(f"OCR {file_record['id']}: reusing existing response", flush=True)
                continue
            print(f"OCR {file_record['id']}: existing response is stale; refreshing", flush=True)
            for stale_path in (target / "response.json", target / "pages.json", target / "report.json", target / "error.json"):
                stale_path.unlink(missing_ok=True)
        if not source_path.is_file():
            raise FileNotFoundError(f"extracted source deck missing: {source_path}")
        # I replace any prior error record on retry; a failed attempt below
        # writes a fresh one.
        error_path.unlink(missing_ok=True)
        if force:
            # I remove prior responses on a forced run so reconciliation cannot
            # mistake a stale success for the current attempt.
            for stale_path in (target / "response.json", target / "pages.json", target / "report.json", target / "error.json"):
                stale_path.unlink(missing_ok=True)
        transport = "pptx"
        transport_metadata: dict[str, Any] | None = None
        try:
            ocr_input_path = source_path
            try:
                if skip_known_invalid_pptx:
                    raise MistralOcrRequestError(
                        "same-source Mistral parser rejection is already recorded; using PDF fallback",
                        status_code=400,
                        code="3740",
                        error_type="document_parser_invalid_file",
                    )
                response = call_mistral_ocr(
                    ocr_input_path,
                    api_key,
                    model,
                    include_image_base64=include_image_base64,
                )
            except MistralOcrRequestError as direct_error:
                if not (
                    direct_error.status_code == 400
                    and (
                        direct_error.code in {"document_parser_invalid_file", "3740"}
                        or direct_error.error_type == "document_parser_invalid_file"
                    )
                    and source_path.suffix.lower() == ".pptx"
                ):
                    raise
                print(
                    f"OCR {file_record['id']}: Mistral rejected PPTX parser; converting to PDF fallback",
                    flush=True,
                )
                ocr_input_path, transport_metadata = convert_parser_invalid_pptx_to_pdf(
                    source_path,
                    identity,
                    output_root,
                    force=force,
                )
                transport = "pdf_conversion"
                response = call_mistral_ocr(
                    ocr_input_path,
                    api_key,
                    model,
                    include_image_base64=include_image_base64,
                )
            report = write_ocr_outputs(
                identity,
                ocr_input_path,
                response,
                output_root,
                model,
                api_key,
                original_source_sha256=str(file_record["sha256"]),
                transport=transport,
                transport_metadata=transport_metadata,
            )
            results.append(report)
            transport_note = f" via {transport}" if transport != "pptx" else ""
            print(f"OCR {file_record['id']}: {report['pageCount']} pages{transport_note}", flush=True)
        except Exception as exc:  # I continue so one transient file cannot hide the rest.
            message = redact(str(exc), api_key)
            error = {
                "schemaVersion": 1,
                "generatedAt": now_iso(),
                "source": dict(identity),
                "provider": "mistral",
                "model": model,
                "status": "error",
                "sourceSha256": str(file_record["sha256"]),
                "transport": transport,
                "transportMetadata": transport_metadata,
                "error": message,
            }
            target.mkdir(parents=True, exist_ok=True)
            (target / "error.json").write_text(json.dumps(error, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            results.append(error)
            print(f"OCR {file_record['id']}: failed ({message})", file=sys.stderr, flush=True)
    summary = {
        "schemaVersion": 1,
        "generatedAt": now_iso(),
        "provider": "mistral",
        "model": model,
        "manifest": str(manifest_path),
        "deckCount": len(results),
        "successCount": sum(result.get("status") == "ok" for result in results),
        "failureCount": sum(result.get("status") == "error" for result in results),
        "results": [
            {
                "id": result.get("source", {}).get("id"),
                "status": result.get("status"),
                "pageCount": result.get("pageCount"),
                "transport": result.get("transport"),
                "transportWarning": result.get("transportWarning"),
                "error": result.get("error"),
            }
            for result in results
        ],
    }
    (output_root / "ocr-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if summary["failureCount"]:
        raise RuntimeError(f"Mistral OCR failed for {summary['failureCount']} of {summary['deckCount']} decks; see {output_root / 'ocr-summary.json'}")
    # I drop the local reference before returning; the environment remains my
    # caller's concern.
    del api_key
    del native_root
    return summary


def normalized_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip().lower()


def run_reconcile(manifest_path: Path, output_root: Path) -> dict[str, Any]:
    manifest = load_manifest(manifest_path)
    reconcile_root = output_root / "reconciled"
    reports: list[dict[str, Any]] = []
    for file_record in manifest["files"]:
        source_id = str(file_record["id"])
        native_path = resolve_workspace_path(str(file_record["nativePath"]), output_root)
        ocr_dir = output_root / "ocr" / source_id
        output_path = reconcile_root / f"{source_id}.json"
        native = json.loads(native_path.read_text(encoding="utf-8")) if native_path.is_file() else None
        ocr_report_path = ocr_dir / "report.json"
        ocr_pages_path = ocr_dir / "pages.json"
        ocr_report = json.loads(ocr_report_path.read_text(encoding="utf-8")) if ocr_report_path.is_file() else None
        ocr_pages = json.loads(ocr_pages_path.read_text(encoding="utf-8")) if ocr_pages_path.is_file() else []
        if not isinstance(ocr_pages, list):
            ocr_pages = []
        native_slides = native.get("slides", []) if isinstance(native, dict) else []
        slides: list[dict[str, Any]] = []
        total = max(len(native_slides), len(ocr_pages))
        for index in range(total):
            native_slide = native_slides[index] if index < len(native_slides) else None
            ocr_page = ocr_pages[index] if index < len(ocr_pages) else None
            native_text = str(native_slide.get("text") or "") if isinstance(native_slide, Mapping) else ""
            markdown = str(ocr_page.get("markdown") or "") if isinstance(ocr_page, Mapping) else ""
            similarity = None
            if native_text or markdown:
                similarity = round(SequenceMatcher(None, normalized_text(native_text), normalized_text(markdown)).ratio(), 6)
            slides.append({
                "slideIndex": index,
                "slideNumber": index + 1,
                "nativeText": native_text,
                "nativeCharCount": len(native_text),
                "ocrMarkdown": markdown,
                "ocrCharCount": len(markdown),
                "textSimilarity": similarity,
                "ocrConfidence": ocr_page.get("confidence") if isinstance(ocr_page, Mapping) else None,
                "ocrConfidenceScores": ocr_page.get("confidenceScores") if isinstance(ocr_page, Mapping) else None,
                "ocrBlockConfidences": ocr_page.get("blockConfidences", []) if isinstance(ocr_page, Mapping) else [],
                "ocrBlocks": ocr_page.get("blocks", []) if isinstance(ocr_page, Mapping) else [],
                "ocrImages": ocr_page.get("images", []) if isinstance(ocr_page, Mapping) else [],
                "status": "matched" if native_slide is not None and ocr_page is not None else (
                    "native_only" if native_slide is not None else "ocr_only"
                ),
            })
        result = {
            "schemaVersion": 1,
            "generatedAt": now_iso(),
            "source": dict(file_record),
            "native": {
                "path": str(native_path.relative_to(output_root)).replace("\\", "/") if native_path.is_file() else None,
                "slideCount": len(native_slides),
            },
            "ocr": {
                "reportPath": str(ocr_report_path.relative_to(output_root)).replace("\\", "/") if ocr_report_path.is_file() else None,
                "status": ocr_report.get("status") if isinstance(ocr_report, Mapping) else "missing",
                "model": ocr_report.get("model") if isinstance(ocr_report, Mapping) else None,
                "pageCount": len(ocr_pages),
            },
            "coverage": {
                "nativeSlides": len(native_slides),
                "ocrPages": len(ocr_pages),
                "matched": sum(slide["status"] == "matched" for slide in slides),
                "nativeOnly": sum(slide["status"] == "native_only" for slide in slides),
                "ocrOnly": sum(slide["status"] == "ocr_only" for slide in slides),
            },
            "slides": slides,
        }
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        reports.append({
            "id": source_id,
            "status": result["ocr"]["status"],
            **result["coverage"],
            "path": str(output_path.relative_to(output_root)).replace("\\", "/"),
        })
        file_record["ocr"] = {
            "provider": ocr_report.get("provider") if isinstance(ocr_report, Mapping) else None,
            "model": ocr_report.get("model") if isinstance(ocr_report, Mapping) else None,
            "status": ocr_report.get("status") if isinstance(ocr_report, Mapping) else "missing",
            "reportPath": manifest_relative_path(ocr_report_path, output_root) if ocr_report_path.is_file() else None,
            "pageCount": len(ocr_pages),
            "confidenceFieldCount": sum(
                int(page.get("confidence") is not None)
                + len(page.get("blockConfidences") or [])
                for page in ocr_pages if isinstance(page, Mapping)
            ),
            "transport": (
                ocr_report.get("transport") or "pptx_data_url"
                if isinstance(ocr_report, Mapping) and ocr_report.get("status") == "ok"
                else None
            ),
            "transportWarning": ocr_report.get("transportWarning") if isinstance(ocr_report, Mapping) else None,
        }
        file_record["reconciliationPath"] = manifest_relative_path(output_path, output_root)
    summary = {
        "schemaVersion": 1,
        "generatedAt": now_iso(),
        "manifest": str(manifest_path),
        "deckCount": len(reports),
        "matchedSlides": sum(report["matched"] for report in reports),
        "nativeOnlySlides": sum(report["nativeOnly"] for report in reports),
        "ocrOnlyPages": sum(report["ocrOnly"] for report in reports),
        "reports": reports,
    }
    (reconcile_root / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    manifest["ocrSummary"] = {
        "provider": "mistral",
        "model": "mistral-ocr-latest",
        "successCount": sum(report["status"] == "ok" for report in reports),
        "failureCount": sum(report["status"] != "ok" for report in reports),
        "matchedSlides": summary["matchedSlides"],
        "nativeOnlySlides": summary["nativeOnlySlides"],
        "ocrOnlyPages": summary["ocrOnlyPages"],
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--phase", choices=("native", "ocr", "reconcile", "all"), default="all")
    parser.add_argument("--archive", type=Path, default=DEFAULT_ARCHIVE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--api-key-env", default="MISTRAL_API_KEY")
    parser.add_argument("--model", default=DEFAULT_MISTRAL_MODEL)
    parser.add_argument(
        "--only",
        action="append",
        default=[],
        metavar="SOURCE_ID",
        help="OCR only these source IDs (repeatable; useful for a targeted retry such as the PDF fallback)",
    )
    parser.add_argument("--force", action="store_true", help="regenerate existing extracted/OCR/reconciled artifacts")
    parser.add_argument(
        "--include-image-base64",
        action="store_true",
        help="ask Mistral to include OCR image base64 in raw responses (larger temporary artifacts)",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    archive = args.archive.resolve()
    output_root = args.output.resolve()
    manifest_path = args.manifest.resolve()
    if args.phase in {"native", "all"}:
        build_native_workspace(archive, output_root, manifest_path, force=args.force)
        print(f"Native Energy Auditing extraction complete: {manifest_path}", flush=True)
    if args.phase in {"ocr", "all"}:
        run_ocr(
            manifest_path,
            output_root,
            api_key_env=args.api_key_env,
            model=args.model,
            force=args.force,
            include_image_base64=args.include_image_base64,
            only_ids=set(args.only) if args.only else None,
        )
        print(f"Mistral OCR complete: {output_root / 'ocr-summary.json'}", flush=True)
    if args.phase in {"reconcile", "all"}:
        summary = run_reconcile(manifest_path, output_root)
        print(
            f"Reconciliation complete: {summary['matchedSlides']} matched slides, "
            f"{summary['nativeOnlySlides']} native-only, {summary['ocrOnlyPages']} OCR-only",
            flush=True,
        )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit("Interrupted")
