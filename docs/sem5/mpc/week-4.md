# Week 4 — Gate Drivers & Snubber Design

> **NPTEL: Design of Modern Power Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Additional Gate Driver Requirements

Building on Week 3, the complete gate driver specification also includes:

**Dead time / shoot-through prevention:** Hardware interlock that ensures both switches in a leg cannot be ON simultaneously. A fixed dead time is inserted between one switch turning OFF and the complementary switch turning ON. This is non-negotiable — shoot-through destroys the converter.

**Under-voltage lockout (UVLO):** Forces gate output OFF if supply voltage drops below a threshold. Prevents partial enhancement (linear region operation) which would cause catastrophic power dissipation. Hysteresis prevents chatter at the threshold.

**Negative gate voltage for turn-off:** Driving gate to $-5$ to $-8\,V$ at turn-off (rather than 0 V):
- Speeds up turn-off (larger $V_{GS}$ swing)
- Prevents false turn-on from Miller capacitance coupling

**Gate drive output protection:** Some ICs include output short-circuit protection and over-temperature shutdown.

---

## 2. Why Snubbers Are Needed

Every current-carrying conductor (PCB trace, wire, bus bar) has **parasitic inductance** $L_p$. In a real converter, this inductance cannot be reduced to zero — it is inherent in the geometry.

**What happens at turn-off without a snubber:**

When the switch turns OFF, the load current ($I_{sw}$) must transfer to the freewheeling diode. But the parasitic inductance opposes the current change:

$$V_{spike} = V_{in} + L_p \cdot \frac{dI}{dt}$$

This spike **exceeds $V_{in}$** and can destroy the switch if it exceeds the device's $V_{DS,max}$ or $V_{CES}$.

**Subsequent ringing:** $L_p$ and the device's output capacitance $C_{oss}$ form an LC tank:

$$f_{ring} = \frac{1}{2\pi\sqrt{L_p C_{oss}}} \quad \text{(ringing frequency)}$$

This oscillation radiates EMI, causes extra loss, and can again push the device out of its SOA.

**Four functions of snubbers (exam answer):**

1. Limit peak voltage during turn-off
2. Control $dV/dt$ and $dI/dt$ during switching
3. Shape the switching trajectory to stay within the SOA
4. Damp LC ringing

---

## 3. Snubber Types Overview

| Type | Components | Best for | Loss |
|------|-----------|----------|------|
| **RC** | $R_s$, $C_s$ in series across device | General voltage clamping and damping | $\frac{1}{2}C_s V^2 f_s$ per cycle |
| **RCD** | $R_s$, $C_s$, $D_s$ | Lower loss than RC; separate charge/discharge paths | Less than RC |
| **Zener/TVS** | Zener clamp | Hard voltage clamp | Only conducts during spikes |
| **Ferrite bead** | Lossy inductor on PCB trace | High-frequency EMI suppression | Small |
| **Turn-on snubber** | Series inductor in switch path | Limit $dI/dt$ at turn-on; protect diode from $I_{RR}$ | Separate |

---

## 4. RC Snubber — Theory and Equations

**Circuit:** $R_s$ and $C_s$ in series, placed **directly across the switch** (drain-source or collector-emitter).

**At turn-off:** The inductor current commutates from the switch into the $C_s$-$R_s$ branch. This is an $L_p$-$C_s$-$R_s$ circuit with initial conditions:
- $i_{L_p}(0) = I_{rr}$ (the reverse recovery current of the freewheeling diode, just before the switch turned off)
- $v_{C_s}(0) = 0$ (initially uncharged)

**Key normalised parameters:**

$$\omega_0 = \frac{1}{\sqrt{L_p C_s}} \quad \text{(natural frequency)}$$

$$\zeta = \frac{R_s}{2}\sqrt{\frac{C_s}{L_p}} \quad \text{(damping ratio)}$$

$$\chi = \frac{R_s \cdot I_{rr}}{2E} \quad \text{(normalised initial condition; } E = V_{in}\text{)}$$

**Damping cases:**

| Condition | $\zeta$ | Voltage waveform |
|-----------|---------|-----------------|
| Underdamped | $\zeta < 1$ | Oscillates; peak $E_1 > E$ → dangerous |
| Critically damped | $\zeta = 1$ | No overshoot; fastest non-oscillatory response |
| Overdamped | $\zeta > 1$ | Exponential, no oscillation; settles slowly |

