---
title: "Quick Revision"
math_syntax: typst
---

# Week 6 — Quick Revision

## Week 6 Revision Sheet: Transformer, Generator, and Motor Protection

### Key Formulas & Concepts

**Transformer Differential Protection:**
- Operating current: $I_("op") = |i_1 - i_2|$
- Restraining current: $I_("res") = (i_1 + i_2)/2$
- Bias setting: $"Bias" = (I_(op) / I_("res")) times 100 percent$
- Relay operates if $I_("op") > I_("pickup")$ AND $"Bias" > "Bias Setting"$
- CT connections: Opposite to winding connections (star winding → delta CTs, delta winding → star CTs) to compensate for $30 degree$ phase shift.
- Magnetizing inrush restraint: Detect second harmonic content (typically >15-20%).

**Generator Protection:**
- Unprotected stator winding fraction: $x = (I_("pickup") times Z_n) / V_("phase")$
- $I_("pickup")$ = relay primary setting (A), $Z_n$ = neutral resistance (Ω), $V_("phase")$ = generator phase voltage (V)
- Reverse power relay: Time-delayed, detects power reversal (0.5-5% of rated power).
- High-impedance differential: $V_R = i_f times (R_("CT") + R_L)$, $R_("stab") = (V_R / I_s) - R_R$
- Knee point voltage: $V_K >= 2 V_R$

**Induction Motor Protection:**
- Thermal overload (49): Setting below maximum continuous overload current referred to CT secondary.
- Negative sequence (46): Setting based on $Z_2/Z_1$ ratio.
- Stalling (51): Current setting $I_("stall") approx (1/3 " to " 1/2) times I_("start")$; time setting between acceleration time and safe stalling time.
- Instantaneous overcurrent (50): Set above maximum starting current.

### Common Traps & Mistakes
1. **CT Connection Errors:** Using star CTs on both sides of a delta-star transformer without compensation causes $30 degree$ phase shift and mal-operation.
2. **Bias vs Pickup:** Confusing the bias setting (a ratio) with the pickup setting (a current). Both conditions must be met for operation.
3. **Unprotected Winding:** Using line voltage instead of phase voltage in $x = (I_("pickup") times Z_n) / V_("phase")$.
4. **Motor Starting Current:** Setting instantaneous relay below starting current causes tripping during start.
5. **Reverse Power Setting:** Setting too low causes tripping during transient power reversals.
6. **NGT vs Direct Resistor:** Forgetting that NGT reduces resistor voltage rating and size.

### Revision Checklist
- [ ] Can calculate CT ratios for delta-star transformers with phase compensation.
- [ ] Can determine if a biased differential relay operates for given currents.
- [ ] Can calculate unprotected winding percentage for generator stator earth fault.
- [ ] Can explain why Buchholz relay alarms but doesn't trip.
- [ ] Can set thermal overload relay for induction motor.
- [ ] Can explain why reverse power protection is time-delayed.
- [ ] Can describe the purpose of stabilizing resistance in high-impedance differential protection.
- [ ] Can calculate bias ratio and compare with setting.
- [ ] Can explain the role of second harmonic restraint in transformer differential protection.
- [ ] Can describe the effect of tap changing on differential protection.

### Key Comparisons
| Aspect | Transformer Differential | Generator Differential |
|--------|--------------------------|------------------------|
| Phase Compensation | Required for delta-star | Not required (star-star) |
| Inrush Restraint | Second harmonic | May use harmonic restraint |
| Bias Setting | Accounts for tap change | Accounts for CT mismatch |
| Neutral Grounding | Not applicable | High resistance via NGT |

| Motor Protection | Key Relay | Purpose |
|----------------|-----------|---------|
| Overload | 49 | Thermal protection |
| Unbalance | 46 | Negative sequence |
| Stalling | 51 | Locked rotor |
| Short Circuit | 50/51 | Overcurrent |
| Undervoltage | 27 | Voltage drop |

### Source References
- Lecture 26: Transformer incipient faults, Buchholz relay.
- Lecture 27: Transformer differential protection, phase shift, bias, inrush.
- Lecture 28: Generator differential protection, high-impedance scheme.
- Lecture 29: Generator biased differential, reverse power, stator earth fault.
- Lecture 30: Induction motor protection schemes, thermal, negative sequence, stalling.