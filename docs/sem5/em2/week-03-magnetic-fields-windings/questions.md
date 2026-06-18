---
sidebar_position: 3.5
title: "Week 3: Practice Questions"
---

# Week 3: Practice Questions

## Previous Year Questions

### Q1. S12-3A | 04 marks

**For a synchronous generator, derive suitable expressions for (i) Pitch factor (ii) Distribution factor**

**Answer:**

**Pitch Factor (Coil Span Factor)**

When coils are short-pitched (i.e., coil span is less than 180° electrical), the induced EMF is reduced. The pitch factor $K_p$ accounts for this reduction.

If the coil span is $\alpha$ electrical degrees short of full pitch (180°), then:

- Coil span = $180^\circ - \alpha$ electrical degrees
- The EMF induced in each coil side has a phase difference of $\alpha$

For a full-pitch coil, the two coil-side EMFs are in phase. For a short-pitch coil, they are displaced by $\alpha$, so the resultant EMF is the phasor sum:

$$
E_{resultant} = 2E_{coil\;side} \cos\left(\frac{\alpha}{2}\right)
$$

The pitch factor is defined as:

$$
K_p = \frac{\text{Resultant EMF of short-pitch coil}}{\text{Resultant EMF of full-pitch coil}} = \cos\left(\frac{\alpha}{2}\right)
$$

For the $n^{th}$ harmonic, the pitch factor becomes:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

This property is used to suppress specific harmonics by choosing $\alpha$ appropriately.

**Distribution Factor (Breadth Factor)**

When coils are distributed across several slots per pole per phase, the EMFs induced in adjacent coils have a phase difference equal to the slot angle $\beta$:

$$
\beta = \frac{180^\circ}{\text{Slots per pole}}
$$

If there are $m$ slots per pole per phase, the total EMF is the phasor sum of $m$ EMFs each displaced by $\beta$:

$$
E_{resultant} = 2R\sin\left(\frac{m\beta}{2}\right)
$$

where $R$ is the radius of the phasor diagram circle.

The arithmetic sum of the $m$ EMFs is:

$$
E_{arithmetic} = m \times (2R\sin(\beta/2))
$$

The distribution factor is:

$$
K_d = \frac{\text{Phasor sum}}{\text{Arithmetic sum}} = \frac{\sin\left(\frac{m\beta}{2}\right)}{m\sin\left(\frac{\beta}{2}\right)}
$$

For the $n^{th}$ harmonic:

$$
K_{dn} = \frac{\sin\left(\frac{nm\beta}{2}\right)}{m\sin\left(\frac{n\beta}{2}\right)}
$$

**Key Insight:** Both $K_p$ and $K_d$ are less than 1 for practical windings. They reduce the fundamental EMF slightly but can significantly reduce or eliminate harmonic EMFs.

---

### Q2. S14-1A | 02 marks

**Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding**

**Answer:**

**(i) Integral vs Fractional Slot Winding**

- **Integral Slot Winding:** The number of slots per pole per phase ($m$) is an integer. For example, $m = 4$ means each phase has 4 slots under each pole. This is the most common type for synchronous machines.

- **Fractional Slot Winding:** The number of slots per pole per phase ($m$) is a fraction. For example, $m = 3.5$ means some poles have 3 slots and others have 4 slots per phase. This is used to:
  - Reduce harmonic content
  - Allow more flexibility in slot/pole combinations
  - Reduce cogging torque in small machines

**(ii) Full Pitch vs Fractional Pitch Winding**

- **Full Pitch Winding:** The coil span equals the pole pitch (180° electrical). If there are $S$ slots and $P$ poles, the coil span is $S/P$ slots. The two coil sides are exactly one pole pitch apart.

- **Fractional Pitch (Short Pitch) Winding:** The coil span is less than the pole pitch. For example, if the pole pitch is 12 slots, a coil spanning 10 slots is short-pitched by 2 slots (or 30° electrical). Advantages include:
  - Reduced harmonic content (especially 5th and 7th)
  - Less copper required
  - Improved waveform
  - Better flux utilization

