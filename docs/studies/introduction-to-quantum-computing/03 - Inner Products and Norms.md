---
title: "03 - Inner Products and Norms"
math_syntax: typst
---

# 03 — Inner Products and Norms

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

The inner product tells us how much one quantum state "overlaps" with another. It gives us probabilities, normalization conditions, and the geometric notion of angles in abstract vector spaces. The norm (derived from the inner product) tells us whether a state vector is properly normalized.

---

## 3.1 Inner Product Spaces

An **inner product space** is a vector space $V$ over $CC$ equipped with an inner product — a function $("cdot", "cdot"): V times V -> CC$ satisfying:

1. **Conjugate symmetry**: $(u, v) = overline((v, u))$
2. **Linearity in the second argument**: $(u, a v + b w) = a (u, v) + b (u, w)$
3. **Positive definiteness**: $(v, v) >= 0$ with equality iff $v = 0$

In Dirac notation, the inner product of $|u>$ and $|v>$ is written $<u|v>$.

### The Standard Inner Product on $CC^n$

For $|u> = mat(u_1; dots.v; u_n)$ and $|v> = mat(v_1; dots.v; v_n)$:

$ <u|v> = sum_(k=1)^n overline(u_k) v_k $

**Important:** The complex conjugation is on the *first* argument (the bra). This is the convention used in physics (mathematics sometimes reverses this).

---

## 3.2 Norms

The **norm** of a vector is defined by the inner product:

$ ||v|| = sqrt(<v|v>) $

Properties:
- $||v|| >= 0$ with equality iff $v = 0$
- $||a v|| = |a| ||v||$ for any scalar $a in CC$
- Triangle inequality: $||u + v|| <= ||u|| + ||v||$

### Worked Example 3.1

Find the norm of $|v> = mat(3; 4i)$.

**Solution:**

$<v|v> = overline(3)(3) + overline(4i)(4i) = 9 + (-4i)(4i) = 9 + 16 = 25$

$||v|| = sqrt(25) = 5$

---

## 3.3 Normalized Vectors

A vector $|v>$ is **normalized** if $||v|| = 1$, i.e., $<v|v> = 1$.

Any non-zero vector can be normalized:

$ |hat(v)> = |v> / ||v|| $

### Worked Example 3.2

Normalize $|v> = mat(1 + i; 2)$.

**Solution:**

$<v|v> = |1 + i|^2 + |2|^2 = (1 + 1) + 4 = 6$

$|hat(v)> = 1/sqrt(6) mat(1 + i; 2) = mat((1 + i)/sqrt(6); 2/sqrt(6))$

**Verification:** $<hat(v)|hat(v)> = |1 + i|^2/6 + 4/6 = 2/6 + 4/6 = 1$ ✓

---

## 3.4 Orthonormality

A set of vectors ${|e_1>, |e_2>, ..., |e_n>}$ is **orthonormal** if:

$ <e_i|e_j> = delta_(i j) $

where $delta_(i j)$ is the **Kronecker delta**:

$ delta_(i j) = cases( 1 & "if" i = j, 0 & "if" i != j ) $

### The Computational Basis

The vectors $|0> = mat(1; 0)$ and $|1> = mat(0; 1)$ form an orthonormal basis for $CC^2$:

$ <0|0> = 1, quad <1|1> = 1, quad <0|1> = 0 $

### Worked Example 3.3

Check whether $|+> = 1/sqrt(2) mat(1; 1)$ and $|-> = 1/sqrt(2) mat(1; -1)$ are orthonormal.

**Solution:**

$<+|+> = (1/2)(1 + 1) = 1$ ✓

$<-|-> = (1/2)(1 + 1) = 1$ ✓

$<+|-> = (1/2)(overline(1)(1) + overline(1)(-1)) = (1/2)(1 - 1) = 0$ ✓

Yes, ${|+>, |->}$ is orthonormal. This is the **Hadamard basis** (or diagonal basis).

---

## 3.5 Expansions in Orthonormal Bases

If ${|e_1>, ..., |e_n>}$ is an orthonormal basis, any vector $|v>$ can be written:

$ |v> = sum_(k=1)^n <e_k|v> |e_k> $

The coefficients $<e_k|v>$ are the **expansion coefficients** (or components) of $|v>$ in this basis.

### Worked Example 3.4

Express $|v> = mat(3; 1 + i)$ in the computational basis ${|0>, |1>}$ and in the Hadamard basis ${|+>, |->}$.

**Solution (computational basis):**

$<0|v> = 3, quad <1|v> = 1 + i$

$|v> = 3|0> + (1 + i)|1>$

**Solution (Hadamard basis):**

$<+|v> = 1/sqrt(2)(3 + 1 + i) = (4 + i)/sqrt(2)$

$<-|v> = 1/sqrt(2)(3 - (1 + i)) = (2 - i)/sqrt(2)$

$|v> = (4 + i)/sqrt(2) |+> + (2 - i)/sqrt(2) |->$

---

## 3.6 Projection onto a Subspace

The **projection** of $|v>$ onto a normalized vector $|e>$ is:

$ "Proj"_(|e>) |v> = <e|v> |e> $

The **projection operator** onto the subspace spanned by ${|e_1>, ..., |e_k>}$ is:

$ P = sum_(j=1)^k |e_j><e_j| $

Properties of projection operators:
- $P^2 = P$ (idempotent)
- $P^dagger = P$ (Hermitian)
- $P$ projects any vector onto the subspace and leaves vectors already in the subspace unchanged

---

## Common Mistakes

- **Forgetting the conjugate**: In $<u|v> = sum overline(u_k) v_k$, the conjugation is on the *first* vector's components. Swapping the order gives the conjugate: $<v|u> = overline(<u|v>)$.
- **Confusing projection with projection operator**: The projection *of a vector* is another vector ($<e|v> |e>$); the projection *operator* is a matrix ($|e><e|$).
- **Assuming all bases are orthonormal**: Only orthonormal bases give clean expansion formulas. Non-orthogonal bases require solving a system of equations.

---

## Revision Checklist

- [ ] I can compute inner products $<u|v>$ in $CC^n$
- [ ] I can compute the norm $||v|| = sqrt(<v|v>)$ and normalize a vector
- [ ] I can check whether a set of vectors is orthonormal
- [ ] I can expand a vector in an orthonormal basis
- [ ] I understand projection operators and can construct them from a basis
