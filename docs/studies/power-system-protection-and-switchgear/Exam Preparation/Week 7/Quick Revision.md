---
title: "Quick Revision"
math_syntax: typst
---

# Week 7 — Quick Revision

## Week 7 Revision Sheet: Key Formulas, Traps, and Concepts

### Busbar Protection
- **Differential Principle**: Compare currents entering/leaving bus. Internal fault: $abs(I_1 - I_2) > I_("pickup")$. External fault: ideally $abs(I_1 - I_2) = 0$.
- **Biased Differential**: Adds restraining current $(i_1 + i_2) / 2$. Operates if $abs(i_1 - i_2) > I_("pickup")$ AND $abs(i_1 - i_2) / (i_1 + i_2) / 2 > "slope%"$.
- **High Impedance**: Voltage across parallel CTs. External fault: voltage limited by CT resistance. Internal fault: voltage rises sharply. Stabilizing resistor $R_("stab")$ limits spill voltage.
- **CT Saturation**: Causes false differential current. Factors: burden, DC offset, core properties. Digital relays use algorithms to detect.
- **Busbar Arrangements**: Single bus (simple, low reliability), Main/Transfer (allows maintenance), Double bus (better reliability), One-and-a-half breaker (highest reliability for EHV).

### Transients & Surges
- **Sources**: Switching (lines, capacitors, reactors), Lightning (direct/indirect), Arcing ground.
- **Ungrounded System SLG Fault**: Healthy phase voltages rise to $V_("line-to-line") = sqrt(3) V_("ph")$. Capacitive fault current $3I_c$ can sustain arcing.
- **Peterson Coil (Resonant Grounding)**: Tune $L$ so $I_L = 3I_c$. Formula: $L = frac(1, 3 omega^2 C)$. MVA rating: $S = frac(V_L^2, 3 X_L)$.
- **Frequency Decline**: $frac(d f, d t) = -frac(Delta P, 2 H)$. Larger $H$ slows decline.
- **Islanding Detection**: Passive (monitor V, f) has NDZ. Active (perturb system) has small NDZ. Hybrid combines both.
- **Lightning Arrester Ratings**: Rated voltage = MCOV. Discharge voltage = conduction threshold. BIL = impulse withstand.

### Circuit Breaker Arc Interruption
- **Key Voltages**: Arc voltage (low, resistive), Restriking voltage (during arcing), TRV (high-frequency after extinction), Recovery voltage (steady-state).
- **TRV Formula**: $V_c = E_(max)(1 - cos omega_n t)$. Peak = $2E_max$ for grounded neutral.
- **Natural Frequency**: $f_n = frac(1, 2 pi sqrt(L C))$.
- **RRRV**: Slope of first TRV peak. $"RRRV"_("max") = E_("max") omega_n$. Average $"RRRV" = V_("TRV", "peak") / t_("peak")$.
- **Interruption Theories**: Slepian (dielectric race: dielectric recovery vs RRRV). Cassie (energy balance: heat dissipation vs generation).
- **Factors Affecting RRRV**: Low power factor (high instantaneous voltage at current zero), asymmetry, short-line faults.

### Common Traps
1.  **Voltage Definitions**: Always clarify if voltage is line-to-line or phase-to-ground. Ungrounded system healthy phase voltage = $V_(L-L)$, not $sqrt(3) V_(L-L)$.
2.  **Peterson Coil Capacitance**: Ensure $C$ is total per-phase capacitance, not per km.
3.  **RRRV Units**: Check if answer is in kV/s or kV/s × 10³.
4.  **First Pole to Clear Factor**: Open neutral: 1.5; Solidly grounded: 1.
5.  **Islanding Detection**: Active methods are needed for perfect generation-load match.
6.  **CB Contact Resistance**: Micro-ohms (μΩ) for closed position.
7.  **TRV vs Recovery Voltage**: TRV is immediate high-frequency transient; Recovery is final steady-state.
8.  **Busbar Fault Statistics**: 67% are line-to-ground faults.
9.  **Switching Surge Severity**: Maximum when energizing at voltage peak with opposite trapped charge.
10. **Arc Interruption Difficulty**: Reactive currents are harder to interrupt than resistive due to high instantaneous voltage at current zero.