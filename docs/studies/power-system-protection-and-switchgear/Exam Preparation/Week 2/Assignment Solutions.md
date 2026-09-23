---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 2 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W2-Q01

The main drawback of a definite time delay relay is that

A. it takes a long time to clear close-in faults.
B. it is unable to clear far-end faults.
C. both (a) and (b).
D. None of these

> [!success]- Worked solution
> **Answer: A — it takes a long time to clear close-in faults.**
> 
> **Exam answer (supplied key): A — it takes a long time to clear close-in faults.**
> 
> A definite time relay operates after a fixed time delay regardless of fault current magnitude. For a close-in fault (high current, severe), this fixed delay is unnecessarily long compared to an inverse-time relay which would operate much faster. It can clear far-end faults (lower current), but the delay is the same, which is inefficient. Thus, the primary drawback is the delayed clearing of severe, close-in faults.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The fixed time delay is inefficient for severe close-in faults.
> - **B:** Incorrect. It can clear far-end faults, but the delay is the same as for close-in faults.
> - **C:** Incorrect. Only (a) is a valid drawback.
> - **D:** Incorrect. (a) is a valid drawback.

Source: Assignment 2, Week 2, Question 1; Lecture 06

## T1-W2-Q02

The limitations of electromechanical relays include

A. presence of moving parts leading to friction issues.
B. low torque production.
C. high burden and power consumption for auxiliary mechanisms.
D. All of these

> [!success]- Worked solution
> **Answer: D — All of these**
> 
> **Exam answer (supplied key): D — All of these**
> 
> Electromechanical relays have inherent limitations due to their physical construction. Moving parts (armatures, discs) are subject to friction and wear, affecting accuracy and requiring maintenance. They produce relatively low torque, limiting sensitivity. Their coils and auxiliary mechanisms (like timers) draw significant power (high burden) from the CT circuit. All listed options are valid limitations.
> 
> **Why the other options fail**
> 
> - **A:** Correct, but not the only limitation.
> - **B:** Correct, but not the only limitation.
> - **C:** Correct, but not the only limitation.
> - **D:** Correct. All options (a), (b), and (c) are recognized limitations.

Source: Assignment 2, Week 2, Question 2; Lecture 06

## T1-W2-Q03

A 60 MVA, 33 kV/66 kV, star/delta power transformer is to be protected by differential protection. The continuous current carrying capacity to restraining coils of the differential relay should not exceed 5 A. CT ratio is 3000/5 on the 33 kV side. What would be the current fed into the pilot wires of the CT secondary in the 33 kV side?

A. 2.13 A
B. 3.03 A
C. 4.23 A
D. 4.85 A

> [!success]- Worked solution
> **Answer: B — 3.03 A**
> 
> **Exam answer (supplied key): B — 3.03 A**
> 
> Step 1: Calculate full-load current on 33 kV side: $I_("FL") = frac(60 times 10^6, sqrt(3) times 33 times 10^3) = 1049.7$ A. Step 2: Calculate CT secondary current: $I_("sec") = frac(1049.7, 3000/5) = 1.75$ A. Step 3: The transformer is star/delta. For differential protection, CTs on the star side (33 kV) are connected in delta to compensate phase shift. The current in the pilot wires (delta-connected CT secondary) is $sqrt(3) times I_("sec") = sqrt(3) times 1.75 = 3.03$ A.
> 
> **Why the other options fail**
> 
> - **A:** This would be the current if CTs were star-connected, but they are delta-connected on the star side.
> - **B:** Correct. Accounts for the delta connection of CTs on the star side of the transformer.
> - **C:** This might result from an incorrect calculation of the full-load current or CT ratio.
> - **D:** This might result from using the wrong voltage in the full-load current calculation.

Source: Assignment 2, Week 2, Question 3; Lecture 26

## T1-W2-Q04

In continuation of question number 3, what could be the possible CT ratio on 66 kV side?

A. 200/5
B. 500/5
C. 1000/5
D. 1500/5

