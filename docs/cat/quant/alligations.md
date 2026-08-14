---
title: "CAT Quant — Alligations"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 3
topic: "mixtures-alligation"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Chapter 3: Alligations — Complete Study Notes

## 1. Concept Map

```
                        ALLIGATIONS
                             |
        +--------------------+--------------------+
        |                                         |
   Weighted Average                        Repeated Replacement
   (Mixtures & Groups)                     (Dilution & Depreciation)
        |                                         |
        +---------+---------+                     |
        |         |         |                     |
   Ratio of    Unknown    Unknown              Final = Initial × (1 - r/t)^n
   Quantities  Average    Quantity
        |
   +----+----+
   |         |
  Prices    Percentages
  (₹/kg)    (Milk %, Profit %)
        |
   +----+----+
   |         |
  Speed     Interest
  (km/hr)   (SI/CI)
```

**Core Idea:** Alligation is a faster, visual way to compute weighted averages and to find the ratio in which two or more groups must be mixed to achieve a given average. It is an extension of Averages and applies to mixtures, profit/loss, speed, interest, and more.

---

## 2. Foundations: The Alligation Rule

### 2.1 The Weighted Average Formula

For two groups:
- Group 1: average = $A_1$, number of elements = $n_1$
- Group 2: average = $A_2$, number of elements = $n_2$
- Combined average = $A_w$

$$A_w = \frac{n_1 A_1 + n_2 A_2}{n_1 + n_2}$$

### 2.2 Deriving the Alligation Equation

Starting from the weighted average formula:

$$n_1 A_w + n_2 A_w = n_1 A_1 + n_2 A_2$$

Rearranging:

$$n_1 (A_w - A_1) = n_2 (A_2 - A_w)$$

$$\frac{n_1}{n_2} = \frac{A_2 - A_w}{A_w - A_1}$$

This is the **Alligation Equation**.

### 2.3 The Graphical Method (Standard Diagram)

The source (p. 247–248) uses a specific visual layout:

```
        A₁ (smaller)          A₂ (greater)
              \                 /
               \               /
                \             /
                 \           /
                  \         /
                   \       /
                    \     /
                     \   /
                      \ /
                   A_w (middle)
                      |
              n₁ : n₂ (below)
```

**Steps:**
1. Write the **weighted average** in the middle.
2. Write the **individual averages** on top — smaller on the left, greater on the right.
3. Write the **quantities** (or number of elements) below.
4. The ratio of quantities is the **inverse ratio** of the differences:
   - $n_1 : n_2 = (A_2 - A_w) : (A_w - A_1)$

**Key visual reference:** See `images/img-0.jpeg` (p. 247) for the basic diagram, and `images/img-4.jpeg` (p. 248) for the general graphical form.

---

## 3. Formulas with Symbol Meanings

| Formula | Meaning |
|---------|---------|
| $A_w = \frac{n_1 A_1 + n_2 A_2}{n_1 + n_2}$ | Weighted average of two groups |
| $\frac{n_1}{n_2} = \frac{A_2 - A_w}{A_w - A_1}$ | Alligation equation: ratio of quantities |
| $\text{Final} = \text{Initial} \times \left(1 - \frac{r}{t}\right)^n$ | Repeated replacement/dilution formula |
| $\text{Profit \%} = \frac{\text{Profit}}{\text{CP}} \times 100$ | Profit percentage |
| $\text{Average Speed} = \frac{\text{Total Distance}}{\text{Total Time}}$ | Average speed |

**Symbol meanings:**
- $A_1, A_2$: individual averages (prices, speeds, percentages, etc.)
- $A_w$: weighted average (combined average)
- $n_1, n_2$: quantities, number of elements, or weights
- $r$: amount replaced/drawn each operation
- $t$: total amount of the mixture
- $n$: number of times the operation is repeated

---

## 4. Fast CAT Methods

### 4.1 The Reverse Ratio Shortcut

When quantities are given and you need the average:

