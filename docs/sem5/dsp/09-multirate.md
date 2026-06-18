# Weeks 11–12 — Multirate DSP

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. Why Multirate?

Rate conversion between incompatible systems:

- Recording: 192 kHz → CD: 44.1 kHz → Speech: 8 kHz
- Applications: **Digital filter banks**, **Quadrature Mirror Filters (QMF)**, **Narrow-band filters** ✅

---

## 2. Decimation (Down-Sampling by $M$)

**Operation:** Keep every $M$-th sample, discard the rest:

$$\boxed{y[n]=x[Mn]}$$

**Spectrum effect:** Spectrum compressed by $M$ (and replicated if not pre-filtered → aliasing)

**Anti-aliasing filter** MUST precede decimation:

$$|H(e^{j\omega})|=0 \text{ for }|\omega|>\pi/M$$

> **Recall trap:** Anti-aliasing filter goes **before** downsampling. It removes components above $\pi/M$ to prevent aliasing from the compressed replicas.

---

## 3. Interpolation (Up-Sampling by $L$)

**Operation:** Insert $L-1$ zeros between each sample:

$$\boxed{v[m]=\begin{cases}x[m/L] & m=0,\pm L,\pm 2L,\ldots \\ 0 & \text{otherwise}\end{cases}}$$

**Spectrum effect:** Spectrum expanded by $L$, with $L-1$ spectral images appearing.

**Anti-imaging filter** MUST follow up-sampling:
$$|H(e^{j\omega})|=L \text{ for }|\omega|\leq\pi/L, \quad =0 \text{ elsewhere}$$

> **Recall trap:** Interpolation by $L$ inserts $L-1$ zeros (not $L$). Interpolation by 5 inserts **4** zeros. ✅

---

## 4. Fractional Rate Conversion ($I/D$)

**System:** Upsample by $I$ → combined LPF → Downsample by $D$

$$x[n]\xrightarrow{\uparrow I}v[m]\xrightarrow{H(z)}w[m]\xrightarrow{\downarrow D}y[n]$$

$$\boxed{\frac{F_{\text{out}}}{F_{\text{in}}}=\frac{I}{D}} \qquad \text{reduce to lowest terms}$$

**LPF cutoff:**

$$\boxed{\omega_c=\frac{\pi}{\max(I,D)}}$$

| Condition | Filter role |
|-----------|------------|
| $F_{\text{out}}>F_{\text{in}}$ (upsampling, $I>D$) | **Anti-imaging** filter |
| $F_{\text{out}}<F_{\text{in}}$ (downsampling, $D>I$) | **Anti-aliasing** filter |

**Example (Q2):** Input = 9 kHz, Output = 15 kHz:
$$\frac{15}{9}=\frac{5}{3} \implies I=5,\;D=3$$ ✅

**Example:** Input = 36 kHz, Output = 9 kHz:
$$\frac{9}{36}=\frac{1}{4} \implies I=1,\;D=4,\;\omega_c=\pi/4$$ ✅

**Example:** Input = 12 kHz, Output = 8 kHz → $D>I$ → **anti-aliasing** ✅

**Example:** Input = 16 kHz, Output = 24 kHz → $I=3,D=2$, $I>D$, $\omega_c=\pi/3$ ✅

---

## 5. Output Samples Calculation

**Example (Q10):** Input = 12 kHz, $I=5$, $D=3$, duration = 30 ms:

**Step 1:** Output rate $=12000\times5/3=20000$ Hz

**Step 2:** Samples in 30 ms $=20000\times0.030=600$ ✅

---

## 6. Cascade System — $\uparrow I$ then $\downarrow D$

For system $x[n]\xrightarrow{\uparrow I}\xrightarrow{\downarrow D}y[n]$:

**Step 1:** After $\uparrow I$: $v[m]=x[m/I]$ if $I|m$, else $0$

**Step 2:** After $\downarrow D$: $y[n]=v[Dn]$

**Combined:** $y[n]=x[Dn/I]$ if $I|(Dn)$, else $0$

---

## 7. Overlap-Add Method (Week 12 Q5)

For long signal $x[n]$ filtered by FIR of order $M$ (length $M+1$), using DFT size $N_{\text{DFT}}$:

$$\boxed{L=N_{\text{DFT}}-M \quad \text{(input block length, excl. zero-padding)}}$$

