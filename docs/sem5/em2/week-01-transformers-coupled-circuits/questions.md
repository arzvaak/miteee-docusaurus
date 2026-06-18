---
sidebar_position: 1.5
title: "Week 1: Practice Questions"
---

# Week 1: Practice Questions

## Previous Year Questions

### Q1. Why are synchronous motors not self-starting? Briefly explain the starting method using an auxiliary induction motor.

**Answer:**

Synchronous motors are **not self-starting** because of the following reason:

When a 3-phase supply is given to the stator of a synchronous motor, a **rotating magnetic field** (RMF) is produced which rotates at synchronous speed $N_s = \frac{120f}{P}$. The rotor, which is either a permanent magnet or a DC-excited electromagnet, is initially at standstill.

Due to inertia, the rotor cannot instantly accelerate from standstill to synchronous speed. During the first half-cycle, the RMF exerts a torque on the rotor in one direction. However, before the rotor can move appreciably, the RMF reverses polarity in the next half-cycle, exerting torque in the opposite direction. This results in **zero average starting torque**.

**Starting method using auxiliary induction motor:**
1. An auxiliary induction motor (pony motor) is mechanically coupled to the synchronous motor shaft.
2. The pony motor accelerates the synchronous motor rotor to **near synchronous speed** (typically 95-98% of $N_s$).
3. Once the rotor is close to synchronous speed, the DC excitation is applied to the rotor field winding.
4. The rotor now "locks in" with the RMF due to magnetic attraction and pulls into synchronism.
5. The pony motor is then mechanically disengaged.

**Key point:** The synchronous motor must be brought to near synchronous speed before excitation is applied, after which it synchronizes automatically.

---

### Q2. With the help of double field revolving theory, prove that a single-phase induction motor containing only one stator winding produces no starting torque.

**Answer:**

**Double Field Revolving Theory:**
According to this theory, a **pulsating magnetic field** produced by a single-phase AC winding can be resolved into two **rotating magnetic fields** of equal magnitude, rotating in opposite directions:

$$
\phi(t) = \phi_m \cos(\omega t) = \frac{\phi_m}{2} \cos(\omega t - \theta) + \frac{\phi_m}{2} \cos(\omega t + \theta)
$$

Where:
- Forward rotating field: $\phi_f = \frac{\phi_m}{2} \angle (\omega t)$
- Backward rotating field: $\phi_b = \frac{\phi_m}{2} \angle (-\omega t)$

**Proof of no starting torque:**
1. At standstill ($s = 1$), the rotor sees both forward and backward fields with equal slip.
2. The forward field induces torque $T_f$ in one direction.
3. The backward field induces torque $T_b$ in the opposite direction.
4. Due to symmetry, $T_f = T_b$ in magnitude.
5. Net starting torque: $T_{start} = T_f - T_b = 0$

**Mathematically:**
For the forward field: $s_f = s = 1$ (at standstill)
For the backward field: $s_b = 2 - s = 1$ (at standstill)

Since both fields have equal slip and equal magnitude, the induced rotor currents are equal, producing equal and opposite torques.

**Conclusion:** A single-phase induction motor with only one stator winding produces **zero starting torque** and is therefore **not self-starting**.

---

### Q3. Explain the operation of a single-phase induction motor using double field revolving theory.

**Answer:**

**Operation principle:**
A single-phase induction motor has:
- **Main winding** (running winding) — distributed in stator slots
- **Auxiliary winding** (starting winding) — used only during starting (in capacitor-start motors)

**At standstill:**
- The pulsating field is resolved into two equal counter-rotating fields.
- Net torque = 0, motor does not start.

**Once started (by auxiliary means):**
- If the rotor is given a small rotation in, say, the forward direction:
  - Slip for forward field: $s_f = \frac{N_s - N_r}{N_s}$ (less than 1)
  - Slip for backward field: $s_b = \frac{N_s + N_r}{N_s}$ (greater than 1)
- The forward field induces higher rotor current at lower slip → larger torque $T_f$
- The backward field induces lower rotor current at higher slip → smaller torque $T_b$
- Net torque: $T_{net} = T_f - T_b > 0$ in the forward direction

**Torque-slip characteristic:**
- The motor develops a net positive torque once it starts rotating.
- The motor accelerates until $T_{net}$ balances the load torque.
- The motor runs at a slip slightly less than 1 (typically 3-6% slip).

**Key insight:** The motor needs an **external starting mechanism** (capacitor, shaded pole, split-phase) to break the symmetry and create a starting torque.

---

### Q4. What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

**Advantages of field on rotor and armature on stator:**

