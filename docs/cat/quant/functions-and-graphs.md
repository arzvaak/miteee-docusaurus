---
title: "CAT Quant — Functions and Graphs"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 17
topic: "functions-graphs"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Chapter 17: Functions and Graphs — Complete Study Notes

---

## 1. Concept Map

```
FUNCTIONS AND GRAPHS
│
├── 1. Foundations
│   ├── Definition (Domain, Codomain, Range)
│   ├── Representation (Verbal, Arrow, Table, Graph, Equation)
│   └── Equal Functions
│
├── 2. Types of Functions
│   ├── Algebraic (Polynomial, Rational, Irrational, Piecewise)
│   ├── Transcendental (Trigonometric, Inverse Trig, Exponential, Logarithmic)
│   └── Special (Modulus, Signum, Greatest/Lowest Integer)
│
├── 3. Graph Transformations
│   ├── Shifts (Vertical/Horizontal)
│   ├── Stretches/Shrinks
│   ├── Reflections (x-axis, y-axis)
│   └── Modulus Transformations (|f(x)|, f(|x|))
│
├── 4. Function Operations
│   ├── Composite Functions (gof)
│   ├── Even/Odd Functions
│   ├── Injective/Surjective/Bijective
│   └── Inverse Functions
│
├── 5. Binary Operations & User-Defined Functions
│   ├── Commutative/Associative/Distributive
│   └── Symbolic Operations (CAT, XAT, #, @, etc.)
│
└── 6. Maxima & Minima
    ├── Quadratic (Completing Square, Formula)
    ├── AM-GM Inequality
    └── Min/Max of min/max functions
```

---

## 2. Foundations

### 2.1 Definition of a Function

A **function** is a relation between inputs and outputs satisfying two conditions:

1. **Every input must give some output.**
2. **No input should give more than one output.**

> **Note:** A function cannot be multiple-valued. For example, $y = \pm \sqrt{x}$ is **not** a function because it assigns two values to each positive $x$.

### 2.2 Domain, Codomain, Range

| Term | Definition | Example ($f(x) = x^2$) |
|------|------------|----------------------|
| **Domain** | Set of all inputs (pre-images) | $\mathbb{R}$ |
| **Codomain** | Set of all possible outputs | $\mathbb{R}$ |
| **Range** | Set of actual outputs (images) | $\mathbb{R}^+ \cup \{0\}$ |

**Key Fact:** Range $\subseteq$ Codomain.

**Number of functions:** If set $A$ has $n$ elements and set $B$ has $m$ elements, the total number of functions from $A$ to $B$ is $m^n$.

### 2.3 Domain Restrictions (Critical for CAT)

The domain of a real-valued function is the set of values of $x$ for which $y$ is real. There are **five common situations** where the domain is restricted:

| Situation | Example | Domain |
|-----------|---------|--------|
| **(a) Negative base of $\frac{1}{2n}$th power** | $y = \sqrt{x}$ | $x \ge 0$ |
| | $y = (x-3)^{1/2}$ | $x \ge 3$ |
| | $y = (|x| - 3)^{1/10}$ | $x \le -3$ or $x \ge 3$ |
| **(b) Denominator is zero** | $y = \frac{1}{x}$ | $x \neq 0$ |
| | $y = \frac{1}{x^2 - 16}$ | $x \neq \pm 4$ |
| | $y = \frac{1}{\ln x - 1}$ | $x \in (0, \infty) - \{e\}$ |
| **(c) Function becomes $0^0$** | $y = (|x|-3)^{(x-3)}$ | $x \neq 3$ |
| **(d) Argument of $\log_a x$ is non-positive** | $y = \log_{10}(x-5)$ | $x > 5$ |
| **(e) Base $a$ in $\log_a x$ is 1, 0, or negative** | $y = \log_{(x^2-4)} 12$ | $x \in (-\infty, -2) \cup (2, \infty)$, $x \neq \pm\sqrt{5}$ |

### 2.4 Range

**Definition:** The set of all images of all elements of the domain.

**Three Methods to Find Range:**

1. **Obtaining $x$ in terms of $y$:**
   - Example: $f(x) = \frac{x+2}{x+3} = y$
   - Solving: $x = \frac{2-3y}{y-1}$
   - For $y = 1$, no real $x$ exists → Range $= \mathbb{R} - \{1\}$

