---
title: "CAT Quant — Permutations & Combinations"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 19
topic: "permutations-combinations"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# CAT Quant — Permutations & Combinations

## 1. Concept Map

This chapter is the foundation of all counting problems in CAT. The core idea is to count arrangements (permutations) and selections (combinations) systematically without listing everything.

```
                    COUNTING
                        |
        +---------------+---------------+
        |                               |
   PERMUTATIONS                   COMBINATIONS
   (Order Matters)                (Order Doesn't Matter)
        |                               |
   +----+----+                   +------+------+
   |    |    |                   |      |      |
Linear Circular Repetition   Selection  Distribution
   |    |    |                   |      |      |
   |    |    |                   |   Distinct Identical
   |    |    +-- Allowed        +--+      |      |
   |    |    +-- Not Allowed    |  |   +---+  +---+
   |    |                       |  |   |       |
   |    +-- Clockwise/          |  +--+       |
   |       Anticlockwise        |     |       |
   |                            |     |       |
   +-- With Constraints         |     |       |
       (Together, Never,        |     |       |
        Vowels, etc.)           |     |       |
                                |     |       |
                           +----+     |       |
                           |          |       |
                        Identical     |       |
                        Objects       |       |
                           |          |       |
                        +---+         |       |
                        |             |       |
                     Distribution     |       |
                     (Stars & Bars)   |       |
                                      |       |
                                 +----+       |
                                 |            |
                              Geometric      Number
                              Counting      Properties
```

---

## 2. Foundations: The Fundamental Principle of Counting

### 2.1 Multiplication Rule (AND)
If one operation can be done in $m$ ways, and a second operation can be done in $n$ ways, then both operations together can be done in $m \times n$ ways.

**Key word: "and" → multiply**

**Example:** Select one vowel AND one consonant.
- Vowels: 5, Consonants: 21
- Total = $5 \times 21 = 105$ ways

### 2.2 Addition Rule (OR)
If two operations are mutually exclusive (cannot happen together), and can be done in $m$ and $n$ ways respectively, then either operation can be done in $m + n$ ways.

**Key word: "or" → add**

**Example:** Select one letter from vowels OR consonants.
- Total = $5 + 21 = 26$ ways

### 2.3 Worked Examples (Source: PDF 1034-1035)

**Exp. 4:** 6 trains from Indore to Bhopal. Return by a different train.
- Outward: 6 ways, Return: 5 ways
- Total = $6 \times 5 = 30$ ways

**Exp. 6:** 4 persons leave a lift at different floors (5 floors available).
- 1st person: 5 floors, 2nd: 4, 3rd: 3, 4th: 2
- Total = $5 \times 4 \times 3 \times 2 = 120$ ways

**Exp. 7:** 4 persons leave at any of 5 floors.
- Each person has 5 choices.
- Total = $5^4 = 625$ ways

**Exp. 11:** 5 prizes to 7 boys (each eligible for all).
- Each prize can go to any of 7 boys.
- Total = $7^5 = 16807$ ways

**Exp. 13:** 6 true/false questions, all students answer differently.
- Each question has 2 choices.
- Total = $2^6 = 64$ students maximum

**Exp. 16:** 4-digit numbers from digits 3, 5, 7, 9 (repetition allowed).
- Each place has 4 choices.
- Total = $4^4 = 256$ numbers

**Exp. 17:** 3-digit numbers with unit digit = 0, no repetition.
- Unit: 1 way (0), Hundreds: 9 ways, Tens: 8 ways
- Total = $9 \times 8 \times 1 = 72$ numbers

**Exp. 19:** 4-digit numbers using 5 exactly once (digits 0-9, repetition allowed).
- Case 1 (5 at unit): $8 \times 9 \times 9 \times 1 = 648$
- Case 2 (5 at tens): $8 \times 9 \times 1 \times 9 = 648$
- Case 3 (5 at hundreds): $8 \times 1 \times 9 \times 9 = 648$
- Case 4 (5 at thousands): $1 \times 9 \times 9 \times 9 = 729$
- Total = $648 + 648 + 648 + 729 = 2673$ numbers

**Exp. 20:** 4-digit numbers from 0, 2, 3, 5, 8, 9.
- (i) Repetition allowed: $5 \times 6 \times 6 \times 6 = 1080$ (first digit ≠ 0)
- (ii) No repetition: $5 \times 5 \times 4 \times 3 = 300$

---

## 3. Permutations

### 3.1 Definition
A **permutation** is an arrangement of all or some things in a distinct order. **Order matters.**

**Formula:**
$$^nP_r = \frac{n!}{(n-r)!} = n(n-1)(n-2)\dots(n-r+1)$$

**Example:** $^4P_2 = \frac{4!}{2!} = 12$ (SW, WS, SA, AS, SG, GS, WA, AW, WG, GW, AG, GA)

### 3.2 Factorials
$$n! = 1 \cdot 2 \cdot 3 \dots (n-1) \cdot n$$
$$0! = 1 = 1!$$

### 3.3 Complete Formula Table (Source: PDF 1036-1037)

| # | Scenario | Formula |
|---|----------|---------|
| 1 | All n things taken at a time | $^nP_n = n!$ |
| 2 | r things taken at a time | $^nP_r = \frac{n!}{(n-r)!}$ |
| 3 | At most r at a time | $^nP_1 + ^nP_2 + \dots + ^nP_r$ |
| 4 | At least r at a time | $^nP_r + ^nP_{r+1} + \dots + ^nP_n$ |
| 5 | One particular thing always occurs (r at a time) | $r \cdot {}^{(n-1)}P_{r-1}$ |
| 6 | One particular thing never occurs (r at a time) | ${}^{(n-1)}P_r$ |
| 7 | k particular things always occur (r at a time) | $^kP_k \cdot {}^{(n-k)}P_{r-k}$ |
| 8 | k particular things never occur (r at a time) | ${}^{(n-k)}P_r$ |
| 9 | m specified things always together (all n taken) | $m!(n-m+1)!$ |
| 10 | m specified things never together (all n taken) | $n! - [m!(n-m+1)!]$ |

### 3.4 Worked Examples (Source: PDF 1037-1039)

**Q1:** $^9P_3 = 9 \times 8 \times 7 = 504$

**Q2:** $^nP_5 = 20 \cdot ^nP_3$
- $n(n-1)(n-2)(n-3)(n-4) = 20 \cdot n(n-1)(n-2)$
- $(n-3)(n-4) = 20 \rightarrow n = 8$

**Q4:** 3-digit numbers from 1, 2, 4, 5, 7, 8 (no repetition).
- $6 \times 5 \times 4 = 120$

**Q5:** Even numbers < 10,000 from 3, 5, 7, 8, 9 (no repetition).
- 1-digit even: 1 (only 8)
- 2-digit even: $4 \times 1 = 4$
- 3-digit even: $4 \times 3 \times 1 = 12$
- 4-digit even: $4 \times 3 \times 2 \times 1 = 24$
- Total = $1 + 4 + 12 + 24 = 41$

**Q6:** Numbers > 4000 from 0, 2, 5, 7, 8 (different digits).
- 4-digit: $3 \times 4 \times 3 \times 2 = 72$ (first digit: 5, 7, 8)
- 5-digit: $4 \times 4 \times 3 \times 2 \times 1 = 96$
- Total = $72 + 96 = 168$

**Q10:** Sum of all 4-digit numbers from 1, 2, 5, 6.
- Each digit appears in each position $3! = 6$ times.
- Sum = $6 \times (1+2+5+6) \times (1000+100+10+1) = 6 \times 14 \times 1111 = 93324$

**Q13:** Arrange all 7 novels: $7! = 5040$

**Q15:** Arrange at most 4 novels: $^7P_1 + ^7P_2 + ^7P_3 + ^7P_4 = 7 + 42 + 210 + 840 = 1099$

**Q17:** First novel always included, arrange 4 total: $4 \times ^6P_3 = 4 \times 120 = 480$

**Q21:** First two novels always together (arrange all 7): $2! \times 6! = 1440$

**Q22:** Last two novels never together: $7! - 2! \times 6! = 5040 - 1440 = 3600$

### 3.5 Word Problems (RAINBOW, Source: PDF 1038)

**Context:** RAINBOW has 7 distinct letters. Vowels: A, I, O (3). Consonants: R, N, B, W (4).

**Q23:** Total arrangements: $7! = 5040$

**Q24:** Words beginning with R: $6! = 720$

**Q26:** R and W at end positions: $2! \times 5! = 240$

**Q27:** First and last letters are vowels: $^3P_2 \times 5! = 6 \times 120 = 720$

**Q28:** R and W together: $2! \times 6! = 1440$

**Q29:** R and W never together: $7! - 2! \times 6! = 3600$

**Q30:** Vowels never together: $4! \times ^5P_3 = 24 \times 60 = 1440$

