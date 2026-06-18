# DSP — Course Overview

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

A 12-week NPTEL course on digital signal processing. The course builds from first principles — what a signal is, how to sample it without losing information — through the mathematical machinery of the Z-transform and DFT, into practical filter design (FIR and IIR), speech modelling with LPC, and finally multirate systems for rate conversion. Every topic links to the one before it.

---

## Week 1 — Sampling & Digitization

The bridge between the analog world and the digital one. Everything in DSP rests on this week.

### 1.1 Signal Classification

Signals are classified along two axes — time and amplitude — giving four combinations. **Continuous-time, continuous-amplitude** signals are what the physical world produces (voltages, pressures, temperatures). **Discrete-time, discrete-amplitude** (digital) signals are what computers process. ADC converts between them.

A second classification axis is spatial dimensionality:

| Category | Examples | Key distinction |
|----------|---------|----------------|
| **Multi-dimensional** | Static image (2D: $x, y$), HD video (3D: $x, y, t$) | Two or more independent variables |
| **Multi-channel** | Stereo audio (left + right) | Multiple 1-D signals, NOT multiple independent variables |

> **Recall trap:** Stereo audio is multi-channel, NOT multi-dimensional. A static image IS multi-dimensional.

### 1.2 Nyquist Sampling Theorem

To reconstruct a bandlimited signal perfectly, you must sample at **at least twice the highest frequency**:

$$\boxed{F_s \geq 2F_{\max}}$$

The minimum acceptable rate $F_s = 2F_{\max}$ is called the **Nyquist rate**. The **Nyquist frequency** is $F_s/2$ — the highest frequency the sampled system can represent.

### 1.3 Analog ↔ Digital Frequency Conversion

When a continuous-time sinusoid $x_a(t) = A\cos(2\pi F_0 t)$ is sampled at $F_s$:

$$x[n] = x_a(nT_s) = A\cos\!\left(\frac{2\pi F_0}{F_s}\,n\right) = A\cos(\omega_0\,n)$$

The **normalized digital frequency** is:

$$\boxed{\omega_0 = \frac{2\pi F_0}{F_s}} \quad \text{(radians/sample)}$$

Going the other direction — given a digital sinusoid $x[n] = A\cos(\omega_0 n)$ played back at $F_s$:

$$\boxed{F_{\text{analog}} = \frac{\omega_0}{2\pi} \cdot F_s}$$

### 1.4 Aliasing

When $F_0 > F_s/2$, the sampled signal is indistinguishable from a lower-frequency alias. The alias frequency is:

$$F_{\text{alias}} = \left|F_0 - k F_s\right| \quad \text{for the integer } k \text{ that brings the result into } [0, F_s/2]$$

**Example:** $x_a(t) = 10\sin(320\pi t) + 4\cos(500\pi t)$, $F_s = 400$ Hz

- $F_1 = 160$ Hz $< 200$ Hz → passes through unchanged, $\omega_1 = 4\pi/5$
- $F_2 = 250$ Hz $> 200$ Hz → aliases to $|250 - 400| = 150$ Hz, $\omega_2 = 3\pi/4$

Result: $x[n] = 10\sin\!\left(\tfrac{4\pi}{5}n\right) + 4\cos\!\left(\tfrac{3\pi}{4}n\right)$

### 1.5 Quantization

Amplitude is rounded to the nearest discrete level. Given a signal range $[x_{\min}, x_{\max}]$ and step size $\Delta$:

$$\text{Levels} = \frac{x_{\max} - x_{\min}}{\Delta} \qquad \text{Bits} = \left\lceil\log_2(\text{Levels})\right\rceil$$

**Example:** $x[n] = 6.35\cos(\pi n/5)$, $\Delta = 0.01$ → range = 12.70, levels = 1270, bits = **11**

### 1.6 Bit Rate and Storage

$$\text{File size (bytes)} = \frac{F_s \times \text{duration (s)} \times \text{bits per sample}}{8}$$

**Example:** 2 sec, 32 kB file, 16-bit → $F_s = (32\times10^3\times8)/(2\times16) = 8000$ Hz

### 1.7 ADC → DSP → DAC System

A typical signal processing pipeline samples at $F_s$, processes digitally, then reconstructs at the same $F_s$ through a DAC and output low-pass filter (cutoff $F_s/2$). Components above $F_s/2$ either alias onto lower frequencies or are filtered out. Multiple aliased components at the same output frequency add coherently.

**Example:** $x_a(t) = 5\cos(100\pi t)+6\cos(300\pi t)$, $F_s = 200$ Hz — both components alias to 50 Hz and add: $y_a(t) = 11\cos(100\pi t)$

---

## Week 2 — Discrete-Time Signals & LTI Systems

Defines the vocabulary for everything that follows — signal operations, system properties, and the convolution sum that characterises every LTI system.

### 2.1 Elementary Discrete-Time Signals

| Signal | Definition | Key property |
|--------|-----------|-------------|
| Unit impulse $\delta[n]$ | 1 at $n=0$, 0 elsewhere | **Sifting:** $\sum_k x[k]\delta[n-k] = x[n]$ |
| Unit step $u[n]$ | 1 for $n\geq0$, 0 for $n<0$ | $\delta[n] = u[n]-u[n-1]$ |
| Unit ramp $r[n]$ | $nu[n]$ | — |
| Complex exponential | $e^{j\omega_0 n}$ | Periodic iff $\omega_0/2\pi$ is rational |

### 2.2 System Properties

**Linearity:** If $x_1[n]\to y_1[n]$ and $x_2[n]\to y_2[n]$, then $ax_1[n]+bx_2[n]\to ay_1[n]+by_2[n]$. Broken by: $x^2[n]$, $|x[n]|$, $\log x[n]$, any additive constant.

