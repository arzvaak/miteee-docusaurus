---
title: "08 - Quantum Postulates and Measurement"
math_syntax: typst
---

# 08 — Quantum Postulates and Measurement

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

The postulates of quantum mechanics are the "rules of the game." They tell us how states are described, how they evolve, and what happens when we measure. Everything else in quantum computing follows from these postulates.

---

## 8.1 The Four Postulates

### Postulate 1 — State Space

> The state of a quantum system is completely described by a unit vector $|psi>$ in a complex Hilbert space $H$.

For a single qubit: $H = CC^2$. For $n$ qubits: $H = CC^(2^n)$.

A **Hilbert space** is a complete inner product space. In finite dimensions (which is all we need for quantum computing), every inner product space is a Hilbert space.

**Key point:** The state vector $|psi>$ contains *all* information about the system. Two state vectors that differ only by a global phase ($|psi>$ and $e^(i theta)|psi>$) represent the *same* physical state.

---

### Postulate 2 — Composite Systems

> The state space of a composite quantum system is the tensor product of the individual state spaces.

For two qubits with states $|psi_1> in H_1$ and $|psi_2> in H_2$:

$ H = H_1 times.circle H_2 $

A general two-qubit state:

$ |psi> = sum_(i,j) c_(i j) |i>|j> = c_(0 0)|00> + c_(0 1)|01> + c_(1 0)|10> + c_(1 1)|11> $

**Example:** The state $1/sqrt(2)(|00> + |11>)$ is a valid two-qubit state that *cannot* be written as a product $|psi_1> times.circle |psi_2>$. This is entanglement.

---

### Postulate 3 — Evolution

> The evolution of a closed quantum system is described by a unitary operator.

$ |psi(t_2)> = U(t_1, t_2) |psi(t_1)> $

where $U$ is unitary: $U U^dagger = U^dagger U = I$.

**Why unitary?** Unitary evolution preserves the norm (and hence probabilities) and is reversible.

For a time-independent Hamiltonian $H$ (the energy operator, not the Hilbert space):

$ U(t) = e^(-i H t / planck.reduce) $

In quantum computing, we set $planck.reduce = 1$ and apply discrete gates, so:

$ |psi_("after")> = U_n U_(n-1) dots.h U_2 U_1 |psi_("initial")> $

---

### Postulate 4 — Measurement

> A measurable observable is represented by a Hermitian operator $A$. The possible outcomes of measuring $A$ are its eigenvalues $lambda_k$. If the system is in state $|psi>$, the probability of obtaining outcome $lambda_k$ is:

$ P(lambda_k) = ||Pi_k |psi>||^2 = <psi|Pi_k|psi> $

where $Pi_k = |e_k><e_k|$ is the projection onto the eigenspace of $lambda_k$.

> After measurement yielding outcome $lambda_k$, the post-measurement state is:

$ |psi'> = (Pi_k |psi>) / sqrt(P(lambda_k)) $

---

## 8.2 Projective Measurement in Detail

For a non-degenerate observable (all eigenvalues distinct), the measurement is particularly simple:

$ A = sum_k lambda_k |e_k><e_k| $

$ P(lambda_k) = |<e_k|psi>|^2 $

$ |psi'> = |e_k> $ (after normalization)

### Worked Example 8.1

A qubit is in the state $|psi> = 1/sqrt(3)|0> + sqrt(2/3)|1>$. Measure in the $Z$ basis (computational basis). What are the outcomes and their probabilities?

**Solution:**

The observable is $Z$ with eigenvalues $+1$ (eigenvector $|0>$) and $-1$ (eigenvector $|1>$).

$P(+1) = |<0|psi>|^2 = |1/sqrt(3)|^2 = 1/3$

$P(-1) = |<1|psi>|^2 = |sqrt(2/3)|^2 = 2/3$

If outcome is $+1$: state collapses to $|0>$.
If outcome is $-1$: state collapses to $|1>$.

---

## 8.3 Measurement in an Arbitrary Basis

Suppose we measure in the basis ${|e_1>, |e_2>}$ where:

$ |e_1> = 1/sqrt(2)(|0> + |1>), quad |e_2> = 1/sqrt(2)(|0> - |1>) $