**Q31:** A before I before O: $\frac{7!}{3!} = 840$

**Q32:** Vowels always before consonants: $3! \times 4! = 144$

**Q33:** No two consonants together: $3! \times ^4P_4 = 6 \times 24 = 144$

**Q34:** Vowels occupy only even positions: $^3P_3 \times 4! = 6 \times 24 = 144$

**Q35:** Vowels occupy odd positions: $^4P_3 \times 4! = 24 \times 24 = 576$

**Q37:** Dictionary position of RAINBOW.
- Letters in alphabetical order: A, B, I, N, O, R, W
- Words before RAINBOW:
  - Starting with A, B, I, N, O: $5 \times 6! = 3600$
  - Starting with R, then A: $5! = 120$
  - Starting with RAI, then B: $4! = 24$
  - Starting with RAIN, then B: $3! = 6$
- Position = $3600 + 120 + 24 + 6 + 1 = 3631$

### 3.6 Seating Arrangements (Source: PDF 1038-1039)

**Q41:** 5 men, 4 women in row, no two same sex together.
- Must start and end with men: $5! \times 4! = 2880$

**Q42:** 5 men, 4 women, no two men together.
- Women first: $4! \times ^5P_5 = 24 \times 120 = 2880$

**Q43:** 5 men, 4 women, no two women together.
- Men first: $5! \times ^6P_4 = 120 \times 360 = 43200$

**Q44:** 5 men, 4 women, all women NOT together.
- Total: $9! = 362880$
- All women together: $4! \times 6! = 17280$
- Not together: $362880 - 17280 = 345600$

**Q46:** 6 men, 3 women, no two women together.
- Men: $6! = 720$; women in 7 gaps: $^7P_3 = 210$
- Total: $720 \times 210 = 151200$

**Q47:** 4 men, 4 women, alternate.
- 2 patterns: $2 \times 4! \times 4! = 1152$

---

## 4. Permutations of n Things Not All Different

### 4.1 Formulas (Source: PDF 1040)

1. **p things alike, rest different:** $\frac{n!}{p!}$
2. **p alike of one kind, q alike of another, r alike of another, rest different:** $\frac{n!}{p!q!r!}$
3. **General:** $\frac{n!}{p_1!p_2!\dots p_r!}$

### 4.2 Worked Examples (Source: PDF 1040-1041)

**Q1:** REPEAT (6 letters, E repeated twice): $\frac{6!}{2!} = 360$

**Q2:** TAMANNA (7 letters, A repeated 3 times, N repeated 2 times): $\frac{7!}{3! \times 2!} = 420$

**Q3:** RECUPERATE (10 letters, E repeated 3 times, R repeated 2 times): $\frac{10!}{3! \times 2!} = 302400$

**Q4:** ASSASSINATION (13 letters: A=3, S=4, I=2, N=2): $\frac{13!}{3! \times 4! \times 2! \times 2!} = 10810800$

**Q6:** COMMITTEE with 4 vowels not together.
- Total: $\frac{9!}{2! \times 2! \times 2!} = 45360$
- All vowels together: $\frac{4!}{2!} \times \frac{6!}{2! \times 2!} = 12 \times 180 = 2160$
- Not together: $45360 - 2160 = 43200$

**Q7:** COMMITTEE with no two vowels together.
- Consonants: $\frac{5!}{2! \times 2!} = 30$
- 6 gaps for 4 vowels: $\frac{^6P_4}{2!} = 180$
- Total: $30 \times 180 = 5400$

**Q9:** NAINITAL beginning with L, ending with T.
- Fix L first, T last: remaining 6 letters (N=2, A=2, I=2): $\frac{6!}{2! \times 2! \times 2!} = 90$

**Q10:** MATHEMATICS with vowels together.
- Vowels: A, E, A, I (A repeated)
- Treat as unit: 8 units: $\frac{8!}{2!} \times \frac{4!}{2!} = 20160 \times 12 = 120960$

**Q11:** IMPORTANT with both T's not together.
- Total: $\frac{9!}{2!} = 181440$
- Both T together: $8! = 40320$
- Not together: $181440 - 40320 = 141120$

**Q15:** 7-digit numbers from 1, 2, 0, 2, 4, 2, 4.
- Total: $\frac{7!}{3! \times 2!} = 420$
- Starting with 0: $\frac{6!}{3! \times 2!} = 60$
- Valid: $420 - 60 = 360$

**Q17:** Even 6-digit numbers from 5, 6, 7, 7, 2, 4.
- Last digit = 6, 2, or 4: each gives $\frac{5!}{2!} = 60$
- Total = $3 \times 60 = 180$

**Q18:** Numbers > 1,000,000 from 5, 5, 2, 2, 1, 7, 0.
- 7-digit numbers: $\frac{7!}{2! \times 2!} = 1260$
- Starting with 0: $\frac{6!}{2! \times 2!} = 180$
- Valid: $1260 - 180 = 1080$

**Q19:** REGURGITATE with two T's together.
- Two T's as one unit: 10 units: $\frac{10!}{2! \times 2! \times 2!} = 453600$

**Q20:** SUMPTUOS with two U's not together.
- Total: $\frac{8!}{2! \times 2!} = 10080$
- U's together: $\frac{7!}{2!} = 2520$
- Not together: $10080 - 2520 = 7560$

**Q21:** AFLATOON with consonants and vowels alternating.
- Vowels: A=2, O=2 (4 vowels); Consonants: F, L, T, N (4 consonants)
- 2 patterns: $2 \times \frac{4!}{2! \times 2!} \times 4! = 2 \times 6 \times 24 = 288$

**Q23:** 3 copies each of 4 different books: $\frac{12!}{3! \times 3! \times 3! \times 3!} = 369600$

**Q24:** 3 red, 4 green, 5 pink marbles: $\frac{12!}{3! \times 4! \times 5!} = 27720$

---

## 5. Permutations with Repetition Allowed

### 5.1 Formulas (Source: PDF 1041)

1. **Exactly r at a time, repetition allowed:** $n^r$
2. **At most r at a time, repetition allowed:** $n + n^2 + n^3 + \dots + n^r = \frac{n(n^r-1)}{n-1}$
3. **At least r at a time, repetition allowed:** $n^r + n^{r+1} + \dots + n^n = \frac{n^r(n^{n-r+1}-1)}{n-1}$

### 5.2 Worked Examples (Source: PDF 1041-1042)

**Q1:** 5-digit numbers from 0, 2, 3, 4, 5 (repetition allowed).
- First digit ≠ 0: $4 \times 5^4 = 2500$

**Q2:** Numbers between 9 and 1000 from 0, 1, 2, 3, 7, 8 (repetition allowed).
- 2-digit: $5 \times 6 = 30$
- 3-digit: $5 \times 6 \times 6 = 180$
- Total: $30 + 180 = 210$

**Q3:** 5-digit numbers from 1, 2, 3, 4, 5, even digit not at even place.
- Even digits: 2, 4; Odd digits: 1, 3, 5
- Even positions (2nd, 4th): $3 \times 3 = 9$
- Odd positions (1st, 3rd, 5th): $5 \times 5 \times 5 = 125$
- Total: $9 \times 125 = 1125$

**Q4:** Numbers from 1000-9999 without 4 different digits.
- Total: $9 \times 10 \times 10 \times 10 = 9000$
- With 4 different digits: $9 \times 9 \times 8 \times 7 = 4536$
- Without: $9000 - 4536 = 4464$

**Q5:** 3-digit numbers with at least one 9 (repetition allowed).
- Total: $9 \times 10 \times 10 = 900$
- No 9: $8 \times 9 \times 9 = 648$
- At least one 9: $900 - 648 = 252$

**Q6:** Numbers ≤ 4321 from 1, 2, 3, 4 (repetition allowed).
- 1-digit: 4
- 2-digit: $4 \times 4 = 16$
- 3-digit: $4 \times 4 \times 4 = 64$
- 4-digit ≤ 4321:
  - Starting with 1, 2, 3: $3 \times 4 \times 4 \times 4 = 192$
  - Starting with 4, second digit ≤ 3: $3 \times 4 \times 4 = 48$
  - Starting with 4, second = 4, third ≤ 2: $2 \times 4 = 8$
  - Starting with 4, second = 4, third = 3, fourth ≤ 1: 1
- Total 4-digit: $192 + 48 + 8 + 1 = 249$
- Grand total: $4 + 16 + 64 + 249 = 313$

**Q7:** 4 different rings in 3 fingers: $3^4 = 81$

**Q8:** 5 prizes to 4 boys: $4^5 = 1024$

**Q11:** 5 letters in 4 letter boxes: $4^5 = 1024$

---

## 6. Circular Permutations

### 6.1 Formulas (Source: PDF 1042)

