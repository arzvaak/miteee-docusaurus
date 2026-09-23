---
title: "04 - Linear Independence, Bases, and Dimension"
math_syntax: typst
---

# 04 — Linear Independence, Bases, and Dimension

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Bases are the coordinate systems of quantum computing. The number of basis vectors tells us the dimension of the Hilbert space (and hence how many qubits we can describe). Choosing the right basis — computational, Hadamard, or Bell — is often the key to solving a quantum algorithm.

---

## 4.1 Linear Dependence and Independence

A set of vectors ${|v_1>, |v_2>, ..., |v_n>}$ is **linearly dependent** if there exist complex scalars $a_1, a_2, ..., a_n$, not all zero, such that:

$ a_1 |v_1> + a_2 |v_2> + dots.h + a_n |v_n> = 0 $

If the only solution is $a_1 = a_2 = dots.h = a_n = 0$, the set is **linearly independent**.

### Worked Example 4.1

Determine whether $|v_1> = mat(1; 1)$, $|v_2> = mat(1; -1)$, $|v_3> = mat(2; 0)$ are linearly independent.

**Solution:**

We need to check if $a_1 mat(1; 1) + a_2 mat(1; -1) + a_3 mat(2; 0) = mat(0; 0)$ has a non-trivial solution.

System:
$a_1 + a_2 + 2 a_3 = 0$
$a_1 - a_2 = 0$

From the second equation: $a_1 = a_2$. Substituting into the first: $2 a_1 + 2 a_3 = 0$, so $a_3 = -a_1$.

Choose $a_1 = 1$: $|v_1> + |v_2> - |v_3> = 0$.

The vectors are **linearly dependent** (as expected — $CC^2$ has dimension 2, so any 3 vectors must be dependent).

### Worked Example 4.2

Show that $|0> = mat(1; 0)$ and $|1> = mat(0; 1)$ are linearly independent.

**Solution:**

$a_1 mat(1; 0) + a_2 mat(0; 1) = mat(a_1; a_2) = mat(0; 0)$

implies $a_1 = 0$ and $a_2 = 0$. Therefore $|0>$ and $|1>$ are linearly independent.

---

## 4.2 Spanning Sets

A set of vectors ${|v_1>, ..., |v_n>}$ **spans** (or is a **spanning set** for) a vector space $V$ if every vector in $V$ can be written as a linear combination of ${|v_1>, ..., |v_n>}$.

### Worked Example 4.3

Show that ${mat(1; 0), mat(0; 1)}$ spans $CC^2$.

**Solution:**

Any vector $mat(a; b) in CC^2$ can be written as:

$ mat(a; b) = a mat(1; 0) + b mat(0; 1) $

Since $a, b$ are arbitrary complex numbers, every vector in $CC^2$ is representable. ✓

---

## 4.3 Basis and Dimension

A **basis** for a vector space $V$ is a set of vectors that is:
1. **Linearly independent**
2. **Spanning** for $V$

The **dimension** of $V$ is the number of vectors in any basis (this is well-defined — all bases have the same size).

### Fundamental Theorem

For an $n$-dimensional vector space:
- Any set of $n$ linearly independent vectors is a basis
- Any spanning set of $n$ vectors is a basis
- Any linearly independent set can be extended to a basis
- Any spanning set contains a basis

---

## 4.4 Common Bases in Quantum Computing

### Computational (Standard) Basis for $CC^2$

$ |0> = mat(1; 0), quad |1> = mat(0; 1) $

### Hadamard (Diagonal) Basis for $CC^2$

$ |+> = 1/sqrt(2)(|0> + |1>), quad |-> = 1/sqrt(2)(|0> - |1>) $

### Circular Basis for $CC^2$

$ |+i> = 1/sqrt(2)(|0> + i|1>), quad |-i> = 1/sqrt(2)(|0> - i|1>) $

### Computational Basis for $CC^4$ (Two Qubits)

$ |00>, quad |01>, quad |10>, quad |11> $

### Bell Basis for $CC^4$

$ |Phi^+> = 1/sqrt(2)(|00> + |11>) $
$ |Phi^-> = 1/sqrt(2)(|00> - |11>) $
$ |Psi^+> = 1/sqrt(2)(|01> + |10>) $
$ |Psi^-> = 1/sqrt(2)(|01> - |10>) $

---

## 4.5 Change of Basis

Given a vector $|v>$ expressed in basis $A = {|a_1>, |a_2>}$ as $|v> = alpha_1 |a_1> + alpha_2 |a_2>$, and a new orthonormal basis $B = {|b_1>, |b_2>}$, the components in the new basis are:

$ beta_j = <b_j|v> = sum_k <b_j|a_k> alpha_k $

The matrix $S_(j k) = <b_j|a_k>$ is called the **change-of-basis matrix** (or transition matrix).

### Worked Example 4.4

Express $|0>$ in the Hadamard basis ${|+>, |->}$.

**Solution:**

$<+|0> = 1/sqrt(2)(1) = 1/sqrt(2)$

$<-|0> = 1/sqrt(2)(1) = 1/sqrt(2)$

$|0> = 1/sqrt(2) |+> + 1/sqrt(2) |->$

Similarly, $|1> = 1/sqrt(2) |+> - 1/sqrt(2) |->$.

This shows that measuring $|0>$ in the Hadamard basis gives $|+>$ or $|->$ with equal probability.

---

## 4.6 Dimension Arguments in Quantum Computing

- A single qubit lives in $CC^2$ (dimension 2)
- Two qubits live in $CC^4$ (dimension 4) via the tensor product $CC^2 times.circle CC^2$
- $n$ qubits live in $CC^(2^n)$ (dimension $2^n$)
- An $n$-qubit system can exist in a superposition of $2^n$ basis states simultaneously — this is the source of quantum computational power

---

## Common Mistakes

- **More vectors than dimensions = dependence**: In $CC^n$, any set of more than $n$ vectors is automatically linearly dependent.
- **Confusing basis with coordinate representation**: The basis ${|0>, |1>}$ and the matrices $mat(1; 0)$, $mat(0; 1)$ are the same thing — just different notations.
- **Assuming the basis is unique**: A vector space has infinitely many bases. The choice of basis is a choice of coordinate system.

---

## Revision Checklist

- [ ] I can test whether a set of vectors is linearly independent
- [ ] I can determine whether a set of vectors spans a vector space
- [ ] I know the standard, Hadamard, circular, and Bell bases for qubit systems
- [ ] I can change between bases using the inner product
- [ ] I understand that $n$ qubits live in a $2^n$-dimensional space
