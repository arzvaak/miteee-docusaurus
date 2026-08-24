---
title: "Historical PYQ 08 - 2019 Regular (ELE 4006)"
sidebar_label: "Historical PYQ 08 - 2019 Regular (ELE 4006)"
sidebar_position: 208
description: "Historical predecessor-code Energy Auditing paper with source wording, provenance, and worked solutions."
tags:
  - energy-auditing
  - ele-4446
  - historical-pyq
  - worked-solutions
---

# Historical PYQ 08 - 2019 Regular (ELE 4006)

> Historical predecessor-code paper: **ELE 4006**. Worked solutions are not official answers.

## Question 1

### Subpart 1A — Drying heat requirement

**Source wording**

> A food containing 80% water is to be dried at 100 °C, down to moisture content of 10%. If the initial temperature of food is 16 °C, calculate the quantity of heat energy required per unit weight of original material, for drying under atmospheric pressure. The latent heat of vapourization of water at 100 °C at standard atmospheric pressure is 2257 kJ/kg. The specific heat capacity of the food is 3.8 kJ/kg °C and of water is 4.186 kJ/Kg °C. Find also the energy required/kg water removed. (05)

**Topic:** Sensible heat + latent heat balance for atmospheric drying (mass balance on moisture).

**Worked solution - not an official answer**
- Basis: 1 kg of original food. Water initially = 0.80 kg; dry solids = 0.20 kg.
- Dry solids are constant and form (1 − 0.10) = 0.90 of final mass, so final mass = 0.20/0.90 = 0.2222 kg; residual water = 0.0222 kg.
- Water evaporated = 0.800 − 0.0222 = 0.7778 kg per kg original material.
- Sensible heat to raise the food from 16 °C to 100 °C: Q₁ = m·c·ΔT = 1 kg × 3.8 kJ/kg °C × (100 − 16) °C = 319.2 kJ.
- Latent heat to vapourize the removed water at 100 °C: Q₂ = 0.7778 kg × 2257 kJ/kg = 1755.4 kJ.
- Total heat per kg original material: Q = Q₁ + Q₂ = 319.2 + 1755.4 = 2074.6 kJ.
- Energy per kg water removed: 2074.6 ÷ 0.7778 = 2667.4 kJ/kg water.

**Final answer:** ≈ 2075 kJ per kg of original material; ≈ 2667 kJ per kg of water removed.

**Verification:** Mass balance closes: 0.20 kg solids + 0.0222 kg residual water = 0.2222 kg final mass; 0.8 − 0.0222 = 0.7778 kg evaporated. Check: 3.8 × 84 = 319.2 ✓; 0.7778 × 2257 = 1755.4 ✓; sum 2074.6 kJ ✓; 2074.6 × (1/0.7778) ≈ 2667 kJ/kg ✓. (Given specific heat of water, 4.186 kJ/Kg °C, is consistent with the c-value basis but not separately consumed in this lumped-heating treatment.)

### Subpart 1B — Ten step detailed energy audit methodology

**Source wording**

> Explain the ten step detailed energy audit methodology by clearly bringing out the scope and purpose of each step. (05)

**Topic:** Detailed energy audit procedure — scope and purpose of each step.

