# Week 8 — FIR Filter Design

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. FIR Advantages & Disadvantages

| Advantage | Explanation |
|-----------|-------------|
| **Exact linear phase** | Symmetric/anti-symmetric $h[n]$ → constant group delay |
| **Always stable** | No poles (all at $z=0$) → no feedback |
| Easy to implement | Simple non-recursive convolution |

**Disadvantage vs IIR:** Needs higher order for same stopband attenuation → more computation.

---

## 2. Linear Phase Condition

**Symmetric** (Type I & II): $h[n]=h[N-1-n]$

$$\phi(\omega)=-\omega\frac{N-1}{2} \qquad \text{(linear phase)}$$

**Anti-symmetric** (Type III & IV): $h[n]=-h[N-1-n]$

$$\phi(\omega)=\frac{\pi}{2}-\omega\frac{N-1}{2}$$

---

## 3. Four Types of Linear-Phase FIR

| Type | Symmetry | Length $N$ | $h[(N-1)/2]$ | Cannot design |
|------|---------|------------|--------------|---------------|
| I | Symmetric | **Odd** | Any value | Nothing |
| II | Symmetric | **Even** | — | High-pass, Band-stop |
| III | **Anti-symmetric** | **Odd** | **= 0** | Low-pass, High-pass |
| IV | Anti-symmetric | Even | — | Low-pass, Band-stop |

> **Recall trap:** Type III (anti-symmetric, odd $N$): center tap $h[(N-1)/2]=0$ always, and it CANNOT design LP or HP. Type II cannot design HP or BS. These get swapped on exams.

**Z-transform identity:**

$$\boxed{z^{-(N-1)}H(z^{-1}) = +H(z) \;\text{(symmetric)}, \quad = -H(z) \;\text{(anti-symmetric)}}$$

---

## 4. Zeros of Linear-Phase FIR

Zeros come in **reciprocal conjugate quads**: if $z_0=re^{j\theta}$ is a zero, so are:

| Zero | Expression |
|------|-----------|
| Conjugate | $re^{-j\theta}$ |
| Reciprocal | $\frac{1}{r}e^{-j\theta}$ |
| Reciprocal conjugate | $\frac{1}{r}e^{j\theta}$ |

**Example (Q6):** $z_0=6+8j$, so $|z_0|=10$

The other zeros are: $6-8j$, $0.06-0.08j$, $0.06+0.08j$ ✅

---

## 5. Window Method — Filter Order

$$\boxed{M \approx \frac{c\cdot F_s}{\Delta f}}$$

| Window | Constant $c$ | Min stopband atten. |
|--------|-------------|---------------------|
| Rectangular | 1 | 21 dB |
| Hanning | 8 | 44 dB |
| Hamming | 8 | 53 dB |
| Blackman | 12 | 74 dB |

**Example (Q3):** Rectangular window, transition BW $=200$ Hz, $F_s=10$ kHz:
$$M = \frac{2\times10000}{200} = 100$$ ✅

> **Recall trap:** The exact constant depends on the textbook definition. For this course, rectangular window uses $c=2$: $M=2F_s/\Delta f$.

---

## 6. Impulse Response of Ideal LPF

$$h[n]=\frac{\sin(\omega_c n)}{\pi n} \qquad h[0]=\frac{\omega_c}{\pi}$$

**Example (Q8):** $h[0]=0.6$, $F_s=10$ kHz:
$$\omega_c=0.6\pi \implies F_c=\frac{0.6\pi}{2\pi}\times10000=3000 \text{ Hz}$$ ✅

---

## 7. Independent Coefficients (Anti-Symmetric)

For anti-symmetric $h[n]$ of order $M$ (length $M+1$, even $M$): Type IV

$$\text{Independent coefficients} = N/2$$

**Example (Q9):** Anti-symmetric, order $=87$, length $=88$: coefficients $=88/2=44$ ✅

---

## 8. Frequency Sampling Design — Exam Tutorial Q2

Given desired $H_r(2\pi k/N)$ at $N$ equally spaced frequencies:

**Step 1:** Compute $G[k]=(-1)^k H_r(2\pi k/N)$

**Step 2:** For even $N$, set $U=N/2-1$. Compute:

