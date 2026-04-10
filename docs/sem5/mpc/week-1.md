# Week 1 — Analysis of Power Electronic Converters

> **NPTEL: Design of Power Electronic Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Fundamental Principles — Know These Cold

These three rules are the entire foundation of steady-state converter analysis. Every CCM derivation uses all three.

### Volt-Second Balance (Inductor)

In steady state, the **average voltage across an inductor = 0** over one complete switching period.

$$\boxed{\int_0^{T_s} v_L\,dt = 0 \implies \langle v_L \rangle = 0}$$

**Why:** If the average were non-zero, the inductor current would ramp up or down indefinitely — not steady state.

**What it gives you:** The DC conversion ratio (e.g. $V_o = D \cdot V_{in}$ for buck).

### Charge Balance (Capacitor)

In steady state, the **average current through a capacitor = 0** over one complete switching period.

$$\boxed{\int_0^{T_s} i_C\,dt = 0 \implies \langle i_C \rangle = 0}$$

**What it gives you:** $\langle i_L \rangle = I_o$ — the average inductor current equals the average load current.

### Small-Ripple Approximation

$$\Delta i_L \ll \bar{I}_L \qquad \Delta v_C \ll \bar{V}_o$$

Treat voltages and currents as their DC averages during interval analysis. This lets you write $v_L$ as a simple constant in each interval.

> **Recall trap:** Volt-second → inductor. Charge balance → capacitor. Don't swap them in an exam.

---

## 2. Buck Converter — CCM Analysis

**Topology:** Series switch (MOSFET Q) + freewheeling diode D + series inductor L + shunt capacitor C + load R.

**Two intervals per switching period $T_s$:**

| Interval | Duration | Switch | Diode | $v_L$ | $i_C$ |
|----------|----------|--------|-------|-------|-------|
| ON | $DT_s$ | ON | Reverse biased (OFF) | $V_{in} - V_o$ | $i_L - I_o$ |
| OFF | $(1-D)T_s$ | OFF | Forward (ON) | $-V_o$ | $i_L - I_o$ |

**Applying volt-second balance:**

$$(V_{in} - V_o) \cdot D + (-V_o)(1-D) = 0$$

$$\boxed{V_o = D \cdot V_{in}} \quad \text{(Buck CCM)}$$

**Device voltage and current stress:**
- Switch OFF: sees full $V_{in}$ across it (diode ON clamps switching node to 0)
- Diode OFF (switch ON): sees $V_{in}$ in reverse
- **Both switch and diode voltage rating must exceed $V_{in}$**
- Both must handle peak current $I_{pk} = I_o + \Delta i_L/2$

---

## 3. Boost Converter — CCM Analysis

**Topology:** Series inductor L + switch Q (to ground) + diode D (series to output) + shunt C + load R.

| Interval | Duration | Switch | Diode | $v_L$ |
|----------|----------|--------|-------|-------|
| ON | $DT_s$ | ON | Reverse biased | $V_{in}$ |
| OFF | $(1-D)T_s$ | OFF | Forward (ON) | $V_{in} - V_o$ |

**Volt-second balance:**

$$V_{in} \cdot D + (V_{in} - V_o)(1-D) = 0$$

$$\boxed{V_o = \frac{V_{in}}{1-D}} \quad \text{(Boost CCM)}$$

**Key points:**
- $V_o \geq V_{in}$ always (D is between 0 and 1)
- At $D \to 1$: $V_o \to \infty$ in theory; in practice limited by losses
- Diode sees $V_o$ in reverse (higher than input!) — diode voltage rating must exceed $V_o$
- Switch sees $V_o$ when OFF
- **Non-minimum phase:** increasing duty cycle initially decreases output voltage transiently before it rises — makes control harder

---

## 4. Buck-Boost Converter — CCM Analysis

**Topology:** Switch Q + inductor L + diode D + capacitor C — all in a specific configuration producing inverted output.

| Interval | Duration | $v_L$ |
|----------|----------|-------|
| ON | $DT_s$ | $V_{in}$ (inductor charges from input) |
| OFF | $(1-D)T_s$ | $V_o$ (note: $V_o$ is defined as negative — output is inverted) |

**Volt-second balance:**

$$V_{in} \cdot D + V_o(1-D) = 0$$

$$\boxed{V_o = -\frac{D}{1-D} V_{in}} \quad \text{(Buck-Boost CCM)}$$

