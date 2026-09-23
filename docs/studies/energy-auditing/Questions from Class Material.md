---
title: "Questions from Class Material"
math_syntax: typst
---

# Questions from Class Material

> *Questions appearing in lectures and tutorials, with worked solutions.*

---

## Lecture Slide Questions

### Energy Fundamentals (L01)

**Q1.** State the definition of "Energy Audit" under the Energy Conservation Act 2001.

**A1.** Verification, monitoring and analysis of use of energy, including submission of a technical report containing recommendations for improving energy efficiency with cost benefit analysis.

---

**Q2.** Given 1 toe = 11,630 kWh and 39% thermal-to-electrical efficiency, how much electricity (kWh) can be generated from 1 toe in a thermal power plant?

**A2.** $E = 0.39 times 11{,}630 = 4{,}535.7$ kWh ≈ 4.54 MWh.

---

**Q3.** Match global electricity-generation shares: Coal, Natural Gas, Nuclear, Wind, Solar PV. Which source generates more than all other renewables combined?

**A3.** Coal 33%, Natural gas >20%, Nuclear ≈10%, Wind 8%, Solar PV 5%. **Hydropower** generates more than all other renewables combined.

---

### Energy Audit Framework (L02)

**Q4.** List the ten steps of a detailed energy audit methodology.

**A4.** (1) Preparation and top-management briefing, (2) plant data collection, (3) preliminary walk-through survey, (4) baseline energy analysis, (5) detailed monitoring and measurements, (6) material and energy balance, (7) identification of energy-saving opportunities, (8) techno-economic evaluation, (9) prioritisation and action plan, (10) implementation follow-up and M&V.

---

**Q5.** List four obligations of Designated Consumers under the EC Act 2001.

**A5.** Appoint certified energy managers; undergo specific energy audits; report energy consumption data via e-filing; comply with prescribed energy consumption norms.

---

### Monitoring and Targeting (L03)

**Q6.** List the six key steps of Energy M&T and give the defining phrase for each.

**A6.** (1) Analyzing — correlating energy to measured output; (2) Comparing — comparing to a standard/benchmark; (3) Setting Targets — reducing/controlling consumption; (4) Monitoring — comparing to the set target regularly; (5) Reporting — reporting results and variances; (6) Controlling — correcting variances.

---

**Q7.** Using the baseline model $E = 0.4P + 182$, compute predicted consumption, deviation, and CUSUM for month 15 (P = 540 tonnes, actual = 380 kWh).

**A7.** Predicted $= 0.4 times 540 + 182 = 398$ kWh; deviation $= 380 - 398 = -18$ kWh; CUSUM $= -36 + (-18) = -54$ kWh.

---

### Financial Evaluation (L04)

**Q8.** A continuous deodorizer costs Rs. 60 lakhs, Rs. 1.5 lakhs/year O&M, and saves Rs. 20 lakhs/year. Calculate the simple payback period.

**A8.** Net annual saving $= 20 - 1.5 = 18.5$ lakhs; SPP $= 60/18.5 approx 3.24$ years ≈ **3 years 3 months**.

---

**Q9.** At 10% interest, what is the present value of Rs. 100 received one year from now?

**A9.** $"PV" = 100/1.10 = 90.91$ Rs.

---

**Q10.** State two limitations of the Simple Payback method.

**A10.** (1) Does not consider time value of money; (2) ignores cash flows beyond the payback period.

---

### Electrical Systems (L06–L10)

**Q11.** Define load factor and state its formula.

**A11.** $"Load Factor" = frac("Average Load", "Maximum Demand") = frac("kWh", "Maximum kW" times "hours")$

---

**Q12.** A plant improves power factor from 0.72 to 0.95 at constant 500 kW load. Find the required capacitor kVAR.

**A12.** $Q_c = 500 times (tan(arccos 0.72) - tan(arccos 0.95))$
$= 500 times (0.964 - 0.329) = 500 times 0.635 = 317.5$ kVAR

---

**Q13.** Compare two lighting retrofits using annual kWh saving, cost saving, and simple payback.

**A13.** Calculate annual kWh saved = (old wattage − new wattage) × hours × days; cost saving = kWh × tariff; payback = capital cost / annual cost saving.

---

---

## Tutorial Questions

### T01 — Basic Energy Calculations

**T1-Q1.** A process requires 120 kg of coal (CV = 4800 kcal/kg) for heating with 82% system efficiency. Find the energy loss.

**A.** Total input $= 120 times 4800 = 576{,}000$ kcal; useful $= 576{,}000 times 0.82 = 472{,}320$ kcal; **Loss = 103,680 kcal**.

---

**T1-Q2.** A conveyor delivers coal with width 1 m, bed height 0.25 m, speed 0.5 m/s, density 1.1 ton/m³. Find delivery in tons/hour.

