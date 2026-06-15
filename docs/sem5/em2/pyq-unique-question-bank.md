---
title: PYQ Unique Question Bank
description: Conceptually unique Electrical Machines II previous-year questions with complete answers.
---

# Electrical Machines II PYQ Unique Question Bank

This page keeps one solved representative for each distinct in-syllabus skill from the cleaned PYQ answer bank. Repeated questions that test the same method with different numerical values are removed.

**Total questions:** 52

---

## Question 1
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 End Sem, 13 May 2014
**Unique skill:** Derive Kd, Kp formulas

Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding (02)

### Answer 1
**(i) Integral and Fractional slot winding**
- **Integral-slot winding:** The number of slots per pole per phase $q = \frac{S}{P \times m}$ is an integer. This yields a simple, symmetrical layout where each phase belt occupies a whole number of slots per pole.
- **Fractional-slot winding:** $q$ is not an integer (e.g. $2\frac{1}{2}$). It is employed to reduce cogging torque, suppress certain harmonics, or to suit specific slot-pole combinations. Careful design ensures balanced phase voltages.

**(ii) Full pitch and Fractional pitch winding**
- **Full-pitch winding:** The coil span equals one pole pitch ($180^\circ$ electrical). The two coil sides experience emfs in exact phase opposition; the resultant coil emf is the arithmetic sum, giving maximum fundamental output.
- **Fractional-pitch (short-pitch) winding:** The coil span is less than $180^\circ$ electrical by a chording angle $\alpha$. The fundamental emf is reduced by factor $\cos(\alpha/2)$. Short-pitching can eliminate selected harmonic emfs (when $\cos(n\alpha/2)=0$), reduces end-winding copper, and lowers leakage reactance.

> **Final answer:** Integral: $q$ integer; fractional: $q$ fractional. Full-pitch: coil span = $180^\circ$ electrical; fractional-pitch: coil span $< 180^\circ$ electrical.


---

## Question 2
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 Makeup, 08 July 2014
**Unique skill:** Compute Kd, Kp, EMF from given slots/poles/span/flux

A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air-gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced. (04)

### Answer 2
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

## Question 3
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1B | EM-II ELE 204 End Sem, 13 May 2014
**Unique skill:** Harmonic % increase in phase voltage

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
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1C | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Harmonic with flux density waveform B(θ)

A 3 phase, 6 pole, 1000 rpm star connected alternator has an air-gap diameter of 40 cm and a core length of 90 cm. The armature consists of 54 slots with 4 conductors per slot. The flux density in the air-gap is given by B(θ)=0.25 × sin θ + 0.16 × sin 3θ + 0.07 × sin 5θ. The winding factors for fundamental, 3rd and 5th harmonic are 0.95, 0.58 and 0.14 respectively. Determine resultant phase and line emfs. (05)

### Answer 4
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

## Question 5
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1C | EM-II ELE 2251 End Sem, 31 May 2023
**Unique skill:** Harmonic distribution factor + comment

Determine the distribution factor corresponding to the fifth harmonic component of generated voltage in a three-phase, 50 Hz, AC generator with 54 slots & 6 poles. Also, comment on the effects of the fifth harmonic component in the generated voltage. (03)

### Answer 5
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

## Question 6
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 2A | EM-II ELE 204 Makeup, 08 July 2014
**Unique skill:** Harmonic suppression by short-pitching

A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical Determine (i) total number of armature slots (ii) minimum order of harmonic emf that can be suppressed. (03)

### Answer 6
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

## Question 7
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 3C | EM-II ELE 2202 End Sem, 29 April 2019
**Unique skill:** Harmonic % in line voltage (no Kd/Kp)

In a star-connected alternator calculate the percentage of 5th harmonics induced in the line voltage if the average flux per pole of fifth harmonic components is 1% of that of the fundamental. Neglect the pitch and distribution factors. (02)

### Answer 7
In a star-connected alternator, calculate the percentage of 5th harmonic induced in the line voltage. Given: average flux per pole of 5th harmonic is 1\% of fundamental, neglect pitch and distribution factors.

**Solution:**

