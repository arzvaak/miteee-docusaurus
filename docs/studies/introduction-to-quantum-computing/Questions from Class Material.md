---
title: "Questions from Class Material"
math_syntax: typst
---

# Questions from Class Material

> *Problems appearing in the Unit IV course material, with worked answers.*

---

## Linear Vector Spaces and Dirac Notation

**Q1.** Consider the vector space $CC^2$. Show that the set ${mat(1; 0), mat(0; 1)}$ is linearly independent and spans $CC^2$.

**Q2.** Consider the set ${mat(1; 2), mat(2; 4), mat(1; 1), mat(1; -1)}$ in $CC^2$. Determine which subsets are linearly independent and which are linearly dependent.

**Q3.** Consider the set ${mat(1; 2+i), mat(5+i; 1), mat(2+i; 1)}$ in $CC^2$. Determine whether this set is linearly independent or linearly dependent.

---

## Inner Products

**Q4.** Let $|v> = mat(1; i)$ and $|w> = mat(i; 1)$.

(a) Compute $<v|w>$ and $<w|v>$.
(b) Are $|v>$ and $|w>$ orthogonal?

**Q5.** Compute the norms $||v||$ and $||w||$ for the vectors above. Normalize both vectors.

---

## Basis and Change of Basis

**Q6.** An orthonormal basis for $CC^2$ is given by $|v_1'> = 1/sqrt(2) mat(1; 1)$ and $|v_2'> = 1/sqrt(2) mat(1; -1)$. Express an arbitrary vector $mat(z_1; z_2)$ in this basis.

**Q7.** Express $|0>$ and $|1>$ in the basis ${|v_1'>, |v_2'>}$ from Q6.

---

## Operators and Matrices

**Q8.** Let $|0>$ and $|1>$ be the basis vectors of $CC^2$ and $A$ be a linear operator such that $A|0> = |1>$ and $A|1> = |0>$. Give a matrix representation for $A$ with respect to the given basis.

**Q9.** Consider a matrix $A$, a ket $|psi>$ and a bra $<phi|$:

$ A = mat(-1+i & 5; -i & 3; 3i & 8), quad |psi> = mat(3+2i; 3i; 2+3i), quad <phi| = (6-i, 5, 1-i) $

(a) Calculate the quantities: $A|psi>$, $<phi|A$, and $<phi|A|psi>$.
(b) Find the Hermitian conjugate (adjoint) of $A$, $|psi>$, and $<phi>$.

---

## Unitary Operators

**Q10.** Show that the following matrix is unitary:

$ U = 1/sqrt(2) mat(1 & i; i & 1) $

**Q11.** Verify using explicit calculation whether the following matrix is unitary:

$ U = mat(1/2 & i/2; i/2 & 1/2) $

---

## Quantum Measurement

**Q12.** Consider a normalized state $psi = 3/4 |0> + 1/4 |1>$. If a measurement is made on this state, what are the probabilities of getting the states $|0>$ and $|1>$ after measurement?

**Q13.** A qubit is prepared in state $psi = 1/sqrt(3)|0> - 1/sqrt(3)|1>$... *(continued in deck with second qubit measurement)*

---

## Bloch Sphere

**Q14.** Find the points on the Bloch sphere which correspond to the states:

$ |+> = 1/sqrt(2)(|0> + |1>), quad |-> = 1/sqrt(2)(|0> - |1>) $

**Q15.** Express the state $1/sqrt(2)(|0> + i|1>)$ in Bloch sphere coordinates $(theta, phi)$.

---

## Pauli Gate Identities

**Q16.** Prove the following commutation identities:

(a) $X Y = -Y X = i Z$
(b) $Y Z = -Z Y = i X$
(c) $Z X = -Z X = i Y$

---

## Quantum Circuits

**Q17.** Find the output for a quantum circuit taking the input superposition state $alpha|0> + beta|1>$, where the circuit applies Hadamard to the first qubit and then CNOT.

**Q18.** Consider a two-qubit quantum circuit. Evaluate the output states for the following input states: $|00>$, $|01>$, $|10>$, $|11>$.

---

## Hadamard Gate Properties

**Q19.** Show that the Hadamard gate is unitary.

**Q20.** Using matrix multiplication, show that applying the Hadamard gate twice to $|0>$ results in its original state.

---

## Phase Gate and S-T Relationship

**Q21.** Show that $T^2 = S$.

---

## Related Practice Problems (from deck appendix)

**Q22.** Verify the identity $H times.circle H |00> = 1/2(|00> + |01> + |10> + |11>)$.

**Q23.** Show that the SWAP gate can be decomposed as $"SWAP" = "CNOT"_(12) "CNOT"_(21) "CNOT"_(12)$.

**Q24.** Construct the $8 times 8$ matrix for the Toffoli ("CCNOT") gate.

**Q25.** Verify that $det(U) = 1$ for the $"SU"(2)$ representation of the Pauli gates.
