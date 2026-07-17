---
title: Time, Work, and Pipes
description: A concise SSC CGL lesson on work rates, efficiency, combined work, worker-days, partial work, alternate schedules, wages, and leaking pipes.
tags: [ssc-cgl, quantitative-aptitude, time-work, pipes]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for work-rate and pipe questions](/img/ssc-cgl/time-work-pipes-map.svg)
*Represent each worker or pipe by a signed rate, add only simultaneous rates, and divide remaining work by the new rate.*

Time and Work is a rate topic. Direct items have constant rates and one change. Mark and return when efficiencies vary by person, schedules alternate irregularly, or a leak opens after an unstated fraction of work.

## 1. Convert Completion Time into Rate

If A completes one job in $a$ days, A’s rate is $1/a$ job per day. If A and B work together at constant independent rates,

$$R_{A+B}=\frac1a+\frac1b,$$

so

$$T_{A+B}=\frac{ab}{a+b}.$$

The shortcut assumes both work for the whole period at their stated rates.

**Worked example**

A takes 12 days and B takes 18 days. Together their rate is $1/12+1/18=5/36$, so time is $36/5=7.2$ days.

**Self-check**

A can finish in 10 days and B in 15 days. How long together?

<details>
<summary>Answer and explanation</summary>

Rate $=1/10+1/15=1/6$, so they take 6 days.
</details>

## 2. Use LCM Work Units for Integer Arithmetic

Choose total work as the LCM of completion times. Individual daily work becomes an integer.

For times 12 and 18, take total work 36 units. A does 3 units/day and B 2 units/day; together 5 units/day.

This is a calculation device, not a claim that the job literally contains those units.

**Worked example**

A, B, and C take 8, 12, and 24 days. Let work be 24 units. Their rates are 3, 2, and 1 units/day, so together they finish in $24/6=4$ days.

**Self-check**

A takes 20 days and B 30 days. With total work 60 units, what are their daily efficiencies?

<details>
<summary>Answer and explanation</summary>

A does 3 units/day and B 2 units/day.
</details>

## 3. Link Efficiency and Time Inversely

For the same work,

$$\text{efficiency}\propto\frac1{\text{time}}.$$

If efficiencies are $m:n$, times are $n:m$. If A is $25\%$ more efficient than B, efficiency ratio is $125:100=5:4$, so time ratio is $4:5$.

**Self-check**

A is twice as efficient as B. If B takes 18 days, how long does A take?

<details>
<summary>Answer and explanation</summary>

Half the time: 9 days.
</details>

## 4. Preserve Worker-Hour Conditions

For equal efficiency and fixed work,

$$M_1D_1H_1=M_2D_2H_2,$$

where $M$ is workers, $D$ days, and $H$ hours per day. Adjust for efficiency if groups differ. The formula fails if work quantity changes or productivity is not comparable.

**Worked example**

12 workers working 8 hours/day finish in 15 days. At the same efficiency, 20 workers working 6 hours/day take

$$D=\frac{12\times8\times15}{20\times6}=12\text{ days}.$$

**Self-check**

16 workers finish in 18 days. How many equal workers are needed for 12 days?

<details>
<summary>Answer and explanation</summary>

$16\times18=M\times12$, so $M=24$.
</details>

## 5. Split Partial Work at Every Change

Compute work completed before a worker joins or leaves, subtract from 1, then divide remaining work by the new combined rate.

**Worked example**

A takes 10 days and B 15 days. A works alone for 4 days, completing $4/10=2/5$. Remaining work is $3/5$. Together their rate is $1/6$, so remaining time is $(3/5)/(1/6)=18/5=3.6$ days.

For alternate-day schedules, compute a full cycle, then handle the leftover work in order. Do not average rates if the final partial cycle matters.

If A and B alternate starting with A, one two-day cycle completes $1/a+1/b$ of the work. Count only full cycles that do not overshoot; the last worker may need a fraction of a day. A simple average of their rates can give the wrong finishing worker and wrong time.

**Self-check**

A does $1/8$ of a job daily and works for 3 days. What fraction remains?

<details>
<summary>Answer and explanation</summary>

A completes $3/8$, leaving $5/8$.
</details>

## 6. Give Leaks Negative Rates and Wages Positive Work Shares

An inlet has positive rate; an outlet or leak has negative rate. If a pipe fills in $a$ hours and a leak empties a full tank in $b$ hours,

$$R_{net}=\frac1a-\frac1b.$$

The tank fills only if net rate is positive.

If a leak opens after some time, first compute the fraction filled by the inlet alone. Apply the net rate only to the remaining capacity. If an outlet is already open but stronger than the inlet, the tank cannot fill from empty under those constant rates.

Wages are divided in proportion to actual work done, $\text{rate}\times\text{time}$, unless the problem specifies a different contract.

**Worked example**

An inlet fills in 6 hours and a leak empties in 12 hours. Net rate is $1/6-1/12=1/12$, so the tank fills in 12 hours.

**Self-check**

Two workers have efficiency ratio $3:2$ and work the same time. How should ₹2,500 be divided?

<details>
<summary>Answer and explanation</summary>

Work ratio is $3:2$, so shares are ₹1,500 and ₹1,000.
</details>

## 7. Mixed Practice and Mastery

### Question 1

A takes 16 days and B 48 days. Find their time together.

<details>
<summary>Answer and explanation</summary>

Rate $=1/16+1/48=1/12$, so 12 days.
</details>

### Question 2

Efficiencies of A and B are $4:5$. If A takes 25 days, how long does B take?

<details>
<summary>Answer and explanation</summary>

Times are $5:4$. B takes $25\times4/5=20$ days.
</details>

### Question 3

10 workers complete a task in 24 days. How long do 15 equal workers take?

<details>
<summary>Answer and explanation</summary>

$10\times24=15D$, so $D=16$ days.
</details>

### Question 4

An inlet fills in 8 hours and an outlet empties in 24 hours. Find net filling time.

<details>
<summary>Answer and explanation</summary>

$1/8-1/24=1/12$, so 12 hours.
</details>

### Question 5

A and B earn in proportion to work. Their rates are $2:3$ and times worked $5:4$. Find wage ratio.

<details>
<summary>Answer and explanation</summary>

Work ratio $=2\times5:3\times4=10:12=5:6$.
</details>

Mastery means every person or pipe has a signed rate and every schedule change creates a new work segment. Continue with [Time, Work, and Pipes focused practice](/exams/ssc-cgl/practice/time-work-pipes).
