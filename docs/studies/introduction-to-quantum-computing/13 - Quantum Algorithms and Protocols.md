---
title: "13 - Quantum Algorithms and Protocols"
math_syntax: typst
---

# 13 — Quantum Algorithms and Protocols

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Quantum algorithms exploit superposition, interference, and entanglement to solve certain problems exponentially faster than any known classical algorithm. This chapter covers the algorithms and protocols in scope for this course.

---

## 13.1 The Deutsch-Jozsa Problem

**Problem:** Given a function $f: {0, 1}^n -> {0, 1}$ that is promised to be either *constant* (same output for all inputs) or *balanced* (outputs 0 for exactly half the inputs and 1 for the other half), determine which.

**Classical:** Requires up to $2^(n-1) + 1$ queries in the worst case.

**Quantum (Deutsch-Jozsa algorithm):** Requires exactly **1** query.

### Algorithm (n = 1: Deutsch's Algorithm)

1. Prepare $|0>|1>$
2. Apply $H times.circle H$: get $1/2(|0> + |1>)(|0> - |1>)$
3. Apply the oracle $U_f: |x>|y> -> |x>|y plus f(x)>$: get $1/2 sum_x (-1)^(f(x)) |x>(|0> - |1>)$
4. Apply $H$ to the first qubit
5. Measure the first qubit

**Result:** If the measurement gives $0$, $f$ is constant. If it gives $1$, $f$ is balanced.

### General Algorithm (n qubits)

1. Prepare $|0>^(times.circle n) |1>$
2. Apply $H^(times.circle (n+1))$
3. Apply oracle $U_f$
4. Apply $H^(times.circle n)$ to the first $n$ qubits
5. Measure the first $n$ qubits

$P("all zeros") = cases( 1 & "if" f "is constant", 0 & "if" f "is balanced")$

---

## 13.2 Grover's Search Algorithm

**Problem:** Search an unsorted database of $N$ items for a marked item. Classical: $O(N)$ queries. Quantum: $O(sqrt(N))$ queries.

### Algorithm

1. Initialize: $|psi> = H^(times.circle n)|0>^(times.circle n) = 1/sqrt(N) sum_(x=0)^(N-1) |x>$
2. Repeat $O(sqrt(N))$ times:
   a. **Oracle**: flip the phase of the marked state: $|x> -> (-1)^(f(x)) |x>$
   b. **Diffusion operator**: reflect about the average: $D = 2|psi><psi| - I$

3. Measure in the computational basis.

### Worked Example 13.1: Grover's on $N = 4$ with marked item $x = 0$

**Solution:**

$|psi> = 1/2(|00> + |01> + |10> + |11>)$

**Oracle** (marks $|00>$): $U_"oracle" |00> = -|00>$, others unchanged.

$U_"oracle" |psi> = 1/2(-|00> + |01> + |10> + |11>)$

**Diffusion operator** $D = 2|psi><psi| - I$:

After one iteration of Grover's, the amplitude of $|00>$ is amplified and the others are reduced. For $N = 4$, one iteration is sufficient to reach the marked state with probability 1.

$D U_"oracle" |psi> = |00>$

**Result:** Measuring gives $|00>$ with probability 1.

---

## 13.3 Quantum Fourier Transform (QFT)

The **QFT** on $n$ qubits is defined by:

$ "QFT" |j> = 1/sqrt(2^n) sum_(k=0)^(2^n - 1) e^(2 pi i j k / 2^n) |k> $

### 2-Qubit QFT

$ "QFT"_2 |00> = 1/2(|00> + |01> + |10> + |11>) $

$ "QFT"_2 |01> = 1/2(|00> + i|01> - |10> - i|11>) $

$ "QFT"_2 |10> = 1/2(|00> - |01> + |10> - |11>) $

$ "QFT"_2 |11> = 1/2(|00> - i|01> - |10> + i|11>) $

Matrix form:

$ "QFT"_2 = 1/2 mat(1 & 1 & 1 & 1; 1 & i & -1 & -i; 1 & -1 & 1 & -1; 1 & -i & -1 & i) $

### Inverse QFT

$ "QFT"_2^(-1) = "QFT"_2^dagger $

For $"QFT"_2$, the inverse is obtained by replacing $i$ with $-i$ (complex conjugation):

$ "QFT"_2^(-1) = 1/2 mat(1 & 1 & 1 & 1; 1 & -i & -1 & i; 1 & -1 & 1 & -1; 1 & i & -1 & -i) $

### Circuit for 2-Qubit QFT

1. Apply $H$ to qubit 1
2. Apply controlled-$R_1$ (phase gate $S$) with qubit 1 as control, qubit 2 as target
3. Apply $H$ to qubit 2
4. SWAP the two qubits

---

## 13.4 Shor's Algorithm (Overview)

**Problem:** Factor an integer $N$ into its prime factors.

**Classical best:** Sub-exponential (general number field sieve).

