---
title: Number System
description: Deep SSC CGL Tier-I Quant note for number system, divisibility, HCF-LCM, and remainders.
tags: [ssc-cgl, quant, number-system, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---
## Concept Ladder

**36-second Quant scoring bar**  
Number System questions must usually be solved inside 36 seconds. Use 5 seconds to classify the type, 20 seconds for divisibility/factor/remainder work, and 5 seconds for option elimination. If a remainder or factorization path is still unclear after 12 seconds, switch to option testing or mark it for return.

![Number system 36-second decision map](/img/ssc-cgl/number-system-map.svg)

### Corpus Pressure

The uploaded book-PYQ corpus marks `number-system` as a 200/200 dominant-repeat Quant topic with 764 promoted questions. This is the largest pure arithmetic-foundation bucket after the mixed arithmetic chapters, and it feeds almost every other Quant area: percentages, ratio, profit-loss, time-work, algebra, simplification, DI, and mensuration arithmetic.

| Corpus signal | What it demands | 36-second implication |
|---:|---|---|
| 764 promoted questions | Divisibility, HCF-LCM, remainders, unit digit, factors, surds, indices, and decimals | This cannot stay as a formula-reading chapter; it needs daily speed drilling |
| 177 direct Number System rows | Core theory is directly tested | Definitions and divisibility rules must be automatic |
| Multiple source page clusters | Same concept appears in different wordings | Train recognition, not one memorized question format |
| Indirect Quant dependency | Other chapters use LCM, factorization, fraction reduction, and cyclicity | Number System weakness leaks marks across the Maths section |
| High arithmetic trap rate | Wrong remainder, wrong cycle, HCF-LCM swap, denominator mistake | Checked work protects against fast negative marks |

For 50/50 in Quant, Number System should become a no-hesitation chapter. The goal is not simply to know the rules; the goal is to identify the rule in 5 seconds, execute it cleanly, and know when option testing is faster than full calculation.

### First 5-Second Classification

| Wording seen | Bucket | First move |
|---|---|---|
| "divisible by", "least/greatest number divisible" | Divisibility / LCM | Find rule or LCM before arithmetic |
| "remainder when", "leaves remainder" | Remainder | Reduce number/base before expanding |
| "unit digit" | Cyclicity | Use last digit only and cycle length |
| "HCF", "greatest number that divides" | HCF | Prime powers minimum or Euclid |
| "LCM", "least number divisible by" | LCM | Prime powers maximum |
| "number of factors/divisors" | Factor count | Prime factorize, then multiply exponent+1 |
| "trailing zeroes" | Factorial exponent | Count powers of 5 |
| "recurring decimal" | Decimal-to-fraction | Separate non-recurring and recurring parts |
| "rationalize", "surd", "index" | Surds/indices | Simplify radicals, then use exponent law |

**Rung 1: Place Value & Classification**  
Every digit has a place value (units, tens, hundreds...) and a face value. SSC asks classification: natural (N), whole (W), integers (Z), rational (Q), irrational (I). Key: rational numbers are p/q form; irrationals are non-repeating non-terminating decimals such as sqrt(2), sqrt(3), and pi. Also prime, composite, co-prime (HCF=1), twin primes (3,5; 11,13).

**Rung 2: Divisibility Rules (2 to 19)**  
- 2: last digit even.  
- 3: sum of digits divisible by 3.  
- 4: last two digits divisible by 4.  
- 5: last digit 0 or 5.  
- 6: divisible by 2 and 3.  
- 7: double last digit, subtract from rest; repeat if needed. (Pattern: 7, 14, 21...)  
- 8: last three digits divisible by 8.  
- 9: sum of digits divisible by 9.  
- 10: last digit 0.  
- 11: (sum of odd place digits) - (sum of even place digits) divisible by 11 (0, 11, 22...).  
- 13: multiply last digit by 4, add to rest; repeat.  
- 17: multiply last digit by 5, subtract from rest; repeat.  
- 19: multiply last digit by 2, add to rest; repeat.

**Rung 3: Prime Factorization & Exponent Counting**  
To find number of factors, sum of factors, product of factors: if N = a^p x b^q x c^r, then number of factors = (p+1)(q+1)(r+1). Sum of factors = (a^(p+1)-1)/(a-1) x ... . Number of even/odd factors: separate factor 2.

**Rung 4: HCF & LCM**  
- HCF (GCD): highest common factor. For two numbers, product = HCF x LCM.  
- LCM: least common multiple. Prime factorization, then pick highest powers.  
- For fractions: HCF = HCF of numerators / LCM of denominators; LCM = LCM of numerators / HCF of denominators.  
- Important: HCF of (a,b) divides (a-b) always. LCM of co-prime numbers = product.

**Rung 5: Remainders & Cyclicity**  
- Basic: dividend = divisor x quotient + remainder (0 <= r < divisor).  
- Negative remainders: in mod 7, -1 is the same as 6. Useful for large powers.  
- Cyclicity of unit digit: cycles of 1:1, 2:2,4,8,6, 3:3,9,7,1, 4:4,6, 5:5, 6:6, 7:7,9,3,1, 8:8,4,2,6, 9:9,1. Pattern length 1,2, or 4.  
- Remainder of a^b when divided by n: use Euler's theorem or repeated squaring.

**Rung 6: Surds, Indices, Rationalization**  
- Surds: sqrt(a) where a is a non-perfect square. Rationalizing denominator: multiply numerator and denominator by the conjugate.  
- Indices: a^m x a^n = a^(m+n), (a^m)^n = a^(mn), a^(1/n) = nth root of a.  
- Comparison: square both sides for surds, or use cross-multiplication.

**Rung 7: Fractions & Recurring Decimals**  
- Terminating: denominator only 2 and 5 factors.  
- Recurring: non-terminating repeating. Conversion: 0.abc = (abc)/999 (if 3-digit repeat).  
- Compare fractions: cross multiply or use decimal approximation.

**Exam-Level Integration**  
Number system is the bedrock: every simplification, percentage, ratio, profit-loss, time-work question uses these concepts. In SSC, 3-4 direct questions appear, plus many indirect. Speed requires instant divisibility checks and option elimination. A 200/200 aspirant memorizes divisibility rules, cyclicity tables, and factorization tricks.

---

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|-----------------|--------|--------------|------|
| Divisibility / Remainder | "divisible by 7", "remainder when divided by 9" | Apply rule directly; for remainder, use sum for 9/3, cyclic for power | < 10 sec | For 7/13/17, forgetting to repeat rule; for cycles, wrong period |
| HCF / LCM | "highest common factor", "least common multiple", "HCF of fractions" | Prime factor or division method; for fractions use formula | < 15 sec | Confusing HCF with LCM; forgetting LCM of fractions = LCM/HCF formula |
| Unit Digit | "unit digit of 2^345" | Cyclicity: find exponent mod cycle length, pick result | < 5 sec | Assuming all cycles length 4; 0,1,5,6 have fixed unit |
| Number of Factors | "number of divisors of 360" | Prime factorize, add 1 to exponents, multiply | < 10 sec | Forgetting to include 1 and the number itself; only positive factors |
| Simplification (Surds/Indices) | "simplify 12 + 27", "rationalize 1/(3+2)" | Factor perfect squares; multiply by conjugate | < 20 sec | Not simplifying fully; conjugate sign mistake (use opposite sign) |
| Largest/Smallest Number | "greatest 3-digit number divisible by 7" | Divide maximum range by divisor, subtract remainder; or test largest | < 15 sec | For least number: add remainder after division; for condition like "divisible by 3 and 5" use LCM |
| Recurring Decimal | "convert 0.142857 to fraction" | Formula: repeating part / (10^k -1), k=number of repeating digits | < 10 sec | Non-repeating part before cycle; for mixed recurrence use separation |
| Comparison of Fractions | "which is larger: 7/13 or 9/17?" | Cross-multiply 7x17=119, 9x13=117, 7/13 > 9/17 | < 5 sec | Only when denominators same; cross-multiplication always works for positive fractions |
| Prime/Composite Identification | "how many prime numbers between 50 and 60?" | Check divisibility by primes up to n (sieve method) | < 10 sec | Forgetting 2 is prime; considering 1 as prime (it is not) |
| Power/Exponent Remainder | "remainder of 3^100 when divided by 7" | Use cyclicity of remainders or Euler's theorem ((7)=6, 100 mod 6=4, remainder=3^4 mod7=4) | < 20 sec | Misidentifying cycle; direct large power calculation |

---

## Speed Methods

### Recall Tables
- **Divisibility Summary (2-19):**  
  - 7: double last, subtract from rest.  
  - 13: multiply last by 4, add to rest.  
  - 17: multiply last by 5, subtract from rest.  
  - 19: multiply last by 2, add to rest.  
- **Cyclicity Table:**  
  - Digit 0 -> always 0  
  - 1 -> always 1  
  - 2 -> 2,4,8,6 (cycle 4)  
  - 3 -> 3,9,7,1 (cycle 4)  
  - 4 -> 4,6 (cycle 2)  
  - 5 -> always 5  
  - 6 -> always 6  
  - 7 -> 7,9,3,1 (cycle 4)  
  - 8 -> 8,4,2,6 (cycle 4)  
  - 9 -> 9,1 (cycle 2)  
- **Factor Count Shortcut:** For N = 2^a x 3^b x 5^c ... number of factors = (a+1)(b+1)(c+1)... Sum factors = product of (p^(e+1)-1)/(p-1).

### Decision Rules
- **Remainder of sum/product:** (a+b) mod m = (a mod m + b mod m) mod m; similar for product.  
- **LCM of numbers when one divides the other:** LCM = larger number.  
- **HCF of numbers when one divides the other:** HCF = smaller number.  
- **To find smallest number divisible by given numbers:** LCM them.  
- **To find greatest number leaving same remainder on dividing given numbers:** Find HCF of (a-b), (b-c), (c-a) etc.

### Step-by-Step Algorithms
1. **Unit Digit of a^b:**  
   - Find cycle length of base's unit digit (1,5,6,0 -> fixed; 4,9 -> 2; 2,3,7,8 -> 4).  
   - Reduce exponent modulo cycle length (if remainder 0, use last element of cycle).  
   - Return corresponding digit.

2. **Number of Factors:**  
   - Factorize completely into primes.  
   - Add 1 to each exponent.  
   - Multiply all (exponent+1)s.

3. **HCF by Division Method (Euclid):**  
   - Divide larger by smaller, get remainder.  
   - Replace larger with smaller, smaller with remainder.  
   - Repeat until remainder 0; last divisor is HCF.

4. **LCM by Division Method:**  
   - Write numbers in a row.  
   - Divide by smallest prime that divides at least two numbers.  
   - Bring down quotients and undivided numbers.  
   - Repeat until row has only co-prime numbers.  
   - Multiply all divisors and remaining numbers.

5. **Recurring Decimal to Fraction:**  
   - If pure recurring: 0.abc = abc/999 (as many 9's as repeating digits).  
   - If mixed: 0.x...yz = (non-repeating + repeating part - non-repeating) / (10^k - 10^q) where k = total decimal digits, q = non-repeating digits.

---

## Trap Table

| Trap | Trigger Wording | Wrong Move | Correct Move | Repair Drill |
|------|-----------------|------------|--------------|--------------|
| 0 as remainder | "divisible by 7" | Check only last digit | Use full divisibility rule; for 13/17/19 also | Practice 7,13,17,19 rules daily |
| Negative remainder | "remainder when 2^100 divided by 7" | Compute 2^100 directly | Use cycle of remainders: 2^3=81 mod7, 100=3*33+1, remainder 2 | Memorize small cycles |
| Zero-power ambiguity | "unit digit of 0^n" | Ignore the exponent condition | For positive n, the unit digit is 0; do not invent a value for non-standard wording | Check exponent first |
| HCF vs LCM | "greatest number that divides both" | Find LCM | Must be HCF | Write "HCF" on scratch |
| Fraction HCF/LCM | "HCF of 2/3 and 5/6" | Take HCF of numerators, LCM of denominators | Use formula: HCF = HCF(num) / LCM(den) | Write formula in margin |
| Forgetting to reduce fraction | "simplify 8/12" | Leave as 8/12 | Reduce to 2/3 | Always check common factor |
| Conjugate for rationalization | "rationalize 1/(3-2)" | Multiply by same denominator | Multiply by 3+2 | Memorize: (a-b)(a+b)=a-b |
| Cyclic for 4 and 9 | "unit digit of 9^23" | Use cycle 4 for every digit | Use the cycle 2 pattern: 9,1; 23 mod 2=1 => 9 | Make separate table for 4,9 |
| Recurring with prefix | "0.1666..." | Use 16/999 | 1/6 because 0.1+0.0666... = 1/10 + 2/30 = 1/6 | Split non-repeating part |
| Negative base even exponent | "(-3)^4" | Treat as -(3^4) | (-3)^4 = +81 | Parentheses matter |
| LCM of three numbers with one factor | "LCM of 4,6,12" | Find LCM of 4 and 6 =12, then 12 and 12 =12 | Already correct if done sequentially | Check all pairs |
| Number of factors including 1 and itself | "find number of factors of 6" | Count: 2,3 -> 2 | Include 1,6 -> 4 factors | Use formula (1+1)(1+1)=4 |
| Zero in remainder problems | "number leaves remainder 5 when divided by 8" | Assume number is 5 | Number could be 5,13,21,... | Use N = 8k+5 |
| Comparison of negative fractions | "-3/4 vs -2/3" | Say -3/4 is larger | -2/3 is larger (since -0.667 > -0.75) | Remember: more negative is smaller |
| Divisibility by 7 with multi-digit | "check 1234 divisible by 7" | Do only one step | Must repeat: 123-2*4=115, 11-2*5=1, not divisible | Practice 3-step process |
| Base unit digit 0 with positive exponent | "unit digit of 10^25" | Treat it as a four-cycle digit | Unit digit remains 0 for every positive exponent | Check base unit digit first |
| Forgetting to reduce before LCM division method | "LCM of 12,18,20" | Start dividing by 2 (all divisible) | Divide only when at least two numbers divisible | Always check all numbers |
| Treating all remainder cycles length 4 | "unit digit of 2^2" | Force a memorized cycle without checking the exponent | 2^2=4; for very small exponents, direct computation is safer | For small exponents, compute directly |
| Misapplying Euler's theorem without co-prime | "remainder of 2^100 mod 4" | Use phi(4)=2, 100 mod 2=0, then claim 2^0=1 | 2 and 4 are not co-prime, so use pattern: 2^1=2, 2^2=0, 2^3=0... remainder=0 | Check co-prime condition |
| Confusing "divisible by 2 and 3" with "either" | "number divisible by 2 or 3" | Count numbers divisible by 6 | Use inclusion-exclusion: AB = A+B - AB | Memo: "and" = intersection |
| Sign error in rationalization | "rationalize 1/(3+2)" | Multiply numerator and denominator by 3+2 | Multiply by 3-2 | Remember conjugate a-b for a+b |
| Recurring decimal with 9 repeating | "0.9" | 9/99 = 1/11 | 9/9 = 1 | Pure recurring with one digit: 0.x = x/9 |
| Forgetting to simplify fraction after conversion | "0.7555..." | 75/99 = 25/33 | Mixed recurring conversion gives (75-7)/90 = 68/90 = 34/45 | Separate non-repeating part |

---

## Flowchart

```mermaid
graph TD
    A[Given Number System Problem] --> B{Type?}
    B --> C[Divisibility/Remainder]
    B --> D[Unit Digit]
    B --> E[HCF/LCM]
    B --> F[Simplification]
    B --> G[Factor/Sum of Factors]
    C --> C1{Divisor?}
    C1 -->|2,3,4,5,6,8,9,10,11| C2[Apply direct rule]
    C1 -->|7,13,17,19| C3[Use special algorithm]
    C1 -->|Other| C4[Divide and check]
    C2 --> C5[Answer]
    C3 --> C5
    D --> D1[Identify base unit digit]
    D1 --> D2[Find cycle length]
    D2 --> D3[Exponent mod cycle]
    D3 --> D4[Return digit]
    E --> E1{Which one?}
    E1 -->|HCF| E2[Prime factor or Euclid]
    E1 -->|LCM| E3[Prime factor highest powers or Division method]
    E2 --> E5[Answer]
    E3 --> E5
    F --> F1{Form?}
    F1 -->|Surds| F2[Simplify radicals, rationalize if needed]
    F1 -->|Indices| F3[Apply laws of exponents]
    F2 --> F5[Simplified expression]
    F3 --> F5
    G --> G1[Prime factorize N]
    G1 --> G2[Add 1 to exponents]
    G2 --> G3[Multiply (e+1)s]
    G3 --> G4[Answer: number of factors]
```

---

## Solved Examples

**Example 1 (Divisibility):** Find the remainder when 3456 is divided by 7.  
Options: A) 1  B) 2  C) 3  D) 5  
Explanation: Divide directly for the remainder: 7 x 493 = 3451, so 3456 - 3451 = 5. The divisibility-rule reduction only tells whether a number is divisible by 7; for exact remainder, direct nearest-multiple checking is faster here.  
Answer: D) 5

