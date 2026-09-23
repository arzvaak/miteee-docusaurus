---
title: "Types and Characteristics of Overcurrent Relays"
math_syntax: typst
---

# Types and Characteristics of Overcurrent Relays

[Week 2 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Week 2 – Types and Characteristics of Overcurrent Relays

This note covers the classification, operating principles, and key characteristics of overcurrent relays. The focus is on understanding conceptual multiple-choice questions and solving numerical problems from original assignments. Recognition cues include the shape of the time-current characteristic curve and the relay's application context.

## 1. Instantaneous Overcurrent Relay (ANSI 50)

An instantaneous relay operates without intentional time delay when the fault current exceeds a set pickup value. In practice, operation occurs within 1–3 cycles (20–60 ms at 50 Hz). Its characteristic is a vertical line on a Time vs. Multiple of Pickup Current (MP) plot at the pickup value.

**Key Limitations & Concepts:**
*   **No Backup Protection:** It cannot provide backup for downstream relays because it lacks a time delay.
*   **Transient Overreach:** This is the tendency of the relay to operate for faults beyond its intended zone of protection. It is caused by the decaying DC offset component in the fault current. The effect is more pronounced when the DC component decays **slowly** (high X/R ratio), as the asymmetrical current persists for several cycles. Time-delayed relays are immune to this phenomenon.
*   **Application:** Primarily used as an **Instantaneous High-set Unit (IHU)** in combination with an inverse-time relay to quickly clear severe, close-in faults.

## 2. Definite Time Overcurrent Relay (ANSI 51)

This relay operates after a preset, constant time delay once the current exceeds the pickup value. Its characteristic is a horizontal line on a Time vs. MP plot at the set time delay.

**Key Formula (Electromechanical):**
$$
T_op = frac(A, ("MP")^B - 1) times "TDS" + C
$$
For a definite time characteristic, constants $A$ and $B$ are near zero, and $C=0$, simplifying the operation to $T_op approx "TDS"$.

**Major Drawback:** It clears the most severe (close-in) faults with the longest delay, causing maximum equipment damage. This is its primary disadvantage compared to inverse-time relays.

## 3. Inverse Time Overcurrent Relay (ANSI 51)

The operating time is inversely proportional to the fault current magnitude; higher fault currents are cleared faster. The characteristic is a curve sloping downwards from left to right.

**Key Formula & Variants:**
The general formula is $T_op = frac(A, ("MP")^B - 1) times "TDS" + C$. The constants define the curve's steepness:
*   **Normal Inverse (NI):** A=0.092, B=0.02, C=0.149. Most common for general feeder protection.
*   **Very Inverse (VI):** A=13.5, B=1, C=0. Used where fault current drops significantly with distance from the source.
*   **Extremely Inverse (EI):** A=80, B=2, C=0.02. Its characteristic **closely matches the steep curve of fuses/MCBs**, making it ideal for coordination with downstream fuses.

**Application:** Provides faster clearing for severe faults than definite time relays and maintains selectivity. An instantaneous high-set unit is often added to form a combined relay.

## 4. Inverse Definite Minimum Time (IDMT) Relay

This is the most widely used characteristic, combining inverse time operation for lower fault multiples with a definite minimum time operation for very high fault multiples (typically >20x pickup). The characteristic curve flattens out at high currents.

**Standard Formula (IEC):**
$$
T_op = frac(0.14, ("MP")^0.02 - 1) times "TDS"
$$
In electromechanical relays, the definite minimum time is achieved by **saturation of the magnetic circuit** at high currents, which limits the torque and prevents the operating time from decreasing further.

## Worked Examples from Original Assignments

**Example 1: Conceptual Drawback (ID: T1-W2-Q01)**
*   **Question:** The main drawback of a definite time delay relay is that...
*   **Exam Answer:** it takes a long time to clear close-in faults.
*   **Explanation:** A definite time relay operates after a fixed delay regardless of fault current magnitude. For a close-in fault (high current, severe), this fixed delay is unnecessarily long compared to an inverse-time relay, which would operate much faster. It can clear far-end faults, but the delay is the same, which is inefficient.

**Example 2: Transient Overreach (ID: T1-W2-Q10)**
*   **Question:** The transient overreach phenomenon in an overcurrent relay increases when the decay of the DC component of fault current is...
*   **Exam Answer:** Slow.
*   **Explanation:** Transient overreach is the tendency of an instantaneous relay to operate for faults beyond its intended zone due to the DC offset. If the decay is slow (high X/R ratio), the DC component persists for several cycles, increasing the chance of the relay misoperating. A fast decay reduces the overreach effect.


## Source Summary
This note synthesizes concepts from Lecture 06 (Relay Types, Characteristics, Limitations), Lecture 08 (Transient Overreach), and Lecture 09 (Coordination Principles). Numerical examples are taken directly from Assignment 2, Week 2 (Questions 1, 5, 6, 9, 10) and Type2 Assignment, Week 2 (Questions 1, 2, 4, 5, 8, 9).


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q01)
- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q02)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q05)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q06)
- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q09)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q10)
- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q01)
- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q02)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q04)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q05)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q08)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q09)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-02/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
