---
title: "06 - Linear Regression and Multivariable Regression"
math_syntax: typst
---

# 06 — Linear Regression and Multivariable Regression

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


*Regression Models, Week 2*

Simple linear regression extends naturally to multiple predictors. This chapter covers the interpretation of regression coefficients with several variables, the mechanics of multivariable least squares, omitted variable bias, and the role of correlation among predictors.

---

## First, read the notation in words

With predictors $x_1$ and $x_2$, coefficient $beta_1$ describes the change associated with $x_1$ while $x_2$ stays fixed. Covariance $"Cov"(X,Y)$ describes how two variables move together; correlation rescales it to a value from $-1$ to $1$. A confounder is associated with both a predictor and the outcome, so omitting it can change a fitted slope.

> [!question] Try to recall
> When interpreting any multiple-regression coefficient, finish the sentence with “holding the other included predictors constant.”

---

## From simple to multivariable regression

We extend simple linear regression to multiple predictors by including additional terms in the linear predictor. The model can be written in summation or matrix form, with errors assumed independent and normally distributed.

The **simple linear regression** model:

$$
Y_i = beta_0 + beta_1 X_i + epsilon_i
$$

The **multivariable (multiple) linear regression** model:

$$
Y_i = beta_0 + beta_1 X_(i 1) + beta_2 X_(i 2) + dots.h + beta_p X_(i p) + epsilon_i
$$

$$
Y_i = sum_(k=1)^p X_(i k) beta_k + epsilon_i, quad epsilon_i tilde" IID" N(0, sigma^2)
$$

In matrix notation: $Y = X beta + epsilon$, where $X$ is the $n times (p+1)$ design matrix (with a column of ones for the intercept), $beta$ is the $(p+1) times 1$ coefficient vector, and $epsilon tilde N(0, sigma^2 I)$.

---

## Interpreting coefficients

In multivariable regression, each coefficient represents the partial effect of its predictor, holding all other predictors constant. This is crucial for interpreting the separate contributions of correlated predictors.

In the model $Y = beta_0 + beta_1 X_1 + beta_2 X_2 + epsilon$:

- $beta_1$ is the expected change in $Y$ for a one-unit increase in $X_1$, **holding $X_2$ constant**.
- $beta_2$ is the expected change in $Y$ for a one-unit increase in $X_2$, **holding $X_1$ constant**.

This "holding other variables constant" interpretation is the key difference from simple regression. Each coefficient measures the **partial effect** of its predictor, adjusting for all other predictors in the model.

> **Worked example.** Fit `mpg ~ cyl + wt` on the `mtcars` dataset. If $hat(beta)_"wt" = -3.2$, then for every additional 1000 lbs of weight, fuel efficiency decreases by about 3.2 mpg, **holding cylinder count fixed**.

---

## Least squares estimation

The least squares method finds the coefficient estimates that minimize the residual sum of squares. The normal equations are derived by setting the derivative of the RSS to zero, leading to a closed-form solution.

The least squares estimates minimise the residual sum of squares:

$$
"RSS"(beta) = sum_(i=1)^n (Y_i - sum_(k=0)^p X_(i k) beta_k)^2
$$

Taking partial derivatives with respect to each $beta_k$ and setting to zero gives the **normal equations**:

$$
X^T X hat(beta) = X^T Y
$$

The solution:

$$
hat(beta) = (X^T X)^(-1) X^T Y
$$

### Properties of $hat(beta)$

The ordinary least squares estimator has several important theoretical properties: it is unbiased, has minimum variance among linear unbiased estimators, and is normally distributed under normality assumptions.

1. **Unbiased**: $E[hat(beta)] = beta$ (assuming the model is correct).
2. **Gauss–Markov**: among all linear unbiased estimators, $hat(beta)$ has the minimum variance.
3. **Variance**: $"Var"(hat(beta)) = sigma^2 (X^T X)^(-1)$.
4. Under normality: $hat(beta) tilde N(beta, sigma^2 (X^T X)^(-1))$.

---

## Omitted variable bias

When a relevant predictor is omitted from the regression model, the coefficient estimates for the included predictors can be biased. The bias depends on the strength of the relationship between the omitted variable and the included predictor.

If a true predictor $Z$ is left out of the model but is correlated with an included predictor $X_1$, the estimate $hat(beta)_1$ will be **biased**.