**Causality:** Output at time $n$ depends only on $x[n], x[n-1], x[n-2], \ldots$ — no future samples. Broken by: $x[n+k]$ for any $k>0$.

**Time-Invariance:** A delay in the input causes the same delay in the output. Broken by: $x[2n]$ (decimation), $x[n]\cdot(-1)^n$, $y[n]=nx[n]$ (the $n$ coefficient changes with time).

**BIBO Stability:** Bounded input produces bounded output. For LTI systems, equivalent to $\sum_{n}|h[n]| < \infty$.

**Initially Relaxed:** Zero input → zero output. No stored energy at time zero.

> **Recall trap:** $y[n] = nx[n]$ is **linear** and **causal** but **time-varying** — the exam frequently tests this.

### 2.3 LTI Convolution

Every LTI system is completely characterised by its **impulse response** $h[n]$. The output to any input is:

$$\boxed{y[n] = x[n]*h[n] = \sum_{k=-\infty}^{\infty} x[k]\,h[n-k]}$$

**Manual convolution procedure:**
1. Flip $h[k]$ to get $h[-k]$
2. Shift right by $n$ to get $h[n-k]$
3. Multiply pointwise with $x[k]$
4. Sum all products to get $y[n]$

**Example:** $x[n]=\{1,2\}$, $h[n]=\{1,-2,1\}$ → $y[n]=\{1,0,-3,2\}$

### 2.4 System Interconnections

| Configuration | Combined response |
|--------------|-----------------|
| **Series (cascade):** $x \to h_1 \to h_2 \to y$ | $h[n] = h_1[n]*h_2[n]$ |
| **Parallel:** $x \to h_1$ and $x \to h_2$, outputs add | $h[n] = h_1[n]+h_2[n]$ |

For complex mixed topologies, trace each path and combine with the appropriate operation.

### 2.5 Signal Operations

| Operation | Formula | Effect |
|-----------|---------|--------|
| Time delay | $x[n-k]$ | Shifts right by $k$ |
| Time advance | $x[n+k]$ | Shifts left by $k$ |
| Time reversal | $x[-n]$ | Flips about $n=0$ |
| Amplitude scaling | $ax[n]$ | Scales amplitude |
| Decimation | $x[Mn]$ | Compresses time axis by $M$ |
| Interpolation | $x[n/M]$ | Expands time axis by $M$ |

### 2.6 Accumulator

The **running sum** system: $y[n] = \sum_{k=-\infty}^{n}x[k]$

For $x[n] = nu[n]$: $y[n] = \sum_{k=0}^{n}k = \dfrac{n(n+1)}{2}$

### 2.7 Cross-Correlation and Pitch Detection

**Cross-correlation** measures the similarity between two signals as a function of lag $l$:

$$R_{xy}[l] = \sum_{n} x[n]\,y[n-l]$$

In **voiced speech pitch detection**, the autocorrelation $R_{xx}[\tau]$ has a strong peak at lag $\tau = T_0$ (the pitch period). The fundamental frequency is:

$$\boxed{F_0 = \frac{F_s}{\tau_{\text{peak}}}}$$

**Example:** Peak at lag 70, $F_s = 16$ kHz → $F_0 = 16000/70 \approx 228$ Hz

---

## Week 3 — Z-Transform

The Z-transform is the DT equivalent of the Laplace transform. It converts difference equations into algebraic equations, making analysis of LTI systems tractable.

### 3.1 Definition

$$\boxed{X(z) = \sum_{n=-\infty}^{\infty} x[n]\,z^{-n}}$$

Key immediate results: $\delta[n] \leftrightarrow 1$; $\delta[n-k] \leftrightarrow z^{-k}$ (a delay of $k$ = multiply by $z^{-k}$).

### 3.2 Common Z-Transform Pairs

| Signal $x[n]$ | $X(z)$ | ROC |
|--------------|--------|-----|
| $\delta[n]$ | $1$ | All $z$ |
| $\delta[n-k]$ | $z^{-k}$ | All $z\neq0$ (if $k>0$) |
| $u[n]$ | $\dfrac{z}{z-1} = \dfrac{1}{1-z^{-1}}$ | $|z|>1$ |
| $a^n u[n]$ | $\dfrac{z}{z-a} = \dfrac{1}{1-az^{-1}}$ | $|z|>|a|$ |
| $-a^n u[-n-1]$ | $\dfrac{z}{z-a}$ | $|z|<|a|$ |
| $na^n u[n]$ | $\dfrac{az^{-1}}{(1-az^{-1})^2}$ | $|z|>|a|$ |

The pair $a^n u[n] \leftrightarrow z/(z-a)$ with ROC $|z|>|a|$ is the single most important Z-transform pair.

### 3.3 Region of Convergence (ROC)

The ROC determines the **type** of signal a given $X(z)$ corresponds to. It is always an annular region (possibly degenerate) that never contains a pole.

| Signal type | ROC shape |
|-------------|-----------|
| Finite duration, causal | All $z$ except $z=0$ |
| Finite duration, **anti-causal** | All $z$ except $z=\infty$ |
| Finite duration, two-sided | All $z$ except $z=0$ and $z=\infty$ |
| Infinite, right-sided (causal) | $|z| > r_{\max}$ |
| Infinite, left-sided (anti-causal) | $|z| < r_{\min}$ |
| Infinite, two-sided | $r_1 < |z| < r_2$ |

Two crucial system properties map to the ROC:
- **Stable system** ↔ ROC includes the unit circle $|z|=1$
- **Causal system** ↔ ROC is the exterior of the outermost pole

> **Recall trap:** Finite anti-causal signal: ROC excludes $z=\infty$, **not** $z=0$. This is the most commonly swapped ROC on exams.

