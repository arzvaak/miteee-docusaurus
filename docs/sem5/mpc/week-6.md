# Week 6 — Magnetics Design

> **NPTEL: Design of Modern Power Converters** | Prof. Shabari Nath, IIT Guwahati

---

## 1. Why Magnetics Must Be Designed (Not Bought)

Power electronics inductors and transformers operate at switching frequencies (kHz to hundreds of kHz). Off-the-shelf 50 Hz components are completely unsuitable — a 50 Hz transformer run at 100 kHz would saturate instantly because its core was designed for a much lower $dB/dt$.

**Where magnetics appear in a converter:**

| Component | Location | Function |
|-----------|----------|----------|
| Buck/boost inductor | Power stage | Energy storage, current ripple filtering |
| Flyback transformer | Isolation stage | Energy transfer + galvanic isolation |
| Forward converter transformer | Isolation stage | Voltage scaling + isolation |
| AC filter inductor | Inverter output | Attenuate switching harmonics |
| EMI filter choke | Input stage | Attenuate conducted EMI |

**Core rule:** The higher the switching frequency, the smaller the magnetics can be — this is the main reason for going to high frequency. But core loss also increases with frequency, so there is an optimum.

---

## 2. Magnetic Fundamentals — All Key Laws

### 2.1 Ampere's Law — MMF

$$\oint_C \mathbf{H} \cdot d\mathbf{l} = i_{enc} \implies \boxed{F = Hl = Ni} \quad \text{(Magnetomotive Force, MMF)}$$

- $H$ = magnetic field intensity (A/m)
- $l$ = magnetic path length (m)
- $N$ = number of turns
- $i$ = current (A)
- $F$ = MMF in Ampere-turns (A·t)

$$H = \frac{Ni}{l} \quad (A/m)$$

### 2.2 Faraday's Law — Voltage

$$\boxed{v(t) = \frac{d\lambda}{dt} = N\frac{d\phi}{dt} = L\frac{di}{dt}}$$

- $\lambda = N\phi$ = flux linkage (Wb·turns)
- This is the same equation that gives volt-second balance: integrating over a switching period in steady state gives zero average flux change.

### 2.3 Flux and Flux Density

$$\boxed{B = \frac{\phi}{A_c}} \quad (T,\text{ Tesla}) \qquad \phi = B \cdot A_c$$

- $A_c$ = core cross-sectional area (m²)

### 2.4 Permeability

$$\boxed{B = \mu H = \mu_r \mu_0 H} \qquad \mu_0 = 4\pi \times 10^{-7}\,H/m$$

- $\mu_r$ = relative permeability (dimensionless, from core material datasheet)
- Ferrites: $\mu_r \approx 1000$–5000
- Iron powder: $\mu_r \approx 50$–200

### 2.5 Reluctance (Magnetic Resistance)

$$\boxed{\mathcal{R} = \frac{l_c}{\mu A_c}} \quad (H^{-1} \text{ or A/Wb})$$

For a **gapped core** (series path through core + air gap):

$$\mathcal{R}_{total} = \mathcal{R}_c + \mathcal{R}_g = \frac{l_c}{\mu_r \mu_0 A_c} + \frac{l_g}{\mu_0 A_c}$$

> **Exam trap:** Air gap $\mu_r = 1$, not the core's $\mu_r$. The gap dominates reluctance even if it's much shorter than the core path length (because $\mu_r \gg 1$ for the core material).

### 2.6 Inductance

$$\boxed{L = \frac{N^2}{\mathcal{R}_{total}} = \frac{N^2 \mu_0 A_c}{l_g + l_c/\mu_{rc}}}$$

- Flux linkage: $\lambda = N\phi = \frac{N^2 i}{\mathcal{R}} = Li$

### 2.7 BH Curve — Key Regions

| Region | Behaviour | Practical significance |
|--------|-----------|----------------------|
| Linear | $B = \mu H$ (constant $\mu$) | Normal operating region — design here |
| Saturation | $B$ flattens; $\mu$ drops sharply | Inductance collapses → dangerous current spike |
| $B_r$ (residual flux) | $B$ when $H = 0$ | Present after removal of magnetizing current |
| $H_c$ (coercive force) | $H$ needed to bring $B = 0$ | Wide $H_c$ = hard magnet; narrow = soft magnet |

**Hard magnetic materials** (permanent magnets): wide BH loop, high $B_r$, high $H_c$ — retain magnetization.

**Soft magnetic materials** (inductors/transformers): narrow BH loop, low hysteresis loss — preferred in power electronics.

