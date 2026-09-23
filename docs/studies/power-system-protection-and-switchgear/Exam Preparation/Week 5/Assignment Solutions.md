---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 5 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W5-Q01

Auto-reclosing on overhead transmission lines is justified by the statistical observation that approximately

A. 20% of line faults are transient and 80% are permanent.
B. 80% of line faults are transient (self-clearing) and only 20% are permanent.
C. all line faults are permanent.
D. no line faults are transient.

> [!success]- Worked solution
> **Answer: B — 80% of line faults are transient (self-clearing) and only 20% are permanent.**
> 
> **Exam answer (supplied key): B — 80% of line faults are transient (self-clearing) and only 20% are permanent.**
> 
> The primary justification for auto-reclosing is the high percentage of transient faults on overhead lines. Transient faults, caused by events like lightning or temporary contact, clear themselves once the line is de-energized for a short period. The industry-accepted statistic is that about 80% of faults are transient and 20% are permanent. This makes auto-reclosing a highly effective method for restoring service without manual intervention for the majority of faults.
> 
> **Why the other options fail**
> 
> - **A:** Option A reverses the typical percentages, which would make auto-reclosing far less beneficial.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; if all faults were permanent, auto-reclosing would be useless and potentially damaging.
> - **D:** Option D is incorrect; transient faults are common on overhead lines due to environmental factors.

Source: Type1 Assignment 5, Question 1; Lecture 23 (Auto-reclosing and Synchronizing-I)

## T1-W5-Q02

For high-speed auto-reclosing of EHV circuit breakers, the minimum dead time (in cycles) required for de-ionisation of the arc path is given by t = 10.5 + (kV/34.5), where kV is the system line voltage. Determine the minimum dead time, in seconds, for a 220 kV system at 50 Hz.

A. 0.21 s
B. 0.27 s
C. 0.34 s
D. 0.42 s

> [!success]- Worked solution
> **Answer: C — 0.34 s**
> 
> **Exam answer (supplied key): C — 0.34 s**
> 
> The formula gives dead time in cycles. First, calculate t in cycles: t = 10.5 + (220 / 34.5) = 10.5 + 6.3768 = 16.8768 cycles. At 50 Hz, one cycle = 1/50 = 0.02 seconds. Therefore, dead time in seconds = 16.8768 cycles * 0.02 s/cycle = 0.3375 s, which rounds to 0.34 s. This dead time ensures sufficient de-ionization of the fault path and recovery of the circuit breaker's dielectric strength before reclosing.
> 
> **Why the other options fail**
> 
> - **A:** Option A (0.21 s) would result from incorrectly using 60 Hz (1 cycle = 16.67 ms) or a calculation error.
> - **B:** Option B (0.27 s) might come from miscalculating the cycles or using an incorrect voltage.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D (0.42 s) is too long and would unnecessarily delay service restoration.

Source: Type1 Assignment 5, Question 2; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T1-W5-Q03

The main advantage of single-pole auto-reclosing on an EHV line is that it

A. is cheaper than three-pole reclosing.
B. improves transient stability by keeping the healthy phases in service.
C. eliminates the need for circuit breakers.
D. increases the system fault level.

> [!success]- Worked solution
> **Answer: B — improves transient stability by keeping the healthy phases in service.**
> 
> **Exam answer (supplied key): B — improves transient stability by keeping the healthy phases in service.**
> 
> Single-pole auto-reclosing trips and recloses only the faulted phase of a circuit breaker. The key advantage is that the two healthy phases remain in service, maintaining power transfer and synchronizing torque between system areas. This significantly improves transient stability compared to three-pole reclosing, which disconnects all phases and completely interrupts power flow on the line. The other options are incorrect: single-pole schemes are more complex and costly, they still require breakers, and they do not increase fault level.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; single-pole schemes require per-phase mechanisms and phase selection logic, making them more expensive.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; circuit breakers are essential for interrupting fault current.
> - **D:** Option D is incorrect; auto-reclosing does not affect the system fault level.

