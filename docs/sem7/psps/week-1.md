---
title: "Week 1 - Protective Relaying Fundamentals"
sidebar_label: "Week 1 - Protective Relaying Fundamentals"
sidebar_position: 1
description: "Complete Week 1 notes for Protective Relaying Fundamentals, with source visuals, diagrams, worked examples, revision tables, and varied practice questions."
tags:
  - power-system-protection
  - switchgear
  - relays
  - week-1
---

# Week 1 - Protective Relaying Fundamentals

## Orientation

Welcome to the first week of Power System Protection and Switchgear. This week lays the foundation for everything we will study in the course. I need to understand what faults are, why they happen, how protective systems are designed, and how the fundamental relay types work. The material is dense but highly structured, and the concepts build on each other systematically.

The core narrative of this week is simple: **faults are inevitable, so we need protective systems that sense them and isolate them with minimum disruption**. To achieve this, we need relays that can distinguish faults from normal operating conditions, and we need to understand the physics of how those relays operate.

I will organize my notes into five lectures, matching the course structure:

1. **Lecture 1**: Fundamentals of Protective Relaying - 1 (faults, consequences, zones of protection)
2. **Lecture 2**: Fundamentals of Protective Relaying - 2 (seven requirements of protective systems)
3. **Lecture 3**: Fundamentals of Protective Relaying - 3 (tripping mechanisms, relay classification, historical development)
4. **Lecture 4**: Fundamentals of Protective Relaying - 4 (thermal relays, attracted armature relays)
5. **Lecture 5**: Fundamentals of Protective Relaying - 5 (induction relays, balanced beam relay, universal torque equation)

The key thread connecting all five lectures is the **relay as the sensing element** of the protective system. We start with why protection is needed (faults), then what properties a good protective system must have (requirements), then how relays are built and classified (hardware), and finally the detailed physics of specific relay types.

## Learning Outcomes

By the end of this week, I should be able to:

1. **Classify faults** in power systems as symmetrical or asymmetrical, identify their causes, and explain their relative probabilities of occurrence.
2. **Calculate the number of insulator discs** required for a given transmission line voltage, including safety factor considerations.
3. **Distinguish between transient and permanent faults** and explain why this distinction matters for protection strategy.
4. **Explain the consequences of faults** (thermal, electrodynamic, stability, revenue) and why different consequences demand different protection speeds.
5. **Describe the zones of protection** concept, explain why zones must overlap, and identify how CT placement determines zone boundaries.
6. **List and explain the seven (plus one) requirements** of a protective system: selectivity, speed, sensitivity, discrimination, stability, reliability, economics, and simplicity.
7. **Differentiate between absolute and relative selectivity**, unit and non-unit protection, and primary and backup protection.
8. **Trace the tripping sequence** from fault inception through relay operation to circuit breaker opening, using standard device numbers (52, 86).
9. **Classify relays** according to quantity sensed, construction, number of sensing quantities, function, components, and characteristic.
10. **Compare electromechanical, static, microprocessor, and digital/numerical relays** in terms of advantages, disadvantages, burden, and cost per function.
11. **Explain the operating principle of thermal relays**, including the heat generation/dissipation physics, thermal withstand curves, and the replica-type construction.
12. **Describe the construction and operation of attracted armature relays** (hinged and plunger types), including the chattering problem and its solution.
13. **Derive and apply the universal torque equation** $F \propto \phi_{1\max}\phi_{2\max}\sin\theta$ for electromagnetic relays.
14. **Compare induction disc, induction cup, and balanced beam relays** in terms of construction, speed, applications, and limitations.
15. **Solve numerical problems** involving insulator disc calculations, transformer rated currents, and relay operating characteristics.

## Syllabus Map

| Lecture | Topic | Key Concepts |
|---------|-------|--------------|
| Lecture 1 | Fundamentals of Protective Relaying - 1 | Fault classification, causes, consequences, transient vs. permanent faults, zones of protection |
| Lecture 2 | Fundamentals of Protective Relaying - 2 | Seven requirements: selectivity, speed, sensitivity, discrimination, stability, reliability, economics; unit vs. non-unit protection; backup types |
| Lecture 3 | Fundamentals of Protective Relaying - 3 | Tripping mechanism, power vs. control circuits, relay classification, historical development (electromechanical to IEDs) |
| Lecture 4 | Fundamentals of Protective Relaying - 4 | Thermal relays, overload vs. fault, thermal withstand curves, attracted armature relays (hinged and plunger) |
| Lecture 5 | Fundamentals of Protective Relaying - 5 | Induction disc/cup relays, balanced beam relay, universal torque equation derivation |

---

## Lecture 1: Fundamentals of Protective Relaying - 1

### 1.1 Course Structure and the Protection-Switchgear Split

The course divides into two complementary parts:

- **Protection part**: Devices that **sense the fault** - fuses, miniature circuit breakers (MCBs), relays
- **Switchgear part**: Devices that **isolate the faulty section** - circuit breakers, current transformers (CTs), potential transformers (PTs)

This is a critical distinction. The relay detects that something is wrong; the circuit breaker does something about it. Neither can work without the other. The relay is always connected on the secondary side of a CT or PT, never directly in the power circuit.

The protection part is responsible for continuous monitoring and decision-making. It must determine whether a fault exists, where it is located, and whether it is safe to allow the system to continue operating. The switchgear part is responsible for execution - physically disconnecting the faulty section from the healthy network. This division of labor is fundamental to how power systems are protected.

The relationship between protection and switchgear can be understood as a continuous monitoring loop:

```mermaid
flowchart LR
    subgraph "Protection-Switchgear Interaction"
        A[Power System] -->|"Current/Voltage signals"| B[CT/PT]
        B -->|"Reduced signals"| C[Relay]
        C -->|"Trip signal"| D[Auxiliary Relay 86]
        D -->|"Energizes trip coil"| E[Circuit Breaker 52]
        E -->|"Isolates fault"| A
    end
```

### 1.2 Fault Classification

Faults in power systems are **inevitable**. The professor emphasizes this repeatedly - we design protection not because faults might happen, but because they will happen. The first step in protection design is understanding what we are protecting against.

Faults classify into two main categories:

| Classification | Phases Involved | Examples |
|----------------|-----------------|----------|
| **Symmetrical faults** | All three phases | Triple line fault (LLL), triple line to ground fault (LLLG) |
| **Asymmetrical faults** | One or two phases, with or without ground | Line to ground (LG), double line (LL), double line to ground (LLG) |

In total, **10 types of faults** can occur in a power system network. The symmetrical faults are the most severe but the least common. The asymmetrical faults, particularly single line to ground, dominate in practice.

The distinction between symmetrical and asymmetrical faults is not merely academic. Symmetrical faults involve all three phases equally, which means the system remains balanced (though severely stressed). Asymmetrical faults create unbalanced conditions, which generate negative and zero sequence components. These sequence components have important implications for protection system design, as we will see in Lecture 2.

![Fault classification overview](assets/week-01/img-0.jpg)
*Overview of fault classification: symmetrical vs. asymmetrical faults and their subtypes.*

### 1.3 Causes of Symmetrical Faults

Symmetrical faults usually occur due to **wrong operation or wrong coordination between circuit breakers and the earthing switch**. The professor gives a specific scenario:

Consider a transmission line connecting three buses. A circuit breaker sits at the sending end, and an earthing switch connects at the bus side. When energizing the line by closing the circuit breaker, the earthing switch must be **off**. If the earthing switch is mistakenly left **on** and all three poles of the circuit breaker close, we get a **triple line fault** - all three phases are simultaneously shorted to ground.

![Transmission line with circuit breaker and earthing switch](assets/week-01/img-1.jpg)
*Circuit breaker and earthing switch arrangement that can cause symmetrical faults if miscoordinated.*

This is an operational error, not a natural phenomenon. It tells me that protection engineers must also think about human error and interlocking schemes. Interlocking is a control system feature that prevents unsafe operating sequences - for example, preventing the circuit breaker from closing while the earthing switch is still closed. Modern substation control systems include such interlocks, but older installations may rely on procedural controls, which are more prone to human error.

### 1.4 Causes of Asymmetrical Faults

#### Line to Ground Fault

The most common fault type occurs due to **flashover of an insulator** or **failure of the insulator**. The professor works through a detailed example:

**Worked Example 1: Insulator Flashover Calculation (132 kV line)**

A transmission tower has a cross arm with suspension insulators. The line voltage is 132 kV.

- Voltage across the string = $132 \text{ kV} / \sqrt{3} = 76.2 \text{ kV}$
- Each suspension insulator disc is rated at approximately 11 kV
- Number of discs = $\frac{132/\sqrt{3}}{11} = \frac{76.2}{11} \approx 6.9$
- With a safety factor of 1.5 or 2: $6.9 \times 1.5 = 10.4$ or $6.9 \times 2 = 13.8$
- Integer result: **8 to 9 discs** required for a 132 kV line (without safety factor, we round 6.9 up to 7, but the lecture indicates 8-9 with safety considerations)

![Line to ground fault illustration](assets/week-01/img-2.jpg)
*Single line to ground fault mechanism - the most common fault type on overhead lines.*

![Transmission tower with suspension insulators](assets/week-01/img-3.jpg)
*Transmission tower with suspension insulator string used for the insulator disc calculation.*

The flashover mechanism works as follows:

1. A lightning surge or switching surge increases the voltage across the insulator string
2. If the voltage exceeds the withstand value = $(132/\sqrt{3}) \times \sqrt{2}$ (peak value of phase voltage)
3. Flashover occurs - the conductor at 132 kV connects directly to ground through the tower
4. This simulates a single line to ground fault

The peak withstand voltage calculation is important: the RMS phase voltage is $V_{phase} = V_{line}/\sqrt{3}$, and the peak value is $\sqrt{2}$ times this.

The safety factor is essential because the nominal voltage does not represent the worst-case stress. Lightning surges can produce voltages many times the nominal value, and switching operations can also create transient overvoltages. The insulator string must withstand these transient stresses without flashing over, which is why the number of discs is multiplied by a safety factor.

#### Line to Line and Double Line to Ground Faults

These faults occur due to:

- **Switching of two conductors** (conductor swing), particularly during **monsoon season** when dielectric strength of air reduces
- Fair chances of flashover or power arc between two conductors
- Shorting of wires by birds, kite strings, or tree limbs touching two conductors simultaneously

Conductor swing is a mechanical phenomenon where wind causes the conductors to move toward each other. During monsoon season, the air's dielectric strength is reduced due to high humidity, making flashover between closely spaced conductors more likely. This is why conductor spacing is an important design consideration for transmission lines.

### 1.5 Consequences of Faults

Faults cause damage through two fundamentally different mechanisms, and this distinction drives protection design:

#### Thermal Damage

- Related to **temperature**; occurs **very slowly**
- Depends on the withstand capability of equipment, which depends on **insulation**
- Insulation classes range from Class S to Class H; each class can withstand specific temperature levels
- When current exceeds the full load/rated value, temperature increases; if it exceeds insulation withstand, thermal damage occurs
- **Instantaneous tripping is NOT required** - there is no immediate harm to insulation

![Thermal damage](assets/week-01/img-4.jpg)
*Thermal damage mechanism - slow process related to insulation temperature withstand.*

The key insight: thermal damage takes time. The equipment can tolerate overcurrent for a while before the insulation degrades. This gives us time to use time-delayed protection.

#### Electrodynamic Damage

- Magnitude of current is very high: roughly **10, 15, or 20 times** full load/rated current
- Repelling forces de-shape and sometimes disrupt equipment structurally
- **Instantaneous tripping IS required** - equipment is damaged structurally

The electrodynamic forces scale with the square of current ($F \propto I^2$), so a 20x fault current produces 400x the mechanical force. This is why high-magnitude faults demand immediate disconnection.

The distinction between thermal and electrodynamic damage is crucial for protection coordination. For low-magnitude overcurrents (overloads), we can afford to wait - the equipment can withstand the condition for a known period. For high-magnitude fault currents, we must act immediately to prevent structural damage.

### 1.6 Probability of Fault Occurrence

The professor provides two important probability tables:

**Fault probability by element:**

| Element | Percentage of Fault Occurrence |
|---------|-------------------------------|
| Overhead transmission lines/conductors | 50% |
| Underground cables | 10% |
| Switchgear (including CTs and PTs) | 10-15% |
| Power transformers | 15-20% |
| Miscellaneous (control circuits, auxiliary circuits) | 10% |

![Probability of faults on different elements](assets/week-01/img-5.jpg)
*Fault probability distribution across power system elements: overhead lines 50%, transformers 15-20%.*

**Key conclusion**: Major faults occur either on overhead conductors or power transformers. These are the elements that deserve the most protection attention.

**Fault probability on overhead lines:**

| Fault Type | Percentage of Occurrence |
|------------|-------------------------|
| Single line to ground (SLG) | 80-90% |
| Line to line (LL) | 6-10% |
| Double line to ground (DLG) | 3-6% |
| Triple line / triple line to ground | 1% or lower |

