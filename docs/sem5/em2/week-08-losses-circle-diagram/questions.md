---
sidebar_position: 8.5
title: "Week 8: Induction Motor — Losses, Circle Diagram, and Performance Analysis"
---

# Week 8: Induction Motor — Losses, Circle Diagram, and Performance Analysis

## Practice Questions

---

## Previous Year Questions

### Q1. [S18-5B] Draw the sketch of circle diagram of an Induction motor and define various phasors involved in it. Identify the length representing the starting torque. Justify your statement.

**Answer:**

The **circle diagram** is a graphical representation of the induction motor's performance characteristics, derived from its equivalent circuit. It is constructed using data from the no-load test and blocked-rotor test.

**Construction and Phasors:**

1. **No-load point (A):** At no-load, the motor draws current $I_0$ at a low power factor (typically 0.1–0.2 lagging). This current has two components:
   - Magnetizing component $I_m$ (quadrature)
   - Core loss component $I_w$ (in-phase with voltage)

2. **Blocked-rotor point (B):** With rotor locked ($s = 1$), the motor draws rated current $I_{sc}$ at a power factor of 0.3–0.5 lagging.

3. **Circle construction:**
   - Draw voltage phasor $\bar{V}$ vertically upward (reference)
   - Plot $I_0$ at angle $\phi_0$ from $\bar{V}$
   - Plot $I_{sc}$ at angle $\phi_{sc}$ from $\bar{V}$
   - Draw a circle with diameter on the line joining the tips of $I_0$ and $I_{sc}$

4. **Key phasors on the diagram:**
   - $\overline{OA}$ = No-load current $I_0$
   - $\overline{OB}$ = Blocked-rotor current $I_{sc}$
   - $\overline{AB}$ = Rotor current referred to stator $I_2'$
   - $\overline{AE}$ = Stator copper loss component
   - $\overline{EF}$ = Rotor copper loss component
   - $\overline{FD}$ = Power output component

**Starting Torque Representation:**

The length representing **starting torque** is the vertical distance from point B (blocked-rotor point) to the horizontal line through point A (no-load point). This is the **rotor input power** at standstill, which is proportional to starting torque.

**Justification:**
- Torque $T \propto \frac{P_{ag}}{\omega_s}$, where $P_{ag}$ is air-gap power
- At standstill ($s = 1$), $P_{ag} = P_{in} - P_{scu}$ (stator copper loss)
- On the circle diagram, the vertical intercept at point B represents the air-gap power at starting
- Therefore, this vertical distance is proportional to starting torque

---

### Q2. [S19-4B | 05 marks] Consider a 415V, 4pole, 50Hz induction motor operating at 4% slip. The shaft power output is 1.2 kW. The machine has stator losses of 50W and rotational losses of 70W. Draw the power flow diagram with power stages.

**Answer:**

**Power Flow Diagram:**

```
P_in ──→ [Stator] ──→ P_ag ──→ [Rotor] ──→ P_mech ──→ [Shaft] ──→ P_out
         │                      │                      │
         ↓                      ↓                      ↓
      P_scu                  P_rcu                  P_rot
      (50 W)                (?? W)                 (70 W)
```

**Power Stages Calculation:**

Given:
- $V = 415$ V (line), $P = 4$, $f = 50$ Hz, $s = 0.04$
- $P_{out} = 1200$ W
- $P_{scu} = 50$ W (stator copper loss)
- $P_{rot} = 70$ W (rotational losses = friction + windage + core loss)

**Step 1:** Mechanical power developed
$$P_{mech} = P_{out} + P_{rot} = 1200 + 70 = 1270 \text{ W}$$

**Step 2:** Rotor copper loss
$$P_{rcu} = \frac{s}{1-s} \times P_{mech} = \frac{0.04}{0.96} \times 1270 = 52.92 \text{ W}$$

**Step 3:** Air-gap power
$$P_{ag} = P_{mech} + P_{rcu} = 1270 + 52.92 = 1322.92 \text{ W}$$

**Step 4:** Input power
$$P_{in} = P_{ag} + P_{scu} = 1322.92 + 50 = 1372.92 \text{ W}$$

**Step 5:** Efficiency
$$\eta = \frac{P_{out}}{P_{in}} \times 100\% = \frac{1200}{1372.92} \times 100\% = 87.4\%$$

**Verification using slip relationships:**
- $P_{rcu} = s \times P_{ag} = 0.04 \times 1322.92 = 52.92$ W ✓
- $P_{mech} = (1-s) \times P_{ag} = 0.96 \times 1322.92 = 1270$ W ✓