### 3.4 Z-Transform Properties

| Property | Time domain | Z-domain |
|----------|-------------|----------|
| Linearity | $ax_1[n]+bx_2[n]$ | $aX_1(z)+bX_2(z)$ |
| Time delay | $x[n-k]$ | $z^{-k}X(z)$ |
| Time advance | $x[n+k]$ | $z^{+k}X(z)$ |
| Time reversal | $x[-n]$ | $X(z^{-1})$, ROC inverts |
| Z-domain scaling | $a^n x[n]$ | $X(z/a)$ |
| **Convolution** | $x_1[n]*x_2[n]$ | $X_1(z)\cdot X_2(z)$ |
| Multiply by $n$ | $nx[n]$ | $-z\,\dfrac{d}{dz}X(z)$ |

> **Recall trap:** $Y(z)=X(-z)$ means $y[n]=(-1)^n x[n]$ in the time domain — NOT $y[n]=x[-n]$.

### 3.5 Initial Value Theorem

$$\boxed{x[0] = \lim_{z\to\infty} X(z)}$$

**Example:** $X(z)=1+3z^{-1}-2z^{-3}$ → as $z\to\infty$, the $z^{-k}$ terms vanish → $x[0]=1$

### 3.6 Computing Z-Transforms

For finite-duration signals, apply the definition term by term. For right-sided signals $a^n u[n-k]$, use time-delay + scaling. For products and compositions, use the properties table.

**Example:** $x[n]=0.5^{n-5}u[n-5]$ → substitute $m=n-5$: $X(z)=z^{-5}\cdot\frac{1}{1-0.5z^{-1}} = \frac{z^{-4}}{z-0.5}$

### 3.7 Inverse Z-Transform via Partial Fractions

Decompose $X(z)$ into recognisable pieces using partial fractions, then look up each term in the table.

**Standard form:** Write $X(z)/z = \sum_k c_k/(z-p_k)$, solve for residues, then write $X(z) = \sum_k c_k z/(z-p_k)$ and convert.

### 3.8 System Transfer Function

For a system defined by the difference equation $y[n] = \sum b_k x[n-k] - \sum a_k y[n-k]$:

$$H(z) = \frac{Y(z)}{X(z)} = \frac{\sum b_k z^{-k}}{1+\sum a_k z^{-k}}$$

The inverse system has $H_{\text{inv}}(z) = 1/H(z)$.

---

## Weeks 4–5 — Discrete Fourier Transform (DFT)

The DFT gives a finite, computable frequency representation. It is the engine behind fast filtering, spectral analysis, and audio/image compression.

### 4.1 DTFT (Background)

The **Discrete-Time Fourier Transform** gives the spectrum as a continuous, periodic function of frequency:

$$X(e^{j\omega}) = \sum_{n=-\infty}^{\infty} x[n]\,e^{-j\omega n} \qquad x[n] = \frac{1}{2\pi}\int_{-\pi}^{\pi}X(e^{j\omega})e^{j\omega n}\,d\omega$$

### 4.2 DFT and IDFT

For a finite-length signal of $N$ samples, the **$N$-point DFT** samples the DTFT at $N$ equally spaced frequencies $\omega_k = 2\pi k/N$:

$$\boxed{X[k] = \sum_{n=0}^{N-1}x[n]\,W_N^{nk}} \qquad W_N = e^{-j2\pi/N}$$

$$x[n] = \frac{1}{N}\sum_{k=0}^{N-1}X[k]\,W_N^{-nk}$$

The DFT and IDFT are a transform pair — both are finite sums, computable on a computer.

### 4.3 DFT Properties

| Property | Time domain | Frequency domain |
|----------|-------------|-----------------|
| Linearity | $ax_1[n]+bx_2[n]$ | $aX_1[k]+bX_2[k]$ |
| Circular shift | $x[(n-m)_N]$ | $W_N^{mk}X[k]$ |
| **Circular convolution** | $x_1[n]\circledast x_2[n]$ | $X_1[k]\cdot X_2[k]$ |
| Multiplication | $x_1[n]\cdot x_2[n]$ | $\frac{1}{N}X_1[k]\circledast X_2[k]$ |
| Periodicity | $x[n]=x[n+N]$ | $X[k]=X[k+N]$ |
| Conjugate symmetry (real $x$) | — | $X[N-k]=X^*[k]$ |
| Real even $x[n]$ | — | $X[k]$ purely real |
| Real odd $x[n]$ | — | $X[k]$ purely imaginary |

> **Recall trap:** Periodicity means $X[k+N]=X[k]$, so $X[10]$ for an 8-point DFT $= X[2]$.

### 4.4 Conjugate Symmetry of Real DFT

For a real-valued input of length $N$, only $\lfloor N/2\rfloor+1$ DFT values are independent. The rest are their conjugates:

$$X[N-k] = X^*[k]$$

**Example:** 8-point DFT, first 5 values given → $X[5]=X^*[3]$, $X[6]=X^*[2]$, $X[7]=X^*[1]$

### 4.5 Manual DFT Computation

**4-point DFT of $x[n]=\{1,2,3,4\}$:**

Use $X[k]=\sum_{n=0}^{3}x[n]e^{-j2\pi nk/4}$ with $e^{-j\pi/2}=-j$, $e^{-j\pi}=-1$, $e^{-j3\pi/2}=j$:

- $X[0]=1+2+3+4=10$
- $X[1]=1-2j-3+4j=-2+2j$
- $X[2]=1-2+3-4=-2$
- $X[3]=X^*[1]=-2-2j$

### 4.6 DFT of Impulse Superpositions

$$X[k] = \sum_i a_i\,e^{-j2\pi k n_i/N}$$

