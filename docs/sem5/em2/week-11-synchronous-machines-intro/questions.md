---
sidebar_position: 11.5
title: "Week 11: Practice Questions"
---

# Week 11: Practice Questions

## Previous Year Questions

### Q1. S06-1C: "Unlike asynchronous machines, Synchronous machines can be operated at different power factors". Justify this statement with the help of necessary characteristics.

**Answer:**

This statement highlights a fundamental advantage of synchronous machines over induction machines. Let's analyze why:

**For Induction Motors (Asynchronous Machines):**
- An induction motor always operates at a **lagging power factor** because it draws magnetizing current from the AC supply to establish the rotating magnetic field
- The magnetizing reactance is inductive, causing the current to lag the voltage
- The power factor varies with load but is always lagging (typically 0.7-0.9 lagging at full load, worse at light load)

**For Synchronous Machines:**
- The field winding is on the rotor and is excited by a **separate DC source**
- The magnetizing current is supplied by the DC field, NOT from the AC supply
- By adjusting the DC field excitation, the synchronous machine can operate at:
  - **Unity power factor** (normal excitation)
  - **Lagging power factor** (over-excited — behaves like an inductor)
  - **Leading power factor** (under-excited — behaves like a capacitor)

**V-curves** (shown in Q2) demonstrate this behavior: for a given load, as field excitation varies, the armature current changes, and the power factor shifts from lagging through unity to leading.

**Practical Significance:**
- Synchronous motors can be over-excited to operate at leading power factor, thereby **improving the overall power factor** of an industrial plant
- This capability makes synchronous motors valuable for power factor correction applications

---

### Q2. S07-4A | 04 marks: 'V' and 'inverted V' curves have significant importance in analyzing the behaviors of synchronous machines. Justify this statement suitably.

**Answer:**

**V-curves** and **inverted V-curves** are graphical representations that show the relationship between field excitation and armature current/power factor in synchronous machines.

**V-Curves:**
- Plot: Armature current ($I_a$) vs. Field current ($I_f$) for constant load
- Shape: They look like the letter "V" (hence the name)
- For a given load:
  - At **under-excitation** (low $I_f$): Armature current is high, power factor is lagging
  - At **normal excitation**: Armature current is minimum, power factor is unity
  - At **over-excitation** (high $I_f$): Armature current increases again, power factor becomes leading
- Multiple V-curves exist for different load levels (no-load, half-load, full-load)

**Inverted V-Curves:**
- Plot: Power factor ($\cos\phi$) vs. Field current ($I_f$) for constant load
- Shape: Inverted "V" (or inverted "U")
- Shows how power factor varies from lagging → unity → leading as excitation increases

**Significance:**
1. **Determining minimum excitation**: The bottom of the V-curve gives the field current for unity power factor operation
2. **Stability assessment**: The left side of the V-curve (under-excited region) is the unstable region — reducing excitation too much can cause the machine to lose synchronism
3. **Power factor control**: Shows the range of power factor achievable by varying excitation
4. **Load capability**: Different V-curves for different loads help determine safe operating limits
5. **Synchronous condenser operation**: For a synchronous motor running at no-load, over-excitation makes it behave as a capacitor (leading power factor), useful for power factor correction

---

### Q3. S13-2C | 02 marks: What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

For large alternators (synchronous generators), the field system is placed on the rotor and the armature (3-phase) windings on the stator for the following reasons:

1. **Easier insulation of high-voltage windings**: The armature windings carry the generated high voltage (typically 11 kV or higher). Placing them on the stationary stator makes insulation easier and more reliable compared to rotating high-voltage windings.

2. **Simpler power extraction**: The high-power output (hundreds of MW) is taken from stationary terminals, avoiding the need for slip rings and brushes to carry large currents.

3. **Lower centrifugal forces on heavy windings**: The field winding carries relatively low DC voltage and current, making it lighter and easier to mount on the rotor.

4. **Better cooling**: The stator can be more easily cooled with water or hydrogen cooling systems since it doesn't rotate.

5. **Reduced brush gear requirements**: Only the low-power DC field excitation needs to be supplied through slip rings, which is simpler and more reliable.

