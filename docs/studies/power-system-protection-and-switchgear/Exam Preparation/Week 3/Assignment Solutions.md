---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 3 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W3-Q01

Distance protection is preferred over graded time-lag overcurrent protection for HV and EHV transmission lines because

A. it operates faster.
B. it is simpler.
C. it is less expensive.
D. All of these

> [!success]- Worked solution
> **Answer: A — it operates faster.**
> 
> **Exam answer (supplied key): A — it operates faster.**
> 
> Distance protection, especially Zone 1, provides high-speed (instantaneous) operation for most of the line, which is critical for EHV system stability. Overcurrent relays require time grading, leading to slower fault clearance. While distance relays are more complex and costly, their speed and selectivity advantages are paramount for EHV lines.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is correct. Zone 1 operation is instantaneous.
> - **B:** Option (b) is incorrect. Distance relays are more complex than simple overcurrent relays.
> - **C:** Option (c) is incorrect. Distance relays require CTs, PTs, and more complex logic, making them more expensive.
> - **D:** Option (d) is incorrect as (b) and (c) are false.

Source: Type1 Assignment W3 Q1

## T1-W3-Q02

A 3-phase, 11 kV power system has the following phase currents during an unsymmetrical fault: Ia=100∠0º A, Ib=50∠-120º A, Ic=30∠120º A. The positive sequence current component is

A. 20 A
B. 60 A
C. 80 A
D. 180 A

> [!success]- Worked solution
> **Answer: B — 60 A**
> 
> **Exam answer (supplied key): B — 60 A**
> 
> The positive sequence current is calculated as I1 = (1/3)(Ia + a*Ib + a^2*Ic). Using a = 1∠120° and a^2 = 1∠240°: I1 = (1/3)(100∠0° + (1∠120°)(50∠-120°) + (1∠240°)(30∠120°)) = (1/3)(100 + 50∠0° + 30∠360°) = (1/3)(100+50+30) = 60 A.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) might be a miscalculation ignoring the operator 'a'.
> - **B:** Option (b) is the correct calculation.
> - **C:** Option (c) might be the sum of magnitudes (100+50+30)/? or a different error.
> - **D:** Option (d) is the sum of magnitudes (100+50+30).

Source: Type1 Assignment W3 Q2

## T1-W3-Q03

The purpose of backup protection is to

A. increase the speed of operation.
B. increase the reach of protection.
C. eliminate blind spots in protection.
D. provide protection in case of failure of primary protection.

> [!success]- Worked solution
> **Answer: D — provide protection in case of failure of primary protection.**
> 
> **Exam answer (supplied key): D — provide protection in case of failure of primary protection.**
> 
> Backup protection is designed to operate after a time delay if the primary protection fails to clear a fault. Its primary role is reliability, not speed. It does not inherently increase speed or reach, though Zone 2/3 of distance relays provide backup. Blind spots are addressed by proper primary protection design.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Backup protection is intentionally time-delayed.
> - **B:** Option (b) is incorrect. Reach is a characteristic of the primary relay setting.
> - **C:** Option (c) is incorrect. Blind spots are gaps in primary protection coverage.
> - **D:** Option (d) is correct. This is the fundamental definition of backup protection.

Source: Type1 Assignment W3 Q3

## T1-W3-Q04

Which zone of a distance relay is most affected by the transient overreach phenomenon?

A. Zone 1
B. Zone 2
C. Zone 3
D. None of these

> [!success]- Worked solution
> **Answer: A — Zone 1**
> 
> **Exam answer (supplied key): A — Zone 1**
> 
> Transient overreach is caused by the decaying DC component in the fault current, which is present only in the first few cycles. Zone 1 is the high-speed, instantaneous zone that operates within this timeframe. Zones 2 and 3 are time-delayed (0.3-1.5 s), so the DC component has decayed, and they are not affected.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is correct. Zone 1's instantaneous operation makes it susceptible.
> - **B:** Option (b) is incorrect. Zone 2 operates after a delay, beyond the transient period.
> - **C:** Option (c) is incorrect. Zone 3 operates after a longer delay.
> - **D:** Option (d) is incorrect as Zone 1 is affected.

Source: Type1 Assignment W3 Q4

## T1-W3-Q05

A short transmission line having an impedance of (2+j5) Ω is protected by a reactance relay. The CT ratio is 500/1 A and PT ratio is 132 kV/110 V. If the relay is adjusted to just operate for a dead short-circuit at the end of line section, then the set value of relay is

A. 2.944
B. 2.083
C. 2.517
D. 3.614

