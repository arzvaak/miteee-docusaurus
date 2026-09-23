---
title: "Questions from Class Material"
math_syntax: typst
---

# Questions from Class Material

Worked answers to questions drawn from the Coursera course quizzes and problem sets for Statistical Inference and Regression Models. Each answer includes the full working and an explanation of why the distractors are wrong.

---

## Statistical Inference — Week 1: Probability and Expected Values

### Q1. Conditional probability with dice

You roll a fair die. Given that the outcome is odd, what is the probability it is a 1?

**Answer: $1 slash 3$**

Let $A = {1}$ and $B = {1, 3, 5}$. Then:

$$
P(1 | "Odd") = frac(P(A ∩ B), P(B)) = frac(P({1}), P({1,3,5})) = frac(1/6, 3/6) = 1/3
$$

- **Distractor $1/6$**: this is $P(1)$, ignoring the conditioning.
- **Distractor $1/2$**: confusing the event "odd" with just two outcomes (1 and not-1).

### Q2. Bayes' theorem for disease testing

A disease has prevalence 1%. A test has sensitivity 95% and specificity 90%. What is the positive predictive value?

**Answer: approximately 8.8%**

$$
P(D | +) = frac(0.95 times 0.01, 0.95 times 0.01 + 0.10 times 0.99) = frac(0.0095, 0.0095 + 0.099) = frac(0.0095, 0.1085) approx 0.0876
$$

- **Distractor 95%**: confusing sensitivity with PPV.
- **Distractor 50%**: assuming the test is equally likely to be right or wrong.
- **Distractor 90%**: confusing specificity with PPV.

### Q3. Properties of expectation

If $X$ has mean 5 and variance 9, what is $E[3X + 7]$ and $"Var"(3X + 7)$?

**Answer: $E[3X+7] = 22$, $"Var"(3X+7) = 81$**

- $E[3X + 7] = 3(5) + 7 = 22$ (linearity of expectation).
- $"Var"(3X + 7) = 3^2 times 9 = 81$ (constants multiply variance by their square; additive constants vanish).

- **Distractor $"Var" = 34$**: adding 7 to the variance instead of squaring the multiplier.
- **Distractor $E = 22$, $"Var" = 34$**: common error of adding the constant to variance.

---

## Statistical Inference — Week 2: Variability, Distributions, and Asymptotics

### Q4. Central Limit Theorem application

Suppose $X_1, dots.h, X_{100}$ are IID Exponential(1). By the CLT, what is the approximate distribution of $bar(X)$?

**Answer: $bar(X) tilde approx N(1, 0.01)$**

- The Exponential(1) has mean $mu = 1$ and variance $sigma^2 = 1$.
- By the CLT: $bar(X) tilde approx N(mu, sigma^2 slash n) = N(1, 1 slash 100) = N(1, 0.01)$.

- **Distractor $N(1, 1)$**: forgetting to divide the variance by $n$.
- **Distractor $"Exp"(1)$**: confusing the distribution of individual observations with the distribution of the mean.
- **Distractor $N(0, 1)$**: forgetting to centre at $mu$.

### Q5. Normal approximation to Binomial

If $X tilde "Binom"(100, 0.3)$, what is $P(X <= 28)$ approximately?

**Answer: approximately 0.348 (using continuity correction)**

- $X tilde approx N(30, 21)$ (since $mu = 30$, $sigma^2 = 21$).
- With continuity correction: $P(X <= 28) = P(Z <= (28.5 - 30) slash sqrt(21)) = P(Z <= -0.327) approx 0.372$.
- Without continuity correction: $P(Z <= (28 - 30) slash sqrt(21)) = P(Z <= -0.436) approx 0.331$.

- **Distractor 0.5**: assuming symmetry around the mean without computing.
- **Distractor exact value from R**: using `pbinom(28, 100, 0.3)` = 0.312. The normal approximation is close but not exact.

