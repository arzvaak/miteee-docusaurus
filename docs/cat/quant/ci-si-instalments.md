---
title: "CAT Quant — CI/SI/Instalments"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 7
topic: "simple-compound-interest"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Chapter 7: CI/SI/Instalments — Complete Study Notes

---

## 1. Concept Map

```
                        INTEREST
                           |
            +--------------+--------------+
            |                             |
        SIMPLE INTEREST            COMPOUND INTEREST
        (linear growth)            (exponential growth)
            |                             |
            |                             |
   +--------+--------+          +---------+---------+
   |        |        |          |         |         |
Principal  Rate    Time      Compounding  Depreciation Population
   |        |        |        Frequency    (decay)    (growth)
   |        |        |          |
   |        |        |    +-----+-----+
   |        |        |    |     |     |
   |        |        |  Yearly Half-  Quarterly
   |        |        |         yearly
   |        |        |
   +--------+--------+
            |
        INSTALMENTS
            |
      +-----+-----+
      |           |
   SI-based   CI-based
   instalments instalments
```

**Core idea:** SI charges interest only on the original principal. CI charges interest on the accumulated amount (principal + previous interest), creating a snowball effect.

---

## 2. Foundations — Definitions (Source p. 362)

| Term | Symbol | Definition |
|------|--------|------------|
| **Principal** | $P$ | The sum of money deposited or loaned; also called **capital** |
| **Interest** | $I$ | Money paid by the borrower, calculated on the principal |
| **Time** | $t$ or $n$ | Duration for which money is lent/borrowed |
| **Rate of Interest** | $r$ | Rate at which interest is charged on principal (usually % per annum) |
| **Amount** | $A$ | $A = P + \text{Interest}$ |
| **Simple Interest** | SI | Interest calculated uniformly only on the principal |
| **Compound Interest** | CI | For each period, interest is charged on the total previous amount (principal + interest so far) |

> **Key insight (source):** "Out of the five variables $A$, SI, $P$, $r$, $t$ we can find any one of these, if we have the requisite information about the four variables directly or indirectly individually or jointly."

---

## 3. Simple Interest (SI)

### 3.1 Core Formula

$$\text{SI} = \frac{P \times r \times t}{100}$$

$$\text{Amount} = P + \frac{Prt}{100} = P\left(1 + \frac{rt}{100}\right)$$

**Symbol meanings:**
- $P$ = Principal (initial sum)
- $r$ = Rate of interest per annum (in %)
- $t$ = Time in years
- SI = Simple Interest earned

### 3.2 Time-Rate Conversion Table (Source p. 363)

When the time period is given in months or when compounding frequency changes, convert both rate and time consistently:

| Given Rate | Given Time | Required Rate | Required Time |
|------------|------------|---------------|---------------|
| $r\%$ annual | $t$ years | $r/2\%$ half-yearly | $2t$ |
| $r\%$ annual | $t$ years | $r/4\%$ quarterly | $4t$ |
| $r\%$ annual | $t$ years | $r/12\%$ monthly | $12t$ |

**Example:** 12% p.a. for 2 years = 6% half-yearly for 4 half-years = 3% quarterly for 8 quarters = 1% monthly for 24 months.

---

## 4. Compound Interest (CI)

### 4.1 Core Formulas (Source p. 363)

$$\text{CI} = A - P$$

$$\text{Amount: } A = P\left(1 + \frac{r}{100}\right)^t$$

**Half-yearly compounding:**
$$A = P\left(1 + \frac{r/2}{100}\right)^{2t}$$

**Quarterly compounding:**
$$A = P\left(1 + \frac{r/4}{100}\right)^{4t}$$

### 4.2 CI − SI Difference Formulas

These are **critical CAT shortcuts**:

**For 2 years:**
$$\text{CI} - \text{SI} = P\left(\frac{r}{100}\right)^2$$

**For 3 years:**
$$\text{CI} - \text{SI} = P\left(\frac{r}{100}\right)^2\left(\frac{r}{100} + 3\right)$$

**For the $n^{th}$ year only:**
$$\text{CI} - \text{SI} = \frac{Pr}{100}\left[\left(1 + \frac{r}{100}\right)^{n-1} - 1\right]$$

### 4.3 Ratio of Yearly Increases

