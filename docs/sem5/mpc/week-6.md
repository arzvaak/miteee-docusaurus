# Week 6 — Magnetics & Inductor Design

---

## 1. Magnetic Fundamentals

### Core Relations

| Quantity | Symbol | Relation |
|---|---|---|
| Flux | φ | `φ = B·Ac` |
| MMF | F = Ni | `F = H·lc = Ni` (Ampere's law) |
| Reluctance | R | `R = lc/(μ·Ac)` |
| Inductance | L | `L = N²/R_total = λ/i` |

- **Higher permeability → more L for fewer turns**
- Air gap reduces effective permeability but makes L more **linear and predictable** (less dependent on nonlinear core μ)
- **Curie temperature (Tc)**: above Tc, ferromagnetic material loses all magnetic properties (µr drops to ~1) → catastrophic inductance collapse. High Tc is desirable. Ferrite Tc typically 200–400°C.

### Air Gap Dominance
When `Rg >> Rc`:
```
L ≈ μ0·Ac·N² / lg
```

### B-H Curve
- Area enclosed = energy lost per cycle per unit volume = **hysteresis loss**
- Ferromagnets lose magnetic properties above **Curie temperature** (high Curie T is desirable)
- `B ≤ Bmax` must be respected (core saturates above Bsat)
  - Ferrite: Bsat ≈ 0.3–0.5 T; operating point: Bm = 0.2–0.3 T

---

## 2. Core Materials

| Material | Freq range | Bsat | Resistivity | Best for |
|---|---|---|---|---|
| Silicon steel (CRGO) | < 1 kHz | 1.5–2 T | Low | Mains frequency transformers |
| Ferrite | 10 kHz–10 MHz | 0.3–0.5 T | Very high | High-frequency power converters |
| Powdered iron / Kool-Mµ / MPP | 10 kHz–1 MHz | ~1 T | Medium | Distributed air gap, soft saturation |

> **Key**: Ferrite preferred at 100 kHz because very high resistivity → very low eddy current losses. Silicon steel would have unacceptable eddy current losses at 100 kHz.

> **Powdered iron advantage**: distributed air gap → soft saturation (gradual, not abrupt) → better for biased inductors.

---

## 3. Core Losses (Steinmetz Equation)

```
Pc = k · f^m · Bm^n · Vc
```
- `Bm` = peak flux density (operating)
- `f` = switching frequency
- `k, m, n` = material constants
- `Vc` = core volume

Core loss depends on: **frequency, flux density, material, volume** — all four.

---

## 4. Winding Losses — Skin & Proximity Effect

### Skin Effect
- At high f, current concentrates near conductor surface
- **Skin depth**: `δ = √(ρ / (π·f·μ))`
- `δ ∝ 1/√f` → lower f → larger skin depth → more current cross-section used → lower AC resistance
- At DC (f→0), current uniform across full cross-section

### Proximity Effect
- Adjacent conductors' fields redistribute current in multi-layer windings
- Dramatically increases losses in multi-layer windings at high frequency
- Worse than skin effect alone

### FR Factor
```
Rwac = FR · Rwdc
```
FR > 1 accounts for skin + proximity effects.

### AWG Rules
| AWG number | Effect |
|---|---|
| Lower AWG (e.g., AWG 8) | **Larger** diameter, larger area, **lower resistance**, lower max usable frequency |
| Higher AWG (e.g., AWG 28) | Thinner wire, higher resistance, better for high frequency |

> **MSQ trap**: Lower AWG = larger wire = LOWER resistance, but WORSE skin effect penalty → lower max operating frequency.

### Litz Wire
- Multiple individually insulated strands, twisted/transposed
- Each strand diameter < skin depth at operating frequency
- Current distributes across all strands → reduces effective AC resistance
- Used at high frequency where skin/proximity effects are severe

---

## 5. Inductor Design — Area Product Method

### Area Product Definition
```
Ap = Wa × Ac    [cm⁴ or m⁴]
```
- `Wa` = winding window area (for copper)
- `Ac` = core cross-sectional area (for flux)

### Required Area Product
```
Ap = L · ILpk² / (Ku · Bm · Jm)
```
where:
- `ILpk = IDC + ΔiL/2` (peak inductor current)
- `Ku` = window utilization factor (typically 0.3–0.5)
- `Bm` = operating flux density (e.g., 0.2–0.3 T for ferrite)
- `Jm` = current density (e.g., 2–3 A/mm²)

> **Key**: `Ap ∝ ILpk²` → doubling peak current → Ap increases by **4×**
> **FIB**: The blank in `Ap = L·ILpk²/(___·Bm·Jm)` is **Ku** (window utilization factor)

### Window Utilization Factor
```
Ku = N · Aw / Wa    (typically 0.3–0.5)
```
Ku < 1 because: bobbin occupies space, wire insulation, round wire packing inefficiency.

| Winding style | Typical Ku |
|---|---|
| Single-layer | 0.40–0.45 |
| Multi-layer | 0.30–0.40 |
| Litz wire (multi-strand) | 0.25–0.35 (lower — more insulation) |

> **MCQ trap**: Ku is NEVER 1.0. A question using Ku = 1 is wrong.

---

## 6. Step-by-Step Inductor Design Procedure

**Given**: L, IDC (= IL), ΔiL, Bm, Jm, Ku

### Step 1 — Peak Current
```
ILpk = IDC + ΔiL/2
```

### Step 2 — RMS Current
```
ILrms = √(IL² + ΔiL²/12)
```
For small ripple (ΔiL << IDC): `ILrms ≈ IDC`

### Step 3 — Required Area Product
```
Ap = L · ILpk² / (Ku · Bm · Jm)
```
Convert units: L in H, Bm in T, Jm in A/m² (= A/mm² × 10⁶)

### Step 4 — Select Core
Choose EE core with `Ap = Wa × Ac ≥ Ap,required`

**EE Core Data (from exam slides — these are the actual exam cores)**:

| Core | Ap (cm⁴) | Ac (cm²) | Wa (cm²) | MPL/lc (cm) | MLT (cm) |
|---|---|---|---|---|---|
| EE-187 | 0.114 | 0.226 | 0.506 | 4.01 | 3.8 |
| EE-2425 | 0.314 | 0.395 | 0.794 | 4.85 | 4.9 |
| EE-375 | 1.339 | 0.870 | 1.539 | 6.94 | 6.6 |
| EE-21 | 2.448 | 1.490 | 1.643 | 7.75 | 8.1 |
| EE-625 | 4.516 | 2.340 | 1.930 | 8.90 | 9.4 |
| **EE-75** | **9.433** | **3.370** | **2.799** | **10.70** | **11.2** |

> **Exam example**: Ap,required = 8.28 cm⁴ → select **EE-75** (9.433 cm⁴). Always pick the smallest core that exceeds the requirement.

Also note: ETD cores exist (ETD-29, ETD-34) but EE cores are the primary exam type.

### Step 5 — Wire Cross-Section
```
Aw = ILrms / Jm
```
(Uses RMS current, NOT peak current)

### Step 6 — Select AWG
From AWG table: pick lowest AWG (largest wire) with `Aw,wire ≥ Aw,required`
- AWG 8 ≈ 8.37 mm²
- AWG 9 ≈ 6.63 mm²

### Step 7 — Number of Turns
**Method A** (from window area):
```
N = Ku · Wa / Aw    (round DOWN to integer)
```
**Method B** (from flux):
```
N = L · ILpk / (Bpk · Ac)    (round to nearest integer)
```

### Step 8 — Air Gap
```
lg = μ0 · Ac · N² / L − lc / μrc
```
Units: all in SI (m, H, T, A/m)

### Step 9 — Verify Peak Flux Density
```
Bpk = L · ILpk / (N · Ac)    ≤ Bsat
```

---

## 7. Temperature Rise (Optional/Advanced)

```
ΔT = 450 × (Pcw / At)^0.826
```
where `Pcw = Pc (core loss) + Pw (winding loss)` and `At` is surface area in cm².

---

## 8. Numeric Problem Approach

### Ap Calculation Example
Given: L=60µH, ILpk=18.2A, Jm=3A/mm², Ku=0.4, Bm=0.2T
```
Ap = (60e-6 × 18.2²) / (0.4 × 0.2 × 3e6)
   = (60e-6 × 331.24) / (240000)
   = 0.019874 / 240000
   = 8.28e-8 m⁴ = 8.28 cm⁴
→ Select EE-75 (Ap ≈ 9.43 cm⁴ > 8.28 cm⁴)
```

### Turns Calculation (window method)
Given: Ku=0.4, Wa=2.80cm², Aw=6.63mm²
```
N = 0.4 × 2.80e-4 / 6.63e-6 = 16.89 → 16 turns (floor)
```

### Air Gap Calculation
Given: Ac=3.37cm², lc=10.7cm, μrc=2300, N=17, L=60µH
```
lg = (4π×10⁻⁷ × 3.37×10⁻⁴ × 17²) / 60×10⁻⁶ − (10.7×10⁻²/2300)
   = 2.044×10⁻³ − 0.465×10⁻³ = 1.58×10⁻³ m ≈ 1.58 mm
```

### Skin Depth Scaling
```
δ(f1)/δ(f2) = √(f2/f1)
```
e.g. δ at 100 kHz vs 1 MHz: `δ(100k) = 0.066 × √(1M/100k) = 0.066 × √10 = 0.209 mm`

---

## 9. MCQ/MSQ Quick Reference

- Air gap → **decreases** inductance per turn but makes it more linear
- Ferrite preferred at high frequency: **high resistivity** → low eddy current losses
- Silicon steel: high Bsat but **low resistivity** → high eddy current losses at high f
- Ap ∝ ILpk² → very sensitive to peak current
- `Aw = ILrms/Jm` (RMS, not peak)
- `N = L·ILpk/(Bpk·Ac)` (peak current, not RMS)
- Lower AWG = larger wire = more current capacity but worse high-frequency behaviour
- Litz wire reduces AC winding resistance at high frequency
- Hysteresis loop area = energy loss per cycle per unit volume
- Core loss depends on: f, Bm, material, volume (all four)
- Ku typically 0.3–0.5 (never 1.0)
- Low Curie temperature = **undesirable** in core material

---

## 10. FIB Quick Answers

- `Ap = L·ILpk² / (Ku·Bm·Jm)` — blank is **Ku**
- `lg = μ0·Ac·N²/L − lc/μrc`
- `N = Ku·Wa/Aw` (window method, round down)
- `Aw = ILrms / Jm` (uses **RMS** current)
- `ILpk = IDC + ΔiL/2`
- `ILrms = √(IL² + ΔiL²/12)`
- Temperature rise formula: `ΔT = 450 × (Pcw/At)^0.826`; `Pcw = Pc + Pw`
- Skin depth: `δ ∝ 1/√f`
- EE-65: Ac=2.58cm², Wa=2.97cm², lc=14.7cm; EE-75: Ac=3.37cm², Wa=2.80cm², lc=10.70cm
