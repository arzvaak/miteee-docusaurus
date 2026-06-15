#!/usr/bin/env python3
"""Generate an EM-II theory-only question bank with concurrent DeepSeek calls."""

from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "sem5" / "em2" / "theory-question-bank.md"
MANIFEST = ROOT / "scripts" / "em2_pyq_refresh" / "web_diagrams.json"
CACHE = ROOT / ".em2-theory-cache"

MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
CONCURRENCY = int(os.environ.get("EM2_THEORY_CONCURRENCY", "8"))


THEMES: list[dict[str, Any]] = [
    {
        "module": "AC windings and generated EMF",
        "questions": [
            "Explain integral-slot and fractional-slot windings. State where each is preferred.",
            "Derive the distribution factor and pitch factor for an AC winding and explain their physical meaning.",
            "Explain how harmonics are reduced in AC machine windings using short-pitching and distributed windings.",
            "Explain the EMF equation of a three-phase alternator and the role of winding factor.",
        ],
        "diagrams": [],
    },
    {
        "module": "Rotating magnetic field and induction motor fundamentals",
        "questions": [
            "Explain how a balanced three-phase stator winding produces a rotating magnetic field.",
            "Explain slip, rotor frequency, and why an induction motor cannot run at synchronous speed.",
            "Compare squirrel-cage and slip-ring induction motors with practical applications.",
            "Explain the induction motor power flow from stator input to shaft output.",
        ],
        "diagrams": ["induction_equivalent_circuit"],
    },
    {
        "module": "Induction motor equivalent circuit",
        "questions": [
            "Explain the exact and approximate equivalent circuit of a three-phase induction motor.",
            "Explain why the rotor resistance appears as $R_2'/s$ in the induction motor equivalent circuit.",
            "Explain the significance of no-load and blocked-rotor tests in determining equivalent-circuit parameters.",
            "Explain the separation of rotor copper loss and mechanical power using the equivalent circuit.",
        ],
        "diagrams": ["induction_equivalent_circuit"],
    },
    {
        "module": "Torque-slip characteristics and speed control",
        "questions": [
            "Derive the qualitative torque-slip characteristic of a three-phase induction motor.",
            "Explain the conditions for maximum torque and why maximum torque is independent of rotor resistance.",
            "Explain rotor resistance control and why it is mainly used with slip-ring induction motors.",
            "Explain plugging, regenerative braking, and dynamic braking of induction motors.",
        ],
        "diagrams": ["induction_equivalent_circuit"],
    },
    {
        "module": "Circle diagram and performance tests",
        "questions": [
            "Explain the construction and use of the induction motor circle diagram.",
            "Explain how no-load and blocked-rotor test data are used to draw the circle diagram.",
            "Explain how maximum output, maximum torque, slip, power factor, and efficiency are read from the circle diagram.",
            "State the assumptions and limitations of the circle diagram method.",
        ],
        "diagrams": ["induction_circle_diagram"],
    },
    {
        "module": "Single-phase induction motors",
        "questions": [
            "Explain why a single-phase induction motor is not self-starting using double revolving field theory.",
            "Explain the working of a capacitor-start single-phase induction motor.",
            "Compare split-phase, capacitor-start, capacitor-run, and shaded-pole single-phase induction motors.",
            "Explain the torque-speed characteristic of a single-phase induction motor before and after starting.",
        ],
        "diagrams": ["single_phase_capacitor_motor"],
    },
    {
        "module": "Synchronous machine construction and EMF generation",
        "questions": [
            "Explain the constructional features of cylindrical-rotor and salient-pole synchronous machines.",
            "Explain the working principle of an alternator and how frequency is related to speed and poles.",
            "Explain armature winding, field winding, slip rings, brushes, and damper winding in a synchronous machine.",
            "Compare synchronous generator and synchronous motor operation.",
        ],
        "diagrams": ["synchronous_machine_construction"],
    },
    {
        "module": "Armature reaction and phasor diagrams",
        "questions": [
            "Explain armature reaction in an alternator at unity, lagging, and leading power factor loads.",
            "Draw and explain the phasor diagram of a loaded alternator at lagging power factor.",
            "Explain voltage regulation of an alternator and why it changes with power factor.",
            "Compare EMF method, MMF method, and zero power factor method of voltage regulation.",
        ],
        "diagrams": ["armature_reaction_phasor", "alternator_phasor_lagging"],
    },
    {
        "module": "Synchronization and parallel operation",
        "questions": [
            "State and explain the conditions required for synchronizing an alternator to busbars.",
            "Explain the two-bright one-dark lamp method of synchronizing alternators.",
            "Explain the use of a synchroscope and the effect of wrong phase sequence during synchronization.",
            "Explain load sharing between alternators operating in parallel.",
        ],
        "diagrams": ["alternator_phasor_lagging"],
    },
    {
        "module": "Synchronous motor excitation and V-curves",
        "questions": [
            "Explain why a synchronous motor is not self-starting and list common starting methods.",
            "Explain the effect of field excitation on armature current and power factor of a synchronous motor.",
            "Explain V-curves and inverted V-curves of a synchronous motor.",
            "Explain synchronous condenser operation and its use for power-factor correction.",
        ],
        "diagrams": ["synchronous_v_curve"],
    },
    {
        "module": "Salient-pole machines and two-reaction theory",
        "questions": [
            "Explain Blondel's two-reaction theory for salient-pole synchronous machines.",
            "Explain direct-axis and quadrature-axis reactances and why $X_d$ is usually greater than $X_q$.",
            "Derive the qualitative power-angle equation of a salient-pole synchronous generator.",
            "Explain the slip test for determining $X_d$ and $X_q$.",
        ],
        "diagrams": ["salient_pole_generator", "salient_pole_phasor"],
    },
    {
        "module": "Hunting, stability, and exam comparisons",
        "questions": [
            "Explain hunting in synchronous machines, its causes, effects, and remedies.",
            "Compare induction motors and synchronous motors for industrial drives.",
            "Compare cylindrical-rotor and salient-pole alternators in construction and applications.",
            "Explain how damper windings improve starting and suppress hunting in synchronous machines.",
        ],
        "diagrams": ["synchronous_machine_construction", "synchronous_v_curve", "salient_pole_generator"],
    },
]


