---
title: "CAT Quant — Elements of Algebra"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 13
topic: "algebra"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Chapter 13: Elements of Algebra

## 1. Concept Map

```text
ELEMENTS OF ALGEBRA
│
├── 1. FUNDAMENTALS
│   ├── Constants vs. Variables
│   ├── Algebraic Expressions (Monomial, Binomial, Polynomial)
│   ├── Degree of a Polynomial
│   └── Operations (Addition, Subtraction, Multiplication, Division)
│
├── 2. THEOREMS
│   ├── Remainder Theorem
│   └── Factor Theorem
│
├── 3. HCF & LCM OF POLYNOMIALS
│   └── P(x) × Q(x) = HCF × LCM
│
├── 4. RATIONAL EXPRESSIONS
│   └── Simplification & Restrictions
│
├── 5. KEY IDENTITIES & FORMULAE
│   ├── Square & Cube Identities
│   ├── Sum/Difference of Powers
│   ├── Cyclic & Symmetric Expressions
│   └── x ± 1/x Relationships
│
├── 6. LINEAR EQUATIONS
│   ├── Single Variable
│   ├── Simultaneous (Two Variables)
│   │   ├── Consistent (Unique/Infinite)
│   │   └── Inconsistent (No Solution)
│   └── Methods: Substitution, Elimination, Cross-Multiplication
│
└── 7. INEQUALITIES & EXTREMA
    └── AM-GM Inequality Applications
```

---

## 2. Foundations: The Language of Algebra

### 2.1 Basic Terminology

- **Literal:** A letter (e.g., $x$, $y$, $a$) representing a generalized or unknown number.
- **Constant:** A symbol with a fixed value (e.g., $4$, $-7$, $\frac{1}{2}$).
- **Variable:** A symbol that can take various numerical values.
- **Critical Insight:** A combination of a constant and a variable is **itself a variable**. For example, $5x$, $5 + x$, and $\frac{x}{5}$ are all variables.

### 2.2 Algebraic Expressions

An **algebraic expression** is a collection of constants and literals connected by arithmetic operations.

- **Term:** Parts of an expression separated by $+$ or $-$ signs.
  - **Trap:** Multiplication and division do **not** separate terms. In $7x$ and $\frac{x}{7}$, each is a single term.
- **Types:**
  - **Monomial:** One term (e.g., $3x$, $12xy^2$).
  - **Binomial:** Two terms (e.g., $3x + 4y$).
  - **Polynomial/Multinomial:** Two or more terms.

### 2.3 Polynomials

A **polynomial** is an algebraic expression of the form:
$$a_0x^n + a_1x^{n-1} + \dots + a_n$$
where $a_0 \neq 0$ and the powers of the variable are **non-negative integers**.

- **Degree:** The greatest power of the variable present.
- **For multiple variables:** The degree is the greatest sum of powers of variables in any single term.
- **Restrictions:** No term can have a variable in the denominator (e.g., $\frac{1}{x}$) or a fractional/negative exponent (e.g., $\sqrt{x}$, $x^{-2}$).

**Example:** Identify which are polynomials:
- $x^2 - \sqrt{3}x + 4$ → **Polynomial** (degree 2).
- $x^3 - 3x^2 + 4\sqrt{x}$ → **Not a polynomial** (fractional power $\frac{1}{2}$).
- $x^3 - 2x + x^{-2}$ → **Not a polynomial** (negative power).

---

## 3. Core Theorems

### 3.1 Remainder Theorem

**Statement:** If a polynomial $f(x)$ is divided by $(x - a)$, the remainder is $f(a)$.

**Method:** Set the divisor to zero, solve for $x$, and substitute that value into the polynomial.

**Corollaries:**
- Divided by $(x + a)$ → remainder is $f(-a)$.
- Divided by $(ax + b)$ → remainder is $f\left(-\frac{b}{a}\right)$.

**Worked Example (Easy):**
Find the remainder when $x^2 - 6x + 5$ is divided by $(x + 2)$.
- Set $x + 2 = 0 \Rightarrow x = -2$.
- $f(-2) = (-2)^2 - 6(-2) + 5 = 4 + 12 + 5 = 21$.
- **Remainder = 21.**