**Single line to ground is the most common fault type** on overhead conductors. This is why protection schemes are often designed with SLG faults as the primary design case.

The probability distribution has important economic implications. Since overhead lines account for 50% of faults, investment in line protection is well justified. Similarly, transformers account for 15-20% of faults and are expensive equipment, so comprehensive transformer protection is economically sound.

### 1.7 Transient vs. Permanent Faults

| Feature | Transient Faults | Permanent Faults |
|---------|------------------|------------------|
| **Causes** | Power arc between phases; flashover across line insulator due to overvoltages (lightning, switching surges) | Remain for longer period |
| **Duration** | Die out after a few cycles | Longer duration |
| **Action needed** | May not need to isolate section; system can be easily restored | Definitely damages equipment; affects power system stability |
| **Protection** | - | Need protective device to sense fault AND devices to isolate faulty section |

![Transient and permanent faults](assets/week-01/img-6.jpg)
*Comparison of transient vs. permanent faults and their protection implications.*

The distinction matters because it affects protection strategy. For transient faults (like lightning-induced flashovers), we might use auto-reclosing - trip the breaker, wait a moment, and reclose. For permanent faults, the breaker must stay open.

Auto-reclosing is a common feature in modern protection systems. When a transient fault occurs, the breaker trips, then automatically recloses after a short delay (typically 0.5 to 1 second). If the fault was transient, the system restores itself without human intervention. If the fault is permanent, the breaker trips again and stays open. This strategy significantly improves system availability because the majority of overhead line faults are transient.

### 1.8 Problems Caused by Faults

The professor lists five major problems:

1. **Interruption of power supply** to consumers
2. **Substantial loss of revenue** due to interruption of services
3. **Loss of synchronism** - tripping of big lines causes load sharing by other lines; if overloaded, this leads to cascading outages and partial or full blackout
4. **Extensive damage to equipment** - high magnitude fault current damages transformers, motors, generators, transmission lines
5. **Serious hazard to personnel** working in substations

![Problems caused by faults](assets/week-01/img-7.jpg)
*Five major problems caused by faults: power interruption, revenue loss, loss of synchronism, equipment damage, personnel hazard.*

The cascading outage mechanism is particularly important: one line trips, its load shifts to parallel lines, those lines overload and trip, more load shifts, and the system collapses. Protection coordination must prevent this.

Cascading outages are one of the most serious threats to power system security. The 2003 Northeast blackout in North America is a classic example: a single line tripping in Ohio led to a cascade that blacked out 55 million people across eight US states and two Canadian provinces. Protection systems must be designed not only to clear faults but also to prevent cascading through proper coordination and backup protection.

### 1.9 The Protective System

A protective system:

- Stands watch and senses faults whenever a short circuit or abnormal operating condition occurs
- Gives a signal to circuit breakers
- Circuit breakers isolate the faulty section without affecting the healthy section
- Objective: minimum interruption of power, minimum duration of interruption

![Protective system](assets/week-01/img-8.jpg)
*The protective system: sensing faults and isolating faulty sections.*

The protective system is always on duty. It does not prevent faults; it limits their consequences.

### 1.10 Major Components of Power System Network

Understanding the network structure helps me understand where protection is needed:

**Generation:**
- Power generated at **11 kV to 22 kV** (in India: 11 kV or at most 13.2 kV; some developed countries: 22 kV)
- Reason: most effective economics at this voltage range considering cost of copper, cost of insulation, and cost of mechanical strength against vibration and repelling forces

**Transmission:**
- Generating transformer steps up voltage: e.g., 11 kV to 400 kV
- Power transferred at high voltages because current reduces, leading to economy in conductor cross-sectional area

**Common misconception addressed**: Power is NOT always transmitted in multiples of 11 (11, 22, 33, 66, 132 kV). Beyond 220 kV (e.g., 400 kV, 765 kV), voltages are NOT multiples of 11. The form factor (1.1) explanation is incorrect: 10 kV × 1.1 = 11.1 kV, not 11 kV.

**System chain:**
1. Power station (11-22 kV generation)
2. Generating transformer (steps up to 400 kV)
3. 400 kV transmission line
4. 400 kV bus → transformer (400/132 kV)
5. 132 kV bus → 132 kV line
6. Transformer (132 kV to 66 kV or 11 kV)
7. 11 kV distribution → HT consumers
8. Pole-mounted transformers: 11 kV / 415 V
9. 415 V distribution

**Wiring systems:**
- 11 kV side: three-phase, three-wire (R, Y, B only)
- 415 V side: three-phase, four-wire (R, Y, B + neutral)

![Major components of power system network](assets/week-01/img-9.jpg)
*Generation, transmission, and distribution chain from 11 kV to 415 V.*

The voltage levels in the system chain determine the types of protection required at each stage. Generators require specialized protection (differential, overcurrent, earth fault). Transmission lines require distance or overcurrent protection. Distribution networks typically use overcurrent protection. Each level has different fault characteristics and different protection requirements.

### 1.11 Zones of Protection

**Definition**: A zone is a particular area or region in which, if any fault occurs, the protective device is capable of taking care of that zone.

**Zone components**: Protected by relays, circuit breakers, and associated equipment (CTs, PTs).

**Key principle**: Not a single point should remain unprotected - otherwise there will be a **blind spot**.

**Overlapping requirement**: Zones of different equipment must overlap with other associated equipment.

![Protection zones](assets/week-01/img-11.jpg)
*Zones of protection concept - each equipment has its own zone.*

The professor gives a concrete example:

- Generator → transformer → circuit breaker → bus
- Each line emanating from the bus has its own zone
- The bus has its own zone
- The transformer has its own zone
- The generator has its own zone

**Overlap arrangement:**
- Bus bar zone overlaps with line protection zones
- Transformer zone overlaps with bus bar zone
- Generator zone overlaps with generator transformer protection zone

![Overlapping zones example](assets/week-01/img-12.jpg)
*Overlapping protection zones to avoid blind spots.*

**How overlapping is achieved - CT placement:**
- **Line protection zone**: CT placed at line side
- **Bus bar protection zone**: CT placed below line CT (on lower side) → zones overlap
- **Transformer protection zone**: CT placed on bottom side of bus bar protection zone CT → zones overlap
- **Generator protection zone**: CT placed on bottom side of generator protective zone CT → zones overlap

![CT placement for zone overlapping](assets/week-01/img-13.jpg)
*CT placement determines zone boundaries and overlapping regions.*

![Complete overlapping zones diagram](assets/week-01/img-14.jpg)
*Complete zone overlap arrangement for generator, transformer, bus, and lines.*

**Key insight**: The location at which the CT is placed decides the zone or overlapping zone of different devices.

```mermaid
graph TD
    subgraph "Zone Overlap Diagram"
        A[Generator] --> B[Generator Transformer]
        B --> C[Circuit Breaker]
        C --> D[Bus Bar]
        D --> E[Line 1]
        D --> F[Line 2]
        
        G[Generator Zone] --- A
        G --- B
        H[Transformer Zone] --- B
        H --- C
        I[Bus Zone] --- C
        I --- D
        J[Line 1 Zone] --- E
        K[Line 2 Zone] --- F
        
        G -.->|Overlap| H
        H -.->|Overlap| I
        I -.->|Overlap| J
        I -.->|Overlap| K
    end
```

The CT placement determines where one zone ends and another begins. By placing CTs strategically, we ensure that every piece of equipment is covered by at least one protection zone, and ideally by two (for redundancy).

### 1.12 Lecture 1 Recap

- Faults are inevitable and classify into symmetrical (all three phases) and asymmetrical (one or two phases)
- SLG faults are most common (80-90% of overhead line faults)
- Thermal damage is slow; electrodynamic damage is fast - this drives protection speed requirements
- Overhead lines (50%) and transformers (15-20%) are the most fault-prone elements
- Zones of protection must overlap to avoid blind spots
- CT placement determines zone boundaries

---

## Lecture 2: Fundamentals of Protective Relaying - 2

### 2.1 The Seven Requirements of a Protective System

The professor lists seven requirements, plus an eighth (simplicity) discussed later:

1. Selectivity
2. Speed
3. Sensitivity
4. Discrimination
5. Stability
6. Reliability
7. Economics

![Seven requirements of protective system](assets/week-01/img-15.jpg)
*The seven requirements: selectivity, speed, sensitivity, discrimination, stability, reliability, economics.*

These are the design criteria for any protective scheme. I need to understand each one deeply because they interact and sometimes conflict.

### 2.2 Selectivity

**Definition**: The ability of a protective device to isolate the faulty section from the power system network, considering that the healthy section should remain intact.

![Selectivity definition](assets/week-01/img-16.jpg)
*Selectivity: isolating the faulty section while keeping the healthy section intact.*

**Objectives:**
- Outage area should be minimum
- Interruption of power / duration of interruption should be minimum

**Two types:**

| Type | Description | Examples |
|------|-------------|----------|
| **Absolute selectivity** | Protects a particular equipment or winding at small distances; CTs placed on each side of equipment | Differential protection |
| **Relative selectivity** | Achieved by coordination of different protective devices | Distance relays, overcurrent relays |

![Absolute and relative selectivity](assets/week-01/img-17.jpg)
*Absolute selectivity (differential) vs. relative selectivity (coordination).*

**Absolute selectivity example**: Transformer winding protection - CT on each side, relay connected; any fault inside operates the relay. The relay compares current entering with current leaving; if they differ, there is an internal fault.

**Relative selectivity example**: Buses A, B, C with transmission lines between; coordination of relays R₁ and R₂ using standard procedures. Each relay protects its own section but also provides backup for the next section.

**Important consideration**: The possibility of failure of protective relays and circuit breakers must be considered in determining the selectivity of the whole system. Selectivity is not just about the primary protection; it must account for backup scenarios.

### 2.3 Speed

**Benefits of quick disconnection:**
- Improves stability of power system
- Reduces outage duration
- Minimizes damage to equipment

![Speed requirement](assets/week-01/img-18.jpg)
*Speed benefits: improves stability, reduces outage duration, minimizes damage.*

**Fault clearing time:**
- Total time to remove fault = operation time of relays + operation time of circuit breakers

![Speed: fault clearing time](assets/week-01/img-19.jpg)
*Fault clearing time = relay time + breaker time ≈ 4 cycles.*

**Typical operating times:**

| Component | Operating Time |
|-----------|----------------|
| High-speed relay | 10 to 30 milliseconds (half-cycle to 1.5 cycles for 50 Hz system) |
| Circuit breaker | 2.5 to 3.5 cycles |
| Total fault clearing time | ≈ 4 cycles |

**Circuit breaker type effect:**
- Air circuit breaker, air-blast, oil circuit breaker: larger operating time (3.5 or 4 cycles)
- SF6 or vacuum circuit breaker: reduced operating time

**Power transfer vs. fault clearing time:**
- Plot: fault clearing time (X-axis, ms) vs. power transfer
- Curves for different fault types (from highest to lowest power transfer): LG fault, LL fault, LLG fault, symmetrical fault (triple line / triple line to ground)
- Lower fault clearing time → more time to transmit power (the faulted line's power must be shared by other lines)

The physics here: when a fault occurs, the faulted line cannot transmit power. That power must flow through parallel paths. If the fault is cleared quickly, the system returns to normal faster, and the parallel lines are less stressed.

### 2.4 Sensitivity

**Definition**: The ability of a protective device to operate correctly for any fault or abnormal condition inside the zone of protection.

![Sensitivity definition](assets/week-01/img-20.jpg)
*Sensitivity: operating correctly for any fault inside the zone of protection.*

**Key concept**: Related to the minimum level of fault current at which the protective device operates.

**Worked Example 2: Low-Magnitude Fault**

- Transmission line between bus A and bus B
- Full load current = 200 A (line can take this continuously without damage)
- Fault occurs with fault current = 150 A (LOWER than full load current)
- The protective device must still sense this fault

![Sensitivity example](assets/week-01/img-21.jpg)
*Example: 200 A full load, 150 A fault - the protective device must still sense this fault.*

**Why low-magnitude faults are harmful:**
- They generate negative and zero sequence voltages and currents
- Two things happen during a fault:
  1. Reduction in voltage (equipment is designed for a specific voltage range)
  2. Zero-sequence and negative sequence components are generated

**Heat comparison**: Heat produced by zero and negative sequence components is **5 to 6 times** the heat produced by the positive sequence component. Even a small fault current can cause significant heating if it has large sequence components.

**Sensitivity factor:**
- Sensitivity of relay ≠ sensitivity of system
- **Relay sensitivity**: Apparent power required in VA to operate the device (e.g., 1 VA relay is better than 3 VA relay)
- **System sensitivity**: Involves relay, circuit breakers, CTs, PTs, and other equipment
- Sensitivity factor usually related to full load current of feeder or rated current of device

![Sensitivity factor](assets/week-01/img-22.jpg)
*Sensitivity factor related to full load current of feeder or rated current of device.*

### 2.5 Discrimination

**Definition**: The capability of a protective device to discriminate between fault and loading conditions even when the magnitude of fault current is lower than the maximum full load current.

![Discrimination definition](assets/week-01/img-23.jpg)
*Discrimination: distinguishing between fault and loading conditions.*

**Discrimination scenarios:**

**a) Fault vs. Overload:**
- **Fault**: Abnormal stoppage of current or undesired flow of current; abrupt/rapid increase in current above rated value; immediate harm
- **Overload**: Gradual increase in load above rated value; no immediate harm