**Example 2 (Unit Digit):** What is the unit digit of 7^2023?  
Options: A) 1  B) 3  C) 7  D) 9  
Explanation: Cycle of 7: 7,9,3,1 (length 4). 2023 divided by 4 leaves remainder 3 (since 4x505=2020). Third element in cycle = 3.  
Answer: B) 3

**Example 3 (HCF):** Find the HCF of 144, 180, and 192.  
Options: A) 12  B) 24  C) 36  D) 48  
Explanation: Prime factor: 144=2^4x3^2, 180=2^2x3^2x5, 192=2^6x3. HCF = product of smallest powers: 2^2 x 3^1 = 4x3=12.  
Answer: A) 12

**Example 4 (LCM):** The LCM of two numbers is 840 and their HCF is 28. If one number is 168, find the other.  
Options: A) 70  B) 140  C) 210  D) 280  
Explanation: For two numbers, product = HCF x LCM. So other number = (28x840)/168 = (28x840)/168 = Simplify: 840/168=5, 28x5=140.  
Answer: B) 140

**Example 5 (Number of Factors):** How many factors does 1080 have?  
Options: A) 24  B) 32  C) 36  D) 40  
Explanation: Prime factor: 1080 = 108x10 = (2^2x3^3)x(2x5) = 2^3 x 3^3 x 5^1. Number of factors = (3+1)(3+1)(1+1)=4x4x2=32.  
Answer: B) 32

