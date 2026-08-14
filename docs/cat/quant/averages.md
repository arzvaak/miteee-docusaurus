---
title: "CAT Quant — Averages"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 2
topic: "averages"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Averages — Complete CAT Quant Study Notes

## Concept Map

```
                        AVERAGES
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   Basic Properties    Advanced Methods    Applications
        │                   │                   │
   ┌────┼────┐        ┌─────┼─────┐        ┌────┼────┐
   │    │    │        │     │     │        │    │    │
  Range Shift  Weighted  Assumed  Alligation  Age  Speed  Income
  Bound (K)   Average   Average  Method     Problems      Problems
```

---

## 1. Foundations

### Definition (p. 219)

The **average** (arithmetic mean) of a set of $n$ values is the central value obtained by dividing the sum of all values by the number of values.

$$\text{Average} = \frac{x_1 + x_2 + x_3 + \ldots + x_n}{n}$$

**Example:** Heights of 90 cm, 110 cm, 115 cm → Average $= \frac{90+110+115}{3} = 105$ cm

---

## 2. Core Properties of Averages (pp. 219–221)

### Property 1: Average Lies Between Extremes

If $x_l$ and $x_h$ are the lowest and highest values, then:

$$x_l < \text{Average} < x_h \quad \text{(when } x_l \neq x_h\text{)}$$

**CAT Application:** Eliminate options outside the data range before calculating.

**Example (p. 219):** Average of 8, 9, 12, 13, 15, 9 → options (b) 6, (c) 16, (d) 18 are invalid (out of range 8–15); answer is (a) 11.

---

### Property 2: Adding K to Each Quantity

If $K$ is added to every value, the average increases by $K$.

$$\text{New average} = \text{Old average} + K$$

**Example (p. 220):** TV sets 20, 30, 60, 80, 50 → average = 48. If each shop imports 12 more: new average $= 48 + 12 = 60$

**Verification:** $\frac{240 + (5 \times 12)}{5} = 48 + 12 = 60$

---

### Property 3: Subtracting K from Each Quantity

If $K$ is subtracted from every value, the average decreases by $K$.

$$\text{New average} = \text{Old average} - K$$

**Example (p. 220):** Family sizes 7, 8, 10, 13, 6, 10 (avg = 9); 1 member leaves each → new average $= 9 - 1 = 8$

---

### Property 4: Multiplying Each Quantity by K

If every value is multiplied by $K$, the average is multiplied by $K$.

$$\text{New average} = K \times \text{Old average}$$

**Example (p. 220):** 6 flowers per bouquet, doubled → new average $= 6 \times 2 = 12$

---

### Property 5: Dividing Each Quantity by K

If every value is divided by $K$ ($K \neq 0$), the average is divided by $K$.

$$\text{New average} = \frac{\text{Old average}}{K}$$

**Example (p. 220):** Average of 100, 200, ..., 1000 = 550; divided by 5 → new average $= 110$

---

### Property 6: Surplus = Deficit (p. 220)

The total surplus above the average equals the total deficit below the average.

$$\sum (A - x_i) = \sum (y_j - A)$$

where $x_i$ are values below average and $y_j$ are values above average.

**Example (p. 221):** Salaries ₹8000, ₹5000, ₹11000, ₹7000, ₹9000 → average ₹8000
- Surplus: 11000 + 9000 = 20000
- Deficit: 5000 + 7000 = 12000

---

### Property 7: Weighted Average (p. 221)

$$\text{Weighted average} = \frac{K_1 A_1 + K_2 A_2 + K_3 A_3 + \dots + K_n A_n}{K_1 + K_2 + K_3 + \dots + K_n}$$

Where:
- $K_i$ = number of elements in group $i$
- $A_i$ = average of group $i$

**Example (p. 221):** 12 employees at ₹18000 + 15 employees at ₹16000

$$\text{Weighted avg} = \frac{12 \times 18000 + 15 \times 16000}{27} = \frac{456000}{27} = ₹16888.88$$

---

### Property 8: Age Problems (pp. 221–222)

