# Week 1 — Sampling & Digitization

> **NPTEL: Signal Processing Techniques and Its Applications** | Dr. Shyamal Kumar Das Mandal, IIT Kharagpur

---

## 1. Signal Types

**Continuous-time (analog):** $x_a(t)$ — amplitude and time both continuous

**Discrete-time (digital):** $x[n]$ — values only at integer $n$

- **Multi-dimensional signals:** Static image, HD video (≥ 2 independent variables)
- **Multi-channel signals:** Stereo audio (multiple 1-D signals, NOT multi-dimensional)

> **Recall trap:** "Stereo audio" is multi-channel, NOT multi-dimensional. Static image and HD video ARE multi-dimensional.

---

## 2. Nyquist Sampling Theorem

$$\boxed{F_s \geq 2F_{\max}}$$

Minimum sampling frequency = $2 \times$ highest frequency component in the signal. **Aliasing** occurs if $F_s < 2F_{\max}$.

**Analog → Discrete-time:** Given $x_a(t) = A\cos(2\pi F_0 t)$ sampled at $F_s$:

$$x[n] = A\cos\!\left(\frac{2\pi F_0}{F_s}\,n\right) = A\cos(\omega_0\,n)$$

where the **normalized digital frequency** $\omega_0 = \dfrac{2\pi F_0}{F_s}$ (rad/sample).

**Discrete → Analog:** Given $x[n] = A\cos(\omega_0 n)$ reconstructed at $F_s$:

$$\boxed{F_{\text{analog}} = \frac{\omega_0}{2\pi}\cdot F_s}$$

---

## 3. Aliasing — Worked Example

**Given:** $x_a(t) = 10\sin(320\pi t) + 4\cos(500\pi t)$, $F_s = 400$ Hz

**Step 1 — Component 1:** $F_1 = 160$ Hz $< F_s/2 = 200$ Hz → no aliasing
$$\omega_1 = \frac{2\pi\cdot160}{400} = \frac{4\pi}{5}$$

**Step 2 — Component 2:** $F_2 = 250$ Hz $> F_s/2 = 200$ Hz → **aliased**
$$F_{\text{alias}} = |F_2 - F_s| = |250 - 400| = 150 \text{ Hz}$$
$$\omega_2 = \frac{2\pi\cdot150}{400} = \frac{3\pi}{4}$$

**Result:**
$$x[n] = 10\sin\!\left(\tfrac{4\pi}{5}n\right) + 4\cos\!\left(\tfrac{3\pi}{4}n\right)$$

---

## 4. Quantization

$$\text{Levels} = \frac{x_{\max} - x_{\min}}{\Delta} \qquad \text{Bits} = \left\lceil \log_2(\text{Levels}) \right\rceil$$

**Example:** $x[n] = 6.35\cos(\pi n/5)$, $\Delta = 0.01$

**Step 1:** Range = $-6.35$ to $+6.35$, total = $12.70$

**Step 2:** Levels $= 12.70\,/\,0.01 = 1270$

**Step 3:** Bits $= \lceil\log_2(1270)\rceil = \lceil10.31\rceil = \mathbf{11}$ bits ✅

---

## 5. Bit Rate & Storage

$$\boxed{\text{File size (bytes)} = \frac{F_s \times \text{duration (s)} \times \text{bits/sample}}{8}}$$

**Example:** 32 kB stored, 2 sec, 16-bit encoding:
$$F_s = \frac{32\times10^3\times8}{2\times16} = 8000 \text{ Hz}$$ ✅

---

## 6. Signal Processing System (ADC → DSP → DAC)

Signal passes through ADC at $F_s$ → digital LPF (cutoff $F_s/2$) → DAC.

**Example:** $x_a(t) = 5\cos(100\pi t)+6\cos(300\pi t)$, $T_s = 5$ ms ($F_s = 200$ Hz)

