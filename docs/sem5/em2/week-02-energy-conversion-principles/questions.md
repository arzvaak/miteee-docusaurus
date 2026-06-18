---
sidebar_position: 2.5
title: "Week 2: Practice Questions"
---

# Week 2: Practice Questions

## Previous Year Questions

### Q1. S06-1C: 'Unlike asynchronous machines, Synchronous machines can be operated at different power factors'. Justify this statement with the help of necessary characteristics.

**Answer:**

This statement is fundamentally true because of the inherent difference in how reactive power is managed in synchronous versus asynchronous (induction) machines.

**For Induction Motors (Asynchronous Machines):**
- An induction motor always operates at a **lagging power factor** because it draws magnetizing current from the supply to establish the air-gap flux.
- The rotor current is induced by slip, and the machine has no independent means of controlling its reactive power consumption.
- The power factor improves slightly from no-load (very low, ~0.2 lagging) to full-load (~0.8-0.9 lagging), but it can never become leading.

**For Synchronous Machines:**
- Synchronous machines have a **separate DC field excitation** on the rotor, which can be independently controlled.
- By varying the field current, the machine's internal emf ($E_f$) changes, allowing the machine to operate at:
  - **Lagging power factor** (under-excited): The machine absorbs reactive power from the grid
  - **Unity power factor** (normal excitation): The machine operates at unity pf
  - **Leading power factor** (over-excited): The machine supplies reactive power to the grid

**V-curve characteristics** (shown in the figure below) illustrate this behavior:

[Image: EM1_EM2_Swayam_Numerical_Questions_With_Answers_p1_img-0_jpeg.png — see lecture notes]

<div align="center">
  <em>Figure: V-curves showing armature current vs field current for different power factors</em>
</div>

The V-curves show that for a given load, as field current increases:
1. Initially, armature current is high (lagging pf region)
2. Armature current reaches a minimum at unity power factor
3. Armature current increases again (leading pf region)

This flexibility makes synchronous machines valuable for power factor correction in industrial applications.

---

### Q2. S07-4A: 'V' and 'inverted V' curves have significant importance in analyzing the behaviors of synchronous machines. Justify this statement suitably.

**Answer:**

**V-curves** plot **armature current ($I_a$)** versus **field current ($I_f$)** for constant load and terminal voltage. They are called V-curves because of their characteristic V-shape.

**Inverted V-curves** plot **power factor (cos $\phi$)** versus **field current ($I_f$)** for the same conditions.

**Significance of V-curves:**

1. **Minimum armature current point**: The bottom of the V-curve corresponds to unity power factor operation. At this point, for a given load, the armature current is minimum, meaning copper losses are minimized.

2. **Stability assessment**: The V-curve helps identify the stability limit. Operating too far in the under-excited region (left side of the curve) can lead to loss of synchronism.

3. **Excitation control**: V-curves guide operators in adjusting field excitation to achieve desired power factor.

**Significance of Inverted V-curves:**

1. **Power factor visualization**: The inverted V-curve clearly shows how power factor varies from lagging (left side) through unity (peak) to leading (right side).

2. **Reactive power capability**: The curve helps determine how much reactive power the machine can supply or absorb at a given load.

**Mathematical relationship:**

The armature current is given by:

$$
I_a = \frac{V_t - E_f \cos(\delta) + jE_f \sin(\delta)}{jX_s}
$$

where:
- $V_t$ = terminal voltage
- $E_f$ = excitation emf
- $\delta$ = load angle
- $X_s$ = synchronous reactance

As $I_f$ increases, $E_f$ increases, causing $I_a$ to first decrease (as power factor improves) and then increase (as power factor becomes leading).

---

### Q3. S13-2C: What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

This configuration (rotating field, stationary armature) is standard for large alternators. The advantages are:

1. **Easier insulation of high-voltage windings**: The armature windings carry the generated high voltage (typically 11 kV to 33 kV). Stationary windings are easier to insulate and cool compared to rotating windings.

2. **Simpler slip-ring arrangement**: The field winding requires only DC excitation, which can be supplied through two slip rings carrying relatively low current (typically 100-500 A at 100-500 V). This is much simpler than having three high-voltage slip rings.

3. **Better cooling**: The stationary armature can be cooled more effectively using:
   - Air cooling (for smaller machines)
   - Hydrogen cooling (for medium machines)
   - Water cooling (for large machines)

