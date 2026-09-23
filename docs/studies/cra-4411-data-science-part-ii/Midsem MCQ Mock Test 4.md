---
title: "Midsem MCQ Mock Test 4"
math_syntax: typst
---

# Midsem MCQ Mock Test 4

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** R code and output behaviour  
> Use [Formula and Methods](/notes/studies-cra-4411-data-science-part-ii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material). Attempt every question before expanding its answer.

---

Here is the finished Markdown packet.

### Q1. Bias of a sample variance — ½ mark

A researcher computes the variance of a dataset of 15 observations using `var()` in R, which divides by $n-1$. They then manually compute the population variance by dividing by $n$ instead, obtaining a smaller value. Which statement correctly describes the relationship between these two quantities?

A. The R output is the Maximum Likelihood Estimate of $sigma^2$ and is always smaller.
B. The divisor-$(n-1)$ estimator is biased downward for `"Var"(X)` when the true mean is known.
C. The divisor-$n$ estimator is biased downward for `"Var"(X)` by a factor of $frac(n-1, n)$.
D. Both estimators are unbiased, but one has lower variance.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The population variance is `"Var"(X) = sigma^2`. The sample average $sum((X_i - mu)^2) / n$ has expectation $frac(n-1, n) sigma^2$, so it is biased downward by exactly that factor. Dividing by $n-1$ corrects this bias, which is why R's `var()` uses $n-1$.

- **A:** Incorrect. The MLE of $sigma^2$ divides by $n$ and is biased upward for `"Var"(X)` is not what happens; the $n$-divisor estimator is biased *downward*. Also the claim "always smaller" confuses expectation with a single realisation.
- **B:** Incorrect. The divisor-$(n-1)$ estimator is the *unbiased* one when the mean is estimated from the data. When $mu$ is known, dividing by $n$ would be unbiased instead.
- **C:** Correct. $E[n^(-1) sum (X_i - mu)^2] = frac(n-1,n) sigma^2$.
- **D:** Incorrect. The divisor-$n$ estimator is biased; they are not both unbiased.
</details>

---

### Q2. Predicted value from a fitted simple regression — ½ mark

A simple linear regression is fitted: `lm(weight ~ height, data = df)`. The output gives $hat(beta)_0 = -20.1$ and $hat(beta)_1 = 0.65$. A new individual has a height of 175 cm. What is the predicted weight?

A. $-20.1 + 0.65(175) = 93.65$
B. $0.65(175) = 113.75$
C. $-20.1 + 175 = 154.90$
D. $hat(beta)_1 = 0.65$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The simple regression prediction is $hat(y) = hat(beta)_0 + hat(beta)_1 x = -20.1 + 0.65(175) = -20.1 + 113.75 = 93.65$. R's `predict()` with this input would return 93.65.

- **A:** Correct. Direct substitution into the fitted equation.
- **B:** Incorrect. This ignores the intercept $hat(beta)_0$.
- **C:** Incorrect. This omits the slope multiplier and uses $hat(beta)_0 + x$ instead.
- **D:** Incorrect. This is just the slope, not a prediction at any $x$.
</details>

---

### Q3. Effect of removing an outlier on $R^2$ — ½ mark

A simple regression of exam score on study hours yields $R^2 = 0.72$. One observation (very high hours, very low score) is identified as a recording error and removed. After refitting, $R^2$ rises to 0.89. Which is the most likely explanation?

A. The outlier had a small residual and removing it reduces explained variance.
B. The outlier was influential and its large squared residual inflated the residual sum of squares.
C. Removing a data point always increases $R^2$ by construction.
D. The slope coefficient must have decreased in absolute value.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$R^2 = 1 - frac("RSS", "TSS")$. A point with hours far from $bar(x)$ and a very low score produces a large residual, inflating RSS. Removing it reduces RSS substantially while TSS also changes, but the net effect is a higher $R^2$. This is consistent with the point being an influential outlier.

- **A:** Incorrect. A point far from the regression line has a *large*, not small, residual.
- **B:** Correct. Large residual → large RSS → lower $R^2$; removing it raises $R^2$.
- **C:** Incorrect. Removing a point can increase or decrease $R^2$ depending on its position.
- **D:** Incorrect. Nothing guarantees the slope decreases; it could increase or change sign.
</details>

---

### Q4. Confidence interval for a regression coefficient — ½ mark

In `lm(y ~ x1 + x2, data = d)`, the coefficient for `x1` is $hat(beta)_1 = 3.4$ with standard error $"mathrm"{"se"}(hat(beta)_1) = 1.1$. The residual degrees of freedom are 46. Using a $t$-distribution with 46 df, $t_(0.025, 46) approx 2.013$. What is the 95% confidence interval for $beta_1$?

