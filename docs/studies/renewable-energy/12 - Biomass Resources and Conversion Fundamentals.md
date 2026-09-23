---
title: "12 - Biomass Resources and Conversion Fundamentals"
math_syntax: typst
---

# Biomass Resources and Conversion Fundamentals

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


## Introduction to Biomass

**Biomass** is any organic material derived from living or recently living organisms — plants, animals, and their waste products. It is renewable because it can be replenished on a human timescale. In India, biomass provides approximately 32% of primary energy use, with over 10,000 MW installed capacity in biomass power and cogeneration.

### Classification of Biomass Sources

| Category | Examples | Typical Moisture |
| :--- | :--- | :--- |
| Wood & forest residues | Wood chips, sawdust, bark | 20–60% |
| Agricultural residues | Rice husk, wheat straw, bagasse | 10–50% |
| Energy crops | Willow, poplar, miscanthus, switchgrass | 15–40% |
| Animal wastes | Cattle dung, poultry litter | 70–90% |
| Municipal & industrial wastes | Sewage sludge, food processing waste | 60–80% |
| Aquatic biomass | Algae, water hyacinth, kelp | > 90% |

### Energy Plantation

Cultivating plants specifically for fuel value by capturing solar radiation. Fast-growing trees, sugar/starch/oil plants, and aquatic farms are common candidates.

**Advantages:** No storage losses; ash is nutrient-rich manure; converts semi-barren land to green belts; carbon-neutral (growth absorbs CO₂); practically nil SO₂ pollution.

**Disadvantages:** Requires large land areas (typical yield 10–20 tonnes/acre/year); competes with food production; seasonal availability and logistics challenges.

**Common species:** Casuarina, eucalyptus, sugarcane, corn, jatropha, sorghum.

## Biomass Conversion Processes

### Thermo-chemical Conversion

**Combustion:** Complete exothermic oxidation in excess air, producing heat, at 800–1000°C. Suitable for dry biomass (< 50% moisture). Stand-alone plants achieve 25–30% electrical efficiency; advanced fluid bed systems reach 30–40%.

**Pyrolysis:** Thermal decomposition in the **absence of oxygen** at ~500°C, producing bio-oil, charcoal (bio-char), and gas.

| Type | Heating Rate | Residence Time | Primary Product |
| :--- | :--- | :--- | :--- |
| Slow/conventional | Low (< 10°C/s) | Hours to days | Charcoal (~35% char) |
| Fast | High (> 100°C/s) | Seconds | Bio-oil (60%), char (20%), gas (20%) |
| Flash | Very high (> 1000°C/s) | < 0.5 s | Bio-oil (up to 80%) |

**Gasification:** Converts biomass into combustible producer gas/syngas (CO, H₂, CH₄) by partial oxidation at 800–1000°C. Low CV gas (air-blown): 4–6 MJ/Nm³. Medium CV gas (oxygen-blown): 10–15 MJ/Nm³. BIG/CC systems can achieve 40–50% efficiency for 30–60 MW plants.

**Liquefaction:** Direct liquefaction at low temperatures (250–350°C) and high pressures (100–200 bar) with hydrogen and catalysts, producing bio-crude with higher H/C ratio and lower oxygen content than pyrolysis oil.

### Biochemical Conversion

**Anaerobic digestion (AD):** Decomposition by microorganisms in the absence of oxygen, producing biogas (~65% CH₄, ~35% CO₂, trace H₂S). Suitable for wet organic wastes (80–90% moisture). Energy yield: 20–40% of feedstock LHV.

**Fermentation:** Microorganisms convert sugars into ethanol and CO₂:

$"C"_6 "H"_12 "O"_6 →("Yeast") 2 "C"_2 "H"_5 "OH" + 2 "CO"_2$

Applications: automotive fuel (E10, E85), industrial solvent. Spent residue (e.g., bagasse) can be used as cattle feed or fuel.

## Biogas Plant Design

### Plant Types

| Type | Key Feature | Advantages | Disadvantages |
| :--- | :--- | :--- | :--- |
| Fixed dome | Gas in fixed rigid dome | Inexpensive, no moving parts | Variable pressure, needs strong masonry |
| Floating drum | Inverted steel drum on slurry | Constant pressure, easy to understand | Steel rusts, higher maintenance/cost |
| Continuous | Fresh slurry added, spent removed continuously | Steady gas production | Requires careful management |
| Batch | Fill, seal (35–45 days), empty | Simple operation | Intermittent gas, needs multiple digesters |

### Design Equations

**Biogas volume:** $V_b = C dot m_o$ where $C$ is biogas yield (0.2–0.4 m³/kg dry input) and $m_o$ is dry input mass per day.

**Fluid volume:** $V_f = m_o / rho_m$ where $rho_m$ is dry material density in fluid (~50 kg/m³).

**Digester volume:** $V_d = V_f dot t_r$ where $t_r$ is retention period (8–50 days).

**Energy available:** $E = eta dot H_m dot F_m dot V_b$ where $eta$ is device efficiency, $H_m$ is methane calorific value (~28 MJ/m³), and $F_m$ is methane fraction (~0.65–0.7).

### Worked Example

**Problem:** Family biogas digester for 5 cows. Retention time 20 days, dry matter 2 kg/cow/day, biogas yield 0.24 m³/kg, burner efficiency 60%, methane proportion 0.8, methane CV 28 MJ/m³, slurry density 50 kg/m³.

$m_o = 5 times 2 = 10$ kg/day

$V_b = 0.24 times 10 = 2.4$ m³/day

$E = 0.60 times 28 times 0.8 times 2.4 = 32.26$ MJ/day $= 8.96$ kWh/day

$V_f = 10 / 50 = 0.2$ m³/day

$V_d = 0.2 times 20 = 4.0$ m³

**Answer:** Digester volume 4.0 m³, providing approximately 8.96 kWh/day.

## Carbon Neutrality

Biomass is often considered carbon-neutral because CO₂ released during combustion was recently absorbed by plants during photosynthesis. However, true carbon neutrality requires accounting for the entire life cycle: cultivation, harvesting, transportation, and processing emissions.

## Advantages and Limitations

| Advantages | Limitations |
| :--- | :--- |
| Renewable and potentially carbon-neutral | Low energy density vs. fossil fuels |
| Reduces waste (agricultural, municipal) | Large land and water requirements for energy crops |
| Provides baseload power | Can compete with food production |
| Supports rural economies | Collection, transport, and storage logistics |
| Versatile: heat, power, liquid fuels | Potential air pollution if not combusted efficiently |
| Nutrient-rich residues as fertilizer | Sustainability depends on responsible sourcing |

## Revision Checklist

- [ ] Classify biomass sources by category
- [ ] Explain energy plantation advantages and limitations
- [ ] Compare combustion, pyrolysis, gasification, and liquefaction
- [ ] Describe anaerobic digestion and fermentation
- [ ] Compare fixed-dome and floating-drum biogas plants
- [ ] Size a biogas digester using design equations
- [ ] Discuss carbon neutrality and life-cycle considerations
