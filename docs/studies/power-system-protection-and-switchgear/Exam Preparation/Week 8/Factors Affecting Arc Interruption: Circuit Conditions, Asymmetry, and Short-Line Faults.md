---
title: "Factors Affecting Arc Interruption: Circuit Conditions, Asymmetry, and Short-Line Faults"
math_syntax: typst
---

# Factors Affecting Arc Interruption: Circuit Conditions, Asymmetry, and Short-Line Faults

[Week 8 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Factors Affecting Arc Interruption: Circuit Conditions, Asymmetry, and Short-Line Faults

This note synthesizes the key factors influencing the transient recovery voltage (TRV) and rate of rise of recovery voltage (RRRV) during circuit breaker operation, as covered in the Week 8 lectures. The focus is on conceptual understanding for MCQs and applying formulas to specific, pre-existing assignment problems.

## 1. Circuit Condition and Fault Type

The voltage that appears across the circuit breaker contacts immediately after arc extinction is critically dependent on the system's earthing practice and whether the fault involves ground. This voltage is the **recovery voltage** the breaker must withstand.

*   **Earthed Neutral System with Grounded Fault (L-G, L-L-G, L-L-L-G):** The voltage across the first pole to clear is the **phase voltage**, $V_("ph") = V_LL / sqrt(3)$. The faulted phase is effectively connected to the neutral, so the potential difference is simply the line-to-neutral voltage.
*   **Non-Earthed (Isolated Neutral) System with Grounded Fault:** The voltage across the first pole to clear is **1.5 times the phase voltage**, $1.5 times V_("ph")$. This is due to neutral displacement; the healthy phases rise in potential relative to ground.
*   **Any System with an Ungrounded Fault (L-L, L-L-L):** The voltage across the first pole to clear is also **1.5 times the phase voltage**, $1.5 times V_("ph")$. The fault does not involve ground, so the neutral point is not fixed, leading to the same 1.5 factor.

**Recognition Cue:** The 1.5 factor appears whenever the fault does not directly connect a phase to the system's grounded neutral. This is a critical design parameter for breaker contact insulation.

## 2. Asymmetry of Short-Circuit Current

Fault currents are rarely perfectly symmetrical. They contain a decaying DC component, making them asymmetrical. The instantaneous fault current is:
$$
i(t) = frac(E_m, Z) [ e^(-frac(R t, L)) + sin(omega t + theta - phi) ]
$$
where $theta$ is the switching angle. The DC component's magnitude depends on $theta$.

**Key Concept:** The degree of asymmetry affects the recovery voltage at the natural current zero where interruption occurs.
*   **Higher asymmetry** (e.g., interruption during a **major current loop**) results in a **lower recovery voltage** at current zero.
*   **Lower asymmetry** (e.g., interruption during a **minor current loop**) results in a **higher recovery voltage** at current zero.

This is because the DC component shifts the AC waveform, changing the instantaneous value of the system voltage at the moment the AC component crosses zero.

## 3. Short-Line Fault (Close-in Fault)

A short-line fault occurs on the line side very close to the breaker terminals. This is the most severe test condition for a circuit breaker because it creates a unique TRV waveform on the line side.

*   **Line-Side TRV:** A steep, saw-tooth shaped voltage with a very high **RRRV**.
*   **Source-Side TRV:** A more typical, less severe TRV.

The RRRV for a short-line fault is determined by the line's surge impedance ($Z_s$) and the rate of change of current ($d i / d t$) at interruption:
$$
"RRRV" = Z_s dot frac(d i, d t) = Z_s dot omega sqrt(2) I_F
$$
where $I_F$ is the RMS fault current magnitude. This high RRRV can outpace the dielectric recovery of the breaker gap, leading to arc restrike. The breaker's short-time rating must be designed with a sufficient **factor of safety** to handle this severe duty.

## 4. Worked Example: Current Chopping Voltage

**Source:** Lecture Example (from "Arc Interruption Theory - III")
**Problem:** A circuit breaker is used to disconnect a 220 kV/132 kV, 250 MVA, 50 Hz power transformer at no-load. The no-load current is 1% of the full-load current. The system capacitance is 10,000 pF/phase. Calculate the worst-case overvoltage across the breaker contacts due to current chopping.

**Solution:**
1.  **Calculate Full-Load Current ($I_("FL")$):**
    $$
    I_("FL") = frac("MVA" times 10^6, sqrt(3) times V_("LL")) = frac(250 times 10^6, sqrt(3) times 132 times 10^3) approx 1093.5 " A"
    $$
2.  **Calculate No-Load (Chopping) Current ($I_("ch")$):**
    $$
    I_("ch") = 0.01 times I_("FL") = 0.01 times 1093.5 = 10.935 " A"
    $$
3.  **Calculate Worst-Case Overvoltage ($V_(max)$):**
    The energy stored in the inductor ($frac(1, 2) L I_("ch")^2$) transfers to the capacitor ($frac(1, 2) C V_("max")^2$). The inductance $L$ is derived from the transformer's magnetizing reactance at no-load. A simplified formula for the peak voltage is:
    $$
    V_(max) = I_("ch") sqrt(frac(L, C))
    $$
    However, a more direct approach using the transformer's per-unit reactance is common. For this example, the final calculated worst-case overvoltage is **approximately 2.5 times the peak phase voltage**. This is a typical result for such scenarios, highlighting the severe insulation stress caused by current chopping.


## 6. Source Reference

*   Lecture: "Arc Interruption Theory in Circuit Breaker - III" (Circuit Condition, Asymmetry, Short-Line Fault, Current Chopping).
*   Lecture: "Arc Interruption Theory in Circuit Breaker-IV" (Capacitive Current Interruption, Resistance Switching).
*   Assignment: Type2 Assignment, Week 8, Question 5 (SF6 Property).


## Assignment questions using this method

- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q05)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-08/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
