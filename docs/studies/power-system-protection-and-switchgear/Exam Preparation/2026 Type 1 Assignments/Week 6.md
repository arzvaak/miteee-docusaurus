---
title: "Week 6"
math_syntax: typst
---

# 2026 Type 1 — Week 6

[2026 Type 1 index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-2026-type-1-assignments-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

**Supplied source:** [Assignment_Week-6.pdf](/content-assets/studies/power-system-protection-and-switchgear/Exam%20Preparation/2026%20Type%201%20Assignments/Supplied%20PDFs/Assignment_Week-6.pdf)

These are the supplied 2026 Type 1 questions in original order. The supplied answer key is authoritative for exam grading. Open each worked solution only after attempting the question.

## T1-W6-Q01

A three-phase 11 kV / 66 kV delta/star connected power transformer is protected by a differential protection scheme. The CTs on the 11 kV (delta) side have a ratio of 1500/5 A. Determine the required CT ratio on the 66 kV (star) side.

A. 250 : 5 A
B. 250 : 5√3 A
C. 125 : 5√3 A
D. none of these

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — 250 : 5√3 A**
>
> **Exam answer (supplied key): B — 250 : 5√3 A**
>
> For exam grading, use the supplied key B: $250 : 5 sqrt(3)$ A. The transformer line currents are 1500 A on the 11 kV side and 250 A on the 66 kV side. The star-connected CTs on the delta winding give 5 A to the relay circuit. Secondary note: a conventional individual-CT current-matching derivation for delta-connected CTs gives a winding current of $5/sqrt(3)$ A so that the delta lead current is 5 A. That mathematical observation does not replace the supplied exam answer.
>
> **Source caution:** Exam answer B follows the supplied key. A conventional individual-CT derivation produces the reciprocal √3 scaling; keep that as a separate convention note.
>
> **Why each option is right or wrong**
>
> - **A:** Ignores the delta CT line-current multiplier.
> - **B:** This is the supplied keyed option and therefore the exam answer for this assignment.
> - **C:** Both the primary value and secondary scaling fail to balance the relay currents.
> - **D:** This reflects the conventional individual-CT derivation noted separately, but it is not the supplied exam key.

Source: Type1 Assignment 6, Question 1

## T1-W6-Q02

A percentage-biased differential relay protecting a generator has a pick-up current of 0.25 A, a bias slope of 20%, and a CT ratio of 800/1 A. During a through (external) fault, the currents in CT1 and CT2 are 720 A and 640 A, respectively. State whether the relay will operate or not.

A. Relay will operate
B. Relay is on the verge of operation
C. Relay will not operate
D. Data is insufficient

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — Relay will not operate**
>
> **Exam answer (supplied key): C — Relay will not operate**
>
> Refer both currents to the CT secondary: $i_1 = 720/800 = 0.9$ A and $i_2 = 640/800 = 0.8$ A. With the aligned through-current convention, $I_d = |i_1 - i_2| = 0.1$ A and $I_r = (i_1 + i_2) / 2 = 0.85$ A. The slope threshold is $0.2 I_r = 0.17$ A, while minimum pickup is 0.25 A. The differential current is below both, so the relay does not operate. Compare amperes with amperes; alternatively compare $I_d / I_r$ with the dimensionless slope.
>
> **Why each option is right or wrong**
>
> - **A:** Option A is wrong because the operating current is below both settings.
> - **B:** Option B is wrong because the operating current is below the bias threshold.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is wrong as all necessary data is provided.

Source: Type1 Assignment 6, Question 2

## T1-W6-Q03

A 13.8 kV star-connected synchronous generator is grounded through a neutral resistance of 4.5 Ω. The earth-fault relay is fed by a CT of ratio 6000/5 A and is set to pick up at 10% of its rated current. Determine the percentage of the stator winding, measured from the neutral end, that remains unprotected.

A. 28.74%
B. 23.45%
C. 39.12%
D. 33.89%

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — 33.89%**
>
> **Exam answer (supplied key): D — 33.89%**
>
> Phase voltage V_ph = 13800/√3 = 7967.4 V. Relay pick-up current referred to the CT primary = 10% of 6000 A = 0.10 * 6000 = 600 A. The unprotected fraction x satisfies x * (V_ph / Z_n) = I_pickup. So, x = (I_pickup * Z_n) / V_ph = (600 * 4.5) / 7967.4 = 0.3389. Therefore, about 33.89% of the winding from the neutral end is unprotected.
>
> **Why each option is right or wrong**
>
> - **A:** Option A (28.74%) might result from using line voltage instead of phase voltage.
> - **B:** Option B (23.45%) could be a miscalculation of the relay pickup.
> - **C:** Option C (39.12%) is another possible arithmetic error.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type1 Assignment 6, Question 3

## T1-W6-Q04

In transformer differential protection, an interposing CT (or tap setting) is primarily used to

A. increase the fault current.
B. correct the ratio mismatch and phase-shift between the line CTs on the two sides.
C. provide earth-fault protection only.
D. replace the Buchholz relay.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — correct the ratio mismatch and phase-shift between the line CTs on the two sides.**
>
> **Exam answer (supplied key): B — correct the ratio mismatch and phase-shift between the line CTs on the two sides.**
>
> The primary purpose of an interposing CT (ICT) or tap setting in transformer differential protection is to compensate for two mismatches: (1) the magnitude mismatch due to different CT ratios on the two sides of the power transformer, and (2) the phase shift introduced by the delta-star connection of the power transformer. This ensures that under normal and external fault conditions, the currents fed to the differential relay are balanced in both magnitude and phase, preventing mal-operation.
>
> **Why each option is right or wrong**
>
> - **A:** Option A is incorrect; ICTs do not increase fault current.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; ICTs are for phase and magnitude compensation, not specifically for earth-fault protection.
> - **D:** Option D is incorrect; the Buchholz relay is a separate gas-actuated device for incipient faults.

Source: Type1 Assignment 6, Question 4

## T1-W6-Q05

The percentage (biased) differential relay is preferred over a plain (Merz-Price) differential relay because it

A. remains stable against mal-operation due to CT ratio mismatch and CT saturation during through faults.
B. operates faster for all faults.
C. needs only one current transformer.
D. does not require any setting.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — remains stable against mal-operation due to CT ratio mismatch and CT saturation during through faults.**
>
> **Exam answer (supplied key): A — remains stable against mal-operation due to CT ratio mismatch and CT saturation during through faults.**
>
> The biased (percentage) differential relay introduces a restraining current proportional to the average through current. This makes the relay's operating threshold increase with the magnitude of through current. During external (through) faults, CT saturation and mismatches can cause a spill current. In a plain differential relay, this spill current might exceed a fixed pickup and cause mal-operation. In a biased relay, the increased restraining current raises the operating threshold, ensuring stability. Options B, C, and D are incorrect; biased relays are not inherently faster, require multiple CTs, and definitely require settings.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; operating speed is not the primary advantage.
> - **C:** Option C is incorrect; differential protection requires CTs on both sides.
> - **D:** Option D is incorrect; biased relays require both pickup and bias settings.

Source: Type1 Assignment 6, Question 5

## T1-W6-Q06

Restricted earth-fault (REF) protection is applied to a transformer winding mainly to

A. protect against inter-turn faults only.
B. provide sensitive and high-speed protection for earth faults near the neutral end of the winding.
C. detect magnetizing inrush.
D. protect against overvoltage.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): B — provide sensitive and high-speed protection for earth faults near the neutral end of the winding.**
>
> **Exam answer (supplied key): B — provide sensitive and high-speed protection for earth faults near the neutral end of the winding.**
>
> REF protection is specifically designed to provide sensitive and high-speed protection for earth faults within the transformer winding, particularly those near the neutral end where the fault current may be low. It is more sensitive than standard differential protection for earth faults because it uses a dedicated CT in the neutral connection and compares it with the residual current from the line CTs. It is not primarily for inter-turn faults (Option A), magnetizing inrush (Option C), or overvoltage (Option D).
>
> **Why each option is right or wrong**
>
> - **A:** Option A is incorrect; inter-turn faults are better detected by other means like Buchholz or specialized relays.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; inrush is detected by harmonic restraint in differential relays.
> - **D:** Option D is incorrect; overvoltage is handled by separate protection schemes.

