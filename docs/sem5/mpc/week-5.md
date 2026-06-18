# Week 5 — Thermal Design & MOSFET Losses

---

## 1. MOSFET Loss Model (Buck Converter)

### Loss Formulas

| Loss | Formula |
|---|---|
| MOSFET RMS current | `Isw,rms = √D · IL` |
| Conduction loss | `Pcond = Isw,rms² · RDS(on) = D · IL² · RDS(on)` |
| Switching loss | `Psw = ½ · Vin · IL · (ton + toff) · fs` |
| Total | `PD = Pcond + Psw` |

> **FIB**: `Pcond = D · IL² · RDS(on)` (not `Isw,avg`)
> **Switching loss is linear in fs** — doubling fs doubles Psw.

### Freewheeling Diode Loss
- Conduction for fraction `(1-D)` per cycle
- `Pd,cond = (1-D) · IL² · Rd` (where Rd = diode forward resistance)

---

## 2. Thermal Circuit Model

```
Tj = Ta + PD · (Rθjc + Rθcs + Rθsa)
```

Series thermal resistances (like series electrical resistors):
- `Rθjc`: junction-to-case (from datasheet — fixed by package)
- `Rθcs`: case-to-heatsink (contact resistance — depends on TIM and mounting)
- `Rθsa`: heatsink-to-ambient (determined by heatsink + airflow)

### Maximum Heatsink Thermal Resistance
```
Rθsa,max = (Tjmax − Ta) / PD − (Rθjc + Rθcs)
```

### Junction Temperature Check
```
Tj = Ta + PD · (Rθjc + Rθcs + Rθsa)
Tj must be ≤ Tjmax
```

---

## 3. IRF250PBF — Exam Device for Week 5

| Parameter | Value | Notes |
|---|---|---|
| VDS | 200 V | |
| RDS(on) max | **85 mΩ** | at VGS=10V, ID=18A |
| td(on) | 16 ns | |
| tr | 86 ns | |
| **ton = td(on)+tr** | **102 ns** | |
| td(off) | 70 ns | |
| tf | 62 ns | |
| **toff = td(off)+tf** | **132 ns** | |
| Rθjc max | **0.65 °C/W** | |
| Rθcs typ | **0.24 °C/W** | |
| **Tjmax** | **150°C** | (not 175!) |
| VGS(th) | 2.0–4.0 V | |
| Test Rg (mfr) | 6.2 Ω | used to measure ton/toff |

### Worked Example (Exam Problem)
**Given**: Vin=35V, Vout=21V, fs=50kHz, IL=6A, Ta=55°C

1. `D = Vout/Vin = 21/35 = 0.6`
2. `Pcond = D × IL² × RDS(on) = 0.6 × 36 × 0.085 = 1.84 W`
3. `Psw = 0.5 × 35 × 6 × (102+132)×10⁻⁹ × 50×10³ = 1.23 W`
4. `PD = 1.84 + 1.23 = 3.07 W`
5. `Rθsa,max = (150−55)/3.07 − (0.65+0.24) = 30.94 − 0.89 = 30.05 °C/W`

### Heatsink Selection (MCQ format — know these)
| Part No. | Rθsa | Suitable? |
|---|---|---|
| ICK SMD A 10 SA | 75 °C/W | ✗ too high |
| 217-36CTE6 | 55 °C/W | ✗ too high |
| ICK 14/16 L | 46 °C/W | ✗ too high |
| **FK 243 MI 247 O** | **18.7 °C/W** | **✓ select this** |

With fan (217-36CTE6 at 200 LFM → Rθsa=16°C/W):
`Tj = 3.07 × (0.65 + 0.24 + 16) + 55 = 106.85°C` ✓

---

## 4. RDS(on) Temperature Derating

```
RDS(on)(TJ) = RDS(on)(25°C) × (TJ/298)^2.3
```
- At TJ = 125°C (= 398 K): ratio = (398/298)^2.3 ≈ 1.944 → nearly double
- Must use derated RDS(on) for accurate thermal budget

### Derated Conduction Loss
```
Pcond,hot = D · IL² · RDS(on,hot)
```

---

## 5. Effect of Switching Frequency on Losses

| fs | Pcond | Psw | PD |
|---|---|---|---|
| 50 kHz | Same | Half | Lower |
| 100 kHz | Same | Baseline | Baseline |
| 200 kHz | Same | Double | Higher |
| 250 kHz | Same | 2.5× | Higher |

> **Key**: Pcond is independent of fs. Psw scales **linearly** with fs.
> At higher fs: need better heatsink (or smaller L can be used — design trade-off)

---

## 6. Transient Thermal Impedance

- `Zθjc(tp, D)` used for **pulsed operation** (short pulses)
- For pulse duration << thermal time constant, junction temp rise < `PD · Rθjc`
- Look up from datasheet transient thermal impedance graph using pulse width `tp` and duty cycle `D`

---

## 7. Heatsink Selection

- Choose heatsink with `Rθsa ≤ Rθsa,max`
- **Natural convection**: typical Rθsa = 10–40 °C/W (depends on size)
- **Forced air (fan)**: reduces Rθsa significantly (e.g., 18.7 → 16 °C/W in example)
- Heatsink Rθsa determined by: fin area/count, material (Al ≈ 200 W/m·K), airflow

---

## 8. Thermal Runaway

- Occurs if increasing temperature causes increasing loss → positive feedback
- MOSFET: RDS(on) increases → Pcond increases → higher Tj → more RDS(on) increase
- More dangerous: leakage current `IDSS` approximately doubles every 10°C → can cause runaway

---

## 9. Numeric Problem Approach

### Step-by-step thermal design
1. Compute `Isw,rms = √D · IL`
2. Compute `Pcond = D · IL² · RDS(on)`
3. Compute `Psw = 0.5 · Vin · IL · (ton + toff) · fs`
4. `PD = Pcond + Psw`
5. `Rθsa,max = (Tjmax − Ta)/PD − (Rθjc + Rθcs)`
6. Select heatsink with `Rθsa < Rθsa,max`
7. Verify: `Tj = Ta + PD·(Rθjc + Rθcs + Rθsa,selected) ≤ Tjmax`

### Frequency scaling
- `Psw,new = Psw,ref × (fs,new / fs,ref)`
- `PD,new = Pcond + Psw,new`

---

## 10. MCQ/MSQ Quick Reference

- `Pcond = D·IL²·RDS(on)` → proportional to D and IL²
- `Psw` linear in fs → doubling fs doubles Psw
- Higher Rθsa → higher Tj (worse heatsink → hotter junction)
- Transient thermal impedance used for **pulsed operation** (short pulses)
- Forced air reduces Rθsa → lower Tj
- Parallel thermal paths (through leads, PCB): Rθja,leads ≈ 50–100 °C/W → much higher than main path → negligible contribution
- Heatsink selection: need `Rθsa ≤ Rθsa,max`

---

## 11. FIB Quick Answers

- `Pcond = D · IL² · RDS(on)` = `Isw,rms² · RDS(on)`
- `Psw = ½ · Vin · IL · (ton + toff) · fs`
- `Rθsa,max = (Tjmax − Ta)/PD − (Rθjc + Rθcs)`
- `Tj = Ta + PD · (Rθjc + Rθcs + Rθsa)`
- IRF530NPbF: RDS(on) = **90 mΩ**, ton = **96 ns**, toff = **60 ns**, Tjmax = **175°C**, Rθjc = **2.15 °C/W**
- At fs = 250 kHz (from 100 kHz): `Psw,new = Psw,100k × 2.5`