> [!success]- Worked solution
> **Answer: C — 1000/5**
> 
> **Exam answer (supplied key): C — 1000/5**
> 
> From Q3, the pilot wire current is 3.03 A. For the 66 kV side (delta side of transformer), CTs are connected in star, so the pilot wire current equals the CT secondary current. Step 1: Calculate full-load current on 66 kV side: $I_("FL") = frac(60 times 10^6, sqrt(3) times 66 times 10^3) = 524.85$ A. Step 2: Required CT ratio primary current = $frac(I_("FL"), I_("pilot")) = frac(524.85, 3.03) = 173.22$. Step 3: Choose the nearest standard CT ratio primary rating greater than 173.22. The options are 200, 500, 1000, 1500. 200/5 gives a secondary current of $frac(524.85, 200) times 5 = 13.12$ A, which exceeds the 5 A limit. 500/5 gives $frac(524.85, 500) times 5 = 5.25$ A, still slightly over. 1000/5 gives $frac(524.85, 1000) times 5 = 2.62$ A, which is within the 5 A limit and is a standard ratio. 1500/5 is also valid but 1000/5 is the closest suitable standard ratio.
> 
> **Why the other options fail**
> 
> - **A:** This ratio would give a secondary current of 13.12 A, exceeding the 5 A limit.
> - **B:** This ratio would give a secondary current of 5.25 A, slightly exceeding the 5 A limit.
> - **C:** Correct. This standard ratio gives a secondary current of 2.62 A, within the 5 A limit.
> - **D:** This ratio would give a secondary current of 1.75 A, which is valid but not the closest standard ratio above the calculated minimum.

Source: Assignment 2, Week 2, Question 4; Lecture 26

## T1-W2-Q05

Which is the closest relay characteristic to fuse/MCCB?

A. Normal inverse
B. Very inverse
C. Extremely inverse
D. All of these

> [!success]- Worked solution
> **Answer: C — Extremely inverse**
> 
> **Exam answer (supplied key): C — Extremely inverse**
> 
> Fuses and Molded Case Circuit Breakers (MCCBs) have a very steep time-current characteristic, where operating time decreases rapidly with increasing current. Among overcurrent relay characteristics, the Extremely Inverse (EI) characteristic has the steepest slope (time proportional to $1 / I^2$), making it the closest match for coordination purposes. This allows for better discrimination and lower time dial settings.
> 
> **Why the other options fail**
> 
> - **A:** Normal Inverse has a much flatter characteristic than a fuse.
> - **B:** Very Inverse is steeper than Normal Inverse but not as steep as Extremely Inverse.
> - **C:** Correct. The Extremely Inverse characteristic closely matches the steep curve of fuses/MCCBs.
> - **D:** Incorrect. Only one characteristic is the closest match.

Source: Assignment 2, Week 2, Question 5; Lecture 09

## T1-W2-Q06

In an electromagnetic type overcurrent relay having an inverse definite minimum time (IDMT) characteristic, the minimum-time feature is achieved by

A. saturation of the magnetic circuit.
B. proper mechanical design.
C. an appropriate time-delay element.
D. electromagnetic damping.

> [!success]- Worked solution
> **Answer: A — saturation of the magnetic circuit.**
> 
> **Exam answer (supplied key): A — saturation of the magnetic circuit.**
> 
> The IDMT characteristic combines inverse time operation at lower currents with a definite minimum time at very high currents. In electromechanical relays, this definite minimum time is achieved because at very high fault currents, the magnetic circuit of the relay saturates. This saturation limits the torque produced, preventing the operating time from decreasing further and causing it to level off at a minimum value.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Magnetic saturation limits torque at high currents, creating the definite minimum time.
> - **B:** Mechanical design affects the overall characteristic but not specifically the minimum-time feature.
> - **C:** A time-delay element would create a definite time characteristic, not an IDMT characteristic.
> - **D:** Electromagnetic damping affects the relay's response but is not the primary mechanism for the minimum-time feature.

