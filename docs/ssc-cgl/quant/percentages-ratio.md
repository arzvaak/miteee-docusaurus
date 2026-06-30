---
title: Percentages, Ratio, and Proportion
description: Deep SSC CGL Tier-I Quant note for 200/200 preparation.
tags: [ssc-cgl, quant, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---

## Concept Ladder

**36-second Quant scoring bar**  
Percentages and ratios are 36-second questions when the base is identified quickly. Use 5 seconds to mark the base, 20 seconds to run the fraction/multiplier calculation, and 5 seconds to verify whether the question asks "of", "more than", "less than", "percentage points", or final ratio. If the base is ambiguous, write a 100-value model immediately.

**Prerequisite Arithmetic**  
- Place value, basic operations (+, -, *, /).  
- Fractions: proper, improper, mixed; conversion to decimals.  
- Decimal arithmetic: multiply/divide by powers of 10.  
- HCF/LCM: used in ratio simplification and proportion cross-multiplication.

**Step 1 - Percent as Fraction**  
Percent means "per hundred". 1% = 1/100. Convert any percent a% to fraction a/100; simplify.  
Mental conversion: 50% = 1/2, 25% = 1/4, 12.5% = 1/8, 33.33% = 1/3, etc.  
**Base concept**: percentage is a ratio relative to 100. "x% of y" means (x/100)*y.

**Step 2 - Percentage Change**  
Change% = (New - Old)/Old x 100.  
Always identify the **base** (denominator). If price goes from 80 to 100, increase = (20/80)x100 = 25%.  
Trap: reverse calculation - if new is 100, old is 80, old is 20% less than new? (100-80)/100=20% - correct base is new.

**Step 3 - Successive Percentage Change**  
If a quantity changes by a% then b%, overall change = a + b + (ab/100).  
Example: 10% increase then 20% increase -> overall = 10+20+200/100 = 32% increase.  
If decrease, treat as negative. E.g. -10% then -20% -> -10-20+200/100 = -28% (i.e. 28% decrease).

**Step 4 - Ratio Basics**  
Ratio a:b = a/b. Equivalent ratios: multiply/divide both terms by same non-zero number.  
Proportion: a:b = c:d => ad = bc. Fourth proportional, third proportional, mean proportional.

**Step 5 - Compound Ratio**  
Ratio of two ratios: a:b and c:d compound to ac:bd. Used in income-expenditure, speed-time.

**Step 6 - Partnership**  
Profit sharing proportional to capital x time. Missing a partner's time or capital -> solve by ratio multiplication.

**Step 7 - Linkage to Profit-Loss, SI/CI, Data Interpretation**  
- Profit% = (Profit/CP)x100; Loss% similarly.  
- Discount% = (Discount/MP)x100.  
- SI = PxRxT/100, CI = P[(1+R/100)^T - 1].  
- Data Interpretation: percentages appear in tables (share, growth, distribution). Ratio used to compare sectors.

**Integration**  
A 200/200 student must fluidly convert between fractions, decimals, percents; instantly identify base; apply successive change mentally; use ratio multiplier to avoid fraction mess; and link concepts across topics.

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|-----------------|--------|--------------|------|
| Percent to fraction | "x% of y" or "x% is" | Write x/100, simplify by 5/2/4 etc. | <3 sec | Forgetting that % means /100; eg 12.5% = 1/8 not 1/12.5 |
| Find percentage of a quantity | "What is 15% of 300?" | Multiply quantity by percent/100; use fraction if easy | <5 sec | Mistaking "of" for "percentage of" (actually multiply) |
| Percentage change | "increase/decrease by x%" | (Change/Original)x100; identify original | <10 sec | Using wrong base (new value instead of old) |
| Successive change (two) | "increased by a% then b%" | Formula a+b+ab/100 | <15 sec | Ignoring sign for decrease; forgetting to add ab/100 |
| Successive change (more than two) | "three successive discounts" | Chain multipliers: (1+a/100)(1+b/100)(1+c/100) | <20 sec | Adding discount percentages instead of multiplying factors |
| Percentage points | "inflation rose from 5% to 7%" | Difference = 2 percentage points, not 40% change | <5 sec | Treating percentage points as percent change |
| Ratio comparison | "A:B = 2:3, B:C = 4:5" | Find common B: LCM of 3 and 4 => 12; A:B = 8:12, B:C=12:15 => A:B:C=8:12:15 | <15 sec | Multiplying terms directly without equalizing |
| Compound ratio | "a:b and c:d" | Multiply antecedents and consequents: ac:bd | <10 sec | Reversing order; use as given |
| Proportion missing term | "Find x: a:b = c:x" | Cross multiply: axx = bxc => x = bc/a | <8 sec | Confusing extremes and means |
| Partnership profit share | "A invests x for p months, B invests y for q months" | Profit ratio = (xxp) : (yxq) | <20 sec | Forgetting time factor when asked |
| Profit/Loss with discount | "MP = 1000, discount 20%, profit 25%" | Find SP = 80% of MP = 800; CP = SP/(1+profit%) = 800/1.25 = 640 | <30 sec | Applying discount to CP instead of MP |
| Data Interpretation | "tabular data with percentages" | Extract base from total, compute required ratio/percent | <45 sec per question | Misreading row/column headers; decimal shift error |

## Speed Methods

**Mental Conversion Table**  
| Percent | Fraction | Decimal |
|---------|----------|---------|
| 50%     | 1/2      | 0.5     |
| 33.33%  | 1/3      | 0.3333  |
| 25%     | 1/4      | 0.25    |
| 20%     | 1/5      | 0.2     |
| 16.66%  | 1/6      | 0.1667  |
| 14.28%  | 1/7      | 0.142857|
| 12.5%   | 1/8      | 0.125   |
| 11.11%  | 1/9      | 0.1111  |
| 10%     | 1/10     | 0.1     |
| 8.33%   | 1/12     | 0.08333 |

**Algorithm for Any Percent of a Number**  
Example: 37% of 280.  
Method 1: 280 x 37/100 = (280x37)/100 = 10360/100 = 103.6  
Method 2: 10% = 28, 30% = 84; 7% = 19.6; sum = 103.6  
Speed: use fractional breakdown for common percents.

**Successive Change - Step-by-Step**  
1. Write each change as factor: increase by r% => multiply by (1 + r/100). Decrease => (1 - r/100).  
2. Multiply all factors.  
3. Subtract 1 and convert to percent: (product - 1) x 100.  
Example: Increase 10%, then decrease 10%. Factor = 1.1 x 0.9 = 0.99. Overall = (0.99-1)x100 = -1% (1% decrease).

**Ratio Multiplier Method**  
To combine ratios A:B=2:3, B:C=4:5:  
Write A:B = 2:3 = (2x4):(3x4)=8:12  
Write B:C = 4:5 = (4x3):(5x3)=12:15  
Thus A:B:C=8:12:15.  
Use LCM of B terms (3 and 4 ->12). Multiply each ratio to make B term = LCM.

**Alligation Cross (for Mixtures linked to Ratio/Percent)**  
Used when mixing two items of different cost/concentration to get a mean.  
Cross: (C2 - Mean) : (Mean - C1) = Quantity 1 : Quantity 2.  
Example: 30% and 50% sugar solutions mixed to get 40%. Ratio = (50-40):(40-30)=10:10=1:1.  
Speed: no need for variables. Verify mean is between extremes.

## Trap Table

| # | Trap | Why it works | How to avoid |
|---|------|--------------|--------------|
| 1 | Base swap: "If A is 25% more than B, then B is what % less than A?" | Common: 25% less. Correct: % less = (25/125)x100=20%. | Always use base = the quantity after "than". |
| 2 | Successive discounts: "20% then 10%" != 30% | Believing discounts add. | Multiply factors: 0.8x0.9=0.72 => 28% overall discount. |
| 3 | Percentage points vs percent change: inflation from 5% to 7% | Say "2% increase" but actually 2 percentage points; percent change in inflation is (2/5)x100=40%. | Read carefully: "percentage point" means absolute difference. |
| 4 | Ratio multiplication vs addition: "A:B=2:3; increase both by 2" | Adding 2 gives 4:5, but many think it's 2:3+2 = 4:3. | Multiply or add consistently: if "increase by 2" means add, but ratio changes. |
| 5 | Partnership without time factor: "A and B invest 200 and 300, profit 1000" | Assume equal time - but if time differs, ratio of capital x time. | Always check if time is given; if not, assume equal. |
| 6 | Discount on MP vs CP: "profit 20% after 10% discount on MP" | Confusing whether discount is on CP or MP. | Discount is always on MP, profit on CP. |
| 7 | Fractional percent: 12.5% is 1/8 but 12.5% of 64 = 8; but 12.5% of 24 = 3. | Forgetting to simplify fraction correctly. | Memorize common conversions; use fraction = 1/8 for 12.5%. |
| 8 | "Percent of" vs "percent more than": "40% of students" vs "40% more than last year" | Different base. | Identify base word after "of" or "than". |
| 9 | Compound ratio order: "If a:b = 2:3 and b:c = 4:5, then c:a?" | Must invert or reverse. | First find a:b:c then take required pair. |
| 10 | Data interpretation: reading growth rate as percent of total | Misreading table labels: "growth rate" is change from previous year, not share. | Always check headers and units. |
| 11 | Equivalent ratio simplification: 15:20 = 3:4, but if part is increased, ratio changes. | Forgetting scaling. | Keep ratio constant unless told to change. |
| 12 | Profit% on cost vs on sale: "profit is 20% on cost" vs "on sale" | The denominator changes. | If profit% on cost => (Profit/CP)x100; on sale => (Profit/SP)x100 (rare). |

## Flowchart

```mermaid
flowchart TD
    A[Start: Read problem] --> B{Is it a percentage problem?}
    B -- Yes --> C[Identify base value]
    B -- No --> D[Go to Ratio/Proportion branch]
    C --> E{Type of question?}
    E -- Find % of number --> F["Multiply: base x (percent/100)"]
    E -- % change --> G["Compute (change/base)x100"]
    E -- Successive change --> H["Chain multipliers: (1 +/- r1/100)(1 +/- r2/100)..."]
    H --> I["Overall % = (product - 1)x100"]
    E -- % points --> J[Direct subtraction, no division]
    D --> K{Type?}
    K -- Simple ratio --> L[Write as a:b, simplify]
    K -- Combine ratios --> M[Use LCM method to equalize common term]
    K -- Proportion missing --> N[Cross multiply: a/b = c/d => ad=bc]
    K -- Partnership --> O[Profit ratio = capital1xtime1 : capital2xtime2]
    O --> P[Divide profit proportionally]
    F, G, I, J, L, M, N, P --> Q[Check with options / sanity check]
    Q --> R[Mark answer]
```

## Solved Examples

**Example 1**  
Question: 12.5% of 640 is what percent of 80?  
Options: A) 100%  B) 80%  C) 120%  D) 75%  
Explanation: 12.5% = 1/8; 1/8 of 640 = 80. So 80 out of 80 = 100%.  
Answer: A) 100%

