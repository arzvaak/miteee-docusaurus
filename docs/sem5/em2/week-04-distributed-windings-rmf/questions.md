---
sidebar_position: 4.5
title: "Week 4: Practice Questions"
---

# Week 4: Practice Questions

## Previous Year Questions

### Q1. S12-3A | 04 marks

**For a synchronous generator, derive suitable expressions for (i) Pitch factor (ii) Distribution factor**

**Answer:**

**(i) Pitch Factor (Coil Span Factor) $K_p$**

When coils are short-pitched (coil span < 180° electrical), the induced EMF is reduced compared to a full-pitch coil. Let the coil span be $\alpha$ electrical degrees less than 180°.

The short-pitch angle (chording angle) is $\alpha$. For a coil spanning $(180^\circ - \alpha)$ electrical degrees, the EMF induced in each coil side has a phase difference of $\alpha$.

The phasor sum of the two coil-side EMFs gives the resultant coil EMF:

$$
E_c = 2E_{side} \cos\left(\frac{\alpha}{2}\right)
$$

The arithmetic sum would be $2E_{side}$. Therefore:

$$
K_p = \frac{\text{Phasor sum of coil-side EMFs}}{\text{Arithmetic sum of coil-side EMFs}} = \frac{2E_{side} \cos(\alpha/2)}{2E_{side}} = \cos\left(\frac{\alpha}{2}\right)
$$

For the $n^{th}$ harmonic:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

**(ii) Distribution Factor (Breadth Factor) $K_d$**

When coils are distributed across multiple slots per pole per phase, the EMFs induced in each coil are displaced in phase by the slot angle $\beta$ (electrical degrees between adjacent slots).

$$
\beta = \frac{180^\circ}{\text{Slots per pole}} = \frac{180^\circ}{m \times q}
$$

where $m =$ number of phases, $q =$ slots per pole per phase.

Let $m$ coils per phase belt have EMFs $E_1, E_2, ..., E_m$ each of magnitude $E$, with successive phase shifts of $\beta$.

The phasor sum is the chord of the polygon formed by $m$ equal vectors:

$$
E_{ph} = E \cdot \frac{\sin(m\beta/2)}{\sin(\beta/2)}
$$

The arithmetic sum is $mE$. Therefore:

$$
K_d = \frac{\text{Phasor sum}}{\text{Arithmetic sum}} = \frac{E \cdot \sin(m\beta/2) / \sin(\beta/2)}{mE} = \frac{\sin(m\beta/2)}{m \sin(\beta/2)}
$$

For the $n^{th}$ harmonic:

$$
K_{dn} = \frac{\sin(n m \beta/2)}{m \sin(n \beta/2)}
$$

The overall winding factor is:

$$
K_w = K_p \times K_d
$$

---

### Q2. S14-1A | 02 marks

**Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding**

**Answer:**

**(i) Integral vs Fractional Slot Winding**

- **Integral slot winding:** The number of slots per pole per phase ($q$) is an integer. Example: $q = 4$ slots/pole/phase. This is the most common type for synchronous machines.

- **Fractional slot winding:** The number of slots per pole per phase ($q$) is a fraction. Example: $q = 3.5$ slots/pole/phase. Used in large slow-speed machines to reduce harmonics and improve waveform.

**(ii) Full pitch vs Fractional pitch winding**

- **Full pitch winding:** The coil span equals the pole pitch (180° electrical). The two sides of a coil are exactly one pole pitch apart. This gives maximum induced EMF but higher harmonic content.

- **Fractional pitch (short pitch) winding:** The coil span is less than the pole pitch (typically 120° to 160° electrical). The coil span is shortened by an angle $\alpha$. Advantages include:
  - Reduction of harmonic EMFs (especially 5th and 7th)
  - Saving in copper
  - Improved waveform

---

### Q3. S22-1A | 02 marks

**Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine.**

**Answer:**

Short-pitched windings (coil span < 180° electrical) offer several advantages:

1. **Harmonic elimination/reduction:** The pitch factor for the $n^{th}$ harmonic is $K_{pn} = \cos(n\alpha/2)$. By choosing $\alpha = 36^\circ$, the 5th harmonic ($n=5$) is completely eliminated since $\cos(5 \times 36^\circ/2) = \cos 90^\circ = 0$. Similarly, $\alpha \approx 25.7^\circ$ eliminates the 7th harmonic.

2. **Copper saving:** Short-pitched coils use less copper than full-pitch coils, reducing machine cost and weight.

3. **Improved waveform:** By reducing or eliminating dominant harmonics, the generated voltage waveform becomes more sinusoidal.

4. **Reduced eddy current losses:** Harmonic reduction decreases eddy current losses in the core and conductors.

5. **Reduced noise and vibration:** Elimination of harmonic MMFs reduces magnetic noise and vibration.

**Disadvantage:** The fundamental EMF is slightly reduced by the factor $K_p = \cos(\alpha/2)$, but this is a small price for the benefits gained.

---

### Q4. S01-1A | 04 marks

**A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced.**

**Answer:**

**Given data:**
- $f = 50$ Hz, $N_s = 1000$ rpm
- $S = 72$ slots, conductors/slot $= 6$
- Coil span $= 10$ slots (short-pitched)
- $\Phi = 0.26$ Wb/pole
- Star connected

**Step 1: Determine number of poles**

$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6 \text{ poles}
$$

**Step 2: Slots per pole**

$$
\text{Slots/pole} = \frac{72}{6} = 12
$$

**Step 3: Slot angle $\beta$ (electrical)**

$$
\beta = \frac{180^\circ}{\text{Slots/pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 4: Slots per pole per phase $m$**

$$
m = \frac{\text{Slots/pole}}{\text{Number of phases}} = \frac{12}{3} = 4
$$

**Step 5: Distribution factor $K_d$**

$$
K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)} = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)}
$$

$$
K_d = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 6: Pitch factor $K_p$**

Full pitch $= 12$ slots. Coil span $= 10$ slots. Short-pitching $= 12 - 10 = 2$ slots.

Short-pitch angle $\alpha = 2 \times \beta = 2 \times 15^\circ = 30^\circ$ electrical

$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 7: Winding factor $K_w$**

$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 8: Turns per phase $T_{ph}$**

Total conductors $= 72 \times 6 = 432$

Conductors per phase $= \frac{432}{3} = 144$

Turns per phase $T_{ph} = \frac{144}{2} = 72$ turns (since 2 conductors form 1 turn)

**Step 9: Phase EMF $E_{ph}$**

$$
E_{ph} = 4.44 \times f \times \Phi \times T_{ph} \times K_w
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 = 222, \quad 222 \times 0.26 = 57.72, \quad 57.72 \times 72 = 4155.84, \quad 4155.84 \times 0.9250 = 3844.15 \text{ V}
$$

$$
E_{ph} = 3844.15 \text{ V}
$$

**Step 10: Line voltage (star connection)**

$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.15 = 6658.5 \text{ V}
$$

**Final Answer:**
- $K_d = 0.9577$
- $K_p = 0.9659$
- $K_w = 0.9250$
- $T_{ph} = 72$ turns
- $E_{ph} = 3844.15$ V
- $E_L = 6658.5$ V

---

### Q5. S01-2A | 03 marks

**A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° elec. Determine (i) total no. of armature slots (ii) minimum order of harmonic emf that can be suppressed.**

**Answer:**

**Given data:**
- $f = 50$ Hz, $N_s = 750$ rpm
- Coil span $= 144^\circ$ electrical
- Short-pitched by 2 slots

**Step 1: Determine number of poles**

$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}
$$

**Step 2: Determine slot angle $\beta$**

Full pitch $= 180^\circ$ electrical. Coil span $= 144^\circ$ electrical.

Short-pitch angle $\alpha = 180^\circ - 144^\circ = 36^\circ$ electrical

Since short-pitched by 2 slots:

$$
\alpha = 2 \times \beta \implies \beta = \frac{\alpha}{2} = \frac{36^\circ}{2} = 18^\circ \text{ electrical}
$$