A. $(3.4 - 2.013(1.1), 3.4 + 2.013(1.1)) = (1.19, 5.61)$
B. $(3.4 - 1.96(1.1), 3.4 + 1.96(1.1)) = (1.24, 5.56)$
C. $(3.4 - 2.013(1.1), 3.4 + 2.013(1.1)) = (0.39, 6.41)$
D. $3.4 "pm" 1.1 = (2.3, 4.5)$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The 95% CI is $hat(beta)_1 "pm" t_(0.025,46) "timesmathrm"{"se"}(hat(beta)_1) = 3.4 "pm" 2.013(1.1) = 3.4 "pm" 2.2143$, giving approximately $(1.19, 5.61)$.

- **A:** Correct. Uses the $t$-quantile for 46 df and the given standard error.
- **B:** Incorrect. Uses the normal quantile $1.96$ instead of the $t$-quantile; this is an approximation that becomes accurate only for large df.
- **C:** Incorrect. The arithmetic is wrong: $3.4 - 2.21 = 1.19$, not $0.39$.
- **D:** Incorrect. This is $hat(beta)_1 "pm" "mathrm"{"se"}$, which is not a confidence interval.
</details>

---

### Q5. Effect of doubling sample size on a $z$-test — ½ mark

A one-sample $z$-test has test statistic $z = 1.82$ with $n = 50$. All else equal (same $bar(x)$, same $sigma$), if $n$ is doubled to 100, what happens to the $z$-statistic and the $p$-value?

A. $z$ stays at 1.82 because $bar(x)$ and $sigma$ are unchanged.
B. $z$ increases by a factor of $sqrt(2) approx 1.414$, so $z approx 2.57$, and the $p$-value decreases.
C. $z$ doubles to 3.64, and the $p$-value halves.
D. $z$ decreases because the standard error increases with $n$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The $z$-statistic is $z = frac(bar(x) - mu_0, sigma / sqrt(n))$. Doubling $n$ changes the denominator from $sigma / sqrt(50)$ to $sigma / sqrt(100) = sigma / sqrt(50) / sqrt(2)$. So $z$ is multiplied by $sqrt(2)$: $z_("new") = 1.82 times sqrt(2) approx 2.57$. A larger $|z|$ gives a smaller $p$-value.

- **A:** Incorrect. $z$ depends on $n$ through the standard error.
- **B:** Correct. $z$ scales by $sqrt(n)$; doubling $n$ gives a $sqrt(2)$ factor.
- **C:** Incorrect. $z$ scales by $sqrt(n)$, not linearly in $n$.
- **D:** Incorrect. Standard error *decreases* with larger $n$, so $z$ increases.
</details>

---

### Q6. R code output for `which.min` — ½ mark

Consider the R code:

```r
x <- c(4, 1, 3, 1, 5)
which.min(x)
```

What does R return?

A. `2`
B. `4`
C. `c(2, 4)`
D. `1`

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

`which.min(x)` returns the index of the *first* occurrence of the minimum value. The minimum of `x` is 1, which first appears at position 2 (1-indexed). R returns the single index `2`.

- **A:** Correct. First minimum is at index 2.
- **B:** Incorrect. Index 4 is the second occurrence of the minimum, but `which.min` returns only the first.
- **C:** Incorrect. `which.min` does not return all tied minima; `which(x == min(x))` would return `c(2, 4)`.
- **D:** Incorrect. Index 1 has value 4, not the minimum.
</details>

---

### Q7. Interpretation of the intercept in a centered regression — ½ mark

A researcher centres the predictor `income` by subtracting its mean: `income_c <- income - mean(income)`, then fits `lm(spend ~ income_c)`. The intercept estimate is $hat(beta)_0 = 4200$. Which is the correct interpretation?

A. When income is 4200, expected spending is equal to the mean income.
B. When income equals the sample mean, expected spending is approximately 4200.
C. For every one-unit increase in centred income, spending increases by 4200.
D. The intercept has no meaning when predictors are centred.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

When the predictor is centred, $x_("ci") = 0$ corresponds to the original $x_i = bar(x)$. The intercept $hat(beta)_0$ is therefore the predicted value of $y$ at the mean of the original predictor: $E[Y | X = bar(x)] approx 4200$.

- **A:** Incorrect. This swaps the roles of income and spending.
- **B:** Correct. At $x_c = 0$ (i.e. $x = bar(x)$), the predicted spend is the intercept.
- **C:** Incorrect. The *slope* $hat(beta)_1$ describes the per-unit change, not the intercept.
- **D:** Incorrect. The intercept is perfectly interpretable; it is the mean response at the mean predictor.
</details>

---

### Q8. Covariance and correlation under a linear transformation — ½ mark

Two variables $X$ and $Y$ have $"Cov"(X, Y) = 6$, $"mathrm"{"sd"}(X) = 4$, $"mathrm"{"sd"}(Y) = 3$. Define $U = 2X + 5$ and $V = -3Y$. What are $"Cov"(U, V)$ and $"mathrm"{"cor"}(U, V)$?