FALLBACK_SECTIONS: dict[str, dict[str, Any]] = {
    "Synchronization and parallel operation": {
        "module": "Synchronization and parallel operation",
        "items": [
            {
                "question": "State and explain the conditions required for synchronizing an alternator to busbars.",
                "tags": ["synchronization", "alternators", "parallel operation"],
                "answer_md": """Before an incoming alternator is connected to live busbars, its generated voltage must match the busbar voltage in all important respects. Otherwise, a large circulating current and mechanical shock can occur at the instant of closing.

The required conditions are:

- **Equal voltage magnitude:** The rms terminal voltage of the incoming alternator must be equal to the busbar voltage. This is adjusted by changing field excitation.
- **Same frequency:** The incoming frequency must equal the busbar frequency. This is adjusted by controlling the prime-mover speed.
- **Same phase sequence:** The order of phases must be identical, such as R-Y-B. If phase sequence is wrong, the lamps or synchroscope pattern will not settle correctly and closing would short unlike phases.
- **Zero phase angle at closing:** Corresponding phase voltages must be in phase at the instant the breaker is closed.
- **Similar waveform:** In practice, alternators should have nearly sinusoidal voltages to avoid harmonic circulating currents.

The synchronizing idea can be stated as:

$$
\\begin{aligned}
V_{\\text{incoming}} &= V_{\\text{bus}},\\\\
f_{\\text{incoming}} &= f_{\\text{bus}},\\\\
\\text{phase sequence}_{\\text{incoming}} &= \\text{phase sequence}_{\\text{bus}},\\\\
\\delta &= 0^\\circ \\quad \\text{at closing}.
\\end{aligned}
$$

If the incoming machine is slightly fast, the phase angle slowly advances; if it is slightly slow, the phase angle falls back. The breaker is closed when the instruments indicate phase coincidence.

> **Final takeaway:** Synchronization means matching voltage, frequency, phase sequence, and instantaneous phase angle before connecting the alternator to live busbars.""",
            },
            {
                "question": "Explain the two-bright one-dark lamp method of synchronizing alternators.",
                "tags": ["lamp method", "synchronizing", "phase sequence"],
                "answer_md": """In the two-bright one-dark lamp method, three lamps are connected between the incoming alternator terminals and the busbar terminals in a cross-connected pattern. One lamp is connected between corresponding phases, while the other two are connected between non-corresponding phases. This arrangement gives a clear indication of both phase sequence and phase coincidence.

For correct phase sequence, the lamps brighten and darken cyclically. The rate of flicker indicates the frequency difference:

- Slow flicker means the incoming alternator frequency is nearly equal to the busbar frequency.
- Fast flicker means the speed of the prime mover must be adjusted.
- If the lamps do not follow the expected pattern, the phase sequence is wrong and any two incoming leads must be interchanged.

At the correct instant for closing, the lamp connected across corresponding phases is dark because the voltage across it is nearly zero. The other two lamps are bright because they are connected across phase-displaced voltages. This gives the name **two-bright one-dark**.

Let the corresponding phase voltage difference be:

$$
\\begin{aligned}
V_{\\text{lamp}} &= |\\mathbf{V}_{\\text{incoming}} - \\mathbf{V}_{\\text{bus}}|.
\\end{aligned}
$$

At synchronism, the corresponding phasors coincide, so $V_{\\text{lamp}} \\approx 0$ for the dark lamp.

The method is simple and inexpensive, but it is less precise than a synchroscope. It is suitable for educational and small alternator synchronization setups.

> **Final takeaway:** In the two-bright one-dark method, the breaker is closed when the corresponding-phase lamp is dark and the two cross-connected lamps are equally bright.""",
            },
            {
                "question": "Explain the use of a synchroscope and the effect of wrong phase sequence during synchronization.",
                "tags": ["synchroscope", "phase sequence", "busbars"],
                "answer_md": """A synchroscope is an instrument that shows whether an incoming alternator is running fast or slow with respect to the busbars, and it also indicates the instant of phase coincidence. It is connected between the incoming alternator voltage and the busbar voltage.

If the pointer rotates in the **fast** direction, the incoming alternator frequency is slightly higher than the busbar frequency. The prime-mover speed must be reduced slightly. If it rotates in the **slow** direction, the incoming frequency is lower and the prime-mover speed must be increased. The pointer should rotate slowly near the top or synchronizing mark; then the breaker is closed when the pointer reaches the in-phase position.

The frequency difference is represented by the relative angular speed of the phasors:

$$
\\begin{aligned}
\\omega_{\\text{rel}} &= 2\\pi\\left(f_{\\text{incoming}} - f_{\\text{bus}}\\right).
\\end{aligned}
$$

Wrong phase sequence is dangerous because corresponding terminals do not reach phase coincidence together. Even if one phase appears correct, the other two phases are displaced incorrectly. Closing under this condition causes heavy short-circuit current, severe electromagnetic torque pulsation, and possible damage to the breaker, alternator, and prime mover.

Therefore, phase sequence is checked before final synchronization using a phase-sequence indicator, lamp method, or synchroscope behavior.

> **Final takeaway:** A synchroscope guides speed adjustment and closing instant, but phase sequence must be verified separately before paralleling.""",
            },
            {
                "question": "Explain load sharing between alternators operating in parallel.",
                "tags": ["parallel operation", "load sharing", "governor", "excitation"],
                "answer_md": """When alternators operate in parallel, the total load is shared according to their mechanical input and excitation settings. Real power sharing is mainly controlled by the prime-mover governor, while reactive power sharing is mainly controlled by field excitation.

If the mechanical input to one alternator is increased, its rotor tends to advance slightly in phase. This increases its power angle $\\delta$, so it supplies a larger share of active power. For a cylindrical-rotor approximation:

$$
\\begin{aligned}
P &\\propto \\frac{EV}{X_s}\\sin\\delta.
\\end{aligned}
$$

Thus, increasing prime-mover torque increases $P$ without necessarily changing terminal voltage much, because the alternator is tied to common busbars.

Reactive power depends strongly on excitation:

- **Over-excited alternator:** supplies more lagging reactive power to the busbars.
- **Under-excited alternator:** absorbs reactive power or supplies less of it.
- **Equal excitation settings:** help prevent unnecessary circulating reactive current.

The busbar voltage and frequency remain common to all machines. Good parallel operation requires governor droop and voltage regulator settings that allow stable sharing instead of hunting or circulating currents.

In practice, active load is adjusted using the governor control, and reactive load is adjusted using the field rheostat or automatic voltage regulator.

> **Final takeaway:** In parallel alternators, real power is shared by changing mechanical input, while reactive power is shared by changing field excitation.""",
            },
        ],
    },
    "Hunting, stability, and exam comparisons": {
        "module": "Hunting, stability, and exam comparisons",
        "items": [
            {
                "question": "Explain hunting in synchronous machines, its causes, effects, and remedies.",
                "tags": ["hunting", "stability", "damper winding"],
                "answer_md": """Hunting is the oscillation of the rotor of a synchronous machine about its steady synchronous position. In normal operation the rotor magnetic field locks with the rotating stator field at a definite load angle $\\delta$. When the load changes suddenly, the rotor cannot instantly settle at the new angle because of inertia. It overshoots, slows, and oscillates before reaching a new steady value.

The synchronizing power tends to restore the rotor:

$$
\\begin{aligned}
P &\\approx \\frac{EV}{X_s}\\sin\\delta,\\\\
\\frac{dP}{d\\delta} &\\approx \\frac{EV}{X_s}\\cos\\delta.
\\end{aligned}
$$

The term $dP/d\\delta$ is the synchronizing stiffness. If it is high, the machine has a stronger restoring tendency. Hunting becomes serious when damping is weak or when disturbances are repeated.

Common causes are sudden load changes, faults, poor governor response, weak damping, and pulsating mechanical torque. Effects include mechanical stress, voltage and current oscillations, increased losses, noise, and possible loss of synchronism.

Remedies include damper windings, proper governor tuning, fast excitation control, avoiding sudden load application, and using flywheels where mechanical pulsations are large. Damper bars behave like a squirrel-cage winding during oscillations, producing currents that oppose relative motion between rotor and stator field.

> **Final takeaway:** Hunting is rotor-angle oscillation after disturbance; damper windings and proper control provide the damping needed for stable operation.""",
            },
            {
                "question": "Compare induction motors and synchronous motors for industrial drives.",
                "tags": ["comparison", "induction motor", "synchronous motor"],
                "answer_md": """Induction motors and synchronous motors are both AC machines, but their operating behavior is different.

An induction motor runs below synchronous speed because torque is produced only when there is slip between the rotating magnetic field and the rotor. It is self-starting in three-phase form, rugged, inexpensive, and widely used for general industrial drives. Its speed falls slightly with load, and its power factor is usually lagging because it requires magnetizing current from the supply.

A synchronous motor runs exactly at synchronous speed:

$$
\\begin{aligned}
N_s &= \\frac{120f}{P}.
\\end{aligned}
$$

It is not inherently self-starting, so it needs damper winding, pony motor, variable-frequency drive, or another starting arrangement. Once synchronized, it maintains constant speed from no load to rated load. By changing field excitation, its power factor can be made lagging, unity, or leading.

Main comparison:

- **Starting:** induction motor is simpler; synchronous motor needs special starting.
- **Speed:** induction motor has slip; synchronous motor has constant speed.
- **Power factor:** induction motor is normally lagging; synchronous motor can correct power factor.
- **Cost and maintenance:** induction motor is cheaper and more rugged; synchronous motor is costlier due to excitation system.
- **Use:** induction motor suits pumps, fans, compressors, and general drives; synchronous motor suits constant-speed high-power drives and power-factor correction.

> **Final takeaway:** Induction motors are preferred for rugged general drives, while synchronous motors are chosen when constant speed or controllable power factor is important.""",
            },
            {
                "question": "Compare cylindrical-rotor and salient-pole alternators in construction and applications.",
                "tags": ["cylindrical rotor", "salient pole", "alternator"],
                "answer_md": """Cylindrical-rotor and salient-pole alternators differ mainly in rotor shape, operating speed, number of poles, and application.

A cylindrical rotor is smooth, solid, and has field windings placed in slots. It has a small diameter and large axial length, which makes it mechanically strong at high speed. It is used in turbo-alternators driven by steam or gas turbines. These machines usually have two or four poles and operate at high speeds.

A salient-pole rotor has projecting poles with concentrated field windings. It has a large diameter and short axial length. This construction is suitable for low and medium speeds, especially for hydro-generators and diesel-engine-driven alternators. Because the rotor has projecting poles, the air gap is non-uniform.

The reactance behavior is also different:

$$
\\begin{aligned}
X_d &\\neq X_q \\quad \\text{for salient-pole machines},\\\\
X_d &\\approx X_q \\quad \\text{for cylindrical-rotor machines}.
\\end{aligned}
$$

In a salient-pole machine, the direct-axis reluctance is lower than the quadrature-axis reluctance, so $X_d$ is usually greater than $X_q$. This makes two-reaction theory necessary. In a cylindrical-rotor machine, the air gap is nearly uniform, so a single synchronous reactance is usually sufficient.

![Synchronous machine construction](https://www.electricaltechnology.org/wp-content/uploads/2022/08/Construction-of-Synchronous-Motor-1024x513.png)
*Figure: Cutaway view comparing salient-pole and cylindrical-pole synchronous machine construction. Source: [ElectricalTechnology](https://www.electricaltechnology.org/2022/09/synchronous-motor.html).*

> **Final takeaway:** Cylindrical rotors are used for high-speed turbo-alternators, while salient-pole rotors are used for low-speed hydro and engine-driven alternators.""",
            },
            {
                "question": "Explain how damper windings improve starting and suppress hunting in synchronous machines.",
                "tags": ["damper winding", "starting", "hunting"],
                "answer_md": """Damper windings are copper or aluminium bars embedded in the pole faces of a synchronous machine and short-circuited at both ends by end rings. Their action is similar to the squirrel-cage rotor of an induction motor whenever there is relative motion between rotor and rotating stator field.

During starting of a synchronous motor, the rotor is not yet locked with the stator field. The rotating stator flux cuts the damper bars and induces currents in them. These currents produce induction-motor torque, accelerating the rotor close to synchronous speed. Then DC field excitation is applied and the rotor pulls into synchronism.

During hunting, the rotor oscillates about its steady load angle. This oscillation creates relative speed between the rotor pole face and the stator rotating field. The damper bars again have induced currents, and by Lenz's law these currents oppose the relative motion. Therefore, they produce damping torque.

The damping action can be described qualitatively as:

$$
\\begin{aligned}
T_{\\text{damper}} &\\propto -\\omega_{\\text{relative}}.
\\end{aligned}
$$

The negative sign means the torque opposes the oscillation. This reduces rotor-angle swings and helps the machine settle quickly after disturbances.

Damper windings also reduce voltage waveform distortion and improve stability under sudden load changes. However, they are not a substitute for proper excitation and governor control.

> **Final takeaway:** Damper windings provide induction-motor starting torque and damping torque during hunting, improving both starting and dynamic stability.""",
            },
        ],
    },
}