**A.** $A = 0.25$ m²; $dot(V) = 0.125$ m³/s; $dot(M) = 0.1375$ ton/s; **495 ton/hr**.

---

**T1-Q3.** Which statements are true? (i) reactive current builds magnetic flux; (ii) some reactive current is converted to work; (iii) PF = cos angle between kVA and kVAR; (iv) PF = cos angle between kW and kVA.

**A.** Statements (i) and (iv) are true.

---

### T02 — Home Energy Audit

**T2-Q1.** An integrated paper plant produced 119,366 MT in 2020–21 with a specific energy consumption (SEC) of 53 GJ/tonne. After PAT measures, the SEC fell to 50 GJ/tonne. The assessment year (2021–22) production is 124,141 MT. Calculate the Plant Energy Performance (PEP) and state your inference.

**A.** Reference SEC $= 53$ GJ/t; Assessment SEC $= 50$ GJ/t.

$"PEP" = frac(53 - 50, 53) times 100 = frac(3, 53) times 100 = 5.66%$

**Inference:** PEP is positive, so the plant is achieving energy savings.

---

**T2-Q2.** A manufacturing industry implements an energy conservation scheme under PAT. Using 2020–21 as the reference year, calculate the PEP.

- Reference year (2020–21): production 34,000 T, energy 27,200 MWh.
- Current year (2021–22): production 28,750 T, energy 23,834 MWh.

**A.** Reference SEC $= 27{,}200/34{,}000 = 0.800$ MWh/t; Current SEC $= 23{,}834/28{,}750 = 0.829$ MWh/t.

$"PEP" = frac(0.800 - 0.829, 0.800) times 100 = -3.6%$

**Inference:** PEP is negative, so the plant is **not** achieving energy savings despite the conservation scheme.

---

**T2-Q3.** A residence energy audit consists of eight tasks carried out sequentially. For a given home, outline the structure and purpose of each task, provide blank answer templates for Tasks 1–7, state the EPI formula, and list two energy-saving strategies per category in Task 8. Do not invent household values.

**A.**

**Task 1 — Room dimensions and floor area.** Measure length, width and height of every room. Compute area of each room and the total carpet area.

| Room No | Purpose | Length (ft) | Width (ft) | Height (ft) | Area (sq ft) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| **Total** | | | | | |

**Task 2 — Room-wise appliances, wattage, age and usage.** List every energy-consuming appliance in each room, including laptop adapters, cellphone chargers and the iron box. Record cooking-gas cylinders if used.

| Room | Appliance | Type | Wattage (W) | Approx. Age (yrs) | Hours/day |
|:-:|:-:|:-:|:-:|:-:|:-:|
| | 1 | | | | |
| | 2 | | | | |
| | 3 | | | | |
| | 4 | | | | |

**Task 3 — Connected load.** Sum the wattage of all appliances per room to get connected load.

| Room No | Purpose | Connected Load (W) |
|:-:|:-:|:-:|
| 1 | | |
| 2 | | |
| 3 | | |
| **Total** | | |

**Task 4 — Vehicles, distance and mileage.** Record every household vehicle with daily km and approximate mileage.

| Vehicle No | 2W / 4W | Description | Year | Daily km | Mileage (km/l) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | | | | | |
| 2 | | | | | |

**Task 5 — Tanks and pump data.** Note tank capacity (litres), pump HP, height of overhead tank, and pump-run frequency.

| Item | Value |
|:-:|:-:|
| Overhead tank capacity (L) | |
| Underground sump capacity (L) | |
| Pump HP rating | |
| Height of overhead tank (m) | |
| Pump-run frequency | |

**Task 6 — 6–12 months of utility and fuel records.** Collect electricity, water, cooking-gas and vehicle-fuel bills for at least 6–12 months showing meter readings and units consumed.

| Month | Electricity (kWh) | Water (kL) | LPG (kg) | Fuel (litres) |
|:-:|:-:|:-:|:-:|:-:|
| 1 | | | | |
| 2 | | | | |
| … | | | | |

**Task 7 — Annual consumption and expenditure summary.** Aggregate the data from Task 6 into annual totals and compute total annual expenditure.

| Item | Annual Consumption | Annual Expenditure (Rs) |
|:-:|:-:|:-:|
| Electricity | | |
| Cooking Gas | | |
| Water | | |
| Travel (Fuel / Maintenance) | | |
| **Total** | | |

**Energy Performance Index (EPI).** Compute EPI in kWh / m² / year using:

$ "EPI" = frac("Annual electricity consumption (kWh)", "Total carpet area (m"^2")") $

Convert area from sq ft to m² by multiplying by 0.0929.

**Task 8 — Two saving strategies per category.**

