---
sidebar_position: 9.5
title: "Week 9: Practice Questions"
---

# Week 9: Practice Questions

## Previous Year Questions

### Q1. S02-2C | A three-phase squirrel cage induction motor is required to be used as a three-phase generator. Explain how this can be achieved. Draw and explain the torque-slip characteristics for the entire operation indicating salient points.

**Answer:**

An induction machine can operate as a generator when its rotor is driven above synchronous speed by a prime mover, while the stator is connected to a supply (or a capacitor bank for self-excitation).

**Principle of Operation:**
- When the rotor speed $N_r$ exceeds synchronous speed $N_s$, the slip becomes negative:
  $$s = \frac{N_s - N_r}{N_s} < 0$$
- With negative slip, the rotor conductors cut the rotating magnetic field in the opposite direction, inducing rotor EMF and current in the reverse direction
- The rotor current now produces torque in the opposite direction — the machine acts as a generator, converting mechanical power to electrical power
- For grid-connected operation, the stator must be connected to a 3-phase supply to provide the magnetizing current (reactive power)
- For stand-alone operation, capacitor banks are needed to supply the reactive power for excitation

**Torque-Slip Characteristics:**

The complete torque-slip characteristic spans three regions:

1. **Motoring region** ($0 < s < 1$): Torque is positive, rotor speed is below synchronous speed
2. **Generating region** ($s < 0$): Torque is negative (braking torque), rotor speed exceeds synchronous speed
3. **Plugging region** ($s > 1$): Torque is positive but rotor rotates opposite to the field

Key points on the characteristic:
- **Starting torque** at $s = 1$
- **Maximum torque** (pull-out torque) at slip $s_m = \frac{R_2}{X_2}$
- **Synchronous speed** at $s = 0$ (zero torque in motoring mode)
- **No-load generating point** at $s = 0$ (zero torque in generating mode)

---

### Q2. S09-3A | 03 marks | Explain how the double cage induction motor is able to develop better starting torque compared with the conventional squirrel-cage induction motor.

**Answer:**

A double cage induction motor has two separate rotor cages:
- **Outer cage**: High resistance, low inductance (small slots near the surface)
- **Inner cage**: Low resistance, high inductance (deep slots)

**Working Principle:**

At starting ($s = 1$, high rotor frequency $f_r = sf = 50$ Hz):
- The reactance of both cages is significant: $X = 2\pi f_r L$
- The inner cage has high inductance, so its impedance is dominated by reactance
- The outer cage has low inductance, so its impedance is dominated by resistance
- **Result**: Most of the rotor current flows through the outer (high resistance) cage
- High rotor resistance → High starting torque (as $T_{start} \propto \frac{R_2}{R_2^2 + X_2^2}$)

At running ($s \approx 0.03$, low rotor frequency $f_r \approx 1.5$ Hz):
- Reactance of both cages becomes negligible ($X \propto f_r$)
- Current distributes based on resistance
- The inner (low resistance) cage carries most of the current
- **Result**: Low rotor resistance → High efficiency and good running performance

**Comparison with conventional squirrel cage:**
- Conventional motor: Fixed rotor resistance — compromise between starting torque and running efficiency
- Double cage motor: **Skin effect** automatically varies effective resistance — high at start, low at running
- Starting torque: 200-250% of full-load torque (vs 100-150% for conventional)
- Starting current: Lower than conventional for same torque

---

### Q3. S17-3A | 03 marks | Explain the principle of rotor emf injection method of controlling speed of slip ring induction motor.

**Answer:**

The rotor EMF injection method (also called **slip power recovery** or **Kramer drive**) controls the speed of a slip-ring induction motor by injecting a voltage of slip frequency into the rotor circuit.

**Principle:**

In a slip-ring induction motor, the rotor induced EMF at slip $s$ is:
$$E_2 = sE_{20}$$
where $E_{20}$ is the standstill rotor voltage per phase.

If an external voltage $V_{inj}$ of the same frequency (slip frequency) is injected into the rotor circuit, the rotor current becomes:
$$I_2 = \frac{sE_{20} \pm V_{inj}}{\sqrt{R_2^2 + (sX_2)^2}}$$

**Speed Control Mechanism:**

1. **In-phase injection** ($V_{inj}$ in phase with $E_2$):
   - Increases rotor current → Increases torque
   - Motor accelerates to reduce slip until torque balances load
   - **Result**: Speed increases (slip decreases)

2. **Opposite-phase injection** ($V_{inj}$ opposite to $E_2$):
   - Decreases rotor current → Decreases torque
   - Motor decelerates until torque balances load
   - **Result**: Speed decreases (slip increases)

**Practical Implementation:**
- The injected voltage must be at slip frequency ($f_r = sf$)
- A **slip-ring induction motor** with a **rotor-side converter** (diode bridge + inverter) is used
- The slip power is either returned to the supply (static Kramer drive) or fed to another motor (static Scherbius drive)

**Advantages:**
- Smooth speed control over a wide range (typically 50-100% of synchronous speed)
- High efficiency (slip power is recovered, not wasted as heat)
- Suitable for large pumps, fans, and compressors

---

### Q4. S18-6A | Sketch and explain the torque-slip characteristics of a 3 phase slip ring induction motor for different values of rotor resistance.

**Answer:**

