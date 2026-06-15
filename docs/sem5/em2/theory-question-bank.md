---
title: EM-II Theory Question Bank
description: Theory-only Electrical Machines II questions with exam-ready explanations, formulas, phasor diagrams, and circuit diagrams.
---

# Electrical Machines II Theory Question Bank

This bank contains only theory and explanation questions. Numerical problem-solving questions are intentionally excluded.

**Total theory questions:** 48

---

## AC windings and generated EMF

### Theory Question 1

**Question:** Explain integral-slot and fractional-slot windings. State where each is preferred.

**Tags:** integral-slot winding, fractional-slot winding, slots per pole per phase, AC winding

In AC machine windings, the number of slots per pole per phase, denoted by $q$, is a key parameter. It is defined as

$$
\begin{aligned}
q = \frac{S}{2P m}
\end{aligned}
$$

where $S$ is total number of stator slots, $P$ is number of poles, and $m$ is number of phases. Depending on $q$, windings are classified as:

1. **Integral-slot winding**: Here $q$ is an integer. All phase belts under adjacent poles are identical and symmetrical. This yields balanced phase voltages, uniform magnetic loading, and simpler coil design. Since each phase repeats identically under every pole, the generated EMFs are exactly $120^\circ$ apart for a 3-phase machine, producing a purely sinusoidal resultant.

2. **Fractional-slot winding**: In this case $q$ is a fraction, written as $q = a + (b/c)$ with $b/c$ a proper fraction in lowest terms. The number of slots per pole per phase is not uniform; the winding pattern repeats every $c$ poles. This inherent irregularity acts like an additional distribution of coils, which significantly reduces certain space harmonics in the air-gap flux waveform and the resulting EMF. Fractional-slot windings may produce unbalanced phase voltages if not carefully designed, and they can introduce sub-harmonics.

**Applications**:
- Integral-slot windings are preferred in high-speed turbo-alternators (2- or 4-pole machines) because they provide perfect electrical and mechanical symmetry, essential for high-speed balance and robust rotor construction.
- Fractional-slot windings are widely used in low-speed, large-diameter hydro-generators. With many poles, an integral-slot design would require an impractical number of slots. Fractional-slot layouts allow a reasonable slot count while simultaneously reducing harmonic content and cogging torque.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 2

**Question:** Derive the distribution factor and pitch factor for an AC winding and explain their physical meaning.

**Tags:** distribution factor, pitch factor, winding factor, short-pitching, AC winding

**Distribution factor ($K_d$)**

In a distributed winding, the coils of one phase are placed in $q$ adjacent slots under each pole. The EMFs induced in these $q$ coils are equal in magnitude but displaced from each other by the slot angle $\alpha$ (electrical). The phasor sum of these $q$ EMFs is the chord of a circle subtending an angle $q\alpha$ at the centre, while the arithmetic sum is $q$ times the chord of a single coil. From the geometry of a regular polygon,

$$
\begin{aligned}
K_d = \frac{\text{Vector sum}}{\text{Arithmetic sum}} = \frac{2R \sin(q\alpha/2)}{q \cdot 2R \sin(\alpha/2)} = \frac{\sin(q\alpha/2)}{q\,\sin(\alpha/2)}.
\end{aligned}
$$

$K_d$ is always less than 1. Physically it represents the reduction in the resultant EMF because the individual coil EMFs are not in phase. The more slots per pole per phase (larger $q$), the smaller the phase spread and the larger the voltage reduction, but the waveform becomes more sinusoidal.

**Pitch factor ($K_p$)**

When a coil has a span shorter than the full pole pitch ($180^\circ$ electrical), the two coil sides lie in different magnetic positions. If the coil is short-pitched by an angle $\beta$ (electrical), the EMFs in the two sides are separated by $(180^\circ - \beta)$. Adding these two phasors of equal magnitude $E_c$ gives a resultant:

$$
\begin{aligned}
E_{\text{coil}} = 2E_c \cos\frac{\beta}{2}.
\end{aligned}
$$

Had the coil been full-pitched, the resultant would be $2E_c$. Hence the pitch factor is

$$
\begin{aligned}
K_p = \frac{2E_c \cos(\beta/2)}{2E_c} = \cos\frac{\beta}{2}.
\end{aligned}
$$

For a full-pitch coil, $\beta=0$ and $K_p=1$; for a short-pitched coil, $K_p<1$. Physically $K_p$ measures the reduction in coil EMF due to the spatial separation of the coil sides not being exactly $180^\circ$. Together, the winding factor $K_w = K_d K_p$ quantifies the net reduction from an ideal concentrated full-pitch winding.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 3

**Question:** Explain how harmonics are reduced in AC machine windings using short-pitching and distributed windings.

**Tags:** harmonics reduction, short-pitching, distributed winding, winding factor

In practical AC machines, the air-gap flux distribution is never perfectly sinusoidal; it contains odd harmonics (3rd, 5th, 7th, ...) that distort the induced EMF. Winding design offers two powerful knobs to suppress these harmonic voltages.

**1. Reduction by distributed windings**

For a harmonic of order $n$, the effective slot angle becomes $n\alpha$. The distribution factor for the $n$-th harmonic is

$$
\begin{aligned}
K_{dn} = \frac{\sin(n q \alpha/2)}{q \sin(n \alpha/2)}.
\end{aligned}
$$

For the fundamental ($n=1$), $K_{d1}$ is close to 1. For higher-order harmonics, $n\alpha$ is larger, and the numerator oscillates while the denominator grows; consequently $K_{dn}$ drops sharply. In other words, distributing the coils over several slots phase-mixes the harmonic EMFs, causing partial cancellation and a much smaller resultant. The more slots per pole per phase (higher $q$), the greater the attenuation of harmonics.

**2. Reduction by short-pitching (chorded coils)**

The pitch factor for the $n$-th harmonic is

$$
\begin{aligned}
K_{pn} = \cos\left(n\frac{\beta}{2}\right).
\end{aligned}
$$

By choosing the chording angle $\beta$ appropriately, a particular harmonic can be completely eliminated. Setting $K_{pn}=0$ gives $n\beta/2 = 90^\circ$, i.e. $\beta = 180^\circ/n$. For example, to eliminate the 5th harmonic, use a coil span short-pitched by $\beta = 36^\circ$ (coil span $144^\circ$ electrical). Similarly, a short-pitch of $\beta = 25.7^\circ$ kills the 7th harmonic. In practice a coil pitch of $5/6$ ($150^\circ$ electrical, $\beta=30^\circ$) significantly reduces both 5th and 7th harmonics.

When both distributed and short-pitched windings are employed together, the total winding factor $K_{wn} = K_{dn} K_{pn}$ for harmonics becomes very small, yielding a nearly sinusoidal EMF waveform. This harmonic mitigation reduces stray losses, noise, and interference without altering the fundamental voltage excessively.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 4

**Question:** Explain the EMF equation of a three-phase alternator and the role of winding factor.

**Tags:** EMF equation, alternator, winding factor, distribution factor, pitch factor

The EMF induced in a three-phase alternator depends on the flux per pole, frequency, number of turns, and the winding arrangement.

**Derivation of the EMF equation**

Consider a simple two-layer winding with $T$ turns per phase. Under each pole, a conductor cuts the flux $\Phi$ per pole. In one revolution, a conductor cuts $P\Phi$ lines of flux. If the rotor speed is $N$ rpm, the time for one revolution is $60/N$ seconds. Hence the average EMF per conductor is

$$
\begin{aligned}
E_{\text{avg/cond}} = \frac{P\Phi}{60/N} = \frac{P\Phi N}{60}.
\end{aligned}
$$

But the electrical frequency is $f = \frac{PN}{120}$, so $PN = 120f$. Substituting,

$$
\begin{aligned}
E_{\text{avg/cond}} = \frac{120f\Phi}{60} = 2f\Phi \text{ volts}.
\end{aligned}
$$

For a coil of one turn (two conductors), the average EMF is $4f\Phi$. For $T$ turns per phase, the average phase EMF becomes $E_{\text{avg}} = 4f\Phi T$.

Assuming a sinusoidal flux distribution, the RMS value is the form factor $1.11$ times the average:

$$
\begin{aligned}
E_{\text{RMS}} = 1.11 \times 4f\Phi T = 4.44\, f\Phi T \text{ volts}.
\end{aligned}
$$

This equation holds for a concentrated full-pitch winding. In practice, windings are distributed and often short-pitched, so the induced EMF is reduced by the winding factor $K_w = K_d K_p$. Thus the general EMF equation is

$$
\begin{aligned}
E_{\text{phase}} = 4.44\, f\Phi T K_w.
\end{aligned}
$$

**Role of the winding factor**

The winding factor $K_w$ plays three important roles:
1. **Voltage adjustment** - It accounts for the reduction in the resultant EMF due to spatial distribution of coils ($K_d$) and coil-span chording ($K_p$). Without it, the calculated voltage would be too high.
2. **Harmonic filtering** - As shown earlier, $K_{wn}$ for harmonics is much smaller than for the fundamental, thus the winding factor helps suppress undesirable harmonic voltages.
3. **Design flexibility** - By choosing appropriate values of $q$ and coil pitch, the designer can tailor the winding factor to achieve a desired voltage level and waveform quality.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Rotating magnetic field and induction motor fundamentals

### Theory Question 5

**Question:** Explain how a balanced three-phase stator winding produces a rotating magnetic field.

**Tags:** rotating magnetic field, three-phase winding, mmf, synchronous speed

A balanced three-phase stator winding produces a rotating magnetic field (RMF) when fed from a balanced three-phase supply. The stator has three identical windings placed 120° electrical apart in space around the air gap. These windings carry currents that are 120° apart in time phase.

At any instant, each phase current sets up a pulsating magnetic field whose magnitude varies with time but whose axis is fixed in space (along the phase axis). The key insight is that the superposition of these three stationary pulsating fields results in a resultant field of constant magnitude that rotates at a uniform speed.

Mathematically, the three-phase currents are:
$$
\begin{aligned}
i_a &= I_m \cos(\omega t) \\
i_b &= I_m \cos(\omega t - 120^\circ) \\
i_c &= I_m \cos(\omega t - 240^\circ)
\end{aligned}
$$

Each current produces an MMF wave in the air gap. For a sinusoidally distributed winding, the fundamental component of MMF for phase a along the angular position $\theta$ (measured from the axis of phase a) is $F_a = F_m \cos(\omega t) \cos(\theta)$. Similarly, phases b and c produce $F_b = F_m \cos(\omega t - 120^\circ) \cos(\theta - 120^\circ)$ and $F_c = F_m \cos(\omega t - 240^\circ) \cos(\theta - 240^\circ)$.

Using trigonometric identities and summing, the resultant MMF is:
$$
F_R = F_a + F_b + F_c = \frac{3}{2} F_m \cos(\omega t - \theta)
$$
This is the equation of a travelling wave: at any fixed time, it has a sinusoidal distribution in space, and the point of maximum MMF moves along the air gap as time progresses. The wave rotates at an angular speed $\omega$ electrical radians per second. For a P-pole machine, the mechanical speed in revolutions per minute is:
$$
N_s = \frac{120 f}{P}
$$
called the synchronous speed.

Thus, the balanced three-phase stator winding converts a set of pulsating fields into a single constant-amplitude rotating field. The direction of rotation can be reversed by interchanging any two supply leads, which reverses the phase sequence.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 6

**Question:** Explain slip, rotor frequency, and why an induction motor cannot run at synchronous speed.

**Tags:** slip, rotor frequency, synchronous speed, induction motor torque

Slip ($s$) is a fundamental parameter that quantifies the relative motion between the rotating magnetic field (produced by the stator) and the rotor. It is defined as:
$$
s = \frac{N_s - N_r}{N_s}
$$
where $N_s$ is the synchronous speed (rpm) and $N_r$ is the actual rotor speed. Slip is often expressed as a percentage.

Because the rotor conductors are moving relative to the stator field, the frequency of the emf and current induced in the rotor, called rotor frequency $f_r$, differs from the supply frequency $f$. The relative speed between the field and rotor is $N_s - N_r = sN_s$. As induction depends on this relative speed, the rotor frequency is proportional to slip:
$$
f_r = \frac{P \cdot (sN_s)}{120} = s \cdot \frac{P N_s}{120} = s f
$$
At standstill ($N_r=0$, $s=1$), $f_r = f$; at synchronous speed ($s=0$), $f_r=0$. Under normal running, slip is small (typically 2-5%), so rotor frequency is low (1-3 Hz for 50 Hz supply), which helps keep rotor iron losses small.

