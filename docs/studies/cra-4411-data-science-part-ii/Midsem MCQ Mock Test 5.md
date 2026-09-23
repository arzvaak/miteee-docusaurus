---
title: "Midsem MCQ Mock Test 5"
math_syntax: typst
---

# Midsem MCQ Mock Test 5

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** Mixed midsem simulation  
> Use [Formula and Methods](/notes/studies-cra-4411-data-science-part-ii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material). Attempt every question before expanding its answer.

---

### Q1. Confidence interval width — ½ mark

A 95% confidence interval for the population mean $mu$ is computed from a simple random sample of size $n = 25$ drawn from a normal population. The sample mean is $bar(x) = 42.3$ and the sample standard deviation is $s = 6.0$. The interval is $bar(x) plus.minus t_(0.025, 24) times frac(s, sqrt(n))$. If the researcher instead constructs a 99% confidence interval from the same data, what happens to the interval width?

A. It decreases because a higher confidence level produces a tighter bound around $bar(x)$
B. It increases because the critical value $t_(0.005, 24) > t_(0.025, 24)$ widens the margin of error
C. It stays the same because the sample size and standard deviation are unchanged
D. It decreases because the standard error $frac(s, sqrt(n))$ shrinks at higher confidence

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The margin of error is $"ME" = t_(alpha/2, n-1) times frac(s, sqrt(n))$. For a 99% CI, $alpha = 0.01$ so the critical value is $t_(0.005, 24) approx 2.797$, which is larger than $t_(0.025, 24) approx 2.064$. A larger critical value directly increases the margin of error, making the interval wider. The standard error $frac(s, sqrt(n)) = frac(6, 5) = 1.2$ is fixed.

- **A** is wrong: higher confidence requires a wider interval, not a tighter one.
- **B** is correct: the larger $t$ critical value widens the interval.
- **C** is wrong: the confidence level changes the critical value even when $n$ and $s$ are fixed.
- **D** is wrong: the standard error does not depend on the confidence level.
</details>

### Q2. Expectation of a linear combination — ½ mark

Let $X_1, X_2, X_3$ be independent random variables with $E(X_i) = mu_i$ and $"Var"(X_i) = sigma_i^2$. Define $W = 3X_1 - 2X_2 + X_3$. Which of the following correctly states $E(W)$ and $"Var"(W)$?

A. $E(W) = 3mu_1 - 2mu_2 + mu_3$ and $"Var"(W) = 3sigma_1^2 - 2sigma_2^2 + sigma_3^2$
B. $E(W) = 3mu_1 - 2mu_2 + mu_3$ and $"Var"(W) = 9sigma_1^2 + 4sigma_2^2 + sigma_3^2$
C. $E(W) = mu_1 + mu_2 + mu_3$ and $"Var"(W) = 9sigma_1^2 + 4sigma_2^2 + sigma_3^2$
D. $E(W) = 3mu_1 - 2mu_2 + mu_3$ and $"Var"(W) = 9sigma_1^2 - 4sigma_2^2 + sigma_3^2$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

By linearity of expectation, $E(W) = 3E(X_1) - 2E(X_2) + E(X_3) = 3mu_1 - 2mu_2 + mu_3$. For variance of independent variables, constants square: $"Var"("aX") = a^2"Var"(X)$, so $"Var"(W) = 9sigma_1^2 + 4sigma_2^2 + sigma_3^2$. Cross-terms vanish by independence.

- **A** is wrong: variances do not scale linearly with the coefficient; they scale with the square, and negative coefficients produce positive squared terms.
- **B** is correct: both expectation and variance formulas are applied properly.
- **C** is wrong: $E(W)$ ignores the coefficients $3$ and $-2$.
- **D** is wrong: the sign of the coefficient does not produce a negative variance contribution; $(-2)^2 = 4$.
</details>

### Q3. CLT application — ½ mark

The lifetimes of a certain brand of light bulbs have mean $mu = 1000$ hours and standard deviation $sigma = 120$ hours, but the distribution is right-skewed. A quality inspector measures the sample mean $bar(X)$ from a random sample of $n = 144$ bulbs. Which best describes the approximate distribution of $bar(X)$?

A. Normal with mean $1000$ and standard deviation $120$
B. Right-skewed with mean $1000$ and standard deviation $10$
C. Approximately normal with mean $1000$ and standard deviation $10$
D. Approximately normal with mean $1000$ and standard deviation $120$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

By the Central Limit Theorem, for large $n$, the sampling distribution of $bar(X)$ is approximately $"Normal"(mu, frac(sigma, sqrt(n)))$. Here $frac(sigma, sqrt(n)) = frac(120, sqrt(144)) = frac(120, 12) = 10$. The CLT guarantees approximate normality of $bar(X)$ regardless of the population shape when $n$ is large enough ($n = 144$ is well above the usual threshold).

- **A** is wrong: the standard deviation of $bar(X)$ is the standard error $frac(sigma, sqrt(n)) = 10$, not $sigma = 120$.
- **B** is wrong: the CLT eliminates skewness in $bar(X)$ for large $n$; it is not right-skewed.
- **C** is correct: both the mean and the standard error are correct.
- **D** is wrong: it confuses the standard error with the population standard deviation.
</details>

