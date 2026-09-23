---
title: "Interruption of Small Inductive and Capacitive Currents: Current Chopping and Restrikes"
math_syntax: typst
---

# Interruption of Small Inductive and Capacitive Currents: Current Chopping and Restrikes

[Week 8 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Interruption of Small Inductive and Capacitive Currents: Current Chopping and Restrikes

This note covers the phenomena that create severe overvoltages when circuit breakers interrupt small inductive currents (like transformer magnetizing currents) and capacitive currents (like line charging currents). The focus is on understanding the physical mechanisms, the resulting voltage stress, and mitigation techniques, particularly resistance switching.

## 1. Current Chopping: The Core Phenomenon

Current chopping is the premature interruption of a small inductive current *before* its natural zero crossing. This is not a controlled interruption but a consequence of the breaker's arc instability at very low current magnitudes.

**Physical Mechanism:** When the arc is extinguished at a current value $I_("chop")$ (the chopping current), the magnetic energy stored in the circuit's inductance ($L$) is rapidly converted into electrostatic energy in the system's stray capacitance ($C$). This energy conversion is governed by:
$$
frac(1, 2) L I_("chop")^2 = frac(1, 2) C V_("max")^2
$$
Solving for the peak voltage across the breaker contacts gives:
$$
V_(max) = I_("chop") sqrt(frac(L, C))
$$
This voltage is superimposed on the power-frequency recovery voltage, creating a severe dielectric stress that can damage transformer insulation or cause restrikes.

**Key Recognition Cues:** The problem involves interrupting the no-load current of a transformer or shunt reactor. The current value is small (amps), but the resulting voltage can be many times the system's phase voltage.

## 2. Worked Example: Current Chopping Voltage

**Source:** Lecture Example (from supplied slides).

**Problem:** A circuit breaker interrupts the no-load current of a 220 kV / 132 kV, 250 MVA, 50 Hz transformer. The no-load current is 1% of the full-load current. The system capacitance is 10,000 pF per phase. Calculate the worst-case overvoltage across the breaker contacts.

**Solution:**
1.  **Calculate Full-Load Current (Primary Side):**
    $$
    I_("FL") = frac(S, sqrt(3) times V_("LL")) = frac(250 times 10^6, sqrt(3) times 220 times 10^3) = 656.08 " A (rms)"
    $$
2.  **Calculate No-Load (Chopping) Current:**
    $$
    I_("NL") = 0.01 times I_("FL") = 0.01 times 656.08 = 6.56" A (rms)"
    $$
    The peak value of this current is:
    $$
    I_("chop(peak)") = sqrt(2) times I_("NL") = sqrt(2) times 6.56 = 9.28 " A"
    $$
3.  **Calculate System Inductance (L):** The inductance is derived from the transformer's magnetizing reactance at no-load.
    $$
    X_L = frac(V_("ph"), I_("NL")) = frac(220 times 10^3 / sqrt(3), 6.56) = 19,190 "ohm"
    $$
    $$
    L = frac(X_L, omega) = (19,190)/(2 pi times 50) = 61.16 " H"
    $$
4.  **Calculate Peak Overvoltage ($V_(max)$):**
    $$
    V_(max) = I_("chop","peak") sqrt(frac(L, C)) = 9.28 times sqrt(frac(61.16, 10000 times 10^(-12))) = 728443 " V" approx 728.4 " kV"
    $$

**Comparison:** The normal peak phase voltage is $(220 / sqrt(3)) times sqrt(2) approx 179.6 " kV"$. The calculated overvoltage of 728.4 kV is over **4 times** this value, demonstrating the severity of current chopping.

## 3. Interruption of Capacitive Currents and Restrikes

When a breaker opens a capacitive circuit (e.g., an unloaded cable or line), the current leads the voltage by 90°. At current zero, the voltage across the capacitor is at its peak ($V_m$). This charge is "trapped" on the capacitor side of the open contacts.

**The Restrike Mechanism:** If the dielectric strength between the contacts recovers slower than the transient recovery voltage (TRV), a restrike can occur. The worst case is a restrike when the supply voltage has reversed to its opposite peak ($- V_m$). This creates a voltage difference of $2V_m$ across the gap, causing a high-frequency oscillation that can charge the capacitor to nearly $2V_m$. If the breaker clears this restrike, the capacitor is left with a trapped charge of $2V_m$. A subsequent restrike half a cycle later, when the supply is at $+ V_m$, creates a $3V_m$ difference, potentially charging the capacitor to $3V_m$. This voltage escalation can continue with successive restrikes.

## 4. Mitigation: Resistance Switching

Resistance switching is the primary method to control the TRV and reduce overvoltages from both current chopping and capacitive restrikes.

**Principle:** A resistor ($R$) is connected in parallel with the breaker contacts. Upon interruption, the resistor provides an alternative path for current, damping the oscillatory TRV and dissipating the trapped energy.

**Effect on TRV:** The presence of $R$ reduces both the peak value of the TRV and its Rate of Rise of Recovery Voltage (RRRV). This lowers the dielectric stress across the contacts, making restrikes less likely and increasing the breaker's effective breaking capacity.

**Damping Condition:** For the simple R-L-C recovery circuit, the critical damping resistance is $R = 2 sqrt(L/C)$. Using $R > 2 sqrt(L/C)$ (overdamping) is typical to eliminate the first RRRV peak entirely.

## 5. Conceptual MCQ: Resistance Switching Purpose

**Source:** Type2 Assignment, Week 8, Question 3 (ID: T2-W8-Q03).

**Question:** Pre-insertion resistor with circuit breaker is used to:
A) increase the peak of restriking voltage and the rate of rise of recovery voltage (RRRV)
B) increase the peak of restriking voltage and decrease the RRRV
C) decrease the peak of restriking voltage and the RRRV
D) decrease the peak of restriking voltage and increase the RRRV

**Exam Answer:** C

**Explanation:** The supplied answer key is authoritative. The resistor's function is to damp the transient, thereby reducing both the peak voltage and its rate of rise. Note: The term "pre-insertion resistor" is often used for closing operations to limit inrush, but the principle of damping applies similarly to an opening shunt resistor. The assignment uses this terminology.


## 7. Source Reference

This content is derived from the lecture excerpts covering:
*   **Current Chopping:** The mechanism, energy conversion principle, and the worked example calculating overvoltage for an unloaded transformer.
*   **Capacitive Current Interruption:** The trapped charge concept and the mechanism of voltage escalation through successive restrikes.
*   **Resistance Switching:** The purpose of connecting a parallel resistor to damp TRV and RRRV, thereby reducing overvoltages and improving breaking capacity.


## Assignment questions using this method

- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q03)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-08/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