1. **Easier insulation of high-voltage windings:**
   - The 3-phase armature winding (which carries the generated voltage) is placed on the **stationary stator**.
   - High-voltage insulation is easier to implement on stationary parts than on rotating parts.
   - Slip rings and brushes are avoided for the high-voltage circuit.

2. **Simpler rotor construction:**
   - The field winding carries DC current at relatively low voltage (typically 100-500 V).
   - DC excitation can be supplied through slip rings easily.
   - The rotor can be built as a salient-pole or cylindrical-rotor type.

3. **Better cooling:**
   - The stator can be cooled more effectively with external cooling systems.
   - The rotor, being lighter and simpler, has better ventilation.

4. **Reduced centrifugal stress:**
   - The heavy armature winding (with many conductors) is stationary.
   - Only the lighter field winding rotates, reducing mechanical stress.

5. **Easier maintenance:**
   - Stationary armature windings are more accessible for inspection and repair.
   - Slip rings for DC excitation are simpler to maintain than slip rings for 3-phase AC.

6. **No rotating rectifiers needed:**
   - For large alternators, brushless excitation systems can be used with rotating rectifiers on the rotor, but the main power winding remains stationary.

**Conclusion:** The "inverted" construction (field on rotor, armature on stator) is universally adopted for large alternators due to insulation, cooling, and mechanical advantages.

---

### Q5. Explain the effect of load power factor on armature reaction in alternators.

**Answer:**

**Armature reaction** is the effect of armature MMF on the main field MMF in a synchronous generator. The effect depends on the **load power factor**.

**1. Unity power factor (resistive load):**
- Armature current $I_a$ is in phase with induced EMF $E_f$.
- Armature reaction is **cross-magnetizing** (distorting).
- The resultant flux is distorted but the magnitude remains approximately constant.
- Terminal voltage $V_t$ is slightly less than $E_f$.

**2. Lagging power factor (inductive load):**
- Armature current $I_a$ lags $E_f$ by angle $\phi$.
- Armature reaction is **partially demagnetizing** and partially cross-magnetizing.
- The demagnetizing component opposes the main field, reducing net flux.
- Terminal voltage $V_t$ is **significantly less** than $E_f$ (positive regulation).

**3. Leading power factor (capacitive load):**
- Armature current $I_a$ leads $E_f$ by angle $\phi$.
- Armature reaction is **partially magnetizing** and partially cross-magnetizing.
- The magnetizing component aids the main field, increasing net flux.
- Terminal voltage $V_t$ can be **greater** than $E_f$ (negative regulation).

**Phasor representation:**
For a lagging load:
$$
\bar{E}_f = \bar{V}_t + I_a(R_a + jX_s)
$$

Where $X_s$ is the synchronous reactance that accounts for armature reaction and leakage reactance.

**Practical significance:**
- Alternators supplying lagging loads (typical industrial loads) require **higher excitation** to maintain rated voltage.
- Alternators supplying leading loads (capacitive, long transmission lines) require **lower excitation**.
- The **V-curves** of synchronous machines show this relationship between excitation current and armature current at different power factors.

---

### Q6. What is an induction generator? Why is it not preferred for generation of bulk power?

**Answer:**

**Induction Generator:**
An induction machine can operate as a generator when:
- It is driven above synchronous speed ($N_r > N_s$)
- Slip becomes negative: $s = \frac{N_s - N_r}{N_s} < 0$
- The machine supplies active power to the grid

**Operating principle:**
1. The stator is connected to a 3-phase supply (grid).
2. The rotor is driven by a prime mover (wind turbine, hydro turbine) above $N_s$.
3. The rotor now rotates faster than the RMF, inducing current in the opposite direction.
4. Power flows from rotor to stator → from stator to grid.

**Why not preferred for bulk power generation:**

1. **Requires reactive power from grid:**
   - Induction generators consume **lagging reactive power** for magnetization.
   - They cannot generate their own reactive power (unlike synchronous generators).
   - This causes poor power factor and voltage regulation issues.

2. **No voltage control:**
   - Terminal voltage is determined by the grid, not by the generator.
   - Cannot regulate voltage independently.

3. **Poor fault ride-through capability:**
   - During grid faults, the machine loses excitation and may trip.
   - Synchronous generators have better fault tolerance.

4. **Lower efficiency at partial loads:**
   - Efficiency drops significantly at light loads.

5. **Cannot operate as stand-alone:**
   - Requires external reactive power source (capacitor bank or grid).
   - Not suitable for isolated power systems.

**Applications:**
- Wind energy conversion systems (with power electronic interface)
- Small hydro plants
- Regenerative braking in industrial drives

---

## Numerical Problems

### N1. A 3-phase, 50 Hz, 1000 rpm, star-connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase (iii) Phase and line value of EMF induced.

**Solution:**