| Category | Strategy 1 | Strategy 2 |
|:-:|:-:|:-:|
| Electricity | Replace incandescent / CFL lamps with LED | Use 5-star-rated appliances and switch off standby loads |
| Cooking Gas | Use pressure cooker to reduce cooking time | Match burner size to vessel diameter |
| Water | Fix leaks promptly; install low-flow aerators | Harvest rainwater for non-potable use |
| Travel | Combine errands to reduce total km driven | Maintain correct tyre pressure to improve mileage |

---

### T03 — CUSUM Analysis

**T3-Q1.** Develop a CUSUM table for 8 months with predicted SEC = 1335 kWh/MT and average production 6,000 MT/month.

**A.** CUSUM after 8 months = −28 kWh/MT; total savings = $28 times 6{,}000 = 1{,}68{,}000$ kWh.

---

### T04 — Financial Analysis

**T4-Q1.** Calculate NPV over 3 years for a project with Rs. 70,000 investment at start of year 1, Rs. 70,000 at start of year 2, and Rs. 95,000 fuel savings in years 2 and 3. Discount rate = 14%.

**A.** NPV ≈ Rs. 5,817.

---

### T05 — Electrical Power Systems

**T5-Q1.** Prove that for a given 3-phase transmission system, the volume of copper reduces with increased line voltage.

**A.** Volume $prop 1/V_L^2$ for constant power, loss, and length — so doubling voltage reduces copper by 75%.

---

### T06 — Electrical Energy Tariffs

**T6-Q1.** A project provides 6,000,000 kWh/yr reduction; system efficiency 3.5 kWh/liter; diesel produces 26 kg CO₂/liter; diesel used for 70% of generation. Find CO₂ saved.

**A.** Fuel saved $= 6{,}000{,}000/3.5 = 1{,}714{,}286$ liters; CO₂ saved $= 1{,}714{,}286 times 0.70 times 26 = 31{,}200$ tonnes.

---

### T07 — Power Factor Improvement

**T7-Q1.** A 40W fluorescent lamp with magnetic ballast, 230V 50Hz. Improve PF from 0.3 lag to 0.7 lag. Find capacitor in μF.

**A.** $C = 5.17$ μF. Energy consumption: unchanged. Current drops from 0.58 A to 0.25 A.

---

**T7-Q2.** A single-phase motor: 12A at 0.8 PF lag, 230V 50Hz. Improve to 0.95 lag. Find condenser size.

**A.** $C = 55.98$ μF.

---

**T7-Q3.** 3-phase synchronous motor parallel with 770 kW at 0.7 PF lag. Adjust excitation to improve PF to 0.9 lag. Motor load including losses = 165 kW. Find motor PF.

**A.** Motor PF = 0.444 lead.

---

> **Note:** The following tutorials (T08–T11) are beyond the current T01–T07 exam boundary.

---

### T08 — Lighting Systems

**T8-Q1.** Replace 40 T12 fluorescent fixtures (52 W each) with LEDs. Lights operate 12 hrs/night, 365 days/year. Calculate annual energy savings.

**A.** Existing: $40 times 52 times 12 times 365 = 9{,}110$ kWh. LED replacement at 20 W each: $40 times 20 times 12 times 365 = 3{,}504$ kWh. **Saving = 5,606 kWh/yr (61.5%).**

---

**T8-Q2.** Two areas of an industrial plant have the following lighting:
- Area A: 50 × 400 W HPSV luminaires.
- Area B: 35 × 400 W HPMV luminaires.

Daylight illuminance (12 hours) is adequate in both areas. In Area B, 8 HPMV fixtures are redundant. Plant operates 8760 hrs/yr; energy costs Rs 3.00/unit. Calculate annual energy cost savings from switching off unnecessary lights and disconnecting redundant luminaires.

**A.**

*Area A — switch off 50 × 400 W for 12 hrs/day:*

Energy saved $= 50 times 0.4 times 12 times 365 = 87{,}600$ kWh; Cost saved $= 87{,}600 times 3 =$ **Rs 2,62,800**.

*Area B — remove 8 redundant (24 hrs) + switch off remaining 27 for 12 hrs:*

Redundant removed: $8 times 0.4 times 8{,}760 = 28{,}032$ kWh.
Remaining switched off: $27 times 0.4 times 12 times 365 = 47{,}304$ kWh.
Total Area B: $28{,}032 + 47{,}304 = 75{,}336$ kWh; Cost saved $= 75{,}336 times 3 =$ **Rs 2,26,008**.

---

**T8-Q3.** Twenty wall-mounted 1000 W Tungsten Halogen luminaires burn 12 hrs/day, 365 days/yr. They are replaced by 250 W HPSV lamps costing Rs 1,10,000 total. Electricity costs Rs 3.00/kWh. Find annual energy savings, cost savings, and simple payback period.

**A.**

