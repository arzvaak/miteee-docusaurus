---
title: "Quick Revision"
math_syntax: typst
---

# Week 1 — Quick Revision

## Week 1 Revision Sheet: Fundamentals of Protective Relaying

### Key Formulas & Calculations
1.  **Insulator Disc Count:** $N = ceil((V_L / (sqrt(3) times V_r)) times S_f)$
    - $V_L$: Line voltage (kV), $V_r$: Voltage per disc (kV, typically 11), $S_f$: Safety factor (typically 1.5). Always round up.
    - *Example:* 220 kV line: $N = ceil((220/(sqrt(3) times 11)) times 1.5) = ceil(17.32) = 18$.

2.  **CT VA Burden:** $"VA"_"burden" = I_"sec"^2 times Z_"total"$
    - $I_("sec")$: CT secondary current (A), $Z_("total")$: Total secondary circuit impedance (Ω).

3.  **Fault Clearing Time (cycles):** $T_("clear") = T_("relay")("ms") / 20 + T_("CB")("cycles")$
    - For 50 Hz: 1 cycle = 20 ms. Typical modern relay: 10-30 ms (0.5-1.5 cycles). Typical CB: 2.5-3.5 cycles. Target: ~4 cycles total.

### Critical Definitions & Distinctions
- **Selectivity vs. Discrimination:** Selectivity = *which* device operates (isolate faulty section). Discrimination = *what condition* it operates for (fault vs. overload/inrush).
- **Relay Sensitivity vs. CT Burden:** Sensitivity = *minimum* VA to operate relay (lower = better). Burden = *power drawn* by relay during operation.
- **Dependability vs. Security:** Dependability = certainty of operation for in-zone fault. Security = certainty of *not* operating for out-of-zone fault.
- **Transient vs. Permanent Faults:** Transient = temporary (e.g., arc flashover), clears itself. Permanent = requires isolation and repair.
- **Thermal vs. Electrodynamic Damage:** Thermal = from moderate, sustained overcurrent ($I^2 R t$). Electrodynamic = from very high fault currents (10-20× rated), causing mechanical stress.

### Common Traps & Mistakes
- **Insulator Calculation:** Using line voltage ($V_L$) instead of phase voltage ($V_P = V_L/sqrt(3)$). Forgetting the safety factor or rounding down.
- **Sensitivity:** Confusing low VA sensitivity (good) with high VA sensitivity (bad). Thinking sensitivity = burden.
- **Backup Protection:** Mixing up relay backup (duplicate relays), breaker backup (trip all bus breakers), and remote backup (trip source-side relay).
- **Relay Functions:** Attributing circuit breaker functions (arc quenching, limiting current) to the relay. The relay only senses and sends a trip signal.
- **Thermal Relay:** Using it for short-circuit protection (too slow) or assuming its characteristic should be above the equipment's withstand curve (dangerous).

### Key Statistics & Values (Memorize)
- **Fault Probability:** Overhead lines (50%), Transformers (15-20%), Switchgear (10-15%), Cables (10%).
- **Fault Type Probability (Overhead):** Line-to-ground (80-90%), Line-to-line (6-10%), Double line-to-ground (3-6%), Triple-line (≤1%).
- **Protection System Cost:** Should not exceed 5-10% of equipment cost.
- **Modern Digital Relay Time:** 10-30 ms.
- **Electromechanical Relay Burden:** 60-80 W (high). Microprocessor Burden: 1-5 VA (low).

### Conceptual Highlights
- **Zones of Protection:** Must overlap (via CT placement) to avoid blind spots. Any fault point must be in at least one zone.
- **Relay Evolution:** Electromechanical (rugged, high burden) → Static (low burden, precise) → Microprocessor (self-test, communication) → Numerical (math functions) → IED (integrated protection, control, monitoring).
- **Thermal Relay Principle:** Matches equipment's thermal withstand curve. Uses bimetallic strip. Modern digital relays simulate this with fast reset.
- **Induction Relay Torque:** $T prop phi_(1 max) phi_(2 max) sin theta$. Max torque at $theta = 90°$. For single quantity (current), $T prop I^2$.