For a slip-ring induction motor, external resistance can be added to the rotor circuit through slip rings and brushes. The torque-slip characteristic changes significantly with rotor resistance.

**Torque Equation:**

$$T = \frac{3}{\omega_s} \cdot \frac{sE_2^2 R_2'}{(R_2')^2 + (sX_2')^2}$$

where $R_2'$ is the total rotor resistance per phase (including external resistance) referred to stator.

**Effect of Increasing Rotor Resistance:**

| Parameter | Low $R_2$ | Medium $R_2$ | High $R_2$ |
|-----------|-----------|--------------|------------|
| Starting torque ($s=1$) | Low | Moderate | High (up to maximum) |
| Slip at max torque ($s_m$) | Small | Moderate | Large |
| Maximum torque ($T_{max}$) | Constant | Constant | Constant |
| Operating slip at rated load | Small | Moderate | Large |

**Key Observations:**

1. **Maximum torque remains constant** (independent of rotor resistance):
   $$T_{max} = \frac{3}{2\omega_s} \cdot \frac{E_2^2}{X_2'}$$

2. **Slip at maximum torque increases** with rotor resistance:
   $$s_m = \frac{R_2'}{X_2'}$$

3. **Starting torque** ($s=1$) increases with $R_2'$ until $R_2' = X_2'$, after which it decreases

4. **Speed regulation** worsens with higher resistance (steeper torque-slip curve in operating region)

**Practical Significance:**
- At starting: Add external resistance to increase starting torque and reduce starting current
- For speed control: Vary rotor resistance to change speed (inefficient — power wasted as $I^2R$ losses)
- For speed regulation: Low resistance gives better regulation (flatter characteristic)

---

### Q5. S18-6C | The ratio V/f should be maintained constant during speed control of a 3 phase induction motor. Give reasons.

**Answer:**

The **V/f control** (Volts per Hertz control) is the most common method for variable speed drives. Maintaining constant V/f ratio is essential for the following reasons:

**1. Maintaining Constant Air-Gap Flux:**

The induced EMF in the stator is:
$$E \approx V = 4.44 f \phi N$$

If $V/f$ is constant:
$$\frac{V}{f} = 4.44 \phi N = \text{constant}$$

Therefore, the air-gap flux $\phi$ remains constant regardless of frequency.

**2. Avoiding Magnetic Saturation:**

If $V$ is kept constant while $f$ is reduced (below rated frequency):
- $\phi$ increases ($\phi \propto V/f$)
- The core becomes magnetically saturated
- Saturation causes:
  - Excessive magnetizing current
  - Core heating and losses
  - Distorted current waveform
  - Reduced torque capability

**3. Maintaining Constant Torque Capability:**

The torque developed is:
$$T = k \phi I_2 \cos\phi_2$$

With constant flux $\phi$, the torque is proportional to rotor current $I_2$. For a given current rating, the motor can deliver constant torque at any speed below base speed.

**4. Avoiding Under-Fluxing:**

If $V$ is reduced proportionally more than $f$ (above rated frequency):
- $\phi$ decreases
- Torque capability reduces ($T \propto \phi$)
- Motor cannot develop rated torque

**Operating Regions:**

| Region | Frequency | V/f Strategy | Torque Characteristic |
|--------|-----------|--------------|----------------------|
| Below base speed | $f < f_{rated}$ | Constant V/f | Constant torque |
| Above base speed | $f > f_{rated}$ | Constant V (V/f decreases) | Constant power (field weakening) |

**Conclusion:** Constant V/f control ensures the motor operates at rated flux, delivering rated torque without saturation, making it the standard for variable frequency drives (VFDs).

---

### Q6. S20-4B | 4 marks | Draw the torque slip characteristics of a squirrel cage induction motor and mark the salient points.

**Answer:**

The torque-slip characteristic of a squirrel cage induction motor shows the relationship between electromagnetic torque and slip (or speed).

**Salient Points on the Characteristic:**

1. **Synchronous point** ($s = 0$, $N_r = N_s$):
   - Torque = 0 (no relative motion between rotor and field)
   - Ideal no-load operating point

2. **Rated operating point** ($s = s_{rated} \approx 0.02-0.05$):
   - Normal full-load operation
   - Small slip (2-5% of synchronous speed)
   - Torque equals load torque

3. **Maximum torque point** ($s = s_m$, $T = T_{max}$):
   - Also called **pull-out torque** or **breakdown torque**
   - $s_m = \frac{R_2}{X_2}$ (rotor resistance/reactance ratio)
   - $T_{max} = \frac{3}{2\omega_s} \cdot \frac{V_1^2}{X_2}$ (independent of $R_2$)
   - Typically 200-250% of rated torque

4. **Starting point** ($s = 1$, $N_r = 0$):
   - Starting torque $T_{start}$
   - For squirrel cage motor: typically 100-150% of rated torque
   - Starting current: 5-7 times rated current

5. **Stable operating region** ($0 < s < s_m$):
   - Torque increases as slip increases
   - Motor self-regulates: if load increases, slip increases, torque increases
   - **Stable operation**

6. **Unstable operating region** ($s_m < s < 1$):
   - Torque decreases as slip increases
   - If load exceeds $T_{max}$, motor stalls
   - **Unstable operation**

**Key Formula:**
$$T = \frac{3}{\omega_s} \cdot \frac{sV_1^2 R_2}{(R_2)^2 + (sX_2)^2}$$

---

### Q7. S25-5A | 04 marks | Draw and explain the torque-slip characteristic of a 3-phase induction motor. Also explain the effect of rotor resistance on torque slip characteristics.

**Answer:**

**Torque-Slip Characteristic:**

The torque developed by a 3-phase induction motor is given by:
$$T = \frac{3}{\omega_s} \cdot \frac{sV_1^2 R_2'}{(R_2')^2 + (sX_2')^2}$$

where:
- $\omega_s$ = synchronous speed in rad/s
- $V_1$ = stator voltage per phase
- $R_2'$ = rotor resistance referred to stator
- $X_2'$ = rotor reactance referred to stator at standstill
- $s$ = slip

**Effect of Rotor Resistance:**

1. **Starting torque** ($s = 1$):
   $$T_{start} = \frac{3}{\omega_s} \cdot \frac{V_1^2 R_2'}{(R_2')^2 + (X_2')^2}$$
   - Increases with $R_2'$ until $R_2' = X_2'$ (maximum starting torque)
   - Then decreases with further increase in $R_2'$

2. **Maximum torque** ($T_{max}$):
   $$T_{max} = \frac{3}{2\omega_s} \cdot \frac{V_1^2}{X_2'}$$
   - **Independent of rotor resistance** — remains constant

3. **Slip at maximum torque** ($s_m$):
   $$s_m = \frac{R_2'}{X_2'}$$
   - **Increases linearly** with rotor resistance

4. **Operating slip** at rated load:
   - Increases with rotor resistance (speed decreases)
   - Speed regulation worsens

**Practical Implications:**

| Rotor Resistance | Starting Torque | Running Speed | Efficiency | Application |
|-----------------|-----------------|---------------|------------|-------------|
| Low (squirrel cage) | Low | Near synchronous | High | Fans, pumps |
| Medium | Moderate | Reduced | Moderate | General purpose |
| High (slip-ring with external R) | High | Significantly reduced | Low | High starting torque loads |

**For slip-ring motors:** External resistance can be added during starting for high torque, then gradually removed for efficient running.

---

### Q8. S25-5C | 02 marks | What changes can be made on cage rotor construction to improve the starting torque of a three phase induction motor?

**Answer:**

The following constructional modifications can be made to the cage rotor to improve starting torque:

**1. Deep Bar Rotor:**
- Rotor bars are made deep and narrow (rectangular cross-section)
- **Skin effect**: At starting (high rotor frequency, $f_r = 50$ Hz), current is concentrated near the top of the bar
  - Effective resistance increases → Higher starting torque
- At running (low rotor frequency, $f_r \approx 1.5$ Hz), current distributes uniformly
  - Effective resistance decreases → Good efficiency
- **Result**: High starting torque without compromising running efficiency

**2. Double Cage Rotor:**
- Two separate cages: outer (high resistance) and inner (low resistance)
- **Starting**: Current flows mainly in outer cage → High resistance → High torque
- **Running**: Current flows mainly in inner cage → Low resistance → High efficiency
- **Result**: Starting torque 200-250% of rated torque

**3. High Resistance Rotor Bars:**
- Using materials with higher resistivity (e.g., brass, bronze instead of copper or aluminum)
- **Trade-off**: Higher starting torque but lower running efficiency
- Used only for special applications requiring frequent starting

**Comparison:**

| Construction | Starting Torque | Running Efficiency | Cost |
|-------------|----------------|-------------------|------|
| Standard squirrel cage | 100-150% | High | Low |
| Deep bar | 150-200% | High | Moderate |
| Double cage | 200-250% | High | High |
| High resistance bars | 200-300% | Low | Low |

---

### Q9. S28-5C | 4 marks | Explain the working of a star-delta starter for a 3 phase induction motor.

**Answer:**

A **star-delta starter** is used to reduce the starting current of a 3-phase induction motor by initially connecting the stator windings in star configuration, then switching to delta after the motor reaches sufficient speed.

**Working Principle:**

The starter uses a 3-pole switch (or contactors) to change the winding connection:

**Phase 1: Star Connection (Starting)**
- Stator windings are connected in star (Y)
- Voltage across each phase winding: $V_{ph} = \frac{V_L}{\sqrt{3}}$
- Starting current per phase: $I_{ph(Y)} = \frac{V_L/\sqrt{3}}{Z_{ph}}$
- Line current: $I_{L(Y)} = I_{ph(Y)} = \frac{V_L}{\sqrt{3}Z_{ph}}$

**Phase 2: Delta Connection (Running)**
- After motor reaches about 80% of rated speed, switch changes to delta
- Voltage across each phase winding: $V_{ph} = V_L$
- Starting current per phase: $I_{ph(\Delta)} = \frac{V_L}{Z_{ph}}$
- Line current: $I_{L(\Delta)} = \sqrt{3}I_{ph(\Delta)} = \frac{\sqrt{3}V_L}{Z_{ph}}$

**Comparison:**

| Parameter | Star (Starting) | Delta (Running) | Ratio (Star/Delta) |
|-----------|----------------|-----------------|-------------------|
| Phase voltage | $V_L/\sqrt{3}$ | $V_L$ | $1/\sqrt{3}$ |
| Phase current | $V_L/(\sqrt{3}Z)$ | $V_L/Z$ | $1/\sqrt{3}$ |
| Line current | $V_L/(\sqrt{3}Z)$ | $\sqrt{3}V_L/Z$ | $1/3$ |
| Starting torque | $\propto (V_L/\sqrt{3})^2$ | $\propto V_L^2$ | $1/3$ |

**Key Advantages:**
- Starting current reduced to **1/3** of direct-on-line (DOL) starting
- Starting torque also reduced to **1/3** (acceptable for light-load starting)
- Simple, reliable, and economical

**Limitations:**
- Only applicable for motors designed for delta connection during normal operation
- Torque reduction may be insufficient for high starting torque loads
- Transition from star to delta causes a current surge

**Connection Diagram:**
The starter has six terminals from the stator windings (two per phase). During star connection, terminals $A_2$, $B_2$, $C_2$ are shorted. During delta connection, $A_1$-$B_2$, $B_1$-$C_2$, $C_1$-$A_2$ are connected.

---

### Q10. S28-6B | 6 marks | Explain the phenomena of crawling and cogging in a 3 phase induction motor.

**Answer:**

## Crawling

**Definition:** Crawling is the tendency of an induction motor to run at a speed much lower than its rated speed (typically 1/7th of synchronous speed) instead of accelerating to normal speed.

**Cause:**
- Due to **space harmonics** in the air-gap MMF waveform
- The 7th harmonic (order $h = 7$) produces a rotating field that rotates at $N_s/7$ in the same direction as the fundamental
- At a slip corresponding to 1/7th synchronous speed, the 7th harmonic produces a torque that can lock the motor

**Mechanism:**
1. The stator winding produces not only the fundamental MMF but also harmonic MMFs
2. The 7th harmonic rotates at $N_s/7$ in the forward direction
3. When the rotor speed reaches approximately $N_s/7$, the slip for the 7th harmonic is:
   $$s_7 = \frac{N_s/7 - N_r}{N_s/7} \approx 0$$
4. The 7th harmonic torque becomes significant and can prevent further acceleration
5. The motor "crawls" at this low speed

**Remedies:**
- Use **short-pitched windings** (coil span < 180° electrical) to reduce harmonics
- Use **skewed rotor slots** to reduce harmonic coupling
- Use **distributed windings** to improve MMF waveform

## Cogging

**Definition:** Cogging (also called **magnetic locking**) is the phenomenon where the rotor refuses to start or gets locked at certain positions due to harmonic torques.

**Cause:**
- Interaction between stator slot harmonics and rotor slot harmonics
- When the number of stator slots and rotor slots have a common factor, the reluctance of the magnetic circuit varies periodically
- At certain rotor positions, the reluctance is minimum, creating a "preferred" position

**Mechanism:**
1. The stator slots create variations in air-gap reluctance
2. The rotor slots also create reluctance variations
3. When the rotor is at certain positions, the reluctance is minimum
4. The rotor tends to align with these minimum reluctance positions
5. During starting, the motor may not develop sufficient torque to overcome this magnetic locking

**Conditions for Cogging:**
$$S_r - S_s = \pm 2P, \pm P, 0$$
where $S_r$ = number of rotor slots, $S_s$ = number of stator slots, $P$ = number of pole pairs

**Remedies:**
- Choose rotor and stator slot numbers such that they have no common factor
- Use **skewed rotor slots** (typically one slot pitch skew)
- Use **semi-closed or closed slots** to reduce reluctance variation

**Comparison:**

| Aspect | Crawling | Cogging |
|--------|----------|---------|
| When observed | During acceleration | At standstill (starting) |
| Speed | Runs at ~1/7th synchronous speed | Rotor locked at certain positions |
| Cause | Harmonic torques (7th harmonic) | Slot harmonics, reluctance variation |
| Remedy | Short-pitch windings, skewing | Proper slot combination, skewing |

---

## Numerical Problems

### N1. S16-5B | 03 marks | The standstill rotor voltage of a 3 phase induction motor is 190V per phase. The motor is running with a slip of 4% and the load torque is proportional to square of the speed. What must be the rotor injected voltage to run the motor with slip of 0.6. The rotor resistance per phase is 0.5 Ω.

**Solution:**

**Given:**
- Standstill rotor voltage per phase, $E_{20} = 190$ V
- Initial slip, $s_1 = 0.04$ (4%)
- Final slip, $s_2 = 0.6$
- Rotor resistance per phase, $R_2 = 0.5$ Ω
- Load torque $T_L \propto N_r^2$ (proportional to square of speed)

**Step 1: Understand the rotor EMF injection method**

When an external voltage $V_{inj}$ is injected into the rotor circuit, the rotor current becomes:
$$I_2 = \frac{sE_{20} \pm V_{inj}}{\sqrt{R_2^2 + (sX_2)^2}}$$

For torque control, we inject voltage in phase (or opposite phase) with the rotor induced EMF.

**Step 2: Torque equation**

The torque developed by the motor:
$$T = \frac{3}{\omega_s} \cdot \frac{(sE_{20} \pm V_{inj})^2 R_2}{R_2^2 + (sX_2)^2}$$

**Step 3: Relationship between torque and speed**

Given $T_L \propto N_r^2$:
$$\frac{T_2}{T_1} = \left(\frac{N_{r2}}{N_{r1}}\right)^2$$

Since $N_r = N_s(1-s)$:
$$\frac{T_2}{T_1} = \left(\frac{1-s_2}{1-s_1}\right)^2 = \left(\frac{1-0.6}{1-0.04}\right)^2 = \left(\frac{0.4}{0.96}\right)^2 = (0.4167)^2 = 0.1736$$

**Step 4: For the initial condition (no injection)**

At $s_1 = 0.04$, the rotor induced EMF is:
$$E_{21} = s_1 E_{20} = 0.04 \times 190 = 7.6 \text{ V}$$

The torque (neglecting reactance at low slip):
$$T_1 \approx \frac{3}{\omega_s} \cdot \frac{E_{21}^2}{R_2} = \frac{3}{\omega_s} \cdot \frac{(7.6)^2}{0.5} = \frac{3}{\omega_s} \cdot \frac{57.76}{0.5} = \frac{3}{\omega_s} \times 115.52$$

**Step 5: For the final condition (with injection)**

At $s_2 = 0.6$, the rotor induced EMF is:
$$E_{22} = s_2 E_{20} = 0.6 \times 190 = 114 \text{ V}$$

The torque with injected voltage $V_{inj}$:
$$T_2 = \frac{3}{\omega_s} \cdot \frac{(E_{22} \pm V_{inj})^2 R_2}{R_2^2 + (s_2 X_2)^2}$$

**Step 6: Find the reactance**

We need $X_2$. From the torque ratio:
$$\frac{T_2}{T_1} = \frac{(E_{22} \pm V_{inj})^2 R_2}{R_2^2 + (s_2 X_2)^2} \cdot \frac{R_2}{E_{21}^2} = 0.1736$$

At $s_1 = 0.04$, $s_1 X_2 \ll R_2$, so we can neglect $s_1 X_2$:
$$\frac{T_2}{T_1} \approx \frac{(E_{22} \pm V_{inj})^2}{R_2^2 + (s_2 X_2)^2} \cdot \frac{R_2^2}{E_{21}^2}$$

**Step 7: We need to find $X_2$ first**

For a typical induction motor, the standstill reactance $X_2$ is related to the resistance. Let's use the fact that at maximum torque, $s_m = R_2/X_2$.

Since we don't have $s_m$, we need another approach. Let's assume the motor is designed such that at $s = 0.6$, the reactance is significant.

**Step 8: Alternative approach — using the torque equation directly**

For the initial condition (no injection, $s_1 = 0.04$):
$$T_1 = \frac{3}{\omega_s} \cdot \frac{s_1 E_{20}^2 R_2}{R_2^2 + (s_1 X_2)^2}$$

For the final condition (with injection, $s_2 = 0.6$):
$$T_2 = \frac{3}{\omega_s} \cdot \frac{(s_2 E_{20} \pm V_{inj})^2 R_2}{R_2^2 + (s_2 X_2)^2}$$

**Step 9: Using the torque ratio**

$$\frac{T_2}{T_1} = \frac{(s_2 E_{20} \pm V_{inj})^2}{s_1^2 E_{20}^2} \cdot \frac{R_2^2 + (s_1 X_2)^2}{R_2^2 + (s_2 X_2)^2} = 0.1736$$

Assuming $s_1 X_2 \ll R_2$ (valid for small slip):
$$\frac{(114 \pm V_{inj})^2}{(7.6)^2} \cdot \frac{R_2^2}{R_2^2 + (0.6 X_2)^2} = 0.1736$$

**Step 10: We need $X_2$. Let's assume a typical value**

For a standard induction motor, $X_2 \approx 2-3$ Ω. Let's take $X_2 = 2.5$ Ω.

Then:
$$\frac{(114 \pm V_{inj})^2}{57.76} \cdot \frac{0.25}{0.25 + (0.6 \times 2.5)^2} = 0.1736$$
$$\frac{(114 \pm V_{inj})^2}{57.76} \cdot \frac{0.25}{0.25 + 2.25} = 0.1736$$
$$\frac{(114 \pm V_{inj})^2}{57.76} \cdot \frac{0.25}{2.5} = 0.1736$$
$$\frac{(114 \pm V_{inj})^2}{57.76} \times 0.1 = 0.1736$$
$$\frac{(114 \pm V_{inj})^2}{57.76} = 1.736$$
$$(114 \pm V_{inj})^2 = 100.27$$
$$114 \pm V_{inj} = \pm 10.01$$

**Step 11: Determine the sign**

Since we need to reduce torque (from $T_1$ to $0.1736 T_1$), we need to inject voltage in opposition to the rotor EMF:
$$114 - V_{inj} = 10.01$$
$$V_{inj} = 114 - 10.01 = 103.99 \text{ V}$$

**Answer:** The required injected rotor voltage is approximately **104 V per phase** (in opposite phase to the rotor induced EMF).

---

### N2. A 3-phase, 400V, 50Hz, 6-pole, star-connected induction motor has the following parameters per phase referred to stator: $R_1 = 0.5$ Ω, $R_2' = 0.3$ Ω, $X_1 = X_2' = 1.0$ Ω. The motor is started using a star-delta starter. Calculate: (i) Starting line current with DOL starting (ii) Starting line current with star-delta starter (iii) Starting torque with DOL starting (iv) Starting torque with star-delta starter

**Solution:**

**Given:**
- Line voltage, $V_L = 400$ V
- Frequency, $f = 50$ Hz
- Number of poles, $P = 6$
- $R_1 = 0.5$ Ω, $R_2' = 0.3$ Ω, $X_1 = X_2' = 1.0$ Ω
- Star-connected stator

**Step 1: Calculate synchronous speed**

$$N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}$$
$$\omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 1000}{60} = 104.72 \text{ rad/s}$$

**Step 2: Calculate equivalent impedance at standstill ($s = 1$)**

For a star-connected motor, phase voltage:
$$V_{ph} = \frac{V_L}{\sqrt{3}} = \frac{400}{\sqrt{3}} = 230.94 \text{ V}$$

Total impedance per phase at standstill:
$$Z_{eq} = (R_1 + R_2') + j(X_1 + X_2')$$
$$Z_{eq} = (0.5 + 0.3) + j(1.0 + 1.0) = 0.8 + j2.0 \,\Omega$$

Magnitude:
$$|Z_{eq}| = \sqrt{0.8^2 + 2.0^2} = \sqrt{0.64 + 4.0} = \sqrt{4.64} = 2.154 \,\Omega$$

**Step 3: DOL starting (delta connection during normal running)**

For DOL starting, the motor is directly connected to the supply in its normal delta configuration.

Phase current at starting:
$$I_{ph(DOL)} = \frac{V_{ph}}{|Z_{eq}|} = \frac{230.94}{2.154} = 107.22 \text{ A}$$

Line current at starting (DOL):
$$I_{L(DOL)} = \sqrt{3} \times I_{ph(DOL)} = \sqrt{3} \times 107.22 = 185.71 \text{ A}$$

**Step 4: Star-delta starting**

During star connection (starting phase):
- Phase voltage: $V_{ph(Y)} = \frac{V_L}{\sqrt{3}} = \frac{400}{\sqrt{3}} = 230.94$ V
- Phase current: $I_{ph(Y)} = \frac{V_{ph(Y)}}{|Z_{eq}|} = \frac{230.94}{2.154} = 107.22$ A
- Line current: $I_{L(Y)} = I_{ph(Y)} = 107.22$ A

Wait — this is the same as DOL because the motor is star-connected normally!

**Correction:** For a motor designed for delta connection during normal running:
- In star: $V_{ph(Y)} = V_L/\sqrt{3} = 230.94$ V
- In delta: $V_{ph(\Delta)} = V_L = 400$ V

But the problem states the motor is star-connected. So the star-delta starter would connect the windings in star during starting and delta during running.

For star connection (starting):
$$I_{ph(Y)} = \frac{V_L/\sqrt{3}}{|Z_{eq}|} = \frac{230.94}{2.154} = 107.22 \text{ A}$$
$$I_{L(Y)} = I_{ph(Y)} = 107.22 \text{ A}$$

For delta connection (if motor were delta-connected):
$$I_{ph(\Delta)} = \frac{V_L}{|Z_{eq}|} = \frac{400}{2.154} = 185.71 \text{ A}$$
$$I_{L(\Delta)} = \sqrt{3} \times 185.71 = 321.66 \text{ A}$$

**Step 5: Starting torque calculation**

Torque equation at standstill ($s = 1$):
$$T_{start} = \frac{3}{\omega_s} \cdot \frac{V_{ph}^2 R_2'}{(R_1 + R_2')^2 + (X_1 + X_2')^2}$$

For DOL (star connection):
$$T_{start(DOL)} = \frac{3}{104.72} \cdot \frac{(230.94)^2 \times 0.3}{(0.8)^2 + (2.0)^2}$$
$$= \frac{3}{104.72} \cdot \frac{53333.3 \times 0.3}{0.64 + 4.0}$$
$$= \frac{3}{104.72} \cdot \frac{16000}{4.64}$$
$$= \frac{3}{104.72} \times 3448.28$$
$$= 98.79 \text{ N·m}$$

For star-delta starting (star connection during start):
Same as DOL since the motor is star-connected:
$$T_{start(star-delta)} = 98.79 \text{ N·m}$$

**Wait — this doesn't show the benefit!**

The benefit of star-delta starter is for motors designed for **delta connection** during normal operation. For such motors:

In star (starting): $V_{ph} = V_L/\sqrt{3}$, so $T_{start} \propto (V_L/\sqrt{3})^2 = V_L^2/3$

In delta (running): $V_{ph} = V_L$, so $T_{start} \propto V_L^2$

**Ratio:** $T_{start(star)}/T_{start(delta)} = 1/3$

**Corrected Answer (assuming motor is delta-connected for normal operation):**

(i) DOL starting line current (delta): $I_{L(DOL)} = 321.66$ A
(ii) Star-delta starting line current (star): $I_{L(star)} = 107.22$ A
(iii) DOL starting torque: $T_{start(DOL)} = 98.79 \times 3 = 296.37$ N·m (for delta)
(iv) Star-delta starting torque: $T_{start(star-delta)} = 98.79$ N·m

**Summary:**

| Parameter | DOL Starting | Star-Delta Starting | Ratio |
|-----------|-------------|-------------------|-------|
| Line current | 321.66 A | 107.22 A | 1/3 |
| Starting torque | 296.37 N·m | 98.79 N·m | 1/3 |

---

### N3. A 3-phase, 440V, 50Hz, 4-pole, slip-ring induction motor has a rotor resistance of 0.2 Ω per phase and standstill reactance of 1.0 Ω per phase. The stator to rotor turns ratio is 2:1. Calculate: (i) The external resistance per phase to be added to the rotor circuit to obtain maximum torque at starting (ii) The ratio of starting torque with and without external resistance

**Solution:**

**Given:**
- Line voltage, $V_L = 440$ V
- Frequency, $f = 50$ Hz
- Number of poles, $P = 4$
- Rotor resistance per phase, $R_2 = 0.2$ Ω
- Standstill rotor reactance per phase, $X_2 = 1.0$ Ω
- Stator to rotor turns ratio, $a = 2:1$

**Step 1: Condition for maximum torque at starting**

Maximum torque occurs at slip:
$$s_m = \frac{R_2'}{X_2'}$$

For maximum torque at starting ($s = 1$):
$$s_m = 1 = \frac{R_2'}{X_2'}$$
$$R_2' = X_2'$$

**Step 2: Refer rotor parameters to stator**

Turns ratio $a = N_1/N_2 = 2$

Rotor resistance referred to stator:
$$R_2' = a^2 R_2 = (2)^2 \times 0.2 = 0.8 \,\Omega$$

Rotor reactance referred to stator:
$$X_2' = a^2 X_2 = (2)^2 \times 1.0 = 4.0 \,\Omega$$

**Step 3: Required total rotor resistance for maximum torque at starting**

For $s_m = 1$:
$$R_{2(total)}' = X_2' = 4.0 \,\Omega$$

Total rotor resistance per phase (actual rotor side):
$$R_{2(total)} = \frac{R_{2(total)}'}{a^2} = \frac{4.0}{4} = 1.0 \,\Omega$$

**Step 4: External resistance to be added**

$$R_{ext} = R_{2(total)} - R_2 = 1.0 - 0.2 = 0.8 \,\Omega \text{ per phase}$$

**Step 5: Starting torque without external resistance**

At $s = 1$, without external resistance ($R_2 = 0.2$ Ω):
$$T_{start(without)} = \frac{3}{\omega_s} \cdot \frac{V_1^2 R_2'}{(R_2')^2 + (X_2')^2}$$
$$= \frac{3}{\omega_s} \cdot \frac{V_1^2 \times 0.8}{(0.8)^2 + (4.0)^2}$$
$$= \frac{3}{\omega_s} \cdot \frac{0.8 V_1^2}{0.64 + 16}$$
$$= \frac{3}{\omega_s} \cdot \frac{0.8 V_1^2}{16.64}$$
$$= \frac{3}{\omega_s} \times 0.04808 V_1^2$$

**Step 6: Starting torque with external resistance**

With $R_{2(total)}' = 4.0$ Ω:
$$T_{start(with)} = \frac{3}{\omega_s} \cdot \frac{V_1^2 \times 4.0}{(4.0)^2 + (4.0)^2}$$
$$= \frac{3}{\omega_s} \cdot \frac{4.0 V_1^2}{16 + 16}$$
$$= \frac{3}{\omega_s} \cdot \frac{4.0 V_1^2}{32}$$
$$= \frac{3}{\omega_s} \times 0.125 V_1^2$$

**Step 7: Ratio of starting torques**

$$\frac{T_{start(with)}}{T_{start(without)}} = \frac{0.125}{0.04808} = 2.6$$

**Answer:**
(i) External resistance to be added: **0.8 Ω per phase**
(ii) Ratio of starting torque (with/without external resistance): **2.6:1**

---

### N4. A 3-phase, 400V, 50Hz, 6-pole induction motor has a full-load slip of 4%. The rotor resistance per phase is 0.2 Ω and standstill reactance is 1.5 Ω. Calculate: (i) The speed at which maximum torque occurs (ii) The ratio of maximum torque to full-load torque (iii) The external resistance required in the rotor circuit to obtain 80% of maximum torque at starting

**Solution:**

**Given:**
- Line voltage, $V_L = 400$ V
- Frequency, $f = 50$ Hz
- Number of poles, $P = 6$
- Full-load slip, $s_{FL} = 0.04$
- Rotor resistance per phase, $R_2 = 0.2$ Ω
- Standstill rotor reactance per phase, $X_2 = 1.5$ Ω

**Step 1: Synchronous speed**

$$N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}$$

**Step 2: Slip at maximum torque**

$$s_m = \frac{R_2}{X_2} = \frac{0.2}{1.5} = 0.1333$$

**Step 3: Speed at maximum torque**

$$N_m = N_s(1 - s_m) = 1000(1 - 0.1333) = 1000 \times 0.8667 = 866.7 \text{ rpm}$$

**Step 4: Ratio of maximum torque to full-load torque**

The torque equation:
$$T = \frac{3}{\omega_s} \cdot \frac{sE_2^2 R_2}{R_2^2 + (sX_2)^2}$$

Maximum torque:
$$T_{max} = \frac{3}{2\omega_s} \cdot \frac{E_2^2}{X_2}$$

Full-load torque (at $s_{FL} = 0.04$):
$$T_{FL} = \frac{3}{\omega_s} \cdot \frac{s_{FL}E_2^2 R_2}{R_2^2 + (s_{FL}X_2)^2}$$

Ratio:
$$\frac{T_{max}}{T_{FL}} = \frac{\frac{3}{2\omega_s} \cdot \frac{E_2^2}{X_2}}{\frac{3}{\omega_s} \cdot \frac{s_{FL}E_2^2 R_2}{R_2^2 + (s_{FL}X_2)^2}}$$
$$= \frac{1}{2X_2} \cdot \frac{R_2^2 + (s_{FL}X_2)^2}{s_{FL}R_2}$$
$$= \frac{R_2^2 + (s_{FL}X_2)^2}{2s_{FL}R_2X_2}$$

Substituting values:
$$= \frac{(0.2)^2 + (0.04 \times 1.5)^2}{2 \times 0.04 \times 0.2 \times 1.5}$$
$$= \frac{0.04 + (0.06)^2}{2 \times 0.04 \times 0.3}$$
$$= \frac{0.04 + 0.0036}{0.024}$$
$$= \frac{0.0436}{0.024}$$
$$= 1.817$$

**Step 5: External resistance for 80% of maximum torque at starting**

At starting ($s = 1$), torque with total rotor resistance $R_{2(total)}$:
$$T_{start} = \frac{3}{\omega_s} \cdot \frac{E_2^2 R_{2(total)}}{R_{2(total)}^2 + X_2^2}$$

We want $T_{start} = 0.8 T_{max}$:
$$\frac{3}{\omega_s} \cdot \frac{E_2^2 R_{2(total)}}{R_{2(total)}^2 + X_2^2} = 0.8 \times \frac{3}{2\omega_s} \cdot \frac{E_2^2}{X_2}$$

Simplifying:
$$\frac{R_{2(total)}}{R_{2(total)}^2 + X_2^2} = \frac{0.8}{2X_2} = \frac{0.4}{X_2}$$

Cross-multiplying:
$$R_{2(total)}X_2 = 0.4(R_{2(total)}^2 + X_2^2)$$
$$R_{2(total)} \times 1.5 = 0.4(R_{2(total)}^2 + 2.25)$$
$$1.5R_{2(total)} = 0.4R_{2(total)}^2 + 0.9$$
$$0.4R_{2(total)}^2 - 1.5R_{2(total)} + 0.9 = 0$$

Solving the quadratic:
$$R_{2(total)} = \frac{1.5 \pm \sqrt{1.5^2 - 4 \times 0.4 \times 0.9}}{2 \times 0.4}$$
$$= \frac{1.5 \pm \sqrt{2.25 - 1.44}}{0.8}$$
$$= \frac{1.5 \pm \sqrt{0.81}}{0.8}$$
$$= \frac{1.5 \pm 0.9}{0.8}$$

Two solutions:
$$R_{2(total)} = \frac{1.5 + 0.9}{0.8} = \frac{2.4}{0.8} = 3.0 \,\Omega$$
$$R_{2(total)} = \frac{1.5 - 0.9}{0.8} = \frac{0.6}{0.8} = 0.75 \,\Omega$$

Since we need to add resistance (not reduce), we take $R_{2(total)} = 3.0$ Ω.

External resistance:
$$R_{ext} = R_{2(total)} - R_2 = 3.0 - 0.2 = 2.8 \,\Omega \text{ per phase}$$

**Answer:**
(i) Speed at maximum torque: **866.7 rpm**
(ii) Ratio of maximum torque to full-load torque: **1.817:1**
(iii) External resistance required: **2.8 Ω per phase**

---

## Quick Quiz

### Q1. What is the condition for maximum torque in an induction motor at starting?

**Answer:** Maximum torque at starting occurs when the rotor resistance equals the rotor reactance at standstill, i.e., $R_2 = X_2$ (or $R_2' = X_2'$ referred to stator). At this condition, the slip at maximum torque $s_m = 1$.

---

### Q2. Why is the V/f ratio kept constant in variable frequency speed control of induction motors?

**Answer:** Constant V/f ratio ensures that the air-gap flux remains constant. If V/f is constant, $\phi \propto V/f = \text{constant}$. This prevents magnetic saturation at low frequencies (which would cause excessive current and heating) and maintains constant torque capability throughout the speed range below base speed.

---

### Q3. What is the difference between crawling and cogging in induction motors?

**Answer:**
- **Crawling**: The motor runs at approximately 1/7th of synchronous speed instead of accelerating to normal speed, caused by the 7th space harmonic in the air-gap MMF.
- **Cogging**: The rotor refuses to start or gets locked at certain positions due to magnetic locking between stator and rotor slot harmonics, occurring at standstill.

---

### Q4. How does a star-delta starter reduce the starting current of an induction motor?

**Answer:** During starting, the stator windings are connected in star, so each phase receives $V_L/\sqrt{3}$ instead of $V_L$. The phase current is reduced by a factor of $1/\sqrt{3}$, and the line current is reduced by a factor of $1/3$ compared to direct-on-line starting in delta. The starting torque is also reduced to $1/3$ of the DOL value.

---

### Q5. What is the principle of rotor EMF injection for speed control of slip-ring induction motors?

**Answer:** An external voltage of slip frequency is injected into the rotor circuit. If injected in phase with the rotor induced EMF, the rotor current increases, torque increases, and the motor accelerates (speed increases). If injected in opposite phase, the rotor current decreases, torque decreases, and the motor decelerates (speed decreases). The injected voltage must be at slip frequency, requiring a variable frequency source or a cycloconverter.