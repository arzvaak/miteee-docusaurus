---
title: "Assignment 01 - Load Characteristics and Line Parameters"
aliases:
  - PSA Assignment 01
tags:
  - power-system-analysis
  - assignment
  - week-1
source_pdf: "Assignment-01_solution_PSA.pdf"
math_syntax: typst
---

# Assignment 01 - Load Characteristics and Line Parameters

Source: [Assignment-01_solution_PSA.pdf](/content-assets/studies/power-system-analysis/Week%201/Assignment-01_solution_PSA.pdf)

Question images below are the supplied assignment questions, preserved as image embeds; each worked answer follows its question and uses native Typst math for Typst-Mate.

## Assignment Questions and Worked Solutions

### Assignment Q1
![Week 1 assignment question 1](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-01.png)

**Given:** Connected load = $200 " MW"$, Maximum demand = $120 " MW"$, Annual energy generated = $4.2 times 10^5 " MWhr"$.

**Average load:**

$$
P_("avg") = frac(4.2 times 10^5, 8760) = 47.945 " MW"
$$

**Load factor:**

$$
"LF" = frac(P_("avg"), "Maximum demand") = frac(47.945, 120) approx 0.40
$$

**Demand factor:**

$$
"DF" = frac("Maximum demand", "Connected load") = frac(120, 200) = 0.60
$$

**Correct option: (a)**

> **Exam trap:** The load factor and demand factor are easy to swap. Remember: load factor uses *average load / maximum demand*, while demand factor uses *maximum demand / connected load*. They are never the same unless coincidentally equal.


---

### Assignment Q2
![Week 1 assignment question 2](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-02.png)

**Given:** Plant rated capacity = $70 " MW"$. Hourly loads: $20 " MW"$ (6 h), $30 " MW"$ (2 h), $45 " MW"$ (4 h), $60 " MW"$ (4 h), $40 " MW"$ (4 h), $50 " MW"$ (4 h).

**Average load:**

$$
P_("avg") = frac(20 times 6 + 30 times 2 + 45 times 4 + 60 times 4 + 40 times 4 + 50 times 4, 24) = frac(960, 24) = 40 " MW"
$$

**Maximum demand** from the load profile $= 60 " MW"$.

**Load factor:**

$$
"LF" = frac(P_("avg"), "Max demand") = frac(40, 60) = 0.667
$$

**Plant capacity factor:**

$$
"PCF" = frac(P_("avg"), "Plant rated capacity") = frac(40, 70) = 0.571
$$

**Correct option: (c)**

> **Exam trap:** Do not confuse plant capacity factor (average / rated capacity) with load factor (average / maximum demand). When maximum demand < rated capacity, plant capacity factor < load factor.


---

### Assignment Q3
![Week 1 assignment question 3](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-03.png)

**Given load schedule:**

| Time | 6 AM – 8 AM | 8 AM – 10 AM | 10 AM – 2 PM | 2 PM – 6 PM | 6 PM – 6 AM |
|---|---|---|---|---|---|
| Load (kW) | 40 | 110 | 100 | 80 | 30 |

**Peak load demand on the power plant** = $110 " kW"$.

**Sum of individual maximum demands** = $50 + 40 + 20 + 30 = 140 " kW"$.

**Diversity factor:**

$$
"DF"_("div") = frac(sum "Individual max demands", "Peak of all loads") = frac(140, 110) = 1.2727
$$

**Coincident factor:**

$$
"CF" = frac(1, "Diversity factor") = frac(1, 1.2727) = 0.7857
$$

**Correct option: (c)**

> **Exam trap:** The coincidence factor is the *reciprocal* of the diversity factor, not the other way around. Diversity factor $>= 1$, while coincidence factor $<= 1$.


---

### Assignment Q4
![Week 1 assignment question 4](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-04.png)

**Given:** Peak demand = $80 " MW"$. Operating days = $365 - 50 = 315$ days. Load: $80 " MW"$ for 4 h and $40 " MW"$ for 6 h each working day.

**Energy supplied per working day:**

$$
E_("day") = (80 times 4) + (40 times 6) = 320 + 240 = 560 " MWhr"
$$