**Example 2**  
Question: If A's salary is 20% more than B's, then B's salary is how much less than A's?  
Options: A) 20%  B) 16 2/3%  C) 25%  D) 33 1/3%  
Explanation: Let B=100, A=120. Less % = (20/120)x100 = 16.67% = 16 2/3%.  
Answer: B) 16 2/3%

**Example 3**  
Question: A number increased by 10% and then decreased by 10%. Net change?  
Options: A) 1% increase  B) 1% decrease  C) 0%  D) 2% decrease  
Explanation: Factor=1.1x0.9=0.99 => (0.99-1)x100 = -1% (decrease).  
Answer: B) 1% decrease

**Example 4**  
Question: If a:b = 2:3 and b:c = 4:5, find a:b:c.  
Options: A) 8:12:15  B) 10:12:15  C) 2:3:5  D) 8:15:12  
Explanation: LCM of 3 and 4 =12. a:b = (2x4):(3x4)=8:12; b:c = (4x3):(5x3)=12:15 => 8:12:15.  
Answer: A) 8:12:15

**Example 5**  
Question: A invested Rs.2000 for 6 months, B invested Rs.3000 for 8 months. Profit Rs.3600. B's share?  
Options: A) 1800  B) 2000  C) 2400  D) 1600  
Explanation: Ratio = (2000x6):(3000x8)=12000:24000=1:2. Total parts=3. B share = (2/3)x3600 = 2400.  
Answer: C) 2400

