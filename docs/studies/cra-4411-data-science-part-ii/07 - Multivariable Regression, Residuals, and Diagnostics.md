---
title: "07 - Multivariable Regression, Residuals, and Diagnostics"
math_syntax: typst
---

# 07 — Multivariable Regression, Residuals, and Diagnostics

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


*Regression Models, Week 3 — later material, outside midterm scope*

This chapter extends the regression diagnostics and model selection techniques introduced in Week 2. It covers variance inflation in detail, ANOVA for comparing nested models, stepwise variable selection, residual analysis, and the practical challenges of model building.

---

## First, read the notation in words

A fitted value is a model prediction; its residual is the observed outcome minus that prediction. A residual plot can reveal curvature, changing spread, or unusual points. If $R_j^2$ is the $R^2$ from regressing predictor $j$ on the other predictors, its variance inflation factor is $"VIF"_j = 1/(1 - R_j^2)$. A large VIF signals unstable individual coefficient estimates.

> [!question] Try to recall
> If two predictors almost duplicate each other, can the model predict well while their individual coefficients remain unstable? Yes; explain why.

---

## Variance inflation in detail

When a correlated predictor is added to a regression model, the variance of the existing predictor's coefficient increases. This inflation can be precisely quantified.

Adding a correlated predictor $X_2$ to a model that already contains $X_1$ increases the variance of $hat(beta)_1$. The increase can be quantified exactly.

### Theory

The variance of a coefficient estimate when an additional correlated predictor is included is inflated by a factor that depends on the correlation between the predictors. This factor is derived from the $R^2$ of the auxiliary regression.

If the true model is $Y = beta_0 + beta_1 X_1 + epsilon$ but we fit $Y = beta_0 + beta_1 X_1 + beta_2 X_2 + epsilon$, the variance of $hat(beta)_1$ changes by a factor of:

$$
frac("Var"(hat(beta)_1 | X_1, X_2), "Var"(hat(beta)_1 | X_1)) = frac(1, 1 - R_1^2)
$$

where $R_1^2$ is the $R^2$ from regressing $X_1$ on $X_2$.

### Worked example with the `swiss` data

We illustrate variance inflation by comparing the variance of the Agriculture coefficient in models with increasing numbers of correlated predictors. The `vif()` function from the `car` package is used to compute the variance inflation factors.

```r
data(swiss)

# Model 1: Fertility ~ Agriculture
fit <- lm(Fertility ~ Agriculture, data = swiss)
a <- summary(fit)$cov.unscaled[2, 2]

# Model 2: add Examination
fit2 <- update(fit, Fertility ~ Agriculture + Examination)
# Model 3: add Examination + Education
fit3 <- update(fit, Fertility ~ Agriculture + Examination + Education)

# Variance ratios for Agriculture coefficient
c(summary(fit2)$cov.unscaled[2, 2] / a - 1,
  summary(fit3)$cov.unscaled[2, 2] / a - 1)
# e.g., Examination alone increases variance by ~20%,
# Examination + Education by ~35%.
```

The `vif()` function from the `car` package computes all VIFs at once:

```r
library(car)
fit_full <- lm(Fertility ~ ., data = swiss)
vif(fit_full)
sqrt(vif(fit_full))  # SE inflation factors
```

---

## Residual variance and model fit

### Underfitting vs overfitting

Underfitting and overfitting describe the effects of omitting or including unnecessary variables in the model. Underfitting leads to biased variance estimates, while overfitting leads to inefficient estimates.

- **Underfitting** (omitting necessary variables): the residual variance estimate is **biased** — $E[hat(sigma)^2] != sigma^2$.
- **Correctly fitting**: the residual variance estimate is **unbiased** — $E[hat(sigma)^2] = sigma^2$.
- **Overfitting** (including unnecessary variables): the variance estimate is unbiased but **larger** than necessary — the estimates are less precise.

### ANOVA table interpretation

The ANOVA table partitions the total variability in the response into components due to the regression model and the residuals. The $F$-statistic tests the overall significance of the model.

The ANOVA (analysis of variance) table decomposes the variability in $Y$:

| Source | DF | SS | MS | $F$ |
| --- | --- | --- | --- | --- |
| Regression | $p$ | $sum (hat(Y)_i - bar(Y))^2$ | $text("SSR") slash p$ | $text("MSR") slash text("MSE")$ |
| Residual | $n - p - 1$ | $sum (Y_i - hat(Y)_i)^2$ | $text("SSE") slash (n - p - 1)$ | |
| Total | $n - 1$ | $sum (Y_i - bar(Y))^2$ | | |