1. **n different things in circle:** $(n-1)!$
2. **n different things in circle, one direction only (necklace/garland):** $\frac{(n-1)!}{2}$
3. **n different things taken r at a time in circle:** $\frac{^nP_r}{r}$
4. **n different things taken r at a time in circle, one direction:** $\frac{^nP_r}{2r}$

### 6.2 Worked Examples (Source: PDF 1042-1043)

**Q1:** 6 boys form a ring: $(6-1)! = 5! = 120$

**Q2:** 6 boys at round table, 2 particular together: $2! \times (6-2)! = 2 \times 24 = 48$

**Q3:** 6 beads in necklace: $\frac{(6-1)!}{2} = 60$

**Q4:** 5 men, 2 ladies at round table, ladies never together.
- Total: $(7-1)! = 720$
- Ladies together: $2! \times (6-1)! = 240$
- Never together: $720 - 240 = 480$

**Q5:** 9 persons + host at circular table, Sahara and Mahindra on either side of Ambani.
- Treat (Sahara-Ambanni-Mahindra) as unit: $2 \times (8-1)! = 10080$

**Q7:** 6 men, 6 women at circular table, no two women adjacent.
- Men in circle: $(6-1)! = 120$
- Women in 6 gaps: $6! = 720$
- Total: $120 \times 720 = 86400$

**Q8:** 3 boys, 4 girls at circular table, no two boys together.
- Girls in circle: $(4-1)! = 6$
- Boys in 4 gaps: $^4P_3 = 24$
- Total: $6 \times 24 = 144$

**Q9:** 7 sisters at round table, different neighbours each time.
- $\frac{(7-1)!}{2} = 360$

**Q10:** 10 flowers in garland, 3 particular together.
- $3! \times (10-3)! = 6 \times 5040 = 30240$

**Q12:** 3 couples at circular table, no husband opposite wife.
- Total circular: $5! = 120$
- Cases with at least one couple opposite: 48 + 8 = 56
- Required: $120 - 56 = 64$

---

## 7. Combinations

### 7.1 Definition
A **combination** is a selection of things where **order does NOT matter**. AB and BA are the same.

**Formula:**
$$^nC_r = \frac{n!}{r!(n-r)!}$$

### 7.2 Essential Properties (Source: PDF 1043)

1. $^nC_r = \frac{^nP_r}{r!}$
2. $^nC_0 = ^nC_n = 1$
3. $^nC_r = ^nC_{n-r}$ $(0 \le r \le n)$
4. $^nC_x = ^nC_y \iff x + y = n$ or $x = y$
5. $^nC_{r-1} + ^nC_r = {}^{n+1}C_r$
6. If n is even, greatest $^nC_r = ^nC_m$ where $m = n/2$
7. If n is odd, greatest $^nC_r = ^nC_m$ where $m = (n-1)/2$ or $(n+1)/2$
8. $^rC_r + {}^{r+1}C_r + \dots + ^nC_r = {}^{n+1}C_{r+1}$ $(r \le n)$
9. $^nC_0 + ^nC_1 + \dots + ^nC_n = 2^n$
10. $^nC_1 + ^nC_2 + \dots + ^nC_n = 2^n - 1$
11. $^nC_0 + ^nC_2 + ^nC_4 + \dots = 2^{n-1}$
12. $^nC_1 + ^nC_3 + ^nC_5 + \dots = 2^{n-1}$

### 7.3 Combination of n Different Things (Source: PDF 1043)

1. **x particular things always occur:** ${}^{n-x}C_{r-x}$
2. **x particular things never occur:** ${}^{n-x}C_r$
3. **x always occur AND y never occur:** ${}^{n-x-y}C_{r-x}$
4. **x particular things not together:** ${}^{n-x}C_{r-x}$
5. **Selection of zero or more from n distinct:** $2^n$
6. **Selection of one or more from n distinct:** $2^n - 1$

### 7.4 Worked Examples (Source: PDF 1043-1047)

**Q1:** $^8C_3 = 56$

**Q2:** $^{10}C_5 = 252$

**Q3:** $^{13}C_x = ^{13}C_y$, $x \neq y$: $x + y = 13$

**Q4:** $^{17}C_r = ^{17}C_{r+3}$: $r + (r+3) = 17 \rightarrow r = 7$

**Q5:** $^7P_3 = n \cdot ^7C_3$: $210 = n \times 35 \rightarrow n = 6$

**Q6:** $C(2n,3) : C(n,2) = 12:1$
- $\frac{(2n)(2n-1)(2n-2)}{6} = 12 \times \frac{n(n-1)}{2}$
- $4(2n-1) = 36 \rightarrow n = 5$

**Q7:** ${}^{n-1}C_3 + {}^{n-1}C_4 > {}^nC_3$
- ${}^{n-1}C_3 + {}^{n-1}C_4 = {}^nC_4$
- $^nC_4 > ^nC_3 \rightarrow n > 6 \rightarrow$ least n = 7

**Q8:** $^nC_x = 56$, $^nP_x = 336$
- $\frac{^nP_x}{^nC_x} = x! = 6 \rightarrow x = 3$
- $^nC_3 = 56 \rightarrow n = 8$

**Q9:** $^{11}C_x$ maximum: n = 11 (odd), max at x = 5 or 6

**Q10:** $^{12}C_x$ maximum: n = 12 (even), max at x = 6

**Q12:** Committee of 5 from 6 gentlemen, 4 ladies: $^{10}C_5 = 252$

**Q13:** Choose 6 from 10 questions: $^{10}C_6 = 210$

**Q14:** Question 1 compulsory, choose 6 from 10: $^9C_5 = 126$

**Q15:** Invite one or more of 5 friends: $2^5 - 1 = 31$

**Q16:** Committee of 6 (4 men, 2 ladies) from 7 men, 6 ladies: $^7C_4 \times ^6C_2 = 35 \times 15 = 525$

**Q17:** Committee of 5 from 6 gentlemen, 4 ladies, at least 1 lady.
- Total: $^{10}C_5 = 252$
- No lady: $^6C_5 = 6$
- At least 1 lady: $252 - 6 = 246$

**Q19:** Committee of 4 men, 3 women from 6 men, 8 women: $^6C_4 \times ^8C_3 = 15 \times 56 = 840$

**Q20:** Miss A refuses if Mr. B is member.
- Total: $^6C_4 \times ^8C_3 = 840$
- With both A and B: $^5C_3 \times ^7C_2 = 10 \times 21 = 210$
- Valid: $840 - 210 = 630$

**Q21:** Committee of 7 from 11, 3 particular included: $^8C_4 = 70$

**Q22:** Committee of 7 from 11, 3 particular excluded: $^8C_7 = 8$

**Q24:** Committee of 5 from 6 gents, 4 ladies, at most 2 ladies.
- 0 ladies: $^6C_5 = 6$
- 1 lady: $^4C_1 \times ^6C_4 = 4 \times 15 = 60$
- 2 ladies: $^4C_2 \times ^6C_3 = 6 \times 20 = 120$
- Total: $6 + 60 + 120 = 186$

**Q25:** Vote for any number ≤ 4 from 7 candidates.
- $^7C_1 + ^7C_2 + ^7C_3 + ^7C_4 = 7 + 21 + 35 + 35 = 98$

**Q27:** Choose 6 from part A (8 questions), 5 from part B (8 questions).
- $^8C_6 \times ^8C_5 = 28 \times 56 = 1568$

**Q28:** Answer 6 from 12 (2 groups of 6), max 4 from any group.
- (4,2): $^6C_4 \times ^6C_2 = 15 \times 15 = 225$
- (3,3): $^6C_3 \times ^6C_3 = 20 \times 20 = 400$
- (2,4): $^6C_2 \times ^6C_4 = 15 \times 15 = 225$
- Total: $225 + 400 + 225 = 850$

**Q29:** Answer 8 from 12 (Part A: 7, Part B: 5), at least 3 from each.
- (5,3): $^7C_5 \times ^5C_3 = 21 \times 10 = 210$
- (4,4): $^7C_4 \times ^5C_4 = 35 \times 5 = 175$
- (3,5): $^7C_3 \times ^5C_5 = 35 \times 1 = 35$
- Total: $210 + 175 + 35 = 420$

**Q30:** Answer 6 from groups of 5, 5, 4; at least 2 from first two, 1 from third.
- (2,2,2): $^5C_2 \times ^5C_2 \times ^4C_2 = 10 \times 10 \times 6 = 600$
- (2,3,1): $^5C_2 \times ^5C_3 \times ^4C_1 = 10 \times 10 \times 4 = 400$
- (3,2,1): $^5C_3 \times ^5C_2 \times ^4C_1 = 10 \times 10 \times 4 = 400$
- Total: $600 + 400 + 400 = 1400$

