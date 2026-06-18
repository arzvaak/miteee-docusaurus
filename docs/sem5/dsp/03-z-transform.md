# Week 3 — Z-Transform

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. Definition & Key Pair

$$\boxed{X(z) = \sum_{n=-\infty}^{\infty}x[n]\,z^{-n}}$$

- $\delta[n-k] \to z^{-k}$ (positive $k$ = right-shift = delay)
- $\delta[n+k] \to z^{+k}$ (negative $k$ = left-shift = advance)

**The single most important pair:**

$$a^n u[n] \;\longleftrightarrow\; \frac{z}{z-a} = \frac{1}{1-az^{-1}}, \quad \text{ROC: }|z|>|a|$$

---

## 2. Common Z-Transform Pairs

| Signal $x[n]$ | $X(z)$ | ROC |
|--------------|--------|-----|
| $\delta[n]$ | $1$ | All $z$ |
| $\delta[n-k]$ | $z^{-k}$ | All $z\neq0$ |
| $u[n]$ | $\dfrac{z}{z-1}=\dfrac{1}{1-z^{-1}}$ | $|z|>1$ |
| $a^n u[n]$ | $\dfrac{z}{z-a}=\dfrac{1}{1-az^{-1}}$ | $|z|>|a|$ |
| $-a^n u[-n-1]$ | $\dfrac{z}{z-a}$ | $|z|<|a|$ |
| $na^n u[n]$ | $\dfrac{az^{-1}}{(1-az^{-1})^2}$ | $|z|>|a|$ |

---

## 3. Region of Convergence (ROC)

| Signal type | ROC |
|-------------|-----|
| Finite causal ($n\geq0$) | Entire z-plane except $z=0$ |
| Finite **anti-causal** ($n\leq0$) | Entire z-plane except $z=\infty$ |
| Finite two-sided | Entire z-plane except $z=0$ and $z=\infty$ |
| Right-sided (causal infinite) | $|z|>r$ (exterior of circle) |
| Left-sided (anti-causal infinite) | $|z|<r$ (interior of circle) |
| Two-sided infinite | Annular $r_1<|z|<r_2$ |

> **Recall trap:** Anti-causal finite ROC excludes $z=\infty$, NOT $z=0$. The exam loves swapping these.

> **Recall trap:** For a **stable** system the ROC must include the unit circle $|z|=1$. For a **causal** system the ROC is the exterior of the outermost pole.

---

## 4. Z-Transform Properties

| Property | Time domain | Z-domain |
|----------|-------------|----------|
| Linearity | $ax_1[n]+bx_2[n]$ | $aX_1(z)+bX_2(z)$ |
| Time delay | $x[n-k]$ | $z^{-k}X(z)$ |
| Time advance | $x[n+k]$ | $z^{k}X(z)$ |
| Time reversal | $x[-n]$ | $X(z^{-1})$, ROC inverts |
| Z-scaling | $a^n x[n]$ | $X(z/a)$ |
| **Convolution** | $x_1[n]*x_2[n]$ | $X_1(z)\cdot X_2(z)$ |
| Multiply by $n$ | $nx[n]$ | $-z\,\dfrac{d}{dz}X(z)$ |

> **Recall trap:** $Y(z)=X(-z)$ means $y[n]=(-1)^n x[n]$, NOT $y[n]=x[-n]$.

---

## 5. Initial Value Theorem

$$\boxed{x[0] = \lim_{z\to\infty}X(z)}$$

**Example:** $X(z)=1+3z^{-1}-2z^{-3}$

$$x[0]=\lim_{z\to\infty}(1+3z^{-1}-2z^{-3})=1$$ ✅

---

## 6. Computing Z-Transforms — Examples

**Example Q1:** $x[n]=2\delta[n+1]+4\delta[n]+3\delta[n-1]-3\delta[n-3]$

$$X(z)=2z+4+3z^{-1}-3z^{-3}$$ ✅

**Example Q2:** $x[n]=0.5^{n-5}u[n-5]$

**Step 1:** Let $m=n-5$: $x[n]=0.5^m u[m]|_{m=n-5}$

**Step 2:** Z-transform of $0.5^m u[m]$ is $\dfrac{1}{1-0.5z^{-1}}$; time-delay by 5 multiplies by $z^{-5}$

