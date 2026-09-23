---
title: "Distance Relay Fundamentals and Characteristics"
math_syntax: typst
---

# Distance Relay Fundamentals and Characteristics

[Week 3 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Distance Relay Fundamentals and Characteristics

## Core Principle: Impedance Measurement
A distance relay operates by measuring the impedance ($Z = V/I$) from its location to a fault point. This measured impedance is compared to a pre-set value ($Z_("set")$). If $Z_("meas") < Z_("set")$, the relay operates. This method is inherently selective because line impedance is proportional to distance, making it ideal for protecting transmission lines where fault current magnitude can vary significantly.

## Why Distance Protection for HV/EHV Lines?
Distance protection is preferred over graded time-lag overcurrent protection for HV and EHV lines primarily for its **speed**. Zone 1 provides instantaneous operation for approximately 80% of the line length, which is critical for maintaining system stability. Overcurrent relays require time grading, leading to slower fault clearance. While distance relays are more complex and costly, their speed and selectivity advantages are paramount. (Source: T1-W3-Q01)

## The R-X Diagram and Relay Characteristics
The relay's operation is visualized on an R-X (Resistance-Reactance) plane. The line impedance is a vector $Z_L = R_L + j X_L$ at angle $phi_L = tan^(-1)(X_L / R_L)$. The relay characteristic defines the operating region.

*   **Impedance Relay:** Circular characteristic centered at the origin. **Not inherently directional**; requires a separate directional unit to prevent operation for reverse faults. Sensitive to fault resistance.
*   **Reactance Relay:** Characteristic is a horizontal line on the R-X plane ($X = X_("set")$). Measures only reactance, making it **immune to fault resistance**. Used for short lines but prone to maloperation during power swings.
*   **Mho (Admittance) Relay:** Circular characteristic passing through the origin. **Inherently directional** and less affected by power swings. The characteristic angle $theta$ (Maximum Torque Angle) is set to match the line angle $phi_L$. Widely used for long EHV/UHV lines. (Source: T2-W3-Q10)
*   **Quadrilateral Relay:** Four-sided characteristic. Offers excellent discrimination against load and can accommodate significant fault resistance. Common in modern digital relays. (Source: T2-W3-Q09)

## Stepped Distance Characteristic and Backup
A typical distance relay has three zones to provide primary and backup protection:
*   **Zone 1:** Instantaneous, set to ~80% of the protected line ($Z_1 = 0.8 Z_L$). Avoids overreaching into the next line.
*   **Zone 2:** Time-delayed (0.3-0.6 s), set to cover 100% of the line + ~50% of the shortest adjoining line ($Z_2 = 1.2 Z_L$ to $1.5 Z_L$).
*   **Zone 3:** Time-delayed (1.2-1.5 s), set as remote backup for the next line ($Z_3 = Z_("L1") + 1.2 Z_("L2")$). Must be set carefully to avoid load encroachment.

The purpose of backup protection, provided by Zones 2 and 3, is to operate after a time delay if the primary protection fails to clear a fault. (Source: T1-W3-Q03)

## Reach Conversion and Transient Phenomena
The relay sees impedance on the secondary side of CTs/PTs. The conversion is:
$$
Z_("sec") = Z_("pri") times frac(C T_("ratio"), P T_("ratio"))
$$
where $"CT"_("ratio") = I_("pri")/I_("sec")$ and $"PT"_("ratio") = V_("pri")/V_("sec")$.

**Transient Overreach:** The decaying DC component in fault current can cause Zone 1 to overreach. This phenomenon is most severe in the first few cycles, affecting only the instantaneous Zone 1. Digital relays use filtering algorithms to minimize this effect. (Source: T1-W3-Q04, T1-W3-Q09)

**Underreach:** Can be caused by fault resistance, infeed from remote ends, or CT/PT errors. Current infeed from a remote source makes the measured impedance appear larger, causing the relay to underreach. (Source: T1-W3-Q07)

**Load Encroachment:** Heavy load can push the load impedance into Zone 3, causing a maloperation. (Source: T2-W3-Q08)

## Worked Example: Reactance Relay Setting (T1-W3-Q05)
**Problem:** A short transmission line having an impedance of (2+j5) Ω is protected by a reactance relay. The CT ratio is 500/1 A and PT ratio is 132 kV/110 V. If the relay is adjusted to just operate for a dead short-circuit at the end of line section, then the set value of relay is?
**Solution:** A reactance relay measures only the reactance (X) component. The line reactance is $X_("line") = 5 Omega$.
The relay setting is the secondary-side reactance:
$$
X_("relay") = X_("line") times frac("CT"_("ratio"), "PT"_("ratio"))
$$
$"CT"_("ratio") = 500/1 = 500$
$"PT"_("ratio") = (132,000 " V") / (110 " V") = 1200$
$$
X_("relay") = 5 times frac(500, 1200) = 5 times 0.4167 = 2.083 Omega
$$
**Exam Answer:** 2.083 (Option b)

## Worked Example: Zone Setting Calculation (T1-W3-Q10)
**Problem:** A 132 kV transmission line has an impedance of (4 + j16) Ω. This line is protected by a reactance type distance relay with CT ratio = 1000/1 A and PT ratio = 132 kV/110 V. The zone-1 of the reactance relay covers 80% of the line length, zone-2 covers 150% of the line length. Then, the first and second zone setting of reactance relay are?
**Solution:** The line reactance is $X_("line") = 16 Omega$.
The conversion factor is $frac(C T_("ratio"), P T_("ratio")) = frac(1000, 1200) = 0.8333$.
**Zone-1 Setting (80%):**
$$
X_("Z1") = 0.8 times X_("line") times frac("CT"_("ratio"), "PT"_("ratio")) = 0.8 times 16 times 0.8333 = 10.67 Omega
$$
**Zone-2 Setting (150%):**
$$
X_("Z2") = 1.5 times X_("line") times frac("CT"_("ratio"), "PT"_("ratio")) = 1.5 times 16 times 0.8333 = 20 Omega
$$
**Exam Answer:** 10.67 Ω and 20 Ω, respectively (Option b)


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q01)
- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q03)
- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q04)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q05)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q06)
- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q07)
- [Type 1, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q08)
- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q09)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t1-w3-q10)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q06)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q08)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-03/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