Source: Type1 Assignment 5, Question 3; Lecture 23 (Auto-reclosing and Synchronizing-I)

## T1-W5-Q04

As per the IEC standard, a circuit breaker applied with auto-reclosing must be capable of performing the following operating cycle with full rated breaking current.

A. O + 0.3 s + CO + 3 min + CO
B. CO + 0.3 s + O + 3 min + O
C. O + 3 min + CO + 0.3 s + CO
D. O + O + O + 1 hour + O

> [!success]- Worked solution
> **Answer: A — O + 0.3 s + CO + 3 min + CO**
> 
> **Exam answer (supplied key): A — O + 0.3 s + CO + 3 min + CO**
> 
> The IEC standard defines the required operating duty for circuit breakers used with auto-reclosing. The sequence is: Open (O) to clear the fault, a 0.3-second delay (dead time for the first reclosing attempt), Close-Open (CO) for the first reclosing and subsequent trip if the fault is permanent, a 3-minute delay (reclaim time), and a final Close-Open (CO) for a second reclosing attempt. This cycle tests the breaker's ability to withstand the thermal and mechanical stresses of multiple operations in quick succession.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B incorrectly starts with CO and has the wrong time delays.
> - **C:** Option C has the time delays in the wrong order.
> - **D:** Option D is not a standard auto-reclosing cycle and includes an impractically long delay.

Source: Type1 Assignment 5, Question 4; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T1-W5-Q05

Auto-reclosing is generally not employed on underground cable feeders because cable faults are usually

A. transient in nature.
B. self-clearing.
C. permanent in nature.
D. of very low magnitude.

> [!success]- Worked solution
> **Answer: C — permanent in nature.**
> 
> **Exam answer (supplied key): C — permanent in nature.**
> 
> Underground cable faults are predominantly permanent, caused by insulation breakdown, mechanical damage, or water ingress. Unlike overhead lines where faults are often transient (e.g., lightning flashover), a cable fault will persist after de-energization. Therefore, auto-reclosing would be ineffective and could cause additional stress on the cable and system by re-energizing into a permanent fault. The other options describe characteristics of transient faults, which are rare in cables.
> 
> **Why the other options fail**
> 
> - **A:** Option A describes overhead line faults, not typical cable faults.
> - **B:** Option B is synonymous with transient faults, which are uncommon in cables.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect; cable fault currents can be very high, similar to overhead lines.

Source: Type1 Assignment 5, Question 5; Lecture 23 (Auto-reclosing and Synchronizing-I)

## T1-W5-Q06

In a recloser–fuse coordination scheme, the recloser is set to operate first on its fast curve so that

A. the lateral fuse always blows first.
B. transient faults are cleared before the lateral fuse is damaged.
C. the recloser locks out immediately.
D. the load current is interrupted.

> [!success]- Worked solution
> **Answer: B — transient faults are cleared before the lateral fuse is damaged.**
> 
> **Exam answer (supplied key): B — transient faults are cleared before the lateral fuse is damaged.**
> 
> This is the 'fuse saving' philosophy used in distribution systems. The recloser's fast curve is set to operate below the fuse's minimum melting time. For a fault (which is initially assumed to be transient), the recloser trips quickly, de-energizing the line and allowing the fault to clear. It then recloses. If the fault was transient, service is restored without the fuse blowing. If the fault is permanent, the recloser will trip again (on a slower curve), allowing the fuse to blow and isolate only the faulted lateral, minimizing the outage area.
> 
> **Why the other options fail**
> 
> - **A:** Option A is the opposite of the fuse saving principle.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C describes the final action for a permanent fault, not the purpose of the fast curve.
> - **D:** Option D is incorrect; the recloser interrupts fault current, not normal load current.

Source: Type1 Assignment 5, Question 6; Lecture 25 (Auto-reclosing and Synchronizing-III)

## T1-W5-Q07

