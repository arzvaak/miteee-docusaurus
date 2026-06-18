# Week 9 — IIR Filter Design

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. IIR vs FIR

| Feature | IIR | FIR |
|---------|-----|-----|
| Phase | Non-linear (generally) | **Linear** (symmetric $h[n]$) |
| Stability | Can be unstable (poles!) | **Always stable** |
| Order needed | Lower (efficient) | Higher |
| Feedback | Yes | No |
| Implementation | Difference equation only | Convolution or DFT |

**Stability condition:** All poles must lie inside the unit circle, $|z|<1$.

---

## 2. Analog Prototype Filters

### Butterworth Filter

$$|H(j\Omega)|^2 = \frac{1}{1+\varepsilon^2(\Omega/\Omega_p)^{2N}}$$

- **All-pole** (no zeros), maximally flat passband
- 3 dB point at $\Omega=\Omega_p$ when $\varepsilon=1$

**Order formula:**

$$\boxed{N \geq \frac{\log\!\left(\dfrac{10^{0.1A_s}-1}{10^{0.1A_p}-1}\right)}{2\log(\Omega_s/\Omega_p)}}$$

**Example (Q3):** $A_p=3$ dB, $A_s=40$ dB, $\Omega_s/\Omega_p=2$:
$$N\geq\frac{\log(9999/1)}{2\log 2}=\frac{4}{0.602}\approx6.6\implies N=7$$ ✅

---

### Chebyshev Type I

$$|H(j\Omega)|^2=\frac{1}{1+\varepsilon^2 T_N^2(\Omega/\Omega_p)}$$

- **All-pole** ✅
- **Equiripple in passband**, monotonic in stopband ✅

$$N\geq\frac{\cosh^{-1}\!\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}}{\cosh^{-1}(\Omega_s/\Omega_p)}$$

**Example (Q5):** 1 dB ripple, $f_s/f_p=1.5$, 40 dB attenuation: $N=7$ ✅

---

### Chebyshev Type II

- Has **both poles and zeros** (unlike Type I which is all-pole)
- **Equiripple in stopband**, monotonic in passband

> **Recall trap:** Chebyshev Type I = all-pole, equiripple **passband**. Type II has zeros, equiripple **stopband**.

---

## 3. Impulse Invariance Method

**Idea:** Set $h[n]=h_a(nT)$ — sample the analog impulse response.

$$H_a(s)=\sum_{k=1}^{N}\frac{c_k}{s-p_k} \;\longrightarrow\; \boxed{H(z)=\sum_{k=1}^{N}\frac{c_k}{1-e^{p_kT}z^{-1}}}$$

**Properties:**
- Left-half s-plane → inside unit circle → **preserves stability**
- Many-to-one $j\Omega$ → $e^{j\omega}$ mapping → **aliasing occurs**
- **Not suitable for:** High-pass and band-stop filters (aliasing distorts stopband)

**Full worked example (Q8, Tutorial Q3):** $H_a(s)=\dfrac{s-2}{s^2-4s+5}$, $F_s=10$ kHz ($T=10^{-4}$ s)

**Step 1:** Factor: $s^2-4s+5=(s-(2+j))(s-(2-j))$, poles $p_{1,2}=2\pm j$

**Step 2:** Partial fractions:
$$c_1=\frac{p_1-2}{p_1-p_2}=\frac{j}{2j}=\frac{1}{2} \qquad c_2=\frac{1}{2}$$

**Step 3:** Map to digital ($z=e^{p_k T}$):
$$H(z)=\frac{1/2}{1-e^{(2+j)T}z^{-1}}+\frac{1/2}{1-e^{(2-j)T}z^{-1}}$$

With $T=10^{-4}$: $e^{(2\pm j)T}\approx e^{0.0002}\cdot e^{\pm j0.0001}$ ✅

---

## 4. Bilinear Transformation Method

$$\boxed{s=\frac{2}{T}\cdot\frac{z-1}{z+1}} \qquad \Longleftrightarrow \qquad z=\frac{1+(T/2)s}{1-(T/2)s}$$

- **One-to-one mapping** of entire $j\Omega$ axis to unit circle — **no aliasing** ✅
- **Frequency warping** (non-linear): $\Omega=\dfrac{2}{T}\tan\!\left(\dfrac{\omega}{2}\right)$