6. **Mechanical stability**: The rotor construction is simpler with concentrated field windings (salient poles) or distributed windings (cylindrical rotor), optimized for high-speed rotation.

---

### Q4. S22-4B | 03 marks: Two alternators of identical rating are required to share a load of 2.5 MW at 0.8 pf lagging. Alternator A has a frequency drop of 1 Hz per MW. Similar data for Alternator B is 1.5 Hz per MW. No-load frequencies are respectively 51.5 Hz and 51 Hz. At what frequency will the system operate and how much load is supplied by each machine.

**Answer:**

This is a problem on **load sharing between parallel alternators** based on their droop characteristics.

**Given:**
- Total load: $P_{total} = 2.5$ MW at 0.8 pf lagging
- Alternator A: Frequency drop = 1 Hz/MW, No-load frequency $f_{0A} = 51.5$ Hz
- Alternator B: Frequency drop = 1.5 Hz/MW, No-load frequency $f_{0B} = 51$ Hz

**Step 1: Write the frequency-load equations**

For each alternator, the operating frequency decreases linearly with load:

$$
f = f_0 - (\text{droop}) \times P
$$

For Alternator A:
$$
f = 51.5 - 1 \times P_A
$$

For Alternator B:
$$
f = 51 - 1.5 \times P_B
$$

**Step 2: Both alternators operate at the same system frequency**

Since they are connected in parallel, they must run at the same frequency $f$.

$$
51.5 - P_A = 51 - 1.5P_B
$$

$$
51.5 - P_A = 51 - 1.5P_B
$$

$$
0.5 = P_A - 1.5P_B
$$

$$
P_A - 1.5P_B = 0.5 \quad \text{(Equation 1)}
$$

**Step 3: Total load equation**

$$
P_A + P_B = 2.5 \quad \text{(Equation 2)}
$$

**Step 4: Solve the equations**

From Equation 2: $P_A = 2.5 - P_B$

Substitute into Equation 1:

$$
(2.5 - P_B) - 1.5P_B = 0.5
$$

$$
2.5 - 2.5P_B = 0.5
$$

$$
-2.5P_B = 0.5 - 2.5 = -2
$$

$$
P_B = \frac{2}{2.5} = 0.8 \text{ MW}
$$

Then:
$$
P_A = 2.5 - 0.8 = 1.7 \text{ MW}
$$

**Step 5: Calculate system frequency**

Using Alternator A's equation:
$$
f = 51.5 - 1 \times 1.7 = 49.8 \text{ Hz}
$$

**Verification** with Alternator B:
$$
f = 51 - 1.5 \times 0.8 = 51 - 1.2 = 49.8 \text{ Hz} \quad \checkmark
$$

**Answer:**
- System frequency: **49.8 Hz**
- Alternator A supplies: **1.7 MW**
- Alternator B supplies: **0.8 MW**

---

### Q5. S01-2B | 03 marks: With the aid of MMF diagram, prove that the terminal voltage is greater than its excitation emf when a pure capacitive load is connected across its terminals.

**Answer:**

**Understanding Armature Reaction for Capacitive Load:**

When a synchronous generator supplies a **pure capacitive load**, the load current **leads** the generated EMF by $90^\circ$ (since capacitor current leads voltage by $90^\circ$).

**Step 1: Phasor Relationship**

For a pure capacitive load:
- Terminal voltage $V_t$ lags behind the excitation EMF $E_f$ (for generator action)
- Armature current $I_a$ leads $V_t$ by $90^\circ$

**Step 2: MMF Diagram Analysis**

The MMF diagram shows:
- **Field MMF** ($F_f$): Produced by DC field excitation, creates the main flux
- **Armature MMF** ($F_a$): Produced by armature current, causes armature reaction
- **Resultant MMF** ($F_r$): $F_r = F_f + F_a$ (phasor sum)

For capacitive load:
- $I_a$ leads $E_f$ by $90^\circ$
- The armature MMF $F_a$ is in phase with $I_a$
- Therefore, $F_a$ is at $90^\circ$ leading with respect to $E_f$
- This means $F_a$ is **magnetizing** — it aids the field MMF

**Step 3: Effect on Terminal Voltage**

