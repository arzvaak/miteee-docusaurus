---
title: "05 - Circuits, Algorithms, and No-Cloning"
sidebar_label: "05 - Circuits, Algorithms, and No-Cloning"
sidebar_position: 5
description: "How to read quantum circuits, construct SWAP, interpret quantum speedups, use rotation gates, and prove no-cloning."
tags: [quantum-computing, quantum-circuits, algorithms, no-cloning, unit-iv]
---

# Circuits, Algorithms, and No-Cloning

**Source coverage:** PDF pages 94-116.

## 1. Circuit model

A quantum circuit is a time-ordered prescription for state preparation, unitary operations, and measurement.

- Each horizontal wire represents a qubit, not a physical path that can be copied freely.
- Time normally runs left to right.
- Boxes denote gates.
- A filled control dot joined to $\oplus$ denotes CNOT.
- A meter denotes measurement and a classical outcome.

A common three-stage pattern is:

1. initialize qubits, often in $|0\rangle^{\otimes n}$;
2. apply a gate sequence;
3. measure selected qubits.

To solve a circuit, write the input ket and propagate it through one layer at a time. Apply each layer to **every term** in a superposition.

## 2. Simple circuit examples

Starting with $|0\rangle$, applying X gives $|1\rangle$. A computational-basis measurement then returns $1$ with probability one.

Starting with $|0\rangle$, applying H gives

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
$$

so a computational-basis measurement gives $0$ or $1$, each with probability $1/2$.

For a two-qubit basis input $|10\rangle$, CNOT with the first qubit as control gives $|11\rangle$.

## 3. SWAP circuit

SWAP exchanges the states of two qubits:

$$
\operatorname{SWAP}|a,b\rangle=|b,a\rangle.
$$

It can be built from three CNOT gates:

$$
\operatorname{SWAP}=\operatorname{CNOT}_{1\to2}
\operatorname{CNOT}_{2\to1}
\operatorname{CNOT}_{1\to2},
$$

where the rightmost gate acts first.

Track classical basis labels using XOR:

$$
(a,b)\to(a,a\oplus b)
\to(a\oplus(a\oplus b),a\oplus b)
=(b,a\oplus b)
\to(b,a).
$$

Linearity makes the same identity valid for arbitrary superpositions and entangled inputs.

## 4. What quantum algorithms can and cannot do

A quantum algorithm is a sequence of quantum operations designed so interference increases the probability of useful outcomes.

Examples named by the source:

- **Shor's algorithm:** polynomial-time integer factorization on an ideal fault-tolerant quantum computer, compared with the best known classical algorithms being super-polynomial but sub-exponential.
- **Grover's algorithm:** searches an unstructured space of $N$ candidates using $O(\sqrt N)$ oracle queries rather than (O(N)).

:::warning Scope correction
Quantum computers do not solve every hard problem efficiently, and they do not solve classically uncomputable problems. Speedups are problem- and model-specific, and practical advantage also depends on hardware overhead and error correction.
:::

## 5. Rotation gates

Rotations about Bloch-sphere axes are

$$
R_x(\theta)=e^{-i\theta X/2}
=\cos\frac\theta2 I-i\sin\frac\theta2 X,
$$

$$
R_y(\theta)=e^{-i\theta Y/2}
=\cos\frac\theta2 I-i\sin\frac\theta2 Y,
$$

$$
R_z(\theta)=e^{-i\theta Z/2}
=\begin{bmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{bmatrix}.
$$

They are unitary and continuously parameterized. Global-phase differences explain why a named phase gate can correspond to a geometric rotation with a slightly different-looking diagonal matrix.

## 6. No-cloning theorem

Classical data can be copied using CNOT when the input is a known computational-basis state and the target starts in $|0\rangle$:

$$
|x\rangle|0\rangle\mapsto|x\rangle|x\rangle,
\qquad x\in\{0,1\}.
$$

But no unitary can perfectly copy **every unknown quantum state**.

Assume a universal cloner $U$ with a blank state $|s\rangle$:

$$
U|\psi\rangle|s\rangle=|\psi\rangle|\psi\rangle,
\qquad
U|\phi\rangle|s\rangle=|\phi\rangle|\phi\rangle.
$$

Unitary evolution preserves inner products, so the inner product of inputs must equal that of outputs:

$$
\langle\psi|\phi\rangle
=\bigl(\langle\psi|\phi\rangle\bigr)^2.
$$

Let $c=\langle\psi|\phi\rangle$. Then $c=c^2$, so $c=0$ or $c=1$. Thus a single machine can perfectly clone states only when they are orthogonal or identical, not arbitrary unknown non-orthogonal states.

### Linearity proof

Suppose a machine copies basis states:

$$
U|0\rangle|s\rangle=|00\rangle,
\qquad
U|1\rangle|s\rangle=|11\rangle.
$$

For $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$, linearity gives

$$
U|\psi\rangle|s\rangle=\alpha|00\rangle+\beta|11\rangle.
$$

A true copy would be

$$
|\psi\rangle|\psi\rangle
=\alpha^2|00\rangle+\alpha\beta|01\rangle
+\alpha\beta|10\rangle+\beta^2|11\rangle,
$$

which is generally different.

No-cloning does not forbid moving a state (teleportation), copying known orthogonal states, approximate cloning, or producing classical information from measurements. It forbids a perfect universal copier for an unknown state.

## 7. Quantum cryptography caution

Measurement disturbance and no-cloning can expose eavesdropping in properly designed quantum key-distribution protocols. This does not make every system "unbreakable." Authentication, device behavior, side channels, implementation quality, protocol assumptions, and post-processing remain security-critical.

## Quick Quiz: Circuits and No-Cloning

**Question 1:** Why can three CNOTs implement SWAP?

<details><summary>Answer</summary>Tracking the two basis labels gives $(a,b)\to(a,a\oplus b)\to(b,a\oplus b)\to(b,a)$; linearity extends the result to arbitrary states.</details>

**Question 2:** What is Grover's query advantage?

<details><summary>Answer</summary>It reduces unstructured search from (O(N)) classical oracle queries to $O(\sqrt N)$ quantum queries.</details>

**Question 3:** Which two cases satisfy the no-cloning inner-product condition $c=c^2$?

<details><summary>Answer</summary>$c=0$ for orthogonal states and $c=1$ for identical states (up to the relevant phase convention).</details>
