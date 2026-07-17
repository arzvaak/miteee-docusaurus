---
title: Algebra
description: A concise SSC CGL lesson on identities, linear equations, simultaneous equations, quadratics, polynomials, inequalities, algebraic fractions, and progressions.
tags: [ssc-cgl, quantitative-aptitude, algebra]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for algebraic identities, equations, and polynomials](/img/ssc-cgl/algebra-map.svg)
*Preserve signs, factor before expanding, reject extraneous roots, and reverse an inequality whenever multiplying or dividing by a negative number.*

Algebra is direct when an identity or factor appears immediately. Mark and return when expansion increases complexity, denominators create many restrictions, or a word problem has not yet been reduced to the right unknowns.

## 1. Use Identities in Both Directions

$$ (a+b)^2=a^2+2ab+b^2 $$
$$ (a-b)^2=a^2-2ab+b^2 $$
$$ a^2-b^2=(a-b)(a+b) $$
$$ (a+b)^3=a^3+b^3+3ab(a+b) $$
$$ a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2) $$

Use identities to factor as well as expand. The middle sign in $a^3+b^3$’s quadratic factor is negative; in $a^3-b^3$ it is positive.

Another useful relation is

$$a^2+b^2=(a+b)^2-2ab=(a-b)^2+2ab.$$

It allows a value to be found from symmetric information without solving for $a$ and $b$ separately. If $a+b=10$ and $ab=21$, then $a^2+b^2=100-42=58$. Likewise, $(a-b)^2=(a+b)^2-4ab=16$, so $|a-b|=4$; the sign of $a-b$ needs extra information.

**Worked example**

$103^2-97^2=(103-97)(103+97)=6\times200=1200$.

**Self-check**

Factor $x^2-49$.

<details>
<summary>Answer and explanation</summary>

Difference of squares: $(x-7)(x+7)$.
</details>

## 2. Solve Linear Equations While Preserving Equality

For $ax+b=c$ with $a\ne0$,

$$x=\frac{c-b}{a}.$$

Perform the same operation on both sides. Clear denominators by multiplying by an LCM, but record restrictions where denominators contain the variable.

Translate a verbal condition before calculating. “Five more than twice a number” is $2x+5$, whereas “five times the number, increased by two” is $5x+2$. Consecutive integers may be written $x,x+1,x+2$; consecutive even integers as $2x,2x+2,2x+4$. After solving, check requirements such as positivity, integrality, or an age being realistic.

**Worked example**

Solve $3(x-2)+5=2x+9$. Expanding gives $3x-1=2x+9$, so $x=10$.

**Self-check**

Solve $x/3+x/4=14$.

<details>
<summary>Answer and explanation</summary>

Multiply by 12: $4x+3x=168$, so $x=24$.
</details>

## 3. Eliminate One Variable in Simultaneous Equations

For two linear equations, scale and add/subtract to eliminate a variable, or substitute when one variable is already isolated. A unique solution exists when the lines are not parallel.

If elimination produces $0=0$, the equations describe the same line and have infinitely many solutions. If it produces a false statement such as $0=5$, the lines are parallel and no pair satisfies both. Do not force a numerical answer in either case.

**Worked example**

Solve $2x+y=11$ and $x-y=1$. Add the equations to get $3x=12$, so $x=4$ and $y=3$.

**Self-check**

Solve $x+y=9$ and $x-y=3$.

<details>
<summary>Answer and explanation</summary>

Adding gives $2x=12$, so $x=6$ and $y=3$.
</details>

## 4. Factor or Use the Quadratic Formula

For $ax^2+bx+c=0$, $a\ne0$,

$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}.$$

The discriminant $D=b^2-4ac$ determines real roots: $D>0$ two distinct, $D=0$ repeated, $D<0$ no real roots. If roots are $\alpha,\beta$,

$$\alpha+\beta=-\frac ba,\qquad \alpha\beta=\frac ca.$$

The root relations can evaluate symmetric expressions directly. For example,

$$\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta.$$

They do not identify which root is $\alpha$ or $\beta$. When a quadratic comes from squaring an equation, substitute every candidate into the original equation because squaring can introduce an extraneous root.

**Worked example**

$x^2-7x+12=0$ factors as $(x-3)(x-4)=0$, so roots are 3 and 4.

**Self-check**

Find the discriminant and real-root count of $x^2+4x+4=0$.

<details>
<summary>Answer and explanation</summary>

$D=4^2-4(1)(4)=0$, so there is one repeated real root, $x=-2$.
</details>

## 5. Use Factor and Remainder Theorems

When polynomial $P(x)$ is divided by $x-a$, remainder is $P(a)$. Thus $x-a$ is a factor exactly when $P(a)=0$.

For division by $ax-b$, first find its zero $x=b/a$; the remainder is $P(b/a)$. The shortcut “substitute $b$” works only for a divisor of the form $x-b$.

**Worked example**

For $P(x)=x^3-4x+5$, remainder on division by $x-2$ is $P(2)=8-8+5=5$.

**Self-check**

Is $x+1$ a factor of $x^3+2x^2-x-2$?

<details>
<summary>Answer and explanation</summary>

Evaluate at $x=-1$: $-1+2+1-2=0$. Yes, $x+1$ is a factor.
</details>

## 6. Respect Domains, Inequalities, and Sequences

For algebraic fractions, exclude values making any original denominator zero. Cross multiplication is safe only after considering denominator signs in inequalities.

For an equation such as

$$\frac{x+1}{x-2}=3,$$

first record $x\ne2$, then solve $x+1=3x-6$ to get $x=7/2$, which satisfies the restriction. Cancelling a factor can also hide an excluded value: $(x-2)(x+3)/(x-2)=x+3$ only for $x\ne2$.

Multiplying or dividing an inequality by a negative number reverses it. For example, $-2x>6$ gives $x<-3$.

For an arithmetic progression with first term $a$ and common difference $d$,

$$a_n=a+(n-1)d,$$

$$S_n=\frac n2[2a+(n-1)d]=\frac n2(a+l).$$

The formula uses $n$ as a positive integer. If the last term is given, first verify that $n=(l-a)/d+1$ is a positive integer; otherwise the stated value is not a term of that progression.

**Self-check**

Find the 20th term of $5,8,11,\ldots$.

<details>
<summary>Answer and explanation</summary>

$a_{20}=5+19(3)=62$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Expand $(2x-3)^2$.

<details>
<summary>Answer and explanation</summary>

$4x^2-12x+9$.
</details>

### Question 2

Solve $5x-7=3x+9$.

<details>
<summary>Answer and explanation</summary>

$2x=16$, so $x=8$.
</details>

### Question 3

Find the roots of $x^2-9=0$.

<details>
<summary>Answer and explanation</summary>

$(x-3)(x+3)=0$, so $x=3$ or $x=-3$.
</details>

### Question 4

Find the remainder when $2x^2+3x-1$ is divided by $x-2$.

<details>
<summary>Answer and explanation</summary>

$P(2)=2(4)+6-1=13$.
</details>

### Question 5

Find the sum of the first 10 terms of $2,5,8,\ldots$.

<details>
<summary>Answer and explanation</summary>

$a=2,d=3$. $S_{10}=10[4+27]/2=155$.
</details>

Mastery means every solution is checked against the original domain and signs. Continue with [Algebra focused practice](/exams/ssc-cgl/practice/algebra).
