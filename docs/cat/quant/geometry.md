---
title: "CAT Quant — Geometry"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 12
topic: "geometry"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# CAT Quant — Geometry: Complete Study Notes

## 1. Concept Map

```text
GEOMETRY
├── 1. LINES & ANGLES
│   ├── Basic Definitions (Point, Line, Ray, Plane)
│   ├── Angle Types (Acute, Right, Obtuse, Reflex)
│   ├── Angle Pairs (Complementary, Supplementary, Linear Pair)
│   └── Parallel Lines & Transversal
│       ├── Corresponding Angles
│       ├── Alternate Angles
│       └── Interior Angles (Supplementary)
│
├── 2. TRIANGLES
│   ├── Classification (By Sides & Angles)
│   ├── Fundamental Properties (Inequality, Angle Sum)
│   ├── Important Lines (Altitude, Median, Angle Bisector)
│   ├── Centres (Orthocentre, Centroid, Incentre, Circumcentre)
│   ├── Theorems (Pythagoras, BPT, Mid-point, Apollonius)
│   ├── Congruency & Similarity
│   ├── Area Formulas (Heron's, Equilateral, Right)
│   └── Special Triangles (30-60-90, 45-45-90)
│
├── 3. QUADRILATERALS
│   ├── General Properties
│   ├── Parallelogram
│   ├── Rectangle
│   ├── Rhombus
│   ├── Square
│   ├── Trapezium
│   └── Kite
│
├── 4. POLYGONS
│   ├── Types (Convex, Concave, Regular)
│   ├── Angle Formulas (Interior, Exterior, Central)
│   ├── Diagonals
│   ├── Area Formulas
│   └── Special Polygons (Pentagon, Hexagon, Octagon, Dodecagon)
│
└── 5. CIRCLES
    ├── Nomenclature (Radius, Chord, Arc, Tangent)
    ├── Circle Theorems (Angles, Chords, Tangents)
    ├── Cyclic Quadrilaterals
    ├── Tangential Quadrilaterals
    ├── Common Tangents (DCT, TCT)
    └── Advanced (Descartes' Theorem, Power of a Point)
```

---

## 2. Foundations & Core Definitions

### 2.1 Lines and Angles (Pages 561–568)

| Term | Definition |
|------|------------|
| **Point** | A figure with no measurable length, breadth, or height. |
| **Line** | An infinite set of points extending endlessly in both directions; has only length. |
| **Line Segment** | A part of a line with two endpoints. |
| **Ray** | A line extending indefinitely in one direction from a starting point. |
| **Plane** | A flat 2-dimensional surface with length and breadth but no thickness. |

**Key Facts:**
- A line contains infinitely many points.
- Only one line can pass through any two distinct points.
- Two lines intersect at a maximum of one point.
- Infinite lines can pass through a single point.
- Two planes intersect to form a line.

### 2.2 Angle Classification

| Type | Property |
|------|----------|
| Acute | $0^\circ < \theta < 90^\circ$ |
| Right | $\theta = 90^\circ$ |
| Obtuse | $90^\circ < \theta < 180^\circ$ |
| Straight | $\theta = 180^\circ$ |
| Reflex | $180^\circ < \theta < 360^\circ$ |
| Complementary | $\theta_1 + \theta_2 = 90^\circ$ |
| Supplementary | $\theta_1 + \theta_2 = 180^\circ$ |

**Angle Sum Properties:**
- Angles on one side of a line: $\theta_1 + \theta_2 + \theta_3 = 180^\circ$
- Angles around a point: $\theta_1 + \theta_2 + \theta_3 + \theta_4 = 360^\circ$

### 2.3 Parallel Lines and Transversals (Page 565)

When a transversal cuts two parallel lines:
1. **Corresponding angles are equal**: $\angle 2 = \angle 6$, $\angle 3 = \angle 7$, etc.
2. **Alternate interior angles are equal**: $\angle 3 = \angle 5$, $\angle 4 = \angle 6$
3. **Interior angles on the same side are supplementary**: $\angle 3 + \angle 6 = 180^\circ$

