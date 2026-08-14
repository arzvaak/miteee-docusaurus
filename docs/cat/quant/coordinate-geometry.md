---
title: "CAT Quant — Co-ordinate Geometry"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 21
topic: "coordinate-geometry"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Co-ordinate Geometry — Complete Study Notes

## 1. Concept Map

```
CO-ORDINATE GEOMETRY
│
├── 1. Cartesian System
│   ├── Axes, Origin, Quadrants
│   ├── Coordinates (x, y): Abscissa & Ordinate
│   └── Sign Conventions
│
├── 2. Core Formulae
│   ├── Distance Formula
│   ├── Section Formula (Internal/External)
│   ├── Area of Triangle & Polygon
│   └── Collinearity Conditions
│
├── 3. Points in a Triangle
│   ├── Centroid
│   ├── Incentre
│   ├── Circumcentre
│   └── Orthocentre (Euler Line)
│
├── 4. Straight Lines
│   ├── Slope & Intercepts
│   ├── Standard Forms (6 forms)
│   ├── Angle Between Lines
│   ├── Parallel/Perpendicular Conditions
│   ├── Distance from Point/Line
│   ├── Family of Lines & Concurrency
│   └── Angle Bisectors
│
└── 5. Advanced Applications
    ├── Shifting of Origin
    ├── Figure Identification (Square, Rhombus, etc.)
    ├── Counting Integral Points
    └── Circle Constraints
```

---

## 2. Foundations — The Cartesian System

### 2.1 Axes and Quadrants

Two mutually perpendicular lines through point O form the **co-ordinate axes**:
- **X'OX** = X-axis (horizontal)
- **Y'OY** = Y-axis (vertical)
- **O** = Origin (0, 0)

*Image ref: images/page-1211-img-0.jpg* (axes diagram)

The axes divide the plane into **four quadrants**:

*Image ref: images/page-1212-img-3.jpg* (quadrant diagram)

| Quadrant | Region | Sign of (x, y) |
|----------|--------|----------------|
| I | XOY | (+, +) |
| II | X'OY | (−, +) |
| III | X'OY' | (−, −) |
| IV | Y'OX | (+, −) |

### 2.2 Coordinates of a Point

For any point P, draw perpendiculars to both axes:

*Image ref: images/page-1212-img-2.jpg* (point P with perpendiculars)

- **MP** (parallel to X-axis) = **x-coordinate** = **abscissa**
- **PN** (parallel to Y-axis) = **y-coordinate** = **ordinate**
- Position = ordered pair **(x, y)**

**Key facts:**
- Origin = (0, 0)
- Points on X-axis: (x, 0)
- Points on Y-axis: (0, y)

---

## 3. Core Formulae

### 3.1 Distance Formula

$$PQ = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

**Distance from origin:**
$$\sqrt{x_1^2 + y_1^2}$$

**Symbol meanings:**
- $(x_1, y_1)$, $(x_2, y_2)$ = coordinates of two points
- $PQ$ = distance between them

### 3.2 Section Formula

**Internal division** (point divides line segment in ratio $m:n$):
$$x = \frac{mx_2 + nx_1}{m + n}, \quad y = \frac{my_2 + ny_1}{m + n}$$

**External division** (ratio $m:n$):
$$x = \frac{mx_2 - nx_1}{m - n}, \quad y = \frac{my_2 - ny_1}{m - n}$$

**Symbol meanings:**
- $(x_1, y_1)$, $(x_2, y_2)$ = endpoints of segment
- $m:n$ = ratio in which point divides the segment
- For external division, $m \neq n$

### 3.3 Area of a Triangle

$$\Delta = \frac{1}{2} \left| \begin{array}{ccc} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1 \end{array} \right|$$

Expanded form:
$$\Delta = \frac{1}{2} |x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$$

### 3.4 Area of a Polygon

For vertices $(x_1, y_1), (x_2, y_2), \ldots, (x_n, y_n)$:

$$\Delta = \frac{1}{2} |(x_1 y_2 - x_2 y_1) + (x_2 y_3 - x_3 y_2) + \ldots + (x_n y_1 - x_1 y_n)|$$

