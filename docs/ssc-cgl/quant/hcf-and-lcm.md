---
title: HCF and LCM
description: Deep SSC CGL Tier-I Quant note for HCF, LCM, divisors, multiples, remainders, fractions, and 36-second execution.
tags: [ssc-cgl, quant, hcf-and-lcm, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---
## Concept Ladder

![HCF and LCM map](/img/ssc-cgl/hcf-and-lcm-map.svg)

**First principles**

- **Factor**: If `a` divides `b` completely, `a` is a factor (divisor) of `b`.
- **Multiple**: If `b` is divisible by `a`, then `b` is a multiple of `a`.
- **HCF (Highest Common Factor)**: The greatest integer that divides two or more given integers exactly. Also called GCD.
- **LCM (Least Common Multiple)**: The smallest positive integer that is exactly divisible by each of the given integers.
- **Coprime numbers**: Two numbers with HCF = 1.
- **Prime power method**: Write each number as product of prime powers; HCF = product of smallest powers of common primes; LCM = product of largest powers of all primes that appear in any number.

**Euclidean division algorithm** for large numbers:  
`HCF(a,b) = HCF(b, a mod b)`. Repeat until remainder zero; divisor is HCF.

**Fundamental product relation for two numbers**  
`Product of two numbers = HCF x LCM`  
This holds for exactly two numbers, not more. For three numbers, no such simple relation.

**Facts and lemmas**

- HCF of any number of coprime numbers = 1.
- HCF always <= smallest number; LCM always >= largest number.
- LCM is always a multiple of HCF.
- If two numbers are `HCF x a` and `HCF x b` with `a, b` coprime, then LCM = `HCF x a x b`.
- Number of pairs `(x, y)` with given product P and HCF H: express `P/H = a x b` with `a, b` coprime; number of such factorpairs of P/H gives the possible pairs.

**HCF and LCM of fractions**

- `HCF of fractions = HCF of numerators / LCM of denominators`
- `LCM of fractions = LCM of numerators / HCF of denominators`

**Common remainder / common deficit** (critical exam types)

- **Greatest number that divides p, q, r leaving same remainder**: find differences `(p - q)`, `(q - r)`, `(r - p)`, then required number = HCF of these differences.
- **Least number that when divided by p, q, r leaves same remainder k**:  
  required number = `LCM(p, q, r) + k`
- **Least number that when divided by p, q, r leaves remainders a, b, c such that (p - a) = (q - b) = (r - c) = d (common deficit)**:  
  required number = `LCM(p, q, r) - d`

**Applications**

- Tiling / rod cutting / largest possible measuring unit: always HCF.
- Bells tolling together / traffic lights / simultaneous events: LCM of intervals.
- Packing / container filling: HCFbased counting.

**36second execution integration**

- SSC CGL TierI gives 25 Quant questions in 15 minutes -> average 36 seconds.
- Direct singlestep HCF/LCM by prime factors must be done in 20-30 s.
- For larger numbers, use divisibility checks, option elimination, or Euclidean shortcut.
- Skip-and-return rule: If a problem requires listing many factors or checking multiple pairs, skip after 30 s; return at end after solving easier ones.

---

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|-----------------|--------|--------------|------|
| Straight HCF of given numbers | "HCF", "greatest common divisor", "maximum size" | Prime power / Euclidean algorithm; use divisibility rules to fastfind common factor | 20 s | Not taking smallest power of common primes only |
| Straight LCM | "LCM", "least common multiple", "smallest number divisible by" | Prime power: largest powers of all primes; or prime factorisation then LCM | 25 s | Skipping a prime that appears in only one number |
| HCF of fractions | "HCF of fractions" pattern | Formula: HCF(num)/LCM(den) | 30 s | Reversing numerator/denominator role |
| LCM of fractions | "LCM of fractions" | LCM(num)/HCF(den) | 30 s | Using HCF for denominator numerator mismatch |
| ProductHCFLCM relation with two numbers | Given product and HCF (or LCM), ask LCM (or HCF) | Use `Product = HCF x LCM` | 15 s | Applying to three numbers (fails) |
| Find numbers given product and HCF | "Two numbers have product P and HCF H" | Express numbers as Hxa, Hxb, a,b coprime; set Hxaxb = P; solve for a,b coprime | 45 s | Forgetting coprime condition, counting noncoprime factorpairs |
| Greatest number that divides with same remainder | "Greatest number which divides p,q,r leaving same remainder" | HCF(p-q, q-r, r-p) | 35 s | Subtracting remainders instead of differences |
| Least number with same remainder `k` | "Least number which when divided by p,q,r leaves remainder `k` in each case" | LCM(p,q,r) + k | 25 s | Using HCF instead of LCM |
| Least number with common deficit `d` | "Difference between divisor and remainder is same `d`" | LCM(p,q,r) - d | 30 s | Adding `d` instead of subtracting |
| Bells / signals / traffic lights | "Toll at intervals", "ring simultaneously again" | LCM of intervals | 30 s | Not converting to same unit; ignoring they start simultaneously |
| Largest tile / rod / packet | "Largest possible square tile", "maximum length" | HCF of dimensions | 25 s | Using LCM; or forgetting unit conversion |
| Numbersystem mixed with HCF/LCM | "Find the least multiple of x which is also divisible by y" | LCM or LCMbased search, use options | 35 s | Missing additional constraint like "exactly divisible" after adding k |
| Skipandreturn candidates | Complexity: many numbers, multiple remainders, or fractions with large denominators | Mark for later; attempt option testing first if possible | 5 s to decide | Wasting 60 s on a 2option elimination question in exam |

### Corpus Micro-Type Repair: Time Speed And Distance Link

The corpus label **time speed and distance** appears in HCF/LCM when the question is really about synchronized intervals, laps, meetings, or recurring events. Do not move it to the normal speed-distance formula page too quickly. First ask: "Are repeated cycles meeting together?" If yes, solve with LCM/HCF.

| Variant | Hidden HCF/LCM Logic | Method | Trap |
|---------|----------------------|--------|------|
| Bells, lights, alarms | Events repeat after fixed time intervals | LCM of intervals | Adding intervals |
| Circular track lap meeting | Runners repeat laps with different lap times | LCM of lap times for next start-point meeting | Using relative speed unnecessarily |
| Two people taking steps of different lengths | Common covered distance | LCM of step lengths | Using average step length |
| Buses/trains leaving at intervals | Simultaneous departure time | LCM of departure gaps | Treating as time-speed-distance speed formula |
| Work cycles or machine cycles | Same restart point after repeating cycles | LCM of cycle durations | Counting only first overlap |

Example: A and B run around a circular track and take 48 s and 60 s per lap. When will they meet again at the starting point? This is not distance/speed arithmetic in the usual sense. It is the LCM of 48 and 60, which is 240 s. If the question asks when they meet anywhere on the track, then use relative speed; if it asks "at the starting point again", use LCM.

---

## Speed Methods

**Recall tables - critical for instant answer recall**

| Situation | Response |
|-----------|----------|
| Two numbers given, need HCF | If numbers small: mental prime factors; if large: difference method or Euclidean |
| Need LCM of 12,15,20 | Prime factors: 2x3x5 = 60 |
| Product = 2160, HCF = 6 -> LCM? | 2160/6 = 360 |
| Two numbers have HCF = 12, product = 2160; possible pairs? | 2160/144 = 15; factor pairs of 15 coprime: (1,15),(3,5) -> numbers: (12x1,12x15)=(12,180), (36,60) |
| HCF of fractions 3/4, 9/8, 15/16 | HCF(num) = HCF(3,9,15)=3; LCM(den) = LCM(4,8,16)=16 -> 3/16 |
| LCM of fractions 2/5, 4/15, 8/25 | LCM(num) = LCM(2,4,8)=8; HCF(den)=HCF(5,15,25)=5 -> 8/5 |
| Common remainder problem: Numbers 130, 175, 305 leave same remainder; find greatest divisor | Differences: 175-130=45, 305-175=130, 305-130=175; HCF(45,130,175)=5 |
| Least number divisible by 16,18,24 leaving remainder 5 each case | LCM(16,18,24)=144; 144+5=149 |
| Deficit type: divisor 15 rem 9 (diff 6), divisor 18 rem 12 (diff 6), divisor 21 rem 15 (diff 6) | LCM(15,18,21)=630; 630-6=624 |

**Decision rules for method selection**

1. **Direct formula**: Use when pattern exactly matches standard types (plain HCF/LCM, product relation, fraction formula, simple remainder/deficit). 90% of exam questions.
2. **Option testing**: Best for "find the number" with remainders when LCM/HCF is large or when two options are easily eliminated by one divisor. Use divisibility checks on options.
3. **Approximation**: LCM for large numbers: roughly estimate from largest number and step up in multiples, then check divisibility. Not typical in CGL but helps if forgot formulas.
4. **Substitution**: In coprime pair questions, if options are simple, pick numbers satisfying HCF and LCM and test product/sum.
5. **Skip and return**: If a question involves threenumber HCF/LCM with large primes (like 17, 19) and no visible shortcut, skip. Return after completing others, then optiontest.

**36second attempt plan: 25 Quant in 15 minutes**

- Visual scan in first 10 s: if question is straightforward HCF/LCM, solve immediately.
- If it's a mixed type (e.g., find number with multiple divisors and a sum condition), check if you can write quick equations or optiontest. If yes, limit to 50 s. If no, mark and skip.
- Use mental math: prime factorisation for numbers up to 100 must be instant.
- All remainderdeficit questions: follow standard 3step algorithm; do not recalculate from scratch.
- At end of 15 min, return to skipped ones: pick the optiontest approach; if still unclear, eliminate impossible options using divisibility clues (e.g., must be odd/even, must end with certain digit).

**Stepbystep algorithms**

*Algorithm 1: HCF by prime factorization*
1. List prime factors of each number with exponents.
2. For each common prime, take the minimum exponent.
3. Multiply -> HCF.

*Algorithm 2: LCM by prime factorization*
1. List all distinct prime bases appearing anywhere.
2. For each base, take maximum exponent across numbers.
3. Multiply -> LCM.

*Algorithm 3: Greatest number leaving same remainder*
1. Arrange numbers in increasing: N1 < N2 < N3.
2. Compute D1 = N2-N1, D2 = N3-N2, D3 = N3-N1.
3. Required divisor = HCF(D1, D2, D3). (If only two numbers, just difference.)

*Algorithm 4: Least number with common remainder k*
1. Compute LCM of the divisors.
2. Answer = LCM + k.
3. (If remainder differs but deficit common: Answer = LCM - common deficit.)

*Algorithm 5: Option testing on remainder questions*
1. Let the divisor be d. For each option O, compute O mod d (in mind using divisibility rules).
2. Check if remainder matches condition for all d.
3. Stop at first option that satisfies all.

---

## Trap Table

| Trap | Trigger Wording | Wrong Move | Correct Move | Repair Drill |
|------|----------------|-------------|--------------|--------------|
| Confusing HCF with LCM | "greatest number that divides exactly" and "least number exactly divisible" swapped | Applying LCM for HCF or viceversa | Read divisibility direction: "divides" -> HCF, "divisible by" -> LCM | Drill 20 rapidrecognition sentences |
| Applying productHCFLCM to three numbers | Given three numbers with HCF and LCM asked | Using Product = HCF x LCM for three numbers | The relation is strictly for two numbers; for three, use prime factors | Write on flashcard: "Threenumber product != HCFxLCM" |
| Forgetting coprime condition when deriving numbers from product and HCF | "Product is 2160, HCF is 6, find the numbers" | Taking any two factors of (Product/HCF) even if they share a factor | The two numbers must be Hxa, Hxb with a,b coprime; a,b are coprime factors of P/H | Practice 10 pairs; always list factors and cross out those with common factor |
| Incorrect fraction HCF/LCM direction | "HCF of fractions a/b, c/d" | Using LCM of numerators / HCF of denominators | The standard formula: HCF(num)/LCM(den); LCM(num)/HCF(den) | Visualise: HCF of numbers -> num/den; for LCM, flip. Repeat orally 15 times. |
| Subtracting remainders instead of numbers in commonremainder HCF | "Find the greatest number which divides 70 and 125 leaving remainders 3 and 4 respectively" | Directly take HCF(70,125) | Correct: Subtract remainders to get exact multiples: 70-3=67, 125-4=121, then HCF(67,121) | Drill with "leaving remainders a and b" -> subtract first, then HCF. |
| Taking LCM instead of HCF for greatest divisor with different remainders | "Greatest number that divides 62, 78 leaving remainder 2 and 6" | LCM | The divisor leaves remainders, so divisor must be less than numbers; always HCF of reduced numbers | List three similar problems and circle "greatest" -> HCF. |
| Forgetting the deficit in commonremainderdeficit questions | "Find the least number which when divided by 15,18 leaves remainder 9,12 respectively" | LCM(15,18)=90, then add something wrongly | Notice deficit pattern: 15-9=6, 18-12=6 -> number = LCM-6=84 | Always compute (divisor - remainder) first. |
| Not checking if number after adding remainder is divisible | Least number divisible by p,q,r with remainder k -> LCM + k, but if LCM + k is not exactly divisible? | Blindly LCM + k | LCM + k is always correct (since LCM divisible, remainder k added gives exact remainder k). No extra check. | None; just trust formula. But many secondguess. Repair: solve 5 examples. |
| Using additive remainder when some divisors are coprime but actually need unit conversion | "Two bells ring at intervals of 18 min and 24 min. They rang together at 10 AM. When will they ring together again?" | Finding LCM in minutes and adding, but forgetting to convert to time format | LCM(18,24)=72 min; 10 AM + 72 min = 11:12 AM. Always present answer in hours:minutes. | Drill 5 bellproblems with time format. |
| Using HCF for largest size in 3D objects ignoring unit | "Find the greatest length of a measuring rod that can measure 3 m 15 cm, 4 m 5 cm, and 6 m exactly." | Convert to inconsistent units, get wrong numbers | Convert all to same unit: 315 cm, 405 cm, 600 cm; then HCF = 15 cm. | Every measurement question: first convert to same unit. |
| Misapplying coprime concept when HCF=1 but numbers are not necessarily prime | "HCF of two composite numbers is 1, then they are coprime" | Thinking they must be primes | They are coprime, but each could be composite, e.g., 4 and 9. This distinction appears in true/false. | Review definition: coprime if only common factor is 1. Nothing about being prime. |
| Missing that LCM is always multiple of HCF | Given two no. with LCM=144 and HCF=12, some options like 24,36 | Assuming numbers can be any, but they must be multiples of HCF | If numbers are 12a, 12b, then LCM = 12xaxb; options must be of this form. | Solve 2 such problems and verify numbers. |
| Forgetting that HCF of coprime numbers is 1, so product = LCM | "Two coprime numbers have product 168, find LCM" | Calculating LCM via prime factors separately | Since numbers are coprime, LCM = product = 168 | Drill: if coprime, LCM = product. |
| Misreading "least number divisible by" as "greatest number dividing" | Quick glance of a problem with "least" and "divisible by" vs "greatest" and "divides" | Brain autocorrects. | Underline directional words: "divisible by" (multiple) -> LCM. "divides" (factor) -> HCF. | Practise 10 oneliners from PYQs. |
| In fraction questions, reducing fractions before applying formula incorrectly | HCF of fractions 3/4, 6/8 simplified? | Simplifying 6/8 to 3/4, then treating as common, might lose correct HCF/LCM | Use original fractional form, or simplify only if it helps; but formula works on any representation. | Use both ways and compare answer to build trust. |

---

## Flowchart

```mermaid
flowchart TD
    A[Start HCF/LCM problem] --> B{Keyword / Pattern}
    B -->|"HCF, GCD, greatest divisor, maximum size"| C[HCF needed]
    B -->|"LCM, least multiple, smallest number divisible"| D[LCM needed]
    C --> C1{Remainders given?}
    C1 -->|No| C2[Plain HCF via prime factors / Euclidean]
    C1 -->|Yes, same remainder| C3[Subtract remainders from numbers, then HCF]
    C1 -->|Different remainders, but common deficit?| C4[Subtract remainder from divisor to get deficit, then LCM minus deficit]
    C3 --> C5[HCF of reduced numbers]
    D --> D1{Fraction form?}
    D1 -->|Yes| D2[LCM(num)/HCF(den) or HCF(num)/LCM(den)]
    D1 -->|No| D3{Remainder condition?}
    D3 -->|Exact multiple| D4[LCM of divisors]
    D3 -->|Same remainder k| D5[LCM + k]
    D3 -->|Deficit d| D6[LCM - d]
    D2 --> E[Answer]
    C2 --> E
    C5 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    E --> F{Check with options if any}
    F -->|Option matched| G[Final answer]
    F -->|Not matched| H[Recheck arithmetic]
    H --> E
```

---

## Solved Examples

**Example 1**  
Find HCF and LCM of 144 and 180.

- *Solution*: Prime factors: 144 = 2 x 3, 180 = 2 x 3 x 5.  
  HCF = 2 x 3 = 4 x 9 = 36.  
  LCM = 2 x 3 x 5 = 16 x 9 x 5 = 720.
- *Optionstyle*: a) 12, 720 b) 36, 720 c) 36, 1440 d) 72, 360 -> Answer b.

