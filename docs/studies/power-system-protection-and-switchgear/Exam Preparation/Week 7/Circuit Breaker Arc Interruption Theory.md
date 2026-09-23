---
title: "Circuit Breaker Arc Interruption Theory"
math_syntax: typst
---

# Circuit Breaker Arc Interruption Theory

[Week 7 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Circuit Breaker Arc Interruption Theory

When a circuit breaker opens under load or fault, an arc forms between its separating contacts. Successful interruption requires extinguishing this arc at a natural current zero and preventing its restrike. This note covers the core concepts, key voltages, interruption theories, and a worked numerical example from the original assignments.

## Arc Formation and Key Voltages

As contacts separate, the intense electric field ionizes the medium (gas, oil, vacuum), creating a plasma arc. The behavior of voltages during this process is critical.

*   **Arc Voltage ($V_a$):** The voltage across the arc column itself. It is relatively low, resistive in nature, and in phase with the arc current.
*   **Restriking Voltage:** The voltage that appears across the contacts *during* the arcing period, after a current zero but before final extinction.
*   **Transient Restriking Voltage (TRV):** The high-frequency voltage that appears across the contacts *immediately after* the final arc extinction. For a simple LC circuit, it is given by:
    $$
    V_c = E_(max)(1 - cos omega_n t)
    $$
    where $E_("max")$ is the peak phase voltage and $omega_n = 1 / sqrt(L C)$ is the natural angular frequency.
*   **Rate of Rise of Restriking Voltage (RRRV):** The slope of the TRV waveform. The **average RRRV** to the first peak is a key parameter:
    $$
    "RRRV"_("avg") = frac(V_("TRV", "peak"), t_("peak"))
    $$
    The first peak of the TRV is $2E_max$ and occurs at $t_("peak") = pi sqrt("LC")$.
*   **Recovery Voltage:** The steady-state, power-frequency voltage across the contacts after the arc is fully extinguished and transients have decayed.

## Arc Interruption Theories

Two main theories explain the conditions for successful arc extinction at a current zero.

1.  **Slepian's (Dielectric) Theory:** This is a "race" theory. After a current zero, the dielectric strength of the medium between contacts recovers. Simultaneously, the TRV begins to rise. **Interruption succeeds if the rate of dielectric recovery exceeds the RRRV.** If the RRRV is steeper, the gap breaks down again, and the arc restrikes.
2.  **Cassie's (Energy Balance) Theory:** This theory focuses on thermal equilibrium. The arc plasma contains stored thermal energy. After a current zero, the arc's ability to dissipate heat competes with the energy input from the recovering voltage. **Interruption succeeds if the rate of heat dissipation exceeds the rate of heat generation.** If heat generation dominates, the arc remains conductive and restrikes.

## Factors Affecting TRV and RRRV

The severity of the TRV and RRRV depends on system conditions:
*   **Power Factor:** Faults are highly inductive (low PF). At current zero, the voltage is near its peak, leading to a high instantaneous recovery voltage and a more severe TRV. Interrupting a small reactive fault current is harder than interrupting a larger resistive one.
*   **Fault Type & System Grounding:** Ungrounded or impedance-grounded systems generally produce higher TRV magnitudes than solidly grounded systems for the same fault.
*   **Asymmetry (DC Offset):** A DC component in the fault current shifts the waveform, causing the first current zero to occur earlier or later than the natural zero, affecting the TRV severity.
*   **Short Line Faults (Close-in Faults):** Faults very near the breaker cause traveling wave reflections on the line, resulting in a very steep, sawtooth-shaped TRV with an extremely high RRRV.

## Worked Example: RRRV Calculation

This example is taken directly from the supplied original assignment (T2-W7-Q10).

**Problem (T2-W7-Q10):** A 50 Hz, 13.8 kV, three-phase generator with grounded neutral has an inductance of 15 mH/phase and is connected to a busbar through a circuit breaker (CB). The capacitance to earth between the generator and the CB is 0.05 μF/phase. Determine the average RRRV.

**Solution:**
1.  **Calculate peak phase voltage ($E_("max")$):**
    $$
    E_("max") = frac(V_("LL"), sqrt(3)) times sqrt(2) = frac(13.8, sqrt(3)) times sqrt(2) approx 11.2677 " kV"
    $$

2.  **Calculate the first peak of the TRV ($V_("TRV", "peak")$):**
    For a grounded-neutral LC circuit, the first peak is:
    $$
    V_("TRV", "peak") = 2 times E_("max") = 2 times 11.2677 = 22.5354 " kV"
    $$

3.  **Calculate the time to this first peak ($t_("peak")$):**
    $$
    t_("peak") = pi sqrt("LC") = pi sqrt((15 times 10^(-3)) times (0.05 times 10^(-6)))
    $$
    $$
    t_("peak") = pi sqrt(7.5 times 10^(-10)) approx pi times 2.7386 times 10^(-5) approx 86.036 times 10^(-6) " s"
    $$

4.  **Calculate the average RRRV:**
    $$
    "RRRV"_("avg") = frac(V_("TRV", "peak"), t_("peak")) = frac(22.5354 " kV", 86.036 times 10^(-6) " s")
    $$
    $$
    "RRRV"_("avg") approx 261.93 times 10^3 " kV/s"
    $$

**Exam Answer:** The calculated value is approximately $261.93 times 10^3$ kV/s. The closest option in the original assignment (T2-W7-Q10) is **$262.09 times 10^3$ kV/s**. The minor difference is due to rounding in intermediate steps.


## Source References
*   Lecture 34: Arc Interruption Theory I (pp. 729-759).
*   Lecture 35: Arc Interruption Theory II (pp. 760-777).
*   Type2 Assignment, Week 7, Q9 & Q10.


## Assignment questions using this method

- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-7-assignment-solutions#t2-w7-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-07/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
