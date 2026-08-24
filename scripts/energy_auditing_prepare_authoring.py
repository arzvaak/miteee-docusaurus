#!/usr/bin/env python3
"""Prepare compact, traceable Ox Alpha jobs for my Energy Auditing notes."""

from __future__ import annotations

import argparse
import base64
import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE_MANIFEST = ROOT / "data" / "sources" / "energy-auditing" / "source-manifest.json"
PYQ_MANIFEST = ROOT / "data" / "sources" / "energy-auditing" / "pyq-manifest.json"
TEMP_ROOT = ROOT / "tmp" / "energy-auditing"
INPUT_ROOT = TEMP_ROOT / "author-inputs"
JOBS_PATH = ROOT / "data" / "sources" / "energy-auditing" / "authoring-jobs.json"
DOCS_ROOT = ROOT / "docs" / "sem7" / "ea"


LECTURE_TITLES = {
    "l01": "Lecture 01 - Energy Scenario and Audit Foundations",
    "l02": "Lecture 02 - Energy Acts, Management, and Audit",
    "l03": "Lecture 03 - Energy Monitoring and Targeting",
    "l04": "Lecture 04 - Financial Evaluation of Energy Projects",
    "l05": "Lecture 05 - Energy Efficiency and Climate Change",
    "l06": "Lecture 06 - Electrical Power Systems",
    "l07": "Lecture 07 - Load Curves and Load Factor",
    "l08": "Lecture 08 - Power Factor Improvement",
    "l09": "Lecture 09 - Electrical Energy Tariffs",
    "l10": "Lecture 10 - Demand-Side Management",
    "l11": "Lecture 11 - Electric Motors and Variable-Speed Drives",
    "l12": "Lecture 12 - Fans and Pumps",
    "l13": "Lecture 13 - Energy-Efficient Lighting Systems",
    "l14": "Lecture 14 - Daylighting Strategies",
    "l15": "Lecture 15 - HVAC Systems",
    "l16": "Lecture 16 - Fuels and Combustion",
    "l17": "Lecture 17 - Steam Systems",
    "l18": "Lecture 18 - Boilers and Furnaces",
    "l19": "Lecture 19 - Heat Exchangers",
    "l20": "Lecture 20 - Cogeneration and CHP",
    "l21": "Lecture 21 - New and Renewable Energy Sources",
    "l22": "Lecture 22 - Energy Conservation in Buildings",
    "l23": "Lecture 23 - Global Adoption of Energy-Efficient Products",
}


