# Week 8 — Capacitors, PCB Design & Grounding

> **NPTEL: Design of Modern Power Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Power Converter Architecture — Full System View

A complete power converter is not just a switching circuit. Understanding each block's role is tested in NPTEL:

| Stage | Function | Key components |
|-------|----------|---------------|
| **1. EMI filter** | Attenuate conducted noise before it enters the grid | CM choke, $C_X$, $C_Y$ capacitors |
| **2. Rectifier / PFC** | AC→DC conversion; optionally correct power factor | Bridge diodes, boost inductor (PFC) |
| **3. DC bus / bulk capacitor** | Energy storage, voltage holdup | Electrolytic capacitor |
| **4. Power stage** | Switching conversion (buck, boost, flyback, etc.) | MOSFETs/IGBTs, transformer, inductor |
| **5. Output filter** | Smooth output voltage and current | LC filter |
| **6. Gate driver circuit** | Drive switching devices at required speed | Gate driver IC, $R_g$, bootstrap cap |
| **7. Control circuit** | PWM generation, feedback, protection | Microcontroller or analog controller |
| **8. Auxiliary power supply** | Power the gate drivers and control ICs from the DC bus | Small flyback or linear regulator |

> **Why an auxiliary supply?** The control circuit needs a stable low-voltage supply (3.3 V or 5 V). It cannot run directly from the DC bus (often 400 V). A small isolated flyback provides this.

---

## 2. Capacitors in Power Electronics — Detailed Analysis

Capacitors are everywhere in a converter, and **the wrong capacitor type in the wrong location causes failure or poor performance.** This is a heavily tested area.

### 2.1 Real Capacitor Model

An ideal capacitor has zero resistance and zero inductance. A real capacitor has:

$$\boxed{Z_{cap}(\omega) = ESR + j\left(\omega L_{ESL} - \frac{1}{\omega C}\right)}$$

| Parasitic | Name | Effect |
|-----------|------|--------|
| **ESR** | Equivalent Series Resistance | Voltage drop under ripple current; self-heating ($I_{ripple}^2 \times ESR$) |
| **ESL** | Equivalent Series Inductance | Makes capacitor **inductive** above self-resonant frequency |

**Self-Resonant Frequency (SRF):**

$$\boxed{f_{SRF} = \frac{1}{2\pi\sqrt{L_{ESL} \cdot C}}}$$

- Below $f_{SRF}$: capacitor is capacitive (works as intended)
- At $f_{SRF}$: minimum impedance (best bypass performance)
- Above $f_{SRF}$: capacitor is **inductive** → no longer useful as a bypass; behaves as an inductor!

> **Exam question:** "At what frequency does a capacitor stop being useful as a bypass capacitor?" — Above its SRF. This is why multiple capacitor values are paralleled (e.g., 100 μF + 100 nF + 100 pF): each covers a different frequency range up to its own SRF.

---

### 2.2 Capacitor Types — Comparison Table

| Type | Capacitance | ESR | ESL | Voltage | Polarized? | Frequency range | Primary use in PE |
|------|-------------|-----|-----|---------|------------|-----------------|-------------------|
| **Electrolytic (Al)** | 1 μF–100 mF | Medium–High | Medium | Up to 450 V | **Yes** | DC–50 kHz | Bulk DC-link, output filter |
| **Film (Polyester/PP)** | 1 nF–100 μF | Low | Low | Up to 2 kV | No | DC–1 MHz | DC link snubber, AC filtering, $C_X$ |
| **Ceramic (MLCC X7R/C0G)** | 1 pF–100 μF | Very low | Very low | Up to 1 kV | No | DC–GHz | High-freq decoupling, gate drive bypass |
| **Tantalum** | 0.1–1000 μF | Low | Low | Up to 50 V | **Yes** | DC–500 kHz | Compact output filtering |
| **Supercapacitor** | Farads | Very high | — | Up to 2.7 V | No | DC only | Energy storage (not filtering) |

### 2.3 Electrolytic Capacitor — Special Considerations

1. **Polarized** — must never be reverse-biased. In AC circuits, two electrolytics in anti-series.
2. **Lifetime depends on temperature** — every 10°C reduction approximately doubles the lifetime (Arrhenius relationship). Run them cool.
3. **Ripple current rating** — limited by internal heating ($I_{ripple}^2 \times ESR$). Always check ripple current spec.
4. **Voltage derating** — operate at ≤ 80% of rated voltage for reliability (transients add to DC voltage).

**RMS ripple current in output capacitor (buck converter):**

$$I_{C,rms} = \frac{\Delta i_L}{2\sqrt{3}}$$

This must be within the capacitor's ripple current rating from the datasheet.

### 2.4 Capacitor Selection for DC-Link

The DC-link capacitor (bulk capacitor) in a power supply serves to:
1. Store energy to support the load during line voltage dips (holdup time)
2. Filter switching frequency ripple on the bus voltage
3. Provide low-impedance path for switching currents (decouple the converter from the input)