$$X(z)=\frac{z^{-5}}{1-0.5z^{-1}}=\frac{z^{-4}}{z-0.5}$$ ✅

---

## 7. Inverse Z-Transform — Partial Fractions

**Example Q5:** $X(z)=\dfrac{z^{-4}}{z-1}+z^{-6}+\dfrac{z^{-3}}{z+0.5}$

**Term 1:** $\dfrac{z^{-4}}{z-1}=\dfrac{z^{-5}}{1-z^{-1}} \;\to\; u[n-5]$

**Term 2:** $z^{-6} \;\to\; \delta[n-6]$

**Term 3:** $\dfrac{z^{-3}}{z+0.5}=\dfrac{z^{-4}}{1-(-0.5)z^{-1}} \;\to\; (-0.5)^{n-4}u[n-4]$

$$x[n]=u[n-5]+\delta[n-6]+(-0.5)^{n-4}u[n-4]$$ ✅

---

## 8. Convolution via Z-Domain

**Example Q3:** $x[n]=\delta[n]+3\delta[n-1]-2\delta[n-3]$, $y[n]=4\delta[n]+\delta[n-1]$

$$X(z)=1+3z^{-1}-2z^{-3}, \quad Y(z)=4+z^{-1}$$

$$\text{Convolution in time} = X(z)\cdot Y(z) = (1+3z^{-1}-2z^{-3})(4+z^{-1})$$ ✅

---

## 9. Inverse System

**System:** $y[n]=2x[n]+3x[n-1]-2y[n-2]$

$$H(z)=\frac{2+3z^{-1}}{1+2z^{-2}} \implies H_{\text{inv}}(z)=\frac{1+2z^{-2}}{2+3z^{-1}}$$

In time domain: $y[n]=\tfrac{1}{2}[x[n]+2x[n-2]-3y[n-1]]$ ✅

---

## 10. Key MCQs

| Question | Answer |
|---------|--------|
| Z-transform of $2\delta[n+1]+4\delta[n]+3\delta[n-1]-3\delta[n-3]$ | $4+2z+3z^{-1}-3z^{-3}$ ✅ |
| Z-transform of $0.5^{n-5}u[n-5]$ | $z^{-4}/(z-0.5)$ ✅ |
| Convolution in time ↔ Z-domain | Multiplication ✅ |
| Initial value of $1+3z^{-1}-2z^{-3}$ | 1 ✅ |
| Inverse of $z^{-4}/(z-1)+z^{-6}+z^{-3}/(z+0.5)$ | $u[n-5]+\delta[n-6]+(-0.5)^{n-4}u[n-4]$ ✅ |
| $Y(z)=X(-z)$, what is $y[n]$? | $(-1)^n x[n]$ ✅ |
| ROC of finite anti-causal signal | Entire z-plane except $z=\infty$ ✅ |

---

## Formula Sheet — Week 3

$$X(z)=\sum_{n}x[n]z^{-n} \qquad x[0]=\lim_{z\to\infty}X(z)$$

$$a^n u[n]\leftrightarrow\frac{z}{z-a},\;|z|>|a| \qquad \text{Convolution}\leftrightarrow\text{Multiplication}$$

$$x[n-k]\leftrightarrow z^{-k}X(z) \qquad nx[n]\leftrightarrow -z\frac{d}{dz}X(z)$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

### Problem 1
**Q:** Find the $z$-transform and the region of convergence (ROC) of the sequence $x(n) = (0.5)^n u(n) + 2^n u(-n-1)$.

**A:**
1. **Decompose the sequence:**
   The given sequence is a sum of two sequences:
   $$
   x(n) = x_1(n) + x_2(n), \quad \text{where} \quad x_1(n) = (0.5)^n u(n), \quad x_2(n) = 2^n u(-n-1).
   $$

2. **Find the $z$-transform of $x_1(n)$:**
   From the standard $z$-transform pair, we know:
   $$
   (a)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - a z^{-1}}, \quad \text{ROC: } |z| > |a|.
   $$
   For $x_1(n) = (0.5)^n u(n)$:
   $$
   X_1(z) = \frac{1}{1 - 0.5 z^{-1}}, \quad \text{ROC: } |z| > 0.5.
   $$