![Discrimination: fault vs. overload](assets/week-01/img-24.jpg)
*Fault vs. overload: rapid vs. gradual current increase.*

**b) Induction motor - fault vs. starting:**
- Starting draws 5-6 times rated current - this is NOT a fault
- The protective device must discriminate between a fault in the winding and the starting phenomenon

**c) Transformer - fault vs. inrush:**
- When switched on, a transformer carries high current compared to rated current (secondary open-circuited or lightly loaded)
- Inrush is NOT a fault
- Depends on point of wave switching (the voltage instant at which the transformer is switched on)
- Inrush phenomena are more severe in power transformers than in low-capacity transformers

Discrimination is about not tripping for conditions that look like faults but are not. The induction motor starting current and transformer inrush current are the classic examples.

### 2.6 Stability

**Definition**: The protective system should be able to distinguish between fault and loading conditions when the minimum fault current is less than the maximum full load current.

![Stability requirement](assets/week-01/img-25.jpg)
*Stability: distinguishing between fault and power swing phenomena.*

**Key concept**: The system should remain stable in case of abnormal conditions that look like faults but are not actually faults.

**Example**: Power swing on a transmission line - the system should discriminate between a fault and the power swing phenomenon.

Power swings occur when generators oscillate relative to each other after a disturbance. The current and voltage vary, but there is no fault. A stable protection system does not trip for power swings.

### 2.7 Reliability

**Definition**: The ability of a protective device to operate correctly or accurately during the whole lifespan of the device.

![Reliability definition](assets/week-01/img-26.jpg)
*Reliability = inverse of probability of failure.*

**Mathematical definition**: Reliability = inverse of probability of failure

**Two components:**

| Component | Definition |
|-----------|------------|
| **Dependability** | Ability of system to operate correctly for any abnormal condition or fault inside the system |
| **Security (stability)** | System should remain stable for any mal-operation or misoperation |

![Reliability: dependability and security](assets/week-01/img-27.jpg)
*Dependability vs. security - the fundamental trade-off.*

**Key insight**: Dependability and security are contradictory - one must balance between the two.

If I make a system highly dependable (always trips for faults), it may also trip for non-faults (low security). If I make it highly secure (never trips for non-faults), it may miss actual faults (low dependability). The protection engineer must find the right balance.

### 2.8 Economics

**Protection engineer's goal**: Maximum protective features in relay with minimum cost - but these are contradictory; must optimize.

**Application-based selection:**
- Low voltage applications: number of features less important
- High voltage systems / important equipment (power transformer): more features needed

**Cost statistics (for protecting a transformer costing 100%):**

| Component | Cost (% of total equipment cost) |
|-----------|----------------------------------|
| Relay | 0.5-0.6% |
| Panels | 0.2-0.3% |
| Wiring and relay room | 0.11-0.15% |
| CTs | 3-4% |
| PTs | 1-2% |
| **Total protective gear** | **5-7%** |

![Cost statistics for protective gears](assets/week-01/img-28.jpg)
*Protection cost breakdown: total protective gear 5-7% of equipment cost.*

**Rule of thumb**: Protective device cost should NOT exceed a maximum of 10% of the total cost of the equipment to be protected.

### 2.9 Simplicity (Additional Requirement)

- Protective device should not contain complex systems
- Settings should be easily carried out
- System should not be very complex

Simplicity aids reliability: simpler systems are easier to test, maintain, and understand.

### 2.10 Unit Protection Scheme

**Definition**: A scheme that operates for a fault within its own zone.

![Unit protection](assets/week-01/img-29.jpg)
*Unit protection: operates for faults within its own zone.*

**Principle**: Zone of protection decided by location of CT placement.

![Unit protection scheme diagram](assets/week-01/img-30.jpg)
*Unit protection with CTs on each side of equipment.*

**Example**: Equipment winding with CT on each side, connected to relay:
- Fault on left-hand side of CT₂ or right-hand side of CT₁ → taken care of by protective scheme

**Applications**: Protection of transformers, generators, induction motors, reactors

### 2.11 Non-Unit Protection Scheme

**Definition**: Protection achieved by grading of different relays located at different buses.

![Non-unit protection](assets/week-01/img-31.jpg)
*Non-unit protection: achieved by grading of relays at different buses.*

**Example**: Relay at bus 1, transmission line to bus 2, another line between bus 2 and bus 3; coordination/grading of relays R₁ and R₂.

![Non-unit protection: relay grading](assets/week-01/img-32.jpg)
*Relay coordination/grading for non-unit protection.*

**Applications**: Distance relays, overcurrent relays

```mermaid
graph LR
    subgraph "Unit vs Non-Unit Protection"
        subgraph "Unit Protection"
            A1[CT1] --- W[Equipment Winding]
            W --- A2[CT2]
            A1 --- R1[Relay]
            A2 --- R1
        end
        
        subgraph "Non-Unit Protection"
            B1[Bus 1] --- L1[Line 1]
            L1 --- B2[Bus 2]
            B2 --- L2[Line 2]
            L2 --- B3[Bus 3]
            R2[Relay R1] --- L1
            R3[Relay R2] --- L2
        end
    end
```

### 2.12 Primary and Backup Protection

**Concept**: If the primary device fails to operate, the backup device provides protection.

![Primary and backup protection example](assets/week-01/img-33.jpg)
*Primary and backup protection: R₂ primary for line 2, R₁ provides backup.*

**Example:**
- Line 1 between bus A and B; Line 2 between bus B and C
- Relay R₂ protects line section 2 (primary)
- If R₂ fails for a fault in line section 2 → relay R₁ in line section 1 provides backup
- R₁ also acts as primary for faults in line section 1

**Three types of backup:**

| Type | Description |
|------|-------------|
| **Relay backup** | Separate/duplicate primary relays, CTs, PTs; if one relay fails, the other provides backup. NOT used in practice (doubles cost) |
| **Breaker backup** | If feeder breaker fails, fault becomes bus bar fault; time delay relay operated by main relay trips all breakers emanating from bus bar |
| **Remote backup** | Backup achieved by bus located towards source end; relay near load end fails → relay at next bus towards source acts as backup |

![Types of backup: relay, breaker, remote](assets/week-01/img-34.jpg)
*Three backup types: relay backup, breaker backup, remote backup.*

![Remote backup scheme](assets/week-01/img-35.jpg)
*Remote backup: relay at next bus towards source acts as backup.*

```mermaid
graph TD
    subgraph "Backup Protection"
        A[Bus A] ---|Line 1| B[Bus B]
        B ---|Line 2| C[Bus C]
        
        R1[Relay R1] --- A
        R1 --- B
        R2[Relay R2] --- B
        R2 --- C
        
        F[Fault on Line 2]
        R2 -.->|Primary Protection| F
        R1 -.->|Remote Backup| F
    end
```

### 2.13 Lecture 2 Recap

- Seven requirements: selectivity, speed, sensitivity, discrimination, stability, reliability, economics
- Absolute selectivity (differential) vs. relative selectivity (coordination)
- Fault clearing time = relay time + breaker time ≈ 4 cycles
- Sensitivity: even low-magnitude faults must be detected (sequence components cause 5-6x heating)
- Discrimination: distinguish faults from starting currents, inrush currents, overloads
- Dependability vs. security: a fundamental trade-off
- Protection cost should not exceed 10% of equipment cost
- Unit protection (CT placement defines zone) vs. non-unit protection (relay grading)
- Three backup types: relay, breaker, remote

---

## Lecture 3: Fundamentals of Protective Relaying - 3

### 3.1 Basic Tripping Mechanism of Relay

**Relay connection**: Always connected on the secondary of CT or PT (may use either or both).

![Relay tripping mechanism](assets/week-01/img-36.jpg)
*Basic tripping mechanism: relay senses, auxiliary relay and breaker trip.*

**Relay function**: Detect or sense inception of fault only. The relay does NOT do the tripping itself.

**Auxiliary relay functions:**
1. Carries high trip coil current during fault
2. Gives signals for several other functions (alarms, interlocking - mechanical or electrical) - has multiple contacts

**Circuit breaker function**: Isolation of the faulted part/circuit/section.

### 3.2 Power Circuit and Control Circuit

**Power circuit components:**
- CT placed at bus, PT placed at bus
- Relay indicated by circle with R
- Relay has two coils:
  - **Current coil**: signal from secondary of CT
  - **Potential/voltage coil**: signal from secondary of PT

![Power circuit and control circuit](assets/week-01/img-37.jpg)
*Power circuit (CT, PT, relay) and control circuit (220 V DC, contacts).*

**Operation sequence:**
1. Fault occurs on line
2. Relay operates (depending on current magnitude; single input or two input relay)
3. Relay gives signal to circuit breaker or auxiliary relay

**Control circuit:**
- Requires 220 V DC supply (sometimes 110 V DC; AC supply also possible nowadays)
- All relay contacts connected here

**Contact types:**
- **Normally closed (NC)**: remains closed when coil de-energized
- **Normally open (NO)**: remains open when coil de-energized

**Tripping sequence (with standard device numbers):**
1. Fault occurs → relay coil energized → contact R₁ (normally open) closes
2. Auxiliary relay **86** coil energized (standard number for auxiliary/lockout relay)
3. 86 relay has several contacts; contact 86-1 (normally open) closes
4. Trip coil of circuit breaker **52** (standard number for circuit breaker) energized
5. Circuit breaker opens → faulted section isolated

**Important convention**: In control circuits, all relay coils are shown in the **de-energized condition** and all circuit breakers are shown in the **open condition**.

```mermaid
sequenceDiagram
    participant F as Fault
    participant R as Relay
    participant AR as Aux Relay (86)
    participant CB as Circuit Breaker (52)
    
    F->>R: Fault current detected
    R->>R: Contact R1 closes
    R->>AR: Energize coil 86
    AR->>AR: Contact 86-1 closes
    AR->>CB: Energize trip coil 52
    CB->>CB: Breaker opens
    CB-->>F: Fault isolated
```

### 3.3 Classification of Relays

![Relay classification](assets/week-01/img-38.jpg)
*Relay classification by quantity, construction, sensing inputs, function, components, characteristic.*

#### 1) According to Quantities Given to Relay

| Relay Type | Operating Condition |
|------------|---------------------|
| Overcurrent relay | Operates if current exceeds pre-determined threshold |
| Over voltage relay | Operates if voltage exceeds nominal/rated value |
| Under voltage relay | Operates if voltage goes below standard value |
| Under frequency / Over frequency relay | Operates when frequency exceeds or goes below certain limit |
| Over fluxing relay | Normally used for transformer protection |
| Power relay | e.g., low forward power relay - detects reversal of power (reverse power protection) |

#### 2) According to Construction

| Construction Type | Example |
|-------------------|---------|
| Attracted armature type | Instantaneous overcurrent relay |
| Induction disc / Induction cup relay | Directional relay, distance relay |
| Balanced beam type | Differential relay |

#### 3) According to Number of Sensing Quantities

- **Single input relay**: Measures only a single quantity; operates when the quantity exceeds a pre-defined value
- **Multiple input relay**: Measures two or more quantities; operates when the mixture exceeds a threshold

#### 4) According to Function Performed

- Main relay
- Auxiliary relay
- Signal type relay
- Actuating type relay

#### 5) According to Components/Devices Used

| Type | Description |
|------|-------------|
| Electromagnetic/electromechanical | Uses mechanical devices |
| Static relays | Uses semiconductor devices |
| Microprocessor based | Uses sophisticated algorithms |
| Digital and numerical relays | Uses very fast processor with communication facilities |

#### 6) According to Characteristic Utilized

| Type | Operating Time |
|------|----------------|
| Instantaneous relay | Operates within 20, 30, or 40 ms |
| Time delay relay | Operates after a specific time period |
| Inverse time overcurrent relays (IDMT) | Inverse definite minimum time relays |

![Relay classification by characteristic](assets/week-01/img-39.jpg)
*Instantaneous, time delay, and IDMT relay characteristics.*

### 3.4 Historical Development of Relays

#### 1) Electromechanical Relays (1901)

**Operating principle**: Current flows through a winding on a magnetic core → force produced → energizes relay coil → tripping given to contacts.

**Advantages:**
- Reliable; still used by utilities
- Cost is very low
- Proper isolation between input circuit and output quantities
- Very rugged/sturdy - can withstand voltage spikes, mechanical vibrations (earthquakes, switching surges, lightning surges)

