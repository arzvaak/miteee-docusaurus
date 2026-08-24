---
title: 'Energy Auditing Formula and Revision Sheet'
sidebar_label: 'Energy Auditing Formula and Revision Sheet'
sidebar_position: 301
description: 'Course-wide exam revision and provenance support for Energy Auditing (ELE 4446).'
tags:
  - energy-auditing
  - ele-4446
  - support
---

# Energy Auditing Formula and Revision Sheet


## Electrical systems

- Three-phase real power: $P=\sqrt{3}V_L I_L\cos\phi$; apparent power: $S=\sqrt{3}V_LI_L$.
- Power-factor correction: $Q_c=P(\tan\phi_1-\tan\phi_2)$ in kVAr when $P$ is in kW.
- Energy: $E=P\,t$; keep kW and hours to obtain kWh.
- Motor input: $P_{in}=P_{out}/\eta_m$.

## Pumps, fans and variable speed

- Affinity laws: $Q_2/Q_1=N_2/N_1$, $H_2/H_1=(N_2/N_1)^2$, $P_2/P_1=(N_2/N_1)^3$.
- Hydraulic power: $P_h=\rho gQH$; shaft/input power follows by dividing by efficiencies.

## Thermal systems

- Sensible heat: $Q=m c_p(T_2-T_1)$.
- Boiler efficiency: $\eta=\dfrac{\text{heat in steam}}{\text{heat in fuel}}\times100$.
- Flash fraction: $x=\dfrac{h_{f1}-h_{f2}}{h_{fg2}}$.
- Heat exchanger: $Q=UA\Delta T_{lm}$, where $\Delta T_{lm}=\dfrac{\Delta T_1-\Delta T_2}{\ln(\Delta T_1/\Delta T_2)}$.

## Monitoring, tariffs and finance

- Load factor $=\dfrac{\text{average load}}{\text{maximum demand}}=\dfrac{\text{kWh}}{\text{maximum kW}\times\text{hours}}$.
- Regression baseline: $E=a+bP$; CUSUM is the running sum of actual minus expected energy.
- Simple payback $=\text{investment}/\text{annual saving}$.
- $NPV=-I_0+\sum_t\dfrac{CF_t}{(1+r)^t}$; IRR is the rate giving $NPV=0$.

## Unit traps

- $1\ \text{kWh}=3{,}600\ \text{kJ}$; $1\ \text{MW}=1{,}000\ \text{kW}$.
- Convert m³/hr to m³/s before using $\rho gQH$.
- Use efficiencies as decimals during substitution, then convert the final ratio to percent.