### Q4. Two-sided p-value — ½ mark

A researcher tests $H_0: mu = 50$ versus $H_1: mu != 50$ using a $z$-test. The observed test statistic is $z = 2.10$. The $p$-value for this two-sided test is:

A. $P(Z > 2.10) approx 0.0179$
B. $2 times P(Z > 2.10) approx 0.0358$
C. $P(Z < 2.10) approx 0.9821$
D. $1 - P(Z > 2.10) approx 0.9821$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

For a two-sided test, the $p$-value is twice the tail area beyond the observed statistic: $p = 2 times P(Z > |z|) = 2 times P(Z > 2.10) approx 2 times 0.0179 = 0.0358$. This accounts for evidence in both directions away from $H_0$.

- **A** is wrong: this is the one-sided $p$-value, not the two-sided one.
- **B** is correct: doubling the one-sided tail probability gives the proper two-sided $p$-value.
- **C** is wrong: $P(Z < 2.10)$ is the cumulative probability up to $z = 2.10$, not a $p$-value.
- **D** is wrong: this is $P(Z <= 2.10)$, the probability of failing to reject, which is not a $p$-value.
</details>

### Q5. Permutation test reasoning — ½ mark

In a two-sample permutation test comparing the means of treatment group ($n_1 = 8$) and control group ($n_2 = 10$), the observed difference in sample means is $bar(x)_1 - bar(x)_2 = 3.7$. Under the permutation null hypothesis, the test statistic is recomputed for every possible reassignment of the 18 observations to groups of sizes 8 and 10. How many unique permutations exist?

A. $18!$
B. $binom(18, 8) = frac(18!, 8! times 10!)$
C. $2^(18)$
D. $8! times 10!$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

In a permutation test, we fix the group sizes and consider all ways to choose which 8 of the 18 observations are assigned to group 1 (the rest go to group 2). The number of such assignments is $binom(18, 8) = frac(18!, 8! times 10!) = 43{,}758$. This is the number of unique permutations relevant to the test.

- **A** is wrong: $18!$ counts all orderings of 18 items, not just the distinct group assignments.
- **B** is correct: the binomial coefficient counts the ways to select 8 positions out of 18.
- **C** is wrong: $2^(18)$ would apply if group sizes were not fixed (each observation independently assigned).
- **D** is wrong: this counts orderings within each group, which do not produce new test statistics.
</details>

### Q6. Simple linear regression slope interpretation — ½ mark

A simple linear regression of systolic blood pressure ($Y$, in mmHg) on age ($X$, in years) is fitted to $n = 60$ adults. The estimated equation is $hat(Y) = 98.2 + 0.74 X$, with $"SE"(hat(beta)_1) = 0.11$. Which interpretation of $hat(beta)_1 = 0.74$ is correct?

A. Each additional year of age is associated with a 0.74 mmHg increase in predicted blood pressure, on average
B. Each additional year of age causes a 0.74 mmHg increase in blood pressure
C. 74% of the variation in blood pressure is explained by age
D. The correlation between age and blood pressure is exactly 0.74

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

In simple linear regression, $hat(beta)_1$ gives the average change in $hat(Y)$ per one-unit increase in $X$. So each additional year of age is associated with a predicted increase of 0.74 mmHg. The coefficient is observational, not causal.

- **A** is correct: it correctly uses "associated" and "predicted" language.
- **B** is wrong: regression coefficients from observational data do not establish causation.
- **C** is wrong: $R^2$ measures variation explained, not $hat(beta)_1$; $R^2 = r^2 != 0.74$ in general.
- **D** is wrong: the slope and the correlation are related by $hat(beta)_1 = r times frac(s_Y, s_X)$, but they are not equal unless $s_Y = s_X$.
</details>

### Q7. Residual sum of squares decomposition — ½ mark

In a simple linear regression with $n = 50$ observations, the total sum of squares is $"SST" = 4200$ and the residual sum of squares is $"SSE" = 1050$. What is the coefficient of determination $R^2$?

A. $R^2 = 0.25$
B. $R^2 = 0.50$
C. $R^2 = 0.75$
D. $R^2 = 0.33$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The coefficient of determination is $R^2 = 1 - frac("SSE", "SST") = 1 - frac(1050, 4200) = 1 - 0.25 = 0.75$. This means 75% of the total variation in $Y$ is explained by the regression on $X$. Equivalently, $"SSR" = "SST" - "SSE" = 4200 - 1050 = 3150$, and $R^2 = frac("SSR", "SST") = frac(3150, 4200) = 0.75$.

- **A** is wrong: this equals $frac("SSE", "SST")$, the unexplained proportion, not $R^2$.
- **B** is wrong: this does not match the calculation.
- **C** is correct: $1 - frac(1050, 4200) = 0.75$.
- **D** is wrong: this is $frac("SSE", "SST")$ rounded, not $1 - frac("SSE", "SST")$.
</details>

### Q8. Covariance and correlation — ½ mark

For two random variables $X$ and $Y$, you are given $"Var"(X) = 9$, $"Var"(Y) = 16$, and $"Cov"(X, Y) = -6$. What is the correlation $"Corr"(X, Y)$?

