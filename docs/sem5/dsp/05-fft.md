# Weeks 6–7 — Spectral Analysis, STFT & FFT Algorithms

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## PART A: Spectral Analysis & STFT (Week 6)

---

## 1. Frequency Resolution

$$\boxed{\Delta f = \frac{F_s}{N} = \frac{1}{L\cdot T_s} = \frac{F_s}{L}}$$

where $L$ = window length, $N$ = DFT size.

**Example (Q1):** Rectangular window, 40 ms duration, $F_s=8$ kHz:
$$\Delta f=\frac{1}{0.040}=25 \text{ Hz}$$ ✅

---

## 2. Window Functions

| Window | Main lobe width | Sidelobe | Best for |
|--------|----------------|----------|---------|
| **Rectangular** | **Narrowest** | Highest | **Best frequency resolution** |
| Hanning | Wider | Lower | — |
| Hamming | Wider | Lower | Practical FIR design |
| Blackman | Widest | Lowest | Minimum sidelobe leakage |

> **Recall trap:** Rectangular window = best frequency resolution (narrowest main lobe), but worst sidelobe leakage. Better resolution ≠ better window.

---

## 3. Short-Time Fourier Transform (STFT)

$$X(n,\omega)=\sum_{m=-\infty}^{\infty}x[m]\,w[n-m]\,e^{-j\omega m}$$

- Windowed DFT: analyses signal in short frames
- Bandwidth of each analysis filter = $F_s/N$
- Center frequency of $k$-th filter = $k\cdot F_s/N$

**FBS Reconstruction:** Possible if $w[n]$ is finite AND $X(n,\omega_k)$ is properly sampled.

---

## 4. Resolvability of Two Frequency Components

Two components separated by $\Delta F$ Hz are resolvable when:

$$\boxed{L \geq \frac{F_s}{\Delta F}}$$

**Example (Q6):** $x[n]=6\cos(0.2\pi n)+15\cos(0.4\pi n)$, $F_s=16$ kHz
- $F_1=1600$ Hz, $F_2=3200$ Hz, $\Delta F=1600$ Hz
- Min $L=16000/1600=10$ ✅

---

## 5. Discrete Cosine Transform (DCT)

$$C(i,j)=\frac{k(i)k(j)}{\sqrt{2N}}\sum_{x,y}I(x,y)\cos\frac{(2x+1)i\pi}{2N}\cos\frac{(2y+1)j\pi}{2N}$$

where $k(0)=1/\sqrt{2}$, $k(n)=1$ for $n\neq0$.

- **DCT vs DFT:** DCT has **better energy compaction** (most energy in few low-frequency terms)
- **DFT disadvantages:** Complex output, poor energy compaction ✅
- **Most used for image compression:** 2D DCT ✅

---

## PART B: FFT Algorithms (Week 7)

---

## 6. FFT Complexity

| Algorithm | Complex Multiplications | Complex Additions |
|-----------|------------------------|------------------|
| Direct DFT | $N^2$ | $N(N-1)$ |
| Radix-2 FFT | $\dfrac{N}{2}\log_2 N$ | $N\log_2 N$ |

**Example:** $N=512$: multiplications $=256\times9=2304$; additions $=512\times9=4608$ ✅

**Example:** $N=1024$: butterfly computations $=\frac{1024}{2}\times10=5120$ ✅

---

## 7. Radix-2 DIT vs DIF

| Feature | DIT (Decimation-in-Time) | DIF (Decimation-in-Frequency) |
|---------|--------------------------|-------------------------------|
| Input order | **Bit-reversed** | Normal |
| Output order | Normal | **Bit-reversed** |

> **Recall trap:** DIT = **bit-reversed input**, normal output. DIF = normal input, bit-reversed output.

**DIT butterfly ($k$-th stage):**
$$A' = A + W_N^k B \qquad B' = A - W_N^k B$$

**DIT output equations:**
$$X[k]=F_1[k]+W_N^k F_2[k] \qquad X[k+N/2]=F_1[k]-W_N^k F_2[k]$$

---

