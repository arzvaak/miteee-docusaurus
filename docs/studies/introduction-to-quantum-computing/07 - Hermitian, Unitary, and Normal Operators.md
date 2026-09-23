---
title: "07 - Hermitian, Unitary, and Normal Operators"
math_syntax: typst
---

# 07 — Hermitian, Unitary, and Normal Operators

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Three special classes of operators dominate quantum mechanics:
- **Hermitian operators** represent observables (measurable quantities) and have real eigenvalues
- **Unitary operators** represent reversible evolution (quantum gates) and preserve norms
- **Normal operators** include both and are guaranteed to be diagonalizable

Understanding these classes lets you recognize what a given gate or measurement does just by its algebraic properties.

---

## 7.1 Hermitian (Self-Adjoint) Operators

An operator $A$ is **Hermitian** (or **self-adjoint**) if:

$ A = A^dagger $

Equivalently: $<phi|A|psi> = overline(<psi|A|phi>)$ for all $|phi>, |psi>$.

### Properties of Hermitian Operators

1. **All eigenvalues are real**: If $A = A^dagger$ and $A|v> = lambda|v>$, then $lambda in RR$
2. **Eigenvectors for distinct eigenvalues are orthogonal**
3. **Spectral decomposition**: $A = sum_k lambda_k |e_k><e_k|$ with real $lambda_k$ and orthonormal $|e_k>$
4. **Diagonalizable**: Every Hermitian operator is diagonalizable by a unitary transformation

### Worked Example 7.1

Verify that the Pauli-Z gate $Z = mat(1 & 0; 0 & -1)$ is Hermitian and find its spectral decomposition.

**Solution:**

$Z^dagger = overline(Z)^T = mat(1 & 0; 0 & -1)^T = mat(1 & 0; 0 & -1) = Z$ ✓

Spectral decomposition (from Chapter 6): $Z = |0><0| - |1><1|$ with real eigenvalues $+1$ and $-1$ ✓

### Worked Example 7.2

Is $A = mat(1 & 1+i; 1-i & 2)$ Hermitian?

**Solution:**

$A^dagger = overline(A)^T = mat(1 & 1+i; 1-i & 2)^T = mat(1 & 1-i; 1+i & 2)$

Since $A^dagger = A$: the $(1,2)$ entry of $A$ is $1+i$ and the $(1,2)$ entry of $A^dagger$ is $1-i$. These are NOT equal.

Wait — let me recheck. $A = mat(1 & 1+i; 1-i & 2)$, so $overline(A) = mat(1 & 1-i; 1+i & 2)$, and $overline(A)^T = mat(1 & 1+i; 1-i & 2) = A$.

Yes, $A$ **is Hermitian**. ✓

---

## 7.2 Unitary Operators

An operator $U$ is **unitary** if:

$ U U^dagger = U^dagger U = I $

Equivalently: $U^(-1) = U^dagger$.

### Properties of Unitary Operators

1. **Preserve inner products**: $<U phi|U psi> = <phi|psi>$ for all $|phi>, |psi>$
2. **Preserve norms**: $||U|v>|| = ||v||$
3. **Eigenvalues have unit modulus**: $|lambda_k| = 1$, so $lambda_k = e^(i theta_k)$
4. **Eigenvectors for distinct eigenvalues are orthogonal**
5. **Product of unitaries is unitary**: If $U$ and $V$ are unitary, so is $U V$
6. **Inverse of a unitary is unitary**: $(U^(-1))^dagger = U$, so $U^(-1)$ is unitary

### Worked Example 7.3

Show that the Hadamard gate $H = 1/sqrt(2) mat(1 & 1; 1 & -1)$ is unitary.

**Solution:**

$H^dagger = overline(H)^T = 1/sqrt(2) mat(1 & 1; 1 & -1)^T = 1/sqrt(2) mat(1 & 1; 1 & -1) = H$

So $H^dagger = H$ (the Hadamard gate is also Hermitian).

$H H^dagger = H^2 = 1/2 mat(1 & 1; 1 & -1) mat(1 & 1; 1 & -1) = 1/2 mat(2 & 0; 0 & 2) = mat(1 & 0; 0 & 1) = I$ ✓

### Worked Example 7.4

Show that $U = mat(1/sqrt(2) & i/sqrt(2); i/sqrt(2) & 1/sqrt(2))$ is unitary.

**Solution:**

$U^dagger = mat(1/sqrt(2) & -i/sqrt(2); -i/sqrt(2) & 1/sqrt(2))$