2. **For continuous functions:** Range $= [l, m]$ where $l$ = least value, $m$ = maximum value in the domain.

3. **By sketching graphs.**

### 2.5 Equal Functions

Two functions $f$ and $g$ are **equal** iff:

1. Domain of $f$ = Domain of $g$
2. Codomain of $f$ = Codomain of $g$
3. $f(x) = g(x)$ for every $x$ in their common domain

> **Trap Example:** $f(x) = \sqrt{\frac{x-3}{x-5}}$ and $g(x) = \frac{\sqrt{x-3}}{\sqrt{x-5}}$ are **different** because their domains differ. $f(x)$ is defined when both numerator and denominator are negative, but $g(x)$ is undefined in that case.

---

## 3. Types of Functions

### 3.1 Algebraic Functions

Contains a finite number of terms with different powers of $x$ and operations $+, -, \times, \div$.

#### A-1) Polynomial Functions

$$f(x) = a_0 + a_1x + a_2x^2 + \dots + a_nx^n$$

| Type | Form | Domain | Range | Symmetry |
|------|------|--------|-------|----------|
| Constant | $f(x) = c$ | $\mathbb{R}$ | $\{c\}$ | — |
| Identity | $y = x$ | $\mathbb{R}$ | $\mathbb{R}$ | About origin |
| Linear | $y = mx + c$ | $\mathbb{R}$ | $\mathbb{R}$ | — |
| Quadratic | $y = x^2$ | $\mathbb{R}$ | $\mathbb{R}^+ \cup \{0\}$ | About y-axis |
| Cubic | $y = x^3$ | $\mathbb{R}$ | $\mathbb{R}$ | About origin |
| Biquadratic | $y = x^4$ | $\mathbb{R}$ | $\mathbb{R}^+ \cup \{0\}$ | About y-axis |

**Key Rule:** Graph of $f(x) = x^n$ is symmetric about the **y-axis** if $n$ is even, and about the **origin** if $n$ is odd.

**Ordering of Powers (Critical for Inequalities):**

| Interval | Ordering |
|----------|----------|
| $x \in (0, 1)$ | $x > x^2 > x^3 > x^4 \dots$ |
| $x \in (1, \infty)$ | $x < x^2 < x^3 < x^4 \dots$ |
| $x \in (-1, 0)$ | $x < x^3 < x^5 \dots$ (negative); $x^2 > x^4 > x^6 \dots$ (positive) |
| $x \in (-\infty, -1)$ | $x > x^3 > x^5 \dots$ (negative); $x^2 < x^4 < x^6 \dots$ (positive) |

#### A-2) Rational Functions

$$f(x) = \frac{P(x)}{Q(x)}, \quad Q(x) \neq 0$$

**Domain:** All real numbers except the real roots of $Q(x)$.

**Important Rational Functions:**

| Function | Domain | Range | Symmetry |
|----------|--------|-------|----------|
| $y = \frac{1}{x}$ | $\mathbb{R} - \{0\}$ | $\mathbb{R} - \{0\}$ | About origin |
| $y = \frac{1}{x^2}$ | $\mathbb{R} - \{0\}$ | $\mathbb{R}^+$ | About y-axis |
| $y = \frac{1}{x^3}$ | $\mathbb{R} - \{0\}$ | $\mathbb{R} - \{0\}$ | About origin |

**Ordering of Reciprocal Powers:**

| Interval | Ordering |
|----------|----------|
| $x \in (1, \infty)$ | $\frac{1}{x} > \frac{1}{x^2} > \frac{1}{x^3} \dots$ |
| $x \in (0, 1)$ | $\frac{1}{x} < \frac{1}{x^2} < \frac{1}{x^3} \dots$ |
| $x \in (-1, 0)$ | $\frac{1}{x^2} < \frac{1}{x^4} \dots$ (positive); $\frac{1}{x} > \frac{1}{x^3} \dots$ (negative) |
| $x \in (-\infty, -1)$ | $\frac{1}{x^2} > \frac{1}{x^4} \dots$ (positive); $\frac{1}{x} < \frac{1}{x^3} \dots$ (negative) |

#### A-3) Irrational Functions

Algebraic functions with non-integral rational powers of $x$.

| Function | Domain | Range |
|----------|--------|-------|
| $y = x^{1/2}$ | $\mathbb{R}^+ \cup \{0\}$ | $\mathbb{R}^+ \cup \{0\}$ |
| $y = x^{1/3}$ | $\mathbb{R}$ | $\mathbb{R}$ |
| $y = x^{1/4}$ | $\mathbb{R}^+ \cup \{0\}$ | $\mathbb{R}^+ \cup \{0\}$ |

