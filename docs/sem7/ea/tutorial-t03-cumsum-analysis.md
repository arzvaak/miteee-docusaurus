---
title: "Tutorial 03 - CUSUM Analysis"
sidebar_label: "Tutorial 03 - CUSUM Analysis"
sidebar_position: 103
description: "Source-complete worked questions for Tutorial 03 - CUSUM Analysis, with units, checks, and common traps."
tags:
  - energy-auditing
  - ele-4446
  - tutorial
  - worked-solutions
---

# Tutorial 03 - CUSUM Analysis

*Energy Monitoring and Targeting - Cumsum Analysis*

| Provenance | Value |
|---|---|
| Source file | `T03-Cumsum_Analysis.pptx` (5 slides) |
| Source ID | `t03-cumsum-analysis` |
| SHA-256 | `d124630bca23a80b7b0a4a2cc7e58f5e400cf6aeddedac62845ee96038e351f5` |
| Embedded source visuals | Four slide images were supplied for source reconciliation; their paths are retained in the audit manifest. |
| Slide footer (slides 2–5) | "Tutorial 04 - Financial Analysis Technique and Load curves", dated 29-Dec-25 (a sibling-deck footer; the content is the CUSUM tutorial) |
| Slide 5 speaker notes | "5" (no additional content) |

---

## Concept refresher: CUSUM in energy monitoring

CUSUM = **CUmulative SUM** of deviations of actual performance from a predicted (target) performance. SEC = specific energy consumption, in kWh/MT (kWh per metric tonne of product).

$$d_i = \text{Actual SEC}_i - \text{Predicted SEC}_i \quad [\text{kWh/MT}] \qquad (d_i < 0 \Rightarrow \text{saving})$$

$$C_i = C_{i-1} + d_i, \qquad C_0 = 0 \quad [\text{kWh/MT}] \qquad (C_i < 0 \Rightarrow \text{cumulative saving})$$

$$\text{Total energy savings} = |C_N| \times \text{average production per month} \quad [\text{kWh/MT} \times \text{MT/month} = \text{kWh}]$$

Reading the table/plot (as used in both worked examples of this deck):

- Column convention preserved from the source tables: **Diff = ( Act - Pred ) ( - = Saving )** and **CUSUM ( - = Saving )**.
- A falling (more negative) CUSUM line = savings accruing; a rising CUSUM = a month that consumed more than predicted; a CUSUM of 0 = cumulative break-even.
- CUSUM smooths month-to-month noise in raw SEC differences and reveals the underlying trend, which is why it is preferred for verifying savings.
- Both examples in this deck use a **constant predicted SEC** (a horizontal target line), so the method reduces to the table arithmetic above.

---

## Question 1

### Source wording

> "Use CUSUM technique to develop a table and to calculate energy savings for 8 months period. For calculating total energy saving, average production can be taken as 6,000 MT per month. Refer to field data given in the table below."

The slide also prints the **source-stated answer: "Ans : 1,68,000 kWh"**, and the answer slide states: **"Savings in energy consumption over a period of eight months are 28 x 6000 =1,68,000 kWh"**. This is preserved as source material, not presented as an independently established official answer.

### Given and target

Field data (slide 2 table), predicted SEC constant at 1335 kWh/MT:

| Month | Actual SEC, kWh/MT | Predicted SEC, kWh/MT |
|---|---:|---:|
| May | 1311 | 1335 |
| June | 1308 | 1335 |
| July | 1368 | 1335 |
| Aug | 1334 | 1335 |
| Sept | 1338 | 1335 |
| Oct | 1351 | 1335 |
| Nov | 1322 | 1335 |
| Dec | 1320 | 1335 |

- **Given:** 8 months of actual SEC; predicted SEC = 1335 kWh/MT; average production = 6,000 MT/month.
- **Target:** develop the CUSUM table and calculate total energy savings for the 8-month period.

### Governing relation

$$d_i = \text{Act}_i - \text{Pred}_i, \qquad C_i = C_{i-1} + d_i, \qquad \text{Savings} = |C_8| \times 6000 \ \text{kWh}$$