Existing: $20 times 1.0 times 12 times 365 = 87{,}600$ kWh/yr.
Proposed: $20 times 0.25 times 12 times 365 = 21{,}900$ kWh/yr.
Energy saved $= 87{,}600 - 21{,}900 = 65{,}700$ kWh/yr.
Cost saved $= 65{,}700 times 3 =$ Rs 1,97,100/yr.
Payback $= 1{,}10{,}000 / 1{,}97{,}100 = 0.56$ years ≈ **7 months**.

---

**T8-Q4.** An industrial plant has 100 × 60 W and 140 × 100 W incandescent lamps. Replace each 100 W incandescent with one 40 W fluorescent (2400 lm) and each pair of 60 W incandescent (1320 lm each) with one 40 W fluorescent. Ballast consumption = 15 W. Lighting hours = 4,000/yr; electricity = Rs 4.0/kWh; replacement cost = Rs 135/unit. Find annual energy savings, cost savings, replacement cost, and payback.

**A.**

Existing power $= 100 times 60 + 140 times 100 = 20{,}000$ W $= 20.0$ kW.

Fluorescent lamps needed: 140 (replacing 100 W IC) + 50 (replacing pairs of 60 W IC) $= 190$.
Each fluorescent with ballast $= 40 + 15 = 55$ W.
New power $= 190 times 55 = 10{,}450$ W $= 10.45$ kW.

Annual energy saved $= (20.0 - 10.45) times 4{,}000 = 38{,}200$ kWh.
Cost saved $= 38{,}200 times 4 =$ Rs 1,52,800 ≈ Rs 1.53 lakh/yr.
Replacement cost $= 190 times 135 =$ Rs 25,650 ≈ Rs 0.26 lakh.
Payback $= 0.26 / 1.53 = 0.17$ years ≈ **2 months**.

---

**T8-Q5.** Calculate the annual energy wastage using the Illumination Level Efficiency Ratio (ILER). Given: ILER = 0.7, connected load = 990 W, operating 8 hrs/day for 300 days/year.

**A.**

$"Wastage" = (1 - "ILER") times W times t$
$= (1 - 0.7) times 990 times 8 times 300$
$= 0.3 times 990 times 2{,}400 = 712{,}800$ Wh ≈ **713 kWh/yr**.

---

### T09A — Electric Motors, Fans, and Pumps

**T9A-Q1.** Two 100-hp motors are compared: "good" (79 kW, Rs 2,400) and "premium" (77.5 kW, Rs 2,900). Running 1,600 hrs/yr at Rs 0.08/kWh, over a 10-year life at 10% discount rate, find the NPV of each alternative.

**A.**

$"PVIFA" (10%, 10) = frac(1 - 1.10^{-10}, 0.10) = 6.1446$

Good motor annual energy cost $= 79 times 1{,}600 times 0.08 =$ Rs 10,112.
Premium motor annual energy cost $= 77.5 times 1{,}600 times 0.08 =$ Rs 9,920.

$"NPV"_( "good" ) = -2{,}400 - 10{,}112 times 6.1446 = -$ Rs 64,535.
$"NPV"_( "premium" ) = -2{,}900 - 9{,}920 times 6.1446 = -$ Rs 63,855.

The **premium motor** has a lower NPV of costs (saves Rs 680 over the life) despite its higher purchase price.

---

**T9A-Q2.** A 15 HP condensate pump motor has burned out. Compare two replacements (1 HP = 0.7355 kW):

| | Motor 1 | Motor 2 |
|---|---|---|
| Cost | Rs 12,000 | Rs 8,000 |
| η at full load | 90% | 85% |
| η at half load | 86% | 82% |
| Annual maintenance | Rs 840 | Rs 480 |

Life = 20 years; salvage = 10% of cost; interest = 5%/yr; energy = Rs 0.20/kWh. Motor runs at full load 25% and half load 75% of the time. Which motor is more economical?

**A.**

Output power: full load $= 15 times 0.7355 = 11.033$ kW; half load $= 5.516$ kW.

**Motor 1:**
Full-load input $= 11.033/0.90 = 12.259$ kW; half-load input $= 5.516/0.86 = 6.414$ kW.
Weighted average $= 0.25 times 12.259 + 0.75 times 6.414 = 7.875$ kW.
Annual energy $= 7.875 times 8{,}760 = 68{,}985$ kWh; cost $= 68{,}985 times 0.20 =$ Rs 13,797.

Total annual charges: interest Rs 600 + depreciation Rs 540 + maintenance Rs 840 + energy Rs 13,798 $=$ **Rs 15,778**.

**Motor 2:**
Full-load input $= 11.033/0.85 = 12.980$ kW; half-load input $= 5.516/0.82 = 6.727$ kW.
Weighted average $= 0.25 times 12.980 + 0.75 times 6.727 = 8.290$ kW.
Annual energy $= 8.290 times 8{,}760 = 72{,}620$ kWh; cost $= 72{,}620 times 0.20 =$ Rs 14,524.

