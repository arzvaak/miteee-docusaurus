---
title: Calculation Speed
description: A concise SSC CGL lesson on fraction recall, decomposition, near-base products, squares, cancellation, option gaps, approximation, and verification.
tags: [ssc-cgl, quantitative-aptitude, calculation-speed]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for choosing a fast but safe calculation route](/img/ssc-cgl/calculation-speed-map.svg)
*Scan for cancellation, friendly fractions, and option gaps before committing to long arithmetic.*

Speed comes from choosing a shorter representation, not skipping conditions. Direct items collapse through a known fraction, identity, or cancellation. Mark and return when exact arithmetic remains long and options are close enough that estimation cannot decide safely.

## 1. Recall a Small Fraction–Percentage Core

| Fraction | Percentage | Fraction | Percentage |
|---:|---:|---:|---:|
| $1/2$ | $50\%$ | $1/3$ | $33\frac13\%$ |
| $1/4$ | $25\%$ | $1/5$ | $20\%$ |
| $1/6$ | $16\frac23\%$ | $1/8$ | $12.5\%$ |
| $1/9$ | $11\frac19\%$ | $1/11$ | $9\frac1{11}\%$ |
| $1/16$ | $6.25\%$ | $3/8$ | $37.5\%$ |

Use $x\%$ of $y=y\%$ of $x$ when it creates an integer.

The useful goal is recognition, not memorising a huge conversion chart. Build unfamiliar values from the core: $62.5\%=5/8$, $87.5\%=7/8$, and $66\frac23\%=2/3$. When a percentage is not one of these clean values, split it into convenient parts. For example, $17\%$ of 300 is $10\%+5\%+2\%=30+15+6=51$. Keep the fractional form exact until the final step; an early rounded decimal can silently change a close-option answer.

**Worked example**

$12.5\%$ of 368 is $368/8=46$.

**Self-check**

Find $37.5\%$ of 240.

<details>
<summary>Answer and explanation</summary>

$37.5\%=3/8$, so $240\times3/8=90$.
</details>

## 2. Decompose Around Friendly Numbers

Use the distributive law:

$$a(b+c)=ab+ac.$$

Near-base multiplication:

$$(B+x)(B+y)=B^2+B(x+y)+xy.$$

Choose $B=10,100,1000$ when offsets are small.

**Worked example**

$98\times103=(100-2)(100+3)=10000+100-6=10094$.

**Self-check**

Compute $47\times99$ mentally.

<details>
<summary>Answer and explanation</summary>

$47(100-1)=4700-47=4653$.
</details>

The same idea works for division. Separate a dividend into multiples of the divisor: $1248\div24=(1200+48)/24=50+2=52$. This is safe because division distributes over an addition in the numerator. It does **not** justify splitting a denominator, so $a/(b+c)$ must not become $a/b+a/c$.

**Worked example**

$1002\times47=1000\times47+2\times47=47,094$. A near-base split is shorter and easier to audit than a full column product.

## 3. Use Square and Difference Identities

$$ (a+b)^2=a^2+2ab+b^2 $$

$$ (a-b)^2=a^2-2ab+b^2 $$

$$ (a+b)(a-b)=a^2-b^2 $$

For numbers ending in 5,

$$(10n+5)^2=100n(n+1)+25.$$

**Worked example**

$65^2$: multiply 6 by 7 and append 25, giving 4225.

**Self-check**

Compute $1003^2-997^2$.

<details>
<summary>Answer and explanation</summary>

Difference of squares: $(1003-997)(1003+997)=6\times2000=12000$.
</details>

## 4. Cancel Before Multiplying or Dividing

Rewrite decimals and percentages as fractions when they expose factors. In

$$\frac{a\times b}{c\times d},$$

cancel common factors across numerator and denominator before multiplication. Never cancel across a sum.

When adding fractions, first use the LCM of denominators; cancellation applies only after the numerator has become one complete factor. For instance,

$$\frac{3}{14}+\frac{5}{21}=\frac{9+10}{42}=\frac{19}{42}.$$

There is no common factor to cancel. By contrast, $\frac{18+24}{42}=\frac{42}{42}=1$ because the numerator is evaluated or factored as a whole.

**Worked example**

$$\frac{48\times75}{25\times16}=\frac{48}{16}\times\frac{75}{25}=3\times3=9.$$

**Self-check**

Compute $840\div35$ without long division.

<details>
<summary>Answer and explanation</summary>

$35\times24=840$, or $840/(5\times7)=168/7=24$.
</details>

## 5. Use Options as Information, Not as Proof

If options differ in unit digit, parity, sign, or size, compute only what distinguishes them. Substitute options into an equation when solving symbolically would take longer, but check all stated conditions.

Digit sum modulo 9 can reject incompatible answers; unit digit can reject impossible products. Neither proves a surviving option is correct when several share the same residue.

Use a second, independent check for high-risk arithmetic. A quotient can be checked by multiplying divisor and quotient and restoring the remainder. A percentage answer can be checked for scale: $7\%$ of 480 must be below $10\%$ of 480, so any option above 48 is impossible. A square of a number ending in 5 must end in 25, but that ending alone does not identify the square.

**Self-check**

A product contains factors 18 and 25. What must its last digit be?

<details>
<summary>Answer and explanation</summary>

$18\times25=450$, so with only those factors the last digit is 0. More generally, a factor 2 paired with a factor 5 supplies a trailing zero.
</details>

## 6. Approximate with an Error Budget

Approximation is suitable when requested or when option gaps exceed plausible rounding error. Keep direction in mind: rounding both numerator up and denominator down overestimates a quotient.

For $49.8\times20.2$, $50\times20=1000$ is a useful estimate. For $1001-999$, rounding to $1000-1000$ destroys the small difference and is unsafe.

You can also bracket an answer. Since $19<19.9<20$,

$$\frac{598}{20}<\frac{598}{19.9}<\frac{598}{19}.$$

Thus the quotient is just above $29.9$ and well below $31.5$. If only one option lies in that interval, exact division is unnecessary; if two do, calculate more accurately. For a product, track whether each rounding move raises or lowers the result instead of assuming the rounded estimate is unbiased.

Direct calculation should be attempted when one rewrite ends the item. Mark and return when multiple ugly operations remain, a small cancellation controls the answer, or close options demand exactness.

**Self-check**

Estimate $598/19.9$.

<details>
<summary>Answer and explanation</summary>

$600/20=30$. This is a strong estimate; use exact division only if options are close.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Find $16\frac23\%$ of 420.

<details>
<summary>Answer and explanation</summary>

$1/6$ of 420 is 70.
</details>

### Question 2

Compute $104\times96$.

<details>
<summary>Answer and explanation</summary>

$(100+4)(100-4)=10000-16=9984$.
</details>

### Question 3

Compute $85^2$.

<details>
<summary>Answer and explanation</summary>

$8\times9=72$, append 25: 7225.
</details>

### Question 4

Simplify $\dfrac{27\times44}{11\times18}$.

<details>
<summary>Answer and explanation</summary>

$(27/18)(44/11)=(3/2)4=6$.
</details>

### Question 5

Estimate $79.8\times5.1$.

<details>
<summary>Answer and explanation</summary>

$80\times5=400$; the exact value is close, so 400 is the useful estimate.
</details>

Mastery means you can explain why a shortcut preserves the value and when it does not. Continue with [Calculation Speed focused practice](/exams/ssc-cgl/practice/calculation-speed).
