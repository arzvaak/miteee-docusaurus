---
sidebar_position: 5.5
title: "Week 5: Practice Questions"
---

# Week 5: Practice Questions

## Previous Year Questions

### Q1. S06-1C: 'Unlike asynchronous machines, Synchronous machines can be operated at different power factors'. Justify this statement with the help of necessary characteristics.

**Answer:**

This statement is justified by understanding the fundamental difference in how synchronous and asynchronous machines interact with the power system.

**Synchronous Machine Operation:**
- A synchronous machine has a **separately excited DC field winding** on the rotor
- By controlling the DC field current ($I_f$), we can control the induced EMF ($E_f$)
- The power factor is determined by the relationship between $E_f$ and terminal voltage $V_t$

**V-Curves Characteristic:**
The V-curves show the relationship between armature current ($I_a$) and field current ($I_f$) for different power factors:

- **Normal excitation ($E_f = V_t$):** Unity power factor operation
- **Over-excitation ($E_f > V_t$):** Lagging power factor (machine supplies reactive power)
- **Under-excitation ($E_f < V_t$):** Leading power factor (machine absorbs reactive power)

**Asynchronous (Induction) Machine:**
- The rotor current is induced by slip, not externally controlled
- The machine always draws lagging reactive power from the supply for magnetization
- Power factor cannot be independently controlled; it varies with load

**Key Justification:**
The synchronous machine's ability to vary field excitation allows it to operate at any power factor (leading, lagging, or unity), making it valuable for power factor correction in power systems.

---

### Q2. S07-4A: 'V' and 'inverted V' curves have significant importance in analyzing the behaviors of synchronous machines. Justify this statement suitably.

**Answer:**

**V-Curves:**
V-curves plot **armature current ($I_a$)** versus **field current ($I_f$)** for constant load power.

[Image: lec5_p1_img-1.png — see lecture notes]

<div align="center">
  <em>Figure: Typical V-curves for a synchronous motor at different load levels</em>
</div>

**Significance:**
1. **Minimum armature current** occurs at unity power factor (bottom of the V)
2. **Over-excited region** (right side): Machine supplies lagging VARs (acts as capacitor)
3. **Under-excited region** (left side): Machine absorbs lagging VARs (acts as inductor)
4. **Stability limit**: The left boundary indicates the minimum excitation before the machine loses synchronism

**Inverted V-Curves:**
Inverted V-curves plot **power factor** versus **field current** for constant load.

**Significance:**
1. Shows how power factor varies with excitation
2. Unity power factor occurs at the peak of the inverted V
3. Helps determine the field current needed for desired power factor operation
4. Critical for power system voltage control applications

**Practical Importance:**
- Used to determine optimal excitation for minimum losses
- Essential for synchronous condenser operation (reactive power compensation)
- Helps in troubleshooting excitation system problems

---

### Q3. S13-2C: What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

The arrangement of field on rotor and armature on stator offers several key advantages:

1. **Easier insulation of high-voltage windings:**
   - The 3-phase armature windings carry the generated high voltage (typically 11 kV or higher)
   - Stationary windings are easier to insulate and cool compared to rotating windings
   - Slip rings and brushes are only needed for the low-voltage DC field (typically 100-500 V)

2. **Simpler power extraction:**
   - High-power output (hundreds of MW) is taken from stationary terminals
   - No need for slip rings or brushes on the high-voltage side
   - Reduces sparking, maintenance, and safety hazards

3. **Better mechanical stability:**
   - The rotor carries only the lightweight DC field winding
   - The rotor can be designed for high-speed operation (3000 rpm for 50 Hz, 2-pole)
   - The heavy armature winding is stationary, reducing centrifugal forces

4. **Improved cooling:**
   - Stationary armature can be more effectively cooled using water or hydrogen cooling
   - Rotor cooling is simpler as only low-current field winding needs cooling

5. **Reduced brush gear:**
   - Only two slip rings needed for DC excitation (low current, low voltage)
   - For large machines, brushless excitation systems can eliminate slip rings entirely

---

### Q4. S22-4B: Two alternators of identical rating are required to share a load of 2.5 MW at 0.8 pf lagging. Alternator A has a frequency drop of 1 Hz per MW. Similar data for Alternator B is 1.5 Hz per MW. No-load frequencies are respectively 51.5 Hz and 51 Hz. At what frequency will the system operate and how much load is supplied by each machine.

**Answer:**

**Given Data:**
- Total load: $P_L = 2.5$ MW at 0.8 pf lagging
- Alternator A: Frequency drop = 1 Hz/MW, No-load frequency $f_{0A} = 51.5$ Hz
- Alternator B: Frequency drop = 1.5 Hz/MW, No-load frequency $f_{0B} = 51$ Hz

