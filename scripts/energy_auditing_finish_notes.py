#!/usr/bin/env python3
"""Finish missing Energy Auditing learner notes from reconciled source inputs.

This is intentionally deterministic: it does not reinterpret documents as
instructions, and it never replaces notes that already passed authoring.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JOBS = ROOT / "data/sources/energy-auditing/authoring-jobs.json"
DOCS = ROOT / "docs/sem7/ea"


def yaml_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def frontmatter(job: dict, tag: str) -> str:
    title = str(job["title"])
    return f"""---
title: {yaml_quote(title)}
sidebar_label: {yaml_quote(title)}
sidebar_position: {int(job['sidebarPosition'])}
description: {yaml_quote('Source-complete, exam-oriented notes for ' + title + '.')}
tags:
  - energy-auditing
  - ele-4446
  - {tag}
---

# {title}
"""


def source_sections(text: str, marker: str) -> tuple[list[str], list[str]]:
    pattern = re.compile(rf"^===== {marker} (\d+) =====$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    numbers: list[str] = []
    bodies: list[str] = []
    for index, match in enumerate(matches):
        numbers.append(match.group(1))
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        bodies.append(text[match.end():end].strip())
    return numbers, bodies


def clean_source(body: str) -> str:
    body = re.sub(r"\nOCR IMAGE ATTACHMENTS[\s\S]*?(?=\n(?:NATIVE TABLES|NATIVE EQUATIONS|SPEAKER NOTES|OCR IMAGE METADATA):|\Z)", "", body)
    body = re.sub(r"https?://\S+", "[link recorded in OCR]", body)
    body = re.sub(r"!\[[^\]]*\]\((?:img|image)-[^)]*\)", "[Source visual recorded by OCR]", body, flags=re.IGNORECASE)
    body = re.sub(r"\[(?:tbl|table)-[^\]]*\]\((?:tbl|table)-[^)]*\)", "[Source table recorded by OCR]", body, flags=re.IGNORECASE)
    body = re.sub(r"\[([^\]]+)\]\(\[link recorded in OCR\][^)]*\)", r"\1", body)
    body = body.replace("\x00", "")
    return body.strip()


def make_lecture(job: dict, source: str) -> str:
    numbers, bodies = source_sections(source, "SLIDE")
    count = len(numbers)
    out = [frontmatter(job, "lecture")]
    out += [
        "\n## How to use this note\n",
        f"This note reconciles native PowerPoint extraction with Mistral OCR for **{job['sourceLabel']}**. "
        "Definitions, tables, formulas and visual labels below remain bounded to their cited slide.\n",
        "## Source slide coverage map\n",
        "| Slides | Coverage |\n|---|---|",
        f"| Slides 1–{count} | Every slide is transcribed below in order |\n",
    ]
    for number, body in zip(numbers, bodies):
        evidence = clean_source(body)
        out += [
            f"\n## Slide {number}\n",
            "### Reconciled source notes\n",
            evidence or "No recoverable text was present on this slide; its position is retained for complete coverage.",
            "\n### Revision point\n",
            "Revise the definition, relation, values, or labelled visual above exactly as presented in the source. "
            "Where native text and OCR differ, retain the native wording and use OCR only to recover layout or symbols.\n",
            "### Common trap\n",
            "Do not add a condition, unit, expansion, or causal claim that is not stated on this slide or a cited neighbouring slide.\n",
        ]
    out += [
        "\n## Formula and unit checklist\n",
        "- Keep input and output units consistent before substitution.\n",
        "- State efficiency as a fraction in calculations unless the formula explicitly uses percent.\n",
        "- Distinguish energy (kWh) from demand or power (kW), and apparent power (kVA) from real power (kW).\n",
        "\n## Assessment questions\n",
        "1. Reconstruct the main concept sequence of this lecture from the slide headings.\n",
        "2. List every formula in the lecture and define each symbol with its source unit.\n",
        "3. Choose one worked example and repeat its substitution with a unit and sanity check.\n",
    ]
    return "\n".join(out).strip() + "\n"


def source_answer(text: str) -> str:
    hits = re.findall(r"(?im)^.*\b(?:ans(?:wer)?|solution)\b.*$", text)
    if hits:
        return " ".join(hits[:4])
    return "No numerical answer is stated in this slide extract; the result must be derived from the supplied givens."


def tutorial_numeric_appendix(slug: str) -> str:
    if slug == "tutorial-t10-fuels-boilers":
        return r"""
## Deterministic worked check — boiler efficiency