Compared with a permissive transfer-trip scheme, the carrier-blocking scheme has the disadvantage that

A. a deliberate coordination time delay must be allowed to wait for a possible blocking signal.
B. it operates faster than necessary.
C. it requires no relays.
D. it cannot detect external faults.

> [!success]- Worked solution
> **Answer: A — a deliberate coordination time delay must be allowed to wait for a possible blocking signal.**
> 
> **Exam answer (supplied key): A — a deliberate coordination time delay must be allowed to wait for a possible blocking signal.**
> 
> In a carrier-blocking scheme, the local distance relay must wait for a short coordination time to see if a blocking signal arrives from the remote end before it can trip for a fault in its overreach zone. This delay is necessary to prevent maloperation for external faults but compromises the high-speed operation desired for internal faults. Permissive transfer-trip schemes use the carrier signal to *initiate* tripping and do not require this coordination delay, allowing for faster overall operation.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; the coordination delay makes it slower, not faster.
> - **C:** Option C is incorrect; all protection schemes require relays.
> - **D:** Option D is incorrect; the scheme is designed to discriminate external faults using the blocking signal.

Source: Type1 Assignment 5, Question 7; Lecture 21 (Carrier Aided Schemes for Transmission Lines-III)

## T1-W5-Q08

The dead time of an auto-reclosing relay (ARR) must always be set

A. less than the dead time of the circuit breaker.
B. greater than the dead time of the circuit breaker.
C. equal to the reclaim time.
D. equal to zero.

> [!success]- Worked solution
> **Answer: B — greater than the dead time of the circuit breaker.**
> 
> **Exam answer (supplied key): B — greater than the dead time of the circuit breaker.**
> 
> The dead time of the circuit breaker (its de-ionization time) is the minimum time needed for the arc path to recover its dielectric strength after current interruption. The dead time of the ARR is the time from fault clearance until it issues a closing command. The ARR dead time must be greater than the breaker's de-ionization time to ensure the breaker is ready to reclose safely. If the ARR dead time were shorter, it could command reclosing before the breaker medium has recovered, risking arc restrike.
> 
> **Why the other options fail**
> 
> - **A:** Option A is dangerous; it could lead to reclosing into a still-ionized path.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; reclaim time is the interval between reclosing attempts, not related to the initial dead time setting.
> - **D:** Option D is incorrect; a zero dead time would not allow for de-ionization.

Source: Type1 Assignment 5, Question 8; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T1-W5-Q09

The reclaim time of an auto-reclosing scheme is best defined as the

A. time between energisation of the closing circuit and contact closure.
B. de-ionisation time of the fault arc.
C. arcing time of the circuit breaker.
D. time interval between two successive (adjacent) reclosing attempts.

> [!success]- Worked solution
> **Answer: D — time interval between two successive (adjacent) reclosing attempts.**
> 
> **Exam answer (supplied key): D — time interval between two successive (adjacent) reclosing attempts.**
> 
> Reclaim time is a critical setting in multi-shot auto-reclosing schemes. It is the time interval that must elapse after a reclosing attempt (whether successful or not) before the ARR is ready to initiate another reclosing sequence. This time allows the circuit breaker to complete its operating duty and ensures that any fault from the previous attempt has fully cleared. If a new fault occurs before the reclaim time expires, the ARR should lock out to prevent excessive stress on the breaker.
> 
> **Why the other options fail**
> 
> - **A:** Option A describes the breaker closing time, not reclaim time.
> - **B:** Option B is the de-ionization time, which is part of the dead time.
> - **C:** Option C is the time current flows during contact separation, unrelated to reclaim time.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type1 Assignment 5, Question 9; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T1-W5-Q10

For EHV/UHV lines protected by distance relays, the auto-reclosing relay is normally permitted to operate only for faults detected in

A. Zone-1
B. Zone-2
C. Zone-3
D. all zones equally

