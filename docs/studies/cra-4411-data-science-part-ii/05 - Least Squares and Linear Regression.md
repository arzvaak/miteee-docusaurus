---
title: "05 - Least Squares and Linear Regression"
math_syntax: typst
---

# 05 — Least Squares and Linear Regression

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


*Regression Models, Week 1*

Regression analysis is the workhorse of applied statistics. It models the relationship between a response variable and one or more predictors. This chapter introduces the simplest case: predicting a response from a single predictor using the method of least squares.

---

## First, read the notation in words

$x$ is a predictor, $y$ an observed response, and $hat(y)$ the value predicted by a fitted line. A residual is $y - hat(y)$. The population intercept and slope are $beta_0$ and $beta_1$; their sample estimates have hats. The slope gives the change in predicted $y$ for a one-unit increase in $x$. $R^2$ compares the fitted model with predicting only the sample mean.

> [!question] Try to recall
> For a point above a fitted line, is its residual positive or negative? Write observed minus predicted to check.

---

## Why regression?

Regression helps us answer questions such as:

- Can we **predict** one quantity from another?
- Can we find a simple, interpretable model that describes the data?
- How much variation in the outcome is **unexplained** by the predictor (**residual variation**)?
- What assumptions allow us to **generalise** beyond the observed data (**statistical inference**)?

Francis Galton coined the term "regression" in 1885 when studying the relationship between parents' and children's heights.

---

## Notation

| Symbol | Meaning |
| --- | --- |
| $X_i$, $Y_i$ | Observed predictor and response for observation $i$ |
| $n$ | Sample size |
| $bar(X)$, $bar(Y)$ | Sample means |
| $mu$, $sigma$ | Population mean and standard deviation (unknown parameters) |
| $beta_0$, $beta_1$ | Population regression intercept and slope (unknown) |
| $hat(beta)_0$, $hat(beta)_1$ | Estimated intercept and slope |
| $epsilon_i$ | Random error for observation $i$ |

---

## Key summary statistics

### Sample mean

The sample mean $bar(X)$ is the average of the observations. Centering the data by subtracting the mean produces a variable with mean zero.

$$
bar(X) = frac(1, n) sum_(i=1)^n X_i
$$

**Centering**: $tilde(X)_i = X_i - bar(X)$ has mean zero.

### Sample variance and standard deviation

The sample variance $S^2$ and standard deviation $S$ measure data spread. Scaling by $S$ produces a variable with standard deviation 1.

$$
S^2 = frac(1, n-1) sum_(i=1)^n (X_i - bar(X))^2
$$

$$
S = sqrt(S^2)
$$

**Scaling**: $X_i slash S$ has standard deviation 1.

### Normalisation

Normalization transforms each observation to a z-score by centering and scaling, resulting in mean 0 and standard deviation 1.

$$
Z_i = frac(X_i - bar(X), S)
$$

produces data with mean 0 and standard deviation 1. A value $Z_i = 2$ means the observation is 2 standard deviations above the mean.

### Covariance and correlation

Covariance measures the joint variability of two variables, and correlation standardizes it to a value between -1 and 1.

For pairs $(X_i, Y_i)$:

$$
"Cov"(X, Y) = frac(1, n-1) sum_(i=1)^n (X_i - bar(X))(Y_i - bar(Y))
$$

$$
"Cor"(X, Y) = frac("Cov"(X, Y), S_X S_Y)
$$

Properties of correlation:

- $-1 <= "Cor"(X, Y) <= 1$.
- $|r| = 1$ only when all points fall exactly on a line.
- $r = 0$ implies no **linear** relationship (a nonlinear one may still exist).
- $"Cor"(X, Y) = "Cor"(Y, X)$.

---

## Least squares: the best single predictor

### Finding the centre

The sample mean $bar(Y)$ minimizes the mean squared error (MSE) among all constant predictors, as shown by completing the square.

Given data $Y_1, dots.h, Y_n$ with no predictor, the best constant predictor minimises the **mean squared error**:

$$
"MSE"(mu) = frac(1, n) sum_(i=1)^n (Y_i - mu)^2
$$

**Claim**: $mu = bar(Y)$ minimises the MSE.

**Proof (completing the square).**

$$
sum_(i=1)^n (Y_i - mu)^2
&= sum_(i=1)^n (Y_i - bar(Y) + bar(Y) - mu)^2 \
&= sum_(i=1)^n (Y_i - bar(Y))^2 + 2(bar(Y) - mu) sum_(i=1)^n (Y_i - bar(Y)) + sum_(i=1)^n (bar(Y) - mu)^2 \
&= sum_(i=1)^n (Y_i - bar(Y))^2 + sum_(i=1)^n (bar(Y) - mu)^2
$$

since $sum_(i=1)^n (Y_i - bar(Y)) = 0$. The second term is always $>= 0$ and equals zero only when $mu = bar(Y)$.

