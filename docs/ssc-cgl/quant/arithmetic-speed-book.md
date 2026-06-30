---
title: Arithmetic Speed Book
description: Deep SSC CGL Tier-I arithmetic speed note for 200/200 preparation.
tags: [ssc-cgl, quant, arithmetic, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---

## Concept Ladder

**Step 1 - Number Sense Foundation**  
Every arithmetic problem reduces to operations on fractions, percentages, and ratios. Master 1/1 through 1/20 in both fraction and decimal form. Build instinct: 1/8 = 0.125 = 12.5 %, 1/6 ~= 16.67 %, 1/9 ~= 11.11 %, 1/7 ~= 14.28 %. This grid is the backbone of all speed methods.

**Step 2 - Base Selection**  
In SSC CGL, the same problem can be solved by taking different bases - cost price, original value, whole quantity. Choosing the right base (often 100, 1 unit, or LCM of given numbers) simplifies calculations. Example: "A is 20 % more than B" -> take B = 100, A = 120.

**Step 3 - Fraction - Percent - Decimal Conversion**  
Convert between representations instantaneously. Use the "Percent  Fraction" table (see Speed Methods). Any percentage can be written as a fraction with denominator 100 and simplified; but exam speed demands direct recall: 37.5 % = 3/8, 83.33 % = 5/6.

**Step 4 - Option Scanning & Range Estimation**  
Before computing, eliminate absurd options using magnitude, parity, unit digit, or divisibility. For example, in profit-loss, if CP is given and profit% > 0, SP must be > CP; if loss% > 0, SP < CP. Estimate a rough range first.

**Step 5 - Changed-Base Checks**  
Many problems trap you by changing the base in the middle of the statement. "X is 20 % more than Y, Y is 25 % less than Z. By what percent is X more/less than Z?" Here the base for the first relation is Y, for the second is Z, and the final base is Z. Always write the base explicitly.

**Step 6 - Bridging Topics**  
Average, Allegation, Mixture, Profit-Loss, Interest, Time-Work, Time-Speed-Distance - all connect through ratios and percent. For instance, speed and time are inversely proportional when distance is fixed. Unit work is a ratio concept. DI in SSC CGL is nothing but arithmetic applied to tables/charts.

**Step 7 - 36-Second Quant Scoring Bar**  
Tier-I gives 25 Quant questions in 15 minutes, so the real pacing target is 36 seconds per question. Spend the first 5 seconds choosing the method, the next 20-25 seconds executing it, and the last 5 seconds checking sign, unit, and base. If there is no clear entry within 12 seconds, mark it and return after the faster arithmetic questions are locked.

---

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|----------------|--------|--------------|------|
| Fraction-Percent Conversion | "1/8", "37.5%", "0.625" | Direct recall table | <3 sec each | Forgetting reciprocal conversion |
| Base Finding in Percentage | "A is x% more than B" | Assign base to the object after "than" | <10 sec | Mistaking base (e.g., take A as 100) |
| Successive Change | "Two consecutive discounts / increases" | Use formula a + b + ab/100 (effective %) | <15 sec | Applying simple addition |
| Profit/Loss with Overhead | "CP includes transport, tax" | Add overhead to CP before calculation | <15 sec | Forget to include overhead in CP |
| Simple/Compound Interest | "SI", "CI", "half-yearly" | Use formula; for CI use effective rate for given period | <20 sec | Confusing SI & CI time units |
| Allegation & Mixture | "Mix two varieties", "mean price" | Use rule of allegation (cross-multiply) | <15 sec | Wrongly assigning quantities to prices |
| Ratio & Proportion | "3:5", "share", "division" | Set up equation with constant k | <10 sec | Not checking if ratio is in simplest form |
| Average (including weighted) | "Mean of groups", "replaced value" | Use sum = average x number | <15 sec | Forgetting to account for total count change |
| Time & Work | "A does in x days, B in y days" | LCM method (work = LCM of days) | <20 sec | Not considering negative work (leak/person leaving) |
| Speed, Time, Distance | "Relative speed", "train crossing" | Use ratio; for upstream/downstream use net speed | <20 sec | Not converting km/h to m/s (x5/18) |
| Data Interpretation | "Table/bar chart with % or ratio" | Approximate; avoid exact calculation if not needed | <30 sec after reading | Reading wrong row/column |
| Estimation & Approximation | "Approximately", "closest value" | Round numbers to nearest 5, 10, 100 | <5 sec | Over-rounding leading to error > tolerance |

---

## Speed Methods

### Fraction-Percent Recall Table (must memorize)

| Fraction | Percent   | Decimal |
|----------|-----------|---------|
| 1/1      | 100%      | 1.00    |
| 1/2      | 50%       | 0.50    |
| 1/3      | 33.33%    | 0.333... |
| 1/4      | 25%       | 0.25    |
| 1/5      | 20%       | 0.20    |
| 1/6      | 16.67%    | 0.1666... |
| 1/7      | 14.28%    | 0.142857... |
| 1/8      | 12.5%     | 0.125   |
| 1/9      | 11.11%    | 0.111... |
| 1/10     | 10%       | 0.10    |
| 1/11     | 9.09%     | 0.0909... |
| 1/12     | 8.33%     | 0.08333... |
| 1/13     | 7.69%     | 0.076923... |
| 1/14     | 7.14%     | 0.071428... |
| 1/15     | 6.67%     | 0.06666... |
| 1/16     | 6.25%     | 0.0625   |
| 1/17     | 5.88%     | 0.058823... |
| 1/18     | 5.56%     | 0.05555... |
| 1/19     | 5.26%     | 0.05263... |
| 1/20     | 5%        | 0.05     |

**Two-way conversion rule**: Percent -> fraction: write %/100, simplify. Fraction -> percent: multiply by 100. But for common ones, recall directly.

### Decision Rules for Method Selection

1. **Any "by what %" question** -> Use fraction change method. (New - Old)/Old x 100.  
2. **Successive percentage change** -> Net % = a + b + (ab)/100. Works for any two changes.  
3. **Profit % / Loss %** -> Always based on CP unless stated. SP = CP x (1 + P%/100) for profit, CP x (1 - L%/100) for loss.  
4. **Discount %** -> Based on MP. SP = MP x (1 - D%/100).  
5. **SI and CI for 2 years** -> CI - SI = P x (r/100)^2.  
6. **Ratio of two numbers** -> If x:y = a:b, then x = ak, y = bk. Sum = (a+b)k.  
7. **Average of groups** -> Combined average = (n1xavg1 + n2xavg2)/(n1+n2).  
8. **Allegation** -> (Quantity of cheaper)/(Quantity of dearer) = (Price of dearer - Mean)/(Mean - Price of cheaper).  
9. **Time & Work** -> Total work = LCM of days taken by individuals. Efficiency = work/day.  
10. **Speed/Distance** -> d = sxt. For same distance, speed  1/time.

### Step-by-Step Algorithms

**Algorithm for Percentage Change Problem**  
1. Identify the base (the quantity after "than" or "of").  
2. Express the other quantity in terms of base.  
3. Plug into required ratio/percentage.  
4. Use fraction recall to simplify.

**Algorithm for Successive Discount**  
1. Assume MP = 100 (or any convenient number).  
2. Apply first discount: SP1 = MP x (1 - d1/100).  
3. Apply second discount on SP1: SP2 = SP1 x (1 - d2/100).  
4. Equivalent single discount = (MP - SP2)/MP x 100.

**Algorithm for Mixture Using Alligation**  
1. Write cheaper price (C), dearer price (D), mean price (M).  
2. Ratio C:D = (D - M) : (M - C).  
3. Multiply by total quantity ratio to find individual quantities.

---

## Trap Table

| # | Trap Statement | Why It Bites | Safe Guard |
|---|----------------|--------------|------------|
| 1 | "A is 20% more than B, and B is 25% less than C" | Treating every percentage as if it has the same base. | Write each relation with its own base: B=100 gives A=120; C=100 gives B=75. Convert through B before answering the final comparison. |
| 2 | "Profit percentage is calculated on selling price" | SSC sometimes mentions "profit on SP" but most questions use CP. Ignoring it gives wrong answer. | Always check: is profit% on CP or SP? If not specified, assume CP. |
| 3 | "Loss percentage is 20% means SP is 80% of CP" | Some students think loss 20% -> SP = CP - 20 = 80. But it's CP x 0.8. For CP=100, SP=80. Correct if CP=100. But if CP unknown, use 0.8 factor. |
| 4 | "Two successive discounts of 10% each" Equivalent discount? 20%? No, it's 19%. | Applying simple addition. | Remember net discount = a + b - (ab)/100. |
| 5 | "A can do a work in 6 days, B in 12 days. They work together and after 2 days B leaves. How long will A take to finish?" | Student calculates work done by both in 2 days, then leftover work, then divides by A's rate. No trap if careful. Trap: forgetting that B left, so after 2 days, only A works. Many compute total time including B's days incorrectly. |
| 6 | "A train 200 m long crosses a pole in 10 sec. Speed?" | Need to convert m/s to km/h (multiply by 18/5). Forgetting conversion gives wrong option. | Always convert if options are in km/h. |
| 7 | "Average of first 5 numbers is 10, of next 5 is 20. Average of all 10?" | Student takes (10+20)/2 = 15. Correct only if equal count. Here 15 is actually correct because both groups have same number of terms (5 each). Actual trap: if counts differ, must weight. So be careful: only if groups are same size. |
| 8 | "If selling price is doubled, profit triples. Find profit percentage." | Profit triples means new profit = 3xoriginal profit. Let CP = x, SP = y, profit = y - x. New SP = 2y, new profit = 2y - x = 3(y - x). Solve. Many set up equation incorrectly. | Write linear equations. |
| 9 | "Simple interest becomes 1.2 times in 2 years. Rate?" | Student uses SI = Pxrxt/100. 1.2P - P = 0.2P = Pxrx2/100 -> r=10%. Correct. No trap except wording "becomes 1.2 times" means amount = 1.2P, so SI = 0.2P. |
| 10 | "A sells to B at 10% profit, B sells to C at 10% profit. Profit% of B on CP?" | B's CP is A's SP. B's profit% = (SP_B - CP_B)/CP_B. Many mistakenly take A's CP as base for B. |
| 11 | "A mixture contains milk and water in ratio 2:1. 10 litres of water added, ratio becomes 2:3. Find initial milk." | Initial milk = 2k, water = k. After adding water: milk=2k, water=k+10. New ratio 2k : (k+10) = 2:3 -> cross multiply: 6k = 2(k+10) -> 6k=2k+20 -> 4k=20 -> k=5. Milk=10L. Trap: forgetting that adding water changes only water quantity, not milk. |
| 12 | "A sum of money doubles itself in 5 years at SI. In how many years will it become 4 times?" | SI formula: Amount = P(1+rt/100). Double -> 2P = P(1+5r/100) -> r=20%. Then for 4 times: 4P = P(1+20t/100) -> 1+0.2t = 4 -> 0.2t=3 -> t=15 years. Trap: student may think double in 5, quadruple in 10, but SI is linear only if interest earned per year is same, but for quadruple, need triple interest, so 15 years. |

---

## Flowchart

```mermaid
flowchart TD
    A[Start: Read the question] --> B{Is it a pure arithmetic problem?}
    B -- Yes --> C[Identify the topic: percent, ratio, average, etc.]
    C --> D[Choose base (100, LCM, or unit)]
    D --> E[Apply appropriate method from Speed Methods]
    E --> F{Any trap in wording?}
    F -- Yes --> G[Apply Trap-avoidance check]
    G --> H[Compute or estimate]
    F -- No --> H
    H --> I[Match with options: exact or approximate?]
    I --> J[Select answer]
    B -- No --> K[Is it a Data Interpretation or applied problem?]
    K -- Yes --> L[Extract data, approximate, use estimation]
    L --> H
    K -- No --> M[Skip or re-read]
    M --> A
    J --> N[Move to next question]
```

---

## Solved Examples

**Example 1** (Percent Base)  
If A is 40% of B and B is 30% of C, then what percent is A of C?  
A) 12%  
B) 15%  
C) 18%  
D) 20%  

