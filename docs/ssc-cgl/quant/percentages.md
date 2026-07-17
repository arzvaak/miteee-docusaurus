---
title: Percentages
description: A concise SSC CGL lesson on percentage bases, multipliers, successive change, reverse percentages, comparisons, and expenditure control.
tags: [ssc-cgl, quantitative-aptitude, percentages]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for percentage bases and multiplier decisions](/img/ssc-cgl/percentages-map.svg)
*Choose the base first, convert the change to a multiplier, and reverse only by division.*

Percentage means “per hundred,” but most errors come from using the wrong **base**. A one-step fraction conversion is a direct item. A question with several changing bases, hidden originals, or awkward equations is a mark-and-return candidate until the direct questions are secured.

## 1. Fix the Base Before Calculating

$$x\%\text{ of }y=\frac{x}{100}y$$

Percentage change always uses the **original** value as denominator:

$$\%\text{ change}=\frac{\text{new}-\text{original}}{\text{original}}\times100$$

| Fraction | Percentage | Fraction | Percentage |
|---:|---:|---:|---:|
| $1/2$ | $50\%$ | $1/3$ | $33\frac13\%$ |
| $1/4$ | $25\%$ | $1/5$ | $20\%$ |
| $1/6$ | $16\frac23\%$ | $1/8$ | $12.5\%$ |
| $1/10$ | $10\%$ | $1/16$ | $6.25\%$ |

The identity $x\%$ of $y=y\%$ of $x$ is useful when one order is easier.

**Worked example**

Find $16\frac23\%$ of 54. Since $16\frac23\%=1/6$, the answer is $54/6=9$.

**Self-check**

A value rises from 80 to 100. What is the percentage increase?

<details>
<summary>Answer and explanation</summary>

The increase is 20 on the original base 80, so $20/80\times100=25\%$.
</details>

## 2. Use Multipliers for Increase and Decrease

An increase of $r\%$ multiplies by $1+r/100$; a decrease multiplies by $1-r/100$.

$$\text{new}=\text{old}\left(1\pm\frac r{100}\right)$$

| Change | Multiplier |
|---|---:|
| increase $20\%$ | $1.20=6/5$ |
| decrease $20\%$ | $0.80=4/5$ |
| increase $25\%$ | $1.25=5/4$ |
| decrease $25\%$ | $0.75=3/4$ |
| increase $12.5\%$ | $1.125=9/8$ |

For successive changes, multiply the factors. Never add a rise and fall unless both use the same unchanged base.

**Worked example**

A salary rises by $20\%$ and then falls by $10\%$. The net multiplier is $1.2\times0.9=1.08$, so the net change is an **8% increase**.

**Self-check**

Does a $20\%$ increase followed by a $20\%$ decrease restore the original value?

<details>
<summary>Answer and explanation</summary>

No. The multiplier is $1.2\times0.8=0.96$, leaving a $4\%$ decrease.
</details>

## 3. Apply the Signed Successive-Change Rule

If changes $a\%$ and $b\%$ are signed—positive for increase, negative for decrease—then

$$\text{net }\%=a+b+\frac{ab}{100}$$

Thus two increases use $a+b+ab/100$. An increase of $a\%$ followed by a decrease of $b\%$ gives

$$a-b-\frac{ab}{100}.$$

The order of percentage multipliers does not affect the final product, though the intermediate values differ.

**Worked example**

Two successive discounts of $20\%$ and $10\%$ give $-20-10+(20\times10)/100=-28\%$. Equivalently, $0.8\times0.9=0.72$, so the final price is $72\%$ of marked price.

**Self-check**

Two successive increases are $10\%$ and $20\%$. What is the net increase?

<details>
<summary>Answer and explanation</summary>

$10+20+(10\times20)/100=32\%$.
</details>

## 4. Reverse by Dividing, Not Subtracting

If a final value is known, divide by the multiplier:

$$\text{original}=\frac{\text{final}}{1\pm r/100}$$

After a $25\%$ rise, final is $125\%$ of original, not “final minus $25\%$ of final.” After a $20\%$ fall, final is $80\%$ of original.

Comparison reversals also change the denominator:

- if A is $p\%$ more than B, B is $\dfrac{p}{100+p}\times100\%$ less than A;
- if A is $p\%$ less than B, B is $\dfrac{p}{100-p}\times100\%$ more than A.

**Self-check**

After a $20\%$ increase, a number becomes 360. What was it originally?

<details>
<summary>Answer and explanation</summary>

$360/1.2=300$.
</details>

## 5. Hold Expenditure or Product Constant

When expenditure $E=PQ$ stays constant, price and quantity are inversely related.

- price rises by $p\%$: quantity must fall by $\dfrac{p}{100+p}\times100\%$;
- price falls by $p\%$: quantity may rise by $\dfrac{p}{100-p}\times100\%$.

The same product logic applies to fixed area ($\ell b$), fixed work ($\text{workers}\times\text{days}$ under equal efficiency), and fixed distance ($vt$), but only when the stated product truly remains constant.

**Worked example**

Price rises by $25\%$ while expenditure is fixed. Quantity multiplier is $1/1.25=0.8$, so consumption must fall by $20\%$.

**Self-check**

Price falls by $20\%$. By what percentage can consumption rise at unchanged expenditure?

<details>
<summary>Answer and explanation</summary>

$20/(100-20)\times100=25\%$.
</details>

## 6. Choose the Short Safe Route

Use fractions when the percentage is familiar, multipliers for successive changes, and a base of 100 when only ratios matter. Check whether the answer asks for **percentage points**: a rate moving from $30\%$ to $38\%$ rises by 8 percentage points but by $8/30\times100=26\frac23\%$ relative to its old rate.

Direct items usually have one clear base or one multiplier. Mark and return when the base changes repeatedly, several categories overlap, or an algebraic condition has not yet been reduced to one equation.

**Self-check**

A pass rate rises from $40\%$ to $50\%$. State both changes.

<details>
<summary>Answer and explanation</summary>

It rises by 10 percentage points. Relative to the old rate, the increase is $10/40\times100=25\%$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Find $12.5\%$ of 240.

<details>
<summary>Answer and explanation</summary>

$12.5\%=1/8$, so the answer is $240/8=30$.
</details>

### Question 2

A quantity falls from 500 to 425. Find the percentage decrease.

<details>
<summary>Answer and explanation</summary>

Decrease $=75$; percentage $=75/500\times100=15\%$.
</details>

### Question 3

A price is increased by $10\%$ twice. Find the net increase.

<details>
<summary>Answer and explanation</summary>

$1.1^2=1.21$, so the net increase is $21\%$.
</details>

### Question 4

A is $50\%$ more than B. By what percentage is B less than A?

<details>
<summary>Answer and explanation</summary>

Take B as 100 and A as 150. The gap 50 on A’s base 150 is $33\frac13\%$.
</details>

### Question 5

After a $20\%$ discount, an article costs ₹640. Find the marked price.

<details>
<summary>Answer and explanation</summary>

$640$ is $80\%$ of marked price, so marked price $=640/0.8=800$, or ₹800.
</details>

Mastery means you can name the base before writing a percentage. Continue with [Percentages focused practice](/exams/ssc-cgl/practice/percentages) after you can move cleanly among fractions, multipliers, and reverse division.
