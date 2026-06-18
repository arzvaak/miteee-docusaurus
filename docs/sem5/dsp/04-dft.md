# Weeks 4–5 — DFT & Its Properties

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. DFT & IDFT Definitions

$$\boxed{X[k]=\sum_{n=0}^{N-1}x[n]\,W_N^{nk}} \qquad W_N=e^{-j2\pi/N}$$

$$x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]\,W_N^{-nk}$$

The DFT is a **sampled version of the DTFT** at $N$ equally spaced frequencies $\omega_k=2\pi k/N$.

$$X(e^{j\omega})=\sum_{n=-\infty}^{\infty}x[n]\,e^{-j\omega n} \qquad \text{(DTFT — continuous frequency)}$$

---

## 2. Key DFT Properties

| Property | Time domain | Frequency domain |
|----------|-------------|-----------------|
| Linearity | $ax_1[n]+bx_2[n]$ | $aX_1[k]+bX_2[k]$ |
| Circular shift | $x[(n-m)_N]$ | $W_N^{mk}X[k]$ |
| Circular convolution | $x_1[n]\circledast x_2[n]$ | $X_1[k]\cdot X_2[k]$ |
| Multiplication | $x_1[n]\cdot x_2[n]$ | $\tfrac{1}{N}X_1[k]\circledast X_2[k]$ |
| Periodicity | $x[n]=x[n+N]$ | $X[k]=X[k+N]$ |
| Conjugate symmetry (real $x[n]$) | — | $X[k]=X^*[N-k]$ |
| Real even $x[n]$ | — | $X[k]$ purely real |
| Real odd $x[n]$ | — | $X[k]$ purely imaginary |

> **Recall trap:** Periodicity means $X[10]$ for an 8-point DFT $= X[10-8]=X[2]$.

---

## 3. Symmetry of Real DFT

For real $x[n]$: $X[N-k]=X^*[k]$

**Example (Q2):** 8-point DFT, first 5 values given. Find remaining 3:

$$X[5]=X^*[3]=0.125+j0.0518 \qquad X[6]=X^*[2]=0 \qquad X[7]=X^*[1]=0.125+j0.3018$$ ✅

---

## 4. DFT Computation — 4-Point Example

**Given:** $x[n]=\{1,2,3,4\}$

$$X[k]=\sum_{n=0}^{3}x[n]\,e^{-j2\pi nk/4}$$

- $X[0]=1+2+3+4=10$
- $X[1]=1+2e^{-j\pi/2}+3e^{-j\pi}+4e^{-j3\pi/2}=1-2j-3+4j=-2+2j$
- $X[2]=1-2+3-4=-2$
- $X[3]=X^*[1]=-2-2j$

$$\boxed{X[k]=\{10,\,-2+2j,\,-2,\,-2-2j\}}$$ ✅

---

## 5. DFT of Impulse Sum

$$X[k]=\sum_i a_i\,e^{-j2\pi k n_i/N}$$

**Example (Q4):** 8-point DFT of $x[n]=2\delta[n]+\delta[n-1]-3\delta[n-3]$:

$$X[k]=2\cdot e^0+e^{-j2\pi k/8}-3\cdot e^{-j6\pi k/8}$$ ✅

---

## 6. DFT of Complex Exponential

For $x[n]=e^{j\omega_0 n}$ ($N$-point DFT):

$$X[k]=\frac{1-e^{j\omega_0 N}}{1-e^{j(\omega_0-2\pi k/N)}}$$

**Special case:** if $\omega_0=2\pi k_0/N$:
$$\boxed{X[k]=N\,\delta_N[k-k_0]}$$ ✅

---

## 7. Circular Convolution

$$x_3[m]=\sum_{n=0}^{N-1}x_1[n]\,x_2[(m-n)_N]$$

**Best exam method:** Compute DFT of both → multiply → IDFT.

**Manual method for Final Exam Tutorial Q1:** $x_1=\{1,2,0,1\}$, $x_2=\{4,0,2,2\}$, $N=4$

**Step 1:** Compute $x_3[m]$ by circular shift of $x_2$:
- $m=0$: shifted $x_2=\{4,2,2,0\}$ → $x_3[0]=1\cdot4+2\cdot2+0\cdot2+1\cdot0=8$
- $m=1$: shifted $x_2=\{0,4,2,2\}$ → $x_3[1]=1\cdot0+2\cdot4+0\cdot2+1\cdot2=10$
- $m=2$: shifted $x_2=\{2,0,4,2\}$ → $x_3[2]=1\cdot2+2\cdot0+0\cdot4+1\cdot2=4$
- $m=3$: shifted $x_2=\{2,2,0,4\}$ → $x_3[3]=1\cdot2+2\cdot2+0\cdot0+1\cdot4=10$

