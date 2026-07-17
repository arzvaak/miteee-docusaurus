---
title: Geometry and Mensuration
description: A concise SSC CGL lesson on angles, triangles, similarity, polygons, circles, plane areas, solids, scaling, and recasting.
tags: [ssc-cgl, quantitative-aptitude, geometry, mensuration]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for geometry theorems and mensuration formulas](/img/ssc-cgl/geometry-mensuration-map.svg)
*Mark the diagram, state the theorem’s conditions, keep dimensions in one unit, and distinguish curved, lateral, and total surface area.*

Geometry is direct when the diagram triggers one theorem or standard formula. Mark and return when a figure has several auxiliary lines or when a mensuration problem mixes recasting, hollow space, and unit conversion.

## 1. Control Lines, Angles, and Polygons

Vertically opposite angles are equal. A linear pair sums to $180^\circ$. With parallel lines, corresponding and alternate interior angles are equal; co-interior angles are supplementary.

For an $n$-sided polygon,

$$\text{interior-angle sum}=(n-2)180^\circ,$$

and the exterior angles, one at each vertex in the same direction, sum to $360^\circ$. A regular polygon has each interior angle $(n-2)180^\circ/n$.

**Worked example**

Each exterior angle of a regular polygon is $24^\circ$. Hence $n=360/24=15$ sides.

**Self-check**

Find each interior angle of a regular hexagon.

<details>
<summary>Answer and explanation</summary>

Interior sum $=(6-2)180=720^\circ$; divide by 6 to get $120^\circ$.
</details>

## 2. Use Triangle Conditions Before Formulas

Triangle angles sum to $180^\circ$. An exterior angle equals the sum of the two remote interior angles. Any two side lengths must sum to more than the third.

| Triangle | Key relation | Area |
|---|---|---|
| general | sides $a,b,c$ | $\sqrt{s(s-a)(s-b)(s-c)}$ |
| base-height | altitude perpendicular to base | $\tfrac12 bh$ |
| right | $a^2+b^2=c^2$ | $\tfrac12 ab$ for legs |
| equilateral | side $a$ | $\sqrt3a^2/4$ |

Here $s=(a+b+c)/2$. Pythagoras applies only to a right triangle.

**Worked example**

A triangle has sides 5, 12, 13. Since $5^2+12^2=13^2$, it is right-angled and area is $5\times12/2=30$ square units.

**Self-check**

Can lengths 3, 4, and 8 form a triangle?

<details>
<summary>Answer and explanation</summary>

No. $3+4=7<8$, violating the triangle inequality.
</details>

## 3. Distinguish Congruence from Similarity

Congruent triangles have the same shape and size. Valid triangle congruence tests include SSS, SAS, ASA/AAS, and RHS for right triangles. SSA is not a general congruence test.

Similar triangles have equal corresponding angles and proportional corresponding sides. If the side ratio is $k$,

$$\text{area ratio}=k^2.$$

For similar solids, surface-area ratio is $k^2$ and volume ratio $k^3$.

**Self-check**

Two similar triangles have corresponding side ratio $3:5$. Find their area ratio.

<details>
<summary>Answer and explanation</summary>

$3^2:5^2=9:25$.
</details>

## 4. Apply Circle Theorems with the Named Arc

$$C=2\pi r,\qquad A=\pi r^2.$$

A radius is perpendicular to the tangent at the point of contact. The angle at the centre is twice the angle at the circumference standing on the same arc. Opposite angles of a cyclic quadrilateral are supplementary.

For an arc with central angle $\theta$:

$$\text{arc length}=\frac{\theta}{360^\circ}2\pi r,$$

$$\text{sector area}=\frac{\theta}{360^\circ}\pi r^2.$$

**Worked example**

A $90^\circ$ sector of radius 14 cm has area $\tfrac14\pi(14)^2=49\pi=154\text{ cm}^2$ using $\pi=22/7$.

**Self-check**

One angle of a cyclic quadrilateral is $108^\circ$. Find the opposite angle.

<details>
<summary>Answer and explanation</summary>

