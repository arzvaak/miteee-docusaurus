---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 8 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T2-W8-Q01

What is the peak value of the power frequency overvoltage across contacts of a circuit breaker when an unloaded 400 kV transmission line is switched off?

A. 1230.94 kV
B. 461.88 kV
C. 653.19 kV
D. 1131.31 kV

> [!success]- Worked solution
> **Answer: C — 653.19 kV**
> 
> **Exam answer (supplied key): C — 653.19 kV**
> 
> An unloaded line is predominantly capacitive. At current zero the line capacitance can retain the phase-voltage peak $E_m=sqrt(2)(400/sqrt(3))=326.599$ kV. After interruption, the source voltage reverses while the line-side trapped voltage remains approximately at its original peak. The maximum difference across the open contacts is therefore $2E_m = 653.197$ kV, matching C. This is the ideal trapped-charge recovery-voltage case, not merely the source phase peak or line-to-line peak.
> 
> **Why the other options fail**
> 
> - **A:** Does not follow the ideal two-phase-peak difference.
> - **B:** Uses RMS/peak conversion incorrectly.
> - **C:** Equals twice the phase-to-earth voltage peak in the trapped-charge model.
> - **D:** Uses line-voltage scaling inconsistent with the single-pole phase model.

Source: Type2 Assignment, Week 8, Question 1

## T2-W8-Q02

Short time current rating of circuit breaker

A. is greater than the continuous current rating
B. is less than the continuous current rating
C. may be either greater or lesser than the continuous current rating
D. none of the above

> [!success]- Worked solution
> **Answer: A — is greater than the continuous current rating**
> 
> **Exam answer (supplied key): A — is greater than the continuous current rating**
> 
> The short-time current rating is the maximum fault current a breaker can carry in the closed position for a specified duration (e.g., 1-3 seconds) without damage. This current is significantly higher than the continuous current rating, which is the normal load current the breaker can carry indefinitely. The short-time rating is designed to withstand the thermal and mechanical stresses of fault currents until backup protection clears the fault. Therefore, it is always greater than the continuous current rating.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** is less than the continuous current rating: Incorrect. The short-time rating must handle fault currents, which are much larger than load currents.
> - **C:** may be either greater or lesser than the continuous current rating: Incorrect. By definition, short-time rating is for fault conditions and is higher.
> - **D:** none of the above: Incorrect, as the first option is correct.

Source: Type2 Assignment, Week 8, Question 2

## T2-W8-Q03

Pre-insertion resistor with circuit breaker is used to

A. increase the peak of restriking voltage and the rate of rise of recovery voltage (RRRV)
B. increase the peak of restriking voltage and decrease the RRRV
C. decrease the peak of restriking voltage and the RRRV
D. decrease the peak of restriking voltage and increase the RRRV

> [!warning] Source caution
> Source terminology conflates closing pre-insertion and opening resistance switching; C is the intended damping effect.

> [!success]- Worked solution
> **Answer: C — decrease the peak of restriking voltage and the RRRV**
> 
> **Exam answer (supplied key): C — decrease the peak of restriking voltage and the RRRV**
> 
> The intended answer is C: resistance switching damps the oscillatory recovery transient, reducing its peak and rate of rise. Do not equate every closing pre-insertion resistor with an opening shunt resistor: closing resistors mainly limit energization surges, while an opening resistance-switching path damps interruption transients. The assignment uses these terms loosely. For the simple shunt-R, series-L and shunt-C recovery model, critical damping occurs at $R=1/2 sqrt(L/C)$; the earlier series-RLC inequality is not applicable to that circuit.
> 
> **Why the other options fail**
> 
> - **A:** increase the peak of restriking voltage and the rate of rise of recovery voltage (RRRV): Incorrect. The resistor's purpose is to reduce, not increase, these quantities.
> - **B:** increase the peak of restriking voltage and decrease the RRRV: Incorrect. It decreases both.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** decrease the peak of restriking voltage and increase the RRRV: Incorrect. It decreases both.

Source: Type2 Assignment, Week 8, Question 3

## T2-W8-Q04

A three-phase circuit breaker is rated 800A. 2000 MVA, 33 kV. What will be its making capacity?

A. 2000 MVA
B. 3000 MVA
C. 4000 MVA
D. 5000 MVA

> [!success]- Worked solution
> **Answer: D — 5000 MVA**
> 
> **Exam answer (supplied key): D — 5000 MVA**
> 
> Making capacity is the peak current the breaker can close into, expressed in MVA. It is typically 2.5 times the symmetrical breaking capacity. Given breaking capacity = 2000 MVA, making capacity = 2.5 × 2000 = 5000 MVA. This accounts for the maximum asymmetry in the first cycle. The factor 2.55 is sometimes used, giving 5100 MVA, but 2.5 is a common simplification matching the accepted answer.
> 
> **Why the other options fail**
> 
> - **A:** 2000 MVA: This is the breaking capacity, not making capacity.
> - **B:** 3000 MVA: This is 1.5× breaking capacity, which is too low for the making factor.
> - **C:** 4000 MVA: This is 2× breaking capacity, still below the typical 2.5× factor.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment, Week 8, Question 4

## T2-W8-Q05

SF6 gas has heat transfer rate about

A. 2.5 times of air
B. 5 times of air
C. 10 times of air
D. same as air

> [!warning] Source caution
> The numerical comparison is a course convention, not a universal material constant.