**Fast CAT method:** Use the **shoelace formula** — multiply diagonally, sum, take absolute value, divide by 2.

### 3.5 Collinearity of Three Points

Three points A, B, C are **collinear** if ANY of these holds:

1. **Area of triangle ABC = 0**
2. **Slope of AB = Slope of BC = Slope of AC**
3. **AB + BC = AC** (distance condition)
4. Third point satisfies the equation of the line through the other two

---

## 4. Important Points in a Triangle

### 4.1 Centroid

$$G = \left( \frac{x_1 + x_2 + x_3}{3}, \frac{y_1 + y_2 + y_3}{3} \right)$$

**Fast method:** Centroid = average of all x-coordinates, average of all y-coordinates.

### 4.2 Incentre

For triangle ABC with side lengths $BC = a$, $CA = b$, $AB = c$:

$$I = \left( \frac{ax_1 + bx_2 + cx_3}{a + b + c}, \frac{ay_1 + by_2 + cy_3}{a + b + c} \right)$$

**Note:** Weighted average where weights are the **opposite side lengths**.

### 4.3 Circumcentre

- Point equidistant from all three vertices: $OA = OB = OC$
- **Method:** Set up $OA^2 = OB^2$ and $OB^2 = OC^2$ → two linear equations → solve simultaneously

### 4.4 Orthocentre

- Intersection of altitudes (lines through vertices perpendicular to opposite sides)
- **Method:** Find equations of two altitudes, solve simultaneously

### 4.5 Euler Line (Key Result)

**Circumcentre O, centroid G, orthocentre O' are collinear.**

$$O'G : OG = 2 : 1$$

---

## 5. Shifting of Origin

*Image ref: images/page-1213-img-4.jpg* (origin shift diagram)

If origin shifts to $O'(h, k)$:

| Conversion | Formula |
|------------|---------|
| Old → New | $x = X + h$, $y = Y + k$ |
| New → Old | $X = x - h$, $Y = y - k$ |
| Old origin in new system | $(-h, -k)$ |

**Symbol meanings:**
- $(x, y)$ = old coordinates
- $(X, Y)$ = new coordinates
- $(h, k)$ = new origin in old system

---

## 6. Straight Lines — Complete Treatment

### 6.1 General Form and Slope

**General form:** $ax + by + c = 0$

**Slope (gradient):**
$$m = \tan \theta = -\frac{a}{b}$$

**Derivation:** $ax + by + c = 0 \Rightarrow y = -\frac{a}{b}x - \frac{c}{b} \Rightarrow y = mx + c$

**Slope from two points:**
$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\text{rise}}{\text{run}}$$

*Image refs: images/page-1214-img-5.jpg, images/page-1214-img-6.jpg* (slope diagrams)

### 6.2 Standard Forms of Line Equations

| Form | Equation | When to Use |
|------|----------|-------------|
| **Slope-Intercept** | $y = mx + c$ | Slope and y-intercept known |
| **Point-Slope** | $y - y_1 = m(x - x_1)$ | Slope and one point known |
| **Two-Point** | $y - y_1 = \frac{y_2 - y_1}{x_2 - x_1}(x - x_1)$ | Two points known |
| **Intercept** | $\frac{x}{a} + \frac{y}{b} = 1$ | x and y intercepts known |
| **Normal** | $x\cos\alpha + y\sin\alpha = p$ | Perpendicular distance from origin known |
| **Parametric** | $\frac{x - x_1}{\cos\theta} = \frac{y - y_1}{\sin\theta} = r$ | Direction and distance along line |

**Symbol meanings:**
- $m$ = slope, $c$ = y-intercept
- $a$ = x-intercept, $b$ = y-intercept
- $p$ = perpendicular distance from origin
- $\alpha$ = angle normal makes with x-axis
- $\theta$ = angle line makes with x-axis
- $r$ = distance from point $(x_1, y_1)$ along the line

### 6.3 Lines Parallel to Axes

| Line | Equation |
|------|----------|
| Parallel to x-axis at distance k | $y = k$ |
| Parallel to y-axis at distance h | $x = h$ |
| x-axis | $y = 0$ |
| y-axis | $x = 0$ |

