---
title: "Overcurrent Relay Coordination in Radial Systems"
math_syntax: typst
---

# Overcurrent Relay Coordination in Radial Systems

[Week 2 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Overcurrent Relay Coordination in Radial Systems

## Core Coordination Philosophy

Relay coordination ensures that only the relay closest to a fault operates (selectivity), with upstream relays providing backup after a time delay. In radial systems, coordination proceeds from the load end toward the source. The practical method uses **current-time grading** with IDMT relays, combining inverse-time characteristics (current grading) with time dial settings (time grading).

**Why not pure current or time grading alone?** Current grading fails when fault currents in adjacent sections are similar. Time grading alone clears severe faults too slowly. IDMT relays overcome both limitations.

## Plug Setting (PS) Determination

The plug setting defines the relay's pickup current. Four rules govern PS selection:

**Rule 1 – Reach:** The relay must detect the minimum fault at the far end of the next section.

**Rule 2 – Load:** PS must exceed maximum full-load current (including any specified overload):
$$
"PS" > frac(I_("FL") times (1 + "%OL"), "CT"_("ratio") times I_("rated"))
$$

**Rule 3 – Coordination:** Upstream relay pickup must exceed downstream relay pickup by a margin of 105–130%. When referred to the same base:
$$
"PS"_("upstream") > frac(1.3, 1.05) times "PS"_("downstream")
$$

**Rule 4 – Ground vs. Phase:** Ground relay PS is typically lower than phase relay PS due to lower earth fault currents and CT excitation effects.

**Recognition cue:** When asked for PS of multiple relays in a radial chain, always start from the load-end relay and work upstream, applying Rule 3 at each step.

## Time Dial Setting (TDS) Determination

TDS determines operating time for a given multiple of pickup (MP). The standard IDMT equation is:
$$
T_op = frac(0.14, ("MP")^0.02 - 1) times "TDS"
$$

**Procedure:**
1. Set load-end relay to lowest feasible TDS.
2. For a fault at the downstream relay's bus, calculate its operating time using its PS, TDS, and fault current.
3. Required upstream relay operating time = downstream operating time + CTI (Coordination Time Interval).
4. Solve for upstream TDS using its own MP for the same fault.

**CTI components:** Breaker operating time, relay errors, CT errors, and safety margin. Typical value: 0.2–0.3 s.

## Worked Example 1: Plug Setting Coordination

**Source:** Assignment 2, Week 2, Question 7 (T1-W2-Q07)

**Given:** Radial system with relays R1, R2, R3. R3 PS = 75% of CT secondary, CT ratios: R3 = 800/1, R2 = 800/1, R1 = 1000/1. PS range: 50–200% in 25% steps.

**Question:** What are the PSs of R1 and R2?

**Solution:**
- R3 pickup (primary) = 0.75 × 800 = 600 A.
- For R2 (CT=800/1): If PS=75%, pickup = 600 A (same as R3 – violates coordination). Next step is 100%, pickup = 800 A > 600 A. ✓
- For R1 (CT=1000/1): If PS=75%, pickup = 750 A < 800 A (R2's pickup – violates coordination). Next step is 100%, pickup = 1000 A > 800 A. ✓

**Exam answer:** 100% of relay rating for both R1 and R2.

**Trap:** Simply applying the 1.3/1.05 rule without checking available discrete settings. The rule gives a minimum; the actual PS must be the next higher standard step.

## Worked Example 2: Time Dial Setting Coordination

**Source:** Assignment 2, Week 2, Question 8 (T1-W2-Q08)

**Given:** Continuation of Q7. Fault current at Bus C = 5000 A. CTI = 0.3 s. R3 TDS = 0.1, R3 PS = 75%, R2 PS = 100% (from Q7).

**Question:** What is the TDS of R2?

**Solution:**
1. **For R3:** MP = 5000 / (0.75 × 800) = 8.33.
   $$
   T_(op,"R3") = frac(0.14, (8.33)^0.02 - 1) times 0.1 = 0.323 " s"
   $$
2. **Required for R2:** $T_(op,"R2") = 0.323 + 0.3 = 0.623$ s.
3. **For R2:** MP = 5000 / (1.0 × 800) = 6.25.
   Solve for TDS:
   $$
   "TDS"_("R2") = 0.623 times frac((6.25)^(0.02) - 1, 0.14) = 0.166
   $$
4. **Select standard setting:** Nearest higher step in 0.05 increments is 0.20.

**Exam answer:** 0.20.

**Common mistake:** Using the fault current at R2's location instead of at the downstream bus (Bus C) for coordination calculations.

## Conceptual MCQs: Key Recognition Points

**Q: A transmission line is protected by?**
**Exam answer:** Time graded and current graded over current protection.
*Source: T2-W2-Q03.* IDMT relays inherently use both principles.

**Q: Relays for transmission line protection are?**
**Exam answer:** In three zones.
*Source: T2-W2-Q06.* Zone 1 (instantaneous, ~80% of line), Zone 2 (time-delayed, 100%+20%), Zone 3 (backup).

**Q: The multiple of pickup current (MP) is defined as the ratio of?**
**Exam answer:** Fault current to relay pickup current.
*Source: T2-W2-Q07.* MP = I_fault / I_pickup (both on same side of CT).

**Q: Minimum coordination time (MCT) between relays is decided by considering?**
**Exam answer:** Operating time of relay, circuit breaker, and errors in the CTs and CVTs.
*Source: T2-W2-Q10.* MCT must account for all timing uncertainties.


## Source Summary

- **Coordination rules & examples:** Lectures 9–10, Assignments 2 (Week 2, Q7, Q8).
- **Conceptual MCQs:** Type2 Assignment (Week 2, Q3, Q6, Q7, Q10).
- **Key formulas:** Standard IDMT equation, MP definition, CTI components.


## Assignment questions using this method

- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q07)
- [Type 1, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q08)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q03)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q06)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q07)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t2-w2-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-02/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
