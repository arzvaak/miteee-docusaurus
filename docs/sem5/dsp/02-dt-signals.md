# Week 2 — Discrete-Time Signals & LTI Systems

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. Elementary DT Signals

| Signal | Formula | Key property |
|--------|---------|-------------|
| Unit impulse | $\delta[n]=\begin{cases}1&n=0\\0&\text{else}\end{cases}$ | Sifting: $x[n]*\delta[n-k]=x[n-k]$ |
| Unit step | $u[n]=\begin{cases}1&n\geq0\\0&n<0\end{cases}$ | $\delta[n]=u[n]-u[n-1]$ |
| Unit ramp | $r[n]=nu[n]$ | — |
| Complex exponential | $x[n]=e^{j\omega_0 n}$ | Periodic iff $\omega_0/2\pi$ is rational |

---

## 2. System Properties

**Linearity:** If $x_1\to y_1$ and $x_2\to y_2$, then $ax_1+bx_2\to ay_1+by_2$.
- Non-linear indicators: $x^2[n]$, $|x[n]|$, $\log(x[n])$, added constants

**Causality:** $y[n]$ depends only on $x[n], x[n-1], x[n-2],\ldots$ (no future samples)
- Non-causal indicator: $x[n+k]$ for any $k>0$

**Time-Invariance:** $x[n]\to y[n]$ implies $x[n-k]\to y[n-k]$ for all $k$
- Time-varying indicators: $x[2n]$ (decimation), $x[n]\cdot(-1)^n$, $y[n]=nx[n]$

**Stability (BIBO):** For LTI: $\displaystyle\sum_{n=-\infty}^{\infty}|h[n]|<\infty$

**Initially Relaxed:** Zero input → zero output (no stored energy)

> **Recall trap:** $y[n]=nx[n]$ is **linear and causal** but **time-varying** — the $n$ multiplier makes it shift-variant.

---

## 3. LTI Systems & Convolution

$$\boxed{y[n] = x[n]*h[n] = \sum_{k=-\infty}^{\infty}x[k]\,h[n-k]}$$

**Steps for manual convolution:**

**Step 1:** Flip $h[k]$ to get $h[-k]$

**Step 2:** Shift by $n$ to get $h[n-k]$

**Step 3:** Multiply pointwise with $x[k]$ and sum

**Example:** $h[n]=\{1,-2,1\}$, $x[n]=\{1,2\}$

| $n$ | Calculation | $y[n]$ |
|-----|------------|--------|
| 0 | $1\cdot1$ | 1 |
| 1 | $1\cdot(-2)+2\cdot1$ | 0 |
| 2 | $1\cdot1+2\cdot(-2)$ | −3 |
| 3 | $2\cdot1$ | 2 |

Result: $y[n]=\{1,0,-3,2\}$ ✅

---

## 4. LTI System Interconnections

| Configuration | Impulse Response |
|--------------|-----------------|
| Series (cascade) | $h[n]=h_1[n]*h_2[n]$ |
| Parallel | $h[n]=h_1[n]+h_2[n]$ |

**Mixed topology:** For parallel paths — path 1: $h_1\to h_2$, path 2: $h_3\to h_4\to h_1$:
$$y[n] = \bigl[h_1[n]*h_2[n] + h_3[n]*h_4[n]*h_1[n]\bigr]*x[n]$$

---

## 5. Signal Operations

| Operation | Effect |
|-----------|--------|
| $x[n-k]$ | Time delay (shift right by $k$) |
| $x[n+k]$ | Time advance (shift left by $k$) |
| $x[-n]$ | Time reversal |
| $ax[n]$ | Amplitude scaling |
| $x[Mn]$ | Decimation (compress time by $M$) |
| $x[n/M]$ | Interpolation (expand time by $M$) |

**Example:** $x[n]=|n|$ for $-2\leq n\leq2=\{2,1,0,1,2\}$, find $y[n]=2x[n-2]$

