---
sidebar_position: 12.5
title: "Week 12: Practice Questions"
---

# Week 12: Practice Questions

## Previous Year Questions

### Q1. S06-1C: 'Unlike asynchronous machines, Synchronous machines can be operated at different power factors'. Justify this statement with the help of necessary characteristics.

**Answer:**

This statement highlights a fundamental advantage of synchronous machines over induction machines. Let's analyze this:

**Why Induction Machines Cannot Vary Power Factor:**
- In an induction motor, the rotor current is induced by slip, and the rotor always draws lagging reactive power from the supply to magnetize the air gap
- The power factor of an induction motor is always lagging and varies only with load (typically 0.7-0.85 lagging at full load)
- There is no independent control over the reactive power consumption

**Why Synchronous Machines Can Operate at Different Power Factors:**
- In a synchronous machine, the rotor has its own DC excitation system, independent of the stator supply
- By varying the DC field current, we can control the induced EMF ($E_f$) and hence the power factor

**V-Curves and Inverted V-Curves:**
The V-curves (Figure 1) show the relationship between armature current and field current for different power factors:

[Image: lec12_p1_img-1.png — see lecture notes]
<div align="center">
  <em>Figure: V-curves of a synchronous motor showing armature current vs field current for different loads</em>
</div>

- **Under-excited** (low $I_f$): Motor draws lagging current → lagging power factor
- **Normal excitation** ($I_f$ at minimum armature current): Unity power factor
- **Over-excited** (high $I_f$): Motor draws leading current → leading power factor

**Operating Modes:**
- **Synchronous Generator (Alternator):** With constant load, increasing excitation increases terminal voltage; decreasing excitation decreases terminal voltage. Power factor is determined by load
- **Synchronous Motor:** By controlling excitation, the motor can operate at:
  - Lagging PF (under-excited) — acts as inductive load
  - Unity PF (normal excitation) — purely resistive load
  - Leading PF (over-excited) — acts as capacitive load, can improve system power factor

**Significance:**
- Synchronous motors can be used for **power factor correction** in industrial plants
- Synchronous condensers (over-excited synchronous motors running without mechanical load) provide reactive power support to power systems

---

### Q2. S07-4A: 'V' and 'inverted V' curves have significant importance in analyzing the behaviors of synchronous machines. Justify this statement suitably.

**Answer:**

**V-Curves:**
V-curves plot armature current ($I_a$) versus field current ($I_f$) for a synchronous motor at constant load:

[Image: lec12_p2_img-2.png — see lecture notes]
<div align="center">
  <em>Figure: V-curves (top) and inverted V-curves (bottom) for a synchronous motor</em>
</div>

**Characteristics of V-Curves:**
- For a given load, there is a minimum armature current at unity power factor
- Below this excitation (under-excited), $I_a$ increases as the motor draws lagging current
- Above this excitation (over-excited), $I_a$ increases as the motor draws leading current
- The shape resembles the letter 'V', hence the name

**Inverted V-Curves:**
Inverted V-curves plot power factor ($\cos\phi$) versus field current ($I_f$):

- At low $I_f$: Power factor is lagging (negative $\cos\phi$)
- At normal $I_f$: Power factor reaches unity
- At high $I_f$: Power factor becomes leading (positive $\cos\phi$)
- The curve shape is an inverted 'V'

**Significance:**

1. **Determining Operating Point:** V-curves help determine the field current required for a desired power factor at a given load

2. **Stability Analysis:** The minimum armature current point (unity PF) represents the most efficient operating condition

3. **Reactive Power Capability:** The curves show the reactive power capability of the machine at different loads

4. **Synchronous Condenser Operation:** For power factor correction applications, V-curves help select the appropriate field current

5. **Generator Operation:** In alternators, similar curves (but with different interpretation) help understand voltage regulation

6. **Practical Applications:**
   - Setting excitation for optimal efficiency
   - Determining reactive power limits
   - Planning power factor correction schemes
   - Analyzing machine stability under varying loads

---

### Q3. S13-2C: What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

This configuration (rotor field + stator armature) is standard for large alternators (turbo-alternators and hydro-generators). The advantages are:

**1. Easier Insulation and Cooling of High-Voltage Windings:**
- The 3-phase armature windings carry the full generated voltage (typically 11 kV to 33 kV for large alternators)
- Stationary windings are easier to insulate and cool because:
  - No centrifugal forces acting on the insulation
  - Cooling ducts and passages can be easily incorporated
  - Water or hydrogen cooling can be implemented without rotating seals

**2. Simplified Power Extraction:**
- The generated power is taken from stationary terminals, eliminating the need for slip rings and brushes for high-voltage output
- This reduces maintenance and eliminates sparking at high voltages

