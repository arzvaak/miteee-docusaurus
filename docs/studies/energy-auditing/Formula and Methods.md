---
title: "Formula and Methods"
math_syntax: typst
---

# Formula and Methods

> *Consolidated reference of all key formulas, unit conversions, and calculation workflows for ELE 4446.*

---

## Electrical Systems

### Three-Phase Power

$$   P = sqrt(3)   V_L   I_L cos(phi) space ["kW"]   $$

$$   S = sqrt(3)   V_L   I_L space ["kVA"]   $$

$$   Q = sqrt(3)   V_L   I_L sin(phi) space ["kVAR"]   $$

### Power Factor

$$   cos(phi) = frac(P, S) = frac("kW", "kVA")   $$

$$   "kVA"^2 = "kW"^2 + "kVAR"^2   $$

### Capacitor Sizing for PF Correction

$$   Q_c = P(tan(phi)_1 - tan(phi)_2) space ["kVAR"]   $$

Single-phase capacitor:

$$   C = frac(Q_c, 2pi f V^2) space ["F"]   $$

### Energy

$$   E = P times t space ["kWh"] space "(keep kW and hours)"   $$

### Motor Input

$$   P_("in") = frac(P_("out"), eta_m)   $$

---

## Load Curves and Tariffs

### Load Factor

$$   "Load Factor" = frac("Average Load", "Maximum Demand") = frac("kWh", "Maximum kW" times "hours")   $$

### Demand Factor

$$   "Demand Factor" = frac("Maximum Demand", "Connected Load")   $$

### Two-Part Tariff

$$   "Total Cost" = A times "kW" + B times "kWh" space ["Rs"]   $$

---

## Pumps, Fans, and Variable Speed

### Affinity Laws

$$   frac(Q_2, Q_1) = frac(N_2, N_1), space space frac(H_2, H_1) = (frac(N_2, N_1))^2, space space frac(P_2, P_1) = (frac(N_2, N_1))^3   $$

where $Q$ = flow rate, $H$ = head, $P$ = power, $N$ = speed.

### Hydraulic Power

$$   P_h = rho   g   Q   H space ["W"]   $$

> **Unit trap:** Convert m³/hr to m³/s before using this formula. Divide by 3600.

---

## Thermal Systems

### Sensible Heat

$$   Q = m   c_p   (T_2 - T_1) space ["J or kcal"]   $$

### Latent Heat

$$   Q = m   L space ["J or kcal"]   $$

### Total Enthalpy of Wet Steam

$$   h = h_f + x   h_("fg") space ["kJ/kg or kcal/kg"]   $$

where $x$ = dryness fraction.

### Flash Steam

$$   "Flash fraction" = x = frac(h_("f1") - h_("f2"), h_("fg2"))   $$

$$   "Flash steam flow" = "Condensate flow" times x   $$

### Boiler Efficiency (Direct Method)

$$   eta_("boiler") = frac("Heat in steam output", "Heat in fuel input") times 100   $$

### Boiler Efficiency (Indirect / Loss Method)

$$   eta_("boiler") = 100 - sum "Losses (\% of input)"   $$

### Heat Exchanger

$$   Q = U dot A dot Delta T_("lm")   $$

### Log Mean Temperature Difference

$$   Delta T_("lm") = frac(Delta T_1 - Delta T_2, ln(Delta T_1 / Delta T_2))   $$

### Pipe Insulation Heat Loss

$$   q = [10 + frac(T_s - T_a, 20)] times (T_s - T_a) space ["kcal/h·m"^2]   $$

---

## Fuels and Combustion

### Stoichiometric Air (Hydrocarbon Fuel)

$$   "Air (kg/kg fuel)" = frac(11C + 34(H - O/8) + 4.35S, 100 times 0.232)   $$

### Calorific Value Conversion

$$   1 " toe" = 1 times 10^7 " kcal" = 11{,}630 " kWh" = 41{,}868 " MJ"   $$

$$   1 " kWh" = 3{,}600 " kJ"   $$

$$   1 " kcal" = 4.1868 " kJ"   $$

---

## Monitoring and Targeting

### CUSUM

$$   "CUSUM"_t = sum_(i=1)^(t)(E_("actual",i) - E_("expected",i))   $$

### Regression Baseline

$$   E = a + b times P   $$

$$   b = frac(n sum(x y) - sum x sum y, n sum(x^2) - (sum x)^2), space space a = frac(sum y dot sum x^2 - sum x dot sum(x y), n sum (x^2) - (sum x)^2)   $$

---

## Financial Evaluation

### Simple Payback Period

$$   "SPP" = frac("First Cost", "Net Annual Saving") space ["years"]   $$

### Net Present Value

$$   "NPV" = sum_(t=0)^(n) frac("CF"_t, (1+k)^t)   $$

**Decision rule:** Accept if NPV > 0; reject if NPV < 0.

### Internal Rate of Return

Find $k$ such that $"NPV" = 0$ (trial and error / interpolation).

### Return on Investment

$$   "ROI" = frac("Equivalent annual return", "Capital cost") times 100 space [\%]   $$

---

## Cogeneration

### Power-to-Heat Ratio

$$   "P/H ratio" = frac("Electrical output", "Useful heat output")   $$

---

## Building Energy

### Energy Performance Index

$$   "EPI" = frac("Total annual energy consumption (kWh)", "Total conditioned area (m"^2")")   $$

---

## Unit Conversion Quick Reference

| Conversion | Value |
|---|---|
| 1 kWh | 3,600 kJ = 860 kcal |
| 1 MW | 1,000 kW |
| 1 toe | 11,630 kWh = 41,868 MJ |
| 1 boe | ≈ 0.136 toe |
| 1 tonne diesel | 1.01 toe |
| 1 tonne petrol | 1.05 toe |
| 1 m³/hr | 1/3600 m³/s |
| 1 lakh | 100,000 |
| 1 crore | 10,000,000 |

---

## Common Unit Traps

1. **kW vs kWh:** kW is power (instantaneous); kWh is energy (power × time).
2. **m³/hr vs m³/s:** Always convert to m³/s for $rho g Q H$.
3. **Efficiencies as decimals:** Use 0.85 not 85% in substitution.
4. **kVA vs kW:** kVA includes reactive power; kW is real power.
5. **GCV vs NCV:** Boiler calculations typically use GCV; flue gas losses reference NCV.
6. **kcal vs kJ:** 1 kcal = 4.1868 kJ. Mixing units gives wrong answers.
