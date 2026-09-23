---
title: "03 - Monitoring Targeting and Financial Evaluation"
math_syntax: typst
---

# 03 — Monitoring, Targeting, and Financial Evaluation

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> *Covers L03 (Energy Monitoring and Targeting) and L04 (Financial Evaluation of Energy Projects)*

---

## 3.1 Energy Monitoring and Targeting (M&T)

The guiding maxim: *"You cannot manage what you do not measure."*

M&T combines the **principles of energy use** and **statistics** to:

- **Eliminate waste**
- **Reduce and control** current energy use
- **Improve** existing operating procedures

### Six Key Steps of M&T

| Step | Definition |
|---|---|
| **Analyzing** | Correlating energy consumption to a measured output (e.g., production quantity) |
| **Comparing** | Comparing energy consumption to a standard or benchmark |
| **Setting Targets** | Setting targets to reduce or control consumption |
| **Monitoring** | Comparing consumption to the set target on a regular basis |
| **Reporting** | Reporting results including variances from targets |
| **Controlling** | Implementing management measures to correct variances |

> **Exam trap:** Do not merge *Comparing* (vs. a standard/benchmark) with *Monitoring* (vs. the set target, regularly).

### Benchmarking

The process of **identifying, understanding, and adopting outstanding practices and processes** from organizations anywhere in the world to help your organization improve its performance.

### Quantitative Information Requirements

1. **Energy billings data** — electrical demand, consumption, fuel, costs.
2. **Consumption measurements** at various levels (building, department, equipment).
3. **Independent variables** influencing consumption (e.g., production output).

---

## 3.2 CUSUM Analysis

**CUSUM = CUmulative SUM of differences** between actual and expected consumption.

$$   "CUSUM"_t = sum_(i=1)^(t)(E_("actual",i) - E_("expected",i))   $$

### Interpretation

- CUSUM **stays near zero** → consumption follows the established pattern.
- CUSUM **drifts upward** → a fault has occurred (more energy used than expected).
- CUSUM **drifts downward** → an improvement has occurred (less energy used than expected).

CUSUM quantifies **savings/losses to date** and shows **when performance changed**.

### Steps for CUSUM Analysis

1. Plot Energy–Production graph for the **pre-change period**.
2. Draw the best-fit straight line (regression).
3. Derive the equation: $E = m times P + b$.
4. Calculate expected energy consumption for all months.
5. Calculate the difference: Actual − Predicted.
6. Compute CUSUM (running total of differences).

### Worked Example

A heat recovery system was installed at month 9. Pre-change data (months 1–9) yields the regression:

$$   E = 0.4 times P + 182   $$

| Month | Actual (kWh) | Production (tonnes) | Predicted (kWh) | Deviation | CUSUM |
|---:|---:|---:|---:|---:|---:|
| 1 | 340 | 380 | 334 | +6 | +6 |
| 2 | 340 | 440 | 358 | −18 | −12 |
| ... | ... | ... | ... | ... | ... |
| 15 | 380 | 540 | 398 | −18 | −54 |
| ... | ... | ... | ... | ... | ... |
| 18 | 380 | 500 | 382 | −2 | −76 |

**Conclusion:** CUSUM = −76 kWh → a cumulative saving of 76 kWh achieved after the heat recovery system was installed.

> **Sign-convention:** In this table, actual below predicted gives negative deviations. The downward drift to −76 is read as a saving.

---

## 3.3 Target Setting — Four Levels of Energy Use

| Level | Definition |
|---|---|
| **Theoretical kWh/tonne** | Energy required when optimum equipment operates at **design efficiency** |
| **Equipment kWh/tonne** | Energy consumed by equipment at **actual current efficiency** |
| **System kWh/tonne** | Energy required when **operator and machine influences** (techniques, maintenance) are included |
| **Actual kWh/tonne** | Energy use including **operators'/supervisors' responses** and **time lag in responding** |

### Properties of a Target

- A statement of what management wishes to achieve.
- Determined from a position of knowledge.
- Must **challenge the organization** but be **achievable**.
- Conveys management priorities.
- Two essential components: **an amount** and **a time limit**.

---

## 3.4 Financial Evaluation Techniques