**Key points:**
- Output is **inverted** relative to input — polarity reversal
- $|V_o|$ can be greater or less than $V_{in}$ depending on D
- At $D = 0.5$: $|V_o| = V_{in}$
- Both switch and diode see $V_{in} + |V_o|$ in their off state (sum of input and output!)
- Higher device stress than buck or boost alone

---

## 5. Converter Comparison Table

| Parameter | Buck | Boost | Buck-Boost |
|-----------|------|-------|------------|
| Conversion ratio | $D$ | $\frac{1}{1-D}$ | $-\frac{D}{1-D}$ |
| Output vs input | $V_o \leq V_{in}$ | $V_o \geq V_{in}$ | $\lvert V_o \rvert$ either |
| Output polarity | Same | Same | **Inverted** |
| Switch voltage stress | $V_{in}$ | $V_o$ | $V_{in} + \lvert V_o \rvert$ |
| Diode voltage stress | $V_{in}$ | $V_o$ | $V_{in} + \lvert V_o \rvert$ |
| Input current | Pulsed (switch current) | Continuous (inductor) | Pulsed |
| Output current | Continuous (inductor) | Pulsed (diode current) | Pulsed |

> **Exam trap:** Boost converter has **pulsed output current** — the diode conducts only during the OFF interval. Buck has pulsed input current. Buck-boost has both pulsed.

---

## 6. Inductor Current Ripple (Buck)

During the ON interval, $v_L = V_{in} - V_o$ for time $DT_s$:

$$\Delta i_L = \frac{v_L \cdot t}{L} = \frac{(V_{in} - V_o) \cdot DT_s}{L}$$

Substituting $V_o = DV_{in}$:

$$\boxed{\Delta i_L = \frac{V_o(1-D)}{Lf_s} = \frac{(V_{in}-V_o) \cdot D}{Lf_s}}$$

Both forms are equivalent. The second makes it clear ripple peaks at $D = 0.5$ (where $V_o = 0.5 V_{in}$ and the product $D(1-D)$ is maximized).

**Ripple for other topologies:**

$$\Delta i_{L,boost} = \frac{V_{in} \cdot D}{Lf_s} \qquad \Delta i_{L,buck-boost} = \frac{V_{in} \cdot D}{Lf_s}$$

---

## 7. Capacitor Voltage Ripple (Buck)

The capacitor current equals $i_L - I_o$ — a triangular waveform. The capacitor charges and discharges with the ripple current.

$$\Delta Q = \frac{1}{2} \cdot \frac{T_s}{2} \cdot \frac{\Delta i_L}{2} = \frac{\Delta i_L \cdot T_s}{8}$$

$$\boxed{\Delta v_C = \frac{\Delta Q}{C} = \frac{\Delta i_L}{8Cf_s} = \frac{V_o(1-D)}{8LCf_s^2}}$$

**Effect of frequency:** $\Delta v_C \propto 1/f_s^2$ — **doubling $f_s$ reduces voltage ripple by 4×.**

> This is the primary benefit of increasing switching frequency: smaller L and C for the same ripple specs.

---

## 8. CCM vs DCM

| Mode | Condition | Inductor current | Analysis |
|------|-----------|-----------------|---------|
| **CCM** (Continuous Conduction Mode) | $i_L > 0$ throughout | Never reaches zero | Simpler; $V_o = DV_{in}$ |
| **DCM** (Discontinuous Conduction Mode) | $i_L = 0$ for part of cycle | Touches zero | $V_o$ also depends on $R$, not just $D$ |

**Boundary condition (CCM/DCM boundary):**

$$L_{crit} = \frac{V_o(1-D)}{2 I_{o,min} f_s} \quad \text{(buck)}$$

If $L < L_{crit}$ at a given load, converter is in DCM. **DCM occurs more easily at light load** (small $I_{o,min}$).

**DCM effects:**
- $V_o$ rises above $DV_{in}$ at light load (output tends toward $V_{in}$ for a buck)
- Better transient response in some topologies
- Higher peak current for same average current

---

## 9. Choosing L and C — Design Rules

### Inductor Selection

Two constraints give two minimum values — **always select the larger**.

**1. Critical inductance (guarantees CCM down to minimum load):**

$$L_{crit} = \frac{V_o(1-D)}{2 I_{o,min} f_s}$$

**2. Ripple-limited inductance (limits current ripple to spec):**

$$L_{ripple} = \frac{V_o(1-D)}{\Delta i_{L,max} \cdot f_s}$$

**→ Select $L \geq \max(L_{crit}, L_{ripple})$, then round up to next standard value.**

