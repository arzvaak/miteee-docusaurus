# DSP Final Exam — Master Summary & Strategy

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

**Exam structure:** 3 sections — Sections 1 & 2 recall MCQs, Section 3 mathematical problems.
**Final Exam Tutorial topics:** Circular convolution, FIR frequency sampling, IIR impulse invariance, sampling system, multirate, LPC PARCOR, multirate structures.

---

## 1. Week 1 — Sampling & Digitization

| Formula | Use |
|---------|-----|
| $F_s\geq2F_{\max}$ | Minimum sampling rate |
| $\omega=2\pi F/F_s$ | Analog → digital frequency |
| $F=\omega F_s/2\pi$ | Digital → analog frequency |
| $\text{Bits}=\lceil\log_2((x_{\max}-x_{\min})/\Delta)\rceil$ | Quantization bits |
| $F_{\text{alias}}=|F-kF_s|$ | Aliased frequency when $F>F_s/2$ |

**Multi-dimensional:** Static image, HD video (NOT stereo audio — that is multi-channel)

---

## 2. Week 2 — System Properties

| System | Linear? | Causal? | Time-Invariant? |
|--------|---------|---------|----------------|
| $y[n]=2x[n]-3x[n-1]$ | ✅ | ✅ | ✅ |
| $y[n]=x^2[n]$ | ❌ | ✅ | ✅ |
| $y[n]=x[n+1]$ | ✅ | ❌ | ✅ |
| $y[n]=nx[n]$ | ✅ | ✅ | ❌ (time-varying!) |

- Series LTI: $h=h_1*h_2$ — Parallel LTI: $h=h_1+h_2$
- Accumulator output for $x[n]=nu[n]$: $y[n]=n(n+1)/2$
- Pitch: $F_0=F_s/\tau_{\text{peak}}$

---

## 3. Week 3 — Z-Transform

| Key Pair | $X(z)$ | ROC |
|---------|--------|-----|
| $\delta[n-k]$ | $z^{-k}$ | All $z\neq0$ |
| $u[n]$ | $z/(z-1)$ | $|z|>1$ |
| $a^n u[n]$ | $z/(z-a)$ | $|z|>|a|$ |

- Initial value: $x[0]=\lim_{z\to\infty}X(z)$
- **Anti-causal finite ROC:** entire z-plane except $z=\infty$ ← common trap!
- $Y(z)=X(-z)\Rightarrow y[n]=(-1)^n x[n]$ (NOT $x[-n]$)

---

## 4. Weeks 4–5 — DFT

| Property | Formula |
|----------|---------|
| DFT | $X[k]=\sum_{n=0}^{N-1}x[n]W_N^{nk}$ |
| IDFT | $x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]W_N^{-nk}$ |
| Conjugate symmetry | $X[N-k]=X^*[k]$ for real $x[n]$ |
| Periodicity | $X[k]=X[k+N]$ |
| Freq resolution | $\Delta f=F_s/N$ |
| DFT complexity | $N^2$ multiplications |

- Real odd → DFT purely imaginary
- Real even → DFT purely real

---

## 5. Weeks 6–7 — Spectral Analysis & FFT

| Window | Frequency Resolution |
|--------|---------------------|
| **Rectangular** | **Best** (narrowest main lobe) |
| Blackman | Worst (widest) |

- DCT beats DFT for energy compaction; 2D DCT = image compression standard
- FFT: $\frac{N}{2}\log_2 N$ multiplications, $N\log_2 N$ additions
- **DIT FFT:** bit-reversed input, normal output
- **DIF FFT:** normal input, bit-reversed output

**Divide-and-Conquer ($N=ML$):** Store row-wise → $M$-pt DFT rows → twiddle → $L$-pt DFT columns → read column-wise

---

## 6. Week 8 — FIR Filter Design