An induction motor cannot run at synchronous speed for the fundamental reason that torque production relies on relative motion. If the rotor ever reached $N_s$, the stator field would be stationary relative to the rotor conductors; no emf would be induced, no rotor current would flow, and no electromagnetic torque would be developed. With no torque to overcome friction, windage, and any load, the rotor would immediately decelerate. Hence, the motor must settle at a speed where the developed torque equals the opposing load torque - this equilibrium always occurs at a slip slightly greater than zero. In motoring mode, $0 < s < 1$; in generating mode, $s < 0$ (rotor driven above $N_s$); and during plugging (reverse rotation braking), $s > 1$.

In summary, slip is both inevitable and essential; it determines rotor frequency, induced voltage, and torque, and is the key distinguishing feature of induction machines.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 7

**Question:** Compare squirrel-cage and slip-ring induction motors with practical applications.

**Tags:** squirrel-cage motor, slip-ring motor, wound rotor, starting torque, applications

**Squirrel-cage and slip-ring (wound-rotor) are the two main types of induction motor rotors. They differ in construction, performance, and applications.**

**Squirrel-cage rotor**
- *Construction*: Cylindrical laminated core with uninsulated copper or aluminium bars placed in slots, shorted at both ends by end rings. The entire cage is robust and requires no external connections.
- *Starting characteristics*: Low to moderate starting torque (1.5-2 p.u.) but high starting current (5-7 p.u.). The rotor resistance is fixed, so the starting torque cannot be adjusted without changing the cage material or deep-bar design.
- *Speed control*: Traditional speed control is difficult; the motor is essentially a constant-speed machine. Modern variable-frequency drives (VFDs) now allow efficient speed variation.
- *Maintenance*: Virtually maintenance-free; no brushes, slip rings, or external contacts.
- *Cost*: Low - simple manufacturing and minimal parts.
- *Typical applications*: Fans, blowers, pumps, compressors, conveyors, machine tools, domestic appliances - any drive that does not require high starting torque or precise speed adjustment.

**Slip-ring (wound-rotor) rotor**
- *Construction*: A three-phase distributed winding, usually star-connected, placed in the rotor slots. The three terminals are connected to slip rings on the shaft, which make contact with stationary brushes. External resistances can be inserted in series with each rotor phase via the brushes.
- *Starting characteristics*: By adding external resistance, the starting torque can be increased up to the pull-out torque while the starting current is reduced. As the motor accelerates, the resistance is gradually cut out, giving smooth acceleration.
- *Speed control*: Varying the external resistance allows limited speed control below synchronous speed, but this method incurs high rotor I²R losses and is inefficient for continuous operation.
- *Maintenance*: Higher - brushes and slip rings require periodic inspection, cleaning, and replacement; the external resistor bank adds cost and space.
- *Cost*: Higher than squirrel-cage due to additional components.
- *Typical applications*: High-starting-torque drives such as cranes, hoists, elevators, rolling mills, large compressors, and pumps that start under heavy load. In many modern installations, squirrel-cage motors with VFDs are replacing slip-ring motors, offering better efficiency and control.

In essence, the choice depends on starting duty, need for speed control, maintenance considerations, and overall cost.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 8

**Question:** Explain the induction motor power flow from stator input to shaft output.

**Tags:** power flow, equivalent circuit, air-gap power, rotor copper loss, efficiency

The power flow in a three-phase induction motor traces the conversion of electrical input into mechanical shaft output, with losses distributed along the path. The per-phase approximate equivalent circuit (Figure) is a valuable tool to visualize these stages.