Since $F_a$ aids $F_f$:
- The resultant flux $\phi_r$ is **larger** than the field flux $\phi_f$ alone
- The induced EMF $E \propto \phi$
- Terminal voltage $V_t \approx E$ (neglecting resistance and leakage reactance)

Therefore:
$$
V_t > E_f
$$

**Conclusion:** For a pure capacitive load, the armature reaction is **magnetizing**, which increases the net flux and hence the terminal voltage exceeds the excitation EMF. This is why synchronous generators have **negative voltage regulation** for leading power factor loads.

---

### Q6. S03-3A | 05 marks: Describe the operation of alternator with constant excitation and variable load with suitable phasor diagrams. What is the significance of the condition with minimum excitation? Analyze the relation between power factor and excitation with the help of suitable curve.

**Answer:**

**Operation with Constant Excitation and Variable Load:**

When a synchronous generator operates with **constant field excitation** but **varying load**, the following changes occur:

**Case 1: Unity Power Factor Load**
- Armature current $I_a$ is in phase with terminal voltage $V_t$
- The phasor diagram shows $E_f = V_t + jI_aX_s$ (neglecting resistance)
- $E_f$ leads $V_t$ by the load angle $\delta$

**Case 2: Lagging Power Factor Load**
- $I_a$ lags $V_t$ by angle $\phi$
- The armature reaction is **demagnetizing** (opposes field flux)
- To maintain the same terminal voltage, $E_f$ must be larger
- The load angle $\delta$ increases

**Case 3: Leading Power Factor Load**
- $I_a$ leads $V_t$ by angle $\phi$
- The armature reaction is **magnetizing** (aids field flux)
- $E_f$ can be smaller for the same $V_t$
- The load angle $\delta$ decreases

**Significance of Minimum Excitation:**

The **minimum excitation** condition occurs when the field current is reduced to the point where:
- The machine is at the verge of losing synchronism
- The load angle $\delta$ approaches $90^\circ$ (theoretical stability limit)
- Any further reduction in excitation causes the machine to pull out of synchronism

This is critical because:
1. It defines the **steady-state stability limit** of the generator
2. Operating too close to minimum excitation risks instability during disturbances
3. The minimum excitation limiter (MEL) in excitation systems prevents operation below this limit

**Relation between Power Factor and Excitation:**

The **V-curve** (shown conceptually) demonstrates this relationship:

- For a given load (constant real power $P$):
  - **Under-excited**: Low $I_f$, lagging pf, high $I_a$
  - **Normal excitation**: Medium $I_f$, unity pf, minimum $I_a$
  - **Over-excited**: High $I_f$, leading pf, high $I_a$

The curve shows that for each load level, there is an optimum excitation that gives unity power factor and minimum armature current. Operating away from this point increases copper losses and reduces efficiency.

---

### Q7. S07-2A | 02 marks: Assume a purely resistive load connected across the terminals of an alternator. Will the voltage regulation of the alternator be zero? Justify your answer.

**Answer:**

**No**, the voltage regulation will **not be zero** for a purely resistive load.

**Reasoning:**

Voltage regulation is defined as:

$$
\text{Regulation} = \frac{E_f - V_t}{V_t} \times 100\%
$$

For zero regulation, we need $E_f = V_t$, which would require the voltage drop across the synchronous impedance to be zero.

Even for a purely resistive load:
- The armature current $I_a$ is in phase with $V_t$ (resistive load)
- However, the synchronous impedance $Z_s = R_a + jX_s$ has a **reactive component** $X_s$ (synchronous reactance)
- The voltage drop $I_a Z_s = I_a(R_a + jX_s)$ has both resistive and reactive components
- The reactive drop $jI_a X_s$ causes a phase shift between $E_f$ and $V_t$

**Phasor Analysis:**
For resistive load ($\phi = 0^\circ$):
$$
E_f = V_t + I_a(R_a + jX_s)
$$

The $jI_a X_s$ component is $90^\circ$ ahead of $I_a$, so $E_f$ is not equal to $V_t$ in magnitude.

**Exception:** Zero regulation can occur for a **specific leading power factor** load where the magnetizing armature reaction compensates for the synchronous reactance drop. This is typically at a power factor around 0.9-0.95 leading, not at unity power factor.

---

### Q8. S13-3C | 03 marks: Explain the effect of load power factor on armature reaction in alternators.