> [!success]- Worked solution
> **Answer: A — Zone-1**
> 
> **Exam answer (supplied key): A — Zone-1**
> 
> Auto-reclosing is typically restricted to Zone-1 faults for EHV/UHV lines. Zone-1 is instantaneous and covers about 80% of the line. For faults in this zone, both line-end breakers trip simultaneously via Zone-1 operation, providing a clean de-energization. For Zone-2 or Zone-3 faults, one end trips instantaneously (Zone-1), while the other trips after a time delay (Zone-2/3). This non-simultaneous clearing can lead to insufficient de-ionization time at the delayed end, increasing the risk of arc restrike and system instability upon reclosing.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; Zone-2 faults involve a time delay, making simultaneous clearing and safe reclosing difficult.
> - **C:** Option C is incorrect for the same reason as Zone-2.
> - **D:** Option D is incorrect; applying reclosing to delayed zones is not standard practice for EHV/UHV lines.

Source: Type1 Assignment 5, Question 10; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T2-W5-Q01

Carrier blocking scheme use an additional time delay or coordination time to avoid maloperation

A. during external fault
B. during power swing
C. due to transients
D. during symmetrical fault

> [!success]- Worked solution
> **Answer: A — during external fault**
> 
> **Exam answer (supplied key): A — during external fault**
> 
> In a carrier-blocking scheme, the local distance relay's Zone-2 or Zone-3 element may operate for a fault just beyond the remote bus (an external fault). To prevent this maloperation, a coordination time delay is introduced. The local relay waits for this delay to see if a blocking signal arrives from the remote end's reverse-looking relay. If the signal arrives, the local relay is blocked. This coordination is specifically to ensure correct discrimination for external faults.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; power swing blocking is a separate function.
> - **C:** Option C is too vague; the delay is for fault discrimination, not general transients.
> - **D:** Option D is incorrect; the scheme discriminates based on fault location, not fault type.

Source: Type2 Assignment 5, Question 1; Lecture 21 (Carrier Aided Schemes for Transmission Lines-III)

## T2-W5-Q02

The main disadvantage of direct underreach transfer scheme is

A. its higher cost
B. its higher time of operation
C. its mal-operation due to noise by switching
D. its incapability for simultaneous tripping of both end relay

> [!success]- Worked solution
> **Answer: C — its mal-operation due to noise by switching**
> 
> **Exam answer (supplied key): C — its mal-operation due to noise by switching**
> 
> The direct underreach transfer trip scheme uses a receiver relay contact that closes directly to initiate tripping when a carrier signal is received. This contact is susceptible to inadvertent closure due to electrical noise from switching surges or transients in the substation. Such a closure would cause an unwanted trip (maloperation). This is the primary security disadvantage, which is mitigated in the permissive underreach scheme by adding a local fault detector contact in series.
> 
> **Why the other options fail**
> 
> - **A:** Option A is not the main disadvantage; cost is a factor but not the primary operational drawback.
> - **B:** Option B is incorrect; the scheme is designed for high-speed operation.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect; the scheme is capable of simultaneous tripping for internal faults.

Source: Type2 Assignment 5, Question 2; Lecture 22 (Carrier Aided Schemes for Transmission Lines-IV)

## T2-W5-Q03

Direct underreach transfer tripping scheme is not suitable for

A. single-phase auto-reclosing
B. three-phase auto-reclosing
C. single-shot auto-reclosing
D. multi-shot auto-reclosing

> [!success]- Worked solution
> **Answer: A — single-phase auto-reclosing**
> 
> **Exam answer (supplied key): A — single-phase auto-reclosing**
> 
> The direct underreach transfer trip scheme requires phase selection logic at each bus to determine which phase is faulted for single-phase tripping and reclosing. Implementing this logic adds complexity and cost. Furthermore, the scheme's susceptibility to noise-induced maloperation is a greater concern when only one phase is being controlled. Therefore, it is generally considered unsuitable for single-phase auto-reclosing applications, where more secure schemes like permissive underreach or overreach are preferred.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; three-phase schemes are simpler and more compatible.
> - **C:** Option C is incorrect; the number of shots (single vs. multi) is not the primary incompatibility.
> - **D:** Option D is incorrect for the same reason as Option C.