---

### Q3. S22-1A | 02 marks

**Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine.**

**Answer:**

Short-pitched windings (coil span < 180° electrical) offer several advantages:

1. **Harmonic Suppression:** The pitch factor for the $n^{th}$ harmonic is $K_{pn} = \cos(n\alpha/2)$. By choosing $\alpha = 30^\circ$, the 5th harmonic ($n=5$) has $K_{p5} = \cos(75^\circ) \approx 0.259$, and the 7th harmonic ($n=7$) has $K_{p7} = \cos(105^\circ) \approx -0.259$. These harmonics are significantly reduced. With $\alpha = 36^\circ$, the 5th harmonic is completely eliminated ($K_{p5} = \cos(90^\circ) = 0$).

2. **Copper Saving:** Short-pitched coils use less copper because the end connections are shorter. This reduces the machine's cost and weight.

3. **Improved Voltage Waveform:** By reducing harmonic content, the generated EMF waveform becomes closer to a pure sine wave, which is desirable for power quality.

4. **Reduced Iron Losses:** Harmonics cause additional iron losses in the machine. Suppressing harmonics reduces these losses and improves efficiency.

5. **Reduced Noise and Vibration:** Harmonic magnetic fields can cause mechanical vibrations and audible noise. Short-pitching mitigates these effects.

**Trade-off:** The fundamental EMF is slightly reduced (by factor $\cos(\alpha/2)$), but the benefits usually outweigh this small reduction.

---

### Q4. S01-4C | 03 marks

**Why synchronous motors are not self-starting? Briefly explain the starting method using an auxiliary induction motor.**

**Answer:**

**Why Synchronous Motors Are Not Self-Starting:**

A synchronous motor operates on the principle of magnetic locking between the rotor field and the rotating stator field. When the stator is energized with 3-phase AC supply, a rotating magnetic field is produced at synchronous speed $N_s = 120f/P$.

If the rotor is stationary and its DC field is excited, the rotor poles experience:
- During the first half-cycle: attractive force trying to pull the rotor forward
- During the next half-cycle: repulsive force trying to push the rotor backward

Since the stator field rotates at 3000 rpm (for a 2-pole, 50 Hz machine), the rotor cannot accelerate from standstill to synchronous speed in one half-cycle. The net average torque over a complete cycle is zero, so the motor cannot start.

**Starting Method Using Auxiliary Induction Motor:**

1. An auxiliary induction motor (pony motor) is mechanically coupled to the synchronous motor shaft.
2. The pony motor accelerates the synchronous motor rotor to near synchronous speed (typically 95-98% of $N_s$).
3. The DC field excitation is then applied to the rotor.
4. The rotor poles lock onto the rotating stator field, and the motor pulls into synchronism.
5. The pony motor is then disconnected (either mechanically or electrically).

This method is used for large synchronous motors where other starting methods are impractical.

---

### Q5. S06-1A

**'The inherent nature of synchronous machines is to rotate in synchronism with the supply frequency while that of induction motors is to rotate with a slip'. Differentiate the above two machines. Use necessary schematic diagrams to justify your answer.**

**Answer:**

**Synchronous Machine:**

- Rotor speed $N_r$ is exactly equal to synchronous speed $N_s = 120f/P$
- Slip $s = 0$ always (in steady state)
- Rotor has DC excitation (field winding with slip rings or permanent magnets)
- Torque is produced by magnetic locking between rotor field and stator rotating field
- Cannot start without external assistance
- Power factor can be controlled by adjusting field excitation (leading, lagging, or unity)

**Schematic Diagram Description:**
```
Stator: 3-phase winding producing rotating magnetic field
Rotor: DC-excited poles (salient or cylindrical)
Speed: N_r = N_s (synchronism)
```

**Induction Machine:**

