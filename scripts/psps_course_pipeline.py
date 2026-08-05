"""OCR and author the Power System Protection and Switchgear weekly notes."""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import re
import shutil
import sys
import time
from pathlib import Path
from typing import Any

import requests
from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"G:\Power System Protection and Switchgear")
SOURCE_PDF = SOURCE_ROOT / "108107167.pdf"
OCR_ROOT = ROOT / "data" / "psps-ocr"
DOCS_ROOT = ROOT / "docs" / "sem7" / "psps"
MISTRAL_URL = "https://api.mistral.ai/v1/ocr"
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
MISTRAL_MODEL = "mistral-ocr-4-0"
DEEPSEEK_MODEL = "deepseek-v4-flash"
DEEPSEEK_MAX_TOKENS = 384000

# Zero-based, inclusive PDF page ranges derived from the source index.
WEEK_RANGES = {
    1: (3, 112),
    2: (113, 204),
    3: (205, 280),
    4: (281, 377),
    5: (378, 467),
    6: (468, 608),
    7: (609, 777),
    8: (778, 887),
}

WEEK_TITLES = {
    1: "Protective Relaying Fundamentals",
    2: "Current-Based Relaying Schemes",
    3: "Current Relays and Distance Protection",
    4: "Distance and Carrier-Aided Protection",
    5: "Carrier Protection, Auto-Reclosing, and Synchronizing",
    6: "Protection of Transformers, Generators, and Motors",
    7: "Busbar Protection, Surges, and Arc Interruption",
    8: "Circuit Breakers and Relay Testing",
}


def require_key(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} is not configured")
    return value


def retry_post(url: str, headers: dict[str, str], payload: dict[str, Any], timeout: int) -> dict[str, Any]:
    for attempt in range(1, 7):
        response = requests.post(url, headers=headers, json=payload, timeout=timeout)
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 6:
            retry_after = response.headers.get("retry-after", "")
            delay = float(retry_after) if retry_after.replace(".", "", 1).isdigit() else min(60, 2**attempt)
            time.sleep(delay)
            continue
        if not response.ok:
            raise RuntimeError(f"API request failed ({response.status_code}): {response.text[:1000]}")
        return response.json()
    raise RuntimeError("API request exhausted retries")


def split_week_pdf(reader: PdfReader, week: int, target: Path) -> None:
    start, end = WEEK_RANGES[week]
    writer = PdfWriter()
    for page_index in range(start, end + 1):
        writer.add_page(reader.pages[page_index])
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("wb") as handle:
        writer.write(handle)


def data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def decode_image(value: str) -> tuple[bytes, str]:
    if value.startswith("data:"):
        header, encoded = value.split(",", 1)
        mime = header.split(";", 1)[0].split(":", 1)[1]
        extension = mimetypes.guess_extension(mime) or ".png"
        return base64.b64decode(encoded), extension.replace(".jpe", ".jpg")
    return base64.b64decode(value), ".png"


def safe_image_name(raw_id: str, index: int, extension: str) -> str:
    stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", Path(raw_id).stem).strip("-")
    return f"{stem or f'visual-{index:03d}'}{extension.lower()}"


