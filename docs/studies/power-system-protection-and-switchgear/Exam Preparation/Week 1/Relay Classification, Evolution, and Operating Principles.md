---
title: "Relay Classification, Evolution, and Operating Principles"
math_syntax: typst
---

# Relay Classification, Evolution, and Operating Principles

[Week 1 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Relay Classification, Evolution, and Operating Principles

## 1. Core Function of a Protective Relay

A protective relay is a sensing device. Its sole purpose is to **detect** an abnormal condition (like a fault) and **initiate** a trip signal by closing its contacts. It does **not** interrupt the fault current itself—that is the job of the circuit breaker. This distinction is critical for understanding exam questions about relay function.

*   **Correct Function:** Close contacts when an actuating quantity (e.g., current) reaches a predetermined value.
*   **Incorrect Function:** Limit arcing current during circuit breaker operation. This is a circuit breaker function.

This concept is directly tested in **T1-W1-Q10** and **T2-W1-Q10**. The correct answer for both is that the relay closes its contacts (Option 2/ii).

## 2. Relay Classification Methods

Relays are classified in multiple ways to understand their application. The key categories are:

1.  **By Actuating Quantity:** What does it measure? (Overcurrent, Overvoltage, Underfrequency, Power).
2.  **By Construction:** What is its physical mechanism? (Attracted armature, Induction disc/cup, Balanced beam).
3.  **By Number of Inputs:** Single-input (e.g., overcurrent) vs. multiple-input (e.g., directional, which uses current and voltage).
4.  **By Function:** Main relay, auxiliary relay (e.g., lockout relay 86), signal relay.
5.  **By Component/Era:** Electromechanical, Static, Microprocessor-based, Digital/Numerical.
6.  **By Characteristic:** Instantaneous, Time-delay, Inverse Definite Minimum Time (IDMT).

## 3. Evolution of Relay Technology: Advantages & Drawbacks

Understanding the trade-offs between relay generations is key for conceptual MCQs.

| Generation | Key Principle | Primary Advantages | Primary Drawbacks |
| :--- | :--- | :--- | :--- |
| **Electromechanical** (1901+) | Magnetic force on moving parts. | Rugged, reliable, withstands voltage spikes, **low cost**. Still used. | **High burden** (60-80 W), friction, low torque for some faults. |
| **Static** (1950s+) | Semiconductor components. | Low burden, precise/complex characteristics, smaller size. | Higher cost, sensitive to environment, requires DC supply. |
| **Microprocessor-based** (1970s+) | Microprocessor algorithms. | **Self-monitoring**, multiple functions/setting groups, low burden (1-5 VA), low cost per function. | Susceptible to EMI/RFI, short life cycles, complex settings. |
| **Digital/Numerical** (1975+) | Fast processor with math functions. | Inherits all microprocessor features, advanced algorithms, event recording. | Similar to microprocessor-based. |
| **Adaptive Relaying** | Concept, not a product. | Automatically adjusts settings based on system conditions. | Requires high-speed processors and communication. **Not commercially available.** |
| **IED** | Integrated device. | Combines protection, monitoring, control, measurement, and communication. | Complexity, interoperability standards. |

**Key Conceptual Points:**
*   **Self-Monitoring:** A major advantage of microprocessor-based and later relays. Electromechanical and static relays lack this, requiring periodic manual testing. This is the main drawback identified in **T1-W1-Q03** (Answer: Lack of continuous monitoring).
*   **Cost vs. Features:** Electromechanical relays are still used due to their **low cost, ruggedness, and simplicity** (**T2-W1-Q02**, Answer: All of the above).
*   **Burden:** The power drawn by the relay from the CT/PT secondary. It has decreased significantly from electromechanical (high) to microprocessor-based (low).

## 4. Operating Principles & Torque Production

The operating principle defines how a relay's mechanical movement is generated.

*   **Attracted Armature:** An electromagnet attracts a movable armature against a spring force. Used for **instantaneous** relays. It has a high drop-off/pick-up ratio (~0.9).
*   **Induction Disc/Cup:** Operates on the principle of a split-phase induction motor. Torque is produced by the interaction of two AC fluxes. The **Universal Torque Equation** governs this: $T prop phi_(1 max) phi_(2 max) sin theta$, where $theta$ is the angle between the fluxes. For a single operating quantity (current $I$), flux $phi prop I$, so torque $T prop I^2$. This is tested in **T2-W1-Q07** (Answer: Proportional to the square of the current).
*   **Balanced Beam:** Compares an operating force (from one coil) against a restraining force (from another coil plus a spring). Used in **differential protection** for apparatus like transformers and generators.

## 5. Worked Example: Relay Function (T1-W1-Q10)

**Question:** A protective relay is used to
(i) provide additional safety by limiting arcing current during circuit breaker operation.
(ii) close its contacts when the actuating quantity reaches a predetermined value.

**Analysis:**
*   Statement (i) describes a function of the **circuit breaker** (arc quenching), not the relay.
*   Statement (ii) correctly describes the relay's core function: sensing and initiating a trip.

**Exam Answer:** Only (ii) is correct. Therefore, the correct option is **1**.

## 6. Worked Example: Induction Relay Torque (T2-W1-Q07)

**Question:** The torque produced in shaded pole structure induction type relay is
(A) Proportional to the current
(B) Proportional to the square of the current
(C) Inversely proportional to the current
(D) Inversely proportional to the square of the current

**Analysis:**
For an induction disc relay with a single operating quantity (current $I$):
1.  The flux $phi$ produced is proportional to $I$.
2.  The current induced in the rotor (disc) is also proportional to the flux, hence proportional to $I$.
3.  Torque $T$ is proportional to the product of flux and rotor current: $T prop phi times I_("rotor") prop I times I = I^2$.

**Exam Answer:** The torque is proportional to the square of the current. The correct option is **1**.


## Assignment questions using this method

- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q03)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q05)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q10)
- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q02)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q07)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-01/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