**Q31:** Invite 10 guests, 8 relatives from 18 (13 relatives).
- $^{13}C_8 \times ^5C_2 = 1287 \times 10 = 12870$

**Q32:** Handshakes among 11 players: $^{11}C_2 = 55$

**Q36:** 66 handshakes, how many members: $^nC_2 = 66 \rightarrow n = 12$

**Q37:** Team of 11 from 16, particular player always chosen: $^{15}C_{10} = 3003$

**Q38:** Team of 11 from 16, particular player never chosen: $^{15}C_{11} = 1365$

**Q39:** Team of 11 from 16 (4 bowlers, 2 wicket keepers), at least 3 bowlers, at least 1 wicket keeper.
- (3B, 1WK, 7 others): $^4C_3 \times ^2C_1 \times ^{10}C_7 = 4 \times 2 \times 120 = 960$
- (3B, 2WK, 6 others): $^4C_3 \times ^2C_2 \times ^{10}C_6 = 4 \times 1 \times 210 = 840$
- (4B, 1WK, 6 others): $^4C_4 \times ^2C_1 \times ^{10}C_6 = 1 \times 2 \times 210 = 420$
- (4B, 2WK, 5 others): $^4C_4 \times ^2C_2 \times ^{10}C_5 = 1 \times 1 \times 252 = 252$
- Total: $960 + 840 + 420 + 252 = 2472$

**Q40:** Team of 11 from 20 (6 bowlers, 3 wicket keepers), exactly 2 WK, at least 4 bowlers.
- (4B, 2WK, 5 others): $^6C_4 \times ^3C_2 \times ^{11}C_5 = 15 \times 3 \times 462 = 20790$
- (5B, 2WK, 4 others): $^6C_5 \times ^3C_2 \times ^{11}C_4 = 6 \times 3 \times 330 = 5940$
- (6B, 2WK, 3 others): $^6C_6 \times ^3C_2 \times ^{11}C_3 = 1 \times 3 \times 165 = 495$
- Total: $20790 + 5940 + 495 = 27225$

**Q41:** Team of 11 (1 WK, 2 bowlers, 3 all-rounders, 5 batsmen) from 25 (2 WK, 8 bowlers, 5 all-rounders, 10 batsmen).
- $^2C_1 \times ^8C_2 \times ^5C_3 \times ^{10}C_5 = 2 \times 28 \times 10 \times 252 = 141120$

**Q42:** Exactly 1 book on each subject (3 Economics, 4 Strategy, 5 Philosophy).
- $3 \times 4 \times 5 = 60$

**Q43:** At least 1 book on each subject.
- $(2^3-1)(2^4-1)(2^5-1) = 7 \times 15 \times 31 = 3255$

**Q44:** 3 red balls from 7 red, 6 white, 4 blue: $^7C_3 = 35$

**Q45:** 3 balls, no red: $^{10}C_3 = 120$

**Q46:** 1 ball of each colour: $^7C_1 \times ^6C_1 \times ^4C_1 = 7 \times 6 \times 4 = 168$

**Q47:** 6 balls from 5 red, 6 green, at least 2 of each.
- (2R,4G): $^5C_2 \times ^6C_4 = 10 \times 15 = 150$
- (3R,3G): $^5C_3 \times ^6C_3 = 10 \times 20 = 200$
- (4R,2G): $^5C_4 \times ^6C_2 = 5 \times 15 = 75$
- Total: $150 + 200 + 75 = 425$

**Q49:** Select 4 letters from EXAMINATION.
- Letters: A=2, I=2, N=2, others distinct (E, X, M, T, O)
- All different: $^8C_4 = 70$
- 2 same + 2 different: $^3C_1 \times ^7C_2 = 3 \times 21 = 63$
- 2 same + 2 same: $^3C_2 = 3$
- Total: $70 + 63 + 3 = 136$

**Q50:** 4-letter words from MATHEMATICS.
- Letters: M=2, A=2, T=2, H=1, E=1, I=1, C=1, S=1
- All different: $^8C_4 \times 4! = 70 \times 24 = 1680$
- 2 same + 2 different: $^3C_1 \times ^7C_2 \times \frac{4!}{2!} = 3 \times 21 \times 12 = 756$
- 2 same + 2 same: $^3C_2 \times \frac{4!}{2! \times 2!} = 3 \times 6 = 18$
- Total: $1680 + 756 + 18 = 2454$

**Q53:** $^{10}C_1 + ^{10}C_2 + \dots + ^{10}C_{10} = 2^{10} - 1$

**Q54:** $^{10}C_2 + ^{10}C_3 + \dots + ^{10}C_{10} = 2^{10} - 2$

**Q56:** $^{10}C_0 + ^{10}C_2 + ^{10}C_4 + \dots = 2^9$

**Q58:** Attend 1 or more of 4 sessions: $2^4 - 1 = 15$

---

## 8. Combination of n Identical Things

### 8.1 Formulas (Source: PDF 1048)

1. **Select r from n identical:** 1
2. **Select at most r from n identical:** $r + 1$
3. **Select at least r from n identical:** $(n - r) + 1$
4. **Select at least one from n identical:** $n$
5. **Select zero or more from n identical:** $n + 1$

### 8.2 Combination of n Things Not All Different (Source: PDF 1048)

1. **Zero or more from p, q, r alike of different kinds:** $(p+1)(q+1)(r+1)\dots$
2. **At least one from p, q, r alike:** $(p+1)(q+1)(r+1)\dots - 1$
3. **Zero or more from p, q, r identical + n distinct:** $(p+1)(q+1)(r+1)2^n$
4. **At least one from p, q, r identical + n distinct:** $(p+1)(q+1)(r+1)2^n - 1$
5. **Choose k objects from p, q, r alike:** Coefficient of $x^k$ in $(1+x+\dots+x^p)(1+x+\dots+x^q)\dots$
6. **Choose k with at least one of each kind:** Coefficient of $x^k$ in $(x+x^2+\dots+x^p)(x+x^2+\dots+x^q)\dots$

### 8.3 Worked Examples (Source: PDF 1049-1050)

**Q1:** Select 4 letters from {A,A,B,B,C,C,C,C}.
- Cases: (4C): 1; (3C+1): 2; (2C+2): 2; (2C+1+1): 2; (1+1+2): 2; (2+2): 1; (1+1+1+1): 1
- Total: 7

**Q2:** Select 4 with at least one of each A, B, C.
- (1A,1B,2C): 1; (1A,2B,1C): 1; (2A,1B,1C): 1
- Total: 3

**Q3-10:** 10 identical red tees.
- Select 1: 1
- Select at least 1: 10
- Select at most 1: 2 (0 or 1)
- Select 4: 1
- Select at least 4: $10 - 4 + 1 = 7$
- Select at most 4: $4 + 1 = 5$
- Select any number: $10 + 1 = 11$
- Select 10: 1

**Q11:** Select any number from 2W, 3R, 4G, 3Y candles.
- $(2+1)(3+1)(4+1)(3+1) = 3 \times 4 \times 5 \times 4 = 240$

**Q12:** Select at least one: $240 - 1 = 239$

**Q14:** Select at least one of each: $2 \times 3 \times 4 \times 3 = 72$

**Q16:** Select at least 2 of each: $(2-2+1)(3-2+1)(4-2+1)(3-2+1) = 1 \times 2 \times 3 \times 2 = 12$

**Q17:** Select at most 2 of each: $3 \times 3 \times 3 \times 3 = 81$

**Q18:** Select 2 candles: Coefficient of $x^2$ in $(1+x+x^2)(1+x+x^2+x^3)(1+x+x^2+x^3+x^4)(1+x+x^2+x^3) = 10$

**Q21:** Select 4 candles: Coefficient of $x^4 = 29$

**Q22:** Select 6 candles: Coefficient of $x^6 = 36$

**Q23:** Select at least 6: $240 - (1+4+10+16+22+29) = 158$

**Q24:** Select at most 6: $1+4+10+16+22+29+36 = 118$

**Q25:** Select 6 with at least one of each colour: 10

**Q26:** Select any number from 3 identical 4GB, 4 identical 2GB, 5 distinct pendrives.
- $(3+1)(4+1)(2^5) = 4 \times 5 \times 32 = 640$

**Q27:** Select at least one: $640 - 1 = 639$

**Q29:** Select 1 from each box: $3 \times 4 \times 5 = 60$

**Q30:** Select 3 pendrives: Coefficient of $x^3$ in $(1+x+x^2+x^3)(1+x+x^2+x^3+x^4)(1+x)^5 = 49$

**Q31:** Select 3 distinct pendrives.
- 3 distinct from 5 distinct: $^5C_3 = 10$
- 2 distinct + 1 from identical: $^5C_2 \times 2 = 20$
- 1 distinct + 2 from identical: $^5C_1 \times 1 = 5$
- 3 from identical: 1
- Total: $10 + 20 + 5 + 1 = 36$

