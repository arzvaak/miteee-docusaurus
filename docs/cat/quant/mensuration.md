---
title: "CAT Quant — Mensuration"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 10
topic: "mensuration"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# CAT Quant — Mensuration: Complete Study Notes

## 1. Concept Map

```
MENSURATION
│
├── 2-D FIGURES (Planes)
│   ├── Quadrilaterals
│   │   ├── Rectangle
│   │   ├── Square
│   │   ├── Parallelogram
│   │   ├── Rhombus
│   │   ├── Trapezium
│   │   └── General Quadrilateral
│   ├── Triangles
│   │   ├── Scalene
│   │   ├── Equilateral
│   │   ├── Isosceles
│   │   ├── Right-Angled
│   │   └── Isosceles Right-Angled
│   ├── Regular Polygons
│   │   ├── Hexagon
│   │   └── Octagon
│   ├── Circles
│   │   ├── Circle
│   │   ├── Semicircle
│   │   ├── Quadrant
│   │   ├── Sector
│   │   ├── Segment
│   │   └── Ring/Annulus
│   └── Paths & Pathways
│
└── 3-D FIGURES (Solids)
    ├── Cuboid & Cube
    ├── Right Circular Cylinder
    ├── Right Circular Cone
    │   └── Frustum of Cone
    ├── Sphere
    │   ├── Hemisphere
    │   ├── Spherical Shell
    │   ├── Spherical Cap
    │   ├── Zone/Frustum of Sphere
    │   └── Sector of Sphere
    ├── Prism
    └── Pyramid
```

---

## 2. Foundations & Core Concepts

### 2.1 What is Mensuration?

Mensuration is the **science of measurement** of lengths, areas, and volumes. It deals with two types of figures:

- **Planes (2-D):** Have length and breadth; occupy surface area.
- **Solids (3-D):** Have length, breadth, and height; occupy space (volume).

> **CAT Weightage:** Mensuration contributes approximately **6–8%** of problems in the Quantitative Aptitude section. It is generally **easier than Geometry** — questions are less complex. Students weaker in algebra/logical sections should prioritize this chapter. *(Source: page 470)*

### 2.2 Unit Conversions

**Length:**
$$1 \text{ km} = 10 \text{ hm} = 100 \text{ dam} = 1000 \text{ m} = 10^4 \text{ dm} = 10^5 \text{ cm} = 10^6 \text{ mm}$$

**Area:**
$$1 \text{ hectare} = 10{,}000 \text{ m}^2$$
$$1 \text{ are} = 100 \text{ m}^2$$
$$1 \text{ m}^2 = 100 \text{ dm}^2 = 10^4 \text{ cm}^2 = 10^6 \text{ mm}^2$$

**Volume:**
$$1 \text{ m}^3 = 1000 \text{ L} = 1 \text{ kL}$$

**Constants to Memorize:**
$$\sqrt{2} = 1.414, \quad \sqrt{3} = 1.732, \quad \sqrt{5} = 2.236, \quad \sqrt{6} = 2.45, \quad \pi = \frac{22}{7} \approx 3.1416$$

**Key Relationship:**
$$\text{Weight} = \text{Volume} \times \text{Density}$$

---

## 3. 2-D Figures: Complete Formula Bank

### 3.1 Rectangle

| Property | Formula |
|----------|---------|
| Area | $A = l \times b$ |
| Perimeter | $P = 2(l + b)$ |
| Diagonal | $d = \sqrt{l^2 + b^2}$ |

**Key Fact:** The maximum length of a rod that can be placed on a rectangular floor equals the **diagonal** of the floor. *(Source: page 473, image: images/page-0473-img-0.jpg)*

### 3.2 Square

| Property | Formula |
|----------|---------|
| Area | $A = a^2 = \frac{d^2}{2}$ |
| Perimeter | $P = 4a$ |
| Diagonal | $d = a\sqrt{2}$ |

### 3.3 Triangles

#### Scalene Triangle
- **Area:** $A = \frac{1}{2} \times b \times h$ or **Hero's formula**: $A = \sqrt{s(s-a)(s-b)(s-c)}$
- **Semi-perimeter:** $s = \frac{a+b+c}{2}$
- **Perimeter:** $P = a + b + c = 2s$

