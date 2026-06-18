#!/usr/bin/env python3
"""Generate the EM-II PYQ distinct question bank.

This bank is stricter than the full answer bank but less aggressive than the
concept-level unique bank. It removes exact repeats and same-task/value-only
variants while keeping changed subparts, diagrams, required outputs, or methods.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FULL_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-answer-bank.md"
OUT = ROOT / "docs" / "sem5" / "em2" / "pyq-distinct-question-bank.md"


REMOVED_DUPLICATES: dict[int, tuple[int, str]] = {
    13: (4, "same winding-factor and EMF numerical task; only source wording changes"),
    14: (4, "same winding-factor and EMF numerical task; only source wording changes"),
    17: (3, "same harmonic phase-voltage task; only formatting/source wording changes"),
    20: (4, "same winding-factor and EMF numerical task; only source wording changes"),
    24: (22, "removed from distinct bank by request; same rotor-slip calculation area"),
    25: (24, "removed from distinct bank by request; rotor EMF injection theory paired with removed numerical task"),
    61: (58, "same circle-diagram task and requested outputs; only formatting changes"),
    93: (91, "same armature-reaction theory question"),
    94: (92, "same synchronous-motor UPF/excitation numerical task"),
    101: (90, "same alternator voltage-regulation numerical task"),
    103: (85, "same varying-excitation phasor-diagram question"),
    106: (104, "same synchronizing conditions and two-bright one-dark method question"),
    118: (115, "same reluctance-power salient-pole theory question"),
    119: (117, "same Blondel two-reaction phasor-diagram question"),
    136: (133, "same plant kVA and overall power-factor task; only values change"),
    140: (126, "same parallel alternator maximum-power task; only unit formatting changes"),
}


@dataclass
class QuestionBlock:
    number: int
    raw: str

    def render(self, new_number: int) -> str:
        rendered = re.sub(
            r"(?m)^## Question \d+\s*$",
            f"## Question {new_number}",
            self.raw,
            count=1,
        )
        rendered = re.sub(
            r"(?m)^### Answer \d+\s*$",
            f"### Answer {new_number}",
            rendered,
            count=1,
        )
        return rendered.rstrip() + "\n\n"


def parse_blocks(path: Path) -> list[QuestionBlock]:
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(r"(?m)^## Question (\d+)\s*$", text))
    if not matches:
        raise RuntimeError(f"No question blocks found in {path}")

    blocks: list[QuestionBlock] = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        number = int(match.group(1))
        blocks.append(QuestionBlock(number=number, raw=text[match.start() : end]))
    return blocks


def build_intro(total_questions: int) -> str:
    removed_rows = "\n".join(
        f"| Q{removed} | Q{kept} | {reason} |"
        for removed, (kept, reason) in sorted(REMOVED_DUPLICATES.items())
    )
    return f"""---
title: PYQ Distinct Question Bank
description: Electrical Machines II previous-year questions with exact and value-only repeats removed.
---

# Electrical Machines II PYQ Distinct Question Bank

This bank is generated from the full 141-question PYQ answer bank. It keeps questions when the required derivation, subparts, diagram, comparison, or requested outputs change. It removes only exact repeats and same-method templates where the practical difference is source wording, marks, formatting, or numerical values.

**Total questions:** {total_questions}

**Removed repeated questions:** {len(REMOVED_DUPLICATES)}

<details>
<summary>Removed repeat audit</summary>

| Removed full-bank question | Kept full-bank question | Reason |
|---|---|---|
{removed_rows}

</details>

---

"""


def main() -> int:
    blocks = parse_blocks(FULL_BANK)
    kept = [block for block in blocks if block.number not in REMOVED_DUPLICATES]
    if len(blocks) != 141:
        raise RuntimeError(f"Expected 141 full-bank questions, found {len(blocks)}")
    if len(kept) != 125:
        raise RuntimeError(f"Expected 125 distinct questions, found {len(kept)}")

    output = [build_intro(len(kept))]
    for new_number, block in enumerate(kept, start=1):
        output.append(block.render(new_number))
    OUT.write_text("".join(output).rstrip() + "\n", encoding="utf-8")
    print(f"[OK] wrote {OUT.relative_to(ROOT)} with {len(kept)} questions")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