$$x_3=\{8,10,4,10\}$$ ✅

---

## 8. Inverse DFT — Single Frequency

$X[k]=1$ only at $k=k_0$, else 0. Find $x[n]$:

$$x[n]=\frac{1}{N}W_N^{-nk_0}=\frac{1}{N}e^{j2\pi nk_0/N}$$ ✅

---

## 9. DFT of 5-Point Real Sequence (Q5)

$X[0]=4$, $X[1]=1-2j$, $X[3]=3+j$. Using symmetry:

$X[4]=X^*[1]=1+2j$, $X[2]=X^*[3]=3-j$

$$x[0]=\frac{1}{5}(4+(1-2j)+(3-j)+(3+j)+(1+2j))=\frac{12}{5}$$ ✅

---

## 10. Frequency Resolution & Bin Mapping

$$\boxed{\Delta f = \frac{F_s}{N} \text{ (Hz/bin)}}$$

**Example (Q10):** 512-point DFT, $F_s=12$ kHz: $\Delta f=12000/512\approx23$ Hz ✅

**Bin index:** $k=F_1\cdot N/F_s$ (e.g. 1 kHz, $N=1024$, $F_s=16$ kHz → $k=64$)

---

## 11. Circular Even/Odd

A sequence is **circularly even** if $x[n]=x[N-n]$.

**Example:** $x[n]=\{4,3,2,1\}$: Is $x[1]=3=x[3]=1$? No → not circularly even ✅

---

## 12. DFT vs FFT Complexity

| Method | Complex Multiplications | Complex Additions |
|--------|------------------------|------------------|
| Direct DFT | $N^2$ | $N(N-1)$ |
| Radix-2 FFT | $\dfrac{N}{2}\log_2 N$ | $N\log_2 N$ |

For $N=1024$: Direct DFT $=1024^2=1{,}048{,}576$ multiplications ✅

---

## 13. Key MCQs

| Question | Answer |
|---------|--------|
| 4-point DFT of $\{1,2,3,4\}$ | $\{10,-2+2j,-2,-2-2j\}$ ✅ |
| Remaining 3 pts of 8-pt real DFT | $\{0.125+j0.0518,\;0,\;0.125+j0.3018\}$ ✅ |
| IDFT of $X[k]=1$ at $k=k_0$ only | $\frac{1}{N}e^{j2\pi nk_0/N}$ ✅ |
| $X[2+8]$ for 8-point DFT | $X[2]$ ✅ |
| 5-point DFT, $X[0]=4,X[1]=1-2j,X[3]=3+j$, find $x[0]$ | $12/5$ ✅ |
| DFT of $e^{j\omega_0 n}$ when $\omega_0=2\pi k_0/N$ | $N\,\delta_N(k-k_0)$ ✅ |
| $\{4,3,2,1\}$ is 4-point circularly even? | No ✅ |
| 512-point DFT, $F_s=12$ kHz: frequency resolution | 23 Hz ✅ |
| Real odd sequence DFT is | Purely imaginary ✅ |

---

## Formula Sheet — Weeks 4–5

$$X[k]=\sum_{n=0}^{N-1}x[n]\,W_N^{nk} \qquad x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]\,W_N^{-nk}$$

$$X[N-k]=X^*[k] \text{ (real }x)\qquad \Delta f=F_s/N \qquad k=F\cdot N/F_s$$

$$x_3[m]=\text{IDFT}(X_1[k]\cdot X_2[k]) \text{ (circular conv)}$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on DFT, IDFT, circular convolution, DFT properties, frequency resolution, spectral leakage, and windowing for DFT, extracted and invented in the style of Schaum's Outline.

---

### Problem 1
**Q:** Compute the 8-point DFT of the sequence:
$$
x(n) = \cos\left(\frac{2\pi n}{8}\right), \quad n = 0, 1, \dots, 7
$$

**A:**
1. Express the cosine as a sum of complex exponentials:
   $$
   x(n) = \frac{1}{2} e^{j \frac{2\pi n}{8}} + \frac{1}{2} e^{-j \frac{2\pi n}{8}} = \frac{1}{2} e^{j \frac{2\pi n}{8}} + \frac{1}{2} e^{j \frac{2\pi n (7)}{8}}
   $$
   (since \( e^{-j \frac{2\pi n}{8}} = e^{j \frac{2\pi n (7)}{8}} \) for \( N = 8 \)).