**Example 6**  
Question: Marked price Rs.500, discount 20%, still profit 25%. Cost price?  
Options: A) 300  B) 320  C) 350  D) 400  
Explanation: SP = 80% of 500 = 400. CP = SP / (1+profit%) = 400/1.25 = 320.  
Answer: B) 320

**Example 7**  
Question: In a mixture of 60 liters of milk and water, milk is 60%. How much water must be added to make milk 40%?  
Options: A) 20 l  B) 30 l  C) 40 l  D) 50 l  
Explanation: Milk = 36 l. After adding water, milk becomes 40% of new total. So 36 = 0.4x(60+x) => 36=24+0.4x => 0.4x=12 => x=30.  
Answer: B) 30 l

**Example 8**  
Question: The ratio of incomes of A and B is 5:4 and ratio of expenditures is 3:2. If each saves Rs.2000, find A's income.  
Options: A) 4000  B) 5000  C) 6000  D) 8000  
Explanation: Let incomes be 5x and 4x. Let expenditures be 3y and 2y. Equal savings gives 5x - 3y = 2000 and 4x - 2y = 2000. Multiply the second equation by 1.5: 6x - 3y = 3000. Subtract the first equation: x = 1000. Therefore A's income = 5x = Rs.5000. Quick check: B's income = Rs.4000, expenditures become Rs.3000 and Rs.2000, and the expenditure ratio is 3:2.  
Answer: B) 5000

