# Week 4 — Snubbers & Protection

---

## 1. Why Snubbers?

At switch turn-off, stored energy in parasitic inductance `Lpar` drives a resonant voltage spike:
```
Vpeak = Vin + I0 · Z0    (undamped)
```
where `Z0 = √(Lpar/Cs)` and `I0` = commutated current at turn-off.

Without snubber: full spike → overstress, EMI, possible device failure.

---

## 2. RC Snubber (Turn-off / dv/dt Snubber)

### Key Quantities

```
Z0 = √(Lpar / Cs)          [characteristic impedance, Ω]
ζ  = Rs / (2·Z0)           [damping ratio]
f0 = 1 / (2π·√(Lpar·Cs))  [resonant frequency]
ω0 = 1 / √(Lpar·Cs)       [angular resonant frequency]
```

- **Critical damping**: `ζ = 1` → `Rs = 2·Z0`
- Practical design: `ζ = 0.5–1` (slightly under- to critically-damped)
  - `ζ = 0.5` → ~16% overshoot; `ζ = 0.7` → ~5% overshoot; `ζ = 1` → 0% overshoot (no ringing)

### Design Method 1 — dv/dt Limiting
```
Cs = Vin / (dv/dt_limit · Rs_initial)
Rs = Vin / (dv/dt_limit · Cs)
```
Initial dv/dt (undamped): `(dv/dt)_init = Vin · ω0`
→ Choose Cs large enough so `Vin · ω0 ≤ dv/dt_limit`

### Design Method 2 — Peak Voltage Method
```
Cs = Lpar · (Irr / Vin)²     [for χ0 = 2 target]
Rs = 2·ζ0·Z0 = 2·ζ0·√(Lpar/Cs)
```
where `Irr = 2·Qrr/trr` (peak reverse recovery current from diode — assumes triangular waveform).

> **MCQ trap**: Irr and Qrr are **strongly temperature-dependent**. e.g. IRFB7545PbF body diode: Qrr = 340 nC at 25°C vs 36 nC at 125°C — nearly 10× lower at high temperature. Always use the correct temperature datasheet value.

### Snubber Power Loss
```
Ps = ½ · Cs · Vs² · fs
```
- Energy stored each cycle: `E = ½·Cs·Vs²` → all dissipated in Rs at next turn-on
- Increases with Cs and fs → trade-off: larger Cs = better voltage limiting but more loss

### Effect on EMI
- RC snubber **reduces** EMI by damping the parasitic LC oscillation at the switch node

---

## 3. RCD Snubber

- Adds diode Ds in parallel with Rs
- Cs charges through Ds (low-impedance path) at turn-off
- Cs discharges through Rs at turn-on (diode blocks reverse current)
- Advantage: Cs and Rs can be sized independently (no competing requirements)
- Same power loss formula: `Ps = ½·Cs·Vs²·fs`

### Comparison: RC vs RCD

| | RC Snubber | RCD Snubber |
|---|---|---|
| Cs charges through | Rs (slower, limited by Rs) | Ds (fast, low impedance) |
| Cs discharges through | Rs | Rs only (diode blocks reverse) |
| Design flexibility | Lower (Rs has dual role) | Higher (Cs and Rs independent) |

---

## 4. Turn-on Snubber (di/dt Snubber)

- Series inductor `Ls` in the switch branch
- Limits `di/dt` at turn-on → protects diode from reverse recovery
- Energy `½·Ls·I²` must be dissipated when Ls releases → added snubber loss

---

## 5. Snubber Loss Comparison

Large snubber → most voltage spike energy absorbed in Rs (less switch stress)
Small snubber → less absorption
No snubber → full spike on switch, maximum switch stress

> **MCQ trap**: Total switch stress is LOWEST with a large snubber (most energy diverted to Rs, away from the switch). But snubber itself adds loss to the converter.

---

## 6. DESAT (Desaturation) Protection

Monitors VDS (or VCE) during on-state. If device exits saturation (overcurrent → VDS rises above threshold), gate driver performs **soft turn-off** to avoid destructive di/dt.

### Blanking Capacitor
Prevents false trip at turn-on (VDS takes time to fall after gate signals):
```
tblank = Cblank · Vblank / Ichg
```
- `Cblank` = blanking capacitor (e.g., 100 pF)
- `Vblank` = voltage threshold (e.g., 7 V)
- `Ichg` = constant charging current (e.g., 250 µA)

### Soft Turn-off
- DESAT triggers a slow/controlled turn-off (not abrupt)
- Avoids high `di/dt` → reduces voltage spike from `Lpar·di/dt`

