---
sidebar_position: 6.5
title: "Week 6: Practice Questions"
---

# Week 6: Practice Questions

## Previous Year Questions

### Q1. S06-1A | 'The inherent nature of synchronous machines is to rotate in synchronism with the supply frequency while that of induction motors is to rotate with a slip'. Differentiate the above two machines. Use necessary schematic diagrams to justify your answer.

**Answer:**

The fundamental difference between synchronous and induction machines lies in their rotor construction and operating principle:

**Synchronous Machine:**
- The rotor has a **DC field winding** that produces a constant magnetic field
- The stator produces a **rotating magnetic field** (RMF) at synchronous speed $N_s = \frac{120f}{P}$
- The rotor locks onto the RMF and rotates at **exactly** $N_s$ (synchronism)
- **No slip** — the rotor speed equals the synchronous speed

**Induction Machine:**
- The rotor has **short-circuited windings** (squirrel cage or wound rotor)
- The stator RMF induces voltage in rotor conductors due to **relative motion**
- Rotor current produces torque, causing rotation
- The rotor **always lags** behind the RMF — it cannot catch up
- **Slip** $s = \frac{N_s - N_r}{N_s}$ is essential for torque production

**Schematic Diagram Description:**

*Figure 1: Synchronous machine — rotor with DC field winding, stator with AC windings. The rotor poles lock with the rotating field.*

*Figure 2: Induction machine — rotor with squirrel cage bars, stator with AC windings. The rotor slips behind the rotating field.*

**Key Comparison Table:**

| Parameter | Synchronous Machine | Induction Machine |
|-----------|-------------------|-------------------|
| Rotor speed | $N_r = N_s$ | $N_r < N_s$ |
| Slip | $s = 0$ | $0 < s < 1$ (motor) |
| Rotor excitation | DC supply | Induced from stator |
| Starting | Not self-starting | Self-starting |
| Power factor | Can be controlled | Always lagging |

---

### Q2. S01-4C | 03 marks | Why synchronous motors are not self-starting? Briefly explain the starting method using an auxiliary induction motor.

**Answer:**

**Why synchronous motors are not self-starting:**

The synchronous motor rotor has **inertia** and the stator produces a **rotating magnetic field** that rotates at synchronous speed $N_s$. When power is applied:

1. The RMF instantly rotates at $N_s$
2. The stationary rotor experiences a torque that alternates direction every half-cycle
3. Due to inertia, the rotor **cannot accelerate** from standstill to $N_s$ instantly
4. The net average torque over one cycle is **zero**

Mathematically, the torque on the rotor varies as:
$$T \propto \sin(2\omega_s t)$$

The average torque over one cycle is:
$$T_{avg} = \frac{1}{T}\int_0^T T(t) dt = 0$$

**Starting Method using Auxiliary Induction Motor:**

1. An **auxiliary induction motor** (pony motor) is mechanically coupled to the synchronous motor shaft
2. The pony motor accelerates the synchronous motor rotor to **near synchronous speed** (typically 95-98% of $N_s$)
3. Once the rotor is close to $N_s$, the DC field excitation is applied
4. The rotor poles **pull into synchronism** with the RMF
5. The pony motor is then disconnected

**Advantages of this method:**
- Simple and reliable
- No special starting windings needed on the rotor
- Suitable for large synchronous motors

---

### Q3. S05-5A | Can a PMSM replace a three-phase induction motor driving a pump? Explain.

**Answer:**

**Yes**, a Permanent Magnet Synchronous Motor (PMSM) can replace a three-phase induction motor for pump applications, but with several considerations:

**Advantages of PMSM over Induction Motor for Pump Drives:**

1. **Higher efficiency** — No rotor copper losses (no slip rings or rotor windings)
   - PMSM efficiency: 92-97%
   - Induction motor efficiency: 85-93%

2. **Better power factor** — PMSM can operate at unity or leading power factor
   - Induction motor always operates at lagging power factor (0.7-0.85)

3. **Higher power density** — Smaller size for same power rating
   - PMSM uses high-energy permanent magnets (NdFeB)

4. **Precise speed control** — Vector control gives accurate speed regulation
   - Important for variable-speed pump applications

5. **Lower maintenance** — No brushes, slip rings, or rotor windings

**Challenges:**

1. **Higher initial cost** — Permanent magnets (rare earth materials) are expensive
2. **Risk of demagnetization** — High temperatures or fault currents can demagnetize magnets
3. **Complex control** — Requires position sensors (encoder/resolver) or sensorless control
4. **No field weakening capability** — Limited constant-power speed range

