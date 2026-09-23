---
title: "06 - Eigenvalues, Eigenvectors, and the Spectral Theorem"
math_syntax: typst
---

# 06 — Eigenvalues, Eigenvectors, and the Spectral Theorem

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Measurement in quantum mechanics projects onto eigenvectors of an observable, and the eigenvalues are the possible measurement outcomes. Understanding eigenproblems is essential for understanding what happens when you measure a qubit.

---

## 6.1 Eigenvalues and Eigenvectors

For a linear operator $A$, a non-zero vector $|v>$ is an **eigenvector** with **eigenvalue** $lambda$ if:

$ A|v> = lambda|v> $

The set of all eigenvalues is the **spectrum** of $A$, denoted $sigma(A)$.

### Finding Eigenvalues

The eigenvalue equation $A|v> = lambda|v>$ can be rewritten as:

$ (A - lambda I)|v> = 0 $

For a non-trivial solution $|v> != 0$ to exist, we need:

$ det(A - lambda I) = 0 $

This is the **characteristic equation**.

### Worked Example 6.1

Find the eigenvalues and eigenvectors of the Pauli-Z gate $Z = mat(1 & 0; 0 & -1)$.

**Solution:**

$det(Z - lambda I) = det mat(1 - lambda & 0; 0 & -1 - lambda) = (1 - lambda)(-1 - lambda) = 0$

Eigenvalues: $lambda_1 = 1$, $lambda_2 = -1$.

For $lambda_1 = 1$: $(Z - I)|v> = mat(0 & 0; 0 & -2)|v> = 0$ implies $|v> = mat(a; 0) = a|0>$.

Eigenvector: $|0>$ with eigenvalue $+1$.

For $lambda_2 = -1$: $(Z + I)|v> = mat(2 & 0; 0 & 0)|v> = 0$ implies $|v> = mat(0; b) = b|1>$.

Eigenvector: $|1>$ with eigenvalue $-1$.

**Physical meaning:** Measuring a qubit in the $Z$ basis gives $+1$ (corresponding to state $|0>$) or $-1$ (corresponding to state $|1>$).

---

## 6.2 Properties of Eigenvalues

For an $n times n$ matrix $A$ with eigenvalues $lambda_1, ..., lambda_n$ (counted with multiplicity):

1. $det(A) = product_(k=1)^n lambda_k$
2. $tr(A) = sum_(k=1)^n lambda_k$
3. If $A|v> = lambda|v>$, then $A^k|v> = lambda^k|v>$ for any positive integer $k$
4. If $A$ is invertible, $A^(-1)|v> = (1/lambda)|v>$
5. The eigenvalues of $A^dagger$ are $overline(lambda_1), ..., overline(lambda_n)$

---

## 6.3 Diagonalization

A matrix $A$ is **diagonalizable** if there exists an invertible matrix $P$ such that:

$ A = P D P^(-1) $

where $D$ is a diagonal matrix of eigenvalues. Equivalently, $A$ is diagonalizable if and only if it has $n$ linearly independent eigenvectors.

The columns of $P$ are the eigenvectors of $A$.

### Worked Example 6.2

Diagonalize the matrix $A = mat(2 & 1; 1 & 2)$.

**Solution:**

Characteristic equation: $(2 - lambda)^2 - 1 = 0$, so $lambda = 1$ or $lambda = 3$.

Eigenvector for $lambda = 1$: $mat(1 & 1; 1 & 1)|v> = 0$ gives $|v> = 1/sqrt(2) mat(1; -1)$.

Eigenvector for $lambda = 3$: $mat(-1 & 1; 1 & -1)|v> = 0$ gives $|v> = 1/sqrt(2) mat(1; 1)$.

$P = 1/sqrt(2) mat(1 & 1; -1 & 1)$, $D = mat(1 & 0; 0 & 3)$

$A = P D P^(-1)$ where $P^(-1) = P^T = P^dagger$ (since the eigenvectors are orthonormal).

---

## 6.4 The Spectral Decomposition Theorem

**Theorem (Spectral Decomposition):** If $A$ is a Hermitian (or more generally, normal) matrix with eigenvalues $lambda_1, ..., lambda_n$ and corresponding orthonormal eigenvectors $|e_1>, ..., |e_n>$, then:

$ A = sum_(k=1)^n lambda_k |e_k><e_k| $

This is one of the most important results in quantum mechanics. It says that any Hermitian operator can be decomposed into a sum of projection operators onto its eigenspaces, weighted by the eigenvalues.

### Worked Example 6.3

Write the spectral decomposition of the Pauli-Z gate.

**Solution:**

From Example 6.1, the eigenvalues are $+1$ (eigenvector $|0>$) and $-1$ (eigenvector $|1>$).

$Z = (+1)|0><0| + (-1)|1><1| = |0><0| - |1><1|$

**Verification:** $|0><0| - |1><1| = mat(1 & 0; 0 & 0) - mat(0 & 0; 0 & 1) = mat(1 & 0; 0 & -1) = Z$ ✓

---

## 6.5 The Characteristic Polynomial for $2 times 2$ Matrices

For a $2 times 2$ matrix $A = mat(a & b; c & d)$:

$ det(A - lambda I) = lambda^2 - (a + d)lambda + (a d - b c) = 0 $

$ lambda = ((a + d) +/- sqrt((a + d)^2 - 4(a d - b c)))/2 $

Using trace and determinant:

$ lambda = (tr(A) +/- sqrt(tr(A)^2 - 4 det(A)))/2 $

### Worked Example 6.4

Find the eigenvalues of $A = mat(0 & 1; 1 & 0)$ (Pauli-X).

**Solution:**

$tr(A) = 0$, $det(A) = -1$.

$ lambda = (0 +/- sqrt(0 + 4))/2 = +/- 1 $

Eigenvalues: $lambda = +1$ (eigenvector $|+>$) and $lambda = -1$ (eigenvector $|->$).

---

## 6.6 Algebraic and Geometric Multiplicity

- **Algebraic multiplicity** of eigenvalue $lambda$: the number of times it appears as a root of the characteristic polynomial
- **Geometric multiplicity** of eigenvalue $lambda$: the dimension of the eigenspace (number of linearly independent eigenvectors)

Always: $1 <= "geometric multiplicity" <= "algebraic multiplicity"$

A matrix is diagonalizable if and only if the geometric multiplicity equals the algebraic multiplicity for every eigenvalue.

---

## Common Mistakes

- **Not normalizing eigenvectors**: Eigenvectors are only determined up to a scalar multiple. Always normalize them when using them as a basis.
- **Confusing eigenvalue equation with matrix equation**: $A|v> = lambda|v>$ is not a system of linear equations in the usual sense — it is an eigenvalue problem.
- **Assuming all matrices are diagonalizable**: Non-normal matrices may not be diagonalizable (they may not have enough eigenvectors). Hermitian and unitary matrices are always diagonalizable.
- **Forgetting complex eigenvalues**: Even a real matrix can have complex eigenvalues (e.g., rotation matrices).

---

## Revision Checklist

- [ ] I can find eigenvalues using the characteristic equation
- [ ] I can find eigenvectors by solving $(A - lambda I)|v> = 0$
- [ ] I can diagonalize a $2 times 2$ matrix
- [ ] I understand the spectral decomposition theorem
- [ ] I can write the spectral decomposition for Pauli gates
- [ ] I know the relationship between eigenvalues and trace/determinant
