---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 1 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W1-Q01

Unit protection is based on the concept of

A. Absolute selectivity
B. Relative selectivity
C. Both (a) and (b)
D. None of these

> [!success]- Worked solution
> **Answer: A — Absolute selectivity**
> 
> **Exam answer (supplied key): A — Absolute selectivity**
> 
> Unit protection (e.g., differential protection) operates for faults strictly within its defined zone by comparing quantities at both zone boundaries. This provides **absolute selectivity**, as it does not rely on coordination with other relays. Relative selectivity is achieved through grading schemes (e.g., overcurrent relays). The lecture explicitly states differential protection is an example of absolute selectivity.
> 
> **Why the other options fail**
> 
> - **A:** Correct. See the worked solution above.
> - **B:** Relative selectivity is for non-unit schemes like overcurrent/distance relays.
> - **C:** Incorrect, as they are distinct concepts.
> - **D:** Incorrect, as (a) is correct.

Source: Lecture 2, Slide on Selectivity (02:04)

## T1-W1-Q02

Find the number of 11 kV suspension insulator discs required for a three phase 220 kV power transmission line, with a safety factor of 1.5?

A. 12
B. 18
C. 20
D. 30

> [!success]- Worked solution
> **Answer: B — 18**
> 
> **Exam answer (supplied key): B — 18**
> 
> The number of discs is calculated using the phase voltage. Phase voltage $V_P = V_L / sqrt(3) = 220 / sqrt(3) approx 127.02$ kV. Number of discs $N = (V_P / V_r) times S_f = (127.02 / 11) times 1.5 = 11.547 times 1.5 = 17.32$. Since discs must be whole numbers, we round up to **18**. This matches the provided solution.
> 
> **Why the other options fail**
> 
> - **A:** Would result from omitting the safety factor: 127.02/11 ≈ 11.55 → 12.
> - **B:** Correct. See the worked solution above.
> - **C:** Might come from using line voltage directly: (220/11)*1.5=30, then halving incorrectly.
> - **D:** Result of using line voltage without sqrt(3): (220/11)*1.5=30.

Source: Type1 Assignment W1 Q2

## T1-W1-Q03

What is the main drawback of electromechanical and static relays?

A. Both are very costly.
B. They are not rugged in nature.
C. Lack of continuous monitoring of their operational integrity.
D. None of these

> [!success]- Worked solution
> **Answer: C — Lack of continuous monitoring of their operational integrity.**
> 
> **Exam answer (supplied key): C — Lack of continuous monitoring of their operational integrity.**
> 
> Electromechanical and static relays lack the self-monitoring and self-testing features of modern microprocessor-based relays. Their operational integrity cannot be continuously verified without periodic manual testing. The lecture highlights that microprocessor relays have self-monitoring as a key advantage, implying earlier types do not. Option A is incorrect; electromechanical relays are low-cost. Option B is incorrect; they are described as rugged.
> 
> **Why the other options fail**
> 
> - **A:** Electromechanical relays are noted for low cost.
> - **B:** They are described as rugged and reliable.
> - **C:** Correct. See the worked solution above.
> - **D:** Incorrect, as (c) is a valid drawback.

Source: Lecture 3, Slide on Microprocessor-based Relays (16:03)

## T1-W1-Q04

A thermal relay is used for protection against

A. Overload
B. Overvoltage
C. Short-circuit
D. All the above

> [!success]- Worked solution
> **Answer: A — Overload**
> 
> **Exam answer (supplied key): A — Overload**
> 
> Thermal relays are specifically designed to protect equipment against **overload** conditions, which are gradual increases in current above the rated value. They operate on the heating effect ($I^2 R t$) and have an inverse-time characteristic. They are too slow for short-circuit protection and do not respond to overvoltage. The lecture explicitly states their use for overload protection.
> 
> **Why the other options fail**
> 
> - **A:** Correct. See the worked solution above.
> - **B:** Overvoltage is protected by overvoltage relays.
> - **C:** Short-circuit requires fast-acting overcurrent or differential relays.
> - **D:** Incorrect, as thermal relays are not for all.