**Worked Example (Moderate):**
When $x^3 + 3x^2 - kx + 4$ is divided by $x - 2$, the remainder is $k$. Find $k$.
- Set $x - 2 = 0 \Rightarrow x = 2$.
- $f(2) = (2)^3 + 3(2)^2 - k(2) + 4 = 8 + 12 - 2k + 4 = 24 - 2k$.
- Given remainder = $k$, so $24 - 2k = k \Rightarrow 3k = 24 \Rightarrow k = 8$.

**Advanced Application (Trap):**
Find the remainder when $f(x) = x^3 + 5x^2 + 10k$ is divided by $x^2 + 2$.
- Set $x^2 + 2 = 0 \Rightarrow x^2 = -2$.
- $f(x) = x \cdot x^2 + 5x^2 + 10k = x(-2) + 5(-2) + 10k = -2x - 10 + 10k$.
- The remainder is of the form $ax + b$. If the remainder is given as $-2x$, then $-10 + 10k = 0 \Rightarrow k = 1$.

### 3.2 Factor Theorem

**Statement:** If $f(a) = 0$, then $(x - a)$ is a factor of $f(x)$.

**Corollaries:**
- If $f(-a) = 0$, then $(x + a)$ is a factor.
- If $f\left(-\frac{b}{a}\right) = 0$, then $(ax + b)$ is a factor.

**Worked Example:**
If $(x-3)$ and $(x+4)$ are the only factors of $f(x)$, find $f(x)$.
- $f(x) = (x-3)(x+4) = x^2 + x - 12$.

---

## 4. HCF and LCM of Polynomials

- **HCF (GCD):** The polynomial of highest degree that divides all given polynomials.
- **LCM:** The polynomial of smallest degree that is divisible by all given polynomials.

**Key Formula:**
$$P(x) \times Q(x) = [\text{HCF of } P(x) \text{ and } Q(x)] \times [\text{LCM of } P(x) \text{ and } Q(x)]$$

**Method:** Always **factorize completely** first.

**Worked Example (Easy):**
Find HCF and LCM of $(x+2)^2(x-3)^2(x+1)^2$ and $(x+1)^3(x+2)^3(x-3)$.
- **HCF:** Take the lowest power of each common factor: $(x+1)^2(x+2)^2(x-3)$.
- **LCM:** Take the highest power of each factor present: $(x+1)^3(x+2)^3(x-3)^2$.

**Worked Example (Moderate):**
HCF is $(x-2)(x+3)$, LCM is $(x-2)^2(x+3)(x+1)$. One polynomial is $x^2 - x - 2$. Find the other.
- Factorize $P(x) = x^2 - x - 2 = (x-2)(x+1)$.
- Using the formula: $Q(x) = \frac{\text{HCF} \times \text{LCM}}{P(x)} = \frac{(x-2)(x+3) \times (x-2)^2(x+3)(x+1)}{(x-2)(x+1)}$.
- $Q(x) = (x-2)^2(x+3)^2$.

---

## 5. Rational Expressions

A **rational expression** is a quotient $\frac{P(x)}{Q(x)}$ where $Q(x) \neq 0$. It is in **simplest form** when the GCD of the numerator and denominator is 1.

**Worked Example:**
Simplify $\frac{x^2 + 6x + 9}{x^2 - 9}$.
- Factorize: $\frac{(x+3)(x+3)}{(x+3)(x-3)}$.
- Cancel common factor: $\frac{x+3}{x-3}$.

---

## 6. The Master Formula Sheet

These identities are the **workhorses** of the CAT algebra section. Memorize them cold.

### 6.1 Squares and Cubes

1. $(a + b)^2 = a^2 + b^2 + 2ab$
2. $(a - b)^2 = a^2 + b^2 - 2ab$
3. $(a + b)^2 = (a - b)^2 + 4ab$
4. $(a - b)^2 = (a + b)^2 - 4ab$
5. $a^2 + b^2 = \frac{1}{2}[(a + b)^2 + (a - b)^2]$
6. $a^2 - b^2 = (a + b)(a - b)$
7. $(a + b)^3 = a^3 + b^3 + 3ab(a + b)$
8. $(a - b)^3 = a^3 - b^3 - 3ab(a - b)$
9. $a^3 + b^3 = (a + b)(a^2 + b^2 - ab)$
10. $a^3 - b^3 = (a - b)(a^2 + b^2 + ab)$