**Step 1: Determine number of poles**
$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6 \text{ poles}
$$

**Step 2: Calculate slots per pole**
$$
\text{Slots per pole} = \frac{72}{6} = 12
$$

**Step 3: Calculate slot angle ($\beta$)**
$$
\beta = \frac{180^\circ}{\text{Slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ (electrical)}
$$

**Step 4: Calculate number of slots per pole per phase ($m$)**
$$
m = \frac{\text{Slots per pole}}{3} = \frac{12}{3} = 4
$$

**Step 5: Calculate short-pitch angle ($\alpha$)**
Coil span = 10 slots
Full pitch = 12 slots
Short pitch = $12 - 10 = 2$ slots

$$
\alpha = 2 \times \beta = 2 \times 15^\circ = 30^\circ \text{ (electrical)}
$$

**Step 6: Calculate Distribution factor ($K_d$)**
$$
K_d = \frac{\sin\left(\frac{m\beta}{2}\right)}{m \sin\left(\frac{\beta}{2}\right)} = \frac{\sin\left(\frac{4 \times 15^\circ}{2}\right)}{4 \times \sin\left(\frac{15^\circ}{2}\right)}
$$

$$
K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 7: Calculate Pitch factor ($K_p$)**
$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 8: Calculate Winding factor ($K_w$)**
$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 9: Calculate turns per phase ($T_{ph}$)**
Total conductors = $72 \times 6 = 432$
Conductors per phase = $\frac{432}{3} = 144$
Turns per phase = $\frac{144}{2} = 72$ turns

**Step 10: Calculate phase EMF ($E_{ph}$)**
$$
E_{ph} = 4.44 \times f \times \phi \times T_{ph} \times K_w
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250 = 3,844.3 \text{ V}
$$

**Step 11: Calculate line EMF ($E_L$)**
For star connection:
$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.3 = 6,658.5 \text{ V}
$$

**Answers:**
- Distribution factor $K_d = 0.9577$
- Pitch factor $K_p = 0.9659$
- Winding factor $K_w = 0.9250$
- Turns per phase $T_{ph} = 72$
- Phase EMF $E_{ph} = 3,844.3 \text{ V}$
- Line EMF $E_L = 6,658.5 \text{ V}$

---

### N2. A 3-phase, 50 Hz, 750 rpm alternator has its armature winding short-pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total number of armature slots (ii) minimum order of harmonic EMF that can be suppressed.

**Solution:**

**Step 1: Determine number of poles**
$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}
$$

**Step 2: Calculate slots per pole**
Coil span = 144° electrical
Full pitch = 180° electrical
Short pitch = $180^\circ - 144^\circ = 36^\circ$ electrical

Short pitch in slots = 2 slots (given)
Slot angle $\beta = \frac{36^\circ}{2} = 18^\circ$ electrical