- $F_1 = 50$ Hz → passes (within $F_s/2 = 100$ Hz)
- $F_2 = 150$ Hz → aliased to $F_s - F_2 = 50$ Hz
- Both combine at 50 Hz: $y_a(t) = (5+6)\cos(2\pi\cdot50\cdot t) = 11\cos(250\pi t)$ ✅

---

## 7. Assignment Quick-Reference

| Question | Answer |
|---------|--------|
| $x_a(t)=6\cos(380\pi t)+4\cos(840\pi t)$ — min $F_s$? | 840 Hz ✅ |
| $x_a(t)=10\sin(320\pi t)+4\cos(500\pi t)$, $F_s=400$ — $x[n]$? | $10\sin\tfrac{4\pi}{5}n+4\cos\tfrac{3\pi}{4}n$ ✅ |
| $x[n]=6.35\cos(\pi n/5)$, $\Delta=0.01$ — bits? | 11 ✅ |
| System $T=5$ ms, $5\cos100\pi t+6\cos300\pi t$ — output? | $11\cos250\pi t$ ✅ |
| $x[n]=7\cos(\pi n/5)$, $F_s=5$ kHz — analog frequency? | 500 Hz ✅ |
| 2-sec audio, 32 kB, 16-bit — $F_s$? | 8000 Hz ✅ |
| $F_s=16$ kHz, DFT peak at $\omega=\pi/8$ — frequency? | 1 kHz ✅ |

---

## Formula Sheet — Week 1

$$F_s \geq 2F_{\max} \qquad \omega_0 = \frac{2\pi F_0}{F_s} \qquad F_{\text{analog}} = \frac{\omega_0}{2\pi}\cdot F_s$$

$$\text{Levels} = \frac{x_{\max}-x_{\min}}{\Delta} \qquad \text{Bits} = \lceil\log_2(\text{Levels})\rceil$$

$$\text{File size (bytes)} = \frac{F_s \times t \times B}{8} \qquad F_{\text{alias}} = |F - kF_s|$$


---

## Practice Problems (Schaum's Outline)

> Problems drawn from *Schaum's Outline of Digital Signal Processing* — matching the types asked in NPTEL assignments and the final exam. Work each problem before reading the solution.

Here are 15 high-quality problems on the topic of sampling theorem, Nyquist rate, aliasing, quantization, ADC, signal reconstruction, and analog-to-digital conversion, formatted as requested:

---

### Problem 1
**Q:** A continuous-time signal \( x_a(t) = 5 \cos(2000 \pi t) \) is sampled at a rate of 3000 Hz. Determine:
(a) The Nyquist rate for this signal.
(b) Whether aliasing occurs with the given sampling rate.
(c) The frequency of the reconstructed signal if aliasing occurs.

**A:**
1. The signal \( x_a(t) = 5 \cos(2000 \pi t) \) has a frequency \( f_0 = \frac{2000 \pi}{2 \pi} = 1000 \) Hz.
2. The Nyquist rate is \( 2f_0 = 2000 \) Hz.
3. The sampling frequency \( f_s = 3000 \) Hz is greater than the Nyquist rate, so **no aliasing occurs**.
4. Since no aliasing occurs, the reconstructed signal will have the same frequency as the original: \( f = 1000 \) Hz.

---

### Problem 2
**Q:** A signal \( x_a(t) = 2 \sin(500 \pi t) + 3 \cos(1200 \pi t) \) is sampled at 800 Hz. Determine the frequencies present in the sampled signal due to aliasing.

**A:**
1. The signal has two components:
   - \( f_1 = \frac{500 \pi}{2 \pi} = 250 \) Hz
   - \( f_2 = \frac{1200 \pi}{2 \pi} = 600 \) Hz
2. The Nyquist rate for the highest frequency (600 Hz) is \( 2 \times 600 = 1200 \) Hz.
3. Since \( f_s = 800 \) Hz < 1200 Hz, aliasing occurs.
4. For \( f_2 = 600 \) Hz:
   - The aliased frequency is \( |600 - 800| = 200 \) Hz.