**Conclusion:**
For pump applications where **energy efficiency** and **precise speed control** are priorities, PMSM is an excellent replacement. However, for simple constant-speed pumps, induction motors remain cost-effective.

---

### Q4. S06-1C | 'Unlike asynchronous machines, Synchronous machines can be operated at different power factors'. Justify this statement with the help of necessary characteristics.

**Answer:**

**Justification:**

The ability to control power factor in synchronous machines comes from the **adjustable DC field excitation** on the rotor.

**Synchronous Machine (Alternator/Motor):**

The power factor is controlled by varying the **field current** $I_f$:

- **Under-excitation** ($I_f$ low): Machine operates at **leading power factor**
  - Armature reaction is **magnetizing** (helps the field)
  - Terminal voltage rises with load

- **Normal excitation** ($I_f$ at rated): Machine operates at **unity power factor**
  - Armature reaction is **cross-magnetizing**
  - Terminal voltage remains constant

- **Over-excitation** ($I_f$ high): Machine operates at **lagging power factor**
  - Armature reaction is **demagnetizing** (opposes the field)
  - Terminal voltage drops with load

**V-curves and Inverted V-curves:**

*Figure 3: V-curves showing armature current vs field current for different loads. The minimum point corresponds to unity power factor.*

*Figure 4: Inverted V-curves showing power factor vs field current.*

**Induction Machine (Asynchronous):**

- The rotor current is **induced** from the stator
- The rotor always draws **magnetizing current** from the supply
- The machine always operates at **lagging power factor** (0.7-0.85)
- Power factor **cannot be controlled** externally
- Power factor improves with load but never reaches unity

**Mathematical Comparison:**

For synchronous machine:
$$\cos\phi = f(I_f) \quad \text{(controllable)}$$

For induction machine:
$$\cos\phi = \frac{R_r/s}{\sqrt{(R_r/s)^2 + X_{lr}^2}} \quad \text{(fixed by rotor parameters)}$$

**Conclusion:**
The ability to adjust field excitation gives synchronous machines the unique capability to operate at any desired power factor, making them valuable for power factor correction in industrial systems.

---

### Q5. S13-2C | 02 marks | What are the advantages of placing the field system of a large alternator on its rotor and the 3-phase windings on its stator?

**Answer:**

**Advantages of Rotor Field System and Stator Armature:**

1. **Easier insulation of high-voltage windings:**
   - The stator (armature) windings carry the **generated high voltage** (11 kV, 33 kV, etc.)
   - Stationary windings are easier to insulate and cool
   - Rotating high-voltage windings would require complex slip-ring arrangements

2. **Simpler rotor construction:**
   - The field winding carries **DC current** at low voltage (typically 100-500 V)
   - DC excitation requires only two slip rings (vs. three for AC)
   - Lower insulation stress on rotating parts

3. **Better cooling:**
   - Stator windings can be cooled with water or forced air through stationary ducts
   - Rotor can be designed with ventilation passages without compromising insulation

4. **Reduced centrifugal stress:**
   - The heavy armature windings remain stationary
   - The rotor carries only the relatively lightweight field winding

5. **Easier maintenance:**
   - Stationary armature windings are accessible for inspection and repair
   - Slip rings for DC excitation are simpler and more reliable than AC slip rings

6. **Lower brush current:**
   - DC field current is much smaller than the full-load armature current
   - Smaller brushes and slip rings with less wear

---

### Q6. S22-4B | 03 marks | Two alternators of identical rating are required to share a load of 2.5 MW at 0.8 pf lagging. Alternator A has a frequency drop of 1 Hz per MW. Similar data for Alternator B is 1.5 Hz per MW. No-load frequencies are respectively 51.5 Hz and 51 Hz. At what frequency will the system operate and how much load is supplied by each machine.

**Answer:**

**Given Data:**
- Total load: $P_{total} = 2.5$ MW at 0.8 pf lagging
- Alternator A: Frequency drop $k_A = 1$ Hz/MW, No-load frequency $f_{0A} = 51.5$ Hz
- Alternator B: Frequency drop $k_B = 1.5$ Hz/MW, No-load frequency $f_{0B} = 51$ Hz

**Solution:**

For each alternator, the frequency-load relationship is:
$$f = f_0 - k \times P$$

