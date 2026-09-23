---
title: "Formula and Methods"
math_syntax: typst
---

# Formula and Methods

> Consolidated reference for all key formulas, derivations, and method summaries in CRA 4412.

---

## Part I — Practical Machine Learning

---

### 1. Error Metrics

#### Mean Squared Error (MSE)

$$
"MSE" = 1/n sum_(i=1)^(n) (hat(Y)_i - Y_i)^2
$$

#### Root Mean Squared Error (RMSE)

$$
"RMSE" = sqrt(1/n sum_(i=1)^(n) (hat(Y)_i - Y_i)^2)
$$

Same units as $Y$. Most commonly used continuous error measure. Sensitive to outliers.

#### Median Absolute Deviation

$$
"MAD" = "median"(|hat(Y)_i - Y_i|)
$$

Robust to outliers.

#### Cohen's Kappa (Concordance)

$$
kappa = ("accuracy" - P(e)) / (1 - P(e))
$$

where

$$
P(e) = frac("TP" + "FP", "total") times frac("TP" + "FN", "total") + frac("TN" + "FN", "total") times frac("FP" + "TN", "total")
$$

- $kappa = 0$: agreement no better than chance
- $kappa = 1$: perfect agreement

---

### 2. Classification Tree Impurity Measures

Let $hat(p)_(m k)$ be the estimated proportion of class $k$ in group $m$ of size $N_m$.

#### Misclassification Error

$$
"Error" = 1 - hat(p)_(m, k(m))
$$

