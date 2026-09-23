---
title: "Requirements of a Protective System"
math_syntax: typst
---

# Requirements of a Protective System

[Week 1 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Requirements of a Protective System

A protective system must satisfy seven key requirements to ensure power system security and reliability. Understanding these concepts is crucial for answering conceptual MCQs and applying them to numerical problems involving relay settings and coordination.

## Core Requirements

**Selectivity** is the ability to isolate *only* the faulty section, minimizing outage area and duration. It has two forms:
- **Absolute selectivity:** Achieved by comparing quantities at both zone boundaries (e.g., differential protection for a transformer winding). The relay operates only for internal faults.
- **Relative selectivity:** Achieved by coordinating relays in time or current grading schemes (e.g., overcurrent relays on a radial feeder). The relay closest to the fault operates first.

**Speed** is critical because quick fault clearance improves system stability, reduces equipment damage, and minimizes outage duration. **Fault Clearing Time** = Relay Operating Time + Circuit Breaker Operating Time. A typical modern digital relay operates in **10-30 ms** (half to 1.5 cycles at 50 Hz), while a circuit breaker takes 2.5-3.5 cycles. The target total is approximately 4 cycles.

**Sensitivity** is the ability to detect the minimum fault current within the zone. **Relay sensitivity** is defined as the **minimum apparent power (in VA)** required to operate the relay. A relay with 1 VA sensitivity is *more* sensitive than one with 3 VA. System sensitivity also depends on CT/PT accuracy and burden.

**Discrimination** is the ability to distinguish between a fault and a normal abnormal condition (e.g., motor starting current, transformer inrush current, overload). This prevents nuisance tripping.

**Stability** is the ability to remain stable (not operate) for conditions outside its zone, such as power swings or through-faults.

**Reliability** is the probability that the relay will operate correctly when required. It comprises:
- **Dependability:** Certainty of operation for a fault in its zone.
- **Security:** Certainty of *not* operating for a fault outside its zone or during normal conditions.

**Economics** requires that the total cost of the protection system (relay, CTs, PTs, panels, wiring) should not exceed **5-10%** of the cost of the equipment being protected.

## Key Formulas and Values
- Fault Clearing Time (cycles) ≈ (Relay Time in ms / 20) + (CB Time in cycles).
- Sensitivity Factor (for overcurrent): $S_f = I_(f,"min") / I_("pickup")$.

## Common Conceptual Traps
- Confusing *selectivity* (which device operates) with *discrimination* (what condition it operates for).
- Assuming a lower VA rating means a *less* sensitive relay; it's the opposite.
- Overlooking that reliability requires both dependability *and* security.

## Worked Examples from Original Assignments

**Example 1: Conceptual Application (T1-W1-Q01)**
*Question:* Unit protection is based on the concept of
*Options:* (a) Absolute selectivity, (b) Relative selectivity, (c) Both (a) and (b), (d) None of these.
*Exam Answer:* (a) Absolute selectivity.
*Explanation:* Unit protection (e.g., differential protection) operates for faults strictly within its defined zone by comparing quantities at both zone boundaries. This provides **absolute selectivity**, as it does not rely on coordination with other relays. Relative selectivity is achieved through grading schemes (e.g., overcurrent relays).

**Example 2: Numerical Value Recall (T1-W1-Q06)**
*Question:* The operating time of a modern digital relay is typically of the order of
*Options:* (a) 0 – 10 ms, (b) 10 – 30 ms, (c) 50 – 100 ms, (d) 100 – 200 ms.
*Exam Answer:* (b) 10 – 30 ms.
*Explanation:* The lecture specifies that a high-speed relay (which includes modern digital relays) typically operates in the range of **10 to 30 milliseconds**. This corresponds to half a cycle to one and a half cycles in a 50 Hz system.


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q01)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q06)
- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q09)
- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q01)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q03)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q06)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q09)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-01/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
