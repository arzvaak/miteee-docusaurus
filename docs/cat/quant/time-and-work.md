---
title: "CAT Quant — Time and Work"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 8
topic: "time-work"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# CAT Quant — Time and Work

## 1. Concept Map

```
                        TIME AND WORK
                              |
        +---------------------+---------------------+
        |                     |                     |
   EFFICIENCY            PRODUCT              NEGATIVE
   (Rate of Work)        CONSTANCY            WORK
        |                (M₁D₁ = M₂D₂)        (Pipes & Leaks)
        |                     |                     |
   +----+----+          +-----+-----+          +-----+-----+
   |         |          |           |          |           |
% Efficiency  Inverse   Man-days    Man-hours  Inlet      Outlet
= 100/n     Proportion  M₁D₁=M₂D₂   M₁D₁H₁=   Pipes      Pipes
             Time ∝                  M₂D₂H₂    (+eff)     (-eff)
             1/Efficiency
```

---

## 2. Foundations

### 2.1 The Core Idea
Work is **directly proportional** to time, provided efficiency is constant. If a person completes a piece of work in $n$ days, then:

- **One day's work** = $\frac{1}{n}$
- **Percentage efficiency** = $\frac{1}{n} \times 100 = \frac{100}{n}\%$

> **Efficiency = $\frac{100}{n}\%$** where $n$ = days/hours required to complete the whole work.

### 2.2 The Golden Rule
> **Efficiency is inversely proportional to time.**

If A is twice as efficient as B, A takes **half** the time B requires.

- Ratio of days = **reciprocal** of ratio of efficiencies
- Efficiency × Time = **constant work**
- Whole work = **1** (fraction) or **100%** (percentage)

---

## 3. Key Formulas with Symbol Meanings

| Formula | Meaning |
|---------|---------|
| $\text{Efficiency} = \frac{100}{n}\%$ | $n$ = days/hours to complete work |
| $\text{Days} = \frac{100}{\text{Efficiency}}$ | Efficiency in percentage |
| $\text{Time together} = \frac{xy}{x+y}$ | A takes $x$ days, B takes $y$ days |
| $M_1 \times D_1 = M_2 \times D_2$ | $M$ = men, $D$ = days (work constant) |
| $M_1 \times D_1 \times H_1 = M_2 \times D_2 \times H_2$ | $H$ = hours per day |
| $\text{Net Efficiency} = \text{Inlet} - \text{Outlet}$ | For pipes and cisterns |
| $\text{Share of wages} \propto \text{Efficiency} \times \text{Time}$ | Wage distribution |

---

## 4. Efficiency Conversion Table (Page 379)

| Days required | Work of 1 day | Percentage efficiency |
|---|---|---|
| $n$ | $\frac{1}{n}$ | $\frac{100}{n}$ |
| 1 | 1 | 100% |
| 2 | $\frac{1}{2}$ | 50% |
| 3 | $\frac{1}{3}$ | 33.33% = $33\frac{1}{3}\%$ |
| 4 | $\frac{1}{4}$ | 25% |
| 5 | $\frac{1}{5}$ | 20% |
| 6 | $\frac{1}{6}$ | 16.66% = $16\frac{2}{3}\%$ |
| 7 | $\frac{1}{7}$ | 14.28% = $14\frac{2}{7}\%$ |
| 8 | $\frac{1}{8}$ | 12.5% |
| 9 | $\frac{1}{9}$ | 11.11% = $11\frac{1}{9}\%$ |
| 10 | $\frac{1}{10}$ | 10% |

**Note:** This table is "very similar to the percentage fraction table given in the chapter of percentage." Master it cold.

---

## 5. Fast CAT Methods

### Method 1: Percentage Efficiency (Recommended)
Convert each worker's time to percentage efficiency, add/subtract, then divide 100 by the net efficiency.

**Exp. 1:** A = 12 days, B = 6 days
- A = 8.33%, B = 16.66%
- Combined = 25%
- Time = $\frac{100}{25}$ = **4 days**

### Method 2: Unitary Method (Obsolete for CAT)
One day's work = $\frac{1}{12} + \frac{1}{6} = \frac{3}{12} = \frac{1}{4}$ → **4 days**

> **Author's note:** Only ~20–25 numbers are frequently used in this chapter; percentage efficiency can be memorised easily.

### Method 3: Product Constancy
When work is constant, if days decrease by $\frac{1}{n}$, men increase by $\frac{1}{n-1}$.

**Exp:** 20 persons × 7 days = 140 man-days. If days increase 3× (300%), men decrease by ¾ (75%) → **5 persons**.

### Method 4: Options Checking
For many CAT problems, verify options directly rather than solving algebraically.

---

## 6. Worked Examples (Easy to Advanced)

### 6.1 Basic Combined Work

