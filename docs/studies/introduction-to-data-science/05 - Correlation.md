---
title: "05 - Correlation"
math_syntax: typst
---

# Chapter 05 — Correlation

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) · Next: [06 - Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics)

> [!summary] Topic in one sentence
> Correlation describes the direction and strength of association between variables; a coefficient measures association, but it does not by itself prove causation.

## 1. Meaning and classification

Correlation is a statistical tool for studying the relationship between variables. It can be classified by direction, form and the number of variables involved.

![p003-correlation-types](/content-assets/studies/introduction-to-data-science/Assets/Topic%2005/p003-correlation-types.jpg)


### Direction

#### Positive correlation

Two variables move in the same direction: when one increases, the other also increases, and vice versa. Examples given are price and supply, income and expenditure, and height and weight.

The tables below show simultaneous increase and simultaneous decrease:

| X | Y | X | Y |
| ---: | ---: | ---: | ---: |
| 20 | 120 | 60 | 500 |
| 30 | 170 | 50 | 400 |
| 40 | 220 | 40 | 300 |
| 50 | 270 | 30 | 200 |
| 60 | 320 | 20 | 100 |

The two schedules are separate illustrations, not one six-column data set.

#### Negative correlation

Two variables move in opposite directions: when one increases, the other decreases, and vice versa. Examples are price and demand, and temperature and sales of woollen garments.

| X | Y | X | Y |
| ---: | ---: | ---: | ---: |
| 10 | 100 | 250 | 100 |
| 20 | 90 | 200 | 200 |
| 30 | 80 | 150 | 300 |
| 40 | 70 | 100 | 400 |
| 50 | 60 | 50 | 500 |


### Ratio of variation

#### Linear correlation

When the amount of change in one variable is constant relative to a change in the other, the relationship is called linear. When plotted, a fixed ratio is represented by a straight line.

| X | 10 | 15 | 20 | 25 | 30 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Y | 10 | 20 | 30 | 40 | 50 |

In the example, $Delta X : Delta Y = 1 : 2$ for each step, so the relationship is linear.

![p005-linear-correlation](/content-assets/studies/introduction-to-data-science/Assets/Topic%2005/p005-linear-correlation.jpg)

#### Non-linear or curvilinear correlation

When there is no constant change or fixed ratio, the relationship is non-linear and does not form a straight line. For example, grain production need not keep increasing proportionally when fertiliser use is doubled.

| X (fertilisers) | 10 | 20 | 30 | 40 | 50 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Y (grain production) | 7 | 12 | 19 | 25 | 35 |

Both values increase in the example, but not in a constant proportion.

![p006-nonlinear-correlation](/content-assets/studies/introduction-to-data-science/Assets/Topic%2005/p006-nonlinear-correlation.jpg)


### Number of variables

- **Simple correlation:** relationship between two variables only; examples include price and demand or price and money supply.
- **Partial correlation:** relationship between two variables while keeping other variables constant; for example, wheat output versus seed quality while controlling rainfall and manure.
- **Multiple correlation:** relationship between one variable and two or more other variables considered together; for example, wheat output in relation to seed quality and rainfall.


## 2. Degree of correlation

The degree is expressed by a coefficient.

### Perfect correlation

If two variables vary in equal proportion, the correlation is perfect:

- perfect positive: coefficient +1;
- perfect negative: coefficient −1.

### Zero correlation

If a change in one variable has no relation to the other, the coefficient is 0.

### Limited correlation

Real-world relationships often fall between perfect and zero. The coefficient lies between −1 and +1.

A common descriptive guide uses the absolute value $abs(r)$:

| $abs(r)$ | Description |
| ---: | --- |
| 0.00–0.19 | Very weak |
| 0.20–0.39 | Weak |
| 0.40–0.59 | Moderate |
| 0.60–0.79 | Strong |
| 0.80–1.00 | Very strong |

The sign gives direction; the magnitude gives strength. These labels are context-dependent, so interpret them with the subject area, sample size and scatter plot.