| Type | Symmetry | $N$ | Cannot design |
|------|---------|-----|---------------|
| I | Sym | Odd | Nothing |
| II | Sym | Even | HP, BS |
| III | Anti-sym | **Odd** | **LP, HP** |
| IV | Anti-sym | Even | LP, BS |

- $h[(N-1)/2]=0$ for **Type III** (anti-sym, odd $N$)
- Zeros in reciprocal conjugate quads: $z_0=re^{j\theta}$ → also $re^{-j\theta}$, $\frac{1}{r}e^{\pm j\theta}$
- $h[0]=\omega_c/\pi$ for ideal LPF
- FIR advantages: **linear phase** + **always stable**

---

## 7. Week 9 — IIR Filter Design

| Method | Aliasing | One-to-one | Use for |
|--------|----------|------------|---------|
| Impulse Invariance | **Yes** | No | LP, BP only |
| Bilinear | **No** | **Yes** | Any |

- Bilinear: $s=\frac{2}{T}\frac{z-1}{z+1}$
- Impulse invariance: pole $s=p_k\to z=e^{p_kT}$
- Butterworth = all-pole, maximally flat
- Chebyshev I = all-pole, equiripple passband, monotonic stopband
- Chebyshev II = poles+zeros, monotonic passband, equiripple stopband
- Pole stability: all poles inside unit circle $|z|<1$
- Pole placement: $\theta=2\pi F_c/F_s$, $r=1-\pi\cdot\text{BW}/F_s$

---

## 8. Week 10 — LPC

| Formula | Meaning |
|---------|---------|
| $e^0[m]=x[m]$ | Initial prediction error = input |
| $e^i[m]=e^{i-1}[m]-k_i b^{i-1}[m-1]$ | Forward error recursion |
| $b^i[m]=b^{i-1}[m-1]-k_i e^{i-1}[m]$ | Backward error recursion |
| $E^i=E^{i-1}(1-k_i^2)$ | Energy recursion |
| $p=F_s/1000$ | LPC order for speech |
| $|k_i|\leq1$ | Stability condition |

- AR = poles only; MA = zeros only; ARMA = both
- Min MSE: $E_{\min}=R[0]-\sum\alpha_k R[k]$

---

## 9. Weeks 11–12 — Multirate

| Formula | Meaning |
|---------|---------|
| $y[n]=x[Mn]$ | Decimation by $M$ |
| $v[m]=x[m/L]$ if $L\|m$, else 0 | Interpolation by $L$ |
| $I/D=F_{\text{out}}/F_{\text{in}}$ | Fractional rate conversion |
| $\omega_c=\pi/\max(I,D)$ | Combined LPF cutoff |
| $L-1$ | Zeros inserted when interpolating by $L$ |

- Downsampling: **anti-aliasing** filter before
- Upsampling: **anti-imaging** filter after
- $F_{\text{out}}<F_{\text{in}}$: LPF is anti-aliasing
- $F_{\text{out}}>F_{\text{in}}$: LPF is anti-imaging
- Multistage: reduced computation + fewer coefficients

---

## 10. Final Exam Tutorial — Worked Solutions

### Q1: Circular Convolution ($N=4$)

**Given:** $x_1=\{1,2,0,1\}$, $x_2=\{4,0,2,2\}$

$$x_3[m]=\sum_{n=0}^{3}x_1[n]\,x_2[(m-n)_4]$$

- $x_3[0]=1\cdot4+2\cdot2+0\cdot2+1\cdot0=8$
- $x_3[1]=1\cdot0+2\cdot4+0\cdot2+1\cdot2=10$
- $x_3[2]=1\cdot2+2\cdot0+0\cdot4+1\cdot2=4$
- $x_3[3]=1\cdot2+2\cdot2+0\cdot0+1\cdot4=10$

$$\boxed{x_3=\{8,10,4,10\}}$$

---

### Q2: FIR Frequency Sampling ($N=4$, symmetric)

**Given:** $H_r=\{2,-1,0.8,0\}$, $M=N=4$