$U U^dagger = mat(1/sqrt(2) & i/sqrt(2); i/sqrt(2) & 1/sqrt(2)) mat(1/sqrt(2) & -i/sqrt(2); -i/sqrt(2) & 1/sqrt(2))$

$= mat(1/2 + 1/2 & -i/2 + i/2; i/2 - i/2 & 1/2 + 1/2) = mat(1 & 0; 0 & 1) = I$ ✓

**Yes**, $U$ is unitary.

### Worked Example 7.4b

Is $V = mat(1/2 & i/2; i/2 & 1/2)$ unitary?

$V^dagger = mat(1/2 & -i/2; -i/2 & 1/2)$

$V V^dagger = mat(1/4 + 1/4 & -i/4 + i/4; i/4 - i/4 & 1/4 + 1/4) = mat(1/2 & 0; 0 & 1/2) != I$

This matrix is **not unitary**.

---

## 7.3 Normal Operators

An operator $N$ is **normal** if it commutes with its adjoint:

$ N N^dagger = N^dagger N $

### Relationship Between Classes

| Class | Definition | Key Property |
|-------|-----------|--------------|
| Hermitian | $A = A^dagger$ | Real eigenvalues |
| Unitary | $U U^dagger = I$ | Eigenvalues on unit circle |
| Normal | $N N^dagger = N^dagger N$ | Diagonalizable by unitary |

Every Hermitian operator is normal ($A A = A A$). Every unitary operator is normal ($U U^dagger = U^dagger U = I$). But there exist normal operators that are neither Hermitian nor unitary.

**The Spectral Theorem for Normal Operators:** A matrix $N$ is normal if and only if it can be diagonalized by a unitary matrix:

$ N = U D U^dagger $

where $D$ is diagonal and $U$ is unitary.

---

## 7.4 Pauli Matrices — The Complete Set

The three Pauli matrices are the foundational single-qubit gates:

$ X = mat(0 & 1; 1 & 0) quad "(Pauli-X, bit flip)" $

$ Y = mat(0 & -i; i & 0) quad "(Pauli-Y)" $

$ Z = mat(1 & 0; 0 & -1) quad "(Pauli-Z, phase flip)" $

**Properties shared by all three:**
- Hermitian: $sigma_k = sigma_k^dagger$
- Unitary: $sigma_k^2 = I$
- Traceless: $tr(sigma_k) = 0$
- Eigenvalues: $+1$ and $-1$

**Commutation relations:**

$ [X, Y] = 2 i Z, quad [Y, Z] = 2 i X, quad [Z, X] = 2 i Y $

$ X Y = -Y X = i Z $
$ Y Z = -Z Y = i X $
$ Z X = -Z X = i Y $

**Anticommutation relations:**

$ {sigma_j, sigma_k} = 2 delta_(j k) I $

---

## 7.5 Spectral Decomposition of Unitary Operators

Any unitary $U$ can be written as:

$ U = sum_k e^(i theta_k) |e_k><e_k| $

This means every unitary is a "weighted projection" — it applies a phase $e^(i theta_k)$ to each eigenvector.

### Worked Example 7.5

Write the spectral decomposition of the Pauli-Z gate.

**Solution:**

Eigenvalues: $e^(i dot 0) = 1$ for $|0>$ and $e^(i pi) = -1$ for $|1>$.

$Z = e^(i dot 0) |0><0| + e^(i pi) |1><1| = |0><0| - |1><1>$

---

## Common Mistakes

- **Hermitian means real entries**: False. A Hermitian matrix can have complex entries (as long as $A_(j k) = overline(A_(k j))$). The diagonal must be real, but off-diagonal entries can be complex.
- **Unitary means orthogonal**: Unitary is the complex generalization of orthogonal. $U^dagger = U^(-1)$ reduces to $U^T = U^(-1)$ when $U$ is real.
- **Forgetting $U U^dagger = I$ AND $U^dagger U = I$**: For square matrices these are equivalent, but always verify both sides when in doubt.
- **Confusing $H^dagger$ with $H^(-1)$**: For the Hadamard gate, both are the same ($H = H^dagger = H^(-1)$) because $H$ is both Hermitian and unitary. This is not true for all gates.

---

## Revision Checklist

- [ ] I can verify whether an operator is Hermitian, unitary, or normal
- [ ] I know the spectral decomposition for Hermitian and unitary operators
- [ ] I can write the Pauli matrices and their commutation relations
- [ ] I understand why Hermitian operators have real eigenvalues
- [ ] I understand why unitary operators preserve inner products
- [ ] I know the spectral theorem: normal operators are diagonalizable by unitary transformations