## 8. Divide-and-Conquer ($N=M\times L$)

**Steps (must know the order):**

**Step 1:** Store $x[n]$ **row-wise** in array of $L$ rows, $M$ columns (mapping $n=M\ell+m$)

**Step 2:** Compute $M$-point DFT of each **row**

**Step 3:** Multiply by twiddle factors $W_N^{km\ell}$

**Step 4:** Compute $L$-point DFT of each **column**

**Step 5:** Read output **column-wise**

> **Recall trap:** Store row-wise → DFT rows → twiddle → DFT columns → read columns. Don't reverse steps.

**Complexity:** $N(M+L)$ vs $N^2$ for direct DFT

**Example (Q1):** $N=88=8\times11$, $M=8$, $L=11$: array is $L\times M=11$ rows, 8 columns ✅

**Example (Q3):** $N=1000=40\times25$, complex multiplications $=66000$ ✅

---

## 9. Key MCQs

| Question | Answer |
|---------|--------|
| Best frequency resolution window | Rectangular ✅ |
| DCT vs DFT energy compaction | DCT better ✅ |
| Most used for image compression | 2D DCT ✅ |
| DFT disadvantage | Complex output, poor energy compaction ✅ |
| 1024-point FFT butterfly count | 5120 ✅ |
| 512-point DIT FFT complex additions | 4608 ✅ |
| DIT input order | Bit-reversed ✅ |
| DIF output order | Bit-reversed ✅ |
| $N=8\times11$ D&C array | 11 rows, 8 columns ✅ |
| D&C correct step order | Row-store → M-DFT → twiddle → L-DFT → column-read ✅ |
| First $N/2$ DIT FFT outputs | $F_1[k]+W_N^k F_2[k]$ ✅ |
| Second $N/2$ DIT FFT outputs | $F_1[k]-W_N^k F_2[k]$ ✅ |
| FBS reconstruction condition | Finite $w[n]$ + properly sampled $X(n,\omega_k)$ ✅ |

---

## Formula Sheet — Weeks 6–7

$$\Delta f=F_s/N \qquad L_{\min}=F_s/\Delta F \text{ (resolvability)}$$

$$\text{FFT multiplications: }\frac{N}{2}\log_2 N \qquad \text{FFT additions: }N\log_2 N$$

$$X[k]=F_1[k]+W_N^k F_2[k] \qquad X[k+N/2]=F_1[k]-W_N^k F_2[k]$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

### Problem 1
**Q:** Compute the 8-point Decimation-in-Time (DIT) FFT of the sequence \( x(n) = \{1, 1, 1, 1, 0, 0, 0, 0\} \). Show all butterfly computations and twiddle factors.

**A:**
**Step 1: Bit-reverse the input sequence**
The 8-point DIT FFT requires the input to be in bit-reversed order:
Original index: \( 0, 1, 2, 3, 4, 5, 6, 7 \)
Bit-reversed index: \( 0, 4, 2, 6, 1, 5, 3, 7 \)
Bit-reversed sequence: \( x(n) = \{1, 0, 1, 0, 1, 0, 1, 0\} \)

**Step 2: Stage 1 (2-point DFTs)**
Compute 4 independent 2-point DFTs:
\[
X_1(k) = \sum_{n=0}^{1} x(2n + m) W_2^{nk}, \quad m = 0, 1, 2, 3
\]
For \( m = 0 \):
\[
X_1(0) = x(0) + x(4) = 1 + 1 = 2
\]
\[
X_1(1) = x(0) - x(4) = 1 - 1 = 0
\]
For \( m = 1 \):
\[
X_1(0) = x(2) + x(6) = 1 + 1 = 2
\]
\[
X_1(1) = x(2) - x(6) = 1 - 1 = 0
\]
For \( m = 2 \):
\[
X_1(0) = x(1) + x(5) = 0 + 0 = 0
\]
\[
X_1(1) = x(1) - x(5) = 0 - 0 = 0
\]
For \( m = 3 \):
\[
X_1(0) = x(3) + x(7) = 0 + 0 = 0
\]
\[
X_1(1) = x(3) - x(7) = 0 - 0 = 0
\]
Intermediate result: \( \{2, 0, 2, 0, 0, 0, 0, 0\} \)