A. $"Cov"(U,V) = -18$, $"mathrm"{"cor"}(U,V) = -0.50$
B. $"Cov"(U,V) = -36$, $"mathrm"{"cor"}(U,V) = -1.00$
C. $"Cov"(U,V) = -36$, $"mathrm"{"cor"}(U,V) = -0.50$
D. $"Cov"(U,V) = 18$, $"mathrm"{"cor"}(U,V) = 0.50$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Under linear transformations, $"Cov"("aX"+b, "cY"+d) = "ac" "cdot""Cov"(X,Y)$. Here $a = 2$, $c = -3$, so $"Cov"(U,V) = (2)(-3)(6) = -36$. Standard deviations scale by the absolute value of the multiplier: $"mathrm"{"sd"}(U) = 2 "cdot" 4 = 8$, $"mathrm"{"sd"}(V) = 3 "cdot" 3 = 9$. Correlation is invariant to linear rescaling: $"mathrm"{"cor"}(U,V) = frac(-36, 8 times 9) = -0.50$, which matches $"mathrm"{"cor"}(X,Y) = frac(6, 4 times 3) = 0.50$ flipped in sign by the negative multiplier.

- **A:** Incorrect covariance computation: uses $"ac" = -6$ but only multiplies by 3 instead of 6.
- **B:** Incorrect. The correlation cannot be $-1$; that would require perfect linear dependence.
- **C:** Correct. Covariance scales by $"ac" = -6$ giving $-36$; correlation preserves magnitude but flips sign.
- **D:** Incorrect. Ignores the negative sign from the multiplier $-3$ on $Y$.
</details>

---

### Q9. Bootstrap confidence interval from R output — ½ mark

A bootstrap study of the median produces 5000 bootstrap replicates. The `quantile()` function in R yields:

```r
quantile(boot_medians, probs = c(0.025, 0.975))
#  2.5%   97.5%
#  12.3   18.7
```

Which statement is correct?

A. There is a 95% probability that the true population median lies in $(12.3, 18.7)$.
B. The 95% percentile bootstrap confidence interval for the median is $(12.3, 18.7)$.
C. 95% of the original data values fall between 12.3 and 18.7.
D. The standard error of the median is $18.7 - 12.3 = 6.4$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The `quantile()` output at the 2.5th and 97.5th percentiles of the bootstrap distribution gives the 95% *percentile* confidence interval: $(12.3, 18.7)$. This is a valid frequentist confidence interval constructed by the bootstrap.

- **A:** Incorrect. In frequentist statistics, the parameter is fixed; the probability statement is about the procedure, not about a specific interval.
- **B:** Correct. This is exactly what a percentile bootstrap CI reports.
- **C:** Incorrect. The bootstrap distribution of the *statistic* (median) is not the distribution of the data.
- **D:** Incorrect. The interval width $2 times "margin of error"$ is not the standard error; the SE is roughly $"width" / (2 times 1.96)$, and even that is only an approximation for bootstrap CIs.
</details>

---

### Q10. Low $p$-value but trivial effect — ½ mark

A large-sample study ($n = 5000$) of a new teaching method reports a difference in mean test scores of 0.3 points (on a 100-point scale) with a $p$-value of 0.003. Which is the most appropriate conclusion?

A. The result is highly statistically significant, so the teaching method has a large practical effect.
B. The result is statistically significant but the effect size is small, so practical significance should be considered separately.
C. The $p$-value is unreliable because the sample is too large.
D. The null hypothesis of zero difference must be rejected, confirming the method is effective in practice.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

With very large $n$, even tiny effects produce small $p$-values because the standard error $sigma / sqrt(n)$ becomes very small. A $p$-value of 0.003 indicates the difference is unlikely to be zero, but 0.3 points on a 100-point scale may have no practical educational value. Statistical significance and practical significance are distinct.

- **A:** Incorrect. Statistical significance does not imply a large or meaningful effect size.
- **B:** Correct. Small $p$ + small effect → statistically significant but practically negligible.
- **C:** Incorrect. Large samples give *more* reliable $p$-values, not less; the issue is interpretation, not reliability.
- **D:** Incorrect. Rejecting $H_0$ confirms a non-zero difference in the population, not that the method is "effective in practice."
</details>

### Q11. Confidence interval interpretation — ½ mark

A researcher uses `t.test(x, mu = 50)` in R, which outputs the 95% confidence interval as `[47.2, 52.8]`.

Which of the following is the correct interpretation of this interval?

A. There is a 95% probability that the population mean $mu$ lies between 47.2 and 52.8.
B. If we repeated this procedure many times, 95% of the constructed intervals would contain the sample mean $bar(x)$.
C. We are 95% confident that the interval from 47.2 to 52.8 captures the true population mean $mu$.
D. 95% of the individual observations in the sample fall between 47.2 and 52.8.