**BH loop area** = energy dissipated per cycle as heat = **hysteresis loss**.

---

## 3. Magnetic Core Materials

| Material | $\mu_r$ | Frequency | Resistivity | Use |
|----------|---------|-----------|-------------|-----|
| Silicon steel (laminated) | 1000–10000 | 50 Hz–1 kHz | Low | Mains transformers, motors |
| Ferrite (MnZn) | 1000–5000 | 1 kHz–1 MHz | Very high | SMPS inductors, transformers |
| Ferrite (NiZn) | 10–1000 | 1 MHz–300 MHz | Extremely high | RF inductors, EMI chokes |
| Iron powder | 10–200 | DC–200 kHz | High (distributed air gap) | Boost inductors with high DC bias |
| Amorphous/Nanocrystalline | 10000–100000 | 1 kHz–200 kHz | Medium | High-efficiency PFC inductors |

**Why ferrites dominate at high frequency:** Very high electrical resistivity → virtually no eddy currents → low core loss at high $f$.

**Why laminations help:** Thin sheets interrupt eddy current paths → reduce eddy current loss at low-medium frequency (silicon steel).

---

## 4. Magnetic Losses

**Total magnetic loss = core loss + copper (winding) loss**

$$P_{total} = P_{core} + P_{winding}$$

### 4.1 Core Loss — Steinmetz Equation

$$\boxed{P_v = k f^m B_m^n \quad (W/m^3 \text{ or } W/cm^3)}$$

$$P_{core} = P_v \cdot V_c \qquad V_c = A_c \cdot l_c \text{ (core volume)}$$

- $f$ = switching frequency
- $B_m$ = **AC** flux density amplitude (not peak, not DC bias — only the ripple component)
- $k$, $m$, $n$ = Steinmetz constants from **core material datasheet** (empirical fit)
- Typical values for ferrite: $m \approx 1.3$–1.7, $n \approx 2.2$–3.0

**3F3 ferrite example:**
$$P_v = 47.434 \cdot f^{1.3} \cdot B_m^{2.5} \quad [\text{mW/cm}^3, \; f \text{ in kHz}, B_m \text{ in T}]$$

| Loss component | Physical cause | Reduced by |
|---------------|---------------|------------|
| **Hysteresis loss** | Energy to cycle BH loop | Lower $f$, lower $B_m$, softer material |
| **Eddy current loss** | $i^2R$ in conductive core material | High resistivity core, laminations, ferrites |

> **Key distinction:** Hysteresis loss ∝ $f$; eddy current loss ∝ $f^2$. At very high frequency, eddy currents dominate for lossy materials — reason to use ferrite.

### 4.2 Winding (Copper) Loss

$$P_{winding} = I_{rms}^2 \cdot R_L$$

At DC: $R_{DC} = \frac{\rho \cdot l_w}{A_w}$ where $l_w = N \times \text{MLT}$

**At high frequency, $R_L$ increases above $R_{DC}$** due to two effects:

#### Skin Effect

$$\delta = \sqrt{\frac{2\rho}{\omega\mu_0}} = \sqrt{\frac{\rho}{\pi f \mu_0}}$$

For copper at 100 kHz: $\delta \approx 0.21\,mm$. Current flows only in an outer shell of thickness $\delta$. If the wire diameter is much larger than $2\delta$, most of the cross-section is wasted.

**Rule of thumb:** At 100 kHz, use wire with diameter $\leq 0.42\,mm$ (= $2\delta$).

#### Proximity Effect

Magnetic field from adjacent conductors induces eddy currents within a wire, further redistributing the current non-uniformly. In multi-layer windings, proximity effect can cause the effective AC resistance to be **many times** the DC resistance.

**Solution — Litz wire:** Hundreds of individually insulated strands, each thinner than $\delta$, twisted together so each strand sees equal average field over the length. Litz wire significantly reduces $R_{AC}$ at high frequency.

$$R_{AC} = F_R \cdot R_{DC} \qquad (F_R \geq 1, \text{ increases with frequency and layers})$$

---

## 5. Core Geometry — Types and Parameters

| Shape | Diagram | Advantages | Typical use |
|-------|---------|------------|-------------|
| **EE core** | Two E halves | Easy to wind; bobbin available | Transformers, large inductors |
| **Toroidal** | Doughnut | Low leakage inductance, no air gap fringing | EMI chokes, AC filter inductors |
| **UI core** | U + I halves | Simple construction | Mains transformers |
| **Pot core** | Enclosed | Very low EMI radiation; mechanically robust | Signal transformers, low power |
| **RM core** | Rectangular modular | PCB-mountable; small footprint | SMD power inductors |