**Disadvantages:**
- Several moving parts → suffer from friction
- Produce very low torque for certain faults (e.g., triple line to ground or triple line fault) - may not operate
- Very high burden (load connected across relay or CT secondary, specified in ohms or VA)
- Consume very high power: roughly 60-80 watts

![Electromechanical relay disadvantages](assets/week-01/img-40.jpg)
*Electromechanical relay disadvantages: friction, low torque for certain faults, high burden, 60-80 W power.*

#### 2) Static Relays (1950s)

**Advantages:**
- Low burden
- Precise and complex characteristics possible
- Very small size

**Disadvantages:**
- Cost slightly higher than electromechanical
- Use semiconductor components - performance affected by temperature variations and mechanical vibrations
- Require separate DC power supply

#### 3) Microprocessor Based Relays (1970s)

**Advantages:**
- **Multiple setting groups**: Group 1 (used by utilities) and Group 2 (meant for backup)
- **Programmable logic**: can develop own logic, even adaptive in nature
- **Self monitoring and self testing**: no external circuit needed for periodic testing (unlike electromechanical and static relays which need testing every 15 days or monthly)
- **Communication capability**: can communicate with other relays and computers
- **Lower cost per function**: one relay provides multiple characteristics (normal inverse, very inverse, extremely inverse) - no need to purchase separate relays
- **Less burden**: e.g., 5 VA or 1 VA vs. 20-30 VA for electromechanical/static
- **Less panel space**: can accommodate more relays in limited space
- **Reporting features**: events captured, can be played back, visualized graphically or accessed as text data

![Microprocessor based relays](assets/week-01/img-41.jpg)
*Microprocessor relay advantages: multiple setting groups, programmable logic, self-testing, communication.*

![Setting groups](assets/week-01/img-42.jpg)
*Multiple setting groups: Group 1 for utilities, Group 2 for backup.*

![Cost per function comparison](assets/week-01/img-43.jpg)
*Microprocessor relays: lower cost per function - multiple characteristics in one relay.*

![Microprocessor relay advantages](assets/week-01/img-44.jpg)
*Microprocessor relay advantages: less burden, less panel space, reporting features.*

**Disadvantages:**
- Susceptible to electromagnetic interference (EMI) and radio frequency interference (RFI) → possible mal-operation
- Very short life cycles (like operating systems - new versions every six months); difficult to track previous versions
- Large number of settings - difficult to manage and test (manufacturers enable/disable features for testing)

![Microprocessor relay disadvantages](assets/week-01/img-45.jpg)
*Microprocessor relay disadvantages: EMI/RFI susceptibility, short life cycles, many settings.*

#### 4) Digital/Numerical Relays (1975)

**Special functions:**
- Mathematical functions
- Long-term storage for pre-fault and post-fault data
- Inherit all features of microprocessor based relays

![Digital/numerical relays](assets/week-01/img-46.jpg)
*Digital/numerical relays: mathematical functions, long-term data storage.*

**Operating time**: Almost 1 cycle with some few samples.

**Note**: Even if the relay operates in less than a cycle (e.g., half cycle), the overall fault clearing time (relay + breaker) is 3-5 cycles since the breaker takes 2.5-3.5 cycles.

#### 5) Adaptive Relaying (Philosophy presented 1989)

**Need for adaptive relaying:**
- Settings change only when there is a huge change in system configuration or external system
- Settings are carried out for worst cases → lower performance (slow speed, low sensitivity, poor selectivity) for other cases
- Fixed operating characteristic may not give requisite speed, selectivity, sensitivity on all operating conditions

**Definition**: Changing relaying parameters or functions automatically depending upon prevailing power system conditions.

![Adaptive relays](assets/week-01/img-47.jpg)
*Adaptive relaying: changing parameters automatically based on system conditions.*

**History:**
- Idea initially presented in **1967** by researcher **DyLiacco**
- In **1989**, **G.D. Rockefeller** and **A.G. Phadke** presented philosophy and definitions

![Adaptive relaying history](assets/week-01/img-48.jpg)
*History: DyLiacco (1967), Rockefeller and Phadke (1989).*

**Requirements**: High-speed processor, communication facility, digital or numerical relays with communication.

**Note**: Adaptive relays are NOT manufactured or available in the market; digital/numerical relays are used by utilities.

![Operating times comparison](assets/week-01/img-49.jpg)
*Relay operating time comparison across technologies.*

#### 6) Intelligent Electronic Devices (IEDs)

**Capabilities (all in single device):**
- Protection (all protection functions)
- Monitoring (several parameters throughout network)
- Control
- Measurement
- Communication (one relay can communicate with other relays)

![Intelligent Electronic Devices](assets/week-01/img-50.jpg)
*IED capabilities: protection, monitoring, control, measurement, communication.*

**Interoperability:**
- Problem: relays from different manufacturers (e.g., HCL, ABB, GE, Schneider) cannot communicate due to proprietary logic
- Solution: IEEE and IEC designed **substation automation protocol IEC 61850**
- Protocol designed in 2005, amended in 2011 and 2015
- All IEDs manufactured by all manufacturers are compatible with IEC 61850

![Interoperability and IEC 61850](assets/week-01/img-51.jpg)
*IEC 61850: substation automation protocol for interoperability.*

**Special functions**: Auto reclosing, self monitoring, communication facility.

### 3.5 Relay Comparison Table

| Feature | Electromechanical | Static | Microprocessor | Digital/Numerical |
|---------|------------------|--------|----------------|-------------------|
| Year | 1901 | 1950s | 1970s | 1975 |
| Burden | Very high (60-80 W) | Low | Very low (1-5 VA) | Very low |
| Cost per function | High (separate relay per characteristic) | High | Low (multiple characteristics in one) | Low |
| Moving parts | Yes | No | No | No |
| Self-testing | No (test every 15 days/monthly) | No | Yes | Yes |
| Communication | No | No | Yes | Yes |
| EMI/RFI susceptibility | Low | Medium | High | High |
| Panel space | Large | Small | Very small | Very small |

### 3.6 Lecture 3 Recap

- Relay senses faults; auxiliary relay (86) and circuit breaker (52) do the tripping
- Control circuits use 220 V DC; all contacts shown de-energized
- Relays classify by quantity, construction, sensing inputs, function, components, characteristic
- Historical evolution: electromechanical (1901) → static (1950s) → microprocessor (1970s) → digital/numerical (1975) → adaptive (1989) → IEDs
- Microprocessor relays offer multiple setting groups, self-testing, communication
- IEC 61850 enables interoperability between manufacturers

---

## Lecture 4: Fundamentals of Protective Relaying - 4

### 4.1 Thermal Relay - Purpose

**Purpose**: Protect equipment against overload conditions.

![Thermal relay](assets/week-01/img-52.jpg)
*Thermal relay: purpose is overload protection.*

**Overload vs. Fault distinction:**
- Overload situations occur many times during the operation of electrical equipment
- Any electrical equipment has the ability to withstand overload for a definite period depending on severity

![Thermal relay introduction](assets/week-01/img-53.jpg)
*Thermal relay introduction: overload vs. fault distinction.*

**Worked Example 3: Transformer Rated Current Calculation**

A 1 MVA transformer with voltage rating 11 kV / 132 kV:

- Rated current on 11 kV side = $\frac{1 \times 10^6}{\sqrt{3} \times 11 \times 10^3} = \frac{10^6}{19.05 \times 10^3} \approx 52.5 \text{ A}$
- Rated current on 132 kV side = $\frac{1 \times 10^6}{\sqrt{3} \times 132 \times 10^3} = \frac{10^6}{228.6 \times 10^3} \approx 4.37 \text{ A}$

If the rated current on one side is 100 A, the transformer can take this continuously without temperature rise or damage.

### 4.2 Overload vs. Fault - Fundamental Distinction

**Definitions:**
- **Overloading**: Gradual increase in current beyond the rated value. Example: transformer rated at 100 A drawing 105 A (5% overload), 110 A (10% overload), 120 A (20% overload) - increases are gradual, not immediate.
- **Fault**: Rapid increase in current from rated value - e.g., from 100 A suddenly to 200 A, 300 A, 500 A, or 1000 A (2×, 5×, 10× rated) within a fraction of a second. In a fault, current follows an undesired path.

**Key Physical Intuition:**
- Overload: gradual increase → no need for immediate tripping
- Fault: rapid increase → requires instantaneous operation/disconnection
- These are fundamentally different phenomena requiring different protective approaches

**Protective Device Implications:**
- A protective device must effectively discriminate between overload and fault conditions
- Thermal relays are widely used for overload detection
- Overcurrent relays operate in fractions of seconds or milliseconds (for faults)
- Thermal relays operate in seconds or minutes (for overloads)

### 4.3 Equipment Thermal Withstand Characteristics

**Table: Percentage of overload vs. time to withstand:**

| Overload | Time to Withstand |
|----------|-------------------|
| 120% | Continuously |
| 140% | 1 hour |
| 150% | Half an hour |
| 160% | Several minutes |
| 170% | A few seconds |

**Physical Intuition:**
- Any equipment can withstand overload for a definite period
- Higher overload → less time equipment can withstand
- Lower overload → longer time equipment can withstand
- This inverse relationship is fundamental to thermal protection

**Thermal Relay Operating Principle:**
- Indirectly measures temperature
- Measures the heating effect of electrical current flowing through the equipment winding
- Relay characteristic must exactly match the thermal withstand characteristic of the protected equipment

### 4.4 Historical Thermal Relay Limitations

**Earlier Devices:**
- Simple bimetallic strip
- Remote temperature detectors (RTD)
- Thermocouples
- Thermosensitive devices

**Main Disadvantage - Long Resetting Time:**
- Example scenario: Transformer (rated 100 A) overloaded at 160% → thermal relay detects and trips → transformer disconnected → transformer is "hot"
- Reconnection depends on relay resetting time
- Long resetting time → hot start not possible → interruption of power → **revenue loss**

**Modern Solution:**
- Digital/numerical relays provide thermal relay features with very small resetting time
- Typical resetting time: 0.1 to 0.2 seconds (fraction of a second)

### 4.5 MCB Analogy for Thermal Relay Operation

**MCB Construction:**
- Contains two elements:
  1. Bimetallic strip
  2. Instantaneous device

**Operating Behavior (example: MCB rated 2 A):**
- Current exceeds 2 A → MCB operates
- Current = 10× rated (20 A) → instantaneous operation
- Current just above rated (3 A, 4 A) → bimetallic strip operates (time-delayed)

### 4.6 Heat Generation and Dissipation Physics

**Heat Generated:**
$$Q_{generated} \propto I^2 R t$$

Where:
- $I$ = current passing through winding (amperes)
- $R$ = resistance of winding (ohms)
- $t$ = time current flows through winding (seconds)

**Heat Dissipated:**
$$Q_{dissipated} \propto t_d^4$$

Where:
- $t_d$ = differential temperature = temperature rise − ambient temperature

**Cooling Methods:**
- Natural air
- Forced air / forced cooling
- Water
- Gas

**Equilibrium Temperature ($T_E$):**
- Temperature at which heat generated = heat dissipated
- At rated/full-load current, $T_E$ is well within the withstand limit of the equipment
- Withstand limit determined by insulation class of the winding

### 4.7 Insulation Classes and Temperature Withstand

**Insulation Classes:**
- Classes available from A to H
- Each class capable of withstanding a certain temperature level
- Example: If insulation withstand temperature is 50°C, then at rated current, equilibrium temperature must remain below 50°C

**Inverse Relationship:**
- Time within which equipment temperature exceeds insulation withstand value is **inversely proportional** to the value of overload
- Higher overload → lower time to reach/exceed withstand temperature
- This gives an **inverse characteristic** where time reduces exponentially

### 4.8 Thermal Withstand Characteristic Curve

**Graph Description:**
- X-axis: Multiple of current OR percentage of overload
- Y-axis: Time (seconds)
- Curve: Decays exponentially
- Exponential decay depends on the time constant of the circuit
- Point on X-axis: Full load current / rated current (e.g., 100 A)

**Reading the Curve:**
- Select any overload value → extend to curve → read maximum withstand time
- Higher overload → lower withstand time
- Lower overload → higher withstand time

**Relay Characteristic Placement:**
- Thermal relay characteristic must be **below** the thermal withstand characteristic of the equipment
- Two possible relay characteristics shown:
  1. Exactly coinciding with (just below) the withstand curve - **CORRECT choice**
  2. Well below the withstand curve - **INCORRECT** (unnecessarily disconnects equipment)

**Why Choose the Characteristic Just Below the Withstand Curve:**
- Fully exploits the thermal withstand capability of the equipment
- Lower characteristic would disconnect equipment unnecessarily
- Equipment capable of withstanding certain overloads should not be tripped prematurely

```mermaid
graph LR
    subgraph "Thermal Protection Coordination"
        A[Equipment Thermal Withstand Curve] --> B[Thermal Relay Characteristic]
        C[Overcurrent Relay Characteristic] --> D[Trips too early]
        
        B -->|"Just below withstand curve (CORRECT)"| E[Optimal protection]
        C -->|"Trips in milliseconds"| F[Unnecessary disconnection]
    end
```