3. **Find the $z$-transform of $x_2(n)$:**
   From the standard $z$-transform pair for left-sided sequences:
   $$
   -a^n u(-n-1) \xleftrightarrow{Z} \frac{1}{1 - a z^{-1}}, \quad \text{ROC: } |z| < |a|.
   $$
   For $x_2(n) = 2^n u(-n-1)$, rewrite it as:
   $$
   x_2(n) = -(-2^n) u(-n-1).
   $$
   Thus:
   $$
   X_2(z) = -\left(\frac{1}{1 - (-2) z^{-1}}\right) = \frac{1}{1 - 2 z^{-1}}, \quad \text{ROC: } |z| < 2.
   $$

4. **Combine the $z$-transforms:**
   The $z$-transform of $x(n)$ is:
   $$
   X(z) = X_1(z) + X_2(z) = \frac{1}{1 - 0.5 z^{-1}} + \frac{1}{1 - 2 z^{-1}}.
   $$
   Combine the fractions:
   $$
   X(z) = \frac{(1 - 2 z^{-1}) + (1 - 0.5 z^{-1})}{(1 - 0.5 z^{-1})(1 - 2 z^{-1})} = \frac{2 - 2.5 z^{-1}}{1 - 2.5 z^{-1} + z^{-2}}.
   $$

5. **Determine the ROC:**
   The ROC of $X(z)$ is the intersection of the ROCs of $X_1(z)$ and $X_2(z)$:
   $$
   0.5 < |z| < 2.
   $$

---

### Problem 2
**Q:** Find the inverse $z$-transform of $X(z) = \frac{1}{1 - 1.5 z^{-1} + 0.5 z^{-2}}$ with ROC $|z| > 1$.

**A:**
1. **Factor the denominator:**
   The denominator is:
   $$
   1 - 1.5 z^{-1} + 0.5 z^{-2} = (1 - z^{-1})(1 - 0.5 z^{-1}).
   $$
   Thus:
   $$
   X(z) = \frac{1}{(1 - z^{-1})(1 - 0.5 z^{-1})}.
   $$

2. **Partial fraction expansion:**
   Express $X(z)$ as:
   $$
   X(z) = \frac{A}{1 - z^{-1}} + \frac{B}{1 - 0.5 z^{-1}}.
   $$
   Solve for $A$ and $B$:
   $$
   1 = A(1 - 0.5 z^{-1}) + B(1 - z^{-1}).
   $$
   Let $z^{-1} = 1$:
   $$
   1 = A(0.5) + B(0) \implies A = 2.
   $$
   Let $z^{-1} = 2$:
   $$
   1 = A(0) + B(-1) \implies B = -1.
   $$
   Thus:
   $$
   X(z) = \frac{2}{1 - z^{-1}} - \frac{1}{1 - 0.5 z^{-1}}.
   $$

3. **Inverse $z$-transform:**
   Using the standard $z$-transform pairs:
   $$
   \frac{1}{1 - a z^{-1}} \xleftrightarrow{Z} a^n u(n), \quad \text{ROC: } |z| > |a|.
   $$
   Thus:
   $$
   x(n) = 2 \cdot (1)^n u(n) - (0.5)^n u(n) = 2 u(n) - (0.5)^n u(n).
   $$

---

### Problem 3
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = n (0.8)^n u(n)$.

**A:**
1. **Use the derivative property:**
   From the standard $z$-transform pair:
   $$
   (0.8)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.8 z^{-1}}, \quad \text{ROC: } |z| > 0.8.
   $$
   The derivative property states:
   $$
   n x(n) \xleftrightarrow{Z} -z \frac{dX(z)}{dz}.
   $$
   Compute the derivative of $X(z) = \frac{1}{1 - 0.8 z^{-1}}$:
   $$
   \frac{dX(z)}{dz} = \frac{0.8 z^{-2}}{(1 - 0.8 z^{-1})^2}.
   $$
   Thus:
   $$
   -z \frac{dX(z)}{dz} = -z \cdot \frac{0.8 z^{-2}}{(1 - 0.8 z^{-1})^2} = \frac{-0.8 z^{-1}}{(1 - 0.8 z^{-1})^2}.
   $$

2. **Final $z$-transform:**
   $$
   X(z) = \frac{0.8 z^{-1}}{(1 - 0.8 z^{-1})^2}, \quad \text{ROC: } |z| > 0.8.
   $$

---