Total annual charges: interest Rs 400 + depreciation Rs 360 + maintenance Rs 480 + energy Rs 14,524 $=$ **Rs 15,764**.

**Motor 2** is marginally cheaper (Rs 14/yr less) and is recommended.

---

**T9A-Q3.** An industrial AC fan operates at 300 rpm with an outlet damper to control airflow. Using the fan affinity law $W_2 = (Q_2/Q_1)^3 times W_1$, calculate the power and energy consumption with a variable speed drive (VSD) replacing the damper, given:

| Flow | Hours | Damper power (kW) |
|---|---|---|
| 100% | 4 | 35 |
| 80% | 8 | 35 |
| 60% | 8 | 31 |
| 40% | 4 | 27 |

**A.**

Reference: $Q_1 = 100%$, $W_1 = 35$ kW. Using $W_2 = (Q_2)^3 times 35$:

| Flow | VSD power (kW) | Hours | VSD energy (kWh) | Damper energy (kWh) |
|---|---|---|---|---|
| 100% | 35.00 | 4 | 140.0 | 140.0 |
| 80% | $0.8^3 times 35 = 17.92$ | 8 | 143.4 | 280.0 |
| 60% | $0.6^3 times 35 = 7.56$ | 8 | 60.5 | 248.0 |
| 40% | $0.4^3 times 35 = 2.24$ | 4 | 9.0 | 108.0 |
| **Total** | | **24** | **352.8** | **776.0** |

Average load with damper $= 776/24 = 32.33$ kW; with VSD $= 352.8/24 = 14.70$ kW.
**Energy saved = 423.2 kWh/day (54.5%).**

---

**T9A-Q4.** A consumer needs a 50 HP (1 HP = 0.746 kW) induction motor. Two options:

| | Motor A | Motor B |
|---|---|---|
| Efficiency | 88% | 90% |
| Power factor | 0.90 | 0.81 |

Tariff: Rs 70 per kVA of maximum demand + 5 paise/kWh. Motor B's PF is raised to 0.89 with condensers costing Rs 60/kVAR. Motor B costs Rs 150 less than Motor A. Interest + depreciation = 10%; working hours = 2,400/yr. Which motor is more economical?

**A.**

Output $= 50 times 0.746 = 37.3$ kW.

**Motor A:** Input $= 37.3/0.88 = 42.39$ kW; kVA $= 42.39/0.90 = 47.10$ kVA.
Energy cost $= 42.39 times 2{,}400 times 0.05 =$ Rs 5,087.
MD charge $= 47.10 times 70 =$ Rs 3,297.
Capital charges $= 0.10 times C_A$.
Total A $= 8{,}384 + 0.10 C_A$.

**Motor B (with condenser):** Input $= 37.3/0.90 = 41.44$ kW; kVA at corrected PF $= 41.44/0.89 = 46.57$ kVA.
Energy cost $= 41.44 times 2{,}400 times 0.05 =$ Rs 4,973.
MD charge $= 46.57 times 70 =$ Rs 3,260.

Condenser sizing: $Q_("before") = 41.44 times tan(arccos 0.81) = 41.44 times 0.724 = 30.0$ kVAR.
$Q_("after") = 41.44 times tan(arccos 0.89) = 41.44 times 0.512 = 21.2$ kVAR.
$Q_("cond") = 30.0 - 21.2 = 8.8$ kVAR; cost $= 8.8 times 60 =$ Rs 528.

Total capital for B $= (C_A - 150) + 528 = C_A + 378$. Capital charges $= 0.10(C_A + 378) = 0.10 C_A + 37.8$.
Total B $= 4{,}973 + 3{,}260 + 0.10 C_A + 37.8 = 8{,}271 + 0.10 C_A$.

Difference: A − B $= 8{,}384 - 8{,}271 =$ **Rs 113/yr**. **Motor B is more economical by Rs 113/yr.**

---

**T9A-Q5.** A unit has two identical 500 kVA transformers, each with no-load (iron) loss = 800 W and full-load copper loss = 5,000 W. The plant load is 400 kVA. Compare losses for single-transformer operation versus two transformers in parallel.

**A.**

**Single transformer (400 kVA):**

$P_("loss") = 800 + 5{,}000 times (400/500)^2 = 800 + 5{,}000 times 0.64 = 800 + 3{,}200 = 4{,}000$ W.

**Two transformers (200 kVA each):**

$P_("each") = 800 + 5{,}000 times (200/500)^2 = 800 + 5{,}000 times 0.16 = 800 + 800 = 1{,}600$ W.
$P_("total") = 2 times 1{,}600 = 3{,}200$ W.

Running both transformers saves $4{,}000 - 3{,}200 =$ **800 W** at this load.

---

### T09B — HVAC Systems

