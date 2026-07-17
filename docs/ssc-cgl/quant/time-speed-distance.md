---
title: Time, Speed, and Distance
description: A concise SSC CGL lesson on unit conversion, average and relative speed, trains, boats, races, circular tracks, and staged journeys.
tags: [ssc-cgl, quantitative-aptitude, time-speed-distance]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for speed, distance, trains, and boats](/img/ssc-cgl/time-speed-distance-map.svg)
*Make units consistent, identify whose distance is closing, and use total distance over total time for every average-speed claim.*

Motion questions are direct when one relation or relative speed closes the gap. Mark and return when stops, multiple legs, or changing speeds require a timeline that has not yet been organised.

## 1. Match Units Before Using $d=st$

$$d=st,\qquad s=\frac dt,\qquad t=\frac ds.$$

| Convert | Multiply by |
|---|---:|
| km/h to m/s | $5/18$ |
| m/s to km/h | $18/5$ |
| hours to minutes | 60 |
| minutes to seconds | 60 |

**Worked example**

$72\text{ km/h}=72\times5/18=20\text{ m/s}$. In 15 seconds, distance is $20\times15=300$ m.

**Self-check**

Convert $15\text{ m/s}$ to km/h.

<details>
<summary>Answer and explanation</summary>

$15\times18/5=54\text{ km/h}$.
</details>

## 2. Compute Average Speed from Totals

Always use

$$\text{average speed}=\frac{\text{total distance}}{\text{total time}}.$$

For equal distances at speeds $u,v$,

$$\bar s=\frac{2uv}{u+v}.$$

For equal times, average speed is $(u+v)/2$. The harmonic shortcut is invalid for unequal distances.

**Worked example**

A car travels equal distances at 40 and 60 km/h. Average speed is $2(40)(60)/(40+60)=48$ km/h, not 50 km/h.

**Self-check**

A vehicle travels 2 hours at 30 km/h and 2 hours at 50 km/h. Find average speed.

<details>
<summary>Answer and explanation</summary>

Equal times make the arithmetic mean valid: $(30+50)/2=40$ km/h. Total distance 160 km over 4 hours confirms it.
</details>

## 3. Use Relative Speed for Closing Distance

For motion on the same line:

- opposite directions: relative speed $u+v$;
- same direction: relative speed $|u-v|$.

Meeting time is initial separation divided by closing speed, provided speeds are constant and they move toward a meeting.

**Worked example**

Two vehicles 270 km apart approach at 50 and 40 km/h. Time to meet is $270/(50+40)=3$ hours.

**Self-check**

A runner at 8 m/s chases another at 6 m/s from 100 m behind. How long to catch?

<details>
<summary>Answer and explanation</summary>

Closing speed is $8-6=2$ m/s, so time is $100/2=50$ seconds.
</details>

## 4. Add Train Lengths to the Distance Cleared

A train passing a point or person covers its own length. Passing a platform covers train length plus platform length. Two trains crossing cover the sum of their lengths, using relative speed.

$$t=\frac{\text{total length to clear}}{\text{relative speed}}.$$

Keep length in metres and speed in m/s.

**Worked example**

A 180 m train at 54 km/h passes a pole. Speed is 15 m/s, so time is $180/15=12$ seconds.

**Self-check**

A 120 m train at 72 km/h passes a 180 m platform. Find time.

<details>
<summary>Answer and explanation</summary>

Distance $=120+180=300$ m; speed $=20$ m/s. Time $=15$ seconds.
</details>

## 5. Separate Still-Water Speed from Stream Speed

Let boat speed in still water be $b$ and stream speed $s$, with $b>s\ge0$:

$$v_d=b+s,\qquad v_u=b-s.$$

Therefore

$$b=\frac{v_d+v_u}{2},\qquad s=\frac{v_d-v_u}{2}.$$

**Worked example**

Downstream speed is 15 km/h and upstream speed 9 km/h. Still-water speed is 12 km/h and stream speed 3 km/h.

**Self-check**

A boat moves at 10 km/h in still water and the stream is 2 km/h. How long for 24 km upstream?

<details>
<summary>Answer and explanation</summary>

Upstream speed $=10-2=8$ km/h. Time $=24/8=3$ hours.
</details>

## 6. Model Races, Circular Tracks, and Stops Explicitly

If A beats B by $d$ metres in an $L$-metre race, their speed ratio is

$$v_A:v_B=L:(L-d),$$

assuming they start together and maintain constant speeds.

On a circular track of length $C$, relative laps determine meetings. Opposite directions meet every $C/(u+v)$ time units; same direction every $C/|u-v|$, unless start positions differ.

For stoppages, include stopped time in total journey time. “Running speed” excludes stops; “average speed” over the trip includes them.

For the same distance, a speed increase of $p\%$ reduces travel time by

$$\frac{p}{100+p}\times100\%.$$

A speed decrease of $p\%$ increases time by

$$\frac{p}{100-p}\times100\%.$$

These are inverse-percentage conversions, not equal percentage changes. For late/early questions, let the fixed distance be $D$ and compare $D/u-D/v$ with the stated time difference. Use hours consistently; convert minutes before solving.

**Worked example**

Speed rises by $25\%$ for a fixed journey. Time multiplier is $1/1.25=0.8$, so time falls by $20\%$.

**Self-check**

In a 500 m race, A beats B by 100 m. Find their speed ratio.

<details>
<summary>Answer and explanation</summary>

When A covers 500 m, B covers 400 m. Ratio $=500:400=5:4$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

How far does a vehicle at 90 km/h travel in 8 seconds?

<details>
<summary>Answer and explanation</summary>

$90\times5/18=25$ m/s, so distance $=25\times8=200$ m.
</details>

### Question 2

Equal distances are covered at 30 and 45 km/h. Find average speed.

<details>
<summary>Answer and explanation</summary>

$2(30)(45)/(30+45)=36$ km/h.
</details>

### Question 3

Two trains of lengths 150 m and 250 m approach at 54 and 36 km/h. Find crossing time.

<details>
<summary>Answer and explanation</summary>

Relative speed $=15+10=25$ m/s; total length $=400$ m. Time $=16$ seconds.
</details>

### Question 4

Downstream and upstream speeds are 18 and 10 km/h. Find stream speed.

<details>
<summary>Answer and explanation</summary>

$(18-10)/2=4$ km/h.
</details>

### Question 5

A travels 120 km at 60 km/h, stops 30 minutes, then travels 60 km at 40 km/h. Find trip average speed.

<details>
<summary>Answer and explanation</summary>

Times are 2 h, 0.5 h stop, and 1.5 h. Average $=180/4=45$ km/h.
</details>

Mastery means every average uses totals and every crossing uses the correct closing distance. Continue with [Time, Speed, and Distance focused practice](/exams/ssc-cgl/practice/time-speed-distance).