Induced phase emf for harmonic $n$: $E_{ph,n} \propto n\,\phi_n$ (since $K_w=1$).
Fundamental: $E_{ph,1} \propto 1 \times \phi_1$.
5th harmonic: $E_{ph,5} \propto 5 \times 0.01\phi_1 = 0.05\phi_1$.
Thus $\frac{E_{ph,5}}{E_{ph,1}} = 0.05 = 5\%$.

In a star connection, for non-triplen harmonics (such as 5th), the line voltage is $\sqrt{3}$ times the phase voltage. Hence the 5th harmonic percentage in line voltage remains 5\%.

> **Final answer:** The 5th harmonic line-voltage component is 5\% of the fundamental line voltage.


---

## Question 8
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 1A | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Advantages of short-pitched windings

Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine. (02)

### Answer 8
Short-pitching (chording) is the practice of making the coil span less than the full pole pitch of 180° electrical. The following advantages are obtained:

1. **Harmonic elimination:** The pitch factor for the $n$th harmonic is $K_{pn}= \cos(n\alpha/2)$, where $\alpha$ is the chording angle. By choosing $\alpha = 180^\circ/n$, the $n$th harmonic is completely cancelled. For example, $\alpha = 36^\circ$ eliminates the 5th harmonic, and $\alpha \approx 25.7^\circ$ removes the 7th. A common short-pitch of 30° ($\alpha=30^\circ$) greatly attenuates both the 5th and 7th. The result is a near-sinusoidal voltage waveform, with lower harmonic losses, less magnetic noise, and reduced torque pulsations.

2. **Saving in copper:** Shorter end connections require less copper, which lowers material cost, reduces winding weight, and cuts $I^2R$ losses. This can also lead to smaller overall machine dimensions.

3. **Lower leakage reactance and better cooling:** Reduced overhang length decreases stator leakage reactance, improving voltage regulation of generators and torque-speed characteristics of motors. The slimmer end windings also permit improved cooling airflow, allowing higher current densities.

4. **Quieter operation and lower stray losses:** By suppressing harmonic fluxes, pulsating torques, stray eddy-current losses in the core and structure, and magnetic noise are all diminished.

The only drawback is a slight reduction of the fundamental induced emf by the factor $\cos(\alpha/2)$, which is a small price for the significant benefits gained.

> **Final answer:** Short-pitch windings suppress harmonics, save copper, reduce leakage reactance, improve cooling and noise performance, with only a modest loss in fundamental emf.


---

## Question 9
**Topic:** AC windings, winding factor, harmonics and generated EMF · **Syllabus area:** Weeks 3-4 · **Source:** 5A | EM-I ELE 2103 End Sem, 27 November 2018
**Unique skill:** Winding table construction

Develop a single layer wave winding table for the stator winding of a three phase AC machine with 36 slots and 4 poles. Assume RBY sequence. (04)

### Answer 9
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

## Question 10
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 5B | EM-I ELE 205 End Sem, 04 December 2006
**Unique skill:** Approximate EC: given all params, find currents, losses, torque, efficiency at given slip

A 115 V, 60 Hz, 3 phase star connected, 6 pole induction motor has stator impedance of (0.07+j0.3) Ω and equivalent rotor impedance at standstill of (0.08+j0.3) Ω. Magnetising branch has G₀ = 0.022 and B₀ = 0.158. Using the approximate equivalent circuit, at a slip of 2% determine: (i) Rotor current (ii) Stator current (iii) Power input and input power factor (iv) Power output (v) Torque developed (vi) Efficiency of the motor.

### Answer 10
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

## Question 11
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 3B | EM-I ELE 2103 End Sem, 27 November 2018
**Unique skill:** Power flow: given mech output + speed, find P_rcu, P_in, η

A 3 phase, 400 V, 6-pole, 50 Hz induction motor develops mechanical power of 20 kW at 985 rpm. The stator losses are equal to 1800 W. Neglect the mechanical losses. Calculate: i) The rotor copper loss & rotor frequency ii) The total input power. (03)

### Answer 11
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

## Question 12
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 7A | EM-I ELE 205 End Sem, 04 December 2006
**Unique skill:** Rotor resistance for speed reduction (constant torque)