**Example 6 (Remainder Cycle):** Find the remainder when 2^2022 is divided by 5.  
Options: A) 1  B) 2  C) 3  D) 4  
Explanation: Unit digit cycle of 2: 2,4,8,6 (length 4). 2022 divided by 4 leaves remainder 2. Second digit in cycle = 4, so remainder when divided by 5 is 4.  
Answer: D) 4

**Example 7 (Simplification - Surds):** Simplify: (8sqrt(15))/(2sqrt(3)).  
Options: A) 2sqrt(5)  B) 4sqrt(5)  C) 8sqrt(5)  D) 4sqrt(3)  
Explanation: (8/2) x sqrt(15/3) = 4sqrt(5).  
Answer: B) 4sqrt(5)

**Example 8 (Rationalization):** If a = 1/(sqrt(3)+sqrt(2)), then a = ?  
Options: A) sqrt(3)-sqrt(2)  B) sqrt(3)+sqrt(2)  C) sqrt(2)-sqrt(3)  D) 1  
Explanation: Multiply numerator and denominator by the conjugate sqrt(3)-sqrt(2). Denominator becomes 3-2=1, so a = sqrt(3)-sqrt(2).  
Answer: A) sqrt(3)-sqrt(2)

**Example 9 (Recurring Decimal):** Express 0.12333... as a fraction.  
Options: A) 37/300  B) 111/900  C) 41/330  D) 123/1000  
Explanation: 0.12333... = 0.12 + 0.00333... = 12/100 + (3/900) = 12/100 + 1/300 = (36+1)/300 = 37/300.  
Answer: A) 37/300

