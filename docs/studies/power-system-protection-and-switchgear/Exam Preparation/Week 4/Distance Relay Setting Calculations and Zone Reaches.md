---
title: "Distance Relay Setting Calculations and Zone Reaches"
math_syntax: typst
---

# Distance Relay Setting Calculations and Zone Reaches

[Week 4 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Distance Relay Setting Calculations and Zone Reaches

## Core Concepts and Formulas

Distance relay settings translate primary system impedances into secondary relay settings using instrument transformer ratios. The fundamental transformation is:

$$
Z_("secondary") = Z_("primary") times frac("CT ratio", "PT ratio")
$$

For Mho relays, the setting constant $K_x$ relates to the zone impedance by:

$$
K_x = frac(|Z_x("sec")|, cos(theta - phi))
$$

where:
- $theta$ is the relay characteristic angle (given in the problem).
- $phi$ is the angle of the measured impedance ($phi = tan^(-1)(X_("sec") / R_("sec"))$).
- $abs(Z_x ("sec"))$ is the magnitude of the secondary impedance for zone $x$.

**Key Recognition Cues:**
- When given CT/PT ratios, always convert between primary and secondary values.
- For Mho relays, the $K$ setting is not the impedance magnitude but involves the cosine term.
- Reactance relays measure only the imaginary component ($X$) of impedance.
- Fault resistance ($R_F$) adds to the real part of the measured impedance *before* conversion to secondary values.

## Worked Example 1: Mho Relay Setting with Fault Resistance

**Question T1-W4-Q07:** A 132 kV long transmission line has an impedance of $(2 + j 8) Omega$. The line is protected by MHO type of distance relay with a characteristics angle of $74 degree$ and its first zone covers 80% of the line length. The CT ratio and PT ratio are 500/1 A and 132 kV/110 V, respectively. Considering a fault resistance of $2.4 Omega$, determine the first zone setting of the distance relay.

**Solution:**

**Step 1:** Calculate primary zone impedance including fault resistance.
$$
Z_1 ("prim") = 0.8 times (2 + j 8) + 2.4 = (1.6 + j 6.4) + 2.4 = 4.0 + j 6.4 Omega
$$

**Step 2:** Convert to secondary impedance.
$$
Z_1("sec") = Z_1("prim") times frac("CT ratio", "PT ratio") = (4.0 + j 6.4) times frac(500/1, 132 "kV"/110 "V")
$$
$$
= (4.0 + j 6.4) times frac(500 times 110, 132000) = (4.0 + j 6.4) times 0.41667 = 1.6667 + j 2.6667 Omega
$$

**Step 3:** Calculate magnitude and angle of $Z_1 ("sec")$.
$$
abs(Z_1 ("sec")) = sqrt(1.6667^2 + 2.6667^2) = sqrt(2.7778 + 7.1111) = sqrt(9.8889) = 3.145 Omega
$$
$$
phi = tan^(-1)(frac(2.6667, 1.6667)) = tan^(-1)(1.6) = 57.99 degree
$$

**Step 4:** Calculate $K_1$ using the Mho setting formula.
$$
K_1 = frac(|Z_1("sec")|, cos(theta - phi)) = frac(3.145, cos(74 degree - 57.99 degree)) = frac(3.145, cos(16.01 degree)) = frac(3.145, 0.9613) = 3.27 Omega
$$

**Exam answer:** $K_1 = 3.27 Omega$ (Option C)

**Common Pitfall:** Forgetting to add $R_F$ before conversion or miscalculating the angle difference $(theta - phi)$.

## Worked Example 2: Reactance Relay Setting

**Question T2-W4-Q01:** A 220 kV transmission line with an impedance of $1.5 + j 7.5 Omega$ is protected by a reactance relay. Determine the reach of the reactance relay for the first zone. The CT ratio and PT ratio are 500/1 A and 220 kV/110 V, respectively. The first zone covers 80% of the line section.

**Solution:**

A reactance relay measures only the reactance component ($X$) of the impedance.

**Step 1:** Calculate primary reactance for zone 1.
$$
X_1 ("prim") = 0.8 times 7.5 Omega = 6.0 Omega
$$

**Step 2:** Convert to secondary reactance using the CT/PT ratio.
$$
X_1 ("sec") = X_1 ("prim") times frac("CT ratio", "PT ratio") = 6.0 times frac(500/1, 220 "kV" / 110 "V")
$$
$$
= 6.0 times frac(500 times 110, 220000) = 6.0 times 0.25 = 1.5 Omega
$$

**Exam answer:** $X_1 = 1.5 Omega$ (Option A)

**Key Insight:** For reactance relays, only the imaginary part of the impedance matters. The setting is independent of the resistive component.

## Worked Example 3: Mho Relay Setting with Fault Resistance (Additional)

**Question T2-W4-Q03:** A 220 kV long transmission line has an impedance of $2 + j 4 Omega$. This line is protected by MHO type of distance relay with a characteristics angle of $60 degree$ and its first zone covers 90% of the line length. The CT ratio and PT ratio are 1000/1 A and 220 kV/110 V, respectively. Considering a fault resistance of $2 Omega$, the first zone setting of the distance relay is:

**Solution:**

**Step 1:** Calculate primary zone impedance including fault resistance.
$$
Z_1 ("prim") = 0.9 times (2 + j 4) + 2 = (1.8 + j 3.6) + 2 = 3.8 + j 3.6 Omega
$$

**Step 2:** Convert to secondary impedance.
$$
Z_1("sec") = Z_1("prim") times frac("CT ratio", "PT ratio") = (3.8 + j 3.6) times frac(1000/1, 220 "kV"/110 "V")
$$
$$
= (3.8 + j 3.6) times frac(1000 times 110, 220000) = (3.8 + j 3.6) times 0.5 = 1.9 + j 1.8 Omega
$$

**Step 3:** Calculate magnitude and angle.
$$
abs(Z_1 ("sec")) = sqrt(1.9^2 + 1.8^2) = sqrt(3.61 + 3.24) = sqrt(6.85) = 2.617 Omega
$$
$$
phi = tan^(-1)(frac(1.8, 1.9)) = tan^(-1)(0.9474) = 43.45 degree
$$

**Step 4:** Calculate $K_1$.
$$
K_1 = frac(|Z_1("sec")|, cos(theta - phi)) = frac(2.617, cos(60 degree - 43.45 degree)) = frac(2.617, cos(16.55 degree)) = frac(2.617, 0.959) = 2.728 Omega approx 2.72 Omega
$$

**Exam answer:** $K_1 = 2.72 Omega$ (Option D)

## Zone Reach Calculations in Kilometers

From Lecture 17 (Example-2), zone reach in km is calculated by:
1. Finding the primary impedance reach from the $K$ setting: $Z_x("prim") = K_x times cos(theta - phi) times frac("PT ratio", "CT ratio")$
2. Dividing by the line's impedance per km: $"Reach (km)" = frac(|Z_x("prim")|, |Z_("line per km")|)$

**Important:** When multiple lines emanate from a bus, zone 3 reach for backup protection should consider the longest adjacent line.

## Impact of Fault Resistance

Fault resistance affects distance relay performance differently based on relay characteristic:
- **Reactance relays:** Immune to $R_F$ (measures only $X$).
- **Impedance relays:** Significant underreach due to $R_F$.
- **Mho relays:** Moderate underreach, better than impedance characteristic.
- **Quadrilateral relays:** Best performance with $R_F$.

The measured impedance with fault resistance becomes:
$$
Z_("measured") = Z_("AF") + R_F + R_F times frac(I_B, I_A)
$$

Pre-fault power flow direction affects whether the relay overreaches or underreaches.


## Source Sections
- Lecture 16: Quantities to be fed to Distance Relays
- Lecture 17: Distance Relay Setting Calculations (Example-1 and Example-2)
- Lecture 18: Effect of Fault Resistance on Distance Relay Performance
- Type1 Assignment Week 4, Question 7
- Type2 Assignment Week 4, Questions 1 and 3


## Assignment questions using this method

- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q07)
- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q01)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q03)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-04/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