$$\frac{\text{increase in amount in } n^{th} \text{ year}}{\text{increase in amount in } (n+1)^{th} \text{ year}} = \frac{100}{100+r}$$

$$\frac{\text{decrease in amount in } n^{th} \text{ year}}{\text{decrease in amount in } (n+1)^{th} \text{ year}} = \frac{100}{100-r}$$

**Why this works:** The increase in any year is $r\%$ of the amount at the start of that year. The amount at the start of year $n+1$ is $(1 + r/100)$ times the amount at the start of year $n$.

---

## 5. Depreciation and Population

### 5.1 Depreciation (Value Decay)

$$V_f = V_i\left(1 - \frac{r}{100}\right)^t$$

- $V_i$ = Initial value
- $V_f$ = Final (depreciated) value
- $r$ = rate of decrease (% per period)
- $t$ = time period

### 5.2 Population Growth/Decay

**Population increases:**
$$P = P_0\left(1 + \frac{r}{100}\right)^n$$

**Population decreases:**
$$P = P_0\left(1 - \frac{r}{100}\right)^n$$

---

## 6. Instalments

### 6.1 Instalments under Simple Interest (Source p. 363–364)

Let $A$ = total amount, $r$ = rate, $x$ = each instalment, $n$ = number of instalments:

$$A = \left[x + \left(x + \frac{x \times r \times 1}{100}\right) + \left(x + \frac{x \times r \times 2}{100}\right) + \dots + \left(x + \frac{x \times r \times n}{100}\right)\right]$$

Also: $A = P + \frac{P \times n \times r}{100}$

Equating both:
$$P + \frac{P \times n \times r}{100} = \left[x + \left(x + \frac{x \times r \times 1}{100}\right) + \dots + \left(x + \frac{x \times r \times n}{100}\right)\right]$$

**Interpretation:** Each instalment $x$ paid at the end of year $k$ carries interest for $k$ years. The sum of all instalments (with their accumulated interest) must equal the total amount due.

### 6.2 Instalments under Compound Interest

$$P = \left[\frac{x}{\left(1 + \frac{r}{100}\right)} + \frac{x}{\left(1 + \frac{r}{100}\right)^2} + \dots + \frac{x}{\left(1 + \frac{r}{100}\right)^n}\right]$$

Also: $A = P\left(1 + \frac{r}{100}\right)^n$

Therefore:
$$P\left(1 + \frac{r}{100}\right)^n = \left[x + x\left(1 + \frac{r}{100}\right) + x\left(1 + \frac{r}{100}\right)^2 + \dots + x\left(1 + \frac{r}{100}\right)^n\right]$$

**Interpretation:** The present value of each future instalment (discounted at rate $r$) sums to the principal. Equivalently, the future value of the principal equals the sum of future values of all instalments.

> **Critical note (source, Exp 20):** "In the left hand side and right hand side given amounts are equal. Each amount is equal to the total amount payable after 5 months." — Always equate amounts at the **same point in time**.

---

## 7. Important Amounts Table (Source p. 366)

**Amount for ₹100 at various rates (CI):**

| Rate | 1 year | 2 years | 3 years | 4 years | 5 years |
|------|--------|---------|---------|---------|---------|
| 5% | 105 | 110.25 | 115.7625 | 121.550625 | 127.62815625 |
| 6% | 106 | 112.36 | 119.1016 | 126.247696 | 133.82255776 |
| 8% | 108 | 116.64 | 125.9712 | 136.048896 | 146.93280768 |
| 10% | 110 | 121.00 | 133.1000 | 146.4100 | 161.051 |
| 12% | 112 | 125.44 | 140.4928 | 157.351936 | 176.23416832 |
| 15% | 115 | 132.25 | 152.0875 | 174.900625 | 201.13571875 |
| 20% | 120 | 144.00 | 172.80 | 207.36 | 248.832 |
| 25% | 125 | 156.25 | 195.3125 | 244.140625 | 305.17578125 |
| 30% | 130 | 169.00 | 219.70 | 285.61 | 371.293 |
| 50% | 150 | 225.00 | 337.50 | 506.25 | 759.375 |

**How to use:** For any principal $P$, the amount is $P/100 \times$ (table value). For example, ₹5000 at 10% for 3 years = $5000/100 \times 133.1 = ₹6655$.

---

## 8. Fast CAT Methods

