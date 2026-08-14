"""Resumable Quantum CAT Quant OCR, note authoring, and question curation.

Paid provider calls happen only in ``ocr``, ``notes``, or ``curate`` without
``--dry-run``. OCR/model artifacts are ignored; reviewed native CAT rows and
learner notes are the only tracked outputs.
"""

from __future__ import annotations

import argparse
import base64
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
import mimetypes
import os
import re
import shutil
import tempfile
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import requests
from json_repair import repair_json
from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = ROOT / "data" / "exams" / "cat" / "quant"
SOURCE_MANIFEST = DATA_ROOT / "book-sources" / "manifest.json"
CHAPTER_MAP = DATA_ROOT / "book-sources" / "chapters.json"
OCR_ROOT = DATA_ROOT / "ocr"
SEGMENTS_ROOT = DATA_ROOT / "segments"
REVIEW_ROOT = DATA_ROOT / "review"
DEEP_NOTES_ROOT = DATA_ROOT / "deep-notes"
QUESTION_BANK = DATA_ROOT / "book-imports" / "questions.json"
DOCS_ROOT = ROOT / "docs" / "cat" / "quant"
MISTRAL_URL = "https://api.mistral.ai/v1/ocr"
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
MISTRAL_MODEL = "mistral-ocr-4-0"
DEEPSEEK_MODEL = "deepseek-v4-flash"
SOURCE_ID = "quantum-cat-sarvesh-k-verma"
NOTE_CHUNK_CHARS = 80_000
REVIEW_BATCH_SIZE = 20
REVIEW_WORKERS = max(1, int(os.environ.get("CAT_REVIEW_WORKERS", "6")))

QUESTION_START = re.compile(
    r"(?im)^[ \t]*(?:(\d{1,3})(?:[ \t]*[.)][ \t]+|[ \t]+)(?=\S)|Exp\.?[ \t]*(\d{1,3})[ \t]*\)[ \t]*)"
)
OPTION_TOKEN = re.compile(r"(?i)(?<!\w)[(\[]?([a-d])[)\].:]\s*")
NOISE = re.compile(r"(?i)^\s*(?:quantum\s+cat|chapter\s+\d+|solutions?\s*$|answers?\s*$|practice\s+exercise\s*$)")


@dataclass(frozen=True)
class Chapter:
    number: int
    slug: str
    title: str
    topic: str
    start_page: int
    end_page: int

    @property
    def page_count(self) -> int:
        return self.end_page - self.start_page + 1


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def chapters() -> list[Chapter]:
    values = load_json(CHAPTER_MAP)["chapters"]
    return [Chapter(
        number=int(value["number"]),
        slug=str(value["slug"]),
        title=str(value["title"]),
        topic=str(value["topic"]),
        start_page=int(value["startPage"]),
        end_page=int(value["endPage"]),
    ) for value in values]


def source_record() -> dict[str, Any]:
    sources = load_json(SOURCE_MANIFEST)["sources"]
    return next(source for source in sources if source["id"] == SOURCE_ID)


def source_path() -> Path:
    return Path(str(source_record()["file"]))


def require_key(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} is not configured")
    return value


def retry_post(url: str, headers: dict[str, str], payload: dict[str, Any], timeout: int = 900) -> dict[str, Any]:
    for attempt in range(1, 7):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=timeout)
        except requests.RequestException as exc:
            if attempt >= 6:
                raise
            delay = min(60, 2**attempt)
            print(
                f"Provider transport error ({type(exc).__name__}); retrying in {delay:g}s "
                f"(attempt {attempt}/6)",
                flush=True,
            )
            time.sleep(delay)
            continue
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 6:
            retry_after = response.headers.get("retry-after", "")
            delay = float(retry_after) if retry_after.replace(".", "", 1).isdigit() else min(60, 2**attempt)
            print(f"Provider returned {response.status_code}; retrying in {delay:g}s (attempt {attempt}/6)", flush=True)
            time.sleep(delay)
            continue
        if not response.ok:
            raise RuntimeError(f"Provider request failed ({response.status_code}): {response.text[:1000]}")
        return response.json()
    raise RuntimeError("Provider request exhausted retries")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_source() -> None:
    path = source_path()
    if not path.is_file():
        raise FileNotFoundError(f"CAT source PDF is missing: {path}")
    expected = str(source_record().get("sha256") or "")
    actual = sha256_file(path)
    if expected and actual != expected:
        raise RuntimeError(f"CAT source SHA-256 changed: expected {expected}, got {actual}")


def selected_chapters(only: int | None, start: int | None) -> list[Chapter]:
    values = chapters()
    if only is not None:
        return [chapter for chapter in values if chapter.number == only]
    return [chapter for chapter in values if start is None or chapter.number >= start]