**Step 3: Stage 2 (4-point DFTs)**
Combine 2-point DFTs into 4-point DFTs using twiddle factors \( W_4^k = e^{-j2\pi k/4} \):
For \( k = 0, 1 \):
\[
X_2(0) = X_1(0) + X_1(2) W_4^0 = 2 + 2 \cdot 1 = 4
\]
\[
X_2(1) = X_1(1) + X_1(3) W_4^1 = 0 + 0 \cdot (-j) = 0
\]
\[
X_2(2) = X_1(0) - X_1(2) W_4^0 = 2 - 2 \cdot 1 = 0
\]
\[
X_2(3) = X_1(1) - X_1(3) W_4^1 = 0 - 0 \cdot (-j) = 0
\]
For the second 4-point DFT (all zeros), the result remains \( \{0, 0, 0, 0\} \).
Intermediate result: \( \{4, 0, 0, 0, 0, 0, 0, 0\} \)

**Step 4: Stage 3 (8-point DFT)**
Combine 4-point DFTs using twiddle factors \( W_8^k = e^{-j2\pi k/8} \):
\[
X(0) = X_2(0) + X_2(4) W_8^0 = 4 + 0 \cdot 1 = 4
\]
\[
X(1) = X_2(1) + X_2(5) W_8^1 = 0 + 0 \cdot e^{-j\pi/4} = 0
\]
\[
X(2) = X_2(2) + X_2(6) W_8^2 = 0 + 0 \cdot e^{-j\pi/2} = 0
\]
\[
X(3) = X_2(3) + X_2(7) W_8^3 = 0 + 0 \cdot e^{-j3\pi/4} = 0
\]
\[
X(4) = X_2(0) - X_2(4) W_8^0 = 4 - 0 \cdot 1 = 4
\]
\[
X(5) = X_2(1) - X_2(5) W_8^1 = 0 - 0 \cdot e^{-j\pi/4} = 0
\]
\[
X(6) = X_2(2) - X_2(6) W_8^2 = 0 - 0 \cdot e^{-j\pi/2} = 0
\]
\[
X(7) = X_2(3) - X_2(7) W_8^3 = 0 - 0 \cdot e^{-j3\pi/4} = 0
\]
Final DFT: \( X(k) = \{4, 0, 0, 0, 4, 0, 0, 0\} \).

---

### Problem 2
**Q:** For a 16-point sequence \( x(n) \), sketch the butterfly diagram for the first stage of a Decimation-in-Frequency (DIF) FFT. Label all twiddle factors.

**A:**
**Step 1: Split the sequence into two halves**
The DIF FFT splits the DFT into two \( N/2 \)-point DFTs:
\[
X(k) = \sum_{n=0}^{7} x(n) W_{16}^{nk} + \sum_{n=8}^{15} x(n) W_{16}^{nk}
\]
\[
= \sum_{n=0}^{7} x(n) W_{16}^{nk} + W_{16}^{8k} \sum_{n=0}^{7} x(n+8) W_{16}^{nk}
\]

**Step 2: Combine terms**
For even \( k = 2m \):
\[
X(2m) = \sum_{n=0}^{7} [x(n) + x(n+8)] W_8^{nm}
\]
For odd \( k = 2m+1 \):
\[
X(2m+1) = \sum_{n=0}^{7} [x(n) - x(n+8)] W_{16}^n W_8^{nm}
\]

**Step 3: Butterfly diagram**
The first stage consists of 8 butterflies:
- Inputs: \( x(0), x(8) \), \( x(1), x(9) \), ..., \( x(7), x(15) \)
- Outputs: \( x(0) + x(8) \), \( x(0) - x(8) \), \( x(1) + x(9) \), \( [x(1) - x(9)] W_{16}^1 \), ..., \( [x(7) - x(15)] W_{16}^7 \)
Twiddle factors: \( W_{16}^0 = 1 \), \( W_{16}^1 = e^{-j\pi/8} \), \( W_{16}^2 = e^{-j\pi/4} \), ..., \( W_{16}^7 = e^{-j7\pi/8} \).