def save_ocr_response(response: dict[str, Any], week: int) -> dict[str, Any]:
    week_dir = OCR_ROOT / f"week-{week:02d}"
    images_dir = week_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    (week_dir / "mistral-response.json").write_text(
        json.dumps(response, ensure_ascii=False), encoding="utf-8"
    )
    combined: list[str] = []
    manifest: list[dict[str, Any]] = []
    image_number = 0
    start_page = WEEK_RANGES[week][0] + 1
    for offset, page in enumerate(response.get("pages") or []):
        pdf_page = start_page + offset
        markdown = str(page.get("markdown") or "").strip()
        replacements: dict[str, str] = {}
        for image in page.get("images") or []:
            image_number += 1
            raw_id = str(image.get("id") or image.get("image_id") or f"visual-{image_number:03d}.png")
            encoded = str(image.get("image_base64") or image.get("base64") or "")
            if not encoded:
                continue
            binary, extension = decode_image(encoded)
            filename = safe_image_name(raw_id, image_number, extension)
            destination = images_dir / filename
            suffix = 1
            while destination.exists() and destination.read_bytes() != binary:
                destination = images_dir / f"{destination.stem}-{suffix}{destination.suffix}"
                suffix += 1
            destination.write_bytes(binary)
            replacements[raw_id] = f"assets/week-{week:02d}/{destination.name}"
            manifest.append({
                "pdfPage": pdf_page,
                "sourceId": raw_id,
                "file": str(destination.relative_to(OCR_ROOT)).replace("\\", "/"),
                "bytes": len(binary),
            })
        for raw_id, relative in replacements.items():
            markdown = markdown.replace(f"]({raw_id})", f"]({relative})")
        combined.append(f"<!-- PDF page {pdf_page} -->\n\n{markdown}")
    text = "\n\n".join(combined).strip() + "\n"
    (week_dir / "ocr.md").write_text(text, encoding="utf-8")
    (week_dir / "images.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return {"week": week, "pages": len(response.get("pages") or []), "characters": len(text), "images": len(manifest)}


def ocr_document(path: Path, kind: str, api_key: str) -> dict[str, Any]:
    payload = {
        "model": MISTRAL_MODEL,
        "document": {"type": kind, kind: data_url(path)},
        "include_image_base64": True,
        "image_min_size": 0,
        "table_format": "markdown",
        "include_blocks": True,
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    return retry_post(MISTRAL_URL, headers, payload, 900)


def week_from_assignment_path(path: Path) -> int | None:
    match = re.search(r"week\s*(\d+)", str(path.parent), re.I)
    return int(match.group(1)) if match else None


def run_ocr(force: bool = False, only_week: int | None = None) -> None:
    key = require_key("MISTRAL_API_KEY")
    OCR_ROOT.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(SOURCE_PDF)
    summaries: list[dict[str, Any]] = []
    weeks = [only_week] if only_week else list(WEEK_RANGES)
    for week in weeks:
        result_path = OCR_ROOT / f"week-{week:02d}" / "ocr.md"
        if result_path.exists() and not force:
            print(f"Week {week}: reusing existing OCR", flush=True)
            continue
        chunk_path = OCR_ROOT / "chunks" / f"week-{week:02d}.pdf"
        split_week_pdf(reader, week, chunk_path)
        page_count = WEEK_RANGES[week][1] - WEEK_RANGES[week][0] + 1
        print(f"Week {week}: OCR {page_count} pages", flush=True)
        summary = save_ocr_response(ocr_document(chunk_path, "document_url", key), week)
        summaries.append(summary)
        print(f"Week {week}: {summary['characters']} chars, {summary['images']} images", flush=True)
    assignments: dict[int, list[str]] = {week: [] for week in WEEK_RANGES}
    for image_path in sorted(SOURCE_ROOT.rglob("*.png")):
        week = week_from_assignment_path(image_path)
        if not week or (only_week and week != only_week):
            continue
        assignment_dir = OCR_ROOT / f"week-{week:02d}" / "assignments"
        assignment_dir.mkdir(parents=True, exist_ok=True)
        output_path = assignment_dir / f"{image_path.stem}.md"
        if output_path.exists() and not force:
            assignments[week].append(output_path.read_text(encoding="utf-8"))
            continue
        print(f"Assignment OCR: {image_path.name}", flush=True)
        response = ocr_document(image_path, "image_url", key)
        markdown = "\n\n".join(str(page.get("markdown") or "") for page in response.get("pages") or []).strip()
        output_path.write_text(f"# {image_path.name}\n\n{markdown}\n", encoding="utf-8")
        assignments[week].append(output_path.read_text(encoding="utf-8"))
    for week, parts in assignments.items():
        if parts:
            combined = "\n\n---\n\n".join(parts)
            (OCR_ROOT / f"week-{week:02d}" / "assignments.md").write_text(combined, encoding="utf-8")
    if summaries:
        (OCR_ROOT / "ocr-summary.json").write_text(json.dumps(summaries, indent=2), encoding="utf-8")


def text_chunks(text: str, maximum: int = 90000) -> list[str]:
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


def deepseek(messages: list[dict[str, str]], api_key: str, max_tokens: int) -> str:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": messages,
        "thinking": {"type": "disabled"},
        "temperature": 0.25,
        "max_tokens": max_tokens,
    }
    response = retry_post(DEEPSEEK_URL, headers, payload, 900)
    return str(response["choices"][0]["message"]["content"])


def digest_messages(week: int, part: int, total: int, source: str) -> list[dict[str, str]]:
    system = (
        "You are an exacting electrical engineering lecturer. Work only from the supplied OCR. "
        "Preserve equations, settings, relay characteristics, examples, operating logic, and diagram references. "
        "Correct obvious OCR slips but never invent missing values."
    )
    user = (
        f"Create an expansive evidence digest for Week {week}, source part {part}/{total}. "
        "Organize it by lecture/topic. Capture definitions, physical intuition, derivations, formulas with symbol "
        "meanings and units, device behavior, coordination rules, worked examples, comparisons, likely mistakes, "
        "and every useful source-image reference exactly as written. This is an intermediate source packet, not "
        f"the final note.\n\nSOURCE OCR:\n{source}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def final_messages(
    week: int,
    digests: str,
    assignments: str,
    available_images: list[str],
) -> list[dict[str, str]]:
    title = WEEK_TITLES[week]
    image_list = "\n".join(f"- {item}" for item in available_images) or "- none"
    assignment_text = assignments.strip() or "No separate assignment screenshots were supplied for this week."
    requirements = [
        f"Write the complete Markdown file for Week {week}: {title}. Output Markdown only.",
        "Begin with valid YAML frontmatter and one matching # title.",
        f'Use title and sidebar_label: "Week {week} - {title}"; sidebar_position: {week}.' ,
        f"Use a specific description and YAML-list tags: power-system-protection, switchgear, relays, week-{week}.",
        "Start with an orientation and detailed learning outcomes.",
        "Add a syllabus map naming all five lectures/topics in the week.",
        "Write 12,000-16,000 words excluding frontmatter. Do not compress the lectures into a revision summary.",
        "Give each of the five lectures its own major section with physical intuition, complete theory, operating sequence, derivations, formula definitions and units, protection settings, practical engineering context, exam traps, and a lecture-end recap.",
        "Include at least four valid, focused Mermaid diagrams showing protection logic, timing/coordination, zone relationships, or device operating sequences.",
        "Include at least eight useful Markdown tables covering comparisons, settings, characteristics, fault behavior, coordination, or revision mappings.",
        "Include at least five fully worked examples, with multi-step numerical examples wherever the source supports them.",
        "Embed at least 8 genuinely useful available source images with exact relative links and explanatory captions; include more wherever they materially support the five lectures. Never invent a link.",
        "Add Common mistakes and protection-engineering checks, followed by a dense Quick revision sheet.",
        "Add a recognized heading named Practice Quiz with exactly 18 varied questions numbered continuously.",
        "Questions 1-6 are single-answer MCQs; 7-9 are clearly marked MSQ; 10-13 are short-answer/concept; 14-16 are numerical or analytical; 17-18 are scenario/troubleshooting.",
        "For every MCQ/MSQ use Options: (a) ... (b) ... (c) ... (d) ....",
        "Every question must immediately include a collapsible blockquote whose first line is exactly > Answer and explanation (no bold markup on that first line), followed by a rigorous solution. Vary difficulty and avoid near-duplicates.",
        "For Weeks 1-3 add Assignment screenshot walkthrough and solve/explain the supplied assignment OCR without copying corrupted OCR blindly.",
        "End with source provenance: NPTEL Power System Protection and Switchgear, Prof. Bhaveshkumar R. Bhalja, IIT Roorkee; Mistral OCR 4 extraction; DeepSeek V4 Flash drafting; locally reviewed and generated on 2026-08-05. Do not call models authoritative sources.",
        "Use ASCII hyphens and KaTeX with $ or $$ delimiters.",
    ]
    user = (
        "\n".join(f"{index}. {item}" for index, item in enumerate(requirements, 1))
        + f"\n\nAVAILABLE SOURCE IMAGE LINKS:\n{image_list}"
        + f"\n\nASSIGNMENT OCR:\n{assignment_text}"
        + f"\n\nEVIDENCE DIGESTS:\n{digests}"
    )
    system = (
        "You author publication-ready MIT EEE study notes in the student's first-person study voice. "
        "Be technically rigorous, expansive, highly structured, and exam-useful. Use only facts supported by "
        "the evidence digest. Output Markdown only."
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def quality_shortfalls(note: str) -> list[str]:
    words = len(re.findall(r"\b[\w'-]+\b", note))
    mermaid = len(re.findall(r"```mermaid\b", note, re.I))
    tables = len(re.findall(r"^\s*\|?\s*:?-{3,}.*\|", note, re.M))
    examples = len(re.findall(r"^(?:#{2,4}\s+|\*\*).*Worked Example", note, re.M | re.I))
    answers = len(re.findall(r"^> (?:\*\*)?Answer and explanation(?:\*\*)?\s*$", note, re.M | re.I))
    images = len(re.findall(r"!\[[^\]]*\]\([^)]+\)", note))
    checks = [
        (words >= 12000, f"word count {words}, need at least 12000"),
        (mermaid >= 4, f"Mermaid diagrams {mermaid}, need at least 4"),
        (tables >= 8, f"Markdown tables {tables}, need at least 8"),
        (examples >= 5, f"worked examples {examples}, need at least 5"),
        (answers == 18, f"answer blocks {answers}, need exactly 18"),
        (images >= 8, f"embedded images {images}, need at least 8"),
    ]
    return [message for passed, message in checks if not passed]


def normalize_frontmatter(note: str, week: int) -> str:
    title = f"Week {week} - {WEEK_TITLES[week]}"
    note = re.sub(r"^## Frontmatter\s*\r?\n+", "", note.strip(), count=1, flags=re.I)
    note = re.sub(
        r"^# .*?\r?\n+## Frontmatter\s*\r?\n+",
        lambda match: match.group(0).split("## Frontmatter", 1)[0],
        note,
        count=1,
        flags=re.I,
    )
    note = re.sub(
        r"^---\s*\r?\n(?=title:)[\s\S]*?\r?\n---\s*\r?\n*",
        "",
        note,
        count=1,
        flags=re.I,
    )
    # Model rewrites sometimes put a valid YAML block immediately after the H1.
    note = re.sub(
        r"^(# .*?\r?\n+)---\s*\r?\n(?=title:)[\s\S]*?\r?\n---\s*\r?\n*",
        r"\1",
        note,
        count=1,
        flags=re.I,
    )
    note = re.sub(r"^(# .*?\r?\n+)## Frontmatter\s*\r?\n+", r"\1", note, count=1, flags=re.I)
    note = note.strip()
    expected_h1 = f"# {title}"
    if not note.startswith(expected_h1):
        note = re.sub(r"^# .*?\r?\n+", "", note, count=1)
        note = expected_h1 + "\n\n" + note.lstrip()
    note = re.sub(
        rf"^{re.escape(expected_h1)}\s+{re.escape(expected_h1)}\s*",
        expected_h1 + "\n\n",
        note,
        count=1,
    )
    frontmatter = "\n".join([
        "---",
        f'title: "{title}"',
        f'sidebar_label: "{title}"',
        f"sidebar_position: {week}",
        f'description: "Complete Week {week} notes for {WEEK_TITLES[week]}, with source visuals, diagrams, worked examples, revision tables, and varied practice questions."',
        "tags:",
        "  - power-system-protection",
        "  - switchgear",
        "  - relays",
        f"  - week-{week}",
        "---",
    ])
    return frontmatter + "\n\n" + note + "\n"


def worked_example_count(note: str) -> int:
    return len(re.findall(r"^(?:#{2,4}\s+|\*\*).*Worked Example", note, re.M | re.I))


def worked_example_messages(week: int, start: int, count: int, digests: str) -> list[dict[str, str]]:
    system = (
        "You write rigorous worked examples for an undergraduate power-system protection course. Use only the "
        "evidence supplied. You may choose clearly labeled illustrative values when a method needs numbers, but "
        "must not attribute invented values to the lecturer. Output Markdown only."
    )
    user = (
        f"Write a section titled `## Extended Worked Examples` for Week {week}. Include exactly {count} distinct "
        f"examples, numbered from {start} to {start + count - 1}, each headed `### Worked Example N: descriptive title`. "
        "Each example must state Given, Find, protection principle or formula, a complete multi-step solution, "
        "unit/sign checks, engineering interpretation, and one exam trap. Vary the examples across the week's "
        f"five lectures. Do not add quiz questions or provenance.\n\nEVIDENCE DIGESTS:\n{digests}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def ensure_worked_examples(note: str, week: int, digests: str, key: str) -> str:
    example_total = worked_example_count(note)
    if example_total >= 5:
        return note
    needed = 5 - example_total
    print(f"Week {week}: add {needed} structured worked examples", flush=True)
    supplement = deepseek(
        worked_example_messages(week, example_total + 1, needed, digests),
        key,
        DEEPSEEK_MAX_TOKENS,
    )
    supplement = re.sub(r"^```(?:markdown)?\s*", "", supplement.strip(), flags=re.I)
    supplement = re.sub(r"\s*```$", "", supplement).strip()
    insertion = re.search(
        r"^## (?:Common Mistakes|Quick Revision|Practice Quiz|Source Provenance)\b",
        note,
        re.M | re.I,
    )
    if insertion:
        return note[:insertion.start()].rstrip() + "\n\n" + supplement + "\n\n" + note[insertion.start():].lstrip()
    return note.rstrip() + "\n\n" + supplement + "\n"


def diagram_messages(week: int, count: int, digests: str) -> list[dict[str, str]]:
    system = (
        "You create technically accurate Mermaid diagrams for undergraduate power-system protection notes. "
        "Use only source-supported relationships. Output Markdown only."
    )
    user = (
        f"Write a section titled `## Protection Logic Diagrams` for Week {week}, containing exactly {count} "
        "distinct Mermaid diagrams. Use flowchart, sequenceDiagram, or stateDiagram-v2 as appropriate. Cover "
        "protection operating logic, relay coordination or timing, protection zones, and device decision flow "
        "across the week's five lectures. Put each diagram under a descriptive `###` heading and follow it with "
        "a paragraph explaining how to read it and its exam/engineering significance. Quote Mermaid node labels "
        "that contain punctuation or parentheses. Keep syntax simple and valid. Do not add provenance, quiz "
        f"questions, tables, or invented settings.\n\nEVIDENCE DIGESTS:\n{digests}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def ensure_mermaid_diagrams(note: str, week: int, digests: str, key: str) -> str:
    current = len(re.findall(r"```mermaid\b", note, re.I))
    if current >= 4:
        return note
    needed = 4 - current
    print(f"Week {week}: add {needed} targeted Mermaid diagrams", flush=True)
    supplement = deepseek(
        diagram_messages(week, needed, digests),
        key,
        DEEPSEEK_MAX_TOKENS,
    )
    supplement = re.sub(r"^```(?:markdown)?\s*", "", supplement.strip(), flags=re.I)
    supplement = re.sub(r"\s*```$", "", supplement).strip()
    insertion = re.search(
        r"^## (?:Common Mistakes|Quick Revision|Practice Quiz|Source Provenance)\b",
        note,
        re.M | re.I,
    )
    if insertion:
        return note[:insertion.start()].rstrip() + "\n\n" + supplement + "\n\n" + note[insertion.start():].lstrip()
    return note.rstrip() + "\n\n" + supplement + "\n"


def expansion_messages(week: int, note: str, digests: str, shortfalls: list[str]) -> list[dict[str, str]]:
    system = (
        "You are revising a publication-ready electrical engineering course note. Rewrite the entire Markdown "
        "file, preserving all correct content, frontmatter, exact local image links, and source-grounded claims. "
        "Expand substance rather than padding or repeating sentences. Output Markdown only."
    )
    user = (
        f"Week {week} misses mandatory completeness gates:\n- "
        + "\n- ".join(shortfalls)
        + "\n\nRewrite it as a complete 12,000-16,000 word note. Give all five lectures deep treatment. "
        "Use at least four valid Mermaid diagrams, eight useful Markdown tables, five worked examples, at least 8 "
        "source visuals, and exactly 18 varied questions. Every question's answer block must start with the "
        "literal line `> Answer and explanation`. Preserve source provenance and do not invent facts.\n\n"
        + f"CURRENT NOTE:\n{note}\n\nEVIDENCE DIGESTS:\n{digests}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def copy_week_assets(week: int) -> list[str]:
    destination = DOCS_ROOT / "assets" / f"week-{week:02d}"
    destination.mkdir(parents=True, exist_ok=True)
    links: list[str] = []
    source_images = OCR_ROOT / f"week-{week:02d}" / "images"
    if source_images.exists():
        # Keep every OCR-extracted visual available to the author, but let the
        # final note select only pedagogically useful ones.
        for source in sorted(source_images.iterdir()):
            if source.is_file():
                target = destination / source.name
                shutil.copy2(source, target)
                links.append(f"assets/week-{week:02d}/{target.name}")
    assignment_number = 0
    for source in sorted(SOURCE_ROOT.rglob("*.png")):
        if week_from_assignment_path(source) != week:
            continue
        assignment_number += 1
        target = destination / f"assignment-{assignment_number:02d}.png"
        shutil.copy2(source, target)
        links.insert(0, f"assets/week-{week:02d}/{target.name}")
    return links


def run_author(
    force: bool = False,
    only_week: int | None = None,
    start_week: int | None = None,
) -> None:
    key = require_key("DEEPSEEK_API_KEY")
    DOCS_ROOT.mkdir(parents=True, exist_ok=True)
    audit_root = OCR_ROOT / "deepseek"
    audit_root.mkdir(parents=True, exist_ok=True)
    weeks = [only_week] if only_week else [
        week for week in WEEK_RANGES if start_week is None or week >= start_week
    ]
    for week in weeks:
        output = DOCS_ROOT / f"week-{week}.md"
        if output.exists() and not force:
            print(f"Week {week}: reusing existing note", flush=True)
            continue
        ocr_path = OCR_ROOT / f"week-{week:02d}" / "ocr.md"
        if not ocr_path.exists():
            raise RuntimeError(f"Missing OCR for Week {week}: {ocr_path}")
        source_parts = text_chunks(ocr_path.read_text(encoding="utf-8"))
        digest_paths: list[Path] = []
        for index, source_part in enumerate(source_parts, 1):
            digest_path = audit_root / f"week-{week:02d}-digest-{index:02d}.md"
            digest_paths.append(digest_path)
            if digest_path.exists() and not force:
                continue
            print(f"Week {week}: digest {index}/{len(source_parts)}", flush=True)
            digest = deepseek(
                digest_messages(week, index, len(source_parts), source_part),
                key,
                DEEPSEEK_MAX_TOKENS,
            )
            digest_path.write_text(digest.strip() + "\n", encoding="utf-8")
        digests = "\n\n--- DIGEST BREAK ---\n\n".join(
            path.read_text(encoding="utf-8") for path in digest_paths
        )
        assignments_path = OCR_ROOT / f"week-{week:02d}" / "assignments.md"
        assignments = assignments_path.read_text(encoding="utf-8") if assignments_path.exists() else ""
        images = copy_week_assets(week)
        print(f"Week {week}: author final note from {len(source_parts)} digests", flush=True)
        note = deepseek(
            final_messages(week, digests, assignments, images[:200]),
            key,
            DEEPSEEK_MAX_TOKENS,
        )
        note = re.sub(r"^```(?:markdown)?\s*", "", note.strip(), flags=re.I)
        note = re.sub(r"\s*```$", "", note).strip() + "\n"
        note = note.replace("> **Answer and explanation**", "> Answer and explanation")
        for expansion_attempt in range(1, 3):
            shortfalls = [
                item for item in quality_shortfalls(note)
                if not item.startswith("worked examples")
            ]
            if not shortfalls:
                break
            print(
                f"Week {week}: expansion pass {expansion_attempt} ({'; '.join(shortfalls)})",
                flush=True,
            )
            note = deepseek(
                expansion_messages(week, note, digests, shortfalls),
                key,
                DEEPSEEK_MAX_TOKENS,
            )
            note = re.sub(r"^```(?:markdown)?\s*", "", note.strip(), flags=re.I)
            note = re.sub(r"\s*```$", "", note).strip() + "\n"
            note = note.replace("> **Answer and explanation**", "> Answer and explanation")
        note = ensure_worked_examples(note, week, digests, key)
        note = ensure_mermaid_diagrams(note, week, digests, key)
        note = normalize_frontmatter(note, week)
        output.write_text(note, encoding="utf-8")
        print(f"Week {week}: wrote {len(note)} characters", flush=True)


def run_repair(only_week: int | None = None) -> None:
    key = require_key("DEEPSEEK_API_KEY")
    weeks = [only_week] if only_week else list(WEEK_RANGES)
    for week in weeks:
        output = DOCS_ROOT / f"week-{week}.md"
        if not output.exists():
            continue
        digest_paths = sorted((OCR_ROOT / "deepseek").glob(f"week-{week:02d}-digest-*.md"))
        if not digest_paths:
            raise RuntimeError(f"No evidence digests found for Week {week}")
        digests = "\n\n--- DIGEST BREAK ---\n\n".join(
            path.read_text(encoding="utf-8") for path in digest_paths
        )
        note = output.read_text(encoding="utf-8")
        note = note.replace("> **Answer and explanation**", "> Answer and explanation")
        note = ensure_worked_examples(note, week, digests, key)
        note = ensure_mermaid_diagrams(note, week, digests, key)
        note = normalize_frontmatter(note, week)
        output.write_text(note.rstrip() + "\n", encoding="utf-8")
        print(f"Week {week}: repair complete; {len(note)} characters", flush=True)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=["ocr", "author", "repair", "all"])
    parser.add_argument("--week", type=int, choices=range(1, 9))
    parser.add_argument("--start-week", type=int, choices=range(1, 9))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    if args.stage in {"ocr", "all"}:
        run_ocr(args.force, args.week)
    if args.stage in {"author", "all"}:
        run_author(args.force, args.week, args.start_week)
    if args.stage == "repair":
        run_repair(args.week)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