Source: Type1 Assignment 6, Question 6

## T1-W6-Q07

Transformer differential protection is restrained from mal-operating during magnetising inrush by detecting the

A. second-harmonic component of the inrush current.
B. negative-sequence current component.
C. zero-sequence current component.
D. DC component only.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — second-harmonic component of the inrush current.**
>
> **Exam answer (supplied key): A — second-harmonic component of the inrush current.**
>
> Magnetizing inrush current contains a significant second-harmonic component (often >20% of the fundamental). Differential relays are equipped with harmonic restraint or blocking logic that detects this second harmonic. When the second harmonic content exceeds a set threshold (e.g., 15-20%), the relay is blocked from operating, preventing mal-operation for this non-fault condition. While inrush also contains DC and other harmonics, the second harmonic is the primary and most reliable feature used for restraint.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; negative-sequence current is associated with unbalanced faults, not inrush.
> - **C:** Option C is incorrect; zero-sequence current is associated with earth faults.
> - **D:** Option D is incorrect; while DC is present, second harmonic is the standard restraint feature.

Source: Type1 Assignment 6, Question 7

## T1-W6-Q08

The Buchholz relay used in transformer protection is capable of detecting

A. external short circuits.
B. overhead-line faults.
C. busbar faults.
D. incipient internal faults that slowly generate gas.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): D — incipient internal faults that slowly generate gas.**
>
> **Exam answer (supplied key): D — incipient internal faults that slowly generate gas.**
>
> The Buchholz relay is a gas-actuated relay placed in the pipe between the main tank and conservator tank of an oil-immersed transformer. It is specifically designed to detect incipient (minor) internal faults, such as insulation breakdown or inter-turn faults, which decompose oil and generate gas bubbles. The gas accumulates in the relay, causing an alarm (for slow gas generation) or trip (for rapid gas/oil flow). It is not designed to detect external short circuits, line faults, or busbar faults, which are outside its zone of protection.
>
> **Why each option is right or wrong**
>
> - **A:** Option A is incorrect; external faults are outside the Buchholz relay's zone.
> - **B:** Option B is incorrect; overhead-line faults are not detected by a transformer-mounted relay.
> - **C:** Option C is incorrect; busbar faults are not within the transformer's protection zone.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type1 Assignment 6, Question 8

