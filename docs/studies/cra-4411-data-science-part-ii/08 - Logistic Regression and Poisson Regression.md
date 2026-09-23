---
title: "08 - Logistic Regression and Poisson Regression"
math_syntax: typst
---

# 08 — Logistic Regression and Poisson Regression

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


*Regression Models, Week 4 — later material, outside midterm scope*

Linear regression assumes a continuous, normally distributed response. When the response is a count or a binary outcome, the standard linear model is inappropriate. Generalised linear models (GLMs) extend the regression framework to handle these cases. This chapter covers logistic regression for binary outcomes and Poisson regression for count data.

---

## First, read the notation in words

For a binary outcome with probability $p$, the odds are $p/(1-p)$ and the log-odds are $log(p/(1-p))$. A logistic coefficient adds to the log-odds; exponentiating it gives an odds multiplier. Poisson regression models an expected count or rate, and an exponentiated coefficient multiplies that expectation.

> [!question] Try to recall
> For p = 0.2, calculate odds 0.2/0.8 = 0.25. If odds double, recompute probability: 0.5/(1+0.5) = 1/3, not 0.4.

---

## Limitations of linear regression

Linear regression assumes a continuous response, symmetric errors, and constant variance. These assumptions are violated when the response is discrete, bounded, or nonlinearly related to the predictors.

The linear model $Y = X beta + epsilon$ with $epsilon tilde N(0, sigma^2)$ assumes:

- The response $Y$ is continuous.
- Errors are symmetric (positive and negative deviations are equally likely).
- The variance is constant (homoscedasticity).

These assumptions fail when:

- The response is **discrete** (0/1, counts). A linear model can predict values outside the valid range.
- The response must be **positive** (e.g., counts, concentrations). Gaussian errors allow negative predictions.
- The relationship is **nonlinear** on the original scale.

---

## Generalised linear models (GLMs)

Generalized linear models extend linear regression to accommodate non-normal response distributions. They consist of three components: an exponential family distribution, a linear predictor, and a link function.

GLMs, introduced by Nelder and Wedderburn (1972), have three components:

1. **Exponential family distribution** for the response (e.g., Gaussian, Bernoulli, Poisson).
2. **Systematic component** (linear predictor): $eta = X beta$, a linear combination of the predictors.
3. **Link function** $g$ connecting the mean of the response to the linear predictor: $g(mu) = eta$.

The GLM framework unifies many regression models under one theoretical structure.

---

## Logistic regression

### When to use it

Logistic regression is used when the response variable is binary and the goal is to model the probability of success as a function of predictor variables.

- The response $Y$ is **binary** (success/failure, 0/1, disease/healthy).
- You want to model the **probability** of success as a function of predictors.

### Model

The logistic regression model uses the logit link to relate the probability of success to a linear combination of predictors. The inverse logit function ensures that predictions lie between 0 and 1.

Assume $Y_i tilde "Bernoulli"(mu_i)$, so $E[Y_i] = mu_i$ and $0 <= mu_i <= 1$.

- **Linear predictor**: $eta_i = beta_0 + beta_1 X_(i 1) + dots.h + beta_p X_(i p)$.
- **Link function** (logit): $g(mu) = log(frac(mu, 1 - mu)) = eta$.
- **Inverse link** (inverse logit): $mu = frac(e^eta, 1 + e^eta)$.

### Interpretation

In logistic regression, the coefficient $beta_j$ represents the change in the log-odds of success for a one-unit increase in the predictor, holding other predictors constant. The exponentiated coefficient gives the odds ratio.

- $beta_j$ is the change in the **log-odds** of success for a one-unit increase in $X_j$, holding other predictors constant.
- $e^{beta_j}$ is the **odds ratio**: the multiplicative change in the odds for a one-unit increase in $X_j$.
- $beta_j > 0$: increasing $X_j$ increases the probability of success.
- $beta_j < 0$: increasing $X_j$ decreases the probability of success.

### Odds and probabilities

The odds of success are defined as the probability of success divided by the probability of failure. The logit transformation links these odds to the linear predictor, and the inverse logit function converts back to a probability.

- **Odds** of success: $frac(mu, 1 - mu)$.
- **Log-odds** (logit): $log(frac(mu, 1 - mu))$.
- Given log-odds $eta$: $mu = frac(e^eta, 1 + e^eta)$ and $1 - mu = frac(1, 1 + e^eta)$.

> **Worked example.** Fit a logistic regression for whether a car has automatic transmission (`am = 0`) vs manual (`am = 1`) as a function of weight (`wt`):
>
> ```r
> data(mtcars)
> fit <- glm(am ~ wt, data = mtcars, family = binomial)
> summary(fit)
>
> # Coefficient for wt is negative: heavier cars are less likely to be manual.
> # exp(coef): odds ratio. exp(-2.43) ≈ 0.088.
> # A 1000 lb increase in weight multiplies the odds of being manual by ~0.088.
>
> # Predicted probabilities
> newdata <- data.frame(wt = seq(1.5, 5.5, by = 0.5))
> newdata$prob <- predict(fit, newdata, type = "response")
> plot(newdata$wt, newdata$prob, type = "l", lwd = 2,
>      xlab = "Weight (1000 lbs)", ylab = "P(manual)",
>      main = "Logistic regression: transmission ~ weight")
> ```