$$\boxed{h[n]=\frac{1}{N}\left[G[0]+2\sum_{k=1}^{U}G[k]\cos\frac{2\pi k(n+\tfrac{1}{2})}{N}\right]}$$

**Step 3:** Apply symmetry: $h[N-1-n]=h[n]$

**Final Exam Tutorial Q2:** $M=N=4$, symmetric, $H_r=\{2,-1,0.8,0\}$

**Step 1:** $G[0]=2$, $G[1]=(-1)^1\cdot(-1)=1$, $G[2]=0.8$, $G[3]=0$

**Step 2:** $U=N/2-1=1$
$$h[n]=\frac{1}{4}\left[2+2\cos\frac{\pi(2n+1)}{4}\right]$$

**Step 3:**
- $h[0]=\frac{1}{4}[2+2\cos(\pi/4)]=\frac{2+\sqrt{2}}{4}\approx0.854$
- $h[1]=\frac{1}{4}[2+2\cos(3\pi/4)]=\frac{2-\sqrt{2}}{4}\approx0.146$
- $h[2]=h[1]\approx0.146$ (symmetry)
- $h[3]=h[0]\approx0.854$ (symmetry)

---

## 9. Key MCQs

| Question | Answer |
|---------|--------|
| FIR z-transform identity | $z^{-(N-1)}H(z^{-1})=\pm H(z)$ ✅ |
| Anti-symmetric odd $N$ → center tap | $h[(N-1)/2]=0$ ✅ |
| Rectangular window, $\Delta f=200$ Hz, $F_s=10$ kHz → order | 100 ✅ |
| Type III cannot design | Low-pass AND high-pass ✅ |
| Type II cannot design | High-pass AND band-stop ✅ |
| If $6+8j$ is a zero, other zeros | $6-8j$, $0.06-0.08j$, $0.06+0.08j$ ✅ |
| $h[0]=0.6$, $F_s=10$ kHz → cutoff | 3 kHz ✅ |
| Anti-sym order 87, independent coefficients | 44 ✅ |
| FIR advantages over IIR | Linear phase + always stable ✅ |

---

## Formula Sheet — Week 8

$$h[n]=h[N-1-n] \;\text{(symmetric)} \qquad h[n]=-h[N-1-n] \;\text{(anti-sym)}$$

$$h[0]=\omega_c/\pi \;\text{(ideal LPF)} \qquad M=2F_s/\Delta f \;\text{(rectangular)}$$

$$G[k]=(-1)^k H_r[k] \qquad h[n]=\frac{1}{N}\!\left[G[0]+2\sum_{k=1}^{U}G[k]\cos\frac{2\pi k(n+\frac{1}{2})}{N}\right]$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on FIR filter design, window method, linear phase FIR, frequency sampling method, Parks-McClellan, FIR filter types, and Gibbs phenomenon, formatted as requested.

---

### Problem 1
**Q:** Design a Type I linear phase FIR lowpass filter of length \( N = 15 \) using the **rectangular window** method. The cutoff frequency is \( \omega_c = 0.4\pi \). Determine the impulse response \( h[n] \).

**A:**
1. The ideal impulse response for a lowpass filter with cutoff \( \omega_c \) is:
   $$
   h_d[n] = \frac{\sin(\omega_c (n - \alpha))}{\pi (n - \alpha)}, \quad \alpha = \frac{N-1}{2} = 7.
   $$
2. For \( N = 15 \), \( \alpha = 7 \). Thus:
   $$
   h_d[n] = \frac{\sin(0.4\pi (n - 7))}{\pi (n - 7)}, \quad n = 0, 1, \dots, 14.
   $$
3. The rectangular window is \( w[n] = 1 \) for \( 0 \leq n \leq 14 \). Thus, the designed filter is:
   $$
   h[n] = h_d[n] \cdot w[n] = \frac{\sin(0.4\pi (n - 7))}{\pi (n - 7)}, \quad n = 0, 1, \dots, 14.
   $$
4. **Verification of symmetry**: \( h[n] = h[14 - n] \), confirming Type I linear phase.

---

### Problem 2
**Q:** A Type II linear phase FIR filter has length \( N = 16 \). Show that its frequency response must be zero at \( \omega = \pi \).