**Step 3: Total number of slots**

$$
\beta = \frac{180^\circ}{\text{Slots/pole}} \implies \text{Slots/pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10
$$

$$
\text{Total slots} = \text{Slots/pole} \times P = 10 \times 8 = 80 \text{ slots}
$$

**Step 4: Minimum order of harmonic suppressed**

For a short-pitched winding, the $n^{th}$ harmonic is suppressed when:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right) = 0
$$

$$
\cos\left(\frac{n \times 36^\circ}{2}\right) = \cos(18^\circ n) = 0
$$

$$
18^\circ n = 90^\circ \implies n = 5
$$

The minimum order harmonic that can be suppressed is the **5th harmonic**.

**Final Answer:**
- Total slots $= 80$
- Minimum harmonic suppressed $= 5^{th}$ harmonic

---

### Q6. S12-3A (Alternate) | 04 marks

**Explain with a neat diagram the construction of a distributed winding. How does it differ from a concentrated winding?**

**Answer:**

**Concentrated Winding:**
In a concentrated winding, all coils of a phase are placed in a single slot per pole. This means all conductors of one phase under one pole are grouped together in one slot.

**Characteristics:**
- Simple construction
- Poor waveform (high harmonic content)
- Higher copper loss due to longer end connections
- Used only in small machines or special applications

**Distributed Winding:**
In a distributed winding, the coils of each phase are spread across multiple slots per pole. For a 3-phase machine with $q$ slots per pole per phase, the coils are distributed over $q$ adjacent slots.

**Characteristics:**
- Better sinusoidal EMF waveform
- Reduced harmonics
- Better space utilization
- Shorter end connections, saving copper
- Most commonly used in AC machines

**Diagram Description:**
*[Imagine a diagram showing a portion of the stator with 12 slots per pole. Phase A coils are placed in slots 1, 2, 3, 4 (for $q=4$). Phase B starts 120° later in slots 5, 6, 7, 8. Phase C in slots 9, 10, 11, 12. Each phase has 4 coils distributed across 4 slots.]*

**Key Differences:**

| Feature | Concentrated Winding | Distributed Winding |
|---------|---------------------|-------------------|
| Coil placement | All coils in one slot per pole | Coils spread over multiple slots |
| EMF waveform | Poor, rich in harmonics | Nearly sinusoidal |
| Distribution factor $K_d$ | 1.0 | < 1.0 (typically 0.95-0.98) |
| Copper utilization | Poor (long end connections) | Better (shorter end connections) |
| Cooling | Poor | Better (more surface area) |
| Application | Small motors, relays | All large AC machines |

---

### Q7. S22-1A (Alternate) | 02 marks

**What is the effect of distribution factor on the generated EMF? How does it help in reducing harmonics?**

**Answer:**

**Effect on Generated EMF:**

The distribution factor $K_d$ reduces the fundamental EMF compared to a concentrated winding:

$$
E_{ph(distributed)} = K_d \times E_{ph(concentrated)}
$$

Since $K_d < 1$, the distributed winding produces slightly lower EMF than a concentrated winding with the same number of turns. However, this small reduction is compensated by the benefits.

**Harmonic Reduction:**

For the $n^{th}$ harmonic:

$$
K_{dn} = \frac{\sin(n m \beta/2)}{m \sin(n \beta/2)}
$$

As $n$ increases, $K_{dn}$ becomes progressively smaller. For example, with $m = 4$ and $\beta = 15^\circ$:

- Fundamental ($n=1$): $K_{d1} = 0.9577$
- 3rd harmonic ($n=3$): $K_{d3} = 0.6533$
- 5th harmonic ($n=5$): $K_{d5} = 0.2053$
- 7th harmonic ($n=7$): $K_{d7} = 0.1576$

The distribution factor heavily attenuates higher-order harmonics, resulting in a nearly sinusoidal EMF waveform. This is why all practical AC machines use distributed windings.

---

## Numerical Problems

### N1. EMF Calculation with Distributed Winding