**Example 10 (Least Number Condition):** Find the smallest 4-digit number which is divisible by 6, 8, and 12.  
Options: A) 1008  B) 1020  C) 1032  D) 1044  
Explanation: LCM of 6,8,12 = 24. Smallest 4-digit number = 1000. 1000 divided by 24 leaves remainder 16. Add 24-16 = 8. Smallest valid number = 1008.  
Answer: A) 1008

**Example 11 (HCF of Fractions):** Find the HCF of 2/3, 4/9, 8/15.  
Options: A) 2/45  B) 1/45  C) 4/45  D) 8/45  
Explanation: HCF of fractions = HCF of numerators / LCM of denominators. HCF(2,4,8)=2, LCM(3,9,15)=45. So HCF = 2/45.  
Answer: A) 2/45

**Example 12 (Exponent Counting):** Find the number of trailing zeroes in 500!  
Options: A) 124  B) 125  C) 120  D) 122  
Explanation: Exponent of 5 in 500! = floor(500/5)+floor(500/25)+floor(500/125) = 100+20+4=124. (Trailing zeroes = exponent of 5, since 2's are more).  
Answer: A) 124

**Example 13 (Greatest Number With Same Remainder):** Find the greatest number that divides 43, 91, and 183 leaving the same remainder in each case.  
Options: A) 4  B) 8  C) 12  D) 16  
Explanation: If the same remainder is left, the required divisor must divide pairwise differences: 91-43=48, 183-91=92, 183-43=140. HCF(48,92,140)=4.  
Answer: A) 4