2. The DFT of \( x(n) \) is:
   $$
   X(k) = \sum_{n=0}^{7} x(n) e^{-j \frac{2\pi}{8} nk}
   $$
   Substitute \( x(n) \):
   $$
   X(k) = \frac{1}{2} \sum_{n=0}^{7} e^{j \frac{2\pi n}{8}} e^{-j \frac{2\pi}{8} nk} + \frac{1}{2} \sum_{n=0}^{7} e^{j \frac{2\pi n (7)}{8}} e^{-j \frac{2\pi}{8} nk}
   $$
   Simplify the exponents:
   $$
   X(k) = \frac{1}{2} \sum_{n=0}^{7} e^{-j \frac{2\pi}{8} n(k-1)} + \frac{1}{2} \sum_{n=0}^{7} e^{-j \frac{2\pi}{8} n(k-7)}
   $$

3. The sum of a complex exponential over a full period is zero unless the exponent is zero:
   - For the first term, \( X(k) = 4 \) when \( k = 1 \).
   - For the second term, \( X(k) = 4 \) when \( k = 7 \).
   - Otherwise, \( X(k) = 0 \).

4. Thus:
   $$
   X(k) = \begin{cases}
   4 & k = 1, 7 \\
   0 & \text{otherwise}
   \end{cases}
   $$

---

### Problem 2
**Q:** Compute the 4-point IDFT of:
$$
X(k) = \{3, 1 - j, -1, 1 + j\}
$$

**A:**
1. The IDFT formula is:
   $$
   x(n) = \frac{1}{4} \sum_{k=0}^{3} X(k) e^{j \frac{2\pi}{4} nk}
   $$

2. Compute \( x(n) \) for \( n = 0, 1, 2, 3 \):
   - For \( n = 0 \):
     $$
     x(0) = \frac{1}{4} \left( 3 + (1 - j) + (-1) + (1 + j) \right) = \frac{1}{4} (4) = 1
     $$
   - For \( n = 1 \):
     $$
     x(1) = \frac{1}{4} \left( 3 + (1 - j)e^{j \frac{\pi}{2}} + (-1)e^{j \pi} + (1 + j)e^{j \frac{3\pi}{2}} \right)
     $$
     Simplify:
     $$
     e^{j \frac{\pi}{2}} = j, \quad e^{j \pi} = -1, \quad e^{j \frac{3\pi}{2}} = -j
     $$
     $$
     x(1) = \frac{1}{4} \left( 3 + (1 - j)j + (-1)(-1) + (1 + j)(-j) \right) = \frac{1}{4} (3 + j + 1 - 1 + j + 1) = \frac{1}{4} (4 + 2j) = 1 + \frac{j}{2}
     $$
   - For \( n = 2 \):
     $$
     x(2) = \frac{1}{4} \left( 3 + (1 - j)e^{j \pi} + (-1)e^{j 2\pi} + (1 + j)e^{j 3\pi} \right)
     $$
     Simplify:
     $$
     e^{j \pi} = -1, \quad e^{j 2\pi} = 1, \quad e^{j 3\pi} = -1
     $$
     $$
     x(2) = \frac{1}{4} \left( 3 + (1 - j)(-1) + (-1)(1) + (1 + j)(-1) \right) = \frac{1}{4} (3 - 1 + j - 1 - 1 - j) = 0
     $$
   - For \( n = 3 \):
     $$
     x(3) = \frac{1}{4} \left( 3 + (1 - j)e^{j \frac{3\pi}{2}} + (-1)e^{j 3\pi} + (1 + j)e^{j \frac{9\pi}{2}} \right)
     $$
     Simplify:
     $$
     e^{j \frac{3\pi}{2}} = -j, \quad e^{j 3\pi} = -1, \quad e^{j \frac{9\pi}{2}} = j
     $$
     $$
     x(3) = \frac{1}{4} \left( 3 + (1 - j)(-j) + (-1)(-1) + (1 + j)(j) \right) = \frac{1}{4} (3 + j + 1 + 1 + j - 1) = \frac{1}{4} (4 + 2j) = 1 - \frac{j}{2}
     $$

3. Thus:
   $$
   x(n) = \{1, 1 + \frac{j}{2}, 0, 1 - \frac{j}{2}\}
   $$

---