### Simple Payback Period (SPP)

$$   "SPP" = frac("First Cost", "Net Annual Saving")   $$

**Worked Example:** A continuous deodorizer costs Rs. 60 lakhs installed, Rs. 1.5 lakhs/year O&M, saves Rs. 20 lakhs/year in steam.

$$   "SPP" = frac(60, 20 - 1.5) = frac(60, 18.5) approx 3.24 " years" approx 3 " years " 3 " months"   $$

> **Common trap:** Use the **net** annual saving (20 − 1.5 = 18.5), not the gross saving.

**Advantages:** Simple to implement; suitable for projects with substantial early cash flows.

**Limitations:** Does not consider the time value of money; ignores cash flows beyond the payback period.

### Net Present Value (NPV)

$$   "NPV" = sum_(t=0)^(n) frac("CF"_t, (1+k)^t)   $$

- $"CF"_t$ = cash flow at end of year $t$ (negative for expenditure, positive for savings).
- $k$ = discount rate.
- $n$ = project life.

**Decision rule:** Accept if NPV > 0; reject if NPV < 0.

**Worked Example:** Investment Rs. 1,000,000; savings: 200k, 200k, 300k, 300k, 350k over 5 years; $k = 10\%$.

$$   "NPV" = -1{,}000{,}000 + frac(200{,}000, 1.10) + frac(200{,}000, 1.10^2) + frac(300{,}000, 1.10^3) + frac(300{,}000, 1.10^4) + frac(350{,}000, 1.10^5) = -5{,}273   $$

> The undiscounted savings total Rs. 1,350,000 which exceeds the Rs. 1,000,000 investment, yet NPV is still negative at 10% — ignoring the time value of money gives the wrong signal.

**Advantages:** Considers time value of money; considers the entire cash flow stream.

### Internal Rate of Return (IRR)

The discount rate at which NPV = 0 (or equivalently, total discounted benefits = total discounted costs).

**Worked Example:** Cash flows: −100,000; 30,000; 30,000; 40,000; 45,000.

- At $k = 15\%$: discounted benefits = 100,802 (slightly > 100,000)
- At $k = 16\%$: discounted benefits = 98,641 (< 100,000)
- Therefore IRR lies **between 15% and 16%**.

**Advantages:** Considers time value of money; considers entire cash flow stream; intuitive for businessmen.

**Limitations:** Cannot distinguish between lending and borrowing; a high IRR need not necessarily be desirable.

### Time Value of Money

- Rs. 100 deposited today at 10% → Rs. 110 after 1 year (**future value**).
- Rs. 100 received one year from now → Rs. 90.91 today (**present value**): $100/1.10 = 90.91$.

### Return on Investment (ROI)

ROI expresses the annual return from the project as a percentage of capital cost. ROI must always be higher than the cost of money (interest rate). Limitations: does not consider time value of money or variable nature of annual net cash inflows.

---

## 3.5 Energy Performance Contracting and ESCOs

**ESCO (Energy Service Company):** provides a complete energy project service — assessment, design, construction/installation, engineering, project management, **and financing**.

### Performance Contract Components

1. Energy efficiency opportunity analysis
2. Project development
3. Engineering
4. Financing
5. Construction/implementation
6. Training
7. Monitoring and verification

### How ESCOs Work

- Repayment comes from the **energy savings** resulting from the project.
- Risk is transferred **from end-user to ESCO** (technology and management risks).
- The end-user does not fund the project up front — need for up-front cost is eliminated.
- M&V is key: energy cost savings are guaranteed, so savings **must be measurable**.

> **Exam trap:** ESCOs are not "bankers" in the narrow sense. Financing is only one element of a bundled service package.

---

## Revision Checklist

- [ ] Six steps of M&T
- [ ] CUSUM formula, sign convention, and interpretation
- [ ] Four levels of energy use (Theoretical → Actual)
- [ ] Target properties (amount + time limit)
- [ ] SPP formula and net saving calculation
- [ ] NPV formula and decision rule
- [ ] IRR concept and trial-and-error bracketing
- [ ] Time value of money (present vs future value)
- [ ] ESCO and performance contracting components
