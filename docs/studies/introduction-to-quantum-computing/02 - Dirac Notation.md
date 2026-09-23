---
title: "02 - Dirac Notation"
math_syntax: typst
---

# 02 — Dirac Notation

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Dirac notation is the universal language of quantum mechanics. It makes it easy to write inner products, outer products, tensor products, and operator actions without the clutter of matrix indices. Every formula in this course uses it.

---

## 2.1 Kets

A **ket** is a column vector written as:

$ |v> = mat(a_1; a_2; dots.v; a_n) in CC^n $

The symbol $|"cdot">$ is the ket bracket, and the label inside can be anything: a number ($|0>$, $|1>$), a Greek letter ($|psi>$, $|phi>$), or a compound label ($|01>$, $|++>$).

**Examples in $CC^2$:**

$ |0> = mat(1; 0), quad |1> = mat(0; 1) $

These are called the **computational basis states** (or standard basis states).

Any state in $CC^2$ can be written as:

$ |psi> = alpha |0> + beta |1> = mat(alpha; beta) $

where $alpha, beta in CC$.

---

## 2.2 Bras

A **bra** is the conjugate transpose (Hermitian adjoint) of a ket. It is a row vector:

$ <v| = |v>^dagger = (overline(a_1), overline(a_2), ..., overline(a_n)) $

**Examples:**

$ <0| = (1, 0), quad <1| = (0, 1) $

For $|psi> = alpha |0> + beta |1>$:

$ <psi| = overline(alpha) <0| + overline(beta) <1| = (overline(alpha), overline(beta)) $

---

## 2.3 Brakets (Inner Products)

The **bracket** $<v|w>$ is the inner product of two vectors:

$ <v|w> = overline(v_1) w_1 + overline(v_2) w_2 + dots.h + overline(v_n) w_n $

This is a **scalar** (a single complex number), not a vector.

**Properties of the inner product:**
1. $<v|w> = overline(<w|v>)$ (conjugate symmetry)
2. $<v|v> >= 0$, with equality iff $v = 0$ (positive definiteness)
3. Linearity in the second argument: $<u|a v + b w> = a <u|v> + b <u|w>$
4. Anti-linearity in the first argument: $<a u + b v|w> = overline(a) <u|w> + overline(b) <v|w>$

### Worked Example 2.1

Let $|v> = mat(1; i)$ and $|w> = mat(i; 1)$. Compute $<v|w>$ and $<w|v>$.

**Solution:**

$<v| = (1, -i)$ (conjugate transpose of $|v>$)

$<v|w> = (1)(i) + (-i)(1) = i - i = 0$

$<w|v> = overline(<v|w>) = overline(0) = 0$

Since $<v|w> = 0$, the vectors $|v>$ and $|w>$ are **orthogonal**.

---

## 2.4 Brackets (Outer Products)

The **ket-bra** $|v><w|$ is an **outer product** — it produces a matrix, not a scalar:

$ |v><w| = mat(a_1; a_2; dots.v; a_n) (overline(b_1), overline(b_2), ..., overline(b_m)) = mat(a_1 overline(b_1) & dots.h & a_1 overline(b_m); dots.v & dots.down & dots.v; a_n overline(b_1) & dots.h & a_n overline(b_m)) $

For $CC^2$ with the computational basis:

$ |0><0| = mat(1 & 0; 0 & 0), quad |0><1| = mat(0 & 1; 0 & 0) $

$ |1><0| = mat(0 & 0; 1 & 0), quad |1><1| = mat(0 & 0; 0 & 1) $

These four outer products form a complete basis for all $2 times 2$ matrices.

---

## 2.5 The Completeness Relation

If ${|i>}$ is an orthonormal basis for an $n$-dimensional space, then:

$ sum_(i=1)^n |i><i| = I_n $

where $I_n$ is the $n times n$ identity matrix. This is called the **completeness relation** or **resolution of the identity**.

For the computational basis of $CC^2$:

$ |0><0| + |1><1| = mat(1 & 0; 0 & 0) + mat(0 & 0; 0 & 1) = mat(1 & 0; 0 & 1) = I_2 $

**Why this matters:** The completeness relation lets us insert identity operators to manipulate expressions:

$ |psi> = I |psi> = (|0><0| + |1><1|) |psi> = <0|psi> |0> + <1|psi> |1> $

This shows how any state is expanded in a basis — the expansion coefficients are the inner products with the basis vectors.

---

## 2.6 Reading and Writing Dirac Expressions

| Expression | Type | Result |
|------------|------|--------|
| $|v>$ | Ket | Column vector |
| $<v|$ | Bra | Row vector (conjugate transpose) |
| $<v\|w>$ | Bracket | Scalar (inner product) |
| $\|v><w\|$ | Ket-bra | Matrix (outer product) |

**Composition rule:** To evaluate an expression with multiple kets and bras, work from the inside out, combining adjacent bra-ket pairs into scalars.

### Worked Example 2.2

Simplify $|psi><psi|psi><psi|$.

**Solution:**

$<psi|psi>$ is a scalar (call it $c$). So:

$|psi> underbrace(<psi|psi>) c underbrace(<psi|psi>) c |psi> = c^2 |psi>$

Actually, let's be more careful: $|psi> (<psi|psi>) (<psi|psi>) = <psi|psi>^2 |psi>$. If $|psi>$ is normalized, $<psi|psi> = 1$, so the expression equals $|psi>$.

---

## Common Mistakes

- **Confusing bra-ket with ket-bra**: $<v|w>$ is a scalar; $|v><w|$ is a matrix. They are completely different objects.
- **Forgetting conjugation**: $<v|$ involves *complex conjugation* of the components. If $|v> = mat(a; b)$, then $<v| = (overline(a), overline(b))$, NOT $(a, b)$.
- **Using $|0>$ for the zero vector**: The zero vector is written as $0$ (no ket brackets). $|0>$ is the computational basis state $mat(1; 0)$.
- **Order of operations**: In expressions like $A|psi>$, the operator acts on the ket to produce another ket. In $<phi|A$, the bra is multiplied by the operator on the right to produce another bra.

---

## Revision Checklist

- [ ] I can write a vector as a ket and compute its bra (conjugate transpose)
- [ ] I can compute inner products $<v|w>$ with complex components
- [ ] I can compute outer products $|v><w|$ and write them as matrices
- [ ] I understand the completeness relation $sum_i |i><i| = I$
- [ ] I can simplify expressions by combining bra-ket pairs from inside out
- [ ] I know the difference between a bracket (scalar) and a ket-bra (matrix)
