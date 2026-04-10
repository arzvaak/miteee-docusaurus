# Week 3 — Gate Drivers

> **NPTEL: Design of Power Electronic Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Gate Driver Requirements

A gate driver is the interface between the **low-voltage PWM signal** (3.3 V / 5 V logic) and the **high-voltage power switch gate** (typically driven to ±15 V relative to its source/emitter).

**Four requirements (all four are exam answers):**

1. **Meet voltage and current requirements** — drive gate to $V_{GS,on}$ (e.g., +15 V) and $V_{GS,off}$ (e.g., −5 V or 0 V), with peak current to charge/discharge $Q_g$ quickly
2. **Provide isolation** between control circuit (low-voltage ground) and power circuit (floating high-voltage switching node)
3. **Float with the switching node** — high-side switch emitter/source swings between 0 and $V_{dc}$; gate driver supply must track this
4. **Level shifting** — translate the logic-level PWM signal to the gate drive voltage

**Why does the high-side switch need a floating supply?**

In any bridge leg (buck, H-bridge, half-bridge), the high-side switch has its source/emitter connected to the **switching node** — not to ground. When the low-side switch is ON, the switching node is at 0 V. When the high-side switch is ON, it is at $V_{DC}$. The gate must be driven to $V_{source} + 15\,V$ — a voltage that changes between +15 V and $V_{DC}+15\,V$. A ground-referenced supply cannot do this.

**Low-side switch:** Source/emitter is directly on the negative bus (ground). Gate driver can be ground-referenced — no floating supply needed.

---

## 2. Gate Driver Isolation Methods

| Method | Isolation type | Coupling | DC signal capability | Typical IC examples |
|--------|---------------|----------|---------------------|-------------------|
| **Optocoupler** | **Optical** (light) | Photo-transistor | Yes (sustained ON/OFF) | HCPL-3180, ACNW3190 |
| **Pulse transformer** | **Magnetic** (inductive) | Inductive | **No** (AC pulses only) | Various gate drive transformers |
| **Bootstrap capacitor** | **None** (capacitive charge) | Capacitive | Yes | Integrated in IR2110, half-bridge ICs |
| **Isolated DC-DC converter** | Magnetic | Dedicated isolated supply | — | Separate issue; supplies the gate driver |

**Optocoupler vs Pulse Transformer — key distinction for exam:**

| Feature | Optocoupler | Pulse Transformer |
|---------|-------------|------------------|
| Isolation mechanism | **Optical (light)** | **Magnetic (inductive)** |
| Sustained state | Can transmit sustained ON | **Cannot** — only AC pulses |
| Max duty cycle | Up to 100% | Limited by core saturation |
| Requires separate supply | Yes (isolated supply needed) | No (pulse carries energy) |
| Common Mode Rejection | Very high (CMRR) | Moderate |
| Size | Small | Larger at high voltage |

---

## 3. Optocoupler Gate Drivers — HCPL-3180 (Complete Datasheet)

The HCPL-3180 is a common isolated gate driver for IGBTs/MOSFETs up to ~1200 V bus.

### How it works

Control side: PWM signal → series resistor → LED inside optocoupler. The LED emits light proportional to current.

Power side: Photodetector receives light → output stage delivers gate drive current from $V_{CC}$ supply (isolated).

Galvanic isolation is maintained by the light path — no electrical connection between sides.

### Complete HCPL-3180 Datasheet Values (exam-relevant)

| Parameter | Symbol | Value |
|-----------|--------|-------|
| Peak output current (source/sink) | $I_{o,peak}$ | **±2.5 A** |
| Maximum supply voltage | $V_{CC}$ | **25 V** |
| Maximum output power dissipation | $P_{out}$ | **250 mW** |
| Maximum average input LED current | $I_{F,avg}$ | **25 mA** |
| Maximum input forward voltage | $V_F$ | **1.8 V** |
| LED threshold voltage (logic high input) | $V_{FHL}$ | **0.8 V** |
| Propagation delay (low→high output) | $t_{PLH}$ | **150 ns** |
| Propagation delay (high→low output) | $t_{PHL}$ | **150 ns** |
| Max low-level output voltage | $V_{OL}$ | **0.5 V** |

> **$\pm 2.5\,A$ peak output** — this is the peak gate drive current available. Sufficient for most IGBTs/MOSFETs with appropriate gate resistor.

### Input Series Resistor Calculation

The LED must be protected from excessive forward current:

$$\boxed{R_{min} = \frac{V_p - V_{F,max}}{I_{F,max}}}$$

**Example (assignment values):** $V_p = 5\,V$, $V_{F,max} = 1.8\,V$, $I_{F,max} = 25\,mA$