1. Write the ratio of quantities as given.
2. **Reverse** the ratio.
3. Divide the difference $(A_2 - A_1)$ in this reversed ratio.
4. Add the first part to $A_1$ (or subtract the second part from $A_2$).

**Example (Exp. 6, p. 248):** 5 kg superior sugar (₹18/kg) + 25 kg inferior sugar (₹12/kg).

- Ratio of quantities = 25 : 5 = 5 : 1
- Reversed ratio = 1 : 5
- Difference = 18 − 12 = 6
- Divide 6 in ratio 1 : 5 → 1 and 5
- Average = 12 + 1 = **₹13** (or 18 − 5 = **₹13**)

### 4.2 The Fraction Method for Ratios

When mixtures are given as ratios (e.g., milk:water = 3:4), convert to fractions of the same component, then use alligation.

**Example (Exp. 19, p. 251):** Two mixtures with alcohol:water = 3:4 and 5:6. Mixed to get 18 L with ratio 4:5.

- Fraction of alcohol: $\frac{3}{7} = \frac{297}{693}$, $\frac{5}{11} = \frac{315}{693}$, $\frac{4}{9} = \frac{308}{693}$
- Alligation: ratio first:second = 7 : 11
- First mixture = 7 L (since 7 + 11 = 18)

### 4.3 The Replacement Formula Shortcut

For repeated replacement problems, skip the step-by-step table and use:

$$\text{Final} = \text{Initial} \times \left(1 - \frac{r}{t}\right)^n$$

**Example (Exp. 21, p. 251):** 50 L milk; 5 L drawn and replaced with water, 3 times.

$$50 \times \left(1 - \frac{5}{50}\right)^3 = 50 \times \left(\frac{9}{10}\right)^3 = 36.45 \text{ L}$$

### 4.4 Option Checking

Many CAT questions can be solved faster by verifying options directly.

**Example (Q2, p. 255):** 175 vehicles, 520 wheels. Find two-wheelers.

- Option check: 90 × 2 + 85 × 4 = 180 + 340 = 520 ✓
- Answer: **90**

---

## 5. Worked Examples (Easy to Advanced)

### Level 1: Basic Weighted Average

**Exp. 1 (p. 247):** Average weight of class of 40 students = 30; class of 20 students = 15. Find combined average.

**Method 1 (Weighted Average):**
$$\frac{40 \times 30 + 20 \times 15}{40 + 20} = \frac{1200 + 300}{60} = 25$$

**Method 2 (Alligation):**
- Difference = 30 − 15 = 15
- Ratio of quantities = 40 : 20 = 2 : 1
- $x = 15 + \frac{2}{3} \times (30 - 15) = 15 + 10 = 25$
- OR: $x = 30 - \frac{1}{3} \times (30 - 15) = 30 - 5 = 25$

**Answer: 25**

---

### Level 2: Finding Ratio

**Exp. 2 (p. 248):** Averages 15 and 30, combined average 25. Find ratio of first to second class.

- Difference between 25 and 15 = 10
- Difference between 30 and 25 = 5
- Written diagonally opposite (see `images/img-1.jpeg`):
- Required ratio = 5 : 10 = **1 : 2**

---

### Level 3: Finding Unknown Quantity

**Exp. 3 (p. 248):** Average girls = 15, boys = 30, combined = 25. Boys = 12. Find girls.

- Ratio girls : boys = 5 : 10 = 1 : 2
- If boys = 12, girls = $\frac{1}{2} \times 12$ = **6**

---

### Level 4: Finding Unknown Average

**Exp. 4 (p. 248):** Ratio girls:boys = 1:2. Average boys = 30 kg, combined = 25 kg. Find average girls.

$$\frac{30 - 25}{25 - G} = \frac{x}{2x} = \frac{1}{2}$$

$$2(5) = 25 - G \Rightarrow G = 15 \text{ kg}$$

**Answer: 15 kg**

---

### Level 5: Price Mixture

**Exp. 7 (p. 248):** 16 L kerosene (₹12/L) + 5 L petrol (₹33/L). Find average price.

