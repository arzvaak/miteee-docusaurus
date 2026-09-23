---
title: "Quick Revision"
math_syntax: typst
---

# Week 4 — Quick Revision

## Week 4 Revision Sheet: Distance Relays, Pilot Protection, and Carrier Communication

### Key Formulas and Concepts

1. **Distance Relay Setting Calculation**:
   - Secondary impedance: $Z_("sec") = Z_("prim") times frac("CT ratio", "PT ratio")$
   - Mho setting: $K_x = frac(|Z_x("sec")|, cos(theta - phi))$, where $theta$ = characteristic angle, $phi$ = angle of measured impedance.
   - Zone reach in km: $"Reach" = frac(Z_("prim"), |Z_("per km")|)$

2. **Fault Resistance Impact**:
   - Apparent impedance with remote infeed: $Z_("measured") = Z_("AF") + R_F (1 + frac(I_B, I_A))$
   - Arc resistance (empirical): $R_("arc") = frac(76 V^2, S_("sc"))$, $V$ in kV, $S_("sc")$ in kVA.

3. **Zero-Sequence Compensation Factor**: $k = frac(Z_0 - Z_1, Z_1)$ for ground distance relays.

### Common Traps and Mistakes
- **Fault Resistance and Power Flow**: Fault resistance does not just add a real component; it can distort the imaginary part depending on power flow direction. Pre-fault power flow from A to B causes overreach; from B to A causes underreach.
- **Unit Conversion**: Always convert primary impedances to secondary using CT/PT ratios correctly. PT ratio is voltage ratio (kV/V), CT ratio is current ratio (A/A).
- **Characteristic Angles**: For Mho relays, $theta$ is typically set to the line impedance angle. The angle difference $(theta - phi)$ in the denominator is critical.
- **Zone Settings**: Zone 1 covers 80-90% of the line; Zone 2 covers 100% of the line plus 20-50% of the shortest adjacent line; Zone 3 covers the entire line plus the longest adjacent line.

### Relay Characteristics Comparison
- **Reactance**: Immune to fault resistance, but vulnerable to power swings. Suitable for short lines.
- **Impedance**: Poor fault resistance tolerance, causes underreach. Simple but limited.
- **Mho**: Better fault resistance tolerance than impedance, but still underreach. Common for long lines.
- **Quadrilateral**: Best fault resistance tolerance and power swing security. Used for critical lines.

### Pilot Protection Key Points
- **Advantages**: Simultaneous high-speed tripping, single-pole tripping, auto-reclosing.
- **Disadvantages**: Higher cost, complexity, communication channel requirements.
- **Carrier Schemes**: Blocking (signal blocks tripping) vs. Tripping (signal initiates tripping).
- **Communication Channels**: Fiber optic (best for long lines, EMI immune), power line carrier (30-600 kHz), microwave (0.3-3 GHz), radio (10 kHz-0.1 GHz, course-specific).

### Frequency Ranges (Course-Specific)
- Audio: 0.02-20 kHz
- Power Line Carrier: 30-600 kHz
- Radio: 10 kHz-0.1 GHz (lecture definition)
- Microwave: 0.3-3 GHz
- Fiber Optic: 0.85-1.6 μm wavelength

### Device Functions
- **Wave Trap**: Low impedance to power frequency, high to carrier.
- **Coupling Capacitor**: Low impedance to carrier, high to power frequency.
- **Summing Transformer**: Converts three-phase to single-phase for pilot wires.
- **Spark Gap**: Overvoltage protection for RF choke.

### Practical Tips
- Always check the power flow direction when analyzing fault resistance effects.
- For ground faults, use compensated current $I_R' = I_R + k I_0$.
- Verify zone settings by converting between primary and secondary correctly.
- Remember that pilot protection is for critical lines where speed and simultaneous tripping are essential.