---
title: "Assignment Solutions"
math_syntax: typst
---

# Week 6 — Assignment Solutions

Try each problem before unfolding the solution. Original questions are graded against the supplied answer key. Derivation notes explain any assumptions or discrepancies.

## T1-W6-Q01

A three-phase 11 kV / 66 kV delta/star connected power transformer is protected by a differential protection scheme. The CTs on the 11 kV (delta) side have a ratio of 1500/5 A. Determine the required CT ratio on the 66 kV (star) side.

A. 250 : 5 A
B. 250 : 5√3 A
C. 125 : 5√3 A
D. none of these

> [!warning] Source caution
> Exam answer B follows the supplied key. A conventional individual-CT derivation produces the reciprocal √3 scaling; keep that as a separate convention note.

> [!success]- Worked solution
> **Answer: B — 250 : 5√3 A**
> 
> **Exam answer (supplied key): B — 250 : 5√3 A**
> 
> For exam grading, use the supplied key B: $250 : 5 sqrt(3)$ A. The transformer line currents are 1500 A on the 11 kV side and 250 A on the 66 kV side. The star-connected CTs on the delta winding give 5 A to the relay circuit. Secondary note: a conventional individual-CT current-matching derivation for delta-connected CTs gives a winding current of $5/sqrt(3)$ A so that the delta lead current is 5 A. That mathematical observation does not replace the supplied exam answer.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: C — Relay will not operate**
> 
> **Exam answer (supplied key): C — Relay will not operate**
> 
> Refer both currents to the CT secondary: $i_1 = 720/800 = 0.9$ A and $i_2 = 640/800 = 0.8$ A. With the aligned through-current convention, $I_d = |i_1 - i_2| = 0.1$ A and $I_r = (i_1 + i_2) / 2 = 0.85$ A. The slope threshold is $0.2 I_r = 0.17$ A, while minimum pickup is 0.25 A. The differential current is below both, so the relay does not operate. Compare amperes with amperes; alternatively compare $I_d / I_r$ with the dimensionless slope.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: D — 33.89%**
> 
> **Exam answer (supplied key): D — 33.89%**
> 
> Phase voltage V_ph = 13800/√3 = 7967.4 V. Relay pick-up current referred to the CT primary = 10% of 6000 A = 0.10 * 6000 = 600 A. The unprotected fraction x satisfies x * (V_ph / Z_n) = I_pickup. So, x = (I_pickup * Z_n) / V_ph = (600 * 4.5) / 7967.4 = 0.3389. Therefore, about 33.89% of the winding from the neutral end is unprotected.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: B — correct the ratio mismatch and phase-shift between the line CTs on the two sides.**
> 
> **Exam answer (supplied key): B — correct the ratio mismatch and phase-shift between the line CTs on the two sides.**
> 
> The primary purpose of an interposing CT (ICT) or tap setting in transformer differential protection is to compensate for two mismatches: (1) the magnitude mismatch due to different CT ratios on the two sides of the power transformer, and (2) the phase shift introduced by the delta-star connection of the power transformer. This ensures that under normal and external fault conditions, the currents fed to the differential relay are balanced in both magnitude and phase, preventing mal-operation.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — remains stable against mal-operation due to CT ratio mismatch and CT saturation during through faults.**
> 
> **Exam answer (supplied key): A — remains stable against mal-operation due to CT ratio mismatch and CT saturation during through faults.**
> 
> The biased (percentage) differential relay introduces a restraining current proportional to the average through current. This makes the relay's operating threshold increase with the magnitude of through current. During external (through) faults, CT saturation and mismatches can cause a spill current. In a plain differential relay, this spill current might exceed a fixed pickup and cause mal-operation. In a biased relay, the increased restraining current raises the operating threshold, ensuring stability. Options B, C, and D are incorrect; biased relays are not inherently faster, require multiple CTs, and definitely require settings.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: B — provide sensitive and high-speed protection for earth faults near the neutral end of the winding.**
> 
> **Exam answer (supplied key): B — provide sensitive and high-speed protection for earth faults near the neutral end of the winding.**
> 
> REF protection is specifically designed to provide sensitive and high-speed protection for earth faults within the transformer winding, particularly those near the neutral end where the fault current may be low. It is more sensitive than standard differential protection for earth faults because it uses a dedicated CT in the neutral connection and compares it with the residual current from the line CTs. It is not primarily for inter-turn faults (Option A), magnetizing inrush (Option C), or overvoltage (Option D).
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — second-harmonic component of the inrush current.**
> 
> **Exam answer (supplied key): A — second-harmonic component of the inrush current.**
> 
> Magnetizing inrush current contains a significant second-harmonic component (often >20% of the fundamental). Differential relays are equipped with harmonic restraint or blocking logic that detects this second harmonic. When the second harmonic content exceeds a set threshold (e.g., 15-20%), the relay is blocked from operating, preventing mal-operation for this non-fault condition. While inrush also contains DC and other harmonics, the second harmonic is the primary and most reliable feature used for restraint.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: D — incipient internal faults that slowly generate gas.**
> 
> **Exam answer (supplied key): D — incipient internal faults that slowly generate gas.**
> 
> The Buchholz relay is a gas-actuated relay placed in the pipe between the main tank and conservator tank of an oil-immersed transformer. It is specifically designed to detect incipient (minor) internal faults, such as insulation breakdown or inter-turn faults, which decompose oil and generate gas bubbles. The gas accumulates in the relay, causing an alarm (for slow gas generation) or trip (for rapid gas/oil flow). It is not designed to detect external short circuits, line faults, or busbar faults, which are outside its zone of protection.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: A — negative-sequence current relay.**
> 
> **Exam answer (supplied key): A — negative-sequence current relay.**
> 
> Single-phasing creates an unbalanced condition in the three-phase supply, which produces a negative-sequence current component. A negative-sequence current relay (ANSI device 46) is specifically designed to detect this unbalance and protect the motor from the severe overheating caused by negative-sequence currents. Zero-sequence relays detect earth faults, Buchholz relays are for transformer incipient faults, and directional overcurrent relays are for fault direction discrimination, not specifically for single-phasing.
> 
> **Why the other options fail**
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

