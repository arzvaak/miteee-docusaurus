---
title: "Extra Practice"
math_syntax: typst
---

# Extra Practice

Additional problems beyond the class material, with full solutions. These cover all topics in the course and are designed to deepen understanding and build exam readiness.

---

## Probability and Distributions (SI Week 1–2)

### E1. Conditional probability with cards

A card is drawn from a standard 52-card deck. Given that the card is a face card (J, Q, K), what is the probability it is a heart?

**Solution:**

There are 12 face cards total (3 per suit). Of these, 3 are hearts.

$$
P("Heart" | "Face") = 3 slash 12 = 1 slash 4 = 0.25
$$

### E2. Bayes' theorem with false positives

A factory has two machines. Machine A produces 60% of items and has a defect rate of 2%. Machine B produces 40% of items and has a defect rate of 5%. An item is chosen at random and found to be defective. What is the probability it came from Machine A?

**Solution:**

Let $A$ = item from Machine A, $D$ = defective.

$$
P(A | D) = frac(P(D | A) P(A), P(D | A) P(A) + P(D | B) P(B))
$$

$$
= frac(0.02 times 0.60, 0.02 times 0.60 + 0.05 times 0.40) = frac(0.012, 0.012 + 0.020) = frac(0.012, 0.032) = 0.375
$$

### E3. Expectation and variance of a linear combination

Let $X tilde N(5, 4)$ and $Y tilde N(3, 9)$ be independent. Find the distribution of $W = 2X - 3Y + 10$.

**Solution:**

- $E[W] = 2(5) - 3(3) + 10 = 10 - 9 + 10 = 11$
- $"Var"(W) = 4 times 4 + 9 times 9 = 16 + 81 = 97$
- Since $X$ and $Y$ are normal and independent, $W tilde N(11, 97)$.

### E4. CLT for sample proportions

In a population, 40% support a policy. For a random sample of $n = 200$, approximate $P(hat(p) > 0.45)$.

**Solution:**

By the CLT for proportions: $hat(p) tilde approx N(p, p(1-p) slash n)$.

- $mu = 0.40$, $sigma^2 = 0.40 times 0.60 slash 200 = 0.0012$, $sigma = 0.0346$.
- $P(hat(p) > 0.45) = P(Z > (0.45 - 0.40) slash 0.0346) = P(Z > 1.445) approx 0.074$.

---

## Confidence Intervals and Hypothesis Testing (SI Week 3)

### E5. One-sample $t$-test

A researcher measures the reaction time of 9 subjects and finds $bar(X) = 240$ ms and $S = 30$ ms. Test whether the mean reaction time differs from 250 ms at $alpha = 0.05$.

**Solution:**

- $H_0: mu = 250$, $H_a: mu != 250$.
- $T = (240 - 250) slash (30 slash sqrt(9)) = -10 slash 10 = -1.00$.
- Critical values: $plus.minus t_{8, 0.975} = plus.minus 2.306$.
- $|T| = 1.00 < 2.306$: fail to reject.
- 95% CI: $240 plus.minus 2.306 times 10 = (216.9, 263.1)$. The interval contains 250, consistent with the test.

### E6. Paired $t$-test

Before and after blood pressure measurements for 10 patients:

Before: 140, 135, 150, 148, 155, 130, 145, 160, 138, 142

After: 132, 130, 140, 142, 145, 125, 138, 150, 130, 135

Test whether the treatment reduces blood pressure at $alpha = 0.05$.

**Solution:**

Differences (Before - After): 8, 5, 10, 6, 10, 5, 7, 10, 8, 7.

- $bar(D) = 7.6$, $S_D = 1.898$.
- $T = 7.6 slash (1.898 slash sqrt(10)) = 7.6 slash 0.600 = 12.67$.
- $t_{9, 0.975} = 2.262$.
- $T = 12.67 >> 2.262$: reject $H_0$. Strong evidence that the treatment reduces blood pressure.

---

## Regression Models (RM Week 1–2)

### E7. Computing $R^2$ from ANOVA output

A regression has $"SST" = 1000$ and $"SSE" = 350$. Find $R^2$, $"SSR"$, and interpret.

**Solution:**

- $"SSR" = "SST" - "SSE" = 1000 - 350 = 650$.
- $R^2 = "SSR" slash "SST" = 650 slash 1000 = 0.65$.
- Interpretation: 65% of the total variability in $Y$ is explained by the regression model.

### E8. Omitted variable bias calculation