The rotor of a 6-pole, 50 Hz, slip ring induction motor has a resistance of 0.2 Ω/phase and runs at 960 rpm on full load. Calculate the approximate resistance/phase to be included in the rotor circuit such that the speed is reduced to 800 rpm for full load torque.

### Answer 12
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

## Question 13
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 4B | EM-I ELE 205 End Sem, 08 December 2007
**Unique skill:** Rotor EMF injection speed control

A 10 kW, 50 Hz, 4 pole, 3 phase induction motor has a rotor leakage impedance of (0.2 + j1.5) Ω per phase at standstill. When delivering full load torque the motor runs at 1440 rpm. Standstill rotor voltage = 60 V per phase. Determine the magnitude of emf injected at the rotor terminals for a speed of a) 1000 rpm b) 1800 rpm. Assume load torque remains constant. (05)

### Answer 13
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

## Question 14
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 4B | EM-I ELE 2154 Makeup/GI, 28 July 2021
**Unique skill:** Power flow diagram drawing

Consider a 415V, 4pole, 50Hz induction motor operating at 4% slip. The shaft power output is 1.2 kW. The machine has stator losses of 50W and rotational losses of 70W. Draw the power flow diagram with power stages. (05)

### Answer 14
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

## Question 15
**Topic:** Three-phase induction motor fundamentals, equivalent circuit and power flow · **Syllabus area:** Weeks 6-8 · **Source:** 5B | EM-I ELE 205 Makeup, 08 January 2008
**Unique skill:** Loss breakdown from efficiency + ratios

For a 6 pole 3 phase Induction motor has mechanical losses total 2 HP at a speed of 950 RPM on 550 V, 50 Hz mains. The power factor is 0.88. Calculate for this load (i) The rotor copper loss (ii) The total input if the stator losses are 2000 W (iii) The efficiency (iv) The line current (04)

### Answer 15
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

## Question 16
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 4A | EM-I ELE 205 End Sem, 03 December 2014
**Unique skill:** Starting current/torque ratios: star-delta, auto-transformer, DOL

A squirrel cage induction motor, when started by means of a star-delta starter draws 200 % of full load current and develops 44 % of full load torque at starting. If an auto-transformer with 75 % tapping is used, determine: (i) Full load slip (ii) Ratio of starting torque to full load torque (iii) Starting motor current and starting line current as % of full load current. 4

### Answer 16
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

## Question 17
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5A | EM-I ELE 205 End Sem, 08 December 2007
**Unique skill:** Max torque / slip at max torque from params

A 3 phase induction motor has a starting torque of 150 % & a maximum torque of 250 % of the full load torque. Neglecting stator impedance calculate a) the slip at maximum torque b) full load slip (03)

### Answer 17
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

## Question 18
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 6A | EM-I ELE 205 Makeup, 05 January 2015
**Unique skill:** Torque-slip characteristic sketch + explain

Sketch and explain the torque-slip characteristics of a 3 phase slip ring induction motor for different values of rotor resistance. 3

### Answer 18
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

## Question 19
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 3C | EM-I ELE 205 Makeup, 08 January 2008
**Unique skill:** External rotor resistance for speed reduction

A 10 pole 50 Hz slip ring induction motor runs at 580 RPM on full load. The rotor resistance per phase is 0.3 Ω. Calculate the additional resistance per phase to be inserted in the rotor circuit if the speed is to be reduced to 500 RPM for full load torque. (03)

### Answer 19
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

## Question 20
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5C | EM-I ELE 205 End Sem, 04 December 2006
**Unique skill:** Star-delta starter explain

Explain the working of a star-delta starter for a 3 phase induction motor.

### Answer 20
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

## Question 21
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 6C | EM-I ELE 205 Makeup, 05 January 2015
**Unique skill:** V/f constant during speed control — reason

The ratio V/f should be maintained constant during speed control of a 3 phase induction motor. Give reasons. 2

### Answer 21
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

## Question 22
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 4A | EM-I ELE 2103 End Sem, 27 November 2018
**Unique skill:** VVVF speed control explain

Discuss the variable frequency control strategies for the speed control of 3-phase induction motor. (02)

### Answer 22
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

## Question 23
**Topic:** Induction motor torque-slip characteristics, starting, speed control and braking · **Syllabus area:** Weeks 7-9 · **Source:** 5C | EM-I ELE 205 Makeup, 08 January 2008
**Unique skill:** Rotor construction to improve starting torque