### Method 1: Unitary Method for SI (Source Exp 4)

**Problem:** Amount becomes ₹1344 in 3 years and ₹1536 in 7 years. Find principal.

**Steps:**
1. Difference in amounts = ₹1536 − ₹1344 = ₹192
2. This difference is interest for (7 − 3) = 4 years
3. Annual interest = ₹192/4 = ₹48
4. Interest for 3 years = ₹48 × 3 = ₹144
5. Principal = ₹1344 − ₹144 = ₹1200

**When to use:** When amounts at two different times are given, and you need principal or rate.

### Method 2: SI Proportionality (Source Exp 6)

**Problem:** Money triples in 12 years at SI. When will it become 5 times?

**Steps:**
1. Tripling means SI = 2P
2. Becoming 5 times means SI = 4P (double the SI)
3. Since SI ∝ time (at fixed rate), time doubles: 24 years

**When to use:** Questions about "times the principal" at SI.

### Method 3: Option Checking (Source Exp 5, 17; L1 Q12, 27, 35)

**Problem:** Find the sum that amounts to ₹15900 at 6% p.a. for 1 year.

**Steps:**
1. Try options: For ₹15000: SI = 15000 × 6/100 = 900
2. Amount = 15000 + 900 = 15900 ✓

**When to use:** When options are given and direct calculation is tedious. Especially useful for CI problems where you can successively multiply.

### Method 4: Reverse Process for CI−SI (Source L1 Q32)

**Problem:** CI − SI for 2 years = ₹40 at 10%. Find principal.

**Steps:**
1. CI − SI (2 yrs) = $P(r/100)^2$
2. $40 = P(10/100)^2 = P(0.01)$
3. $P = 4000$

**When to use:** When the difference between CI and SI is given directly.

### Method 5: Consecutive Year CI Ratio (Source L1 Q36)

**Problem:** CI for 2nd year = ₹2178, CI for 3rd year = ₹2395.8. Find rate.

**Steps:**
1. Difference = 2395.8 − 2178 = 217.8
2. This difference = interest on 2nd year's opening amount = $r\%$ of 2178
3. $r = 217.8/2178 \times 100 = 10\%$

**When to use:** When CI for consecutive years is given.

### Method 6: Alligation for Mixed Rates (Source L1 Q12, 49)

**Problem:** Two parts of ₹625 are lent at 5% and 10% such that total interest is equal. Find the parts.

**Steps:**
1. For equal interest: $P_1 \times 5 \times 2 = P_2 \times 10 \times 4$
2. $P_1 : P_2 = 40 : 10 = 4 : 1$
3. Second sum = $625 \times 1/5 = ₹125$

**When to use:** When parts of a sum are lent at different rates and conditions on total interest are given.

### Method 7: Table Method for CI vs SI (Source L1 Q50)

**Problem:** Difference between CI and SI for 4th year = ₹7280 at 20%. Find P.

**Steps:**
1. For P = 10000: CI 4th year = 3456, SI 4th year = 2000, difference = 1456
2. For actual difference 7280: $P = 10000 \times 7280/1456 = 50000$

**When to use:** When the difference for a specific year (not total) is given.

### Method 8: 100-Base Method (Source L2 Q4)

**Problem:** Compare CI and SI for 3 years at 30%.

**Steps:**
1. Take P = 100
2. SI = 100 × 30 × 3/100 = 90
3. CI = 100[(1.3)³ − 1] = 100[2.197 − 1] = 119.7
4. % increase of CI over SI = (119.7 − 90)/90 × 100 = 33%

**When to use:** For percentage comparisons between CI and SI.

---

## 9. Worked Examples (Easy → Advanced)

### Example 1: Basic SI (Source Exp 1)

**Problem:** Find SI and amount on ₹1000 at 12% for 5 years.

**Solution:**
$$\text{SI} = \frac{1000 \times 12 \times 5}{100} = ₹600$$
$$\text{Amount} = 1000 + 600 = ₹1600$$

### Example 2: Multiple Principals (Source Exp 2)

**Problem:** Find SI on ₹800 at 7% for 2 years + ₹700 at 16% for 2 years + ₹500 at 4% for 2 years.