#### Equilateral Triangle
- **Height:** $h = \frac{\sqrt{3}}{2}a$
- **Area:** $A = \frac{\sqrt{3}}{4}a^2 = \frac{1}{2}ah$
- **Perimeter:** $P = 3a$
- **Inradius:** $r = \frac{a}{2\sqrt{3}}$
- **Circumradius:** $R = \frac{a}{\sqrt{3}}$

> **Important Property:** The perpendiculars from all three vertices of an equilateral triangle intersect at a point (centroid) dividing each median in the ratio **2:1** from vertex to base. This point is the centre of both the incircle and circumcircle. *(Source: page 476, images: images/page-0476-img-2.jpg, images/page-0476-img-3.jpg, images/page-0476-img-4.jpg)*

#### Isosceles Triangle
- **Height:** $h = \frac{\sqrt{4a^2 - b^2}}{2}$ (where $a$ = equal sides, $b$ = base)
- **Area:** $A = \frac{1}{2}bh = \frac{b}{4}\sqrt{4a^2 - b^2}$
- **Perimeter:** $P = 2a + b$

#### Right-Angled Triangle
- **Hypotenuse:** $d = \sqrt{b^2 + h^2}$
- **Area:** $A = \frac{1}{2} \times b \times h$
- **Perimeter:** $P = b + h + d$
- **Inradius:** $r = \frac{b + h - d}{2} = \frac{\text{Area}}{s}$

#### Isosceles Right-Angled Triangle
- **Hypotenuse:** $d = a\sqrt{2}$ (where $a$ = equal sides)
- **Area:** $A = \frac{1}{2}a^2$
- **Perimeter:** $P = 2a + d$

### 3.4 Quadrilaterals

#### General Quadrilateral
- **Area:** $A = \frac{1}{2} \times d \times (h_1 + h_2)$ where $d$ = diagonal, $h_1, h_2$ = perpendiculars from opposite vertices
- **Area (with diagonals):** $A = \frac{1}{2} \times d_1 \times d_2 \times \sin\theta$ where $\theta$ = angle between diagonals

#### Parallelogram
- **Area:** $A = \text{base} \times \text{height} = ab\sin\theta$ (where $a, b$ = adjacent sides, $\theta$ = included angle)
- **Perimeter:** $P = 2(a + b)$

#### Rhombus
- **Area:** $A = \frac{1}{2} \times d_1 \times d_2 = a^2\sin\theta$
- **Perimeter:** $P = 4a$
- **Side:** $a = \frac{1}{2}\sqrt{d_1^2 + d_2^2}$

#### Trapezium
- **Area:** $A = \frac{a+b}{2} \times h$ (where $a, b$ = parallel sides, $h$ = perpendicular distance)
- **Perimeter:** $P = \text{sum of all four sides}$

### 3.5 Regular Polygons

#### Regular Hexagon
- **Area:** $A = \frac{3\sqrt{3}}{2}a^2$
- **Perimeter:** $P = 6a$
- **Inscribed in circle of radius $r$:** side $= r$
- **Circumscribing circle of radius $r$:** side $= \frac{2r}{\sqrt{3}}$

#### Regular Octagon
- **Area:** $A = 2a^2(1 + \sqrt{2})$
- **Perimeter:** $P = 8a$

### 3.6 Circles

| Figure | Area | Perimeter/Circumference |
|--------|------|------------------------|
| Circle | $\pi r^2$ | $2\pi r$ |
| Semicircle | $\frac{1}{2}\pi r^2$ | $\pi r + 2r$ |
| Quadrant | $\frac{1}{4}\pi r^2$ | $\frac{1}{2}\pi r + 2r$ |
| Ring | $\pi(R^2 - r^2)$ | Outer: $2\pi R$; Inner: $2\pi r$ |

#### Sector of a Circle
- **Arc length:** $l = 2\pi r \times \frac{\theta}{360°}$
- **Area:** $A = \pi r^2 \times \frac{\theta}{360°} = \frac{1}{2} \times r \times l$
- **Perimeter:** $P = l + 2r$

#### Segment of a Circle
- **Area of minor segment:** $A = r^2\left[\frac{\pi\theta}{360°} - \frac{\sin\theta}{2}\right]$
- **Perimeter:** $P = 2r\left[\frac{\pi\theta}{360°} + \sin\left(\frac{\theta}{2}\right)\right]$

### 3.7 Pathways