### Problem 3
**Q:** Compute the 6-point circular convolution of:
$$
x(n) = \{1, 2, 3, 0, 0, 0\}, \quad h(n) = \{1, 1, 1, 0, 0, 0\}
$$

**A:**
1. The circular convolution is given by:
   $$
   y(n) = \sum_{k=0}^{5} x(k) h((n - k))_6
   $$

2. Compute \( y(n) \) for \( n = 0, 1, \dots, 5 \):
   - For \( n = 0 \):
     $$
     y(0) = x(0)h(0) + x(1)h(5) + x(2)h(4) + x(3)h(3) + x(4)h(2) + x(5)h(1) = 1 \cdot 1 + 2 \cdot 0 + 3 \cdot 0 + 0 \cdot 0 + 0 \cdot 1 + 0 \cdot 1 = 1
     $$
   - For \( n = 1 \):
     $$
     y(1) = x(0)h(1) + x(1)h(0) + x(2)h(5) + x(3)h(4) + x(4)h(3) + x(5)h(2) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 0 + 0 \cdot 0 + 0 \cdot 0 + 0 \cdot 1 = 3
     $$
   - For \( n = 2 \):
     $$
     y(2) = x(0)h(2) + x(1)h(1) + x(2)h(0) + x(3)h(5) + x(4)h(4) + x(5)h(3) = 1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 + 0 \cdot 0 + 0 \cdot 0 + 0 \cdot 0 = 6
     $$
   - For \( n = 3 \):
     $$
     y(3) = x(0)h(3) + x(1)h(2) + x(2)h(1) + x(3)h(0) + x(4)h(5) + x(5)h(4) = 1 \cdot 0 + 2 \cdot 1 + 3 \cdot 1 + 0 \cdot 1 + 0 \cdot 0 + 0 \cdot 0 = 5
     $$
   - For \( n = 4 \):
     $$
     y(4) = x(0)h(4) + x(1)h(3) + x(2)h(2) + x(3)h(1) + x(4)h(0) + x(5)h(5) = 1 \cdot 0 + 2 \cdot 0 + 3 \cdot 1 + 0 \cdot 1 + 0 \cdot 1 + 0 \cdot 0 = 3
     $$
   - For \( n = 5 \):
     $$
     y(5) = x(0)h(5) + x(1)h(4) + x(2)h(3) + x(3)h(2) + x(4)h(1) + x(5)h(0) = 1 \cdot 0 + 2 \cdot 0 + 3 \cdot 0 + 0 \cdot 1 + 0 \cdot 1 + 0 \cdot 1 = 0
     $$

3. Thus:
   $$
   y(n) = \{1, 3, 6, 5, 3, 0\}
   $$

---

### Problem 4 (Practice)
**Q:** Prove the time-shifting property of the DFT: If \( x(n) \) has DFT \( X(k) \), then \( x((n - m))_N \) has DFT \( X(k) e^{-j \frac{2\pi}{N} km} \).

**A:**
1. The DFT of \( x((n - m))_N \) is:
   $$
   Y(k) = \sum_{n=0}^{N-1} x((n - m))_N e^{-j \frac{2\pi}{N} nk}
   $$

2. Let \( l = (n - m) \mod N \). Then \( n = (l + m) \mod N \), and the sum becomes:
   $$
   Y(k) = \sum_{l=0}^{N-1} x(l) e^{-j \frac{2\pi}{N} (l + m)k} = e^{-j \frac{2\pi}{N} mk} \sum_{l=0}^{N-1} x(l) e^{-j \frac{2\pi}{N} lk}
   $$

3. The sum is \( X(k) \), so:
   $$
   Y(k) = X(k) e^{-j \frac{2\pi}{N} mk}
   $$

---

### Problem 5
**Q:** A signal \( x(n) = \cos(0.2\pi n) \) is sampled for \( n = 0, 1, \dots, 9 \). Compute its 10-point DFT and explain the spectral leakage observed.

**A:**
1. Express \( x(n) \) as:
   $$
   x(n) = \frac{1}{2} e^{j 0.2\pi n} + \frac{1}{2} e^{-j 0.2\pi n}
   $$

2. The DFT is:
   $$
   X(k) = \frac{1}{2} \sum_{n=0}^{9} e^{j 0.2\pi n} e^{-j \frac{2\pi}{10} nk} + \frac{1}{2} \sum_{n=0}^{9} e^{-j 0.2\pi n} e^{-j \frac{2\pi}{10} nk}
   $$
   Simplify:
   $$
   X(k) = \frac{1}{2} \sum_{n=0}^{9} e^{-j \frac{2\pi}{10} n(k - 1)} + \frac{1}{2} \sum_{n=0}^{9} e^{-j \frac{2\pi}{10} n(k + 1)}
   $$