<details><summary>Answer and explanation</summary>
**Correct answer: C.** A confidence interval estimates the unknown fixed population parameter. "95% confident" means that the procedure used to generate the interval has a 95% long-run success rate. A is wrong because frequentist $mu$ is fixed, not random, so it does not have a probability of being in a specific interval. B is wrong because the interval is designed to capture $mu$, not $bar(x)$. D is wrong because a confidence interval for the mean does not describe the spread of individual data points.
</details>

---

### Q12. Bootstrap confidence interval — ½ mark

A researcher wants a 95% bootstrap confidence interval for the population standard deviation $sigma$. They take a sample of size $n = 40$, compute the sample standard deviation $s = 3.5$, and run 10,000 bootstrap resamples. The 2.5th and 97.5th percentiles of the bootstrap standard deviations are $2.8$ and $4.3$, respectively.

What is the 95% bootstrap confidence interval for $sigma$?

A. $[3.5 - 1.96 times frac(3.5, sqrt(40)),, 3.5 + 1.96 times frac(3.5, sqrt(40))]$
B. $[2.8,, 4.3]$
C. $[2.8 - 3.5,, 4.3 - 3.5]$
D. $[2 times 3.5 - 4.3,, 2 times 3.5 - 2.8]$

<details><summary>Answer and explanation</summary>
**Correct answer: B.** The percentile bootstrap interval directly uses the quantiles of the bootstrap distribution. A is the formula for a normal-based (z) interval for the mean, not the standard deviation. C describes a shifted interval not used here. D describes a basic bootstrap interval (using $2 hat(theta) - hat(theta)^(*)_(alpha / 2)$ and $2 hat(theta) - hat(theta)^(*)_(1 - alpha / 2)$), but the question specifies percentiles, making B the most direct and correct answer.
</details>

---

### Q13. Properties of least squares residuals — ½ mark

A linear model `fit <- lm(y ~ x)` is fitted to a dataset. Let $e_i = y_i - hat(y)_i$ be the residuals.

Which of the following properties is always guaranteed for ordinary least squares (OLS) residuals?

A. $sum_(i = 1)^n e_i^2 = 0$
B. $sum_(i = 1)^n e_i = 0$
C. $e_i tilde N (0, sigma^2)$ for all $i$
D. $sum_(i = 1)^n e_i times x_i != 0$

<details><summary>Answer and explanation</summary>
**Correct answer: B.** By definition of OLS with an intercept term, the sum of the residuals is exactly zero. A is wrong because the sum of squared residuals is minimized but only equals zero if $y_i = hat(y)_i$ for all $i$ (a perfect fit). C is wrong because while the *errors* $epsilon_i$ are assumed to be normal, the *residuals* $e_i$ are not perfectly independent or identically distributed (they have varying variances and are constrained to sum to zero). D is wrong because one of the normal equations requires $sum e_i x_i = 0$.
</details>

---

### Q14. Adjusted R-squared — ½ mark

A model `fit1 <- lm(y ~ x1 + x2, data = df)` has $R^2 = 0.82$ and adjusted $R^2 = 0.78$. A larger model `fit2 <- lm(y ~ x1 + x2 + x3 + x4, data = df)` has $R^2 = 0.84$ and adjusted $R^2 = 0.77$.

What is the most reasonable conclusion about adding `x3` and `x4` to the model?

A. The larger model is better because the ordinary $R^2$ increased.
B. The larger model is better because the adjusted $R^2$ is closer to 1.
C. The predictors `x3` and `x4` likely do not improve the model enough to justify the added complexity.
D. The predictors `x3` and `x4` are multicollinear and should be removed.

<details><summary>Answer and explanation</summary>
**Correct answer: C.** Adjusted $R^2$ penalizes the addition of unnecessary predictors. Since the adjusted $R^2$ decreased from 0.78 to 0.77, the new variables `x3` and `x4` did not contribute enough explanatory power to overcome the penalty. A is wrong because $R^2$ always increases (or stays the same) when variables are added, making it a poor metric for model comparison. B is wrong because 0.77 is smaller than 0.78. D might be true but cannot be concluded solely from $R^2$ and adjusted $R^2$.
</details>

---

### Q15. Predicting with transformed predictors — ½ mark

Consider a simple linear model `fit <- lm(y ~ x)`. We create a new predictor $z = x - bar(x)$ and fit `fit_z <- lm(y ~ z)`.

Which of the following statements about the two models is TRUE?

A. The slope estimate $hat(beta)_1$ changes, but the intercept estimate $hat(beta)_0$ remains exactly the same.
B. The slope estimate $hat(beta)_1$ remains exactly the same, but the intercept estimate $hat(beta)_0$ changes.
C. Both the slope and the intercept estimates remain exactly the same.
D. The fitted values $hat(y)_i$ will be completely different for every observation.

