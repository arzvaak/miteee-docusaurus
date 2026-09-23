---
title: "Extra Practice"
math_syntax: typst
---

# Extra Practice

> *Generated exercises for deeper practice beyond the class material. These are not sourced from any exam paper.*

---

## Complex Numbers and Vector Spaces

**E1.** Let $z_1 = 3 - 2i$ and $z_2 = 1 + i$.

(a) Compute $z_1 + z_2$, $z_1 z_2$, $z_1 / z_2$.
(b) Find $|z_1|$, $|z_2|$, and $|z_1 z_2|$. Verify that $|z_1 z_2| = |z_1||z_2|$.
(c) Express $z_1$ in polar form.

**E2.** Show that the set $S = {mat(1; i), mat(i; 1)}$ spans $CC^2$. Is it linearly independent? Is it a basis?

**E3.** Let $V$ be the set of all $2 times 2$ Hermitian matrices. Show that $V$ is NOT a vector space over $CC$ (but IS a vector space over $RR$).

---

## Dirac Notation and Inner Products

**E4.** Let $|a> = mat(2; 1-i)$ and $|b> = mat(1+i; 3i)$.

(a) Compute $<a|b>$ and $<b|a>$.
(b) Verify that $<a|b> = overline{<b|a>}$.
(c) Compute the outer product $|a><b|$ as a $2 times 2$ matrix.
(d) Compute $|a><a|$ and verify it is Hermitian.

**E5.** Use the completeness relation $I = |0><0| + |1><1|$ to prove that any vector $|psi> = alpha|0> + beta|1>$ can be recovered from its inner products with the basis vectors.

**E6.** Let $|e_1> = 1/sqrt(3) mat(1; 1+i; 1)$ and $|e_2> = 1/sqrt(3) mat(1; 0; -1)$. Are these vectors orthonormal? If not, orthogonalize them using Gram-Schmidt.

---

## Operators and Matrices

**E7.** For the operator $A = mat(2 & 1+i; 1-i & 3)$:

(a) Verify that $A$ is Hermitian.
(b) Find the eigenvalues using the characteristic equation.
(c) Find the eigenvectors and verify they are orthogonal.
(d) Write the spectral decomposition $A = sum_k lambda_k |e_k><e_k|$.

**E8.** Let $U = mat(cos theta & -sin theta; sin theta & cos theta)$.

(a) Show that $U$ is unitary for all real $theta$.
(b) Find the eigenvalues of $U$.
(c) For what values of $theta$ is $U$ also Hermitian?

**E9.** Compute the commutators:

(a) $[X, Y]$ where $X = mat(0 & 1; 1 & 0)$ and $Y = mat(0 & -i; i & 0)$.
(b) $[X, H]$ where $H = 1/sqrt(2) mat(1 & 1; 1 & -1)$.
(c) $[H, Z]$ where $Z = mat(1 & 0; 0 & -1)$.

---

## Quantum States and Measurement

**E10.** A qubit is in state $|psi> = 3/5|0> + 4/5|1>$.

(a) Verify the state is normalized.
(b) What is $P(0)$ and $P(1)$ if measured in the computational basis?
(c) What is $P(+)$ and $P(-)$ if measured in the Hadamard basis?
(d) Write the density matrix $rho = |psi><psi|$.

**E11.** A two-qubit system is in state $|psi> = 1/sqrt(6)(|00> + i|01> + sqrt(2)|10>)$.

(a) Is this state normalized? If not, normalize it.
(b) Find the probability that the first qubit is measured to be $0$.
(c) Write the post-measurement state for each outcome.
(d) Is this state entangled? Justify.

**E12.** A qubit is in the mixed state $rho = 3/4|0><0| + 1/4|1><1|$.

(a) Compute $tr(rho)$ and $tr(rho^2)$.
(b) Is this a pure or mixed state?
(c) What are the measurement probabilities in the computational basis?
(d) What are the measurement probabilities in the Hadamard basis?

---

## Bloch Sphere

**E13.** For each state, find the Bloch sphere coordinates $(theta, phi)$:

