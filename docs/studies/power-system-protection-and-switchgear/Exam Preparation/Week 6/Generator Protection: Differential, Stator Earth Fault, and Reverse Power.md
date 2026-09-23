---
title: "Generator Protection: Differential, Stator Earth Fault, and Reverse Power"
math_syntax: typst
---

# Generator Protection: Differential, Stator Earth Fault, and Reverse Power

[Week 6 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Generator Protection: Differential, Stator Earth Fault, and Reverse Power

## 1. Differential Protection (Relay 87) for Stator Faults

Differential protection provides high-speed, unit-type protection for internal phase-to-phase and phase-to-ground faults within the generator stator winding. It operates on Kirchhoff's Current Law, comparing currents entering and leaving the protected zone via CTs at the neutral and terminal sides.

**Principle:** Under normal or external fault conditions, the currents are balanced ($i_1 = i_2$). An internal fault disturbs this balance ($i_1 != i_2$), causing a differential current ($i_1 - i_2$) to flow through the relay operating coil.

**Key Challenges & Solutions:**
*   **Spill Current:** Caused by non-identical CT saturation characteristics and unequal lead lengths, leading to a false differential current during external faults.
*   **High-Impedance Scheme:** A **stabilizing resistance** ($R_("stab")$) is added in series with the relay coil. This increases the branch impedance, reducing the spill current for a given voltage, thus preventing mal-operation. **Critical Correction:** This reduces relay sensitivity for internal faults.
*   **Biased (Percentage) Differential Scheme:** This is the preferred modern solution. It adds a restraining coil proportional to the average through-current. The relay operates only if the differential current exceeds a set percentage (slope) of the restraining current. This provides inherent stability against spill currents without a large sensitivity penalty.

**Recognition Cue:** Look for CTs on both sides of the generator winding and a relay comparing their secondaries. For numerical problems, identify if the question involves CT ratios, lead resistances, or relay settings (pickup, slope).

## 2. Stator Earth Fault Protection

This scheme protects against insulation failure between the stator conductor and the grounded core. The fault current is intentionally limited to minimize damage.

**Neutral Grounding:** The generator neutral is grounded through a high resistance ($Z_n$), often via a **Neutral Grounding Transformer (NGT)** with a secondary resistor. This limits the maximum earth-fault current.

**Core Concept: Percentage of Unprotected Winding ($x$)**
A fault very close to the neutral produces a very small voltage and thus a small fault current. The relay has a minimum pickup current ($I_("pickup")$). The portion of the winding from the neutral where a fault current is below this pickup remains unprotected.

The fundamental relationship is:
$$
x dot frac(V_("ph"), Z_n) = I_("pickup")
$$
Where:
*   $x$ = Fraction of winding unprotected (from neutral end).
*   $V_("ph")$ = Generator phase voltage ($V_("line")/sqrt(3)$).
*   $Z_n$ = Neutral grounding resistance (Ω).
*   $I_("pickup")$ = Relay primary pick-up current (A).

Rearranged for calculation:
$$
x = frac(I_("pickup") dot Z_n, V_("ph"))
$$

**Important:** $I_("pickup")$ is the relay setting referred to the CT primary side. If the relay setting is given as a percentage ($Q$) of the CT primary rating ($P_("CT")$), then $I_("pickup") = (Q/100) dot P_("CT")$.

## 3. Reverse Power Protection (Relay 32)

This is a **directional power relay** that detects a loss of prime mover (e.g., turbine failure). When this occurs, the generator draws real power from the grid and runs as a synchronous motor, which can cause severe damage to the turbine (e.g., overheating from windage losses in steam turbines).

**Operation:** It measures the phase angle between generator terminal voltage and current. It is set to operate only for power flow *into* the generator (reverse direction). It is always **time-delayed** to avoid operation during transient power swings or system disturbances.

**Recognition Cue:** Keywords like "loss of prime mover," "motoring," or "reverse power." The relay is typically a power or directional relay (ANSI 32).

## 4. Worked Example: Unprotected Stator Winding (T1-W6-Q03)

**Problem:** A 13.8 kV star-connected synchronous generator is grounded through a neutral resistance of 4.5 Ω. The earth-fault relay is fed by a CT of ratio 6000/5 A and is set to pick up at 10% of its rated current. Determine the percentage of the stator winding, measured from the neutral end, that remains unprotected.

**Solution:**
1.  **Calculate Generator Phase Voltage:**
    $$
    V_("ph") = frac(V_("line"), sqrt(3)) = frac(13800, sqrt(3)) = 7967.4 thin "V"
    $$
2.  **Calculate Relay Primary Pickup Current:**
    $$
    I_("pickup") = 10% " of CT Primary Rating" = 0.10 times 6000 = 600 " A"
    $$
3.  **Calculate Unprotected Fraction ($x$):**
    $$
    x = frac(I_("pickup") dot Z_n, V_("ph")) = frac(600 times 4.5, 7967.4) = 0.3389
    $$
4.  **Convert to Percentage:**
    $$
    text("Unprotected %") = 0.3389 times 100 = 33.89%
    $$

**Exam Answer:** 33.89% (Option D). The supplied keyed answer is authoritative.

## 5. Worked Example: Neutral Resistor & Unprotected Winding (T2-W6-Q05)

**Problem:** A 200 MW, 13.8 kV, 0.9 PF, 50 Hz, three-phase, Y-connected generator is protected by an earth-fault relay. The relay is set to operate at 10%. The CT ratio is 10,000/1 A. A resistor is used in the neutral circuit to limit the earth-fault current to 50% of the normal load current. Determine the value of the resistor and the percentage of stator winding unprotected.

**Solution:**
1.  **Calculate Full-Load Current ($I_("FL")$):**
    $$
    I_("FL") = frac(P, sqrt(3) dot V_("line") dot P F) = frac(200 times 10^6, sqrt(3) times 13800 times 0.9) = 9297.11 " A"
    $$
2.  **Calculate Maximum Earth-Fault Current Limit ($I_("f,max")$):**
    $$
    I_("f,max") = 50% " of " I_("FL") = 0.5 times 9297.11 = 4648.55 " A"
    $$
3.  **Calculate Neutral Resistor ($R_n$):**
    For a solid ground fault at the terminals, $I_("f,max") = V_("ph") / R_n$.
    $$
    R_n = frac(V_("ph"), I_(f,"max")) = frac(13800 / sqrt(3), 4648.55) = 1.714 thin Omega
    $$
4.  **Calculate Relay Primary Pickup Current ($I_("pickup")$):**
    $$
    I_("pickup") = 10% " of CT Primary Rating" = 0.10 times 10000 = 1000 " A"
    $$
5.  **Calculate Unprotected Fraction ($x$):**
    $$
    x = frac(I_("pickup"), I_(f,max)) = frac(1000, 4648.55) = 0.2151
    $$
    $$
    text("Unprotected %") = 21.51%
    $$

**Exam Answer:** 1.71 Ω and 21.46% (Option C). The supplied keyed answer is authoritative. The small discrepancy (21.51% vs. 21.46%) is due to source rounding; the method is correct.


## 7. Source References

*   **Lecture 28:** Generator protection overview, differential protection principle, high-impedance differential scheme with stabilizing resistance.
*   **Lecture 29:** Biased differential protection, reverse power protection, stator earth fault protection theory and calculation examples.
*   **Original Assignments:** T1-W6-Q03, T2-W6-Q05, T2-W6-Q07, T2-W6-Q08.


## Assignment questions using this method

- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q03)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q05)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q08)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-06/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