**Q32:** Select 2 of 4GB, 3 of 2GB, 4 distinct: $1 \times 1 \times ^5C_4 = 5$

**Q34:** Select any 2 identical pendrives: 1 (from box 1) + 1 (from box 2) = 2

**Q35:** Select any 2 distinct pendrives.
- 2 distinct from 5 distinct: $^5C_2 = 10$
- 1 distinct + 1 from identical: $^5C_1 \times 2 = 10$
- Total: 20

**Q36:** Select 7 coupons (4 identical + 6 distinct).
- 4 identical + 3 distinct: $^6C_3 = 20$
- 3 identical + 4 distinct: $^6C_4 = 15$
- 2 identical + 5 distinct: $^6C_5 = 6$
- 1 identical + 6 distinct: $^6C_6 = 1$
- Total: $20 + 15 + 6 + 1 = 42$

**Q37:** Select 3 coupons.
- 0 identical + 3 distinct: $^6C_3 = 20$
- 1 identical + 2 distinct: $^6C_2 = 15$
- 2 identical + 1 distinct: $^6C_1 = 6$
- 3 identical: 1
- Total: $20 + 15 + 6 + 1 = 42$

---

## 9. Combination of Contiguous Things

### 9.1 Formulas (Source: PDF 1050)

**(A) Linear Combination**
1. **k consecutive from n in a row:** $(n - k + 1)$
2. **k things from n in a row, no two adjacent:** ${}^{n-k+1}C_k$

**(B) Circular Combination**
- **k consecutive from n in a circle:** $n$ (when $k < n$); 1 (when $k = n$)

### 9.2 Worked Examples (Source: PDF 1050-1052)

**Q1:** 3 consecutive from 10 candles in a row: $10 - 3 + 1 = 8$

**Q2:** 3 NOT consecutive: $^{10}C_3 - 8 = 120 - 8 = 112$

**Q3:** At least 2 consecutive: $^{10}C_3 - ^8C_3 = 120 - 56 = 64$

**Q4:** 5 seats together from 10 in a row: $10 - 5 + 1 = 6$

**Q5:** 4 contiguous plots from 10 in a row: $10 - 4 + 1 = 7$

**Q6:** 4 consecutive days in next week (7 days): $7 - 4 + 1 = 4$

**Q7:** 4 months in a year, no two consecutive: $^9C_4 = 126$

**Q11:** 6 adjacent guards from 12 in circle: 12

**Q12:** 2 adjacent chairs from 5 in circle: 5

**Q13:** 4 adjacent chairs from 10 in circle: 10

**Q14:** Triangles with at least one side coinciding with polygon side (10-sided polygon).
- Total triangles: $^{10}C_3 = 120$
- Triangles with no side coinciding: 50
- At least one side: $120 - 50 = 70$

**Q15:** No side coincides: 50

---

## 10. Distribution/Division of Distinct Things

### 10.1 Formulas (Source: PDF 1052)

1. **(m+n) things into 2 groups of m, n (order not important):** $\frac{(m+n)!}{m!n!}$
2. **(m+n) things into 2 groups of m, n (order important):** $\frac{(m+n)!}{m!n!} \times 2!$
3. **(m+n+p) things into 3 groups of m, n, p (order not important):** $\frac{(m+n+p)!}{m!n!p!}$
4. **(m+n+p) things into 3 groups of m, n, p (order important):** $\frac{(m+n+p)!}{m!n!p!} \times 3!$
5. **mn things into m equal groups of n (order not important):** $\frac{(mn)!}{(n!)^m} \times \frac{1}{m!}$
6. **mn things into m equal groups of n (order important):** $\frac{(mn)!}{(n!)^m}$
7. **2n things into 2 groups of n (order not important):** $\frac{(2n)!}{(n!)^2 \times 2!}$

### 10.2 Critical Note (Source: PDF 1053)

> **NOTE:** Usually the phrase 'distribution' indicates that the things are given out to different people and so the order becomes important. The phrase 'division' usually suggests that the different things are just clubbed in different sets or groups. They may be kept in identical boxes or their receivers are identical, and therefore they are naturally indistinguishable.

### 10.3 Worked Examples (Source: PDF 1053-1054)

**Exp. 1:** Dividing 4 distinct articles between 2 groups.
- Case I (4,0): $^4C_4 \times ^0C_0 = 1$
- Case II (3,1): $^4C_3 \times ^1C_1 = 4$
- Case III (2,2): $^4C_2 \times ^2C_2 \times \frac{1}{2} = 3$
- Total: $1 + 4 + 3 = 8$

**Exp. 2:** Distributing 4 distinct articles between 2 girls.
- Case I (4,0): $^4C_4 \times ^0C_0 \times 2 = 2$
- Case II (3,1): $^4C_3 \times ^1C_1 \times 2 = 8$
- Case III (2,2): $^4C_2 \times ^2C_2 \times \frac{1}{2} \times 2 = 6$
- Total: $2 + 8 + 6 = 16$

**Exp. 5:** Dividing 4 distinct articles between 2 groups equally.
- $(^4C_2 \times ^2C_2) \times \frac{1}{2!} = \frac{4!}{2!2!} \times \frac{1}{2!} = 3$

**Exp. 6:** Distributing 4 distinct articles between 2 girls equally.
- $^4C_2 \times ^2C_2 \times \frac{1}{2!} \times 2! = 6$

---

## 11. Distribution/Division of Identical Objects

### 11.1 Formulas (Source: PDF 1054-1055)

**Formula 1:** n identical items among r persons (each can receive any number):
$${}^{n+r-1}C_{r-1}$$

**Formula 2:** n identical items among r persons (each must receive at least one):
$${}^{n-1}C_{r-1}$$

**Formula 3:** n identical items into r groups, each group contains between m and k items:
- Coefficient of $x^n$ in $(x^m + x^{m+1} + \dots + x^k)^r$

**Formula 4:** n identical items into r groups with individual bounds $a_i$ to $b_i$:
- Coefficient of $x^n$ in $(x^{a_1} + x^{a_1+1} + \dots + x^{b_1})(x^{a_2} + x^{a_2+1} + \dots + x^{b_2})\dots$

### 11.2 Worked Examples (Source: PDF 1055-1064)

**Exp. 1:** Distributing 4 identical chocolates between 2 kids.
- 5 ways: (4,0), (3,1), (2,2), (1,3), (0,4)
- Formula: ${}^{4+2-1}C_{2-1} = {}^5C_1 = 5$

**Exp. 2:** Distributing 12 identical chocolates among 3 kids.
- ${}^{12+3-1}C_{3-1} = {}^{14}C_2 = 91$

**Exp. 3:** Distributing 12 identical chocolates among 5 kids.
- ${}^{12+5-1}C_{5-1} = {}^{16}C_4 = 1820$

**Exp. 4:** Distributing 12 identical chocolates among 3 kids, each must get at least 1.
- Give 1 to each first, distribute remaining 9: ${}^{9+3-1}C_{3-1} = {}^{11}C_2 = 55$

**Exp. 5:** Distributing 12 identical chocolates among 3 kids, each must get at least 2.
- Give 2 to each first, distribute remaining 6: ${}^{6+3-1}C_{3-1} = {}^8C_2 = 28$

**Exp. 6:** Distributing 12 identical chocolates among 3 kids, each must get at least 3.
- Give 3 to each first, distribute remaining 3: ${}^{3+3-1}C_{3-1} = {}^5C_2 = 10$

**Exp. 7:** Distributing 12 identical chocolates among 3 kids, each must get at least 4.
- Give 4 to each first, remaining 0: 1 way

**Exp. 8:** Distributing 12 identical chocolates among 3 kids, each must get at least 5.
- Need 15 chocolates, only 12 available: 0 ways

**Exp. 9:** Distributing 12 identical chocolates among 3 kids, one gets at least 1, another at least 2, third at least 3.
- Give 1+2+3 = 6 first, distribute remaining 6: ${}^{6+3-1}C_{3-1} = {}^8C_2 = 28$

**Exp. 10:** Distributing 12 identical chocolates among 3 kids, one particular kid gets multiples of 3.
- $3x + y + z = 12$
- x=0: 13 solutions; x=1: 10; x=2: 7; x=3: 4; x=4: 1
- Total: $13 + 10 + 7 + 4 + 1 = 35$

**Exp. 12:** Distributing 12 chocolates among 3 kids, exactly two kids get the same number.
- Let x = y. Then $2x + z = 12$
- Triplets: {0,0,12}, {1,1,10}, {2,2,8}, {3,3,6}, {5,5,2}, {6,6,0}
- Each arranged in $\frac{3!}{2!} = 3$ ways
- Total: $6 \times 3 = 18$

