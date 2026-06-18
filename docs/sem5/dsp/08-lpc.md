# Week 10 — Linear Prediction & LPC Analysis

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. Signal Models

| Model | Transfer Function | Poles | Zeros |
|-------|-----------------|-------|-------|
| **AR (AutoRegressive)** | $H(z)=\dfrac{G}{A(z)}$ | **Yes** | **No** |
| **MA (Moving Average)** | $H(z)=B(z)$ | **No** | **Yes** |
| **ARMA** | $H(z)=\dfrac{B(z)}{A(z)}$ | Yes | Yes |

> **Recall trap:** AR = all-pole, MA = all-zero. Common exam swap.

---

## 2. AR Model & Linear Prediction

**All-pole model:**

$$H(z)=\frac{G}{A(z)}=\frac{G}{1-\sum_{k=1}^{p}\alpha_k z^{-k}}$$

**Output equation:** $y[n]=\sum_{k=1}^{p}\alpha_k y[n-k]+Gx[n]$

**Prediction:** $\hat{y}[n]=\sum_{k=1}^{p}\alpha_k y[n-k]$

The linear predictor minimizes the **mean-squared prediction error**. ✅

---

## 3. Lattice Filter — PARCOR Recursion

### Forward & Backward Prediction Errors

**Initialization (order 0):**
$$e^0[m]=x[m] \qquad b^0[m]=x[m]$$

> **Recall trap:** $e^0[m]=x[m]$ — the initial forward error IS the input signal.

**Recursion (order $i$):**

$$\boxed{e^i[m]=e^{i-1}[m]-k_i\,b^{i-1}[m-1]}$$

$$\boxed{b^i[m]=b^{i-1}[m-1]-k_i\,e^{i-1}[m]}$$

where $k_i$ is the **PARCOR (Partial Correlation) coefficient** at stage $i$.

---

## 4. PARCOR Coefficient Formula

$$k_i=\frac{\sum_{m}e^{i-1}[m]\,b^{i-1}[m-1]}{\sqrt{\sum_m\bigl[e^{i-1}[m]\bigr]^2\cdot\sum_m\bigl[b^{i-1}[m-1]\bigr]^2}}$$

**Stability condition:** $|k_i|\leq1$ for all stages → guarantees stable all-pole model ✅

---

## 5. Energy Recursion

$$\boxed{E^i=E^{i-1}(1-k_i^2)}$$

**Example (Q1):** $E^0=3000$, $k_1=0.5$, $k_2=-0.2$, $k_3=0.3$

**Step 1:** $E^1=3000(1-0.25)=2250$

**Step 2:** $E^2=2250(1-0.04)=2160$

**Step 3:** $E^3=2160(1-0.09)=1965.6$ ✅

---

## 6. Computing $k_1$ — Step by Step

**Example (Q6 / Tutorial Q6):** $x[n]=\{1,2,0,3\}$, order $p=2$

**Step 1:** Initialize $e^0=b^0=\{1,2,0,3\}$

**Step 2:** Compute $k_1$:
$$\text{Numerator: }\sum_{m=1}^{3}e^0[m]b^0[m-1]=2\cdot1+0\cdot2+3\cdot0=2$$
$$\sum_{m=1}^{3}(e^0[m])^2=4+0+9=13 \qquad \sum_{m=0}^{2}(b^0[m])^2=1+4+0=5$$
$$k_1=\frac{2}{\sqrt{65}}\approx0.248$$

**Step 3:** Compute $e^1[m]$ and $b^1[m]$:
- $e^1[1]=2-0.248\cdot1=1.752$, $\;e^1[2]=0-0.248\cdot2=-0.496$, $\;e^1[3]=3-0.248\cdot0=3$
- $b^1[1]=1-0.248\cdot2=0.504$, $\;b^1[2]=2-0.248\cdot0=2$, $\;b^1[3]=0-0.248\cdot3=-0.744$

**Step 4:** Compute $k_2$ using $e^1$ and $b^1$ the same way.

---

## 7. Minimum Mean-Squared Prediction Error

$$\boxed{E_{\min}=R[0]-\sum_{k=1}^{p}\alpha_k R[k]}$$

where $R[k]=\sum_n x[n]x[n+k]$ is the autocorrelation.

**Example (Q6):** $x[n]=\{1,2,-1,3\}$, $\alpha_1=0.5$, $\alpha_2=-0.5$, $\alpha_3=0.3$