> **Converse is also true**: If any of these conditions hold, the lines are parallel.

**Transversal Proportionality:**
$$\frac{AB}{BC} = \frac{DE}{EF}$$

---

## 3. Triangles (Pages 569–587)

### 3.1 Basic Properties

- **Sum of interior angles** = $180^\circ$
- **Sum of exterior angles** = $360^\circ$
- **Exterior angle** = Sum of two interior opposite angles
- **Perimeter** = $a + b + c$
- **Semi-perimeter**: $s = \frac{a + b + c}{2}$

### 3.2 Triangle Inequality

For any triangle with sides $a$, $b$, $c$:
- Sum of any two sides > third side: $a + b > c$
- Difference of any two sides < third side: $|a - b| < c$

### 3.3 Classification by Sides (c = largest side)

- $c^2 < a^2 + b^2$ → **Acute** triangle
- $c^2 = a^2 + b^2$ → **Right** triangle
- $c^2 > a^2 + b^2$ → **Obtuse** triangle

### 3.4 Important Centres

| Centre | Definition | Key Property |
|--------|------------|--------------|
| **Orthocentre** | Intersection of altitudes | $\angle BOC = 180^\circ - \angle A$ |
| **Centroid** | Intersection of medians | Divides each median in ratio 2:1 (vertex:base) |
| **Incentre** | Intersection of angle bisectors | Equidistant from all sides |
| **Circumcentre** | Intersection of perpendicular bisectors | Equidistant from all vertices |

### 3.5 Key Theorems

**Pythagoras Theorem:**
$$AC^2 = AB^2 + BC^2$$

**Basic Proportionality Theorem (BPT/Thales):**
If a line is drawn parallel to one side of a triangle, it divides the other two sides proportionally:
$$\frac{AD}{DB} = \frac{AE}{EC}$$

**Mid-point Theorem:**
The segment joining the midpoints of two sides is parallel to the third side and half its length.

**Apollonius Theorem:**
$$AB^2 + AC^2 = 2(AD^2 + BD^2)$$
where $AD$ is the median to side $BC$.

**Angle Bisector Theorem:**
$$\frac{BD}{DC} = \frac{AB}{AC}$$

**Euler's Theorem:**
$$d^2 = R(R - 2r)$$
where $d$ = distance between incentre and circumcentre, $R$ = circumradius, $r$ = inradius.

### 3.6 Pythagorean Triplets

Common triplets: (3,4,5), (5,12,13), (7,24,25), (8,15,17), (9,40,41), (11,60,61), (12,35,37), (16,63,65), (20,21,29), (28,45,53), (33,56,65)

> Multiples and submultiples also work: (6,8,10), (15,36,39), (1.5,2,2.5)

### 3.7 Area Formulas