**Design target:** Select $R_s$ and $C_s$ to keep peak voltage $E_1$ within the device's rated $V_{DS,max}$ with a safety margin.

---

## 5. RC Snubber Design — 3-Method Procedure

This is the core NPTEL design procedure. Given: $V_{in}$, $L_p$, $V_{DS,max}$ (device datasheet), $dV/dt$ limit (device datasheet), and compute $I_{rr}$ from diode datasheet.

### Preliminary: Compute $I_{rr}$

$$I_{rr} = \frac{2Q_{rr}}{t_{rr}}$$

---

### Method 1 — Peak Voltage Constraint Only

**Goal:** Limit $E_1/E \leq$ target (e.g., 2.0, meaning $E_1 \leq 2V_{in}$).

1. Set $E_1/E = V_{DS,max}/V_{in}$ (or a chosen safety margin)
2. From design curves (given in assignment), read off $\chi_o$ and $\zeta_o$ at the target $E_1/E$
3. Compute:
$$C_s = \frac{L_p I_{rr}^2}{4 \chi_o^2 E^2}$$
$$R_s = 2\zeta_o \sqrt{\frac{L_p}{C_s}}$$

**This method gives the smallest $C_s$ (only peak voltage considered) → minimum snubber loss.** In the NPTEL assignment, this is called the "small snubber."

---

### Method 2 — dV/dt Constraint Only

**Goal:** Limit the average $dV/dt$ across the switch to the datasheet limit (with safety factor).

1. Compute the normalised dV/dt:
$$\frac{(dV/dt)_{av,max}}{E \cdot \omega_0}$$
2. From design curves, read $\chi_o$ and $\zeta_o$ at this normalised value
3. Often $C_s$ is given (e.g., $C_s = 2\,nF$) and only $R_s$ needs to be found:
$$R_s = 2\zeta_o \sqrt{\frac{L_p}{C_s}}$$

---

### Method 3 — Compromise (Both Constraints)

**Goal:** Satisfy both peak voltage AND dV/dt simultaneously.

1. Compute: $\frac{(dV/dt)_{av,max} \cdot L_p \cdot I_{rr}}{E^2}$
2. From the compromise design curve, read $\chi_o$ and $\zeta_o$
3. Solve for both $C_s$ and $R_s$ from the two equations

> **Exam point:** Method 1 (peak voltage only) gives the **smallest $C_s$** → **lowest snubber loss** $= \frac{1}{2}C_s V_{in}^2 f_s$. The NPTEL assignment asks which snubber has the least power loss — answer: **small snubber (Method 1)**.

---

### Design Example — IRFI540NPbF

**Given:** $V_{in} = 50\,V$, $L_p = 8\,nH$, $V_{DS,max} = 100\,V$, $dV/dt$ limit = 12 V/ns (use 6 V/ns with ×2 safety factor)

**Preliminary:**
$$E_1/E = \frac{100}{50} = 2 \quad \Rightarrow \text{no more than double the bus voltage}$$

**Diode parameters (from RHRG30120 or similar):** $Q_{rr}$, $t_{rr}$ → compute $I_{rr}$.

**Method 1 (peak voltage, $E_1/E = 2$):**
- From curves: read $\chi_o \approx 0.9$, $\zeta_o \approx 0.15$
- $C_s = L_p I_{rr}^2 / (4 \chi_o^2 E^2)$
- $R_s = 2\zeta_o \sqrt{L_p/C_s}$

**Method 2 (dV/dt = 6 V/ns = $6\times10^9$ V/s):**
- Assign $C_s = 2\,nF$; compute $\omega_0 = 1/\sqrt{L_p C_s}$
- Normalize $dV/dt$; read $\zeta_o$ from curves
- $R_s = 2\zeta_o\sqrt{L_p/C_s}$

**Method 3 (compromise):**
- Combine both normalisations to find the operating point that satisfies both

All three methods satisfy the specified constraints; they differ only in the resulting $C_s$ value (and hence snubber loss).

---

## 6. RC Snubber Power Loss

Energy stored in $C_s$ each cycle (when the switch turns ON, the capacitor has been charged to approximately $V_{in}$):

$$E_{cycle} = \frac{1}{2} C_s V_{in}^2$$

This energy is dissipated in $R_s$ each switching cycle:

$$\boxed{P_{snubber} = \frac{1}{2} C_s V_{in}^2 f_s}$$

