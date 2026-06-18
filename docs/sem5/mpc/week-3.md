# Week 3 — Gate Driver Design

---

## 1. Gate Driver Requirements

- Supply sufficient peak current to charge/discharge gate capacitance quickly
- Level shifting: convert 3.3/5 V logic to 10–15 V gate drive
- Isolation (not always — bootstrap is a non-isolated option for high-side)
- Low propagation delay and matched tPLH / tPHL

> **MSQ trap**: Isolation is NOT required in all cases (e.g., bootstrap for high-side in Buck). It IS required when ground potentials differ significantly.

---

## 2. Peak Gate Current

```
Ig,pk = Vdrv / (RG,ext + RG,int)
```

- `Vdrv` = gate drive voltage (e.g., 15 V)
- `RG,ext` = external gate resistor (designer's choice)
- `RG,int` = internal gate resistance (from datasheet)

> **FIB**: Both resistances limit current — RG,int cannot be changed by designer.

### Gate Drive Power
```
Pgd = Qg · VGS · fs
```
Dissipated in gate resistors (external + internal) — NOT in the MOSFET channel.

### Gate Resistor Power
```
P_RG = Ig,rms² · RG
```

---

## 3. Gate Charge Sequence (Turn-on)

1. **Qgs phase**: VGS rises from 0 → VGS,miller. Gate current charges Cgs.
2. **Miller plateau**: VGS stays constant at VGS,miller. All gate current charges Cgd. VDS falls. This is where switching happens.
3. **Post-plateau**: VGS rises from VGS,miller → VGS,final. Small remaining charge.

### Miller Plateau Duration
```
t_miller = Qgd / Ig,pk
```

> **MSQ**: During Miller plateau — VGS is constant, VDS falls, Cgd is being discharged, drain current is roughly constant.

---

## 4. Bootstrap Gate Driver

- Used for high-side switches (half-bridge, synchronous Buck) where source floats
- When **low-side switch turns on** → switch node → 0 V → bootstrap capacitor charges through bootstrap diode
- Bootstrap voltage: `Vbs ≈ Vcc − Vf,diode` (typically Vcc − 0.7 V)

### Bootstrap Capacitor Sizing
```
Cbs,min = Qg / ΔVbs,max
```
where `ΔVbs,max` is the maximum allowable voltage droop (e.g., 5% of Vbs).

For multiple cycles before recharge:
```
Cbs,min = (n · Qg) / ΔVbs
```

> **Limitation**: Bootstrap requires the low-side switch to conduct periodically → cannot operate at D = 100%.

---

## 5. Isolation Methods

| Method | Notes |
|---|---|
| Bootstrap | Non-isolated, requires low-side conduction to recharge, max D < 100% |
| Optocoupler | Isolated, requires separate isolated supply on secondary side, limited bandwidth |
| Pulse transformer | Isolated, cannot pass DC or low-frequency signals (volt-second product limit) |

---

## 6. IRF540NPbF Datasheet Reference

> **This is the primary exam device for gate driver and snubber calculation questions.**

| Parameter | Value |
|---|---|
| VDS(max) | 100 V |
| ID (TC=25°C) | 33 A |
| ID (TC=100°C) | 23 A |
| RDS(on) typ (VGS=10V) | 44 mΩ |
| RDS(on) max (VGS=10V) | 77 mΩ |
| Qg typ | 59 nC |
| Qg max | **72 nC** (at VGS=10V, VDD=50V, ID=24A) |
| Qgs | 15 nC |
| Qgd (Miller charge) | 24 nC |
| RG,int | **1.2 Ω** |
| VGS(th) | 2.0 V (min) – 4.0 V (max) |
| Tjmax | 175°C |
| Rθjc | 3.3 °C/W |
| Body diode trr | 53 ns (typ) |
| Body diode Qrr | 150 nC (typ) |
| Manufacturer test Rg | **9.1 Ω** |

### IRF540NPbF Body Diode (for snubber questions — Week 4)

| Parameter | Typ | Max | Units |
|---|---|---|---|
| dv/dt (Peak Diode Recovery) | — | **7.0** | V/ns |
| trr | 115 | 170 | ns |
| Qrr | 505 | 760 | nC |
| VSD (forward voltage) | — | 1.2 | V |

```
Irr = 2 × Qrr / trr = 2 × 505 / 115 = 8.78 A

toff = td(off) + tf = 39 + 35 = 74 ns
```

### Exam Calculations from IRF540NPbF
```
Ig,pk (at manufacturer Rg) = Vg / (Rg_mfr + RG,int)
                            = 15 / (9.1 + 1.2) = 15 / 10.3 ≈ 1.46 A

To limit Ig,pk = 2 A:
  RG,total = 15 / 2 = 7.5 Ω  →  RG,ext = 7.5 − 1.2 = 6.3 Ω
```

---

## 7. IRFP90N20DPbF Datasheet Reference

| Parameter | Value |
|---|---|
| VDS | 200 V |
| ID | 94 A |
| Qg | 300 nC |
| Qgs | 55 nC |
| Qgd (Miller charge) | 130 nC |
| RDS(on) typ | 20 mΩ |
| RG,int | 1.2 Ω |
| VGS(th) typ | 4.0 V |

> Qgd (130 nC) > Qgs (55 nC) → Miller charge dominates → large Cgd → high-voltage MOSFET characteristic.

---

## 7. VO3150A Optocoupler Datasheet Reference

| Parameter | Value |
|---|---|
| Peak output source current IOH | 0.5 A |
| Propagation delay tPLH, tPHL (max) | 400 ns (0.4 µs) |
| LED forward current IF | 7 mA (min) – 16 mA (max) |
| LED forward voltage VF (max) | 1.6 V |

### LED Series Resistor
```
R_min = (Vp − VF) / IF_max   ← ensures IF ≤ IF_max (don't exceed max LED current)
R_max = (Vp − VF) / IF_min   ← ensures IF ≥ IF_min (ensure enough current for device to operate)
```
> **MCQ trap**: Both min AND max resistor values matter. Too low R → overcurrent. Too high R → insufficient IF → device may not switch properly.

### Minimum Gate Resistance (from VO3150A output current limit)
```
RG_min = (VCC − VEE) / IOH = (15 − (−5)) / 0.5 = 40 Ω   (for split supply)
```

---

## 8. IGBT — Key Theory for Exam

### IGBT vs MOSFET
| | MOSFET | IGBT |
|---|---|---|
| Carrier type | Majority (unipolar) | Minority (bipolar) |
| On-state drop | RDS(on)·I (rises with V rating) | VCE(sat) ≈ 1.7V (low, regardless of rating) |
| Switching speed | Fast | Slower — **tail current** at turn-off |
| Preferred voltage | < 600V | > 600V |

> **MCQ**: IGBT has **tail current** at turn-off — minority carriers must recombine. This limits max fs.

### IGBT Switching Loss
IGBTs use **energy** values Eon and Eoff from datasheet — NOT the ½VIT formula used for MOSFETs:
```
Psw = (Eon + Eoff) × fs
```

### IRG7PH42UDPbF IGBT Datasheet (exam IGBT)

| Parameter | Typ | Max | Units | Conditions |
|---|---|---|---|---|
| VCES | — | 1200 | V | |
| IC (TC=25°C) | — | 85 | A | |
| IC (TC=100°C) | — | 45 | A | |
| VCE(on) at 25°C | 1.7 | 2.0 | V | IC=30A, VGE=15V |
| VCE(on) at 150°C | 2.1 | — | V | |
| VGE(th) | — | 3.0–6.0 | V | |
| Qg | 157 | 236 | nC | IC=30A, VGE=15V, VCC=600V |
| Qge | 21 | 32 | nC | |
| Qgc (Miller) | 69 | 104 | nC | |
| Eon | 2105 | 2374 | µJ | IC=30A, VCC=600V, RG=10Ω |
| Eoff | 1182 | 1424 | µJ | |
| td(on) | 25 | 34 | ns | |
| tr | 32 | 41 | ns | |
| td(off) | 229 | 271 | ns | |
| tf (tail) | 63 | 86 | ns | |
| VFM (diode) | 2.0 | 2.4 | V | IF=30A |

> **MCQ trap**: IGBT td(off)=229ns is much longer than MOSFET — minority carrier tail dominates. Qgc=69nC > Qge=21nC → Miller charge dominates (same pattern as high-voltage MOSFET).

### MOSFET Operating Regions
| Condition | Region |
|---|---|
| VGS < Vth | **Cut-off** (off, no current) |
| VGS > Vth, VDS < VGS−Vth | **Ohmic/Linear** (acts like resistor) |
| VGS > Vth, VDS > VGS−Vth | **Saturation/Active** (constant current) |

> **MCQ**: Miller capacitance = **Gate-to-Drain capacitance (Cgd)**. The plateau exists because Cgd is being charged/discharged.

### Bootstrap Limitations (MCQ-tested)
- **Low noise immunity** (no isolation)
- Only for **half-bridge** circuits (needs low-side switch to recharge Cbs)
- Only where gate drive requires **low power** (low Qg × fs)
- Cannot sustain D = 100%

---

## 9. Dead Time

- Period when both switches in a bridge leg are OFF simultaneously
- Prevents **shoot-through** (both switches on simultaneously → direct Vbus short)
- Propagation delay mismatch (tPLH ≠ tPHL) → effective duty cycle error at output

---

## 9. Numeric Problem Approach

### Peak Gate Current
1. `Ig,pk = VGS / (RG,ext + RG,int)`
2. e.g. IRFP90N20DPbF: `Ig,pk = 15 / (4.7 + 1.0) = 2.63 A`

### Miller Plateau Duration
1. `t_miller = Qgd / Ig,pk`
2. e.g. `130 nC / 2.63 A = 49.4 ns`

### Gate Drive Power
1. `Pgd = Qg · VGS · fs`
2. e.g. `300e-9 × 15 × 100e3 = 0.45 W`

### Bootstrap Capacitor
1. `Cbs,min = Qg / ΔVbs` (single cycle)
2. e.g. `110e-9 / (0.05 × 15) = 147 nF → select 150 nF or 220 nF`

### Required External Gate Resistor
1. `RG,total = Vdrv / Ig,pk,max`
2. `RG,ext = RG,total − RG,int`

---

## 10. MCQ/MSQ Quick Reference

- Miller plateau duration ∝ `Qgd / Ig,pk` → larger RG → longer plateau → more switching loss
- Gate drive power dissipated in **gate resistors** not MOSFET
- Bootstrap: needs low-side conduction to recharge → cannot use at D = 100%
- Optocoupler: requires isolated supply on gate-driver side
- During Miller plateau: VGS = const, VDS falls, IG goes entirely into CGD
- `Qgd > Qgs` in high-voltage MOSFETs → Miller effect dominates
- Dead time prevents shoot-through; too much dead time increases conduction loss in body diode
- Gate driver IC selection criteria: peak current, propagation delay, **CMTI** (common-mode transient immunity), VCC range
  - **CMTI** = ability to withstand fast dv/dt at switch node without false triggering; rated in kV/µs (e.g., 50 kV/µs). Higher CMTI → more robust in high-speed converters
- Propagation delay mismatch (tPLH ≠ tPHL) → introduces duty cycle error at gate output → affects dead time accuracy

---

## 11. FIB Quick Answers

- `Ig,pk = Vdrv / (RG,ext + RG,int)`
- Gate charge sequence: `Qgs` → **Miller** plateau → post-plateau
- During Miller plateau, VGS ≈ **VGS,miller** (constant)
- `Cbs,min = Qg / ΔVbs`
- IRFP90N20DPbF RG,int = **1.2 Ω**