### 6.4 Angle Between Two Lines

For lines with slopes $m_1$ and $m_2$:

$$\tan \theta = \pm \left(\frac{m_2 - m_1}{1 + m_1 m_2}\right)$$

*Image ref: images/page-1214-img-7.jpg* (angle between lines diagram)

**Alternative form** (for lines $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$):

$$\theta = \tan^{-1} \left| \frac{a_2 b_1 - a_1 b_2}{a_1 a_2 + b_1 b_2} \right|$$

### 6.5 Parallelism and Perpendicularity

| Condition | Relationship |
|-----------|--------------|
| **Parallel** | $m_1 = m_2$ |
| **Perpendicular** | $m_1 \cdot m_2 = -1$ |

For lines in general form $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$:

| Condition | Relationship |
|-----------|--------------|
| **Coincident** | $\frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}$ |
| **Parallel** | $\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$ |
| **Intersecting** | $\frac{a_1}{a_2} \neq \frac{b_1}{b_2}$ |
| **Perpendicular** | $a_1a_2 + b_1b_2 = 0$ |

### 6.6 Distance Formulae

**Point to line distance:** Perpendicular distance from $(x_1, y_1)$ to $ax + by + c = 0$:

$$p = \frac{|ax_1 + by_1 + c|}{\sqrt{a^2 + b^2}}$$

**Distance between parallel lines** $ax + by + c_1 = 0$ and $ax + by + c_2 = 0$:

$$d = \left| \frac{c_2 - c_1}{\sqrt{a^2 + b^2}} \right|$$

**Fast method:** Pick any point on one line (set $x = 0$ or $y = 0$), then use point-to-line distance formula.

### 6.7 Point of Intersection of Two Lines

For lines $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$:

$$x = \frac{b_1 c_2 - b_2 c_1}{a_1 b_2 - a_2 b_1}, \quad y = \frac{c_1 a_2 - c_2 a_1}{a_1 b_2 - a_2 b_1}$$

(Valid when $a_1b_2 - a_2b_1 \neq 0$, i.e., lines are not parallel)

### 6.8 Concurrency of Three Lines

Lines $a_1x + b_1y + c_1 = 0$, $a_2x + b_2y + c_2 = 0$, $a_3x + b_3y + c_3 = 0$ are concurrent if:

$$\left| \begin{array}{ccc} a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3 \end{array} \right| = 0$$

**Fast method:** Find intersection of any two lines, check if it satisfies the third equation.

### 6.9 Family of Lines Through Intersection

Any line through the intersection of $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$:

$$(a_1x + b_1y + c_1) + \lambda(a_2x + b_2y + c_2) = 0$$

where $\lambda$ = arbitrary constant.

### 6.10 Angle Bisectors

For lines $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$:

$$\frac{a_1x + b_1y + c_1}{\sqrt{a_1^2 + b_1^2}} = \pm \frac{a_2x + b_2y + c_2}{\sqrt{a_2^2 + b_2^2}}$$

**Trap:** The sign of constant terms matters. If both constants are positive, the origin-side bisector uses the **negative** sign.

### 6.11 Position of a Point Relative to a Line

For line $ax + by + c = 0$ (with $c \neq 0$):
- Point P$(x_1, y_1)$ is on the **origin side** if $ax_1 + by_1 + c$ and $c$ have the **same sign**
- If $c > 0$: P is on origin side if $ax_1 + by_1 + c > 0$

---

## 7. Figure Identification

| Figure | Conditions |
|--------|------------|
| **Square** | Four sides equal AND diagonals equal |
| **Rhombus** | Four sides equal |
| **Rectangle** | Opposite sides equal AND diagonals equal |
| **Parallelogram** | Opposite sides equal |
| **Parallelogram but not rectangle** | Opposite sides equal, diagonals NOT equal |
| **Rhombus but not square** | All sides equal, diagonals NOT equal |

**Key result:** If vertices of a triangle have **integral coordinates**, the triangle **cannot be equilateral**.

---