For $x[n]=2\delta[n]+\delta[n-1]-3\delta[n-3]$, 8-point DFT: $X[k] = 2 + e^{-j2\pi k/8} - 3e^{-j6\pi k/8}$

### 4.7 DFT of Complex Exponential

For $x[n]=e^{j\omega_0 n}$:

$$X[k] = \frac{1-e^{j\omega_0 N}}{1-e^{j(\omega_0 - 2\pi k/N)}}$$

**Special case:** when $\omega_0 = 2\pi k_0/N$ (exact frequency bin):
$$\boxed{X[k] = N\,\delta_N[k-k_0]}$$

### 4.8 Circular Convolution

The DFT-domain product corresponds to **circular (cyclic) convolution** in the time domain:

$$x_3[m] = \sum_{n=0}^{N-1} x_1[n]\,x_2[(m-n)_N]$$

where $(m-n)_N$ means $(m-n)\bmod N$ — the index wraps around.

**Best method for exam (Final Exam Tutorial Q1):**
1. Look up $x_2[(m-n)_N]$ for each $m$ by circular-shifting $x_2$ right by $m$
2. Dot-product with $x_1$

**Example:** $x_1=\{1,2,0,1\}$, $x_2=\{4,0,2,2\}$, $N=4$:
- $x_3[0]=1(4)+2(2)+0(2)+1(0)=8$
- $x_3[1]=1(0)+2(4)+0(2)+1(2)=10$
- $x_3[2]=1(2)+2(0)+0(4)+1(2)=4$
- $x_3[3]=1(2)+2(2)+0(0)+1(4)=10$

Result: $\{8,10,4,10\}$

### 4.9 Frequency Resolution and Bin Mapping

The spacing between DFT bins in Hz:

$$\boxed{\Delta f = \frac{F_s}{N}}$$

The bin index corresponding to a physical frequency $F$:

$$k = \frac{F \cdot N}{F_s}$$

**Example:** 512-point DFT, $F_s=12$ kHz → $\Delta f = 23.4$ Hz per bin

### 4.10 Circular Even/Odd

A sequence is **circularly even** if $x[n]=x[N-n]$ (using $\bmod N$ arithmetic). Circularly even → DFT is real-valued.

### 4.11 Computational Complexity

| Method | Multiplications | Additions |
|--------|----------------|-----------|
| Direct $N$-point DFT | $N^2$ | $N(N-1)$ |
| Radix-2 FFT | $\dfrac{N}{2}\log_2 N$ | $N\log_2 N$ |

For $N=1024$: direct needs $>10^6$ multiplications; FFT needs only $5120$.

---

## Weeks 6–7 — Spectral Analysis, STFT & FFT Algorithms

Week 6 applies DFT to real signals using windowed analysis. Week 7 derives the fast algorithms that make DFT computation practical.

### 5.1 Frequency Resolution

The frequency resolution of an $N$-point DFT applied to a window of $L$ samples:

$$\boxed{\Delta f = \frac{F_s}{L}}$$

Two frequency components separated by $\Delta F$ Hz are **resolvable** only if:

$$\boxed{L \geq \frac{F_s}{\Delta F}}$$

### 5.2 Window Functions

Applying a window to a signal before taking the DFT controls the **trade-off between frequency resolution and sidelobe leakage**:

| Window | Main lobe width | Peak sidelobe | Stopband atten. | Best use |
|--------|----------------|---------------|----------------|----------|
| **Rectangular** | Narrowest | −13 dB | 21 dB | Best frequency resolution |
| Hanning | ×2 | −31 dB | 44 dB | General |
| Hamming | ×2 | −41 dB | 53 dB | FIR design |
| Blackman | ×3 | −57 dB | 74 dB | Min leakage |

> **Recall trap:** Rectangular window = **best frequency resolution** (narrowest main lobe), but worst sidelobe suppression. "Best window" depends on what you are optimising.

### 5.3 Short-Time Fourier Transform (STFT)

For non-stationary signals (e.g. speech), the spectrum changes over time. The STFT analyses the signal in short, overlapping frames:

$$X(n,\omega) = \sum_{m=-\infty}^{\infty} x[m]\,w[n-m]\,e^{-j\omega m}$$

Each frame is a windowed DFT. The STFT can be interpreted as a **bank of uniform bandpass filters**, where:
- Bandwidth of each filter = $F_s/N$
- Centre frequency of $k$-th filter = $k\cdot F_s/N$

**FBS reconstruction** is possible when $w[n]$ is finite-duration and the STFT is sampled with sufficient time-frequency density.

### 5.4 Discrete Cosine Transform (DCT)

The 2D DCT transforms an image block into spatial-frequency coefficients:

$$C(i,j) = \frac{k(i)k(j)}{\sqrt{2N}}\sum_{x,y}I(x,y)\cos\frac{(2x+1)i\pi}{2N}\cos\frac{(2y+1)j\pi}{2N}$$

where $k(0)=1/\sqrt{2}$, $k(n)=1$ otherwise.

**DCT advantages over DFT:**
- **Better energy compaction** — most signal energy concentrates in the first few low-frequency coefficients
- **Real-valued output** — no imaginary part to discard
- This is why 2D DCT is the core of **JPEG** image compression and **MPEG** video coding

**DFT disadvantage:** Complex output, poor energy compaction compared to DCT.

### 5.5 Radix-2 FFT Algorithms

The FFT exploits the periodicity and symmetry of the twiddle factors $W_N^{nk}$ to reduce the $N^2$ direct DFT to $\frac{N}{2}\log_2 N$ operations.

**Decimation-in-Time (DIT):**
- Split $x[n]$ into even and odd subsequences recursively
- **Input order: bit-reversed; Output order: normal**
- Butterfly: $A' = A + W_N^k B$, $\;\; B' = A - W_N^k B$
- First $N/2$ outputs: $X[k] = F_1[k] + W_N^k F_2[k]$
- Last $N/2$ outputs: $X[k+N/2] = F_1[k] - W_N^k F_2[k]$

