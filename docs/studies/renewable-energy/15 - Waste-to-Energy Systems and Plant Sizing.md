---
title: "15 - Waste-to-Energy Systems and Plant Sizing"
math_syntax: typst
---

# Waste-to-Energy Systems and Plant Sizing

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


## Introduction

Waste-to-Energy (WtE) systems convert municipal solid waste (MSW) and other waste streams into usable energy — electricity, heat, or fuel. This aligns with circular economy principles, reducing landfill dependence and recovering embedded energy. Core processes include thermal conversion (incineration, gasification, pyrolysis) and biological conversion (anaerobic digestion, fermentation).

## Incineration

Controlled combustion of MSW in a furnace at 800–1000°C. Heat produces steam driving a turbine-generator.

### Process Flow
1. Waste reception and storage in a bunker
2. Combustion on a moving grate furnace with primary air from below and secondary air above
3. Hot flue gases pass through a boiler, generating high-pressure steam
4. Steam expands in a turbine coupled to a generator
5. Flue gas treatment removes pollutants (acid gases, particulates, heavy metals, dioxins/furans)
6. Bottom ash and fly ash collected and disposed or reused

### Energy Output

$Q = m_w dot "LHV"_w$

where $m_w$ is mass of waste burned, and $"LHV"_w$ is the lower heating value of the waste (MJ/kg). LHV is used because water vapour in flue gas is not condensed.

Typical electrical efficiency: 20–30% standalone; 30–40% with advanced fluid bed systems.

## Landfill Gas (LFG) Recovery

Organic waste in landfills decomposes anaerobically, producing landfill gas: ~50% CH₄, ~50% CO₂.

### System Components
- Gas collection wells (vertical or horizontal)
- Blower/vacuum system for extraction
- Gas cleaning/conditioning (removes moisture, siloxanes, contaminants)
- Energy conversion (reciprocating engine or gas turbine)

| Benefits | Limitations |
| :--- | :--- |
| Reduces GHG emissions (CH₄ is potent) | Gas composition and flow vary over time |
| Provides renewable energy source | Long-term monitoring and maintenance needed |
| Extends landfill life | High upfront capital cost |
| Can be implemented in existing landfills | Potential gas leakage |

## Anaerobic Digestion for Biogas

Biogas production from wet cattle dung, sewage, crop residues, and vegetable waste. Typical composition: 55–65% CH₄, 30–40% CO₂, trace H₂, H₂S, N₂. Heating value: approximately 18–25 MJ/m³.

### Design Equations

**Daily dry matter input:** $m_0$ (kg/day), based on number of animals or waste type (e.g., 2 kg dry matter/day/cow)

**Biogas volume:** $V_b = C dot m_0$ where $C$ is biogas yield per kg dry mass (0.2–0.4 m³/kg)

**Energy available:** $E = eta dot H_m dot F_m dot V_b$ where $eta$ = burner/engine efficiency, $H_m$ = heating value of methane (~28 MJ/m³), $F_m$ = methane fraction (~0.7)

**Digester volume:** $V_d = V_f dot t_r$ where $V_f = m_0 / rho_m$ (volume of fluid/slurry per day, $rho_m$ ~50 kg/m³), and $t_r$ = retention period (8–50 days)

### Worked Example: Family Plant

**Given:** 5 adults, 2 × 100 CP lamps for 3 hours/day.

Gas required: cooking 5 × 0.227 = 1.135 m³/day; lighting 0.126 × 2 × 3 = 0.756 m³/day. Total: 1.891 m³/day.

Cow requirement: collectable dung 7n kg/day, dry mass (18%) = 1.26n kg/day, gas yield 0.34 m³/kg. So $0.34 × 1.26n = 1.891 → n ≈ 5$ cows.

Digester volume: daily slurry = 70 kg (35 dung + 35 water), density 1090 kg/m³, volume = 70/1090 = 0.0642 m³/day. For 50-day retention: 50 × 0.0642 = 3.21 m³. Net digester volume (slurry occupies 90%): 3.21 / 0.9 = **3.56 m³**.

## Plant Sizing Procedure

1. **Waste characterization:** Average daily waste quantity ($m_w$) and properties (moisture, LHV, composition)
2. **Energy demand analysis:** Target electrical power $P_e$ (MW) or thermal power $P_t$ (MWth)
3. **Technology selection:** Based on waste type and local context
4. **Mass and energy balance:**
   - Combustion: $Q_"in" = m_w dot "LHV"_w$; $P_e = (Q_"in" eta_e) / t$
   - Biogas: $V_b = C m_0$; $E = eta H_m F_m V_b$; $V_d = (m_0 / rho_m) t_r$
5. **Component sizing:** Boiler, turbine, flue gas treatment, gas holder, waste storage
6. **Environmental impact assessment:** Emissions modelling and control system design
7. **Economic feasibility:** CAPEX, OPEX, tipping fees, energy sales revenue

## Performance Indicators

- **Electrical efficiency:** $eta_e = ("Net electrical output") / ("Energy input from waste") times 100%$
- **Capacity factor:** Actual output to maximum possible output
- **Availability:** Percentage of time operational
- **Emissions performance:** Measured against regulatory standards

## Advantages and Limitations

| Advantages | Limitations |
| :--- | :--- |
| Reduces landfill mass by ~90% | High capital cost |
| Generates baseload electricity/heat | Public perception concerns (NIMBY) |
| Avoids methane emissions from landfills | Feedstock variability affects efficiency |
| Bottom ash usable as aggregate; digestate as manure | Fly ash may be hazardous waste |

## Revision Checklist

- [ ] Describe incineration process flow and energy output calculation
- [ ] Explain landfill gas recovery system components
- [ ] Size a biogas digester for a family and for a community
- [ ] Outline the plant sizing procedure for WtE systems
- [ ] State advantages and limitations of WtE technologies
