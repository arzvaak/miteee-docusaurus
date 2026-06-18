---
sidebar_position: 10.5
title: "Week 10: Practice Questions"
---

# Week 10: Practice Questions

## Previous Year Questions

### Q1. How is torque produced in a capacitor start single-phase induction motor? Is there any need for this capacitor after starting? Explain.

**Answer:**

In a **capacitor-start single-phase induction motor**, torque is produced by creating a **phase difference** between the currents in two stator windings:

1. **Main winding** (running winding) — connected directly across the supply
2. **Auxiliary winding** (starting winding) — connected in series with a **capacitor**

**How torque is produced:**

The capacitor in series with the auxiliary winding causes the current in that winding to **lead** the supply voltage. The main winding current **lags** the voltage due to its inductive nature. This creates a **phase difference** of approximately $90^\circ$ between the two currents, producing a **rotating magnetic field** that generates starting torque.

**Need for capacitor after starting:**

**No**, the capacitor is not needed after starting. Once the motor reaches about **75-80% of synchronous speed**, a **centrifugal switch** disconnects the auxiliary winding and capacitor from the circuit. The motor then continues to run as a **single-phase induction motor** using only the main winding.

**Reason:** The auxiliary winding is designed for **short-time duty** (high resistance, thin wire). If left connected, it would overheat. The capacitor also serves no purpose at running speed because the motor develops sufficient torque from the pulsating field alone.

---

### Q2. With necessary phasor diagram, explain how a capacitor can help in starting of a single-phase induction motor.

**Answer:**

**Phasor Diagram Description:**

Consider a single-phase supply voltage $\bar{V} = V_m \angle 0^\circ$ applied to both windings:

- **Main winding current** $\bar{I}_m$ lags the voltage by angle $\phi_m$ (typically $60^\circ-80^\circ$)
- **Auxiliary winding current** $\bar{I}_a$ leads the voltage because of the series capacitor

The phasor diagram shows:
- $\bar{V}$ as reference phasor along $0^\circ$
- $\bar{I}_m$ at angle $-\phi_m$ (lagging)
- $\bar{I}_a$ at angle $+\phi_a$ (leading)
- The phase difference between $\bar{I}_m$ and $\bar{I}_a$ is $\phi_m + \phi_a \approx 90^\circ$

**Explanation:**

The capacitor creates a **leading current** in the auxiliary winding. With proper capacitor selection, the phase difference between $\bar{I}_m$ and $\bar{I}_a$ approaches $90^\circ$ electrical degrees. These two currents, flowing in spatially displaced windings (typically $90^\circ$ apart), produce a **rotating magnetic field** that provides starting torque.

**Key points:**
- Without capacitor, both currents would lag the voltage, giving a small phase difference and negligible starting torque
- The capacitor value is chosen to achieve **near $90^\circ$ phase shift** at starting
- The capacitor also **boosts** the auxiliary winding voltage, increasing the starting torque

---

### Q3. With the help of double field revolving theory, prove that a single-phase induction motor containing only one stator winding produces no starting torque. Justify your answer with suitable characteristics.

**Answer:**

**Double Field Revolving Theory:**

According to this theory, a **pulsating magnetic field** produced by a single-phase winding can be resolved into two **rotating magnetic fields** of equal magnitude rotating in **opposite directions**:

$$
\bar{B}_{total} = \bar{B}_f + \bar{B}_b
$$

Where:
- $\bar{B}_f$ — forward rotating field (same direction as rotor)
- $\bar{B}_b$ — backward rotating field (opposite direction to rotor)

Each field has magnitude half of the peak pulsating field: $B_f = B_b = \frac{B_m}{2}$

**Proof of No Starting Torque:**

At standstill ($s = 1$):

1. The rotor sees both forward and backward fields with **equal slip**:
   - Forward slip: $s_f = 1$
   - Backward slip: $s_b = 1$

2. Both fields induce equal voltages and currents in the rotor