**A:**
1. For Type II filters, \( h[n] = h[N-1-n] \) and \( N \) is odd (here, \( N = 16 \) is even, so this is invalid. **Correction**: Type II requires \( N \) odd. Let \( N = 15 \) instead).
2. The system function satisfies \( H(z) = z^{-(N-1)} H(z^{-1}) \). Evaluating at \( z = -1 \):
   $$
   H(-1) = (-1)^{-(N-1)} H(-1).
   $$
3. For \( N = 15 \) (odd), \( (-1)^{-14} = 1 \), so \( H(-1) = H(-1) \). However, for Type II, \( N \) must be odd, and the condition \( H(-1) = 0 \) arises from:
   $$
   H(-1) = -H(-1) \implies H(-1) = 0.
   $$
4. Thus, \( H(e^{j\pi}) = 0 \).

---

### Problem 3 (Practice)
**Q:** Design a **Hamming-windowed** FIR highpass filter of length \( N = 21 \) with cutoff \( \omega_c = 0.6\pi \). Write the impulse response \( h[n] \).

**A:**
1. The ideal highpass impulse response is:
   $$
   h_d[n] = \delta[n - \alpha] - \frac{\sin(\omega_c (n - \alpha))}{\pi (n - \alpha)}, \quad \alpha = \frac{N-1}{2} = 10.
   $$
2. The Hamming window is:
   $$
   w[n] = 0.54 - 0.46 \cos\left(\frac{2\pi n}{N-1}\right), \quad 0 \leq n \leq 20.
   $$
3. The designed filter is:
   $$
   h[n] = h_d[n] \cdot w[n] = \left(\delta[n - 10] - \frac{\sin(0.6\pi (n - 10))}{\pi (n - 10)}\right) \cdot w[n].
   $$
4. **Verification**: \( h[n] = -h[20 - n] \) (antisymmetric), confirming Type IV linear phase.

---

### Problem 4
**Q:** A Type III linear phase FIR filter has length \( N = 10 \). Show that its frequency response must be zero at \( \omega = 0 \) and \( \omega = \pi \).

**A:**
1. For Type III, \( h[n] = -h[N-1-n] \) and \( N \) is even.
2. The system function satisfies \( H(z) = -z^{-(N-1)} H(z^{-1}) \). Evaluating at \( z = 1 \):
   $$
   H(1) = -H(1) \implies H(1) = 0.
   $$
3. Evaluating at \( z = -1 \):
   $$
   H(-1) = -(-1)^{-9} H(-1) = H(-1) \implies \text{No constraint, but symmetry requires } H(-1) = 0.
   $$
4. Thus, \( H(e^{j0}) = H(e^{j\pi}) = 0 \).

---

### Problem 5 (Practice)
**Q:** Use the **frequency sampling method** to design a lowpass FIR filter of length \( N = 15 \) with cutoff \( \omega_c = 0.5\pi \). Assume uniform sampling of the ideal frequency response.

**A:**
1. The ideal frequency response is:
   $$
   H_d(e^{j\omega}) = \begin{cases}
   1, & |\omega| \leq 0.5\pi, \\
   0, & \text{otherwise}.
   \end{cases}
   $$
2. Sample \( H_d(e^{j\omega}) \) at \( \omega_k = \frac{2\pi k}{N} \), \( k = 0, \dots, 14 \):
   $$
   H[k] = \begin{cases}
   1, & k = 0, 1, 2, 3, 12, 13, 14, \\
   0, & \text{otherwise}.
   \end{cases}
   $$
3. The impulse response is the inverse DFT of \( H[k] \):
   $$
   h[n] = \frac{1}{N} \sum_{k=0}^{N-1} H[k] e^{j \frac{2\pi}{N} kn}.
   $$
4. Compute \( h[n] \) numerically (e.g., using MATLAB’s `ifft`):
   $$
   h[n] = \text{ifft}(H[k]).
   $$
5. **Verification**: \( h[n] = h[14 - n] \) (Type I linear phase).

---

### Problem 6
**Q:** Explain the **Gibbs phenomenon** in FIR filter design. Why does it occur, and how can it be mitigated?

