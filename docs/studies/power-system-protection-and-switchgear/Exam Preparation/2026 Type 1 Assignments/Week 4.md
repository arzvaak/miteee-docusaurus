---
title: "Week 4"
math_syntax: typst
---

# 2026 Type 1 — Week 4

[2026 Type 1 index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-2026-type-1-assignments-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

**Supplied source:** [Assignment_Week-4.pdf](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/2026%20Type%201%20Assignments/Supplied%20PDFs/Assignment_Week-4.pdf)

These are the supplied 2026 Type 1 questions in original order. The supplied answer key is authoritative for exam grading. Open each worked solution only after attempting the question.

## T1-W4-Q01

Additional time delay or coordination is generally not required in

A. carrier blocking scheme.
B. carrier tripping scheme.
C. both (a) and (b)
D. none of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — carrier tripping scheme.**
>
> **Exam answer (supplied key): B — carrier tripping scheme.**
>
> In a carrier tripping scheme, the carrier signal directly initiates tripping at the remote end, providing instantaneous operation without the need for additional time grading. In a carrier blocking scheme, the carrier signal is used to block tripping for external faults, but for internal faults, the absence of a blocking signal allows tripping after a short time delay (e.g., half-cycle). Therefore, additional time delay or coordination is generally not required in a carrier tripping scheme. The key is that carrier tripping provides direct intertripping, eliminating the need for time coordination between zones.
>
> **Why each option is right or wrong**
>
> - **A:** Carrier blocking schemes require a short time delay to wait for the absence of a blocking signal before tripping.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Both schemes are designed to eliminate the need for time grading, but carrier blocking still involves a brief delay.
> - **D:** Neither scheme requires additional time delay, but this is incorrect because carrier blocking does involve a delay.

Source: Type1 Assignment Week 4, Question 1; Lecture 19 (Carrier Aided Schemes-I) discusses the basic principles of carrier tripping and blocking schemes.

## T1-W4-Q02

The main disadvantage of a direct underreach transfer tripping scheme is

A. higher cost.
B. longer operating time.
C. maloperation due to noise or switching surges.
D. requirement of additional time grading.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — maloperation due to noise or switching surges.**
>
> **Exam answer (supplied key): C — maloperation due to noise or switching surges.**
>
> A direct underreach transfer tripping scheme uses a carrier signal to initiate tripping at the remote end when the local relay detects a fault within its underreaching zone (e.g., Zone 1). The main disadvantage is its susceptibility to maloperation. Noise or switching surges on the communication channel can be misinterpreted as a tripping signal, causing an unwanted trip. This is a critical reliability issue. The scheme does not inherently have higher cost or longer operating time; in fact, it aims for fast operation. It also does not require additional time grading, as it uses instantaneous underreach detection.
>
> **Why each option is right or wrong**
>
> - **A:** The scheme is designed for speed, not higher cost.
> - **B:** Operating time is fast, not longer.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** The scheme eliminates the need for additional time grading by using direct intertripping.

Source: Type1 Assignment Week 4, Question 2; Lecture 19 discusses the concept of carrier-aided schemes and their vulnerabilities.

## T1-W4-Q03

The frequency range of carrier signals transmitted through a microwave communication channel is typically

A. 0.3-3 Hz
B. 0.3-3 kHz
C. 0.3-3 MHz
D. 0.3-3 GHz

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — 0.3-3 GHz**
>
> **Exam answer (supplied key): D — 0.3-3 GHz**
>
> Microwave communication channels operate in the frequency range of 0.3 to 3 GHz. This is a standard classification for microwave frequencies used in power system communication for pilot protection. The other options represent different bands: 0.3-3 Hz is extremely low frequency (ELF), 0.3-3 kHz is audio frequency, and 0.3-3 MHz is in the medium wave/shortwave radio band. The recognition cue is the unit 'GHz' which is characteristic of microwave frequencies.
>
> **Why each option is right or wrong**
>
> - **A:** 0.3-3 Hz is not a practical communication band for protection.
> - **B:** 0.3-3 kHz is the audio frequency range, used in older tone schemes.
> - **C:** 0.3-3 MHz is in the radio frequency band, but not microwave.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type1 Assignment Week 4, Question 3; Lecture 20 (Carrier Aided Schemes-II) explicitly states the microwave frequency range as 0.3 to 3 GHz.

## T1-W4-Q04

Carrier protection schemes are mainly used for

A. High-voltage transmission lines.
B. Low-voltage transmission lines.
C. Distribution lines.
D. Transformers

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — High-voltage transmission lines.**
>
> **Exam answer (supplied key): A — High-voltage transmission lines.**
>
> Carrier protection schemes (pilot protection) are primarily used for high-voltage transmission lines (e.g., 132 kV and above). This is because these lines are critical for system stability and require fast, simultaneous fault clearing at both ends, which carrier schemes provide. Low-voltage lines and distribution lines typically use simpler overcurrent or fuses. Transformers are protected by differential or overcurrent relays, not carrier schemes. The key reasoning is the need for high-speed, unit-type protection on important transmission assets.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Low-voltage lines do not require the complexity and cost of carrier schemes.
> - **C:** Distribution lines are radial and use simpler protection.
> - **D:** Transformers have dedicated protection schemes like differential relays.

Source: Type1 Assignment Week 4, Question 4; Lecture 19 introduces carrier schemes for transmission line protection.

## T1-W4-Q05

Pilot-wire relaying schemes are generally used for

A. short transmission lines.
B. medium transmission lines.
C. long transmission lines.
D. All of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — short transmission lines.**
>
> **Exam answer (supplied key): A — short transmission lines.**
>
> Pilot-wire relaying schemes (wire pilot) are generally used for short transmission lines, typically up to 15-20 km. This is due to the high cost of laying dedicated pilot wires and problems like induced voltages and charging currents that become significant over longer distances. For medium and long lines, carrier current schemes using the power line itself or other communication channels (microwave, fiber optic) are preferred. The recognition cue is the physical limitation of laying metallic pilot wires.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Medium lines use carrier current or other communication channels.
> - **C:** Long lines require more robust communication like microwave or fiber optic.
> - **D:** The scheme is not suitable for all line lengths due to cost and technical limitations.

Source: Type1 Assignment Week 4, Question 5; Lecture 20 discusses the limitations of wire pilot schemes, stating they are used for short lines.

## T1-W4-Q06

A carrier signal used in protection schemes can also be utilized for

A. telemetering.
B. supervisory control.
C. communication.
D. All of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — All of these**
>
> **Exam answer (supplied key): D — All of these**
>
> The carrier signal, especially in power line carrier or microwave systems, is not used solely for protection. It can be multiplexed to carry other data. Telemetering involves transmitting measurement data (e.g., voltage, current, power) from remote substations. Supervisory control involves sending commands to operate equipment (e.g., breaker close/open). General communication includes voice or data. This multi-use capability is a key advantage of modern communication channels. The recognition cue is the term 'carrier signal' implying a communication channel that can carry multiple types of information.
>
> **Why each option is right or wrong**
>
> - **A:** Telemetering is one application, but not the only one.
> - **B:** Supervisory control is another application, but not the only one.
> - **C:** Communication is a broad term that includes telemetering and supervisory control.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type1 Assignment Week 4, Question 6; Lecture 20 mentions that carrier current schemes can be used for telecommunication, data transfer, and signaling.

## T1-W4-Q07

A 132 kV long transmission line has an impedance of (2 + j8) Ω. The line is protected by MHO type of distance relay with a characteristics angle of 74° and its first zone covers 80% of the line length. The CT ratio and PT ratio are 500/1 A and 132 kV/110 V, respectively. Considering a fault resistance of 2.4 Ω, determine the first zone setting of the distance relay.

A. K1=1.27 Ω
B. K1=2.73 Ω
C. K1=3.27 Ω
D. K1=4.73 Ω

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — K1=3.27 Ω**
>
> **Exam answer (supplied key): C — K1=3.27 Ω**
>
> Step 1: Calculate the primary zone impedance including fault resistance. Z_1(prim) = 0.8 * (2 + j8) + 2.4 = (1.6 + j6.4) + 2.4 = 4.0 + j6.4 Ω. Step 2: Convert to secondary impedance. Z_1(sec) = Z_1(prim) * (CT ratio / PT ratio) = (4.0 + j6.4) * (500/1) / (132e3/110) = (4.0 + j6.4) * (500 * 110 / 132000) = (4.0 + j6.4) * (0.41667) = 1.6667 + j2.6667 Ω. Step 3: Calculate the magnitude and angle of Z_1(sec). |Z_1(sec)| = sqrt(1.6667^2 + 2.6667^2) = sqrt(2.7778 + 7.1111) = sqrt(9.8889) = 3.145 Ω. φ = atan(2.6667/1.6667) = atan(1.6) = 57.99°. Step 4: Calculate K1 using the Mho setting formula: K1 = |Z_1(sec)| / cos(θ - φ) = 3.145 / cos(74° - 57.99°) = 3.145 / cos(16.01°) = 3.145 / 0.9613 = 3.27 Ω. The common mistake is forgetting to add R_F before conversion or miscalculating the angle difference.
>
> **Why each option is right or wrong**
>
> - **A:** 1.27 Ω might come from miscalculating the conversion factor or omitting R_F.
> - **B:** 2.73 Ω could result from using the wrong angle or forgetting the cosine term.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** 4.73 Ω might come from adding R_F after conversion or a different error.

Source: Type1 Assignment Week 4, Question 7; Lecture 17 (Example-2) and Lecture 18 (Effect of Fault Resistance) provide the methodology for setting calculations with fault resistance.

## T1-W4-Q08

A synchronism-check relay is used to

A. ensure synchronization before closing a circuit breaker.
B. reduce the impact on the circuit breaker.
C. maintain system stability.
D. None of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — ensure synchronization before closing a circuit breaker.**
>
> **Exam answer (supplied key): A — ensure synchronization before closing a circuit breaker.**
>
> A synchronism-check relay (also called a synchroscope relay) is a device that checks whether two parts of a power system are in synchronism (same frequency, phase angle within limits, and voltage magnitude difference within limits) before allowing a circuit breaker to close. Its primary function is to prevent out-of-phase closing, which can cause severe mechanical stress on generators and transformers, and potentially lead to system instability. It does not directly reduce breaker impact or maintain stability; it is a protective device that ensures safe reconnection.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Reducing breaker impact is a secondary effect, not the primary function.
> - **C:** Maintaining stability is a system-level goal, but the relay's specific function is to check synchronization conditions.
> - **D:** None of these is incorrect because option (a) is correct.

Source: Type1 Assignment Week 4, Question 8; This is a standard protection device concept, often covered in protection system design lectures.

## T1-W4-Q09

The use of auto-reclosing improves

A. stability of the system.
B. continuity of service.
C. sensitivity of protection.
D. None of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — continuity of service.**
>
> **Exam answer (supplied key): B — continuity of service.**
>
> Auto-reclosing is the automatic closing of a circuit breaker after it has been opened due to a fault, following a predetermined time delay. Its primary benefit is improving continuity of service. Since 80-90% of faults on overhead lines are transient (e.g., lightning strikes, tree branches), they clear after the breaker opens. Auto-reclosing restores the line to service quickly, minimizing outage time. While it can indirectly support stability by restoring the line, its main purpose is service continuity. It does not affect the sensitivity of protection.
>
> **Why each option is right or wrong**
>
> - **A:** Stability can be improved by restoring the line, but this is not the primary purpose.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Sensitivity of protection is unrelated to reclosing; it depends on relay settings.
> - **D:** None of these is incorrect because option (b) is correct.

Source: Type1 Assignment Week 4, Question 9; Lecture 19 discusses auto-reclosing as a key advantage of pilot schemes over conventional distance relaying.

## T1-W4-Q10

Pilot protection provides which of the following advantages?

A. Simultaneous tripping at both ends of the line
B. Lower cost compared to conventional protection schemes
C. Both (a) and (b)
D. None of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — Simultaneous tripping at both ends of the line**
>
> **Exam answer (supplied key): A — Simultaneous tripping at both ends of the line**
>
> The key advantage of pilot protection is that it enables simultaneous high-speed tripping at both ends of the transmission line for internal faults. This is achieved by exchanging information between the ends via a communication channel. This is crucial for maintaining system stability on critical lines. Pilot protection is generally more expensive than conventional distance or overcurrent schemes due to the cost of communication equipment and channels. Therefore, option (b) is incorrect. The correct answer is only (a).
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Lower cost is incorrect; pilot protection is more complex and costly.
> - **C:** Both (a) and (b) is incorrect because (b) is false.
> - **D:** None of these is incorrect because (a) is true.

Source: Type1 Assignment Week 4, Question 10; Lecture 19 highlights simultaneous tripping as a major advantage of pilot schemes.