### Q6. Properties of the $t$-distribution

Which of the following is true about the $t$-distribution with 5 degrees of freedom compared to the standard normal?

**Answer: it has heavier tails**

- The $t$-distribution accounts for the extra uncertainty of estimating $sigma$ with $S$. This uncertainty manifests as heavier tails.
- As degrees of freedom increase, the $t$ approaches $N(0, 1)$.

- **Distractor**: "it has lighter tails" — incorrect, the extra uncertainty makes extreme values more likely.
- **Distractor**: "it is always identical to the normal" — only in the limit as $"df" -> infinity$.

---

## Statistical Inference — Week 3: Intervals, Testing, and P Values

### Q7. Confidence interval interpretation

A 95% confidence interval for a mean is (45.7, 54.3). Which statement is correct?

**Answer: "If we repeated the sampling procedure many times, about 95% of the resulting intervals would contain the true mean."**

- **Distractor**: "There is a 95% probability that the true mean lies in (45.7, 54.3)." — the mean is fixed; the interval either contains it or it does not. The probability is about the procedure, not this specific interval.
- **Distractor**: "95% of the data falls in (45.7, 54.3)." — a CI is about the mean, not individual data points.

### Q8. Two-sided $t$-test

A sample of $n = 25$ gives $bar(X) = 102$ and $S = 10$. Test $H_0: mu = 100$ vs $H_a: mu != 100$ at $alpha = 0.05$.

**Answer: fail to reject $H_0$**

$$
T = frac(102 - 100, 10 slash sqrt(25)) = frac(2, 2) = 1.00
$$

Critical values: $plus.minus t_{24, 0.975} = plus.minus 2.064$.

Since $|T| = 1.00 < 2.064$, fail to reject.

- **Distractor**: "reject because $102 > 100$" — significance is not determined by the sign or magnitude of the difference alone.
- **Distractor**: "p-value is 0.046" — this would require $T approx 2.07$, which is not the case.

### Q9. P-value interpretation

If the p-value for a test is 0.03, which conclusion is valid at $alpha = 0.05$?

**Answer: "There is strong evidence against $H_0$; reject $H_0$."**

- **Distractor**: "$H_0$ is false with probability 0.97." — the p-value is not $P(H_0 | "data")$.
- **Distractor**: "The probability of a Type I error is 0.03." — the Type I error rate is $alpha$, not the p-value.

---

## Statistical Inference — Week 4: Power, Bootstrapping, and Permutation Tests

### Q10. Power and sample size

To detect a difference of 1 unit (with $sigma = 4$) with 80% power at $alpha = 0.05$, approximately how many observations per group are needed?

**Answer: approximately 251 per group**

For a two-sample test comparing two means:

$$
n = frac(2 (z_{1 - alpha slash 2} + z_{1 - beta})^2 sigma^2, delta^2) = frac(2 times (1.96 + 0.84)^2 times 16, 1) = frac(2 times 7.84 times 16, 1) = 250.9
$$

Round up to 251 per group.

- **Distractor**: forgetting the factor of 2 for two-sample tests, yielding ~125 instead of ~251.
- **Distractor**: using $z_{0.95} = 1.645$ instead of $z_{0.80} = 0.84$ for the power component.

### Q11. Bootstrap vs permutation

Which statement correctly distinguishes bootstrap from permutation tests?

**Answer: "Bootstrap resamples with replacement to estimate a sampling distribution; permutation tests reassign labels without replacement to test a hypothesis."**

- **Distractor**: "Both produce p-values." — bootstrap produces a sampling distribution and CIs, not p-values directly.
- **Distractor**: "Permutation tests assume normality." — permutation tests are distribution-free.

---

## Regression Models — Week 1: Least Squares and Linear Regression

### Q12. Least squares for the mean

What value of $mu$ minimises $sum_{i=1}^n (Y_i - mu)^2$?

**Answer: $mu = bar(Y)$**