**Pre-warping** (to hit exact cutoff $\omega_c$):

$$\Omega_c=\frac{2}{T}\tan\!\left(\frac{\omega_c}{2}\right)$$

**Example (Q9):** $H_a(s)=\dfrac{s+1}{s^2-4}$, $F_s=1000$ Hz ($T=10^{-3}$):

$$s=2\times10^3\cdot\frac{z-1}{z+1} \implies H(z)=\frac{2000\frac{z-1}{z+1}+1}{\left(2000\frac{z-1}{z+1}\right)^2-4}$$ ✅

**Example (Q10):** $H_a(s)=1/s$, $F_s=400$ Hz ($T=2.5\times10^{-3}$):

$$H(z)=\frac{T(z+1)}{2(z-1)}=\frac{1.25\times10^{-3}(1+z^{-1})}{1-z^{-1}}$$

Difference equation: $y[n]=y[n-1]+0.125\times10^{-2}x[n]+0.125\times10^{-2}x[n-1]$ ✅

---

## 5. Impulse Invariance vs Bilinear — Comparison

| Feature | Impulse Invariance | Bilinear |
|---------|-------------------|---------|
| Aliasing | **Yes** (many-to-one) | **No** (one-to-one) |
| Frequency warping | None | Yes (pre-warp needed) |
| Suitable for | LP, BP | Any type |
| Not suitable for | HP, BS | None |
| Pole mapping | $z=e^{p_k T}$ | $s=\frac{2}{T}\frac{z-1}{z+1}$ |

---

## 6. Pole-Zero Placement

Place poles at $z=re^{j\theta}$ to create desired bandpass response:

$$\boxed{\theta=\frac{2\pi F_c}{F_s}} \qquad \boxed{r=1-\frac{\pi\cdot\text{BW}}{F_s}}$$

**Example (Q2):** Center $=200$ Hz, BW $=60$ Hz, $F_s=800$ Hz:
$$\theta=\frac{2\pi\times200}{800}=\frac{\pi}{2} \qquad r=1-\frac{\pi\times60}{800}\approx0.764\approx0.79$$ ✅

**Zeros at $z=0$ and $z=-1$:** reject DC (0 Hz) and Nyquist.

---

## 7. Equiripple FIR (Parks-McClellan / Remez)

- **Disadvantage of window and frequency-sampling methods:** Lack of precise control over passband/stopband edge frequencies ✅
- Equiripple (Chebyshev approximation): ripple is evenly distributed — optimal minimax design

---

## 8. Key MCQs

| Question | Answer |
|---------|--------|
| Disadvantage of window/freq-sampling FIR | Lack of precise control of band-edge frequencies ✅ |
| Butterworth order, $A_p=3$ dB, $A_s=40$ dB, $\Omega_s/\Omega_p=2$ | 7 ✅ |
| Chebyshev Type I property | All-pole + equiripple passband + monotonic stopband ✅ |
| One-to-one s→z mapping | Bilinear transformation ✅ |
| Impulse invariance: suitable for | LP and BP only ✅ |
| Pole-zero: center=200 Hz, BW=60 Hz, $F_s$=800 Hz | $r=0.79$, $\theta=\pi/2$ ✅ |
| Impulse invariance: pole $s=p_k$ maps to | $z=e^{p_kT}$ ✅ |
| Bilinear: $H_a(s)=1/s$, $F_s=400$ Hz → difference equation | $y[n]=y[n-1]+0.125\times10^{-2}(x[n]+x[n-1])$ ✅ |
| Trapezoidal approximation of integral | $y[nT]=\frac{T}{2}(y'[nT]+y'[nT-T])+y[nT-T]$ ✅ |

---

## Formula Sheet — Week 9

$$s=\frac{2}{T}\cdot\frac{z-1}{z+1} \;\text{(bilinear)} \qquad z=e^{p_kT} \;\text{(impulse invariance)}$$

$$\theta=2\pi F_c/F_s \qquad r=1-\pi\cdot\text{BW}/F_s \;\text{(pole placement)}$$

