---
title: Series and Coding-Decoding
description: Exam-ready SSC CGL Tier-I Reasoning chapter for number series, letter series, alphanumeric patterns, and coding-decoding.
tags: [ssc-cgl, reasoning, series-coding, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. Classify Before You Compute

A series asks, “What rule continues?” A coding question asks, “What transformation changed the original into the code?” In both, test a rule on **every available term** before accepting it.

![Decision map for series and coding-decoding questions](/img/ssc-cgl/series-coding-map.svg)
*Concept map: identify the pattern family, test it across the full prompt, and only then apply it to the missing term.*

Use this order instead of searching randomly:

| Visible cue | First test | Next test | Warning |
|---|---|---|---|
| Steady growth | First differences | Second differences | One matching gap proves nothing |
| Fast multiplication | Ratio or powers | Multiply, then add/subtract | Check the same operation each time |
| Zigzag values | Odd and even positions | Repeating operation cycle | Do not force one rule across two strands |
| Letters only | Alphabet-position gaps | Reverse or opposite pairs | Check wraparound after Z |
| Letters and numbers | Separate both streams | Link only after each is clear | One stream may be a distractor |
| Word and code | Compare position by position | Reverse, swap, or fixed shift | Preserve order unless evidence reverses it |

**Worked example**

Find the next term: `3, 8, 15, 24, 35, ?`

The differences are $5,7,9,11$. They rise by $2$, so the next difference is $13$:

$$
35+13=48
$$

The answer is **48**.

**Self-check**

Find the next term: `4, 9, 16, 25, ?`

Options: 30, 32, 36, 49

<details>
<summary>Answer and explanation</summary>

**36.** The terms are consecutive squares: $2^2,3^2,4^2,5^2$, so the next is $6^2=36$.

</details>

## 2. Number Series

For a direct number series, use the least complicated complete rule.

1. Compute first differences.
2. If they are not constant, inspect second differences.
3. Check ratios when values grow rapidly.
4. Split odd and even positions when the sequence alternates.
5. Test familiar numbers: squares, cubes, primes, or triangular numbers.

**Worked example**

*Second differences*

Find the next term: `2, 6, 12, 20, 30, ?`

First differences are $4,6,8,10$; the next is $12$. Therefore:

$$
30+12=42
$$

The answer is **42**. Equivalently, the terms follow $n(n+1)$ for $n=1,2,3,\ldots$.

**Self-check — alternating strands**

Find the next term: `3, 10, 5, 12, 7, 14, ?`

Options: 8, 9, 16, 18

<details>
<summary>Answer and explanation</summary>

**9.** Odd-position terms are $3,5,7,9$; even-position terms are $10,12,14$. Treating the two strands separately explains every term.

</details>

**Self-check — multiply and adjust**

Find the next term: `2, 5, 11, 23, ?`

Options: 35, 46, 47, 48

<details>
<summary>Answer and explanation</summary>

**47.** Each term is twice the previous term plus $1$: $2\times2+1=5$, $5\times2+1=11$, and $23\times2+1=47$.

</details>

## 3. Letter and Alphanumeric Series

Convert letters to positions when the gaps are not obvious: $A=1, B=2, \ldots, Z=26$. A forward move beyond Z wraps to A.

**Worked example**

*Changing gap*

Find the next letter: `A, D, H, M, S, ?`

The forward gaps are $+3,+4,+5,+6$. The next gap is $+7$:

$$
S(19)+7=Z(26)
$$

The answer is **Z**.

**Self-check — opposite alphabet**

Complete the series: `A, Z, B, Y, C, X, ?`

Options: D, W, V, E

<details>
<summary>Answer and explanation</summary>

**D.** One strand moves forward A, B, C, D; the other moves backward Z, Y, X, W. The next displayed term belongs to the forward strand.

</details>

**Self-check — two coordinated streams**

Find the next term: `A1, C4, F9, J16, ?`

Options: N20, O20, O25, P25

<details>
<summary>Answer and explanation</summary>

**O25.** Letter positions rise by $+2,+3,+4$, so the next rise is $+5$: J becomes O. The numbers are $1^2,2^2,3^2,4^2$, so the next is $5^2=25$.

</details>

## 4. Coding-Decoding

Write the original above the code and compare corresponding positions. Do not assume a letter shift until it works throughout the example.

| Coding family | Recognition | Method | Check |
|---|---|---|---|
| Uniform shift | Every letter moves equally | Convert to positions and add $k$ | Test first and last letters |
| Position-wise shift | Each position has its own repeatable move | Record the shift under each position | Apply shifts in the same order |
| Reverse | Code uses the same letters backward | Reverse before any other step | Confirm all letters are retained |
| Pair swap | Neighbouring letters exchange places | Mark pairs from the same end | Handle an unpaired final letter |
| Position value | Code is numeric | Test sum, product, or selected positions | Verify on every supplied word |

**Worked example**

*Uniform shift*

If `CAT` is coded as `DBU`, how is `DOG` coded?

Each letter moves forward by $1$: C→D, A→B, T→U. Applying the same shift gives D→E, O→P, G→H. The answer is **EPH**.

**Self-check — reverse code**

If `MANGO` is coded as `OGNAM`, how is `TRAIN` coded?

Options: NIART, NIRAT, TNIAR, RTAIN

<details>
<summary>Answer and explanation</summary>

**NIART.** The code reverses the complete word without changing any letter.

</details>

**Self-check — position sum**

If a word is coded by adding alphabet positions, `BAD` is coded as 7. What is the code for `CAB`?

Options: 5, 6, 7, 8

<details>
<summary>Answer and explanation</summary>

**6.** $C+A+B=3+1+2=6$. The example checks the same rule because $B+A+D=2+1+4=7$.

</details>

## 5. Speed and Error Control

The 36-second ceiling is reasonable for a short, single-rule item. A long alternating or multi-step code deserves a mark-and-return decision rather than a guess.

| Time | Action | Exit condition |
|---:|---|---|
| 0–5 s | Classify the family | Number, letter, mixed, or code |
| 5–15 s | Write gaps, ratios, or letter shifts | One candidate rule is visible |
| 15–27 s | Test the rule on every term | No exception remains |
| 27–33 s | Apply it to the blank | Option matches exactly |
| 33–36 s | Verify or move | Reject a rule that fits only part |

Common errors:

- Treating alternating positions as one sequence.
- Accepting a pattern after checking only the first two gaps.
- Forgetting alphabet wraparound.
- Applying arithmetic before separating letters and numbers.
- Reversing a word after shifting when the example shifted before reversing.

**Self-check**

A rule fits the first three terms but fails at the fourth. Should you use it because an option matches?

<details>
<summary>Answer and explanation</summary>

No. A valid series or code rule must explain every supplied term unless the question explicitly marks an exception. An option cannot rescue an incomplete rule.

</details>

## 6. Mixed Exam Practice

### Question 1 — number series

Find the next term: `1, 4, 9, 16, 25, ?`

Options: 30, 32, 36, 49

<details>
<summary>Answer and explanation</summary>

**36.** These are $1^2$ through $5^2$; the next term is $6^2$.

</details>

### Question 2 — alternating series

Find the next term: `5, 20, 8, 23, 11, 26, ?`

Options: 14, 17, 29, 32

<details>
<summary>Answer and explanation</summary>

**14.** Odd-position terms are $5,8,11,14$; even-position terms are $20,23,26$.

</details>

### Question 3 — letter series

Find the next letter: `B, E, I, N, ?`

Options: S, T, U, V

<details>
<summary>Answer and explanation</summary>

**T.** The gaps are $+3,+4,+5$; the next is $+6$, taking N to T.

</details>

### Question 4 — coding

If `FISH` is coded as `GJTI`, how is `LION` coded?

Options: MJPO, MIPO, KHNM, NKQP

<details>
<summary>Answer and explanation</summary>

**MJPO.** Every letter moves forward by one: L→M, I→J, O→P, N→O.

</details>

### Question 5 — numeric code

Using alphabet-position sums, what is the code for `DOG`?

Options: 24, 25, 26, 27

<details>
<summary>Answer and explanation</summary>

**26.** $D+O+G=4+15+7=26$.

</details>

## 7. Mastery Check

- Name the pattern family before calculating.
- Explain every supplied term with one consistent rule.
- Split alternating positions without prompting.
- Use alphabet positions accurately, including wraparound.
- Complete the five mixed questions with all answers correct, then repeat with a fresh set under three minutes.

If a miss came from a false pattern, write the failed rule beside the correct one. That contrast is more useful than memorising the answer.

Continue with [Series and Coding-Decoding focused practice](/exams/ssc-cgl/practice/series-coding) when every rule above can be verified across the full prompt.
