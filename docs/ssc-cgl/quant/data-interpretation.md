---
title: Data Interpretation
description: A concise SSC CGL lesson on reading tables and charts, totals, shares, growth, ratios, weighted averages, pie charts, missing values, and safe approximation.
tags: [ssc-cgl, quantitative-aptitude, data-interpretation]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for reading and solving data-interpretation sets](/img/ssc-cgl/data-interpretation-map.svg)
*Read title, unit, period, legend, and denominator before calculating; then reuse set totals across questions.*

DI is arithmetic with a reading gate. A direct question uses one row or one clear total. Mark and return when a question needs several close-option calculations or a long missing-value system after the easier questions in the set are done.

## 1. Audit the Display Before Touching Numbers

Read in this order:

1. title and population measured;
2. unit, including “in thousands/lakhs”;
3. time period and whether values are annual or cumulative;
4. legend, axis scale, and stacked categories;
5. notes such as estimates, percentages, or exclusions.

Do not infer values from bar height when labels provide exact numbers. In a truncated axis, visual differences can look larger than numerical differences.

**Worked example**

A table says “sales in ₹ lakh.” An entry 24 means ₹24 lakh, not ₹24. If a question asks rupees, multiply by 100,000.

**Self-check**

A chart reports population “in thousands,” and a bar is labelled 85. What population does it represent?

<details>
<summary>Answer and explanation</summary>

85,000.
</details>

## 2. Build Totals and Shares Once

For category value $x$ and total $T$,

$$\text{share\%}=\frac{x}{T}\times100.$$

Compute a reusable row or column total once and label it. If categories overlap, their sum may exceed the whole; add only mutually exclusive components.

**Worked example**

Four departments sell 120, 150, 90, and 140 units. Total is 500. The second department’s share is $150/500\times100=30\%$.

**Self-check**

Values are 45, 75, and 30. What percentage of the total is 45?

<details>
<summary>Answer and explanation</summary>

Total $=150$; share $=45/150\times100=30\%$.
</details>

## 3. Use the Old Value for Growth

$$\%\text{ change}=\frac{\text{new}-\text{old}}{\text{old}}\times100.$$

Percentage-point change applies when the displayed values are already rates. A fall from $60\%$ to $48\%$ is 12 percentage points, or a $12/60=20\%$ relative decrease.

For a multiplier over several periods, use the full ratio. Compound annual growth rate, when explicitly asked, is

$$\left(\frac{V_n}{V_0}\right)^{1/n}-1,$$

not the arithmetic average of annual percentage changes.

**Self-check**

Output rises from 240 to 300. Find percentage increase.

<details>
<summary>Answer and explanation</summary>

Increase is 60 on old base 240: $60/240\times100=25\%$.
</details>

## 4. Compare Ratios and Weighted Averages Correctly

Simplify a ratio only after matching units. For combined average,

$$\bar x=\frac{n_1\bar x_1+n_2\bar x_2}{n_1+n_2}.$$

An arithmetic mean of group averages is valid only when group sizes are equal.

**Worked example**

20 workers average ₹500 and 30 workers average ₹700. Combined average is $(20\times500+30\times700)/50=620$, or ₹620.

**Self-check**

Two equal-sized groups have averages 42 and 58. Find combined average.

<details>
<summary>Answer and explanation</summary>

Because sizes are equal, $(42+58)/2=50$.
</details>

## 5. Translate Pie Angles into Values

For central angle $\theta$,

$$\text{fraction}=\frac{\theta}{360^\circ},\qquad \text{value}=\frac{\theta}{360^\circ}T.$$

One percent corresponds to $3.6^\circ$. Check that all sectors total $360^\circ$ or $100\%$, allowing for stated rounding.

**Worked example**

A $72^\circ$ sector in a total of 2,500 represents $72/360=1/5$, so its value is 500.

**Self-check**

What central angle represents $35\%$ of a pie chart?

<details>
<summary>Answer and explanation</summary>

$0.35\times360^\circ=126^\circ$.
</details>

## 6. Solve Missing Values and Approximate with Bounds

If a total is known, missing value equals total minus known mutually exclusive parts. If an average is known, total equals average times count. Preserve units.

In a stacked bar, total height is the sum of its segments; a segment’s share uses that bar’s total, not the maximum axis value. When a chart gives percentages of another percentage, rebuild the actual base: $40\%$ of a group that is $30\%$ of the whole equals $12\%$ of the whole.

**Worked example**

Average of five annual values is 84. Four values total 326. Overall total is $5\times84=420$, so the missing value is 94.

Approximate only when the question requests it or option gaps are wide. For close options, use cancellation or exact fractions. Estimate the final required expression—not every input independently—so rounding errors do not accumulate unpredictably.

Before accepting an answer, run a scale check: a part cannot exceed its stated total; pie shares should sum to roughly $100\%$; a weighted average must lie between the smallest and largest component averages; and a positive growth rate must produce a value above its old base. These checks catch unit and denominator errors cheaply.

For comparison questions, calculate only as far as needed. To decide whether $a/b>c/d$ for positive denominators, compare $ad$ and $bc$ rather than producing two decimals.

**Self-check**

Is $198/403$ closer to $1/2$ or $2/3$?

<details>
<summary>Answer and explanation</summary>

It is close to $200/400=1/2$. Exact comparison also places it just below $1/2$.
</details>

## 7. Mixed Practice and Mastery

Use this table for Questions 1–5.

| Year | A | B | C |
|---:|---:|---:|---:|
| 1 | 80 | 120 | 100 |
| 2 | 100 | 150 | 110 |

### Question 1

Find total for Year 1.

<details>
<summary>Answer and explanation</summary>

$80+120+100=300$.
</details>

### Question 2

Find A’s percentage increase from Year 1 to Year 2.

<details>
<summary>Answer and explanation</summary>

Increase $=20$ on base 80, so $25\%$.
</details>

### Question 3

Find ratio B:C in Year 2.

<details>
<summary>Answer and explanation</summary>

$150:110=15:11$.
</details>

### Question 4

Find total for Year 2.

<details>
<summary>Answer and explanation</summary>

$100+150+110=360$.
</details>

### Question 5

What percentage of Year 2 total is B?

<details>
<summary>Answer and explanation</summary>

$150/360\times100=41\frac23\%$.
</details>

Mastery means every answer can be traced to a labelled unit, period, and denominator. Continue with [Data Interpretation focused practice](/exams/ssc-cgl/practice/data-interpretation).