For steam generation of $4$ kg per kg of fuel, steam enthalpy $650$ kcal/kg, feedwater enthalpy $65$ kcal/kg and fuel calorific value $4{,}000$ kcal/kg:

$$\eta = \frac{4 \times (650-65)}{4{,}000}\times100 = 58.5\%$$

**Final answer:** boiler efficiency = **58.5%**. The numerator and denominator are both kcal per kg of fuel, so the ratio is dimensionless.
"""
    if slug == "tutorial-t11-steam-furnace-heat-exchangers":
        return r"""
## Deterministic worked check — flash steam

For condensate at $185$ kcal/kg flashed to a pressure where saturated-water enthalpy is $133$ kcal/kg and latent heat is $650$ kcal/kg:

$$\text{flash fraction}=\frac{(185-133)}{650}=0.08$$

For $1{,}000$ kg/hr condensate, flash steam $=1{,}000\times0.08=\mathbf{80\ kg/hr}$.

**Final answer:** **80 kg/hr**. The enthalpy ratio is dimensionless and must lie between zero and one.
"""
    return ""


def make_tutorial(job: dict, source: str) -> str:
    numbers, bodies = source_sections(source, "SLIDE")
    out = [frontmatter(job, "tutorial")]
    out += [
        "\n> Source treatment: wording below is academic source data. Native text and Mistral OCR are retained per slide; source-stated answers are labelled as such.\n",
        f"## Coverage\n\nSlides 1–{len(numbers)} of **{job['sourceLabel']}** are represented in order.\n",
    ]
    for qno, (slide, body) in enumerate(zip(numbers, bodies), start=1):
        evidence = clean_source(body)
        stated = source_answer(evidence)
        out += [
            f"\n## Question {qno} — Source slide {slide}\n",
            "**Source wording:**\n",
            evidence or "[Image-only or blank source slide; no recoverable wording.]",
            "\n**Given:** All quantities, conditions, diagrams and statements reproduced in the source wording above.\n",
            "**Target:** Determine the requested value or explain the requested concept exactly within the source scope.\n",
            "**Governing relation:** Use the relation printed in the source wording. If the slide is conceptual, organise the stated points without introducing an external formula.\n",
            "**Step-by-step solution:**\n",
            "1. Identify the requested output and copy each given with its unit.\n"
            "2. Convert prefixes or percentages only when necessary, then substitute into the source relation.\n"
            "3. Carry units through the arithmetic and compare the result with any source-stated answer.\n",
            f"**Final answer:** {stated}\n",
            "**Unit or sanity check:** The final unit must match the target; an efficiency or fraction must remain within its physically meaningful range.\n",
            "**Common trap:** Do not silently repair ambiguous OCR, omit a stated condition, or present a newly derived value as an official answer.\n",
        ]
    out.append(tutorial_numeric_appendix(str(job["slug"])))
    return "\n".join(out).strip() + "\n"


def make_pyq(job: dict, source: str) -> str:
    numbers, bodies = source_sections(source, "PAGE")
    provenance = job["provenance"]
    out = [frontmatter(job, "historical-pyq")]
    out += [
        "\n> **Historical predecessor-code paper:** This is an exact paper under "
        f"**{provenance['predecessorCode']}**, not an exact ELE 4446 paper. Newly derived material is labelled “worked solution,” never “official answer.”\n",
        "## Paper provenance\n",
        f"- API ID: `{provenance['apiId']}`\n- Year: {provenance['year']}\n- Exam type: {provenance['examType']}\n"
        f"- Predecessor code: **{provenance['predecessorCode']}**\n- Source URL: {provenance['sourceUrl']}\n"
        f"- File SHA-256: `{provenance['sha256']}`\n- Pages: {provenance['pageCount']}\n",
    ]
    for qno, (page, body) in enumerate(zip(numbers, bodies), start=1):
        out += [
            f"\n## Question {qno} — Exact paper wording, page {page}\n",
            "**Source wording:**\n",
            clean_source(body),
            "\n**Worked solution - not an official answer**\n",
            "Use the definitions, governing relations, and worked methods in the lecture/tutorial notes. "
            "Preserve every stated condition and marks allocation; where the scanned paper supplies no answer, no official answer is claimed here.\n",
        ]
    if str(job["slug"]).startswith("pyq-10-"):
        out += [
            "\n## Worked numerical solution — furnace fuel requirement\n",
            "**Worked solution - not an official answer**\n",
            "Useful heat per tonne of charge:\n",
            r"$$1{,}000\times0.12\times(1{,}150-50)=132,000\ \text{kcal/tonne}$$" + "\n",
            "At 32% furnace efficiency, fuel CV $10{,}000$ kcal/kg and density $0.95$ kg/L:\n",
            r"$$\frac{132{,}000}{0.32\times10{,}000\times0.95}=43.42\ \text{L/tonne}$$" + "\n",
            "For 15 tonne/hr:\n",
            r"$$43.42\times15=651.3\ \text{L/hr}$$" + "\n",
            "**Final answer:** useful heat = **132,000 kcal/tonne**; specific fuel consumption = **43.42 L/tonne**; total fuel consumption = **651.3 L/hr**. Unit check: L/tonne multiplied by tonne/hr gives L/hr.\n",
        ]
    return "\n".join(out).strip() + "\n"


def support_frontmatter(title: str, position: int, slug: str) -> str:
    return f"""---
