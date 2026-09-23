---
title: "Week 2 - Transmission-Line Inductance, GMR, and GMD"
sidebar_label: "Week 2 - Transmission-Line Inductance, GMR, and GMD"
sidebar_position: 2
description: "Inductance of transmission lines from first principles — fictitious radius, geometric mean radius and distance, transposition, bundled and double-circuit configurations, mutual interference, and hollow conductors."
tags:
  - power-system-analysis
  - week-2
math_syntax: typst
---

# Week 2 — Transmission-Line Inductance, GMR, and GMD

> **◆ MIDSEM** — This chapter covers material that forms the backbone of mid-semester examination questions on transmission-line parameters. Master the derivations, the 0.4605 family of formulas, and the GMD/GMR computational method.

---

## Roadmap

Transmission-line inductance determines voltage drop, reactive power, and system stability. This chapter builds the theory from a single two-wire line up to complex double-circuit configurations, using a single unifying framework: the **geometric mean distance (GMD)** and **geometric mean radius (GMR)** method.

The logical progression is:

1. **Single-phase two-wire line** — derive inductance from Ampère's law and flux linkages.
2. **Fictitious radius and GMR** — understand why $r' = 0.7788 r$ replaces the actual radius.
3. **Self and mutual inductance** — formulate coupled-circuit equations and generalise to $n$ conductors.
4. **Composite and stranded conductors** — introduce the GMD/GMR method for bundled and multi-strand geometries.
5. **Three-phase lines** — symmetrical spacing, asymmetrical spacing, and transposition.
6. **Bundled conductors** — GMR formulas for 2-, 3-, and 4-conductor bundles.
7. **Double-circuit lines** — equivalent GMD and GMR for parallel three-phase circuits.
8. **Four-wire lines** — neutral flux linkage and induced voltage.
9. **Mutual interference** — electromagnetic coupling between power and telephone lines.
10. **Hollow conductors** — internal inductance derivation with mixed logarithms.

## Learning Outcomes

By the end of this chapter you should be able to:

1. Derive the inductance of a single-phase two-wire line from flux linkage principles.
2. Explain the physical meaning of $r' = 0.7788 r$ and when to use it.
3. Apply the generalised flux linkage equation for $n$ conductors.
4. Compute the inductance of composite, stranded, and bundled conductors using GMD/GMR.
5. Determine the inductance of three-phase lines with symmetrical and asymmetrical spacing.
6. Justify transposition and calculate the average inductance of a transposed line.
7. Analyse double-circuit three-phase lines and compute their equivalent GMD and GMR.
8. Solve numerical problems involving flux linkages, induced voltages, and mutual inductance.
9. Derive the internal inductance of hollow conductors and distinguish $ln$ from $log_(10)$ usage.
10. Avoid common pitfalls: unit errors, wrong logarithm base, and GMR power-sum mistakes.

---

## 1. Single-Phase Two-Wire Line Inductance

### 1.1 Physical picture

Consider two long, parallel, solid cylindrical conductors spaced a distance $D$ centre-to-centre. Conductor 1 carries current $I$ into the page; conductor 2 carries $-I$ (the return current). Each conductor's magnetic field encircles it as concentric rings. Some of this flux links the conductor that produced it (self-flux); some links the other conductor (mutual flux).

### 1.2 Key assumption

> All external flux set up by current in conductor 1 links every ampere of current in conductor 2 up to the centre of conductor 2. Flux beyond that centre links negligible net current because the return current cancels it.

This is accurate when $D ≫ r_1$ and $D ≫ r_2$.

### 1.3 External flux linkage

From Ampère's law, the magnetic field intensity at distance $x$ from the centre of a conductor carrying current $I$ is $H = I/(2 pi x)$. The flux linking the conductor between radii $D_1$ and $D_2$ is:

$$
lambda_("ext") = 2 times 10^(-7) I ln(frac(D_2, D_1)) space "Wb/m"
$$

For conductor 1, external flux extends from its surface ($x = r_1$) to the centre of conductor 2 ($x = D$):

$$
L_(1,"ext") = 2 times 10^(-7) ln(frac(D, r_1)) space "H/m"
$$

### 1.4 Adding internal inductance

The internal inductance of a solid cylindrical conductor (from Week 1) is:

$$
L_("int") = frac(1, 2) times 10^(-7) space "H/m"
$$

Total inductance of conductor 1:

$$
L_1 = frac(1, 2) times 10^(-7) + 2 times 10^(-7) ln(frac(D, r_1))
$$

Factor out $2 times 10^(-7)$ and use $frac(1, 4) = ln(e^(1/4))$:

$$
L_1 = 2 times 10^(-7)[ln(e^(1/4)) + ln(frac(D, r_1))] = 2 times 10^(-7) ln(frac(D, r_1 e^(-1/4))) space "H/m"
$$

### 1.5 The fictitious radius (GMR)

Define:

$$
r' = r e^(-1/4) = 0.7788 r
$$

Then:

$$
L_1 = 2 times 10^(-7) ln(frac(D, r')) space "H/m"
$$

**Physical meaning:** $r'$ is the radius of a fictitious hollow conductor that has *no* internal inductance yet produces the *same total* inductance as the actual solid conductor. By replacing $r$ with $r'$, we fold the internal-flux contribution into a single logarithmic term — an elegant bookkeeping device.

### 1.6 Conversion to the 0.4605 formula

Convert to practical units — millihenry per kilometre:

- $ln -> log_(10)$: multiply by $2.3026$
- $"H" -> "mH"$: multiply by $10^3$
- $"per m" -> "per km"$: multiply by $10^3$

$$
L_1 = 2 times 10^(-7) times 2.3026 times 10^6 log_(10)(frac(D, r')) = 0.4605 log_(10)(frac(D, r')) space "mH/km"
$$

This is the single most important formula of the chapter. Every configuration-specific result is a variation of it.

## 2. Loop Inductance

The **loop inductance** is the total inductance of the complete circuit — one conductor going, one returning:

$$
L_("loop") = L_1 + L_2
$$

For **identical** conductors ($r_1 = r_2 = r$, $r_1' = r_2' = r'$):

$$
L_("loop") = 2 times 0.4605 log_(10)(frac(D, r')) = 0.921 log_(10)(frac(D, r')) space "mH/km"
$$

For **different** conductors:

$$
L_("loop") = 0.921 log_(10)(frac(D, sqrt(r_1' r_2'))) space "mH/km"
$$

The geometric mean $sqrt(r_1' r_2')$ appears naturally — a preview of the GMD/GMR framework.

## 3. Self and Mutual Inductance

Viewing the two-wire line as two magnetically coupled coils with the dot convention applied at the same end, and $I_1 = -I_2$:

$$
lambda_1 = L_(11) I_1 + M_(12) I_2 = (L_(11) - M_(12)) I_1
$$

Comparing with the flux linkage derivation:

$$
L_(11) = L_(22) = 0.4605 log_(10)(frac(1, r')) space "mH/km" space space M_(12) = M_(21) = 0.4605 log_(10)(frac(1, D)) space "mH/km"
$$

The self-inductance depends only on the conductor's own GMR; the mutual inductance depends only on the spacing between centres.

### 3.1 Generalisation to $n$ conductors

For $n$ conductors carrying balanced currents ($I_1 + I_2 + dots.h + I_n = 0$), the flux linkage of conductor $i$ is:

$$
lambda_i = 0.4605 [ I_i log_(10)(frac(1, r_i')) + sum_(j=1 j != i)^(n) I_j log_(10)(frac(1, D_("ij"))) ] space "mWb/km"
$$

This is the **workhorse formula**. Every inductance calculation in this chapter — single-phase, three-phase, bundled, double-circuit — is an application of this equation with appropriate substitutions for the currents and distances.

## 4. Composite and Stranded Conductors

### 4.1 Practical conductor types

- **Stranded copper** — flexibility for short spans.
- **Hollow copper** — used in special applications.
- **ACSR (Aluminium Conductor Steel Reinforced)** — the standard for overhead transmission: cheaper than copper at equal resistance, larger diameter reduces corona, and the steel core provides mechanical strength for longer spans.

For a stranded conductor with $y$ layers:

$$
S = 3 y^2 - 3 y + 1 space space D_("overall") = (2 y - 1) D_("strand")
$$

### 4.2 The GMD/GMR method

A composite conductor has multiple sub-conductors per phase. We replace the entire group with a single equivalent conductor whose GMR captures the average effect of all internal distances.

Consider composite conductor X with $n$ sub-conductors and composite conductor Y with $m$ sub-conductors. Assume the total current divides equally among sub-conductors. After applying the $n$-conductor flux linkage formula to every sub-conductor in X, computing each sub-conductor's inductance, and averaging (the algebra is lengthy but systematic), the result is:

$$
L_X = 0.4605 log_(10)(frac(D_m, D_("sx"))) space "mH/km"
$$

**Mutual GMD** ($D_m$) — the $m n$-th root of every mutual distance between X and Y:

$$
D_m = (product_(i=1)^(n) product_(j=1)^(m) D_("ij"))^(1/(m n))
$$

**Self GMD** ($D_("sx")$) — the $n^2$-th root of all intra-group distances, with diagonal terms replaced by the fictitious radius $r'$:

$$
D_("sx") = (product_(i=1)^(n) product_(j=1)^(n) D_("ij")^(*))^(1/n^2)
$$

where $D_("ii")^(*) = r_i'$ (the GMR of strand $i$).

> **Power-sum check:** The exponents in the self-GMD product must sum to $n^2$. For a 7-strand conductor, $n^2 = 49$. If they do not sum to 49, a distance or multiplicity has been missed.

---

```mermaid
flowchart TD
    A["Physical line configuration"] --> B{"Line type?"}
    B -->|"Single-phase, 2-wire"| C["L = 0.921 log(D / r')"]
    B -->|"3-phase, equilateral"| D["L = 0.4605 log(D / r')"]
    B -->|"3-phase, asymmetric"| E{"Transposed?"}
    E -->|"Yes"| F["L = 0.4605 log(D_m / D_s)"]
    E -->|"No"| G["Complex inductance matrix"]
    B -->|"Double-circuit"| H["Compute D_eq, D_s\nL = 0.4605 log(D_eq / D_s)"]
    B -->|"Composite / bundled"| I["Compute D_m, D_sx\nL = 0.4605 log(D_m / D_sx)"]
```

---

## 5. Three-Phase Lines

### 5.1 Symmetrical (equilateral) spacing

With phases $a$, $b$, $c$ at the vertices of an equilateral triangle of side $D$, and balanced currents $I_a + I_b + I_c = 0$:

$$
lambda_a = 0.4605 [ I_a log_(10)(frac(1, r')) + I_b log_(10)(frac(1, D)) + I_c log_(10)(frac(1, D)) ]
$$

Since $I_b + I_c = -I_a$:

$$
lambda_a = 0.4605 I_a log_(10)(frac(D, r'))
$$

$$
L_a = L_b = L_c = 0.4605 log_(10)(frac(D, r')) space "mH/km"
$$

### 5.2 Asymmetrical spacing

When $D_("ab") != D_("bc") != D_("ca")$, even with balanced currents the three phase inductances are **not equal** and are in general **complex** quantities (containing imaginary parts due to the $120°$ phase shifts in $I_b$ and $I_c$). In matrix form:

$$
mat(lambda_a; lambda_b; lambda_c) = 0.4605 mat(log frac(1, r'), log frac(1, D_("ab")), log frac(1, D_("ca")); log frac(1, D_("ab")), log frac(1, r'), log frac(1, D_("bc")); log frac(1, D_("ca")), log frac(1, D_("bc")), log frac(1, r')) mat(I_a; I_b; I_c)
$$

These unequal, complex inductances create unbalanced voltage drops and complicate power-system analysis. The solution is **transposition**.

## 6. Transposition

### 6.1 What transposition achieves

Transposition physically exchanges conductor positions at regular intervals (usually at switching stations) so that each conductor occupies each position for one-third of the total line length.

```mermaid
flowchart LR
    subgraph S1["Section 1"]
        A1["a"] --- B1["b"] --- C1["c"]
    end
    subgraph S2["Section 2"]
        A2["c"] --- B2["a"] --- C2["b"]
    end
    subgraph S3["Section 3"]
        A3["b"] --- B3["c"] --- C3["a"]
    end
    S1 --> S2 --> S3
```

### 6.2 Average inductance of a transposed line

Averaging the phase inductances over one complete transposition cycle and simplifying:

$$
L = 0.4605 log_(10)(frac(D_m, D_s)) space "mH/km"
$$

where:

$$
D_m = (D_("ab") D_("bc") D_("ca"))^(1/3) space space D_s = r'
$$

The three phases now share a single, real-valued average inductance — exactly what we need for balanced-system studies.

## 7. Bundled Conductors

At extra-high voltage (EHV) levels, multiple sub-conductors per phase (a **bundle**) reduce corona loss, radio interference, and line inductance. The bundle replaces a single conductor; its GMR is computed from the GMD/GMR method.

| Bundle type | GMR formula | Notes |
|:---:|:---:|:---|
| 2-conductor | $D_s = sqrt(r' d)$ | $d$ = bundle spacing |
| 3-conductor (equilateral) | $D_s = (r' d^2)^(1/3)$ | $d$ = side of triangle |
| 4-conductor (square) | $D_s = (r' sqrt(2) d^3)^(1/4)$ | $d$ = side of square |

The inductance per phase becomes:

$$
L = 0.4605 log_(10)(frac(D_m, D_s)) space "mH/km"
$$

where $D_s$ is now the bundle GMR rather than $r'$. Because $D_s ≫ r'$, the ratio $D_m/D_s$ is smaller, and hence **inductance is reduced** by bundling.

## 8. Double-Circuit Lines

A double-circuit line has two parallel three-phase circuits on the same tower, providing higher reliability (if one circuit trips, the other continues) and lower impedance.

### 8.1 Standard configuration

For the standard arrangement where phases are arranged symmetrically:

- $D$ = distance between adjacent phases ($a$-$b$, $b$-$c$)
- $d_1$ = distance between $a$-$c'$, $b$-$b'$, $c$-$a'$
- $d_2$ = distance between $a$-$b'$, $b$-$a'$
- $d_3$ = distance between $a$-$a'$, $c$-$c'$

### 8.2 Equivalent GMD

Computing the mutual geometric mean distance between phases $a$ and $b$ (averaging over all four mutual paths):

$$
D_("ab") = (D dot d_2 dot d_2 dot D)^(1/4) = sqrt(D d_2)
$$

By symmetry, $D_("bc") = sqrt(D d_2)$, and $D_("ca") = sqrt(2 D dot d_1)$.

$$
D_("eq") = 2^(1/6) D^(1/2) d_2^(1/3) d_1^(1/6)
$$

### 8.3 Equivalent self GMD

$$
D_s = (r')^(1/2) d_1^(1/6) d_3^(1/3)
$$

### 8.4 Inductance

$$
L = 0.4605 log_(10)(frac(D_("eq"), D_s)) = 0.4605 log_(10)[2^(1/6)(frac(D, r'))^(1/2)(frac(d_2, d_3))^(1/3)] space "mH/km"
$$

Equivalently, $L = frac(1, 2)(L_s - M)$, where $L_s$ is the self inductance of each individual circuit and $M$ is the mutual inductance between circuits. The factor $frac(1, 2)$ arises because the two circuits are electrically in parallel.

## 9. Four-Wire Lines and Neutral Flux Linkage

In a three-phase four-wire system (three phases plus a neutral conductor), the neutral may carry unbalanced current or carry zero current (if the load is balanced). When the neutral carries **zero** current, it still has a non-zero **flux linkage** due to the magnetic fields of the phase conductors, and hence a voltage is **induced** along it.

For a neutral conductor $n$ with zero current, at distances $D_("an")$, $D_("bn")$, $D_("cn")$ from phases $a$, $b$, $c$:

$$
lambda_n = 0.4605 [ I_a log_(10)(frac(1, D_("an"))) + I_b log_(10)(frac(1, D_("bn"))) + I_c log_(10)(frac(1, D_("cn"))) ] space "mWb/km"
$$

The induced voltage per kilometre is:

$$
V_n = j omega lambda_n times ell space "volts"
$$

where $ell$ is the line length in kilometres.

**Phase flux linkages** are computed by applying the generalised formula to each phase conductor. When $I_a + I_b + I_c = 0$, one current can be eliminated from each expression. For example, eliminating $I_c = -(I_a + I_b)$ from the expression for $lambda_a$ simplifies it to a function of $I_a$ and $I_b$ only.

## 10. Mutual Interference with Telephone Lines

A power line running parallel to a telephone circuit induces a voltage in the telephone loop through mutual magnetic coupling.

Consider a single-phase power line with conductors $P_1$, $P_2$ carrying $+I$ and $-I$ respectively, and a telephone line with conductors $T_1$, $T_2$ running parallel below it. Let $d_1$ and $d_2$ be the distances from $P_1$ to $T_1$ and $T_2$ respectively.

The total flux linkage of the telephone loop is:

$$
lambda_T = lambda_(T 1) - lambda_(T 2) = 0.921 I log_(10)(frac(d_2, d_1)) space "mWb/km"
$$

The minus sign arises because $T_1$ and $T_2$ form a loop: flux entering $T_1$ and leaving $T_2$ produces opposing linkages.

**Mutual inductance:**

$$
M = 0.921 log_(10)(frac(d_2, d_1)) space "mH/km"
$$

**Induced voltage:**

$$
|V_T| = 2 pi f M I space "volts/km"
$$

## 11. Hollow Conductors

A hollow conductor carries current only between inner radius $r_1$ and outer radius $r_2$. The internal inductance is derived by integrating the flux linkages from $r_1$ to $r_2$, accounting for the fractional turns ratio at each radius:

$$
frac(dif lambda_x, I) = mu_0 (frac(x^2 - r_1^2, r_2^2 - r_1^2))^(2) frac(1, 2 pi x) dif x
$$

After integration:

$$
L_("int") = frac(1, 2) times 10^(-7) dot frac(1, (r_2^2 - r_1^2)^2)[(r_2^4 - r_1^4) - 4 r_1^2(r_2^2 - r_1^2) + 4 r_1^4 ln(frac(r_2, r_1))] space "H/m"
$$

**Check:** Setting $r_1 = 0$ gives $L_("int") = frac(1, 2) times 10^(-7)$ H/m — the solid-conductor result. ✓

The external inductance uses the outer radius:

$$
L_("ext") = 2 times 10^(-7) ln(frac(D, r_2)) space "H/m"
$$

> **Important:** The internal part uses $ln$ (natural logarithm); the external part, once converted to the 0.4605 form, uses $log_(10)$. Mixing these is a common error.

---

## Worked Examples

### Example 1 — Loop inductance of a two-wire line

**Problem.** A single-phase line has two solid cylindrical conductors, each of radius 1 cm, spaced 2 m apart. Find the loop inductance per kilometre.

**Solution.**

$$
r' = 0.7788 times 0.01 = 0.007788 " m"
$$

$$
L = 0.921 log_(10)(frac(2, 0.007788)) = 0.921 log_(10)(256.8) = 0.921 times 2.4096 = 2.219 " mH/km"
$$

**Sanity check.** Typical overhead line loop inductances are 1–4 mH/km. ✓

---

### Example 2 — Per-phase inductance of a symmetrical three-phase line

**Problem.** A 3-phase, 50 Hz line has conductors of radius 1.5 cm at the vertices of an equilateral triangle of side 3 m. Find the inductance per phase per kilometre.

**Solution.**

$$
r' = 0.7788 times 0.015 = 0.01168 " m"
$$

$$
L = 0.4605 log_(10)(frac(3, 0.01168)) = 0.4605 log_(10)(256.8) = 0.4605 times 2.4096 = 1.110 " mH/km"
$$

**Sanity check.** This is exactly half the loop inductance of Example 1 (as expected: $0.921/2 = 0.4605$, and $D/r'$ is the same). ✓

---

### Example 3 — Self GMR of a 7-strand conductor

**Problem.** A stranded conductor has 7 identical strands (1 central + 6 surrounding), each of radius $r$. Find the self GMD $D_s$ and the ratio $D_s / (3 r)$.

**Configuration.** The 6 outer strands form a regular hexagon of side $2 r$ around the central strand.

**Distinct distances:**

| Distance | Value | Occurrences in product |
|:---:|:---:|:---:|
| $r'$ (diagonal) | $0.7788 r$ | 7 |
| Centre-to-outer and adjacent outer | $2 r$ | 24 |
| $D_(13)$ (skip-one outer) | $2 sqrt(3) r$ | 12 |
| $D_(14)$ (diametrically opposite) | $4 r$ | 6 |

**Power-sum check:** $7 + 24 + 12 + 6 = 49$, exactly matching the $7^2$ ordered self-and-mutual distance terms.

$$
D_s = [(r')^7 dot (2 r)^(24) dot (2 sqrt(3) r)^(12) dot (4 r)^(6)]^(1/49)
$$

With all 49 terms accounted for, the result is:

$$
D_s = 2.177 r
$$

**Ratio to overall radius** ($R = 3 r$):

$$
frac(D_s, R) = frac(2.177, 3) = 0.7257
$$

**Comment.** The ratio is less than 0.7788 (the solid-conductor value) because the strands are spread over a larger area, but it approaches 0.7788 as the number of strands increases.

---

### Example 4 — Inductance of a 2-conductor bundle

**Problem.** A 3-phase line uses 2-conductor bundles. Each conductor has radius 1.5 cm; bundle spacing is 40 cm; phase spacing (GMD) is 8 m. Find the inductance per phase per kilometre.

**Solution.**

$$
r' = 0.7788 times 0.015 = 0.01168 " m"
$$

Bundle GMR:

$$
D_s = sqrt(r' times d) = sqrt(0.01168 times 0.40) = sqrt(0.004672) = 0.06836 " m"
$$

Inductance:

$$
L = 0.4605 log_(10)(frac(8, 0.06836)) = 0.4605 log_(10)(117.0) = 0.4605 times 2.068 = 0.952 " mH/km"
$$

**Comparison.** Without bundling: $L = 0.4605 log_(10)(8/0.01168) = 1.306$ mH/km. The bundle reduces inductance by approximately **27 %**, which also reduces reactive power and improves voltage regulation.

---

### Example 5 — Mutual inductance between a power line and a telephone line

**Problem.** A single-phase 50 Hz power line carries 150 A. A telephone line runs parallel below it. The distances from power conductor $P_1$ to the two telephone conductors are $d_1 = 3$ m and $d_2 = 4$ m. Find the mutual inductance and the induced voltage per kilometre.

**Solution.**

$$
M = 0.921 log_(10)(frac(d_2, d_1)) = 0.921 log_(10)(frac(4, 3)) = 0.921 times 0.1249 = 0.115 " mH/km"
$$

$$
|V_T| = 2 pi times 50 times 0.115 times 10^(-3) times 150 = 5.42 " V/km"
$$

**Sanity check.** A few volts per kilometre is typical for parallel power-telephone exposure. If the telephone line is transposed, the net coupling is greatly reduced. ✓

---

### Example 6 — Double-circuit transposed line

**Problem.** A transposed double-circuit 3-phase line has conductor radius 2 cm and the following distances (in metres): $D = 4.07$, $d_1 = 7.5$, $d_2 = 9.17$, $d_3 = 10.96$. Find the inductance per phase per kilometre.

**Solution.**

$$
r' = 0.7788 times 0.02 = 0.01558 " m"
$$

Equivalent GMD:

$$
D_("eq") = 2^(1/6) D^(1/2) d_2^(1/3) d_1^(1/6) = 1.1225 times 2.017 times 2.094 times 1.398 = 6.611 " m"
$$

Equivalent self GMD:

$$
D_s = (r')^(1/2) d_1^(1/6) d_3^(1/3) = (0.01558)^(1/2) times (7.5)^(1/6) times (10.96)^(1/3)
$$

$$
= 0.1248 times 1.398 times 2.222 = 0.389 " m"
$$

Inductance:

$$
L = 0.4605 log_(10)(frac(6.611, 0.389)) = 0.4605 log_(10)(17.00) = 0.4605 times 1.230 = 0.567 " mH/km"
$$

**Sanity check.** Double-circuit lines typically have lower per-phase inductance than single-circuit lines. The value 0.567 mH/km is reasonable. ✓

---

## Configuration Comparison Table

| Configuration | Formula (mH/km) | Key quantities |
|:---|:---:|:---|
| Single-phase, 2-wire (loop) | $0.921 log_(10)(D/r')$ | $r' = 0.7788 r$ |
| 3-phase, equilateral | $0.4605 log_(10)(D/r')$ | per phase |
| 3-phase, transposed | $0.4605 log_(10)(D_m / D_s)$ | $D_m = (D_("ab") D_("bc") D_("ca"))^(1/3)$, $D_s = r'$ |
| 3-phase, double-circuit | $0.4605 log_(10)(D_("eq") / D_s)$ | $D_("eq") = 2^(1/6) D^(1/2) d_2^(1/3) d_1^(1/6)$ |
| Composite conductor X | $0.4605 log_(10)(D_m / D_("sx"))$ | mutual GMD / self GMD |
| 2-conductor bundle | $0.4605 log_(10)(D_m / sqrt(r' d))$ | $d$ = bundle spacing |

**Unifying pattern:** Every formula has the form $0.4605 log_(10)("mutual distance / self distance")$. The only thing that changes between configurations is how these distances are computed.

---

## Common Mistakes and How to Avoid Them

| Mistake | Consequence | Prevention |
|:---|:---|:---|
| Using $r$ instead of $r'$ | Overestimates inductance by ~12 % | Always substitute $r' = 0.7788 r$ |
| Using $ln$ where $log_(10)$ is needed (or vice versa) | Off by factor of 2.3026 | Check: 0.4605 formulas use $log_(10)$; $2 times 10^(-7)$ derivations use $ln$ |
| Forgetting the 0.4605 multiplier | Off by orders of magnitude | The factor encodes unit conversion; never omit it |
| Loop inductance vs per-conductor | Factor-of-2 error | Loop = $2 times$ per-conductor (for identical conductors) |
| Power-sum error in GMR | Wrong root index → wrong $D_s$ | Add all exponents; must equal $n^2$ |
| Confusing $D$ (phase spacing) with $d$ (inter-circuit distance) | Wrong $D_("eq")$ or $D_s$ in double-circuit | Label every distance on a diagram before substituting |
| Omitting the $frac(1, 2)$ in $L = frac(1, 2)(L_s - M)$ | Overestimates double-circuit inductance | The two parallel circuits halve the impedance |
| Unit mismatch (cm vs m, H vs mH) | Wrong numerical answer | Convert all lengths to metres before computing; final answer in mH/km |

---

```mermaid
flowchart TD
    A["Define conductor geometry\nand identify all distances"] --> B["Compute r' = 0.7788r for each conductor"]
    B --> C["Identify sub-conductors\nand group distances"]
    C --> D["Compute mutual GMD D_m\n= mn-th root of all mutual distances"]
    C --> E["Compute self GMD D_s\n= n²-th root of all intra-group distances\n(diagonal terms = r')"]
    D --> F["L = 0.4605 × log₁₀(D_m / D_s)"]
    E --> F
    F --> G{"Units check"}
    G -->|"mH/km ✓"| H["Final answer"]
    G -->|"H/m"| I["Multiply by 10⁶ to convert"]
    I --> H
```

---

## Rapid-Revision Checklist

- [ ] **Fictitious radius:** $r' = 0.7788 r$ — always use this in the 0.4605 formulas.
- [ ] **Per-conductor inductance:** $L = 0.4605 log_(10)(D / r')$ mH/km.
- [ ] **Loop inductance (identical conductors):** $L = 0.921 log_(10)(D / r')$ mH/km.
- [ ] **Generalised flux linkage:** $lambda_i = 0.4605 l[I_i log_(10)(1/r_i') + sum_(j!= i) I_j log_(10)(1/D_("ij"))]$ mWb/km.
- [ ] **Balanced currents:** $I_a + I_b + I_c = 0$; use this to eliminate one current from each flux linkage expression.
- [ ] **Symmetrical 3-phase:** $L = 0.4605 log_(10)(D/r')$ — all phases equal.
- [ ] **Transposed line:** $L = 0.4605 log_(10)(D_m / D_s)$; $D_m = (D_("ab") D_("bc") D_("ca"))^(1/3)$; $D_s = r'$.
- [ ] **Composite conductor:** $L = 0.4605 log_(10)(D_m / D_("sx"))$; mutual GMD $= (m n)$-th root; self GMD $= n^2$-th root.
- [ ] **Power-sum check:** Exponents in the GMR product must sum to $n^2$.
- [ ] **Bundle GMR:** 2-conductor $= sqrt(r' d)$; 3-conductor $= (r' d^2)^(1/3)$; 4-conductor $= (r' sqrt(2) d^3)^(1/4)$.
- [ ] **Double-circuit:** $D_("eq") = 2^(1/6) D^(1/2) d_2^(1/3) d_1^(1/6)$; $D_s = (r')^(1/2) d_1^(1/6) d_3^(1/3)$.
- [ ] **Mutual interference:** $M = 0.921 log_(10)(d_2/d_1)$ mH/km; $|V_T| = 2 pi f M I$ V/km.
- [ ] **Hollow conductor:** Internal inductance uses $ln$; external uses $log_(10)$ in the 0.4605 form.
- [ ] **Logarithm discipline:** The 0.4605 family uses $log_(10)$; derivations from Ampère's law use $ln$.
- [ ] **Units:** All distances in metres; final answer in mH/km; flux linkage in mWb/km.