**Example (Q5):** FIR order $M=63$, DFT size $N=512$:
$$L=512-63=449 \text{ samples per block}$$ ✅

---

## 8. Multistage Rate Conversion

**Advantages of multistage over single-stage:**
1. **Reduced computation** ✅
2. **Fewer coefficients → reduced finite word-length problems** ✅

---

## 9. Key MCQs

| Question | Answer |
|---------|--------|
| Multirate applications | Narrow-band filters, Digital filter banks, QMF ✅ |
| Input 9 kHz, Output 15 kHz → $I,D$ | $I=5$, $D=3$ ✅ |
| Reducing sampling rate by 3 = | Decimation ✅ |
| Interpolation by 5 → zeros inserted | 4 ✅ |
| Upsampling expression $v[m]$ | $x[m/5]$ at $m=0,\pm5,\ldots$ else 0 ✅ |
| Input 12 kHz, Output 8 kHz → LPF role | Anti-aliasing ✅ |
| Input 16 kHz, Output 24 kHz → LPF cutoff | $\pi/3$ ✅ |
| Input 12 kHz, $I=5$, $D=3$, 30 ms → samples | 600 ✅ |
| Advantages of multistage conversion | Reduced computation + fewer coefficients ✅ |
| FIR order 63, DFT 512, overlap-add block size | 449 ✅ |
| Anti-aliasing filter in decimation: purpose | Remove high-frequency components above $\pi/M$ ✅ |
| PSD of WSS signal = | Fourier transform of autocorrelation function ✅ |

---

## Formula Sheet — Weeks 11–12

$$y[n]=x[Mn] \;\text{(decimate)} \qquad v[m]=x[m/L]\text{ at multiples of }L,\text{ else }0 \;\text{(interpolate)}$$

$$\frac{F_{\text{out}}}{F_{\text{in}}}=\frac{I}{D} \qquad \omega_c=\frac{\pi}{\max(I,D)} \qquad L=N_{\text{DFT}}-M \;\text{(overlap-add)}$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on multirate signal processing, decimation, interpolation, and related topics, extracted or invented in the style of Schaum's Outline:

---

### Problem 1
**Q:** A signal \( x(n) = \cos\left(\frac{\pi n}{4}\right) \) is downsampled by a factor of \( M = 2 \). Determine the downsampled signal \( y(n) \) and sketch its spectrum before and after downsampling. Assume the original signal is bandlimited to \( \omega \in [-\pi/4, \pi/4] \).

**A:**
1. **Original Signal:**
   \( x(n) = \cos\left(\frac{\pi n}{4}\right) \).
   Its DTFT is:
   $$
   X(e^{j\omega}) = \pi \left[ \delta\left(\omega - \frac{\pi}{4}\right) + \delta\left(\omega + \frac{\pi}{4}\right) \right], \quad |\omega| \leq \pi.
   $$

2. **Downsampling by \( M = 2 \):**
   The downsampled signal is \( y(n) = x(2n) = \cos\left(\frac{\pi \cdot 2n}{4}\right) = \cos\left(\frac{\pi n}{2}\right) \).

3. **Spectrum After Downsampling:**
   Downsampling by \( M \) causes spectral replication at multiples of \( 2\pi/M = \pi \). The DTFT of \( y(n) \) is:
   $$
   Y(e^{j\omega}) = \frac{1}{2} \left[ X\left(e^{j\omega/2}\right) + X\left(e^{j(\omega/2 - \pi)}\right) \right].
   $$
   Substituting \( X(e^{j\omega}) \):
   $$
   Y(e^{j\omega}) = \frac{\pi}{2} \left[ \delta\left(\frac{\omega}{2} - \frac{\pi}{4}\right) + \delta\left(\frac{\omega}{2} + \frac{\pi}{4}\right) + \delta\left(\frac{\omega}{2} - \frac{5\pi}{4}\right) + \delta\left(\frac{\omega}{2} + \frac{3\pi}{4}\right) \right].
   $$
   Simplifying:
   $$
   Y(e^{j\omega}) = \pi \left[ \delta(\omega - \pi/2) + \delta(\omega + \pi/2) \right], \quad |\omega| \leq \pi.
   $$

4. **Sketch:**
   - Original spectrum: Two impulses at \( \pm \pi/4 \).
   - Downsampled spectrum: Two impulses at \( \pm \pi/2 \) (no aliasing since \( x(n) \) is bandlimited to \( \pi/4 \)).