**Worked solution - not an official answer**
1. **Audit preparation/planning** — Scope: define objectives, boundary, team, budget and timeline. Purpose: ensure resources and management approval are in place before fieldwork.
2. **Preliminary data collection** — Scope: gather utility bills (electricity, fuel, water, steam), production records, layout drawings over 2–3 years. Purpose: establish baseline consumption, load factors and cost structure.
3. **Walk-through survey** — Scope: brief plant tour observing major energy-consuming systems. Purpose: identify obvious losses, operating patterns and priority areas for detailed study.
4. **Measurement planning/instrumentation** — Scope: select meters and instruments (power analyzers, flowmeters, thermometers, flue-gas analysers) and measurement points/durations. Purpose: guarantee reliable, representative field data.
5. **Detailed monitoring and measurements** — Scope: log actual energy inputs, process parameters and equipment performance. Purpose: obtain real operating efficiency data rather than nameplate values.
6. **Data analysis and energy balances** — Scope: reconcile energy inputs against useful outputs per system/process. Purpose: quantify losses and locate where energy is actually consumed.
7. **Identification of energy conservation opportunities (ECOs)** — Scope: compare measured performance with best practice/benchmarks. Purpose: generate candidate savings actions (housekeeping, retrofit, process change).
8. **Techno-economic evaluation** — Scope: compute savings and costs, payback/ROI/IRR for each ECO. Purpose: rank measures by financial viability for implementation decisions.
9. **Reporting and action plan** — Scope: document findings, recommended measures, priorities and implementation schedule; present to management. Purpose: convert analysis into an approved investment/implementation roadmap.
10. **Implementation support, follow-up and monitoring** — Scope: assist execution, verify post-installation performance (measurement and verification), maintain periodic reviews. Purpose: sustain savings and drive continual improvement.

**Final answer:** The ten steps above — prepare, collect baseline data, walk-through, plan instrumentation, monitor/measure, analyse via energy balances, identify ECOs, evaluate economics, report/action plan, implement and follow up — each with its stated scope and purpose.

**Verification:** All ten items map onto the standard detailed-audit cycle (plan → measure → analyse → recommend → implement → review), covering both pre-audit and post-audit phases; no step overlaps another's scope, satisfying the question's demand for distinct scope and purpose per step.

## Question 2

### 2A

**Source wording:**

> 2A.   A centrifugal water pump operates at 30 m3/hr and at 1440 RPM. The pump operating efficiency is 65% and motor efficiency is 89%. The discharge pressure gauge shows 3.4 kg/cm2. The suction is 3 m below the pump centerline. If the speed of the pump is reduced by 25 %, estimate the following:
>            a) pump flow,
>            b) pump head
>            c) motor power.
>       Assume motor and pump efficiency remains same at the reduced speed                             (04)

**Topic:** Affinity laws for centrifugal pumps; system head from pressure gauge and static suction lift; pump-motor power calculation.

**Worked solution - not an official answer:**

Reduced speed: N₂ = 1440 × (1 − 0.25) = 1080 RPM. Assume water density ρ = 1000 kg/m³, g = 9.81 m/s², and 1 kg/cm² ≈ 10 m of water column (standard energy-audit conversion).

- a) Flow follows the first affinity law (Q ∝ N):
  Q₂ = 30 × (1080/1440) = 30 × 0.75 = **22.5 m³/hr**
- b) Head at rated conditions: discharge head = 3.4 × 10 = 34 m; suction 3 m below the pump centerline is a suction lift adding to total head: H₁ = 34 + 3 = 37 m.
  Second affinity law (H ∝ N²): H₂ = 37 × (0.75)² = 37 × 0.5625 = **20.81 m**
- c) Hydraulic power at reduced duty:
  P_hyd = (Q₂/3600) × ρ × g × H₂ = (22.5/3600) × 1000 × 9.81 × 20.8125 = 1276.1 W ≈ 1.276 kW
  Motor input power (both efficiencies unchanged, as instructed):
  P_motor = 1.276/(0.65 × 0.89) = 1.276/0.5785 = **2.21 kW**

**Final answer:** a) Pump flow ≈ 22.5 m³/hr; b) Pump head ≈ 20.81 m; c) Motor power ≈ 2.21 kW.

**Verification:** Power scales as N³ under the affinity laws. Original-duty motor input = (30/3600) × 1000 × 9.81 × 37/0.5785 = 3.0248/0.5785 = 5.23 kW; ratio 2.21/5.23 = 0.422 ≈ (0.75)³ = 0.422, confirming internal consistency of flow, head, and power results.

### 2B

**Source wording:**