$$R_{min} = \frac{5 - 1.8}{0.025} = \frac{3.2}{0.025} = 128\,\Omega$$

> Always use **maximum $V_F$** (not typical) for the minimum resistance calculation — this is the worst case (lowest $V_F$ → highest current). Common mistake: using typical $V_F$ and getting a resistance that allows too much current at cold temperature when $V_F$ is at its minimum.

### Propagation Delay and Switching Frequency Limit

Both delays are 150 ns, so the total dead-band introduced by the optocoupler is up to 300 ns. At $f_s = 100\,kHz$ ($T_s = 10\,\mu s$), this is 3% of the switching period — acceptable but not negligible.

At $f_s = 1\,MHz$, the 300 ns becomes 30% of the period — optocouplers are too slow and must be replaced with transformer-isolated or direct-level-shift drivers.

---

## 4. Bootstrapping — Complete Analysis

**Purpose:** Provide a **self-powered floating supply** for the high-side gate driver without needing a separate isolated DC-DC converter.

### Circuit Operation

**Components:** Bootstrap diode $D_B$ (fast diode), Bootstrap capacitor $C_B$, high-side gate driver powered from $V_{CB}$.

**Phase 1 — Charging ($Q_{low}$ ON, $Q_{high}$ OFF):**
- Switching node is at 0 V (ground)
- $D_B$ is forward biased: $C_B$ charges through $D_B$ to $\approx V_{CC} - V_{D_B}$
- The gate driver's supply pin is connected to $C_B$; it charges up

**Phase 2 — Discharging ($Q_{high}$ ON, $Q_{low}$ OFF):**
- Switching node jumps to $V_{DC}$
- $D_B$ is now reverse biased (cathode at $V_{DC} + V_{CB}$, anode at $V_{CC}$) — $D_B$ blocks
- $C_B$ floats up with the switching node, now with its positive terminal at $V_{DC} + V_{CB}$
- This voltage drives the gate to $V_{DC} + V_{CB}$ — above $V_{DC}$, which turns ON $Q_{high}$ relative to its source

$$V_{CB,initial} = V_{CC} - V_{D_B} \quad \text{(initial charge voltage)}$$

### Bootstrap Capacitor Droop

Each switching cycle, the gate driver draws charge from $C_B$. The voltage drops by:

$$\Delta V_{CB} = \frac{Q_{total}}{C_B} \approx \frac{Q_g + Q_{leak}}{C_B}$$

where $Q_g$ is the gate charge and $Q_{leak}$ accounts for gate driver quiescent current and leakage.

**Design rule:** Choose $C_B$ such that $\Delta V_{CB} \leq 1\,V$ — ensures gate drive voltage stays well above $V_{th}$.

$$C_B \geq \frac{Q_g + Q_{leak}}{\Delta V_{CB,max}}$$

The bootstrap capacitor **recharges every cycle** as long as the low-side switch turns ON. Minimum on-time of the low-side switch must be sufficient to recharge $C_B$ to near-full.

### Bootstrap Limitations and When NOT to Use

| Limitation | Explanation |
|-----------|-------------|
| **Cannot work at 100% duty cycle** | If the low-side switch never turns ON, $C_B$ never recharges → supply collapses |
| **Not a galvanically isolated driver** | High-side and low-side share the same logic supply — no true isolation |
| **Limited by $C_B$ droop** | Very high gate charge MOSFETs may drain $C_B$ faster than it recharges |
| **Not suitable for isolated topologies** | In a flyback/forward converter secondary, there is no continuous return path to charge $C_B$ |

**When bootstrap works well:** Buck, half-bridge, full-bridge, totem-pole PFC — any topology with alternating leg switching that guarantees periodic low-side conduction.

---

## 5. Negative Gate Voltage at Turn-Off

**Standard gate drive:** $+15\,V$ for ON, $0\,V$ for OFF (referenced to source).

**Better practice:** $+15\,V$ for ON, $-5\,V$ to $-8\,V$ for OFF.

**Why negative voltage at turn-off?**

1. Faster discharge of $C_{gs}$ — larger voltage swing → more gate current → shorter $t_{off}$
2. **Prevents false turn-on from Miller effect:** Fast rising $V_{DS}$ (e.g., when the complementary switch turns on) drives a displacement current through $C_{gd}$ into the gate. If gate is held at 0 V, this current can momentarily push $V_{GS}$ above threshold → false turn-on (shoot-through). Holding gate at −5 V adds a safety margin.
3. Better noise immunity against interference coupling onto the gate trace

> **Key exam point:** The primary reason for negative turn-off voltage is to prevent **false turn-on due to Miller capacitance coupling** when the complementary switch switches.

