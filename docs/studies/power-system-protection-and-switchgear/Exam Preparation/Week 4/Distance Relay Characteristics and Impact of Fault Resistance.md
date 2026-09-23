---
title: "Distance Relay Characteristics and Impact of Fault Resistance"
math_syntax: typst
---

# Distance Relay Characteristics and Impact of Fault Resistance

[Week 4 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Distance Relay Characteristics and Impact of Fault Resistance

## 1. Core Principle: What a Distance Relay Measures

A distance relay operates by measuring the **impedance** from its installation point to a fault. It compares this measured impedance to a pre-set value (its "reach"). If the measured impedance is less than the set value, the fault is within its zone, and the relay operates. The fundamental quantity is impedance, not voltage or current alone.

The relay receives voltage and current inputs. For a **phase distance relay** (protecting against phase faults like L-L or L-L-L), the inputs are typically a line-to-line voltage and the difference of the corresponding phase currents (e.g., $V_("RY")$ and $I_R - I_Y$). For a **ground distance relay** (protecting against L-G or L-L-G faults), the inputs are a phase voltage and a compensated phase current (e.g., $V_R$ and $I_R + k I_0$). This compensation ensures the relay measures the correct positive-sequence impedance to the fault for all fault types.

## 2. Relay Characteristics on the R-X Plane

The operating boundary of a distance relay is plotted on an R-X (Resistance-Reactance) diagram. The shape of this characteristic determines its tolerance to fault resistance ($R_F$).

*   **Reactance Relay:** Characteristic is a horizontal line at $X = X_("set")$. It is **immune to fault resistance** because $R_F$ only adds to the resistive (R) component. However, it is highly susceptible to power swings and overloading.
*   **Impedance Relay:** Characteristic is a circle centered at the origin with radius $Z_("set")$. It is **significantly affected by fault resistance**. $R_F$ pushes the measured impedance point to the right, often outside the circle, causing **underreach**.
*   **Mho (Admittance) Relay:** Characteristic is a circle passing through the origin, with its diameter $Z_("set")$ at the relay's maximum torque angle. It offers **better fault resistance tolerance** than the impedance relay but still underreaches for large $R_F$.
*   **Quadrilateral Relay:** A four-sided characteristic. It provides the **best coverage for fault resistance** as its resistive reach can be set independently of its reactive reach.

**Recognition Cue:** On an R-X diagram, a fault with resistance $R_F$ shifts the measured impedance point horizontally to the right from the fault's location on the line impedance vector.

## 3. Impact of Fault Resistance with Remote Infeed

The true impedance from relay A to a fault at F is $Z_("AF") + R_F$. However, when a remote source at bus B also feeds fault current ($I_B$), the relay at A sees an **apparent impedance**:

$$
Z_("measured") = Z_("AF") + R_F (1 + frac(I_B, I_A))
$$

The term $R_F dot (I_B/I_A)$ is the error. Since $I_A$ and $I_B$ are generally not in phase, this term has both real and imaginary components.

*   **Pre-fault power flow A → B:** $I_B$ tends to lead $I_A$. The imaginary part of the error is negative, **reducing the measured reactance**. This can cause **overreach** (relay operates for a fault outside its zone).
*   **Pre-fault power flow B → A:** $I_B$ tends to lag $I_A$. The imaginary part of the error is positive, **increasing the measured reactance**. This causes **underreach** (relay fails to operate for a fault inside its zone).

**Critical Trap:** Fault resistance does not only add a resistive component; it can distort the reactive component based on power flow direction.

## 4. Worked Example: Apparent Impedance Calculation

**Source:** Type2 Assignment Week 4, Question 2 (T2-W4-Q02).

**Problem:** A transmission line is fed from local end A and remote end B. The impedance from relaying point A to fault point F is $Z_("AF") = 3.5 + j 10.5 Omega$. Fault resistance $R_F = 7 " " Omega$. Fault current from A is $I_A = 200 angle (-76.36 degree)$ A. Fault current from B is $I_B = 300 angle (-84.29 degree)$ A. Determine the apparent impedance seen by the relay at A **without considering the contribution of current from the remote bus**.

**Solution (Exam Answer):** The question explicitly asks to ignore remote infeed. Therefore, the apparent impedance is simply the sum of the line impedance to the fault and the fault resistance.

$$
Z_("apparent") = Z_("AF") + R_F
$$
$$
Z_("apparent") = (3.5 + j 10.5) + 7 = 10.5 + j 10.5 Omega
$$

Convert to polar form:
Magnitude = $sqrt(10.5^2 + 10.5^2) = sqrt(220.5) approx 14.85 Omega$
Angle = $tan^(-1)(10.5/10.5) = tan^(-1)(1) = 45 degree$

$$
Z_("apparent") = 14.85 angle 45 degree Omega
$$

This matches option (b). The trap is to include the $R_F dot (I_B/I_A)$ term, which the question forbids.

## 5. Worked Example: Distance Relay Measurement Principle

**Source:** Type2 Assignment Week 4, Question 4 (T2-W4-Q04).

**Problem:** In the distance protection scheme, the distance is measured in terms of:
(a) voltage, (b) current, (c) phase angle, (d) impedance.

**Solution (Exam Answer):** The correct answer is **(d) impedance**. Distance relays operate by measuring the impedance (ratio of voltage to current) from the relay location to the fault point. Since line impedance is proportional to length, impedance measurement is used to estimate fault distance. Voltage, current, and phase angle are inputs used to calculate this impedance.


## Assignment questions using this method

- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q02)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q04)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-04/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
