---
title: "08 - Wind Resource Assessment and Site Selection"
math_syntax: typst
---

# Wind Resource Assessment and Site Selection

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Wind Formation

Wind is the bulk movement of air across the Earth's surface, caused by uneven solar heating. The sun heats land and water at different rates, creating pressure differences that drive air movement.

- **Sea breeze:** During the day, land heats faster, warm air rises, cooler air from the sea moves in.
- **Land breeze:** At night, land cools faster, air over the sea is warmer and rises, causing a breeze from land to sea.
- **Mountain/valley breeze:** Daytime anabatic winds (air rises along slopes); nighttime katabatic winds (cool air flows down slopes).

The Earth receives approximately $1.74 times 10^17$ W from the sun; about 1–2% is converted into wind energy.

## Wind Shear: Speed Variation with Height

Wind speed varies with height above ground due to surface friction. The **power law** models this:

$v = v_0 (h / h_0)^alpha$

where $v$ is wind speed at height $h$, $v_0$ is the known speed at reference height $h_0$, and $alpha$ is the wind shear exponent (0.14 for open terrain, 0.25 for suburban areas, 0.30 for cities).

Modern turbines have tall towers (80–120 m) to access stronger, more consistent winds at higher altitudes.

## Wind Power Density

The power available in the wind through an area $A$ is:

$P = (1/2) rho A v^3$

where $rho$ is air density (~1.225 kg/m³ at sea level) and $v$ is wind speed.

**Wind Power Density (WPD)** — power per unit area:

$"WPD" = P / A = (1/2) rho v^3 quad "W/m²"$

> Power is proportional to the **cube** of wind speed. Doubling wind speed increases available power by a factor of eight ($2^3 = 8$). This makes accurate wind speed measurement critical.

### Worked Example

**Problem:** Compute WPD at a site with $v = 15$ m/s at 50 m height, $T = 17°C$, elevation 900 m above sea level.

**Solution:**

Air density via ideal gas law: $rho = P / (R_"specific" T)$

Pressure at 900 m: $P approx 101325 (1 - (0.0065 times 900) / 288.15)^5.2553 approx 90930$ Pa

Temperature: $T = 17 + 273.15 = 290.15$ K

$rho = 90930 / (287.05 times 290.15) approx 1.09 " kg/m"^3$

$"WPD" = 0.5 times 1.09 times 15^3 = 0.5 times 1.09 times 3375 approx 1840 quad "W/m²"$

## Capacity Factor

The **capacity factor (CF)** is the ratio of actual energy output over a period to the maximum possible output at rated power:

$"CF" = "Actual Energy Output (kWh)" / ("Rated Power (kW)" times "Time Period (hours)")$

Typical onshore wind farm CF: 25–45%. The **power coefficient** $C_p$ is the ratio of actual electrical power to total wind power through the rotor area. The theoretical maximum (Betz limit) is $C_p = 16/27 approx 0.593$; practical values are 0.35–0.45.

## Wind Farm Site Selection

| Criterion | Rationale |
| :--- | :--- |
| High annual wind speed | Primary factor; sites should have > 6–7 m/s average at hub height |
| No tall obstructions | Clear area for at least 3 km radius to minimize turbulence |
| Open terrain | Plains, coastal areas, ridges, mountain gaps accelerate wind |
| Proximity to load centre | Minimizes transmission losses and infrastructure cost |
| Access to transportation | Roads must handle large components (blades, tower sections) |
| Low surface roughness | Smooth terrain (water, flat farmland) causes less speed reduction |
| Land availability | Sufficient area for turbine spacing (5–9 rotor diameters apart) |
| Environmental impact | Avoid bird migration routes, protected habitats, noise-sensitive areas |

## Advantages and Limitations of Wind Power

**Advantages:** Free and renewable fuel; no operational emissions; small land footprint (dual-use with agriculture); scalable from kW to GW; suitable for remote off-grid locations.

**Limitations:** Intermittent and variable; high initial capital cost; noise; potential hazard to birds and bats; best resources often remote from load centres.

## Revision Checklist

- [ ] Explain the origin of wind from differential solar heating
- [ ] Calculate wind speed at different heights using the power law
- [ ] Compute wind power density from air density and wind speed
- [ ] Define capacity factor and power coefficient
- [ ] List and explain wind farm site selection criteria
- [ ] State advantages and limitations of wind power
