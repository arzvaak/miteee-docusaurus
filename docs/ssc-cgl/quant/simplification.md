---
title: Simplification
description: A concise SSC CGL lesson on operation order, fraction cancellation, indices, surds, decimals, approximation, and answer verification.
tags: [ssc-cgl, quantitative-aptitude, simplification]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for safe simplification decisions](/img/ssc-cgl/simplification-map.svg)
*Read the full expression, preserve grouping, cancel factors before multiplication, and approximate only when the question or options permit it.*

Simplification is a control topic: most errors are not difficult arithmetic but a lost bracket, a wrong operation order, or cancellation across addition. Direct items reveal clean factors. Mark and return if an exact expression develops long non-cancelling arithmetic and the options do not support estimation.

## 1. Apply Operation Order Without Inventing Priority

Use brackets first, then powers/roots, then multiplication and division **left to right**, then addition and subtraction **left to right**. Multiplication does not automatically precede division; they share a level.

**Worked example**

$$48\div6\times2=8\times2=16,$$

not $48\div12=4$.

**Self-check**

Evaluate $18-6\div3\times2$.

<details>
<summary>Answer and explanation</summary>

Division and multiplication go left to right: $6\div3\times2=4$. Hence $18-4=14$.
</details>

## 2. Cancel Factors, Never Terms Across Addition

Factor before multiplying:

$$\frac{a}{b}\times\frac{c}{d}=\frac{ac}{bd}.$$

You may cancel a common **factor** from numerator and denominator. You may not cancel the $a$ in $(a+b)/a$ because $a+b$ is a sum, not a product.

For addition,

$$\frac ab+\frac cd=\frac{ad+bc}{bd},$$

then reduce.

**Worked example**

$$\frac{21}{40}\times\frac{16}{49}=\frac{3}{5}\times\frac{4}{7}=\frac{12}{35}.$$

**Self-check**

Simplify $\dfrac{3}{8}+\dfrac{5}{12}$.

<details>
<summary>Answer and explanation</summary>

LCM of 8 and 12 is 24. The sum is $9/24+10/24=19/24$.
</details>

## 3. Use Index Laws with Their Conditions

For suitable real numbers and integer exponents:

| Rule | Condition |
|---|---|
| $a^ma^n=a^{m+n}$ | same base |
| $a^m/a^n=a^{m-n}$ | $a\ne0$ |
| $(a^m)^n=a^{mn}$ | — |
| $(ab)^n=a^nb^n$ | integer $n$ |
| $a^0=1$ | $a\ne0$ |
| $a^{-n}=1/a^n$ | $a\ne0$ |

Do not turn $a^m+b^m$ into $(a+b)^m$.

**Worked example**

$$\frac{2^7\cdot2^3}{2^5}=2^{7+3-5}=2^5=32.$$

**Self-check**

Simplify $(3^2)^3/3^4$.

<details>
<summary>Answer and explanation</summary>

$3^{6-4}=3^2=9$.
</details>

## 4. Simplify Surds Without Invalid Splitting

For non-negative $a,b$, $\sqrt{ab}=\sqrt a\sqrt b$. But $\sqrt{a+b}\ne\sqrt a+\sqrt b$ in general.

Extract perfect-square factors:

$$\sqrt{72}=\sqrt{36\cdot2}=6\sqrt2.$$

For a simple binomial denominator, multiply by the conjugate:

$$\frac1{a+\sqrt b}\times\frac{a-\sqrt b}{a-\sqrt b}=\frac{a-\sqrt b}{a^2-b},$$

when $a^2\ne b$.

**Self-check**

Rationalise $1/(3+\sqrt5)$.

<details>
<summary>Answer and explanation</summary>

Multiply by $(3-\sqrt5)/(3-\sqrt5)$ to get $(3-\sqrt5)/(9-5)=(3-\sqrt5)/4$.
</details>

## 5. Move Cleanly Among Decimals, Fractions, and Percentages

Terminating decimals become fractions by place value: $0.375=375/1000=3/8$. A purely recurring decimal with repeating block $R$ of $n$ digits equals $R/(10^n-1)$ after accounting for leading zeros in the block.

| Value | Fraction | Percentage |
|---:|---:|---:|
| $0.2$ | $1/5$ | $20\%$ |
| $0.125$ | $1/8$ | $12.5\%$ |
| $0.625$ | $5/8$ | $62.5\%$ |
| $0.\overline3$ | $1/3$ | $33\frac13\%$ |

**Worked example**

$$2.5\times0.04=\frac{25}{10}\times\frac4{100}=\frac{100}{1000}=0.1.$$

**Self-check**

Convert $0.\overline{18}$ to a fraction.

<details>
<summary>Answer and explanation</summary>

$18/99=2/11$.
</details>

## 6. Approximate Only When It Is Safe

Approximation is safe when the question asks for an approximate value or the answer options are widely separated. Preserve enough significant information to distinguish options. It is unsafe when cancellation makes a small difference important or options are close.

Use bounds: if $49.8\times20.1$ is required approximately, $50\times20=1000$ is a strong estimate. For exact answers, return to the original numbers.

Digit sum modulo 9 and unit-digit checks can reject some wrong answers, but passing them does not prove correctness.

For a square-root estimate, bracket between consecutive squares before refining. Since $14^2=196$ and $15^2=225$, $\sqrt{210}$ lies between 14 and 15. This is faster and safer than guessing a decimal blindly. For division estimates, compare numerator and denominator by the same rounded scale; rounding one aggressively and the other exactly can bias the quotient.

When options are fractions, compare by cross multiplication instead of converting long decimals. For positive denominators,

$$\frac ab>\frac cd\iff ad>bc.$$

Keep denominators’ signs positive before using this comparison.

**Self-check**

Why is approximating $1001-999$ as $1000-1000$ unsafe?

<details>
<summary>Answer and explanation</summary>

The true answer is a small difference, 2. Rounding both large terms destroys the information that determines it.
</details>

**Self-check**

Which is larger: $7/12$ or $5/9$?

<details>
<summary>Answer and explanation</summary>

Cross products are $7\times9=63$ and $5\times12=60$, so $7/12$ is larger.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Evaluate $36\div(3\times2)+5$.

<details>
<summary>Answer and explanation</summary>

Bracket first: $36/6+5=11$.
</details>

### Question 2

Simplify $\dfrac{15}{28}\times\dfrac{14}{25}$.

<details>
<summary>Answer and explanation</summary>

Cancel to $(3/2)\times(1/5)=3/10$.
</details>

### Question 3

Simplify $5^{-2}$.

<details>
<summary>Answer and explanation</summary>

$5^{-2}=1/5^2=1/25$.
</details>

### Question 4

Simplify $\sqrt{200}$.

<details>
<summary>Answer and explanation</summary>

$\sqrt{100\cdot2}=10\sqrt2$.
</details>

### Question 5

Estimate $19.9\times5.02$ to the nearest convenient whole number.

<details>
<summary>Answer and explanation</summary>

$20\times5=100$. The exact product is close to 100, so this estimate is suitable if options are separated.
</details>

Mastery means every cancellation is between factors and every approximation has an error reason. Continue with [Simplification focused practice](/exams/ssc-cgl/practice/simplification).