3. The torques produced by the two fields are **equal in magnitude but opposite in direction**:
   $$
   T_f = T_b \quad \text{(at standstill)}
   $$

4. Net torque:
   $$
   T_{net} = T_f - T_b = 0
   $$

**Torque-Slip Characteristic:**

The torque-slip characteristic shows:
- Forward field torque $T_f$ — positive for $s < 1$, zero at $s = 1$
- Backward field torque $T_b$ — negative for $s < 1$, zero at $s = 1$
- Net torque $T_{net} = T_f - T_b$ — **zero at $s = 1$** (standstill)

[Image: EM1_EM2_Swayam_Numerical_Questions_With_Answers_p1_img-0_jpeg.png — see lecture notes]

<div align="center">
  <em>Figure: Torque-slip characteristics showing forward, backward, and net torque for a single-phase induction motor. Note zero net torque at s=1.</em>
</div>

**Conclusion:** A single-phase induction motor with only one stator winding produces **zero starting torque** because the forward and backward rotating fields cancel each other at standstill.

---

### Q4. Explain the operation of a single-phase induction motor using double field revolving theory.

**Answer:**

**Double Field Revolving Theory Explanation:**

A single-phase induction motor's operation can be understood by decomposing the pulsating magnetic field into two counter-rotating fields:

**Step 1: Pulsating Field Decomposition**

The pulsating field along the stator axis:
$$
b(\theta, t) = B_m \cos(\omega t) \cos(\theta)
$$

Using trigonometric identity:
$$
b(\theta, t) = \frac{B_m}{2} \cos(\omega t - \theta) + \frac{B_m}{2} \cos(\omega t + \theta)
$$

This gives:
- **Forward rotating field**: $\frac{B_m}{2} \cos(\omega t - \theta)$ — rotates at synchronous speed $\omega_s$
- **Backward rotating field**: $\frac{B_m}{2} \cos(\omega t + \theta)$ — rotates at $-\omega_s$

**Step 2: Operation at Running Condition**

When the rotor is running at speed $N_r$ in the forward direction:

- **Forward field slip**: $s_f = \frac{N_s - N_r}{N_s}$ (small, typically 3-5%)
- **Backward field slip**: $s_b = \frac{N_s + N_r}{N_s} = 2 - s_f$ (close to 2)

**Step 3: Torque Production**

- Forward field produces **positive torque** $T_f$ (motor action)
- Backward field produces **negative torque** $T_b$ (braking action)
- Net torque: $T_{net} = T_f - T_b$

At running speed, $s_f$ is small, so $T_f$ is large, while $s_b \approx 2$, so $T_b$ is small. The net torque is **positive and sufficient** to drive the load.

**Step 4: Performance Characteristics**

- The backward field causes **double-frequency torque pulsations** (at $2f$)
- The motor has **lower efficiency** compared to three-phase induction motors
- Starting requires an auxiliary mechanism (capacitor, shaded pole, etc.)

---

### Q5. Show that a single-phase current in a single-phase winding produces only a pulsating magnetic field.

**Answer:**

**Mathematical Proof:**

Consider a single-phase winding with its axis along the $\theta = 0$ direction. When a sinusoidal current $i(t) = I_m \cos(\omega t)$ flows through it, the **MMF distribution** in the air gap is:

$$
\mathcal{F}(\theta, t) = \mathcal{F}_m \cos(\omega t) \cos(\theta)
$$

Where:
- $\mathcal{F}_m$ — peak MMF
- $\theta$ — spatial angle measured from the winding axis
- $\omega$ — angular frequency of supply

**Using trigonometric identity:**

$$
\cos A \cos B = \frac{1}{2}[\cos(A-B) + \cos(A+B)]
$$

$$
\mathcal{F}(\theta, t) = \frac{\mathcal{F}_m}{2} \cos(\omega t - \theta) + \frac{\mathcal{F}_m}{2} \cos(\omega t + \theta)
$$

**Interpretation:**