**Key Rules:**
- (i) $K$ years back, average age $= (x - K)$ years (no births/deaths)
- (ii) $K$ years later, average age $= (x + K)$ years

**Example (p. 222):** 5 members, average 35 three years ago; baby born 1 year ago

- 3 years ago total = 175
- At baby's birth: $175 + (2 \times 5) = 185$
- Present: $185 + (1 \times 6) = 191$
- 3 years hence: $\frac{191 + 3 \times 6}{6} = 34\frac{5}{6}$ years

---

### Property 9: Income/Salary Problems (pp. 222–223)

**Key Identity:** Income = Expenditure + Savings

**Example (p. 223):** 60 employees, avg ₹12000; executives = 2× non-executives; non-executive avg = 2/5 of executive avg

$$60 \times 12000 = 20x + 40 \times \frac{5}{2}x \implies x = 6000$$

Answer: ₹6000

---

### Property 10: Time, Speed and Distance (pp. 223–224)

**Case 1: Equal distances at different speeds**

- Two equal distances at speeds $u$ and $v$: **Average speed $= \frac{2uv}{u+v}$**
- Three equal distances at speeds $u$, $v$, $w$: **Average speed $= \frac{3uvw}{uv + vw + wu}$**

> **NOTE (p. 223):** "In this type of questions the average speed is independent of the distance travelled."

**Case 2: Different distances at different speeds**

$$\text{Average speed} = \frac{x_1 + x_2 + x_3 + \dots}{\frac{x_1}{u} + \frac{x_2}{v} + \frac{x_3}{w} + \dots}$$

**Example (p. 223):** 40 km/hr and 60 km/hr → $\frac{2 \times 40 \times 60}{100} = 48$ km/hr

---

### Property 11: Overlapping Element (p. 224)

**Formulas:**
- (i) If $a+b = k$, $b+c = l$, $a+b+c = m$ → **$b = k + l - m$**
- (ii) If $a+b = k$, $d+e = l$, $a+b+c+d+e = m$ → **$c = m - (k + l)$**

**Example (p. 224):** 11 players, avg 50 kg; 6 lightest avg 49; 6 heaviest avg 52

$$F = 294 + 312 - 550 = 56 \text{ kg}$$

---

### Property 12: Average of Important Series (p. 224)

| Series | Average |
|--------|---------|
| First $n$ natural numbers | $\frac{n+1}{2}$ |
| First $n$ even numbers | $(n+1)$ |
| First $n$ odd numbers | $n$ |
| $p$ elements avg $r$, $q$ elements avg $s$ | $\frac{pr + sq}{p+q}$ |

---

## 3. Fast CAT Methods

### Method 1: Assumed Average (p. 221)

> "This method is very helpful in Data Interpretation section where there are very large values to be calculated and most of the time we need just the lumpsum value." — **NOTE (p. 221)**

**Steps:**
1. Assume a convenient average (round number)
2. Calculate deviations (surplus/deficit) from assumed average
3. Net deviation ÷ number of values = correction factor
4. Actual average = Assumed average + Correction factor

**Example (p. 221):** Average of 13, 17, 25, 11, 26, 10

- Assume average = 20
- Deficits: 7 + 3 + 9 + 10 = 29
- Surpluses: 5 + 6 = 11
- Net = 11 − 29 = −18; variation = −18/6 = −3
- Actual average = 20 + (−3) = **17**

---

### Method 2: Alligation Method (p. 237, Q20)

For two-group weighted average problems:

$$\frac{\text{Group 1}}{\text{Group 2}} = \frac{\text{Avg}_2 - \text{Overall Avg}}{\text{Overall Avg} - \text{Avg}_1}$$

**Example (p. 237):** Junior:Senior = 5:7 → fraction = 5/12

---

### Method 3: Replacement Problems

**Key Formula:** Change in total $= n \times$ change in average

**Example (p. 236):** 20 students avg 45; new student 40 kg replaces old; avg decreases by 1

- Total change = 20 × 1 = 20 kg decrease
- Replaced student = 40 + 20 = **60 kg**

---

### Method 4: LCM Method for Speed Problems (p. 239)

**Example:** Train halts; speed reduces 60→50 km/hr