### Likelihood

The log-likelihood function for logistic regression is maximized to estimate the coefficients $beta$. Here, $Y_i$ is the binary response and $X_i$ is the predictor vector for observation $i$.

The log-likelihood for logistic regression is:

$$
ell(beta) = sum_(i=1)^n [Y_i log(mu_i) + (1 - Y_i) log(1 - mu_i)]
$$

where $mu_i = frac(e^{X_i^T beta}, 1 + e^{X_i^T beta})$.

There is no closed-form solution; estimates are obtained via **iteratively reweighted least squares (IRLS)** or Newton–Raphson optimisation.

### Inference

Statistical inference in logistic regression uses the Wald test, likelihood ratio test, and confidence intervals. Here, $hat(beta)_j$ is the estimated coefficient, $"SE"(hat(beta)_j)$ is its standard error, and $z_j$ is the Wald statistic.

- **Wald test**: $z_j = hat(beta)_j slash "SE"(hat(beta)_j)$, compared to $N(0, 1)$.
- **Likelihood ratio test**: compare the deviance of nested models. $G = 2(ell_"full" - ell_"reduced") tilde chi^2_{p_2 - p_1}$.
- **Confidence intervals**: $hat(beta)_j plus.minus z_{1 - alpha slash 2} "SE"(hat(beta)_j)$, or exponentiate for odds ratio CIs.

### Goodness of fit

Goodness-of-fit measures for logistic regression include deviance, the Hosmer-Lemeshow test, and AIC. Here, $ell$ is the log-likelihood and $k$ is the number of parameters.

- **Deviance**: $D = -2 ell(hat(beta)) + 2 ell("saturated model")$. Smaller deviance = better fit.
- **Hosmer–Lemeshow test**: checks calibration by grouping observations into deciles of predicted probability.
- **"AIC"**: for model comparison, $"AIC" = -2 ell + 2k$.

---

## Poisson regression

### When to use it

- The response $Y$ is a **non-negative integer** (count data).
- The response represents the number of events in a fixed interval.

### Model

In Poisson regression, the response $Y_i$ follows a Poisson distribution with mean $mu_i$, which is linked to the linear predictor $eta_i = X_i^T beta$ via the log link.

Assume $Y_i tilde "Poisson"(mu_i)$, so $E[Y_i] = mu_i$ and $"Var"(Y_i) = mu_i$.

- **Linear predictor**: $eta_i = X_i^T beta$.
- **Link function** (log): $g(mu) = log(mu) = eta$.
- **Inverse link**: $mu = e^eta$.

### Interpretation

- $beta_j$ is the change in the **log count** for a one-unit increase in $X_j$.
- $e^{beta_j}$ is the **multiplicative effect** on the count: a one-unit increase in $X_j$ multiplies the expected count by $e^{beta_j}$.
- $beta_j = 0.105$ → approximately a 11% increase in the expected count per unit increase in $X_j$.

> **Worked example.** Model the number of times a Mario character wins a coin race as a function of character type:
>
> ```r
> # Simulated example: n = 30 players, each plays 50 races
> set.seed(123)
> n <- 30
> character <- factor(sample(c("Mario", "Luigi", "Peach"), n, replace = TRUE))
> skill <- ifelse(character == "Peach", 0.5, ifelse(character == "Luigi", 0.3, 0.2))
> wins <- rpois(n, lambda = 50 * skill)
>
> fit_pois <- glm(wins ~ character, family = poisson)
> summary(fit_pois)
> exp(coef(fit_pois))  # rate ratios
> ```

### Likelihood

The log-likelihood function for Poisson regression is used to estimate the coefficients $beta$. Here, $Y_i$ is the count response and $X_i$ is the predictor vector for observation $i$.

The log-likelihood for Poisson regression:

$$
ell(beta) = sum_(i=1)^n [Y_i log(mu_i) - mu_i - log(Y_i!)]
$$

where $mu_i = e^{X_i^T beta}$.

### Overdispersion

Overdispersion occurs when the variance of the response $Y$ exceeds the mean $mu$. The quasi-Poisson model introduces a dispersion parameter $phi$ to account for this.

In practice, count data often exhibit more variability than the Poisson model assumes ($"Var"(Y) > mu$). This is called **overdispersion**.

- **Quasi-Poisson** model: $g(mu) = log(mu)$ but $"Var"(Y) = phi times mu$, where $phi$ is estimated from the data.
- **Negative binomial** model: a more flexible alternative that naturally accommodates overdispersion.

```r
# Check for overdispersion
summary(fit_pois)
# If residual deviance >> residual df, overdispersion is present.

# Quasi-Poisson alternative
fit_qp <- glm(wins ~ character, family = quasipoisson)
summary(fit_qp)  # SEs are now scaled by sqrt(phi)
```

---

## Log-linear models