#### Path Across Middle of Rectangle
- **Area:** $A = (l + b - w)w$
- **Perimeter:** $P = 2(l + b) - 4w = 2(l + b - 2w)$

#### Outer Path Around Rectangle
- **Area:** $A = (l + b + 2w)2w$
- **Perimeter:** Inner: $2(l+b)$; Outer: $2(l+b+4w)$

#### Inner Path in Rectangle
- **Area:** $A = (l + b - 2w)2w$
- **Perimeter:** Outer: $2(l+b)$; Inner: $2(l+b-4w)$

---

## 4. 3-D Figures: Complete Formula Bank

### 4.1 Cuboid & Cube

| Property | Cuboid | Cube |
|----------|--------|------|
| Volume | $V = lbh$ | $V = a^3$ |
| Lateral/Curved SA | $2(l+b)h$ | $4a^2$ |
| Total SA | $2(lb + bh + hl)$ | $6a^2$ |
| Diagonal | $\sqrt{l^2 + b^2 + h^2}$ | $a\sqrt{3}$ |

**Cuboid Facts:** 6 faces, 12 edges, 8 vertices, 4 diagonals. *(Source: page 484, image: images/page-0484-img-15.jpg)*

**Euler's Theorem:** $V + F = E + 2$ (Vertices + Faces = Edges + 2)

**Area of Four Walls of a Room:** $= 2(l + b) \times h$

### 4.2 Right Circular Cylinder

- **Volume:** $V = \pi r^2 h$
- **Curved Surface Area:** $CSA = 2\pi rh$
- **Total Surface Area:** $TSA = 2\pi r(h + r)$
- **Hollow Cylinder Volume:** $V = \pi h(R^2 - r^2)$

### 4.3 Right Circular Cone

- **Volume:** $V = \frac{1}{3}\pi r^2 h$
- **Curved Surface Area:** $CSA = \pi rl$
- **Total Surface Area:** $TSA = \pi r(l + r)$
- **Slant Height:** $l = \sqrt{r^2 + h^2}$

### 4.4 Frustum of Cone

- **Volume:** $V = \frac{\pi}{3}h(r^2 + Rr + R^2)$
- **Curved Surface Area:** $CSA = \pi l(r + R)$
- **Total Surface Area:** $TSA = \pi l(r + R) + \pi(R^2 + r^2)$

### 4.5 Sphere & Related Solids

| Figure | Volume | Curved SA | Total SA |
|--------|--------|-----------|----------|
| Sphere | $\frac{4}{3}\pi r^3$ | — | $4\pi r^2$ |
| Hemisphere | $\frac{2}{3}\pi r^3$ | $2\pi r^2$ | $3\pi r^2$ |
| Spherical Shell | $\frac{4}{3}\pi(R^3 - r^3)$ | — | $4\pi(R^2 + r^2)$ |

#### Spherical Cap
- **Volume:** $V = \frac{\pi h}{6}(h^2 + 3r^2)$ or $V = \frac{\pi h^2}{3}(3R - h)$
- **Lateral SA:** $LSA = 2\pi Rh$
- **Total SA:** $TSA = 2\pi Rh + \pi r^2 = \pi(2r^2 + h^2)$

#### Zone/Frustum of Sphere
- **Volume:** $V = \frac{\pi h}{6}(h^2 + 3r_1^2 + 3r_2^2)$
- **Lateral SA:** $LSA = 2\pi Rh$
- **Total SA:** $TSA = 2\pi(Rh + r_1^2 + r_2^2)$

#### Sector of Sphere
- **Volume:** $V = \frac{2\pi R^2 h}{3}$
- **Total SA:** $TSA = \pi R(2h + r)$

### 4.6 Prism & Pyramid

| Property | Right Prism | Right Pyramid |
|----------|-------------|---------------|
| Volume | Base area × height | $\frac{1}{3} \times$ base area × height |
| Lateral SA | Perimeter of base × height | $\frac{1}{2} \times$ perimeter of base × slant height |
| Total SA | LSA + 2(base area) | LSA + base area |

---

## 5. Fast CAT Methods & Shortcuts

### 5.1 Percentage Change Shortcuts