**T9B-Q1.** Room air is at 25°C with relative humidity $phi = 40%$. Outside air temperature is 8°C. Using the psychrometric chart, determine whether windows in contact with the outside will become foggy.

**A.** The dew point at 25°C / 40% RH is **10°C** (read from psychrometric chart). Since the outside temperature (8°C) is below the dew point, moisture will condense on the windows. **Yes, the windows will become foggy.**

---

**T9B-Q2.** Outside air at 35°C and 60% RH is conditioned to the comfort zone by cooling and then heating. Using the psychrometric chart, determine the moisture removed, heat removed during cooling, and heat added during reheating.

**A.** (Read from psychrometric chart.)

- Moisture removed $= 11.5$ g-H₂O/kg-dry-air.
- Heat removed (cooling): $q_("cool") = 48$ kJ/kg-dry-air.
- Heat added (reheating): $q_("heat") = 10$ kJ/kg-dry-air.

---

**T9B-Q3.** Hot dry air at 40°C and 10% RH passes through an evaporative cooler and exits at 27°C. Determine the outlet RH, water added, and the lowest temperature achievable.

**A.** (Read from psychrometric chart along a constant wet-bulb line.)

- Outlet relative humidity $= 45%$.
- Water added $= 5.4$ g-H₂O/kg-dry-air.
- Lowest achievable temperature (saturation) $= 18.5$°C.

---

**T9B-Q4.** A bottling chilling system uses ethylene glycol as secondary refrigerant (designed for 40 TR). Measurements:

- Glycol entering evaporator: $T_i = -1$°C; leaving: $T_o = -4$°C.
- Flow rate: $dot(m) = 13{,}200$ kg/hr.
- $C_p = 2.34$ kcal/kg°C.
- Compressor power: 39.5 kW.

Estimate the actual TR, COP, and EER.

**A.**

Actual cooling capacity:

$"TR" = frac(dot(m) times C_p times Delta T, 3{,}024) = frac(13{,}200 times 2.34 times 3, 3{,}024) = frac(92{,}664, 3{,}024) = 30.64$ TR.

Convert to kW ($1" TR" = 3.517$ kW): $Q = 30.64 times 3.517 = 107.8$ kW.

$"COP" = Q / W_("input") = 107.8 / 39.5 = 2.73$.

$"EER" = 3.413 times "COP" = 3.413 times 2.73 = 9.32$ (in BTU/Wh).

---

**T9B-Q5.** A 20 TR package AC plant has the following measured data:

- Air velocity: 2.5 m/s; suction area: 1.2 m².
- Inlet: DB 20°C, WB 14°C, enthalpy 9.37 kcal/kg.
- Outlet: DB 12.7°C, WB 11.3°C, enthalpy 7.45 kcal/kg.
- Specific volume: 0.85 m³/kg.
- Power: compressor 10.69 kW, pump 4.86 kW, CT fan 0.87 kW.

Calculate airflow, cooling effect, compressor kW/TR, overall kW/TR, and compressor EER (kW/kW).

**A.**

Airflow $= 2.5 times 1.2 = 3.0$ m³/s $= 10{,}800$ m³/hr.
Mass flow $= 10{,}800 / 0.85 = 12{,}706$ kg/hr.

Cooling effect:

$Q = frac((9.37 - 7.45) times 12{,}706, 3{,}024) = frac(24{,}396, 3{,}024) = 8.07$ TR $= 28.3$ kW.

Compressor kW/TR $= 10.69 / 8.07 = 1.32$.
Overall kW/TR $= (10.69 + 4.86 + 0.87) / 8.07 = 16.42 / 8.07 = 2.03$.
Compressor EER $= 28.3 / 10.69 = 2.65$ kW/kW.

---

**T9B-Q6.** A 10 TR package AC plant has the following measured data:

- Air velocity: 2.27 m/s; suction area: 0.58 m².
- Inlet: DB 20°C, WB 14°C, enthalpy 9.37 kcal/kg.
- Outlet: DB 12.7°C, WB 11.3°C, enthalpy 7.45 kcal/kg.
- Specific volume: 0.8405 m³/kg.
- Power: compressor 4.71 kW, pump 2.14 kW, CT fan 0.384 kW.

Calculate airflow, cooling effect, compressor kW/TR, overall kW/TR, and compressor EER (kW/kW).

**A.**

Airflow $= 2.27 times 0.58 = 1.317$ m³/s $= 4{,}751$ m³/hr.
Mass flow $= 4{,}751 / 0.8405 = 5{,}652$ kg/hr.

Cooling effect:

$Q = frac((9.37 - 7.45) times 5{,}652, 3{,}024) = frac(10{,}852, 3{,}024) = 3.59$ TR $= 12.6$ kW.