**Step 1: Write the frequency-load characteristics**

For alternator A:
$$f_A = f_{0A} - k_A P_A$$
$$f_A = 51.5 - 1.0 \times P_A$$

For alternator B:
$$f_B = f_{0B} - k_B P_B$$
$$f_B = 51 - 1.5 \times P_B$$

**Step 2: At steady state, both alternators operate at the same frequency**
$$f_A = f_B = f$$

**Step 3: Load sharing equation**
$$P_A + P_B = 2.5 \text{ MW}$$

**Step 4: Solve for $P_A$ and $P_B$**

From frequency equations:
$$P_A = 51.5 - f$$
$$P_B = \frac{51 - f}{1.5}$$

Substituting into load equation:
$$(51.5 - f) + \frac{51 - f}{1.5} = 2.5$$

Multiply by 1.5:
$$1.5(51.5 - f) + (51 - f) = 3.75$$
$$77.25 - 1.5f + 51 - f = 3.75$$
$$128.25 - 2.5f = 3.75$$
$$2.5f = 124.5$$
$$f = 49.8 \text{ Hz}$$

**Step 5: Calculate individual loads**
$$P_A = 51.5 - 49.8 = 1.7 \text{ MW}$$
$$P_B = \frac{51 - 49.8}{1.5} = \frac{1.2}{1.5} = 0.8 \text{ MW}$$

**Verification:** $P_A + P_B = 1.7 + 0.8 = 2.5$ MW ✓

**Answer:**
- System operating frequency: **49.8 Hz**
- Alternator A supplies: **1.7 MW**
- Alternator B supplies: **0.8 MW**

---

### Q5. S12-3A: For a synchronous generator, derive suitable expressions for (i) Pitch factor (ii) Distribution factor

**Answer:**

#### (i) Pitch Factor ($K_p$)

**Definition:** The pitch factor accounts for the reduction in EMF due to the coil span being less than the full pole pitch (180° electrical).

**Derivation:**

Consider a coil with short-pitch angle $\alpha$ (electrical degrees), where the coil span is $(180^\circ - \alpha)$ instead of $180^\circ$.

For a full-pitch coil, the EMF in the two coil sides are:
$$E_1 = E_m \sin(\omega t)$$
$$E_2 = E_m \sin(\omega t - 180^\circ) = -E_m \sin(\omega t)$$

Resultant EMF for full-pitch: $E_{full} = 2E_m$

For a short-pitch coil with angle $\alpha$:
$$E_1 = E_m \sin(\omega t)$$
$$E_2 = E_m \sin(\omega t - 180^\circ + \alpha) = -E_m \sin(\omega t - \alpha)$$

Resultant EMF:
$$E_{short} = E_m \sin(\omega t) - [-E_m \sin(\omega t - \alpha)]$$
$$E_{short} = E_m [\sin(\omega t) + \sin(\omega t - \alpha)]$$

Using trigonometric identity:
$$E_{short} = 2E_m \cos\left(\frac{\alpha}{2}\right) \sin\left(\omega t - \frac{\alpha}{2}\right)$$

**Pitch factor:**
$$K_p = \frac{\text{EMF with short pitch}}{\text{EMF with full pitch}} = \frac{2E_m \cos(\alpha/2)}{2E_m} = \cos\left(\frac{\alpha}{2}\right)$$

For the $n^{th}$ harmonic:
$$K_{pn} = \cos\left(\frac{n\alpha}{2}\right)$$

#### (ii) Distribution Factor ($K_d$)

**Definition:** The distribution factor accounts for the reduction in EMF because coils are distributed in several slots rather than concentrated in one slot.

**Derivation:**

Let:
- $m$ = number of slots per pole per phase
- $\beta$ = slot angle (electrical degrees between adjacent slots) = $\frac{180^\circ}{\text{slots per pole}}$

The EMFs in the $m$ coils are displaced by angle $\beta$:
$$E_1 = E \angle 0^\circ$$
$$E_2 = E \angle \beta$$
$$E_3 = E \angle 2\beta$$
$$\vdots$$
$$E_m = E \angle (m-1)\beta$$

**Phasor sum** (resultant EMF):
$$E_R = E \times \frac{\sin(m\beta/2)}{\sin(\beta/2)}$$

**Arithmetic sum:**
$$E_{arith} = mE$$

**Distribution factor:**
$$K_d = \frac{\text{Phasor sum}}{\text{Arithmetic sum}} = \frac{E \cdot \sin(m\beta/2)/\sin(\beta/2)}{mE}$$