---

### Problem 3 (Practice)
**Q:** Compute the 4-point DCT of the sequence \( x(n) = \{1, 2, 3, 4\} \). Use the definition:
\[
X(k) = \sum_{n=0}^{3} x(n) \cos \left( \frac{\pi}{4} \left( n + \frac{1}{2} \right) k \right), \quad k = 0, 1, 2, 3.
\]

**A:**
**Step 1: Compute \( X(0) \)**
\[
X(0) = \sum_{n=0}^{3} x(n) = 1 + 2 + 3 + 4 = 10
\]

**Step 2: Compute \( X(1) \)**
\[
X(1) = \sum_{n=0}^{3} x(n) \cos \left( \frac{\pi}{4} \left( n + \frac{1}{2} \right) \right)
\]
\[
= 1 \cdot \cos \left( \frac{\pi}{8} \right) + 2 \cdot \cos \left( \frac{3\pi}{8} \right) + 3 \cdot \cos \left( \frac{5\pi}{8} \right) + 4 \cdot \cos \left( \frac{7\pi}{8} \right)
\]
\[
= \cos \left( \frac{\pi}{8} \right) + 2 \cos \left( \frac{3\pi}{8} \right) - 3 \cos \left( \frac{3\pi}{8} \right) - 4 \cos \left( \frac{\pi}{8} \right)
\]
\[
= -3 \cos \left( \frac{\pi}{8} \right) - \cos \left( \frac{3\pi}{8} \right) \approx -3.414
\]

**Step 3: Compute \( X(2) \)**
\[
X(2) = \sum_{n=0}^{3} x(n) \cos \left( \frac{\pi}{2} \left( n + \frac{1}{2} \right) \right)
\]
\[
= 1 \cdot \cos \left( \frac{\pi}{4} \right) + 2 \cdot \cos \left( \frac{3\pi}{4} \right) + 3 \cdot \cos \left( \frac{5\pi}{4} \right) + 4 \cdot \cos \left( \frac{7\pi}{4} \right)
\]
\[
= \frac{\sqrt{2}}{2} - 2 \cdot \frac{\sqrt{2}}{2} - 3 \cdot \frac{\sqrt{2}}{2} + 4 \cdot \frac{\sqrt{2}}{2} = 0
\]

**Step 4: Compute \( X(3) \)**
\[
X(3) = \sum_{n=0}^{3} x(n) \cos \left( \frac{3\pi}{4} \left( n + \frac{1}{2} \right) \right)
\]
\[
= 1 \cdot \cos \left( \frac{3\pi}{8} \right) + 2 \cdot \cos \left( \frac{9\pi}{8} \right) + 3 \cdot \cos \left( \frac{15\pi}{8} \right) + 4 \cdot \cos \left( \frac{21\pi}{8} \right)
\]
\[
= \cos \left( \frac{3\pi}{8} \right) - 2 \cos \left( \frac{\pi}{8} \right) - 3 \cos \left( \frac{\pi}{8} \right) + 4 \cos \left( \frac{3\pi}{8} \right)
\]
\[
= 5 \cos \left( \frac{3\pi}{8} \right) - 5 \cos \left( \frac{\pi}{8} \right) \approx -1.414
\]

Final DCT: \( X(k) = \{10, -3.414, 0, -1.414\} \).

---

### Problem 4
**Q:** A 12-point sequence is windowed using a Hamming window before computing its DFT. If the original sequence is \( x(n) = \cos \left( \frac{2\pi}{12} n \right) \), compute the spectral leakage in the DFT due to windowing.

**A:**
**Step 1: Define the Hamming window**
\[
w(n) = 0.54 - 0.46 \cos \left( \frac{2\pi n}{11} \right), \quad n = 0, 1, \dots, 11
\]

