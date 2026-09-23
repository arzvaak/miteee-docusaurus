---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 7 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T2-W7-Q01

The advantage of double bus arrangement over single bus arrangement is

A. Low cost
B. Better reliability and flexibility
C. That of complete shutdown when fault occurs on one bus
D. That it requires a simple protection scheme

> [!success]- Worked solution
> **Answer: B — Better reliability and flexibility**
> 
> **Exam answer (supplied key): B — Better reliability and flexibility**
> 
> A double bus arrangement provides two separate buses. This allows circuits to be transferred between buses for maintenance without interrupting supply, and a fault on one bus can be isolated while the other remains in service. This directly enhances reliability and operational flexibility. Option A is incorrect; double bus is more expensive. Option C describes a disadvantage of a single bus. Option D is incorrect; protection for double bus is more complex.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. Double bus requires more equipment (breakers, isolators) and is more costly.
> - **B:** Correct. Two buses allow maintenance and fault isolation without total shutdown.
> - **C:** Incorrect. This is a disadvantage of a single bus arrangement.
> - **D:** Incorrect. Protection for double bus is more complex, often requiring bus differential schemes.

Source: Type2 Assignment, Week 7, Q1; Lecture 31 (pp. 613-614) discusses busbar arrangement factors including reliability and flexibility.

## T2-W7-Q02

Main and transfer bus bar arrangement is used when

A. small interruptions to the load is permitted
B. large interruptions to the load is permitted
C. uninterrupted power supply is required to the load
D. None of the above

> [!success]- Worked solution
> **Answer: C — uninterrupted power supply is required to the load**
> 
> **Exam answer (supplied key): C — uninterrupted power supply is required to the load**
> 
> A main and transfer bus arrangement uses a transfer bus to bypass the main bus for maintenance. This allows a circuit breaker to be taken out of service without interrupting the load, as the circuit can be temporarily connected via the transfer bus. Therefore, it is used when uninterrupted supply is required. Options A and B are incorrect as the arrangement is designed to avoid interruptions.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. The arrangement is specifically designed to avoid interruptions.
> - **B:** Incorrect. The arrangement is specifically designed to avoid interruptions.
> - **C:** Correct. The transfer bus allows breaker maintenance without load interruption.
> - **D:** Incorrect. Option C is the correct application.

Source: Type2 Assignment, Week 7, Q2; Lecture 31 (pp. 613-614) lists busbar arrangement factors including 'Easy maintenance with interrupting power supply'.

## T2-W7-Q03

The cause of surge voltage in power system is

A. Lightning
B. Switching operations
C. Resonance
D. Any of the above

> [!success]- Worked solution
> **Answer: D — Any of the above**
> 
> **Exam answer (supplied key): D — Any of the above**
> 
> Surge voltages (transient overvoltages) can be caused by multiple sources. Lightning strokes inject high-energy traveling waves. Switching operations (energizing lines, capacitor banks) create transients due to trapped charges and circuit parameter interactions. Resonance between system inductance and capacitance can also amplify voltages. Therefore, all listed options are valid causes.
> 
> **Why the other options fail**
> 
> - **A:** Correct, but not the only cause.
> - **B:** Correct, but not the only cause.
> - **C:** Correct, but not the only cause.
> - **D:** Correct. Lightning, switching, and resonance are all primary sources of power system surges.

Source: Type2 Assignment, Week 7, Q3; Lecture 32 (pp. 649-650) lists sources of transients including switching operations and lightning strokes.

## T2-W7-Q04

In an isolated neutral system, when a single line to ground fault occurs

A. persistent arcing grounds will be developed
B. voltage in the healthy phases rise to full line value causing insulation breakdown
C. the capacitive current in the faulty phase rises to 3 times its normal value
D. all of the above

> [!warning] Source caution
> Exam grading follows supplied key D. The categorical wording describes course-listed hazards; arcing and insulation breakdown are possible rather than inevitable in every fault.

> [!success]- Worked solution
> **Answer: D — all of the above**
> 
> **Exam answer (supplied key): D — all of the above**
> 
> The supplied answer is D. For the ideal isolated-neutral system, a solid single-line earth fault shifts the neutral so healthy phase-to-earth voltages reach line voltage, and the fault current is three times the original per-phase capacitive charging current. Intermittent arcing can produce dangerous overvoltages. However, arcing and insulation breakdown are possible consequences, not inevitable for every fault. Learn the voltage and current relations; read the categorical wording in A and B as the course’s description of hazards.
> 
> **Why the other options fail**
> 
> - **A:** Correct, but not the only consequence.
> - **B:** Correct, but not the only consequence.
> - **C:** Correct, but not the only consequence.
> - **D:** Correct. All listed phenomena occur in an ungrounded system during a SLG fault.

