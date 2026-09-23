---
title: "CT Burden, Sensitivity, and Insulator String Calculation"
math_syntax: typst
---

# CT Burden, Sensitivity, and Insulator String Calculation

[Week 1 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Week 1 – CT Burden, Sensitivity, and Insulator String Calculation

## Core Concepts: CT Burden and Relay Sensitivity

In protection systems, the **Current Transformer (CT)** steps down high primary currents to a standard secondary value (typically 1A or 5A) for relays and meters. The **burden** is the total impedance load on the CT secondary circuit. It is not just the relay, but the entire loop.

*   **Burden (Z_b):** The total impedance (in ohms) of the relay, connecting wires, and any other devices in the secondary circuit.
*   **VA Burden:** The apparent power the CT must supply, calculated as $I_("sec")^2 times |Z_b|$. The CT's VA rating must exceed this value at its rated accuracy class to avoid saturation.
*   **Relay Sensitivity:** This is a *minimum* requirement. It is defined as the **minimum apparent power (in VA)** required to operate the relay. A relay with a 1 VA sensitivity is more sensitive (better) than one requiring 3 VA.

**Key Distinction:** The CT's VA rating is a *maximum* capacity it can deliver. The relay's sensitivity is a *minimum* input it needs. The CT must be able to supply the total burden while providing enough power to operate the relay at the lowest fault current.

## Insulator String Calculation for Overhead Lines

Suspension insulator strings protect the conductor from the grounded tower. The number of discs is determined by the phase-to-ground voltage, the voltage rating per disc, and a safety factor.

**Formula:**
$$
N = frac(V_P, V_r) times S_f
$$
Where:
*   $N$ = Number of discs (always round **UP** to the next whole number).
*   $V_P$ = Phase-to-ground voltage = $V_L / sqrt(3)$ (in kV).
*   $V_r$ = Voltage rating per insulator disc (typically 11 kV).
*   $S_f$ = Safety factor (e.g., 1.5).

**Recognition Cue:** The problem will give a line voltage ($V_L$) and ask for the number of discs for a suspension insulator string. Always convert to phase voltage first.

## Worked Example 1: Insulator Disc Calculation

**Question (T1-W1-Q02):** Find the number of 11 kV suspension insulator discs required for a three phase 220 kV power transmission line, with a safety factor of 1.5?

**Solution:**
1.  **Calculate Phase Voltage ($V_P$):**
    $$
    V_P = frac(V_L, sqrt(3)) = frac(220, sqrt(3)) approx 127.02 " kV"
    $$
2.  **Apply Formula:**
    $$
    N = frac(127.02, 11) times 1.5 = 11.547 times 1.5 = 17.32
    $$
3.  **Round Up:** Disc counts must be integers. Round 17.32 **UP** to **18**.

**Exam Answer:** 18 (Option B)
**Trap Avoided:** Using line voltage directly ($220/11 times 1.5 = 30$) would give an incorrect, oversized string.

## Worked Example 2: CT Burden Concept

**Question (T1-W1-Q07):** The VA rating of a current transformer (CT) is determined by considering
A) total burden connected to the CT secondary circuit.
B) resistance of the relay only.
C) reactance of the relay only.
D) secondary current rating only.

**Solution:** The VA rating must account for the **total burden**—the combined impedance of the relay, wiring, and any other devices in the secondary loop. Options B and C are incomplete components of this total. Option D is a separate parameter.

**Exam Answer:** A) total burden connected to the CT secondary circuit.

## Common Traps and Comparisons

*   **Insulator Calculation:** Always use **phase voltage** ($V_L/sqrt(3)$), not line voltage. Always apply the **safety factor** and **round UP** the final disc count.
*   **CT vs. Relay:** Do not confuse the CT's **VA rating** (maximum output) with the relay's **sensitivity** (minimum input). The CT must satisfy both the total burden and the relay's sensitivity requirement.
*   **Burden Definition:** Burden is the **total VA load** on the CT secondary, not just the relay's impedance. It includes all wiring and devices.


## Assignment questions using this method

- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q02)
- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q07)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q05)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-01/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