$180^\circ-108^\circ=72^\circ$.
</details>

## 5. Select the Correct Plane-Area Formula

| Figure | Area | Useful condition |
|---|---|---|
| rectangle | $lb$ | diagonal $=\sqrt{l^2+b^2}$ |
| square | $a^2$ | diagonal $=a\sqrt2$ |
| parallelogram | $bh$ | height perpendicular to base |
| rhombus/kite | $d_1d_2/2$ | perpendicular diagonals |
| trapezium | $(a+b)h/2$ | $a,b$ parallel |

Perimeter is a length; area is square units. Shaded area is usually outer area minus inner area, provided the figures do not overlap unexpectedly.

**Self-check**

A trapezium has parallel sides 8 cm and 14 cm and height 5 cm. Find area.

<details>
<summary>Answer and explanation</summary>

$(8+14)5/2=55\text{ cm}^2$.
</details>

## 6. Separate Surface Area from Volume

| Solid | Volume | Curved/lateral area | Total surface area |
|---|---|---|---|
| cuboid $l,b,h$ | $lbh$ | $2h(l+b)$ | $2(lb+bh+hl)$ |
| cube $a$ | $a^3$ | $4a^2$ | $6a^2$ |
| cylinder $r,h$ | $\pi r^2h$ | $2\pi rh$ | $2\pi r(r+h)$ |
| cone $r,h$ | $\pi r^2h/3$ | $\pi rl$ | $\pi r(l+r)$ |
| sphere $r$ | $4\pi r^3/3$ | $4\pi r^2$ | $4\pi r^2$ |
| hemisphere $r$ | $2\pi r^3/3$ | $2\pi r^2$ | $3\pi r^2$ |

For a cone, $l=\sqrt{r^2+h^2}$. Total area includes bases; curved/lateral area does not. A hemisphere’s total area includes its circular base.

**Worked example**

A closed cylinder has $r=3$ cm and $h=10$ cm. Volume $=90\pi\text{ cm}^3$; total surface area $=2\pi(3)(3+10)=78\pi\text{ cm}^2$.

**Self-check**

Find the volume of a cone with radius 6 cm and height 12 cm.

<details>
<summary>Answer and explanation</summary>

$\pi(6)^2(12)/3=144\pi\text{ cm}^3$.
</details>

## 7. Scale and Recast by Preserving the Right Quantity

If every linear dimension is multiplied by $k$, perimeter scales by $k$, area by $k^2$, and volume by $k^3$.

Recasting without material loss preserves volume:

$$V_{before}=V_{after}.$$

For a hollow object, material volume is outer volume minus inner volume. Convert all lengths to the same unit before subtracting or equating.

**Self-check**

The radius of a sphere doubles. By what factor does volume change?

<details>
<summary>Answer and explanation</summary>

Volume scales with the cube of linear scale: $2^3=8$.
</details>

## 8. Mixed Practice and Mastery

### Question 1

Find the area of an equilateral triangle of side 8 cm.

<details>
<summary>Answer and explanation</summary>

$\sqrt3(8)^2/4=16\sqrt3\text{ cm}^2$.
</details>

### Question 2

A circle has circumference $44$ cm. Using $\pi=22/7$, find its radius.

<details>
<summary>Answer and explanation</summary>

$2\pi r=44$, so $r=7$ cm.
</details>

### Question 3

Find total surface area of a cube of side 5 cm.

<details>
<summary>Answer and explanation</summary>

$6(5)^2=150\text{ cm}^2$.
</details>

### Question 4

Two similar solids have side ratio $2:3$. Find volume ratio.

<details>
<summary>Answer and explanation</summary>

$2^3:3^3=8:27$.
</details>

### Question 5

A solid sphere of radius 3 cm is melted into spheres of radius 1 cm. How many are formed?

<details>
<summary>Answer and explanation</summary>

Number equals volume ratio $3^3/1^3=27$.
</details>

Mastery means the theorem conditions and requested measure are named before substitution. Continue with [Geometry and Mensuration focused practice](/exams/ssc-cgl/practice/geometry-mensuration).