**Example 9**  
Question: The population of a town increased by 10% in the first year, 20% in the second, and decreased by 10% in the third. What is the overall percentage change?  
Options: A) 18.8% increase  B) 15.6% increase  C) 20% increase  D) 8% increase  
Explanation: Factors: 1.1x1.2x0.9 = 1.188 -> 18.8% increase.  
Answer: A) 18.8% increase

**Example 10**  
Question: Two numbers are in ratio 3:5. If 8 is added to each, ratio becomes 5:7. Find the numbers.  
Options: A) 12,20  B) 15,25  C) 18,30  D) 9,15  
Explanation: Let numbers 3x and 5x. (3x+8)/(5x+8)=5/7 -> cross: 7(3x+8)=5(5x+8) -> 21x+56=25x+40 -> 4x=16 -> x=4 -> numbers 12 and 20.  
Answer: A) 12,20

## PYQ Mapping

Based on official anchor: SSC CGL Tier-I Quant includes percentages, ratio, proportion as core. PYQ trends show heavy weight in:  
- Successive discount and profit% (3-4 questions)  
- Ratio combination (A:B:C) and partnership (2-3)  
- Data interpretation involving percentage share (4-5)  
- Simple percent change and base confusion (1-2)  

**Practice Routes** (linked to local paths):  
- For all percent basics, conversions, successive change -> [/exams/ssc-cgl/topics/percentages](/exams/ssc-cgl/topics/percentages)  
- For ratio, proportion, partnership, alligation -> [/exams/ssc-cgl/topics/ratio-proportion](/exams/ssc-cgl/topics/ratio-proportion)  
- For profit-loss and discount -> [/exams/ssc-cgl/topics/percentages](/exams/ssc-cgl/topics/percentages)  
- For SI/CI linkage -> [/exams/ssc-cgl/topics/percentages](/exams/ssc-cgl/topics/percentages) plus interest topics when available  
- For DI with percentages -> [/exams/ssc-cgl/topics/data-interpretation](/exams/ssc-cgl/topics/data-interpretation)  

**Recommended Drills from PYQ**:  
- Solve 10 successive change problems daily (mix of increase, decrease, discounts).  
- Solve 10 ratio combination problems (two ratios, three terms).  
- Solve 5 partnership with varying time.  
- Solve 5 mixture alligation with percent concentration.  
- Solve 2 DI tables with 5 questions each focusing on percentage difference and ratio comparison.

## 200/200 Drill

**Timed Micro-Drills** (aim for 90% accuracy within time):  

1. **Conversion Speed Drill** (2 min - 10 questions)  
   Convert: 75%, 37.5%, 62.5%, 87.5%, 66.66%, 83.33%, 40%, 55%, 18.18%, 6.25% into simplest fractions.  
   Set timer and write answers. Check against known conversions.

2. **Base Identification Drill** (3 min - 8 questions)  
   - A is 30% less than B. B is __% more than A?  
   - 20% of 300 is what % of 500?  
   - If salary increased from 40000 to 46000, % increase?  
   - If salary increased by 10% to 44000, original?  
   - A:B = 2:3, B increases by 20% then ratio becomes?  
   (Write base explicitly)

3. **Successive Change in 5 Min** (6 questions)  
   a) Increase 10% then 15% -> overall %?  
   b) Discount 20% then 10% -> overall discount%?  
   c) Increase 10% then decrease 5% -> net%?  
   d) Increase 100% then decrease 50% -> net%? (0%)  
   e) Three successive discounts 10%,10%,10% -> overall discount?  
   f) Price increased by 20% then decreased by 20% -> net?  

4. **Ratio and Proportion in 5 Min** (5 questions)  
   a) A:B = 3:4, B:C = 2:5 -> A:B:C?  
   b) If a:b = 5:6 and b:c = 9:4, find a:c?  
   c) 15 workers can complete work in 20 days. In how many days 20 workers? (inverse proportion)  
   d) Divide 1000 in ratio 2:3:5.  
   e) If x:y = 4:5 and y:z = 10:7, find x:z.

**Repair Rules**  
- Mistake: Base confusion in % change. -> **Repair**: Circle the word after "than" - that's the base.  
- Mistake: Adding discount percentages. -> **Repair**: Convert each to multiplier (1 - d/100) and multiply.  
- Mistake: Ratio combination error. -> **Repair**: Always find LCM of common term, then scale.  
- Mistake: Profit% on CP vs SP. -> **Repair**: Read problem: "profit on cost" or "on sales"? Default is cost.  
- Mistake: Missing time in partnership. -> **Repair**: Scan for "for x months" - if not given, assume equal time.  

**Final Challenge** - Simulate 10 questions in 10 minutes from the two practice routes. Record mistakes and apply repair rules. Repeat until consistent 90%+ accuracy.

