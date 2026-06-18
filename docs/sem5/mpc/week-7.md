# Week 7 — EMI in Power Electronic Converters

---

## 1. EMI Fundamentals

### Types of EMI

| Type | Propagation | Frequency range | Measured in | Measured using |
|---|---|---|---|---|
| Conducted EMI | Through power lines/cables | 150 kHz – 30 MHz | dBµV | LISN |
| Radiated EMI | Through space (electromagnetic waves) | 30 MHz – 1 GHz | dBµV/m | Antenna |

> **FIB/MCQ**: Conducted = dBµV, Radiated = dBµV/m. LISN is for **conducted** EMI, antenna for **radiated**.

### dBµV Conversion
```
VdBµV = 20 · log10(VµV)          [linear → dB]
VµV    = 10^(VdBµV / 20)         [dB → linear]
```
where `VµV` = voltage in microvolts.

| Linear (µV) | dBµV |
|---|---|
| 1 µV | 0 dBµV |
| 10 µV | 20 dBµV |
| 100 µV | 40 dBµV |
| 316 µV | ≈ 50 dBµV |
| 1000 µV | 60 dBµV |
| 10,000 µV | 80 dBµV |

> Each 10× in voltage = +20 dB. Each 100× = +40 dB.

### Insertion Loss
```
IL (dB) = 20 · log10(V_without_filter / V_with_filter)
```
- Higher IL = more attenuation = better filter
- Unit is **dB** (not dBµV)
- To find filtered noise: `Noise_filtered (dBµV) = Noise_unfiltered (dBµV) − IL (dB)`

---

## 2. Common Mode (CM) vs Differential Mode (DM) Noise

### Definitions
From line voltages v1, v2 (line-to-ground):
```
Vcm = (v1 + v2) / 2      [Common mode — same on both lines]
Vdm = v1 − v2            [Differential mode — between lines]
```

For currents:
```
Icm = i1 + i2    [CM: flow in same direction, return via earth]
Idm = (i1 − i2) / 2
```

### Sources
- **CM noise**: **parasitic capacitances** → fast dv/dt at switch node → displacement current flows to chassis via stray C (drain/collector-to-heatsink-to-chassis ground)
- **DM noise**: switched current (di/dt) → voltage drop on parasitic inductances

> **MCQ**: Main source of CM noise = **parasitic capacitance** (not wire resistance, not power level, not cable length)

### X and Y Capacitors
- **X capacitors**: connected **line-to-line** → filter **DM** noise; rated for full line-to-line voltage (e.g., 275 V AC)
- **Y capacitors**: connected **line-to-earth** → filter **CM** noise; **lower voltage rating** (e.g., 250 V AC max) — safety-critical (leakage current to earth is regulated by IEC/UL standards)

> **MCQ trap**: Y-caps have a LOWER voltage rating than X-caps — connecting a standard X-cap in the Y position is a safety violation.

---

## 3. LISN (Line Impedance Stabilisation Network)

- Standardises impedance presented to Equipment Under Test (EUT) at RF frequencies
- Isolates the EUT from the mains at RF frequencies
- Allows reproducible conducted EMI measurements
- Connected to **chassis/earth ground** for CM filter reference

### LISN Internal Structure (CISPR 16 / per line)
- **50 µH** inductor in series with mains → blocks mains RF from polluting measurement
- **5 Ω** resistor + 50 Ω measurement port in parallel → defines the 50 Ω standard impedance seen by EUT at RF

> **FIB/MCQ**: LISN contains a **50 µH** inductor. The standard measurement impedance is **50 Ω**.

---

## 4. EMI Filter Topologies — Impedance Mismatch Principle

**Rule**: The filter element should present impedance **opposite** to the source/load for maximum attenuation.
- High Z source/load → shunt capacitor (low Z path to ground)
- Low Z source/load → series inductor (high Z in series)

### Filter Topologies

| Topology | Structure | Use when |
|---|---|---|
| LC filter | Series L → Shunt C | Source Z is LOW, Load Z is HIGH |
| CL filter | Shunt C → Series L | Source Z is HIGH, Load Z is LOW |
| T filter | L–C–L | Both source AND load Z are **LOW** |
| Pi filter (π) | C–L–C | Both source AND load Z are **HIGH** |

