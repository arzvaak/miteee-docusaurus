---
title: "Transformer Differential Protection: Principles, CT Connections, and Bias Settings"
math_syntax: typst
---

# Transformer Differential Protection: Principles, CT Connections, and Bias Settings

[Week 6 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Transformer Differential Protection: Principles, CT Connections, and Bias Settings

## 1. Core Principle: Circulating Current Differential Protection

The fundamental principle is comparing currents entering and leaving the protected zone (transformer windings). Under normal load or external fault conditions, these currents are equal in magnitude and phase. For an internal fault, the balance is disturbed, creating a differential current that operates the relay.

The relay operates based on two conditions:
1.  **Operating Current:** $I_("op") = |i_1 - i_2|$, where $i_1$ and $i_2$ are the CT secondary currents referred to a common base.
2.  **Restraining Current:** $I_("res") = frac(i_1 + i_2, 2)$, representing the average through-current.

The relay trips if $I_("op") > I_("pickup")$ **and** $frac(I_("op"), I_("res")) > "Bias Setting"$.

## 2. Key Challenges and Solutions

Three main issues can cause mal-operation (false trips) in a simple circulating current scheme:

*   **CT Mismatch & Saturation:** Non-identical CT characteristics and unequal lead lengths create a "spill current" ($I_("op") != 0$) even for external faults.
*   **Phase Shift:** A delta-star power transformer introduces an inherent $30 degree$ phase shift between line currents on its two sides.
*   **Magnetizing Inrush:** When energized, a transformer draws a large, transient inrush current (5-12x full-load) that appears as an internal fault to the relay.

**Solutions:**
*   **For Mismatch/Saturation:** Use a **biased (percentage) differential relay**. The restraining current ($I_("res")$) increases with through-fault current, raising the operating threshold and preventing mal-operation for external faults.
*   **For Phase Shift:** Connect the CTs opposite to the power transformer windings. For a delta-star transformer:
    *   CTs on the **star winding** are connected in **delta**.
    *   CTs on the **delta winding** are connected in **star**.
    This cancels the $30 degree$ shift and filters zero-sequence currents.
*   **For Inrush:** Relays use **second-harmonic restraint**. Inrush current contains a high second-harmonic content (>15%), which blocks relay operation.

## 3. Worked Example: CT Ratio Calculation (T1-W6-Q01)

**Problem:** A three-phase 11 kV / 66 kV delta/star power transformer is protected by differential protection. CTs on the 11 kV (delta) side have a ratio of 1500/5 A. Determine the required CT ratio on the 66 kV (star) side.

**Solution:**
1.  **Calculate transformer line currents:**
    *   HV side (66 kV, star): $I_("HV") = frac(S, sqrt(3) times V_("HV"))$
    *   LV side (11 kV, delta): $I_("LV") = frac(S, sqrt(3) times V_("LV"))$
    *   The ratio $frac(I_("LV"), I_("HV")) = frac(V_("HV"), V_("LV")) = frac(66, 11) = 6$.

2.  **Refer LV-side CT current to the relay circuit:**
    *   LV-side CT ratio is 1500/5 A. The secondary current for a primary current $I_("LV")$ is $i_("LV") = I_("LV") times frac(5, 1500)$.
    *   Since the LV-side CTs are on the delta winding, they are connected in **star**. Their line output to the relay is $i_("LV")$.

3.  **Balance currents at the relay:**
    *   The HV-side CTs are on the star winding and must be connected in **delta**. The line current from a delta-connected CT set is $sqrt(3)$ times the winding current.
    *   Let the HV-side CT ratio be $X : 5$ A. The winding current is $i_("winding") = I_("HV") times frac(5, X)$.
    *   The line current to the relay is $i_("HV") = sqrt(3) times i_("winding") = sqrt(3) times I_("HV") times frac(5, X)$.
    *   For balance, $i_("LV") = i_("HV")$:
        $$
        I_("LV") times frac(5, 1500) = sqrt(3) times I_("HV") times frac(5, X)
        $$
    *   Substitute $I_("LV") = 6 times I_("HV")$:
        $$
        6 times I_("HV") times frac(5, 1500) = sqrt(3) times I_("HV") times frac(5, X)
        $$
        $$
        frac(6, 1500) = frac(sqrt(3), X) arrow.r.double.long X = frac(1500 times sqrt(3), 6) = 250 sqrt(3)
        $$
    *   Therefore, the required CT ratio is **$250 sqrt(3) : 5$ A**.

**Exam Answer:** The supplied key for T1-W6-Q01 is option B: **$250 : 5 sqrt(3)$ A**. The derivation above follows a conventional individual-CT current-matching approach, which yields the reciprocal scaling. The exam answer is authoritative.

## 4. Worked Example: Biased Relay Operation Check (T1-W6-Q02)

**Problem:** A percentage-biased differential relay protecting a generator has a pick-up current of 0.25 A, a bias slope of 20%, and a CT ratio of 800/1 A. During a through (external) fault, the currents in CT1 and CT2 are 720 A and 640 A, respectively. State whether the relay will operate.

**Solution:**
1.  **Refer primary currents to CT secondary:**
    *   $i_1 = frac(720, 800) = 0.9$ A
    *   $i_2 = frac(640, 800) = 0.8$ A

2.  **Calculate operating and restraining currents:**
    *   $I_("op") = |i_1 - i_2| = |0.9 - 0.8| = 0.1$ A
    *   $I_("res") = frac(i_1 + i_2, 2) = frac(0.9 + 0.8, 2) = 0.85$ A

3.  **Check relay conditions:**
    *   **Pickup condition:** $I_("op") = 0.1$ A < $I_("pickup") = 0.25$ A. **Fails.**
    *   **Bias condition:** $frac(I_("op"), I_("res")) = frac(0.1, 0.85) approx 0.118$ (11.8%). This is less than the bias setting of 20%. **Fails.**

**Conclusion:** The relay **will not operate**. The differential current is below both the minimum pickup and the bias threshold.


## 6. Key Concepts from Assignments

*   **Restricted Earth Fault (REF) Protection (T1-W6-Q06):** Provides sensitive, high-speed protection for earth faults near the neutral end of a transformer winding, where fault current is low. It is more sensitive than standard differential protection for earth faults.
*   **Purpose of Interposing CT (T1-W6-Q04):** Primarily used to correct both the **ratio mismatch** (magnitude) and the **phase-shift** between the line CTs on the two sides of the power transformer.
*   **Buchholz Relay (T1-W6-Q08, T2-W6-Q01):** A gas-actuated relay that detects **incipient internal faults** (e.g., insulation breakdown, inter-turn faults) by sensing gas generation and oil flow. It is not for external faults.
*   **Problems with Differential Protection (T2-W6-Q02):** Include magnetizing inrush, CT mismatching, and ratio changes due to tap changing. All must be addressed in the protection scheme design.


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q01)
- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q02)
- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q04)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q05)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q06)
- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q07)
- [Type 1, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q08)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q10)
- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q01)
- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q02)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q03)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q04)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q06)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-06/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
