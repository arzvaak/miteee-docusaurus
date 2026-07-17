---
title: Trigonometry
description: A concise SSC CGL lesson on right-triangle ratios, standard angles, identities, complementary angles, quadrants, and heights and distances.
tags: [ssc-cgl, quantitative-aptitude, trigonometry]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for trigonometric ratios, identities, and height-distance diagrams](/img/ssc-cgl/trigonometry-map.svg)
*Choose the reference angle, label opposite/adjacent/hypotenuse, and use an identity only where every ratio is defined.*

Trigonometry is direct when a standard value, complementary pair, or one right triangle resolves it. Mark and return when the diagram has multiple observation points, moving shadows, or non-standard angles requiring an equation system.

## 1. Define Ratios Relative to the Chosen Angle

In a right triangle for acute angle $\theta$,

$$\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}},\qquad
\cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}},$$

$$\tan\theta=\frac{\text{opposite}}{\text{adjacent}}=\frac{\sin\theta}{\cos\theta}.$$

Reciprocals are $\csc=1/\sin$, $\sec=1/\cos$, and $\cot=1/\tan=\cos/\sin$, where denominators are non-zero.

Side labels change when the reference angle changes, but the hypotenuse does not: it is always opposite the right angle and is the longest side. If two sides are known, use Pythagoras before choosing a ratio. A ratio contains no length unit; any final height or distance takes the unit used in the diagram.

**Worked example**

In a $3$-$4$-$5$ right triangle, if opposite side is 3 and adjacent is 4, then $\sin\theta=3/5$, $\cos\theta=4/5$, and $\tan\theta=3/4$.

**Self-check**

If $\sin\theta=5/13$ for acute $\theta$, find $\cos\theta$.

<details>
<summary>Answer and explanation</summary>

The triangle is $5$-$12$-$13$, so $\cos\theta=12/13$.
</details>

## 2. Recall Standard Values Without Making $\tan90^\circ$ Infinite

| $\theta$ | $\sin\theta$ | $\cos\theta$ | $\tan\theta$ |
|---:|---:|---:|---:|
| $0^\circ$ | $0$ | $1$ | $0$ |
| $30^\circ$ | $1/2$ | $\sqrt3/2$ | $1/\sqrt3$ |
| $45^\circ$ | $1/\sqrt2$ | $1/\sqrt2$ | $1$ |
| $60^\circ$ | $\sqrt3/2$ | $1/2$ | $\sqrt3$ |
| $90^\circ$ | $1$ | $0$ | undefined |

$\tan90^\circ$ is undefined because $\cos90^\circ=0$; it is not a real value called infinity.

**Self-check**

Evaluate $2\sin30^\circ+\cos60^\circ$.

<details>
<summary>Answer and explanation</summary>

$2(1/2)+1/2=3/2$.
</details>

## 3. Use Identities with Domain Awareness

$$\sin^2\theta+\cos^2\theta=1$$

$$1+\tan^2\theta=\sec^2\theta$$

$$1+\cot^2\theta=\csc^2\theta$$

The second identity requires $\cos\theta\ne0$; the third requires $\sin\theta\ne0$. Factor or replace only the part that shortens the expression.

**Worked example**

If $\tan\theta=3/4$ for acute $\theta$, then $\sec^2\theta=1+9/16=25/16$, so $\sec\theta=5/4$.

**Self-check**

Simplify $(1-\sin^2\theta)/\cos\theta$ where $\cos\theta\ne0$.

<details>
<summary>Answer and explanation</summary>

$1-\sin^2\theta=\cos^2\theta$, so the expression is $\cos\theta$.
</details>

## 4. Pair Complementary Angles Correctly

For acute angles,

$$\sin(90^\circ-\theta)=\cos\theta,$$
$$\cos(90^\circ-\theta)=\sin\theta,$$
$$\tan(90^\circ-\theta)=\cot\theta,$$
$$\sec(90^\circ-\theta)=\csc\theta.$$

**Self-check**

If $\sin35^\circ=x$, express $\cos55^\circ$.

<details>
<summary>Answer and explanation</summary>

$\cos55^\circ=\sin(90^\circ-55^\circ)=\sin35^\circ=x$.
</details>

## 5. Track Signs by Quadrant

On the unit circle, sine is the $y$-coordinate and cosine the $x$-coordinate. Therefore:

| Quadrant | Positive ratios |
|---:|---|
| I | all |
| II | sine, cosecant |
| III | tangent, cotangent |
| IV | cosine, secant |

Reference-angle values keep their magnitude; the quadrant supplies the sign. Do not use acute-triangle positivity for an obtuse or reflex angle.

A quick sign check prevents many errors: $\tan\theta=\sin\theta/\cos\theta$, so it is positive where sine and cosine share a sign. Reciprocal pairs always share a sign with their original ratio wherever defined.

**Worked example**

$150^\circ=180^\circ-30^\circ$ lies in Quadrant II. Thus $\sin150^\circ=1/2$ and $\cos150^\circ=-\sqrt3/2$.

**Self-check**

What is the sign of $\tan240^\circ$?

<details>
<summary>Answer and explanation</summary>

Positive, because $240^\circ$ lies in Quadrant III where sine and cosine are both negative, making their ratio positive.
</details>

## 6. Draw Heights and Distances Before Substituting

Angle of elevation is measured upward from a horizontal line of sight; angle of depression downward. With vertical height $h$ and horizontal distance $d$,

$$\tan\theta=\frac hd.$$

Add observer height only when the line of sight begins above ground. Assume level ground and vertical objects only when stated or clearly implied.

With two observation points, define one horizontal distance and express the other from the diagram. If points on the same straight line are $x$ metres and $x+d$ metres from a tower, then $h=x\tan\alpha=(x+d)\tan\beta$ for their respective elevation angles. Solve this equation before finding $h$. If the points lie on opposite sides, their ground distances add rather than subtract.

**Worked example**

From a point 20 m from a tower’s foot, angle of elevation is $45^\circ$. Then $h/20=\tan45^\circ=1$, so tower height is 20 m.

**Self-check**

At $30^\circ$ elevation, a tower is viewed from $30\sqrt3$ m away. Find height.

<details>
<summary>Answer and explanation</summary>

$h=30\sqrt3\tan30^\circ=30\sqrt3(1/\sqrt3)=30$ m.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Evaluate $\sin^230^\circ+\cos^230^\circ$.

<details>
<summary>Answer and explanation</summary>

It equals 1 by the Pythagorean identity.
</details>

### Question 2

Evaluate $\tan45^\circ\cdot\cot45^\circ$.

<details>
<summary>Answer and explanation</summary>

$1\times1=1$.
</details>

### Question 3

If $\cos\theta=8/17$ for acute $\theta$, find $\tan\theta$.

<details>
<summary>Answer and explanation</summary>

The opposite side is 15 in an $8$-$15$-$17$ triangle, so $\tan\theta=15/8$.
</details>

### Question 4

Evaluate $\sec^260^\circ-\tan^260^\circ$.

<details>
<summary>Answer and explanation</summary>

$4-3=1$, matching $\sec^2\theta-\tan^2\theta=1$.
</details>

### Question 5

A pole casts a 10 m shadow when the Sun’s elevation is $45^\circ$. Find pole height.

<details>
<summary>Answer and explanation</summary>

$h/10=\tan45^\circ=1$, so $h=10$ m.
</details>

Mastery means every ratio is tied to a reference angle and every identity is used within its domain. Continue with [Trigonometry focused practice](/exams/ssc-cgl/practice/trigonometry).
