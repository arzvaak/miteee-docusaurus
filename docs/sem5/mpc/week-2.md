# Week 2 — Power Semiconductor Devices

> **NPTEL: Design of Power Electronic Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Power Diode Classification

Three types, ordered by increasing switching speed:

$$\text{Rectifier (slowest)} \;\ll\; \text{Fast Recovery} \;\ll\; \text{Schottky (fastest)}$$

| Type | Speed | Max voltage | Conduction mechanism | Typical use |
|------|-------|-------------|---------------------|-------------|
| **General-purpose rectifier** | Slow (μs) | Very high (kV) | Minority carrier | 50 Hz mains rectification only |
| **Fast recovery** | Fast (100s ns) | Medium (600 V–2 kV) | Minority carrier, optimized doping | Freewheeling diode in DC-DC converters |
| **Schottky** | Fastest (ns) | Low (&lt;200 V) | **Majority carrier only** | High-freq SMPS, synchronous rectifier bypass |

**Why Schottky is the fastest:** Metal-semiconductor junction has no minority carrier storage — no $Q_{rr}$ to sweep out. Turn-off is nearly instantaneous.

**Why Schottky voltage is limited to ~200 V:** The Schottky barrier height is small; at higher voltages, the leakage current becomes excessive. Silicon Schottky is limited to ~100–200 V.

> SiC Schottky diodes extend the Schottky principle to 650 V–1.7 kV with near-zero $Q_{rr}$ — increasingly used in modern high-efficiency converters.

---

## 2. Diode Reverse Recovery — Full Analysis

When a conducting diode is reverse biased (turned off), minority carriers stored in the junction must be swept out **before** the diode can block voltage. During this sweep-out, current actually flows in the **reverse direction**.

### Reverse Recovery Parameters

| Symbol | Name | Definition |
|--------|------|-----------|
| $t_a$ | Phase a time | Zero crossing of diode current → peak reverse current $I_{RR}$ |
| $t_b$ | Phase b time | $I_{RR}$ → current returns to zero |
| $t_{rr} = t_a + t_b$ | Reverse recovery time | Total time from zero crossing to full turn-off |
| $I_{RR}$ | Peak reverse current | Maximum reverse current spike |
| $Q_{RR}$ | Reverse recovery charge | Total charge swept out (area under reverse current curve) |

$$\boxed{I_{RR} = \frac{2Q_{RR}}{t_{rr}}}$$

### Softness Factor

$$S = \frac{t_b}{t_a}$$

| Value | Behaviour | EMI/ringing |
|-------|-----------|------------|
| $S < 1$ | **Snappy (hard recovery)** — $t_b < t_a$, steep current fall after $I_{RR}$ | High $dI/dt$ → ringing → EMI |
| $S \geq 1$ | **Soft recovery** — gradual return to zero | Gentle → less EMI |

**Why $I_{RR}$ matters in a converter:** When the MOSFET turns ON (e.g., high-side switch in a buck), it must first supply $I_{RR}$ to clear the freewheeling diode's stored charge. The switch current spikes to $I_{load} + I_{RR}$ before the diode turns off. This spike:
- Increases MOSFET turn-on switching loss ($\propto V_{in} \times I_{RR}$)
- Can cause voltage overshoot if not managed
- Creates EMI (fast current spike)

### Diode Datasheet Parameters

| Symbol | Meaning | Affects |
|--------|---------|---------|
| $V_{RWM}$ | Max repetitive peak reverse voltage | Circuit design |
| $V_{RSM}$ | Max non-repetitive surge reverse voltage | Transient protection |
| $V_{BR}$ | Breakdown voltage | Device limit |
| $I_{F(AV)}$ | Average forward current | Thermal limit — **main current rating** |
| $I_{FSM}$ | Non-repetitive surge forward current | Startup/fault |
| $V_F$ | Forward voltage drop | Conduction loss |
| $t_{rr}$ | Reverse recovery time | Switching loss |
| $Q_{RR}$ | Reverse recovery charge | Switching loss |
| $R_{\theta jc}$ | Junction-to-case thermal resistance | Heatsink design |

