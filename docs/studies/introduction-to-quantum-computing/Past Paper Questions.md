---
title: "Past Paper Questions"
math_syntax: typst
---

# Past Paper Questions

> *Questions sourced from syllabus-matched related exam papers. Since the deck has no verified course code, all papers below are labeled* **Syllabus-matched related papers** *and are never presented as exact past papers for this specific course. Only questions whose subject matter overlaps the deck have been admitted.*

---

## Syllabus-Matched Related Papers

### Paper 1: CSE 5025 — Fundamentals of Quantum Computing (May 2023)

**Q1.** Let $|psi> = (1/2 + i/2)|0> + (1/2 - i/2)|1>$. Compute $|psi|$... *(normalization check)* and $<psi|psi>$.

**Q2.** For the state $|psi>$ in Q1, compute probabilities of getting $|0>$ and $|1>$.

**Q3.** If $U = mat(1/2 & i/2; i/2 & 1/2)$, compute $U^dagger$ (conjugate transpose of $U$).

**Q4.** Let $|phi> = 1/sqrt(2)|01> + 1/sqrt(2)|10>$. Compute probabilities of getting $|00>, |01>, |10>, |11>$.

**Q5.** Compute outputs for all inputs $|00>, |01>, |10>, |11>$ for a given 2-qubit quantum circuit and give its matrix representation.

**Q6.** Test whether the following quantum state is entangled or not. Justify your answer: $1/sqrt(2)(|000> + |111>)$.

**Q7.** In the quantum teleportation protocol, Alice and Bob share a Bell pair $|Phi^+> = 1/sqrt(2)(|00> + |11>)$. Alice has a qubit in state $|phi> = a|0> + b|1>$. Illustrate how the protocol works. Show that it involves the transmission of exactly two classical bits and demonstrate how Bob ends up with state $|phi>$.

**Q8.** Design quantum circuit for quantum teleportation protocol.

**Q9.** Encode the state $|psi> = alpha|0> + beta|1>$ using Shor's 9 qubit code.

**Q10.** Given the 2-qubit QFT matrix, compute $"QFT"_2^(-1)$ (inverse QFT).

**Q11.** Let $N = 15, a = 7$. Apply Shor's algorithm to find the period $r$ and factors of $N$.

**Q12.** Imagine we define a unitary $U$ that copies $|psi_1> = 1/sqrt(2)(|0> + |1>)$ and $|psi_2> = 1/sqrt(2)(|0> - |1>)$. Can $U$ be used to copy $|0>$? Verify using explicit calculation.

**Q13.** Design Deutsch algorithm to test whether a function is constant or balanced. Construct quantum circuit for Deutsch algorithm.

**Q14.** Design quantum circuit to encode $|psi> = a|0> + b|1>$ using 3-qubit bit flip code.

---

### Paper 2: CSE 5025 — Fundamentals of Quantum Computing Makeup (July 2023)

**Q15.** Let $|psi_1> = 1/sqrt(2)(|0> + |1>)$ and $|psi_2> = (1/3)|0> + (2/3)|1>$. Compute $<psi_1|psi_2>$.

**Q16.** Consider $|psi> = 1/2(|00> - |10> + |01> - |11>)$. The first qubit is measured. What is $P(0)$? What is $P(1)$? For each outcome, write the post-measurement state and calculate $P(0), P(1)$ for the second qubit.

**Q17.** Let $|psi_1> = (1/3|0> + 2/3|1>)$ and $|psi_2> = 3/2|0> + 1/2|1>$. Compute $|psi_1> times.circle |psi_2>$.

**Q18.** Alice uses BB84 protocol. Binary string: $0110100010010111$. Encoding: $H H H I I H I H H I I I H I I H$. What quantum state does she transmit? Bob decodes with $I H H I H I H H I H I I I H I H$. What string do they retain?

**Q19.** Design quantum circuit for Bell state $1/sqrt(2)(|01> + |10>)$.

**Q20.** With quantum circuit, implement AND, OR and NOT gates using CCNOT gate.

**Q21.** Define Fredkin gate. Design quantum circuit for Fredkin gate, compute outputs for all inputs, and give its matrix representation.

**Q22.** Suppose a two-qubit system is in state $1/sqrt(2)(|00> + |11>)$. A Pauli-X gate is applied to the second qubit, and a Hadamard gate to the first. What is the new state? What are the measurement probabilities?

**Q23.** Let $N = 15, a = 11$. Apply Shor's algorithm to find factors of $N$.