**Ordering of Fractional Powers:**

| Interval | Ordering |
|----------|----------|
| $x \in (1, \infty)$ | $x^{1/2} > x^{1/3} > x^{1/4} \dots$ |
| $x \in (0, 1)$ | $x^{1/2} < x^{1/3} < x^{1/4} \dots$ |

#### A-4) Piecewise Defined Functions

**Modulus Function:**
$$y = |x| = \begin{cases} x & \text{if } x \ge 0 \\ -x & \text{if } x < 0 \end{cases}$$
- Domain: $\mathbb{R}$, Range: $\mathbb{R}^+ \cup \{0\}$
- Symmetric about y-axis

**Signum Function:**
$$\operatorname{Sgn}(x) = \begin{cases} 1 & \text{if } x > 0 \\ 0 & \text{if } x = 0 \\ -1 & \text{if } x < 0 \end{cases}$$
- Domain: $\mathbb{R}$, Range: $\{-1, 0, 1\}$

**Greatest Integer Function (Step Function):**
$$y = [x] = \text{greatest integer} \le x$$
- Example: $[2.3] = 2$, $[-8.3] = -9$
- Domain: $\mathbb{R}$, Range: Set of integers

**Smallest (Least) Integer Function:**
$$y = \{x\} = \text{smallest integer} \ge x$$
- Example: $\{2.8\} = 3$, $\{-3.6\} = -3$
- Domain: $\mathbb{R}$, Range: Set of integers

### 3.2 Transcendental Functions

#### T-1) Trigonometric Functions

| Function | Period | Domain | Range |
|----------|--------|--------|-------|
| $\sin x$ | $2\pi$ | $\mathbb{R}$ | $[-1, 1]$ |
| $\cos x$ | $2\pi$ | $\mathbb{R}$ | $[-1, 1]$ |
| $\tan x$ | $\pi$ | $\mathbb{R} - \{(2n+1)\pi/2\}$ | $\mathbb{R}$ |
| $\operatorname{cosec} x$ | $2\pi$ | $\mathbb{R} - \{n\pi\}$ | $(-\infty, -1] \cup [1, \infty)$ |
| $\sec x$ | $2\pi$ | $\mathbb{R} - \{(2n+1)\pi/2\}$ | $(-\infty, -1] \cup [1, \infty)$ |
| $\cot x$ | $\pi$ | $\mathbb{R} - \{n\pi\}$ | $\mathbb{R}$ |

#### T-2) Inverse Trigonometric Functions

| Function | Domain |
|----------|--------|
| $\sin^{-1} x$ | $[-1, 1]$ |
| $\cos^{-1} x$ | $[-1, 1]$ |
| $\tan^{-1} x$ | $\mathbb{R}$ |
| $\cot^{-1} x$ | $\mathbb{R}$ |
| $\sec^{-1} x$ | $(-\infty, -1] \cup [1, \infty)$ |
| $\operatorname{cosec}^{-1} x$ | $(-\infty, -1] \cup [1, \infty)$ |

#### T-3) Exponential Function

$$y = a^x$$

| Condition | Domain | Range | Behavior |
|-----------|--------|-------|----------|
| $a > 1$ | $\mathbb{R}$ | $\mathbb{R}^+$ | Increasing |
| $0 < a < 1$ | $\mathbb{R}$ | $\mathbb{R}^+$ | Decreasing |

**Note:** $y = e^x$ and $y = e^{|x|}$ both have Domain $\mathbb{R}$, Range $\mathbb{R}^+$.

#### T-4) Logarithmic Function

$$y = \log_a x$$

- Domain: $x > 0$ (for real $a > 0$, $a \neq 1$)
- Range: $\mathbb{R}$

---

## 4. Graph Transformations

These are **critical for CAT** — many questions test your ability to visualize transformations.