**Example 14 (Least Number Leaving Remainders):** Find the least number which leaves remainder 2 when divided by 3, remainder 3 when divided by 4, and remainder 4 when divided by 5.  
Options: A) 47  B) 58  C) 59  D) 62  
Explanation: Each remainder is one less than the divisor, so the number is 1 less than a common multiple of 3,4,5. LCM = 60. Least positive number = 60-1 = 59.  
Answer: C) 59

**Example 15 (LCM With Bells):** Three bells ring at intervals of 12, 18, and 30 seconds. If they ring together now, after how many seconds will they ring together again?  
Options: A) 90  B) 120  C) 180  D) 240  
Explanation: Take LCM(12,18,30). 12=2^2x3, 18=2x3^2, 30=2x3x5. LCM=2^2x3^2x5=180.  
Answer: C) 180

**Example 16 (HCF Word Problem):** A shopkeeper has 84 red pens, 126 blue pens, and 210 black pens. He wants identical packets with the maximum possible number of pens of each colour and no leftover. How many packets can he make?  
Options: A) 21  B) 42  C) 63  D) 84  
Explanation: Maximum identical packets = HCF(84,126,210). 84=2^2x3x7, 126=2x3^2x7, 210=2x3x5x7. HCF=2x3x7=42.  
Answer: B) 42