What changes can be made on cage rotor construction to improve the starting torque of a three phase induction motor. (02)

### Answer 23
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

## Question 24
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3B | EM-I ELE 205 End Sem, 03 December 2014
**Unique skill:** Full circle diagram from NL+BR data → pf, slip, η, T_max

A 3 phase, 50 Hz, 400 V induction motor has the following test data: No load Test: 400 V, 10 A, 1 kW; Blocked rotor Test: 150 V, 40 A, 4 kW. Equivalent rotor resistance per phase referred to stator is equal to Stator resistance per phase. Draw the circle diagram and determine (a) Line current and operating slip when the shaft power is 40 HP, (b) Maximum power input. 6

### Answer 24
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

## Question 25
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 5B | EM-I ELE 205 Makeup, 05 January 2015
**Unique skill:** Circle diagram — identify lengths (starting torque, etc.)

Draw the sketch of circle diagram of an Induction motor and define various phasors involved in it. Identify the length representing the starting torque. Justify your statement. 4

### Answer 25
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

## Question 26
**Topic:** Circle diagram and induction motor tests · **Syllabus area:** Week 8 · **Source:** 3C | EM-I ELE 2123 End Sem, 05 December 2023
**Unique skill:** Equivalent circuit parameters from NL+BR tests

A 4kW, 400V, 50Hz, 3 phase, 4 pole δ connected induction motor has stator 4 resistance of 0.36 Ω per phase and rotor resistance of 0.06 Ω per phase. The no load and blocked rotor test data are as follows: No load test: 400 V, 3.3 A, p.f =0.174 Blocked rotor test: 210V, 16A, p.f =0.45 Estimate the single-phase equivalent circuit of the induction motor.

### Answer 26
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

## Question 27
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 7B | EM-I ELE 205 End Sem, 04 December 2006
**Unique skill:** Pulsating field / double revolving field → no starting torque

Show that a single phase current in a single phase winding produces only a pulsating magnetic field.

### Answer 27
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

## Question 28
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 4B | EM-I ELE 2103 End Sem, 27 November 2018
**Unique skill:** Capacitor start — phasor + torque production

With necessary phasor diagram, explain how a capacitor can help in starting of a single-phase induction motor. (03)

### Answer 28
In a single-phase motor, a single winding produces a pulsating field and develops no starting torque. To obtain starting torque, a capacitor-start motor uses two stator windings in space quadrature ($90^\circ$ electrical) - the main winding and an auxiliary winding. A capacitor is connected in series with the auxiliary winding.

The main winding is highly inductive, so its current $I_m$ lags the supply voltage $V$ by a large angle $\phi_m \approx 70^\circ\!-\!80^\circ$. The capacitor cancels part of the auxiliary winding's inductance, making the auxiliary current $I_a$ less lagging or even leading $V$ by an angle $\phi_a \approx 20^\circ\!-\!40^\circ$. With proper capacitance, the phase displacement $|\phi_m - \phi_a|$ approaches $90^\circ$.

The phasor diagram (taking $V$ as reference) shows $I_m$ lagging by $\phi_m$ and $I_a$ leading (or lagging less) by $\phi_a$, giving a nearly $90^\circ$ time-phase difference between the two winding currents. Combined with the $90^\circ$ spatial displacement of the windings, this produces an approximate rotating magnetic field. The rotating field cuts the rotor conductors, inducing e.m.f.s and currents that interact with the field to develop a unidirectional starting torque.

Once the motor reaches about $70\!-\!80\%$ of synchronous speed, a centrifugal switch disconnects the auxiliary winding and capacitor; they are not needed for running.