![Approximate Equivalent Circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

**Step-by-step power flow:**

1. **Input Power**
   The total electrical power drawn from the three-phase supply is:
   $$
   P_{in} = \sqrt{3}\, V_L I_L \cos\phi
   $$
   where $V_L$ and $I_L$ are line quantities, and $\cos\phi$ is the input power factor.

2. **Stator Losses**
   - **Stator copper loss** ($P_{cu1}$): Due to resistance $R_1$ of the stator winding. Per phase $I_1^2 R_1$, total $P_{cu1}=3 I_1^2 R_1$.
   - **Stator core (iron) loss** ($P_{core}$): Hysteresis and eddy-current losses in the stator core, represented by $R_0$ in the magnetising branch. Total $P_{core}=3\,\frac{V_0^2}{R_0}$.

3. **Air-Gap Power ($P_{ag}$)**
   The remaining power is transferred across the air gap to the rotor by electromagnetic induction:
   $$
   P_{ag} = P_{in} - P_{cu1} - P_{core}
   $$
   In the equivalent circuit, $P_{ag}$ is the power dissipated in the rotor resistance component $\frac{R_2'}{s}$. Thus:
   $$
   P_{ag} = 3\, I_2'^2 \frac{R_2'}{s}
   $$

4. **Rotor Copper Loss ($P_{cu2}$)**
   Inside the rotor, the actual resistance is $R_2'$ (referred to stator). Therefore:
   $$
   P_{cu2} = 3\, I_2'^2 R_2' = s\, P_{ag}
   $$
   This relation shows that rotor copper loss is directly proportional to slip.

5. **Converted Mechanical Power ($P_{conv}$)**
   The remainder of the air-gap power is converted into mechanical form, developed across the fictitious resistance $\frac{1-s}{s}R_2'$:
   $$
   P_{conv} = P_{ag} - P_{cu2} = (1-s)P_{ag} = 3\, I_2'^2 \frac{1-s}{s}R_2'
   $$
   At full load, slip is small (2-5%), so most of $P_{ag}$ becomes mechanical power.

6. **Shaft Output Power ($P_{out}$)**
   Finally, mechanical losses-friction and windage ($P_{f\&w}$) and stray load losses ($P_{stray}$)-are subtracted to obtain the net mechanical output at the shaft:
   $$
   P_{out} = P_{conv} - P_{f\&w} - P_{stray}
   $$
   The motor efficiency is $\eta = \frac{P_{out}}{P_{in}}$.

This power-flow sequence highlights how slip governs both the rotor loss and the mechanical output, and why induction motors are designed to operate with a small slip at full load to achieve high efficiency.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Induction motor equivalent circuit

### Theory Question 9

**Question:** Explain the exact and approximate equivalent circuit of a three-phase induction motor.

**Tags:** equivalent circuit, exact model, approximate model, induction motor

The per-phase equivalent circuit of a three-phase induction motor resembles that of a transformer, but with a crucial difference: the rotor frequency varies with slip. Thus, the equivalent circuit is derived by referring all rotor quantities to the stator side at stator frequency.

In the exact equivalent circuit, the stator winding is represented by resistance $R_1$ and leakage reactance $X_1$. The magnetizing branch, crucial for establishing the air-gap flux, consists of a core-loss resistance $R_c$ (representing eddy-current and hysteresis losses) in parallel with a magnetizing reactance $X_m$. The rotor circuit, referred to the stator, contains resistance $R_2'$ and leakage reactance $X_2'$. However, because the rotor induced emf and frequency are $s$-dependent, the rotor branch is modified by dividing all rotor voltage terms by $s$. This yields the rotor branch parameters as $R_2'/s$ and $X_2'$, where $s$ is the slip. The exact circuit places the magnetizing branch after $R_1$ and $X_1$ (or before, depending on convention), making analysis slightly complex.

To facilitate performance calculations, the approximate equivalent circuit is widely used. In this model, the magnetizing branch is shifted to the input terminals, i.e., connected directly across the supply, thereby neglecting the small voltage drop in the stator impedance. This simplification introduces negligible error for motors above 1 kW and greatly reduces computational effort. The approximate circuit thus comprises the magnetizing branch in parallel with the series combination of $R_1 + jX_1$ and $R_2'/s + jX_2'$.

![Approximate Equivalent Circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit of a three-phase induction motor. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

The slip $s$ acts as a control variable: at no load, $s\approx0$, $R_2'/s$ becomes very large, so rotor current is negligible; at standstill ($s=1$), the rotor branch reduces to $R_2' + jX_2'$. The approximate equivalent circuit is the foundation for deriving performance characteristics such as torque, current, power factor, and efficiency of the induction motor.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 10

**Question:** Explain why the rotor resistance appears as $R_2'/s$ in the induction motor equivalent circuit.

**Tags:** rotor resistance, slip, frequency transformation, equivalent circuit

When a three-phase induction motor rotor is stationary, the rotating magnetic field cuts its conductors at synchronous speed, inducing an emf $E_2$ at supply frequency $f$. When the rotor rotates at speed $N_r$, the relative speed reduces, and the slip $s = (N_s - N_r)/N_s$ defines the per-unit reduction. Consequently, the rotor induced emf becomes $E_{2s} = s E_2$, the rotor frequency becomes $f_r = s f$, and the rotor leakage reactance becomes $X_{2s} = 2\pi f_r L_2 = s X_2$, where $X_2$ is the standstill reactance. The rotor current per phase is then given by:

$$ I_2 = \frac{E_{2s}}{\sqrt{R_2^2 + X_{2s}^2}} = \frac{s E_2}{\sqrt{R_2^2 + (s X_2)^2}}. $$

To obtain a constant-voltage equivalent circuit referred to the stator side, we divide all rotor voltage terms by $s$. This operation yields a constant standstill emf $E_2$ (or its referred value $E_2'$), and the rotor impedance transforms to $\frac{R_2}{s} + j X_2$ (or $\frac{R_2'}{s} + j X_2'$ when referred by turns ratio). Thus, in the per-phase equivalent circuit, the rotor branch contains a variable resistance $R_2'/s$ that depends on slip.

The significance of representing rotor resistance as $R_2'/s$ lies in its physical interpretability. It can be decomposed as:

$$ \frac{R_2'}{s} = R_2' + \frac{R_2'(1-s)}{s}. $$

The first term, $R_2'$, represents the actual rotor winding resistance, accounting for the $I^2 R$ loss (rotor copper loss). The second term, $\frac{R_2'(1-s)}{s}$, is a fictitious resistor that does not exist physically but mathematically accounts for the mechanical power developed by the motor. The power consumed in the total resistance $R_2'/s$ is the total power transferred across the air gap ($P_{gap}$). Of this, a fraction $s$ is dissipated as heat in the rotor conductors, and the remaining portion $(1-s)$ constitutes the mechanical output (before friction and windage). This clever manipulation allows the induction motor to be modeled as a simple static circuit.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 11

**Question:** Explain the significance of no-load and blocked-rotor tests in determining equivalent-circuit parameters.

**Tags:** no-load test, blocked-rotor test, parameter determination, induction motor testing

The per-phase equivalent circuit parameters of an induction motor are conveniently determined through two standard tests: the no-load test and the blocked-rotor test. These are analogous to transformer open-circuit and short-circuit tests.

**No-load test:** The motor is run at rated voltage and frequency without any mechanical load on the shaft. Under this condition, the slip $s$ is very close to zero, so the rotor branch current is negligible (since $R_2'/s$ is extremely large). The input current is essentially the magnetizing current, and the input power covers the core losses (eddy current and hysteresis) and friction and windage losses. Measuring the per-phase voltage $V_0$, current $I_0$, and total three-phase power $P_0$, the admittance of the magnetizing branch is $Y_0 = I_0 / V_0$. The conductance $G_0 = P_0 / (3 V_0^2)$ (or $P_0 / V_0^2$ for single-phase equivalent) gives the core-loss resistance $R_c = 1/G_0$. The susceptance $B_0 = \sqrt{Y_0^2 - G_0^2}$ yields the magnetizing reactance $X_m = 1/B_0$. Note that friction and windage losses are often subtracted from $P_0$ to isolate the core loss.

**Blocked-rotor test:** The rotor is locked so that it cannot rotate ($s=1$). A reduced voltage is applied (typically 10-20% of rated) to circulate approximately rated current in the stator windings. Since the applied voltage is low, the magnetizing current is small and the magnetizing branch can be omitted from the equivalent circuit. The circuit then becomes a simple series combination of $R_1 + R_2'$ and $X_1 + X_2'$. Measurements of line voltage $V_{sc}$, current $I_{sc}$, and three-phase power $P_{sc}$ allow computation of the series impedance:

$$ R_{eq} = \frac{P_{sc}}{3 I_{sc}^2}, \quad Z_{eq} = \frac{V_{sc}}{I_{sc}}, \quad X_{eq} = \sqrt{Z_{eq}^2 - R_{eq}^2}. $$

The stator resistance $R_1$ can be measured directly with a DC test, so $R_2' = R_{eq} - R_1$. Separating the leakage reactances $X_1$ and $X_2'$ is less definitive; empirical ratios based on motor design (e.g., $X_1 = X_2' = 0.5 X_{eq}$ for NEMA design A/B) are often used. These two tests thus provide all the parameters needed for the approximate equivalent circuit.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 12

**Question:** Explain the separation of rotor copper loss and mechanical power using the equivalent circuit.

**Tags:** power flow, air-gap power, rotor copper loss, mechanical power, equivalent circuit

In the induction motor equivalent circuit, the per-phase rotor branch is represented by a resistance $R_2'/s$. The total electrical power crossing the air gap from stator to rotor, called the air-gap power $P_{gap}$, is entirely consumed in this resistance:

$$ P_{gap} = 3 I_2'^2 \frac{R_2'}{s}, $$

where $I_2'$ is the rotor current referred to the stator. This power can be physically separated into two components: the rotor copper loss and the developed mechanical power.

Rotor copper loss, $P_{cu2}$, is the $I^2R$ loss in the actual rotor winding resistance $R_2'$:

$$ P_{cu2} = 3 I_2'^2 R_2'. $$

It follows that $P_{cu2} = s \cdot P_{gap}$. That is, the slip directly determines the fraction of air-gap power lost as heat in the rotor. The remaining power is converted to mechanical form:

$$ P_{mech} = P_{gap} - P_{cu2} = (1-s) P_{gap}. $$

This elegant separation is automatically built into the equivalent circuit through the mathematical decomposition of the rotor resistance:

$$ \frac{R_2'}{s} = R_2' + \frac{R_2'(1-s)}{s}. $$

In the equivalent circuit, the power dissipated in the physical resistance $R_2'$ corresponds to $P_{cu2}$, while the power dissipated in the fictitious resistance $\frac{R_2'(1-s)}{s}$ corresponds exactly to the developed mechanical power $P_{mech}$. Thus, although the second resistor does not exist physically, it is a convenient analytical tool to represent the electromechanical energy conversion. The total rotor input $P_{gap}$ is split accordingly. This relationship underscores the importance of minimizing slip for high efficiency: a slip of, say, 5% means that 5% of the air-gap power is lost as rotor copper loss. Moreover, the torque developed $T_{mech}$ can be expressed as $P_{mech} / \omega_r$, linking the electrical and mechanical domains. The equivalent circuit thereby provides a comprehensive framework for power flow analysis in induction motors.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Torque-slip characteristics and speed control

### Theory Question 13

**Question:** Derive the qualitative torque-slip characteristic of a three-phase induction motor.

**Tags:** torque-slip characteristic, induction motor, theory

The torque-slip characteristic of a three-phase induction motor is derived from its per-phase approximate equivalent circuit (see Figure 1). The electromagnetic torque $T_{em}$ is given by the power transferred across the air gap divided by the synchronous angular velocity $\omega_s = \frac{2\pi n_s}{60}$. Ignoring stator impedance drop and assuming a constant supply voltage $V_1$, the approximate expression is

$$
\begin{aligned}
T_{em} &= \frac{3}{\omega_s} \cdot \frac{V_1^2}{(R_1 + R_2'/s)^2 + (X_1 + X_2')^2} \cdot \frac{R_2'}{s}
\end{aligned}
$$

where $R_1$, $X_1$ are stator resistance and leakage reactance; $R_2'$, $X_2'$ are rotor resistance and leakage reactance referred to stator; and $s = \frac{n_s - n_r}{n_s}$ is the slip.

**Qualitative shape:**
- **Low-slip region ($s \ll 1$):** The term $R_2'/s$ dominates the denominator, but because it appears in both numerator and denominator, torque becomes approximately proportional to slip: $T_{em} \propto s$. This linear segment represents normal running where speed is close to synchronous speed.
- **As slip increases:** The denominator grows, torque increases until it reaches a maximum (pull-out or breakdown torque) at slip $s_{max}$.
- **High-slip region ($s \to 1$):** Terms $(X_1+X_2')$ dominate, and torque becomes inversely proportional to slip, $T_{em} \propto 1/s$. At standstill ($s=1$), we get the starting torque.
- **Synchronous speed ($s=0$):** Torque is zero because no relative motion between rotor and rotating field.

Thus the torque-slip curve rises from zero at $s=0$, peaks at $s_{max}$, and falls as slip increases further. The region from $s=0$ to $s_{max}$ is the stable operating zone; beyond $s_{max}$, operation is unstable. By varying rotor resistance (as in wound-rotor motors), the peak shifts along the slip axis, changing starting torque and speed regulation.

![Approximate Equivalent Circuit](https://www.electricaltechnology.org/wp-content/uploads/2022/03/Approximate-Equivalent-Circuit-of-Induction-Motor-768x357.png)
*Figure: Per-phase approximate equivalent circuit. Source: [Electrical Technology](https://www.electricaltechnology.org/2022/04/equivalent-circuit-induction-motor.html).*

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 14

**Question:** Explain the conditions for maximum torque and why maximum torque is independent of rotor resistance.

**Tags:** maximum torque, rotor resistance, induction motor, torque-slip

Maximum torque (pull-out torque) in a three-phase induction motor occurs at the slip where the power transferred to the rotor is maximum. From the approximate torque expression

$$
\begin{aligned}
T_{em} = \frac{3}{\omega_s} \cdot \frac{V_1^2}{(R_1 + R_2'/s)^2 + (X_1 + X_2')^2} \cdot \frac{R_2'}{s}
\end{aligned}
$$

differentiating with respect to $s$ and setting $\frac{dT}{ds}=0$ yields the slip at maximum torque:

$$
\begin{aligned}
s_{max} = \frac{R_2'}{\sqrt{R_1^2 + (X_1 + X_2')^2}}
\end{aligned}
$$

Often, stator resistance $R_1$ is much smaller than leakage reactance, so $s_{max} \approx \frac{R_2'}{X_1 + X_2'}$. Substituting $s_{max}$ back into the torque equation gives the maximum torque value:

$$
\begin{aligned}
T_{max} = \frac{3}{2\omega_s} \cdot \frac{V_1^2}{R_1 + \sqrt{R_1^2 + (X_1 + X_2')^2}}
\end{aligned}
$$

or approximately $T_{max} \approx \frac{3}{2\omega_s} \cdot \frac{V_1^2}{X_1 + X_2'}$ when $R_1$ is negligible.

**Independence from rotor resistance:** Notice that $R_2'$ does **not** appear in $T_{max}$. Physically, this is because at the peak torque point, the rotor circuit impedance matches the motor's internal impedance such that the product of rotor current and air-gap flux (which determines torque) is maximized. Changing $R_2'$ merely alters the slip at which this matching occurs: a higher rotor resistance pushes $s_{max}$ to larger values (even to $s=1$ for starting), but the magnitude of $T_{max}$ remains unchanged as long as the supply voltage and frequency are constant. The rotor resistance term cancels out mathematically because it appears equally in the numerator and denominator of the torque expression when evaluated at the condition $\frac{R_2'}{s} = \sqrt{R_1^2 + (X_1 + X_2')^2}$. This is a key design insight: we can tailor starting torque and speed regulation without affecting the motor's overload capacity, simply by changing rotor resistance (e.g., via external resistors in a slip-ring motor).

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 15

**Question:** Explain rotor resistance control and why it is mainly used with slip-ring induction motors.

**Tags:** rotor resistance control, slip-ring motor, speed control, induction motor

Rotor resistance control is a method of speed control for three-phase induction motors where an external variable resistance is connected in series with the rotor circuit. By adjusting this resistance, the effective rotor resistance $R_2'$ is changed, which alters the slip at which a given torque is developed. From the torque-slip characteristic, increasing rotor resistance shifts the maximum torque point to higher slip without affecting the magnitude of the maximum torque. Consequently, for a fixed load torque, the motor runs at a lower speed (higher slip).

**Why mainly with slip-ring induction motors?**
Slip-ring (wound-rotor) induction motors are designed with a three-phase rotor winding brought out to slip rings and brushes. This construction allows easy connection of external resistors to each phase of the rotor circuit. In contrast, squirrel-cage induction motors have their rotor conductors permanently short-circuited within the rotor core; there is no practical way to insert external resistance. Therefore, rotor resistance control is inherently a feature of slip-ring machines.

**Implementation and characteristics:**
- The external resistors are typically variable and may be stepped or continuously adjustable. During starting, they can provide high starting torque with limited current.
- Speed control is achieved by adjusting the resistance; the slip increases, and the motor speed reduces from its synchronous value. The range of control is limited-usually down to about 50% of synchronous speed-because excessive slip leads to high rotor losses and poor efficiency.
- The power dissipated in the external resistors ($P_{rotor} = s P_{ag}$) is wasted as heat, making this method inherently inefficient for continuous low-speed operation.
- Despite the losses, it is valued for its simplicity, smooth control, and ability to develop high torque at low speeds.

**Applications:** Often used in cranes, hoists, elevators, and pumps where intermittent speed reduction or soft starting is required and efficiency is less critical. Today, electronic variable-frequency drives have largely supplanted rotor resistance control, but it remains a classic and instructive method.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 16

**Question:** Explain plugging, regenerative braking, and dynamic braking of induction motors.

**Tags:** electric braking, plugging, regenerative braking, dynamic braking, induction motor

Electric braking of induction motors involves operating the machine so that it develops a torque opposing rotation, thus converting kinetic energy into electrical energy or heat. The three principal methods are plugging, regenerative braking, and dynamic braking.

**1. Plugging (reverse-voltage braking)**
Plugging is achieved by interchanging any two stator leads while the motor is running. This reverses the phase sequence and hence the direction of the rotating magnetic field. The slip becomes greater than 1 ($s > 1$), producing a braking torque. The rotor now attempts to rotate opposite to the field, but due to mechanical inertia, it decelerates rapidly.
- **Key features:** Very rapid deceleration; large currents and high slip losses occur because the rotor-induced EMF and frequency are roughly double the normal value. A centrifugal switch or zero-speed relay must disconnect power when speed reaches zero to prevent reversal.
- **Use:** Emergency stops, quick reversal.

**2. Regenerative braking**
This occurs when the rotor speed exceeds synchronous speed ($n_r > n_s$, $s < 0$). The machine then operates as an induction generator, converting mechanical energy into electrical energy and feeding it back to the supply. The torque becomes negative (braking). Regenerative braking happens naturally when an overhauling load drives the motor above synchronous speed, or in controlled applications using variable-frequency drives where the supply frequency is reduced faster than the motor decelerates.
- **Key features:** Energy recovery (efficient); requires a receptive power source; braking torque vanishes as speed falls to synchronous speed, so it cannot hold a load stationary.
- **Use:** Cranes, elevators, electric vehicles.

**3. Dynamic braking (DC injection braking)**
The stator is disconnected from the AC supply and a DC current is injected into two of its phases. This establishes a stationary magnetic field in the air gap. As the rotor spins, it cuts this stationary field, inducing AC currents in the rotor bars. The interaction of these currents with the stationary field produces a braking torque that is proportional to the product of the DC excitation flux and the rotor current (hence to speed). The kinetic energy is dissipated as $I^2R$ losses in the rotor circuit.
- **Key features:** Smooth, controlled braking; no reverse torque; can hold motor at standstill with reduced DC; poor braking at low speeds because induced rotor EMF diminishes.
- **Use:** Machine tools, conveyor stop, where gradual deceleration is required.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Circle diagram and performance tests

### Theory Question 17

**Question:** Explain the construction and use of the induction motor circle diagram.

**Tags:** circle diagram, induction motor, performance, graphical method

The circle diagram is a graphical representation derived from the equivalent circuit of an induction motor. It plots the locus of the stator current phasor as the slip varies from zero to unity. The diagram is constructed on a complex plane where the voltage phasor is taken along the orthogonal axis. The no-load current $I_0$ lags the voltage by an angle $\phi_0$, and the blocked-rotor current $I_{br}$ (at rated voltage) lags by $\phi_{br}$. These two points define the circle. The line joining $I_0$ and $I_{br}$ is the chord, and the perpendicular bisector of this chord intersects the horizontal axis at the center of the circle. The circle passes through both points. The diagram also includes lines representing output power, torque, and input power.

The use of the circle diagram is to determine motor performance characteristics-such as efficiency, power factor, slip, torque, and output power-for any load condition without performing actual load tests. By drawing a current phasor to the operating point on the circle, vertical distances to the output and torque lines give proportional measures of output and torque. The diagram also helps in finding maximum torque and maximum output conditions by drawing tangents parallel to the respective lines. It serves as an educational tool and a quick performance estimation method when computational resources are limited. Despite its approximations, it clearly illustrates how motor parameters change with slip. The circle diagram is typically drawn to scale, so that distances can be measured and converted to power by a suitable scale factor.

![Parts of a Circle Diagram of Induction Motor](https://www.electrical4u.com/wp-content/uploads/parts-of-a-circle-diagram.png)
*Figure: Circle diagram of a three-phase induction motor, indicating output line, torque line, and slip. Source: [Electrical4U](https://www.electrical4u.com/circle-diagram/).*

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 18

**Question:** Explain how no-load and blocked-rotor test data are used to draw the circle diagram.

**Tags:** no-load test, blocked-rotor test, circle diagram, induction motor, parameter estimation

The no-load test and blocked-rotor test provide essential data to plot the circle diagram. In the no-load test, the motor runs at rated voltage and frequency without any mechanical load. The input power $P_0$, current $I_0$, and voltage $V_0$ are measured. This test determines the no-load current phasor $I_0$ and its power factor angle $\phi_0$. The no-load power factor is $\cos\phi_0 = \frac{P_0}{\sqrt{3}V_0I_0}$. At no-load, the slip is nearly zero, so the current is mainly magnetizing and represents the point where the rotor branch is practically open-circuited. The no-load losses (iron and friction) are approximately constant.

The blocked-rotor test is performed at reduced voltage with the rotor locked, measuring $V_{br}$, $I_{br}$, and $P_{br}$. From these, the blocked-rotor power factor $\cos\phi_{br} = \frac{P_{br}}{\sqrt{3}V_{br}I_{br}}$ and the equivalent impedance $Z_{br} = \frac{V_{br}}{\sqrt{3}I_{br}}$ are found. The blocked-rotor data at the test voltage is then corrected to rated voltage by assuming linearity (or using a known relation) to obtain the short-circuit current $I_{SC}$ at rated voltage. The corresponding phasor $I_{SC}$ gives the second point on the circle.

To draw the circle:
1. Choose a suitable scale for current (e.g., 1 cm = 5 A).
2. Draw the voltage phasor along the vertical axis (or horizontal, depending on convention).
3. Draw $I_0$ lagging voltage by $\phi_0$.
4. Draw $I_{SC}$ lagging voltage by $\phi_{br}$.
5. Join the tips of $I_0$ and $I_{SC}$ (chord). Find the center by drawing the perpendicular bisector; its intersection with the horizontal line through $I_0$ (or a line parallel to voltage) gives the center. The circle passes through $I_0$ and $I_{SC}$.
6. Draw the output line (from $I_0$ tip to a point on the chord determined by stator resistance) and torque line (horizontal through $I_0$ tip or parallel to something). The exact construction involves separating stator and rotor losses.

From these points, the complete circle is drawn, and performance can be read for any slip.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 19

**Question:** Explain how maximum output, maximum torque, slip, power factor, and efficiency are read from the circle diagram.

**Tags:** maximum output, maximum torque, slip, power factor, efficiency

From the circle diagram, various performance quantities are obtained for any operating point $P$ on the circle. The stator current phasor $\vec{OP}$ represents the current at a given slip. The vertical distance (perpendicular) to the output line $O'B$ gives the output power on a chosen scale. Similarly, the vertical distance to the torque line gives the developed torque. The input power is proportional to the horizontal projection of $P$ from the origin (or from a reference line). The power factor is $\cos\phi = \frac{\text{horizontal component of } OP}{OP}$.

To find maximum quantities:
- **Maximum output**: Draw a tangent to the circle parallel to the output line. The point of tangency $P_{m}$ gives the maximum output. The vertical distance from $P_{m}$ to the output line is the maximum output power.
- **Maximum torque**: Draw a tangent parallel to the torque line. The tangency point $P_{t}$ gives maximum torque. The vertical distance from $P_{t}$ to the torque line is the maximum torque.
- **Slip**: The slip $s$ for a given point $P$ is determined by the ratio of the distances along the output line: $s = \frac{\text{distance from } P \text{ to } O'}{\text{distance from } P \text{ to } B}$, where $O'$ is the no-load point and $B$ is the point where the output line intersects the circle at standstill. Sometimes slip is obtained by a separate slip line.
- **Power factor**: The angle $\phi$ between the voltage phasor (typically horizontal) and the current phasor $\vec{OP}$ gives $\cos\phi$ directly.
- **Efficiency**: $\eta = \frac{\text{output power}}{\text{input power}}$, which is the ratio of the vertical distance to the output line to the horizontal distance representing input. In a well-drawn diagram, these are scaled lengths.

The diagram typically includes multiple scales: a power scale (W/cm) and a torque scale (Nm/cm). By measuring lengths in cm and multiplying by the relevant scale factor, numerical values are obtained. The circle diagram thus provides a comprehensive visual method to assess motor performance without complex calculations.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 20

**Question:** State the assumptions and limitations of the circle diagram method.

**Tags:** limitations, assumptions, circle diagram, induction motor, accuracy

The circle diagram method is based on several simplifying assumptions:
1. **Constant parameters**: Stator and rotor resistances and leakage reactances are assumed constant, independent of slip and current. In reality, the rotor resistance varies due to skin effect, especially in deep-bar or double-cage rotors.
2. **Linear magnetic circuit**: Saturation effects are neglected, implying constant magnetizing reactance. At high currents, saturation reduces reactance, distorting the circle.
3. **Sinusoidal and balanced supply**: The supply voltage is assumed perfectly sinusoidal and balanced. Harmonics and unbalance cause deviations.
4. **Constant core losses**: Iron losses and mechanical losses are assumed independent of load. In practice, core loss slightly increases with load due to stator current leakage flux.
5. **Negligible stray load losses**: Additional losses due to load-dependent stray fields are not accounted for.
6. **No temperature variation**: Resistances are taken as constant, but actual winding temperatures change, affecting the rotor resistance and the circle shape.
7. **Simplified equivalent circuit**: The diagram uses the approximate equivalent circuit, often neglecting the stator impedance in the magnetizing branch, which leads to small inaccuracies.

Limitations:
- The circle diagram becomes inaccurate for machines with significant deep-bar effect or variable frequency operation.
- It cannot predict machine behavior under transient conditions or with power electronic converters.
- The construction requires precise test data and careful drawing; otherwise, errors propagate.
- Modern computational methods (finite element analysis, dynamic simulation) have largely replaced it for detailed design, but the circle diagram remains a valuable conceptual tool for understanding motor behavior.

These assumptions mean that the circle diagram provides an approximate picture; it is most accurate for standard squirrel-cage motors operating near rated conditions.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Single-phase induction motors

### Theory Question 21

**Question:** Explain why a single-phase induction motor is not self-starting using double revolving field theory.

**Tags:** double revolving field theory, starting torque, single-phase induction motor

Double revolving field theory states that a single-phase sinusoidal alternating magnetic field can be resolved into two rotating magnetic fields of equal magnitude rotating in opposite directions at synchronous speed. The pulsating field produced by a single-phase stator winding can be expressed as:

$$
\begin{aligned}
B(\theta, t) &= B_{\text{max}} \cos(\theta) \cos(\omega t) \\
&= \frac{1}{2} B_{\text{max}} [\cos(\theta - \omega t) + \cos(\theta + \omega t)]
\end{aligned}
$$

These two components represent forward and backward rotating fields. Each rotating field induces currents in the rotor conductors, producing torque. The forward rotating field tries to drive the rotor in its direction, while the backward field tries to rotate it in the opposite direction. At standstill (slip $s = 1$), the rotor is stationary relative to both fields. Thus, the induced rotor currents and the resulting torques from both fields are equal in magnitude but opposite in direction. Therefore, the net torque is zero:

$$
\begin{aligned}
T_{\text{net}} = T_f - T_b = 0
\end{aligned}
$$

This means the motor has no inherent starting torque. If the rotor is given an initial rotation in either direction by some auxiliary means, the slip with respect to the forward field decreases, increasing the forward torque. Simultaneously, the slip with respect to the backward field increases, reducing the backward torque. The net torque then becomes positive in the direction of initial rotation, and the motor accelerates to its operating speed. This explains why a single-phase induction motor is not self-starting and requires an auxiliary starting mechanism to produce a rotating magnetic field at standstill.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 22

**Question:** Explain the working of a capacitor-start single-phase induction motor.

**Tags:** capacitor-start motor, starting winding, centrifugal switch, single-phase induction motor

A capacitor-start single-phase induction motor employs a capacitor in series with the auxiliary winding to create a phase shift between the currents of the main and auxiliary windings. The stator has two windings arranged in space quadrature: a main running winding and a high-resistance auxiliary starting winding. A large electrolytic capacitor is connected in series with the auxiliary winding, and a centrifugal switch disconnects this circuit when the motor reaches about 70-80\% of synchronous speed.

![Capacitor Start Induction Motor](https://www.electricalvolt.com/wp-content/uploads/2023/02/cap1-1024x615.png)
*Figure: Circuit diagram of a capacitor-start single-phase induction motor with main and auxiliary windings, capacitor, and centrifugal switch. Source: [Electrical Volt](https://www.electricalvolt.com/capacitor-start-induction-motor/).*

During starting, the capacitor causes the current in the auxiliary winding to lead the voltage, while the main winding current lags. By proper selection of capacitance, the phase difference between the two winding currents can be made close to 90°. This produces a rotating magnetic field similar to that in a two-phase motor, generating high starting torque (typically 200-350\% of rated torque). The high starting torque makes the motor suitable for hard-to-start loads like compressors and pumps.

Once the motor accelerates to the predetermined speed, the centrifugal switch opens, disconnecting the auxiliary winding and capacitor from the supply. After disconnection, the motor runs as a standard single-phase induction motor using only the main winding. The running performance is similar to a split-phase motor, but the starting torque is much higher. However, the capacitor and starting winding are intermittent-duty rated; they cannot be left in circuit continuously without overheating.

The main advantage is excellent starting torque with relatively simple construction. The disadvantage is that the running efficiency and power factor are not improved because the capacitor is removed during running. For applications requiring both high starting torque and good running performance, a capacitor-start capacitor-run motor may be used, which retains a smaller capacitor in the auxiliary circuit during running.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 23

**Question:** Compare split-phase, capacitor-start, capacitor-run, and shaded-pole single-phase induction motors.

**Tags:** split-phase motor, capacitor-start motor, capacitor-run motor, shaded-pole motor, comparison

Comparison of Single-Phase Induction Motor Types:

- **Split-Phase Motor**: Uses a starting winding with higher resistance (thinner wire) and lower reactance than the main winding to create a small phase shift (20-30°). Starting torque is low (100-150\% of rated). Simple construction, no capacitor. Centrifugal switch disconnects start winding at speed. Used for easy-starting loads like fans, blowers.

- **Capacitor-Start Motor**: A capacitor is added in series with the start winding to achieve nearly 90° phase shift. Starting torque is high (200-350\%). Centrifugal switch disconnects start winding and capacitor at about 75\% synchronous speed. Running performance similar to split-phase. Suitable for compressors, pumps. More expensive due to capacitor and switch.

- **Capacitor-Run Motor**: The capacitor and auxiliary winding remain in circuit continuously. The capacitor is lower value (AC oil-filled) rated for continuous duty. The phase shift is less than ideal (30-50°), so starting torque is moderate (100-150\%). However, the running performance is improved: higher efficiency, power factor, and quieter operation. No centrifugal switch. Used in applications requiring low noise and good running characteristics like ceiling fans, air conditioners.

- **Capacitor-Start Capacitor-Run Motor**: Uses two capacitors: a large electrolytic for starting and a smaller oil-filled for running. The start capacitor is disconnected by a centrifugal switch. Provides high starting torque (200-350\%) and excellent running performance. Complex and costly. Used in high-torque, high-efficiency applications like large compressors, conveyors.

- **Shaded-Pole Motor**: Simplest construction; a portion of each pole is short-circuited by a copper ring (shading coil) to create a weak rotating field. Very low starting torque (50-90\%). Low efficiency and power factor. No centrifugal switch. Extremely low cost. Used in small low-power devices like table fans, record players, toys.

In summary, the choice depends on required starting torque, running efficiency, cost, and complexity. Shaded-pole motors are cheapest but least efficient; capacitor-start motors provide high starting torque; capacitor-run motors offer good running performance; and capacitor-start capacitor-run combine both.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 24

**Question:** Explain the torque-speed characteristic of a single-phase induction motor before and after starting.

**Tags:** torque-speed characteristic, double revolving field, single-phase induction motor, starting torque, pull-up torque

The torque-speed characteristic of a single-phase induction motor can be understood by considering the forward and backward rotating fields. The torque developed by each field as a function of slip is similar to that of a polyphase motor, but the slip definitions differ. For a rotor slip $s$ with respect to the forward field, the slip with respect to the backward field is $(2 - s)$. The net torque is:

$$
\begin{aligned}
T_{\text{net}} = T_f(s) - T_b(2 - s)
\end{aligned}
$$

At standstill ($s = 1$), $T_f(1) = T_b(1)$, so net torque is zero. If the motor is started by an auxiliary means and rotates in the forward direction, the slip $s$ becomes less than 1. The forward torque $T_f(s)$ increases (up to the breakdown torque), while $T_b(2-s)$ becomes small because the backward slip $(2-s)$ is larger than 1, and the rotor currents induced by the backward field are at high frequency, causing large reactance and low torque. Consequently, the net torque is positive and the motor accelerates.

As the motor approaches synchronous speed, $s \to 0$, the forward torque tends to zero, but there remains a finite backward torque at slip $\approx 2$. This backward torque produces a slight braking effect, causing the motor to run at a speed slightly less than synchronous even at no load. The no-load slip is small but not zero. The torque-speed curve thus has a dip near the starting region (sometimes called the cusp) due to the interaction of the two torque components. This dip can cause a "cogging" or reluctance torque effect if not properly designed. The maximum torque (breakdown torque) is lower than that of an equivalent polyphase motor because of the negative contribution of the backward field.

Once the auxiliary winding is disconnected (in split-phase or capacitor-start types), the running torque is produced solely by the single-phase pulsating field, which still consists of the two rotating components. However, at running speed, the backward torque is small, and the forward torque dominates, yielding a relatively stable torque-speed curve similar to a polyphase induction motor but with slightly higher rotor losses and lower efficiency due to the backward field.

Typical single-phase motor torque-speed curves show a sharp rise in torque from zero at start (with auxiliary winding) to a high value, followed by a smooth deceleration to steady-state speed. Understanding this characteristic is crucial for selecting the appropriate motor type for a given load. The motor must be able to accelerate through any torque dips to reach operating speed.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Synchronous machine construction and EMF generation

### Theory Question 25

**Question:** Explain the constructional features of cylindrical-rotor and salient-pole synchronous machines.

**Tags:** synchronous generator, rotor, stator, cylindrical, salient-pole

Synchronous machines have a stationary armature (stator) and a rotating field (rotor). The stator consists of a laminated magnetic core with slots housing a three-phase distributed winding. The rotor provides the main field flux and comes in two distinct types: cylindrical (or round) rotor and salient-pole rotor, each suited for different speeds and applications.

Cylindrical-rotor construction: The rotor is a solid steel forging with slots milled along its surface to accommodate the field winding. It has a uniform air gap, resulting in a nearly constant reluctance path and a smooth magnetic field distribution. The field winding is distributed in slots covering about two-thirds of the rotor periphery, typically made of concentric coils. The rotor is mechanically robust to withstand high centrifugal stresses, making it ideal for high-speed operation (1500 or 3000 rpm in 50 Hz systems). These machines are driven by steam or gas turbines (turbo-alternators) and are usually 2- or 4-pole. The uniform air gap minimizes windage losses and noise.

Salient-pole construction: The rotor has projecting poles bolted or dovetailed to a rotor spider or shaft. Each pole carries a concentrated field coil wound around the pole body. The air gap is non-uniform: minimum under the pole face and large between poles, causing magnetic saliency. The poles may have pole shoes with provisions for damper winding slots (copper bars short-circuited at ends). This construction is mechanically suited for low to medium speeds (e.g., 100-750 rpm) because the large number of poles (often 8-60) reduces the required rotational speed for a given frequency, as per $f = PN/120$. Salient-pole rotors are typical in hydroelectric generators and large low-speed motors.

In both types, the stator core is built up of silicon steel laminations to minimize eddy currents. The stator winding is usually a double-layer, short-pitched design to produce a near-sinusoidal EMF. The stator frame houses the core and may include cooling ducts.

In summary, the choice between cylindrical and salient-pole rotors is primarily driven by speed requirements: cylindrical rotors for high-speed turbo-alternators, and salient-pole rotors for low-speed multi-pole hydro-generators.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 26

**Question:** Explain the working principle of an alternator and how frequency is related to speed and poles.

**Tags:** alternator, faradays law, induced emf, frequency, poles

An alternator (synchronous generator) operates on Faraday's law of electromagnetic induction. A DC current in the rotor field winding produces a magnetic flux. When the rotor is driven by a prime mover, this flux rotates at synchronous speed relative to the stationary stator conductors. The rotating magnetic field cuts the stator windings, inducing an alternating EMF in each phase. The magnitude of the induced EMF depends on the flux per pole, the number of turns, and the speed of rotation.

The frequency of the generated EMF is directly tied to the mechanical speed and the number of poles. In one mechanical revolution, each north and south pole pair passes a given stator conductor, producing one complete electrical cycle. If the machine has $P$ poles (always an even number, so $P/2$ pole pairs), then the number of electrical cycles per revolution is $P/2$. If the rotor speed is $N$ revolutions per minute ($\text{rpm}$), the number of revolutions per second is $N/60$. Therefore, the frequency $f$ in hertz is:

$$
f = \frac{P}{2} \cdot \frac{N}{60} = \frac{PN}{120}
$$

This fundamental relationship governs the design of synchronous machines. For a given system frequency (e.g., 50 Hz or 60 Hz), high-speed turbines (e.g., steam turbines running at 3000 rpm for 50 Hz) require a low pole count ($P=2$). Conversely, low-speed prime movers (e.g., water turbines at 100-300 rpm) necessitate a high pole count to achieve the same frequency. The alternator's synchronous speed $N_s$ (in rpm) is thus:

$$
N_s = \frac{120f}{P}
$$

The alternator's operation is inherently synchronous: the rotor and the rotating magnetic field in the air gap rotate exactly in step. Any deviation would mean no steady EMF. In practice, the rotor field is produced by a DC exciter, and the three-phase armature winding is placed in the stator to avoid high currents at slip rings and to facilitate insulation.

In summary, an alternator converts mechanical energy into electrical energy through magnetic induction, with the output frequency rigidly locked to the prime mover speed by the number of poles, as expressed by $f = PN/120$.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 27

**Question:** Explain armature winding, field winding, slip rings, brushes, and damper winding in a synchronous machine.

**Tags:** armature winding, field winding, damper winding, slip rings, brushes

The armature winding is the main power winding, typically located on the stator. It is a three-phase distributed winding housed in slots of a laminated core. To obtain a nearly sinusoidal EMF and reduce harmonics, the winding is often double-layer, short-pitched, and distributed over several slots per pole per phase. Each phase belt spans 60° electrical. The three phases are displaced by 120° electrical, and the winding may be connected in star or delta. The armature carries the load current and is designed to handle high voltages and currents, with proper insulation and cooling.

The field winding is situated on the rotor and carries a direct current to produce the main magnetic flux. In cylindrical-rotor machines, it is distributed in slots and held by wedges; in salient-pole machines, it consists of concentrated coils around the poles. The field current, typically supplied from a separate exciter through slip rings and brushes, determines the air-gap flux and hence the induced EMF. Adjusting the field current controls the machine's power factor and voltage.

Slip rings and brushes provide a sliding electrical connection to the rotating field winding. Two slip rings, mounted on the shaft, are connected to the ends of the field winding. Stationary carbon or graphite brushes press against the slip rings, transferring DC excitation current. In alternators, this is the standard arrangement for brush-type excitation; brushless exciters are also used today.

The damper winding (or amortisseur winding) is a set of copper or aluminum bars embedded in the pole faces of salient-pole rotors (or in wedge slots of cylindrical rotors) and short-circuited at both ends by end rings, forming a squirrel-cage-like structure. Its primary purpose in generators is to damp out rotor oscillations during transient disturbances, improving stability. It also assists in starting synchronous motors by providing induction motor torque. Under normal synchronous operation, no current flows in the damper winding because the rotor and stator field rotate together. However, during speed deviations, relative motion induces currents that produce a torque opposing the deviation, thus damping oscillations.

![Construction of Synchronous Motor](https://www.electricaltechnology.org/wp-content/uploads/2022/08/Construction-of-Synchronous-Motor-1024x513.png)
*Figure: Cutaway view of a synchronous machine illustrating the stator (armature) and salient-pole rotor (field) construction, including damper windings. Source: [ElectricalTechnology](https://www.electricaltechnology.org/2022/09/synchronous-motor.html).*

In summary, the armature winding captures the energy, the field winding creates the flux, slip rings/brushes deliver excitation, and damper windings ensure stability and starting capability.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 28

**Question:** Compare synchronous generator and synchronous motor operation.

**Tags:** synchronous generator, synchronous motor, comparison, operation

A synchronous machine can operate as a generator or motor depending on the direction of power flow. The construction is essentially identical; only the operating mode differs.

- In generator mode, mechanical power is applied to the shaft, and the rotor is driven at synchronous speed. The DC-excited rotor field cuts the stator conductors, inducing a three-phase AC voltage. When connected to a load or grid, current flows out of the stator. The electromagnetic torque produced by the interaction of stator and rotor fields opposes the mechanical input, acting as a brake. Thus, the machine converts mechanical energy to electrical energy. The rotor magnetic axis leads the stator field axis by the torque (load) angle δ; a larger angle corresponds to more power.

- In motor mode, three-phase AC power is supplied to the stator windings, producing a rotating magnetic field. The rotor, already excited with DC, locks onto this field and rotates at the same speed. Electromagnetic torque is developed in the direction of rotation, delivering mechanical output at the shaft. The rotor magnetic axis lags the stator field axis by the torque angle δ. The motor can be used to drive mechanical loads.

Key functional differences:
  - Power flow: In generator, input mechanical, output electrical; in motor, input electrical, output mechanical.
  - Excitation control: In both, field current can be adjusted to control reactive power. Over-excited synchronous machines supply reactive power (generator or motor appear capacitive), while under-excited ones absorb reactive power (appear inductive). This allows synchronous motors to improve plant power factor.
  - Starting: A synchronous motor is not self-starting because the rotor inertia prevents instantaneous synchronization. It is started by means of damper windings as an induction motor, or by a separate pony motor. Generators are brought up to speed by the prime mover before synchronization.
  - Stability: Both are susceptible to loss of synchronism if overloaded beyond the pull-out torque, but the transient behavior differs due to the rotor's inertia and damper windings.

In summary, the same physical machine can seamlessly transition between generating and motoring by reversing power flow, with the torque angle sign determining the mode. The machine's versatility in reactive power control is exploited in both applications.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Armature reaction and phasor diagrams

### Theory Question 29

**Question:** Explain armature reaction in an alternator at unity, lagging, and leading power factor loads.

**Tags:** armature reaction, power factor, alternator

Armature reaction refers to the effect of the armature current on the main field flux produced by the rotor poles in an alternator. When the alternator supplies a load, the armature current sets up its own mmf, which combines vectorially with the field mmf to produce the resultant air-gap flux. The nature of this interaction depends on the phase angle between the armature current and the induced emf, i.e., the load power factor.

At **unity power factor**, the armature current $I_a$ is in phase with the terminal voltage (and approximately in phase with the induced emf $E_f$). The armature mmf wave is stationary relative to the rotor and its axis is aligned with the quadrature (interpolar) axis, exactly halfway between adjacent field poles. Consequently, the armature mmf neither directly opposes nor aids the main field; instead, it distorts the air-gap flux distribution, a phenomenon known as *cross-magnetization*. Under unsaturated conditions the average flux per pole remains unchanged, but saturation can cause a slight reduction.

At **lagging power factor**, $I_a$ lags behind $E_f$. The armature mmf can be resolved into two components: one along the direct (pole) axis and one along the quadrature axis. The direct-axis component opposes the main field mmf, producing a *demagnetizing* effect. This reduces the net air-gap flux and therefore the generated emf. The higher the lagging reactive current, the stronger the demagnetization, which explains why an alternator requires more excitation (higher field current) to maintain constant terminal voltage under lagging loads.

At **leading power factor**, $I_a$ leads $E_f$. The direct-axis component of the armature mmf now aids the main field mmf, resulting in a *magnetizing* effect. The net flux in the air gap increases, which tends to raise the terminal voltage. Hence, an alternator operating into a leading load may experience a voltage rise unless the field excitation is reduced.

In the equivalent circuit, armature reaction is represented by an equivalent reactance drop $j I_a X_{ar}$. Together with the leakage reactance, it forms the synchronous reactance $X_s$. The phasor diagrams for different power factors clearly illustrate these mmf components. In summary, armature reaction is cross-magnetizing for unity power factor, demagnetizing for lagging, and magnetizing for leading loads, directly influencing terminal voltage and voltage regulation.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 30

**Question:** Draw and explain the phasor diagram of a loaded alternator at lagging power factor.

**Tags:** phasor diagram, lagging power factor, synchronous generator

The phasor diagram of a loaded alternator visually relates the terminal voltage $V_t$, the armature current $I_a$, and the internal induced emf $E_f$. For a lagging power factor load, the diagram is constructed using the simplified equivalent circuit equation:

$$
\begin{aligned}
E_f &= V_t + I_a R_a + j I_a X_s
\end{aligned}
$$

where $R_a$ is the armature resistance and $X_s$ is the synchronous reactance (combining leakage and armature reaction reactances).

![Phasor Diagram of a Synchronous Generator at Lagging Power Factor](https://www.theengineeringknowledge.com/wp-content/uploads/2019/10/Phasor-Diagram-of-a-Synchronous-Generator-at-lagging-p.f.jpg)
*Figure: Phasor diagram of a synchronous generator on lagging power factor load. Source: [The Engineering Knowledge](https://www.theengineeringknowledge.com/phasor-diagram-of-a-synchronous-generator/).*

The step-by-step construction is as follows:

1. **Choose reference phasor**: Take the terminal voltage $V_t$ as the reference, drawn horizontally to the right.
2. **Draw the current phasor**: For a lagging load, the armature current $I_a$ lags behind $V_t$ by the load phase angle $\phi$ (typically between 0° and 90°). The magnitude of $I_a$ is determined by the load demand.
3. **Add the resistive voltage drop**: The $I_a R_a$ drop is in phase with $I_a$. Draw a phasor of length $I_a R_a$ parallel to $I_a$, starting from the tip of $V_t$.
4. **Add the synchronous reactance drop**: The $j I_a X_s$ drop leads $I_a$ by exactly 90°. Draw a phasor of length $I_a X_s$ perpendicular to $I_a$, starting from the tip of $I_a R_a$. For a lagging current, this reactance drop is drawn approximately upward and to the right.
5. **Complete the phasor diagram**: The phasor sum $V_t + I_a R_a + j I_a X_s$ gives the internal generated emf $E_f$. The angle $\delta$ between $E_f$ and $V_t$ is the **power angle** (or load angle); the angle between $I_a$ and $E_f$ is the internal power factor angle $\psi$.

From the diagram, several important observations can be made:
- The generated emf $E_f$ is larger than the terminal voltage $V_t$ for a lagging load, because the armature reaction is demagnetizing and the reactance drop is inductive, so more excitation is needed to overcome the drop.
- The power angle $\delta$ increases with load; it determines the active power output: $P = \frac{E_f V_t}{X_s} \sin\delta$.
- The phasor diagram directly shows the reactive power demand from the excitation system.

Understanding this diagram is essential for calculating voltage regulation, predicting steady-state stability, and setting the field excitation.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 31

**Question:** Explain voltage regulation of an alternator and why it changes with power factor.

**Tags:** voltage regulation, alternator, power factor

Voltage regulation of an alternator is defined as the change in terminal voltage when the rated load is thrown off while keeping the field excitation and speed constant, expressed as a percentage of the rated terminal voltage:

$$
\begin{aligned}
\% \text{VR} &= \frac{E_0 - V_t}{V_t} \times 100
\end{aligned}
$$

where $E_0$ is the no-load terminal voltage (equal to the internal generated emf $E_f$ under no-load, if resistance is neglected) and $V_t$ is the full-load terminal voltage at the specified power factor. A positive regulation means the terminal voltage drops as load is applied; a negative regulation means it rises.

The value of voltage regulation depends strongly on the load **power factor** because the armature reaction and the impedance voltage drops have phase-dependent effects.

**Lagging power factor (inductive load)**
With a lagging current, the armature reaction is demagnetizing. In the phasor diagram, both the resistive drop $I_a R_a$ and the reactive drop $j I_a X_s$ add to the terminal voltage $V_t$ in such a way that the generated emf $E_f$ must be significantly larger than $V_t$. The more lagging the power factor, the greater the demagnetizing effect and the larger the required $E_f$, resulting in a high positive regulation. For zero power factor lagging, the regulation is maximum.

**Leading power factor (capacitive load)**
For a leading current, the armature reaction is magnetizing. The $j I_a X_s$ drop partially cancels some component of $V_t$, and the net $E_f$ may become smaller than $V_t$. Thus the terminal voltage can actually rise when the load is removed, giving a negative regulation (a voltage rise on load). At very low leading power factors, this rise can be substantial.

**Unity power factor**
At unity power factor, the armature reaction is mainly cross-magnetizing; there is only a minor demagnetizing effect due to saturation. The resistive drop and the quadrature drop due to synchronous reactance cause $E_f$ to be somewhat larger than $V_t$, leading to a moderate positive regulation (typically a few percent). The regulation is higher than at slightly leading loads but lower than at lagging loads.

From the approximate expression for $E_f$ for a cylindrical-rotor machine:

$$
\begin{aligned}
E_f &\approx \sqrt{(V_t \cos\phi + I_a R_a)^2 + (V_t \sin\phi + I_a X_s)^2}
\end{aligned}
$$

it is clear that the phase angle $\phi$ (and its sign) determines whether the terms add or subtract, directly influencing $E_f$ and hence the regulation. Thus, voltage regulation is inherently dependent on the power factor: lagging loads cause a larger voltage drop (positive regulation), leading loads may cause a voltage rise (negative regulation), and unity loads give a moderate drop.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 32

**Question:** Compare EMF method, MMF method, and zero power factor method of voltage regulation.

**Tags:** EMF method, MMF method, ZPF method, voltage regulation

Several methods exist to determine the voltage regulation of an alternator, each differing in complexity, assumptions, and accuracy. The three principal methods are the EMF (Synchronous Impedance) method, the MMF (Ampere-Turn) method, and the Zero Power Factor (Potier) method.

**1. EMF Method (Synchronous Impedance Method)**
This method models the alternator by its armature resistance $R_a$ and a constant synchronous reactance $X_s$ (or synchronous impedance $Z_s = R_a + j X_s$), derived from open-circuit and short-circuit tests. It assumes the magnetic circuit is unsaturated and $X_s$ is independent of load conditions. The internal emf is calculated using $E_f = V_t + I_a Z_s$. The regulation computed by this method is usually higher (pessimistic) than actual because $X_s$ is taken as the unsaturated value, which overestimates voltage drops under loaded saturated conditions. It is simple and quick, suitable for approximate calculations or small machines.

**2. MMF Method (Ampere-Turn Method)**
This method accounts for magnetic saturation. Instead of a single reactance, the net mmf required to produce the air-gap flux is determined by adding algebraically the field mmf needed to induce the terminal voltage (on no-load) and the equivalent mmf of armature reaction, taking their phase relationships into account. Using the open-circuit characteristic (OCC) and short-circuit characteristic (SCC), two mmf components are found: the field mmf to give $V_t$ and the armature reaction mmf. Their vector sum gives the total field mmf, from which $E_0$ is read on the OCC. This method yields more realistic regulation values than the EMF method, especially near full load, because it includes the nonlinear magnetic characteristic. However, it does not separate leakage reactance and armature reaction completely, and the armature reaction mmf is assumed proportional to armature current, which is only approximate.

**3. Zero Power Factor Method (Potier Method)**
The ZPF method directly addresses the limitations of the MMF method. It requires an additional test: the zero power factor (lagging) characteristic, obtained by loading the alternator with a purely inductive load at rated current. From the OCC and ZPF curves, a *Potier triangle* is constructed. The vertical side of this triangle gives the leakage reactance drop $I_a X_l$, and the horizontal side gives the armature reaction mmf (in equivalent field amperes). The method thus separates the leakage reactance and the armature reaction. Because the ZPF test inherently includes the effect of saturation, the calculated regulation is highly accurate, closely matching experimental results. It is the preferred method for large alternators. Its main drawbacks are the need for a pure inductive load and the graphical procedure, which can be somewhat tedious.

**Comparison Summary**
- **Simplicity:** EMF (easiest) > MMF > ZPF (most involved).
- **Accuracy:** ZPF > MMF > EMF (usually pessimistic, sometimes optimistic at leading PF).
- **Saturation handling:** ZPF and MMF account for it; EMF ignores it.
- **Application:** EMF is used for preliminary studies; MMF is better when saturation is significant; ZPF is the definitive method for predicting regulation in practical large machines.

All three methods ultimately provide the no-load voltage $E_0$ for a given operating condition, from which the percentage regulation is obtained. Choosing the right method depends on the required accuracy and available test data.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Synchronization and parallel operation

### Theory Question 33

**Question:** State and explain the conditions required for synchronizing an alternator to busbars.

**Tags:** synchronization, alternators, parallel operation

Before an incoming alternator is connected to live busbars, its generated voltage must match the busbar voltage in all important respects. Otherwise, a large circulating current and mechanical shock can occur at the instant of closing.

The required conditions are:

- **Equal voltage magnitude:** The rms terminal voltage of the incoming alternator must be equal to the busbar voltage. This is adjusted by changing field excitation.
- **Same frequency:** The incoming frequency must equal the busbar frequency. This is adjusted by controlling the prime-mover speed.
- **Same phase sequence:** The order of phases must be identical, such as R-Y-B. If phase sequence is wrong, the lamps or synchroscope pattern will not settle correctly and closing would short unlike phases.
- **Zero phase angle at closing:** Corresponding phase voltages must be in phase at the instant the breaker is closed.
- **Similar waveform:** In practice, alternators should have nearly sinusoidal voltages to avoid harmonic circulating currents.

The synchronizing idea can be stated as:

$$
\begin{aligned}
V_{\text{incoming}} &= V_{\text{bus}},\\
f_{\text{incoming}} &= f_{\text{bus}},\\
\text{phase sequence}_{\text{incoming}} &= \text{phase sequence}_{\text{bus}},\\
\delta &= 0^\circ \quad \text{at closing}.
\end{aligned}
$$

If the incoming machine is slightly fast, the phase angle slowly advances; if it is slightly slow, the phase angle falls back. The breaker is closed when the instruments indicate phase coincidence.

> **Final takeaway:** Synchronization means matching voltage, frequency, phase sequence, and instantaneous phase angle before connecting the alternator to live busbars.

---

### Theory Question 34

**Question:** Explain the two-bright one-dark lamp method of synchronizing alternators.

**Tags:** lamp method, synchronizing, phase sequence

In the two-bright one-dark lamp method, three lamps are connected between the incoming alternator terminals and the busbar terminals in a cross-connected pattern. One lamp is connected between corresponding phases, while the other two are connected between non-corresponding phases. This arrangement gives a clear indication of both phase sequence and phase coincidence.

For correct phase sequence, the lamps brighten and darken cyclically. The rate of flicker indicates the frequency difference:

- Slow flicker means the incoming alternator frequency is nearly equal to the busbar frequency.
- Fast flicker means the speed of the prime mover must be adjusted.
- If the lamps do not follow the expected pattern, the phase sequence is wrong and any two incoming leads must be interchanged.

At the correct instant for closing, the lamp connected across corresponding phases is dark because the voltage across it is nearly zero. The other two lamps are bright because they are connected across phase-displaced voltages. This gives the name **two-bright one-dark**.

Let the corresponding phase voltage difference be:

$$
\begin{aligned}
V_{\text{lamp}} &= |\mathbf{V}_{\text{incoming}} - \mathbf{V}_{\text{bus}}|.
\end{aligned}
$$

At synchronism, the corresponding phasors coincide, so $V_{\text{lamp}} \approx 0$ for the dark lamp.

The method is simple and inexpensive, but it is less precise than a synchroscope. It is suitable for educational and small alternator synchronization setups.

> **Final takeaway:** In the two-bright one-dark method, the breaker is closed when the corresponding-phase lamp is dark and the two cross-connected lamps are equally bright.

---

### Theory Question 35

**Question:** Explain the use of a synchroscope and the effect of wrong phase sequence during synchronization.

**Tags:** synchroscope, phase sequence, busbars

A synchroscope is an instrument that shows whether an incoming alternator is running fast or slow with respect to the busbars, and it also indicates the instant of phase coincidence. It is connected between the incoming alternator voltage and the busbar voltage.

If the pointer rotates in the **fast** direction, the incoming alternator frequency is slightly higher than the busbar frequency. The prime-mover speed must be reduced slightly. If it rotates in the **slow** direction, the incoming frequency is lower and the prime-mover speed must be increased. The pointer should rotate slowly near the top or synchronizing mark; then the breaker is closed when the pointer reaches the in-phase position.

The frequency difference is represented by the relative angular speed of the phasors:

$$
\begin{aligned}
\omega_{\text{rel}} &= 2\pi\left(f_{\text{incoming}} - f_{\text{bus}}\right).
\end{aligned}
$$

Wrong phase sequence is dangerous because corresponding terminals do not reach phase coincidence together. Even if one phase appears correct, the other two phases are displaced incorrectly. Closing under this condition causes heavy short-circuit current, severe electromagnetic torque pulsation, and possible damage to the breaker, alternator, and prime mover.

Therefore, phase sequence is checked before final synchronization using a phase-sequence indicator, lamp method, or synchroscope behavior.

> **Final takeaway:** A synchroscope guides speed adjustment and closing instant, but phase sequence must be verified separately before paralleling.

---

### Theory Question 36

**Question:** Explain load sharing between alternators operating in parallel.

**Tags:** parallel operation, load sharing, governor, excitation

When alternators operate in parallel, the total load is shared according to their mechanical input and excitation settings. Real power sharing is mainly controlled by the prime-mover governor, while reactive power sharing is mainly controlled by field excitation.

If the mechanical input to one alternator is increased, its rotor tends to advance slightly in phase. This increases its power angle $\delta$, so it supplies a larger share of active power. For a cylindrical-rotor approximation:

$$
\begin{aligned}
P &\propto \frac{EV}{X_s}\sin\delta.
\end{aligned}
$$

Thus, increasing prime-mover torque increases $P$ without necessarily changing terminal voltage much, because the alternator is tied to common busbars.

Reactive power depends strongly on excitation:

- **Over-excited alternator:** supplies more lagging reactive power to the busbars.
- **Under-excited alternator:** absorbs reactive power or supplies less of it.
- **Equal excitation settings:** help prevent unnecessary circulating reactive current.

The busbar voltage and frequency remain common to all machines. Good parallel operation requires governor droop and voltage regulator settings that allow stable sharing instead of hunting or circulating currents.

In practice, active load is adjusted using the governor control, and reactive load is adjusted using the field rheostat or automatic voltage regulator.

> **Final takeaway:** In parallel alternators, real power is shared by changing mechanical input, while reactive power is shared by changing field excitation.

---

## Synchronous motor excitation and V-curves

### Theory Question 37

**Question:** Explain why a synchronous motor is not self-starting and list common starting methods.

**Tags:** synchronous motor, starting methods, damper winding, self-starting

A synchronous motor is not self-starting because the stator magnetic field rotates at synchronous speed while the rotor (with DC excitation or permanent magnet) is initially stationary. The interaction torque alternates between positive and negative over each half-cycle of the AC supply, due to the high relative speed and inertia, resulting in zero average torque. Therefore, the motor cannot accelerate from zero speed by simply connecting to AC mains.

Common starting methods:
1. **Damper winding (amortisseur) start**: Most synchronous motors have squirrel-cage windings embedded in pole faces. The motor starts as an induction motor with the field winding shorted or connected through a resistor. Once near synchronous speed, DC excitation is applied and the rotor pulls into synchronism.
2. **Pony motor start**: A small induction motor (pony motor) mechanically coupled to the shaft brings the rotor up to near-synchronous speed, after which the main motor is synchronized to the supply and the pony motor is disconnected.
3. **Variable frequency drive (VFD) start**: Modern drives supply variable-frequency voltage, ramping the frequency from zero to rated, thereby rotating the stator field slowly enough for the rotor to follow and lock in synchronism from the start.
4. **Damper winding with reduced-voltage starting**: In larger motors, reduced-voltage starting via autotransformer or reactor can limit starting current, combined with damper winding action.

The synchronous motor's inherently non-self-starting nature requires auxiliary means to reach synchronous speed before synchronizing.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 38

**Question:** Explain the effect of field excitation on armature current and power factor of a synchronous motor.

**Tags:** synchronous motor, excitation, power factor, armature current

In a synchronous motor operating at constant mechanical load (constant power) and constant terminal voltage, varying the DC field excitation changes the motor's reactive power consumption and hence its power factor and armature current.

The power delivered per phase is:
$P = \frac{V_t E_f}{X_s} \sin\delta$, where $V_t$ is terminal voltage, $E_f$ is excitation EMF induced by field current $I_f$, $X_s$ is synchronous reactance, and $\delta$ is the load angle. For constant power $P$, $E_f \sin\delta$ remains constant. Thus, increasing $I_f$ (increasing $E_f$) forces $\sin\delta$ to decrease, altering the phase angle between current and voltage.

When $E_f$ is small (under-excitation), the motor draws a lagging armature current (like an inductive load) to produce the required magnetization. As excitation is increased, the lagging reactive current decreases. At a certain $I_f$, the current becomes minimum and is in phase with $V_t$ (unity power factor). This is called normal excitation. If $I_f$ is further increased (over-excitation), the motor draws leading armature current and behaves like a capacitive load, supplying reactive power to the system.

The relationship can be visualized via phasor diagrams: $V_t = E_f + j I_a X_s$ (simplified). The tip of $E_f$ moves vertically as $I_f$ changes, causing the current phasor to swing between lagging and leading positions. Consequently, the magnitude of armature current $I_a$ is minimum at unity power factor and increases on either side.

By adjusting field excitation, a synchronous motor can operate at any desired power factor-lagging, unity, or leading-making it a valuable controllable reactive power device.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 39

**Question:** Explain V-curves and inverted V-curves of a synchronous motor.

**Tags:** V-curves, inverted V-curves, synchronous motor, excitation, power factor

V-curves of a synchronous motor are plots of armature current ($I_a$) against field current ($I_f$) for various constant mechanical load levels (power outputs). They get their name from their V-like shape. For a given load, as $I_f$ is varied from a low value (under-excitation) through normal excitation to high value (over-excitation), $I_a$ first decreases, reaches a minimum at unity power factor, and then increases. The minimum armature current points trace the unity power factor line. To the left of this line, the motor operates at lagging power factor (under-excited); to the right, at leading power factor (over-excited). Higher loads shift the V-curve upward and to the right (higher armature current for the same power factor) because more active power requires more in-phase current.

Inverted V-curves (also called $\Lambda$-curves or power-factor curves) plot the power factor ($\cos\phi$) against $I_f$ for constant load. These curves are inverted V shapes: at low excitation, power factor is lagging and low; as excitation increases, power factor improves, reaches unity (peak of the inverted V), and then becomes leading and decreases. The peak of each curve corresponds to the minimum $I_a$ on the V-curve.

![V Curves and Inverted V Curves](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilQK1NE7HmoMgXP_PKVh_Q-WnXZp13NLqmy7AGbNPtXiIHNKS-dW2QjSegPdF5YUJVJXES79SFSx_us0o8btdJh3s8oxodUcekhqcDPY9dxpHZKx6JrYjEOfjn3fba3ghU_xMllpH1I8NAMYSIN-KmfcA-ieOgrD068DPD4maETRk9ps0isSqv8w/w1600/Picture238.png)
*Figure: V-curves (solid lines) show armature current versus field current for constant power outputs; dashed lines (inverted V-curves) show corresponding power factor variation. Source: [Electrical Desks](https://www.electricaldesks.com/2023/01/v-curves-and-inverted-v-curves-of-synchronous-motor.html).*

V-curves are essential for understanding the excitation control of synchronous motors; they show how to adjust field current for desired reactive power flow while meeting mechanical load.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 40

**Question:** Explain synchronous condenser operation and its use for power-factor correction.

**Tags:** synchronous condenser, power factor correction, reactive power, voltage control

A synchronous condenser is a dedicated synchronous motor operated at no load (or very light load) with its excitation adjusted to act as a variable capacitor or inductor. The machine is over-excited such that it draws leading armature current, effectively supplying reactive power (VARs) to the AC system. Under-excited, it absorbs reactive power (like an inductor). Since there is no mechanical load, the active power drawn is just enough to overcome windage, friction, and copper losses; the motor runs essentially as a reactive power source/sink.

Operation: The field current $I_f$ is set well above the value needed for unity power factor at no load. From the equation $Q = \sqrt{3} V_t I_a \sin\phi$, and with $P \approx 0$, the armature current is almost purely reactive leading. This capacitive behavior compensates for lagging loads (such as induction motors, transformers) on the same bus, thereby improving the overall system power factor and reducing line currents and voltage drops.

Uses for power-factor correction:
- In industrial plants with many induction motors, a synchronous condenser connected at the main substation provides central reactive power compensation, avoiding low power factor penalties and freeing up transformer and cable capacity.
- In transmission systems, synchronous condensers provide dynamic reactive power support, helping to regulate voltage and improve transient stability. They can respond quickly to system disturbances by varying excitation.
- They are also used at HVDC converter stations to supply reactive power and strengthen the AC network.

Advantages include continuous and smooth control of VARs, ability to supply momentary overloads, and inherent inertia that contributes to system frequency stability. Modern alternatives like STATCOMs exist, but synchronous condensers remain in use due to their robust, rotating inertia.

The synchronous condenser is a flexible, rotation-based device that delivers leading reactive power on demand, making it a cornerstone for power-factor improvement and voltage control in power systems.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Salient-pole machines and two-reaction theory

### Theory Question 41

**Question:** Explain Blondel's two-reaction theory for salient-pole synchronous machines.

**Tags:** Blondel, two-reaction theory, salient-pole, direct axis, quadrature axis

Blondel's two-reaction theory provides a simplified method to analyze salient-pole synchronous machines by resolving the armature magnetomotive force (mmf) into two independent components acting along two distinct magnetic axes. In a salient-pole rotor, the air-gap is highly non-uniform: the region directly under the pole faces (direct axis, or d-axis) offers a low-reluctance magnetic path, while the interpolar region (quadrature axis, or q-axis) has a much larger air-gap and hence higher reluctance.

![Two-reaction model of salient-pole synchronous machine showing direct (d) and quadrature (q) axes](https://circuitglobe.com/wp-content/uploads/2016/01/two-reaction-theory-fig-1.jpg)
*Figure: Salient-pole machine with d- and q-axes. Source: [Circuit Globe](https://circuitglobe.com/two-reaction-theory-salient-pole-synchronous-machine.html).*

The fundamental idea is to resolve the armature current $\overline{I}_a$ into two components:
- $\overline{I}_d$ - the d-axis component, which produces flux along the direct axis.
- $\overline{I}_q$ - the q-axis component, which produces flux along the quadrature axis.

Each component encounters a different reactance because the magnetic circuits differ. Consequently, the armature reaction is modeled by two separate synchronous reactances: $X_d$ (d-axis synchronous reactance) and $X_q$ (q-axis synchronous reactance). The terminal voltage $\overline{V}$ relates to the excitation emf $\overline{E}$ (produced by the field current) through the equation:

$$
\overline{E} = \overline{V} + \overline{I}_a R_a + j\overline{I}_d X_d + j\overline{I}_q X_q.
$$

Neglecting armature resistance $R_a$, the phasor diagram can be constructed by first resolving the armature current into d- and q-components using the known power angle $\delta$ and the load angle $\phi$.

This two-reaction approach greatly simplifies the steady-state analysis of salient-pole machines, allowing separation of the air-gap flux effects and leading directly to the two-term power-angle expression that includes both excitation power and reluctance power. The theory remains the foundation for the d-q reference frame modeling used in modern electric machine analysis.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 42

**Question:** Explain direct-axis and quadrature-axis reactances and why $X_d$ is usually greater than $X_q$.

**Tags:** direct-axis reactance, quadrature-axis reactance, X_d, X_q, saliency

The direct-axis synchronous reactance $X_d$ and the quadrature-axis synchronous reactance $X_q$ are the effective reactances of a salient-pole synchronous machine when the armature mmf is aligned with the respective rotor axes.

- $X_d$ is the reactance measured when the peak of the armature mmf wave coincides with the direct (pole) axis. It consists of the armature leakage reactance $X_{al}$ plus the d-axis armature reaction reactance $X_{ad}$:
  $X_d = X_{al} + X_{ad}$.
- $X_q$ is the reactance measured when the armature mmf wave coincides with the quadrature (interpolar) axis:
  $X_q = X_{al} + X_{aq}$.

The reason $X_d > X_q$ lies in the machine's magnetic geometry. The d-axis path passes through the main pole body, pole shoes, and a relatively small air-gap. The q-axis path, however, crosses the much larger interpolar space, often consisting mostly of high-reluctance air and non-magnetic materials. Because magnetic permeance $\mathcal{P}$ is inversely proportional to the effective air-gap length, the d-axis enjoys a significantly higher permeance than the q-axis:

$$
\mathcal{P}_d \gg \mathcal{P}_q \quad\Rightarrow\quad X_{ad} \gg X_{aq}.
$$

Since both reactances share the same leakage term $X_{al}$, the total $X_d$ becomes substantially larger than $X_q$. Typical salient-pole machines exhibit $X_d/X_q$ ratios between 1.5 and 2.5, whereas cylindrical-rotor (turbo-) machines have $X_d \approx X_q$ because their uniform air-gap makes the magnetic path equally permeable in all radial directions.

The inequality $X_d \neq X_q$ is the source of the reluctance torque component in the power-angle characteristic of salient-pole machines. It also influences voltage regulation and steady-state stability limits.

Practical determination: $X_d$ and $X_q$ can be measured by the slip test, where the machine is run at a small slip with the field open and a reduced three-phase voltage applied to the armature. The ratio of applied voltage to the minimum armature current gives $X_d$ (high reactance → low current), while the ratio to the maximum armature current gives $X_q$ (low reactance → high current).

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 43

**Question:** Derive the qualitative power-angle equation of a salient-pole synchronous generator.

**Tags:** power-angle equation, salient-pole generator, reluctance power, two-reaction theory

The power delivered by a salient-pole synchronous generator to an infinite bus consists of two distinct components: one due to the field excitation and another due to the magnetic saliency (reluctance torque). The derivation begins with the d-q axis model and the simplified phasor diagram shown below.

![Phasor diagram of salient-pole alternator illustrating Blondel two-reaction theory with direct (d) and quadrature (q) axis components](https://www.electricalengineeringinfo.com/wp-content/uploads/2016/12/New2BDoc2B1_2.png)
*Figure: Phasor diagram showing resolution of voltages and currents. Source: [Electrical Engineering Info](https://www.electricalengineeringinfo.com/2016/12/blondel-two-reaction-theory-salient-pole-alternators.html).*

Let the terminal voltage $\overline{V}$ be the reference, and the excitation emf $\overline{E}$ be advanced by the load angle $\delta$. Neglecting armature resistance, the armature current components can be expressed as:

$$
I_d = \frac{E - V \cos\delta}{X_d}, \qquad
I_q = \frac{V \sin\delta}{X_q}.
$$

These relations follow from the voltage equation projected onto the d- and q-axes:
$$
E = V \cos\delta + I_d X_d, \quad 0 = V \sin\delta - I_q X_q.
$$

The per-phase active power is $P = V I \cos\phi = V (I_d \sin\delta + I_q \cos\delta)$. Substituting the currents yields:

$$
\begin{aligned}
P &= V \left( \frac{E - V \cos\delta}{X_d} \sin\delta + \frac{V \sin\delta}{X_q} \cos\delta \right) \\
  &= \frac{EV}{X_d}\sin\delta + V^2 \left( \frac{1}{X_q} - \frac{1}{X_d} \right) \sin\delta \cos\delta \\
  &= \frac{EV}{X_d}\sin\delta + \frac{V^2}{2} \left( \frac{1}{X_q} - \frac{1}{X_d} \right) \sin 2\delta.
\end{aligned}
$$

For a three-phase machine, multiply by 3:

$$
P_{3\phi} = 3\,\frac{EV}{X_d}\sin\delta + \frac{3V^2}{2} \left( \frac{1}{X_q} - \frac{1}{X_d} \right) \sin 2\delta.
$$

The first term $\dfrac{EV}{X_d}\sin\delta$ is the *synchronous power* produced by the field excitation; it is identical in form to the power of a cylindrical-rotor machine. The second term is the *reluctance power*; it arises solely from the difference between $X_d$ and $X_q$ and exists even when the excitation is removed ($E = 0$). The $\sin 2\delta$ dependency causes the overall power-angle curve to peak at an angle less than $90^\circ$, enhancing stability in some operating regions.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

### Theory Question 44

**Question:** Explain the slip test for determining $X_d$ and $X_q$.

**Tags:** slip test, X_d measurement, X_q measurement, salient-pole, synchronous reactance

The slip test is a simple experimental method for measuring the direct-axis synchronous reactance $X_d$ and the quadrature-axis synchronous reactance $X_q$ of a salient-pole synchronous machine. It exploits the variation in armature circuit reactance as the rotor slowly slips relative to the stator rotating field.

**Procedure:**
1. The synchronous machine under test is mechanically coupled to a prime mover and driven at a speed slightly different from synchronous speed. A small slip of about 0.5 % to 1 % is usually aimed for.
2. The field winding is left open-circuited (or, for safety, connected across a high-resistance discharge resistor to limit any induced voltage).
3. A balanced three-phase voltage of reduced magnitude is applied to the armature windings. The voltage level is chosen to allow safe current readings while avoiding excessive heating.
4. The armature current and the applied voltage are monitored with instruments capable of recording the slowly oscillating values.

**Operating principle:**
Because the rotor is not rotating synchronously, the armature rotating mmf alternately lines up with the d-axis (direct axis) and then with the q-axis (quadrature axis). Since $X_d > X_q$, the armature current undergoes a corresponding cyclical variation:
- When the mmf is along the *d-axis*, the magnetic path has low reluctance and the reactance is high; the armature draws a *minimum* current $I_{\min}$.
- When the mmf is along the *q-axis*, the higher reluctance gives a low reactance; the armature draws a *maximum* current $I_{\max}$.

Provided the slip is small enough that the armature resistance is negligible compared with the reactance and that induced slip-frequency effects are minimal, we obtain:

$$
X_d = \frac{V_{\text{phase}}}{I_{\min}}, \qquad
X_q = \frac{V_{\text{phase}}}{I_{\max}}.
$$

**Important precautions:**
- The slip must be kept very low (typically ≤1 %). Otherwise, induction motor torque modifies the rotor speed, and the measured reactance no longer represents the true synchronous reactance.
- The field winding, if left open, may develop dangerously high induced voltage at slip frequency; connecting it through a high-resistance discharge path is standard practice.
- The applied voltage should be sufficiently reduced to avoid saturation and overheating, yet high enough to give measurable current differences.

The slip test is widely used because of its straightforward implementation and the fact that both $X_d$ and $X_q$ are obtained from a single run. However, results may be influenced by damper windings and residual saturation, so the values are approximate.

> **Final takeaway:** For exam answers, write the definition, the governing relation, the physical meaning, and the practical effect in that order.

---

## Hunting, stability, and exam comparisons

### Theory Question 45

**Question:** Explain hunting in synchronous machines, its causes, effects, and remedies.

**Tags:** hunting, stability, damper winding

Hunting is the oscillation of the rotor of a synchronous machine about its steady synchronous position. In normal operation the rotor magnetic field locks with the rotating stator field at a definite load angle $\delta$. When the load changes suddenly, the rotor cannot instantly settle at the new angle because of inertia. It overshoots, slows, and oscillates before reaching a new steady value.

The synchronizing power tends to restore the rotor:

$$
\begin{aligned}
P &\approx \frac{EV}{X_s}\sin\delta,\\
\frac{dP}{d\delta} &\approx \frac{EV}{X_s}\cos\delta.
\end{aligned}
$$

The term $dP/d\delta$ is the synchronizing stiffness. If it is high, the machine has a stronger restoring tendency. Hunting becomes serious when damping is weak or when disturbances are repeated.

Common causes are sudden load changes, faults, poor governor response, weak damping, and pulsating mechanical torque. Effects include mechanical stress, voltage and current oscillations, increased losses, noise, and possible loss of synchronism.

Remedies include damper windings, proper governor tuning, fast excitation control, avoiding sudden load application, and using flywheels where mechanical pulsations are large. Damper bars behave like a squirrel-cage winding during oscillations, producing currents that oppose relative motion between rotor and stator field.

> **Final takeaway:** Hunting is rotor-angle oscillation after disturbance; damper windings and proper control provide the damping needed for stable operation.

---

### Theory Question 46

**Question:** Compare induction motors and synchronous motors for industrial drives.

**Tags:** comparison, induction motor, synchronous motor

Induction motors and synchronous motors are both AC machines, but their operating behavior is different.

An induction motor runs below synchronous speed because torque is produced only when there is slip between the rotating magnetic field and the rotor. It is self-starting in three-phase form, rugged, inexpensive, and widely used for general industrial drives. Its speed falls slightly with load, and its power factor is usually lagging because it requires magnetizing current from the supply.

A synchronous motor runs exactly at synchronous speed:

$$
\begin{aligned}
N_s &= \frac{120f}{P}.
\end{aligned}
$$

It is not inherently self-starting, so it needs damper winding, pony motor, variable-frequency drive, or another starting arrangement. Once synchronized, it maintains constant speed from no load to rated load. By changing field excitation, its power factor can be made lagging, unity, or leading.

Main comparison:

- **Starting:** induction motor is simpler; synchronous motor needs special starting.
- **Speed:** induction motor has slip; synchronous motor has constant speed.
- **Power factor:** induction motor is normally lagging; synchronous motor can correct power factor.
- **Cost and maintenance:** induction motor is cheaper and more rugged; synchronous motor is costlier due to excitation system.
- **Use:** induction motor suits pumps, fans, compressors, and general drives; synchronous motor suits constant-speed high-power drives and power-factor correction.

> **Final takeaway:** Induction motors are preferred for rugged general drives, while synchronous motors are chosen when constant speed or controllable power factor is important.

---

### Theory Question 47

**Question:** Compare cylindrical-rotor and salient-pole alternators in construction and applications.

**Tags:** cylindrical rotor, salient pole, alternator

Cylindrical-rotor and salient-pole alternators differ mainly in rotor shape, operating speed, number of poles, and application.

A cylindrical rotor is smooth, solid, and has field windings placed in slots. It has a small diameter and large axial length, which makes it mechanically strong at high speed. It is used in turbo-alternators driven by steam or gas turbines. These machines usually have two or four poles and operate at high speeds.

A salient-pole rotor has projecting poles with concentrated field windings. It has a large diameter and short axial length. This construction is suitable for low and medium speeds, especially for hydro-generators and diesel-engine-driven alternators. Because the rotor has projecting poles, the air gap is non-uniform.

The reactance behavior is also different:

$$
\begin{aligned}
X_d &\neq X_q \quad \text{for salient-pole machines},\\
X_d &\approx X_q \quad \text{for cylindrical-rotor machines}.
\end{aligned}
$$

In a salient-pole machine, the direct-axis reluctance is lower than the quadrature-axis reluctance, so $X_d$ is usually greater than $X_q$. This makes two-reaction theory necessary. In a cylindrical-rotor machine, the air gap is nearly uniform, so a single synchronous reactance is usually sufficient.

![Synchronous machine construction](https://www.electricaltechnology.org/wp-content/uploads/2022/08/Construction-of-Synchronous-Motor-1024x513.png)
*Figure: Cutaway view comparing salient-pole and cylindrical-pole synchronous machine construction. Source: [ElectricalTechnology](https://www.electricaltechnology.org/2022/09/synchronous-motor.html).*

> **Final takeaway:** Cylindrical rotors are used for high-speed turbo-alternators, while salient-pole rotors are used for low-speed hydro and engine-driven alternators.

---

### Theory Question 48

**Question:** Explain how damper windings improve starting and suppress hunting in synchronous machines.

**Tags:** damper winding, starting, hunting

Damper windings are copper or aluminium bars embedded in the pole faces of a synchronous machine and short-circuited at both ends by end rings. Their action is similar to the squirrel-cage rotor of an induction motor whenever there is relative motion between rotor and rotating stator field.

During starting of a synchronous motor, the rotor is not yet locked with the stator field. The rotating stator flux cuts the damper bars and induces currents in them. These currents produce induction-motor torque, accelerating the rotor close to synchronous speed. Then DC field excitation is applied and the rotor pulls into synchronism.

During hunting, the rotor oscillates about its steady load angle. This oscillation creates relative speed between the rotor pole face and the stator rotating field. The damper bars again have induced currents, and by Lenz's law these currents oppose the relative motion. Therefore, they produce damping torque.

The damping action can be described qualitatively as:

$$
\begin{aligned}
T_{\text{damper}} &\propto -\omega_{\text{relative}}.
\end{aligned}
$$

The negative sign means the torque opposes the oscillation. This reduces rotor-angle swings and helps the machine settle quickly after disturbances.

Damper windings also reduce voltage waveform distortion and improve stability under sudden load changes. However, they are not a substitute for proper excitation and governor control.

> **Final takeaway:** Damper windings provide induction-motor starting torque and damping torque during hunting, improving both starting and dynamic stability.

---