- Rotor speed $N_r$ is less than synchronous speed $N_s$
- Slip $s = (N_s - N_r)/N_s$ is non-zero (typically 2-8% at full load)
- Rotor has no external excitation; currents are induced by transformer action
- Torque is produced by interaction between stator rotating field and induced rotor currents
- Self-starting (squirrel cage or wound rotor)
- Power factor is always lagging (absorbs reactive power for magnetization)

**Schematic Diagram Description:**
```
Stator: 3-phase winding producing rotating magnetic field
Rotor: Squirrel cage bars or wound rotor with slip rings
Speed: N_r = N_s(1-s) (slip speed)
```

**Key Difference Table:**

| Parameter | Synchronous Machine | Induction Machine |
|-----------|-------------------|-------------------|
| Rotor speed | $N_r = N_s$ | $N_r < N_s$ |
| Slip | $s = 0$ | $s > 0$ |
| Rotor excitation | DC (external) | Induced AC |
| Starting | Not self-starting | Self-starting |
| Power factor | Controllable | Always lagging |
| Application | Generation, constant speed drives | Variable speed drives, pumps, fans |

---

### Q6. S25-6A | 04 marks

**With the help of double field revolving theory, show that single phase induction motor is not self starting.**

**Answer:**

**Double Field Revolving Theory:**

According to this theory, a pulsating magnetic field produced by a single-phase winding can be resolved into two rotating magnetic fields of equal magnitude rotating in opposite directions:

$$
B(\theta, t) = B_m \cos(\omega t) \cos(\theta) = \frac{B_m}{2} \cos(\omega t - \theta) + \frac{B_m}{2} \cos(\omega t + \theta)
$$

Where:
- First term: Forward rotating field ($B_f$) rotating at $\omega$ rad/s in the forward direction
- Second term: Backward rotating field ($B_b$) rotating at $\omega$ rad/s in the backward direction

Both fields have the same magnitude $B_m/2$ and rotate at synchronous speed $N_s$.

**Why No Starting Torque:**

1. At standstill ($N_r = 0$), the rotor sees both forward and backward fields rotating at the same relative speed ($N_s$).
2. Each field induces equal currents in the rotor.
3. The forward field produces a torque $T_f$ in the forward direction.
4. The backward field produces a torque $T_b$ in the backward direction.
5. Since the rotor is stationary, $T_f = T_b$ in magnitude but opposite in direction.
6. Net starting torque: $T_{start} = T_f - T_b = 0$

**Torque-Slip Characteristic Description:**

The torque-slip characteristic shows:
- Forward torque $T_f$: Positive for $s < 1$, zero at $s = 1$ (standstill), maximum at some slip $s_{mf}$
- Backward torque $T_b$: Negative for $s < 1$, zero at $s = 1$, maximum at slip $s_{mb} = 2 - s_{mf}$
- Net torque $T_{net} = T_f + T_b$: Zero at $s = 1$ (standstill), non-zero for $s \neq 1$

**Conclusion:** The single-phase induction motor has zero starting torque because the forward and backward rotating fields cancel each other's torque at standstill. To make it self-starting, an auxiliary winding with a phase shift (using a capacitor or split-phase arrangement) is needed to create an unbalanced two-phase system.

---

## Numerical Problems

### N1. Q077 | S01-1A | 04 marks

**A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced.**

**Solution:**

**Step 1: Determine number of poles**

$$
N_s = \frac{120f}{P} \implies P = \frac{120 \times 50}{1000} = 6 \text{ poles}
$$

**Step 2: Calculate slots per pole**

$$
\text{Slots per pole} = \frac{72}{6} = 12
$$

**Step 3: Calculate slot angle $\beta$**