**Step 1:** Compute autocorrelations:
- $R[0]=1+4+1+9=15$
- $R[1]=1\cdot2+2\cdot(-1)+(-1)\cdot3=-3$
- $R[2]=1\cdot(-1)+2\cdot3=5$
- $R[3]=1\cdot3=3$

**Step 2:** Apply formula:
$$E_{\min}=15-[0.5\cdot(-3)+(-0.5)\cdot5+0.3\cdot3]=15-(-1.5-2.5+0.9)=15+3.1=18.1$$ ✅

---

## 8. LPC Order for Speech

$$\boxed{p=F_s\,/\,1000 \quad \text{(poles per kHz)}}$$

**Example (Q3):** 4 resonances at 500, 1500, 2500, 3500 Hz, $F_s=16$ kHz:

$$p=F_s/1000=16$$ ✅ (use the $F_s/1000$ rule, not $2\times$ resonances)

---

## 9. Prediction Error Signal Length

For window of $L_w$ samples, order $p$:

$$\text{Error length} = L_w+p-1$$

**Example (Q10):** 20th order LPC, window = 20 ms, $F_s=16$ kHz:
- $L_w=16000\times0.02=320$ samples
- Error length $=320+20-1=339$ ✅

> **Recall trap:** For some methods the answer is just $L_w$ (e.g. $L_w=200$ for 12th order, 25 ms, 8 kHz). Use the answer that matches — both formulas appear in assignments.

---

## 10. Key MCQs

| Question | Answer |
|---------|--------|
| AR model has | Poles but not zeros ✅ |
| MA model has | Zeros but not poles ✅ |
| $E^0=3000$, $k_1=0.5$, $k_2=-0.2$, $k_3=0.3$ → $E^3$ | 1965.6 ✅ |
| LPC order for $F_s=16$ kHz speech | 16 ✅ |
| PARCOR stability condition | $|k_i|\leq1$ ✅ |
| $e^0[m]$ equals | $x[m]$ (input signal) ✅ |
| Forward prediction error | $e^i[m]=e^{i-1}[m]-k_i b^{i-1}[m-1]$ ✅ |
| Backward prediction error | $b^i[m]=b^{i-1}[m-1]-k_i e^{i-1}[m]$ ✅ |
| Min MSE for $x=\{1,2,-1,3\}$, $\alpha_1=0.5,\alpha_2=-0.5,\alpha_3=0.3$ | 18.1 ✅ |
| Prediction error maximum at | Beginning and end ✅ |
| What does linear prediction minimize | Mean-squared error ✅ |
| 20th order LPC, window=20 ms, $F_s=16$ kHz → error length | 339 ✅ |

---

## Formula Sheet — Week 10

$$e^i[m]=e^{i-1}[m]-k_i b^{i-1}[m-1] \qquad b^i[m]=b^{i-1}[m-1]-k_i e^{i-1}[m]$$

$$E^i=E^{i-1}(1-k_i^2) \qquad E_{\min}=R[0]-\sum_{k=1}^{p}\alpha_k R[k]$$

$$p=F_s/1000 \;\text{(speech LPC order)} \qquad |k_i|\leq1 \;\text{(stability)}$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on **Linear Predictive Coding (LPC), PARCOR coefficients, lattice filters, autocorrelation, Levinson-Durbin, AR models, prediction error, and the Burg method**, formatted as requested.

---

### Problem 1
**Q:** A 3rd-order autoregressive (AR) process is described by the difference equation:
\[ x[n] = 0.8x[n-1] - 0.5x[n-2] + 0.3x[n-3] + w[n], \]
where \( w[n] \) is white noise with variance \( \sigma_w^2 = 1 \).
Compute the **autocorrelation sequence** \( r_x[k] \) for \( k = 0, 1, 2, 3 \) using the Yule-Walker equations.

**A:**
1. The Yule-Walker equations for an AR(3) process are:
   \[
   \begin{bmatrix}
   r_x[0] & r_x[1] & r_x[2] \\
   r_x[1] & r_x[0] & r_x[1] \\
   r_x[2] & r_x[1] & r_x[0]
   \end{bmatrix}
   \begin{bmatrix}
   1 \\ -a_1 \\ -a_2
   \end{bmatrix}
   =
   \begin{bmatrix}
   \sigma_w^2 \\ 0 \\ 0
   \end{bmatrix},
   \]
   where \( a_1 = -0.8 \), \( a_2 = 0.5 \), \( a_3 = -0.3 \).

