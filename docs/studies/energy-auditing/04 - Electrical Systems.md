---
title: "04 - Electrical Systems"
math_syntax: typst
---

# 04 — Electrical Systems

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> *Covers L06 (Electrical Power Systems), L07 (Load Curves and Load Factor), L08 (Power Factor Improvement), L09 (Electrical Energy Tariffs), and L10 (Demand-Side Management)*

---

## 4.1 Electrical Power System Structure

### Typical Power Supply Chain

**Generation → Transmission → Distribution → Consumer**

- **Generation:** Thermal (coal, gas, diesel), hydro, nuclear, renewable.
- **Transmission:** High voltage (132 kV, 220 kV, 400 kV, 765 kV) to minimize losses.
- **Distribution:** Step-down to consumer voltage (415 V / 230 V three-phase / single-phase).

### Interconnected Grid System

The connection of several generating stations in parallel is known as an **interconnected grid system**.

**POSOCO** (now **GRID-India** / Grid Controller of India Limited) ensures integrated operation of the grid in a reliable, efficient, and secure manner. It consists of **5 Regional Load Dispatch Centers (RLDCs)** and a **National Load Dispatch Centre (NLDC)**.

| RLDC | Location | Regions Covered |
|---|---|---|
| NRLDC | Delhi | Punjab, Haryana, Rajasthan, HP, J&K, Uttarakhand, UP, Chandigarh, Delhi |
| WRLDC | Mumbai | Maharashtra, Gujarat, MP, Chhattisgarh, Goa, D&NH and D&D |
| SRLDC | Bengaluru | AP, Telangana, Karnataka, Kerala, Tamil Nadu, Puducherry |
| ERLDC | Kolkata | West Bengal, Bihar, Jharkhand, Odisha, Sikkim |
| NERLDC | Shillong | Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura |

### Thermal Power Plant Operation

- 70% of India's power capacity is coal-based thermal.
- Coal is pulverized to talcum-powder consistency.
- Burnt at **1300 °C** inside the boiler.
- Combustion gas converts water to high-pressure steam.
- Steam spins the turbine coupled to the generator.

---

## 4.2 Load Curves and Load Factor

### Definitions

| Term | Definition |
|---|---|
| **Connected load** | Sum of continuous ratings of all equipment connected to the supply system |
| **Maximum demand** | Greatest demand on the power station during a given period |
| **Demand factor** | Maximum demand / Connected load |
| **Average load** | Average of loads occurring on the station in a given period (day/month/year) |
| **Load factor** | Average load / Maximum demand |

### Load Factor Formula

$$   "Load Factor" = frac("Average Load", "Maximum Demand") = frac("kWh generated", "Maximum kW" times "hours")   $$

- A **higher load factor** means more uniform utilization of generating capacity.
- Load factor = 100% → flat load curve (ideal).
- Load factor = 10% → very spiky load (inefficient).

### Types of Loads

1. **Domestic** — residential consumers.
2. **Commercial** — offices, shops.
3. **Industrial** — factories, manufacturing.
4. **Municipal** — street lighting, water supply, drainage.
5. **Irrigation** — pumps driven by motors for field supply.
6. **Traction** — tram cars, trolley buses, railways.

### Maximum Demand Control

Step-by-step approach:

1. **Load curve generation** — understand the pattern.
2. **Rescheduling of loads** — shift non-essential loads to off-peak.
3. **Storage of products/process utilities** — e.g., ice made in lean period, used in peak.
4. **Shedding of non-essential loads** during peak periods.
5. **Operation of captive/diesel generation sets.**
6. **Power factor improvement.**

### Worked Example

Maximum demand = 100 MW; annual load factor = 40%.

$$   "Energy" = 100 " MW" times 8760 " h" times 0.40 = 350{,}400 " MWh" = 3504 times 10^5 " kWh"   $$

### Electricity Billing Components

- Maximum demand charges
- Energy charges (kWh / kVAh)
- Power factor penalty
- Fuel cost adjustment charges
- Meter rentals
- Time-of-day charges
- Fine for exceeding contract demand

### Electronic Energy Meters

Advantages: substantial memory, high accuracy (up to 0.2 class), TOD tariff capability, tamper detection, harmonics and THD measurement, long service life (no moving parts), remote data access.

### Commercial Loss Reduction

- Accurate metering (metering plan with sustained accuracy).
- Appropriate meter range for connected load.
- Electronic meters with TOD, tamper-proof, remote reading.
- Intensive inspections.
- Compulsory metering — avoid average billing.
- Use energy audit to pinpoint areas of high losses.
- Eradication of theft.

---

## 4.3 Power Factor

### Definition

The **power factor** is the cosine of the angle between voltage and current in an AC circuit:

$$   cos(phi) = frac("Active Power (kW)", "Apparent Power (kVA)") = frac("kW", "kVA")   $$

### Power Triangle

$$   "kVA"^2 = "kW"^2 + "kVAR"^2   $$

- **Active (wattful) component:** $I cos(phi)$ — performs useful work.
- **Reactive (wattless) component:** $I sin(phi)$ — creates magnetic domain (inductors) or electric field (capacitors).
- Power factor can never exceed unity.
- Conventionally described as "lagging" (inductive) or "leading" (capacitive).

### Benefits of Power Factor Improvement

1. **Reduced kVA demand charges** — for the same kW load, improving PF reduces kVA.
2. **Reduced I²R losses** in cables and transformers.
3. **Improved voltage regulation.**
4. **Released system capacity** — freed kVA can serve additional load.