### 6.2 Three-Variable Identities

11. $(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ac)$
12. $a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ac)$
    - **Special Case:** If $a + b + c = 0$, then $a^3 + b^3 + c^3 = 3abc$.

### 6.3 Higher Powers

13. $a^4 + b^4 + a^2b^2 = (a^2 + b^2 + ab)(a^2 + b^2 - ab)$
14. $a^4 - b^4 = (a - b)(a + b)(a^2 + b^2)$
15. $a^8 - b^8 = (a - b)(a + b)(a^2 + b^2)(a^4 + b^4)$

### 6.4 Cyclic Expressions ($\Sigma$ Notation)

- $\Sigma x = x + y + z$
- $\Sigma xy = xy + yz + zx$
- $\Sigma x^2(y - z) = x^2(y - z) + y^2(z - x) + z^2(x - y)$

**Important Results:**
- $\Sigma (x - y) = 0$
- $\Sigma x^2(y - z) = -(x - y)(y - z)(z - x)$
- $\Sigma x(y^2 - z^2) = (x - y)(y - z)(z - x)$
- $\Sigma (x - y)^3 = 3(x - y)(y - z)(z - x)$

### 6.5 The $x \pm \frac{1}{x}$ Family

These are extremely common in CAT. Derive them from the square identities.

- $\left(x + \frac{1}{x}\right)^2 = x^2 + \frac{1}{x^2} + 2$
- $\left(x - \frac{1}{x}\right)^2 = x^2 + \frac{1}{x^2} - 2$
- $\left(x + \frac{1}{x}\right)^3 = x^3 + \frac{1}{x^3} + 3\left(x + \frac{1}{x}\right)$
- $\left(x - \frac{1}{x}\right)^3 = x^3 - \frac{1}{x^3} - 3\left(x - \frac{1}{x}\right)$

---

## 7. Fast CAT Methods & Decision Rules

### 7.1 Option Verification

For many algebra problems, especially those with abstract expressions, **substituting answer options** is the fastest and safest method.

**Example:** Factorize $x^3 - 7x + 6$.
- Instead of factoring, test options.
- Option (a): $(x - 1)(x + 3)(x - 2) = (x^2 + 2x - 3)(x - 2) = x^3 - 7x + 6$. ✓

### 7.2 Substitution of Test Values

For cyclic expressions or complex factorizations, substitute simple values (e.g., $x=1, y=2, z=3$) and match with options.

### 7.3 The Allocation Method (Word Problems)

This is a powerful alternative to algebra for "counting" problems (animals, vehicles, coins).

**Steps:**
1. Assume all items are of the type with the smaller "count" (e.g., 2 legs, 2 wheels).
2. Calculate the total count based on this assumption.
3. Find the difference between this assumed total and the actual total.
4. Divide the difference by the per-item difference to find the number of the other type.

**Worked Example (Deer and Ducks):**
A zoo has 14 animals (deer and ducks) with 38 legs total. How many deer?
- Step 1: Assume all are ducks: $2 \times 14 = 28$ legs.
- Step 2: Difference: $38 - 28 = 10$ legs.
- Step 3: Each deer has 2 more legs than a duck: $10 \div 2 = 5$ deer.
- **Answer: 5 deer.**

### 7.4 AM-GM Inequality for Extrema

For positive numbers, the Arithmetic Mean is always greater than or equal to the Geometric Mean:
$$\frac{a_1 + a_2 + \dots + a_n}{n} \ge (a_1a_2 \dots a_n)^{1/n}$$

**Decision Rules:**
- **Maximum Product:** If the sum of variables is constant, the product is maximized when all variables are equal.
- **Minimum Sum:** If the product of variables is constant, the sum is minimized when all variables are equal.

**Worked Example:**
Find the maximum value of $(a-3)(b-2)(c+1)$ given $a+b+c=13$.
- Let $x = a-3$, $y = b-2$, $z = c+1$.
- Then $x + y + z = (a+b+c) - 3 - 2 + 1 = 13 - 4 = 9$.
- For maximum product, $x = y = z = 3$.
- Maximum value $= 3 \times 3 \times 3 = 27$.