### Problem 4 (Practice)
**Q:** Find the $z$-transform and ROC of the sequence $x(n) = (0.3)^n u(n) + (0.7)^n u(n-2)$.

**A:**
1. **Decompose the sequence:**
   $$
   x(n) = (0.3)^n u(n) + (0.7)^n u(n-2).
   $$

2. **$z$-transform of the first term:**
   $$
   (0.3)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.3 z^{-1}}, \quad \text{ROC: } |z| > 0.3.
   $$

3. **$z$-transform of the second term:**
   Use the time-shift property:
   $$
   (0.7)^n u(n-2) = (0.7)^2 (0.7)^{n-2} u(n-2) \xleftrightarrow{Z} (0.7)^2 \cdot \frac{z^{-2}}{1 - 0.7 z^{-1}}, \quad \text{ROC: } |z| > 0.7.
   $$

4. **Combine the $z$-transforms:**
   $$
   X(z) = \frac{1}{1 - 0.3 z^{-1}} + \frac{0.49 z^{-2}}{1 - 0.7 z^{-1}}.
   $$
   The ROC is the intersection of the individual ROCs:
   $$
   |z| > 0.7.
   $$

---

### Problem 5
**Q:** Find the inverse $z$-transform of $X(z) = \frac{z^{-1}}{1 - 1.2 z^{-1} + 0.32 z^{-2}}$ with ROC $|z| > 0.8$.

**A:**
1. **Factor the denominator:**
   $$
   1 - 1.2 z^{-1} + 0.32 z^{-2} = (1 - 0.8 z^{-1})(1 - 0.4 z^{-1}).
   $$
   Thus:
   $$
   X(z) = \frac{z^{-1}}{(1 - 0.8 z^{-1})(1 - 0.4 z^{-1})}.
   $$

2. **Partial fraction expansion:**
   Express $X(z)$ as:
   $$
   X(z) = \frac{A}{1 - 0.8 z^{-1}} + \frac{B}{1 - 0.4 z^{-1}}.
   $$
   Solve for $A$ and $B$:
   $$
   z^{-1} = A(1 - 0.4 z^{-1}) + B(1 - 0.8 z^{-1}).
   $$
   Let $z^{-1} = 1/0.8$:
   $$
   \frac{1}{0.8} = A(0.5) \implies A = 2.5.
   $$
   Let $z^{-1} = 1/0.4$:
   $$
   \frac{1}{0.4} = B(0.2) \implies B = -12.5.
   $$
   Thus:
   $$
   X(z) = \frac{2.5}{1 - 0.8 z^{-1}} - \frac{12.5}{1 - 0.4 z^{-1}}.
   $$

3. **Inverse $z$-transform:**
   $$
   x(n) = 2.5 (0.8)^n u(n) - 12.5 (0.4)^n u(n).
   $$

---

### Problem 6 (Practice)
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = \cos(\omega_0 n) u(n)$.

**A:**
1. **Express cosine in terms of exponentials:**
   $$
   \cos(\omega_0 n) = \frac{e^{j \omega_0 n} + e^{-j \omega_0 n}}{2}.
   $$

2. **$z$-transform of each term:**
   Using the standard $z$-transform pair:
   $$
   e^{j \omega_0 n} u(n) \xleftrightarrow{Z} \frac{1}{1 - e^{j \omega_0} z^{-1}}, \quad \text{ROC: } |z| > 1.
   $$
   Similarly:
   $$
   e^{-j \omega_0 n} u(n) \xleftrightarrow{Z} \frac{1}{1 - e^{-j \omega_0} z^{-1}}, \quad \text{ROC: } |z| > 1.
   $$

3. **Combine the $z$-transforms:**
   $$
   X(z) = \frac{1}{2} \left( \frac{1}{1 - e^{j \omega_0} z^{-1}} + \frac{1}{1 - e^{-j \omega_0} z^{-1}} \right).
   $$
   Simplify:
   $$
   X(z) = \frac{1 - (\cos \omega_0) z^{-1}}{1 - 2 (\cos \omega_0) z^{-1} + z^{-2}}, \quad \text{ROC: } |z| > 1.
   $$

---

### Problem 7
**Q:** Find the inverse $z$-transform of $X(z) = \frac{1 + z^{-1}}{1 - 0.5 z^{-1}}$ with ROC $|z| > 0.5$.

