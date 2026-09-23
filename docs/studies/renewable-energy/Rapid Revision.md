---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

Concise chapter-by-chapter summary for final revision. Each section contains the essential definitions, formulas, and key points.

---

## Ch 1 — Energy Classification and Global Reserves

- **Primary energy:** Found in nature, no conversion needed (coal, oil, wind, solar)
- **Secondary energy:** Converted form (electricity, gasoline, hydrogen)
- **Conventional:** Fossil fuels + nuclear + large hydro (depletable, carbon-intensive)
- **Non-conventional:** Solar, wind, small hydro, biomass, tidal, geothermal (inexhaustible)
- **Commercial:** Traded for a price; **Non-commercial:** Gathered directly (firewood, dung)
- Coal reserves: 1,156 billion tonnes (USA 25.4%, Russia 15.9%, India 8.6%)
- Oil reserves: 1.65 trillion barrels; R/P ratio ~47 years
- Gas reserves: 7,257 trillion cubic feet
- Developed nations (~20% population) consume ~60% of energy

## Ch 2 — Advanced Energy Conversion Technologies

- **FBC:** Clean coal tech, fluidized bed at ~900°C, 90–92% combustion efficiency, low NOₓ/SO₂
- **MHD:** Faraday's law $E = v B$; open-cycle plasma at ~2800°C; target efficiency 50–65%; no moving parts
- **Thermionic:** Thermionic emission from hot cathode (~2300 K); $V ≈ phi_c - phi_a$; efficiency ~38% target 60%
- **Fuel cell:** Electrochemical H₂ + O₂ → H₂O; PEM at ~80°C; higher than Carnot efficiency; no moving parts
- All four are direct conversion technologies (no steam turbine intermediate)

## Ch 3 — Renewable Energy Characteristics

- Advantages: low/zero emissions, fuel cost stability, scalability, energy independence
- Disadvantages: intermittency, high CAPEX, storage costs, land use
- Geothermal gradient: ~30°C/km; hydrothermal (>150°C), HDR, magma
- Plant types: dry steam (~165°C, 14% eff), flash steam (>180°C), binary cycle (100–150°C)
- India potential: 10,600 MW; Puga Valley (Ladakh) flagship site

## Ch 4 — Solar Radiation

- Solar constant: $I_"sc" = 1353$ W/m²
- Extraterrestrial: $I/I_"sc" = 1 + 0.033 cos(360n/365)$
- Declination: $delta = 23.45 sin((360/365)(284 + n))$
- Zenith: $cos(theta_z) = sin phi sin delta + cos phi cos delta cos omega$
- Sunrise: $cos omega_s = -tan phi tan delta$; Day length: $t_d = (2/15) arccos(-tan phi tan delta)$
- South-facing tilt: $cos theta = cos(phi-s) cos delta cos omega + sin(phi-s) sin delta$
- LST = IST − 4(Std Lon − Local Lon) + EoT
- Air mass: $"AM" = 1/cos theta_z$; AM1.5 at ~48.2° zenith
- Ångström-Prescott: $H_g/H_0 = a + b(overline(n)/N)$
- Instruments: pyrheliometer (beam), pyranometer (global), sunshine recorder

## Ch 5 — Solar Thermal Collectors

- Flat-plate: non-concentrating, <100°C, no tracking, collects beam + diffuse
- Concentrating: parabolic trough (line), dish (point), central receiver, CPC; need tracking
- $C = A_"aperture"/A_"absorber"$
- Evacuated tube: vacuum eliminates convection losses, better in cold/cloudy
- Solar water heating: passive (thermosiphon) vs active (direct/indirect)
- $Q_u = A_c F_R [I tau alpha - U_L(T_i - T_a)]$
- $eta = F_R tau alpha - F_R U_L(T_i - T_a)/I$

## Ch 6 — Photovoltaics

- $E = 1.24/lambda$ (eV, µm)
- Ideal: $I = I_"SC" - I_0(e^(q V/(k T)) - 1)$
- Practical: adds $R_s$ (series) and $R_p$ (shunt)
- $eta = (FF dot V_"OC" dot I_"SC") / (P_"in" dot A)$
- $I_"SC" ∝$ irradiance (linear); $V_"OC"$ logarithmic
- Temperature: $V_"OC"$ decreases ~2.3 mV/°C; efficiency decreases
- Fill factor 0.7–0.85; commercial efficiency 15–22%

## Ch 7 — PV System Design and MPPT

- Series: voltages add; Parallel: currents add
- $P_"array" = N_s N_p P_"cell"$; mismatch losses from non-identical cells
- Sizing: load → array ($W_p = "Load"/("PSH" dot eta dot "Factor")$) → battery ($"Ah" = ("Load" dot "Auto")/("V" dot "DoD" dot eta)$) → inverter
- MPPT: DC-DC converter tracks maximum power point
- Buck: $V_o/V_i = D$; Boost: $1/(1-D)$; Buck-boost: $-D/(1-D)$
- Configurations: stand-alone, grid-interactive, hybrid

## Ch 8 — Wind Resource Assessment

- Wind from differential solar heating
- Shear: $v = v_0(h/h_0)^alpha$ ($alpha$: 0.14 open, 0.25 suburban, 0.30 urban)
- $P = (1/2) rho A v^3$; WPD = $(1/2) rho v^3$
- Power ∝ $v^3$ — doubling speed gives 8× power
- $"CF" = "Actual Energy" / ("Rated Power" dot "Time")$
- Site selection: high wind speed, no obstructions, open terrain, grid access, low roughness