<details><summary>Answer and explanation</summary>
**Correct answer: B.** Centering a predictor does not change the relationship (slope) between $x$ and $y$, so $hat(beta)_1$ is identical. However, the intercept $hat(beta)_0$ changes to represent the expected value of $y$ when $z = 0$ (i.e., when $x = bar(x)$), whereas in the original model it represented the expected value of $y$ when $x = 0$. D is wrong because the fitted values (the line itself) remain identical; only the parameterization changes.
</details>

---

### Q16. F-statistic for overall significance — ½ mark

In R, `summary(lm(y ~ x1 + x2))` yields an F-statistic of $F = 12.5$ on 2 and 97 degrees of freedom, with a p-value of $0.00003$.

What does this specific F-test evaluate?

A. It tests whether the coefficient for `x1` is statistically significant.
B. It tests whether the coefficient for `x2` is statistically significant.
C. It tests whether at least one of the predictors (`x1` or `x2`) has a non-zero coefficient.
D. It tests whether both $beta_1 != 0$ and $beta_2 != 0$ simultaneously.

<details><summary>Answer and explanation</summary>
**Correct answer: C.** The overall F-test in a multiple regression tests the null hypothesis $H_0: beta_1 = beta_2 = 0$ against the alternative that *at least one* $beta_j != 0$. A and B describe individual t-tests for each coefficient. D is too strong; the alternative hypothesis is not that *all* coefficients are non-zero, just that at least one of them is.
</details>

---

### Q17. Covariance from sample moments — ½ mark

Given two variables $X$ and $Y$ with sample means $bar(x) = 10$ and $bar(y) = 20$, sample standard deviations $s_x = 3$ and $s_y = 5$, and sample correlation $r = 0.6$.

What is the sample covariance $"Cov"(X, Y)$?

A. $0.6$
B. $9.0$
C. $30.0$
D. $6.0$

<details><summary>Answer and explanation</summary>
**Correct answer: B.** The relationship between correlation, covariance, and standard deviations is $r = frac("Cov"(X, Y), s_x s_y)$. Rearranging gives $"Cov"(X, Y) = r times s_x times s_y = 0.6 times 3 times 5 = 9.0$. The means $bar(x)$ and $bar(y)$ are not needed for this calculation.
</details>

---

### Q18. Permutation test statistic — ½ mark

A researcher wants to test if the means of two groups (A and B) are different using a permutation test. The observed difference in sample means is $bar(x)_A - bar(x)_B = 4.2$. The researcher writes an R function:

```r
perm_test <- function(A, B, n_perm = 10000) {
  combined <- c(A, B)
  n_A <- length(A)
  diffs <- replicate(n_perm, {
    shuffled <- sample(combined)
    mean(shuffled[1:n_A]) - mean(shuffled[(n_A + 1):length(combined)])
  })
  mean(abs(diffs) >= abs(4.2))
}
```

What does the output of `perm_test(groupA, groupB)` represent?

A. The 95% confidence interval for the difference in means.
B. The probability that the true means are equal under the alternative hypothesis.
C. The empirical p-value for a two-sided test of equal distributions.
D. The estimated standard error of the difference in means.

<details><summary>Answer and explanation</summary>
**Correct answer: C.** The function shuffles the group labels, computes the test statistic (difference in means) for each permutation, and calculates the proportion of permuted statistics as extreme or more extreme than the observed statistic (in absolute value). This proportion is the empirical p-value for a two-sided test. A is wrong because it produces a single probability, not an interval. B is conceptually incorrect (the null assumes equal means, not the alternative). D is wrong because it calculates a tail probability, not a standard error.
</details>

---

### Q19. Standard error of the slope — ½ mark

In a simple linear regression `lm(y ~ x)`, the standard error of the slope estimate $hat(beta)_1$ is given by:

$"SE"(hat(beta)_1) = frac(s_e, sqrt(sum (x_i - bar(x))^2))$

where $s_e$ is the residual standard error. Which of the following changes would *decrease* $"SE"(hat(beta)_1)$?

A. Decreasing the sample size $n$.
B. Decreasing the variance of the predictor $x$.
C. Increasing the residual standard error $s_e$.
D. Increasing the variance of the predictor $x$.

<details><summary>Answer and explanation</summary>
**Correct answer: D.** The denominator $sqrt(sum (x_i - bar(x))^2)$ represents the total variation in $x$. Increasing the variance of $x$ increases this denominator, which decreases the overall fraction (the standard error). A is wrong because decreasing $n$ generally increases SE. B is wrong because decreasing the variance of $x$ decreases the denominator, which increases the SE. C is wrong because increasing the numerator $s_e$ increases the SE.
</details>

---

### Q20. Central Limit Theorem application — ½ mark

A population of individual incomes has a highly right-skewed distribution with mean $mu = 50$ (in thousands) and standard deviation $sigma = 20$. A researcher takes a random sample of $n = 100$ individuals and calculates the sample mean $bar(x)$.