**$Q_{RR}$ and $t_{rr}$ determine switching loss. $V_F$ and $I_{F(AV)}$ determine conduction loss. They are independent.**

---

## 3. MOSFET Structure and Fundamentals

**Key structural features:**
- N-channel MOSFET: gate controls channel between drain and source
- **Unipolar device** — only majority carriers (electrons in N-channel) → fastest switching
- **Voltage-controlled** — gate draws no DC current; only charges/discharges capacitances
- **Body diode** — intrinsic pn junction between source and drain; allows reverse current even when gate is off
- $R_{DS(on)}$ has **positive temperature coefficient** — increases with junction temperature (tendency toward thermal equilibrium, not thermal runaway)

**$R_{DS(on)}$ vs voltage rating:**

$$R_{DS(on)} \propto V_{BR}^{2.5}$$

A 600 V MOSFET has roughly $(600/100)^{2.5} \approx 279\times$ higher $R_{DS(on)}$ than a comparable 100 V device. This is why MOSFETs become uncompetitive at high voltages — IGBTs offer lower conduction loss above ~600 V.

### MOSFET Parasitic Capacitances

| Datasheet symbol | Physical | Formula | Significance |
|-----------------|----------|---------|-------------|
| $C_{iss}$ | Input capacitance | $C_{gs} + C_{gd}$ | Determines total gate charge |
| $C_{oss}$ | Output capacitance | $C_{ds} + C_{gd}$ | Limits ZVS operation; capacitive switching loss |
| $C_{rss}$ | Reverse transfer (Miller) | $C_{gd}$ | **Causes Miller plateau** — dominates switching time |

**$C_{rss} = C_{gd}$ is the key capacitance** — it feeds back drain voltage changes to the gate, causing the plateau.

Note: $C_{oss}$ is **non-linear** — it decreases significantly as $V_{DS}$ increases. Datasheets sometimes specify $C_{oss}$ at a specific $V_{DS}$ (e.g., 25 V).

---

## 4. MOSFET Switching — Gate Charge and Turn-ON Sequence

The gate voltage waveform during turn-ON has four distinct phases. Understanding each is critical for selecting gate resistors and predicting switching time.

| Phase | Duration | What happens | $V_{GS}$ | $V_{DS}$ | $I_D$ |
|-------|----------|-------------|----------|----------|-------|
| **Delay** $t_{d(on)}$ | $C_{gs}$ charges 0 → $V_{th}$ | Nothing yet — MOSFET still off | Rising | $V_{bus}$ | 0 |
| **Current rise** $t_{ri}$ | $I_D$ rises 0 → full load | MOSFET enters saturation; diode still conducting | Rising to $V_{GP}$ | $V_{bus}$ | Rising |
| **Miller plateau** $t_{fm}$ | $C_{gd}$ discharges; $V_{DS}$ falls | ALL gate current goes into $C_{gd}$ — $C_{gs}$ gets nothing | **Flat at $V_{GP}$** | Falling | $I_L$ |
| **Final charge** | $C_{gs}$ charges $V_{GP}$ → $V_{driver}$ | Fully on — $R_{DS(on)}$ region | Rising | Low | $I_L$ |

**Turn-OFF is exact reverse:** plateau occurs while $V_{DS}$ rises.

**Gate plateau voltage $V_{GP}$** (Miller plateau level):

$$V_{GP} = V_{GS(th)} + \frac{I_D}{g_{fs}}$$

where $g_{fs}$ is the transconductance. A device with higher $g_{fs}$ has a lower plateau voltage → faster switching.

### Gate Charge Quantities