**Decimation-in-Frequency (DIF):**
- Split $X[k]$ into even- and odd-indexed outputs
- **Input order: normal; Output order: bit-reversed**

> **Recall trap:** DIT = bit-reversed **input**. DIF = bit-reversed **output**. These are swapped on almost every exam.

### 5.6 Divide-and-Conquer DFT ($N = M \times L$)

When $N$ factors as $M\times L$, the $N$-point DFT can be computed as a 2-D DFT:

**Step 1:** Store $x[n]$ **row-wise** in an $L\times M$ array (mapping $n = M\ell + m$, so $L$ rows and $M$ columns)

**Step 2:** Compute $M$-point DFT of each **row**

**Step 3:** Multiply each element by twiddle factor $W_N^{km\ell}$

**Step 4:** Compute $L$-point DFT of each **column**

**Step 5:** Read output **column-wise**

**Complexity:** $N(M+L)$ vs $N^2$ for direct DFT.

**Example:** $N=88=8\times11$: 11-row, 8-column array; row DFTs are 8-point; column DFTs are 11-point.

> **Recall trap:** Store row-wise, DFT rows, twiddle, DFT columns, read columns. The input and output traversal orders are different.

---

## Week 8 — FIR Filter Design

FIR (Finite Impulse Response) filters have no feedback — their impulse response is finite. This guarantees stability and enables exact linear phase.

### 6.1 Why FIR?

| Advantage | Explanation |
|-----------|-------------|
| **Exact linear phase** | Symmetric/anti-symmetric $h[n]$ → constant group delay → no phase distortion |
| **Always stable** | No poles other than at $z=0$ — no feedback path to go unstable |
| **Simple implementation** | Pure convolution sum, no recursive loops |

**Disadvantage vs IIR:** For the same frequency selectivity specification, FIR filters require far more coefficients → more computation.

### 6.2 Linear Phase Condition

A filter has **linear phase** if its impulse response is symmetric or anti-symmetric about its midpoint.

- **Symmetric:** $h[n] = h[N-1-n]$ → phase $\phi(\omega) = -\omega\frac{N-1}{2}$
- **Anti-symmetric:** $h[n] = -h[N-1-n]$ → phase $\phi(\omega) = \frac{\pi}{2} - \omega\frac{N-1}{2}$

Z-transform symmetry identity: $z^{-(N-1)}H(z^{-1}) = +H(z)$ (symmetric) or $= -H(z)$ (anti-symmetric)

### 6.3 Four Linear-Phase FIR Types

| Type | Symmetry | Length $N$ | $h[\text{centre}]$ | Cannot realise |
|------|---------|------------|-------------------|---------------|
| **I** | Symmetric | Odd | Any value | Nothing |
| **II** | Symmetric | Even | — | High-pass, Band-stop |
| **III** | Anti-symmetric | Odd | **Must be 0** | Low-pass, High-pass |
| **IV** | Anti-symmetric | Even | — | Low-pass, Band-stop |

The restrictions arise because $H(e^{j0})=0$ or $H(e^{j\pi})=0$ is forced by the symmetry and length combination.

> **Recall trap:** Type III (anti-sym, odd $N$): centre tap $h[(N-1)/2]=0$ always. It cannot design LP **or** HP — only BP or BS. Type II cannot design HP or BS.

### 6.4 Zero Locations

For a linear-phase FIR, zeros occur in **reciprocal conjugate quads**. If $z_0 = re^{j\theta}$ is a zero, so are:

$$re^{-j\theta}, \quad \frac{1}{r}e^{j\theta}, \quad \frac{1}{r}e^{-j\theta}$$

**Example:** $z_0 = 6+8j$ (so $|z_0|=10$) → other zeros: $6-8j$, $0.06-0.08j$, $0.06+0.08j$

### 6.5 Window Method

Design an ideal FIR by truncating the ideal (infinite) impulse response with a window $w[n]$ of length $M+1$ (order $M$). The filter order required for a given transition bandwidth $\Delta f$:

| Window | Filter order $M$ | Minimum stopband attenuation |
|--------|-----------------|------------------------------|
| Rectangular | $M = 2F_s/\Delta f$ | 21 dB |
| Hanning | $M = 8F_s/\Delta f$ | 44 dB |
| Hamming | $M = 8F_s/\Delta f$ | 53 dB |
| Blackman | $M = 12F_s/\Delta f$ | 74 dB |

**Ideal LPF impulse response:** $h[n] = \sin(\omega_c n)/(\pi n)$, with $h[0] = \omega_c/\pi$

So if you know $h[0]$, you can recover the cutoff: $\omega_c = \pi h[0]$, and $F_c = h[0] \cdot F_s / 2$

### 6.6 Frequency Sampling Design (Final Exam Tutorial Q2)

Specify the desired frequency response at $N$ equally-spaced frequencies, then derive $h[n]$ analytically.

**Step 1:** Compute $G[k] = (-1)^k H_r(2\pi k/N)$

**Step 2:** For even $N$, set $U = N/2-1$. Apply:

$$\boxed{h[n] = \frac{1}{N}\left[G[0] + 2\sum_{k=1}^{U}G[k]\cos\frac{2\pi k\!\left(n+\tfrac{1}{2}\right)}{N}\right]}$$

**Step 3:** Symmetry gives $h[N-1-n] = h[n]$ — only compute $n = 0,1,\ldots,\lfloor(N-1)/2\rfloor$