**A:**
1. **Rewrite $X(z)$:**
   $$
   X(z) = \frac{1}{1 - 0.5 z^{-1}} + \frac{z^{-1}}{1 - 0.5 z^{-1}}.
   $$

2. **Inverse $z$-transform of each term:**
   Using the standard $z$-transform pairs:
   $$
   \frac{1}{1 - 0.5 z^{-1}} \xleftrightarrow{Z} (0.5)^n u(n),
   $$
   $$
   \frac{z^{-1}}{1 - 0.5 z^{-1}} \xleftrightarrow{Z} (0.5)^{n-1} u(n-1).
   $$

3. **Combine the results:**
   $$
   x(n) = (0.5)^n u(n) + (0.5)^{n-1} u(n-1).
   $$

---

### Problem 8 (Practice)
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = n^2 (0.6)^n u(n)$.

**A:**
1. **Use the derivative property twice:**
   From the standard $z$-transform pair:
   $$
   (0.6)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.6 z^{-1}}, \quad \text{ROC: } |z| > 0.6.
   $$
   First derivative:
   $$
   n (0.6)^n u(n) \xleftrightarrow{Z} \frac{0.6 z^{-1}}{(1 - 0.6 z^{-1})^2}.
   $$
   Second derivative:
   $$
   n^2 (0.6)^n u(n) \xleftrightarrow{Z} -z \frac{d}{dz} \left( \frac{0.6 z^{-1}}{(1 - 0.6 z^{-1})^2} \right).
   $$
   Compute the derivative:
   $$
   \frac{d}{dz} \left( \frac{0.6 z^{-1}}{(1 - 0.6 z^{-1})^2} \right) = \frac{-0.6 z^{-2} (1 - 0.6 z^{-1})^2 - 0.6 z^{-1} \cdot 2 (1 - 0.6 z^{-1}) (-0.6 z^{-2})}{(1 - 0.6 z^{-1})^4}.
   $$
   Simplify:
   $$
   = \frac{-0.6 z^{-2} (1 - 0.6 z^{-1}) + 0.72 z^{-3}}{(1 - 0.6 z^{-1})^3} = \frac{-0.6 z^{-2} + 0.36 z^{-3} + 0.72 z^{-3}}{(1 - 0.6 z^{-1})^3} = \frac{-0.6 z^{-2} + 1.08 z^{-3}}{(1 - 0.6 z^{-1})^3}.
   $$
   Multiply by $-z$:
   $$
   X(z) = \frac{0.6 z^{-1} - 1.08 z^{-2}}{(1 - 0.6 z^{-1})^3}.
   $$

2. **Final $z$-transform:**
   $$
   X(z) = \frac{0.6 z^{-1} (1 - 1.8 z^{-1})}{(1 - 0.6 z^{-1})^3}, \quad \text{ROC: } |z| > 0.6.
   $$

---

### Problem 9
**Q:** Find the inverse $z$-transform of $X(z) = \frac{1}{1 - z^{-1} + 0.25 z^{-2}}$ with ROC $|z| > 0.5$.

**A:**
1. **Factor the denominator:**
   $$
   1 - z^{-1} + 0.25 z^{-2} = (1 - 0.5 z^{-1})^2.
   $$
   Thus:
   $$
   X(z) = \frac{1}{(1 - 0.5 z^{-1})^2}.
   $$

2. **Inverse $z$-transform:**
   From the standard $z$-transform pair:
   $$
   n a^n u(n) \xleftrightarrow{Z} \frac{a z^{-1}}{(1 - a z^{-1})^2}.
   $$
   Rewrite $X(z)$:
   $$
   X(z) = \frac{1}{0.5 z^{-1}} \cdot \frac{0.5 z^{-1}}{(1 - 0.5 z^{-1})^2} = \frac{2}{z^{-1}} \cdot \frac{0.5 z^{-1}}{(1 - 0.5 z^{-1})^2}.
   $$
   Thus:
   $$
   x(n) = 2 (n+1) (0.5)^n u(n).
   $$

---

### Problem 10 (Practice)
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = (0.4)^n u(n) + (0.4)^{-n} u(-n-1)$.

**A:**
1. **Decompose the sequence:**
   $$
   x(n) = (0.4)^n u(n) + (0.4)^{-n} u(-n-1).
   $$

