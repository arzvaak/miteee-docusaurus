---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 4 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W4-Q01

Additional time delay or coordination is generally not required in

A. carrier blocking scheme.
B. carrier tripping scheme.
C. both (a) and (b)
D. none of these

> [!success]- Worked solution
> **Answer: B — carrier tripping scheme.**
> 
> **Exam answer (supplied key): B — carrier tripping scheme.**
> 
> In a carrier tripping scheme, the carrier signal directly initiates tripping at the remote end, providing instantaneous operation without the need for additional time grading. In a carrier blocking scheme, the carrier signal is used to block tripping for external faults, but for internal faults, the absence of a blocking signal allows tripping after a short time delay (e.g., half-cycle). Therefore, additional time delay or coordination is generally not required in a carrier tripping scheme. The key is that carrier tripping provides direct intertripping, eliminating the need for time coordination between zones.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: C — maloperation due to noise or switching surges.**
> 
> **Exam answer (supplied key): C — maloperation due to noise or switching surges.**
> 
> A direct underreach transfer tripping scheme uses a carrier signal to initiate tripping at the remote end when the local relay detects a fault within its underreaching zone (e.g., Zone 1). The main disadvantage is its susceptibility to maloperation. Noise or switching surges on the communication channel can be misinterpreted as a tripping signal, causing an unwanted trip. This is a critical reliability issue. The scheme does not inherently have higher cost or longer operating time; in fact, it aims for fast operation. It also does not require additional time grading, as it uses instantaneous underreach detection.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: D — 0.3-3 GHz**
> 
> **Exam answer (supplied key): D — 0.3-3 GHz**
> 
> Microwave communication channels operate in the frequency range of 0.3 to 3 GHz. This is a standard classification for microwave frequencies used in power system communication for pilot protection. The other options represent different bands: 0.3-3 Hz is extremely low frequency (ELF), 0.3-3 kHz is audio frequency, and 0.3-3 MHz is in the medium wave/shortwave radio band. The recognition cue is the unit 'GHz' which is characteristic of microwave frequencies.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — High-voltage transmission lines.**
> 
> **Exam answer (supplied key): A — High-voltage transmission lines.**
> 
> Carrier protection schemes (pilot protection) are primarily used for high-voltage transmission lines (e.g., 132 kV and above). This is because these lines are critical for system stability and require fast, simultaneous fault clearing at both ends, which carrier schemes provide. Low-voltage lines and distribution lines typically use simpler overcurrent or fuses. Transformers are protected by differential or overcurrent relays, not carrier schemes. The key reasoning is the need for high-speed, unit-type protection on important transmission assets.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — short transmission lines.**
> 
> **Exam answer (supplied key): A — short transmission lines.**
> 
> Pilot-wire relaying schemes (wire pilot) are generally used for short transmission lines, typically up to 15-20 km. This is due to the high cost of laying dedicated pilot wires and problems like induced voltages and charging currents that become significant over longer distances. For medium and long lines, carrier current schemes using the power line itself or other communication channels (microwave, fiber optic) are preferred. The recognition cue is the physical limitation of laying metallic pilot wires.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: D — All of these**
> 
> **Exam answer (supplied key): D — All of these**
> 
> The carrier signal, especially in power line carrier or microwave systems, is not used solely for protection. It can be multiplexed to carry other data. Telemetering involves transmitting measurement data (e.g., voltage, current, power) from remote substations. Supervisory control involves sending commands to operate equipment (e.g., breaker close/open). General communication includes voice or data. This multi-use capability is a key advantage of modern communication channels. The recognition cue is the term 'carrier signal' implying a communication channel that can carry multiple types of information.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: C — K1=3.27 Ω**
> 
> **Exam answer (supplied key): C — K1=3.27 Ω**
> 
> Step 1: Calculate the primary zone impedance including fault resistance. Z_1(prim) = 0.8 * (2 + j8) + 2.4 = (1.6 + j6.4) + 2.4 = 4.0 + j6.4 Ω. Step 2: Convert to secondary impedance. Z_1(sec) = Z_1(prim) * (CT ratio / PT ratio) = (4.0 + j6.4) * (500/1) / (132e3/110) = (4.0 + j6.4) * (500 * 110 / 132000) = (4.0 + j6.4) * (0.41667) = 1.6667 + j2.6667 Ω. Step 3: Calculate the magnitude and angle of Z_1(sec). |Z_1(sec)| = sqrt(1.6667^2 + 2.6667^2) = sqrt(2.7778 + 7.1111) = sqrt(9.8889) = 3.145 Ω. φ = atan(2.6667/1.6667) = atan(1.6) = 57.99°. Step 4: Calculate K1 using the Mho setting formula: K1 = |Z_1(sec)| / cos(θ - φ) = 3.145 / cos(74° - 57.99°) = 3.145 / cos(16.01°) = 3.145 / 0.9613 = 3.27 Ω. The common mistake is forgetting to add R_F before conversion or miscalculating the angle difference.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — ensure synchronization before closing a circuit breaker.**
> 
> **Exam answer (supplied key): A — ensure synchronization before closing a circuit breaker.**
> 
> A synchronism-check relay (also called a synchroscope relay) is a device that checks whether two parts of a power system are in synchronism (same frequency, phase angle within limits, and voltage magnitude difference within limits) before allowing a circuit breaker to close. Its primary function is to prevent out-of-phase closing, which can cause severe mechanical stress on generators and transformers, and potentially lead to system instability. It does not directly reduce breaker impact or maintain stability; it is a protective device that ensures safe reconnection.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: B — continuity of service.**
> 
> **Exam answer (supplied key): B — continuity of service.**
> 
> Auto-reclosing is the automatic closing of a circuit breaker after it has been opened due to a fault, following a predetermined time delay. Its primary benefit is improving continuity of service. Since 80-90% of faults on overhead lines are transient (e.g., lightning strikes, tree branches), they clear after the breaker opens. Auto-reclosing restores the line to service quickly, minimizing outage time. While it can indirectly support stability by restoring the line, its main purpose is service continuity. It does not affect the sensitivity of protection.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — Simultaneous tripping at both ends of the line**
> 
> **Exam answer (supplied key): A — Simultaneous tripping at both ends of the line**
> 
> The key advantage of pilot protection is that it enables simultaneous high-speed tripping at both ends of the transmission line for internal faults. This is achieved by exchanging information between the ends via a communication channel. This is crucial for maintaining system stability on critical lines. Pilot protection is generally more expensive than conventional distance or overcurrent schemes due to the cost of communication equipment and channels. Therefore, option (b) is incorrect. The correct answer is only (a).
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Lower cost is incorrect; pilot protection is more complex and costly.
> - **C:** Both (a) and (b) is incorrect because (b) is false.
> - **D:** None of these is incorrect because (a) is true.

