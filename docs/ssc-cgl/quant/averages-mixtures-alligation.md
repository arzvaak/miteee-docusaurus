---
title: Averages, Mixtures, and Alligation
description: Deep SSC CGL Tier-I Quant note for averages, mixtures, alligation, and weighted replacement under a 36-second bar.
tags: [ssc-cgl, quant, averages, mixtures, alligation, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---
## Concept Ladder

![Averages mixtures alligation decision map](/img/ssc-cgl/averages-mixtures-alligation-map.svg)

### Corpus Pressure

The uploaded book-PYQ corpus marks `averages-mixtures-alligation` as a 200/200 dominant-repeat Quant topic with 542 promoted questions. The largest direct bucket is Average with 248 questions, supported by dense Maths book page clusters such as p0581-p0600 with 79 questions, p0321-p0340 with 54 questions, and a 48-question overlap with Time, Speed and Distance. This chapter is one of the fastest ways to protect 50/50 in Maths because many problems collapse to one total/count or weighted-average decision.

| Corpus signal | What it demands | 36-second implication |
|---:|---|---|
| 542 promoted questions | Simple average, weighted average, replacement, alligation, mixture, class average, and average speed | Every subtype needs a fixed first move |
| 248 direct Average rows | Sum/count and replacement logic are repeatedly tested | Count tracking must be automatic |
| 48 TSD overlap rows | Equal-distance and equal-time speed traps recur | Classify distance/time before using a formula |
| Multiple page clusters | Same ideas appear in class, age, price, solution, and speed forms | Recognize the hidden average, not just the surface story |
| Mixture/alligation traps | Ratio direction and concentration base errors are common | Verify ratio direction in the final 5 seconds |

### First 5-Second Classification

| Wording seen | Bucket | First move |
|---|---|---|
| "average of n numbers" | Simple average | Sum/count or total = average x n |
| "one value is replaced" | Replacement | Change in total divided by count |
| "new students join/leave" | Class average | Update total and count separately |
| "equal distances at two speeds" | Average speed | Use harmonic mean 2ab/(a+b) |
| "equal time at two speeds" | Average speed | Use arithmetic mean |
| "x% and y% solutions mixed" | Weighted average | Convert percent to actual amount |
| "in what ratio to mix" | Alligation | Cross difference, then check ratio direction |
| "removed and replaced n times" | Repeated replacement | Remaining fraction = (1 - removed/total)^n |

**First Principle: Average as Equal Distribution**
Average = (Sum of all values) / (Number of values). This redistributes the total equally among all items.

**Step 2: Weighted Average**
When items have different weights, Weighted Average = (Sum of (weight x value)) / (Sum of weights). The weights reflect relative importance.

**Step 3: Sum from Average**
Total = Average x Count. If one value changes, the total changes by the same amount, and the new average is (Old Total + Change) / Same Count.

**Step 4: Average After Replacement**
If a value is removed and another added, the change in total is (New Value - Old Value). New average = Old Average + (Change / Count). This works for both individual and group replacements.

**Step 5: Average Speed**
- Equal distances: Average speed = 2ab / (a + b), where a and b are speeds for each half. Always less than or equal to the arithmetic mean.
- Unequal distances: Average speed = Total distance / Total time. Direct use of definition.
- Equal times: Arithmetic mean of speeds.

**Step 6: Mixtures and Concentration**
For a mixture of two components with concentrations c1 and c2, and volumes v1 and v2, the final concentration = (c1*v1 + c2*v2) / (v1 + v2). This is a weighted average.

**Step 7: Alligation**
When mixing two items with different prices or concentrations, the ratio of their quantities is inversely proportional to the difference from the mean.
Alligation rule: If a mixture at mean price M is made from two items at prices A and B (A < M < B), then Quantity of A : Quantity of B = (B - M) : (M - A). This shortcut avoids solving equations.

**Step 8: Repeated Replacement**
For a mixture of total volume V, from which x volume is removed and replaced with another component, after n such operations, the remaining quantity of the original component is Original Quantity * (1 - x/V)^n. Concentrations adjust similarly.

**Step 9: Class Average Updates**
When new members join or leave, calculate new total and new count. For changes in average due to scoring, use: New Average = (Old Total + New Total) / New Count.

**Step 10: Exam Integration**
In SSC CGL, these concepts appear in questions on age averages, profit/loss on mixed goods, speed mixtures, and replacement in chemical solutions. Recognize the underlying weighted average or alligation pattern to apply the quickest method. The 36-second target demands a decision tree: Is it a simple average? Sum available? Weighted? Alligation possible? Option testing feasible?

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|-----------------|--------|--------------|------|
| Simple Average | "average of n numbers" | Sum/n directly | 15 sec | Forgetting to count correctly when numbers are large |
| Weighted Average | "weight", "marks with credits" | Sum of (weight x value)/total weight | 20 sec | Using arithmetic mean instead of weighted |
| Average Replacement | "if x is replaced by y" | Change in total = y - x; new avg = old avg + change/n | 20 sec | Applying change to average directly without dividing by n |
| Average Speed (Equal Distances) | "covers half distance at a and half at b" | 2ab/(a+b) formula | 10 sec | Taking arithmetic mean (a+b)/2 |
| Average Speed (Unequal Distances) | "covers d1 in t1 and d2 in t2" | Total distance/Total time | 15 sec | Averaging speeds directly |
| Mixture Concentration | "x% and y% mixed" | Weighted average of concentrations | 20 sec | Adding percentages without weights |
| Alligation Ratio | "mix two items to get mean" | Cross differences: (higher-mean):(mean-lower) | 15 sec | Reversing ratio order |
| Repeated Replacement | "removed and replaced n times" | Formula: remaining = original*(1 - x/V)^n | 30 sec | Forgetting to account for volume reduction at each step |
| Class Average Update | "new students join or leave" | New total = old total + sum of new - sum of leaving | 20 sec | Counting wrong number of students after change |
| Price from Mixed Cost | "buys at different rates, sells at profit" | Find average cost, then apply profit% | 25 sec | Applying profit on individual costs instead of average |
| Age Average with Changes | "some leave, some join" | Net change in total age / new count | 25 sec | Ignoring that count remains same or changes |
| Equal-Time Speed | "travels at a for t time and b for t time" | Arithmetic mean of speeds | 10 sec | Using harmonic mean incorrectly |

## Speed Methods

### Recall Table

| Scenario | Formula/Approach | When to Use |
|----------|------------------|-------------|
| Sum from average | Sum = Avg x n | Given average and count |
| New average after replacement | New avg = Old avg + (New - Old)/n | One replacement only |
| Two-speed equal distance | Avg speed = 2ab/(a+b) | Two equal distances |
| Alligation ratio | Ratio = (B-M):(M-A) | Two items mix to mean M |
| Repeated replacement | Remaining = Original * (1 - x/V)^n | Multiple replacements |
| Weighted average | WAvg = (w1*x1 + w2*x2)/(w1+w2) | Different weights |

### Decision Rules

1. **Is the problem a simple average with all numbers given?** -> Use sum/n directly. Time: 15 sec.
2. **Is total given and one value known?** -> Find sum, subtract known. Time: 15 sec.
3. **Does it involve "replacement" of one element?** -> Use change method. Time: 20 sec.
4. **Is it an average speed question?** -> Check if distances equal or times equal. Use appropriate formula. Time: 10-15 sec.
5. **Is it a mixture with two components?** -> Use alligation if mean is asked or ratio needed. Time: 15 sec.
6. **Is it repeated replacement?** -> Use formula, but if n is small, simulate. Time: 30 sec.
7. **Can options be tested?** -> For weighted averages with integer options, test which option fits when multiplied by total weight. Use substitution if calculation is heavy.
8. **If stuck or time pressure?** -> Skip and return after finishing faster questions. Use approximation if options are far apart.

### 36-Second Attempt Plan

- **0-5 sec**: Read question, identify type from recognition cues.
- **5-15 sec**: Choose method: direct formula, option testing, or alligation. If alligation is applicable, cross-difference gives ratio instantly.
- **15-30 sec**: Execute calculation. For average speed with equal distances, plug into 2ab/(a+b). For replacement, compute change.
- **30-36 sec**: Verify answer matches one option. If not, check for base error (wrong denominator) or ratio reversal. If still stuck, mark and skip.

### Step-by-Step Algorithms

**Algorithm 1: Average Replacement (One Number)**
1. Find old total = old average x n.
2. Find new total = old total - old value + new value.
3. New average = new total / n.
4. Shortcut: new avg = old avg + (new value - old value)/n.

**Algorithm 2: Alligation for Ratio**
1. Let cheaper price = C, dearer price = D, mean price = M.
2. Ratio of cheaper to dearer = (D - M) : (M - C).
3. Simplify ratio.
4. If total quantity needed, divide accordingly.

**Algorithm 3: Average Speed with Two Equal Distances**
1. Let speeds be a and b.
2. Average speed = 2ab / (a + b).
3. For three equal distances, use 3abc/(ab+bc+ca).

**Algorithm 4: Weighted Average**
1. Multiply each value by its weight.
2. Sum these products.
3. Divide by total weight.
4. For option testing: assume total weight, compute sum, and see if average matches.

**Algorithm 5: Repeated Replacement**
1. Initial quantity of component = c * V, where c is concentration.
2. After one replacement: remaining = c * V * (1 - x/V).
3. After n replacements: remaining = c * V * (1 - x/V)^n.
4. For concentration: new concentration = c * (1 - x/V)^n.

## Trap Table

| Trap | Trigger Wording | Wrong Move | Correct Move | Repair Drill |
|------|-----------------|------------|--------------|--------------|
| Wrong base in average speed | "average speed for entire journey" | Taking arithmetic mean of speeds | Use total distance/total time or 2ab/(a+b) for equal distances | Practice 5 speed problems with both equal and unequal distances |
| Denominator confusion in replacement | "if one score is replaced" | Dividing change by wrong count | Always divide change in total by the total number of items after replacement | Solve 5 replacement problems focusing on count |
| Ratio reversal in alligation | "find ratio of A to B" | Writing (M-C):(D-M) incorrectly | Write (D-M):(M-C) for cheaper:dearer or invert as needed | Practice alligation ratio direction with 5 examples |
| Ignoring weights in mixture | "20% and 80% mixed in equal volumes" | Taking average as (20+80)/2 directly | Verify volumes equal; if not, use weighted average | Mix problems with different volume ratios |
| Percentage addition in concentration | "remove 15 L from 60 L of 20% mixture" | Adding percentages directly | Calculate actual amounts: concentrate = 20% of 60, etc. | Drill percent to amount conversion |
| Time unit mismatch in speed | "60 km/h for 30 minutes" | Using 30 min as 0.3 h | Convert to consistent units: 0.5 h | Practice unit conversion in 5 speed problems |
| Count change in class average | "5 new students join" | Using same count for new average | New count = old count + 5 | Update both total and count in 5 problems |
| Overlooking "replaced by" wording | "removed and replaced by same volume" | Assuming removal only | Include addition of new component | Simulate replacement steps on paper |
| Profit applied on individual cost | "buys at two rates, sells at 10% profit" | Applying 10% on each cost | Find average cost per unit, then apply profit | Solve 5 mixed cost profit problems |
| Equal-time speed taken as average | "travels at 40 and 60 km/h for equal times" | Using 2ab/(a+b) | Use arithmetic mean: (40+60)/2 | Distinguish equal-distance vs equal-time with 5 examples |
| Missing negation in age changes | "average age decreases by 2" | Assuming increase | If average decreases, total decreases | Practice reverse calculations in 5 problems |
| Ratio mistake in alligation for price | "mix tea at Rs 50 and Rs 70 to get Rs 60" | Ratio 1:1 is correct, but if mean is not midpoint, use cross difference | Always use (higher-mean):(mean-lower) | Verify with weighted average equation |
| Forgetting to multiply by weight | "weighted average of 2 and 3 with weights 5 and 7" | Using (2+3)/2 | Use (2*5+3*7)/(5+7) | Review weighted average definition |
| Rounding too early | "average of 1/3 and 2/3" | Using 0.33 and 0.66 | Use fractions exactly | Practice fractional averages |

## Flowchart

```mermaid
graph TD
    A[Start: Read Problem] --> B{Identify Type}
    B --> C[Simple Average]
    B --> D[Weighted Average]
    B --> E[Average Speed]
    B --> F[Mixture/Alligation]
    B --> G[Replacement]
    C --> H[Sum/Count -> Answer]
    D --> I[Sum of Products/Total Weight -> Answer]
    E --> J{Equal Distances?}
    J --> K[Yes: 2ab/(a+b)]
    J --> L[No: Total Distance/Total Time]
    F --> M{Mean or Ratio?}
    M --> N[Ratio: Cross Difference]
    M --> O[Mean: Weighted Average]
    G --> P{One Replacement?}
    P --> Q[Yes: New Avg = Old Avg + (New-Old)/n]
    P --> R[Multiple: Use (1-x/V)^n]
    H --> S[Check Options]
    I --> S
    K --> S
    L --> S
    N --> S
    O --> S
    Q --> S
    R --> S
    S --> T{Match?}
    T --> U[Yes: Select Answer]
    T --> V[No: Recheck Base/Count]
    V --> W[Correct or Skip]
    W --> X[End]
```

## Solved Examples

**Example 1: Average Basics**
The scores of 4 students are 18, 20, 22, and 24. What is their average?
Options: (a) 20 (b) 20.5 (c) 21 (d) 22
**Solution**: Average = (18 + 20 + 22 + 24) / 4 = 84 / 4 = 21. **Answer: (c) 21**

**Example 2: Average from Total**
The average of 6 numbers is 15. If one number is 18, find the average of the other 5 numbers.
Options: (a) 12 (b) 13.2 (c) 14.4 (d) 15
**Solution**: Total of 6 numbers = 6 x 15 = 90. The sum of the other 5 = 90 - 18 = 72. Average = 72 / 5 = 14.4. **Answer: (c) 14.4**

**Example 3: Weighted Average**
Paper A has weight 2 and score 80, Paper B has weight 1 and score 60. What is weighted average score?
Options: (a) 66.67 (b) 70 (c) 73.33 (d) 80
**Solution**: Weighted average = (2 x 80 + 1 x 60) / (2 + 1) = 220 / 3 = 73.33. **Answer: (c) 73.33**

**Example 4: Average After Replacing One Score**
The average of five ages is 20. If one age of 16 is replaced by 24, what is the new average?
Options: (a) 20 (b) 20.4 (c) 20.8 (d) 21.6
**Solution**: Original total = 5 x 20 = 100. Replacing 16 with 24 increases sum by 8. New total is 108. New average = 108 / 5 = 21.6. **Answer: (d) 21.6**

**Example 5: Average Speed for Equal Distances**
Run first 20 km at 20 km/h and next 20 km at 60 km/h. What is average speed?
Options: (a) 30 km/h (b) 40 km/h (c) 50 km/h (d) 60 km/h
**Solution**: Total distance = 40 km. Time = 20/20 + 20/60 = 1 + 0.333 = 1.333 h. Average speed = 40 / 1.333 = 30 km/h. **Answer: (a) 30 km/h**

**Example 6: Average Speed After Unequal Distance**
A driver covers 30 km in 1.5 h and 60 km in 1 h. What is average speed?
Options: (a) 36 km/h (b) 45 km/h (c) 50 km/h (d) 54 km/h
**Solution**: Total distance = 90 km. Total time = 1.5 + 1 = 2.5 h. Average speed = 90 / 2.5 = 36 km/h. **Answer: (a) 36 km/h**

**Example 7: Mixture Ratio**
An alloy has 20% and 80% purity components in equal volumes. What is purity of the mix?
Options: (a) 30% (b) 40% (c) 50% (d) 60%
**Solution**: If equal volume, average purity is (20 + 80) / 2 = 50%. **Answer: (c) 50%**

**Example 8: Alligation Ratio**
To make 40% solution from 20% and 70% solutions, what is the ratio of 70% part to 20% part?
Options: (a) 2:3 (b) 3:2 (c) 1:2 (d) 2:1
**Solution**: Use alligation: (70 - 40) : (40 - 20) = 30 : 20 = 3:2. So for 70% part to 20% part, ratio = 3:2. **Answer: (b) 3:2**

**Example 9: Selling Price from Mixed Cost**
A shopkeeper buys 20 liters at Rs 48/liter and 10 liters at Rs 36/liter. He sells all at 10% profit. What is selling price per liter?
Options: (a) 48.4 Rs/liter (b) 49 Rs/liter (c) 50 Rs/liter (d) 52 Rs/liter
**Solution**: Cost: 20 x 48 + 10 x 36 = 1320. Total 30 liters. Avg cost = Rs 44/liter. At 10% profit: 44 x 1.10 = 48.4. **Answer: (a) 48.4 Rs/liter**

**Example 10: Age Average with Changes**
Average age of 4 students is 21 years. Two students with ages 18 and 22 leave, and two students with ages 24 and 26 join. What is new average age?
Options: (a) 21 (b) 22.5 (c) 23 (d) 23.5
**Solution**: Initial sum = 4 x 21 = 84. New sum = 84 - 18 - 22 + 24 + 26 = 94. New count still 4. New average = 94 / 4 = 23.5. **Answer: (d) 23.5**

**Example 11: Class Average Adjustment**
Class average of 40 students is 72. If 5 new students each scoring 84 join, new average is?
Options: (a) 72.5 (b) 73 (c) 73.33 (d) 74
**Solution**: Initial total = 40 x 72 = 2880. New total = 2880 + 5 x 84 = 3300. New count = 45. Average = 3300 / 45 = 73.333.... **Answer: (c) 73.33**

**Example 12: Average After Replacement in Mixture**
A container has 60 L of 20% mixture. 15 L is removed and replaced by 40% mixture. What is final concentration?
Options: (a) 22.5% (b) 25% (c) 27.5% (d) 30%
**Solution**: Initial concentrate = 0.20 x 60 = 12 L. Removing 15 L removes 20% of 15 = 3 L concentrate, so remaining concentrate is 9 L in 45 L. Add 15 L at 40% gives 6 L concentrate. Total concentrate = 15 L in 60 L => 25%. **Answer: (b) 25%**

**Example 13: Missing Number From Average**
The average of 7 numbers is 32. Six numbers are 28, 30, 35, 31, 34, and 29. Find the seventh number.
Options: (a) 35 (b) 36 (c) 37 (d) 38
**Solution**: Total = 7 x 32 = 224. Sum of six = 187. Seventh number = 224 - 187 = 37. **Answer: (c) 37**

**Example 14: New Average After Increase**
The average salary of 20 employees is Rs 18,000. If each salary increases by Rs 1,500, what is the new average?
Options: (a) 18,500 (b) 19,000 (c) 19,500 (d) 20,000
**Solution**: If every value increases by 1,500, the average also increases by 1,500. New average = 19,500. **Answer: (c) 19,500**

**Example 15: Group Average Merge**
The average marks of 12 boys is 68 and the average marks of 8 girls is 73. Find the combined average.
Options: (a) 69 (b) 70 (c) 71 (d) 72
**Solution**: Total marks = 12 x 68 + 8 x 73 = 816 + 584 = 1400. Total students = 20. Average = 70. **Answer: (b) 70**

**Example 16: Reverse Class Average**
Average age of 30 students is 16 years. If the teacher's age is included, the average becomes 17 years. Find the teacher's age.
Options: (a) 42 (b) 45 (c) 47 (d) 49
**Solution**: Students' total = 30 x 16 = 480. New total = 31 x 17 = 527. Teacher's age = 527 - 480 = 47. **Answer: (c) 47**

**Example 17: Equal-Time Average Speed**
A car travels at 40 km/h for 2 hours and 60 km/h for 2 hours. Find average speed.
Options: (a) 45 (b) 48 (c) 50 (d) 52
**Solution**: Equal time means arithmetic mean of speeds: (40+60)/2 = 50 km/h. **Answer: (c) 50**

**Example 18: Three Equal Distances**
A person covers three equal distances at 30, 40, and 60 km/h. Find average speed.
Options: (a) 40 (b) 42 (c) 45 (d) 48
**Solution**: For equal distances, average speed = 3abc/(ab+bc+ca). = 3x30x40x60/(30x40 + 40x60 + 60x30) = 216000/(1200+2400+1800)=216000/5400=40. **Answer: (a) 40**

**Example 19: Alligation Price Ratio**
Rice costing Rs 40/kg is mixed with rice costing Rs 60/kg to get a mixture worth Rs 52/kg. Find the ratio of cheaper to dearer rice.
Options: (a) 2:3 (b) 3:2 (c) 4:3 (d) 3:4
**Solution**: Cheaper:dearer = (60-52):(52-40)=8:12=2:3. **Answer: (a) 2:3**

**Example 20: Find Quantity By Alligation**
How many kg of tea costing Rs 80/kg should be mixed with 30 kg tea costing Rs 120/kg to make a mixture worth Rs 100/kg?
Options: (a) 20 kg (b) 25 kg (c) 30 kg (d) 35 kg
**Solution**: Ratio cheaper:dearer = (120-100):(100-80)=20:20=1:1. Dearer quantity is 30 kg, so cheaper quantity is 30 kg. **Answer: (c) 30 kg**

**Example 21: Repeated Replacement**
A vessel contains 64 L milk. 16 L is removed and replaced by water. This is done twice. How much milk remains?
Options: (a) 36 L (b) 40 L (c) 48 L (d) 52 L
**Solution**: Remaining milk = 64 x (1 - 16/64)^2 = 64 x (3/4)^2 = 64 x 9/16 = 36 L. **Answer: (a) 36 L**

**Example 22: Mixture Percentage**
10 L of 30% acid solution is mixed with 20 L of 60% acid solution. Find final concentration.
Options: (a) 45% (b) 48% (c) 50% (d) 52%
**Solution**: Acid = 10 x 30% + 20 x 60% = 3 + 12 = 15 L. Total volume = 30 L. Concentration = 15/30 = 50%. **Answer: (c) 50%**

**Example 23: Average After Removing Highest**
Average of 10 numbers is 45. If the highest number 72 is removed, find the average of the remaining numbers.
Options: (a) 41 (b) 42 (c) 43 (d) 44
**Solution**: Total = 10 x 45 = 450. Remaining total = 450 - 72 = 378. Remaining count = 9. Average = 42. **Answer: (b) 42**

**Example 24: Weighted Marks**
A test has Section A weight 3 and Section B weight 2. A student scores 70 in A and 85 in B. Find weighted average.
Options: (a) 75 (b) 76 (c) 77 (d) 78
**Solution**: Weighted average = (3x70 + 2x85)/(3+2) = (210+170)/5 = 76. **Answer: (b) 76**

**Example 25: Average Cost and Profit**
A trader buys 12 kg at Rs 30/kg and 18 kg at Rs 40/kg. He sells the mixture at Rs 44/kg. Find profit percent.
Options: (a) 15% (b) 18% (c) 20% (d) 22%
**Solution**: Total cost = 12x30 + 18x40 = 360 + 720 = 1080. Total quantity = 30 kg. Average cost = 36/kg. Profit per kg = 44-36=8. Profit% = 8/36 x 100 = 22.22%, closest 22%. **Answer: (d) 22%**

## PYQ Mapping

The book-PYQ corpus contains 542 promoted questions in this route. The main source signals are:

- **Average direct cluster (248 questions)**: simple average, missing value, class average, replacement, joining/leaving members.
- **p0581-p0600 cluster (79 questions)**: mixed application practice, often combining average, mixture, and quantity logic.
- **p0321-p0340 cluster (54 questions)**: arithmetic overlap with profit/loss, percentage, and weighted cost problems.
- **Time, Speed and Distance overlap (48 questions)**: equal-distance/equal-time speed averages.
- **Smaller page clusters (69+ questions)**: p0621-p0640, p0381-p0400, p0301-p0320, and p0401-p0420 add mixture, alligation, and applied arithmetic variants.

Practice route: use `/exams/ssc-cgl/topics/averages-mixtures-alligation` for targeted drills, then connect to `/exams/ssc-cgl/topics/time-speed-distance`, `/exams/ssc-cgl/topics/percentages`, and `/exams/ssc-cgl/topics/profit-loss-discount` for cross-topic variants.

## 200/200 Drill

### Timed Micro-Drills

**Drill 1: Basic Averages (5 questions, 90 seconds)**
- Each question: find average of given numbers or use sum to find missing number.
- Target: 15 sec per question, 100% accuracy.
- Repair: If average calculation is slow, practice addition and division of 3-4 numbers daily.

**Drill 2: Average Replacement (5 questions, 100 seconds)**
- Each question: one value replaced, find new average.
- Target: 20 sec per question.
- Repair: Use shortcut formula; verify with sum method if double-check needed.

**Drill 3: Average Speed (5 questions, 75 seconds)**
- Mix of equal-distance and unequal-distance problems.
- Target: 15 sec per question.
- Repair: Memorize formula for equal distances; for unequal, always use total distance / total time.

**Drill 4: Alligation Ratio (5 questions, 75 seconds)**
- Each question: find ratio of components given mean.
- Target: 15 sec per question.
- Repair: Practice cross-difference; confirm ratio direction by verifying weighted average.

**Drill 5: Mixture Concentration (5 questions, 100 seconds)**
- Single replacement or mixing two solutions.
- Target: 20 sec per question.
- Repair: Convert percentages to actual amounts; track volume changes step by step.

### Repair Rules

- **Rule 1**: If you lose time on a problem, skip it and mark for review. Return only after completing all other questions.
- **Rule 2**: For any average problem, always confirm the count (n) after changes. A common mistake is using old n.
- **Rule 3**: In alligation, write the ratio exactly as asked (e.g., cheaper:dearer or dearer:cheaper). Read wording carefully.
- **Rule 4**: For average speed with equal distances, if formula 2ab/(a+b) is forgotten, derive using total distance/total time.
- **Rule 5**: In replacement problems, if volume changes (e.g., remove and replace), ensure you update both total volume and component amount.
- **Rule 6**: For class average updates, calculate net total change (sum of new - sum of leaving) and divide by new count.
- **Rule 7**: In mixed cost, always find average cost per unit before applying profit or loss percentage.

### Final 36-Second Strategy

- Start with alligation problems as they are shortest.
- Then attempt average speed and replacement questions.
- Leave complex mixture problems with multiple replacements for last.
- Use option elimination when possible: test values in weighted average formula.
- Never spend more than 36 seconds on a single question; flag and move on.

Final standard: Averages, mixtures, and alligation should become a fast classification chapter. For 50/50 Maths, every question must start with count, weight, distance/time, or concentration identification, then finish with a ratio-direction or count check before marking the answer.
<!-- SSC-FINAL-PRACTICE-QUEUE:START -->
## Final Practice Queue

1. Start one-by-one practice: [Averages, Mixtures, and Alligation practice](/exams/ssc-cgl/practice/averages-mixtures-alligation). Finish every question in this topic bank, not just the samples in the note.
2. Move to timed sets: [SSC CGL tests](/exams/ssc-cgl/tests?topic=averages-mixtures-alligation). Use topic drills first, then section mocks once accuracy is stable.
3. Repair every miss immediately: record the error label, redo 20 mixed questions from the same topic, then retest after 24 hours.
4. 200/200 rule: do not mark this topic exam-ready until correct answers come within 36 seconds and wrong answers are explained without looking at the solution.

<!-- SSC-FINAL-PRACTICE-QUEUE:END -->
