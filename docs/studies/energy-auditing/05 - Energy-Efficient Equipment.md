---
title: "05 - Energy-Efficient Equipment"
math_syntax: typst
---

# 05 — Energy-Efficient Equipment

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


> *Covers L11 (Electric Motors and VSD), L12 (Fans and Pumps), L13 (Lighting Systems), L14 (Daylighting Strategies), and L15 (HVAC Systems)*

---

## 5.1 Electric Motors

### Significance

- Electric motors account for **two-thirds of all electricity** used in industry.
- The opportunity for savings rests primarily in their **selection and use**.
- When a motor has a higher rating than required, it operates at **part load** with **reduced efficiency**.
- **Replacement** of underloaded motors with smaller motors allows a fully loaded smaller motor to operate at **higher efficiency**.

### Key Parameters

| Parameter | Significance |
|---|---|
| Efficiency | Ratio of mechanical output to electrical input |
| Power factor | Ratio of real to apparent power; important for tariff |
| Rated voltage | Must match supply voltage for optimal performance |
| Rated speed | Directly related to the driven load requirements |

### Energy Savings from Motor Selection

- **Appropriate sizing** is critical — oversized motors waste energy.
- A fully loaded small motor is more efficient than an underloaded large motor.
- Motor nameplate data: kW rating, voltage, current, speed, efficiency, power factor.

### Variable-Speed Drives (VSD)

- VSDs adjust motor speed to match the actual load demand.
- For variable-torque loads (fans, pumps), speed reduction yields **cubic power savings** (affinity laws).
- VSDs are the single most effective energy-saving measure for motor-driven systems with variable demand.

---

## 5.2 Fans and Pumps

### Fans

- Centrifugal fans are the most common type, imparting energy to air by centrifugal force.
- Fan types: **backward-curved** (highest efficiency), **forward-curved**, **radial**.
- Fan laws (at constant density):

$$   frac(Q_2, Q_1) = frac(N_2, N_1), space space frac(H_2, H_1) = (frac(N_2, N_1))^2, space space frac(P_2, P_1) = (frac(N_2, N_1))^3   $$

where $Q$ = flow rate, $H$ = head (pressure), $P$ = power, $N$ = speed.

### Pumps

- Centrifugal pumps are driven by AC induction motors.
- Pump affinity laws are identical to fan laws (above).
- **Hydraulic power:**

$$   P_h = rho g Q H   $$

where $rho$ = fluid density (kg/m³), $g$ = 9.81 m/s², $Q$ = flow rate (m³/s), $H$ = head (m).

> **Unit trap:** Convert m³/hr to m³/s before using $rho g Q H$. Divide by 3600.

### Control Methods

| Method | Efficiency | Cost |
|---|---|---|
| **Throttling valve / outlet damper** | Low — wastes energy across the restriction | Low capital |
| **VSD (variable-speed drive)** | High — reduces motor speed to match demand | Higher capital, lower operating cost |
| **Inlet vane control** | Moderate | Moderate |

### Worked Example: Affinity Laws

A pump speed is reduced by 20% (to 80% of original).

$$   Q_2 = 0.80   Q_1, space space H_2 = 0.80^2   H_1 = 0.64   H_1, space space P_2 = 0.80^3   P_1 = 0.512   P_1   $$

Power drops to about 51% — a nearly **49% energy saving** from a 20% speed reduction.

---

## 5.3 Lighting Systems

### Definition

A lighting scheme is **energy efficient** when the required illuminance is provided on the working plane by consuming the **least amount of energy**.

### Global Context

- 25% of the global population relies on kerosene fuel for lighting.
- Service sector: 45%, Residential: 25%, Roads: 10% of lighting energy.
- LED lighting is cost-effective and reduces carbon emissions.
- DSM through lighting: UJALA distributed 37 crore LED lamps, saving 9,528 MW peak demand.

### Lighting Power Density

Guided by:
1. **Lighting Power Density (W/m²)** — total lighting power per unit area.
2. Integration of artificial lighting with **daylight**.
3. **Lighting controls** — occupancy sensors, timers, dimming.