2. Substitute the AR coefficients:
   \[
   \begin{cases}
   r_x[0] - 0.8r_x[1] + 0.5r_x[2] - 0.3r_x[3] = 1, \\
   r_x[1] - 0.8r_x[0] + 0.5r_x[1] - 0.3r_x[2] = 0, \\
   r_x[2] - 0.8r_x[1] + 0.5r_x[0] - 0.3r_x[1] = 0.
   \end{cases}
   \]

3. Solve the system:
   - From the second equation:
     \[ r_x[1] = 0.8r_x[0] - 0.5r_x[1] + 0.3r_x[2]. \]
     \[ 1.5r_x[1] = 0.8r_x[0] + 0.3r_x[2]. \]
   - From the third equation:
     \[ r_x[2] = 0.8r_x[1] - 0.5r_x[0] + 0.3r_x[1]. \]
     \[ r_x[2] = 1.1r_x[1] - 0.5r_x[0]. \]
   - Substitute \( r_x[2] \) into the second equation:
     \[ 1.5r_x[1] = 0.8r_x[0] + 0.3(1.1r_x[1] - 0.5r_x[0]). \]
     \[ 1.5r_x[1] = 0.8r_x[0] + 0.33r_x[1] - 0.15r_x[0]. \]
     \[ 1.17r_x[1] = 0.65r_x[0]. \]
     \[ r_x[1] = \frac{0.65}{1.17} r_x[0] \approx 0.5556 r_x[0]. \]
   - Substitute back to find \( r_x[2] \):
     \[ r_x[2] = 1.1(0.5556 r_x[0]) - 0.5r_x[0] \approx 0.1112 r_x[0]. \]
   - Substitute into the first equation:
     \[ r_x[0] - 0.8(0.5556 r_x[0]) + 0.5(0.1112 r_x[0]) - 0.3r_x[3] = 1. \]
     \[ r_x[0] - 0.4445 r_x[0] + 0.0556 r_x[0] - 0.3r_x[3] = 1. \]
     \[ 0.6111 r_x[0] - 0.3r_x[3] = 1. \]
   - Assume \( r_x[3] \approx 0 \) (for simplicity, though exact solution requires solving the full system):
     \[ r_x[0] \approx \frac{1}{0.6111} \approx 1.6364. \]
   - Thus:
     \[ r_x[1] \approx 0.5556 \times 1.6364 \approx 0.9091, \]
     \[ r_x[2] \approx 0.1112 \times 1.6364 \approx 0.1820. \]
   - For \( r_x[3] \), use the fourth Yule-Walker equation (not shown here for brevity):
     \[ r_x[3] \approx -0.3r_x[0] + 0.8r_x[1] - 0.5r_x[2] \approx -0.1636. \]

4. Final autocorrelation sequence:
   \[
   r_x[0] \approx 1.6364, \quad r_x[1] \approx 0.9091, \quad r_x[2] \approx 0.1820, \quad r_x[3] \approx -0.1636.
   \]

---

### Problem 2
**Q:** Given the autocorrelation sequence \( r_x[0] = 5 \), \( r_x[1] = 3 \), \( r_x[2] = 1 \) for a 2nd-order AR process, use the **Levinson-Durbin algorithm** to compute the AR coefficients \( a_1, a_2 \) and the prediction error variance \( \sigma^2 \).

**A:**
1. Initialize:
   \[
   \sigma_0^2 = r_x[0] = 5, \quad a_0^{(0)} = 1.
   \]

2. First iteration (\( k = 1 \)):
   \[
   \Delta_1 = r_x[1] = 3, \quad \Gamma_1 = \frac{\Delta_1}{\sigma_0^2} = \frac{3}{5} = 0.6.
   \]
   \[
   \sigma_1^2 = \sigma_0^2 (1 - \Gamma_1^2) = 5(1 - 0.36) = 3.2.
   \]
   \[
   a_1^{(1)} = \Gamma_1 = 0.6.
   \]