![Capacitor-start motor circuit](https://www.electricalvolt.com/wp-content/uploads/2023/02/cap1-1024x615.png)
*Figure: Circuit diagram of a capacitor-start single-phase induction motor with main and auxiliary windings, capacitor, and centrifugal switch. Source: [Electrical Volt](https://www.electricalvolt.com/capacitor-start-induction-motor/).*

> **Final answer:** The capacitor causes a time-phase displacement between the main and auxiliary winding currents. Together with the spatial displacement of the windings, this creates a rotating field that produces the necessary starting torque.


---

## Question 29
**Topic:** Single-phase induction motors · **Syllabus area:** Week 10 · **Source:** 5C | EM-I ELE 205 End Sem, 30 November 2010
**Unique skill:** Equivalent circuit + torque calculation (given params)

A 240V, 50Hz, 2 pole single phase induction motor has the following equivalent circuit impedances: r1=2.2Ω, r2'=3.8Ω, x1=3Ω, x2'=2.1Ω, xm=86Ω. Friction, windage and core losses=50W. Calculate input current, power factor, output power and efficiency at a full load speed of 2820RPM. (05)

### Answer 29
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

## Question 30
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 2C | EM-II ELE 2202 Makeup, 16 June 2017
**Unique skill:** Field on rotor vs stator — advantages

What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator? (02)

### Answer 30
Advantages of rotor-field/stator-armature construction in large alternators:

- The heavy AC armature winding, carrying high voltage and high current, is stationary. This eliminates high-current sliding contacts, allows direct bolted connections to busbars, reduces losses, and improves reliability.
- Stationary windings permit robust insulation and mechanical bracing against short-circuit forces, unaffected by centrifugal stresses.
- Effective cooling is simpler: large cooling ducts and liquid cooling systems can be incorporated into the stationary frame.
- The rotor DC field winding operates at low voltage and low current (a few percent of machine rating). Excitation power is easily supplied through small slip-rings or a brushless exciter, minimizing maintenance.
- The rotor is mechanically simpler and lighter, enabling higher speeds and reducing centrifugal stress on field windings.

This arrangement is universally adopted for large alternators because it separates the high-power output circuit from the low-power excitation circuit, yielding a robust, low-maintenance machine.

> **Final answer:** Placing the field on the rotor enables a stationary high-power armature with simple insulation and cooling, while the low-power DC field is fed via small slip-rings or a brushless system, resulting in high reliability and easy maintenance.


---

## Question 31
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 1A | EM-II ELE 2225 End Sem, 09 May 2024
**Unique skill:** Synch vs induction machine differences

‘The inherent nature of synchronous machines is to rotate in synchronism with the supply frequency while that of induction motors is to rotate with a slip’. Differentiate the above two machines. Use necessary schematic diagrams to justify your answer.

### Answer 31
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

## Question 32
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 1C | EM-II ELE 2225 End Sem, 09 May 2024
**Unique skill:** Synchronous machine can operate at different pfs — justify

‘Unlike asynchronous machines, Synchronous machines can be operated at different power factors’. Justify this statement with the help of necessary characteristics. 3

### Answer 32
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

## Question 33
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 4A | EM-II ELE 2202 Makeup, 19 June 2018
**Unique skill:** Lamp synchronization method

With neat sketch, explain how an alternator can be synchronized to the grid using ‘Bright lamp method’. What are the conditions to be met to synchronize two 3-phase alternators? (05)

### Answer 33
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

## Question 34
**Topic:** Synchronous machine construction and alternator fundamentals · **Syllabus area:** Week 11 · **Source:** 2C | EM-II ELE 204 Makeup, 08 July 2014
**Unique skill:** Excitation EMF + load angle (basic phasor)

A 1500 kVA, 6.6 kV, 3-phase star connected wound rotor alternator with a resistance of 0.4 Ω and reactance of 6 Ω per phase, delivers full load current at 0.8 power factor lagging and normal terminal voltage. Estimate the excitation emf required and respective load angle. (04)

### Answer 34
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

## Question 35
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Cylindrical-rotor phasor: find Ef, δ from V, Ia, pf

A 3 phase, star connected cylindrical rotor alternator with a synchronous reactance of 5 per phase with negligible armature resistance is supplying 250 A at 0.8 power factor lagging to a 11 kV infinite bus. Determine (a) excitation emf and load angle (b) If excitation is increased by 15 % without changing its driving torque, determine the new values of load angle, armature current and power factor (03)

### Answer 35
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

## Question 36
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 2202 End Sem, 10 May 2016
**Unique skill:** Cylindrical-rotor: max power, max torque from params

A 15 kW, 400 V, 50 Hz, 3 phase, star connected synchronous motor has its synchronous impedance of (1+j5) Ω per phase. If the excitation is maintained constant at 277 V per phase, determine the maximum load the synchronous motor can drive and corresponding current and power factor. (05)

### Answer 36
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

## Question 37
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Cylindrical-rotor: effect of varying excitation at constant power

A 3 phase, star connected cylindrical rotor alternator with a synchronous reactance of 5 per phase with negligible armature resistance is supplying 250 A at 0.8 power factor lagging to a 11 kV infinite bus. Determine (a) excitation emf and load angle (b) If excitation is increased by 15 % without changing its driving torque, determine the new values of load angle, armature current and power factor (03)

### Answer 37
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

## Question 38
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2A | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Armature reaction EMF/MMF diagram for inductive/capacitive/resistive

Draw the EMF and MMF diagrams when a pure inductive load is connected to a 3 phase wound rotor synchronous generator with negligible armature resistance. Hence discuss the armature reaction effect. (03)

### Answer 38
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

## Question 39
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 2202 Makeup, 13 June 2019
**Unique skill:** Effect of load pf on armature reaction

Explain the effect of load power factor on armature reaction in alternators. (03)

### Answer 39
Armature reaction is the magnetic influence of the armature current on the main field. Its effect on the terminal voltage depends on the load power factor because the armature mmf ($F_a$) shifts in space relative to the field mmf ($F_f$) as the phase of $I_a$ changes with respect to the excitation emf $E_f$.

- **Unity pf load:** $I_a$ is in phase with $E_f$. The mmf $F_a$ is in quadrature with $F_f$, leading to cross-magnetisation. The flux per pole is distorted but its mean value stays almost constant, so the terminal voltage $V_t$ experiences a very small drop.
- **Lagging pf load (inductive):** $I_a$ lags $E_f$. $F_a$ has a demagnetising component that directly weakens the main flux. The reduced flux lowers the induced emf, causing a larger drop in $V_t$.
- **Leading pf load (capacitive):** $I_a$ leads $E_f$. $F_a$ has a magnetising component that strengthens the main flux. The increased flux raises the induced emf and can make $V_t$ exceed the no-load voltage.

These effects are conveniently shown on the Blondel (EMF-MMF) diagram, where the resultant mmf is the phasor sum $F_r = F_f + F_a$. For a lagging load, $|F_r| < |F_f|$ (demagnetising); for a leading load, $|F_r| > |F_f|$ (magnetising). The corresponding phasor diagram for voltage reveals that the synchronous reactance drop $j I_a X_s$ alters the magnitude of $E_f$ required to maintain $V_t$, thus linking the pf directly to voltage regulation.

> **Final answer:** Lagging pf - demagnetising (voltage sag); unity pf - cross-magnetising (small drop); leading pf - magnetising (voltage rise).


---

## Question 40
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3A | EM-II ELE 2202 End Sem, 29 April 2019
**Unique skill:** Constant excitation, variable load — phasor + min excitation significance

Describe the operation of alternator with constant excitation and variable load with suitable phasor diagrams. What is the significance of the condition with minimum excitation? Analyze the relation between power factor and excitation with the help of suitable curve. (05)

### Answer 40
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

## Question 41
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2C | EM-II ELE 2202 Makeup, 13 June 2019
**Unique skill:** OCC + SCC → voltage regulation by EMF method

A 3-phase, star connected alternator is rated 1,600 kVA, 13.5 kV. Its per-phase effective armature resistance & synchronous reactance are 1 & 40 respectively. a) Calculate the percentage voltage regulation for a load of 1,250 kW at 0.8 pf lagging. b) Draw the phasor diagram for the given load. (03)

