---
title: "07 - Question Bank and Worked Problems"
sidebar_label: "07 - Question Bank and Worked Problems"
sidebar_position: 7
description: "Theory questions and worked calculation patterns based on the source deck's final ten pages."
tags: [quantum-computing, question-bank, worked-problems, unit-iv]
---

# Question Bank and Worked Problems

**Source coverage:** PDF pages 126-135. The wording below is lightly normalized for notation and grammar. Source question numbers are retained where visible.

## Theory questions from the deck

1. Using Dirac notation, define the inner product of two vectors in a Hilbert space.
2. Describe the matrix representation of a ket vector.
3. Define the adjoint of an operator.
4. Describe Hermitian and unitary operators and discuss their significance in quantum mechanics.
5. Describe normal operators.
6. State and discuss the postulates of quantum mechanics.
7. Describe unitary time evolution of a quantum state.
8. Compare measurement in classical and quantum physics.
9. Explain what it means for $|\psi\rangle=a|0\rangle+b|1\rangle$ to be normalized.
10. State Moore's law and discuss its consequences for continued device scaling.
11. Differentiate classical and quantum computation.
12. What can be inferred from single-particle double-slit interference?
13. Describe superposition and its importance in quantum computing.
14. Explain global-phase equivalence and its significance.
15. Differentiate a classical bit and a quantum bit.
16. Describe a qubit and possible physical realizations.
17. List major qubit architectures.
18. Explain the Bloch-sphere representation of a qubit.
19. List the four EPR/Bell states.
20. Discuss single-qubit gates on computational-basis states.
21. Discuss single-qubit gates on general superposition states.
22. Explain the CNOT gate.
23. Explain the Toffoli gate.
24. Draw a simple quantum circuit and explain its elements.
25. Show that the three-CNOT SWAP circuit exchanges two qubit states.

## High-scoring answer frames

### Hermitian versus unitary

Start with definitions:

$$
A^\dagger=A \quad\text{(Hermitian)},
\qquad
U^\dagger U=I \quad\text{(unitary)}.
$$

Then state significance: Hermitian operators model observables and have real eigenvalues; unitary operators model reversible closed-system evolution and preserve normalization. End with Pauli $X$ as an example that is both.

### Classical bit versus qubit

Use four contrasts: state description, allowed transformations, measurement, and correlations. A qubit is not merely "both 0 and 1"; it is a normalized complex linear combination whose measurement statistics and interference depend on amplitude magnitudes and relative phase.

### CNOT

Give the rule $|a,b\rangle\mapsto|a,b\oplus a\rangle$, its four-row truth table, the 4-by-4 matrix, and one entangling example. Mention that the control is unchanged.

## Problems and worked checks

### Source problem 2 - bras, products, norms, normalization

Given

$$
|\psi\rangle=\begin{bmatrix}-3i\\2+i\\4\end{bmatrix},
\qquad
|\phi\rangle=\begin{bmatrix}2\\-i\\2-3i\end{bmatrix},
$$

the bras are

$$
\langle\psi|=\begin{bmatrix}3i&2-i&4\end{bmatrix},
\qquad
\langle\phi|=\begin{bmatrix}2&i&2+3i\end{bmatrix}.
$$

Norms:

$$
\|\psi\|^2=9+5+16=30,
\qquad
\|\phi\|^2=4+1+13=18.
$$

Thus

$$
|\hat\psi\rangle=\frac{|\psi\rangle}{\sqrt{30}},
\qquad
|\hat\phi\rangle=\frac{|\phi\rangle}{\sqrt{18}}.
$$

The cross inner product is

$$
\langle\phi|\psi\rangle
=2(-3i)+i(2+i)+(2+3i)4
=7+8i.
$$

Therefore the kets are not orthogonal.

### Source problem 5 - coordinate vectors

With respect to the ordered basis ${|0\rangle,|1\rangle}$,

$$
|y\rangle=\frac{|0\rangle+i|1\rangle}{\sqrt2}
\longleftrightarrow
\frac1{\sqrt2}\begin{bmatrix}1\\i\end{bmatrix},
$$

$$
|z\rangle=\frac{|0\rangle-i|1\rangle}{\sqrt2}
\longleftrightarrow
\frac1{\sqrt2}\begin{bmatrix}1\\-i\end{bmatrix}.
$$

### Source problem 6 - reconstruct a matrix from basis action