For $|psi> = alpha|0> + beta|1>$:

$<e_1|psi> = 1/sqrt(2)(alpha + beta)$

$<e_2|psi> = 1/sqrt(2)(alpha - beta)$

$P(e_1) = |alpha + beta|^2/2, quad P(e_2) = |alpha - beta|^2/2$

### Worked Example 8.2

A qubit is in state $|psi> = |0>$. Measure in the ${|+>, |->}$ basis.

**Solution:**

$P(+) = |<+|0>|^2 = |1/sqrt(2)|^2 = 1/2$

$P(-) = |<-|0>|^2 = |1/sqrt(2)|^2 = 1/2$

The state $|0>$ gives equal probability in either outcome of the Hadamard basis measurement.

---

## 8.4 Multi-Qubit Measurement

For a two-qubit state, we can measure:
1. **Both qubits** in the computational basis: outcomes $|00>, |01>, |10>, |11>$
2. **One qubit only**: trace out the other qubit

### Measuring the First Qubit

For $|psi> = c_(00)|00> + c_(01)|01> + c_(10)|10> + c_(11)|11>$:

$P("first qubit" = 0) = |c_(00)|^2 + |c_(01)|^2$

$P("first qubit" = 1) = |c_(10)|^2 + |c_(11)|^2$

If the first qubit is measured to be $0$, the post-measurement state is:

$ |psi'> = (c_(00)|00> + c_(01)|01>) / sqrt(|c_(00)|^2 + |c_(01)|^2) $

### Worked Example 8.3

Let $|psi> = 1/sqrt(2)(|00> - |10> + |01> - |11>)$. The first qubit is measured. Find $P(0)$, $P(1)$, and the post-measurement states.

**Solution:**

$|psi> = 1/2(|00> + |01>) - 1/2(|10> + |11>)$

Let $|psi> = 1/2(|00> - |10> + |01> - |11>)$. The first qubit is measured. Find $P(0)$, $P(1)$, and the post-measurement states.

$P("first qubit" = 0) = |1/2|^2 + |1/2|^2 = 1/2$

$P("first qubit" = 1) = |-1/2|^2 + |-1/2|^2 = 1/2$

If result is $0$: $|psi'> = 1/sqrt(2)(|00> + |01>) = 1/sqrt(2)|0>(|0> + |1>)$

Then measuring the second qubit: $P("second" = 0) = 1/2$, $P("second" = 1) = 1/2$.

---

## 8.5 The No-Cloning Theorem

**Theorem:** It is impossible to construct a unitary operator $U$ that copies an arbitrary unknown quantum state.

**Proof sketch:** Suppose $U|psi>|0> = |psi>|psi>$ for all $|psi>$. Then for two states $|psi>$ and $|phi>$:

$<phi|psi> = (<phi|psi>)^2$

This only holds when $<phi|psi> = 0$ or $<phi|psi> = 1$, meaning $|phi> = |psi>$ or $|phi> perp |psi>$. Since this must hold for *all* states (not just orthogonal ones), the universal cloner cannot exist.

**Consequence:** Quantum information cannot be copied, only moved (teleported).

---

## Common Mistakes

- **Forgetting normalization after measurement**: After a measurement, the post-measurement state must be renormalized: $|psi'> = Pi_k|psi> / sqrt(P(lambda_k))$.
- **Confusing measurement bases**: The probabilities depend on which basis you measure in. The same state gives different outcomes in different bases.
- **Global phase is unobservable**: $|psi>$ and $e^(i theta)|psi>$ give identical measurement statistics. Only relative phases matter.
- **Measurement is not deterministic**: Even if you know the state exactly, measurement outcomes are probabilistic (unless the state is an eigenstate of the measured observable).

---

## Revision Checklist

- [ ] I can state the four postulates of quantum mechanics
- [ ] I can compute measurement probabilities for any observable
- [ ] I can determine the post-measurement state
- [ ] I understand multi-qubit measurement (measuring one qubit of a pair)
- [ ] I can explain the no-cloning theorem and its implications
- [ ] I understand that global phase is unobservable