**Explanation**: A = 0.4B, B = 0.3C -> A = 0.4x0.3C = 0.12C -> 12%. Option A.

**Example 2** (Successive Discount)  
A shopkeeper gives two successive discounts of 20% and 10% on an article. Find the equivalent single discount.  
A) 28%  
B) 30%  
C) 25%  
D) 27%  

**Explanation**: Net discount = a + b - ab/100 = 20 + 10 - (20x10)/100 = 30 - 2 = 28%. Option A.

**Example 3** (Profit/Loss with overhead)  
A man buys an article for Rs 500. He spends Rs 100 on transportation and sells it for Rs 720. Find profit percent.  
A) 20%  
B) 25%  
C) 22%  
D) 18%  

**Explanation**: Total CP = 500+100=600. Profit = 720-600=120. Profit% = (120/600)x100 = 20%. Option A.

**Example 4** (Simple Interest)  
At what rate of simple interest will a sum become 1.5 times in 4 years?  
A) 10%  
B) 12.5%  
C) 15%  
D) 8%  

**Explanation**: Amount = 1.5P -> SI = 0.5P. SI = Pxrx4/100 -> 0.5P = Pxrx4/100 -> r = (0.5x100)/4 = 12.5%. Option B.

**Example 5** (Compound Interest - 2 years)  
The difference between CI and SI on a sum for 2 years at 10% p.a. is Rs 50. Find the sum.  
A) Rs 5000  
B) Rs 4000  
C) Rs 6000  
D) Rs 5500  

