---
title: Averages, Mixtures, and Alligation
description: A concise SSC CGL lesson on totals from averages, combined and weighted means, replacement, concentration, alligation, and repeated mixture withdrawal.
tags: [ssc-cgl, quantitative-aptitude, averages, mixtures, alligation]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for averages, weighted mixtures, and alligation](/img/ssc-cgl/averages-mixtures-alligation-map.svg)
*Turn every average into a total, weight every component by quantity, and use alligation only when the target lies between two component values.*

Average and mixture questions share one principle: **total contribution divided by total quantity**. Direct items have one replacement or two components. Mark and return when repeated withdrawals, several concentrations, or unequal group sizes have not yet been reduced to a weighted total.

## 1. Rebuild the Total Behind an Average

$$\bar x=\frac{\sum x}{n},\qquad \sum x=n\bar x.$$

If every observation changes by $k$, the average changes by $k$. If every observation is multiplied by $k$, the average is multiplied by $k$.

**Worked example**

Average of 8 numbers is 27. Their total is $8\times27=216$.

**Self-check**

The average of 12 values is 18. What is their sum?

<details>
<summary>Answer and explanation</summary>

$12\times18=216$.
</details>

## 2. Update an Average Through the Total Difference

If one value $x$ is replaced by $y$ among $n$ observations,

$$\text{new average}=\text{old average}+\frac{y-x}{n}.$$

For a wrong entry corrected from $w$ to $c$, adjust the total by $c-w$.

**Worked example**

Average of 10 values is 42. A value 36 is replaced by 56. New average is $42+(56-36)/10=44$.

**Self-check**

Average of 20 students was calculated as 55, but 68 was entered as 86. Find correct average.

<details>
<summary>Answer and explanation</summary>

Correct total is lower by 18, so average is lower by $18/20=0.9$. Correct average is 54.1.
</details>

## 3. Weight Group Averages by Group Size

$$\bar x=\frac{n_1\bar x_1+n_2\bar x_2+\cdots}{n_1+n_2+\cdots}.$$

The combined average lies between component averages when weights are positive. The arithmetic mean of averages is valid only for equal group sizes.

This same rule handles rates only when the weights match the rate definition. Average price per kilogram is weighted by kilograms; average marks are weighted by students. Average speed is generally **not** weighted by the number of journey legs: it is total distance divided by total time. Before combining two stated averages, write what each numerator and denominator represent.

**Worked example**

30 students average 60 and 20 students average 75. Combined average is $(30\times60+20\times75)/50=66$.

**Self-check**

Group A has 40 people averaging 25; Group B has 10 averaging 45. Find combined average.

<details>
<summary>Answer and explanation</summary>

$(40\times25+10\times45)/50=1450/50=29$.
</details>

## 4. Use Deviation for Symmetric or Consecutive Values

Choose a convenient assumed mean $A$:

$$\bar x=A+\frac{\sum d}{n},\qquad d=x-A.$$

The average of an arithmetic progression is $(\text{first}+\text{last})/2$. For consecutive equally spaced values, the middle value is the average.

**Self-check**

Find the average of 17, 21, 25, 29, 33.

<details>
<summary>Answer and explanation</summary>

They form an arithmetic progression, so average $=(17+33)/2=25$.
</details>

For ages, distinguish the passage of time from a membership change. If the same $n$ people are observed $k$ years later, their average rises by $k$. If someone joins or leaves, rebuild the total instead. A group of 6 with average age 20 has total age 120; after a 30-year-old joins, the new average is $150/7$, not 25.

## 5. Treat Concentration as Weighted Content

If quantities $q_i$ have concentrations $c_i$ as decimals, total pure substance is $\sum q_ic_i$ and final concentration is

$$c=\frac{\sum q_ic_i}{\sum q_i}.$$

Use consistent volume or mass units and assume additive quantities only when the problem does.

**Worked example**

Mix 20 L of $30\%$ solution with 30 L of $50\%$ solution. Solute is $6+15=21$ L-equivalent in 50 L, so concentration is $42\%$.

**Self-check**

Mix 10 kg at ₹40/kg with 15 kg at ₹60/kg. Find mean price.

<details>
<summary>Answer and explanation</summary>

Total cost is $400+900=1,300$ for 25 kg, so the mean price is ₹52/kg.
</details>

## 6. Apply Alligation and Repeated Replacement with Conditions

For cheaper value $C$, dearer value $D$, and target mean $M$ with $C<M<D$,

$$\text{cheaper quantity : dearer quantity}=(D-M):(M-C).$$

**Worked example**

Mix ₹30/kg and ₹50/kg to obtain ₹38/kg. Ratio cheaper:dearer is $(50-38):(38-30)=12:8=3:2$.

For a well-mixed vessel of volume $V$, if $x$ is removed and replaced each time, the fraction of original liquid after $n$ identical operations is

$$\left(1-\frac xV\right)^n.$$

This assumes thorough mixing before each withdrawal and restoration to volume $V$.

Alligation gives only a **ratio**, not the actual quantities. It is a compact form of the weighted-mean equation and must pass two checks: the target is between the component values, and the computed ratio places the larger weight on the component closer to the target. If ₹30 and ₹50 are mixed for ₹38, the target is closer to ₹30, so the cheaper component should indeed have the larger share, $3:2$.

**Self-check**

From 40 L milk, 10 L is replaced by water twice. How much original milk remains?

<details>
<summary>Answer and explanation</summary>

$40(1-10/40)^2=40(3/4)^2=22.5$ L.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Average of 6 numbers is 14. A seventh number 21 is added. Find new average.

<details>
<summary>Answer and explanation</summary>

Old total $=84$; new total $=105$. Average $=105/7=15$.
</details>

### Question 2

The average of 15 values rises by 2 when one value is replaced. By how much did the replacement increase the total?

<details>
<summary>Answer and explanation</summary>

$15\times2=30$.
</details>

### Question 3

Mix 4 L at $20\%$ with 6 L at $50\%$. Find final concentration.

<details>
<summary>Answer and explanation</summary>

Solute $=0.8+3=3.8$ L in 10 L, so $38\%$.
</details>

### Question 4

In what ratio should ₹24/kg and ₹36/kg goods be mixed for ₹30/kg?

<details>
<summary>Answer and explanation</summary>

$(36-30):(30-24)=6:6=1:1$.
</details>

### Question 5

From a 50 L vessel, 5 L is removed and replaced three times. What fraction of original liquid remains?

<details>
<summary>Answer and explanation</summary>

$(1-5/50)^3=(0.9)^3=0.729$.
</details>

Mastery means every mean is backed by a total and every alligation target lies between its components. Continue with [Averages, Mixtures, and Alligation focused practice](/exams/ssc-cgl/practice/averages-mixtures-alligation).