**Step 3: Calculate total slots**
$$
\text{Slots per pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10
$$

Total slots = Slots per pole $\times$ Number of poles = $10 \times 8 = 80$ slots

**Step 4: Determine minimum order of harmonic suppressed**
For a coil span of $\alpha$ electrical degrees short of full pitch:
$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

Where $n$ is the harmonic order.

For suppression, $K_{pn} = 0$:
$$
\cos\left(\frac{n\alpha}{2}\right) = 0
$$

$$
\frac{n\alpha}{2} = 90^\circ, 270^\circ, ...
$$

$$
n = \frac{180^\circ}{\alpha} = \frac{180^\circ}{36^\circ} = 5
$$

**Answer:**
- Total number of armature slots = **80**
- Minimum order of harmonic suppressed = **5th harmonic**

---

### N3. A 3-phase, 50 Hz induction motor runs at 960 rpm at full load. Calculate: (i) Number of poles (ii) Slip at full load (iii) Frequency of rotor current.

**Solution:**

**Step 1: Determine number of poles**
Synchronous speeds for 50 Hz:
- 2 poles: $N_s = \frac{120 \times 50}{2} = 3000 \text{ rpm}$
- 4 poles: $N_s = \frac{120 \times 50}{4} = 1500 \text{ rpm}$
- 6 poles: $N_s = \frac{120 \times 50}{6} = 1000 \text{ rpm}$
- 8 poles: $N_s = \frac{120 \times 50}{8} = 750 \text{ rpm}$

Since $N_r = 960 \text{ rpm}$ is slightly less than 1000 rpm, the motor has **6 poles** with $N_s = 1000 \text{ rpm}$.

**Step 2: Calculate slip**
$$
s = \frac{N_s - N_r}{N_s} = \frac{1000 - 960}{1000} = \frac{40}{1000} = 0.04 = 4\%
$$

**Step 3: Calculate rotor current frequency**
$$
f_r = s \times f = 0.04 \times 50 = 2 \text{ Hz}
$$

**Answers:**
- Number of poles = **6**
- Slip = **4%**
- Rotor current frequency = **2 Hz**

---

### N4. A 415V, 3-phase, 50 Hz, 4-pole induction motor has a full load slip of 4%. The rotor resistance per phase is 0.5 Ω and standstill rotor voltage per phase is 190V. Calculate the rotor injected voltage required to run the motor at a slip of 0.6% while the load torque is proportional to the square of speed.

**Solution:**

**Step 1: Understand the relationship**
For slip-ring induction motor with rotor injected voltage $V_{inj}$:
$$
\frac{T}{T_{base}} = \frac{s}{s_{base}} \times \frac{V_{inj}^2}{V_r^2}
$$

Where $V_r$ is the standstill rotor voltage.

**Step 2: Given data**
- $V_r = 190 \text{ V}$ (standstill rotor voltage per phase)
- $R_2 = 0.5 \Omega$ (rotor resistance per phase)
- $s_1 = 0.04$ (initial slip)
- $s_2 = 0.006$ (desired slip)
- $T \propto N^2$ (load torque proportional to square of speed)

**Step 3: Speed relationship**
At slip $s_1 = 0.04$:
$$
N_1 = N_s(1 - s_1) = N_s(1 - 0.04) = 0.96 N_s
$$

At slip $s_2 = 0.006$:
$$
N_2 = N_s(1 - s_2) = N_s(1 - 0.006) = 0.994 N_s
$$

**Step 4: Torque relationship**
Since $T \propto N^2$:
$$
\frac{T_2}{T_1} = \left(\frac{N_2}{N_1}\right)^2 = \left(\frac{0.994}{0.96}\right)^2 = (1.0354)^2 = 1.072
$$

**Step 5: Apply torque equation for injected voltage**
For a slip-ring motor with injected voltage:
$$
T = \frac{3}{\omega_s} \times \frac{V_{inj}^2 s}{R_2}
$$

Since torque is proportional to $V_{inj}^2 s$:
$$
\frac{T_2}{T_1} = \frac{V_{inj}^2 \times s_2}{V_r^2 \times s_1}
$$

**Step 6: Solve for $V_{inj}$**
$$
1.072 = \frac{V_{inj}^2 \times 0.006}{190^2 \times 0.04}
$$

$$
V_{inj}^2 = \frac{1.072 \times 190^2 \times 0.04}{0.006}
$$

$$
V_{inj}^2 = \frac{1.072 \times 36100 \times 0.04}{0.006}
$$

$$
V_{inj}^2 = \frac{1547.68}{0.006} = 257,946.67
$$

$$
V_{inj} = \sqrt{257,946.67} = 507.9 \text{ V}
$$

**Answer:** The required rotor injected voltage is approximately **508 V per phase**.

---

## Quick Quiz

### Q1. What is the synchronous speed of a 6-pole, 50 Hz induction motor?

**Answer:**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}
$$

---

### Q2. State whether the following statement is True or False: "A single-phase induction motor is self-starting."

**Answer:** **False.** A single-phase induction motor with only one stator winding produces zero starting torque due to the cancellation of forward and backward rotating fields (double field revolving theory). It requires an auxiliary starting mechanism.

---

### Q3. What is the range of slip for a three-phase induction motor operating as a generator?

**Answer:** For generator operation, the rotor must run above synchronous speed, so slip is **negative**:
$$
s = \frac{N_s - N_r}{N_s} < 0
$$
Typically, $s$ ranges from 0 to about -0.05 (i.e., 0% to -5% slip).

---

### Q4. Match the following:

| Column A | Column B |
|----------|----------|
| 1. Pitch factor | a. Accounts for distributed winding |
| 2. Distribution factor | b. Accounts for short-pitched coils |
| 3. Winding factor | c. Product of pitch and distribution factors |

**Answer:** 1-b, 2-a, 3-c

---

### Q5. What is the effect of armature reaction when an alternator supplies a purely capacitive load?

**Answer:** For a purely capacitive load (leading power factor), the armature reaction is **magnetizing**. The armature MMF aids the main field MMF, increasing the net flux. This causes the terminal voltage to **rise** above the excitation EMF, resulting in **negative voltage regulation**.

---

### Q6. Why is the field winding placed on the rotor and armature winding on the stator in large alternators?

**Answer:**
1. The high-voltage armature winding is stationary, making insulation easier.
2. Only low-voltage DC needs to be supplied to the rotating field through slip rings.
3. Better cooling arrangements are possible for the stationary armature.
4. Reduced centrifugal stress on the heavy armature conductors.
5. Easier maintenance and inspection of stationary windings.