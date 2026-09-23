---
title: "Week 3"
math_syntax: typst
---

# 2026 Type 1 — Week 3

[2026 Type 1 index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-2026-type-1-assignments-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

**Supplied source:** [Assignment_Week-3.pdf](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/2026%20Type%201%20Assignments/Supplied%20PDFs/Assignment_Week-3.pdf)

These are the supplied 2026 Type 1 questions in original order. The supplied answer key is authoritative for exam grading. Open each worked solution only after attempting the question.

## T1-W3-Q01

Distance protection is preferred over graded time-lag overcurrent protection for HV and EHV transmission lines because

A. it operates faster.
B. it is simpler.
C. it is less expensive.
D. All of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — it operates faster.**
>
> **Exam answer (supplied key): A — it operates faster.**
>
> Distance protection, especially Zone 1, provides high-speed (instantaneous) operation for most of the line, which is critical for EHV system stability. Overcurrent relays require time grading, leading to slower fault clearance. While distance relays are more complex and costly, their speed and selectivity advantages are paramount for EHV lines.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 60 A**
>
> **Exam answer (supplied key): B — 60 A**
>
> The positive sequence current is calculated as I1 = (1/3)(Ia + a*Ib + a^2*Ic). Using a = 1∠120° and a^2 = 1∠240°: I1 = (1/3)(100∠0° + (1∠120°)(50∠-120°) + (1∠240°)(30∠120°)) = (1/3)(100 + 50∠0° + 30∠360°) = (1/3)(100+50+30) = 60 A.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — provide protection in case of failure of primary protection.**
>
> **Exam answer (supplied key): D — provide protection in case of failure of primary protection.**
>
> Backup protection is designed to operate after a time delay if the primary protection fails to clear a fault. Its primary role is reliability, not speed. It does not inherently increase speed or reach, though Zone 2/3 of distance relays provide backup. Blind spots are addressed by proper primary protection design.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — Zone 1**
>
> **Exam answer (supplied key): A — Zone 1**
>
> Transient overreach is caused by the decaying DC component in the fault current, which is present only in the first few cycles. Zone 1 is the high-speed, instantaneous zone that operates within this timeframe. Zones 2 and 3 are time-delayed (0.3-1.5 s), so the DC component has decayed, and they are not affected.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 2.083**
>
> **Exam answer (supplied key): B — 2.083**
>
> A reactance relay measures only the reactance (X) component. The line reactance is X_line = 5 Ω. The relay setting is the secondary-side reactance: X_relay = X_line * (CT_ratio / PT_ratio). CT_ratio = 500/1 = 500. PT_ratio = 132,000 V / 110 V = 1200. X_relay = 5 * (500 / 1200) = 5 * 0.4167 = 2.083 Ω.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — Mho relay**
>
> **Exam answer (supplied key): C — Mho relay**
>
> Mho relays are inherently directional, less affected by power swings, and can accommodate some fault resistance, making them ideal for long EHV lines. Overcurrent relays are unsuitable for primary protection of EHV lines. Differential relays require communication channels. Reactance relays are prone to power swing maloperation and are better for short lines.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — underreach.**
>
> **Exam answer (supplied key): B — underreach.**
>
> Current infeed from a remote source adds to the fault current seen by the local relay but does not flow through the line impedance between the relay and the fault. This makes the measured impedance (V/I) appear larger than the actual line impedance to the fault, causing the relay to underreach (not see the fault as close as it is).
>
> **Why each option is right or wrong**
>
> - **A:** Option (a) is incorrect. Overreach would mean the relay sees the fault as closer than it is.
> - **B:** Option (b) is correct. Infeed causes the relay to measure a higher impedance.
> - **C:** Option (c) is incorrect. The effect is specifically underreach.
> - **D:** Option (d) is incorrect. Infeed significantly affects the measured impedance.

Source: Type1 Assignment W3 Q7

## T1-W3-Q08

Fig. 1 shows the single line diagram of a 400 kV three-terminal transmission line system. A three-phase fault occurs on the line section near the bus C. The magnitude and direction of currents from each bus are shown in the Fig. 1. In addition, the impedance of line section connected between bus A and T-point, between bus B and T-point and between bus C and T-point is 25∠80º, 15∠85º and 12∠75º, respectively. Then, the apparent impedance seen by relay located at bus A is

A. 44.3∠74.7º Ω
B. 44.3∠44.4º Ω
C. 54.3∠74.7º Ω
D. 54.3∠44.4º Ω

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — 54.3∠74.7º Ω**
>
> **Exam answer (supplied key): C — 54.3∠74.7º Ω**
>
> Read the actual figure: the current from A is $I_A = 2600 angle (-72 degree)$ A and the current in the T–C section is $I_("TC") = 6385 angle -76.8 degree$ A. The line impedances are $Z_("AT") = 25 angle 80 degree$ Ω and $Z_("TC") = 12 angle 75 degree$ Ω. These are impedances, not voltages. For the solid fault near C, $V_A=I_A Z_"AT"+I_"TC" Z_"TC"$, hence $Z_("app",A) = Z_("AT") + (I_("TC")/I_A) Z_("TC") = 25 angle 80 degree + 29.469 angle 70.2 degree$. Add in rectangular form: approximately $14.324 + j 52.348$ Ω, giving $54.27 angle 74.70 degree$ Ω, matching54.3∠74.7°. The relay sees the contribution of the remote infeed through the common T–C section.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — digital relay.**
>
> **Exam answer (supplied key): C — digital relay.**
>
> Digital (numerical) relays use advanced filtering algorithms (e.g., Fourier transforms) to extract the fundamental frequency component and reject the decaying DC offset. This significantly reduces transient overreach compared to older electromechanical or solid-state (analog) relays, which are more susceptible to the DC component.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 10.67 Ω and 20 Ω, respectively**
>
> **Exam answer (supplied key): B — 10.67 Ω and 20 Ω, respectively**
>
> The line reactance is X_line = 16 Ω. The relay setting is the secondary-side reactance: X_relay = X_line * (CT_ratio / PT_ratio). CT_ratio = 1000/1 = 1000. PT_ratio = 132,000 V / 110 V = 1200. Zone-1 (80%): X_Z1 = 0.8 * 16 * (1000 / 1200) = 12.8 * 0.8333 = 10.67 Ω. Zone-2 (150%): X_Z2 = 1.5 * 16 * (1000 / 1200) = 24 * 0.8333 = 20 Ω.
>
> **Why each option is right or wrong**
>
> - **A:** Option (a) might be the settings if the full impedance magnitude was used incorrectly.
> - **B:** Option (b) is the correct calculation for reactance settings.
> - **C:** Option (c) might be the settings if the conversion factor was inverted.
> - **D:** Option (d) might be the settings if the percentages were swapped.

Source: Type1 Assignment W3 Q10