---

## 6. Under-Voltage Lockout (UVLO)

**UVLO:** Gate driver monitors its own supply voltage. If the supply drops below a threshold (e.g., 10 V), the output is forced LOW (gate OFF) and stays off until supply recovers above a higher threshold (hysteresis).

**Why it's necessary:** If $V_{CC}$ drops (startup, capacitor discharged), the gate may only partially enhance — putting the MOSFET/IGBT in its linear region with high $V_{DS}$ and significant $I_D$ → excessive power dissipation. UVLO prevents the device from operating in a partially-on state.

**UVLO in bootstrap:** Bootstrap capacitor may be partly discharged at startup. UVLO ensures the high-side driver doesn't fire until $C_B$ has charged sufficiently.

---

## 7. Desaturation (Desat) Protection

**Purpose:** Protect against overcurrent/short-circuit by detecting when the switch exits saturation.

**Normal operation:** Fully ON IGBT/MOSFET has $V_{CE(sat)} \approx 1$–$3\,V$.

**Fault condition:** Overcurrent or short circuit → $I_C$ rises → device enters active region → $V_{CE}$ rises to 5–10 V or more.

### Desat Circuit Elements

| Element | Function |
|---------|----------|
| **Desat diode** (fast, high-voltage) | Monitors $V_{CE}$/$V_{DS}$; reverse biased during fault → current flows to comparator |
| **Blanking capacitor** $C_{blank}$ | Delays Desat detection ~$1\,\mu s$ after turn-on to ignore initial $V_{DS}$ overshoot |
| **Comparator** | Trips when $V_{Desat}$ exceeds threshold (~7–9 V) |
| **Soft turn-off circuit** | Reduces gate voltage slowly after fault detection |

### Soft Turn-Off — Why Not Just Hard-Switch Off?

If a large current is flowing through the device and the gate is pulled hard to zero (hard turn-off):

$$V_{spike} = L_{parasitic} \cdot \frac{di}{dt}$$

A 100 A current interrupted in 100 ns through 10 nH of bus inductance: $V_{spike} = 10\times10^{-9} \times 10^8 = 100\,V$ — potentially catastrophic.

**Soft turn-off:** Gate ramps down slowly (using a resistor or current source) → $di/dt$ is controlled → $V_{spike}$ stays within the device's RBSOA.

---

## 8. Pulse Transformer Gate Drivers

**Isolation mechanism:** Magnetic (inductive) coupling — primary winding driven by PWM, secondary delivers gate signal.

**Advantages:**
- No separate isolated supply needed — energy is transferred with the pulse
- Very fast (limited only by leakage inductance)
- Simple circuit

**Key limitation — cannot transmit DC:**

A pulse transformer has a finite volt-second product ($\lambda = V \cdot t_{on} \leq N A_c B_{sat}$). A sustained ON pulse will eventually saturate the core → no further coupling. Therefore pulse transformers are only suitable for PWM with moderate duty cycles (typically 20–80%) and are completely unsuitable for:
- Near-100% duty cycle (e.g., soft starters)
- Sustained ON state

**Reset circuit:** After each ON pulse, the transformer core must be reset. Some designs use a reset winding; others rely on the 50% duty cycle averaging.

---

## 9. Dead Time and Interlock

**Shoot-through** occurs if both switches in a leg are ON simultaneously → direct short on $V_{DC}$ → catastrophic overcurrent.

**Dead time:** A deliberate gap where both gate signals are LOW between transitions. Typically 100 ns–2 μs depending on device speed.

**Trade-off:** Longer dead time → safer; but output voltage distortion (missing pulses near zero crossings), and body diode conduction introduces extra loss.

**Interlock logic:** Many gate driver ICs include hardware interlock that prevents both outputs from being high simultaneously, regardless of the input signals.

---

## Formula Sheet — Week 3

$$R_{min} = \frac{V_p - V_{F,max}}{I_{F,max}} \quad \text{(optocoupler input resistor)}$$

$$C_B \geq \frac{Q_g + Q_{leak}}{\Delta V_{CB,max}} \quad \text{(bootstrap cap minimum)}$$

$$\Delta V_{CB} = \frac{Q_g + Q_{leak}}{C_B} \quad \text{(cap droop per cycle)}$$

$$V_{CB} = V_{CC} - V_{D_B} \quad \text{(bootstrap cap charge voltage)}$$

$$t_{on} \approx \frac{Q_g}{I_{g,avg}} \quad \text{(switching time estimate from gate current)}$$

$$P_g = Q_g \cdot V_{GS} \cdot f_s \quad \text{(gate drive power)}$$