**Q24.** Suppose Charlie intercepts a qubit in superdense coding. Can he infer which 2-bit pair Alice was sending? If so, how? If not, why not?

**Q25.** Show that $1/sqrt(2)(|01> + |10>)$ is an entangled state.

**Q26.** Apply Grover's algorithm on $N = 4$ with solution indexed by $x = 0$.

---

### Paper 3: CSE 5115 — Quantum Computing (December 2023)

**Q27.** A qubit is in state $|psi> = 1/sqrt(3)|0> - 2/sqrt(3)|1>$. Compute $P(1)$. The qubit is measured again. Calculate $P(0)$ and $P(1)$ for the second measurement, given first measurement gave 1.

**Q28.** Define "braket" of two vectors $v$ and $w$. If $v = 1/2 mat(1; i)$ and $w = i/2 mat(1; 1)$, compute $<v|w>$.

**Q29.** Determine whether $|00> + |01>$ is entangled. Justify.

**Q30.** Given $|psi> = 1/2(|00> + |01> + |10> + |11>)$, can this be expressed as a separable state? Find $|phi_1>, |phi_2>$ such that $|psi> = |phi_1> times.circle |phi_2>$ if possible.

**Q31.** Let $H$ and $I$ be Hadamard and Identity gates. $|psi> = 1/2(|00> + |01> + |10> + |11>)$. Compute $|psi_1> = (H times.circle I)|psi>$.

**Q32.** Define CNOT gate. Design CNOT circuit and compute CNOT matrix.

**Q33.** Define $I$ gate. Derive the Braket representation of $I$ gate.

**Q34.** Show that SWAP can be implemented using CNOT gates. Design the SWAP circuit and compute SWAP matrix.

**Q35.** Explain No Cloning Principle. Illustrate using CNOT gate.

**Q36.** Alice uses BB84 with string $0101011101101000$ and encoding $H H H I I H I H H I I I H I I H$. Bob decodes with $I H H I H I H H I H I I I H I H$. Compute retained string.

**Q37.** Apply Grover's algorithm on $N = 4$ with solution indexed by $x = 0$.

**Q38.** Let $H$ be Hadamard. Compute $H^(times.circle n)|0>^(times.circle n)$ and express result in summation form.

**Q39.** Encode $|psi> = a|0> + b|1>$ using 3-qubit bit flip code ($0 -> 000$, $1 -> 111$). Design quantum circuit.

---

### Paper 4: CSE 5115 — Quantum Computing Makeup (January 2024)

**Q40.** A qubit is in state $|psi> = 1/sqrt(2)|+> + 1/sqrt(2)|->$... *(measurement in X basis)*. Compute $P(+)$ and $P(-)$.

**Q41.** Given $|psi> = 1/sqrt(2)(|0> + |1>)$ and $|phi> = 1/sqrt(2)(|0> - |1>)$, compute $<psi|phi>$.

**Q42.** Determine whether $|00> - |11>$ is entangled. Justify.

**Q43.** Given $|psi_1> = 1/3|0> + 2/3|1>$ and $|psi_2> = 1/2|0> + 1/sqrt(3)|1>$, compute $|psi_1> times.circle |psi_2>$.

**Q44.** Let $|psi> = 1/2(|00> + |01> + |10> + |11>)$. Compute $|psi_1> = (H times.circle H)|psi>$.

**Q45.** Define CCNOT gate. Design quantum circuit for CCNOT and give matrix representation. Implement FANOUT using CCNOT.

**Q46.** Define $Y$ gate. Derive Braket representation of $Y$ gate.

**Q47.** Compute the matrix for the three-qubit Toffoli gate.

**Q48.** Compute the matrix for 2-qubit QFT.

**Q49.** Alice uses BB84 with string $1001011110101000$. Encoding: $H H H I I H I H H I I I H I I H$. Bob decodes: $I H H I H I H H I H I I I H I H$. Compute retained string.

**Q50.** Alice transmits '00' via superdense coding. Charlie intercepts, measures, re-transmits. Calculate $P("Bob" = '00')$.

**Q51.** Using quantum algorithm, compute the period of $f(x) = 11x mod 15$.

**Q52.** Explain 3 challenges in quantum error correcting codes.

**Q53.** Encode $|psi> = alpha|0> + beta|1>$ using Shor's 9 qubit code. An X error occurs on the 8th qubit. Determine the state after the error.

---

### Paper 5: CSE 5420 — Introduction to Quantum Computing (May 2024)