| Transformation | Effect |
|----------------|--------|
| $f(x) \to f(x) + k$ | Shift **up** by $k$ |
| $f(x) \to f(x) - k$ | Shift **down** by $k$ |
| $f(x) \to kf(x)$, $k > 1$ | **Stretch** $k$ times along y-axis |
| $f(x) \to \frac{1}{k}f(x)$, $k > 1$ | **Shrink** $k$ times along y-axis |
| $f(x) \to -f(x)$ | **Mirror** in x-axis |
| $f(x) \to |f(x)|$ | Portion below x-axis **flipped up** (180° about x-axis) |
| $f(x) \to f(x+k)$ | Shift **left** by $k$ |
| $f(x) \to f(x-k)$ | Shift **right** by $k$ |
| $f(x) \to f(kx)$, $k > 1$ | **Shrink** $k$ times along x-axis |
| $f(x) \to f(x/k)$ | **Stretch** $k$ times along x-axis |
| $f(x) \to f(-x)$ | **Mirror** in y-axis |
| $f(x) \to f(|x|)$ | Plot $f(x)$ as is for $x \ge 0$; mirror the right portion for $x < 0$ |

> **Memory Aid:** For horizontal shifts, the sign is **opposite** to intuition: $f(x+2)$ shifts **left**, $f(x-2)$ shifts **right**.

---

## 5. Composite Functions

### 5.1 Definition

When the output of the first operation is the input for the second operation:

$$(g \circ f)(a) = g\{f(a)\}$$

If $f: A \to B$ and $g: B \to C$, then $g \circ f: A \to C$.

### 5.2 Properties

1. **Associative:** $f_1 \circ (f_2 \circ f_3) = (f_1 \circ f_2) \circ f_3$
2. **Non-commutative:** $g \circ f \neq f \circ g$ in general
   - Example: $f(x) = \cos x$, $g(x) = x^3$
   - $g \circ f(x) = \cos^3 x$ but $f \circ g(x) = \cos(x^3)$
3. **Range of $g \circ f$ may differ from range of $g$.**

### 5.3 Iterated Functions

For $f(x) = \frac{1}{x}$:
- $f^2(x) = f(f(x)) = x$
- $f^3(x) = f(f^2(x)) = \frac{1}{x}$
- **Pattern:** Even iterations give $x$, odd iterations give $\frac{1}{x}$

---

## 6. Even and Odd Functions

### 6.1 Definitions

| Type | Condition | Examples | Graph Symmetry |
|------|-----------|----------|----------------|
| **Even** | $f(-x) = f(x)$ | $\cos x$, $x^{2n}$, $|x|$ | About y-axis |
| **Odd** | $f(-x) = -f(x)$ | $\sin x$, $x^{2n-1}$ | About origin |

### 6.2 Operations on Even/Odd Functions

| Operation | Result |
|-----------|--------|
| Even + Even | Even |
| Odd + Odd | Odd |
| Even + Odd | Neither |
| Even × Even | Even |
| Odd × Odd | Even |
| Even × Odd | Odd |
| Even ÷ Even | Even |
| Odd ÷ Odd | Even |
| Even ÷ Odd | Odd |
| Odd ÷ Even | Odd |

**Composition Rule:** If at least one function is even, the composition is even. If all are odd, the composition is odd.

### 6.3 Key Formula

Any function can be expressed as the sum of an even and an odd function:

$$f(x) = \underbrace{\frac{1}{2}[f(x) + f(-x)]}_{\text{even part}} + \underbrace{\frac{1}{2}[f(x) - f(-x)]}_{\text{odd part}}$$

---

## 7. Injective, Surjective, and Bijective Functions

### 7.1 One-to-One (Injective)

A function that does not take the same value at two distinct points in its domain.

- **Test:** Every horizontal line intersects the graph at **not more than one** point.
- $f(x) = x^3$ is one-one; $f(x) = x^2$ is not.
- Functions that are not one-to-one are called **many-one** functions.

### 7.2 Onto (Surjective)

A function $f: A \to B$ where each element in $B$ is the $f$-image of at least one element in $A$.

- **Equivalently:** Codomain of $f$ = Range of $f$.
- If there exists at least one element in $B$ that is not the $f$-image of any element in $A$, then $f$ is an **into** function.

### 7.3 Bijective

A function that is **both** one-to-one and onto.

- An identity function is bijective.

---

## 8. Inverse Functions

### 8.1 Definition

If $f: A \to B$ is a **bijection**, the inverse function $f^{-1}: B \to A$ associates each element $y \in B$ to its pre-image $f^{-1}(y) \in A$.

### 8.2 Key Points

