# Week 5 — Power Loss & Thermal Design

> **NPTEL: Design of Power Electronic Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Total Converter Loss Sources

Before diving into the thermal model, understand what generates heat in a converter:

| Loss source | Depends on | Scales with |
|------------|-----------|-------------|
| MOSFET conduction | $I^2 R_{DS(on)}$ | $D$, $I_{sw}^2$, temperature |
| MOSFET switching | $V_{in} I_{sw}(t_{on}+t_{off})f_s$ | **Linear with $f_s$** |
| Diode conduction | $V_F \cdot I_D \cdot (1-D)$ | Current, forward voltage |
| Diode reverse recovery | $V_{in} \cdot I_{RR} \cdot t_{rr}$ | At each MOSFET turn-on |
| Inductor copper loss | $I_{L,rms}^2 \cdot R_{winding}$ | $f$ (skin/proximity effect) |
| Inductor core loss | $P_v \cdot V_{core}$ (Steinmetz) | $f^m B_m^n$ |
| Gate drive loss | $Q_g V_{GS} f_s$ | Linear with $f_s$ |
| Snubber loss | $\frac{1}{2}C_s V_{in}^2 f_s$ | Linear with $f_s$ |

> **Key insight:** Conduction losses are independent of $f_s$. All switching-related losses are proportional to $f_s$. At high frequency, switching losses dominate.

---

## 2. MOSFET Power Loss — Complete Analysis

### 2.1 Conduction Loss

$$\boxed{P_{cond} = D \cdot I_{sw}^2 \cdot R_{DS(on)}}$$

- $D$ = duty cycle (fraction of period that switch is ON)
- $I_{sw}$ = switch current during ON state (≈ average inductor current $I_L$ for small ripple)
- $R_{DS(on)}$ = on-state resistance **at the operating junction temperature** — always read from datasheet at the expected $T_j$, not at 25°C

**RMS current derivation (for accuracy):**

For a buck converter, the switch carries a trapezoidal current during the ON interval. For small ripple approximation:

$$P_{cond,accurate} = I_{sw,rms}^2 \cdot R_{DS(on)}$$

$$I_{sw,rms}^2 \approx D \cdot \left(I_L^2 + \frac{(\Delta i_L)^2}{12}\right)$$

The $\Delta i_L^2/12$ term is usually negligible when $\Delta i_L \ll I_L$.

**Temperature effect on $R_{DS(on)}$:**

$$R_{DS(on)}(T_j) \approx R_{DS(on),25°C} \times \left(\frac{T_j}{300}\right)^{2.3}$$

(exact coefficient is device-dependent; always use datasheet curve)

$R_{DS(on)}$ roughly doubles from 25°C to 150°C for silicon MOSFETs. **Always derate:** if datasheet specifies $R_{DS(on)} = 6\,m\Omega$ at 25°C and operating $T_j = 100°C$, use ~10 mΩ in your calculation.

### 2.2 Switching Loss

$$\boxed{P_{sw} = \frac{1}{2} V_{in} \cdot I_{sw} \cdot (t_{on} + t_{off}) \cdot f_s}$$

- $V_{in}$ = voltage across device just before turn-on / just after turn-off
- $I_{sw}$ = current through device just after turn-on / just before turn-off
- $t_{on}$, $t_{off}$ = switching times from datasheet (or measured)
- Factor of $\frac{1}{2}$: triangular approximation of the $v \times i$ waveform during transition

**Alternative using datasheet energy per switching event:**

$$P_{sw} = (E_{on} + E_{off}) \cdot f_s$$

where $E_{on}$ and $E_{off}$ are given directly in the MOSFET/IGBT datasheet (often specified at particular $V_{in}$, $I_{sw}$, $T_j$).

**Diode reverse recovery contribution at turn-on:**

When the MOSFET turns ON, it must also sweep the freewheeling diode's reverse recovery charge:

$$P_{rr} = V_{in} \cdot Q_{rr} \cdot f_s$$

This adds to $P_{sw}$ at turn-on. For slow diodes, $P_{rr}$ can exceed $P_{sw}$ of the MOSFET itself.

### 2.3 Total MOSFET Loss