> 2B.   An energy auditor audits a 75 kW four pole 3 phase induction motor operating at 50 Hz and rated for 415 V, 100 A at 1440 RPM. The actual measured speed was 1470 RPM and the power analyser recorded the applied voltage to be 428 V and drawing a current of 30 A.
>            a) The auditor works out the percentage loading of the induction motor as a ratio of line current drawn to the rated current of the motor. Do you agree with the above methodology adopted by the auditor? Justify your answer with reasons.
>            b) Determine the percentage loading of the motor for the given operating
>               conditions.                                                                            (03)

**Topic:** Motor loading estimation; comparison of line-current-ratio method versus slip method for induction motors.

**Worked solution - not an official answer:**

- a) No, the methodology is not agreed with. Justification: stator current is not proportional to shaft load over the operating range, especially below about 50% load. A large fixed magnetizing (no-load) component — commonly 25–40% of rated current for such motors — flows irrespective of load, so the current ratio (30/100 = 30%) distorts the true loading. Additionally, the supply voltage here is 428 V against the rated 415 V (+3.1%), which itself changes the current drawn, further invalidating a pure current-ratio estimate. Slip varies almost linearly with load in the working range and is the preferred indicator, so the auditor's current-based figure cannot be accepted as loading.
- b) Four-pole, 50 Hz synchronous speed: Ns = 120 × 50/4 = 1500 RPM.
  Rated slip = (1500 − 1440)/1500 = 0.04; measured slip = (1500 − 1470)/1500 = 0.02.
  Percentage loading = (measured slip/rated slip) × 100 = (0.02/0.04) × 100 = **50%**.

**Final answer:** a) No — the current-ratio method is unreliable at part load due to the fixed magnetizing current component and the off-rated voltage; b) Percentage loading ≈ 50%.

**Verification:** The measured 1470 RPM lies between the rated 1440 RPM and synchronous 1500 RPM, i.e., slip halved from 4% to 2%, consistent with roughly half of rated output. The 30 A reading (30% of rated) sits in the typical no-load-to-light-load band for a machine of this size, confirming why the current ratio understates/distorts loading while the slip method yields a coherent 50%.

### 2C

**Source wording:**

> 2C.   Explain, any three salient features of the Electricity Act, 2003 by clearly bringing out its
>       merits.                                                                                        (03)

**Topic:** Electricity Act, 2003 — salient features and their merits.

**Worked solution - not an official answer:**

Any three of the following salient features, each with its merit, may be presented:

1. **Delicensing of generation (Section 7):** Setting up a generating station no longer requires a licence (hydro projects need only statutory concurrence).
   *Merit:* Opens the sector to private and competitive investment, removes entry barriers, and helps augment generation capacity and reduce shortages.
2. **Open access in transmission and distribution (Sections 2(47), 79, 86):** Consumers and generators gain non-discriminatory use of the network, enabling bulk consumers to choose their supplier.
   *Merit:* Promotes competition among suppliers, improves quality and cost-efficiency of service, and empowers consumer choice.
3. **Independent regulation and appellate mechanism (Sections 76–82, 86, 110):** Creation of CERC and SERCs with tariff-setting functions, plus an Appellate Tribunal.
   *Merit:* Transparent, professional tariff determination insulated from political influence, with an effective grievance/appeal route for stakeholders.
4. *(Other acceptable features)* **Trading recognised as a licensed activity**, creating organized power markets; **mandatory metering of all electricity supplied** (Section 55), improving billing accuracy and loss accountability; **rural electrification through decentralised/distributed generation without licensing**, accelerating village electrification; **statutory promotion of co-generation and renewables** (Section 86(1)(e)) via renewable purchase obligations; **consolidation of the Indian Electricity Act 1910, the Electricity (Supply) Act 1948 and the ERC Act 1998** into a single modern statute, simplifying governance.

**Final answer:** Any three validly explained features with merits — e.g., delicensing of generation, open access, and independent regulatory commissions with Appellate Tribunal — as detailed above.

