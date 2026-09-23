---
title: "07 - PV System Design and MPPT"
math_syntax: typst
---

# PV System Design and MPPT

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## From Solar Cell to PV Module

A single solar cell produces only a small amount of power (typically $V_m = 0.5$ V, $I_m = 5$ A, $P_m = 2.5$ W). To generate useful power, many cells are interconnected to form a **PV module** (panel).

**Series connection** (voltages add, current same): $V_"module" = N_s V_"cell"$, $I_"module" = I_"cell"$

**Parallel connection** (currents add, voltage same): $V_"module" = V_"cell"$, $I_"module" = N_p I_"cell"$

**Combined array** with $N_s$ cells in series per string and $N_p$ strings in parallel:

$V_"array" = N_s V_"cell"$, $I_"array" = N_p I_"cell"$, $P_"array" = N_s N_p P_"cell"$

**Mismatch losses:** In practice, cells are not perfectly identical. In a series string, current is limited by the cell with the lowest current. In parallel, voltage is limited by the cell with the lowest voltage. Bypass diodes mitigate these losses.

## PV System Sizing Methodology

A standalone PV system consists of a PV array, charge controller, battery bank, inverter (for AC loads), and loads.

### Step 1: Load Estimation

$"Total Daily Load (Wh/day)" = sum ("Power (W)" times "Hours of use/day")$

### Step 2: PV Array Sizing

$W_p = "Total Daily Load" / ("Peak Sun Hours" times eta_"sys" times "Operating Factor")$

where $eta_"sys" = eta_"charge" times eta_"battery" times eta_"inverter"$ and the operating factor (performance ratio) is typically 0.6–0.8.

$N_"modules" = W_p / "Power rating of one module (Wp)"$

### Step 3: Battery Bank Sizing

$"Battery Capacity (Ah)" = ("Daily Load" times "Days of Autonomy") / ("Battery Voltage" times "DoD" times eta_"battery")$

where Days of Autonomy covers consecutive cloudy days, DoD (depth of discharge) is typically 0.5 for lead-acid, and $eta_"battery"$ is 0.8–0.9.

### Step 4: Inverter Sizing

$"Inverter VA Rating" >= "Total AC Load Power" / "Power Factor"$

A 25% safety margin is common.

## Maximum Power Point Tracking (MPPT)

### The Problem

A PV module's I-V curve changes with irradiance and temperature. The MPP is where $P = V I$ is maximum. Connecting directly to a fixed load rarely coincides with the MPP, causing power loss.

### The Solution

An **MPPT** is an electronic DC-DC converter that continuously adjusts the operating point to maintain MPP. It acts as a variable impedance transformer: $V_"mp" I_"mp" approx V_"load" I_"load"$ (minus converter losses).

### DC-DC Converter Topologies

**Buck (step-down):** $V_o / V_"in" = D$ where $D$ is duty cycle ($0 < D < 1$). Used when PV voltage exceeds battery/load voltage.

**Boost (step-up):** $V_o / V_"in" = 1 / (1 - D)$. Used when PV voltage is below battery/load voltage.

**Buck-boost:** $V_o / V_"in" = -D / (1 - D)$ (negative sign indicates polarity inversion). Most versatile for MPPT.

### MPPT Control Algorithm

1. A reference cell provides $V_"ref" = K V_"oc"$, where $K = V_"mp" / V_"oc"$ (typically 0.7–0.8).
2. The actual module voltage $V_"module"$ is compared to $V_"ref"$.
3. Error $e = V_"module" - V_"ref"$ drives a controller that adjusts the duty cycle $D$ to drive the error to zero, forcing $V_"module" approx V_"mp"$.

## PV System Configurations

### Stand-Alone System

PV array + charge controller + battery bank + inverter. Powers loads independently of the grid. The battery stores energy for nighttime and cloudy periods. Applications: remote homes, telecom towers, water pumping, street lighting.

### Grid-Interactive (Grid-Tied) System

PV array + grid-tie inverter (with anti-islanding protection) + net meter. Excess power is fed into the grid (net metering); power is drawn when PV output is insufficient. No battery storage in basic systems.

### Hybrid System

PV array + charge controller + battery bank + inverter + backup generator (e.g., diesel genset). Combines stand-alone and grid-interactive features; can operate in island or grid-connected mode.

## Revision Checklist

- [ ] Calculate module voltage and current for series-parallel arrays
- [ ] Explain mismatch losses and the role of bypass diodes
- [ ] Size a PV system: load estimation, array sizing, battery sizing, inverter sizing
- [ ] Explain MPPT purpose and operating principle
- [ ] Derive voltage conversion ratios for buck, boost, and buck-boost converters
- [ ] Compare stand-alone, grid-interactive, and hybrid system configurations
