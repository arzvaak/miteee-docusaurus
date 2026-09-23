---
title: "Quantities to be Fed to Distance Relays for Different Fault Types"
math_syntax: typst
---

# Quantities to be Fed to Distance Relays for Different Fault Types

[Week 4 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Quantities to be Fed to Distance Relays for Different Fault Types

## Core Principle: Measuring Positive-Sequence Impedance

The fundamental goal of a distance relay is to measure the positive-sequence impedance ($Z_1$) from its location to the fault point. The relay receives three-phase voltages ($V_R, V_Y, V_B$) and currents ($I_R, I_Y, I_B$) from instrument transformers. The critical question is: which specific voltage and current quantities must be fed to the relay for each fault type so that the ratio $V/I$ always equals $Z_1$?

The answer depends on the fault type. Phase distance relays handle balanced faults (three-phase, line-to-line), while ground distance relays handle unbalanced faults involving ground (single line-to-ground, double line-to-ground). The required inputs are derived from symmetrical component theory, using the fundamental sequence equations:
$$
I_R = I_1 + I_2 + I_0
$$
$$
V_R = V_1 + V_2 + V_0
$$
(and similar for phases Y and B, using the operator $alpha = 1 angle 120 degree$).

## Phase Distance Relay Inputs

### For Three-Phase Faults
A three-phase fault is symmetrical. At the fault point, all phase voltages are zero ($V_R = V_Y = V_B = 0$), implying $V_1 = V_2 = V_0 = 0$. Only positive-sequence current flows ($I_2 = I_0 = 0$). The voltage at the relay location for phase R is:
$$
V'_R = V_1 + I_1 Z_1 = I_1 Z_1
$$
Since $I_R = I_1$, the ratio $V'_R / I_R = Z_1$. Therefore, for a three-phase fault, feeding the relay with **phase voltage and phase current** (e.g., $V_R$ and $I_R$) yields the correct $Z_1$.

### For Line-to-Line Faults (e.g., YB Fault)
For a YB fault, $V_Y = V_B$ and $I_R approx 0$, $I_Y = -I_B$. Using phase quantities ($V_Y$ and $I_Y$) does not yield $Z_1$. Instead, the relay must use **line-to-line voltage and the difference in phase currents**. For a YB fault, the inputs are $V_("YB") = V_Y - V_B$ and $I_Y - I_B$.

**Derivation:** Using sequence components:
$$
V_("YB") = (alpha^2 V'_1 + alpha V'_2) - (alpha V'_1 + alpha^2 V'_2) = (alpha^2 - alpha)(V'_1 - V'_2)
$$
$$
I_Y - I_B = (alpha^2 I_1 + alpha I_2) - (alpha I_1 + alpha^2 I_2) = (alpha^2 - alpha)(I_1 - I_2)
$$
For a line-to-line fault, $V_1 = V_2$ and $I_1 = -I_2$ at the fault. Since $Z_1 = Z_2$, the ratio simplifies:
$$
frac(V_("YB"), I_Y - I_B) = frac(V'_1 - V'_2, I_1 - I_2) = frac((V_1 + I_1 Z_1) - (V_2 + I_2 Z_2), I_1 - I_2) = frac(I_1 Z_1 - I_2 Z_2, I_1 - I_2) = Z_1
$$
Thus, three phase-distance relay units (RY, YB, BR) are required.

## Ground Distance Relay Inputs

### For Single Line-to-Ground Faults (e.g., RG Fault)
For an RG fault, $V_R = 0$ at the fault, and $I_Y = I_B approx 0$. The sequence networks are in series, so $I_1 = I_2 = I_0$. The voltage at the relay is:
$$
V'_R = V'_1 + V'_2 + V'_0 = (I_1 Z_1) + (I_2 Z_2) + (I_0 Z_0) = I_1 (Z_1 + Z_2 + Z_0)
$$
Since $I_R = I_1 + I_2 + I_0 = 3I_1$, the ratio $V'_R / I_R = (Z_1 + Z_2 + Z_0)/3 != Z_1$. To correct this, a **zero-sequence compensation factor** $k$ is introduced, where $k = (Z_0 - Z_1)/Z_1$. The relay is fed with phase voltage $V_R$ and a compensated current $I'_R = I_R + k I_0$.

**Derivation:**
$$
I'_R = 3I_1 + (frac(Z_0 - Z_1, Z_1)) I_1 = I_1 (3 + frac(Z_0 - Z_1, Z_1)) = I_1 (frac(2Z_1 + Z_0, Z_1))
$$
$$
frac(V'_R, I'_R) = frac(I_1 (Z_1 + Z_2 + Z_0), I_1 (frac(2 Z_1 + Z_0, Z_1))) = frac(Z_1 + Z_1 + Z_0, frac(2 Z_1 + Z_0, Z_1)) = Z_1
$$
Therefore, three ground-distance relay units (RG, YG, BG) are needed, each using its phase voltage and compensated current.

## Worked Example from Lecture Material

**Example-1 (from Lecture 16):** A 220 kV line has impedance $Z_("line") = 2.5 + j 6 Omega$. It is protected by a distance relay R with CT ratio 1000/1 and PT ratio 220 kV / 110 V. The relay is set to operate in its first zone, covering 80% of the line section. Draw the characteristics of (i) reactance, (ii) ohm, and (iii) Mho relays on the R-X plane.

**Solution:** The primary line impedance is $Z_("line") = 2.5 + j 6 Omega$. The secondary impedance seen by the relay is:
$$
Z_("sec") = Z_("line") times frac(C T_("ratio"), P T_("ratio")) = (2.5 + j 6) times frac(1000/1, 220000/110) = (2.5 + j 6) times frac(1000, 2000) = (2.5 + j 6) times 0.5 = 1.25 + j 3 Omega
$$
The Zone 1 reach is 80% of this: $Z_("set") = 0.8 times (1.25 + j 3) = 1.0 + j 2.4 Omega$.
*   **Reactance Relay:** A horizontal line at $X = 2.4 thin Omega$.
*   **Ohm (Angle Impedance) Relay:** A straight line through the origin at the characteristic angle $theta = tan^(-1)(6/2.5) = 67.38 degree$, extending to $abs(Z) = sqrt(1.25^2 + 3^2) = 3.25 Omega$ (80% of total).
*   **Mho Relay:** A circle passing through the origin, with diameter $Z_("set") = 1.0 + j 2.4 Omega$ along the line angle.

## Impact of Fault Resistance on Reach

Fault resistance ($R_F$) adds a real component to the measured impedance. For a phase relay, this causes **underreach** (fault appears farther). For a ground relay, the effect is more complex due to infeed from the remote end. The measured impedance becomes:
$$
Z_("measured") = Z_1 + 3 R_F frac(I_F, I_A)
$$
The term $3R_F (I_F/I_A)$ is a complex quantity. If pre-fault power flows from A to B, the imaginary part can be negative, causing **overreach** (fault appears closer). If power flows from B to A, the imaginary part is positive, causing **underreach**. This is a key limitation of distance relays.


## Assignment questions using this method


## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-04/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