1. Inverse is defined **iff** the function is one-to-one and onto.
2. Inputs and outputs interchange their roles.
3. Inverse is **not defined** for many-one or into functions.
4. If the graph of $f(x)$ is symmetric about the line $y = x$, then $f(x)$ and $f^{-1}(x)$ are identical.
5. The graph of $f(x)$ and $f^{-1}(x)$ is symmetric about the line $y = x$.

---

## 9. Binary Operations

### 9.1 Definition

A function $f$ from $S \times S$ to $S$ is called a **binary operation** on $S$.

### 9.2 Types

| Type | Condition |
|------|-----------|
| **Commutative** | $a * b = b * a$ for all $a, b \in S$ |
| **Associative** | $(a * b) * c = a * (b * c)$ for all $a, b, c \in S$ |
| **Distributive** | $a * (b \oplus c) = (a * b) \oplus (a * c)$ (left); $(b \oplus c) * a = (b * a) \oplus (c * a)$ (right) |

---

## 10. User-Defined Functions (High-Yield for CAT)

These are functions defined as per the requirement of the problem, not standard functions. **Most CAT questions in this chapter are of this type.**

### 10.1 Direct Substitution

**Example:** If $f(A, B) = A \# B = A^4 - B^3 + A^2 - B + AB$, find $f(3, 4)$.

**Solution:** $3^4 - 4^3 + 3^2 - 4 + 12 = 81 - 64 + 9 - 4 + 12 = 34$

### 10.2 Solving for Unknowns

**Example:** If $A \# B = A + B + AB$ and $A \# C = A$, find $C$.

**Solution:** $A + C + AC = A \Rightarrow C(1 + A) = 0 \Rightarrow C = 0$ or $A = -1$

### 10.3 Nested User-Defined Functions

**Example:** If $f(a, b) = \frac{a+b}{2}$, $g(a, b) = a^2 + b^2$, $h(a, b) = \max(a, b)$, find $f(g(3, 9), h(-1, 1))$.

**Solution:** $f(90, 1) = \frac{90+1}{2} = 45.5$

### 10.4 Recursive User-Defined Functions

**Example:** $f_n = f_{n-1}$ if $n$ is even, and $2f_{n-1}$ if $n$ is odd, with $f_0 = 1$.

- $f_1 = 2(1) = 2$
- $f_2 = 2$
- $f_3 = 2(2) = 4$
- $f_4 = 4$
- $f_5 = 2(4) = 8$

**Answer:** $f_4 + f_5 = 4 + 8 = 12$; $f_{16} = 256$

### 10.5 "Devic Mathematics" (Redefined Symbols)

When symbols are redefined (e.g., $+ \to \times$, $- \to \div$, $\times \to +$, $\div \to -$), **always follow BODMAS rule** with the new meanings.

---

## 11. Maxima and Minima

### 11.1 Methods

**Method 1: Completing the Square**
$$x^2 + 8x + 10 = (x+4)^2 - 6$$
Minimum value = $-6$ (at $x = -4$)

**Method 2: Formula for Quadratic**
For $ax^2 + bx + c$:
$$\text{Min/Max} = \frac{-(b^2 - 4ac)}{4a}$$

- If $a > 0$: it's a **minima**
- If $a < 0$: it's a **maxima**

**Method 3: Differentiation**
- Find $\frac{dy}{dx}$, set to zero for critical points
- Second derivative negative → maxima; positive → minima

### 11.2 AM-GM Inequality (Key for CAT)

**Rule 1:** If $a_1 + a_2 + \dots + a_n = k$ (constant), the **maximum** value of $a_1 \cdot a_2 \dots a_n$ is obtained when $a_1 = a_2 = \dots = a_n$.

**Rule 2:** If $a_1 \cdot a_2 \dots a_n = k$ (constant), the **minimum** value of $a_1 + a_2 + \dots + a_n$ is obtained when $a_1 = a_2 = \dots = a_n$.

**Examples:**
- If $a + b = 20$, max of $ab = 10 \times 10 = 100$
- If $a + b + c = 24$, max of $abc = 8 \times 8 \times 8 = 512$
- If $ab = 25$, min of $a + b = 5 + 5 = 10$

### 11.3 Max/Min of min/max Functions

**Key Rule:**
- For $f(x)_{\max} = \min(x, y)$: max is obtained when $x = y$
- For $f(x)_{\min} = \max(x, y)$: min is obtained when $x = y$