$$\boxed{P_{MOSFET} = P_{cond} + P_{sw} = D \cdot I_{sw}^2 \cdot R_{DS(on)} + \frac{1}{2} V_{in} \cdot I_{sw} \cdot (t_{on} + t_{off}) \cdot f_s}$$

---

## 3. Diode Loss

### 3.1 Conduction Loss

$$\boxed{P_{D,cond} = (1-D) \cdot V_F \cdot I_D}$$

or using the resistive model:

$$P_{D,cond} = (1-D) \cdot I_D^2 \cdot R_{D,on}$$

Use the $V_F$ form when given the forward voltage directly. Use the $R_{D,on}$ form when given the diode on-resistance (common for SiC diodes).

$I_D \approx I_L$ (diode carries inductor current during the OFF interval).

### 3.2 Reverse Recovery Loss

$$P_{D,rr} = V_{in} \cdot Q_{rr} \cdot f_s$$

(Same as the additional MOSFET turn-on switching loss caused by $Q_{rr}$ — it's the same energy, counted once.)

---

## 4. Complete Loss Calculation Example

**Device: IRFI540NPbF (from NPTEL assignment)**

**Operating conditions:**
$V_{in} = 40\,V$, $V_o = 20\,V$, $f_s = 100\,kHz$, $I_L = 8\,A$

**Step 1 — Duty cycle:**
$$D = V_o/V_{in} = 20/40 = 0.5$$

**Step 2 — Switch current (≈ inductor current):**
$$I_{sw} \approx I_L = 8\,A$$

**Step 3 — Conduction loss:**

From datasheet at operating $T_j$: $R_{DS(on)} = 6\,m\Omega$

$$P_{cond} = 0.5 \times 8^2 \times 6\times10^{-3} = 0.5 \times 64 \times 0.006 = 0.192\,W$$

**Step 4 — Switching loss:**

From datasheet: $t_{on} = 84\,ns$, $t_{off} = 87\,ns$

$$P_{sw} = \frac{1}{2} \times 40 \times 8 \times (84+87)\times10^{-9} \times 10^5$$

$$= 0.5 \times 40 \times 8 \times 171\times10^{-4} = 2.736\,W$$

**Step 5 — Total MOSFET loss:**
$$P_{MOSFET} = 0.192 + 2.736 = 2.928\,W$$

> **Observation:** Switching loss ($2.736\,W$) dominates over conduction loss ($0.192\,W$) by $14\times$. This is typical at 100 kHz with a low $R_{DS(on)}$ device. The message: at high frequency, choose fast-switching devices; $R_{DS(on)}$ matters less.

---

## 5. Thermal Model — The Resistance Network Analogy

**Analogy:**

| Thermal domain | Electrical analogue |
|---------------|---------------------|
| Power dissipation $P$ (W) | Current $I$ (A) |
| Temperature $T$ (°C) | Voltage $V$ (V) |
| Thermal resistance $R_\theta$ (°C/W) | Resistance $R$ (Ω) |
| Thermal capacitance $C_\theta$ (J/°C) | Capacitance $C$ (F) |

**Thermal chain from junction to ambient (steady state):**

$$\boxed{T_j = T_a + P_d \cdot (R_{\theta jc} + R_{\theta cs} + R_{\theta sa})}$$

| Symbol | Name | Value from |
|--------|------|-----------|
| $T_j$ | Junction temperature | Result (must be ≤ $T_{j,max}$) |
| $T_a$ | Ambient temperature | Given in problem / environment |
| $P_d$ | Device power dissipation | Calculated above |
| $R_{\theta jc}$ | Junction-to-case | **Device datasheet** — fixed by device choice |
| $R_{\theta cs}$ | Case-to-heatsink | Thermal interface material (TIM) specification |
| $R_{\theta sa}$ | Heatsink-to-ambient | **Heatsink datasheet** — what you choose |

**The "crucial resistance for heatsink sizing" = $R_{\theta jc}$** — it is the unavoidable device limit. If $R_{\theta jc}$ is large, no heatsink can compensate.

---

## 6. Heatsink Selection — Step-by-Step

**Goal:** Find the maximum allowable $R_{\theta sa}$ and select a heatsink that meets or beats it.

### Derivation

Rearranging the thermal chain:

$$\boxed{R_{\theta sa} = \frac{T_{j,max} - T_a}{P_d} - R_{\theta jc} - R_{\theta cs}}$$

This is the **maximum** $R_{\theta sa}$ — select a heatsink with $R_{\theta sa} \leq$ this value.

### Complete Example (IRFI540NPbF)

**Given:** $P_d = 2.928\,W$ (from above), $T_{j,max} = 175°C$ (datasheet), $T_a = 60°C$, $R_{\theta jc} = 1.21\,°C/W$ (datasheet), $R_{\theta cs} = 0.5\,°C/W$ (thermal pad)

$$R_{\theta sa} = \frac{175 - 60}{2.928} - 1.21 - 0.5 = \frac{115}{2.928} - 1.71 = 39.27 - 1.71 = 37.6\,°C/W$$

**Select a heatsink with $R_{\theta sa} \leq 37.6\,°C/W$.**

---

## 7. Multiple Devices on One Heatsink

When several devices share one heatsink, the heatsink temperature rises due to the **sum of all dissipations**:

$$T_{hs} = T_a + \left(\sum_i P_{d,i}\right) \cdot R_{\theta sa}$$

Each device's junction temperature:

$$T_{j,i} = T_{hs} + P_{d,i} \cdot R_{\theta cs,i} + P_{d,i} \cdot R_{\theta jc,i}$$

**Implication:** Even a low-dissipation device on a shared heatsink may exceed its $T_{j,max}$ if the heatsink is driven hot by a high-dissipation device. Calculate $T_{j,i}$ for every device.

---

## 8. Cooling Method Comparison

| Method | $R_{\theta sa}$ range (typical) | Notes |
|--------|--------------------------------|-------|
| Natural convection (no fan) | 5–20 °C/W | Reliable, silent, no maintenance |
| Forced air (fan) | 1–10 °C/W | Fan speed, fin geometry determine improvement |
| Liquid cooling (water/oil) | &lt;1 °C/W | EV inverters, high-power industrial |
| Heat pipe | 0.1–1 °C/W | Passive but directional |

**How forced air lowers $R_{\theta sa}$:** Increases convective heat transfer coefficient $h$ → lower $R_{\theta conv} = 1/(hA)$.

**LFM and CFM:**
- LFM = Linear Feet per Minute (air velocity past heatsink)
- CFM = Cubic Feet per Minute (volumetric flow rate of air)

Both appear in heatsink datasheets. Higher LFM → lower $R_{\theta sa}$. Heatsink curves plot $R_{\theta sa}$ vs LFM.

**Primary factor for heatsink effectiveness:**
- Thermal conductivity of the sink material (aluminum: 200 W/m·K; copper: 400 W/m·K) — determines heat spreading
- Total surface area exposed to air — determines convective transfer
- Fin geometry (fin spacing, height) — affects airflow and area

> **Exam answer:** "What primarily determines heatsink effectiveness?" — Thermal conductivity AND surface area. Both together determine $R_{\theta sa}$.

---

## 9. Thermal Impedance — Transient Analysis

For **pulsed or repetitive** power dissipation, the junction temperature fluctuates with each pulse. The steady-state thermal resistance model is insufficient.

**Thermal impedance (time domain):**

$$\boxed{Z_{\theta jc}(t) = R_{\theta jc}\left[1 - e^{-t/\tau_{\theta}}\right]}$$

where $\tau_{\theta} = R_{\theta} \cdot C_{\theta}$ (thermal time constant; $C_\theta$ = thermal capacitance).

**Temperature rise for a power pulse of duration $t_p$:**

$$\Delta T(t_p) = P_d \cdot Z_{\theta jc}(t_p)$$

**Two limiting cases:**

| Condition | Regime | Temperature swing | Model to use |
|-----------|--------|------------------|-------------|
| $T_s \gg \tau_{jc}$ | DC / low frequency | Junction fully heats and cools each cycle | DC steady-state: $T_j = T_a + P_{avg}(R_{\theta jc}+R_{\theta cs}+R_{\theta sa})$ |
| $T_s \ll \tau_{jc}$ | High switching frequency | Junction temperature barely swings | Use $Z_{\theta jc}(T_s)$ — much lower than $R_{\theta jc}$ |

**Physical meaning of thermal capacitance $C_\theta$:** The thermal mass of the device package (die, package material). A large package has higher $C_\theta$ → longer thermal time constant → more "averaging" of pulse power → lower peak junction temperature.

---

## 10. Foster vs Cauer Thermal Network

Both are RC ladder models of the thermal path from junction to case.

| Model | Structure | Physical meaning |
|-------|-----------|-----------------|
| **Cauer** | Series resistors and shunt capacitors (ladder) | Each stage = a **real physical layer** (die, die attach, package material, case) |
| **Foster** | Parallel RC branches | Mathematical fit to transient thermal impedance curve — **NOT physically layered** |

**Why the distinction matters:**

In a **Cauer model**, the node between stage 1 and stage 2 corresponds to a real temperature (e.g., die attach temperature). You can tap this node to find intermediate temperatures in the stack.

In a **Foster model**, the intermediate nodes have no physical meaning. You **cannot insert an external thermal resistance** between two Foster stages and correctly compute intermediate temperatures. Foster is just a curve-fitting tool.

**Datasheet practice:**
- Both models appear on IGBT/MOSFET datasheets
- Cauer is preferred for simulation where you add the heatsink $R_{\theta sa}$ as another stage
- Foster is fine for black-box junction temperature calculation with no intermediate temperatures needed

---

## 11. Converter Efficiency — Full Calculation

**Efficiency:**

$$\eta = \frac{P_o}{P_{in}} = \frac{P_o}{P_o + P_{loss,total}}$$

$$P_{loss,total} = P_{MOSFET} + P_{diode} + P_{inductor,copper} + P_{inductor,core} + P_{gate}$$

**From loss to efficiency at a given operating point:**

1. Calculate each loss component as above
2. Sum all losses: $P_{loss}$
3. $\eta = P_o/(P_o + P_{loss})$

**Effect of frequency on efficiency:**

- Increasing $f_s$: switching loss ↑, core loss ↑ → $\eta$ ↓
- But smaller L, C, and faster transient response
- Optimum $f_s$ exists where the component size reduction benefit is worth the efficiency penalty

---

## 12. Thermal Runaway

**MOSFETs:** $R_{DS(on)}$ has a **positive temperature coefficient** — as $T_j$ rises, $R_{DS(on)}$ rises → conduction loss increases, but $T_j$ increase is bounded → self-limiting. Parallel MOSFETs naturally share current.

**IGBTs/BJTs:** $V_{CE(sat)}$ has a **negative temperature coefficient** (at typical operating currents) — as $T_j$ rises, $V_{CE(sat)}$ falls → device conducts more current → more power → $T_j$ rises further → **thermal runaway** is possible if not managed.

**Preventing thermal runaway in paralleled IGBTs:**
- Match devices (same lot, same datasheet characteristics)
- Individual gate resistors (prevent one device from switching faster and absorbing more energy)
- Common heatsink (equalises temperatures)
- Current balancing inductors in series

---

## Formula Sheet — Week 5

$$P_{cond} = D \cdot I_{sw}^2 \cdot R_{DS(on)}$$

$$P_{sw} = \frac{1}{2} V_{in} \cdot I_{sw} \cdot (t_{on} + t_{off}) \cdot f_s$$

$$P_{sw,IGBT} = (E_{on} + E_{off}) \cdot f_s$$

$$P_{D,cond} = (1-D) \cdot V_F \cdot I_D$$

$$P_{gate} = Q_g \cdot V_{GS} \cdot f_s$$

$$T_j = T_a + P_d(R_{\theta jc} + R_{\theta cs} + R_{\theta sa})$$

$$R_{\theta sa} = \frac{T_{j,max} - T_a}{P_d} - R_{\theta jc} - R_{\theta cs}$$

$$Z_{\theta jc}(t) = R_{\theta jc}\left[1 - e^{-t/\tau_{\theta}}\right], \quad \tau_{\theta} = R_{\theta jc} \cdot C_{\theta jc}$$

$$\Delta T(t_p) = P_d \cdot Z_{\theta jc}(t_p)$$

$$\eta = \frac{P_o}{P_o + P_{loss,total}}$$