**Step 1:** $G[k]=(-1)^k H_r[k]$: $G=\{2,1,0.8,0\}$

**Step 2:** $U=N/2-1=1$
$$h[n]=\frac{1}{4}\!\left[2+2\cos\frac{\pi(2n+1)}{4}\right]$$

**Step 3:**
- $h[0]=\frac{2+\sqrt{2}}{4}\approx0.854$
- $h[1]=\frac{2-\sqrt{2}}{4}\approx0.146$
- $h[2]=h[1]\approx0.146$, $\;h[3]=h[0]\approx0.854$

---

### Q3: IIR Impulse Invariance

**Given:** $H_a(s)=\dfrac{s-2}{s^2-4s+5}$, $F_s=10$ kHz ($T=10^{-4}$)

**Step 1:** Poles: $p_{1,2}=2\pm j$

**Step 2:** Residues: $c_1=c_2=\frac{1}{2}$

**Step 3:**
$$H(z)=\frac{0.5}{1-e^{(2+j)T}z^{-1}}+\frac{0.5}{1-e^{(2-j)T}z^{-1}}$$

---

### Q6: LPC PARCOR — $k_1$ from $x[n]=\{1,2,0,3\}$

**Step 1:** $e^0=b^0=\{1,2,0,3\}$

**Step 2:** Numerator $=2\cdot1+0\cdot2+3\cdot0=2$; denominator $=\sqrt{13\times5}=\sqrt{65}$

$$k_1=\frac{2}{\sqrt{65}}\approx0.248$$

**Step 3:** Apply recursion to get $e^1$, $b^1$, then repeat for $k_2$.

---

### Q7: Multirate Structure — $v[m]$ expression

For upsampling by 5 (from Week 11 Q5):
$$v[m]=\begin{cases}x[m/5] & m=0,\pm5,\pm10,\ldots \\ 0 & \text{else}\end{cases}$$ ✅

---

## 11. Common Exam Traps

1. **Anti-causal finite ROC:** Entire z-plane except $z=\infty$ (NOT $z=0$!)
2. **$Y(z)=X(-z)$:** $y[n]=(-1)^n x[n]$, NOT $x[-n]$
3. **Circular even test:** Check $x[n]=x[N-n]$ using modular arithmetic
4. **DFT bin frequency:** $F=k\cdot F_s/N$
5. **Bilinear vs Impulse invariance:** Bilinear = no aliasing; II = aliasing
6. **FIR Type III:** CANNOT design LP or HP (only BP or BS)
7. **LPF cutoff fractional conversion:** $\pi/\max(I,D)$, not $\pi/\min(I,D)$
8. **Zeros in interpolation by $L$:** $L-1$ zeros inserted, not $L$
9. **Anti-aliasing filter:** Before decimation. Anti-imaging: after upsampling.
10. **PARCOR initial condition:** $e^0[m]=x[m]$ — the input itself

---

## 12. Exam Priority Checklist

### High Priority — Mathematical Problems

- [ ] Circular convolution (N-point matrix method)
- [ ] FIR frequency sampling design → $h[n]$ coefficients
- [ ] IIR impulse invariance → $H(z)$ from $H_a(s)$
- [ ] LPC: compute $k_1$, $k_2$ from input signal
- [ ] Multirate: find output for given input
- [ ] Energy recursion for PARCOR

### Medium Priority — MCQ + Short Answer

- [ ] Butterworth/Chebyshev filter order
- [ ] FFT butterfly count ($N/2\log_2 N$)
- [ ] FIR filter order (window method)
- [ ] Bilinear transformation step-through
- [ ] Pole-zero placement ($r$ and $\theta$)

### Recall MCQs

- [ ] All system properties (linear/causal/stable/time-invariant)
- [ ] Window functions (rectangular = best freq resolution)
- [ ] AR/MA/ARMA model definitions
- [ ] DIT vs DIF FFT (bit-reversed input vs output)
- [ ] Sampling theorem, aliasing, quantization