**Explanation**: CI - SI = P(r/100)^2 -> 50 = Px(10/100)^2 = Px0.01 -> P = 5000. Option A.

**Example 6** (Alligation)  
In what ratio must water be mixed with milk costing Rs 20 per litre to obtain a mixture worth Rs 16 per litre?  
A) 1:3  
B) 1:4  
C) 2:3  
D) 3:4  

**Explanation**: Cost of water = 0. Mean price = 16. Cheaper = 0, Dearer = 20. Ratio Water:Milk = (20-16):(16-0) = 4:16 = 1:4. Option B.

**Example 7** (Time & Work)  
A can finish a work in 20 days, B in 30 days. They work together for 5 days, then A leaves. How many days will B take to finish the remaining work?  
A) 10 days  
B) 12 days  
C) 15 days  
D) 17.5 days  

**Explanation**: LCM of 20,30 = 60 units work. A's efficiency = 3 units/day, B's = 2 units/day. Combined = 5 units/day. In 5 days: 25 units done. Remaining = 35 units. B alone takes 35/2 = 17.5 days. Option D.

**Example 8** (Speed-Time-Distance)  
A train 300 m long passes a platform 200 m long in 25 seconds. Find speed in km/h.  
A) 36 km/h  
B) 54 km/h  
C) 72 km/h  
D) 60 km/h  