### Answer 41
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

## Question 42
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 5A | EM-II ELE 204 Makeup, 08 July 2014
**Unique skill:** V-curves and inverted V-curves — significance

A 3 phase, 50 Hz, 440 V, synchronous motor has a synchronous impedance of (0.5+j4) Ω/phase. Draw a set of excitation circles with excitation emfs of 50%, 90% and 125% of its terminal voltage. For an armature current of 35 A, graphically determine the load angle and power factor for each of the above excitations. (04)

### Answer 42
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

## Question 43
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 4B | EM-II ELE 2202 End Sem, 29 April 2019
**Unique skill:** PF correction by synchronous motor

A factory has an average load of 1000kW at a power factor of 0.6 lag. A synchronous motor of 86% efficiency is used later to supply an additional mechanical load of 65kW and also to improve the overall power factor to 0.92 lag. Determine the power factor at which the synchronous motor operates. Also comment on the type of excitation required for the synchronous motor for this application and draw the corresponding phasor diagram relating terminal voltage and excitation emf. (05)

### Answer 43
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

## Question 44
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 2C | EM-II ELE 2202 End Sem, 24 April 2017
**Unique skill:** Synchronous motor phasor + load angle + power

Using relevant phasor diagram, discuss the behaviour of a cylindrical rotor synchronous motor supplying a constant load but operating under varying excitation conditions. (03)