---

### Q3. [S17-4B | 04 marks] Draw and explain the equivalent circuit of a double cage induction motor and sketch the inner, outer and net torque slip characteristics.

**Answer:**

**Double Cage Induction Motor Construction:**
A double cage rotor has two sets of rotor bars:
- **Outer cage:** High resistance, low reactance (near the rotor surface)
- **Inner cage:** Low resistance, high reactance (deep in the rotor)

**Equivalent Circuit:**

The equivalent circuit shows two parallel rotor branches:

```
        R_1    jX_1
    ──┬─/\/\/\─┬──/\/\/\──┬───
      │        │          │
      │        │          │
      │     jX_m          │
      │        │          │
      │        │          │
      │        │          │
      │   R_2o/s  jX_2o  │
      ├──/\/\/\──┬──/\/\/\┤  ← Outer cage branch
      │          │        │
      │   R_2i/s  jX_2i  │
      └──/\/\/\──┬──/\/\/\┘  ← Inner cage branch
                 │
```

Where:
- $R_{2o}$ = Outer cage resistance (high)
- $X_{2o}$ = Outer cage reactance (low)
- $R_{2i}$ = Inner cage resistance (low)
- $X_{2i}$ = Inner cage reactance (high)

**Torque-Slip Characteristics:**

[Image: double_cage_torque_slip.png — see lecture notes]

<div align="center">
  <em>Figure: Torque-slip characteristics of double cage induction motor showing inner cage, outer cage, and net torque</em>
</div>

**Explanation:**

1. **At starting ($s = 1$):**
   - High slip → high frequency in rotor → reactance dominates
   - Outer cage: low $X_{2o}$ → carries more current → contributes high starting torque
   - Inner cage: high $X_{2i}$ → current limited → contributes less torque
   - **Net effect:** High starting torque

2. **At running ($s \approx 0$):**
   - Low slip → low frequency in rotor → resistance dominates
   - Outer cage: high $R_{2o}$ → inefficient, contributes less
   - Inner cage: low $R_{2i}$ → carries most current → efficient operation
   - **Net effect:** Good running efficiency

3. **Advantage:** Combines high starting torque (like wound rotor) with simple construction (like squirrel cage)

---

### Q4. [S28-6B | 6 marks] Explain the phenomena of crawling and cogging in a 3 phase induction motor.

**Answer:**

## Crawling

**Definition:** Crawling is the tendency of an induction motor to run at a speed much lower than its rated speed (typically $\frac{1}{7}$ or $\frac{1}{13}$ of synchronous speed) instead of accelerating to normal speed.

**Cause:**
- Due to **space harmonics** in the air-gap MMF waveform
- The 7th harmonic produces a torque that tries to lock the rotor at $\frac{N_s}{7}$
- The motor "crawls" at this low speed instead of reaching rated speed

**Explanation:**
- A non-sinusoidal winding distribution produces harmonic MMFs
- The 7th harmonic rotates at $\frac{N_s}{7}$ in the same direction as the fundamental
- At $\frac{N_s}{7}$ speed, slip for 7th harmonic is zero → harmonic torque peak
- If load torque is low, motor may get "stuck" at this speed

**Remedies:**
- Use **short-pitched windings** (coil span < full pitch) to reduce harmonics
- Use **skewed rotor slots** to break harmonic locking
- Increase number of slots per pole

## Cogging

**Definition:** Cogging (or magnetic locking) is the failure of the motor to start at all, even when power is applied. The rotor remains stationary or "cogs" (jerks) without continuous rotation.

**Cause:**
- Occurs when the number of stator slots and rotor slots have a **common factor**
- Magnetic reluctance varies as rotor teeth align/disalign with stator teeth
- At certain positions, the rotor gets locked in a position of minimum reluctance

**Mathematical condition:**
$$\text{Cogging occurs if } \frac{S_s}{S_r} = \text{integer or simple fraction}$$

Where $S_s$ = stator slots, $S_r$ = rotor slots

**Example:**
- If $S_s = 24$ and $S_r = 12$, common factor = 12 → severe cogging
- If $S_s = 24$ and $S_r = 18$, common factor = 6 → moderate cogging
- If $S_s = 24$ and $S_r = 17$, no common factor → no cogging

**Remedies:**
- Choose $S_r \neq S_s$ and with no common factor
- Use **skewed rotor slots** (typically by one slot pitch)
- Use **chording** in stator windings

**Difference between Crawling and Cogging:**