- $F = text("MSR") slash text("MSE")$: large $F$ → the model explains a significant portion of the variance.
- The $F$-test for the overall model tests $H_0: beta_1 = beta_2 = dots.h = beta_p = 0$.

---

## ANOVA for comparing nested models

The nested $F$-test compares two regression models where one is a restricted version of the other. It determines whether the additional parameters in the more complex model significantly reduce the residual sum of squares.

When models are **nested** (one is a special case of the other, with some coefficients set to zero), we can use a **nested $F$-test** to compare them.

Given two models: reduced (with $p_1$ parameters) and full (with $p_2 > p_1$ parameters):

$$
F = frac(frac("RSS"_1 - "RSS"_2, p_2 - p_1), frac("RSS"_2, n - p_2)) tilde F_{p_2 - p_1, n - p_2}
$$

where $text("RSS")_1$ is the residual sum of squares for the reduced model and $text("RSS")_2$ for the full model.

- Large $F$ → the additional parameters significantly reduce "RSS" → prefer the full model.
- Small $F$ → the additional parameters are unnecessary → prefer the reduced model.

> **Important.** The order of models in `anova(fit1, fit2, fit3)` matters. Always list nested models from most restricted to least restricted.

### Worked example

```r
data(swiss)

# Nested models
fit1 <- lm(Fertility ~ Agriculture, data = swiss)
fit2 <- lm(Fertility ~ Agriculture + Examination + Education, data = swiss)
fit3 <- lm(Fertility ~ Agriculture + Examination + Education + Catholic + Infant.Mortality,
           data = swiss)

# ANOVA comparison (order matters: most restricted first)
anova(fit1, fit2, fit3)

# Output columns:
# Res.Df  RSS  Df  Sum of Sq  F  Pr(>F)
# Lower Res.Df = more complex model
# Significant F → the additional predictors improve the model
```

---

## Model selection

### The problem

When many predictors are available, the number of possible models grows exponentially, making exhaustive search infeasible. Automated methods are needed to navigate this large model space.

With $p$ predictors, there are $2^p$ possible models (including interactions and polynomial terms, the space explodes). Automated methods help navigate this space.

### Stepwise selection

Stepwise selection methods iteratively add or remove predictors based on statistical criteria such as AIC or BIC. These algorithms provide a practical approach to model selection when the predictor space is large.

**Forward selection**: start with no predictors, add the most significant one at each step.

**Backward elimination**: start with all predictors, remove the least significant one at each step.

**Both directions**: combine forward and backward steps.

The criterion for "best" is typically the **Akaike Information Criterion ("AIC")** or **Bayesian Information Criterion ("BIC")**:

$$
"AIC" = -2 log(L) + 2k
$$

$$
"BIC" = -2 log(L) + k log(n)
$$

where $L$ is the likelihood and $k$ is the number of parameters. Lower is better for both.

- **"BIC" penalises complexity more** than "AIC" (the $log(n)$ factor grows with $n$).
- **"AIC"** is better for prediction; **"BIC"** is better for identifying the true model.

### Stepwise regression in R

```r
data(mtcars)
fit <- lm(mpg ~ cyl + disp + hp + drat + wt, data = mtcars)

# Stepwise search using BIC (k = log(n))
step(fit, k = log(nrow(mtcars)))
# Result might be: mpg ~ cyl + wt (the best subset)
```

```r
# Using MASS::stepAIC for more control
library(MASS)
fit_full <- lm(mpg ~ ., data = mtcars)
stepAIC(fit_full, direction = "both")
```

### Limitations of stepwise methods

Stepwise selection methods have several drawbacks: they can be unstable, produce biased estimates, and lead to overfitting. Additionally, the standard errors and $p$-values from the final model are not valid.

1. **Instability**: small changes in data can lead to different selected models.
2. **Biased estimates**: the coefficients of selected variables are biased upward (because extreme estimates are selected).
3. **No uncertainty quantification**: standard errors and $p$-values from the final model are invalid.
4. **Overfitting**: stepwise methods tend to overfit, especially with many predictors.

---

## Residual analysis in detail

### Types of residuals

Residuals can be standardized to account for varying leverage and heteroscedasticity. Ordinary, standardized, and studentized residuals serve different diagnostic purposes.

- **Ordinary residuals**: $e_i = Y_i - hat(Y)_i$.
- **Standardised residuals**: $e_i slash sqrt(hat(sigma)^2 (1 - h_(i i)))$, where $h_(i i)$ is the leverage.
- **Studentised residuals**: residuals divided by an estimate of their standard deviation that excludes observation $i$ (useful for detecting outliers).

### Leverage and influence

Leverage measures the potential of an observation to influence the fitted model, while Cook's distance combines leverage and residual size to quantify the actual influence of each observation.