**Example 2**  
The product of two numbers is 2535 and their HCF is 3. Find their LCM.

- *Solution*: LCM = Product / HCF = 2535 / 3 = 845.
- *Answer*: 845.

**Example 3**  
Two numbers have HCF = 12 and product = 2160. Find the possible pairs.

- *Solution*: Let numbers be 12a, 12b with a,b coprime.  
  12a x 12b = 2160 -> 144ab = 2160 -> ab = 15.  
  Coprime factorpairs of 15: (1,15) and (3,5).  
  Pairs: (12x1=12, 12x15=180) and (12x3=36, 12x5=60).
- *Answer*: (12,180) and (36,60).

**Example 4**  
Find the HCF of fractions 3/4, 9/8, 15/16.

- *Solution*: HCF of numerators = HCF(3,9,15)=3; LCM of denominators = LCM(4,8,16)=16.  
  HCF of fractions = 3/16.
- *Answer*: 3/16.

**Example 5**  
Find the LCM of fractions 2/5, 4/15, 8/25.

- *Solution*: LCM of numerators = LCM(2,4,8)=8; HCF of denominators = HCF(5,15,25)=5.  
  LCM = 8/5.
- *Answer*: 8/5.

**Example 6**  
Find the greatest number that divides 62, 78, and 109 leaving remainders 2, 6, and 7 respectively.

