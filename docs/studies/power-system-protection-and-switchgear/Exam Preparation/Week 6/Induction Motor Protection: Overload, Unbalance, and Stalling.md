---
title: "Induction Motor Protection: Overload, Unbalance, and Stalling"
math_syntax: typst
---

# Induction Motor Protection: Overload, Unbalance, and Stalling

[Week 6 overview](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-index) · [Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here)

# Power System Protection: Week 6 – Induction Motor Protection: Overload, Unbalance, and Stalling

## 1. Core Concepts and Protection Philosophy

Induction motor protection is critical because motor failure leads to production loss and revenue impact. Protection schemes depend on motor size, importance, and connected load. Small motors may use fuses, while large industrial motors require sophisticated digital/numerical relays.

**Key faults and abnormal conditions:**
- **Overloading** (thermal overload, device 49)
- **Single-phasing** (loss of one phase)
- **Phase unbalance** (negative-sequence currents)
- **Stalling/locked rotor** (device 51)
- **Short circuits** (phase-to-phase faults)
- **Earth faults**
- **Undervoltage** (device 27)

The motor's thermal limit curve defines its withstand capability. Protection relay characteristics must lie below this curve to prevent insulation damage. Overheating reduces motor life significantly—continuous operation 10°C above rated temperature can halve insulation life.

## 2. Thermal Overload Protection (Device 49)

The thermal overload relay models the motor's thermal processes during starting, normal running, and overload conditions. Its characteristic curve must be positioned just below the motor's thermal limit curve—too high risks damage, too low prevents the motor from utilizing its overload capability.

**Motor thermal limit curves include three conditions:**
- Locked rotor/stall condition
- Motor acceleration
- Running overload

Ideally, curves are provided for both hot and cold running conditions. For large motors, acceleration curves are specified at 100% and 80% rated voltage. When setting relays, use the 80% voltage curve as it represents the worst-case starting condition.

**Setting principle:** Calculate the maximum continuous overload current referred to CT secondary, then select the next available setting *below* this value from the relay's setting range.

## 3. Negative-Sequence/Unbalance Protection (Device 46)

Unbalanced currents produce negative-sequence components that cause severe rotor heating—the heat from negative-sequence current is approximately **six times** that from positive-sequence current of the same magnitude.

**Typical causes of unbalance:**
- Single-phasing (fuse failure, contactor issues)
- Unbalanced fault conditions
- Circuit breaker failure

**Setting basis (course convention):** The negative-sequence relay setting is decided based on the ratio of negative-sequence impedance to positive-sequence impedance:

$$
text("Setting") > frac(Z_2, Z_1) times 100%
$$

Typical setting range: 10–50% in steps of 5%. For small motors, DMT or IDMT relays may be used instead of dedicated negative-sequence relays for economic reasons.

**Allowable negative-sequence current:** $I_2^2 times t = 40$ (course convention for motor thermal limits).

## 4. Stalling/Locked Rotor Protection (Device 51)

Stalling occurs when the motor fails to start or runs at significantly reduced speed. The motor can withstand locked-rotor conditions only for a limited time specified by the manufacturer.

**Two protection approaches:**
1. **During starting:** Activated on start detection; uses speed signal and time delay $t_("stall")$
2. **Running condition:** Monitors current continuously

**Key settings:**
- **Current setting ($I_("stall")$):** Typically 1/3 to 1/4 of starting current; range 150–600% of rated current
- **Time setting:** Must satisfy: $t_("acceleration") < t_("setting") < t_("safe stall")$

If the motor doesn't reach required speed before the stall time expires, the relay trips.

## 5. Short Circuit Protection (Devices 50/51)

For large motors (>1000 kW), differential protection (87) is used. For smaller motors, overcurrent relays provide phase-fault protection.

**Critical setting rule:** The pickup must be set **above** the maximum starting current to avoid mal-operation during normal starting. If this isn't possible, interlocking blocks the relay during starting.

Instantaneous overcurrent relay setting range: 400–2000% of rated current.

## 6. Worked Examples from Original Assignments

### Example 1: Thermal Relay Setting (T2-W6-Q09)

**Given:** 2500 HP, 3-phase, 50 Hz motor; PF = 0.8 lagging; Rated voltage = 11,000 V; Continuous overload = 120% of rated current; CT ratio = 200/1 A; Thermal relay setting range = 70–130% of 1 A in steps of 5%.

**Solution:**

Calculate rated current (assuming unity efficiency per source convention):
$$
I = frac(2500 times 746, sqrt(3) times 11000 times 0.8) = 122.36 " A"
$$

Maximum continuous overload current:
$$
I_("max") = 1.2 times 122.36 = 146.83 " A"
$$

Referred to CT secondary:
$$
I_("secondary") = frac(146.83, 200) = 0.7342 " A" = 73.42%
$$

**Exam answer:** Select the next available setting **below** 73.42% → **70% (Option A)**

*Note: The source omits motor efficiency. With actual efficiency η, divide load current by η, which may change the selected setting.*

### Example 2: NPS Relay Setting Basis (T2-W6-Q10)

**Question:** The setting of NPS relay is decided on the basis of:

**Exam answer:** **The ratio of negative sequence impedance to positive sequence impedance (Option A)**

This is the course-specific convention. While the relay measures current, the setting decision uses the impedance ratio $Z_2/Z_1$.


## Assignment questions using this method

- [Type 1, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t1-w6-q09)
- [Type 2, question 9](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q09)
- [Type 2, question 10](/notes/studies-power-system-protection-and-switchgear-exam-preparation-week-6-assignment-solutions#t2-w6-q10)

## Source grounding

Original lecture transcript/OCR: MITEEE `data/psps-ocr/week-06/ocr.md`. Assignment-specific solutions below preserve the supplied question and key; ambiguous originals are labelled.