**Verification:** Each cited feature corresponds to an explicit provision of the Electricity Act, 2003 (Sections 7, 2(47)/79/86, 76–86/110, 55, etc.), and each stated merit follows directly from the intent recorded in the Act's statement of objects (competition, investment, consumer interest, efficient use of resources); no feature or merit outside the statute's provisions has been asserted.

## Question 3

### 3A

**Source wording**

> 3A. A community has 500 people. The Source of water to the community are borewells & supply of water from borewell is through handpumps. Six handpumps are used to meet the water requirement. Using the following details, compute the cost of water per liter if the project life cycle is 20 years.
>
> - Per capita water consumption – 40 lit/day
> - Cost of each hand pump – INR 5000
> - Depth of borewell – 20 m
> - Cost of digging the borewell – INR 250 per meter.
> - Life span of a hand pump = 10 years
> - Annual Maintenance Cost – INR 1250/- per handpump
> - Rate of interest = 10%
> - Inflation Rate - 7%
>
> (05)

**Topic**: Life-cycle costing (present-worth method) of a community water-supply system.

**Worked solution - not an official answer**

Assumptions (data gaps filled conservatively, not invented as official): the borewell detail describes the borewell(s) as dug at INR 250/m for 20 m = INR 5,000 with life equal to the project life; handpumps are replaced once at year 10 (life span 10 years) at cost escalated by the 7% inflation rate; annual maintenance is constant in real terms. (If six separate borewells are assumed, capital rises by INR 25,000 and the unit cost rises to ≈ INR 0.00134/L.)

1. Water demand: 500 × 40 lit/day = 20,000 L/day → × 365 = 7.3 × 10⁶ L/year → × 20 years = 146 × 10⁶ L.
2. Initial capital cost: hand pumps 6 × 5000 = INR 30,000; borewell digging 20 × 250 = INR 5,000; total C₀ = INR 35,000.
3. Real discount rate (Fisher): d = (1.10/1.07) − 1 = 0.02804 (2.80%).
4. Present worth of maintenance: 6 × 1250 = INR 7,500/year; P/A(20 yr, 2.80%) = [1 − 1.02804⁻²⁰]/0.02804 = 15.151 → 7,500 × 15.151 = INR 113,633.
5. Present worth of hand pump replacement at year 10: nominal cost 30,000 × 1.07¹⁰ = INR 59,015; PV = 59,015/1.10¹⁰ = 59,015/2.59374 = INR 22,754.
6. Life-cycle cost = 35,000 + 113,633 + 22,754 = INR 171,387.
7. Cost per litre = 171,387 / 146,000,000 = INR 0.001174/L.

**Final answer**: ≈ INR 0.00117 per litre (≈ INR 1.17 per 1,000 litres, i.e., ≈ 0.12 paise per litre) over the 20-year project life cycle.

**Verification**: Reverse multiplication: 146 × 10⁶ L × 0.001174 = INR 171,404 ≈ INR 171,387 (agrees within rounding) ✓; component sum 35,000 + 113,633 + 22,754 = 171,387 ✓. Sensitivity: using the simpler real rate 10% − 7% = 3% gives ≈ INR 1.16 per 1,000 L — same order, confirming robustness.

### 3B

**Source wording**

> 3B. A four pole 34 kW/45 HP, 415 Volt Delta connected 3 Phase IM has a full load current of 57 A at 1475 RPM. The No Load Test yielded the following result; - V = 415 V; No load current = 16.1 A, Frequency = 50 HZ; Stator phase resistance at 30 °C = 0.264 Ohms & No-Load power = 1063.74W
>
> Determine
>
> a) Calculate the Core + Friction & Windage losses
> b) Stator copper losses if the operating temperature is 120 °C.
> c) Full load slip & rotor input; Motor input assuming IEC standard for stray losses
> d) Motor efficiency at full load & full load power factor.
>
> (05)

