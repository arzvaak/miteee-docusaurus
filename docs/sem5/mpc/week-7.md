# Week 7 — Magnetics Design Examples + EMI

> **NPTEL: Design of Power Electronic Converters** | Prof. Shabari Nath, IIT Guwahati

---

## Part A — Complete Inductor Design Example

### Buck Converter Inductor — Worked Through All 8 Steps

**Given specifications:**
- $L = 100\,\mu H$, $I_L = 8\,A$ (average), $\Delta i_L = 0.625\,A$ (peak-to-peak ripple)
- $f_s = 100\,kHz$

**Design choices:**
- $B_m = 0.25\,T$, $J_m = 5\,A/mm^2 = 5 \times 10^6\,A/m^2$, $K_u = 0.4$
- Core material: Ferrite 3F3 (Ferroxcube) — low loss at 100 kHz

---

#### Step 1 — Peak Current

$$I_{L,pk} = I_L + \frac{\Delta i_L}{2} = 8 + \frac{0.625}{2} = 8.3125\,A$$

---

#### Step 2 — Stored Energy

$$W_m = \frac{1}{2} L I_{L,pk}^2 = \frac{1}{2} \times 100\times10^{-6} \times (8.3125)^2 = 3.453\,mJ$$

---

#### Step 3 — Area Product

$$A_p = \frac{L I_{L,pk}^2}{K_u B_m J_m} = \frac{100\times10^{-6} \times (8.3125)^2}{0.4 \times 0.25 \times 5\times10^6}$$

$$A_p = \frac{6.91\times10^{-3}}{0.5\times10^6} = 13.8\times10^{-9}\,m^4 = 13800\,mm^4$$

---

#### Step 4 — Core Selection

Looking up Ferroxcube catalog for EE cores with $A_p \geq 13800\,mm^4$:

**Selected core: EE 42×21×15**

| Parameter | Value |
|-----------|-------|
| $A_c$ | $178\,mm^2$ |
| $W_a$ | $178\,mm^2$ |
| MPL ($l_c$) | $97\,mm$ |
| MLT | $93\,mm$ |
| $A_t$ | $48.91\,cm^2$ |
| $\mu_{rc}$ | 2300 |
| $A_p = W_a A_c$ | $31684\,mm^4 \geq 13800\,mm^4$ ✓ |

---

#### Step 5 — RMS Current and Wire Selection

$$I_{L,rms} = \sqrt{I_L^2 + \frac{(\Delta i_L)^2}{12}} = \sqrt{8^2 + \frac{0.625^2}{12}} = \sqrt{64 + 0.0326} \approx 8.002\,A \approx 8\,A$$

The ripple contributes negligibly to RMS here (as expected when $\Delta i_L \ll I_L$).

Required wire cross-section:
$$A_w = \frac{I_{L,rms}}{J_m} = \frac{8}{5} = 1.6\,mm^2$$

From AWG table, **12 AWG** has $A_w = 3.31\,mm^2$ (next standard value above 1.6 mm²). Select 12 AWG.

> Why not use 1.6 mm² exactly? AWG sizes are discrete. You always round **up** to the next larger wire (lower AWG number = thicker wire).

---

#### Step 6 — Number of Turns

$$N = \frac{K_u \cdot W_a}{A_w} = \frac{0.4 \times 178}{3.31} = \frac{71.2}{3.31} = 21.5 \implies N = 21 \text{ turns (round down)}$$

---

#### Step 7 — Air Gap Length

$$l_g = \frac{\mu_0 A_c N^2}{L} - \frac{l_c}{\mu_{rc}}$$

$$= \frac{4\pi\times10^{-7} \times 178\times10^{-6} \times 21^2}{100\times10^{-6}} - \frac{97\times10^{-3}}{2300}$$

$$= \frac{4\pi\times10^{-7} \times 178\times10^{-6} \times 441}{10^{-4}} - 42.2\times10^{-6}$$