(a) $|psi> = 1/sqrt(2)(|0> + i|1>)$
(b) $|psi> = 3/5|0> + 4/5|1>$
(c) $|psi> = 1/sqrt(2)(|0> - |1>)$

**E14.** On the Bloch sphere, a state starts at the north pole ($|0>$). Apply the following sequence of gates and trace the path:

(a) $X$ gate
(b) Then $H$ gate
(c) Then $S$ gate
(d) Then $T$ gate

Give the final Bloch vector after each step.

---

## Quantum Gates and Circuits

**E15.** For the following circuits, compute the output state for the given input:

(a) Input $|00>$, apply $H$ to qubit 1, then CNOT(1,2).
(b) Input $|10>$, apply $H$ to qubit 2, then CNOT(2,1).
(c) Input $|11>$, apply $X$ to qubit 1, then $H$ to qubit 2, then CNOT(1,2).

**E16.** Compute the $4 times 4$ matrix for the following circuit: $Z$ on qubit 1, $X$ on qubit 2, then CNOT(1,2).

**E17.** Show that the Toffoli gate can implement the classical AND gate: $"CCNOT" |a, b, 0> = |a, b, a "AND" b>$.

**E18.** Implement the OR gate using Toffoli: find a circuit with Toffoli gates that computes $|a, b, a "OR" b>$ from $|a, b, 0>$.

---

## Tensor Products and Entanglement

**E19.** Compute the following tensor products:

(a) $mat(1; 2) times.circle mat(3; 4)$
(b) $X times.circle Z$
(c) $H times.circle I$

**E20.** Determine whether each state is a product state or entangled:

(a) $|psi> = 1/sqrt(2)(|00> + |11>)$
(b) $|psi> = 1/2(|00> + |01> + |10> + |11>)$
(c) $|psi> = 1/sqrt(3)(|00> + |01> + |10>)$
(d) $|psi> = (2/3)|00> + (2/3)|01> + (1/3)|10> + (1/3)|11>$

**E21.** Construct all four Bell states from $|00>$ using quantum circuits. Write out the circuit for each.

---

## Algorithms

**E22.** Apply Grover's algorithm to $N = 8$ (3 qubits) with the marked item $|101>$:

(a) Write the initial state $|psi>$.
(b) Apply the oracle (write the $8 times 8$ diagonal matrix).
(c) Apply the diffusion operator $D = 2|psi><psi| - I$.
(d) Compute the state after one Grover iteration.
(e) How many iterations are needed to find the marked item with high probability?

**E23.** For Shor's algorithm with $N = 21, a = 2$:

(a) Compute $f(x) = 2^x mod 21$ for $x = 0, 1, ..., 7$.
(b) Find the period $r$.
(c) Compute $gcd(2^(r/2) - 1, 21)$ and $gcd(2^(r/2) + 1, 21)$.
(d) What are the factors of 21?

**E24.** Trace through the Deutsch-Jozsa algorithm for a 2-bit function $f$ that is constant ($f(x) = 1$ for all $x$):

(a) Write the initial state.
(b) Apply $H^(times.circle 2) times.circle H$.
(c) Apply the oracle $U_f$.
(d) Apply $H^(times.circle 2)$ to the first two qubits.
(e) What is the measurement outcome? What does it tell you about $f$?

---

## Error Correction

**E25.** Encode $|psi> = 3/5|0> + 4/5|1>$ using the 3-qubit bit-flip code ($0 -> 000$, $1 -> 111$).

(a) Write the encoded state.
(b) A bit-flip error occurs on qubit 2. Write the corrupted state.
(c) Apply the bit-flip correction circuit. What is the corrected state?
(d) Verify that the corrected state matches the original encoding.

**E26.** Encode $|psi> = alpha|0> + beta|1>$ using Shor's 9-qubit code.

(a) Write the full encoded state in terms of $alpha$ and $beta$.
(b) An $X$ error occurs on qubit 4. What is the corrupted state?
(c) Explain step by step how the error is detected and corrected.