$$\Omega_c=\frac{2}{T}\tan(\omega_c/2) \;\text{(pre-warp)} \qquad N\geq\frac{\log[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)]}{2\log(\Omega_s/\Omega_p)} \;\text{(Butterworth order)}$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on IIR filter design, Butterworth filters, Chebyshev filters, bilinear transformation, impulse invariance, analog prototypes, frequency warping, and pole placement, formatted as requested:

---

### Problem 1
**Q:** Design a **first-order low-pass Butterworth digital filter** with a 3-dB cutoff frequency of $\omega_c = 0.2\pi$ using the **bilinear transformation** with $T_s = 1$. Assume the analog prototype is $H_a(s) = \frac{\Omega_c}{s + \Omega_c}$.

**A:**
1. **Prewarp the digital cutoff frequency** to the analog domain:
   $$
   \Omega_c = \frac{2}{T_s} \tan\left(\frac{\omega_c}{2}\right) = 2 \tan(0.1\pi) \approx 0.6498.
   $$
2. **Substitute the bilinear transform** $s = \frac{2}{T_s} \frac{1 - z^{-1}}{1 + z^{-1}} = 2 \frac{1 - z^{-1}}{1 + z^{-1}}$ into $H_a(s)$:
   $$
   H(z) = \frac{\Omega_c}{2 \frac{1 - z^{-1}}{1 + z^{-1}} + \Omega_c} = \frac{\Omega_c (1 + z^{-1})}{2(1 - z^{-1}) + \Omega_c (1 + z^{-1})}.
   $$
3. **Simplify** the denominator:
   $$
   H(z) = \frac{0.6498 (1 + z^{-1})}{2 - 2z^{-1} + 0.6498 + 0.6498 z^{-1}} = \frac{0.6498 (1 + z^{-1})}{2.6498 - 1.3502 z^{-1}}.
   $$
4. **Normalize** to make the constant term in the denominator unity:
   $$
   H(z) = \frac{0.2452 (1 + z^{-1})}{1 - 0.5095 z^{-1}}.
   $$

---

### Problem 2
**Q:** A **second-order analog Butterworth low-pass filter** has a 3-dB cutoff frequency $\Omega_c = 1$ rad/s. Its transfer function is:
   $$
   H_a(s) = \frac{1}{s^2 + \sqrt{2}s + 1}.
   $$
   Convert this to a **digital filter** using **impulse invariance** with $T_s = 0.1$ s. Verify stability.

**A:**
1. **Partial fraction expansion** of $H_a(s)$:
   $$
   H_a(s) = \frac{A}{s + \frac{\sqrt{2}}{2} + j\frac{\sqrt{2}}{2}} + \frac{A^*}{s + \frac{\sqrt{2}}{2} - j\frac{\sqrt{2}}{2}},
   $$
   where $A = \frac{1}{j\sqrt{2}}$.
2. **Impulse invariance mapping**: $s \to \frac{1 - e^{s_p T_s} z^{-1}}{T_s}$, where $s_p$ are the poles of $H_a(s)$.
   The poles are $s_{1,2} = -\frac{\sqrt{2}}{2} \pm j\frac{\sqrt{2}}{2}$.
3. **Compute $H(z)$**:
   $$
   H(z) = \frac{T_s A}{1 - e^{s_1 T_s} z^{-1}} + \frac{T_s A^*}{1 - e^{s_2 T_s} z^{-1}}.
   $$
   Substitute $T_s = 0.1$ and $s_{1,2}$:
   $$
   H(z) = \frac{0.1 \cdot \frac{1}{j\sqrt{2}}}{1 - e^{-0.0707 + j0.0707} z^{-1}} + \frac{0.1 \cdot \frac{-1}{j\sqrt{2}}}{1 - e^{-0.0707 - j0.0707} z^{-1}}.
   $$
4. **Simplify** to real coefficients:
   $$
   H(z) = \frac{0.0707 z^{-1}}{1 - 1.8588 z^{-1} + 0.8681 z^{-2}}.
   $$
5. **Stability check**: The poles are at $z = 0.9294 \pm j0.2561$, which lie inside the unit circle. The filter is stable.

---