The first term $\frac{\mathcal{F}_m}{2} \cos(\omega t - \theta)$ represents a **forward rotating wave** — at any instant, its peak occurs at $\theta = \omega t$, moving in the positive $\theta$ direction.

The second term $\frac{\mathcal{F}_m}{2} \cos(\omega t + \theta)$ represents a **backward rotating wave** — its peak occurs at $\theta = -\omega t$, moving in the negative $\theta$ direction.

**Key Observation:**

At any fixed point in space ($\theta = \text{constant}$), the MMF varies sinusoidally with time:
$$
\mathcal{F}(\theta_0, t) = \mathcal{F}_m \cos(\omega t) \cos(\theta_0)
$$

This is a **pulsating** (not rotating) field — its magnitude oscillates between $+\mathcal{F}_m \cos(\theta_0)$ and $-\mathcal{F}_m \cos(\theta_0)$.

**Conclusion:**

A single-phase current in a single-phase winding produces a **pulsating magnetic field** that:
- Varies sinusoidally with time at any fixed point
- Has a stationary axis (along the winding axis)
- Can be decomposed into two counter-rotating fields of equal magnitude
- Cannot produce a rotating magnetic field by itself

---

## Numerical Problems

### N1. A single-phase induction motor has a main winding impedance of $Z_m = 4 + j6\ \Omega$ and an auxiliary winding impedance of $Z_a = 8 + j4\ \Omega$ at standstill. A capacitor of $100\ \mu\text{F}$ is connected in series with the auxiliary winding. The supply is 230 V, 50 Hz. Calculate:
(i) The phase angle between main and auxiliary winding currents at starting
(ii) The starting torque in terms of the torque produced by the forward field alone

**Solution:**

**Step 1: Calculate impedances**

Main winding impedance:
$$
Z_m = 4 + j6 = \sqrt{4^2 + 6^2} \angle \tan^{-1}(6/4) = 7.21 \angle 56.31^\circ\ \Omega
$$

Capacitive reactance:
$$
X_C = \frac{1}{2\pi f C} = \frac{1}{2\pi \times 50 \times 100 \times 10^{-6}} = 31.83\ \Omega
$$

Auxiliary winding impedance with capacitor:
$$
Z_a = 8 + j4 - j31.83 = 8 - j27.83\ \Omega
$$
$$
|Z_a| = \sqrt{8^2 + 27.83^2} = 28.96\ \Omega
$$
$$
\phi_a = \tan^{-1}\left(\frac{-27.83}{8}\right) = -73.96^\circ
$$

**Step 2: Calculate currents**

Main winding current:
$$
I_m = \frac{230}{7.21} = 31.90\ \text{A}
$$
Phase angle: $\phi_m = -56.31^\circ$ (lagging)

Auxiliary winding current:
$$
I_a = \frac{230}{28.96} = 7.94\ \text{A}
$$
Phase angle: $\phi_a = +73.96^\circ$ (leading, since negative impedance angle means capacitive)

**Step 3: Phase difference**

$$
\phi = \phi_m - \phi_a = (-56.31^\circ) - (+73.96^\circ) = -130.27^\circ
$$

The magnitude of phase difference:
$$
|\phi| = 130.27^\circ
$$

**Step 4: Starting torque**

The starting torque is proportional to:
$$
T_{start} \propto I_m I_a \sin(\phi)
$$
$$
T_{start} \propto 31.90 \times 7.94 \times \sin(130.27^\circ)
$$
$$
T_{start} \propto 31.90 \times 7.94 \times 0.763 = 193.2\ \text{(per unit)}
$$

The torque from forward field alone (if $90^\circ$ phase shift):
$$
T_{f,max} \propto I_m I_a \times 1 = 31.90 \times 7.94 = 253.3\ \text{(per unit)}
$$

Ratio:
$$
\frac{T_{start}}{T_{f,max}} = \frac{193.2}{253.3} = 0.763
$$