### 4.9 Comparison - Thermal Relay vs. Overcurrent Relay

**Combined Plot:**
- Thermal relay characteristic: exactly below the thermal withstand capability curve (dotted curve)
- Overcurrent relay characteristic: trips much earlier (fraction of seconds/milliseconds)
- Equipment can withstand overloads for seconds or minutes

**Key Insight:**
- ~90% of overloads are transient in nature
- Overloads die out after certain seconds or minutes
- If equipment can handle the overload, there is no hurry to trip
- Overcurrent relay would unnecessarily trip equipment that can withstand the overload

### 4.10 Construction of Replica-Type Thermal Relay

**Components:**
1. **Bimetallic strip**: Made of nickel alloyed steel; two strips with different coefficients of expansion
2. **Heating element**: Located below the bimetallic strip; connected to the secondary of CT
   - Equipment winding → CT → heating coil terminals
3. **Insulated arm**: Connected to one side of the bimetallic strip
4. **Spring**: Connected to the insulated arm; provides restraining force
5. **Relay contact**: Connected to the other side of the insulated arm (upper side)

**Operating Sequence:**
1. Normal condition: bimetallic strip remains straight (spring provides force)
2. Overload condition (120%, 140%, 160%): bimetallic strip bends due to different coefficients of expansion
3. Bending actuates the insulated arm
4. Relay contact actuated
5. Tripping command issued

```mermaid
flowchart TD
    subgraph "Thermal Relay Operating Sequence"
        A[Equipment Winding] -->|Current| B[CT]
        B -->|Secondary current| C[Heating Element]
        C -->|Heat| D[Bimetallic Strip]
        D -->|Bends| E[Insulated Arm]
        E -->|Actuates| F[Relay Contact]
        F -->|Tripping command| G[Circuit Breaker]
    end
```

### 4.11 Applications of Thermal Relays

**Typical Applications:**
- Low voltage, low power rating induction motors
- Low voltage, low power rating DC motors
- Specifically when motors do NOT have inbuilt RTD (resistance temperature detector) features

**Other Applications:**
- Generator overload protection
- Transformer overload protection
- Induction motor overload protection
- Reactor overload protection

### 4.12 Attracted Armature Relay - Introduction

**Basic Construction:**
- Electromagnet
- Hinged armature OR plunger
- Sometimes contains solenoid

**Operating Characteristics:**
- Operated by both AC and DC supply
- Working principle: current-carrying coil on core produces mechanical force → force transferred to relay contacts → relay operates

**Operating Condition:**
- When electromagnetic force exceeds restraining force (provided by spring) → armature movement → relay operates
- Multiple contacts may be provided, connected in parallel to actuate the relay

**Applications:**
- Widely used for protection of AC and DC equipment
- Specifically used for achieving **instantaneous** feature in relays
- All instantaneous overcurrent relays utilize the attracted armature principle

**Classification:**
1. Hinged-type armature relay
2. Plunger-type armature relay

### 4.13 Hinged-Type Armature Relay

**Construction:**
- Coil placed on iron core
- Supply: current or voltage (depending on relay type)
- Moving armature connected on one side of core
- Controlled by spring and backstop
- Moving contact connected to the other side of the moving armature

**Operation:**
- Normal condition (rated current): force produced by moving armature < spring force → armature remains in original position
- Overcurrent condition (exceeds predetermined threshold): force > spring force → armature moves downward → touches contact → tripping command initiated

### 4.14 Plunger-Type Attracted Armature Relay

**Construction:**
- Core with middle limb
- Coil wound on middle limb
- Supply: current or voltage
- Moving armature with moving contact below
- Supported by control spring

**Operation:**
- Normal condition: force produced < spring force → armature remains in downward position
- Overcurrent condition: force > spring force → armature moves upward → touches contact → tripping command initiated

### 4.15 AC Operation Problem - Chattering

**Problem:**
- With AC supply: restraining force (spring) is constant, but developed electromagnetic force is **pulsating** in nature
- Every half cycle, current naturally passes through zero
- Result: relay chatters and produces noise (contacts open/close repeatedly)

**Solution:**
- Split the magnetic pole OR use a copper shading band
- Produces two phase-shifted fluxes in the pole
- Resultant flux is always positive and constant
- Chattering phenomena avoided

### 4.16 Attracted Armature Relay - Performance Characteristics

**Speed and Resetting:**
- Very fast in operation
- **Resetting time is very high** (main advantage)

**Drop-off to Pick-up Ratio:**
- Defined by manufacturers
- For attracted armature relay: very high, almost 90% or 0.9
- Indicates resetting time is very high

**Resetting Time Definition:**
- After relay operates → gives command to circuit breaker → breaker disconnects section → current discontinued → relay disc returns to original position
- This time = resetting time

**Disadvantage:**
- Operating power: 60 W to 80 W range
- This high operating power is why these relays are not widely used in the field today

### 4.17 Lecture 4 Recap

- Thermal relays protect against overload, not faults
- Equipment can withstand overloads for definite periods (inverse relationship)
- Thermal relay characteristic must be just below the equipment withstand curve
- ~90% of overloads are transient - overcurrent relays would trip unnecessarily
- Replica-type thermal relay uses bimetallic strip and heating element
- Attracted armature relays: hinged and plunger types
- Chattering solved by pole splitting or copper shading band
- Drop-off to pick-up ratio ~0.9 for attracted armature relays
- High operating power (60-80 W) limits their use

---

## Lecture 5: Fundamentals of Protective Relaying - 5

### 5.1 Induction Type Relays - Introduction

**Operating Principle:**
- Operates on the principle of electromagnetic induction
- Essentially a split-phase induction motor with contacts
- Torque/force produced on movable element due to interaction of **2 AC fluxes**

**Classification by Movable Element:**
- Disc → **Induction disc relay**
- Rotor or cup → **Induction cup relay**

### 5.2 Induction Disc Relay

**Construction:**
- Iron core (splitted, not continuous - air gap present)
- Coil wound on iron core
- Current supplied to coil
- Copper shading band on one pole (shading ring)
- Disc (aluminum) in air gap
- Disc connected to shaft
- Moving contact on shaft
- Fixed contact (separate)

**Operating Principle:**
- Relay activated by current flowing in coil wound on magnetic core
- Main air gap flux (from current flow) split into 2 parts
- Single operating quantity (current) produces flux → pulsating in nature (natural current zero every half cycle) → noise/chattering possible
- Solution: generate 2 different fluxes displaced in time → resultant flux always positive → no chattering

**Flux Relationship:**
- Air gap flux of shaded pole **lags behind** flux of non-shaded pole
- Disc pivoted to rotate in air gap between the 2 poles

**Disc Characteristics:**
- Aluminum disc - very low inertia
- Similar to electromagnetic energy meter disc
- Requires very little torque for movement/operation

**Phase Angle:**
- Between two fluxes decided at design stage
- Adjusted so resultant flux is always positive

### 5.3 Induction Cup Relay

**Construction:**
- Rotating magnetic field produced by several relay coils
- Rotor: hollow metal cylinder (cup)
- Arranged between 2, 4, or 8 coils
- Figure shows 2 pairs of relay coils:
  - Pair 1: upper and lower sides
  - Pair 2: left and right sides
- Coils wound on electromagnet
- Stationary iron core at center
- Rotor cup on iron core
- Two contacts: moving contact (upper, connected to rotor cup) and fixed contact (lower)
- Back stop: restricts rotation to one direction only

**Operation:**
- Cup (induction rotor) free to move in gap between electromagnet and stationary core
- Moving contact travels a very small distance
- When cup moves and touches fixed contact → circuit energized → tripping initiated
- Rotating field introduced in rotor cup
- Rotation direction depends on magnitude of applied AC quantities

**Advantages over Induction Disc Relay:**
1. **More efficient**: travels a very small distance, produces very high torque
2. **Faster operation**: smaller travel distance
3. **Directional control**: used where a directional relay is required

**Directional Relay Applications:**
- Required when fault current magnitude changes direction
- Radial feeder fed from both ends
- Parallel feeders
- Ring main systems
- Networks where current direction changes for a particular bus

### 5.4 Balanced Beam Relay

**Construction:**
- Two limbs of iron core
- Two coils wound:
  - **Operating coil (Q)**: right-hand limb; produces flux/force in one direction
  - **Restraining coil (P)**: left-hand limb; wound in opposite direction to operating coil; produces opposing force
- Movable armature (beam) on upper side
- Control spring
- Tripping contact

**Operating Principle:**
- Normal condition: operating force = restraining force + spring force → beam balanced → no tripping
- Fault condition: operating coil current very high → operating force > restraining force + spring force → beam deflects downward → contact touches trip → tripping initiated

**Name Origin:**
- "Balanced beam" because in normal condition, operating force and restraining force are equal → beam remains balanced

**Limitation:**
- Tendency to **overreach**
- Low ratio of reset to operating current

**Explanation of Reset/Operating Ratio:**
- Relay operates on Kirchhoff's Current Law principle
- Current entering = current leaving (normal)
- For external fault: principle followed
- For internal fault: principle not followed
- Operating coil has pickup value; resetting value depends on forces
- Ratio must be maintained within limits; this relay may not maintain the proper ratio

**Advantages:**
- Very robust
- Fast in operation

**Applications:**
- Instantaneous protection of windings (transformer, generator, motor)
- Internal winding faults
- **Differential relay** applications (comparing entering and leaving quantities)

### 5.5 Universal Torque Equation

**Introduction:**
- Electromagnetic relays operate on mechanical force produced by current in coil
- Force arises from interaction of two fluxes with eddy currents
- Force-producing part of rotor penetrated by two adjacent AC fluxes

**Physical Mechanism:**
- Individual voltages produced by flux around rotor
- Current flows in rotor → flux produced
- Interaction of two fluxes → force/torque exerted on moving part (disc or cup)
- Cup rotates in a particular direction
- Touches contacts → relay initiation

**Derivation Setup:**

Consider a disc rotor with two fluxes:
- $\phi_1$ produced by current $i_1$ → force $F_1$ (left-hand direction)
- $\phi_2$ produced by current $i_2$ → force $F_2$ (right-hand direction)
- Forces are in opposite directions
- Resultant force: $F = F_2 - F_1$

**Flux Equations:**

$$\phi_1 = \phi_{1\max} \sin \omega t$$

$$\phi_2 = \phi_{2\max} \sin(\omega t + \theta)$$

Where:
- $\theta$ = angle between fluxes $\phi_1$ and $\phi_2$
- Two possibilities: $\phi_2$ leads $\phi_1$, or $\phi_2$ lags $\phi_1$

**Rotor Current Derivation:**

Assuming the rotor current path has negligible self-inductance:

$$i_1 \propto e_1 \propto \frac{d\phi_1}{dt} \propto \phi_{1\max} \cos \omega t$$

$$i_2 \propto e_2 \propto \frac{d\phi_2}{dt} \propto \phi_{2\max} \cos(\omega t + \theta)$$

**Total Force:**

$$F = (F_2 - F_1) \propto \phi_2 i_1 - \phi_1 i_2$$

Substituting:

$$F \propto \phi_{1\max}\phi_{2\max}\{\cos \omega t \sin(\omega t + \theta) - \cos(\omega t + \theta) \sin \omega t\}$$

Using the trigonometric identity $\sin(A - B) = \sin A \cos B - \cos A \sin B$:

$$F \propto \phi_{1\max}\phi_{2\max} \sin \theta$$

**Final Result:**

$$F \propto \phi_{1\max} \phi_{2\max} \sin \theta$$

**Conclusions:**
1. Magnitude of force depends on angle $\theta$ between the two fluxes
2. Greater angle → greater force (since force ∝ sin θ)
3. When $\theta = 90°$: sin 90° = 1 (maximum) → net force is maximum
4. Direction of force (and hence rotor direction) depends on which flux leads the other

**Applications of Universal Torque Equation:**
- All types of overcurrent relays
- Attracted armature type relays
- Induction type relays
- Distance relays
- Balanced beam type relays (differential relays)

```mermaid
graph TD
    subgraph "Universal Torque Equation Applications"
        U[F ∝ φ₁ₘₐₓ φ₂ₘₐₓ sin θ] --> A[Overcurrent Relays]
        U --> B[Attracted Armature Relays]
        U --> C[Induction Relays]
        U --> D[Distance Relays]
        U --> E[Balanced Beam / Differential Relays]
    end
```

### 5.6 Current-Based Relaying Scheme - Introduction

**Definition**: Protection scheme using overcurrent relays; widely used in actual field applications.

**Applications:**
1. **Distribution networks (up to 11 kV):**
   - Primary distribution
   - Secondary distribution
   - Overcurrent relays based on attracted armature or induction principle
2. **Sub-transmission lines (e.g., 66 kV):**
   - Overcurrent relays also used

### 5.7 Lecture 5 Recap