**Leverage** $h_(i i)$ measures how far observation $i$'s predictor values are from the centre of the data. High-leverage points have the potential to disproportionately affect the fit.

$$
h_(i i) = (X(X^T X)^(-1) X^T)_(i i)
$$

- Average leverage = $p slash n$ (where $p$ is the number of parameters including the intercept).
- Points with $h_(i i) > 2p slash n$ warrant investigation.

**Cook's distance** combines leverage and residual size to measure the influence of each observation:

$$
D_i = frac(e_i^2, p times "MSE") times frac(h_(i i), (1 - h_(i i))^2)
$$

- Large $D_i$ (rule of thumb: $D_i > 1$ or $D_i > 4 slash n$) indicates an influential point.

```r
# Diagnostic plots
par(mfrow = c(2, 2))
plot(fit)

# Extract leverage and Cook's distance
h <- hatvalues(fit)
cd <- cooks.distance(fit)
which.max(cd)
```

### Influential points

An observation is **influential** if removing it substantially changes the fitted model. The usual diagnostic is Cook's distance. Influential points should be examined carefully — they may be data entry errors, or they may represent genuinely unusual cases that are important to understand.

---

## Residual variance estimates revisited

The residual variance is estimated by the residual mean square, which is an unbiased estimator when the model is correctly specified. Underfitting and overfitting affect this estimate in different ways.

For the model $Y = X beta + epsilon$ with $epsilon tilde N(0, sigma^2 I)$:

- The unbiased estimator of $sigma^2$ is $hat(sigma)^2 = "RSS" slash (n - p)$.
- Underfitting biases $hat(sigma)^2$ upward.
- Overfitting does not bias $hat(sigma)^2$ but inflates its variance.

---

## Covariate model selection strategies

Model selection can be approached through various strategies, including manual exploration, nested model tests, information criteria, dimensionality reduction, and good experimental design.

1. **Manual exploration**: use domain knowledge and examine how adding each predictor changes coefficients and significance.
2. **Nested model comparison**: use ANOVA ($F$-tests) for nested models.
3. **Information criteria**: use "AIC"/"BIC" via stepwise search or all-subsets regression.
4. **Principal components regression**: reduce the covariate space by replacing correlated predictors with their principal components.
5. **Good experimental design**: randomisation and stratification reduce the need for complex model searches.

---

## R code: complete diagnostic workflow

```r
data(swiss)
fit <- lm(Fertility ~ Agriculture + Examination + Education + Catholic,
          data = swiss)

# 1. Summary
summary(fit)

# 2. Diagnostic plots
par(mfrow = c(2, 2))
plot(fit)

# 3. VIF
library(car)
vif(fit)

# 4. ANOVA for nested models
fit1 <- lm(Fertility ~ Agriculture, data = swiss)
fit2 <- update(fit1, . ~ . + Examination + Education)
fit3 <- update(fit2, . ~ . + Catholic)
anova(fit1, fit2, fit3)

# 5. Stepwise selection
fit_all <- lm(Fertility ~ ., data = swiss)
step(fit_all, k = log(nrow(swiss)))
```

---

## Common mistakes

1. **Not checking residual plots.** A model can look significant on paper but be completely wrong.
2. **Using stepwise selection and interpreting the $p$-values.** The $p$-values are invalid after selection.
3. **Removing influential points without investigation.** They may contain important information.
4. **Ignoring the order of models in `anova()`.** Always list from most restricted to least restricted.
5. **Overcomplicating the model.** Simpler models are easier to interpret and often predict better.

---

## Revision checklist

- [ ] I can compute VIFs and interpret them.
- [ ] I can perform ANOVA to compare nested models.
- [ ] I can carry out stepwise model selection and understand its limitations.
- [ ] I can interpret leverage and Cook's distance.
- [ ] I can perform a complete residual diagnostic analysis in R.
- [ ] I understand the bias-variance tradeoff in model selection.
---

## Make it click: A large VIF means unstable separation

**Work it through.** If a predictor can be explained by other predictors with R² = 0.8, its variance inflation factor is 1 / (1 − 0.8) = 5. The model may still predict well, yet have difficulty deciding which correlated predictor deserves credit. Look at residuals against fitted values to diagnose shape and unequal spread.

**See it.** Sketch two nearly duplicate predictors, then imagine nudging one data point. Their separate coefficients can swing even while combined predictions barely change.

**What the questions are checking.** This is later-course material. Return to [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q16/Q17 for VIF and nested model comparison; the current midsem mock is not a substitute for the full diagnostics chapter.

> [!warning] Common trap
> High VIF does not prove a predictor has no value; it flags imprecision in its coefficient given the other predictors.