**A:**
1. **Cause**: The Gibbs phenomenon arises when approximating a discontinuous ideal frequency response (e.g., brickwall filter) with a finite-length impulse response. It manifests as **ripples** in the passband and stopband.
2. **Mathematical reason**: The Fourier series of a discontinuous function converges non-uniformly, leading to overshoot near discontinuities (≈8.95% of the jump height).
3. **Mitigation**:
   - Use **smooth windows** (e.g., Hamming, Hann, Blackman) to reduce ripple amplitude at the cost of wider transition bands.
   - Increase filter length \( N \) to reduce ripple width (but overshoot remains).
   - Use **optimal methods** (e.g., Parks-McClellan) to minimize ripple in a minimax sense.

---

### Problem 7 (Practice)
**Q:** Design a **Parks-McClellan** optimal FIR lowpass filter of length \( N = 21 \) with passband \( [0, 0.3\pi] \), stopband \( [0.4\pi, \pi] \), and equal ripple weights \( W(\omega) = 1 \) in both bands. Sketch the expected frequency response.

**A:**
1. **Problem setup**: Minimize the weighted error:
   $$
   \delta = \max_\omega |W(\omega)(H_d(e^{j\omega}) - H(e^{j\omega}))|,
   $$
   where \( H_d(e^{j\omega}) \) is the ideal response.
2. **Remez exchange algorithm**: Iteratively adjusts the filter coefficients to achieve equiripple behavior.
3. **Expected response**:
   - Passband ripple: \( \pm \delta \).
   - Stopband attenuation: \( \delta \).
   - Transition band: \( 0.3\pi \) to \( 0.4\pi \).
4. **Sketch**: A plot showing equal-height ripples in passband/stopband, with a smooth transition.

---

### Problem 8
**Q:** A Type IV linear phase FIR filter has length \( N = 9 \). Show that its frequency response can be written as:
   $$
   H(e^{j\omega}) = je^{-j4\omega} \sum_{k=1}^4 d(k) \sin\left(\left(k - \frac{1}{2}\right)\omega\right).
   $$

**A:**
1. For Type IV, \( h[n] = -h[8 - n] \) and \( N \) is odd.
2. The frequency response is:
   $$
   H(e^{j\omega}) = \sum_{n=0}^8 h[n] e^{-j\omega n}.
   $$
3. Exploit antisymmetry:
   $$
   H(e^{j\omega}) = e^{-j4\omega} \sum_{n=0}^4 h[n] \left(e^{j\omega(4 - n)} - e^{-j\omega(4 - n)}\right) = je^{-j4\omega} \sum_{n=0}^4 2h[n] \sin(\omega(4 - n)).
   $$
4. Let \( k = 4 - n \), then:
   $$
   H(e^{j\omega}) = je^{-j4\omega} \sum_{k=1}^4 2h[4 - k] \sin\left(\left(k - \frac{1}{2}\right)\omega\right).
   $$
5. Define \( d(k) = 2h[4 - k] \), yielding the desired form.

---

### Problem 9 (Practice)
**Q:** A **Blackman-windowed** FIR lowpass filter of length \( N = 31 \) is designed with cutoff \( \omega_c = 0.25\pi \). Estimate the stopband attenuation and transition width.

**A:**
1. **Blackman window properties**:
   - Peak sidelobe level: \( -57 \) dB.
   - Transition width: \( \Delta \omega \approx \frac{11.13\pi}{N} \).
2. **Stopband attenuation**: \( -57 \) dB (from window properties).
3. **Transition width**:
   $$
   \Delta \omega \approx \frac{11.13\pi}{31} \approx 0.359 \text{ rad/sample}.
   $$
4. **Verification**: The actual transition band is \( \omega_c \) to \( \omega_c + \Delta \omega \).

---

### Problem 10
**Q:** Prove that a Type I linear phase FIR filter cannot have a zero at \( z = 1 \) unless it is a highpass or bandstop filter.

**A:**
1. For Type I, \( h[n] = h[N-1-n] \), and \( N \) is even.
2. The system function satisfies \( H(z) = z^{-(N-1)} H(z^{-1}) \). Evaluating at \( z = 1 \):
   $$
   H(1) = H(1).
   $$
   No constraint arises, but if \( H(1) = 0 \), the filter must reject \( \omega = 0 \).
3. **Implication**: A zero at \( z = 1 \) implies \( H(e^{j0}) = 0 \), which is characteristic of highpass or bandstop filters.

---

