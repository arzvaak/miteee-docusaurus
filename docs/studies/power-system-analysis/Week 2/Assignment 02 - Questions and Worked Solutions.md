---
title: "Assignment 02 - Transmission-Line Inductance"
aliases:
  - PSA Assignment 02
tags:
  - power-system-analysis
  - assignment
  - week-2
source_pdf: "Assignment-02_solution_PSA.pdf"
math_syntax: typst
---

# Assignment 02 - Transmission-Line Inductance

Source: [Assignment-02_solution_PSA.pdf](/content-assets/studies/power-system-analysis/Week%202/Assignment-02_solution_PSA.pdf)

Question images below are the supplied assignment questions, preserved as image embeds; each worked answer follows its question and uses native Typst math for Typst-Mate.

## Assignment Questions and Worked Solutions

### Assignment Q1

![Week 2 assignment question 1](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-01.png)

The inductance of a single-phase transmission line is proportional to the natural logarithm of the ratio of conductor spacing to the modified radius:

$$
L ∝ ln frac(d, r')
$$

For two cases with the same conductor but different spacings $d_1$ and $d_2 = 2 d_1$:

$$
L_1 ∝ ln frac(d, r'), space space L_2 ∝ ln frac(2 d, r')
$$

Since $ln frac(2 d, r') > ln frac(d, r')$, we know $L_2 > L_1$.

However, the logarithm is **not** a linear function, so:

$$
L_2 != 2 L_1
$$

**Conclusion:** The inductance increases when spacing is doubled, but it does not double.

> **Correct Answer: c**

> ⚠️ **Exam trap:** A common mistake is to assume doubling the spacing doubles the inductance. Because $L$ depends on $ln(d/r')$, doubling $d$ only adds $0.2 ln 2 approx 0.1386$ mH/km — not a factor of 2.


---

### Assignment Q2

![Week 2 assignment question 2](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-02.png)

**3-conductor configuration:**

The mutual distances between sub-conductors in a triangular bundle (sub-conductor spacing $= 2 r_1$) are:

$$
d_1 = 0.7788 r_1, space d_2 = d_3 = 2 r_1
$$

The self GMD (geometric mean radius of the bundle) is:

$$
"GMR"_3 = (d_1 dot d_2 dot d_3)^(1/3) = (0.7788 r_1 dot 2 r_1 dot 2 r_1)^(1/3) = 1.4605 r_1
$$

**4-conductor configuration:**

For a square bundle (sub-conductor spacing $= 2 r_2$):

$$
d_1 = 0.7788 r_2, space d_2 = d_3 = 2 r_2, space d_4 = sqrt((2 r_2)^2 + (2 r_2)^2) = 2.8284 r_2
$$

$$
"GMR"_4 = (d_1 dot d_2 dot d_3 dot d_4)^(1/4) = (0.7788 r_2 dot 2 r_2 dot 2 r_2 dot 2.8284 r_2)^(1/4) = 1.7229 r_2
$$

**Equating the two self GMDs** (same inductance requires same GMR):

$$
1.7229 r_2 = 1.4605 r_1
$$

$$
frac(r_1, r_2) = frac(1.7229, 1.4605) = 1.1797
$$

> **Correct Answer: b**

> ⚠️ **Exam trap:** For a square bundle, don't forget the diagonal distance $d_4 = sqrt(2) times (2 r)$; omitting it gives the wrong GMR.


---

### Assignment Q3

![Week 2 assignment question 3](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-03.png)

**Given:** Conductor diameter $= 1.6$ cm, so radius $r = 0.8$ cm. This is a split-phase single-phase line.

**Self GMD of the line:**

$$
D_s = sqrt(d_("AA") dot d_("AB")) = sqrt(0.7788 times 0.8 times 10^(-2) times 0.25) = 0.0395 " m"
$$

**Mutual GMD of the line:**

$$
D_m = root(4, d_("A'B") dot d_("AA'") dot d_("BB'") dot d_("AB'")) = root(4, 1.8 times 2.05 times 2.05 times 2.3) = 2.0423 " m"
$$

**Inductance of the split-phase single-phase line:**

The total inductance carries a factor of 2 for the two bundled conductors:

$$
L = 2 times 0.2 times ln(frac(D_m, D_s)) " mH/km"
$$

$$
L = 2 times 0.2 times ln(frac(2.0423, 0.0395))
$$

$$
L = 0.4 times ln(51.7038) = 0.4 times 3.9456
$$

$$
L = 1.5782 " mH/km"
$$

> **Correct Answer: d**

> ⚠️ **Exam trap:** For a split-phase (2-conductor bundled) single-phase line, remember the factor of **2** in front. Omitting it gives exactly half the correct answer.


---

### Assignment Q4

![Week 2 assignment question 4](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-04.png)

This is a two-circuit line where set-X has 3 sub-conductors per phase and set-Y has 2 sub-conductors per phase.

**Mutual GMD between sets X and Y:**

$$
"GMD"_m = root(6, D_(14) dot D_(15) dot D_(24) dot D_(25) dot D_(34) dot D_(35))
$$

Computing the phase-to-phase distances:

$$
D_(14) = D_(25) = 6 " m"
$$

$$
D_(15) = D_(24) = D_(35) = sqrt(3^2 + 6^2) = 6.7082 " m"
$$

$$
D_(34) = sqrt((3+3)^2 + 6^2) = 8.4853 " m"
$$

$$
"GMD"_m = root(6, 6^2 times 6.7082^3 times 8.4853) = 6.7215 " m"
$$

**Self GMD of set-X (3-conductor bundle):**

$$
"GMD"_("sX") = root(9, (0.7788 times 2 times 10^(-3))^3 times 3^4 times 6^2) = 0.2813 " m"
$$

$$
L_X = 0.2 times ln(frac("GMD"_m, "GMD"_("sX"))) = 0.2 times ln(frac(6.7215, 0.2813)) = 0.6347 " mH/km"
$$

**Self GMD of set-Y (2-conductor bundle):**

$$
"GMD"_("sY") = root(4, (0.7788 times 4 times 10^(-3))^2 times 3^2) = 0.0967 " m"
$$

$$
L_Y = 0.2 times ln(frac("GMD"_m, "GMD"_("sY"))) = 0.2 times ln(frac(6.7215, 0.0967)) = 0.8483 " mH/km"
$$

**Total inductance:**

$$
L_("Total") = L_X + L_Y = 0.6347 + 0.8483 = 1.483 " mH/km"
$$

> **Correct Answer: c**

> ⚠️ **Exam trap:** For asymmetric two-circuit lines, each circuit has its own $"GMD"_s$ — don't combine all sub-conductors into a single GMR unless every phase has the same bundle configuration.


---

### Assignment Q5

![Week 2 assignment question 5](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-05.png)

**Given:** Symmetric three-phase line with spacing $D$ between the central and each outer conductor, and $2 D$ between the two outer conductors. GMR $= 2$ cm $= 0.02$ m. Inductive reactance $X_L = 0.395$ Ω/km, $f = 50$ Hz.

**Mutual GMD:**

$$
D_m = (D times D times 2 D)^(1/3) = (2 D^3)^(1/3) = 2^(1/3) D = 1.26 D " m"
$$

**Inductance from the reactance:**

$$
X_L = 2 pi f L => L = frac(X_L, 2 pi f) = frac(0.395, 2 pi times 50) = 1.2573 times 10^(-3) " H/km" = 1.2573 " mH/km"
$$

**Using the inductance formula:**

$$
L = 0.2 times ln(frac(D_m, D_s)) " mH/km"
$$

$$
1.2573 = 0.2 times ln(frac(1.26 D, 0.02))
$$

$$
ln(frac(1.26 D, 0.02)) = frac(1.2573, 0.2) = 6.2865
$$

$$
frac(1.26 D, 0.02) = e^(6.2865) = 537.25
$$

$$
1.26 D = 10.745
$$

$$
D = 8.528 " m"
$$

> **Correct Answer: a**

> ⚠️ **Unit check:** Convert GMR from cm to m (0.02 m) before substituting. Mixing cm and m is the most common numerical error in inductance problems.


---

### Assignment Q6

![Week 2 assignment question 6](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-06.png)

**Given:** Conductor diameter $= 1.75$ cm, sub-conductor spacing $d = 45$ cm, phase spacing $D_("AB") = 16$ m, $D_("BC") = 16$ m, $D_("CA") = 32$ m.

**Radius:** $r = 0.875$ cm $= 0.00875$ m

**Self GMD of 3-conductor bundle:**

$$
D_s = (0.7788 r dot d^2)^(1/3) = (0.7788 times 0.875 times 10^(-2) times 0.45^2)^(1/3) = 0.1113 " m"
$$

**Mutual GMD:** Since $0.45 " m" ≪ 16 " m" < 32$ m, we approximate using phase-center distances:

$$
D_m = (D_("AB") dot D_("BC") dot D_("CA"))^(1/3) = (16 times 16 times 32)^(1/3) = 20.1587 " m"
$$

**Inductance:**

$$
L = 0.2 times ln(frac(D_m, D_s)) = 0.2 times ln(frac(20.1587, 0.1113)) = 1.0398 " mH/km"
$$

**Inductive reactance:**

$$
X_L = 2 pi f L = 2 pi times 50 times 1.0398 times 10^(-3)
$$

$$
X_L = 0.3267 " Ω/km"
$$

> **Correct Answer: a**

> ⚠️ **Exam trap:** Don't confuse sub-conductor spacing $d$ (in cm) with phase spacing $D$ (in m). Convert all distances to metres before computing the GMD.


---

### Assignment Q7

![Week 2 assignment question 7](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-07.png)

**Given:** Original design has asymmetric spacing with distances 8 m, 8 m, and 12 m. New design uses equilateral-like spacing $x$ with one side $2 x$. Both designs must have the same inductance, which means the same mutual GMD $D_m$.

**Original design:**

$$
D_(m 1) = (8 times 8 times 12)^(1/3) = 9.1577 " m"
$$

**New design:**

$$
D_(m 2) = (x dot x dot 2 x)^(1/3) = (2 x^3)^(1/3) = x dot 2^(1/3)
$$

**Equating the mutual GMDs** (since equal inductance implies equal $D_m$):

$$
x dot 2^(1/3) = 9.1577
$$

$$
x = frac(9.1577, 2^(1/3)) = frac(9.1577, 1.2599)
$$

$$
x = 7.2685 " m"
$$

> **Correct Answer: b**

> ⚠️ **Exam trap:** For the redesign with spacing $x$, $x$, and $2 x$, the mutual GMD is $(2 x^3)^(1/3) = x dot 2^(1/3)$, not simply $x$. Treating all three sides as equal gives the wrong answer.


---

### Assignment Q8

![Week 2 assignment question 8](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-08.png)

**Given:** Conductor radius $r = 1$ cm. Neutral wire $N$ is at distances $D_("AN") = 9$ m, $D_("BN") = 6$ m, $D_("CN") = 3$ m.

**Phase currents:**

$$
I_A = -20 + j 26 " A", space I_B = -30 + j 24 " A", space I_C = 50 - j 50 " A"
$$

**Flux linkage of the neutral wire:**

$$
lambda_N = 0.2[I_A ln frac(1, D_("AN")) + I_B ln frac(1, D_("BN")) + I_C ln frac(1, D_("CN"))] " mWb-T/km"
$$

$$
lambda_N = -0.2[2.1972(-20+j 26) + 1.7918(-30+j 24) + 1.0986(50-j 50)]
$$

Computing each term:

$$
2.1972(-20+j 26) = -43.944 + j 57.127
$$

$$
1.7918(-30+j 24) = -53.754 + j 43.003
$$

$$
1.0986(50-j 50) = 54.930 - j 54.930
$$

Sum:

$$
(-43.944 - 53.754 + 54.930) + j(57.127 + 43.003 - 54.930) = -42.768 + j 45.200
$$

$$
lambda_N = -0.2 times (-42.768 + j 45.200) = (8.5536 - j 9.0401) " mWb-T/km"
$$

**Induced voltage** ($f = 50$ Hz, length $= 35$ km):

$$
V_N = j omega lambda_N times 35 = j times 2 pi times 50 times 35 times (8.5536 - j 9.0401) times 10^(-3)
$$

Magnitude:

$$
|V_N| = 2 pi times 50 times 35 times sqrt(8.5536^2 + 9.0401^2) times 10^(-3) = 136.844 " V"
$$

Phase angle:

$$
angle V_N = 90° + arctan(frac(-9.0401, 8.5536)) = 90° - 46.584° = 43.416°
$$

$$
V_N = 136.844 angle 43.416° " V"
$$

> **Correct Answer: c**

> ⚠️ **Unit check:** The flux linkage formula gives mWb-T/km, so multiply by $omega times 10^(-3)$ for the correct voltage units. The length factor (35 km) is applied at the end.


---

### Assignment Q9

![Week 2 assignment question 9](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-09.png)

**Given:** Conductor diameter $= 2$ cm, sub-conductor spacing $d = 0.4$ m. Phase spacings: $D_("AB") = sqrt(3^2+4^2) = 5$ m, $D_("BC") = sqrt(4^2+5^2) = 6.4031$ m, $D_("CA") = 8$ m.

**Radius:** $r = 1$ cm $= 0.01$ m

**Self GMD of 2-conductor bundle:**

$$
D_s = (0.7788 r dot d)^(1/2) = (0.7788 times 0.01 times 0.4)^(1/2) = 0.0558 " m"
$$

**Mutual GMD:**

Since $0.4 " m" ≪ 3 " m" < 4 " m" < 5 " m"$, approximate using phase-center distances:

$$
D_m = (D_("AB") dot D_("BC") dot D_("CA"))^(1/3) = (5 times 6.4031 times 8)^(1/3) = 6.3506 " m"
$$

**Inductance:**

$$
L = 0.2 times ln(frac(D_m, D_s)) = 0.2 times ln(frac(6.3506, 0.0558)) = 0.9469 " mH/km"
$$

**Inductive reactance:**

$$
X_L = 2 pi f L = 2 pi times 50 times 0.9469 times 10^(-3)
$$

$$
X_L = 0.2975 " Ω/km"
$$

> **Correct Answer: b**

> ⚠️ **Exam trap:** For a 2-conductor bundle, the exponent in the GMR formula is $1/2$ (not $1/3$ as for a 3-conductor bundle). Using the wrong root gives an incorrect $D_s$.


---

### Assignment Q10

![Week 2 assignment question 10](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-10.png)

**Given:** Conductor radius $r = 2.5$ cm $= 0.025$ m. Modified radius $r' = 0.7788 times 0.025 = 0.0195$ m.

**Geometric distances:**

| Distance | Formula | Value |
|----------|---------|-------|
| $d_1$ | — | 7 m |
| $d_2$ | $sqrt(3^2 + 8^2)$ | 8.5440 m |
| $d_3$ | $sqrt(6^2 + 7^2)$ | 9.2195 m |
| $d_4$ | — | 9 m |
| $d_5$ | $sqrt(1^2 + 3^2)$ | 3.1623 m |
| $d_6$ | $3 + 3$ | 6 m |

**Self GMD:**

$$
D_("SA") = (r' dot d_3)^(1/2), space D_("SB") = (r' dot d_4)^(1/2), space D_("SC") = (r' dot d_3)^(1/2)
$$

$$
D_s = (D_("SA") dot D_("SB") dot D_("SC"))^(1/3) = [(r' d_3)^(1/2) dot (r' d_4)^(1/2) dot (r' d_3)^(1/2)]^(1/3)
$$

$$
D_s = (r'^(3/2) dot d_3 dot d_4^(1/2))^(1/3) = 0.4223 " m"
$$

**Mutual GMD:**

$$
D_("AB") = (d_2 dot d_5)^(1/2), space D_("BC") = (d_2 dot d_5)^(1/2), space D_("AC") = (d_1 dot d_6)^(1/2)
$$

$$
D_m = [(d_2 d_5)^(1/2) dot (d_2 d_5)^(1/2) dot (d_1 d_6)^(1/2)]^(1/3) = (d_2 dot d_5 dot (d_1 d_6)^(1/2))^(1/3) = 5.5945 " m"
$$

**Inductance and reactance:**

$$
L = 0.2 times ln(frac(5.5945, 0.4223)) = 0.5168 " mH/km"
$$

$$
X_L = 2 pi times 50 times 0.5168 times 10^(-3)
$$

$$
X_L = 0.1624 " Ω/km"
$$

> **Correct Answer: a**

> ⚠️ **Exam trap:** For a fully asymmetric line, compute each phase pair's GMD separately before taking the cube root. Do not assume $D_m = (d_1 dot d_2 dot d_3)^(1/3)$ where those are direct side distances.


---

### Assignment Q11

**Supplemental problem from the solution set.** The website source says the original question image is unavailable. The figure below is cropped from the supplied solutions PDF (page 9); it preserves the two line configurations without embedding the worked calculations.

![Assignment 02 Q11 diagrams from the solution page; original question image unavailable](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-11-figures.png)

The problem compares a 4-conductor bundled line (Fig. 10.1) with a single-conductor line (Fig. 10.2) and finds the single-conductor radius that gives the same inductance.

**Part 1 — 4-conductor bundled line (Fig. 10.1):**

Given: Conductor radius $r = 1$ cm, sub-conductor spacing $d = 30$ cm $= 0.30$ m. Phase spacings $D_("AB") = D_("BC") = 15$ m, $D_("CA") = 30$ m.

**Self GMD of 4-conductor bundle:**

$$
D_s = (0.7788 r dot sqrt(2) d^3)^(1/4) = (0.7788 times 10^(-2) times sqrt(2) times 0.30^3)^(1/4) = 0.1313 " m"
$$

**Mutual GMD:**

Since $0.30 " m" ≪ 15 " m" < 30$ m:

$$
D_m = (15 times 15 times 30)^(1/3) = 18.8988 " m"
$$

**Inductance:**

$$
L_1 = 0.2 times ln(frac(18.8988, 0.1313)) " mH/km"
$$

**Part 2 — Single-conductor line (Fig. 10.2):**

Let the single conductor have radius $x$ cm.

$$
D_s = 0.7788 times x times 10^(-2) " m"
$$

$$
D_m = (15 times 15 times 30)^(1/3) = 18.8988 " m" space "(same as Part 1)"
$$

$$
L_2 = 0.2 times ln(frac(18.8988, 0.7788 x times 10^(-2))) " mH/km"
$$

**Equating $L_1 = L_2$:**

Since the pre-factor (0.2) and $D_m$ are identical in both expressions, the arguments of the logarithms must be equal:

$$
frac(18.8988, 0.1313) = frac(18.8988, 0.7788 x times 10^(-2))
$$

$$
0.7788 x times 10^(-2) = 0.1313
$$

$$
x = frac(0.1313, 0.7788 times 10^(-2))
$$

$$
x = 16.86 " cm"
$$

> **Correct Answer: d**

> ⚠️ **Exam trap:** When equating two inductances with the same $D_m$, you only need $D_(s 1) = D_(s 2)$. Don't recalculate $D_m$ from scratch — it cancels directly.


---

### Assignment Q12

**Supplemental problem from the solution set.** The website source says the original question image is unavailable. This diagram is cropped from the supplied solutions PDF (page 10); the original question scan was not available.

![Assignment 02 Q12 schematic from the solution page; original question image unavailable](/content-assets/studies/power-system-analysis/Week%202/Assets/assignment-12-figure.png)

The problem computes the induced voltage in a telephone circuit located near a single-circuit power line with two conductors.

**Given:** Power line current $I = 150$ A (r.m.s.), $f = 50$ Hz. The power line conductors $P_1$ and $P_2$ are at known positions relative to telephone conductors $T_1$ and $T_2$.

**Computed distances:**

$$
d_3 = D_(P_1 T_2) = sqrt(3.5^2 + 4.5^2) = 5.7009 " m"
$$

$$
d_4 = D_(P_2 T_1) = sqrt(3.5^2 + 4.5^2) = 5.7009 " m"
$$

$$
d_5 = D_(P_1 T_1) = sqrt(2.5^2 + 3.5^2) = 4.3012 " m"
$$

$$
d_6 = D_(P_2 T_2) = sqrt(2.5^2 + 3.5^2) = 4.3012 " m"
$$

**Flux linkage of telephone line $T_1$:**

$$
lambda_(T_1) = 0.2(I ln frac(1, d_5) - I ln frac(1, d_4)) = 0.2 I ln frac(d_4, d_5)
$$

$$
= 0.2 times 150 times ln frac(5.7009, 4.3012) = 8.4519 " mWb-T/km"
$$

**Flux linkage of telephone line $T_2$:**

$$
lambda_(T_2) = 0.2 I ln frac(d_6, d_3) = 0.2 times 150 times ln frac(4.3012, 5.7009) = -8.4519 " mWb-T/km"
$$

**Total flux linkage of the telephone circuit:**

$$
lambda_T = lambda_(T_1) - lambda_(T_2) = 8.4519 - (-8.4519) = 16.9038 " mWb-T/km"
$$

**Induced voltage magnitude:**

$$
V_T = omega lambda_T = 2 pi times 50 times 16.9038 times 10^(-3)
$$

$$
V_T = 5.3105 " V/km"
$$

> **Correct Answer: c**

> ⚠️ **Exam trap:** The total flux linkage is $lambda_(T_1) - lambda_(T_2)$. Since $lambda_(T_2)$ is negative, the magnitudes **add** — don't subtract them. This is the most frequent sign error in telephone interference problems.