5. The sampled signal will contain frequencies at 250 Hz and 200 Hz.

---

### Problem 3
**Q:** A bandlimited signal has a maximum frequency of 4 kHz. What is the minimum sampling rate required to avoid aliasing? If the signal is sampled at 6 kHz, what is the maximum frequency that can be uniquely reconstructed?

**A:**
1. The Nyquist rate is \( 2 \times 4 \text{ kHz} = 8 \text{ kHz} \). Thus, the **minimum sampling rate** is 8 kHz.
2. If sampled at 6 kHz, the maximum frequency that can be uniquely reconstructed is \( \frac{6 \text{ kHz}}{2} = 3 \text{ kHz} \).

---

### Problem 4 (Practice)
**Q:** A signal \( x_a(t) = \cos(2 \pi \cdot 1500 t) + \sin(2 \pi \cdot 2500 t) \) is sampled at 4000 Hz. Determine the frequencies present in the sampled signal.

**A:**
1. The signal has two components:
   - \( f_1 = 1500 \) Hz
   - \( f_2 = 2500 \) Hz
2. The Nyquist rate for \( f_2 \) is \( 2 \times 2500 = 5000 \) Hz.
3. Since \( f_s = 4000 \) Hz < 5000 Hz, aliasing occurs.
4. For \( f_2 = 2500 \) Hz:
   - The aliased frequency is \( |2500 - 4000| = 1500 \) Hz.
5. The sampled signal will contain frequencies at 1500 Hz (from both components).

---

### Problem 5
**Q:** A 4-bit ADC has a full-scale range of \( \pm 5 \) V. Determine:
(a) The quantization step size \( \Delta \).
(b) The maximum quantization error.
(c) The signal-to-quantization noise ratio (SQNR) for a sinusoidal input with peak amplitude 4 V.

**A:**
1. The number of quantization levels is \( 2^4 = 16 \).
2. The step size is \( \Delta = \frac{10 \text{ V}}{16} = 0.625 \) V.
3. The maximum quantization error is \( \frac{\Delta}{2} = 0.3125 \) V.
4. The signal power for a sinusoid with peak amplitude \( A = 4 \) V is:
   \[
   \sigma_s^2 = \left(\frac{A}{\sqrt{2}}\right)^2 = \frac{16}{2} = 8 \text{ V}^2.
   \]
5. The quantization noise power is:
   \[
   \sigma_e^2 = \frac{\Delta^2}{12} = \frac{0.625^2}{12} = 0.03255 \text{ V}^2.
   \]
6. The SQNR is:
   \[
   \text{SQNR} = 10 \log \left(\frac{\sigma_s^2}{\sigma_e^2}\right) = 10 \log \left(\frac{8}{0.03255}\right) \approx 23.9 \text{ dB}.
   \]

---

### Problem 6
**Q:** A signal \( x_a(t) = 3 \cos(2 \pi \cdot 1000 t) \) is sampled at 1500 Hz. Determine the reconstructed signal if an ideal low-pass filter with cutoff frequency 750 Hz is used.

**A:**
1. The signal frequency is \( f_0 = 1000 \) Hz.
2. The Nyquist rate is \( 2 \times 1000 = 2000 \) Hz.
3. Since \( f_s = 1500 \) Hz < 2000 Hz, aliasing occurs.
4. The aliased frequency is \( |1000 - 1500| = 500 \) Hz.
5. The reconstructed signal is \( x_a(t) = 3 \cos(2 \pi \cdot 500 t) \).

---

### Problem 7 (Practice)
**Q:** A signal \( x_a(t) = 2 \sin(2 \pi \cdot 3000 t) + \cos(2 \pi \cdot 4000 t) \) is sampled at 5000 Hz. Determine the frequencies present in the sampled signal.

**A:**
1. The signal has two components:
   - \( f_1 = 3000 \) Hz
   - \( f_2 = 4000 \) Hz