**Exp. 13:** Distributing 12 chocolates among 3 kids, no two kids get equal number.
- Total unrestricted: 91
- All equal: 1
- Exactly two equal: 18
- All distinct: $91 - 1 - 18 = 72$

**Exp. 15:** Distributing 12 chocolates among 3 named kids, Archimedes > Bernoulli > Carl Gauss.
- Out of 6 relations in all-distinct case, only 1 is favorable.
- Required: $72 \times \frac{1}{6} = 12$
- **Formula shortcut:** $\left[\frac{n^2 + 6}{12}\right] = \left[\frac{150}{12}\right] = 12$

**Exp. 16:** Distributing 12 chocolates among 3 kids, each gets odd number.
- odd + odd + odd = odd. Since 12 is even: **0 ways**

**Exp. 17:** Distributing 12 chocolates among 3 kids, each gets even number.
- [0,0,12], [0,2,10], [0,4,8], [0,6,6]: $3+6+6+3 = 18$
- [2,2,8], [2,4,6]: $3+6 = 9$
- [4,4,4]: 1
- Total: $18 + 9 + 1 = 28$

**Exp. 18:** Distributing 12 chocolates among 3 kids, at least one gets more than 6.
- Any one kid gets more than 6: $^3C_1 \times \frac{(5+2)!}{5! \times 2!} = 3 \times 21 = 63$
- Any two kids get more than 6: 0 (need 14 chocolates)
- Total: 63

**Exp. 19:** Distributing 12 chocolates among 3 kids, at least one gets more than 4.
- $^3C_1 \times \frac{(7+2)!}{7! \times 2!} - ^3C_2 \times \frac{(2+2)!}{2! \times 2!} = 3 \times 36 - 3 \times 6 = 108 - 18 = 90$
- **Alternative:** Total 91 - (4,4,4) = 90

**Exp. 20:** Distributing 12 chocolates among 3 kids, at least one gets more than 2.
- $^3C_1 \times \frac{(9+2)!}{9! \times 2!} - ^3C_2 \times \frac{(6+2)!}{6! \times 2!} + ^3C_3 \times \frac{(3+2)!}{3! \times 2!} = 165 - 84 + 10 = 91$
- **Alternative:** Total unrestricted = 91. None gets more than 2: 0. Answer: 91

**Exp. 21:** Distributing 12 chocolates among 3 kids, none gets more than 6.
- Total: 91 - 63 = 28

**Exp. 22:** Distributing 12 chocolates among 3 kids, none gets less than 1 and more than 6.
- Total with each ≥ 1: 55
- At least one > 6: $^3C_1 \times \frac{(3+2)!}{3! \times 2!} = 3 \times 10 = 30$
- Answer: $55 - 30 = 25$

**Exp. 23:** Distributing at most 12 chocolates among 3 kids.
- Add dummy variable Y: $a + b + c + Y = 12$
- ${}^{12+4-1}C_{4-1} = {}^{15}C_3 = 455$

**Exp. 24:** Distributing at least 6 and at most 12 chocolates among 3 kids.
- At most 12: 455
- At most 5: ${}^{5+4-1}C_{4-1} = {}^8C_3 = 56$
- Answer: $455 - 56 = 399$

---

## 12. Algebraic Properties

### 12.1 For equation $x_1 + x_2 + x_3 + \dots + x_r = n$ (Source: PDF 1055)

**Property 1:** If $x_i \ge 0$: ${}^{n+r-1}C_{r-1}$

**Property 2:** If $x_i \ge 1$: ${}^{n-1}C_{r-1}$

**Property 3:** If $m \le x_i \le k$: Coefficient of $x^n$ in $(x^m + x^{m+1} + \dots + x^k)^r$

**Property 4:** If $a_1 \le x_1 \le b_1, \dots, a_r \le x_r \le b_r$: Coefficient of $x^n$ in the product of polynomials.

### 12.2 For inequation $x_1 + x_2 + \dots + x_r \le n$

**Property 5:** If $x_i \ge 0$: Add dummy variable $x_{r+1}$:
$${}^{n+r}C_r$$

### 12.3 For equation $|x_1| + |x_2| + \dots + |x_m| = n$

**Property 6:** $|a| + |b| = n$: **4n**

**Property 7:** $|a| + |b| + |c| = n$: **$4n^2 + 2$**

**Property 8:** $|a| + |b| + |c| + |d| = n$: **$\frac{8n}{3}(n^2 + 2)$**

### 12.4 Number of terms in expansions

**Property 9:** $(x + y)^n$: $n + 1$

**Property 10:** $(a_1 + a_2 + \dots + a_n)^m$: ${}^{m+n-1}C_{n-1}$

**Property 11:** $(1 + x + x^2 + \dots + x^n)^m$: $(m \cdot n) + 1$

### 12.5 Worked Examples (Source: PDF 1065-1067)

**Exp. 25:** Two dice thrown, sum not less than 5 and not more than 10.
- Transform: $3 \le a+b \le 8$, where $a, b \in \{0, 1, \dots, 6\}$
- Sum 3: 4; Sum 4: 5; Sum 5: 6; Sum 6: 7; Sum 7: 6 (8-2); Sum 8: 5 (9-4)
- Total: $4 + 5 + 6 + 7 + 6 + 5 = 33$

**Exp. 26:** Three dice thrown, sum not less than 5 and not more than 15.
- Transform: $2 \le a+b+c \le 12$, where $a, b, c \in \{0, 1, \dots, 6\}$
- Sum 2: 6; Sum 3: 10; Sum 4: 15; Sum 5: 21; Sum 6: 28; Sum 7: 33; Sum 8: 36; Sum 9: 37; Sum 10: 36; Sum 11: 33; Sum 12: 28
- Total: $6 + 10 + 15 + 21 + 2(28 + 33 + 36) + 37 = 283$

**Exp. 27:** Integral solutions of $|x| + |y| = 12$.
- Case I (neither zero): $x + y = 10$; $x, y \ge 0$ → 11 solutions × 4 sign combos = 44
- Case II (one zero): 4 solutions
- Total: $44 + 4 = 48$

**Exp. 28:** Integral solutions of $|x| + |y| \le 12$.
- $1 + 4 + 8 + \dots + 48 = 1 + 4(1 + 2 + \dots + 12) = 313$

**Exp. 29:** Integral solutions of $|x| + |y| + |z| = 12$.
- Using formula: $4(12^2) + 2 = 578$

**Exp. 30:** 3-digit numbers where sum of digits is 12.
- $a + b + c = 12$; $a \ge 1, b \ge 0, c \ge 0$
- Transform: $a + b + c = 11$; $a \ge 0$: ${}^{13}C_2 = 78$

**Exp. 31:** 3-digit numbers where sum of digits is not more than 12.
- $1 + 3 + 6 + \dots + 78 = 364$

**Exp. 32:** Number of terms in $(x+y)^n$: $n+1$

**Exp. 33:** Total number of terms in $(a+b+c)^2$: 6

**Exp. 34:** Total number of terms in $(1 + x + x^2)^3$: 7

**Exp. 35:** Coefficient of $a^2b^3c^5$ in $(x+y+z)^{10}$: $\frac{10!}{2!3!5!}$

---

## 13. Derangement

### 13.1 Definition
A **derangement** is a rearrangement where no object remains in its original position.

### 13.2 Formulas (Source: PDF 1070)

**Formula (i):** Number of ways exactly r letters are in wrong envelopes out of n:
$$^nP_r \left[1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + (-1)^r \frac{1}{r!}\right]$$

**Formula (ii):** Number of ways all n letters are in wrong envelopes (Derangement, $!n$):
$$n! \left[1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + (-1)^n \frac{1}{n!}\right]$$

### 13.3 Worked Examples (Source: PDF 1070)

**Q1:** All 6 letters in wrong envelopes.
- $!6 = 6! \left[1 - 1 + \frac{1}{2} - \frac{1}{6} + \frac{1}{24} - \frac{1}{120} + \frac{1}{720}\right] = 265$

**Q2:** 6 letters, exactly 2 correctly placed.
- $^6C_2 \times !4 = 15 \times 9 = 135$

**Q3:** 6 letters, at least 2 correctly placed.
- $^6C_2 \times !4 + ^6C_3 \times !3 + ^6C_4 \times !2 + ^6C_5 \times !1 + ^6C_6 \times !0 = 135 + 40 + 15 + 0 + 1 = 191$

**Q4:** Non-zero integer N when $a \neq 1, b \neq 2, \dots, f \neq 6$.
- Same as derangement of 6: 265

---

## 14. Number Properties

### 14.1 Formulas (Source: PDF 1070-1071)

If $N = a^p \cdot b^q \cdot c^r \dots$ (a, b, c are distinct primes):