**Answer:**

**Armature reaction** is the effect of armature MMF on the main field flux in a synchronous machine. The effect varies significantly with load power factor:

**1. Unity Power Factor Load ($\phi = 0^\circ$):**
- Armature current $I_a$ is in phase with terminal voltage $V_t$
- Armature MMF $F_a$ is in quadrature (perpendicular) to field MMF $F_f$
- **Effect:** Cross-magnetizing — distorts the flux waveform but does not significantly change the magnitude
- The flux is shifted in position but not weakened or strengthened

**2. Lagging Power Factor Load ($\phi$ lagging):**
- $I_a$ lags $V_t$ by angle $\phi$
- Armature MMF has a component **opposing** the field MMF
- **Effect:** Demagnetizing — reduces the net flux
- To maintain terminal voltage, field excitation must be increased
- This is why generators supplying inductive loads need higher excitation

**3. Leading Power Factor Load ($\phi$ leading):**
- $I_a$ leads $V_t$ by angle $\phi$
- Armature MMF has a component **aiding** the field MMF
- **Effect:** Magnetizing — increases the net flux
- Terminal voltage tends to rise, so field excitation must be reduced
- This can lead to over-voltage if not controlled

**4. Purely Inductive Load ($\phi = 90^\circ$ lagging):**
- Armature reaction is **purely demagnetizing**
- $F_a$ directly opposes $F_f$
- Maximum reduction in flux

**5. Purely Capacitive Load ($\phi = 90^\circ$ leading):**
- Armature reaction is **purely magnetizing**
- $F_a$ directly aids $F_f$
- Maximum increase in flux

**Summary Table:**

| Load Power Factor | Armature Reaction Effect | Excitation Requirement |
|:---:|:---:|:---:|
| Unity | Cross-magnetizing | Normal |
| Lagging | Demagnetizing | Increase |
| Leading | Magnetizing | Decrease |

---

### Q9. S15-3B | 03 marks: Along with necessary waveforms, discuss the behaviour of a three-phase alternator subjected to a symmetrical 3-phase short circuit.

**Answer:**

**Behavior During a Symmetrical 3-Phase Short Circuit:**

When a three-phase alternator experiences a sudden **symmetrical 3-phase short circuit** at its terminals, the current waveform shows three distinct periods:

**1. Subtransient Period (First few cycles):**
- Duration: 0-5 cycles (0-0.1 s)
- The fault current is very high — typically 10-15 times rated current
- This high current is due to the **subtransient reactance** $X_d''$ (very low, typically 0.1-0.2 pu)
- The current decays rapidly with a short time constant $\tau_d''$ (0.01-0.05 s)
- Damper windings (if present) contribute to this initial high current

**2. Transient Period (Next few seconds):**
- Duration: 0.1-3 seconds
- Current magnitude reduces to 3-6 times rated current
- Governed by **transient reactance** $X_d'$ (typically 0.2-0.4 pu)
- Decays with time constant $\tau_d'$ (0.5-2 s)
- Field winding and rotor body currents sustain this period

**3. Steady-State Period:**
- After transient decay, current settles to steady-state value
- Determined by **synchronous reactance** $X_d$ (typically 1.0-2.0 pu)
- Steady-state short circuit current = $E_f / X_d$ (typically 0.5-1.0 pu)
- This current is limited only by the synchronous reactance

**Waveform Characteristics:**
- The AC component decays exponentially from high initial value to steady-state
- There is also a **DC offset** component that depends on the instant of fault occurrence
- The DC offset decays with the armature time constant $\tau_a$ (0.05-0.2 s)
- The total asymmetrical fault current can be even higher than the symmetrical RMS value

**Practical Significance:**
- Circuit breakers must be rated to interrupt the **subtransient** current
- Mechanical forces on windings are proportional to $I^2$, so bracing must withstand the first peak
- Protection relays must differentiate between fault currents and starting currents

---

### Q10. S22-2A | 03 marks: Draw the EMF and MMF diagrams when a pure inductive load is connected to a 3 phase wound rotor synchronous generator with negligible armature resistance. Hence discuss the armature reaction effect.

**Answer:**

**EMF and MMF Diagrams for Pure Inductive Load:**