## 3. Measuring correlation

Three common methods are:

1. scatter diagram;
2. Karl Pearson’s coefficient;
3. Spearman’s rank correlation coefficient.

### Scatter diagram

A scatter diagram represents a bivariate distribution as points. It gives a visual idea of the nature of association without calculating a numerical coefficient. An upward trend from lower-left to upper-right indicates positive correlation.

| X | 10 | 15 | 20 | 22 | 25 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Y | 5 | 9 | 13 | 15 | 17 |

![p011-positive-scatter](/content-assets/studies/introduction-to-data-science/Assets/Topic%2005/p011-positive-scatter.jpg)


### Karl Pearson’s coefficient

Pearson's product-moment correlation coefficient, denoted by $r$, is a unit-free measure of linear association:

$$
r = frac(sum_(i=1)^n (x_i - bar(x))(y_i - bar(y)), (n - 1) s_x s_y)
$$

where:

- $x_i$ and $y_i$ are the $i$th paired observations;
- $bar(x)$ and $bar(y)$ are the sample means;
- $s_x$ and $s_y$ are the sample standard deviations;
- $n$ is the number of paired observations.

It ranges from −1 to +1:

- positive values indicate positive association;
- negative values indicate negative association;
- values near 0 indicate little or no linear relationship;
- values near ±1 indicate points close to a straight line.

Runnable calculation:

```python
import numpy as np

x = np.array([10, 15, 20, 22, 25], dtype=float)
y = np.array([5, 9, 13, 15, 17], dtype=float)

r = np.corrcoef(x, y)[0, 1]
print(r)
```

This computes Pearson’s r from paired numeric arrays. Always pair observations correctly; sorting one variable independently destroys the pairing.

### Spearman’s rank correlation

Spearman's rank correlation is appropriate when the data are ordinal, when ranks are more meaningful than raw values, or when a monotonic relationship is not necessarily linear. With no tied ranks:

$$
r_s = 1 - frac(6 sum_(i=1)^n d_i^2, n (n^2 - 1))
$$

Here $r_s$ is Spearman's coefficient, $d_i$ is the difference between the two ranks for pair $i$, and $n$ is the number of paired observations. Like Pearson's coefficient, $r_s$ ranges from −1 to +1. When ranks are tied, use a rank-correlation implementation that applies tie corrections.

Runnable rank calculation using SciPy:

```python
from scipy.stats import spearmanr

ability_rank = [1, 2, 3, 4, 5]
score_rank = [2, 1, 4, 3, 5]
result = spearmanr(ability_rank, score_rank)
print(result.statistic)
print(result.pvalue)
```


## 4. Correlation in Python and common mistakes

An end-to-end plot plus coefficients:

```python
import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import spearmanr

x = np.array([10, 15, 20, 22, 25], dtype=float)
y = np.array([5, 9, 13, 15, 17], dtype=float)

plt.scatter(x, y)
plt.xlabel("X")
plt.ylabel("Y")
plt.title("Scatter diagram")
plt.show()

pearson_r = np.corrcoef(x, y)[0, 1]
spearman_r = spearmanr(x, y).statistic
print("Pearson r:", pearson_r)
print("Spearman r:", spearman_r)
```

> [!warning] What correlation does not say
> A coefficient measures association in the selected data. It does not establish that one variable causes the other, and a near-zero linear coefficient does not rule out a non-linear relationship.

Common mistakes:

- confusing positive direction with high strength;
- treating r = 0 as proof that no relationship of any form exists;
- using Pearson when ranks or strong outliers make a rank method more suitable;
- interpreting the coefficient without plotting or checking the data;
- pairing the wrong observations;
- reporting a coefficient outside the valid range −1 to +1.

## 5. Cross-links

- Use [scatter plots](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) to inspect correlation visually.
- The mean and standard deviation in Pearson’s formula are developed in [06 - Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics).
- Hypothesis tests for correlation belong to the wider workflow in [07 - Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing).