- LCM of 60 and 50 = 300 km
- Time @ 60 km/hr = 300/60 = 5 hrs
- Time @ 50 km/hr = 300/50 = 6 hrs
- Extra 1 hour = stopping time in 6 hours
- Halts per hour = 1/6 hr = **10 minutes**

**Shortcut:** Halting time $= \left(1 - \frac{\text{slower}}{\text{faster}}\right)$ hours $= 1 - \frac{50}{60} = \frac{10}{60}$ hr $= 10$ min

---

### Method 5: Equidistant Property

If two numbers are equidistant from a reference point, their average equals that reference point.

**Example (p. 229):** 8x is as much above 270 as x is below 270

$$270 - x = 8x - 270 \implies x = 60, \quad 8x = 480$$

Average of 60 and 480 = **270**

---

## 4. Worked Examples (Easy to Advanced)

### Example 1: Basic Average (p. 219)

**Problem:** Find the average of 90, 110, 115.

**Solution:**
$$\text{Average} = \frac{90 + 110 + 115}{3} = \frac{315}{3} = 105 \text{ cm}$$

---

### Example 2: Property Application (p. 220)

**Problem:** Average shirts = 60, each buys 6 more. Find new average.

**Solution:** New average $= 60 + 6 = 66$ (Property 2)

---

### Example 3: Weighted Average (p. 221)

**Problem:** Students 30, 40, 60 with ages 22, 21, 25. Find average age.

**Solution:**
$$\frac{30 \times 22 + 40 \times 21 + 60 \times 25}{130} = \frac{3000}{130} = 23\frac{1}{13} \text{ years}$$

---

### Example 4: Age Problem with Birth (p. 222)

**Problem:** 5 members, average 35 three years ago; baby born 1 year ago. Find average 3 years hence.

**Solution:**
- 3 years ago total = 175
- At baby's birth: $175 + (2 \times 5) = 185$
- Present: $185 + (1 \times 6) = 191$
- 3 years hence: $\frac{191 + 3 \times 6}{6} = \frac{209}{6} = 34\frac{5}{6}$ years

---

### Example 5: Average Speed (p. 223)

**Problem:** Mathura→Gokul at 40, Gokul→Brindaban at 10, return at 24. Find average speed for round trip.

**Solution:**
- Mathura→Brindaban: $\frac{2 \times 40 \times 10}{50} = 16$ km/hr
- Round trip: $\frac{2 \times 16 \times 24}{40} = 19.2$ km/hr

---

### Example 6: Overlapping Element (p. 224)

**Problem:** Mon+Tue+Wed avg 30; Wed+Thu+Fri+Sat avg 28; all 6 days avg 27. Find Wednesday's value.

**Solution:**
$$W = (30 \times 3) + (28 \times 4) - (27 \times 6) = 202 - 162 = 40$$

---

### Example 7: Replacement Problem (p. 236)

**Problem:** 11 players, avg increases by 1 when 55 kg player replaced. Find new player's weight.

**Solution:** New player $= 55 + 11 = 66$ kg

---

### Example 8: Complex Age Problem (p. 222)

**Problem:** 25 teachers, average 45 ten years ago; principal retired 4 years ago at 60; new principal (54) joined 3 years ago. Find present average.

**Method 1 (Step-by-step):**
- 10 yrs ago avg 45 → 4 yrs ago avg 51, total 1275
- After retirement: 1215
- 1 yr later: 1239
- After new principal: 1293
- Present: 1293 + 75 = 1368
- Average = 1368/25 = $54\frac{18}{25}$

**Method 2 (Alternative):**
- If no retirement, present avg = 55, total = 1375
- New principal was 7 years younger than old would have been
- 1375 − 7 = 1368

---

### Example 9: Speed-Distance Graph (p. 233)

Refer to `images/page-0233-img-0.jpg` for the speed-distance graph.

**Q16:** Average speed for first 200 km = 24 km/hr

**Q17:** Average speed for first 150 km = (d) none of these

---

### Example 10: Advanced — Faculty Age Table (p. 234)

**English Faculty:**