Since armature resistance is negligible ($R_a \approx 0$), the synchronous impedance is purely reactive: $Z_s = jX_s$.

**EMF Diagram:**
- For a pure inductive load, current $I_a$ lags terminal voltage $V_t$ by $90^\circ$
- The voltage drop across synchronous reactance is $jI_a X_s$, which leads $I_a$ by $90^\circ$
- Therefore: $E_f = V_t + jI_a X_s$
- Since $jI_a X_s$ is in phase with $V_t$ (both are $90^\circ$ ahead of $I_a$), $E_f$ and $V_t$ are in phase
- The magnitude: $E_f = V_t + I_a X_s$

**MMF Diagram:**
- Field MMF $F_f$ produces the excitation EMF $E_f$
- Armature MMF $F_a$ is in phase with $I_a$ (since $F_a \propto I_a$)
- For pure inductive load, $I_a$ lags $V_t$ by $90^\circ$, and $V_t$ is in phase with $E_f$
- Therefore, $F_a$ lags $F_f$ by $90^\circ$ (or $F_f$ leads $F_a$ by $90^\circ$)
- The resultant MMF: $F_r = F_f + F_a$ (phasor sum)

**Armature Reaction Effect:**

For pure inductive load:
- $F_a$ is **directly opposing** $F_f$ (they are $180^\circ$ apart in the magnetic circuit)
- This is **purely demagnetizing** armature reaction
- The net flux $\phi_r$ is significantly reduced compared to the field flux $\phi_f$
- To maintain the same terminal voltage, the field excitation must be **increased** substantially

**Mathematical Representation:**
$$
F_r = F_f - F_a \quad \text{(since they oppose each other)}
$$

The resultant flux:
$$
\phi_r = \phi_f - \phi_a
$$

This explains why alternators supplying inductive loads require higher excitation to maintain rated voltage — the demagnetizing armature reaction must be compensated.

---

## Numerical Problems

### N1. Q077 | S01-1A | 04 marks: EMF Calculation

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
\beta = \frac{180^\circ}{\text{Slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}
$$

**Step 4: Calculate number of slots per pole per phase ($m$)**

$$
m = \frac{\text{Slots per pole}}{3} = \frac{12}{3} = 4
$$

**Step 5: Calculate Distribution Factor ($K_d$)**

$$
K_d = \frac{\sin\left(\frac{m\beta}{2}\right)}{m \sin\left(\frac{\beta}{2}\right)} = \frac{\sin\left(\frac{4 \times 15^\circ}{2}\right)}{4 \times \sin\left(\frac{15^\circ}{2}\right)}
$$

$$
K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577
$$

**Step 6: Calculate Pitch Factor ($K_p$)**

Coil span = 10 slots out of 12 slots per pole

Short pitch angle ($\alpha$) = $(12 - 10) \times 15^\circ = 2 \times 15^\circ = 30^\circ$

$$
K_p = \cos\left(\frac{\alpha}{2}\right) = \cos(15^\circ) = 0.9659
$$

**Step 7: Calculate Winding Factor ($K_w$)**

$$
K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250
$$

**Step 8: Calculate Turns per Phase ($T_{ph}$)**

Total conductors = $72 \times 6 = 432$

For a 3-phase star-connected alternator:

$$
T_{ph} = \frac{\text{Total conductors}}{2 \times 3} = \frac{432}{6} = 72 \text{ turns/phase}
$$

**Step 9: Calculate Phase EMF ($E_{ph}$)**

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

**Step 10: Calculate Line EMF ($E_L$)**

For star connection:

$$
E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.2 = 6658.5 \text{ V}
$$

**Answer:**
- Distribution factor $K_d = 0.9577$
- Pitch factor $K_p = 0.9659$
- Winding factor $K_w = 0.9250$
- Turns per phase $T_{ph} = 72$
- Phase EMF $E_{ph} = 3844.2$ V
- Line EMF $E_L = 6658.5$ V

---

### N2. Q078 | S01-2A | 03 marks: Short-pitch Winding Analysis

**Problem:** A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total no. of armature slots (ii) minimum order of harmonic emf that can be suppressed.

**Solution:**

**Step 1: Determine number of poles**

$$
P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}
$$

**Step 2: Calculate slots per pole**