**Explanation**: Total distance = 300+200=500 m. Time=25 s. Speed = 500/25 = 20 m/s. Convert to km/h: 20 x (18/5)=72 km/h. Option C.

**Example 9** (Average with missing value)  
The average of 10 numbers is 25. If one number is removed, the average becomes 23. Find the removed number.  
A) 43  
B) 45  
C) 47  
D) 42  

**Explanation**: Sum of 10 numbers = 10x25=250. Sum of remaining 9 = 9x23=207. Removed = 250-207=43. Option A.

**Example 10** (Ratio and percentage)  
If 2A = 3B = 4C, then find A:B:C.  
A) 2:3:4  
B) 4:3:2  
C) 6:4:3  
D) 3:4:6  

**Explanation**: Let 2A=3B=4C = k. Then A=k/2, B=k/3, C=k/4. Multiply by LCM 12 -> A:B:C = 6:4:3. Option C.

**Example 11** (Successive increase)  
A number is increased by 20% and then decreased by 20%. Find net change.  
A) 4% decrease  
B) 4% increase  
C) 0% change  
D) 2% decrease  

**Explanation**: Net change = a + b + ab/100, with a=+20, b=-20 -> 20-20+( -400)/100 = -4%. Decrease of 4%. Option A.

**Example 12** (Estimation)  
If 37.5% of a number is 240, find the number.  
A) 640  
B) 620  
C) 600  
D) 580  