**3. Lower Excitation Power Requirements:**
- The field winding on the rotor carries DC current at relatively low voltage (typically 125-500 V)
- Power for excitation is only 0.5-2% of the alternator rating
- Slip rings and brushes (or brushless exciters) handle this low power easily

**4. Mechanical Strength:**
- The rotor construction is simpler with DC field windings that can be securely wedged in slots
- For high-speed turbo-alternators (3000/3600 rpm), the rotor must withstand enormous centrifugal forces
- A smooth cylindrical rotor with field windings is mechanically more robust than one with heavy armature windings

**5. Reduced Vibration and Noise:**
- The rotating field produces a constant magnetic field in the air gap (no pulsating forces on rotor)
- The armature reaction effects are stationary, reducing mechanical vibrations

**6. Better Voltage Regulation:**
- With the armature on the stator, the magnetic circuit is more uniform
- This results in better voltage waveform and easier control of terminal voltage

---

### Q4. S22-4B: Two alternators of identical rating are required to share a load of 2.5 MW at 0.8 pf lagging. Alternator A has a frequency drop of 1 Hz per MW. Similar data for Alternator B is 1.5 Hz per MW. No-load frequencies are respectively 51.5 Hz and 51 Hz. At what frequency will the system operate and how much load is supplied by each machine.

**Answer:**

**Given Data:**
- Total load: $P_L = 2.5$ MW at 0.8 pf lagging
- Alternator A: Frequency drop = 1 Hz/MW, No-load frequency $f_{0A} = 51.5$ Hz
- Alternator B: Frequency drop = 1.5 Hz/MW, No-load frequency $f_{0B} = 51$ Hz

**Solution:**

For parallel operation, both alternators must operate at the same frequency ($f$).

**Step 1: Write the frequency-load equations**

For Alternator A:
$$f = f_{0A} - k_A P_A$$
$$f = 51.5 - 1 \times P_A$$

For Alternator B:
$$f = f_{0B} - k_B P_B$$
$$f = 51 - 1.5 \times P_B$$

**Step 2: Load sharing equation**

$$P_A + P_B = 2.5 \text{ MW}$$

**Step 3: Equate frequencies**

$$51.5 - P_A = 51 - 1.5P_B$$

$$51.5 - P_A = 51 - 1.5(2.5 - P_A)$$

$$51.5 - P_A = 51 - 3.75 + 1.5P_A$$

$$51.5 - P_A = 47.25 + 1.5P_A$$

$$51.5 - 47.25 = 1.5P_A + P_A$$

$$4.25 = 2.5P_A$$

$$P_A = \frac{4.25}{2.5} = 1.7 \text{ MW}$$

**Step 4: Find load on Alternator B**

$$P_B = 2.5 - 1.7 = 0.8 \text{ MW}$$

**Step 5: Find operating frequency**

Using Alternator A's equation:
$$f = 51.5 - 1 \times 1.7 = 49.8 \text{ Hz}$$

**Verification with Alternator B:**
$$f = 51 - 1.5 \times 0.8 = 51 - 1.2 = 49.8 \text{ Hz} \checkmark$$

**Answer:**
- Operating frequency: **49.8 Hz**
- Alternator A supplies: **1.7 MW**
- Alternator B supplies: **0.8 MW**

---

### Q5. S01-2B: With the aid of MMF diagram, prove that the terminal voltage is greater than its excitation emf when a pure capacitive load is connected across its terminals.

**Answer:**

**Understanding the Scenario:**
For a synchronous generator (alternator) with a pure capacitive load:
- Load current $I$ leads the terminal voltage $V_t$ by $90^\circ$
- Armature reaction is **magnetizing** (helps the main field)

**MMF Diagram Analysis:**

[Image: lec12_p3_img-3.png — see lecture notes]
<div align="center">
  <em>Figure: MMF phasor diagram for alternator with pure capacitive load</em>
</div>

**Step 1: Establish the phasor relationships**

Let terminal voltage $V_t$ be the reference phasor:
$$\bar{V}_t = V_t \angle 0^\circ$$

For pure capacitive load, current leads voltage by $90^\circ$:
$$\bar{I} = I \angle +90^\circ$$

**Step 2: Armature reaction MMF**

The armature reaction MMF ($\bar{F}_a$) is in phase with the current $\bar{I}$:
$$\bar{F}_a = F_a \angle +90^\circ$$

**Step 3: Resultant MMF**

The resultant air-gap MMF ($\bar{F}_r$) is the phasor sum of field MMF ($\bar{F}_f$) and armature reaction MMF ($\bar{F}_a$):
$$\bar{F}_r = \bar{F}_f + \bar{F}_a$$