**Q54.** Show that $|0> = 1/sqrt(2)(|+> + |->)$ and $|1> = 1/sqrt(2)(|+> - |->)$.

**Q55.** Prove that $1/sqrt(2)(|00> + |11>) = 1/sqrt(2)(|++> + |-->)$.

**Q56.** Given $|psi> = 1/2(|++> + |-->)$, compute probabilities of measuring $|++>, |+->, |-+>, |-->$.

**Q57.** Consider a two-qubit quantum circuit with $H$ gates. Compute outputs for $|00>, |01>, |10>, |11>$ and find the matrix representation.

**Q58.** Let $U = mat(1/2 & i/2; i/2 & 1/2)$. Prove that $U$ is unitary. For $|psi> = (1/2 + i/2)|0> + (1/2 - i/2)|1>$, compute $U|psi>$.

**Q59.** With a neat diagram, explain the Bloch sphere.

**Q60.** Examine whether $|phi> = 1/sqrt(6)(|00> + i|01> + sqrt(2)|10>)$ is entangled.

**Q61.** Define Bell state. Construct all four standard Bell states.

**Q62.** With circuit diagram, define Fredkin gate and give its matrix representation.

**Q63.** Construct 2-qubit QFT for all inputs and give matrix representation.

**Q64.** With quantum circuit, implement NAND and XOR gates using Toffoli gate.

**Q65.** Alice transmits '00' via superdense coding. Charlie intercepts, measures, re-transmits. Calculate $P("Bob" = '00')$.

**Q66.** Using quantum algorithm, compute the period of $f(x) = 3x mod 20$.

**Q67.** Design quantum circuit for Deutsch-Jozsa algorithm.

**Q68.** Encode $alpha|0> + beta|1>$ using bit-flip code ($0 -> 000$, $1 -> 111$). A $Y$ error occurs on the 2nd qubit. Compute the decoded state.

---

### Paper 6: CSE 5115 — Quantum Computing (November 2024)

**Q69.** Consider $|psi> = 1/sqrt(30)(|00> + 2i|01> - 3|10> - 4i|11>)$. The first qubit is measured. Find $P(0)$ and $P(1)$. Write post-measurement states and compute second measurement probabilities.

**Q70.** Given $|v> = 1/2|0> + 1/2|1>$ and $|w> = 1/sqrt(5)|0> + 2/sqrt(5)|1>$, compute $<v|w>$.

**Q71.** Given $|psi_2> = 1/3|0> + 1/2|1>$ and $|psi_3> = 1/sqrt(2)|0> + 1/sqrt(3)|1>$, compute $|psi_2> times.circle |psi_3>$.

**Q72.** Verify whether $|phi> = 1/sqrt(6)(|00> + i|01> + sqrt(2)|10>)$ is entangled.

**Q73.** Let $|psi> = 1/2(|00> + |01> + |10> + |11>)$. Compute $|psi_1> = (H times.circle I)|psi>$.

**Q74.** Explain four postulates of quantum mechanics.

**Q75.** Define $Z$ gate. Design Controlled-$Z$ quantum circuit and construct its matrix.

**Q76.** Define Toffoli gate. Design its quantum circuit and give matrix representation. Implement OR gate using Toffoli.

**Q77.** Unitary $U$ copies $|psi_1> = 1/sqrt(2)(|0> + |1>)$ and $|psi_2> = 1/sqrt(2)(|0> - |1>)$. Can $U$ copy $|0>$? Justify.

**Q78.** Consider a quantum circuit with $H$ gates and SWAP. Compute outputs for $|000>, |001>, |010>, |011>, |100>, |101>, |110>, |111>$ and find the matrix.

**Q79.** Alice uses BB84 with string $0101011101101000$ and encoding $H H H I I H I H H I I I H I I H$. Compute quantum state and retained string after sifting.

**Q80.** Alice transmits '00' via superdense coding. Charlie intercepts, measures, re-transmits. Calculate probability Bob correctly receives '00'.

**Q81.** Alice has two qubits in state $|phi> = alpha_0|00> + alpha_1|01> + alpha_2|10> + alpha_3|11>$ plus a shared Bell pair $|Phi^+>$. Use quantum teleportation to transmit the first qubit of $|phi>$ to Bob. What is the resulting joint state?

**Q82.** Let $H$ be Hadamard. Compute $H^(times.circle n)|0>^(times.circle n)$ and express in summation form.

**Q83.** Show that $1/sqrt(2)(|01> + |10>)$ is a stabilizer state and write down its stabilizer.
