---
title: HCF and LCM
description: A concise SSC CGL lesson on prime-exponent methods, Euclid’s algorithm, common measures, recurring events, remainder patterns, and fraction HCF/LCM.
tags: [ssc-cgl, quantitative-aptitude, hcf, lcm]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for HCF, LCM, remainder, and recurrence questions](/img/ssc-cgl/hcf-and-lcm-map.svg)
*Use HCF for the greatest common measure, LCM for the least common multiple or recurrence, and differences for equal-remainder conditions.*

HCF and LCM questions are direct when their wording reveals “greatest size” or “first together again.” Mark and return if a remainder condition has not yet been converted into divisibility of differences.

## 1. Choose HCF or LCM from the Wording

The highest common factor (HCF) is the greatest positive integer dividing every given integer. The least common multiple (LCM) is the least positive integer divisible by every given integer.

| Cue | Use |
|---|---|
| greatest equal length or largest tile | HCF |
| maximum group size dividing all exactly | HCF |
| least number divisible by all | LCM |
| first time events coincide again | LCM |
| smallest common denominator | LCM |

**Worked example**

The largest square tile that exactly covers a $168\text{ cm}\times252\text{ cm}$ floor has side $\gcd(168,252)=84$ cm.

**Self-check**

Three bells ring every 6, 8, and 12 minutes. After how many minutes will they next ring together?

<details>
<summary>Answer and explanation</summary>

$\operatorname{lcm}(6,8,12)=24$ minutes.
</details>

## 2. Use Minimum and Maximum Prime Exponents

Write each number in prime factors. HCF takes the **minimum** exponent common to all; LCM takes the **maximum** exponent appearing in any.

For $72=2^3\cdot3^2$ and $120=2^3\cdot3\cdot5$:

$$\gcd=2^3\cdot3=24,$$

$$\operatorname{lcm}=2^3\cdot3^2\cdot5=360.$$

For two positive integers only,

$$ab=\gcd(a,b)\operatorname{lcm}(a,b).$$

Do not apply this product identity unchanged to three or more integers.

**Self-check**

Two positive integers have HCF 12, LCM 420, and one number 60. Find the other.

<details>
<summary>Answer and explanation</summary>

$12\times420/60=84$.
</details>

## 3. Use Euclid’s Algorithm for Awkward Numbers

Euclid’s algorithm repeatedly replaces the larger number by the remainder:

$$\gcd(a,b)=\gcd(b,a\bmod b).$$

Continue until the remainder is zero; the last non-zero remainder is the HCF.

**Worked example**

Find $\gcd(867,255)$:

$$867=3(255)+102,$$
$$255=2(102)+51,$$
$$102=2(51)+0.$$

Therefore the HCF is 51.

**Self-check**

Find $\gcd(391,299)$.

<details>
<summary>Answer and explanation</summary>

$391-299=92$, $299=3(92)+23$, and $92=4(23)$. Hence the HCF is 23.
</details>

## 4. Convert Equal Remainders into Differences

If a divisor $d$ leaves the same remainder when dividing $A,B,C$, then $d$ divides every pairwise difference. The greatest such divisor is

$$\gcd(A-B,B-C,\ldots).$$

If $N$ leaves remainder $r$ on division by $a,b,c$, then $N-r$ is a common multiple of $a,b,c$. The least such $N$ above the divisors is often

$$N=\operatorname{lcm}(a,b,c)+r,$$

subject to any range or “least” condition.

**Worked example**

The greatest number dividing 122, 182, and 242 with the same remainder divides differences 60 and 60, so it is 60. Indeed each number leaves remainder 2.

**Self-check**

Find the least number that leaves remainder 3 when divided by 4, 5, and 6.

<details>
<summary>Answer and explanation</summary>

$N-3$ must be divisible by all three. Their LCM is 60, so the least number greater than the divisors is $60+3=63$.
</details>

## 5. Solve Grouping and Measurement Problems

For the largest identical packet size with no remainder, take the HCF of the quantities. Number of packets is total quantity divided by packet size. For the smallest quantity that can be arranged in several exact group sizes, take the LCM.

**Worked example**

There are 96 red, 144 blue, and 240 green beads. The greatest number of identical groups using all beads is $\gcd(96,144,240)=48$. Each group has 2 red, 3 blue, and 5 green beads.

**Self-check**

What is the smallest number of students that can stand in rows of 12, 15, or 18 with none left over?

<details>
<summary>Answer and explanation</summary>

$\operatorname{lcm}(12,15,18)=2^2\cdot3^2\cdot5=180$.
</details>

## 6. Handle Fractions and Recurring Events Carefully

First reduce all positive fractions to lowest terms. Then

$$\operatorname{HCF}\left(\frac ab,\frac cd\right)=\frac{\gcd(a,c)}{\operatorname{lcm}(b,d)},$$

$$\operatorname{LCM}\left(\frac ab,\frac cd\right)=\frac{\operatorname{lcm}(a,c)}{\gcd(b,d)}.$$

These formulae assume positive fractions expressed in lowest terms.

For recurring events, LCM gives the elapsed time until coincidence. Add the starting clock time only after finding the interval; if the problem asks how many coincidences occur in a window, include or exclude the initial event according to wording.

**Self-check**

Find the HCF of $3/4$ and $9/10$.

<details>
<summary>Answer and explanation</summary>

$\gcd(3,9)/\operatorname{lcm}(4,10)=3/20$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Find the HCF and LCM of 18 and 30.

<details>
<summary>Answer and explanation</summary>

HCF $=6$ and LCM $=90$.
</details>

### Question 2

The HCF of two numbers is 8 and their product is 1,920. Find their LCM.

<details>
<summary>Answer and explanation</summary>

For two positive integers, LCM $=1920/8=240$.
</details>

### Question 3

Find the greatest number that divides 105 and 165 leaving the same remainder.

<details>
<summary>Answer and explanation</summary>

It must divide $165-105=60$, so the greatest possible divisor is 60.
</details>

### Question 4

Find the least number divisible by 8, 12, and 15.

<details>
<summary>Answer and explanation</summary>

$\operatorname{lcm}(8,12,15)=2^3\cdot3\cdot5=120$.
</details>

### Question 5

Two lights flash every 14 and 20 seconds. If they flash together now, when do they next coincide?

<details>
<summary>Answer and explanation</summary>

$\operatorname{lcm}(14,20)=140$ seconds later.
</details>

Mastery means you translate the wording into greatest common measure, least common recurrence, or divisibility of differences before factoring. Continue with [HCF and LCM focused practice](/exams/ssc-cgl/practice/hcf-and-lcm).
