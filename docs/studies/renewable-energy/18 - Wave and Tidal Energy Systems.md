---
title: "18 - Wave and Tidal Energy Systems"
math_syntax: typst
---

# Wave and Tidal Energy Systems

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


## Wave Energy Conversion

### Wave Power Formula

Power available from a deep-water wave per unit length of wave crest:

$P = (rho g^2 H^2 T) / (32 pi)$

where $rho ≈ 1025$ kg/m³ (seawater density), $g = 9.81$ m/s², $H$ is wave height (peak-to-trough, m), and $T$ is wave period (s).

### Basic Approaches

1. **Terminator devices:** Absorb energy at the end of a structure perpendicular to wave direction (e.g., oscillating water column on shore)
2. **Attenuating devices:** Absorb energy along a structure parallel to wave direction (e.g., Pelamis, Dolphin type)
3. **Overtopping devices:** Channel waves into an elevated reservoir; water released through low-head turbines
4. **Oscillating water column (OWC):** Wave action compresses/decompresses a trapped air column, driving a bidirectional air turbine

### Float Wave-Power Device (Oscillating Float)

Uses **potential energy** of waves:

1. Large buoyant float rises with a wave crest, pulling a piston/rod upward
2. Draws low-pressure fluid into a high-pressure hydraulic cylinder
3. Float falls with wave trough, pushing high-pressure fluid through a hydraulic motor
4. Hydraulic motor drives an electrical generator

### Dolphin Type Wave Power Machine

An **attenuating device** using both kinetic and potential energy. Consists of hinged, semi-submerged cylindrical sections:

1. Oriented parallel to wave direction
2. Passing waves cause adjacent sections to move vertically out of phase
3. Relative motion at hinges drives hydraulic rams
4. Rams pump high-pressure fluid through hydraulic motors connected to generators

### High-Level Reservoir Type (Overtopping)

Uses **potential energy** of waves to create a water head:

1. Waves guided up a ramp or collector
2. Water overtops into a reservoir elevated above mean sea level
3. Collected water released back through low-head turbines (e.g., Kaplan), driving generators

## Tidal Energy Conversion

### Tidal Principles

Tides are the periodic rise and fall of sea levels due to gravitational pull of the moon and sun.

- **Tidal range:** Vertical difference between high and low tide (0.25–17 m globally)
- **Spring tides:** Maximum range, at full and new moons (sun, moon, Earth aligned)
- **Neap tides:** Minimum range, at quarter moons (sun and moon at right angles)
- **Lunar effect:** Moon's gravitational attraction is the primary driver; sun's effect is about half as strong

### Tidal Power Schemes

**Single basin, single effect:** Power generated only during one phase (ebb or flood). Ebb generation: basin filled at high tide through sluice gates; turbines generate as water flows out during low tide. Most common scheme.

**Single basin, double effect:** Power generated during both ebb and flood using reversible turbines. More continuous but complex, expensive turbine design.

**Double basin, linked basin:** One large basin divided into high and low basins by a partition barrage. High basin filled from sea during high tide; low basin emptied during low tide. Turbines in the partition allow continuous flow from high to low basin.

**Double basin, paired basin:** Two separate basins, each with its own barrage. High basin filled during high tide via sluice, emptied via turbines. Low basin filled via turbines, emptied via sluice. Allows power generation during both high and low tides.

### Tidal Power Calculation

**Energy stored in a tidal basin at high tide:**

$E = (1/2) A rho g h^2$

where $A$ is basin area (m²), $rho ≈ 1025$ kg/m³, $g = 9.81$ m/s², $h$ is tidal range (m). The factor 1/2 accounts for decreasing head as the basin empties.

**Average power:**

$P_"avg" = E / t = (A rho g h^2) / (2t)$

**With efficiency:**

$P_"out" = P_"avg" dot eta$

### Worked Example 1

**Problem:** Basin area 9 km², tidal range 10 m, efficiency 30%.

$E = 0.5 times (9 times 10^6) times 1025 times 9.81 times 10^2 ≈ 4.5 times 10^12$ J per tide

Total energy per day (2 cycles): $9 times 10^12$ J

Mean power: $9 times 10^12 / 86400 ≈ 104$ MW

Electrical power: $104 times 0.30 ≈ 31$ MW

### Worked Example 2

**Problem:** $H = 9$ m, $A = 0.45$ km², generation time $t = 3$ h, average head $h = 8.5$ m, $eta = 72%$, $N = 705$ cycles/year.

Volume per cycle: $V = 0.45 times 10^6 times 9 = 4.05 times 10^6$ m³

Average discharge: $Q = 4.05 times 10^6 / (3 times 3600) = 375$ m³/s

Instantaneous power: $P = 1025 times 375 times 9.81 times 8.5 times 0.72 ≈ 23.085$ MW

Yearly energy: $E_"year" = 23.085 times 3 times 705 ≈ 48,825$ MWh/year

## Advantages and Limitations of Tidal Power

| Advantages | Limitations |
| :--- | :--- |
| Independent of rainfall | Output varies with tidal range |
| Does not require large land areas | Turbines operate over wide head range |
| Inexhaustible and renewable | Seawater corrosion risk |
| Free from operational pollution | Sedimentation and siltation |
| Tides are predictable and reliable | High transmission costs (remote locations) |
| Net generation cost can be low | Very high capital cost for barrages |
| Predictable output aids grid management | Environmental impact on marine ecosystems |

**Site requirements:** Large tidal range (> 5 m) and suitable geography (bay or estuary) for basin construction.

## Advantages and Limitations of Wave Energy

- Renewable and clean
- Predictable (wave forecasts available)
- High energy density compared to wind
- Suitable for remote coastal communities
- No land requirement (offshore)
- Limited by location (requires consistent wave climate)
- Structural survival in storms is challenging
- Maintenance in marine environment is costly
- Potential impact on coastal ecosystems

## Revision Checklist

- [ ] Calculate wave power from height and period
- [ ] Describe float, dolphin, and overtopping wave energy converters
- [ ] Explain single and double basin tidal schemes
- [ ] Calculate tidal energy and average power for a basin
- [ ] Distinguish spring and neap tides
- [ ] Compare tidal and wave energy advantages and limitations