This follows from setting the derivative to zero, or from the completing-the-square argument.

- **Distractor**: the median — the median minimises $sum |Y_i - mu|$, not the sum of squares.
- **Distractor**: the mode — the mode is the most frequent value, unrelated to least squares.

### Q13. Interpreting regression coefficients

In the model `mpg ~ wt` fitted to `mtcars`, $hat(beta)_1 = -5.34$. What does this mean?

**Answer: "For every additional 1000 lbs of weight, fuel efficiency decreases by about 5.34 mpg, on average."**

- **Distractor**: "Weight causes reduced mpg." — regression shows association, not causation.
- **Distractor**: "5.34% of the variation in mpg is explained by weight." — this confuses the slope with $R^2$.

### Q14. $R^2$ interpretation

In a simple linear regression, $R^2 = 0.64$. What does this tell you?

**Answer: "64% of the variability in $Y$ is explained by the linear relationship with $X$."**

- **Distractor**: "The correlation is 0.64." — in SLR, $R^2 = r^2$, so $|r| = 0.8$, not 0.64.
- **Distractor**: "There is a 64% chance the model is correct." — $R^2$ is not a probability of correctness.

---

## Regression Models — Week 2: Linear and Multivariable Regression

### Q15. Omitted variable bias

The true model is $Y = 2 + 3X_1 + 5X_2 + epsilon$ with $"Cov"(X_1, X_2) = 0.5$ and $"Var"(X_1) = 1$. If you fit only $Y = alpha_0 + alpha_1 X_1 + u$, what is the bias in $hat(alpha)_1$?

**Answer: $5 times 0.5 slash 1 = 2.5$**

The bias = $beta_2 times "Cov"(X_1, X_2) slash "Var"(X_1) = 5 times 0.5 slash 1 = 2.5$.

So $E[hat(alpha)_1] = 3 + 2.5 = 5.5$, which overestimates the true effect of $X_1$.

- **Distractor**: "No bias" — only if $X_1$ and $X_2$ are uncorrelated ($"Cov" = 0$).
- **Distractor**: bias = 5 — forgetting to multiply by the covariance ratio.

### Q16. VIF interpretation

A predictor has $"VIF" = 8$. What does this mean?

**Answer: "The variance of this predictor's coefficient estimate is 8 times larger than it would be if the predictor were uncorrelated with the other predictors."**

- **Distractor**: "The predictor is 8 times more important." — VIF measures variance inflation, not importance.
- **Distractor**: "The correlation between this predictor and others is 0.8." — $R_j^2 = 1 - 1/8 = 0.875$, not 0.8.

### Q17. ANOVA for nested models

You compare three nested models with RSS values of 500, 420, and 410, with 20, 22, and 24 degrees of freedom respectively. What does the ANOVA test for the comparison of Model 1 vs Model 2 show?

**Answer: $F = ((500 - 420) slash (22 - 20)) slash (420 slash 18) = 40 slash 23.33 = 1.71$, with $F_{2, 18}$ distribution.**

Compare to critical $F_{2, 18, 0.95} approx 3.55$. Since $1.71 < 3.55$, fail to reject — the additional variables do not significantly improve the model.

- **Distractor**: "The models are equivalent" — we fail to reject, but this does not prove equivalence.
- **Distractor**: comparing RSS directly without computing $F$.

---

## Extra: Miscellaneous

### Q18. Independence vs correlation

If $X$ and $Y$ are independent, which must be true?

**Answer: $E[X Y] = E[X] E[Y]$ and $"Cov"(X, Y) = 0$.**

Independence implies uncorrelatedness, but uncorrelatedness does not imply independence (unless the joint distribution is normal).

- **Distractor**: "If $"Cov"(X, Y) = 0$, then $X$ and $Y$ are independent." — not true in general (e.g., $X tilde "Unif"(-1, 1)$, $Y = X^2$).