Source: Assignment 2, Week 2, Question 6; Lecture 06

## T1-W2-Q07

Fig. 1 shows the single line diagram of a portion of a radial distribution system. The plug setting (PS) of R3 = 75% of CT secondary. The TDS of R3 = 0.1. The normal range of PS is 50-200% of 1 A in steps of 25%, whereas the TDS setting range is 0.1 to 1 s in steps of 0.05. What would be the PSs of the relays R1 and R2?

![t1-w2-p2-fig1](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/Attachments/t1-w2-p2-fig1.png)

A. 75% and 100% of relay rating, respectively.
B. 100% of relay rating for both.
C. 100% and 75% of relay rating, respectively.
D. 75% of relay rating for both

> [!success]- Worked solution
> **Answer: B — 100% of relay rating for both.**
> 
> **Exam answer (supplied key): B — 100% of relay rating for both.**
> 
> Coordination requires upstream relays to have higher pickup settings. R3 PS=75%, CT=800/1. Pickup primary = 0.75*800=600A. For R2 (CT=800/1), if PS=75%, pickup=600A, same as R3 - not allowed. Next step is 100%, pickup=800A > 600A. For R1 (CT=1000/1), if PS=75%, pickup=750A < 800A (R2's pickup) - not allowed. Next step is 100%, pickup=1000A > 800A. Thus, both R1 and R2 must be set at 100%.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. R2 at 75% would have the same pickup as R3, violating coordination.
> - **B:** Correct. Both R1 and R2 need 100% to have pickups higher than the downstream relay.
> - **C:** Incorrect. R1 at 100% and R2 at 75% would violate coordination between R1 and R2.
> - **D:** Incorrect. Both at 75% would violate coordination with R3 and between R1 and R2.

Source: Assignment 2, Week 2, Question 7; Lecture 10

## T1-W2-Q08

In continuation of question number 7, assuming the coordination time interval between two successive relays as 0.3 s, what is the Time Dial Setting (TDS) of the relay R2?

![t1-w2-p2-fig1](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/Attachments/t1-w2-p2-fig1.png)

A. 0.10
B. 0.15
C. 0.20
D. 0.25

> [!success]- Worked solution
> **Answer: C — 0.20**
> 
> **Exam answer (supplied key): C — 0.20**
> 
> Step 1: For R3, fault current=5000A, CT=800/1, PS=75%. MP(R3) = 5000/(0.75*800) = 8.33. Step 2: Calculate T_op(R3) using standard IDMT: T_op(R3) = (0.14/(8.33^0.02 - 1)) * 0.1 = 0.323 s. Step 3: Required T_op(R2) = T_op(R3) + CTI = 0.323 + 0.3 = 0.623 s. Step 4: For R2, same fault current, CT=800/1, PS=100% (from Q7). MP(R2) = 5000/(1.0*800) = 6.25. Step 5: Solve for TDS(R2): 0.623 = (0.14/(6.25^0.02 - 1)) * TDS(R2) => TDS(R2) = 0.623 * (6.25^0.02 - 1)/0.14 = 0.166. Step 6: Nearest higher setting in 0.05 steps is 0.20.
> 
> **Why the other options fail**
> 
> - **A:** This is the TDS of R3, not R2.
> - **B:** This is lower than the calculated 0.166, would not provide sufficient coordination margin.
> - **C:** Correct. This is the nearest higher standard setting to the calculated 0.166.
> - **D:** This is higher than necessary, would increase coordination time unnecessarily.

Source: Assignment 2, Week 2, Question 8; Lecture 10

## T1-W2-Q09

A thermal relay generally has

A. delayed trip action
B. instantaneous trip action
C. both delayed and instantaneous trip action
D. None of these

> [!success]- Worked solution
> **Answer: A — delayed trip action**
> 
> **Exam answer (supplied key): A — delayed trip action**
> 
> Thermal relays are designed to protect motors and other equipment from overload conditions. They operate on the heating effect of current, which is an inherently slow process. Therefore, they have a delayed trip action to allow for temporary overloads (like motor starting) while protecting against sustained overloads. They do not provide instantaneous protection for short circuits.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Thermal relays have an inherent time delay due to their operating principle.
> - **B:** Incorrect. Thermal relays are not designed for instantaneous operation.
> - **C:** Incorrect. They typically only provide delayed trip action for overloads.
> - **D:** Incorrect. (a) is correct.

Source: Assignment 2, Week 2, Question 9; Lecture 06

## T1-W2-Q10

The transient overreach phenomenon in an overcurrent relay increases when the decay of the DC component of fault current is

A. Constant
B. Fast
C. Slow
D. None of these

> [!success]- Worked solution
> **Answer: C — Slow**
> 
> **Exam answer (supplied key): C — Slow**
> 
> Transient overreach is the tendency of an instantaneous relay to operate for faults beyond its intended zone due to the DC offset component in the fault current. The DC component decays exponentially with a time constant L/R. If the decay is slow (high X/R ratio, typical in transmission systems), the DC component persists for several cycles, increasing the chance of the relay misoperating. A fast decay reduces the overreach effect.
> 
> **Why the other options fail**
> 
> - **A:** Constant decay is not a typical characteristic; decay is exponential.
> - **B:** Fast decay would reduce the transient overreach effect, not increase it.
> - **C:** Correct. Slow decay of the DC component increases the transient overreach phenomenon.
> - **D:** Incorrect. (c) is correct.

Source: Assignment 2, Week 2, Question 10; Lecture 08

## T2-W2-Q01

Limitation of the electro-mechanical relay is/are

A. moving parts and suffer from the problem of friction
B. low torque
C. high burden and high power consumption for auxiliary mechanisms
D. all of the above

> [!success]- Worked solution
> **Answer: D — all of the above**
> 
> **Exam answer (supplied key): D — all of the above**
> 
> Electromechanical relays have moving parts (armatures, discs) that cause friction and wear. They produce relatively low torque, limiting sensitivity. Their coils and auxiliary mechanisms draw significant power (high burden). All listed options are valid limitations.
> 
> **Why the other options fail**
> 
> - **A:** Correct, but not the only limitation.
> - **B:** Correct, but not the only limitation.
> - **C:** Correct, but not the only limitation.
> - **D:** Correct. All options are recognized limitations.

Source: Type2 Assignment, Week 2, Question 1; Lecture 06

## T2-W2-Q02

Characteristic of an overcurrent relay is always plotted between

A. current and time
B. multiple of pickup current and time
C. voltage and time
D. none of the above

> [!success]- Worked solution
> **Answer: B — multiple of pickup current and time**
> 
> **Exam answer (supplied key): B — multiple of pickup current and time**
> 
> Overcurrent relay characteristics are standardized as plots of operating time (y-axis) versus the multiple of pickup current (MP or PSM) (x-axis). Using MP normalizes the characteristic for different relay settings and CT ratios, making it universal. Plotting against absolute current would create a different curve for every setting.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. Using absolute current would not produce a universal characteristic curve.
> - **B:** Correct. The characteristic is plotted as Time vs. Multiple of Pickup Current (MP).
> - **C:** Incorrect. Overcurrent relays respond to current, not voltage.
> - **D:** Incorrect. (b) is correct.

Source: Type2 Assignment, Week 2, Question 2; Lecture 06

## T2-W2-Q03

A transmission line is protected by

A. inrush protection
B. time graded overcurrent protection
C. current graded over current protection
D. time graded and current graded over current protection

> [!success]- Worked solution
> **Answer: D — time graded and current graded over current protection**
> 
> **Exam answer (supplied key): D — time graded and current graded over current protection**
> 
> Practical overcurrent protection for transmission lines uses IDMT relays, which combine both time and current grading. The inverse time characteristic provides current grading (faster operation for higher currents), while the time dial settings provide time grading (increasing delays from load to source). This combined approach ensures selectivity and backup.
> 
> **Why the other options fail**
> 
> - **A:** Inrush protection is for transformers, not transmission lines.
> - **B:** Time grading alone would clear severe faults too slowly.
> - **C:** Current grading alone fails when fault currents in adjacent sections are similar.
> - **D:** Correct. IDMT relays use both time and current grading principles.

Source: Type2 Assignment, Week 2, Question 3; Lecture 09

## T2-W2-Q04

Which of the following is cheapest protection for overcurrent in low voltage system?

A. digital relay
B. numerical relay
C. rewireable fuse
D. electro-mechanical relay

> [!success]- Worked solution
> **Answer: C — rewireable fuse**
> 
> **Exam answer (supplied key): C — rewireable fuse**
> 
> In low voltage distribution systems, cost is a primary consideration. Rewireable fuses are the simplest and cheapest overcurrent protective devices. They have no moving parts, require no auxiliary power, and are very reliable for basic short-circuit and overload protection. Digital, numerical, and even electromechanical relays are more complex and expensive.
> 
> **Why the other options fail**
> 
> - **A:** Digital relays are more expensive than fuses.
> - **B:** Numerical relays are the most advanced and expensive option.
> - **C:** Correct. Rewireable fuses are the simplest and cheapest overcurrent protection.
> - **D:** Electromechanical relays are more expensive than fuses.

Source: Type2 Assignment, Week 2, Question 4; Lecture 06

## T2-W2-Q05

Which of the following relay can not use in backup protection?

A. inverse time overcurrent relay
B. definite minimum time relay
C. instantaneous overcurrent relay
D. none of these

> [!success]- Worked solution
> **Answer: C — instantaneous overcurrent relay**
> 
> **Exam answer (supplied key): C — instantaneous overcurrent relay**
> 
> Backup protection requires a time delay to allow the primary relay to operate first. Instantaneous overcurrent relays operate without intentional delay and cannot provide this time coordination. They are used for primary protection of close-in faults or as high-set units. Inverse time and definite minimum time relays have adjustable time delays and are suitable for backup protection.
> 
> **Why the other options fail**
> 
> - **A:** Inverse time relays have adjustable time delays and are used for backup.
> - **B:** Definite minimum time relays have a set time delay and are used for backup.
> - **C:** Correct. Instantaneous relays lack the necessary time delay for backup protection.
> - **D:** Incorrect. (c) is correct.

Source: Type2 Assignment, Week 2, Question 5; Lecture 06

## T2-W2-Q06

Relays for transmission line protection are

A. in three zones
B. in two zones
C. independent of zones
D. none of these

> [!success]- Worked solution
> **Answer: A — in three zones**
> 
> **Exam answer (supplied key): A — in three zones**
> 
> For transmission line protection using distance (impedance) relays, three zones of protection are typically employed: Zone 1 (instantaneous, covers ~80% of the line), Zone 2 (time-delayed, covers 100% of the line plus ~20% of the next line), and Zone 3 (time-delayed backup, covers the entire line plus a significant portion of the next line). This provides primary and backup protection.
> 
> **Why the other options fail**
> 
> - **A:** Correct. Three zones (Zone 1, 2, 3) are standard for distance protection.
> - **B:** Two zones are insufficient for comprehensive primary and backup protection.
> - **C:** Relays are coordinated in specific zones, not independent.
> - **D:** Incorrect. (a) is correct.

Source: Type2 Assignment, Week 2, Question 6; Lecture 09

## T2-W2-Q07

The multiple of pickup current (MP) is also known as plug setting multiplier (PSM). It defined as the ratio of referred to either the primary or secondary side of CT

A. fault current to CT current rating
B. fault current to relay pickup current
C. relay pickup current to CT current rating
D. none of the above

> [!success]- Worked solution
> **Answer: B — fault current to relay pickup current**
> 
> **Exam answer (supplied key): B — fault current to relay pickup current**
> 
> The Multiple of Pickup (MP) or Plug Setting Multiplier (PSM) is defined as the ratio of the fault current (referred to the CT secondary side) to the relay's pickup current setting. Mathematically, $"MP" = frac(I_("fault", "sec"), I_("pickup", "sec")) = frac(I_("fault"), "PS" times "CT"_("ratio") times I_("rated"))$. It indicates how many times the fault current exceeds the relay's pickup setting.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect. CT current rating is the secondary rating (e.g., 1A or 5A), not the pickup setting.
> - **B:** Correct. MP = Fault Current / Relay Pickup Current (both on the same side of CT).
> - **C:** Incorrect. This ratio is the inverse of the pickup current relative to CT rating.
> - **D:** Incorrect. (b) is correct.

Source: Type2 Assignment, Week 2, Question 7; Lecture 10

## T2-W2-Q08

Transient overreach phenomenon for an overcurrent relay increase if the decay of DC component of fault current is

A. constant
B. fast
C. slow
D. none of these

> [!success]- Worked solution
> **Answer: C — slow**
> 
> **Exam answer (supplied key): C — slow**
> 
> Transient overreach is the tendency of an instantaneous relay to operate for faults beyond its intended zone due to the DC offset component. The DC component decays exponentially. If the decay is slow (high X/R ratio), the DC component persists longer, increasing the chance of the relay misoperating. A fast decay reduces the overreach effect.
> 
> **Why the other options fail**
> 
> - **A:** Constant decay is not a typical characteristic; decay is exponential.
> - **B:** Fast decay would reduce the transient overreach effect, not increase it.
> - **C:** Correct. Slow decay of the DC component increases the transient overreach phenomenon.
> - **D:** Incorrect. (c) is correct.

Source: Type2 Assignment, Week 2, Question 8; Lecture 08

## T2-W2-Q09

Which of the following relay experience the more transient overreach effect due to DC component of fault current?

A. inverse time overcurrent relay
B. definite minimum time relay
C. instantaneous overcurrent relay
D. none of these

> [!success]- Worked solution
> **Answer: C — instantaneous overcurrent relay**
> 
> **Exam answer (supplied key): C — instantaneous overcurrent relay**
> 
> Transient overreach affects relays that operate within the first few cycles after fault inception, when the DC component is significant. Instantaneous overcurrent relays operate within 1-3 cycles and are therefore most susceptible. Inverse time and definite minimum time relays have operating times of several cycles to seconds, by which time the DC component has largely decayed, making them immune.
> 
> **Why the other options fail**
> 
> - **A:** Inverse time relays have longer operating times, reducing DC component effect.
> - **B:** Definite minimum time relays have set time delays, reducing DC component effect.
> - **C:** Correct. Instantaneous relays operate within cycles, when DC component is highest.
> - **D:** Incorrect. (c) is correct.

Source: Type2 Assignment, Week 2, Question 9; Lecture 08

## T2-W2-Q10

Minimum coordination time (MCT) between relays is decided by considering

A. errors in the relay alone
B. operating time of breaker
C. errors in the CTs and CVTs
D. operating time of relay, circuit breaker, and errors in the CTs and CVTs

> [!success]- Worked solution
> **Answer: D — operating time of relay, circuit breaker, and errors in the CTs and CVTs**
> 
> **Exam answer (supplied key): D — operating time of relay, circuit breaker, and errors in the CTs and CVTs**
> 
> The Minimum Coordination Time Interval (MCT or CTI) is the time margin added between the operating times of successive relays to ensure selectivity. It must account for: 1) The operating time of the circuit breaker, 2) Errors in the downstream relay's operating time, 3) Errors in CTs (and CVTs if used), and 4) A safety margin. Considering only one factor would be insufficient.
> 
> **Why the other options fail**
> 
> - **A:** Insufficient. Must also consider breaker time and CT errors.
> - **B:** Insufficient. Must also consider relay errors and CT errors.
> - **C:** Insufficient. Must also consider relay errors and breaker time.
> - **D:** Correct. MCT includes breaker time, relay errors, and CT/CVT errors.

Source: Type2 Assignment, Week 2, Question 10; Lecture 10