> **Memory aid**:
> - T filter = two inductors (high Z in series) → blocks low-Z source and load
> - Pi (π) filter = two capacitors (low Z to ground) → shunts high-Z source and load

> **MCQ exact wording**: "CL filter is preferred when source has high and load has low impedance" ← TRUE

---

## 5. Common Mode Choke

- Both conductors wound on the **same core**
- CM currents (same direction) → fluxes **add** → high inductance → high impedance → attenuates CM noise
- DM currents (opposite directions) → fluxes **cancel** → near-zero inductance → does NOT impede DM
- **True**: CM choke reduces CM current; does NOT reduce DM current
- In practice, imperfectly matched winding turns → small residual DM inductance (~1–2% of CM inductance) → slight DM attenuation as a side effect (but not relied upon for design)

---

## 6. EMI Reduction Techniques

### Effective methods:
- **Soft switching** (ZVS/ZCS): eliminates rapid dv/dt and di/dt → reduces EMI at source
- **Shielded cables**: confine EM fields, prevent radiation
- **Proper PCB layout**: minimize high di/dt loop area → less radiated EMI, less L·di/dt spikes
- **Increasing gate resistance Rg**: slows switching → less high-frequency content → less EMI (but more switching loss)
- **Snubbers**: damp parasitic oscillations (an EMI source)
- **Random/spread-spectrum PWM**: spreads harmonic energy over wider bandwidth → lower peak emissions

### NOT effective / counterproductive:
- Removing filters → increases EMI
- Increasing switching frequency → does NOT reduce EMI (may shift/increase it)
- Hard switching → generates MORE EMI

### Parasitic Voltage Spike from Loop Inductance
```
V = Lp · (di/dt)
```
e.g. Lp = 20 nH, di/dt = 50 A/µs → V = 20e-9 × 50e6 = 1.0 V spike

---

## 7. Numeric Problem Approach

### dBµV Conversion
1. `VdBµV = 20·log10(VµV)`
2. e.g. 316 µV: `20·log10(316) = 20×2.5 = 50 dBµV`

### Insertion Loss
1. `IL_ratio = 10^(IL_dB/20)` → noise reduced by this factor
2. e.g. IL = 40 dB → ratio = 100 → noise reduced to 1/100
3. `Filtered noise = 80 dBµV − 40 dB = 40 dBµV`

### Filter Topology Selection
1. Identify source impedance (high or low)
2. Identify load impedance (high or low)
3. Apply: both low → T; both high → Pi; high source/low load → CL; low source/high load → LC

---

## 8. MCQ/MSQ Quick Reference

- Conducted EMI: 150 kHz – 30 MHz; Radiated EMI: 30 MHz – 1 GHz
- LISN → conducted EMI; Antenna → radiated EMI
- dBµV = `20·log10(µV)`; unit for radiated = dBµV/m
- X cap → DM noise; Y cap → CM noise (Y connects to earth)
- CM choke: attenuates CM, does NOT attenuate DM
- IL unit = **dB** (not dBµV)
- T filter: source AND load both LOW Z
- Pi filter: source AND load both HIGH Z
- CL: source HIGH, load LOW (C first, then L)
- LC: source LOW, load HIGH (L first, then C)
- Increasing Rg → slower switching → less EMI but more switching loss
- Soft switching most effective at reducing high-frequency radiated EMI
- Main reasons for EMI: parasitic capacitances, switched voltage, switched current (NOT just "high power")
- Spread spectrum PWM reduces peak spectral content (doesn't reduce total energy, just spreads it)

---

## 9. FIB Quick Answers

- Conducted EMI range: **150 kHz – 30 MHz**
- Radiated EMI range: **30 MHz – 1 GHz**
- `Vcm = (v1+v2)/2`; `Vdm = v1−v2`
- `VdBµV = 20·log10(VµV)`; inverse: `VµV = 10^(VdBµV/20)`
- IL unit: **dB**
- CM choke: high impedance to **CM** currents, low to **DM**
- T filter: both source and load **low** impedance
- Pi filter: both source and load **high** impedance
- X capacitors filter **differential** mode; Y capacitors filter **common** mode
- Impedance mismatch principle: filter element impedance should be **opposite** to source/load