**Tutorial Q2 result:** $M=4$, $H_r=\{2,-1,0.8,0\}$ → $G=\{2,1,0.8,0\}$, $U=1$:
- $h[0]=h[3]=(2+\sqrt{2})/4\approx0.854$
- $h[1]=h[2]=(2-\sqrt{2})/4\approx0.146$

---

## Week 9 — IIR Filter Design

IIR (Infinite Impulse Response) filters use feedback — they are efficient but require careful stability management and cannot achieve exact linear phase.

### 7.1 Analog Prototype: Butterworth Filter

$$|H_a(j\Omega)|^2 = \frac{1}{1+\varepsilon^2(\Omega/\Omega_p)^{2N}}$$

- **All-pole** (no zeros in the transfer function)
- **Maximally flat passband** — the magnitude response is as smooth as possible at $\Omega=0$
- 3 dB point at $\Omega=\Omega_p$ when $\varepsilon=1$

**Filter order from specifications:**

$$\boxed{N \geq \frac{\log\!\left(\dfrac{10^{0.1A_s}-1}{10^{0.1A_p}-1}\right)}{2\log(\Omega_s/\Omega_p)}}$$

**Example:** $A_p=3$ dB, $A_s=40$ dB, $\Omega_s/\Omega_p=2$: numerator = $\log(9999)=4$, denominator = $2\log2=0.602$ → $N\geq6.6$ → **$N=7$**

### 7.2 Analog Prototype: Chebyshev Type I

$$|H_a(j\Omega)|^2 = \frac{1}{1+\varepsilon^2 T_N^2(\Omega/\Omega_p)}$$

where $T_N(x)$ are Chebyshev polynomials: $T_0=1$, $T_1=x$, $T_N=2xT_{N-1}-T_{N-2}$

- **All-pole** (like Butterworth)
- **Equiripple in passband** — the ripple oscillates between $\pm\varepsilon^2$ bounds
- **Monotonic in stopband** — decreases smoothly

**Order formula:**

$$N \geq \frac{\cosh^{-1}\!\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}}{\cosh^{-1}(\Omega_s/\Omega_p)}$$

### 7.3 Analog Prototype: Chebyshev Type II

- Has **both poles and zeros** (unlike Type I which is all-pole)
- **Monotonic passband**, **equiripple stopband**

> **Recall trap:** Chebyshev Type I = all-pole + equiripple passband. Type II has zeros + equiripple stopband. They are mirror images of each other.

### 7.4 Impulse Invariance

**Idea:** Design $H_a(s)$ first, then set $h[n] = h_a(nT)$ — the digital impulse response is a sampled version of the analog one.

**Pole mapping:** each analog pole $s=p_k$ maps to digital pole $z = e^{p_k T}$

**Transfer function conversion:**

$$H_a(s) = \sum_{k=1}^{N}\frac{c_k}{s-p_k} \quad\longrightarrow\quad \boxed{H(z) = \sum_{k=1}^{N}\frac{c_k}{1-e^{p_k T}z^{-1}}}$$

**Properties:**
- Left half of s-plane ($\text{Re}(p_k)<0$) maps inside unit circle → **stable analog filter → stable digital filter**
- The $j\Omega$ axis maps **many-to-one** onto the unit circle → **aliasing in frequency domain**
- Not suitable for high-pass or band-stop filters (aliasing distorts the stopband)

**Full worked example (Tutorial Q3):** $H_a(s)=\frac{s-2}{s^2-4s+5}$, $T=10^{-4}$ s

1. Factor: $s^2-4s+5 = (s-(2+j))(s-(2-j))$, poles $p_{1,2}=2\pm j$
2. Residues: $c_1 = (p_1-2)/(p_1-p_2) = j/2j = 1/2$; $c_2=1/2$
3. Map: $H(z) = \frac{0.5}{1-e^{(2+j)T}z^{-1}} + \frac{0.5}{1-e^{(2-j)T}z^{-1}}$

### 7.5 Bilinear Transform

**Idea:** Map the entire $j\Omega$ axis onto the unit circle via an algebraic substitution:

$$\boxed{s = \frac{2}{T}\cdot\frac{z-1}{z+1}} \qquad\Longleftrightarrow\qquad z = \frac{1+(T/2)s}{1-(T/2)s}$$

- **One-to-one mapping** — no aliasing
- **Non-linear frequency warping:** $\Omega = \frac{2}{T}\tan(\omega/2)$ — low digital frequencies map faithfully, but high digital frequencies are compressed
- Need to **pre-warp** the analog cutoff to compensate: $\Omega_c = \frac{2}{T}\tan(\omega_c/2)$

**Worked example:** $H_a(s)=1/s$, $F_s=400$ Hz ($T=2.5\times10^{-3}$):

$$H(z) = \frac{T(z+1)}{2(z-1)} = \frac{0.00125(1+z^{-1})}{1-z^{-1}}$$

Difference equation: $y[n] = y[n-1] + 0.00125(x[n]+x[n-1])$

### 7.6 Impulse Invariance vs Bilinear — Comparison

| Feature | Impulse Invariance | Bilinear |
|---------|-------------------|---------|
| Aliasing | **Yes** (many-to-one) | **No** (one-to-one) |
| Frequency warping | None | Yes (pre-warp needed) |
| Suitable for | LP, BP | Any type |
| Not suitable for | HP, BS | Nothing (with pre-warping) |
| Pole mapping | $z = e^{p_k T}$ | $s = \frac{2}{T}\frac{z-1}{z+1}$ |

### 7.7 Pole-Zero Placement

Direct method: place poles and zeros by hand to approximate the desired response.

$$\theta = \frac{2\pi F_c}{F_s} \quad\text{(pole angle)} \qquad r = 1 - \frac{\pi\cdot\text{BW}}{F_s} \quad\text{(pole radius)}$$