| Change | Result |
|--------|--------|
| Side increased by 20% | Area increased by **44%** |
| Side doubled | Area increased by **300%** |
| Side doubled | Volume becomes **8 times** |
| Radius & height doubled | Volume becomes **8 times** |
| Radius & height increased 40% | Volume increased ≈ **174.4%** |
| Circumference increased 20% | Area increased **44%** |
| Length +60%, breadth +40% | Area exceeds by **124%** |
| Length doubled, breadth halved | Area change = **0%** |

**General Rule:** For $x\%$ change in linear dimension, area changes by approximately $2x\%$ (for small $x$), and volume changes by approximately $3x\%$.

### 5.2 Maximum Area Principles

- **For a given perimeter:** Circle > Regular polygon > Rectangle > Any other shape
- **For a given perimeter, rectangle with maximum area:** Square ($l = b$)
- **For a given perimeter, triangle with maximum area:** Equilateral triangle
- **For a given volume, minimum surface area:** Sphere
- **For a given volume, maximum surface area:** Tetrahedron

### 5.3 Similar Figures

- **Area ratio** = (linear ratio)²
- **Volume ratio** = (linear ratio)³

This is crucial for cone-cutting problems, nested figures, and scaling problems.

### 5.4 Painted Cube Formulas

For a cube divided into $n^3$ smaller cubes:

| Type | Count |
|------|-------|
| No painted faces | $N_0 = (n-2)^3$ |
| Exactly 1 painted face | $N_1 = 6(n-2)^2$ |
| Exactly 2 painted faces | $N_2 = 12(n-2)$ |
| Exactly 3 painted faces | $N_3 = 8$ (always corners) |

### 5.5 Common Pythagorean Triplets

$$3, 4, 5 \quad | \quad 5, 12, 13 \quad | \quad 8, 15, 17 \quad | \quad 7, 24, 25 \quad | \quad 9, 40, 41$$

Recognizing these saves time in triangle problems.

### 5.6 Key Ratios to Remember

- **Cylinder : Cone** (same base & height) $= 3 : 1$
- **Cylinder : Sphere** (sphere inscribed in cylinder) $= 3 : 2$
- **Cylinder : Hemisphere : Cone** (same base, height = radius) $= 3 : 2 : 1$
- **Square : Square on its diagonal** $= 1 : 2$
- **Area of square : Area of circumscribed circle** $= 2 : \pi$
- **Area of inscribed circle : Area of square** $= \pi : 4$

---

## 6. Worked Examples

### 6.1 Basic Level

**Example 1: Rectangle Diagonal**
> A room is 15 m × 8 m. Find the maximum length of a rod that can be placed on the floor.

**Solution:**
$$\text{Diagonal} = \sqrt{15^2 + 8^2} = \sqrt{225 + 64} = \sqrt{289} = 17 \text{ m}$$

**Answer:** 17 m

---

**Example 2: Path Around Lawn**
> A lawn is 18 m × 12 m with a gravel path 1.5 m wide outside. Find the area of the path.

**Solution (using formula):**
$$\text{Area} = (l + b + 2w)2w = (18 + 12 + 3)(3) = 33 \times 3 = 99 \text{ m}^2$$

**Alternative (total minus inner):**
$$\text{Total} = (18+3)(12+3) = 315 \text{ m}^2; \quad \text{Lawn} = 216 \text{ m}^2; \quad \text{Path} = 99 \text{ m}^2$$

**Answer:** 99 m²

---

**Example 3: Equilateral Triangle**
> Find the area of an equilateral triangle with side $4\sqrt{3}$ cm.

**Solution:**
$$A = \frac{\sqrt{3}}{4}a^2 = \frac{\sqrt{3}}{4} \times (4\sqrt{3})^2 = \frac{\sqrt{3}}{4} \times 48 = 12\sqrt{3} \text{ cm}^2$$

**Answer:** $12\sqrt{3}$ cm²

---

**Example 4: Wheel Revolutions**
> A wheel has radius $1\frac{3}{4}$ m. How many revolutions does it make to cover 11 km?

**Solution:**
$$r = \frac{7}{4} \text{ m}; \quad \text{Circumference} = 2\pi r = 2 \times \frac{22}{7} \times \frac{7}{4} = 11 \text{ m}$$
$$\text{Revolutions} = \frac{11000}{11} = 1000$$

**Answer:** 1000 revolutions

---

**Example 5: Cuboid Properties**
> Find volume, surface area, and diagonal of a cuboid 16 × 18 × 24 cm.