At the operating point, both alternators run at the **same system frequency** $f$:

For Alternator A:
$$f = 51.5 - 1 \times P_A \quad \text{(1)}$$

For Alternator B:
$$f = 51 - 1.5 \times P_B \quad \text{(2)}$$

Total load sharing:
$$P_A + P_B = 2.5 \quad \text{(3)}$$

From equations (1) and (2):
$$51.5 - P_A = 51 - 1.5P_B$$
$$51.5 - 51 = P_A - 1.5P_B$$
$$0.5 = P_A - 1.5P_B \quad \text{(4)}$$

From equation (3): $P_A = 2.5 - P_B$

Substituting into (4):
$$0.5 = (2.5 - P_B) - 1.5P_B$$
$$0.5 = 2.5 - 2.5P_B$$
$$2.5P_B = 2.5 - 0.5 = 2$$
$$P_B = \frac{2}{2.5} = 0.8 \text{ MW}$$

Then:
$$P_A = 2.5 - 0.8 = 1.7 \text{ MW}$$

System frequency from equation (1):
$$f = 51.5 - 1 \times 1.7 = 49.8 \text{ Hz}$$

**Answer:**
- System frequency: **49.8 Hz**
- Alternator A load: **1.7 MW**
- Alternator B load: **0.8 MW**

---

## Numerical Problems

### N1. A 3-phase, 50 Hz, 1000 rpm, star-connected alternator has 72 armature slots with 6 conductors per slot and the coil span is 10 slots. The average air gap flux per pole is 0.26 Wb. Calculate: (i) Distribution and Pitch factors of the winding (ii) Number of turns per phase and (iii) Phase and line value of EMF induced.

**Solution:**

**Step 1: Determine number of poles**
$$N_s = \frac{120f}{P} \implies P = \frac{120 \times 50}{1000} = 6 \text{ poles}$$

**Step 2: Calculate slots per pole**
$$\text{Slots/pole} = \frac{72}{6} = 12$$

**Step 3: Calculate slot angle $\beta$**
$$\beta = \frac{180^\circ}{\text{Slots/pole}} = \frac{180^\circ}{12} = 15^\circ \text{ electrical}$$

**Step 4: Calculate number of slots per pole per phase ($m$)**
$$m = \frac{\text{Slots/pole}}{3} = \frac{12}{3} = 4$$

**Step 5: Calculate short-pitch angle $\alpha$**
Full pitch = 12 slots, actual coil span = 10 slots
$$\alpha = (12 - 10) \times 15^\circ = 30^\circ \text{ electrical}$$

**Step 6: Distribution factor $K_d$**
$$K_d = \frac{\sin(m\beta/2)}{m\sin(\beta/2)} = \frac{\sin(4 \times 15^\circ/2)}{4 \times \sin(15^\circ/2)}$$
$$K_d = \frac{\sin(30^\circ)}{4 \times \sin(7.5^\circ)} = \frac{0.5}{4 \times 0.1305} = \frac{0.5}{0.522} = 0.9577$$

**Step 7: Pitch factor $K_p$**
$$K_p = \cos(\alpha/2) = \cos(30^\circ/2) = \cos(15^\circ) = 0.9659$$

**Step 8: Winding factor $K_w$**
$$K_w = K_d \times K_p = 0.9577 \times 0.9659 = 0.9250$$

**Step 9: Turns per phase $T_{ph}$**
Total conductors = $72 \times 6 = 432$
Conductors per phase = $\frac{432}{3} = 144$
$$T_{ph} = \frac{144}{2} = 72 \text{ turns}$$

**Step 10: Phase EMF $E_{ph}$**
$$E_{ph} = 4.44 \times f \times \phi \times T_{ph} \times K_w$$
$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$
$$E_{ph} = 4.44 \times 50 \times 0.26 \times 72 \times 0.9250$$
$$E_{ph} = 3844.3 \text{ V}$$

**Step 11: Line EMF $E_L$ (star connection)**
$$E_L = \sqrt{3} \times E_{ph} = 1.732 \times 3844.3 = 6658.5 \text{ V}$$

**Answer:**
- Distribution factor $K_d = 0.9577$
- Pitch factor $K_p = 0.9659$
- Winding factor $K_w = 0.9250$
- Turns per phase $T_{ph} = 72$
- Phase EMF $E_{ph} = 3844.3$ V
- Line EMF $E_L = 6658.5$ V

---