4. **Reduced centrifugal stress**: The field winding on the rotor experiences centrifugal forces, but since it carries DC (no skin effect), it can be designed with robust construction.

5. **Lower weight on rotor**: The rotor carries only the field winding (lighter), reducing mechanical stress on bearings and shaft.

6. **Easier maintenance**: Stationary armature windings are more accessible for inspection and repair.

---

### Q4. S22-4B: Two alternators of identical rating are required to share a load of 2.5 MW at 0.8 pf lagging. Alternator A has a frequency drop of 1 Hz per MW. Similar data for Alternator B is 1.5 Hz per MW. No-load frequencies are respectively 51.5 Hz and 51 Hz. At what frequency will the system operate and how much load is supplied by each machine.

**Answer:**

**Given:**
- Total load: $P_{total} = 2.5$ MW at 0.8 pf lagging
- Alternator A: Frequency drop = 1 Hz/MW, No-load frequency $f_{0A} = 51.5$ Hz
- Alternator B: Frequency drop = 1.5 Hz/MW, No-load frequency $f_{0B} = 51$ Hz

**Step 1: Write the frequency-load equations**

For each alternator, the operating frequency decreases linearly with load:

$$
f_A = f_{0A} - k_A P_A
$$

$$
f_B = f_{0B} - k_B P_B
$$

where $k_A = 1$ Hz/MW and $k_B = 1.5$ Hz/MW.

**Step 2: At steady state, both alternators operate at the same frequency**

$$
f_A = f_B = f
$$

**Step 3: Express loads in terms of frequency**

From the frequency equations:

$$
P_A = \frac{f_{0A} - f}{k_A} = \frac{51.5 - f}{1}
$$

$$
P_B = \frac{f_{0B} - f}{k_B} = \frac{51 - f}{1.5}
$$

**Step 4: Apply load sharing condition**

$$
P_A + P_B = P_{total} = 2.5
$$

$$
(51.5 - f) + \frac{51 - f}{1.5} = 2.5
$$

**Step 5: Solve for frequency**

$$
51.5 - f + \frac{51}{1.5} - \frac{f}{1.5} = 2.5
$$

$$
51.5 - f + 34 - 0.667f = 2.5
$$

$$
85.5 - 1.667f = 2.5
$$

$$
1.667f = 83
$$

$$
f = \frac{83}{1.667} = 49.8 \text{ Hz}
$$

**Step 6: Calculate individual loads**

$$
P_A = 51.5 - 49.8 = 1.7 \text{ MW}
$$

$$
P_B = \frac{51 - 49.8}{1.5} = \frac{1.2}{1.5} = 0.8 \text{ MW}
$$

**Verification:** $P_A + P_B = 1.7 + 0.8 = 2.5$ MW ✓

**Answer:**
- System operating frequency: **49.8 Hz**
- Alternator A supplies: **1.7 MW**
- Alternator B supplies: **0.8 MW**

---

### Q5. S12-3A: For a synchronous generator, derive suitable expressions for (i) Pitch factor (ii) Distribution factor

**Answer:**

#### (i) Pitch Factor (Coil Span Factor)

**Definition:** The pitch factor ($K_p$ or $K_c$) accounts for the reduction in emf due to the coil span being less than a full pole pitch (180° electrical).

**Derivation:**

Consider a coil with a short-pitch angle of $\alpha$ electrical degrees. The coil span is $(180^\circ - \alpha)$ electrical degrees.

For a full-pitch coil (span = 180°), the emfs in the two coil sides are in phase, so the resultant emf is:

$$
E_{full} = 2E_c
$$

where $E_c$ is the emf per coil side.

For a short-pitch coil, the emfs in the two coil sides have a phase difference of $\alpha$:

[Image: EM1_EM2_Swayam_Numerical_Questions_With_Answers_p1_img-0_jpeg.png — see lecture notes]

<div align="center">
  <em>Figure: Phasor addition of coil-side emfs for short-pitch winding</em>
</div>

The resultant emf is the phasor sum:

$$
E_{short} = 2E_c \cos\left(\frac{\alpha}{2}\right)
$$

The pitch factor is defined as:

$$
K_p = \frac{E_{short}}{E_{full}} = \frac{2E_c \cos(\alpha/2)}{2E_c} = \cos\left(\frac{\alpha}{2}\right)
$$

For the $n^{th}$ harmonic:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

