#!/usr/bin/env python3
"""Import the authored Studies Obsidian vault as eight standalone site courses."""

from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path
from urllib.parse import quote

SOURCE = Path("/home/sushi/Documents/Studies/Studies")
COURSES = {
    "CRA 4411 - Data Science Part II": "cra-4411-data-science-part-ii",
    "CRA 4412 - Advanced Data Science Part III": "cra-4412-advanced-data-science-part-iii",
    "Energy Auditing": "energy-auditing",
    "Introduction to Data Science": "introduction-to-data-science",
    "Introduction to Quantum Computing": "introduction-to-quantum-computing",
    "Power System Analysis": "power-system-analysis",
    "Power System Protection and Switchgear": "power-system-protection-and-switchgear",
    "Renewable Energy": "renewable-energy",
}


def slug(relative: Path) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", relative.with_suffix("").as_posix().replace("/", "-").lower()).strip("-")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=SOURCE)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "docs" / "studies")
    args = parser.parse_args()
    source, output = args.source.resolve(), args.output.resolve()
    if not source.is_dir() or any(not (source / name).is_dir() for name in COURSES):
        raise SystemExit("Studies vault or one of its eight subjects is missing")

    files = {name: sorted((source / name).rglob("*")) for name in COURSES}
    markdown_paths = {path.resolve(): Path("studies") / COURSES[name] / path.relative_to(source / name)
                      for name, paths in files.items() for path in paths if path.is_file() and path.suffix.lower() == ".md"}
    asset_paths = {path.resolve(): Path("studies") / COURSES[name] / path.relative_to(source / name)
                   for name, paths in files.items() for path in paths if path.is_file() and path.suffix.lower() != ".md"}
    asset_paths.update({path.resolve(): Path("studies") / "attachments" / path.relative_to(source / "Attachments")
                        for path in (source / "Attachments").rglob("*") if path.is_file()})
    asset_paths.update({path.resolve(): Path("studies") / path.relative_to(source)
                        for path in source.iterdir() if path.is_file() and path.suffix.lower() != ".md"})
    if output.exists():
        shutil.rmtree(output)

    def resolve_target(target: str, current: Path, course_root: Path, pool: dict[Path, Path]) -> Path | None:
        target = target.split("#", 1)[0].strip().replace("\\|", "|")
        if not target:
            return None
        candidates = [(current.parent / target).resolve(), (course_root / target).resolve(),
                      (source / target).resolve(), (source / "Attachments" / target).resolve()]
        candidates.extend((ancestor / target).resolve() for ancestor in current.parents if ancestor == course_root or course_root in ancestor.parents)
        if "/" not in target:
            candidates.extend(path for path in pool if path.name.lower() == target.lower() and course_root in path.parents)
        for candidate in candidates:
            if candidate in pool:
                return candidate
            if not candidate.suffix and candidate.with_suffix(".md") in pool:
                return candidate.with_suffix(".md")
        return None

    unresolved: list[str] = []
    for original in (source / "Attachments").rglob("*"):
        if original.is_file():
            destination = output / "attachments" / original.relative_to(source / "Attachments")
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(original, destination)
    for original in source.iterdir():
        if original.is_file() and original.suffix.lower() != ".md":
            shutil.copy2(original, output / original.name)

    for name, paths in files.items():
        course_root = source / name
        for original in paths:
            if not original.is_file():
                continue
            relative = original.relative_to(course_root)
            destination = output / COURSES[name] / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            if original.suffix.lower() != ".md":
                shutil.copy2(original, destination)
                continue
            body = original.read_text(encoding="utf-8")

            def wiki(match: re.Match[str]) -> str:
                image, raw = match.group(1), match.group(2)
                target, _, label = raw.replace("\\|", "|").partition("|")
                clean_target = target.split("#", 1)[0]
                pool = asset_paths if image or Path(clean_target).suffix.lower() not in ("", ".md") else markdown_paths
                found = resolve_target(target, original, course_root, pool)
                if found is None:
                    unresolved.append(f"{original.relative_to(source)} -> {target}")
                    return match.group(0)
                site_path = pool[found]
                if pool is asset_paths:
                    return f'{"!" if image else ""}[{label or found.stem}](/content-assets/{quote(site_path.as_posix())})'
                anchor = target.split("#", 1)[1] if "#" in target else ""
                return f'[{label or found.stem}](/notes/{slug(site_path)}{("#" + quote(anchor.lower().replace(" ", "-"))) if anchor else ""})'

            body = re.sub(r"(!?)\[\[([^\]]+)\]\]", wiki, body)

            def markdown_link(match: re.Match[str]) -> str:
                image, label, raw = match.group(1), match.group(2), match.group(3).strip("<>")
                if raw.startswith(("/", "http://", "https://", "#", "data:")):
                    return match.group(0)
                target, _, anchor = raw.partition("#")
                pool = asset_paths if image or Path(target).suffix.lower() not in ("", ".md") else markdown_paths
                found = resolve_target(target, original, course_root, pool)
                if found is None:
                    unresolved.append(f"{original.relative_to(source)} -> {raw}")
                    return match.group(0)
                route = f"/content-assets/{quote(pool[found].as_posix())}" if pool is asset_paths else f"/notes/{slug(pool[found])}"
                return f'{image}[{label}]({route}{("#" + quote(anchor)) if anchor else ""})'

            body = re.sub(r"(!?)\[([^\]\n]+)\]\((<[^>]+>|[^)\n]+)\)", markdown_link, body)
            if body.startswith("---\n"):
                end = body.find("\n---\n", 4)
                if end >= 0:
                    body = body[:end] + "\nmath_syntax: typst" + body[end:]
                else:
                    raise SystemExit(f"Malformed front matter: {original}")
            else:
                body = f'---\ntitle: "{original.stem.replace(chr(34), chr(39))}"\nmath_syntax: typst\n---\n\n' + body
            destination.write_text(body, encoding="utf-8")

    if unresolved:
        print(f"Warning: {len(unresolved)} source links were unresolved; first 20:\n" + "\n".join(unresolved[:20]))
    print(f"Imported {len(markdown_paths)} notes and {len(asset_paths)} assets across {len(COURSES)} subjects")


if __name__ == "__main__":
    main()