**Example:** A = 10 days, B = 12 days, C = 15 days
- A = 10%, B = 8.33%, C = 6.66%
- Combined = 25%
- Time = $\frac{100}{25}$ = **4 days**

### 6.2 Efficiency Ratio Problems

**Example:** A is thrice as efficient as B; A takes 20 days.
- Efficiency ratio A:B = 3:1
- Days ratio A:B = 1:3
- B takes **60 days**

**Example:** P is thrice as efficient as Q; P finishes 60 days earlier.
- Days ratio P:Q = 1:3
- $3x - x = 60 \Rightarrow x = 30$
- P = **30 days**, Q = **90 days**

### 6.3 Negative Work (Pipes and Leaks)

**Example:** Tub fills in 20 min; leak empties in 60 min.
- Filling efficiency = 5%, emptying efficiency = 1.66%
- Net efficiency = 5 − 1.66 = 3.33%
- Time = $\frac{100}{3.33}$ = **30 minutes**

### 6.4 Product Constancy with Hours

**Example:** 25 men × 36 days × 10 hrs = $M_2$ × 20 × 6
- $M_2 = \frac{25 \times 36 \times 10}{20 \times 6}$ = **75 persons**

### 6.5 Multi-Part Workforce Problem

**Example:** 30 men, 100-day project; after 25 days only 20% done.
- Work done = 750 man-days = 20%
- (a) Remaining = 4× work, 3× days → need 4× days → **25 extra days**
- (b) $4(30 \times 25) = M_2 \times 75 \Rightarrow M_2 = 40$ → **increase 10 men**
- (c) New work = 3750 man-days; $\frac{3750}{30} = 125$ days → **50 extra days**
- (d) Work = 3000 man-days; available days = 50; $\frac{3000}{50} = 60$ → **increase 30 men**

### 6.6 Volume Problem

**Example:** Wall dimensions
$$\frac{L_1B_1H_1}{L_2B_2H_2} = \frac{M_1D_1T_1}{M_2D_2T_2}$$
$$\frac{150 \times 20 \times 12}{800 \times 15 \times 6} = \frac{16 \times 6 \times 25}{12 \times 8 \times D_2}$$
$D_2$ = **50 days**

### 6.7 "And" vs "Or" — Critical Distinction

- **"4 men and 8 women"** → relationship unknown
- **"4 men or 8 women"** → 4 men = 8 women (man is twice as efficient as woman)

**Example:** 6 boys + 8 women = 6 days; 14 boys + 10 women = 4 days
- $36B + 48W = 56B + 40W \Rightarrow 20B = 8W \Rightarrow W = 2.5B$
- $36B + 48(2.5B) = 156B$ = 1 day's work
- 1W + 1B = 3.5B; $\frac{156}{3.5}$ = **$44\frac{4}{5}$ days**

### 6.8 Comprehensive Example (Pages 382–383)

A = 12 days (8.33%), B = 15 days (6.66%), combined = 15%

| Case | Setup | Calculation | Answer |
|---|---|---|---|
| (a) Together | — | $\frac{100}{15}$ | **$6\frac{2}{3}$ days** |
| (b) Alternate, A starts | 12 days = 90%; 13th day A does 8.33%; B finishes 1.66% in $\frac{1}{4}$ day | $12 + 1 + \frac{1}{4}$ | **$13\frac{1}{4}$ days** |
| (c) Alternate, B starts | 12 days = 90%; 13th day B does 6.66%; A finishes 3.33% in $\frac{2}{5}$ day | $12 + 1 + \frac{2}{5}$ | **$13\frac{2}{5}$ days** |
| (d) A starts 2 days later | B alone 2 days = 13.33%; remaining 86.66% together | $2 + \frac{86.66}{15}$ | **$7\frac{7}{8}$ days** |
| (e) B starts 2 days later | A alone 2 days = 16.66%; remaining 83.33% together | $2 + \frac{83.33}{15}$ | **$7\frac{5}{8}$ days** |
| (f) A leaves 2 days before completion | B alone last 2 days = 13.33%; same as (d) | $2 + \frac{86.66}{15}$ | **$7\frac{7}{8}$ days** |
| (g) B leaves 2 days before completion | Same as (e) | — | **$7\frac{5}{8}$ days** |
| (h) A leaves 2 days before scheduled | Together $4\frac{2}{3}$ days = 70%; B alone does 30% in $\frac{30}{6.66} = 4\frac{1}{2}$ days | $4\frac{2}{3} + 4\frac{1}{2}$ | **$9\frac{1}{6}$ days** |
| (i) B leaves 2 days before scheduled | A alone does 30% in $\frac{30}{8.33} = 3\frac{3}{5}$ days | $4\frac{2}{3} + 3\frac{3}{5}$ | **$8\frac{4}{15}$ days** |
| (j) B does negative work | Combined = 8.33 + (−6.66) = 1.66% | $\frac{100}{1.66}$ | **60 days** |