**Solution:**
$$\text{SI} = \frac{800 \times 7 \times 2}{100} + \frac{700 \times 16 \times 2}{100} + \frac{500 \times 4 \times 2}{100}$$
$$= 112 + 224 + 40 = ₹376$$

### Example 3: Doubling/Trebling at SI (Source Exp 3)

**Problem:** A sum doubles in 10 years at SI. When will it treble?

**Solution:**
1. Doubling: SI = P, so $P = P \times r \times 10/100$ → $r = 10\%$
2. Trebling: SI = 2P, so $2P = P \times 10 \times t/100$ → $t = 20$ years

### Example 4: Basic CI (Source Exp 7)

**Problem:** Find CI on ₹10000 at 10% for 3 years.

**Solution:**
$$A = 10000(1.1)^3 = 10000 \times 1.331 = ₹13310$$
$$\text{CI} = 13310 - 10000 = ₹3310$$

### Example 5: Doubling in CI (Source Exp 8)

**Problem:** A sum doubles in 3 years at CI. How many times in 9 years?

**Solution:**
$$2P = P(1 + r/100)^3 \implies 2 = (1 + r/100)^3$$
In 9 years: $(1 + r/100)^9 = [(1 + r/100)^3]^3 = 2^3 = 8$ times

### Example 6: Half-Yearly Compounding (Source Exp 9)

**Problem:** ₹20000 at 20% p.a. compounded half-yearly for 2 years.

**Solution:**
$$A = 20000\left(1 + \frac{10}{100}\right)^4 = 20000(1.1)^4 = 20000 \times 1.4641 = ₹29282$$

### Example 7: Equivalent SI Rate (Source Exp 10)

**Problem:** Find the equivalent SI rate for 10% p.a. compounded half-yearly.

**Solution:**
$$A = 12000(1.05)^2 = 12000 \times 1.1025 = ₹13230$$
$$\text{SI} = 13230 - 12000 = 1230$$
$$r = \frac{1230 \times 100}{12000 \times 1} = 10.25\%$$

### Example 8: Interest for a Specific Year (Source Exp 11)

**Problem:** Find CI for the 3rd year on ₹1000 at 50%.

**Solution:**
1. Amount after 2 years = $1000(1.5)^2 = ₹2250$
2. Interest for 3rd year = $2250 \times 50\% = ₹1125$

### Example 9: CI − SI Relationship (Source Exp 12)

**Problem:** CI − SI for 2 years = ₹20 at 20%. Find principal.

**Solution:**
$$\text{CI} - \text{SI} = P(r/100)^2$$
$$20 = P(20/100)^2 = P(0.04)$$
$$P = ₹500$$

**Verification:** First year interest = 500 × 20% = 100. Interest on first year's interest = 100 × 20% = 20 ✓

### Example 10: Population Growth (Source Exp 13)

**Problem:** Population of a city is 1,000,000. It grows at 12% p.a. Find population after 3 years.

**Solution:**
$$P = 1{,}000{,}000(1.12)^3 = 1{,}000{,}000 \times 1.404928 = 1{,}404{,}928$$

### Example 11: Depreciation (Source Exp 14)

**Problem:** A machine worth ₹200,000 depreciates at 25% p.a. Find value after 3 years.

**Solution:**
$$V = 200{,}000(0.75)^3 = 200{,}000 \times 0.421875 = ₹84{,}375$$

### Example 12: CI − SI for 3 Years (Source Exp 15)

**Problem:** CI − SI for 3 years = ₹152 at 4%. Find principal.

**Solution:**
$$\text{CI} - \text{SI} = P(r/100)^2(r/100 + 3)$$
$$152 = P(4/100)^2(4/100 + 3) = P(1/25)(76/25) = P(76/625)$$
$$P = 152 \times 625/76 = ₹1250$$

### Example 13: Ratio of Yearly Increases (Source Exp 16)

**Problem:** Find the ratio of increase in amount in the 4th year to the 5th year at 20%.

**Solution:**
$$\frac{\text{Increase in 4th year}}{\text{Increase in 5th year}} = \frac{100}{100+20} = \frac{100}{120} = \frac{5}{6}$$

### Example 14: Finding Rate (Source Exp 17)

**Problem:** ₹12000 becomes ₹20736 in 3 years at CI. Find rate.