**Critical core datasheet parameters:**

| Symbol | Name | Used in |
|--------|------|---------|
| $A_c$ | Core cross-sectional area | Flux density, turns calculation |
| $W_a$ | Window area (winding space) | Number of turns, wire selection |
| $l_c$ (MPL) | Magnetic path length | Reluctance, DC flux |
| MLT | Mean length per turn | Winding resistance |
| $A_t$ | Total surface area | Temperature rise calculation |
| $A_p = W_a A_c$ | Area product | Core selection for given energy |
| $\mu_{rc}$ | Relative permeability of core material | Air gap calculation |

---

## 6. Inductor Design — Area Product Method (Step-by-Step)

This is the **complete 8-step procedure** examined in NPTEL assignments.

**Inputs (given in problem):** $L$, $I_L$ (average/DC), $\Delta i_L$ (peak-to-peak ripple), $f_s$

**Design choices:** $J_m$ (current density, 3–5 A/mm²), $B_m$ (0.2–0.3 T), $K_u$ (window utilization, 0.3–0.5), core material

---

### Step 1 — Peak Current

$$\boxed{I_{L,pk} = I_L + \frac{\Delta i_L}{2}}$$

This is the maximum instantaneous current the inductor carries. The core must not saturate at this current.

---

### Step 2 — Maximum Stored Energy

$$\boxed{W_m = \frac{1}{2} L I_{L,pk}^2}$$

All energy to be stored in the magnetic field.

---

### Step 3 — Area Product

$$\boxed{A_p = W_a A_c = \frac{2W_m}{K_u B_m J_m} = \frac{L I_{L,pk}^2}{K_u B_m J_m}}$$

- $K_u$ accounts for: bobbin wall, wire insulation, dead space → typically 0.3–0.5
- $B_m$ = maximum AC flux density (design margin below $B_{sat}$)
- $J_m$ = current density in the wire

> The area product packs both geometry requirements into one figure: $W_a$ must fit the wire cross-section, $A_c$ must carry the flux. Larger energy → larger core.

---

### Step 4 — Core Selection

From manufacturer catalog, find core with $A_p \geq$ calculated value. Record: $A_c$, $W_a$, MPL, MLT, $A_t$, $\mu_{rc}$.

**Standard core families:** EE, ETD, PQ, RM, toroid series from Ferroxcube, TDK, Magnetics Inc.

---

### Step 5 — RMS Current and Wire Selection

$$\boxed{I_{L,rms} = \sqrt{I_L^2 + \frac{(\Delta i_L)^2}{12}}}$$

(For a DC current with triangular AC ripple.)

Required wire area:
$$A_w = \frac{I_{L,rms}}{J_m}$$

From AWG table, select next larger standard wire with $A_w \geq$ calculated value. Record actual $A_w$.

---

### Step 6 — Number of Turns

$$\boxed{N = \frac{K_u \cdot W_a}{A_w}}$$

Use actual (selected) $A_w$, not the minimum. Round **down** to nearest integer to ensure winding fits.

---

### Step 7 — Air Gap Length

From the required inductance and the chosen turns:

$$\boxed{l_g = \frac{\mu_0 A_c N^2}{L} - \frac{l_c}{\mu_{rc}}}$$

- First term: air gap needed if core had infinite permeability
- Second term: correction for finite core permeability (usually small compared to first term)
- If $l_g$ is negative, core permeability is too high for this design — choose a different core or material

> **Physical meaning:** The air gap stores most of the magnetic energy in an inductor. It also prevents saturation by increasing reluctance (flattening the $L$ vs $I$ curve).

---

### Step 8 — Verification Checks

#### Peak flux density (must be &lt; $B_{sat}$)

$$\boxed{B_{pk} = \frac{\mu_0 N I_{L,pk}}{l_g + l_c/\mu_{rc}}}$$

If $B_{pk} \geq B_{sat}$: increase gap, reduce turns, or select larger core.

#### AC flux density (for core loss)

$$\boxed{B_m = \frac{\mu_0 N (\Delta i_L/2)}{l_g + l_c/\mu_{rc}}}$$

Only the ripple component $\Delta i_L/2$ drives AC flux. The DC bias does not cause core loss.

#### Core loss

$$P_{core} = P_v \cdot V_c = P_v \cdot A_c \cdot l_c$$

where $P_v$ is from the Steinmetz equation using the actual $B_m$ and $f_s$.

#### Copper (winding) loss

$$P_{winding} = I_{L,rms}^2 \cdot R_L, \qquad R_L = \text{MLT} \times N \times R_{DC/length}$$