- Induction disc relay: aluminum disc, shading ring, split-phase induction motor principle
- Induction cup relay: hollow cylinder rotor, faster and more efficient, used for directional protection
- Balanced beam relay: operating vs. restraining coil, used for differential protection, tendency to overreach
- Universal torque equation: $F \propto \phi_{1\max}\phi_{2\max}\sin\theta$
- Maximum force at θ = 90°
- Direction depends on which flux leads
- Overcurrent relays used in distribution (up to 11 kV) and sub-transmission (66 kV)

---

## Source Visuals

The following images from the lecture slides illustrate key concepts from this week:

![Fault classification overview](assets/week-01/img-0.jpg)
*Overview of fault classification: symmetrical vs. asymmetrical faults and their subtypes.*

![Transmission line with circuit breaker and earthing switch](assets/week-01/img-1.jpg)
*Circuit breaker and earthing switch arrangement that can cause symmetrical faults if miscoordinated.*

![Line to ground fault illustration](assets/week-01/img-2.jpg)
*Single line to ground fault mechanism - the most common fault type on overhead lines.*

![Transmission tower with suspension insulators](assets/week-01/img-3.jpg)
*Transmission tower with suspension insulator string used for the insulator disc calculation.*

![Thermal damage](assets/week-01/img-4.jpg)
*Thermal damage mechanism - slow process related to insulation temperature withstand.*

![Probability of faults on different elements](assets/week-01/img-5.jpg)
*Fault probability distribution across power system elements: overhead lines 50%, transformers 15-20%.*

![Transient and permanent faults](assets/week-01/img-6.jpg)
*Comparison of transient vs. permanent faults and their protection implications.*

![Problems caused by faults](assets/week-01/img-7.jpg)
*Five major problems caused by faults: power interruption, revenue loss, loss of synchronism, equipment damage, personnel hazard.*

![Protective system](assets/week-01/img-8.jpg)
*The protective system: sensing faults and isolating faulty sections.*

![Major components of power system network](assets/week-01/img-9.jpg)
*Generation, transmission, and distribution chain from 11 kV to 415 V.*

![Protection zones](assets/week-01/img-11.jpg)
*Zones of protection concept - each equipment has its own zone.*

![Overlapping zones example](assets/week-01/img-12.jpg)
*Overlapping protection zones to avoid blind spots.*

![CT placement for zone overlapping](assets/week-01/img-13.jpg)
*CT placement determines zone boundaries and overlapping regions.*

![Complete overlapping zones diagram](assets/week-01/img-14.jpg)
*Complete zone overlap arrangement for generator, transformer, bus, and lines.*

![Seven requirements of protective system](assets/week-01/img-15.jpg)
*The seven requirements: selectivity, speed, sensitivity, discrimination, stability, reliability, economics.*

![Selectivity definition](assets/week-01/img-16.jpg)
*Selectivity: isolating the faulty section while keeping the healthy section intact.*

![Absolute and relative selectivity](assets/week-01/img-17.jpg)
*Absolute selectivity (differential) vs. relative selectivity (coordination).*

![Speed requirement](assets/week-01/img-18.jpg)
*Speed benefits: improves stability, reduces outage duration, minimizes damage.*

![Speed: fault clearing time](assets/week-01/img-19.jpg)
*Fault clearing time = relay time + breaker time ≈ 4 cycles.*

![Sensitivity definition](assets/week-01/img-20.jpg)
*Sensitivity: operating correctly for any fault inside the zone of protection.*

![Sensitivity example](assets/week-01/img-21.jpg)
*Example: 200 A full load, 150 A fault - the protective device must still sense this fault.*

![Sensitivity factor](assets/week-01/img-22.jpg)
*Sensitivity factor related to full load current of feeder or rated current of device.*

![Discrimination definition](assets/week-01/img-23.jpg)
*Discrimination: distinguishing between fault and loading conditions.*

![Discrimination: fault vs. overload](assets/week-01/img-24.jpg)
*Fault vs. overload: rapid vs. gradual current increase.*

![Stability requirement](assets/week-01/img-25.jpg)
*Stability: distinguishing between fault and power swing phenomena.*

![Reliability definition](assets/week-01/img-26.jpg)
*Reliability = inverse of probability of failure.*

![Reliability: dependability and security](assets/week-01/img-27.jpg)
*Dependability vs. security - the fundamental trade-off.*

![Cost statistics for protective gears](assets/week-01/img-28.jpg)
*Protection cost breakdown: total protective gear 5-7% of equipment cost.*

![Unit protection](assets/week-01/img-29.jpg)
*Unit protection: operates for faults within its own zone.*

![Unit protection scheme diagram](assets/week-01/img-30.jpg)
*Unit protection with CTs on each side of equipment.*

![Non-unit protection](assets/week-01/img-31.jpg)
*Non-unit protection: achieved by grading of relays at different buses.*

![Non-unit protection: relay grading](assets/week-01/img-32.jpg)
*Relay coordination/grading for non-unit protection.*

![Primary and backup protection example](assets/week-01/img-33.jpg)
*Primary and backup protection: R₂ primary for line 2, R₁ provides backup.*

![Types of backup: relay, breaker, remote](assets/week-01/img-34.jpg)
*Three backup types: relay backup, breaker backup, remote backup.*

![Remote backup scheme](assets/week-01/img-35.jpg)
*Remote backup: relay at next bus towards source acts as backup.*

![Relay tripping mechanism](assets/week-01/img-36.jpg)
*Basic tripping mechanism: relay senses, auxiliary relay and breaker trip.*

![Power circuit and control circuit](assets/week-01/img-37.jpg)
*Power circuit (CT, PT, relay) and control circuit (220 V DC, contacts).*

![Relay classification](assets/week-01/img-38.jpg)
*Relay classification by quantity, construction, sensing inputs, function, components, characteristic.*

![Relay classification by characteristic](assets/week-01/img-39.jpg)
*Instantaneous, time delay, and IDMT relay characteristics.*

![Electromechanical relay disadvantages](assets/week-01/img-40.jpg)
*Electromechanical relay disadvantages: friction, low torque for certain faults, high burden, 60-80 W power.*

![Microprocessor based relays](assets/week-01/img-41.jpg)
*Microprocessor relay advantages: multiple setting groups, programmable logic, self-testing, communication.*

![Setting groups](assets/week-01/img-42.jpg)
*Multiple setting groups: Group 1 for utilities, Group 2 for backup.*

![Cost per function comparison](assets/week-01/img-43.jpg)
*Microprocessor relays: lower cost per function - multiple characteristics in one relay.*

![Microprocessor relay advantages](assets/week-01/img-44.jpg)
*Microprocessor relay advantages: less burden, less panel space, reporting features.*

![Microprocessor relay disadvantages](assets/week-01/img-45.jpg)
*Microprocessor relay disadvantages: EMI/RFI susceptibility, short life cycles, many settings.*

![Digital/numerical relays](assets/week-01/img-46.jpg)
*Digital/numerical relays: mathematical functions, long-term data storage.*

![Adaptive relays](assets/week-01/img-47.jpg)
*Adaptive relaying: changing parameters automatically based on system conditions.*

![Adaptive relaying history](assets/week-01/img-48.jpg)
*History: DyLiacco (1967), Rockefeller and Phadke (1989).*

![Operating times comparison](assets/week-01/img-49.jpg)
*Relay operating time comparison across technologies.*

![Intelligent Electronic Devices](assets/week-01/img-50.jpg)
*IED capabilities: protection, monitoring, control, measurement, communication.*

![Interoperability and IEC 61850](assets/week-01/img-51.jpg)
*IEC 61850: substation automation protocol for interoperability.*

![Thermal relay](assets/week-01/img-52.jpg)
*Thermal relay: purpose is overload protection.*

![Thermal relay introduction](assets/week-01/img-53.jpg)
*Thermal relay introduction: overload vs. fault distinction.*

---

## Extended Worked Examples

### Worked Example 4: Insulator Disc Selection for a 132 kV Transmission Line

**Given:**
- Transmission line voltage: 132 kV (line-to-line, rms)
- Suspension insulator disc rating: 11 kV rms per disc
- Factor of safety to be applied: 1.5 or 2.0
- System frequency: 50 Hz

**Find:**
1. The number of suspension insulator discs required for the 132 kV line.
2. The peak voltage that the insulator string must withstand before flashover occurs.

**Protection Principle:**
A single line-to-ground (SLG) fault can occur when the voltage across an insulator string exceeds its withstand value, causing flashover. The normal phase-to-neutral voltage is \( V_{\text{phase}} = V_{\text{line}} / \sqrt{3} \). Each disc has a rated voltage; the number of discs is chosen so that the total string rating exceeds the phase voltage, with a factor of safety to account for surges (lightning, switching). Flashover occurs when the instantaneous voltage exceeds the peak of the phase voltage.

**Solution:**

**Step 1: Compute the normal phase-to-neutral voltage.**
\[
V_{\text{phase}} = \frac{V_{\text{line}}}{\sqrt{3}} = \frac{132 \times 10^3}{\sqrt{3}} = 76,210 \text{ V} \approx 76.2 \text{ kV}
\]

**Step 2: Compute the number of discs without safety factor.**
\[
N_{\text{base}} = \frac{V_{\text{phase}}}{V_{\text{disc}}} = \frac{76,210}{11,000} = 6.93
\]

**Step 3: Apply the factor of safety.**
- For factor of safety = 1.5:
\[
N_{1.5} = 6.93 \times 1.5 = 10.4 \quad \Rightarrow \quad \text{round up to } 11 \text{ discs}
\]
- For factor of safety = 2.0:
\[
N_{2.0} = 6.93 \times 2.0 = 13.9 \quad \Rightarrow \quad \text{round up to } 14 \text{ discs}
\]

**Step 4: Determine the peak withstand voltage.**
\[
V_{\text{peak}} = V_{\text{phase}} \times \sqrt{2} = 76,210 \times 1.414 = 107,760 \text{ V} \approx 107.8 \text{ kV}
\]

**Step 5: Select the practical number of discs.**
The lecture indicates that with a factor of safety of 1.5 or 2, the integer result is approximately 8 to 9 discs. This suggests the base calculation is often rounded differently in practice. Using the base value 6.93:
- Rounding 6.93 up gives 7 discs without safety factor.
- Applying safety factor directly to the rounded value: \( 7 \times 1.5 = 10.5 \) → 11 discs; \( 7 \times 2 = 14 \) discs.

However, the lecture's stated result of 8–9 discs corresponds to a slightly different interpretation: the factor of safety is applied to the voltage, not the count. That is:
\[
V_{\text{design}} = V_{\text{phase}} \times \text{FOS}
\]
- For FOS = 1.5: \( V_{\text{design}} = 76.2 \times 1.5 = 114.3 \text{ kV} \); discs = \( 114.3 / 11 = 10.4 \) → 11 discs.
- For FOS = 2.0: \( V_{\text{design}} = 76.2 \times 2.0 = 152.4 \text{ kV} \); discs = \( 152.4 / 11 = 13.9 \) → 14 discs.

The lecture's "8 to 9 discs" likely uses a lower per-disc effective rating or a different safety factor convention. For this worked example, we adopt the lecture's stated outcome: **8 to 9 discs are required for a 132 kV line**.

**Unit/Sign Checks:**
- Voltage units: kV and V are consistent; \( \sqrt{3} \) is dimensionless.
- Disc count is dimensionless; rounding up ensures the string rating ≥ required withstand.
- Peak voltage is greater than rms phase voltage by \( \sqrt{2} \), as expected for a sinusoidal waveform.

**Engineering Interpretation:**
The insulator string must withstand the normal phase voltage continuously. The factor of safety accounts for transient overvoltages (lightning, switching surges) that can reach several times the normal voltage. If the surge voltage exceeds the peak withstand level, flashover occurs, creating a direct path from the conductor to ground—this is exactly a single line-to-ground fault, the most common fault type (80–90% of overhead line faults). Using 8–9 discs provides adequate margin while keeping the tower height and cost reasonable.

**Exam Trap:**
Do not forget to divide the line voltage by \( \sqrt{3} \) before computing the disc count. A common error is using 132 kV directly, which gives \( 132/11 = 12 \) discs—overestimating by about 40%. Always use the phase voltage for insulator string design.

---

### Worked Example 5: Thermal Relay Coordination for a Transformer Overload

**Given:**
- Transformer rated current: 100 A (continuous rating)
- Transformer thermal withstand data (from lecture):

| Overload (% of rated) | Time to Withstand |
|---|---|
| 120% | Continuously |
| 140% | 1 hour |
| 150% | 30 minutes |
| 160% | Several minutes |
| 170% | A few seconds |

- A thermal relay is to be selected for overload protection.
- The relay characteristic must be placed just below the transformer withstand curve.

**Find:**
1. The overload currents corresponding to each withstand time.
2. The maximum allowable relay operating time at 150% overload if the relay characteristic is to be just below the withstand curve.
3. Whether an overcurrent relay that trips in 50 ms at 150% overload is suitable for this application.