Source: Type1 Assignment Week 4, Question 10; Lecture 19 highlights simultaneous tripping as a major advantage of pilot schemes.

## T2-W4-Q01

A 220 kV transmission line with an impedance of 1.5 + j7.5 Ω is protected by a reactance relay. Determine the reach of the reactance relay for the first zone. The CT ratio and PT ratio are 500/1 A and 220 kV/110 V, respectively. The first zone covers 80% of the line section.

A. X1=1.5 Ω
B. X1=2.5 Ω
C. X1=1.75 Ω
D. X1=1.8 Ω

> [!success]- Worked solution
> **Answer: A — X1=1.5 Ω**
> 
> **Exam answer (supplied key): A — X1=1.5 Ω**
> 
> A reactance relay measures only the reactance component of the impedance. The first zone setting is based on 80% of the line's reactance. Step 1: Calculate the primary reactance for zone 1: X_1(prim) = 0.8 * 7.5 Ω = 6.0 Ω. Step 2: Convert to secondary reactance using the CT/PT ratio. The reactance conversion is the same as impedance: X_1(sec) = X_1(prim) * (CT ratio / PT ratio) = 6.0 * (500/1) / (220e3/110) = 6.0 * (500 * 110 / 220000) = 6.0 * (55000 / 220000) = 6.0 * 0.25 = 1.5 Ω. The common mistake is forgetting to convert to secondary or miscalculating the ratio. The answer is X1 = 1.5 Ω.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** 2.5 Ω might come from using the full line reactance (7.5 Ω) and a wrong conversion.
> - **C:** 1.75 Ω could result from an error in the percentage or conversion.
> - **D:** 1.8 Ω might come from a miscalculation of 80% of 7.5 Ω (which is 6.0 Ω) and then a wrong conversion.