**Problem:** A 3-phase, 50 Hz, 4-pole alternator has 48 stator slots. Each coil has 10 turns and the coil span is 10 slots. The flux per pole is 0.12 Wb. Calculate the phase and line EMF if the winding is star-connected.

**Solution:**

**Step 1: Slots per pole**

$$
\text{Slots/pole} = \frac{48}{4} = 12
$$

**Step 2: Slot angle $\beta$**

$$
\beta = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 3: Slots per pole per phase $m$**

$$
m = \frac{12}{3} = 4
$$

**Step 4: Distribution factor $K_d$**

$$
K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)} = \frac{\sin 30^\circ}{4 \times \sin 7.5^\circ}
$$

$$
K_d = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 5: Pitch factor $K_p$**

Full pitch $= 12$ slots. Coil span $= 10$ slots. Short by 2 slots.

Short-pitch angle $\alpha = 2 \times 15^\circ = 30^\circ$

$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos 15^\circ = 0.9659
$$

**Step 6: Winding factor $K_w$**

$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 7: Turns per phase $T_{ph}$**

Total slots $= 48$. Each slot has 1 coil side. Each coil has 10 turns.

Total coils $= 48/2 = 24$ coils (since each coil occupies 2 slots)

Coils per phase $= 24/3 = 8$ coils

Turns per phase $T_{ph} = 8 \times 10 = 80$ turns

**Step 8: Phase EMF**

$$
E_{ph} = 4.44 \times f \times \Phi \times T_{ph} \times K_w
$$

$$
E_{ph} = 4.44 \times 50 \times 0.12 \times 80 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 = 222, \quad 222 \times 0.12 = 26.64, \quad 26.64 \times 80 = 2131.2, \quad 2131.2 \times 0.9250 = 1971.36 \text{ V}
$$

**Step 9: Line EMF (star connection)**

$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 1971.36 = 3414.5 \text{ V}
$$

**Answer:** $E_{ph} = 1971.36$ V, $E_L = 3414.5$ V

---

### N2. Harmonic Suppression by Short-Pitching

**Problem:** A 3-phase alternator has 72 slots and 6 poles. The coil span is 11 slots. Determine:
(i) The order of harmonics that are completely eliminated
(ii) The pitch factor for the fundamental, 5th, and 7th harmonics

**Solution:**

**Step 1: Slots per pole**

$$
\text{Slots/pole} = \frac{72}{6} = 12
$$

**Step 2: Slot angle $\beta$**

$$
\beta = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 3: Short-pitch angle $\alpha$**

Full pitch $= 12$ slots. Coil span $= 11$ slots. Short by 1 slot.

$$
\alpha = 1 \times 15^\circ = 15^\circ
$$

**Step 4: Harmonics completely eliminated**

For complete elimination, $K_{pn} = \cos(n\alpha/2) = 0$

$$
\cos\left(\frac{n \times 15^\circ}{2}\right) = \cos(7.5^\circ n) = 0
$$

$$
7.5^\circ n = 90^\circ, 270^\circ, 450^\circ, ...
$$

$$
n = 12, 36, 60, ...
$$

The 12th harmonic is completely eliminated. However, these are high-order harmonics. For practical purposes, we check lower harmonics:

- 5th harmonic: $K_{p5} = \cos(5 \times 7.5^\circ) = \cos 37.5^\circ = 0.7934$ (not eliminated)
- 7th harmonic: $K_{p7} = \cos(7 \times 7.5^\circ) = \cos 52.5^\circ = 0.6088$ (not eliminated)

**Step 5: Pitch factors**

$$
K_{p1} = \cos\left(\frac{15^\circ}{2}\right) = \cos 7.5^\circ = 0.9914
$$

$$
K_{p5} = \cos\left(\frac{5 \times 15^\circ}{2}\right) = \cos 37.5^\circ = 0.7934
$$

$$
K_{p7} = \cos\left(\frac{7 \times 15^\circ}{2}\right) = \cos 52.5^\circ = 0.6088
$$

**Answer:**
- Completely eliminated harmonics: $n = 12, 24, 36, ...$ (multiples of 12)
- $K_{p1} = 0.9914$, $K_{p5} = 0.7934$, $K_{p7} = 0.6088$