$$\boxed{K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)}}$$

For the $n^{th}$ harmonic:
$$K_{dn} = \frac{\sin(n m \beta/2)}{m \sin(n \beta/2)}$$

**Winding factor:** $K_w = K_p \times K_d$

---

### Q6. S14-1A: Define the following: (i) Integral and Fractional slot winding (ii) Full pitch and Fractional pitch winding

**Answer:**

#### (i) Integral and Fractional Slot Winding

**Integral Slot Winding:**
- The number of slots per pole per phase ($m$) is an **integer**
- Example: $m = 4$ slots/pole/phase
- All coils in a phase group are identical
- Simpler to design and manufacture
- Produces a balanced winding

**Fractional Slot Winding:**
- The number of slots per pole per phase ($m$) is a **fraction**
- Example: $m = 3.5$ slots/pole/phase
- Coil groups may have different numbers of coils
- Used to:
  - Reduce harmonic content in the EMF waveform
  - Achieve a specific voltage with limited slot count
  - Reduce cogging torque in machines
- More complex design but better harmonic performance

#### (ii) Full Pitch and Fractional Pitch Winding

**Full Pitch Winding:**
- Coil span = Pole pitch = $180^\circ$ electrical
- Coil sides are exactly one pole pitch apart
- Pitch factor $K_p = \cos(0^\circ/2) = 1$
- Maximum EMF is induced
- However, higher harmonics are not suppressed

**Fractional (Short) Pitch Winding:**
- Coil span < Pole pitch (typically $120^\circ$ to $160^\circ$ electrical)
- Coil span is less than one pole pitch
- Pitch factor $K_p = \cos(\alpha/2) < 1$
- Advantages:
  - Reduces harmonic content (especially $5^{th}$ and $7^{th}$ harmonics)
  - Saves copper (shorter end connections)
  - Improves waveform quality
  - Reduces noise and vibration
- Disadvantage: Slight reduction in fundamental EMF

---

### Q7. S22-1A: Discuss the advantages of adopting short pitched windings for the armature of a synchronous machine.

**Answer:**

Short-pitched windings (coil span < 180° electrical) offer several significant advantages:

**1. Harmonic Suppression:**
The pitch factor for the $n^{th}$ harmonic is:
$$K_{pn} = \cos\left(\frac{n\alpha}{2}\right)$$

By choosing $\alpha$ appropriately, specific harmonics can be eliminated:
- For $\alpha = 60^\circ$: $K_{p5} = \cos(5 \times 30^\circ) = \cos 150^\circ = -0.866$ (reduced but not eliminated)
- For $\alpha = 36^\circ$: $K_{p5} = \cos(5 \times 18^\circ) = \cos 90^\circ = 0$ (5th harmonic eliminated)
- For $\alpha = 25.7^\circ$: $K_{p7} = \cos(7 \times 12.85^\circ) \approx \cos 90^\circ = 0$ (7th harmonic eliminated)

Common practice: Use $\alpha = 30^\circ$ to reduce both 5th and 7th harmonics significantly.

**2. Improved Voltage Waveform:**
- Reduced harmonics produce a more sinusoidal EMF waveform
- Better power quality for connected loads
- Reduced heating effects from harmonic currents

**3. Copper Saving:**
- Shorter end connections mean less copper per coil
- Reduced winding resistance → lower $I^2R$ losses
- More compact machine design

**4. Reduced Noise and Vibration:**
- Harmonic magnetic fields cause torque pulsations and vibration
- Suppressing harmonics reduces audible noise and mechanical stress

**5. Improved Efficiency:**
- Lower copper losses from shorter end windings
- Reduced harmonic losses in the core

**Trade-off:** The fundamental EMF is slightly reduced ($K_p = \cos(\alpha/2) < 1$), but the benefits usually outweigh this small reduction.

---

## Numerical Problems

### N1. Q077 | S01-1A: EMF Calculation for Alternator

**Problem:** A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced.

**Solution:**

**Step 1: Determine number of poles**
$$P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6 \text{ poles}$$

**Step 2: Calculate slots per pole**
$$\text{Slots per pole} = \frac{72}{6} = 12$$

**Step 3: Calculate slot angle ($\beta$)**
$$\beta = \frac{180^\circ}{\text{slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}$$

**Step 4: Calculate slots per pole per phase ($m$)**
$$m = \frac{\text{slots per pole}}{3} = \frac{12}{3} = 4$$

**Step 5: Calculate short-pitch angle ($\alpha$)**
Full pitch = 12 slots
Actual coil span = 10 slots
Shortening = 12 - 10 = 2 slots
$$\alpha = 2 \times \beta = 2 \times 15^\circ = 30^\circ \text{ electrical}$$

**Step 6: Calculate distribution factor ($K_d$)**
$$K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)}$$
$$K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.5221} = 0.9577$$

