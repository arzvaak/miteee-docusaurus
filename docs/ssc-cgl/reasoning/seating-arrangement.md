---
title: Seating Arrangement
description: Exam-ready SSC CGL Tier-I Reasoning chapter for linear and circular seating, facing direction, ranks, and clue placement.
tags: [ssc-cgl, reasoning, seating-arrangement, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. Build a Placement Skeleton

Classify the arrangement, fix the number of seats, and place the most restrictive clues first. Do not turn a clue into a fact until it has one valid position.

![Placement map for seating-arrangement questions](/img/ssc-cgl/seating-arrangement-map.svg)
*Concept map: identify the layout and facing direction, place fixed clues, preserve branches, and verify every sentence against the final diagram.*

| Clue wording | Exact meaning | Best notation | Common error |
|---|---|---|---|
| Immediate left/right | Adjacent seat | `A B` | Leaving a gap |
| Second to the left/right | One seat between | `A _ B` | Counting the starting seat |
| Between A and B | Usually one seat with both as neighbours | `A X B` | Ignoring order alternatives |
| At an end | First or last linear seat | Mark both ends | Treating as one fixed end |
| Opposite | Half a circle away or facing across | Draw paired positions | Treating opposite as adjacent |
| Neighbour | Immediate seat beside | Mark both possible sides | Choosing a side without a clue |

**Worked example**

Five people A, B, C, D, and E sit in a row facing north.

- C sits in the middle.
- A sits immediately left of C.
- E sits at the right end.
- B sits immediately left of E.

The only arrangement is:

`D  A  C  B  E`

D occupies the remaining left-end seat.

**Self-check**

In that arrangement, who sits between A and B?

<details>
<summary>Answer and explanation</summary>

**C.** The order is A–C–B across those three seats.

</details>

## 2. Linear Rows and Facing Direction

When everyone faces north, their left and right match the page. When everyone faces south, their left and right reverse on the page.

| Person faces | Their left appears | Their right appears | Page order for “B is right of A” |
|---|---|---|---|
| North | Page left | Page right | `A B` |
| South | Page right | Page left | `B A` |
| East | Page up | Page down | Use a vertical sketch |
| West | Page down | Page up | Use a vertical sketch |

**Worked example**

A and B sit in a row facing south. B is immediately to the right of A. On the page, B must be placed **to the left of A**:

`B  A`

**Self-check**

P and Q face north. Q is second to the right of P. How many seats lie between them?

<details>
<summary>Answer and explanation</summary>

**One.** “Second to the right” counts Q as the second position after P.

</details>

For two facing rows, mark an arrow for each row before using left or right. People facing each other have opposite page directions.

## 3. Circular Seating

Rotation does not create a new circular arrangement, so anchor one person anywhere. Direction depends on whether people face the centre or face outward.

| Facing | Left | Right |
|---|---|---|
| Centre | Clockwise | Anticlockwise |
| Outward | Anticlockwise | Clockwise |

**Worked example**

P, Q, R, and S sit around a circle facing the centre.

- P sits opposite R.
- Q sits immediately left of P.

Anchor P at the top. Since left is clockwise for an inward-facing person, Q goes to the right-hand position on the page. R is at the bottom, leaving S at the left-hand position.

Clockwise order: `P → Q → R → S`

**Self-check**

In that arrangement, who sits immediately right of R?

<details>
<summary>Answer and explanation</summary>

**Q.** For an inward-facing person, right is anticlockwise. Moving anticlockwise from R reaches Q.

</details>

**Self-check — outward reversal**

Four people face outward. Which circular direction represents a person's right?

<details>
<summary>Answer and explanation</summary>

**Clockwise.** The left/right rule reverses when everyone faces outward.

</details>

## 4. Rank and Position Questions

For one person ranked from both ends:

$$
\text{Total people}=\text{left rank}+\text{right rank}-1
$$

Subtract one because the named person is counted from both ends.

**Worked example**

R is 8th from the left and 13th from the right. Total people:

$$
8+13-1=20
$$

**Self-check**

In a row of 30 people, K is 11th from the left. What is K's rank from the right?

<details>
<summary>Answer and explanation</summary>

**20th.** $30-11+1=20$.

</details>

For height, age, or score ordering, draw a single direction such as tallest → shortest. Never mix “higher than” and “lower than” without converting them to the same orientation.

## 5. Branches, Verification, and Time

Use a branch only when a clue genuinely has two legal placements. Keep branches separate until a later clue removes one.

| Clue type | Place early? | Reason |
|---|---|---|
| Exact seat or middle | Yes | Fixes the frame |
| End or opposite | Yes | Strong restriction |
| Immediate neighbour pair | Yes | Creates a block |
| “Somewhere left/right” | Later | Often has several positions |
| Negative clue | After candidates exist | Eliminates rather than places |
| Either A or B | Branch if needed | Must not merge alternatives |

A 36-second ceiling is suitable for a single placement or rank question. A multi-clue arrangement is a small set: spend time on one correct diagram, then answer all linked questions from it.

**Self-check**

A clue says “M sits somewhere left of N” in a six-seat row. Should M be placed immediately left of N?

<details>
<summary>Answer and explanation</summary>

**No.** “Somewhere left” fixes order, not adjacency. Preserve all positions until another clue narrows them.

</details>

## 6. Mixed Exam Practice

### Question 1

Using `D A C B E`, who sits at the left end?

<details>
<summary>Answer and explanation</summary>

**D.** D occupies the first seat.

</details>

### Question 2

T is 6th from the left and 9th from the right. How many people are in the row?

Options: 13, 14, 15, 16

<details>
<summary>Answer and explanation</summary>

**14.** $6+9-1=14$.

</details>

### Question 3

Four people face the centre. A sits immediately left of B. In which circular direction is A from B?

Options: Clockwise, Anticlockwise

<details>
<summary>Answer and explanation</summary>

**Clockwise.** For inward-facing people, left is clockwise.

</details>

### Question 4

X and Y face south in a row. Y is immediately right of X. Which page order is correct?

Options: `X Y`, `Y X`

<details>
<summary>Answer and explanation</summary>

**`Y X`.** A south-facing person's right appears on the page's left.

</details>

### Question 5

Five people M, N, O, P, and Q face north. O is in the middle, M is immediately left of O, Q is at the right end, and N sits between O and Q. Who is second to the left of Q?

<details>
<summary>Answer and explanation</summary>

**O.** The arrangement is `P M O N Q`; O is two positions left of Q.

</details>

## 7. Mastery Check

- Classify row, circle, facing, and rank before placing anyone.
- Translate immediate, second, between, end, and opposite exactly.
- Reverse page directions for south-facing and outward-facing cases.
- Anchor one person in a circle to remove rotational duplicates.
- Keep uncertain branches separate and test every clue at the end.
- Complete a fresh five-clue arrangement with no erased or silently assumed placement.

Label each miss as **facing**, **counting**, **adjacency**, **branch**, or **rank formula** before redrawing it.

Continue with [Seating Arrangement focused practice](/exams/ssc-cgl/practice/seating-arrangement) after you can verify every clue against one clean diagram.