3. The first term is nonzero when \( k = 1 \), and the second term is nonzero when \( k = 9 \). However, \( 0.2\pi \) is not an integer multiple of \( \frac{2\pi}{10} \), so the DFT coefficients are not impulses. Instead, spectral leakage occurs, spreading energy across multiple \( k \).

4. Compute \( X(k) \) using the geometric series formula:
   $$
   X(k) = \frac{1}{2} \frac{1 - e^{-j 2\pi (k - 1)}}{1 - e^{-j \frac{2\pi}{10} (k - 1)}} + \frac{1}{2} \frac{1 - e^{-j 2\pi (k + 1)}}{1 - e^{-j \frac{2\pi}{10} (k + 1)}}
   $$
   This results in nonzero values for all \( k \), demonstrating spectral leakage.

---

### Problem 6 (Practice)
**Q:** A signal \( x(n) = \sin(0.3\pi n) \) is windowed with a 16-point rectangular window. Compute the DFT and compare it to the case where a Hann window is used.

**A:**
1. The rectangular window is \( w_R(n) = 1 \) for \( n = 0, 1, \dots, 15 \). The DFT of \( x(n)w_R(n) \) will exhibit spectral leakage due to the abrupt truncation.

2. The Hann window is:
   $$
   w_H(n) = 0.5 \left(1 - \cos\left(\frac{2\pi n}{15}\right)\right), \quad n = 0, 1, \dots, 15
   $$
   The DFT of \( x(n)w_H(n) \) will have reduced spectral leakage due to the smoother tapering of the window.

3. Compute the DFT for both cases:
   - For the rectangular window, the DFT will have high sidelobes.
   - For the Hann window, the sidelobes are suppressed, but the main lobe is wider.

---

### Problem 7
**Q:** Compute the 8-point DFT of \( x(n) = \{1, 1, 1, 1, 0, 0, 0, 0\} \) and verify Parseval's theorem.

**A:**
1. The DFT is:
   $$
   X(k) = \sum_{n=0}^{7} x(n) e^{-j \frac{2\pi}{8} nk} = \sum_{n=0}^{3} e^{-j \frac{2\pi}{8} nk}
   $$

2. Compute \( X(k) \) for \( k = 0, 1, \dots, 7 \):
   - For \( k = 0 \):
     $$
     X(0) = 4
     $$
   - For \( k = 1 \):
     $$
     X(1) = 1 + e^{-j \frac{\pi}{4}} + e^{-j \frac{\pi}{2}} + e^{-j \frac{3\pi}{4}} = 1 + \frac{1 - j}{\sqrt{2}} - j + \frac{-1 - j}{\sqrt{2}} = 1 - j - \frac{2j}{\sqrt{2}} = 1 - j(1 + \sqrt{2})
     $$
   - For \( k = 2 \):
     $$
     X(2) = 1 + e^{-j \pi} + e^{-j 2\pi} + e^{-j 3\pi} = 1 - 1 + 1 - 1 = 0
     $$
   - For \( k = 4 \):
     $$
     X(4) = 1 + e^{-j 2\pi} + e^{-j 4\pi} + e^{-j 6\pi} = 4
     $$
   - For other \( k \), \( X(k) \) is the complex conjugate of \( X(8 - k) \).

3. Verify Parseval's theorem:
   $$
   \sum_{n=0}^{7} |x(n)|^2 = 4, \quad \frac{1}{8} \sum_{k=0}^{7} |X(k)|^2 = \frac{1}{8} (16 + 2|X(1)|^2 + 2|X(3)|^2 + 16) = 4
   $$

---

### Problem 8 (Practice)
**Q:** A signal \( x(n) = \delta(n) + \delta(n - 1) \) is zero-padded to length 8. Compute its 8-point DFT and explain the effect of zero-padding.

**A:**
1. The zero-padded signal is \( x(n) = \{1, 1, 0, 0, 0, 0, 0, 0\} \).

2. The DFT is:
   $$
   X(k) = 1 + e^{-j \frac{2\pi}{8} k}
   $$

3. Zero-padding increases the frequency resolution (more DFT points) but does not add new information. The DFT interpolates the DTFT of the original signal.

---

### Problem 9
**Q:** Compute the circular convolution of \( x(n) = \{1, 2, 3\} \) and \( h(n) = \{1, 1, 1\} \) using the DFT method.