Source: Lecture 4, Slide on Thermal Relay (00:41)

## T1-W1-Q05

Intelligent Electronic Devices (IEDs) are useful for

A. Protection
B. Measurement and storing
C. Control
D. All of these

> [!success]- Worked solution
> **Answer: D — All of these**
> 
> **Exam answer (supplied key): D — All of these**
> 
> An IED is defined as a device that integrates multiple functions into a single unit. The lecture lists its capabilities as: protection, monitoring, control, measurement, and communication. Therefore, it is useful for protection, measurement/storing (monitoring), and control. All listed functions are correct.
> 
> **Why the other options fail**
> 
> - **A:** True, but incomplete.
> - **B:** True, but incomplete.
> - **C:** True, but incomplete.
> - **D:** Correct, as IEDs encompass all these functions.

Source: Lecture 3, Slide on IEDs (28:04)

## T1-W1-Q06

The operating time of a modern digital relay is typically of the order of

A. 0 – 10 ms
B. 10 – 30 ms
C. 50 – 100 ms
D. 100 – 200 ms

> [!success]- Worked solution
> **Answer: B — 10 – 30 ms**
> 
> **Exam answer (supplied key): B — 10 – 30 ms**
> 
> The lecture on the 'Speed' requirement states that a high-speed relay (which includes modern digital relays) typically operates in the range of **10 to 30 milliseconds**. This corresponds to half a cycle to one and a half cycles in a 50 Hz system. Option A is too fast for typical digital relays; options C and D are characteristic of older electromechanical relays.
> 
> **Why the other options fail**
> 
> - **A:** This is extremely fast, more typical of solid-state or very advanced numerical relays. Option C & D: These are slower times associated with older electromechanical technology.
> - **B:** Correct. See the worked solution above.
> - **C:** Option A: This is extremely fast, more typical of solid-state or very advanced numerical relays. Option C & D: These are slower times associated with older electromechanical technology.
> - **D:** Option A: This is extremely fast, more typical of solid-state or very advanced numerical relays. Option C & D: These are slower times associated with older electromechanical technology.

Source: Lecture 2, Slide on Speed (06:22)

## T1-W1-Q07

The VA rating of a current transformer (CT) is determined by considering

A. total burden connected to the CT secondary circuit.
B. resistance of the relay only.
C. reactance of the relay only.
D. secondary current rating only.

> [!success]- Worked solution
> **Answer: A — total burden connected to the CT secondary circuit.**
> 
> **Exam answer (supplied key): A — total burden connected to the CT secondary circuit.**
> 
> The VA rating of a CT must be sufficient to supply the **total burden** on its secondary circuit. This burden includes the impedance of the relay, the connecting wires, and any other devices (e.g., meters) in the secondary loop. It is not determined by the relay's resistance or reactance alone, nor by the secondary current rating in isolation.
> 
> **Why the other options fail**
> 
> - **A:** Correct. See the worked solution above.
> - **B:** Option B & C: The burden includes more than just the relay's impedance. Option D: The secondary current rating is a separate parameter; the VA rating depends on the burden at that current.
> - **C:** Option B & C: The burden includes more than just the relay's impedance. Option D: The secondary current rating is a separate parameter; the VA rating depends on the burden at that current.
> - **D:** The secondary current rating is a separate parameter; the VA rating depends on the burden at that current.

Source: Lecture 3, Slide on Electromechanical Relays (14:00)

## T1-W1-Q08

The least number of faults is generally reported for

A. transmission line
B. cables
C. switchgear
D. transformers