> [!success]- Worked solution
> **Answer: B — 2.083**
> 
> **Exam answer (supplied key): B — 2.083**
> 
> A reactance relay measures only the reactance (X) component. The line reactance is X_line = 5 Ω. The relay setting is the secondary-side reactance: X_relay = X_line * (CT_ratio / PT_ratio). CT_ratio = 500/1 = 500. PT_ratio = 132,000 V / 110 V = 1200. X_relay = 5 * (500 / 1200) = 5 * 0.4167 = 2.083 Ω.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) might be the magnitude of Z (sqrt(2^2+5^2)=5.385) converted incorrectly.
> - **B:** Option (b) is the correct calculation for reactance setting.
> - **C:** Option (c) might be the resistance setting (2 * 500/1200 = 0.833) or another error.
> - **D:** Option (d) might be the full impedance magnitude converted incorrectly.

Source: Type1 Assignment W3 Q5

## T1-W3-Q06

Which protective relay is commonly used for the protection of very long EHV transmission lines?

A. Overcurrent relay with extremely inverse characteristics
B. Percentage differential relay
C. Mho relay
D. Reactance relay

> [!success]- Worked solution
> **Answer: C — Mho relay**
> 
> **Exam answer (supplied key): C — Mho relay**
> 
> Mho relays are inherently directional, less affected by power swings, and can accommodate some fault resistance, making them ideal for long EHV lines. Overcurrent relays are unsuitable for primary protection of EHV lines. Differential relays require communication channels. Reactance relays are prone to power swing maloperation and are better for short lines.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Overcurrent relays are not used for primary EHV line protection.
> - **B:** Option (b) is incorrect. Differential relays require a communication channel, adding cost and complexity.
> - **C:** Option (c) is correct. Mho relays are the standard for long EHV lines.
> - **D:** Option (d) is incorrect. Reactance relays are sensitive to power swings and are used for short lines.

Source: Type1 Assignment W3 Q6

## T1-W3-Q07

Due to current infeed from the remote end of a transmission line, the distance relay located at the local end tends to

A. overreach.
B. underreach.
C. Both (a) and (b)
D. operate normally without being affected.

> [!success]- Worked solution
> **Answer: B — underreach.**
> 
> **Exam answer (supplied key): B — underreach.**
> 
> Current infeed from a remote source adds to the fault current seen by the local relay but does not flow through the line impedance between the relay and the fault. This makes the measured impedance (V/I) appear larger than the actual line impedance to the fault, causing the relay to underreach (not see the fault as close as it is).
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Overreach would mean the relay sees the fault as closer than it is.
> - **B:** Option (b) is correct. Infeed causes the relay to measure a higher impedance.
> - **C:** Option (c) is incorrect. The effect is specifically underreach.
> - **D:** Option (d) is incorrect. Infeed significantly affects the measured impedance.

Source: Type1 Assignment W3 Q7

## T1-W3-Q08

Fig. 1 shows the single line diagram of a 400 kV three-terminal transmission line system. A three-phase fault occurs on the line section near the bus C. The magnitude and direction of currents from each bus are shown in the Fig. 1. In addition, the impedance of line section connected between bus A and T-point, between bus B and T-point and between bus C and T-point is 25∠80º, 15∠85º and 12∠75º, respectively. Then, the apparent impedance seen by relay located at bus A is

![t1-w3-p2-fig1](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/Attachments/t1-w3-p2-fig1.png)

A. 44.3∠74.7º Ω
B. 44.3∠44.4º Ω
C. 54.3∠74.7º Ω
D. 54.3∠44.4º Ω

> [!success]- Worked solution
> **Answer: C — 54.3∠74.7º Ω**
> 
> **Exam answer (supplied key): C — 54.3∠74.7º Ω**
> 
> Read the actual figure: the current from A is $I_A = 2600 angle (-72 degree)$ A and the current in the T–C section is $I_("TC") = 6385 angle -76.8 degree$ A. The line impedances are $Z_("AT") = 25 angle 80 degree$ Ω and $Z_("TC") = 12 angle 75 degree$ Ω. These are impedances, not voltages. For the solid fault near C, $V_A=I_A Z_"AT"+I_"TC" Z_"TC"$, hence $Z_("app",A) = Z_("AT") + (I_("TC")/I_A) Z_("TC") = 25 angle 80 degree + 29.469 angle 70.2 degree$. Add in rectangular form: approximately $14.324 + j 52.348$ Ω, giving $54.27 angle 74.70 degree$ Ω, matching54.3∠74.7°. The relay sees the contribution of the remote infeed through the common T–C section.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) might be a miscalculation of the impedance magnitude or angle.
> - **B:** Option (b) might be an incorrect angle calculation.
> - **C:** Option (c) is the correct answer from the provided solution.
> - **D:** Option (d) might be an incorrect angle calculation.