### Answer 44
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

## Question 45
**Topic:** Alternator armature reaction, voltage regulation, OCC/SCC and phasor diagrams · **Syllabus area:** Weeks 11-12 · **Source:** 3B | EM-II ELE 2202 End Sem, 24 April 2017
**Unique skill:** S.C. test behaviour (waveforms)

Along with necessary waveforms, discuss the behaviour of a three-phase alternator subjected to a symmetrical 3-phase short circuit. (03)

### Answer 45
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

## Question 46
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 2202 End Sem, 24 April 2017
**Unique skill:** Salient-pole: find Id, Iq, Ef, regulation, power from Xd, Xq

A three-phase, 20 MVA, 11 kV, 50 Hz star-connected alternator has Xd = 4 Ω and Xq = 3 Ω. Armature resistance is negligibly small. At full load, 0.8 lagging power factor, determine: a) Direct and quadrature axes components of the armature current. b) Excitation emf. c) Voltage regulation. d) Electromagnetic power. e) Reluctance power. (07)

### Answer 46
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

## Question 47
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 204 Makeup, 09 July 2015
**Unique skill:** Salient-pole: electromagnetic + reluctance power

A 5 MVA, 6.6 KV, 3- phase, 6.6 KV 50 Hz, star connected salient pole alternator is connected to an infinite bus. The direct axis reactance is 12 Ω while that of quadrature axis is 9.5 Ω per phase. The armature resistance is 1.5 Ω per phase. When the generator is operating at rated MVA at 0.9 pf lagging, calculate the electromagnetic power developed and reluctance power. (05)

### Answer 47
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

## Question 48
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4A | EM-II ELE 204 Makeup, 08 July 2014
**Unique skill:** Salient-pole: Blondel phasor derivation/drawing

With the aid of phasor diagram based on Blondel’s two reaction theory, derive an expression for the active power output of a 3 phase Salient pole alternator in terms of excitation emf, terminal voltage, direct and quadrature axis reactance. Neglect armature resistance. (04)

### Answer 48
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

## Question 49
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 3A | EM-II ELE 2225 End Sem, 09 May 2024
**Unique skill:** Salient-pole: power-angle characteristic vs cylindrical

Differentiate the power-angle characteristics of cylindrical rotor and salient pole synchronous generator. 3

### Answer 49
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


---

## Question 50
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 4C | EM-II ELE 204 End Sem, 13 May 2014
**Unique skill:** Slip test: connection diagram, procedure, significance

Draw a neat connection diagram for measurement of direct and quadrature axis reactance by slip test. (02)

### Answer 50
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

## Question 51
**Topic:** Salient-pole machines, Blondel two-reaction theory and slip test · **Syllabus area:** Week 12 · **Source:** 5A | EM-II ELE 2202 End Sem, 29 April 2019
**Unique skill:** Reluctance power significance

What is the significance of reluctance power in salient pole synchronous machines? Discuss with power-angle characteristics. (03)

### Answer 51
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

## Question 52
**Topic:** Synchronization and parallel operation of alternators · **Syllabus area:** Week 11 · **Source:** 1C | EM-II ELE 204 End Sem, 13 May 2014
**Unique skill:** Synchronization conditions + lamp method

List the necessary conditions to be satisfied while synchronising 3 phase alternators. With neat connection diagram, explain “Two Bright One Dark Lamp method” of synchronisation. (04)

### Answer 52
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