| Symbol | Name | Definition |
|--------|------|-----------|
| $Q_1 = Q_{gs1}$ | Charge to reach $V_{th}$ | $C_{gs} \times V_{th}$ |
| $Q_2 = Q_{gs2}$ | Gate charge during current rise | $C_{gs} \times (V_{GP} - V_{th})$ |
| $Q_3 = Q_{gd}$ | Miller charge | $C_{gd} \times V_{DS}$ — dominates switching time |
| $Q_g$ | Total gate charge | All phases combined |
| $Q_{sw} = Q_2 + Q_3$ | Switching charge | Determines actual $V_{DS}$ switching time |

**Gate drive power:**

$$\boxed{P_g = Q_g \cdot V_{GS} \cdot f_s}$$

**Gate drive current required:**

$$\boxed{I_g = \frac{Q_g}{t_{switch}}}$$

**Switching time (roughly):** $t_{switch} \approx Q_{sw} / I_g = Q_{sw} \cdot R_g / (V_{driver} - V_{GP})$

### Gate Resistor Trade-offs

| Smaller $R_g$ | Larger $R_g$ |
|--------------|-------------|
| Faster switching | Slower switching |
| Lower switching loss | Higher switching loss |
| Higher $dV/dt$, $dI/dt$ | Lower $dV/dt$, $dI/dt$ |
| More EMI, more ringing | Less EMI |
| Risk of oscillation | No oscillation risk |

A separate turn-off resistor (often smaller) is sometimes used to speed up turn-off without causing turn-on ringing.

---

## 5. Device Comparison: BJT vs MOSFET vs IGBT

| Parameter | BJT | MOSFET | IGBT |
|-----------|-----|--------|------|
| **Control type** | **Current** (base current) | **Voltage** (gate charge) | **Voltage** (gate charge) |
| Switching speed | Slowest | **Fastest** | Medium |
| Conduction loss (high V) | Low $V_{CE(sat)}$ | High ($R_{DS(on)} \propto V_{BR}^{2.5}$) | Low $V_{CE(sat)}$ |
| Preferred voltage | Medium | **&lt;600 V** | **&gt;600 V** (up to 6.5 kV) |
| Body diode | No | **Yes** (intrinsic) | **No** (must add external) |
| Minority carrier storage | Yes | **No** | Yes (tail current) |
| Max switching frequency | &lt;10 kHz | &gt;1 MHz | Typically &lt;100 kHz |
| On-state temp coefficient | Negative $V_{CE(sat)}$ | **Positive** $R_{DS(on)}$ | Negative $V_{CE(sat)}$ |

**Exam points — commit these to memory:**
- BJT: **current-controlled**; MOSFET and IGBT: **voltage-controlled**
- MOSFET has positive $R_{DS(on)}$ temperature coefficient → parallel MOSFETs self-balance (higher $T$ → higher $R$ → shares less current)
- IGBT and BJT have negative $V_{CE(sat)}$ temperature coefficient → risk of **current hogging** in paralleled devices (hotter device shares more current → thermal runaway)
- IGBT has **no built-in body diode** — always add an external fast anti-parallel diode
- MOSFET body diode is slow; for synchronous rectification, it's acceptable only in some designs

---

## 6. IGBT — Structure, Behaviour and Characteristics

**Structure:** Combines a MOSFET input (gate) with a BJT-like power path (PNP transistor). The MOSFET channel controls base current of the PNP.

**Why lower $V_{CE(sat)}$:** Minority carrier injection into the drift region (conductivity modulation) reduces the effective resistance of the drift layer. At high voltages (thick drift layer), this provides far lower on-state drop than a MOSFET.

**Tail current at turn-off:** When gate is pulled low, the MOSFET channel turns off, but minority carriers already injected into the drift region take time to recombine. The collector current doesn't cut off sharply — it has a **tail** of exponentially decaying current. This tail:
- Limits maximum $f_s$ (tail current causes extra turn-off loss)
- Is affected by temperature (slower recombination at lower $T$)
- Is specified as $t_f$ (fall time) in the datasheet