**Explanation**: 37.5% = 3/8. So (3/8) x N = 240 -> N = 240x(8/3)=640. Option A.

---

## PYQ Mapping

This section links each type to a practice route from the SSC CGL syllabus. Use these links to drill the corresponding subtopics extensively.

- **Number System** (divisibility, LCM/HCF, unit digit): /exams/ssc-cgl/topics/number-system  
  *Practice route*: Master fraction-conversion and base selection with integer operations. PYQs often combine number system concepts with percentage shortcuts.

- **Profit, Loss, Discount**: /exams/ssc-cgl/topics/profit-loss-discount  
  *Practice route*: Focus on successive discounts, overhead inclusion, and changed-base questions. Use options to verify.

- **Simple and Compound Interest**: /exams/ssc-cgl/topics/simple-compound-interest  
  *Practice route*: Drill SI/CI difference problems, rate finding, and half-yearly compounding. Use the fraction table to convert rates.

- **Data Interpretation**: /exams/ssc-cgl/topics/data-interpretation  
  *Practice route*: DI in SSC CGL is arithmetic applied - practice reading tables/charts, approximating sums, and using ratio bridges. Speed target: 30 sec per question.

**General PYQ Pattern**: Every year, approximately 8-10 questions come from the arithmetic topics mentioned. The fraction-percent conversion and base selection shortcuts appear in at least 4-5 questions. Use the Speed Methods and Trap Table to avoid common errors.

---

## 200/200 Drill

### Timed Micro-Drills (Each set should take <=2 minutes)

**Drill 1 - Fraction-Percent Recall**  
Time: 30 seconds. Write the percent equivalent for: 1/3, 1/7, 1/12, 3/8, 5/6.  
Answers: 33.33%, 14.28%, 8.33%, 37.5%, 83.33%.

**Drill 2 - Base Selection**  
Time: 1 minute.  
a) If X is 30% more than Y, then Y is what percent less than X?  
b) If A is 25% less than B, then B is what percent more than A?  
Answers: a) 23.08% (approx), b) 33.33%.

**Drill 3 - Successive Change**  
Time: 1 minute.  
a) Effective discount for 10% and 15% successive discounts.  
b) Net increase if 20% increase followed by 20% increase.  
Answers: a) 23.5%, b) 44%.

**Drill 4 - Option Elimination**  
Time: 30 seconds.  
"If 125% of a number is 500, find the number." Options: A) 425, B) 400, C) 375, D) 350. Eliminate quickly.  
(125% = 5/4, so number = 500x4/5 = 400. Option B.)

### Repair Rules

If you miss a drill target, identify the reason:

| Missed Drill | Likely Cause | Repair Action |
|--------------|--------------|---------------|
| Fraction recall slow | Not memorized | Revisit full fraction table; write 10 times each. |
| Base selection error | Misidentified base | Write each statement as equation: X = base x (1 +/- p/100). |
| Successive change wrong | Used simple addition | Memorize formula a + b + ab/100. |
| Option elimination off | Did not estimate | Learn to round to nearest integer; use range. |

**Final Tip**: In the actual exam, mark 8-10 questions as "must do" in first pass (those with clear recognition cues). Use the Trap Table before solving. Never spend more than 45 seconds - if stuck, move to next and come back for option testing.

Now go to the practice routes and grind 100 questions per topic. You are ready for 200/200.