---

## 7. IRF540NPbF Datasheet Reference (exam snubber device)

| Parameter | Value | Notes |
|---|---|---|
| VDS(max) | 100 V | |
| ID (TC=25°C) | 33 A | |
| ID (TC=100°C) | 23 A | |
| VGS(max) | ±20 V | |
| PD (TC=25°C) | 130 W | |
| RDS(on) typ | 44 mΩ | |
| Body diode dv/dt | **7.0 V/ns** | Peak diode recovery dv/dt (max) |
| Body diode trr | **115 ns** (typ), 170 ns (max) | |
| Body diode Qrr | **505 nC** (typ), 760 nC (max) | |
| Body diode VSD | 1.2 V (max) | |
| toff = td(off)+tf | 39+35 = **74 ns** | |

```
Irr = 2 × Qrr / trr = 2 × 505 / 115 = 8.78 A
```

### RC Snubber Design Rules (from slides — directly tested)
- **E1 = 2 × Vin** (peak voltage limit = 2× input) → E1/E = **2**
- **(dv/dt)av = 0.5 × datasheet dv/dt** = 0.5 × 7.0 = **3.5 V/ns**
- For peak-voltage design (χ₀=2, ζ₀=0.4):
  ```
  Cs = Lp × (Irr / (E × χ₀))²
  Rs = 2 × ζ₀ × √(Lp/Cs)
  ```
- χ² = (½·Lp·Irr²) / (½·Cs·E²) = ratio of initial inductive energy to final capacitive energy

---

## 9. IRF530NPbF Datasheet Reference

| Parameter | Value |
|---|---|
| RDS(on) at TJ=25°C | 90 mΩ (0.090 Ω) |
| ton = td(on) + tr | 71 + 25 = 96 ns |
| toff = td(off) + tf | 35 + 25 = 60 ns |
| Tjmax | 175°C |
| Rθjc | 2.15 °C/W |
| Body diode Qrr | 320 nC |
| Body diode trr | 95 ns |
| Max dv/dt (body diode) | 5.5 V/ns |

`Irr = 2·Qrr/trr = 2×320/95 = 6.737 A`

---

## 10. Numeric Problem Approach

### RC Snubber — dv/dt Method
1. Given: Lpar, Cs (or dv/dt limit), Vin
2. `Z0 = √(Lpar/Cs)`
3. `ω0 = 1/√(Lpar·Cs)` → check `Vin·ω0 ≤ dv/dt_limit`
4. `Rs = Vin / (dv/dt_limit · Cs)` for limiting approach
5. Check damping: `ζ = Rs / (2·Z0)` → aim for 0.5–1

### RC Snubber — Peak Voltage Method
1. `Irr = 2·Qrr/trr`
2. `Cs = Lpar·(Irr/Vin)²`
3. `Z0 = √(Lpar/Cs)`
4. `Rs = 2·ζ0·Z0` (choose ζ0 ≈ 0.4–0.9)

### RCD Snubber Power Loss
1. `Ps = 0.5 · Cs · Vs² · fs`
2. Vs ≈ Vin (capacitor charges to bus voltage)

### DESAT Blanking Time
1. `tblank = Cblank · Vblank / Ichg`

### Peak Undamped Voltage
1. `Vpeak = Vin + I0·Z0 = Vin + I0·√(Lpar/Cs)`

---

## 11. MCQ/MSQ Quick Reference

- `ζ < 1` underdamped, `ζ = 1` critical, `ζ > 1` overdamped
- Critical damping: `Rs = 2·Z0`
- Snubber loss `∝ Cs·fs` → conflict: large Cs absorbs more energy but burns more power
- RCD advantage: diode separates charge and discharge paths
- DESAT monitors **VDS** not gate voltage
- Soft turn-off = slow gate pull-down on overcurrent detection
- RC snubber **reduces EMI** (damps oscillations that are an EMI source)
- Turn-on snubber (di/dt): series **inductor** in switch path
- Turn-off snubber (dv/dt): **capacitor** across switch

---

## 12. FIB Quick Answers

- `ζ = Rs / (2·Z0)` where `Z0 = √(Lpar/Cs)`
- Critical damping: `ζ = 1`
- DESAT monitors **VDS** voltage of switch
- `tblank = Cblank · Vblank / Ichg`
- `Ps = ½·Cs·Vs²·fs`
- IRF530NPbF max dv/dt body diode: **5.5 V/ns**
- IRF530NPbF toff = 35 + 25 = **60 ns**