**Topic**: Induction-motor loss segregation from no-load test data; slip, rotor input, efficiency, and power factor at full load.

**Worked solution - not an official answer**

Synchronous speed: Ns = 120f/P = (120 × 50)/4 = 1500 RPM.

a) Delta connection → no-load phase current = 16.1/√3 = 9.29 A. No-load stator copper loss (with given 30 °C resistance, since temperature correction is introduced only in part b) = 3 × 9.29² × 0.264 = 68.43 W. Core + Friction & Windage losses = 1063.74 − 68.43 = 995.31 W.

b) Hot resistance: R₁₂₀ = 0.264 × (235 + 120)/(235 + 30) = 0.264 × 355/265 = 0.354 Ω. Full-load phase current = 57/√3 = 32.91 A. Stator copper loss at 120 °C = 3 × 32.91² × 0.354 ≈ 1,150 W (1,149 W unrounded).

c) Full load slip: s = (1500 − 1475)/1500 = 0.0167 (1.67%; rotor frequency = 0.83 Hz). Taking core + F&W (995.31 W) as rotational losses: rotor input P_g = (34,000 + 995.31)/(1 − 0.0167) = 34,995.3 × 60/59 = 35,588 W (≈ 35.59 kW); rotor copper loss = s × P_g = 593 W. IEC 60034-2-1 assigned stray load loss for the 10–100 kW class = 1.5% of input: P_in = (35,588 + 1,149)/(1 − 0.015) = 36,737/0.985 = 37,297 W ≈ 37.3 kW (stray loss ≈ 559 W).

d) Efficiency at full load = 34,000/37,297 = 0.912 → 91.2%. Power factor = 37,297/(√3 × 415 × 57) = 37,297/40,972 = 0.91 lagging.

**Final answer**: a) ≈ 995.31 W; b) ≈ 1,150 W; c) slip = 1.67%, rotor input ≈ 35.59 kW (rotor Cu loss ≈ 593 W), motor input ≈ 37.3 kW; d) η ≈ 91.2%, pf ≈ 0.91 lagging. (Under the legacy IEC 0.5%-of-input stray-loss convention: input ≈ 36.9 kW, η ≈ 92.1%, pf ≈ 0.90.)

**Verification**: Power balance: 37,297 − (1,149 stator Cu + 559 stray + 593 rotor Cu + 995 core/F&W) = 34,000 W = rated shaft output ✓. Slip check: 1475 RPM < 1500 RPM with s = 25/1500 = 1.67% confirms near-synchronous motoring ✓. Apparent-power check: √3 × 415 × 57 = 40.97 kVA; 40.97 × 0.91 ≈ 37.3 kW input ✓.

## Question 4

### 4A

**Source wording:**
> An industrial process requires a water discharge of 68 m3/hr. The demand is being met using a centrifugal pump A, which is connected to an Industrial 3 Phase Induction Motor, having an efficiency of 85%. The pump is operated for 12 hours daily throughout the year. [Refer the pump characteristic curves & related data given below]
>
> a) Compute the total power drawn by the motor, driving pump A.
>
> b) Suggest the best possible recommendation to suit the flow demand.
>
> c) Compute the payback period for the recommendation given. [Assume energy cost to be INR 6/- per unit]
>
> Figure 1: Head vs Flow of Pumps ( Q 4A)  (05)
>
> | Pump | Motor Efficiency | Cost of the Pump |
> |------|------------------|------------------|
> | B    | 88%              | INR 60000        |
> | C    | 88%              | INR 62000        |
> | D    | 86%              | INR 64000        |
> | E    | 85%              | INR 64000        |
>
> Table 1: Motor cost and efficiency (Q 4A)

