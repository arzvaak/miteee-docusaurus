---
title: "Quick Revision"
math_syntax: typst
---

# Week 8 — Quick Revision

## Week 8 Revision Sheet: Circuit Breaker Interruption, Ratings, and Relay Testing

### Key Formulas & Constants
- **Peak Phase Voltage:** $V_("ph","peak") = sqrt(2) times V_LL / sqrt(3)$
- **First-Pole-to-Clear Voltage Factor:**
  - Earthed system, grounded fault: $1.0 times V_("ph")$
  - Non-earthed system, grounded fault: $1.5 times V_("ph")$
  - Earthed system, ungrounded fault: $1.5 times V_("ph")$
- **Short-Line Fault RRRV:** $"RRRV" = Z_s dot frac(d i, d t) = Z_s dot omega sqrt(2) I_F$ (kV/μs if units consistent)
- **Current Chopping Voltage:** $V = I_("peak") sqrt(frac(L, C))$
- **Resistance Switching Criterion:** Overdamped if $R > 2 sqrt(frac(L, C))$
- **Breaking Capacity (MVA):** $sqrt(3) times V_("rated") ("kV") times I_("breaking") ("kA")$
- **Making Capacity (Peak):** $I_("mk") = sqrt(2) times k times I_("sym")$, with $k approx 2.5$; Making MVA $approx 2.5 times$ Breaking MVA
- **Asymmetrical Breaking Current:** $I_("asym") = sqrt(I_("sym")^2 + I_("DC")^2)$

### Common Traps & Mistakes
1. **First-Pole-to-Clear:** Misapplying the 1.5 factor. Remember: it applies when the fault is ungrounded OR the system is non-earthed with a grounded fault.
2. **Current Chopping:** Forgetting the $sqrt(2)$ for peak current in $V = I sqrt(L/C)$. Also, confusing which breaker types are prone (forced-blast like SF6/air blast are worse than self-blast like oil).
3. **Capacitive Restrikes:** Voltage can build to $3V_m$ after first restrike if restrike occurs at supply voltage peak opposite to trapped charge.
4. **RRRV for Short-Line Faults:** Depends on line surge impedance $Z_s$, not just source impedance. Formula is $Z_s dot omega sqrt(2) I_F$.
5. **CB Ratings:** Making capacity > Breaking capacity. Making is peak, breaking is RMS. Short-time rating > continuous rating.
6. **Relay Testing:** Type tests (manufacturer) vs. Commissioning tests (customer site). CT secondary must be shorted before removing relays. Insulation resistance is in MΩ (typical ~5 MΩ).
7. **Operating Time Tolerance:** ±12.5% for PSM 2-4, ±7.5% for PSM 4-20.

### Concept Comparisons
- **Current Chopping vs. Capacitive Restrikes:** Chopping involves inductive energy conversion to capacitance; restrikes involve trapped charge and supply voltage reversal.
- **Symmetrical vs. Asymmetrical Breaking Current:** Symmetrical is AC component only; asymmetrical includes DC component.
- **Type Test vs. Commissioning Test:** Type test verifies design on sample; commissioning test verifies installation and no transit damage.
- **Primary vs. Secondary Injection Test:** Primary tests entire scheme (CT, relay, trip circuit); secondary tests relay calibration only.

### Quick Reference for Common Values
- SF6 heat transfer: ~2.5× air
- SF6 dielectric strength: ~2.5× oil
- Typical insulation resistance: ~5 MΩ
- Making capacity factor: 2.0-2.5× breaking capacity
- Short-time rating: > continuous rating
- Relay flag inspection: Daily
- Tripping test frequency: Half-yearly

### Derivation Highlights
- **Current Chopping Voltage:** From energy conservation: $frac(1, 2) L I^2 = frac(1, 2) C V^2 arrow.r.double V = I sqrt(L/C)$.
- **RRRV for Short-Line Fault:** From traveling wave theory: $"RRRV" = Z_s dot d i / d t$, with $d i / d t$ at current zero = $omega sqrt(2) I_F$.
- **Resistance Switching Damping:** From RLC circuit theory, critical damping at $R = 2 sqrt(L/C)$.