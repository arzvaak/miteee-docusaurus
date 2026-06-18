---
sidebar_position: 7.5
title: "Week 7: Induction Motor — Equivalent Circuit and Torque-Slip Characteristics"
---

# Week 7: Induction Motor — Equivalent Circuit and Torque-Slip Characteristics

## Practice Questions

---

## Previous Year Questions

### Q1. S18-6A: Sketch and explain the torque-slip characteristics of a 3 phase slip ring induction motor for different values of rotor resistance.

**Answer:**

The torque-slip characteristic of a three-phase induction motor shows the relationship between electromagnetic torque developed and slip (or rotor speed). For a slip-ring (wound rotor) induction motor, external resistors can be inserted into the rotor circuit via slip rings and brushes, allowing control of the rotor resistance.

**Key observations from the torque-slip characteristics:**

1. **Starting torque ($T_{st}$):** At $s = 1$ (standstill), the starting torque increases as rotor resistance increases, up to a maximum point. Beyond this, further increase in resistance reduces starting torque.

2. **Maximum torque ($T_{max}$):** The magnitude of maximum torque remains **constant** regardless of rotor resistance. This is because:
   $$
   T_{max} = \frac{3}{\omega_s} \cdot \frac{V_{th}^2}{2\left[R_{th} + \sqrt{R_{th}^2 + (X_{th} + X_2')^2}\right]}
   $$
   Note that $R_2'$ does not appear in the expression for $T_{max}$.

3. **Slip at maximum torque ($s_{max}$):** The slip at which maximum torque occurs is directly proportional to rotor resistance:
   $$
   s_{max} = \frac{R_2'}{\sqrt{R_{th}^2 + (X_{th} + X_2')^2}}
   $$
   As $R_2'$ increases, $s_{max}$ shifts to higher slip values (closer to $s = 1$).

4. **Operating region:** The stable operating region is from $s = 0$ to $s = s_{max}$. For a given load torque, increasing rotor resistance increases the slip (reduces speed) at which the motor operates.

**Practical significance:** By inserting external resistance during starting, we can:
- Increase starting torque (up to $T_{max}$ at $s = 1$)
- Reduce starting current (since torque per ampere improves)
- After starting, short-circuit the external resistors for normal operation

---

### Q2. S19-2A: Sketch the complete torque-slip characteristics of induction motor explaining the modes of operation.

**Answer:**

The complete torque-slip characteristic of an induction motor covers three distinct modes of operation based on slip range:

**Mode 1: Motoring Mode ($0 < s \leq 1$)**
- The rotor rotates in the same direction as the rotating magnetic field but at a slower speed
- Slip: $0 < s \leq 1$ (where $s = 1$ at standstill, $s = 0$ at synchronous speed)
- Torque is positive (driving the load)
- Power flow: Electrical power input → Mechanical power output
- The motor develops torque from standstill ($s = 1$) up to synchronous speed ($s = 0$)
- Maximum torque occurs at $s = s_{max}$ (typically $0.1$ to $0.3$ for normal motors)

**Mode 2: Generating Mode ($s < 0$)**
- The rotor is driven above synchronous speed (by a prime mover)
- Slip is negative: $s < 0$
- Torque is negative (opposing the rotation — braking torque)
- Power flow: Mechanical power input → Electrical power output
- The machine acts as an induction generator
- Requires reactive power from the grid or capacitors for excitation

**Mode 3: Braking Mode ($s > 1$)**
- The rotor rotates in the opposite direction to the rotating magnetic field (plugging)
- Slip: $s > 1$ (if rotor rotates opposite to field, $s = 1 + \frac{N_r}{N_s} > 1$)
- Torque is negative (braking torque)
- Power flow: Both electrical and mechanical power are dissipated as heat in the rotor
- Used for quick stopping of motors (plugging)

**Key points on the characteristic:**
- At $s = 0$: $T = 0$ (synchronous speed, no induced rotor current)
- At $s = 1$: Starting torque $T_{st}$
- At $s = s_{max}$: Maximum torque $T_{max}$
- The stable operating region for motoring is $0 < s < s_{max}$
- The unstable region is $s_{max} < s < 1$ (torque decreases as speed decreases)

---

### Q3. S25-5A: Draw and explain the torque-slip characteristic of a 3-phase induction motor. Also explain the effect of rotor resistance on torque slip characteristics.

**Answer:**

**Torque-Slip Characteristic:**

The torque developed by a three-phase induction motor is given by:

$$
T = \frac{3}{\omega_s} \cdot \frac{V_{th}^2 R_2'/s}{\left(R_{th} + \frac{R_2'}{s}\right)^2 + (X_{th} + X_2')^2}
$$

where:
- $V_{th}$ = Thevenin equivalent voltage
- $R_{th}, X_{th}$ = Thevenin equivalent resistance and reactance
- $R_2', X_2'$ = Rotor resistance and reactance referred to stator
- $s$ = slip
- $\omega_s$ = synchronous speed in rad/s

**Effect of Rotor Resistance:**

1. **Starting torque ($T_{st}$):**
   - For low rotor resistance: $T_{st}$ is small
   - As $R_2'$ increases, $T_{st}$ increases until $s_{max} = 1$
   - The condition for maximum starting torque: $R_2' = \sqrt{R_{th}^2 + (X_{th} + X_2')^2}$
   - Beyond this, further increase in $R_2'$ reduces $T_{st}$