### Step-by-step solution

Worked first row (May): $d_1 = 1311 - 1335 = -24$; $C_1 = 0 + (-24) = -24$. Then cumulate row by row (July's positive diff is **added**, pulling CUSUM up from $-51$ to $-18$):

| Month | Actual SEC, kWh/MT | Predicted SEC, kWh/MT | Diff = ( Act - Pred ) ( - = Saving ) | CUSUM ( - = Saving ) |
|---|---:|---:|---:|---:|
| May | 1311 | 1335 | -24 | -24 |
| June | 1308 | 1335 | -27 | -51 |
| July | 1368 | 1335 | 33 | -18 |
| Aug | 1334 | 1335 | -1 | -19 |
| Sept | 1338 | 1335 | 3 | -16 |
| Oct | 1351 | 1335 | 16 | 0 |
| Nov | 1322 | 1335 | -13 | -13 |
| Dec | 1320 | 1335 | -15 | -28 |

Final CUSUM: $C_8 = -28$ kWh/MT. Savings (matching the slide's own arithmetic "28 x 6000"):

$$\text{Savings} = 28 \ \text{kWh/MT} \times 6000 \ \text{MT/month} = 1{,}68{,}000 \ \text{kWh}$$

### Final answer

- CUSUM after 8 months = **−28 kWh/MT** (net saving).
- Total energy savings = **1,68,000 kWh (168,000 kWh)** over the eight months — identical to the slide's printed answer.

### Unit or sanity check

- Units: kWh/MT × MT/month = kWh. ✔
- Sum of diffs: $-24-27+33-1+3+16-13-15 = -28$ = final CUSUM. ✔
- Internal check: October's diff of $+16$ exactly cancels the running total of $-16$, giving CUSUM $= 0$ (cumulative break-even) — confirms the table is a true cumulative sum. ✔
- Note the slide multiplies 6000 **once**, not by 8 months: the CUSUM already spans the 8 months.

### Common trap

- Multiplying again by 8 months ($28 \times 6000 \times 8$) — this double counts, because CUSUM is already the sum of the eight monthly per-MT differences.
- Sign confusion: negative Diff = actual below predicted = **saving**, not a loss.
- Subtracting instead of adding July's $+33$ when cumulating (mixed signs must be preserved).

---

## Question 2

### Source wording

> "Use CUSUM technique and calculate energy savings for 6 months period of 2003. For calculating total energy savings, average production can be taken as 4000 MT/Month. Refer data given in table."
>
> "It may also be noted that energy saving measures were implemented prior to Jan-2003. It may also be noted that retrofits were not functioning during March & May 2003."

### Given and target

Field data (slide 4 table), predicted SEC constant at 265 kWh/MT:

| 2003 - Month | Actual –SEC, kWh/MT | Predicted SEC- kWh/MT |
|---|---:|---:|
| Jan | 242 | 265 |
| Feb | 238 | 265 |
| Mar | 287 | 265 |
| Apr | 237 | 265 |
| May | 295 | 265 |
| Jun | 246 | 265 |

- **Given:** 6 months (Jan–Jun 2003) of actual SEC; predicted SEC = 265 kWh/MT; average production = 4000 MT/month; energy-saving measures in place **before** Jan-2003; retrofits **non-functional in March and May 2003**.
- **Target:** CUSUM table and total energy savings for the 6-month period.

### Governing relation

$$d_i = \text{Act}_i - \text{Pred}_i, \qquad C_i = C_{i-1} + d_i, \qquad \text{Savings from final CUSUM} \times \text{production}$$

### Step-by-step solution

Worked first row (Jan): $d_1 = 242 - 265 = -23$; $C_1 = -23$. Full table as per the slide-5 answer:

| 2003 - Month | Actual - SEC, kWh/MT | Predicted SEC- kWh/MT | Difference= Actual-Predicted | CUSUM |
|---|---:|---:|---:|---:|
| Jan | 242 | 265 | -23 | -23 |
| Feb | 238 | 265 | -27 | -50 |
| Mar | 287 | 265 | +22 | -28 |
| Apr | 237 | 265 | -28 | -56 |
| May | 295 | 265 | +30 | -26 |
| Jun | 246 | 265 | -19 | -45 |

Interpretation (ties directly to the slide's notes):

- CUSUM is **negative in every month** → net cumulative savings throughout, consistent with "energy saving measures were implemented prior to Jan-2003".
- CUSUM **rises** in March ($+22$) and May ($+30$) — exactly the two months flagged as "retrofits were not functioning", where actual SEC exceeded the predicted 265 kWh/MT.

The slide's printed computation line reads: **"= 47 kWh/MT x 4000 MT x 6 months"** with **"Energy Savings for six months = 10.80 lakh kWh"**.

### Final answer

- CUSUM after 6 months = **−45 kWh/MT** (net saving).
- **Source-stated answer: Energy savings for six months = 10.80 lakh kWh** (1 lakh = 100,000, so 10.80 lakh kWh = 1,080,000 kWh).

**Reconciliation of source inconsistencies (flagged, not silently corrected):**

1. The printed "47 kWh/MT" does not reproduce the slide's own product: $47 \times 4000 \times 6 = 11.28$ lakh kWh $\neq$ 10.80 lakh kWh. The final CUSUM is $-45$, and only $45 \times 4000 \times 6 = 10.80$ lakh kWh matches; the "47" is evidently a typographical slip for 45.
2. Methodological flag: Question 1 of this same deck computes savings as $|\text{final CUSUM}| \times$ monthly production **without** a month factor ($28 \times 6000$). Applying that consistent CUSUM convention here gives $45 \times 4000 = 1{,}80{,}000$ kWh (1.80 lakh kWh). The slide instead multiplies by 6 months as well; since CUSUM already sums the monthly per-MT differences, the $\times 6$ double counts under the standard reading. The deck is therefore internally inconsistent between its two examples. For exam reproduction, quote the tutorial's stated answer (10.80 lakh kWh) if the marking scheme follows the slides, but know the strict CUSUM arithmetic ($45 \times 4000 = 1.80$ lakh kWh).

### Unit or sanity check

- Units: kWh/MT × MT = kWh. ✔
- Sum of diffs: $-23 - 27 + 22 - 28 + 30 - 19 = -45$ = final CUSUM. ✔
- Sign check: all CUSUM values $\leq 0$ → savings in every cumulative month, consistent with pre-Jan-2003 implementation. ✔
- Arithmetic check on the stated answer: $45 \times 4000 \times 6 = 1{,}080{,}000 = 10.80$ lakh kWh (but $47$ would give 11.28 lakh). ✔

### Common trap

- Copying the printed "47 kWh/MT" instead of the table's final CUSUM of −45 kWh/MT.
- Missing the two positive-diff months (Mar, May) — a CUSUM plot must show the line rising there (retrofit outage months).
- Sign convention: negative Diff/CUSUM = saving.
- Not noticing the ×6-months inconsistency with Question 1's convention — be ready to state both figures and which one the tutorial prints.

---

## Source-question coverage table

| Source slide | Content | Covered in |
|---|---|---|
| Slide 1 | Title: "Tutorial - 03 — Energy Monitoring and Targeting - Cumsum Analysis" | Title + Concept refresher |
| Slide 2 | Question 1 statement, field-data table (May–Dec, predicted 1335), printed answer "Ans : 1,68,000 kWh" | Question 1 — Source wording, Given and target |
| Slide 3 | Question 1 answer table (Diff/CUSUM, final −28) and statement "28 x 6000 =1,68,000 kWh" | Question 1 — Step-by-step solution, Final answer, sanity check |
| Slide 4 | Question 2 statement, data table (Jan–Jun 2003, predicted 265), notes on pre-Jan-2003 measures and Mar/May retrofit outages | Question 2 — Source wording, Given and target, interpretation |
| Slide 5 | Question 2 answer table (final CUSUM −45), computation line "47 kWh/MT x 4000 MT x 6 months", stated savings "10.80 lakh kWh" | Question 2 — Step-by-step solution, Final answer, reconciliation, common trap |

No other tutorial questions exist in the source; both examples are fully covered above.