> [!success]- Worked solution
> **Answer: A — 2.5 times of air**
> 
> **Exam answer (supplied key): A — 2.5 times of air**
> 
> The course’s approximate comparison is 2.5 times air, option A. Treat this as the stated textbook comparison under comparable conditions, not a universal heat-transfer coefficient independent of pressure, temperature or flow. SF₆ interruption also benefits from electron attachment and recovery of dielectric strength. Do not infer that its dielectric strength is 2.5 times oil; heat transfer and dielectric strength are different properties.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** 5 times of air: This is an overestimate; the factor is closer to 2.5.
> - **C:** 10 times of air: This is a significant overestimate.
> - **D:** same as air: Incorrect. SF6 has superior heat transfer properties.

Source: Type2 Assignment, Week 8, Question 5

## T2-W8-Q06

Which type test is performed to carry out making and breaking operation test

A. operating value test
B. contact capacity test
C. overload test
D. none of the above

> [!success]- Worked solution
> **Answer: B — contact capacity test**
> 
> **Exam answer (supplied key): B — contact capacity test**
> 
> The contact capacity test is a type test performed by the manufacturer to verify the making and breaking capability of the relay contacts under specified load conditions (typically inductive at low power factor). It ensures the contacts can handle the VA duty required to trip circuit breakers without welding or excessive wear. The operating value test checks pickup settings, and the overload test checks continuous current-carrying capacity.
> 
> **Why the other options fail**
> 
> - **A:** operating value test: This tests the pickup threshold, not contact switching capacity.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** overload test: This tests thermal capacity for continuous current, not making/breaking operations.
> - **D:** none of the above: Incorrect, as the contact capacity test is the correct answer.

Source: Type2 Assignment, Week 8, Question 6

## T2-W8-Q07

Temperature rise test is carried out for all relays

A. To check the withstand capability of insulation used in relays
B. To ensure integrity of the relay
C. To ascertain correct relay characteristic
D. None of the above

> [!success]- Worked solution
> **Answer: A — To check the withstand capability of insulation used in relays**
> 
> **Exam answer (supplied key): A — To check the withstand capability of insulation used in relays**
> 
> The temperature rise test is a type test where rated current (or 110% for voltage relays) is passed through the relay coils/contacts until thermal equilibrium is reached. The purpose is to verify that the insulation materials used in the relay can withstand the temperature rise caused by normal operating currents without degradation. This ensures the relay's insulation class is adequate for its rated conditions.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** To ensure integrity of the relay: This is too vague; the test specifically checks insulation thermal withstand.
> - **C:** To ascertain correct relay characteristic: This is done by operating value and time tests, not temperature rise.
> - **D:** None of the above: Incorrect, as the first option is correct.

Source: Type2 Assignment, Week 8, Question 7

## T2-W8-Q08

The typical value of insulation resistance is of the order of

A. 5-100 kΩ
B. 500-1000 kΩ
C. 5-50 kΩ
D. 5 MΩ

> [!warning] Source caution
> 5 MΩ is the supplied course value, not a universal acceptance criterion.

> [!success]- Worked solution
> **Answer: D — 5 MΩ**
> 
> **Exam answer (supplied key): D — 5 MΩ**
> 
> The expected order in the supplied maintenance question is megaohms, with D (5 MΩ) the only such option. Values in the listed kilohm ranges imply much higher leakage. This does not make 5 MΩ a universal healthy value or acceptance threshold: equipment instructions, test voltage, temperature, connected electronics and condition determine how insulation-resistance readings are interpreted.
> 
> **Why the other options fail**
> 
> - **A:** 5-100 kΩ: This is too low; it would indicate poor insulation.
> - **B:** 500-1000 kΩ: This is 0.5-1 MΩ, which is below the typical 5 MΩ target.
> - **C:** 5-50 kΩ: This is extremely low, indicating a near short circuit.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment, Week 8, Question 8

## T2-W8-Q09

All relay flags and semaphore indicators must be inspected

A. Daily or on every shift
B. Monthly
C. Bimonthly
D. None of the above

> [!success]- Worked solution
> **Answer: A — Daily or on every shift**
> 
> **Exam answer (supplied key): A — Daily or on every shift**
> 
> Relay flags and semaphore indicators provide visual confirmation of relay operation. According to the routine maintenance schedule, these must be inspected daily or on every shift. This ensures that any operation is promptly noted, the flag is reset, and the relay is ready for the next fault. Other tests like channel tests are bimonthly, and tripping tests are half-yearly.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Monthly: Too infrequent for operational flags.
> - **C:** Bimonthly: This is for channel tests, not daily indicators.
> - **D:** None of the above: Incorrect, as daily inspection is required.

Source: Type2 Assignment, Week 8, Question 9

## T2-W8-Q10

Primary injection test is carried out to test

A. To ensures the correct installation and operation of the protection scheme
B. To check complete sequence of tripping
C. To ascertain that the relay calibration
D. None of the above

> [!success]- Worked solution
> **Answer: A — To ensures the correct installation and operation of the protection scheme**
> 
> **Exam answer (supplied key): A — To ensures the correct installation and operation of the protection scheme**
> 
> The primary injection test involves injecting a current into the primary of the current transformer to test the entire protection scheme, including CT, relay, trip circuit, and associated wiring. It verifies correct installation and operation of the complete system, not just the relay calibration (which is done by secondary injection). The complete tripping sequence is checked in the tripping test.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** To check complete sequence of tripping: This is the purpose of the tripping test, not primary injection.
> - **C:** To ascertain that the relay calibration: This is done by secondary injection test.
> - **D:** None of the above: Incorrect, as the first option is correct.

Source: Type2 Assignment, Week 8, Question 10