- Difference = 33 − 12 = 21
- Ratio of quantities = 16 : 5
- **Reverse** the ratio → 5 : 16
- Divide 21 in ratio 5 : 16 → 5 and 16
- Average = 12 + 5 = **₹17** (or 33 − 16 = **₹17**)

**Trap Alert:** Do NOT divide in the ratio 16:5. Always use the **inverse** ratio.

---

### Level 6: Average Speed

**Exp. 8 (p. 249):** 30 min at 25 km/hr + 20 min at 40 km/hr. Find average speed.

- Actual ratio of times = 3 : 2 → reverse = 2 : 3
- Divide (40 − 25) = 15 in ratio 2 : 3 → 6 and 9
- Average speed = 25 + 6 = **31 km/hr** (or 40 − 9 = **31 km/hr**)

**Key Note:** In time-speed-distance, only **time** and **speeds** are used in alligation. Distances are computed afterward.

---

### Level 7: Percentage Mixture

**Exp. 9 (p. 249):** 80% milk (28 L) + 60% milk (32 L). Find percentage in mixture.

- Difference = 80 − 60 = 20
- Ratio of quantities = 28 : 32 = 7 : 8
- $\frac{20 \times 7}{7 + 8} = \frac{140}{15} = 9.33$
- Required % = 60 + 9.33 = **69.33%**

---

### Level 8: Profit Percentage

**Exp. 10 (p. 249):** 30% hardware at 50% profit + 90% software at 10% profit. Find average profit.

- Actual ratio = 30 : 90 = 1 : 3 → reversed = 3 : 1
- Divide (50 − 10) = 40 in ratio 3 : 1 → 30 and 10
- Average = 10 + 30 × $\frac{1}{4}$ = 10 + 10 = **20%**
- OR: 50 − 40 × $\frac{3}{4}$ = 50 − 30 = **20%**

---

### Level 9: Distance Ratio (TSD)

**Exp. 11 (p. 249):** 150 km in 10 hours. Car speed = 20 km/hr, rickshaw = 12 km/hr. Find ratio of distances.

- Average speed = $\frac{150}{10}$ = 15 km/hr
- Alligation: rickshaw took $\frac{5}{8}$, car took $\frac{3}{8}$ of total time → ratio of times = 5 : 3
- Ratio of distances = (5 × 12) : (3 × 20) = 60 : 60 = **1 : 1**

**Key Notes:**
1. Distance never directly involves in alligation — only time and speeds.
2. Speeds written on top, corresponding time written below.

---

### Level 10: Cost Price with Profit

**Exp. 12 (p. 250):** Mixture sold at ₹3/kg with 25% profit. Cheaper rice = ₹2.10, costlier = ₹2.52. Find ratio.

- CP of mixture: $1.25x = 3 \Rightarrow x = 2.4$
- Alligation: ratio cheaper : costlier = 12 : 30 = **2 : 5**

**Note:** ₹1 = 100 paise; no change in ratio when converting.

---

### Level 11: Water Addition

**Exp. 16 (p. 250):** 50 L mixture with 80% milk. How much water to add to make water 50%?

- Initially: 40 L milk, 10 L water
- For 50% water: need 40 L water (equal to milk)
- Water to add = 40 − 10 = **30 L**

**Key Note:** Milk quantity remains constant; its percentage decreases as water increases.

---

### Level 12: Replacement with Water

**Exp. 17 (p. 250):** 50 L mixture, 20% water. 10 L drawn out, replaced with 10 L water. Find final water %.

**Chart method:**

| Step | Milk | Water | Total |
|------|------|-------|-------|
| Initial | 40 | 10 | 50 |
| 10 L drawn | 32 | 8 | 40 |
| Add 10 L water | 32 | 18 | 50 |

- Milk = $\frac{32}{50} \times 100$ = 64%
- Water = **36%**

---

### Level 13: Three Types of Milk

**Exp. 18 (p. 251):** Fat:non-fat ratios = 4:5, 5:6, 6:7. Mixed in equal quantity. Find final ratio.