> [!success]- Worked solution
> **Answer: C — delta, while the CTs on the delta winding are connected in star.**
> 
> **Exam answer (supplied key): C — delta, while the CTs on the delta winding are connected in star.**
> 
> To compensate for the 30° phase shift introduced by the power transformer, the CT connections are made opposite to the winding connection. For a star/delta transformer: The CTs on the star-connected winding are connected in delta. The CTs on the delta-connected winding are connected in star. This arrangement cancels out the phase shift and also filters zero-sequence currents on the star side.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; it suggests both sides use star CTs, which does not compensate phase shift.
> - **B:** Option B is incorrect; it suggests both sides use delta CTs.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect; it suggests both sides use star CTs.

Source: Type1 Assignment 6, Question 10

## T2-W6-Q01

Which relay is used to detect and protect internal fault in a transformer?

A. Thermal relay
B. Buchholz relay
C. Directional relay
D. Distance relay

> [!success]- Worked solution
> **Answer: B — Buchholz relay**
> 
> **Exam answer (supplied key): B — Buchholz relay**
> 
> The Buchholz relay is a gas-actuated relay specifically designed to detect incipient and internal faults within an oil-immersed transformer. It responds to gas generation and oil flow caused by insulation breakdown or arcing. Thermal relays protect against overloads, directional relays sense power flow direction, and distance relays are used for line protection.
> 
> **Why the other options fail**
> 
> - **A:** Option A (Thermal relay) protects against overloads, not internal faults.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C (Directional relay) is used for fault direction discrimination.
> - **D:** Option D (Distance relay) is primarily used for transmission line protection.

Source: Type2 Assignment 6, Question 1

## T2-W6-Q02

Problems associated with differential protection is/are

A. Magnetizing inrush current
B. Mismatching characteristics of CTs
C. Change of ratio as a result of tapping
D. all of the above