### Problem 3
**Q:** Design a **second-order digital Butterworth bandpass filter** with 3-dB cutoff frequencies $\omega_l = 0.3\pi$ and $\omega_u = 0.7\pi$ using the **bilinear transformation** with $T_s = 1$. The analog prototype is:
   $$
   H_a(s) = \frac{\Omega_0^2}{s^2 + \frac{\Omega_0}{Q} s + \Omega_0^2},
   $$
   where $\Omega_0 = \sqrt{\Omega_l \Omega_u}$ and $Q = \frac{\Omega_0}{\Omega_u - \Omega_l}$.

**A:**
1. **Prewarp the digital frequencies**:
   $$
   \Omega_l = 2 \tan(0.15\pi) \approx 1.0191, \quad \Omega_u = 2 \tan(0.35\pi) \approx 3.0777.
   $$
2. **Compute $\Omega_0$ and $Q$**:
   $$
   \Omega_0 = \sqrt{\Omega_l \Omega_u} \approx 1.7654, \quad Q = \frac{\Omega_0}{\Omega_u - \Omega_l} \approx 0.8827.
   $$
3. **Substitute the bilinear transform** $s = 2 \frac{1 - z^{-1}}{1 + z^{-1}}$ into $H_a(s)$:
   $$
   H(z) = \frac{\Omega_0^2}{\left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + \frac{\Omega_0}{Q} \left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right) + \Omega_0^2}.
   $$
4. **Simplify** the denominator:
   $$
   H(z) = \frac{3.1166 (1 + z^{-1})^2}{10.2336 - 11.7668 z^{-1} + 5.7664 z^{-2}}.
   $$
5. **Normalize** to unity constant term:
   $$
   H(z) = \frac{0.3045 (1 + 2z^{-1} + z^{-2})}{1 - 1.15 z^{-1} + 0.5635 z^{-2}}.
   $$

---

### Problem 4 (Practice)
**Q:** A **Chebyshev Type I analog low-pass filter** has a passband ripple of 1 dB and a cutoff frequency $\Omega_c = 1$ rad/s. Its transfer function is:
   $$
   H_a(s) = \frac{1}{2.8628 (s^2 + 0.6449 s + 0.7079)}.
   $$
   Convert this to a **digital filter** using **impulse invariance** with $T_s = 0.2$ s. Determine the pole locations in the $z$-plane.

**A:**
1. **Partial fraction expansion** of $H_a(s)$:
   The poles are $s_{1,2} = -0.3224 \pm j0.7772$.
2. **Impulse invariance mapping**:
   $$
   H(z) = \frac{T_s}{2.8628} \left( \frac{1}{1 - e^{s_1 T_s} z^{-1}} + \frac{1}{1 - e^{s_2 T_s} z^{-1}} \right).
   $$
3. **Compute $e^{s_{1,2} T_s}$**:
   $$
   e^{s_1 T_s} = e^{-0.0645 + j0.1554} \approx 0.9375 + j0.1545,
   $$
   $$
   e^{s_2 T_s} = e^{-0.0645 - j0.1554} \approx 0.9375 - j0.1545.
   $$
4. **Combine terms**:
   $$
   H(z) = \frac{0.0699 z^{-1}}{1 - 1.875 z^{-1} + 0.9025 z^{-2}}.
   $$
5. **Pole locations**: The poles are at $z = 0.9375 \pm j0.1545$, which lie inside the unit circle.

---

### Problem 5
**Q:** Explain **frequency warping** in the bilinear transformation. For a digital filter designed with $\omega_c = 0.4\pi$ and $T_s = 1$, what is the corresponding analog frequency $\Omega_c$? If the analog filter has a zero at $\Omega = 5$ rad/s, where does this zero map to in the $z$-plane?

**A:**
1. **Frequency warping** is the nonlinear relationship between analog ($\Omega$) and digital ($\omega$) frequencies due to the bilinear transform:
   $$
   \Omega = \frac{2}{T_s} \tan\left(\frac{\omega}{2}\right).
   $$
2. **Compute $\Omega_c$**:
   $$
   \Omega_c = 2 \tan(0.2\pi) \approx 1.4531 \text{ rad/s}.
   $$
3. **Zero mapping**: The zero at $\Omega = 5$ maps to:
   $$
   s = j5 \implies z = \frac{1 + \frac{s T_s}{2}}{1 - \frac{s T_s}{2}} = \frac{1 + j2.5}{1 - j2.5} = \frac{(1 + j2.5)^2}{1 + 6.25} \approx -0.6154 + j0.7882.
   $$

