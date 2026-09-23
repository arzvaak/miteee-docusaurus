---
title: "12 - Entanglement and Bell States"
math_syntax: typst
---

# 12 — Entanglement and Bell States

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Entanglement is the quintessentially quantum resource that has no classical analog. It powers quantum teleportation, superdense coding, quantum key distribution, and gives quantum computing its exponential advantage. Understanding entanglement — what it is, how to create it, and how to detect it — is fundamental.

---

## 12.1 What Is Entanglement?

A bipartite state $|psi>_({A B})$ is **entangled** if it cannot be written as a product:

$ |psi>_({A B}) != |phi>_A times.circle |chi>_B $

for any states $|phi>_A$ and $|chi>_B$.

Equivalently: the Schmidt rank of $|psi>_({A B})$ is greater than 1.

---

## 12.2 The Bell States

The four **Bell states** (or **EPR pairs**) are the maximally entangled two-qubit states:

$ |Phi^+> = 1/sqrt(2)(|00> + |11>) $

$ |Phi^->  = 1/sqrt(2)(|00> - |11>) $

$ |Psi^+> = 1/sqrt(2)(|01> + |10>) $

$ |Psi^->  = 1/sqrt(2)(|01> - |10>) $

They form an orthonormal basis for $CC^4$ (the Bell basis).

### Properties of Bell States

- **Maximally entangled**: neither qubit has a definite state on its own
- **Tracing out either qubit**: gives the maximally mixed state $I/2$
- **Measurement outcomes**: perfectly correlated (for $|Phi^+>$ and $|Phi^-> $) or anti-correlated (for $|Psi^+>$ and $|Psi^-> $)
- **No local information**: measuring one qubit gives a random outcome (50/50), but tells you exactly what the other qubit will give

---

## 12.3 Testing for Entanglement

### Method 1: Product State Decomposition

Try to write $|psi> = (a|0> + b|1>) times.circle (c|0> + d|1>)$ and check for consistency.

### Method 2: Density Matrix / Partial Trace

Compute the reduced density matrix by tracing out one subsystem:

$ rho_A = tr_B(|psi><psi|) $

If $rho_A$ is pure ($tr(rho_A^2) = 1$), the state is a product state. If $tr(rho_A^2) < 1$, the state is entangled.

### Method 3: Schmidt Decomposition

Write $|psi>_({A B}) = sum_k lambda_k |u_k>_A |v_k>_B$ where ${|u_k>}$ and ${|v_k>}$ are orthonormal. If the number of non-zero $lambda_k$ (Schmidt rank) is $> 1$, the state is entangled.

### Worked Example 12.1

Determine whether $|psi> = 1/sqrt(3)(|00> + |01> + |10>)$ is entangled.

**Solution (Method 1):**

Suppose $|psi> = (a|0> + b|1>) times.circle (c|0> + d|1>) = a c|00> + a d|01> + b c|10> + b d|11>$.

Matching: $a c = 1/sqrt(3)$, $a d = 1/sqrt(3)$, $b c = 1/sqrt(3)$, $b d = 0$.

From $b d = 0$: $b = 0$ or $d = 0$.
- If $b = 0$: $b c = 0 != 1/sqrt(3)$ ✗
- If $d = 0$: $a d = 0 != 1/sqrt(3)$ ✗

**The state is entangled.**

### Worked Example 12.2

Determine whether $|psi> = 1/2(|00> + |01> + |10> + |11>)$ is entangled.

**Solution (Method 1):**

$|psi> = 1/2(|0> + |1>) times.circle (|0> + |1>) = 1/sqrt(2) |+> times.circle 1/sqrt(2) |+>$

This **is** a product state (not entangled).

---

## 12.4 Entanglement and Measurement

Consider $|Phi^+> = 1/sqrt(2)(|00> + |11>)$.

If we measure qubit A:
- $P(A = 0) = 1/2$, post-measurement state: $|00>$
- $P(A = 1) = 1/2$, post-measurement state: $|11>$

After measuring qubit A to be $0$, qubit B is *definitely* in state $|0>$ — instantaneously, regardless of the distance between them. This is the **EPR paradox**: it appears that information travels faster than light, but no usable information can be transmitted this way (the outcomes are random).

---

## 12.5 Bell's Inequality and Bell's Theorem

