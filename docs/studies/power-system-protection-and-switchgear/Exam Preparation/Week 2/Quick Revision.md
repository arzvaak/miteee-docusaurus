---
title: "Quick Revision"
math_syntax: typst
---

# Week 2 — Quick Revision

## Week 2 Revision: Overcurrent Protection & Differential Protection

### **Key Formulas & Concepts**
1.  **Multiple of Pickup (MP) / Plug Setting Multiplier (PSM):**
    $$
    "MP" = frac(I_("fault"), "PS" times "CT"_("ratio") times I_("rated"))
    $$
    - $I_("fault")$: Fault current (primary or secondary, be consistent).
    - $"PS"$: Plug Setting (as a decimal, e.g., 75% = 0.75).
    - $"CT"_("ratio")$: Primary/Secondary CT ratio.
    - $I_("rated")$: Relay rated current (1A or 5A).

2.  **Standard IDMT Operating Time (IEC Normal Inverse):**
    $$
    T_op = frac(0.14, ("MP")^0.02 - 1) times "TDS"
    $$
    - $T_op$: Operating time in seconds.
    - $"TDS"$: Time Dial Setting.

3.  **Coordination Time Interval (CTI):**
    $$
    T_(op, "upstream") = T_(op, "downstream") + "CTI"
    $$
    - CTI typically 0.2-0.3 s (includes breaker time, relay/CT errors, safety margin).

4.  **Plug Setting Coordination Rule:**
    $$
    "PS"_("upstream") > frac(1.3, 1.05) times "PS"_("downstream")
    $$
    (when referred to the same voltage base).

5.  **Differential Relay Operating Condition (Biased):**
    $$
    abs(i_1 - i_2) > "Basic Setting" + "Bias" times frac(abs(i_1 + i_2), 2)
    $$

### **Common Traps & Mistakes**
- **Mixing Primary/Secondary Currents:** Always convert all currents to one side (usually secondary) before calculating MP or comparing pickups.
- **Forgetting CT Connection Rule:** For Δ-Y transformers, CTs on Δ-side are Y-connected, and CTs on Y-side are Δ-connected to compensate phase shift.
- **Incorrect Coordination Start Point:** Always start coordination from the **load end** and move upstream.
- **Using Fault Current at Relay Location:** For coordination, use the fault current at the **downstream relay's bus**.
- **Ignoring Basic Setting in Differential Relay:** The bias equation includes a minimum pickup (basic setting), not just a percentage.
- **Transient Overreach:** Only affects **instantaneous** relays; time-delayed relays are immune.

### **Key Comparisons**
| Feature | Instantaneous Relay | Definite Time Relay | Inverse Time (IDMT) Relay |
| :--- | :--- | :--- | :--- |
| **Operating Time** | ~1-3 cycles | Fixed delay | Inversely proportional to current |
| **Primary Use** | High-set unit for close-in faults | Backup where current discrimination fails | Primary/backup for feeders |
| **Coordination** | By current setting only | By time setting only | By both current and time settings |
| **Transient Overreach** | **Susceptible** | Immune | Immune |

### **Differential Protection Essentials**
- **Zone:** Defined by CT locations on both sides of the equipment.
- **Spill Current:** Caused by CT mismatch, unequal lead lengths, tap changes. Handled by **bias setting**.
- **Bias Setting:** Provides stability for external faults by requiring differential current to be a percentage of through current.
- **Transformer CT Connection:** Reverse of transformer winding connection (Δ-side CTs in Y, Y-side CTs in Δ) to cancel phase shift.

### **Exam Focus Areas**
1.  **Numerical Coordination:** Calculate MP, T_op, TDS for a given fault scenario.
2.  **Plug Setting Selection:** Apply load and coordination rules to choose the correct PS from standard steps.
3.  **Characteristic Matching:** Know which relay characteristic (NI, VI, EI) matches fuses/MCCBs.
4.  **Differential Relay Principle:** Understand why bias is needed and how it prevents maloperation.
5.  **Transient Overreach:** Identify its cause (DC offset) and which relays are affected.