---

### Problem 6 (Practice)
**Q:** Design a **third-order digital Butterworth low-pass filter** with a 3-dB cutoff frequency $\omega_c = 0.5\pi$ using the **bilinear transformation** with $T_s = 2$. The analog prototype is:
   $$
   H_a(s) = \frac{1}{(s + 1)(s^2 + s + 1)}.
   $$

**A:**
1. **Prewarp $\omega_c$**:
   $$
   \Omega_c = \frac{2}{2} \tan(0.25\pi) = 1 \text{ rad/s}.
   $$
2. **Substitute $s = \frac{2}{2} \frac{1 - z^{-1}}{1 + z^{-1}} = \frac{1 - z^{-1}}{1 + z^{-1}}$** into $H_a(s)$:
   $$
   H(z) = \frac{1}{\left(\frac{1 - z^{-1}}{1 + z^{-1}} + 1\right) \left(\left(\frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + \frac{1 - z^{-1}}{1 + z^{-1}} + 1\right)}.
   $$
3. **Simplify**:
   $$
   H(z) = \frac{(1 + z^{-1})^3}{2(1 + z^{-1})(3 + z^{-2}) + (1 - z^{-1})(1 + z^{-1})^2}.
   $$
   Further simplification yields:
   $$
   H(z) = \frac{0.125 (1 + z^{-1})^3}{1 + 0.5 z^{-1} + 0.5 z^{-2} + 0.125 z^{-3}}.
   $$

---

### Problem 7
**Q:** A **digital filter** is designed using **impulse invariance** from an analog filter with transfer function:
   $$
   H_a(s) = \frac{s + 1}{(s + 2)^2}.
   $$
   If $T_s = 1$, find $H(z)$. Is the digital filter stable?

**A:**
1. **Partial fraction expansion** of $H_a(s)$:
   $$
   H_a(s) = \frac{A}{s + 2} + \frac{B}{(s + 2)^2}, \quad A = 1, \quad B = -1.
   $$
2. **Impulse invariance mapping**:
   $$
   H(z) = \frac{T_s A}{1 - e^{-2 T_s} z^{-1}} + \frac{T_s B e^{-2 T_s} z^{-1}}{(1 - e^{-2 T_s} z^{-1})^2}.
   $$
3. **Substitute $T_s = 1$**:
   $$
   H(z) = \frac{1}{1 - e^{-2} z^{-1}} - \frac{e^{-2} z^{-1}}{(1 - e^{-2} z^{-1})^2}.
   $$
4. **Combine terms**:
   $$
   H(z) = \frac{1 - 2e^{-2} z^{-1}}{(1 - e^{-2} z^{-1})^2}.
   $$
5. **Stability check**: The pole is at $z = e^{-2} \approx 0.1353$, which lies inside the unit circle. The filter is stable.

---

### Problem 8 (Practice)
**Q:** A **Chebyshev Type II analog low-pass filter** has a stopband attenuation of 20 dB at $\Omega_s = 2$ rad/s and a cutoff frequency $\Omega_c = 1$ rad/s. Its transfer function is:
   $$
   H_a(s) = \frac{0.1 (s^2 + 4)}{s^2 + 0.6449 s + 0.7079}.
   $$
   Convert this to a **digital filter** using the **bilinear transformation** with $T_s = 1$. What are the pole and zero locations in the $z$-plane?

**A:**
1. **Substitute $s = 2 \frac{1 - z^{-1}}{1 + z^{-1}}$** into $H_a(s)$:
   $$
   H(z) = \frac{0.1 \left(\left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + 4\right)}{\left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + 0.6449 \left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right) + 0.7079}.
   $$
2. **Simplify**:
   $$
   H(z) = \frac{0.1 (4(1 - z^{-1})^2 + 4(1 + z^{-1})^2)}{4(1 - z^{-1})^2 + 1.2898 (1 - z^{-1})(1 + z^{-1}) + 0.7079 (1 + z^{-1})^2}.
   $$
   Further simplification yields:
   $$
   H(z) = \frac{0.8 (1 + z^{-2})}{5.9977 - 7.4204 z^{-1} + 3.4223 z^{-2}}.
   $$