Log-linear models for contingency tables use Poisson regression to model the expected counts $mu_(i j)$ from observed counts $n_(i j)$.

Poisson regression with interactions between categorical predictors is called a **log-linear model**, commonly used in contingency table analysis.

For a two-way table of counts $n_(i j)$:

$$
log(mu_(i j)) = alpha + alpha_i + beta_j + (alpha beta)_(i j)
$$

- No interaction → independence of row and column variables.
- Interaction term → association between variables.

---

## Comparing logistic and Poisson models

| Feature | Logistic | Poisson |
| --- | --- | --- |
| Response type | Binary (0/1) | Count (0, 1, 2, …) |
| Distribution | Bernoulli / Binomial | Poisson |
| Link function | Logit: $log(mu slash (1 - mu))$ | Log: $log(mu)$ |
| Canonical link? | Yes | Yes |
| Interpretation | Log-odds | Log count |
| Overdispersion | Not applicable (use quasibinomial if needed) | Common; use quasi-Poisson or negative binomial |

---

## Model diagnostics for GLMs

Diagnostic plots for GLMs use Pearson and deviance residuals, where $Y_i$ is the observed response and $hat(mu)_i$ is the fitted mean.

Unlike linear regression, standard residual plots for GLMs need care:

- **Pearson residuals**: $r_i = (Y_i - hat(mu)_i) slash sqrt(hat(mu)_i)$.
- **Deviance residuals**: based on the contribution of each observation to the deviance.
- **Pearson chi-squared statistic**: $chi^2 = sum r_i^2$. Compare to $n - p$ to check fit.
- **Deviance**: compare to $n - p$; a large discrepancy indicates poor fit.

```r
# Residual diagnostics for logistic regression
par(mfrow = c(2, 2))
plot(fit)

# Residual diagnostics for Poisson regression
par(mfrow = c(2, 2))
plot(fit_pois)
```

---

## R code: complete GLM workflow

### Logistic regression

```r
data(mtcars)

# Fit logistic regression
fit <- glm(am ~ wt + hp, data = mtcars, family = binomial)
summary(fit)

# Odds ratios
exp(coef(fit))
exp(confint.default(fit))  # Wald CI for odds ratios

# Predicted probabilities
mtcars$pred_prob <- predict(fit, type = "response")
hist(mtcars$pred_prob, breaks = 15, main = "Predicted P(manual)")

# Likelihood ratio test: compare with simpler model
fit_reduced <- glm(am ~ wt, data = mtcars, family = binomial)
anova(fit_reduced, fit, test = "Chisq")
```

### Poisson regression

```r
# Simulated count data
set.seed(42)
n <- 200
x1 <- rnorm(n)
x2 <- rbinom(n, 1, 0.5)
lambda <- exp(1 + 0.5 * x1 + 0.3 * x2)
y <- rpois(n, lambda)

fit_pois <- glm(y ~ x1 + x2, family = poisson)
summary(fit_pois)

# Rate ratios
exp(coef(fit_pois))

# Check for overdispersion
deviance(fit_pois) / df.residual(fit_pois)  # Should be near 1

# If overdispersed:
fit_qp <- glm(y ~ x1 + x2, family = quasipoisson)
summary(fit_qp)
```

---

## Common mistakes

1. **Using linear regression for binary outcomes.** Predictions can fall outside $[0, 1]$ and the standard errors are wrong.
2. **Interpreting logistic coefficients as probabilities.** They are log-odds; exponentiate to get odds ratios.
3. **Ignoring overdispersion in Poisson regression.** Leads to underestimated standard errors and inflated significance.
4. **Using $R^2$ for GLMs.** Use pseudo-$R^2$ or likelihood-based measures instead.
5. **Not checking the link function.** An inappropriate link can produce misleading results.

---

## Revision checklist

- [ ] I can explain why linear regression is inappropriate for binary and count outcomes.
- [ ] I can state the three components of a GLM.
- [ ] I can fit and interpret a logistic regression model.
- [ ] I can convert between log-odds, odds, and probabilities.
- [ ] I can fit and interpret a Poisson regression model.
- [ ] I can detect and handle overdispersion.
- [ ] I can use likelihood ratio tests to compare nested GLMs.
- [ ] I can perform basic residual diagnostics for GLMs.
---

## Make it click: Turn a log-odds change into a probability

**Work it through.** If log-odds = −2 + 0.5x, then x = 4 gives log-odds 0, odds 1, and probability 1/2. At x = 5 the odds multiply by exp(0.5) ≈ 1.65, but the probability becomes about 0.62 rather than rising by 0.5. In Poisson regression, exponentiating a coefficient gives a multiplicative rate change.

**See it.** Make a table for x = 2, 4 and 6: compute log-odds, odds and probability separately. The probability stays between zero and one.

**What the questions are checking.** This chapter is after the midsem boundary. Use its worked examples for later regression questions; do not treat the current midsem mocks as coverage of logistic and Poisson models.

> [!warning] Common trap
> A logistic coefficient changes *log-odds*, not probability by a constant amount.