- *Solution*: Subtract remainders to get exact multiples: 62-2=60, 78-6=72, 109-7=102.  
  Required number = HCF(60,72,102).  
  Prime factors: 60=2x3x5, 72=2x3, 102=2x3x17. HCF = 2x3 = 6.
- *Answer*: 6.

**Example 7**  
Find the least number which when divided by 16, 18, 20 leaves a remainder 7 in each case.

- *Solution*: LCM(16,18,20) = 720. Add remainder 7 -> 727.
- *Answer*: 727.

**Example 8**  
Find the least number which when divided by 15, 20, 25 leaves remainders 9, 14, 19 respectively.

- *Solution*: Observe deficit pattern: 15-9=6, 20-14=6, 25-19=6.  
  LCM(15,20,25) = 300. Required number = 300 - 6 = 294.
- *Answer*: 294.

**Example 9**  
Three bells toll at intervals of 12 min, 18 min, and 30 min. If they all toll together at 11:00 AM, when will they next toll together?

- *Solution*: LCM(12,18,30) = 180 min = 3 hours. Next together at 11:00 AM + 3 h = 2:00 PM.
- *Answer*: 2:00 PM.

**Example 10**  
A rectangular courtyard measuring 12 m x 10 m is to be paved with square tiles of the largest possible size. Find the size of each tile and the number of tiles required.

