---
title: "08 - Two-Way ANOVA"
math_syntax: typst
---

# Chapter 08 — Two-Way ANOVA

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [07 - Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing)

> [!important] Later material
> This chapter covers two-way ANOVA, which lies beyond the immediate exam boundary. It is retained for completeness and future reference.

> [!summary] Core idea
> Two-way ANOVA extends one-way ANOVA by simultaneously testing two categorical factors and their interaction on a continuous response variable.

## 1. What two-way ANOVA tests

Two-way ANOVA tests three hypotheses simultaneously:

- **Factor A main effect:** Does the first factor influence the response?
- **Factor B main effect:** Does the second factor influence the response?
- **Interaction A×B:** Does the effect of one factor depend on the level of the other?

An interaction means the factors do not operate independently. When an interaction is significant, interpreting main effects alone can be misleading.

## 2. Design layout

A two-way design arranges observations in a grid of cells, one cell per combination of factor levels:

| Factor B → | Level 1 | Level 2 | ... |
| --- | --- | --- | --- |
| **Factor A, Level 1** | $n_(11)$ observations | $n_(12)$ observations | ... |
| **Factor A, Level 2** | $n_(21)$ observations | $n_(22)$ observations | ... |

Here $n_(i j)$ is the number of observations in cell $(i, j)$. In a balanced design every cell has the same $n$.

## 3. Hypotheses

For Factor A:

$$
"H"_(0A): alpha_1 = alpha_2 = dots.h = alpha_a = 0 quad "vs" quad "H"_(1A): "at least one" alpha_i != 0
$$

For Factor B:

$$
"H"_(0B): beta_1 = beta_2 = dots.h = beta_b = 0 quad "vs" quad "H"_(1B): "at least one" beta_j != 0
$$

For the interaction:

$$
"H"_(0 "AB"): (alpha beta)_(i j) = 0 " for all" i, j quad "vs" quad "H"_(1 "AB"): "at least one" (alpha beta)_(i j) != 0
$$

Here $alpha_i$ and $beta_j$ are the main effects of Factors A and B, and $(alpha beta)_(i j)$ is the interaction effect at cell $(i, j)$.

## 4. Sum-of-squares decomposition

The total corrected sum of squares partitions into four components:

$$
"SS"_T = "SS"_A + "SS"_B + "SS"_(A B) + "SS"_E
$$

where:

- $bar(x)_(i j)$ is the cell mean, $bar(x)_(i dot)$ is the Factor A level mean, $bar(x)_(dot j)$ is the Factor B level mean, $bar(x)$ is the grand mean, and $n_(i j)$ is the cell size.
- $a$ and $b$ are the numbers of levels of Factors A and B.
- $N$ is the total number of observations.

Degrees of freedom:

| Source | df |
| --- | ---: |
| Factor A | $a - 1$ |
| Factor B | $b - 1$ |
| Interaction A×B | $(a - 1)(b - 1)$ |
| Error | $N - a b$ |
| Total | $N - 1$ |

For a balanced design with $n$ observations per cell, $N = a b n$ and the error df is $a b (n - 1)$.

Each mean square is its sum of squares divided by its df. Each F statistic is the effect mean square divided by the error mean square.

## 5. Worked example: teaching method and gender

### Data

| Method/gender | Male (B1) | Female (B2) |
| --- | --- | --- |
| Method 1 (A1) | 85, 88, 90 | 82, 85, 87 |
| Method 2 (A2) | 78, 80, 83 | 75, 77, 79 |
| Method 3 (A3) | 92, 95, 97 | 90, 93, 95 |

Factor A = teaching method (3 levels), Factor B = gender (2 levels), response = test score. Each cell has $n = 3$ observations, so $N = 18$.

### ANOVA table

| Source | SS | df | MS | F | p |
| --- | ---: | ---: | ---: | ---: | ---: |
| Teaching method (A) | 675.000 | 2 | 337.500 | 56.776 | < 0.001 |
| Gender (B) | 34.722 | 1 | 34.722 | 5.841 | 0.0325 |
| A × B interaction | 1.444 | 2 | 0.722 | 0.121 | 0.8867 |
| Error | 71.333 | 12 | 5.944 | — | — |
| Total | 782.500 | 17 | — | — | — |

### Interpretation

At the 5% level:

- **Teaching method** is significant ($p < 0.001$). The three methods produce different mean scores.
- **Gender** is significant ($p = 0.0325$). Male and female students have different mean scores.
- **Interaction** is not significant ($p = 0.8867$). The effect of teaching method does not depend on gender, so the method differences are consistent across genders.

## 6. Worked example: study method and anxiety

### Data

| Study method | Anxiety level | Test scores |
| --- | --- | --- |
| Method A | Low anxiety | 85, 87, 90 |
| Method A | High anxiety | 78, 75, 80 |
| Method B | Low anxiety | 90, 92, 88 |
| Method B | High anxiety | 80, 82, 85 |

### ANOVA table

| Source | SS | df | MS | F | p |
| --- | ---: | ---: | ---: | ---: | ---: |
| Study method | 40.333 | 1 | 40.333 | 7.014 | 0.0293 |
| Anxiety level | 225.333 | 1 | 225.333 | 39.188 | 0.00024 |
| Interaction | 3.000 | 1 | 3.000 | 0.522 | 0.4907 |
| Error | 46.000 | 8 | 5.750 | — | — |
| Total | 314.667 | 11 | — | — | — |