| Feature | Crawling | Cogging |
|---------|----------|---------|
| Effect | Runs at sub-normal speed | Fails to start |
| Cause | Harmonic torques | Slot harmonics, magnetic locking |
| Speed | $\frac{N_s}{7}$ or $\frac{N_s}{13}$ | Zero (standstill) |
| Remedy | Short-pitch windings | Skewed rotor slots |

---

### Q5. [S25-5A | 04 marks] Draw and explain the torque-slip characteristic of a 3-phase induction motor. Also explain the effect of rotor resistance on torque slip characteristics.

**Answer:**

**Torque-Slip Characteristic:**

[Image: torque_slip_characteristic.png — see lecture notes]

<div align="center">
  <em>Figure: Torque-slip characteristic of a 3-phase induction motor showing motoring, generating, and braking regions</em>
</div>

**Key Points on the Curve:**

1. **Starting torque ($T_{st}$):** Torque at $s = 1$
2. **Maximum torque ($T_{max}$):** Peak torque at slip $s_m$
3. **Rated operating point:** Near $s = 0$ (typically 2-5% slip)
4. **Synchronous speed:** $s = 0$, $T = 0$

**Three Operating Regions:**

1. **Motoring region ($0 < s < 1$):** Torque positive, motor accelerates
2. **Generating region ($s < 0$):** Torque negative, machine acts as generator
3. **Braking region ($s > 1$):** Plugging, torque opposes rotation

**Torque Equation:**
$$T = \frac{3}{\omega_s} \times \frac{V_1^2 R_2/s}{(R_1 + R_2/s)^2 + (X_1 + X_2)^2}$$

**Effect of Rotor Resistance:**

[Image: rotor_resistance_effect.png — see lecture notes]

<div align="center">
  <em>Figure: Effect of increasing rotor resistance on torque-slip characteristics</em>
</div>

1. **Starting torque increases** with rotor resistance up to a point
   - $T_{st} \propto \frac{R_2}{R_2^2 + X_2^2}$
   - Maximum starting torque when $R_2 = X_2$

2. **Slip at maximum torque increases** with rotor resistance
   - $s_m = \frac{R_2}{\sqrt{R_1^2 + (X_1 + X_2)^2}}$
   - Higher $R_2$ → higher $s_m$

3. **Maximum torque magnitude remains constant**
   - $T_{max} = \frac{3V_1^2}{2\omega_s [R_1 + \sqrt{R_1^2 + (X_1 + X_2)^2}]}$
   - Independent of $R_2$

4. **Running speed decreases** (higher slip for same load)

**Practical Application:**
- **Wound rotor motors:** External resistance added during starting for high starting torque, then short-circuited for efficient running
- **Double cage motors:** High resistance outer cage for starting, low resistance inner cage for running

---

## Numerical Problems

### N1. [Adapted from S17-5B] A 3-phase, 400V, 50Hz, 4-pole induction motor has the following test results:

**No-load test:** 400V, 8A, 400W
**Blocked-rotor test:** 100V, 20A, 800W

The stator resistance per phase is 0.5Ω. Draw the circle diagram and determine:
(i) Maximum torque
(ii) Starting torque
(iii) Slip at maximum torque

**Solution:**

**Step 1: No-load parameters**

No-load power factor:
$$\cos\phi_0 = \frac{P_0}{\sqrt{3}V_0I_0} = \frac{400}{\sqrt{3} \times 400 \times 8} = 0.0722$$

$$\phi_0 = \cos^{-1}(0.0722) = 85.86^\circ$$

No-load current components:
$$I_w = I_0\cos\phi_0 = 8 \times 0.0722 = 0.577 \text{ A}$$
$$I_m = I_0\sin\phi_0 = 8 \times \sin(85.86^\circ) = 7.98 \text{ A}$$

**Step 2: Blocked-rotor parameters**

Blocked-rotor power factor:
$$\cos\phi_{sc} = \frac{P_{sc}}{\sqrt{3}V_{sc}I_{sc}} = \frac{800}{\sqrt{3} \times 100 \times 20} = 0.2309$$

$$\phi_{sc} = \cos^{-1}(0.2309) = 76.65^\circ$$

Blocked-rotor impedance:
$$Z_{sc} = \frac{V_{sc}}{\sqrt{3}I_{sc}} = \frac{100}{\sqrt{3} \times 20} = 2.887 \,\Omega$$

