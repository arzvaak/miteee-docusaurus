---
title: "05 - Operators and Matrices"
math_syntax: typst
---

# 05 — Operators and Matrices

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Quantum gates are operators. Measurement is an operator. The entire dynamics of a quantum system is described by operators acting on state vectors. This chapter builds the machinery: what an operator is, how to represent it as a matrix, and how to manipulate it.

---

## 5.1 Linear Operators

A **linear operator** $A$ on a vector space $V$ is a function $A: V -> V$ satisfying:

$ A(alpha|v> + beta|w>) = alpha A|v> + beta A|w> $

for all $|v>, |w> in V$ and $alpha, beta in CC$.

**Examples:**
- The identity operator: $I|v> = |v>$
- The zero operator: $0|v> = 0$
- Scalar multiplication: $z I |v> = z|v>$

---

## 5.2 Matrix Representation

In a basis ${|e_1>, ..., |e_n>}$, an operator $A$ is represented by the $n times n$ matrix with entries:

$ A_(j k) = <e_j|A|e_k> $

To compute $A|v>$: express $|v>$ in the basis, then multiply the matrix by the column vector.

### Worked Example 5.1

Let $A$ be defined by $A|0> = |1>$ and $A|1> = |0>$ (the bit-flip or NOT operator). Find its matrix in the computational basis.

**Solution:**

$A_(1 1) = <0|A|0> = <0|1> = 0$
$A_(1 2) = <0|A|1> = <0|0> = 1$
$A_(2 1) = <1|A|0> = <1|1> = 1$
$A_(2 2) = <1|A|1> = <1|0> = 0$

$A = mat(0 & 1; 1 & 0)$

This is the **Pauli-X gate**.

---

## 5.3 Operator Algebra

For operators $A, B$ on $V$:

- **Sum**: $(A + B)|v> = A|v> + B|v>$
- **Product**: $(A B)|v> = A(B|v>)$ (apply $B$ first, then $A$)
- **Composition is generally not commutative**: $A B != B A$ in general

The **commutator** is:

$ [A, B] = A B - B A $

The **anticommutator** is:

$ {A, B} = A B + B A $

### Worked Example 5.2

Compute the commutator $[X, Z]$ where $X = mat(0 & 1; 1 & 0)$ and $Z = mat(1 & 0; 0 & -1)$.

**Solution:**

$X Z = mat(0 & 1; 1 & 0) mat(1 & 0; 0 & -1) = mat(0 & -1; 1 & 0)$

$Z X = mat(1 & 0; 0 & -1) mat(0 & 1; 1 & 0) = mat(0 & 1; -1 & 0)$

$[X, Z] = X Z - Z X = mat(0 & -2; 2 & 0) = -2i Y$

where $Y = mat(0 & -i; i & 0)$ is the Pauli-Y gate.

---

## 5.4 The Adjoint (Hermitian Conjugate)

The **adjoint** (or Hermitian conjugate) of an operator $A$ is the unique operator $A^dagger$ satisfying:

$ <phi|A|psi> = overline(<psi|A^dagger|phi>) $

for all $|phi>, |psi>$.

**Matrix computation:** $A^dagger = overline(A)^T$ (conjugate transpose — take the complex conjugate of every entry, then transpose).

### Worked Example 5.3

Find the adjoint of $A = mat(1 & i; 2 & 1-i)$.

**Solution:**

Step 1: Conjugate: $overline(A) = mat(1 & -i; 2 & 1+i)$

Step 2: Transpose: $A^dagger = mat(1 & 2; -i & 1+i)$

---

## 5.5 Properties of the Adjoint

For operators $A, B$ and scalar $z$:

1. $(A^dagger)^dagger = A$
2. $(A + B)^dagger = A^dagger + B^dagger$
3. $(z A)^dagger = overline(z) A^dagger$
4. $(A B)^dagger = B^dagger A^dagger$ (note the reversal!)
5. $<v|A|v>$ is real for any $|v>$ if and only if $A = A^dagger$

Property 4 is especially important — the order reverses when taking the adjoint of a product.

---

## 5.6 The Inverse Operator

An operator $A$ has an **inverse** $A^(-1)$ if $A A^(-1) = A^(-1) A = I$. An operator is **invertible** (or non-singular) if and only if $det(A) != 0$.

If $A$ is invertible, then:
- $(A^(-1))^(-1) = A$
- $(A B)^(-1) = B^(-1) A^(-1)$ (order reversal, like the adjoint)
- $(A^dagger)^(-1) = (A^(-1))^dagger$

---

## 5.7 The Trace

The **trace** of an $n times n$ matrix is the sum of its diagonal entries:

$ tr(A) = sum_(k=1)^n A_(k k) $

Properties:
- $tr(A B) = tr(B A)$ (cyclic property)
- $tr(A) = sum_i lambda_i$ where $lambda_i$ are the eigenvalues
- $tr(A^dagger) = overline(tr(A))$
- The trace is basis-independent

---

## Common Mistakes

- **Order matters**: $A B != B A$ in general. When writing operator products, the order is critical.
- **Adjoint reverses order**: $(A B)^dagger = B^dagger A^dagger$, NOT $A^dagger B^dagger$.
- **Conjugate, then transpose**: For the adjoint, first take the element-wise complex conjugate, then transpose. Do not transpose first.
- **Confusing the adjoint with the inverse**: $A^dagger$ and $A^(-1)$ are different concepts. They coincide only for unitary operators.

---

## Revision Checklist

- [ ] I can represent a linear operator as a matrix in a given basis
- [ ] I can compute the adjoint (Hermitian conjugate) of a matrix
- [ ] I understand operator algebra: sum, product, commutator
- [ ] I know the five key properties of the adjoint
- [ ] I can compute the trace and understand its basis-independence
- [ ] I understand the difference between the adjoint and the inverse