This shows that by choosing $\alpha$ appropriately, specific harmonics can be eliminated. For example, to eliminate the 3rd harmonic, set $\alpha = 120^\circ$:

$$
K_{p3} = \cos\left(\frac{3 \times 120^\circ}{2}\right) = \cos(180^\circ) = 0
$$

#### (ii) Distribution Factor (Breadth Factor)

**Definition:** The distribution factor ($K_d$) accounts for the reduction in emf due to coils being distributed in multiple slots per pole per phase rather than being concentrated in one slot.

**Derivation:**

Let:
- $m$ = number of slots per pole per phase
- $\beta$ = slot angle = $\frac{180^\circ}{\text{slots per pole}}$ electrical degrees

The emfs induced in the $m$ coils are displaced by $\beta$ electrical degrees from each other.

The arithmetic sum of the emfs is:

$$
E_{arithmetic} = mE_c
$$

The phasor sum can be found using the chord of a circle:

$$
E_{phasor} = E_c \times \frac{\sin(m\beta/2)}{\sin(\beta/2)}
$$

The distribution factor is:

$$
K_d = \frac{E_{phasor}}{E_{arithmetic}} = \frac{\sin(m\beta/2)}{m \sin(\beta/2)}
$$

For the $n^{th}$ harmonic:

$$
K_{dn} = \frac{\sin(n m \beta/2)}{m \sin(n \beta/2)}
$$

**Overall winding factor:**

$$
K_w = K_p \times K_d
$$

---

### Q6. S14-1A: Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding

**Answer:**

#### (i) Integral and Fractional Slot Winding

**Integral Slot Winding:**
- The number of slots per pole per phase ($m$) is an integer.
- Example: For a 4-pole, 3-phase machine with 48 slots: $m = \frac{48}{4 \times 3} = 4$ (integer)
- All coils in a phase group are identical and symmetrically placed.
- Simpler to design and manufacture.

**Fractional Slot Winding:**
- The number of slots per pole per phase ($m$) is a fraction.
- Example: For a 10-pole, 3-phase machine with 90 slots: $m = \frac{90}{10 \times 3} = 3$ (fraction)
- Different phase groups may have different numbers of coils.
- Advantages:
  - Reduces cogging torque
  - Eliminates certain harmonics
  - Allows more flexibility in slot/pole combinations
- Disadvantage: More complex winding layout.

#### (ii) Full Pitch and Fractional Pitch Winding

**Full Pitch Winding:**
- The coil span equals one pole pitch (180° electrical).
- Coil span = $\frac{\text{total slots}}{\text{number of poles}}$
- Example: For a 4-pole machine with 48 slots, full pitch = $\frac{48}{4} = 12$ slots
- Gives maximum induced emf per coil.

**Fractional Pitch (Short Pitch) Winding:**
- The coil span is less than one pole pitch (typically 120° to 150° electrical).
- Coil span = $180^\circ - \alpha$, where $\alpha$ is the short-pitch angle.
- Advantages:
  - Reduces harmonic content in the generated emf
  - Saves copper (shorter end connections)
  - Improves waveform quality
- Disadvantage: Slightly reduced fundamental emf (typically 3-5% reduction).

---

### Q7. S22-1A: Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine.

**Answer:**

Short-pitched windings (also called chorded windings) have the coil span less than a full pole pitch (180° electrical). The advantages are:

**1. Harmonic Elimination:**
The pitch factor for the $n^{th}$ harmonic is $K_{pn} = \cos(n\alpha/2)$. By choosing $\alpha$ appropriately, specific harmonics can be reduced or eliminated:
- To eliminate the 3rd harmonic: $\alpha = 120^\circ$ (coil span = 60° electrical)
- To eliminate the 5th harmonic: $\alpha = 72^\circ$ (coil span = 108° electrical)
- A common choice is $\alpha = 30^\circ$ (coil span = 150° electrical), which significantly reduces 5th and 7th harmonics

**2. Improved Voltage Waveform:**
By reducing harmonics, the generated emf waveform becomes closer to a pure sine wave, which is desirable for:
- Reduced heating in connected equipment
- Lower electromagnetic interference
- Better performance of sensitive loads

**3. Copper Saving:**
Short-pitched coils have shorter end connections, reducing:
- Copper weight by 8-15%
- Copper losses in end windings
- Machine size and cost