Source: Type2 Assignment 5, Question 3; Lecture 22 (Carrier Aided Schemes for Transmission Lines-IV)

## T2-W5-Q04

Number of pilot wires required for protecting 3-phase transmission lines

A. 4
B. 3
C. 2
D. 1

> [!success]- Worked solution
> **Answer: C — 2**
> 
> **Exam answer (supplied key): C — 2**
> 
> For a basic phase comparison or directional comparison pilot wire scheme protecting a 3-phase line, two pilot wires are typically required. One wire is used for communication in each direction (e.g., one for sending, one for receiving). While more complex schemes might use more wires or multiplexed channels, the fundamental requirement for a bidirectional communication link is two conductors.
> 
> **Why the other options fail**
> 
> - **A:** Option A (4) might be confused with the number of conductors in a 3-phase + neutral system.
> - **B:** Option B (3) might be mistakenly associated with the three phases.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D (1) is insufficient for bidirectional communication without frequency division.

Source: Type2 Assignment 5, Question 4; Lecture 21 (Carrier Aided Schemes for Transmission Lines-III)

## T2-W5-Q05

Wave trap is used to trap waves of

A. power frequency
B. higher frequencies
C. only specific high-frequency
D. low frequencies

> [!success]- Worked solution
> **Answer: B — higher frequencies**
> 
> **Exam answer (supplied key): B — higher frequencies**
> 
> A wave trap (line trap) is a parallel LC circuit tuned to the carrier frequency used for communication. It presents a high impedance to the high-frequency carrier signals, preventing them from entering the substation equipment and forcing them onto the transmission line. It presents a very low impedance to the power frequency (50/60 Hz), allowing normal power flow. Therefore, it 'traps' the higher frequency communication signals on the line.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; the wave trap must not impede power frequency current.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is too restrictive; it traps the entire band of carrier frequencies used, not just one specific frequency.
> - **D:** Option D is incorrect; low frequencies (like power frequency) pass through easily.

Source: Type2 Assignment 5, Question 5; Lecture 21 (Carrier Aided Schemes for Transmission Lines-III)

## T2-W5-Q06

Operating time of Permissive under-reach transfer trip scheme is compared to direct under-reach transfer trip scheme

A. low
B. high
C. depends on the fault type
D. depends on the location of fault

> [!success]- Worked solution
> **Answer: B — high**
> 
> **Exam answer (supplied key): B — high**
> 
> The permissive underreach transfer trip scheme adds a local fault detector contact in series with the receiver relay contact for security. This adds a small amount of time for the local fault detector to operate and its contact to close. Therefore, its total operating time for a fault in the end zone is slightly higher (slower) than the direct underreach scheme, which has no such series contact. The trade-off is significantly improved security against noise-induced maloperation.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; the added contact makes it slower, not faster.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; the relative speed is a design characteristic, not dependent on fault type.
> - **D:** Option D is incorrect; the relative speed is consistent for faults in the end zones.

Source: Type2 Assignment 5, Question 6; Lecture 22 (Carrier Aided Schemes for Transmission Lines-IV)

## T2-W5-Q07

For EHV/UHV lines protected by distance relays, reclosing relay is activated

A. only for fault in first zone
B. only for fault in second zone
C. for fault in first and second zone
D. for fault in second and third zone

> [!success]- Worked solution
> **Answer: A — only for fault in first zone**
> 
> **Exam answer (supplied key): A — only for fault in first zone**
> 
> As per standard practice for EHV/UHV lines, the auto-reclosing relay is activated only for faults detected in Zone-1 of the distance relays. Zone-1 provides instantaneous, simultaneous tripping at both line ends, which is essential for a clean de-energization and safe reclosing. Faults in Zone-2 or Zone-3 involve time-delayed tripping at one end, which can lead to insufficient de-ionization time and system instability if reclosing is attempted.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; Zone-2 faults are not reclosed.
> - **C:** Option C is incorrect; including Zone-2 is not standard for EHV/UHV lines.
> - **D:** Option D is incorrect; Zone-3 faults are definitely not reclosed.

