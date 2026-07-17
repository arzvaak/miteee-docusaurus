---
title: Number System
description: A concise SSC CGL lesson on number types, divisibility, prime factors, divisor counts, remainders, unit digits, perfect powers, and factorial zeros.
tags: [ssc-cgl, quantitative-aptitude, number-system]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for number-system question families](/img/ssc-cgl/number-system-map.svg)
*Classify the number property first, then use divisibility, factor exponents, or a remainder cycle instead of expanding the number.*

Number System rewards recognition. Direct items expose a divisibility rule, exponent pattern, or short cycle. Mark and return when a large expression has several unrelated moduli or requires lengthy case enumeration.

## 1. Know the Number Families

Natural numbers are commonly $1,2,3,\ldots$; whole numbers include 0; integers include negatives. A rational number is $p/q$ with integers $p,q$ and $q\ne0$. Irrational numbers cannot be written in that form. Rational and irrational numbers together form the real numbers.

A prime number has exactly two positive divisors: 1 and itself. The number 1 is **neither prime nor composite**. Two is the only even prime. Every integer greater than 1 has a unique prime factorisation apart from order.

**Worked example**

$0.\overline{27}=27/99=3/11$, so the repeating decimal is rational.

**Self-check**

Is $\sqrt{49}$ irrational because it contains a radical sign?

<details>
<summary>Answer and explanation</summary>

No. $\sqrt{49}=7$, an integer and therefore rational.
</details>

## 2. Apply Divisibility Tests Precisely

| Divisor | Test |
|---:|---|
| 2 | last digit even |
| 3 | digit sum divisible by 3 |
| 4 | last two digits divisible by 4 |
| 5 | last digit 0 or 5 |
| 6 | divisible by both 2 and 3 |
| 8 | last three digits divisible by 8 |
| 9 | digit sum divisible by 9 |
| 11 | alternating digit-sum difference divisible by 11, including 0 |

For a composite divisor with coprime factors, test each factor. Divisibility by 12 requires 3 and 4; divisibility by 18 requires 2 and 9.

**Worked example**

For 57244, the last two digits 44 are divisible by 4, so the number is divisible by 4. Its digit sum is 22, so it is not divisible by 3 or 9.

**Self-check**

Is 9185 divisible by 11?

<details>
<summary>Answer and explanation</summary>

Yes. The alternating difference is $(9+8)-(1+5)=11$, a multiple of 11.
</details>

## 3. Read Prime Exponents for Divisors

If

$$N=p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k},$$

then the number of positive divisors is

$$d(N)=(a_1+1)(a_2+1)\cdots(a_k+1).$$

The sum of positive divisors is

$$\sigma(N)=\prod_{i=1}^k\frac{p_i^{a_i+1}-1}{p_i-1}.$$

A perfect square has even exponents in its prime factorisation; a perfect cube has exponents divisible by 3.

**Worked example**

$360=2^3\cdot3^2\cdot5$. Hence $d(360)=(3+1)(2+1)(1+1)=24$.

**Self-check**

What least number must multiply $72=2^3\cdot3^2$ to make a perfect square?

<details>
<summary>Answer and explanation</summary>

Multiply by 2 so the exponent of 2 becomes 4. Then $144=2^4\cdot3^2$ is a square.
</details>

## 4. Work with Remainders Instead of Large Values

Write $N=dq+r$ with $0\le r<d$. In modular notation, $N\equiv r\pmod d$.

You may add, subtract, and multiply remainders:

$$a\equiv r,\ b\equiv s\pmod d\implies ab\equiv rs\pmod d.$$

Reduce after every step. A negative remainder can be converted to its least non-negative equivalent: $-2\equiv5\pmod7$.

**Worked example**

Find the remainder when $43\times58$ is divided by 7. Since $43\equiv1$ and $58\equiv2\pmod7$, the product has remainder $2$.

**Self-check**

What least number should be added to 785 to make it divisible by 9?

<details>
<summary>Answer and explanation</summary>

Digit sum is 20, so the remainder is 2. Add $9-2=7$.
</details>

## 5. Use Unit-Digit Cycles

Only the base’s unit digit matters. Powers repeat in cycles:

| Unit digit | Cycle | Length |
|---:|---|---:|
| 0, 1, 5, 6 | fixed | 1 |
| 4 | 4, 6 | 2 |
| 9 | 9, 1 | 2 |
| 2 | 2, 4, 8, 6 | 4 |
| 3 | 3, 9, 7, 1 | 4 |
| 7 | 7, 9, 3, 1 | 4 |
| 8 | 8, 4, 2, 6 | 4 |

For cycle length 4, use exponent modulo 4; remainder 0 means the fourth position.

**Worked example**

The unit digit of $7^{103}$ uses $103\equiv3\pmod4$. The third value in $7,9,3,1$ is 3.

**Self-check**

Find the unit digit of $12^{48}$.

<details>
<summary>Answer and explanation</summary>

Use the cycle of 2. Since $48\equiv0\pmod4$, take the fourth value, 6.
</details>

## 6. Handle Factorials and Digits Safely

Trailing zeros come from factors $10=2\times5$. Factorials contain more 2s than 5s, so

$$Z(n!)=\left\lfloor\frac n5\right\rfloor+\left\lfloor\frac n{25}\right\rfloor+\left\lfloor\frac n{125}\right\rfloor+\cdots.$$

The number of decimal digits in a positive integer $N$ is $\lfloor\log_{10}N\rfloor+1$. For products, logarithms can help, but SSC usually supplies a shorter factor or power route.

A two-digit number with tens digit $a$ and units digit $b$ is $10a+b$; reversing it gives $10b+a$. Their difference is $9(a-b)$.

**Self-check**

How many trailing zeros are in $100!$?

<details>
<summary>Answer and explanation</summary>

$\lfloor100/5\rfloor+\lfloor100/25\rfloor=20+4=24$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Is 1 prime, composite, or neither?

<details>
<summary>Answer and explanation</summary>

Neither. It has only one positive divisor.
</details>

### Question 2

How many positive divisors does $2^4\cdot3^2$ have?

<details>
<summary>Answer and explanation</summary>

$(4+1)(2+1)=15$.
</details>

### Question 3

Find the remainder when $2^{10}$ is divided by 7.

<details>
<summary>Answer and explanation</summary>

$2^3\equiv1\pmod7$, and $10=3\cdot3+1$, so $2^{10}\equiv2$.
</details>

### Question 4

What least number must multiply 54 to make a perfect cube?

<details>
<summary>Answer and explanation</summary>

$54=2^1\cdot3^3$. Multiply by $2^2=4$ so both exponents are multiples of 3.
</details>

### Question 5

Find the unit digit of $3^{22}$.

<details>
<summary>Answer and explanation</summary>

$22\equiv2\pmod4$; the second value in $3,9,7,1$ is 9.
</details>

Mastery means you can select divisibility, prime exponents, or modular cycles without expanding large numbers. Continue with [Number System focused practice](/exams/ssc-cgl/practice/number-system).