Source: Type1 Assignment W3 Q8

## T1-W3-Q09

Overreaching of a distance relay caused by the decaying DC component can be minimized by using

A. electromechanical relay.
B. solid-state relay.
C. digital relay.
D. None of these

> [!success]- Worked solution
> **Answer: C — digital relay.**
> 
> **Exam answer (supplied key): C — digital relay.**
> 
> Digital (numerical) relays use advanced filtering algorithms (e.g., Fourier transforms) to extract the fundamental frequency component and reject the decaying DC offset. This significantly reduces transient overreach compared to older electromechanical or solid-state (analog) relays, which are more susceptible to the DC component.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Electromechanical relays are most affected by transients.
> - **B:** Option (b) is incorrect. Solid-state relays have some filtering but are less effective than digital.
> - **C:** Option (c) is correct. Digital signal processing provides superior filtering.
> - **D:** Option (d) is incorrect as digital relays are effective.

Source: Type1 Assignment W3 Q9

## T1-W3-Q10

A 132 kV transmission line has an impedance of (4 + j16) Ω. This line is protected by a reactance type distance relay with CT ratio = 1000/1 A and PT ratio = 132 kV/110 V. The zone-1 of the reactance relay covers 80% of the line length, zone-2 covers 150% of the line length. Then, the first and second zone setting of reactance relay are

A. 20.67 Ω and 10 Ω, respectively
B. 10.67 Ω and 20 Ω, respectively
C. 10 Ω and 20.67 Ω, respectively
D. 20 Ω and 10.67 Ω, respectively

> [!success]- Worked solution
> **Answer: B — 10.67 Ω and 20 Ω, respectively**
> 
> **Exam answer (supplied key): B — 10.67 Ω and 20 Ω, respectively**
> 
> The line reactance is X_line = 16 Ω. The relay setting is the secondary-side reactance: X_relay = X_line * (CT_ratio / PT_ratio). CT_ratio = 1000/1 = 1000. PT_ratio = 132,000 V / 110 V = 1200. Zone-1 (80%): X_Z1 = 0.8 * 16 * (1000 / 1200) = 12.8 * 0.8333 = 10.67 Ω. Zone-2 (150%): X_Z2 = 1.5 * 16 * (1000 / 1200) = 24 * 0.8333 = 20 Ω.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) might be the settings if the full impedance magnitude was used incorrectly.
> - **B:** Option (b) is the correct calculation for reactance settings.
> - **C:** Option (c) might be the settings if the conversion factor was inverted.
> - **D:** Option (d) might be the settings if the percentages were swapped.

Source: Type1 Assignment W3 Q10

## T2-W3-Q01

Figure 1 shows the single line diagram of a portion of a radial distribution system. The plug setting (PS) of R3 = 75% of CT secondary. The TDS of R3 = 0.1. The normal range of PS is 50–200% of 1 A in seven equal steps, whereas the TDS setting range is 0.1 to 1 in steps of 0.05. The PS of the relays R1 and R2 will be

![t1-w2-p2-fig1](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/Attachments/t1-w2-p2-fig1.png)

A. 75% and 100% of relay rating, respectively
B. 100% of relay rating for both
C. 100% and 75% of relay rating, respectively
D. 75% of relay rating for both

> [!success]- Worked solution
> **Answer: B — 100% of relay rating for both**
> 
> **Exam answer (supplied key): B — 100% of relay rating for both**
> 
> From the supplied figure, CT ratios are R1:1000/1, R2:800/1 and R3:800/1. R3 picks up at0.75×800=600 A primary. Using the ascending-pickup convention of this assignment, R2 must have a primary pickup above600 A; the next available setting is100%, giving800 A. For R1,75% gives750 A, below R2’s800 A, whereas100% gives1000 A. Therefore R1 and R2 both use100%. Pickup grading is part of this worked example; time coordination still needs a separate check.
> 
> **Why the other options fail**
> 
> - **A:** R1 at75% gives750 A, below the800 A pickup of R2.
> - **B:** Both100% give ascending primary pickups600,800,1000 A from downstream to upstream.
> - **C:** R2 at75% has the same600 A pickup as R3.
> - **D:** R2 remains at600 A, so the example’s ascending-pickup requirement is not met.

Source: Type2 Assignment W3 Q1

## T2-W3-Q02