---

## 8. Worked Examples: Easy to Advanced

### Example 1 (Easy): Substitution
If $x = -3$, find $4x^2 - 5x + 3$.
- $4(-3)^2 - 5(-3) + 3 = 4(9) + 15 + 3 = 36 + 18 = 54$.

### Example 2 (Easy): Completing the Square
If $9x^2 + \frac{4}{x^2} - 12 = 25$, find $9x^2 - \frac{4}{x^2}$.
- From the given: $9x^2 + \frac{4}{x^2} = 37$.
- Note that $(3x - \frac{2}{x})^2 = 9x^2 + \frac{4}{x^2} - 12 = 25 \Rightarrow 3x - \frac{2}{x} = 5$.
- Also, $(3x + \frac{2}{x})^2 = 9x^2 + \frac{4}{x^2} + 12 = 37 + 12 = 49 \Rightarrow 3x + \frac{2}{x} = 7$.
- Therefore, $9x^2 - \frac{4}{x^2} = (3x - \frac{2}{x})(3x + \frac{2}{x}) = 5 \times 7 = 35$.

### Example 3 (Moderate): Reciprocal Cube
If $m^2 - 4m + 1 = 0$, find $m^3 + \frac{1}{m^3}$.
- Divide by $m$: $m - 4 + \frac{1}{m} = 0 \Rightarrow m + \frac{1}{m} = 4$.
- Cube both sides: $(m + \frac{1}{m})^3 = m^3 + \frac{1}{m^3} + 3(m + \frac{1}{m}) = 64$.
- $m^3 + \frac{1}{m^3} = 64 - 3(4) = 52$.

### Example 4 (Moderate): Zero-Sum Identity
If $a^{1/3} + b^{1/3} + c^{1/3} = 0$, find $(a + b + c)^3$.
- Let $x = a^{1/3}$, $y = b^{1/3}$, $z = c^{1/3}$. Then $x + y + z = 0$.
- By the special case identity, $x^3 + y^3 + z^3 = 3xyz$.
- So, $a + b + c = 3a^{1/3}b^{1/3}c^{1/3}$.
- Cubing both sides: $(a + b + c)^3 = 27abc$.

### Example 5 (Advanced): Cyclic Factorization
Factorize $x(y^2 - z^2) + y(z^2 - x^2) + z(x^2 - y^2)$.
- This is a cyclic expression. We know $\Sigma x(y^2 - z^2) = (x - y)(y - z)(z - x)$.
- **Answer:** $(x - y)(y - z)(z - x)$.

### Example 6 (Advanced): Telescoping Sum
Simplify $\frac{1}{1-x} + \frac{1}{1+x} + \frac{2}{1+x^2} + \frac{4}{1+x^4}$.
- Combine the first two: $\frac{(1+x) + (1-x)}{(1-x)(1+x)} = \frac{2}{1-x^2}$.
- Combine with the third: $\frac{2}{1-x^2} + \frac{2}{1+x^2} = \frac{2(1+x^2) + 2(1-x^2)}{(1-x^2)(1+x^2)} = \frac{4}{1-x^4}$.
- Combine with the fourth: $\frac{4}{1-x^4} + \frac{4}{1+x^4} = \frac{8}{1-x^8}$.
- **Answer:** $\frac{8}{1-x^8}$.

---

## 9. Simultaneous Linear Equations

### 9.1 Standard Form
$$a_1x + b_1y = c_1$$
$$a_2x + b_2y = c_2$$

### 9.2 Nature of Solutions

Compare the ratios of coefficients:

| Condition | Nature of Solution | Graph |
| :--- | :--- | :--- |
| $\frac{a_1}{a_2} \neq \frac{b_1}{b_2}$ | **Unique solution** (Consistent) | Intersecting lines |
| $\frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}$ | **Infinite solutions** (Dependent) | Coincident lines |
| $\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$ | **No solution** (Inconsistent) | Parallel lines |

### 9.3 Cross-Multiplication Formula

$$\frac{x}{b_1c_2 - b_2c_1} = \frac{y}{c_1a_2 - c_2a_1} = \frac{-1}{a_1b_2 - a_2b_1}$$