**Selection criteria:**
- Capacitance: from holdup time requirement — $C = \frac{2 P_o \cdot t_{hold}}{V_{dc,min}^2 - V_{dc,min}^2}$
- Voltage rating: ≥ peak rectified input voltage × derating factor (typically 1.5×–2×)
- ESR: low enough so $I_{ripple} \times ESR$ doesn't add unacceptable ripple to the DC bus
- Ripple current rating: must exceed the RMS ripple current through it

### 2.5 Capacitor Voltage Derating

**Rule of thumb:** Rate the capacitor at **1.5× to 2× the maximum operating voltage** because:
- Switching transients (ringing, spikes) momentarily exceed DC bus voltage
- Capacitor rated voltage degrades with temperature
- Reliability: capacitor failure rate increases sharply as voltage approaches rating

---

## 3. PCB Layout for Power Electronics

PCB layout is **not cosmetic** — it directly determines converter performance. Poor layout can cause:
- Excessive ringing and overvoltage spikes (destroying devices)
- Poor EMI compliance
- Thermal hotspots
- False triggering of gate signals

### 3.1 Parasitic Elements from PCB Traces

Every PCB trace has:
- **Resistance:** $R = \rho l / (w \cdot t)$ — wide, short traces reduce $R$
- **Inductance:** $L \approx 10\,nH/cm$ for a typical trace — even 1 nH causes $V = L \cdot di/dt$ spikes

**Example:** A switching MOSFET switches $I = 10\,A$ in $t = 10\,ns$ through a trace with $L = 10\,nH$:

$$V_{spike} = L \cdot \frac{di}{dt} = 10\times10^{-9} \times \frac{10}{10\times10^{-9}} = 10\,V$$

This spike appears across the device in addition to the DC bus voltage — it can destroy the device if not managed.

$$\boxed{V_{spike} = L_{loop} \cdot \frac{\Delta I}{\Delta t}}$$

### 3.2 The Critical Switching Loop

**The switching loop:** DC-link capacitor → top MOSFET → switching node → bottom MOSFET/diode → back to capacitor.

This loop carries the full switching current at the switching frequency and all its harmonics. Every nH of inductance in this loop:
- Adds to the voltage spike at turn-off
- Causes ringing (LC tank with MOSFET capacitances)
- Radiates EMI (loop antenna)

**Golden rule #1: Minimize the area of the switching loop.**

How to minimize:
- Place the DC-link capacitor **immediately adjacent** to the MOSFET (drain to drain or drain to source)
- Keep top switch, bottom switch, and capacitor in a tight triangle
- Use copper pour on both sides and vias to return current

### 3.3 PCB Layout Golden Rules

**1. Minimize high-current, high-frequency loop areas.**
Every cm² of loop area radiates EMI proportional to $\Delta I \cdot f_s \cdot A_{loop}$.

**2. DC-link capacitor close to switching device.**
Reduces loop inductance $L_{loop}$ directly. Every mm matters.

**3. Separate power ground and signal ground.**
Switching currents through power ground create voltage drops that look like noise to control circuits. Use separate planes connected at a **single star point**.

**4. Gate traces away from switching node.**
Miller capacitance ($C_{gd}$) can couple $dV/dt$ from the drain onto the gate trace and cause **false turn-on** or oscillation. Route gate traces on the opposite side of the board from the switching node.

**5. Wide, short traces for high-current paths.**
- Resistance ∝ $l / (w \cdot t)$ → wide trace = low resistance
- Inductance ∝ $l$ → short trace = low inductance

**6. Ground planes reduce inductance dramatically.**
A continuous copper ground plane on the bottom layer returns high-frequency currents with minimal inductance (image current flows directly below the signal trace).

**7. Decoupling capacitors at every IC supply pin.**
Gate driver ICs draw large pulse currents. Without a ceramic decoupling cap (100 nF) at the supply pin, the supply rail dips momentarily, causing under-voltage lockout or noise.

---

## 4. Grounding — Types and Best Practices

### 4.1 Ground Types in a Power Converter

| Ground type | Description | Characteristics |
|-------------|-------------|-----------------|
| **Earth ground (PE)** | Protective earth — chassis bolted to building ground | Safety function; should carry no signal or power current in normal operation |
| **Power ground** | Return path for high-frequency switching currents | Fluctuates with $L \cdot di/dt$; "noisy" |
| **Signal ground** (analog/digital) | Reference for control circuits, feedback measurements | Must be quiet; even mV fluctuations cause ADC errors |
| **Chassis ground** | Mechanical enclosure | Connected to earth at single point |

### 4.2 Star Grounding

**Problem:** If signal and power share a common ground conductor, the $L \cdot di/dt$ drop in the power ground appears as noise at the signal reference point.

**Solution — Star grounding:** All ground types meet at a **single point** (the star). From this point:
- Power ground runs directly to capacitors/MOSFETs
- Signal ground runs directly to control ICs and sensors
- No shared impedance path

```
                    ★ Star Point
                   / | \
     Power GND ──/  |  \── Signal GND
                    |
              Earth/PE
```

**Two-layer board equivalent:** Separate copper areas for power and signal ground, joined at a single via or pad (the star point). Never let them share a path.

### 4.3 Floating Ground