**Step 2: Window the sequence**
\[
x_w(n) = x(n) w(n) = \cos \left( \frac{\pi n}{6} \right) \left[ 0.54 - 0.46 \cos \left( \frac{2\pi n}{11} \right) \right]
\]

**Step 3: Compute the DFT**
The DFT of \( x_w(n) \) will have spectral leakage because the Hamming window is not rectangular. The main lobe width of the Hamming window is \( 8\pi/12 \), and the side lobes are attenuated by ~42 dB.

**Step 4: Spectral leakage**
The original sequence \( x(n) \) has a single frequency component at \( k = 1 \). After windowing, the DFT will show energy at other frequencies due to the convolution of \( X(k) \) with the DFT of \( w(n) \). The leakage is quantified by the side lobe levels of the Hamming window.

---

### Problem 5 (Practice)
**Q:** Derive the twiddle factors for a 6-point DIT FFT. Express them in both polar and rectangular forms.

**A:**
**Step 1: Define the twiddle factor**
\[
W_6^k = e^{-j2\pi k/6} = e^{-j\pi k/3}, \quad k = 0, 1, 2, 3, 4, 5
\]

**Step 2: Compute polar form**
\[
W_6^0 = 1, \quad W_6^1 = e^{-j\pi/3}, \quad W_6^2 = e^{-j2\pi/3}, \quad W_6^3 = -1, \quad W_6^4 = e^{j2\pi/3}, \quad W_6^5 = e^{j\pi/3}
\]

**Step 3: Convert to rectangular form**
\[
W_6^0 = 1 + j0
\]
\[
W_6^1 = \cos \left( \frac{\pi}{3} \right) - j \sin \left( \frac{\pi}{3} \right) = 0.5 - j0.866
\]
\[
W_6^2 = \cos \left( \frac{2\pi}{3} \right) - j \sin \left( \frac{2\pi}{3} \right) = -0.5 - j0.866
\]
\[
W_6^3 = -1 + j0
\]
\[
W_6^4 = -0.5 + j0.866
\]
\[
W_6^5 = 0.5 + j0.866
\]

---

### Problem 6
**Q:** For a 9-point sequence, sketch the butterfly diagram for the first stage of a DIF FFT. Label all twiddle factors.

**A:**
**Step 1: Split the sequence into three 3-point sequences**
The DIF FFT for \( N = 9 \) splits the DFT into three 3-point DFTs:
\[
X(k) = \sum_{n=0}^{2} x(n) W_9^{nk} + \sum_{n=3}^{5} x(n) W_9^{nk} + \sum_{n=6}^{8} x(n) W_9^{nk}
\]
\[
= \sum_{n=0}^{2} x(n) W_9^{nk} + W_9^{3k} \sum_{n=0}^{2} x(n+3) W_9^{nk} + W_9^{6k} \sum_{n=0}^{2} x(n+6) W_9^{nk}
\]

**Step 2: Combine terms**
For \( k = 3m \):
\[
X(3m) = \sum_{n=0}^{2} [x(n) + x(n+3) + x(n+6)] W_3^{nm}
\]
For \( k = 3m+1 \):
\[
X(3m+1) = \sum_{n=0}^{2} [x(n) + x(n+3) W_9^3 + x(n+6) W_9^6] W_9^n W_3^{nm}
\]
For \( k = 3m+2 \):
\[
X(3m+2) = \sum_{n=0}^{2} [x(n) + x(n+3) W_9^6 + x(n+6) W_9^3] W_9^{2n} W_3^{nm}
\]

**Step 3: Butterfly diagram**
The first stage consists of 3 butterflies for each of the 3 groups:
- Inputs: \( x(0), x(3), x(6) \), \( x(1), x(4), x(7) \), \( x(2), x(5), x(8) \)
- Outputs: \( x(0) + x(3) + x(6) \), \( x(0) + x(3) W_9^3 + x(6) W_9^6 \), \( x(0) + x(3) W_9^6 + x(6) W_9^3 \), etc.
Twiddle factors: \( W_9^0 = 1 \), \( W_9^3 = e^{-j2\pi/3} \), \( W_9^6 = e^{-j4\pi/3} \).

