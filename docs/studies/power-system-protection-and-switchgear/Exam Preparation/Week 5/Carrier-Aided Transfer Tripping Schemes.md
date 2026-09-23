---
title: "Carrier-Aided Transfer Tripping Schemes"
math_syntax: typst
---

# Carrier-Aided Transfer Tripping Schemes

[Week 5 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Carrier-Aided Transfer Tripping Schemes

## Core Principle and Classification

Carrier-aided transfer tripping schemes use a communication channel to send a signal from one line end to the other, with the received signal **initiating** tripping at the remote end. This is the fundamental difference from carrier *blocking* schemes, where the received signal *prevents* tripping. The primary advantage is the elimination of coordination time delays required in blocking schemes. These schemes are classified based on the reach setting of the distance relay's Zone-1 element.

The two main categories are:
*   **Underreach Schemes:** Zone-1 is set to cover less than 100% of the line (typically 80%). Carrier is used to provide instantaneous tripping for faults in the remaining end zones.
*   **Overreach Schemes:** Zone-1 is set to cover more than 100% of the line (typically 120-150%). Carrier is used for confirmation or redundancy to ensure security for external faults.

## Direct Underreach Transfer Tripping Scheme

In this scheme, Zone-1 of both distance relays (R₁ and R₂) is set to cover the standard 80% of the line length. The control circuit is simple: the receiver relay contact (e.g., RR₁-1) is connected directly to the trip circuit.

**Operation:**
1.  **Central Zone Fault (e.g., F₁):** A fault in the middle 60% of the line is seen in Zone-1 by both relays. Both initiate instantaneous, direct tripping of their local breakers. No carrier signal is needed.
2.  **End Zone Fault (e.g., F₂):** A fault in the 20% near Bus B is seen in Zone-1 only by relay R₂. R₂ trips its local breaker and simultaneously sends a carrier signal to Substation A. At Substation A, the receiver relay contact RR₁-1 closes directly, initiating instantaneous tripping of breaker 1.

**Key Disadvantages:**
*   **Security Risk:** The scheme is susceptible to **maloperation** due to the inadvertent closure of the receiver relay contact (RR₁-1 or RR₂-1). This can be caused by electrical noise from switching surges or transients. (Source: T2-W5-Q02, answer key states "its mal-operation due to noise by switching" is the main disadvantage).
*   **Incompatibility with Single-Phase Reclosing:** The scheme requires phase selection logic at each bus to determine the faulted phase for single-pole tripping. This adds complexity and cost, making it generally unsuitable for single-phase auto-reclosing applications. (Source: T2-W5-Q03, answer key states it is not suitable for "single-phase auto-reclosing").

## Permissive Underreach Transfer Tripping Scheme

This scheme improves security over the direct underreach scheme. The control circuit is modified by adding a local fault detector (FD) contact in series with the receiver relay contact.

**Operation:** The zone settings and basic operation for central and end zone faults are identical to the direct underreach scheme. The critical difference is at the remote end receiving the carrier signal. For a fault at F₂, the carrier signal from R₂ closes contact RR₁-1 at Substation A. However, tripping is only initiated if the local fault detector FD₁ has also operated, confirming a fault in the forward direction. This provides "permission" for the remote trip.

**Advantage:** The added fault detector contact prevents maloperation from noise-induced carrier signals, significantly enhancing security. The trade-off is a slightly higher operating time compared to the direct scheme. (Source: T2-W5-Q06, answer key states operating time is "high" compared to direct underreach).

## Overreach Transfer Tripping Scheme

Here, Zone-1 of both relays is set to overreach the protected line, typically to 120-150% of the line length. The control circuit often includes a local fault detector contact in series with the receiver relay contact for security.

**Operation:**
1.  **Internal Fault (e.g., F₁):** Any fault on the line is seen in Zone-1 by both relays. Both trip their local breakers instantaneously and send carrier signals to each other, providing redundant tripping.
2.  **External Fault (e.g., F₂):** A fault beyond Bus B is seen in Zone-1 only by relay R₁ at Substation A. R₁ trips its local breaker and sends a carrier signal to Substation B. However, relay R₂ at Substation B does not operate (the fault is behind it), so it does not initiate a trip at its end and does not send a return signal. Therefore, no maloperation occurs at Substation B.

**Advantage:** Provides high-speed tripping for the entire line section.
**Disadvantage:** If the communication channel fails, there is a risk of maloperation for external faults, as the overreaching Zone-1 elements could trip without carrier confirmation.

## Scheme Comparison and Selection

| Feature | Direct Underreach | Permissive Underreach | Overreach |
| :--- | :--- | :--- | :--- |
| **Zone-1 Setting** | 80% | 80% | 120-150% |
| **Carrier Purpose** | Initiate remote trip for end-zone faults. | Initiate remote trip with local permission. | Confirm/redundant trip for internal faults. |
| **Security** | Low (noise-sensitive). | High (fault detector adds permission). | High (for internal faults). |
| **Speed** | Fastest (no series contact). | Slightly slower than direct. | Fast for all internal faults. |
| **Key Disadvantage** | Maloperation risk; unsuitable for single-phase reclosing. | Slightly slower operation. | Risk of maloperation on external faults if channel fails. |

**Selection:** Permissive underreach is often preferred over direct underreach for its superior security. Overreach schemes are advantageous for ensuring high-speed clearing across the entire line but require a reliable communication channel.


## Source References
*   Lecture 22: Carrier Aided Schemes for Transmission Lines-IV (Prof. Bhaveshkumar Bhalja, IIT Roorkee)
*   Type2 Assignment 5, Questions 2, 3, and 6.


## Assignment questions using this method

- [Type 2, question 2](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q02)
- [Type 2, question 3](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q03)
- [Type 2, question 6](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q06)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-05/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