For capacitive load, $\bar{F}_a$ is at $+90^\circ$ relative to $V_t$, which means it **adds** to the field MMF in the quadrature axis.

**Step 4: Induced EMF relationship**

The induced EMF ($E_f$) is proportional to the resultant MMF:
$$E_f \propto F_r$$

The terminal voltage $V_t$ is related to $E_f$ by:
$$\bar{E}_f = \bar{V}_t + jI X_s$$

where $X_s$ is the synchronous reactance.

**Step 5: Prove $V_t > E_f$**

For capacitive load with current leading by $90^\circ$:
$$\bar{E}_f = \bar{V}_t + j(I\angle+90^\circ)X_s$$
$$\bar{E}_f = \bar{V}_t + I X_s \angle+180^\circ$$
$$\bar{E}_f = V_t - I X_s$$

Therefore:
$$E_f = V_t - I X_s$$

Since $I X_s > 0$:
$$V_t = E_f + I X_s > E_f$$

**Physical Explanation:**
- The capacitive load current produces a **magnetizing** armature reaction
- This aids the main field flux, increasing the total flux in the air gap
- However, the synchronous reactance voltage drop ($IX_s$) subtracts from $E_f$ to give $V_t$
- For capacitive loads, the $IX_s$ drop is in the opposite direction to the induced EMF
- The result: $V_t > E_f$ (terminal voltage exceeds excitation EMF)

**Conclusion:**
When a synchronous generator supplies a pure capacitive load, the terminal voltage is **higher** than the excitation EMF. This is why alternators experience **voltage rise** when supplying leading power factor loads.

---

### Q6. S03-3A: Describe the operation of alternator with constant excitation and variable load with suitable phasor diagrams. What is the significance of the condition with minimum excitation? Analyze the relation between power factor and excitation with the help of suitable curve.

**Answer:**

**Operation with Constant Excitation and Variable Load:**

When an alternator operates with constant field current (constant $E_f$) and the load varies, the following changes occur:

**Case 1: Unity Power Factor Load**

[Image: lec12_p4_img-4.png — see lecture notes]
<div align="center">
  <em>Figure: Phasor diagram for alternator with unity power factor load</em>
</div>

For unity PF:
$$\bar{E}_f = \bar{V}_t + jI_a R_a + jI_a X_s$$

With $R_a \approx 0$:
$$\bar{E}_f = \bar{V}_t + jI_a X_s$$

The voltage regulation is positive ($V_t < E_f$).

**Case 2: Lagging Power Factor Load**

[Image: lec12_p5_img-5.png — see lecture notes]
<div align="center">
  <em>Figure: Phasor diagram for alternator with lagging power factor load</em>
</div>

For lagging PF ($\phi$ lagging):
$$\bar{E}_f = \bar{V}_t + jI_a X_s$$

The $IX_s$ drop has a component opposing $V_t$, causing larger voltage drop. Regulation is more positive.

**Case 3: Leading Power Factor Load**

[Image: lec12_p6_img-6.png — see lecture notes]
<div align="center">
  <em>Figure: Phasor diagram for alternator with leading power factor load</em>
</div>

For leading PF ($\phi$ leading):
$$\bar{E}_f = \bar{V}_t + jI_a X_s$$

The $IX_s$ drop has a component aiding $V_t$, causing voltage rise. Regulation can be negative.

**Significance of Minimum Excitation Condition:**

The minimum excitation condition occurs when the field current is reduced to the point where:
- The alternator is at the verge of losing synchronism
- The power angle $\delta$ approaches $90^\circ$
- The machine can no longer supply the required load

**Mathematical Analysis:**

For a cylindrical rotor alternator:
$$P = \frac{3V_t E_f}{X_s} \sin\delta$$

At minimum excitation:
- $E_f$ is minimum for given $P$
- $\delta$ approaches $90^\circ$ (stability limit)
- Any further reduction in $E_f$ causes loss of synchronism

**Relation Between Power Factor and Excitation:**

[Image: lec12_p7_img-7.png — see lecture notes]
<div align="center">
  <em>Figure: Relationship between excitation (field current) and power factor for constant load</em>
</div>

**Analysis of the Curve:**

1. **Under-excited region** (low $I_f$):
   - Alternator supplies lagging current
   - Power factor is lagging
   - Armature reaction is demagnetizing

2. **Normal excitation** (medium $I_f$):
   - Unity power factor
   - Minimum armature current for given load
   - Most efficient operation

3. **Over-excited region** (high $I_f$):
   - Alternator supplies leading current
   - Power factor is leading
   - Armature reaction is magnetizing