### N2. A 3-phase, 50 Hz, 750 rpm alternator has its armature winding short-pitched by two slots resulting in a coil span of 144° electrical. Determine (i) total number of armature slots (ii) minimum order of harmonic EMF that can be suppressed.

**Solution:**

**Step 1: Determine number of poles**
$$N_s = \frac{120f}{P} \implies P = \frac{120 \times 50}{750} = 8 \text{ poles}$$

**Step 2: Calculate slot angle $\beta$**
Coil span = 144° electrical
Full pitch = 180° electrical
Short-pitch angle $\alpha = 180^\circ - 144^\circ = 36^\circ$ electrical

Number of slots short-pitched = 2 slots
$$\beta = \frac{\alpha}{2} = \frac{36^\circ}{2} = 18^\circ \text{ electrical}$$

**Step 3: Calculate slots per pole**
$$\text{Slots/pole} = \frac{180^\circ}{\beta} = \frac{180^\circ}{18^\circ} = 10$$

**Step 4: Total number of slots**
$$\text{Total slots} = \text{Slots/pole} \times P = 10 \times 8 = 80$$

**Step 5: Minimum order of harmonic suppressed**
For a winding short-pitched by $\alpha$ electrical degrees, the $n$th harmonic is suppressed when:
$$\cos\left(\frac{n\alpha}{2}\right) = 0$$
$$\frac{n\alpha}{2} = 90^\circ, 270^\circ, ...$$
$$\frac{n \times 36^\circ}{2} = 90^\circ$$
$$n \times 18^\circ = 90^\circ$$
$$n = 5$$

**Answer:**
- Total number of armature slots: **80**
- Minimum order of harmonic suppressed: **5th harmonic**

---

### N3. A 3-phase induction motor has a synchronous speed of 1500 rpm and runs at 1440 rpm at full load. Calculate: (i) Slip (ii) Rotor frequency (iii) Slip speed

**Solution:**

**Step 1: Given data**
Synchronous speed $N_s = 1500$ rpm
Rotor speed $N_r = 1440$ rpm
Supply frequency $f = 50$ Hz

**Step 2: Calculate slip**
$$s = \frac{N_s - N_r}{N_s} = \frac{1500 - 1440}{1500} = \frac{60}{1500} = 0.04 = 4\%$$

**Step 3: Calculate rotor frequency**
$$f_r = s \times f = 0.04 \times 50 = 2 \text{ Hz}$$

**Step 4: Calculate slip speed**
$$N_{slip} = N_s - N_r = 1500 - 1440 = 60 \text{ rpm}$$

**Answer:**
- Slip: **0.04 (4%)**
- Rotor frequency: **2 Hz**
- Slip speed: **60 rpm**

---

## Quick Quiz

### Q1. What is the synchronous speed of a 4-pole, 50 Hz induction motor?

**Answer:** $N_s = \frac{120f}{P} = \frac{120 \times 50}{4} = 1500$ rpm

---

### Q2. Why does an induction motor always operate at lagging power factor?

**Answer:** The rotor draws magnetizing current from the stator to establish the air gap flux. This magnetizing current is purely reactive (lagging by 90°). Additionally, the rotor leakage inductance causes further lag. The motor cannot control its excitation like a synchronous machine.

---

### Q3. What is the difference between slip and slip speed?

**Answer:**
- **Slip ($s$)** is a dimensionless ratio: $s = \frac{N_s - N_r}{N_s}$, expressed as a decimal or percentage
- **Slip speed ($N_{slip}$)** is the actual speed difference: $N_{slip} = N_s - N_r$, expressed in rpm

---

### Q4. Can a 3-phase induction motor be used as a generator? If yes, how?

**Answer:** Yes, an induction motor can operate as an **induction generator** if:
1. It is driven above synchronous speed ($N_r > N_s$), making slip negative
2. It is connected to a supply or has capacitor banks for excitation
3. It supplies real power back to the grid while drawing reactive power for magnetization

---

### Q5. What is the significance of the winding factor in alternator EMF calculation?

**Answer:** The winding factor $K_w = K_d \times K_p$ accounts for:
- **Distribution factor $K_d$**: Reduces EMF due to coils being distributed in multiple slots (reduces harmonics)
- **Pitch factor $K_p$**: Reduces EMF due to coils being short-pitched (suppresses specific harmonics)
The actual EMF is $E = 4.44 f \phi T K_w$, which is less than the ideal EMF due to these factors.