- *Solution*: Convert to cm: 1200 cm x 1000 cm. Side of largest square tile = HCF(1200,1000) = 200 cm = 2 m.  
  Number of tiles = (1200/200)x(1000/200) = 6x5 = 30.
- *Answer*: 2 m side, 30 tiles.

**Example 11**  
Find the HCF of 4052 and 12576 using Euclidean algorithm.

- *Solution*: 12576  4052: 12576 = 4052x3 + 420.  
  4052  420: 4052 = 420x9 + 272.  
  420  272: 420 = 272x1 + 148.  
  272  148: 272 = 148x1 + 124.  
  148  124: 148 = 124x1 + 24.  
  124  24: 124 = 24x5 + 4.  
  24  4: 24 = 4x6 + 0. So HCF = 4.
- *Answer*: 4.

**Example 12**  
The LCM of two numbers is 168 and their HCF is 4. If one number is 28, find the other.

- *Solution*: Let other be x. Product = LCMxHCF = 168x4 = 672. So 28 x x = 672 -> x = 672/28 = 24.
- *Answer*: 24.

---

**Example 13**  
Find the largest number which divides 122 and 150 leaving remainders 2 and 6 respectively.  
Options: (a) 12 (b) 18 (c) 24 (d) 36  
**Solution**: Subtract the remainders first. 122 - 2 = 120 and 150 - 6 = 144. Required number = HCF(120, 144) = 24. **Answer: (c) 24**