$$\approx 0.985\,mm - 0.042\,mm \approx 0.94\,mm \approx 1\,mm$$

---

#### Step 8 — Verification

**Peak flux density:**
$$B_{pk} = \frac{\mu_0 N I_{L,pk}}{l_g + l_c/\mu_{rc}} = \frac{4\pi\times10^{-7} \times 21 \times 8.3125}{1\times10^{-3} + 97\times10^{-3}/2300}$$

Denominator: $1\times10^{-3} + 42.2\times10^{-6} = 1.042\times10^{-3}$

$$B_{pk} = \frac{4\pi\times10^{-7} \times 21 \times 8.3125}{1.042\times10^{-3}} = \frac{2.19\times10^{-4}}{1.042\times10^{-3}} = 0.210\,T$$

$0.210\,T < 0.25\,T$ (our design limit) ✓ — no saturation.

**AC flux density (for core loss):**
$$B_m = \frac{\mu_0 N (\Delta i_L/2)}{l_g + l_c/\mu_{rc}} = \frac{4\pi\times10^{-7} \times 21 \times 0.3125}{1.042\times10^{-3}} = 7.92\,mT$$

**Core loss** (3F3 Steinmetz: $k = 5.983\times10^{-5}$, $m = 1.66$, $n = 2.68$; $f$ in Hz, $B_m$ in T):
$$P_v = 5.983\times10^{-5} \times (10^5)^{1.66} \times (7.92\times10^{-3})^{2.68}$$

$$P_c = P_v \times A_c \times l_c \approx \text{negligible} \quad (\ll 1\,W)$$

**Copper loss:**

$R_{DC/length}$ for 12 AWG copper ≈ 5.208 mΩ/m

$$R_L = \text{MLT} \times N \times R_{DC/length} = 93\times10^{-3} \times 21 \times 5.208\times10^{-3} = 0.01017\,\Omega$$

$$P_{winding} = I_{L,rms}^2 \cdot R_L = 8^2 \times 0.0102 = 0.653\,W$$

**Temperature rise:**
$$\psi = \frac{P_{core} + P_{winding}}{A_t} \approx \frac{0 + 0.653}{48.91} = 0.01335\,W/cm^2$$

$$\Delta T = 450 \times (0.01335)^{0.826} = 450 \times 0.0282 = 12.7°C$$

Assuming $\Delta T_{max} = 40°C$: $12.7°C \ll 40°C$ ✓ — well within limits.

**Final design:** 21 turns of 12 AWG on EE 42×21×15 ferrite core, 1 mm air gap.

---

## Part B — Transformer Design Summary

For a transformer (forward or full-bridge converter), the procedure is similar but with key differences:

| Step | Inductor | Transformer |
|------|----------|-------------|
| Area product | $A_p = \frac{L I_{pk}^2}{K_u B_m J_m}$ | $A_p = \frac{P_o}{K_u K_f B_m J_m f_s}$ |
| Air gap | Required (stores energy) | **None** (energy should not be stored) |
| Winding | Single winding | Primary + secondary (both must fit in $W_a$) |
| Turns from | $L$ and gap formula | Faraday's law (volt-second balance) |
| Current in wire | Inductor RMS | Transformer side RMS |

**Primary turns from Faraday's law (square wave):**

$$N_1 = \frac{V_1}{4 f_s B_m A_c}$$

**Secondary turns from turns ratio:**

$$N_2 = N_1 \cdot \frac{V_2}{V_1}$$

**Window split:** If primary fraction is $\alpha_1 = N_1 I_{1,rms} / (N_1 I_{1,rms} + N_2 I_{2,rms})$, allocate proportionally.

For equal loss in primary and secondary: $\alpha_1 = 0.5$ (each winding gets half the window).

---

## Part C — EMI in Power Electronics

### C.1 What Is EMI?