## 8. Worked Examples

### Example 1 (Easy — Distance & Triangle Type)

**Q:** Show that the triangle with vertices A(4, 3), B(7, −1), C(9, 3) is isosceles.

**Solution:**
$$AB = \sqrt{(7-4)^2 + (-1-3)^2} = \sqrt{9 + 16} = 5$$
$$BC = \sqrt{(9-7)^2 + (3-(-1))^2} = \sqrt{4 + 16} = 2\sqrt{5}$$
$$CA = \sqrt{(9-4)^2 + (3-3)^2} = \sqrt{25 + 0} = 5$$

Since $AB = CA = 5$, the triangle is **isosceles**.

---

### Example 2 (Easy — Section Formula)

**Q:** Find the point dividing the segment joining A(−3, 2) and B(5, 4) internally in ratio 2:3.

**Solution:**
$$x = \frac{2(5) + 3(-3)}{2 + 3} = \frac{10 - 9}{5} = \frac{1}{5}$$
$$y = \frac{2(4) + 3(2)}{2 + 3} = \frac{8 + 6}{5} = \frac{14}{5}$$

**Answer:** $\left(\frac{1}{5}, \frac{14}{5}\right)$

---

### Example 3 (Medium — Circumcentre)

**Q:** Find the circumcentre of triangle with vertices A(8, 6), B(8, −2), C(2, −2).

**Solution:**
Let circumcentre be O(x, y). Since $OA = OB = OC$:

$$OA^2 = OB^2: (x-8)^2 + (y-6)^2 = (x-8)^2 + (y+2)^2$$
$$(y-6)^2 = (y+2)^2 \Rightarrow y^2 - 12y + 36 = y^2 + 4y + 4 \Rightarrow -16y = -32 \Rightarrow y = 2$$

$$OB^2 = OC^2: (x-8)^2 + (2+2)^2 = (x-2)^2 + (2+2)^2$$
$$(x-8)^2 = (x-2)^2 \Rightarrow x^2 - 16x + 64 = x^2 - 4x + 4 \Rightarrow -12x = -60 \Rightarrow x = 5$$

**Answer:** Circumcentre = (5, 2)

---

### Example 4 (Medium — Line Equation)

**Q:** Find the equation of the line passing through (2, −3) with slope $\frac{5}{4}$.

**Solution (Point-slope form):**
$$y - (-3) = \frac{5}{4}(x - 2)$$
$$y + 3 = \frac{5}{4}x - \frac{5}{2}$$
$$4y + 12 = 5x - 10$$
$$5x - 4y = 22$$

**Answer:** $5x - 4y = 22$

---

### Example 5 (Medium — Distance Between Parallel Lines)

**Q:** Find the distance between the parallel lines $3x + 4y - 12 = 0$ and $3x + 4y + 14 = 0$.

**Solution:**
$$d = \left| \frac{14 - (-12)}{\sqrt{3^2 + 4^2}} \right| = \left| \frac{26}{5} \right| = \frac{26}{5}$$

**Answer:** $\frac{26}{5}$ units

---

### Example 6 (Advanced — Orthocentre)

**Q:** Find the orthocentre of triangle with vertices A(1, 2), B(2, 3), C(4, 3).

**Solution:**
- BC is horizontal (both y = 3), so altitude from A is vertical: **x = 1**
- Slope of AC = $\frac{3-2}{4-1} = \frac{1}{3}$, so altitude from B has slope = −3
- Equation of altitude from B: $y - 3 = -3(x - 2) \Rightarrow y - 3 = -3x + 6 \Rightarrow 3x + y = 9$
- Intersection with x = 1: $3(1) + y = 9 \Rightarrow y = 6$

**Answer:** Orthocentre = (1, 6)

---

### Example 7 (Advanced — Area by Rectangle Method)

**Q:** Find the area of triangle with vertices (−7, 4), (3, −2), (−1, −5).

**Solution (Rectangle method):**
- Enclose in rectangle: width = 3 − (−7) = 10, height = 4 − (−5) = 9
- Rectangle area = 90
- Corner triangles:
  - Triangle I: $\frac{1}{2} \times 10 \times 6 = 30$
  - Triangle II: $\frac{1}{2} \times 4 \times 3 = 6$
  - Triangle III: $\frac{1}{2} \times 6 \times 9 = 27$