> [!success]- Worked solution
> **Answer: D — all of the above**
> 
> **Exam answer (supplied key): D — all of the above**
> 
> Differential protection faces several challenges: (1) Magnetizing inrush current during transformer energization can cause mal-operation if not restrained. (2) CT mismatching (non-identical saturation characteristics) creates spill current. (3) Tap changing alters the transformer ratio, causing current mismatch. All these are recognized problems that require specific countermeasures (harmonic restraint, biased characteristic, adaptive settings).
> 
> **Why the other options fail**
> 
> - **A:** Option A is a problem but not the only one.
> - **B:** Option B is a problem but not the only one.
> - **C:** Option C is a problem but not the only one.
> - **D:** Correct. The worked solution above explains why this option satisfies the question.

Source: Type2 Assignment 6, Question 2

## T2-W6-Q03

To prevent mal-operation of differentially connected relay while energizing a transformer, the relay restraining coil is biased with

A. Second harmonic current
B. Third harmonic current
C. Fifth harmonic current
D. Seventh harmonic current

> [!success]- Worked solution
> **Answer: A — Second harmonic current**
> 
> **Exam answer (supplied key): A — Second harmonic current**
> 
> Magnetizing inrush current contains a prominent second-harmonic component (typically 15-60% of the fundamental). Differential relays use second-harmonic restraint or blocking to distinguish inrush from internal faults. When the second-harmonic content exceeds a set threshold, the relay is restrained from operating.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B (Third harmonic) is not the primary harmonic used for inrush restraint.
> - **C:** Option C (Fifth harmonic) is associated with overexcitation, not inrush.
> - **D:** Option D (Seventh harmonic) is not used for inrush detection.

Source: Type2 Assignment 6, Question 3

## T2-W6-Q04

A 3-φ, 220V/11000 V transformer is connected in star/delta. It has a CT ratio of 600/5 A on 220 V side. What would be the CT ratio on 11000 V side?

A. 12:5 A
B. 12:5√3 A
C. 12:√3 A
D. None of the above

> [!warning] Source caution
> The source image prints option C as 12:√3 A; OCR had garbled it as 12:34. The supplied accepted answer is option B, 12:5√3 A.

> [!success]- Worked solution
> **Answer: B — 12:5√3 A**
> 
> **Exam answer (supplied key): B — 12:5√3 A**
> 
> Transformation ratio = 11000/220 = 50. Primary current on 11000 V side = 600/50 = 12 A. For a star/delta transformer, the CTs on the star side (220 V) are connected in delta, and the CTs on the delta side (11000 V) are connected in star. The CT secondary current on the delta-connected side (220 V) is 5√3 A. To balance, the CT ratio on the 11000 V side (star-connected CTs) should be 12:5√3 A.
> 
> **Why the other options fail**
> 
> - **A:** Option A (12:5A) ignores the √3 factor for the delta-connected CTs on the other side.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C (12:34) is numerically incorrect.
> - **D:** Option D is incorrect as option B is valid.

Source: Type2 Assignment 6, Question 4

## T2-W6-Q05

A 200 MW, 13.8 kV, 0.9 PF, 50 Hz, three-phase, Y-connected generator is protected by an earth-fault relay. The relay is set to operate at 10%. The CT ratio is 10,000/1 A. A resistor is used in the neutral circuit of the generator to limit the earth-fault current to 50% of the normal load current. Determine the value of the resistor and the percentage of stator winding unprotected.

A. 1.25 Ω and 15.34%
B. 2.47 Ω and 34.68%
C. 1.71 Ω and 21.46%
D. None of the above

> [!warning] Source caution
> Option C is intended; recomputation gives 1.714 Ω and 21.51%, rather than exactly 21.46%.

