---
title: "17 - Ocean Thermal Energy Conversion (OTEC)"
math_syntax: typst
---

# Ocean Thermal Energy Conversion (OTEC)

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


## Fundamental Principle

The ocean absorbs vast solar radiation, creating a temperature difference between warm surface water (~25°C in tropical regions) and cold deep water (~5°C at 1000 m depth). This thermal gradient drives a heat engine to generate electricity via the **Rankine cycle**.

The theoretical maximum (Carnot) efficiency:

$eta_"Carnot" = 1 - T_"cold" / T_"hot"$

For $T_"hot" = 298$ K and $T_"cold" = 278$ K: $eta_"Carnot" = 1 - 278/298 ≈ 0.067$ or 6.7%. Actual OTEC efficiencies are much lower, typically 2–3%, due to irreversibilities and pumping power.

## Closed-Cycle (Anderson Cycle)

Uses a **low-boiling-point working fluid** (ammonia, propane, Freon R-12/R-22) in a closed loop.

**Working:**
1. Warm surface water (~25°C) pumped through evaporator, boiling the working fluid at high pressure
2. High-pressure vapour expands through turbine, driving generator
3. Low-pressure vapour condensed in condenser using cold deep water (~5°C) pumped from 1000 m+ depth
4. Condensed liquid pumped back to evaporator

**Key features:** Working fluid evaporates at ~25°C (no vacuum pump needed for evaporator); turbine operates at relatively high pressures (compact design — 1 MW ammonia turbine diameter ~1.1 m); overall efficiency 2–3%.

## Open-Cycle (Claude Cycle)

**Warm seawater itself is the working fluid**, flash-evaporated under vacuum.

**Working:**
1. Warm surface water passed through deaerator (remove dissolved gases), then into flash evaporator at high vacuum (~0.02 bar); water boils at low temperature
2. Low-pressure steam expands through specially designed low-pressure turbine
3. Exhaust steam condensed in direct-contact condenser using cold deep water
4. By-product: **desalinated fresh water** from condensed steam

**Key features:** Eliminates surface heat exchanger (evaporator). Turbine must handle huge volume at very low pressure — very large diameter turbine (~12 m for 1 MW). Requires massive vacuum pumps.

## Hybrid Cycle

Combines advantages of both cycles:

1. Warm surface water flash-evaporated (open cycle part)
2. Latent heat of steam boils secondary working fluid (ammonia) in heat exchanger
3. Ammonia vapour drives turbine-generator (closed Rankine cycle)

**Advantage:** Avoids massive low-pressure steam turbine (from open) and large surface heat exchanger for direct seawater boiling (from closed). Can also produce fresh water.

## Performance Analysis

### Net Power Output

$P_"net" = P_"gross" - P_"pumps" - P_"auxiliary"$

Approximately 30% of gross power is consumed for seawater pumping alone.

### Bio-fouling

Marine microorganisms (barnacles, algae) deposit on heat exchanger surfaces, creating an insulating layer that reduces heat transfer efficiency and increases pressure drops. Mitigation: periodic cleaning and anti-fouling coatings/materials (e.g., titanium).

### Site Selection

- Large, stable temperature differential ($Delta T >= 20°C$) year-round
- Proximity to steep continental shelf for cold deep water access
- Calm sea conditions
- Distance from shipping lanes and fishing grounds

## Advantages and Disadvantages

| Feature | Advantages | Disadvantages |
| :--- | :--- | :--- |
| Energy source | Renewable, clean | Very low efficiency (2–3%) |
| Availability | Steady, predictable | High capital cost |
| Land use | Floating offshore; no land needed | Plant size limited (~100 MW) |
| By-products | Open/hybrid produce fresh water | ~30% of power used for pumping |
| Environmental | Nutrient-rich deep water for aquaculture | Corrosive seawater; harsh marine conditions |

## Applications

1. Electricity generation (primary)
2. Desalination (open and hybrid cycles)
3. Aquaculture and mariculture
4. Sea Water Air Conditioning (SWAC) using cold deep water
5. Chemical production

## Development in India

The **National Institute of Ocean Technology (NIOT)** is implementing a **1 MW floating OTEC demonstration project** off Tuticorin, Tamil Nadu, with a 1 km cold water pipe deployed to 1.2 km depth.

## Revision Checklist

- [ ] Explain OTEC operating principle and Carnot efficiency calculation
- [ ] Describe closed-cycle (Anderson) OTEC working with diagram
- [ ] Describe open-cycle (Claude) OTEC working with diagram
- [ ] Explain how the hybrid cycle overcomes drawbacks of the other two
- [ ] Define bio-fouling and its impact
- [ ] State OTEC site selection criteria
- [ ] Compare the three OTEC cycle types