Zeros at $z=+1$ (DC = 0 Hz) and $z=-1$ (Nyquist) enforce nulls at those frequencies.

**Example:** Centre = 200 Hz, BW = 60 Hz, $F_s=800$ Hz → $\theta=\pi/2$, $r\approx0.79$

---

## Week 10 — Linear Prediction & LPC Analysis

Speech production is modelled as a **source-filter system**: a source (vocal cords or turbulence) drives a resonant vocal tract filter. LPC finds the best all-pole model of the vocal tract directly from the speech samples.

### 8.1 Signal Models

| Model | Transfer function | Poles | Zeros | Use |
|-------|-----------------|-------|-------|-----|
| **AR** (AutoRegressive) | $G/A(z)$ | Yes | No | Speech, LPC |
| **MA** (Moving Average) | $B(z)$ | No | Yes | FIR filters |
| **ARMA** | $B(z)/A(z)$ | Yes | Yes | General |

> **Recall trap:** AR = all-pole. MA = all-zero.

### 8.2 AR Model and Linear Prediction

The AR all-pole model:

$$H(z) = \frac{G}{1-\sum_{k=1}^{p}\alpha_k z^{-k}}$$

The system output satisfies: $y[n] = \sum_{k=1}^{p}\alpha_k y[n-k] + Gx[n]$

**Linear prediction** forms the estimate $\hat{y}[n] = \sum_{k=1}^{p}\alpha_k y[n-k]$ and minimises the mean-squared prediction error $\sum[y[n]-\hat{y}[n]]^2$.

### 8.3 Lattice Filter and PARCOR Recursion

The lattice filter formulation yields the **PARCOR (Partial Correlation) coefficients** $k_i$ directly.

**Initialisation:**
$$e^0[m] = b^0[m] = x[m]$$

> **Recall trap:** The order-0 prediction error IS the input signal itself.

**Recursion at order $i$:**
$$\boxed{e^i[m] = e^{i-1}[m] - k_i\,b^{i-1}[m-1]}$$
$$\boxed{b^i[m] = b^{i-1}[m-1] - k_i\,e^{i-1}[m]}$$

where $e^i$ is the **forward** prediction error and $b^i$ is the **backward** prediction error.

### 8.4 PARCOR Coefficient Formula

$$k_i = \frac{\displaystyle\sum_{m} e^{i-1}[m]\,b^{i-1}[m-1]}{\sqrt{\displaystyle\sum_m \left[e^{i-1}[m]\right]^2 \cdot \displaystyle\sum_m \left[b^{i-1}[m-1]\right]^2}}$$

**Stability condition:** $|k_i|\leq1$ for all $i$ ↔ stable all-pole model.

### 8.5 Energy Recursion

Each PARCOR stage reduces the prediction error energy:

$$\boxed{E^i = E^{i-1}\!\left(1-k_i^2\right)}$$

**Example:** $E^0=3000$, $k_1=0.5$, $k_2=-0.2$, $k_3=0.3$:
- $E^1=3000\times0.75=2250$
- $E^2=2250\times0.96=2160$
- $E^3=2160\times0.91=1965.6$

### 8.6 Full $k_1$ Computation — Step by Step (Tutorial Q6)

**Given:** $x[n]=\{1,2,0,3\}$, order $p=2$

**Step 1:** $e^0=b^0=\{1,2,0,3\}$

**Step 2:** Numerator $=\sum_{m=1}^{3}e^0[m]b^0[m-1]=2(1)+0(2)+3(0)=2$

**Step 3:** Denominator $=\sqrt{\sum_{m=1}^{3}(e^0)^2 \cdot \sum_{m=0}^{2}(b^0)^2}=\sqrt{(4+0+9)(1+4+0)}=\sqrt{65}$

**Step 4:** $k_1=2/\sqrt{65}\approx0.248$

**Step 5:** Compute $e^1[m]=e^0[m]-k_1 b^0[m-1]$ and $b^1[m]=b^0[m-1]-k_1 e^0[m]$ for each $m$, then repeat for $k_2$.

### 8.7 Minimum Mean-Squared Prediction Error

$$\boxed{E_{\min} = R[0] - \sum_{k=1}^{p}\alpha_k R[k]}$$

where $R[k] = \sum_n x[n]x[n+k]$ is the autocorrelation sequence.

**Example:** $x=\{1,2,-1,3\}$, $\alpha_1=0.5$, $\alpha_2=-0.5$, $\alpha_3=0.3$:
- $R[0]=15$, $R[1]=-3$, $R[2]=5$, $R[3]=3$
- $E_{\min}=15-[0.5(-3)+(-0.5)(5)+0.3(3)]=15+3.1=18.1$

### 8.8 LPC Order for Speech

$$p = F_s / 1000 \quad \text{(poles per kHz of bandwidth)}$$

**Example:** $F_s=16$ kHz → $p=16$. Four resonances at 500/1500/2500/3500 Hz also give $p=16$ via the same rule (not $2\times4=8$).

### 8.9 Prediction Error Length

For a window of $L_w$ samples and LPC order $p$:

$$\text{Error length} = L_w + p - 1$$

**Example:** 20th order, 20 ms window, $F_s=16$ kHz: $L_w=320$, error length $=339$

---

## Weeks 11–12 — Multirate DSP

Different parts of a processing chain often operate at different sample rates. Multirate DSP provides tools for changing the rate efficiently without information loss.

**Applications:** Digital filter banks, quadrature mirror filters (QMF), narrow-band filtering, sample-rate conversion (CD 44.1 kHz ↔ phone 8 kHz ↔ studio 192 kHz)

### 9.1 Decimation (Down-Sampling by $M$)

Keep every $M$-th sample, discard the rest:

$$\boxed{y[n] = x[Mn]}$$