**Electromagnetic Interference (EMI):** Unwanted electrical noise generated by the converter's switching action that:
- Flows back into the supply grid via power cables (**conducted EMI**)
- Radiates as electromagnetic waves from wires and PCB traces (**radiated EMI**)

**Why power converters generate EMI:** Every switching transition (MOSFET turning ON/OFF) creates fast $dI/dt$ and $dV/dt$ transitions — these are rich in harmonic content extending to hundreds of MHz.

**Regulatory standards:**

| Standard | Region | Frequency range | What it limits |
|----------|--------|-----------------|---------------|
| CISPR 22 / EN 55022 | International/Europe | 150 kHz–30 MHz (conducted) | Conducted EMI at power port |
| FCC Part 15 | USA | 150 kHz–30 MHz (conducted) | Same |
| CISPR 22 (radiated) | — | 30 MHz–1 GHz | Radiated EMI |

> **Exam key:** Conducted EMI is measured from **150 kHz to 30 MHz**. Below 150 kHz is generally not regulated. Above 30 MHz transitions to radiated EMI measurement.

---

### C.2 LISN — Line Impedance Stabilization Network

**Problem:** The impedance of the mains supply varies widely — you can't measure EMI in a reproducible way without a standardized source impedance.

**LISN solution:**
- Presents a standardized **50 Ω** impedance to the device under test (DUT) at EMI frequencies (150 kHz–30 MHz)
- Blocks mains supply noise from contaminating the EMI measurement
- Couples the conducted EMI noise to the spectrum analyzer (measurement receiver)

**LISN circuit:** Series inductors (block mains noise from reaching measurement port) + shunt capacitors (provide 50 Ω path at EMI frequencies).

```
Mains ─ [Inductor] ─┬─ DUT
                    ├─ [50 Ω to measurement receiver]
                    └─ [Cap to GND]
```

The spectrum analyzer measures the voltage across the 50 Ω resistor.

---

### C.3 Common Mode (CM) and Differential Mode (DM) Noise

Any conducted EMI signal on a two-wire power line can be decomposed into exactly two orthogonal components:

$$V_{DM} = \frac{V_{Line} - V_{Neutral}}{2} \qquad V_{CM} = \frac{V_{Line} + V_{Neutral}}{2}$$

| Property | Differential Mode (DM) | Common Mode (CM) |
|----------|----------------------|-----------------|
| Current direction | Opposite in Line and Neutral | Same direction in both conductors |
| Return path | Neutral conductor | Earth/ground conductor |
| Primary source in SMPS | Pulsed input current (inductor ripple, rectifier current) | $dV/dt$ at switching node via parasitic capacitance to chassis |
| Typical frequency range | Lower (kHz range) | Higher (hundreds of kHz to MHz) |
| Filter component | $C_X$ capacitor (L to N), DM choke | $C_Y$ capacitor (L to GND), CM choke |

**Why CM noise returns through ground:**

$$i_{CM} = C_{para} \cdot \frac{dV_{switch}}{dt}$$

The switching node (drain of MOSFET in a buck) swings between 0 and $V_{in}$ at every switching event. Any capacitance between the switching node and the chassis (through heatsink, PCB ground plane, or transformer interwinding capacitance) drives a current into the ground. This current flows back via the earth conductor — it is common mode noise.

**To reduce CM noise:** Slow down switching transitions (larger $R_g$) → reduce $dV/dt$ → reduce $i_{CM}$. Trade-off: slower switching → higher switching loss.

---

### C.4 EMI Filter Design

The EMI filter sits at the power input of the converter, between the LISN (or mains) and the converter.

**Standard EMI filter structure (Pi-filter):**

```
Line ─ [L_DM] ─┬─────────────────────────── Line out
               │
              [C_X]  [CM Choke]  [C_X]
               │
Neutral ───────┴─────────────────────────── Neutral out
    │                                              │
   [C_Y]                                         [C_Y]
    │                                              │
   GND ─────────────────────────────────────────GND
```

**Component functions:**