According to the Central Limit Theorem, what is the approximate distribution of $bar(x)$?

A. Skewed right, with mean 50 and standard deviation 20.
B. Approximately Normal, with mean 50 and standard deviation 20.
C. Approximately Normal, with mean 50 and standard deviation 2.
D. Approximately Normal, with mean 5000 and standard deviation 200.

<details><summary>Answer and explanation</summary>
**Correct answer: C.** By the CLT, the sampling distribution of the sample mean $bar(x)$ is approximately Normal for large $n$ (here $n = 100 "gt".eq 30$). The mean of this distribution is $E(bar(x)) = mu = 50$. The standard deviation (standard error) is $"SE"(bar(x)) = frac(sigma, sqrt(n)) = frac(20, sqrt(100)) = 2$. A is wrong because the sampling distribution of the mean is Normal, not skewed. B is wrong because the standard deviation of $bar(x)$ is $frac(sigma, sqrt(n))$, not $sigma$. D confuses the sum with the mean.
</details>

### Q21. Bias in the sample variance — ½ mark

Let $Y_1, "dots".h, Y_n$ be iid with true variance $sigma^2$. The R function `var(Y)` computes $S^2 = frac(1, n-1) sum_(i=1)^(n) (Y_i - bar(Y))^2$. An analyst instead uses $tilde(S)^2 = frac(1, n) sum_(i=1)^(n) (Y_i - bar(Y))^2$ (i.e. `sum((Y - mean(Y))^2) / n` in R). Which statement is correct?

A. $E(tilde(S)^2) = sigma^2$, so both estimators are unbiased.
B. $E(tilde(S)^2) = frac(n-1, n) sigma^2$, so $tilde(S)^2$ is biased but consistent.
C. $E(S^2) = frac(n-1, n) sigma^2$, so $S^2$ underestimates $sigma^2$.
D. $E(tilde(S)^2) = sigma^2$ for normal data only; otherwise it is biased.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** The standard result gives $E(S^2) = sigma^2$ (unbiased) while $E(tilde(S)^2) = frac(n-1, n) sigma^2$, which is biased downward. As $n "to" "infty"$ the bias vanishes, so $tilde(S)^2$ is consistent. In R, `mean((Y - mean(Y))^2)` gives $tilde(S)^2$ while `var(Y)` gives $S^2$. For $n = 20$ the bias factor is $19/20 = 0.95$.

A is wrong because $tilde(S)^2$ is biased for every finite $n$. C is wrong because $S^2$ with the $frac(1, n-1)$ divisor is exactly unbiased regardless of distribution. D is wrong because $E(tilde(S)^2) = frac(n-1, n) sigma^2$ holds for any distribution with finite variance, not only the normal.

</details>

### Q22. Prior-to-posterior update for a normal mean — ½ mark

Suppose $Y_1, "dots".h, Y_(25)$ are iid $N(mu, 4)$ with known $sigma^2 = 4$. The sample mean is $bar(Y) = 12$. You place a $N(10, 1)$ prior on $mu$. What is the posterior distribution of $mu$ and its posterior mean?

A. $N(11.72, 0.14)$ with posterior mean $11.72$
B. $N(11.76, 0.16)$ with posterior mean $11.76$
C. $N(11.60, 0.16)$ with posterior mean $11.60$
D. $N(11.72, 0.04)$ with posterior mean $11.72$

<details><summary>Answer and explanation</summary>

**Correct answer: A.** With a $N(mu_0, tau_0^2)$ prior and known $sigma^2$, the posterior is $N(mu_n, tau_n^2)$ where $1/tau_n^2 = 1/tau_0^2 + n/sigma^2$ and $mu_n = tau_n^2(mu_0/tau_0^2 + n bar(Y)/sigma^2)$. Here $tau_0^2 = 1$, $sigma^2 = 4$, $n = 25$, so $1/tau_n^2 = 1 + 25/4 = 7.25$, giving $tau_n^2 = 4/29 approx 0.14$ and $mu_n = frac(4, 29)(10 + 75) = 340/29 approx 11.72$. Alternatively, the posterior mean is a precision-weighted average: $mu_n = frac(6.25, 7.25)(12) + frac(1, 7.25)(10) approx 11.72$.

A is correct on both the posterior mean and variance. B has an incorrect mean ($11.76$ instead of $11.72$) and uses $0.16 = sigma^2/n$, the sampling variance of $bar(Y)$, not the posterior variance. C corresponds to roughly equal weighting of prior and data, which is incorrect here since $n/sigma^2 = 6.25$ greatly exceeds $1/tau_0^2 = 1$. D has the correct mean but the wrong variance ($0.04$ would correspond to $tau_0^2/n$, not the posterior precision $7.25$).

</details>

### Q23. Confidence interval width and sample size — ½ mark