> [!success]- Worked solution
> **Answer: B — cables**
> 
> **Exam answer (supplied key): B — cables**
> 
> According to the fault probability statistics presented in Lecture 1, underground **cables** have the lowest occurrence rate at **10%**. Overhead transmission lines have the highest at 50%, followed by transformers (15-20%) and switchgear (10-15%). Cables are less exposed to weather and environmental factors.
> 
> **Why the other options fail**
> 
> - **A:** Transmission lines have the highest fault rate (50%).
> - **B:** Correct. See the worked solution above.
> - **C:** Switchgear faults are 10-15%, higher than cables.
> - **D:** Transformer faults are 15-20%, higher than cables.

Source: Lecture 1, Slide on Fault Probability (09:16)

## T1-W1-Q09

The apparent power (VA) required to operate a relay is known as

A. stability of the relay
B. tripping time of the relay
C. sensitivity of the relay
D. None of these

> [!success]- Worked solution
> **Answer: C — sensitivity of the relay**
> 
> **Exam answer (supplied key): C — sensitivity of the relay**
> 
> The lecture defines the **sensitivity of a relay** as the minimum apparent power (in VA) required to operate it. A lower VA value indicates higher sensitivity. Stability refers to the relay's ability to not operate incorrectly, and tripping time is a speed parameter. The key is to distinguish this relay sensitivity from system sensitivity.
> 
> **Why the other options fail**
> 
> - **A:** Stability is about security against mal-operation.
> - **B:** Tripping time relates to the 'Speed' requirement.
> - **C:** Correct. See the worked solution above.
> - **D:** Incorrect, as (c) is the correct definition.

Source: Lecture 2, Slide on Sensitivity (13:10)

## T1-W1-Q10

A protective relay is used to
(i) provide additional safety by limiting arcing current during circuit breaker operation.
(ii) close its contacts when the actuating quantity reaches a predetermined value.

A. Only (i)
B. Only (ii)
C. Both (i) and (ii)
D. None of these

> [!success]- Worked solution
> **Answer: B — Only (ii)**
> 
> **Exam answer (supplied key): B — Only (ii)**
> 
> The primary function of a protective relay is to **sense** a fault condition and initiate a trip signal by closing its contacts when the actuating quantity (e.g., current) reaches a set value. Statement (ii) correctly describes this. Statement (i) is incorrect; limiting arcing current is a function of the **circuit breaker** (e.g., via arc quenching), not the relay. The relay only sends the trip command.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect, as (i) is a circuit breaker function.
> - **B:** Correct. See the worked solution above.
> - **C:** Incorrect, as (i) is false.
> - **D:** Incorrect, as (ii) is true.

Source: Type1 Assignment W1 Q10

## T2-W1-Q01

Selectivity, which is one of the requirements of protection system, is also known as

A. Dependability
B. Relay Coordination
C. Security
D. None of these

> [!success]- Worked solution
> **Answer: B — Relay Coordination**
> 
> **Exam answer (supplied key): B — Relay Coordination**
> 
> In the context of protection system requirements, **selectivity** is the ability to isolate only the faulty section. This is practically achieved through **relay coordination** (grading), especially for non-unit schemes. Dependability and security are components of reliability, not synonyms for selectivity.
> 
> **Why the other options fail**
> 
> - **A:** Dependability is the certainty of operation for a fault in zone.
> - **B:** Correct. See the worked solution above.
> - **C:** Security is the certainty of not operating for out-of-zone faults.
> - **D:** Incorrect, as (b) is a common synonym in practice.

Source: Lecture 2, Slide on Selectivity (01:29)

## T2-W1-Q02

Electromechanical relays are still used by the utilities due to their

A. ruggedness and withstanding capacity of voltage spikes
B. lower cost
C. simple construction
D. all of the above

> [!success]- Worked solution
> **Answer: D — all of the above**
> 
> **Exam answer (supplied key): D — all of the above**
> 
> The lecture lists several advantages of electromechanical relays that explain their continued use: they are **rugged and reliable**, can **withstand voltage spikes** and mechanical vibrations, have **lower cost**, and have a **simple construction**. Therefore, all the listed reasons are valid.
> 
> **Why the other options fail**
> 
> - **A:** True, but incomplete.
> - **B:** True, but incomplete.
> - **C:** True, but incomplete.
> - **D:** Correct, as all are cited advantages.