- At $n=0$: $2x[-2]=4$; $n=1$: $2x[-1]=2$; $n=2$: $2x[0]=0$; $n=3$: $2x[1]=2$; $n=4$: $2x[2]=4$
- Result: $y[n]=\{4,2,0,2,4\}$ for $n=0,\ldots,4$ ✅

---

## 6. Accumulator (Running Sum)

$$y[n] = \sum_{k=-\infty}^{n}x[k]$$

For $x[n]=nu[n]$: $\displaystyle y[n]=\sum_{k=0}^{n}k=\frac{n(n+1)}{2}$ ✅

---

## 7. Cross-Correlation & Pitch Detection

$$R_{xy}[l] = \sum_{n}x[n]\,y[n-l]$$

For voiced speech, the **autocorrelation** has peaks at lag $\tau=T_0$ (pitch period).

$$\boxed{F_0 = \frac{F_s}{\tau_{\text{peak}}}}$$

**Example (Q6):** Autocorrelation peak at lag 70, $F_s=16$ kHz:
$$F_0 = \frac{16000}{70} \approx 228 \text{ Hz}$$ ✅

---

## 8. Key MCQs

| Question | Answer |
|---------|--------|
| $y[n]=2x[n]-3x[n-1]$ — linear, causal? | Linear ✅, Causal ✅ |
| $0.5x[n-3]$ — what change? | Amplitude halved, delayed ✅ |
| System: $[h_1*h_2+h_3*h_4*h_1]*x[n]$ | Mixed topology ✅ |
| Accumulator with $x[n]=nu[n]$ | $y[n]=n(n+1)/2$ ✅ |
| LTI initially relaxed means | Zero input → zero output ✅ |
| $x[n]=\{1,2\}$, $h[n]=\delta[n]-2\delta[n-1]+\delta[n-2]$ | $y[n]=\{1,0,-3,2\}$ ✅ |
| $y[n]=2x[n-2]$, $x[n]=|n|$ for $-2\leq n\leq2$ | $\{4,2,0,2,4\}$ ✅ |
| Pitch $F_0$, lag = 70, $F_s=16$ kHz | 228 Hz ✅ |

---

## Formula Sheet — Week 2

$$y[n]=\sum_{k}x[k]\,h[n-k] \qquad \text{(convolution)}$$

$$\text{Series: }h=h_1*h_2 \qquad \text{Parallel: }h=h_1+h_2$$

$$F_0 = F_s\,/\,\tau_{\text{peak}} \qquad y[n]=\frac{n(n+1)}{2} \text{ for }x[n]=nu[n]$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems extracted and invented in the style of Schaum's Outline, covering discrete-time signals, system properties, LTI systems, convolution, impulse response, unit step, and unit impulse.

---

### Problem 1
**Q:** Determine whether the following systems are **linear**, **time-invariant**, **causal**, and **stable**:
1. \( y(n) = x(n) + 2x(n-1) \)
2. \( y(n) = n x(n) \)
3. \( y(n) = \sum_{k=-\infty}^{n} x(k) \)

**A:**
**System 1:**
1. **Linearity:** Let \( x_1(n) \rightarrow y_1(n) = x_1(n) + 2x_1(n-1) \) and \( x_2(n) \rightarrow y_2(n) = x_2(n) + 2x_2(n-1) \).
   For \( x(n) = a x_1(n) + b x_2(n) \), the output is:
   \[
   y(n) = a x_1(n) + b x_2(n) + 2a x_1(n-1) + 2b x_2(n-1) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:** Let \( x(n) \rightarrow y(n) = x(n) + 2x(n-1) \). For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = x(n-n_0) + 2x(n-n_0-1) = y(n-n_0).
   \]
   Thus, the system is **time-invariant**.

3. **Causality:** The output depends only on current and past inputs, so the system is **causal**.