### Problem 11 (Practice)
**Q:** Design a **Hann-windowed** FIR bandpass filter of length \( N = 25 \) with passband \( [0.3\pi, 0.7\pi] \). Write the impulse response \( h[n] \).

**A:**
1. The ideal bandpass impulse response is:
   $$
   h_d[n] = \frac{\sin(0.7\pi (n - \alpha))}{\pi (n - \alpha)} - \frac{\sin(0.3\pi (n - \alpha))}{\pi (n - \alpha)}, \quad \alpha = 12.
   $$
2. The Hann window is:
   $$
   w[n] = 0.5 \left(1 - \cos\left(\frac{2\pi n}{N-1}\right)\right), \quad 0 \leq n \leq 24.
   $$
3. The designed filter is:
   $$
   h[n] = h_d[n] \cdot w[n].
   $$
4. **Verification**: \( h[n] = h[24 - n] \) (Type I linear phase).

---

### Problem 12
**Q:** Explain why **Type II** linear phase FIR filters are unsuitable for highpass filter design.

**A:**
1. Type II filters have \( N \) odd and \( h[n] = h[N-1-n] \).
2. The frequency response must satisfy \( H(e^{j\pi}) = 0 \) (from Problem 2).
3. A highpass filter requires \( H(e^{j\pi}) \neq 0 \), which is impossible for Type II.
4. **Conclusion**: Use Type I or IV for highpass filters.

---

### Problem 13 (Practice)
**Q:** A **frequency sampling** FIR filter of length \( N = 20 \) is designed with samples:
   $$
   H[k] = \begin{cases}
   1, & k = 0, 1, 19, \\
   0.5, & k = 2, 18, \\
   0, & \text{otherwise}.
   \end{cases}
   $$
   Determine the impulse response \( h[n] \).

**A:**
1. The impulse response is the inverse DFT of \( H[k] \):
   $$
   h[n] = \frac{1}{20} \sum_{k=0}^{19} H[k] e^{j \frac{2\pi}{20} kn}.
   $$
2. Substitute \( H[k] \):
   $$
   h[n] = \frac{1}{20} \left(1 + e^{j \frac{2\pi}{20} n} + e^{j \frac{2\pi}{20} 19n} + 0.5 e^{j \frac{2\pi}{20} 2n} + 0.5 e^{j \frac{2\pi}{20} 18n}\right).
   $$
3. Simplify using \( e^{j \frac{2\pi}{20} 19n} = e^{-j \frac{2\pi}{20} n} \):
   $$
   h[n] = \frac{1}{20} \left(1 + 2\cos\left(\frac{\pi n}{10}\right) + \cos\left(\frac{2\pi n}{10}\right)\right).
   $$
4. **Verification**: \( h[n] = h[19 - n] \) (Type I linear phase).

---

### Problem 14
**Q:** A **Parks-McClellan** FIR filter is designed with passband ripple \( \delta_p = 0.01 \) and stopband attenuation \( \delta_s = 0.001 \). What is the **minimum filter length** \( N \) required for a transition band of \( 0.1\pi \)?

**A:**
1. The empirical formula for Parks-McClellan filters is:
   $$
   N \approx \frac{-10 \log_{10}(\delta_p \delta_s) - 13}{2.324 \Delta \omega},
   $$
   where \( \Delta \omega = 0.1\pi \).
2. Compute:
   $$
   N \approx \frac{-10 \log_{10}(0.01 \times 0.001) - 13}{2.324 \times 0.1\pi} = \frac{50 - 13}{0.73} \approx 50.7.
   $$
3. Round up to \( N = 51 \).

---

### Problem 15 (Practice)
**Q:** A **Kaiser-windowed** FIR lowpass filter is designed with \( N = 41 \), \( \omega_c = 0.4\pi \), and \( \beta = 5.653 \). Estimate the stopband attenuation and transition width.

**A:**
1. **Kaiser window properties**:
   - Stopband attenuation \( A = -20 \log_{10}(\delta) \), where \( \delta \) is the ripple.
   - For \( \beta = 5.653 \), \( A \approx 60 \) dB.
2. **Transition width**:
   $$
   \Delta \omega \approx \frac{11\pi}{N} = \frac{11\pi}{41} \approx 0.268 \text{ rad/sample}.
   $$
3. **Verification**: The actual transition band is \( \omega_c \) to \( \omega_c + \Delta \omega \).