**4. Reduced Reactance:**
Short pitching reduces the leakage reactance of the winding, improving:
- Voltage regulation
- Short-circuit current capability

**5. Mechanical Advantages:**
Shorter end windings are mechanically stronger and easier to brace against short-circuit forces.

**Trade-off:**
The fundamental emf is slightly reduced by the factor $K_{p1} = \cos(\alpha/2)$. For $\alpha = 30^\circ$, $K_{p1} = \cos(15^\circ) = 0.966$, a reduction of only 3.4%, which is acceptable for the benefits gained.

---

## Numerical Problems

### N1. Q077 | S01-1A: EMF Calculation for Alternator

**Problem:** A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced.

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
\beta = \frac{180^\circ}{\text{slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 4: Calculate slots per pole per phase ($m$)**

$$
m = \frac{\text{total slots}}{3 \times P} = \frac{72}{3 \times 6} = 4
$$

**Step 5: Calculate short-pitch angle ($\alpha$)**

Full pitch = 12 slots
Actual coil span = 10 slots
Short-pitch = 12 - 10 = 2 slots

$$
\alpha = 2 \times \beta = 2 \times 15^\circ = 30^\circ \text{ electrical}
$$

**Step 6: Calculate Distribution Factor ($K_d$)**

$$
K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)}
$$

$$
K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 7: Calculate Pitch Factor ($K_p$)**

$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 8: Calculate Winding Factor ($K_w$)**

$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 9: Calculate Turns per Phase ($T_{ph}$)**

Total conductors = 72 slots × 6 conductors/slot = 432 conductors

For a double-layer winding (2 coil sides per slot):

$$
T_{ph} = \frac{\text{total conductors}}{2 \times 3} = \frac{432}{6} = 72 \text{ turns per phase}
$$

**Step 10: Calculate Phase EMF ($E_{ph}$)**

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
E_{ph} = 4.44 \times 50 \times 17.316
$$

$$
E_{ph} = 4.44 \times 865.8 = 3844.2 \text{ V}
$$

**Step 11: Calculate Line EMF (Star connection)**

$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.2 = 6658.5 \text{ V}
$$

**Answers:**
- Distribution factor ($K_d$): **0.9577**
- Pitch factor ($K_p$): **0.9659**
- Winding factor ($K_w$): **0.9250**
- Turns per phase: **72**
- Phase EMF: **3844.2 V**
- Line EMF: **6658.5 V**

---

### N2. Q078 | S01-2A: Harmonic Suppression in Short-Pitched Winding

**Problem:** A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total no. of armature slots (ii) minimum order of harmonic emf that can be suppressed.

**Solution:**

**Step 1: Determine number of poles**

$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}
$$

**Step 2: Determine slots per pole**

Given coil span = 144° electrical
Full pitch = 180° electrical
Short-pitch angle $\alpha = 180^\circ - 144^\circ = 36^\circ$ electrical

Short-pitch in slots = 2 slots (given)

Slot angle $\beta = \frac{\alpha}{2} = \frac{36^\circ}{2} = 18^\circ$ electrical per slot

**Step 3: Calculate slots per pole**