Suppose the true model is:

$$
Y = beta_0 + beta_1 X_1 + beta_2 Z + epsilon
$$

but we fit only:

$$
Y = alpha_0 + alpha_1 X_1 + u
$$

Then:

$$
E[hat(alpha)_1] = beta_1 + beta_2 frac("Cov"(X_1, Z), "Var"(X_1))
$$

The **bias** term is:

$$
beta_2 times frac("Cov"(X_1, Z), "Var"(X_1))
$$

- If $beta_2 != 0$ and $"Cov"(X_1, Z) != 0$, the estimate $hat(alpha)_1$ is biased for $beta_1$.
- The bias can be positive or negative, depending on the signs of $beta_2$ and $"Cov"(X_1, Z)$.

> **Worked example.** Omitting a variable $Z$ that is positively correlated with $X_1$ and positively affects $Y$ ($beta_2 > 0$) will inflate the apparent effect of $X_1$.

---

## Multivariable regression example

We fit a multiple regression model to the `mtcars` data to predict fuel efficiency from several predictors. The adjusted $R^2$ is introduced as a measure that penalizes for the number of predictors.

```r
# Fit multiple regression on mtcars
fit_multi <- lm(mpg ~ cyl + disp + hp + wt, data = mtcars)
summary(fit_multi)

# Coefficients:
# (Intercept)    cyl    disp     hp      wt
#    38.75      -1.59  -0.02   -0.02   -3.17
# Each coefficient is interpreted holding the others constant.
```

The adjusted $R^2$ accounts for the number of predictors and penalises unnecessary complexity:

$$
"Adj" R^2 = 1 - frac("RSS" slash (n - p - 1), "TSS" slash (n - 1))
$$

---

## Adjusted $R^2$

Adjusted $R^2$ modifies the usual $R^2$ by incorporating a penalty for the number of predictors, making it a more reliable criterion for model comparison.

Unlike $R^2$, which always increases when a predictor is added, **adjusted $R^2$** can decrease if a predictor adds no useful information. This makes it more suitable for comparing models with different numbers of predictors.

- $R^2$ = proportion of variance explained (optimistic about model complexity).
- Adjusted $R^2$ = proportion of variance explained, penalised for model complexity.

---

## Residuals in multivariable regression

Residuals in multivariable regression are defined as the difference between the observed and fitted values, where the fitted value is computed using the estimated coefficient vector.

The residual is still $e_i = Y_i - hat(Y)_i$, where $hat(Y)_i = X_i^T hat(beta)$.

### Properties

The residuals in a linear regression model have several important properties: they sum to zero, are orthogonal to the design matrix, and are uncorrelated with the fitted values.

1. $sum e_i = 0$ (if an intercept is included).
2. The residuals are orthogonal to every column of $X$: $X^T e = 0$.
3. The residuals are uncorrelated with each fitted value.

### Residual diagnostics

Residual diagnostic plots are essential for checking the assumptions of linear regression: linearity, normality, homoscedasticity, and the presence of influential points.

