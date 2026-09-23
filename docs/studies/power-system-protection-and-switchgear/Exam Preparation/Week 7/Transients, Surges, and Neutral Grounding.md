---
title: "Transients, Surges, and Neutral Grounding"
math_syntax: typst
---

# Transients, Surges, and Neutral Grounding

[Week 7 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Week 7 – Transients, Surges, and Neutral Grounding

This note consolidates key concepts for assignment-style MCQs and numerical problems on transient overvoltages and neutral grounding practices. The focus is on understanding causes, system behavior during faults, and the application of grounding methods.

## 1. Sources of Transients and Surges
Transient overvoltages (surges) are temporary, high-magnitude voltage disturbances. Their primary sources are:
*   **Switching Operations:** Energizing/de-energizing lines, capacitor banks, or reactors. The surge magnitude depends on the voltage difference across the breaker contacts at the switching instant.
*   **Lightning Strokes:** Direct strokes are rare but severe. Most line surges come from indirect strokes, which induce traveling waves with a fast wavefront (1-10 µs) and a slower tail.
*   **Arcing Ground:** In ungrounded systems, an intermittent arc during a single line-to-ground (SLG) fault can produce cumulative, high-magnitude transient overvoltages due to repeated restrikes.
*   **Resonance:** Can also cause overvoltages.

**Original Assignment Question (T2-W7-Q03):**
The cause of surge voltage in power system is
**Exam Answer:** **D: Any of the above**. (Lightning, switching operations, and resonance are all valid causes).

## 2. Neutral Grounding and Fault Behavior
The grounding method dictates system performance during faults, particularly SLG faults.

### Ungrounded (Isolated) Neutral
*   **Normal Operation:** Balanced shunt capacitances produce small, balanced charging currents ($I_c$) that sum to zero.
*   **During SLG Fault:** The faulted phase voltage collapses to near zero. The neutral shifts, causing the healthy phase-to-ground voltages to rise to the full line-to-line value ($sqrt(3) V_("ph")$). The fault current is purely capacitive and equals $3I_c$. This small, capacitive current can sustain an intermittent arc, leading to the dangerous arcing ground phenomenon.

**Original Assignment Question (T2-W7-Q04):**
In an isolated neutral system, when a single line to ground fault occurs
**Exam Answer:** **D: all of the above**. (The supplied key lists all options as correct. The categorical wording describes course-listed hazards: arcing grounds can develop, healthy phase voltages rise to full line value, and capacitive fault current rises to 3 times its normal value. These are possible consequences, not inevitable for every fault).

### Solidly Grounded Neutral
*   **During SLG Fault:** Provides a low-impedance path, resulting in a very high fault current magnitude. A key benefit is that it limits the voltage rise on healthy phases to typically less than 80% of the line voltage, protecting insulation.

### Resistance Grounded Neutral
*   A neutral resistor ($R$) is inserted to limit the magnitude of ground fault current. The resistor value can be selected to compensate for the capacitive fault current ($3I_c$), helping to extinguish the arc and suppress transients.

### Resonant (Petersen Coil) Grounded
*   An iron-cored reactor (Petersen coil) is connected between neutral and ground.
*   **Principle:** The coil's inductive reactance ($X_L$) is tuned so that its fault current ($I_L = V_("ph")/X_L$) equals and cancels the capacitive fault current ($3I_c$) at fundamental frequency.
*   **Resonance Condition:** $I_L = 3I_c arrow.r.double frac(V_("ph"), X_L) = 3 V_("ph") omega C arrow.r.double X_L = frac(1, 3 omega C)$.
*   **Application:** Used in medium-voltage systems to allow time for fault clearance without immediate tripping, as the net fault current is reduced to a very small value.

## 3. Numerical Problem: Peterson Coil Sizing
This is a direct application of the resonant grounding principle.

**Original Assignment Question (T2-W7-Q07):**
A 220 kV, three-phase, 50 Hz, 60 km long overhead transmission line has a capacitance of 1.2 mF/km. Determine the inductive reactance and kVA rating of the arc suppression coil suitable for this system to eliminate arcing ground effect.
**Exam Answer:** **D: None of these**.

**Analysis:**
The supplied answer key is authoritative. The literal calculation using the given unit does not match options A-C.
1.  **Given:** Line voltage $V_L = 220$ kV, Frequency $f = 50$ Hz, Length = 60 km, Capacitance = 1.2 mF/km.
2.  **Literal Calculation:**
    *   Total per-phase capacitance: $C_("total") = 1.2 times 10^(-3) " F/km" times 60 " km" = 0.072 " F"$.
    *   Angular frequency: $omega = 2 pi f = 314.16 " rad/s"$.
    *   Required $X_L$: $X_L = frac(1, 3 omega C_("total")) = frac(1, 3 times 314.16 times 0.072) approx 0.0148 Omega$.
    *   This value is not among options A-C.
3.  **Observation:** A similar worked example in the lecture (pp. 680-681) treats "1.2 mF" as the *total* per-phase capacitance for the line, not per km. Using that interpretation:
    *   $C_("total") = 1.2 times 10^(-3) " F"$.
    *   $X_L = frac(1, 3 times 314.16 times 0.0012) approx 884 "ohm"$. This matches option B's reactance.
    *   MVA Rating: $S = frac(V_L^2, 3 X_L) = frac((220 times 10^3)^2, 3 times 884) approx 18.28 " MVA"$. This matches option B.
4.  **Conclusion:** The discrepancy highlights a potential source-unit issue. For exam grading, always use the supplied key **D**.

## 4. Frequency Decline and Inertia
The rate of frequency decline after a generation-load mismatch is governed by the system's inertia constant ($H$).

**Formula:** $frac(d f, d t) = -frac(Delta P, 2 H)$ (in per unit, where $Delta P$ is the power mismatch in pu on a common base).
*   **Interpretation:** For a given overload ($Delta P$), a **larger inertia constant ($H$)** results in a **slower rate of frequency decline**. This is because a larger $H$ means more stored kinetic energy in the rotating masses, which resists changes in speed (frequency).

**Original Assignment Question (T2-W7-Q05):**
Reduction in frequency is slower for a given overload for...
**Exam Answer:** **D: a large value of inertia constant**.

## 5. Islanding Detection
Islanding occurs when a portion of the grid, containing both load and generation, becomes isolated but remains energized.

*   **Passive Techniques:** Monitor system parameters (voltage, frequency, harmonics) for deviations. They have a **Non-Detection Zone (NDZ)** when generation and load are closely matched.
*   **Active Techniques:** Deliberately inject small perturbations (e.g., frequency shifts) into the system. The system response reveals an island even with a perfect generation-load match, effectively eliminating the NDZ.
*   **Hybrid Techniques:** Combine passive and active methods.

**Original Assignment Question (T2-W7-Q06):**
Which technique is capable of detecting islanding in case of a perfect match between generation and load demand?
**Exam Answer:** **A: Active detection technique**. (Note: A hybrid scheme with an active stage could also work, but the supplied key specifies A).

## 6. First Pole to Clear Factor (FPCF)
The FPCF is the ratio of the recovery voltage across the first pole of a circuit breaker to clear a fault, compared to the normal phase voltage. It depends on system grounding.
*   **Open (Ungrounded) Neutral:** For a three-phase fault, the first pole sees a recovery voltage of **1.5 times** the phase voltage due to neutral shift.
*   **Solidly Grounded Neutral:** The neutral is fixed, so the first pole sees a recovery voltage of **1.0 times** the phase voltage.

**Original Assignment Question (T2-W7-Q08):**
The first pole to clear factor in case of a phase-to-ground fault in an open neutral system and solidly grounded system are equal to...
**Exam Answer:** **A: 1.5 and 1, respectively**. (Note: The classic 1.5 factor is derived for a three-phase fault in an unearthed system. The question's wording is a simplification; follow the supplied key).


## Source References
*   Lecture 32: Protection against Transients and Surges I (pp. 647-687).
*   Lecture 33: Protection against Transients and Surges II (pp. 688-728).
*   Type2 Assignment, Week 7, Questions 3-8.


## Assignment questions using this method

- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q03)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q04)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q05)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q06)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q08)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-07/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