where $k(m) = op("argmax", limits: #true)_k hat(p)_(m k)$ is the majority class. Ranges from 0 (pure) to 0.5 (impure for binary).

#### Gini Index

$$
"Gini" = sum_(k=1)^(K) hat(p)_(m k) (1 - hat(p)_(m k)) = 1 - sum_(k=1)^(K) hat(p)_(m k)^2
$$

Ranges from 0 (pure) to $1 - 1/K$ (maximum impurity for equal classes).

#### Deviance

$$
D = -2 sum_(k=1)^(K) hat(p)_(m k) ln(hat(p)_(m k))
$$

Ranges from 0 (pure) to $2 ln(K)$ (maximum).

#### Information Gain

$$
"IG" = -sum_(k=1)^(K) hat(p)_(m k) log_2(hat(p)_(m k))
$$

Ranges from 0 (pure) to $log_2(K)$ (maximum).

---

### 3. Linear Regression

#### Model

$$
Y_i = beta_0 + beta_1 X_(1i) + beta_2 X_(2i) + dots.h + beta_p X_(p i) + epsilon_i
$$

#### Prediction

$$
hat(Y)_i = hat(beta)_0 + hat(beta)_1 X_(1i) + dots.h + hat(beta)_p X_(p i)
$$

#### Coefficient Interpretation

$beta_j$ = expected change in $Y$ for a one-unit increase in $X_j$, holding all other predictors constant.

#### Key Properties

- If both $X$ and $Y$ are centred (mean 0), the intercept $beta_0 = 0$.
- When an intercept is included, residuals sum to exactly 0.
- Changing units: if $X$ is multiplied by $c$, $beta_j$ is divided by $c$.
- Shifting $X$ by constant $c$: slope unchanged, intercept changes by $-c beta_j$.

---

### 4. Expected Prediction Error Decomposition

For model $hat(f)_lambda$ with tuning parameter $lambda$:

$$
E[(Y - hat(f)_lambda (X))^2] = sigma^2 + "Bias"^2 (hat(f)_lambda) + "Var"(hat(f)_lambda)
$$

| Component | Source | Reducible? |
|-----------|--------|-----------|
| Irreducible ($sigma^2$) | Noise in data | No |
| $"Bias"^2$ | Wrong model assumptions | Yes (more complex model) |
| Variance | Sensitivity to training data | Yes (simpler model, regularisation) |

**Goal**: minimise total EPE by trading off bias and variance.

---

### 5. Bayes' Theorem for Classification

$$
P(Y = k | X = x) = frac(f_k(x) pi_k, sum_(ell=1)^(K) f_ell(x) pi_ell)
$$

where:
- $f_k(x) = P(X = x | Y = k)$ is the class-conditional density
- $pi_k = P(Y = k)$ is the prior probability

Classify to: $hat(Y)(x) = op("argmax", limits: #true)_k P(Y = k | X = x)$

---

### 6. Linear Discriminant Analysis (LDA)

Assumes $f_k(x)$ is multivariate Gaussian with **common** covariance $Sigma$.

#### Discriminant Function

$$
delta_k(x) = x^(T) Sigma^(-1) mu_k - 1/2 mu_k^(T) Sigma^(-1) mu_k + log(pi_k)
$$

#### Log-Ratio for Two Classes

$$
log (P(Y = k | X = x) / P(Y = j | X = x)) = log (pi_k / pi_j) - 1/2 (mu_k + mu_j)^(T) Sigma^(-1) (mu_k + mu_j) + x^(T) Sigma^(-1) (mu_k - mu_j)
$$

This is **linear** in $x$ → decision boundaries are lines/hyperplanes.

---

### 7. Naive Bayes

Assumes conditional independence of predictors given the class:

$$
P(Y = k | X_1, dots.h, X_m) prop pi_k product_(j=1)^(m) P(X_j | Y = k)
$$

**Why "naive"**: predictors are rarely truly independent. Works well with large numbers of binary/categorical variables.

---

### 8. Regularised Regression

#### Penalised Residual Sum of Squares (General)

$$
"PRSS"(beta) = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + P(lambda; beta)
$$

#### Ridge Regression ($L_2$ penalty)

$$
"PRSS"_("ridge") = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + lambda sum_(j=1)^(p) beta_j^2
$$

- All coefficients shrink toward zero but **never reach** exactly zero
- All predictors remain in the model
- Makes the problem non-singular even when $X^(T)X$ is not invertible

#### Lasso Regression ($L_1$ penalty)

$$
"PRSS"_("lasso") = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + lambda sum_(j=1)^(p) |beta_j|
$$

- Can set coefficients **exactly to zero** → automatic variable selection
- Produces sparse models

#### Tuning Parameter $lambda$

| $lambda$ value | Effect |
|-----------------|--------|
| $lambda -> 0$ | Approaches OLS |
| $lambda -> infinity$ | All coefficients → 0 |

Choose $lambda$ via cross-validation to minimise prediction error.

---

### 9. Boosting

$$
f(x) = sum_(i=1)^(K) alpha_i h_i(x)
$$

- Start with weak classifiers $h_1, dots.h, h_K$
- Iteratively select classifiers, compute weights $alpha_i$ based on errors
- Up-weight misclassified observations for the next classifier
- Final predictor is the weighted combination

---

### 10. Bias–Variance Trade-off Summary

| Method | Bias | Variance | Notes |
|--------|------|----------|-------|
| Simple regression | High | Low | Under-fitting risk |
| Complex regression | Low | High | Over-fitting risk |
| Bagging | Same as base | Reduced | Averaging reduces variance |
| Random Forest | Same as base | Further reduced | Decorrelates trees |
| Boosting | Reduced iteratively | Moderate | Focuses on hard cases |
| Ridge regression | Slightly increased | Reduced | Shrinks coefficients |
| Lasso | Slightly increased | Reduced + selection | Zeroes coefficients |

---

## Part II — Developing Data Products

---

### 11. Shiny Architecture

$$
"User Input" arrow.r^(...) "Server Computation" arrow.r^(...) "UI Output"
$$

- `ui.R` defines layout and input/output placeholders
- `server.R` defines reactive expressions and render functions
- Commas between **siblings only** (most common bug source)

---

### 12. googleVis Merging

$$
"Chart"_1 arrow.r^(...) "Chart"_2
$$

Can only merge **two** charts at a time; chain for more.

---

### 13. R Package Structure

$$
"Package" = "DESCRIPTION" + "R/" + "man/" + "NAMESPACE"
$$

- `DESCRIPTION` → metadata
- `R/` → source code
- `man/` → documentation (`.Rd` or roxygen2-generated)
- `NAMESPACE` → exported functions, imported dependencies

---

## Quick Reference: Key R Functions

| Function | Package | Purpose |
|----------|---------|---------|
| `createDataPartition()` | caret | Stratified train/test split |
| `createFolds()` | caret | K-fold cross-validation indices |
| `train()` | caret | Train a model with cross-validation |
| `confusionMatrix()` | caret | Evaluate classification performance |
| `preProcess()` | caret | Center, scale, impute, PCA |
| `prcomp()` | base | Principal component analysis |
| `lm.ridge()` | MASS | Ridge regression |
| `kmeans()` | base | K-means clustering |
| `shinyUI()` / `shinyServer()` | shiny | Define Shiny app structure |
| `runApp()` | shiny | Run a Shiny app |
| `nPlot()` / `rPlot()` | rCharts | Interactive JS charts |
| `gvisLineChart()` | googleVis | Google Charts |
| `slidify()` | slidify | Render HTML5 presentations |
| `package.skeleton()` | utils | Create R package skeleton |
| `setClass()` / `setMethod()` | methods | Define S4 classes and methods |
