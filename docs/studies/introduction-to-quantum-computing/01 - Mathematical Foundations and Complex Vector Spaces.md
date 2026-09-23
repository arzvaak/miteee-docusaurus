---
title: "01 - Mathematical Foundations and Complex Vector Spaces"
math_syntax: typst
---

# 01 — Mathematical Foundations and Complex Vector Spaces

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Every quantum state lives in a complex vector space. Before we can talk about qubits, gates, or measurement, we need a firm grasp of the algebraic playground they inhabit. This chapter builds that playground from the ground up.

---

## 1.1 Complex Numbers — A Quick Refresher

A **complex number** has the form:

$ z = a + i b $

where $a, b in RR$ and $i^2 = -1$. The **conjugate** is:

$ overline(z) = a - i b $

and the **modulus** is:

$ |z| = sqrt(a^2 + b^2) $

**Key properties for quantum mechanics:**
- $z overline(z) = |z|^2$ (always a non-negative real number)
- Every complex number can be written in polar form: $z = r e^(i theta)$ where $r = |z|$ and $theta = arg(z)$
- Euler's formula: $e^(i theta) = cos theta + i sin theta$

### Worked Example 1.1

Let $z = 1 + i$. Find $|z|$, $overline(z)$, and express $z$ in polar form.

**Solution:**

$|z| = sqrt(1^2 + 1^2) = sqrt(2)$

$overline(z) = 1 - i$

$r = sqrt(2)$, $theta = arctan(1/1) = pi/4$

So $z = sqrt(2) e^(i pi/4) = sqrt(2)(cos(pi/4) + i sin(pi/4))$

---

## 1.2 What Is a Vector Space?

A **vector space** $V$ over a field $F$ is a set of elements (called *vectors*) together with two operations:

- **Vector addition**: $V times V -> V$
- **Scalar multiplication**: $F times V -> V$

that satisfy the following axioms for all $u, v, w in V$ and $a, b in F$:

| Property | Statement |
|----------|-----------|
| Closure under addition | $u + v in V$ |
| Commutativity | $u + v = v + u$ |
| Associativity | $(u + v) + w = u + (v + w)$ |
| Additive identity | There exists $0 in V$ such that $v + 0 = v$ |
| Additive inverse | For each $v$, there exists $-v$ such that $v + (-v) = 0$ |
| Closure under scalar multiplication | $a v in V$ |
| Distributivity (scalar over vector sum) | $a(u + v) = a u + a v$ |
| Distributivity (vector over scalar sum) | $(a + b)v = a v + b v$ |
| Associativity of scalar multiplication | $a(b v) = (a b) v$ |
| Multiplicative identity | $1 v = v$ |

### The Special Case: $CC^n$

The vector space of prime importance in quantum computation is $CC^n$ — the set of all $n$-tuples of complex numbers. For $n = 2$:

$ CC^2 = { mat(z_1; z_2) : z_1, z_2 in CC } $

This is the space where single qubit states live.

**Verification that $CC^2$ is a vector space:** Given two vectors $v = mat(a; b)$ and $w = mat(c; d)$ in $CC^2$:

- $v + w = mat(a + c; b + d) in CC^2$ ✓ (closure)
- $z v = mat(z a; z b) in CC^2$ ✓ (closure)
- $0 = mat(0; 0)$ is the additive identity ✓
- $-v = mat(-a; -b)$ is the additive inverse ✓

All other axioms follow from the properties of complex number arithmetic.

---

## 1.3 Linear Vector Spaces

A **linear vector space (LVS)** is simply a vector space in which the operations are linear. The term is used interchangeably with "vector space" in the quantum mechanics literature.

### Key Properties of Finite-Dimensional LVS

1. **Dimension**: A vector space $V$ is $n$-dimensional if it contains a basis of $n$ vectors. We write $dim(V) = n$.
2. **$CC^n$ is the canonical example**: $CC^n$ has dimension $n$, with the standard basis ${|0>, |1>, ..., |n-1>}$.
3. **Vectors as matrices**: In $CC^n$, vectors are $n times 1$ column matrices. Quantum mechanics also uses $1 times n$ row matrices (bras, as we will see in Dirac notation).

### Why Complex, Not Real?

Classical physics uses real numbers. Quantum mechanics requires complex numbers because:
- Probability amplitudes can interfere (both constructively and destructively), and complex numbers naturally encode phase
- The Schrödinger equation has $i$ explicitly in it
- Unitary evolution requires complex conjugation, which has no meaningful real analogue

---

## 1.4 Subspaces

A **subspace** $W$ of a vector space $V$ is a subset of $V$ that is itself a vector space under the same operations.

**Test for a subspace:** A non-empty subset $W subset.eq V$ is a subspace if and only if:
1. $0 in W$ (contains the zero vector)
2. For all $u, v in W$: $u + v in W$ (closed under addition)
3. For all $a in CC$ and $v in W$: $a v in W$ (closed under scalar multiplication)

### Worked Example 1.2

Show that the set of all vectors of the form $mat(z; 0)$ where $z in CC$ is a subspace of $CC^2$.

**Solution:**
1. $mat(0; 0)$ is in the set ✓
2. $mat(z_1; 0) + mat(z_2; 0) = mat(z_1 + z_2; 0)$ is in the set ✓
3. $a mat(z; 0) = mat(a z; 0)$ is in the set ✓

This subspace is the span of $|0> = mat(1; 0)$.

---

## Common Mistakes

- **Forgetting closure**: Not every subset of a vector space is a subspace. For example, the set of vectors in $CC^2$ whose first component equals 1 is *not* a subspace because $mat(1; 0) + mat(1; 0) = mat(2; 0)$ which is not in the set.
- **Confusing the field**: In quantum mechanics, the field is $CC$ (complex numbers), not $RR$. Scalars multiplying vectors are complex, not just real.
- **Treating vectors as arrows only**: In quantum computing, vectors are column matrices. Functions, matrices, and polynomials can also be treated as vectors in appropriate vector spaces.

---

## Revision Checklist

- [ ] I can identify the axioms of a vector space and verify them for $CC^n$
- [ ] I understand why quantum mechanics uses complex (not real) vector spaces
- [ ] I can test whether a subset is a subspace
- [ ] I know that $CC^2$ is the state space for a single qubit
- [ ] I can add vectors and multiply by complex scalars in $CC^n$
