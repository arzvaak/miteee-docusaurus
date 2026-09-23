---
title: "Carrier Blocking and Unblocking Schemes"
math_syntax: typst
---

# Carrier Blocking and Unblocking Schemes

[Week 5 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Week 5: Carrier Blocking and Unblocking Schemes

## 1. Core Principle: Blocking vs. Unblocking

Carrier-aided schemes use a communication channel (e.g., power line carrier, microwave) to exchange information between relays at line ends, enabling high-speed protection for the entire line length. The fundamental distinction is whether the received carrier signal is used to **block** or **initiate** tripping.

*   **Carrier Blocking Scheme:** The carrier signal received from the remote end is used to **block** the operation of the local distance relay. It is primarily used for external fault discrimination.
*   **Carrier Unblocking Scheme:** A continuous low-energy "guard" signal is transmitted. For an internal fault, the signal is shifted from a blocking (guard) frequency to an unblocking (trip) frequency, which **initiates** tripping.

## 2. Carrier Blocking Scheme: Operation & Disadvantage

**Operation:** Relays (R1, R2) are set with Zone-1 reach of 120-150% of the line. Reverse-looking relays (RLR) detect faults behind the bus. For an internal fault, both R1 and R2 operate instantaneously without sending a blocking signal. For an external fault (e.g., F2), the reverse-looking relay at the healthy end (RLR_B) operates and sends a blocking signal to the remote end (Substation A), preventing R1 from tripping.

**Key Disadvantage:** Requires a deliberate coordination time delay between the local distance relay and the receiver relay to avoid maloperation during external faults. This delay compromises the instantaneous Zone-1 operation. It is also susceptible to maloperation if the carrier signal fails or is delayed.

## 3. Carrier Unblocking Scheme: Operation & Advantage

**Operation:** A continuous low-energy "guard" signal is transmitted on a separate channel. This signal normally blocks tripping. When a local relay detects an internal fault, it shifts the channel to the trip frequency. The remote receiver detects this shift, unblocks, and allows tripping. For external faults, only one end may shift to trip frequency, but the other end's channel remains in guard, preventing a trip.

**Key Advantage:** Eliminates the coordination time delay required in the blocking scheme, allowing for faster overall operation.

## 4. Recognition Cues & Common Pitfalls

**Recognition Cues:**
*   **Blocking Scheme:** Uses reverse-looking relays; carrier signal prevents tripping; requires coordination delay.
*   **Unblocking Scheme:** Uses continuous guard signal; carrier signal shift enables tripping; no coordination delay.

**Common Pitfalls:**
*   Assuming the blocking signal is always sent for internal faults (it is not).
*   Confusing the purpose of the reverse-looking relay (it detects faults *behind* the local bus, not on the protected line).
*   Overlooking the maloperation risk in blocking schemes due to signal failure.

## 5. Worked Example: Conceptual MCQ (Original ID: T1-W5-Q07)

**Question:** Compared with a permissive transfer-trip scheme, the carrier-blocking scheme has the disadvantage that...
**Options:** (a) a deliberate coordination time delay must be allowed to wait for a possible blocking signal. (b) it operates faster than necessary. (c) it requires no relays. (d) it cannot detect external faults.

**Exam Answer:** (a) a deliberate coordination time delay must be allowed to wait for a possible blocking signal.

**Explanation:** In a carrier-blocking scheme, the local distance relay must wait for a short coordination time to see if a blocking signal arrives from the remote end before it can trip for a fault in its overreach zone. This delay is necessary to prevent maloperation for external faults but compromises the high-speed operation desired for internal faults. Permissive transfer-trip schemes use the carrier signal to *initiate* tripping and do not require this coordination delay, allowing for faster overall operation.

## 6. Worked Example: Conceptual MCQ (Original ID: T2-W5-Q01)

**Question:** Carrier blocking scheme use an additional time delay or coordination time to avoid maloperation...
**Options:** (a) during external fault (b) during power swing (c) due to transients (d) during symmetrical fault

**Exam Answer:** (a) during external fault

**Explanation:** In a carrier-blocking scheme, the local distance relay's Zone-2 or Zone-3 element may operate for a fault just beyond the remote bus (an external fault). To prevent this maloperation, a coordination time delay is introduced. The local relay waits for this delay to see if a blocking signal arrives from the remote end's reverse-looking relay. If the signal arrives, the local relay is blocked. This coordination is specifically to ensure correct discrimination for external faults.


## Assignment questions using this method

- [Type 1, question 7](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t1-w5-q07)
- [Type 2, question 1](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q01)
- [Type 2, question 4](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q04)
- [Type 2, question 5](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-5-assignment-solutions#t2-w5-q05)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-05/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