**Design trade-off:**
- Larger $C_s$ → better voltage clamping (lower peak voltage) → **more snubber loss**
- Smaller $C_s$ → less clamping → **less loss**, but peak voltage may exceed device rating

> **Important:** The snubber adds to the total converter loss. In high-frequency designs, even a few nF of snubber capacitance can be significant at the switch voltage.

---

## 7. RCD Snubber

**Configuration:** $C_s$ is placed in parallel with the switch. $D_s$ (fast diode) is in series with $R_s$, and this $D_s$-$R_s$ branch is in parallel with $C_s$.

**Diode orientation:** $D_s$ allows current flow **into** $C_s$ (charging path) but blocks the reverse (discharge path goes only through $R_s$).

**Operation:**

| Event | Path | Speed |
|-------|------|-------|
| Turn-OFF (voltage rising) | Current flows into $C_s$ through $D_s$ — $R_s$ is bypassed | **Fast** — diode shorts $R_s$; $C_s$ charges quickly |
| Turn-ON (voltage falling) | $C_s$ discharges through $R_s$ (diode reverse biased) | **Controlled** — $R_s$ limits discharge rate |

**Advantages over RC:**
- At turn-off: no $R_s$ in charging path → $C_s$ clamps more effectively at lower peak voltage
- Turn-ON: controlled discharge prevents the initial spike from $L_p \cdot di/dt$ from ringing with $C_s$
- Overall lower peak voltage for same $C_s$ value compared to RC

**When to use RCD vs RC:**
- RCD: preferred in most DC-DC converters where separate charging/discharge control is needed
- RC: simpler; adequate for lower-power or lower-frequency applications where snubber loss is not critical

---

## 8. Turn-ON Snubber — Concept

A **turn-ON snubber** (series inductor $L_s$ in the switch current path) limits $dI/dt$ at turn-on. This is especially important when a freewheeling diode has large reverse recovery current $I_{RR}$:

Without turn-ON snubber: Switch current rises to $I_{load} + I_{RR}$ almost instantly → high current spike through switch.

With series $L_s$: $dI/dt = V_{in}/L_s$ — controlled rate. Diode has time to recover before full current is demanded.

**Cost:** $L_s$ stores energy $\frac{1}{2}L_s I^2$ that must be dissipated each cycle — adds to loss.

In modern designs, **SiC or fast recovery diodes with low $Q_{rr}$** eliminate the need for turn-on snubbers by eliminating the $I_{RR}$ problem.

---

## 9. Switching Trajectory and SOA

**Switching trajectory** = the path traced on the $V_{DS}$-$I_D$ plane during turn-on and turn-off.

**Ideal trajectory (hard switching):**
- Turn-off: $I_D$ falls while $V_{DS}$ rises (crossing through high-loss region where both are large simultaneously)
- Turn-on: $V_{DS}$ falls while $I_D$ rises

**SOA (Safe Operating Area):** The region of the $V_{DS}$-$I_D$ plane where the device is safe.

**What snubbers do to the trajectory:**
- Turn-off snubber ($C_s$): Slows down $V_{DS}$ rise → $I_D$ falls first → trajectory moves close to $I$ axis → lower turn-off loss
- Turn-on snubber ($L_s$): Slows down $I_D$ rise → $V_{DS}$ falls first → trajectory moves close to $V$ axis → lower turn-on loss

This is the concept behind **soft switching** (ZVS/ZCS) — arrange switching so the voltage OR current is near zero when the other transitions.

---

## Formula Sheet — Week 4

$$V_{spike} = V_{in} + L_p \cdot \frac{di}{dt} \quad \text{(turn-off spike without snubber)}$$

$$\omega_0 = \frac{1}{\sqrt{L_p C_s}}, \qquad \zeta = \frac{R_s}{2}\sqrt{\frac{C_s}{L_p}}, \qquad \chi = \frac{R_s I_{rr}}{2E}$$

$$R_s = 2\zeta_o\sqrt{\frac{L_p}{C_s}} \quad \text{(from damping ratio and parameters)}$$

$$I_{rr} = \frac{2Q_{rr}}{t_{rr}} \quad \text{(peak reverse recovery current)}$$

$$P_{snubber} = \frac{1}{2} C_s V_{in}^2 f_s \quad \text{(RC snubber loss)}$$

$$f_{ring} = \frac{1}{2\pi\sqrt{L_p C_{oss}}} \quad \text{(ringing frequency without snubber)}$$
