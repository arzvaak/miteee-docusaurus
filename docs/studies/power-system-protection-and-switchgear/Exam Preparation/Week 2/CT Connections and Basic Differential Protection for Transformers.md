---
title: "CT Connections and Basic Differential Protection for Transformers"
math_syntax: typst
---

# CT Connections and Basic Differential Protection for Transformers

[Week 2 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: CT Connections & Basic Differential Protection for Transformers

## 1. Core Principle: The Circulating Current Scheme

Differential protection operates on a simple, powerful idea: compare the current entering a protected zone with the current leaving it. For a transformer, this means comparing currents on the primary and secondary sides.

*   **Normal/External Fault:** Current in equals current out. The differential current, $I_d = |I_1 - I_2|$, is ideally zero.
*   **Internal Fault:** Currents are unequal. A significant $I_d$ flows through the relay's operating coil, triggering a trip.

The challenge is that a power transformer with a star-delta (Y-Δ) connection inherently introduces a **30° phase shift** between its primary and secondary line currents. If CTs are connected directly, this phase shift creates a large, false differential current even under normal load, causing a maloperation.

## 2. CT Connection Rule for Compensation

To cancel the transformer's phase shift, the CT connections must be made in the **opposite configuration**.

*   **Rule:** Connect CTs on the **star (Y) side of the transformer in delta (Δ)**. Connect CTs on the **delta (Δ) side of the transformer in star (Y)**.
*   **Why it works:** The delta-connected CTs introduce their own 30° phase shift, which cancels the 30° shift from the Y-Δ transformer. This ensures that, under normal conditions, the currents arriving at the relay via the pilot wires are in phase and of comparable magnitude.
*   **Secondary Benefit:** This scheme also blocks zero-sequence currents (from ground faults on the star side) from entering the pilot wires, preventing incorrect operation for external ground faults.

## 3. The Role of Bias (Percentage Restraint)

In practice, the differential current $I_d$ is never perfectly zero due to factors like CT ratio mismatches, transformer tap changer positions, and CT saturation characteristics. To prevent maloperation from this "spill current," a **biased or percentage restraint** is used.

The relay is designed to operate only if the differential current exceeds a set percentage of the average restraining current. The operating condition is:

$$
abs(I_1 - I_2) > k times frac(abs(I_1 + I_2), 2) + I_("set")
$$

Where:
*   $k$ is the bias slope setting (e.g., 20-40%).
*   $I_("set")$ is the minimum pickup current.

This creates a characteristic where the relay becomes less sensitive as the through-current (restraint) increases, ensuring stability during heavy external faults.

## 4. Worked Example: CT Pilot Wire Current Calculation

This example demonstrates the direct application of the CT connection rule.

**Original Assignment Question ID: T1-W2-Q03**
*   **Problem:** A 60 MVA, 33 kV/66 kV, star/delta power transformer is to be protected by differential protection. The continuous current carrying capacity to restraining coils of the differential relay should not exceed 5 A. CT ratio is 3000/5 on the 33 kV side. What would be the current fed into the pilot wires of the CT secondary in the 33 kV side?
*   **Exam Answer:** 3.03 A (Option 2)

**Solution Logic:**
1.  **Calculate Full-Load Current on 33 kV (Star) Side:**
    $$
    I_("FL") = frac(60 times 10^6, sqrt(3) times 33 times 10^3) = 1049.7 " A"
    $$
2.  **Calculate CT Secondary Current:**
    $$
    I_("sec") = frac(I_("FL"), "CT"_("ratio")) = frac(1049.7, 3000/5) = 1.75 " A"
    $$
3.  **Apply CT Connection Rule:** The 33 kV side is the star side of the transformer. Therefore, its CTs must be connected in **delta**. The current in the pilot wires (delta secondary) is $sqrt(3)$ times the phase current:
    $$
    I_("pilot") = sqrt(3) times I_("sec") = sqrt(3) times 1.75 = 3.03 " A"
    $$

## 5. Worked Example: Selecting the CT Ratio on the Other Side

This follows directly from the previous calculation, using the established pilot wire current.

**Original Assignment Question ID: T1-W2-Q04**
*   **Problem:** In continuation of question number 3, what could be the possible CT ratio on 66 kV side?
*   **Exam Answer:** 1000/5 (Option 3)

**Solution Logic:**
1.  **Pilot Wire Current:** From Q3, $I_("pilot") = 3.03 " A"$.
2.  **CT Connection on 66 kV Side:** The 66 kV side is the delta side of the transformer, so its CTs are connected in **star**. Therefore, the pilot wire current equals the CT secondary current: $I_("sec") = 3.03 " A"$.
3.  **Calculate Full-Load Current on 66 kV Side:**
    $$
    I_("FL") = frac(60 times 10^6, sqrt(3) times 66 times 10^3) = 524.85 " A"
    $$
4.  **Determine Required CT Primary Current:** The CT ratio must be chosen so that the secondary current does not exceed the 5 A limit.
    $$
    "Required CT Primary" = frac(I_("FL"), I_("sec")) = frac(524.85, 3.03) = 173.22 " A"
    $$
5.  **Select Standard CT Ratio:** Choose the nearest standard CT primary rating **greater than** 173.22 A that keeps the secondary current under 5 A.
    *   **200/5:** $I_("sec") = (524.85 / 200) times 5 = 13.12 " A"$ (Exceeds 5 A limit).
    *   **500/5:** $I_("sec") = (524.85 / 500) times 5 = 5.25 " A"$ (Slightly exceeds 5 A limit).
    *   **1000/5:** $I_("sec") = (524.85 / 1000) times 5 = 2.62 " A"$ (Within 5 A limit, suitable).
    *   **1500/5:** Also valid, but 1000/5 is the closest standard ratio above the calculated minimum.


## 7. Source Sections
*   Lecture 26: Transformer Differential Protection
*   Assignment 2, Week 2, Questions 3 & 4


## Assignment questions using this method

- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q03)
- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-2-assignment-solutions#t1-w2-q04)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-02/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
