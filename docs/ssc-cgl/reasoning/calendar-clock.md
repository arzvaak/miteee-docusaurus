---
title: Calendar and Clock
description: Exam-ready SSC CGL Tier-I Reasoning chapter for leap years, odd days, day shifts, clock angles, and hand events.
tags: [ssc-cgl, reasoning, calendar-clock, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. Identify the Module First

Calendar questions reduce dates modulo 7. Clock questions compare two moving hands. Choose the module before reaching for a formula.

![Timing map for calendar-and-clock questions](/img/ssc-cgl/calendar-clock-map.svg)
*Concept map: classify the prompt, apply the relevant calendar or clock rule, and verify leap-year or smaller-angle conditions before answering.*

| Prompt asks for | Core idea | First move | Final check |
|---|---|---|---|
| Day after a period | Odd days | Reduce elapsed days modulo 7 | Count the interval correctly |
| Day on a date | Month/year offsets | Start from a known day | Include leap February when crossed |
| Leap year | Gregorian rule | Check 4, then century rule | Century must be divisible by 400 |
| Angle at a time | Hand positions | Use hour and minute angles | Return the smaller angle if asked |
| Coincidence/opposition | Relative speed | Write an event equation | Keep the time in the stated hour |

**Worked example**

If today is Monday, what day will it be after 45 days?

$$
45\bmod 7=3
$$

Three days after Monday is **Thursday**.

**Self-check**

If today is Friday, what day was it 10 days ago?

<details>
<summary>Answer and explanation</summary>

**Tuesday.** $10\bmod7=3$, and three days before Friday is Tuesday.

</details>

## 2. Leap Years and Odd Days

In the Gregorian calendar:

1. A non-century year divisible by 4 is a leap year.
2. A century year is a leap year only when divisible by 400.

| Period | Days | Odd days | Example |
|---|---:|---:|---|
| Ordinary year | 365 | 1 | 2025 |
| Leap year | 366 | 2 | 2024 |
| 31-day month | 31 | 3 | January |
| 30-day month | 30 | 2 | April |
| February, ordinary | 28 | 0 | February 2025 |
| February, leap | 29 | 1 | February 2024 |

**Worked example**

1 January 2025 was Wednesday. What day was 1 January 2026?

The year 2025 was ordinary, so the day advances by one. The answer is **Thursday**.

**Self-check — century rule**

Which is a leap year: 1900, 2000, or both?

<details>
<summary>Answer and explanation</summary>

**2000 only.** Both are divisible by 100, but only 2000 is divisible by 400.

</details>

**Self-check — leap-year shift**

If 1 January 2024 was Monday, what day was 1 January 2025?

<details>
<summary>Answer and explanation</summary>

**Wednesday.** The leap year contributes two odd days, so Monday advances by two.

</details>

## 3. Find the Day on a Date

Count the days **between** the known date and target date, then reduce modulo 7. Do not count the starting day as one full elapsed day.

**Worked example**

1 January 2023 was Sunday. What day was 1 March 2023?

January contributed 31 days and February contributed 28:

$$
31+28=59,\qquad 59\bmod7=3
$$

Three days after Sunday is **Wednesday**.

**Self-check**

If 1 August is Monday, what day is 15 August of the same year?

<details>
<summary>Answer and explanation</summary>

**Monday.** Fourteen days elapse from 1 August to 15 August, and $14\bmod7=0$.

</details>

**Self-check — crossing February**

1 February 2024 was Thursday. What day was 1 March 2024?

<details>
<summary>Answer and explanation</summary>

**Friday.** February 2024 had 29 days, so the day advanced by one.

</details>

## 4. Clock-Hand Angles

At $H$ hours and $M$ minutes, using a 12-hour clock:

$$
\text{Hour-hand angle}=30H+0.5M
$$

$$
\text{Minute-hand angle}=6M
$$

The raw separation is:

$$
\theta=\left|30H-5.5M\right|
$$

If the smaller angle is requested, use $\min(\theta,360^\circ-\theta)$.

**Worked example**

Find the smaller angle at 3:20.

$$
\text{Hour hand}=30(3)+0.5(20)=100^\circ
$$

$$
\text{Minute hand}=6(20)=120^\circ
$$

The smaller angle is **$20^\circ$**.

**Self-check**

What is the smaller angle at 9:00?

<details>
<summary>Answer and explanation</summary>

**$90^\circ$.** The raw separation is $270^\circ$, so the smaller angle is $360^\circ-270^\circ=90^\circ$.

</details>

**Self-check**

What is the smaller angle at 4:30?

<details>
<summary>Answer and explanation</summary>

**$45^\circ$.** The hour hand is at $135^\circ$ and the minute hand is at $180^\circ$.

</details>

## 5. Coincidence and Other Hand Events

The minute hand gains on the hour hand at:

$$
6-0.5=5.5^\circ\text{ per minute}
$$

After $H$ o'clock, the first coincidence occurs at:

$$
M=\frac{60H}{11}\text{ minutes}
$$

| Event | Separation condition | Use |
|---|---|---|
| Coincide | $0^\circ$ or $360^\circ$ | Hands overlap |
| Opposite | $180^\circ$ | Hands form a straight line |
| Right angle | $90^\circ$ or $270^\circ$ | Smaller angle is $90^\circ$ |
| General angle | $\theta$ or $360^\circ-\theta$ | Two possible positions may occur |

**Worked example**

When do the hands first coincide after 2 o'clock?

$$
M=\frac{60\times2}{11}=\frac{120}{11}=10\frac{10}{11}\text{ minutes}
$$

They coincide at approximately **2:10:55**.

**Self-check**

At exactly 6:00, what angle do the hands form?

<details>
<summary>Answer and explanation</summary>

**$180^\circ$.** The minute hand is at 12 and the hour hand is at 6.

</details>

## 6. Mixed Practice and Speed Control

Direct day-shift and fixed-time angle questions can fit a 36-second ceiling. Event equations and long date intervals deserve a written line of work.

### Question 1

If today is Wednesday, what day will it be after 100 days?

Options: Thursday, Friday, Saturday, Sunday

<details>
<summary>Answer and explanation</summary>

**Friday.** $100\bmod7=2$, so Wednesday advances by two days.

</details>

### Question 2

Is 2100 a leap year?

<details>
<summary>Answer and explanation</summary>

**No.** It is a century year not divisible by 400.

</details>

### Question 3

If 1 June is Tuesday, what day is 22 June?

<details>
<summary>Answer and explanation</summary>

**Tuesday.** Twenty-one days elapse, and $21\bmod7=0$.

</details>

### Question 4

What is the smaller angle at 2:00?

Options: $30^\circ$, $60^\circ$, $90^\circ$, $120^\circ$

<details>
<summary>Answer and explanation</summary>

**$60^\circ$.** Each hour mark spans $30^\circ$, and the hands are two marks apart.

</details>

### Question 5

What is the smaller angle at 7:20?

Options: $80^\circ$, $90^\circ$, $100^\circ$, $110^\circ$

<details>
<summary>Answer and explanation</summary>

**$100^\circ$.** The hour hand is at $220^\circ$ and the minute hand at $120^\circ$.

</details>

## 7. Mastery Check

- Apply the century leap-year exception without hesitation.
- Count elapsed days rather than including the starting date.
- Reduce calendar movement modulo 7.
- Include the hour hand's $0.5^\circ$ movement per minute.
- Convert raw clock separation to the smaller angle when required.
- Complete five fresh mixed questions with every formula line visible and correct.

Label each miss as **interval**, **leap rule**, **odd days**, **hour-hand movement**, or **smaller angle** before retrying it.

Continue with [Calendar and Clock focused practice](/exams/ssc-cgl/practice/calendar-clock) after you can choose the correct calendar or clock module without trial and error.