Compressor kW/TR $= 4.71 / 3.59 = 1.31$.
Overall kW/TR $= (4.71 + 2.14 + 0.384) / 3.59 = 7.23 / 3.59 = 2.01$.
Compressor EER $= 12.6 / 4.71 = 2.68$ kW/kW.

---

### T10 — Fuels, Combustion, and Boilers

**T10-Q1.** Calculate the stoichiometric air required (kg per kg of fuel) for a liquid fuel with the following ultimate analysis: C = 85.9%, H = 12%, O = 0.7%, N = 0.5%, S = 0.5%, H₂O = 0.35%, Ash = 0.05%. GCV = 10,880 kcal/kg.

**A.**

O₂ required per kg of fuel:

$O_(C) = 0.859 times frac(32, 12) = 2.291$ kg; $O_(H) = 0.12 times 8 = 0.960$ kg; $O_(S) = 0.005 times frac(32, 32) = 0.005$ kg.

O₂ in fuel $= 0.007$ kg. Net O₂ needed $= 2.291 + 0.960 + 0.005 - 0.007 = 3.249$ kg.

Air $= 3.299 / 0.23 = $ **14.12 kg air/kg fuel**.

---

**T10-Q2.** A boiler uses biomass with ultimate analysis: C = 40%, H = 7%, N = 0.5%, O = 50.5%, S = 0.5%, Ash = 1.5%. Calculate the theoretical air required for combustion of 100 kg of dry fuel.

**A.**

O₂ required per 100 kg fuel:

$O_(C) = 40 times 32/12 = 106.67$ kg; $O_(H) = 7 times 8 = 56.0$ kg; $O_(S) = 0.5 times 32/32 = 0.5$ kg.

O₂ in fuel $= 50.5$ kg. Net O₂ $= 106.67 + 56.0 + 0.5 - 50.5 = 112.67$ kg.

Air $= 112.67 / 0.23 = $ **490 kg per 100 kg fuel**.

---

**T10-Q3.** Calculate the blow-down rate for a boiler with evaporation rate 3,000 kg/hr, maximum permissible TDS = 3,000 ppm, 10% makeup water, and feed water TDS = 300 ppm.

**A.**

$"blow-down" %= frac("TDS"_( "feed" ) times "makeup" %, "TDS"_( "max" ) - "TDS"_( "feed" )) = frac(300 times 10, 3{,}000 - 300) = frac(3{,}000, 2{,}700) = 1.11%$

Blow-down rate $= 3{,}000 times 1.11/100 = $ **33.3 kg/hr**.

---

**T10-Q4.** An oil-fired boiler generates 30 T/hr steam for 8,000 hrs/yr. Feed water TDS is reduced from 500 ppm to 200 ppm. Maximum permissible TDS = 3,000 ppm; makeup = 10%. Blow-down water at 170°C; feed water at 40°C. GCV = 10,000 kcal/kg; boiler efficiency = 80%. Calculate the annual fuel oil savings from the TDS reduction.

**A.**

Initial blow-down $= frac(500 times 10, 3{,}000 - 500) = 2.00%$

Improved blow-down $= frac(200 times 10, 3{,}000 - 200) = 0.71%$

Reduction $= 2.00 - 0.71 = 1.29%$

Blow-down saved $= 1.29 times 30 times 1{,}000 / 100 = 387$ kg/hr

Heat saved $= 387 times 1.0 times (170 - 40) = 50{,}310$ kcal/hr

Fuel saved $= 50{,}310 / (10{,}000 times 0.80) = 6.29$ kg/hr

Annual fuel saved $= 6.29 times 8{,}000 = $ **50.3 MT/yr**.

---

**T10-Q5.** A coal-fired boiler has evaporation ratio = 4. Steam enthalpy = 650 kcal/kg; feed water temperature = 65°C (h_f = 65 kcal/kg); GCV of coal = 4,000 kcal/kg. Estimate boiler efficiency.

**A.**

$eta = frac(Q times (H - h), q times "GCV") times 100 = frac(4 times (650 - 65), 1 times 4{,}000) times 100 = frac(2{,}340, 4{,}000) times 100 = 58.5%$

---

**T10-Q6.** Evaluate replacing an existing boiler (η = 80%) with a new boiler (η = 84%) costing Rs 30 lakh. Data: steam 5,000 kg/hr, enthalpy gain 600 kcal/kg, furnace oil Rs 15/kg, GCV 10,000 kcal/kg, 6,000 operating hrs/yr.

**A.**

Heat required $= 5{,}000 times 600 = 3{,}000{,}000$ kcal/hr.

Fuel (existing) $= 3{,}000{,}000 / (10{,}000 times 0.80) = 375$ kg/hr.
Fuel (new) $= 3{,}000{,}000 / (10{,}000 times 0.84) = 357.1$ kg/hr.
Fuel saved $= 375 - 357.1 = 17.9$ kg/hr.
Annual fuel saved $= 17.9 times 6{,}000 = 107{,}143$ kg.
Annual cost saved $= 107{,}143 times 15 =$ Rs 16,07,143.