4. **Stability:** For a bounded input \( |x(n)| \leq M \), the output is:
   \[
   |y(n)| \leq |x(n)| + 2|x(n-1)| \leq 3M.
   \]
   Thus, the system is **stable (BIBO)**.

**System 2:**
1. **Linearity:** Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = n (a x_1(n) + b x_2(n)) = a n x_1(n) + b n x_2(n) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:** For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = n x(n-n_0) \neq (n-n_0) x(n-n_0) = y(n-n_0).
   \]
   Thus, the system is **not time-invariant**.

3. **Causality:** The output depends only on the current input, so the system is **causal**.

4. **Stability:** For \( x(n) = 1 \), \( y(n) = n \), which is unbounded. Thus, the system is **not stable**.

**System 3:**
1. **Linearity:** Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = \sum_{k=-\infty}^n (a x_1(k) + b x_2(k)) = a \sum_{k=-\infty}^n x_1(k) + b \sum_{k=-\infty}^n x_2(k) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:** For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = \sum_{k=-\infty}^n x(k-n_0) = \sum_{k=-\infty}^{n-n_0} x(k) = y(n-n_0).
   \]
   Thus, the system is **time-invariant**.

3. **Causality:** The output depends only on past and current inputs, so the system is **causal**.

4. **Stability:** For \( x(n) = u(n) \), \( y(n) = n+1 \), which is unbounded. Thus, the system is **not stable**.

---

### Problem 2
**Q:** Compute the **convolution** \( y(n) = x(n) * h(n) \) for the following sequences:
\[
x(n) = \{1, 2, 1\}, \quad h(n) = \{1, -1, 1\}.
\]
Assume \( x(n) = 0 \) and \( h(n) = 0 \) outside the given ranges.

**A:**
The convolution sum is:
\[
y(n) = \sum_{k=-\infty}^{\infty} x(k) h(n-k).
\]
We compute \( y(n) \) for \( n = 0, 1, 2, 3, 4 \):

1. **\( n = 0 \):**
   \[
   y(0) = x(0)h(0) = 1 \cdot 1 = 1.
   \]

2. **\( n = 1 \):**
   \[
   y(1) = x(0)h(1) + x(1)h(0) = 1 \cdot (-1) + 2 \cdot 1 = 1.
   \]

3. **\( n = 2 \):**
   \[
   y(2) = x(0)h(2) + x(1)h(1) + x(2)h(0) = 1 \cdot 1 + 2 \cdot (-1) + 1 \cdot 1 = 0.
   \]

4. **\( n = 3 \):**
   \[
   y(3) = x(1)h(2) + x(2)h(1) = 2 \cdot 1 + 1 \cdot (-1) = 1.
   \]

5. **\( n = 4 \):**
   \[
   y(4) = x(2)h(2) = 1 \cdot 1 = 1.
   \]

Thus, \( y(n) = \{1, 1, 0, 1, 1\} \).

---

### Problem 3
**Q:** A discrete-time system is described by the difference equation:
\[
y(n) - 0.5 y(n-1) = x(n).
\]
1. Find the **impulse response** \( h(n) \).
2. Determine if the system is **stable**.

**A:**
1. **Impulse response:**
   The system is LTI, so we solve for \( h(n) \) with \( x(n) = \delta(n) \):
   \[
   h(n) - 0.5 h(n-1) = \delta(n).
   \]
   For \( n = 0 \):
   \[
   h(0) - 0.5 h(-1) = 1 \implies h(0) = 1 \quad (\text{since } h(-1) = 0).
   \]
   For \( n \geq 1 \):
   \[
   h(n) = 0.5 h(n-1).
   \]
   This is a first-order recurrence relation with solution:
   \[
   h(n) = (0.5)^n u(n).
   \]

2. **Stability:**
   The system is stable if \( \sum_{n=-\infty}^{\infty} |h(n)| < \infty \):
   \[
   \sum_{n=0}^{\infty} (0.5)^n = \frac{1}{1 - 0.5} = 2 < \infty.
   \]
   Thus, the system is **stable**.