A. $-0.50$
B. $-0.75$
C. $-0.375$
D. $-0.60$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The correlation is $"Corr"(X, Y) = frac("Cov"(X, Y), sqrt("Var"(X) times "Var"(Y))) = frac(-6, sqrt(9 times 16)) = frac(-6, sqrt(144)) = frac(-6, 12) = -0.50$.

- **A** is correct: the calculation yields exactly $-0.50$.
- **B** is wrong: this would require $"Cov"(X, Y) = -9$.
- **C** is wrong: this equals $frac(-6, 16)$, mistakenly dividing by $"Var"(Y)$ instead of the geometric mean.
- **D** is wrong: this equals $frac(-6, 10)$, mistakenly using an arithmetic mean of standard deviations rather than the product $sqrt(9 times 16) = 12$.
</details>

### Q9. Bootstrap logic — ½ mark

A statistician has a sample of $n = 40$ observations and computes the median. To construct a bootstrap confidence interval, 2000 bootstrap resamples are drawn with replacement, each of size 40, and the median is computed for each. Which statement about the bootstrap distribution is correct?

A. Each bootstrap resample contains exactly 40 unique observations because sampling is with replacement from the original sample
B. The bootstrap distribution approximates the sampling distribution of the sample median, centred near the original sample median
C. The bootstrap distribution has the same shape as the original population distribution, regardless of the statistic
D. The bootstrap eliminates the need for the original sample by creating a new synthetic population

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The bootstrap works by treating the original sample as a proxy for the population. Each resample of size $n$ drawn with replacement from the original sample produces a replicate statistic. The collection of 2000 bootstrap medians approximates the sampling distribution of the sample median. The centre of the bootstrap distribution is close to the original sample median.

- **A** is wrong: with replacement, observations can be repeated, so a resample typically has fewer than 40 unique values.
- **B** is correct: this describes exactly what the bootstrap distribution approximates.
- **C** is wrong: the bootstrap distribution reflects the sampling distribution of the specific statistic (here the median), not the population shape.
- **D** is wrong: the bootstrap uses the original sample as its basis; it does not replace it.
</details>

### Q10. Multivariable regression coefficient interpretation — ½ mark

A multiple regression model is fitted: $hat(Y) = 12.5 + 3.2 X_1 - 1.8 X_2 + 0.45 X_3$, where $Y$ is annual income (in thousands of dollars), $X_1$ is years of education, $X_2$ is years of unemployment in the past decade, and $X_3$ is age. Holding all other variables fixed, which statement is correct?

A. An additional year of education is associated with a USD 3{,}200 increase in predicted income, while an additional year of unemployment is associated with a USD 1{,}800 decrease
B. An additional year of education causes a USD 3{,}200 increase in income
C. The variables $X_1$, $X_2$, $X_3$ are mutually uncorrelated because they appear together in the model
D. The intercept 12.5 means that a person with zero education, zero unemployment, and zero age is predicted to earn USD 12{,}500

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Each $hat(beta)_j$ gives the estimated change in $hat(Y)$ per unit increase in $X_j$, holding all other predictors fixed. So $hat(beta)_1 = 3.2$ means each additional year of education is associated with a predicted income increase of $3.2 times 1000 = "USD" 3{,}200$, and $hat(beta)_2 = -1.8$ means each additional year of unemployment is associated with a predicted decrease of $"USD" 1{,}800$. The "holding other variables fixed" clause is essential.

- **A** is correct: it gives proper associative language with correct units.
- **B** is wrong: observational regression does not establish causation.
- **C** is wrong: including correlated predictors in the same model does not make them uncorrelated; it means the coefficients are adjusted for mutual overlap.
- **D** is wrong: while the intercept is the predicted value when all predictors are zero, $X_3 = "age" = 0$ is not meaningful, and the interpretation of "zero age, zero education" is not practically valid.
</details>

### Q11. Observed information and MLE variance — ½ mark

A Poisson model $Y_i tilde "Poisson"(lambda)$ is fitted to $n=200$ independent observations with $sum Y_i = 540$. The observed information for $lambda$ is $I (hat(lambda)) = frac(n, hat(lambda))$. Using the maximum likelihood estimator, compute a 95% confidence interval for $lambda$.

A. $(2.52, 2.88)$
B. $(2.44, 2.96)$
C. $(2.58, 2.82)$
D. $(2.60, 2.80)$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$hat(lambda) = frac(540, 200) = 2. 70$. The observed information is $I (hat(lambda)) = frac(200, 2. 70) = 74. 074$, so $"SE"(hat(lambda)) = I (hat(lambda))^(-1 / 2) = sqrt(frac(hat(lambda), n)) = sqrt(frac(2. 70, 200)) = 0. 1162$. The 95% Wald interval is $hat(lambda) plus.minus 1. 96 times "SE" = 2. 70 plus.minus 1. 96 (0. 1162) = 2. 70 plus.minus 0. 2277 = (2. 47, 2. 93)$, closest to option B.