### IGBT Parasitic Capacitances

| Symbol | Physical capacitances |
|--------|----------------------|
| $C_{ies}$ | Input: $C_{ge} + C_{gc}$ |
| $C_{oes}$ | Output: $C_{gc} + C_{ce}$ |
| $C_{res}$ | Miller (reverse transfer): $C_{gc}$ |

Same structure and analysis as MOSFET — Miller plateau exists for IGBT too.

### IGBT Datasheet Parameters

| Symbol | Meaning |
|--------|---------|
| $V_{CES}$ | Max collector-emitter blocking voltage |
| $V_{CE(sat)}$ | Saturation voltage at rated $I_C$ |
| $I_C$ | Max DC collector current |
| $I_{CM}$ | Max pulsed collector current |
| $V_{GE(th)}$ | Gate threshold voltage |
| $t_{d(on)}, t_r$ | Turn-on delay, current rise time |
| $t_{d(off)}, t_f$ | Turn-off delay, current fall time (tail) |
| $E_{on}, E_{off}$ | Energy per switching event |
| $R_{\theta jc}$ | Junction-to-case thermal resistance |

**$E_{on}$ and $E_{off}$ allow direct calculation of switching loss:**

$$P_{sw,IGBT} = (E_{on} + E_{off}) \cdot f_s$$

### Safe Operating Area (SOA) — 3 Types

| SOA | Condition | Limiting factor |
|-----|-----------|----------------|
| **FBSOA** (Forward Biased) | Normal ON state | $I_C$, $V_{CE}$, max power, secondary breakdown |
| **RBSOA** (Reverse Biased) | During turn-off | $di/dt$ from inductor; $V_{CE}$ at turn-off |
| **SCSOA** (Short Circuit) | Short circuit event | Time the IGBT can survive — typically $10\,\mu s$ |

> **RBSOA exam point:** RBSOA is limited by the load inductor's $di/dt$ at turn-off — if the inductor is large, $di/dt$ is small but $V_{CE}$ spike is high. It's the $V_{CE}$ transient that matters.

---

## 7. Wide Bandgap Devices — SiC and GaN (Overview)

Modern power electronics is transitioning to silicon carbide (SiC) and gallium nitride (GaN). These appear in NPTEL context.

| Parameter | Si MOSFET | SiC MOSFET | GaN HEMT |
|-----------|-----------|------------|---------|
| Bandgap | 1.1 eV | 3.3 eV | 3.4 eV |
| Breakdown field | Low | 10× higher | 10× higher |
| Max junction temp | 150°C | 200°C+ | 150°C |
| Switching speed | Fast | Very fast | Fastest |
| Body diode | Yes (slow) | Yes (good) | No (GaN diode needed) |
| On-resistance | High at high V | Low at high V | Very low |
| Cost | Low | High | High |

**Key takeaway:** SiC and GaN allow higher voltage, higher frequency, and higher temperature operation than silicon — enabling smaller, lighter, more efficient converters.

---

## Formula Sheet — Week 2

$$I_{RR} = \frac{2Q_{RR}}{t_{rr}}$$

$$S = \frac{t_b}{t_a} \quad \text{(softness factor; \textless 1 = snappy)}$$

$$R_{DS(on)} \propto V_{BR}^{2.5} \quad \text{(MOSFET conduction-voltage trade-off)}$$

$$V_{GP} = V_{GS(th)} + \frac{I_D}{g_{fs}} \quad \text{(Miller plateau voltage)}$$

$$P_g = Q_g \cdot V_{GS} \cdot f_s \quad \text{(gate drive power)}$$

$$I_g = \frac{Q_g}{t_{switch}} \quad \text{(gate drive current)}$$

$$P_{sw,IGBT} = (E_{on} + E_{off}) \cdot f_s \quad \text{(IGBT switching loss from datasheet)}$$