$$
\beta = \frac{180^\circ}{\text{Slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 4: Calculate slots per pole per phase $m$**

$$
m = \frac{\text{Total slots}}{3 \times P} = \frac{72}{3 \times 6} = 4
$$

**Step 5: Calculate short-pitch angle $\alpha$**

Full pitch = 12 slots, actual coil span = 10 slots
Short-pitch = 12 - 10 = 2 slots

$$
\alpha = 2 \times \beta = 2 \times 15^\circ = 30^\circ \text{ electrical}
$$

**Step 6: Calculate Distribution factor $K_d$**

$$
K_d = \frac{\sin\left(\frac{m\beta}{2}\right)}{m\sin\left(\frac{\beta}{2}\right)} = \frac{\sin\left(\frac{4 \times 15^\circ}{2}\right)}{4 \times \sin\left(\frac{15^\circ}{2}\right)}
$$

$$
K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 7: Calculate Pitch factor $K_p$**

$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 8: Calculate Winding factor $K_w$**

$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 9: Calculate turns per phase $T_{ph}$**

Total conductors = 72 slots × 6 conductors/slot = 432 conductors

For a 3-phase star-connected alternator:

$$
T_{ph} = \frac{\text{Total conductors}}{2 \times 3} = \frac{432}{6} = 72 \text{ turns per phase}
$$

**Step 10: Calculate phase EMF $E_{ph}$**

$$
E_{ph} = 4.44 \times f \times \phi \times T_{ph} \times K_w
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250
$$

$$
E_{ph} = 4.44 \times 50 \times 17.316 = 3,844.3 \text{ V}
$$

**Step 11: Calculate line EMF $E_L$ (star connection)**

$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3,844.3 = 6,658.5 \text{ V}
$$

**Answer:**
- (i) $K_d = 0.9577$, $K_p = 0.9659$, $K_w = 0.9250$
- (ii) $T_{ph} = 72$ turns
- (iii) $E_{ph} = 3,844.3$ V, $E_L = 6,658.5$ V

---

### N2. Q078 | S01-2A | 03 marks

**A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total no. of armature slots (ii) minimum order of harmonic emf that can be suppressed.**

**Solution:**

**Step 1: Determine number of poles**

$$
N_s = \frac{120f}{P} \implies P = \frac{120 \times 50}{750} = 8 \text{ poles}
$$

**Step 2: Determine slot angle $\beta$**

Given coil span = 144° electrical, and short-pitched by 2 slots.

Full pitch = 180° electrical
Short-pitch angle $\alpha$ = 180° - 144° = 36° electrical

Since short-pitch is 2 slots:
$$
\alpha = 2 \times \beta \implies \beta = \frac{36^\circ}{2} = 18^\circ \text{ electrical}
$$

**Step 3: Calculate total number of slots**

$$
\beta = \frac{180^\circ}{\text{Slots per pole}} \implies \text{Slots per pole} = \frac{180^\circ}{18^\circ} = 10
$$

$$
\text{Total slots} = \text{Slots per pole} \times P = 10 \times 8 = 80 \text{ slots}
$$

**Step 4: Determine minimum order of harmonic suppressed**

For a short-pitched winding, the $n^{th}$ harmonic is suppressed when:
$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right) = 0
$$

$$
\cos\left(\frac{n \times 36^\circ}{2}\right) = \cos(18n^\circ) = 0
$$

$$
18n^\circ = 90^\circ \implies n = 5
$$

**Answer:**
- (i) Total number of armature slots = 80
- (ii) Minimum order of harmonic suppressed = 5th harmonic

---

### N3. Custom Problem: Winding Factor Calculation

**A 3-phase, 4-pole, 50 Hz alternator has 48 stator slots. Each coil spans 10 slots. Calculate: (i) Pitch factor (ii) Distribution factor (iii) Winding factor**

**Solution:**

**Step 1: Calculate slots per pole**

$$
\text{Slots per pole} = \frac{48}{4} = 12
$$

**Step 2: Calculate slot angle $\beta$**

$$
\beta = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 3: Calculate slots per pole per phase $m$**

$$
m = \frac{48}{3 \times 4} = 4
$$

**Step 4: Calculate short-pitch angle $\alpha$**

Full pitch = 12 slots, actual span = 10 slots
Short-pitch = 2 slots

$$
\alpha = 2 \times 15^\circ = 30^\circ \text{ electrical}
$$

**Step 5: Pitch factor**

$$
K_p = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 6: Distribution factor**

$$
K_d = \frac{\sin\left(\frac{4 \times 15^\circ}{2}\right)}{4 \times \sin\left(\frac{15^\circ}{2}\right)} = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = 0.9577
$$

**Step 7: Winding factor**

$$
K_w = K_p \times K_d = 0.9659 \times 0.9577 = 0.9250
$$

**Answer:**
- $K_p = 0.9659$
- $K_d = 0.9577$
- $K_w = 0.9250$

---

### N4. Custom Problem: Harmonic Suppression

**A 3-phase alternator has a coil span of 150° electrical. Determine which harmonics are eliminated by this short-pitching.**

**Solution:**

**Step 1: Calculate short-pitch angle $\alpha$**

$$
\alpha = 180^\circ - 150^\circ = 30^\circ \text{ electrical}
$$

**Step 2: Condition for harmonic elimination**

The $n^{th}$ harmonic is eliminated when:
$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right) = 0
$$