## Ch 9 — Wind Aerodynamics

- $P_"wind" = (1/2) rho A v^3$; $A = pi R^2$
- Betz limit: $C_(p,max) = 16/27 ≈ 0.593$; practical $C_p = 0.35–0.45$
- $P_"rotor" = (1/2) rho A v^3 C_p$; $P_"elec" = P_"rotor" eta_"mech" eta_"elec"$
- TSR: $lambda = Omega R/v$; optimum $lambda_"opt" ≈ 6–8$ for 3-blade HAWT
- Lift: perpendicular to relative wind; Drag: parallel
- Power curve: cut-in (3–4 m/s), rated, cut-out (25 m/s)
- Variable speed > fixed speed for energy capture

## Ch 10 — WECS and Generators

- HAWT: horizontal axis, propeller type dominant, yaw control needed, high efficiency
- VAWT: vertical axis, omnidirectional, Savonius (drag, self-starting), Darrieus (lift, not self-starting)
- Components: rotor, hub, gearbox, generator, nacelle, tower, yaw, controller, brake
- SCIG: fixed speed, simple, needs capacitor bank
- DFIG: variable speed ±30%, partial converter (20–30%), stator direct to grid
- PMSG: variable speed full, permanent magnets, full converter, high efficiency
- Grid challenges: intermittency, voltage/frequency stability, reactive power, fault ride-through

## Ch 11 — Hybrid Wind Systems and Storage

- Hybridization: multiple sources for reliability
- Solar-wind: complementary (wind night/winter, solar day/summer)
- Wind-diesel: reduces fuel consumption; DG as backup
- Storage: battery (electrochemical), pumped hydro (gravitational), CAES (compressed air), flywheel (kinetic), ultracapacitor (electrostatic)
- Sizing: $P_"avg" = sum(P_"rated" dot K_"cf")$

## Ch 12 — Biomass Resources and Conversion

- Sources: wood, agricultural residues, energy crops, animal waste, municipal waste
- Energy plantation: advantages (carbon-neutral, ash as manure), disadvantages (land, food competition)
- Thermo-chemical: combustion (800–1000°C), pyrolysis (~500°C, no O₂), gasification (partial O₂, 800–1000°C), liquefaction (250–350°C, high P)
- Biochemical: anaerobic digestion (biogas), fermentation (ethanol)
- Biogas: ~65% CH₄, ~35% CO₂; factors: temp 35–38°C, pH 6.5–7.5, C/N 25:1–30:1

## Ch 13 — Biogas Plant Design

- Components: digester, gas holder, inlet, outlet, mixing tank, gas outlet
- Fixed dome: variable pressure, low cost, long life; Floating drum: constant pressure, high cost
- $V_b = C m_0$; $V_d = (m_0/rho_m) t_r$; $E = eta H_m F_m V_b$

## Ch 14 — Biomass Gasification

- Four zones: drying → pyrolysis → oxidation → reduction
- Reduction reactions: $"C" + "CO"_2 → 2 "CO"$; $"C" + "H"_2 "O" → "CO" + "H"_2$; $"C" + 2 "H"_2 → "CH"_4$
- Updraft: counter-current, high tar (30–150 g/Nm³), high efficiency, fuel flexible
- Downdraft: co-current, low tar (<1 g/Nm³), clean gas, for IC engines
- Crossdraft: side air, fast startup, charcoal only
- BFB/CFB: fluidized bed, uniform temp, scalable
- Syngas: CO 15–25%, H₂ 10–20%, CH₄ 1–5%, LCV 4–6 MJ/Nm³

## Ch 15 — Waste-to-Energy

- Incineration: 800–1000°C, 20–40% electrical efficiency
- LFG recovery: ~50% CH₄ from landfills
- AD for biogas: $V_b = C m_0$, $V_d = (m_0/rho_m)t_r$
- Plant sizing: waste characterization → energy demand → technology → mass/energy balance → components → environmental → economic

## Ch 16 — Geothermal Energy

- Geothermal gradient: ~30°C/km
- Hydrothermal: vapour-dominated (dry steam) and liquid-dominated (flash)
- Dry steam: ~165°C, 7 atm, ~14% efficiency
- Flash steam: >180°C, throttling, scaling risk
- Binary cycle: 100–150°C, secondary fluid, closed loop, minimal emissions
- India: 10,600 MW potential, Puga Valley (Ladakh) flagship
- Environmental: NCGs, brine, subsidence, induced seismicity; mitigation: re-injection

## Ch 17 — OTEC

- $eta_"Carnot" = 1 - T_"cold"/T_"hot"$; actual 2–3%
- Closed (Anderson): secondary fluid (ammonia), compact turbine
- Open (Claude): seawater flash-evaporated, large turbine (~12 m), produces fresh water
- Hybrid: combines both, avoids drawbacks of each
- Bio-fouling: major challenge; 30% parasitic pumping power

## Ch 18 — Wave and Tidal

- Wave power: $P = (rho g^2 H^2 T)/(32 pi)$ per unit crest length
- Converters: float (potential), dolphin (kinetic + potential), overtopping (potential)
- Tidal: $E = (1/2) A rho g h^2$; $P_"avg" = E/t$
- Schemes: single basin (single/double effect), double basin (linked/paired)
- Spring tides (max range, full/new moon); neap tides (min range, quarter moons)
- Site: tidal range > 5 m, suitable geography

---

*End of Rapid Revision*