---

### Problem 2
**Q:** A signal \( x(n) \) with DTFT \( X(e^{j\omega}) \) is upsampled by a factor of \( L = 3 \). Derive the DTFT of the upsampled signal \( y(n) \) in terms of \( X(e^{j\omega}) \).

**A:**
1. **Upsampling by \( L = 3 \):**
   The upsampled signal is:
   $$
   y(n) = \begin{cases}
   x\left(\frac{n}{3}\right), & n = 0, \pm 3, \pm 6, \dots, \\
   0, & \text{otherwise.}
   \end{cases}
   $$

2. **DTFT of \( y(n) \):**
   The DTFT is:
   $$
   Y(e^{j\omega}) = \sum_{n=-\infty}^{\infty} y(n) e^{-j\omega n} = \sum_{k=-\infty}^{\infty} x(k) e^{-j\omega (3k)} = X(e^{j3\omega}).
   $$

3. **Result:**
   $$
   Y(e^{j\omega}) = X(e^{j3\omega}).
   $$
   This shows spectral compression by a factor of 3, with images at \( \omega = \pm 2\pi/3, \pm 4\pi/3 \).

---

### Problem 3 (Practice)
**Q:** A signal \( x(n) = \text{sinc}(0.2n) \) is decimated by \( M = 4 \). Design a lowpass filter \( H(e^{j\omega}) \) to prevent aliasing, and sketch the spectrum of the filtered signal before and after decimation.

**A:**
1. **Original Signal:**
   \( x(n) = \text{sinc}(0.2n) \) has a DTFT \( X(e^{j\omega}) \) that is a rectangular pulse of width \( 0.4\pi \):
   $$
   X(e^{j\omega}) = \begin{cases}
   5, & |\omega| \leq 0.2\pi, \\
   0, & \text{otherwise.}
   \end{cases}
   $$

2. **Anti-Aliasing Filter:**
   To prevent aliasing, the filter must bandlimit \( x(n) \) to \( |\omega| \leq \pi/4 \). The ideal filter is:
   $$
   H(e^{j\omega}) = \begin{cases}
   1, & |\omega| \leq \pi/4, \\
   0, & \text{otherwise.}
   \end{cases}
   $$

3. **Filtered Signal:**
   The filtered signal \( v(n) \) has DTFT:
   $$
   V(e^{j\omega}) = X(e^{j\omega}) H(e^{j\omega}) = \begin{cases}
   5, & |\omega| \leq \pi/4, \\
   0, & \text{otherwise.}
   \end{cases}
   $$

4. **Decimated Signal:**
   The decimated signal \( y(n) = v(4n) \) has DTFT:
   $$
   Y(e^{j\omega}) = \frac{1}{4} \sum_{k=0}^{3} V\left(e^{j(\omega/4 - 2\pi k/4)}\right).
   $$
   Since \( V(e^{j\omega}) \) is bandlimited to \( \pi/4 \), no aliasing occurs, and:
   $$
   Y(e^{j\omega}) = \frac{5}{4}, \quad |\omega| \leq \pi.
   $$

5. **Sketch:**
   - Original: Rectangular pulse \( |\omega| \leq 0.2\pi \).
   - Filtered: Rectangular pulse \( |\omega| \leq \pi/4 \).
   - Decimated: Constant \( 5/4 \) for all \( \omega \).

---

### Problem 4
**Q:** A signal \( x(n) \) is interpolated by \( L = 2 \) and then filtered with an ideal lowpass filter \( H(e^{j\omega}) \) with cutoff \( \pi/2 \). If \( X(e^{j\omega}) \) is bandlimited to \( \pi/2 \), show that the output \( y(n) \) is equal to \( x(n) \).

**A:**
1. **Upsampling by \( L = 2 \):**
   The upsampled signal \( v(n) \) has DTFT:
   $$
   V(e^{j\omega}) = X(e^{j2\omega}).
   $$
   This compresses the spectrum by 2, creating images at \( \omega = \pm \pi \).

2. **Lowpass Filtering:**
   The filter \( H(e^{j\omega}) \) removes the images:
   $$
   Y(e^{j\omega}) = V(e^{j\omega}) H(e^{j\omega}) = X(e^{j2\omega}), \quad |\omega| \leq \pi/2.
   $$