Source: Type2 Assignment Week 4, Question 1; Lecture 16 (Quantities to be fed to Distance Relays) and Lecture 17 (Example-1) cover reactance relay settings.

## T2-W4-Q02

A transmission line is feed from local end A and remote end B. The impedance of the whole transmission line is 7+j21 Ω. The fault occurs at a point F on the line and the impedance from the relaying point A to the fault point, i.e., Z_AF = 3.5+j10.5 Ω. The fault resistance (Rf)=7 Ω. The fault current contribution from bus A to the fault is 200∠−76.36°. The contribution of fault current from bus B to the fault is 300∠−84.29°. Determine the apparent impedance seen by the relay at A without considering the contribution of current from the remote bus.

A. 11.06∠71.56°
B. 14.84∠45°
C. 10.5∠45°
D. 25.23∠56.30°

> [!success]- Worked solution
> **Answer: B — 14.84∠45°**
> 
> **Exam answer (supplied key): B — 14.84∠45°**
> 
> The apparent impedance seen by the relay at A, ignoring remote infeed, is simply the impedance from A to the fault plus the fault resistance. Z_apparent = Z_AF + R_F = (3.5 + j10.5) + 7 = 10.5 + j10.5 Ω. Convert to polar form: magnitude = sqrt(10.5^2 + 10.5^2) = sqrt(110.25 + 110.25) = sqrt(220.5) = 14.85 Ω. Angle = atan(10.5/10.5) = atan(1) = 45°. So, Z_apparent = 14.85∠45° Ω, which matches option (b). The trap is to include the remote infeed term R_F*(I_B/I_A), but the question explicitly says 'without considering the contribution of current from the remote bus.'
> 
> **Why the other options fail**
> 
> - **A:** 11.06∠71.56° might come from miscalculating the impedance or including infeed incorrectly.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** 10.5∠45° could be the magnitude of Z_AF alone, forgetting to add R_F.
> - **D:** 25.23∠56.30° might result from incorrectly adding the infeed term.

Source: Type2 Assignment Week 4, Question 2; Lecture 18 (Effect of Fault Resistance) derives the formula for apparent impedance with remote infeed.

## T2-W4-Q03

A 220 kV long transmission line has an impedance of 2+j4 Ω. This line is protected by MHO type of distance relay with a characteristics angle of 60° and its first zone covers 90% of the line length. The CT ratio and PT ratio are 1000/1 A and 220 kV/110 V, respectively. Considering a fault resistance of 2 Ω, the first zone setting of the distance relay is

A. K1=2.79 Ω
B. K1=4.2 Ω
C. K1=2.50 Ω
D. K1=2.72 Ω

> [!success]- Worked solution
> **Answer: D — K1=2.72 Ω**
> 
> **Exam answer (supplied key): D — K1=2.72 Ω**
> 
> Step 1: Calculate primary zone impedance including fault resistance. Z_1(prim) = 0.9 * (2 + j4) + 2 = (1.8 + j3.6) + 2 = 3.8 + j3.6 Ω. Step 2: Convert to secondary. Z_1(sec) = Z_1(prim) * (CT/PT) = (3.8 + j3.6) * (1000/1) / (220e3/110) = (3.8 + j3.6) * (1000 * 110 / 220000) = (3.8 + j3.6) * (110000 / 220000) = (3.8 + j3.6) * 0.5 = 1.9 + j1.8 Ω. Step 3: Calculate magnitude and angle. |Z_1(sec)| = sqrt(1.9^2 + 1.8^2) = sqrt(3.61 + 3.24) = sqrt(6.85) = 2.617 Ω. φ = atan(1.8/1.9) = atan(0.9474) = 43.45°. Step 4: Calculate K1 = |Z_1(sec)| / cos(θ - φ) = 2.617 / cos(60° - 43.45°) = 2.617 / cos(16.55°) = 2.617 / 0.959 = 2.728 Ω ≈ 2.72 Ω. The source solution shows 2.72 Ω. The common mistake is miscalculating the conversion factor or the angle.
> 
> **Why the other options fail**
> 
> - **A:** 2.79 Ω might come from a slight rounding error in the angle or magnitude.
> - **B:** 4.2 Ω could result from using the full line impedance without fault resistance or a wrong conversion.
> - **C:** 2.50 Ω might come from forgetting to add R_F or a different error.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment Week 4, Question 3; Lecture 17 and 18 provide the methodology for Mho relay setting calculations.

