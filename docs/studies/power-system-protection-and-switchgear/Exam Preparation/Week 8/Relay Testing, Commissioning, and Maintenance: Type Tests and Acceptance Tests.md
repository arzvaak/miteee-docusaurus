---
title: "Relay Testing, Commissioning, and Maintenance: Type Tests and Acceptance Tests"
math_syntax: typst
---

# Relay Testing, Commissioning, and Maintenance: Type Tests and Acceptance Tests

[Week 8 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Relay Testing, Commissioning, and Maintenance

This note covers the systematic testing procedures for protective relays, focusing on the distinction between Type Tests, Commissioning & Acceptance Tests, and Routine Maintenance. The goal is to understand the purpose and conditions of each test, not to memorize lists. We will use the supplied assignment questions to ground these concepts.

## 1. The Three-Tier Testing Framework

Protective relays are dormant devices that must operate perfectly during rare fault conditions. Testing is therefore critical and is structured into three distinct phases, each with a different purpose and location.

*   **Type Tests:** Performed by the **manufacturer** on a sample relay to prove the design meets international standards (e.g., IEC, IEEE). These are exhaustive tests performed at the manufacturer's premises.
*   **Commissioning & Acceptance Tests:** Performed at the **customer site** on the *specific relay unit* being installed. Their purpose is to verify no transit damage and correct installation. Acceptance tests may be performed at the manufacturer's premises to verify performance against agreed specifications.
*   **Routine Maintenance Tests:** Performed periodically by the **customer** on the installed relay to ensure ongoing reliability and detect deterioration.

## 2. Type Tests: Proving the Design

Type tests validate the relay's design against its specifications. They are not performed on every unit. Key tests include:

*   **Operating Value Test:** Verifies the pickup threshold (e.g., for an overcurrent relay). The supplied course convention allows a variation of **±10%** for voltage relays and **90-110%** of the set value for current relays.
*   **Operating Time Test:** Measures the time delay from coil energization to contact operation. For inverse-time relays, this is tested at various Plug Setting Multipliers (PSMs). The permissible time deviation is **±12.5%** for PSM 2-4 and **±7.5%** for PSM 4-20.
*   **Temperature Rise Test:** Checks the insulation's thermal withstand capability. Rated current is passed through the relay coils/contacts, and the temperature rise is measured. This ensures the insulation class is adequate.
*   **Contact Capacity Test:** Verifies the relay contacts can make and break the required VA duty to trip a circuit breaker without welding. The test uses an **inductive load at a low power factor (e.g., 0.4 lagging)**.
*   **Overload Test:** For inverse-time overcurrent relays, **20 times the plug setting (PS) current** is injected at maximum Time Dial Setting (TDS=1) to check the continuous current-carrying capacity of the coil and contacts.

> **Worked Example 1 (T2-W8-Q06):** The question asks which type test performs the making and breaking operation test.
> *   **Exam Answer:** The correct option is **contact capacity test** (Option 1).
> *   **Explanation:** The contact capacity test is specifically designed to verify the VA making/breaking capability of the relay contacts under specified load conditions. The operating value test checks pickup settings, and the overload test checks thermal capacity for continuous current, not switching operations.

## 3. Commissioning & Acceptance Tests: Verifying the Installation

These tests are performed on the actual relay unit at the installation site before it is put into service. Their primary purposes are to check for transit damage and verify correct installation and calibration.

*   **Insulation Resistance Test:** A megger (500V or 1kV) is used to measure insulation resistance to earth. The supplied course value for a typical healthy reading is **~5 MΩ**. This value is a baseline for future deterioration checks and depends on wiring, insulation class, and ambient humidity.
*   **Secondary Injection Test:** Current or voltage is injected directly into the relay coil to verify its calibration and settings (pickup, time delay) match the protection study.
*   **Primary Injection Test:** Current is injected into the **primary of the CT** to test the **entire protection scheme**: CT, relay, trip circuit, and wiring. This confirms the correct installation and operation of the complete system. It is performed *after* the secondary injection test.
*   **Tripping Test:** Verifies the complete sequence from relay operation to circuit breaker tripping and alarm annunciation. It confirms the trip circuit is correctly wired and functional.

> **Worked Example 2 (T2-W8-Q10):** The question asks for the purpose of the primary injection test.
> *   **Exam Answer:** The correct option is **To ensure the correct installation and operation of the protection scheme** (Option 0).
> *   **Explanation:** Primary injection tests the entire loop from CT primary to breaker trip coil. Secondary injection only tests the relay itself. The complete tripping sequence is verified in the dedicated tripping test.

## 4. Routine Maintenance: Ensuring Ongoing Reliability

Relays must be periodically tested to ensure they haven't deteriorated. The supplied course specifies a **yearly** frequency for a complete calibration and inspection test. This includes:
*   Visual inspection of flags and indicators (**daily/shift-wise**).
*   Secondary injection tests for operating value and time.
*   Insulation resistance tests.
*   Inspection of associated equipment (e.g., batteries, gas-operated relays).

## 5. Key Concepts & Common Pitfalls

*   **CT Shorting:** Always short the CT secondary before removing a relay to prevent dangerous open-circuit voltages.
*   **Thermal Memory:** Resetting a digital relay does **not** cool its internal components. Thermal memory must dissipate naturally; immediate re-energization can cause damage.
*   **Primary vs. Secondary Injection:** **Secondary** tests the relay's calibration. **Primary** tests the entire protection scheme's integrity.
*   **Insulation Resistance:** The **5 MΩ** value is a typical order-of-magnitude reference from the supplied material, not a universal pass/fail criterion. Actual acceptance limits depend on equipment specifications and test conditions.


## Source Reference
*   **Type Tests:** Lecture 39, "Testing, Commissioning and Maintenance of Relays-I"
*   **Commissioning & Acceptance Tests:** Lecture 40, "Testing, Commissioning and Maintenance of Relays-II"
*   **Assignment Questions:** Type2 Assignment, Week 8, Questions 6-10.


## Assignment questions using this method

- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q06)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q08)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-08/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