1. **Total Number of Factors:** $(p+1)(q+1)(r+1)\dots$
2. **Sum of Factors:** $\left[\frac{a^{p+1} - 1}{a-1}\right] \times \left[\frac{b^{q+1} - 1}{b-1}\right] \times \dots$
3. **Product of Factors:** $N^{\frac{1}{2} \times \text{Total Factors}}$
4. **Total Number of Odd Factors:** $(p+1)(q+1)(r+1)\dots$ (exponents of odd primes only)
5. **Total Number of Even Factors:** Total Factors - Odd Factors
6. **Number of Co-primes to N (less than N):** $N \times \left(1 - \frac{1}{a}\right) \times \left(1 - \frac{1}{b}\right) \times \dots$
7. **Sum of Co-primes to N (less than N):** $\frac{N}{2} \times \text{Number of Co-primes}$
8. **Ways to write N as product of two co-primes:** $2^{n-1}$ (n = number of distinct prime factors)
9. **Ways to express N as product of two factors:**
   - If N is not a perfect square: $\frac{\text{Total Factors}}{2}$
   - If N is a perfect square:
     - Distinct factors: $\frac{\text{Total Factors} - 1}{2}$
     - Including similar factors: $\frac{\text{Total Factors} + 1}{2}$
10. **Ordered pairs (x, y) such that LCM(x, y) = N:** $(2p+1)(2q+1)(2r+1)\dots$

### 14.2 Worked Examples (Source: PDF 1071)

**Exp 1:** 72 = $2^3 \times 3^2$. Factors = $(3+1)(2+1) = 12$.

**Exp 2:** Sum of factors of 72 = $\left[\frac{2^4-1}{2-1}\right] \times \left[\frac{3^3-1}{3-1}\right] = 15 \times 13 = 195$.

**Exp 3:** Product of factors of 72 = $72^{12/2} = 72^6$.

**Exp 4:** Odd factors of 72 = $(2+1) = 3$ (1, 3, 9).

**Exp 5:** Even factors of 72 = $12 - 3 = 9$.

**Exp 6:** Co-primes to 72 less than 72 = $72 \times \frac{1}{2} \times \frac{2}{3} = 24$.

**Exp 7:** Sum of co-primes of 24 = $\frac{24}{2} \times 8 = 96$.

**Exp 8:** Ways to write 60 as product of two co-primes: 60 = $2^2 \times 3 \times 5$. n = 3. Ways = $2^{3-1} = 4$.

**Exp 9:** 36 is a perfect square. Distinct factor pairs = $\frac{9-1}{2} = 4$. Including similar = $\frac{9+1}{2} = 5$.

**Exp 10:** Ordered pairs for LCM = 72 = $(2 \times 3 + 1)(2 \times 2 + 1) = 7 \times 5 = 35$.

---

## 15. Geometrical Properties

### 15.1 Key Formulas (Source: PDF 1071-1072)

**(i) n points, no three collinear:**
- Lines: $^nC_2$
- Triangles: $^nC_3$
- Quadrilaterals: $^nC_4$
- k-sided polygons: $^nC_k$
- Diagonals in n-sided polygon: $^nC_2 - n$

**(ii) n points, m collinear:**
- Lines: $^nC_2 - ^mC_2 + 1$
- Triangles: $^nC_3 - ^mC_3$
- k-sided polygons: $^nC_k - ^mC_k$

**(iv) Regions:**
- n lines divide plane: $\frac{n^2 + n + 2}{2}$
- n circles divide plane: $n(n-1) + 2$
- n ellipses divide plane: $2n(n-1) + 2$
- n planes divide space: $\frac{n^3 + 5n + 6}{6}$

**(vi) Squares/Rectangles:**
- Squares in n×n square: $\frac{n(n+1)(2n+1)}{6}$
- Rectangles in n×n square: $\left[\frac{n(n+1)}{2}\right]^2$
- Rectangles in m×n rectangle: $\left[\frac{m(m+1)}{2}\right] \times \left[\frac{n(n+1)}{2}\right]$
- Quadrilaterals from m parallel lines intersecting n parallel lines: $^mC_2 \times ^nC_2$

**(viii) Regular Polygon:**
- Triangles with no side common: $\frac{n(n-4)(n-5)}{6}$
- Triangles with at least one side common: $n(n-3)$

### 15.2 Worked Examples (Source: PDF 1072-1075)

**Q1-2:** 4 non-collinear points.
- Lines = $^4C_2 = 6$
- Triangles = $^4C_3 = 4$

**Q3-6:** 10 points, no three collinear.
- Lines = $^{10}C_2 = 45$
- Triangles = $^{10}C_3 = 120$
- Hexagons = $^{10}C_6 = 210$
- Diagonals in decagon = $^{10}C_2 - 10 = 35$

**Q7-10:** 15 points on a circle.
- Lines = $^{15}C_2 = 105$
- Triangles = $^{15}C_3 = 455$
- Quadrilaterals = $^{15}C_4 = 1365$
- Octagons = $^{15}C_8 = 6435$

**Q11-14:** 12 points, 4 collinear.
- Lines = $^{12}C_2 - ^4C_2 + 1 = 66 - 6 + 1 = 61$
- Triangles = $^{12}C_3 - ^4C_3 = 220 - 4 = 216$
- Quadrilaterals = $^{12}C_4 - ^4C_4 = 495 - 1 = 494$
- Hexagons = $^{12}C_6 = 924$

**Q19:** Diagonals in heptagon = $^7C_2 - 7 = 14$

**Q20:** Diagonals in n-sided polygon = $^nC_2 - n = \frac{n(n-3)}{2}$

**Q21:** Polygon with 54 diagonals: $\frac{n(n-3)}{2} = 54 \rightarrow n = 12$

**Q22:** 9 points, m collinear, 28 triangles.
- $^9C_3 - ^mC_3 = 28 \rightarrow ^mC_3 = 56 \rightarrow m = 8$

**Q23:** 2 points on one line, 8 on another.
- Total triangles = $^{10}C_3 - ^2C_3 - ^8C_3 = 120 - 0 - 56 = 64$

**Q25:** 20 lines, max intersections = $^{20}C_2 = 190$

**Q26:** m parallel lines intersected by n parallel lines, parallelograms = $^mC_2 \times ^nC_2 = \frac{mn(m-1)(n-1)}{4}$

**Q28:** 6 lines, max regions = $\frac{6^2 + 6 + 2}{2} = 22$

**Q29:** 22 regions, min lines: $\frac{n^2 + n + 2}{2} = 22 \rightarrow n = 6$

**Q32:** 8 cuts, max pieces = $\frac{8^2 + 8 + 2}{2} = 37$

**Q33:** 20 pieces, min cuts: $\frac{n^2 + n + 2}{2} \ge 20 \rightarrow n = 6$

**Q36:** 15 Cheesers needed. Bounded regions = $\frac{n^2 - 3n + 2}{2} \ge 15 \rightarrow n = 7$

**Q39:** 6 circles, max regions = $6^2 - 6 + 2 = 32$

**Q40:** 5 ovals, max regions = $2 \times 5 \times 4 + 2 = 42$

**Q43:** 6 cuts, max pieces = $\frac{6^3 + 5 \times 6 + 6}{6} = 42$

**Q44:** 300 pieces, min cuts: $\frac{n^3 + 5n + 6}{6} \ge 300 \rightarrow n = 12$

**Q48:** Squares in 10×10 square = $\frac{10 \times 11 \times 21}{6} = 385$

**Q49:** Rectangles in 10×10 square = $\left[\frac{10 \times 11}{2}\right]^2 = 3025$

**Q50:** Squares in 8×15 rectangle.
- $8 \times 15 + 7 \times 14 + 6 \times 13 + 5 \times 12 + 4 \times 11 + 3 \times 10 + 2 \times 9 + 1 \times 8 = 456$

**Q51:** Rectangles in 8×15 rectangle = $\left[\frac{8 \times 9}{2}\right] \times \left[\frac{15 \times 16}{2}\right] = 36 \times 120 = 4320$

**Q54:** Quadrilaterals from 8 and 15 parallel lines = $^8C_2 \times ^{15}C_2 = 2940$

**Q57:** Squares on chessboard = $\frac{8 \times 9 \times 17}{6} = 204$

**Q58:** Rectangles on chessboard = $\left[\frac{8 \times 9}{2}\right]^2 = 1296$

**Q61:** 3×3 grid, shortest paths = $\frac{(3+3-2)!}{(3-1)!(3-1)!} = \frac{4!}{2!2!} = 6$

**Q66:** Triangles in a pentagon with all vertices joined = 35

---

## 16. Fast CAT Methods & Decision Rules

### 16.1 Decision Tree