**Answer:**
(i) Phase angle between currents: $\boxed{130.27^\circ}$
(ii) Starting torque is $\boxed{76.3\%}$ of the maximum possible torque from forward field alone

---

### N2. A 230 V, 50 Hz, single-phase induction motor has the following parameters at standstill:
- Main winding: $R_m = 3\ \Omega$, $X_m = 5\ \Omega$
- Auxiliary winding: $R_a = 6\ \Omega$, $X_a = 3\ \Omega$

A capacitor is to be connected in series with the auxiliary winding to produce a $90^\circ$ phase shift between the two winding currents at starting. Determine:
(i) The required capacitance
(ii) The current in each winding
(iii) The starting torque in N-m if the motor constant $K = 0.5\ \text{N-m/A}^2$

**Solution:**

**Step 1: Condition for $90^\circ$ phase shift**

For $90^\circ$ phase shift:
$$
\phi_m - \phi_a = 90^\circ
$$

Main winding impedance angle:
$$
\phi_m = \tan^{-1}\left(\frac{X_m}{R_m}\right) = \tan^{-1}\left(\frac{5}{3}\right) = 59.04^\circ
$$

Therefore:
$$
\phi_a = \phi_m - 90^\circ = 59.04^\circ - 90^\circ = -30.96^\circ
$$

**Step 2: Calculate required capacitive reactance**

Auxiliary winding impedance with capacitor:
$$
Z_a = R_a + j(X_a - X_C)
$$
$$
\phi_a = \tan^{-1}\left(\frac{X_a - X_C}{R_a}\right) = -30.96^\circ
$$
$$
\tan(-30.96^\circ) = \frac{X_a - X_C}{R_a}
$$
$$
-0.6 = \frac{3 - X_C}{6}
$$
$$
-3.6 = 3 - X_C
$$
$$
X_C = 6.6\ \Omega
$$

**Step 3: Calculate capacitance**

$$
C = \frac{1}{2\pi f X_C} = \frac{1}{2\pi \times 50 \times 6.6} = 482.3\ \mu\text{F}
$$

**Step 4: Calculate currents**

Main winding current:
$$
I_m = \frac{230}{\sqrt{3^2 + 5^2}} = \frac{230}{5.83} = 39.45\ \text{A}
$$

Auxiliary winding impedance with capacitor:
$$
Z_a = 6 + j(3 - 6.6) = 6 - j3.6 = \sqrt{6^2 + 3.6^2} = 7.0\ \Omega
$$
$$
I_a = \frac{230}{7.0} = 32.86\ \text{A}
$$

**Step 5: Starting torque**

$$
T_{start} = K \cdot I_m \cdot I_a \cdot \sin(90^\circ)
$$
$$
T_{start} = 0.5 \times 39.45 \times 32.86 \times 1
$$
$$
T_{start} = 648.2\ \text{N-m}
$$

**Answer:**
(i) Required capacitance: $\boxed{482.3\ \mu\text{F}}$
(ii) Main winding current: $\boxed{39.45\ \text{A}}$, Auxiliary winding current: $\boxed{32.86\ \text{A}}$
(iii) Starting torque: $\boxed{648.2\ \text{N-m}}$

---

### N3. A ¼ HP, 230 V, 50 Hz, single-phase induction motor has a full-load slip of 5%. The motor parameters referred to stator are:
- $R_1 = 4\ \Omega$, $X_1 = 5\ \Omega$
- $R_2' = 6\ \Omega$, $X_2' = 5\ \Omega$
- $X_m = 100\ \Omega$

Using the double revolving field theory, calculate the forward and backward torques at full load. Neglect core losses.

**Solution:**

**Step 1: Calculate synchronous speed**

For a 4-pole motor (typical for ¼ HP):
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500\ \text{rpm}
$$

**Step 2: Calculate slips**

Forward slip:
$$
s_f = s = 0.05
$$

Backward slip:
$$
s_b = 2 - s = 2 - 0.05 = 1.95
$$