2. **$z$-transform of the first term:**
   $$
   (0.4)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.4 z^{-1}}, \quad \text{ROC: } |z| > 0.4.
   $$

3. **$z$-transform of the second term:**
   Rewrite the second term:
   $$
   (0.4)^{-n} u(-n-1) = (2.5)^n u(-n-1).
   $$
   From the standard $z$-transform pair:
   $$
   -a^n u(-n-1) \xleftrightarrow{Z} \frac{1}{1 - a z^{-1}}, \quad \text{ROC: } |z| < |a|.
   $$
   Thus:
   $$
   (2.5)^n u(-n-1) \xleftrightarrow{Z} \frac{-1}{1 - 2.5 z^{-1}}, \quad \text{ROC: } |z| < 2.5.
   $$

4. **Combine the $z$-transforms:**
   $$
   X(z) = \frac{1}{1 - 0.4 z^{-1}} - \frac{1}{1 - 2.5 z^{-1}}.
   $$
   The ROC is the intersection of the individual ROCs:
   $$
   0.4 < |z| < 2.5.
   $$

---

### Problem 11
**Q:** Find the inverse $z$-transform of $X(z) = \frac{z^{-1}}{1 - 1.5 z^{-1} + 0.5 z^{-2}}$ with ROC $0.5 < |z| < 1$.

**A:**
1. **Factor the denominator:**
   $$
   1 - 1.5 z^{-1} + 0.5 z^{-2} = (1 - z^{-1})(1 - 0.5 z^{-1}).
   $$
   Thus:
   $$
   X(z) = \frac{z^{-1}}{(1 - z^{-1})(1 - 0.5 z^{-1})}.
   $$

2. **Partial fraction expansion:**
   Express $X(z)$ as:
   $$
   X(z) = \frac{A}{1 - z^{-1}} + \frac{B}{1 - 0.5 z^{-1}}.
   $$
   Solve for $A$ and $B$:
   $$
   z^{-1} = A(1 - 0.5 z^{-1}) + B(1 - z^{-1}).
   $$
   Let $z^{-1} = 1$:
   $$
   1 = A(0.5) \implies A = 2.
   $$
   Let $z^{-1} = 2$:
   $$
   2 = B(-1) \implies B = -2.
   $$
   Thus:
   $$
   X(z) = \frac{2}{1 - z^{-1}} - \frac{2}{1 - 0.5 z^{-1}}.
   $$

3. **Inverse $z$-transform:**
   The ROC $0.5 < |z| < 1$ implies:
   - The term $\frac{2}{1 - z^{-1}}$ corresponds to a left-sided sequence (ROC $|z| < 1$):
     $$
     \frac{2}{1 - z^{-1}} \xleftrightarrow{Z} -2 u(-n-1).
     $$
   - The term $\frac{-2}{1 - 0.5 z^{-1}}$ corresponds to a right-sided sequence (ROC $|z| > 0.5$):
     $$
     \frac{-2}{1 - 0.5 z^{-1}} \xleftrightarrow{Z} -2 (0.5)^n u(n).
     $$
   Thus:
   $$
   x(n) = -2 u(-n-1) - 2 (0.5)^n u(n).
   $$

---

### Problem 12 (Practice)
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = (0.2)^n u(n) * (0.5)^n u(n)$.

**A:**
1. **$z$-transform of each sequence:**
   $$
   (0.2)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.2 z^{-1}}, \quad \text{ROC: } |z| > 0.2.
   $$
   $$
   (0.5)^n u(n) \xleftrightarrow{Z} \frac{1}{1 - 0.5 z^{-1}}, \quad \text{ROC: } |z| > 0.5.
   $$

2. **Convolution theorem:**
   The $z$-transform of the convolution is the product of the $z$-transforms:
   $$
   X(z) = \frac{1}{(1 - 0.2 z^{-1})(1 - 0.5 z^{-1})}.
   $$
   The ROC is the intersection of the individual ROCs:
   $$
   |z| > 0.5.
   $$

---

### Problem 13
**Q:** Find the inverse $z$-transform of $X(z) = \frac{1 + 2 z^{-1}}{1 - 0.8 z^{-1} + 0.15 z^{-2}}$ with ROC $|z| > 0.5$.