**Example:** For $f(x) = \min(4 - 5x, x - 3)$ on $x \in (0, 4)$:
- Set $4 - 5x = x - 3 \Rightarrow x = \frac{7}{6}$
- Max value $= 4 - 5(\frac{7}{6}) = -\frac{11}{6}$

---

## 12. Worked Examples (Easy to Advanced)

### Example 1 (Easy): Domain of a Function

**Problem:** Find the domain of $f(x) = \frac{1}{\sqrt{|x| - 3}}$.

**Solution:**
- Denominator cannot be zero: $|x| - 3 \neq 0 \Rightarrow x \neq \pm 3$
- Inside square root must be non-negative: $|x| - 3 > 0 \Rightarrow |x| > 3$
- Therefore: $x < -3$ or $x > 3$

**Answer:** $x \in (-\infty, -3) \cup (3, \infty)$

---

### Example 2 (Easy): Range of a Rational Function

**Problem:** Find the range of $f(x) = \frac{x+2}{x+3}$.

**Solution:**
$$y = \frac{x+2}{x+3}$$
$$y(x+3) = x+2$$
$$yx + 3y = x + 2$$
$$x(y-1) = 2 - 3y$$
$$x = \frac{2-3y}{y-1}$$

For $y = 1$, no real $x$ exists.

**Answer:** Range $= \mathbb{R} - \{1\}$

---

### Example 3 (Medium): Composite Function

**Problem:** If $f(x) = \frac{x}{x-1}$ and $g(x) = \frac{1}{x}$, find $f(g(x))$ and its domain.

**Solution:**
$$f(g(x)) = f\left(\frac{1}{x}\right) = \frac{\frac{1}{x}}{\frac{1}{x} - 1} = \frac{1}{1-x}$$

**Domain:** $x \neq 0$ (for $g$) and $x \neq 1$ (for $f(g)$)

**Answer:** $f(g(x)) = \frac{1}{1-x}$, Domain: $\mathbb{R} - \{0, 1\}$

---

### Example 4 (Medium): Even/Odd Identification

**Problem:** Determine if $f(x) = \log\left(x + \sqrt{x^2 + 1}\right)$ is even, odd, or neither.

**Solution:**
$$f(-x) = \log\left(-x + \sqrt{x^2 + 1}\right)$$

Rationalize:
$$f(-x) = \log\left(\frac{(-x + \sqrt{x^2+1})(x + \sqrt{x^2+1})}{x + \sqrt{x^2+1}}\right) = \log\left(\frac{1}{x + \sqrt{x^2+1}}\right)$$
$$= -\log(x + \sqrt{x^2+1}) = -f(x)$$

**Answer:** $f(x)$ is **odd**.

---

### Example 5 (Medium): Graph Transformation

**Problem:** The graph of $y = f(x)$ is given. Describe the transformation to obtain $y = |f(x) - 2|$.

**Solution:**
1. First, shift $f(x)$ **down by 2** → $f(x) - 2$
2. Then, take the **modulus** → flip the portion below x-axis upward

**Answer:** Shift down 2 units, then reflect the part below the x-axis upward.

---

### Example 6 (Advanced): Functional Equation

**Problem:** If $f\left(x + \frac{1}{x}\right) = x^2 + \frac{1}{x^2}$, find $f(x)$.

**Solution:**
$$x^2 + \frac{1}{x^2} = \left(x + \frac{1}{x}\right)^2 - 2$$

Let $t = x + \frac{1}{x}$. Then $f(t) = t^2 - 2$.

**Answer:** $f(x) = x^2 - 2$

---

### Example 7 (Advanced): Recursive Function

**Problem:** $f(y, 0) = y + f(y-1, 0)$, $f(0, y) = y - f(0, y-1)$, $f(0, 0) = 1$. Find $f(0, 8)$.

**Solution:**
$$f(0, 1) = 1 - f(0, 0) = 1 - 1 = 0$$
$$f(0, 2) = 2 - f(0, 1) = 2 - 0 = 2$$
$$f(0, 3) = 3 - f(0, 2) = 3 - 2 = 1$$
$$f(0, 4) = 4 - f(0, 3) = 4 - 1 = 3$$
$$f(0, 5) = 5 - f(0, 4) = 5 - 3 = 2$$
$$f(0, 6) = 6 - f(0, 5) = 6 - 2 = 4$$
$$f(0, 7) = 7 - f(0, 6) = 7 - 4 = 3$$
$$f(0, 8) = 8 - f(0, 7) = 8 - 3 = 5$$