SYSTEM_PROMPT = """You are an Electrical Machines II examiner writing a theory-only question bank for a Docusaurus notes site.

Return only valid JSON. No Markdown fences.

Requirements:
- Every answer must be theory/explanation only. Do not create numerical examples or solved numerical calculations.
- Write exam-ready explanations: clear definitions, physical reasoning, key formulas, steps/points, and a final takeaway.
- Target 250-450 words per answer.
- Use display KaTeX only in:
  $$
  \\begin{aligned}
  ...
  \\end{aligned}
  $$
- Inline math must use $...$.
- Do not use \\(...\\), \\[...\\], raw HTML, tables, unsupported macros, or placeholders.
- Escape percent signs in math as \\%.
- Use at most one provided diagram per answer, only when genuinely helpful.
- If using a diagram, use exactly:
  ![short alt text](DIRECT_IMAGE_URL)
  *Figure: concise caption. Source: [SOURCE](SOURCE_PAGE_URL).*
"""


def diagrams_for(theme: dict[str, Any], manifest: list[dict[str, Any]]) -> list[dict[str, str]]:
    by_id = {item["id"]: item for item in manifest}
    result = []
    for diagram_id in theme.get("diagrams", []):
        item = by_id.get(diagram_id)
        if item:
            result.append(
                {
                    "id": item["id"],
                    "title": item["title"],
                    "url": item["url"],
                    "source": item["source"],
                    "source_page": item["source_page"],
                    "caption": item["caption"],
                }
            )
    return result