Source: Type2 Assignment 5, Question 7; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T2-W5-Q08

Dead time of auto-reclosing must be always dead time of circuit breaker

A. greater than
B. lesser than
C. same as
D. depends on the system configuration

> [!warning] Source caution
> The question stem is slightly ambiguous ('dead time of auto-reclosing must be always dead time of circuit breaker' is grammatically incomplete). The intended meaning is the relationship between the two dead times.

> [!success]- Worked solution
> **Answer: A — greater than**
> 
> **Exam answer (supplied key): A — greater than**
> 
> The dead time of the auto-reclosing relay (ARR) is the time from fault clearance until it issues a reclosing command. The dead time of the circuit breaker is its de-ionization time—the minimum time needed for the arc path to recover dielectric strength. For safe reclosing, the ARR dead time must be **greater than** the breaker's de-ionization time. This ensures the breaker is fully ready before the closing command is issued.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is dangerous; it could command reclosing before the breaker medium has recovered.
> - **C:** Option C is incorrect; they are different parameters and the ARR time must be longer.
> - **D:** Option D is incorrect; the 'greater than' relationship is a fundamental safety requirement.

Source: Type2 Assignment 5, Question 8; Lecture 24 (Auto-reclosing and Synchronizing-II)

## T2-W5-Q09

The role of synchronism check relay comes in picture during the

A. closing operation of auto-recloser
B. opening operation of auto-recloser
C. during transformer energization
D. all of above

> [!success]- Worked solution
> **Answer: A — closing operation of auto-recloser**
> 
> **Exam answer (supplied key): A — closing operation of auto-recloser**
> 
> The synchronism check relay (or element) is a critical component of an auto-reclosing scheme. Its function is to verify that the voltage magnitude and phase angle across the open circuit breaker contacts are within acceptable limits *before* the reclosing command is executed. This ensures that closing the breaker will not cause a large transient shock to the system, which could lead to loss of synchronism or equipment damage. It is active only during the closing operation.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; the relay checks conditions before closing, not during opening.
> - **C:** Option C is incorrect; while similar checks are used for transformer energization, its role here is specific to auto-reclosing.
> - **D:** Option D is incorrect; its role is specific to the closing operation.

Source: Type2 Assignment 5, Question 9; Lecture 25 (Auto-reclosing and Synchronizing-III)

## T2-W5-Q10

Synchronism check relay circuit breaker contacts during of auto-recloser

A. ensures the minimum voltage across, close operation
B. ensures zero current through, close operation
C. ensures the minimum voltage across, open operation
D. ensures zero current through, open operation

> [!warning] Source caution
> The question stem is grammatically awkward ('during of auto-recloser'). The intended meaning is the function of the relay during the auto-recloser's operation.

> [!success]- Worked solution
> **Answer: A — ensures the minimum voltage across, close operation**
> 
> **Exam answer (supplied key): A — ensures the minimum voltage across, close operation**
> 
> The synchronism check relay's primary function is to ensure that the voltage difference (both magnitude and phase angle) across the circuit breaker contacts is within a safe, minimum threshold *before* the close command is issued. It does not check for zero current (current is zero when the breaker is open). Its purpose is to prevent closing into a large voltage mismatch, which would cause a damaging transient. Therefore, it ensures minimum voltage across the contacts for a safe close operation.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; current is zero when the breaker is open, so this is not a check.
> - **C:** Option C is incorrect; the check is performed before closing, not during the open state.
> - **D:** Option D is incorrect for the same reason as Option B.

Source: Type2 Assignment 5, Question 10; Lecture 25 (Auto-reclosing and Synchronizing-III)

