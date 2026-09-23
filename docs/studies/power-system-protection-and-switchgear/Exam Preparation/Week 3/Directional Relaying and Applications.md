---
title: "Directional Relaying and Applications"
math_syntax: typst
---

# Directional Relaying and Applications

[Week 3 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Directional Relaying and Applications

### Core Principle
A directional relay operates only when fault current flows in a predetermined "forward" direction. It achieves this by comparing the phase angle between a fault current input and a polarizing voltage reference. The fundamental torque equation for an electromechanical unit is:
$$
T prop V dot I dot cos(phi - theta)
$$
where:
*   $V$ = polarizing voltage magnitude (V)
*   $I$ = fault current magnitude (A)
*   $phi$ = angle between voltage $V$ and current $I$ (degrees)
*   $theta$ = Maximum Torque Angle (MTA) (degrees)

Maximum torque, and thus most sensitive operation, occurs when $phi = theta$. The relay operates within a characteristic angle range, typically $-90 degree < (phi - theta) < 90 degree$.

### Setting the Maximum Torque Angle (MTA)
The MTA ($theta$) is set by the specific connection of CT and PT inputs to the relay. The goal is to align $theta$ with the typical fault power factor angle ($phi approx 70 degree - 90 degree$) for maximum torque.
*   **90° Connection (Standard for Phase Faults):** For an R-phase relay, use current $I_R$ and voltage $V_("YB")$. This connection yields $theta = 90 degree$, making torque $T prop sin(phi)$, which is high for faults with $phi$ near $90 degree$. (Source: T2-W3-Q03, Lecture OCR)
*   **30° and 60° Connections:** These are alternative configurations but are less common for standard phase fault protection as they may not produce optimal torque for all fault conditions. (Source: Lecture OCR)

### Critical Limitation: The Dead Zone
A directional relay requires a sufficient polarizing voltage to determine direction. For a "close-in" fault occurring very near the relay's bus, the voltage collapses to near zero. This creates a **dead zone** where the relay cannot reliably operate. This is a key practical limitation. (Source: T2-W3-Q05, Lecture OCR)

### Application in Network Protection
Directional relays are essential where fault current can reverse direction, ensuring selectivity by preventing miscoordination. (Source: T2-W3-Q04, Lecture OCR)

**1. Multi-Section Radial Feeder (Both-End Feed):**
Consider a feeder with sections 1, 2, 3 fed from generators G1 and G2. Without directionality, a fault in section 2 would cause the nearest relays (e.g., R2 and R5) to operate, disconnecting healthy buses A and D. By making relays R3, R4, R2, and R5 directional (set to operate for current flowing *away* from their respective buses), only the relays bounding the faulted section (R3 and R4) will operate, maintaining service to healthy sections. (Source: Lecture OCR)

**2. Parallel Feeders:**
For parallel lines fed from one source, a fault on one line creates two fault current paths. Directional elements at the remote ends (e.g., R3, R4) ensure only the relays on the faulted line operate. The source-end relays (R1, R2) provide backup. (Source: Lecture OCR)

**3. Ring Main & Cascaded Parallel Feeders:**
In these topologies, most relays must be directional to ensure that only the relays closest to the fault in the correct direction operate, isolating the minimum network. (Source: Lecture OCR)

### Worked Example: Plug Setting Coordination (T2-W3-Q01)
**Problem:** In Fig. 1 (radial system), R3 has PS=75% on an 800/1 CT. Determine PS for R1 (1000/1 CT) and R2 (800/1 CT). PS range: 50-200% in seven steps.
**Solution:** The principle is ascending pickup current from downstream to upstream.
1.  R3 primary pickup = $0.75 times 800 = 600$ A.
2.  R2 must have a pickup > 600 A. The next available setting is 100%, giving $1.00 times 800 = 800$ A.
3.  R1 must have a pickup > R2's 800 A. The 75% setting gives $0.75 times 1000 = 750$ A (too low). The 100% setting gives $1.00 times 1000 = 1000$ A (correct).
**Exam Answer:** 100% of relay rating for both. (Option 1)
**Note:** This establishes the pickup grading. Time coordination is a separate step.

### Worked Example: TDS Coordination (T2-W3-Q02)
**Problem:** Using the same Fig. 1, R3 has TDS=0.1. Coordination time interval = 0.25 s. Fault current at bus = 5000 A. Determine TDS for R2.
**Solution:** Coordinate R2 with R3 at the 5000 A fault.
1.  **R3 Operation Time:** $M_3 = 5000 / (0.75 times 800) = 8.333$. Using the standard inverse curve $t = frac(0.14 times "TDS", M^(0.02) - 1)$:
    $t_3 = frac(0.14 times 0.1, 8.333^(0.02) - 1) = 0.3232$ s.
2.  **Required R2 Time:** $t_(2,"req") = t_3 + 0.25 = 0.5732$ s.
3.  **Calculate R2 TDS:** R2 uses PS=100% on 800/1 CT, so $M_2 = 5000 / 800 = 6.25$.
    $"TDS"_2 = frac(t_(2,"req") times (M_2^(0.02) - 1), 0.14) = frac(0.5732 times (6.25^(0.02) - 1), 0.14) = 0.1529$.
4.  **Select Setting:** Available TDS steps are 0.05. Round **UP** to the next step: **0.20**. (0.15 would provide only ~0.239 s coordination, insufficient).
**Exam Answer:** 0.2 (Option 3)


## Assignment questions using this method

- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q01)
- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q02)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q03)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q04)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-3-assignment-solutions#t2-w3-q05)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-03/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
