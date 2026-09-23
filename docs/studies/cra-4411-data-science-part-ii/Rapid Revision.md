---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

Condensed cheat-sheet for last-minute review. Covers every major formula, definition, and procedure in the course.

---

## Statistical Inference

### Probability essentials

- $P(A | B) = P(A ∩ B) slash P(B)$
- Bayes: $P(B | A) = P(A | B) P(B) slash P(A)$
- $E[X] = sum x p(x)$ or $integral x f(x) dif x$
- $"Var"(X) = E[X^2] - (E[X])^2$
- $"Var"(a X + b) = a^2 "Var"(X)$
- $"Cov"(X,Y) = E[X Y] - E[X]E[Y]$
- $"Cor"(X,Y) = "Cov"(X,Y) slash (S_X S_Y)$

### Key distributions (mean, variance)

| Distribution | Mean | Variance |
| --- | --- | --- |
| Bernoulli($theta$) | $theta$ | $theta(1-theta)$ |
| Binomial($n$,$p$) | $n p$ | $n p(1-p)$ |
| Poisson($lambda$) | $lambda$ | $lambda$ |
| Normal($mu$,$sigma^2$) | $mu$ | $sigma^2$ |
| Exponential($lambda$) | $1/lambda$ | $1/lambda^2$ |

### Asymptotics

- LLN: $bar(X) -> mu$
- CLT: $sqrt(n)(bar(X) - mu)/sigma tilde approx N(0,1)$
- SE of mean: $sigma/sqrt(n)$
- 68-95-99.7 rule: $P(|Z|<1) approx 0.68$, $P(|Z|<2) approx 0.95$, $P(|Z|<3) approx 0.997$

### Confidence intervals

- Known $sigma$: $bar(X) plus.minus z_{1-alpha/2} sigma/sqrt(n)$
- Unknown $sigma$: $bar(X) plus.minus t_{n-1,1-alpha/2} S/sqrt(n)$
- 95% uses $z = 1.96$

### Hypothesis testing

- $z$-stat: $Z = (bar(X) - mu_0)/(sigma/sqrt(n))$
- $t$-stat: $T = (bar(X) - mu_0)/(S/sqrt(n))$, $"df" = n-1$
- p-value = probability of observing a result at least as extreme under $H_0$
- Reject if p-value $< alpha$

### Power

- Power = $P("reject" H_0 | H_a "true")$
- $n = (z_{1-alpha/2} + z_{1-beta})^2 sigma^2 / delta^2$ (one-sample)
- More power: larger $n$, larger effect, larger $alpha$, smaller $sigma$

### Resampling

- **Bootstrap**: resample with replacement → estimate sampling distribution → CI from quantiles
- **Permutation**: pool data, reassign labels without replacement → p-value from proportion of extreme statistics

---

## Regression Models

### Simple linear regression

Model: $Y_i = beta_0 + beta_1 X_i + epsilon_i$

- $hat(beta)_1 = "Cov"(X,Y)/"Var"(X)$
- $hat(beta)_0 = bar(Y) - hat(beta)_1 bar(X)$
- $R^2 = 1 - "SSE"/"SST"$
- $"RSE" = sqrt("SSE"/(n-2))$

### Goodness of fit

- $"SST" = sum(Y_i - bar(Y))^2$
- $"SSR" = sum(hat(Y)_i - bar(Y))^2$
- $"SSE" = sum(Y_i - hat(Y)_i)^2$
- $"SST" = "SSR" + "SSE"$
- $R^2 = "SSR"/"SST"$

### Inference in SLR

- $"SE"(hat(beta)_1) = "RSE" / sqrt(sum(X_i - bar(X))^2)$
- $t = hat(beta)_1/"SE"(hat(beta)_1)$, $"df" = n-2$
- CI: $hat(beta)_1 plus.minus t_{n-2,1-alpha/2} "SE"(hat(beta)_1)$

### Multivariable regression

- $hat(beta) = (X^T X)^{-1} X^T Y$
- $"Var"(hat(beta)) = sigma^2 (X^T X)^{-1}$
- Each $beta_j$ = change in $Y$ per unit change in $X_j$, holding others constant
- Adjusted $R^2 = 1 - ("SSE"/(n-p-1))/("SST"/(n-1))$

### Omitted variable bias

- $E[hat(alpha)_1] = beta_1 + beta_2 "Cov"(X_1,Z)/"Var"(X_1)$
- Bias $= 0$ iff $beta_2 = 0$ or $"Cov"(X_1,Z) = 0$

### VIF and collinearity

- $"VIF"_j = 1/(1 - R_j^2)$
- $"VIF" > 5$: moderate concern; $"VIF" > 10$: serious

### ANOVA $F$-test (nested models)

- $F = (("RSS"_1 - "RSS"_2)/(p_2 - p_1)) / ("RSS"_2/(n - p_2))$
- Large $F$ → prefer the fuller model

### Model selection

- $"AIC" = -2 log(L) + 2k$ (lower is better)
- $"BIC" = -2 log(L) + k log(n)$ (lower is better, penalises more)
- Stepwise: add/remove predictors one at a time to minimise AIC/BIC

### Diagnostics

- Residuals vs fitted: check linearity
- Q-Q plot: check normality
- Scale-location: check constant variance
- Leverage: $h_(i i) > 2p/n$ → investigate
- Cook's distance: $D_i > 1$ or $D_i > 4/n$ → influential

---

## GLMs (later material)

### Logistic regression

- Link: $log(mu/(1-mu)) = X^T beta$
- Inverse: $mu = e^X beta / (1 + e^X beta)$
- $e^{beta_j}$ = odds ratio for $X_j$
- Deviance for goodness of fit
- Likelihood ratio test: $G = 2(log L_"full" - log L_"reduced") tilde chi^2$

### Poisson regression

- Link: $log(mu) = X^T beta$
- Inverse: $mu = e^{X^T beta}$
- $e^{beta_j}$ = rate ratio for $X_j$
- Overdispersion check: $"residual deviance" / "df" approx 1$; use quasi-Poisson if $>> 1$

---

## Quick R reference

| Task | R code |
| --- | --- |
| $t$-test | `t.test(x, mu = 0)` |
| Two-sample $t$ | `t.test(x, y)` |
| Paired $t$ | `t.test(x, y, paired = TRUE)` |
| Fit SLR | `fit <- lm(y ~ x)` |
| Fit MLR | `fit <- lm(y ~ x1 + x2)` |
| Summary | `summary(fit)` |
| Residual plots | `plot(fit)` |
| VIF | `car::vif(fit)` |
| ANOVA | `anova(fit1, fit2)` |
| Stepwise | `step(fit, k = log(n))` |
| Logistic | `glm(y ~ x, family = binomial)` |
| Poisson | `glm(y ~ x, family = poisson)` |
| Bootstrap | `replicate(B, statistic(sample(data, replace = TRUE)))` |

---

> **Last tip.** On exam day, write the hypotheses first, check assumptions second, compute the test statistic third, then make your decision. Structure prevents panic.
