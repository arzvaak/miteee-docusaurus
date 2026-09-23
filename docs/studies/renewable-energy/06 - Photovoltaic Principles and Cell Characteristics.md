---
title: "06 - Photovoltaic Principles and Cell Characteristics"
math_syntax: typst
---

# Photovoltaic Principles and Cell Characteristics

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## The Photovoltaic Effect

The **photovoltaic (PV) effect** is the generation of a voltage across a p-n junction in a semiconductor due to absorption of light radiation.

### Photon Energy and Band Gap

Light consists of photons. For a semiconductor to absorb a photon and create an electron-hole pair, the photon's energy must exceed the material's **band gap energy** $E_g$:

$E = h nu = (h c) / lambda$

where $h = 6.626 times 10^(-34)$ J·s is Planck's constant, $nu$ is frequency, $c = 3 times 10^8$ m/s, and $lambda$ is wavelength.

For practical solar cell calculations in electron-volts and micrometres:

$E " (eV)" = 1.24 / lambda " (µm)"$

**Example:** For a CdS cell with $E_g = 2.42$ eV: $lambda = 1.24 / 2.42 approx 0.512$ µm.

### The p-n Junction

A solar cell is a large-area p-n junction diode:

1. **Intrinsic semiconductor:** Pure silicon has 4 valence electrons in covalent bonds, giving very low conductivity.
2. **Doping:** Pentavalent elements (P, As) create n-type (extra free electrons); trivalent elements (B) create p-type (holes).
3. **Junction formation:** Electrons diffuse from n to p, holes from p to n, creating a **depletion region** with a built-in electric field directed from n to p.

### Generation of Photocurrent

When light strikes the cell:
1. Photons with $E >= E_g$ are absorbed, creating electron-hole pairs.
2. The built-in field sweeps electrons to the n-side, holes to the p-side.
3. This charge separation creates a photovoltage.
4. With an external circuit, electrons flow from n-side through the load to p-side — direct current.

## Equivalent Circuit Models

### Ideal Model

An illuminated cell is modeled as a current source $I_"SC"$ (proportional to irradiance) in parallel with a diode:

$I = I_"SC" - I_d = I_"SC" - I_0 (e^((q V) / (k T)) - 1)$

where $I$ is output current, $V$ is output voltage, $I_0$ is the reverse saturation current, $q = 1.602 times 10^(-19)$ C is the electron charge, and $k = 1.381 times 10^(-23)$ J/K is Boltzmann's constant.

At 25°C (298 K), $k T / q approx 0.0257$ V, giving:

$I = I_"SC" - I_0 (e^(38.9 V) - 1)$

### Practical Model (with Resistances)

Real cells have series resistance $R_s$ (semiconductor, contacts) and parallel (shunt) resistance $R_p$ (leakage). Low $R_s$ and high $R_p$ are desirable:

$I = I_"SC" - I_0 [exp((q(V + I R_s)) / (k T)) - 1] - (V + I R_s) / R_p$

**Rules of thumb for low losses:**
- For losses < 1% due to $R_p$: $R_p > (100 V_"OC") / I_"SC"$
- For losses < 1% due to $R_s$: $R_s < (0.01 V_"OC") / I_"SC"$

## Key PV Cell Parameters

| Parameter | Symbol | Definition | Typical (Si) |
| :--- | :---: | :--- | :--- |
| Short-circuit current | $I_"SC"$ | Maximum current when terminals are shorted ($V = 0$) | 25–40 mA/cm² |
| Open-circuit voltage | $V_"OC"$ | Maximum voltage when terminals are open ($I = 0$) | 0.5–0.7 V |
| Maximum power point | $P_"MPP"$ | Operating point ($V_m, I_m$) where $P = V I$ is maximum | — |
| Fill factor | $FF$ | $FF = (V_m I_m) / (V_"OC" I_"SC")$; closer to 1 is better | 0.7–0.85 |
| Efficiency | $eta$ | $eta = (FF dot V_"OC" dot I_"SC") / (P_"in" dot A)$ | 15–22% |

### I-V and P-V Curves

The I-V curve connects $(0, I_"SC")$ to $(V_"OC", 0)$. The P-V curve peaks at the MPP.

**Effect of insolation:** $I_"SC"$ increases linearly; $V_"OC"$ increases logarithmically (small change). Power output increases almost linearly.

**Effect of temperature:** $V_"OC"$ decreases significantly (~−2.3 mV/°C for Si); $I_"SC"$ increases slightly. Overall, efficiency and power decrease with rising temperature.

## Design and Performance Analysis

### Calculating Required PV Area

$P_"out" = P_"in" dot eta dot A$

**Example:** Area of 25% efficient cells to power a 400 W computer under 200 W/m² insolation:

$A = P_"out" / (P_"in" dot eta) = 400 / (200 times 0.25) = 8 " m"^2$

### Worked Example: Efficiency Calculation

**Problem:** Heterojunction solar cell, $A = 6 " cm"^2$, $V_"OC" = 400$ mV, $I_"SC" = 200$ mA under 0.8 sun insolation. $FF = 80%$. Find efficiency.

**Solution:**

Input power: 1 sun = 100 mW/cm², so $P_"in" = 0.8 times 100 = 80$ mW/cm².

Total incident power: $P_"in,total" = 80 times 6 = 480$ mW = 0.48 W.

Maximum output power: $P_"MPP" = V_"OC" dot I_"SC" dot FF = 0.4 times 0.2 times 0.80 = 0.064$ W.

Efficiency: $eta = 0.064 / 0.48 = 0.1333 = 13.33%$

## Advantages and Limitations

**Advantages:** Direct conversion with no moving parts; highly reliable; low maintenance; scalable from microwatts to megawatts; environmentally friendly; no fuel consumption.

**Limitations:** High initial capital cost; intermittent generation; efficiency affected by temperature, shading, and angle of incidence; large area needed for significant power.

## Revision Checklist

- [ ] Explain the photovoltaic effect and p-n junction formation
- [ ] Derive or state the ideal I-V equation
- [ ] Explain the role of series and shunt resistance
- [ ] Define and calculate $I_"SC"$, $V_"OC"$, $FF$, and $eta$
- [ ] Draw I-V and P-V curves and explain effects of insolation and temperature
- [ ] Calculate PV area and efficiency from given parameters