---

### Problem 7 (Practice)
**Q:** Compute the 8-point DFT of \( x(n) = \{1, 0, 0, 0, 0, 0, 0, 0\} \) using the DIF FFT algorithm.

**A:**
**Step 1: Split the sequence into two halves**
\[
X(k) = \sum_{n=0}^{3} x(n) W_8^{nk} + \sum_{n=4}^{7} x(n) W_8^{nk} = \sum_{n=0}^{3} x(n) W_8^{nk}
\]

**Step 2: First stage (4-point DFTs)**
Since \( x(n) = 0 \) for \( n \geq 1 \), the first stage outputs are:
\[
X_1(0) = x(0) + x(4) = 1 + 0 = 1
\]
\[
X_1(1) = x(0) - x(4) = 1 - 0 = 1
\]
\[
X_1(2) = x(1) + x(5) = 0 + 0 = 0
\]
\[
X_1(3) = x(1) - x(5) = 0 - 0 = 0
\]
\[
X_1(4) = x(2) + x(6) = 0 + 0 = 0
\]
\[
X_1(5) = x(2) - x(6) = 0 - 0 = 0
\]
\[
X_1(6) = x(3) + x(7) = 0 + 0 = 0
\]
\[
X_1(7) = x(3) - x(7) = 0 - 0 = 0
\]

**Step 3: Second stage (8-point DFT)**
Combine the 4-point DFTs using twiddle factors:
\[
X(0) = X_1(0) + X_1(4) = 1 + 0 = 1
\]
\[
X(1) = X_1(1) + X_1(5) W_8^1 = 1 + 0 = 1
\]
\[
X(2) = X_1(2) + X_1(6) W_8^2 = 0 + 0 = 0
\]
\[
X(3) = X_1(3) + X_1(7) W_8^3 = 0 + 0 = 0
\]
\[
X(4) = X_1(0) - X_1(4) = 1 - 0 = 1
\]
\[
X(5) = X_1(1) - X_1(5) W_8^1 = 1 - 0 = 1
\]
\[
X(6) = X_1(2) - X_1(6) W_8^2 = 0 - 0 = 0
\]
\[
X(7) = X_1(3) - X_1(7) W_8^3 = 0 - 0 = 0
\]

Final DFT: \( X(k) = \{1, 1, 0, 0, 1, 1, 0, 0\} \).

---

### Problem 8
**Q:** A signal \( x(n) = \cos \left( \frac{2\pi}{8} n \right) \) is windowed with a rectangular window of length 8. Compute the DFT and explain the spectral leakage.

**A:**
**Step 1: Define the signal and window**
\[
x(n) = \cos \left( \frac{\pi n}{4} \right), \quad n = 0, 1, \dots, 7
\]
Rectangular window: \( w(n) = 1 \) for \( n = 0, \dots, 7 \).

**Step 2: Compute the DFT**
The DFT of \( x(n) \) is:
\[
X(k) = \sum_{n=0}^{7} \cos \left( \frac{\pi n}{4} \right) e^{-j2\pi nk/8}
\]
Using Euler's identity:
\[
X(k) = \frac{1}{2} \sum_{n=0}^{7} \left( e^{j\pi n/4} + e^{-j\pi n/4} \right) e^{-j2\pi nk/8}
\]
\[
= \frac{1}{2} \sum_{n=0}^{7} e^{-j2\pi n(k-1)/8} + \frac{1}{2} \sum_{n=0}^{7} e^{-j2\pi n(k+1)/8}
\]
The DFT of a rectangular windowed cosine is two impulses at \( k = 1 \) and \( k = 7 \):
\[
X(k) = 4 \delta(k-1) + 4 \delta(k-7)
\]

**Step 3: Spectral leakage**
For a rectangular window, the DFT of the window is a Dirichlet kernel, which has high side lobes. If the signal frequency does not align with a DFT bin, spectral leakage occurs. Here, the signal frequency aligns perfectly with \( k = 1 \), so there is no leakage.

---