def chapter_pdf(chapter: Chapter) -> Path:
    target = OCR_ROOT / chapter.slug / "source-pages.pdf"
    if target.exists():
        try:
            if len(PdfReader(str(target)).pages) == chapter.page_count:
                return target
        except Exception:
            pass
        print(f"Chapter {chapter.number}: rebuilding incomplete local PDF checkpoint", flush=True)
    reader = PdfReader(str(source_path()))
    if chapter.end_page > len(reader.pages):
        raise RuntimeError(f"Chapter {chapter.number} ends after the source PDF")
    writer = PdfWriter()
    for page_number in range(chapter.start_page, chapter.end_page + 1):
        writer.add_page(reader.pages[page_number - 1])
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("wb") as handle:
        writer.write(handle)
    return target


def data_url(path: Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:application/pdf;base64,{encoded}"


def decode_image(value: str) -> tuple[bytes, str]:
    if value.startswith("data:"):
        header, encoded = value.split(",", 1)
        mime = header.split(";", 1)[0].split(":", 1)[1]
        suffix = mimetypes.guess_extension(mime) or ".png"
        return base64.b64decode(encoded), suffix.replace(".jpe", ".jpg")
    return base64.b64decode(value), ".png"


def save_ocr(chapter: Chapter, response: dict[str, Any], model: str) -> None:
    root = OCR_ROOT / chapter.slug
    pages_root = root / "pages"
    images_root = root / "images"
    pages_root.mkdir(parents=True, exist_ok=True)
    images_root.mkdir(parents=True, exist_ok=True)
    write_json(root / "mistral-response.json", response)
    combined: list[str] = []
    image_manifest: list[dict[str, Any]] = []
    for offset, page in enumerate(response.get("pages") or []):
        pdf_page = chapter.start_page + offset
        markdown = str(page.get("markdown") or "").strip()
        markdown = inline_tables(markdown, page.get("tables") or [])
        for image_index, image in enumerate(page.get("images") or [], start=1):
            encoded = str(image.get("image_base64") or image.get("base64") or "")
            if not encoded:
                continue
            binary, suffix = decode_image(encoded)
            raw_id = str(image.get("id") or image.get("image_id") or f"image-{image_index}")
            stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", Path(raw_id).stem).strip("-") or f"image-{image_index}"
            filename = f"page-{pdf_page:04d}-{stem}{suffix.lower()}"
            destination = images_root / filename
            destination.write_bytes(binary)
            relative = f"images/{filename}"
            markdown = markdown.replace(f"]({raw_id})", f"]({relative})")
            image_manifest.append({"pageNumber": pdf_page, "sourceId": raw_id, "file": relative, "bytes": len(binary)})
        page_path = pages_root / f"page-{pdf_page:04d}.md"
        page_path.write_text(markdown + "\n", encoding="utf-8")
        combined.append(f"<!-- PDF page {pdf_page} -->\n\n{markdown}")
    (root / "combined.md").write_text("\n\n".join(combined).strip() + "\n", encoding="utf-8")
    write_json(root / "images.json", image_manifest)
    write_json(root / "ocr-report.json", {
        "generatedAt": now_iso(), "sourceId": SOURCE_ID, "chapterNumber": chapter.number,
        "chapterSlug": chapter.slug, "startPage": chapter.start_page, "endPage": chapter.end_page,
        "provider": "mistral", "model": model, "pageCount": len(response.get("pages") or []),
        "imageCount": len(image_manifest), "rankedEligible": False,
    })


def run_ocr(chapter: Chapter, model: str, force: bool, dry_run: bool) -> None:
    output = OCR_ROOT / chapter.slug / "combined.md"
    if output.exists() and not force:
        print(f"Chapter {chapter.number}: reusing OCR at {output}")
        return
    if dry_run:
        print(f"DRY RUN Chapter {chapter.number}: OCR {chapter.page_count} pages with {model}")
        return
    validate_source()
    print(f"Chapter {chapter.number}: preparing pages {chapter.start_page}-{chapter.end_page}", flush=True)
    pdf = chapter_pdf(chapter)
    payload = {
        "model": model,
        "document": {"type": "document_url", "document_url": data_url(pdf)},
        "include_image_base64": True,
        "image_min_size": 0,
        "table_format": "markdown",
        "include_blocks": True,
    }
    key = require_key("MISTRAL_API_KEY")
    print(f"Chapter {chapter.number}: submitting {chapter.page_count} pages to {model}", flush=True)
    response = retry_post(MISTRAL_URL, {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, payload)
    actual_pages = len(response.get("pages") or [])
    if actual_pages != chapter.page_count:
        raise RuntimeError(f"Chapter {chapter.number} OCR returned {actual_pages}/{chapter.page_count} pages; refusing partial output")
    print(f"Chapter {chapter.number}: response received; saving OCR and images", flush=True)
    save_ocr(chapter, response, model)
    print(f"Chapter {chapter.number}: saved OCR for {chapter.page_count} pages", flush=True)


def page_markdown(chapter: Chapter) -> list[tuple[int, str]]:
    root = OCR_ROOT / chapter.slug / "pages"
    raw_path = OCR_ROOT / chapter.slug / "mistral-response.json"
    raw_pages = (load_json(raw_path).get("pages") or []) if raw_path.exists() else []
    values: list[tuple[int, str]] = []
    for path in sorted(root.glob("page-*.md")):
        match = re.search(r"(\d{4})", path.stem)
        if match:
            page_number = int(match.group(1))
            offset = page_number - chapter.start_page
            tables = raw_pages[offset].get("tables") or [] if 0 <= offset < len(raw_pages) else []
            values.append((page_number, inline_tables(path.read_text(encoding="utf-8"), tables)))
    return values


def inline_tables(markdown: str, tables: list[dict[str, Any]]) -> str:
    for table in tables:
        table_id = str(table.get("id") or "")
        content = str(table.get("content") or "").strip()
        if table_id and content:
            markdown = markdown.replace(f"[{table_id}]({table_id})", content)
    return markdown


def clean_text(value: str) -> str:
    value = re.sub(r"<!--.*?-->", " ", value, flags=re.S)
    value = re.sub(r"!\[[^\]]*\]\([^)]*\)", " [source figure] ", value)
    value = re.sub(r"\s+", " ", value).strip(" -\n\t")
    return value


def parse_question_block(block: str) -> tuple[str, list[dict[str, str]]] | None:
    block = re.sub(
        r"(?i)^[ \t]*(?:\d{1,3}(?:[ \t]*[.)][ \t]*|[ \t]+)|Exp\.?[ \t]*\d{1,3}[ \t]*\)[ \t]*)",
        "",
        block,
        count=1,
    )
    matches = list(OPTION_TOKEN.finditer(block))
    ordered: list[re.Match[str]] = []
    expected = "a"
    for match in matches:
        if match.group(1).lower() == expected:
            ordered.append(match)
            expected = chr(ord(expected) + 1)
            if expected == "e":
                break
    if len(ordered) != 4:
        return None
    stem = clean_text(block[:ordered[0].start()])
    options = []
    for index, match in enumerate(ordered):
        end = ordered[index + 1].start() if index + 1 < len(ordered) else len(block)
        text = clean_text(block[match.end():end])
        text = re.split(r"(?i)\b(?:answer|solution)\s*[:.]?", text, maxsplit=1)[0].strip()
        text = re.split(r"\s+#{1,6}(?:\s+|$)", text, maxsplit=1)[0].strip()
        text = re.sub(r"\s+[A-Z][A-Za-z,& /-]{2,50}\s+\d{1,4}$", "", text).strip()
        options.append({"id": match.group(1).lower(), "text": text})
    if len(stem) < 8 or NOISE.match(stem) or any(not option["text"] for option in options):
        return None
    return stem, options


def stable_id(chapter: Chapter, page: int, stem: str) -> str:
    digest = hashlib.sha1(f"{chapter.slug}|{page}|{stem}".encode("utf-8")).hexdigest()[:12]
    return f"cat-quantum-{chapter.number:02d}-p{page:04d}-{digest}"


def source_images(block: str, chapter: Chapter) -> list[dict[str, str]]:
    values: list[dict[str, str]] = []
    seen: set[str] = set()
    for raw_name in re.findall(r"!\[[^\]]*\]\(images/([^)]+)\)", block):
        name = Path(raw_name).name
        if name in seen or not (OCR_ROOT / chapter.slug / "images" / name).is_file():
            continue
        seen.add(name)
        values.append({
            "ocrPath": f"images/{name}",
            "publicSrc": f"/content-assets/cat/quant/{chapter.slug}/{name}",
        })
    return values


def segment_chapter(chapter: Chapter, force: bool, dry_run: bool) -> None:
    output = SEGMENTS_ROOT / chapter.slug / "question-candidates.json"
    if output.exists() and not force:
        print(f"Chapter {chapter.number}: reusing segments at {output}")
        return
    pages = page_markdown(chapter)
    if not pages:
        if dry_run:
            print(f"DRY RUN Chapter {chapter.number}: segment after OCR")
            return
        raise RuntimeError(f"Chapter {chapter.number} has no OCR pages; run the ocr stage first")
    combined = "\n\n".join(f"<!-- PDF PAGE {page_number} -->\n{markdown}" for page_number, markdown in pages)
    combined = re.sub(r"\*\*(\d{1,3})\*\*", r"\n\1 ", combined)
    page_markers = list(re.finditer(r"<!-- PDF PAGE (\d+) -->", combined))
    starts = list(QUESTION_START.finditer(combined))
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    for index, start in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(combined)
        block = combined[start.start():end]
        parsed = parse_question_block(block)
        if not parsed:
            continue
        stem, options = parsed
        prior_markers = [marker for marker in page_markers if marker.start() <= start.start()]
        page_number = int(prior_markers[-1].group(1)) if prior_markers else chapter.start_page
        signature = re.sub(r"\W+", "", stem.lower())
        if signature in seen:
            continue
        seen.add(signature)
        candidates.append({
            "candidateId": stable_id(chapter, page_number, stem), "chapterNumber": chapter.number,
            "chapterSlug": chapter.slug, "chapterTitle": chapter.title, "topic": chapter.topic,
            "pageNumber": page_number, "questionNumber": int(start.group(1) or start.group(2)), "stem": stem,
            "options": options, "sourceImages": source_images(block, chapter),
            "sourceId": SOURCE_ID, "reviewStatus": "candidate",
        })
    if dry_run:
        print(f"DRY RUN Chapter {chapter.number}: would write {len(candidates)} candidates")
        return
    write_json(output, candidates)
    write_json(output.parent / "segmentation-report.json", {
        "generatedAt": now_iso(), "chapterNumber": chapter.number, "pageCount": len(pages),
        "candidateCount": len(candidates), "rankedEligible": False,
    })
    print(f"Chapter {chapter.number}: segmented {len(candidates)} MCQ candidates")


def chunks(text: str, maximum: int = NOTE_CHUNK_CHARS) -> list[str]:
    paragraphs = text.split("\n\n")
    result: list[str] = []
    current: list[str] = []
    size = 0
    for paragraph in paragraphs:
        if current and size + len(paragraph) + 2 > maximum:
            result.append("\n\n".join(current))
            current, size = [], 0
        current.append(paragraph)
        size += len(paragraph) + 2
    if current:
        result.append("\n\n".join(current))
    return result


def call_deepseek(messages: list[dict[str, str]], model: str, max_tokens: int, json_output: bool = False) -> str:
    payload: dict[str, Any] = {
        "model": model, "messages": messages, "thinking": {"type": "disabled"},
        "temperature": 0.15, "max_tokens": max_tokens,
    }
    if json_output:
        payload["response_format"] = {"type": "json_object"}
    key = require_key("DEEPSEEK_API_KEY")
    response = retry_post(DEEPSEEK_URL, {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, payload)
    return str(response["choices"][0]["message"]["content"])


def run_notes(chapter: Chapter, model: str, force: bool, dry_run: bool) -> None:
    source = OCR_ROOT / chapter.slug / "combined.md"
    output = DOCS_ROOT / f"{chapter.slug}.md"
    if output.exists() and not force:
        print(f"Chapter {chapter.number}: reusing note at {output}")
        return
    if not source.exists():
        if dry_run:
            print(f"DRY RUN Chapter {chapter.number}: author notes after OCR")
            return
        raise RuntimeError(f"Chapter {chapter.number} has no OCR; run the ocr stage first")
    hydrated_source = "\n\n".join(
        f"<!-- PDF page {page_number} -->\n\n{markdown}"
        for page_number, markdown in page_markdown(chapter)
    )
    source_chunks = chunks(hydrated_source)
    if dry_run:
        print(f"DRY RUN Chapter {chapter.number}: {len(source_chunks)} digest calls + 1 final note call with {model}")
        return
    digest_root = DEEP_NOTES_ROOT / chapter.slug
    digests: list[str] = []
    for index, part in enumerate(source_chunks, start=1):
        path = digest_root / f"digest-{index:03d}.md"
        if path.exists() and not force:
            print(f"Chapter {chapter.number}: reusing note digest {index}/{len(source_chunks)}", flush=True)
            digests.append(path.read_text(encoding="utf-8"))
            continue
        print(
            f"Chapter {chapter.number}: authoring note digest {index}/{len(source_chunks)} "
            f"({len(part):,} source chars)",
            flush=True,
        )
        result = call_deepseek([
            {"role": "system", "content": "I am an exacting CAT Quant teacher. I use only the supplied OCR, correct obvious OCR slips, preserve formulas and methods, and never invent missing values."},
            {"role": "user", "content": f"Build a dense evidence digest for {chapter.title}, source part {index}/{len(source_chunks)}. Capture concepts, shortcuts, derivations, traps, solved examples, formula meanings, difficulty progression, source-page markers, and every useful source image reference exactly as written. This is source material for a later learner note.\n\n{part}"},
        ], model, 48_000)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(result.strip() + "\n", encoding="utf-8")
        print(f"Chapter {chapter.number}: saved note digest {index}/{len(source_chunks)}", flush=True)
        digests.append(result)
    final_prompt = f"""Write the complete CAT Quant study note for Chapter {chapter.number}: {chapter.title}.

Return Markdown only. Start with this exact frontmatter shape:
---
title: "CAT Quant — {chapter.title}"
exam: "CAT"
section: "quantitative-aptitude"
chapter: {chapter.number}
topic: "{chapter.topic}"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

Make this an expansive, practical learner note: concept map, foundations, formulas with symbol meanings, fast CAT methods, worked examples from easy to advanced, decision rules, common traps, timed strategy, and a final revision sheet. Preserve source page markers where useful. Use only exact source image references beginning with images/ when a figure materially teaches the concept. Do not reproduce bulk exercise sets; the practice bank handles those. Render maths with valid $...$ or $$...$$ KaTeX. Do not mention the generation process or these instructions.

SOURCE DIGESTS:
{chr(10).join(digests)}"""
    print(
        f"Chapter {chapter.number}: authoring final note from {len(digests)} digests "
        f"({len(final_prompt):,} prompt chars)",
        flush=True,
    )
    note = call_deepseek([
        {"role": "system", "content": "I write rigorous, readable CAT preparation notes grounded only in supplied evidence."},
        {"role": "user", "content": final_prompt},
    ], model, 96_000)
    note = re.sub(r"^```(?:markdown)?\s*|\s*```$", "", note.strip(), flags=re.I)
    note = publish_note_assets(note, chapter)
    validate_note(note, chapter)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(note.strip() + "\n", encoding="utf-8")
    print(f"Chapter {chapter.number}: authored {output}", flush=True)


def publish_note_assets(note: str, chapter: Chapter) -> str:
    """Copy only model-selected, OCR-backed figures into the tracked note tree."""
    source_root = OCR_ROOT / chapter.slug / "images"
    target_root = DOCS_ROOT / "assets" / chapter.slug
    references = re.findall(r"\]\(images/([^)]+)\)", note)
    resolved_names: dict[str, str] = {}
    for raw_name in sorted(set(references)):
        name = Path(raw_name).name
        source = source_root / name
        if not source.is_file():
            # Digests can preserve Mistral's raw id (for example
            # ``img-0.jpeg``) instead of save_ocr's normalized
            # ``page-0247-img-0.jpg`` filename. Resolve it only when that raw
            # id has one unambiguous OCR-backed match in this chapter.
            raw_stem = Path(name).stem
            candidates = sorted(
                candidate
                for candidate in source_root.glob(f"*-{raw_stem}.*")
                if candidate.is_file()
            )
            if len(candidates) == 1:
                source = candidates[0]
        if not source.is_file():
            raise RuntimeError(f"Note selected a missing OCR image: {raw_name}")
        target_root.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target_root / source.name)
        resolved_names[raw_name] = source.name
    return re.sub(
        r"\]\(images/([^)]+)\)",
        lambda match: f"](assets/{chapter.slug}/{resolved_names[match.group(1)]})",
        note,
    )


def validate_note(note: str, chapter: Chapter) -> None:
    frontmatter = re.match(r"^---\s*\n(.*?)\n---\s*\n", note, flags=re.S)
    if not frontmatter:
        raise RuntimeError(f"Chapter {chapter.number} note is missing leading frontmatter")
    metadata = frontmatter.group(1)
    required = [
        'exam: "CAT"',
        'section: "quantitative-aptitude"',
        f"chapter: {chapter.number}",
        f'topic: "{chapter.topic}"',
    ]
    missing = [value for value in required if value not in metadata]
    if missing:
        raise RuntimeError(f"Chapter {chapter.number} note frontmatter is missing: {', '.join(missing)}")
    if len(note) < 5_000 or len(re.findall(r"(?m)^#{2,4}\s+", note)) < 5:
        raise RuntimeError(f"Chapter {chapter.number} note is too shallow for publication")
    if re.search(r"(?i)(?:supplied OCR|generation process|these instructions|as an AI)", note):
        raise RuntimeError(f"Chapter {chapter.number} note contains generator leakage")
    bad_images = [
        target for target in re.findall(r"!\[[^\]]*\]\(([^)]+)\)", note)
        if not target.startswith(f"assets/{chapter.slug}/")
    ]
    if bad_images:
        raise RuntimeError(f"Chapter {chapter.number} note contains untracked image references: {bad_images[:3]}")


def batches(values: list[dict[str, Any]], size: int) -> Iterable[list[dict[str, Any]]]:
    for index in range(0, len(values), size):
        yield values[index:index + size]


def parse_json_object(raw: str) -> dict[str, Any]:
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip(), flags=re.I)
    value = json.loads(raw)
    if not isinstance(value, dict):
        raise RuntimeError("DeepSeek review did not return a JSON object")
    return value


def review_prompt(chapter: Chapter, candidates: list[dict[str, Any]], page_context: dict[int, str]) -> str:
    compact_context = {str(page): page_context.get(page, "")[-16_000:] for page in sorted({int(c["pageNumber"]) for c in candidates})}
    answer_pages = {
        str(page): text[-20_000:]
        for page, text in page_context.items()
        if re.search(r"(?im)^\s*#{0,6}\s*(?:answers?|solutions?)\b", text)
    }
    return f"""Review OCR-extracted CAT Quant questions from Chapter {chapter.number}: {chapter.title}.

Return one JSON object with key "questions". Each accepted question must use this exact native CAT shape:
id, exam (always "CAT"), section (always "quantitative-aptitude"), topic, subtopic, chapterNumber, difficulty (easy|medium|hard), questionType (mcq|tita), stem, optional stimulus, optional options as four {{id,text}} rows, optional correctOption, optional correctAnswer, explanation, reviewStatus ("reviewed"), ocrConfidence (0..1), conceptTags, provenance.

When a source figure is necessary, stimulus must be exactly {{"type":"image","src":"one exact publicSrc from that candidate's sourceImages","alt":"specific description of the diagram or chart needed to answer this question","caption":"short source-aware caption"}}. Select only one exact OCR-backed publicSrc. Never emit data URLs, raw HTML, local paths, invented image names, or a generic alt such as "image". If the question needs multiple extracted fragments and one source image is not sufficient, omit the question.

provenance must contain sourceId, sourceType ("book_user_provided"), title, file, pageNumber, chapterTitle, licenseNote. Preserve each candidateId as id. Accept only complete, faithful questions. Correct obvious OCR spacing/math slips using the page context. Determine the answer from supplied answer/solution context when it is unambiguous; otherwise solve independently and accept only when one unique result can be verified with high confidence. Omit anything incomplete, figure-dependent without its stimulus, ambiguous, or not confidently solvable. MCQ needs exactly four options and correctOption a-d. TITA needs correctAnswer and no invented options. Explanation must be method-level and item-specific. Do not include prose outside JSON.

CHAPTER ANSWER/SOLUTION PAGES:
{json.dumps(answer_pages, ensure_ascii=False)}

CANDIDATES:
{json.dumps(candidates, ensure_ascii=False)}

PAGE CONTEXT:
{json.dumps(compact_context, ensure_ascii=False)}"""


def validate_native_question(value: dict[str, Any], chapter: Chapter) -> dict[str, Any] | None:
    required = {"id", "exam", "section", "topic", "subtopic", "chapterNumber", "difficulty", "questionType", "stem", "explanation", "reviewStatus", "ocrConfidence", "conceptTags", "provenance"}
    if not required.issubset(value) or value.get("exam") != "CAT" or value.get("section") != "quantitative-aptitude":
        return None
    if value.get("difficulty") not in {"easy", "medium", "hard"} or not str(value.get("subtopic") or "").strip():
        return None
    if value.get("questionType") == "mcq":
        options = value.get("options")
        if (
            not isinstance(options, list)
            or len(options) != 4
            or [option.get("id") for option in options if isinstance(option, dict)] != ["a", "b", "c", "d"]
            or any(not str(option.get("text") or "").strip() for option in options if isinstance(option, dict))
            or value.get("correctOption") not in {"a", "b", "c", "d"}
        ):
            return None
        value.pop("correctAnswer", None)
    elif value.get("questionType") == "tita":
        if not str(value.get("correctAnswer") or "").strip():
            return None
        value.pop("correctOption", None)
    else:
        return None
    if not str(value.get("stem") or "").strip() or len(str(value.get("explanation") or "").strip()) < 20:
        return None
    learner_text = " ".join([
        str(value.get("stem") or ""),
        str(value.get("explanation") or ""),
        *(str(option.get("text") or "") for option in value.get("options") or [] if isinstance(option, dict)),
    ])
    if re.search(r"(?i)(?:<img\b|!\[[^\]]*\]\(|supplied OCR|these instructions|as an AI)", learner_text):
        return None
    if not isinstance(value.get("conceptTags"), list):
        return None
    try:
        confidence = float(value.get("ocrConfidence"))
    except (TypeError, ValueError):
        return None
    if not 0 <= confidence <= 1:
        return None
    value["ocrConfidence"] = confidence
    stimulus = value.get("stimulus")
    if stimulus is not None and (
        not isinstance(stimulus, dict)
        or stimulus.get("type") != "image"
        or not str(stimulus.get("src") or "").startswith(f"/content-assets/cat/quant/{chapter.slug}/")
        or len(str(stimulus.get("alt") or "").strip()) < 8
    ):
        return None
    value["chapterNumber"] = chapter.number
    value["topic"] = chapter.topic
    value["reviewStatus"] = "reviewed"
    return value


def publish_question_asset(value: dict[str, Any], original: dict[str, Any], chapter: Chapter) -> dict[str, Any] | None:
    candidates = {
        str(image["publicSrc"]): Path(str(image["ocrPath"])).name
        for image in original.get("sourceImages") or []
        if isinstance(image, dict) and image.get("publicSrc") and image.get("ocrPath")
    }
    stimulus = value.get("stimulus")
    figure_text = " ".join([
        str(original.get("stem") or ""),
        *(str(option.get("text") or "") for option in original.get("options") or [] if isinstance(option, dict)),
    ])
    has_figure_marker = "[source figure]" in figure_text
    if stimulus is None:
        if has_figure_marker:
            return None
        return value
    src = str(stimulus.get("src") or "")
    name = candidates.get(src)
    if not name:
        return None
    source = OCR_ROOT / chapter.slug / "images" / name
    if not source.is_file():
        return None
    # Keep the canonical question image beside the CAT source notes. The
    # content builder recreates public/content-assets from docs on every run,
    # so writing directly to public would make the asset disappear before the
    # exam-data validation stage.
    target = DOCS_ROOT / chapter.slug / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    value["stimulus"] = {
        "type": "image",
        "src": src,
        "alt": str(stimulus["alt"]).strip(),
        **({"caption": str(stimulus["caption"]).strip()} if str(stimulus.get("caption") or "").strip() else {}),
    }
    return value


def run_curate(chapter: Chapter, model: str, force: bool, dry_run: bool) -> None:
    candidates_path = SEGMENTS_ROOT / chapter.slug / "question-candidates.json"
    if not candidates_path.exists():
        if dry_run:
            print(f"DRY RUN Chapter {chapter.number}: curate after segmentation")
            return
        raise RuntimeError(f"Chapter {chapter.number} has no candidates; run segment first")
    candidates = load_json(candidates_path)
    candidate_batches = list(batches(candidates, REVIEW_BATCH_SIZE))
    contexts = dict(page_markdown(chapter))
    if dry_run:
        prompt_sizes = [len(review_prompt(chapter, batch, contexts)) for batch in candidate_batches]
        maximum = max(prompt_sizes, default=0)
        print(
            f"DRY RUN Chapter {chapter.number}: review {len(candidates)} candidates in "
            f"{len(candidate_batches)} calls with {model}; maximum prompt {maximum:,} chars",
            flush=True,
        )
        return
    candidates_by_id = {str(value["candidateId"]): value for value in candidates}
    source = source_record()
    review_root = REVIEW_ROOT / chapter.slug
    accepted: list[dict[str, Any]] = []

    def review_batch(index: int, batch: list[dict[str, Any]]) -> tuple[int, dict[str, Any]]:
        path = review_root / f"batch-{index:04d}.json"
        if path.exists() and not force:
            print(f"Chapter {chapter.number}: reusing review batch {index}/{len(candidate_batches)}", flush=True)
            result = load_json(path)
        else:
            invalid_paths = sorted(review_root.glob(f"batch-{index:04d}.invalid-*.txt"))
            if invalid_paths and not force:
                repaired = repair_json(
                    invalid_paths[-1].read_text(encoding="utf-8"),
                    return_objects=True,
                )
                if isinstance(repaired, dict) and isinstance(repaired.get("questions"), list):
                    write_json(path, repaired)
                    print(
                        f"Chapter {chapter.number}: recovered review batch {index}/{len(candidate_batches)} "
                        f"from saved malformed JSON",
                        flush=True,
                    )
                    return index, repaired
            prompt = review_prompt(chapter, batch, contexts)
            print(
                f"Chapter {chapter.number}: reviewing batch {index}/{len(candidate_batches)} "
                f"({len(batch)} candidates, {len(prompt):,} prompt chars)",
                flush=True,
            )
            raw = call_deepseek([
                {"role": "system", "content": "I am a conservative CAT question-bank editor. I reject unsupported or incomplete OCR rows and return strict JSON."},
                {"role": "user", "content": prompt},
            ], model, 32_000, json_output=True)
            for repair_attempt in range(0, 3):
                try:
                    result = parse_json_object(raw)
                    break
                except json.JSONDecodeError:
                    invalid_path = review_root / f"batch-{index:04d}.invalid-{repair_attempt + 1}.txt"
                    invalid_path.parent.mkdir(parents=True, exist_ok=True)
                    invalid_path.write_text(raw, encoding="utf-8")
                    repaired = repair_json(raw, return_objects=True)
                    if isinstance(repaired, dict) and isinstance(repaired.get("questions"), list):
                        result = repaired
                        print(
                            f"Chapter {chapter.number}: repaired malformed JSON locally for batch "
                            f"{index}/{len(candidate_batches)}",
                            flush=True,
                        )
                        break
                    if repair_attempt >= 2:
                        raise
                    print(
                        f"Chapter {chapter.number}: repairing malformed JSON for batch "
                        f"{index}/{len(candidate_batches)} (attempt {repair_attempt + 1}/2)",
                        flush=True,
                    )
                    raw = call_deepseek([
                        {
                            "role": "system",
                            "content": (
                                "I repair JSON syntax only. I preserve the supplied question data, "
                                "return one valid JSON object with key questions, and output no prose."
                            ),
                        },
                        {"role": "user", "content": f"Repair this malformed JSON:\n\n{raw}"},
                    ], model, 32_000, json_output=True)
            write_json(path, result)
            print(f"Chapter {chapter.number}: saved review batch {index}/{len(candidate_batches)}", flush=True)
        return index, result

    results: dict[int, dict[str, Any]] = {}
    with ThreadPoolExecutor(max_workers=min(REVIEW_WORKERS, len(candidate_batches) or 1)) as executor:
        futures = {
            executor.submit(review_batch, index, batch): index
            for index, batch in enumerate(candidate_batches, start=1)
        }
        for future in as_completed(futures):
            index, result = future.result()
            results[index] = result

    for index, batch in enumerate(candidate_batches, start=1):
        result = results[index]
        for value in result.get("questions") or []:
            if isinstance(value, dict):
                original = candidates_by_id.get(str(value.get("id") or ""))
                if not original:
                    continue
                valid = validate_native_question(value, chapter)
                if valid:
                    valid["provenance"] = {
                        "sourceId": SOURCE_ID,
                        "sourceType": "book_user_provided",
                        "title": source["title"],
                        "file": Path(source["file"]).name,
                        "pageNumber": int(original["pageNumber"]),
                        "chapterTitle": chapter.title,
                        "licenseNote": source["licenseNote"],
                    }
                    published = publish_question_asset(valid, original, chapter)
                    if published:
                        accepted.append(published)
    write_json(review_root / "review-report.json", {
        "generatedAt": now_iso(), "chapterNumber": chapter.number, "candidateCount": len(candidates),
        "acceptedCount": len(accepted), "rejectedCount": len(candidates) - len(accepted), "rankedEligible": False,
    })
    merge_question_bank(chapter, accepted)
    print(f"Chapter {chapter.number}: curated {len(accepted)} native CAT questions")


def merge_question_bank(chapter: Chapter, accepted: list[dict[str, Any]]) -> None:
    existing = load_json(QUESTION_BANK) if QUESTION_BANK.exists() else []
    retained = [value for value in existing if int(value.get("chapterNumber") or 0) != chapter.number]
    combined = retained + accepted
    combined.sort(key=lambda value: (int(value.get("chapterNumber") or 0), int(value.get("provenance", {}).get("pageNumber") or 0), str(value.get("id") or "")))
    seen_ids: set[str] = set()
    seen_stems: set[str] = set()
    unique: list[dict[str, Any]] = []
    for value in combined:
        identifier = str(value.get("id") or "")
        stem = re.sub(r"\W+", "", str(value.get("stem") or "").lower())
        if not identifier or identifier in seen_ids or not stem or stem in seen_stems:
            continue
        seen_ids.add(identifier)
        seen_stems.add(stem)
        unique.append(value)
    write_json(QUESTION_BANK, unique)


def audit_chapter(chapter: Chapter) -> None:
    note_path = DOCS_ROOT / f"{chapter.slug}.md"
    if not note_path.is_file():
        raise RuntimeError(f"Chapter {chapter.number} note is missing: {note_path}")
    validate_note(note_path.read_text(encoding="utf-8"), chapter)
    if not QUESTION_BANK.is_file():
        raise RuntimeError(f"CAT question bank is missing: {QUESTION_BANK}")
    rows = [
        value for value in load_json(QUESTION_BANK)
        if int(value.get("chapterNumber") or 0) == chapter.number
    ]
    if not rows:
        raise RuntimeError(f"Chapter {chapter.number} has no curated practice questions")
    ids: set[str] = set()
    for value in rows:
        identifier = str(value.get("id") or "")
        if not identifier or identifier in ids or validate_native_question(value, chapter) is None:
            raise RuntimeError(f"Chapter {chapter.number} has an invalid or duplicate native CAT row: {identifier}")
        ids.add(identifier)
        stimulus = value.get("stimulus")
        if isinstance(stimulus, dict):
            source_asset = DOCS_ROOT / chapter.slug / Path(str(stimulus["src"])).name
            if not source_asset.is_file():
                raise RuntimeError(f"Chapter {chapter.number} stimulus asset is missing: {stimulus['src']}")
    print(f"Chapter {chapter.number}: audit passed for 1 note and {len(rows)} native CAT questions", flush=True)


def print_plan(values: list[Chapter], mistral_model: str, deepseek_model: str) -> None:
    total_pages = sum(chapter.page_count for chapter in values)
    print(f"CAT Quant plan: {len(values)} chapters, {total_pages} OCR pages")
    print(f"OCR model: {mistral_model}; note/review model: {deepseek_model} with thinking disabled")
    for chapter in values:
        print(f"  {chapter.number:02d} {chapter.slug}: pages {chapter.start_page}-{chapter.end_page} ({chapter.page_count})")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", choices=["plan", "ocr", "segment", "notes", "curate", "audit", "all"])
    parser.add_argument("--chapter", type=int, choices=range(1, 22))
    parser.add_argument("--start-chapter", type=int, choices=range(1, 22))
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true", help="Print intended work and make no provider calls or writes.")
    parser.add_argument("--mistral-model", default=os.environ.get("MISTRAL_OCR_MODEL", MISTRAL_MODEL))
    parser.add_argument("--deepseek-model", default=os.environ.get("DEEPSEEK_MODEL", DEEPSEEK_MODEL))
    args = parser.parse_args()
    if args.chapter and args.start_chapter:
        parser.error("--chapter and --start-chapter are mutually exclusive")
    values = selected_chapters(args.chapter, args.start_chapter)
    if args.stage == "plan":
        print_plan(values, args.mistral_model, args.deepseek_model)
        return 0
    for chapter in values:
        if args.stage in {"ocr", "all"}:
            run_ocr(chapter, args.mistral_model, args.force, args.dry_run)
        if args.stage in {"segment", "all"}:
            segment_chapter(chapter, args.force, args.dry_run)
        if args.stage in {"notes", "all"}:
            run_notes(chapter, args.deepseek_model, args.force, args.dry_run)
        if args.stage in {"curate", "all"}:
            run_curate(chapter, args.deepseek_model, args.force, args.dry_run)
        if args.stage == "audit":
            audit_chapter(chapter)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
