---
title: "Auto-Reclosing Principles and Application"
math_syntax: typst
---

# Auto-Reclosing Principles and Application

[Week 5 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Auto-Reclosing Principles and Application

## 1. Fundamental Justification and Fault Statistics

Auto-reclosing is a protection philosophy primarily applied to overhead transmission and distribution lines. Its justification rests on a key statistical observation: approximately **80% of faults on overhead lines are transient** (self-clearing), while only about 20% are permanent. Transient faults are caused by events like lightning strikes, temporary conductor contact, or wind-blown debris. Once the line is de-energized for a short period, the fault path de-ionizes and the fault clears itself. Auto-reclosing exploits this by automatically reclosing the breaker after a brief "dead time," restoring service without manual intervention for the vast majority of faults. This improves system reliability, enhances stability on tie lines, and minimizes supply interruption.

**Important:** Auto-reclosing is generally **not employed on underground cable feeders** because cable faults are usually **permanent** in nature, caused by insulation breakdown or mechanical damage. Reclosing into a permanent fault provides no benefit and adds unnecessary stress to the system.

## 2. Core Timing Parameters: Dead Time and Reclaim Time

Two critical time intervals govern the auto-reclosing sequence:

*   **Dead Time (or De-ionization Time):** This is the time interval between the interruption of fault current (arc extinction at the breaker contacts) and the issuance of the reclosing command by the auto-reclosing relay (ARR). Its purpose is to allow the fault arc path to fully de-ionize and for the circuit breaker's dielectric strength to recover. A fundamental rule is that the **dead time of the ARR must always be greater than the de-ionization time of the circuit breaker** to ensure safe reclosing. For high-speed reclosing on EHV systems, a minimum dead time can be estimated by the IEC formula: $t = 10.5 + frac("kV", 34.5)$ cycles.

*   **Reclaim Time:** This is the time interval between two successive (adjacent) reclosing attempts. It ensures the circuit breaker has completed its operating duty and allows any fault from the previous attempt to fully clear. If a new fault occurs before the reclaim time has elapsed, the ARR must lock out to prevent excessive stress on the breaker. The IEC standard operating cycle for a breaker with auto-reclosing is: **O + 0.3 s + CO + 3 min + CO**.

## 3. Classification of Auto-Reclosing Schemes

Auto-reclosers (ARR) are classified based on three main criteria:

1.  **By Number of Phases:**
    *   **Single-Pole Auto-Reclosing:** Trips and recloses only the faulted phase. The two healthy phases remain in service, maintaining power transfer and synchronizing torque. This is a major advantage for **improving transient stability** on EHV lines. It requires more complex breaker mechanisms and phase selection logic.
    *   **Three-Pole Auto-Reclosing:** Trips and recloses all three phases simultaneously. Simpler but causes a complete interruption of power flow on the line.

2.  **By Number of Attempts:**
    *   **Single-Shot Reclosing:** Executes only one reclosing attempt, then locks out. Preferred for long EHV/UHV lines, especially in areas with high lightning incidence.
    *   **Multi-Shot Reclosing:** Executes two or three reclosing sequences within a specified time interval. Commonly used in distribution systems to improve service continuity.

3.  **By Speed:**
    *   **High-Speed Auto-Reclosing:** Uses a short dead time (typically 0.3-0.5 seconds). Essential for maintaining stability on critical tie lines.
    *   **Delayed (Low-Speed) Auto-Reclosing:** Uses a longer dead time (5-60 seconds). Used where the loss of a single line causes minimal disturbance to system synchronism.

## 4. Application with Distance Protection: Zone Selection

For EHV/UHV lines protected by distance relays, a critical application rule applies: **the auto-reclosing relay is normally activated only for faults detected in Zone-1**. Zone-1 is the instantaneous zone, typically set to cover 80% of the line length. For a fault in this zone, both line-end breakers trip simultaneously via their Zone-1 elements, providing a clean and simultaneous de-energization.

Auto-reclosing is **blocked for Zone-2 and Zone-3 faults**. For these faults, one end trips instantaneously (Zone-1), while the other trips after a time delay (Zone-2 or Zone-3). This non-simultaneous clearing can result in insufficient de-ionization time at the delayed end, increasing the risk of arc restrike and system instability upon reclosing.

## 5. Recloser-Fuse Coordination in Distribution Systems

In distribution networks with laterals protected by fuses, a "fuse saving" philosophy is often employed. The recloser is set to operate first on its **fast curve** for the initial fault. If the fault is transient, the recloser trips quickly, de-energizing the line and allowing the fault to clear. It then recloses successfully, saving the fuse from blowing. If the fault is permanent, the recloser will trip again (typically on a slower curve), allowing the lateral fuse to blow and isolate only the faulted section, minimizing the outage area.

## 6. Worked Examples from Original Assignments

**Example 1: Dead Time Calculation (T1-W5-Q02)**
*   **Question:** For high-speed auto-reclosing of EHV circuit breakers, the minimum dead time (in cycles) is given by $t = 10.5 + frac("kV", 34.5)$. Determine the minimum dead time, in seconds, for a 220 kV system at 50 Hz.
*   **Solution:**
    1.  Calculate dead time in cycles: $t = 10.5 + frac(220, 34.5) = 10.5 + 6.3768 = 16.8768$ cycles.
    2.  Convert cycles to seconds at 50 Hz (1 cycle = 1/50 = 0.02 s): $t_("seconds") = 16.8768 times 0.02 = 0.3375$ s.
    3.  Rounding gives **0.34 s**.
*   **Exam Answer:** 0.34 s (Option C).

**Example 2: IEC Operating Cycle (T1-W5-Q04)**
*   **Question:** As per the IEC standard, a circuit breaker applied with auto-reclosing must be capable of performing which operating cycle with full rated breaking current?
*   **Solution:** The standard duty cycle is: **O (Open) + 0.3 s (dead time) + CO (Close-Open) + 3 min (reclaim time) + CO (Close-Open)**. This sequence tests the breaker's ability to handle the thermal and mechanical stresses of multiple operations.
*   **Exam Answer:** O + 0.3 s + CO + 3 min + CO (Option A).


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q01)
- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q02)
- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q03)
- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q04)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q05)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q06)
- [Type 1, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q08)
- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q09)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q10)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q08)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-05/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