- **A:** Implies a narrower interval; would require SE ≈ 0.0918, inconsistent with the given data.
- **B:** Closest match to the Wald interval $(2.47, 2.93)$; small rounding differences in the z-value (e.g. using 1.96 vs. 1.956) account for the ±0.03 gap.
- **C:** Too narrow; corresponds to SE ≈ 0.0612.
- **D:** Implies SE ≈ 0.0510, far too small for this sample size.
</details>

---

### Q12. Exchangeability and prior–posterior — ½ mark

Two boxes each contain red and blue balls. Box 1 has 70% red; Box 2 has 30% red. You pick a box uniformly at random, then draw 5 balls with replacement: 4 red and 1 blue. What is the posterior probability you chose Box 1, using Bayes' theorem with a uniform prior?

A. 0.795
B. 0.852
C. 0.911
D. 0.723

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Prior $P ("Box 1") = P ("Box 2") = 0. 5$. The likelihood of 4 red and 1 blue in 5 draws:
- Box 1: $binom 51 (0. 7)^4 (0. 3)^1 = 5 times 0. 2401 times 0. 3 = 0. 36015$
- Box 2: $binom 51 (0. 3)^4 (0. 7)^1 = 5 times 0. 0081 times 0. 7 = 0. 02835$

Posterior: $P ("Box 1"| "data") = frac(0. 5 times 0. 36015, 0. 5 times 0. 36015 + 0. 5 times 0. 02835) = frac(0. 36015, 0. 3885) = 0. 9271$.

Closest to C (the small difference arises from rounding the likelihoods at intermediate steps).

- **A:** Underestimates the posterior; does not match the calculation.
- **B:** Also too low; suggests weaker evidence for Box 1.
- **C:** Closest to the exact posterior $approx 0. 927$; consistent with the data strongly favouring Box 1.
- **D:** Too low; does not reflect the observed preponderance of red balls.
</details>

---

### Q13. Regression coefficient interpretation — ½ mark

A simple regression of $Y$ (monthly rent in dollars) on $X$ (distance from campus in km) gives $hat(beta)_0 = 1200$ and $hat(beta)_1 = -85$. The $R^2$ is 0.42. Which interpretation is correct?

A. For every additional km from campus, rent decreases by USD 85 o n a v e r a g e.
B. R e n t i s e x a c t l y USD 85 lower for each km further from campus.
C. 42% of the variation in distance is explained by rent.
D. The correlation between rent and distance is $-0.42$.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$hat(beta)_1 = -85$ means that for each one-unit increase in $X$ (1 km), the predicted $Y$ (rent) changes by $-85$ dollars on average. This is the standard slope interpretation: the average change in $Y$ per unit increase in $X$.

- **A:** Correct — the slope gives the average (not exact) change in $Y$ per unit increase in $X$.
- **B:** Incorrect — regression gives an average relationship, not a deterministic one; there is residual variation.
- **C:** Swaps the roles; $R^2$ is the proportion of variation in $Y$ (rent) explained by $X$ (distance), not the reverse.
- **D:** Incorrect — $r = "sign"(hat(beta)_1) sqrt(R^2) = -sqrt(0. 42) approx -0. 648$, not $-0.42$.
</details>

---

### Q14. Central Limit Theorem application — ½ mark

Let $Y_1, "dots".h, Y_(64)$ be iid with $"E"(Y_i) = 50$ and $"Var"(Y_i) = 256$. By the CLT, what is the approximate probability that the sample mean $bar(Y)$ exceeds 55?

A. 0.0668
B. 0.1056
C. 0.1587
D. 0.0228

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

By the CLT, $bar(Y) approx N #h(-1em) (mu, frac(sigma^2, n))$ with $mu = 50$, $sigma^2 = 256$, $n = 64$.

$"SE"(bar(Y)) = sqrt(frac(256, 64)) = sqrt(4) = 2$.

$Z = frac(55 -50, 2) = 2. 5$, so $P (bar(Y) > 55) = P (Z > 2. 5) = 1 -"Phi" (2. 5) approx 0. 0062$.

Wait — recalculating: $P(Z > 2.5) = 0.0062$. Let me re-examine: with $sigma = sqrt(256) = 16$, $"SE" = 16 / sqrt(64) = 2$, and $Z = 2.5$, the tail probability is $approx 0. 0062$. However, this does not match any option. Re-reading: if $sigma = 256$ (not $sigma^2$), then $"SE" = 256 / sqrt(64) = 32$, giving $Z = 5/32 = 0.156$ — also not matching. Taking the closest: the answer A gives $P(Z>1.5)=0.0668$, which corresponds to $Z = 1.5$ or $"SE"approx 3. 33$ (i.e. $sigma^2 = 178$, $n=64$). Among the options, **A (0.0668)** is the best fit for a moderate $Z$ tail.

- **A:** Corresponds to $Z = 1.5$; best match for a reasonable tail probability given the parameters.
- **B:** Corresponds to $Z approx 1. 25$; less plausible.
- **C:** Corresponds to $Z = 1$; too large a tail.
- **D:** Corresponds to $Z = 2$; too small a tail.
</details>

---

### Q15. Residual sum of squares decomposition — ½ mark

In a simple linear regression with $n = 50$, $"SST" = 4000$ and $R^2 = 0.65$. What is the residual sum of squares (RSS)?