After selecting standard L, re-calculate actual $\Delta i_L$ and check peak current.

### Capacitor Selection

From the voltage ripple spec $\Delta v_C \leq \Delta v_{C,max}$:

$$C_{min} = \frac{\Delta i_L}{8 f_s \cdot \Delta v_{C,max}} = \frac{V_o(1-D)}{8Lf_s^2 \cdot \Delta v_{C,max}}$$

**Ratings to verify:**
- Voltage rating $> V_o$
- Ripple current rating $> I_{C,rms} = \Delta i_L/(2\sqrt{3})$

**ESR contribution to ripple:** $\Delta v_{ESR} = ESR \times \Delta i_L$. At high frequency, ESR often dominates over the capacitive ripple. Total ripple $\approx \Delta v_C + \Delta v_{ESR}$.

---

## 10. Buck Converter Design — Complete Example

**Given:** $V_{in} = 200\,V$, $V_o = 140\,V$, $P_{max} = 560\,W$, $P_{min} = 420\,W$, $\Delta i_L \leq 1\,A$, $f_s = 40\,kHz$, $\Delta v_C/V_o \leq 0.5\%$

**Step 1 — Duty cycle:**
$$D = \frac{140}{200} = 0.7$$

**Step 2 — Load currents:**
$$I_{o,max} = \frac{560}{140} = 4\,A \qquad I_{o,min} = \frac{420}{140} = 3\,A$$

**Step 3 — Device ratings:**
- Voltage: both switch and diode must withstand $> V_{in} = 200\,V$
- Current: both must handle $I_{pk} = I_{o,max} + \Delta i_L/2 = 4.5\,A$

**Step 4 — Inductor:**
$$L_{crit} = \frac{140 \times 0.3}{2 \times 3 \times 40000} = 175\,\mu H$$

$$L_{ripple} = \frac{140 \times 0.3}{1 \times 40000} = 1050\,\mu H$$

$L_{ripple} \gg L_{crit}$ → **Select $L = 1200\,\mu H$** (next standard value)

**Step 5 — Actual ripple at selected L:**
$$\Delta i_L = \frac{140 \times 0.3}{40000 \times 1.2\times10^{-3}} = 0.875\,A$$

**Step 6 — Inductor current rating:**
$$I_{pk} = 4 + \frac{0.875}{2} = 4.44\,A$$

**Step 7 — Capacitor:**
$$\Delta v_{C,max} = 0.005 \times 140 = 0.7\,V$$
$$C_{min} = \frac{0.875}{8 \times 40000 \times 0.7} \approx 3.9\,\mu F$$

**Select $C = 6\,\mu F$** electrolytic, voltage rating $> 140\,V$.

| Component | Requirement | Selected |
|-----------|------------|---------|
| Switch (MOSFET) | V $>$ 200 V, I $>$ 4.5 A | — |
| Diode | V $>$ 200 V, I $>$ 4.5 A | — |
| Inductor | $L > 1050\,\mu H$, $I_{pk} > 4.44\,A$ | 1200 μH |
| Capacitor | $C > 3.9\,\mu F$, V $>$ 140 V | 6 μF electrolytic |

---

## 11. H-Bridge Inverter — Analysis

**Topology:** 4 switches in two legs. Leg A: $T_{A+}$ (top) and $T_{A-}$ (bottom). Leg B: $T_{B+}$ (top) and $T_{B-}$ (bottom). DC bus = $V_{dc}$.

**Hard rule (shoot-through prevention):** Both switches in the **same leg must NEVER be ON simultaneously** — this directly short-circuits $V_{dc}$.

**Dead time:** A deliberate delay between turning one switch OFF and turning the other ON in the same leg, to prevent shoot-through. Typically 100 ns–1 μs.

**Four valid switching states:**

| State | Switches gated ON | $v_o = V_{AN} - V_{BN}$ | DC bus current |
|-------|------------------|-------------------------|---------------|
| 1 | $T_{A+}$, $T_{B-}$ | $+V_{dc}$ | $+i_o$ |
| 2 | $T_{A-}$, $T_{B+}$ | $-V_{dc}$ | $-i_o$ |
| 3 | $T_{A+}$, $T_{B+}$ | 0 | 0 (freewheeling) |
| 4 | $T_{A-}$, $T_{B-}$ | 0 | 0 (freewheeling) |

**Anti-parallel diodes and current direction:**

When a switch is gated ON but load current flows in the **opposite direction**, the **anti-parallel diode** of the complementary switch in the same leg conducts instead of the gated transistor. The transistor sees zero $V_{DS}$ and zero current — it's clamped off by its own body diode.