**Quantum (Shor's):** Polynomial — $O((log N)^3)$.

### Key Idea

Factoring reduces to **period finding**: find the period $r$ of $f(x) = a^x mod N$ for a randomly chosen $a$.

1. Choose random $a$ with $gcd(a, N) = 1$
2. Use QFT to find the period $r$ of $f(x) = a^x mod N$
3. If $r$ is even, compute $gcd(a^(r/2) +/- 1, N)$ to get factors

### Worked Example 13.2: $N = 15$, $a = 7$

**Solution:**

Compute $f(x) = 7^x mod 15$:
$7^1 = 7$, $7^2 = 49 mod 15 = 4$, $7^3 = 28 mod 15 = 13$, $7^4 = 91 mod 15 = 1$

Period: $r = 4$.

$a^(r/2) = 7^2 = 49$. $gcd(49 - 1, 15) = gcd(48, 15) = 3$. $gcd(49 + 1, 15) = gcd(50, 15) = 5$.

Factors: $3$ and $5$.

---

## 13.5 Shor's 9-Qubit Error Correction Code

**Problem:** Protect a single-qubit state $|psi> = alpha|0> + beta|1>$ against single-bit errors.

**Encoding:**

$ |0> -> 1/sqrt(8)(|000> + |111>)(|000> + |111>)(|000> + |111>) $

$ |1> -> 1/sqrt(8)(|000> - |111>)(|000> - |111>)(|000> - |111>) $

$ |psi> = alpha|0> + beta|1> -> alpha|0_L> + beta|1_L>$

**Structure:** 3 blocks of 3 qubits each. Within each block, bit-flip errors are detected. Across blocks, phase-flip errors are detected.

**Error correction:**
- **Bit-flip error** on qubit $k$: detected by majority vote within the block of 3
- **Phase-flip error** on a block: detected by comparing blocks (using Hadamard + CNOT)

---

## 13.6 Quantum Key Distribution: BB84 Protocol

**Goal:** Alice and Bob share a secret key, detecting any eavesdropper.

### Protocol

1. **Alice** generates random bits and random basis choices ($Z$ or $X$ basis for each)
2. **Alice encodes**: bit $0$ in $Z$ basis as $|0>$, bit $1$ in $Z$ basis as $|1>$, bit $0$ in $X$ basis as $|+>$, bit $1$ in $X$ basis as $|->$.
3. **Alice transmits** qubits to Bob
4. **Bob measures** each qubit in a randomly chosen basis ($Z$ or $X$)
5. **Sifting**: Alice and Bob publicly announce their basis choices (not the bits). They keep only the bits where they used the same basis.
6. **Eavesdropper detection**: They compare a subset of the retained bits. If the error rate is too high, an eavesdropper is present.

### Worked Example 13.3

Alice's string: $0110100010010111$. Encoding: $H H H I I H I H H I I I H I I H$.

**Solution:**

$I$ means $Z$ basis, $H$ means $X$ basis.

| Bit | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 1 | 1 | 1 |
|-----|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Basis | X | X | X | Z | Z | X | Z | X | X | Z | Z | Z | X | Z | Z | X |
| State | $\|->$ | $\|+>$ | $\|+>$ | $\|0>$ | $\|1>$ | $\|->$ | $\|0>$ | $\|->$ | $\|+>$ | $\|0>$ | $\|0>$ | $\|1>$ | $\|->$ | $\|1>$ | $\|1>$ | $\|->$ |

Bob decodes with: $I H H I H I H H I H I I I H I H$.

After sifting (keeping only matching bases), Alice and Bob retain the bits where their bases agree.

---

## 13.7 Superdense Coding

**Goal:** Alice sends 2 classical bits to Bob by transmitting only 1 qubit (using a pre-shared Bell pair).

### Protocol

1. Alice and Bob share $|Phi^+> = 1/sqrt(2)(|00> + |11>)$
2. Alice encodes her 2-bit message by applying a gate to her qubit:

| Message | Alice's gate | Resulting state |
|---------|-------------|----------------|
| $00$ | $I$ | $1/sqrt(2)(|00> + |11>)$ |
| $01$ | $X$ | $1/sqrt(2)(|01> + |10>)$ |
| $10$ | $Z$ | $1/sqrt(2)(|00> - |11>)$ |
| $11$ | $i Y = Z X$ | $1/sqrt(2)(|01> - |10>)$ |

3. Alice sends her qubit to Bob
4. Bob applies CNOT(q1, q2) then H to q1
5. Bob measures both qubits to recover the 2-bit message

**Eavesdropping:** If Charlie intercepts and measures Alice's qubit, the Bell pair is destroyed. Bob's measurement will give incorrect results with probability $3/4$, revealing the eavesdropper.

---

## Common Mistakes

- **Grover's is not a speedup for all search problems**: It provides a quadratic speedup ($sqrt(N)$ vs $N$) for unstructured search. It does not help with structured databases where classical algorithms already do well.
- **Shor's algorithm requires a quantum computer**: The period-finding subroutine uses QFT, which is exponentially hard to simulate classically.
- **BB84 security is based on physics, not math**: The security comes from the no-cloning theorem and the disturbance caused by measurement.
- **Superdense coding does not transmit 2 bits with 1 qubit of classical communication**: It uses 1 qubit of quantum communication PLUS the pre-shared entangled pair.

---

## Revision Checklist

- [ ] I can describe the Deutsch-Jozsa algorithm and explain why it beats the classical approach
- [ ] I can apply Grover's algorithm to a small ($N = 4$) search problem
- [ ] I can write the 2-qubit QFT matrix and its inverse
- [ ] I can outline Shor's algorithm and apply it to factor small numbers
- [ ] I understand the structure of Shor's 9-qubit code
- [ ] I can trace through the BB84 protocol step by step
- [ ] I can explain superdense coding and why it requires entanglement
