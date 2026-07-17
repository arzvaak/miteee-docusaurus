---
title: Simple and Compound Interest
description: A concise SSC CGL lesson on simple interest, compound growth, changing rates, compounding periods, depreciation, effective rates, and SI–CI differences.
tags: [ssc-cgl, quantitative-aptitude, simple-interest, compound-interest]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for simple interest, compound interest, and growth](/img/ssc-cgl/simple-compound-interest-map.svg)
*Use linear addition for simple interest, multiplier powers for compound interest, and match rate periods to compounding periods.*

Interest questions are direct when rate and time units already match. Mark and return when instalments occur at different dates or several rate changes require a longer cash-flow equation.

## 1. Build Simple Interest from Principal-Time

For principal $P$, annual rate $r\%$, and time $t$ years,

$$SI=\frac{Prt}{100},\qquad A=P+SI=P\left(1+\frac{rt}{100}\right).$$

Simple interest is calculated on the original principal throughout. Convert months to years unless the rate is monthly.

**Worked example**

₹8,000 at $7.5\%$ per annum for 2 years gives $SI=8000\times7.5\times2/100=1,200$. Thus SI is ₹1,200 and the amount is ₹9,200.

**Self-check**

Find SI on ₹6,000 at $8\%$ per annum for 9 months.

<details>
<summary>Answer and explanation</summary>

$t=9/12=3/4$ year. $SI=6000\times8\times3/(100\times4)=360$, so the interest is ₹360.
</details>

## 2. Reverse the SI Formula Safely

Any one unknown can be isolated:

$$P=\frac{100SI}{rt},\qquad r=\frac{100SI}{Pt},\qquad t=\frac{100SI}{Pr}.$$

If a sum doubles under SI, interest equals principal, so $rt/100=1$. It triples when interest is $2P$, so $rt/100=2$.

**Worked example**

A sum earns ₹1,500 SI in 3 years at $10\%$. Principal $=1500\times100/(10\times3)=5,000$, so the principal is ₹5,000.

**Self-check**

At what annual SI rate does a sum double in 8 years?

<details>
<summary>Answer and explanation</summary>

$rt=100$, so $r=100/8=12.5\%$ per annum.
</details>

## 3. Use Compound Multipliers Period by Period

For annual compounding at constant rate,

$$A=P\left(1+\frac r{100}\right)^n,qquad CI=A-P.$$

For changing annual rates $r_1,r_2,\ldots$,

$$A=P\prod_i\left(1+\frac{r_i}{100}\right).$$

Each period’s interest joins the principal for the next period.

**Worked example**

₹10,000 compounded annually at $10\%$ for 2 years becomes $10000(1.1)^2=12,100$. The amount is ₹12,100 and CI is ₹2,100.

**Self-check**

₹8,000 grows by $10\%$ in year 1 and $20\%$ in year 2. Find the amount.

<details>
<summary>Answer and explanation</summary>

$8000\times1.1\times1.2=10,560$, so the amount is ₹10,560.
</details>

## 4. Match the Rate to the Compounding Period

For a nominal annual rate $r\%$ compounded $m$ times per year for $t$ years,

$$A=P\left(1+\frac{r}{100m}\right)^{mt}.$$

| Compounding | Rate per period | Periods in $t$ years |
|---|---:|---:|
| annual | $r\%$ | $t$ |
| half-yearly | $r/2\%$ | $2t$ |
| quarterly | $r/4\%$ | $4t$ |

This assumes the stated rate is a nominal annual rate convertible at the given frequency.

More frequent compounding at the same positive nominal rate gives a slightly higher effective annual return because interest is added sooner. For $10\%$ nominal compounded half-yearly, the effective annual rate is

$$\left(1+\frac{0.10}{2}\right)^2-1=0.1025=10.25\%.$$

Do not halve both rate and total time: halve the rate per period and double the number of periods per year.

**Worked example**

₹16,000 at $10\%$ per annum compounded half-yearly for one year uses $5\%$ twice: $16000(1.05)^2=17,640$. The amount is ₹17,640.

**Self-check**

How many compounding periods occur in 18 months at quarterly compounding?

<details>
<summary>Answer and explanation</summary>

Six quarters.
</details>

## 5. Use SI–CI Difference Shortcuts Only Under Their Conditions

At the same annual rate $r\%$ for 2 years,

$$CI-SI=P\left(\frac r{100}\right)^2.$$

For 3 years,

$$CI-SI=P\left[3\left(\frac r{100}\right)^2+\left(\frac r{100}\right)^3\right].$$

These assume annual compounding and the same rate each year.

**Worked example**

For ₹20,000 at $10\%$ for 2 years, $CI-SI=20000(0.1)^2=200$, or ₹200.

**Self-check**

For ₹5,000 at $20\%$ annually for 2 years, find $CI-SI$.

<details>
<summary>Answer and explanation</summary>

$5000(0.2)^2=200$, so the difference is ₹200.
</details>

## 6. Treat Growth, Depreciation, and Effective Rate as Multipliers

Population growth, value appreciation, and repeated depreciation use the same compound structure. A depreciation rate $d\%$ gives multiplier $1-d/100$.

For a nominal annual rate $r$ compounded $m$ times, the effective annual rate is

$$\left(1+\frac{r}{100m}\right)^m-1,$$

expressed as a decimal; multiply by 100 for a percentage.

Reverse compound growth by dividing through the full multiplier:

$$P=\frac{A}{(1+r/100)^n}.$$

If a value doubles under compound growth, solve $(1+r/100)^n=2$; do not use the SI relation $rt=100$. Likewise, successive appreciation and depreciation multiply even when the percentage magnitudes are equal.

Compound interest and simple interest are equal after the first period because both start from the same principal. They diverge later because CI earns interest on accumulated interest.

Do not use a straight-line decrease for repeated percentage depreciation.

**Self-check**

A machine worth ₹50,000 depreciates $10\%$ yearly for 2 years. Find its value.

<details>
<summary>Answer and explanation</summary>

$50000(0.9)^2=40,500$, so the value is ₹40,500.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Find SI on ₹12,000 at $5\%$ for 3 years.

<details>
<summary>Answer and explanation</summary>

$12000\times5\times3/100=1,800$, so the interest is ₹1,800.
</details>

### Question 2

Find the amount on ₹4,000 at $10\%$ annual CI for 2 years.

<details>
<summary>Answer and explanation</summary>

$4000(1.1)^2=4,840$, so the amount is ₹4,840.
</details>

### Question 3

At $8\%$ SI, how long does ₹5,000 take to earn ₹1,200?

<details>
<summary>Answer and explanation</summary>

$t=1200\times100/(5000\times8)=3$ years.
</details>

### Question 4

₹10,000 is compounded half-yearly at $12\%$ per annum for one year. Find the amount.

<details>
<summary>Answer and explanation</summary>

Rate is $6\%$ per half-year for two periods: $10000(1.06)^2=11,236$. The amount is ₹11,236.
</details>

### Question 5

A population decreases $20\%$ and then increases $25\%$. What is the net change?

<details>
<summary>Answer and explanation</summary>

$0.8\times1.25=1$, so there is no net change.
</details>

Mastery means rate and time use the same period before any formula is applied. Continue with [Simple and Compound Interest focused practice](/exams/ssc-cgl/practice/simple-compound-interest).