The above Fig. 1 shows the single line diagram of a portion of a radial distribution system. The PS of R3 = 75% of CT secondary. The Time Dial Setting (TDS) of R3 = 0.1. The normal range of PS is 50–200% of 1 A in seven equal steps, whereas the TDS setting range is 0.1 to 1 in steps of 0.05. If the coordination time interval between any two relays is 0.25 s, then the TDS of relay R2 is

![t1-w2-p2-fig1](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/Attachments/t1-w2-p2-fig1.png)

A. 0.1
B. 0.15
C. 0.2
D. 0.3

> [!success]- Worked solution
> **Answer: C — 0.2**
> 
> **Exam answer (supplied key): C — 0.2**
> 
> Use the common far-end fault current5000 A shown in the figure. R3 has primary pickup600 A, so $M_3=5000/600=8.333$ and $t_3 = 0.14(0.1)/(8.333^(0.02) - 1) = 0.3232$ s. R2 uses100% on an800/1 CT, so $M_2=5000/800=6.25$. Its required time is $0.3232 + 0.25 = 0.5732$ s. Solve $"TDS"_2 = frac(0.5732(6.25^(0.02) - 1), 0.14) = 0.1529$. Available steps are0.05: choose0.20, rounding UP. Choosing0.15 would produce about0.5625 s and only0.2393 s coordination, less than0.25 s.
> 
> **Why the other options fail**
> 
> - **A:** 0.10 is too fast to provide the coordination interval.
> - **B:** 0.15 is slightly below the calculated0.1529 minimum.
> - **C:** 0.20 is the next allowed setting above the minimum.
> - **D:** 0.30 would coordinate but adds unnecessary delay; choose the smallest admissible setting.

Source: Type2 Assignment W3 Q2

## T2-W3-Q03

In case of phase fault, the maximum torque is achieved in directional relay by 1 point

A. 30° connection
B. 60° connection
C. 90° connection
D. none of the above

> [!success]- Worked solution
> **Answer: C — 90° connection**
> 
> **Exam answer (supplied key): C — 90° connection**
> 
> The 90° connection (e.g., for R-phase: I_R and V_YB) is designed to produce maximum torque for typical fault power factor angles (φ ≈ 70°-90°). The torque equation is T ∝ V*I*cos(φ - θ). With θ set to 90° via the connection, cos(φ - 90°) = sin(φ), which is high for φ near 90°. The 30° and 60° connections can produce low torque for certain fault conditions.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is a possible connection but not optimal for maximum torque during faults.
> - **B:** Option (b) is a possible connection but not optimal for maximum torque during faults.
> - **C:** Option (c) is correct. The 90° connection ensures high torque for typical fault angles.
> - **D:** Option (d) is incorrect as the 90° connection is standard.

Source: Type2 Assignment W3 Q3

## T2-W3-Q04

Directional relay is required at a location/bus when 1 point

A. load is very high
B. load is very low
C. there are chances of reversal of fault current
D. none of the above

> [!success]- Worked solution
> **Answer: C — there are chances of reversal of fault current**
> 
> **Exam answer (supplied key): C — there are chances of reversal of fault current**
> 
> Directional relays are essential where fault current can flow in more than one direction, such as in parallel feeders, ring mains, or multi-source networks. They ensure selectivity by only operating for faults in the 'forward' direction. High or low load does not inherently require directionality.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. High load does not imply fault current reversal.
> - **B:** Option (b) is incorrect. Low load does not imply fault current reversal.
> - **C:** Option (c) is correct. This is the primary reason for using directional relays.
> - **D:** Option (d) is incorrect as (c) is correct.

Source: Type2 Assignment W3 Q4

## T2-W3-Q05

Directional relay does not operate properly during 1 point

A. remote end fault
B. middle end fault
C. close-in fault
D. none of these

> [!success]- Worked solution
> **Answer: C — close-in fault**
> 
> **Exam answer (supplied key): C — close-in fault**
> 
> A 'close-in' fault occurs very near the relay location. The voltage at the relay point drops to a very low value (near zero). Since the directional relay requires a polarizing voltage to determine direction, this low voltage can prevent proper operation, creating a 'dead zone'.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Remote faults have sufficient voltage.
> - **B:** Option (b) is incorrect. Middle faults have sufficient voltage.
> - **C:** Option (c) is correct. Close-in faults cause low polarizing voltage, leading to a dead zone.
> - **D:** Option (d) is incorrect as close-in faults are a known limitation.

Source: Type2 Assignment W3 Q5

## T2-W3-Q06

Distance relay is set based on the 1 point

A. positive sequence impedance of line
B. negative sequence impedance of line
C. zero sequence impedance of line
D. none of these