**Bell's theorem** shows that no local hidden variable theory can reproduce all predictions of quantum mechanics.

**CHSH inequality** (a specific form of Bell's inequality):

For any local hidden variable theory:

$ |S| = |E(a, b) - E(a, b') + E(a', b) + E(a', b')| <= 2 $

where $E(a, b)$ is the correlation function for measurements along directions $a$ and $b$.

**Quantum mechanics** can violate this: $|S| = 2 sqrt(2)$ (the **Tsirelson bound**), achieved using the Bell state $|Phi^+>$ with appropriate measurement directions.

**Implications:**
- Entanglement is a genuine non-classical resource
- Nature is fundamentally non-local (in the Bell sense)
- Quantum cryptography (like BB84) can detect eavesdroppers because measurement disturbs entangled states

---

## 12.6 Quantum Teleportation

The **quantum teleportation** protocol transfers an unknown qubit state from Alice to Bob using:
1. One shared Bell pair (pre-distributed)
2. Two classical bits of communication
3. A local unitary correction by Bob

### Protocol for Teleporting $|psi> = alpha|0> + beta|1>$

**Setup:** Alice has qubit 1 (the state to teleport) and qubit 2 (her half of the Bell pair $|Phi^+>_({2 3})$). Bob has qubit 3.

**Initial state:**

$ |psi>_({1 2 3}) = (alpha|0>_1 + beta|1>_1) times.circle 1/sqrt(2)(|00>_({2 3}) + |11>_({2 3})) $

**Rewrite in the Bell basis for qubits 1 and 2:**

$ |psi>_({1 2 3}) = 1/2[ |Phi^+>_({1 2})(alpha|0>_3 + beta|1>_3) + |Phi^->_({1 2})(alpha|0>_3 - beta|1>_3) + |Psi^+>_({1 2})(alpha|1>_3 + beta|0>_3) + |Psi^->_({1 2})(alpha|1>_3 - beta|0>_3) ] $

**Alice measures qubits 1 and 2 in the Bell basis and sends 2 classical bits to Bob:**

| Alice's result | Bob's state | Bob applies |
|---------------|------------|------------|
| $|Phi^+>$ | $alpha|0> + beta|1>$ | $I$ (nothing) |
| $|Phi^-> $ | $alpha|0> - beta|1>$ | $Z$ |
| $|Psi^+>$ | $alpha|1> + beta|0>$ | $X$ |
| $|Psi^-> $ | $alpha|1> - beta|0>$ | $i Y$ (or $Z X$) |

After correction, Bob has $|psi> = alpha|0> + beta|1>$.

**Key points:**
- The original state is destroyed (consistent with no-cloning)
- Only 2 classical bits are transmitted (no faster-than-light communication)
- The protocol works for any $|psi>$, including entangled states (enabling entanglement swapping)

---

## 12.7 Quantum Teleportation Circuit

```
|psi>_1  ----●----●----M--------[classical bits]----
              |    |
|0>_2    ----●----●----M--------
              |
|0>_3    ----H---●--------
```

More precisely:

1. Alice applies CNOT(q1, q2)
2. Alice applies H to q1
3. Alice measures q1 and q2
4. Based on outcomes, Bob applies correction gate to q3

---

## Common Mistakes

- **Teleportation is not cloning**: The original state is destroyed during measurement. Bob ends up with the state, but Alice no longer has it.
- **No faster-than-light communication**: Bob needs Alice's classical message to know which correction to apply. Without it, his qubit is in a mixed state.
- **Entanglement is not a shared secret**: Measuring one half of an entangled pair gives a random outcome. You cannot choose what state the distant qubit ends up in.
- **Not all entangled states are Bell states**: The Bell states are maximally entangled. There are partially entangled states too (like $1/sqrt(3)(|00> + |01> + |10>)$).

---

## Revision Checklist

- [ ] I can write the four Bell states and construct them with circuits
- [ ] I can test whether a two-qubit state is entangled (product decomposition, density matrix, Schmidt rank)
- [ ] I can explain how measurement on one qubit of a Bell pair affects the other
- [ ] I can describe the quantum teleportation protocol step by step
- [ ] I understand why teleportation does not allow faster-than-light communication
- [ ] I know the difference between entangled and product states