#### 4A (a)
- **Source wording:** "Compute the total power drawn by the motor, driving pump A."
- **Topic:** Motor input power from hydraulic power, pump efficiency and motor efficiency.
- **Worked solution - not an official answer:** Convert flow: Q = 68 m3/hr ÷ 3600 = 0.01889 m3/s. Hydraulic power = ρ g Q H = 1000 × 9.81 × 0.01889 × H = 185.3 H W = 0.1853 H kW (H = duty-point head in m). Total power drawn by the motor = Hydraulic power ÷ (η_pump,A × η_motor) = 0.1853 H ÷ (0.85 × η_pump,A) kW. The duty-point head H and pump A's efficiency at 68 m3/hr must be read from Figure 1, which is not legible in the supplied text, so no numeric result is derivable from the legible source alone.
- **Final answer:** P_motor = 0.1853 · H ÷ (0.85 · η_pump,A) kW, with H in metres; numeric evaluation requires Figure 1 readings absent from the source text.
- **Verification:** Dimensional check: kg/m3 × m/s2 × m3/s × m = J/s = W; arithmetic checks: 68 ÷ 3600 = 0.01889 m3/s and 1000 × 9.81 × 0.01889 = 185.3 W per metre of head.

#### 4A (b)
- **Source wording:** "Suggest the best possible recommendation to suit the flow demand."
- **Topic:** Pump replacement selection from Table 1 efficiency and cost data.
- **Worked solution - not an official answer:** Pump A runs on an 85%-efficient motor, while every listed alternative is at least as efficient, with B and C at 88%. Selection rule: pick the candidate whose Head-vs-Flow curve (Figure 1) covers the duty point of 68 m3/hr at the required head with the highest combined pump-plus-motor efficiency per rupee invested. From the legible tabulated data alone, B dominates C at identical 88% efficiency at lower cost (INR 60000 vs INR 62000), making B the indicated recommendation, contingent on Figure 1 confirming B meets the flow demand.
- **Final answer:** Replace pump A with pump B (motor efficiency 88%, cost INR 60000), subject to Figure 1 confirming delivery of 68 m3/hr at the required head.
- **Verification:** Cross-check against Table 1: B and C tie on efficiency at 88%; B is cheaper than C; D and E are both lower in efficiency (86%, 85%) yet costlier (INR 64000), so no listed option supersedes B on the visible data.

#### 4A (c)
- **Source wording:** "Compute the payback period for the recommendation given. [Assume energy cost to be INR 6/- per unit]"
- **Topic:** Simple payback period for the pump retrofit at INR 6/- per unit.
- **Worked solution - not an official answer:** Annual operating hours = 12 hr/day × 365 days = 4380 hr. Annual cost saving = (P_A − P_B) kW × 4380 hr × INR 6/kWh. Simple payback = Investment ÷ Annual saving = 60000 ÷ [6 × 4380 × (P_A − P_B)] years. P_A and P_B follow from part (a) evaluated at the common duty point using Figure 1; since those curve values are not legible in the source, the payback remains in symbolic form.
- **Final answer:** Payback period (years) = 60000 ÷ [6 × 4380 × (P_A − P_B)], with P in kW; numeric evaluation requires the Figure 1 duty-point powers.
- **Verification:** Unit consistency: kW × hr = kWh and kWh × INR/kWh = INR, matching the INR 60000 numerator; hours check: 12 × 365 = 4380 hr/year confirmed.