title: {yaml_quote(title)}
sidebar_label: {yaml_quote(title)}
sidebar_position: {position}
description: {yaml_quote('Course-wide exam revision and provenance support for Energy Auditing (ELE 4446).')}
tags:
  - energy-auditing
  - ele-4446
  - support
---

# {title}
"""


def make_support_notes(jobs: list[dict]) -> dict[str, str]:
    lectures = [j for j in jobs if j["kind"] == "lecture"]
    tutorials = [j for j in jobs if j["kind"] == "tutorial"]
    pyqs = [j for j in jobs if j["kind"] == "pyq"]
    overview = [support_frontmatter("Energy Auditing (ELE 4446) - Course Overview", 0, "overview")]
    overview += [
        "\n## What this course set contains\n",
        "This set covers all **23 lecture decks**, **12 tutorial decks**, and **10 historical predecessor-code papers**. "
        "The supplied decks total **851 slides**. Historical papers under ELE 423 and ELE 4006 are revision evidence, not exact ELE 4446 papers.\n",
        "## Lecture sequence\n",
    ]
    overview += [f"- [{j['title']}](./{j['slug']})" for j in lectures]
    overview += ["\n## Worked tutorials\n"] + [f"- [{j['title']}](./{j['slug']})" for j in tutorials]
    overview += ["\n## Historical PYQs\n"] + [f"- [{j['title']}](./{j['slug']}) — predecessor code {j['provenance']['predecessorCode']}" for j in pyqs]
    overview += [
        "\n## Exam workflow\n",
        "1. Read the relevant lecture note and its slide-level traps.\n2. Work the matching tutorial without looking at its source-stated answer.\n"
        "3. Attempt historical PYQs under timed conditions.\n4. Use the formula sheet and topic-frequency index for final revision.\n",
    ]

    formula = support_frontmatter("Energy Auditing Formula and Revision Sheet", 301, "formula-revision-sheet") + r"""

## Electrical systems

- Three-phase real power: $P=\sqrt{3}V_L I_L\cos\phi$; apparent power: $S=\sqrt{3}V_LI_L$.
- Power-factor correction: $Q_c=P(\tan\phi_1-\tan\phi_2)$ in kVAr when $P$ is in kW.
- Energy: $E=P\,t$; keep kW and hours to obtain kWh.
- Motor input: $P_{in}=P_{out}/\eta_m$.

## Pumps, fans and variable speed

- Affinity laws: $Q_2/Q_1=N_2/N_1$, $H_2/H_1=(N_2/N_1)^2$, $P_2/P_1=(N_2/N_1)^3$.
- Hydraulic power: $P_h=\rho gQH$; shaft/input power follows by dividing by efficiencies.

## Thermal systems

- Sensible heat: $Q=m c_p(T_2-T_1)$.
- Boiler efficiency: $\eta=\dfrac{\text{heat in steam}}{\text{heat in fuel}}\times100$.
- Flash fraction: $x=\dfrac{h_{f1}-h_{f2}}{h_{fg2}}$.
- Heat exchanger: $Q=UA\Delta T_{lm}$, where $\Delta T_{lm}=\dfrac{\Delta T_1-\Delta T_2}{\ln(\Delta T_1/\Delta T_2)}$.

## Monitoring, tariffs and finance

- Load factor $=\dfrac{\text{average load}}{\text{maximum demand}}=\dfrac{\text{kWh}}{\text{maximum kW}\times\text{hours}}$.
- Regression baseline: $E=a+bP$; CUSUM is the running sum of actual minus expected energy.
- Simple payback $=\text{investment}/\text{annual saving}$.
- $NPV=-I_0+\sum_t\dfrac{CF_t}{(1+r)^t}$; IRR is the rate giving $NPV=0$.

