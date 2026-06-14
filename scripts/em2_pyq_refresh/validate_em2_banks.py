#!/usr/bin/env python3
"""Validate refreshed EM-II PYQ answer banks."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
TARGETS = [
    (ROOT / "docs" / "sem5" / "em2" / "pyq-answer-bank.md", 141),
    (ROOT / "docs" / "sem5" / "em2" / "pyq-unique-question-bank.md", 52),
]
PLACEHOLDERS = re.compile(r"\b(TODO|TBD|insert diagram|placeholder|fix later|not available)\b", re.I)
OCR_ARTIFACTS = re.compile(r"\\barname|\brac\{|N s\b|P a g\b")


def validate_file(path: Path, expected_count: int) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    q_nums = [int(n) for n in re.findall(r"(?m)^## Question (\d+)\s*$", text)]
    a_nums = [int(n) for n in re.findall(r"(?m)^### Answer (\d+)\s*$", text)]
    if len(q_nums) != expected_count:
        errors.append(f"{path}: expected {expected_count} questions, found {len(q_nums)}")
    if q_nums != list(range(1, expected_count + 1)):
        errors.append(f"{path}: question numbering is not sequential")
    if a_nums != q_nums:
        errors.append(f"{path}: answer numbering does not match questions")
    if text.count("$$") % 2:
        errors.append(f"{path}: unbalanced $$ delimiters")
    if PLACEHOLDERS.search(text):
        match = PLACEHOLDERS.search(text)
        errors.append(f"{path}: placeholder-like text found near {match.group(0)!r}")
    if OCR_ARTIFACTS.search(text):
        match = OCR_ARTIFACTS.search(text)
        errors.append(f"{path}: OCR math artifact found near {match.group(0)!r}")

    for match in re.finditer(r"!\[[^\]]*]\(([^)]+)\)", text):
        link = match.group(1)
        if link.startswith(("http://", "https://")):
            continue
        image_path = (path.parent / link).resolve()
        if not image_path.exists():
            errors.append(f"{path}: missing image {link}")

    for num in q_nums:
        pattern = rf"(?ms)^### Answer {num}\s*\n(.*?)(?=\n---\s*\n\n## Question|\Z)"
        m = re.search(pattern, text)
        if not m:
            errors.append(f"{path}: missing answer body for {num}")
            continue
        answer = m.group(1).strip()
        if len(answer) < 500:
            errors.append(f"{path}: answer {num} is too short ({len(answer)} chars)")
        if "> **Final answer:**" not in answer:
            errors.append(f"{path}: answer {num} missing final answer block")
    return errors


def main() -> int:
    all_errors: list[str] = []
    for path, count in TARGETS:
        all_errors.extend(validate_file(path, count))
    if all_errors:
        for error in all_errors[:100]:
            print(f"[ERR] {error}")
        if len(all_errors) > 100:
            print(f"[ERR] ... {len(all_errors) - 100} more")
        return 1
    print("[OK] EM2 answer banks validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