**Key Observations:**
- For a given load, there is a unique field current for unity PF
- Increasing excitation beyond unity PF point makes the PF leading
- Decreasing excitation below unity PF point makes the PF lagging
- The machine can operate at any PF by adjusting excitation, within thermal and stability limits

---

### Q7. S13-3C: Explain the effect of load power factor on armature reaction in alternators.

**Answer:**

Armature reaction is the effect of armature (stator) MMF on the main field flux produced by the rotor. The nature of armature reaction depends entirely on the power factor of the load.

**General Principle:**
- The armature MMF ($F_a$) is in phase with the armature current ($I_a$)
- The effect on the main field depends on the phase angle between $I_a$ and the induced EMF ($E_f$)

**Case 1: Unity Power Factor Load ($\phi = 0^\circ$)**
- Current $I_a$ is in phase with terminal voltage $V_t$
- Armature reaction is **cross-magnetizing** (quadrature axis)
- Distorts the field flux but does not weaken or strengthen it significantly
- Causes waveform distortion but minimal magnitude change

[Image: lec12_p8_img-8.png — see lecture notes]
<div align="center">
  <em>Figure: Armature reaction for unity power factor load — cross-magnetizing effect</em>
</div>

**Case 2: Lagging Power Factor Load ($\phi$ lagging)**
- Current $I_a$ lags behind $V_t$
- Armature reaction has two components:
  - **Demagnetizing component** (direct axis): Opposes the main field
  - **Cross-magnetizing component** (quadrature axis): Distorts the field
- Net effect: **Reduction in generated voltage** (positive regulation)
- This is why alternators have poor voltage regulation for inductive loads

[Image: lec12_p9_img-9.png — see lecture notes]
<div align="center">
  <em>Figure: Armature reaction for lagging power factor — demagnetizing effect dominates</em>
</div>

**Case 3: Leading Power Factor Load ($\phi$ leading)**
- Current $I_a$ leads $V_t$
- Armature reaction has two components:
  - **Magnetizing component** (direct axis): Aids the main field
  - **Cross-magnetizing component** (quadrature axis): Distorts the field
- Net effect: **Increase in generated voltage** (negative regulation)
- This is why alternators experience voltage rise for capacitive loads

[Image: lec12_p10_img-10.png — see lecture notes]
<div align="center">
  <em>Figure: Armature reaction for leading power factor — magnetizing effect dominates</em>
</div>

**Summary Table:**

| Load Power Factor | Armature Reaction | Effect on Voltage | Regulation |
|:---:|:---:|:---:|:---:|
| Unity | Cross-magnetizing | Slight distortion | Small positive |
| Lagging | Demagnetizing + Cross | Voltage decreases | Positive |
| Leading | Magnetizing + Cross | Voltage increases | Negative (possible) |

**Practical Implications:**

1. **Voltage Regulation:** Alternators supplying lagging loads need automatic voltage regulators (AVR) to maintain constant terminal voltage

2. **Excitation Control:** For lagging loads, excitation must be increased to compensate for demagnetizing armature reaction

3. **Stability:** Excessive leading PF operation can cause over-voltage and stability issues

4. **Power System Operation:** Generators are typically operated at lagging PF to supply reactive power to inductive loads

---

### Q8. S15-3B: Along with necessary waveforms, discuss the behaviour of a three-phase alternator subjected to a symmetrical 3-phase short circuit.

**Answer:**

**Initial Condition:**
Consider a three-phase alternator running at rated speed with normal excitation, suddenly subjected to a symmetrical three-phase short circuit at its terminals.

**Current Waveforms:**

[Image: lec12_p11_img-11.png — see lecture notes]
<div align="center">
  <em>Figure: Armature current waveform during a three-phase short circuit</em>
</div>

**Phases of Short Circuit Current:**

The short circuit current consists of three distinct periods:

**Phase 1: Sub-transient Period (First few cycles)**
- Duration: 0-5 cycles (0-0.1 s for 50 Hz)
- Current magnitude: Very high (5-10 times rated current)
- Reactance involved: **Sub-transient reactance** $X_d''$
- The current decays rapidly with time constant $\tau_d'' \approx 0.02-0.05$ s
- This period is dominated by damper winding currents

**Phase 2: Transient Period (Next few seconds)**
- Duration: 0.1-3 seconds
- Current magnitude: Moderate (3-5 times rated current)
- Reactance involved: **Transient reactance** $X_d'$
- The current decays with time constant $\tau_d' \approx 0.5-2$ s
- This period is dominated by field winding currents

**Phase 3: Steady-State Period**
- After transient decay
- Current magnitude: 1-3 times rated current
- Reactance involved: **Synchronous reactance** $X_d$
- Constant current determined by $I_{sc} = E_f / X_d$

**Mathematical Expression:**

