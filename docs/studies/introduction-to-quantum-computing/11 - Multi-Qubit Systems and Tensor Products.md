---
title: "11 - Multi-Qubit Systems and Tensor Products"
math_syntax: typst
---

# 11 — Multi-Qubit Systems and Tensor Products

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


## Why This Matters

Quantum computing derives its power from the exponentially large state space of multi-qubit systems. Two qubits live in a 4-dimensional space; three qubits live in an 8-dimensional space; $n$ qubits live in a $2^n$-dimensional space. The tensor product is the mathematical tool that builds this space.

---

## 11.1 The Tensor Product

The **tensor product** of two vector spaces $V$ (dimension $m$) and $W$ (dimension $n$) is a vector space $V times.circle W$ of dimension $m n$.

For vectors $|v> = sum_i a_i |v_i> in V$ and $|w> = sum_j b_j |w_j> in W$:

$ |v> times.circle |w> = sum_(i,j) a_i b_j |v_i> times.circle |w_j> $

**Notation:** $|v> times.circle |w>$ is often written as $|v>|w>$ or $|v w>$.

### Worked Example 11.1

Compute $|0> times.circle |1>$ and $mat(1; 2) times.circle mat(3; 4; 5)$.

**Solution:**

$|0> times.circle |1> = mat(1; 0) times.circle mat(0; 1) = mat(1 dot 0; 1 dot 1; 0 dot 0; 0 dot 1) = mat(0; 1; 0; 0) = |01>$

$mat(1; 2) times.circle mat(3; 4; 5) = mat(1 dot 3; 1 dot 4; 1 dot 5; 2 dot 3; 2 dot 4; 2 dot 5) = mat(3; 4; 5; 6; 8; 10)$

---

## 11.2 Tensor Product of Operators

If $A$ is an $m times m$ matrix acting on $V$ and $B$ is an $n times n$ matrix acting on $W$, then $A times.circle B$ is an $(m n) times (m n)$ matrix acting on $V times.circle W$:

$ (A times.circle B)(|v> times.circle |w>) = (A|v>) times.circle (B|w>) $

**Matrix construction (Kronecker product):**

$ A times.circle B = mat(A_(1 1) B & dots.h & A_(1 m) B; dots.v & dots.down & dots.v; A_(m 1) B & dots.h & A_(m m) B) $

### Worked Example 11.2

Compute $X times.circle I$ and $I times.circle X$ for single-qubit systems.

**Solution:**

$ X times.circle I = mat(0 & 1; 1 & 0) times.circle mat(1 & 0; 0 & 1) = mat(0 & 0 & 1 & 0; 0 & 0 & 0 & 1; 1 & 0 & 0 & 0; 0 & 1 & 0 & 0) $

$ I times.circle X = mat(1 & 0; 0 & 1) times.circle mat(0 & 1; 1 & 0) = mat(0 & 1 & 0 & 0; 1 & 0 & 0 & 0; 0 & 0 & 0 & 1; 0 & 0 & 1 & 0) $

**Key observation:** $X times.circle I$ flips the *first* qubit; $I times.circle X$ flips the *second* qubit. These are different operations!

---

## 11.3 Product States vs. Entangled States

A state $|psi> in V times.circle W$ is a **product state** (or **separable**) if it can be written as:

$ |psi> = |v> times.circle |w> $

Otherwise, it is **entangled**.

### Worked Example 11.3

Is $|psi> = 1/sqrt(2)(|00> + |11>)$ a product state?

**Solution:**

Suppose $|psi> = (a|0> + b|1>) times.circle (c|0> + d|1>) = a c|00> + a d|01> + b c|10> + b d|11>$.

Matching coefficients:
$a c = 1/sqrt(2)$, $a d = 0$, $b c = 0$, $b d = 1/sqrt(2)$

From $a d = 0$: either $a = 0$ or $d = 0$.
- If $a = 0$: then $a c = 0 != 1/sqrt(2)$ ✗
- If $d = 0$: then $b d = 0 != 1/sqrt(2)$ ✗