A 95% confidence interval for $mu$ based on 49 observations from a population with known $sigma = 7$ is $bar(Y) plus.minus 1.96 times frac(7, sqrt(49))$. The researcher wants the half-width to be at most $1.0$. What is the minimum sample size required?

A. $n = 97$
B. $n = 189$
C. $n = 196$
D. $n = 138$

<details><summary>Answer and explanation</summary>

**Correct answer: B.** We need $1.96 times frac(7, sqrt(n)) <= 1.0$, so $sqrt(n) >= 1.96 times 7 = 13.72$, giving $n >= 13.72^2 = 188.24$. Since $n$ must be an integer, we round up to $n = 189$.

A: $n = 97$ gives half-width $1.96 times 7/sqrt(97) approx 1.39 > 1.0$. C: $n = 196$ gives half-width $1.96 times 7/14 = 0.98 <= 1.0$, but this is not the minimum. D: $n = 138$ gives half-width $1.96 times 7/sqrt(138) approx 1.17 > 1.0$.

</details>

### Q24. Interpreting correlation — ½ mark

In R, `cor(x, y)` returns $-0.85$ for two variables $X$ and $Y$ with $n = 30$. A colleague concludes: "If we increase $X$ by one unit, $Y$ decreases by $0.85$ units." Which response is most accurate?

A. The interpretation is correct; correlation equals the slope.
B. The interpretation is wrong because correlation is unitless and does not specify the slope; the slope depends on $s_Y / s_X$.
C. The interpretation is wrong because $r = -0.85$ is not statistically significant at $n = 30$.
D. The interpretation is wrong because correlation can never be negative.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** Correlation $r$ is unitless and measures the strength and direction of linear association. The slope in a simple regression is $hat(beta)_1 = r times s_Y / s_X$, which depends on the ratio of standard deviations. Without knowing $s_X$ and $s_Y$, we cannot deduce the slope from $r$ alone. A 1-unit increase in $X$ does not correspond to an $r$-unit change in $Y$.

A is wrong because $r$ is not the slope; they differ by the factor $s_Y/s_X$. C is wrong because $r = -0.85$ with $n = 30$ is highly significant ($t = r sqrt((n-2)/(1-r^2)) approx -8.5$, with $p approx 0$). D is wrong because correlations range from $-1$ to $+1$.

</details>

### Q25. Type I error and p-value definition — ½ mark

A hypothesis test rejects $H_0$ when $p <= alpha$. The $p$-value of an observed test statistic is $p = 0.032$. Which statement is correct?

A. The probability that $H_0$ is true is $0.032$.
B. If $H_0$ is true, the probability of observing a test statistic as extreme or more extreme is $0.032$.
C. The probability of a Type I error is $0.032$ regardless of $alpha$.
D. Rejecting $H_0$ at $alpha = 0.05$ means there is a 97% chance the alternative is true.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** By definition, the $p$-value is the probability, computed under $H_0$, of obtaining a test statistic at least as extreme as the observed value. This is exactly option B.

A confuses the $p$-value with $P(H_0 | "data")$, which would require a prior distribution (a Bayesian quantity). C is wrong because the Type I error probability is $alpha$, the pre-set threshold chosen before the test, not the observed $p$-value. D is wrong because the $p$-value is not $P(H_1 | "data")$; a $p$-value of $0.032$ does not quantify the posterior probability that the alternative is true.

</details>

### Q26. t-test output interpretation in R — ½ mark

An R session produces:

```text
t.test(x, mu = 50, alternative = "two.sided")

	One Sample t-test

data:  x
t = 2.45, df = 24, p-value = 0.0217
alternative hypothesis: true mean is not equal to 50
95 percent confidence interval:
 50.32  55.68
sample estimates:
mean of x 
    53.00 
```

Which conclusion is best?

A. We fail to reject $H_0: mu = 50$ at $alpha = 0.01$ since $p = 0.0217 > 0.01$.
B. We reject $H_0: mu = 50$ at $alpha = 0.05$ since $p = 0.0217 < 0.05$ and the CI excludes 50.
C. The test statistic should be $z$, not $t$, because $n = 25$ is large enough.
D. The 95% CI is $(50.32, 55.68)$, so we cannot conclude $mu != 50$.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** The $p$-value $0.0217 < 0.05$, so we reject $H_0$ at the 5% level. The 95% CI $(50.32, 55.68)$ does not contain $50$, consistent with rejection. Both pieces of evidence agree.

A is factually correct about the comparison at $alpha = 0.01$, but it is not the best conclusion — at the standard $alpha = 0.05$ level, the test clearly rejects, and the CI confirms this. C is wrong: when $sigma$ is unknown, the $t$-test is appropriate regardless of sample size. D is wrong because the CI excludes $50$, so we *can* conclude $mu != 50$ at the 5% level.

</details>

### Q27. Residual sums of squares decomposition — ½ mark