### Interpretation

At the 5% level:

- **Study method** is significant ($p = 0.0293$).
- **Anxiety level** is significant ($p = 0.00024$).
- **Interaction** is not significant ($p = 0.4907$).

Both main effects matter, but their influence is independent.

## 7. Worked example: fertilizer and watering

### Data

| Fertilizer | Watering frequency | Plant heights (cm) |
| --- | --- | --- |
| Fertilizer A | Once a day | 10, 12, 14 |
| Fertilizer A | Twice a day | 15, 16, 18 |
| Fertilizer B | Once a day | 11, 13, 12 |
| Fertilizer B | Twice a day | 14, 17, 19 |

### ANOVA table

| Source | SS | df | MS | F | p |
| --- | ---: | ---: | ---: | ---: | ---: |
| Fertilizer | 0.083 | 1 | 0.083 | 0.024 | 0.8798 |
| Watering frequency | 60.750 | 1 | 60.750 | 17.780 | 0.00293 |
| Interaction | 0.083 | 1 | 0.083 | 0.024 | 0.8798 |
| Error | 27.333 | 8 | 3.417 | — | — |
| Total | 88.250 | 11 | — | — | — |

### Interpretation

At the 5% level:

- **Watering frequency** is significant ($p = 0.00293$). More frequent watering increases plant height.
- **Fertilizer** is not significant ($p = 0.8798$).
- **Interaction** is not significant ($p = 0.8798$).

## 8. Reading a two-way ANOVA table

The standard reporting checklist:

1. State all three null hypotheses.
2. Report each F statistic with its df numerator and df denominator.
3. Report each p-value.
4. State whether each effect is significant at the chosen $alpha$.
5. If an interaction is significant, describe the nature of the dependency (e.g. with an interaction plot) before interpreting main effects.
6. State the error df and the total sample size.

> [!warning] Interaction first
> Always check the interaction before interpreting main effects. A significant interaction means the factors are not independent, and reporting main effects alone can be misleading.

## 9. Common mistakes

- Interpreting main effects when the interaction is significant.
- Forgetting that the F statistic for each effect uses the same error term.
- Using a one-way ANOVA approach when two factors are present.
- Reporting a significant result without stating the p-value and significance level.

## 10. Revision checklist

- [ ] I can state the three hypotheses for a two-way ANOVA.
- [ ] I can identify Factor A, Factor B and the interaction in a design.
- [ ] I can decompose $SS_T$ into $SS_A$, $SS_B$, $SS_("AB")$ and $SS_E$.
- [ ] I can compute and interpret the df for each source.
- [ ] I can construct and read a two-way ANOVA table.
- [ ] I know to check the interaction before interpreting main effects.

## 11. Question bank

### Questions from class material

1. State the three null hypotheses for a two-way ANOVA with Factor A (2 levels) and Factor B (3 levels).
2. A two-way ANOVA has $a = 2$, $b = 3$ and $n = 5$ per cell. What are the df for Factor A, Factor B, interaction and error?
3. Explain what a significant interaction means in plain language.
4. Describe the difference between a significant main effect and a significant interaction.

### Extra practice

5. **Two-way ANOVA, 12 marks.** Plant growth is measured under two fertilizers and two watering levels:

   | Combination | Growth |
   | --- | --- |
   | A, low water | 12, 13, 11 |
   | A, high water | 16, 15, 17 |
   | B, low water | 14, 15, 13 |
   | B, high water | 22, 21, 23 |

   Test both main effects and their interaction at 5%.

   > [!success]- Answer
   > The ANOVA components are: fertilizer SS = 48, water SS = 108, interaction SS = 12 and error SS = 8. Each effect has df = 1 and error has df = 8, so error MS = 1. The F values are 48, 108 and 12, with p-values approximately 0.000121, 0.00000636 and 0.00852. Both main effects and the interaction are significant.

6. **Two-way ANOVA, 10 marks.** Compare Method A/low anxiety = (85, 87, 90), Method A/high = (78, 75, 80), Method B/low = (90, 92, 88) and Method B/high = (80, 82, 85). Test the two main effects and interaction at the 5% level.

   > [!success]- Answer
   > Method SS = 40.333, Anxiety SS = 225.333, Interaction SS = 3.000, Error SS = 46.000. F values are 7.014, 39.188 and 0.522 with df = 1 for effects and df = 8 for error. Method ($p = 0.0293$) and anxiety ($p = 0.00024$) are significant; interaction ($p = 0.4907$) is not.

7. **Two-way ANOVA, 10 marks.** Fertilizer A/once daily = (10, 12, 14), A/twice = (15, 16, 18), B/once = (11, 13, 12) and B/twice = (14, 17, 19). Test fertilizer, watering and their interaction at the 5% level.

   > [!success]- Answer
   > Fertilizer SS = 0.083, Watering SS = 60.750, Interaction SS = 0.083, Error SS = 27.333. Only watering is significant ($p = 0.00293$). Fertilizer and interaction are not significant.