> [!success]- Worked solution
> **Answer: C — 1.71 Ω and 21.46%**
> 
> **Exam answer (supplied key): C — 1.71 Ω and 21.46%**
> 
> $I_("FL") = frac(200 times 10^6, sqrt(3) times 13800 times 0.9) = 9297.11$ A. The terminal earth-fault limit is $0.5 I_("FL") = 4648.55$ A. Hence $R_n = (13800/sqrt(3))/4648.55 = 1.71396 " " Omega$. Relay primary pickup is $0.1 times 10000 = 1000$ A. The unprotected fraction is $1000 / 4648.55 = 0.21512$, or 21.51%. Option C is the intended nearest answer; its 21.46% is a small source rounding discrepancy, not the exact computed result.
> 
> **Why the other options fail**
> 
> - **A:** Option A (1.25 Ω and 15.34%) results from incorrect current or voltage calculations.
> - **B:** Option B (2.47 Ω and 34.68%) is another miscalculation.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect as option C is close.

Source: Type2 Assignment 6, Question 5

## T2-W6-Q06

In a biased differential relay, the bias is defined as a ratio of

A. Number of turns of restraining and operating coil
B. Operating coil current and restraining coil current
C. Fault current and operating coil current
D. Fault current and restraining coil current

> [!success]- Worked solution
> **Answer: B — Operating coil current and restraining coil current**
> 
> **Exam answer (supplied key): B — Operating coil current and restraining coil current**
> 
> The bias (or slope) setting of a percentage differential relay is defined as the ratio of the operating current (difference current, I_op = |i1 - i2|) to the restraining current (average current, I_res = (i1 + i2)/2), expressed as a percentage. The relay operates when this ratio exceeds the preset bias setting. It is not a ratio of turns, fault current, etc.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; bias is not a turns ratio.
> - **B:** Correct. The worked solution above explains why this option satisfies the question.
> - **C:** Option C is incorrect; bias does not involve fault current directly.
> - **D:** Option D is incorrect; bias is not fault current to restraining current.

Source: Type2 Assignment 6, Question 6

## T2-W6-Q07

In differential protection scheme, a stabilizing resistance is required to

A. Block the relay
B. Increase the relay sensitivity
C. Reduce the effect of non-identical CTs
D. None of the above

> [!success]- Worked solution
> **Answer: C — Reduce the effect of non-identical CTs**
> 
> **Exam answer (supplied key): C — Reduce the effect of non-identical CTs**
> 
> A stabilizing resistance is connected in series with the relay coil in high-impedance differential protection schemes. Its primary purpose is to limit the spill current that flows through the relay due to non-identical CT saturation characteristics and unequal lead lengths during external faults. By increasing the total impedance in the relay branch, it reduces the current for a given voltage, helping to prevent mal-operation. However, it also reduces sensitivity for internal faults.
> 
> **Why the other options fail**
> 
> - **A:** Option A is incorrect; it does not block the relay but limits current.
> - **B:** Option B is incorrect; it reduces sensitivity, not increases it.
> - **C:** Correct. The worked solution above explains why this option satisfies the question.
> - **D:** Option D is incorrect as option C is correct.

Source: Type2 Assignment 6, Question 7

## T2-W6-Q08

A three-phase, 11 kV, 120 MW, 0.85 lagging power factor generator is protected by a circulating current differential protection scheme. The CT ratio is 7500/5 A. The CT secondary resistance is 1.5 Ω and total lead resistance is 1 Ω. The relay rated current is 5 A and its setting range is 5 — 20% of 5 A. Burden of the relay is 1 VA. Calculate the value of stabilizing resistance (Rstab) for an external fault having a magnitude of 10 pu. The relay is set at 10% of 5 A.

A. 243 Ω
B. 81 Ω
C. 162 Ω
D. None of these

> [!warning] Source caution
> B follows the lecture-specific one-third adjustment and burden-at-pickup convention. The question itself omits these assumptions, so do not generalize the factor as a universal design rule.