## T2-W4-Q04

In the distance protection scheme, the distance is measured in terms of

A. voltage
B. current
C. phase angle
D. impedance

> [!success]- Worked solution
> **Answer: D — impedance**
> 
> **Exam answer (supplied key): D — impedance**
> 
> Distance relays operate by measuring the impedance (ratio of voltage to current) from the relay location to the fault point. Since the impedance of a transmission line is proportional to its length (distance), the relay can estimate the fault distance by measuring impedance. The relay compares this measured impedance to a preset impedance value (reach) to determine if the fault is within its zone of protection. Voltage, current, and phase angle are components used to calculate impedance, but the fundamental measured quantity for distance determination is impedance.
> 
> **Why the other options fail**
> 
> - **A:** Voltage is one input, but not the measured quantity for distance.
> - **B:** Current is another input, but not the measured quantity for distance.
> - **C:** Phase angle is used in some relay characteristics, but the primary measurement is impedance.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment Week 4, Question 4; Lecture 16 introduces distance relays and their principle of measuring impedance.

## T2-W4-Q05

The normal range of audio frequency is

A. 30–600 kHz
B. 10 kHz–0.1 GHz
C. 0.3–3 GHz
D. 0.02–20 kHz

> [!success]- Worked solution
> **Answer: D — 0.02–20 kHz**
> 
> **Exam answer (supplied key): D — 0.02–20 kHz**
> 
> The normal range of audio frequency is 0.02 to 20 kHz. This is the frequency range of sound waves that can be heard by the human ear and was historically used in tone-based pilot protection schemes. The other options represent different bands: 30-600 kHz is power line carrier frequency, 10 kHz-0.1 GHz is radio frequency, and 0.3-3 GHz is microwave frequency. The recognition cue is the unit 'kHz' and the specific range 0.02-20 kHz.
> 
> **Why the other options fail**
> 
> - **A:** 30–600 kHz is the power line carrier frequency range.
> - **B:** 10 kHz–0.1 GHz is the radio frequency range.
> - **C:** 0.3–3 GHz is the microwave frequency range.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment Week 4, Question 5; Lecture 20 explicitly states the audio frequency range as 0.02 to 20 kHz.

## T2-W4-Q06

The normal range of radio frequency is

A. 30–600 kHz
B. 10 kHz–0.1 GHz
C. 0.3–3 GHz
D. 0.02–20 kHz

> [!warning] Source caution
> This is a course-specific classification. The lecture states radio frequency is 10 kHz to 0.1 GHz. This is not a universal definition; RF bands are broader.

> [!success]- Worked solution
> **Answer: B — 10 kHz–0.1 GHz**
> 
> **Exam answer (supplied key): B — 10 kHz–0.1 GHz**
> 
> According to the course lecture, the normal range of radio frequency for carrier protection is 10 kHz to 0.1 GHz. This is a specific classification used in the context of power system communication. The other options are: 30-600 kHz is power line carrier, 0.3-3 GHz is microwave, and 0.02-20 kHz is audio frequency. The recognition cue is the unit 'kHz' to 'GHz' and the specific range given in the lecture.
> 
> **Why the other options fail**
> 
> - **A:** 30–600 kHz is the power line carrier frequency range.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** 0.3–3 GHz is the microwave frequency range.
> - **D:** 0.02–20 kHz is the audio frequency range.

Source: Type2 Assignment Week 4, Question 6; Lecture 20 states the radio frequency range as 10 kHz to 0.1 GHz. Note: This is a course-specific definition.

## T2-W4-Q07

The wavelength of a signal in a fibre optic link is

A. 0.85–1.6 μm
B. 5.85–10.6 μm
C. 3–5 μm
D. 1.85–2.5 μm