2. **Maximum torque ($T_{max}$):**
   - Remains **constant** regardless of $R_2'$
   - $T_{max} = \frac{3}{\omega_s} \cdot \frac{V_{th}^2}{2\left[R_{th} + \sqrt{R_{th}^2 + (X_{th} + X_2')^2}\right]}$

3. **Slip at maximum torque ($s_{max}$):**
   - $s_{max} = \frac{R_2'}{\sqrt{R_{th}^2 + (X_{th} + X_2')^2}}$
   - Directly proportional to $R_2'$

4. **Operating slip for a given load:**
   - For a constant load torque, increasing $R_2'$ increases the operating slip (reduces speed)
   - This is the principle behind rotor resistance speed control

**Practical application in slip-ring motors:**
- External resistors are inserted during starting to increase starting torque
- Resistors are gradually cut out as the motor accelerates
- For speed control, varying rotor resistance changes the speed-torque characteristic

---

### Q4. S20-4B: Draw the torque slip characteristics of a squirrel cage induction motor and mark the salient points.

**Answer:**

The torque-slip characteristic of a squirrel cage induction motor has the following salient points:

1. **Synchronous speed point ($s = 0$, $T = 0$):** At synchronous speed, there is no relative motion between the stator field and rotor, hence no induced rotor current and zero torque.

2. **Maximum torque point ($s = s_{max}$, $T = T_{max}$):** This is the pull-out torque. For a squirrel cage motor, $s_{max}$ is typically $0.1$ to $0.3$. The motor cannot operate stably beyond this point.

3. **Starting torque point ($s = 1$, $T = T_{st}$):** Torque at standstill. For a standard squirrel cage motor, $T_{st}$ is typically $1.5$ to $2.5$ times full-load torque.

4. **Full-load operating point ($s = s_{fl}$, $T = T_{fl}$):** The normal operating point. For standard motors, $s_{fl}$ is $2\%$ to $5\%$.

5. **Stable region:** From $s = 0$ to $s = s_{max}$, the torque-speed characteristic has a negative slope ($\frac{dT}{ds} < 0$), making it stable.

6. **Unstable region:** From $s = s_{max}$ to $s = 1$, the characteristic has a positive slope, making operation unstable.

**Characteristics of squirrel cage motor:**
- Fixed rotor resistance (cannot be changed externally)
- Starting torque is typically lower than maximum torque
- Starting current is high ($5$ to $7$ times full-load current)
- Simple and robust construction

---

### Q5. S18-6C: The ratio V/f should be maintained constant during speed control of a 3 phase induction motor. Give reasons.

**Answer:**

Maintaining a constant $V/f$ ratio during variable frequency speed control of an induction motor is essential for the following reasons:

**1. Maintaining constant air-gap flux:**

The induced EMF in the stator is given by:
$$
E \propto \phi f
$$
where $\phi$ is the air-gap flux per pole.

If $V/f$ is kept constant, then approximately $E/f$ is constant, which means the flux $\phi$ remains constant.

**2. Avoiding magnetic saturation:**

If frequency is reduced without reducing voltage (i.e., $V$ constant, $f$ decreased):
- $V/f$ increases → flux increases
- This leads to magnetic saturation of the core
- Saturation causes excessive magnetizing current, core heating, and distorted flux waveforms

**3. Maintaining torque capability:**

The torque developed by the motor is:
$$
T = k \phi I_2 \cos\phi_2
$$
where $I_2$ is the rotor current and $\cos\phi_2$ is the rotor power factor.

If flux is maintained constant, the motor can develop rated torque at any speed (within the constant torque region).

**4. Avoiding under-fluxing:**

If frequency is increased without increasing voltage (i.e., $V$ constant, $f$ increased):
- $V/f$ decreases → flux decreases
- Reduced flux means reduced torque capability
- The motor cannot deliver rated torque

**5. Constant torque region:**

With constant $V/f$ control, the motor operates in the **constant torque region** from zero speed up to base speed (rated frequency). The torque capability remains constant.

**Limitation:** At very low frequencies, the stator resistance drop becomes significant compared to the applied voltage. To compensate, a voltage boost is added at low frequencies.

---

### Q6. S21-4C: Give a technical explanation of crawling in induction motors.

**Answer:**

**Crawling** is a phenomenon in induction motors where the motor operates at a speed much lower than its rated speed, typically around $\frac{1}{7}$ of synchronous speed.

**Technical Explanation:**

1. **Harmonics in the air-gap MMF:**
   - The stator winding produces a non-sinusoidal MMF distribution in the air gap
   - This MMF contains fundamental and harmonic components
   - The significant harmonics are of order $6k \pm 1$ (i.e., 5th, 7th, 11th, 13th, etc.)

2. **Harmonic synchronous speeds:**
   - The 5th harmonic rotates in the **opposite** direction at $\frac{N_s}{5}$ speed
   - The 7th harmonic rotates in the **same** direction at $\frac{N_s}{7}$ speed
   - The 11th harmonic rotates opposite at $\frac{N_s}{11}$ speed
   - The 13th harmonic rotates same at $\frac{N_s}{13}$ speed

3. **Crawling mechanism:**
   - When the motor accelerates, it may encounter the torque produced by a harmonic
   - The 7th harmonic produces a small torque peak at approximately $\frac{6}{7}N_s$ (i.e., slip $s = \frac{1}{7}$)
   - If the load torque is low, the motor may "lock into" this harmonic torque and run at about $\frac{6}{7}$ of synchronous speed
   - This is called **crawling** because the motor "crawls" at a low speed

4. **Why it occurs:**
   - Poor winding design with significant harmonic content
   - Motors with integral slot windings are more susceptible
   - Light load conditions make crawling more likely

5. **Remedies:**
   - Use **short-pitched windings** to reduce harmonics
   - Use **skewed rotor slots** to reduce harmonic coupling
   - Increase the number of stator slots per pole
   - Use fractional slot windings

---

### Q7. S28-6B: Explain the phenomena of crawling and cogging in a 3 phase induction motor.

**Answer:**

**Crawling:**

As explained in Q6, crawling is the tendency of an induction motor to run at a sub-synchronous speed (typically $\frac{1}{7}$ of synchronous speed) due to harmonic torques.

**Additional details:**
- The 7th space harmonic produces a forward-rotating field at $\frac{N_s}{7}$
- At a rotor speed of $\frac{6}{7}N_s$, the slip with respect to the 7th harmonic is:
  $$
  s_7 = \frac{N_{s7} - N_r}{N_{s7}} = \frac{N_s/7 - 6N_s/7}{N_s/7} = -5
  $$
  This negative slip means the 7th harmonic produces generating torque, but the net effect can create a torque dip or peak
- The motor may get "stuck" at this speed if the load torque is low

**Cogging (Magnetic Locking):**

Cogging is a phenomenon where the rotor refuses to start or runs at very low speed due to magnetic locking between stator and rotor teeth.

**Technical explanation:**

1. **Cause:** When the number of stator slots ($S_s$) and rotor slots ($S_r$) have a common factor, the reluctance of the magnetic circuit varies periodically as the rotor rotates.

2. **Mechanism:**
   - At certain rotor positions, the stator and rotor teeth align, creating a low-reluctance path
   - At other positions, teeth and slots align, creating a high-reluctance path
   - This variation in reluctance produces a **cogging torque** that opposes rotation
   - If the cogging torque exceeds the starting torque, the motor cannot start

3. **Conditions for cogging:**
   - $S_s = S_r$ (worst case)
   - $S_s - S_r = \pm 2p$ (where $p$ = number of pole pairs)
   - $S_s - S_r = \pm p$
   - Generally, when $S_s$ and $S_r$ have a common factor

4. **Remedies:**
   - Choose $S_s$ and $S_r$ such that they have no common factor
   - Use **skewed rotor slots** (typically by one stator slot pitch)
   - Use fractional slot windings
   - Ensure $S_r \neq S_s$ and $S_r \neq S_s \pm 2p$

**Difference between crawling and cogging:**
| Feature | Crawling | Cogging |
|---------|----------|---------|
| Cause | Space harmonics in MMF | Slot harmonics due to teeth alignment |
| Effect | Runs at sub-synchronous speed | Refuses to start or runs very slowly |
| Speed | About $\frac{6}{7}N_s$ | Near zero speed |
| Remedy | Short-pitched windings, skewing | Proper slot combination, skewing |

---

### Q8. S17-4B: Draw and explain the equivalent circuit of a double cage induction motor and sketch the inner, outer and net torque slip characteristics.

**Answer:**

**Double Cage Induction Motor Construction:**
A double cage rotor has two independent cages:
- **Outer cage:** High resistance (made of brass or bronze), low inductance (small cross-section, near the surface)
- **Inner cage:** Low resistance (copper), high inductance (deep in the rotor, surrounded by iron)

**Equivalent Circuit:**

The equivalent circuit of a double cage induction motor has two parallel rotor branches:

- Branch 1 (Outer cage): $R_{2o}' + j s X_{2o}'$ (high $R$, low $X$)
- Branch 2 (Inner cage): $R_{2i}' + j s X_{2i}'$ (low $R$, high $X$)

The rotor impedance per phase referred to stator:
$$
Z_2' = \frac{(R_{2o}'/s + jX_{2o}')(R_{2i}'/s + jX_{2i}')}{(R_{2o}'/s + jX_{2o}') + (R_{2i}'/s + jX_{2i}')}
$$

**Torque-Slip Characteristics:**

1. **Outer cage torque ($T_o$):**
   - High resistance → high starting torque at $s = 1$
   - Maximum torque occurs at high slip ($s_{max}$ close to 1)
   - At low slip (near synchronous speed), torque is low due to high resistance

2. **Inner cage torque ($T_i$):**
   - Low resistance → low starting torque at $s = 1$
   - Maximum torque occurs at low slip ($s_{max}$ close to 0)
   - At low slip, torque is high due to low resistance

3. **Net torque ($T_{net} = T_o + T_i$):**
   - At starting ($s = 1$): Outer cage dominates → high starting torque
   - At low slip ($s \approx 0$): Inner cage dominates → good running efficiency
   - The combined characteristic gives:
     - High starting torque (like a high-resistance rotor)
     - Low running slip (like a low-resistance rotor)
     - Low starting current

**Advantages over single cage:**
- Better starting torque without compromising running efficiency
- Lower starting current
- Smooth acceleration

---

## Numerical Problems

### N1. S16-5B: The standstill rotor voltage of a 3 phase induction motor is 190V per phase. The motor is running with a slip of 4% and the load torque is proportional to square of the speed. What must be the rotor injected voltage to run the motor with slip of 0.6. The rotor resistance per phase is 0.5 $\Omega$.

**Solution:**

**Given:**
- Standstill rotor voltage per phase, $E_{20} = 190$ V
- Initial slip, $s_1 = 0.04$ (4%)
- Rotor resistance per phase, $R_2 = 0.5$ $\Omega$
- Load torque $T_L \propto N^2$ (proportional to square of speed)
- Target slip, $s_2 = 0.6$

**Step 1: Understand the rotor injected voltage method**

In the rotor EMF injection method, an external voltage $V_{inj}$ is injected into the rotor circuit. The rotor current is:
$$
I_2 = \frac{sE_{20} + V_{inj}}{R_2 + jsX_2}
$$

For simplicity, assuming the rotor reactance is negligible compared to resistance (low slip operation), or considering only the magnitude:

The torque developed is proportional to:
$$
T \propto \frac{sE_{20} + V_{inj}}{R_2} \cdot \phi
$$

**Step 2: Relate torque to speed**

Given $T_L \propto N^2$, and $N = N_s(1-s)$:
$$
T_L \propto [N_s(1-s)]^2
$$

**Step 3: For the initial condition ($s_1 = 0.04$, no injected voltage)**

At $s_1 = 0.04$:
- Speed $N_1 = N_s(1-0.04) = 0.96 N_s$
- Torque $T_1 \propto (0.96 N_s)^2 = 0.9216 N_s^2$

The motor torque equals load torque:
$$
T_1 \propto \frac{s_1 E_{20}}{R_2} \propto \frac{0.04 \times 190}{0.5} \propto 15.2
$$

**Step 4: For the target condition ($s_2 = 0.6$, with injected voltage)**

At $s_2 = 0.6$:
- Speed $N_2 = N_s(1-0.6) = 0.4 N_s$
- Torque $T_2 \propto (0.4 N_s)^2 = 0.16 N_s^2$

**Step 5: Ratio of torques**

$$
\frac{T_2}{T_1} = \frac{0.16}{0.9216} = 0.1736
$$

**Step 6: Torque with injected voltage**

The torque with injected voltage $V_{inj}$ (assuming same phase as rotor induced EMF for motoring):
$$
T_2 \propto \frac{s_2 E_{20} + V_{inj}}{R_2}
$$

Therefore:
$$
\frac{T_2}{T_1} = \frac{s_2 E_{20} + V_{inj}}{s_1 E_{20}}
$$

$$
0.1736 = \frac{0.6 \times 190 + V_{inj}}{0.04 \times 190}
$$

$$
0.1736 = \frac{114 + V_{inj}}{7.6}
$$

$$
114 + V_{inj} = 0.1736 \times 7.6 = 1.319
$$

$$
V_{inj} = 1.319 - 114 = -112.68 \text{ V}
$$

**Answer:** The injected voltage must be approximately **112.68 V** in the **opposite phase** (negative sign indicates the injected voltage opposes the induced EMF) to run the motor at slip of 0.6.

---

### N2. S19-4B: Consider a 415V, 4pole, 50Hz induction motor operating at 4% slip. The shaft power output is 1.2 kW. The machine has stator losses of 50W and rotational losses of 70W. Draw the power flow diagram with power stages.

**Solution:**

**Given:**
- Supply voltage: 415 V (line-to-line), 3-phase
- Number of poles: $P = 4$
- Frequency: $f = 50$ Hz
- Slip: $s = 0.04$ (4%)
- Shaft power output: $P_{out} = 1.2$ kW = 1200 W
- Stator losses: $P_{stator} = 50$ W
- Rotational losses (friction + windage + core): $P_{rot} = 70$ W

**Step 1: Synchronous speed**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500 \text{ rpm}
$$

**Step 2: Rotor speed**
$$
N_r = N_s(1-s) = 1500(1-0.04) = 1440 \text{ rpm}
$$

**Step 3: Power flow analysis (working backwards from output)**

**Stage 1: Shaft output power**
$P_{out} = 1200$ W

**Stage 2: Rotational losses**
$P_{rot} = 70$ W

**Stage 3: Mechanical power developed (air gap power minus rotor losses)**
$P_{mech} = P_{out} + P_{rot} = 1200 + 70 = 1270$ W

**Stage 4: Rotor copper loss**
For an induction motor:
$$
P_{mech} = (1-s)P_{ag}
$$
$$
P_{rcl} = sP_{ag}
$$

Therefore:
$$
P_{ag} = \frac{P_{mech}}{1-s} = \frac{1270}{1-0.04} = \frac{1270}{0.96} = 1322.92 \text{ W}
$$

$$
P_{rcl} = sP_{ag} = 0.04 \times 1322.92 = 52.92 \text{ W}
$$

**Stage 5: Stator losses**
$P_{stator} = 50$ W

**Stage 6: Input power**
$P_{in} = P_{ag} + P_{stator} = 1322.92 + 50 = 1372.92$ W

**Power Flow Diagram:**

```
                    P_stator = 50W        P_rcl = 52.92W      P_rot = 70W
                        ↓                     ↓                   ↓
  P_in = 1372.92W ──→ [Stator] ──→ P_ag = 1322.92W ──→ P_mech = 1270W ──→ P_out = 1200W
                        ↑                     ↑                   ↑
                   Electrical            Air-gap            Mechanical
                   Input                 Power              Power
```

**Stage efficiencies:**
- Stator efficiency: $\eta_s = \frac{P_{ag}}{P_{in}} = \frac{1322.92}{1372.92} = 0.9636$ (96.36%)
- Rotor efficiency: $\eta_r = \frac{P_{mech}}{P_{ag}} = 1-s = 0.96$ (96%)
- Mechanical efficiency: $\eta_m = \frac{P_{out}}{P_{mech}} = \frac{1200}{1270} = 0.9449$ (94.49%)
- Overall efficiency: $\eta = \frac{P_{out}}{P_{in}} = \frac{1200}{1372.92} = 0.8741$ (87.41%)

**Answer:** The power flow diagram shows $P_{in} = 1372.92$ W, $P_{ag} = 1322.92$ W, $P_{mech} = 1270$ W, and $P_{out} = 1200$ W.

---

### N3. A 3-phase, 400V, 50Hz, 6-pole induction motor has a rotor resistance of 0.1 $\Omega$ per phase and standstill rotor reactance of 0.5 $\Omega$ per phase. The rotor is star-connected. Calculate:
(i) The slip at maximum torque
(ii) The ratio of maximum torque to starting torque
(iii) The speed at maximum torque

**Solution:**

**Given:**
- Line voltage: $V_L = 400$ V (assume star-connected stator)
- Frequency: $f = 50$ Hz
- Number of poles: $P = 6$
- Rotor resistance per phase: $R_2 = 0.1$ $\Omega$
- Standstill rotor reactance per phase: $X_2 = 0.5$ $\Omega$

**Step 1: Synchronous speed**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}
$$

**Step 2: Slip at maximum torque**
For a simplified equivalent circuit (neglecting stator impedance):
$$
s_{max} = \frac{R_2}{X_2} = \frac{0.1}{0.5} = 0.2
$$

**Step 3: Starting torque**
Using the simplified torque equation:
$$
T_{st} \propto \frac{R_2}{R_2^2 + X_2^2} = \frac{0.1}{0.1^2 + 0.5^2} = \frac{0.1}{0.01 + 0.25} = \frac{0.1}{0.26} = 0.3846
$$

**Step 4: Maximum torque**
$$
T_{max} \propto \frac{1}{2X_2} = \frac{1}{2 \times 0.5} = 1.0
$$

**Step 5: Ratio of maximum torque to starting torque**
$$
\frac{T_{max}}{T_{st}} = \frac{1.0}{0.3846} = 2.6
$$

**Step 6: Speed at maximum torque**
$$
N_{max} = N_s(1-s_{max}) = 1000(1-0.2) = 800 \text{ rpm}
$$

**Answer:**
(i) Slip at maximum torque: $s_{max} = 0.2$ (20%)
(ii) Ratio $T_{max}/T_{st} = 2.6$
(iii) Speed at maximum torque: $N = 800$ rpm

---

### N4. A 3-phase, 440V, 50Hz, 4-pole induction motor has the following equivalent circuit parameters referred to stator:
$R_1 = 0.5$ $\Omega$, $X_1 = 1.0$ $\Omega$, $R_2' = 0.4$ $\Omega$, $X_2' = 1.2$ $\Omega$, $X_m = 40$ $\Omega$
The motor is operating at 4% slip. Calculate:
(i) Stator current
(ii) Power factor
(iii) Developed torque
(iv) Output power if rotational losses are 200W

**Solution:**

**Given:**
- Line voltage: $V_L = 440$ V (star-connected)
- Phase voltage: $V_{ph} = \frac{440}{\sqrt{3}} = 254.03$ V
- $R_1 = 0.5$ $\Omega$, $X_1 = 1.0$ $\Omega$
- $R_2' = 0.4$ $\Omega$, $X_2' = 1.2$ $\Omega$
- $X_m = 40$ $\Omega$
- Slip: $s = 0.04$

**Step 1: Thevenin equivalent circuit**

Thevenin voltage:
$$
V_{th} = V_{ph} \times \frac{X_m}{\sqrt{R_1^2 + (X_1 + X_m)^2}}
$$

$$
V_{th} = 254.03 \times \frac{40}{\sqrt{0.5^2 + (1.0 + 40)^2}} = 254.03 \times \frac{40}{\sqrt{0.25 + 1681}} = 254.03 \times \frac{40}{\sqrt{1681.25}}
$$

$$
V_{th} = 254.03 \times \frac{40}{41.00} = 254.03 \times 0.9756 = 247.83 \text{ V}
$$

Thevenin impedance:
$$
Z_{th} = R_{th} + jX_{th} = \frac{jX_m(R_1 + jX_1)}{R_1 + j(X_1 + X_m)}
$$

$$
Z_{th} = \frac{j40(0.5 + j1.0)}{0.5 + j41.0}
$$

Numerator: $j40(0.5 + j1.0) = j20 + j^2 40 = j20 - 40 = -40 + j20$

Denominator: $0.5 + j41.0$

$$
Z_{th} = \frac{-40 + j20}{0.5 + j41.0}
$$

Multiply numerator and denominator by conjugate:
$$
Z_{th} = \frac{(-40 + j20)(0.5 - j41.0)}{0.5^2 + 41.0^2} = \frac{(-40 + j20)(0.5 - j41.0)}{1681.25}
$$

Numerator:
$(-40)(0.5) + (-40)(-j41.0) + (j20)(0.5) + (j20)(-j41.0)$
$= -20 + j1640 + j10 - j^2 820$
$= -20 + j1650 + 820$
$= 800 + j1650$

$$
Z_{th} = \frac{800 + j1650}{1681.25} = 0.476 + j0.981 \text{ }\Omega
$$

Therefore:
$R_{th} = 0.476$ $\Omega$, $X_{th} = 0.981$ $\Omega$

**Step 2: Rotor branch impedance at slip $s = 0.04$**

$$
\frac{R_2'}{s} = \frac{0.4}{0.04} = 10.0 \text{ }\Omega
$$

Rotor branch impedance: $Z_2' = \frac{R_2'}{s} + jX_2' = 10.0 + j1.2$ $\Omega$

**Step 3: Total impedance per phase**

$$
Z_{total} = (R_{th} + \frac{R_2'}{s}) + j(X_{th} + X_2') = (0.476 + 10.0) + j(0.981 + 1.2)
$$

$$
Z_{total} = 10.476 + j2.181 \text{ }\Omega
$$

Magnitude: $|Z_{total}| = \sqrt{10.476^2 + 2.181^2} = \sqrt{109.75 + 4.76} = \sqrt{114.51} = 10.70$ $\Omega$

**Step 4: Stator current (rotor branch current)**

$$
I_2' = \frac{V_{th}}{|Z_{total}|} = \frac{247.83}{10.70} = 23.16 \text{ A}
$$

**Step 5: Power factor**

$$
\cos\phi = \frac{R_{total}}{|Z_{total}|} = \frac{10.476}{10.70} = 0.979 \text{ (lagging)}
$$

**Step 6: Developed torque**

$$
T_d = \frac{3}{\omega_s} \cdot \frac{V_{th}^2 (R_2'/s)}{(R_{th} + R_2'/s)^2 + (X_{th} + X_2')^2}
$$

$$
\omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 1500}{60} = 157.08 \text{ rad/s}
$$

$$
T_d = \frac{3}{157.08} \times \frac{247.83^2 \times 10.0}{10.476^2 + 2.181^2}
$$

$$
T_d = 0.0191 \times \frac{61419.9 \times 10.0}{109.75 + 4.76}
$$

$$
T_d = 0.0191 \times \frac{614199}{114.51} = 0.0191 \times 5363.5 = 102.44 \text{ N·m}
$$

**Step 7: Output power**

Mechanical power developed:
$$
P_{mech} = T_d \times \omega_r = T_d \times \omega_s(1-s) = 102.44 \times 157.08 \times 0.96
$$

$$
P_{mech} = 102.44 \times 150.80 = 15448 \text{ W}
$$

Output power:
$$
P_{out} = P_{mech} - P_{rot} = 15448 - 200 = 15248 \text{ W} = 15.25 \text{ kW}
$$

**Answer:**
(i) Stator current: $I_2' = 23.16$ A
(ii) Power factor: $\cos\phi = 0.979$ (lagging)
(iii) Developed torque: $T_d = 102.44$ N·m
(iv) Output power: $P_{out} = 15.25$ kW

---

## Quick Quiz

### Q1. What is the condition for maximum torque in an induction motor?

**Answer:** Maximum torque occurs when the rotor resistance referred to stator equals the magnitude of the Thevenin impedance:
$$
\frac{R_2'}{s_{max}} = \sqrt{R_{th}^2 + (X_{th} + X_2')^2}
$$
Or in simplified form: $s_{max} = \frac{R_2}{X_2}$ (neglecting stator impedance).

---

### Q2. How does increasing rotor resistance affect the starting torque and maximum torque of an induction motor?

**Answer:** Increasing rotor resistance:
- **Starting torque:** Increases up to a maximum (when $s_{max} = 1$), then decreases
- **Maximum torque:** Remains constant (independent of rotor resistance)
- **Slip at maximum torque:** Increases (shifts to higher slip values)

---

### Q3. What is the significance of the $V/f$ ratio in variable frequency speed control?

**Answer:** Maintaining constant $V/f$ ratio ensures constant air-gap flux in the motor. This:
- Prevents magnetic saturation at low frequencies
- Maintains constant torque capability across the speed range
- Avoids under-fluxing at high frequencies
- Provides optimal motor performance

---

### Q4. What is the difference between crawling and cogging in induction motors?

**Answer:**
- **Crawling:** Motor runs at about $\frac{1}{7}$ of synchronous speed due to harmonic torques (7th harmonic)
- **Cogging:** Motor refuses to start or runs very slowly due to magnetic locking between stator and rotor teeth (slot harmonics)

---

### Q5. In a double cage induction motor, which cage provides high starting torque and which provides good running efficiency?

**Answer:**
- **Outer cage** (high resistance, low inductance): Provides high starting torque
- **Inner cage** (low resistance, high inductance): Provides good running efficiency with low slip

The combined effect gives high starting torque and good running performance.