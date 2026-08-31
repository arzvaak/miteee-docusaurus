---
title: "Introduction to Quantum Computing - Course Overview"
sidebar_label: "Course Overview"
sidebar_position: 0
description: "A source-grounded study route through the supplied 135-slide Unit IV deck on quantum computing."
tags:
  - quantum-computing
  - qubits
  - quantum-gates
  - unit-iv
---

# Introduction to Quantum Computing

These notes turn the supplied **135-slide Unit IV deck (12 hours)** into an exam-ready course. The internal catalog label is **SEM7-QC**; the PDF itself does **not** state an official subject code, so SEM7-QC must not be quoted as one.

## Course route

1. [Foundations and Linear Algebra](./01-foundations-and-linear-algebra) - why quantum computing matters, vector spaces, bases, Dirac notation, inner products, and matrix representations.
2. [Operators and Quantum Postulates](./02-operators-and-quantum-postulates) - bras, operators, eigenvalues, Hermitian/unitary operators, state space, measurement, and evolution.
3. [Qubits and Multi-Qubit States](./03-qubits-and-multi-qubit-states) - amplitudes, global phase, Bloch sphere, tensor products, Bell states, and register scaling.
4. [Quantum Gates](./04-quantum-gates) - Pauli, Hadamard, phase, controlled, Toffoli, and universal gates.
5. [Circuits, Algorithms, and No-Cloning](./05-circuits-algorithms-and-no-cloning) - circuit reading, SWAP construction, quantum speedups, rotation gates, and the no-cloning proof.
6. [Quantum Measurement](./06-quantum-measurement) - projective measurement, collapse, distinguishability, density operators, and POVMs.
7. [Question Bank and Worked Problems](./07-question-bank-and-worked-problems) - the deck's theory questions, calculation templates, worked checks, and an answer-writing plan.

## Coverage and provenance

| Source pages | Coverage |
|---|---|
| 1-20 | Background and mathematical foundations |
| 21-44 | Operators and postulates |
| 45-71 | Quantum computing, qubits, and multi-qubit states |
| 72-93 | Gates and gate notation |
| 94-116 | Circuits, algorithms, universality, rotations, and no-cloning |
| 117-125 | Measurement and POVMs |
| 126-135 | Questions, problems, and source solution slides |

Native PDF text was checked against rendered pages, including the image-dominant formula and circuit slides. Equations below are normalized into consistent notation rather than copied with the deck's occasional encoding errors.

## Corrections to remember

:::warning Source corrections
- An $n$-qubit register contains **$n$ qubits**, but its state has **$2^n$ computational-basis amplitudes**.
- Quantum algorithms do not make classically uncomputable problems computable. Their value is a speedup for specific problems.
- Quantum cryptography is not automatically or universally "unbreakable". Protocol choice, authentication, assumptions, devices, and implementation all matter.
- A POVM is a general measurement model; it is not inherently deterministic.
:::

## Twelve-hour revision plan

| Block | Topic | Required output |
|---|---|---|
| 1-2 | Linear algebra | Convert kets to bras; normalize vectors; test orthogonality |
| 3-4 | Operators and postulates | Identify Hermitian/unitary matrices; state the postulates |
| 5-6 | Qubits | Move among ket, column-vector, probability, and Bloch-sphere forms |
| 7-8 | Gates | Memorize matrices and compute their action on basis states |
| 9-10 | Circuits | Read CNOT/SWAP circuits and propagate basis or superposition inputs |
| 11 | Measurement | Calculate outcome probabilities and post-measurement states |
| 12 | Problems | Attempt the final problem set without notes, then use the checks |

## Formula sheet

For a normalized qubit,

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,
\qquad |\alpha|^2+|\beta|^2=1.
$$

Its Bloch-sphere form is

$$
|\psi\rangle=\cos\frac{\theta}{2}|0\rangle
+e^{i\phi}\sin\frac{\theta}{2}|1\rangle.
$$

For a unitary gate $U$,

$$
U^\dagger U=UU^\dagger=I.
$$

For a projective measurement with projectors $P_m$,

$$
p(m)=\langle\psi|P_m|\psi\rangle,
\qquad
|\psi_m\rangle=\frac{P_m|\psi\rangle}{\sqrt{p(m)}}.
$$

For a composite system,

$$
|a\rangle\otimes|b\rangle=|ab\rangle.
$$