**A:**
1. **Factor the denominator:**
   $$
   1 - 0.8 z^{-1} + 0.15 z^{-2} = (1 - 0.5 z^{-1})(1 - 0.3 z^{-1}).
   $$
   Thus:
   $$
   X(z) = \frac{1 + 2 z^{-1}}{(1 - 0.5 z^{-1})(1 - 0.3 z^{-1})}.
   $$

2. **Partial fraction expansion:**
   Express $X(z)$ as:
   $$
   X(z) = \frac{A}{1 - 0.5 z^{-1}} + \frac{B}{1 - 0.3 z^{-1}}.
   $$
   Solve for $A$ and $B$:
   $$
   1 + 2 z^{-1} = A(1 - 0.3 z^{-1}) + B(1 - 0.5 z^{-1}).
   $$
   Let $z^{-1} = 2$:
   $$
   1 + 4 = A(0.4) \implies A = 12.5.
   $$
   Let $z^{-1} = 1/0.3$:
   $$
   1 + \frac{2}{0.3} = B(0.833) \implies B = -11.5.
   $$
   Thus:
   $$
   X(z) = \frac{12.5}{1 - 0.5 z^{-1}} - \frac{11.5}{1 - 0.3 z^{-1}}.
   $$

3. **Inverse $z$-transform:**
   $$
   x(n) = 12.5 (0.5)^n u(n) - 11.5 (0.3)^n u(n).
   $$

---

### Problem 14 (Practice)
**Q:** Determine the $z$-transform and ROC of the sequence $x(n) = \sin(\omega_0 n) u(n)$.

**A:**
1. **Express sine in terms of exponentials:**
   $$
   \sin(\omega_0 n) = \frac{e^{j \omega_0 n} - e^{-j \omega_0 n}}{2j}.
   $$

2. **$z$-transform of each term:**
   Using the standard $z$-transform pair:
   $$
   e^{j \omega_0 n} u(n) \xleftrightarrow{Z} \frac{1}{1 - e^{j \omega_0} z^{-1}}, \quad \text{ROC: } |z| > 1.
   $$
   Similarly:
   $$
   e^{-j \omega_0 n} u(n) \xleftrightarrow{Z} \frac{1}{1 - e^{-j \omega_0} z^{-1}}, \quad \text{ROC: } |z| > 1.
   $$

3. **Combine the $z$-transforms:**
   $$
   X(z) = \frac{1}{2j} \left( \frac{1}{1 - e^{j \omega_0} z^{-1}} - \frac{1}{1 - e^{-j \omega_0} z^{-1}} \right).
   $$
   Simplify:
   $$
   X(z) = \frac{(\sin \omega_0) z^{-1}}{1 - 2 (\cos \omega_0) z^{-1} + z^{-2}}, \quad \text{ROC: } |z| > 1.
   $$

---

### Problem 15
**Q:** Find the inverse $z$-transform of $X(z) = \frac{1 - z^{-1}}{1 - 0.6 z^{-1} + 0.08 z^{-2}}$ with ROC $|z| > 0.4$.

**A:**
1. **Factor the denominator:**
   $$
   1 - 0.6 z^{-1} + 0.08 z^{-2} = (1 - 0.4 z^{-1})(1 - 0.2 z^{-1}).
   $$
   Thus:
   $$
   X(z) = \frac{1 - z^{-1}}{(1 - 0.4 z^{-1})(1 - 0.2 z^{-1})}.
   $$

2. **Partial fraction expansion:**
   Express $X(z)$ as:
   $$
   X(z) = \frac{A}{1 - 0.4 z^{-1}} + \frac{B}{1 - 0.2 z^{-1}}.
   $$
   Solve for $A$ and $B$:
   $$
   1 - z^{-1} = A(1 - 0.2 z^{-1}) + B(1 - 0.4 z^{-1}).
   $$
   Let $z^{-1} = 1/0.4$:
   $$
   1 - 2.5 = A(0.5) \implies A = -3.
   $$
   Let $z^{-1} = 1/0.2$:
   $$
   1 - 5 = B(-1) \implies B = 4.
   $$
   Thus:
   $$
   X(z) = \frac{-3}{1 - 0.4 z^{-1}} + \frac{4}{1 - 0.2 z^{-1}}.
   $$

3. **Inverse $z$-transform:**
   $$
   x(n) = -3 (0.4)^n u(n) + 4 (0.2)^n u(n).
   $$