**A:**
1. Zero-pad \( x(n) \) and \( h(n) \) to length 3:
   $$
   x(n) = \{1, 2, 3\}, \quad h(n) = \{1, 1, 1\}
   $$

2. Compute the 3-point DFTs:
   - \( X(k) = \{6, -1.5 + j0.866, -1.5 - j0.866\} \)
   - \( H(k) = \{3, 0, 0\} \)

3. Multiply the DFTs:
   $$
   Y(k) = X(k)H(k) = \{18, 0, 0\}
   $$

4. Compute the IDFT:
   $$
   y(n) = \{6, 6, 6\}
   $$

---

### Problem 10 (Practice)
**Q:** A signal \( x(n) = \cos(0.4\pi n) \) is sampled for \( n = 0, 1, \dots, 9 \). Compute its 10-point DFT and explain why spectral leakage occurs.

**A:**
1. The frequency \( 0.4\pi \) is not an integer multiple of \( \frac{2\pi}{10} \), so the DFT does not align with a bin.

2. The DFT will have nonzero values for all \( k \), with peaks near \( k = 2 \) and \( k = 8 \), demonstrating spectral leakage.

---

### Problem 11
**Q:** Compute the 4-point DFT of \( x(n) = \{1, -1, 1, -1\} \) and verify the periodicity property.

**A:**
1. The DFT is:
   $$
   X(k) = 1 - e^{-j \frac{2\pi}{4} k} + e^{-j \frac{2\pi}{4} 2k} - e^{-j \frac{2\pi}{4} 3k}
   $$

2. Compute \( X(k) \):
   - \( X(0) = 0 \)
   - \( X(1) = 4 \)
   - \( X(2) = 0 \)
   - \( X(3) = 0 \)

3. Verify periodicity: \( X(k + 4) = X(k) \).

---

### Problem 12 (Practice)
**Q:** A signal \( x(n) = \delta(n) + \delta(n - 2) \) is windowed with a 4-point Hann window. Compute its DFT and compare it to the rectangular window case.

**A:**
1. The Hann window is:
   $$
   w_H(n) = 0.5 \left(1 - \cos\left(\frac{2\pi n}{3}\right)\right), \quad n = 0, 1, 2, 3
   $$

2. The windowed signal is:
   $$
   x(n)w_H(n) = \{0.5, 0, 0.5, 0\}
   $$

3. The DFT is:
   $$
   X(k) = 0.5 + 0.5 e^{-j \pi k}
   $$

4. Compare to the rectangular window case, where \( X(k) = 1 + e^{-j \pi k} \). The Hann window reduces sidelobes but widens the main lobe.

---

### Problem 13
**Q:** Compute the 8-point IDFT of \( X(k) = \{8, 0, 0, 0, 0, 0, 0, 0\} \).

**A:**
1. The IDFT is:
   $$
   x(n) = \frac{1}{8} \sum_{k=0}^{7} X(k) e^{j \frac{2\pi}{8} nk} = \frac{1}{8} \cdot 8 = 1
   $$

2. Thus:
   $$
   x(n) = \{1, 1, 1, 1, 1, 1, 1, 1\}
   $$

---

### Problem 14 (Practice)
**Q:** A signal \( x(n) = \cos(0.5\pi n) \) is sampled for \( n = 0, 1, \dots, 7 \). Compute its 8-point DFT and explain the absence of spectral leakage.

**A:**
1. The frequency \( 0.5\pi \) is an integer multiple of \( \frac{2\pi}{8} \) (specifically, \( k = 2 \)).

2. The DFT will have impulses at \( k = 2 \) and \( k = 6 \), with no spectral leakage.

---

### Problem 15
**Q:** Compute the circular convolution of \( x(n) = \{1, 2, 3, 4\} \) and \( h(n) = \{1, 0, 1, 0\} \) using the DFT method.

**A:**
1. Zero-pad \( x(n) \) and \( h(n) \) to length 4:
   $$
   x(n) = \{1, 2, 3, 4\}, \quad h(n) = \{1, 0, 1, 0\}
   $$

2. Compute the 4-point DFTs:
   - \( X(k) = \{10, -2 + 2j, -2, -2 - 2j\} \)
   - \( H(k) = \{2, 0, 2, 0\} \)

3. Multiply the DFTs:
   $$
   Y(k) = X(k)H(k) = \{20, 0, -4, 0\}
   $$

4. Compute the IDFT:
   $$
   y(n) = \{4, 6, 4, 6\}
   $$
