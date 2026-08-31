---
title: "03 - Qubits and Multi-Qubit States"
sidebar_label: "03 - Qubits and Multi-Qubit States"
sidebar_position: 3
description: "Qubit amplitudes, measurement, global phase, Bloch sphere, tensor products, registers, and Bell states."
tags: [quantum-computing, qubits, bloch-sphere, entanglement, unit-iv]
---

# Qubits and Multi-Qubit States

**Source coverage:** PDF pages 45-71.

## 1. Classical bit versus qubit

A classical bit has one value, $0$ or $1$, at a given time. A pure qubit state is a normalized vector in $\mathbb C^2$:

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,
\qquad \alpha,\beta\in\mathbb C,
$$

with

$$
|\alpha|^2+|\beta|^2=1.
$$

Measuring in the computational basis gives

- outcome $0$ with probability $|\alpha|^2$;
- outcome $1$ with probability $|\beta|^2$.

Measurement does not expose both amplitudes from one copy. It returns one classical outcome and, for an ideal projective measurement, leaves the state in the corresponding basis state.

## 2. Physical realizations

The logical states $|0\rangle$ and $|1\rangle$ can be encoded in two distinguishable levels of a physical system, such as:

- atomic or ionic energy levels;
- electron or nuclear spin states;
- photon polarization or path states;
- superconducting-circuit energy states.

The mathematics is platform-independent, while preparation fidelity, control, coherence, measurement, and error rates depend on the hardware.

## 3. Relative phase and global phase

The states

$$
|\psi\rangle
\quad\text{and}\quad
e^{i\gamma}|\psi\rangle
$$

have identical measurement statistics and represent the same pure physical state. The factor $e^{i\gamma}$ is a **global phase**.

By contrast, relative phase is observable through interference. The states

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
\qquad
|-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}
$$

have the same computational-basis probabilities but can be distinguished by measuring in the $X$ basis.

## 4. Bloch sphere

After removing an irrelevant global phase, every pure single-qubit state can be written

$$
|\psi\rangle=\cos\frac{\theta}{2}|0\rangle
+e^{i\phi}\sin\frac{\theta}{2}|1\rangle,
$$

where $0\le\theta\le\pi$ and $0\le\phi<2\pi$.

Key points:

| State | Bloch coordinates |
|---|---|
| $|0\rangle$ | north pole, $\theta=0$ |
| $|1\rangle$ | south pole, $\theta=\pi$ |
| $|+\rangle$ | $+x$, $\theta=\pi/2,\phi=0$ |
| $|-\rangle$ | $-x$, $\theta=\pi/2,\phi=\pi$ |
| $(|0\rangle+i|1\rangle)/\sqrt2$ | $+y$, $\theta=\pi/2,\phi=\pi/2$ |

The Bloch sphere visualizes pure states as surface points. Mixed states lie inside the sphere; a maximally mixed qubit lies at the center.

## 5. Tensor products and registers

Two qubits live in

$$
\mathbb C^2\otimes\mathbb C^2\cong\mathbb C^4.
$$

Their computational basis is

$$
|00\rangle,|01\rangle,|10\rangle,|11\rangle.
$$

A general two-qubit state is

$$
|\psi\rangle=\alpha_{00}|00\rangle+\alpha_{01}|01\rangle
+\alpha_{10}|10\rangle+\alpha_{11}|11\rangle,
$$

where

$$
\sum_{x\in\{00,01,10,11\}}|\alpha_x|^2=1.
$$

For $n$ qubits,

$$
|\psi\rangle=\sum_{x\in\{0,1\}^n}\alpha_x|x\rangle,
\qquad \sum_x|\alpha_x|^2=1.
$$

:::warning Register scaling
An $n$-qubit register has **$n$ qubits and $2^n$ basis states/amplitudes**. The source slide's statement that it contains $2^n$ qubits is incorrect.
:::

The exponential state description does not mean all amplitudes can be read out in one measurement. A useful quantum algorithm must convert the desired global property into measurable statistics.

## 6. Product and entangled states

A two-qubit state is a product state if it can be written

$$
|\psi\rangle=|a\rangle\otimes|b\rangle.
$$

For a coefficient matrix

$$
C=\begin{bmatrix}\alpha_{00}&\alpha_{01}\\\alpha_{10}&\alpha_{11}\end{bmatrix},
$$

a pure two-qubit state is a product state exactly when

$$
\det C=\alpha_{00}\alpha_{11}-\alpha_{01}\alpha_{10}=0.
$$

If it cannot be factored, it is entangled.

## 7. Bell/EPR states

The four Bell states are

$$
|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2},\qquad
|\Phi^-\rangle=\frac{|00\rangle-|11\rangle}{\sqrt2},
$$

$$
|\Psi^+\rangle=\frac{|01\rangle+|10\rangle}{\sqrt2},\qquad
|\Psi^-\rangle=\frac{|01\rangle-|10\rangle}{\sqrt2}.
$$

They are maximally entangled. For $|\Phi^+\rangle$, computational-basis measurement yields (00) or (11), each with probability $1/2$. Neither qubit alone has a definite pure state, even though the outcomes are perfectly correlated.

Entanglement creates correlations that cannot be reproduced by assigning each qubit an independent local pure state. It does not permit faster-than-light classical communication.

## Worked example: tensor product

Let $|a\rangle=|+\rangle$ and $|b\rangle=|1\rangle$. Then

$$
|a\rangle\otimes|b\rangle
=\frac{|0\rangle+|1\rangle}{\sqrt2}\otimes|1\rangle
=\frac{|01\rangle+|11\rangle}{\sqrt2}.
$$

## Quick Quiz: Qubits

**Question 1:** Can one measurement reveal both $\alpha$ and $\beta$?

<details><summary>Answer</summary>No. A computational-basis measurement returns one bit. State estimation requires many identically prepared systems and measurements in several bases.</details>

**Question 2:** Why are $|+\rangle$ and $|-\rangle$ physically different although they have the same $Z$-basis probabilities?

<details><summary>Answer</summary>They differ by a relative phase, not a global phase. Interference or an $X$-basis measurement distinguishes them.</details>

**Question 3:** Is $(|00\rangle+|11\rangle)/\sqrt2$ a product state?

<details><summary>Answer</summary>No. Its coefficient determinant is $1/2\ne0$, so it cannot be factored into two single-qubit states.</details>
