---
title: "04 - Quantum Gates"
sidebar_label: "04 - Quantum Gates"
sidebar_position: 4
description: "Single- and multi-qubit gate matrices, basis-state actions, controlled operations, and gate identities."
tags: [quantum-computing, quantum-gates, cnot, hadamard, unit-iv]
---

# Quantum Gates

**Source coverage:** PDF pages 72-93.

## 1. Gate rules

A closed-system quantum gate is represented by a unitary matrix. Therefore it is linear, norm-preserving, and reversible. For a state column $|\psi\rangle$, the output is

$$
|\psi'\rangle=U|\psi\rangle.
$$

In a product $U_2U_1|\psi\rangle$, $U_1$ acts first.

## 2. Pauli gates

### X gate - bit flip

$$
X=\begin{bmatrix}0&1\\1&0\end{bmatrix},
\qquad
X|0\rangle=|1\rangle,\quad X|1\rangle=|0\rangle.
$$

For a superposition,

$$
X(\alpha|0\rangle+\beta|1\rangle)=\beta|0\rangle+\alpha|1\rangle.
$$

### Y gate - bit and phase change

$$
Y=\begin{bmatrix}0&-i\\i&0\end{bmatrix},
\qquad
Y|0\rangle=i|1\rangle,\quad Y|1\rangle=-i|0\rangle.
$$

### Z gate - phase flip

$$
Z=\begin{bmatrix}1&0\\0&-1\end{bmatrix},
\qquad
Z|0\rangle=|0\rangle,\quad Z|1\rangle=-|1\rangle.
$$

Z does not change computational-basis outcome probabilities immediately, but it changes relative phase and therefore later interference.

## 3. Hadamard gate

$$
H=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$

Its basis action is

$$
H|0\rangle=|+\rangle,
\qquad
H|1\rangle=|-\rangle.
$$

Conversely,

$$
H|+\rangle=|0\rangle,
\qquad
H|-\rangle=|1\rangle.
$$

Thus $H^2=I$. Hadamard changes between the $Z$ and $X$ bases; describing it only as a "superposition gate" misses its basis-change role.

Important conjugation identities are

$$
HXH=Z,
\qquad
HZH=X.
$$

## 4. Phase gates

$$
S=\begin{bmatrix}1&0\\0&i\end{bmatrix},
\qquad
T=\begin{bmatrix}1&0\\0&e^{i\pi/4}\end{bmatrix}.
$$

They leave $|0\rangle$ unchanged and phase the $|1\rangle$ component. Useful identities:

$$
S^2=Z,
\qquad
T^2=S,
\qquad
T^4=Z,
\qquad
T^8=I.
$$

The phrase "$\pi/8$ gate" for $T$ comes from an equivalent rotation convention up to global phase; its relative phase is $e^{i\pi/4}$.

## 5. Controlled-NOT

With the first qubit as control and the second as target,

$$
\operatorname{CNOT}|a,b\rangle=|a,b\oplus a\rangle.
$$

In basis order $|00\rangle,|01\rangle,|10\rangle,|11\rangle$,

$$
\operatorname{CNOT}=
\begin{bmatrix}
1&0&0&0\\
0&1&0&0\\
0&0&0&1\\
0&0&1&0
\end{bmatrix}.
$$

| Input | Output |
|---|---|
| $|00\rangle$ | $|00\rangle$ |
| $|01\rangle$ | $|01\rangle$ |
| $|10\rangle$ | $|11\rangle$ |
| $|11\rangle$ | $|10\rangle$ |

Since gates act linearly, CNOT can entangle a superposition:

$$
\operatorname{CNOT}\frac{|00\rangle+|10\rangle}{\sqrt2}
=\frac{|00\rangle+|11\rangle}{\sqrt2}.
$$

## 6. Controlled-Z

Controlled-Z applies a (-1) phase only to $|11\rangle$:

$$
CZ=\operatorname{diag}(1,1,1,-1).
$$

It is symmetric between its two qubits. CNOT and CZ are related by Hadamards on the target:

$$
\operatorname{CNOT}=(I\otimes H)CZ(I\otimes H).
$$

## 7. Toffoli gate

The Toffoli or CCNOT gate has two controls and one target:

$$
|a,b,c\rangle\mapsto|a,b,c\oplus ab\rangle.
$$

It flips the target only when both controls are $1$. It is unitary, self-inverse, and important in reversible classical logic embedded in quantum circuits.

## 8. General controlled gate

A controlled-$U$ operation applies $U$ to the target only when the control is $1$:

$$
C(U)=|0\rangle\langle0|\otimes I+|1\rangle\langle1|\otimes U.
$$

## 9. Universality

A gate set is universal if arbitrary unitary operations can be approximated to any desired accuracy using gates from that set. A standard discrete universal set is

$$
\{H,T,\operatorname{CNOT}\}.
$$

The exact set of all single-qubit gates together with CNOT is also universal. Universality concerns what can be synthesized, not whether the synthesis is efficient.

## Worked example: apply Y then X

For $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$,

$$
Y|\psi\rangle=-i\beta|0\rangle+i\alpha|1\rangle.
$$

Then

$$
XY|\psi\rangle=i\alpha|0\rangle-i\beta|1\rangle=iZ|\psi\rangle.
$$

So $XY=iZ$. Reversing the order gives $YX=-iZ$.

## Quick Quiz: Gates

**Question 1:** Which gate changes computational basis but not relative phase: X or Z?

<details><summary>Answer</summary>X swaps the computational basis states. Z changes relative phase.</details>

**Question 2:** What is the output of CNOT on $(|00\rangle+|10\rangle)/\sqrt2$?

<details><summary>Answer</summary>$(|00\rangle+|11\rangle)/\sqrt2$, a Bell state.</details>

**Question 3:** Show $T^2=S$.

<details><summary>Answer</summary>

$$
T^2=\operatorname{diag}(1,e^{i\pi/2})=\operatorname{diag}(1,i)=S.
$$

</details>
