---
title: "Quick Revision"
math_syntax: typst
---

# Week 3 — Quick Revision

## Week 3 Revision Sheet: Distance Protection & Directional Relaying

### Key Formulas & Concepts
1.  **Symmetrical Components:**
    -   $I_1 = frac(1,3)(I_a + a I_b + a^2 I_c)$
    -   $I_2 = frac(1, 3)(I_a + a^2 I_b + a I_c)$
    -   $I_0 = frac(1,3)(I_a + I_b + I_c)$
    -   $a = 1 angle 120 degree$

2.  **Distance Relay Impedance Conversion:**
    -   $Z_("sec") = Z_("pri") times frac(C T_("ratio"), P T_("ratio"))$
    -   $"CT"_("ratio") = I_("pri")/I_("sec")$, $"PT"_("ratio") = V_("pri")/V_("sec")$

3.  **Directional Relay Torque:**
    -   $T prop V dot I dot cos(phi - theta)$
    -   $phi$ = fault angle, $theta$ = MTA (set via CT/PT connections: 30°, 60°, 90°).

4.  **Transient Overreach:**
    -   $percent$ Overreach $= frac(Z_x - Z_y, Z_y) times 100$
    -   $Z_x$: max Z with DC offset, $Z_y$: max Z with symmetrical current.

### Common Traps & Mistakes
-   **Sequence Components:** Forgetting the operator 'a' in calculations. Assuming $I_0$ flows for L-L faults (it doesn't). Summing magnitudes instead of phasors.
-   **Distance Settings:** Confusing primary and secondary impedance. Using full impedance magnitude |Z| for reactance relay settings (should use X only). Inverting the CT/PT ratio conversion factor.
-   **Directional Relays:** Assuming they work with zero voltage (dead zone exists). Using wrong voltage for 90° connection (should be V_YB for R-phase, not V_RY). Thinking they increase speed (they add selectivity).
-   **Zone Coordination:** Setting Zone 2 too short (must cover next line). Setting Zone 3 without considering load encroachment. Assuming Zone 2 is instantaneous (it's time-delayed).

### Critical Comparisons
| Feature | Impedance Relay | Reactance Relay | Mho Relay | Quadrilateral |
| :--- | :--- | :--- | :--- | :--- |
| **Characteristic** | Circle at origin | Horizontal line | Circle through origin | Four-sided |
| **Directional?** | No (needs unit) | No | Yes (inherent) | Yes (inherent) |
| **Fault Resistance** | Affected | Immune | Some tolerance | Excellent tolerance |
| **Power Swing** | Sensitive | Very sensitive | Less sensitive | Less sensitive |
| **Typical Use** | Rare | Short lines | Long EHV/UHV | Digital relays, complex lines |

### Application Scenarios
-   **Radial Feeder (both ends):** Use directional relays to ensure selectivity.
-   **Parallel Feeders:** Remote end relays must be directional.
-   **Ring Main:** Most relays directional.
-   **Short Line with High Fault R:** Consider reactance or quadrilateral.
-   **Long EHV Line:** Mho or quadrilateral.
-   **Close-in Fault:** Directional relay dead zone issue.

### Revision Checklist
-   [ ] Can calculate $I_1$, $I_2$, $I_0$ from phase currents using operator 'a'.
-   [ ] Can convert line impedance to secondary side for relay settings.
-   [ ] Can explain why Mho relays are inherently directional.
-   [ ] Can describe the 90° connection for directional relays (I_R with V_YB).
-   [ ] Can explain underreach due to infeed and overreach due to transients.
-   [ ] Can outline the stepped distance characteristic (Z1, Z2, Z3) and their purposes.
-   [ ] Can identify when directional relays are necessary in a network.
-   [ ] Can distinguish between reactance relay setting (X only) and impedance relay setting (|Z|).
-   [ ] Can explain the dead zone in directional relays.
-   [ ] Can connect sequence networks for different fault types (L-G: series; L-L: parallel).