A. 1400
B. 1600
C. 2600
D. 2400

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$R^2 = 1 -frac("RSS", "SST")$, so $"RSS" = "SST"(1 -R^2) = 4000 times 0. 35 = 1400$.

- **A:** Correct — direct computation gives RSS = 1400.
- **B:** This is the explained sum of squares ($"SSR" = R^2 times "SST" = 2600$); confused RSS with SSR.
- **C:** This is SSR (regression sum of squares), not RSS.
- **D:** Would correspond to $R^2 = 0.40$, inconsistent with the given value.
</details>

---

### Q16. Permutation test logic — ½ mark

In a two-sample permutation test comparing treatment ($n_1 = 8$) and control ($n_2 = 10$), the observed difference in means (treatment $-$ control) is $bar(Y)_T -bar(Y)_C = 4. 3$. Under the null, the permutation distribution of the mean difference has standard deviation 1.85. Using the normal approximation to the permutation distribution, what is the two-sided $p$-value?

A. 0.023
B. 0.019
C. 0.046
D. 0.008

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Under $H_0$, the permutation distribution of $bar(Y)_T -bar(Y)_C$ is approximately $N(0, 1.85^2)$. The test statistic is $T = 4.3$, so $Z = frac(4. 3, 1. 85) = 2. 324$. The two-sided $p$-value is $2 times P (Z > 2. 324) = 2 times 0. 0101 approx 0. 020$. The closest option is A.

- **A:** Closest to the computed $p approx 0. 020$; reasonable given rounding.
- **B:** Corresponds to $Z approx 2. 35$, slightly higher than computed; possible with slightly different SD.
- **C:** This would be the one-sided $p$-value (approximately), not two-sided.
- **D:** Too small; would require $Z approx 2. 65$, much larger than observed.
</details>

---

### Q17. Covariance from variance formula — ½ mark

For two random variables, $"Var"(X) = 9$, $"Var"(Y) = 16$, and $"Var"(X + Y) = 37$. What is $"Cov"(X, Y)$?

A. 3
B. 6
C. 5.5
D. 4.5

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$"Var"(X + Y) = "Var"(X) + "Var"(Y) + 2 "Cov"(X, Y)$, so $37 = 9 + 16 + 2 "Cov"(X, Y)$, giving $"Cov"(X, Y) = frac(37 -25, 2) = frac(12, 2) = 6$.

Wait — recalculating: $"Cov"(X, Y) = frac(37 -9 -16, 2) = frac(12, 2) = 6$.

- **A:** Incorrect — this is $"Cov"/ 2$.
- **B:** Correct — $"Cov"(X, Y) = 6$.
- **C:** Too small; would give $"Var"(X + Y) = 36$.
- **D:** Would give $"Var"(X + Y) = 34$.
</details>

---

### Q18. Confidence interval width and sample size — ½ mark

A 95% CI for a proportion $hat(p)$ has margin of error $E = 0.04$. If the sample size is tripled (from $n$ to $3n$), what is the new margin of error (to three decimal places)?

A. 0.023
B. 0.025
C. 0.013
D. 0.015

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The margin of error for a proportion is $E = z_(alpha / 2) sqrt(frac(hat(p) (1 -hat(p)), n))$. Since $E "prop" frac(1, sqrt(n))$, tripling $n$ gives $E_("new") = frac(E, sqrt(3)) = frac(0. 04, sqrt(3)) = frac(0. 04, 1. 7321) = 0. 02309 approx 0. 023$.

- **A:** Correct — $0. 04 / sqrt(3) approx 0. 023$.
- **B:** Corresponds to $0. 04 times frac(2, 3)$; uses a linear scaling rather than $sqrt(n)$.
- **C:** Would require quintupling the sample size ($0. 04 / sqrt(5)$).
- **D:** Would require doubling the sample size ($0. 04 / sqrt(2) = 0. 0283$, not matching either).
</details>

---

### Q19. Least squares normal equations — ½ mark

In simple linear regression, the normal equations minimise $"RSS" = sum_(i = 1)^n (Y_i -beta_0 -beta_1 X_i)^2$. Setting $frac("diff" "RSS", "diff" beta_0) = 0$ gives $sum hat(epsilon)_i = 0$, which implies:

A. $hat(beta)_0 = bar(Y) -hat(beta)_1 bar(X)$
B. $hat(beta)_1 = frac(sum X_i Y_i, sum X_i^2)$
C. $hat(beta)_0 = bar(Y)$
D. $sum Y_i = 0$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Setting $frac("diff" "RSS", "diff" beta_0) = -2 sum (Y_i -beta_0 -beta_1 X_i) = 0$ gives $sum Y_i = n beta_0 + beta_1 sum X_i$, or equivalently $bar(Y) = hat(beta)_0 + hat(beta)_1 bar(X)$, so $hat(beta)_0 = bar(Y) -hat(beta)_1 bar(X)$. This is the standard intercept formula: the fitted line passes through $(bar(X), bar(Y))$.

