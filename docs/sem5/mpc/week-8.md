# Week 8 — PCB Design & Capacitor Selection

---

## 1. PCB Sections in a Power Converter

| Section | Function |
|---|---|
| Power stage | MOSFETs, diodes, inductors, bulk caps — high current, high dv/dt |
| Gate driver | Amplifies PWM signal, provides isolation for high-side |
| Controller | DSP/MCU, generates PWM; low-voltage digital signals |
| Sensing/interfacing | Current/voltage transducers, buffers, signal conditioning |

- Drivers and snubbers must be placed **close to power devices** to minimize gate loop inductance and snubber trace inductance

---

## 2. Grounding — Star Node

Four ground types:
1. **Power ground** — high-current switching return
2. **Analog ground** — low-noise reference for op-amps/sensors
3. **Digital ground** — logic/processor reference
4. **Chassis ground** — metal enclosure, safety earth (PE)

**All ground planes must connect at a single STAR NODE** — prevents ground loops.

> **FIB**: "Planes/polygons of different types of ground should be connected in a **star** node."

### Ground Loop
- Formed by closed conductive path between multiple ground connections
- Changing magnetic flux (from nearby switching currents) → induces noise voltage (Faraday's law)
- **Star grounding** eliminates ground loops

### Chassis Ground Connections
- Y-capacitors (CM filter) return to **chassis ground**
- CM EMI filter reference → **chassis ground**
- Acceptable: power ground connected to chassis at a single deliberate tie point

---

## 3. Trace Width

Determined by: **current magnitude, copper thickness, temperature rise** (per IPC-2152)

NOT determined by: voltage (that's clearance/creepage), PCB material.

### Creepage vs Clearance
- **Clearance**: minimum distance **through air** between two conductors → prevents arcing
- **Creepage**: minimum distance **along surface** of insulator → prevents tracking
- Both set by the **voltage difference** between conductors per IPC-2221/safety standards
- At voltages > 300 V: creepage requirement becomes **significantly larger** than clearance (surface tracking is the dominant risk at high voltage across contaminated or humid surfaces)

> **MCQ trap**: Creepage ≥ Clearance always. At high voltage (>300V), creepage >> clearance.

### Thermal Vias
- Transfer heat from SMD component pad to inner/backside copper planes
- Placed **directly under** hot components (not beside them)
- Do NOT increase electrical resistance of signal/power traces

---

## 4. PCB Layout Rules for Power Converters

1. **Minimize high di/dt loop area** — the critical loop in Buck: Input cap → MOSFET → freewheeling diode → back to cap
2. **Place input decoupling cap closest to MOSFET drain/diode** — reduces stray inductance
3. **Place gate driver close to MOSFET** — minimizes gate loop inductance (prevents oscillation)
4. **Place snubber close to device** — snubber must be at the exact switching node
5. **Continuous ground plane** — low-inductance return path, reduces loop area, acts as Faraday shield, helps heat spreading
6. High di/dt loops should be **small** (NOT large)

---

## 5. Capacitor Types & Selection

### Classification

| Type | Subtypes | Capacitance range | ESR | Polarity? |
|---|---|---|---|---|
| Electrolytic | Aluminium, Tantalum | µF–mF | Higher | YES (polarised) |
| Film | Polyester, Polypropylene, Polystyrene | nF–µF | Very low | No |
| Ceramic | Single-layer, MLCC | pF–µF | Extremely low | No |

> **MSQ trap**: Polypropylene is a **film** capacitor (NOT electrolytic). Tantalum is **electrolytic**.
> Electrolytic types: **Aluminium and Tantalum** only.

### Application Selection

| Application | Best type | Why |
|---|---|---|
| Bulk output capacitor (DC-DC) | **Aluminium electrolytic** | High capacitance, handles large ripple |
| Snubber across MOSFET | **Polypropylene film** | Low ESR/ESL, handles fast dv/dt, no polarity restriction |
| Small size, stable DC filtering | **Tantalum electrolytic** | Smaller than Al-electrolytic, lower ESR — but catastrophic short-circuit failure if overvoltage |
| High-freq gate driver decoupling | **MLCC (ceramic)** | Ultra-low ESL, tiny SMD, placed at IC pins |
| EMI filter / resonant circuits | Polypropylene film | Low loss (very low tan δ) |

---

## 6. Non-Ideal Capacitor Model

### Self-Resonant Frequency (SRF)
```
fr = 1 / (2π · √(Ls · Cr))
```
- `Ls` = Equivalent Series Inductance (ESL)
- Below fr: capacitive behaviour (normal)
- Above fr: **inductive** behaviour → capacitor is useless for filtering
- Multiple capacitors in parallel → each has smaller Ls → higher combined SRF

### Dissipation Factor (tan δ)
```
tan δ = Rs · ω · Cr
```
where `Rs` = ESR, `ω = 2πf`

### ESR
- Varies with **frequency AND temperature** (both — confirmed in exam Q&A)
- Does NOT depend on voltage
- Electrolytic capacitors have high ESR at high frequency → unsuitable for high-frequency filtering

### Other Capacitor Specs (MCQ-tested)
- **Current ripple / RMS current rating**: max RMS current capacitor can handle without overheating
- **dv/dt rating**: max rate of voltage change (critical for snubbers and film caps)
- **Failure rate**: reliability metric; electrolytic fail open, tantalum fail **short** (catastrophic)

> **MCQ**: Highest capacitance per unit volume → **Electrolytic**. Film and ceramic cannot match electrolytic for raw capacitance.

---

## 7. MLCC Non-Ideal Behaviour

- **DC bias derating**: Class II MLCCs (X7R, Y5V) use ferroelectric dielectric → capacitance drops significantly as DC voltage approaches rated voltage
  - At 50% rated voltage: ~10–30% capacitance loss (X7R); at 80–100% rated voltage: up to 50–80% loss (Y5V worst)
  - **Design rule**: derate to 50% of rated voltage max, then derate capacitance further based on manufacturer's bias curve
- Must account for this in design — nominal capacitance at 0V may not be available at operating voltage

> **MCQ trap**: A 10 µF X7R MLCC may only provide 4–6 µF at its operating DC voltage. Always check the DC bias derating curve.

---

## 8. Numeric Problem Approach

### Self-Resonant Frequency
1. `fr = 1 / (2π · √(Ls · Cr))`
2. e.g. Ls=25nH, Cr=100µF: `fr = 1/(2π·√(25e-9×100e-6)) = 1/(2π×1.581e-6) = 100.7 kHz`

### Dissipation Factor
1. `tan δ = Rs · 2πf · Cr`
2. e.g. Rs=0.05Ω, Cr=470µF, f=100kHz: `tan δ = 0.05 × 2π×10⁵ × 470×10⁻⁶ = 14.77` (very lossy at 100 kHz → don't use electrolytic here)

### Trace Width (IPC-2152 simplified)
- Outer layer, 1 oz copper, 10°C rise, 5 A → typically requires ≈ 30 mil width (from standard charts)
- 1 oz copper = **1.378 mil** (35 µm) thick; 2 oz = 2.756 mil (70 µm)
- Key point: width determined by **current and temperature rise**, NOT voltage
- Unit reminder: 1 mil = 0.0254 mm; "mil" is thousandths of an inch (not millimetre)

---

## 9. MCQ/MSQ Quick Reference

- Star node: all grounds connected at **one point** only
- Ground loop → magnetically induced noise via Faraday's law
- Trace width: depends on current, copper thickness → NOT on voltage
- Clearance/creepage: determined by **voltage**
- High di/dt loop must be **minimized** (not maximized)
- Input cap goes closest to drain/diode (minimises switching loop inductance)
- First component placed in Buck layout: **input decoupling capacitor**
- Above SRF: capacitor behaves as **inductor** (useless for filtering)
- MLCC: DC bias derating → capacitance drops at high DC voltage
- Tantalum: lower ESR than aluminium, smaller, but can fail catastrophically (short circuit)
- Aluminium electrolytic: highest capacitance per cost, but polarised, higher ESR
- Film (polypropylene): best for snubbers, low loss, fast dv/dt tolerance
- Buffer in sensing path: presents **high input impedance** to the sensor (doesn't load it) and **low output impedance** to the controller (drives it cleanly)
  - Without buffer: sensor + controller input form voltage divider → `V_loaded = V_open × R_input / (R_sensor + R_input)` → reading error
  - **MCQ**: "What introduces high impedance between sensor and controller?" → **Buffer** (protecting the sensor from being loaded)
- **Ceramic (MLCC) is NOT suitable for snubbers**: Class II ceramic has high dv/dt stress degradation and low voltage rating → use polypropylene film for snubbers

---

## 10. FIB Quick Answers

- Four ground types: **Power, Analog, Digital, Chassis**
- Grounds connect at single **star** node
- A **ground** loop introduces noise
- Clearance = distance through **air**; Creepage = distance along **surface**
- `fr = 1/(2π·√(Ls·Cr))`
- `tan δ = Rs·ω·Cr`
- Electrolytic types: **Aluminium** and **Tantalum** only
- Film types: Polyester, Polypropylene, Polystyrene
- CM EMI filter reference connected to **chassis** ground
- Thermal vias placed **directly under** hot component (not beside)
- MLCC non-ideal: **DC bias derating**
