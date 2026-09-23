---
title: "05 - Solar Thermal Collectors and Applications"
math_syntax: typst
---

# Solar Thermal Collectors and Applications

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


Solar energy can be harnessed through thermodynamics (converting radiation to heat) or photovoltaics (directly converting to electricity). This chapter covers solar thermal collectors — devices that absorb solar radiation and convert it into useful heat.

## Classification of Solar Collectors

| Temperature Range | Collector Type | Applications |
| :--- | :--- | :--- |
| Low (< 100°C) | Flat-plate collectors (non-concentrating) | Water heating, space heating, drying |
| Medium (100–200°C) | Cylindrical parabolic collectors (line-focusing) | Vapour engines, process heating, refrigeration |
| High (> 200°C) | Paraboloidal mirror arrays (point-focusing) | Steam engines, Stirling engines, thermoelectric generators |

**Flat-plate collectors** are non-concentrating: they collect both direct and diffuse radiation. **Concentrating collectors** use mirrors or lenses to focus radiation onto a smaller absorber, achieving higher temperatures but typically requiring sun tracking.

## Flat-Plate Collectors (FPC)

The most common type for low-temperature applications (< 90°C). They collect both direct and diffuse radiation and do not require tracking.

### Construction (Liquid Type)

1. **Absorber plate:** Metal sheet (copper, steel, aluminum) with high solar absorptivity, 1–2 mm thick.
2. **Tubes/channels:** Metal tubes (copper, 1–1.5 cm diameter) soldered or brazed to the absorber at 5–15 cm pitch.
3. **Transparent cover(s):** One or two sheets of glass (3–4 mm). Glass transmits shortwave solar radiation but blocks longwave infrared re-radiated from the hot absorber — a greenhouse effect.
4. **Insulation:** 5–10 cm of mineral wool behind the absorber to minimize rear heat loss.
5. **Casing:** Weatherproof insulated box housing all components.

### Working

Solar radiation passes through the glass, is absorbed by the dark absorber plate, and heats it. A heat transfer fluid (water or antifreeze like ethylene glycol) circulates through the tubes, absorbs heat, exits through the top header for the desired application, and cooler fluid enters at the bottom to complete the cycle.

A second glass cover reduces convective and radiation losses by about 25%, but each cover reflects roughly 15% of incoming sunlight, so more than two covers is generally uneconomical.

### Air-Based Flat-Plate Collectors

Air flows through a channel between the absorber and insulation, often with baffles for better heat transfer. Advantages: eliminates freezing and corrosion; suitable for space heating and drying.

### FPC Advantages and Disadvantages

| Advantages | Disadvantages |
| :--- | :--- |
| Collect both beam and diffuse radiation | Achieve only low temperatures |
| No sun tracking required | Heavy and bulky |
| Simple construction, low maintenance | Large absorber area leads to significant heat losses |
| Mechanically simple | Freezing risk for liquid systems in cold climates |

## Concentrating Collectors

Concentrating collectors focus radiation from a large aperture onto a smaller absorber. The **concentration ratio** is:

$C = A_"aperture" / A_"absorber"$

Higher $C$ allows higher fluid temperatures (up to 500°C+) but requires tracking.

### Types

**Parabolic trough (line-focusing):** Trough-shaped reflector focuses sunlight onto a receiver tube along the focal line. Requires single-axis tracking. Widely used in solar thermal power plants.

**Parabolic dish (point-focusing):** Dish reflector focuses sunlight onto a single focal point. Requires dual-axis tracking. Concentration ratio 30–100+, enabling 300–500°C. Used with Stirling engines.

**Central receiver (heliostat field):** A large field of individually tracked mirrors reflects sunlight onto a central receiver on a tall tower. Used in large-scale power plants.

**Compound Parabolic Concentrator (CPC):** Non-imaging concentrator with a wide acceptance angle. Often stationary, requiring only seasonal adjustment. Concentration ratio 3–10; with evacuated receiver, temperatures up to 200–300°C.

### Concentrating Collector Advantages and Disadvantages

| Advantages | Disadvantages |
| :--- | :--- |
| Higher fluid temperatures | Collect only beam radiation (diffuse lost) |
| Smaller absorber area, lower heat losses | Require tracking mechanisms |
| Economically feasible selective surfaces | Higher initial cost and maintenance |
| Suitable for power generation | Non-uniform heat flux on absorber |

## Evacuated Tube Collectors (ETC)

Rows of parallel transparent glass tubes with an evacuated space between outer and inner tubes. The vacuum eliminates conductive and convective heat losses, allowing higher temperatures than FPC. Excellent performance in low light and cold conditions, but more fragile and expensive.

## Solar Water Heating Systems

### System Types

**Passive (thermosiphon):** Water circulates naturally due to density differences — hot water rises, cold sinks. The storage tank must be above the collector. Simple, inexpensive, no moving parts.

**Active (direct/open-loop):** Cold water from the tank is pumped directly to the collector, heated, and returned. Simple but prone to scaling and freezing.

**Active (indirect/closed-loop):** A heat transfer fluid (water-glycol) circulates through the collector, passing through a heat exchanger to heat domestic water. Protects against freezing and scaling.

### Key Performance Equations

**Useful heat gain:**

$Q_u = A_c F_R [I_tau alpha - U_L (T_i - T_a)]$

where $A_c$ is the collector area, $F_R$ is the heat removal factor, $I$ is solar irradiance, $tau alpha$ is the effective transmittance-absorptance product, $U_L$ is the overall heat loss coefficient, $T_i$ is the inlet fluid temperature, and $T_a$ is the ambient temperature.

**Collector efficiency:**

$eta = Q_u / (A_c I) = F_R (tau alpha) - F_R U_L (T_i - T_a) / I$

## Other Solar Thermal Applications

**Solar pond:** A large body of water with a salinity gradient that traps solar heat at the bottom, reaching temperatures of 70–90°C. Used for electricity generation and process heat.

**Solar cooker:** Concentrates sunlight for cooking. Types include box cookers (65–100°C), parabolic cookers (150–350°C), and panel cookers.

**Solar distillation:** Uses a greenhouse-like enclosure to evaporate contaminated or saline water; the vapour condenses on a sloped glass cover and is collected as distilled water.

**Solar drying:** Uses solar heat to remove moisture from agricultural products, timber, and other materials. Can be direct (open-air) or indirect (using a solar air heater).

## Revision Checklist

- [ ] Classify solar collectors by temperature range
- [ ] Describe flat-plate collector construction and working
- [ ] Explain concentrating collector types and concentration ratio
- [ ] Describe evacuated tube collector advantages
- [ ] Compare passive and active solar water heating systems
- [ ] State and use the useful heat gain and efficiency equations
- [ ] Briefly describe solar ponds, cookers, distillation, and drying