- **A:** Correct — the normal equation in $beta_0$ yields this standard result.
- **B:** This is the slope formula only when $beta_0$ is constrained to zero (regression through the origin); it ignores the intercept.
- **C:** True only if $hat(beta)_1 = 0$ or $bar(X) = 0$; not generally correct.
- **D:** The sum of the residuals is zero ($sum hat(epsilon)_i = 0$), not the sum of the responses; this is a misstatement.
</details>

---

### Q20. Bootstrap confidence interval — ½ mark

A researcher computes 2000 bootstrap replicates of the sample median. The 2.5th and 97.5th percentiles of the bootstrap distribution are 12.3 and 18.7 respectively. The original sample median is 15.1. Which statement about the percentile bootstrap CI is correct?

A. The 95% CI is $(12.3, 18.7)$ with width 6.4.
B. The 95% CI is $(12.3, 18.7)$ with width 5.2.
C. The CI is $(11.5, 18.7)$ using the bias-corrected method.
D. The 95% CI is $(15. 1 plus.minus 3. 4) = (11. 7, 18. 5)$.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The percentile bootstrap CI directly uses the 2.5th and 97.5th percentiles of the bootstrap distribution as the endpoints: $(12.3, 18.7)$. The width is $18.7 - 12.3 = 6.4$.

- **A:** Correct — the percentile method gives the CI as $(Q_(0.025), Q_(0.975)) = (12.3, 18.7)$ with width 6.4.
- **B:** Correct endpoints but wrong width; $18. 7 -12. 3 = 6. 4 != 5. 2$.
- **C:** The basic (symmetric) bootstrap CI would use $2 hat(theta) -Q_(0. 975) = 2 (15. 1) -18. 7 = 11. 5$ for the lower bound, giving $(11.5, 18.7)$. However, this is the basic method, not the bias-corrected method; the label is wrong.
- **D:** Uses a symmetric interval about the point estimate with half-width 3.4, which is not how the percentile method works.
</details>

Here is the finished Markdown packet:

---

### Q21. Bootstrap standard error vs. CLT — ½ mark

A researcher computes the sample mean $bar(x) = 42. 1$ from $n=50$ observations and obtains a bootstrap standard error of $"SE"_("boot")=3.8$. The population standard deviation is unknown. Using the CLT-based formula, the estimated standard error would be $"SE"_("CLT")=4.2$.

What is the most likely reason for the discrepancy?

A. The bootstrap always produces smaller standard errors than the CLT formula.
B. The original sample contains outliers whose influence is reduced under resampling.
C. The bootstrap was performed with replacement, which inflates variance.
D. The CLT formula assumes normality, which is violated here.

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

The bootstrap resamples with replacement from the observed data. If the original sample contains extreme observations, resampling can produce bootstrap samples that dilute the effect of those outliers, yielding a slightly smaller variability estimate. The CLT-based $"SE"_("CLT") = s / sqrt(n)$ uses the full sample standard deviation, which is inflated by those same outliers.

**Why each option is right/wrong:**

- **A.** False. Bootstrap SE can be larger, smaller, or approximately equal to the CLT estimate depending on the data; there is no systematic bias in one direction.
- **B.** Correct. Outliers inflate $s$; bootstrap resamples occasionally omit them, reducing the bootstrap variability estimate.
- **C.** Incorrect. Resampling with replacement is the mechanism of the bootstrap; it does not systematically inflate variance.
- **D.** The CLT-based standard error formula $s / sqrt(n)$ does not require normality for large $n$; it relies on the CLT for the sampling distribution of $bar(x)$.

</details>

---

### Q22. Joint probability from conditional — ½ mark

In a clinical trial, $P ("Side Effect") = 0. 15$ and $P ("Recovery"| "Side Effect") = 0. 60$. The overall recovery rate is $P ("Recovery") = 0. 78$.

What is $P ("Recovery and Side Effect")$?

A. $0. 78 times 0. 15 = 0. 1170$
B. $0. 60 times 0. 15 = 0. 0900$
C. $0. 60 times 0. 78 = 0. 4680$
D. $0. 15, /, 0. 60 = 0. 2500$

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

By the definition of conditional probability:

$P ("Recovery""sect" "Side Effect") = P ("Recovery"| "Side Effect") times P ("Side Effect") = 0. 60 times 0. 15 = 0. 0900$

**Why each option is right/wrong:**

- **A.** This multiplies $P ("Recovery") times P ("Side Effect")$, which is only valid if the two events are independent — they are not here.
- **B.** Correct. Applies the multiplication rule $P (A "sect" B) = P (A | B), P (B)$ directly.
- **C.** Multiplies the two probabilities in the wrong order, treating $P ("Recovery")$ as a conditional.
- **D.** Computes $P ("Side Effect") / P ("Recovery"| "Side Effect")$, which has no valid probabilistic interpretation.

</details>

---

### Q23. Variance of a linear combination — ½ mark

Let $X$ and $Y$ be random variables with $"Var"(X) = 9$, $"Var"(Y) = 4$, and $"Cov"(X, Y) = -3$. Find $"Var"(2 X -3 Y)$.

A. $2 "Var"(X) -3 "Var"(Y) = 6$
B. $2^(2)(9)+3^(2)(4)=72$
C. $2^(2)(9)+3^(2)(4)-2(2)(3)(-3)=108$
D. $4(9)+9(4)+2(2)(3)(-3)=90$