The true model is $Y = 1 + 2X_1 - 3X_2 + epsilon$ with $"Cov"(X_1, X_2) = 0.8$ and $"Var"(X_1) = 4$. If you omit $X_2$, what is the bias in the estimate of $beta_1$?

**Solution:**

Bias = $beta_2 times "Cov"(X_1, X_2) slash "Var"(X_1) = (-3) times 0.8 slash 4 = -0.6$.

So $E[hat(beta)_1] = 2 + (-0.6) = 1.4$. The estimate of the effect of $X_1$ is biased downward (toward zero).

### E9. Interpreting coefficients in a multivariable model

In the model `y ~ x1 + x2`, the coefficients are $hat(beta)_0 = 10$, $hat(beta)_1 = 3$, $hat(beta)_2 = -5$. What is the predicted $Y$ when $x_1 = 4$ and $x_2 = 2$?

**Solution:**

$hat(Y) = 10 + 3(4) + (-5)(2) = 10 + 12 - 10 = 12$.

### E10. VIF calculation

If regressing $X_1$ on $X_2$ and $X_3$ yields $R^2 = 0.75$, what is the VIF for $X_1$?

**Solution:**

$"VIF" = 1 slash (1 - R^2) = 1 slash 0.25 = 4$.

The variance of $hat(beta)_1$ is 4 times what it would be if $X_1$ were uncorrelated with $X_2$ and $X_3$.

---

## Power and Resampling (SI Week 4)

### E11. Power calculation

A study plans to test whether a new drug lowers blood pressure by at least 5 mmHg compared to placebo. Known $sigma = 12$ mmHg. How many subjects per group are needed for 90% power at $alpha = 0.05$ (two-sided)?

**Solution:**

$$
n = frac(2 (z_{0.975} + z_{0.90})^2 sigma^2, delta^2) = frac(2 (1.96 + 1.28)^2 (144), 25) = frac(2 times 10.4976 times 144, 25) = frac{3023.3, 25} approx 121
$$

So 121 subjects per group are needed.

### E12. Bootstrap reasoning

You have a sample of 50 observations and want a CI for the 90th percentile. Why might the bootstrap be preferred over a normal-theory CI?

**Solution:**

- The sampling distribution of the 90th percentile is not normal, especially for non-normal populations.
- Normal-theory CIs for quantiles are unreliable for extreme quantiles.
- The bootstrap directly approximates the sampling distribution of the 90th percentile without distributional assumptions.

---

## GLMs (RM Week 3–4, later material)

### E13. Logistic regression odds ratio

A logistic regression for disease status ($Y = 1$ if diseased) gives $hat(beta)_"age" = 0.05$. Interpret the odds ratio for age.

**Solution:**

$e^{0.05} = 1.051$. For each additional year of age, the odds of disease multiply by 1.051, i.e., increase by about 5.1%.

### E14. Poisson regression rate ratio

In a Poisson regression, $hat(beta)_"treatment" = -0.40$. The exponentiated coefficient is $e^{-0.40} = 0.67$. Interpret.

**Solution:**

Compared to the control group, the treatment group has an expected count that is 0.67 times the control, i.e., a 33% reduction in the expected count. The treatment reduces the rate of events by approximately one-third.

### E15. Overdispersion check

A Poisson regression on $n = 100$ observations gives a residual deviance of 145 with 95 residual degrees of freedom. Is there evidence of overdispersion?

**Solution:**

The ratio $145 slash 95 = 1.53$. If the Poisson model is correct, this ratio should be close to 1. A ratio of 1.53 suggests moderate overdispersion. A quasi-Poisson or negative binomial model would be more appropriate.

---

## Mixed topics

### E16. Connecting the CLT to regression inference

Explain why we can perform $t$-tests and construct CIs for regression coefficients even when the errors are not normal, provided $n$ is large.

**Solution:**

The OLS estimator $hat(beta) = (X^T X)^(-1) X^T Y$ is a linear function of the data. By the CLT, $hat(beta)$ is approximately normally distributed for large $n$, even if the errors $epsilon_i$ are non-normal, as long as the errors have finite variance and are independent. The $t$-statistic $hat(beta)_j slash "SE"(hat(beta)_j)$ then approximately follows a $t$-distribution.

### E17. When does the CLT fail?

Give two situations where the CLT may not provide a good approximation.

**Solution:**

1. **Heavy-tailed distributions**: if the errors have infinite variance (e.g., Cauchy distribution), the CLT does not apply.
2. **Very small samples**: for $n < 20$ from a heavily skewed distribution, the normal approximation to $bar(X)$ may be poor.
3. **Dependent data**: the standard CLT assumes IID observations; time series or clustered data require modified versions.