Source: Type2 Assignment, Week 7, Q4; Lecture 32 (pp. 667-669) details the effects of an ungrounded neutral during a SLG fault.

## T2-W7-Q05

Reduction in frequency is slower for a given overload for

A. a small value of inertia constant
B. a moderate value of inertia constant
C. both (a) and (b)
D. a large value of inertia constant

> [!success]- Worked solution
> **Answer: D — a large value of inertia constant**
> 
> **Exam answer (supplied key): D — a large value of inertia constant**
> 
> On a common power base, the initial swing relation is $frac(d f, d t) = f_0 Delta P_("pu")/(2H)$, with $Delta P = P_m - P_e$. An overload gives negative mismatch. For the same mismatch, base frequency and power base, increasing inertia constant H reduces the magnitude of the frequency decline. Therefore D. Omitting $f_0$ is only valid when expressing frequency change in per unit.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. A small $H$ leads to a faster frequency decline.
> - **B:** Incorrect. A moderate $H$ leads to a faster decline than a large $H$.
> - **C:** Incorrect. Only a large $H$ slows the decline.
> - **D:** Correct. A larger inertia constant $H$ provides more stored kinetic energy, slowing the rate of frequency decline.

Source: Type2 Assignment, Week 7, Q5; Lecture 33 (pp. 714-715) provides the formula $frac(d f, d t) = -Delta P/(2H)$ and states the relationship.

## T2-W7-Q06

Which technique is capable of detecting islanding in case of a perfect match between the generation and load demand in an islanded system?

A. Active detection technique
B. Passive detection technique
C. Hybrid detection technique
D. All of the above

> [!warning] Source caution
> Exam grading follows supplied key A. A hybrid scheme may include an active stage, so the options are not mutually exclusive outside the course framing.

> [!success]- Worked solution
> **Answer: A — Active detection technique**
> 
> **Exam answer (supplied key): A — Active detection technique**
> 
> The intended course answer is A: active detection deliberately perturbs the system, helping expose an island even when steady generation and load match. Passive voltage/frequency thresholds can have a non-detection zone under close balance. A hybrid scheme may incorporate an active stage and can also detect such an island, so the supplied options do not uniquely exclude C. Preserve A as the supplied key, but treat the item as ambiguous rather than learning that all hybrid schemes fail.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Active techniques perturb the system to detect islanding even with perfect generation-load match.
> - **B:** Incorrect. Passive techniques have a Non-Detection Zone (NDZ) when generation and load are closely matched.
> - **C:** Incorrect. While hybrid techniques have a small NDZ, the active component is what enables detection in the perfect match case.
> - **D:** Incorrect. Passive techniques fail in the perfect match scenario.

Source: Type2 Assignment, Week 7, Q6; Lecture 33 (pp. 725-727) explains passive and active islanding detection, noting active techniques have a small NDZ.

## T2-W7-Q07

A 220 kV, three-phase, 50 Hz, 60 km long overhead transmission line has a capacitance of 1.2 mF/km. Determine the inductive reactance and kVA rating of the arc suppression coil suitable for this system to eliminate arcing ground effect.

A. 759.32 Ω and 17.19 MVA
B. 882.78 Ω and 18.28 MVA
C. 667.53 Ω and 16.24 MVA
D. None of these

> [!warning] Source caution
> The printed capacitance unit/per-km data are inconsistent with the answer scale. No assumed unit repair is used.

> [!success]- Worked solution
> **Answer: D — None of these**
> 
> **Exam answer (supplied key): D — None of these**
> 
> For exam grading, use the supplied key D: None of these. Keep the printed unit rather than silently changing it. With 1.2 mF/km over 60 km, total per-phase $C=1.2 times 10^(-3) times 60 = 0.072$ F and $X_L = 1 / (3 omega C) = 0.0147366 Omega$. None of A–C matches. The unrealistic scale indicates a source-unit problem. Even treating 1.2 mF as the total gives about 0.884 Ω, not 884 Ω; that larger value would require microfarads. This observation supports the supplied D answer without inventing a unit repair.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. Does not match either interpretation.
> - **B:** Correct if capacitance is interpreted as total for the line (1.2 mF), not per km.
> - **C:** Incorrect. Does not match either interpretation.
> - **D:** Correct. The literal calculation using 1.2 mF/km yields X_L ≈ 0.0148 Ω, not listed.