> **Key insight from (f) vs (d):** Same result whether B works alone initially or at the end — "difference is only in order of days."

### 6.9 Complex Scheduling

**Example:** A = 10 days, B = 12 days, C = 15 days. A leaves after 2 days; B leaves 3 days before completion.
- Initial 2 days: A+B+C = 25% × 2 = 50%
- Last 3 days: C alone = 6.66% × 3 = 20%
- Remaining 30% done by B+C at 15%/day = 2 days
- **Total = 2 + 2 + 3 = 7 days**

### 6.10 Finding Individual Efficiency from Combined

**Example:** A+B = 14.28% (7 days), Ratio A:B = 2:1
- Efficiency A = $\frac{2}{3} \times 14.28 = 9.52\%$
- Days for A = $\frac{100}{9.52}$ = **10.5 days**
- **Alternative:** $\frac{1}{x} + \frac{1}{2x} = \frac{1}{7} \Rightarrow x = 10.5$

### 6.11 Wage Distribution

**Example:** Efficiency ratio A:B:C = 6:5:4
- C's share = $\frac{4}{15} \times 27000$ = **₹7200**

---

## 7. Decision Rules

| Scenario | Method to Use |
|----------|---------------|
| Individual times given | Percentage efficiency |
| Efficiency ratio given | Inverse for days ratio |
| "Or" statements | Convert to one worker type |
| "And" statements | Cannot determine relationship |
| Work constant | Product constancy ($M_1D_1 = M_2D_2$) |
| Work changes | Unitary method |
| Pipes and cisterns | Net = Inlet − Outlet |
| Alternating work | Sum 2-day cycles, handle remainder |
| "3 days before completion" | Last days only one worker |
| Options available | Check options directly |

---

## 8. Common Traps

1. **Efficiency vs Days ratio inversion** — Days ∝ 1/Efficiency. Always invert.
2. **"And" vs "Or"** — Critical distinction for efficiency relationships.
3. **Cannot determine** — When equation is independent of variable, answer is "cannot be determined."
4. **Minimum integer workers** — Always round up (e.g., 4.4 → 5 men).
5. **Bottleneck/restriction** — Critical path limits production.
6. **Workers cannot share work** — Last worker takes full time even if only partially needed.
7. **Outlet pipes negative efficiency** — Subtract from inlets.
8. **Product constancy limitation** — Only for constant work; use unitary method otherwise.
9. **Scheduled vs actual completion** — Different interpretations lead to different answers.
10. **Percentage efficiency prerequisite** — Must be fluent in percentage-fraction conversions.

---

## 9. Timed Strategy

### 0–30 seconds: Identify the Type
- Individual times given? → Efficiency method
- Efficiency ratios? → Inverse for days
- Man-days? → Product constancy
- Pipes? → Net efficiency
- Wages? → Proportional to work done

### 30–90 seconds: Apply the Fastest Method
- Convert to percentage efficiency
- Add/subtract as needed
- Divide 100 by net efficiency

### 90–120 seconds: Verify with Options
- Check if answer makes sense (between 8 and 9? → 8.4)
- Verify all conditions satisfied

### If Stuck Beyond 2 Minutes
- Mark and move on
- Return only if time permits

---

## 10. Final Revision Sheet

### Core Formulas
$$\text{Efficiency} = \frac{100}{n}\%$$
$$\text{Days} = \frac{100}{\text{Efficiency}}$$
$$\text{Time together} = \frac{xy}{x+y}$$
$$M_1D_1 = M_2D_2$$
$$M_1D_1H_1 = M_2D_2H_2$$

### Key Relationships
- Time ∝ 1/Efficiency
- Days ratio = reciprocal of efficiency ratio
- Work = Efficiency × Time
- Whole work = 1 or 100%

### Critical Distinctions
- "And" vs "Or"
- Scheduled vs actual completion
- Inlet vs outlet pipes

### Quick Reference Values
| Days | Efficiency |
|------|------------|
| 2 | 50% |
| 3 | 33.33% |
| 4 | 25% |
| 5 | 20% |
| 6 | 16.66% |
| 8 | 12.5% |
| 10 | 10% |
| 12 | 8.33% |
| 15 | 6.66% |
| 20 | 5% |

### Common Trap Phrases
- "3 days before completion" → last days only one worker
- "A leaves 2 days before scheduled" → different from "before completion"
- "4 men or 8 women" → equivalence known
- "4 men and 8 women" → relationship unknown

---

*Source: Quantitative Aptitude Quantum CAT by Sarvesh K. Verma, Chapter 8, Pages 378–414*