> [!success]- Worked solution
> **Answer: A — positive sequence impedance of line**
> 
> **Exam answer (supplied key): A — positive sequence impedance of line**
> 
> Phase distance relays, which protect against phase faults (L-L, L-L-L), are set based on the positive sequence impedance (Z1) of the line. Ground distance relays are set based on the zero sequence impedance (Z0). The question likely refers to phase distance relays.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is correct for phase distance relays.
> - **B:** Option (b) is incorrect. Negative sequence impedance is not used for setting.
> - **C:** Option (c) is correct for ground distance relays, but the question likely implies phase relays.
> - **D:** Option (d) is incorrect as (a) is correct for phase relays.

Source: Type2 Assignment W3 Q6

## T2-W3-Q07

The zone of distance relay that is affected by the transient overreach phenomenon is 2 points

A. first zone
B. second zone
C. third zone
D. none of these

> [!success]- Worked solution
> **Answer: A — first zone**
> 
> **Exam answer (supplied key): A — first zone**
> 
> Transient overreach is caused by the decaying DC component, which is present only in the first few cycles after a fault. The first zone (Zone 1) is the instantaneous, high-speed zone that operates within this timeframe. Zones 2 and 3 are time-delayed and thus not affected.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is correct. Zone 1's instantaneous operation makes it susceptible.
> - **B:** Option (b) is incorrect. Zone 2 operates after a delay.
> - **C:** Option (c) is incorrect. Zone 3 operates after a longer delay.
> - **D:** Option (d) is incorrect as Zone 1 is affected.

Source: Type2 Assignment W3 Q7

## T2-W3-Q08

Which zone of distance relay is affected by extreme loading conditions (also known as load encroachment phenomena) 2 points

A. first zone
B. second zone
C. third zone
D. none of these

> [!success]- Worked solution
> **Answer: C — third zone**
> 
> **Exam answer (supplied key): C — third zone**
> 
> Load encroachment occurs when the load impedance, which appears as a high impedance, moves into the operating characteristic of the distance relay under heavy loading. The third zone (Zone 3) has the largest reach and is most likely to encroach upon the load impedance, causing a maloperation. Zone 1 and 2 settings are typically well within the line impedance.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Zone 1 is set to 80% of the line, far from load impedance.
> - **B:** Option (b) is incorrect. Zone 2 is set to ~120-150% of the line, still less likely than Zone 3.
> - **C:** Option (c) is correct. Zone 3 has the longest reach and is most susceptible to load encroachment.
> - **D:** Option (d) is incorrect as Zone 3 is affected.

Source: Type2 Assignment W3 Q8

## T2-W3-Q09

Which of the following relay respond best in case of fault with significant fault resistance 0 points

A. impedance relay
B. reactance relay
C. mho relay
D. quadrilateral relay

> [!success]- Worked solution
> **Answer: D — quadrilateral relay**
> 
> **Exam answer (supplied key): D — quadrilateral relay**
> 
> A quadrilateral characteristic is specifically designed to accommodate fault resistance. It can be shaped to extend along the resistance axis without significantly increasing the reach along the reactance axis. Mho relays can handle some fault resistance but are limited by their circular shape. Reactance relays are immune to fault resistance but have other drawbacks. Impedance relays are affected by fault resistance.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Impedance relays are affected by fault resistance.
> - **B:** Option (b) is incorrect. Reactance relays measure only X, so fault resistance doesn't affect their operation, but they are not the 'best' for significant resistance due to other issues like power swing sensitivity.
> - **C:** Option (c) is partially correct but less effective than quadrilateral for significant resistance.
> - **D:** Option (d) is correct. Quadrilateral characteristics offer the best accommodation for fault resistance.

Source: Type2 Assignment W3 Q9

## T2-W3-Q10

Which of the following relay do not require separate directional element? 1 point

A. impedance relay
B. reactance relay
C. mho relay
D. all of the above

> [!success]- Worked solution
> **Answer: C — mho relay**
> 
> **Exam answer (supplied key): C — mho relay**
> 
> The Mho relay characteristic is a circle that passes through the origin on the R-X plane. This shape inherently provides directionality; it only operates for impedances in the first quadrant (forward direction). Impedance and reactance relays have characteristics that extend into the third quadrant (reverse direction) and thus require a separate directional unit to prevent operation for reverse faults.
> 
> **Why the other options fail**
> 
> - **A:** Option (a) is incorrect. Impedance relays are not inherently directional.
> - **B:** Option (b) is incorrect. Reactance relays are not inherently directional.
> - **C:** Option (c) is correct. Mho relays are inherently directional.
> - **D:** Option (d) is incorrect as only Mho relays are inherently directional.

Source: Type2 Assignment W3 Q10

