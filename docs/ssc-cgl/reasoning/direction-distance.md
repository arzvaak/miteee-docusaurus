---
title: Direction and Distance
description: Exam-ready SSC CGL Tier-I Reasoning chapter for turns, coordinates, displacement, shortest distance, and final direction.
tags: [ssc-cgl, reasoning, direction-distance, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. Put Every Movement on Axes

Translate the path into horizontal and vertical movement. A diagram with signs is safer than remembering a journey in words.

![Axis map for direction-and-distance questions](/img/ssc-cgl/direction-distance-map.svg)
*Concept map: lock the starting direction, translate turns, cancel opposite movement, and calculate only the requested displacement.*

| Direction | Coordinate change | Sign | Opposite |
|---|---|---|---|
| North | $(0,+d)$ | $+y$ | South |
| South | $(0,-d)$ | $-y$ | North |
| East | $(+d,0)$ | $+x$ | West |
| West | $(-d,0)$ | $-x$ | East |

**Worked example**

A person walks 8 m east and then 6 m north. The final displacement is $(8,6)$. The shortest distance from the start is:

$$
d=\sqrt{8^2+6^2}=\sqrt{100}=10\text{ m}
$$

Both coordinates are positive, so the final direction is **north-east**.

**Self-check**

A person walks 7 m north and 7 m south. Where is the person relative to the start?

<details>
<summary>Answer and explanation</summary>

At the **starting point**. The vertical movements cancel: $+7-7=0$.

</details>

## 2. Turn from the Current Facing Direction

Left and right depend on where the person is facing at that moment.

| Facing | Left turn | Right turn | Reverse turn |
|---|---|---|---|
| North | West | East | South |
| East | North | South | West |
| South | East | West | North |
| West | South | North | East |

For repeated turns, update the facing direction after each instruction. A $90^\circ$ turn changes to the next cardinal direction; a $180^\circ$ turn reverses it.

**Worked example**

Rina faces east. She turns right, walks forward, and then turns left. Which direction is she finally facing?

East → right gives south; south → left gives east. She is finally facing **east**.

**Self-check**

Arun faces west and turns left. Which direction does he face?

<details>
<summary>Answer and explanation</summary>

**South.** From west, a left turn points south.

</details>

## 3. Cancel the Path to Find Net Displacement

Add east and west separately, then north and south:

$$
x=E-W,\qquad y=N-S
$$

The walked distance is the sum of all segments. The shortest distance is based only on $(x,y)$.

**Worked example**

A person walks 10 m north, 6 m east, 4 m south, and 2 m west.

$$
x=6-2=4,\qquad y=10-4=6
$$

The person is 4 m east and 6 m north of the start. The final direction is **north-east**, and the shortest distance is:

$$
\sqrt{4^2+6^2}=\sqrt{52}=2\sqrt{13}\text{ m}
$$

**Self-check**

Maya walks 12 m east, 5 m west, and 3 m east. How far east is she from the start?

<details>
<summary>Answer and explanation</summary>

**10 m east.** Net horizontal movement is $12-5+3=10$.

</details>

## 4. Choose Distance or Direction—Not Both by Habit

First read the final question:

- **How far?** Find the magnitude $\sqrt{x^2+y^2}$.
- **In which direction?** Use the signs of $x$ and $y$.
- **How far and in which direction?** Report both.
- **Total distance travelled?** Add every segment; do not use Pythagoras.

| Sign of $x$ | Sign of $y$ | Direction |
|---:|---:|---|
| Positive | Positive | North-east |
| Negative | Positive | North-west |
| Positive | Negative | South-east |
| Negative | Negative | South-west |
| Zero | Non-zero | North or south |
| Non-zero | Zero | East or west |

**Worked example**

A person walks 5 m south and 12 m west. The displacement is $(-12,-5)$, so the direction is **south-west** and the shortest distance is $13$ m.

**Self-check**

A person walks 9 m north, 4 m east, and 9 m south. What is the final direction from the start?

<details>
<summary>Answer and explanation</summary>

**East.** North and south cancel; the remaining displacement is 4 m east.

</details>

## 5. Speed and Error Control

A short path or single-turn question can fit a 36-second ceiling. A long path should still follow the same axes method; do not trade accuracy for mental tracking.

| Check | Wrong move | Correct move |
|---|---|---|
| Starting face | Treat left as fixed west | Turn from the current facing direction |
| Opposite paths | Add all movement | Cancel east–west and north–south |
| Asked quantity | Give walked distance for “shortest” | Use displacement for shortest distance |
| Direction | Use the last movement only | Use the signs of final $x$ and $y$ |
| Triangle | Apply Pythagoras before cancellation | Calculate net legs first |

**Self-check**

The last movement is west, but the final coordinates are $(3,4)$. What is the direction from the start?

<details>
<summary>Answer and explanation</summary>

**North-east.** Final direction comes from net displacement, not from the last segment walked.

</details>

## 6. Mixed Exam Practice

### Question 1

Kabir faces east and turns left. Which direction does he face?

Options: North, South, East, West

<details>
<summary>Answer and explanation</summary>

**North.** A left turn from east points north.

</details>

### Question 2

Sara walks 5 m north and 12 m east. What is her shortest distance from the start?

Options: 7 m, 13 m, 17 m, 25 m

<details>
<summary>Answer and explanation</summary>

**13 m.** $\sqrt{5^2+12^2}=13$.

</details>

### Question 3

Aman walks 8 m east and 3 m west. Where is he relative to the start?

Options: 5 m east, 5 m west, 11 m east, 11 m west

<details>
<summary>Answer and explanation</summary>

**5 m east.** Net horizontal movement is $8-3=5$.

</details>

### Question 4

Leena faces west and turns right. Which direction does she face?

Options: North, South, East, West

<details>
<summary>Answer and explanation</summary>

**North.** A right turn from west points north.

</details>

### Question 5

A person walks 7 m north, 4 m east, and 7 m south. What is the final position?

Options: 4 m east, 4 m west, 14 m north, Starting point

<details>
<summary>Answer and explanation</summary>

**4 m east.** The vertical movement cancels, leaving the eastward movement.

</details>

## 7. Mastery Check

- Draw north, east, south, and west before handling a multi-turn path.
- Update the facing direction after every turn.
- Write $x=E-W$ and $y=N-S$ before calculating distance.
- Distinguish total walked distance from shortest displacement.
- Complete five fresh mixed questions without using the final segment as the final direction.

If an answer is wrong, label the cause as **turn**, **sign**, **cancellation**, or **asked quantity** and redo the diagram once.

Continue with [Direction and Distance focused practice](/exams/ssc-cgl/practice/direction-distance) after you can reduce each path to net coordinates without guessing from the final move.