**Energy supplied per year:**

$$
E_("year") = 560 times 315 = 176(,)400 " MWhr"
$$

**Annual load factor:**

$$
"LF" = frac(E_("year"), "Max demand" times 8760) = frac(176(,)400, 80 times 8760) = frac(176(,)400, 700(,)800) = 0.2517
$$

**Correct option: (b)**

> **Exam trap:** Remember to subtract the 50 idle days from 365, and use the *maximum demand* (not average) in the denominator. Units check: MWh / (MW × h) = dimensionless. ✓


---

### Assignment Q5
![Week 1 assignment question 5](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-05.png)

**Given:** Three $30 " MW"$ units and one $10 " MW"$ unit. Annual load duration curve is a trapezoid with peak = $80 " MW"$ and minimum = $40 " MW"$ over $8760$ h.

**Installed plant capacity:**

$$
P_("rated") = 30 times 3 + 10 times 1 = 100 " MW"
$$

**MWh generated per annum** (area under load duration curve):

$$
E = frac(1, 2) times (80 + 40) times 8760 = 60 times 8760 = 525(,)600 " MWhr"
$$

**Average load:**

$$
P_("avg") = frac(525(,)600, 8760) = 60 " MW"
$$

**Annual load factor:**

$$
"LF" = frac(P_("avg"), P_("peak")) = frac(60, 80) = 0.75
$$

**Plant capacity factor:**

$$
"PCF" = frac(P_("avg"), P_("rated")) = frac(60, 100) = 0.60
$$

**Correct option: (a)**

> **Exam trap:** The area of a trapezoid is $frac(1, 2)(b_1 + b_2) times h$, not simply the product of peak and time. Using $80 times 8760$ would overestimate the energy and give a load factor of 1.0.


---

### Assignment Q6
![Week 1 assignment question 6](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-06.png)

**Given:** Maximum demand = $90 " MW"$, Load factor = $0.60$, Plant capacity factor = $0.50$, Plant use factor = $0.80$.

**Utilization factor:**

$$
"UF" = frac("Maximum demand", "Plant capacity") = frac("Plant capacity factor", "Load factor") = frac(0.50, 0.60) = 0.833
$$

**Correct option: (d)**

> **Exam trap:** Utilization factor = maximum demand / plant capacity. This is *not* the same as plant capacity factor (= average load / plant capacity). Since average load < maximum demand always, utilization factor > plant capacity factor.


---

### Assignment Q7
![Week 1 assignment question 7](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-07.png)

**Given:** Maximum demand = $90 " MW"$, Load factor = $0.60$, Plant capacity factor = $0.50$.

**Average load:**

$$
P_("avg") = "LF" times "Max demand" = 0.60 times 90 = 54 " MW"
$$

**Rated capacity of the plant:**

$$
P_("rated") = frac(P_("avg"), "PCF") = frac(54, 0.50) = 108 " MW"
$$

**Reserve capacity:**

$$
"Reserve" = P_("rated") - "Max demand" = 108 - 90 = 18 " MW"
$$

**Correct option: (c)**

> **Exam trap:** Reserve capacity is the difference between rated capacity and maximum demand, *not* between rated capacity and average load. Units check: MW − MW = MW. ✓


---

### Assignment Q8
![Week 1 assignment question 8](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-08.png)

**Given:** Maximum demand = $90 " MW"$, Load factor = $0.60$, Plant capacity factor = $0.50$, Plant use factor = $0.80$.

**Average load:**

$$
P_("avg") = 0.60 times 90 = 54 " MW"
$$

**Rated capacity:**

$$
P_("rated") = frac(54, 0.50) = 108 " MW"
$$

**Maximum energy that could be produced daily** (when plant is in operation and fully loaded):

$$
E_("max") = frac(P_("avg") times 24, "Use factor") = frac(54 times 24, 0.80) = 1620 " MWhr"
$$

**Number of hours of operation per day:**

$$
t_("on") = frac(54 times 24, 108 times 0.80) = frac(1296, 86.4) = 15 " hours"
$$

**Hours NOT in service per day:**

$$
t_("off") = 24 - 15 = 9 " hours"
$$

