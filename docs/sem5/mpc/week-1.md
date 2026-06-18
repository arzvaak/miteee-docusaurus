# Week 1 — Buck Converter & H-Bridge Motor Drive

---

## 1. Buck Converter (CCM)

### Key Facts
- **Volt-second balance**: average inductor voltage = 0 in steady state → `(Vin − Vout)·D + (−Vout)·(1−D) = 0`
- **Charge balance**: average capacitor current = 0 in steady state
- Output voltage: `Vout = D · Vin`
- Inductor is in **series** with the output → `IL,avg = Iout`
- Higher `fs` → smaller ripple (for fixed L)

### Key Formulas

| Quantity | Formula |
|---|---|
| Output voltage | `Vout = D · Vin` |
| Inductor current ripple | `ΔiL = Vout·(1−D) / (L·fs)` = `Vin·D·(1−D) / (L·fs)` |
| Critical inductance (CCM/DCM boundary) | `Lcrit = Vout·(1−D) / (2·Iout·fs)` |
| Switch (MOSFET) RMS current | `Isw,rms = √D · IL` |
| Diode RMS current | `Id,rms = √(1−D) · IL` |
| RMS of triangular ripple component | `ΔiL,rms = ΔiL / (2√3)` |
| Output capacitor voltage ripple | `ΔVc = ΔiL / (8·C·fs)` |
| Minimum output capacitance | `Cmin = ΔiL / (8·ΔVc·fs)` |

> **MCQ trap**: `ΔiL = Vout·(1−D)/(L·fs)` and `ΔiL = Vin·D/(L·fs)` are equivalent (since `Vout = D·Vin`) but the first form comes from the off-interval.

### Numeric Problem Approach
1. Find `Vout = D·Vin`
2. Find `ΔiL = Vout·(1−D)/(L·fs)`
3. For critical L: set `ΔiL = 2·Iout` → solve for `Lcrit`
4. `Isw,rms = √D · IL`
5. Output capacitor ripple: `ΔVc = ΔiL/(8·C·fs)` → rearrange for C: `C = ΔiL/(8·ΔVc·fs)`

---

## 2. H-Bridge DC Motor Drive

### Two PWM Strategies

| | Unipolar PWM | Bipolar PWM |
|---|---|---|
| Output levels | +Vd, 0, −Vd | +Vd and −Vd only |
| Effective ripple frequency | **2fs** (phase-shifted legs) | fs |
| Ripple magnitude | Lower (dominant harmonic at 2fs) | Higher |
| VL during freewheel | −ea | −(Vd + ea) |

> **Key**: Unipolar has **less ripple** for same L, fs because of the 2fs effect.

### Duty Ratio

Both PWM types use the same formula:
```
dTA+ = (1 + ea/Vd) / 2
```
- Unipolar complementary switch: `dTA− = 1 − dTA+`

> Derivation comes from volt-second balance on the load inductor (no need to memorise, just apply).

### Key Formulas — Unipolar PWM

| Quantity | Formula |
|---|---|
| Duty ratio | `dTA+ = (1 + ea/Vd) / 2` |
| VL during storage (TA+, TB− on) | `VL,max = Vd − ea − Io·R` |
| VL during freewheel | `VL,min = −(ea + Io·R)` |
| Energy storage time | `dt = (1 − dTA+) · Ts` |
| Required inductance | `L = VL,max · dt / ΔiL` |
| Switch peak blocking voltage | `Vd` |

> When R = 0 (ideal): `VL,max = Vd − ea`, `VL,min = −ea`

### Key Formulas — Bipolar PWM

| Quantity | Formula |
|---|---|
| Duty ratio | `d = (1 + ea/Vd) / 2` |
| VL,max (TA+, TB− on) | `Vd − ea` |
| VL,min (TA−, TB+ on) | `−(Vd + ea)` ← wider swing than unipolar |

### Numeric Problem Approach
1. Compute `dTA+` from formula
2. Compute `Ts = 1/fs`
3. For Unipolar: `ton = dTA+ · Ts`; `dt = (1 − dTA+) · Ts`
4. Find `VL,max = Vd − ea (−Io·R)` and `VL,min = −ea (−Io·R)`
5. Required inductance: `L = VL,max · dt / ΔiL`
6. RMS ripple: `ΔiL,rms = ΔiL / (2√3)` (triangular waveform)

---

## 3. Quick MCQ/MSQ Reference

- Volt-second balance → **inductor** (flux doesn't drift)
- Charge balance → **capacitor** (voltage doesn't drift)
- `Isw,rms = √D · IL` (not `D · IL`)
- Unipolar: dominant harmonic at **2fs**, not fs
- Each H-bridge switch blocks full **Vd** when off
- Bipolar gives **higher** ripple than unipolar (wider voltage swing)
- Air gap in volt-second balance: ignore series resistance unless stated
- Output capacitor ripple `ΔVc = ΔiL/(8·C·fs)` — uses **peak-to-peak** ΔiL; higher C or higher fs → lower ripple

---

## 4. FIB Quick Answers

- `Vout = D · Vin` (D is the duty cycle)
- Charge balance: average current through a **capacitor** = 0
- `dTA+ = (1 + ea/Vd) / 2` for both PWM modes
- `Isw,rms = √D · IL` (small ripple approximation)
- `ΔVc = ΔiL / (8·C·fs)` → output voltage ripple (Buck CCM)