| Year | Faculty | Avg | Total |
|------|---------|-----|-------|
| 2004 | 5 | 50.2 | 251 |
| 2005 | 4 | 49 | 196 |
| 2006 | 5 | 45 | 225 |
| 2007 | 5 | 46 | 230 |

**Q24:** New member joined English faculty in **2006** (avg dropped from 49 to 45 with 5→6 members)

---

## 5. Decision Rules

| Scenario | Method to Use |
|----------|---------------|
| Large values in DI | Assumed average method |
| Two groups with known averages | Weighted average formula |
| Two groups, need ratio | Alligation method |
| Equal distances, different speeds | Harmonic mean formula |
| Replacement changes average | Change in total = n × change in avg |
| Overlapping sets | $b = k + l - m$ |
| Age shifts with time | Average shifts by exactly K years |
| Series of consecutive numbers | Use series average formulas |
| Speed problems with halts | LCM method |
| Three-digit reversal | Difference = 99(a − c) |

---

## 6. Common Traps

### Trap 1: Data Insufficiency (p. 223)

**Example (Ex. 21):** Average salary of A, B, C = ₹10000; average expenditure of A = ₹6000 → **Can't be determined** (data insufficient)

### Trap 2: Two Unknowns (p. 223)

**Example (Ex. 23):** 60 employees, avg ₹12000; executives = 2× non-executives → **Can't be determined** (two unknowns)

### Trap 3: Average Speed Independence (p. 223)

For equal distances, average speed doesn't depend on the distance value.

### Trap 4: Multiple Valid Solutions (p. 230)

**Example (Q28):** Average of 1 to n, one number missed, average = 15 → Multiple solutions possible → Answer: (d) not unique

### Trap 5: Option Elimination First (p. 219)

Always eliminate options outside the data range before calculating.

### Trap 6: Age Difference is Constant

The age difference between any two persons remains constant over time.

---

## 7. Timed Strategy

### Time Allocation (for 2-minute CAT problems)

| Phase | Time | Action |
|-------|------|--------|
| Read & Identify | 15 sec | Identify property/formula needed |
| Set up | 20 sec | Write equation or choose method |
| Calculate | 60 sec | Execute computation |
| Verify | 25 sec | Check reasonableness, units, options |

### Quick Checks

- **Sanity check:** Is the answer between min and max values?
- **Unit check:** Does the answer have correct units?
- **Option check:** Does the answer match one of the options exactly?

### Speed Techniques

1. **Eliminate before calculating** — use Property 1
2. **Assume average for large numbers** — especially in DI
3. **Use LCM for speed problems** — avoids fractions
4. **Test options** — for "which is possible" questions

---

## 8. Final Revision Sheet

### Formula Summary

| Concept | Formula |
|---------|---------|
| Basic average | $\frac{x_1 + x_2 + \ldots + x_n}{n}$ |
| Weighted average | $\frac{K_1 A_1 + K_2 A_2 + \ldots}{K_1 + K_2 + \ldots}$ |
| Two equal speeds | $\frac{2uv}{u+v}$ |
| Three equal speeds | $\frac{3uvw}{uv+vw+wu}$ |
| First n natural numbers | $\frac{n+1}{2}$ |
| First n even numbers | $n+1$ |
| First n odd numbers | $n$ |
| Overlapping element | $b = k + l - m$ |
| Replacement change | $n \times \Delta \text{avg}$ |
| Three-digit reversal | $99(a-c)$ |

### Key Properties Checklist

- [ ] Average lies between min and max
- [ ] Adding K to all → average +K
- [ ] Subtracting K from all → average −K
- [ ] Multiplying all by K → average ×K
- [ ] Dividing all by K → average ÷K
- [ ] Surplus = Deficit
- [ ] Age shifts by exactly elapsed time
- [ ] Average speed independent of distance (equal distances)

### Common Pitfalls to Avoid

1. Don't assume data sufficiency — check for missing information
2. Don't forget the distance independence property
3. Don't confuse weighted average with simple average
4. Don't forget to account for new members in age problems
5. Don't ignore the "cannot be determined" option

---

*End of Chapter 2: Averages*