**Step 7: Calculate pitch factor ($K_p$)**
$$K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659$$

**Step 8: Calculate winding factor ($K_w$)**
$$K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250$$

**Step 9: Calculate turns per phase ($T_{ph}$)**
Total conductors = 72 slots × 6 conductors/slot = 432 conductors
For 3-phase star connection:
$$T_{ph} = \frac{\text{Total conductors}}{2 \times 3} = \frac{432}{6} = 72 \text{ turns/phase}$$

**Step 10: Calculate phase EMF ($E_{ph}$)**
$$E_{ph} = 4.44 \times f \times \phi \times T_{ph} \times K_w$$
$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$
$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$
$$E_{ph} = 4.44 \times 50 \times 17.316$$
$$E_{ph} = 3844.3 \text{ V}$$

**Step 11: Calculate line EMF ($E_L$)**
For star connection:
$$E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.3 = 6658.5 \text{ V}$$

**Answers:**
- Distribution factor ($K_d$): **0.9577**
- Pitch factor ($K_p$): **0.9659**
- Winding factor ($K_w$): **0.9250**
- Turns per phase: **72 turns**
- Phase EMF: **3844.3 V**
- Line EMF: **6658.5 V**

---

### N2. Q078 | S01-2A: Short-Pitched Winding Analysis

**Problem:** A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total number of armature slots (ii) minimum order of harmonic emf that can be suppressed.

**Solution:**

**Step 1: Determine number of poles**
$$P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}$$

**Step 2: Calculate slots per pole**
Coil span = 144° electrical
Full pitch = 180° electrical
Shortening = 180° - 144° = 36° electrical
Shortening in slots = 2 slots (given)

Slot angle:
$$\beta = \frac{36^\circ}{2} = 18^\circ \text{ electrical per slot}$$

