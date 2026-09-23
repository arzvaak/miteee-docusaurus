---
title: "Thermal Relays and Attracted Armature Relays"
math_syntax: typst
---

# Thermal Relays and Attracted Armature Relays

[Week 1 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Thermal Relays and Attracted Armature Relays

## Core Concepts: Overload vs. Fault
Understanding the distinction between an **overload** and a **fault** is fundamental to selecting the correct relay. An overload is a gradual increase in current above the equipment's rated value, often transient and survivable for a short duration. A fault, such as a short-circuit, involves a massive, rapid current surge (10-20x rated) requiring instantaneous disconnection to prevent catastrophic electrodynamic damage. Thermal relays are designed for the former; attracted armature relays are often used for the latter.

## Thermal Relay Principle and Application
A thermal relay protects equipment from sustained overloads by indirectly measuring temperature via the heating effect of current ($I^2 R t$). Its operation is intentionally slow, matching the equipment's **thermal withstand characteristic**—the curve defining how long insulation can tolerate a given overload before damage. The relay's characteristic curve must lie just *below* this withstand curve to utilize the equipment's full capacity without risk.

**Key Recognition Cue:** The question asks about protection against "overload," "overheating," or "overload condition." The answer is a thermal relay. It is **not** for short-circuit or overvoltage protection.

**Modern Context:** Traditional bimetallic strip relays had long reset times. Modern digital/numerical relays simulate thermal models with fast reset times (~0.1-0.2 s), allowing quicker restarts after a trip.

## Attracted Armature Relay Principle and Application
This relay operates on an electromechanical principle: a current-carrying coil creates a magnetic field that attracts a hinged armature or plunger against a restraining spring. When the magnetic force exceeds the spring force, the armature moves, closing contacts to initiate a trip. This action is inherently **instantaneous**.

**Primary Application:** Achieving instantaneous operation in protective schemes, such as instantaneous overcurrent relays for both AC and DC systems.

**Key Features:**
*   **Very fast operation** (milliseconds).
*   **High drop-off/pick-up ratio** (~0.9), enabling quick reset.
*   **Construction:** Available as hinged armature (pivoting motion) or plunger type (linear motion).
*   **AC Operation:** Requires a shading band or pole splitting to create a phase-shifted flux, preventing contact chatter at current zero-crossings by ensuring a non-zero resultant force.

## Worked Example: Identifying Relay Application
**Question ID: T1-W1-Q04**  
*A thermal relay is used for protection against*  
A. Overload  
B. Overvoltage  
C. Short-circuit  
D. All the above  

**Exam Answer:** 0 (Option A)  
**Explanation:** Thermal relays are specifically designed for **overload** protection. They respond to the gradual heating effect of moderate overcurrents. Short-circuit protection requires fast-acting relays (like attracted armature or IDMT overcurrent relays), and overvoltage is protected by separate voltage relays.

## Comparison and Common Traps
*   **Thermal vs. Overcurrent Relay for Overload:** An overcurrent relay set for overload would trip in milliseconds, disconnecting equipment that could safely withstand the transient overload for minutes. The thermal relay's inverse-time characteristic avoids unnecessary outages.
*   **Trap:** Assuming an attracted armature relay can provide time-delay protection. Its operation is instantaneous by design.
*   **Trap:** Confusing the "sensitivity" of a thermal relay with the VA burden of other relays. For thermal relays, the critical parameter is the match between its characteristic and the equipment's thermal withstand curve.


## Assignment questions using this method

- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t1-w1-q04)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-1-assignment-solutions#t2-w1-q04)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-01/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