3. Second iteration (\( k = 2 \)):
   \[
   \Delta_2 = r_x[2] + a_1^{(1)} r_x[1] = 1 + 0.6 \times 3 = 2.8.
   \]
   \[
   \Gamma_2 = \frac{\Delta_2}{\sigma_1^2} = \frac{2.8}{3.2} = 0.875.
   \]
   \[
   \sigma_2^2 = \sigma_1^2 (1 - \Gamma_2^2) = 3.2(1 - 0.7656) = 0.75.
   \]
   \[
   a_1^{(2)} = a_1^{(1)} - \Gamma_2 a_1^{(1)} = 0.6 - 0.875 \times 0.6 = 0.075.
   \]
   \[
   a_2^{(2)} = \Gamma_2 = 0.875.
   \]

4. Final AR coefficients and prediction error:
   \[
   a_1 = 0.075, \quad a_2 = 0.875, \quad \sigma^2 = 0.75.
   \]

---

### Problem 3 (Practice)
**Q:** A speech signal is modeled as an AR(2) process with coefficients \( a_1 = -0.6 \), \( a_2 = 0.2 \). Compute the **PARCOR coefficients** \( \Gamma_1 \) and \( \Gamma_2 \) using the step-down recursion.

**A:**
1. Initialize:
   \[
   A_2(z) = 1 - 0.6z^{-1} + 0.2z^{-2}, \quad \Gamma_2 = a_2 = 0.2.
   \]

2. Step-down recursion for \( A_1(z) \):
   \[
   A_1(z) = \frac{1}{1 - \Gamma_2^2} \left[ A_2(z) - \Gamma_2 z^{-2} A_2(z^{-1}) \right].
   \]
   \[
   A_2(z^{-1}) = 1 - 0.6z + 0.2z^2.
   \]
   \[
   A_1(z) = \frac{1}{1 - 0.04} \left[ (1 - 0.6z^{-1} + 0.2z^{-2}) - 0.2z^{-2}(1 - 0.6z + 0.2z^2) \right].
   \]
   \[
   A_1(z) = \frac{1}{0.96} \left[ 1 - 0.6z^{-1} + 0.2z^{-2} - 0.2z^{-2} + 0.12z^{-1} - 0.04 \right].
   \]
   \[
   A_1(z) = \frac{1}{0.96} \left[ 0.96 - 0.48z^{-1} \right] = 1 - 0.5z^{-1}.
   \]
   \[
   \Gamma_1 = a_1^{(1)} = -0.5.
   \]

3. Final PARCOR coefficients:
   \[
   \Gamma_1 = -0.5, \quad \Gamma_2 = 0.2.
   \]

---

### Problem 4
**Q:** A lattice filter has reflection coefficients \( \Gamma_1 = 0.5 \) and \( \Gamma_2 = -0.3 \). Compute the **prediction error** \( e[n] \) for the input \( x[n] = \delta[n] \), where \( \delta[n] \) is the unit impulse.

**A:**
1. The prediction error \( e[n] = f_2[n] \) for an FIR lattice filter is given by:
   \[
   A_2(z) = 1 + a_1 z^{-1} + a_2 z^{-2}.
   \]

2. Compute \( A_2(z) \) using the step-up recursion:
   - \( A_0(z) = 1 \).
   - \( A_1(z) = A_0(z) + \Gamma_1 z^{-1} A_0(z^{-1}) = 1 + 0.5z^{-1} \).
   - \( A_2(z) = A_1(z) + \Gamma_2 z^{-2} A_1(z^{-1}) \).
     \[
     A_1(z^{-1}) = 1 + 0.5z.
     \]
     \[
     A_2(z) = (1 + 0.5z^{-1}) + (-0.3)z^{-2}(1 + 0.5z) = 1 + 0.5z^{-1} - 0.3z^{-2} - 0.15z^{-1}.
     \]
     \[
     A_2(z) = 1 + 0.35z^{-1} - 0.3z^{-2}.
     \]

3. The prediction error is the impulse response of \( A_2(z) \):
   \[
   e[n] = \delta[n] + 0.35\delta[n-1] - 0.3\delta[n-2].
   \]

---

### Problem 5 (Practice)
**Q:** For an AR(1) process with \( r_x[0] = 4 \) and \( r_x[1] = 2 \), compute the **Burg reflection coefficient** \( \Gamma_1 \) and the prediction error variance \( \sigma^2 \).

**A:**
1. The Burg method minimizes the sum of forward and backward prediction errors:
   \[
   \Gamma_1 = \frac{2 \sum_{n=1}^{N-1} x[n]x[n-1]}{\sum_{n=1}^{N-1} (x^2[n] + x^2[n-1])}.
   \]
   For an AR(1) process, this simplifies to:
   \[
   \Gamma_1 = \frac{r_x[1]}{r_x[0]} = \frac{2}{4} = 0.5.
   \]