**Step 3: Calculate forward impedance**

Forward rotor impedance referred to stator:
$$
Z_{2f}' = \frac{R_2'}{s_f} + jX_2' = \frac{6}{0.05} + j5 = 120 + j5\ \Omega
$$

Forward impedance of magnetizing branch in parallel:
$$
Z_{mf} = jX_m = j100\ \Omega
$$

Forward equivalent impedance:
$$
Z_{eqf} = \frac{Z_{2f}' \times Z_{mf}}{Z_{2f}' + Z_{mf}} = \frac{(120 + j5)(j100)}{120 + j5 + j100}
$$
$$
= \frac{(120 + j5)(j100)}{120 + j105}
$$
$$
= \frac{-500 + j12000}{120 + j105}
$$

Converting to polar:
Numerator: $|-500 + j12000| = \sqrt{500^2 + 12000^2} = 12010.4$, $\angle = \tan^{-1}(12000/-500) = 92.39^\circ$
Denominator: $|120 + j105| = \sqrt{120^2 + 105^2} = 159.4$, $\angle = \tan^{-1}(105/120) = 41.19^\circ$

$$
Z_{eqf} = \frac{12010.4 \angle 92.39^\circ}{159.4 \angle 41.19^\circ} = 75.35 \angle 51.20^\circ\ \Omega
$$

**Step 4: Calculate backward impedance**

Backward rotor impedance referred to stator:
$$
Z_{2b}' = \frac{R_2'}{s_b} + jX_2' = \frac{6}{1.95} + j5 = 3.08 + j5\ \Omega
$$

Backward equivalent impedance:
$$
Z_{eqb} = \frac{(3.08 + j5)(j100)}{3.08 + j5 + j100} = \frac{(3.08 + j5)(j100)}{3.08 + j105}
$$

Numerator: $(3.08 + j5)(j100) = -500 + j308$
$|-500 + j308| = \sqrt{500^2 + 308^2} = 587.5$, $\angle = \tan^{-1}(308/-500) = 148.37^\circ$

Denominator: $|3.08 + j105| = \sqrt{3.08^2 + 105^2} = 105.05$, $\angle = \tan^{-1}(105/3.08) = 88.32^\circ$

$$
Z_{eqb} = \frac{587.5 \angle 148.37^\circ}{105.05 \angle 88.32^\circ} = 5.59 \angle 60.05^\circ\ \Omega
$$

**Step 5: Calculate total impedance and current**

Total impedance:
$$
Z_{total} = R_1 + jX_1 + Z_{eqf} + Z_{eqb}
$$
$$
= 4 + j5 + 75.35 \angle 51.20^\circ + 5.59 \angle 60.05^\circ
$$
$$
= 4 + j5 + (47.22 + j58.72) + (2.79 + j4.84)
$$
$$
= 54.01 + j68.56 = 87.24 \angle 51.78^\circ\ \Omega
$$

Stator current:
$$
I_1 = \frac{230}{87.24} = 2.64\ \text{A}
$$

**Step 6: Calculate torques**