The instantaneous short circuit current in phase A:

$$i_a(t) = \sqrt{2}E_f\left[\frac{1}{X_d} + \left(\frac{1}{X_d'} - \frac{1}{X_d}\right)e^{-t/\tau_d'} + \left(\frac{1}{X_d''} - \frac{1}{X_d'}\right)e^{-t/\tau_d''}\right]\sin(\omega t + \theta_0)$$

$$+ \frac{\sqrt{2}E_f}{X_d''}e^{-t/\tau_a}\sin\theta_0$$

where:
- First term: AC component (decaying)
- Second term: DC offset component (decaying with armature time constant $\tau_a$)

**Envelope of Short Circuit Current:**

[Image: lec12_p12_img-12.png — see lecture notes]
<div align="center">
  <em>Figure: Envelope of the short circuit current showing sub-transient, transient, and steady-state components</em>
</div>

**Key Observations:**

1. **Asymmetry:** The first few cycles may be asymmetrical due to DC offset, depending on the instant of short circuit

2. **Peak Current:** The maximum possible peak current (worst case) is approximately:
   $$I_{peak} \approx 1.8 \times \sqrt{2} \times \frac{E_f}{X_d''}$$

3. **Reactance Values:**
   $$X_d'' < X_d' < X_d$$

4. **Mechanical Effects:** The high current produces enormous electromagnetic forces that can damage windings if the machine is not properly braced

5. **Thermal Effects:** $I^2R$ heating can damage insulation if the fault persists

**Practical Significance:**

1. **Circuit Breaker Rating:** Breakers must interrupt the sub-transient current
2. **Protection Relay Setting:** Relays must distinguish between fault current and starting current
3. **Machine Design:** Windings must withstand electromagnetic forces during faults
4. **System Stability:** The transient behavior affects power system stability studies

---

## Numerical Problems

### N1. Q077 (S01-1A): A 3 phase, 50 Hz, 1000 rpm, star connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) phase and line value of emf induced.

**Solution:**

**Given Data:**
- Frequency: $f = 50$ Hz
- Speed: $N_s = 1000$ rpm
- Number of slots: $S = 72$
- Conductors per slot: $z = 6$
- Coil span: 10 slots (short-pitched)
- Flux per pole: $\Phi = 0.26$ Wb
- Connection: Star

**Step 1: Determine number of poles**

$$P = \frac{120f}{N_s} = \frac{120 \times 50}{1000} = 6 \text{ poles}$$

**Step 2: Calculate slots per pole**

$$\text{Slots per pole} = \frac{S}{P} = \frac{72}{6} = 12$$

**Step 3: Calculate slot angle ($\beta$)**

$$\beta = \frac{180^\circ}{\text{Slots per pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}$$

**Step 4: Calculate number of slots per pole per phase ($m$)**

$$m = \frac{S}{3P} = \frac{72}{3 \times 6} = 4$$

**Step 5: Calculate Distribution Factor ($K_d$)**

$$K_d = \frac{\sin\left(\frac{m\beta}{2}\right)}{m\sin\left(\frac{\beta}{2}\right)} = \frac{\sin\left(\frac{4 \times 15^\circ}{2}\right)}{4\sin\left(\frac{15^\circ}{2}\right)}$$

$$K_d = \frac{\sin(30^\circ)}{4\sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577$$

**Step 6: Calculate Pitch Factor ($K_p$)**

Full pitch = 12 slots (180° electrical)
Coil span = 10 slots

Short-pitch angle:
$$\alpha = (12 - 10) \times 15^\circ = 30^\circ \text{ electrical}$$

$$K_p = \cos\left(\frac{\alpha}{2}\right) = \cos\left(\frac{30^\circ}{2}\right) = \cos(15^\circ) = 0.9659$$

**Step 7: Calculate Winding Factor ($K_w$)**

$$K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250$$

**Step 8: Calculate turns per phase ($T_{ph}$)**

Total conductors = $S \times z = 72 \times 6 = 432$

For a 3-phase machine:
$$T_{ph} = \frac{\text{Total conductors}}{2 \times 3} = \frac{432}{6} = 72 \text{ turns per phase}$$

**Step 9: Calculate phase EMF ($E_{ph}$)**

$$E_{ph} = 4.44 \times f \times \Phi \times T_{ph} \times K_w$$

$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$

$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$

$$E_{ph} = 4.44 \times 50 \times 17.316$$

$$E_{ph} = 4.44 \times 865.8 = 3844.2 \text{ V}$$

**Step 10: Calculate line EMF ($E_L$)**

For star connection:
$$E_L = \sqrt{3} \times E_{ph} = \sqrt{3} \times 3844.2 = 6658.5 \text{ V}$$

**Answer:**
- Distribution factor: $K_d = 0.9577$
- Pitch factor: $K_p = 0.9659$
- Winding factor: $K_w = 0.9250$
- Turns per phase: $T_{ph} = 72$
- Phase voltage: $E_{ph} = 3844.2 \text{ V}$
- Line voltage: $E_L = 6658.5 \text{ V}$

---

### N2. Q078 (S01-2A): A 3 phase, 50 Hz, 750 rpm alternator has its armature winding short pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total number of armature slots (ii) minimum order of harmonic emf that can be suppressed.

**Solution:**

**Given Data:**
- Frequency: $f = 50$ Hz
- Speed: $N_s = 750$ rpm
- Coil span: $144^\circ$ electrical (short-pitched by 2 slots)
- Short-pitch angle: $\alpha = 180^\circ - 144^\circ = 36^\circ$

**Step 1: Determine number of poles**

$$P = \frac{120f}{N_s} = \frac{120 \times 50}{750} = 8 \text{ poles}$$

**Step 2: Determine slots per pole**

The coil span is 144° electrical, which is short by 36° electrical.
Since each slot corresponds to a certain electrical angle, and the short pitch is 2 slots:

$$\text{Electrical angle per slot} = \frac{36^\circ}{2} = 18^\circ \text{ per slot}$$

$$\text{Slots per pole} = \frac{180^\circ}{18^\circ} = 10$$

**Step 3: Calculate total number of slots**

$$S = \text{Slots per pole} \times P = 10 \times 8 = 80 \text{ slots}$$

**Step 4: Determine minimum order of harmonic suppressed**

For a short-pitched winding, the pitch factor for the $n$th harmonic is:
$$K_{pn} = \cos\left(\frac{n\alpha}{2}\right)$$

A harmonic is completely suppressed when $K_{pn} = 0$:
$$\cos\left(\frac{n\alpha}{2}\right) = 0$$

$$\frac{n\alpha}{2} = 90^\circ, 270^\circ, ...$$

$$\frac{n \times 36^\circ}{2} = 90^\circ$$

$$n \times 18^\circ = 90^\circ$$

$$n = 5$$

**Verification:**
$$K_{p5} = \cos\left(\frac{5 \times 36^\circ}{2}\right) = \cos(90^\circ) = 0$$

**Answer:**
- Total number of armature slots: $S = 80$
- Minimum order of harmonic suppressed: $n = 5$ (5th harmonic)

---

### N3. Synchronous Generator Power Angle Problem

A 3-phase, 11 kV, 50 Hz, star-connected synchronous generator has a synchronous reactance of 5 $\Omega$ per phase and negligible armature resistance. The generator is delivering 10 MW at 0.8 power factor lagging to an infinite bus. Calculate:
(i) The induced EMF per phase ($E_f$)
(ii) The power angle ($\delta$)
(iii) The maximum power the generator can deliver

**Solution:**

**Given Data:**
- Line voltage: $V_L = 11$ kV
- Phase voltage: $V_{ph} = \frac{11000}{\sqrt{3}} = 6350.8$ V
- Synchronous reactance: $X_s = 5$ $\Omega$/phase
- Power output: $P = 10$ MW
- Power factor: $\cos\phi = 0.8$ lagging ($\phi = 36.87^\circ$)

**Step 1: Calculate the armature current**

$$P = \sqrt{3} V_L I_L \cos\phi$$

$$I_L = \frac{P}{\sqrt{3} V_L \cos\phi} = \frac{10 \times 10^6}{\sqrt{3} \times 11000 \times 0.8}$$

$$I_L = \frac{10 \times 10^6}{15242.1} = 656.1 \text{ A}$$

Since star-connected, $I_a = I_L = 656.1$ A

**Step 2: Express current as phasor**

Taking $V_{ph}$ as reference:
$$\bar{V}_{ph} = 6350.8 \angle 0^\circ \text{ V}$$

For lagging PF, current lags voltage:
$$\bar{I}_a = 656.1 \angle -36.87^\circ \text{ A}$$

**Step 3: Calculate induced EMF**

$$\bar{E}_f = \bar{V}_{ph} + j\bar{I}_a X_s$$

$$\bar{E}_f = 6350.8 \angle 0^\circ + j(656.1 \angle -36.87^\circ \times 5)$$

$$\bar{E}_f = 6350.8 \angle 0^\circ + j(3280.5 \angle -36.87^\circ)$$

$$\bar{E}_f = 6350.8 \angle 0^\circ + 3280.5 \angle (90^\circ - 36.87^\circ)$$

$$\bar{E}_f = 6350.8 \angle 0^\circ + 3280.5 \angle 53.13^\circ$$

Converting to rectangular form:
$$\bar{E}_f = 6350.8 + 3280.5(\cos 53.13^\circ + j\sin 53.13^\circ)$$

$$\bar{E}_f = 6350.8 + 3280.5(0.6 + j0.8)$$

$$\bar{E}_f = 6350.8 + 1968.3 + j2624.4$$

$$\bar{E}_f = 8319.1 + j2624.4 \text{ V}$$

**Step 4: Calculate magnitude and angle of $E_f$**

$$E_f = \sqrt{8319.1^2 + 2624.4^2} = \sqrt{69207400 + 6887500}$$

$$E_f = \sqrt{76094900} = 8723.3 \text{ V (phase)}$$

$$\delta = \tan^{-1}\left(\frac{2624.4}{8319.1}\right) = \tan^{-1}(0.3154) = 17.51^\circ$$

**Step 5: Calculate maximum power**

For a cylindrical rotor machine:
$$P_{max} = \frac{3V_{ph}E_f}{X_s}$$

$$P_{max} = \frac{3 \times 6350.8 \times 8723.3}{5}$$

$$P_{max} = \frac{166.2 \times 10^6}{5} = 33.24 \text{ MW}$$

**Answer:**
- Induced EMF per phase: $E_f = 8723.3 \text{ V}$ (line value: $E_{fL} = \sqrt{3} \times 8723.3 = 15109 \text{ V}$)
- Power angle: $\delta = 17.51^\circ$
- Maximum power: $P_{max} = 33.24 \text{ MW}$

---

### N4. Salient Pole Synchronous Generator Problem

A 3-phase, 6.6 kV, 50 Hz, star-connected salient pole synchronous generator has $X_d = 10$ $\Omega$ and $X_q = 6$ $\Omega$ per phase. The armature resistance is negligible. The generator delivers 5 MW at 0.85 power factor lagging. Calculate:
(i) The power angle ($\delta$)
(ii) The induced EMF ($E_f$)
(iii) The maximum power output

**Solution:**

**Given Data:**
- Line voltage: $V_L = 6.6$ kV
- Phase voltage: $V_{ph} = \frac{6600}{\sqrt{3}} = 3810.5$ V
- Direct-axis reactance: $X_d = 10$ $\Omega$
- Quadrature-axis reactance: $X_q = 6$ $\Omega$
- Power output: $P = 5$ MW
- Power factor: $\cos\phi = 0.85$ lagging ($\phi = 31.79^\circ$)

**Step 1: Calculate armature current**

$$I_a = \frac{P}{\sqrt{3} V_L \cos\phi} = \frac{5 \times 10^6}{\sqrt{3} \times 6600 \times 0.85}$$

$$I_a = \frac{5 \times 10^6}{9718.2} = 514.5 \text{ A}$$

**Step 2: Determine the power angle using the salient pole power equation**

For a salient pole machine, the power equation is:
$$P = \frac{3V_{ph}E_f}{X_d}\sin\delta + \frac{3V_{ph}^2}{2}\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta$$

The second term is the reluctance power.

We need to find $\delta$ first. Using the phasor diagram relationship:

$$\tan\delta = \frac{I_a X_q \cos\phi}{V_{ph} + I_a X_q \sin\phi}$$

$$\tan\delta = \frac{514.5 \times 6 \times 0.85}{3810.5 + 514.5 \times 6 \times 0.5299}$$

$$\tan\delta = \frac{2624.0}{3810.5 + 1635.8}$$

$$\tan\delta = \frac{2624.0}{5446.3} = 0.4818$$

$$\delta = \tan^{-1}(0.4818) = 25.73^\circ$$

**Step 3: Calculate induced EMF ($E_f$)**

Using the phasor diagram:
$$E_f = V_{ph}\cos\delta + I_a X_d \sin(\delta + \phi)$$

$$\sin(\delta + \phi) = \sin(25.73^\circ + 31.79^\circ) = \sin(57.52^\circ) = 0.8437$$

$$E_f = 3810.5 \times \cos(25.73^\circ) + 514.5 \times 10 \times 0.8437$$

$$E_f = 3810.5 \times 0.9012 + 5145 \times 0.8437$$

$$E_f = 3434.0 + 4340.8 = 7774.8 \text{ V (phase)}$$

**Step 4: Calculate maximum power output**

For salient pole machine, maximum power occurs when:
$$\frac{dP}{d\delta} = 0$$

$$\frac{3V_{ph}E_f}{X_d}\cos\delta + 3V_{ph}^2\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\cos 2\delta = 0$$

Let $A = \frac{3V_{ph}E_f}{X_d}$ and $B = 3V_{ph}^2\left(\frac{1}{X_q} - \frac{1}{X_d}\right)$

$$A = \frac{3 \times 3810.5 \times 7774.8}{10} = 8.887 \times 10^6$$

$$B = 3 \times 3810.5^2 \times \left(\frac{1}{6} - \frac{1}{10}\right)$$

$$B = 3 \times 14.52 \times 10^6 \times (0.1667 - 0.1)$$

$$B = 43.56 \times 10^6 \times 0.0667 = 2.905 \times 10^6$$

The equation becomes:
$$A\cos\delta + B\cos 2\delta = 0$$

Using $\cos 2\delta = 2\cos^2\delta - 1$:
$$A\cos\delta + B(2\cos^2\delta - 1) = 0$$

$$2B\cos^2\delta + A\cos\delta - B = 0$$

$$\cos\delta = \frac{-A \pm \sqrt{A^2 + 8B^2}}{4B}$$

$$\cos\delta = \frac{-8.887 \times 10^6 \pm \sqrt{(8.887 \times 10^6)^2 + 8(2.905 \times 10^6)^2}}{4 \times 2.905 \times 10^6}$$

$$\cos\delta = \frac{-8.887 \pm \sqrt{78.98 \times 10^{12} + 67.52 \times 10^{12}}}{11.62 \times 10^6}$$

$$\cos\delta = \frac{-8.887 \pm \sqrt{146.5 \times 10^{12}}}{11.62}$$

$$\cos\delta = \frac{-8.887 \pm 12.104}{11.62}$$

Taking positive value:
$$\cos\delta = \frac{3.217}{11.62} = 0.2768$$

$$\delta = \cos^{-1}(0.2768) = 73.93^\circ$$

**Step 5: Calculate maximum power**

$$P_{max} = A\sin\delta + \frac{B}{2}\sin 2\delta$$

$$P_{max} = 8.887 \times 10^6 \times \sin(73.93^\circ) + \frac{2.905 \times 10^6}{2} \times \sin(147.86^\circ)$$

$$P_{max} = 8.887 \times 10^6 \times 0.9609 + 1.4525 \times 10^6 \times 0.5299$$

$$P_{max} = 8.540 \times 10^6 + 0.770 \times 10^6$$

$$P_{max} = 9.310 \times 10^6 \text{ W} = 9.31 \text{ MW}$$

**Answer:**
- Power angle: $\delta = 25.73^\circ$
- Induced EMF per phase: $E_f = 7774.8 \text{ V}$ (line value: $E_{fL} = \sqrt{3} \times 7774.8 = 13466 \text{ V}$)
- Maximum power output: $P_{max} = 9.31 \text{ MW}$

---

## Quick Quiz

### Q1. What is the condition for maximum power transfer in a cylindrical rotor synchronous generator?

**Answer:** Maximum power occurs when the power angle $\delta = 90^\circ$. The maximum power is:
$$P_{max} = \frac{3V_{ph}E_f}{X_s}$$

### Q2. In a salient pole synchronous machine, why is the maximum power greater than that of a cylindrical rotor machine with the same $E_f$ and $X_d$?

**Answer:** The salient pole machine has an additional **reluctance power** component due to the difference between $X_d$ and $X_q$. This reluctance power contributes to the total power output, allowing the machine to develop more power than a cylindrical rotor machine with the same parameters. The reluctance power term is:
$$P_{rel} = \frac{3V_{ph}^2}{2}\left(\frac{1}{X_q} - \frac{1}{X_d}\right)\sin 2\delta$$

### Q3. What is the significance of the V-curves in synchronous machine operation?

**Answer:** V-curves show the relationship between armature current and field current for a synchronous motor at constant load. They help determine:
- The field current required for unity power factor operation (minimum armature current point)
- The range of power factor control possible
- The most efficient operating point
- The stability limits of the machine

### Q4. Why does a synchronous generator experience voltage rise when supplying a capacitive load?

**Answer:** When supplying a capacitive (leading PF) load, the armature reaction is **magnetizing** — it aids the main field flux. Additionally, the synchronous reactance voltage drop ($IX_s$) subtracts from $E_f$ in a direction that increases $V_t$. The net effect is $V_t > E_f$, causing a voltage rise (negative regulation).

### Q5. What are the three reactances that characterize a synchronous machine during a sudden short circuit?

**Answer:** The three reactances are:
1. **Sub-transient reactance** ($X_d''$) — dominates during the first few cycles (0-0.1 s), determined by damper winding effects
2. **Transient reactance** ($X_d'$) — dominates during the next few seconds (0.1-3 s), determined by field winding effects
3. **Synchronous reactance** ($X_d$) — determines the steady-state short circuit current

The relationship is: $X_d'' < X_d' < X_d$