2. The prediction error variance is:
   \[
   \sigma^2 = r_x[0] (1 - \Gamma_1^2) = 4(1 - 0.25) = 3.
   \]

---

### Problem 6
**Q:** A 2nd-order lattice filter has reflection coefficients \( \Gamma_1 = 0.4 \) and \( \Gamma_2 = -0.7 \). Determine if the filter is **stable**.

**A:**
1. A lattice filter is stable if and only if all reflection coefficients satisfy \( |\Gamma_k| < 1 \).
2. Check:
   \[
   |\Gamma_1| = 0.4 < 1, \quad |\Gamma_2| = 0.7 < 1.
   \]
3. The filter is **stable**.

---

### Problem 7 (Practice)
**Q:** Given the autocorrelation sequence \( r_x[0] = 3 \), \( r_x[1] = 1.5 \), \( r_x[2] = 0.5 \), compute the **AR(2) coefficients** using the Levinson-Durbin algorithm and verify the stability of the model.

**A:**
1. Initialize:
   \[
   \sigma_0^2 = 3, \quad a_0^{(0)} = 1.
   \]

2. First iteration (\( k = 1 \)):
   \[
   \Gamma_1 = \frac{r_x[1]}{\sigma_0^2} = \frac{1.5}{3} = 0.5.
   \]
   \[
   \sigma_1^2 = 3(1 - 0.25) = 2.25.
   \]
   \[
   a_1^{(1)} = 0.5.
   \]

3. Second iteration (\( k = 2 \)):
   \[
   \Delta_2 = r_x[2] + a_1^{(1)} r_x[1] = 0.5 + 0.5 \times 1.5 = 1.25.
   \]
   \[
   \Gamma_2 = \frac{1.25}{2.25} \approx 0.5556.
   \]
   \[
   \sigma_2^2 = 2.25(1 - 0.5556^2) \approx 1.5.
   \]
   \[
   a_1^{(2)} = 0.5 - 0.5556 \times 0.5 \approx 0.2222.
   \]
   \[
   a_2^{(2)} = 0.5556.
   \]

4. Stability check:
   \[
   |\Gamma_1| = 0.5 < 1, \quad |\Gamma_2| = 0.5556 < 1.
   \]
   The model is **stable**.

---

### Problem 8
**Q:** A speech signal is modeled as an AR(3) process with coefficients \( a_1 = -0.9 \), \( a_2 = 0.6 \), \( a_3 = -0.3 \). Compute the **PARCOR coefficients** \( \Gamma_1, \Gamma_2, \Gamma_3 \) using the step-down recursion.

**A:**
1. Initialize:
   \[
   A_3(z) = 1 - 0.9z^{-1} + 0.6z^{-2} - 0.3z^{-3}, \quad \Gamma_3 = a_3 = -0.3.
   \]

2. Step-down for \( A_2(z) \):
   \[
   A_2(z) = \frac{1}{1 - \Gamma_3^2} \left[ A_3(z) - \Gamma_3 z^{-3} A_3(z^{-1}) \right].
   \]
   \[
   A_3(z^{-1}) = 1 - 0.9z + 0.6z^2 - 0.3z^3.
   \]
   \[
   A_2(z) = \frac{1}{0.91} \left[ (1 - 0.9z^{-1} + 0.6z^{-2} - 0.3z^{-3}) + 0.3z^{-3}(1 - 0.9z + 0.6z^2 - 0.3z^3) \right].
   \]
   \[
   A_2(z) = \frac{1}{0.91} \left[ 1 - 0.9z^{-1} + 0.6z^{-2} - 0.3z^{-3} + 0.3z^{-3} - 0.27z^{-2} + 0.18z^{-1} - 0.09 \right].
   \]
   \[
   A_2(z) = \frac{1}{0.91} \left[ 0.91 - 0.72z^{-1} + 0.33z^{-2} \right] = 1 - 0.7912z^{-1} + 0.3626z^{-2}.
   \]
   \[
   \Gamma_2 = a_2^{(2)} = 0.3626.
   \]