If $A|0\rangle=|1\rangle$ and $A|1\rangle=|0\rangle$, its columns are $|1\rangle$ and $|0\rangle$:

$$
A=\begin{bmatrix}0&1\\1&0\end{bmatrix}=X.
$$

### Source problem 11 - show a matrix is unitary

For

$$
U=\frac1{\sqrt2}\begin{bmatrix}1&1\\i&-i\end{bmatrix},
$$

$$
U^\dagger=\frac1{\sqrt2}\begin{bmatrix}1&-i\\1&i\end{bmatrix}.
$$

Then

$$
U^\dagger U
=\frac12\begin{bmatrix}1&-i\\1&i\end{bmatrix}
\begin{bmatrix}1&1\\i&-i\end{bmatrix}
=\begin{bmatrix}1&0\\0&1\end{bmatrix}.
$$

Hence $U$ is unitary.

### Source problem 16 - measurement probabilities

For

$$
|\psi\rangle=\sqrt{\frac34}|0\rangle+\sqrt{\frac14}|1\rangle,
$$

$$
p(0)=\frac34,
\qquad
p(1)=\frac14.
$$

Always square the **magnitude** of an amplitude, not the amplitude itself.

### Source problem 18 - Bloch-sphere points

For

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
$$

compare with $\cos(\theta/2)|0\rangle+e^{i\phi}\sin(\theta/2)|1\rangle$. This gives

$$
\theta=\frac\pi2,\qquad\phi=0,
$$

the $+x$ point. For $|-\rangle$,

$$
\theta=\frac\pi2,\qquad\phi=\pi,
$$

the $-x$ point.

### Source problem 25/27 - Pauli identities

Direct multiplication gives

$$
XY=iZ,\qquad YZ=iX,\qquad ZX=iY.
$$

Since Pauli matrices anticommute when distinct,

$$
YX=-iZ,\qquad ZY=-iX,\qquad XZ=-iY.
$$

### Source problem 28 - Y followed by X

For $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$, the circuit applies $Y$ first and X second:

$$
XY|\psi\rangle=iZ|\psi\rangle
=i\alpha|0\rangle-i\beta|1\rangle.
$$

### Source problem 31 - H on the first qubit, then CNOT

This circuit maps computational-basis inputs to Bell states:

| Input | Output |
|---|---|
| $|00\rangle$ | $|\Phi^+\rangle=(|00\rangle+|11\rangle)/\sqrt2$ |
| $|01\rangle$ | $|\Psi^+\rangle=(|01\rangle+|10\rangle)/\sqrt2$ |
| $|10\rangle$ | $|\Phi^-\rangle=(|00\rangle-|11\rangle)/\sqrt2$ |
| $|11\rangle$ | $|\Psi^-\rangle=(|01\rangle-|10\rangle)/\sqrt2$ |

### Source problem 34 - controlled gate identity

The circuit applies $HZH$ to the target when the control is $1$. Since

$$
HZH=X,
$$

the controlled-$HZH$ circuit equals controlled-X, i.e. CNOT.

### Source problems 35-37 - gate identities

$$
T^2=\begin{bmatrix}1&0\\0&e^{i\pi/2}\end{bmatrix}=S.
$$

$$
H^\dagger H=H^2=I,
$$

so H is unitary and applying it twice restores any input, including $|0\rangle$.

## Quick Quiz: Final Revision

**Question 1:** Which test proves a square matrix $U$ is unitary?

<details><summary>Answer</summary>Compute $U^\dagger U$ $or (UU^\dagger)$ and show it equals the identity.</details>

**Question 2:** What is the fastest way to construct an operator matrix from its action on a basis?

<details><summary>Answer</summary>Place the coordinate vectors of the basis-state outputs as the matrix columns in the same basis order.</details>

**Question 3:** What common mistake occurs in a left-to-right circuit diagram?

<details><summary>Answer</summary>Writing matrix products in diagram order. If gate $A$ is followed by $B$, the state becomes $BA|\psi\rangle$; the rightmost matrix acts first.</details>

## Exam checklist

- Conjugate before transposing a ket into a bra.
- Use squared magnitudes for probabilities.
- State the computational-basis ordering before writing a multi-qubit matrix.
- Keep gate order explicit.
- Separate global phase from relative phase.
- For a proof of unitarity, show the matrix product, not only the conclusion.
- When discussing quantum advantage or cryptographic security, avoid universal claims.