Source: Lecture 3, Slide on Electromechanical Relays (11:23)

## T2-W1-Q03

The cost of the protection system should not exceed

A. 5% of the cost of the equipment to be protected
B. 10% of the cost of the equipment to be protected
C. 15% of the cost of the equipment to be protected
D. 20% of the cost of the equipment to be protected

> [!success]- Worked solution
> **Answer: A — 5% of the cost of the equipment to be protected**
> 
> **Exam answer (supplied key): A — 5% of the cost of the equipment to be protected**
> 
> The lecture on the 'Economics' requirement provides a cost breakdown and states that the total cost of protective gear (relay, CTs, PTs, panels, wiring) typically comes to **5% to 7%** of the equipment cost. It concludes that the cost should not be higher than a maximum of **10%**, but the accepted answer in the assignment is the more precise lower bound of **5%**, which aligns with the typical range given.
> 
> **Why the other options fail**
> 
> - **A:** Correct. See the worked solution above.
> - **B:** 10% is mentioned as a maximum, but 5% is the more specific typical target. Option C & D: These are too high and not supported by the lecture statistics.
> - **C:** Option B: 10% is mentioned as a maximum, but 5% is the more specific typical target. Option C & D: These are too high and not supported by the lecture statistics.
> - **D:** Option B: 10% is mentioned as a maximum, but 5% is the more specific typical target. Option C & D: These are too high and not supported by the lecture statistics.

Source: Lecture 2, Slide on Economics (24:30)

## T2-W1-Q04

A thermal relay is used for the protection against

A. Overload
B. Short circuit
C. Overvoltage
D. All of the above

> [!success]- Worked solution
> **Answer: A — Overload**
> 
> **Exam answer (supplied key): A — Overload**
> 
> This is identical to Type1 W1 Q4. Thermal relays are designed for **overload** protection, which involves gradual current increases. They are not suitable for fast-acting short-circuit protection or overvoltage protection.
> 
> **Why the other options fail**
> 
> - **A:** Correct. See the worked solution above.
> - **B:** Short-circuit requires instantaneous or inverse-time overcurrent relays.
> - **C:** Overvoltage is protected by overvoltage relays.
> - **D:** Incorrect, as thermal relays are specific to overload.

Source: Lecture 4, Slide on Thermal Relay (00:41)

## T2-W1-Q05

The VA rating of a CT is decided by considering

A. Resistance of a relay
B. Reactance of a relay
C. Burden of a relay
D. None of the above

> [!success]- Worked solution
> **Answer: C — Burden of a relay**
> 
> **Exam answer (supplied key): C — Burden of a relay**
> 
> This is a rephrasing of Type1 W1 Q7. The VA rating is determined by the **total burden** (impedance) connected to the CT secondary, which includes the relay's impedance (both resistance and reactance) plus wiring. 'Burden of a relay' is the most encompassing correct term among the choices.
> 
> **Why the other options fail**
> 
> - **A:** Option A & B: These are components of the total burden, but not the complete determinant. Option D: Incorrect, as (c) is correct.
> - **B:** Option A & B: These are components of the total burden, but not the complete determinant. Option D: Incorrect, as (c) is correct.
> - **C:** Correct. See the worked solution above.
> - **D:** Incorrect, as (c) is correct.

Source: Lecture 3, Slide on Electromechanical Relays (14:00)

## T2-W1-Q06

The operating time of modern digital relay is of the order of

A. 0-10 ms
B. 10-30 ms
C. 100 — 200 ms
D. None of these

