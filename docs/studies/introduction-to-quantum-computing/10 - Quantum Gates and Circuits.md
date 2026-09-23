---
title: "10 - Quantum Gates and Circuits"
math_syntax: typst
---

# 10 — Quantum Gates and Circuits

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Quantum gates are the building blocks of quantum algorithms. Just as classical computers use AND, OR, and NOT gates, quantum computers use unitary gates. The key difference: quantum gates can create superpositions and entanglement.

---

## 10.1 Single-Qubit Gates

Every single-qubit gate is a $2 times 2$ unitary matrix. The most important ones:

### Pauli Gates

$ X = mat(0 & 1; 1 & 0) quad "(NOT gate: flips |0> and |1>)" $

$ Y = mat(0 & -i; i & 0) quad "(bit + phase flip)" $

$ Z = mat(1 & 0; 0 & -1) quad "(phase flip: |1> -> -|1>)" $

### Hadamard Gate

$ H = 1/sqrt(2) mat(1 & 1; 1 & -1) $

Creates superposition: $H|0> = |+>$, $H|1> = |->$.

**Properties:** $H$ is Hermitian ($H = H^dagger$), unitary ($H^2 = I$), and its own inverse.

### Phase Gates

$ S = mat(1 & 0; 0 & i) = Z^(1/2) quad "(quarter turn about z-axis)" $

$ T = mat(1 & 0; 0 & e^(i pi/4)) = S^(1/2) quad "(eighth turn about z-axis)" $

**Relationship:** $T^2 = S$, $S^2 = Z$.

### General Rotation Gates

$ R_x(theta) = mat(cos(theta/2) & -i sin(theta/2); -i sin(theta/2) & cos(theta/2)) $

$ R_y(theta) = mat(cos(theta/2) & -sin(theta/2); sin(theta/2) & cos(theta/2)) $

$ R_z(theta) = mat(e^(-i theta/2) & 0; 0 & e^(i theta/2)) $

---

## 10.2 Verification: Hadamard Is Unitary

We show $H H^dagger = I$:

$ H H^dagger = H^2 = 1/2 mat(1 & 1; 1 & -1) mat(1 & 1; 1 & -1) = 1/2 mat(2 & 0; 0 & 2) = I $ ✓

We also verify that applying $H$ twice to $|0>$ returns to $|0>$:

$ H|0> = 1/sqrt(2)(|0> + |1>) $

$ H(1/sqrt(2)(|0> + |1>)) = 1/2(H|0> + H|1>) = 1/2((|0> + |1>) + (|0> - |1>)) = |0>$ ✓

---

## 10.3 Two-Qubit Gates

### CNOT (Controlled-NOT) Gate

The **CNOT** gate flips the target qubit if and only if the control qubit is $|1>$:

$ "CNOT" |00> = |00>, quad "CNOT" |01> = |01> $
$ "CNOT" |10> = |11>, quad "CNOT" |11> = |10> $

Matrix representation (in the basis ${|00>, |01>, |10>, |11>}$):

$ "CNOT" = mat(1 & 0 & 0 & 0; 0 & 1 & 0 & 0; 0 & 0 & 0 & 1; 0 & 0 & 1 & 0) $

**Key property:** CNOT creates entanglement from a product state. If the control is in superposition:

$ "CNOT" (1/sqrt(2)(|0> + |1>) times.circle |0>) = 1/sqrt(2)(|00> + |11>) $

This is the Bell state $|Phi^+>$.

### SWAP Gate

$ "SWAP" |a b> = |b a> $

$ "SWAP" = mat(1 & 0 & 0 & 0; 0 & 0 & 1 & 0; 0 & 1 & 0 & 0; 0 & 0 & 0 & 1) $

The SWAP gate can be implemented using three CNOT gates:

$ "SWAP" = "CNOT"_(12) "CNOT"_(21) "CNOT"_(12) $

where $"CNOT"_(i j)$ means qubit $i$ is control and qubit $j$ is target.

### Controlled-Z (CZ) Gate

$ "CZ" |a b> = (-1)^(a b) |a b> $

$ "CZ" = mat(1 & 0 & 0 & 0; 0 & 1 & 0 & 0; 0 & 0 & 1 & 0; 0 & 0 & 0 & -1) $

### Toffoli (CCNOT) Gate