- **Residuals vs fitted**: check for nonlinearity. A curved pattern suggests a missing nonlinear term.
- **Q-Q plot of residuals**: check normality. Deviations from the diagonal indicate non-normality.
- **Scale-location plot**: check homoscedasticity. A funnel shape indicates heteroscedasticity.
- **Residuals vs leverage**: identify influential points (Cook's distance).

```r
par(mfrow = c(2, 2))
plot(fit_multi)
```

---

## Collinearity

Collinearity arises when predictor variables are highly correlated, leading to instability in the coefficient estimates without introducing bias.

**Collinearity** (or multicollinearity) occurs when predictors are highly correlated. This does not bias estimates but dramatically inflates their variance.

### Variance inflation factor (VIF)

The variance inflation factor (VIF) measures the extent to which the variance of a coefficient is increased due to multicollinearity. It is computed from the $R^2$ of regressing the predictor on all other predictors.

The VIF for predictor $j$ quantifies how much the variance of $hat(beta)_j$ is inflated due to correlation with other predictors:

$$
"VIF"_j = frac(1, 1 - R_j^2)
$$

where $R_j^2$ is the $R^2$ from regressing $X_j$ on all other predictors.

- $text("VIF") = 1$: no inflation (predictor is uncorrelated with others).
- $text("VIF") > 5$: moderate concern.
- $text("VIF") > 10$: serious collinearity.

```r
library(car)
fit_swiss <- lm(Fertility ~ ., data = swiss)
vif(fit_swiss)
sqrt(vif(fit_swiss))  # standard error inflation factors
```

### What to do about collinearity

Several strategies can be employed to address collinearity, including removing redundant predictors, combining predictors, or collecting additional data.

1. **Remove one of the correlated predictors.**
2. **Combine predictors** (e.g., via PCA or domain knowledge).
3. **Collect more data** to reduce the variance of estimates.
4. **Do nothing** if the goal is prediction rather than interpretation.

---

## Worked example: Swiss fertility data

We demonstrate the effect of adding correlated predictors on the variance of the Agriculture coefficient using the Swiss fertility data. As more predictors are added, the variance of the Agriculture coefficient increases.

```r
data(swiss)

# Model 1: Fertility ~ Agriculture
fit1 <- lm(Fertility ~ Agriculture, data = swiss)
summary(fit1)

# Model 2: Fertility ~ Agriculture + Examination + Education
fit2 <- lm(Fertility ~ Agriculture + Examination + Education, data = swiss)
summary(fit2)

# Model 3: full model
fit3 <- lm(Fertility ~ ., data = swiss)
summary(fit3)

# Compare variance of Agriculture coefficient across models
a1 <- summary(fit1)$cov.unscaled[2, 2]
a2 <- summary(fit2)$cov.unscaled[2, 2]
a3 <- summary(fit3)$cov.unscaled[2, 2]
c("Model 1" = a1, "Model 2" = a2, "Model 3" = a3)
# Variance of hat(beta)_Agriculture increases as correlated predictors are added.
```

---

## Simulation: effect of adding correlated predictors

```r
set.seed(42)
n <- 100
x1 <- rnorm(n)
x2 <- x1 + rnorm(n, sd = 0.3)  # x2 correlated with x1
x3 <- x1 + rnorm(n, sd = 0.3)  # x3 correlated with x1

# Simulate 1000 datasets and compare SE of beta1
betas <- replicate(1000, {
  y <- x1 + rnorm(n, sd = 0.3)
  c(coef(lm(y ~ x1))[2],
    coef(lm(y ~ x1 + x2))[2],
    coef(lm(y ~ x1 + x2 + x3))[2])
})
beta1_se <- apply(betas, 1, sd)
round(beta1_se, 4)
# Adding correlated predictors drastically increases the SE of beta1.
```

---

## Common mistakes

1. **Confusing "significant" with "important".** A statistically significant predictor may explain very little variance.
2. **Ignoring collinearity.** High "VIF" values mean the coefficient estimates are unstable.
3. **Omitting key variables.** Leads to biased estimates of included coefficients.
4. **Interpreting coefficients as causal.** Regression captures association; causation requires experimental design or causal inference methods.
5. **Extrapolating beyond the data range.** Multivariable extrapolation is even more dangerous than in simple regression.

---

## Revision checklist

- [ ] I can state the multivariable regression model in matrix form.
- [ ] I can interpret each coefficient as a partial effect (holding other predictors constant).
- [ ] I can derive the normal equations and the OLS estimator.
- [ ] I can compute and interpret the "VIF".
- [ ] I can explain omitted variable bias and the conditions under which it occurs.
- [ ] I can fit a multivariable regression in R and interpret the summary output.
- [ ] I know how to compare models using adjusted $R^2$.
- [ ] I can perform basic residual diagnostics.
---

## Make it click: “Holding constant” is the key phrase

**Work it through.** Suppose predicted exam score = 30 + 4 × study hours + 2 × practice tests. For 3 hours and 2 tests, prediction = 46. One extra hour predicts 4 more points *at the same number of practice tests*. If students who study longer also take more tests, a one-predictor slope blends both associations.

**See it.** Make two rows with the same number of practice tests and different study hours; then two rows with the same hours and different tests. Compare the changes.

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q15/Q16/Q17 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q19/Q20 test adjusted interpretation and confounding.

> [!warning] Common trap
> A regression coefficient is an association conditional on model covariates. Causation needs design and assumptions beyond the equation.
