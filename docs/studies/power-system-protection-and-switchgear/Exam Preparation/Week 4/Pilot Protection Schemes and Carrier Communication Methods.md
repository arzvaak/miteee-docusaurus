---
title: "Pilot Protection Schemes and Carrier Communication Methods"
math_syntax: typst
---

# Pilot Protection Schemes and Carrier Communication Methods

[Week 4 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Pilot Protection Schemes and Carrier Communication Methods

## 1. Why Pilot Protection? The Limitation of Distance Relays

Distance relays provide excellent protection but have a critical limitation: they cannot guarantee simultaneous high-speed tripping for faults near the ends of a transmission line (the "end zones"). A relay at one end may operate instantaneously for a fault in its Zone 1 (typically 80% of the line), but the remote end relay will see the same fault in its Zone 2, introducing a time delay. This delay can compromise system stability on critical, high-voltage lines.

Pilot protection (or carrier-aided schemes) solves this by using a communication channel to exchange information between relays at both ends. This allows them to make a coordinated decision, enabling **simultaneous, high-speed tripping** for all internal faults along the entire line length. The key advantage is not lower cost, but enhanced speed and reliability for system stability.

## 2. Core Principle and Main Scheme Classifications

The fundamental principle is to compare electrical quantities (current magnitude, phase angle, or direction) from both ends of the protected line. Based on the communication method and tripping logic, schemes are classified as:

**A. Wire Pilot Relaying:** Uses dedicated metallic pilot wires to transmit signals. It is generally limited to **short transmission lines (up to ~20 km)** due to high cost, problems with induced voltages, and sensitivity reduction from cable charging current. The three main types are:
*   **Circulating Current:** Relays are connected in series via pilot wires.
*   **Opposed Voltage:** Relays are connected in parallel, with voltages in opposition during normal conditions.
*   **Translay:** A modified scheme using induction principles.

**B. Carrier Current Protection:** Uses the transmission line itself or another communication channel (microwave, fiber optic) to transmit a high-frequency carrier signal. This is the dominant method for longer lines. It is sub-classified by function:
*   **Carrier Tripping (Intertripping):** The carrier signal is used to **initiate** tripping at the remote end for an internal fault.
*   **Carrier Blocking:** The carrier signal is used to **block** tripping at the remote end for an external fault. For internal faults, the absence of a blocking signal allows tripping.

## 3. Phase Comparison Scheme: A Key Carrier Blocking Example

The phase comparison scheme is a common implementation of a carrier blocking scheme. It compares the phase angle between the currents entering the protected line from both ends.

*   **Normal/External Fault Condition:** The currents at both ends are in phase (phase difference = 0°, per the course convention where both currents are referenced as entering the zone). The local relay transmits a **blocking signal** to the remote end, preventing it from tripping.
*   **Internal Fault Condition:** The currents at both ends are out of phase (phase difference = 180°). The local relay does **not** send a blocking signal. The remote end, receiving no block, trips its breaker.

The scheme can be implemented as a **single-phase comparison** (comparing one half-cycle per power cycle, introducing a half-cycle delay) or a **dual-phase comparison** (comparing both half-cycles for faster operation).

## 4. Communication Channels and Their Frequency Ranges

The choice of communication channel is critical. The key is to memorize the frequency band for each type, as this is a common MCQ topic.

| Channel Type | Typical Frequency Range | Key Characteristics & Use |
| :--- | :--- | :--- |
| **Audio Frequency** | 0.02 – 20 kHz | Obsolete. Used tone generators. |
| **Power Line Carrier** | 30 – 600 kHz | Superimposes carrier on power line. Uses **coupling capacitors** and **wave traps**. |
| **Radio Frequency** | 10 kHz – 0.1 GHz | Requires a license. Susceptible to interference. |
| **Microwave** | 0.3 – 3 GHz | Line-of-sight propagation. High capacity. |
| **Fiber Optic** | Wavelength: 0.85 – 1.6 μm | Highest capacity. Immune to EMI. Preferred for new installations. |

**Component Functions (Critical Distinction):**
*   **Wave Trap (Line Trap):** A parallel LC circuit. Provides **low impedance to power frequency (50/60 Hz)** and **high impedance to the carrier frequency**. It prevents the carrier signal from being shorted at the substation.
*   **Coupling Capacitor:** Provides **low impedance to the high-frequency carrier signal** and **high impedance to the power frequency**. It couples the carrier onto the line and blocks the high voltage power frequency.

## 5. Worked Examples from Original Assignments

**Example 1: Scheme Classification (ID: T1-W4-Q01)**
*   **Question:** Additional time delay or coordination is generally not required in...
*   **Analysis:** A carrier tripping scheme uses the signal to directly initiate tripping at the remote end, eliminating the need for time grading. A carrier blocking scheme requires a short delay to wait for the absence of a blocking signal.
*   **Exam Answer:** **1. carrier tripping scheme.**

**Example 2: Communication Channel Frequency (ID: T2-W4-Q05)**
*   **Question:** The normal range of audio frequency is...
*   **Analysis:** This is a direct recall of the frequency band defined in the lecture. The correct range for audio frequency is 0.02 to 20 kHz.
*   **Exam Answer:** **3. 0.02–20 kHz**


## 7. Source Sections

*   Lecture 19: Carrier Aided Schemes for Transmission Lines-I
*   Lecture 20: Carrier Aided Schemes for Transmission Lines-II


## Assignment questions using this method

- [Type 1, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q01)
- [Type 1, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q02)
- [Type 1, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q03)
- [Type 1, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q04)
- [Type 1, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q05)
- [Type 1, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q06)
- [Type 1, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q08)
- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q09)
- [Type 1, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t1-w4-q10)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q05)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q06)
- [Type 2, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q07)
- [Type 2, question 8](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q08)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-4-assignment-solutions#t2-w4-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-04/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
