---
title: "Formula and Methods"
math_syntax: typst
---

# Formula and Methods

> *Consolidated reference sheet for all key formulas, identities, and derivation methods in this course.*

---

## Complex Numbers

| Formula | Description |
|---------|------------|
| $z = a + i b$ | Complex number in rectangular form |
| $overline(z) = a - i b$ | Complex conjugate |
| $|z| = sqrt(a^2 + b^2)$ | Modulus |
| $z overline(z) = |z|^2$ | Modulus squared |
| $z = r e^(i theta)$ | Polar form ($r = |z|$, $theta = arg(z)$) |
| $e^(i theta) = cos theta + i sin theta$ | Euler's formula |

---

## Vector Space Operations

**Inner product** ($CC^n$):

$ <u|v> = sum_(k=1)^n overline(u_k) v_k $

**Norm:**

$ ||v|| = sqrt(<v|v>) $

**Normalization:**

$ |hat(v)> = |v> / ||v|| $

**Orthonormality condition:**

$ <e_i|e_j> = delta_(i j) $

---

## Basis Expansions

**Expansion in orthonormal basis:**

$ |v> = sum_k <e_k|v> |e_k> $

**Completeness relation:**

$ sum_k |e_k><e_k| = I $

**Projection onto basis vector:**

$ "Proj"_(|e>) |v> = <e|v> |e> $

---

## Operator Algebra

| Operation | Formula |
|-----------|---------|
| Adjoint | $A^dagger = overline(A)^T$ |
| Product adjoint | $(A B)^dagger = B^dagger A^dagger$ |
| Commutator | $[A, B] = A B - B A$ |
| Anticommutator | ${A, B} = A B + B A$ |
| Inverse of product | $(A B)^(-1) = B^(-1) A^(-1)$ |
| Trace | $tr(A) = sum_k A_(k k)$ |
| Cyclic trace | $tr(A B) = tr(B A)$ |

---

## Spectral Decomposition

**Hermitian operator:**

$ A = sum_k lambda_k |e_k><e_k| $ (real $lambda_k$, orthonormal $|e_k>$)

**Unitary operator:**

$ U = sum_k e^(i theta_k) |e_k><e_k| $ ($|lambda_k| = 1$)

**2×2 eigenvalue formula:**

$ lambda = (tr(A) +/- sqrt(tr(A)^2 - 4 det(A)))/2 $

---

## Key Properties

**Hermitian operator:** $A = A^dagger$ → real eigenvalues, orthogonal eigenvectors

**Unitary operator:** $U U^dagger = I$ → preserves inner products, eigenvalues on unit circle

**Normal operator:** $N N^dagger = N^dagger N$ → diagonalizable by unitary

---

## Pauli Matrix Identities

$ X^2 = Y^2 = Z^2 = I $

$ X Y = i Z, quad Y Z = i X, quad Z X = i Y $

$ Y X = -i Z, quad Z Y = -i X, quad X Z = -i Y $

$ [X, Y] = 2 i Z, quad [Y, Z] = 2 i X, quad [Z, X] = 2 i Y $

$ {sigma_j, sigma_k} = 2 delta_(j k) I $

---

## Common Gate Matrices

$ X = mat(0 & 1; 1 & 0), quad Y = mat(0 & -i; i & 0), quad Z = mat(1 & 0; 0 & -1) $

$ H = 1/sqrt(2) mat(1 & 1; 1 & -1), quad S = mat(1 & 0; 0 & i), quad T = mat(1 & 0; 0 & e^(i pi/4)) $

$ "CNOT" = mat(1 & 0 & 0 & 0; 0 & 1 & 0 & 0; 0 & 0 & 0 & 1; 0 & 0 & 1 & 0) $

$ "SWAP" = mat(1 & 0 & 0 & 0; 0 & 0 & 1 & 0; 0 & 1 & 0 & 0; 0 & 0 & 0 & 1) $

$ "CZ" = mat(1 & 0 & 0 & 0; 0 & 1 & 0 & 0; 0 & 0 & 1 & 0; 0 & 0 & 0 & -1) $