Payback $= 30{,}00{,}000 / 16{,}07{,}143 = $ **1.87 years ≈ 1.85 years**.

---

### T11 — Steam, Furnaces, and Heat Exchangers

**T11-Q1.** Condensate at 10 kg/cm²g flashes to 2 kg/cm²g. Flow rate 1,000 kg/hr. Steam table data: sensible heat at 10 kg/cm²g = 185 kcal/kg; at 2 kg/cm²g = 133 kcal/kg; latent heat at 2 kg/cm²g = 650 kcal/kg. Find % flash steam and flow rate.

**A.** % flash steam $= (185-133)/650 = 8%$; flow rate $= 1000 times 0.08 = 80$ kg/hr.

---

**T11-Q2.** A counter-flow double-pipe heat exchanger heats water at 10.5 m³/hr using a hot process liquid. Process enters at 180°C and leaves at 130°C. Water enters at 30°C and leaves at 90°C. $C_p$ of water = 4.18 kJ/kg°C; overall heat transfer coefficient $U = 814$ W/m²°C. Calculate the heat transfer area for counter flow and the percentage increase if the flows were parallel.

**A.**

Water flow $= 10.5 times 1{,}000 = 10{,}500$ kg/hr.

Heat duty: $Q = 10{,}500 times 4.18 times (90 - 30) = 2{,}633{,}400$ kJ/hr $= 731.5$ kW.

*Counter-flow LMTD:*

$Delta T_1 = 180 - 90 = 90$°C; $Delta T_2 = 130 - 30 = 100$°C.

$"LMTD" = frac(100 - 90, ln(100/90)) = frac(10, 0.1054) = 94.9 approx 95$°C.

$A_("counter") = frac(731{,}500, 814 times 95) = frac(731{,}500, 77{,}330) = 9.5$ m².

*Parallel-flow LMTD:*

$Delta T_1 = 180 - 30 = 150$°C; $Delta T_2 = 130 - 90 = 40$°C.

$"LMTD" = frac(150 - 40, ln(150/40)) = frac(110, 1.322) = 83.2 approx 83$°C.

$A_("parallel") = frac(731{,}500, 814 times 83) = frac(731{,}500, 67{,}562) = 10.8$ m².

Increase $= frac(10.8 - 9.5, 9.5) times 100 = $ **14%**.

---

**T11-Q3.** A textile plant recovers condensate (1,000 kg/hr at 10 bar) to generate flash steam at 2 bar for low-pressure process use. Data: sensible heat at 10 bar = 188 kcal/kg; at 2 bar = 135 kcal/kg; latent heat at 2 bar = 518 kcal/kg; boiler efficiency = 82%; GCV of fuel oil = 10,200 kcal/kg; recovered condensate temperature = 95°C; makeup water = 35°C; 8,000 operating hrs/yr. Calculate flash steam recovered and annual fuel oil savings from condensate recovery.

**A.**

Flash steam $% = (188 - 135) / 518 = 10.2%$

Flash steam recovered $= 1{,}000 times 0.102 = 102$ kg/hr

Condensate available after flash $= 1{,}000 - 102 = 898$ kg/hr

Heat recovered $= 898 times (95 - 35) = 53{,}880$ kcal/hr

Fuel oil saved $= frac(53{,}880 times 8{,}000, 0.82 times 10{,}200) = frac(431{,}040{,}000, 8{,}364) =$ **51.5 tonnes/yr**.

---

**T11-Q4.** A liquid waste stream (3.5 kg/s, 70°C, $C_p$ = 4190 J/kgK) pre-heats boiler make-up water (2 kg/s, 10°C, $C_p$ = 4190 J/kgK). $U = 800$ W/m²K. Required make-up exit temperature = 50°C. No heat losses. Determine the heat transfer rate, effluent exit temperature, LMTD, and heat exchanger area.

**A.**

Heat transfer rate:

$Q = dot(m)_c times C_p times Delta T_c = 2 times 4{,}190 times (50 - 10) = 335{,}200$ W $= 335.2$ kW.

Effluent exit temperature:

$335{,}200 = 3.5 times 4{,}190 times (70 - T_("out"))$

$T_("out") = 70 - frac(335{,}200, 14{,}665) = 70 - 22.86 = 47.1$°C.

Counter-flow LMTD:

$Delta T_1 = 70 - 50 = 20$°C; $Delta T_2 = 47.1 - 10 = 37.1$°C.

$"LMTD" = frac(37.1 - 20, ln(37.1/20)) = frac(17.1, 0.620) = 27.7$°C.

Area:

$A = Q / (U times "LMTD") = 335{,}200 / (800 times 27.7) =$ **15.1 m²**.