> [!success]- Worked solution
> **Answer: A — 0.85–1.6 μm**
> 
> **Exam answer (supplied key): A — 0.85–1.6 μm**
> 
> The wavelength of a signal in a fiber optic link used for power system communication is typically in the range of 0.85 to 1.6 micrometers (μm). This corresponds to the near-infrared region of the electromagnetic spectrum, where optical fibers have low attenuation. The other options represent different wavelength ranges that are not standard for communication fibers. The recognition cue is the unit 'μm' and the specific range 0.85-1.6 μm.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** 5.85–10.6 μm is in the mid-infrared range, not used for standard communication.
> - **C:** 3–5 μm is also in the mid-infrared range.
> - **D:** 1.85–2.5 μm is in the short-wavelength infrared, but not the standard range.

Source: Type2 Assignment Week 4, Question 7; Lecture 20 states the fiber optic wavelength range as 0.85 to 1.6 μm.

## T2-W4-Q08

In a phase comparison scheme, during normal operating condition, both currents have a phase difference of

A. 90°
B. 180°
C. zero°
D. cannot decide

> [!warning] Source caution
> The supplied key is zero degrees, but the stem omits the current-reference convention. Through currents are 180° apart when both are defined into the protected zone and 0° when referred to a common through direction. Preserve the course key for revision; do not generalize it.

> [!success]- Worked solution
> **Answer: C — zero°**
> 
> **Exam answer (supplied key): C — zero°**
> 
> In a phase comparison scheme, the phase angle between the currents at both ends of the line is compared. During normal operating conditions or for external faults, the currents at both ends are in phase (phase difference = 0°) when both are referenced as entering the protected zone. This is the convention used in the course lecture. For internal faults, the currents are out of phase (180° difference). The recognition cue is the phrase 'during normal operating condition' and the course convention of referencing currents into the zone.
> 
> **Why the other options fail**
> 
> - **A:** 90° is not a typical phase difference for normal conditions.
> - **B:** 180° would be the case for internal faults, not normal conditions.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Cannot decide is incorrect because the phase difference is defined by the reference convention.

Source: Type2 Assignment Week 4, Question 8; Lecture 20 (Phase Comparison Scheme) states that during normal/external faults, the phase difference is 0°.

## T2-W4-Q09

Which equipment provides low impedance to the power frequency signal but high impedance to the carrier frequency signal?

A. Coupling capacitor
B. Wave trap
C. Transmitter
D. Spark gape

> [!success]- Worked solution
> **Answer: B — Wave trap**
> 
> **Exam answer (supplied key): B — Wave trap**
> 
> A wave trap (also called a line trap) is a parallel LC circuit tuned to the carrier frequency. It provides a low impedance path to the power frequency (50/60 Hz) signal, allowing it to pass to the substation equipment, while presenting a high impedance to the high-frequency carrier signal, preventing it from being short-circuited at the substation. This forces the carrier signal to travel along the transmission line. A coupling capacitor does the opposite: it provides a low impedance path to the carrier signal and a high impedance to the power frequency. The transmitter generates the carrier signal, and the spark gap is for overvoltage protection.
> 
> **Why the other options fail**
> 
> - **A:** Coupling capacitor provides low impedance to carrier frequency, not power frequency.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Transmitter generates the carrier signal, it doesn't filter frequencies.
> - **D:** Spark gap is for overvoltage protection, not frequency filtering.

Source: Type2 Assignment Week 4, Question 9; Lecture 20 describes the function of a wave trap as providing low impedance to power frequency and high impedance to carrier frequency.

## T2-W4-Q10

When the carrier signal is used to block the tripping of the relay, it is known as

A. carrier tripping scheme
B. carrier blocking scheme
C. carrier holding scheme
D. none of the above

> [!success]- Worked solution
> **Answer: B — carrier blocking scheme**
> 
> **Exam answer (supplied key): B — carrier blocking scheme**
> 
> In a carrier blocking scheme, the carrier signal is used to block the operation of the relay. For external faults, a blocking signal is transmitted from the remote end to prevent the local relay from tripping. For internal faults, no blocking signal is sent, allowing the relay to trip. In a carrier tripping scheme, the carrier signal is used to initiate tripping at the remote end. 'Carrier holding scheme' is not a standard term. The recognition cue is the phrase 'block the tripping'.
> 
> **Why the other options fail**
> 
> - **A:** Carrier tripping scheme uses the signal to initiate tripping, not block it.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Carrier holding scheme is not a standard classification.
> - **D:** None of the above is incorrect because option (b) is correct.

Source: Type2 Assignment Week 4, Question 10; Lecture 19 defines carrier blocking and tripping schemes.