```
Is order important?
├── YES → Permutation
│   ├── All objects distinct?
│   │   ├── YES → Use ^nP_r or n!
│   │   └── NO → Divide by factorials of repetitions
│   ├── Circular arrangement?
│   │   ├── YES → (n-1)! or (n-1)!/2 for necklace
│   │   └── NO → Linear arrangement
│   └── Repetition allowed?
│       ├── YES → n^r
│       └── NO → ^nP_r
│
└── NO → Combination
    ├── Objects identical?
    │   ├── YES → 1 way (or use stars and bars for distribution)
    │   └── NO → ^nC_r
    ├── Distribution to distinct people?
    │   ├── YES → Multiply by appropriate factorial
    │   └── NO → Divide by factorial of equal groups
    └── Constraints?
        ├── At least → Total - Complement
        ├── At most → Sum of cases
        └── Never together → Total - Together
```

### 16.2 Fast Methods

1. **"At least one" problems:** Use $2^n - 1$ for selection from n distinct items.
2. **"Never together" problems:** Total arrangements - arrangements where they are together.
3. **"Exactly two together" vs "at least two together":** Count carefully — "exactly two" excludes all three together.
4. **Dictionary ranking:** Count words before the given word alphabetically, then add 1.
5. **Sum of all numbers formed:** $(n-1)! \times (\text{sum of digits}) \times (111\dots n \text{ times})$
6. **Stars and Bars:** For $x_1 + x_2 + \dots + x_r = n$ with $x_i \ge 0$: ${}^{n+r-1}C_{r-1}$
7. **Inequality to equality:** Add a dummy variable.
8. **Upper bounds:** Use inclusion-exclusion.
9. **"At least one gets more than k":** Give k+1 to one person, distribute the rest, use inclusion-exclusion.
10. **Coefficient method:** For bounded distributions, find coefficient of $x^n$ in the generating function.

---

## 17. Common Traps & How to Avoid Them

| Trap | Example | Correct Approach |
|------|---------|------------------|
| Zero at leftmost position | 4-digit numbers from 0,2,3,5 | First digit ≠ 0: $3 \times 3 \times 2 \times 1$ |
| "At most" vs "at least" | At most 4 vs at least 4 | Sum appropriate range of combinations |
| "Never together" | R and W never together | Total - Together |
| Circular arrangements | 6 boys in a ring | $(6-1)!$ not $6!$ |
| Necklace/garland | 6 beads in necklace | Divide by 2 (flip symmetry) |
| Identical objects | COMMITTEE | Divide by factorial of repetition count |
| Dictionary ranking | Rank of RAINBOW | Alphabetical order first, then count |
| "Exactly two together" | Exactly 2 vowels together | Exclude all 3 together |
| Division vs Distribution | 4 articles into 2 groups vs 2 girls | Multiply by 2! for distinct recipients |
| Equal group sizes | 12 CDs into 2 equal groups | Divide by 2! for indistinguishable groups |
| Upper bound too small | $a+b+c = 8$, $0 \le a,b,c \le 2$ | Max sum = 6 < 8, so 0 solutions |
| "At least one" from identical | Select at least 1 from 10 identical | 10 ways, not $2^{10} - 1$ |

---

## 18. Timed Strategy for CAT

### 18.1 Time Allocation (per question)

| Difficulty | Time | Strategy |
|------------|------|----------|
| Easy (direct formula) | 30-45 sec | Identify formula, plug in, solve |
| Medium (1-2 constraints) | 1-1.5 min | Break into cases, use complement |
| Hard (multiple constraints) | 2-3 min | Systematic case analysis, inclusion-exclusion |
| Very Hard (advanced) | Skip or 3+ min | Look for shortcuts, verify with small cases |

### 18.2 Question-Solving Protocol

1. **Read carefully:** Identify if order matters (permutation vs combination).
2. **Identify object types:** Distinct vs identical.
3. **Identify constraints:** At least, at most, never, always, together, not together.
4. **Choose method:**
   - Direct formula
   - Complement (Total - Unwanted)
   - Case analysis
   - Inclusion-Exclusion
   - Generating function (coefficient method)
5. **Verify with small case:** If n is small, test with a smaller value.
6. **Check for traps:** Zero at leftmost, identical objects, circular arrangements.

### 18.3 Priority Order for CAT

1. **Direct formula questions** (highest priority — quick marks)
2. **Complement problems** (fast if total is easy to compute)
3. **Case analysis** (medium speed, be systematic)
4. **Inclusion-Exclusion** (slower, but powerful)
5. **Generating functions** (use only if comfortable)

---

## 19. Final Revision Sheet

### 19.1 Core Formulas

| Concept | Formula |
|---------|---------|
| Permutation | $^nP_r = \frac{n!}{(n-r)!}$ |
| Combination | $^nC_r = \frac{n!}{r!(n-r)!}$ |
| Circular permutation | $(n-1)!$ |
| Necklace/garland | $\frac{(n-1)!}{2}$ |
| Permutations with repetition | $\frac{n!}{p!q!r!}$ |
| Permutations with repetition allowed | $n^r$ |
| Identical to r persons (any number) | ${}^{n+r-1}C_{r-1}$ |
| Identical to r persons (at least 1) | ${}^{n-1}C_{r-1}$ |
| Non-negative solutions | ${}^{n+r-1}C_{r-1}$ |
| Positive solutions | ${}^{n-1}C_{r-1}$ |
| Inequality (≤ n) | ${}^{n+r}C_r$ |
| $|a| + |b| = n$ | $4n$ |
| $|a| + |b| + |c| = n$ | $4n^2 + 2$ |
| Derangement | $n!\left[1 - \frac{1}{1!} + \frac{1}{2!} - \dots + (-1)^n\frac{1}{n!}\right]$ |
| Total factors of $a^p b^q c^r$ | $(p+1)(q+1)(r+1)$ |
| Diagonals of n-gon | $\frac{n(n-3)}{2}$ |
| Regions by n lines | $\frac{n^2 + n + 2}{2}$ |
| Squares in n×n | $\frac{n(n+1)(2n+1)}{6}$ |
| Rectangles in n×n | $\left[\frac{n(n+1)}{2}\right]^2$ |
| k non-consecutive from n in row | ${}^{n-k+1}C_k$ |
| k consecutive from n in row | $n - k + 1$ |
| k consecutive from n in circle | $n$ (if $k < n$) |

### 19.2 Key Identities

1. $^nC_r = ^nC_{n-r}$
2. $^nC_{r-1} + ^nC_r = {}^{n+1}C_r$
3. $^nC_0 + ^nC_1 + \dots + ^nC_n = 2^n$
4. $^nC_0 + ^nC_2 + ^nC_4 + \dots = 2^{n-1}$
5. $^nC_1 + ^nC_3 + ^nC_5 + \dots = 2^{n-1}$
6. $^rC_r + {}^{r+1}C_r + \dots + ^nC_r = {}^{n+1}C_{r+1}$ (Hockey-stick)
7. $1 + 3 + 6 + \dots + \frac{n(n+1)}{2} = \frac{n(n+1)(n+2)}{6}$

### 19.3 Decision Checklist

- [ ] Order matters? → Permutation
- [ ] Objects identical? → Divide by factorials
- [ ] Circular? → $(n-1)!$
- [ ] Necklace? → Divide by 2
- [ ] Repetition allowed? → $n^r$
- [ ] At least one? → $2^n - 1$ or complement
- [ ] Never together? → Total - Together
- [ ] Distribution to distinct people? → Multiply by factorial
- [ ] Equal groups? → Divide by factorial of group count
- [ ] Upper bounds? → Inclusion-Exclusion
- [ ] Inequality? → Add dummy variable
- [ ] Zero at leftmost? → Exclude

### 19.4 Quick Reference: Common Values

- $2^5 = 32$, $2^6 = 64$, $2^7 = 128$, $2^8 = 256$, $2^9 = 512$, $2^{10} = 1024$
- $3^4 = 81$, $3^5 = 243$, $3^6 = 729$
- $4^3 = 64$, $4^4 = 256$, $4^5 = 1024$
- $5^3 = 125$, $5^4 = 625$
- $6^3 = 216$, $6^4 = 1296$
- $7^3 = 343$
- $8^3 = 512$
- $9^3 = 729$
- $5! = 120$, $6! = 720$, $7! = 5040$, $8! = 40320$, $9! = 362880$, $10! = 3628800$
- $^5C_2 = 10$, $^6C_2 = 15$, $^7C_2 = 21$, $^8C_2 = 28$, $^9C_2 = 36$, $^{10}C_2 = 45$
- $^5C_3 = 10$, $^6C_3 = 20$, $^7C_3 = 35$, $^8C_3 = 56$, $^9C_3 = 84$, $^{10}C_3 = 120$
- $^6C_4 = 15$, $^7C_4 = 35$, $^8C_4 = 70$, $^9C_4 = 126$, $^{10}C_4 = 210$

---

*This note is based on Quantitative Aptitude Quantum CAT by Sarvesh K. Verma, Chapter 19: Permutations & Combinations.*