**Example 17 (Odd Factors):** How many odd factors does 720 have?  
Options: A) 6  B) 8  C) 10  D) 12  
Explanation: 720 = 72x10 = 2^4 x 3^2 x 5. Odd factors ignore the power of 2, so count = (2+1)(1+1)=6.  
Answer: A) 6

**Example 18 (Even Factors):** How many even factors does 720 have?  
Options: A) 18  B) 24  C) 30  D) 36  
Explanation: Total factors = (4+1)(2+1)(1+1)=30. Odd factors = 6. Even factors = 30-6=24.  
Answer: B) 24

**Example 19 (Sum of Factors):** Find the sum of all factors of 72.  
Options: A) 180  B) 195  C) 210  D) 240  
Explanation: 72=2^3x3^2. Sum of factors = (1+2+4+8)(1+3+9)=15x13=195.  
Answer: B) 195

**Example 20 (Euler Condition Check):** Find the remainder when 3^40 is divided by 10.  
Options: A) 1  B) 3  C) 7  D) 9  
Explanation: Unit digit cycle of 3 is 3,9,7,1. 40 is divisible by 4, so use the fourth cycle value: 1.  
Answer: A) 1

**Example 21 (Remainder of Product):** Find the remainder when 47 x 58 x 69 is divided by 5.  
Options: A) 1  B) 2  C) 3  D) 4  
Explanation: Reduce each factor mod 5: 47 -> 2, 58 -> 3, 69 -> 4. Product remainder = 2x3x4 = 24, and 24 mod 5 = 4.  
Answer: D) 4

**Example 22 (Fraction Comparison):** Which is greater: 17/29 or 19/33?  
Options: A) 17/29  B) 19/33  C) Equal  D) Cannot be determined  
Explanation: Cross multiply: 17x33=561 and 19x29=551. Since 561 > 551, 17/29 is greater.  
Answer: A) 17/29

**Example 23 (Terminating Decimal):** Which fraction has a terminating decimal expansion?  
Options: A) 7/12  B) 9/28  C) 11/40  D) 13/45  
Explanation: A fraction terminates only when the denominator in lowest form has prime factors only 2 and/or 5. 40=2^3x5, so 11/40 terminates.  
Answer: C) 11/40

**Example 24 (Recurring Decimal Mixed):** Convert 0.2777... into a fraction, where only 7 repeats.  
Options: A) 5/18  B) 25/90  C) 7/25  D) 14/45  
Explanation: Use mixed recurring formula: (27-2)/90 = 25/90 = 5/18.  
Answer: A) 5/18

**Example 25 (Factorial Power):** What is the highest power of 2 that divides 100!?  
Options: A) 94  B) 97  C) 98  D) 99  
Explanation: Exponent of 2 in 100! = floor(100/2)+floor(100/4)+floor(100/8)+floor(100/16)+floor(100/32)+floor(100/64) = 50+25+12+6+3+1 = 97.  
Answer: B) 97

---