> [!success]- Worked solution
> **Answer: B — 81 Ω**
> 
> **Exam answer (supplied key): B — 81 Ω**
> 
> The lecture explicitly applies a one-third adjustment after calculating the high-impedance stabilizer (Week 6, High Impedance Differential Protection, printed pp. 536–538). Following that COURSE convention: $I_("FL") = frac(120 times 10^6, sqrt(3) times 11000 times 0.85) = 7409.84$ A; external secondary current $i_f = 10 I_("FL") (5/7500) = 49.399$ A. With $I_s = 0.5$ A and the lecture interpreting the 1 VA burden at pickup, $R_r = frac(1, 0.5^2) = 4 " " Omega$. Then $R_("st,calc") = frac(49.399(1.5+1), 0.5) - 4 = 242.995 " " Omega$. The lecture adjustment gives $242.995/3 = 81.00 Omega$, matching B. Without that stated lecture convention, the ordinary stability formula gives about 243 Ω (A). If the burden is specified at rated 5 A instead, $R_r = 0.04 " " Omega$. These assumptions must be stated; the one-third factor is not a general engineering design rule.
> 
> **Why the other options fail**
> 
> - **A:** Approximately the unadjusted stability-formula result, before the lecture-specific one-third factor.
> - **B:** Matches the lecture-specific one-third factor using burden at pickup.
> - **C:** Does not follow the stated lecture calculation.
> - **D:** Not the intended course answer when its extra conventions are applied.

Source: Type2 Assignment 6, Question 8

## T2-W6-Q09

The details of a 2500 HP, three-phase, 50 Hz induction motor are as follows: Rated output = 2500 HP, Power factor = 0.8 lagging, Rated voltage = 11000 V, Continuous overload = 120% of the rated current, CT ratio = 200/1 A, Setting range of thermal relay = 70-130% of 1 A in steps of 5%. The setting of a thermal overload relay is

A. 70%
B. 75%
C. 80%
D. None of the above

> [!warning] Source caution
> Efficiency is missing. A is the supplied answer under the implicit unity-efficiency assumption; exact selection is underdetermined without that assumption.

> [!success]- Worked solution
> **Answer: A — 70%**
> 
> **Exam answer (supplied key): A — 70%**
> 
> The source omits motor efficiency although horsepower is rated output. Under its implicit unity-efficiency simplification, $I=2500 times 746/(sqrt(3) times 11000 times 0.8)=122.36$ A. The allowed continuous-overload current is $1.2 I = 146.83$ A, or $146.83 / 200 = 0.7342$ A secondary (73.42%). The lecture chooses the next available thermal pickup BELOW this limit, giving 70%, option A. This downward choice is specific to protecting the stated thermal limit; instantaneous starting-current pickup instead rounds above the starting current. With actual efficiency $eta$, divide the calculated load current by $eta$, which can change the selected setting.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B (75%) is above the calculated maximum continuous overload referred to CT secondary.
> - **C:** Option C (80%) is also above the calculated value.
> - **D:** Option D is incorrect as option A is valid.

Source: Type2 Assignment 6, Question 9

## T2-W6-Q10

The setting of NPS relay is decided on the basis of

A. The ratio of negative sequence of impedance to positive sequence of impedance
B. The ratio of negative sequence of current to positive sequence of current
C. The ratio of negative sequence of voltage to positive sequence of voltage
D. All of the above

> [!warning] Source caution
> Course-specific setting rule; practical settings also require motor thermal/unbalance limits.

> [!success]- Worked solution
> **Answer: A — The ratio of negative sequence of impedance to positive sequence of impedance**
> 
> **Exam answer (supplied key): A — The ratio of negative sequence of impedance to positive sequence of impedance**
> 
> Option A reproduces the course rule: the motor-protection lecture relates the NPS setting to $Z_2/Z_1$ and illustrates selecting a setting above that ratio. This is an assignment convention, not a complete general relay-setting rule. Physically, negative-sequence current is the damaging quantity and obeys $I_2 = V_2/Z_2$; admissible heating also depends on duration and the motor limits. Do not confuse the course basis $Z_2/Z_1$ with the measured negative-sequence current or invent a universal setting from impedance ratio alone.
> 
> **Why the other options fail**
> 
> - **A:** Correct. The worked solution above explains why this option satisfies the question.
> - **B:** Option B is incorrect; the relay measures current, but the setting is based on impedance ratio.
> - **C:** Option C is incorrect; voltage ratio is not the basis for NPS relay setting.
> - **D:** Option D is incorrect as only option A is correct.

Source: Type2 Assignment 6, Question 10