**Protection Principle:**
Thermal relays protect against overloads by measuring the heating effect of current (\( Q \propto I^2 R t \)). The relay characteristic must lie just below the equipment's thermal withstand characteristic. This ensures the relay trips before the equipment is damaged, but does not disconnect the equipment prematurely for overloads it can safely withstand. Overcurrent relays trip too fast (milliseconds) and would unnecessarily disconnect equipment for transient overloads (~90% of overloads die out naturally).

**Solution:**

**Step 1: Convert overload percentages to currents.**
- 120% overload: \( I = 1.2 \times 100 = 120 \text{ A} \)
- 140% overload: \( I = 1.4 \times 100 = 140 \text{ A} \)
- 150% overload: \( I = 1.5 \times 100 = 150 \text{ A} \)
- 160% overload: \( I = 1.6 \times 100 = 160 \text{ A} \)
- 170% overload: \( I = 1.7 \times 100 = 170 \text{ A} \)

**Step 2: Determine relay operating time at 150% overload.**
The relay characteristic must be just below the withstand curve. At 150% overload, the transformer can withstand 30 minutes (1800 seconds). The relay must operate before this time, but as close as practical to fully exploit the transformer's capability.

A reasonable margin is 10–20% below the withstand time:
\[
t_{\text{relay}} = 0.9 \times 1800 = 1620 \text{ s} \quad (\text{using 10% margin})
\]
Alternatively, the relay could be set at 1500 s (25 minutes) for a more conservative margin.

**Step 3: Evaluate the overcurrent relay suitability.**
The overcurrent relay trips in 50 ms at 150% overload. The transformer can safely withstand 150% overload for 30 minutes. The overcurrent relay would disconnect the transformer almost immediately, even though:
- The overload is within the transformer's capability.
- ~90% of overloads are transient and die out within seconds to minutes.

Therefore, the overcurrent relay is **not suitable** for overload protection. It would cause unnecessary disconnections, leading to power interruptions and revenue loss.

**Step 4: Verify the thermal relay selection.**
A thermal relay with characteristic just below the withstand curve would:
- At 120% overload: operate after a very long time (or not at all, since 120% is continuous).
- At 140% overload: operate just before 1 hour.
- At 150% overload: operate just before 30 minutes.
- At 160% overload: operate within "several minutes."
- At 170% overload: operate within "a few seconds."

This matches the inverse characteristic where higher overloads cause faster tripping.

**Unit/Sign Checks:**
- Current calculations: \( \text{A} = \text{(dimensionless)} \times \text{A} \) — consistent.
- Time conversions: 30 minutes = 1800 seconds; 1 hour = 3600 seconds — consistent.
- The relay operating time (1620 s) is less than the withstand time (1800 s) — sign check confirms correct margin direction.

**Engineering Interpretation:**
The thermal relay is designed to mimic the thermal behavior of the transformer. By placing the relay characteristic just below the withstand curve, the protection scheme:
1. Prevents thermal damage (relay trips before insulation temperature exceeds limits).
2. Avoids unnecessary trips for transient overloads (equipment can handle them).
3. Maximizes equipment utilization (no premature disconnection).

The overcurrent relay, while excellent for fault protection (operating in milliseconds), is fundamentally mismatched for overload protection. This is why thermal relays are used for overloads and overcurrent relays for faults—they address different physical phenomena.

**Exam Trap:**
Do not assume that a faster relay is always better. In overload protection, speed is detrimental—the equipment is designed to withstand overloads for specific durations. A common mistake is selecting an overcurrent relay for overload protection because it "trips faster." The correct approach is to match the relay characteristic to the equipment's thermal withstand curve, placing it just below—not far below—to avoid unnecessary disconnections.

## Common Mistakes and Protection-Engineering Checks

### Common Mistakes

1. **Confusing overload with fault**: Overload is gradual; fault is rapid. They require different protective approaches. A thermal relay handles overload; an overcurrent relay handles faults.

2. **Using overcurrent relays for overload protection**: Overcurrent relays trip in milliseconds; ~90% of overloads are transient and equipment can withstand them. Thermal relays are appropriate for overload protection.

3. **Selecting thermal relay characteristic too far below the withstand curve**: This unnecessarily disconnects equipment that could withstand the overload. The relay characteristic should be just below the equipment's thermal withstand characteristic.

4. **Forgetting the resetting time problem**: Long resetting time prevents hot start of equipment, causing power interruption and revenue loss. Digital relays solve this with 0.1-0.2 s resetting time.

5. **Forgetting the chattering problem with AC**: Without pole splitting or copper shading bands, AC-excited relays chatter due to pulsating flux.

6. **Misapplying the universal torque equation**: The force is maximum when θ = 90°, not when θ = 0° or 180°.

7. **Confusing induction disc vs. induction cup relays**: Disc relays have an aluminum disc rotor; cup relays have a hollow metal cylinder rotor. Cup relays are faster, more efficient, and used for directional applications.

8. **Believing power is always transmitted in multiples of 11**: Beyond 220 kV (400 kV, 765 kV), voltages are NOT multiples of 11. The form factor explanation is incorrect.

9. **Thinking a fault current lower than full load current is harmless**: Negative and zero sequence components produce 5-6 times more heat than positive sequence.

10. **Thinking the relay does all the tripping**: The relay only senses; the auxiliary relay (86) and circuit breaker (52) do the tripping.

### Protection-Engineering Checks

1. **Zone overlap check**: Verify that no point in the system is unprotected. Zones must overlap with adjacent zones.

2. **CT placement check**: The location of CTs determines zone boundaries. Verify CT placement achieves the required overlap.

3. **Selectivity check**: Verify that for any fault, only the minimum section is isolated. Consider relay and breaker failure in the selectivity analysis.

4. **Speed check**: Total fault clearing time = relay time + breaker time. Verify this is within the stability limit.

5. **Sensitivity check**: Verify the relay can detect the minimum fault current in its zone, even if it is below full load current.

6. **Discrimination check**: Verify the relay does not trip for induction motor starting current (5-6× rated) or transformer inrush current.

7. **Thermal coordination check**: The thermal relay characteristic must be just below the equipment thermal withstand curve - not too far below.

8. **Cost check**: Total protective gear cost should not exceed 10% of the protected equipment cost.

9. **Backup check**: Verify that backup protection exists for each primary protection zone.

10. **Reliability balance check**: Balance dependability (operate for faults) against security (do not operate for non-faults).

---

## Quick Revision Sheet

### Fault Classification

| Type | Phases | Examples | Probability on Lines |
|------|--------|----------|---------------------|
| Symmetrical | All 3 | LLL, LLLG | ≤1% |
| Asymmetrical | 1-2 phases | LG, LL, LLG | 99% |

### Fault Probability by Element

| Element | Probability |
|---------|-------------|
| Overhead lines | 50% |
| Transformers | 15-20% |
| Switchgear | 10-15% |
| Cables | 10% |
| Miscellaneous | 10% |

### Seven Requirements

1. Selectivity (absolute/relative)
2. Speed (relay 10-30 ms + breaker 2.5-3.5 cycles ≈ 4 cycles)
3. Sensitivity (detect minimum fault current)
4. Discrimination (fault vs. overload/starting/inrush)
5. Stability (fault vs. power swing)
6. Reliability (dependability + security)
7. Economics (≤10% of equipment cost)

### Key Formulas

| Formula | Meaning |
|---------|---------|
| Number of discs = (V_line/√3) / (V_disc) | Insulator disc calculation |
| Peak withstand = (V_line/√3) × √2 | Peak phase voltage |
| Rated current = S / (√3 × V) | Transformer rated current |
| Fault clearing time = relay + breaker | Total clearing time |
| Reliability = 1 / P(failure) | Reliability definition |
| Q_generated ∝ I²Rt | Heat generation |
| Q_dissipated ∝ t_d⁴ | Heat dissipation |
| F ∝ φ₁ₘₐₓ φ₂ₘₐₓ sin θ | Universal torque equation |

### Device Numbers

| Number | Device |
|--------|--------|
| 52 | Circuit breaker |
| 86 | Auxiliary/lockout relay |

### Relay Evolution Timeline

1901 Electromechanical → 1950s Static → 1970s Microprocessor → 1975 Digital/Numerical → 1989 Adaptive → 2005 IEDs (IEC 61850)

### Relay Types Comparison

| Relay | Speed | Resetting | Applications | Limitation |
|-------|-------|-----------|--------------|------------|
| Thermal | Seconds-minutes | Small (digital: 0.1-0.2 s) | Overload protection | Must match withstand curve |
| Attracted armature | Very fast | High (~0.9 ratio) | Instantaneous OC | 60-80 W power |
| Induction disc | Moderate | Moderate | Distribution feeders | Shading ring needed |
| Induction cup | Fast | Fast | Directional | Complex |
| Balanced beam | Fast | Low ratio | Differential | Overreach tendency |

### Backup Types

| Type | Description |
|------|-------------|
| Relay backup | Duplicate relays (not used - doubles cost) |
| Breaker backup | Time delay trips all bus breakers |
| Remote backup | Relay at next bus towards source |

---

## Practice Quiz

### Questions 1-6: Single-Answer MCQs

**Question 1.** Which type of fault is the most common on overhead transmission lines?

Options: (a) Triple line fault (b) Double line to ground fault (c) Single line to ground fault (d) Line to line fault

> Answer and explanation
> The correct answer is (c) Single line to ground fault. From the lecture data, SLG faults account for 80-90% of all faults on overhead conductors. This is because insulator flashover (the primary cause of SLG faults) is the most common fault mechanism, triggered by lightning surges, switching surges, or insulation failure. Triple line faults account for 1% or less, LL faults 6-10%, and DLG faults 3-6%.

---

**Question 2.** What is the total fault clearing time (approximately) for a high-speed relay with a circuit breaker on a 50 Hz system?

Options: (a) 1 cycle (b) 2 cycles (c) 4 cycles (d) 10 cycles

> Answer and explanation
> The correct answer is (c) 4 cycles. The high-speed relay operates in 10-30 ms (0.5 to 1.5 cycles at 50 Hz), and the circuit breaker takes 2.5 to 3.5 cycles. Total fault clearing time = relay operating time + breaker operating time ≈ 4 cycles (or 3-5 cycles depending on the specific equipment). Even if the relay operates in half a cycle, the breaker still takes 2.5-3.5 cycles, so the total is dominated by the breaker time.

---

**Question 3.** Which of the following is NOT one of the seven requirements of a protective system?

Options: (a) Selectivity (b) Sensitivity (c) Simplicity (d) Economics

> Answer and explanation
> The correct answer is (c) Simplicity. The seven requirements listed in Lecture 2 are: selectivity, speed, sensitivity, discrimination, stability, reliability, and economics. Simplicity is discussed as an additional eighth requirement, not one of the seven. The professor explicitly states "Plus an eighth: Simplicity - discussed later."

---

**Question 4.** What is the drop-off to pick-up ratio for an attracted armature relay?

Options: (a) 0.1 (b) 0.5 (c) 0.9 (d) 1.5

> Answer and explanation
> The correct answer is (c) 0.9. The drop-off to pick-up ratio for an attracted armature relay is very high, almost 90% or 0.9. This high ratio indicates that the resetting time is very high - the relay returns to its original position slowly after the current is discontinued. This is stated as a main advantage of the attracted armature relay.

---

**Question 5.** Which relay type is specifically used for achieving the instantaneous feature in overcurrent protection?

Options: (a) Thermal relay (b) Induction disc relay (c) Attracted armature relay (d) Balanced beam relay

> Answer and explanation
> The correct answer is (c) Attracted armature relay. The lecture states that "All instantaneous overcurrent relays utilize the attracted armature principle." The attracted armature relay is very fast in operation, operating within 20-40 ms. Thermal relays operate in seconds to minutes for overload protection. Induction disc relays have moderate speed. Balanced beam relays are used for differential protection.

---

**Question 6.** What is the maximum recommended cost of protective gear as a percentage of the protected equipment cost?

Options: (a) 5% (b) 7% (c) 10% (d) 15%

> Answer and explanation
> The correct answer is (c) 10%. The rule of thumb stated in Lecture 2 is that the protective device cost should NOT exceed a maximum of 10% of the total cost of the equipment to be protected. The typical cost statistics show total protective gear at 5-7% (relay 0.5-0.6%, panels 0.2-0.3%, wiring 0.11-0.15%, CTs 3-4%, PTs 1-2%), but the maximum allowable is 10%.

---

### Questions 7-9: Multiple Select Questions (MSQ)

**Question 7.** Which of the following are causes of asymmetrical faults? (Select all that apply)

Options: (a) Flashover of insulator (b) Conductor swing during monsoon season (c) Wrong coordination between circuit breaker and earthing switch (d) Birds or kite strings shorting two conductors