### Problem 9 (Practice)
**Q:** Compute the 4-point DIT FFT of \( x(n) = \{1, -1, 1, -1\} \). Show all butterfly computations.

**A:**
**Step 1: Bit-reverse the input**
Bit-reversed order: \( \{1, 1, -1, -1\} \).

**Step 2: Stage 1 (2-point DFTs)**
For \( m = 0 \):
\[
X_1(0) = x(0) + x(2) = 1 + (-1) = 0
\]
\[
X_1(1) = x(0) - x(2) = 1 - (-1) = 2
\]
For \( m = 1 \):
\[
X_1(0) = x(1) + x(3) = 1 + (-1) = 0
\]
\[
X_1(1) = x(1) - x(3) = 1 - (-1) = 2
\]

**Step 3: Stage 2 (4-point DFT)**
Combine using twiddle factors \( W_4^0 = 1 \), \( W_4^1 = -j \):
\[
X(0) = X_1(0) + X_1(0) W_4^0 = 0 + 0 = 0
\]
\[
X(1) = X_1(1) + X_1(1) W_4^1 = 2 + 2(-j) = 2 - 2j
\]
\[
X(2) = X_1(0) - X_1(0) W_4^0 = 0 - 0 = 0
\]
\[
X(3) = X_1(1) - X_1(1) W_4^1 = 2 - 2(-j) = 2 + 2j
\]

Final DFT: \( X(k) = \{0, 2-2j, 0, 2+2j\} \).

---

### Problem 10
**Q:** For a 15-point prime factor FFT with \( N_1 = 5 \) and \( N_2 = 3 \), derive the index maps for \( n \) and \( k \).

**A:**
**Step 1: Compute constants**
For \( N = 15 \), \( N_1 = 5 \), \( N_2 = 3 \):
\[
A = N_2 = 3, \quad B = N_1 = 5
\]
\[
C = N_2 \cdot (N_2^{-1})_{N_1} = 3 \cdot 2 = 6 \quad (\text{since } 3 \cdot 2 \equiv 1 \mod 5)
\]
\[
D = N_1 \cdot (N_1^{-1})_{N_2} = 5 \cdot 2 = 10 \quad (\text{since } 5 \cdot 2 \equiv 1 \mod 3)
\]

**Step 2: Index maps**
Input index map:
\[
n = (A n_1 + B n_2) \mod N = (3 n_1 + 5 n_2) \mod 15, \quad 0 \leq n_1 \leq 4, 0 \leq n_2 \leq 2
\]
Output index map:
\[
k = (C k_1 + D k_2) \mod N = (6 k_1 + 10 k_2) \mod 15, \quad 0 \leq k_1 \leq 4, 0 \leq k_2 \leq 2
\]

---

### Problem 11 (Practice)
**Q:** Compute the number of complex multiplications required for a 12-point prime factor FFT with \( N_1 = 4 \) and \( N_2 = 3 \). Assume multiplications by \( \pm 1 \) and \( \pm j \) are not counted.

**A:**
**Step 1: Compute 4-point and 3-point DFTs**
- A 4-point DFT requires 0 multiplications (since \( W_4^k \) are \( \pm 1, \pm j \)).
- A 3-point DFT requires 6 multiplications (since \( W_3^k \) are not trivial).

**Step 2: Total multiplications**
- Number of 4-point DFTs: 3 (one for each column).
- Number of 3-point DFTs: 4 (one for each row).
Total multiplications: \( 3 \cdot 0 + 4 \cdot 6 = 24 \).

---

### Problem 12
**Q:** A signal \( x(n) = \cos \left( \frac{2\pi}{16} n \right) \) is windowed with a Hanning window of length 16. Compute the DFT and explain the spectral leakage.

**A:**
**Step 1: Define the Hanning window**
\[
w(n) = 0.5 \left( 1 - \cos \left( \frac{2\pi n}{15} \right) \right), \quad n = 0, \dots, 15
\]

**Step 2: Window the signal**
\[
x_w(n) = x(n) w(n) = \cos \left( \frac{\pi n}{8} \right) \cdot 0.5 \left( 1 - \cos \left( \frac{2\pi n}{15} \right) \right)
\]