**Solution:**
$$20736 = 12000(1 + r/100)^3$$
$$\frac{20736}{12000} = \frac{1728}{1000} = \frac{12^3}{10^3} = \left(\frac{12}{10}\right)^3$$
$$1 + r/100 = 12/10 \implies r = 20\%$$

**Alternative (option checking):** $12000 \times 1.2 = 14400 \rightarrow 14400 \times 1.2 = 17280 \rightarrow 17280 \times 1.2 = 20736$ ✓

### Example 15: Finding Principal (Source Exp 18)

**Problem:** Amount = ₹14641 at 10% for 4 years. Find principal.

**Solution:**
$$14641 = P(11/10)^4$$
$$P = 14641 \times (10/11)^4 = 14641 \times 10000/14641 = ₹10000$$

### Example 16: CI Instalments (Source Exp 19)

**Problem:** ₹10000 at 8% to be repaid in 3 equal annual instalments. Find each instalment.

**Solution (Method 1 — Present Value):**
$$10000 = x\left[\frac{25}{27} + \left(\frac{25}{27}\right)^2 + \left(\frac{25}{27}\right)^3\right]$$
$$10000 = x \times \frac{25}{27}\left[1 + \frac{25}{27} + \frac{625}{729}\right]$$
$$x = ₹3880.335$$

**Solution (Method 2 — Future Value):**
$$10000(1.08)^3 = x[1 + 1.08 + (1.08)^2]$$
$$12597.12 = x[3.2464]$$
$$x = ₹3880.335$$

### Example 17: Instalment with Down Payment (Source Exp 20)

**Problem:** Scooty costs ₹19200 cash or ₹4800 down + 5 monthly instalments at 12% p.a. Find each instalment.

**Solution:**
1. Balance after down payment = 19200 − 4800 = ₹14400
2. Equate amounts at the end of 5 months:
   - LHS: $14400(1 + 12 \times 5/1200) = 14400(1.05) = ₹15120$
   - RHS: $x + x(1 + 12/1200) + x(1 + 24/1200) + x(1 + 36/1200) + x(1 + 48/1200)$
   - RHS: $x[5 + (12+24+36+48)/1200] = x[5 + 120/1200] = x[5.1]$
3. $15120 = 5.1x \implies x = ₹2964.70$

---

## 10. Decision Rules

| Situation | Use |
|-----------|-----|
| SI with amounts at two times | Unitary method (difference ÷ time difference) |
| "Times the principal" at SI | SI ∝ time; scale proportionally |
| CI for full periods | $A = P(1 + r/100)^t$ |
| CI for part of a period | Use SI for the fractional part on top of CI for whole periods |
| CI − SI for 2 years | $P(r/100)^2$ |
| CI − SI for 3 years | $P(r/100)^2(r/100 + 3)$ |
| CI − SI for nth year | $\frac{Pr}{100}[(1+r/100)^{n-1} - 1]$ |
| Consecutive year CI given | Difference = interest on previous year's amount |
| Instalments (CI) | Present value of instalments = Principal |
| Instalments (SI) | Sum of instalments with interest = Total amount |
| Depreciation | $V_f = V_i(1 - r/100)^t$ |
| Population growth | $P = P_0(1 + r/100)^n$ |
| Mixed rates (alligation) | Weighted average approach |
| Options available | Try option checking (successive multiplication) |

---

## 11. Common Traps

### Trap 1: 16⅔% ≠ Doubling in 5 Years (Source L1 Q16)
- 16⅔% for 5 years: SI = $P \times 5 \times (50/3)/100 = 5P/6 \neq P$ → **wrong**
- Only 20% for 5 years gives SI = P (doubling)

### Trap 2: CI Always > SI (Source L1 Q47)
For the same principal, rate, and time, CI always gives higher returns than SI (for $t > 1$). For $t = 1$, they are equal.

### Trap 3: Instalment Timing (Source Exp 20)
Always equate amounts at the **same point in time** (usually the end of the instalment period). Never compare amounts at different times directly.

### Trap 4: Profit Ratio ≠ Investment Ratio (Source L2 Q16)
When time periods differ, profit ratio = (investment × time) ratio, not just investment ratio.

### Trap 5: Rate Not Given (Source L2 Q17)
If the rate is not specified, you cannot determine the difference between CI and SI. Mark "data insufficient."

