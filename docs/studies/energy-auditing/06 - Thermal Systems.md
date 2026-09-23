---
title: "06 - Thermal Systems"
math_syntax: typst
---

# 06 — Thermal Systems

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


> *Covers L16 (Fuels and Combustion), L17 (Steam Systems), L18 (Boilers and Furnaces), L19 (Heat Exchangers), and L20 (Cogeneration)*

---

## 6.1 Fuels and Combustion

### Fuel Classification

| Type | Examples |
|---|---|
| **Solid** | Coal, lignite, biomass, charcoal |
| **Liquid** | Diesel, furnace oil, LSHS, naphtha |
| **Gaseous** | Natural gas, LPG, biogas, producer gas |

### Key Fuel Properties

| Property | Definition |
|---|---|
| **Gross Calorific Value (GCV)** | Total heat released per unit mass of fuel when water vapour in products is condensed |
| **Net Calorific Value (NCV)** | GCV minus latent heat of water vapour in flue gas |
| **Moisture content** | Water present in the fuel |
| **Ash content** | Non-combustible mineral residue |
| **Volatile matter** | Components that vaporize during heating |
| **Fixed carbon** | Carbon that remains after volatile matter is driven off |

### Stoichiometric Air Requirement

For complete combustion of a hydrocarbon fuel:

$$   "Air (kg/kg fuel)" = frac(11C + 34(H - O/8) + 4.35S, 100 times 0.232)   $$

where $C$, $H$, $O$, $S$ are percentages by weight of carbon, hydrogen, oxygen, and sulphur.

### Worked Example

Liquid fuel: C = 85.9%, H = 12%, O = 0.7%, N = 0.5%, S = 0.5%, H₂O = 0.35%, Ash = 0.05%.

$$   "O"_2 " required" = frac(85.9, 12) times 32 + frac(12, 4) times 32 + frac(0.5, 32) times 32 - frac(0.7, 32) times 32   $$

$$   = 229.07 + 96 + 0.5 - 0.7 = 324.87 " per 100 kg fuel"   $$

$$   "Air" = frac(324.87, 0.232) = 1{,}400 " kg air / 100 kg fuel" = 14.0 " kg/kg fuel"   $$

(Stated answer: 14.12 kg of air/kg of fuel.)

### Excess Air

- Combustion requires **theoretical air** (stoichiometric).
- In practice, **excess air** (10–30%) is supplied to ensure complete combustion.
- Too much excess air wastes energy (heats unused nitrogen).
- Too little excess air causes incomplete combustion (CO, soot).

### Flue Gas Analysis

| Gas | Ideal | Indicates |
|---|---|---|
| O₂ | ~0% (stoichiometric) | Excess air level |
| CO₂ | Maximum possible | Good combustion |
| CO | 0 | Incomplete combustion |
| NOₓ | — | High-temperature combustion |

---

## 6.2 Steam Systems

### Steam Properties

| Property | Symbol | Units |
|---|---|---|
| Sensible heat | $h_f$ | kJ/kg or kcal/kg |
| Latent heat | $h_("fg")$ | kJ/kg or kcal/kg |
| Superheat | $h_("sup") - h_f$ | kJ/kg or kcal/kg |
| Total enthalpy | $h = h_f + x dot h_("fg")$ | kJ/kg or kcal/kg |

where $x$ = quality (dryness fraction) of steam.

### Flash Steam Recovery

When high-pressure condensate is released to a lower pressure, a portion flashes to steam.

$$   "Flash fraction" = x = frac(h_("f1") - h_("f2"), h_("fg2"))   $$

where $h_("f1")$ = sensible heat at high pressure, $h_("f2")$ = sensible heat at low pressure, $h_("fg2")$ = latent heat at low pressure.

### Worked Example

Condensate at 10 kg/cm²g flashed to 2 kg/cm²g. Flow rate = 1,000 kg/hr.

- $h_("f1") = 185$ kcal/kg, $h_("f2") = 133$ kcal/kg, $h_("fg2") = 650$ kcal/kg.

$$   \% " flash steam" = frac(185 - 133, 650) = frac(52, 650) = 8\%   $$

$$   "Flash steam flow" = 1{,}000 times 0.08 = 80 " kg/hr"   $$

### Steam Traps

Devices that discharge condensate and non-condensable gases while preventing live steam from escaping. Types:

1. **Mechanical** — float and inverted bucket.
2. **Thermodynamic** — disc type.
3. **Thermostatic** — bellows and bimetallic.

### Steam Pipe Insulation

Heat loss from an uninsulated pipe:

$$   q = [10 + frac(T_s - T_a, 20)] times (T_s - T_a) " kcal/h·m"^2   $$