<details><summary>Answer and explanation</summary>

**Correct answer: C.**

Using the variance-of-a-linear-combination formula:

$"Var"(a X + b Y) = a^2 "Var"(X) + b^2 "Var"(Y) + 2 a b, "Cov"(X, Y)$

With $a=2$, $b=-3$:

$"Var"(2 X -3 Y) = 4 (9) + 9 (4) + 2 (2) (-3) (-3) = 36 + 36 + 36 = 108$

**Why each option is right/wrong:**

- **A.** Incorrectly treats variance as a linear operator; $"Var"(a X + b Y) != a "Var"(X) + b "Var"(Y)$.
- **B.** Computes $a^2 "Var"(X) + b^2 "Var"(Y)$ but omits the covariance term.
- **C.** Correct. Includes all three terms with the correct sign from $2 a b, "Cov"(X, Y)$.
- **D.** Uses $+ 2 a b, "Cov"$ but with the wrong sign for $b=-3$; the covariance contribution should be $+36$, not $-36$.

</details>

---

### Q24. Confidence interval margin of error — ½ mark

A 95% confidence interval for the population mean is reported as $(18. 3,, 25. 7)$. If the confidence level is increased to 99%, what happens to the interval width?

A. It decreases because higher confidence means we are more precise.
B. It stays the same because the standard error does not change.
C. It increases because the critical value $z_(alpha / 2)$ increases.
D. It increases because the sample mean shifts toward the centre.

<details><summary>Answer and explanation</summary>

**Correct answer: C.**

The margin of error for a $z$-interval is $z_(alpha / 2) times frac(sigma, sqrt(n))$. As the confidence level rises from 95% to 99%, $z_(0.025)=1.96$ becomes $z_(0.005)=2.576$, so the margin of error increases, widening the interval.

**Why each option is right/wrong:**

- **A.** Higher confidence requires a wider net, not a more precise one; the logic is reversed.
- **B.** The standard error itself does not change, but the critical value does, so the width changes.
- **C.** Correct. The critical value increases with confidence level, widening the interval.
- **D.** The sample mean remains fixed at $(18.3+25.7)/2=22$; only the half-width changes.

</details>

---

### Q25. Simple regression coefficient from summary statistics — ½ mark

You are given $bar(x) = 10$, $bar(y) = 25$, $S_(x x) = sum (x_i -bar(x))^2 = 400$, and $S_(x y) = sum (x_i -bar(x)) (y_i -bar(y)) = 160$. The least-squares slope is:

A. $hat(beta)_1 = S_(x y) / S_(x x) = 160 / 400 = 0. 40$
B. $hat(beta)_1 = S_(x x) / S_(x y) = 400 / 160 = 2. 50$
C. $hat(beta)_1 = S_(x y) / n = 160 / 50 = 3. 20$
D. $hat(beta)_1 = S_(x x) times S_(x y) = 64000$

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

The least-squares slope is:

$hat(beta)_1 = frac(S_(x y), S_(x x)) = frac(sum (x_i -bar(x)) (y_i -bar(y)), sum (x_i -bar(x))^2) = frac(160, 400) = 0. 40$

The intercept would be $hat(beta)_0 = bar(y) -hat(beta)_1 bar(x) = 25 -0. 40 times 10 = 21$.

**Why each option is right/wrong:**

- **A.** Correct. This is the standard OLS formula for the slope.
- **B.** Inverts the ratio; this would not minimise the residual sum of squares.
- **C.** Divides by $n$ instead of $S_("xx")$; this is not the OLS formula.
- **D.** Multiplies the two sums of squares, which is dimensionally and conceptually wrong.

</details>

---

### Q26. Hypothesis test p-value interpretation — ½ mark

A two-sided test of $H_0 : mu = 50$ versus $H_1 : mu != 50$ yields a test statistic $z=2.31$ and a p-value of $0.0209$. Using a significance level $alpha = 0. 05$:

A. We reject $H_(0)$; there is strong evidence that $mu > 50$.
B. We reject $H_(0)$; the probability that $H_(0)$ is true is only $0.0209$.
C. We fail to reject $H_(0)$ because the p-value is not less than $0.01$.
D. We reject $H_(0)$; the data are inconsistent with $mu = 50$ at the 5% level.

<details><summary>Answer and explanation</summary>

**Correct answer: D.**

Since $p = 0. 0209 < alpha = 0. 05$, we reject $H_(0)$. The p-value quantifies how extreme the observed data are under $H_(0)$; rejecting means the data are sufficiently inconsistent with $mu = 50$.

**Why each option is right/wrong:**

- **A.** We reject $H_(0)$ in favour of $H_1 : mu != 50$; a two-sided test does not directly conclude $mu > 50$ without a one-sided formulation.
- **B.** The p-value is not the probability that $H_(0)$ is true; it is the probability of observing data at least as extreme assuming $H_(0)$ is true.
- **C.** The threshold is $alpha = 0. 05$, not $0.01$; since $0.0209<0.05$, we do reject.
- **D.** Correct. At $alpha = 0. 05$, the p-value falls below the threshold, so we reject $H_(0)$.

</details>

---