### Trap 6: Source Inconsistency (Source L2 Q20)
The answer key says CAGR ≈ 14.289% but option-checking gives ~20%. Be alert: if your calculation conflicts with the key, re-verify. In the actual CAT, trust your calculation if it matches an option.

### Trap 7: Half-Yearly vs Yearly Rate
When compounding is half-yearly, divide the rate by 2 AND multiply the time by 2. Both must change.

### Trap 8: "None of These" Options
Some answers may not appear in options (e.g., L2 Q8: answer 26.66% not in options). Check option (d) "none of these" when your calculation doesn't match.

---

## 12. Timed Strategy

### Suggested Time Allocation (per question)

| Question Type | Time Budget |
|---------------|-------------|
| Direct formula (SI/CI) | 30–45 seconds |
| CI − SI difference | 45–60 seconds |
| Instalments | 60–90 seconds |
| Depreciation/Population | 30–45 seconds |
| Mixed concepts | 60–90 seconds |

### Order of Attack

1. **Scan for direct formula questions** — solve these first (30–40% of questions)
2. **Identify CI − SI difference questions** — use the shortcut formulas
3. **Instalment questions** — attempt only if comfortable with present value/future value concepts
4. **Skip and return** — if a question takes >90 seconds, mark and move on

### Speed Hacks

1. **Memorize the ₹100 table** (Section 7) — instantly compute amounts for common rates
2. **Know powers of common ratios:**
   - $1.1^2 = 1.21$, $1.1^3 = 1.331$, $1.1^4 = 1.4641$
   - $1.2^2 = 1.44$, $1.2^3 = 1.728$, $1.2^4 = 2.0736$
   - $1.25^2 = 1.5625$, $1.25^3 = 1.953125$
3. **For "times" questions:** If money doubles in $n$ years at CI, it becomes $2^k$ times in $kn$ years
4. **For SI "times" questions:** If money becomes $m$ times in $t$ years, it becomes $(m-1)k + 1$ times in $kt$ years

---

## 13. Final Revision Sheet

### Formula Summary

| Concept | Formula |
|---------|---------|
| Simple Interest | $\text{SI} = \frac{Prt}{100}$ |
| SI Amount | $A = P(1 + \frac{rt}{100})$ |
| CI Amount | $A = P(1 + \frac{r}{100})^t$ |
| CI (half-yearly) | $A = P(1 + \frac{r/2}{100})^{2t}$ |
| CI (quarterly) | $A = P(1 + \frac{r/4}{100})^{4t}$ |
| CI − SI (2 yrs) | $P(\frac{r}{100})^2$ |
| CI − SI (3 yrs) | $P(\frac{r}{100})^2(\frac{r}{100} + 3)$ |
| CI − SI (nth yr) | $\frac{Pr}{100}[(1+\frac{r}{100})^{n-1} - 1]$ |
| Depreciation | $V_f = V_i(1 - \frac{r}{100})^t$ |
| Population growth | $P = P_0(1 + \frac{r}{100})^n$ |
| Population decay | $P = P_0(1 - \frac{r}{100})^n$ |
| Instalments (CI) | $P = \sum \frac{x}{(1+r/100)^k}$ |
| Instalments (SI) | $A = \sum [x + \frac{xrk}{100}]$ |

### Key Numbers to Memorize

| Rate | 2-yr factor | 3-yr factor |
|------|-------------|-------------|
| 5% | 1.1025 | 1.157625 |
| 10% | 1.21 | 1.331 |
| 12% | 1.2544 | 1.404928 |
| 15% | 1.3225 | 1.520875 |
| 20% | 1.44 | 1.728 |
| 25% | 1.5625 | 1.953125 |

### Quick Checks

- **CI ≥ SI** always (for $t \geq 1$)
- **CI = SI** when $t = 1$ or $r = 0$
- **Doubling time at SI:** $t = 100/r$ years
- **Doubling time at CI:** $t = \log(2)/\log(1 + r/100)$ years
- **For small rates (r < 10%),** CI ≈ SI + (interest on first year's interest)

### Common Rates for Doubling (CI)

| Rate | Doubling Time (approx) |
|------|------------------------|
| 10% | ~7.3 years |
| 12% | ~6.1 years |
| 15% | ~5 years |
| 20% | ~3.8 years (4 years) |
| 25% | ~3.1 years |

---

*End of Chapter 7 Study Notes*