$$
\cos\left(\frac{n \times 30^\circ}{2}\right) = \cos(15n^\circ) = 0
$$

**Step 3: Solve for $n$**

$$
15n^\circ = 90^\circ, 270^\circ, 450^\circ, ...
$$

$$
n = 6, 18, 30, ...
$$

Since harmonics are odd integers (3rd, 5th, 7th, ...), the first odd harmonic that satisfies this is:

For $n = 6$: Even harmonic, not typically present in 3-phase machines

Actually, let's reconsider. The condition $\cos(15n^\circ) = 0$ gives:

$$
15n = 90 + 180k \implies n = 6 + 12k
$$

For $k = 0$: $n = 6$ (not an odd harmonic)
For $k = 1$: $n = 18$ (odd, but high order)

**Step 4: Check for 5th and 7th harmonics**

For $n = 5$: $K_{p5} = \cos(5 \times 15^\circ) = \cos(75^\circ) = 0.2588$ (not eliminated, but reduced)

For $n = 7$: $K_{p7} = \cos(7 \times 15^\circ) = \cos(105^\circ) = -0.2588$ (not eliminated, but reduced)

**Answer:** With $\alpha = 30^\circ$, no low-order odd harmonic is completely eliminated. The 5th and 7th harmonics are reduced to 25.88% of their full-pitch values. For complete elimination of the 5th harmonic, $\alpha$ should be $36^\circ$ (coil span of $144^\circ$).

---

## Quick Quiz

### Q1. What is the pitch factor for a full-pitch coil?

**Answer:** $K_p = 1$ (since $\alpha = 0^\circ$, $\cos(0^\circ) = 1$)

---

### Q2. Why are windings distributed in multiple slots rather than concentrated in one slot?

**Answer:** Distributed windings:
- Reduce harmonic content in the generated EMF
- Improve the sinusoidal waveform
- Better utilize the armature periphery
- Reduce temperature rise by spreading the copper
- Reduce reactance and improve machine performance

---

### Q3. What is the relationship between electrical and mechanical degrees in a machine with $P$ poles?

**Answer:**
$$
\theta_{elec} = \frac{P}{2} \times \theta_{mech}
$$

For a 4-pole machine, 360° mechanical = 720° electrical.

---

### Q4. Which harmonic is completely eliminated by a coil span of 144° electrical?

**Answer:** With $\alpha = 180^\circ - 144^\circ = 36^\circ$:
$$
K_{p5} = \cos\left(\frac{5 \times 36^\circ}{2}\right) = \cos(90^\circ) = 0
$$

The 5th harmonic is completely eliminated.

---

### Q5. What is the significance of the winding factor $K_w$ in the EMF equation?

**Answer:** The winding factor $K_w = K_p \times K_d$ accounts for the reduction in induced EMF due to:
- Short-pitching (pitch factor $K_p$)
- Distribution of coils (distribution factor $K_d$)

The actual EMF is $K_w$ times the EMF that would be induced if all conductors were concentrated in one slot with full pitch. For practical windings, $K_w$ is typically 0.9-0.96.