**Example 14**  
Find the least 4-digit number divisible by 18, 24, and 30.  
Options: (a) 1020 (b) 1080 (c) 1140 (d) 1200  
**Solution**: LCM(18, 24, 30) = 360. The least 4-digit multiple of 360 is 1080. **Answer: (b) 1080**

**Example 15**  
The HCF of two numbers is 16 and their LCM is 240. If one number is 48, find the other.  
Options: (a) 64 (b) 72 (c) 80 (d) 96  
**Solution**: Product of two numbers = HCF x LCM = 16 x 240. Other number = 16 x 240 / 48 = 80. **Answer: (c) 80**

**Example 16**  
Three bells ring at intervals of 8, 12, and 20 minutes. If they ring together at 10:00 a.m., when will they next ring together?  
Options: (a) 10:40 a.m. (b) 11:00 a.m. (c) 11:20 a.m. (d) 12:00 noon  
**Solution**: The next simultaneous ringing time is after LCM(8, 12, 20) minutes. LCM = 120 minutes. 10:00 a.m. + 120 minutes = 12:00 noon. **Answer: (d) 12:00 noon**

**Example 17**  
Find the HCF of 5/12, 25/36, and 35/48.  
Options: (a) 5/144 (b) 5/48 (c) 35/144 (d) 25/48  
**Solution**: HCF of numerators 5, 25, 35 is 5. LCM of denominators 12, 36, 48 is 144. HCF = 5/144. **Answer: (a) 5/144**