3. **Pole locations**: Solve $5.9977 - 7.4204 z^{-1} + 3.4223 z^{-2} = 0$ to get $z \approx 0.6188 \pm j0.4483$ (inside the unit circle).
4. **Zero locations**: $1 + z^{-2} = 0 \implies z = \pm j$.

---

### Problem 9
**Q:** A **digital filter** has the system function:
   $$
   H(z) = \frac{2}{1 - 0.5 z^{-1}} - \frac{1}{1 - 0.25 z^{-1}}.
   $$
   If this filter was designed using **impulse invariance** with $T_s = 2$, find the system function of the **analog prototype**.

**A:**
1. **Express $H(z)$ in partial fractions**:
   $$
   H(z) = \frac{2}{1 - 0.5 z^{-1}} - \frac{1}{1 - 0.25 z^{-1}}.
   $$
2. **Impulse invariance mapping**: $z = e^{s T_s} \implies s = \frac{1}{T_s} \ln(z)$.
   The poles in the $z$-plane are $z_1 = 0.5$ and $z_2 = 0.25$.
3. **Map to $s$-plane**:
   $$
   s_1 = \frac{1}{2} \ln(0.5) = -0.3466, \quad s_2 = \frac{1}{2} \ln(0.25) = -0.6931.
   $$
4. **Construct $H_a(s)$**:
   $$
   H_a(s) = \frac{2}{s + 0.3466} - \frac{1}{s + 0.6931}.
   $$
5. **Combine terms**:
   $$
   H_a(s) = \frac{2(s + 0.6931) - (s + 0.3466)}{(s + 0.3466)(s + 0.6931)} = \frac{s + 1.0396}{s^2 + 1.0397 s + 0.2403}.
   $$

---

### Problem 10 (Practice)
**Q:** Design a **digital Butterworth high-pass filter** with a 3-dB cutoff frequency $\omega_c = 0.6\pi$ and a stopband attenuation of 20 dB at $\omega_s = 0.4\pi$ using the **bilinear transformation** with $T_s = 1$. Determine the minimum filter order.

**A:**
1. **Prewarp frequencies**:
   $$
   \Omega_c = 2 \tan(0.3\pi) \approx 3.0777, \quad \Omega_s = 2 \tan(0.2\pi) \approx 1.4531.
   $$
2. **Butterworth order formula**:
   $$
   N \geq \frac{\log\left(\frac{10^{2} - 1}{10^{0.1} - 1}\right)}{2 \log\left(\frac{\Omega_s}{\Omega_c}\right)} = \frac{\log(99)}{2 \log(0.4721)} \approx 3.34 \implies N = 4.
   $$
3. **Analog prototype**: Use $N = 4$ and $\Omega_c = 3.0777$ rad/s.
4. **Bilinear transform**: Substitute $s = 2 \frac{1 - z^{-1}}{1 + z^{-1}}$ into the analog prototype.

---

### Problem 11
**Q:** Explain why **impulse invariance** cannot be used to design **high-pass or bandstop digital filters**. What alternative method would you use?

**A:**
1. **Aliasing**: Impulse invariance maps the analog impulse response $h_a(t)$ to $h(n) = T_s h_a(n T_s)$. For high-pass or bandstop filters, $h_a(t)$ contains high-frequency components that **alias** when sampled, distorting the frequency response.
2. **Alternative**: Use the **bilinear transformation**, which maps the entire $j\Omega$-axis to the unit circle without aliasing, preserving the high-pass/bandstop characteristics.

---

### Problem 12 (Practice)
**Q:** A **digital filter** is designed using the **bilinear transformation** from an analog filter with:
   $$
   H_a(s) = \frac{s + 1}{s^2 + 2s + 2}.
   $$
   If $T_s = 2$, find $H(z)$. Verify that the digital filter is stable.