Source: Type2 Assignment, Week 7, Q7; Lecture 32 (pp. 680-681) solves a similar problem but treats 1.2 mF as total capacitance.

## T2-W7-Q08

The first pole to clear factor in case of a phase-to-ground fault in an open neutral system and solidly grounded system are equal to

A. 1.5 and 1, respectively
B. 1 and 1.5, respectively
C. 3 and 1, respectively
D. 1.5 and 3, respectively

> [!warning] Source caution
> Fault-type wording does not match the usual simplified first-pole derivation. Exam grading still follows supplied key A.

> [!success]- Worked solution
> **Answer: A — 1.5 and 1, respectively**
> 
> **Exam answer (supplied key): A — 1.5 and 1, respectively**
> 
> The supplied course key is A: 1.5 for an open neutral and 1 for a solidly grounded system in the simplified first-pole recovery-voltage treatment. There is a wording problem: the familiar 1.5 factor is derived for the first pole clearing a three-phase fault in the ideal unearthed system, whereas the item says phase-to-ground fault. Do not generalize that derivation to every single-line earth fault. Actual recovery-voltage factors also depend on grounding and system sequence impedances.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Open neutral: 1.5; Solidly grounded: 1.
> - **B:** Incorrect. The values are reversed.
> - **C:** Incorrect. 3 is not a typical FPCF value for this scenario.
> - **D:** Incorrect. 3 is not a typical FPCF value for this scenario.

Source: Type2 Assignment, Week 7, Q8; Lecture content on grounding practices (pp. 666-672) provides the foundation for understanding neutral shift and voltage stress.

## T2-W7-Q09

The contact resistance of circuit breaker in closed position is of the order of

A. 20 μΩ ±10
B. 20 mΩ ±10
C. 20 Ω ±10
D. 200 Ω ±10

> [!success]- Worked solution
> **Answer: A — 20 μΩ ±10**
> 
> **Exam answer (supplied key): A — 20 μΩ ±10**
> 
> Circuit breaker contacts must have very low resistance when closed to minimize I²R losses and heating during normal current flow. The resistance is typically in the micro-ohm (μΩ) range. 20 μΩ is a realistic order of magnitude. Milliohms (mΩ) would be too high for a high-current device, and ohms (Ω) are far too high.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Micro-ohms are the typical order for closed CB contacts.
> - **B:** Incorrect. Milliohms would cause excessive power loss at rated current.
> - **C:** Incorrect. Ohms are far too high for a closed switch.
> - **D:** Incorrect. 200 Ω is orders of magnitude too high.

Source: Type2 Assignment, Week 7, Q9; General knowledge of circuit breaker design principles.

## T2-W7-Q10

A 50 Hz, 13.8 kV, three-phase generator with grounded neutral has an inductance of 15 mH/phase and is connected to a busbar through a circuit breaker (CB). The capacitance to earth between the generator and the CB is 0.05 μF/phase. The average RRRV is

A. 250.22 × 10³ kV/s
B. 262.09 kV/s
C. 262.09 × 10³ kV/s
D. 226.09 × 10³ kV/s

> [!warning] Source caution
> Option C agrees within source rounding.

> [!success]- Worked solution
> **Answer: C — 262.09 × 10³ kV/s**
> 
> **Exam answer (supplied key): C — 262.09 × 10³ kV/s**
> 
> For the ideal grounded-neutral LC recovery transient, $E_m=(13.8/sqrt(3))sqrt(2)=11.2677$ kV. The first peak is $2E_m = 22.5353$ kV at $t_p = pi sqrt("LC") = pi sqrt(15 times 10^(-3) times 0.05 times 10^(-6)) = 86.036$ μs. Average RRRV is $2E_m/t_p = 261.93 times 10^3$ kV/s, approximately the listed $262.09 times 10^3$ kV/s (C). This is average rise to the first peak, not maximum instantaneous slope. The small difference follows rounding.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. Value and/or units are wrong.
> - **B:** Incorrect. Units are wrong; should be ×10³ kV/s.
> - **C:** Correct. Calculation yields ~262.09 × 10³ kV/s.
> - **D:** Incorrect. Value is wrong.

Source: Type2 Assignment, Week 7, Q10; Lecture 35 (pp. 762-765) solves this exact example.

