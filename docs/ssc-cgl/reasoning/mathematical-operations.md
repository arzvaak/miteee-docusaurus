---
title: Mathematical Operations
description: Exam-ready SSC CGL Tier-I Reasoning chapter for symbol substitution, operator interchange, coded operations, BODMAS, and equation testing.
tags: [ssc-cgl, reasoning, mathematical-operations, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. Rewrite Before You Calculate

In mathematical-operations questions, familiar symbols may have unfamiliar meanings. Replace every coded symbol first; only then apply normal arithmetic.

![Decision map for mathematical-operations questions](/img/ssc-cgl/mathematical-operations-map.svg)
*Concept map: classify the coding rule, rewrite the complete expression, apply BODMAS, and verify the result against the original definitions.*

Use a two-line method:

1. **Code line:** copy the expression exactly as printed.
2. **Math line:** replace every coded symbol with its defined operation.

**Worked example**

If `+` means multiplication and `×` means subtraction, evaluate:

`8 + 3 × 2`

Rewrite first:

$$
8\times3-2=24-2=22
$$

The answer is **22**.

**Self-check**

If `−` means division and `÷` means addition, evaluate `18 − 3 ÷ 2`.

Options: 6, 8, 11, 17

<details>
<summary>Answer and explanation</summary>

**8.** Rewriting gives $18\div3+2=6+2=8$.

</details>

## 2. Symbol Substitution

Create a mapping before touching the numbers.

| Printed symbol | Defined meaning | Replace with | Do not do |
|---|---|---|---|
| `+` | Multiplication | $\times$ | Add first out of habit |
| `−` | Division | $\div$ | Subtract before rewriting |
| `×` | Addition | $+$ | Preserve the printed meaning |
| `÷` | Subtraction | $-$ | Mix coded and normal symbols |

The table above is only an example mapping. Each question supplies its own definitions.

**Worked example**

Under that example mapping, evaluate `12 + 2 − 3`.

Rewrite:

$$
12\times2\div3=24\div3=8
$$

**Self-check**

Using the same mapping, evaluate `20 ÷ 6 × 4`.

<details>
<summary>Answer and explanation</summary>

**18.** The rewritten expression is $20-6+4=18$.

</details>

## 3. Operator Interchange

When two operators are interchanged, swap **every occurrence** of those two operators and leave all others unchanged.

**Worked example**

Interchange `+` and `÷` in:

`18 + 3 − 2`

The rewritten expression is:

$$
18\div3-2=6-2=4
$$

**Self-check**

Interchange `×` and `−` in `12 − 3 × 2`.

Options: 10, 22, 34, 70

<details>
<summary>Answer and explanation</summary>

**34.** Rewriting gives $12\times3-2=36-2=34$.

</details>

If an equation contains the same operator more than once, change every instance. A partial swap creates a new rule that the question never gave.

## 4. Coded Binary Operations

A custom symbol such as `#` defines a function of two inputs. Preserve the order of the inputs.

**Worked example**

If $a\mathbin{\#}b=a^2-b$, find $6\mathbin{\#}5$.

$$
6\mathbin{\#}5=6^2-5=36-5=31
$$

**Self-check**

If $a\mathbin{\triangle}b=2a+b$, find $4\mathbin{\triangle}3$.

Options: 8, 10, 11, 14

<details>
<summary>Answer and explanation</summary>

**11.** Substitute $a=4$ and $b=3$: $2(4)+3=11$.

</details>

**Self-check — order matters**

Using $a\mathbin{\#}b=a^2-b$, are $5\mathbin{\#}2$ and $2\mathbin{\#}5$ equal?

<details>
<summary>Answer and explanation</summary>

**No.** $5\mathbin{\#}2=23$, while $2\mathbin{\#}5=-1$. A coded operation need not be commutative.

</details>

## 5. BODMAS and Equation Testing

After rewriting, use standard precedence.

| Order | Operation | Rule | Example |
|---:|---|---|---|
| 1 | Brackets | Complete inner groups first | $(3+2)\times4$ |
| 2 | Orders | Powers and roots | $3^2=9$ |
| 3 | Division and multiplication | Work left to right | $18\div3\times2=12$ |
| 4 | Addition and subtraction | Work left to right | $10-4+2=8$ |

**Worked example**

Evaluate:

$$
20-8\div4\times2
$$

Division and multiplication share a level, so work left to right:

$$
8\div4\times2=2\times2=4
$$

The result is **16**.

**Self-check — repair an equation**

Which interchange makes `16 + 4 = 4` true?

Options: `+` with `÷`; `+` with `×`; `+` with `−`

<details>
<summary>Answer and explanation</summary>

Interchange **`+` with `÷`**. The equation becomes $16\div4=4$.

</details>

When testing options, rewrite the full equation for one option at a time. Stop only when both sides are exactly equal.

## 6. Mixed Practice and Speed Control

A short substitution or interchange item can fit a 36-second ceiling: classify in 5 seconds, rewrite by 15 seconds, calculate, then compare with the options.

### Question 1 — substitution

If `+` means multiplication and `×` means subtraction, evaluate `7 + 4 × 3`.

<details>
<summary>Answer and explanation</summary>

**25.** Rewriting gives $7\times4-3=28-3=25$.

</details>

### Question 2 — interchange

Interchange `+` and `÷` in `24 + 6 + 2`.

<details>
<summary>Answer and explanation</summary>

**2.** Both plus signs change: $24\div6\div2=4\div2=2$.

</details>

### Question 3 — coded operation

If $a\mathbin{\star}b=a+2b$, find $5\mathbin{\star}4$.

Options: 9, 13, 18, 28

<details>
<summary>Answer and explanation</summary>

**13.** $5+2(4)=13$.

</details>

### Question 4 — BODMAS

Evaluate $30-12\div3\times2$.

Options: 12, 22, 26, 28

<details>
<summary>Answer and explanation</summary>

**22.** $12\div3\times2=4\times2=8$, so $30-8=22$.

</details>

### Question 5 — missing operators

Which pair makes `8 ? 2 ? 2 = 18` true?

Options: `×, +`; `+, ×`; `−, ×`; `÷, +`

<details>
<summary>Answer and explanation</summary>

**`×, +`.** $8\times2+2=18$.

</details>

## 7. Mastery Check

- Rewrite every coded symbol before arithmetic.
- Swap every occurrence in an interchange question.
- Preserve operand order in custom operations.
- Apply division/multiplication and addition/subtraction left to right.
- Verify both sides of an equation after each option test.
- Complete five fresh mixed questions with a visible rewrite line and no mental substitution.

Label each miss as **mapping**, **partial swap**, **operand order**, **BODMAS**, or **equation check** before retrying it.

Continue with [Mathematical Operations focused practice](/exams/ssc-cgl/practice/mathematical-operations) when every solution begins with a complete rewrite line.