## PYQ Mapping

| Topic Type | Practice Route |
|------------|----------------|
| Divisibility & Remainders | /exams/ssc-cgl/topics/number-system -> "Divisibility and Remainders" sub-section; solve 20+ PYQs on remainder of powers |
| HCF & LCM | /exams/ssc-cgl/topics/number-system -> "HCF LCM" sub-section; focus on fractions and three-number problems |
| Unit Digit & Cyclicity | /exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint -> Unit Digit sprint; 10 questions in 5 minutes |
| Number of Factors & Sum of Factors | /exams/ssc-cgl/topics/number-system -> "Factors" sub-section; solve 15 problems with large numbers |
| Simplification (Surds/Indices) | /exams/ssc-cgl/topics/number-system -> "Surds and Indices" sub-section; practice rationalization and comparison |
| Recurring Decimals | /exams/ssc-cgl/topics/number-system -> "Fractions and Decimals" sub-section; convert 15 recurring decimals to fractions |
| Least/Greatest Number Conditions | /exams/ssc-cgl/topics/number-system -> "Word Problems" sub-section; solve 10 condition-based problems |
| Mixed Application (LCM based) | /exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint -> "LCM HCF" mixed set; 8 questions in 8 minutes |
| Remainder Cycle with Euler | /exams/ssc-cgl/topics/number-system -> "Advanced Remainders" sub-section; 5 problems using Euler's theorem |
| Trailing Zeroes | /exams/ssc-cgl/topics/number-system -> "Factorial" sub-section; calculate for 100!, 200!, 500! |

---

## 200/200 Drill

**Timed Micro-Drills (Daily, Total 15 min):**

- **Drill 1: Divisibility Sprint (2 min)**  
  Given 10 random 5-digit numbers, apply divisibility rule for 7, 13, 17, 19. Write remainder in 0-1 sec each. Target: all correct in 2 min.

- **Drill 2: Unit Digit Blitz (2 min)**  
  15 exponents like 3^45, 7^123, 8^99. State unit digit. Do in 8 sec each. Track accuracy.

- **Drill 3: Factor Count (3 min)**  
  Factorize 10 numbers (e.g., 144, 180, 240, 504) and compute number of factors. Write only count. Check with formula.

- **Drill 4: HCF/LCM Race (3 min)**  
  Solve 5 two-number HCF/LCM problems and 5 fraction HCF/LCM in 3 min. Use both prime factor and division methods.

- **Drill 5: Surd Simplification (2 min)**  
  Simplify 10 surd expressions (e.g., 50 + 18 - 8). Target: 1 min 30 sec.

- **Drill 6: Recurring Conversion (1 min)**  
  Convert 5 recurring decimals to simplified fractions. Example: 0.216, 0.316.

- **Drill 7: Condition-based (2 min)**  
  5 problems: "smallest 4-digit number divisible by 3,5,7", "greatest 3-digit number leaves remainder 2 when divided by 9".

**Repair Rules:**
- If wrong answer on divisibility: re-apply rule step by step, then practice 10 similar numbers.
- If unit digit wrong: re-memorize cyclicity table, then do 20 random exponent problems.
- If factor count off: redo prime factorization with exponents, verify with (e+1) products.
- If HCF/LCM swapped: write "HCF = Greatest Common Divisor, LCM = Least Common Multiple" on scratch every time.
- If surd simplification slow: practice radical addition/subtraction with common radicand.
- If recurring decimal wrong: separate non-repeating part, write formula on index card.
- If condition problem error: always find LCM first, then use division to get smallest/greatest.

**Final Check:** Before exam, review this note and repeat the 200/200 Drill. You will master Number System for SSC CGL Tier-I.
<!-- SSC-FINAL-PRACTICE-QUEUE:START -->
## Final Practice Queue

1. Start one-by-one practice: [Number System practice](/exams/ssc-cgl/practice/number-system). Finish every question in this topic bank, not just the samples in the note.
2. Move to timed sets: [SSC CGL tests](/exams/ssc-cgl/tests?topic=number-system). Use topic drills first, then section mocks once accuracy is stable.
3. Repair every miss immediately: record the error label, redo 20 mixed questions from the same topic, then retest after 24 hours.
4. 200/200 rule: do not mark this topic exam-ready until correct answers come within 36 seconds and wrong answers are explained without looking at the solution.

<!-- SSC-FINAL-PRACTICE-QUEUE:END -->
