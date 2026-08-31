---
title: "06 - Quantum Measurement"
sidebar_label: "06 - Quantum Measurement"
sidebar_position: 6
description: "Measurement probabilities, post-measurement states, projectors, distinguishability, density operators, and POVMs."
tags: [quantum-computing, measurement, povm, density-matrix, unit-iv]
---

# Quantum Measurement

**Source coverage:** PDF pages 117-125.

## 1. From quantum state to classical result

Quantum measurement extracts classical information from a quantum system. It is probabilistic in general and usually changes the state. A measurement model must specify:

- possible outcomes;
- the probability of each outcome;
- the state after each outcome.

## 2. General measurement operators

A measurement is described by operators ${M_m}$, one for each outcome $m$, satisfying the completeness relation

$$
\sum_m M_m^\dagger M_m=I.
$$

For a normalized input $|\psi\rangle$,

$$
p(m)=\langle\psi|M_m^\dagger M_m|\psi\rangle.
$$

If outcome $m$ occurs and $p(m)>0$, the conditional post-measurement state is

$$
|\psi_m\rangle=\frac{M_m|\psi\rangle}{\sqrt{p(m)}}.
$$

Completeness guarantees that probabilities sum to one.

## 3. Projective measurement

A projective measurement uses orthogonal projectors ${P_m}$ such that

$$
P_m=P_m^\dagger=P_m^2,
\qquad
P_mP_n=0\ (m\ne n),
\qquad
\sum_mP_m=I.
$$

Then

$$
p(m)=\langle\psi|P_m|\psi\rangle,
\qquad
|\psi_m\rangle=\frac{P_m|\psi\rangle}{\sqrt{p(m)}}.
$$

For computational-basis measurement,

$$
P_0=|0\rangle\langle0|,
\qquad
P_1=|1\rangle\langle1|.
$$

If $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$, the outcomes have probabilities $|\alpha|^2$ and $|\beta|^2$.

> **Precision note:** Projective measurement is not "deterministic" in general. It is deterministic only when the state lies entirely in one measured eigenspace.

## 4. Expectation value

For an observable

$$
A=\sum_m a_mP_m,
$$

the expected value is

$$
\langle A\rangle_\psi=\langle\psi|A|\psi\rangle
=\sum_m a_mp(m).
$$

It is an average over repeated preparation-and-measurement trials, not necessarily the result of one trial.

## 5. Distinguishing states

Two orthogonal pure states can be perfectly distinguished by a measurement in a basis containing them. Non-orthogonal states cannot be perfectly distinguished from one copy with certainty.

This limitation connects measurement to no-cloning: if non-orthogonal states could be identified perfectly, one could measure the label and prepare unlimited copies, contradicting no-cloning.

## 6. Density operators

For a pure state,

$$
\rho=|\psi\rangle\langle\psi|.
$$

A statistical mixture ${p_i,|\psi_i\rangle}$ has

$$
\rho=\sum_i p_i|\psi_i\rangle\langle\psi_i|.
$$

A valid density operator is Hermitian, positive semidefinite, and has trace one. A pure state satisfies $\operatorname{Tr}(\rho^2)=1$; a mixed state has $\operatorname{Tr}(\rho^2)<1$.

Measurement probability becomes

$$
p(m)=\operatorname{Tr}(M_m^\dagger M_m\rho).
$$

## 7. POVMs

Define the positive operators

$$
E_m=M_m^\dagger M_m.
$$

The set ${E_m}$ is a positive operator-valued measure (POVM), satisfying

$$
E_m\succeq0,
\qquad
\sum_mE_m=I.
$$

The probability rule is

$$
p(m)=\langle\psi|E_m|\psi\rangle
$$

or, for a density matrix,

$$
p(m)=\operatorname{Tr}(E_m\rho).
$$

POVM elements determine outcome probabilities but do not by themselves uniquely determine the post-measurement state; the underlying measurement operators or instrument are also needed.

POVMs are useful for generalized state discrimination, noisy or coarse-grained detectors, and measurements with more outcomes than the Hilbert-space dimension.

## Worked example: computational measurement

Let

$$
|\psi\rangle=\sqrt{\frac34}|0\rangle+\sqrt{\frac14}|1\rangle.
$$

Then

$$
p(0)=\frac34,
\qquad
p(1)=\frac14.
$$

Conditional on outcome $0$, the post-measurement state is $|0\rangle$; conditional on $1$, it is $|1\rangle$.

The $Z$-expectation is

$$
\langle Z\rangle=p(0)-p(1)=\frac12.
$$

## Quick Quiz: Measurement

**Question 1:** What condition makes ${M_m}$ a complete measurement?

<details><summary>Answer</summary>$\sum_mM_m^\dagger M_m=I$.</details>

**Question 2:** Can two non-orthogonal states be perfectly distinguished from one copy?

<details><summary>Answer</summary>No. Any measurement must have some error or inconclusive probability unless the states are orthogonal.</details>

**Question 3:** What extra information beyond POVM elements is needed to determine the post-measurement state?

<details><summary>Answer</summary>A choice of measurement operators or quantum instrument that realizes the POVM.</details>