---

### Problem 4 (Practice)
**Q:** Consider the system:
\[
y(n) = x(n) + x(n-1) + x(n-2).
\]
1. Is the system **linear**?
2. Is the system **time-invariant**?
3. Compute the **impulse response** \( h(n) \).

**A:**
1. **Linearity:**
   Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = a x_1(n) + b x_2(n) + a x_1(n-1) + b x_2(n-1) + a x_1(n-2) + b x_2(n-2) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:**
   For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = x(n-n_0) + x(n-n_0-1) + x(n-n_0-2) = y(n-n_0).
   \]
   Thus, the system is **time-invariant**.

3. **Impulse response:**
   For \( x(n) = \delta(n) \):
   \[
   h(n) = \delta(n) + \delta(n-1) + \delta(n-2).
   \]
   Thus, \( h(n) = \{1, 1, 1\} \).

---

### Problem 5
**Q:** Compute the **circular convolution** of the sequences:
\[
x(n) = \{1, 2, 3\}, \quad h(n) = \{1, 1, 1\},
\]
using \( N = 3 \).

**A:**
The circular convolution is:
\[
y(n) = \sum_{k=0}^{2} x(k) h((n-k))_3.
\]
Compute for \( n = 0, 1, 2 \):

1. **\( n = 0 \):**
   \[
   y(0) = x(0)h(0) + x(1)h(2) + x(2)h(1) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 = 6.
   \]

2. **\( n = 1 \):**
   \[
   y(1) = x(0)h(1) + x(1)h(0) + x(2)h(2) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 = 6.
   \]

3. **\( n = 2 \):**
   \[
   y(2) = x(0)h(2) + x(1)h(1) + x(2)h(0) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 = 6.
   \]

Thus, \( y(n) = \{6, 6, 6\} \).

---

### Problem 6
**Q:** A system has the impulse response:
\[
h(n) = \delta(n) - \delta(n-1).
\]
1. Is the system **causal**?
2. Is the system **stable**?
3. Compute the output \( y(n) \) for \( x(n) = u(n) \).

**A:**
1. **Causality:**
   The impulse response is zero for \( n < 0 \), so the system is **causal**.

2. **Stability:**
   The impulse response is absolutely summable:
   \[
   \sum_{n=-\infty}^{\infty} |h(n)| = 1 + 1 = 2 < \infty.
   \]
   Thus, the system is **stable**.

3. **Output for \( x(n) = u(n) \):**
   \[
   y(n) = h(n) * u(n) = u(n) - u(n-1) = \delta(n).
   \]

---

### Problem 7 (Practice)
**Q:** Determine if the following system is **linear** and **time-invariant**:
\[
y(n) = x(n) \cos(0.2 \pi n).
\]

**A:**
1. **Linearity:**
   Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = (a x_1(n) + b x_2(n)) \cos(0.2 \pi n) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:**
   For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = x(n-n_0) \cos(0.2 \pi n) \neq x(n-n_0) \cos(0.2 \pi (n-n_0)) = y(n-n_0).
   \]
   Thus, the system is **not time-invariant**.

---

### Problem 8
**Q:** Compute the **linear convolution** of:
\[
x(n) = \{1, 0, -1\}, \quad h(n) = \{1, 1, 1, 1\}.
\]

**A:**
The convolution sum is:
\[
y(n) = \sum_{k=-\infty}^{\infty} x(k) h(n-k).
\]
Compute for \( n = 0, 1, \dots, 5 \):

1. **\( n = 0 \):**
   \[
   y(0) = x(0)h(0) = 1 \cdot 1 = 1.
   \]

2. **\( n = 1 \):**
   \[
   y(1) = x(0)h(1) + x(1)h(0) = 1 \cdot 1 + 0 \cdot 1 = 1.
   \]