> **Example:** State 1 gated ($T_{A+}$, $T_{B-}$ ON), but $i_o < 0$. Current actually flows through diodes of $T_{A-}$ and $T_{B+}$.

---

## 12. Bipolar PWM

**Principle:** Only two diagonal switch pairs are used alternately.

| Reference vs carrier | Switches gated | $v_o$ |
|---------------------|---------------|-------|
| $v_{ref} > v_{carrier}$ | $T_{A+}$ & $T_{B-}$ | $+V_{dc}$ |
| $v_{ref} < v_{carrier}$ | $T_{A-}$ & $T_{B+}$ | $-V_{dc}$ |

**Output steps directly between $+V_{dc}$ and $-V_{dc}$** — step size = $2V_{dc}$.

**Average output voltage:**

$$\boxed{\bar{v}_o = V_{dc}(2d - 1)}$$

where $d$ is the duty cycle of the $+V_{dc}$ state.

Or equivalently: $d = \frac{\bar{v}_o + V_{dc}}{2V_{dc}} = \frac{1}{2} + \frac{\bar{v}_o}{2V_{dc}}$

**Fundamental component amplitude:** $\hat{v}_{o,1} = m_a \cdot V_{dc}$ where $m_a$ is the modulation index ($v_{ref}$ amplitude / carrier amplitude).

---

## 13. Unipolar PWM

**Principle:** Each leg is modulated independently.
- Leg A: compare $+v_{ref}$ with triangular carrier
- Leg B: compare $-v_{ref}$ with the **same** triangular carrier

Output: $v_o = v_{AN} - v_{BN}$

**States used:** All 4 states — including freewheeling (0 V) states. Output steps through $0 \to \pm V_{dc}$ — never jumps directly between $+V_{dc}$ and $-V_{dc}$.

**Key effect: effective output ripple frequency = $2f_s$**

Each leg switches at $f_s$. The output voltage, being the difference, has transitions twice as often → the load LC filter sees double the ripple frequency.

**Consequence:** For same ripple spec, output filter can be **4× smaller** than bipolar (since $\Delta v_C \propto 1/f^2$, doubling effective $f$ reduces ripple by 4×).

---

## 14. Bipolar vs Unipolar — Comparison

| Parameter | Bipolar | Unipolar |
|-----------|---------|---------|
| Voltage steps | $\pm V_{dc}$ jumps (size $2V_{dc}$) | Steps through 0: $0 \to \pm V_{dc}$ |
| Effective ripple frequency at load | $f_s$ | $\mathbf{2f_s}$ |
| Output current ripple | Larger | ~4× smaller |
| Required filter size | Larger | 4× smaller |
| dV/dt stress on load | Higher | Lower |
| EMI | Higher | Lower |
| Control complexity | 1 carrier, 1 reference | 1 carrier, 2 references ($\pm v_{ref}$) |
| States used | 2 diagonal pairs | All 4 states |

> **Classic exam point:** Unipolar doubling of effective frequency means — for the same filter — 4× less ripple; or for the same ripple, filter is 4× smaller. State this clearly.

---

## Formula Sheet — Week 1

**DC conversion ratios (CCM):**
$$V_o = D \cdot V_{in} \quad \text{(Buck)}$$
$$V_o = \frac{V_{in}}{1-D} \quad \text{(Boost)}$$
$$V_o = -\frac{D}{1-D} V_{in} \quad \text{(Buck-Boost)}$$

**Ripple:**
$$\Delta i_L = \frac{V_o(1-D)}{Lf_s} \quad \text{(Buck)} \qquad \Delta i_L = \frac{V_{in}D}{Lf_s} \quad \text{(Boost/Buck-Boost)}$$

$$\Delta v_C = \frac{\Delta i_L}{8Cf_s} = \frac{V_o(1-D)}{8LCf_s^2} \quad \text{(Buck)}$$

**Design:**
$$L_{crit} = \frac{V_o(1-D)}{2I_{o,min}f_s}, \qquad L_{ripple} = \frac{V_o(1-D)}{\Delta i_{L,max} f_s}$$

$$C_{min} = \frac{\Delta i_L}{8f_s \Delta v_{C,max}}, \qquad I_{pk} = I_{o,max} + \frac{\Delta i_L}{2}$$

**H-bridge:**
$$\bar{v}_o = V_{dc}(2d-1) \quad \text{(Bipolar PWM)}$$