- Desired area = 90 − (30 + 6 + 27) = 90 − 63 = **27**

*Image ref: images/page-1230-img-13.jpg* (rectangle method diagram)

**Answer:** 27 sq units

---

### Example 8 (Advanced — Concurrency with Discriminant)

**Q:** Find the minimum value of $|c|$ such that the lines $y = mx + 4$, $x = m + c$, and $y = 3$ are concurrent.

**Solution:**
- From $y = 3$ and $x = m + c$: point of intersection is $(m + c, 3)$
- This point lies on $y = mx + 4$: $3 = m(m + c) + 4$
- $m^2 + cm + 1 = 0$
- For real $m$: discriminant $\geq 0$: $c^2 - 4 \geq 0 \Rightarrow |c| \geq 2$

**Answer:** Minimum $|c| = 2$

---

### Example 9 (Advanced — Circle Constraint)

**Q:** Points (1, 1) and (1, 5) lie on a circle. Which of the following cannot be its area?
(a) $2\sqrt{2}\pi$ (b) $4\pi$ (c) $5\pi$ (d) $9\pi$

**Solution:**
- Distance between points = 4
- This is a chord, so diameter $\geq 4$
- Radius $\geq 2$, so area $\geq 4\pi$
- $2\sqrt{2}\pi \approx 2.83\pi < 4\pi$

**Answer:** (a) $2\sqrt{2}\pi$

---

### Example 10 (Advanced — Integral Points Counting)

**Q:** Number of points with integral coordinates strictly inside the triangle with vertices (0, 0), (0, 21), (21, 0).

**Solution:**
- Points on line $x + y = k$ (for $k = 1$ to $20$) inside the triangle
- For each $k$: $k - 1$ points (excluding endpoints on axes)
- Total = $1 + 2 + 3 + \ldots + 19 = \frac{19 \times 20}{2} = 190$

**Answer:** 190

---

## 9. Decision Rules — Which Formula to Use

| Problem Type | Formula/Method |
|--------------|----------------|
| Distance between two points | Distance formula |
| Point dividing segment in ratio | Section formula (internal/external) |
| Area of triangle given vertices | Determinant/shoelace formula |
| Check collinearity | Area = 0 OR slopes equal |
| Find centroid | Average of coordinates |
| Find incentre | Weighted by opposite sides |
| Find circumcentre | Equate distances from vertices |
| Find orthocentre | Intersect two altitudes |
| Equation of line given slope + point | Point-slope form |
| Equation of line given two points | Two-point form |
| Equation of line given intercepts | Intercept form |
| Line parallel to given line | Same slope, different constant |
| Line perpendicular to given line | Negative reciprocal slope |
| Distance from point to line | $\frac{|ax_1 + by_1 + c|}{\sqrt{a^2 + b^2}}$ |
| Distance between parallel lines | $\frac{|c_2 - c_1|}{\sqrt{a^2 + b^2}}$ |
| Line through intersection of two lines | Family: $L_1 + \lambda L_2 = 0$ |
| Angle bisectors | Equate normalized line equations |
| Identify quadrilateral type | Check sides and diagonals |

---

## 10. Common Traps & Warnings

1. **Integral coordinates ⇒ cannot form equilateral triangle** — always check this in MCQ.

2. **External division formula** uses minus signs in both numerator and denominator. Don't confuse with internal division.

3. **Slope of vertical line is undefined** — check for lines parallel to y-axis before computing slope.

4. **Area formula gives absolute value** — when setting area equal to a given value, use $\pm$ (two possible answers).

5. **Sign of constant terms in angle bisectors** — if both constants are positive, the origin-side bisector uses the negative sign.

6. **$k \neq 1$ in equal-intercept problems** — if $k = 1$, the line passes through origin and intercepts are zero.

7. **Discriminant condition** — for real slopes in concurrency problems, discriminant $\geq 0$.