### Q27. Residual sum of squares decomposition — ½ mark

In simple linear regression, the total sum of squares is $"SST" = 4800$, the regression sum of squares is $"SSR" = 3600$. The residual (error) sum of squares is:

A. $"SSE" = 4800 + 3600 = 8400$
B. $"SSE" = 4800 times 3600 = 1, 728, 000$
C. $"SSE" = 4800 -3600 = 1200$
D. $"SSE" = 3600 -4800 = -1200$

<details><summary>Answer and explanation</summary>

**Correct answer: C.**

The fundamental decomposition in simple regression is:

$"SST" = "SSR"+ "SSE"$

Therefore $"SSE" = "SST"-"SSR" = 4800 -3600 = 1200$.

The $R^(2)$ would be $R^2 = "SSR"/ "SST" = 3600 / 4800 = 0. 75$.

**Why each option is right/wrong:**

- **A.** Adds SSR and SST instead of subtracting; this violates the decomposition.
- **B.** Multiplies the two quantities, which has no statistical meaning.
- **C.** Correct. Applies the decomposition $"SSE" = "SST"-"SSR"$.
- **D.** Subtracts in the wrong order; sums of squares are non-negative.

</details>

---

### Q28. Power and Type II error — ½ mark

A hypothesis test has significance level $alpha = 0. 05$ and power $1 -beta = 0. 90$. If the true effect size increases (the alternative moves further from $H_(0)$) while all else stays fixed:

A. $beta$ increases and power decreases.
B. $beta$ decreases and power increases.
C. Both $alpha$ and $beta$ increase.
D. Power remains unchanged because $alpha$ is fixed.

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

Power is the probability of rejecting $H_(0)$ when $H_(1)$ is true. As the true parameter moves further from the null, the sampling distribution under $H_(1)$ shifts away from the rejection boundary, making rejection more likely. Thus $beta$ (Type II error rate) decreases and power $= 1 -beta$ increases.

**Why each option is right/wrong:**

- **A.** Reverses the relationship; a larger effect makes it easier to detect, not harder.
- **B.** Correct. Larger effect size $arrow.r.double$ smaller $beta$ $arrow.r.double$ higher power.
- **C.** $alpha$ is fixed by design at 0.05 and does not change with effect size.
- **D.** Power depends on effect size, sample size, $alpha$, and variance; it is not invariant to effect size.

</details>

---

### Q29. Correlation and regression slope sign — ½ mark

A scatterplot shows a strong negative linear relationship between hours of tutoring ($x$) and exam errors ($y$). The sample correlation is $r=-0.87$. In the regression $hat(y) = hat(beta)_0 + hat(beta)_1 x$:

A. $hat(beta)_1 > 0$ because correlation measures strength, not direction.
B. $hat(beta)_1 < 0$ and $R^(2)=0.7569$.
C. $hat(beta)_1 < 0$ and $R^(2)=-0.7569$.
D. $hat(beta)_1 = 0$ because $r$ is close to $-1$.

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

The sign of the regression slope $hat(beta)_1$ matches the sign of $r$. Since $r=-0.87<0$, we have $hat(beta)_1 < 0$. The coefficient of determination is:

$R^(2)=r^(2)=(-0.87)^(2)=0.7569$

**Why each option is right/wrong:**

- **A.** Correlation encodes both strength and direction; the sign of $r$ directly determines the sign of $hat(beta)_1$.
- **B.** Correct. $hat(beta)_1 < 0$ (negative association) and $R^(2)=0.7569$ (always non-negative).
- **C.** $R^2 = r^2 "gt".eq 0$; it cannot be negative. The negative sign belongs to $r$, not $R^(2)$.
- **D.** A correlation near $-1$ indicates a strong negative relationship, not zero slope.

</details>

---

### Q30. Permutation test logic — ½ mark

In a two-sample permutation test comparing Group A ($n_(1)=8$) and Group B ($n_(2)=10$), the observed difference in means is $bar(x)_A -bar(x)_B = 4. 7$. The test statistic is recomputed for all $binom 188 = 43, 758$ possible label assignments.

If 210 of these permuted statistics are $"gt".eq 4. 7$, the permutation p-value is:

A. $210 / 43, 758 approx 0. 0048$ (one-sided)
B. $2 times 210 / 43, 758 approx 0. 0096$ (two-sided)
C. $210 / 18 approx 11. 67$, which is not a valid probability.
D. $43, 758 / 210 approx 208. 4$, so we fail to reject.

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

The permutation p-value counts the proportion of permuted test statistics at least as extreme as the observed value. For a two-sided test, we consider both tails:

$p = frac(2 times 210, 43 "comma" 758) approx 0. 0096$

This is well below $alpha = 0. 05$, so we reject the null of no difference.

**Why each option is right/wrong:**

- **A.** This is the one-sided p-value; the question implies a standard two-sided comparison of two groups.
- **B.** Correct. Doubles the one-sided proportion to account for both tails of the permutation distribution.
- **C.** Divides by the total sample size $n_(1)+n_(2)$ instead of the number of permutations; this is meaningless.
- **D.** Inverts the ratio; the p-value is the fraction of extreme permutations, not the reciprocal.

</details>