3. **Inverse DTFT:**
   The inverse DTFT of \( Y(e^{j\omega}) \) is:
   $$
   y(n) = \frac{1}{2\pi} \int_{-\pi/2}^{\pi/2} X(e^{j2\omega}) e^{j\omega n} d\omega.
   $$
   Let \( \theta = 2\omega \):
   $$
   y(n) = \frac{1}{4\pi} \int_{-\pi}^{\pi} X(e^{j\theta}) e^{j\theta n/2} d\theta = x\left(\frac{n}{2}\right).
   $$
   For \( n \) even, \( y(n) = x(n/2) \). For \( n \) odd, \( y(n) = 0 \). Thus, \( y(2n) = x(n) \), and the output is a delayed version of \( x(n) \).

---

### Problem 5 (Practice)
**Q:** A signal \( x(n) = \delta(n) + 2\delta(n-1) + \delta(n-2) \) is passed through a system that downsamples by \( M = 2 \) and then upsamples by \( L = 2 \). Find the output \( y(n) \).

**A:**
1. **Downsampling by \( M = 2 \):**
   The downsampled signal is:
   $$
   v(n) = x(2n) = \delta(n) + \delta(n-1).
   $$

2. **Upsampling by \( L = 2 \):**
   The upsampled signal is:
   $$
   y(n) = \begin{cases}
   v\left(\frac{n}{2}\right), & n \text{ even}, \\
   0, & n \text{ odd.}
   \end{cases}
   $$
   Thus:
   $$
   y(n) = \delta(n) + \delta(n-2).
   $$

---

### Problem 6
**Q:** A signal \( x(n) \) with DTFT \( X(e^{j\omega}) \) is fractionally resampled by \( L/M = 3/2 \). Derive the DTFT of the output \( y(n) \).

**A:**
1. **Upsampling by \( L = 3 \):**
   The upsampled signal \( v(n) \) has DTFT:
   $$
   V(e^{j\omega}) = X(e^{j3\omega}).
   $$

2. **Lowpass Filtering:**
   The filter \( H(e^{j\omega}) \) has cutoff \( \pi/3 \) to remove images:
   $$
   W(e^{j\omega}) = V(e^{j\omega}) H(e^{j\omega}) = X(e^{j3\omega}), \quad |\omega| \leq \pi/3.
   $$

3. **Downsampling by \( M = 2 \):**
   The downsampled signal \( y(n) = w(2n) \) has DTFT:
   $$
   Y(e^{j\omega}) = \frac{1}{2} \left[ W\left(e^{j\omega/2}\right) + W\left(e^{j(\omega/2 - \pi)}\right) \right].
   $$
   Substituting \( W(e^{j\omega}) \):
   $$
   Y(e^{j\omega}) = \frac{1}{2} \left[ X\left(e^{j3\omega/2}\right) + X\left(e^{j(3\omega/2 - 3\pi)}\right) \right].
   $$
   Since \( X(e^{j\omega}) \) is periodic with \( 2\pi \), \( X(e^{j(3\omega/2 - 3\pi)}) = X(e^{j3\omega/2}) \), so:
   $$
   Y(e^{j\omega}) = X(e^{j3\omega/2}).
   $$

---

### Problem 7 (Practice)
**Q:** A signal \( x(n) = \cos(\pi n/3) \) is decimated by \( M = 3 \). Determine if aliasing occurs, and find the decimated signal \( y(n) \).

**A:**
1. **Original Signal:**
   \( x(n) = \cos(\pi n/3) \) has DTFT:
   $$
   X(e^{j\omega}) = \pi \left[ \delta\left(\omega - \frac{\pi}{3}\right) + \delta\left(\omega + \frac{\pi}{3}\right) \right].
   $$

2. **Downsampling by \( M = 3 \):**
   The DTFT of \( y(n) = x(3n) \) is:
   $$
   Y(e^{j\omega}) = \frac{1}{3} \sum_{k=0}^{2} X\left(e^{j(\omega/3 - 2\pi k/3)}\right).
   $$
   Substituting \( X(e^{j\omega}) \):
   $$
   Y(e^{j\omega}) = \frac{\pi}{3} \left[ \delta\left(\frac{\omega}{3} - \frac{\pi}{3}\right) + \delta\left(\frac{\omega}{3} + \frac{\pi}{3}\right) + \delta\left(\frac{\omega}{3} - \pi\right) + \delta\left(\frac{\omega}{3} + \pi\right) + \delta\left(\frac{\omega}{3} - \frac{5\pi}{3}\right) + \delta\left(\frac{\omega}{3} + \frac{5\pi}{3}\right) \right].
   $$
   Simplifying:
   $$
   Y(e^{j\omega}) = \pi \left[ \delta(\omega - \pi) + \delta(\omega + \pi) \right].
   $$