**Solution:**
$$V = 16 \times 18 \times 24 = 6912 \text{ cm}^3$$
$$TSA = 2(16 \times 18 + 18 \times 24 + 24 \times 16) = 2(288 + 432 + 384) = 2208 \text{ cm}^2$$
$$d = \sqrt{256 + 324 + 576} = \sqrt{1156} = 34 \text{ cm}$$

**Answer:** 6912 cm³, 2208 cm², 34 cm

---

### 6.2 Intermediate Level

**Example 6: Cone from Sector**
> A sector of radius 14 cm and angle 60° is folded into a cone. Find its total surface area.

**Solution:**
- Arc length $= \frac{60}{360} \times 2\pi \times 14 = \frac{14\pi}{3}$ cm
- This becomes the circumference of the cone's base: $2\pi r = \frac{14\pi}{3} \Rightarrow r = \frac{7}{3}$ cm
- Slant height $= 14$ cm (radius of sector)
- $TSA = \pi r^2 + \pi rl = \pi\left(\frac{49}{9}\right) + \pi\left(\frac{7}{3}\right)(14) = \pi\left(\frac{49}{9} + \frac{98}{3}\right) = \pi\left(\frac{343}{9}\right)$
- $TSA = \frac{22}{7} \times \frac{343}{9} = 119.78 \text{ cm}^2$

**Answer:** 119.78 cm²

---

**Example 7: Sphere in Cylinder**
> A sphere of radius 9 cm is dropped into a cylindrical vessel of radius 12 cm. Find the rise in water level.

**Solution:**
$$\text{Volume displaced} = \frac{4}{3}\pi(9)^3 = \pi(12)^2 \times h$$
$$h = \frac{\frac{4}{3} \times 729}{144} = \frac{972}{144} = 6.75 \text{ cm}$$

**Answer:** 6.75 cm

---

**Example 8: Cone Cut by Plane**
> A cone of height 15 cm and radius 6 cm is cut by a plane parallel to the base at 4/5 of its height from the base. Find the radius of the smaller cone.

**Solution:**
- Remaining top height $= 15 \times \frac{1}{5} = 3$ cm
- By similarity: $\frac{r}{6} = \frac{3}{15} = \frac{1}{5}$
- $r = \frac{6}{5} = 1.2$ cm

**Answer:** 1.2 cm

---

**Example 9: Horse Grazing**
> A horse is tethered at a corner of a rectangular field (80 m × 60 m) with a rope of 80 m. Find the grazing area.

**Solution:**
- Horse can graze 270° with full 80 m rope: $\frac{3}{4}\pi(80)^2 = 4800\pi$
- At one edge, rope catches at adjacent corner; only 30 m free: $\frac{1}{4}\pi(30)^2 = 225\pi$
- At other edge, only 40 m free: $\frac{1}{4}\pi(40)^2 = 400\pi$
- **Total:** $\pi(4800 + 225 + 400) = 5425\pi \text{ m}^2$

**Answer:** $5425\pi$ m²

---

### 6.3 Advanced Level

**Example 10: Cone Circumscribing Cube**
> A cube is inscribed in a cone. Find the ratio of the cone's volume to the cube's volume.

**Solution:**
- Let cube side $= a$, cone radius $= r$, height $= h$
- Diagonal of cube's top face $= \sqrt{2}a$; distance from centre to edge $= \frac{a}{\sqrt{2}}$
- By similarity: $\frac{r}{h} = \frac{a/\sqrt{2}}{h-a}$
- Also, $r = h\sqrt{2}$ (from geometry of inscribed cube)
- $\frac{a/\sqrt{2}}{h-a} = \sqrt{2} \Rightarrow a = 2(h-a) \Rightarrow h = \frac{3a}{2}$
- $r = \frac{3a}{2} \times \sqrt{2} = \frac{3a\sqrt{2}}{2}$
- **Volume ratio:** $\frac{\frac{1}{3}\pi r^2 h}{a^3} = \frac{\frac{1}{3}\pi \times \frac{9a^2}{2} \times \frac{3a}{2}}{a^3} = \frac{9}{4}\pi = 2.25\pi$

**Answer:** $2.25\pi$

---

**Example 11: Maximum Volume Box**
> A square sheet of side 24 cm has squares of side $x$ cut from each corner. Find $x$ for maximum volume.