3. **\( n = 2 \):**
   \[
   y(2) = x(0)h(2) + x(1)h(1) + x(2)h(0) = 1 \cdot 1 + 0 \cdot 1 + (-1) \cdot 1 = 0.
   \]

4. **\( n = 3 \):**
   \[
   y(3) = x(0)h(3) + x(1)h(2) + x(2)h(1) = 1 \cdot 1 + 0 \cdot 1 + (-1) \cdot 1 = 0.
   \]

5. **\( n = 4 \):**
   \[
   y(4) = x(1)h(3) + x(2)h(2) = 0 \cdot 1 + (-1) \cdot 1 = -1.
   \]

6. **\( n = 5 \):**
   \[
   y(5) = x(2)h(3) = (-1) \cdot 1 = -1.
   \]

Thus, \( y(n) = \{1, 1, 0, 0, -1, -1\} \).

---

### Problem 9
**Q:** A system is described by:
\[
y(n) = \sum_{k=0}^{n} x(k).
\]
1. Is the system **linear**?
2. Is the system **time-invariant**?
3. Is the system **causal**?

**A:**
1. **Linearity:**
   Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = \sum_{k=0}^n (a x_1(k) + b x_2(k)) = a \sum_{k=0}^n x_1(k) + b \sum_{k=0}^n x_2(k) = a y_1(n) + b y_2(n).
   \]
   Thus, the system is **linear**.

2. **Time-invariance:**
   For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = \sum_{k=0}^n x(k-n_0) = \sum_{k=-n_0}^{n-n_0} x(k) \neq \sum_{k=0}^{n-n_0} x(k) = y(n-n_0).
   \]
   Thus, the system is **not time-invariant**.

3. **Causality:**
   The output depends only on past and current inputs, so the system is **causal**.

---

### Problem 10 (Practice)
**Q:** Compute the **impulse response** of the system:
\[
y(n) - 0.8 y(n-1) = x(n) - x(n-1).
\]

**A:**
The system is LTI, so we solve for \( h(n) \) with \( x(n) = \delta(n) \):
\[
h(n) - 0.8 h(n-1) = \delta(n) - \delta(n-1).
\]
For \( n = 0 \):
\[
h(0) - 0.8 h(-1) = 1 \implies h(0) = 1.
\]
For \( n = 1 \):
\[
h(1) - 0.8 h(0) = -1 \implies h(1) = -1 + 0.8 = -0.2.
\]
For \( n \geq 2 \):
\[
h(n) = 0.8 h(n-1).
\]
The solution is:
\[
h(n) = (0.8)^n u(n) - 0.2 (0.8)^{n-1} u(n-1).
\]
Simplifying:
\[
h(n) = \delta(n) - 0.2 (0.8)^{n-1} u(n-1).
\]

---

### Problem 11
**Q:** Determine if the system \( y(n) = x(n) + x(n-1) \) is **stable** and **causal**.

**A:**
1. **Stability:**
   The impulse response is \( h(n) = \delta(n) + \delta(n-1) \). The sum of absolute values is:
   \[
   \sum_{n=-\infty}^{\infty} |h(n)| = 1 + 1 = 2 < \infty.
   \]
   Thus, the system is **stable**.

2. **Causality:**
   The output depends only on current and past inputs, so the system is **causal**.

---

### Problem 12 (Practice)
**Q:** Compute the **convolution** of:
\[
x(n) = \{1, 2, 3, 4\}, \quad h(n) = \{1, -1\}.
\]

**A:**
The convolution sum is:
\[
y(n) = \sum_{k=-\infty}^{\infty} x(k) h(n-k).
\]
Compute for \( n = 0, 1, \dots, 4 \):

1. **\( n = 0 \):**
   \[
   y(0) = x(0)h(0) = 1 \cdot 1 = 1.
   \]

2. **\( n = 1 \):**
   \[
   y(1) = x(0)h(1) + x(1)h(0) = 1 \cdot (-1) + 2 \cdot 1 = 1.
   \]