| Triangle Type | Area Formula |
|---------------|--------------|
| General | $\frac{1}{2} \times \text{base} \times \text{height}$ |
| Scalene (Heron's) | $\sqrt{s(s-a)(s-b)(s-c)}$ |
| Right | $\frac{1}{2} \times \text{base} \times \text{height}$ |
| Isosceles | $\frac{b}{4}\sqrt{4a^2 - b^2}$ |
| Equilateral | $\frac{\sqrt{3}}{4}a^2$ |

### 3.8 Special Triangle Properties

**Equilateral Triangle (side $a$):**
- Height: $h = \frac{\sqrt{3}}{2}a$
- Inradius: $r = \frac{a}{2\sqrt{3}} = \frac{h}{3}$
- Circumradius: $R = \frac{a}{\sqrt{3}} = \frac{2h}{3}$
- **Circumradius = 2 × Inradius**
- All centres coincide.

**Right Triangle (legs $a$, $b$, hypotenuse $c$):**
- Inradius: $r = \frac{a + b - c}{2}$
- Circumradius: $R = \frac{c}{2}$
- Median to hypotenuse = $\frac{c}{2}$

**30-60-90 Triangle:**
Side ratios = $1 : \sqrt{3} : 2$

**45-45-90 Triangle:**
Hypotenuse = $\sqrt{2} \times \text{leg}$

### 3.9 Useful Angle Bisector Results

1. If angle bisectors of $B$ and $C$ meet at $O$: $\angle BOC = 90^\circ + \frac{1}{2}\angle A$
2. If external bisectors of $B$ and $C$ meet at $O$: $\angle BOC = 90^\circ - \frac{1}{2}\angle A$
3. If $AD$ is angle bisector and $AE \perp BC$: $\angle DAE = \frac{1}{2}(\angle ABC - \angle ACB)$

### 3.10 Congruency Tests

| Test | Condition |
|------|-----------|
| SSS | All 3 sides equal |
| SAS | 2 sides + included angle |
| ASA | 2 angles + included side |
| AAS | 2 angles + non-included side |
| RHS | Right angle + hypotenuse + side |

### 3.11 Similarity Tests

| Test | Condition |
|------|-----------|
| AA | 2 angles congruent |
| SAS | 2 sides proportional + included angle equal |
| SSS | All 3 sides proportional |

**Properties of Similar Triangles:**
1. Ratio of sides = Ratio of heights = Ratio of medians = Ratio of angle bisectors = Ratio of inradii = Ratio of circumradii
2. **Ratio of areas = Ratio of squares of corresponding sides**

---

## 4. Quadrilaterals (Pages 588–593)

### 4.1 General Properties

- Sum of interior angles = $360^\circ$
- Figure formed by joining midpoints of any quadrilateral = **parallelogram**
- Area = $\frac{1}{2} \times \text{diagonal} \times (\text{sum of perpendiculars from opposite vertices})$

### 4.2 Parallelogram

**Properties:**
1. Opposite sides parallel and equal
2. Opposite angles equal
3. Adjacent angles sum to $180^\circ$
4. Diagonals bisect each other (but need NOT be equal or perpendicular)
5. Each diagonal divides into 2 congruent triangles

**Formulas:**
- Area = base × height = $AB \times AD \times \sin \theta$
- Perimeter = $2(\text{sum of adjacent sides})$
- $AC^2 + BD^2 = 2(AB^2 + BC^2)$

### 4.3 Rectangle

**Properties:**
1. All angles = $90^\circ$
2. Diagonals equal and bisect each other
3. For given perimeter, **square has maximum area**

**Formulas:**
- Area = $l \times b$
- Diagonal = $\sqrt{l^2 + b^2}$
- Perimeter = $2(l + b)$

### 4.4 Rhombus

**Properties:**
1. All sides equal
2. Diagonals bisect at right angles (but need NOT be equal)
3. Diagonals bisect vertex angles

**Formulas:**
- Area = $\frac{1}{2} \times d_1 \times d_2 = \text{side}^2 \times \sin \theta$

### 4.5 Square

**Properties:**
1. All sides equal, all angles = $90^\circ$
2. Diagonals equal, bisect at right angles

**Formulas:**
- Area = $a^2 = \frac{d^2}{2}$
- Diagonal = $a\sqrt{2}$
- Perimeter = $4a$

### 4.6 Trapezium

**Properties:**
1. Median = $\frac{1}{2} \times (\text{sum of parallel sides})$
2. Equal non-parallel sides → equal diagonals (isosceles trapezium)
3. Diagonals intersect proportionally to parallel sides

**Formulas:**
- Area = $\frac{1}{2} \times (\text{sum of parallel sides}) \times \text{height}$
- $AC^2 + BD^2 = BC^2 + AD^2 + 2 \times AB \times CD$

**Line through diagonal intersection parallel to bases:**
- $EF = \frac{2(AB)(CD)}{AB + CD}$

### 4.7 Kite

**Properties:**
1. $AB = BC$ and $AD = CD$
2. Diagonals are perpendicular
3. **Longer diagonal bisects the shorter**
4. Longer diagonal bisects opposite angles

**Formulas:**
- Area = $\frac{1}{2} \times d_1 \times d_2$
- Always has an incircle; inradius = $\frac{\text{Area}}{\text{Semi-perimeter}}$

---

## 5. Polygons (Pages 594–602)

### 5.1 Basic Formulas

For a regular polygon with $n$ sides:

| Property | Formula |
|----------|---------|
| Sum of interior angles | $(n - 2) \times 180^\circ$ |
| Each interior angle | $\frac{(n - 2) \times 180^\circ}{n}$ |
| Each exterior angle | $\frac{360^\circ}{n}$ |
| Each central angle | $\frac{360^\circ}{n}$ |
| Number of diagonals | $\frac{n(n-3)}{2}$ |
| Interior + Exterior angle | $180^\circ$ |

### 5.2 Area of Regular Polygon

$$\text{Area} = \frac{1}{2} \times n \times s \times a = \frac{1}{2} \times a \times p$$

where $s$ = side, $a$ = apothem (inradius), $p$ = perimeter.

**Alternative formulas:**
- Area $= \frac{1}{4} \times n \times s^2 \times \cot\left(\frac{\pi}{n}\right)$
- Area $= \frac{1}{2} \times n \times r^2 \times \sin\left(\frac{2\pi}{n}\right)$

### 5.3 Special Polygons

**Regular Pentagon (side $s$):**
- Diagonal $= \varphi s$ where $\varphi = \frac{1+\sqrt{5}}{2}$ (Golden Ratio)
- Area $= \frac{1}{4}\sqrt{25 + 10\sqrt{5}} \times s^2$

**Regular Hexagon (side $a$):**
- Area $= \frac{3\sqrt{3}}{2}a^2$
- Apothem $= \frac{\sqrt{3}}{2}a$
- Circumradius $= a$

**Regular Octagon (side $s$):**
- Area $= 2(1 + \sqrt{2})s^2$
- Diagonal $d_2 = (1 + \sqrt{2})s$

**Regular Dodecagon (side 1):**
- Area $= 3\sqrt{3} + 6$
- Circumradius $= \sqrt{2 + \sqrt{3}}$

---

## 6. Circles (Pages 603–610)

### 6.1 Nomenclature

| Term | Definition |
|------|------------|
| **Radius** | Fixed distance from centre to any point on circle |
| **Chord** | Line segment with endpoints on the circle |
| **Diameter** | Chord passing through centre; $= 2 \times$ radius |
| **Secant** | Line intersecting circle at two points |
| **Tangent** | Line touching circle at exactly one point; perpendicular to radius |
| **Arc** | Part of the circumference |
| **Central angle** | Angle at the centre subtended by an arc |
| **Inscribed angle** | Angle between two chords at a common endpoint |

### 6.2 Circle Theorems

1. **Equal chords subtend equal angles at the centre.**
2. **Perpendicular from centre to chord bisects the chord.**
3. **Angle at centre = 2 × angle at circumference:**
$$m\angle AOB = 2m\angle ACB$$
4. **Angle in a semicircle is a right angle.**
5. **Angles in the same segment are equal:** $\angle ACB = \angle ADB$
6. **Cyclic quadrilateral:** Opposite angles sum to $180^\circ$.
7. **Tangent-radius:** A tangent at any point is perpendicular to the radius.
8. **Equal tangents:** Lengths of two tangents from an external point are equal.
9. **Intersecting chords:** $AE \times BE = CE \times DE$
10. **Tangent-secant:** $PA \times PB = (PT)^2$
11. **Alternate segment theorem:** Angle between tangent and chord = angle in the alternate segment.

### 6.3 Common Tangents

For two circles with radii $r_1$, $r_2$ and distance between centres $d$:

- **Direct Common Tangent (DCT):** Length $= \sqrt{d^2 - (r_1 - r_2)^2}$
- **Transverse Common Tangent (TCT):** Length $= \sqrt{d^2 - (r_1 + r_2)^2}$

### 6.4 Cyclic Quadrilateral

- **Ptolemy's Theorem:** $AB \times CD + BC \times AD = AC \times BD$
- **Area (Brahmagupta's formula):** $A = \sqrt{(s-a)(s-b)(s-c)(s-d)}$

### 6.5 Tangential Quadrilateral

- **Condition:** $a + c = b + d = s$ (semi-perimeter)
- **Area:** $A = r \times s$
- **Maximum area:** $A \leq \sqrt{abcd}$ (when bicentric)

### 6.6 Descartes' Circle Theorem

For four mutually tangent circles with curvatures $a, b, c, d$:
$$(a + b + c + d)^2 = 2(a^2 + b^2 + c^2 + d^2)$$

where curvature $= \frac{1}{\text{radius}}$ (negative for a circumscribing circle).

---

## 7. Fast CAT Methods & Shortcuts

### 7.1 Option Elimination

For many geometry problems, testing options is faster than full derivation.

**Example (Lines & Angles):** If an angle is $\frac{1}{5}$ of its supplement, find the angle.
- Test options: $30^\circ$ → supplement $150^\circ$ → $30 = \frac{1}{5} \times 150$ ✓

### 7.2 Special Case Substitution

When a result is invariant, choose convenient values.

**Example (Circle):** For a point P on the incircle of a square, the sum of squared distances to vertices is constant. Place P at the midpoint of a side for easy calculation.

### 7.3 Mass-Point Geometry

For problems with cevians intersecting:
1. Assign weights to vertices proportional to opposite segment ratios.
2. Weight at intersection = sum of weights at endpoints.
3. Ratios of segments are inversely proportional to weights.

### 7.4 Ladder Theorem (Crossed Ladders)

$$\frac{1}{AB} + \frac{1}{CD} = \frac{1}{EF}$$

### 7.5 Area Ratio Shortcuts

- Triangles with same height: Area ratio = Base ratio
- Triangles with same base: Area ratio = Height ratio
- Similar triangles: Area ratio = (Side ratio)²

### 7.6 Golden Ratio in Pentagon

- Diagonal of regular pentagon = $\varphi \times$ side
- $\varphi = \frac{1+\sqrt{5}}{2}$, $\varphi^2 = \varphi + 1$

---

## 8. Worked Examples

### Example 1 (Easy): Angle Chasing

**Problem:** In the figure, $AB$ is a straight line. Find $x + y$ if $\angle AOC = 105^\circ$ and $\angle BOD = 90^\circ$.

**Solution:**
- $105^\circ + 3x = 180^\circ$ (linear pair) → $x = 25^\circ$
- $y + 90^\circ + 2x = 180^\circ$ → $y + 90 + 50 = 180$ → $y = 40^\circ$
- $x + y = 65^\circ$

### Example 2 (Moderate): Triangle Centres

**Problem:** In $\triangle ABC$, $\angle A = 80^\circ$ and $\angle B = 30^\circ$. The internal bisectors of $\angle B$ and $\angle C$ meet at $O$. Find $\angle BOC$.

**Solution:**
- $\angle C = 180 - 80 - 30 = 70^\circ$
- Using the formula: $\angle BOC = 90^\circ + \frac{1}{2}\angle A = 90 + 40 = 130^\circ$

### Example 3 (Moderate): Similar Triangles

**Problem:** In $\triangle ABC$, $DE \parallel BC$. $AD = 3$ cm, $DB = 2$ cm, $AE = 4.5$ cm. Find $EC$.

**Solution:**
- By BPT: $\frac{AD}{DB} = \frac{AE}{EC}$
- $\frac{3}{2} = \frac{4.5}{EC}$ → $EC = 3$ cm

### Example 4 (Advanced): Trapezium with Incircle

**Problem:** An isosceles trapezium circumscribes a circle. The parallel sides are in ratio 4:1 and their sum is 70 cm. Find the circumference of the circle.

**Solution:**
- Let parallel sides be $4x$ and $x$. Sum $= 5x = 70$ → $x = 14$
- Sides are 56 cm and 14 cm
- For tangential quadrilateral: sum of non-parallel sides = sum of parallel sides = 70
- Each leg $= 35$ cm
- Height $= \sqrt{35^2 - 21^2} = \sqrt{1225 - 441} = \sqrt{784} = 28$ cm
- Diameter of circle = height = 28 cm
- Circumference $= 28\pi \approx 88$ cm

### Example 5 (Advanced): Descartes' Circle Theorem

**Problem:** Three circles of unit radius are mutually tangent. Find the radius of the circle tangent to all three and enclosing them.

**Solution:**
- Curvatures: $a = b = c = 1$
- For enclosing circle, curvature $d$ is negative
- $(1 + 1 + 1 + d)^2 = 2(1 + 1 + 1 + d^2)$
- $(3 + d)^2 = 2(3 + d^2)$
- $9 + 6d + d^2 = 6 + 2d^2$
- $d^2 - 6d - 3 = 0$
- $d = 3 + 2\sqrt{3}$ (positive root for enclosing circle)
- Radius $= \frac{1}{3 + 2\sqrt{3}}$ cm

### Example 6 (Advanced): Power of a Point

**Problem:** From an external point $P$, a tangent $PT = 5$ cm and a secant $PAB$ with $PA = 4$ cm are drawn. Find $AB$.

**Solution:**
- By tangent-secant theorem: $PT^2 = PA \times PB$
- $25 = 4 \times PB$ → $PB = \frac{25}{4} = 6.25$ cm
- $AB = PB - PA = 6.25 - 4 = 2.25 = \frac{9}{4}$ cm

---

## 9. Decision Rules

| Situation | Rule/Formula to Apply |
|-----------|----------------------|
| Need to find an angle in a triangle | Sum = $180^\circ$; exterior angle = sum of opposite interior angles |
| Parallel lines cut by transversal | Corresponding/alternate angles equal; interior angles supplementary |
| Check if triangle is right/acute/obtuse | Compare $c^2$ with $a^2 + b^2$ (c = largest side) |
| Find area of scalene triangle | Heron's formula |
| Find inradius of a triangle | $r = \frac{\text{Area}}{s}$ |
| Find circumradius of a triangle | $R = \frac{abc}{4 \times \text{Area}}$ |
| Median in a triangle | Apollonius theorem |
| Angle bisector in a triangle | Angle bisector theorem (ratio of sides) |
| Line parallel to side of triangle | BPT/Thales theorem |
| Midpoints of sides | Mid-point theorem |
| Quadrilateral with all vertices on circle | Cyclic quadrilateral properties; Ptolemy's theorem |
| Quadrilateral with incircle | Tangential quadrilateral: $a + c = b + d$ |
| Regular polygon angle | $\frac{(n-2) \times 180^\circ}{n}$ |
| Number of diagonals | $\frac{n(n-3)}{2}$ |
| Chord length in circle | Perpendicular from centre bisects chord; use Pythagoras |
| Tangent from external point | Tangent length² = Power of point |
| Two circles tangent | Distance between centres = sum/difference of radii |

---

## 10. Common Traps & Pitfalls

1. **Triangle inequality**: Sum of ANY two sides > third side (not just some pairs).
2. **Pythagorean triplets**: Multiples work, but verify the triangle is valid first.
3. **Angle bisector theorem**: Ratio applies to opposite side segments, not adjacent sides.
4. **Centroid ratio**: 2:1 (vertex:base), not 1:2.
5. **Similar triangles**: Area ratio = square of side ratio, not linear ratio.
6. **Exterior angle**: Equals sum of INTERIOR OPPOSITE angles (not adjacent).
7. **Parallelogram diagonals**: Bisect each other but need NOT be equal or perpendicular.
8. **Rhombus vs square**: Rhombus diagonals are perpendicular but not necessarily equal.
9. **Trapezium median**: Only joins midpoints of NON-PARALLEL sides.
10. **Kite**: Longer diagonal bisects shorter (not vice versa).
11. **Cyclic quadrilateral**: Opposite angles supplementary; exterior angle = interior opposite angle.
12. **Tangential quadrilateral**: $a + c = b + d$ is necessary AND sufficient.
13. **Common tangents**: DCT uses $(r_1 - r_2)$, TCT uses $(r_1 + r_2)$.
14. **Descartes' theorem**: Negative curvature for circumscribing circle.
15. **Angle at centre vs circumference**: Angle at centre is TWICE the angle at circumference.

---

## 11. Timed Strategy

### 11.1 Time Allocation (for 2-minute average per question)

| Difficulty | Time | Strategy |
|------------|------|----------|
| Easy (direct formula) | 30–60 sec | Apply formula directly; verify units |
| Moderate (2-step) | 60–90 sec | Identify the key theorem; draw diagram |
| Advanced (multi-concept) | 90–120 sec | Break into sub-problems; use shortcuts |
| Very Hard | 120+ sec | If no approach in 60 sec, skip and return |

### 11.2 Order of Attack

1. **Scan all geometry questions** first; identify easy formula-based ones.
2. **Solve angle-chasing problems** quickly (they are usually fast).
3. **Attempt area problems** next (often have multiple approaches).
4. **Leave complex circle/polygon combinations** for later.

### 11.3 Speed Techniques

- **Draw accurate diagrams** — helps eliminate wrong options.
- **Use special cases** (equilateral, isosceles right) to test options.
- **Memorize common Pythagorean triplets** and their multiples.
- **Know the golden ratio** for pentagon problems.
- **Use option substitution** for "find the value" questions.

---

## 12. Final Revision Sheet

### Triangles
- Angle sum: $180^\circ$; Exterior angle = sum of opposite interior angles
- Inequality: $a + b > c > |a - b|$
- Classification: $c^2$ vs $a^2 + b^2$
- Centres: Orthocentre (altitudes), Centroid (medians, 2:1), Incentre (angle bisectors), Circumcentre (perp bisectors)
- Pythagoras: $a^2 + b^2 = c^2$
- BPT: $\frac{AD}{DB} = \frac{AE}{EC}$
- Apollonius: $AB^2 + AC^2 = 2(AD^2 + BD^2)$
- Angle bisector: $\frac{BD}{DC} = \frac{AB}{AC}$
- Area: $\frac{1}{2}bh$, Heron's, $\frac{\sqrt{3}}{4}a^2$ (equilateral)
- Inradius: $\frac{\text{Area}}{s}$; Right triangle: $\frac{a+b-c}{2}$
- Circumradius: $\frac{abc}{4\Delta}$; Right triangle: $\frac{c}{2}$

### Quadrilaterals
- Sum of angles: $360^\circ$
- Parallelogram: Opposite sides/angles equal; diagonals bisect
- Rectangle: Diagonals equal; Area = $lb$
- Rhombus: Diagonals perpendicular; Area = $\frac{1}{2}d_1d_2$
- Square: All properties; Area = $a^2 = \frac{d^2}{2}$
- Trapezium: Area = $\frac{1}{2}(a+b)h$; Median = $\frac{a+b}{2}$
- Kite: Diagonals perpendicular; longer bisects shorter

### Polygons
- Interior angle: $\frac{(n-2)180^\circ}{n}$
- Exterior angle: $\frac{360^\circ}{n}$
- Diagonals: $\frac{n(n-3)}{2}$
- Area: $\frac{1}{2} \times \text{apothem} \times \text{perimeter}$

### Circles
- Angle at centre = 2 × angle at circumference
- Angle in semicircle = $90^\circ$
- Tangent ⊥ radius
- Equal tangents from external point
- Intersecting chords: $AE \times BE = CE \times DE$
- Tangent-secant: $PA \times PB = PT^2$
- Cyclic quadrilateral: Opposite angles supplementary; Ptolemy's theorem
- Tangential quadrilateral: $a + c = b + d$
- DCT: $\sqrt{d^2 - (r_1 - r_2)^2}$; TCT: $\sqrt{d^2 - (r_1 + r_2)^2}$
- Descartes: $(a+b+c+d)^2 = 2(a^2+b^2+c^2+d^2)$

### Golden Ratio
- $\varphi = \frac{1+\sqrt{5}}{2}$
- $\varphi^2 = \varphi + 1$
- Pentagon diagonal = $\varphi \times$ side