**Example 18**  
Find the LCM of 4/9, 8/27, and 10/81.  
Options: (a) 40/9 (b) 20/3 (c) 40/81 (d) 80/9  
**Solution**: LCM of numerators 4, 8, 10 is 40. HCF of denominators 9, 27, 81 is 9. LCM = 40/9. **Answer: (a) 40/9**

**Example 19**  
A rectangular floor is 840 cm long and 540 cm wide. Find the largest square tile size that can cover it exactly.  
Options: (a) 30 cm (b) 45 cm (c) 60 cm (d) 90 cm  
**Solution**: Largest square tile side = HCF(840, 540). HCF = 60 cm. **Answer: (c) 60 cm**

**Example 20**  
Find the greatest 3-digit number exactly divisible by 12, 18, and 27.  
Options: (a) 864 (b) 900 (c) 936 (d) 972  
**Solution**: LCM(12, 18, 27) = 108. Greatest 3-digit multiple of 108 is 108 x 9 = 972. **Answer: (d) 972**

## PYQ Mapping

**Highfrequency PYQ types and practice routes**

The bookPYQ corpus (6700+ Quant MCQs) reveals dominant question types for HCF/LCM:

1. **Straight HCF/LCM of integers** (~=30% of topic PYQs) - Master prime factorisation speed.  
   Practice: /exams/ssc-cgl/topics/hcf-and-lcm

2. **ProductHCFLCM relation and pair derivation** (~=15%) - Focus on coprime condition.  
   Practice: /exams/ssc-cgl/topics/number-system (numbersystem section contains coprime pair problems)

3. **HCF/LCM of fractions** (~=10%) - Formula application; mix with decimal fractions sometimes.  
   Use the fraction page in HCFLCM topic.

4. **Common remainder / common deficit** (~=20%) - Recognize pattern immediately. Both greatest divisor and least number types appear regularly.  
   Drill with mixed options to avoid trap of remainder vs deficit.

5. **Application problems (bells, tiling, rods, packets)** (~=15%) - Convert units first; use HCF for maximum size, LCM for simultaneous events.  
   Practice with reallife measurement variants.