### 9.4 Worked Example (Moderate)
Solve $\frac{2}{x} + \frac{3}{y} = 2$ and $\frac{8}{x} - \frac{6}{y} = 2$.
- **Trap:** Do not solve for $x$ and $y$ directly. Substitute $A = \frac{1}{x}$ and $B = \frac{1}{y}$.
- Equations become: $2A + 3B = 2$ and $8A - 6B = 2$.
- Multiply the first by 2: $4A + 6B = 4$. Add to the second: $12A = 6 \Rightarrow A = \frac{1}{2}$.
- Substitute $A = \frac{1}{2}$ into $2A + 3B = 2$: $1 + 3B = 2 \Rightarrow B = \frac{1}{3}$.
- Therefore, $x = \frac{1}{A} = 2$ and $y = \frac{1}{B} = 3$.

---

## 10. Common Traps & How to Avoid Them

1.  **Term Separation:** Division does not separate terms. In $x + \frac{y}{z}$, there are two terms, not three.
2.  **Remainder Theorem Sign:** For divisor $(x + a)$, substitute $x = -a$, not $x = a$.
3.  **Degree of Multi-variable Polynomial:** Sum the powers of **all** variables in each term, then take the maximum.
4.  **HCF/LCM:** Always factorize polynomials completely before finding HCF or LCM.
5.  **Zero-Sum Identity:** The identity $a^3 + b^3 + c^3 = 3abc$ holds **only** when $a + b + c = 0$.
6.  **Non-Real Factors:** $x^4 + 16$ has **no real factors**. Do not try to factorize it over real numbers.
7.  **$x + \frac{1}{x}$ Range:** For $x > 0$, $x + \frac{1}{x} \ge 2$. For $x < 0$, $x + \frac{1}{x} \le -2$.
8.  **Word Problems:** Define variables clearly and translate conditions into equations carefully. Use the allocation method for speed.

---

## 11. Timed Strategy (15-20 minutes for Algebra)

- **0-2 minutes:** Scan all algebra questions. Identify the "formula-based" ones (identities, $x \pm 1/x$) and solve them immediately.
- **2-8 minutes:** Attempt moderate-difficulty questions: Remainder/Factor theorem, HCF/LCM, and simple simultaneous equations.
- **8-15 minutes:** Tackle word problems and advanced factorization. Use option verification and substitution methods to save time.
- **15-20 minutes:** For any remaining questions, use elimination and educated guessing. If a question involves heavy calculation, it's likely a trap—look for a shortcut or skip it.

---

## 12. Final Revision Sheet

| Concept | Key Formula / Rule |
| :--- | :--- |
| **Remainder Theorem** | $f(x) \div (x-a) \Rightarrow \text{Remainder} = f(a)$ |
| **Factor Theorem** | $f(a) = 0 \Rightarrow (x-a)$ is a factor |
| **HCF × LCM** | $P(x) \times Q(x) = \text{HCF} \times \text{LCM}$ |
| **Square Identities** | $(a \pm b)^2 = a^2 + b^2 \pm 2ab$ |
| **Cube Identities** | $(a \pm b)^3 = a^3 \pm b^3 \pm 3ab(a \pm b)$ |
| **Sum/Diff of Cubes** | $a^3 \pm b^3 = (a \pm b)(a^2 + b^2 \mp ab)$ |
| **Three-Variable Identity** | $a^3 + b^3 + c^3 - 3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ |
| **Zero-Sum Corollary** | If $a+b+c=0$, then $a^3+b^3+c^3 = 3abc$ |
| **Reciprocal Sum** | $x^2 + \frac{1}{x^2} = (x + \frac{1}{x})^2 - 2$ |
| **Reciprocal Cube** | $x^3 + \frac{1}{x^3} = (x + \frac{1}{x})^3 - 3(x + \frac{1}{x})$ |
| **Unique Solution** | $\frac{a_1}{a_2} \neq \frac{b_1}{b_2}$ |
| **No Solution** | $\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$ |
| **Infinite Solutions** | $\frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}$ |
| **AM-GM Inequality** | $\frac{\sum a_i}{n} \ge (\prod a_i)^{1/n}$ for positive $a_i$ |