- Fraction of fat: Parag = $\frac{4}{9}$, Amul = $\frac{5}{11}$, Nestle = $\frac{6}{13}$
- Common denominator (9 × 11 × 13 = 1287):
  - Parag: $\frac{572}{1287}$, Amul: $\frac{585}{1287}$, Nestle: $\frac{594}{1287}$
- Total fat = $\frac{572 + 585 + 594}{1287 \times 3} = \frac{1751}{3861}$
- Non-fat = 3861 − 1751 = 2110
- **Ratio = 1751 : 2110**

---

### Level 14: Simple Interest Application

**Exp. 20 (p. 251):** ₹6000 lent partly at 10% and 20% p.a. Total interest in 4 years = ₹3400. Find amount at 10%.

- Annual interest = $\frac{3400}{4}$ = ₹850
- Average rate = $\frac{850}{6000} = \frac{85}{6}\% = 14\frac{1}{6}\%$
- Alligation: ratio 10% : 20% = 35 : 25 = 7 : 5
- Amount at 10% = $\frac{7}{12} \times 6000$ = **₹3500**

---

### Level 15: Repeated Replacement — Finding Initial Quantity

**Exp. 23 (p. 251):** 15 L wine replaced with water, 3 times. Final wine:water = 343:169. Find initial wine.

- Wine left / initial = $\frac{343}{512}$ (since 343 + 169 = 512)
- $\frac{343}{512} = \left(\frac{7}{8}\right)^3 = \left(1 - \frac{15}{K}\right)^3$
- $1 - \frac{15}{K} = \frac{7}{8} \Rightarrow K$ = **120 L**

---

### Level 16: Finding Initial Amount

**Exp. 24 (p. 251):** 20% drawn and replaced, 4 times. 512 gm honey left. Find initial amount.

- $512 = K\left(1 - \frac{1}{5}\right)^4 = K\left(\frac{4}{5}\right)^4$
- $K = 512 \times \frac{625}{256}$ = **1250 gm = 1.25 kg**

---

## 6. Decision Rules

| Situation | Method to Use |
|-----------|---------------|
| Two groups, need combined average | Weighted average formula OR alligation |
| Two averages + combined average, need ratio | Alligation equation |
| Two averages + ratio, need unknown average | Alligation equation, solve for unknown |
| Prices of two items + quantities, need average price | Reverse ratio shortcut |
| Mixture ratios (e.g., milk:water), need final ratio | Fraction method (convert to common denominator) |
| Repeated replacement/dilution | Replacement formula: $\text{Final} = \text{Initial} \times (1 - r/t)^n$ |
| Profit % given, need CP of mixture | First find CP: $\text{CP} = \frac{\text{SP}}{1 + \text{Profit\%}}$ |
| Water added to change percentage | Track the constant component (milk) |
| Time-speed-distance | Use time and speeds in alligation; compute distances after |
| Simple/Compound Interest | Convert to annual rate, then alligation |

---

## 7. Common Traps

### Trap 1: Inverse Ratio Confusion
**Always divide in the inverse ratio of quantities** (cross proportion). The ratio of quantities is the inverse of the ratio of differences.

**Example:** 16 L kerosene + 5 L petrol. Ratio of quantities = 16:5. Divide the difference in ratio **5:16**, NOT 16:5.

### Trap 2: Distance vs. Time in TSD
Only **time** and **speeds** are used in alligation. Distances are computed afterward.

**Wrong:** Using distances directly in alligation.
**Right:** Find ratio of times first, then compute distances.

### Trap 3: Profit % on CP vs. SP
Always compute **CP first** when profit % is given.

**Example:** Sold at ₹3/kg with 25% profit.
- CP = $\frac{3}{1.25}$ = ₹2.4 (NOT ₹3 × 0.75)

### Trap 4: Replacement Formula — Pure Substance
The "initial amount" in the replacement formula refers to the **pure** substance being tracked.

**Example:** 50 L mixture with 20% water. When finding milk left, use initial milk = 40 L, not 50 L.