3. **\( n = 2 \):**
   \[
   y(2) = x(1)h(1) + x(2)h(0) = 2 \cdot (-1) + 3 \cdot 1 = 1.
   \]

4. **\( n = 3 \):**
   \[
   y(3) = x(2)h(1) + x(3)h(0) = 3 \cdot (-1) + 4 \cdot 1 = 1.
   \]

5. **\( n = 4 \):**
   \[
   y(4) = x(3)h(1) = 4 \cdot (-1) = -4.
   \]

Thus, \( y(n) = \{1, 1, 1, 1, -4\} \).

---

### Problem 13
**Q:** A system has the impulse response \( h(n) = (0.5)^n u(n) \). Compute the output for \( x(n) = u(n) - u(n-3) \).

**A:**
The output is:
\[
y(n) = h(n) * x(n) = \sum_{k=-\infty}^{\infty} h(k) x(n-k).
\]
For \( n = 0, 1, 2 \):
\[
y(n) = \sum_{k=0}^n (0.5)^k = \frac{1 - (0.5)^{n+1}}{1 - 0.5} = 2 (1 - (0.5)^{n+1}).
\]
For \( n \geq 3 \):
\[
y(n) = \sum_{k=n-2}^n (0.5)^k = (0.5)^{n-2} \frac{1 - (0.5)^3}{1 - 0.5} = 7 (0.5)^n.
\]
Thus:
\[
y(n) = \begin{cases}
2 (1 - (0.5)^{n+1}) & 0 \leq n \leq 2, \\
7 (0.5)^n & n \geq 3.
\end{cases}
\]

---

### Problem 14 (Practice)
**Q:** Determine if the system \( y(n) = x(n) + y(n-1) \) is **linear**, **time-invariant**, and **causal**.

**A:**
1. **Linearity:**
   Let \( x(n) = a x_1(n) + b x_2(n) \). The output is:
   \[
   y(n) = a x_1(n) + b x_2(n) + y(n-1).
   \]
   This is not equal to \( a y_1(n) + b y_2(n) \) because \( y(n-1) \) depends on past inputs. Thus, the system is **not linear**.

2. **Time-invariance:**
   For \( x(n-n_0) \), the output is:
   \[
   y(n,n_0) = x(n-n_0) + y(n-1,n_0) \neq x(n-n_0) + y(n-n_0-1) = y(n-n_0).
   \]
   Thus, the system is **not time-invariant**.

3. **Causality:**
   The output depends on past outputs and current input, so the system is **causal**.

---

### Problem 15
**Q:** Compute the **circular convolution** of:
\[
x(n) = \{1, 2, 3, 4\}, \quad h(n) = \{1, 1, 1, 1\},
\]
using \( N = 4 \).

**A:**
The circular convolution is:
\[
y(n) = \sum_{k=0}^{3} x(k) h((n-k))_4.
\]
Compute for \( n = 0, 1, 2, 3 \):

1. **\( n = 0 \):**
   \[
   y(0) = x(0)h(0) + x(1)h(3) + x(2)h(2) + x(3)h(1) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 + 4 \cdot 1 = 10.
   \]

2. **\( n = 1 \):**
   \[
   y(1) = x(0)h(1) + x(1)h(0) + x(2)h(3) + x(3)h(2) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 + 4 \cdot 1 = 10.
   \]

3. **\( n = 2 \):**
   \[
   y(2) = x(0)h(2) + x(1)h(1) + x(2)h(0) + x(3)h(3) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 + 4 \cdot 1 = 10.
   \]

4. **\( n = 3 \):**
   \[
   y(3) = x(0)h(3) + x(1)h(2) + x(2)h(1) + x(3)h(0) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 + 4 \cdot 1 = 10.
   \]

Thus, \( y(n) = \{10, 10, 10, 10\} \).