**Spectrum effect:** The spectrum compresses by $M$ in frequency. Copies of the original spectrum appear at $2\pi k/M$ — if not filtered beforehand, they overlap and cause **aliasing**.

**Anti-aliasing filter:** An LPF with cutoff $\pi/M$ **must precede** the down-sampler:

$$|H(e^{j\omega})| = 0 \text{ for } |\omega| > \pi/M$$

### 9.2 Interpolation (Up-Sampling by $L$)

Insert $L-1$ zeros between each sample:

$$\boxed{v[m] = \begin{cases}x[m/L] & m = 0,\pm L, \pm 2L,\ldots\\0 & \text{otherwise}\end{cases}}$$

**Spectrum effect:** The spectrum stretches by $L$ in frequency. $L-1$ copies (images) of the baseband spectrum appear. An **anti-imaging filter** must follow the up-sampler to suppress these images.

**Anti-imaging filter:** $|H(e^{j\omega})| = L$ for $|\omega|\leq\pi/L$, $= 0$ elsewhere (gain of $L$ compensates for the $L-1$ inserted zeros).

> **Recall trap:** Interpolation by $L$ inserts **$L-1$** zeros between samples, not $L$.

### 9.3 Fractional Rate Conversion ($I/D$)

To convert from one arbitrary rate to another: **upsample by $I$**, apply a combined LPF, then **downsample by $D$**:

$$x[n]\xrightarrow{\uparrow I}v[m]\xrightarrow{H(z)}w[m]\xrightarrow{\downarrow D}y[n]$$

$$\frac{F_{\text{out}}}{F_{\text{in}}} = \frac{I}{D} \quad\text{(reduce to lowest terms)}$$

**Combined LPF cutoff:**

$$\boxed{\omega_c = \frac{\pi}{\max(I,D)}}$$

The single LPF simultaneously acts as anti-imaging filter (for the $\uparrow I$ stage) and anti-aliasing filter (for the $\downarrow D$ stage), with the tighter constraint winning.

**Filter role:**

| Condition | Filter role |
|-----------|------------|
| $F_{\text{out}} > F_{\text{in}}$ → $I > D$ | Anti-imaging (upsampling dominates) |
| $F_{\text{out}} < F_{\text{in}}$ → $D > I$ | **Anti-aliasing** (downsampling dominates) |

**Key worked examples:**
- 9 kHz → 15 kHz: $15/9=5/3$ → $I=5$, $D=3$, cutoff $=\pi/5$
- 36 kHz → 9 kHz: $9/36=1/4$ → $I=1$, $D=4$, cutoff $=\pi/4$
- 16 kHz → 24 kHz: $24/16=3/2$ → $I=3$, $D=2$, $I>D$, cutoff $=\pi/3$
- 12 kHz → 8 kHz: $8/12=2/3$ → $D>I$ → **anti-aliasing**

### 9.4 Output Sample Count

Output rate $= F_{\text{in}} \times I/D$. Multiply by duration to get the number of output samples.

**Example:** $F_{\text{in}}=12$ kHz, $I=5$, $D=3$, duration $=30$ ms: rate $=20$ kHz, samples $=600$

### 9.5 Overlap-Add Method

For filtering a long signal $x[n]$ with a short FIR $h[n]$ of order $M$ using DFT of size $N_{\text{DFT}}$:

$$\boxed{L = N_{\text{DFT}} - M}$$

where $L$ is the number of **input data samples** per block (not counting the $M$ zero-padded samples).

**Example:** FIR order 63, DFT size 512 → $L=512-63=449$ input samples per block

### 9.6 Multistage Rate Conversion

Instead of a single $\uparrow I$ or $\downarrow D$ stage with a large ratio, split into multiple smaller stages:

**Advantages:**
1. **Reduced computation** — filter order requirements are lower at each stage
2. **Fewer coefficients** — less memory and arithmetic
3. **Reduced finite word-length effects** — coefficient quantisation errors are smaller

---

## Exam Structure & Strategy

### Section 1 & 2 — Recall MCQs

These sections test whether you know the key facts cold. The most commonly tested items:

| Topic | What gets tested |
|-------|----------------|
| Sampling | Nyquist rate, aliasing formula, multi-dimensional vs multi-channel |
| System properties | LTIC for given difference equations; $y[n]=nx[n]$ is time-varying |
| Z-transform | ROC of anti-causal finite signal (excludes $z=\infty$); $Y(z)=X(-z)$ effect |
| DFT | Periodicity $X[k+N]=X[k]$; real odd → imaginary DFT |
| FFT | DIT = bit-reversed input; DIF = bit-reversed output; butterfly count |
| FIR | Type III centre tap = 0; Type III cannot do LP or HP |
| IIR | Bilinear = no aliasing; impulse invariance = aliasing |
| LPC | $e^0[m]=x[m]$; AR = all-pole; MA = all-zero |
| Multirate | $L-1$ zeros inserted; LPF cutoff = $\pi/\max(I,D)$ |

### Section 3 — Mathematical Problems

These are the five calculation types from the Final Exam Tutorial:

| Q# | Type | Key steps |
|----|------|-----------|
| Q1 | Circular convolution | Circular-shift $x_2$, dot-product with $x_1$ for each output sample |
| Q2 | FIR frequency sampling | Compute $G[k]=(-1)^k H_r[k]$, apply reconstruction formula |
| Q3 | IIR impulse invariance | Factor denominator → poles → partial fractions → residues → $H(z)$ |
| Q6 | LPC PARCOR | Init $e^0=b^0=x$; compute $k_1$ from cross-correlation ratio; recurse |
| Q7 | Multirate expression | Identify system from figure; apply $v[m]=x[m/L]$ at multiples of $L$ |