def call_deepseek(theme: dict[str, Any], manifest: list[dict[str, Any]]) -> dict[str, Any]:
    if not API_KEY:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    CACHE.mkdir(exist_ok=True)
    cache_path = CACHE / (re.sub(r"[^A-Za-z0-9_.-]+", "_", theme["module"]).strip("_") + ".json")
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))
    prompt = {
        "task": "Write this EM-II theory-only section.",
        "module": theme["module"],
        "questions": theme["questions"],
        "web_diagrams": diagrams_for(theme, manifest),
        "schema": {
            "module": "module name",
            "items": [
                {
                    "question": "question text",
                    "answer_md": "Markdown answer body only, no heading",
                    "tags": ["short topic tags"],
                }
            ],
        },
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)},
        ],
        "temperature": 0.12,
        "max_tokens": 18000,
        "response_format": {"type": "json_object"},
        "thinking": {"type": "enabled"},
        "reasoning_effort": "max",
    }
    req = urllib.request.Request(
        f"{BASE_URL}/v1/chat/completions",
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=600) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            content = str(data["choices"][0]["message"].get("content") or "").strip()
            if content.startswith("```"):
                content = re.sub(r"^```(?:json)?\s*", "", content)
                content = re.sub(r"\s*```$", "", content)
            parsed = json.loads(content)
            cache_path.write_text(json.dumps(parsed, ensure_ascii=False, indent=2), encoding="utf-8")
            return parsed
        except urllib.error.HTTPError as exc:
            last_error = RuntimeError(f"HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')[:500]}")
            time.sleep(20 * (attempt + 1))
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(f"DeepSeek failed for {theme['module']}: {last_error}")