Forward torque:
$$
T_f = \frac{I_1^2 R_{2f}'}{s_f \omega_s} = \frac{2.64^2 \times 120}{0.05 \times 2\pi \times 1500/60} = \frac{836.35}{7.854} = 106.5\ \text{N-m}
$$

Backward torque:
$$
T_b = \frac{I_1^2 R_{2b}'}{s_b \omega_s} = \frac{2.64^2 \times 3.08}{1.95 \times 7.854} = \frac{21.46}{15.32} = 1.4\ \text{N-m}
$$

**Answer:**
Forward torque: $\boxed{106.5\ \text{N-m}}$
Backward torque: $\boxed{1.4\ \text{N-m}}$
Net torque: $\boxed{105.1\ \text{N-m}}$

---

### N4. A capacitor-start single-phase induction motor takes 5 A at 0.6 power factor lagging from a 230 V, 50 Hz supply at starting. The auxiliary winding current is 3 A at 0.8 power factor leading. Calculate:
(i) The total starting current and its power factor
(ii) The phase angle between main and auxiliary winding currents

**Solution:**

**Step 1: Express currents as phasors**

Take supply voltage as reference: $\bar{V} = 230 \angle 0^\circ\ \text{V}$

Main winding current:
$$
\bar{I}_m = 5 \angle -\cos^{-1}(0.6) = 5 \angle -53.13^\circ\ \text{A}
$$

Auxiliary winding current:
$$
\bar{I}_a = 3 \angle +\cos^{-1}(0.8) = 3 \angle +36.87^\circ\ \text{A}
$$

**Step 2: Calculate total starting current**

$$
\bar{I}_{total} = \bar{I}_m + \bar{I}_a = 5 \angle -53.13^\circ + 3 \angle +36.87^\circ
$$

Converting to rectangular:
$$
\bar{I}_m = 5(\cos 53.13^\circ - j\sin 53.13^\circ) = 5(0.6 - j0.8) = 3 - j4\ \text{A}
$$
$$
\bar{I}_a = 3(\cos 36.87^\circ + j\sin 36.87^\circ) = 3(0.8 + j0.6) = 2.4 + j1.8\ \text{A}
$$
$$
\bar{I}_{total} = (3 + 2.4) + j(-4 + 1.8) = 5.4 - j2.2\ \text{A}
$$

Magnitude:
$$
|\bar{I}_{total}| = \sqrt{5.4^2 + 2.2^2} = \sqrt{29.16 + 4.84} = \sqrt{34} = 5.83\ \text{A}
$$

Power factor angle:
$$
\phi = \tan^{-1}\left(\frac{-2.2}{5.4}\right) = -22.18^\circ
$$

Power factor:
$$
\cos\phi = \cos(22.18^\circ) = 0.926\ \text{(lagging)}
$$

**Step 3: Phase angle between winding currents**

$$
\phi_{ma} = \phi_m - \phi_a = (-53.13^\circ) - (+36.87^\circ) = -90^\circ
$$

**Answer:**
(i) Total starting current: $\boxed{5.83\ \text{A}}$ at $\boxed{0.926}$ power factor lagging
(ii) Phase angle between currents: $\boxed{90^\circ}$

---

## Quick Quiz

### Q1. Why does a single-phase induction motor not self-start?

**Answer:** According to the double field revolving theory, the pulsating field produced by a single stator winding can be resolved into two counter-rotating fields of equal magnitude. At standstill, both fields induce equal torques in opposite directions, resulting in **zero net starting torque**.

---

### Q2. What is the function of the capacitor in a capacitor-start induction motor?

**Answer:** The capacitor creates a **phase difference** of approximately $90^\circ$ between the main winding current and the auxiliary winding current. This produces a **rotating magnetic field** that provides starting torque. The capacitor is disconnected by a centrifugal switch once the motor reaches about 75-80% of synchronous speed.

---

### Q3. What is the typical phase difference required between main and auxiliary winding currents for maximum starting torque?

**Answer:** A phase difference of **$90^\circ$ electrical degrees** produces the maximum starting torque, as the starting torque is proportional to $I_m I_a \sin(\phi)$, where $\phi$ is the phase angle between the two currents.

---

### Q4. What happens to the backward rotating field when the motor is running at full load?

**Answer:** At full load, the forward slip $s_f$ is small (3-5%), so the forward field produces large torque. The backward slip $s_b = 2 - s_f \approx 1.95$ is close to 2, so the backward field produces very **small braking torque**. The net torque is positive and sufficient to drive the load.

---

### Q5. Name three methods used to start single-phase induction motors.

**Answer:**
1. **Split-phase starting** — uses a resistive auxiliary winding with higher resistance
2. **Capacitor-start** — uses a capacitor in series with the auxiliary winding
3. **Shaded-pole starting** — uses a short-circuited copper ring on a portion of each pole