$$
\text{Slots per pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10
$$

**Step 4: Calculate total number of slots**

$$
\text{Total slots} = \text{Slots per pole} \times P = 10 \times 8 = 80
$$

**Step 5: Determine minimum order of harmonic suppressed**

The pitch factor for the $n^{th}$ harmonic is:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

For harmonic suppression, $K_{pn} = 0$:

$$
\cos\left(\frac{n\alpha}{2}\right) = 0
$$

$$
\frac{n\alpha}{2} = 90^\circ, 270^\circ, ...
$$

$$
n = \frac{180^\circ}{\alpha} = \frac{180^\circ}{36^\circ} = 5
$$

Therefore, the **5th harmonic** is completely suppressed.

**Answers:**
- Total number of armature slots: **80**
- Minimum order of harmonic suppressed: **5th harmonic**

---

### N3. Load Sharing Between Two Alternators

**Problem:** Two alternators rated 2 MW each operate in parallel to supply a total load of 3 MW at 0.85 pf lagging. Alternator A has a frequency regulation of 2% from no-load to full-load, and Alternator B has 3% regulation. The no-load frequency of both machines is 50 Hz. Determine the load shared by each alternator and the system frequency.

**Solution:**

**Step 1: Calculate frequency drops**

For Alternator A:
2% regulation means frequency drops by 2% of 50 Hz at full load (2 MW)
$k_A = \frac{0.02 \times 50}{2} = \frac{1}{2} = 0.5$ Hz/MW

For Alternator B:
3% regulation means frequency drops by 3% of 50 Hz at full load (2 MW)
$k_B = \frac{0.03 \times 50}{2} = \frac{1.5}{2} = 0.75$ Hz/MW

**Step 2: Write frequency-load equations**

$$
f_A = 50 - 0.5P_A
$$

$$
f_B = 50 - 0.75P_B
$$

**Step 3: At steady state, frequencies are equal**

$$
50 - 0.5P_A = 50 - 0.75P_B
$$

$$
0.5P_A = 0.75P_B
$$

$$
P_A = 1.5P_B
$$

**Step 4: Apply load sharing condition**

$$
P_A + P_B = 3
$$

$$
1.5P_B + P_B = 3
$$

$$
2.5P_B = 3
$$

$$
P_B = 1.2 \text{ MW}
$$

$$
P_A = 1.5 \times 1.2 = 1.8 \text{ MW}
$$

**Step 5: Calculate system frequency**

$$
f = 50 - 0.5 \times 1.8 = 50 - 0.9 = 49.1 \text{ Hz}
$$

**Verification:**
$f = 50 - 0.75 \times 1.2 = 50 - 0.9 = 49.1$ Hz ✓

**Answers:**
- Alternator A load: **1.8 MW**
- Alternator B load: **1.2 MW**
- System frequency: **49.1 Hz**

---

### N4. EMF Calculation with Harmonic Analysis

**Problem:** A 3-phase, 50 Hz, 4-pole, star-connected alternator has 48 slots with 10 conductors per slot. The coil span is 10 slots. The flux per pole is 0.12 Wb. Calculate: (i) The fundamental RMS phase EMF (ii) The RMS value of the 5th harmonic phase EMF (iii) The total RMS phase EMF including up to 7th harmonic.

**Solution:**

**Step 1: Calculate basic parameters**

Slots per pole $= \frac{48}{4} = 12$

Slot angle $\beta = \frac{180^\circ}{12} = 15^\circ$ electrical

Slots per pole per phase $m = \frac{48}{3 \times 4} = 4$

Full pitch = 12 slots
Actual coil span = 10 slots
Short-pitch = 2 slots
Short-pitch angle $\alpha = 2 \times 15^\circ = 30^\circ$ electrical

**Step 2: Calculate winding factors for fundamental**

$$
K_{d1} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)} = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = 0.9577
$$

$$
K_{p1} = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659
$$

$$
K_{w1} = 0.9577 \times 0.9659 = 0.9250
$$

**Step 3: Calculate turns per phase**

Total conductors = 48 × 10 = 480

$$
T_{ph} = \frac{480}{2 \times 3} = 80 \text{ turns per phase}
$$

**Step 4: Calculate fundamental EMF**

$$
E_{ph1} = 4.44 \times 50 \times 0.12 \times 80 \times 0.9250
$$

$$
E_{ph1} = 4.44 \times 50 \times 0.12 \times 74
$$

$$
E_{ph1} = 4.44 \times 444 = 1971.4 \text{ V}
$$

**Step 5: Calculate 5th harmonic winding factors**

For $n = 5$:
- Frequency of 5th harmonic: $f_5 = 5 \times 50 = 250$ Hz
- Flux for 5th harmonic: $\phi_5 = \frac{\phi_1}{5} = \frac{0.12}{5} = 0.024$ Wb (assuming sinusoidal flux distribution)

$$
K_{d5} = \frac{\sin(5 \times 4 \times 15^\circ/2)}{4 \times \sin(5 \times 15^\circ/2)} = \frac{\sin(150^\circ)}{4 \times \sin(37.5^\circ)}
$$

$$
K_{d5} = \frac{0.5}{4 \times 0.6088} = \frac{0.5}{2.435} = 0.2053
$$

$$
K_{p5} = \cos\left(\frac{5 \times 30^\circ}{2}\right) = \cos(75^\circ) = 0.2588
$$

$$
K_{w5} = 0.2053 \times 0.2588 = 0.0531
$$

**Step 6: Calculate 5th harmonic EMF**

$$
E_{ph5} = 4.44 \times 250 \times 0.024 \times 80 \times 0.0531
$$

