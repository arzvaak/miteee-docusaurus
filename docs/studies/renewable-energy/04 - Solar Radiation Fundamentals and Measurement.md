---
title: "04 - Solar Radiation Fundamentals and Measurement"
math_syntax: typst
---

# Solar Radiation Fundamentals and Measurement

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Solar Constant and Extraterrestrial Radiation

The sun emits energy across a spectrum with roughly 99% between 0.2 µm and 4.0 µm: 8% ultraviolet, 40% visible, 46% infrared.

The **solar constant** is the rate at which solar energy arrives at the top of Earth's atmosphere on a surface perpendicular to the sun's rays at the mean Earth–Sun distance:

$I_"sc" = 1353 "W/m"^2 = 1.353 "kW/m"^2$

Due to Earth's elliptical orbit, extraterrestrial radiation varies with the day of year $n$:

$I / I_"sc" = 1 + 0.033 cos((360 dot n) / 365)$

where $n$ is the day number (1 for January 1, 365 for December 31).

## Terrestrial Solar Radiation

As solar radiation passes through the atmosphere, it is attenuated by scattering and absorption. The three components of terrestrial radiation are:

- **Beam (direct) radiation** $I_b$: received directly from the sun's disk
- **Diffuse radiation** $I_d$: received after scattering by atmospheric molecules, aerosols, and clouds
- **Global radiation** $G$: the sum of beam and diffuse on a surface

$G = I_b + I_d$

On a clear day, diffuse radiation may be only 10–20% of global radiation. On a completely overcast day, nearly 100% is diffuse.

### Atmospheric Attenuation

Ozone ($O_3$) absorbs shortwave UV ($lambda < 0.29$ µm). Water vapour and $"CO"_2$ absorb longwave IR ($lambda > 2.3$ µm). The useful spectrum for terrestrial solar applications is 0.29 µm to 2.5 µm.

### Air Mass

Air mass is the ratio of the path length through the atmosphere that a solar beam traverses to the vertical path length:

$"AM" = 1 / cos(theta_z)$

where $theta_z$ is the zenith angle. At sea level with the sun directly overhead, $"AM" = 1$. The standard test condition for solar panels is $"AM" 1.5$ ($theta_z approx 48.2 degree$).

## Solar Geometry and Angles

### Fundamental Angles

| Angle | Symbol | Definition |
| :--- | :---: | :--- |
| Latitude | $phi$ | Angle between equatorial plane and the line to the point |
| Declination | $delta$ | Angle between equatorial plane and the Earth–Sun line; varies +23.45° to −23.45° |
| Hour angle | $omega$ | Angular displacement of sun east or west of local meridian; $omega = 15° (t - 12)$ |
| Altitude | $alpha$ | Vertical angle from horizontal to sun's rays; $alpha = 90° - theta_z$ |
| Zenith | $theta_z$ | Angle from vertical to sun's rays; $theta_z = 90° - alpha$ |
| Solar azimuth | $gamma_s$ | Horizontal angle from south to the sun's projection |

### Key Equations

