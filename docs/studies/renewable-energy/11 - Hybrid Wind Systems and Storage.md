---
title: "11 - Hybrid Wind Systems and Storage"
math_syntax: typst
---

# Hybrid Wind Systems and Storage

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## The Need for Hybridization

A **hybrid energy system** combines two or more energy sources to provide more reliable and continuous power than a single source alone. Wind energy is intermittent; hybridization addresses this by coupling wind with other generation sources and/or energy storage.

Key motivations: increasing total energy yield, fulfilling consumer demand more stably, providing uninterrupted power supply, and optimizing for both off-grid and on-grid applications.

## Solar-Wind Hybrid Systems

The most common configuration, leveraging complementary resources: wind speeds are often higher at night and in winter, while solar peaks during the day and in summer.

### Components and Working

1. **PV array:** Converts sunlight to DC electricity
2. **Wind generator (WTG):** Converts wind kinetic energy to electricity (typically AC, rectified to DC)
3. **Lead-acid storage batteries:** Store excess energy
4. **Inverter:** Converts DC to AC for loads
5. **Loads, fuse/junction boxes, wiring, test instruments**

The PV and wind generator operate independently, feeding a common DC bus via charge controllers. The battery bank is connected to this bus. The inverter draws from the DC bus for AC loads. The controller manages energy flow: direct use first, then battery charging, then load supply.

### Advantages and Limitations

| Advantages | Limitations |
| :--- | :--- |
| Best for remote area power systems | Infrastructure cost may be high |
| Two diverse sources reduce outage risk | Too labour-intensive |
| 24-hour power generation capability | Wind turbines have cut-in/cut-out limits |
| Green energy | Not suited for large-scale production |

## Wind-Diesel Hybrid Systems

Designed to reduce diesel fuel consumption in remote off-grid areas.

### Configuration

Wind turbine generator (WTG) + diesel generator (DG) with synchronous generator + control system. The WTG and DG operate in parallel; the control system minimizes fuel consumption. When wind is sufficient, the WTG supplies the load; if it cannot meet full load, the DG starts for the remaining power.

The economic trade-off pits wind power cost against diesel fuel and maintenance cost. The DG reduces the need for large battery banks and lowers emissions and fuel transport compared to pure diesel systems.

## Energy Storage Technologies

| Technology | Energy Density | Power Density | Cycle Life | Application |
| :--- | :--- | :--- | :--- | :--- |
| Lead-acid battery | Medium | Medium | Moderate | Off-grid backup, long-term storage |
| Lithium-ion battery | High | High | Higher than lead-acid | EVs, grid storage |
| Pumped hydro | Very high | Low | Very high (>50,000) | Grid-scale bulk storage |
| CAES | High | Medium | High (>10,000) | Grid-scale storage |
| Flywheel | Low | Very high | Very high (>100,000) | Power quality, short-term bursts |
| Ultracapacitor | Very low | Very high | Highest (>500,000) | Short-term power buffering |

### Battery Storage

Electrochemical storage: electrical energy is converted to chemical energy during charging and reversed during discharging. Lead-acid is common and lower cost; lithium-ion offers superior energy density. Cycle life is a key challenge affecting long-term economics.

### Pumped Hydroelectric Storage

Uses two reservoirs at different elevations. During low demand/excess generation, water is pumped from lower to upper reservoir. During high demand, water is released through a dam to generate electricity. Suitable for large-scale, grid-level storage but geographically constrained.

### Compressed Air Energy Storage (CAES)

Stores energy as compressed air, often in underground caverns. During excess generation, electric motors compress air; during demand, compressed air is released through a turbine. Has been used for decades, especially in mining.

### Flywheels and Ultracapacitors

**Flywheels** store kinetic energy in a high-speed rotating mass. Similar to ultracapacitors in rapid charge/discharge capability but not suited for long-term storage.

**Ultracapacitors** store energy electrostatically, providing short-term high burst power. They perform hundreds of thousands of cycles with minimal degradation and are less vulnerable to temperature changes.

## Worked Example: Hybrid System Sizing

**Problem:** Standalone PV-WECS-battery system. Load: $P_"dem,min" = 1$ MW, $P_"dem,max" = 9$ MW, $P_"dem,avg" = 6$ MW. Capacity factors: $K_"cf,wtg" = 16%$, $K_"cf,PV" = 10%$. Given: $P_"PV,rated" = 20$ MW.

**i) Rated power of WECS:**

$P_"dem,avg" = (P_"PV,rated" K_"cf,PV") + (P_"WECS,rated" K_"cf,wtg")$

$6 = (20 times 0.10) + (P_"WECS,rated" times 0.16)$

$P_"WECS,rated" = (6 - 2) / 0.16 = 25 " MW"$

**ii) Number of 1 MW WTG units:** $25 / 1 = 25$ units

**iii) Maximum possible excess power:**

$P_"gen,total" = 20 + 25 = 45$ MW

$P_"excess,max" = 45 - 9 = 36$ MW

(This is the theoretical maximum if both sources operate at full capacity simultaneously, which is unlikely.)

## Control Strategy

For a hybrid system connected to a utility grid:

1. **Renewable generation > load:** Excess charges the battery; if full, excess exports to grid.
2. **Renewable generation < load:** Deficit drawn from battery first; if battery SoC falls below threshold, power imports from grid.
3. **Grid outage:** System operates in islanded mode, battery and renewables supply local load.

## Revision Checklist

- [ ] Explain the rationale for hybridizing wind energy systems
- [ ] Describe solar-wind hybrid system components and working
- [ ] Explain wind-diesel hybrid system operation and trade-offs
- [ ] Compare battery, pumped hydro, CAES, flywheel, and ultracapacitor storage
- [ ] Size a hybrid system using capacity factors
- [ ] Describe control strategies for grid-connected hybrid systems