def normalize_md(text: str) -> str:
    replacements = {
        "\u00a0": " ",
        "\u202f": " ",
        "\u2011": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
        "\u2026": "...",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r"\\\((.*?)\\\)", lambda m: "$" + m.group(1).strip() + "$", text, flags=re.S)
    text = re.sub(r"\\\[\s*(.*?)\s*\\\]", lambda m: "\n$$\n" + m.group(1).strip() + "\n$$\n", text, flags=re.S)
    text = re.sub(r"\\\\\[[^\]]+\]", r"\\\\", text)
    parts = text.split("$$")
    for i in range(1, len(parts), 2):
        parts[i] = re.sub(r"(?<!\\)%", r"\\%", parts[i])
    text = re.sub(r"\n{3,}", "\n\n", "$$".join(parts)).strip()
    return "\n".join(line.rstrip() for line in text.splitlines())


def validate_answer(answer: str, allowed_images: set[str]) -> list[str]:
    errors: list[str] = []
    if re.search(r"(?<!\\)\\[()]", answer) or re.search(r"(?<!\\)\\\[", answer) or re.search(r"(?<!\\)\\\]", answer):
        errors.append("unsupported math delimiters")
    if answer.count("$$") % 2:
        errors.append("unbalanced display math")
    if re.search(r"<(?:img|figure|table|div|span)", answer, flags=re.I):
        errors.append("raw HTML")
    if re.search(r"\b(find the numerical|substitute the given values|given numerical data)\b", answer, flags=re.I):
        errors.append("numerical-solution wording")
    if "> **Final takeaway:**" not in answer:
        errors.append("missing final takeaway")
    for image in re.findall(r"!\[[^\]]*]\(([^)]+)\)", answer):
        if image not in allowed_images:
            errors.append(f"unknown image {image}")
    return errors