2. The Nyquist rate for \( f_2 \) is \( 2 \times 4000 = 8000 \) Hz.
3. Since \( f_s = 5000 \) Hz < 8000 Hz, aliasing occurs.
4. For \( f_2 = 4000 \) Hz:
   - The aliased frequency is \( |4000 - 5000| = 1000 \) Hz.
5. The sampled signal will contain frequencies at 3000 Hz and 1000 Hz.

---

### Problem 8
**Q:** A 3-bit ADC has a full-scale range of \( \pm 2 \) V. Determine:
(a) The quantization step size \( \Delta \).
(b) The maximum quantization error.
(c) The SQNR for a sinusoidal input with peak amplitude 1.5 V.

**A:**
1. The number of quantization levels is \( 2^3 = 8 \).
2. The step size is \( \Delta = \frac{4 \text{ V}}{8} = 0.5 \) V.
3. The maximum quantization error is \( \frac{\Delta}{2} = 0.25 \) V.
4. The signal power for a sinusoid with peak amplitude \( A = 1.5 \) V is:
   \[
   \sigma_s^2 = \left(\frac{1.5}{\sqrt{2}}\right)^2 = \frac{2.25}{2} = 1.125 \text{ V}^2.
   \]
5. The quantization noise power is:
   \[
   \sigma_e^2 = \frac{\Delta^2}{12} = \frac{0.5^2}{12} = 0.02083 \text{ V}^2.
   \]
6. The SQNR is:
   \[
   \text{SQNR} = 10 \log \left(\frac{1.125}{0.02083}\right) \approx 17.3 \text{ dB}.
   \]

---

### Problem 9
**Q:** A signal \( x_a(t) = \cos(2 \pi \cdot 2000 t) \) is sampled at 3000 Hz. Determine the reconstructed signal if a zero-order hold is used for reconstruction.

**A:**
1. The signal frequency is \( f_0 = 2000 \) Hz.
2. The Nyquist rate is \( 2 \times 2000 = 4000 \) Hz.
3. Since \( f_s = 3000 \) Hz < 4000 Hz, aliasing occurs.
4. The aliased frequency is \( |2000 - 3000| = 1000 \) Hz.
5. The reconstructed signal using a zero-order hold will be a staircase approximation of \( \cos(2 \pi \cdot 1000 t) \).

---

### Problem 10 (Practice)
**Q:** A signal \( x_a(t) = 4 \sin(2 \pi \cdot 1200 t) + 2 \cos(2 \pi \cdot 1800 t) \) is sampled at 2000 Hz. Determine the frequencies present in the sampled signal.

**A:**
1. The signal has two components:
   - \( f_1 = 1200 \) Hz
   - \( f_2 = 1800 \) Hz
2. The Nyquist rate for \( f_2 \) is \( 2 \times 1800 = 3600 \) Hz.
3. Since \( f_s = 2000 \) Hz < 3600 Hz, aliasing occurs.
4. For \( f_2 = 1800 \) Hz:
   - The aliased frequency is \( |1800 - 2000| = 200 \) Hz.
5. The sampled signal will contain frequencies at 1200 Hz and 200 Hz.

---

### Problem 11
**Q:** A 5-bit ADC has a full-scale range of \( \pm 10 \) V. Determine:
(a) The quantization step size \( \Delta \).
(b) The maximum quantization error.
(c) The SQNR for a sinusoidal input with peak amplitude 8 V.

**A:**
1. The number of quantization levels is \( 2^5 = 32 \).
2. The step size is \( \Delta = \frac{20 \text{ V}}{32} = 0.625 \) V.
3. The maximum quantization error is \( \frac{\Delta}{2} = 0.3125 \) V.
4. The signal power for a sinusoid with peak amplitude \( A = 8 \) V is:
   \[
   \sigma_s^2 = \left(\frac{8}{\sqrt{2}}\right)^2 = \frac{64}{2} = 32 \text{ V}^2.
   \]