$$R_{sc} = Z_{sc}\cos\phi_{sc} = 2.887 \times 0.2309 = 0.667 \,\Omega$$
$$X_{sc} = Z_{sc}\sin\phi_{sc} = 2.887 \times \sin(76.65^\circ) = 2.809 \,\Omega$$

**Step 3: Rotor parameters**

Rotor resistance referred to stator:
$$R_2' = R_{sc} - R_1 = 0.667 - 0.5 = 0.167 \,\Omega$$

Rotor reactance referred to stator:
$$X_2' = X_{sc} = 2.809 \,\Omega$$

**Step 4: Maximum torque**

Synchronous speed:
$$\omega_s = \frac{2\pi N_s}{60} = \frac{2\pi \times 1500}{60} = 157.08 \text{ rad/s}$$

Maximum torque:
$$T_{max} = \frac{3V_1^2}{2\omega_s [R_1 + \sqrt{R_1^2 + (X_1 + X_2')^2}]}$$

$$T_{max} = \frac{3 \times (400/\sqrt{3})^2}{2 \times 157.08 \times [0.5 + \sqrt{0.5^2 + 2.809^2}]}$$

$$T_{max} = \frac{3 \times 53333}{2 \times 157.08 \times [0.5 + 2.853]}$$

$$T_{max} = \frac{160000}{314.16 \times 3.353} = \frac{160000}{1053.4} = 151.9 \text{ N·m}$$

**Step 5: Starting torque**

Starting torque:
$$T_{st} = \frac{3}{\omega_s} \times \frac{V_1^2 R_2'}{(R_1 + R_2')^2 + (X_1 + X_2')^2}$$

$$T_{st} = \frac{3}{157.08} \times \frac{53333 \times 0.167}{(0.5 + 0.167)^2 + 2.809^2}$$

$$T_{st} = 0.0191 \times \frac{8906.6}{0.445 + 7.890}$$

$$T_{st} = 0.0191 \times \frac{8906.6}{8.335} = 0.0191 \times 1068.6 = 20.41 \text{ N·m}$$

**Step 6: Slip at maximum torque**

$$s_m = \frac{R_2'}{\sqrt{R_1^2 + (X_1 + X_2')^2}} = \frac{0.167}{\sqrt{0.5^2 + 2.809^2}}$$

$$s_m = \frac{0.167}{\sqrt{0.25 + 7.89}} = \frac{0.167}{\sqrt{8.14}} = \frac{0.167}{2.853} = 0.0585$$

$$s_m = 5.85\%$$

**Answers:**
- Maximum torque: $T_{max} = 151.9$ N·m
- Starting torque: $T_{st} = 20.41$ N·m
- Slip at maximum torque: $s_m = 5.85\%$

---

### N2. A 3-phase, 440V, 50Hz, 6-pole induction motor has a full-load slip of 4%. The rotor resistance per phase is 0.2Ω and standstill rotor reactance per phase is 1.5Ω. Calculate:
(i) The ratio of maximum torque to full-load torque
(ii) The slip at which maximum torque occurs
(iii) The speed at maximum torque

**Solution:**

**Step 1: Given data**
- $V = 440$ V (line), $f = 50$ Hz, $P = 6$
- $s_{fl} = 0.04$
- $R_2 = 0.2$ Ω, $X_2 = 1.5$ Ω

**Step 2: Slip at maximum torque**

For an induction motor (neglecting stator parameters):
$$s_m = \frac{R_2}{X_2} = \frac{0.2}{1.5} = 0.1333$$

$$s_m = 13.33\%$$

**Step 3: Ratio of maximum torque to full-load torque**

Using the torque ratio formula:
$$\frac{T_{max}}{T_{fl}} = \frac{s_{fl}^2 + s_m^2}{2s_{fl}s_m}$$

$$\frac{T_{max}}{T_{fl}} = \frac{0.04^2 + 0.1333^2}{2 \times 0.04 \times 0.1333}$$

$$\frac{T_{max}}{T_{fl}} = \frac{0.0016 + 0.01778}{0.01066} = \frac{0.01938}{0.01066} = 1.818$$

**Step 4: Speed at maximum torque**

Synchronous speed:
$$N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}$$

Speed at maximum torque:
$$N_m = N_s(1 - s_m) = 1000 \times (1 - 0.1333) = 866.7 \text{ rpm}$$

**Answers:**
- $\frac{T_{max}}{T_{fl}} = 1.818$
- $s_m = 13.33\%$
- $N_m = 866.7$ rpm

---

### N3. A 3-phase, 400V, 50Hz, 4-pole induction motor has the following equivalent circuit parameters referred to stator:
$R_1 = 0.5$ Ω, $R_2' = 0.3$ Ω, $X_1 = X_2' = 1.0$ Ω, $X_m = 25$ Ω

The motor is operating at rated voltage and frequency with a slip of 3%. Calculate:
(i) Stator current
(ii) Power factor
(iii) Output power
(iv) Efficiency (neglect mechanical losses)

**Solution:**

**Step 1: Equivalent circuit simplification**

At $s = 0.03$:

Rotor branch impedance:
$$Z_r = \frac{R_2'}{s} + jX_2' = \frac{0.3}{0.03} + j1.0 = 10 + j1.0 \,\Omega$$

Magnetizing branch impedance:
$$Z_m = jX_m = j25 \,\Omega$$

Parallel combination of $Z_r$ and $Z_m$:
$$Z_{parallel} = \frac{Z_r \times Z_m}{Z_r + Z_m}$$

$$Z_r + Z_m = (10 + j1.0) + j25 = 10 + j26 \,\Omega$$

$$Z_r \times Z_m = (10 + j1.0) \times j25 = j250 - 25 = -25 + j250$$

$$Z_{parallel} = \frac{-25 + j250}{10 + j26}$$

Rationalizing:
$$Z_{parallel} = \frac{(-25 + j250)(10 - j26)}{10^2 + 26^2}$$

Numerator:
$$(-25)(10) + (-25)(-j26) + (j250)(10) + (j250)(-j26)$$
$$= -250 + j650 + j2500 + 6500$$
$$= 6250 + j3150$$

Denominator:
$$100 + 676 = 776$$

$$Z_{parallel} = \frac{6250 + j3150}{776} = 8.054 + j4.059 \,\Omega$$

**Step 2: Total impedance per phase**

$$Z_{total} = R_1 + jX_1 + Z_{parallel}$$
$$Z_{total} = 0.5 + j1.0 + 8.054 + j4.059$$
$$Z_{total} = 8.554 + j5.059 \,\Omega$$

Magnitude:
$$|Z_{total}| = \sqrt{8.554^2 + 5.059^2} = \sqrt{73.17 + 25.59} = \sqrt{98.76} = 9.938 \,\Omega$$

**Step 3: Stator current**

Phase voltage:
$$V_{ph} = \frac{400}{\sqrt{3}} = 230.94 \text{ V}$$

Stator current:
$$I_1 = \frac{V_{ph}}{|Z_{total}|} = \frac{230.94}{9.938} = 23.24 \text{ A}$$

**Step 4: Power factor**

$$\cos\phi = \frac{R_{total}}{|Z_{total}|} = \frac{8.554}{9.938} = 0.8607 \text{ (lagging)}$$

**Step 5: Input power**

$$P_{in} = 3 \times V_{ph} \times I_1 \times \cos\phi$$
$$P_{in} = 3 \times 230.94 \times 23.24 \times 0.8607$$
$$P_{in} = 3 \times 4618.5 = 13855.5 \text{ W}$$

**Step 6: Air-gap power**

Current in rotor branch:
$$I_2' = I_1 \times \frac{Z_m}{Z_r + Z_m} = 23.24 \times \frac{j25}{10 + j26}$$

$$|I_2'| = 23.24 \times \frac{25}{\sqrt{10^2 + 26^2}} = 23.24 \times \frac{25}{27.86} = 20.86 \text{ A}$$

Air-gap power:
$$P_{ag} = 3 \times (I_2')^2 \times \frac{R_2'}{s} = 3 \times 20.86^2 \times 10$$
$$P_{ag} = 3 \times 435.1 \times 10 = 13053 \text{ W}$$

**Step 7: Rotor copper loss**

$$P_{rcu} = s \times P_{ag} = 0.03 \times 13053 = 391.6 \text{ W}$$

**Step 8: Output power (neglecting mechanical losses)**

$$P_{out} = P_{mech} = P_{ag} - P_{rcu} = 13053 - 391.6 = 12661.4 \text{ W}$$

**Step 9: Efficiency**

$$\eta = \frac{P_{out}}{P_{in}} \times 100\% = \frac{12661.4}{13855.5} \times 100\% = 91.38\%$$

**Answers:**
- Stator current: $I_1 = 23.24$ A
- Power factor: $\cos\phi = 0.861$ (lagging)
- Output power: $P_{out} = 12.66$ kW
- Efficiency: $\eta = 91.38\%$

---

### N4. A 3-phase, 6-pole, 50Hz induction motor has a rotor resistance of 0.02Ω per phase and standstill reactance of 0.1Ω per phase. Determine:
(i) The external resistance per phase to be added to the rotor circuit to get maximum torque at starting
(ii) The ratio of starting torque with external resistance to starting torque without external resistance

**Solution:**

**Step 1: Condition for maximum torque at starting**

For maximum torque at starting ($s = 1$):
$$s_m = \frac{R_2 + R_{ext}}{X_2} = 1$$

$$R_2 + R_{ext} = X_2$$

$$R_{ext} = X_2 - R_2 = 0.1 - 0.02 = 0.08 \,\Omega$$

**Step 2: Starting torque without external resistance**

$$T_{st1} \propto \frac{R_2}{R_2^2 + X_2^2} = \frac{0.02}{0.02^2 + 0.1^2} = \frac{0.02}{0.0004 + 0.01} = \frac{0.02}{0.0104} = 1.923$$

**Step 3: Starting torque with external resistance**

$$T_{st2} \propto \frac{R_2 + R_{ext}}{(R_2 + R_{ext})^2 + X_2^2} = \frac{0.1}{0.1^2 + 0.1^2} = \frac{0.1}{0.01 + 0.01} = \frac{0.1}{0.02} = 5$$

**Step 4: Ratio of starting torques**

$$\frac{T_{st2}}{T_{st1}} = \frac{5}{1.923} = 2.6$$

**Answers:**
- External resistance required: $R_{ext} = 0.08$ Ω per phase
- Ratio of starting torques: $\frac{T_{st2}}{T_{st1}} = 2.6$

---

## Quick Quiz

### Q1. What is the relationship between air-gap power ($P_{ag}$), rotor copper loss ($P_{rcu}$), and mechanical power developed ($P_{mech}$)?

**Answer:**
$$P_{ag} : P_{rcu} : P_{mech} = 1 : s : (1-s)$$

Specifically:
- $P_{rcu} = s \times P_{ag}$
- $P_{mech} = (1-s) \times P_{ag}$
- $P_{ag} = P_{rcu} + P_{mech}$

---

### Q2. What information is obtained from the no-load test and blocked-rotor test of an induction motor?

**Answer:**

| Test | Parameters Measured | Information Obtained |
|------|---------------------|---------------------|
| No-load test | $V_0$, $I_0$, $P_0$ | Magnetizing reactance $X_m$, core loss, friction & windage loss |
| Blocked-rotor test | $V_{sc}$, $I_{sc}$, $P_{sc}$ | Equivalent resistance $R_{sc}$, equivalent reactance $X_{sc}$ (stator + rotor referred to stator) |

---

### Q3. Why does the maximum torque of an induction motor remain constant when rotor resistance is varied?

**Answer:**
The maximum torque expression is:
$$T_{max} = \frac{3V_1^2}{2\omega_s [R_1 + \sqrt{R_1^2 + (X_1 + X_2)^2}]}$$

This expression is **independent of rotor resistance $R_2$**. Changing $R_2$ only shifts the slip at which maximum torque occurs ($s_m$), but does not change the magnitude of $T_{max}$.

---

### Q4. What is the significance of the circle diagram in induction motor analysis?

**Answer:**
The circle diagram provides a graphical method to determine the following performance parameters without calculations:
- Input current and power factor at any load
- Stator and rotor copper losses
- Output power and torque
- Maximum torque and maximum power
- Starting torque
- Efficiency at any operating point
- Slip corresponding to any load

It is particularly useful when analytical calculations become complex due to non-linearities.

---

### Q5. What are the losses in an induction motor? How are they classified?

**Answer:**

**Classification of losses in induction motors:**

1. **Copper losses (variable losses):**
   - Stator copper loss: $P_{scu} = 3I_1^2R_1$
   - Rotor copper loss: $P_{rcu} = 3I_2'^2R_2' = sP_{ag}$

2. **Iron losses (constant losses):**
   - Hysteresis loss in stator and rotor core
   - Eddy current loss in stator and rotor core
   - (Rotor iron loss is negligible at normal slip due to low frequency)

3. **Mechanical losses (constant losses):**
   - Friction loss in bearings
   - Windage loss due to air resistance

4. **Stray load losses:**
   - Due to leakage flux, harmonic fields, etc.
   - Typically 0.5-1% of output power

**Power flow:**
$$P_{in} \rightarrow P_{scu} \rightarrow P_{ag} \rightarrow P_{rcu} \rightarrow P_{mech} \rightarrow P_{rot} \rightarrow P_{out}$$