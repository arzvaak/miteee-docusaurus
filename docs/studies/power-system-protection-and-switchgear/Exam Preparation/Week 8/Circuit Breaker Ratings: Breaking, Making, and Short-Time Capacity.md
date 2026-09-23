---
title: "Circuit Breaker Ratings: Breaking, Making, and Short-Time Capacity"
math_syntax: typst
---

# Circuit Breaker Ratings: Breaking, Making, and Short-Time Capacity

[Week 8 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Week 8 - Circuit Breaker Ratings

## 1. Core Concepts: Breaking, Making, and Short-Time Capacity

Circuit breaker ratings define its ability to perform two fundamental duties: **continuously carrying load current** and **safely interrupting fault currents**. The key ratings are:

*   **Rated Breaking Capacity:** The maximum RMS fault current a breaker can interrupt at the instant of contact separation. It is expressed in MVA as:
    $$
    "Breaking Capacity (MVA)" = sqrt(3) times V_("rated") times I_("breaking")
    $$
    where $V_("rated")$ is the system line-to-line voltage (kV) and $I_("breaking")$ is the rated symmetrical breaking current (kA).

*   **Rated Making Capacity:** The peak current the breaker must withstand when closing into a fault. This occurs during the first cycle when the DC offset is maximum, resulting in a peak current significantly higher than the symmetrical RMS value. A common relationship is:
    $$
    I_("mk") approx 2.55 times I_("sym")
    $$
    The making capacity in MVA is then $sqrt(3) times V_("rated") times I_("mk")$. A practical simplification is that **Making Capacity (MVA) ≈ 2.5 × Breaking Capacity (MVA)**.

*   **Short-Time Current Rating:** The maximum fault current the breaker can carry in the **closed position** for a specified duration (e.g., 1-3 seconds) without damage. This rating is **always greater than the continuous current rating** because it must withstand the thermal and mechanical stress of fault currents until backup protection operates.

**Recognition Cue:** Breaking capacity relates to *opening* under fault. Making capacity relates to *closing* into a fault. Short-time rating relates to *holding* during a fault.

## 2. Worked Example: Making Capacity Calculation

**Source:** Type2 Assignment, Week 8, Question 4 (ID: T2-W8-Q04)

**Problem:** A three-phase circuit breaker is rated 800A, 2000 MVA, 33 kV. What will be its making capacity?

**Solution:**
The problem provides the breaking capacity directly as 2000 MVA. The making capacity is typically 2.5 times the breaking capacity for the first-cycle peak asymmetry.
$$
"Making Capacity" = 2.5 times "Breaking Capacity"
$$
$$
"Making Capacity" = 2.5 times 2000 " MVA" = 5000 " MVA"
$$

**Exam Answer:** 5000 MVA (Option D)

**Explanatory Note:** The detailed calculation using $I_("sym") = frac(2000, sqrt(3) times 33) approx 35 " kA"$ and $I_("mk") = sqrt(2) times 2.55 times 35 approx 127.5 " kA"$ yields a higher value (~7310 MVA). However, the assignment answer key uses the common simplification factor of 2.5 applied directly to the MVA rating, which is a standard convention for such problems. For this exam, follow the keyed method.

## 3. Worked Example: Peak Recovery Voltage

**Source:** Type2 Assignment, Week 8, Question 1 (ID: T2-W8-Q01)

**Problem:** What is the peak value of the power frequency overvoltage across contacts of a circuit breaker when an unloaded 400 kV transmission line is switched off?

**Solution:**
An unloaded line is capacitive. At current zero, the line capacitance traps a charge at the peak phase voltage. After interruption, the source voltage reverses while the trapped charge remains. The maximum voltage across the contacts is the sum of the source peak and the trapped charge peak.
1.  Calculate the peak phase voltage ($E_m$):
    $$
    E_m = sqrt(2) times frac(V_("line"), sqrt(3)) = sqrt(2) times frac(400, sqrt(3)) approx 326.6 " kV"
    $$
2.  The maximum contact voltage is $2 times E_m$:
    $$
    V_("CB","peak") = 2 times 326.6 " kV" = 653.2 " kV"
    $$

**Exam Answer:** 653.19 kV (Option C)

**Explanatory Note:** This is the ideal trapped-charge recovery voltage scenario. The voltage is not simply the phase peak or line-to-line peak; it is twice the phase peak due to the polarity reversal of the source.

## 4. Key Conditions and Units

*   **Breaking Current:** RMS value at contact separation. Units: kA.
*   **Making Current:** Peak value at contact closure. Units: kA.
*   **Breaking/Making Capacity:** Expressed in MVA for three-phase systems. Formula: $sqrt(3) times V_("kV") times I_("kA")$.
*   **Short-Time Rating:** Specified as a current (kA) for a duration (seconds). The current is the RMS symmetrical value the breaker can thermally withstand.
*   **Standard Duty Cycle:** Denoted as O-t-CO-t'-CO (e.g., O-0.3s-CO-3min-CO), where O=Open, CO=Close-Open.


## 6. Source Reference

*   **Lecture Excerpts:** Definitions of Breaking Capacity, Making Capacity, and Short-Time Rating.
*   **Original Assignment Questions:** T2-W8-Q01, T2-W8-Q02, T2-W8-Q04.


## Assignment questions using this method

- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q01)
- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q02)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-8-assignment-solutions#t2-w8-q04)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-08/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