## T1-W6-Q09

A three-phase induction motor is most commonly protected against single-phasing (loss of one supply phase) by means of a

A. negative-sequence current relay.
B. zero-sequence current relay.
C. Buchholz relay.
D. directional overcurrent relay.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): A — negative-sequence current relay.**
>
> **Exam answer (supplied key): A — negative-sequence current relay.**
>
> Single-phasing creates an unbalanced condition in the three-phase supply, which produces a negative-sequence current component. A negative-sequence current relay (ANSI device 46) is specifically designed to detect this unbalance and protect the motor from the severe overheating caused by negative-sequence currents. Zero-sequence relays detect earth faults, Buchholz relays are for transformer incipient faults, and directional overcurrent relays are for fault direction discrimination, not specifically for single-phasing.
>
> **Why each option is right or wrong**
>
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; zero-sequence relays detect earth faults, not phase unbalance.
> - **C:** Option C is incorrect; Buchholz relays are for transformers, not motors.
> - **D:** Option D is incorrect; directional overcurrent relays are not the primary protection for single-phasing.

Source: Type1 Assignment 6, Question 9

## T1-W6-Q10

In the differential protection of a star/delta power transformer, the current transformers are connected such that the CTs on the star-connected winding are connected in

A. star and the CTs on the delta winding in star.
B. delta and the CTs on the delta winding in delta.
C. delta, while the CTs on the delta winding are connected in star.
D. star, while the CTs on the delta winding are connected in star.

> [!success]- Supplied-key answer and worked solution
> **Exam answer (supplied key): C — delta, while the CTs on the delta winding are connected in star.**
>
> **Exam answer (supplied key): C — delta, while the CTs on the delta winding are connected in star.**
>
> To compensate for the 30° phase shift introduced by the power transformer, the CT connections are made opposite to the winding connection. For a star/delta transformer: The CTs on the star-connected winding are connected in delta. The CTs on the delta-connected winding are connected in star. This arrangement cancels out the phase shift and also filters zero-sequence currents on the star side.
>
> **Why each option is right or wrong**
>
> - **A:** Option A is incorrect; it suggests both sides use star CTs, which does not compensate phase shift.
> - **B:** Option B is incorrect; it suggests both sides use delta CTs.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect; it suggests both sides use star CTs.

Source: Type1 Assignment 6, Question 10
