---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

> *Condensed notes for final review. One page per major topic area.*

---

## Energy Audit Definition (Memorize)

**Statutory (EC Act 2001):** Verification, monitoring and analysis of use of energy including submission of technical report containing recommendations for improving energy efficiency with cost benefit analysis.

**Preliminary audit:** Quick walk-through, 1–2 days, low cost, immediate recommendations.

**Detailed audit:** 10-step methodology, comprehensive, involves monitoring, measurement, material/energy balance.

---

## Key Numbers

| Item | Value |
|---|---|
| 1 toe | 11,630 kWh = 41,868 MJ = $10^7$ kcal |
| 1 boe | ≈ 0.136 toe |
| 1 tonne diesel | 1.01 toe |
| 1 tonne petrol | 1.05 toe |
| Thermal power plant efficiency | 39% |
| Global energy growth rate | 2.4%/year |
| Fossil fuel share of primary energy | >85% |
| Coal share of global electricity | 33% |
| Lighting in commercial buildings | 60% |
| HVAC in commercial buildings | 30% |
| Commercial building electricity growth | 9–10%/year |
| Motors' share of industrial electricity | ⅔ |
| NAPCC missions | 8 |

---

## Formula Cheat Sheet

### Electrical

- Three-phase power: $P = sqrt(3) V_L I_L cos(phi)$
- PF correction: $Q_c = P(tan(phi)_1 - tan(phi)_2)$ kVAR
- Energy: $E = P times t$ (kW × h = kWh)
- Motor input: $P_("in") = P_("out")/eta$

### Load / Tariff

- Load factor = Average load / Maximum demand
- Demand factor = Maximum demand / Connected load
- Two-part tariff: Cost = $A("kW") + B("kWh")$

### Fans / Pumps

- $Q prop N$, $H prop N^2$, $P prop N^3$
- $P_h = rho g Q H$ (convert m³/hr to m³/s!)

### Thermal

- Sensible heat: $Q = m c_p Delta T$
- Enthalpy: $h = h_f + x dot h_("fg")$
- Flash fraction: $x = (h_("f1") - h_("f2"))/h_("fg2")$
- Boiler efficiency: $eta = frac("Heat in steam", "Heat in fuel") times 100$
- Heat exchanger: $Q = U A Delta T_("lm")$
- LMTD: $Delta T_("lm") = (Delta T_1 - Delta T_2)/ln(Delta T_1/Delta T_2)$
- Pipe loss: $q = [10 + (T_s-T_a)/20] times (T_s-T_a)$

### Monitoring & Targeting

- CUSUM = $sum(E_("actual") - E_("expected"))$; negative = saving
- Regression: $E = a + b P$

### Financial

- SPP = Investment / Net Annual Saving
- NPV $= sum "CF"_t/(1+k)^t$; accept if > 0
- IRR: rate where NPV = 0

---

## High-Priority Exam Topics

1. **EC Act 2001** — objectives, thrust areas, DC obligations and sectors.
2. **Detailed audit** — ten steps.
3. **M&T** — six steps, CUSUM calculation, regression baselines.
4. **Target setting** — four levels (Theoretical → Actual).
5. **PF correction** — capacitor sizing with worked examples.
6. **Tariffs** — types, two-part tariff bill calculation.
7. **DSM** — definition, objectives, DSM vs supply-side.
8. **Motor efficiency** — sizing, VSD savings.
9. **Affinity laws** — all three, with numerical application.
10. **Boiler efficiency** — direct and indirect methods.
11. **Flash steam** — formula and calculation.
12. **Heat exchangers** — LMTD for counterflow.
13. **NPV and IRR** — formula, decision rule, trial-and-error bracketing.
14. **ESCOs** — performance contracting, seven components.

---

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---|---|
| Using gross saving in payback | Always use **net** annual saving (gross − O&M) |
| Forgetting to convert m³/hr to m³/s | Divide by 3600 before $rho g Q H$ |
| Using % in formulas instead of decimals | 0.85 not 85% in substitution |
| Confusing kW with kWh | kW = power (instantaneous); kWh = energy (power × time) |
| Confusing kVA with kW | kVA includes reactive power; kW is real power |
| Using GCV where NCV is needed (or vice versa) | Check which the formula expects |
| Reversing CUSUM sign convention | Negative CUSUM = saving (actual < expected) |
| Mixing kcal and kJ | 1 kcal = 4.1868 kJ — be consistent |
| Assuming 1 boe = 1 toe | 1 boe ≈ 0.136 toe |
| Forgetting cost-benefit analysis in audit definition | Four elements: verification, monitoring, analysis, **report with CBA** |