| Component | Type | Purpose |
|-----------|------|---------|
| $C_X$ | Line-to-Neutral capacitor | Attenuates DM noise; provides low-impedance path for DM currents |
| $C_Y$ | Line/Neutral-to-Ground capacitor | Attenuates CM noise; diverts CM currents to ground before they reach the LISN |
| **CM choke** | Bifilar wound inductor | High impedance for CM currents (both directions same → fluxes add); transparent to DM (fluxes cancel) |

**$C_X$ vs $C_Y$ safety ratings:**

| Type | Capacitance | Voltage rating | Safety limit |
|------|-------------|---------------|-------------|
| $C_X$ | 0.1–10 μF | Full AC line voltage | No leakage current limit (current returns via Neutral) |
| $C_Y$ | 1–4.7 nF | Full AC line voltage | **Strictly limited** — leakage to earth ≤ 3.5 mA (safety regulation; electric shock risk) |

> **Exam trap:** $C_Y$ capacitors are limited to a very small value (nF range) because the current through them flows directly to the earth conductor — if a person touches the chassis and the earth conductor is broken, this current flows through the person. Hence safety standards limit it strictly.

**CM choke operation:**

- Both wires wound on same core in same direction
- DM current: flows opposite in the two wires → fluxes **cancel** → no inductance presented to DM current
- CM current: flows same direction in both wires → fluxes **add** → high inductance → high impedance to CM

This means the CM choke provides high impedance to CM noise without impeding DM (load) current — this is the key advantage.

---

### C.5 EMI Filter Design Procedure

1. Measure conducted EMI at 150 kHz (worst-case, start of band) on an unfiltered converter
2. Read the regulatory limit at 150 kHz from the applicable standard (e.g., CISPR Class B)
3. Calculate required attenuation = measured level − limit (in dB)
4. Choose filter order and calculate corner frequency:
   - Each LC stage provides 40 dB/decade attenuation above corner frequency
   - Single-stage LC at corner frequency $f_c$: attenuation at $f_{EMI}$ is $40\log_{10}(f_{EMI}/f_c)$ dB
5. Select $C_X$, $C_Y$, CM choke to achieve required attenuation
6. Verify with post-filter measurement

**Corner frequency for single-stage LC filter:**

$$f_c = \frac{1}{2\pi\sqrt{LC}}$$

---

### C.6 Interaction: Gate Resistance and EMI

Increasing gate resistance $R_g$ slows switching:
- **Pro:** Lower $dV/dt$ → less CM noise; lower $dI/dt$ → less DM noise and ringing
- **Con:** Longer switching time → more switching loss $P_{sw} = \frac{1}{2}V I (t_{on}+t_{off}) f_s$

> There is a fundamental trade-off: you cannot simultaneously minimize switching loss and minimize EMI.

---

## Formula Sheet — Week 7

**Inductor design (complete sequence):**

$$I_{L,pk} = I_L + \frac{\Delta i_L}{2}$$

$$A_p = \frac{L I_{L,pk}^2}{K_u B_m J_m}$$

$$I_{L,rms} = \sqrt{I_L^2 + \frac{(\Delta i_L)^2}{12}}, \qquad A_w = \frac{I_{L,rms}}{J_m}$$

$$N = \frac{K_u W_a}{A_w}, \qquad l_g = \frac{\mu_0 A_c N^2}{L} - \frac{l_c}{\mu_{rc}}$$

$$\Delta T = 450\,\psi^{0.826}, \qquad \psi = \frac{P_{core} + P_{winding}}{A_t}$$

**Transformer:**

$$N_1 = \frac{V_1}{4 f_s B_m A_c} \quad \text{(square wave)}$$

**EMI:**

$$i_{CM} = C_{para} \cdot \frac{dV_{switch}}{dt}$$

$$V_{DM} = \frac{V_L - V_N}{2}, \qquad V_{CM} = \frac{V_L + V_N}{2}$$
