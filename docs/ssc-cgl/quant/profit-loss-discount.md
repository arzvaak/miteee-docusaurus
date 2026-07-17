---
title: Profit, Loss, and Discount
description: A concise SSC CGL lesson on cost price, selling price, marked price, successive discounts, reverse pricing, overall profit, and false-weight questions.
tags: [ssc-cgl, quantitative-aptitude, profit-loss, discount]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for profit, loss, markup, and discount multipliers](/img/ssc-cgl/profit-loss-discount-map.svg)
*Keep the base visible: profit and loss use cost price, discount uses marked price, and margin uses selling price.*

Pricing questions become short when every change is a multiplier. Direct items have one cost and one selling chain. Mark and return when several articles have different costs or quantities and the overall base has not been combined.

## 1. Separate CP, SP, MP, and Their Bases

$$\text{Profit}=SP-CP,\qquad \text{Loss}=CP-SP$$

$$\text{Profit\%}=\frac{SP-CP}{CP}\times100$$

$$\text{Loss\%}=\frac{CP-SP}{CP}\times100$$

Discount is measured on marked price:

$$\text{Discount\%}=\frac{MP-SP}{MP}\times100.$$

Profit margin, if asked, uses SP as denominator and is not the same as profit percentage on CP.

**Worked example**

An article costs ₹800 and sells for ₹920. Profit is ₹120 and profit percentage is $120/800\times100=15\%$.

**Self-check**

An article marked ₹1,000 sells for ₹850. Find the discount percentage.

<details>
<summary>Answer and explanation</summary>

Discount is ₹150 on marked price ₹1,000, so the discount is $15\%$.
</details>

## 2. Use Multipliers and Reverse Division

| Change | Relation |
|---|---|
| profit $p\%$ | $SP=CP(1+p/100)$ |
| loss $l\%$ | $SP=CP(1-l/100)$ |
| markup $m\%$ | $MP=CP(1+m/100)$ |
| discount $d\%$ | $SP=MP(1-d/100)$ |

To recover CP or MP, divide by the multiplier. Never subtract a percentage of the final price unless that is the stated base.

**Worked example**

Selling price after a $20\%$ profit is ₹1,440. Cost price is $1440/1.2=1,200$, or ₹1,200.

**Self-check**

After a $25\%$ discount, SP is ₹900. Find MP.

<details>
<summary>Answer and explanation</summary>

$SP=0.75MP$, so $MP=900/0.75=1,200$, or ₹1,200.
</details>

## 3. Combine Markup and Discount as One Chain

If markup is $m\%$ and discount is $d\%$,

$$\frac{SP}{CP}=\left(1+\frac m{100}\right)\left(1-\frac d{100}\right).$$

Two successive discounts $a\%,b\%$ have equivalent discount

$$a+b-\frac{ab}{100}.$$

They are not added directly because the second discount uses the already reduced price.

**Worked example**

An article is marked $50\%$ above CP and discounted $20\%$. Then $SP/CP=1.5\times0.8=1.2$, giving $20\%$ profit.

**Self-check**

Find the single discount equivalent to $30\%$ followed by $10\%$.

<details>
<summary>Answer and explanation</summary>

$30+10-(30\times10)/100=37\%$. The final multiplier is $0.63$.
</details>

## 4. Combine Articles on Total Cost, Not Average Percent

Overall profit percentage is

$$\frac{\sum SP-\sum CP}{\sum CP}\times100.$$

Do not average percentages unless their cost bases are equal. If two articles sell at the same SP, one at $x\%$ gain and the other at $x\%$ loss, the overall result is a loss of

$$\frac{x^2}{100}\%.$$

This shortcut requires **equal selling prices and equal percentage magnitudes**.

**Worked example**

Two articles sell for ₹960 each, one at $20\%$ profit and one at $20\%$ loss. Their costs are ₹800 and ₹1,200; total cost ₹2,000, total SP ₹1,920, so loss is ₹80 or $4\%$, matching $20^2/100$.

**Self-check**

Can $10\%$ profit and $20\%$ loss be averaged to a $5\%$ loss when costs differ?

<details>
<summary>Answer and explanation</summary>

No. Add actual profit/loss amounts and divide by total cost. Percentages on unequal bases cannot be averaged directly.
</details>

## 5. Handle False Weight as Price per True Unit

If a seller charges for 1 kg but gives only $(100-s)\%$ of a kg, the quantity multiplier is $(100-s)/100$. If the charged price also claims $p\%$ profit on the quoted kilogram cost, then

$$\text{effective multiplier}=\frac{1+p/100}{1-s/100}.$$

Effective profit percentage is $(\text{multiplier}-1)\times100$.

**Worked example**

A seller charges cost price per kilogram but gives 800 g. Revenue for “1 kg” equals the cost of 1 kg, while actual cost supplied is $0.8$ kg. Profit multiplier is $1/0.8=1.25$, so profit is $25\%$.

**Self-check**

A seller charges $10\%$ above cost per quoted kilogram and gives 900 g. Find effective profit percentage.

<details>
<summary>Answer and explanation</summary>

Multiplier $=1.10/0.90=11/9$. Profit $=(2/9)\times100=22\frac29\%$.
</details>

## 6. Choose Direct or Mark-and-Return

Use a base of 100 when only percentages matter. Use actual rupees when totals across different articles matter. Scan for these traps:

- profit/loss percentage is on CP;
- discount is on MP;
- “margin” may be on SP;
- equal gain and loss percentages do not cancel;
- successive discounts multiply;
- quantity shortages change the true cost supplied.

If a target profit $p\%$ must remain after a discount $d\%$, required markup follows

$$\frac{MP}{CP}=\frac{1+p/100}{1-d/100}.$$

For example, to retain $20\%$ profit after a $20\%$ discount, $MP/CP=1.2/0.8=1.5$, so markup must be $50\%$.

Commission, tax, packing, or transport must be placed on the base stated in the question. If they form part of acquisition cost, include them in effective CP before finding profit.

**Self-check**

An item has CP ₹500 and SP ₹625. What is profit margin on SP?

<details>
<summary>Answer and explanation</summary>

Profit is ₹125. Margin on SP is $125/625\times100=20\%$. Profit percentage on CP would be $25\%$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

CP is ₹750 and loss is $12\%$. Find SP.

<details>
<summary>Answer and explanation</summary>

$SP=750\times0.88=660$, or ₹660.
</details>

### Question 2

MP is ₹2,000 and discount is $15\%$. Find SP.

<details>
<summary>Answer and explanation</summary>

$SP=2000\times0.85=1,700$, or ₹1,700.
</details>

### Question 3

An article is marked $25\%$ above CP and sold at $10\%$ discount. Find profit percentage.

<details>
<summary>Answer and explanation</summary>

$SP/CP=1.25\times0.9=1.125$, so profit is $12.5\%$.
</details>

### Question 4

Two successive discounts are $20\%$ and $25\%$. Find the equivalent discount.

<details>
<summary>Answer and explanation</summary>

Final multiplier $=0.8\times0.75=0.6$, so discount is $40\%$.
</details>

### Question 5

SP is ₹1,035 at a $15\%$ profit. Find CP.

<details>
<summary>Answer and explanation</summary>

$CP=1035/1.15=900$, or ₹900.
</details>

Mastery means you can name the denominator of every percentage. Continue with [Profit, Loss, and Discount focused practice](/exams/ssc-cgl/practice/profit-loss-discount).