**Solution:**
- Base side $= 24 - 2x$, height $= x$
- $V = x(24-2x)^2 = 2(2x)(12-x)(12-x)$
- Sum $2x + (12-x) + (12-x) = 24$ is constant
- **Maximum when all terms equal:** $2x = 12 - x \Rightarrow x = 4$ cm

**Answer:** 4 cm

---

**Example 12: Complex Overlapping Regions**
> Square ABCD has diagonal $10\sqrt{2}$. Two quadrants are drawn with centres at B and D, radius 10. Find the area of the common region of the two quadrants.

**Solution:**
- Side of square $= 10$ cm
- Common region $= 2 \times$ (quadrant area) $-$ (square area)
- $= 2 \times \frac{1}{4}\pi(10)^2 - 10^2 = 50\pi - 100$ sq cm

**Answer:** $(50\pi - 100)$ sq cm

---

## 7. Decision Rules: Which Formula to Use

### For Area Problems:
| If you have... | Use... |
|----------------|--------|
| Base & height of triangle | $\frac{1}{2}bh$ |
| Three sides of triangle | Hero's formula |
| Two sides & included angle | $\frac{1}{2}ab\sin\theta$ |
| Diagonals of rhombus | $\frac{1}{2}d_1d_2$ |
| Parallel sides & height of trapezium | $\frac{a+b}{2} \times h$ |
| Diagonal & perpendiculars of quadrilateral | $\frac{1}{2}d(h_1+h_2)$ |

### For Volume Problems:
| If you have... | Use... |
|----------------|--------|
| Melting/recasting | Volume conservation |
| Water displacement | Volume of object = Volume of displaced water |
| Similar solids | Volume ratio = (linear ratio)³ |
| Cone cut by parallel plane | Similar triangles for dimensions |

### For Optimization Problems:
| Condition | Maximum |
|-----------|---------|
| Fixed perimeter, rectangle | Square |
| Fixed perimeter, any shape | Circle |
| Fixed volume, any solid | Sphere |
| Fixed sum of terms, product | All terms equal |

---

## 8. Common Traps & How to Avoid Them

### Trap 1: Confusing Slant Height with Height
**Problem:** In cone problems, $l \neq h$. Always use $l = \sqrt{r^2 + h^2}$.

### Trap 2: Internal vs External Dimensions
**Problem:** For hollow boxes, subtract $2 \times$ thickness from each dimension to get internal dimensions.

### Trap 3: Integer Division for Packing
**Problem:** When packing cubes into a box, use floor division: $\left\lfloor \frac{L}{a} \right\rfloor \times \left\lfloor \frac{B}{a} \right\rfloor \times \left\lfloor \frac{H}{a} \right\rfloor$

### Trap 4: Surface Area After Cutting
**Problem:** Cutting a cube's corner does NOT change surface area (three faces removed, three new faces appear).

### Trap 5: Hemisphere Height
**Problem:** For a hemisphere, height $= $ radius. When comparing cone, hemisphere, cylinder with equal bases and heights, hemisphere height $= R$.

### Trap 6: Remainder < Divisor
**Problem:** In division problems, the remainder must be less than the divisor. Use this to eliminate options.

### Trap 7: Cube Vertices
**Problem:** A cube has **8 vertices**, not 6. Faces $= 6$, edges $= 12$, vertices $= 8$.

### Trap 8: Percentage Change Direction
**Problem:** A 20% increase followed by 20% decrease is NOT 0% change. It's $1.2 \times 0.8 = 0.96$, i.e., 4% decrease.

### Trap 9: Units Consistency
**Problem:** Always convert to consistent units before calculation. Watch for cm vs m vs km.

### Trap 10: Tethering Problems
**Problem:** When a rope catches at a corner, the effective length reduces. Break the grazing area into sectors with different radii.

---

## 9. Timed Strategy for CAT

### 9.1 Time Allocation
- **Total time for Mensuration:** 8–10 minutes (if 3–4 questions appear)
- **Basic formula questions:** 1–1.5 minutes each
- **Intermediate problems:** 2–3 minutes each
- **Advanced problems:** 3–4 minutes each

### 9.2 Question Selection Strategy

**Attempt First (Easy Marks):**
- Direct formula applications
- Percentage change problems
- Unit conversion problems
- Ratio problems with clear relationships

