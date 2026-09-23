---
title: "10 - Wind Energy Conversion Systems and Generators"
math_syntax: typst
---

# Wind Energy Conversion Systems and Generators

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Classification of Wind Turbines

### Horizontal Axis Wind Turbines (HAWT)

The rotor shaft is horizontal, parallel to the ground. This is the dominant design for utility-scale generation.

**Subtypes:**
- **Multiblade:** 12–20 blades, high torque, low speed (~60–80 rpm); used for water pumping
- **Sail type:** Cloth/plastic sails on masts, low speed
- **Propeller type:** 2–3 airfoil blades, high speed (~300–400 rpm); most common for electricity

**Advantages:** High efficiency (blades move perpendicular to wind); variable pitch optimizes angle of attack; tall towers access stronger winds.

**Disadvantages:** Tall towers and long blades are difficult to transport; requires massive tower construction; needs a yaw mechanism.

### Vertical Axis Wind Turbines (VAWT)

The rotor shaft is vertical, perpendicular to the ground. Omnidirectional — accept wind from any direction.

**Subtypes:**
- **Savonius rotor:** S-shaped cross-section; works on drag principle; high torque, low speed, self-starting
- **Darrieus rotor:** Egg-beater shape with 2–3 airfoil blades; works on lift principle; higher efficiency but **not self-starting**

**Advantages:** Omnidirectional, no yaw mechanism; generator at ground level; lighter towers.

**Disadvantages:** Near ground where wind is lower and more turbulent; poor self-starting (Darrieus); high centrifugal blade stress; lower efficiency than HAWT.

### HAWT vs. VAWT Comparison

| Feature | HAWT | VAWT |
| :--- | :--- | :--- |
| Axis | Horizontal | Vertical |
| Wind direction | Requires yaw control | Omnidirectional |
| Efficiency | High ($C_p$ up to 0.45+) | Lower |
| Generator location | Top of tower (nacelle) | Ground level |
| Self-starting | Yes | Savonius: Yes; Darrieus: No |
| Primary use | Utility-scale farms | Small-scale, niche |

## Main Components of a HAWT

1. **Rotor blades:** Capture wind energy; airfoil shape generates lift
2. **Hub:** Connects blades to main shaft
3. **Gearbox:** Increases speed from low-speed rotor (~15–20 rpm) to high-speed generator (~1500–1800 rpm)
4. **Generator:** Converts mechanical to electrical energy
5. **Nacelle:** Houses gearbox, generator, controller, brake
6. **Tower:** Supports nacelle and rotor
7. **Yaw system:** Orients rotor into the wind
8. **Controller:** Monitors and controls start-up, shutdown, pitch, yaw
9. **Brake:** Stops rotor in high winds or for maintenance

## Generator Types for Wind Turbines

### Fixed-Speed: Squirrel Cage Induction Generator (SCIG)

Simple, robust rotor with short-circuited bars. Runs slightly above synchronous speed (negative slip) to generate. Directly connected to grid via transformer. Requires a **capacitor bank** for reactive power compensation and a **soft-starter** to limit inrush current. Limitations: no speed control, consumes reactive power, high mechanical stress during gusts.

### Variable-Speed: Doubly-Fed Induction Generator (DFIG)

Wound rotor with slip rings. Stator directly connected to grid. Rotor connected via a **partial-scale power converter** (20–30% of rated power).

- **Sub-synchronous:** Power flows from grid to rotor via converter
- **Super-synchronous:** Power flows from rotor to grid via converter
- Variable speed operation: ±30% around synchronous speed
- Converter handles only a fraction of total power, reducing cost
- Can control active and reactive power independently
- A **crowbar** circuit protects the converter during faults

### Variable-Speed: Permanent Magnet Synchronous Generator (PMSG)

Rotor uses permanent magnets (no field windings, no slip rings). Often paired with a **full-scale power converter**.

- High efficiency (no rotor copper losses)
- Robust, low maintenance (no brushes/slip rings)
- Full grid decoupling via converter
- Higher cost due to rare earth materials

### Generator Comparison

| Generator | Speed Control | Converter Rating | Key Feature |
| :--- | :--- | :--- | :--- |
| SCIG | Fixed | None | Simple, robust |
| DFIG | Variable (±30%) | Partial (20–30%) | Cost-effective variable speed |
| PMSG | Variable (full) | Full (100%) | High efficiency, low maintenance |

## Grid Integration

**Challenges:** Intermittency and variability; voltage and frequency instability; reactive power demand (SCIG); fault ride-through requirements.

**Solutions:** Power electronics (DFIG/PMSG converters for active/reactive control); energy storage (batteries, flywheels, pumped hydro); advanced control systems; modern grid codes; hybrid systems combining wind with solar, diesel, or storage.

## Worked Example

**Problem:** Blade length 52 m, wind speed 12 m/s, air density 1.23 kg/m³, $C_p = 0.4$.

$A = pi (52)^2 ≈ 8495 " m"^2$

$P_"avail" = 0.5 times 1.23 times 8495 times 12^3 times 0.4 = 0.5 times 1.23 times 8495 times 1728 times 0.4 ≈ 3.6 " MW"$

## Revision Checklist

- [ ] Classify wind turbines as HAWT and VAWT with subtypes
- [ ] Compare HAWT and VAWT in terms of efficiency, self-starting, and applications
- [ ] List the main components of a HAWT system
- [ ] Describe SCIG, DFIG, and PMSG generator operation and trade-offs
- [ ] Explain grid integration challenges and solutions
- [ ] Calculate available wind power from given parameters