### Lamp Comparison

| Lamp Type | Efficacy (lm/W) | Lifetime (hrs) | CRI |
|---|---|---|---|
| Incandescent | 10–17 | 1,000 | 100 |
| Fluorescent (T8/T12) | 60–100 | 10,000–20,000 | 60–80 |
| CFL | 50–70 | 8,000–10,000 | 80+ |
| LED | 80–160 | 25,000–50,000 | 70–90 |
| Metal halide | 75–100 | 6,000–10,000 | 65–75 |

### Worked Example: Street Lighting Retrofit

**Existing:** 40 fluorescent (T12) fixtures, 52 W each (40W lamp + 12W ballast), 12 hrs/night, 365 days/year.

**Proposed:** Replace with LED fixtures of equivalent illuminance.

- Existing power: $40 times 52 = 2{,}080$ W
- Annual energy: $2.08 " kW" times 12 times 365 = 9{,}110$ kWh
- LED replacement (e.g., 20W each): $40 times 20 = 800$ W
- Annual LED energy: $0.80 " kW" times 12 times 365 = 3{,}504$ kWh
- **Annual saving:** $9{,}110 - 3{,}504 = 5{,}606$ kWh (61.5% reduction)

---

## 5.4 Daylighting Strategies

### Principles

- Use natural daylight to reduce artificial lighting energy.
- **Light shelves**, **skylights**, **light tubes**, and **clerestory windows** redirect daylight deep into buildings.
- **Daylight-responsive controls** dim or switch off artificial lights when daylight is sufficient.

### Key Metrics

- **Daylight factor** = ratio of indoor to outdoor illuminance (%).
- Target: daylight factor > 2% for visual comfort.
- Glare control is essential — direct sunlight causes discomfort.

### Benefits

- Reduces lighting energy by 30–60% in well-designed buildings.
- Improves occupant well-being and productivity.
- Reduces cooling load (indirectly, if glare is controlled).

---

## 5.5 HVAC Systems

### Overview

HVAC = Heating, Ventilation, and Air Conditioning. HVAC systems are major energy consumers in commercial buildings (≈30% of electricity).

### Key Components

1. **Chiller** — produces chilled water for cooling.
2. **Cooling tower** — rejects heat to the atmosphere.
3. **Air handling unit (AHU)** — conditions and distributes air.
4. **Pumps and fans** — circulate chilled water and air.
5. **Controls** — thermostats, Building Management Systems (BMS).

### Energy Efficiency Measures

| Measure | Description |
|---|---|
| **Chiller optimization** | Operate at optimal loading; stage chillers appropriately |
| **Variable-speed drives** on pumps and fans | Match flow to demand |
| **Economizer cycles** | Use outside air for free cooling when conditions permit |
| **Regular maintenance** | Clean coils, check refrigerant charge, maintain filters |
| **Thermal storage** | Make ice or chilled water at night (off-peak) for daytime use |
| **Building envelope** | Insulation, glazing, shading reduce cooling load |

### Chiller Performance

Coefficient of Performance (COP):

$$   "COP" = frac("Cooling effect", "Work input") = frac(Q_("evaporator"), W_("compressor"))   $$

- Higher COP = more efficient chiller.
- Typical values: air-cooled 2.5–3.5; water-cooled 4.5–6.5.

---

## Revision Checklist

- [ ] Motor efficiency and sizing importance
- [ ] VSD energy savings concept
- [ ] Fan and pump affinity laws ($Q prop N$, $H prop N^2$, $P prop N^3$)
- [ ] Hydraulic power formula $P_h = rho g Q H$ (unit conversion trap)
- [ ] Throttling vs VSD control comparison
- [ ] Lighting efficacy comparison (lamp types)
- [ ] LED advantages for DSM
- [ ] Lighting Power Density concept
- [ ] Daylighting strategies and daylight factor
- [ ] HVAC components and energy efficiency measures
- [ ] COP definition for chillers