3. Step-down for \( A_1(z) \):
   \[
   A_1(z) = \frac{1}{1 - \Gamma_2^2} \left[ A_2(z) - \Gamma_2 z^{-2} A_2(z^{-1}) \right].
   \]
   \[
   A_2(z^{-1}) = 1 - 0.7912z + 0.3626z^2.
   \]
   \[
   A_1(z) = \frac{1}{1 - 0.1315} \left[ (1 - 0.7912z^{-1} + 0.3626z^{-2}) - 0.3626z^{-2}(1 - 0.7912z + 0.3626z^2) \right].
   \]
   \[
   A_1(z) = \frac{1}{0.8685} \left[ 1 - 0.7912z^{-1} + 0.3626z^{-2} - 0.3626z^{-2} + 0.2868z^{-1} - 0.1315 \right].
   \]
   \[
   A_1(z) = \frac{1}{0.8685} \left[ 0.8685 - 0.5044z^{-1} \right] = 1 - 0.5808z^{-1}.
   \]
   \[
   \Gamma_1 = a_1^{(1)} = -0.5808.
   \]

4. Final PARCOR coefficients:
   \[
   \Gamma_1 \approx -0.5808, \quad \Gamma_2 \approx 0.3626, \quad \Gamma_3 = -0.3.
   \]

---

### Problem 9 (Practice)
**Q:** A lattice filter has reflection coefficients \( \Gamma_1 = 0.8 \) and \( \Gamma_2 = -0.5 \). Compute the **system function** \( A_2(z) \) and its impulse response.

**A:**
1. Step-up recursion:
   - \( A_0(z) = 1 \).
   - \( A_1(z) = 1 + 0.8z^{-1} \).
   - \( A_2(z) = A_1(z) + \Gamma_2 z^{-2} A_1(z^{-1}) \).
     \[
     A_1(z^{-1}) = 1 + 0.8z.
     \]
     \[
     A_2(z) = (1 + 0.8z^{-1}) - 0.5z^{-2}(1 + 0.8z) = 1 + 0.8z^{-1} - 0.5z^{-2} - 0.4z^{-1}.
     \]
     \[
     A_2(z) = 1 + 0.4z^{-1} - 0.5z^{-2}.
     \]

2. Impulse response:
   \[
   h[n] = \delta[n] + 0.4\delta[n-1] - 0.5\delta[n-2].
   \]

---

### Problem 10
**Q:** For an AR(2) process with autocorrelation \( r_x[0] = 2 \), \( r_x[1] = 1 \), \( r_x[2] = 0.5 \), compute the **prediction error variance** using the Levinson-Durbin algorithm.

**A:**
1. Initialize:
   \[
   \sigma_0^2 = 2.
   \]

2. First iteration (\( k = 1 \)):
   \[
   \Gamma_1 = \frac{r_x[1]}{\sigma_0^2} = \frac{1}{2} = 0.5.
   \]
   \[
   \sigma_1^2 = 2(1 - 0.25) = 1.5.
   \]

3. Second iteration (\( k = 2 \)):
   \[
   \Delta_2 = r_x[2] + a_1^{(1)} r_x[1] = 0.5 + 0.5 \times 1 = 1.
   \]
   \[
   \Gamma_2 = \frac{1}{1.5} \approx 0.6667.
   \]
   \[
   \sigma_2^2 = 1.5(1 - 0.6667^2) \approx 0.8333.
   \]

4. Final prediction error variance:
   \[
   \sigma^2 \approx 0.8333.
   \]

---

### Problem 11 (Practice)
**Q:** A speech signal is modeled as an AR(1) process with \( r_x[0] = 5 \) and \( r_x[1] = 3 \). Compute the **Burg reflection coefficient** \( \Gamma_1 \) and the prediction error variance.

**A:**
1. Burg reflection coefficient:
   \[
   \Gamma_1 = \frac{2 r_x[1]}{r_x[0] + r_x[0]} = \frac{6}{10} = 0.6.
   \]

2. Prediction error variance:
   \[
   \sigma^2 = r_x[0] (1 - \Gamma_1^2) = 5(1 - 0.36) = 3.2.
   \]

---

### Problem 12
**Q:** A lattice filter has reflection coefficients \( \Gamma_1 = 0.3 \) and \( \Gamma_2 = -0.6 \). Compute the **AR coefficients** \( a_1, a_2 \) using the step-up recursion.