### Alternative: calculus approach

Alternatively, using calculus, the derivative of the MSE with respect to $mu$ set to zero yields the sample mean $bar(Y)$ as the minimizer.

Differentiate with respect to $mu$ and set to zero:

$$
frac(d, d mu) sum_(i=1)^n (Y_i - mu)^2 = -2 sum_(i=1)^n (Y_i - mu) = 0
$$

$$
sum_(i=1)^n Y_i = n mu ⇒ mu = bar(Y)
$$

---

## Regression through the origin

Regression through the origin forces the intercept to be zero, and the least squares estimator for the slope is given by the ratio of the sum of cross-products to the sum of squares of the predictor.

Suppose we model the data as passing through the origin:

$$
Y_i = beta X_i
$$

The least squares estimate $hat(beta)$ minimises $sum_(i=1)^n (Y_i - beta X_i)^2$. Taking the derivative:

$$
hat(beta) = frac(sum_(i=1)^n X_i Y_i, sum_(i=1)^n X_i^2)
$$

> **Warning.** Forcing the regression line through the origin is almost always a bad idea. It can produce seriously biased estimates unless there is a genuine physical reason for the intercept to be zero.

### Centering vs regression through the origin

Centering the data does not change the slope estimate; regressing centered data through the origin yields the same slope as ordinary linear regression with an intercept.

**Centering** the data ($X_i - bar(X)$, $Y_i - bar(Y)$) reorients the axes so the data are centred at the origin. The slope from regression through the origin on centred data is **identical** to the slope from ordinary linear regression with an intercept. This is because centering shifts the line without changing its slope.

---

## Simple linear regression (SLR)

The simple linear regression model assumes a linear relationship between the response $Y$ and predictor $X$, with normally distributed errors.

The SLR model is:

$$
Y_i = beta_0 + beta_1 X_i + epsilon_i, quad epsilon_i tilde" IID" N(0, sigma^2)
$$

- $beta_0$: the intercept — the expected value of $Y$ when $X = 0$.
- $beta_1$: the slope — the expected change in $Y$ for a one-unit increase in $X$.
- $epsilon_i$: the random error.

### Least squares estimates

The least squares estimates for the slope and intercept are derived by minimizing the sum of squared residuals, and are given by the formulas in terms of covariance and variance.

The slope:

$$
hat(beta)_1 = frac(sum_(i=1)^n (X_i - bar(X))(Y_i - bar(Y)), sum_(i=1)^n (X_i - bar(X))^2) = frac("Cov"(X, Y), "Var"(X))
$$

The intercept:

$$
hat(beta)_0 = bar(Y) - hat(beta)_1 bar(X)
$$

### Interpretation

The slope $hat(beta)_1$ relates to the correlation, and the fitted value $hat(Y)_i$ and residual $e_i$ for each observation are defined as follows.

- $hat(beta)_1 = "Cor"(X, Y) times S_Y slash S_X$: the slope is the correlation scaled by the ratio of standard deviations.
- The fitted value for observation $i$: $hat(Y)_i = hat(beta)_0 + hat(beta)_1 X_i$.
- The **residual**: $e_i = Y_i - hat(Y)_i$.

### Properties of the fitted line

The least squares fitted line has several properties: the residuals sum to zero, are uncorrelated with the fitted values, and the line passes through the point of means.

1. The residuals sum to zero: $sum e_i = 0$.
2. The residuals are uncorrelated with the fitted values: $"Cor"(e_i, hat(Y)_i) = 0$.
3. The line passes through the point $(bar(X), bar(Y))$.

---

## Residuals and goodness of fit

### Decomposition of variation

The total variation in $Y$ decomposes into regression and residual sums of squares, as shown in the following equation.

$$
sum_(i=1)^n (Y_i - bar(Y))^2 = sum_(i=1)^n (hat(Y)_i - bar(Y))^2 + sum_(i=1)^n (Y_i - hat(Y)_i)^2
$$

- **Total sum of squares (SST)**: $sum (Y_i - bar(Y))^2$ — total variability.
- **Regression sum of squares (SSR)**: $sum (hat(Y)_i - bar(Y))^2$ — variability explained by the model.
- **Residual sum of squares (SSE)**: $sum (Y_i - hat(Y)_i)^2$ — unexplained variability.

### $R$-squared

$R^2$, the coefficient of determination, measures the proportion of total variation in the response explained by the regression model.

$$
R^2 = 1 - frac("SSE", "SST") = frac("SSR", "SST")
$$

- $R^2$ ranges from 0 to 1.
- $R^2 = 1$ means a perfect fit; $R^2 = 0$ means the model explains none of the variability.
- $R^2$ is the square of the sample correlation in simple linear regression.

### Residual standard error

The residual standard error (RSE) is the square root of the mean squared residual, with $n-2$ degrees of freedom, and measures the typical size of the residuals.

