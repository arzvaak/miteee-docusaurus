---
title: "Symmetrical Components and Fault Current Calculation"
math_syntax: typst
---

# Symmetrical Components and Fault Current Calculation

[Week 3 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Symmetrical Components and Fault Current Calculation

## Core Concept: Decomposing Unbalanced Systems

Symmetrical components transform an unbalanced three-phase system (like fault currents) into three balanced systems. This simplifies analysis because balanced systems are easier to calculate. The three components are:

*   **Positive Sequence ($I_1$):** Balanced, same phase sequence as the original system. This is the component present during normal, balanced operation.
*   **Negative Sequence ($I_2$):** Balanced, opposite phase sequence. This appears only during unbalanced faults.
*   **Zero Sequence ($I_0$):** Three phasors in phase with each other. This component flows only when there is a ground path.

The transformation uses the complex operator $a = 1 angle 120 degree$ (which rotates a phasor by +120°). The key formulas are:

$$
I_1 = frac(1,3)(I_a + a I_b + a^2 I_c)
$$
$$
I_2 = frac(1, 3)(I_a + a^2 I_b + a I_c)
$$
$$
I_0 = frac(1,3)(I_a + I_b + I_c)
$$

**Recognition Cue:** When given three unbalanced phase currents and asked for a "sequence component," you are applying these transformation equations. The problem is a direct calculation, not a conceptual trick.

## Worked Example: Calculating Positive Sequence Current

**Source:** Type1 Assignment W3, Question T1-W3-Q02

**Problem:** A 3-phase, 11 kV power system has the following phase currents during an unsymmetrical fault: $I_a = 100 angle 0 degree$ A, $I_b = 50 angle (-120) degree$ A, $I_c = 30 angle 120 degree$ A. The positive sequence current component is:
(a) 20 A
(b) 60 A
(c) 80 A
(d) 180 A

**Exam Answer:** (b) 60 A

**Solution:**
Apply the formula for positive sequence current $I_1$:
$$
I_1 = frac(1,3)(I_a + a I_b + a^2 I_c)
$$

Substitute the given values and the operator $a = 1 angle 120 degree$:
$$
I_1 = frac(1,3)(100 angle 0 degree + (1 angle 120 degree)(50 angle -120 degree) + (1 angle 240 degree)(30 angle 120 degree))
$$

Calculate each term:
*   $I_a = 100 angle (0 degree) = 100$
*   $a I_b = (1 angle 120 degree)(50 angle -120 degree) = 50 angle (120 degree - 120 degree) = 50 angle 0 degree = 50$
*   $a^2 I_c = (1 angle 240 degree)(30 angle 120 degree) = 30 angle (240 degree + 120 degree) = 30 angle 360 degree = 30 angle 0 degree = 30$

Sum the terms and divide by 3:
$$
I_1 = frac(1,3)(100 + 50 + 30) = frac(180,3) = 60 thin "A"
$$

**Trap & Comparison:** The most common error is simply summing the magnitudes ($100 + 50 + 30 = 180$) and selecting option (d). This ignores the phase shifts introduced by the operator $a$. The correct method requires multiplying each phasor by the appropriate operator *before* summing.

## Application in Protection Settings

Symmetrical components are not just for analysis; they directly inform relay settings.

*   **Distance Relays:** The impedance setting for a **phase distance relay** is based on the **positive sequence impedance ($Z_1$)** of the protected line. For a **ground distance relay**, the setting is based on the **zero sequence impedance ($Z_0$)**.
*   **Fault Analysis:** For any unsymmetrical fault (L-G, L-L, L-L-G), the positive sequence network is always active. The fault type determines how the negative and zero sequence networks are connected to it.


## Assignment questions using this method

- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q02)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-03/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