A **three-qubit** gate: flips the third qubit if and only if the first two are both $|1>$:

$ "CCNOT" |a b c> = |a, b, c plus (a dot b)> $

$ "CCNOT" |110> = |111>$, and all other computational basis states are unchanged.

**Matrix:** $8 times 8$ identity with rows 6 and 7 swapped (0-indexed).

**Universal classical computation:** Toffoli + Hadamard = universal quantum gate set.

### Fredkin (Controlled-SWAP) Gate

Swaps the second and third qubits if and only if the first qubit is $|1>$.

$ "Fredkin" |1, a, b> = |1, b, a>$
$ "Fredkin" |0, a, b> = |0, a, b>$

---

## 10.4 Circuit Diagram Notation

Quantum circuits are read **left to right**:
- Horizontal lines represent qubits (wires)
- Boxes represent gates
- CNOT is drawn as: control dot on one wire connected by a vertical line to a $plus.circle$ symbol on the target wire
- The initial state is at the left; measurement is at the right

### Worked Example 10.1

Draw the circuit for: apply $H$ to qubit 1, then CNOT with qubit 1 as control and qubit 2 as target. Compute the output for input $|00>$.

**Solution:**

$|00> -> H times.circle I -> "CNOT"$

Step 1: $(H times.circle I)|00> = H|0> times.circle |0> = 1/sqrt(2)(|0> + |1>) times.circle |0> = 1/sqrt(2)(|00> + |10>)$

Step 2: $"CNOT"(1/sqrt(2)(|00> + |10>)) = 1/sqrt(2)(|00> + |11>)$

Output: $1/sqrt(2)(|00> + |11>) = |Phi^+>$ (Bell state)

---

## 10.5 Matrix Representation of Multi-Qubit Circuits

For a circuit with $n$ qubits, each gate is a $2^n times 2^n$ matrix. Gates acting on different qubits are combined via tensor products.

### Worked Example 10.2

Compute the matrix for the circuit: $H$ on qubit 1, $I$ on qubit 2, then CNOT.

**Solution:**

$U = "CNOT" (H times.circle I)$

$H times.circle I = 1/sqrt(2) mat(1 & 0 & 1 & 0; 0 & 1 & 0 & 1; 1 & 0 & -1 & 0; 0 & 1 & 0 & -1)$

$U = mat(1 & 0 & 0 & 0; 0 & 1 & 0 & 0; 0 & 0 & 0 & 1; 0 & 0 & 1 & 0) (1/sqrt(2) mat(1 & 0 & 1 & 0; 0 & 1 & 0 & 1; 1 & 0 & -1 & 0; 0 & 1 & 0 & -1))$

$ = 1/sqrt(2) mat(1 & 0 & 1 & 0; 0 & 1 & 0 & 1; 0 & 1 & 0 & -1; 1 & 0 & -1 & 0) $

---

## 10.6 Universal Gate Sets

A set of gates is **universal** if any unitary operation can be approximated to arbitrary accuracy using only gates from the set.

**Known universal sets:**
- ${H, T, "CNOT"}$ (most common in quantum computing theory)
- ${H, S, T, "CNOT"}$
- ${R_x(theta), R_y(theta), "CNOT"}$ for any irrational $theta/pi$
- Single-qubit gates + CNOT (any unitary can be decomposed into this form)

---

## Common Mistakes

- **Order of gate application**: Gates are applied right-to-left in matrix multiplication but left-to-right in circuit diagrams. The leftmost gate in the diagram is applied first.
- **Tensor product ordering**: $(H times.circle I)|00> != I times.circle H|00>$ in general. The tensor product order matters.
- **CNOT is not commutative with single-qubit gates**: You cannot freely move a CNOT past an $X$ or $Z$ gate without modifying the circuit.
- **Forgetting that multi-qubit gates act on the entire register**: A CNOT acts on both qubits simultaneously; it is NOT two separate operations.

---

## Revision Checklist

- [ ] I can write the matrices for Pauli, Hadamard, S, and T gates
- [ ] I can verify that a gate is unitary
- [ ] I can compute the output of a simple quantum circuit
- [ ] I can draw circuit diagrams for common gate sequences
- [ ] I know the CNOT, SWAP, Toffoli, and Fredkin gates and their matrices
- [ ] I understand universal gate sets