**Attempt Second (Moderate):**
- Path/cost problems
- Melting/recasting problems
- Water displacement problems
- Cone/cylinder combination problems

**Attempt Last or Skip (Time-Intensive):**
- Complex overlapping regions
- Multi-step optimization
- Problems with intricate figure analysis

### 9.3 Elimination Techniques

1. **Units check:** Eliminate options with wrong units.
2. **Magnitude check:** For area problems, answer must be positive and reasonable.
3. **Ratio check:** If ratio of linear dimensions is $a:b$, area ratio is $a^2:b^2$, volume ratio is $a^3:b^3$.
4. **Boundary check:** For inscribed figures, answer must be less than the containing figure's area.
5. **Option substitution:** For right triangles, test Pythagorean triplets.

### 9.4 Mental Math Shortcuts

- $\pi \approx \frac{22}{7}$ for clean calculations
- $\sqrt{2} \approx 1.414$, $\sqrt{3} \approx 1.732$
- $1 \text{ hectare} = 10{,}000 \text{ m}^2$
- $1 \text{ m}^3 = 1000 \text{ L}$
- Area of equilateral triangle with side $a$: $\approx 0.433a^2$

---

## 10. Final Revision Sheet

### 2-D Quick Reference

| Figure | Area | Perimeter |
|--------|------|-----------|
| Rectangle | $lb$ | $2(l+b)$ |
| Square | $a^2 = \frac{d^2}{2}$ | $4a$ |
| Triangle | $\frac{1}{2}bh$ | $a+b+c$ |
| Equilateral Δ | $\frac{\sqrt{3}}{4}a^2$ | $3a$ |
| Parallelogram | $bh = ab\sin\theta$ | $2(a+b)$ |
| Rhombus | $\frac{1}{2}d_1d_2$ | $4a$ |
| Trapezium | $\frac{a+b}{2}h$ | Sum of sides |
| Hexagon | $\frac{3\sqrt{3}}{2}a^2$ | $6a$ |
| Octagon | $2a^2(1+\sqrt{2})$ | $8a$ |
| Circle | $\pi r^2$ | $2\pi r$ |
| Sector | $\frac{1}{2}rl = \pi r^2\frac{\theta}{360°}$ | $l + 2r$ |

### 3-D Quick Reference

| Figure | Volume | Total SA |
|--------|--------|----------|
| Cuboid | $lbh$ | $2(lb+bh+hl)$ |
| Cube | $a^3$ | $6a^2$ |
| Cylinder | $\pi r^2h$ | $2\pi r(h+r)$ |
| Cone | $\frac{1}{3}\pi r^2h$ | $\pi r(l+r)$ |
| Sphere | $\frac{4}{3}\pi r^3$ | $4\pi r^2$ |
| Hemisphere | $\frac{2}{3}\pi r^3$ | $3\pi r^2$ |
| Frustum | $\frac{\pi h}{3}(r^2+Rr+R^2)$ | $\pi l(r+R)+\pi(R^2+r^2)$ |
| Prism | Base × height | LSA + 2(Base) |
| Pyramid | $\frac{1}{3}$ Base × height | LSA + Base |

### Key Relationships

$$\text{Diagonal of cuboid} = \sqrt{l^2 + b^2 + h^2}$$
$$\text{Slant height of cone} = \sqrt{r^2 + h^2}$$
$$\text{Area of 4 walls} = 2(l+b)h$$
$$\text{Weight} = \text{Volume} \times \text{Density}$$

### Must-Memorize Results

1. Circle has maximum area for given perimeter
2. Sphere has minimum surface area for given volume
3. For similar figures: Area ratio $= (\text{linear ratio})^2$, Volume ratio $= (\text{linear ratio})^3$
4. Painted cube: $N_0=(n-2)^3$, $N_1=6(n-2)^2$, $N_2=12(n-2)$, $N_3=8$
5. Cylinder : Cone (same base & height) $= 3:1$
6. Equilateral triangle: $h = \frac{\sqrt{3}}{2}a$, $r_{in} = \frac{a}{2\sqrt{3}}$, $R_{circ} = \frac{a}{\sqrt{3}}$
7. Maximum rod on floor $=$ diagonal of floor
8. Euler's Theorem: $V + F = E + 2$

---

*End of Chapter 10 Study Notes*