#### 4B
- **Source wording:** "4B.. Explain the six-step methodology followed for a lighting audit. Hence, discuss how reduction of feeder voltage and use of occupancy sensors can help reduce the energy consumption in an office space." (05)
- **Topic:** Lighting audit methodology; voltage reduction and occupancy-based controls for office lighting savings.
- **Worked solution - not an official answer:** Six-step lighting audit methodology: (1) inventory every luminaire — lamp type, wattage, ballast and count per area; (2) measure illuminance (lux) at working planes and compare with recommended standards; (3) record operating hours, switching schedules and control practices; (4) assess maintenance condition — lamp ageing, dirt deposition and lumen depreciation; (5) identify saving opportunities — efficient lamp retrofits (e.g., LED), delamping, daylighting, task lighting and controls; (6) quantify kWh and cost savings per measure and prioritise by payback. Reduction of feeder voltage: office feeders often carry voltage above rated level during light-load periods; optimising or reducing feeder voltage lowers lamp power draw (markedly for filament lamps and magnetic-ballast discharge circuits) with a modest lux reduction and improved lamp life, yielding continuous kWh savings. Occupancy sensors: PIR/ultrasonic or dual-technology sensors switch luminaires off automatically when spaces are unoccupied, eliminating burning hours in empty cabins, meeting rooms and washrooms; savings equal connected load multiplied by avoided operating hours.
- **Final answer:** Six steps: inventory of luminaires → measurement of illuminance against standards → usage hours and controls review → maintenance-condition assessment → identification of saving measures → quantification and prioritisation of savings; feeder-voltage reduction trims excess voltage supplied to lamps, and occupancy sensors remove lighting operation in unoccupied office areas.
- **Verification:** Sanity check: lighting kWh = connected load (kW) × burning hours; both measures act on these two factors directly (reduced power draw, reduced hours), consistent with the costing framework used in 4A (c).

## Question 5

### 5A

**Source wording**

5A. The energy monitoring program at a food processing factory yielded the data, as shown in the table below. Its energy consumption and production data was collected for the duration November, 2016 till April, 2018. During the month of July 2017, energy efficient motors and waste heat recovery systems were installed.

*Energy Consumption vs Production Details*

| Month | Monthly Energy Consumption (toe/month): HSD | Monthly Energy Consumption (toe/month): Electricity | Monthly Energy Consumption (toe/month): Coal | Monthly Production (Tonnes/month) |
|---|---|---|---|---|
| Nov, 2016 | 130 | 190 | 20 | 380 |
| Dec, 2016 | 110 | 210 | 20 | 440 |
| Jan, 2017 | 100 | 270 | 10 | 460 |
| Feb, 2017 | 100 | 270 | 10 | 520 |
| Mar, 2017 | 120 | 175 | 05 | 320 |
| Apr, 2017 | 120 | 360 | 20 | 520 |
| May, 2017 | 80 | 200 | 00 | 240 |
| June, 2017 | 100 | 300 | 24 | 620 |
| July, 2017 | 100 | 300 | 20 | 600 |
| Aug, 2017 | 120 | 270 | 10 | 560 |
| Sept, 2017 | 100 | 255 | 05 | 440 |
| Oct, 2017 | 105 | 210 | 15 | 360 |
| Nov, 2017 | 110 | 225 | 05 | 420 |
| Dec, 2017 | 88 | 240 | 12 | 420 |
| Jan, 2018 | 136 | 200 | 36 | 480 |
| Feb, 2018 | 90 | 258 | 32 | 540 |
| Mar, 2018 | 80 | 190 | 10 | 280 |
| Apr, 2018 | 100 | 270 | 10 | 500 |

- Using Linear Regression Analysis, derive the equation for standard energy consumption.
- Perform CUSUM analysis to calculate the energy savings due to installation of energy efficient motors & waste heat recovery systems.                             (07)

**Topic**

Energy monitoring and targeting: linear-regression baseline for Standard Energy Consumption (SEC) and CUSUM analysis of retrofit savings.

**Worked solution - not an official answer**

Basis taken from the given data: total monthly consumption E = HSD + Electricity + Coal (toe/month); baseline (pre-installation) period = Nov, 2016 to June, 2017 (8 months); assessment (post-installation) period = July, 2017 to April, 2018.

Step 1 - Baseline regression (x = production, tonnes; y = energy, toe):
Totals: E(Nov) = 130+190+20 = 340; Dec = 340; Jan = 380; Feb = 380; Mar = 120+175+05 = 300; Apr = 500; May = 280; Jun = 424.
n = 8; Σx = 3,500; Σy = 2,944; x̄ = 437.5; ȳ = 368; Σxy = 1,337,280; Σx² = 1,634,800.