**Declination (Cooper's equation):**

$delta = 23.45 sin((360 / 365)(284 + n))$

**Zenith angle for a horizontal surface:**

$cos(theta_z) = sin(phi) sin(delta) + cos(phi) cos(delta) cos(omega)$

**Sunrise/sunset hour angle:**

$cos(omega_s) = -tan(phi) tan(delta)$

**Day length:**

$t_d = (2 / 15) arccos(-tan(phi) tan(delta))$ hours

### Angle of Incidence on a Tilted Surface

For a surface with tilt $s$ and surface azimuth $gamma$, the general incidence angle equation is:

$cos(theta) = sin(delta) sin(phi) cos(s) - sin(delta) cos(phi) sin(s) cos(gamma) + cos(delta) cos(phi) cos(s) cos(omega) + cos(delta) sin(phi) sin(s) cos(gamma) cos(omega) + cos(delta) sin(s) sin(gamma) sin(omega)$

**Special case — south-facing surface** ($gamma = 0$):

$cos(theta) = cos(phi - s) cos(delta) cos(omega) + sin(phi - s) sin(delta)$

**Special case — horizontal surface** ($s = 0$): $theta = theta_z$

### Local Solar Time

$"LST" = "IST" - 4("Std. Longitude" - "Local Longitude") + "EoT"$

where IST is Indian Standard Time, the standard longitude for IST is 82.5° E, and EoT (Equation of Time) corrects for orbital eccentricity and axial tilt (varies from about −14 to +16 minutes).

### Worked Example

**Problem:** Determine local solar time and declination at latitude 23°15' N, longitude 77°30' E at 12:30 IST on June 19. EoT = −1'01".

**Solution:**

Day of year: $n = 31 + 28 + 31 + 30 + 31 + 19 = 170$

Declination:

$delta = 23.45 sin((360 / 365)(284 + 170)) = 23.45 sin(428.49 degree) = 23.43 degree$

Local solar time:

$"LST" = 12 "h" 30 "min" - 4(82.5 degree - 77.5 degree) - 1 "min" 1 "s" = 12 "h" 8 "min" 59 "s"$

## Solar Radiation Measurement Instruments

| Instrument | Measures | Key Feature |
| :--- | :--- | :--- |
| **Pyrheliometer** | Direct (beam) radiation $I_b$ | Collimator tube restricts field of view to sun's disk (~5° cone); must track the sun |
| **Pyranometer** | Global radiation $G$ | Hemispherical glass dome; measures beam + diffuse on a horizontal surface |
| **Sunshine recorder** | Duration of bright sunshine | Glass sphere focuses sunlight onto a card, burning a trace proportional to sunshine hours |

### Pyrheliometer (Ångström Compensation Type)

Two identical blackened manganin strips: one exposed to sunlight, one shaded. Under steady-state, electrical power input to the shaded strip equals absorbed solar power on the exposed strip:

$H_"DN" = K i^2$

where $i$ is the heating current, $K = R / (w alpha)$ is the instrument constant, $R$ is resistance per unit length, $w$ is mean strip width, and $alpha$ is absorptivity.

### Pyranometer

A black detector surface under glass domes with a thermopile (series of thermocouples). The black surface absorbs all incident radiation, causing a temperature rise. The thermopile generates a voltage proportional to the temperature difference, calibrated to give global irradiance $G$ in W/m².

## Estimation of Average Solar Radiation

When measured data is unavailable, the **Ångström-Prescott equation** estimates monthly average daily global radiation:

$H_g / H_0 = a + b (overline(n) / N)$

where $H_g$ is the monthly average daily global radiation, $H_0$ is the monthly average daily extraterrestrial radiation, $overline(n)$ is the monthly average daily sunshine hours, $N$ is the maximum possible daily sunshine hours (day length), and $a, b$ are empirical regression constants ($a + b approx 1$).

$H_0 = (24 / pi) I_"sc" [1 + 0.033 cos((360 n) / 365)] (cos(phi) cos(delta) sin(omega_s) + (pi omega_s / 180) sin(phi) sin(delta))$

### Worked Example

**Problem:** Average daily global radiation on a horizontal surface for June 22 at latitude 10° N. Given: $a = 0.30$, $b = 0.51$, $overline(n) / N = 0.55$.

**Solution:**

Day of year: $n = 173$

Declination: $delta = +23.45 degree$ (summer solstice)

Sunrise hour angle:

$omega_s = arccos(-tan(10°) tan(23.45°)) = arccos(-0.1763 times 0.4339) = arccos(-0.0765) = 94.39°$

Extraterrestrial radiation $H_0$: substituting all values into the $H_0$ formula yields $H_0 = 36.35 " MJ/m"^2 "day"$.

Estimated global radiation:

$H_g = H_0 (a + b (overline(n) / N)) = 36.35 (0.30 + 0.51 times 0.55) = 36.35 times 0.5805 = 21.10 " MJ/m"^2 "day"$

## Revision Checklist

- [ ] State the solar constant and explain its variation with day of year
- [ ] Define beam, diffuse, and global radiation
- [ ] Explain air mass and its significance
- [ ] Calculate declination, hour angle, and day length
- [ ] Calculate the angle of incidence on a tilted south-facing surface
- [ ] Convert IST to Local Solar Time
- [ ] Describe the working of a pyrheliometer and pyranometer
- [ ] Use the Ångström-Prescott equation to estimate solar radiation