## 6. Question bank

### Questions from class material

The correlation material covers explanations and formulas. Use these checks to turn the material into exam practice:

1. Classify a relationship by direction, form, number of variables and strength.
2. Draw scatter diagrams representing strong positive, weak positive, zero, weak negative and strong negative correlation.
3. Given paired measurements, compute and interpret Pearson's $r$. State why the result does not establish causation.
4. Rank two sets of observations and compute Spearman's $r_s$. State how ties change the method.
5. Give one example of a strong non-linear relationship for which Pearson's coefficient can be near zero.

### Extra practice

1. **Pearson correlation from raw data, 8 marks.** For $x = (2, 4, 6, 8, 10)$ and $y = (3, 5, 8, 9, 12)$, calculate Pearson's correlation coefficient and interpret it.

   > [!success]- Answer
   > $n = 5$, $sum x = 30$, $sum y = 37$, $sum x^2 = 220$, $sum y^2 = 323$ and $sum x y = 266$.
   >
   > $$
   > r = frac(5(266) - (30)(37), sqrt((5(220) - 30^2)(5(323) - 37^2))) = frac(220, sqrt(49200)) approx 0.9918
   > $$
   >
   > The variables have a very strong positive linear correlation.

2. **Spearman correlation, 7 marks.** Five students have Mathematics scores `(68, 75, 82, 90, 95)` and Programming scores `(72, 70, 88, 85, 96)`. Rank both variables from lowest to highest and calculate Spearman's coefficient.

   > [!success]- Answer
   > Mathematics ranks are `(1, 2, 3, 4, 5)` and Programming ranks are `(2, 1, 4, 3, 5)`. Thus $sum d_i^2 = 4$.
   >
   > $$
   > r_s = 1 - frac(6(4), 5(5^2 - 1)) = 0.8
   > $$
   >
   > The rankings have a strong positive monotonic relationship.

3. **Perfect negative correlation, 3 marks.** Without using software, find the correlation for $x = (1, 2, 3, 4)$ and $y = (20, 15, 10, 5)$.

   > [!success]- Answer
   > Every increase of 1 in x gives a decrease of 5 in y, and all points lie exactly on a descending line. Therefore $r = -1$.

4. **Coefficient of determination, 4 marks.** A study reports $r = -0.72$ between screen time and sleep duration. Find $r^2$ and interpret the sign and squared value.

   > [!success]- Answer
   > $r^2 = (-0.72)^2 = 0.5184$. The negative sign means higher screen time is associated with shorter sleep. About 51.84% of the variation in sleep duration is linearly associated with screen time in the fitted linear relationship; this does not prove causation.

5. **Effect of an outlier, 5 marks.** Dataset A is `x = (1, 2, 3, 4, 5)`, `y = (2, 4, 6, 8, 10)`. Dataset B changes the last y-value to −10. Predict how Pearson's coefficient changes and explain why a scatter plot must accompany it.

   > [!success]- Answer
   > Dataset A has $r = 1$. In Dataset B the high-leverage last point reverses much of the linear trend, producing $r approx -0.4472$. Pearson's coefficient is sensitive to influential observations, while the scatter plot makes the outlier visible.

6. **Tied ranks, 6 marks.** Calculate Spearman's coefficient for `x = (10, 20, 20, 30, 40, 40)` and `y = (1, 2, 3, 3, 5, 6)` using average ranks for ties.

   > [!success]- Answer
   > Average ranks for x are `(1, 2.5, 2.5, 4, 5.5, 5.5)`; for y they are `(1, 2, 3.5, 3.5, 5, 6)`. Pearson correlation of these rank vectors gives $r_s approx 0.9404$.

7. **Interpretation trap, 4 marks.** A dataset has $r = 0.03$, but its scatter plot forms a clear U-shape. What may be concluded?

   > [!success]- Answer
   > There is almost no linear association, but there is a strong non-linear relationship. It is incorrect to say that the variables are unrelated.