3. **Inverse DTFT:**
   The decimated signal is:
   $$
   y(n) = \cos(\pi n) = (-1)^n.
   $$
   Aliasing occurs because \( \pi/3 > \pi/3 \) (the Nyquist frequency for \( M = 3 \)).

---

### Problem 8
**Q:** A polyphase filter for decimation by \( M = 2 \) has the following structure:
   $$
   H(z) = E_0(z^2) + z^{-1} E_1(z^2).
   $$
   If \( H(z) = 1 + 2z^{-1} + 3z^{-2} + 4z^{-3} \), find \( E_0(z) \) and \( E_1(z) \).

**A:**
1. **Polyphase Components:**
   The even and odd samples of \( h(n) \) are:
   - \( e_0(n) = h(2n) = [1, 3] \),
   - \( e_1(n) = h(2n+1) = [2, 4] \).

2. **Polyphase Filters:**
   The polyphase components are:
   $$
   E_0(z) = 1 + 3z^{-1}, \quad E_1(z) = 2 + 4z^{-1}.
   $$

---

### Problem 9 (Practice)
**Q:** A signal \( x(n) \) is interpolated by \( L = 4 \) using a polyphase filter with components \( E_0(z) = 1 \), \( E_1(z) = z^{-1} \), \( E_2(z) = z^{-2} \), \( E_3(z) = z^{-3} \). Find the impulse response \( h(n) \) of the interpolation filter.

**A:**
1. **Polyphase Form:**
   The interpolation filter is:
   $$
   H(z) = E_0(z^4) + z^{-1} E_1(z^4) + z^{-2} E_2(z^4) + z^{-3} E_3(z^4).
   $$

2. **Substitute \( E_k(z) \):**
   $$
   H(z) = 1 + z^{-5} + z^{-10} + z^{-15}.
   $$

3. **Impulse Response:**
   $$
   h(n) = \delta(n) + \delta(n-5) + \delta(n-10) + \delta(n-15).
   $$

---

### Problem 10
**Q:** A two-channel filter bank has analysis filters \( H_0(z) = 1 + z^{-1} \) and \( H_1(z) = 1 - z^{-1} \). Find the synthesis filters \( G_0(z) \) and \( G_1(z) \) for perfect reconstruction.

**A:**
1. **Analysis Filter Matrix:**
   The polyphase matrix is:
   $$
   \mathbf{H}_p(z) = \begin{bmatrix}
   1 & 1 \\
   1 & -1
   \end{bmatrix}.
   $$

2. **Synthesis Filters:**
   For perfect reconstruction, \( \mathbf{G}_p(z) = \mathbf{H}_p^{-1}(z) \):
   $$
   \mathbf{G}_p(z) = \frac{1}{2} \begin{bmatrix}
   1 & 1 \\
   1 & -1
   \end{bmatrix}.
   $$

3. **Synthesis Filters:**
   $$
   G_0(z) = \frac{1}{2} (1 + z^{-1}), \quad G_1(z) = \frac{1}{2} (1 - z^{-1}).
   $$

---

### Problem 11 (Practice)
**Q:** A signal \( x(n) \) is passed through a system that upsamples by \( L = 2 \), filters with \( H(z) = 1 + z^{-1} \), and then downsamples by \( M = 2 \). Find the output \( y(n) \) if \( x(n) = \delta(n) \).

**A:**
1. **Upsampling:**
   \( v(n) = \delta(n) \).

2. **Filtering:**
   \( w(n) = v(n) + v(n-1) = \delta(n) + \delta(n-1) \).

3. **Downsampling:**
   \( y(n) = w(2n) = \delta(n) \).

---

### Problem 12
**Q:** A signal \( x(n) \) with DTFT \( X(e^{j\omega}) \) is decimated by \( M = 2 \) and then interpolated by \( L = 2 \). Show that the output \( y(n) \) is equal to \( x(n) \) if \( X(e^{j\omega}) \) is bandlimited to \( |\omega| \leq \pi/2 \).