**Pattern:** $f(0, y) = \frac{y+2}{2}$ for even $y$; $f(0, y) = \frac{y-1}{2}$ for odd $y$.

**Answer:** $f(0, 8) = 5$

---

### Example 8 (Advanced): Digit-Based Function

**Problem:** $f(a_1, a_2, \dots, a_n) = a_1 2^{n-1} + a_2 2^{n-2} + \dots + a_n 2^0$, repeated until single digit. Find $f(128)$.

**Solution:**
$$f(128) = 1 \cdot 2^2 + 2 \cdot 2^1 + 8 \cdot 2^0 = 4 + 4 + 8 = 16$$
$$f(16) = 1 \cdot 2^1 + 6 \cdot 2^0 = 2 + 6 = 8$$

**Answer:** 8

---

### Example 9 (Advanced): Max/Min of min Function

**Problem:** Find the maximum value of $f(x) = \min(4x + 3, x + 4)$ on $x \in [0, 2]$.

**Solution:**
- At $x = 0$: $\min(3, 4) = 3$
- At $x = 2$: $\min(11, 6) = 6$
- The functions intersect when $4x + 3 = x + 4 \Rightarrow x = \frac{1}{3}$
- At $x = \frac{1}{3}$: $\min(\frac{13}{3}, \frac{13}{3}) = \frac{13}{3} \approx 4.33$
- At $x = 2$: value is 6

**Answer:** Maximum value = 6 (at $x = 2$)

---

## 13. Decision Rules (When to Use What)

| Situation | Method |
|-----------|--------|
| Find domain of a function | Check the 5 restrictions (roots, denominators, $0^0$, log arguments, log bases) |
| Find range of rational function | Solve for $x$ in terms of $y$; find excluded $y$ values |
| Identify graph from equation | Test key points ($x = 0, \pm 1, \pm 2$) and check symmetry |
| Identify equation from graph | Check intercepts, symmetry, and behavior at extremes |
| Determine if function is one-one | Horizontal line test |
| Determine if function is onto | Check if range = codomain |
| Find inverse | Swap $x$ and $y$, solve for $y$ |
| Evaluate user-defined function | Direct substitution; follow BODMAS if symbols are redefined |
| Find max/min of quadratic | Complete square or use formula $\frac{-(b^2-4ac)}{4a}$ |
| Find max of product given sum | AM-GM: make all terms equal |
| Find min of sum given product | AM-GM: make all terms equal |
| Max of $\min(x, y)$ | Set $x = y$ |
| Min of $\max(x, y)$ | Set $x = y$ |
| Solve functional equation | Test options directly (often fastest) |
| Evaluate recursive function | Build a small table; look for patterns |

---

## 14. Common Traps

1. **Domain of $\sqrt{x^2}$ vs $(\sqrt{x})^2$:**
   - $\sqrt{x^2}$: Domain is $\mathbb{R}$
   - $(\sqrt{x})^2$: Domain is $x \ge 0$

2. **Domain of $\log x^2$ vs $2\log x$:**
   - $\log x^2$: Domain is $\mathbb{R} - \{0\}$
   - $2\log x$: Domain is $x > 0$

3. **$f(x) = \frac{1}{\log_{10} x}$:** Domain is $\mathbb{R}^+ - \{1\}$ (not just $x > 0$)

4. **Greatest integer of negative numbers:** $[-8.3] = -9$ (not $-8$)

5. **$0^0$ is undefined:** $y = (|x|-3)^{(x-3)}$ is undefined at $x = 3$

6. **Even/Odd classification:** A function that is neither even nor odd is still a valid function.

7. **$g \circ f \neq f \circ g$:** Always compute both if needed.

8. **Range of $g \circ f$ may differ from range of $g$:** Don't assume.

9. **Inverse exists only for bijections:** Check one-one and onto first.

10. **For min/max of min/max functions:** The extremum occurs at the intersection point of the two functions, not at the endpoints (unless the intersection is outside the interval).

11. **"Devic Mathematics":** When symbols are redefined, follow BODMAS with new meanings — don't use standard meanings.

12. **Iterated functions with $f(x) = \frac{1}{x}$:** Even iterations give $x$, odd give $\frac{1}{x}$.

13. **Range of $\frac{x^2-1}{x^2+1}$:** Approaches 1 but never equals it — range is $[-1, 1)$, not $[-1, 1]$.