where $T_s$ = surface temperature and $T_a$ = ambient temperature.

---

## 6.3 Boilers and Furnaces

### Boiler Efficiency

$$   eta_("boiler") = frac("Heat in steam output", "Heat in fuel input") times 100   $$

Or using the indirect (loss) method:

$$   eta_("boiler") = 100 - ("Sum of all losses as \% of input")   $$

**Major losses:**
1. Dry flue gas loss (typically the largest)
2. Moisture in fuel
3. Moisture in air
4. Hydrogen in fuel
5. Moisture in wet fuel
6. Radiation and convection losses
7. Unburnt fuel (CO, soot)

### Worked Example: Boiler Efficiency

- Steam output: 20 tonnes/hr at 10 bar, 0.95 dryness fraction.
- Fuel: coal, GCV 5,000 kcal/kg, consumption 3,200 kg/hr.
- Feed water temperature: 80 °C.

From steam tables at 10 bar: $h_f = 182.5$ kcal/kg, $h_("fg") = 482.3$ kcal/kg.

$$   "Enthalpy of steam" = 182.5 + 0.95 times 482.3 = 640.7 " kcal/kg"   $$

$$   "Heat in steam" = 20{,}000 times (640.7 - 80) = 20{,}000 times 560.7 = 11{,}214{,}000 " kcal/hr"   $$

$$   "Heat in fuel" = 3{,}200 times 5{,}000 = 16{,}000{,}000 " kcal/hr"   $$

$$   eta_("boiler") = frac(11{,}214{,}000, 16{,}000{,}000) times 100 = 70.1\%   $$

### Furnace Efficiency

$$   eta_("furnace") = frac("Heat absorbed by charge", "Heat released by fuel") times 100   $$

Key losses: flue gas, wall losses, opening losses, heat storage in walls and fixtures.

---

## 6.4 Heat Exchangers

### General Heat Transfer Equation

$$   Q = U dot A dot Delta T_("lm")   $$

where:
- $Q$ = heat transfer rate (W or kcal/hr)
- $U$ = overall heat transfer coefficient (W/m²·K or kcal/hr·m²·°C)
- $A$ = heat transfer area (m²)
- $Delta T_("lm")$ = log mean temperature difference

### Log Mean Temperature Difference (LMTD)

For a counterflow heat exchanger:

$$   Delta T_("lm") = frac(Delta T_1 - Delta T_2, ln(Delta T_1 / Delta T_2))   $$

where $Delta T_1$ and $Delta T_2$ are the temperature differences at the two ends.

> **Special case:** When $Delta T_1 = Delta T_2$, $Delta T_("lm") = Delta T_1$ (use the arithmetic mean to avoid 0/0).

### Heat Exchanger Types

| Type | Application |
|---|---|
| **Shell and tube** | Most common; wide range of pressures and temperatures |
| **Plate** | Compact; high U value; easy maintenance |
| **Air-cooled** | When cooling water is scarce |
| **Finned tube** | Gas-to-liquid heat transfer |

### Fouling

- Deposits on heat transfer surfaces reduce $U$.
- Regular cleaning and water treatment maintain performance.
- Fouling factor: $R_f = 1/U_("dirty") - 1/U_("clean")$.

---

## 6.5 Cogeneration (CHP)

### Definition

**Cogeneration** (Combined Heat and Power, CHP) is the simultaneous generation of **electricity** and **useful heat** from the same fuel source.

### Why Cogenerate?

- Conventional power plants waste 60–65% of fuel energy as heat.
- CHP captures this waste heat for process heating, space heating, or cooling.
- Overall efficiency of CHP: **70–85%** vs 33–40% for separate generation.

### CHP Configurations

| Configuration | Description |
|---|---|
| **Back-pressure turbine** | Steam expanded through turbine exhausts at process pressure |
| **Extraction condensing** | Steam extracted at intermediate pressure for process |
| **Gas turbine + HRSG** | Exhaust heat from gas turbine generates steam |
| **Internal combustion engine** | Engine coolant and exhaust heat recovered |

### Key Metric

$$   "Power-to-heat ratio" = frac("Electrical output", "Useful heat output")   $$

---

## Revision Checklist

- [ ] Fuel classification and properties (GCV, NCV, proximate/ultimate analysis)
- [ ] Stoichiometric air calculation
- [ ] Excess air — why and how much
- [ ] Flue gas analysis interpretation
- [ ] Flash steam formula and worked example
- [ ] Steam trap types
- [ ] Boiler efficiency — direct and indirect methods
- [ ] Heat exchanger equation and LMTD
- [ ] Cogeneration concept and efficiency advantage
- [ ] Pipe insulation heat loss formula
