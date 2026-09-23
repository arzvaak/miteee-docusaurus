---
title: "14 - Biomass Gasification Technologies"
math_syntax: typst
---

# Biomass Gasification Technologies

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


## Gasification vs. Combustion

| Feature | Combustion | Gasification |
| :--- | :--- | :--- |
| Oxygen supply | Excess air (full oxidation) | Limited air/oxygen (partial oxidation) |
| Primary product | Heat (thermal energy) | Syngas (chemical energy) |
| Temperature | 800–1000°C | 800–1000°C (varies by type) |
| Main use | Direct heat, steam generation | Power generation, chemicals |

## The Gasification Process

Four overlapping zones within a gasifier:

1. **Drying** (100–200°C): Moisture evaporated
2. **Pyrolysis (devolatilization)** (200–600°C): Biomass decomposes into volatiles and char in absence of oxygen
3. **Oxidation (combustion)** (900–1200°C): Volatiles and char react with oxygen to produce heat, CO₂, H₂O — the primary heat source
4. **Reduction:** Hot combustion products react with remaining char to form combustible gases:

$"C" + "CO"_2 ↔ 2 "CO" quad (Delta H = +172 "kJ/mol")$

$"C" + "H"_2 "O" ↔ "CO" + "H"_2 quad (Delta H = +131 "kJ/mol")$

$"C" + 2 "H"_2 ↔ "CH"_4 quad (Delta H = -75 "kJ/mol")$

## Classification of Gasifiers

### Fixed-Bed (Moving-Bed) Gasifiers

Biomass forms a packed bed on a grate. Simple, robust, suitable for small to medium scales.

**Updraft (counter-current):** Air enters bottom, passes upward through grate, combustion, reduction, pyrolysis, drying zones. Fuel fed from top moves downward. Tar content very high (30–150 g/Nm³), thermal efficiency high, can handle high-moisture (up to 60%) and high-ash (up to 25%) biomass. Gas exit temperature low (~100–200°C). Not suitable for IC engines without extensive gas cleaning.

**Downdraft (co-current):** Air injected into constricted throat. Both gas and fuel move downward. Volatiles pass through hot combustion zone and are cracked. Tar content very low (< 1 g/Nm³), clean gas suitable for IC engines. Combustion zone 900–1200°C. Solid-to-gas conversion up to 75%. Sensitive to fuel particle size and moisture.

**Crossdraft:** Air from side, fuel from top (typically charcoal). Very fast startup (5–10 min), compact, very high combustion zone (> 1500°C). Requires high-quality, low-volatile, low-ash charcoal. Minimal tar cracking. Used for small-scale power (< 50 kW).

### Fluidized-Bed Gasifiers

Biomass particles suspended in upward-flowing gasifying medium, creating well-mixed, turbulent bed with uniform temperature. Suitable for larger scales and diverse feedstocks.

**Bubbling fluidized bed (BFB):** Lower fluidization velocity; bed particles remain in distinct layer. Suitable for medium units (< 25 MWth). Excellent mixing, uniform temperature, fuel flexibility.

**Circulating fluidized bed (CFB):** Higher velocity (3.5–5.5 m/s); solids entrained, separated in cyclone, recirculated. Higher throughput, better carbon conversion, especially suitable for high-volatile biomass. Scalable to 60 MWth.

### Entrained-Flow Gasifiers

Finely ground or liquid fuel fed with oxygen in co-current flow. Very high temperatures (> 1000°C), near-complete carbon conversion. Primarily for coal; less common for biomass due to feedstock preparation and ash slagging issues.

## Comparison of Fixed-Bed Gasifiers

| Parameter | Updraft | Downdraft | Crossdraft |
| :--- | :--- | :--- | :--- |
| Flow | Counter-current | Co-current | Co-current (side air) |
| Tar content | High (30–150 g/Nm³) | Very low (< 1 g/Nm³) | Low (for charcoal) |
| Gas exit temp | Low (~100–200°C) | Medium (~400–600°C) | High |
| Thermal efficiency | High | Medium | Medium |
| Fuel flexibility | High (moisture, ash) | Low (uniform, dry fuel) | Very low (charcoal only) |
| Complexity | Simple | Moderate | Simple |
| Primary use | Heat, chemicals | IC engine power | Small fast-response power |

## Syngas Composition and Applications

Typical air-blown syngas: N₂ 45–55%, CO 15–25%, H₂ 10–20%, CH₄ 1–5%, CO₂ 10–15%, H₂O 5–10%, tars and particulates variable. Low CV: 4–6 MJ/Nm³. Using oxygen or steam produces medium to high CV gas (10–18 MJ/Nm³).

**Tar cleanup:** Cyclones (particulates), wet scrubbers (tars and soluble gases), tar crackers (heat or catalysts like dolomite). IC engines require < 50 mg/Nm³ tar.

**Applications:** IC engines (most common small-to-medium scale); gas turbines and steam turbines in IGCC plants (40–50% efficiency); chemical synthesis (methanol, ammonia, Fischer-Tropsch fuels); hydrogen production via water-gas shift reaction.

## Performance Metrics

**Cold Gas Efficiency (CGE):**

$"CGE" = ("Mass flow of syngas" times "CV of syngas") / ("Mass flow of fuel" times "CV of fuel") times 100%$

Typical CGE: 60–75%.

**Equivalence Ratio (ER):** Actual air supplied to stoichiometric air required for complete combustion. For gasification, ER is typically 0.2–0.4.

## Worked Example

**Problem:** Biogas gasifier runs a dual-fuel CI engine with 76% diesel replacement. Biomass feed rate 320 kg/h, gasifier efficiency 0.65, biomass CV 16,800 kJ/kg, engine efficiency 45%. Calculate engine power.

$dot(E)_"in" = 320 times 16800 = 5,376,000$ kJ/h

$dot(E)_"syngas" = 5,376,000 times 0.65 = 3,494,400$ kJ/h

$dot(W)_"out" = 3,494,400 times 0.45 = 1,572,480$ kJ/h

$P = 1,572,480 / 3600 = 436.8$ kW

## Revision Checklist

- [ ] Compare gasification and combustion
- [ ] Describe the four zones of the gasification process
- [ ] Explain updraft, downdraft, and crossdraft gasifier working
- [ ] Compare fixed-bed gasifier types
- [ ] Describe BFB and CFB fluidized-bed gasifiers
- [ ] State typical syngas composition and applications
- [ ] Calculate CGE and engine power from gasifier parameters