**Correct option: (d)**

> **Exam trap:** Plant use factor involves *actual* energy produced vs. *maximum possible* energy when running at full capacity. The denominator is rated capacity × operating hours, not average load × 24. Getting this backwards gives the wrong number of operating hours.


---

### Assignment Q9
![Week 1 assignment question 9](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-09.png)

The consequences of a low power factor include:

1. **Increased system kVA** — for a given real power $P$, the apparent power $S = P / cos phi$ rises as $cos phi$ drops.
2. **Increased copper losses** — higher current $I = S / (sqrt(3) V)$ leads to greater $I^2 R$ losses in lines.
3. **Poor voltage regulation** — larger voltage drops across line impedance.
4. **Increased amount of copper** — conductors must be sized for the higher current.

**Correct option: (c)**

> **Exam trap:** Low power factor does *not* increase the real power consumed by the load. It increases the *apparent power* and *current*, which causes secondary effects (losses, voltage drop, larger equipment ratings).


---

### Assignment Q10
![Week 1 assignment question 10](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-10.png)

**Residential consumers:** Connected load = $10 " kW"$, Demand factor = $0.8$, Diversity factor = $1.2$.

$$
"Sum of individual max demands" = 10 times 0.8 = 8 " kW"
$$

$$
"Max residential load" = frac(8, 1.2) = 6.667 " kW"
$$

**Commercial consumers:** Connected load = $12 " kW"$, Demand factor = $0.9$, Diversity factor = $1.1$.

$$
"Max commercial load" = frac(12 times 0.9, 1.1) = frac(10.8, 1.1) = 9.818 " kW"
$$

**Industrial consumers:** Connected load = $18 " kW"$, Demand factor = $1.0$, Diversity factor = $1.3$.

$$
"Max industrial load" = frac(18 times 1.0, 1.3) = frac(18, 1.3) = 13.846 " kW"
$$

**Maximum demand on the feeder** (diversity factor among different types = $1.41$):

$$
"MD" = frac(6.667 + 9.818 + 13.846, 1.41) = frac(30.331, 1.41) = 21.511 " kW"
$$

**Correct option: (a)**

> **Exam trap:** Diversity factor is always $>= 1$ and appears in the *denominator*. Dividing by it always *reduces* the peak — never multiply by it. The sum of individual max demands is always *greater than or equal to* the system peak.


---

### Assignment Q11
![Week 1 assignment question 11](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-11.png)

**Given:** Initial load $P_0 = 80 " MW"$, Final load $P_m = 120 " MW"$, Time period $m = 6$ years, Rate of growth = $g%$ per annum.

**Compound growth formula:**

$$
P_m = P_0 (1 + frac(g, 100))^m
$$

$$
120 = 80 (1 + frac(g, 100))^6
$$

$$
(1 + frac(g, 100))^6 = frac(120, 80) = 1.5
$$

$$
1 + frac(g, 100) = (1.5)^(1/6) = 1.0699
$$

$$
g = 6.99%
$$

**Correct option: (b)**

> **Exam trap:** This is a *compound* (geometric) growth, not simple interest. Using $g = frac(120 - 80, 80 times 6) = 8.33%$ would be the simple-growth approximation and is incorrect here.


---

### Assignment Q12
![Week 1 assignment question 12](/content-assets/studies/power-system-analysis/Week%201/Assets/assignment-12.png)

The relationship between the load factor (LF) and the loss factor (LLF) is:

$$
("LF")^2 < "LLF" < "LF"
$$

This holds because the loss factor is related to the square of the load, and the average of squares is always greater than the square of the average (by Jensen's inequality), but less than the square of the maximum. Specifically:

- **LLF < LF**: losses do not scale linearly with load duration; the time-weighted average of squared load is less than the linear load factor.
- **LLF > (LF)²**: by Jensen's inequality, $E[X^2] > (E[X])^2$ for any non-constant random variable $X$.

**Correct option: (b)**

> **Exam trap:** Do not confuse loss factor with load factor. The loss factor is always *between* the square of the load factor and the load factor itself — never equal to either (unless load is perfectly constant).