8. **Circle diameter ≥ chord distance** — area must be at least $\pi \times (\text{half chord})^2$.

9. **Parallel vs coincident lines** — parallel: $\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$; coincident: all three ratios equal.

10. **Perpendicular condition** — $m_1 \cdot m_2 = -1$ only works for non-vertical lines. For general form: $a_1a_2 + b_1b_2 = 0$.

---

## 11. Timed Strategy for CAT

### Time Allocation (per question: 1.5–2 minutes)

| Step | Action | Time |
|------|--------|------|
| 1 | Read question, identify formula type | 10–15 sec |
| 2 | Write down given values | 10 sec |
| 3 | Apply formula directly | 30–45 sec |
| 4 | Verify with quick check (substitute back) | 15–20 sec |

### Speed Techniques

1. **Shoelace formula** for polygon areas — faster than determinant expansion.

2. **Midpoint method** for parallelogram vertices — diagonals bisect each other.

3. **Slope comparison** for collinearity — faster than area calculation.

4. **Family of lines** approach — avoids solving simultaneous equations.

5. **Rectangle method** for triangle area — visual and quick for non-integer results.

### When to Skip

- Problems requiring heavy simultaneous equations with messy fractions
- Questions with multiple nested conditions (rare in CAT)
- If you don't recognize the formula within 20 seconds, skip and return later

---

## 12. Final Revision Sheet

### Formula Card

| Concept | Formula |
|---------|---------|
| Distance | $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ |
| Section (internal) | $\left(\frac{mx_2+nx_1}{m+n}, \frac{my_2+ny_1}{m+n}\right)$ |
| Section (external) | $\left(\frac{mx_2-nx_1}{m-n}, \frac{my_2-ny_1}{m-n}\right)$ |
| Triangle area | $\frac{1}{2}\|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)\|$ |
| Centroid | $\left(\frac{x_1+x_2+x_3}{3}, \frac{y_1+y_2+y_3}{3}\right)$ |
| Incentre | $\left(\frac{ax_1+bx_2+cx_3}{a+b+c}, \frac{ay_1+by_2+cy_3}{a+b+c}\right)$ |
| Slope | $\frac{y_2-y_1}{x_2-x_1} = -\frac{a}{b}$ |
| Angle between lines | $\tan\theta = \pm\frac{m_2-m_1}{1+m_1m_2}$ |
| Parallel | $m_1 = m_2$ |
| Perpendicular | $m_1 \cdot m_2 = -1$ |
| Point-line distance | $\frac{\|ax_1+by_1+c\|}{\sqrt{a^2+b^2}}$ |
| Parallel line distance | $\frac{\|c_2-c_1\|}{\sqrt{a^2+b^2}}$ |
| Line family | $(a_1x+b_1y+c_1) + \lambda(a_2x+b_2y+c_2) = 0$ |
| Angle bisectors | $\frac{a_1x+b_1y+c_1}{\sqrt{a_1^2+b_1^2}} = \pm\frac{a_2x+b_2y+c_2}{\sqrt{a_2^2+b_2^2}}$ |

### Quick Checks

- **Collinear:** Area = 0 OR slopes equal
- **Right angle:** $m_1 \cdot m_2 = -1$ OR $AB^2 + BC^2 = AC^2$
- **Parallelogram:** Opposite sides equal
- **Rhombus:** All sides equal
- **Rectangle:** Opposite sides equal + diagonals equal
- **Square:** All sides equal + diagonals equal
- **Euler line:** Circumcentre, centroid, orthocentre collinear with $O'G : OG = 2:1$

### Key Results to Memorize

1. Integral coordinates ⇒ triangle cannot be equilateral
2. Circumcentre, centroid, orthocentre are collinear (Euler line)
3. Centroid divides Euler line in ratio 2:1 from orthocentre
4. Diagonals of parallelogram bisect each other
5. Diagonals of rhombus are perpendicular
6. Diagonals of rectangle are equal
7. Diagonals of square are equal and perpendicular

---

*Source: Quantitative Aptitude Quantum CAT by Sarvesh K. Verma, Chapter 21, pp. 1211–1230*