14. **For $f(x) = \frac{x^2+x+2}{x^2+x+1}$:** Range is $(1, \frac{7}{3}]$, not $[1, \frac{7}{3}]$.

---

## 15. Timed Strategy (CAT-Specific)

### Time Allocation (for ~4-5 questions)

| Question Type | Time Budget | Strategy |
|---------------|-------------|----------|
| User-defined function (direct) | 45–60 sec | Direct substitution; be careful with order of operations |
| User-defined function (nested) | 60–90 sec | Work inside-out; track each step |
| Domain/Range | 45–60 sec | Apply the 5 restrictions; test boundary values |
| Graph identification | 60–90 sec | Test 3–4 key points; check symmetry |
| Even/Odd | 30–45 sec | Compute $f(-x)$ and compare |
| Max/Min | 60–90 sec | Identify method (quadratic, AM-GM, or min/max rule) |
| Composite/Inverse | 45–60 sec | Substitute carefully; check domain restrictions |

### Order of Attack

1. **Scan all questions** — identify user-defined function questions first (easiest).
2. **Solve user-defined functions** with direct substitution.
3. **Solve domain/range questions** using the 5 restrictions.
4. **Solve even/odd questions** (quick computation).
5. **Attempt graph questions** using point-testing.
6. **Leave max/min and complex composite questions** for last if time is short.

### Speed Techniques

1. **Option substitution:** For functional equations, test options directly.
2. **Point testing for graphs:** Test $x = 0, 1, -1$ to eliminate options.
3. **Symmetry check:** Even functions are symmetric about y-axis; odd about origin.
4. **AM-GM shortcut:** For $a + b = k$, max of $ab = \frac{k^2}{4}$.
5. **For min/max of min/max:** Set the two expressions equal and solve.

---

## 16. Final Revision Sheet

### Domain Restrictions (5 Cases)

| Case | Condition |
|------|-----------|
| Even root of negative | $x \ge 0$ (for $\sqrt{x}$) |
| Denominator = 0 | Exclude roots of denominator |
| $0^0$ | Exclude values making base = 0 and exponent = 0 |
| Log argument ≤ 0 | Argument must be $> 0$ |
| Log base = 1, 0, or negative | Base must be $> 0$, $\neq 1$ |

### Range Methods

1. Solve for $x$ in terms of $y$; find excluded $y$
2. For continuous functions: $[l, m]$
3. Sketch graph

### Graph Transformations (Quick Reference)

| Transformation | Effect |
|----------------|--------|
| $f(x) + k$ | Up $k$ |
| $f(x) - k$ | Down $k$ |
| $f(x + k)$ | Left $k$ |
| $f(x - k)$ | Right $k$ |
| $-f(x)$ | Reflect in x-axis |
| $f(-x)$ | Reflect in y-axis |
| $|f(x)|$ | Flip below-x-axis portion up |
| $f(|x|)$ | Mirror right portion to left |

### Even/Odd Quick Test

- Even: $f(-x) = f(x)$ → symmetric about y-axis
- Odd: $f(-x) = -f(x)$ → symmetric about origin

### Function Classification

| Type | Condition |
|------|-----------|
| One-one (injective) | Horizontal line test: at most 1 intersection |
| Onto (surjective) | Range = Codomain |
| Bijective | Both one-one and onto |
| Inverse exists | Only for bijective functions |

### Max/Min Formulas

| Situation | Formula |
|-----------|---------|
| Quadratic $ax^2 + bx + c$ | Min/Max $= \frac{-(b^2-4ac)}{4a}$ |
| $a + b = k$ | Max of $ab = \frac{k^2}{4}$ |
| $a + b + c = k$ | Max of $abc = \frac{k^3}{27}$ |
| $ab = k$ | Min of $a + b = 2\sqrt{k}$ |
| Max of $\min(x, y)$ | Set $x = y$ |
| Min of $\max(x, y)$ | Set $x = y$ |

### Key Identities

$$x^2 + \frac{1}{x^2} = \left(x + \frac{1}{x}\right)^2 - 2$$

$$f(x) = \frac{1}{2}[f(x) + f(-x)] + \frac{1}{2}[f(x) - f(-x)]$$

$$f^2(x) = x \text{ for } f(x) = \frac{1}{x}$$

---

*End of Chapter 17 Study Notes.*
