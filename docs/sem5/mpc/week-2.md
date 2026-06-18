# Week 2 — Power Semiconductors

---

## 1. Device Comparison

| Device | Control type | Key advantage | Key disadvantage |
|---|---|---|---|
| BJT | Current (base current) | Low VCEsat at high current | Complex drive, slow, second breakdown |
| MOSFET | Voltage (gate voltage) | Fast switching, easy drive, +ve Tc on RDS(on) | High RDS(on) at high voltage |
| IGBT | Voltage (gate voltage) | Low VCEsat at high voltage (>600V) | Tail current at turn-off (slower) |
| Thyristor/SCR | Current (gate pulse) | High power, latching | Cannot turn off via gate |

### Device Selection Rules
- **< 200 V, high frequency** → MOSFET (low RDS(on), fast)
- **> 600 V, moderate frequency (< 50 kHz)** → IGBT (low conduction loss)
- **600 V, 50 A, 20 kHz inverter** → IGBT
- IGBT conducts reverse current only through **external antiparallel diode** (no body diode by default)
- MOSFET has inherent body diode (can conduct reverse current)

### Current & Voltage Control
- MOSFET: voltage-controlled
- IGBT: voltage-controlled
- BJT: current-controlled
- SCR: current-controlled (gate pulse)

> **MCQ trap**: MOSFET and IGBT are unipolar voltage devices (block only forward voltage). MOSFET body diode allows bidirectional current.

---

## 2. Diode Types (Switching Speed — slowest to fastest)

Standard rectifier → Fast recovery diode → Schottky diode

- **Softness factor** `S = tb/ta`: `S > 1` = soft recovery (low di/dt, less EMI); `S < 1` = hard/abrupt
- Schottky: majority-carrier only, no minority carrier storage → near-zero Qrr

---

## 3. MOSFET Loss Mechanisms

### Loss Formulas

| Loss | Formula | Notes |
|---|---|---|
| Conduction loss | `Pcond = Isw,rms² · RDS(on)` | `= D · IL² · RDS(on)` for Buck |
| Switching loss | `Psw = ½ · Vsw · ID · (ton + toff) · fs` | Linear in fs |
| Gate drive loss | `Pgd = Qg · VGS · fs` | Dissipated in gate resistors |
| Reverse recovery loss | `Prr = ½ · Qrr · VR · fs` | Body diode only |
| Total | `PD = Pcond + Psw + Pgd + Prr` | |

> **FIB**: Conduction loss uses `Isw,rms²` (not average current). Gate drive loss uses `Qg · VGS · fs`.

### Temperature Effects on RDS(on)
- RDS(on) has **positive temperature coefficient** (increases with temperature)
- Benefit: natural current sharing in parallel MOSFETs (hotter device → higher RDS(on) → takes less current → self-balancing)
- Derating: `RDS(on)(TJ) ≈ RDS(on)(25°C) × (TJ/298)^2.3`

| TJ | Multiplier (approx) |
|---|---|
| 25°C (298 K) | 1.00× (baseline) |
| 50°C (323 K) | 1.19× |
| 100°C (373 K) | 1.61× |
| 125°C (398 K) | **1.94×** (~2×) |
| 150°C (423 K) | 2.33× |

> **MCQ trap**: At 125°C RDS(on) is roughly **double** the 25°C value, not 1.5×.

### Junction Temperature
```
Tj = Tc + PD · Rθjc
Tj = Ta + PD · (Rθjc + Rθcs + Rθsa)
```

### dv/dt Parasitic Turn-on
- High dv/dt at drain → displacement current through CGD → may raise VGS above threshold → parasitic turn-on
- Limit: device has max rated dv/dt (e.g., IRFB7545PbF: 12 V/ns)

---

## 4. IRFB7545PbF Datasheet Reference

| Parameter | Value |
|---|---|
| VDS(max) | 75 V |
| ID (TC=25°C) | 75 A |
| ID (TC=100°C) | 67 A |
| RDS(on) typ (VGS=10V, ID=75A) | 3.3 mΩ (typ), 5.9 mΩ (max) |
| Qg(typ) at VGS=10V | 85 nC |
| ton = td(on) + tr | 12 + 72 = 84 ns |
| toff = td(off) + tf | datasheet value |
| Body diode trr | 120 ns (25°C), 37 ns (125°C) |
| Body diode Qrr | 340 nC (25°C), 36 nC (125°C) |
| Tjmax | 175°C |
| Rθjc | 0.67 °C/W (some questions use 1.21 °C/W) |
| Rθcs | 0.50 °C/W |
| VGS(th) | 2.1 V (min) – 3.7 V (max) |
| Max dv/dt | 12 V/ns |

> Irr from triangular approximation: `Irr = 2·Qrr/trr`

---

## 5. Numeric Problem Approach

### Conduction Loss
1. `Isw,rms = √D · IL` (Buck converter)
2. `Pcond = Isw,rms² · RDS(on)`

### Switching Loss
1. `Psw = 0.5 · Vin · IL · (ton + toff) · fs`

### Gate Drive Power
1. `Pgd = Qg · VGS · fs`

### Reverse Recovery Loss
1. `Prr = 0.5 · Qrr · VR · fs`

### Junction Temperature
1. `Tj = Tc + PD · Rθjc` or `Tj = Ta + PD · (Rθjc + Rθcs + Rθsa)`

### Peak Reverse Recovery Current
1. `Irr = 2·Qrr/trr` (triangular waveform assumption)

---

## 6. MCQ/MSQ Quick Reference

- MOSFET: majority carrier → positive Tc on RDS(on) → self-protecting in parallel
- IGBT preferred when V > 600 V (lower conduction loss than MOSFET at high voltage)
- BJT: current-controlled, requires large base drive, second breakdown possible
- Schottky: fastest, no minority carrier storage, only low-voltage (< ~200 V)
- `Pgd` is NOT dissipated in the MOSFET channel — it's dissipated in gate resistors and driver
- SOA (Safe Operating Area): VDS vs ID plot showing safe operating boundaries
- RDS(on) doubles approximately from 25°C → 125°C
- Thermal runaway risk: leakage current `IDSS` **approximately doubles every 10°C** → exponential positive feedback → runaway possible if heat is not removed