A **floating ground** is a reference not connected to earth. Used in:
- Isolated topologies (transformer provides isolation; secondary ground floats relative to primary)
- Battery-powered systems

**Risk:** Common-mode voltage can build up on a floating reference due to capacitive coupling. In high-dV/dt environments, this can become dangerous or destructive. Manage with $C_Y$ capacitors to earth (see EMI section).

### 4.4 Ground Loops

A **ground loop** occurs when current circulates in a closed path formed by two ground connections — the two paths have different impedances, so a voltage drives current around the loop. This causes noise and, in extreme cases, currents that damage sensitive components.

**Prevention:** Single-point ground (star) eliminates ground loops because there is only one ground path for each section.

---

## 5. Component-Level Notes — Resistors, Inductors, Connectors

### 5.1 Resistors

| Type | Key property | Use in PE |
|------|-------------|-----------|
| **Current sense (shunt)** | Very low $R$ (mΩ), very low inductance | Inline current measurement; placed in power path |
| **Gate resistor** | Controls switching speed and damps oscillation | Between gate driver output and MOSFET gate |
| **Snubber resistor** | Power-rated; must dissipate $\frac{1}{2}C_s V^2 f_s$ | RC snubber across switching device |
| **Bleeder resistor** | Bleeds charge from DC-link after power-off | Safety — discharges bulk capacitor |

**Snubber resistor power:**

$$\boxed{P_{snubber,R} = \frac{1}{2} C_s V^2 f_s}$$

The capacitor charges to $V$ each cycle and the energy is dissipated in $R$ every cycle.

### 5.2 Inductors

- **Self-resonant frequency** must be well above the highest frequency they need to filter
- **DC bias degrades inductance:** as the DC current increases, the core approaches saturation → inductance drops. Check the $L$ vs $I_{DC}$ curve in the datasheet.
- **Saturation current rating:** The current at which inductance drops to 10% (or 20%) of nominal. Must not be exceeded.
- **Thermal rating:** RMS current limit set by winding resistance and maximum temperature

### 5.3 Wire and Connectors

- **Solid wire at high frequency:** Skin effect reduces effective cross-section → use litz wire or copper bus bars
- **Connector contact resistance:** A 10 mΩ contact under 10 A drops 100 mV and dissipates 1 W — use adequately rated connectors
- **Crimped vs soldered joints:** Crimped joints are preferred in high-vibration environments; soldered joints can crack under thermal cycling

---

## 6. PCB Design Practical Flow

**Correct component placement sequence (critical — do in this order):**

1. **Power loop first:** Place DC-link cap, top MOSFET, bottom MOSFET/diode as close together as physically possible. Minimize switching loop area.
2. **Gate drivers:** Place immediately adjacent to the gate pins of the MOSFETs. Short gate traces.
3. **Decoupling capacitors:** One ceramic cap at every IC supply pin, placed on the same side as the pin.
4. **Magnetics:** Place inductor and transformer — consider thermal spreading and clearance from sensitive circuits.
5. **Control circuit:** Place on a separate area, far from switching node; keep traces away from high-dV/dt nodes.
6. **EMI filter:** At the power input connector — first thing the input current sees.
7. **Route power traces:** High-current traces first; wide and short. Then signal traces.
8. **Pour ground planes:** Separate power and signal planes; connect at star point.
9. **Verify:** No signal traces parallel to high-current traces; no long gate drive traces near switching nodes.

---

## 7. Summary — Key Exam Recall Points

**Capacitors:**
- Electrolytic: high C, polarized, limited frequency — use for bulk filtering only
- Ceramic: low ESR/ESL, non-polarized, high SRF — use for decoupling and gate bypass
- Film: low loss, non-polarized, medium C — use for snubbers and EMI $C_X$
- SRF = frequency above which a capacitor becomes inductive
- $C_Y$ capacitors are strictly limited to ≤ 4.7 nF by safety standards (leakage current)
- Voltage derating: use 1.5×–2× the operating voltage as the rated voltage

**PCB layout:**
- Minimize switching loop area → less $V_{spike} = L \cdot di/dt$, less EMI
- DC-link cap as close to switch as possible
- Separate power and signal grounds — star point connection
- Gate traces far from switching node (prevent false turn-on via Miller)
- Ground planes reduce loop inductance

**Grounding:**
- Star grounding prevents ground loops
- Signal ground must be isolated from power ground except at star point
- Floating grounds accumulate CM voltage — manage with small $C_Y$ to earth

---

## Formula Sheet — Week 8

$$Z_{cap}(\omega) = ESR + j\left(\omega L_{ESL} - \frac{1}{\omega C}\right)$$

$$f_{SRF} = \frac{1}{2\pi\sqrt{L_{ESL} \cdot C}} \quad \text{(self-resonant frequency)}$$

$$V_{spike} = L_{loop} \cdot \frac{\Delta I}{\Delta t} \quad \text{(switching node spike)}$$

$$P_{snubber} = \frac{1}{2} C_s V^2 f_s \quad \text{(snubber resistor must dissipate this)}$$

$$I_{C,rms} = \frac{\Delta i_L}{2\sqrt{3}} \quad \text{(output cap ripple current, buck converter)}$$