No solution exists. Therefore $|psi>$ is **entangled** (not a product state).

---

## 11.4 Multi-Qubit Computational Basis

For $n$ qubits, the computational basis is:

$ {|0>, |1>}^(times.circle n) = {|i_1 i_2 ... i_n> : i_k in {0, 1}} $

This gives $2^n$ basis states, indexed by binary strings of length $n$.

**Examples:**
- 1 qubit: $|0>, |1>$ (2 states)
- 2 qubits: $|00>, |01>, |10>, |11>$ (4 states)
- 3 qubits: $|000>, |001>, ..., |111>$ (8 states)

A general $n$-qubit state:

$ |psi> = sum_(i_1, ..., i_n = 0)^1 c_(i_1 ... i_n) |i_1 i_2 ... i_n> $

has $2^n$ complex coefficients, satisfying $sum |c_(i_1 ... i_n)|^2 = 1$.

---

## 11.5 The Tensor Product and the Bell State Construction

The standard circuit for creating the Bell state $|Phi^+> = 1/sqrt(2)(|00> + |11>)$:

$ |00> -> (H times.circle I) -> "CNOT" -> 1/sqrt(2)(|00> + |11>) $

**Step-by-step:**

1. Start: $|00>$
2. Apply $H$ to qubit 1: $(H times.circle I)|00> = 1/sqrt(2)(|0> + |1>) times.circle |0> = 1/sqrt(2)(|00> + |10>)$
3. Apply CNOT: $"CNOT"(1/sqrt(2)(|00> + |10>)) = 1/sqrt(2)(|00> + |11>)$

---

## 11.6 Constructing all Four Bell States

| Bell State | Definition | Circuit |
|-----------|-----------|---------|
| $|Phi^+>$ | $1/sqrt(2)(|00> + |11>)$ | $H$ on q1, CNOT(q1, q2) |
| $|Phi^-> $ | $1/sqrt(2)(|00> - |11>)$ | $H$ on q1, CNOT(q1, q2), $Z$ on q1 |
| $|Psi^+>$ | $1/sqrt(2)(|01> + |10>)$ | $H$ on q1, CNOT(q1, q2), $X$ on q2 |
| $|Psi^-> $ | $1/sqrt(2)(|01> - |10>)$ | $H$ on q1, CNOT(q1, q2), $X$ on q2, $Z$ on q1 |

---

## 11.7 The SWAP Test

To determine whether two states $|phi>$ and $|psi>$ are equal without measuring them directly, use the SWAP test:

1. Prepare an ancilla qubit in $|0>$
2. Apply $H$ to the ancilla
3. Apply controlled-SWAP (Fredkin gate) with ancilla as control
4. Apply $H$ to the ancilla
5. Measure the ancilla

$P("ancilla" = 0) = 1/2(1 + |<phi|psi>|^2)$

If $P(0) = 1$, the states are identical. If $P(0) = 1/2$, the states are orthogonal.

---

## Common Mistakes

- **Tensor product is not commutative**: $|v> times.circle |w> != |w> times.circle |v>$ in general. The ordering of qubits matters.
- **$2^n$ scaling**: The state space grows exponentially. Two qubits have 4 amplitudes; three have 8; ten have 1024. This is both the power and the challenge of quantum computing.
- **Product states are the exception, not the rule**: Most random states in $CC^(2^n)$ are entangled. Product states form a measure-zero subset.
- **Confusing the tensor product of vectors with the tensor product of operators**: The tensor product of two vectors is a vector; the tensor product of two matrices is a matrix.

---

## Revision Checklist

- [ ] I can compute tensor products of vectors and matrices
- [ ] I can determine whether a two-qubit state is a product state or entangled
- [ ] I can construct the four Bell states using quantum circuits
- [ ] I understand the exponential scaling of multi-qubit state spaces
- [ ] I can use the Kronecker product to build multi-qubit gate matrices
- [ ] I can apply tensor product operations to compute circuit outputs