### Trap 5: Data Insufficiency
Some questions cannot be solved without additional data.

**Example (Q16, p. 256):** Class average cannot be found if neither total average nor ratio of boys:girls is given.

**Example (Q23, p. 257):** Oil mixture ratio cannot be determined with insufficient data.

### Trap 6: Water Addition — Constant Component
When adding water to a mixture, the **milk quantity remains constant**. Its percentage decreases as water increases.

**Wrong:** Adding water changes both components.
**Right:** Track milk; it stays the same.

---

## 8. Timed Strategy

### 8.1 Time Allocation (per question)

| Difficulty | Time Budget |
|------------|-------------|
| Easy (basic weighted average) | 30–45 seconds |
| Medium (ratio finding, price mixtures) | 45–60 seconds |
| Hard (repeated replacement, multi-step) | 60–90 seconds |
| Very Hard (CAT-level, multi-concept) | 90–120 seconds |

### 8.2 Step-by-Step Approach

1. **Identify the type:** Is it a weighted average, ratio finding, or replacement problem?
2. **Write down knowns:** List $A_1$, $A_2$, $A_w$, $n_1$, $n_2$ (or $r$, $t$, $n$).
3. **Choose the method:**
   - Two groups + need average → alligation diagram
   - Two averages + combined average → alligation equation
   - Repeated replacement → formula
4. **Check options:** For CAT questions, verify options when possible.
5. **Sanity check:** Is the answer between $A_1$ and $A_2$? (Weighted average must lie between the two individual averages.)

### 8.3 Speed Hacks

- **Reverse ratio shortcut:** Saves 10–15 seconds per question.
- **Replacement formula:** Avoids step-by-step tables.
- **Option checking:** For questions with clean numbers, verify options directly.
- **Fraction method:** Convert ratios to fractions with common denominators for quick comparison.

---

## 9. Final Revision Sheet

### Core Formulas

| Formula | Expression |
|---------|------------|
| Weighted Average | $A_w = \frac{n_1 A_1 + n_2 A_2}{n_1 + n_2}$ |
| Alligation Equation | $\frac{n_1}{n_2} = \frac{A_2 - A_w}{A_w - A_1}$ |
| Repeated Replacement | $\text{Final} = \text{Initial} \times \left(1 - \frac{r}{t}\right)^n$ |
| Profit % | $\frac{\text{Profit}}{\text{CP}} \times 100$ |
| Average Speed | $\frac{\text{Total Distance}}{\text{Total Time}}$ |

### Key Shortcuts

1. **Reverse ratio method:** Reverse the ratio of quantities, divide the difference, add to smaller average.
2. **Fraction method:** Convert ratios to fractions with common denominators.
3. **Replacement formula:** $\text{Final} = \text{Initial} \times (1 - r/t)^n$
4. **Option checking:** Verify options directly for clean-number questions.

### Critical Traps to Avoid

- ❌ Dividing in the wrong ratio (use inverse ratio)
- ❌ Using distances instead of times in TSD
- ❌ Confusing CP and SP in profit problems
- ❌ Using total mixture instead of pure substance in replacement
- ❌ Assuming data sufficiency when information is missing

### Quick Reference: Alligation Diagram

```
        A₁ (smaller)          A₂ (greater)
              \                 /
               \               /
                \             /
                 \           /
                  \         /
                   \       /
                    \     /
                     \   /
                      \ /
                   A_w (middle)
                      |
              n₁ : n₂ (below)
```

**Ratio rule:** $n_1 : n_2 = (A_2 - A_w) : (A_w - A_1)$

### Practice Pointers

- Master the **reverse ratio shortcut** — it's the fastest method for most questions.
- For **replacement problems**, always identify the pure substance being tracked.
- For **profit problems**, always compute CP first.
- For **TSD problems**, use time and speeds in alligation, not distances.
- **Practice with options** — many CAT questions can be solved faster by verification.

---

*Source: Quantitative Aptitude Quantum CAT by Sarvesh K. Verma, Chapter 3 (pp. 247–257)*