6. **Mixed numbersystemintegrated problems** (~=10%) - e.g., find least number divisible by 12,15,20 and also a perfect square. Combine LCM with prime square condition.  
   Route via: /exams/ssc-cgl/topics/number-system for deep divisibility and perfect square/cube logic.

**Real PYQ frequency from corpus**  
The total Quant question count across all sources is 6700, with numbersystem tagged at 764. HCF/LCM specific chunk is embedded within numbersystem set; the dense areas (pages p0021p0040, p0041p0060) frequently test remainderbased and fraction HCF/LCM. The note covers all those patterns.

**Recommended practice route**  
Start with topicspecific sprint: /exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint  
Then go to HCF/LCM dedicate: /exams/ssc-cgl/topics/hcf-and-lcm  
Finally integrate with numbersystem module: /exams/ssc-cgl/topics/number-system

---

## 200/200 Drill

**Timed microdrills (must be solved with 36second target each)**

*Drill 1: Recognition speed* (10 questions, 6 minutes)  
1. Find HCF(84,120).  
2. LCM(15,18,24).  
3. Product = 1080, HCF=6 -> LCM?  
4. Numbers with HCF=8, product=384 -> possible pair(s)?  
5. HCF of fractions 4/9, 2/3, 8/15.  
6. LCM of fractions 3/7, 5/14, 10/21.  
7. Greatest no. that divides 98, 140 leaving remainder 2 and 5.  
8. Least no. divisible by 8,12,15 with remainder 3.  
9. Least no. divided by 14,21,28 leaving remainders 5,12,19.  
10. Two bells at 18 and 24 min; after how long will they ring together after ringing at 12 noon?

**Answer key and repair rules**  
After selftest, mark incorrectly:

- If you confused HCF/LCM (Q1, Q2): reread recognition cues; underline divisor/multiple.
- If productrelation error (Q3, Q4): write product relation and coprime condition in one place; drill 10 variants from PYQ.
- If fraction formula reversed (Q5, Q6): recite mnemonic "HCF fraction = (top HCF)/(bottom LCM)".
- If remaindersubtract off (Q7): remember to reduce numbers before HCF.
- If common deficit miscomputed (Q9): always check (divisor - remainder) first; if equal across all, use LCM - deficit.
- If timing exceeded 36 s: train mental prime factorisation for numbers up to 200.

*Drill 2: Trapbuster* (15 minutes, 15 questions - mixed types)  
Use the Trap Table as a checklist while solving. For each error, note trap number and resolve a fresh PYQ of same trap category from /exams/ssc-cgl/topics/hcf-and-lcm.

**Repair rules for 200/200 readiness**

- **Zerotolerance for sign/direction errors**: In every practice session, write the target word (HCF/LCM) and associated keyword ("divides"/"multiple") on top of rough sheet.
- **Time leak detection**: If a direct HCF/LCM question takes over 45 seconds, your prime factorisation is slow; practice 50 numbers a day using prime factor decomposition.
- **Optiontesting muscle**: For complex remainder questions, practice checking options by divisibility when numbers > 100. Use the rule: remainder = option mod divisor; do mental modulo.
- **Skipandreturn discipline**: In fulllength sprint simulation (`/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint`), mark any question that doesn't yield to first 30 s attempt; return with option elimination. Count how many you recovered; aim to recover 90%.

**Final 200/200 verification**  
When you can solve any HCF/LCM problem from the PYQ corpus within 36 seconds with 100% accuracy on first attempt, the topic is sealed.
<!-- SSC-FINAL-PRACTICE-QUEUE:START -->
## Final Practice Queue

1. Start one-by-one practice: [HCF and LCM practice](/exams/ssc-cgl/practice/hcf-and-lcm). Finish every question in this topic bank, not just the samples in the note.
2. Move to timed sets: [SSC CGL tests](/exams/ssc-cgl/tests?topic=hcf-and-lcm). Use topic drills first, then section mocks once accuracy is stable.
3. Repair every miss immediately: record the error label, redo 20 mixed questions from the same topic, then retest after 24 hours.
4. 200/200 rule: do not mark this topic exam-ready until correct answers come within 36 seconds and wrong answers are explained without looking at the solution.

<!-- SSC-FINAL-PRACTICE-QUEUE:END -->