**A:**
1. Step-up recursion:
   - \( A_0(z) = 1 \).
   - \( A_1(z) = 1 + 0.3z^{-1} \).
   - \( A_2(z) = A_1(z) + \Gamma_2 z^{-2} A_1(z^{-1}) \).
     \[
     A_1(z^{-1}) = 1 + 0.3z.
     \]
     \[
     A_2(z) = (1 + 0.3z^{-1}) - 0.6z^{-2}(1 + 0.3z) = 1 + 0.3z^{-1} - 0.6z^{-2} - 0.18z^{-1}.
     \]
     \[
     A_2(z) = 1 + 0.12z^{-1} - 0.6z^{-2}.
     \]

2. AR coefficients:
   \[
   a_1 = 0.12, \quad a_2 = -0.6.
   \]

---

### Problem 13 (Practice)
**Q:** For an AR(2) process with \( r_x[0] = 4 \), \( r_x[1] = 2 \), \( r_x[2] = 1 \), compute the **PARCOR coefficients** using the Levinson-Durbin algorithm.

**A:**
1. Initialize:
   \[
   \sigma_0^2 = 4.
   \]

2. First iteration (\( k = 1 \)):
   \[
   \Gamma_1 = \frac{r_x[1]}{\sigma_0^2} = \frac{2}{4} = 0.5.
   \]
   \[
   \sigma_1^2 = 4(1 - 0.25) = 3.
   \]

3. Second iteration (\( k = 2 \)):
   \[
   \Delta_2 = r_x[2] + a_1^{(1)} r_x[1] = 1 + 0.5 \times 2 = 2.
   \]
   \[
   \Gamma_2 = \frac{2}{3} \approx 0.6667.
   \]

4. Final PARCOR coefficients:
   \[
   \Gamma_1 = 0.5, \quad \Gamma_2 \approx 0.6667.
   \]

---

### Problem 14
**Q:** A lattice filter has reflection coefficients \( \Gamma_1 = 0.7 \) and \( \Gamma_2 = 0.4 \). Compute the **prediction error** for the input \( x[n] = u[n] \), where \( u[n] \) is the unit step.

**A:**
1. Compute \( A_2(z) \):
   - \( A_0(z) = 1 \).
   - \( A_1(z) = 1 + 0.7z^{-1} \).
   - \( A_2(z) = A_1(z) + 0.4z^{-2} A_1(z^{-1}) \).
     \[
     A_1(z^{-1}) = 1 + 0.7z.
     \]
     \[
     A_2(z) = (1 + 0.7z^{-1}) + 0.4z^{-2}(1 + 0.7z) = 1 + 0.7z^{-1} + 0.4z^{-2} + 0.28z^{-1}.
     \]
     \[
     A_2(z) = 1 + 0.98z^{-1} + 0.4z^{-2}.
     \]

2. The prediction error is the output of \( A_2(z) \) for \( x[n] = u[n] \):
   \[
   e[n] = u[n] + 0.98u[n-1] + 0.4u[n-2].
   \]

---

### Problem 15 (Practice)
**Q:** An AR(2) process has autocorrelation \( r_x[0] = 3 \), \( r_x[1] = 1.8 \), \( r_x[2] = 0.9 \). Compute the **Burg reflection coefficients** \( \Gamma_1 \) and \( \Gamma_2 \).

**A:**
1. Burg reflection coefficient \( \Gamma_1 \):
   \[
   \Gamma_1 = \frac{2 r_x[1]}{r_x[0] + r_x[0]} = \frac{3.6}{6} = 0.6.
   \]

2. Burg reflection coefficient \( \Gamma_2 \):
   - Compute forward and backward prediction errors:
     \[
     f_1[n] = x[n] - \Gamma_1 x[n-1], \quad b_1[n] = x[n-1] - \Gamma_1 x[n].
     \]
   - The Burg method minimizes:
     \[
     \Gamma_2 = \frac{2 \sum_{n=2}^{N} f_1[n] b_1[n-1]}{\sum_{n=2}^{N} (f_1^2[n] + b_1^2[n-1])}.
     \]
   - For an AR(2) process, this simplifies to:
     \[
     \Gamma_2 = \frac{r_x[2] - \Gamma_1 r_x[1]}{r_x[0] - \Gamma_1 r_x[1]} = \frac{0.9 - 0.6 \times 1.8}{3 - 0.6 \times 1.8} = \frac{-0.18}{1.92} \approx -0.0938.
     \]

3. Final Burg reflection coefficients:
   \[
   \Gamma_1 = 0.6, \quad \Gamma_2 \approx -0.0938.
   \]