- Slope b = (nΣxy − ΣxΣy)/(nΣx² − (Σx)²) = (8×1,337,280 − 3,500×2,944)/(8×1,634,800 − 3,500²) = 394,240/828,400 = 0.4759 toe/tonne
- Intercept a = ȳ − b·x̄ = 368 − 0.4759×437.5 = 159.79 toe/month

SEC equation: **E = 159.79 + 0.4759 × Production** (toe/month).

Step 2 - CUSUM (Calculated/predicted E = 159.79 + 0.4759 × P; Saving = Calculated − Actual):

| Month | Actual (toe) | Production (t) | Calculated (toe) | Saving (toe) | CUSUM (toe) |
|---|---|---|---|---|---|
| July, 2017 | 420 | 600 | 445.33 | 25.33 | 25.33 |
| Aug, 2017 | 400 | 560 | 426.30 | 26.30 | 51.63 |
| Sept, 2017 | 360 | 440 | 369.19 | 9.19 | 60.82 |
| Oct, 2017 | 330 | 360 | 331.12 | 1.12 | 61.94 |
| Nov, 2017 | 340 | 420 | 359.67 | 19.67 | 81.61 |
| Dec, 2017 | 340 | 420 | 359.67 | 19.67 | 101.28 |
| Jan, 2018 | 372 | 480 | 388.23 | 16.23 | 117.51 |
| Feb, 2018 | 380 | 540 | 416.78 | 36.78 | 154.29 |
| Mar, 2018 | 280 | 280 | 293.04 | 13.04 | 167.33 |
| Apr, 2018 | 380 | 500 | 397.74 | 17.74 | 185.07 |

**Final answer**

SEC equation: E (toe/month) = 159.79 + 0.4759 × Production (tonnes/month). The CUSUM rises steadily to approximately **185 toe of cumulative energy savings** over the ten post-retrofit months (July, 2017 to April, 2018), i.e., an average of about 18.5 toe/month, attributable to the energy efficient motors and waste heat recovery systems.

**Verification**

- Line passes through the means: 159.79 + 0.4759 × 437.5 = 368.0 = ȳ. Checked.
- Correlation r = 394,240/√[(828,400)(278,272)] ≈ 0.82, an adequate fit for an M&T baseline.
- Final CUSUM (185.07 toe) equals the sum of the ten monthly savings; calculated consumption exceeds actual consumption in every assessment month, so the CUSUM increases monotonically - internally consistent with genuine post-retrofit savings.

### 5B

**Source wording**

5B.   Explain the role of the top management in energy action planning.                           (03)

**Topic**

Role of top management in energy action planning (energy policy, organisation and review).

**Worked solution - not an official answer**

- **Commitment and policy:** initiate the energy action plan, formulate and formally sign the energy policy, and communicate energy performance as an organisational goal to all levels.
- **Organisation:** appoint a competent energy manager/coordinator, constitute a cross-functional energy committee, and define responsibilities and reporting lines.
- **Resources:** sanction budgets for audits, metering/instrumentation, training and capital retrofit projects, and allocate manpower and time.
- **Targets and integration:** approve energy targets, priorities, action plans and timelines, and integrate energy-efficiency criteria into procurement, design and operating decisions.
- **Review and motivation:** periodically review monitoring & targeting/CUSUM reports and audit findings against targets, direct corrective actions, and recognise staff achievements to sustain the programme.

**Final answer**

Top management must commit, enable and steer the programme: issue and back the energy policy, appoint the energy manager/committee, provide funds, men, materials and training, set and communicate targets, and periodically review performance and drive corrective action; without this visible, sustained backing, an energy action plan cannot be implemented effectively.

**Verification**

Theory question - no numerical data to verify; the points map onto the standard energy action-planning sequence (commitment → policy → planning → implementation → monitoring → management review, i.e., the Plan-Do-Check-Act cycle used in ISO 50001-type frameworks) for this syllabus.