**A:**
1. **Substitute $s = \frac{2}{2} \frac{1 - z^{-1}}{1 + z^{-1}} = \frac{1 - z^{-1}}{1 + z^{-1}}$** into $H_a(s)$:
   $$
   H(z) = \frac{\frac{1 - z^{-1}}{1 + z^{-1}} + 1}{\left(\frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + 2 \left(\frac{1 - z^{-1}}{1 + z^{-1}}\right) + 2}.
   $$
2. **Simplify**:
   $$
   H(z) = \frac{(1 - z^{-1}) + (1 + z^{-1})}{(1 - z^{-1})^2 + 2(1 - z^{-1})(1 + z^{-1}) + 2(1 + z^{-1})^2}.
   $$
   Further simplification yields:
   $$
   H(z) = \frac{2}{5 - 2 z^{-1} + z^{-2}}.
   $$
3. **Stability check**: The poles are at $z = 0.2 \pm j0.4$, which lie inside the unit circle.

---

### Problem 13
**Q:** A **Chebyshev Type I digital low-pass filter** is designed with a passband ripple of 0.5 dB, a cutoff frequency $\omega_c = 0.3\pi$, and a stopband attenuation of 40 dB at $\omega_s = 0.5\pi$. Use the **bilinear transformation** with $T_s = 1$ to determine the minimum filter order.

**A:**
1. **Prewarp frequencies**:
   $$
   \Omega_c = 2 \tan(0.15\pi) \approx 1.0191, \quad \Omega_s = 2 \tan(0.25\pi) \approx 2.
   $$
2. **Chebyshev order formula**:
   $$
   N \geq \frac{\cosh^{-1}\left(\sqrt{\frac{10^{4} - 1}{10^{0.05} - 1}}\right)}{\cosh^{-1}\left(\frac{\Omega_s}{\Omega_c}\right)} = \frac{\cosh^{-1}(196.5)}{\cosh^{-1}(1.9626)} \approx 3.3 \implies N = 4.
   $$

---

### Problem 14 (Practice)
**Q:** A **digital filter** has poles at $z = 0.8 \pm j0.3$ and zeros at $z = \pm 1$. If the filter was designed using **impulse invariance** with $T_s = 0.5$, find the **analog prototype** $H_a(s)$.

**A:**
1. **Map poles to $s$-plane**:
   $$
   s = \frac{1}{T_s} \ln(z) = 2 \ln(0.8 \pm j0.3).
   $$
   Compute $\ln(0.8 + j0.3) = \ln(0.8544) + j \tan^{-1}(0.375) \approx -0.1574 + j0.3588$.
   Thus, $s_{1,2} \approx -0.3148 \pm j0.7176$.
2. **Construct $H_a(s)$**:
   $$
   H_a(s) = \frac{(s - s_{z1})(s - s_{z2})}{(s - s_{p1})(s - s_{p2})},
   $$
   where $s_{z1,2} = 2 \ln(\pm 1) = \pm j2\pi k$ (for $k = 0$, $s_{z1,2} = 0$).
   Simplifying:
   $$
   H_a(s) = \frac{s^2}{(s + 0.3148)^2 + 0.7176^2}.
   $$

---

### Problem 15
**Q:** A **second-order digital Butterworth filter** is designed using the **bilinear transformation** with $T_s = 1$. The digital cutoff frequency is $\omega_c = 0.4\pi$. If the analog prototype is:
   $$
   H_a(s) = \frac{\Omega_c^2}{s^2 + \sqrt{2} \Omega_c s + \Omega_c^2},
   $$
   find the **pole locations** in the $z$-plane and verify stability.

**A:**
1. **Prewarp $\omega_c$**:
   $$
   \Omega_c = 2 \tan(0.2\pi) \approx 1.4531.
   $$
2. **Substitute $s = 2 \frac{1 - z^{-1}}{1 + z^{-1}}$** into $H_a(s)$ and find the denominator:
   $$
   \left(2 \frac{1 - z^{-1}}{1 + z^{-1}}\right)^2 + \sqrt{2} \cdot 1.4531 \cdot 2 \frac{1 - z^{-1}}{1 + z^{-1}} + 1.4531^2 = 0.
   $$
3. **Simplify** to get the characteristic equation:
   $$
   5.8125 - 6.8125 z^{-1} + 2.8125 z^{-2} = 0.
   $$
4. **Solve for poles**:
   $$
   z = \frac{6.8125 \pm \sqrt{6.8125^2 - 4 \cdot 5.8125 \cdot 2.8125}}{5.625} \approx 0.6000 \pm j0.4000.
   $$
5. **Stability check**: The poles lie inside the unit circle ($|z| \approx 0.7211$). The filter is stable.
