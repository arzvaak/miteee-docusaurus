---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

> *Condensed checklist for last-minute review. Each item links to the chapter where full explanations live.*

---

## Mathematical Foundations ([01 - Mathematical Foundations and Complex Vector Spaces](/notes/studies-introduction-to-quantum-computing-01---mathematical-foundations-and-complex-vector-spaces))

- [ ] $z = a + i b$, $overline(z) = a - i b$, $|z| = sqrt(a^2 + b^2)$, $z overline(z) = |z|^2$
- [ ] $CC^n$ is the state space for $n$ qubits; it has complex scalars and $n$-tuple column vectors
- [ ] Vector space axioms: closure, associativity, commutativity, zero vector, additive inverse, distributivity, multiplicative identity
- [ ] Subspace test: contains $0$, closed under addition, closed under scalar multiplication

---

## Dirac Notation ([02 - Dirac Notation](/notes/studies-introduction-to-quantum-computing-02---dirac-notation))

- [ ] Ket $|v>$ = column vector; Bra $<v| = |v>^dagger$ = row vector with conjugated entries
- [ ] Inner product $<v|w>$ = scalar; Outer product $|v><w|$ = matrix
- [ ] Completeness: $sum_k |e_k><e_k| = I$
- [ ] Zero vector is $0$, NOT $|0>$

---

## Inner Products and Norms ([03 - Inner Products and Norms](/notes/studies-introduction-to-quantum-computing-03---inner-products-and-norms))

- [ ] $<u|v> = sum overline(u_k) v_k$ (conjugate on first argument)
- [ ] $<v|u> = overline(<u|v>)$
- [ ] Norm: $||v|| = sqrt(<v|v>)$; normalized: $<v|v> = 1$
- [ ] Orthonormal: $<e_i|e_j> = delta_(i j)$

---

## Bases ([04 - Linear Independence, Bases, and Dimension](/notes/studies-introduction-to-quantum-computing-04---linear-independence-bases-and-dimension))

- [ ] Linearly independent: $sum a_k |v_k> = 0$ implies all $a_k = 0$
- [ ] Basis = spanning + linearly independent
- [ ] $dim(CC^n) = n$; $n$ qubits → $dim = 2^n$
- [ ] Key bases: computational ${|0>, |1>}$, Hadamard ${|+>, |->}$, Bell ${|Phi^+>, |Phi^->, |Psi^+>, |Psi^-> }$

---

## Operators ([05 - Operators and Matrices](/notes/studies-introduction-to-quantum-computing-05---operators-and-matrices))

- [ ] Matrix representation: $A_(j k) = <e_j|A|e_k>$
- [ ] Adjoint: $A^dagger = overline(A)^T$; $(A B)^dagger = B^dagger A^dagger$
- [ ] Commutator: $[A, B] = A B - B A$; Anticommutator: ${A, B} = A B + B A$
- [ ] Trace: $tr(A) = sum A_(k k)$; $tr(A B) = tr(B A)$

---

## Eigenvalues ([06 - Eigenvalues, Eigenvectors, and the Spectral Theorem](/notes/studies-introduction-to-quantum-computing-06---eigenvalues-eigenvectors-and-the-spectral-theorem))

- [ ] $det(A - lambda I) = 0$ gives eigenvalues
- [ ] $tr(A) = sum lambda_k$; $det(A) = product lambda_k$
- [ ] 2×2 formula: $lambda = (tr(A) +/- sqrt(tr(A)^2 - 4 det(A)))/2$
- [ ] Spectral decomposition: $A = sum lambda_k |e_k><e_k|$ (for Hermitian/normal $A$)

---

## Hermitian / Unitary ([07 - Hermitian, Unitary, and Normal Operators](/notes/studies-introduction-to-quantum-computing-07---hermitian-unitary-and-normal-operators))

- [ ] Hermitian: $A = A^dagger$ → real eigenvalues, orthogonal eigenvectors
- [ ] Unitary: $UU^dagger = I$ → preserves norms, $|lambda_k| = 1$
- [ ] Normal: $NN^dagger = N^dagger N$ → diagonalizable by unitary
- [ ] Pauli: $X^2 = Y^2 = Z^2 = I$; $X Y = i Z$, $Y Z = i X$, $Z X = i Y$