**Step 3: Compute the DFT**
The DFT of \( x_w(n) \) will have a main lobe at \( k = 1 \) and \( k = 15 \), with reduced side lobes compared to a rectangular window. The Hanning window reduces spectral leakage by attenuating side lobes by ~31 dB.

---

### Problem 13 (Practice)
**Q:** Derive the twiddle factors for a 12-point DIF FFT. Express them in polar form.

**A:**
**Step 1: Define the twiddle factor**
\[
W_{12}^k = e^{-j2\pi k/12} = e^{-j\pi k/6}, \quad k = 0, 1, \dots, 11
\]

**Step 2: Compute polar form**
\[
W_{12}^0 = 1, \quad W_{12}^1 = e^{-j\pi/6}, \quad W_{12}^2 = e^{-j\pi/3}, \quad W_{12}^3 = e^{-j\pi/2} = -j
\]
\[
W_{12}^4 = e^{-j2\pi/3}, \quad W_{12}^5 = e^{-j5\pi/6}, \quad W_{12}^6 = -1
\]
\[
W_{12}^7 = e^{-j7\pi/6}, \quad W_{12}^8 = e^{-j4\pi/3}, \quad W_{12}^9 = e^{-j3\pi/2} = j
\]
\[
W_{12}^{10} = e^{-j5\pi/3}, \quad W_{12}^{11} = e^{-j11\pi/6}
\]

---

### Problem 14
**Q:** For a 21-point prime factor FFT with \( N_1 = 7 \) and \( N_2 = 3 \), compute the number of complex multiplications and compare it with a 32-point radix-2 FFT.

**A:**
**Step 1: Prime factor FFT**
- Number of 7-point DFTs: 3 (one for each column).
- Number of 3-point DFTs: 7 (one for each row).
- Each 7-point DFT requires 42 multiplications.
- Each 3-point DFT requires 6 multiplications.
Total multiplications: \( 3 \cdot 42 + 7 \cdot 6 = 126 + 42 = 168 \).

**Step 2: Radix-2 FFT**
For \( N = 32 \):
\[
\text{Multiplications} = \frac{N}{2} \log_2 N = 16 \cdot 5 = 80
\]

**Step 3: Comparison**
The 32-point radix-2 FFT is more efficient (80 vs. 168 multiplications).

---

### Problem 15 (Practice)
**Q:** Compute the 8-point DCT of \( x(n) = \{1, 0, 0, 0, 0, 0, 0, 0\} \). Use the definition:
\[
X(k) = \sum_{n=0}^{7} x(n) \cos \left( \frac{\pi}{8} \left( n + \frac{1}{2} \right) k \right), \quad k = 0, \dots, 7.
\]

**A:**
**Step 1: Compute \( X(k) \)**
For \( k = 0 \):
\[
X(0) = \sum_{n=0}^{7} x(n) = 1
\]

For \( k = 1 \):
\[
X(1) = \cos \left( \frac{\pi}{16} \right) \approx 0.9808
\]

For \( k = 2 \):
\[
X(2) = \cos \left( \frac{\pi}{8} \right) \approx 0.9239
\]

For \( k = 3 \):
\[
X(3) = \cos \left( \frac{3\pi}{16} \right) \approx 0.8315
\]

For \( k = 4 \):
\[
X(4) = \cos \left( \frac{\pi}{4} \right) = \frac{\sqrt{2}}{2} \approx 0.7071
\]

For \( k = 5 \):
\[
X(5) = \cos \left( \frac{5\pi}{16} \right) \approx 0.5556
\]

For \( k = 6 \):
\[
X(6) = \cos \left( \frac{3\pi}{8} \right) \approx 0.3827
\]

For \( k = 7 \):
\[
X(7) = \cos \left( \frac{7\pi}{16} \right) \approx 0.1951
\]

Final DCT: \( X(k) \approx \{1, 0.9808, 0.9239, 0.8315, 0.7071, 0.5556, 0.3827, 0.1951\} \).