5. The quantization noise power is:
   \[
   \sigma_e^2 = \frac{\Delta^2}{12} = \frac{0.625^2}{12} = 0.03255 \text{ V}^2.
   \]
6. The SQNR is:
   \[
   \text{SQNR} = 10 \log \left(\frac{32}{0.03255}\right) \approx 29.9 \text{ dB}.
   \]

---

### Problem 12
**Q:** A signal \( x_a(t) = 2 \cos(2 \pi \cdot 500 t) + \sin(2 \pi \cdot 1500 t) \) is sampled at 2000 Hz. Determine the reconstructed signal if an ideal low-pass filter with cutoff frequency 1000 Hz is used.

**A:**
1. The signal has two components:
   - \( f_1 = 500 \) Hz
   - \( f_2 = 1500 \) Hz
2. The Nyquist rate for \( f_2 \) is \( 2 \times 1500 = 3000 \) Hz.
3. Since \( f_s = 2000 \) Hz < 3000 Hz, aliasing occurs for \( f_2 \).
4. The aliased frequency for \( f_2 \) is \( |1500 - 2000| = 500 \) Hz.
5. The reconstructed signal is \( x_a(t) = 2 \cos(2 \pi \cdot 500 t) + \sin(2 \pi \cdot 500 t) \).

---

### Problem 13 (Practice)
**Q:** A signal \( x_a(t) = \cos(2 \pi \cdot 3000 t) \) is sampled at 4000 Hz. Determine the reconstructed signal if a zero-order hold is used.

**A:**
1. The signal frequency is \( f_0 = 3000 \) Hz.
2. The Nyquist rate is \( 2 \times 3000 = 6000 \) Hz.
3. Since \( f_s = 4000 \) Hz < 6000 Hz, aliasing occurs.
4. The aliased frequency is \( |3000 - 4000| = 1000 \) Hz.
5. The reconstructed signal using a zero-order hold will be a staircase approximation of \( \cos(2 \pi \cdot 1000 t) \).

---

### Problem 14
**Q:** A signal \( x_a(t) = 3 \sin(2 \pi \cdot 800 t) \) is sampled at 1000 Hz. Determine:
(a) Whether aliasing occurs.
(b) The frequency of the reconstructed signal if aliasing occurs.

**A:**
1. The signal frequency is \( f_0 = 800 \) Hz.
2. The Nyquist rate is \( 2 \times 800 = 1600 \) Hz.
3. Since \( f_s = 1000 \) Hz < 1600 Hz, **aliasing occurs**.
4. The aliased frequency is \( |800 - 1000| = 200 \) Hz.
5. The reconstructed signal will have frequency \( f = 200 \) Hz.

---

### Problem 15 (Practice)
**Q:** A 6-bit ADC has a full-scale range of \( \pm 5 \) V. Determine:
(a) The quantization step size \( \Delta \).
(b) The maximum quantization error.
(c) The SQNR for a sinusoidal input with peak amplitude 4 V.

**A:**
1. The number of quantization levels is \( 2^6 = 64 \).
2. The step size is \( \Delta = \frac{10 \text{ V}}{64} \approx 0.15625 \) V.
3. The maximum quantization error is \( \frac{\Delta}{2} \approx 0.078125 \) V.
4. The signal power for a sinusoid with peak amplitude \( A = 4 \) V is:
   \[
   \sigma_s^2 = \left(\frac{4}{\sqrt{2}}\right)^2 = \frac{16}{2} = 8 \text{ V}^2.
   \]
5. The quantization noise power is:
   \[
   \sigma_e^2 = \frac{\Delta^2}{12} = \frac{0.15625^2}{12} \approx 0.0020345 \text{ V}^2.
   \]
6. The SQNR is:
   \[
   \text{SQNR} = 10 \log \left(\frac{8}{0.0020345}\right) \approx 35.9 \text{ dB}.
   \]