TUTORIAL_TITLES = {
    "t01-energy-calculations": "Tutorial 01 - Basic Energy Calculations",
    "t02-energy-audit-of-home": "Tutorial 02 - Home Energy Audit",
    "t03-cumsum-analysis": "Tutorial 03 - CUSUM Analysis",
    "t04-financial-analysis": "Tutorial 04 - Financial Analysis",
    "t05-electrical-power-system": "Tutorial 05 - Electrical Power Systems and Load Curves",
    "t06-electrical-energy-tariff": "Tutorial 06 - Electrical Energy Tariffs",
    "t07-power-factor-improvement": "Tutorial 07 - Power Factor Improvement",
    "t08-lighting-systems": "Tutorial 08 - Lighting Systems",
    "t09-electricmotors-fans-pumps": "Tutorial 09A - Electric Motors, Fans, and Pumps",
    "t09-hvac-systems": "Tutorial 09B - HVAC Systems",
    "t10-fuels-boilers": "Tutorial 10 - Fuels, Combustion, and Boilers",
    "t11-steam-furnace-heat-exchangers": "Tutorial 11 - Steam, Furnaces, and Heat Exchangers",
}


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def repo_path(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()


def resolve_repo_path(value: str) -> Path:
    path = Path(value)
    return path.resolve() if path.is_absolute() else (ROOT / path).resolve()


def extract_deck_images(record: dict[str, Any]) -> tuple[list[Path], dict[int, list[Path]]]:
    """Decode Mistral's embedded deck images for an Ox vision pass.

    OCR markdown intentionally contains image placeholders when a table is
    embedded in a slide. Keep the original response under tmp and materialize
    only decoded, untracked working copies for OpenCode's -f attachments.
    """
    if record.get("kind") not in {"lecture", "tutorial"}:
        return [], {}
    source_id = str(record["id"])
    report = read_json(TEMP_ROOT / "ocr" / source_id / "report.json")
    raw_path = TEMP_ROOT / str(report.get("rawResponsePath") or "")
    if not raw_path.is_file():
        raise RuntimeError(f"Missing raw Mistral response for {source_id}: {raw_path}")
    response = read_json(raw_path)
    attachments: list[Path] = []
    by_slide: dict[int, list[Path]] = {}
    image_root = INPUT_ROOT / "images" / source_id
    for page in response.get("pages") or []:
        slide_number = int(page.get("index", 0)) + 1
        for image_index, image in enumerate(page.get("images") or []):
            encoded = str(image.get("image_base64") or "")
            if not encoded:
                continue
            header, payload = encoded.split(",", 1) if "," in encoded else ("", encoded)
            source_name = Path(str(image.get("id") or f"image-{image_index}.jpg"))
            suffix = source_name.suffix.lower()
            if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
                mime = header.split(";", 1)[0].split(":", 1)[-1]
                suffix = {"image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}.get(mime, ".jpg")
            target = image_root / f"slide-{slide_number:03d}-image-{image_index:02d}{suffix}"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(base64.b64decode(payload))
            attachments.append(target)
            by_slide.setdefault(slide_number, []).append(target)
    return attachments, by_slide


def compact_deck_source(record: dict[str, Any]) -> tuple[Path, list[Path]]:
    source_id = str(record["id"])
    native = read_json(resolve_repo_path(str(record["nativePath"])))
    reconciled = read_json(TEMP_ROOT / "reconciled" / f"{source_id}.json")
    attachments, images_by_slide = extract_deck_images(record)
    native_by_number = {int(slide["slideNumber"]): slide for slide in native.get("slides", [])}
    lines = [
        f"SOURCE ID: {source_id}",
        f"SOURCE FILE: {record['filename']}",
        f"SOURCE SHA256: {record['sha256']}",
        f"SLIDE COUNT: {record['slideCount']}",
        "",
    ]
    for slide in reconciled.get("slides", []):
        number = int(slide["slideNumber"])
        native_slide = native_by_number.get(number, {})
        lines.append(f"===== SLIDE {number} =====")
        lines.append("NATIVE TEXT:")
        lines.append(str(slide.get("nativeText") or "[no native text]"))
        lines.append("\nMISTRAL OCR:")
        lines.append(str(slide.get("ocrMarkdown") or "[no OCR text]"))
        tables = native_slide.get("tables") or []
        equations = native_slide.get("equations") or []
        notes = (native_slide.get("speakerNotes") or {}).get("text") if isinstance(native_slide.get("speakerNotes"), dict) else None
        images = slide.get("ocrImages") or []
        if tables:
            lines.append("\nNATIVE TABLES:")
            lines.append(json.dumps(tables, ensure_ascii=False))
        if equations:
            lines.append("\nNATIVE EQUATIONS:")
            lines.append(json.dumps([item.get("text") for item in equations], ensure_ascii=False))
        if notes:
            lines.append("\nSPEAKER NOTES:")
            lines.append(str(notes))
        if images:
            lines.append("\nOCR IMAGE METADATA:")
            lines.append(json.dumps(images, ensure_ascii=False))
        if images_by_slide.get(number):
            lines.append("\nOCR IMAGE ATTACHMENTS (inspect these files for visual/table data):")
            lines.extend(f"- {repo_path(path)}" for path in images_by_slide[number])
        lines.append("")
    target = INPUT_ROOT / "decks" / f"{source_id}.txt"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
    return target, attachments


def compact_pyq_source(paper: dict[str, Any], index: int) -> tuple[str, Path]:
    extraction_path = resolve_repo_path(str(paper["nativeExtractionPath"]))
    extraction = read_json(extraction_path)
    local_name = Path(str(paper["localPdfPath"])).stem
    slug = f"pyq-{index:02d}-{local_name}"
    lines = [
        "HISTORICAL PREDECESSOR-CODE PAPER - NOT AN EXACT ELE 4446 PAPER",
        f"API ID: {paper['id']}",
        f"TITLE: {paper['title']}",
        f"YEAR: {paper['year']}",
        f"EXAM TYPE: {paper['examType']}",
        f"PREDECESSOR CODE: {paper['predecessorCode']}",
        f"SEMESTER: {paper['semester']}",
        f"SOURCE URL: {paper['sourceUrlUsed']}",
        f"SHA256: {paper['sha256']}",
        f"METADATA WARNINGS: {json.dumps(paper.get('metadataWarnings') or [], ensure_ascii=False)}",
        "",
    ]
    native_pages = {int(page["pageNumber"]): page for page in extraction.get("native", {}).get("pages", [])}
    ocr_pages = {int(page["pageNumber"]): page for page in extraction.get("ocr", {}).get("pages", [])}
    for page_number in range(1, int(paper["pageCount"]) + 1):
        lines.append(f"===== PAGE {page_number} =====")
        lines.append("NATIVE PDF TEXT:")
        lines.append(str(native_pages.get(page_number, {}).get("text") or "[no native text]"))
        lines.append("\nMISTRAL OCR:")
        lines.append(str(ocr_pages.get(page_number, {}).get("markdown") or "[no OCR text]"))
        lines.append("")
    target = INPUT_ROOT / "pyq" / f"{slug}.txt"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
    return slug, target


def source_jobs() -> list[dict[str, Any]]:
    source_manifest = read_json(SOURCE_MANIFEST)
    pyq_manifest = read_json(PYQ_MANIFEST)
    if source_manifest.get("actualCounts") != source_manifest.get("expectedCounts"):
        raise RuntimeError("Deck source manifest counts are not accepted.")
    if pyq_manifest.get("admittedPaperCount") != 10:
        raise RuntimeError("The authoring pass requires ten admitted PYQ papers.")
    jobs: list[dict[str, Any]] = []
    tutorial_position = 101
    for record in source_manifest["files"]:
        source_id = str(record["id"])
        source_path, attachments = compact_deck_source(record)
        if record["kind"] == "lecture":
            prefix = source_id[:3]
            title = LECTURE_TITLES[prefix]
            sequence = int(record["sequence"])
            slug = f"lecture-{sequence:02d}-{source_id[4:]}"
            position = sequence
        else:
            title = TUTORIAL_TITLES[source_id]
            slug = f"tutorial-{source_id}"
            position = tutorial_position
            tutorial_position += 1
        jobs.append({
            "slug": slug,
            "kind": record["kind"],
            "title": title,
            "sidebarPosition": position,
            "sourceLabel": f"{record['filename']} ({record['slideCount']} slides)",
            "sourcePath": repo_path(source_path),
            "attachments": [repo_path(path) for path in attachments],
            "outputPath": repo_path(DOCS_ROOT / f"{slug}.md"),
            "provenance": {
                "sourceId": source_id,
                "filename": record["filename"],
                "sha256": record["sha256"],
                "slideCount": record["slideCount"],
                "nativeExtraction": record["nativePath"],
                "mistralOcr": f"tmp/energy-auditing/ocr/{source_id}/report.json",
                "reconciliation": f"tmp/energy-auditing/reconciled/{source_id}.json",
            },
        })
    for index, paper in enumerate(pyq_manifest["papers"], start=1):
        slug, source_path = compact_pyq_source(paper, index)
        title = f"Historical PYQ {index:02d} - {paper['year']} {paper['examType']} ({paper['predecessorCode']})"
        jobs.append({
            "slug": slug,
            "kind": "pyq",
            "title": title,
            "sidebarPosition": 200 + index,
            "sourceLabel": f"{paper['title']} - {paper['year']} {paper['examType']}",
            "sourcePath": repo_path(source_path),
            "outputPath": repo_path(DOCS_ROOT / f"{slug}.md"),
            "provenance": {
                "apiId": paper["id"],
                "year": paper["year"],
                "examType": paper["examType"],
                "predecessorCode": paper["predecessorCode"],
                "sourceUrl": paper["sourceUrlUsed"],
                "sha256": paper["sha256"],
                "pageCount": paper["pageCount"],
                "metadataWarnings": paper.get("metadataWarnings") or [],
            },
        })
    return jobs


def support_jobs() -> list[dict[str, Any]]:
    authored = sorted(DOCS_ROOT.glob("lecture-*.md")) + sorted(DOCS_ROOT.glob("tutorial-*.md")) + sorted(DOCS_ROOT.glob("pyq-*.md"))
    if len(authored) != 45:
        raise RuntimeError(f"Support authoring requires 45 source-specific notes, found {len(authored)}.")
    support_specs = [
        ("overview", "Energy Auditing (ELE 4446) - Course Overview", 0),
        ("formula-revision-sheet", "Energy Auditing Formula and Revision Sheet", 301),
        ("question-bank", "Energy Auditing Comprehensive Question Bank", 302),
        ("pyq-topic-frequency", "Energy Auditing Historical PYQ Topic Frequency", 303),
    ]
    support_root = INPUT_ROOT / "support"
    support_root.mkdir(parents=True, exist_ok=True)

    def without_frontmatter(text: str) -> str:
        return re.sub(r"\A---\n[\s\S]*?\n---\n+", "", text, count=1)

    def selected_lines(text: str, pattern: re.Pattern[str], context: int = 1) -> str:
        lines = text.splitlines()
        indexes: set[int] = set()
        for index, line in enumerate(lines):
            if pattern.search(line):
                indexes.update(range(max(0, index - context), min(len(lines), index + context + 1)))
        return "\n".join(lines[index] for index in sorted(indexes))

    def question_extract(text: str) -> str:
        lines = text.splitlines()
        kept: list[str] = []
        in_source_wording = False
        for line in lines:
            if re.match(r"^#{1,2}\s+", line) or re.match(r"^<summary>", line, flags=re.IGNORECASE):
                kept.append(line)
            if re.match(r"^(?:###\s+|\*\*)(?:Source wording|Topic|Marks?|Provenance)", line, flags=re.IGNORECASE):
                in_source_wording = True
                kept.append(line)
                continue
            if in_source_wording and (re.match(r"^###\s+", line) or (re.match(r"^\*\*[^*]+:\*\*", line) and not re.match(r"^\*\*(?:Source wording|Topic|Marks?|Provenance)", line, flags=re.IGNORECASE))):
                in_source_wording = False
            if in_source_wording and line.strip():
                kept.append(line)
            elif re.search(r"\b(?:source question|assessment question|PYQ-based|worked solution - not an official answer)\b", line, flags=re.IGNORECASE):
                kept.append(line)
        return "\n".join(kept)

    note_texts = [(path, without_frontmatter(path.read_text(encoding="utf-8"))) for path in authored]
    formula_pattern = re.compile(
        r"(?:\$|\\frac|\\eta|\\Delta|\\times|\bformula\b|\bequation\b|\bgoverning relation\b|\bunits?\b|\bkWh\b|\bkVAR\b|\bkVA\b|\befficiency\b)",
        flags=re.IGNORECASE,
    )
    support_sources = {
        "overview": "\n\n".join(
            f"===== NOTE {path.name} =====\n" + selected_lines(text, re.compile(r"^(?:#|>.*(?:source|predecessor)|.*(?:learning outcomes|quick revision))", re.IGNORECASE), 1)
            for path, text in note_texts
        ),
        "formula-revision-sheet": "\n\n".join(
            f"===== NOTE {path.name} =====\n" + selected_lines(text, formula_pattern, 1)
            for path, text in note_texts
        ),
        "question-bank": "\n\n".join(
            f"===== NOTE {path.name} =====\n" + question_extract(text)
            for path, text in note_texts
        ),
        "pyq-topic-frequency": "\n\n".join(
            f"===== NOTE {path.name} =====\n" + question_extract(text)
            for path, text in note_texts if path.name.startswith("pyq-")
        ),
    }
    jobs = []
    for slug, title, position in support_specs:
        target = support_root / f"{slug}.txt"
        target.write_text(support_sources[slug].strip() + "\n", encoding="utf-8")
        jobs.append({
            "slug": slug,
            "kind": "support",
            "title": title,
            "sidebarPosition": position,
            "sourceLabel": "All 45 source-specific Energy Auditing notes",
            "sourcePath": repo_path(target),
            "outputPath": repo_path(DOCS_ROOT / f"{slug}.md"),
            "provenance": {"sourceNoteCount": 45, "courseCode": "SEM7-EA"},
        })
    return jobs


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=["sources", "supports", "all"], default="sources")
    args = parser.parse_args()
    jobs: list[dict[str, Any]] = []
    if JOBS_PATH.exists():
        current = read_json(JOBS_PATH)
        jobs = [item for item in current.get("jobs", []) if isinstance(item, dict)]
    if args.phase in {"sources", "all"}:
        source_items = source_jobs()
        jobs = [item for item in jobs if item.get("kind") == "support"] + source_items
    if args.phase in {"supports", "all"}:
        support_items = support_jobs()
        jobs = [item for item in jobs if item.get("kind") != "support"] + support_items
    kind_order = {"lecture": 0, "tutorial": 1, "pyq": 2, "support": 3}
    jobs.sort(key=lambda item: (kind_order.get(str(item.get("kind")), 9), int(item.get("sidebarPosition") or 0), str(item.get("slug"))))
    JOBS_PATH.parent.mkdir(parents=True, exist_ok=True)
    JOBS_PATH.write_text(json.dumps({"schemaVersion": 1, "model": "opencode-go/ox-alpha-free", "variant": "max", "jobs": jobs}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counts = {kind: sum(item["kind"] == kind for item in jobs) for kind in kind_order}
    print(json.dumps({"jobs": len(jobs), "counts": counts, "path": repo_path(JOBS_PATH)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
