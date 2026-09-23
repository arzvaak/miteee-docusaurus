---
title: "Week 1"
math_syntax: typst
---

# 2026 Type 1 — Week 1

[2026 Type 1 index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-2026-type-1-assignments-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

**Supplied source:** [Assignment_Week-1.pdf](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/2026%20Type%201%20Assignments/Supplied%20PDFs/Assignment_Week-1.pdf)

These are the supplied 2026 Type 1 questions in original order. The supplied answer key is authoritative for exam grading. Open each worked solution only after attempting the question.

## T1-W1-Q01

Unit protection is based on the concept of

A. Absolute selectivity
B. Relative selectivity
C. Both (a) and (b)
D. None of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — Absolute selectivity**
>
> **Exam answer (supplied key): A — Absolute selectivity**
>
> Unit protection (e.g., differential protection) operates for faults strictly within its defined zone by comparing quantities at both zone boundaries. This provides **absolute selectivity**, as it does not rely on coordination with other relays. Relative selectivity is achieved through grading schemes (e.g., overcurrent relays). The lecture explicitly states differential protection is an example of absolute selectivity.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 18**
>
> **Exam answer (supplied key): B — 18**
>
> The number of discs is calculated using the phase voltage. Phase voltage $V_P = V_L / sqrt(3) = 220 / sqrt(3) approx 127.02$ kV. Number of discs $N = (V_P / V_r) times S_f = (127.02 / 11) times 1.5 = 11.547 times 1.5 = 17.32$. Since discs must be whole numbers, we round up to **18**. This matches the provided solution.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — Lack of continuous monitoring of their operational integrity.**
>
> **Exam answer (supplied key): C — Lack of continuous monitoring of their operational integrity.**
>
> Electromechanical and static relays lack the self-monitoring and self-testing features of modern microprocessor-based relays. Their operational integrity cannot be continuously verified without periodic manual testing. The lecture highlights that microprocessor relays have self-monitoring as a key advantage, implying earlier types do not. Option A is incorrect; electromechanical relays are low-cost. Option B is incorrect; they are described as rugged.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — Overload**
>
> **Exam answer (supplied key): A — Overload**
>
> Thermal relays are specifically designed to protect equipment against **overload** conditions, which are gradual increases in current above the rated value. They operate on the heating effect ($I^2 R t$) and have an inverse-time characteristic. They are too slow for short-circuit protection and do not respond to overvoltage. The lecture explicitly states their use for overload protection.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — All of these**
>
> **Exam answer (supplied key): D — All of these**
>
> An IED is defined as a device that integrates multiple functions into a single unit. The lecture lists its capabilities as: protection, monitoring, control, measurement, and communication. Therefore, it is useful for protection, measurement/storing (monitoring), and control. All listed functions are correct.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 10 – 30 ms**
>
> **Exam answer (supplied key): B — 10 – 30 ms**
>
> The lecture on the 'Speed' requirement states that a high-speed relay (which includes modern digital relays) typically operates in the range of **10 to 30 milliseconds**. This corresponds to half a cycle to one and a half cycles in a 50 Hz system. Option A is too fast for typical digital relays; options C and D are characteristic of older electromechanical relays.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — total burden connected to the CT secondary circuit.**
>
> **Exam answer (supplied key): A — total burden connected to the CT secondary circuit.**
>
> The VA rating of a CT must be sufficient to supply the **total burden** on its secondary circuit. This burden includes the impedance of the relay, the connecting wires, and any other devices (e.g., meters) in the secondary loop. It is not determined by the relay's resistance or reactance alone, nor by the secondary current rating in isolation.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — cables**
>
> **Exam answer (supplied key): B — cables**
>
> According to the fault probability statistics presented in Lecture 1, underground **cables** have the lowest occurrence rate at **10%**. Overhead transmission lines have the highest at 50%, followed by transformers (15-20%) and switchgear (10-15%). Cables are less exposed to weather and environmental factors.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — sensitivity of the relay**
>
> **Exam answer (supplied key): C — sensitivity of the relay**
>
> The lecture defines the **sensitivity of a relay** as the minimum apparent power (in VA) required to operate it. A lower VA value indicates higher sensitivity. Stability refers to the relay's ability to not operate incorrectly, and tripping time is a speed parameter. The key is to distinguish this relay sensitivity from system sensitivity.
>
> **Why each option is right or wrong**
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

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — Only (ii)**
>
> **Exam answer (supplied key): B — Only (ii)**
>
> The primary function of a protective relay is to **sense** a fault condition and initiate a trip signal by closing its contacts when the actuating quantity (e.g., current) reaches a set value. Statement (ii) correctly describes this. Statement (i) is incorrect; limiting arcing current is a function of the **circuit breaker** (e.g., via arc quenching), not the relay. The relay only sends the trip command.
>
> **Why each option is right or wrong**
>
> - **A:** Incorrect, as (i) is a circuit breaker function.
> - **B:** Correct. See the worked solution above.
> - **C:** Incorrect, as (i) is false.
> - **D:** Incorrect, as (ii) is true.

Source: Type1 Assignment W1 Q10