In simple linear regression, the total sum of squares decomposes as $SS_("tot") = SS_("reg") + SS_("res")$. A fitted model has $SS_("reg") = 800$ and $SS_("res") = 200$, with a positive estimated slope. What is the coefficient of determination $R^2$ and the correlation $r$ between $X$ and $Y$?

A. $R^2 = 0.80$, $r = 0.894$
B. $R^2 = 0.20$, $r = 0.447$
C. $R^2 = 0.80$, $r = -0.894$
D. $R^2 = 0.80$, $r = 0.80$

<details><summary>Answer and explanation</summary>

**Correct answer: A.** We have $SS_("tot") = 800 + 200 = 1000$, so $R^2 = SS_("reg")/SS_("tot") = 800/1000 = 0.80$. In simple linear regression, $R^2 = r^2$, so $|r| = sqrt(0.80) = 0.894$. Since the estimated slope is positive, $r = +0.894$.

A is correct. B incorrectly computes $R^2 = SS_("res")/SS_("tot") = 0.20$ instead of $SS_("reg")/SS_("tot")$. C has the correct magnitude for $r$ but the wrong sign, contradicting the stated positive slope. D confuses $R^2$ with $r$; although both equal $0.80$ and $0.894$ respectively, $r = sqrt(R^2) != R^2$.

</details>

### Q28. Predicted value from a fitted regression — ½ mark

The R output `summary(lm(y ~ x))` gives $hat(y) = 3.5 + 2.1 x$. A new observation has $x_0 = 4$. What is $hat(y)(x_0)$ and what is the residual if the observed $y_0 = 12$?

A. $hat(y) = 11.9$, residual $= 0.1$
B. $hat(y) = 12.5$, residual $= -0.5$
C. $hat(y) = 11.9$, residual $= -0.1$
D. $hat(y) = 8.4$, residual $= 3.6$

<details><summary>Answer and explanation</summary>

**Correct answer: A.** Substituting: $hat(y) = 3.5 + 2.1(4) = 3.5 + 8.4 = 11.9$. The residual is $e = y_0 - hat(y) = 12 - 11.9 = 0.1$.

A is correct. B has an arithmetic error; $hat(y) = 12.5$ does not follow from the given equation. C has the correct prediction but the wrong sign on the residual. D computes only the slope contribution $2.1 times 4 = 8.4$ and forgets the intercept.

</details>

### Q29. Comparison of t-test and z-test for the mean — ½ mark

A random sample of $n = 16$ from a normal population gives $bar(Y) = 104$ and $s = 8$ (sample standard deviation). Under $H_0: mu = 100$, the two-sided $t$-test statistic is $t = 2.00$ with $"df" = 15$. If the population variance were known to be $sigma^2 = 64$, what would the $z$-test statistic be, and how would the $p$-values compare?

A. $z = 1.00$; the $z$-test has a smaller $p$-value.
B. $z = 2.00$; the $z$-test has a smaller $p$-value than the $t$-test.
C. $z = 2.00$; the $z$-test and $t$-test have the same $p$-value.
D. $z = 8.00$; the $z$-test has a larger $p$-value.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** When $sigma$ is known, $z = frac(bar(Y) - mu_0, sigma/sqrt(n)) = frac(104 - 100, 8/sqrt(16)) = frac(4, 2) = 2.00$, same as the $t$-statistic. However, the $z$-test references $N(0,1)$ while the $t$-test references $t_(15)$. Since $t_(15)$ has heavier tails than $N(0,1)$, the same statistic yields a larger $p$-value under the $t$-distribution. Specifically, $P(|Z| > 2) approx 0.046$ while $P(|t_(15)| > 2) approx 0.063$, so the $z$-test has the smaller $p$-value.

A is wrong: $z = 2.00$, not $1.00$. C is wrong: the $t_(15)$ and $N(0,1)$ distributions differ, so identical statistics produce different $p$-values. D is wrong: $z = 2$, not $8$.

</details>

### Q30. Bootstrap logic — ½ mark

You have a sample of $n = 50$ observations and compute the median. You then perform a nonparametric bootstrap with $B = 1000$ resamples to estimate the standard error of the median. Which statement about the bootstrap is correct?

A. Each bootstrap resample is drawn without replacement from the original sample.
B. The bootstrap standard error is the standard deviation of the 1000 bootstrap medians.
C. The bootstrap requires the population to be normally distributed.
D. The bootstrap resamples must each have a different size $n$ from the original sample.

<details><summary>Answer and explanation</summary>

**Correct answer: B.** In a nonparametric bootstrap, each of the $B$ resamples is drawn *with* replacement from the original sample, each of size $n$. The bootstrap estimate of the standard error is the sample standard deviation of the $B$ bootstrap statistics (here, medians).

A is wrong: bootstrap resamples are drawn *with* replacement, not without. C is wrong: the bootstrap is nonparametric and makes no distributional assumption about the population. D is wrong: each bootstrap resample must have the same size $n$ as the original sample.

</details>