**A:**
1. **Decimation:**
   The decimated signal \( v(n) = x(2n) \) has DTFT:
   $$
   V(e^{j\omega}) = \frac{1}{2} \left[ X\left(e^{j\omega/2}\right) + X\left(e^{j(\omega/2 - \pi)}\right) \right].
   $$
   Since \( X(e^{j\omega}) \) is bandlimited to \( \pi/2 \), \( X(e^{j(\omega/2 - \pi)}) = 0 \), so:
   $$
   V(e^{j\omega}) = \frac{1}{2} X\left(e^{j\omega/2}\right).
   $$

2. **Interpolation:**
   The upsampled signal \( w(n) \) has DTFT:
   $$
   W(e^{j\omega}) = V(e^{j2\omega}) = \frac{1}{2} X(e^{j\omega}).
   $$

3. **Lowpass Filtering:**
   The filter \( H(e^{j\omega}) \) with cutoff \( \pi/2 \) removes images:
   $$
   Y(e^{j\omega}) = W(e^{j\omega}) H(e^{j\omega}) = \frac{1}{2} X(e^{j\omega}) \cdot 2 = X(e^{j\omega}).
   $$
   Thus, \( y(n) = x(n) \).

---

### Problem 13 (Practice)
**Q:** A signal \( x(n) = \text{sinc}(0.1n) \) is decimated by \( M = 5 \). Design an anti-aliasing filter \( H(e^{j\omega}) \) and find the decimated signal's DTFT.

**A:**
1. **Original Signal:**
   \( X(e^{j\omega}) \) is a rectangular pulse of width \( 0.2\pi \).

2. **Anti-Aliasing Filter:**
   \( H(e^{j\omega}) \) must bandlimit to \( |\omega| \leq \pi/5 \):
   $$
   H(e^{j\omega}) = \begin{cases}
   1, & |\omega| \leq \pi/5, \\
   0, & \text{otherwise.}
   \end{cases}
   $$

3. **Filtered Signal:**
   \( V(e^{j\omega}) = X(e^{j\omega}) H(e^{j\omega}) \) is a rectangular pulse of width \( \pi/5 \).

4. **Decimated Signal:**
   The DTFT of \( y(n) = v(5n) \) is:
   $$
   Y(e^{j\omega}) = \frac{1}{5} \sum_{k=0}^{4} V\left(e^{j(\omega/5 - 2\pi k/5)}\right).
   $$
   Since \( V(e^{j\omega}) \) is bandlimited to \( \pi/5 \), no aliasing occurs, and:
   $$
   Y(e^{j\omega}) = \frac{1}{5}, \quad |\omega| \leq \pi.
   $$

---

### Problem 14
**Q:** A signal \( x(n) \) is fractionally resampled by \( L/M = 2/3 \). Derive the DTFT of the output \( y(n) \) in terms of \( X(e^{j\omega}) \).

**A:**
1. **Upsampling by \( L = 2 \):**
   \( V(e^{j\omega}) = X(e^{j2\omega}) \).

2. **Lowpass Filtering:**
   \( W(e^{j\omega}) = V(e^{j\omega}) H(e^{j\omega}) = X(e^{j2\omega}), \quad |\omega| \leq \pi/2 \).

3. **Downsampling by \( M = 3 \):**
   The DTFT of \( y(n) = w(3n) \) is:
   $$
   Y(e^{j\omega}) = \frac{1}{3} \sum_{k=0}^{2} W\left(e^{j(\omega/3 - 2\pi k/3)}\right) = \frac{1}{3} \sum_{k=0}^{2} X\left(e^{j(2\omega/3 - 4\pi k/3)}\right).
   $$

---

### Problem 15 (Practice)
**Q:** A signal \( x(n) = \delta(n) + \delta(n-1) \) is passed through a system that downsamples by \( M = 2 \) and then upsamples by \( L = 2 \). Find the output \( y(n) \) and its DTFT.

**A:**
1. **Downsampling:**
   \( v(n) = x(2n) = \delta(n) \).

2. **Upsampling:**
   \( y(n) = \begin{cases}
   v(n/2), & n \text{ even}, \\
   0, & n \text{ odd.}
   \end{cases} = \delta(n) \).

3. **DTFT:**
   \( Y(e^{j\omega}) = 1 \).