> [!success]- Worked solution
> **Answer: B — 10-30 ms**
> 
> **Exam answer (supplied key): B — 10-30 ms**
> 
> Identical to Type1 W1 Q6. The lecture specifies that a high-speed relay (modern digital) operates in **10-30 ms**.
> 
> **Why the other options fail**
> 
> - **A:** Too fast for typical digital relays.
> - **B:** Correct. See the worked solution above.
> - **C:** Too slow, characteristic of older technology.
> - **D:** Incorrect, as (b) is correct.

Source: Lecture 2, Slide on Speed (06:22)

## T2-W1-Q07

The torque produced in shaded pole structure induction type relay is

A. Proportional to the current
B. Proportional to the square of the current
C. Inversely proportional to the current
D. Inversely proportional to the square of the current

> [!success]- Worked solution
> **Answer: B — Proportional to the square of the current**
> 
> **Exam answer (supplied key): B — Proportional to the square of the current**
> 
> For an induction disc relay with a single operating quantity (current), the torque is derived from the universal torque equation. The flux $phi$ is proportional to current $I$, and the induced rotor current is also proportional to $I$. Therefore, the torque $T prop phi times I prop I times I = I^2$. The torque is **proportional to the square of the current**.
> 
> **Why the other options fail**
> 
> - **A:** This would be for an attracted armature relay. Option C & D: Torque increases with current, not decreases.
> - **B:** Correct. See the worked solution above.
> - **C:** Option A: This would be for an attracted armature relay. Option C & D: Torque increases with current, not decreases.
> - **D:** Option A: This would be for an attracted armature relay. Option C & D: Torque increases with current, not decreases.

Source: Lecture 5, Universal Torque Equation derivation (14:02)

## T2-W1-Q08

Least number of faults are generally reported for

A. Transmission lines
B. Cables
C. Switchgears
D. Transformers

> [!success]- Worked solution
> **Answer: B — Cables**
> 
> **Exam answer (supplied key): B — Cables**
> 
> Identical to Type1 W1 Q8. Underground **cables** have the lowest fault probability at **10%**.
> 
> **Why the other options fail**
> 
> - **A:** Highest at 50%.
> - **B:** Correct. See the worked solution above.
> - **C:** 10-15%.
> - **D:** 15-20%.

Source: Lecture 1, Slide on Fault Probability (09:16)

## T2-W1-Q09

The purpose of backup protection is

A. To increase the speed
B. To increase the reach
C. To leave no blind spot
D. To guard against failure of primary

> [!success]- Worked solution
> **Answer: D — To guard against failure of primary**
> 
> **Exam answer (supplied key): D — To guard against failure of primary**
> 
> Backup protection is a secondary line of defense. Its purpose is to operate if the **primary protection fails** to clear a fault. It does not aim to increase speed or reach; those are primary protection attributes. 'Leaving no blind spot' is a goal of zone overlapping, not specifically backup protection.
> 
> **Why the other options fail**
> 
> - **A:** Speed is a primary protection requirement.
> - **B:** Reach is a setting for distance relays.
> - **C:** This is achieved by overlapping zones.
> - **D:** Correct. See the worked solution above.

Source: Lecture 2, Slide on Primary and Backup Protection (29:48)

## T2-W1-Q10

The protective relay is provided to
1. Provide additional safety by limiting arcing current during circuit breaker operation
2. Close the contacts when the actuating quantity attains a certain predetermined value

A. Only 1
B. Only 2
C. Both 1 and 2
D. None of these

> [!success]- Worked solution
> **Answer: B — Only 2**
> 
> **Exam answer (supplied key): B — Only 2**
> 
> Identical to Type1 W1 Q10. The relay's function is to **sense and close contacts** (statement 2). Limiting arcing current (statement 1) is a circuit breaker function.
> 
> **Why the other options fail**
> 
> - **A:** Incorrect, as statement 1 is a CB function.
> - **B:** Correct. See the worked solution above.
> - **C:** Incorrect, as statement 1 is false.
> - **D:** Incorrect, as statement 2 is true.

Source: Type2 Assignment W1 Q10