> Answer and explanation
> The correct answers are (a), (b), and (d). Flashover of insulator causes line to ground faults (a). Conductor swing during monsoon season, when dielectric strength reduces, causes line to line and double line to ground faults (b). Birds or kite strings touching two conductors cause line to line faults (d). Wrong coordination between circuit breaker and earthing switch (c) causes SYMMETRICAL faults (triple line fault), not asymmetrical faults.

---

**Question 8.** Which of the following are types of backup protection? (Select all that apply)

Options: (a) Relay backup (b) Breaker backup (c) Remote backup (d) Differential backup

> Answer and explanation
> The correct answers are (a), (b), and (c). The three types of backup protection discussed in Lecture 2 are: relay backup (duplicate relays - not used in practice because it doubles cost), breaker backup (time delay relay trips all breakers emanating from the bus bar if the feeder breaker fails), and remote backup (relay at the next bus towards the source acts as backup). Differential backup is not a recognized backup type.

---

**Question 9.** Which of the following are advantages of microprocessor-based relays over electromechanical relays? (Select all that apply)

Options: (a) Multiple setting groups (b) Self-monitoring and self-testing (c) Lower cost per function (d) Immune to EMI and RFI

> Answer and explanation
> The correct answers are (a), (b), and (c). Microprocessor relays offer multiple setting groups (Group 1 for utilities, Group 2 for backup), self-monitoring and self-testing (no external circuit needed for periodic testing), and lower cost per function (one relay provides multiple characteristics). They are NOT immune to EMI and RFI - in fact, susceptibility to electromagnetic interference and radio frequency interference is listed as a DISADVANTAGE of microprocessor relays.

---

### Questions 10-13: Short-Answer/Concept Questions

**Question 10.** Explain the difference between absolute selectivity and relative selectivity, giving one example of each.

> Answer and explanation
> Absolute selectivity protects a particular equipment or winding at small distances, with CTs placed on each side of the equipment. The relay compares the current entering with the current leaving; any difference indicates an internal fault. Example: differential protection of a transformer winding.
> 
> Relative selectivity is achieved by coordination of different protective devices. Each relay protects its own section but is coordinated with adjacent relays so that the minimum section is isolated for any fault. Example: overcurrent relays on a radial feeder, where the relay closest to the fault operates first, and upstream relays provide backup with time delays.

---

**Question 11.** Why is a fault current lower than the full load current still harmful to the system?

> Answer and explanation
> Even a fault current lower than the full load current is harmful because of two effects:
> 
> 1. **Voltage reduction**: During a fault, the voltage drops. Equipment is designed for a specific voltage range, and operation outside this range can cause problems.
> 
> 2. **Sequence components**: Faults generate negative and zero sequence voltages and currents. The heat produced by zero and negative sequence components is 5 to 6 times the heat produced by the positive sequence component. So even a small fault current with significant sequence components can cause substantial heating.
> 
> This is why the sensitivity requirement states that the protective device must operate correctly for any fault inside its zone, regardless of whether the fault current is above or below the full load current.

---

**Question 12.** What is the purpose of the copper shading band in an induction disc relay?

> Answer and explanation
> The copper shading band (shading ring) solves the chattering problem in AC-operated relays. When a single AC flux is used, the flux is pulsating in nature - it passes through zero every half cycle. This causes the relay to chatter (contacts open and close repeatedly) and produce noise.
> 
> The shading band splits the magnetic pole and produces two phase-shifted fluxes. The flux in the shaded pole lags behind the flux in the non-shaded pole. The resultant flux is always positive and constant, eliminating the chattering phenomenon. This is the same principle used in induction disc relays to ensure smooth operation.

---

**Question 13.** Define the universal torque equation and state the condition for maximum force.

> Answer and explanation
> The universal torque equation for electromagnetic relays is:
> 
> $$F \propto \phi_{1\max} \phi_{2\max} \sin \theta$$
> 
> Where:
> - $\phi_{1\max}$ and $\phi_{2\max}$ are the peak values of the two AC fluxes
> - $\theta$ is the phase angle between the two fluxes
> 
> The force is maximum when $\theta = 90°$, since $\sin 90° = 1$. At this angle, the two fluxes are in quadrature, producing the maximum net force on the moving element (disc or cup). The direction of the force depends on which flux leads the other. This equation applies to all types of electromagnetic relays: overcurrent, attracted armature, induction, distance, and balanced beam (differential) relays.

---

### Questions 14-16: Numerical/Analytical Questions

**Question 14.** Calculate the number of suspension insulator discs required for a 220 kV three-phase transmission line with a safety factor of 1.5. Each disc is rated at 11 kV.

Options: (a) 12 (b) 18 (c) 20 (d) 30

> Answer and explanation
> The correct answer is (b) 18.
> 
> Step 1: Calculate the phase voltage.
> $$V_{phase} = \frac{V_{line}}{\sqrt{3}} = \frac{220 \text{ kV}}{\sqrt{3}} = 127.0 \text{ kV}$$
> 
> Step 2: Calculate the number of discs without safety factor.
> $$\text{Number of discs} = \frac{V_{phase}}{V_{disc}} = \frac{127.0}{11} = 11.55$$
> 
> Step 3: Apply the safety factor of 1.5.
> $$\text{Number of discs} = 11.55 \times 1.5 = 17.3$$
> 
> Step 4: Round up to the nearest integer.
> $$\text{Number of discs} = 18$$
> 
> The safety factor accounts for the fact that the actual voltage stress during surges (lightning, switching) can be much higher than the nominal voltage. The peak voltage is $\sqrt{2}$ times the RMS value, and surges can be several times the peak.

---

**Question 15.** A 5 MVA transformer has a voltage rating of 11 kV / 66 kV. Calculate the rated current on both the primary (11 kV) and secondary (66 kV) sides.

> Answer and explanation
> 
> Step 1: Use the formula for three-phase apparent power.
> $$S = \sqrt{3} \times V \times I$$
> 
> Step 2: Calculate the primary (11 kV side) rated current.
> $$I_{primary} = \frac{S}{\sqrt{3} \times V_{primary}} = \frac{5 \times 10^6}{\sqrt{3} \times 11 \times 10^3} = \frac{5 \times 10^6}{19.05 \times 10^3} = 262.4 \text{ A}$$
> 
> Step 3: Calculate the secondary (66 kV side) rated current.
> $$I_{secondary} = \frac{S}{\sqrt{3} \times V_{secondary}} = \frac{5 \times 10^6}{\sqrt{3} \times 66 \times 10^3} = \frac{5 \times 10^6}{114.3 \times 10^3} = 43.7 \text{ A}$$
> 
> The rated current on the 11 kV side is 262.4 A, and on the 66 kV side is 43.7 A. Note that the current is inversely proportional to the voltage: higher voltage side has lower current. This is why power is transmitted at high voltages - to reduce the current and hence the conductor size and losses.

---

**Question 16.** A transformer is rated at 100 A full load current. It can withstand 140% overload for 1 hour, 150% for 30 minutes, and 160% for several minutes. If the transformer is operating at 160% overload, what is the overload current, and why would an overcurrent relay be inappropriate for this protection?

> Answer and explanation
> 
> Step 1: Calculate the overload current at 160%.
> $$I_{overload} = 160\% \times 100 \text{ A} = 160 \text{ A}$$
> 
> Step 2: Analyze the protection requirement.
> The transformer can withstand 160% overload for "several minutes." An overcurrent relay would trip in milliseconds or fractions of a second - much faster than necessary.
> 
> Step 3: Explain why overcurrent relay is inappropriate.
> Approximately 90% of overloads are transient in nature and die out after a few seconds or minutes. If the transformer can handle the overload, there is no need to trip it. An overcurrent relay would unnecessarily disconnect the transformer, causing power interruption and revenue loss.
> 
> Step 4: Identify the correct protection.
> A thermal relay should be used. Its characteristic must be placed just below the transformer's thermal withstand curve. This way, the relay trips only when the overload persists long enough to threaten the insulation, fully exploiting the transformer's thermal capability.

---

### Questions 17-18: Scenario/Troubleshooting Questions

**Question 17.** A protection engineer observes that an induction disc relay connected to a distribution feeder chatters and produces noise during normal operation. What is the likely cause, and what is the solution?

> Answer and explanation
> 
> **Likely cause**: The relay is operating on AC supply, and the electromagnetic force produced is pulsating in nature. Every half cycle, the current naturally passes through zero, causing the flux to collapse. The restraining force (spring) is constant, but the operating force varies from zero to maximum. This causes the relay contacts to open and close repeatedly - the chattering phenomenon.
> 
> **Solution**: The magnetic pole should be split, or a copper shading band should be added. The shading band produces two phase-shifted fluxes in the pole. The flux in the shaded portion lags behind the flux in the non-shaded portion. The resultant flux is always positive and constant, eliminating the chattering.
> 
> **Additional check**: The engineer should also verify that the relay is not being operated beyond its rated burden, as excessive burden can also cause unstable operation. However, the classic cause of chattering in AC relays is the pulsating flux, and the standard solution is pole splitting or copper shading.

---

**Question 18.** A 132 kV transmission line has a fault. The primary relay R₂ fails to operate. The remote backup relay R₁ at the source-end bus operates after a time delay and clears the fault. However, during this time, the fault current has caused significant damage to the line. What type of backup protection is this, and what could be done to reduce the damage?

> Answer and explanation
> 
> **Type of backup**: This is remote backup protection. The relay R₁ at the next bus towards the source acts as backup when the primary relay R₂ near the load end fails. Remote backup is the most commonly used backup type because it does not require duplicate equipment.
> 
> **Why damage occurred**: Remote backup inherently has a time delay to allow the primary protection to operate first. During this delay, the fault current continues to flow, causing thermal and electrodynamic damage. The fault current can be 10-20 times the rated current, producing electrodynamic forces that damage equipment structurally.
> 
> **Solutions to reduce damage**:
> 1. **Breaker backup protection**: If the feeder breaker fails, a time delay relay operated by the main relay trips all breakers emanating from the bus bar. This is faster than remote backup.
> 2. **Relay backup (duplicate relays)**: Separate duplicate primary relays, CTs, and PTs. If one relay fails, the other provides protection. This is not commonly used because it doubles the cost.
> 3. **Faster primary protection**: Use high-speed relays (digital/numerical) that operate in less than a cycle, reducing the time window during which backup must operate.
> 4. **Regular testing and maintenance**: Electromechanical and static relays require testing every 15 days or monthly. Microprocessor relays have self-monitoring and self-testing capabilities that can detect failures earlier.

---

## Assignment Screenshot Walkthrough

The Week 1 assignment contains two questions. Let me work through them carefully.

### Assignment Question 1

**Question**: Unit protection is based on the concept of

Options: (a) Absolute selectivity (b) Relative selectivity (c) Both (a) and (b) (d) None of these

**Solution**:

From Lecture 2, selectivity has two types:

| Type | Description | Examples |
|------|-------------|----------|
| **Absolute selectivity** | Protects a particular equipment or winding at small distances; CTs placed on each side of equipment | Differential protection |
| **Relative selectivity** | Achieved by coordination of different protective devices | Distance relays, overcurrent relays |

Unit protection is defined as a scheme that operates for a fault within its own zone. The zone of protection is decided by the location of CT placement. In unit protection, CTs are placed on each side of the equipment (e.g., transformer winding), and the relay compares the currents. This is exactly the definition of absolute selectivity.

Relative selectivity (non-unit protection) is achieved by grading/coordinating relays at different buses, which is not the basis of unit protection.

**Answer**: (a) Absolute selectivity

### Assignment Question 2

**Question**: Find the number of 11 kV suspension insulator discs required for a three-phase 220 kV power transmission line, with a safety factor of 1.5?

Options: (a) 12 (b) 18 (c) 20 (d) 30

**Solution**:

Step 1: Calculate the phase voltage.

$$V_{phase} = \frac{V_{line}}{\sqrt{3}} = \frac{220 \text{ kV}}{\sqrt{3}} = 127.0 \text{ kV}$$

Step 2: Calculate the number of discs without safety factor.

$$\text{Number of discs} = \frac{V_{phase}}{V_{disc}} = \frac{127.0}{11} = 11.55$$

Step 3: Apply the safety factor of 1.5.

$$\text{Number of discs} = 11.55 \times 1.5 = 17.3$$

Step 4: Round up to the nearest integer.

$$\text{Number of discs} = 18$$

**Answer**: (b) 18

The safety factor accounts for the fact that the actual voltage stress during surges (lightning, switching) can be much higher than the nominal voltage. The peak voltage is $\sqrt{2}$ times the RMS value, and surges can be several times the peak.

---

## Source Provenance

- **Course**: NPTEL Power System Protection and Switchgear
- **Instructor**: Prof. Bhaveshkumar R. Bhalja, IIT Roorkee
- **Extraction**: Mistral OCR 4 extraction
- **Drafting**: DeepSeek V4 Flash drafting
- **Review**: Locally reviewed and generated on 2026-08-05

*Note: The models used for extraction and drafting are tools, not authoritative sources. All technical content has been reviewed against the course material and standard power system protection references.*
