---
title: "Formula and Methods"
math_syntax: typst
---

# Formula and Methods

## Energy Fundamentals

**R/P Ratio:** $R/P = "Proven Reserve" / "Annual Consumption"$

## Solar Energy

**Extraterrestrial radiation:** $I / I_"sc" = 1 + 0.033 cos((360 n) / 365)$

**Declination (Cooper):** $delta = 23.45 sin((360/365)(284 + n))$

**Zenith angle:** $cos(theta_z) = sin(phi) sin(delta) + cos(phi) cos(delta) cos(omega)$

**Sunrise hour angle:** $cos(omega_s) = -tan(phi) tan(delta)$

**Day length:** $t_d = (2/15) arccos(-tan(phi) tan(delta))$ h

**Angle of incidence (south-facing):** $cos(theta) = cos(phi - s) cos(delta) cos(omega) + sin(phi - s) sin(delta)$

**Local Solar Time:** $"LST" = "IST" - 4("Std Lon" - "Local Lon") + "EoT"$

**Air mass:** $"AM" = 1/cos(theta_z)$

**Ångström-Prescott:** $H_g/H_0 = a + b(overline(n)/N)$

**Extraterrestrial daily radiation:**

$H_0 = (24/pi) I_"sc" [1 + 0.033 cos((360n)/365)] [cos(phi) cos(delta) sin(omega_s) + (pi omega_s/180) sin(phi) sin(delta)]$

**Pyrheliometer:** $H_"DN" = K i^2$

## Solar Thermal

**Useful heat gain:** $Q_u = A_c F_R [I tau alpha - U_L (T_i - T_a)]$

**Collector efficiency:** $eta = F_R tau alpha - F_R U_L (T_i - T_a) / I$

**Concentration ratio:** $C = A_"aperture" / A_"absorber"$

## Photovoltaics

**Photon energy:** $E = h c/lambda$ or $E " (eV)" = 1.24 / lambda " (µm)"$

**Ideal I-V:** $I = I_"SC" - I_0 (e^(q V/(k T)) - 1)$

**Practical I-V:** $I = I_"SC" - I_0 [exp(q(V + I R_s)/(k T)) - 1] - (V + I R_s)/R_p$

**Efficiency:** $eta = (FF dot V_"OC" dot I_"SC") / (P_"in" dot A)$

**Fill factor:** $FF = (V_m I_m) / (V_"OC" I_"SC")$

**Array power:** $P = N_s N_p P_"cell"$

**PV sizing:** $W_p = "Daily Load" / ("PSH" dot eta_"sys" dot "Op Factor")$

**Battery capacity:** $"Ah" = ("Load" dot "Autonomy") / ("Voltage" dot "DoD" dot eta_"bat")$

**Buck converter:** $V_o/V_"in" = D$

**Boost converter:** $V_o/V_"in" = 1/(1-D)$

**Buck-boost converter:** $V_o/V_"in" = -D/(1-D)$

## Wind Energy

**Wind power:** $P = (1/2) rho A v^3$

**Wind power density:** $"WPD" = (1/2) rho v^3$

**Extractable power:** $P = (1/2) rho A v^3 C_p$

**Electrical output:** $P_"elec" = (1/2) rho A v^3 C_p eta_"mech" eta_"elec"$

**Tip-speed ratio:** $lambda = Omega R / v$

**Betz limit:** $C_(p,"max") = 16/27 ≈ 0.593$

**Wind shear:** $v = v_0 (h/h_0)^alpha$

**Capacity factor:** $"CF" = "Actual Energy" / ("Rated Power" dot "Time")$

**Power coefficient:** $C_p = P_"rotor" / ((1/2) rho A v^3)$

**Lift force:** $F_L = (1/2) rho A_"blade" v_"rel"^2 C_L$

**Drag force:** $F_D = (1/2) rho A_"blade" v_"rel"^2 C_D$

## Biomass and Biogas

**Biogas volume:** $V_b = C dot m_0$

**Digester volume:** $V_d = (m_0/rho_m) dot t_r$

**Energy from biogas:** $E = eta dot H_m dot F_m dot V_b$

**Combustion:** $"Biomass" + "O"_2 → "CO"_2 + "H"_2 "O" + "Heat"$

**Fermentation:** $"C"_6 "H"_12 "O"_6 → 2 "C"_2 "H"_5 "OH" + 2 "CO"_2$

**Cold gas efficiency:** $"CGE" = (dot(m)_"sg" dot "CV"_"sg") / (dot(m)_"fuel" dot "CV"_"fuel")$

## Geothermal

**Plant types by resource temperature:**
- Dry steam: > 240°C
- Flash steam: > 180°C
- Binary cycle: 100–150°C

## OTEC

**Carnot efficiency:** $eta = 1 - T_"cold"/T_"hot"$

**Net power:** $P_"net" = P_"gross" - P_"pumps" - P_"auxiliary"$

## Wave and Tidal

**Wave power per unit crest length:** $P = (rho g^2 H^2 T) / (32 pi)$

**Tidal basin energy:** $E = (1/2) A rho g h^2$

**Tidal average power:** $P_"avg" = (A rho g h^2) / (2t)$

**Tidal power with efficiency:** $P_"out" = P_"avg" eta$