---

## Postulates ([08 - Quantum Postulates and Measurement](/notes/studies-introduction-to-quantum-computing-08---quantum-postulates-and-measurement))

- [ ] Postulate 1: state = unit vector in Hilbert space
- [ ] Postulate 2: composite system = tensor product of spaces
- [ ] Postulate 3: closed system evolution = unitary operator
- [ ] Postulate 4: measurement = Hermitian observable; $P(lambda_k) = |<e_k|psi>|^2$; post-measurement = normalized projection
- [ ] No-cloning theorem: unknown quantum states cannot be copied

---

## Bloch Sphere ([09 - Qubits and the Bloch Sphere](/notes/studies-introduction-to-quantum-computing-09---qubits-and-the-bloch-sphere))

- [ ] $|psi> = cos(theta/2)|0> + e^(i phi) sin(theta/2)|1>$
- [ ] $|0>$ = north pole, $|1>$ = south pole
- [ ] $|+>, |->$, $|+i>, |-i>$ = equator
- [ ] Density matrix: $rho = |psi><psi|$ (pure), $tr(rho^2) = 1$ (pure), $< 1$ (mixed)

---

## Gates ([10 - Quantum Gates and Circuits](/notes/studies-introduction-to-quantum-computing-10---quantum-gates-and-circuits))

- [ ] $X = mat(0 & 1; 1 & 0)$, $Z = mat(1 & 0; 0 & -1)$, $H = 1/sqrt(2) mat(1 & 1; 1 & -1)$
- [ ] $S = mat(1 & 0; 0 & i)$, $T = mat(1 & 0; 0 & e^(i pi/4))$; $T^2 = S$, $S^2 = Z$
- [ ] CNOT matrix: identity with rows 2,3 swapped
- [ ] Toffoli: flips 3rd qubit iff first two are $|1>$
- [ ] Universal set: ${H, T, "CNOT"}$

---

## Multi-Qubit Systems ([11 - Multi-Qubit Systems and Tensor Products](/notes/studies-introduction-to-quantum-computing-11---multi-qubit-systems-and-tensor-products))

- [ ] $|v> times.circle |w>$: tensor product of vectors; $A times.circle B$: Kronecker product of matrices
- [ ] Product state: $|psi> = |v> times.circle |w>$; entangled: cannot be decomposed this way
- [ ] $n$ qubits → $2^n$ basis states, $2^n$ amplitudes
- [ ] "SWAP" = 3 CNOTs: $"CNOT"_(12) "CNOT"_(21) "CNOT"_(12)$

---

## Entanglement ([12 - Entanglement and Bell States](/notes/studies-introduction-to-quantum-computing-12---entanglement-and-bell-states))

- [ ] $|Phi^+> = 1/sqrt(2)(|00> + |11>)$: maximally entangled
- [ ] Test for entanglement: try product decomposition; if no solution → entangled
- [ ] Teleportation: Bell pair + 2 classical bits + local unitary → state transfer
- [ ] No faster-than-light communication (classical message required)

---

## Algorithms ([13 - Quantum Algorithms and Protocols](/notes/studies-introduction-to-quantum-computing-13---quantum-algorithms-and-protocols))

- [ ] **Deutsch-Jozsa**: 1 query vs classical $2^(n-1)+1$; measures in computational basis
- [ ] **Grover**: $O(sqrt(N))$ vs classical $O(N)$; oracle + diffusion operator
- [ ] **QFT**: $"QFT" |j> = 1/sqrt(2^n) sum e^(2 pi i j k/2^n) |k>$; 2-qubit matrix: $1/2 mat(1 & 1 & 1 & 1; 1 & i & -1 & -i; 1 & -1 & 1 & -1; 1 & -i & -1 & i)$
- [ ] **Shor**: period finding via QFT; $N = 15, a = 7$: $r = 4$, factors $3, 5$
- [ ] **BB84**: random bit + random basis → sifted key; eavesdropper detection via error rate
- [ ] **Superdense coding**: 1 qubit + Bell pair → 2 classical bits
- [ ] **Shor's 9-qubit code**: 3 blocks of 3; corrects both bit-flip and phase-flip errors
