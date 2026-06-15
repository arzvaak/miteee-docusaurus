---
title: PYQ Answer Bank
description: Exam-ready Electrical Machines II previous-year questions with complete answers.
---

# Electrical Machines II PYQ Answer Bank

This page contains the corrected question-and-answer bank generated from the selected PYQs. The sequence is kept as Question 1, Answer 1, Question 2, Answer 2, and so on for exam revision.

**Total questions:** 141

## Question 1
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 5A | EM-I ELE 2103 End Sem, 27 November 2018

Develop a single layer wave winding table for the stator winding of a three phase AC machine with 36 slots and 4 poles. Assume RBY sequence. (04)

### Answer 1
**Given:** 36 slots, 4 poles, 3-phase, RBY sequence, single-layer wave winding.

**Parameters:**
- Slots per pole = $36/4 = 9$.
- Slot angle $\beta = 180^\circ/9 = 20^\circ$ electrical.
- Slots per pole per phase $q = \frac{36}{3 \times 4} = 3$.

**Winding Table:**
The phase belts are arranged with $60^\circ$ spread and alternating polarity under successive poles.

| Pole | Phase belt | Slot numbers |
|------|------------|---------------|
| N1 | R (+) | 1, 2, 3 |
| | B (-) | 4, 5, 6 |
| | Y (+) | 7, 8, 9 |
| S1 | R (-) | 10, 11, 12 |
| | B (+) | 13, 14, 15 |
| | Y (-) | 16, 17, 18 |
| N2 | R (+) | 19, 20, 21 |
| | B (-) | 22, 23, 24 |
| | Y (+) | 25, 26, 27 |
| S2 | R (-) | 28, 29, 30 |
| | B (+) | 31, 32, 33 |
| | Y (-) | 34, 35, 36 |

**Coil Connections:**
Coils are full-pitch with span $9$ slots. Coil groups for each phase:
- R-phase: (1,10), (2,11), (3,12); (19,28), (20,29), (21,30)
- B-phase: (4,13), (5,14), (6,15); (22,31), (23,32), (24,33)
- Y-phase: (7,16), (8,17), (9,18); (25,34), (26,35), (27,36)

All coils of a phase are connected in series with correct polarity to give additive emfs.

> **Final answer:** Single-layer wave winding with $q=3$, $\beta=20^\circ$ electrical, full-pitch coils; winding table as above.


---

## Question 2
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 End Sem, 13 May 2014

Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding (02)

### Answer 2
**(i) Integral and Fractional slot winding**
- **Integral-slot winding:** The number of slots per pole per phase $q = \frac{S}{P \times m}$ is an integer. This yields a simple, symmetrical layout where each phase belt occupies a whole number of slots per pole.
- **Fractional-slot winding:** $q$ is not an integer (e.g. $2\frac{1}{2}$). It is employed to reduce cogging torque, suppress certain harmonics, or to suit specific slot-pole combinations. Careful design ensures balanced phase voltages.

**(ii) Full pitch and Fractional pitch winding**
- **Full-pitch winding:** The coil span equals one pole pitch ($180^\circ$ electrical). The two coil sides experience emfs in exact phase opposition; the resultant coil emf is the arithmetic sum, giving maximum fundamental output.
- **Fractional-pitch (short-pitch) winding:** The coil span is less than $180^\circ$ electrical by a chording angle $\alpha$. The fundamental emf is reduced by factor $\cos(\alpha/2)$. Short-pitching can eliminate selected harmonic emfs (when $\cos(n\alpha/2)=0$), reduces end-winding copper, and lowers leakage reactance.

> **Final answer:** Integral: $q$ integer; fractional: $q$ fractional. Full-pitch: coil span = $180^\circ$ electrical; fractional-pitch: coil span $< 180^\circ$ electrical.


---

## Question 3
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1B | EM-II ELE 204 End Sem, 13 May 2014

A 3 phase alternator has 2 slots per pole per phase and coil span of 5 slot pitches. The flux density wave of alternator consists of a fundamental and a 25% third harmonic. Calculate the percentage increase in the phase voltage due to harmonic. (04)

### Answer 3
**Given:** 3-phase alternator, $q=2$ slots/pole/phase, coil span $5$ slot pitches, third harmonic flux density $25\%$ of fundamental.

**Solution:**
- Slots per pole = $m \times q = 3 \times 2 = 6$.
- Slot angle $\beta = 180^\circ / 6 = 30^\circ$ electrical.
- Coil is short-pitched by $6-5=1$ slot $\Rightarrow$ chording angle $\alpha = 1 \times 30^\circ = 30^\circ$.

**Fundamental Winding Factors:**
$$
\begin{aligned}
K_{d1} &= \frac{\sin(q\beta/2)}{q\sin(\beta/2)}
       = \frac{\sin(2\times15^\circ)}{2\sin15^\circ}
       = \frac{0.5}{2\times0.258819} \approx 0.9659, \\[4pt]
K_{p1} &= \cos(\alpha/2) = \cos15^\circ \approx 0.9659, \\[4pt]
K_{w1} &= 0.9659 \times 0.9659 \approx 0.9330.
\end{aligned}
$$

**Third-Harmonic Winding Factors:**
$$
\begin{aligned}
K_{d3} &= \frac{\sin(q\times3\beta/2)}{q\sin(3\beta/2)}
       = \frac{\sin(2\times45^\circ)}{2\sin45^\circ}
       = \frac{1}{2\times0.7071} = 0.7071, \\[4pt]
K_{p3} &= \cos(3\alpha/2) = \cos45^\circ = 0.7071, \\[4pt]
K_{w3} &= 0.7071 \times 0.7071 = 0.5.
\end{aligned}
$$

**Harmonic EMF Ratio:**
$$
\frac{E_3}{E_1} = \frac{B_3 K_{w3}}{B_1 K_{w1}}
                = 0.25 \times \frac{0.5}{0.9330}
                \approx 0.13397.
$$

**Resultant Phase Voltage and Increase:**
$$
\begin{aligned}
E_{\text{ph}} &= \sqrt{E_1^2 + E_3^2}
              = E_1\sqrt{1 + (0.13397)^2}
              \approx 1.00894\,E_1, \\[4pt]
\%\text{ increase} &= \frac{E_{\text{ph}} - E_1}{E_1} \times 100\%
                   \approx (1.00894 - 1)\times 100\%
                   \approx 0.894\%.
\end{aligned}
$$

> **Final answer:** The phase voltage increases by approximately **0.89\%** due to the third harmonic.


---

## Question 4
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 Makeup, 08 July 2014

A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air-gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced. (04)

### Answer 4
**Given:**
3-phase, 50 Hz, 1000 rpm star-connected alternator, 72 slots, 6 conductors/slot, coil span 10 slots, flux per pole $\phi = 0.26$ Wb.

**Solution:**

Number of poles:
$$
\begin{aligned}
P = \frac{120f}{N} = \frac{120 \times 50}{1000} = 6.
\end{aligned}
$$

Slots per pole $= \frac{72}{6}=12$.
Slot angle $\beta = \frac{180^\circ}{12}=15^\circ$ (electrical).
Slots per pole per phase $q = \frac{72}{3\times 6} = 4$.

**(i) Distribution and pitch factors**

**Distribution factor $K_d$:**
$$
\begin{aligned}
K_d = \frac{\sin(q\beta/2)}{q \sin(\beta/2)} = \frac{\sin(4\times 15^\circ/2)}{4\sin(15^\circ/2)} = \frac{\sin 30^\circ}{4\sin 7.5^\circ} \approx \frac{0.5}{4\times0.1305} \approx 0.958.
\end{aligned}
$$

**Pitch factor $K_p$:**
Coil span = 10 slots, full pitch = 12 slots → short-pitch by 2 slots.
Chording angle $\alpha = 2 \times 15^\circ = 30^\circ$.
$$
\begin{aligned}
K_p = \cos(\alpha/2) = \cos 15^\circ \approx 0.966.
\end{aligned}
$$

Winding factor $K_w = K_d K_p \approx 0.958 \times 0.966 = 0.925$.

**(ii) Turns per phase**
Total armature conductors $Z = 72 \times 6 = 432$.
For a double-layer, 3-phase winding, series turns per phase
$$
\begin{aligned}
T_{ph} = \frac{Z}{2 \times 3} = \frac{432}{6} = 72\ \text{turns}.
\end{aligned}
$$

**(iii) Induced EMF**
Phase emf:
$$
\begin{aligned}
E_{ph} = 4.44\,f\,\phi\,T_{ph}\,K_w = 4.44 \times 50 \times 0.26 \times 72 \times 0.925 \approx 3844\ \text{V} \approx 3.84\ \text{kV}.
\end{aligned}
$$
Line emf (star connection):
$$
\begin{aligned}
E_L = \sqrt{3}\,E_{ph} \approx 1.732 \times 3844 \approx 6659\ \text{V} \approx 6.66\ \text{kV}.
\end{aligned}
$$

> **Final answer:** $K_d = 0.958$, $K_p = 0.966$; $T_{ph} = 72$ turns; $E_{ph} \approx 3.84$ kV; $E_L \approx 6.66$ kV.


---

## Question 5
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 2A | EM-II ELE 204 Makeup, 08 July 2014

A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical Determine (i) total number of armature slots (ii) minimum order of harmonic emf that can be suppressed. (03)

### Answer 5
**Given:** 3-phase, 50 Hz, 750 rpm alternator; coil span = 144° (electrical), short-pitched by two slots.

**Solution:**

Number of poles:
$$
\begin{aligned}
P = \frac{120f}{N} = \frac{120\times 50}{750} = 8.
\end{aligned}
$$

Short-pitch angle $\varepsilon = 180^\circ - 144^\circ = 36^\circ$ electrical.
Since the short-pitch is caused by displacing the coil sides by 2 slots, the slot angle is
$$
\begin{aligned}
\beta = \frac{\varepsilon}{2} = \frac{36^\circ}{2} = 18^\circ \ \text{electrical}.
\end{aligned}
$$

Slots per pole $= \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10$.

Total number of armature slots:
$$
\begin{aligned}
S = P \times (\text{slots per pole}) = 8 \times 10 = 80.
\end{aligned}
$$

**Harmonic suppression:**
The pitch factor for $n$th harmonic is $K_{pn} = \cos(n\varepsilon/2)$.
To eliminate a harmonic, set $\cos(n\varepsilon/2)=0$ → $n\varepsilon/2 = 90^\circ$, giving
$$
\begin{aligned}
n = \frac{180^\circ}{\varepsilon} = \frac{180^\circ}{36^\circ} = 5.
\end{aligned}
$$
Hence the 5th harmonic is completely suppressed; it is the minimum order that can be eliminated by this short-pitch.

> **Final answer:** (i) Total slots = **80**; (ii) minimum suppressed harmonic = **5th harmonic**.


---

## Question 6
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 Makeup, 09 July 2015

Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine. (02)

### Answer 6
Short-pitching (chording) is the practice of making the coil span less than the full pole pitch of 180° electrical. The following advantages are obtained:

1. **Harmonic elimination:** The pitch factor for the $n$th harmonic is $K_{pn}= \cos(n\alpha/2)$, where $\alpha$ is the chording angle. By choosing $\alpha = 180^\circ/n$, the $n$th harmonic is completely cancelled. For example, $\alpha = 36^\circ$ eliminates the 5th harmonic, and $\alpha \approx 25.7^\circ$ removes the 7th. A common short-pitch of 30° ($\alpha=30^\circ$) greatly attenuates both the 5th and 7th. The result is a near-sinusoidal voltage waveform, with lower harmonic losses, less magnetic noise, and reduced torque pulsations.

2. **Saving in copper:** Shorter end connections require less copper, which lowers material cost, reduces winding weight, and cuts $I^2R$ losses. This can also lead to smaller overall machine dimensions.

3. **Lower leakage reactance and better cooling:** Reduced overhang length decreases stator leakage reactance, improving voltage regulation of generators and torque-speed characteristics of motors. The slimmer end windings also permit improved cooling airflow, allowing higher current densities.

4. **Quieter operation and lower stray losses:** By suppressing harmonic fluxes, pulsating torques, stray eddy-current losses in the core and structure, and magnetic noise are all diminished.

The only drawback is a slight reduction of the fundamental induced emf by the factor $\cos(\alpha/2)$, which is a small price for the significant benefits gained.

> **Final answer:** Short-pitch windings suppress harmonics, save copper, reduce leakage reactance, improve cooling and noise performance, with only a modest loss in fundamental emf.


---

## Question 7
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1B | EM-II ELE 204 Makeup, 09 July 2015

For a 3-phase, 50 Hz, 10 pole alternator with 90 slots with a 60° phase spread with a coil span of 140°, obtain the pitch and distribution factors for fundamental, 3rd and 5th harmonic emfs. (03)

### Answer 7
Given a 3-phase, 50 Hz, 10-pole alternator with 90 slots and a coil span of 140° (electrical). The slot pitch and other base quantities are:

- Slots per pole = $90/10 = 9$.
- Slot pitch $\beta = 180^\circ/9 = 20^\circ$ (electrical).
- Slots per pole per phase $q = 90/(10 \times 3) = 3$.
- Short-pitch angle $\alpha = 180^\circ - 140^\circ = 40^\circ$.

The pitch factor, distribution factor and winding factor for the $n$th harmonic are

$$
\begin{aligned}
K_{pn} &= \cos\left(\frac{n\alpha}{2}\right), \\
K_{dn} &= \frac{\sin\!\bigl(q \frac{n\beta}{2}\bigr)}{q \sin\!\bigl(\frac{n\beta}{2}\bigr)}, \\
K_{wn} &= K_{dn} \cdot K_{pn}.
\end{aligned}
$$

**Fundamental ($n=1$)**
$n\beta/2 = 10^\circ$, $n\alpha/2 = 20^\circ$:
$$
\begin{aligned}
K_{d1} &= \frac{\sin(3 \times 10^\circ)}{3 \sin 10^\circ} = \frac{\sin 30^\circ}{3 \times 0.17365} = \frac{0.5}{0.52095} \approx 0.9598, \\
K_{p1} &= \cos 20^\circ = 0.9397, \\
K_{w1} &= 0.9598 \times 0.9397 \approx 0.9019.
\end{aligned}
$$

**Third harmonic ($n=3$)**
$3\beta/2 = 30^\circ$, $3\alpha/2 = 60^\circ$:
$$
\begin{aligned}
K_{d3} &= \frac{\sin(3 \times 30^\circ)}{3 \sin 30^\circ} = \frac{\sin 90^\circ}{1.5} = \frac{1}{1.5} = 0.6667, \\
K_{p3} &= \cos 60^\circ = 0.5000, \\
K_{w3} &= 0.6667 \times 0.5000 = 0.3333.
\end{aligned}
$$

**Fifth harmonic ($n=5$)**
$5\beta/2 = 50^\circ$, $5\alpha/2 = 100^\circ$:
$$
\begin{aligned}
K_{d5} &= \frac{\sin(3 \times 50^\circ)}{3 \sin 50^\circ} = \frac{\sin 150^\circ}{3 \times 0.7660} = \frac{0.5}{2.298} \approx 0.2176, \\
K_{p5} &= \cos 100^\circ = -0.1737 \quad (\text{magnitude } 0.1737), \\
|K_{w5}| &= 0.2176 \times 0.1737 \approx 0.0378.
\end{aligned}
$$

> **Final answer:** Fundamental: $K_{p1}=0.940$, $K_{d1}=0.960$, $K_{w1}=0.902$; 3rd harmonic: $K_{p3}=0.500$, $K_{d3}=0.667$, $K_{w3}=0.333$; 5th harmonic: $|K_{p5}|=0.174$, $K_{d5}=0.218$, $|K_{w5}|=0.0378$.


---

## Question 8
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1C | EM-II ELE 204 Makeup, 09 July 2015

A 3 phase, 6 pole, 1000 rpm star connected alternator has an air-gap diameter of 40 cm and a core length of 90 cm. The armature consists of 54 slots with 4 conductors per slot. The flux density in the air-gap is given by B(θ)=0.25 × sin θ + 0.16 × sin 3θ + 0.07 × sin 5θ. The winding factors for fundamental, 3rd and 5th harmonic are 0.95, 0.58 and 0.14 respectively. Determine resultant phase and line emfs. (05)

### Answer 8
Given: 3-phase, 6-pole, 1000 rpm, star-connected alternator. Air-gap diameter = 0.4 m, core length = 0.9 m, 54 slots, 4 conductors/slot. Flux density $B(\theta) = 0.25 \sin \theta + 0.16 \sin 3\theta + 0.07 \sin 5\theta$. Winding factors: $K_{w1}=0.95$, $K_{w3}=0.58$, $K_{w5}=0.14$.

**Frequency:** $f = \frac{P N_s}{120} = \frac{6 \times 1000}{120} = 50$ Hz.

**Series turns per phase:** Total conductors $Z = 54 \times 4 = 216$. For a double-layer winding, $T_{ph} = \frac{Z}{2m} = \frac{216}{2 \times 3} = 36$ turns.

**Pole area:** $A_p = \frac{\pi D L}{P} = \frac{\pi \times 0.4 \times 0.9}{6} \approx 0.1885$ m².

**Flux per pole (nth harmonic):** $\varphi_n = \frac{2}{n\pi} B_{n,\max} A_p$:

$$
\begin{aligned}
\varphi_1 &= \frac{2}{\pi} \times 0.25 \times 0.1885 = 0.0300 \text{ Wb},\\
\varphi_3 &= \frac{2}{3\pi} \times 0.16 \times 0.1885 = 0.00640 \text{ Wb},\\
\varphi_5 &= \frac{2}{5\pi} \times 0.07 \times 0.1885 = 0.00168 \text{ Wb}.
\end{aligned}
$$

**EMF per phase for each harmonic:** $E_n = 4.44 (n f) \varphi_n T_{ph} K_{wn}$:

$$
\begin{aligned}
E_1 &= 4.44 \times 50 \times 0.0300 \times 36 \times 0.95 = 227.8 \text{ V},\\
E_3 &= 4.44 \times 150 \times 0.00640 \times 36 \times 0.58 = 89.0 \text{ V},\\
E_5 &= 4.44 \times 250 \times 0.00168 \times 36 \times 0.14 = 9.4 \text{ V}.
\end{aligned}
$$

**Resultant phase voltage (rms):** $E_{ph} = \sqrt{E_1^2 + E_3^2 + E_5^2} = \sqrt{227.8^2 + 89.0^2 + 9.4^2} \approx 244.8$ V.

**Line voltage (star):** Triplen (3rd) harmonic cancels in line voltage. Hence

$$
E_L = \sqrt{3} \sqrt{E_1^2 + E_5^2} = \sqrt{3} \times \sqrt{227.8^2 + 9.4^2} \approx 395.0 \text{ V}.
$$

> **Final answer:** Phase emf ≈ 244.8 V (≈ 245 V); line emf ≈ 395.0 V (≈ 395 V).


---

## Question 9
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3A | EM-II ELE 2202 End Sem, 23 April 2018

A 3 phase, 10 pole, star connected alternator runs at 600 rpm. It has 120 stator slots with 8 conductors per slot. The conductors of each phase are connected in series. If the winding is short chorded by two slots, determine the rms value of phase and line electromotive forces if the flux per pole is 56 mWb. (04)

### Answer 9
Given: 3-phase, 10-pole, star alternator, 600 rpm, 120 slots, 8 conductors/slot, short-chorded by 2 slots, flux/pole $\phi = 56$ mWb.

**Frequency:** $f = \frac{P N}{120} = \frac{10 \times 600}{120} = 50$ Hz.

**Slot angle:** Slots/pole = $120/10 = 12$, so $\beta = \frac{180^\circ}{12} = 15^\circ$.

**Chording angle:** $\alpha = 2 \times \beta = 30^\circ$.

**Slots per pole per phase:** $q = \frac{120}{10 \times 3} = 4$.

**Distribution factor:** $K_d = \frac{\sin(q\beta/2)}{q \sin(\beta/2)} = \frac{\sin(4 \times 7.5^\circ)}{4 \sin 7.5^\circ} = \frac{\sin 30^\circ}{4 \times 0.1305} \approx 0.9577$.

**Pitch factor:** $K_p = \cos(\alpha/2) = \cos 15^\circ \approx 0.9659$.

**Winding factor:** $K_w = K_d K_p = 0.9577 \times 0.9659 \approx 0.9250$.

**Series turns per phase:** Total conductors = $120 \times 8 = 960$; $T_{ph} = \frac{960}{2 \times 3} = 160$ turns.

**Induced EMF per phase:** $E_{ph} = 4.44 f \phi T_{ph} K_w = 4.44 \times 50 \times 0.056 \times 160 \times 0.925 \approx 1840$ V $= 1.84$ kV.

**Line voltage (star):** $E_L = \sqrt{3} E_{ph} = \sqrt{3} \times 1840 \approx 3187$ V $\approx 3.19$ kV.

> **Final answer:** Phase emf ≈ 1.84 kV; line emf ≈ 3.19 kV.


---

## Question 10
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 4B | EM-II ELE 2202 End Sem, 24 April 2017

A three-phase, 50 Hz, 1,000 rpm alternator has 108 slots. The armature is lap connected with a coil span of 160°. Calculate pitch & distribution factors for fundamental, 5th harmonic & 7th harmonic. (03)

### Answer 10
Given a three-phase alternator with 108 slots, 50 Hz, 1000 rpm, lap-connected, coil span 160° electrical.

**Solution:**

Number of poles $P = \frac{120f}{N_s} = \frac{120\times 50}{1000} = 6$.
Slots per pole $= 108/6 = 18$, slot angle $\beta = 180^\circ/18 = 10^\circ$ electrical.
Slots per pole per phase $q = \frac{108}{6\times 3} = 6$.
Chording angle $\alpha = 180^\circ - 160^\circ = 20^\circ$.

**Pitch factor:** $K_{pn} = \cos\left(\frac{n\alpha}{2}\right)$
**Distribution factor:** $K_{dn} = \frac{\sin\left(\frac{n q \beta}{2}\right)}{q \sin\left(\frac{n\beta}{2}\right)}$

**Fundamental (n=1):**
$K_{p1} = \cos(10^\circ) = 0.9848$
$K_{d1} = \frac{\sin(30^\circ)}{6\sin 5^\circ} = 0.9561$

**5th harmonic (n=5):**
$K_{p5} = \cos(50^\circ) = 0.6428$
$K_{d5} = \frac{\sin(150^\circ)}{6\sin 25^\circ} = 0.1972$

**7th harmonic (n=7):**
$K_{p7} = \cos(70^\circ) = 0.3420$
$K_{d7} = \frac{\sin(210^\circ)}{6\sin 35^\circ} = -0.1453$ (magnitude 0.1453)

> **Final answer:**
> - Fundamental: $K_p = 0.9848$, $K_d = 0.9561$
> - 5th harmonic: $K_p = 0.6428$, $K_d = 0.1972$
> - 7th harmonic: $K_p = 0.3420$, $K_d = -0.1453$ (|K_d| = 0.1453)


---

## Question 11
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3C | EM-II ELE 2202 End Sem, 29 April 2019

In a star-connected alternator calculate the percentage of 5th harmonics induced in the line voltage if the average flux per pole of fifth harmonic components is 1% of that of the fundamental. Neglect the pitch and distribution factors. (02)

### Answer 11
In a star-connected alternator, calculate the percentage of 5th harmonic induced in the line voltage. Given: average flux per pole of 5th harmonic is 1\% of fundamental, neglect pitch and distribution factors.

**Solution:**

Induced phase emf for harmonic $n$: $E_{ph,n} \propto n\,\phi_n$ (since $K_w=1$).
Fundamental: $E_{ph,1} \propto 1 \times \phi_1$.
5th harmonic: $E_{ph,5} \propto 5 \times 0.01\phi_1 = 0.05\phi_1$.
Thus $\frac{E_{ph,5}}{E_{ph,1}} = 0.05 = 5\%$.

In a star connection, for non-triplen harmonics (such as 5th), the line voltage is $\sqrt{3}$ times the phase voltage. Hence the 5th harmonic percentage in line voltage remains 5\%.

> **Final answer:** The 5th harmonic line-voltage component is 5\% of the fundamental line voltage.


---

## Question 12
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 2B | EM-II ELE 2202 Makeup, 02 July 2016

A three phase, 50 Hz, 1000 rpm, star connected alternator has an air-gap area of 314 cm² per pole. The armature winding has a phase spread of 60° and is accommodated in 4 slots per pole per phase with 6 conductors per slot. The coils are short pitched with a span of 165°. The flux density distribution is given by Bmax = 0.9 sin θ + 0.35 sin 3θ. Determine, (a) Winding factors for fundamental and third harmonic components. (b) Induced emf per phase. 6M

### Answer 12
Given: 3-phase, 50 Hz, 1000 rpm, star alternator; air-gap area $A = 314\,\text{cm}^2 = 0.0314\,\text{m}^2$ per pole; $q=4$ slots/pole/phase, 6 conductors/slot; coil span $165^\circ$ electrical; $B(\theta) = 0.9\sin\theta + 0.35\sin 3\theta$ T.

**Solution:**

Number of poles $P = \frac{120\times50}{1000} = 6$.
Total slots $S = 4 \times 3 \times 6 = 72$.
Slots per pole $= 72/6 = 12 \Rightarrow$ slot angle $\beta = 180^\circ/12 = 15^\circ$ electrical.
Chording angle $\varepsilon = 180^\circ - 165^\circ = 15^\circ$.
Series turns per phase $T_{ph} = \frac{72 \times 6}{2 \times 3} = 72$.

**(a) Winding factors**

Distribution factor: $K_{dn} = \frac{\sin\left(\frac{n q \beta}{2}\right)}{q \sin\left(\frac{n\beta}{2}\right)}$
Pitch factor: $K_{pn} = \cos\left(\frac{n\varepsilon}{2}\right)$

**Fundamental (n=1)**
$K_{d1} = \frac{\sin(4 \times 7.5^\circ)}{4 \sin 7.5^\circ} = \frac{\sin 30^\circ}{4 \sin 7.5^\circ} = 0.9577$
$K_{p1} = \cos 7.5^\circ = 0.9914$
$K_{w1} = 0.9577 \times 0.9914 = 0.9495 \approx 0.95$

**Third harmonic (n=3)**
$K_{d3} = \frac{\sin(4 \times 22.5^\circ)}{4 \sin 22.5^\circ} = \frac{\sin 90^\circ}{4 \sin 22.5^\circ} = 0.6533$
$K_{p3} = \cos 22.5^\circ = 0.9239$
$K_{w3} = 0.6533 \times 0.9239 = 0.6035 \approx 0.604$

**(b) Induced emf per phase**

Flux per pole for sinusoidal distribution: $\phi = \frac{2}{\pi} B_{\max} A$

Fundamental:
$\phi_1 = \frac{2}{\pi} \times 0.9 \times 0.0314 = 0.0180\,\text{Wb}$
$E_1 = 4.44\,f\,\phi_1\,T_{ph}\,K_{w1} = 4.44 \times 50 \times 0.0180 \times 72 \times 0.9495 = 273.1\,\text{V}$

Third harmonic:
$\phi_3 = \frac{2}{\pi} \times 0.35 \times 0.0314 = 0.00700\,\text{Wb}$
$f_3 = 3 \times 50 = 150\,\text{Hz}$
$E_3 = 4.44 \times 150 \times 0.00700 \times 72 \times 0.6035 = 202.5\,\text{V}$

Resultant phase emf (rms):
$$\begin{aligned} E_{ph} &= \sqrt{E_1^2 + E_3^2} = \sqrt{273.1^2 + 202.5^2} \approx 340\,\text{V} \end{aligned}$$

> **Final answer:**
> (a) $K_{w1} = 0.95$, $K_{w3} = 0.604$
> (b) Induced emf per phase $\approx 340$ V


---

## Question 13
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3A | EM-II ELE 2202 Makeup, 13 June 2019

A 3-phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air-gap flux per pole is 0.26 Wb. Calculate the distribution and pitch factors of the winding, number of turns per phase and line value of emf induced. (05)

### Answer 13
**Given:**
- 3-phase, 50 Hz, star-connected alternator.
- Speed $N_s = 1000$ rpm, so synchronous.
- 72 armature slots, 6 conductors per slot.
- Coil span $= 10$ slots.
- Average flux per pole $\Phi = 0.26$ Wb.

**Solution:**

**1. Number of poles:**
$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6 \text{ poles}.
$$

**2. Distribution factor $K_d$:**
- Slots per pole $= 72/6 = 12$.
- Electrical slot angle $\beta = \frac{180^\circ}{12} = 15^\circ$.
- Slots per pole per phase $q = \frac{72}{3 \times 6} = 4$.

$$
K_d = \frac{\sin(q\beta/2)}{q \sin(\beta/2)} = \frac{\sin(4 \times 7.5^\circ)}{4 \sin 7.5^\circ} = \frac{0.5}{4 \times 0.1305} \approx 0.958.
$$

**3. Pitch factor $K_p$:**
- Full-pole pitch $= 12$ slots $\equiv 180^\circ$ electrical.
- Coil short-pitched by $2$ slots $\Rightarrow$ chording angle $\alpha = 2 \times 15^\circ = 30^\circ$.

$$
K_p = \cos\frac{\alpha}{2} = \cos 15^\circ \approx 0.966.
$$

**4. Turns per phase $T_{ph}$:**
- Total conductor count $= 72 \times 6 = 432$.
- Assuming double-layer winding, each turn requires 2 conductors, so total turns $= 432/2 = 216$.
- Three phases share these equally: $T_{ph} = 216 / 3 = 72$ turns.
(Equivalently, coils per phase $= 72/3 = 24$, turns per coil $= 6/2 = 3$, giving $24 \times 3 = 72$.)

**5. Induced EMF:**
- Winding factor $K_w = K_d \, K_p \approx 0.925$.
- RMS phase EMF for a sine-flux machine:
$$
E_{ph} = 4.44\,f\,\Phi\,T_{ph}\,K_w.
$$

$$
\begin{aligned}
E_{ph} &= 4.44 \times 50 \times 0.26 \times 72 \times 0.925 \\\
       &= 222 \times 0.26 \times 72 \times 0.925 \\\
       &= 57.72 \times 72 \times 0.925 \\\
       &= 4155.84 \times 0.925 \\\
       &\approx 3844 \text{ V} \approx 3.84 \text{ kV}.
\end{aligned}
$$

- Star connection: line EMF $E_L = \sqrt{3}\,E_{ph} = 1.732 \times 3844 \approx 6659 \text{ V} \approx 6.66 \text{ kV}$.

> **Final answer:** $K_d = 0.958$, $K_p = 0.966$, $K_w = 0.925$; turns per phase $T_{ph} = 72$; phase emf $= 3.84$ kV, line emf $= 6.66$ kV.


---

## Question 14
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3B | EM-II ELE 2202 Makeup, 16 June 2017

A 3-phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air-gap flux per pole is 0.26Wb. Calculate the distribution and pitch factors of the winding, number of turns per phase and line value of emf induced. (04)

### Answer 14
**Given:** 3-phase, 50 Hz, 1000 rpm, star alternator; 72 slots, 6 conductors/slot; coil span 10 slots; $\Phi = 0.26$ Wb.

**Solution:**

**Poles:**
$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6.
$$

**Distribution factor:**
- Slots per pole $= 12$, slot angle $\beta = 15^\circ$ electrical.
- $q = \frac{72}{6 \times 3} = 4$ slots/pole/phase.
- $K_d = \frac{\sin(q\beta/2)}{q \sin(\beta/2)} = \frac{\sin 30^\circ}{4 \sin 7.5^\circ} = \frac{0.5}{4 \times 0.1305} = 0.958$.

**Pitch factor:**
- Full pitch $= 12$ slots; coil span $= 10$ slots, so short-chorded by $2$ slots.
- Chording angle $\alpha = 2 \times 15^\circ = 30^\circ$.
- $K_p = \cos(\alpha/2) = \cos 15^\circ = 0.966$.

**Turns per phase:**
- Total conductors $= 72 \times 6 = 432$.
- Double-layer winding: turns $= \frac{432}{2} = 216$ total, so $T_{ph} = \frac{216}{3} = 72$.

**EMF calculation:**
- Winding factor $K_w = K_d K_p = 0.958 \times 0.966 = 0.925$.
- Phase emf:
$$
\begin{aligned}
E_{ph} &= 4.44 \, f \, \Phi \, T_{ph} \, K_w \\\
       &= 4.44 \times 50 \times 0.26 \times 72 \times 0.925 \\\
       &\approx 3844 \text{ V} \; (= 3.84 \text{ kV}).
\end{aligned}
$$
- Line emf (star):
$$
E_L = \sqrt{3} \, E_{ph} = 1.732 \times 3844 \approx 6659 \text{ V} \approx 6.66 \text{ kV}.
$$

> **Final answer:** $K_d = 0.958$, $K_p = 0.966$, $K_w = 0.925$; $T_{ph} = 72$; line emf $= 6.66$ kV.


---

## Question 15
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3A | EM-II ELE 2202 Makeup, 19 June 2018

For a synchronous generator, derive suitable expressions for (i) Pitch factor (ii) Distribution factor (04)

### Answer 15
**Derivation of pitch factor and distribution factor for a synchronous generator.**

---

**(i) Pitch factor $K_p$ (coil-span factor)**

- In a full-pitch coil, the two coil sides lie exactly one pole-pitch apart, i.e. $180^\circ$ electrical. The induced emfs in the two sides are equal in magnitude and $180^\circ$ out of phase with respect to the coil terminals; therefore, they add arithmetically, giving $E_{\text{coil}} = 2E_{\text{conductor}}$.
- If the coil is **short-pitched** by an angle $\alpha$ (coil span $= 180^\circ - \alpha$), the two emfs are displaced by $\alpha$ electrical in the phasor diagram. Their resultant is the vector sum:
$$
E_{\text{coil}} = 2E_{\text{conductor}} \cos\!\left(\frac{\alpha}{2}\right).
$$
- Hence,
$$
K_p = \frac{\text{phasor sum of coil-side emfs}}{\text{arithmetic sum}} = \cos\!\left(\frac{\alpha}{2}\right).
$$
- For the $n$th harmonic, the chording angle becomes $n\alpha$, so $K_{pn} = \cos(n\alpha/2)$.

---

**(ii) Distribution factor $K_d$ (breadth factor)**

- In a distributed winding, $q$ coils of a phase group under one pole are placed in adjacent slots displaced by the slot angle $\beta$ (electrical). The emfs induced in these coils are all equal in magnitude but have successive phase differences of $\beta$.
- If the coils were concentrated ($q=1$), the total phase emf would be $qE_{\text{coil}}$. In a distributed arrangement, the coil emfs form $q$ equal phasors separated by $\beta$. Their vector sum is the chord of a polygon whose sides are these phasors:
$$
\text{Resultant emf} = E_{\text{coil}} \frac{\sin(q\beta/2)}{\sin(\beta/2)}.
$$
- Therefore,
$$
K_d = \frac{\text{phasor sum}}{\text{arithmetic sum}} = \frac{\sin(q\beta/2)}{q\,\sin(\beta/2)}.
$$
- For the $n$th harmonic the effective slot angle is $n\beta$, so $K_{dn} = \dfrac{\sin(q\,n\beta/2)}{q\,\sin(n\beta/2)}$.

---

The overall winding factor is the product $K_w = K_p \, K_d$. Both factors reduce the induced emf from the value that a concentrated full-pitch winding would produce, and their values are always $\le 1$.

> **Final answer:** $K_p = \cos(\alpha/2)$; $K_d = \dfrac{\sin(q\beta/2)}{q\sin(\beta/2)}$.


---

## Question 16
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1B | EM-II ELE 2225 End Sem, 09 May 2024

A 3-phase, 32-pole, 50Hz alternator used in a hydro-generating station has a star-connected winding with 288 slots and 8 conductors per slot. The coil is short pitched by 40°. The flux per pole is 0.08 Wb. Estimate the phase and line values of induced emfs. Assume the total turns per phase are series connected. 4

### Answer 16
**Given:**
$P=32$, $f=50\,\text{Hz}$, slots $S=288$, conductors/slot $=8$, short-pitch angle $\alpha = 40^\circ$, $\phi = 0.08\,\text{Wb}$, star-connected, all turns per phase in series.

**Solution:**

- Slots per pole: $S/P = 288/32 = 9$.
- Slot angular pitch (electrical): $\beta = 180^\circ/9 = 20^\circ$.
- Slots per pole per phase: $q = \frac{S}{P \times 3} = \frac{288}{32 \times 3} = 3$.

Distribution factor:
$$
\begin{aligned}
K_d &= \frac{\sin(q\beta/2)}{q\sin(\beta/2)} = \frac{\sin(3\times 10^\circ)}{3\sin 10^\circ} \\
    &= \frac{0.5}{3 \times 0.17365} \approx 0.9598.
\end{aligned}
$$

Pitch factor (for chording $\alpha$):
$$
\begin{aligned}
K_p &= \cos(\alpha/2) = \cos 20^\circ \approx 0.9397.
\end{aligned}
$$

Winding factor:
$$
\begin{aligned}
K_w &= K_d\,K_p = 0.9598 \times 0.9397 \approx 0.9019.
\end{aligned}
$$

Total armature conductors: $Z = 288 \times 8 = 2304$.
Turns per phase (series): $T_{ph} = \frac{Z}{2\times 3} = \frac{2304}{6} = 384$.

Induced EMF per phase (r.m.s.):
$$
\begin{aligned}
E_{ph} &= 4.44\,f\,\phi\,T_{ph}\,K_w \\
       &= 4.44 \times 50 \times 0.08 \times 384 \times 0.9019 \\
       &\approx 6150\ \text{V} = 6.15\ \text{kV}.
\end{aligned}
$$

Line voltage (star connection):
$$
\begin{aligned}
E_L &= \sqrt{3}\,E_{ph} = 1.732 \times 6150 \approx 10650\ \text{V} = 10.65\ \text{kV}.
\end{aligned}
$$

> **Final answer:** Phase emf $\approx 6.15\ \text{kV}$; line emf $\approx 10.65\ \text{kV}$.


---

## Question 17
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1B | EM-II ELE 2225 Makeup, 26 June 2024

A 3-phase alternator has 2 slots per pole per phase and a coil span of 5 slot pitch. The flux density wave of alternator consists of a fundamental and a 25% third harmonic. Calculate the percentage increase in the phase voltage due to harmonic. 3

### Answer 17
**Given:** $q = 2$, coil span $= 5$ slots, $B_3 = 0.25 B_1$.

**Solution:**

- Slots per pole: $3 \times 2 = 6$.
- Slot pitch (electrical): $\beta = 180^\circ/6 = 30^\circ$.
- Short-pitch: coil span = 5 slots, so short pitch by $6 - 5 = 1$ slot. Electrical angle of short-pitch: $\alpha = 1 \times 30^\circ = 30^\circ$.

Winding factor for fundamental ($k=1$):
$$
\begin{aligned}
K_{d1} &= \frac{\sin(q\cdot 1\cdot \beta/2)}{q\sin(1\cdot \beta/2)} = \frac{\sin(2\times 15^\circ)}{2\sin 15^\circ} = \frac{0.5}{2\times 0.2588} \approx 0.9659. \\
K_{p1} &= \cos(1\cdot \alpha/2) = \cos 15^\circ \approx 0.9659. \\
K_{w1} &= 0.9659 \times 0.9659 \approx 0.9330.
\end{aligned}
$$

Winding factor for third harmonic ($k=3$):
Effective slot angle $= 3\beta = 90^\circ$; short-pitch angle $= 3\alpha/2 = 45^\circ$:
$$
\begin{aligned}
K_{d3} &= \frac{\sin(2\times 90^\circ/2)}{2\sin(90^\circ/2)} = \frac{\sin 90^\circ}{2\sin 45^\circ} = \frac{1}{2\times 0.7071} \approx 0.7071. \\
K_{p3} &= \cos(3\times 30^\circ/2) = \cos 45^\circ \approx 0.7071. \\
K_{w3} &= 0.7071 \times 0.7071 = 0.500.
\end{aligned}
$$

EMF ratio:
$$
\begin{aligned}
\frac{E_3}{E_1} &= \frac{B_3}{B_1}\cdot \frac{K_{w3}}{K_{w1}} = 0.25 \times \frac{0.500}{0.9330} \approx 0.1340.
\end{aligned}
$$

Resultant phase voltage:
$$
\begin{aligned}
E_{ph} &= \sqrt{E_1^2 + E_3^2} = E_1\sqrt{1 + 0.1340^2} \approx E_1\sqrt{1.01796} \approx 1.00894\,E_1.
\end{aligned}
$$

Percentage increase:
$$
\begin{aligned}
\% \text{ increase} &= \left(\frac{E_{ph} - E_1}{E_1}\right) \times 100\% \approx 0.894\%.
\end{aligned}
$$

> **Final answer:** The phase voltage increases by approximately $0.89\%$ due to the third harmonic.


---

## Question 18
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1C | EM-II ELE 2251 End Sem, 31 May 2023

Determine the distribution factor corresponding to the fifth harmonic component of generated voltage in a three-phase, 50 Hz, AC generator with 54 slots & 6 poles. Also, comment on the effects of the fifth harmonic component in the generated voltage. (03)

### Answer 18
**Given:** $S = 54$, $P = 6$, 3-phase, 50 Hz.

**Solution:**

- Slots per pole: $54/6 = 9$.
- Fundamental slot pitch (elec.): $\beta = 180^\circ/9 = 20^\circ$.
- Slots per pole per phase: $q = \frac{54}{6 \times 3} = 3$.

Distribution factor for $n$th harmonic:
$$
\begin{aligned}
K_{dn} &= \frac{\sin(q\cdot n\beta/2)}{q\sin(n\beta/2)}.
\end{aligned}
$$

For 5th harmonic ($n=5$), effective slot angle $= 5 \times 20^\circ = 100^\circ$:
$$
\begin{aligned}
K_{d5} &= \frac{\sin(3 \times 100^\circ/2)}{3\sin(100^\circ/2)} = \frac{\sin 150^\circ}{3\sin 50^\circ} \\
       &= \frac{0.5}{3 \times 0.7660} \approx 0.2176.
\end{aligned}
$$

**Effects of 5th harmonic:**
- The 5th harmonic is of order $6k-1$, making it a negative-sequence harmonic. It produces a rotating field in opposite direction to the fundamental, leading to pulsating torques and additional rotor heating.
- It distorts the voltage waveform, increasing dielectric stress on insulation.
- In a star-connected machine, 5th harmonic does not cancel in the line voltage; it appears at the terminals and can interfere with other equipment.
- Mitigation is achieved by proper distribution and chording of the winding (e.g., short-pitch to reduce 5th harmonic).

> **Final answer:** $K_{d5} \approx 0.218$; the 5th harmonic is negative-sequence, causes waveform distortion, extra losses, and appears in the line voltage.


---

## Question 19
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 2B | EM-II ELE 2251 End Sem, 31 May 2023

Consider a 3-phase, 8 pole, 50 Hz, star-connected alternator. The average flux in the machine is 40 mWb /pole. The armature has 72 slots with 10 conductors in each slot. Calculate the induced voltage per phase. The coils are short-pitched by 2 slots. (04)

### Answer 19
**Given:** 3-phase, 8-pole, 50 Hz, star-connected alternator. Average flux per pole $\phi = 40\ \text{mWb}=0.04\ \text{Wb}$. Armature 72 slots, 10 conductors/slot. Coils short-pitched by 2 slots.

**Solution:**

1. **Slots per pole** $=72/8=9$; slot angle $\beta = 180^\circ/9 = 20^\circ$ electrical.
2. **Slots per pole per phase** $q = \frac{72}{8\times 3}=3$.
3. **Pitch factor:** Short-pitch by 2 slots $\Rightarrow$ chording angle $\alpha = 2\times 20^\circ=40^\circ$.
   $K_p = \cos(\alpha/2) = \cos 20^\circ \approx 0.9397$.
4. **Distribution factor:**
   $$
   \begin{aligned}
   K_d &= \frac{\sin(q\beta/2)}{q\,\sin(\beta/2)} = \frac{\sin 30^\circ}{3\sin 10^\circ} \\
       &= \frac{0.5}{3\times 0.173648} \approx 0.9598.
   \end{aligned}
   $$
5. **Winding factor:** $K_w = K_d \times K_p = 0.9598\times 0.9397 \approx 0.902$.
6. **Turns per phase:** Total conductors $Z = 72\times 10 = 720$. Conductors/phase $=720/3=240$.
   Turns/phase $T_{\text{ph}} = 240/2 = 120$.
7. **Induced EMF/phase:**
   $$
   \begin{aligned}
   E_{\text{ph}} &= 4.44\,f\,\phi\,T_{\text{ph}}\,K_w \\
                 &= 4.44\times 50\times 0.04\times 120\times 0.902 \approx 961\ \text{V}.
   \end{aligned}
   $$

> **Final answer:** Phase induced voltage $\approx 961$ V.


---

## Question 20
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3A | EM-II ELE 2251 Grade Improvement, 11 August 2021

A 3-phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air-gap flux per pole is 0.26Wb. Calculate the distribution and pitch factors of the winding, number of turns per phase and line value of emf induced. (06)

### Answer 20
**Given:** 3-phase, 50 Hz, 1000 rpm, star alternator. 72 slots, 6 conductors/slot, coil span 10 slots, flux per pole $\phi = 0.26\ \text{Wb}$.

**Solution:**

1. **Number of poles:** $P = \frac{120f}{N} = \frac{120\times 50}{1000} = 6$ poles.
2. **Slots per pole** $=72/6=12$; slot angle $\beta = 180^\circ/12 = 15^\circ$ electrical.
3. **Slots per pole per phase:** $q = 12/3 = 4$.
4. **Distribution factor:**
   $$
   \begin{aligned}
   K_d &= \frac{\sin(q\beta/2)}{q\,\sin(\beta/2)} = \frac{\sin(4\times 7.5^\circ)}{4\,\sin 7.5^\circ} \\
       &= \frac{\sin 30^\circ}{4\,\sin 7.5^\circ} \approx \frac{0.5}{4\times 0.13053} \approx 0.9577.
   \end{aligned}
   $$
5. **Pitch factor:** Full pitch $=12$ slots; short-pitched by $12-10=2$ slots.
   Chording angle $\alpha = 2\times 15^\circ = 30^\circ$.
   $K_p = \cos(\alpha/2) = \cos 15^\circ \approx 0.9659.$
6. **Winding factor:** $K_w = 0.9577\times 0.9659 \approx 0.9250$.
7. **Turns per phase:** Total conductors $Z = 72\times 6 = 432$.
   Conductors/phase $= 432/3 = 144$; $T_{\text{ph}} = 144/2 = 72$ turns.
8. **EMF per phase:**
   $$
   \begin{aligned}
   E_{\text{ph}} &= 4.44\,f\,\phi\,T_{\text{ph}}\,K_w \\
                 &= 4.44\times 50\times 0.26\times 72\times 0.9250 \approx 3844\ \text{V}.
   \end{aligned}
   $$
9. **Line voltage** (star): $E_L = \sqrt{3}\,E_{\text{ph}} = 1.732\times 3844 \approx 6659\ \text{V} \approx 6.66\ \text{kV}.$

> **Final answer:** $K_d \approx 0.958$, $K_p \approx 0.966$; $T_{\text{ph}} = 72$ turns; line EMF $\approx 6.66$ kV.


---

## Question 21
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 4B-ii | EM-II ELE 2251 Grade Improvement, 11 August 2021

The stator of a 3-phase alternator has nine slots per pole and carries a balanced 3-phase, double-layer winding. The coils are short pitched and the coil pitch is seven slots. Find the distribution factor and pitch factor. (part ii)

### Answer 21
**Given:** Stator of 3-phase alternator, 9 slots per pole, double-layer winding, coil pitch 7 slots.

**Solution:**

1. **Slot angle:** $\beta = 180^\circ/9 = 20^\circ$ electrical.
2. **Slots per pole per phase:** $q = 9/3 = 3$.
3. **Distribution factor:**
   $$
   \begin{aligned}
   K_d &= \frac{\sin(q\beta/2)}{q\,\sin(\beta/2)} = \frac{\sin(3\times 10^\circ)}{3\,\sin 10^\circ} \\
       &= \frac{\sin 30^\circ}{3\,\sin 10^\circ} \approx \frac{0.5}{3\times 0.173648} \approx 0.960.
   \end{aligned}
   $$
4. **Pitch factor:** Full pitch $=9$ slots; short-pitched by $9-7=2$ slots.
   Chording angle $\alpha = 2\times 20^\circ = 40^\circ$.
   $K_p = \cos(\alpha/2) = \cos 20^\circ \approx 0.940$.

> **Final answer:** $K_d = 0.960$, $K_p = 0.940$.


---

## Question 22
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 5B | EM-I ELE 205 End Sem, 04 December 2006

A 115 V, 60 Hz, 3 phase star connected, 6 pole induction motor has stator impedance of (0.07+j0.3) Ω and equivalent rotor impedance at standstill of (0.08+j0.3) Ω. Magnetising branch has G₀ = 0.022 and B₀ = 0.158. Using the approximate equivalent circuit, at a slip of 2% determine: (i) Rotor current (ii) Stator current (iii) Power input and input power factor (iv) Power output (v) Torque developed (vi) Efficiency of the motor.

### Answer 22
**Concept:** Approximate equivalent circuit with magnetising branch placed across supply.
**Given:** 115 V (L), 60 Hz, 6-pole, star, $Z_1 = 0.07+j0.3\,\Omega$, $Z_2' = 0.08+j0.3\,\Omega$ (standstill), $G_0=0.022\,S$, $B_0=0.158\,S$, $s=2\%$.

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**Solution:**
$V_{ph} = 115/\sqrt{3} = 66.4\,V$.
Effective rotor resistance: $R_2'/s = 0.08/0.02 = 4\,\Omega$.
Series impedance: $Z_{ser} = (0.07+4) + j(0.3+0.3) = 4.07 + j0.6\,\Omega$, $|Z_{ser}| = 4.114\,\Omega$, $\phi = \arctan(0.6/4.07)=8.4^\circ$.

**(i) Rotor current:**
$I_2' = V_{ph}/Z_{ser} = 66.4 / 4.114\angle8.4^\circ = 16.14\angle{-8.4^\circ}\,A$.

**(ii) Stator current:**
Magnetising admittance $Y_0 = G_0 - jB_0 = 0.022 - j0.158\,S$.
$I_0 = V_{ph}Y_0 = 66.4(0.022 - j0.158) = 1.46 - j10.49\,A$.
$I_2'$ in rectangular: $15.96 - j2.36\,A$.
$I_1 = I_0 + I_2' = 17.42 - j12.85\,A$, $|I_1| = 21.65\,A$.

**(iii) Input power and p.f.:**
Phase angle of $I_1$: $\phi_1 = \arctan(-12.85/17.42) = -36.4^\circ$.
$\cos\phi_1 = 0.805$ lag.
$P_{in} = 3 V_{ph} I_1 \cos\phi_1 = 3 \times 66.4 \times 21.65 \times 0.805 = 3471\,W \approx 3.47\,kW$.

**(iv) Power output:**
Air-gap power: $P_{ag} = 3 I_2'^2 (R_2'/s) = 3 \times (16.14)^2 \times 4 = 3126\,W$.
Rotor copper loss: $P_{rcu} = s P_{ag} = 0.02 \times 3126 = 62.5\,W$.
Mechanical power: $P_{mech} = P_{ag} - P_{rcu} = 3063.5\,W$.
Assuming negligible friction and core losses (accounted in $G_0$), $P_{out} \approx 3.06\,kW$.

**(v) Torque:**
$\omega_s = \frac{2\pi 1200}{60} = 125.66\,rad/s$.
$T = P_{ag}/\omega_s = 3126/125.66 = 24.87\,Nm \approx 24.9\,Nm$.

**(vi) Efficiency:**
$\eta = P_{out}/P_{in} = 3063.5/3471 = 0.883 = 88.3\%$.

> **Final answer:** (i) $I_2' = 16.1\,A$; (ii) $I_1 = 21.7\,A$; (iii) $P_{in}=3.47\,kW$, pf $=0.805$ lag; (iv) $P_{out}\approx3.06\,kW$; (v) $T=24.9\,Nm$; (vi) $\eta = 88.3\%$.


---

## Question 23
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 7A | EM-I ELE 205 End Sem, 04 December 2006

The rotor of a 6-pole, 50 Hz, slip ring induction motor has a resistance of 0.2 Ω/phase and runs at 960 rpm on full load. Calculate the approximate resistance/phase to be included in the rotor circuit such that the speed is reduced to 800 rpm for full load torque.

### Answer 23
**Concept:** For constant load torque, rotor current and $R_2/s$ remain essentially constant.
**Given:** 6-pole, 50 Hz, $R_2=0.2\,\Omega/\text{phase}$, full-load speed 960 rpm, desired speed 800 rpm.

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**Solution:**
$N_s = \dfrac{120 \times 50}{6} = 1000$ rpm.
Slip at full load: $s_1 = \dfrac{1000-960}{1000} = 0.04$.
Slip at 800 rpm: $s_2 = \dfrac{1000-800}{1000} = 0.20$.

For constant torque, $\dfrac{R_2'}{s}$ must stay constant:
$$\frac{R_{2,\text{new}}'}{s_2} = \frac{R_{2,\text{old}}'}{s_1} \quad\Rightarrow\quad R_{2,\text{new}}' = R_2 \times \frac{s_2}{s_1} = 0.2 \times \frac{0.20}{0.04} = 1.0\,\Omega/\text{phase}.$$
Thus external resistance required per phase:
$R_{\text{ext}} = 1.0 - 0.2 = 0.8\,\Omega/\text{phase}$.

> **Final answer:** $0.8\,\Omega$ per phase should be inserted in the rotor circuit.


---

## Question 24
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 4B | EM-I ELE 205 End Sem, 08 December 2007

A 10 kW, 50 Hz, 4 pole, 3 phase induction motor has a rotor leakage impedance of (0.2 + j1.5) Ω per phase at standstill. When delivering full load torque the motor runs at 1440 rpm. Standstill rotor voltage = 60 V per phase. Determine the magnitude of emf injected at the rotor terminals for a speed of a) 1000 rpm b) 1800 rpm. Assume load torque remains constant. (05)

### Answer 24
**Concept:** For constant torque, rotor current remains unchanged. With slip-frequency injection, $E_{\text{inj}} = sE_2 - I_2(R_2 + j s X_{20})$.
**Given:** 4-pole, 50 Hz, $R_2=0.2\,\Omega$, $X_{20}=1.5\,\Omega$ (standstill), full-load speed 1440 rpm, $E_2=60\,V/\text{phase}$ (standstill).

**Solution:**
$N_s = \dfrac{120 \times 50}{4} = 1500$ rpm.
Full-load slip $s_{\text{fl}} = \dfrac{1500-1440}{1500} = 0.04$.

Full-load rotor current (without injection):
$$I_{2,\text{fl}} = \frac{s_{\text{fl}} E_2}{R_2 + j s_{\text{fl}} X_{20}} = \frac{0.04 \times 60}{0.2 + j(0.04\times1.5)} = \frac{2.4}{0.2+j0.06} = 11.49\angle{-16.7^\circ}\,A.$$

**(a) Speed = 1000 rpm:**
$s = \dfrac{1500-1000}{1500} = \dfrac{1}{3} \approx 0.3333$.
$sE_2 = 20\,V$; $Z_{2,s} = 0.2 + j(0.3333\times1.5) = 0.2+j0.5\,\Omega$.
Voltage drop: $I_{2,\text{fl}} \cdot Z_{2,s} = 11.49\angle{-16.7^\circ} \times (0.2+j0.5) = 3.85 + j4.84\,V$ (magnitude $6.19\,V$, angle $51.5^\circ$).
Then $E_{\text{inj}} = 20 - (3.85+j4.84) = 16.15 - j4.84\,V$, magnitude $|E_{\text{inj}}| = \sqrt{16.15^2+4.84^2} \approx 16.9\,V/\text{phase}$.

**(b) Speed = 1800 rpm:**
$s = \dfrac{1500-1800}{1500} = -0.2$.
$sE_2 = -12\,V$; $Z_{2,s} = 0.2 + j(-0.2\times1.5) = 0.2-j0.3\,\Omega$.
Voltage drop: $I_{2,\text{fl}} \cdot Z_{2,s} = 11.49\angle{-16.7^\circ} \times (0.2-j0.3) = 1.21 - j3.96\,V$.
$E_{\text{inj}} = -12 - (1.21 - j3.96) = -13.21 + j3.96\,V$, magnitude $|E_{\text{inj}}| = \sqrt{(-13.21)^2+3.96^2} \approx 13.8\,V/\text{phase}$.

> **Final answer:** (a) $16.9\,V/\text{phase}$; (b) $13.8\,V/\text{phase}$.


---

## Question 25
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 3A | EM-I ELE 205 End Sem, 26 November 2012

Explain the principle of rotor emf injection method of controlling speed of slip ring induction motor (03)

### Answer 25
**Concept:** In a slip-ring induction motor, the rotor windings are accessible via slip rings. The rotor emf injection method applies an external voltage in series with the rotor circuit to control the net rotor emf, thereby varying speed.

**Principle:** At slip $s$, the standstill rotor emf $E_2$ induces $sE_2$ at slip frequency $sf$. The rotor current per phase is
$$
I_{2} = \frac{sE_{2}}{Z_{2}} = \frac{sE_{2}}{\sqrt{R_{2}^{2} + (sX_{2})^{2}}}.
$$
If an external voltage $E_{\text{inj}}$ of same slip frequency is injected in series with the rotor winding, the net emf becomes $(sE_{2} - E_{\text{inj}})$ (subtraction for opposition, addition for aiding). The rotor current becomes
$$
I_{2} = \frac{sE_{2} - E_{\text{inj}}}{Z_{2}}.
$$

**Effect on speed:** For a given load torque, the electromagnetic torque $T \propto I_{2}^{2}/s$ remains nearly constant. Changing $E_{\text{inj}}$ alters $I_{2}$; to restore torque, slip adjusts automatically.

- **Opposing injection** ($E_{\text{inj}}$ opposes $sE_{2}$): Net emf decreases → $I_{2}$ falls → motor slows down (slip $s$ increases) until $sE_{2}$ rises enough to re-establish the required current.
- **Aiding injection** ($E_{\text{inj}}$ aids $sE_{2}$): Net emf increases → $I_{2}$ rises → motor accelerates (slip $s$ decreases) until equilibrium is restored.

**Speed range:** By controlling magnitude and phase of $E_{\text{inj}}$,
- *Sub-synchronous speeds* (below synchronous): $E_{\text{inj}}$ opposes $sE_{2}$.
- *Super-synchronous speeds* (above synchronous): $E_{\text{inj}}$ aids $sE_{2}$.

![Per-phase equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**Practical note:** The injected voltage must be of slip frequency, usually generated by power-electronic converters (e.g., Kramer, Scherbius systems). These schemes allow smooth, wide-range speed control and recovery of slip power, giving high overall efficiency.

> **Final answer:** Speed control by rotor emf injection relies on altering the net rotor voltage. Opposing injection lowers speed (higher slip); aiding injection raises speed (lower slip). The method enables sub- and super-synchronous operation and, with slip-power recovery, achieves high efficiency.


---

## Question 26
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 5A | EM-I ELE 205 Makeup, 05 January 2015

A 3 phase, 440 V, 50 Hz, 6 pole star connected induction motor has the following parameters: Stator impedance = (0.3 + j 0.433) Ω per phase. Rotor impedance = (0.08 + j 0.16) Ω per phase at stand still condition. Stator to rotor turns ratio = 1.75. Shunt resistance representing rotational loss = 54 Ω per phase. Magnetising reactance = j 8.3 Ω per phase. Use approximate equivalent circuit to determine the following when it draws a current of 65 A, 0.8 pf lagging at rated voltage: (i) Exciting branch current (ii) Equivalent rotor current (iii) Rotational loss (sum of core and mechanical loss) (iv) stator and rotor copper loss (v) shaft output (vi) rotor speed 6

### Answer 26
**Given:** 3-phase, 440 V, 50 Hz, 6-pole, star-connected. Per-phase data at 50 Hz:

- Stator impedance $(R_1 + jX_1) = 0.3 + j0.433\; \Omega$
- Rotor standstill impedance $(R_2 + jX_2) = 0.08 + j0.16\; \Omega$
- Turns ratio $a = 1.75$
- Shunt resistance (rotational loss) $R_c = 54\; \Omega$
- Magnetising reactance $X_m = j8.3\; \Omega$

Motor draws $I_1 = 65\angle -36.87^\circ\; \text{A}$ (0.8 pf lag) at rated voltage. Phase voltage
$$
V_{\text{ph}} = \frac{440}{\sqrt{3}} = 254.0\; \text{V}.
$$

Refer rotor parameters to stator:
$$
R_2' = a^2 R_2 = 1.75^2 \times 0.08 = 0.245\; \Omega,\quad
X_2' = a^2 X_2 = 1.75^2 \times 0.16 = 0.49\; \Omega.
$$

**Air-gap voltage** (drop across stator impedance):
$$
\begin{aligned}
E_g &= V_{\text{ph}} - I_1 Z_1 \\
&= 254 - (52.0 - j39.0)(0.3 + j0.433) \\
&= 221.51 - j10.82\; \text{V} \quad \bigl(|E_g| = 221.8\; \text{V} \bigr).
\end{aligned}
$$

![Induction motor per-phase equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**(i) Exciting branch current**
$$
\begin{aligned}
I_c &= \frac{E_g}{R_c} = \frac{221.8\angle -2.8^\circ}{54} = 4.11\angle -2.8^\circ \; \text{A} = 4.10 - j0.20\; \text{A},\\
I_m &= \frac{E_g}{jX_m} = \frac{221.8\angle -2.8^\circ}{8.3\angle 90^\circ} = 26.72\angle -92.8^\circ \; \text{A} = -1.30 - j26.69\; \text{A},\\
I_0 &= I_c + I_m = 2.80 - j26.89\; \text{A},\quad |I_0| \approx 27.0\; \text{A}.
\end{aligned}
$$

**(ii) Rotor current referred to stator**
$$
I_2' = I_1 - I_0 = (52.0 - j39.0) - (2.80 - j26.89) = 49.20 - j12.11\; \text{A},\quad |I_2'| \approx 50.7\; \text{A}.
$$

**(iii) Rotational loss**
$$
P_{\text{rot}} = 3\,\frac{E_g^2}{R_c} = 3 \times \frac{221.8^2}{54} \approx 2732\; \text{W} = 2.73\; \text{kW}.
$$

**(iv) Copper losses**
- Stator: $P_{\text{scu}} = 3 I_1^2 R_1 = 3 \times 65^2 \times 0.3 = 3802.5\; \text{W} \approx 3.80\; \text{kW}.$
- To find rotor copper loss, first determine slip $s$. From $E_g = I_2'\bigl(\frac{R_2'}{s} + jX_2'\bigr)$,
$$
\frac{R_2'}{s} = \operatorname{Re}\!\left(\frac{E_g}{I_2'}\right).
$$
Compute:
$$
\frac{E_g}{I_2'} = \frac{221.51 - j10.82}{49.20 - j12.11} = 4.297 + j0.838\quad\Rightarrow\quad \frac{R_2'}{s} = 4.297\; \Omega.
$$
Hence
$$
s = \frac{R_2'}{4.297} = \frac{0.245}{4.297} = 0.0570.
$$
Air-gap power:
$$
P_{\text{ag}} = 3 I_2'^{\,2}\,\frac{R_2'}{s} = 3 \times (50.7)^2 \times 4.297 \approx 33.1\; \text{kW}.
$$
Rotor copper loss:
$$
P_{\text{rcu}} = s P_{\text{ag}} = 0.057 \times 33.1 \approx 1.89\; \text{kW}.
$$

**(v) Shaft output**
Mechanical power developed:
$$
P_{\text{mech}} = P_{\text{ag}} - P_{\text{rcu}} \approx 33.1 - 1.89 = 31.2\; \text{kW}.
$$
Shaft output (after rotational losses):
$$
P_{\text{out}} = P_{\text{mech}} - P_{\text{rot}} = 31.2 - 2.73 = 28.5\; \text{kW}.
$$

**(vi) Rotor speed**
Synchronous speed:
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000\; \text{rpm}.
$$
Rotor speed:
$$
N = N_s(1 - s) = 1000 \times (1 - 0.0570) = 943\; \text{rpm}.
$$

> **Final answer:**
> (i) $I_0 \approx 27.0\; \text{A}$ ($2.80 - j26.9$ A).
> (ii) $I_2' \approx 50.7\; \text{A}$.
> (iii) Rotational loss $= 2.73\; \text{kW}$.
> (iv) Stator Cu loss $= 3.80\; \text{kW}$, rotor Cu loss $= 1.89\; \text{kW}$.
> (v) Shaft output $= 28.5\; \text{kW}$.
> (vi) Rotor speed $= 943\; \text{rpm}$.


---

## Question 27
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 4A | EM-I ELE 205 Makeup, 05 January 2016

A 3 phase, 50 Hz, 12 pole, 420 V Δ connected induction motor has the 6M following equivalent circuit parameters: Stator impedance = (2.95 + j 6.82) Ω per phase; Stand still rotor impedance referred to stator = (2.08 + j 4.11) Ω per phase. When running at 4 % slip, determine: a) Electrical input to the motor b) Stator and Rotor copper losses c) Useful torque if rotational losses are 750 W. Neglect exciting branch admittance.

### Answer 27
**Given:** 3-phase, 50 Hz, 12-pole, 420 V (Δ-connected). Per-phase parameters (stator and rotor referred to stator):
$$
R_1 = 2.95\;\Omega,\; X_1 = 6.82\;\Omega;\quad
R_2' = 2.08\;\Omega,\; X_2' = 4.11\;\Omega \;\text{(standstill)}.
$$
Slip $s = 4\% = 0.04$. Rotational losses $P_{\text{rot}} = 750\; \text{W}$. Exciting branch neglected.

**Synchronous speed:**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{12} = 500\; \text{rpm}.
$$
Rotor speed:
$$
N = N_s(1-s) = 500 \times 0.96 = 480\; \text{rpm},\quad
\omega_m = \frac{2\pi N}{60} = \frac{2\pi \times 480}{60} = 50.27\; \text{rad/s}.
$$

**Per-phase equivalent circuit (series):**
Rotor impedance at slip $s$:
$$
Z_{2,\text{slip}}' = \frac{R_2'}{s} + jX_2' = \frac{2.08}{0.04} + j4.11 = 52 + j4.11\;\Omega.
$$
Total series impedance:
$$
Z_{\text{tot}} = Z_1 + Z_{2,\text{slip}}' = (2.95 + 52) + j(6.82 + 4.11) = 54.95 + j10.93\;\Omega,\quad |Z_{\text{tot}}| = \sqrt{54.95^2 + 10.93^2} \approx 56.03\;\Omega.
$$

For Δ-connection, phase voltage equals line voltage: $V_{\text{ph}} = 420\; \text{V}$.
Stator phase current:
$$
I = \frac{V_{\text{ph}}}{|Z_{\text{tot}}|} = \frac{420}{56.03} \approx 7.496\; \text{A}.
$$
Power factor:
$$
\cos\phi = \frac{R_{\text{tot}}}{|Z_{\text{tot}}|} = \frac{54.95}{56.03} \approx 0.981\; \text{lagging}.
$$

**(a) Electrical input power**
$$
P_{\text{in}} = 3\, V_{\text{ph}} I \cos\phi = 3 \times 420 \times 7.496 \times 0.981 \approx 9264\; \text{W} \approx 9.26\; \text{kW}.
$$

**(b) Copper losses**
Stator copper loss:
$$
P_{\text{scu}} = 3 I^2 R_1 = 3 \times 7.496^2 \times 2.95 \approx 497\; \text{W}.
$$
Air-gap power:
$$
P_{\text{ag}} = 3 I^2 \frac{R_2'}{s} = 3 \times 7.496^2 \times 52 \approx 8766\; \text{W}.
$$
Rotor copper loss:
$$
P_{\text{rcu}} = s\,P_{\text{ag}} = 0.04 \times 8766 \approx 351\; \text{W}.
$$

**(c) Useful shaft torque**
Mechanical power developed:
$$
P_{\text{mech}} = P_{\text{ag}} - P_{\text{rcu}} = 8766 - 351 = 8415\; \text{W}\quad (\text{or } (1-s)P_{\text{ag}}).
$$
Shaft output:
$$
P_{\text{out}} = P_{\text{mech}} - P_{\text{rot}} = 8415 - 750 = 7665\; \text{W}.
$$
Useful torque:
$$
T_{\text{shaft}} = \frac{P_{\text{out}}}{\omega_m} = \frac{7665}{50.27} \approx 152.5\; \text{N}\cdot\text{m}.
$$

> **Final answer:**
> (a) Electrical input $= 9.26\; \text{kW}$.
> (b) Stator Cu loss $= 497\; \text{W}$, rotor Cu loss $= 351\; \text{W}$.
> (c) Useful torque $= 152.5\; \text{N}\cdot\text{m}$.


---

## Question 28
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 5B | EM-I ELE 205 Makeup, 08 January 2008

For a 6 pole 3 phase Induction motor has mechanical losses total 2 HP at a speed of 950 RPM on 550 V, 50 Hz mains. The power factor is 0.88. Calculate for this load (i) The rotor copper loss (ii) The total input if the stator losses are 2000 W (iii) The efficiency (iv) The line current (04)

### Answer 28
Given:
- Number of poles, $P = 6$
- Frequency, $f = 50\ \text{Hz}$
- Supply voltage (line), $V_L = 550\ \text{V}$
- Full-load speed, $N_r = 950\ \text{rpm}$
- Power factor, $\cos\phi = 0.88$
- Stator losses, $P_{\text{stator loss}} = 2000\ \text{W}$
- Mechanical losses, $P_{\text{mech loss}} = 2\ \text{HP} = 2 \times 746 = 1492\ \text{W}$

**Step 1: Synchronous speed and slip**

$$
\begin{aligned}
N_s &= \frac{120f}{P} = \frac{120 \times 50}{6} = 1000\ \text{rpm},\\
s &= \frac{N_s - N_r}{N_s} = \frac{1000 - 950}{1000} = 0.05.
\end{aligned}
$$

**Step 2: Power-flow relations**

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

From the equivalent circuit we have:

$$
\begin{aligned}
P_{\text{ag}} &= P_{\text{in}} - P_{\text{stator loss}} \quad (\text{air-gap power}),\\
P_{\text{rcu}} &= s P_{\text{ag}} \quad (\text{rotor copper loss}),\\
P_{\text{mech}} &= P_{\text{ag}} - P_{\text{rcu}} = (1-s) P_{\text{ag}} \quad (\text{gross mechanical power}),\\
P_{\text{out}} &= P_{\text{mech}} - P_{\text{mech loss}} \quad (\text{shaft output}).
\end{aligned}
$$

Eliminating $P_{\text{ag}}$ gives the useful relations

$$
P_{\text{rcu}} = \frac{s}{1-s}\,(P_{\text{out}} + P_{\text{mech loss}}),
\qquad
P_{\text{in}} = \frac{P_{\text{rcu}}}{s} + P_{\text{stator loss}}.
$$

**Step 3: Why a numerical answer is not possible**

The shaft output power $P_{\text{out}}$ is not given. Without it the equations contain two unknowns and cannot be solved numerically.

**Step 4: Expressions for the required quantities**

Let $P_{\text{out}}$ be the (unknown) shaft power in watts. Then

$$
\begin{aligned}
\text{(i)}\quad P_{\text{rcu}} &= \frac{0.05}{0.95}\,(P_{\text{out}} + 1492) = \frac{1}{19}(P_{\text{out}} + 1492),\\
\text{(ii)}\quad P_{\text{in}} &= \frac{P_{\text{rcu}}}{0.05} + 2000 = 20 P_{\text{rcu}} + 2000,\\
\text{(iii)}\quad \eta &= \frac{P_{\text{out}}}{P_{\text{in}}}, \\
\text{(iv)}\quad I_L &= \frac{P_{\text{in}}}{\sqrt{3}\,V_L\,\cos\phi} = \frac{P_{\text{in}}}{\sqrt{3}\times 550\times 0.88}.
\end{aligned}
$$

Once $P_{\text{out}}$ is specified, all four values follow directly.

> **Final answer:** The problem does not provide the shaft output power; therefore the rotor copper loss, total input, efficiency, and line current cannot be evaluated numerically. They are given in terms of the unknown output $P_{\text{out}}$ by the expressions above. For illustration, if $P_{\text{out}} = 10\ \text{kW}$, then $P_{\text{rcu}} \approx 606\ \text{W}$, $P_{\text{in}} \approx 14.12\ \text{kW}$, $\eta \approx 70.8\%$, and $I_L \approx 16.9\ \text{A}$.


---

## Question 29
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 3B | EM-I ELE 2103 End Sem, 27 November 2018

A 3 phase, 400 V, 6-pole, 50 Hz induction motor develops mechanical power of 20 kW at 985 rpm. The stator losses are equal to 1800 W. Neglect the mechanical losses. Calculate: i) The rotor copper loss & rotor frequency ii) The total input power. (03)

### Answer 29
Given:
- Line voltage $V_L = 400\ \text{V}$, frequency $f = 50\ \text{Hz}$,
- Number of poles $P = 6$,
- Mechanical power developed $P_{\text{mech}} = 20\ \text{kW}$,
- Speed $N_r = 985\ \text{rpm}$,
- Stator losses $P_{\text{stator loss}} = 1800\ \text{W}$,
- Mechanical losses neglected.

**Synchronous speed and slip**

$$
N_s = \frac{120f}{P} = \frac{120\times 50}{6} = 1000\ \text{rpm},\qquad
s = \frac{N_s-N_r}{N_s} = \frac{1000-985}{1000} = 0.015\ (1.5\%).
$$

**Rotor copper loss and rotor frequency**

The induction motor power balance gives

$$
P_{\text{mech}} = (1-s)P_{\text{ag}},\qquad P_{\text{rcu}} = sP_{\text{ag}}.
$$

Hence

$$
P_{\text{rcu}} = \frac{s}{1-s}\,P_{\text{mech}}
= \frac{0.015}{0.985}\times 20\,000 \approx 304.6\ \text{W}.
$$

Rotor frequency: $f_r = sf = 0.015\times 50 = 0.75\ \text{Hz}$.

**Total input power**

$$
\begin{aligned}
P_{\text{in}} &= P_{\text{mech}} + P_{\text{rcu}} + P_{\text{stator loss}} \\
             &= 20\,000 + 304.6 + 1800 = 22\,104.6\ \text{W} \approx 22.1\ \text{kW}.
\end{aligned}
$$

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final answer:** (i) Rotor Cu loss $\approx 305\ \text{W}$, rotor frequency $= 0.75\ \text{Hz}$; (ii) total input power $\approx 22.1\ \text{kW}$.


---

## Question 30
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 2B | EM-I ELE 2123 End Sem, 05 December 2023

A 3-phase, 400 V, 50 Hz, 4 pole induction motor is rated for an output of 15 4 HP at 1,440 rpm. When supplying rated load, its stator losses are 800 W and 5 N-m of torque meets friction and windage losses. Determine the following for this loading: a) Slip b) Rotor copper loss c) Input to the motor d) Efficiency

### Answer 30
**Given:**
- Supply: 3-phase, $400\ \text{V}$, $50\ \text{Hz}$,
- Poles: $4$,
- Rated output: $15\ \text{HP} = 15 \times 746 = 11\,190\ \text{W}$,
- Speed at rated load: $N_r = 1440\ \text{rpm}$,
- Stator losses: $P_{\text{stator loss}} = 800\ \text{W}$,
- Friction & windage torque: $T_{\text{fw}} = 5\ \text{N}\cdot\text{m}$.

**Synchronous speed and slip:**

$$
N_s = \frac{120f}{P} = \frac{120\times 50}{4} = 1500\ \text{rpm},
\qquad
s = \frac{1500 - 1440}{1500} = 0.04\ (4\%).
$$

**Rotor copper loss:**

First find the mechanical loss caused by friction and windage.

Angular speed: $\omega_r = \dfrac{2\pi N_r}{60} = \dfrac{2\pi \times 1440}{60} \approx 150.8\ \text{rad/s}$.

Friction power: $P_{\text{fw}} = T_{\text{fw}}\,\omega_r = 5 \times 150.8 = 754\ \text{W}$.

The gross mechanical power developed by the rotor is

$$
P_{\text{mech}} = P_{\text{out}} + P_{\text{fw}} = 11\,190 + 754 = 11\,944\ \text{W}.
$$

For an induction motor, $P_{\text{rcu}} : P_{\text{mech}} = s : (1-s)$, therefore

$$
P_{\text{rcu}} = \frac{s}{1-s}\,P_{\text{mech}} = \frac{0.04}{0.96}\times 11\,944 \approx 497.7\ \text{W}.
$$

**Input power:**

Air-gap power: $P_{\text{ag}} = \dfrac{P_{\text{mech}}}{1-s} = \dfrac{11\,944}{0.96} \approx 12\,441.7\ \text{W}$.

Total input: $P_{\text{in}} = P_{\text{ag}} + P_{\text{stator loss}} = 12\,441.7 + 800 = 13\,241.7\ \text{W} \approx 13.24\ \text{kW}$.

**Efficiency:**

$$
\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \times 100\% = \frac{11\,190}{13\,241.7} \times 100\% \approx 84.5\%.
$$

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final answer:** (a) Slip $= 4\%$; (b) Rotor Cu loss $\approx 498\ \text{W}$; (c) Input power $\approx 13.24\ \text{kW}$; (d) Efficiency $\approx 84.5\%$.


---

## Question 31
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 2C | EM-I ELE 2123 End Sem, 25 November 2024

A 3-phase, 400 V, 50 Hz, 4-pole, star connected induction motor has per-phase 3 stator impedance, Z₁ = (0.07+j0.3)Ω and per-phase rotor impedance referred to stator side, Z₂’ = (0.08+j0.3) Ω. The per phase magnetizing reactance is 10 Ω and the resistance representing core loss is 50 Ω. The slip is 4%. Using approximate equivalent circuit approach, solve for: a) Stator current and power factor b) Torque developed and c) Gross efficiency

### Answer 31
**Given:**
3-phase, 400 V (line), 50 Hz, 4-pole, star-connected.
$Z_1 = (0.07 + j\,0.3)\,\Omega$ (stator per phase)
$Z_2' = (0.08 + j\,0.3)\,\Omega$ (rotor per phase, referred to stator)
Magnetising reactance $X_m = 10\,\Omega$, core-loss resistance $R_c = 50\,\Omega$.
Slip $s = 4\% = 0.04$.

**Phase voltage:**
$$
V_{\text{ph}} = \frac{400}{\sqrt{3}} = 230.94\ \text{V}.
$$

**Synchronous speed:**
$$
N_s = \frac{120 \times 50}{4} = 1500\ \text{rpm},\quad
\omega_s = \frac{2\pi \times 1500}{60} = 157.08\ \text{rad/s}.
$$

![Approximate equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

---

### Approximate equivalent circuit analysis

The magnetising branch $(R_c,\,jX_m)$ is placed directly across the supply. The load current $I_2'$ flows through the series combination of $Z_1$ and $Z_2'/s$.

---

#### a)  Stator current and power factor

**Rotor-branch impedance at slip $s$**

$$
\frac{Z_2'}{s} = \frac{0.08}{0.04} + j\,0.3 = 2 + j\,0.3\ \Omega .
$$

**Total series impedance**

$$
\begin{aligned}
Z_{\text{ser}} &= Z_1 + \frac{Z_2'}{s} = (0.07+2) + j\,(0.3+0.3) \\
             &= 2.07 + j\,0.6\ \Omega .
\end{aligned}
$$
$$
|Z_{\text{ser}}| = \sqrt{2.07^2 + 0.6^2} = 2.156\ \Omega,\quad
\phi_{\text{ser}} = \arctan\!\left(\frac{0.6}{2.07}\right) \approx 16.2^\circ .
$$

**Load component of stator current**

$$
I_2' = \frac{V_{\text{ph}}}{Z_{\text{ser}}} = \frac{230.94\angle 0^\circ}{2.156\angle 16.2^\circ}
      = 107.1\angle -16.2^\circ\ \text{A}\ \ ( \approx 102.9 - j\,29.8\ \text{A}).
$$

**No-load (exciting) current**

The admittance of the magnetising branch is

$$
Y_0 = \frac{1}{R_c} - j\frac{1}{X_m} = 0.02 - j\,0.1\ \text{S},
$$
so
$$
I_0 = V_{\text{ph}}\,Y_0 = 230.94 \times (0.02 - j\,0.1) = 4.62 - j\,23.09\ \text{A}.
$$

**Stator current (phasor sum)**

$$
\begin{aligned}
I_1 &= I_0 + I_2' \\
    &= (4.62 + 102.9) + j\,(-23.09 - 29.8) \\
    &= 107.52 - j\,52.89\ \text{A}.
\end{aligned}
$$
$$
|I_1| = \sqrt{107.52^2 + 52.89^2} \approx 119.8\ \text{A}.
$$

The line current equals the phase current because the motor is star-connected.

**Power factor**

$$
\cos\phi = \frac{\Re(I_1)}{|I_1|} = \frac{107.52}{119.8} \approx 0.897\ \text{(lagging)} .
$$

---

#### b)  Developed torque

Air-gap power:

$$
P_{\text{ag}} = 3\,|I_2'|^2\!\left(\frac{R_2'}{s}\right)
            = 3 \times (107.1)^2 \times 2
            = 68.82\ \text{kW}.
$$

Electromagnetic torque:

$$
T_{\text{dev}} = \frac{P_{\text{ag}}}{\omega_s}
               = \frac{68\,820}{157.08}
               \approx 438\ \text{N}\cdot\text{m}.
$$

---

#### c)  Gross efficiency

Mechanical power developed:

$$
P_{\text{mech}} = P_{\text{ag}}(1-s) = 68.82 \times 0.96
                = 66.07\ \text{kW}.
$$

Input electrical power:

$$
\begin{aligned}
P_{\text{in}} &= 3\,V_{\text{ph}}\,I_1\cos\phi \\
              &= 3 \times 230.94 \times 119.8 \times 0.897 \\
              &\approx 74.5\ \text{kW}.
\end{aligned}
$$

(Using $\sqrt{3}\,V_L\,I_L\cos\phi$ gives the same value.)

Gross efficiency:

$$
\eta_{\text{gross}} = \frac{P_{\text{mech}}}{P_{\text{in}}}
                     = \frac{66.07}{74.5}
                     \approx 0.888 = 88.8\% .
$$

---

> **Final answer:**
> (a) $I_1 \approx 119.8\ \text{A}$, $\cos\phi \approx 0.897$ lag.
> (b) $T_{\text{dev}} \approx 438\ \text{N}\cdot\text{m}$.
> (c) $\eta_{\text{gross}} \approx 88.8\%$.


---

## Question 32
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 4B | EM-I ELE 2154 Makeup/GI, 28 July 2021

Consider a 415V, 4pole, 50Hz induction motor operating at 4% slip. The shaft power output is 1.2 kW. The machine has stator losses of 50W and rotational losses of 70W. Draw the power flow diagram with power stages. (05)

### Answer 32
**Given:**
415 V, 4-pole, 50 Hz induction motor.
Slip $s = 4\% = 0.04$; shaft power output $P_{\text{out}} = 1.2\ \text{kW} = 1200\ \text{W}$.
Stator losses $P_{\text{scu}} = 50\ \text{W}$ (stator copper loss).
Rotational losses $P_{\text{rot}} = 70\ \text{W}$ (friction, windage, core loss combined).

**Synchronous speed:**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500\ \text{rpm}.
$$
Rotor speed $N = N_s(1-s) = 1440\ \text{rpm}$ (not needed for the power-flow calculation).

---

### Power-flow diagram and power stages

The power flow in an induction motor proceeds through the following stages:

$$
P_{\text{in}} \;\xrightarrow{\text{stator loss}}\; P_{\text{ag}} \;\xrightarrow{\text{rotor Cu loss}}\; P_{\text{mech}} \;\xrightarrow{\text{rotational losses}}\; P_{\text{out}}
$$

**Diagram (textual representation with numerical values):**

```
P_in (1.373 kW)  →  [Stator Cu loss 50 W]  →  P_ag (1.323 kW)  →  [Rotor Cu loss 52.9 W]  →  P_mech (1.270 kW)  →  [Rotational loss 70 W]  →  P_out (1.200 kW)
```

---

### Calculation of individual powers

**Mechanical power developed:**
$$
P_{\text{mech}} = P_{\text{out}} + P_{\text{rot}} = 1200 + 70 = 1270\ \text{W}.
$$

**Air-gap power:**
For an induction motor, $P_{\text{mech}} = (1-s)P_{\text{ag}}$, therefore
$$
P_{\text{ag}} = \frac{P_{\text{mech}}}{1-s} = \frac{1270}{0.96} = 1322.92\ \text{W} \approx 1.323\ \text{kW}.
$$

**Rotor copper loss:**
$$
P_{\text{rcu}} = s \cdot P_{\text{ag}} = 0.04 \times 1322.92 = 52.92\ \text{W} \approx 52.9\ \text{W}.
$$

**Input power:**
$$
P_{\text{in}} = P_{\text{ag}} + P_{\text{scu}} = 1322.92 + 50 = 1372.92\ \text{W} \approx 1.373\ \text{kW}.
$$

**Gross efficiency:**
$$
\eta = \frac{P_{\text{out}}}{P_{\text{in}}} = \frac{1200}{1372.92} \times 100\% \approx 87.4\% .
$$

---

> **Final answer:**
> $P_{\text{in}} \approx 1.373\ \text{kW}$,
> $P_{\text{ag}} \approx 1.323\ \text{kW}$,
> $P_{\text{mech}} \approx 1.270\ \text{kW}$,
> $P_{\text{out}} = 1.2\ \text{kW}$,
> efficiency $\eta \approx 87.4\%$.
> (The complete power-flow diagram is shown above.)


---

## Question 33
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 6A | EM-I ELE 2154 Makeup/GI, 28 July 2021

A 3-phase, 50 Hz, 36 kW, 4 pole induction motor has a full load efficiency of 82 %. The friction & windage losses are one-fourth of no load losses and rotor copper losses equal the iron loss at full load. Determine (a) Total Losses (b) Stator Core Loss (c) Rotor Copper Loss (d) Friction & Windage Loss (05)

### Answer 33
**Given:**
3-phase, 50 Hz, 4-pole, 36 kW induction motor. Full-load efficiency $\eta = 82\% = 0.82$.
Friction & windage loss $P_{\text{fw}}$ is one-fourth of the no-load losses.
At full load, rotor copper loss $P_{\text{rcu}}$ equals the stator core (iron) loss $P_{\text{Fe}}$.

---

### (a) Total losses

Input power at full load:
$$
P_{\text{in}} = \frac{P_{\text{out}}}{\eta} = \frac{36}{0.82} \approx 43.902\ \text{kW}.
$$

Total losses:
$$
P_{\text{loss}} = P_{\text{in}} - P_{\text{out}} = 43.902 - 36 = 7.902\ \text{kW} \approx 7.90\ \text{kW}.
$$

---

### Relating the losses

At no load the slip is nearly zero, so rotor copper loss is negligible. The stator copper loss is also very small and is neglected here. Thus the no-load losses consist essentially of
$$
P_{\text{no-load}} = P_{\text{Fe}} + P_{\text{fw}}.
$$

From the problem, $P_{\text{fw}} = \frac{1}{4} P_{\text{no-load}}$, hence
$$
P_{\text{fw}} = \frac{1}{4}(P_{\text{Fe}} + P_{\text{fw}}) \;\Longrightarrow\; 4P_{\text{fw}} = P_{\text{Fe}} + P_{\text{fw}} \;\Longrightarrow\; P_{\text{Fe}} = 3P_{\text{fw}}.
$$

At full load, $P_{\text{rcu}} = P_{\text{Fe}}$ (given). Assuming the total losses are the sum of these three components (stator copper loss not specified), we have
$$
P_{\text{loss}} = P_{\text{Fe}} + P_{\text{rcu}} + P_{\text{fw}}.
$$

Substitute $P_{\text{Fe}} = P_{\text{rcu}} = 3P_{\text{fw}}$:
$$
P_{\text{loss}} = 3P_{\text{fw}} + 3P_{\text{fw}} + P_{\text{fw}} = 7P_{\text{fw}}.
$$

Thus

$$
P_{\text{fw}} = \frac{P_{\text{loss}}}{7} = \frac{7.902}{7} \approx 1.129\ \text{kW} \;\approx\; 1.13\ \text{kW}.
$$

Then

$$
P_{\text{Fe}} = 3 \times 1.129 \approx 3.387\ \text{kW} \;\approx\; 3.39\ \text{kW},\qquad
P_{\text{rcu}} = P_{\text{Fe}} = 3.39\ \text{kW}.
$$

---

> **Final answer:**
> (a) Total losses $= 7.90\ \text{kW}$.
> (b) Stator core loss $= 3.39\ \text{kW}$.
> (c) Rotor copper loss $= 3.39\ \text{kW}$.
> (d) Friction & windage loss $= 1.13\ \text{kW}$.
> (Note: stator copper loss is not included in the given loss breakdown; the above partition assumes it is negligible.)

## Question 34
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 2B | EM-I ELE 2154 Online End Sem, 27 January 2022

A three-phase, 400V, 4-pole, 50 Hz, three-phase induction motor provides shaft power of 1.2kW. Considering 2.5% of shaft power as friction and windage losses, determine the rotor copper losses, power supplied to the rotor circuit, gross torque developed by the motor, and efficiency of the rotor when the rotor is running at a speed of 1420rpm. (03)

### Answer 34
**Synchronous speed and slip**

$$
N_s = \frac{120f}{P} = \frac{120\times 50}{4} = 1500\,\text{rpm}.
$$

Slip at 1420\,rpm:

$$
s = \frac{N_s-N}{N_s} = \frac{1500-1420}{1500} = 0.05333\;(5.33\%).
$$

**Power flow**

Shaft output power $P_{\text{out}} = 1200\,\text{W}$.
Friction & windage losses $P_{\text{FW}} = 0.025 \times 1200 = 30\,\text{W}$.
Gross mechanical power developed by the rotor:

$$
P_{\text{mech}} = P_{\text{out}} + P_{\text{FW}} = 1230\,\text{W}.
$$

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

From the induction motor power flow (see equivalent circuit), the air-gap power $P_{\text{ag}}$ is split into rotor copper loss $P_{\text{cu2}}$ and gross mechanical power:

$$
\begin{aligned}
P_{\text{mech}} &= (1-s)P_{\text{ag}}, \\
P_{\text{cu2}} &= sP_{\text{ag}}.
\end{aligned}
$$

Hence,

$$
P_{\text{ag}} = \frac{P_{\text{mech}}}{1-s} = \frac{1230}{0.94667} \approx 1299.3\,\text{W},
\qquad
P_{\text{cu2}} = sP_{\text{ag}} = 0.05333 \times 1299.3 \approx 69.3\,\text{W}.
$$

**Torque and rotor efficiency**

Synchronous angular speed:

$$
\omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 1500}{60} = 157.08\,\text{rad/s}.
$$

Gross electromagnetic torque:

$$
T = \frac{P_{\text{ag}}}{\omega_s} = \frac{1299.3}{157.08} \approx 8.27\,\text{N}\cdot\text{m}.
$$

Rotor efficiency:

$$
\eta_{\text{rotor}} = \frac{P_{\text{mech}}}{P_{\text{ag}}} = 1 - s = 0.9467 = 94.67\%.
$$

> **Final answer:** Rotor copper loss $P_{\text{cu2}} = 69.3\,\text{W}$; power supplied to rotor $P_{\text{ag}} \approx 1299\,\text{W}$; gross torque $T \approx 8.27\,\text{N}\cdot\text{m}$; rotor efficiency $94.67\%$.


---

## Question 35
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 4A | EM-I ELE 205 End Sem, 03 December 2014

A squirrel cage induction motor, when started by means of a star-delta starter draws 200 % of full load current and develops 44 % of full load torque at starting. If an auto-transformer with 75 % tapping is used, determine: (i) Full load slip (ii) Ratio of starting torque to full load torque (iii) Starting motor current and starting line current as % of full load current. 4

### Answer 35
**Given:**
Star-delta starter draws $200\%$ full-load line current and develops $44\%$ full-load torque at starting.
Auto-transformer tapping $k = 0.75$.

**1. Full-voltage (DOL) starting quantities**
In star, phase voltage $= V_L/\sqrt3$, hence line current and torque are $1/3$ of the delta (DOL) values.

$$
I_{sc} = 3 \times I_{L(Y-\Delta)} = 6\,I_{\text{fl}}, \qquad
T_{st(\text{DOL})} = 3 \times T_{st(Y-\Delta)} = 1.32\,T_{\text{fl}}.
$$

**2. Full-load slip**
For a squirrel-cage motor the approximate relation under full voltage is

$$
\frac{T_{st(\text{DOL})}}{T_{\text{fl}}} = \left(\frac{I_{sc}}{I_{\text{fl}}}\right)^2 s_{\text{fl}}.
$$

Substituting:

$$
1.32 = 6^2 \times s_{\text{fl}} \;\Longrightarrow\; s_{\text{fl}} = \frac{1.32}{36} = 0.03667 \approx 3.67\%.
$$

**3. Auto-transformer starting (k = 0.75)**
- Motor (winding) starting current: $I_{m} = k\,I_{sc} = 0.75 \times 6\,I_{\text{fl}} = 4.5\,I_{\text{fl}} = 450\%$ of full-load current.
- Line starting current: $I_{L} = k^2 I_{sc} = 0.75^2 \times 6\,I_{\text{fl}} = 3.375\,I_{\text{fl}} = 337.5\%$ of full-load current.
- Starting torque: $T_{st} = k^2\,T_{st(\text{DOL})} = 0.75^2 \times 1.32\,T_{\text{fl}} = 0.7425\,T_{\text{fl}} = 74.25\%$ of full-load torque.

> **Final answer:**
> (i) Full-load slip $s_{\text{fl}} = 3.67\%$.
> (ii) Starting torque ratio $T_{st}/T_{\text{fl}} = 0.7425$ (or $74.25\%$).
> (iii) Motor starting current $= 450\%$ of $I_{\text{fl}}$; line starting current $= 337.5\%$ of $I_{\text{fl}}$.


---

## Question 36
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5C | EM-I ELE 205 End Sem, 04 December 2006

Explain the working of a star-delta starter for a 3 phase induction motor.

### Answer 36
A star-delta starter is a reduced-voltage electromechanical starter for three-phase squirrel-cage induction motors that are designed to run with their stator windings connected in delta. Its purpose is to limit the high inrush current (typically 5-7 times full-load current) and the large torque pulsations that occur during direct-on-line starting.

**Working principle**

At start, the stator windings are connected in star. With this connection each phase receives a voltage $V_{\text{ph}} = V_L/\sqrt{3}$, where $V_L$ is the line voltage. Because the impedance per phase $Z_{\text{ph}}$ is essentially constant, the phase current and hence the line current (since in star, $I_L = I_{\text{ph}}$) are reduced to

$$
I_{L,\text{star}} = \frac{V_L}{\sqrt{3}\,Z_{\text{ph}}}.
$$

When the motor runs normally in delta, $V_{\text{ph}} = V_L$ and $I_L = \sqrt{3}\,I_{\text{ph}} = \sqrt{3}\,(V_L/Z_{\text{ph}})$.  Comparing the line currents,

$$
\frac{I_{L,\text{star}}}{I_{L,\text{delta}}} = \frac{1}{3}.
$$

Thus star-delta starting reduces the line starting current to one-third of the direct-on-line (delta) value.

Starting torque is proportional to the square of the applied voltage:

$$
T_{\text{star}} \propto \left(\frac{V_L}{\sqrt{3}}\right)^2 = \frac{V_L^2}{3},\qquad
T_{\text{delta}} \propto V_L^2.
$$

Hence

$$
\frac{T_{\text{star}}}{T_{\text{delta}}} = \frac{1}{3}.
$$

The torque is also reduced to one-third, making the method suitable only for loads that can start with reduced torque (centrifugal pumps, fans, unloaded conveyors).

**Transition to delta**

After the motor accelerates to about 75-80 % of synchronous speed, a timer or centrifugal switch triggers the changeover. The star contactor opens, and the delta contactor closes, reconnecting the windings in delta. In the delta configuration full line voltage is applied to each phase, allowing the motor to develop full torque and power. The transition can be *open transition* (brief interruption of supply, which may cause torque and current transients) or *closed transition* (with resistors to limit transients). Modern starters often employ electronic timers and soft-switching to ensure a smooth changeover.

**Practical requirements**
- The motor must have all six terminal leads brought out and must be rated for delta connection at the supply voltage.
- The starter is compact, economical, and simple to install.
- It is not recommended for high-inertia loads or applications demanding high starting torque.

> **Final answer:** The star-delta starter first connects the stator windings in star, reducing the phase voltage to $V_L/\sqrt{3}$, thereby limiting the line starting current and starting torque to one-third of the direct-on-line delta values. Once the motor reaches a preset speed, the connection is switched to delta, restoring full voltage, full torque and full power for normal operation.


---

## Question 37
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5A | EM-I ELE 205 End Sem, 08 December 2007

A 3 phase induction motor has a starting torque of 150 % & a maximum torque of 250 % of the full load torque. Neglecting stator impedance calculate a) the slip at maximum torque b) full load slip (03)

### Answer 37
**Concept:** The torque of a three-phase induction motor, neglecting stator impedance, is
$$
\begin{aligned}
T = \frac{3}{\omega_s} \frac{V_1^2 R_2'/s}{(R_2'/s)^2 + X_2'^2}.
\end{aligned}
$$
Maximum torque occurs when $s_m = R_2'/X_2'$, giving
$$
\begin{aligned}
T_{\max} = \frac{3}{2\omega_s} \frac{V_1^2}{X_2'}.
\end{aligned}
$$
The torque ratio in terms of slip is
$$
\begin{aligned}
\frac{T}{T_{\max}} = \frac{2 s s_m}{s^2 + s_m^2} = \frac{2}{\frac{s}{s_m} + \frac{s_m}{s}}.
\end{aligned}
$$

**Given:** $T_{\text{start}} = 150\%$ of full load $\Rightarrow T_{\text{st}} = 1.5 T_{\text{fl}}$.  $T_{\max} = 250\%$ of full load $\Rightarrow T_{\max} = 2.5 T_{\text{fl}}$.

**a) Slip at maximum torque, $s_m$:**
At starting, $s = 1$. Thus
$$
\begin{aligned}
\frac{T_{\text{st}}}{T_{\max}} = \frac{1.5}{2.5} = 0.6 = \frac{2}{\frac{1}{s_m} + s_m}.
\end{aligned}
$$
Solving,
$$
\begin{aligned}
\frac{1}{s_m} + s_m = \frac{2}{0.6} = \frac{10}{3}
\;\Longrightarrow\; 3s_m^2 -10s_m + 3 = 0,
\end{aligned}
$$
which yields $s_m = 3$ or $s_m = \frac{1}{3}$. For a normal motor $s_m < 1$, hence
$$
\begin{aligned}
s_m = \frac{1}{3} \approx 0.3333 \;(33.33\%).
\end{aligned}
$$

**b) Full-load slip, $s_{\text{fl}}$:**
The full-load torque ratio is
$$
\begin{aligned}
\frac{T_{\text{fl}}}{T_{\max}} = \frac{1}{2.5} = 0.4.
\end{aligned}
$$
Let $x = s_{\text{fl}}/s_m$. Then
$$
\begin{aligned}
0.4 = \frac{2}{x + \frac{1}{x}} \;\Longrightarrow\; x + \frac{1}{x} = 5 \;\Longrightarrow\; x^2 -5x +1 =0.
\end{aligned}
$$
The roots are $x = \frac{5 \pm \sqrt{21}}{2}$ with $\sqrt{21}\approx 4.5826$, giving $x_1 \approx 4.791$, $x_2 \approx 0.2087$. Stable operation requires $s_{\text{fl}} < s_m$, so $x<1$. Thus $x = 0.2087$. Therefore
$$
\begin{aligned}
s_{\text{fl}} = x\,s_m = 0.2087 \times 0.3333 \approx 0.0696 \;(6.96\%).
\end{aligned}
$$

> **Final answer:** (a) slip at maximum torque = 0.333 (33.33%); (b) full-load slip = 0.0696 (6.96%).


---

## Question 38
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3B | EM-I ELE 205 End Sem, 26 November 2012

A 400 V, 50 Hz, 3 phase, 4 pole star connected slip ring induction motor has its rotor standstill leakage impedance of (0.4+j2) Ω per phase. The stator to rotor turns ratio is 1.7. Compute (i) Maximum Torque (ii) Full load torque when the slip is 4%. (iii) The resistance to be included in the rotor circuit to develop 80% of maximum torque at starting. (04)

### Answer 38
**Given:** 400 V, 50 Hz, 3-phase, 4-pole, star-connected slip-ring IM. Rotor standstill leakage impedance $Z_2 = (0.4 + j2)\,\Omega$ per phase. Stator-to-rotor turns ratio $a = 1.7$.

- Synchronous speed: $N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500$ rpm.
  Angular speed: $\omega_s = \frac{2\pi N_s}{60} = 50\pi \approx 157.08$ rad/s.
- Phase voltage: $V_{\text{ph}} = \frac{400}{\sqrt{3}} \approx 230.94$ V.
- Rotor induced emf at standstill (referred to rotor side): $E_2 = \frac{V_{\text{ph}}}{a} = \frac{230.94}{1.7} \approx 135.85$ V.
- Rotor parameters: $R_2 = 0.4\,\Omega$, $X_2 = 2\,\Omega$.

**(i) Maximum torque**
Slip at max torque:
$$
\begin{aligned}
s_m = \frac{R_2}{X_2} = \frac{0.4}{2} = 0.2.
\end{aligned}
$$
Maximum torque expression:
$$
\begin{aligned}
T_{\max} = \frac{3}{\omega_s}\,\frac{E_2^2}{2X_2}.
\end{aligned}
$$
Substituting values:
$$
\begin{aligned}
T_{\max} &= \frac{3 \times (135.85)^2}{2 \times 157.08 \times 2}
= \frac{3 \times 18455}{628.32}
\approx 88.1\,\text{N}\cdot\text{m}.
\end{aligned}
$$

**(ii) Full-load torque at $s = 0.04$**
Torque at any slip:
$$
\begin{aligned}
T = \frac{3}{\omega_s}\,\frac{E_2^2 (R_2/s)}{(R_2/s)^2 + X_2^2}.
\end{aligned}
$$
At $s = 0.04$, $R_2/s = 0.4/0.04 = 10\,\Omega$. Therefore
$$
\begin{aligned}
T_{\text{fl}} &= \frac{3}{157.08} \times \frac{18455 \times 10}{10^2 + 2^2}
= \frac{3}{157.08} \times \frac{184550}{104} \\
&\approx 0.0191 \times 1774.52 \approx 33.9\,\text{N}\cdot\text{m}.
\end{aligned}
$$

**(iii) External rotor resistance for $0.8\,T_{\max}$ at starting**
Let $R_{\text{ext}}$ be added per phase. Total rotor resistance at standstill ($s=1$) is $R_t = R_2 + R_{\text{ext}}$.
Starting torque:
$$
\begin{aligned}
T_{\text{st}} = \frac{3}{\omega_s}\,\frac{E_2^2 R_t}{R_t^2 + X_2^2}.
\end{aligned}
$$
Required $T_{\text{st}} = 0.8\,T_{\max}$, so
$$
\begin{aligned}
\frac{T_{\text{st}}}{T_{\max}} = \frac{2 X_2 R_t}{R_t^2 + X_2^2} = 0.8.
\end{aligned}
$$
With $X_2 = 2\,\Omega$,
$$
\begin{aligned}
\frac{4 R_t}{R_t^2 + 4} = 0.8 &\;\Longrightarrow\; 4R_t = 0.8R_t^2 + 3.2 \\
&\;\Longrightarrow\; 0.8R_t^2 - 4R_t + 3.2 = 0 \\
&\;\Longrightarrow\; R_t^2 - 5R_t + 4 = 0.
\end{aligned}
$$
Roots: $R_t = 1\,\Omega$ or $4\,\Omega$. Choosing the lower value for smaller external resistance and lower losses:
$$
\begin{aligned}
R_{\text{ext}} = R_t - R_2 = 1 - 0.4 = 0.6\,\Omega.
\end{aligned}
$$
(Using the higher root would give $R_{\text{ext}} = 3.6\,\Omega$.)

> **Final answer:** (i) $T_{\max} \approx 88.1$ N·m; (ii) full-load torque $\approx 33.9$ N·m; (iii) external resistance $\approx 0.6\,\Omega$ per phase (or $3.6\,\Omega$ if the higher root is chosen).


---

## Question 39
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3C | EM-I ELE 205 End Sem, 26 November 2012

The short circuit line current of a 6 HP Induction Motor is 3.5 times its full load current. An autotransformer starter is used to limit starting line current to twice the full load current. For a full load slip is 2.5%, (i) Percentage tapping of autotransformer. (ii) Estimate the torque at starting in terms of full load torque (iii) Line current drawn from the supply in terms of full load current with autotransformer set to the above tapping. (03)

### Answer 39
**Concept:** An autotransformer starter reduces motor voltage during starting. If the tapping ratio is $k$ ($0 < k < 1$), the motor terminal voltage is $k V_{\text{rated}}$. Consequently, the motor starting current is $k$ times the direct-on-line short-circuit current $I_{\text{sc}}$, and because of transformer action the supply line current is $k^2 I_{\text{sc}}$. Torque is proportional to the square of the applied voltage.

**Given:** $I_{\text{sc}} = 3.5 I_{\text{fl}}$. Required line current at start $\le 2 I_{\text{fl}}$. Full-load slip $s_{\text{fl}} = 2.5\%$.

**(i) Percentage tapping**
Let the tapping ratio be $k$. Then
$$
\begin{aligned}
I_{\text{line}} = k^2 I_{\text{sc}} = k^2 (3.5 I_{\text{fl}}) &\le 2 I_{\text{fl}} \\
k^2 &\le \frac{2}{3.5} = 0.5714 \\
k &\le \sqrt{0.5714} \approx 0.756.
\end{aligned}
$$
Hence the tapping percentage is $75.6\%$.

**(ii) Starting torque in terms of full-load torque**
The DOL starting torque at rated voltage can be approximated by
$$
\begin{aligned}
\frac{T_{\text{st(DOL)}}}{T_{\text{fl}}} \approx \left(\frac{I_{\text{sc}}}{I_{\text{fl}}}\right)^2 s_{\text{fl}}
= (3.5)^2 \times 0.025 = 0.30625\,T_{\text{fl}}.
\end{aligned}
$$
With the autotransformer, the starting torque becomes $k^2$ times the DOL value:
$$
\begin{aligned}
T_{\text{st(auto)}} = k^2 \, T_{\text{st(DOL)}} = \frac{2}{3.5} \times 0.30625\,T_{\text{fl}} \approx 0.175\,T_{\text{fl}} \;\; (17.5\%).
\end{aligned}
$$

**(iii) Line current with the above tapping**
By design, the line current is limited to the specified value:
$$
\begin{aligned}
I_{\text{line}} = 2\,I_{\text{fl}}.
\end{aligned}
$$

> **Final answer:** (i) tapping $\approx 75.6\%$; (ii) starting torque $\approx 17.5\%$ of full-load torque; (iii) line current $= 2 \times$ full-load current.


---

## Question 40
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3C | EM-I ELE 205 End Sem, 30 November 2010

A 12 pole, 50Hz, 3phase induction motor has the rotor resistance of 0.15Ω per phase and the standstill reactance of 0.25Ω per phase. On full load it is running at a speed of 480rpm.The rotor induced emf per phase at stand-still is observed to be 32V. Calculate (i) Full load torque. (ii) Starting Torque. (iii) Speed at Maximum Torque. (03)

### Answer 40
Given: $P=12$, $f=50$ Hz, $R_2=0.15\ \Omega$, $X_2=0.25\ \Omega$, $E_2=32$ V (standstill), $N_{\text{fl}}=480$ rpm.

Synchronous speed:
$$
\begin{aligned}
N_s = \frac{120f}{P} = \frac{120\times 50}{12}=500\text{ rpm}
\end{aligned}
$$
Angular speed:
$$
\begin{aligned}
\omega_s = \frac{2\pi N_s}{60}= \frac{2\pi \times 500}{60}=52.36\text{ rad/s}
\end{aligned}
$$

**(i) Full-load torque**

Slip:
$$
\begin{aligned}
s = \frac{N_s - N_{\text{fl}}}{N_s}= \frac{500-480}{500}=0.04
\end{aligned}
$$

Rotor current (neglecting magnetising branch):
$$
\begin{aligned}
I_2 = \frac{sE_2}{\sqrt{R_2^2+(sX_2)^2}} = \frac{0.04\times 32}{\sqrt{0.15^2+(0.04\times 0.25)^2}} = \frac{1.28}{\sqrt{0.0225+0.0001}} \approx 8.515\text{ A}
\end{aligned}
$$

Rotor copper loss:
$$
\begin{aligned}
P_{\text{cu}} = 3I_2^2 R_2 = 3\times (8.515)^2 \times 0.15 \approx 32.6\text{ W}
\end{aligned}
$$

Air-gap power:
$$
\begin{aligned}
P_{\text{ag}} = \frac{P_{\text{cu}}}{s}= \frac{32.6}{0.04}=815.8\text{ W}
\end{aligned}
$$

Full-load torque:
$$
\begin{aligned}
T_{\text{fl}} = \frac{P_{\text{ag}}}{\omega_s}= \frac{815.8}{52.36}\approx 15.6 \text{N}\cdot\text{m}
\end{aligned}
$$

**(ii) Starting torque**

At start, $s=1$. The torque expression in terms of standstill emf:
$$
\begin{aligned}
T = \frac{3}{\omega_s}\frac{sE_2^2 R_2}{R_2^2+(sX_2)^2}
\end{aligned}
$$
Set $s=1$:
$$
\begin{aligned}
T_{\text{st}} &= \frac{3}{\omega_s}\frac{E_2^2 R_2}{R_2^2+X_2^2}
= \frac{3}{52.36}\cdot\frac{32^2\times 0.15}{0.15^2+0.25^2}\\
&= \frac{3}{52.36}\cdot\frac{1024\times 0.15}{0.0225+0.0625}
= \frac{3}{52.36}\cdot\frac{153.6}{0.085}\\
&\approx 0.0573 \times 1807.06 \approx 103.5 \text{N}\cdot\text{m}
\end{aligned}
$$

**(iii) Speed at maximum torque**

Slip at maximum torque depends only on rotor parameters:
$$
\begin{aligned}
s_m = \frac{R_2}{X_2}= \frac{0.15}{0.25}=0.6
\end{aligned}
$$
Corresponding speed:
$$
\begin{aligned}
N_{T_{\max}} = (1-s_m)N_s = (1-0.6)\times 500 = 200\text{ rpm}
\end{aligned}
$$

> **Final answer:** (i) 15.6 N·m; (ii) 103.5 N·m; (iii) 200 rpm.


---

## Question 41
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5A | EM-I ELE 205 End Sem, 30 November 2010

A 3-phase squirrel cage induction motor takes a starting current 6 times the full load current. Estimate the starting torque as a percentage of full load torque if the motor is started (i) direct on line (ii) through a star-delta starter. The full load slip of the motor is 4%. (02)

### Answer 41
Given: starting current $= 6\times$ full-load current; full-load slip $s_{\text{fl}} = 0.04$. Neglecting the magnetising current, rotor current $\approx$ stator current. Induction motor torque is proportional to $(\text{rotor current})^2 / \text{slip}$, hence

$$
\begin{aligned}
\frac{T_{\text{st}}}{T_{\text{fl}}} \approx \left(\frac{I_{\text{st}}}{I_{\text{fl}}}\right)^2 \times s_{\text{fl}}
\end{aligned}
$$

**(i) Direct-on-line (DOL) starting**
With DOL, full line voltage is applied at start. Therefore

$$
\begin{aligned}
\frac{T_{\text{st(DOL)}}}{T_{\text{fl}}} = (6)^2 \times 0.04 = 36 \times 0.04 = 1.44
\end{aligned}
$$
Thus the DOL starting torque is **144 %** of full-load torque.

**(ii) Star-delta starter**
In star connection, the phase voltage is $1/\sqrt{3}$ of the line voltage. Since torque is proportional to the square of the applied voltage, the starting torque in star is one-third of that in delta:

$$
\begin{aligned}
T_{\text{st(Y-Delta)}} = \frac{1}{3}\,T_{\text{st(DOL)}} = \frac{144\%}{3}=48\%
\end{aligned}
$$
Hence the star-delta start gives **48 %** of full-load torque.

> **Final answer:** (i) DOL: 144 % of full-load torque; (ii) star-delta: 48 % of full-load torque.


---

## Question 42
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5B | EM-I ELE 205 End Sem, 30 November 2010

The standstill rotor voltage of a 3 phase induction motor is 190V per phase. The motor is running with a slip of 4% and the load torque is proportional to square of the speed. What must be the rotor injected voltage to run the motor with slip of 0.6. The rotor resistance per phase is 0.5 Ω. (03)

### Answer 42
Given: standstill rotor emf per phase $E_2 = 190$ V, rotor resistance $R_2 = 0.5\ \Omega$, initial slip $s_1 = 0.04$, desired slip $s_2 = 0.6$. The load torque is proportional to the square of the speed: $T_L \propto (1-s)^2$. Rotor leakage reactance is neglected (typical for slip-power recovery control).

**1. Initial condition (no injection)**
Rotor induced emf at $s_1$:
$$
\begin{aligned}
E_{s1} = s_1 E_2 = 0.04\times 190 = 7.6\text{ V}
\end{aligned}
$$
Rotor current:
$$
\begin{aligned}
I_{21} = \frac{E_{s1}}{R_2} = \frac{7.6}{0.5} = 15.2\text{ A}
\end{aligned}
$$

**2. Required rotor current at new slip $s_2$**
With constant flux, motor torque $T \propto I_2^2 / s$. Equating the motor torque to the load characteristic:
$$
\begin{aligned}
\frac{I_{22}^2 / s_2}{I_{21}^2 / s_1} = \left(\frac{1-s_2}{1-s_1}\right)^2
\end{aligned}
$$
Solving for $I_{22}$:
$$
\begin{aligned}
I_{22} &= I_{21} \sqrt{\frac{s_2}{s_1}\left(\frac{1-s_2}{1-s_1}\right)^2} \\
&= 15.2 \times \sqrt{\frac{0.6}{0.04}\left(\frac{1-0.6}{1-0.04}\right)^2} \\
&= 15.2 \times \sqrt{15 \times \left(\frac{0.4}{0.96}\right)^2} \\
&= 15.2 \times \sqrt{15 \times 0.1736} \\
&= 15.2 \times \sqrt{2.604} \approx 15.2 \times 1.614 \approx 24.53\text{ A}
\end{aligned}
$$

**3. Injected rotor voltage**
Natural induced emf at $s_2$:
$$
\begin{aligned}
E_{s2} = s_2 E_2 = 0.6\times 190 = 114\text{ V}
\end{aligned}
$$
With negligible reactance, the net rotor voltage must equal the resistive drop:
$$
\begin{aligned}
V_{\text{net}} = I_{22} R_2 = 24.53 \times 0.5 = 12.265\text{ V}
\end{aligned}
$$
To obtain this, an external voltage must be injected in phase opposition. The rotor circuit equation is $E_{s2} - E_{\text{inj}} = I_{22}R_2$, giving
$$
\begin{aligned}
E_{\text{inj}} = E_{s2} - I_{22} R_2 = 114 - 12.265 \approx 101.7\text{ V/phase}
\end{aligned}
$$
Rounded, the required injection is **102 V per phase** (opposing the induced emf).

> **Final answer:** Approximately 102 V/phase must be injected in opposition to the rotor induced emf.


---

## Question 43
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 6A | EM-I ELE 205 Makeup, 05 January 2015

Sketch and explain the torque-slip characteristics of a 3 phase slip ring induction motor for different values of rotor resistance. 3

### Answer 43
In a slip-ring induction motor, external rotor resistance can be connected via slip rings. This changes the torque-slip curve while keeping $T_{\max}$ constant.

Using the simplified equivalent circuit:

$$
\begin{aligned}
T_e &= \frac{3 V_1^2}{\omega_s} \cdot \frac{R_2'/s}{(R_2'/s)^2 + X_2'^2}
\end{aligned}
$$

The slip for maximum torque is $s_{\max} = R_2'/X_2'$, and

$$
\begin{aligned}
T_{e,\max} &= \frac{3 V_1^2}{2\omega_s X_2'}
\end{aligned}
$$

which is independent of rotor resistance. When external resistance $R_{\text{ext}}'$ is added, total rotor resistance becomes $R_{2,\text{total}}' = R_2' + R_{\text{ext}}'$. Then $s_{\max,\text{new}} = R_{2,\text{total}}'/X_2'$.

**Effect on torque-slip curves** (typically sketched with $T$ vs $s$ from $s=0$ to $s\approx 2$):

1. **Low resistance (natural rotor)**: $s_{\max}$ small (e.g., 0.1-0.2); low starting torque, good efficiency.
2. **Increased resistance**: Curve shifts to higher slip; $s_{\max}$ increases; starting torque $T_{\text{st}}$ initially rises.
3. **Resistance such that $s_{\max}=1$**: Peak occurs at standstill; $T_{\text{st}} = T_{\max}$, ideal for heavy starting.
4. **Further increase**: $s_{\max} > 1$; peak moves into braking region; starting torque may drop.

All curves have the same $T_{\max}$. The stable motoring region is the nearly linear part left of the peak.

**Features**:
- Adding resistance boosts starting torque (up to $T_{\max}$) and limits current.
- It enables speed control by varying external resistance, but with high rotor losses.
- Used for soft starting: resistance is shorted out gradually as speed increases.

> **Final answer:** Adding external rotor resistance shifts the torque-slip curve to higher slips without changing $T_{\max}$, because $T_{\max}$ depends only on $V_1$ and $X_2'$. The slip for maximum torque increases linearly with total rotor resistance ($s_{\max} = R_{2,\text{total}}'/X_2'$), raising starting torque and allowing speed control. The curves for different resistances all share the same peak; as resistance increases, the peak moves rightward.


---

## Question 44
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 6C | EM-I ELE 205 Makeup, 05 January 2015

The ratio V/f should be maintained constant during speed control of a 3 phase induction motor. Give reasons. 2

### Answer 44
In variable-frequency speed control, the air-gap flux $\phi$ must remain at its rated value. The induced emf per phase is $E = 4.44 f N \phi K_w$. Neglecting the small stator impedance drop, $V \approx E$, so

$$
\begin{aligned}
\phi &\propto \frac{V}{f}
\end{aligned}
$$

Thus, constant $V/f$ is essential for the following reasons:

1. **Prevent magnetic saturation**: At low frequencies, if $V$ is fixed, $V/f$ rises, causing $\phi$ to increase. The core saturates, leading to very high magnetising current, excessive core losses, overheating and possible insulation failure.
2. **Maintain torque capability**: Electromagnetic torque $T \propto \phi I_2 \cos\phi_2$. If $\phi$ drops at high frequencies (when $f$ increases without raising $V$), the torque reduces and the motor may stall under load.
3. **Constant-torque operation**: Holding $V/f$ constant from standstill up to rated frequency keeps flux constant, enabling the motor to deliver its full rated torque over a wide speed range.
4. **Soft starting**: A VVVF inverter can ramp voltage and frequency simultaneously, maintaining $V/f$ constant. This limits starting current and provides smooth acceleration.
5. **Defines field-weakening boundary**: When $V$ reaches the maximum inverter voltage at base frequency, further speed increase must be at constant $V$. Flux then weakens inversely with frequency, giving a constant-power region. The constant $V/f$ strategy below base speed naturally transitions to constant $V$ above base speed.

> **Final answer:** $V/f$ is kept constant to maintain rated air-gap flux ($\phi \propto V/f$), thereby avoiding magnetic saturation at low frequencies (which would cause high magnetising current and overheating) and torque loss at high frequencies. It enables constant-torque operation over a wide speed range, provides soft starting, and naturally transitions to field weakening above base frequency.


---

## Question 45
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 4B | EM-I ELE 205 Makeup, 05 January 2016

Draw the torque slip characteristics of a squirrel cage induction motor and 4M mark the salient points.

### Answer 45
For a squirrel-cage induction motor, the rotor resistance is fixed, giving a single torque-slip characteristic. Using the simplified equivalent circuit:

$$
\begin{aligned}
T &= \frac{3 V_1^2}{\omega_s} \cdot \frac{R_2'/s}{(R_2'/s)^2 + X_2'^2}
\end{aligned}
$$

The maximum torque occurs at slip $s_{\max} = R_2'/X_2'$, with $T_{\max} = \frac{3 V_1^2}{2\omega_s X_2'}$.

**Shape of the curve** (plot $s$ on x-axis, $0$ to $1$ for motoring, extended for generation and braking):

- At $s=0$, $T=0$ (synchronous speed).
- For small slips, torque rises nearly linearly.
- It reaches a maximum $T_{\max}$ at $s_{\max}$ (typically 0.1-0.2 for efficient machines).
- Beyond $s_{\max}$, torque decreases because the leakage reactance dominates.
- At $s=1$, the motor develops starting torque $T_{\text{st}}$, which is lower than $T_{\max}$.
- For $s<0$, torque becomes negative - induction generator region.
- For $s>1$, torque remains positive but slip is high - plug braking region.

**Salient points to mark on the diagram**:

1. **$s=0$, $T=0$**: No-load synchronism.
2. **Full-load slip $s_{\text{FL}}$**: Usually 2-5%, where rated torque $T_{\text{FL}}$ is developed.
3. **Maximum torque point ($s_{\max}, T_{\max}$)**: Pull-out or breakdown torque; the boundary of stable operation.
4. **Starting point ($s=1, T_{\text{st}}$)**: Torque produced at standstill.
5. **Generating region $s<0$**: Negative torque, power returned to supply.
6. **Braking region $s>1$**: Rotor rotating opposite to field; used for rapid stopping.

The motor operates stably only in the region $0 < s < s_{\max}$.

> **Final answer:** The torque-slip curve of a squirrel-cage induction motor starts at zero at $s=0$, rises to a maximum $T_{\max}$ at slip $s_{\max}$, then falls to $T_{\text{st}}$ at $s=1$. Salient points: $s=0$ (zero torque), $s_{\text{FL}}$ (full load), $s_{\max}$ (pull-out), $s=1$ (starting), $s<0$ (generating), $s>1$ (braking). The curve is fixed; stable motoring occurs only for $0 < s < s_{\max}$.


---

## Question 46
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3C | EM-I ELE 205 Makeup, 08 January 2008

A 10 pole 50 Hz slip ring induction motor runs at 580 RPM on full load. The rotor resistance per phase is 0.3 Ω. Calculate the additional resistance per phase to be inserted in the rotor circuit if the speed is to be reduced to 500 RPM for full load torque. (03)

### Answer 46
For a slip-ring induction motor, speed control is achieved by inserting external resistance in the rotor circuit. At constant load torque, the rotor resistance-slip relationship can be approximated as $R_2/s = \text{constant}$ when the leakage reactance is negligible compared to the resistive drop.

**Given:** 10-pole, 50 Hz, full-load speed 580 rpm, desired speed 500 rpm, $R_2 = 0.3\,\Omega$ per phase.

**Solution:**

Synchronous speed:
$$
\begin{aligned}
N_s = \frac{120f}{P} = \frac{120 \times 50}{10} = 600\text{ rpm}
\end{aligned}
$$

Initial slip:
$$
\begin{aligned}
s_1 = \frac{N_s - N_{r1}}{N_s} = \frac{600-580}{600} = \frac{20}{600} = \frac{1}{30}
\end{aligned}
$$

Desired slip:
$$
\begin{aligned}
s_2 = \frac{600-500}{600} = \frac{100}{600} = \frac{1}{6}
\end{aligned}
$$

For constant load torque, $\frac{R_2}{s_1} = \frac{R_2 + R_{\text{ext}}}{s_2}$. Therefore,
$$
\begin{aligned}
R_{\text{ext}} &= R_2\left(\frac{s_2}{s_1} - 1\right) \\
&= 0.3\left(\frac{1/6}{1/30} - 1\right) \\
&= 0.3 \times (5 - 1) = 0.3 \times 4 = 1.2\,\Omega
\end{aligned}
$$

> **Final answer:** Additional resistance per phase = $1.2\,\Omega$.


---

## Question 47
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5A | EM-I ELE 205 Makeup, 08 January 2008

Draw and explain the torque-slip characteristic of a 3-phase induction motor. Also explain the effect of rotor resistance on torque slip characteristics. (04)

### Answer 47
**Torque-Slip Characteristic**

The torque-slip curve describes the electromagnetic torque developed by a 3-phase induction motor as a function of slip $s = (n_s - n_r)/n_s$. The characteristic has five distinct regions:
- $s = 0$ (synchronous speed): torque is zero.
- $0 < s < 1$ (motoring): torque rises nearly linearly from zero to a maximum (breakdown torque) at $s = s_m$, then falls to the starting torque at $s = 1$.
- $s < 0$ (generating / negative slip): rotor runs above synchronous speed, machine delivers power to the supply; torque is negative.
- $s > 1$ (plugging/braking): rotor forced opposite to field, high slip, large currents, braking torque.

Using the per-phase equivalent circuit, the torque is given by
$$
\begin{aligned}
T = \frac{3}{\omega_s} \frac{V_{\text{th}}^2}{\left(R_{\text{th}} + \frac{R_2'}{s}\right)^2 + (X_{\text{th}} + X_2')^2} \frac{R_2'}{s},
\end{aligned}
$$
which, under normal operation ($R_{\text{th}} \ll X_{\text{th}}+X_2'$), simplifies to
$$
\begin{aligned}
s_m &\approx \frac{R_2'}{X_{\text{th}} + X_2'}, \\
T_{\max} &= \frac{3}{2\omega_s} \frac{V_{\text{th}}^2}{X_{\text{th}} + X_2'}.
\end{aligned}
$$
Thus, maximum torque is independent of rotor resistance.

**Effect of Rotor Resistance**

In a wound-rotor motor, adding external rotor resistance increases $R_2'$. This:
- Shifts $s_m$ to higher values (the peak of the torque-slip curve moves to the right).
- Increases the starting torque (can even be made equal to $T_{\max}$ when $s_m = 1$).
- Leaves $T_{\max}$ unchanged.
- Widens the stable operating region, but if the resistance is left in circuit, running efficiency drops because of increased $I^2R$ losses.

In cage rotors, similar effects are achieved by designing bars that present high effective resistance at standstill (through skin effect) and low resistance at running slip (deep-bar, double-cage, etc.).

> **Final answer:** The torque-slip curve rises from zero at synchronous speed to a maximum at $s_m$, then falls to the starting torque at standstill; generation occurs for $s<0$ and braking for $s>1$. Increasing rotor resistance increases $s_m$ and starting torque without affecting the maximum torque, effectively shifting the torque-slip characteristic to higher slips.


---

## Question 48
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5C | EM-I ELE 205 Makeup, 08 January 2008

What changes can be made on cage rotor construction to improve the starting torque of a three phase induction motor. (02)

### Answer 48
**Starting Torque Improvement in Cage Rotors**

For a cage induction motor, starting torque (at $s=1$) can be expressed approximately as
$$
\begin{aligned}
T_{\text{start}} \propto \frac{R_2'}{R_2'^2 + (X_1+X_2')^2},
\end{aligned}
$$
where $R_2'$ is the rotor resistance referred to the stator, and $X_1$, $X_2'$ are leakage reactances. Starting torque is low when $R_2'$ is small. To increase $T_{\text{start}}$, $R_2'$ should be raised, but a high running resistance lowers efficiency.

Therefore, the rotor must have a high effective resistance at standstill (rotor frequency = line frequency) and a low effective resistance at normal slip (rotor frequency $\approx 1-3$ Hz). This is achieved by exploiting the skin effect in the rotor bars. Common construction modifications are:

1. **Deep-bar rotor**: Narrow, deep bars force current to crowd near the top at starting (high frequency), increasing effective resistance; at low slip, current distributes uniformly, reducing resistance.
2. **Double-cage rotor**: An outer cage of high-resistivity material (e.g., brass) and an inner cage of low-resistivity material (e.g., copper). The high-leakage-reactance inner cage carries little current at start, so the high-resistance outer cage dominates; at run, the inner cage takes over.
3. **Shaped bars (wedge, T, L)** : Bars with a tapered cross-section enhance the skin effect, giving a high start resistance and a low run resistance.
4. **Higher-resistivity bar material**: Using aluminum alloys or brass instead of pure copper increases resistance, but raises running losses as well.

All these methods increase the starting torque while keeping the maximum pull-out torque unchanged, because $T_{\max}$ is independent of rotor resistance.

> **Final answer:** The starting torque of a cage induction motor can be improved by increasing the effective rotor resistance at standstill through deep-bar, double-cage, shaped-bar, or high-resistivity material designs. These exploit the skin effect to give high resistance at start and low resistance at run, boosting starting torque without affecting maximum torque.


---

## Question 49
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3C | EM-I ELE 2103 End Sem, 27 November 2018

A 4-pole, 50 Hz, 3-phase induction motor, with star connected rotor, has a rotor resistance of 4.5 Ω/phase and a standstill leakage reactance of 8.5 Ω/phase. With no external resistance in the rotor circuit, the starting torque of the motor is 85 N-m. If 3 Ω resistance were added in each rotor phase, find the following. i) The starting torque. ii) The torque at a slip of 3 %. (04)

### Answer 49
**Given:**
- 4-pole, 50 Hz, 3-phase, star-connected rotor.
- Rotor resistance: $R_2 = 4.5\,\Omega$ per phase.
- Standstill leakage reactance: $X_2 = 8.5\,\Omega$ per phase.
- Starting torque without external resistance: $T_{\text{st}1} = 85$ N·m.
- External resistance added: $R_{\text{ext}} = 3\,\Omega$ per phase.

**Torque relation:**
For any slip $s$,
$$
\begin{aligned}
T \propto \frac{R_2/s}{(R_2/s)^2 + X_2^2}.
\end{aligned}
$$
At start $s=1$,
$$
\begin{aligned}
T_{\text{st}} = K \frac{R_2}{R_2^2 + X_2^2},
\end{aligned}
$$
where $K = \frac{3E_2^2}{\omega_s}$ (motor constant).

**Find $K$ from initial condition:**
$$
\begin{aligned}
85 &= K \frac{4.5}{4.5^2 + 8.5^2}
    = K \frac{4.5}{92.5} \\[4pt]
K  &= 85 \times \frac{92.5}{4.5} \approx 1747.22 \;(\text{N}\cdot\text{m}\cdot\Omega).
\end{aligned}
$$

**(i) New starting torque with $R_2' = 4.5+3 = 7.5\,\Omega$:**
$$
\begin{aligned}
T_{\text{st}2} &= 1747.22 \times \frac{7.5}{7.5^2 + 8.5^2} \\
               &= 1747.22 \times \frac{7.5}{128.5} \\
               &\approx 102.0\ \text{N}\cdot\text{m}.
\end{aligned}
$$

**(ii) Torque at slip $s = 0.03$ (3 %) with $R_2' = 7.5\,\Omega$:**
$$
\begin{aligned}
\frac{R_2'}{s} &= \frac{7.5}{0.03} = 250\,\Omega \\[4pt]
T_{3\%} &= 1747.22 \times \frac{250}{250^2 + 8.5^2} \\
        &= 1747.22 \times \frac{250}{62572.25} \\
        &\approx 7.0\ \text{N}\cdot\text{m}.
\end{aligned}
$$

> **Final answer:** (i) Starting torque ≈ 102 N·m; (ii) Torque at 3 % slip ≈ 7.0 N·m.


---

## Question 50
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 4A | EM-I ELE 2103 End Sem, 27 November 2018

Discuss the variable frequency control strategies for the speed control of 3-phase induction motor. (02)

### Answer 50
Variable frequency control is the most effective method for varying the speed of a three-phase induction motor. The synchronous speed is $N_s = 120f/P$ rpm; changing the supply frequency $f$ directly changes the motor speed. However, the terminal voltage must be coordinated with frequency to maintain proper air-gap flux.

**1. Scalar V/f Control (Constant Volts per Hertz)**
- Below the base (rated) frequency, the voltage is varied proportionally with frequency to keep $V/f$ constant. This maintains constant flux and hence constant torque capability.
- At very low frequencies, a voltage boost compensates for the stator resistance drop to preserve flux.
- Above base frequency, the voltage is held at its maximum rated value while frequency increases further. The flux weakens inversely with frequency, giving a constant-power (field-weakening) region.
- Implementation uses a PWM inverter; simple open-loop control suffices for general-purpose drives (fans, pumps, conveyors).

**2. Vector Control (Field-Oriented Control, FOC)**
- The stator current is decomposed into two orthogonal components: flux-producing $i_{sd}$ and torque-producing $i_{sq}$.
- Independent control of these components emulates a separately excited DC motor, yielding fast torque response and precise speed regulation.
- Requires rotor position/speed sensors and coordinate transformations; employed in high-performance servo and traction drives.

**3. Direct Torque Control (DTC)**
- Directly regulates stator flux magnitude and electromagnetic torque using hysteresis comparators and an optimal switching table.
- Eliminates current controllers and coordinate transformations, offering extremely rapid torque response.
- Drawbacks include higher torque ripple and variable inverter switching frequency.

**Summary:** Scalar V/f control is simple and widely adopted. Vector control and DTC provide superior dynamic performance for demanding applications.

> **Final answer:** The principal variable-frequency strategies are scalar V/f control (constant torque up to base speed, constant power above), vector (field-oriented) control, and direct torque control (DTC). Scalar V/f is the most common for general-purpose drives; vector/DTC are reserved for high-performance applications.


---

## Question 51
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3B | EM-I ELE 2123 End Sem, 05 December 2023

A 415V, 3 phase, 50 Hz squirrel cage motor draws 5 times its full load current during starting. Which of the following starters you would recommend? a) Direct Online starter b) Star-delta starter Give sufficient reasons. Also, draw the connection diagram of the motor and starter to the supply.

### Answer 51
**Motor data:** 415 V, 3-ph, 50 Hz squirrel-cage; starting current = $5 \times I_{\text{fl}}$.

**Recommended starter: Star-delta starter.**

**Reasons:**
- Direct-on-line (DOL) starting draws $5\,I_{\text{fl}}$, causing excessive voltage dip, mechanical shock, and possible nuisance tripping.
- In star-delta starting, the windings are initially connected in star, applying $V_{\text{ph}} = V_L/\sqrt{3}$ to each phase.
- The starting line current is reduced to $1/3$ of the DOL value:
  $$
  \begin{aligned}
  I_{\text{start}(Y)} = \frac{1}{3} \times 5\,I_{\text{fl}} \approx 1.67\,I_{\text{fl}},
  \end{aligned}
  $$
  which is well within supply regulations.
- Starting torque also drops to $1/3$ of DOL torque (torque $\propto V^2$), acceptable for light-load or unloaded starts (fans, pumps, unloaded compressors).
- Once the motor reaches 80-90 % of synchronous speed, a timer transitions the connection to delta, applying full voltage for normal running.
- The star-delta starter is simple, economical (three contactors, a timer, and an overload relay) and widely used for motors up to several hundred kW, provided the motor is delta-connected for running.

**Connection diagram description:**
The power circuit consists of:
- A three-pole main contactor (M) connecting supply lines L1, L2, L3 to motor terminals U1, V1, W1.
- A three-pole star contactor (S) that shorts together the other winding ends (U2, V2, W2) to form the star point.
- A three-pole delta contactor (D) that, when energised, connects U2→V1, V2→W1, W2→U1, forming the delta loop.
- An overload relay (O/L) in series with each phase.
- A control timer: initially M and S are closed (star connection); after an adjustable delay (typically 5-15 s), S opens, then D closes, completing the transition to delta.

(Standard textbooks provide detailed schematics; the description above outlines the typical industrial circuit.)

> **Final answer:** Recommend a star-delta starter because it reduces starting line current to ~1.67 p.u. of full-load current, minimising voltage drop and mechanical stress, while supplying adequate torque for light-starting loads. The motor must be delta-connected for normal running.


---

## Question 52
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 2B | EM-I ELE 2123 End Sem, 25 November 2024

Sketch the torque-slip characteristic of a 3-phase squirrel cage induction motor indicating therein the starting torque, maximum torque and the operating region. Analyze and distinguish how these characteristics can be altered in a wound rotor induction motor with respect to the following aspects: a) Starting torque and its magnitude b) Slip at which the maximum torque occurs c) Magnitude of the maximum torque

### Answer 52
The torque-slip curve of an induction motor shows torque $T_e$ against slip $s$. At $s=0$, $T_e=0$. For small slips, torque rises linearly, reaching a maximum $T_{\max}$ at slip $s_m$, then drops to starting torque $T_{\mathrm{st}}$ at $s=1$. The stable operating region is $0 < s < s_m$ (motoring). The curve is derived from the approximate per-phase equivalent circuit:

$$
\begin{aligned}
T_e = \frac{3}{\omega_s} \cdot \frac{V_{th}^2 \frac{r_2'}{s}}{\bigl(R_{th} + \frac{r_2'}{s}\bigr)^2 + (X_{th} + x_2')^2}
\end{aligned}
$$

The slip at maximum torque and the maximum torque are

$$
\begin{aligned}
s_m = \frac{r_2'}{\sqrt{R_{th}^2 + (X_{th} + x_2')^2}},\quad
T_{\max} = \frac{3}{2\omega_s} \cdot \frac{V_{th}^2}{R_{th} + \sqrt{R_{th}^2 + (X_{th} + x_2')^2}}.
\end{aligned}
$$

These reveal that $s_m \propto r_2'$ while $T_{\max}$ is independent of rotor resistance.

In a **wound-rotor (slip-ring) motor**, external resistors can be added to the rotor circuit:

- **(a) Starting torque**: Adding resistance increases total $r_2'$, shifting $s_m$ toward 1. When $s_m=1$, the motor develops $T_{\max}$ at start - the starting torque can be raised to the breakdown value.
- **(b) Slip at which $T_{\max}$ occurs**: Since $s_m \propto r_2'$, extra resistance moves the torque peak to a higher slip. The whole curve skews to the right, but the peak height remains unchanged.
- **(c) Magnitude of $T_{\max}$**: $T_{\max}$ depends only on $V_{th}$, frequency and leakage reactances; it does **not** change with rotor resistance. The motor's overload capacity is preserved.

Thus, external rotor resistance greatly improves starting performance and allows control of the torque-slip shape without sacrificing the maximum torque capability.

> **Final answer:** In a wound-rotor motor, external rotor resistance increases starting torque, shifts $s_m$ to a higher slip, but leaves $T_{\max}$ unchanged.


---

## Question 53
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 2A | EM-I ELE 2154 Makeup/GI, 28 July 2021

Sketch the complete torque-slip characteristics of induction motor explaining the modes of operation. (04)

### Answer 53
The torque-slip characteristic of a three-phase induction motor illustrates the machine's behavior across three distinct modes. Slip is defined as $s = (n_s - n_r)/n_s$, where $n_s$ is synchronous speed.

**Motoring mode (0 < s < 1):** The rotor runs slower than the field. Power flows from stator to rotor, producing a driving torque. The curve rises almost linearly from $s=0$ (zero torque) to a maximum value $T_{\max}$ at $s = s_m$, then declines to the starting torque at $s=1$. The motor operates stably only on the low-slip side ($0 < s < s_m$). Typical full-load slip is less than $0.05$.

**Generating mode (s < 0):** When the rotor is driven above synchronous speed by a prime mover, slip becomes negative. The developed torque opposes the direction of rotation, and the machine feeds active power back to the supply. The torque-slip curve for negative slips is a mirror image of the motoring curve about $s=0$. Induction generators are used in wind turbines and micro-hydro plants.

**Braking (Plugging) mode (s > 1):** If the stator supply phase sequence is reversed while the rotor is still rotating in the original direction, the rotating field now moves opposite to the rotor. Slip becomes greater than 1 (e.g., $s \approx 2 - s_{\text{old}}$). The torque acts as a brake, absorbing mechanical energy and drawing power from the supply. High currents and rapid heating occur. This region covers $1 < s < 2$. Alternatively, mechanical forcing against the field also gives $s>1$ (regenerative braking).

Key points on the characteristic:
- $s = 0$: synchronous speed, zero torque.
- $s = s_m$: maximum (pull-out) torque.
- $s = 1$: standstill (starting torque).
- $s = 2$: plugging with reversed supply.

The stable operating region is $0 \le s < s_m$ in motoring and the corresponding negative $s$ in generating; beyond $s_m$ the operation is unstable without external control.

> **Final answer:** The torque-slip curve displays three modes: motoring ($0<s<1$), generating ($s<0$), and braking/plugging ($s>1$). Stable operation occurs between $s=0$ and $s_m$ in motoring and the mirror region in generating. Maximum torque occurs at $s_m$, starting torque at $s=1$.


---

## Question 54
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5A | EM-I ELE 2154 Makeup/GI, 28 July 2021

Consider a 415 V, 6-pole, 50 Hz induction motor with δ connected rotor windings. The voltage measured between the slip rings at standstill is 60 V and when running at full load is 3 V. The rotor resistance and standstill rotor reactance are 0.6 Ω and 2.8 Ω respectively. Calculate at full load, (a) Speed (b) Rotor current (c) Torque developed & (d) Power developed by the motor (05)

### Answer 54
**Given:**
- Supply: 415 V, 50 Hz, 6 poles → $n_s = 120f/P = 1000\,\text{rpm}$, $\omega_s = 104.72\,\text{rad/s}$.
- Rotor: delta-connected; standstill slip-ring voltage $E_2 = 60\,\text{V}$ (phase emf).
- Full-load slip-ring voltage $= 3\,\text{V}$.
- Rotor parameters/phase: $R_2 = 0.6\,\Omega$, $X_2 = 2.8\,\Omega$ at standstill.

**Slip:** At standstill $E_2 \propto n_s$, at slip $s$, $E_{2s} = sE_2$. Thus

$$
\begin{aligned}
s = \frac{E_{2s}}{E_2} = \frac{3}{60} = 0.05\ (5\%).
\end{aligned}
$$

**(a) Speed:**
$$
\begin{aligned}
n = (1-s)n_s = 0.95 \times 1000 = 950\,\text{rpm}.
\end{aligned}
$$

**(b) Rotor current per phase:**
Rotor reactance at slip $s$:
$$
\begin{aligned}
X_{2s} = s X_2 = 0.05 \times 2.8 = 0.14\,\Omega.
\end{aligned}
$$
Rotor impedance per phase:
$$
\begin{aligned}
Z_2 = \sqrt{R_2^2 + X_{2s}^2} = \sqrt{0.6^2 + 0.14^2} = \sqrt{0.3796} \approx 0.6161\,\Omega.
\end{aligned}
$$
Rotor phase emf at full load $E_{2s}=3\,\text{V}$. Rotor phase current:
$$
\begin{aligned}
I_2 = \frac{E_{2s}}{Z_2} = \frac{3}{0.6161} \approx 4.87\,\text{A}.
\end{aligned}
$$

**(c) Torque developed:**
Rotor copper loss (three phases):
$$
\begin{aligned}
P_{\text{cu}_2} = 3 I_2^2 R_2 = 3 \times (4.87)^2 \times 0.6 \approx 42.6\,\text{W}.
\end{aligned}
$$
Air-gap power:
$$
\begin{aligned}
P_{\text{ag}} = \frac{P_{\text{cu}_2}}{s} = \frac{42.6}{0.05} = 852\,\text{W}.
\end{aligned}
$$
Electromagnetic torque:
$$
\begin{aligned}
T = \frac{P_{\text{ag}}}{\omega_s} = \frac{852}{104.72} \approx 8.14\,\text{N}\cdot\text{m}.
\end{aligned}
$$

**(d) Mechanical power developed:**
$$
\begin{aligned}
P_{\text{mech}} = (1-s)P_{\text{ag}} = 0.95 \times 852 \approx 809\,\text{W}.
\end{aligned}
$$

> **Final answer:** (a) 950 rpm; (b) 4.87 A/phase; (c) 8.14 N·m; (d) 809 W.


---

## Question 55
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3B | EM-I ELE 205 End Sem, 03 December 2014

A 3 phase, 50 Hz, 400 V induction motor has the following test data: No load Test: 400 V, 10 A, 1 kW; Blocked rotor Test: 150 V, 40 A, 4 kW. Equivalent rotor resistance per phase referred to stator is equal to Stator resistance per phase. Draw the circle diagram and determine (a) Line current and operating slip when the shaft power is 40 HP, (b) Maximum power input. 6

### Answer 55
Assuming star connection, phase voltage $V_{\text{ph}} = 400/\sqrt{3} = 230.94\,\text{V}$.

**No-load test**: $V_0 = 400\,\text{V}$, $I_0 = 10\,\text{A}$, $P_0 = 1\,\text{kW}$.
Per phase: $V_{0\text{ph}} = 230.94\,\text{V}$, $I_{0\text{ph}} = 10\,\text{A}$, $P_{0\text{ph}} = 333.33\,\text{W}$.
$\cos\phi_0 = \frac{333.33}{230.94 \times 10} = 0.1443$, $\phi_0 = 81.7^\circ$ lag.
Hence $\bar I_0 = 10\angle -81.7^\circ$ A.

**Blocked-rotor test**: $V_{\text{br}} = 150\,\text{V}$, $I_{\text{br}} = 40\,\text{A}$, $P_{\text{br}} = 4\,\text{kW}$.
Per phase: $V_{\text{br,ph}} = 150/\sqrt{3} = 86.60\,\text{V}$, $I_{\text{br,ph}} = 40\,\text{A}$, $P_{\text{br,ph}} = 1333.33\,\text{W}$.
$$
\begin{aligned}
Z_{\text{eq}} &= \frac{86.60}{40} = 2.165\,\Omega, \\
R_{\text{eq}} &= \frac{1333.33}{40^2} = 0.833\,\Omega, \\
X_{\text{eq}} &= \sqrt{2.165^2 - 0.833^2} = 1.998\,\Omega.
\end{aligned}
$$
Given stator and rotor copper losses equal, $R_1 = R_2' = R_{\text{eq}}/2 = 0.4167\,\Omega$.
The total leakage reactance $X_{\text{eq}}$ is used as is.

**Short-circuit current at rated voltage**:
$$
\begin{aligned}
I_{\text{sc}} &= I_{\text{br}} \times \frac{400}{150} = 40 \times \frac{400}{150} = 106.67\,\text{A},
\end{aligned}
$$
$\cos\phi_{\text{sc}} = \frac{4000}{\sqrt{3}\times 150\times 40} = 0.385$, $\phi_{\text{sc}} = 67.3^\circ$ lag.

**Circle diagram** (see Fig.):
1. Draw $OV$ vertically to represent $V_{\text{ph}}$.
2. From $O$ draw $\bar I_0$ to point $O'$.
3. From $O$ draw $\bar I_{\text{sc}} = 106.67\angle -67.3^\circ$ to point $A$.
4. The stator-current locus is a circle through $O'$ and $A$; its centre lies on the perpendicular bisector of $O'A$ and a line parallel to $OV$ at a distance $V_{\text{ph}}/(2X_{\text{eq}})$.
5. Torque line: divide $AA'$ in ratio $R_1:R_2' = 1:1$; output line is $O'$ joined to this division point.

![Circle diagram of induction motor](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**(a) Shaft power = 40 HP = 29.84 kW**
Constant losses: $P_{\text{const}} \approx P_0 - 3I_0^2 R_1 = 1000 - 3\times 10^2 \times 0.4167 = 875\,\text{W}$.
Maximum gross mechanical power occurs at $s_{mP} \approx 0.164$ (or where a line parallel to the output line is tangent to the circle). At this slip, gross $P_{\text{mech}} \approx 25.9\,\text{kW}$, giving a net shaft output $\approx 25.0\,\text{kW}$.
Since 29.84 kW exceeds this, **the motor cannot deliver 40 HP** - no valid operating point exists.

**(b) Maximum power input**
Maximum input occurs when $R_1 + R_2'/s = X_{\text{eq}}$:
$$
\begin{aligned}
s &= \frac{R_2'}{X_{\text{eq}} - R_1} = \frac{0.4167}{1.998 - 0.4167} = 0.2636.
\end{aligned}
$$
Then $|Z| = \sqrt{2}R_{\text{total}} = 2.826\,\Omega$, $I_2' = 230.94/2.826 = 81.7\,\angle -45^\circ$ A.
Total stator current: $\bar I_1 = \bar I_0 + \bar I_2' = 10\angle -81.7^\circ + 81.7\angle -45^\circ \approx 89.9\angle -48.8^\circ$ A.
Maximum power input:
$$
\begin{aligned}
P_{\text{in,max}} &= \sqrt{3}\,V_L I_L \cos\phi_1 = \sqrt{3}\times 400\times 89.9\times\cos 48.8^\circ \approx 41.0\,\text{kW}.
\end{aligned}
$$

> **Final answer:**
> (a) Motor cannot deliver 40 HP (max shaft output ≈ 25 kW).
> (b) Maximum power input ≈ 41.0 kW.


---

## Question 56
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 6A | EM-I ELE 205 End Sem, 04 December 2006

A 415 V, 40 HP, 50 Hz, δ connected induction motor gave the following test data: No-load test: 415 V, 21 A, 1250 W; Blocked rotor test: 100 V, 45 A, 2730 W. Stator copper losses is equal to rotor copper losses. Draw the circle diagram and determine, at rated output: (i) Line current and power factor (ii) Efficiency (iii) Slip (iv) Maximum output and maximum torque.

### Answer 56
Transform the delta motor to an equivalent star: phase voltage $V_{\text{ph}} = 415/\sqrt{3} = 239.6\,\text{V}$; line current equals phase current.

**No-load test** (line values): $V_0 = 415\,\text{V}$, $I_0 = 21\,\text{A}$, $P_0 = 1250\,\text{W}$.
Per phase: $V_{0\text{ph}} = 239.6\,\text{V}$, $I_{0\text{ph}} = 21\,\text{A}$, $P_{0\text{ph}} = 416.67\,\text{W}$.
$\cos\phi_0 = \frac{416.67}{239.6\times 21} = 0.0828$, $\phi_0 = 85.25^\circ$ lag.
$\bar I_0 = 21\angle -85.25^\circ$ A.

**Blocked-rotor test**: $V_{\text{br}} = 100\,\text{V}$, $I_{\text{br}} = 45\,\text{A}$, $P_{\text{br}} = 2730\,\text{W}$.
Per phase: $V_{\text{br,ph}} = 100/\sqrt{3} = 57.735\,\text{V}$, $I_{\text{br,ph}} = 45\,\text{A}$, $P_{\text{br,ph}} = 910\,\text{W}$.
$$
\begin{aligned}
Z_{\text{eq}} &= \frac{57.735}{45} = 1.283\,\Omega, \\
R_{\text{eq}} &= \frac{910}{45^2} = 0.4494\,\Omega, \\
X_{\text{eq}} &= \sqrt{1.283^2 - 0.4494^2} = 1.202\,\Omega.
\end{aligned}
$$
Stator and rotor copper losses equal: $R_1 = R_2' = R_{\text{eq}}/2 = 0.2247\,\Omega$; total $X_{\text{eq}} = 1.202\,\Omega$.

**Short-circuit current at rated voltage**:
$$
\begin{aligned}
I_{\text{sc}} &= I_{\text{br}} \times \frac{415}{100} = 45 \times 4.15 = 186.75\,\text{A},
\end{aligned}
$$
$\cos\phi_{\text{sc}} = \frac{2730}{\sqrt{3}\times 100\times 45} = 0.350$, $\phi_{\text{sc}} = 69.5^\circ$ lag.

**Circle diagram** (see Fig.):
1. Draw $OV$ vertically for $V_{\text{ph}}$.
2. $O'$ is the tip of $\bar I_0$.
3. $A$ is the tip of $\bar I_{\text{sc}} = 186.75\angle -69.5^\circ$.
4. The circle of stator-current passes through $O'$ and $A$; its centre lies on a line parallel to $OV$ at a distance $V_{\text{ph}}/(2X_{\text{eq}}) = 99.67\,\text{A}$.
5. Torque line: divide $AA'$ in ratio $R_1:R_2' = 1:1$; output line is $O'$ to this point.

![Circle diagram of induction motor](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Rated output = 40 HP = 29.84 kW**
Constant losses: $P_{\text{const}} = P_0 - 3 I_0^2 R_1 = 1250 - 3\times 21^2 \times 0.2247 = 953\,\text{W}$ ($\approx 317.7\,\text{W}$/phase).

Let full-load slip $s$. Using the approximate equivalent circuit, the mechanical power per phase is
$$
\begin{aligned}
P_{\text{mech,ph}} &= I_2'^2 R_2' \frac{1-s}{s}, \quad
I_2' = \frac{V_{\text{ph}}}{\sqrt{(R_1 + R_2'/s)^2 + X_{\text{eq}}^2}}.
\end{aligned}
$$
Shaft power per phase = $P_{\text{mech,ph}} - 317.7\,\text{W}$. Setting total shaft $= 29.84\,\text{kW}$ and solving for $s$ (or reading from the circle diagram) gives
$s \approx 0.371$ (3.71%).

At $s = 0.371$:
$R_2'/s = 0.2247/0.371 = 0.606\,\Omega$; total resistance $R = 0.2247 + 0.606 = 0.831\,\Omega$; $X_{\text{eq}} = 1.202\,\Omega$.
$|Z| = \sqrt{0.831^2 + 1.202^2} = 1.461\,\Omega$.
Rotor-branch current: $I_2' = 239.6/1.461 = 164.0\,\text{A}$, $\phi_2 = \arctan(1.202/0.831) = 55.4^\circ$ lag.
Stator current: $\bar I_1 = \bar I_0 + \bar I_2' = 21\angle -85.25^\circ + 164.0\angle -55.4^\circ \approx 182.5\angle -58.7^\circ$ A.
Line current: $I_L = 182.5\,\text{A}$ (star equivalent, so line = phase).
Power factor: $\cos\phi_1 = \cos 58.7^\circ = 0.521$ lag.
Input power: $P_{\text{in}} = \sqrt{3} \times 415 \times 182.5 \times 0.521 \approx 68.2\,\text{kW}$.
Efficiency: $\eta = \frac{29.84}{68.2} \times 100\% = 43.7\%$.

**Maximum output**
The slip for maximum shaft output is $s_{mP} \approx 0.149$. At this slip, gross mechanical power $\approx 49.7\,\text{kW}$; subtracting constant losses yields
$P_{\text{max out}} \approx 48.75\,\text{kW}$.

**Maximum torque**
Slip at maximum torque: $s_{mT} = \frac{R_2'}{\sqrt{R_1^2 + X_{\text{eq}}^2}} = \frac{0.2247}{\sqrt{0.2247^2 + 1.202^2}} = 0.184$.
With 4 poles ($n_s = 1500\,\text{rpm}$, $\omega_s = 157.08\,\text{rad/s}$):
$$
\begin{aligned}
T_{\max} &= \frac{3}{\omega_s} \cdot \frac{V_{\text{ph}}^2}{2\bigl(R_1 + \sqrt{R_1^2 + X_{\text{eq}}^2}\bigr)} \\
&= \frac{3}{157.08} \cdot \frac{239.6^2}{2(0.2247 + 1.2228)} \approx 378.8\,\text{N}\cdot\text{m}.
\end{aligned}
$$

> **Final answer:**
> (i) Line current = 182.5 A, power factor = 0.521 lag.
> (ii) Efficiency = 43.7 %.
> (iii) Slip = 0.371.
> (iv) Maximum shaft output = 48.75 kW, maximum torque = 378.8 N·m.


---

## Question 57
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3A | EM-I ELE 205 End Sem, 08 December 2007

A 415 V, 40 HP, 50 Hz δ connected induction motor gave the following test data: No-load test: 415 V, 21 A, 1250 W Blocked rotor test: 100 V, 45 A, 2730 W Stator copper losses are equal to rotor copper losses. Draw the circle diagram and determine (i) maximum output (ii) starting torque and (iii) maximum torque (iv) full load efficiency and slip (07)

### Answer 57
Convert the Δ-connected motor to an equivalent star: $V_{\text{ph}} = 415/\sqrt{3} = 239.6\,\text{V}$; the line current equals the phase current.

**No-load test** (line): $V_0 = 415\,\text{V}$, $I_0 = 21\,\text{A}$, $P_0 = 1250\,\text{W}$.
Per phase: $V_{0\text{ph}} = 239.6\,\text{V}$, $I_{0\text{ph}} = 21\,\text{A}$, $P_{0\text{ph}} = 416.67\,\text{W}$.
$\cos\phi_0 = \frac{416.67}{239.6\times 21} = 0.0828$, $\phi_0 = 85.25^\circ$ lag, $\bar I_0 = 21\angle -85.25^\circ$ A.

**Blocked-rotor test**: $V_{\text{br}} = 100\,\text{V}$, $I_{\text{br}} = 45\,\text{A}$, $P_{\text{br}} = 2730\,\text{W}$.
Per phase: $V_{\text{br,ph}} = 100/\sqrt{3} = 57.735\,\text{V}$, $I_{\text{br,ph}} = 45\,\text{A}$, $P_{\text{br,ph}} = 910\,\text{W}$.
$$
\begin{aligned}
Z_{\text{eq}} &= \frac{57.735}{45} = 1.283\,\Omega, \\
R_{\text{eq}} &= \frac{910}{45^2} = 0.4494\,\Omega, \\
X_{\text{eq}} &= \sqrt{1.283^2 - 0.4494^2} = 1.202\,\Omega.
\end{aligned}
$$
Equal copper losses: $R_1 = R_2' = 0.2247\,\Omega$.

**Short-circuit current at rated voltage**:
$$
\begin{aligned}
I_{\text{sc}} &= 45 \times \frac{415}{100} = 186.75\,\text{A},
\end{aligned}
$$
$\cos\phi_{\text{sc}} = \frac{2730}{\sqrt{3}\times 100\times 45} = 0.350$, $\phi_{\text{sc}} = 69.5^\circ$ lag.

**Circle diagram** (see Fig.):
1. Vertical $OV$ = $V_{\text{ph}}$.
2. $O'$: tip of $\bar I_0$.
3. $A$: tip of $\bar I_{\text{sc}} = 186.75\angle -69.5^\circ$.
4. The stator-current circle through $O'$ and $A$ has centre on a line parallel to $OV$ at a distance $V_{\text{ph}}/(2X_{\text{eq}}) = 99.67\,\text{A}$.
5. Torque line: divide $AA'$ in $R_1:R_2' = 1:1$; output line from $O'$.

![Circle diagram of induction motor](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Constant losses**: $P_{\text{const}} = P_0 - 3 I_0^2 R_1 = 1250 - 3\times 21^2 \times 0.2247 = 953\,\text{W}$ (≈ $317.7\,\text{W}$/phase).

**(i) Maximum output**
From the circle diagram (tangent parallel to output line) or analytically, maximum shaft output occurs at $s \approx 0.149$. Gross mechanical power $\approx 49.7\,\text{kW}$, net output $P_{\text{max out}} \approx 48.75\,\text{kW}$.

**(ii) Starting torque** (s = 1)
$$
\begin{aligned}
T_{\text{start}} &= \frac{3}{\omega_s} \cdot \frac{V_{\text{ph}}^2 R_2'}{(R_1+R_2')^2 + X_{\text{eq}}^2},\qquad \omega_s = \frac{2\pi\times 50\times 60}{4} = 157.08\,\text{rad/s}.
\end{aligned}
$$
$(R_1+R_2')^2 = 0.4494^2 = 0.202$, $X_{\text{eq}}^2 = 1.445$, sum $=1.647$.
$V_{\text{ph}}^2 R_2' = (239.6)^2 \times 0.2247 = 12\,900$.
$$
\begin{aligned}
T_{\text{start}} &= \frac{3}{157.08} \cdot \frac{12\,900}{1.647} \approx 149.7\,\text{N}\cdot\text{m}.
\end{aligned}
$$

**(iii) Maximum torque**
$$
\begin{aligned}
s_{mT} &= \frac{R_2'}{\sqrt{R_1^2 + X_{\text{eq}}^2}} = \frac{0.2247}{\sqrt{0.2247^2 + 1.202^2}} = 0.184.
\end{aligned}
$$
$$
\begin{aligned}
T_{\max} &= \frac{3}{\omega_s} \cdot \frac{V_{\text{ph}}^2}{2\bigl(R_1 + \sqrt{R_1^2 + X_{\text{eq}}^2}\bigr)} \\
&= \frac{3}{157.08} \cdot \frac{57\,408}{2(0.2247 + 1.2228)} \approx 378.8\,\text{N}\cdot\text{m}.
\end{aligned}
$$

**(iv) Full-load efficiency and slip** (rated output 40 HP = 29.84 kW)
Solving the mechanical power equation gives $s \approx 0.371$.
At this slip, $I_2' \approx 164.0\,\text{A}$, $I_1 \approx 182.5\,\text{A}$, $P_{\text{in}} \approx 68.2\,\text{kW}$, so
$\eta = \frac{29.84}{68.2} \times 100\% = 43.7\%$.

> **Final answer:**
> Maximum output ≈ 48.75 kW, starting torque ≈ 149.7 N·m, maximum torque ≈ 378.8 N·m, full-load efficiency ≈ 43.7 %, slip ≈ 0.371.

## Question 58
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 4A | EM-I ELE 205 End Sem, 26 November 2012

A 3 phase, 400V, 50 Hz, 6 pole star connected induction motor has the following test data: No load Test: 400V, 9 A, 1250 W (Line Value) Blocked Rotor test: 200V, 50A,6930 W (Line Value) Draw the circle diagram and obtain the values of operating power factor, slip and efficiency at rated current of 30 A. Assume stator and rotor copper losses to be equal. (06)

### Answer 58
**Given:** Star-connected, 400 V, 6-pole, 50 Hz.
No-load test (line): 400 V, 9 A, 1250 W.
Blocked-rotor test (line): 200 V, 50 A, 6930 W.
Rotor copper loss = stator copper loss at standstill.

**Per-phase values ($V_{ph}=400/\sqrt{3}=230.9$ V):**
- No-load: $I_0=9$ A, $P_{0,ph}=1250/3=416.7$ W.
- Blocked-rotor: $V_{br,ph}=200/\sqrt{3}=115.5$ V, $I_{br}=50$ A, $P_{br,ph}=6930/3=2310$ W.

**Equivalent circuit parameters (standstill):**
$R_{01}=\dfrac{P_{br,ph}}{I_{br}^2}=\dfrac{2310}{2500}=0.924\ \Omega$,
$Z_{01}=\dfrac{V_{br,ph}}{I_{br}}=\dfrac{115.5}{50}=2.31\ \Omega$,
$X_{01}=\sqrt{Z_{01}^2-R_{01}^2}=2.116\ \Omega$.
Since $R_1=R_2'$ and $X_1=X_2'$, we have $R_1=R_2'=0.462\ \Omega$, $X_1=X_2'=1.058\ \Omega$.

**No-load losses:**
No-load stator copper loss $=3\,I_0^2 R_1=3\times81\times0.462\approx112$ W.
Constant losses (core + friction & windage) $P_{const}=1250-112=1138$ W.

**Circle diagram data:**
- No-load p.f.: $\cos\phi_0=\dfrac{1250}{\sqrt{3}\cdot400\cdot9}=0.2005$, $\phi_0\approx78.5^\circ$ lag.
- Blocked-rotor p.f.: $\cos\phi_{sc}=\dfrac{6930}{\sqrt{3}\cdot200\cdot50}=0.4$, $\phi_{sc}\approx66.4^\circ$ lag.
- Short-circuit current at rated voltage: $I_{sc}=I_{br}\times\dfrac{400}{200}=100$ A.

Draw $V_{ph}$ horizontally.
Plot $OO'=I_0=9\angle{-78.5^\circ}$ (point $O'$).
Plot $OB=I_{sc}=100\angle{-66.4^\circ}$ (point $B$).
The circle is drawn through $O'$ and $B$; its centre lies on a line parallel to $V_{ph}$ through $O'$.
The output line connects $O'$ to the foot of the perpendicular from $B$ to the horizontal through $O'$.
The torque line joins $O'$ to the midpoint of that perpendicular (since $R_1=R_2'$).
Constant-loss line is drawn horizontally through $O'$.
Choose a current scale (say 1 cm = 5 A) and a power scale (e.g., 1 cm = ... W).

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Performance at rated line current 30 A:**
From $O$, draw an arc of radius 30 A; it meets the circle at point $P$.
- **Power factor:** $\cos\phi\approx0.874$ (angle between $OP$ and $V_{ph}$).
- **Slip:** $s=\dfrac{\text{rotor Cu loss}}{\text{air-gap power}}\approx0.05435$ (from vertical intercepts on diagram).
  Rotor speed $N_r=(1-s)\cdot\dfrac{120f}{p}=945.6$ rpm.
- **Input power:** $P_{in}=\sqrt{3}\,V_L I_L\cos\phi=\sqrt{3}\times400\times30\times0.874\approx18.16$ kW.
- **Output power:** $P_{out}=P_{in}-(I_1^2R_1\text{ loss}+P_{const})\approx14.03$ kW.
- **Efficiency:** $\eta=\dfrac{14.03}{18.16}\times100\approx77.3\%$.

> **Final answer:** At rated 30 A: $\cos\phi=0.874$ lag, $s=0.05435$, $\eta=77.3\%$.


---

## Question 59
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 4B | EM-I ELE 205 End Sem, 30 November 2010

A 3phase, δ connected, 25kW, 440V, 6 pole 50Hz, induction motor gave the following test data. No load test: 440V, 10A, 1300 W Blocked rotor test: 96V, 36A, 1600 W From the circle diagram for full load condition calculate the (i) line current (ii) power factor (iii) slip (iv) torque and (v) efficiency (vi) maximum output. The rotor copper loss is equal to stator copper loss at standstill. (07)

### Answer 59
**Given:** Δ-connected, 25 kW, 440 V, 6-pole, 50 Hz. No-load test: 440 V, 10 A, 1300 W. Blocked-rotor test: 96 V, 36 A, 1600 W. Rotor Cu loss = stator Cu loss at standstill.

**Per-phase quantities ($V_{ph}=440$ V):**
- No-load: $I_{0,ph}=10/\sqrt{3}=5.774$ A, $P_{0,ph}=1300/3=433.3$ W.
- Blocked-rotor: $V_{br,ph}=96$ V, $I_{br,ph}=36/\sqrt{3}=20.78$ A, $P_{br,ph}=1600/3=533.3$ W.

**Standstill impedance per phase:**
$R_{01}=P_{br,ph}/I_{br,ph}^2=533.3/20.78^2=1.235\ \Omega$
$Z_{01}=V_{br,ph}/I_{br,ph}=96/20.78=4.62\ \Omega$
$X_{01}=\sqrt{Z_{01}^2-R_{01}^2}=4.45\ \Omega$.
Equal loss division gives $R_1=R_2'=0.617\ \Omega$, $X_1=X_2'=2.225\ \Omega$.

**Constant losses:**
$I_{0,ph}^2 R_1=5.774^2\times0.617\approx20.6$ W/phase → total no-load stator Cu loss $=3\times20.6=61.8$ W.
$P_{const}=1300-61.8\approx1238$ W.

**Circle diagram:**
No-load p.f.: $\cos\phi_0=433.3/(440\times5.774)=0.1706$, $\phi_0\approx80.2^\circ$ lag.
Blocked-rotor p.f.: $\cos\phi_{sc}=1600/(\sqrt{3}\cdot96\cdot36)=0.267$, $\phi_{sc}\approx74.5^\circ$ lag.
Short-circuit current at rated voltage: $I_{sc}=36\times(440/96)=165$ A.

Draw $V_{ph}$ horizontally. Mark $O'$ for $I_0=5.774\angle{-80.2^\circ}$ and $B$ for $I_{sc}=165\angle{-74.5^\circ}$.
Draw the circle through $O'$ and $B$. Construct the output line and torque line (mid-point rule due to equal $R_1,R_2'$).

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Full-load (25 kW shaft) operation:**
Mechanical power required $=25\,000+1238=26\,238$ W.
On the diagram, raise a vertical from the output line such that the power intercept equals 26.24 kW (using the power scale). The intersection with the circle gives the full-load point $P$.
From $P$ we read or compute:

(i) **Line current:** $OP$ corresponds to stator phase current $I_{1,ph}\approx24.6$ A → $I_{L}=\sqrt{3}\times24.6=42.5$ A.
(ii) **Power factor:** $\cos\phi\approx0.904$ lag.
(iii) **Slip:** $s=\dfrac{\text{rotor Cu loss}}{\text{air-gap power}}\approx0.0323$ → rotor speed $N_r\approx968$ rpm.
(iv) **Torque:** Shaft torque $T_{sh}=\dfrac{25\,000}{2\pi\cdot968/60}\approx247$ N·m.
(v) **Efficiency:** $P_{in}=\sqrt{3}\times440\times42.5\times0.904\approx29.3$ kW, $\eta=25/29.3\times100\approx85.4\%$.
(vi) **Maximum output:** The tangent parallel to the output line touches the circle at the maximum mechanical power point. The corresponding slip is $s_{mP}\approx0.118$, $P_{mech,max}\approx49.6$ kW. Net maximum output $=49.6-1.24\approx48.4$ kW.

> **Final answer:** Full-load (25 kW): $I_{L}=42.5$ A, $\cos\phi=0.904$ lag, $s=0.0323$, $T_{sh}=247$ N·m, $\eta=85.4\%$, $P_{out,max}=48.4$ kW.


---

## Question 60
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 5B | EM-I ELE 205 Makeup, 05 January 2015

Draw the sketch of circle diagram of an Induction motor and define various phasors involved in it. Identify the length representing the starting torque. Justify your statement. 4

### Answer 60
The circle diagram (Heyland diagram) graphically represents the performance of a three-phase induction motor over its entire slip range using no-load and blocked-rotor test data.

**Phasors and construction** (see figure):
- The stator voltage per phase $V_1$ is drawn horizontally as the reference.
- $OA$ = no-load current $I_0$, lagging $V_1$ by the no-load power-factor angle $\phi_0$.
- $OB$ = short-circuit current $I_{sc}$ (blocked-rotor current corrected to rated voltage), lagging by $\phi_{sc}$.
- The circle is drawn through $A$ and $B$ with its centre found by the usual geometric rule.
For any operating point $P$ on the circle:
- $OP$ = stator input current $I_1$.
- $AP$ = rotor current referred to stator, $I_2'$.

The diagram also contains three important reference lines:
- **Constant-loss line**: a horizontal line through $A$ representing the fixed no-load losses (core + friction).
- **Torque line**: a line such that the vertical distance from $P$ to this line is proportional to the air-gap power $P_{ag}$.
- **Output line**: a line such that the vertical distance from $P$ to this line represents the mechanical power developed.

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Starting torque identification:**
At starting $s=1$, the operating point coincides with the blocked-rotor point $B$.
From $B$ drop a vertical to meet the torque line at $T_B$. The length $BT_B$ is proportional to the air-gap power at standstill, $P_{ag}|_{s=1}$.
Since electromagnetic torque $T_{em}=P_{ag}/\omega_s$ (where $\omega_s$ is synchronous angular speed), it follows that
$$
T_{start} \propto BT_B .
$$
Thus $BT_B$ directly represents the starting torque on the diagram.

> **Final answer:** The length $BT_B$ - the vertical intercept between the blocked-rotor point $B$ and the torque line - represents the starting torque, because it is proportional to the air-gap power at $s=1$ and therefore to the starting torque.


---

## Question 61
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 5A | EM-I ELE 205 Makeup, 05 January 2016

A 3 phase, 400V, 50 Hz, 6 pole star connected induction motor has the 6M following test data: No load Test: 400V, 9 A, 1250 W (Line Value) Blocked Rotor test: 200V, 50A,6930 W (Line Value) Draw the circle diagram and obtain the values of operating power factor, slip and efficiency at rated current of 30 A.Assume stator and rotor copper losses to be equal.

### Answer 61
Given: Star-connected, $400\,\text{V}$, $50\,\text{Hz}$, $6$-pole → $N_s = 120\times50/6 = 1000\,\text{rpm}$.

**No-load test** (line values: $400\,\text{V}$, $9\,\text{A}$, $1250\,\text{W}$)
Per phase: $V_{ph}=400/\sqrt{3}=230.94\,\text{V}$, $I_0=9\,\text{A}$, $P_{0,ph}=1250/3=416.67\,\text{W}$.
$\cos\phi_0 = 1250/(\sqrt{3}\times400\times9)=0.2$, $\phi_0\approx78.5^\circ$ lag.

**Blocked-rotor test** (line: $200\,\text{V}$, $50\,\text{A}$, $6930\,\text{W}$)
Per phase: $V_{br,ph}=200/\sqrt{3}=115.47\,\text{V}$, $I_{br}=50\,\text{A}$, $P_{br,ph}=6930/3=2310\,\text{W}$.
$\cos\phi_{sc}=6930/(\sqrt{3}\times200\times50)=0.4$, $\phi_{sc}\approx66.4^\circ$ lag.
Rated-voltage short-circuit current: $I_{sc}=50\times400/200=100\,\text{A}$ at $\phi_{sc}$.

**Circle diagram construction**
1. Choose scale $1\,\text{cm}=1\,\text{A}$. Draw voltage $\overline{V}_1$ horizontally.
2. Plot no-load point $A$: $\overline{OA}=9\angle{-78.5^\circ}\,\text{A}$.
3. Plot rated-voltage short-circuit point $B$: $\overline{OB}=100\angle{-66.4^\circ}\,\text{A}$.
4. The circle passes through $A$ and $B$; its centre lies on the horizontal line through $A$ (constant-loss line). Since $R_1=R_2'$, the torque line halves the total copper-loss segment; the output line is parallel, offset by constant losses.

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

**Operation at $I_L = 30\,\text{A}$** (phase current in star).
The $30\,\text{A}$ arc cuts the circle at $P$.
- Power factor: $\cos\phi_P\approx0.874$ lag.
- Slip from slip line: $s\approx0.05435$.
- Input power: $P_{in}\approx\sqrt{3}\times400\times30\times0.874=18.18\,\text{kW}$.
- Output power from diagram: $P_{out}\approx14.03\,\text{kW}$.
- Efficiency: $\eta=14.03/18.18\approx0.772$ ($77.2\%$).
- Speed: $N=N_s(1-s)=1000(1-0.05435)\approx945.7\,\text{rpm}$.

> **Final answer:** $s \approx 0.05435$, pf $\approx 0.874$ lag, efficiency $\approx 77.2\%$, speed $\approx 945.7$ rpm.


---

## Question 62
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 6B | EM-I ELE 205 Makeup, 08 January 2008

A 6 HP, 220 V, 50 Hz, 6 pole, 3 phase δ connected Induction motor gave the following test data No Load Test: 220 V (L-L) 6A 475 W Blocked Rotor Test: 110 V (L-L) 27 A 1930 W Calculate from circle diagram for full load condition the line current, PF, torque, Slip and efficiency. Stator copper loss at stand still is twice the rotor copper loss. (06)

### Answer 62
Given: $\Delta$-connected, $220\,\text{V}$, $50\,\text{Hz}$, $6$-pole → $N_s=1000\,\text{rpm}$. Rated $6\,\text{HP}=4476\,\text{W}$.

**No-load test** (line values: $220\,\text{V}$, $6\,\text{A}$, $475\,\text{W}$)
Per phase: $V_{ph}=220\,\text{V}$, $I_{0,ph}=6/\sqrt{3}=3.464\,\text{A}$, $P_{0,ph}=475/3=158.33\,\text{W}$.
$\cos\phi_0=475/(\sqrt{3}\times220\times6)=0.208$, $\phi_0\approx78.0^\circ$ lag.

**Blocked-rotor test** (line: $110\,\text{V}$, $27\,\text{A}$, $1930\,\text{W}$)
Per phase: $V_{br,ph}=110\,\text{V}$, $I_{br,ph}=27/\sqrt{3}=15.588\,\text{A}$, $P_{br,ph}=1930/3=643.33\,\text{W}$.
$\cos\phi_{sc}=1930/(\sqrt{3}\times110\times27)=0.404$, $\phi_{sc}\approx66.2^\circ$ lag.
Rated-voltage short-circuit current per phase: $I_{sc,ph}=15.588\times(220/110)=31.176\,\text{A}$.

Total equivalent resistance: $R_{01}=P_{br,ph}/I_{br,ph}^2=643.33/(15.588^2)=2.647\,\Omega$.
Stator Cu at standstill = $2\times$ rotor Cu → $R_1=2R_2'$, $R_{01}=R_1+R_2'=3R_2'$ ⇒ $R_2'=0.8823\,\Omega$, $R_1=1.7647\,\Omega$.
Constant losses: no-load stator Cu loss = $3\times I_{0,ph}^2 R_1 = 3\times(3.464^2)\times1.7647\approx63.5\,\text{W}$ → $P_{const}=475-63.5=411.5\,\text{W}$.

**Circle diagram**
- Use current scale $1\,\text{cm}=2\,\text{A}$.
- Draw $\overline{V}_1$ horizontally; $A$ at $3.464\,\text{A}$ ($1.73\,\text{cm}$) at $78^\circ$ lag; $B$ at $31.176\,\text{A}$ ($15.59\,\text{cm}$) at $66.2^\circ$ lag.
- Centre on horizontal through $A$; draw circle, torque line (divide copper-loss segment in ratio $R_1:R_2'=2:1$), output line (parallel, offset by constant losses).
- Full-load output $4476\,\text{W}$ ($1492\,\text{W/phase}$) gives the operating point $P$ where a line parallel to the torque line at the power distance intersects the circle.

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

From the diagram, after scaling to absolute values:
- Phase current $I_{ph}\approx30.1\,\text{A}$ → line current $I_L=\sqrt{3}\times30.1\approx52.15\,\text{A}$.
- Power factor $\cos\phi_P\approx0.56$ lag.
- Slip $s\approx0.282$.
- Air-gap power $P_{ag}$ → developed torque $T_{dev}=P_{ag}/\omega_s$ with $\omega_s=2\pi\times1000/60\approx104.72\,\text{rad/s}$ → $T_{dev}\approx65.0\,\text{N}\cdot\text{m}$.
- Shaft torque $T_{sh}=P_{out}/\omega_m$, $\omega_m=(1-s)\omega_s\approx75.16\,\text{rad/s}$ → $T_{sh}\approx59.5\,\text{N}\cdot\text{m}$.
- Efficiency $\eta=P_{out}/P_{in}=4476/(\sqrt{3}\times220\times52.15\times0.56)\approx0.402$ ($40.2\%$).

> **Final answer:** $I_L \approx 52.15\,\text{A}$, pf $0.56$ lag, slip $0.282$, speed $\approx 718\,\text{rpm}$, $T_{dev}\approx 65.0\,\text{N}\cdot\text{m}$, $T_{sh}\approx 59.5\,\text{N}\cdot\text{m}$, efficiency $\approx 40.2\%$.


---

## Question 63
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 4C | EM-I ELE 2103 End Sem, 27 November 2018

A 3-phase, 400 V, 50 Hz, star-connected induction motor gave the following test results (line values): No load test: 400 V, 10 A, 1.4 kW Blocked rotor test: 150 V, 40 A, 4.2 kW Construct the circle diagram to obtain the efficiency and speed of the motor when it draws 35 A. Scale: 1 cm=5 A. Assume rotor copper losses to be same as stator copper losses. (05)

### Answer 63
Given: Star-connected, $400\,\text{V}$, $50\,\text{Hz}$. (A 4-pole machine is typical; we assume $N_s=1500\,\text{rpm}$.) Scale $1\,\text{cm}=5\,\text{A}$.

**No-load test** (line values: $400\,\text{V}$, $10\,\text{A}$, $1.4\,\text{kW}$)
Per phase: $V_{ph}=400/\sqrt{3}=230.94\,\text{V}$, $I_0=10\,\text{A}$, $P_{0,ph}=1400/3=466.67\,\text{W}$.
$\cos\phi_0=1400/(\sqrt{3}\times400\times10)=0.202$, $\phi_0\approx78.3^\circ$ lag.

**Blocked-rotor test** (line: $150\,\text{V}$, $40\,\text{A}$, $4.2\,\text{kW}$)
Per phase: $V_{br,ph}=150/\sqrt{3}=86.60\,\text{V}$, $I_{br}=40\,\text{A}$, $P_{br,ph}=4200/3=1400\,\text{W}$.
$\cos\phi_{sc}=4200/(\sqrt{3}\times150\times40)=0.404$, $\phi_{sc}\approx66.2^\circ$ lag.
Rated-voltage short-circuit current: $I_{sc}=40\times400/150=106.67\,\text{A}$.

Assuming $R_1=R_2'$, total resistance $R_{01}=P_{br,ph}/I_{br}^2=1400/40^2=0.875\,\Omega$ ⇒ $R_1=R_2'=0.4375\,\Omega$.
No-load stator Cu loss $=3\times I_0^2 R_1=3\times100\times0.4375=131.25\,\text{W}$. Constant loss $=1400-131.25=1268.75\,\text{W}$.

**Circle diagram**
- No-load point $A$: $10\,\text{A}=2\,\text{cm}$ at $78.3^\circ$ lag.
- Short-circuit point $B$ (rated voltage): $106.67\,\text{A}\approx21.33\,\text{cm}$ at $66.2^\circ$ lag.
- Draw circle; torque line halves the total copper-loss segment; output line is parallel, shifted by constant losses.

![Circle diagram](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

Operation at $I_L=35\,\text{A}$ (7 cm on scale):
- From diagram: $\cos\phi\approx0.876$ lag.
- Slip $s\approx0.0678$.
- Input power $P_{in}=\sqrt{3}\times400\times35\times0.876\approx21.25\,\text{kW}$.
- Total losses (Cu + core/friction) $\approx3.94\,\text{kW}$ → $P_{out}\approx17.31\,\text{kW}$.
- Efficiency $\eta=17.31/21.25\approx0.815$ ($81.5\%$).
- Speed $N=N_s(1-s)=1500(1-0.0678)\approx1398\,\text{rpm}$.

> **Final answer:** pf $\approx 0.876$ lag, efficiency $\approx 81.5\%$, speed $\approx 1398\,\text{rpm}$.


---

## Question 64
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3C | EM-I ELE 2123 End Sem, 05 December 2023

A 4kW, 400V, 50Hz, 3 phase, 4 pole δ connected induction motor has stator 4 resistance of 0.36 Ω per phase and rotor resistance of 0.06 Ω per phase. The no load and blocked rotor test data are as follows: No load test: 400 V, 3.3 A, p.f =0.174 Blocked rotor test: 210V, 16A, p.f =0.45 Estimate the single-phase equivalent circuit of the induction motor.

### Answer 64
**Given**: 4 kW, 400 V, 3-phase, 4-pole, delta-connected induction motor. Stator resistance $R_1 = 0.36\ \Omega$ per phase. No-load test: $V_0 = 400\ \text{V}$, $I_0 = 3.3\ \text{A}$, $\text{pf}_0 = 0.174$. Blocked-rotor test: $V_{sc} = 210\ \text{V}$, $I_{sc} = 16\ \text{A}$, $\text{pf}_{sc} = 0.45$. For delta connection, phase voltage $V_{\text{ph}} = V_L$, phase current $I_{\text{ph}} = I_L/\sqrt{3}$. We compute per-phase quantities.

**No-load test**:
$$
\begin{aligned}
V_{\text{ph},0} &= 400\ \text{V}, \quad I_{0,\text{ph}} = \frac{3.3}{\sqrt{3}} \approx 1.905\ \text{A} \\
P_0 &= \sqrt{3} \times 400 \times 3.3 \times 0.174 \approx 398\ \text{W} \quad (\text{total}) \\
P_{0,\text{ph}} &= 398/3 \approx 132.7\ \text{W} \\
I_w &= \frac{P_{0,\text{ph}}}{V_{\text{ph},0}} = \frac{132.7}{400} \approx 0.332\ \text{A} \\
I_m &= \sqrt{I_{0,\text{ph}}^2 - I_w^2} = \sqrt{1.905^2 - 0.332^2} \approx 1.876\ \text{A} \\
R_c &= \frac{400}{0.332} \approx 1206\ \Omega, \quad X_m = \frac{400}{1.876} \approx 213\ \Omega
\end{aligned}
$$

**Blocked-rotor test**:
$$
\begin{aligned}
V_{\text{ph},\text{sc}} &= 210\ \text{V}, \quad I_{\text{ph},\text{sc}} = \frac{16}{\sqrt{3}} \approx 9.238\ \text{A} \\
P_{\text{sc}} &= \sqrt{3} \times 210 \times 16 \times 0.45 \approx 2619\ \text{W} \quad (\text{total}) \\
P_{\text{sc},\text{ph}} &= 2619/3 \approx 873\ \text{W} \\
R_{01} &= \frac{873}{9.238^2} \approx 10.23\ \Omega, \quad Z_{01} = \frac{210}{9.238} \approx 22.73\ \Omega \\
X_{01} &= \sqrt{22.73^2 - 10.23^2} \approx 20.30\ \Omega
\end{aligned}
$$
Given $R_1 = 0.36\ \Omega$, referred rotor resistance $R_2' = R_{01} - R_1 = 9.87\ \Omega$. Assuming equal stator and rotor leakage reactances, $X_1 = X_2' = X_{01}/2 = 10.15\ \Omega$.

**Equivalent circuit** (Figure below):
![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final answer:** Per-phase stator-referred parameters: magnetizing branch $R_c = 1206\ \Omega$, $X_m = 213\ \Omega$; stator series $R_1 = 0.36\ \Omega$, $X_1 = 10.15\ \Omega$; rotor referred $R_2' = 9.87\ \Omega$, $X_2' = 10.15\ \Omega$.


---

## Question 65
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3B | EM-I ELE 2123 End Sem, 25 November 2024

A 3-phase, 400 V, 3.7 kW, 7.5 A, 945 rpm, δ connected squirrel cage induction 4 motor has per phase stator resistance of 5 Ω. This motor is subjected to no-load and blocked-rotor tests. The test results are: No load test: 400 V, 3.25 A, 232 W Blocked rotor test: 92 V, 7.5 A, 650 W a) Determine the parameters of its approximate equivalent circuit. b) Draw and label the approximate equivalent circuit referred to stator.

### Answer 65
**Given:**

Motor: 3-phase, 400 V, 3.7 kW, 7.5 A, 945 rpm, Δ-connected, stator resistance per phase $R_1 = 5\,\Omega$.

No-load test (NL): $V_0 = 400\,\text{V}$ (line), $I_0 = 3.25\,\text{A}$ (line), $P_0 = 232\,\text{W}$ (total).

Blocked-rotor test (BR): $V_{br} = 92\,\text{V}$ (line), $I_{br} = 7.5\,\text{A}$ (line), $P_{br} = 650\,\text{W}$ (total).

**(a) Approximate equivalent circuit parameters**

**Per-phase values (Δ connection: $V_{ph} = V_{\text{line}}$, $I_{ph} = I_{\text{line}}/\sqrt{3}$):**

- NL: $V_{0,ph}=400\,\text{V}$, $I_{0,ph}=3.25/\sqrt{3}=1.876\,\text{A}$, $P_{0,ph}=232/3=77.33\,\text{W}$.
- BR: $V_{br,ph}=92\,\text{V}$, $I_{br,ph}=7.5/\sqrt{3}=4.330\,\text{A}$, $P_{br,ph}=650/3=216.67\,\text{W}$.

**No-load test:**
At $s\to0$, rotor branch is open. Neglecting the small stator impedance drop, the magnetising branch ($R_c \parallel X_m$) is directly across the supply.

$$
\begin{aligned}
R_c &= \frac{V_{0,ph}^2}{P_{0,ph}} = \frac{400^2}{77.33} \approx 2069\,\Omega \\[4pt]
I_w &= \frac{V_{0,ph}}{R_c} = \frac{400}{2069} \approx 0.193\,\text{A} \\[4pt]
I_m &= \sqrt{I_{0,ph}^2 - I_w^2} = \sqrt{1.876^2 - 0.193^2} \approx 1.865\,\text{A} \\[4pt]
X_m &= \frac{V_{0,ph}}{I_m} = \frac{400}{1.865} \approx 214.4\,\Omega .
\end{aligned}
$$

**Blocked-rotor test:**
At $s=1$, magnetising branch is neglected because $X_m \gg X_1,X_2'$. The equivalent impedance per phase is the series combination of $R_1$, $X_1$, $R_2'$, $X_2'$.

$$
\begin{aligned}
R_{01} &= \frac{P_{br,ph}}{I_{br,ph}^2} = \frac{216.67}{4.330^2} \approx 11.56\,\Omega \\[4pt]
Z_{01} &= \frac{V_{br,ph}}{I_{br,ph}} = \frac{92}{4.330} \approx 21.25\,\Omega \\[4pt]
X_{01} &= \sqrt{Z_{01}^2 - R_{01}^2} = \sqrt{21.25^2 - 11.56^2} \approx 17.82\,\Omega .
\end{aligned}
$$

Given $R_1 = 5\,\Omega$, the referred rotor resistance is
$$
R_2' = R_{01} - R_1 = 11.56 - 5 = 6.56\,\Omega .
$$

For a squirrel-cage motor, it is usual to assume equal leakage reactances:
$$
X_1 = X_2' = \frac{X_{01}}{2} = \frac{17.82}{2} = 8.91\,\Omega .
$$

**(b) Approximate equivalent circuit referred to stator**

The circuit places the magnetising branch ($R_c \parallel X_m$) directly across the stator terminals, followed in series by $R_1$, $X_1$, and then the rotor branch consisting of $R_2'/s$ in series with $X_2'$. This is shown in Figure 1.

![Simplified equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final answer:** $R_c \approx 2069\,\Omega$, $X_m \approx 214.4\,\Omega$, $R_1 = 5\,\Omega$, $X_1 = 8.91\,\Omega$, $R_2' = 6.56\,\Omega$, $X_2' = 8.91\,\Omega$ (all values per phase, referred to stator).


---

## Question 66
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3B | EM-I ELE 2154 Makeup/GI, 28 July 2021

From the following test data given for a three phase 100HP, 3.3kV, 27A, 6pole 50Hz squirrel cage induction motor with star connected stator, develop the approximate equivalent circuit of the machine referred to stator side. No Load test (line values): 3.3kV, 6A, 24kW Blocked Rotor test (line values): 400V, 25A, 14kW DC resistance per phase: 3.75Ω. Also, Explain the reason why the rotor is blocked in the blocked-rotor test? (06)

### Answer 66
**Given:** 3-phase, 100 HP, 3.3 kV, 27 A, 6-pole, 50 Hz, star-connected squirrel-cage IM.
No-load test (line): 3.3 kV, 6 A, 24 kW.
Blocked-rotor test (line): 400 V, 25 A, 14 kW.
DC resistance per phase: $3.75\,\Omega$.

**Solution:**

**1. Phase quantities** (star connection):
$$
V_{\text{ph}} = \frac{V_L}{\sqrt{3}} = \frac{3300}{\sqrt{3}} \approx 1905\ \text{V}.
$$

**2. No-load test** (per phase):
$$
P_{0,\text{ph}} = \frac{24\,\text{kW}}{3} = 8\ \text{kW},\quad I_{0,\text{ph}}=6\ \text{A}.
$$
Power factor:
$$
\cos\phi_0 = \frac{P_0}{\sqrt{3}\,V_L I_L} = \frac{24000}{\sqrt{3}\times3300\times6} = 0.7.
$$
Active (core-loss) current: $I_w = I_0\cos\phi_0 = 6\times0.7 = 4.2\ \text{A}$.
Magnetising current: $I_m = \sqrt{I_0^2 - I_w^2} = \sqrt{6^2 - 4.2^2} \approx 4.29\ \text{A}$.
Magnetising branch parameters (referred to stator):
$$
R_0 = \frac{V_{\text{ph}}}{I_w} = \frac{1905}{4.2} \approx 454\ \Omega,\qquad
X_m = \frac{V_{\text{ph}}}{I_m} = \frac{1905}{4.29} \approx 444\ \Omega.
$$

**3. Blocked-rotor test** (per phase):
$$
V_{\text{br,ph}} = \frac{400}{\sqrt{3}} \approx 230.94\ \text{V},\quad
I_{\text{br,ph}} = 25\ \text{A},\quad
P_{\text{br,ph}} = \frac{14\,\text{kW}}{3} \approx 4.667\ \text{kW}.
$$
Total series impedance, resistance and reactance:
$$
\begin{aligned}
Z_{\text{eq}} &= \frac{230.94}{25} \approx 9.24\ \Omega,\\[2pt]
R_{\text{eq}} &= \frac{4667}{25^2} \approx 7.47\ \Omega,\\[2pt]
X_{\text{eq}} &= \sqrt{9.24^2 - 7.47^2} \approx 5.44\ \Omega.
\end{aligned}
$$

**4. Separating stator and rotor constants:**
- Stator resistance (from DC test): $R_1 = 3.75\ \Omega$.
- Referred rotor resistance: $R_2' = R_{\text{eq}} - R_1 = 7.47 - 3.75 \approx 3.72\ \Omega$.
- For squirrel-cage motor, stator and rotor leakage reactances cannot be separated; they are assumed equal:
  $$
  X_1 = X_2' = \frac{X_{\text{eq}}}{2} = \frac{5.44}{2} \approx 2.72\ \Omega.
  $$

**5. Approximate equivalent circuit (per phase, referred to stator):**

![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

The magnetising branch ($R_0$, $X_m$) is placed across the stator terminals, followed by stator impedance ($R_1$, $X_1$) and referred rotor impedance ($R_2'$, $X_2'$).

**6. Why block the rotor?**
Blocking holds the rotor at standstill ($s=1$), so the rotor frequency equals the supply frequency. The rotor leakage reactance therefore retains its normal standstill value. The machine behaves exactly like a transformer with a short-circuited secondary, allowing the total series impedance ($R_{\text{eq}}$, $X_{\text{eq}}$) to be measured safely at a reduced voltage. No mechanical output is produced, and the reduced voltage limits the current to a safe level while still yielding accurate parameters.

> **Final answer:** Equivalent circuit parameters: $R_0 \approx 454\ \Omega$, $X_m \approx 444\ \Omega$, $R_1 = 3.75\ \Omega$, $R_2' \approx 3.72\ \Omega$, $X_1 = X_2' \approx 2.72\ \Omega$. The rotor is blocked to set $s=1$, making the motor behave as a short-circuit transformer and enabling convenient measurement of the series impedances.


---

## Question 67
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 2A | EM-I ELE 2154 Online End Sem, 27 January 2022

The following test results were obtained on a 3-phase, 75kW, 3.3kV, 6-Pole, 50Hz, δ-connected three-phase squirrel cage induction motor. Determine the parameters of the approximated equivalent circuit. No-load Test: 3.3kV, 5A and 2500W Blocked rotor Test: 400V, 27A, and 15000W (04)

### Answer 67
**Given:** 3-phase, 75 kW, 3.3 kV, 6-pole, 50 Hz, Δ-connected squirrel cage induction motor.

**No-load test:**
- $V_L = 3.3\; \text{kV}$, $V_{ph} = V_L = 3300\ \text{V}$.
- $I_L = 5\; \text{A}$, $I_{0,ph} = 5/\sqrt{3} = 2.887\ \text{A}$.
- $P_0 = 2500\ \text{W}$ total, $P_{0,ph} = 833.33\ \text{W}$ per phase.

Neglecting stator copper loss at no load, the core loss resistance is
$$
R_c = \frac{V_{ph}^2}{P_{0,ph}} = \frac{3300^2}{833.33} = 13068\ \Omega \approx 13.07\ \text{k}\Omega.
$$
Iron-loss current $I_w = V_{ph}/R_c = 0.252\ \text{A}$.
Magnetising current $I_m = \sqrt{I_{0,ph}^2 - I_w^2} = 2.876\ \text{A}$.
Hence magnetising reactance
$$
X_m = \frac{V_{ph}}{I_m} = \frac{3300}{2.876} = 1147\ \Omega \approx 1.147\ \text{k}\Omega.
$$

**Blocked-rotor test:**
- Applied line voltage $V_{br,L}=400\ \text{V}$, so $V_{br,ph}=400\ \text{V}$.
- $I_{br,L}=27\ \text{A}$, $I_{br,ph}=27/\sqrt{3}=15.59\ \text{A}$.
- $P_{br}=15000\ \text{W}$, $P_{br,ph}=5000\ \text{W}$ per phase.

Equivalent impedance referred to stator:
$$
Z_{01} = \frac{V_{br,ph}}{I_{br,ph}} = \frac{400}{15.59} = 25.66\ \Omega.
$$
Resistance:
$$
R_{01} = \frac{P_{br,ph}}{I_{br,ph}^2} = \frac{5000}{15.59^2} = 20.56\ \Omega.
$$
Reactance:
$$
X_{01} = \sqrt{Z_{01}^2 - R_{01}^2} = \sqrt{25.66^2 - 20.56^2} = 15.36\ \Omega.
$$

Since no DC test is available, we assume equal stator and rotor resistances and leakage reactances:
$$
R_1 = R_2' = R_{01}/2 = 10.28\ \Omega, \quad
X_1 = X_2' = X_{01}/2 = 7.68\ \Omega.
$$

All parameters are per phase and referred to the stator side. The approximate equivalent circuit is shown in Figure 1.

![Approximate equivalent circuit of induction motor](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final answer:** $R_c \approx 13.07\ \text{k}\Omega$, $X_m \approx 1.147\ \text{k}\Omega$, $R_1 = R_2' \approx 10.28\ \Omega$, $X_1 = X_2' \approx 7.68\ \Omega$.


---

## Question 68
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 7B | EM-I ELE 205 End Sem, 04 December 2006

Show that a single phase current in a single phase winding produces only a pulsating magnetic field.

### Answer 68
**Concept:** A single-phase stator winding excited by an AC current produces an MMF that is sinusoidally distributed in space and pulsates in time.

**MMF Equation:** Consider a single-phase winding with its axis along the reference angle $\theta=0$. The instantaneous current is $i(t)=I_m\cos(\omega t)$. The MMF at any angular position $\theta$ is
$$
F(\theta,t) = F_m \cos\theta \cos(\omega t),
$$
where $F_m$ is the peak MMF proportional to the winding turns and current amplitude.

**Decomposition:** Using the identity $\cos A \cos B = \tfrac{1}{2}[\cos(A-B) + \cos(A+B)]$, we write
$$
\begin{aligned}
F(\theta,t) &= \frac{F_m}{2} \cos(\theta - \omega t) + \frac{F_m}{2} \cos(\theta + \omega t).
\end{aligned}
$$
The first term, $\frac{F_m}{2}\cos(\theta-\omega t)$, represents a travelling wave that moves in the positive $\theta$ direction at synchronous speed $\omega_s = \omega$. The second term, $\frac{F_m}{2}\cos(\theta+\omega t)$, is an identical wave travelling in the negative $\theta$ direction.

**Physical Interpretation:** At any fixed point in the air gap, the two waves add algebraically. Because they have equal amplitudes and travel in opposite directions, their resultant is a standing wave-the amplitude oscillates sinusoidally at the supply frequency. The spatial distribution $\cos\theta$ remains fixed; no rotation occurs. Therefore, the magnetic field simply pulsates in magnitude along the winding axis and does not rotate. This is why a single-phase induction motor produces no starting torque; at standstill, the forward and backward torques cancel exactly.

**Conclusion:** A single-phase current in a single-phase winding produces only a pulsating magnetic field, mathematically equivalent to the sum of two counter-rotating fields of equal magnitude.

> **Final answer:** A single-phase current in a single-phase winding produces only a pulsating magnetic field, which may be decomposed into two equal contra-rotating travelling waves; no net rotation occurs.


---

## Question 69
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 5C | EM-I ELE 205 End Sem, 30 November 2010

A 240V, 50Hz, 2 pole single phase induction motor has the following equivalent circuit impedances: r1=2.2Ω, r2'=3.8Ω, x1=3Ω, x2'=2.1Ω, xm=86Ω. Friction, windage and core losses=50W. Calculate input current, power factor, output power and efficiency at a full load speed of 2820RPM. (05)

### Answer 69
**Given:** 240 V, 50 Hz, 2-pole single-phase induction motor. $R_1 = 2.2\ \Omega$, $R_2' = 3.8\ \Omega$, $X_1 = 3\ \Omega$, $X_2' = 2.1\ \Omega$, $X_m = 86\ \Omega$. Rotational losses $P_{\text{rot}} = 50\ \text{W}$.

**Synchronous speed and slip:**
$N_s = \frac{120f}{P} = \frac{120\times 50}{2} = 3000\ \text{rpm}$. Full-load speed $N = 2820\ \text{rpm}$ $\Rightarrow$ slip $s = \frac{3000-2820}{3000} = 0.06$.

**Double-revolving-field circuit:**
The single-phase motor is analysed by splitting the pulsating field into a forward component (rotor slip $s$) and a backward component (rotor slip $2-s$). The per-phase equivalent circuit contains two parallel branches:

Forward branch ($s = 0.06$):
$$
R_{f,\text{ser}} = \frac{R_2'}{2s} = \frac{3.8}{2\times 0.06} = 31.667\ \Omega,\quad
X_{f,\text{ser}} = \frac{X_2'}{2} = 1.05\ \Omega,
$$
magnetising reactance $X_{m,f} = X_m/2 = 43\ \Omega$.
Its equivalent impedance
$$
Z_f = \frac{j43\,(31.667 + j1.05)}{31.667 + j44.05} = 19.89 + j15.33\ \Omega.
$$

Backward branch ($2-s = 1.94$):
$$
R_{b,\text{ser}} = \frac{R_2'}{2(2-s)} = \frac{3.8}{3.88} = 0.9794\ \Omega,\quad
X_{b,\text{ser}} = 1.05\ \Omega,
$$
$$
Z_b = \frac{j43\,(0.9794 + j1.05)}{0.9794 + j44.05} = 0.933 + j1.046\ \Omega.
$$

**Total motor impedance (per phase):**
$$
Z_{\text{total}} = R_1 + jX_1 + Z_f + Z_b = 2.2 + j3 + 19.89 + j15.33 + 0.933 + j1.046 = 23.023 + j19.376\ \Omega.
$$
Magnitude:
$$
|Z_{\text{total}}| = \sqrt{23.023^2 + 19.376^2} = 30.09\ \Omega,
$$
Phase angle $\phi = \tan^{-1}\frac{19.376}{23.023} = 40.1^\circ$ (lagging).

**Input current and power factor:**
$$
I_1 = \frac{240}{30.09} = 7.98\ \text{A},\qquad
\text{pf} = \cos 40.1^\circ = 0.765\ \text{lagging}.
$$

**Power flow:**
Input power:
$$
P_{\text{in}} = V I_1 \cos\phi = 240 \times 7.98 \times 0.765 = 1465\ \text{W}.
$$

Air-gap powers in the two fields:
$$
P_{gf} = I_1^2 \,\operatorname{Re}(Z_f) = 7.98^2 \times 19.89 = 1265\ \text{W},
$$
$$
P_{gb} = I_1^2 \,\operatorname{Re}(Z_b) = 7.98^2 \times 0.933 = 59.4\ \text{W}.
$$

Net mechanical power developed:
$$
P_{\text{mech}} = (1-s)(P_{gf} - P_{gb}) = 0.94 \times (1265 - 59.4) = 1134\ \text{W}.
$$

Output power and efficiency:
$$
P_{\text{out}} = P_{\text{mech}} - P_{\text{rot}} = 1134 - 50 = 1084\ \text{W} = 1.084\ \text{kW}.
$$
$$
\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \times 100\% = \frac{1084}{1465} \times 100 = 74.0\% .
$$

> **Final answer:** $I_1 = 7.98\ \text{A}$, $\text{pf} = 0.765$ lagging, $P_{\text{out}} = 1.084\ \text{kW}$, $\eta = 74.0\%$.


---

## Question 70
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 6A | EM-I ELE 205 Makeup, 08 January 2008

With the help of double field revolving theory, show that single phase induction motor is not self staring. (04)

### Answer 70
Double revolving field theory: The single-phase winding produces a pulsating magnetic field that can be expressed as
$$
\begin{aligned}
F(\theta,t) &= F_{\text{max}} \cos\theta \cos\omega t \\
&= \frac{F_{\text{max}}}{2} \cos(\theta - \omega t) + \frac{F_{\text{max}}}{2} \cos(\theta + \omega t)
\end{aligned}
$$
revealing two rotating fields of equal magnitude, one moving forward (CCW) and the other backward (CW) at synchronous speed.

At standstill, the rotor sees both fields moving at the same relative speed. The forward field induces rotor currents that produce a torque in the forward direction; the backward field induces currents that produce an equal torque in the opposite direction. Since the two torques cancel, the net starting torque is zero.

Thus a single-phase induction motor with only one stator winding cannot develop any starting torque-it is not self-starting. To make it self-starting, an auxiliary winding and phase-splitting arrangement (split-phase, capacitor-start, etc.) must be added to create an initial rotating field.

> **Final answer:** At standstill the pulsating field splits into two counter-rotating fields of equal strength; the torques they produce are equal and opposite, giving zero net starting torque. Hence the motor is not self-starting.


---

## Question 71
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 4B | EM-I ELE 2103 End Sem, 27 November 2018

With necessary phasor diagram, explain how a capacitor can help in starting of a single-phase induction motor. (03)

### Answer 71
In a single-phase motor, a single winding produces a pulsating field and develops no starting torque. To obtain starting torque, a capacitor-start motor uses two stator windings in space quadrature ($90^\circ$ electrical) - the main winding and an auxiliary winding. A capacitor is connected in series with the auxiliary winding.

The main winding is highly inductive, so its current $I_m$ lags the supply voltage $V$ by a large angle $\phi_m \approx 70^\circ\!-\!80^\circ$. The capacitor cancels part of the auxiliary winding's inductance, making the auxiliary current $I_a$ less lagging or even leading $V$ by an angle $\phi_a \approx 20^\circ\!-\!40^\circ$. With proper capacitance, the phase displacement $|\phi_m - \phi_a|$ approaches $90^\circ$.

The phasor diagram (taking $V$ as reference) shows $I_m$ lagging by $\phi_m$ and $I_a$ leading (or lagging less) by $\phi_a$, giving a nearly $90^\circ$ time-phase difference between the two winding currents. Combined with the $90^\circ$ spatial displacement of the windings, this produces an approximate rotating magnetic field. The rotating field cuts the rotor conductors, inducing e.m.f.s and currents that interact with the field to develop a unidirectional starting torque.

Once the motor reaches about $70\!-\!80\%$ of synchronous speed, a centrifugal switch disconnects the auxiliary winding and capacitor; they are not needed for running.

![Capacitor-start motor circuit](https://www.electricalvolt.com/wp-content/uploads/2023/02/cap1-1024x615.png)
*Figure: Circuit diagram of a capacitor-start single-phase induction motor with main and auxiliary windings, capacitor, and centrifugal switch. Source: [Electrical Volt](https://www.electricalvolt.com/capacitor-start-induction-motor/).*

> **Final answer:** The capacitor causes a time-phase displacement between the main and auxiliary winding currents. Together with the spatial displacement of the windings, this creates a rotating field that produces the necessary starting torque.


---

## Question 72
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 3A | EM-I ELE 2123 End Sem, 05 December 2023

How is torque produced in a capacitor start single phase induction motor. Is 3 there any need for this capacitor after starting? Explain.

### Answer 72
Torque production in a capacitor-start single-phase induction motor relies on creating a rotating magnetic field at starting.

The stator carries a main winding and an auxiliary winding displaced by $90^\circ$ electrical in space. The auxiliary winding is connected in series with a capacitor. Because of the capacitor, the auxiliary-circuit impedance becomes predominantly capacitive, causing the auxiliary current $I_a$ to lead the supply voltage while the main-winding current $I_m$ lags. The phase difference between $I_m$ and $I_a$ can be made close to $90^\circ$ by choosing the capacitance correctly.

The two currents, flowing in windings that are $90^\circ$ apart in space, set up a two-phase rotating magnetic field. This field sweeps past the rotor, inducing voltages and currents in the squirrel-cage bars. The interaction of the rotor current with the stator field produces a torque that starts the motor.

Mathematically, if the main and auxiliary mmfs are
$$
\begin{aligned}
F_m &= F_{m,\max} \cos\omega t \, \cos\theta \\
F_a &= F_{a,\max} \cos(\omega t - 90^\circ) \, \cos(\theta - 90^\circ)
\end{aligned}
$$
the resultant mmf is a travelling wave, confirming a rotating field.

After the motor accelerates to about $70\!-\!80\%$ of synchronous speed, a centrifugal switch disconnects the auxiliary winding and its capacitor. They are not needed for running because the main winding alone can sustain torque. Moreover, the capacitor and auxiliary winding are designed for short-time duty; if left in circuit they would overheat and cause unnecessary losses. Thus, for a conventional capacitor-start motor, the capacitor is required only for starting.

In a capacitor-run motor (different design) a smaller capacitor remains permanently connected to improve running power factor and reduce noise, but that is not the case here.

![Capacitor-start motor circuit](https://www.electricalvolt.com/wp-content/uploads/2023/02/cap1-1024x615.png)
*Figure: Circuit diagram of a capacitor-start single-phase induction motor with main and auxiliary windings, capacitor, and centrifugal switch. Source: [Electrical Volt](https://www.electricalvolt.com/capacitor-start-induction-motor/).*

> **Final answer:** The capacitor provides the necessary phase shift between the two winding currents, creating a rotating field that develops starting torque. In a capacitor-start motor the capacitor and auxiliary winding are disconnected after starting; they are not needed for running and would overheat if left in circuit.


---

## Question 73
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 3A | EM-I ELE 2123 End Sem, 25 November 2024

With the help of double field revolving theory, prove that a single-phase induction 3 motor containing only one stator winding produces no starting torque. Justify your answer with suitable characteristics.

### Answer 73
According to the double-revolving-field theory, the pulsating MMF produced by a single-phase winding can be resolved into two rotating MMFs of half amplitude rotating in opposite directions at synchronous speed. For a sinusoidal current, the resultant MMF is

$$
\begin{aligned}
F(\theta,t) = \frac{F_m}{2} \cos(\theta - \omega t) + \frac{F_m}{2} \cos(\theta + \omega t).
\end{aligned}
$$

At standstill, both fields rotate at synchronous speed relative to the rotor, so slip with respect to each field is $s_f = s_b = 1$. The two fields induce equal rotor currents and produce equal electromagnetic torques, but in opposite directions. Hence the net starting torque $T_{\text{net}} = T_f - T_b = 0$.

This is reflected in the torque-slip characteristic: the forward and backward torque curves are symmetrical about $s=1$, and their sum passes through zero at standstill. Therefore, a single-phase motor with only one winding cannot develop any starting torque; an auxiliary winding is needed to initiate rotation.

> **Final answer:** The two equal and opposite torques cancel exactly at standstill, so the motor produces no starting torque.


---

## Question 74
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 1C | EM-I ELE 2154 Online End Sem, 27 January 2022

Explain the operation of a single-phase induction motor using double field revolving theory. (02)

### Answer 74
A single-phase stator winding carrying AC creates a pulsating MMF that can be expressed as the sum of two rotating MMFs of half amplitude rotating inversely at synchronous speed: $F(\theta,t) = \frac{F_m}{2} \cos(\theta - \omega t) + \frac{F_m}{2} \cos(\theta + \omega t)$. At rest, both fields induce equal rotor currents and produce equal but opposite torques, yielding zero starting torque. If the rotor is started by auxiliary means, the forward field slip reduces (greater torque) and the backward field slip increases (smaller torque). The net torque then propels the motor in the direction of initial rotation, and it continues to run on the main winding alone.

> **Final answer:** The double-revolving-field theory explains the non-self-starting nature and running capability of single-phase induction motors.


---

## Question 75
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 2C | EM-II ELE 204 Makeup, 08 July 2014

A 1500 kVA, 6.6 kV, 3-phase star connected wound rotor alternator with a resistance of 0.4 Ω and reactance of 6 Ω per phase, delivers full load current at 0.8 power factor lagging and normal terminal voltage. Estimate the excitation emf required and respective load angle. (04)

### Answer 75
**Given:** 3-phase star-connected alternator, $S = 1500\ \text{kVA}$, $V_L = 6.6\ \text{kV}$, $R_a = 0.4\ \Omega$, $X_s = 6\ \Omega$, power factor $0.8$ lagging.

**Solution.**

Per-phase terminal voltage:
$$
V_{ph} = \frac{V_L}{\sqrt{3}} = \frac{6600}{\sqrt{3}} \approx 3810.5\ \text{V}.
$$

Full-load current:
$$
I_a = \frac{S}{\sqrt{3} V_L} = \frac{1500 \times 10^3}{\sqrt{3} \times 6600} \approx 131.22\ \text{A}.
$$

The current lags the terminal voltage by $\phi = \cos^{-1}(0.8) \approx 36.87^\circ$. Taking $\tilde{V}_{ph} = 3810.5\angle 0^\circ\ \text{V}$, the current phasor is $\tilde{I}_a = 131.22\angle -36.87^\circ\ \text{A}$. The excitation emf $\tilde{E}_f$ is the phasor sum:

$$
\tilde{E}_f = \tilde{V}_{ph} + \tilde{I}_a (R_a + jX_s).
$$

Resolving into real and imaginary components:

$$
\begin{aligned}
E_{\text{real}} &= V_{ph} + I_a R_a \cos\phi + I_a X_s \sin\phi \\
&= 3810.5 + (131.22\times0.4\times0.8) + (131.22\times6\times0.6) \\
&= 3810.5 + 41.99 + 472.39 \approx 4324.9\ \text{V},
\end{aligned}
$$

$$
\begin{aligned}
E_{\text{imag}} &= I_a X_s \cos\phi - I_a R_a \sin\phi \\
&= (131.22\times6\times0.8) - (131.22\times0.4\times0.6) \\
&= 629.86 - 31.49 \approx 598.4\ \text{V}.
\end{aligned}
$$

Thus, magnitude per phase:

$$
E_f = \sqrt{4324.9^2 + 598.4^2} \approx 4366\ \text{V}.
$$

Load angle:

$$
\delta = \tan^{-1}\left(\frac{598.4}{4324.9}\right) \approx 7.88^\circ.
$$

> **Final answer:** Excitation emf per phase $\approx 4366\ \text{V}$, load angle $\approx 7.88^\circ$ (lagging).


---

## Question 76
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 2C | EM-II ELE 2202 Makeup, 16 June 2017

What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator? (02)

### Answer 76
Advantages of rotor-field/stator-armature construction in large alternators:

- The heavy AC armature winding, carrying high voltage and high current, is stationary. This eliminates high-current sliding contacts, allows direct bolted connections to busbars, reduces losses, and improves reliability.
- Stationary windings permit robust insulation and mechanical bracing against short-circuit forces, unaffected by centrifugal stresses.
- Effective cooling is simpler: large cooling ducts and liquid cooling systems can be incorporated into the stationary frame.
- The rotor DC field winding operates at low voltage and low current (a few percent of machine rating). Excitation power is easily supplied through small slip-rings or a brushless exciter, minimizing maintenance.
- The rotor is mechanically simpler and lighter, enabling higher speeds and reducing centrifugal stress on field windings.

This arrangement is universally adopted for large alternators because it separates the high-power output circuit from the low-power excitation circuit, yielding a robust, low-maintenance machine.

> **Final answer:** Placing the field on the rotor enables a stationary high-power armature with simple insulation and cooling, while the low-power DC field is fed via small slip-rings or a brushless system, resulting in high reliability and easy maintenance.


---

## Question 77
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 4A | EM-II ELE 2202 Makeup, 19 June 2018

With neat sketch, explain how an alternator can be synchronized to the grid using ‘Bright lamp method’. What are the conditions to be met to synchronize two 3-phase alternators? (05)

### Answer 77
**Bright-lamp synchronisation method**

The procedure is as follows:

1. Bring the incoming alternator to synchronous speed and adjust the field current until its terminal voltage equals the busbar voltage.
2. Connect three lamps between the alternator and the busbar:
   - Lamp L1 directly between corresponding phases (e.g., R-R′).
   - Lamps L2 and L3 cross-connected (Y-B′ and B-Y′).
3. The lamps flicker at the difference frequency between the alternator and the grid.
4. Trim the prime-mover speed to slow the flicker; when the flicker becomes very slow (ideally steady), observe the lamps.
5. Close the synchronising switch at the instant when **L1 is dark** and **L2 and L3 glow with equal brightness**. This instant confirms equality of voltage magnitude, frequency, correct phase sequence, and zero phase angle.

**Conditions for synchronising two 3-phase alternators**

- Equal terminal voltage magnitudes.
- Equal frequency (i.e., both machines run at the same speed for equal number of poles).
- Identical phase sequence (R-Y-B matches R′-Y′-B′).
- Zero phase angle between corresponding phases at the moment of paralleling (voltages must be in phase).

> **Final answer:** The bright-lamp method uses one direct and two cross-connected lamps; switching is done when the direct lamp is dark and the cross lamps are equally bright, verifying equal voltage, equal frequency, correct phase sequence and zero phase displacement.


---

## Question 78
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 1A | EM-II ELE 2225 End Sem, 09 May 2024

‘The inherent nature of synchronous machines is to rotate in synchronism with the supply frequency while that of induction motors is to rotate with a slip’. Differentiate the above two machines. Use necessary schematic diagrams to justify your answer.

### Answer 78
**Inherent difference**
A synchronous machine is designed to run exactly at the synchronous speed ($s=0$) because its rotor is separately excited with DC, establishing a constant magnetic polarity that locks into the stator's rotating magnetic field. In contrast, an induction motor must run at a speed slightly lower than synchronous speed ($s>0$) so that relative motion exists to induce rotor currents; without slip, no torque can develop.

**Construction and excitation**
- *Synchronous machine*: Stator carries a three-phase winding producing a rotating field at $N_s = \frac{120 f}{P}$. The rotor houses a DC field winding fed via slip-rings or a brushless exciter (or uses permanent magnets).
  ![Synchronous machine diagram](https://www.electricaltechnology.org/wp-content/uploads/2022/08/Construction-of-Synchronous-Motor-1024x513.png)
  *Figure: Cutaway view of a synchronous machine illustrating the stator (armature) and salient-pole rotor (field) construction, including damper windings. Source: [ElectricalTechnology](https://www.electricaltechnology.org/2022/09/synchronous-motor.html).*
- *Induction motor*: Stator is identical; rotor consists of short-circuited conductors (squirrel-cage or wound rotor). No external DC source is connected. Rotor currents are induced solely by the slip-dependent voltage.

**Speed-slip relationship**
$$\begin{aligned} N_s &= \frac{120 f}{P}, \quad s = \frac{N_s - N_r}{N_s}. \end{aligned}$$
- Synchronous machine: $s = 0$ in steady state; speed is rigidly tied to supply frequency regardless of load.
- Induction motor: $0 < s < 1$ for motoring; full-load slip typically 2-5 %. Load increase causes slip to increase.

**Torque production**
- Synchronous machine: Torque is produced by the magnetic attraction between stator and rotor fields. It exists even at standstill (reluctance torque) and at zero slip. The electromagnetic torque is proportional to $\sin\delta$, where $\delta$ is the load angle.
- Induction motor: Torque depends entirely on the slip-frequency rotor currents. The per-phase equivalent circuit (see Figure) shows that the rotor branch contains a resistance $R_2'/s$.
  ![Induction motor equivalent circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
  *Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**Additional differentiating features**
- *Starting*: Synchronous machine is not self-starting - requires damper windings, a pony motor, or variable-frequency drive. Induction motor is self-starting when connected to the three-phase supply.
- *Power factor*: Synchronous machine can be operated at lagging, unity, or leading power factor by adjusting DC excitation. Induction motor always draws lagging reactive power; its power factor cannot be made leading.

**Conclusion**
The fundamental distinction is that the synchronous machine possesses its own rotor magnetisation, allowing it to lock into step with the rotating stator field at zero slip, whereas the induction motor relies on electromagnetic induction caused by a slip-produced relative velocity, making slip essential for any torque output.

> **Final answer:** A synchronous machine runs at synchronous speed ($s=0$) because its separately excited rotor field physically locks to the stator field; an induction motor must slip ($s>0$) to induce rotor currents and develop torque, as illustrated by its equivalent circuit where the rotor branch demands $s \neq 0$ for current to flow.


---

## Question 79
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 1C | EM-II ELE 2225 End Sem, 09 May 2024

‘Unlike asynchronous machines, Synchronous machines can be operated at different power factors’. Justify this statement with the help of necessary characteristics. 3

### Answer 79
Synchronous machines can operate at any power factor because their rotor flux is produced by a separate DC excitation, while induction machines require magnetising current drawn from the stator and always operate at a lagging power factor.

For a non-salient pole machine, the per-phase phasor equation (neglecting $R_a$) is
$$
\begin{aligned}
\tilde{V} = \tilde{E}_f + j\tilde{I}_a X_s .
\end{aligned}
$$
The three-phase active and reactive power are
$$
\begin{aligned}
P &= \frac{3VE_f}{X_s}\sin\delta ,\\
Q &= \frac{3V}{X_s}\bigl(E_f\cos\delta - V\bigr).
\end{aligned}
$$
For a fixed real power $P$, the load angle $\delta$ is nearly constant. The excitation emf $E_f$ is proportional to the field current $I_f$. Hence, by adjusting $I_f$, the reactive power $Q$ changes, allowing three modes:

- **Under-excitation** ($E_f\cos\delta < V$): machine absorbs reactive power → lagging power factor.
- **Normal excitation** ($E_f\cos\delta = V$): $Q=0$ → unity power factor, minimum armature current.
- **Over-excitation** ($E_f\cos\delta > V$): machine delivers reactive power → leading power factor.

These operating regions are summarised by the **V-curves** ($I_a$ vs $I_f$ at constant $P$), which have a distinct minimum at unity pf.

![V-curves of a synchronous motor](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

In contrast, an induction machine has a short-circuited rotor; its magnetic field can be established only by drawing lagging reactive current from the stator. Its power factor is inherently lagging and cannot be varied without external capacitors. Thus, the ability to independently control the rotor flux makes the synchronous machine uniquely capable of operating at different power factors.

> **Final answer:**
> By varying the DC field current, a synchronous machine can operate at lagging, unity or leading power factor, whereas an induction machine always draws lagging VARs and cannot control its power factor. This is shown by the V-curves ($I_a$ vs $I_f$) and the reactive power equation $Q = \frac{3V}{X_s}(E_f\cos\delta - V)$.


---

## Question 80
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 204 Makeup, 08 July 2014

A 3 phase, 6600 V, 50 Hz, 1000 rpm, star connected alternator is delivering a constant power of 4 MW to an infinite bus system. Its synchronous impedance per phase is (0+j0.75) Ω. Determine the excitation emf required if the power factor is to be adjusted 0.7 lagging. Also obtain the current and power factor when the excitation is set to its minimum value required to deliver the same power. (06)

### Answer 80
**Given:** 3-phase, 6600 V (line), 50 Hz, star-connected alternator, $P = 4$ MW constant, $Z_s = j0.75\ \Omega$/phase (negligible resistance).

**Steps:**

1. Phase voltage: $V = \frac{6600}{\sqrt{3}} \approx 3810.5$ V.

2. **At 0.7 lagging power factor:**
   $\cos\varphi = 0.7 \Rightarrow \varphi = \cos^{-1}(0.7) \approx 45.57^\circ$, $\sin\varphi = 0.714$.
   Line current:
   $$
   I = \frac{P}{\sqrt{3}\,V_L\cos\varphi} = \frac{4 \times 10^6}{\sqrt{3} \times 6600 \times 0.7} \approx 499.9\ \text{A}.
   $$
   Take $\tilde{V} = V\angle 0^\circ$; then $\tilde{I} = 499.9\angle -45.57^\circ$ A.
   Excitation emf per phase:
   $$
   \begin{aligned}
   \tilde{E} &= \tilde{V} + jX_s\tilde{I} = 3810.5 + j0.75 \times 499.9\angle -45.57^\circ \\
            &= 3810.5 + 374.9\angle 44.43^\circ \\
            &\approx 3810.5 + 374.9(0.714 + j0.7) \\
            &\approx 4078.3 + j262.4\ \text{V}.
   \end{aligned}
   $$
   Magnitude: $E = |\tilde{E}| \approx \sqrt{4078.3^2 + 262.4^2} \approx 4087$ V.
   Load angle: $\delta = \tan^{-1}\!\bigl(\frac{262.4}{4078.3}\bigr) \approx 3.68^\circ$.

3. **Minimum excitation for the same power:**
   Real power: $P = \dfrac{3VE}{X_s}\sin\delta$. With $P$ constant, $E$ is minimum when $\sin\delta = 1$ ($\delta = 90^\circ$):
   $$
   E_{\min} = \frac{P\,X_s}{3V} = \frac{4\times10^6 \times 0.75}{3 \times 3810.5} \approx 262.4\ \text{V/phase}.
   $$
   Current at this condition: using $\tilde{E}_{\min} = E_{\min}\angle 90^\circ$ (taking $\tilde{V}$ as reference):
   $$
   \tilde{I} = \frac{\tilde{E}_{\min} - \tilde{V}}{jX_s}
           = \frac{-3810.5 + j262.4}{j0.75}
           \approx 5093\angle 86.06^\circ\ \text{A}
   $$
   (magnitude $I \approx 5093$ A).
   Power factor:
   $$
   \cos\varphi = \frac{P}{\sqrt{3}V_L I} = \frac{4\times10^6}{\sqrt{3}\times6600\times5093} \approx 0.0687,
   $$
   and because $E_{\min} < V$ with $\delta = 90^\circ$ the current leads the voltage → **leading** pf.

> **Final answer:**
> For 0.7 pf lagging: $E \approx 4087$ V/phase, $\delta \approx 3.68^\circ$.
> Minimum excitation: $E_{\min} \approx 262.4$ V/phase, $I \approx 5093$ A, pf $\approx 0.0687$ leading.


---

## Question 81
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 204 Makeup, 08 July 2014

A 3 phase, 50 Hz, 440 V, synchronous motor has a synchronous impedance of (0.5+j4) Ω/phase. Draw a set of excitation circles with excitation emfs of 50%, 90% and 125% of its terminal voltage. For an armature current of 35 A, graphically determine the load angle and power factor for each of the above excitations. (04)

### Answer 81
**Given:** 3-phase, 440 V (line), 50 Hz synchronous motor, $Z_s = (0.5 + j4)\ \Omega$/phase, armature current $I = 35$ A/phase. Exitation emfs: $E = 50\%$, $90\%$ and $125\%$ of rated terminal voltage.

**Step-1: Per-phase values.**
Phase voltage: $V = \frac{440}{\sqrt{3}} \approx 254$ V.
Impedance: $|Z_s| = \sqrt{0.5^2 + 4^2} \approx 4.031\ \Omega$, $\theta_z = \tan^{-1}(4/0.5) \approx 82.875^\circ$.
Voltage drop magnitude: $|I Z_s| = 35 \times 4.031 \approx 141.1$ V.

**Step-2: Graphical construction (excitation circles).**
Using motor phasor equation $\tilde{V} = \tilde{E} + \tilde{I} Z_s$, rewritten as $\tilde{E} = \tilde{V} - \tilde{I} Z_s$.
- Draw $\tilde{V}$ horizontally. Its tip is the centre of a circle of radius $|I Z_s|$ (locus of $-\tilde{I} Z_s$).
- For a given excitation $|\tilde{E}|$, draw a circle of radius $E$ centred at the origin.
- The intersection of the two circles locates $\tilde{E}$.
- From the diagram, the load angle $\delta$ (between $\tilde{V}$ and $\tilde{E}$) and the current phase $\varphi$ are obtained by noting that $\tilde{I} Z_s$ leads $\tilde{I}$ by $\theta_z$.

**Step-3: Analytical solution (equivalent to above).**
Using the triangle formed by $V$, $E$ and $|I Z_s|$, the angle $\alpha$ between $\tilde{V}$ and $\tilde{I} Z_s$ is given by
$$
\cos\alpha = \frac{V^2 + (I Z_s)^2 - E^2}{2\,V\,(I Z_s)}.
$$
Then the power-factor angle $\varphi = \alpha - \theta_z$ (negative for lagging, positive for leading).
Load angle $\delta$ is obtained from
$$
\cos\delta = \frac{V^2 + E^2 - (I Z_s)^2}{2\,V\,E}.
$$

**Results:**

- **50 % excitation ($E = 127$ V):**
  $\cos\alpha \approx 0.9529 \Rightarrow \alpha \approx 17.7^\circ$,
  $\varphi = 17.7 - 82.875 \approx -65.18^\circ$ (lagging),
  pf $\approx \cos 65.18^\circ = 0.419$ lagging,
  $\cos\delta \approx 0.9415 \Rightarrow \delta \approx 19.7^\circ$.

- **90 % excitation ($E = 228.6$ V):**
  $\cos\alpha \approx 0.4489 \Rightarrow \alpha \approx 63.3^\circ$,
  $\varphi \approx 63.3 - 82.875 = -19.58^\circ$ (lagging),
  pf $\approx \cos 19.58^\circ = 0.942$ lagging,
  $\cos\delta \approx 0.8341 \Rightarrow \delta \approx 33.5^\circ$.

- **125 % excitation ($E = 317.5$ V):**
  $\cos\alpha \approx -0.2285 \Rightarrow \alpha \approx 103.2^\circ$,
  $\varphi \approx 103.2 - 82.875 = 20.33^\circ$ (leading),
  pf $\approx \cos 20.33^\circ = 0.938$ leading,
  $\cos\delta \approx 0.9016 \Rightarrow \delta \approx 25.6^\circ$.

> **Final answer:**
> For $I = 35$ A:
> $E = 127$ V (50%): $\delta = 19.7^\circ$, pf $0.419$ lagging;
> $E = 228.6$ V (90%): $\delta = 33.5^\circ$, pf $0.942$ lagging;
> $E = 317.5$ V (125%): $\delta = 25.6^\circ$, pf $0.938$ leading.


---

## Question 82
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2A | EM-II ELE 204 Makeup, 09 July 2015

Draw the EMF and MMF diagrams when a pure inductive load is connected to a 3 phase wound rotor synchronous generator with negligible armature resistance. Hence discuss the armature reaction effect. (03)

### Answer 82
**Phasor (EMF) Diagram**
For a cylindrical-rotor generator with $R_a \approx 0$, the per-phase phasor equation is
$$
\tilde{E} = \tilde{V} + j X_s \tilde{I}.
$$
With pure inductive load, current lags terminal voltage by $90^\circ$. Take $\tilde{V}=V\angle 0^\circ$, $\tilde{I}=I\angle -90^\circ$:
$$
j X_s \tilde{I} = j X_s (I\angle -90^\circ) = X_s I \angle 0^\circ,
$$
which is in phase with $\tilde{V}$. Hence $\tilde{E}$ is collinear with $\tilde{V}$ and $E = V + X_s I$.

The phasor diagram shows:
- $\tilde{V}$ horizontally right,
- $\tilde{I}$ vertically downward,
- $j X_s \tilde{I}$ extending right from the tip of $\tilde{V}$,
- $\tilde{E}$ from origin to the endpoint of $j X_s \tilde{I}$.

**MMF Diagram**
Field mmf $\mathcal{F}_f$ (dc rotor current) aligns with the flux that produces $\tilde{E}$. Armature mmf $\mathcal{F}_a$ is in phase with $\tilde{I}$. Because $\tilde{I}$ lags $\tilde{E}$ by $90^\circ$, $\mathcal{F}_a$ directly opposes $\mathcal{F}_f$. The resultant air-gap mmf is
$$
\mathcal{F}_r = \mathcal{F}_f + \mathcal{F}_a,
$$
and $F_r < F_f$ (demagnetising effect).

**Armature Reaction Effect**
The opposing mmf weakens the net air-gap flux. If excitation were constant, generated emf would drop. To maintain rated terminal voltage, field current must be increased. Thus a pure inductive (lagging) load produces a purely **demagnetising** armature reaction.

> **Final answer:** With a pure inductive load, armature reaction is entirely demagnetising - the armature mmf directly opposes the field mmf, reducing the net flux. To hold $V$ constant, the excitation must be raised.


---

## Question 83
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 204 Makeup, 09 July 2015

A 3 phase, star connected cylindrical rotor alternator with a synchronous reactance of 5 per phase with negligible armature resistance is supplying 250 A at 0.8 power factor lagging to a 11 kV infinite bus. Determine (a) excitation emf and load angle (b) If excitation is increased by 15 % without changing its driving torque, determine the new values of load angle, armature current and power factor (03)

### Answer 83
Given: 3-phase star-connected cylindrical-rotor alternator, $X_s = 5\,\Omega$/ph, $R_a \approx 0$. Line voltage $V_L = 11\,\text{kV}$ (infinite bus), line current $I_L = 250\,\text{A}$, pf $=0.8$ lagging. Compute per-phase.

$$
V_{\text{ph}} = \frac{11000}{\sqrt{3}} = 6351\,\text{V}.
$$
$$
\mathbf{I}_a = 250 \angle -\cos^{-1}0.8 = 250 \angle -36.87^\circ\ \text{A}.
$$

**(a) Excitation emf and load angle**
Generator phasor equation: $\mathbf{E} = \mathbf{V} + j X_s \mathbf{I}_a$.
$$
j X_s \mathbf{I}_a = j5 \times 250\angle -36.87^\circ = 1250\angle 53.13^\circ = 750 + j1000\ \text{V}.
$$
With $\mathbf{V}=6351\angle 0^\circ$,
$$
\mathbf{E} = 6351 + 750 + j1000 = 7101 + j1000\ \text{V}.
$$
Magnitude: $E = \sqrt{7101^2+1000^2}=7171\ \text{V} = 7.171\ \text{kV/phase}$.
Load angle: $\delta = \tan^{-1}(1000/7101)=8.02^\circ$.

**(b) Excitation increased by 15% - constant driving torque**
New excitation: $E' = 1.15 \times 7171 = 8247\ \text{V/phase}$.
Real power unchanged:
$$
P = \frac{3 V_{\text{ph}} E}{X_s}\sin\delta = \frac{3 \times 6351 \times 7171}{5} \sin 8.02^\circ \approx 3.811 \times 10^6\ \text{W}.
$$
New load angle:
$$
\sin\delta' = \frac{P X_s}{3 V_{\text{ph}} E'} = \frac{3.811\times10^6 \times 5}{3 \times 6351 \times 8247} = 0.1213,
$$
$$
\delta' = \sin^{-1}(0.1213) = 6.97^\circ.
$$
New armature current:
$$
\mathbf{I}_a' = \frac{\mathbf{E}' - \mathbf{V}}{j X_s},\qquad \mathbf{E}' = 8247\angle 6.97^\circ = 8185.6 + j1001.3\ \text{V},
$$
$$
\mathbf{E}' - \mathbf{V} = 1834.6 + j1001.3\ \text{V},
$$
$$
\mathbf{I}_a' = \frac{1834.6 + j1001.3}{j5} = 200.26 - j366.92\ \text{A},
$$
$$
I_a' = \sqrt{200.26^2 + 366.92^2} = 418.0\ \text{A}.
$$
Phase angle: $\phi' = \tan^{-1}\!\left(\frac{-366.92}{200.26}\right) = -61.37^\circ$ (lagging).
Power factor: $\cos\phi' = 0.479$ lagging.

> **Final answer:** (a) $E = 7.171\ \text{kV/phase}$, $\delta = 8.02^\circ$. (b) After 15% excitation increase: $\delta' = 6.97^\circ$, $I_a' = 418.0\ \text{A}$, power factor $=0.479$ lagging.


---

## Question 84
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 2202 End Sem, 10 May 2016

A 15 kW, 400 V, 50 Hz, 3 phase, star connected synchronous motor has its synchronous impedance of (1+j5) Ω per phase. If the excitation is maintained constant at 277 V per phase, determine the maximum load the synchronous motor can drive and corresponding current and power factor. (05)

### Answer 84
Per-phase quantities (star connection): line voltage $400\ \text{V}$ → $V_{\text{ph}} = \frac{400}{\sqrt{3}} = 230.94\ \text{V}$.
Excitation emf (back emf) $E_f = 277\ \text{V/phase}$.
Synchronous impedance $Z_s = 1 + j5\ \Omega$.
$$
|Z_s| = \sqrt{1^2+5^2} = 5.099\ \Omega,\qquad
\theta = \arg Z_s = \tan^{-1}\frac{5}{1} = 78.69^\circ.
$$

**Maximum gross mechanical power (pull-out power)**
For a cylindrical-rotor motor, the three-phase air-gap power is
$$
P_g = \frac{3}{|Z_s|}\big[E_f V \cos(\theta-\delta) - E_f^2 \cos\theta\big],
$$
where $\delta$ is the load angle ($E_f$ lags $V$). Maximising with respect to $\delta$:
$$
\frac{dP_g}{d\delta} = \frac{3 E_f V}{|Z_s|} \sin(\theta-\delta) = 0 \;\Longrightarrow\; \delta = \theta = 78.69^\circ.
$$
At this $\delta$,
$$
\cos\theta = \frac{R_a}{|Z_s|} = \frac{1}{5.099} = 0.1961,
$$
$$
P_{g,\max} = \frac{3}{5.099}\big[277 \times 230.94 - 277^2 \times 0.1961\big]
          = \frac{3}{5.099}\big[63\,970.4 - 15\,044.8\big]
          = 28\,780\ \text{W} = 28.78\ \text{kW}.
$$

**Armature current and power factor at maximum load**
Using $\mathbf{I}_a = \frac{\mathbf{V} - \mathbf{E}_f}{Z_s}$ with $\mathbf{V}=230.94\angle 0^\circ$, $\mathbf{E}_f = 277\angle -78.69^\circ$:
$$
\mathbf{E}_f = 277(\cos 78.69^\circ - j\sin 78.69^\circ) = 54.32 - j271.62\ \text{V},
$$
$$
\mathbf{V} - \mathbf{E}_f = 230.94 - (54.32 - j271.62) = 176.62 + j271.62\ \text{V}.
$$
Magnitude: $|\mathbf{V} - \mathbf{E}_f| = \sqrt{176.62^2 + 271.62^2} = 323.96\ \text{V}$, phase $= \tan^{-1}(271.62/176.62) = 56.97^\circ$.
$$
\mathbf{I}_a = \frac{323.96\angle 56.97^\circ}{5.099\angle 78.69^\circ} = 63.54\angle -21.72^\circ\ \text{A}.
$$
Current lags the terminal voltage by $21.72^\circ$; therefore
$$
\text{pf} = \cos 21.72^\circ = 0.929\ \text{lagging}.
$$

> **Final answer:** Maximum load = $28.78\ \text{kW}$, armature current = $63.54\ \text{A}$, power factor = $0.929$ lagging.


---

## Question 85
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2C | EM-II ELE 2202 End Sem, 24 April 2017

Using relevant phasor diagram, discuss the behaviour of a cylindrical rotor synchronous motor supplying a constant load but operating under varying excitation conditions. (03)

### Answer 85
For a cylindrical-rotor synchronous motor connected to constant-voltage constant-frequency bus, neglecting armature resistance, the per-phase phasor equation is $ \vec{V} = \vec{E} + jX_s \vec{I}_a $. With constant shaft load, real power $P = 3 V I_a \cos\phi$ is fixed, so $I_a \cos\phi$ is constant. This defines a vertical locus for the tip of $\vec{I}_a$ on a phasor diagram with $\vec{V}$ as reference.

When excitation is varied:
- **Under-excitation**: $|\vec{E}| < |\vec{V}|$, $\vec{I}_a$ lags $\vec{V}$, motor draws lagging current and absorbs reactive power (inductive behaviour).
- **Normal excitation**: $|\vec{E}|$ adjusted so $\vec{I}_a$ is in phase with $\vec{V}$; power factor unity, armature current minimum.
- **Over-excitation**: $|\vec{E}| > |\vec{V}|$, $\vec{I}_a$ leads $\vec{V}$, motor delivers leading current and supplies reactive power (capacitive behaviour).

Thus, at constant load the synchronous motor can control its reactive power exchange by changing field current. The variation of armature current and power factor with excitation is depicted by V-curves and inverted V-curves.

![V curves of synchronous motor](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

> **Final answer:** With constant load, varying field excitation changes only the reactive component of armature current while the active component stays fixed. This shifts the power factor from lagging (under-excitation) through unity to leading (over-excitation), allowing the motor to act as a variable reactive power compensator.


---

## Question 86
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 2202 End Sem, 24 April 2017

Along with necessary waveforms, discuss the behaviour of a three-phase alternator subjected to a symmetrical 3-phase short circuit. (03)

### Answer 86
When a symmetrical three-phase short circuit occurs at the terminals of an alternator, the armature current undergoes a transient evolution through three stages.

**Sub-transient period** (first few cycles): Flux linkages in damper windings and field cannot change instantly. Effective reactance is the smallest, the sub-transient reactance $X_d''$. Current magnitude $I'' = E_f / X_d''$ decays with time constant $T_d''$.

**Transient period**: Damper currents decay; field flux linkage still preserved. Reactance rises to transient reactance $X_d'$ ($X_d' > X_d''$). Current $I' = E_f / X_d'$ decays more slowly with $T_d'$.

**Steady-state period**: All transients vanish; only synchronous reactance $X_d$ remains. Final symmetrical short-circuit current $I_{ss} = E_f / X_d$, where $X_d > X_d' > X_d''$. Hence $I'' > I' > I_{ss}$.

**Waveform**: The AC component's envelope decays stepwise from $I''$ to $I_{ss}$. Superimposed is a DC offset (depending on the switching angle $\alpha$) that decays with armature time constant $T_a$. The typical phase current can be expressed as
$$
\begin{aligned}
i_{sc}(t) = \sqrt{2}\,E_f \Bigg[&\left(\frac{1}{X_d''}-\frac{1}{X_d'}\right)e^{-t/T_d''} \\
+&\left(\frac{1}{X_d'}-\frac{1}{X_d}\right)e^{-t/T_d'} \\
+&\frac{1}{X_d}\Bigg]\sin(\omega t+\alpha) \\
-&\sqrt{2}\,\frac{E_f}{X_d''}\sin\alpha\; e^{-t/T_a}.
\end{aligned}
$$
The resulting waveform is asymmetrical initially and becomes symmetrical after several cycles.

No diagram needed; the waveform can be sketched with the exponential envelopes.

> **Final answer:** A sudden symmetrical short circuit on an alternator produces sub-transient, transient, and steady-state currents, with decaying magnitude due to the sequential increase in effective reactance from $X_d''$ through $X_d'$ to $X_d$, accompanied by a decaying DC offset.


---

## Question 87
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3A | EM-II ELE 2202 End Sem, 29 April 2019

Describe the operation of alternator with constant excitation and variable load with suitable phasor diagrams. What is the significance of the condition with minimum excitation? Analyze the relation between power factor and excitation with the help of suitable curve. (05)

### Answer 87
**Constant excitation, variable load**

With fixed field current, the induced emf $E$ has constant magnitude. Neglecting $R_a$, the phasor relation is $\vec{E} = \vec{V} + jX_s \vec{I}_a$. Real power $P = \frac{EV}{X_s}\sin\delta$, so both the load angle $\delta$ and the armature current $I_a$ adjust to meet the load demand. The terminal voltage $V$ and power factor depend on the nature of the load:

- **Lagging pf load** (inductive): $\vec{I}_a$ lags $\vec{V}$. Armature reaction is demagnetizing, causing a large voltage drop; $E$ must be considerably larger than $V$ to maintain terminal voltage. Phasor diagram shows $jX_sI_a$ adding directly to $V$, giving large $\delta$ and positive regulation.
- **Unity pf load**: $\vec{I}_a$ in phase with $\vec{V}$. Armature reaction is cross-magnetizing; the reactive drop is perpendicular to $V$, so the voltage drop is smaller. $E$ and $V$ are closer.
- **Leading pf load** (capacitive): $\vec{I}_a$ leads $\vec{V}$. Armature reaction is magnetizing; the terminal voltage may actually rise with load, yielding negative regulation. $E$ can be smaller than $V$.

These phasor diagrams illustrate how the machine's internal voltage and angle vary with load power factor.

**Minimum excitation - stability limit**

For a given active power and terminal voltage, reducing excitation reduces $E$. To maintain the same $P$, $\sin\delta$ must increase, i.e., $\delta$ grows. The maximum possible power transfer occurs at $\delta = 90^\circ$: $P_{max}=EV/X_s$. If excitation is further reduced, $P_{max}$ becomes smaller than the required load power and the machine loses synchronism. Therefore the condition $\delta = 90^\circ$ defines the steady-state stability boundary and corresponds to the minimum permissible excitation. In practice, a margin of $20^\circ$-$30^\circ$ is kept.

**Power factor vs excitation**

For a fixed real power output, the reactive power exchange is controlled by excitation. Varying the field current $I_f$ changes $E$ and therefore the phase of $I_a$ relative to $V$. This relationship is described by the V-curves ($I_a$ vs $I_f$) or the inverted V-curves (pf vs $I_f$).

![V curves of synchronous motor](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

As excitation is increased from a low value, the power factor improves from lagging, passes through unity at the dip of the V-curve, and then becomes leading. The ability to shift the power factor makes the synchronous generator a vital tool for voltage control and power-factor correction in power systems.

> **Final answer:** Under constant excitation, load changes alter terminal voltage and load angle depending on power factor; minimum excitation is set by the stability limit $\delta=90^\circ$; varying excitation changes reactive power flow, described by the V-curves where pf goes from lagging (under-excited) to unity to leading (over-excited).


---

## Question 88
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 4B | EM-II ELE 2202 End Sem, 29 April 2019

A factory has an average load of 1000kW at a power factor of 0.6 lag. A synchronous motor of 86% efficiency is used later to supply an additional mechanical load of 65kW and also to improve the overall power factor to 0.92 lag. Determine the power factor at which the synchronous motor operates. Also comment on the type of excitation required for the synchronous motor for this application and draw the corresponding phasor diagram relating terminal voltage and excitation emf. (05)

### Answer 88
**Given:** Factory: $P_1 = 1000\ \text{kW}$ at $0.6$ lag. Synchronous motor: $P_{\text{mech}} = 65\ \text{kW}$, $\eta = 86\%$. Desired overall pf $= 0.92$ lag.

**Step 1 - Factory reactive power:**
$$
\begin{aligned}
\phi_1 &= \cos^{-1}0.6 \approx 53.13^\circ,\\
Q_1 &= P_1 \tan\phi_1 = 1000 \times \frac{4}{3} = 1333.3\ \text{kvar (lagging)}.
\end{aligned}
$$

**Step 2 - Motor electrical input:**
$$
\begin{aligned}
P_m = \frac{P_{\text{mech}}}{\eta} = \frac{65}{0.86} \approx 75.58\ \text{kW}.
\end{aligned}
$$

**Step 3 - Total active and required total reactive:**
$$
\begin{aligned}
P_{\text{tot}} &= P_1 + P_m = 1075.58\ \text{kW},\\
\phi_{\text{tot}} &= \cos^{-1}0.92 \approx 23.07^\circ,\\
Q_{\text{tot}} &= P_{\text{tot}} \tan\phi_{\text{tot}} = 1075.58 \times 0.426 \approx 458.2\ \text{kvar (lag)}.
\end{aligned}
$$

**Step 4 - Motor reactive power:**
$$
\begin{aligned}
Q_m = Q_{\text{tot}} - Q_1 = 458.2 - 1333.3 = -875.1\ \text{kvar} \quad (\text{leading}).
\end{aligned}
$$

**Step 5 - Motor apparent power and power factor:**
$$
\begin{aligned}
S_m &= \sqrt{P_m^2 + Q_m^2} = \sqrt{75.58^2 + 875.1^2} \approx 878.4\ \text{kVA},\\
\text{pf}_m &= \frac{P_m}{S_m} = \frac{75.58}{878.4} \approx 0.086\ \text{leading}.
\end{aligned}
$$

**Excitation requirement:** The synchronous motor must be **over-excited**. Over-excitation makes $E_f > V$, drawing leading current, supplying reactive power to the system (acting as a synchronous condenser) and improving the overall power factor.

**Phasor diagram (leading pf, motor):** Terminal voltage $\mathbf{V}$ is reference. Armature current $\mathbf{I}_a$ leads $\mathbf{V}$ by a large angle $\phi_m \approx 85.1^\circ$. The excitation emf $\mathbf{E}_f$ leads $\mathbf{V}$ by the load angle $\delta$, and its magnitude exceeds $\mathbf{V}$ (over-excitation). The relation $\mathbf{V} = \mathbf{E}_f + \mathbf{I}_a(R_a + jX_s)$ holds.

> **Final answer:** Synchronous motor operates at **0.086 leading**; it must be **over-excited**.


---

## Question 89
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 2202 Makeup, 02 July 2016

A 3.3 kV, 3 phase, 50 Hz, 4 pole star connected synchronous motor has a synchronous impedance of 0.2 + j 3 Ω per phase. For an input current of 200A at 0.9 p.f lag, determine the maximum gross power and torque developed. 5M

### Answer 89
**Given:** $3.3\ \text{kV}$, 3-phase, 4-pole, star-connected synchronous motor, $Z_s = 0.2 + j3\ \Omega/\text{ph}$, $I_a = 200\ \text{A}$ at $0.9$ pf lag.

**Per-phase quantities:**
$$
\begin{aligned}
V_\text{ph} &= \frac{3300}{\sqrt{3}} = 1905.3\ \text{V},\\
Z_s &= 0.2 + j3,\quad |Z_s| = \sqrt{0.2^2+3^2} = 3.0067\ \Omega,\quad \theta = \tan^{-1}\frac{3}{0.2} = 86.19^\circ.
\end{aligned}
$$

**Excitation emf $E_f$:**
$$
\begin{aligned}
\mathbf{I}_a &= 200\angle -\cos^{-1}0.9 = 200\angle -25.84^\circ\ \text{A},\quad \mathbf{V}_\text{ph} = 1905.3\angle 0^\circ\\
\mathbf{I}_a Z_s &= 200\angle -25.84^\circ \times 3.0067\angle 86.19^\circ = 601.3\angle 60.35^\circ\ \text{V}\\
&= 297.6 + j522.7\ \text{V}\\
\mathbf{E}_f &= \mathbf{V}_\text{ph} - \mathbf{I}_a Z_s = (1905.3 - 297.6) - j522.7 = 1607.7 - j522.7\ \text{V}\\
|\mathbf{E}_f| &= \sqrt{1607.7^2 + 522.7^2} \approx 1690.5\ \text{V},\quad \delta = \tan^{-1}\frac{522.7}{1607.7} \approx 18.0^\circ\ (\text{E}_f\ \text{lags}\ V).
\end{aligned}
$$

**Maximum gross mechanical power (cylindrical-rotor motor):**
The power delivered by $E_f$ is
$$
P_g = 3\left(\frac{E_f V}{|Z_s|}\cos(\theta-\delta) - \frac{E_f^2}{|Z_s|}\cos\theta\right).
$$
Maximum occurs when $\cos(\theta-\delta)=1$, i.e., $\delta = \theta = 86.19^\circ$ (pull-out):
$$
P_{g,\max} = 3\left(\frac{E_f V}{|Z_s|} - \frac{E_f^2 R}{|Z_s|^2}\right) \quad (\cos\theta = R/|Z_s|).
$$
Substitute values:
$$
\begin{aligned}
P_{g,\max} &= 3\left(\frac{1690.5 \times 1905.3}{3.0067} - \frac{1690.5^2 \times 0.2}{3.0067^2}\right)\\
&= 3\left(1.071\times 10^6 - 0.0632\times 10^6\right)\\
&= 3.024 \times 10^6\ \text{W} = 3.024\ \text{MW}.
\end{aligned}
$$

**Maximum gross torque:**
$$
\begin{aligned}
N_s &= \frac{120 f}{P} = \frac{120\times 50}{4} = 1500\ \text{rpm},\\
\omega_s &= \frac{2\pi N_s}{60} = 157.08\ \text{rad/s},\\
T_{\max} &= \frac{P_{g,\max}}{\omega_s} = \frac{3.024\times 10^6}{157.08} \approx 19.25 \times 10^3\ \text{N}\cdot\text{m}.
\end{aligned}
$$

> **Final answer:** Maximum gross power = **3.024 MW**; maximum gross torque = **19.25 kN·m**.


---

## Question 90
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2C | EM-II ELE 2202 Makeup, 13 June 2019

A 3-phase, star connected alternator is rated 1,600 kVA, 13.5 kV. Its per-phase effective armature resistance & synchronous reactance are 1 & 40 respectively. a) Calculate the percentage voltage regulation for a load of 1,250 kW at 0.8 pf lagging. b) Draw the phasor diagram for the given load. (03)

### Answer 90
**Given:** 3-phase, star-connected alternator: $1600\ \text{kVA}$, $13.5\ \text{kV}$ (line), $R_a = 1\ \Omega$, $X_s = 40\ \Omega$ per phase. Load: $1250\ \text{kW}$ at $0.8$ pf lagging.

**Per-phase quantities:**
$$
\begin{aligned}
V_\text{ph} &= \frac{13500}{\sqrt{3}} = 7794\ \text{V},\\
\text{Load kVA} &= \frac{1250}{0.8} = 1562.5\ \text{kVA},\\
I_\text{ph} &= \frac{1562.5 \times 10^3}{\sqrt{3} \times 13500} = 66.82\ \text{A}.
\end{aligned}
$$

**Load angle:** $\phi = \cos^{-1}0.8 = 36.87^\circ$ lagging.

**Excitation emf $E_f$ (generator convention):**
$$
\begin{aligned}
\mathbf{I}_a &= 66.82\angle -36.87^\circ\ \text{A},\quad \mathbf{V}_\text{ph} = 7794\angle 0^\circ,\\
Z_s &= 1 + j40 = 40.0125\angle 88.57^\circ\ \Omega,\\
\mathbf{I}_a Z_s &= 66.82\angle -36.87^\circ \times 40.0125\angle 88.57^\circ = 2673\angle 51.7^\circ\ \text{V}\\
&= 2673(\cos 51.7^\circ + j\sin 51.7^\circ) = 1656 + j2098\ \text{V},\\
\mathbf{E}_f &= \mathbf{V}_\text{ph} + \mathbf{I}_a Z_s = 7794 + 1656 + j2098 = 9450 + j2098\ \text{V},\\
|\mathbf{E}_f| &= \sqrt{9450^2 + 2098^2} \approx 9681.5\ \text{V}.
\end{aligned}
$$

**Voltage regulation:**
$$
\%\text{Reg} = \frac{E_f - V_\text{ph}}{V_\text{ph}} \times 100 = \frac{9681.5 - 7794}{7794} \times 100 \approx 24.21\%.
$$

**Phasor diagram (lagging pf generator):** Reference $\mathbf{V}_\text{ph}$ horizontally. $\mathbf{I}_a$ drawn lagging by $36.87^\circ$. From $\mathbf{V}_\text{ph}$ tip, add resistive drop $\mathbf{I}_a R_a$ (parallel to $\mathbf{I}_a$). From its tip, add reactive drop $\mathbf{I}_a X_s$ (leading $\mathbf{I}_a$ by $90^\circ$). The resultant is $\mathbf{E}_f$, which leads $\mathbf{V}_\text{ph}$ by load angle $\delta \approx 12.5^\circ$. For lagging load, $E_f > V_\text{ph}$.

> **Final answer:** Voltage regulation = **24.21\%**.


---

## Question 91
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 2202 Makeup, 13 June 2019

Explain the effect of load power factor on armature reaction in alternators. (03)

### Answer 91
Armature reaction is the impact of the rotating armature mmf ($F_a$) on the main field mmf ($F_f$). When the alternator supplies load, the stator current $I_a$ (lagging, leading, or in phase with the induced emf $E_f$) produces $F_a$ that is displaced in space by the power factor angle $\phi$ relative to $F_f$. The resultant air-gap flux $\Phi_r$ is determined by the vector sum of the two mmfs. Since the terminal voltage $V_t$ is proportional to $\Phi_r$ (minus leakage drops), the power factor strongly influences $V_t$.

- **Unity pf**: $I_a$ in phase with $E_f$. $F_a$ acts perpendicular to $F_f$ (cross-magnetising), distorting the flux but not changing its average value. Hence $V_t$ remains almost constant with load.
- **Lagging pf**: $I_a$ lags $E_f$. $F_a$ opposes $F_f$ along the direct axis (demagnetising), reducing $\Phi_r$ and causing $V_t$ to drop significantly.
- **Leading pf**: $I_a$ leads $E_f$. $F_a$ assists $F_f$ (magnetising), boosting $\Phi_r$ and raising $V_t$ above the no-load value.

The effect can be quantified through the synchronous impedance model, where armature reaction is represented as a reactance voltage drop $j I_a X_{ar}$. This drop adds to the leakage reactance drop and the resistance drop to give the total internal voltage drop. The phasor sum of $E_f$, $j I_a X_{ar}$, $j I_a X_l$, and $I_a R_a$ yields the terminal voltage $V_t$, clearly showing the pf dependence.

> **Final answer:** Unity pf → cross-magnetising (small voltage drop); lagging pf → demagnetising (large voltage drop); leading pf → magnetising (voltage rise).


---

## Question 92
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 4B | EM-II ELE 2202 Makeup, 13 June 2019

A 1000 kW, 3.3 kV, 24 pole, 50Hz, 3-phase star connected synchronous motor has synchronous reactance of 3.4 Ω per phase and the resistance is negligible. The motor is fed from infinite bus bar at 3.3kV. Its field excitation is adjusted to result in upf operation at rated load. Compute the maximum power and torque that the motor can deliver with its excitation remains constant at this value. (05)

### Answer 92
**Given:**
Rated power $P_{\text{rated}} = 1000\ \text{kW} = 10^6\ \text{W}$, line voltage $V_L = 3.3\ \text{kV} = 3300\ \text{V}$, number of poles $p = 24$, frequency $f = 50\ \text{Hz}$, star connection, synchronous reactance per phase $X_s = 3.4\ \Omega$, negligible resistance. The motor is fed from infinite bus at $3.3\ \text{kV}$ and its excitation is adjusted for unity power factor at rated load. This excitation is held constant.

**Solution:**
1. **Per-phase voltage**
$$
V_{\text{ph}} = \frac{V_L}{\sqrt{3}} = \frac{3300}{\sqrt{3}} \approx 1905.3\ \text{V}.
$$

2. **Rated armature current (unity pf)**
$$
I_a = \frac{P_{\text{rated}}}{\sqrt{3}\,V_L \cos\phi} = \frac{10^6}{\sqrt{3} \times 3300 \times 1} \approx 174.95\ \text{A}.
$$

3. **Excitation emf $E$ (internal voltage)**
For a cylindrical-rotor motor with $R_a \approx 0$:
$$
\vec{V}_{\text{ph}} = \vec{E} + j X_s \vec{I}_a.
$$
Take $V_{\text{ph}}$ as reference and note that $I_a$ is in phase with it (upf). Then
$$
\vec{E} = V_{\text{ph}} - j X_s I_a = 1905.3 - j 3.4 \times 174.95 = 1905.3 - j 594.84\ \text{V}.
$$
Magnitude:
$$
\begin{aligned}
E &= \sqrt{(1905.3)^2 + (594.84)^2} \\
  &\approx \sqrt{3.630 \times 10^6 + 3.538 \times 10^5} \\
  &= \sqrt{3.984 \times 10^6} \approx 1996.0\ \text{V}.
\end{aligned}
$$
This $E$ is kept constant by the fixed field current.

4. **Maximum power (pull-out power)**
For a non-salient-pole machine, the three-phase power is
$$
P = \frac{3\,V_{\text{ph}} E}{X_s} \sin\delta.
$$
Maximum occurs at $\delta = 90^\circ$:
$$
\begin{aligned}
P_{\max} &= \frac{3\,V_{\text{ph}} E}{X_s} \\
         &= \frac{3 \times 1905.3 \times 1996.0}{3.4} \\
         &\approx \frac{1.141 \times 10^7}{3.4} \\
         &\approx 3.355 \times 10^6\ \text{W} = 3.355\ \text{MW}.
\end{aligned}
$$

5. **Synchronous speed**
$$
N_s = \frac{120 f}{p} = \frac{120 \times 50}{24} = 250\ \text{rpm},
\qquad
\omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 250}{60} \approx 26.18\ \text{rad/s}.
$$

6. **Maximum electromagnetic torque**
$$
T_{\max} = \frac{P_{\max}}{\omega_s} = \frac{3.355 \times 10^6}{26.18} \approx 128.2 \times 10^3\ \text{N}\cdot\text{m} = 128.2\ \text{kN}\cdot\text{m}.
$$

> **Final answer:** Maximum power = **3.355 MW**, maximum torque = **128.2 kN·m**.


---

## Question 93
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3C | EM-II ELE 2202 Makeup, 16 June 2017

Explain the effect of load power factor on armature reaction in alternators. (03)

### Answer 93
Armature reaction is the magnetic influence of the armature current on the main field. Its effect on the terminal voltage depends on the load power factor because the armature mmf ($F_a$) shifts in space relative to the field mmf ($F_f$) as the phase of $I_a$ changes with respect to the excitation emf $E_f$.

- **Unity pf load:** $I_a$ is in phase with $E_f$. The mmf $F_a$ is in quadrature with $F_f$, leading to cross-magnetisation. The flux per pole is distorted but its mean value stays almost constant, so the terminal voltage $V_t$ experiences a very small drop.
- **Lagging pf load (inductive):** $I_a$ lags $E_f$. $F_a$ has a demagnetising component that directly weakens the main flux. The reduced flux lowers the induced emf, causing a larger drop in $V_t$.
- **Leading pf load (capacitive):** $I_a$ leads $E_f$. $F_a$ has a magnetising component that strengthens the main flux. The increased flux raises the induced emf and can make $V_t$ exceed the no-load voltage.

These effects are conveniently shown on the Blondel (EMF-MMF) diagram, where the resultant mmf is the phasor sum $F_r = F_f + F_a$. For a lagging load, $|F_r| < |F_f|$ (demagnetising); for a leading load, $|F_r| > |F_f|$ (magnetising). The corresponding phasor diagram for voltage reveals that the synchronous reactance drop $j I_a X_s$ alters the magnitude of $E_f$ required to maintain $V_t$, thus linking the pf directly to voltage regulation.

> **Final answer:** Lagging pf - demagnetising (voltage sag); unity pf - cross-magnetising (small drop); leading pf - magnetising (voltage rise).


---

## Question 94
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5B | EM-II ELE 2202 Makeup, 16 June 2017

A 1000 kW, 3.3 kV, 24 pole, 50Hz, 3-phase star connected synchronous motor has synchronous reactance of 3.4 Ω per phase and the resistance is negligible. The motor is fed from infinite bus bar at 3.3kV. Its field excitation is adjusted to result in upf operation at rated load. Compute the maximum power and torque that the motor can deliver with its excitation remains constant at this value. (05)

### Answer 94
**Given:** A 1000 kW, 3.3 kV, 24-pole, 50 Hz, star-connected synchronous motor with per-phase $X_s = 3.4\ \Omega$, $R_a \approx 0$, operated from infinite bus at 3.3 kV. The excitation is set for unity power factor at rated load and held constant.

**1. Rated armature current and phase voltage**

$$
I_{a,\text{rated}} = \frac{P_{\text{rated}}}{\sqrt{3} V_L} = \frac{1000 \times 10^3}{\sqrt{3} \times 3300} \approx 174.95\ \text{A},
$$
$$
V_{\text{ph}} = \frac{V_L}{\sqrt{3}} = \frac{3300}{\sqrt{3}} \approx 1905.26\ \text{V}.
$$

**2. Excitation EMF under rated upf condition**

With $R_a=0$, the phasor equation is $\mathbf{V} = \mathbf{E} + j I_a X_s$. For upf, $\mathbf{I}_a$ is in phase with $\mathbf{V}$. Taking $\mathbf{V}$ as reference:
$$
\mathbf{E} = V_{\text{ph}} - j I_a X_s = 1905.26 - j 174.95 \times 3.4 = 1905.26 - j 594.83\ \text{V}.
$$
Magnitude:
$$
E = \sqrt{1905.26^2 + 594.83^2} \approx 1995.96\ \text{V}.
$$
The load angle is $\delta \approx 17.34^\circ$.

**3. Maximum power (pull-out power)**

The three-phase power for a round-rotor motor is $P = \frac{3 V_{\text{ph}} E}{X_s}\sin\delta$. Maximum occurs at $\delta = 90^\circ$:
$$
P_{\max} = \frac{3 V_{\text{ph}} E}{X_s} = \frac{3 \times 1905.26 \times 1995.96}{3.4} \approx 3.355 \times 10^6\ \text{W} = 3.355\ \text{MW}.
$$

**4. Maximum torque**

Synchronous speed:
$$
N_s = \frac{120 f}{P} = \frac{120 \times 50}{24} = 250\ \text{rpm},\quad \omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 250}{60} \approx 26.18\ \text{rad/s}.
$$
Maximum torque:
$$
T_{\max} = \frac{P_{\max}}{\omega_s} = \frac{3.355 \times 10^6}{26.18} \approx 1.2817 \times 10^5\ \text{N}\cdot\text{m} = 128.17\ \text{kN}\cdot\text{m}.
$$

> **Final answer:** Maximum power $= 3.355\ \text{MW}$; maximum torque $= 128.17\ \text{kN}\cdot\text{m}$.


---

## Question 95
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2A | EM-II ELE 2225 End Sem, 09 May 2024

A 3-phase, star-connected alternator is rated at 1,600 kVA, 13.5 kV. Its per- phase effective armature resistance & synchronous reactance are 1Ω & 40Ω respectively. a) Calculate the percentage voltage regulation for a load of 1,250 kW at 0.8 pf lagging. b) Draw the phasor diagram for the given load condition. c) Suggest a method to improve the voltage regulation, without any active power loading. 4

### Answer 95
**a) Percentage voltage regulation**

- **Per-phase voltage and current**

$$
V_{\text{ph}} = \frac{13.5\,\text{kV}}{\sqrt{3}} = 7794.2\ \text{V},\quad I_{\text{ph}} = \frac{P}{\sqrt{3}V_L\cos\phi} = \frac{1250\times10^3}{\sqrt{3}\times13500\times0.8} = 66.82\ \text{A}.
$$

The power factor $\cos\phi = 0.8$ lagging → $\phi = \cos^{-1}0.8 = 36.87^\circ$.

- **Synchronous impedance drop**

$\mathbf{Z}_s = 1 + j40\ \Omega \approx 40.012\angle 88.57^\circ\ \Omega$, current $\mathbf{I} = 66.82\angle -36.87^\circ\ \text{A}$. Hence
$$
\mathbf{I}\mathbf{Z}_s = 66.82\angle -36.87^\circ \times 40.012\angle 88.57^\circ = 2673.6\angle 51.70^\circ\ \text{V}.
$$

- **Generated EMF**

Convert $\mathbf{I}\mathbf{Z}_s$ to rectangular form:
$$
\mathbf{I}\mathbf{Z}_s = 2673.6(\cos51.70^\circ + j\sin51.70^\circ) = 1656.2 + j2098.8\ \text{V}.
$$
Add $\mathbf{V}_{\text{ph}} = 7794.2\angle 0^\circ$:
$$
\mathbf{E} = (7794.2 + 1656.2) + j2098.8 = 9450.4 + j2098.8\ \text{V},
$$
$$
|\mathbf{E}| = \sqrt{9450.4^2 + 2098.8^2} \approx 9681.6\ \text{V}.
$$

- **Regulation**

$$
 \frac{| \mathbf{E} | - V_{\text{ph}}}{V_{\text{ph}}} \times 100 = \frac{9681.6 - 7794.2}{7794.2} \times 100 \approx 24.2\%.
$$

**b) Phasor diagram**

Construction: Draw terminal voltage $\mathbf{V}_{\text{ph}}$ horizontally (reference). Draw armature current $\mathbf{I}$ lagging by $\phi=36.87^\circ$. From the tip of $\mathbf{V}$, draw the resistive drop $\mathbf{I}R_a$ parallel to $\mathbf{I}$, then draw the synchronous reactance drop $j\mathbf{I}X_s$ perpendicular to $\mathbf{I}$ (leading it by $90^\circ$). The phasor from the origin to the tip of $j\mathbf{I}X_s$ is the excitation EMF $\mathbf{E}$. The angle $\delta$ between $\mathbf{E}$ and $\mathbf{V}$ is the load angle (≈12.5°).

![Phasor diagram of synchronous generator for lagging pf](https://www.theengineeringknowledge.com/wp-content/uploads/2019/10/Phasor-Diagram-of-a-Synchronous-Generator-at-lagging-p.f.jpg)
*Figure: Phasor diagram of a synchronous generator on lagging power factor load. Source: [The Engineering Knowledge](https://www.theengineeringknowledge.com/phasor-diagram-of-a-synchronous-generator/).*

**c) Improvement of voltage regulation**

To reduce the voltage drop without changing active power, supply leading reactive power at the machine terminals. This can be achieved by:
- Switching shunt capacitor banks across the load or bus,
- Using an over-excited synchronous motor (synchronous condenser) connected in parallel.
Both methods inject leading VARs that partially cancel the lagging VARs drawn by the load, thereby reducing the armature current and the internal $I X_s$ drop, and hence improving voltage regulation.

> **Final answer:** Voltage regulation $= 24.2\%$; improvement by leading VAR compensation (capacitors or over-excited synchronous motor).


---

## Question 96
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 1A | EM-II ELE 2225 Makeup, 26 June 2024

With the aid of EMF-MMF diagram, explain the effect of armature reaction when an alternator is connected to (a) capacitive load (b) Inductive load (c) Lagging load 3

### Answer 96
# Explanation of armature reaction using EMF-MMF diagram

Armature reaction describes the distortion and change in magnitude of the main field flux caused by the armature-current-produced MMF ($F_a$). In a cylindrical-rotor alternator, the resultant air-gap MMF $F_r$ is the vector sum of the field MMF $F_f$ and the armature-reaction MMF $F_a$:
$$
\mathbf{F}_r = \mathbf{F}_f + \mathbf{F}_a.
$$
The induced EMF $E$ (or $E_f$) is proportional to $F_r$ and lags it by $90^\circ$.

![EMF-MMF (Blondel) diagram of a synchronous generator](https://www.poriyaan.in/media/imgPori/images11/Mx5LHEt.png)
*Figure: Phasor diagram of a loaded alternator illustrating armature reaction for lagging, leading, and unity power factor conditions. Source: [eee.poriyaan.in](https://eee.poriyaan.in/topic/phasor-diagram-of-a-loaded-alternator-10170/).*

**(a) Capacitive (leading) load**
- The armature current $I_a$ leads the terminal voltage $V$ by an angle $\phi$.
- The armature MMF $F_a$ is in phase with $I_a$; therefore $F_a$ has a component that aids $F_f$ (magnetizing effect).
- The resultant MMF $F_r$ becomes larger than $F_f$, increasing the induced EMF and tending to raise the terminal voltage.

**(b) Inductive (lagging) load**
- $I_a$ lags $V$ by an angle $\phi$.
- $F_a$ now opposes $F_f$ (demagnetizing effect).
- $F_r$ is smaller than $F_f$, reducing the induced EMF and causing a voltage drop.

**(c) Lagging load**
- A lagging load is synonymous with an inductive load; the armature reaction is demagnetizing, causing a drop in terminal voltage.
- In all cases the cross-component of $F_a$ (perpendicular to $F_f$) causes distortion of the main field, but the net effect on the magnitude of the resultant flux is determined by the power factor.

> **Final answer:** Capacitive load - magnetizing (voltage rise); inductive/lagging load - demagnetizing (voltage drop).


---

## Question 97
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2A | EM-II ELE 2251 End Sem, 31 May 2023

Assume a purely resistive load connected across the terminals of an alternator. Will the voltage regulation of the alternator be zero? Justify your answer. (02)

### Answer 97
No, the voltage regulation is **not zero** for a purely resistive load.

Regulation is defined as
$$
\text{Regulation}\% = \frac{|\vec{E}| - |\vec{V}|}{|\vec{V}|} \times 100\%,
$$
where $\vec{E}$ is the no-load excitation emf (per phase) and $\vec{V}$ is the full-load terminal voltage (per phase). For a cylindrical-rotor alternator,
$$
\begin{aligned}
\vec{E} &= \vec{V} + \vec{I}_a (R_a + jX_s) \\
|\vec{E}| &= \sqrt{ (V + I_a R_a)^2 + (I_a X_s)^2 }.
\end{aligned}
$$

Even with a purely resistive load ( $\vec{I}_a$ in phase with $\vec{V}$ ), the drop $j\vec{I}_a X_s$ is in quadrature with $\vec{V}$, and the drop $\vec{I}_a R_a$ adds directly in phase with $\vec{V}$. Thus $|\vec{E}| > |\vec{V}|$ whenever $I_a > 0$, yielding a positive regulation.

Regulation can be zero only at a specific leading power factor where the capacitive effect exactly cancels the internal impedance drops; that condition does not occur with resistive loading.

> **Final answer:** Voltage regulation is **not zero**; $|\vec{E}| > |\vec{V}|$ because of the quadrature reactance drop and the in-phase resistance drop, giving a positive regulation.


---

## Question 98
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3C | EM-II ELE 2251 End Sem, 31 May 2023

A 3-phase cylindrical rotor alternator operating in a captive plant has a rating of 80 kVA, 440 V. This alternator is supplying power to a drive system at a rated current and 0.75 lagging power factor. Consider an armature resistance of 0.25 Ω per phase and a synchronous reactance of 3.2 ohms per phase. Determine the voltage regulation. (03)

### Answer 98
**Given:** 3-phase, 80 kVA, 440 V (L-L), 0.75 pf lagging,
$R_a = 0.25\,\Omega$/phase, $X_s = 3.2\,\Omega$/phase.

---

**Step 1 - Rated armature current**
$$
I_a = \frac{S}{\sqrt{3}\,V_L} = \frac{80\,000}{\sqrt{3}\times 440} = 104.97\;\text{A}.
$$

**Step 2 - Phase voltage** (star-connected assumed)
$$
V_\text{ph} = \frac{440}{\sqrt{3}} = 254.03\;\text{V}.
$$

**Step 3 - Power factor angle**
$$
\phi = \arccos(0.75) = 41.41^\circ\;(\text{lagging}),\;\text{so } \vec{I}_a = 104.97\angle -41.41^\circ\;\text{A}.
$$

**Step 4 - Synchronous impedance**
$$
\begin{aligned}
Z_s &= R_a + jX_s = 0.25 + j3.2\;\Omega, \\
|Z_s| &= \sqrt{0.25^2 + 3.2^2} = 3.21\;\Omega,\quad
\angle Z_s = \arctan\!\left(\frac{3.2}{0.25}\right) = 85.53^\circ.
\end{aligned}
$$

**Step 5 - Excitation emf** $\vec{E}_f$
With terminal voltage as reference, $\vec{V}_\text{ph} = 254.03\angle 0^\circ$ V.
$$
\begin{aligned}
\vec{I}_a Z_s &= (104.97\angle -41.41^\circ) \times (3.21\angle 85.53^\circ)
              = 336.9\angle 44.12^\circ\;\text{V}, \\
\vec{E}_f &= \vec{V}_\text{ph} + \vec{I}_a Z_s \\
          &= 254.03\angle 0^\circ + 336.9\angle 44.12^\circ \\
          &= (254.03 + 241.9) + j\,234.5 \\
          &= 495.93 + j\,234.5\;\text{V}, \\
|\vec{E}_f| &= \sqrt{495.93^2 + 234.5^2} = 548.6\;\text{V}.
\end{aligned}
$$

**Step 6 - Voltage regulation**
$$
\%\text{Regulation} = \frac{|\vec{E}_f| - V_\text{ph}}{V_\text{ph}} \times 100
                    = \frac{548.6 - 254.03}{254.03} \times 100
                    = 115.95\%.
$$

> **Final answer:** $\boxed{115.95\%}$


---

## Question 99
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 4A | EM-II ELE 2251 End Sem, 31 May 2023

"V" and "inverted V" curves have significant importance in analyzing the behavior of synchronous machines. Justify this statement suitably. Describe the operation of alternator with constant excitation and variable load with suitable phasor diagrams. What is the significance of the condition with minimum excitation? Analyze the relation between power factor and excitation with the help of a suitable curve. (04)

### Answer 99
![V-curves and inverted V-curves](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

**Importance of V and inverted-V curves**
For a synchronous machine operating at constant terminal voltage and constant real power, the armature current $I_a$ plotted against field current $I_f$ traces a "V" shape, while the power factor traces an inverted "V". These curves:
- directly show the effect of excitation on armature reaction and reactive power exchange;
- identify the unity-pf operating point that minimises armature copper loss;
- define the under-excited (lagging pf) and over-excited (leading pf) regions;
- indicate the stability boundary (pull-out) at very low excitation.

**Alternator operation with constant excitation and variable load**
Consider a cylindrical-rotor machine connected to an infinite bus ($V$, $f$ constant) with field current $I_f$ fixed → $|\vec{E}|$ constant. Per phase (neglecting $R_a$),
$$
\begin{aligned}
\vec{E} &= \vec{V} + j\vec{I}_a X_s, \\
P &= \frac{V E}{X_s}\sin\delta,
\end{aligned}
$$
where $\delta$ is the load angle. As real power increases, $\delta$ must increase to maintain $P$. The phasor diagrams for three load types illustrate the armature reaction:
- **Lagging pf (inductive load):** $\vec{I}_a$ lags $\vec{V}$; drop $j\vec{I}_a X_s$ nearly opposes $\vec{V}$ (demagnetising), requiring a larger $\delta$ for the same $P$.
- **Unity pf:** $\vec{I}_a$ in phase with $\vec{V}$; drop is perpendicular (cross-magnetising).
- **Leading pf (capacitive load):** $\vec{I}_a$ leads $\vec{V}$; drop has a component that aids $\vec{V}$ (magnetising); $\delta$ may be smaller or $E$ greater than $V$.

With fixed excitation, the terminal voltage would sag on lagging loads and rise on leading loads if the machine were not held by a stiff bus.

**Significance of minimum excitation**
For a given real power, the *minimum excitation* is the field current at which $\delta$ reaches $90^\circ$. At $\delta = 90^\circ$, $P$ equals the pull-out power $P_{\max} = VE/X_s$. Any further reduction in $I_f$ (hence lower $E$) makes $\delta > 90^\circ$, entering the unstable region and leading to pole-slipping. This condition therefore sets the lower stability limit of the machine.

**Power factor versus excitation - inverted V-curve**
At constant load, as $I_f$ is increased from a low value:
- Under-excited region: $\vec{E}$ lags, armature reaction is demagnetising, machine draws reactive power → lagging pf.
- Normal excitation: $I_a$ reaches minimum, reactive power is zero → unity pf.
- Over-excited region: $\vec{E}$ leads, machine supplies reactive power → leading pf.
The inverted V-curve thus provides a direct mapping between field current and power factor, enabling deliberate control of reactive power flow.

> **Final answer:** V and inverted-V curves are fundamental for analyzing excitation effects, stability, and reactive power. Constant-excitation alternator operation is explained by the phasor relation $\vec{E} = \vec{V} + j\vec{I}_a X_s$ and the power-angle equation; minimum excitation corresponds to the pull-out limit ($\delta = 90^\circ$). The inverted-V curve directly shows the transition from lagging through unity to leading pf with increasing field current.


---

## Question 100
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 4A | EM-II ELE 2251 Grade Improvement, 11 August 2021

A 60 kVA, 381.05 V, 50 Hz, Y - connected alternator has an effective resistance of 0.016 Ω and armature related self-inductance of 0.23 mH. With the help of accurate phasor diagrams and related analysis, determine the induced voltage in the armature delivers rated current at a load power factor of 0.7 leading. (05)

### Answer 100
Given a 60 kVA, 381.05 V (line), 50 Hz, star-connected alternator with $R_a = 0.016\;\Omega$/ph and $L = 0.23\;\text{mH}$ (hence $X_s = \omega L$).

- Phase voltage: $V_{ph} = \dfrac{V_L}{\sqrt{3}} = \dfrac{381.05}{\sqrt{3}} \approx 220\;\text{V}$.
- Full-load phase current: $I_a = \dfrac{S}{\sqrt{3}\,V_L} = \dfrac{60000}{\sqrt{3}\times 381.05} = 90.91\;\text{A}$.
- Synchronous reactance: $X_s = 2\pi f L = 2\pi\times50\times0.23\times10^{-3} = 0.0723\;\Omega$.
- Synchronous impedance: $Z_s = R_a + jX_s = 0.016 + j0.0723 = 0.0741\angle 77.5^\circ\;\Omega$.

Load pf = 0.7 leading → $\phi = \cos^{-1}0.7 = 45.57^\circ$; current leads voltage: $\vec{I}_a = 90.91\angle +45.57^\circ\;\text{A}$ (taking $\vec{V}_{ph}=220\angle0^\circ$ V as reference).

For a generator: $\vec{E} = \vec{V}_{ph} + \vec{I}_a Z_s$.

$$
\begin{aligned}
\vec{I}_a Z_s &= 90.91 \times 0.0741\;\angle(45.57^\circ+77.5^\circ) = 6.73\angle 123.07^\circ\;\text{V} \\
            &= -3.67 + j5.64\;\text{V}.
\end{aligned}
$$

Hence,
$$
\begin{aligned}
\vec{E} &= 220 + (-3.67 + j5.64) = 216.33 + j5.64\;\text{V},\\[2pt]
|E|   &= \sqrt{216.33^2 + 5.64^2} = 216.4\;\text{V/phase}.
\end{aligned}
$$

Voltage regulation $= \dfrac{|E|-V_{ph}}{V_{ph}}\times100\% = -1.64\%$ (negative, so terminal voltage rises on leading load).

**Phasor diagram explanation:** $\vec{V}_{ph}$ is drawn horizontally; $\vec{I}_a$ leads it by $45.57^\circ$; the resistive drop $\vec{I}_a R_a$ is in phase with $\vec{I}_a$; the reactive drop $j\vec{I}_a X_s$ leads $\vec{I}_a$ by $90^\circ$. The vector sum $\vec{V}_{ph} + \vec{I}_a R_a + j\vec{I}_a X_s$ gives $\vec{E}$, which lies behind $\vec{V}_{ph}$ in this leading power-factor case.

> **Final answer:** Induced emf per phase $|E| = 216.4\;\text{V}$; corresponding line emf $E_L = \sqrt{3}\times216.4 \approx 374.7\;\text{V}$.


---

## Question 101
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 2251 Grade Improvement, 11 August 2021

3-phase, star connected alternator is rated 1,600 kVA, 13.5 kV. Its per-phase effective armature resistance & synchronous reactance are 1 & 40 respectively. a) Calculate the percentage voltage regulation for a load of 1,250 kW at 0.8 pf lagging. b) Draw the phasor diagram for the given load. (05)

### Answer 101
Rated data: $S = 1600\;\text{kVA},\; V_L = 13.5\;\text{kV}$, star; $R_a = 1\;\Omega/\text{ph},\; X_s = 40\;\Omega/\text{ph}$.
Load: $P = 1250\;\text{kW}$ at 0.8 lagging.

- Phase voltage (reference): $V_{ph} = \dfrac{13500}{\sqrt{3}} \approx 7794.2\;\text{V}\;(0^\circ)$.
- Apparent load power: $S_{load} = \dfrac{P}{\text{pf}} = \dfrac{1250}{0.8} = 1562.5\;\text{kVA}$.
- Line (and phase) current: $I = \dfrac{S_{load}}{\sqrt{3}\,V_L} = \dfrac{1562.5\times10^3}{\sqrt{3}\times13500} = 66.82\;\text{A}$.
- Power-factor angle: $\phi = \cos^{-1}0.8 = 36.87^\circ$ lagging → $\vec{I} = 66.82\angle -36.87^\circ\;\text{A}$.

Generator equation per phase: $\vec{E} = \vec{V}_{ph} + \vec{I}(R_a + jX_s)$.

Calculate voltage drops:
$$
\begin{aligned}
\vec{I}R_a &= 66.82\angle -36.87^\circ \times 1 = 53.46 - j40.09\;\text{V},\\[2pt]
j\vec{I}X_s &= j40 \times (53.46 - j40.09) = 1603.7 + j2138.3\;\text{V}.
\end{aligned}
$$

Total impedance drop: $(53.46+1603.7) + j(-40.09+2138.3) = 1657.2 + j2098.2\;\text{V}$.

Therefore,
$$
\begin{aligned}
\vec{E} &= 7794.2 + 1657.2 + j2098.2 = 9451.4 + j2098.2\;\text{V},\\
|E|    &= \sqrt{9451.4^2 + 2098.2^2} \approx 9682\;\text{V (phase)}.
\end{aligned}
$$

Voltage regulation $= \dfrac{9682 - 7794.2}{7794.2}\times 100\% \approx 24.2\%$.

**Phasor diagram (lagging pf):**

![Phasor diagram of alternator at lagging pf](https://www.theengineeringknowledge.com/wp-content/uploads/2019/10/Phasor-Diagram-of-a-Synchronous-Generator-at-lagging-p.f.jpg)
*Figure: Phasor diagram of a synchronous generator on lagging power factor load. Source: [The Engineering Knowledge](https://www.theengineeringknowledge.com/phasor-diagram-of-a-synchronous-generator/).*

$\vec{V}_{ph}$ is the reference; $\vec{I}$ lags by $36.9^\circ$; $\vec{I}R_a$ is drawn parallel to $\vec{I}$; $j\vec{I}X_s$ leads $\vec{I}$ by $90^\circ$. Adding these vectors tip-to-tail yields $\vec{E}$.

> **Final answer:** Percentage voltage regulation $= 24.2\%$.


---

## Question 102
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5B | EM-II ELE 2251 Grade Improvement, 11 August 2021

What is the effect of load power factor on the armature reaction in an alternator? A 1500 kVA, 6600 V, 3 - phase, Y - connected alternator with a resistance of 0.4 Ω/phase and synchronous reactance of 6Ω/phase delivers a full - load current at a power factor 0.8 (lagging) and normal rated voltage. Estimate the terminal voltage (line - line) for the same excitation and load current at 0.8 p.f. (leading). (05)

### Answer 102
### Effect of load power factor on armature reaction

The armature reaction in an alternator is the interaction of the armature-produced flux with the main field flux. Its nature depends on the power-factor angle of the load current with respect to the terminal voltage:

- **Lagging pf (inductive load):** The armature current lags the terminal voltage; the armature flux opposes the main flux → **demagnetising** effect. Terminal voltage drops as load increases.
- **Unity pf:** The armature reaction is mainly **cross-magnetising** (distortion of the field); the change in terminal voltage is relatively small.
- **Leading pf (capacitive load):** The armature current leads the terminal voltage; the armature flux aids the main flux → **magnetising** effect. Terminal voltage may rise above the no-load value.

These effects are illustrated in the phasor diagram below.

![Phasor diagram illustrating armature reaction](https://www.poriyaan.in/media/imgPori/images11/Mx5LHEt.png)
*Figure: Phasor diagram of a loaded alternator illustrating armature reaction for lagging, leading, and unity power factor conditions. Source: [eee.poriyaan.in](https://eee.poriyaan.in/topic/phasor-diagram-of-a-loaded-alternator-10170/).*

### Numerical computation

Given: $1500\;\text{kVA},\; 6600\;\text{V}$, Y-connected; $R_a = 0.4\;\Omega/\text{ph},\; X_s = 6\;\Omega/\text{ph}$.

Full-load current (constant for both cases):
$$
I = \frac{S}{\sqrt{3}\,V_L} = \frac{1500\times10^3}{\sqrt{3}\times 6600} = 131.2\;\text{A}.
$$

Rated phase voltage: $V_{ph} = \frac{6600}{\sqrt{3}} = 3810.5\;\text{V}$.

#### Excitation emf at 0.8 lagging
$\phi = \cos^{-1}0.8 = 36.87^\circ$ lag → $\vec{I}_{lag} = 131.2\angle -36.87^\circ\;\text{A}$, $\vec{V}=3810.5\angle0^\circ\;\text{V}$.
$Z_s = 0.4 + j6 = 6.013\angle 86.18^\circ\;\Omega$.

$$
\vec{I}Z_s = 131.2 \times 6.013\;\angle(-36.87^\circ+86.18^\circ) = 788.9\angle 49.31^\circ\;\text{V} = 514.2 + j598.8\;\text{V}.
$$

$$
\vec{E} = 3810.5 + 514.2 + j598.8 = 4324.7 + j598.8\;\text{V},\quad |E| = 4366\;\text{V}.
$$

#### Terminal voltage at 0.8 leading (same excitation)
Now $\vec{I}_{lead} = 131.2\angle +36.87^\circ\;\text{A}$ (taken with respect to unknown $\vec{V}'_{ph}$ as reference).
$\vec{I}Z_s = 131.2 \times 6.013\;\angle(36.87^\circ+86.18^\circ) = 788.9\angle 123.05^\circ\;\text{V} = -429.5 + j661.2\;\text{V}$.

Since $|E| = 4366\;\text{V}$ is unchanged,
$$
4366^2 = (V'_{ph} - 429.5)^2 + 661.2^2.
$$
Solving:
$$
(V'_{ph} - 429.5)^2 = 4366^2 - 661.2^2 = 18.62\times10^6 \;\Rightarrow\; V'_{ph} - 429.5 = \sqrt{18.62\times10^6} = 4315.6\;\text{V}.
$$
Hence $V'_{ph} = 4745.1\;\text{V}$.

Line-to-line terminal voltage:
$$
V'_L = \sqrt{3} \times V'_{ph} = \sqrt{3} \times 4745.1 \approx 8220\;\text{V} = 8.22\;\text{kV}.
$$

> **Final answer:** When the alternator delivers the same full-load current at 0.8 leading pf, the line voltage becomes $8.22\;\text{kV}$. The armature reaction is magnetising for leading loads, which explains the higher terminal voltage compared with the lagging case.


---

## Question 103
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 6B | EM-II ELE 2251 Grade Improvement, 11 August 2021

Using relevant phasor diagram, discuss the behaviour of a cylindrical rotor synchronous motor supplying a constant load but operating under varying excitation conditions. (05)

### Answer 103
When a cylindrical-rotor synchronous motor operates at constant shaft load and constant terminal voltage, the real power input $P$ remains fixed. Neglecting armature resistance, the per-phase phasor equation is

$$
\begin{aligned}
\vec{V} = \vec{E} + jX_s \vec{I}_a
\end{aligned}
$$

where $\vec{V}$ is the terminal voltage (reference), $\vec{E}$ is excitation emf, $\vec{I}_a$ is armature current, and $X_s$ is synchronous reactance.

Since $P = \dfrac{3VE}{X_s}\sin\delta = 3VI_a\cos\varphi$ is constant, the product $E\sin\delta$ and the in-phase current component $I_a\cos\varphi$ remain unchanged. This constraint defines the operating locus in the phasor diagram.

**Phasor diagram construction:**
1. Draw $\vec{V}$ horizontally.
2. For a given excitation, $\vec{I}_a$ is drawn at angle $\varphi$ such that its projection $I_a\cos\varphi$ is constant; thus the tip of $\vec{I}_a$ moves along a vertical constant-power line.
3. The excitation emf $\vec{E} = \vec{V} - jX_s\vec{I}_a$ has a fixed vertical component $E\sin\delta$.

**Operating modes:**
- **Under-excitation** ($|\vec{E}| < |\vec{V}|$): $\vec{I}_a$ lags $\vec{V}$; motor absorbs reactive power.
- **Normal excitation** (unity power factor): $\vec{I}_a$ in phase with $\vec{V}$, armature current minimum.
- **Over-excitation** ($|\vec{E}| > |\vec{V}|$): $\vec{I}_a$ leads $\vec{V}$; motor supplies reactive power.

As field current increases, $I_a$ traces a V-curve (minimum at unity PF) and the power factor vs. excitation gives an inverted V-curve. The over-excited motor acts as a synchronous condenser, delivering reactive power while drawing constant real power.

> **Final answer:** For constant load, varying excitation changes the reactive power exchange but keeps real power constant. The current phasor moves along a constant-power line: lagging when under-excited, minimum at unity PF, leading when over-excited. The motor behaves as a variable reactive compensator.


---

## Question 104
**Topic:** Synchronization and parallel operation of alternators · **Syllabus area:** Week 11 · **Source:** 1C | EM-II ELE 204 End Sem, 13 May 2014

List the necessary conditions to be satisfied while synchronising 3 phase alternators. With neat connection diagram, explain “Two Bright One Dark Lamp method” of synchronisation. (04)

### Answer 104
**Synchronisation Conditions**
Before paralleling a three-phase alternator with live busbars, the following conditions must be satisfied at the closing instant:

1. **Equal line voltages** - the RMS voltage of the incoming machine must match the busbar voltage, adjusted by field excitation.
2. **Equal frequency** - the alternator must be driven at synchronous speed so that its frequency equals the bus frequency.
3. **Identical phase sequence** - the order of phases (e.g., R-Y-B) must be the same; otherwise severe circulating currents occur.
4. **Zero phase difference** - at the moment the breaker closes, the corresponding phase voltages must be in exact phase alignment.

**Two-Bright One-Dark Lamp Method**
This method uses three incandescent lamps as a simple visual indicator.

*Connections (refer to the typical connection diagram):*
- Lamp L₁ connects phase A of the bus directly to phase A′ of the alternator.
- Lamp L₂ connects phase B of the bus to phase C′ of the alternator (cross-connection).
- Lamp L₃ connects phase C of the bus to phase B′ of the alternator (cross-connection).
The alternator is brought to near-synchronous speed and its voltage adjusted. Due to frequency difference, the lamps flicker at the beat frequency. As speed is trimmed, flicker slows.

At the precise moment when bus phase A and alternator phase A′ are in phase, the voltage across L₁ drops to zero → L₁ becomes **dark**. The cross-connections ensure that voltages across L₂ and L₃ are equal in magnitude (line voltage), so both glow with **equal brightness**. This "two-bright, one-dark" pattern confirms correct phase sequence and zero phase-angle error.

The synchronising switch is closed during the middle of the dark period of L₁. The machine then pulls into synchronism and shares the load.

> **Final answer:** Essential conditions: equal voltages, frequencies, identical phase sequence, and zero phase angle. In the lamp method, one lamp is direct-connected and two are cross-connected; when the direct lamp is dark and the cross lamps are equally bright, the systems are in synchronism and can be safely paralleled.


---

## Question 105
**Topic:** Synchronization and parallel operation of alternators · **Syllabus area:** Week 11 · **Source:** 3C | EM-II ELE 204 Makeup, 09 July 2015

Mention the essential conditions to synchronise an incoming alternator with infinite bus system. (03)

### Answer 105
To parallel an incoming alternator with an infinite bus, the following conditions must be met at the synchronising instant:

1. **Equal voltage magnitude:** The terminal voltage of the incoming machine must equal the busbar voltage. This is obtained by adjusting the field current.
2. **Equal frequency:** The alternator's frequency must match the bus frequency. This is controlled by regulating the prime-mover speed.
3. **Identical phase sequence:** The phase rotation (R-Y-B or A-B-C) of the alternator must be the same as that of the bus. A mismatch would cause a sudden short-circuit-like current and severe mechanical stress.
4. **Zero phase-angle difference:** At the instant the circuit breaker closes, the phase angles of corresponding phase voltages must be essentially zero (in-phase coincidence). Even a small angle deviation leads to unwanted power surges and torque pulsations.

These conditions are verified using voltmeters, frequency meters, phase-sequence indicators, synchroscopes, and/or synchronising lamps.

> **Final answer:** Equal voltage magnitude, equal frequency, identical phase sequence, and zero phase-angle difference at the closing instant.


---

## Question 106
**Topic:** Synchronization and parallel operation of alternators · **Syllabus area:** Week 11 · **Source:** 3B | EM-II ELE 2225 Makeup, 26 June 2024

List the necessary conditions to be satisfied while synchronizing 3 phase alternators. With neat connection diagram, explain “Two Bright One Dark Lamp method” of synchronization. 3

### Answer 106
**Necessary conditions for synchronising 3-phase alternators:**
1. **Voltage magnitude:** Terminal voltage of incoming machine must equal bus voltage. Verified with voltmeters.
2. **Frequency:** Machine frequency must match bus frequency. Checked by frequency meters; synchronising lamps flicker rate indicates difference.
3. **Phase sequence:** Same phase order (e.g., R-Y-B). Confirmed with phase-sequence indicator or lamp pattern.
4. **Phase coincidence:** At the instant of closing, the phase angle between machine and bus voltages must be essentially zero. Obtained from synchroscope or lamp method.

**Two-Bright One-Dark lamp method:**
Connect three identical lamps between the incoming alternator and bus:
- One lamp directly between corresponding phases: $R_m$ to $R_b$.
- Two lamps cross-connected: $Y_m$ to $B_b$ and $B_m$ to $Y_b$.

At small frequency difference the lamps flicker cyclically. When the direct lamp $R$ is dark, the voltage across it is zero, so $R_m$ and $R_b$ are exactly in phase. The cross-connected lamps then have equal voltage differences (120 ° apart) and glow with equal brightness. This state-**one dark, two equally bright**-indicates correct phase sequence and the exact synchronising moment. The circuit breaker is closed during this period, preferably when the flicker is slow (frequencies nearly equal).

> **Final answer:** Close the synchronising breaker when one lamp is completely dark, the other two are equally bright, the flicker is slow, and after verifying voltage magnitude and phase sequence.


---

## Question 107
**Topic:** Synchronization and parallel operation of alternators · **Syllabus area:** Week 11 · **Source:** 4B-i | EM-II ELE 2251 Grade Improvement, 11 August 2021

State the conditions to be satisfied for successful synchronisation of an alternator with infinite busbars. Also mention the techniques through which these conditions are ensured to have been met. (part i)

### Answer 107
Successful synchronisation of an alternator with an infinite bus requires:

1. **Equal voltage magnitude**
   The alternator terminal voltage must match the bus voltage to avoid heavy reactive circulating currents. *Checked by:* voltmeters or potential transformers.

2. **Equal frequency**
   The alternator frequency must be the same as the bus frequency; otherwise severe power oscillations occur. *Checked by:* frequency meters; synchronising lamps flicker at the beat frequency, becoming steady when frequencies match.

3. **Identical phase sequence**
   The order of phase voltages (e.g., R-Y-B) must be identical. A wrong sequence subjects the machine to enormous transient torques. *Checked by:* phase-sequence indicator; also by the pattern of synchronising lamps (e.g., two-bright one-dark for correct sequence, all three flickering together for reversed sequence).

4. **Phase coincidence at closing**
   The corresponding phase voltages must be in-phase at the instant the breaker closes (phase angle $\delta \approx 0$). This minimises synchronising current and mechanical stress. *Checked by:* synchroscope (closing when pointer is at the in-phase mark and moving slowly in the "fast" direction), or by the lamp methods (all-dark or two-bright one-dark indicating zero potential difference across the open contacts).

Additionally, the voltage waveforms should be sinusoidal to avoid harmonic circulating currents (normally ensured by design). For large units, an automatic synchronising relay monitors all conditions and issues the closing command.

> **Final answer:** Equal voltage, equal frequency, correct phase sequence, and zero phase-angle difference at closing. Verified respectively by voltmeter/frequency meter, phase-sequence indicator, and synchroscope/synchronising lamps; often supervised by an automatic check synchroniser.


---

## Question 108
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4C | EM-II ELE 204 End Sem, 13 May 2014

Draw a neat connection diagram for measurement of direct and quadrature axis reactance by slip test. (02)

### Answer 108
**Slip test connection for $X_d$ and $X_q$ measurement**
The stator winding of the salient-pole alternator is connected to a low-voltage, balanced three-phase AC supply through a variac. Ammeters, voltmeters and wattmeters (if required) are inserted in the stator circuit. The rotor is mechanically coupled to a drive motor that runs at a speed slightly different from synchronous (a few percent slip). The rotor field winding is left **open-circuited** during the test.

Because of the rotor saliency, the magnetic reluctance seen by the stator field fluctuates as the rotor slips past the synchronously rotating MMF. When the MMF aligns with the direct axis ($d$-axis, minimum air-gap), the reactance is maximum and the stator current falls to a minimum $I_{\min}$. When the MMF is in the quadrature axis ($q$-axis, maximum air-gap), reactance is minimum and the current rises to a maximum $I_{\max}$. The applied voltage must be kept low enough so that $I_{\max}$ does not exceed rated current.

Record the phase voltage $V_{\text{ph}}$ (line-to-neutral) while the machine is at or near the slip speed. The direct-axis and quadrature-axis synchronous reactances are then given by:

$$
\begin{aligned}
X_d &= \frac{V_{\text{ph}}}{I_{\min}} \\
X_q &= \frac{V_{\text{ph}}}{I_{\max}}
\end{aligned}
$$

Because the field is open, the induced field currents are negligible, and the measured reactances are the unsaturated $X_d$ and $X_q$. A wattmeter reading can be used to separate the resistive component if needed.

> **Final answer:** $X_d$ is obtained from minimum armature current, $X_q$ from maximum armature current when the machine runs at a small slip with open field and low applied voltage.


---

## Question 109
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 204 Makeup, 08 July 2014

With the aid of phasor diagram based on Blondel’s two reaction theory, derive an expression for the active power output of a 3 phase Salient pole alternator in terms of excitation emf, terminal voltage, direct and quadrature axis reactance. Neglect armature resistance. (04)

### Answer 109
**Concept:**
In a salient-pole alternator the air-gap is non-uniform, causing the direct-axis synchronous reactance $X_d$ to be larger than the quadrature-axis reactance $X_q$ ($X_d > X_q$). Blondel's two-reaction theory resolves the armature mmf (and current) into a direct-axis component $I_d$ and a quadrature-axis component $I_q$, each acting on the corresponding reactance. Armature resistance is neglected.

**Phasor-diagram construction (lagging pf):**
1. Take terminal voltage $V$ as reference.
2. Draw armature current $I_a$ lagging $V$ by $\phi$.
3. The phasor $E' = V + j X_q I_a$ lies along the q-axis; its angle is the load angle $\delta$. Hence the excitation emf $E_f$ is also along the q-axis, i.e. $E_f = E_f \angle \delta$.
4. The d-axis lags the q-axis by $90^\circ$.
5. Resolve $I_a$ along the axes: $I_q$ (in phase with $E_f$) and $I_d$ (lagging $E_f$ by $90^\circ$).
6. Build the voltage equation: $E_f = V + j X_d I_d + j X_q I_q$.

**Derivation of active power:**
Using the phasor geometry:
- On the d-axis: $0 = -V\sin\delta + X_q I_q \;\Rightarrow\; I_q = \dfrac{V\sin\delta}{X_q}$.
- On the q-axis: $E_f = V\cos\delta + X_d I_d \;\Rightarrow\; I_d = \dfrac{E_f - V\cos\delta}{X_d}$.

Per-phase complex power $S = V I_a^*$. Express $I_a^*$ in terms of d-q components and simplify the real part:

$$
\begin{aligned}
P_{\text{ph}} &= V \bigl( I_q \cos\delta + I_d \sin\delta \bigr) \\[4pt]
&= V\!\left[ \frac{V\sin\delta}{X_q}\cos\delta + \frac{E_f - V\cos\delta}{X_d}\sin\delta \right] \\[4pt]
&= \frac{E_f V}{X_d}\sin\delta + V^2\sin\delta\cos\delta\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right) \\[4pt]
&= \frac{E_f V}{X_d}\sin\delta + \frac{V^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta .
\end{aligned}
$$

For a three-phase alternator, the total active power is three times the per-phase value:

$$
P = \frac{3E_f V}{X_d}\sin\delta + \frac{3V^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta .
$$

The first term is the excitation power (present even in cylindrical-rotor machines); the second term is the **reluctance power** that arises from saliency and can substantially increase the maximum power output.

> **Final answer:**
> $$P = \frac{3E_f V}{X_d}\sin\delta + \frac{3V^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta$$


---

## Question 110
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 204 Makeup, 09 July 2015

A 5 MVA, 6.6 KV, 3- phase, 6.6 KV 50 Hz, star connected salient pole alternator is connected to an infinite bus. The direct axis reactance is 12 Ω while that of quadrature axis is 9.5 Ω per phase. The armature resistance is 1.5 Ω per phase. When the generator is operating at rated MVA at 0.9 pf lagging, calculate the electromagnetic power developed and reluctance power. (05)

### Answer 110
**Given:**
- $S = 5\ \text{MVA}$, $V_L = 6.6\ \text{kV}$, star connection, $f = 50\ \text{Hz}$.
- $X_d = 12\ \Omega$, $X_q = 9.5\ \Omega$, $R_a = 1.5\ \Omega$ per phase.
- Operating at rated MVA, $0.9$ pf lagging.

**Solution:**

1. **Per-phase voltage and current:**
   $$V_{\text{ph}} = \frac{6600}{\sqrt{3}} = 3810.5\ \text{V},$$
   $$I_a = \frac{5 \times 10^6}{\sqrt{3} \times 6600} = 437.39\ \text{A}.$$

2. **Power factor angle:**
   $$\phi = \cos^{-1} 0.9 = 25.84^\circ\ (\text{lagging}).$$

3. **Output active power:**
   $$P_{\text{out}} = S \cdot \text{pf} = 5 \times 0.9 = 4.5\ \text{MW}.$$

4. **Stator copper loss and electromagnetic power:**
   $$P_{\text{cu}} = 3 I_a^2 R_a = 3 \times (437.39)^2 \times 1.5 = 0.8609\ \text{MW}.$$
   $$\boxed{P_{\text{em}} = P_{\text{out}} + P_{\text{cu}} = 4.5 + 0.8609 = 5.3609\ \text{MW}}.$$

5. **Load angle $\delta$ (neglecting $R_a$ for this step):**
   The q-axis is located by the phasor $V_{\text{ph}} + j X_q I_a$, giving
   $$\tan \delta = \frac{I_a X_q \cos\phi}{V_{\text{ph}} + I_a X_q \sin\phi}.$$
   $$I_a X_q = 437.39 \times 9.5 = 4155.2\ \text{V}.$$
   Numerator: $4155.2 \times 0.9 = 3739.7\ \text{V}.$
   Denominator: $3810.5 + 4155.2 \times 0.4359 = 3810.5 + 1811.5 = 5622\ \text{V}.$
   $$\tan \delta = \frac{3739.7}{5622} = 0.6652 \;\Rightarrow\; \delta = 33.62^\circ.$$

6. **Reluctance power (three-phase):**
   $$P_{\text{rel}} = \frac{3 V_{\text{ph}}^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta.$$
   Compute:
   $$\frac{1}{X_q} - \frac{1}{X_d} = \frac{1}{9.5} - \frac{1}{12} = 0.02193\ \Omega^{-1},$$
   $$V_{\text{ph}}^2 = (3810.5)^2 = 14.52 \times 10^6\ \text{V}^2,$$
   $$\frac{3}{2}V_{\text{ph}}^2 = 1.5 \times 14.52\times 10^6 = 21.78\times 10^6,$$
   $$\sin 2\delta = \sin(67.24^\circ) = 0.922.$$
   $$P_{\text{rel}} = 21.78\times 10^6 \times 0.02193 \times 0.922 \approx 0.440\times 10^6\ \text{W} = \mathbf{0.44\ \textbf{MW}}.$$

Thus, the electromagnetic power developed is **5.36 MW**, of which **0.44 MW** is the reluctance power (the remainder 4.92 MW comes from field excitation).

> **Final answer:** Electromagnetic power developed $= 5.36\ \text{MW}$; reluctance power $= 0.44\ \text{MW}$.


---

## Question 111
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 End Sem, 10 May 2016

Explain Blondel’s two reaction theory for Salient Pole Alternator. Derive the circuit model and sketch the phasor diagram showing the relationship between terminal voltage and internal voltage. (05)

### Answer 111
**Concept:**
In a salient-pole alternator the air gap is not uniform; the direct-axis (d-axis, along the pole centre) presents a path of minimum reluctance, while the quadrature-axis (q-axis, midway between poles) has maximum reluctance. Consequently the synchronous reactance is not constant: the direct-axis synchronous reactance $X_d$ is larger than the quadrature-axis reactance $X_q$ ($X_d > X_q$). A single-reactance model is therefore inadequate.

Blondel's two-reaction theory overcomes this by resolving the armature magneto-motive force (and hence the armature current $I_a$) into two components:

- **$I_d$** - the direct-axis component, acting on $X_d$ and producing a demagnetising or magnetising effect.
- **$I_q$** - the quadrature-axis component, acting on $X_q$ and producing a cross-magnetising effect.

**Circuit model (per phase, $R_a$ neglected):**
The excitation emf $E_f$ corresponds to the flux produced by the field winding; it lies along the q-axis. The terminal voltage $V$ is the reference. The voltage equation becomes

$$
E_f = V + j X_d I_d + j X_q I_q .
$$

This is the basic two-reaction circuit model of a salient-pole alternator.

**Phasor diagram (lagging power factor):**
1. Draw $V$ horizontally as the reference phasor.
2. Draw the armature current $I_a$ lagging $V$ by the power factor angle $\phi$.
3. Locate the q-axis: the phasor $E' = V + j X_q I_a$ lies exactly on the q-axis; its angle is the load angle $\delta$. Hence the excitation emf $E_f$ is also on the q-axis (angle $\delta$ from $V$).
4. The d-axis lags the q-axis by $90^\circ$ (angle $\delta - 90^\circ$).
5. Resolve $I_a$ into $I_q$ (projection on the q-axis) and $I_d$ (projection on the d-axis).
6. Complete the voltage polygon: from the tip of $V$, add the q-axis voltage drop $j X_q I_q$ (perpendicular to $I_q$), then add the d-axis drop $j X_d I_d$ (perpendicular to $I_d$). The resultant is $E_f$.

The completed phasor diagram clearly shows $V$, $E_f$, the load angle $\delta$, and the orthogonal current components $I_d$ and $I_q$. It illustrates that because $X_d \neq X_q$, the armature reaction voltage is not simply $j X_s I_a$, and the machine exhibits a saliency-dependent reluctance torque (power) component.

> **Final answer:** Blondel's two-reaction theory models a salient-pole alternator by resolving armature current into d- and q-axis components, each acting on its own synchronous reactance. The circuit equation is $E_f = V + j X_d I_d + j X_q I_q$. The phasor diagram is constructed by locating the q-axis with $V + j X_q I_a$, adding the appropriate voltage drops, and showing the relationship between terminal voltage $V$ and internal excitation emf $E_f$.


---

## Question 112
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 End Sem, 23 April 2018

With a neat diagram, explain an experimental procedure to determine the Xd and Xq of a salient pole alternator. (04)

### Answer 112
**Concept:** In a salient-pole alternator the air-gap is non-uniform, so the armature reaction reactance depends on the position of the rotor. Blondel's two-reaction theory resolves the armature m.m.f. into direct-axis (d-axis) and quadrature-axis (q-axis) components, each experiencing a different magnetic reluctance. The unsaturated direct-axis synchronous reactance $X_d$ and quadrature-axis synchronous reactance $X_q$ are determined by the slip test.

![Salient-pole generator cross-section](https://circuitglobe.com/wp-content/uploads/2016/01/two-reaction-theory-fig-1.jpg)
*Figure: Two-reaction model of salient-pole synchronous machine showing direct (d) and quadrature (q) axes. Source: [Circuit Globe](https://circuitglobe.com/two-reaction-theory-salient-pole-synchronous-machine.html).*

**Experimental Setup:**
- The three-phase stator winding is connected to a low-voltage variable AC supply (via a variac). An ammeter in one line measures line current; a voltmeter across the terminals measures line voltage.
- The rotor field winding is kept **open-circuited**.
- The rotor is coupled to a variable-speed prime mover (e.g., a D.C. motor) that drives it at a speed slightly different from synchronous speed $n_s$, giving a small slip $s = (n_s - n)/n_s$, typically $0.5$ to $1\%$.

**Procedure:**
1. **Apply a low voltage** (about $20$-$30\%$ of rated value) to the stator. This avoids excessive currents when the machine presents its low q-axis reactance.
2. **Run the rotor at near-synchronous speed.** Because the rotating stator field slips slowly past the salient pole rotor, the magnetic reluctance seen by the stator m.m.f. varies periodically.
3. **Observe the armature current swings.** When the stator m.m.f. aligns with the d-axis (centre of a pole), the air-gap is smallest, the reactance is highest, and the line current drops to a **minimum** $I_{\min}$. When alignment is with the q-axis (inter-polar space), the large air-gap gives a low reactance and a **maximum** current $I_{\max}$.
4. **Record** $I_{\min}$, $I_{\max}$ and the corresponding r.m.s. phase voltage $V_\text{ph}$. For a star-connected stator, $V_\text{ph} = V_\text{line} / \sqrt{3}$.
5. **Calculate the reactances** neglecting the small armature resistance:
   $$
   X_d = \frac{V_\text{ph}}{I_{\min}} \quad \text{(unsaturated direct-axis synchronous reactance)},
   $$
   $$
   X_q = \frac{V_\text{ph}}{I_{\max}} \quad \text{(unsaturated quadrature-axis synchronous reactance)}.
   $$

**Precautions:**
- Keep the applied voltage low to prevent over-current.
- Ensure the field winding is open; a closed field would produce synchronising torque and prevent slip.
- Maintain a steady speed to obtain clear, steady current pulses.

> **Final answer:** The slip test yields unsaturated $X_d$ and $X_q$ from the measured minimum and maximum armature currents under low-voltage, open-field operation at a small slip speed.


---

## Question 113
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 3C | EM-II ELE 2202 End Sem, 24 April 2017

Draw the connection diagram of slip test and briefly explain its significance. (03)

### Answer 113
**Connection Diagram:**
- Stator terminals connected in star (or delta) to a three-phase low-voltage supply via a variac. An ammeter is placed in one line and a voltmeter across any two lines to read line quantities.
- The rotor field winding is **left open-circuited**.
- The rotor shaft is coupled to a variable-speed d.c. motor (or other prime mover) that can drive it at a speed $n$ slightly different from the synchronous speed $n_s$. The slip $s = (n_s-n)/n_s$ is kept in the range $0.5$-$1\%$.

**Significance:**
- The slip test is the only simple, non-destructive laboratory method to separate the two axis synchronous reactances $X_d$ and $X_q$ of a salient-pole machine.
- $X_d$ and $X_q$ are the fundamental parameters required by Blondel's two-reaction theory. They are essential for
  - constructing accurate phasor diagrams,
  - calculating voltage regulation under any load condition,
  - drawing the power-angle characteristic and assessing steady-state stability,
  - determining the reluctance torque and the power developed.
- Without knowledge of $X_d$ and $X_q$, the behaviour of a salient-pole alternator or motor cannot be accurately predicted because the magnetic asymmetry strongly influences its performance.
- Since the test is performed at low voltage and with open field, it gives the unsaturated values of the reactances; these can later be combined with open- and short-circuit test data to obtain saturated values.

> **Final answer:** The slip test connection is a low-voltage, open-field setup with the rotor driven at a small slip; it provides $X_d$ and $X_q$, indispensable for analysing salient-pole synchronous machines.


---

## Question 114
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 End Sem, 24 April 2017

A three-phase, 20 MVA, 11 kV, 50 Hz star-connected alternator has Xd = 4 Ω and Xq = 3 Ω. Armature resistance is negligibly small. At full load, 0.8 lagging power factor, determine: a) Direct and quadrature axes components of the armature current. b) Excitation emf. c) Voltage regulation. d) Electromagnetic power. e) Reluctance power. (07)

### Answer 114
**Given:** $S = 20\,\text{MVA}$, $V_\text{L} = 11\,\text{kV}$, star-connected, $X_d = 4\,\Omega$, $X_q = 3\,\Omega$, $R_a \approx 0$, full-load p.f. $0.8$ lagging.

**Preliminary quantities:**
$$
V_\text{ph} = \frac{11000}{\sqrt{3}} = 6350.85\,\text{V}, \quad
I_a = \frac{20 \times 10^6}{\sqrt{3}\times 11000} = 1049.73\,\text{A}, \quad
\phi = \cos^{-1}0.8 = 36.87^\circ \,(\sin\phi = 0.6).
$$

**(a) Direct- and quadrature-axis current components**
Taking terminal voltage $\mathbf{V}_\text{ph}$ as reference ($\angle 0^\circ$), the voltage behind quadrature reactance is
$$
\mathbf{E}_q = \mathbf{V}_\text{ph} + j X_q \mathbf{I}_a = (V_\text{ph} + X_q I_a \sin\phi) + j X_q I_a \cos\phi.
$$
The angle of $\mathbf{E}_q$ is the load angle $\delta$:
$$
\tan\delta = \frac{X_q I_a \cos\phi}{V_\text{ph} + X_q I_a \sin\phi}
          = \frac{3 \times 1049.73 \times 0.8}{6350.85 + 3 \times 1049.73 \times 0.6}
          = 0.30573,\quad \delta = 17.00^\circ.
$$
Projecting the armature current onto the rotor axes:
$$
I_d = I_a \sin(\phi+\delta) = 1049.73 \sin(53.87^\circ) = 847.85\,\text{A},
$$
$$
I_q = I_a \cos(\phi+\delta) = 1049.73 \cos(53.87^\circ) = 618.94\,\text{A}.
$$

**(b) Excitation e.m.f.**
From the phasor diagram (ignoring resistance),
$$
E_f = V_\text{ph} \cos\delta + X_d I_d
    = 6350.85 \cos 17^\circ + 4 \times 847.85
    = 6074.6 + 3391.4 = 9466.0\,\text{V/phase}.
$$
Line-to-line value: $\sqrt{3} \times 9466 = 16.39\,\text{kV}$.

**(c) Voltage regulation**
$$
\%\text{Reg} = \frac{E_f - V_\text{ph}}{V_\text{ph}} \times 100
            = \frac{9466 - 6350.85}{6350.85} \times 100
            = 49.05\% \approx 49.0\%.
$$

**(d) Electromagnetic power**
Because $R_a = 0$, all terminal power is developed across the air-gap:
$$
P_\text{em} = P_\text{out} = \sqrt{3}\,V_\text{L} I_a \cos\phi = 20 \times 10^6 \times 0.8 = 16\,\text{MW}.
$$

**(e) Reluctance power**
The power component arising solely from saliency is
$$
P_\text{rel} = \frac{3 V_\text{ph}^2}{2} \left(\frac{1}{X_q} - \frac{1}{X_d}\right) \sin 2\delta.
$$
Evaluating:
$$
V_\text{ph}^2 = 40.333 \times 10^6,\quad
\frac{1}{X_q} - \frac{1}{X_d} = \frac{1}{3} - \frac{1}{4} = \frac{1}{12} = 0.08333,\quad
\sin 2\delta = \sin 34^\circ = 0.5592,
$$
$$
P_\text{rel} = 1.5 \times 40.333 \times 10^6 \times 0.08333 \times 0.5592 = 2.82 \times 10^6\,\text{W} = 2.82\,\text{MW}.
$$

> **Final answer:** (a) $I_d = 847.9\,\text{A}$, $I_q = 618.9\,\text{A}$; (b) $E_f = 9.466\,\text{kV/phase}$ (or $16.39\,\text{kV line}$); (c) Voltage regulation $= 49.0\%$; (d) $P_\text{em}=16\,\text{MW}$; (e) $P_\text{rel}=2.82\,\text{MW}$.


---

## Question 115
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 End Sem, 29 April 2019

What is the significance of reluctance power in salient pole synchronous machines? Discuss with power-angle characteristics. (03)

### Answer 115
In a salient-pole synchronous machine, the non-uniform air gap makes the direct-axis reactance $X_d$ larger than the quadrature-axis reactance $X_q$. Blondel's two-reaction theory resolves the armature current into $I_d$ and $I_q$ components and expresses the total three-phase electromagnetic power as
$$
\begin{aligned}
P &= \frac{3E_f V}{X_d}\sin\delta + \frac{3V^2}{2}\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta,
\end{aligned}
$$
where $E_f$ is the excitation emf per phase, $V$ is the terminal voltage per phase, and $\delta$ is the load (power) angle. The second term, $P_{\text{rel}} = \frac{3V^2}{2}\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta$, is the **reluctance power**.

**Significance of reluctance power:**

1. **Existence without field excitation:** $P_{\text{rel}}$ depends only on $V^2$ and the reactance difference. Hence the machine can develop torque and operate as a reluctance motor/generator even when the field current is zero ($E_f = 0$).
2. **Alters the power-angle curve:** The $\sin 2\delta$ component peaks at $\delta = 45^\circ$ (whereas the excitation term peaks at $90^\circ$). When superimposed, the resultant peak power occurs at a load angle smaller than $90^\circ$, and the magnitude of the maximum power is increased. This raised power limit is a distinctive feature of salient-pole machines.
3. **Improved stability:** Because the maximum power is reached at a smaller $\delta$, the synchronising power coefficient $dP/d\delta$ (the slope of the power-angle curve) is larger at normal operating points. This gives greater restoring torque per unit change in load angle, enhancing both steady-state and transient stability.
4. **Additional power output:** Even at a fixed excitation, the machine can deliver more active power than a cylindrical-rotor machine having the same $X_d$, because the saliency contribution adds to the excitation power.
5. **Flexible operation:** The reluctance power assists in keeping the rotor in synchronism under varying loads and allows the machine to operate at leading, lagging or unity power factor by adjusting the field current.

These features make the reluctance power a fundamental property of salient-pole synchronous machines, exploited in reluctance motors and in power system stability.

> **Final answer:** Reluctance power is the component $P_{\text{rel}} = \frac{3V^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\!\sin 2\delta$ that arises from the difference between $X_d$ and $X_q$. It enables torque production without field excitation, shifts the peak of the power-angle curve to $\delta < 90^\circ$, raises the steady-state power limit, increases the synchronising power coefficient, and contributes to the total output of the machine.


---

## Question 116
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 Makeup, 02 July 2016

A 10 kVA, 3 phase, 400 V, 50 Hz, star connected salient pole alternator has direct and quadrature axes reactance of 5 Ω and 2 Ω respectively. When it is delivering full load at 0.8 p.f lag to an infinite bus, determine the electromagnetic power and reluctance power. 5M

### Answer 116
**Given:** $S = 10 \text{ kVA}$, $V_L = 400 \text{ V}$, $f = 50 \text{ Hz}$, star connection, $X_d = 5 \ \Omega$, $X_q = 2 \ \Omega$, $\cos\phi = 0.8$ lag. Armature resistance is neglected.

**Step 1: Per-phase quantities**
$$
\begin{aligned}
V_{\text{ph}} &= \frac{V_L}{\sqrt{3}} = \frac{400}{\sqrt{3}} = 230.94 \text{ V},\\[2pt]
I_a &= \frac{S}{\sqrt{3}\,V_L} = \frac{10\,000}{\sqrt{3}\times 400} = 14.434 \text{ A}.
\end{aligned}
$$

**Step 2: Load angle $\delta$ (salient-pole generator, $R_a = 0$)**
For a lagging load,
$$
\tan\delta = \frac{I_a X_q \cos\phi}{V_{\text{ph}} + I_a X_q \sin\phi}.
$$
Substituting:
$$
\tan\delta = \frac{14.434 \times 2 \times 0.8}{230.94 + 14.434 \times 2 \times 0.6}
= \frac{23.094}{248.261} = 0.0930 \;\Rightarrow\; \delta = 5.315^\circ.
$$

**Step 3: Reluctance power**
From Blondel's power formula, the three-phase reluctance power is
$$
\begin{aligned}
P_{\text{rel}} &= \frac{3 V_{\text{ph}}^2}{2}\!
\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta \\[2pt]
&= \frac{3 \times (230.94)^2}{2}\!
\left(\frac{1}{2} - \frac{1}{5}\right) \sin(2 \times 5.315^\circ) \\[2pt]
&= \frac{3 \times 53\,333}{2} \times 0.3 \times \sin 10.63^\circ \\[2pt]
&= 79\,999.5 \times 0.3 \times 0.1845 \approx 4\,428 \text{ W}.
\end{aligned}
$$
Hence $P_{\text{rel}} \approx 4.43 \text{ kW}$.

**Electromagnetic power:** With armature resistance neglected, the total three-phase electromagnetic power equals the terminal active power:
$$
P_{\text{em}} = S \cos\phi = 10 \times 0.8 = 8 \text{ kW}.
$$
(One can verify by computing $E_f$ and using $P_{\text{em}} = P_{\text{exc}} + P_{\text{rel}}$, which yields the same 8 kW.)

> **Final answer:** Electromagnetic power = $8 \text{ kW}$; reluctance power $\approx 4.43 \text{ kW}$.


---

## Question 117
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 Makeup, 13 June 2019

Draw and explain the phasor diagram of salient pole alternator based on Blondel’s two reaction theory. (05)

### Answer 117
**Blondel's two-reaction theory** accounts for the magnetic asymmetry of salient-pole alternators by resolving the armature current $I_a$ into a direct-axis component $I_d$ (along the field pole axis) and a quadrature-axis component $I_q$ (midway between poles). Each component encounters a different synchronous reactance, $X_d$ and $X_q$ ($X_d > X_q$). The phasor diagram for a generator supplying a lagging load, with armature resistance neglected, is constructed as follows:

1. **Reference:** Draw the terminal voltage $V$ horizontally (reference phasor).
2. **Load current:** Draw $I_a$ lagging $V$ by the power-factor angle $\phi$.
3. **Rotor axes:** The direct axis (d-axis) is located at an angle $\delta$ (load/torque angle) *ahead* of $V$; the quadrature axis (q-axis) is $90^\circ$ (electrical) ahead of the d-axis.
4. **Resolve $I_a$:** The angle between $I_a$ and the q-axis is $\psi = \phi + \delta$. Then:
   - $I_q = I_a \cos\psi$ (along the q-axis, usually drawn as the in-phase component that produces torque),
   - $I_d = I_a \sin\psi$ (along the d-axis, demagnetising for lagging pf).
5. **Add voltage drops:** From the tip of $V$, draw $j X_q I_q$ (perpendicular to the q-axis, leading $I_q$ by $90^\circ$). From the tip of that resultant, draw $j X_d I_d$ (perpendicular to the d-axis, leading $I_d$ by $90^\circ$).
6. **Excitation emf:** The sum of these phasors gives the excitation emf $E_f$, which lies exactly on the d-axis:
   $$
   E_f = V + j X_d I_d + j X_q I_q .
   $$

![Phasor diagram of salient-pole alternator](https://www.electricalengineeringinfo.com/wp-content/uploads/2016/12/New2BDoc2B1_2.png)
*Figure: Phasor diagram of salient-pole alternator illustrating Blondel two-reaction theory with direct (d) and quadrature (q) axis components. Source: [Electrical Engineering Info](https://www.electricalengineeringinfo.com/2016/12/blondel-two-reaction-theory-salient-pole-alternators.html).*

The diagram clearly shows that because $X_d \neq X_q$, the voltage regulation and power-angle behaviour depend on both the magnitude and the phase of the armature current. The load angle $\delta$ between $V$ and $E_f$ is smaller than in an equivalent cylindrical-rotor machine, and the phasor composition provides the foundation for calculating power components (excitation power and reluctance power) in salient-pole synchronous generators.

> **Final answer:** The salient-pole alternator phasor diagram is built by resolving $I_a$ into $I_d$ and $I_q$, adding the separate reactive drops $j X_d I_d$ and $j X_q I_q$ to the terminal voltage $V$, and arriving at the excitation emf $E_f = V + j X_d I_d + j X_q I_q$. The two-reaction diagram highlights the influence of saliency on voltage regulation, load angle, and power development.


---

## Question 118
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 Makeup, 13 June 2019

What is meant by reluctance power in salient pole synchronous machines? Discuss with power-angle characteristics. (03)

### Answer 118
**Reluctance power** is the active power component in a salient-pole synchronous machine that arises solely from the magnetic asymmetry between the direct and quadrature axes ($X_d > X_q$). Because the rotor has salient poles, the air-gap reluctance along the d-axis (aligned with the field winding) is lower than along the q-axis. When the armature current is resolved into direct-axis ($I_d$) and quadrature-axis ($I_q$) components according to Blondel's two-reaction theory, the different synchronous reactances $X_d$ and $X_q$ produce a net torque that tends to align the rotor with the stator rotating field, even with zero field excitation. This torque corresponds to the reluctance power.

**Power-angle characteristic**
Neglecting armature resistance, the per-phase power is

$$
\begin{aligned}
P = \frac{E_f V}{X_d} \sin \delta + \frac{V^2}{2} \left( \frac{1}{X_q} - \frac{1}{X_d} \right) \sin 2\delta
\end{aligned}
$$

For a three-phase machine the total power is three times the above.

- The **first term** $\frac{E_f V}{X_d}\sin\delta$ is the excitation power, also present in cylindrical-rotor machines.
- The **second term** is the **reluctance power**, proportional to $\sin 2\delta$ and to the saliency factor $(1/X_q - 1/X_d)$.

Key points:
- Reluctance power reaches a maximum at $\delta = 45^\circ$ (for the reluctance component alone).
- It exists even when $E_f = 0$, allowing the machine to develop torque without field current.
- It adds a second-harmonic component to the power-angle curve, increasing the maximum power and shifting the peak to an angle $\delta < 90^\circ$, thereby improving steady-state stability.
- In cylindrical-rotor machines $X_d = X_q$, so the reluctance term vanishes.

Thus, reluctance power is a saliency-produced power component that enhances the performance and stability of salient-pole synchronous machines.

![Salient-pole generator rotor showing direct and quadrature axes](https://circuitglobe.com/wp-content/uploads/2016/01/two-reaction-theory-fig-1.jpg)
*Figure: Two-reaction model of salient-pole synchronous machine showing direct (d) and quadrature (q) axes. Source: [Circuit Globe](https://circuitglobe.com/two-reaction-theory-salient-pole-synchronous-machine.html).*

> **Final answer:** Reluctance power is the component of active power arising from saliency, given by $\frac{3V^2}{2}\bigl(\frac{1}{X_q} - \frac{1}{X_d}\bigr)\sin 2\delta$. It is zero when $X_d = X_q$, reaches a maximum at $\delta = 45^\circ$, exists without field excitation, and improves the power capability and stability of salient-pole machines.


---

## Question 119
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4B | EM-II ELE 2202 Makeup, 16 June 2017

Draw and explain the phasor diagram of salient pole alternator based on Blondel’s two reaction theory. (03)

### Answer 119
**Concept**
In a salient-pole alternator the air-gap is non-uniform, giving two different synchronous reactances: direct-axis $X_d$ and quadrature-axis $X_q$. Blondel's two-reaction theory resolves the armature current $I_a$ into a direct-axis component $I_d$ and a quadrature-axis component $I_q$. The per-phase phasor equation (ignoring $R_a$) is
$$
\mathbf{E_f} = \mathbf{V} + j X_d \mathbf{I_d} + j X_q \mathbf{I_q}.
$$

**Phasor-diagram construction (generator supplying a lagging load)**
1. Take terminal voltage $\mathbf{V}$ as reference along the horizontal.
2. Draw armature current $\mathbf{I_a}$ lagging $\mathbf{V}$ by the power-factor angle $\phi$.
3. Determine the quadrature axis: for generator action the excitation emf $\mathbf{E_f}$ lies on the direct axis and leads $\mathbf{V}$ by the load angle $\delta$. The q-axis is $90^\circ$ ahead of the d-axis in the direction of rotation.
4. Resolve $\mathbf{I_a}$ onto the d- and q-axes:
   $$
   I_q = I_a \cos(\delta + \phi), \qquad I_d = I_a \sin(\delta + \phi).
   $$
5. Add the quadrature-axis reactance drop: from the tip of $\mathbf{V}$, draw $j X_q \mathbf{I_q}$; this phasor leads $\mathbf{I_q}$ by $90^\circ$ and lies along the d-axis, thereby fixing the q-axis direction.
6. Add the direct-axis reactance drop: from the end of $j X_q \mathbf{I_q}$, draw $j X_d \mathbf{I_d}$ leading $\mathbf{I_d}$ by $90^\circ$ (parallel to the q-axis). The resultant of $\mathbf{V} + j X_q \mathbf{I_q} + j X_d \mathbf{I_d}$ equals the excitation emf $\mathbf{E_f}$.
7. The power (or load) angle $\delta$ appears as the angle between $\mathbf{V}$ and $\mathbf{E_f}$.

For a lagging load, $I_d$ is demagnetising (opposes $\mathbf{E_f}$), while $I_q$ produces torque. The diagram clearly shows the two different reactance drops, which gives rise to reluctance torque-a distinctive feature of salient-pole machines.

> **Final answer:** The phasor diagram of a salient-pole alternator (generator) based on Blondel's two-reaction theory is obtained by resolving the armature current into $I_d$ and $I_q$, then forming the vector sum $\mathbf{E_f} = \mathbf{V} + j X_q \mathbf{I_q} + j X_d \mathbf{I_d}$. The construction is stepwise: set $\mathbf{V}$ as reference, resolve $I_a$, add $j X_q I_q$ to locate the q-axis, add $j X_d I_d$ to obtain $\mathbf{E_f}$, and read $\delta$ from the diagram.


---

## Question 120
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 Makeup, 19 June 2018

Based on Blondel’s two reaction theory, develop the phasor diagram of a salient pole synchronous generator. (04)

### Answer 120
**Two-reaction theory**
Because the salient-pole synchronous machine has a non-uniform air-gap, the magnetic circuits along the direct (d) and quadrature (q) axes have different reluctances. Consequently, two synchronous reactances are defined: $X_d$ (direct-axis) and $X_q$ (quadrature-axis), with $X_d > X_q$. Blondel's theory handles the anisotropy by resolving the armature mmf (or current) into d- and q-axis components.

**Per-phase equivalent**
Neglecting armature resistance, the phasor equation for a generator is
$$
\mathbf{E_f} = \mathbf{V} + j X_d \mathbf{I_d} + j X_q \mathbf{I_q}
$$
where
$\mathbf{E_f}$ = excitation emf (lies on the d-axis),
$\mathbf{V}$ = terminal voltage,
$\mathbf{I_a}$ = armature current,
$\mathbf{I_d}$, $\mathbf{I_q}$ = components of $\mathbf{I_a}$ along the d- and q-axes.

**Constructing the phasor diagram (generator, lagging pf)**
1. Draw $\mathbf{V}$ horizontally as the reference phasor.
2. Draw $\mathbf{I_a}$ at an angle $\phi$ behind $\mathbf{V}$ (lagging load).
3. The d-axis is the direction of $\mathbf{E_f}$, which for a generator leads $\mathbf{V}$ by the load angle $\delta$. The q-axis leads the d-axis by $90^\circ$.
4. Resolve $\mathbf{I_a}$:
   - $I_q = I_a \cos\psi$, $I_d = I_a \sin\psi$, where $\psi = \delta + \phi$ is the angle between $\mathbf{I_a}$ and the q-axis.
5. From the tip of $\mathbf{V}$, add the phasor $j X_q \mathbf{I_q}$ (leading $\mathbf{I_q}$ by $90^\circ$). This drop is parallel to the d-axis and determines the q-axis direction.
6. From the new point, add $j X_d \mathbf{I_d}$ (leading $\mathbf{I_d}$ by $90^\circ$). The resultant is $\mathbf{E_f}$.
7. The angle $\delta$ between $\mathbf{V}$ and $\mathbf{E_f}$ is the load (power) angle.

*Alternative approach:* first compute $\mathbf{E_q} = \mathbf{V} + j X_q \mathbf{I_a}$ to locate the q-axis, then obtain $I_d$, $I_q$, and finally $\mathbf{E_f} = \mathbf{E_q} + j(I_d)(X_d - X_q)$. Both methods are equivalent.

The diagram clearly shows the two distinct reactance drops and reveals the origin of reluctance power, which is absent in cylindrical-rotor machines.

> **Final answer:** The phasor diagram of a salient-pole synchronous generator based on Blondel's two-reaction theory is developed by resolving the armature current into $I_d$ and $I_q$, and forming $\mathbf{E_f} = \mathbf{V} + j X_q \mathbf{I_q} + j X_d \mathbf{I_d}$. The construction sequentially adds the quadrature and direct-axis reactive drops to the terminal voltage, yielding the excitation emf and the load angle $\delta$.


---

## Question 121
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 2C | EM-II ELE 2225 End Sem, 09 May 2024

A 5 MVA slow speed 3 phase synchronous generator rated at 11 kV has 32 poles. Its direct and quadrature axis reactances are 10 Ω and 4 Ω respectively. Neglecting armature resistance, determine the voltage regulation when supplying a rated load at 0.8 p.f lagging. 3

### Answer 121
**Concept:** For a salient-pole synchronous generator, voltage regulation is computed using the two-reaction (Blondel) theory because $X_d \ne X_q$.

**Given:**
- $S = 5 \; \text{MVA}$, $V_L = 11 \; \text{kV}$ (star), $p=32$ (pole number not needed).
- $X_d = 10 \; \Omega$, $X_q = 4 \; \Omega$, $\cos\phi = 0.8 \; \text{lagging}$, $R_a \approx 0$.

**Solution:**
1. **Phase voltage and rated current**
   $$
   V_{ph} = \frac{V_L}{\sqrt{3}} = \frac{11000}{\sqrt{3}} \approx 6351 \; \text{V}
   $$
   $$
   I_a = \frac{S}{\sqrt{3}\,V_L} = \frac{5 \times 10^6}{\sqrt{3} \times 11000} \approx 262.4 \; \text{A}
   $$
   $\phi = \arccos 0.8 = 36.87^\circ$.

2. **Load angle $\delta$**
   From the phasor geometry with $R_a = 0$,
   $$
   \begin{aligned}
   \tan\delta &= \frac{I_a X_q \cos\phi}{V_{ph} + I_a X_q \sin\phi} \\[4pt]
   &= \frac{262.4 \times 4 \times 0.8}{6351 + 262.4 \times 4 \times 0.6}
    = \frac{839.68}{6980.8} = 0.1203 \\[4pt]
   \Rightarrow \delta &= \arctan 0.1203 \approx 6.86^\circ .
   \end{aligned}
   $$

3. **Resolve armature current**
   $$
   \begin{aligned}
   I_d &= I_a \sin(\phi + \delta) = 262.4 \sin(36.87^\circ + 6.86^\circ) = 262.4 \sin 43.73^\circ \approx 181.4 \; \text{A}, \\[4pt]
   I_q &= I_a \cos(\phi + \delta) = 262.4 \cos 43.73^\circ \approx 189.6 \; \text{A}.
   \end{aligned}
   $$
   (These are the direct- and quadrature-axis components.)

4. **Excitation emf (per phase)**
   $$
   E_f = V_{ph} \cos\delta + X_d I_d
        = 6351 \cos 6.86^\circ + 10 \times 181.4
        \approx 6306 + 1814 = 8120 \; \text{V}.
   $$

5. **Voltage regulation**
   $$
   \%\text{Reg} = \frac{E_f - V_{ph}}{V_{ph}} \times 100\%
                = \frac{8120 - 6351}{6351} \times 100\%
                \approx 27.85\% .
   $$

> **Final answer:** Voltage regulation $= \mathbf{27.85\%}$ at rated load and 0.8 p.f. lagging.


---

## Question 122
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 3A | EM-II ELE 2225 End Sem, 09 May 2024

Differentiate the power-angle characteristics of cylindrical rotor and salient pole synchronous generator. 3

### Answer 122
**Cylindrical-rotor (non-salient) synchronous generator:**
- Uniform air-gap ⇒ $X_d = X_q = X_s$.
- Neglecting $R_a$, the real power is a pure sine function of the load angle $\delta$:
  $$
  P = \frac{3 E_f V}{X_s} \sin\delta \quad (\text{or } P = \frac{E_f V}{X_s} \sin\delta \text{ per phase}).
  $$
- Maximum power occurs at $\delta = 90^\circ$; the curve is a single sinusoid with no harmonic content.

**Salient-pole synchronous generator:**
- Non-uniform air-gap ⇒ $X_d > X_q$.
- The two-reaction (Blondel) theory yields an additional **reluctance power** term:
  $$
  P = \frac{3 E_f V}{X_d} \sin\delta \;+\; \frac{3 V^2}{2} \left( \frac{1}{X_q} - \frac{1}{X_d} \right) \sin 2\delta .
  $$
- The first term is similar to the cylindrical case but uses $X_d$.
- The second term exists **even without field excitation** ($E_f=0$) and depends on saliency.
- Because of the $\sin 2\delta$ component, the power-angle curve:
  - Reaches its maximum at a load angle **less than** $90^\circ$ (typically $60^\circ$-$80^\circ$).
  - Has a steeper slope in the stable region, giving better transient stability.
  - Is not a pure sinusoid; it contains a second-harmonic component that distorts the shape.

**Key differences:**
| Feature | Cylindrical rotor | Salient-pole rotor |
|---------|-------------------|-------------------|
| Reactances | $X_d = X_q = X_s$ | $X_d > X_q$ |
| Power equation | $P \propto \sin\delta$ | $P \propto \sin\delta + \text{reluctance term}$ |
| Reluctance power | Zero | Present even at $E_f=0$ |
| Maximum-power angle | $\delta = 90^\circ$ | $\delta_{\max} < 90^\circ$ |
| Curve shape | Pure sine wave | Distorted sine wave with second harmonic |

Thus, saliency introduces a reluctance-torque component that enhances the power output and alters the $P$-$\delta$ characteristic compared with a smooth-rotor machine.

> **Final answer:** Cylindrical-rotor machine exhibits a simple $P \propto \sin\delta$ relationship with peak at $90^\circ$; salient-pole machine has an additional $\sin 2\delta$ reluctance term, causing the peak to occur at an angle $<90^\circ$ and producing a non-sinusoidal $P$-$\delta$ curve.

## Question 123
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 1C | EM-II ELE 2225 Makeup, 26 June 2024

A three-phase, 20 MVA, 11 kV, 50 Hz star-connected alternator has Xd = 4 Ω and Xq = 3 Ω. Armature resistance is negligibly small. At full load, 0.8 lagging power factor, determine: (a) Direct and quadrature axes components of the armature current. (b) Excitation emf. 4

### Answer 123
**Concept:** Blondel's two-reaction method for salient-pole alternator, $X_d \ne X_q$, $R_a \approx 0$.

**Given:**
- $S = 20 \; \text{MVA},\; V_L = 11 \; \text{kV}$ (star), $f = 50 \; \text{Hz}$.
- $X_d = 4 \, \Omega$, $X_q = 3 \, \Omega$, $\cos\phi = 0.8 \; \text{lagging}$.

**Solution:**
1. **Phase voltage and full-load current**
   $$
   V_{ph} = \frac{V_L}{\sqrt{3}} = \frac{11000}{\sqrt{3}} \approx 6351 \; \text{V},
   \qquad
   I_a = \frac{S}{\sqrt{3}\,V_L} = \frac{20 \times 10^6}{\sqrt{3} \times 11000} \approx 1049.7 \; \text{A}.
   $$
   $\phi = \arccos 0.8 = 36.87^\circ$.

2. **Load angle $\delta$**
   For a lagging load with $R_a = 0$:
   $$
   \begin{aligned}
   \tan\delta &= \frac{I_a X_q \cos\phi}{V_{ph} + I_a X_q \sin\phi} \\[4pt]
   &= \frac{1049.7 \times 3 \times 0.8}{6351 + 1049.7 \times 3 \times 0.6}
    = \frac{2519.3}{8240.5} = 0.3057 \\[4pt]
   \Rightarrow \delta &= \arctan 0.3057 \approx 17.0^\circ .
   \end{aligned}
   $$

3. **Direct- and quadrature-axis currents**
   $$
   \begin{aligned}
   I_d &= I_a \sin(\phi + \delta) = 1049.7 \sin(36.87^\circ + 17.0^\circ) \approx 1049.7 \sin 53.87^\circ \approx 847.8 \; \text{A}, \\[4pt]
   I_q &= I_a \cos(\phi + \delta) = 1049.7 \cos 53.87^\circ \approx 618.9 \; \text{A}.
   \end{aligned}
   $$
   Hence, $I_d = 847.8 \; \text{A}$ and $I_q = 618.9 \; \text{A}$.

4. **Excitation emf (per phase)**
   $$
   E_f = V_{ph} \cos\delta + X_d I_d
        = 6351 \cos 17.0^\circ + 4 \times 847.8
        \approx 6073.5 + 3391.2 = 9464.7 \; \text{V}.
   $$
   The corresponding line-to-line value is $\sqrt{3} \times 9464.7 \approx 16.39 \; \text{kV}$.

> **Final answer:**
> (a) $I_d = 847.8 \; \text{A},\; I_q = 618.9 \; \text{A}$.
> (b) Excitation emf per phase $E_f = 9.465 \; \text{kV}$ (line $16.39 \; \text{kV}$).


---

## Question 124
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 3A | EM-II ELE 2251 End Sem, 31 May 2023

Draw the per phase equivalent circuit and write the expressions relating air-gap voltage, terminal voltage, and excitation emf in an alternator. Compare the steady state mathematical model of salient-pole rotor and non-salient-pole rotor alternators with the help of phasor diagrams relating the induced voltage and terminal voltages. Also, suggest suitable methods to determine the reactance of these machines. (05)

### Answer 124
**Per-phase equivalent circuit and voltage expressions**
For a non-salient-pole (cylindrical-rotor) alternator, the per-phase equivalent circuit consists of a voltage source $E$ (excitation emf) in series with the armature resistance $R_a$ and the synchronous reactance $X_s$. The terminal voltage $V$ appears across the load. The air-gap voltage $E_g$ is the voltage behind the leakage reactance $X_l$:

$$
\begin{aligned}
E_g &= V + I_a R_a + j X_l I_a, \\
E &= V + I_a R_a + j X_s I_a, \qquad X_s = X_l + X_{ar},
\end{aligned}
$$

where $X_{ar}$ is the reactance of armature reaction. Usually $R_a$ is small and may be neglected, giving $E \approx V + j X_s I_a$.

For a salient-pole alternator, the non-uniform air-gap requires Blondel's two-reaction theory. The armature current is resolved into direct-axis ($I_d$) and quadrature-axis ($I_q$) components. The emf equation is

$$
E = V + I_a R_a + j X_d I_d + j X_q I_q,
$$

where $X_d$ and $X_q$ are the direct- and quadrature-axis synchronous reactances.

**Cylindrical vs. salient-pole models**
- *Cylindrical rotor*: $X_d = X_q = X_s$. The phasor diagram is drawn by taking $V$ as reference, adding $I_a R_a$ (in phase with $I_a$) and $j X_s I_a$ (leading $I_a$ by $90^\circ$) to obtain $E$. The load angle $\delta$ is the angle between $V$ and $E$, and the power per phase is $P = \frac{EV}{X_s}\sin\delta$.
- *Salient-pole rotor*: $X_d > X_q$, so the armature reaction is asymmetric. The phasor diagram requires first locating the q-axis. The component $j X_q I_q$ is added to $V$ to find the q-axis emf; then $j X_d I_d$ is added to reach $E$. The power-angle characteristic includes a reluctance-power term:

$$
P = \frac{EV}{X_d}\sin\delta + \frac{V^2}{2}\!\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta .
$$

**Determination of reactances**
- *Non-salient $X_s$*: Open-circuit and short-circuit tests give the unsaturated synchronous reactance $X_s = E_{oc}/I_{sc}$ (air-gap line). The Potier method separates the leakage reactance $X_l$.
- *Salient $X_d$, $X_q$*: The **slip test** is the standard method. The rotor is driven at a small slip ($0.2$-$0.5\%$) with the field winding open. A reduced three-phase voltage (∼10-20% rated) is applied. The stator current oscillates between a minimum ($I_{\min}$) when the rotating field aligns with the d-axis and a maximum ($I_{\max}$) when it aligns with the q-axis. Then

$$
X_d = \frac{V_{ph}}{I_{\min}}, \qquad X_q = \frac{V_{ph}}{I_{\max}} .
$$

> **Final answer:** The per-phase equivalent circuit of a non-salient alternator is a series combination of $E_f$, $R_a$, and $X_s$, with $E_f = V + I_a(R_a + j X_s)$. For salient-pole machines, the two-axis model gives $E_f = V + I_a R_a + j X_d I_d + j X_q I_q$. The cylindrical-rotor model uses a single synchronous reactance, while the salient-pole model requires axis decomposition and yields an extra reluctance power term. Reactances are found by OC/SC tests (for $X_s$) and the slip test (for $X_d$, $X_q$).


---

## Question 125
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 3B | EM-II ELE 2251 Grade Improvement, 11 August 2021

Explain the significance of slip test in Synchronous machines. (04)

### Answer 125
**Concept**
In a salient-pole synchronous machine, the magnetic reluctance varies with the angular position of the rotor. The slip test exploits this physical saliency to measure the direct-axis synchronous reactance $X_d$ and the quadrature-axis synchronous reactance $X_q$.

**Procedure**
- Drive the rotor at a speed slightly different from synchronous (slip ≈ 0.2-0.5%).
- Keep the field winding open-circuited.
- Apply a low three-phase voltage (∼10-20% of rated) to the stator.
- Because of the small slip, the rotating stator mmf alternately aligns with the salient rotor poles. When it aligns with the direct axis, the air-gap reluctance is minimum and the current is minimum ($I_{\min}$); when it aligns with the quadrature axis, the reluctance is maximum and the current is maximum ($I_{\max}$). The stator current thus oscillates at twice the slip frequency.

**Determination**
Under constant applied voltage $V_{ph}$,

$$
X_d = \frac{V_{ph}}{I_{\min}}, \qquad X_q = \frac{V_{ph}}{I_{\max}} .
$$

These are the unsaturated synchronous reactances; they include the armature leakage reactance.

**Significance**
- They form the basis of **Blondel's two-reaction theory**, enabling accurate phasor diagrams for salient-pole machines.
- Correct **voltage regulation** calculation of salient-pole alternators requires $X_d$ and $X_q$; a single synchronous reactance would lead to erroneous results.
- The **power-angle characteristic** of a salient-pole machine contains a reluctance-power term $\frac{V^2}{2}(1/X_q - 1/X_d)\sin 2\delta$, which directly depends on the difference between the two reactances.
- They are essential for **stability studies** and excitation system design.

The slip test is the simplest experimental method that separately yields $X_d$ and $X_q$, avoiding the need for more complex measurements.

> **Final answer:** The slip test provides $X_d$ and $X_q$ by measuring the oscillating stator current at a small slip; these reactances are indispensable for accurate modeling, voltage regulation, power-angle calculations, and stability analysis of salient-pole synchronous machines.


---

## Question 126
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 204 End Sem, 13 May 2014

A 3 phase, 20 MVA, star connected alternator with an impedance of (0.5+j 6) per phase is operating in parallel with constant voltage 11 kV bus bars. The field current is adjusted to give a line excitation voltage of 12 kV. With constant excitation, calculate (i) maximum power output from the alternator (ii) armature current and power factor under maximum power condition. (04)

### Answer 126
**Given**
- Alternator: 3-phase, star-connected, $S = 20$ MVA (not directly used).
- Busbar line voltage $V_L = 11$ kV → phase voltage $V_{ph} = 11/\sqrt{3} = 6.351$ kV.
- Excitation line voltage $E_L = 12$ kV → $E_{ph} = 12/\sqrt{3} = 6.928$ kV.
- Per-phase synchronous impedance $Z_s = 0.5 + j6\ \Omega$.
  $|Z_s| = \sqrt{0.5^2 + 6^2} = 6.021\ \Omega$; $\theta = \tan^{-1}(6/0.5) = 85.24^\circ$; $\cos\theta = 0.5/6.021 = 0.0830$.

**Maximum power output**
For a cylindrical-rotor alternator, real power per phase is

$$
P_{ph} = \frac{E_{ph}V_{ph}}{|Z_s|}\cos(\theta - \delta) - \frac{V_{ph}^2}{|Z_s|}\cos\theta .
$$

The maximum occurs when $\cos(\theta - \delta) = 1$, i.e. $\delta = \theta$. Hence

$$
\begin{aligned}
P_{max,ph} &= \frac{E_{ph}V_{ph}}{|Z_s|} - \frac{V_{ph}^2}{|Z_s|}\cos\theta \\
&= \frac{6.928 \times 6.351}{6.021} - \frac{6.351^2}{6.021} \times 0.0830 \\
&= 7.311 - 0.556 = 6.755 \text{ MW/phase} .
\end{aligned}
$$

Total three-phase maximum power:

$$
P_{max} = 3 \times 6.755 = 20.26 \text{ MW}.
$$

**Armature current and power factor at $P_{max}$**
At $\delta = \theta$ we have $E_{ph} = 6.928 \angle 85.24^\circ$ kV and $V_{ph} = 6.351 \angle 0^\circ$ kV.

$$
\begin{aligned}
E_{ph} - V_{ph} &= (6.928 \times 0.083 - 6.351) + j(6.928 \times 0.9965) \\
&= -5.776 + j6.905 \text{ kV} \\
|E_{ph} - V_{ph}| &= \sqrt{5.776^2 + 6.905^2} = 9.002 \text{ kV}.
\end{aligned}
$$

Current per phase:

$$
I_a = \frac{E_{ph} - V_{ph}}{Z_s} = \frac{9.002 \angle 130^\circ}{6.021 \angle 85.24^\circ} = 1.495 \angle 44.76^\circ \text{ kA}.
$$

Thus line current $I_L = 1495$ A and power factor $\cos\phi = \cos 44.76^\circ = 0.711$ leading (since $I_a$ leads $V_{ph}$).

> **Final answer:** (i) Maximum power output = **20.26 MW**. (ii) Armature current = **1495 A**, power factor = **0.711 leading**.


---

## Question 127
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 204 End Sem, 13 May 2014

A 3 phase, 50 Hz, 4 pole, 10 kVA, 400 V, star connected synchronous motor has a per phase synchronous impedance of (3 + j4). When supplying rated current, the field current is so adjusted that the line emf induced is 451 V. Determine (a) load angle and power factor (b) active power input and gross power output (c) efficiency assuming rotational loss of 1 kW. (05)

### Answer 127
**Given:**
- 3-phase, star, 400 V, 10 kVA, 50 Hz, 4-pole
- $Z_s = (3 + j4)\,\Omega = 5\angle 53.13^\circ\,\Omega$ per phase
- Rated line current: $I_L = \frac{10\,000}{\sqrt{3}\times 400} = 14.434\,\text{A}$
- Phase voltage: $V_{ph} = \frac{400}{\sqrt{3}} = 230.94\,\text{V}$
- Induced line emf $E_L = 451\,\text{V}$ → $E_{ph} = \frac{451}{\sqrt{3}} = 260.39\,\text{V}$

**Solution:**
**(a) Load angle and power factor:**
The phasor relation is $\vec{V}_{ph} = \vec{E}_{ph} + \vec{I} Z_s$. The magnitude of the impedance drop is $I Z_s = 14.434 \times 5 = 72.17\,\text{V}$.
Using the law of cosines:
$$
\cos\delta = \frac{V_{ph}^2 + E_{ph}^2 - (I Z_s)^2}{2\,V_{ph}\,E_{ph}} = \frac{230.94^2 + 260.39^2 - 72.17^2}{2 \times 230.94 \times 260.39} = 0.9639
$$
Hence $\delta = \cos^{-1}0.9639 = 15.44^\circ$ ($E$ lags $V$).

Take $V_{ph}$ as reference: $V_{ph} = 230.94\angle 0^\circ$, $E_{ph} = 260.39\angle -15.44^\circ$. Then
$$
\begin{aligned}
V_{ph} - E_{ph} &= 230.94 - (260.39\cos 15.44^\circ - j260.39\sin 15.44^\circ) \\
&= -20.06 + j69.3 = 72.17\angle 106.15^\circ\,\text{V}
\end{aligned}
$$
$$
\vec{I} = \frac{V_{ph} - E_{ph}}{Z_s} = \frac{72.17\angle 106.15^\circ}{5\angle 53.13^\circ} = 14.434\angle 53.02^\circ\,\text{A}
$$
Current leads voltage by $53.02^\circ$, so power factor $= \cos 53.02^\circ = 0.602$ leading.

**(b) Active power input and gross power output:**
$$
\begin{aligned}
P_{\text{in}} &= \sqrt{3} V_L I_L \cos\phi = \sqrt{3} \times 400 \times 14.434 \times 0.602 = 6019\,\text{W} = 6.019\,\text{kW} \\
\text{Arm. Cu loss} &= 3 I^2 R_a = 3 \times (14.434)^2 \times 3 = 1875\,\text{W} \\
P_{\text{gross}} &= P_{\text{in}} - \text{Cu loss} = 6019 - 1875 = 4144\,\text{W} = 4.144\,\text{kW}
\end{aligned}
$$

**(c) Efficiency:**
Shaft output $= P_{\text{gross}} - \text{rot. loss} = 4144 - 1000 = 3144\,\text{W}$.
$$
\eta = \frac{3144}{6019} \times 100\% = 52.2\%
$$

> **Final answer:** (a) $\delta = 15.44^\circ$, power factor $= 0.602$ leading; (b) $P_{\text{in}} = 6.019\,\text{kW}$, $P_{\text{gross}} = 4.144\,\text{kW}$; (c) Efficiency $= 52.2\%$.


---

## Question 128
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5B | EM-II ELE 204 End Sem, 13 May 2014

A supply system has the following loads: 100 kW upf load and 400 kW load at 0.6 pf lag. A 50 HP synchronous motor when connected in parallel with existing load improves the overall power factor to 0.95 lag. Assuming motor efficiency as 87%, determine (a) leading kVAR supplied by the motor (b) kVA rating of motor (c) motor power factor. (03)

### Answer 128
**Given:**
- Existing loads: $P_1 = 100\,\text{kW}$ upf; $P_2 = 400\,\text{kW}$ at 0.6 pf lag.
- 50 HP synchronous motor, $\eta = 87\%$, overall pf becomes 0.95 lag.

**Solution:**
Motor mechanical output $= 50 \times 0.746 = 37.3\,\text{kW}$.
Input power $P_m = \frac{37.3}{0.87} = 42.87\,\text{kW}$.

Existing reactive power:
$Q_1 = 0$; $Q_2 = 400 \tan(\cos^{-1}0.6) = 400 \times \frac{4}{3} = 533.33\,\text{kVAR (lag)}$.
Total existing: $P_{\text{old}} = 500\,\text{kW}$, $Q_{\text{old}} = 533.33\,\text{kVAR (lag)}$.

After adding motor: $P_{\text{new}} = 500 + 42.87 = 542.87\,\text{kW}$.
Overall pf = 0.95 lag → $\cos\phi = 0.95$, $\tan\phi = \sqrt{1-0.95^2}/0.95 = 0.3286$.
Required $Q_{\text{new}} = 542.87 \times 0.3286 = 178.4\,\text{kVAR (lag)}$.
Reactive power supplied by motor: $Q_m = Q_{\text{new}} - Q_{\text{old}} = 178.4 - 533.33 = -354.93\,\text{kVAR}$ (leading).
Thus, leading kVAR supplied = 354.9 kVAR.

Motor kVA rating:
$$
S_m = \sqrt{P_m^2 + Q_m^2} = \sqrt{(42.87)^2 + (354.93)^2} = \sqrt{1837.8 + 125\,977} = 357.4\,\text{kVA}
$$
Motor power factor: $\text{pf}_m = \frac{P_m}{S_m} = \frac{42.87}{357.4} = 0.12$ leading.

> **Final answer:** (a) $354.9\,\text{kVAR}$ leading; (b) $357.4\,\text{kVA}$; (c) $0.12$ leading.


---

## Question 129
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5B | EM-II ELE 204 Makeup, 08 July 2014

A 3 phase, 50 Hz, 400 V installation draws a current of 36.1 A at 0.8 power factor lagging. A 3 phase 10 KVA synchronous motor operating at 0.6 power factor leading is connected in parallel with the existing load. Determine (i) the overall power factor of the installation, (ii) net reactive power taken from the supply. (03)

### Answer 129
**Given:**
- 3-phase, 400 V, $I = 36.1\,\text{A}$, pf = 0.8 lag.
- Synchronous motor: $10\,\text{kVA}$, pf = 0.6 leading.

**Solution:**
Existing powers:
$$
\begin{aligned}
P_1 &= \sqrt{3} \times 400 \times 36.1 \times 0.8 = 20.0\,\text{kW} \\
Q_1 &= \sqrt{3} \times 400 \times 36.1 \times \sin(\cos^{-1}0.8) = 15.0\,\text{kVAR (lag)}
\end{aligned}
$$
Motor powers:
$$
P_m = 10 \times 0.6 = 6.0\,\text{kW},\qquad Q_m = -10 \times 0.8 = -8.0\,\text{kVAR (leading)}
$$
Total after addition:
$$
\begin{aligned}
P_{\text{total}} &= 20.0 + 6.0 = 26.0\,\text{kW} \\
Q_{\text{total}} &= 15.0 - 8.0 = 7.0\,\text{kVAR (lag)}
\end{aligned}
$$
Overall apparent power and pf:
$$
S = \sqrt{26^2 + 7^2} = \sqrt{725} \approx 26.93\,\text{kVA}, \quad \text{pf} = \frac{26.0}{26.93} = 0.966 \text{ lagging.}
$$
Net reactive power taken from supply $= 7.0\,\text{kVAR}$ lagging.

> **Final answer:** (i) Overall pf = $0.966$ lagging; (ii) Net reactive power = $7.0\,\text{kVAR}$ lagging.


---

## Question 130
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 204 Makeup, 09 July 2015

A factory has an average load of 300 kW at a power factor of 0.6 lagging. A synchronous motor is used to raise the combined power factor to 0.9 lagging and at the same time to supply a mechanical load of 60 kW. Calculate KVA rating and power factor of synchronous motor. Assume 88% as the efficiency of synchronous motor (03)

### Answer 130
**Given:**
Factory load: $P_1 = 300\,\text{kW}$, $\cos\phi_1 = 0.6$ lag $\Rightarrow \phi_1 = \cos^{-1}0.6 = 53.13^\circ$, $\tan\phi_1 = 1.333$.
Reactive power: $Q_1 = P_1 \tan\phi_1 = 300 \times 1.333 = 400\,\text{kvar}$ (lag).

Synchronous motor: mechanical load $60\,\text{kW}$, efficiency $88\%$, so electrical input
$$P_{m,in} = \frac{60}{0.88} = 68.18\,\text{kW}.$$

Combined system: $P = P_1 + P_{m,in} = 368.18\,\text{kW}$.
Desired overall $\cos\phi = 0.9$ lag $\Rightarrow \phi = \cos^{-1}0.9 = 25.84^\circ$, $\tan\phi = 0.4843$.
Required total reactive power: $Q = P \tan\phi = 368.18 \times 0.4843 \approx 178.4\,\text{kvar}$ (lag).

Motor reactive power: $Q_m = Q - Q_1 = 178.4 - 400 = -221.6\,\text{kvar}$ (i.e. leading).

Motor kVA rating:
$$
\begin{aligned}
S_m &= \sqrt{P_{m,in}^2 + Q_m^2} = \sqrt{68.18^2 + (-221.6)^2} \\
&\approx \sqrt{4649 + 49107} = \sqrt{53756} = 231.9\,\text{kVA} \approx 232\,\text{kVA}.
\end{aligned}
$$

Motor power factor: $\text{pf}_m = \dfrac{P_{m,in}}{S_m} = \dfrac{68.18}{231.9} \approx 0.294$ leading.

> **Final answer:** KVA rating ≈ 232 kVA, power factor = 0.294 leading.


---

## Question 131
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 3B | EM-II ELE 2202 End Sem, 10 May 2016

A turbo alternator with synchronizing reactance of 10Ω, is delivering 200A at upf to an infinite bus at a voltage of 11kV. If the prime mover input is kept constant & excitation is increased by 20%, find the new current and power factor. Keeping the excitation at the increased level, find the maximum power output of the alternator and the corresponding current and power factor. (06)

### Answer 131
**Given:** Turbo alternator, star-connected, $V_L = 11\,\text{kV}$, $V_{ph}=11\,000/\sqrt{3}=6351\,\text{V}$, $X_s = 10\,\Omega$ (per phase). Initial line current $I_a = 200\,\text{A}$ upf.

**Initial excitation:**
$$
\begin{aligned}
E_f &= V_{ph} + jX_s I_a = 6351 + j10\times200 = 6351 + j2000\,\text{V} \\
|E_f| &= \sqrt{6351^2+2000^2} = 6.658\,\text{kV}, \quad \delta = \tan^{-1}\frac{2000}{6351}=17.48^\circ \\
P &= \sqrt{3}\,V_L I_a \times 1 = \sqrt{3}\times 11\,000 \times 200 = 3.81\,\text{MW}.
\end{aligned}
$$

**Increased excitation (+20%):** $E_f' = 1.2 \times 6.658 = 7.99\,\text{kV}$. Prime-mover input constant $\Rightarrow$ $P$ unchanged.

From $P = \dfrac{3 V_{ph} E_f'}{X_s}\sin\delta'$:
$$
\sin\delta' = \frac{P X_s}{3 V_{ph} E_f'} = \frac{3.81\times10^6 \times 10}{3 \times 6351 \times 7990} = 0.2504 \;\Rightarrow\; \delta' = 14.50^\circ.
$$

New current (phasor):
$$
\begin{aligned}
I_a' &= \frac{E_f' - V_{ph}}{jX_s} = \frac{7990\angle14.50^\circ - 6351}{j10} \\
     &= \frac{1384 + j2001}{j10} = 200.1 - j138.4 \,\text{A} \\
|I_a'| &= \sqrt{200.1^2 + 138.4^2} = 243.3\,\text{A}.
\end{aligned}
$$
Power factor:
$\cos\phi' = \dfrac{P}{\sqrt{3}\,V_L I_a'} = \dfrac{3.81\times10^6}{\sqrt{3}\times11\,000\times243.3} = 0.822$ (current lags, so lagging).

**Maximum power (excitation fixed at $E_f'$):**
At $\delta = 90^\circ$ (stability limit),
$$
P_{\max} = \frac{3 V_{ph} E_f'}{X_s} = \frac{3 \times 6351 \times 7990}{10} = 15.22\,\text{MW}.
$$
Corresponding current:
$$
\begin{aligned}
I_{a,\max} &= \frac{j7.99\times10^3 - 6351}{j10} = \frac{-6351 + j7990}{j10} = 799 + j635.1 \,\text{A} \\
|I_{a,\max}| &= \sqrt{799^2 + 635.1^2} = 1020.7\,\text{A}.
\end{aligned}
$$
Power factor:
$\cos\phi_{\max} = \dfrac{15.22\times10^6}{\sqrt{3}\times11\,000\times1020.7} = 0.783$ (current leads, so leading).

> **Final answer:** New current = 243.3 A, power factor = 0.822 lagging; maximum power = 15.22 MW, corresponding current = 1020.7 A, power factor = 0.783 leading.


---

## Question 132
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 End Sem, 23 April 2018

The excitation of a 415 V, 3 phase star connected synchronous motor is such that the induced emf is 520 V. The impedance per phase is 0.5 + j4 Ω. The friction and iron losses are constant at 1,000 W. Calculate the horse power output, line current and efficiency for a) Maximum power output b) Maximum power input (06)

### Answer 132
**Given:** Star-connected synchronous motor, $V_L = 415\,\text{V}$, $V_{ph} = 415/\sqrt{3} = 239.6\,\text{V}$. Induced emf (line) $E_L = 520\,\text{V}$ $\Rightarrow$ $E_{ph} = 520/\sqrt{3} = 300.2\,\text{V}$. $Z_s = 0.5 + j4\,\Omega$, $|Z_s| = \sqrt{0.5^2+4^2} = 4.031\,\Omega$, $\theta = \tan^{-1}(4/0.5) = 82.875^\circ$, $\beta = \tan^{-1}(R/X) = \tan^{-1}(0.5/4) = 7.125^\circ$. Constant friction & iron losses $P_{\text{rot}} = 1000\,\text{W}$.

Motor equation: $V = E + I Z_s$ ($V$ reference, $E$ lags by $\delta$).

Electromagnetic power per phase (general form):
$$
P_{\text{em,ph}} = \frac{V_{ph}E_{ph}}{|Z_s|}\sin(\delta+\beta) - \frac{E_{ph}^2 R}{|Z_s|^2}.
$$

**a) Maximum power output:**
Max $P_{\text{em,ph}}$ when $\sin(\delta+\beta)=1 \;\Rightarrow\; \delta = 90^\circ - \beta = 82.875^\circ$.
$$
\begin{aligned}
P_{\text{em,ph,max}} &= \frac{239.6 \times 300.2}{4.031} - \frac{300.2^2 \times 0.5}{16.25} \\
&\approx 17846 - 2773 = 15073 \,\text{W}.
\end{aligned}
$$
Total electromagnetic power $P_{\text{em}} = 3 \times 15073 = 45.22\,\text{kW}$.
Shaft power $P_{\text{out}} = P_{\text{em}} - P_{\text{rot}} = 45.22 - 1.0 = 44.22\,\text{kW}$.
Horsepower: $\text{HP} = 44.22 / 0.746 \approx 59.3\,\text{HP}$.

Line current (magnitude of phase current):
$$
\begin{aligned}
|I_a| &= \frac{\sqrt{V_{ph}^2 + E_{ph}^2 - 2V_{ph}E_{ph}\cos\delta}}{|Z_s|} \\
&= \frac{\sqrt{239.6^2 + 300.2^2 - 2\times239.6\times300.2\times\cos82.875^\circ}}{4.031} \approx 89.34\,\text{A}.
\end{aligned}
$$
Copper loss $P_{\text{cu}} = 3 I_a^2 R = 3 \times (89.34)^2 \times 0.5 = 11.97\,\text{kW}$.
Input power $P_{\text{in}} = P_{\text{em}} + P_{\text{cu}} = 45.22 + 11.97 = 57.19\,\text{kW}$.
Power factor $\cos\phi = \dfrac{P_{\text{in}}}{\sqrt{3}\,V_L I_a} = \dfrac{57.19\times10^3}{\sqrt{3}\times415\times89.34} \approx 0.891$ (lag).
Efficiency $\eta = \dfrac{P_{\text{out}}}{P_{\text{in}}} \times 100\% \approx 77.3\%$.

**b) Maximum power input:**
Input power per phase: $P_{\text{in,ph}} = \frac{V_{ph}^2 R}{|Z_s|^2} + \frac{V_{ph}E_{ph}}{|Z_s|}\sin(\delta-\beta)$.
Max when $\sin(\delta-\beta)=1 \;\Rightarrow\; \delta = 90^\circ + \beta = 97.125^\circ$.
$$
\begin{aligned}
P_{\text{in,ph,max}} &= \frac{239.6^2 \times 0.5}{16.25} + \frac{239.6 \times 300.2}{4.031} \\
&\approx 1766 + 17846 = 19612 \,\text{W}.
\end{aligned}
$$
Total input $P_{\text{in}} = 3 \times 19.612 = 58.84\,\text{kW}$.

Current at this $\delta$:
$$
|I_a| = \frac{\sqrt{239.6^2 + 300.2^2 - 2\times239.6\times300.2\times\cos97.125^\circ}}{4.031} \approx 100.88\,\text{A}.
$$
Copper loss $P_{\text{cu}} = 3 \times (100.88)^2 \times 0.5 = 15.26\,\text{kW}$.
$P_{\text{em}} = P_{\text{in}} - P_{\text{cu}} = 58.84 - 15.26 = 43.58\,\text{kW}$.
Shaft output $P_{\text{out}} = 43.58 - 1.0 = 42.58\,\text{kW}$.
HP: $42.58 / 0.746 \approx 57.1\,\text{HP}$.
Power factor $\cos\phi = \dfrac{58.84\times10^3}{\sqrt{3}\times415\times100.88} \approx 0.811$ (lag).
Efficiency $\eta = \dfrac{42.58}{58.84} \times 100\% \approx 72.4\%$.

> **Final answer:** (a) 59.3 HP, 89.34 A, 77.3% efficiency; (b) 57.1 HP, 100.88 A, 72.4% efficiency.


---

## Question 133
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 End Sem, 24 April 2017

An industrial plant is supplied with 875 kVA of electrical power at 0.8 pf lagging from a three-phase, 50 Hz, 11 kV substation. A synchronous motor of rating 100 kVA operating at a leading power factor of 0.6 is added during the expansion. Calculate the new kVA supplied by the substation and the overall power factor of the plant. (03)

### Answer 133
Given: initial plant load $S_1 = 875\text{ kVA}$ at $0.8$ lagging pf. Synchronous motor $S_m=100\text{ kVA}$ at $0.6$ leading pf.

Real and reactive powers:

$$
\begin{aligned}
P_1 &= S_1 \times 0.8 = 700\text{ kW}, \\
Q_1 &= S_1 \times \sin(\cos^{-1}0.8) = 875 \times 0.6 = 525\text{ kVAr (lagging)}.
\end{aligned}
$$

Synchronous motor input (leading, so reactive power negative):

$$
\begin{aligned}
P_m &= 100 \times 0.6 = 60\text{ kW}, \\
Q_m &= -100 \times \sin(\cos^{-1}0.6) = -100 \times 0.8 = -80\text{ kVAr (leading)}.
\end{aligned}
$$

After adding motor, total real and reactive powers drawn from substation:

$$
\begin{aligned}
P_{\text{total}} &= P_1 + P_m = 700 + 60 = 760\text{ kW}, \\
Q_{\text{total}} &= Q_1 + Q_m = 525 - 80 = 445\text{ kVAr (lagging)}.
\end{aligned}
$$

New apparent power:

$$
S_{\text{new}} = \sqrt{P_{\text{total}}^2 + Q_{\text{total}}^2} = \sqrt{760^2 + 445^2} = 880.8\text{ kVA} \approx 881\text{ kVA}.
$$

Overall plant power factor:

$$
\text{pf}_{\text{overall}} = \frac{P_{\text{total}}}{S_{\text{new}}} = \frac{760}{880.8} = 0.863 \text{ (lagging, since } Q_{\text{total}}>0).
$$

> **Final answer:** The substation now supplies approximately **881 kVA**, and the overall plant power factor is **0.863 lagging**.


---

## Question 134
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5B | EM-II ELE 2202 Makeup, 02 July 2016

A factory has an average load of 250 kW at a power factor of 0.7 lagging. In addition, a synchronous motor with an efficiency of 88 % supplies a mechanical load of 60 kW. Determine the kVA rating and power factor of synchronous motor if it is used to raise the combined power factor to 0.9 lag. 5M

### Answer 134
Factory load: $P_1 = 250\text{ kW}$, pf $0.7$ lagging. Synchronous motor mechanical load $60\text{ kW}$, $\eta = 88\%$, desired combined pf $0.9$ lagging.

Factory reactive power:

$$
\begin{aligned}
\phi_1 &= \cos^{-1}0.7 \approx 45.57^\circ, \\
Q_1 &= P_1 \tan\phi_1 = 250 \times 1.020 \approx 255\text{ kVAr (lagging)}.
\end{aligned}
$$

Synchronous motor electrical input:

$$
P_m = \frac{60}{0.88} \approx 68.18\text{ kW}.
$$

Total real power after addition:

$$
P_{\text{new}} = 250 + 68.18 = 318.18\text{ kW}.
$$

For combined pf $0.9$ lagging:

$$
\begin{aligned}
\phi_{\text{new}} &= \cos^{-1}0.9 \approx 25.84^\circ, \\
Q_{\text{new}} &= P_{\text{new}} \tan\phi_{\text{new}} \approx 318.18 \times 0.4843 = 154.1\text{ kVAr (lagging)}.
\end{aligned}
$$

Reactive power that must be supplied by the synchronous motor:

$$
Q_m = Q_{\text{new}} - Q_1 = 154.1 - 255.0 = -100.9\text{ kVAr (leading)}.
$$

Synchronous motor apparent power (kVA rating):

$$
S_m = \sqrt{P_m^2 + Q_m^2} = \sqrt{68.18^2 + 100.9^2} \approx 121.8\text{ kVA}.
$$

Motor power factor:

$$
\text{pf}_m = \frac{P_m}{S_m} = \frac{68.18}{121.8} \approx 0.56\text{ leading}.
$$

> **Final answer:** The synchronous motor must be rated approximately **122 kVA** and operates at a power factor of **0.56 leading**.


---

## Question 135
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5B | EM-II ELE 2202 Makeup, 13 June 2019

Draw and explain the significance of V curve in synchronous motors. (03)

### Answer 135
The **V-curves** of a synchronous motor are plots of armature current $I_a$ versus field current $I_f$, with constant terminal voltage and constant shaft load. For each load, $I_a$ traces a V-shaped curve. The corresponding **inverted V-curves** show power factor against $I_f$.

**Explanation:** For a fixed real power $P$, the in-phase component of $I_a$ is constant. Changing $I_f$ alters the excitation emf $E_f$ and the reactive power exchanged with the supply.
- **Under-excitation** (low $I_f$): $E_f$ is small; motor draws lagging reactive power, $I_a$ is large, pf lagging.
- **Increasing $I_f$:** $E_f$ rises, reducing the lagging component until at unity pf, $I_a$ becomes minimum (equal to the in-phase current).
- **Over-excitation** (high $I_f$): $E_f$ exceeds the required value; motor supplies leading reactive power, $I_a$ increases with leading pf.

The locus of minimum $I_a$ for each load gives the unity-pf line, forming the overall V-shape.

**Phasor picture:** With $V$ constant and $P$ constant, the reactive component of $I_a$ varies linearly with $E_f$, producing the V-curve.

**Significance:**
1. **Power-factor correction:** By over-exciting, a synchronous motor supplies leading kVAr, compensating lagging loads (synchronous condenser operation).
2. **Voltage control:** Adjustable reactive power supports bus voltage.
3. **Efficiency:** Operation near unity pf minimises $I^2R$ losses.
4. **Protection:** V-curves define safe field-current limits to prevent overheating or pull-out.

![V-curves of synchronous motor](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

> **Final answer:** V-curves show how armature current varies with excitation, identifying the unity power factor point and the motor's ability to supply leading or lagging reactive power, which is essential for power-factor correction and system voltage support.


---

## Question 136
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 Makeup, 16 June 2017

An industrial plant is supplied with 850kVA of electrical power at 0.7pf lagging from a 3-phase 50Hz, 11kV substation. A synchronous motor of rating 110kVA operating at a leading power factor of 0.5 is added during expansion. Calculate the new kVA supplied and overall power factor of the plant. (05)

### Answer 136
### Original plant
$$
\begin{aligned}
S_1 &= 850\ \text{kVA}, \quad \text{pf}_1 = 0.7\ \text{lagging} \\
P_1 &= S_1 \, \text{pf}_1 = 850 \times 0.7 = 595\ \text{kW} \\
\phi_1 &= \cos^{-1}(0.7) \approx 45.57^\circ, \quad \sin\phi_1 = 0.714 \\
Q_1 &= S_1 \sin\phi_1 = 850 \times 0.714 \approx 607.0\ \text{kVAr (lagging)}
\end{aligned}
$$

### Synchronous motor
$$
\begin{aligned}
S_m &= 110\ \text{kVA}, \quad \text{pf}_m = 0.5\ \text{leading} \\
P_m &= 110 \times 0.5 = 55\ \text{kW} \\
\phi_m &= \cos^{-1}(0.5) = 60^\circ, \quad \sin\phi_m = 0.866 \\
Q_m &= -S_m \sin\phi_m = -110 \times 0.866 \approx -95.3\ \text{kVAr (leading)}
\end{aligned}
$$

### Combined load
$$
\begin{aligned}
P_{\text{total}} &= 595 + 55 = 650\ \text{kW} \\
Q_{\text{total}} &= 607.0 - 95.3 = 511.7\ \text{kVAr} \\
S_{\text{new}} &= \sqrt{P_{\text{total}}^2 + Q_{\text{total}}^2} = \sqrt{650^2 + 511.7^2} \approx 827.1\ \text{kVA} \\
\text{pf}_{\text{new}} &= \frac{P_{\text{total}}}{S_{\text{new}}} = \frac{650}{827.1} \approx 0.786
\end{aligned}
$$

Since $Q_{\text{total}} > 0$, the power factor remains lagging.

> **Final answer:** The substation now supplies approximately **827 kVA**, and the overall power factor is **0.786 lagging**.


---

## Question 137
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 5B | EM-II ELE 2202 Makeup, 19 June 2018

An industrial load of 200 kW is supplied at 11 kV, the power factor being 0.8 lagging. A synchronous motor is used to meet an additional load of 50 kW and at the same time, it is used to raise the overall power factor to 0.9 lagging. Find the kVA capacity of synchronous motor and the power factor at which it operates. (06)

### Answer 137
### Original load
$$
\begin{aligned}
P_1 &= 200\ \text{kW}, \quad \text{pf}_1 = 0.8\ \text{lagging} \\
\phi_1 &= \cos^{-1}(0.8) \approx 36.87^\circ, \quad \tan\phi_1 = 0.75 \\
Q_1 &= P_1 \tan\phi_1 = 200 \times 0.75 = 150\ \text{kVAr (lagging)}
\end{aligned}
$$

### Overall target
The synchronous motor adds $P_m = 50\ \text{kW}$ (mechanical load; losses neglected).
Desired overall pf = 0.9 lagging.
$$
\begin{aligned}
P_{\text{total}} &= 200 + 50 = 250\ \text{kW} \\
\phi_{\text{new}} &= \cos^{-1}(0.9) \approx 25.84^\circ, \quad \tan\phi_{\text{new}} \approx 0.4843 \\
Q_{\text{total}} &= P_{\text{total}} \tan\phi_{\text{new}} = 250 \times 0.4843 \approx 121.1\ \text{kVAr (lagging)}
\end{aligned}
$$

### Synchronous motor rating and pf
Motor reactive power:
$$
Q_m = Q_{\text{total}} - Q_1 = 121.1 - 150 = -28.9\ \text{kVAr}
$$
The negative sign indicates leading power factor (over-excited operation).
$$
\begin{aligned}
S_m &= \sqrt{P_m^2 + |Q_m|^2} = \sqrt{50^2 + 28.9^2} \approx 57.8\ \text{kVA} \\
\text{pf}_m &= \frac{P_m}{S_m} = \frac{50}{57.8} \approx 0.865 \quad (\text{leading})
\end{aligned}
$$

> **Final answer:** The synchronous motor must be rated at approximately **57.8 kVA** and operate at a power factor of **0.865 leading**.


---

## Question 138
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 2B | EM-II ELE 2225 End Sem, 09 May 2024

A sugarcane industry is supplied with 92.5 kW of electrical power at 0.83 pf lagging from a three-phase, 50 Hz, 11 kV substation. A synchronous motor of rating 30 kVA operating at a leading power factor of 0.63 is added during the expansion. a) Calculate the real and reactive supplied by the substation, after expansion. b) Will the overall power factor of the industry improve after the addition of the synchronous motor? Justify your answer.

### Answer 138
### Given data
- Industrial load: $P_1 = 92.5\ \text{kW}$, $\text{pf}_1 = 0.83$ lagging
- Synchronous motor: $S_m = 30\ \text{kVA}$, $\text{pf}_m = 0.63$ leading

### Part (a): Real and reactive power after expansion

**Original load**
$$
\begin{aligned}
\cos\phi_1 &= 0.83 \implies \phi_1 = \cos^{-1}(0.83) \approx 33.9^\circ \\
\sin\phi_1 &\approx 0.5578, \quad \tan\phi_1 = \frac{0.5578}{0.83} \approx 0.672 \\
Q_1 &= P_1 \tan\phi_1 = 92.5 \times 0.672 \approx 62.2\ \text{kVAr (lagging)}
\end{aligned}
$$

**Synchronous motor**
$$
\begin{aligned}
\cos\phi_m &= 0.63 \implies \phi_m = \cos^{-1}(0.63) \approx 50.95^\circ \\
\sin\phi_m &\approx 0.775 \\
P_m &= S_m \cos\phi_m = 30 \times 0.63 = 18.9\ \text{kW} \\
Q_m &= -S_m \sin\phi_m = -30 \times 0.775 \approx -23.3\ \text{kVAr (leading)}
\end{aligned}
$$

**Totals after expansion**
$$
\begin{aligned}
P_{\text{total}} &= P_1 + P_m = 92.5 + 18.9 = 111.4\ \text{kW} \\
Q_{\text{total}} &= Q_1 + Q_m = 62.2 - 23.3 = 38.9\ \text{kVAr (lagging)} \\
S_{\text{total}} &= \sqrt{P_{\text{total}}^2 + Q_{\text{total}}^2} = \sqrt{111.4^2 + 38.9^2} \approx 118.0\ \text{kVA}
\end{aligned}
$$

Therefore, after expansion the substation supplies **111.4 kW real** and **38.9 kVAr reactive** (lagging).

### Part (b): Power factor improvement

**New overall power factor**
$$
\text{pf}_{\text{new}} = \frac{P_{\text{total}}}{S_{\text{total}}} = \frac{111.4}{118.0} \approx 0.944 \quad (\text{lagging})
$$

**Comparison:** The original power factor was 0.83 lagging; the new value is 0.944 lagging. The power factor has **improved** because it has moved closer to unity (from 0.83 to 0.944).

**Justification:** The synchronous motor operates with a leading power factor (over-excited). This means it draws a leading current and therefore supplies reactive power to the system. That leading reactive power cancels a portion of the lagging reactive power required by the original industrial load. Consequently, the net lagging reactive power drawn from the substation decreases (from 62.2 kVAr to 38.9 kVAr), while the total active power increases only moderately. The reduction in net reactive demand raises the overall power factor.

![V-curves of synchronous motor](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves of synchronous motor: Armature current versus field current for various mechanical loads, along with the inverted V-curves showing power factor variation. Source: [www.electricaldesks.com](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

> **Final answer:**
> (a) Real power supplied = **111.4 kW**, reactive power supplied = **38.9 kVAr lagging**.
> (b) Yes, the overall power factor improves to **0.944 lagging** because the over-excited synchronous motor supplies leading reactive power, reducing the net lagging demand from the substation.


---

## Question 139
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 2A | EM-II ELE 2225 Makeup, 26 June 2024

An industrial load of 500 kW, 0.707 pf lagging is required to be improved to 600 kW, 0.95 pf lagging by connecting a synchronous motor in parallel. Determine the kVA rating and power factor at which it operates. 4

### Answer 139
**Given:** An industrial load of $500\text{ kW}$ at $0.707$ lagging pf is to be improved with a parallel synchronous motor, resulting in a total load of $600\text{ kW}$ at $0.95$ lagging pf.

**Step 1 - Original load reactive power:**
$$
\begin{aligned}
\phi_1 &= \cos^{-1} 0.707 = 45^\circ, \\
Q_1 &= P_1 \tan\phi_1 = 500 \times \tan 45^\circ = 500 \text{ kvar (lagging)}.
\end{aligned}
$$

**Step 2 - Desired total reactive power:**
$$
\begin{aligned}
\phi_{\text{new}} &= \cos^{-1} 0.95 \approx 18.19^\circ, \\
Q_{\text{new}} &= 600 \times \tan 18.19^\circ \approx 197.2 \text{ kvar (lagging)}.
\end{aligned}
$$

**Step 3 - Motor active and reactive power:**
Since the motor is connected in parallel, the total power is the sum of the original load and the motor contributions:
$$
\begin{aligned}
P_m &= P_{\text{new}} - P_1 = 600 - 500 = 100 \text{ kW}, \\
Q_m &= Q_{\text{new}} - Q_1 = 197.2 - 500 = -302.8 \text{ kvar}.
\end{aligned}
$$
The negative sign indicates that the motor supplies $302.8\text{ kvar}$ **leading** (acting as a capacitive load, i.e., overexcited synchronous motor).

**Step 4 - Motor kVA rating and power factor:**
The motor's apparent power is
$$
\begin{aligned}
S_m &= \sqrt{P_m^2 + Q_m^2} = \sqrt{(100)^2 + (302.8)^2} \approx \sqrt{10\,000 + 91\,688} \\
&= \sqrt{101\,688} \approx 318.9 \text{ kVA}.
\end{aligned}
$$
Its power factor is
$$
\text{pf}_m = \frac{P_m}{S_m} = \frac{100}{318.9} \approx 0.314 \quad (\text{leading}).
$$

Thus the synchronous motor must be rated at approximately $319\text{ kVA}$ and operate at a leading power factor of $0.314$.

> **Final answer:** Motor rating = **319 kVA**, power factor = **0.314 leading**.


---

## Question 140
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 2C | EM-II ELE 2225 Makeup, 26 June 2024

A 3 phase, 20 MVA, star connected alternator with an impedance of (0.5+j 6) Ω per phase is operating in parallel with constant voltage 11 kV bus bars. The field current is adjusted to give a line excitation voltage of 12 kV. With constant excitation, calculate (a) Maximum power output from the alternator (b) Armature current and power factor under maximum power condition. 4

### Answer 140
![Phasor diagram of synchronous generator](https://www.theengineeringknowledge.com/wp-content/uploads/2019/10/Phasor-Diagram-of-a-Synchronous-Generator-at-lagging-p.f.jpg)
*Figure: Phasor diagram of a synchronous generator on lagging power factor load. Source: [The Engineering Knowledge](https://www.theengineeringknowledge.com/phasor-diagram-of-a-synchronous-generator/).*

**Given:** 3-phase, star-connected alternator: $S = 20\text{ MVA}$, line voltage $V_L = 11\text{ kV}$, synchronous impedance per phase $Z = (0.5 + j6)\,\Omega$, excitation line voltage $E_L = 12\text{ kV}$ (constant). The machine operates on infinite busbars.

**Step 1 - Phase quantities:**
$$
\begin{aligned}
V_{\text{ph}} &= \frac{11\,000}{\sqrt{3}} \approx 6351\text{ V}, \qquad
E_{\text{ph}} = \frac{12\,000}{\sqrt{3}} \approx 6928\text{ V}, \\
|Z| &= \sqrt{0.5^2 + 6^2} = 6.021\,\Omega, \qquad
\theta = \tan^{-1}\frac{6}{0.5} \approx 85.24^\circ.
\end{aligned}
$$

**Step 2 - Power equation and maximum power condition:**
With armature resistance included, the real power delivered per phase is
$$
P_{\text{ph}} = \frac{E_{\text{ph}} V_{\text{ph}}}{|Z|}\cos(\theta - \delta) - \frac{V_{\text{ph}}^2}{|Z|}\cos\theta,
$$
where $\delta$ is the load angle ( $E_{\text{ph}}$ leads $V_{\text{ph}}$ by $\delta$ ). For fixed excitation, $P_{\text{ph}}$ is maximised when $\cos(\theta-\delta)=1$, i.e. when $\delta = \theta$. Hence
$$
P_{\max,\text{ph}} = \frac{E_{\text{ph}} V_{\text{ph}}}{|Z|} - \frac{V_{\text{ph}}^2}{|Z|}\cos\theta.
$$

**Step 3 - Maximum three-phase power:**
Substituting the numbers ($\cos\theta \approx 0.0830$):
$$
\begin{aligned}
P_{\max,\text{ph}} &\approx \frac{6351 \times 6928}{6.021} - \frac{6351^2}{6.021} \times 0.0830 \\
&= \frac{44.01 \times 10^6}{6.021} - \frac{40.33 \times 10^6}{6.021} \times 0.0830 \\
&= 7.312 \times 10^6 - 0.556 \times 10^6 = 6.756 \times 10^6 \text{ W}.
\end{aligned}
$$
Total three-phase output:
$$
P_{\max} = 3 \times 6.756 \approx 20.27\text{ MW} \quad (\text{or } 20.26\text{ MW}).
$$

**Step 4 - Armature current and power factor at this condition:**
At $\delta = \theta = 85.24^\circ$,
$$
E_{\text{ph}} = 6928\,\angle 85.24^\circ = 575.1 + j6903.5\text{ V},
\qquad V_{\text{ph}} = 6351\,\angle 0^\circ.
$$
The armature current per phase is
$$
I_{\text{ph}} = \frac{E_{\text{ph}} - V_{\text{ph}}}{Z} = \frac{-5775.9 + j6903.5}{0.5 + j6}.
$$
Multiplying numerator and denominator by the conjugate $0.5 - j6$:
$$
\begin{aligned}
I_{\text{ph}} &= \frac{(-5775.9 + j6903.5)(0.5 - j6)}{0.5^2 + 6^2} \\
&= \frac{38\,533 + j38\,107}{36.25} \approx 1063 + j1051\text{ A}.
\end{aligned}
$$
Hence
$$
|I_{\text{ph}}| = \sqrt{1063^2 + 1051^2} \approx 1495\text{ A}.
$$
The phase angle of $I_{\text{ph}}$ relative to $V_{\text{ph}}$ is
$$
\phi = \tan^{-1}\frac{1051}{1063} \approx 44.6^\circ,
$$
so the power factor is $\cos\phi \approx 0.711$ lagging. (Equivalently, using total quantities: $S = \sqrt{3}\,V_L I_L = \sqrt{3}\times 11\,000 \times 1495 = 28.48\text{ MVA}$, and $P/S = 20.26/28.48 = 0.711$.)

> **Final answer:** (a) Maximum power output ≈ **20.26 MW**. (b) Armature current ≈ **1495 A** at a power factor of **0.711 lagging**.


---

## Question 141
**Topic:** Field excitation effects, synchronous motor operation, power-angle, V-curves, starting and hunting · **Syllabus area:** Week 12 · **Source:** 2C | EM-II ELE 2251 End Sem, 31 May 2023

A 1,000 kW, 3.3 kV, 24 poles, 50 Hz, 3-phase star-connected synchronous motor has a synchronous reactance of 3.4 Ω per phase and the resistance is negligible. The motor is fed from an infinite bus bar at 3.3 kV. Its field excitation is adjusted to result in unity power factor operation at rated load. At this excitation, estimate the maximum power and torque this motor can deliver. Explain with the help of power-angle characteristics. (04)

### Answer 141
**Given:** Synchronous motor: rated $1000\text{ kW}$, $3.3\text{ kV}$ (line), $24$ poles, $50\text{ Hz}$, star-connected, $X_s = 3.4\,\Omega$/ph, $R_a \approx 0$. Operation at rated load with **unity power factor**.

**Step 1 - Rated current and excitation emf:**
At unity pf, $P_{\text{in}} = \sqrt{3}\,V_L I_L$, so
$$
I_L = I_{\text{ph}} = \frac{1000 \times 10^3}{\sqrt{3} \times 3300} \approx 174.95\text{ A}.
$$
Phase voltage:
$$
V_{\text{ph}} = \frac{3300}{\sqrt{3}} \approx 1905.3\text{ V}.
$$
For a synchronous motor ($R_a=0$), the excitation emf $E$ is obtained from the phasor relation $V_{\text{ph}} = E + j I_{\text{ph}} X_s$. With $I_{\text{ph}}$ in phase with $V_{\text{ph}}$,
$$
E = V_{\text{ph}} - j I_{\text{ph}} X_s = 1905.3 - j(174.95 \times 3.4) = 1905.3 - j594.8.
$$
Magnitude:
$$
|E| = \sqrt{1905.3^2 + 594.8^2} \approx 1996\text{ V (phase)}.
$$
The load angle $\delta$ (by which $E$ lags $V_{\text{ph}}$) is
$$
\delta = \tan^{-1}\frac{594.8}{1905.3} \approx 17.34^\circ.
$$

**Step 2 - Maximum power (pull-out power):**
For a cylindrical-rotor machine with negligible resistance, the per-phase electromagnetic power is
$$
P_{\text{ph}} = \frac{V_{\text{ph}} E}{X_s}\sin\delta.
$$
With fixed field excitation ($E$ constant), maximum power occurs at $\delta = 90^\circ$:
$$
P_{\max} = 3\,\frac{V_{\text{ph}} E}{X_s}
        = 3 \times \frac{1905.3 \times 1996}{3.4}
        \approx 3.356 \times 10^6\text{ W}.
$$
Hence $P_{\max} \approx 3.36\text{ MW}$.

**Step 3 - Maximum torque:**
Synchronous speed:
$$
N_s = \frac{120 f}{P} = \frac{120 \times 50}{24} = 250\text{ rpm},
\qquad
\omega_m = \frac{2\pi N_s}{60} = \frac{2\pi \times 250}{60} \approx 26.18\text{ rad/s}.
$$
Pull-out torque:
$$
T_{\max} = \frac{P_{\max}}{\omega_m} = \frac{3.356 \times 10^6}{26.18} \approx 128.2 \times 10^3 \text{N}\cdot\text{m} \;\;(\approx 128 \text{kN}\cdot\text{m}).
$$

**Step 4 - Power-angle characteristic (explanation):**
The motor's power-angle relation is $P = P_{\max}\sin\delta$.
- At no load $\delta \approx 0^\circ$, $P \approx 0$.
- As mechanical load increases, $\delta$ advances and the developed power rises.
- Stable operation is possible only in the range $0^\circ < \delta < 90^\circ$.
- The maximum power (steady-state stability limit) is reached at $\delta = 90^\circ$.
- If the load torque exceeds $T_{\max}$, $\delta$ would exceed $90^\circ$, the electromagnetic power would *decrease*, and the motor would lose synchronism (pull-out).
- In this machine, with the excitation set for unity pf at rated load ($\delta \approx 17.34^\circ$), the motor can deliver up to **3.36 MW**-about **3.36 times** the rated power-before pulling out. The corresponding maximum torque is **≈128 kN·m**.

> **Final answer:** Maximum power = **3.36 MW**; maximum torque = **128 kN m**.


---
