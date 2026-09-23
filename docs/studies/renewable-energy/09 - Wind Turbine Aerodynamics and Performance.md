---
title: "09 - Wind Turbine Aerodynamics and Performance"
math_syntax: typst
---

# Wind Turbine Aerodynamics and Performance

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Derivation of the Wind Power Equation

Consider a mass $m$ of air moving with velocity $v$. Its kinetic energy is:

$E = (1/2) m v^2$

In time $Delta t$, the air passing through rotor area $A$ occupies a volume $A v Delta t$ with mass $m = rho A v Delta t$. The kinetic energy is:

$E = (1/2) (rho A v Delta t) v^2 = (1/2) rho A v^3 Delta t$

Power (energy per unit time) is:

$P_"wind" = (1/2) rho A v^3$

where $rho$ is air density (~1.225 kg/m³ at sea level, 15°C, 1 atm), $A = pi R^2$ is the rotor swept area, and $v$ is the free-stream wind speed.

> Power is proportional to $v^3$ (doubling wind speed yields 8× power) and to $D^2$ (rotor diameter squared).

## The Betz Limit and Power Coefficient

### Betz Limit

In 1919, Albert Betz proved that no wind turbine can extract more than **16/27 ≈ 59.3%** of the kinetic energy in the wind. The optimal extraction occurs when wind is slowed to one-third of its upstream speed at the rotor plane.

### Power Coefficient

$C_p = P_"rotor" / P_"wind" = P_"rotor" / ((1/2) rho A v^3)$

- Theoretical maximum: $C_(p,"max") = 16/27 ≈ 0.593$
- Practical range for modern HAWTs: 0.35–0.45

The actual extractable power:

$P_"rotor" = (1/2) rho A v^3 C_p$

Electrical power output is further reduced by drivetrain and generator efficiencies:

$P_"elec" = (1/2) rho A v^3 C_p eta_"mech" eta_"elec"$

## Tip-Speed Ratio (TSR)

The TSR relates blade tip speed to free-stream wind speed:

$lambda = (Omega R) / v$

where $Omega$ is angular velocity (rad/s), $R$ is rotor radius, and $v$ is wind speed. If RPM is $N$: $Omega = 2 pi N / 60$.

$C_p$ is a function of $lambda$: each turbine design has an optimum $lambda_"opt"$ where $C_p$ is maximum.

- **Low TSR** ($lambda ≈ 0$): Rotor stationary or slow; low $C_p$
- **Optimum TSR**: Ideal angle of attack; $C_p$ peaks
- **High TSR**: Rotor acts like a solid disc; $C_p$ drops sharply

Typical optimum values: multi-blade windmills $lambda_"opt" ≈ 1$; modern 3-blade HAWTs $lambda_"opt" ≈ 6$–8.

## Aerodynamic Forces on Blades

Wind turbine blades are airfoils. The relative wind is the vector sum of true wind and the wind induced by blade rotation.

### Lift Force

$F_L = (1/2) rho A_"blade" v_"rel"^2 C_L$

where $C_L$ is the lift coefficient (depends on airfoil shape and angle of attack). Lift is **perpendicular** to the relative wind and is the useful force that turns the rotor.

### Drag Force

$F_D = (1/2) rho A_"blade" v_"rel"^2 C_D$

Drag is **parallel** to the relative wind and is a parasitic loss.

### Lift-to-Drag Ratio

The efficiency of an airfoil is its $L/D$ ratio, maximized at a specific angle of attack (typically 5–10°). Beyond the **stall angle**, flow separates, lift drops, and drag rises sharply.

## Wind Turbine Power Curve

| Speed | Behaviour |
| :--- | :--- |
| **Cut-in** (~3–4 m/s) | Minimum speed for power generation |
| **Rated** | Speed at which turbine reaches rated power; above this, power is limited (pitch control) |
| **Cut-out** (~25 m/s) | Maximum speed; turbine shuts down for safety |

**Fixed-speed turbines** operate at peak efficiency at one specific wind speed. **Variable-speed turbines** use power electronics to adjust rotor speed, maintaining optimal $lambda$ (and thus $C_p$) over a wider range, increasing energy capture.

## Worked Example

**Problem:** 3-blade HAWT, rotor diameter 80 m, $rho = 1.225$ kg/m³, $v = 10$ m/s, $C_p = 0.45$ at $lambda = 7$.

**Solution:**

$A = pi (40)^2 = 5026.5 " m"^2$

$P_"wind" = 0.5 times 1.225 times 5026.5 times 10^3 = 3,078,700 " W" ≈ 3.08 " MW"$

$P_"rotor" = 3.08 times 0.45 = 1.386 " MW"$

$Omega = (lambda v) / R = (7 times 10) / 40 = 1.75 " rad/s"$

$N = (1.75 times 60) / (2 pi) ≈ 16.7 " RPM"$

## Revision Checklist

- [ ] Derive the wind power equation from first principles
- [ ] State the Betz limit and prove the 59.3% maximum
- [ ] Calculate $C_p$, extractable power, and electrical output
- [ ] Define TSR and explain its significance
- [ ] Describe lift and drag forces on airfoil blades
- [ ] Draw and explain a typical turbine power curve (cut-in, rated, cut-out)
- [ ] Compare fixed-speed and variable-speed turbines