Slots per pole:
$$\text{Slots per pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10$$

**Step 3: Calculate total slots**
$$\text{Total slots} = \text{Slots per pole} \times P = 10 \times 8 = 80 \text{ slots}$$

**Step 4: Determine minimum harmonic order suppressed**
Short-pitch angle $\alpha = 36^\circ$ electrical

For harmonic suppression, $K_{pn} = 0$:
$$\cos\left(\frac{n\alpha}{2}\right) = 0$$
$$\frac{n\alpha}{2} = 90^\circ, 270^\circ, ...$$
$$\frac{n \times 36^\circ}{2} = 90^\circ$$
$$n \times 18^\circ = 90^\circ$$
$$n = 5$$

**Answers:**
- Total number of armature slots: **80 slots**
- Minimum order of harmonic suppressed: **5th harmonic**

---

### N3. Load Sharing Between Alternators

**Problem:** Two alternators rated 2 MVA each operate in parallel. Alternator A has a droop of 3% from no-load to full-load, and Alternator B has a droop of 4%. The no-load frequency is 50 Hz for both. If they supply a total load of 3 MW at 0.9 pf lagging, determine the load sharing and operating frequency.

**Solution:**

**Step 1: Calculate frequency drops per MW**
For 2 MVA at 0.9 pf: Full load power = $2 \times 0.9 = 1.8$ MW

Alternator A: 3% of 50 Hz = 1.5 Hz drop for 1.8 MW
$$k_A = \frac{1.5}{1.8} = 0.8333 \text{ Hz/MW}$$

Alternator B: 4% of 50 Hz = 2 Hz drop for 1.8 MW
$$k_B = \frac{2}{1.8} = 1.1111 \text{ Hz/MW}$$

**Step 2: Write frequency equations**
$$f = 50 - 0.8333 P_A$$
$$f = 50 - 1.1111 P_B$$

**Step 3: Load sharing equation**
$$P_A + P_B = 3 \text{ MW}$$

**Step 4: Solve**
From frequency equations:
$$P_A = \frac{50 - f}{0.8333}$$
$$P_B = \frac{50 - f}{1.1111}$$

Substituting:
$$\frac{50 - f}{0.8333} + \frac{50 - f}{1.1111} = 3$$
$$(50 - f)\left(\frac{1}{0.8333} + \frac{1}{1.1111}\right) = 3$$
$$(50 - f)(1.2 + 0.9) = 3$$
$$(50 - f)(2.1) = 3$$
$$50 - f = 1.4286$$
$$f = 48.5714 \text{ Hz}$$

**Step 5: Calculate individual loads**
$$P_A = \frac{50 - 48.5714}{0.8333} = \frac{1.4286}{0.8333} = 1.7143 \text{ MW}$$
$$P_B = \frac{50 - 48.5714}{1.1111} = \frac{1.4286}{1.1111} = 1.2857 \text{ MW}$$

**Verification:** $1.7143 + 1.2857 = 3.0$ MW ✓

**Answers:**
- Operating frequency: **48.57 Hz**
- Alternator A load: **1.714 MW**
- Alternator B load: **1.286 MW**

---

### N4. EMF Calculation with Fractional Slot Winding

**Problem:** A 3-phase, 50 Hz, 600 rpm alternator has 180 slots with 4 conductors per slot. The coil span is 15 slots. The flux per pole is 0.15 Wb. Calculate the phase and line EMF if the winding is star connected.

**Solution:**

**Step 1: Determine number of poles**
$$P = \frac{120f}{N_s} = \frac{120 \times 50}{600} = 10 \text{ poles}$$

**Step 2: Calculate slots per pole**
$$\text{Slots per pole} = \frac{180}{10} = 18$$

**Step 3: Calculate slot angle ($\beta$)**
$$\beta = \frac{180^\circ}{18} = 10^\circ \text{ electrical}$$

**Step 4: Calculate slots per pole per phase ($m$)**
$$m = \frac{18}{3} = 6$$

**Step 5: Calculate short-pitch angle ($\alpha$)**
Full pitch = 18 slots
Actual coil span = 15 slots
Shortening = 18 - 15 = 3 slots
$$\alpha = 3 \times 10^\circ = 30^\circ \text{ electrical}$$

**Step 6: Calculate distribution factor ($K_d$)**
$$K_d = \frac{\sin(m\beta/2)}{m \sin(\beta/2)} = \frac{\sin(6 \times 10^\circ/2)}{6 \times \sin(10^\circ/2)}$$
$$K_d = \frac{\sin(30^\circ)}{6 \times \sin(5^\circ)} = \frac{0.5}{6 \times 0.08716} = \frac{0.5}{0.52296} = 0.9561$$

**Step 7: Calculate pitch factor ($K_p$)**
$$K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659$$

**Step 8: Calculate winding factor ($K_w$)**
$$K_w = K_d \times K_p = 0.9561 \times 0.9659 = 0.9235$$

**Step 9: Calculate turns per phase ($T_{ph}$)**
Total conductors = 180 × 4 = 720
$$T_{ph} = \frac{720}{2 \times 3} = 120 \text{ turns/phase}$$

**Step 10: Calculate phase EMF ($E_{ph}$)**
$$E_{ph} = 4.44 \times f \times \phi \times T_{ph} \times K_w$$
$$E_{ph} = 4.44 \times 50 \times 0.15 \times 120 \times 0.9235$$
$$E_{ph} = 4.44 \times 50 \times 16.623$$
$$E_{ph} = 3690.3 \text{ V}$$

**Step 11: Calculate line EMF ($E_L$)**
$$E_L = \sqrt{3} \times 3690.3 = 6391.8 \text{ V}$$

**Answers:**
- Phase EMF: **3690.3 V**
- Line EMF: **6391.8 V**

---

## Quick Quiz

### Q1. What is the synchronous speed of a 4-pole, 50 Hz alternator?

**Answer:**
$$N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500 \text{ rpm}$$

---

### Q2. What is the pitch factor for a coil with a short-pitch angle of 36° electrical?

**Answer:**
$$K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{36^\circ}{2}\right) = \cos(18^\circ) = 0.9511$$

---

### Q3. Why is the armature winding placed on the stator in large alternators?

**Answer:**
- High-voltage windings are easier to insulate when stationary
- Power extraction is simpler (no slip rings for high voltage)
- Better mechanical stability and cooling
- Reduced brush gear maintenance

---

### Q4. What is the effect of short-pitching on the 5th harmonic EMF?

**Answer:**
The pitch factor for the 5th harmonic is:
$$K_{p5} = \cos\left(\frac{5\alpha}{2}\right)$$

If $\alpha = 36^\circ$, then $K_{p5} = \cos(5 \times 18^\circ) = \cos(90^\circ) = 0$, completely eliminating the 5th harmonic.

---

### Q5. What is the difference between integral slot and fractional slot windings?

**Answer:**
- **Integral slot winding:** $m$ (slots/pole/phase) is an integer → simpler design, identical coil groups
- **Fractional slot winding:** $m$ is a fraction → better harmonic suppression, more design flexibility, but more complex manufacturing