Coil span = $144^\circ$ electrical

Full pitch = $180^\circ$ electrical

Short pitch angle = $180^\circ - 144^\circ = 36^\circ$

Given that the winding is short pitched by **2 slots**:

$$
\text{Slot angle } \beta = \frac{36^\circ}{2} = 18^\circ \text{ electrical}
$$

**Step 3: Calculate total slots**

$$
\text{Slots per pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10
$$

$$
\text{Total slots} = \text{Slots per pole} \times P = 10 \times 8 = 80
$$

**Step 4: Determine minimum order of harmonic suppressed**

For a short-pitched coil with pitch factor:

$$
K_{pn} = \cos\left(\frac{n\alpha}{2}\right)
$$

where $n$ is the harmonic order and $\alpha$ is the short pitch angle ($36^\circ$).

For harmonic suppression, $K_{pn} = 0$:

$$
\cos\left(\frac{n \times 36^\circ}{2}\right) = 0
$$

$$
\cos(18^\circ n) = 0
$$

$$
18^\circ n = 90^\circ, 270^\circ, 450^\circ, ...
$$

$$
n = 5, 15, 25, ...
$$

The **minimum order** harmonic that can be suppressed is the **5th harmonic**.

**Verification:**
$$
K_{p5} = \cos\left(\frac{5 \times 36^\circ}{2}\right) = \cos(90^\circ) = 0
$$

**Answer:**
- Total number of armature slots: **80**
- Minimum order of harmonic suppressed: **5th harmonic**

---

### N3. Load Sharing Problem (Enhanced from Q4)

**Problem:** Two alternators rated 2 MVA each operate in parallel to supply a total load of 3 MW at 0.8 pf lagging. The frequency droop characteristics are:
- Alternator A: Frequency drops from 50 Hz at no-load to 48 Hz at full load (2 MW)
- Alternator B: Frequency drops from 50.5 Hz at no-load to 48.5 Hz at full load (2 MW)

Determine: (i) The system frequency (ii) Load shared by each alternator

**Solution:**

**Step 1: Determine droop constants**

For Alternator A:
- No-load frequency: $f_{0A} = 50$ Hz
- Full-load (2 MW) frequency: $f_{flA} = 48$ Hz
- Droop: $\text{Droop}_A = \frac{50 - 48}{2} = 1$ Hz/MW

For Alternator B:
- No-load frequency: $f_{0B} = 50.5$ Hz
- Full-load (2 MW) frequency: $f_{flB} = 48.5$ Hz
- Droop: $\text{Droop}_B = \frac{50.5 - 48.5}{2} = 1$ Hz/MW

**Step 2: Write frequency equations**

$$
f = f_{0A} - \text{Droop}_A \times P_A = 50 - 1 \times P_A
$$

$$
f = f_{0B} - \text{Droop}_B \times P_B = 50.5 - 1 \times P_B
$$

**Step 3: Equate frequencies**

$$
50 - P_A = 50.5 - P_B
$$

$$
-P_A + P_B = 0.5
$$

$$
P_B - P_A = 0.5 \quad \text{(Equation 1)}
$$

**Step 4: Total load equation**

$$
P_A + P_B = 3 \quad \text{(Equation 2)}
$$

**Step 5: Solve**

Adding Equation 1 and Equation 2:

$$
(P_B - P_A) + (P_A + P_B) = 0.5 + 3
$$

$$
2P_B = 3.5
$$

$$
P_B = 1.75 \text{ MW}
$$

$$
P_A = 3 - 1.75 = 1.25 \text{ MW}
$$

**Step 6: Calculate system frequency**

$$
f = 50 - 1 \times 1.25 = 48.75 \text{ Hz}
$$

**Verification:**
$$
f = 50.5 - 1 \times 1.75 = 48.75 \text{ Hz} \quad \checkmark
$$

**Answer:**
- System frequency: **48.75 Hz**
- Alternator A supplies: **1.25 MW**
- Alternator B supplies: **1.75 MW**

---

### N4. Voltage Regulation Calculation

**Problem:** A 3-phase, star-connected alternator has a synchronous reactance of 10 Ω per phase and negligible armature resistance. It delivers 100 A at 11 kV (line-to-line) at 0.8 power factor lagging. Calculate the percentage voltage regulation.

**Solution:**

**Step 1: Determine phase values**

Phase voltage:
$$
V_{ph} = \frac{V_L}{\sqrt{3}} = \frac{11000}{\sqrt{3}} = 6350.8 \text{ V}
$$

Phase current: $I_a = 100$ A

Power factor angle: $\cos\phi = 0.8$ lagging, so $\phi = \cos^{-1}(0.8) = 36.87^\circ$

**Step 2: Calculate excitation EMF ($E_f$)**

Using the phasor equation (neglecting $R_a$):

$$
E_f = V_{ph} + jI_a X_s
$$

Taking $V_{ph}$ as reference ($V_{ph} = 6350.8 \angle 0^\circ$ V):

For lagging power factor, $I_a = 100 \angle -36.87^\circ$ A

$$
jI_a X_s = j \times 100 \angle -36.87^\circ \times 10
$$

$$
jI_a X_s = 1000 \angle (90^\circ - 36.87^\circ) = 1000 \angle 53.13^\circ \text{ V}
$$

Converting to rectangular form:

$$
jI_a X_s = 1000(\cos 53.13^\circ + j\sin 53.13^\circ) = 1000(0.6 + j0.8) = 600 + j800 \text{ V}
$$

$$
E_f = 6350.8 + 0 + j0 + 600 + j800 = 6950.8 + j800 \text{ V}
$$

$$
|E_f| = \sqrt{6950.8^2 + 800^2} = \sqrt{48,313,620 + 640,000} = \sqrt{48,953,620} = 6996.7 \text{ V}
$$

**Step 3: Calculate voltage regulation**

$$
\text{Regulation} = \frac{|E_f| - V_{ph}}{V_{ph}} \times 100\%
$$

$$
\text{Regulation} = \frac{6996.7 - 6350.8}{6350.8} \times 100\% = \frac{645.9}{6350.8} \times 100\% = 10.17\%
$$

**Answer:** The voltage regulation is **10.17%** (positive, as expected for lagging power factor).

---

## Quick Quiz

### Q1. What is the synchronous speed of a 6-pole, 50 Hz alternator?

**Answer:**
$$
N_s = \frac{120f}{P} = \frac{120 \times 50}{6} = 1000 \text{ rpm}
$$

---

### Q2. Why is the armature winding placed on the stator in large alternators?

**Answer:** Because the armature winding carries high voltage and high current. Placing it on the stator makes insulation easier, allows simpler power extraction through stationary terminals, and enables better cooling arrangements.

---

### Q3. What is the effect of armature reaction for a purely capacitive load?

**Answer:** For a purely capacitive load, the armature reaction is **magnetizing** — it aids the main field flux, increasing the net flux and causing the terminal voltage to rise above the excitation EMF.

---

### Q4. What is the significance of the "V-curve" in synchronous machines?

**Answer:** The V-curve shows the relationship between armature current and field excitation for a constant load. The bottom of the V-curve corresponds to unity power factor operation (minimum armature current). The left side shows lagging power factor (under-excited), and the right side shows leading power factor (over-excited).

---

### Q5. What are the three periods of a sudden short circuit current in an alternator?

**Answer:**
1. **Subtransient period** (first few cycles) — very high current, governed by $X_d''$
2. **Transient period** (next few seconds) — medium current, governed by $X_d'$
3. **Steady-state period** — sustained current, governed by $X_d$

---

### Q6. What is the condition for zero voltage regulation in an alternator?

**Answer:** Zero voltage regulation occurs when the excitation EMF equals the terminal voltage ($E_f = V_t$). This happens at a specific **leading power factor** where the magnetizing armature reaction exactly compensates for the synchronous reactance voltage drop. It typically occurs at a power factor around 0.9-0.95 leading.

---

### Q7. What is the minimum order of harmonic that can be suppressed by a coil span of 144° electrical?

**Answer:** The short pitch angle $\alpha = 180^\circ - 144^\circ = 36^\circ$. For suppression, $\cos(n\alpha/2) = 0$, giving $n\alpha/2 = 90^\circ$, so $n = 180^\circ/36^\circ = 5$. The **5th harmonic** is the minimum order suppressed.