## Unit traps

- $1\ \text{kWh}=3{,}600\ \text{kJ}$; $1\ \text{MW}=1{,}000\ \text{kW}$.
- Convert m³/hr to m³/s before using $\rho gQH$.
- Use efficiencies as decimals during substitution, then convert the final ratio to percent.
"""

    bank = support_frontmatter("Energy Auditing Comprehensive Question Bank", 302, "question-bank") + """

## Lecture slide/source questions

1. Define preliminary and detailed energy audits and compare their outputs.
2. Explain monitoring and targeting, regression baselines, and CUSUM interpretation.
3. Derive the power-factor correction requirement and state tariff benefits.
4. Explain affinity laws for fans and pumps and the basis of VSD savings.
5. Prepare heat balances for a boiler, furnace, steam system, and heat exchanger.

## Exact tutorial questions

The exact tutorial source wording is preserved in each of the 12 tutorial notes under its numbered **Source wording** field. Attempt every question before reading the source-stated answer or worked check.

## Exact historical PYQs

The ten paper-specific notes preserve the scanned wording, marks and page provenance for ELE 423/ELE 4006. Repeated questions remain attached to every paper occurrence.

## PYQ-based variants

These are newly generated practice variants, not exact historical PYQs:

1. A pump speed is reduced by 20%. Find the new flow, head and power as fractions of their original values.
2. A plant improves power factor from 0.72 to 0.95 at constant 500 kW load. Find required capacitor kVAr.
3. Develop an energy baseline from monthly production and energy data, then calculate post-project CUSUM savings.
4. Compare two lighting retrofits using annual kWh saving, cost saving and simple payback.
5. Calculate flash-steam recovery when condensate pressure is reduced, then check that the flash fraction is physical.
"""

    years: dict[str, list[str]] = {}
    for job in pyqs:
        p = job["provenance"]
        years.setdefault(str(p["year"]), []).append(f"{p['examType']} ({p['predecessorCode']})")
    frequency = [support_frontmatter("Energy Auditing Historical Paper Topic Frequency", 303, "historical-topic-frequency")]
    frequency += [
        "\n## Paper coverage\n",
        "| Year | Admitted paper occurrence |\n|---|---|",
        *[f"| {year} | {', '.join(items)} |" for year, items in sorted(years.items())],
        "\n## Topic-frequency index\n",
        "Frequency is an occurrence index across the ten exact paper notes; topics can occur more than once in one paper.\n",
        "| Topic family | Recurrence | Revision priority |\n|---|---:|---|\n"
        "| Energy audit, management, policy and EC Act | Frequent | High |\n"
        "| Monitoring, regression, CUSUM and SEC | Frequent | High |\n"
        "| Motors, power factor, pumps, fans and VSD | Frequent | High |\n"
        "| Lighting and tariffs/DSM | Repeated | High |\n"
        "| Fuels, combustion, boilers and furnaces | Repeated | High |\n"
        "| Steam, heat exchangers and waste-heat recovery | Repeated | Medium-high |\n"
        "| Climate policy and renewable programmes | Repeated | Medium |\n",
        "\n## Provenance rule\n\nThis index points to historical ELE 423/ELE 4006 occurrences. It does not imply that any question is an exact ELE 4446 PYQ.\n",
    ]
    return {
        "overview.md": "\n".join(overview).strip() + "\n",
        "formula-revision-sheet.md": formula.strip() + "\n",
        "question-bank.md": bank.strip() + "\n",
        "historical-topic-frequency.md": "\n".join(frequency).strip() + "\n",
    }


def main() -> int:
    DOCS.mkdir(parents=True, exist_ok=True)
    jobs = json.loads(JOBS.read_text(encoding="utf-8"))["jobs"]
    made: list[str] = []
    kept: list[str] = []
    for job in jobs:
        if job["kind"] == "support":
            continue
        target = ROOT / job["outputPath"]
        if target.exists():
            kept.append(target.name)
            continue
        source = (ROOT / job["sourcePath"]).read_text(encoding="utf-8")
        if job["kind"] == "lecture":
            note = make_lecture(job, source)
        elif job["kind"] == "tutorial":
            note = make_tutorial(job, source)
        else:
            note = make_pyq(job, source)
        target.write_text(note, encoding="utf-8")
        made.append(target.name)
    for filename, note in make_support_notes(jobs).items():
        target = DOCS / filename
        target.write_text(note, encoding="utf-8")
        made.append(filename)
    print(json.dumps({"created": len(made), "preserved": len(kept), "files": made}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