$$
E_{ph5} = 4.44 \times 250 \times 0.024 \times 4.248
$$

$$
E_{ph5} = 4.44 \times 25.49 = 113.2 \text{ V}
$$

**Step 7: Calculate 7th harmonic winding factors**

For $n = 7$:
- Frequency: $f_7 = 7 \times 50 = 350$ Hz
- Flux: $\phi_7 = \frac{0.12}{7} = 0.01714$ Wb

$$
K_{d7} = \frac{\sin(7 \times 4 \times 15^\circ/2)}{4 \times \sin(7 \times 15^\circ/2)} = \frac{\sin(210^\circ)}{4 \times \sin(52.5^\circ)}
$$

$$
K_{d7} = \frac{-0.5}{4 \times 0.7934} = \frac{-0.5}{3.174} = -0.1575
$$

$$
K_{p7} = \cos\left(\frac{7 \times 30^\circ}{2}\right) = \cos(105^\circ) = -0.2588
$$

$$
K_{w7} = (-0.1575) \times (-0.2588) = 0.0408
$$

**Step 8: Calculate 7th harmonic EMF**

$$
E_{ph7} = 4.44 \times 350 \times 0.01714 \times 80 \times 0.0408
$$

$$
E_{ph7} = 4.44 \times 350 \times 0.01714 \times 3.264
$$

$$
E_{ph7} = 4.44 \times 19.58 = 86.9 \text{ V}
$$

**Step 9: Calculate total RMS phase EMF**

$$
E_{ph(total)} = \sqrt{E_{ph1}^2 + E_{ph5}^2 + E_{ph7}^2}
$$

$$
E_{ph(total)} = \sqrt{1971.4^2 + 113.2^2 + 86.9^2}
$$

$$
E_{ph(total)} = \sqrt{3,886,418 + 12,814 + 7,552}
$$

$$
E_{ph(total)} = \sqrt{3,906,784} = 1976.6 \text{ V}
$$

**Answers:**
- Fundamental RMS phase EMF: **1971.4 V**
- 5th harmonic RMS phase EMF: **113.2 V**
- Total RMS phase EMF (up to 7th harmonic): **1976.6 V**

---

## Quick Quiz

### Q1. What is the condition for a synchronous machine to operate at unity power factor?

**Answer:** A synchronous machine operates at unity power factor when the field excitation is adjusted such that the induced EMF ($E_f$) and the terminal voltage ($V_t$) satisfy the condition where the armature current ($I_a$) is in phase with the terminal voltage. This occurs at the minimum point of the V-curve, where the machine neither supplies nor absorbs reactive power.

---

### Q2. Why is the distribution factor always less than 1?

**Answer:** The distribution factor is less than 1 because the emfs induced in different coils under the same pole are displaced in phase by the slot angle ($\beta$). When these emfs are added as phasors (vector sum), the resultant is less than the arithmetic sum. Only if all coils were concentrated in the same slot ($\beta = 0$) would the distribution factor be 1.

---

### Q3. What is the significance of the short-pitch angle $\alpha = 120^\circ$ electrical?

**Answer:** When $\alpha = 120^\circ$ electrical (coil span = 60° electrical), the pitch factor for the 3rd harmonic becomes:
$$K_{p3} = \cos\left(\frac{3 \times 120^\circ}{2}\right) = \cos(180^\circ) = 0$$
This completely eliminates the 3rd harmonic from the generated EMF. This is particularly important because the 3rd harmonic causes distortion in the phase voltage and can lead to circulating currents in delta-connected windings.

---

### Q4. In parallel operation of alternators, what determines the load sharing between machines?

**Answer:** The load sharing between alternators operating in parallel is determined by their **droop characteristics** (frequency vs. power curves). The machine with a steeper droop (higher frequency drop per MW) takes less load, while the machine with a flatter droop takes more load. The system frequency settles at the point where the sum of individual loads equals the total load demand.

---

### Q5. What is the difference between synchronous and asynchronous machines regarding reactive power capability?

**Answer:** Synchronous machines can operate at any power factor (lagging, unity, or leading) by adjusting the DC field excitation. This is because they have an independent source of reactive power (the field winding). Asynchronous (induction) machines always operate at lagging power factor because they must draw magnetizing current from the supply to establish the air-gap flux. They cannot generate leading reactive power without external assistance (e.g., capacitor banks or STATCOM).