where $R_{DC/length}$ is resistance per unit length of the selected wire (from AWG table, in Ω/m).

#### Temperature rise

$$\psi = \frac{P_{core} + P_{winding}}{A_t} \quad (W/cm^2)$$

$$\boxed{\Delta T = 450 \cdot \psi^{0.826} \quad (°C)}$$

If $\Delta T > \Delta T_{max}$: select a larger core with bigger $A_t$, repeat.

---

## 7. Why an Air Gap Is Used in an Inductor (Not a Transformer)

| Inductor | Transformer |
|----------|-------------|
| Must **store** energy ($W = \frac{1}{2}LI^2$) | Must **transfer** energy (not store) |
| **Air gap required** — stores energy, prevents saturation under DC bias | **No air gap** — gap would require a large magnetizing current |
| DC bias present (large) | DC flux ideally zero |

> **Exam question:** "Why is an air gap used in inductor design but not transformer design?" — Air gap stores energy and prevents saturation under DC bias. A transformer should not store energy; a gap would add a large magnetizing current component unnecessarily.

---

## 8. Transformer Design — Key Differences

**Area product for transformer** (based on power rating rather than energy):

$$\boxed{A_p = \frac{P_o}{K_u K_f B_m J_m f_s}}$$

where $K_f$:
- $K_f = 4.44$ for sinusoidal waveform
- $K_f = 4.0$ for square wave

**Turns ratio from Faraday's law (square wave, volt-second balance):**

$$\boxed{N_1 = \frac{V_1}{4 f_s B_m A_c}} \qquad \frac{N_2}{N_1} = \frac{V_2}{V_1}$$

**Window allocation:** With primary fraction $\alpha = N_1/(N_1+N_2)$:
- Primary uses $\alpha \cdot K_u \cdot W_a$
- Secondary uses $(1-\alpha) \cdot K_u \cdot W_a$

**Interleaving:** Alternating primary and secondary winding layers reduces leakage inductance and proximity effect losses.

---

## 9. Key Exam Recall Points

- **Reluctance formula:** $\mathcal{R} = l/(\mu A_c)$ — same form as resistance ($R = l/(\sigma A)$)
- **Air gap dominates reluctance** because $\mu_0 \ll \mu_{core}$
- **Inductance formula:** $L = N^2/\mathcal{R}$ — more turns or less reluctance → more inductance
- **Steinmetz:** core loss uses AC flux amplitude, NOT DC bias. DC bias → saturation risk, not core loss
- **Skin depth** $\delta \propto 1/\sqrt{f}$ — halving frequency doubles skin depth
- **Litz wire** reduces proximity effect and skin effect at high frequency
- **Area product** combines window area and core area — single number to select a core
- **Temperature rise formula** $\Delta T = 450\psi^{0.826}$ is empirical; $\psi$ in W/cm²

---

## Formula Sheet — Week 6

$$F = Ni = Hl \quad \text{(MMF, Ampere-turns)}$$

$$\mathcal{R} = \frac{l_c}{\mu A_c}, \qquad \mathcal{R}_{gapped} = \frac{l_c}{\mu_r \mu_0 A_c} + \frac{l_g}{\mu_0 A_c}$$

$$L = \frac{N^2}{\mathcal{R}}, \qquad \lambda = Li = N\phi$$

$$v = N\frac{d\phi}{dt} = L\frac{di}{dt}$$

$$\delta = \sqrt{\frac{\rho}{\pi f \mu_0}} \quad \text{(skin depth)}$$

$$P_v = k f^m B_m^n \quad \text{(Steinmetz core loss density)}$$

$$A_p = W_a A_c = \frac{L I_{L,pk}^2}{K_u B_m J_m} \quad \text{(inductor area product)}$$

$$A_p = \frac{P_o}{K_u K_f B_m J_m f_s} \quad \text{(transformer area product)}$$

$$I_{L,rms} = \sqrt{I_L^2 + \frac{(\Delta i_L)^2}{12}}, \qquad N = \frac{K_u W_a}{A_w}$$

$$l_g = \frac{\mu_0 A_c N^2}{L} - \frac{l_c}{\mu_{rc}}$$

$$B_{pk} = \frac{\mu_0 N I_{L,pk}}{l_g + l_c/\mu_{rc}}, \qquad B_m = \frac{\mu_0 N (\Delta i_L/2)}{l_g + l_c/\mu_{rc}}$$

$$\Delta T = 450 \cdot \psi^{0.826}, \quad \psi = \frac{P_{core} + P_{winding}}{A_t}$$