def ensure_final_takeaway(answer: str, question: str) -> str:
    if "> **Final takeaway:**" in answer:
        return answer
    return (
        answer.rstrip()
        + "\n\n"
        + "> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order."
    )


def build_document(results: list[dict[str, Any]], manifest: list[dict[str, Any]]) -> str:
    allowed_images = {item["url"] for item in manifest}
    lines: list[str] = [
        "---",
        "title: EM-II Theory Question Bank",
        "description: Theory-only Electrical Machines II questions with exam-ready explanations, formulas, phasor diagrams, and circuit diagrams.",
        "---",
        "",
        "# Electrical Machines II Theory Question Bank",
        "",
        "This bank contains only theory and explanation questions. Numerical problem-solving questions are intentionally excluded.",
        "",
        f"**Total theory questions:** {sum(len(r.get('items', [])) for r in results)}",
        "",
        "---",
        "",
    ]
    qno = 1
    errors: list[str] = []
    for result in results:
        module = str(result.get("module") or "Theory")
        lines.extend([f"## {module}", ""])
        for item in result.get("items", []):
            question = str(item.get("question") or "").strip()
            answer = ensure_final_takeaway(normalize_md(str(item.get("answer_md") or "")), question)
            item_errors = validate_answer(answer, allowed_images)
            if item_errors:
                errors.append(f"Q{qno}: {question}: {', '.join(item_errors)}")
            tags = ", ".join(str(t) for t in item.get("tags", [])[:5])
            lines.extend(
                [
                    f"### Theory Question {qno}",
                    "",
                    f"**Question:** {question}",
                    "",
                    f"**Tags:** {tags}" if tags else "**Tags:** Theory",
                    "",
                    answer,
                    "",
                    "---",
                    "",
                ]
            )
            qno += 1
    if errors:
        raise RuntimeError("Generated invalid answers:\n" + "\n".join(errors[:40]))
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    results: list[dict[str, Any] | None] = [None] * len(THEMES)
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {executor.submit(call_deepseek, theme, manifest): idx for idx, theme in enumerate(THEMES)}
        for future in as_completed(futures):
            idx = futures[future]
            theme = THEMES[idx]
            try:
                results[idx] = future.result()
                print(f"[OK] {theme['module']}", flush=True)
            except Exception as exc:  # noqa: BLE001
                fallback = FALLBACK_SECTIONS.get(theme["module"])
                if not fallback:
                    raise
                results[idx] = fallback
                print(f"[FALLBACK] {theme['module']}: {exc}", flush=True)
    final_results = [r for r in results if r is not None]
    OUT.write_text(build_document(final_results, manifest), encoding="utf-8")
    print(f"[DONE] wrote {OUT}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