---

### N3. Design of Winding to Eliminate 5th Harmonic

**Problem:** A 3-phase, 50 Hz, 600 rpm alternator has 90 slots. The winding is to be designed to completely eliminate the 5th harmonic. Determine:
(i) Number of poles
(ii) Coil span in slots
(iii) Distribution factor for the fundamental

**Solution:**

**Step 1: Number of poles**

$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{600} = 10 \text{ poles}
$$

**Step 2: Slots per pole**

$$
\text{Slots/pole} = \frac{90}{10} = 9
$$

**Step 3: Slot angle $\beta$**

$$
\beta = \frac{180^\circ}{9} = 20^\circ \text{ electrical}
$$

**Step 4: Short-pitch angle for 5th harmonic elimination**

For 5th harmonic elimination: $K_{p5} = \cos(5\alpha/2) = 0$

$$
\frac{5\alpha}{2} = 90^\circ \implies \alpha = \frac{2 \times 90^\circ}{5} = 36^\circ
$$

**Step 5: Coil span in slots**

Short-pitch in slots $= \frac{\alpha}{\beta} = \frac{36^\circ}{20^\circ} = 1.8$ slots

Since slots must be integer, we take 2 slots short.

Actual $\alpha = 2 \times 20^\circ = 40^\circ$

Coil span $= 9 - 2 = 7$ slots

Check: $K_{p5} = \cos(5 \times 40^\circ/2) = \cos 100^\circ = -0.1736$ (not zero, but significantly reduced)

For exact elimination, we need $\alpha = 36^\circ$, but with 9 slots/pole, $\beta = 20^\circ$, we cannot get exactly $36^\circ$. The closest is $\alpha = 40^\circ$ (2 slots short).

**Step 6: Distribution factor**

Slots per pole per phase $m = \frac{9}{3} = 3$

$$
K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(3 \times 20^\circ/2)}{3 \times \sin(20^\circ/2)} = \frac{\sin 30^\circ}{3 \times \sin 10^\circ}
$$

$$
K_d = \frac{0.5}{3 \times 0.1736} = \frac{0.5}{0.5208} = 0.9600
$$

**Answer:**
- Poles $= 10$
- Coil span $= 7$ slots (short by 2 slots)
- $K_d = 0.9600$

---

## Quick Quiz

**Q1.** What is the range of values for the distribution factor $K_d$?

**Answer:** $0 < K_d \leq 1$. For a concentrated winding, $K_d = 1$. For distributed windings, $K_d$ is typically between 0.95 and 0.98 for the fundamental.

---

**Q2.** If a coil span is 5/6 of the pole pitch, what is the short-pitch angle $\alpha$?

**Answer:** Full pitch $= 180^\circ$. Coil span $= (5/6) \times 180^\circ = 150^\circ$. Short-pitch angle $\alpha = 180^\circ - 150^\circ = 30^\circ$.

---

**Q3.** Which harmonic is completely eliminated when the coil span is 2/3 of the pole pitch?

**Answer:** Coil span $= (2/3) \times 180^\circ = 120^\circ$. $\alpha = 180^\circ - 120^\circ = 60^\circ$. For elimination: $\cos(n \times 60^\circ/2) = \cos(30^\circ n) = 0$. $30^\circ n = 90^\circ \implies n = 3$. The 3rd harmonic is eliminated.

---

**Q4.** Why is the distribution factor always less than 1 for a distributed winding?

**Answer:** The distribution factor is the ratio of phasor sum to arithmetic sum of coil EMFs. Since the coil EMFs are displaced in phase by the slot angle $\beta$, their phasor sum is always less than their arithmetic sum (unless $\beta = 0$, which is the concentrated winding case). Hence $K_d < 1$.

---

**Q5.** A 3-phase alternator has 4 slots per pole per phase. What is the value of $m$ in the distribution factor formula?

**Answer:** $m = 4$ (the number of slots per pole per phase). This means each phase belt contains 4 coils under each pole.