$$
"RSE" = sqrt(frac("SSE", n - 2))
$$

The $n - 2$ reflects the two parameters estimated ($beta_0$ and $beta_1$). RSE has the same units as $Y$ and measures the average size of the residuals.

---

## Inference in SLR

### Standard error of the slope

The standard error of the slope $hat(beta)_1$ is given by the residual standard error divided by the square root of the sum of squared deviations of the predictor.

$$
"SE"(hat(beta)_1) = frac("RSE", sqrt(sum (X_i - bar(X))^2))
$$

### $t$-statistic for $beta_1$

The t-statistic for testing $H_0: beta_1 = 0$ is the slope estimate divided by its standard error, which follows a t-distribution with $n-2$ degrees of freedom under the null hypothesis.

$$
t = frac(hat(beta)_1, "SE"(hat(beta)_1)) tilde t_{n-2}
$$

- Under $H_0: beta_1 = 0$ (no relationship), this statistic follows a $t$-distribution with $n - 2$ degrees of freedom.
- A large $|t|$ implies strong evidence that $X$ is associated with $Y$.

### Confidence interval for $beta_1$

We construct a confidence interval for the slope $beta_1$ using the estimated slope $hat(beta)_1$, the critical value $t_{n-2, 1 - alpha slash 2}$ from the $t$-distribution with $n-2$ degrees of freedom, and the standard error of the slope.

$$
hat(beta)_1 plus.minus t_{n-2, 1 - alpha slash 2} times "SE"(hat(beta)_1)
$$

---

## Galton's data: a worked example

Galton's data on child and parent heights provide a classic example of linear regression. We fit a model to explore the relationship between parent height and child height, and interpret the slope and $R^2$.

Galton (1885) recorded heights of $n = 928$ children and their parents. The data are available in the `UsingR` package:

```r
library(UsingR); data(galton)

# Scatter plot with size encoding frequency
library(ggplot2); library(dplyr)
freqData <- as.data.frame(table(galton$child, galton$parent))
names(freqData) <- c("child", "parent", "freq")
freqData$child <- as.numeric(as.character(freqData$child))
freqData$parent <- as.numeric(as.character(freqData$parent))

g <- ggplot(filter(freqData, freq > 0), aes(x = parent, y = child))
g <- g + geom_point(aes(colour = freq, size = freq))
g <- g + scale_colour_gradient(low = "lightblue", high = "white")
g + labs(title = "Galton's data: child vs parent height")

# Fit simple linear regression
fit <- lm(child ~ parent, data = galton)
summary(fit)

# The regression line
# hat(child) = 23.94 + 0.65 * parent
# R-squared ~ 0.21
```

- The slope of about 0.65 means that for every additional inch of parent height, the child's expected height increases by about 0.65 inches.
- The $R^2$ of about 0.21 means parent height explains only about 21% of the variation in child heights.

### Regression to the mean

Notice that the slope is less than 1. Tall parents tend to have children who are tall but **less extreme** (closer to the mean). This is **regression to the mean**: extreme observations on one variable tend to be less extreme on a related variable.

---

## Common mistakes

1. **Interpreting $R^2$ as a measure of causation.** $R^2$ measures association, not causation.
2. **Forgetting the intercept.** Always include the intercept unless there is a compelling reason not to.
3. **Ignoring the residual plot.** Always plot residuals to check for patterns.
4. **Confusing correlation with regression slope.** $r = 0.8$ and $hat(beta)_1 = 0.8$ are different quantities.
5. **Using the model outside the range of the data.** Extrapolation beyond the observed $X$ values is unreliable.

---

## Revision checklist

- [ ] I can compute and interpret the sample mean, variance, standard deviation, covariance, and correlation.
- [ ] I can derive the least squares estimator for the mean and for the slope.
- [ ] I can fit a simple linear regression in R and interpret the output.
- [ ] I can compute SST, SSR, SSE, $R^2$, and RSE.
- [ ] I can construct a confidence interval and perform a hypothesis test for $beta_1$.
- [ ] I understand the concept of regression to the mean.
- [ ] I always examine residual plots after fitting a model.
---

## Make it click: Calculate a slope before using R

**Work it through.** For points (1, 2), (2, 3), (3, 5), x̄ = 2 and ȳ = 10/3. The cross-product sum is 3; the squared-x-deviation sum is 2. The least-squares slope is 3/2 = 1.5 and the intercept is 10/3 − 1.5 × 2 = 1/3. Predicted values are 1.83, 3.33, and 4.83; residuals are observed minus predicted.

**See it.** Sketch the three points and fitted line. Add vertical residual segments; squaring their lengths prevents positive and negative errors from cancelling.

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q12/Q13/Q14 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q5/Q6/Q29 test the slope, intercept and residual logic.

> [!warning] Common trap
> The fitted line minimizes the *sum of squared vertical residuals*, not horizontal distances and not the signed sum of errors.
