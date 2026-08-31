---
title: "01 - Foundations and Linear Algebra"
sidebar_label: "01 - Foundations and Linear Algebra"
sidebar_position: 1
description: "Quantum-computing motivation and the linear-algebra language used to describe quantum states."
tags: [quantum-computing, linear-algebra, dirac-notation, unit-iv]
---

# Foundations and Linear Algebra

**Source coverage:** PDF pages 1-20.

## 1. Why computation becomes physical

A computer is a physical device that executes algorithms. An algorithm is a finite, well-defined procedure for an information-processing task. Since information must be stored and transformed in physical systems, the laws obeyed by those systems limit or enable computation.

Classical computers encode information in systems described well by classical physics. Quantum computers instead exploit quantum features:

- **superposition** - a state can be a linear combination of basis states;
- **interference** - amplitudes can reinforce or cancel;
- **entanglement** - a composite state may not split into independent states for its parts;
- **measurement statistics** - only probabilities of outcomes are predicted in general.

These features do not make every task faster. A quantum advantage requires an algorithm that arranges amplitudes so useful answers are more likely when measured.

## 2. Complex vector spaces

A vector space $V$ is a set whose elements can be added and multiplied by scalars while satisfying closure, associativity, distributivity, additive identity/inverses, and a multiplicative identity. Quantum states use finite-dimensional vector spaces over the complex numbers.

For example,

$$
\mathbb C^2=\left\{\begin{bmatrix}z_1\\z_2\end{bmatrix}:z_1,z_2\in\mathbb C\right\}.
$$

In Dirac notation a vector is a **ket**, $|v\rangle$. The computational-basis vectors are

$$
|0\rangle=\begin{bmatrix}1\\0\end{bmatrix},
\qquad
|1\rangle=\begin{bmatrix}0\\1\end{bmatrix}.
$$

An arbitrary vector in $\mathbb C^2$ is

$$
|v\rangle=z_1|0\rangle+z_2|1\rangle
=\begin{bmatrix}z_1\\z_2\end{bmatrix}.
$$

## 3. Span, linear independence, basis, dimension

A set ${|v_1\rangle,\ldots,|v_n\rangle}$ **spans** $V$ if every vector in $V$ is a linear combination of those vectors.

The set is linearly independent if

$$
a_1|v_1\rangle+\cdots+a_n|v_n\rangle=0
$$

implies $a_1=\cdots=a_n=0$. A **basis** is a linearly independent spanning set. The number of vectors in any basis is the space's dimension.

The same vector can have different coordinates in different bases. Besides the computational basis, a useful basis is

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
\qquad
|-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}.
$$

The inverse relations are

$$
|0\rangle=\frac{|+\rangle+|-\rangle}{\sqrt2},
\qquad
|1\rangle=\frac{|+\rangle-|-\rangle}{\sqrt2}.
$$

> **Exam trap:** A basis is not merely a spanning set. It must also be linearly independent.

## 4. Inner product and norm

The inner product of kets $|v\rangle$ and $|w\rangle$ is written $\langle w|v\rangle$. If

$$
|v\rangle=\begin{bmatrix}v_1\\ \vdots\\ v_n\end{bmatrix},
\qquad
|w\rangle=\begin{bmatrix}w_1\\ \vdots\\ w_n\end{bmatrix},
$$

then

$$
\langle w|v\rangle=\sum_{k=1}^n w_k^*v_k.
$$

The complex conjugation matters. The main properties are

$$
\langle w|v\rangle=\langle v|w\rangle^*,
\qquad
\langle v|v\rangle\ge 0,
$$

with equality only for the zero vector.

The norm is

$$
\|v\|=\sqrt{\langle v|v\rangle}.
$$

A vector is normalized when $\langle v|v\rangle=1$. Vectors are orthogonal when their inner product is zero. A basis is **orthonormal** when each vector has unit norm and different basis vectors are mutually orthogonal:

$$
\langle i|j\rangle=\delta_{ij}.
$$

Orthonormal bases are convenient because the coordinate of $|v\rangle$ along $|v_i\rangle$ is immediately

$$
a_i=\langle v_i|v\rangle.
$$

## 5. Ket and matrix representation

For an orthonormal basis ${|v_i\rangle}$,

$$
|v\rangle=\sum_i a_i|v_i\rangle,
\qquad a_i=\langle v_i|v\rangle.
$$

The coordinate column is therefore

$$
[v]=\begin{bmatrix}a_1\\a_2\\\vdots\\a_n\end{bmatrix}.
$$

Do not confuse an abstract state with one coordinate representation of it. Changing the basis changes the column, not the physical state.

## Worked example: normalize a ket

Let

$$
|v\rangle=\begin{bmatrix}2+i\\4\end{bmatrix}.
$$

Then

$$
\langle v|v\rangle=|2+i|^2+|4|^2=(4+1)+16=21,
$$

so

$$
|\hat v\rangle=\frac1{\sqrt{21}}\begin{bmatrix}2+i\\4\end{bmatrix}.
$$

## Quick Quiz: Linear Algebra

**Question 1:** What two conditions make a spanning set a basis?

<details><summary>Answer</summary>It must span the vector space and be linearly independent.</details>

**Question 2:** Find $\langle +|-\rangle$.

<details><summary>Answer</summary>

$$
\langle +|-\rangle=\frac12(\langle0|+\langle1|)(|0\rangle-|1\rangle)=\frac12(1-1)=0.
$$

</details>

**Question 3:** Why is the conjugate used in a complex inner product?

<details><summary>Answer</summary>It ensures conjugate symmetry and makes $\langle v|v\rangle=\sum_i|v_i|^2\$ real and non-negative.</details>

## Last-minute checklist

- A ket is a column vector; its bra is a conjugate-transpose row vector.
- Normalize by dividing by the square root of the sum of squared magnitudes.
- Orthogonal means inner product zero; orthonormal also requires unit norms.
- In an orthonormal basis, expansion coefficients are inner products with basis vectors.