### Capacitor Sizing for PF Correction

$$   Q_c = P(tan(phi)_1 - tan(phi)_2)   $$

where $P$ is real power in kW, $phi_1$ is the original power factor angle, and $phi_2$ is the target power factor angle.

For three-phase:

$$   Q_c = sqrt(3)   V_L   I_L   (sin(phi)_1 - sin(phi)_2)   $$

Or using kVA:

$$   Q_c = P(tan(phi)_1 - tan(phi)_2) " kVAR"   $$

### Optimum Power Factor

Annual savings in kVA charges:

$$   S = x P(sec(phi)_1 - sec(phi)_2) - y P(tan(phi)_1 - tan(phi)_2)   $$

where $x$ = Rs/kVA per annum and $y$ = Rs/kVAR of PF correction equipment per annum.

Maximum savings when $(d S) / (d phi_2) = 0$.

### Worked Example

A 40W fluorescent lamp with magnetic ballast, 230V, 50Hz. Improve PF from 0.3 lag to 0.7 lag.

$$   C = frac(Q_c, 2pi f V^2) = frac(P(tan(phi)_1 - tan(phi)_2), 2pi f V^2)   $$

- $tan(arccos 0.3) = 3.18$, $tan(arccos 0.7) = 1.02$
- $Q_c = 0.040 times (3.18 - 1.02) = 0.0864$ kVAR = 86.4 VAR
- $C = 86.4 / (2pi times 50 times 230^2) = 5.17 mu$F

**After PF improvement:** energy consumption unchanged; current drops from 0.58 A to 0.25 A.

---

## 4.4 Electrical Energy Tariffs

**Tariff** = the rate at which electrical energy is supplied to a consumer. It covers the cost of producing and supplying energy plus a reasonable profit.

### Factors Affecting Tariff

1. Amount of energy used.
2. Type of load.
3. Time at which load is required.
4. Power factor of the load.

### Types of Tariff

| Type | Formula / Description |
|---|---|
| **Flat Demand Rate** | $C = A x$; depends only on maximum demand; no metering; used for street lights, irrigation |
| **Straight-line (Simple)** | $C = B y$; depends on energy consumption; different meters for different types |
| **Block Rate** | Energy divided into blocks; price decreases with each block |
| **Two-part** | $"Total Cost" = [A("kW") + B("kWh")]$ Rs; fixed + running charges |
| **Three-part** | Applied to large consumers; adds a third component |
| **Power Factor** | Depends on load PF: kVA maximum demand, kWh and kVARh, sliding scale |
| **Peak-load** | Higher price for on-peak usage; lower for off-peak |
| **Seasonal** | Varies over the year |
| **Time-of-day** | Varies by time of day (TOD) |

### Economic Load Dispatch

The process of allocating generation levels to generating units so that the system load is supplied entirely and most economically. Fuel cost is the major portion of operating cost.

---

## 4.5 Demand-Side Management (DSM)

### Definition

DSM encompasses **actions taken on the customer side of the electricity meter** (the "demand side"): energy efficiency measures, fuel switching, distributed generation, and pricing initiatives (TOD and demand-based tariffs).

More formally: planning, implementation, and evaluation of programs to influence the **amount** or **timing** of energy usage by consumers.

### DSM vs Supply-Side Management

| Demand-Side Management | Supply-Side Management |
|---|---|
| After the consumer meter | Before the consumer meter |
| Reduce power, reduce energy, shift time of use | Increase generation capacity, improve efficiency, reduce T&D losses |
| No reduction in service quality | — |

### Supply-Side Measures

- Fuel efficiency improvements.
- Reduce parasitic loads, transformer losses, line losses.
- Optimizing generator loading.
- Maintaining high power factor.
- Managing the distribution system optimally.

### DSM Objectives

1. Improve the efficiency of energy systems.
2. Reduce financial needs to build new generation facilities.
3. Minimize adverse environmental impacts.
4. Lower the cost of delivered energy.
5. Reduce power shortages and power cuts.
6. Improve reliability and quality of power supply.

### DSM Programs in India

- **UJALA (Unnat Jyoti by Affordable LEDs for All):** 37 crore LED lamps distributed; peak demand saved: 9,528 MW.
- **PAT (Perform, Achieve and Trade):** market-based mechanism for energy-intensive industries.
- **EESL (Energy Efficiency Services Limited):** implements DSM programs.
- **Standards & Labeling:** BEE star rating for appliances.

### DSM Implementation Cycle

1. **Assessment** — identify DSM potential.
2. **Program design** — select measures.
3. **Implementation** — deploy programs.
4. **Monitoring & verification** — track savings.
5. **Evaluation** — assess effectiveness.

### Role of BEE / Ministry of Power

- Coordination with central and state agencies.
- Capacity building for DSM stakeholders.
- Training programs for design and implementation.
- Creating awareness about energy conservation.
- Support to Energy Regulatory Commissions / utilities.

---

## Revision Checklist

- [ ] Power supply chain: generation → transmission → distribution
- [ ] Interconnected grid and POSOCO/GRID-India
- [ ] Load curve, load factor formula and types of loads
- [ ] Maximum demand control methods
- [ ] Power factor definition and power triangle
- [ ] Capacitor sizing for PF correction
- [ ] Types of electrical tariffs (at least five)
- [ ] DSM definition, objectives, and DSM vs supply-side
- [ ] UJALA, PAT, EESL programs
- [ ] DSM implementation cycle