---

## Qubit State Parametrization (Bloch Sphere)

$ |psi> = cos(theta/2) |0> + e^(i phi) sin(theta/2) |1> $

Bloch vector: $(sin theta cos phi, quad sin theta sin phi, quad cos theta)$

| State | $(theta, phi)$ | Bloch vector |
|-------|----------------|-------------|
| $\|0>$ | $(0, -)$ | $(0, 0, 1)$ |
| $\|1>$ | $(pi, -)$ | $(0, 0, -1)$ |
| $\|+>$ | $(pi/2, 0)$ | $(1, 0, 0)$ |
| $\|->$ | $(pi/2, pi)$ | $(-1, 0, 0)$ |
| $\|+i>$ | $(pi/2, pi/2)$ | $(0, 1, 0)$ |
| $\|-i>$ | $(pi/2, 3pi/2)$ | $(0, -1, 0)$ |

---

## Tensor Product

$ mat(a; b) times.circle mat(c; d) = mat(a c; a d; b c; b d) $

$ (A times.circle B)(|v> times.circle |w>) = (A|v>) times.circle (B|w>) $

Kronecker product:

$ A times.circle B = mat(A_(11) B & A_(12) B; A_(21) B & A_(22) B) $

---

## Measurement

**Born rule** (eigenvalue $lambda_k$ with eigenvector $|e_k>$):

$ P(lambda_k) = |<e_k|psi>|^2 $

**Post-measurement state:**

$ |psi'> = |e_k> $ (for non-degenerate measurement)

**General projection:**

$ P(lambda_k) = <psi|Pi_k|psi> $

$ |psi'> = (Pi_k |psi>) / sqrt(P(lambda_k)) $

---

## Density Matrix

**Pure state:** $rho = |psi><psi|$

**Mixed state:** $rho = sum_k p_k |psi_k><psi_k|$

**Properties:** $rho = rho^dagger$, $tr(rho) = 1$, $rho >= 0$

**Purity test:** $tr(rho^2) = 1$ (pure), $tr(rho^2) < 1$ (mixed)

**Partial trace (2 qubits):**

$ rho_A = tr_B(rho) = <0_B|rho|0_B> + <1_B|rho|1_B> $

---

## Bell States

$ |Phi^+> = 1/sqrt(2)(|00> + |11>) $

$ |Phi^->  = 1/sqrt(2)(|00> - |11>) $

$ |Psi^+> = 1/sqrt(2)(|01> + |10>) $

$ |Psi^->  = 1/sqrt(2)(|01> - |10>) $

---

## QFT

$ "QFT" |j> = 1/sqrt(2^n) sum_(k=0)^(2^n - 1) e^(2 pi i j k / 2^n) |k> $

**2-qubit QFT:**

$ "QFT"_2 = 1/2 mat(1 & 1 & 1 & 1; 1 & i & -1 & -i; 1 & -1 & 1 & -1; 1 & -i & -1 & i) $

---

## Key Derivations to Know

1. **Completeness from orthonormality**: If ${|e_k>}$ is orthonormal, $sum_k |e_k><e_k| = I$ (multiply both sides of $|v> = sum_k <e_k|v>|e_k>$ by $<w|$).

2. **Hermitian eigenvalues are real**: $lambda <v|v> = <v|A|v> = overline(<v|A|v>) = overline(lambda) <v|v>$, so $lambda = overline(lambda)$.

3. **Unitary preserves norms**: $||U|v>||^2 = <v|U^dagger U|v> = <v|v> = ||v||^2$.

4. **No-cloning proof**: Assume $U|psi>|0> = |psi>|psi>$ and $U|phi>|0> = |phi>|phi>$. Then $<phi|psi> = <phi|psi>^2$, forcing $<phi|psi> in {0, 1}$.

5. **Teleportation algebra**: Expand $(alpha|0> + beta|1>) times.circle 1/sqrt(2)(|00> + |11>)$ in the Bell basis for qubits 1 and 2 to obtain the four equal-probability branches.
