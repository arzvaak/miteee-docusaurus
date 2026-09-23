---
title: "09 - Qubits and the Bloch Sphere"
math_syntax: typst
---

# 09 — Qubits and the Bloch Sphere

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

The qubit is the fundamental unit of quantum information. The Bloch sphere provides a geometric picture of all possible single-qubit states, making abstract Hilbert space vectors tangible and visual.

---

## 9.1 What Is a Qubit?

A **qubit** is a quantum system whose state space is $CC^2$. A general pure state is:

$ |psi> = alpha |0> + beta |1> $

where $alpha, beta in CC$ and the normalization condition $|alpha|^2 + |beta|^2 = 1$ must hold.

Since normalization removes one real degree of freedom, and the global phase is unobservable, a pure qubit state has exactly **2 real parameters**.

---

## 9.2 Parametrization of the Qubit State

We can write:

$ alpha = cos(theta/2) e^(i phi_1), quad beta = sin(theta/2) e^(i phi_2) $

Dropping the global phase $e^(i phi_1)$ (since it is unobservable), we set $phi_1 = 0$ and define $phi = phi_2 - phi_1$:

$ |psi> = cos(theta/2) |0> + e^(i phi) sin(theta/2) |1> $

where $theta in [0, pi]$ and $phi in [0, 2pi)$.

---

## 9.3 The Bloch Sphere

Every pure qubit state corresponds to a point on the **Bloch sphere** with coordinates:

$ (x, y, z) = (sin theta cos phi, quad sin theta sin phi, quad cos theta) $

The Bloch sphere is a unit sphere in $RR^3$:

- **North pole** ($theta = 0$): $|0>$ (eigenstate of $Z$ with eigenvalue $+1$)
- **South pole** ($theta = pi$): $|1>$ (eigenstate of $Z$ with eigenvalue $-1$)
- **Equator** ($theta = pi/2$):
  - $phi = 0$: $|+> = 1/sqrt(2)(|0> + |1>)$ (eigenstate of $X$ with eigenvalue $+1$)
  - $phi = pi$: $|-> = 1/sqrt(2)(|0> - |1>)$ (eigenstate of $X$ with eigenvalue $-1$)
  - $phi = pi/2$: $|+i> = 1/sqrt(2)(|0> + i|1>)$ (eigenstate of $Y$ with eigenvalue $+1$)
  - $phi = 3pi/2$: $|-i> = 1/sqrt(2)(|0> - i|1>)$ (eigenstate of $Y$ with eigenvalue $-1$)

---

## 9.4 Key Bloch Sphere Points

| State | $theta$ | $phi$ | Bloch vector |
|-------|---------|-------|-------------|
| $\|0>$ | $0$ | — | $(0, 0, 1)$ |
| $\|1>$ | $pi$ | — | $(0, 0, -1)$ |
| $\|+>$ | $pi/2$ | $0$ | $(1, 0, 0)$ |
| $\|->$ | $pi/2$ | $pi$ | $(-1, 0, 0)$ |
| $\|+i>$ | $pi/2$ | $pi/2$ | $(0, 1, 0)$ |
| $\|-i>$ | $pi/2$ | $3pi/2$ | $(0, -1, 0)$ |

---

## 9.5 Mixed States and the Density Matrix

A **pure state** is one that can be written as a single ket $|psi>$. A **mixed state** is a classical probabilistic mixture of pure states.

The **density matrix** for a pure state $|psi>$ is:

$ rho = |psi><psi| $

For a statistical ensemble where the system is in state $|psi_k>$ with probability $p_k$:

$ rho = sum_k p_k |psi_k><psi_k| $

### Properties of Density Matrices

1. $rho = rho^dagger$ (Hermitian)
2. $tr(rho) = 1$ (normalized)
3. $rho >= 0$ (positive semi-definite: all eigenvalues $>= 0$)
4. $tr(rho^2) <= 1$ with equality if and only if $rho$ is a pure state

### Worked Example 9.1

Write the density matrix for the state $|psi> = alpha|0> + beta|1>$.

**Solution:**

$ rho = |psi><psi| = (alpha|0> + beta|1>)(overline(alpha)<0| + overline(beta)<1|) $

$ = |alpha|^2 |0><0| + alpha overline(beta) |0><1| + overline(alpha) beta |1><0| + |beta|^2 |1><1| $

$ = mat(|alpha|^2 & alpha overline(beta); overline(alpha) beta & |beta|^2) $

**Verification:** $tr(rho) = |alpha|^2 + |beta|^2 = 1$ ✓

$tr(rho^2) = tr(rho) = 1$ (since $rho^2 = rho$ for pure states) ✓

---

## 9.6 The Density Matrix for Mixed States

### Worked Example 9.2

A qubit is in state $|0>$ with probability $1/2$ and state $|1>$ with probability $1/2$. Write the density matrix.

**Solution:**

$ rho = 1/2 |0><0| + 1/2 |1><1| = 1/2 mat(1 & 0; 0 & 1) = I/2 $

$tr(rho^2) = tr(I/4) = 1/2 < 1$, confirming this is a mixed state.

**Physical meaning:** $rho = I/2$ represents complete ignorance — the qubit is maximally mixed. This is different from the superposition $1/sqrt(2)(|0> + |1>)$, which has density matrix $rho = mat(1/2 & 1/2; 1/2 & 1/2)$ with $tr(rho^2) = 1$.

---

## 9.7 Gate Actions on the Bloch Sphere

Every single-qubit unitary gate corresponds to a rotation on the Bloch sphere:

- **Pauli-X**: rotation by $pi$ about the $x$-axis (flips $|0> -> |1>$ and vice versa)
- **Pauli-Y**: rotation by $pi$ about the $y$-axis
- **Pauli-Z**: rotation by $pi$ about the $z$-axis (adds phase to $|1>$)
- **Hadamard**: rotation by $pi$ about the axis $(x + z)/sqrt(2)$ (maps $Z$ eigenstates to $X$ eigenstates)
- **Phase gate $S$**: rotation by $pi/2$ about the $z$-axis
- **$T$ gate**: rotation by $pi/4$ about the $z$-axis

---

## Common Mistakes

- **Confusing the Bloch sphere with $CC^2$**: The Bloch sphere is a *visualization* of qubit states. The actual state lives in the 4-dimensional real space of $CC^2$ (or the 2-dimensional complex space). The Bloch sphere loses the global phase information, which is fine because global phase is unobservable.
- **Bloch sphere is only for pure states**: The surface of the Bloch sphere represents pure states. Mixed states correspond to *interior* points. The maximally mixed state $I/2$ is at the center.
- **$theta/2$, not $theta$**: The parametrization uses $theta/2$ because a full $2pi$ rotation in $theta$ corresponds to a full $4pi$ rotation on the Bloch sphere (due to the $"SU"(2)$ structure). This means $|0>$ to $|1>$ is a $pi$ rotation, not $2pi$.

---

## Revision Checklist

- [ ] I can write a qubit state in the form $cos(theta/2)|0> + e^(i phi) sin(theta/2)|1>$
- [ ] I can locate key states ($|0>$, $|1>$, $|+>$, $|->$, $|+i>$, $|-i>$) on the Bloch sphere
- [ ] I can construct density matrices for pure and mixed states
- [ ] I can use $tr(rho^2)$ to distinguish pure from mixed states
- [ ] I understand how Pauli gates and the Hadamard gate act as rotations on the Bloch sphere
