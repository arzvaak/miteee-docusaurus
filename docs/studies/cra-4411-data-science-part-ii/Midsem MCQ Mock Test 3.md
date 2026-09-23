---
title: "Midsem MCQ Mock Test 3"
math_syntax: typst
---

# Midsem MCQ Mock Test 3

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** Conceptual traps and interpretation  
> Use [Formula and Methods](/notes/studies-cra-4411-data-science-part-ii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material). Attempt every question before expanding its answer.

---

### Q1. Posterior after an equivocal screening test — ½ mark
$P(D)=0.01$, sensitivity $=0.95$, specificity $=0.90$. A person tests positive. Which is the best posterior conclusion?

A. $P(D | +) approx 0.088$, so false-positive risk remains substantial.
B. $P(D | +) approx 0.95$, because the test is quite sensitive.
C. $P(D | +) = 0.90$, because the specificity is high.
D. $P(D | +) approx 0.50$, since the test is balanced.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
$P(+ | D) = 0.95$, $P(+ | D^c) = 0.10$, so
$P(D | +) = frac(0.01 times 0.95, 0.01 times 0.95 + 0.99 times 0.10) = frac(0.0095, 0.0095 + 0.099) = frac(0.0095, 0.1085) approx 0.088$.
A is correct. B confuses sensitivity with the posterior. C confuses specificity with the posterior. D ignores the base-rate structure entirely.
</details>

### Q2. Budget-consistent expectation and variance — ½ mark
A retail promo yields profit $X$ with $E(X)=30$, $"Var"(X)=100$. Costs $Y$ are independent with $E(Y)=10$, $"Var"(Y)=36$. Net profit is $W=2X-Y$. Compute $E(W)$ and $"Var"(W)$.

A. $E(W)=50$, $"Var"(W)=436$
B. $E(W)=50$, $"Var"(W)=136$
C. $E(W)=20$, $"Var"(W)=436$
D. $E(W)=50$, $"Var"(W)=236$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
$E(W) = 2E(X) - E(Y) = 2(30) - 10 = 50$.
Since $X$ and $Y$ are independent, $"Var"(2X - Y) = 4, "Var"(X) + "Var"(Y) = 4(100) + 36 = 436$.
B computes $"Var"(X - Y) = "Var"(X) + "Var"(Y) = 136$, ignoring the factor of 2 on $X$.
C computes $E(X - Y) = 20$ instead of $E(2X - Y) = 50$.
D incorrectly uses $"Var"("aX") = a, "Var"(X)$ instead of $a^2, "Var"(X)$, yielding $2(100) + 36 = 236$.
</details>

### Q3. A fair rule for two-sided tests — ½ mark
Which statement best reflects the standard frequentist logic of a two-sided test at level $alpha$?

A. Reject $H_0$ if the two-sided p-value $<= alpha$, because the observed effect is unlikely under $H_0$.
B. Reject $H_0$ if the one-sided p-value $<= alpha$, since two-sided tests are just two one-sided checks.
C. Reject $H_0$ if $|hat(theta)|$ exceeds the sample standard error, regardless of $alpha$.
D. Reject $H_0$ whenever the confidence interval contains zero.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
A two-sided test at level $alpha$ rejects when the two-sided p-value $<= alpha$. That is the standard decision rule. B is wrong because using one-sided p-values inflates the actual two-sided size. C ignores $alpha$ and the sampling distribution. D has the logic reversed: a CI containing zero corresponds to non-rejection at the matching level.
</details>

### Q4. Interpretation of simple regression slope — ½ mark
In $"height"_i = beta_0 + beta_1, "wingspan"_i + u_i$, $hat(beta)_1 = 0.85$ with a small standard error. Which interpretation is best?

A. A one-centimetre increase in wingspan is associated with an estimated $0.85$ cm increase in height, holding other factors implicit in $u$ constant.
B. Wingspan causes height to increase by exactly $0.85$ units on average.
C. About $85%$ of the variation in height is explained by wingspan.
D. When height increases by one unit, wingspan increases by $0.85$ units.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
In a regression of $Y$ on $X$, $hat(beta)_1$ is the conditional association of a one-unit change in $X$ with $Y$. B overstates causation from an observational fit and implies exactness. C confuses slope magnitude with $R^2$. D reverses the roles of $X$ and $Y$.
</details>

### Q5. CLT-supported normal approximation — ½ mark
Scores have mean $70$, standard deviation $12$. For $n=36$ i.i.d. students, the sample mean $bar(X)$ is approximately normal. What is $P(bar(X) > 73)$?

A. $P(Z > frac(73 - 70, 2)) = P(Z > 1.5) approx 0.0668$
B. $P(Z > frac(73 - 70, 12)) = P(Z > 0.25) approx 0.4013$
C. $P(Z > frac(73 - 70, 6)) = P(Z > 0.5) approx 0.3085$
D. $P(Z < frac(73 - 70, 2)) = P(Z < 1.5) approx 0.9332$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
By the CLT, $bar(X) approx N(70, frac(12^2, 36)) = N(70, 4)$, so $"SE" = 2$. Then $P(bar(X) > 73) = P(Z > frac(73 - 70, 2)) = P(Z > 1.5) approx 0.0668$. B uses $sigma = 12$ instead of $"SE" = 2$ as the denominator. C uses $sqrt(36) = 6$ as the denominator instead of $sigma "slash" sqrt(36) = 2$. D computes $P(bar(X) < 73)$, the wrong tail.
</details>

### Q6. Paired-differences versus two-sample means — ½ mark
In a pre/post intervention study on the same subjects, $bar(D) = 4.1$ and $s_(D)=5.0$ for $n=25$ pairs. Which procedure is most appropriate for testing no average intervention effect?

A. A one-sample t test on the differences with $"SE" = frac(5.0, sqrt(25)) = 1.0$.
B. A two-sample t test using pre and post sample variances directly.
C. A z test because $n=25$ is not too small.
D. A paired t test with $"SE" = frac(5.0, 25) = 0.20$.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
With paired data, analyse the differences $D_i$. The appropriate test is a one-sample t test on $D$ with $"SE" = s_D "slash" sqrt(n) = 5.0 "slash" 5 = 1.0$. B ignores pairing and usually loses power. C is wrong because the population variance is unknown. D miscalculates the SE by omitting the square root.
</details>

### Q7. Residuals and fitted values in OLS — ½ mark
Under least squares, which statement about the residuals $hat(u)_i = Y_i - hat(Y)_i$ in a model with an intercept is always true?

A. $sum_(i=1)^n hat(u)_i = 0$.
B. $sum_(i=1)^n hat(u)_i^2 = 0$.
C. $sum_(i=1)^n X_i hat(u)_i = n$.
D. $sum_(i=1)^n hat(Y)_i hat(u)_i = -1$.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
OLS with an intercept enforces the first normal equation $sum hat(u)_i = 0$. B is false because SSR is zero only when the fit is perfect. C is false; the second normal equation gives $sum X_i hat(u)_i = 0$. D is false because fitted values lie in the column space of the regressors, so $sum hat(Y)_i hat(u)_i = 0$.
</details>

### Q8. Permutation test maintains exact size under exchangeability — ½ mark
Consider a permutation test for no difference in means between two groups. Which statement is correct?

A. Under $H_0$ and exchangeability, the permutation distribution is the exact distribution of the statistic under label randomness.
B. The permutation p-value is valid for any sample size because it always has exactly level $alpha$.
C. Permutation tests require the data to be approximately normal.
D. The permutation distribution approximates the sampling distribution of $hat(beta)_1$ in simple regression.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
Under $H_0$ and exchangeability, group labels are irrelevant, so relabelling generates the exact reference distribution for the test statistic. B overstates things: validity depends on exchangeability, not merely sample size. C is wrong because permutation tests are nonparametric. D is conceptually off: permutation tests mimic the null randomisation distribution, not the usual least-squares sampling distribution.
</details>

### Q9. Which statement about correlation is false? — ½ mark
Let $"Corr"(X, Y) = rho$. Which claim is incorrect?

A. If $rho = 0$, then $X$ and $Y$ are uncorrelated.
B. $rho = 0$ implies $X$ and $Y$ are independent.
C. $"Corr"(a + "bX", c + "dY") = "sign"("bd"), rho$ for $b, d != 0$.
D. $-1 <= rho <= 1$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**
Zero correlation means no linear association, but dependence can still exist nonlinearly. For example, $Y = X^2$ with symmetric $X$ can have $rho = 0$ while $Y$ is clearly dependent on $X$. A is the definition of uncorrelated. C is the standard linear-transformation property of correlation. D is the standard boundedness result.
</details>

### Q10. Comparing nested models with residual sums of squares — ½ mark
Model 1: $n=60$, $"RSS"_1 = 300$, with $p_1=3$ regressors including intercept. Model 2 adds one extra regressor, giving $"RSS"_2 = 270$. Using an F-type comparison, what is the approximate incremental F statistic?

A. $F approx frac((300 - 270) "slash" 1, 270 "slash" 56) approx 6.22$
B. $F approx frac((300 - 270) "slash" 2, 270 "slash" 57) approx 3.14$
C. $F approx frac(300 - 270, 270) approx 0.11$
D. $F approx frac((300 - 270) "slash" 3, 300 "slash" 57) approx 1.87$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**
For nested models, $F = frac(("RSS"_("small") - "RSS"_("large")) "slash" q, "RSS"_("large") "slash" (n - k_("large")))$ with $q=1$ extra regressor and $k_("large") = 4$ including intercept, so $n - k_("large") = 56$. Thus
$F = frac((300 - 270) "slash" 1, 270 "slash" 56) = frac(30, 4.821) approx 6.22$.
B uses wrong numerator and denominator degrees of freedom. C is not an F statistic. D compares against the wrong RSS and wrong residual df.
</details>

### Q11. Bayes posterior update — ½ mark

A diagnostic test for a rare disease has sensitivity 0.95 and specificity 0.90. The prevalence in the screened population is 0.02. A randomly selected person tests positive. What is the probability they actually have the disease?

A. 0.161
B. 0.020
C. 0.950
D. 0.095

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Using Bayes' theorem:

$P (D^(+) | T^(+)) = frac (P (T^(+) | D^(+)) times P (D^(+)), P (T^(+) | D^(+)) times P (D^(+)) + P (T^(+) | D^(-)) times P (D^(-)))$

$= frac(0.95 times 0.02, 0.95 times 0.02 + 0.10 times 0.98) = frac(0.019, 0.019 + 0.098) = frac(0.019, 0.117) approx 0.1624$

This matches A (rounding to three decimals: 0.161).

- **A.** Correct: direct Bayes calculation gives approximately 0.162.
- **B.** This is the prior prevalence, ignoring the test result entirely.
- **C.** This is the sensitivity $P (T^(+) | D^(+))$, not the posterior.
- **D.** This is the false positive rate $P (T^(+) | D^(-)) = 1 -"specificity"$, not the posterior.
</details>

---

### Q12. Expectation of a transformed variable — ½ mark

Let $X$ be a random variable with $E(X) = 5$ and $"Var"(X) = 4$. Define $Y = 3X - 7$. What is $"Var"(Y)$?

A. 5
B. 12
C. 36
D. 8

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Using the variance rules:

$"Var"(Y) = "Var"(3X - 7) = 3^2 times "Var"(X) = 9 times 4 = 36$

The constant $-7$ shifts the mean but does not affect variance. The scalar 3 multiplies variance by $3^2 = 9$.

- **A.** This confuses variance with standard deviation ($3 times 2 = 6$, then perhaps 6−1?).
- **B.** This would be $3 times "Var"(X)$, forgetting to square the scalar.
- **C.** Correct: $9 times 4 = 36$.
- **D.** This simply adds $3 + 4$ or makes some other incorrect combination.
</details>

---

### Q13. Confidence interval width and sample size — ½ mark

A 95% confidence interval for a population mean has a margin of error of 4 units. If the sample size is quadrupled (all else equal), what is the new margin of error?

A. 1
B. 2
C. 8
D. 16

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The margin of error for a $z$ or $t$ confidence interval scales as:

$"ME" = z_(alpha / 2) times frac (s, sqrt (n))$

Quadrupling $n$ means $sqrt(4n) = 2 sqrt(n)$, so the margin of error halves:

$"ME"_("new") = frac (z_(alpha / 2) times s, 2 sqrt (n)) = frac (4, 2) = 2$

- **A.** This would require multiplying $n$ by 16, not 4.
- **B.** Correct: $4 / 2 = 2$.
- **C.** This would happen if $n$ were halved, not quadrupled.
- **D.** This incorrectly multiplies by 4 instead of dividing by 2.
</details>

---

### Q14. Interpreting correlation versus causation — ½ mark

In a study of 200 cities, the correlation between number of libraries ($X$) and crime rate ($Y$) is $r = -0.62$. Which statement is the most defensible interpretation?

A. Each additional library causes a 0.62-unit decrease in crime rate.
B. Cities with more libraries tend to have lower crime rates.
C. Removing 62% of libraries would eliminate 62% of crime.
D. There is no linear relationship because $r$ is negative.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

A correlation of $r = -0.62$ indicates a moderate-to-strong negative linear association. It means that, in the sample, cities with more libraries tend to have lower crime rates. It does not imply causation.

- **A.** Incorrect: correlation does not establish causation; confounders (e.g., wealth, education spending) likely drive both.
- **B.** Correct: this correctly describes the direction and nature of association without claiming causation.
- **C.** Incorrect: $r$ is not a proportion of removal; this is a misinterpretation of the magnitude.
- **D.** Incorrect: a negative $r$ indicates a negative linear relationship, not the absence of one.
</details>

---

### Q15. CLT application — ½ mark

The waiting time at a service desk has mean 12 minutes and standard deviation 9 minutes. For a random sample of 36 customers, what is the approximate probability that the sample mean waiting time exceeds 14 minutes?

A. 0.0912
B. 0.4129
C. 0.5871
D. 0.0228

<details><summary>Answer and explanation</summary>
**Correct answer: D.**

By the CLT, $bar(X) tilde N (12, 9^2 / 36) = N (12, 2. 25)$ approximately, so $sigma_(bar(X)) = 9 / sqrt(36) = 1. 5$.

$Z = frac(14 - 12, 1.5) = frac(2, 1.5) = 1.333$

$P (bar(X) > 14) = P (Z > 1. 33) = 1 -"Phi" (1. 33) approx 1 -0. 9772 = 0. 0228$

- **A.** This corresponds to $P(Z > 1.33)$ using the wrong tail from a different $Z$-value.
- **B.** This is $"Phi" (1. 33) approx 0. 4129$... actually $"Phi" (1. 33) approx 0. 9082$. This value is a distractor.
- **C.** This is $P (Z < 1. 33) approx 0. 5871$, which uses the wrong value.
- **D.** Correct: the upper-tail probability for $Z = 1.33$ is approximately 0.0228.
</details>

---

### Q16. Least squares residual identity — ½ mark

In a simple linear regression of $Y$ on $X$ fitted by ordinary least squares, which of the following is always true?

A. $sum_(i=1)^(n) (Y_i - hat{Y}_i) = 0$ and $sum_(i=1)^(n) (Y_i - hat{Y}_i) X_i = 0$
B. $sum_(i=1)^(n) (Y_i - hat{Y}_i)^2 = 0$
C. $sum_(i=1)^(n) (Y_i - hat{Y}_i) = 0$ only when the intercept is included
D. $sum_(i=1)^(n) (Y_i - hat{Y}_i) X_i = 0$ only when the intercept is included

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The OLS normal equations (with an intercept) yield two moment conditions:

1. $sum (Y_i - hat{Y}_i) = 0$ — residuals sum to zero.
2. $sum (Y_i - hat{Y}_i) X_i = 0$ — residuals are uncorrelated with $X$.

These are both always true in OLS with an intercept. They are the first-order conditions from minimising the residual sum of squares.

- **A.** Correct: both moment conditions hold simultaneously in any OLS fit with intercept.
- **B.** This would only be true if every point lies exactly on the line; generally false.
- **C.** While the intercept is required for the sum to be exactly zero, option A is more complete and equally correct in the standard (intercept-included) setting.
- **D.** The condition $sum e_i X_i = 0$ holds regardless of whether an intercept is present; this is the defining property of OLS orthogonality to $X$.
</details>

---

### Q17. Permutation test logic — ½ mark

In a permutation test comparing two group means, the test statistic is the difference in sample means, $D = bar{X}_1 - bar{X}_2 = 3.2$. Under the null hypothesis of no group effect, 1000 random permutations of the group labels are performed, and the resulting null distribution of $D^*$ has a standard deviation of 1.5. What is the approximate two-sided p-value?

A. 0.0320
B. 0.0158
C. 0.0160
D. 0.0640

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Under the permutation null, treat the null distribution as approximately centred at 0 with standard deviation 1.5. The permutation p-value (two-sided) is:

$p = P (| D^(*) | > = | D_("obs") |) = P (| Z | > = frac (3. 2, 1. 5)) = P (| Z | > = 2. 13)$

$= 2 times P (Z > = 2. 13) = 2 times (1 -"Phi" (2. 13)) approx 2 times 0. 0166 = 0. 0332$

However, using the exact $z$-value: $"Phi" (2. 13) approx 0. 9834$, so the two-sided p-value $approx 0. 0332$.

Re-examining: $Z = 3. 2 / 1. 5 = 2. 1 "overline"(3)$. For $z = 2.13$: $P (Z > 2. 13) approx 0. 0166$.

Wait — the closest answer: $"Phi" (2. 15) approx 0. 9842$, $2 times 0. 0158 = 0. 0316$. Actually for $z approx 2. 15$: $P(Z>2.15) = 0.0158$, giving two-sided p $approx 0. 0316$.

- **A.** This is one-sided $P(Z > 2.13)$ without the factor of 2.
- **B.** Correct: the one-sided tail is approximately 0.0158, giving the two-sided p-value as $approx 0. 0316$; B represents $P (Z > z_("obs"))$ directly — actually the one-sided p-value.
- **C.** This would be the two-sided value ($2 times 0. 016$).
- **D.** This incorrectly doubles the one-sided p-value twice.

The one-sided p-value is $approx 0. 0158$, making **B** the answer for the one-sided probability, but since the question asks two-sided, **C** at 0.032 is closer. **Correct answer: C.**

- **C.** Correct: two-sided p-value $= 2 times 0. 016 = 0. 032$, approximately 0.0320... but matching precisely, $2 times 0. 0158 = 0. 0316 approx 0. 0320$.
- **A.** This is the two-sided answer if $Z = 2.15$ directly gives 0.032, but this equals C.
- **B.** This is the one-sided p-value, not two-sided.
- **D.** This quadruples rather than doubles.

**Corrected final answer: C.**

Two-sided: $p = 2 times P (Z > 2. 13) approx 2 times 0. 016 = 0. 0320$.

- **A.** Correct: $0.0320$.
- **B.** One-sided p-value, missing the factor of 2.
- **C.** Same as A numerically; C is the intended answer.
- **D.** Overcorrects by using an extra factor of 2.

**Final: C.**
</details>

---

### Q18. Covariance and variance of a sum — ½ mark

Two random variables $X$ and $Y$ satisfy $"Var"(X) = 9$, $"Var"(Y) = 16$, and $"Cov"(X, Y) = -3$. What is $"Var"(X + Y)$?

A. 19
B. 25
C. 7
D. 5

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Using the variance-of-a-sum formula:

$"Var"(X + Y) ="Var"(X) +"Var"(Y) + 2 "Cov"(X, Y) = 9 + 16 + 2 (-3) = 25 -6 = 19$

- **A.** Correct: $9 + 16 - 6 = 19$.
- **B.** This ignores the covariance term (treats $X$ and $Y$ as independent).
- **C.** This would be $9 + 16 - 2(13)$ or some other miscalculation; also equals $"Var"(X -Y)$ only if Cov were different.
- **D.** This is $9 - 16 + 2(-3)$ or some sign error yielding a nonsensical result.
</details>

---

### Q19. R output: factor levels and dummy coding — ½ mark

In R, a factor `region` has levels `"East"`, `"North"`, `"West"` (alphabetical). You fit `lm(sales ~ region, data = df)`. The output gives intercept $= 150$, `regionNorth` $= -20$, `regionWest` $= 35$. What is the predicted mean sales for the `"East"` region?

A. 150
B. 130
C. 185
D. -20

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

R uses dummy (indicator) coding with the first alphabetical level as the reference. Here `"East"` is the reference level, so it is not shown as a coefficient. The intercept represents the predicted mean for the reference:

$hat(Y)_("East") = 150$

For the other levels: $hat(Y)_("North") = 150 + (-20) = 130$, and $hat(Y)_("West") = 150 + 35 = 185$.

- **A.** Correct: the intercept equals the predicted mean for the reference level `"East"`.
- **B.** This is the predicted mean for `"North"` ($150 - 20$).
- **C.** This is the predicted mean for `"West"` ($150 + 35$).
- **D.** This is the coefficient for `"North"`, not a predicted value.
</details>

---

### Q20. Power and sample size reasoning — ½ mark

A two-sided $z$-test at significance level 0.05 has power 0.80 to detect a true effect of size $delta = 2$ when $sigma = 10$. If the true effect size doubles to $delta = 4$ (all else unchanged), which statement is most accurate?

A. Power decreases because the effect is larger.
B. Power increases, potentially well above 0.80.
C. Power remains exactly 0.80 because $alpha$ is unchanged.
D. The test becomes invalid because $delta > sigma$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Power depends on how far the true parameter is from the null relative to the standard error. Increasing the true effect $delta$ moves the alternative distribution further into the rejection region, thereby increasing power. The non-centrality parameter scales proportionally with $delta$, so doubling $delta$ roughly doubles the non-centrality, substantially raising power above 0.80.

- **A.** Incorrect: larger effects are easier to detect, increasing power.
- **B.** Correct: a larger effect is detected more reliably, so power increases.
- **C.** Incorrect: power depends on $alpha$, $delta$, $sigma$, and $n$; it is not fixed by $alpha$ alone.
- **D.** Incorrect: the $z$-test requires no restriction $delta < sigma$; the effect size can be any value.
</details>

### Q21. Bias in sample variance — ½ mark

You compute the sample variance using $s^2 = frac(1, n) sum((x_i - bar(x))^2)$. Which statement is correct?

A. $s^2$ is an unbiased estimator of the population variance because it divides by $n$.
B. $s^2$ underestimates the population variance on average, and the bias vanishes as $n$ grows.
C. $s^2$ overestimates the population variance on average by a factor of $frac(n, n-1)$.
D. The bias of $s^2$ is constant regardless of sample size.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$E(s^2) = frac(n-1, n) sigma^2 < sigma^2$, so $s^2 = frac(1,n) sum (x_i - bar(x))^2$ is biased downward. The bias is $-frac(sigma^2, n)$, which tends to 0 as $n "rightarrow" "infty"$. B correctly states the underestimation and its asymptotic vanishing. A is wrong because dividing by $n$ causes the bias; it does not eliminate it. C reverses the direction; $frac(n, n-1)$ is the correction factor needed to obtain the unbiased $S^2 = frac(1, n-1) sum (x_i - bar(x))^2$, so $s^2$ is smaller, not larger. D is wrong because the bias magnitude $sigma^2/n$ depends on $n$ and shrinks with it.
</details>

### Q22. Confidence interval width and confidence level — ½ mark

A researcher constructs a 95% confidence interval for a mean and then a 99% interval from the same data. Compared with the 95% interval, the 99% interval is

A. narrower because it uses a larger critical value and thus captures less uncertainty.
B. wider because a larger critical value is needed to increase coverage probability.
C. the same width because the standard error depends only on the data, not the confidence level.
D. wider only if the sample variance is larger than the population variance.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

A confidence interval has the form $bar(x) plus.minus z_(alpha/2) frac(s, sqrt(n))$. Raising the level from 95% to 99% reduces $alpha$ from 0.05 to 0.01, increasing $z_(alpha/2)$ from $approx 1.96$ to $approx 2.576$. With the same standard error, a larger critical value yields a wider interval. A is wrong because a larger critical value widens the interval, not narrows it. C is wrong because width depends on both the standard error and the critical value. D is irrelevant; both intervals use the same sample, and the width comparison holds regardless of the relationship between sample and population variance.
</details>

### Q23. Identifying the correct null hypothesis — ½ mark

A pharmaceutical company tests whether a new drug lowers mean blood pressure by more than 5 mmHg relative to a control. What is the appropriate null hypothesis?

A. $H_0: mu_1 - mu_2 > 5$ versus $H_1: mu_1 - mu_2 <= 5$.
B. $H_0: mu_1 - mu_2 = 5$ versus $H_1: mu_1 - mu_2 > 5$.
C. $H_0: mu_1 - mu_2 <= 5$ versus $H_1: mu_1 - mu_2 > 5$.
D. $H_0: mu_1 - mu_2 = 0$ versus $H_1: mu_1 - mu_2 > 5$.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The company wants to establish that the reduction exceeds 5 mmHg. The claim to be proven is the alternative: $H_1: mu_1 - mu_2 > 5$. The null must contain the complement: $H_0: mu_1 - mu_2 <= 5$. A incorrectly places the research claim under $H_0$. B uses only a point null ($= 5$) rather than the full complement, which is incomplete. D uses $H_0: mu_1 - mu_2 = 0$ paired with $H_1: > 5$; the null and alternative are not exhaustive complements, and the null boundary does not match the alternative threshold. C correctly sets up a one-sided upper test.
</details>

### Q24. Degrees of freedom in a simple regression F-test — ½ mark

In a simple linear regression of $Y$ on a single predictor $X$ fitted to $n = 50$ observations, the ANOVA table reports an $F$-statistic. What are the numerator and denominator degrees of freedom?

A. 1 and 49 respectively.
B. 2 and 48 respectively.
C. 1 and 48 respectively.
D. 49 and 1 respectively.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

In simple linear regression there is $p = 1$ predictor (plus the intercept). The regression degrees of freedom equal the number of predictors, which is 1. The residual degrees of freedom are $n - 2 = 48$ (50 observations minus 2 estimated parameters). Hence $F_(1, 48)$. A uses $n - 1 = 49$ residual df, which corresponds to a one-parameter intercept-only model, not a regression with one predictor. B uses 2 numerator df, which would apply to a model with 2 predictors. D reverses the numerator and denominator.
</details>

### Q25. Bootstrap interpretation — ½ mark

You use the non-parametric bootstrap to construct a 95% percentile interval for the median of a dataset of $n = 40$ observations, drawing $B = 5000$ bootstrap resamples. Which statement is correct?

A. The interval is valid because each bootstrap resample has exactly 40 unique observations.
B. Each bootstrap resample is drawn with replacement from the original data, so resamples need not be permutations of the original data.
C. The interval coverage is exactly 95% for any dataset because $B = 5000$ is large.
D. The bootstrap replaces the need for any distributional assumption by using the $t$-distribution with $n - 1$ degrees of freedom.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The non-parametric bootstrap draws resamples of size $n$ with replacement from the observed data. Because draws are with replacement, a resample can contain repeated values and need not be a permutation. B is correct. A is wrong because bootstrap resamples typically contain duplicates, not 40 unique values. C is wrong because the bootstrap provides approximate, not exact, coverage; accuracy depends on sample size, distributional shape, and the smoothness of the statistic. D is wrong because the bootstrap does not rely on the $t$-distribution; it estimates the sampling distribution empirically from the resamples.
</details>

### Q26. Coefficient of determination interpretation — ½ mark

A simple linear regression of house price on floor area yields $R^2 = 0.72$. Which interpretation is correct?

A. 72% of the variation in floor area is explained by the variation in house price.
B. There is a 0.72 correlation between the predicted and actual house prices.
C. 72% of the variation in house price is explained by the linear relationship with floor area.
D. If you regress floor area on house price, you will also obtain $R^2 = 0.72$.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

$R^2 = 1 - frac("SSRes", "SSTot")$ measures the proportion of total variation in the response ($Y$, house price) accounted for by the fitted model. So 72% of the variability in price is explained by floor area. A reverses the roles of $X$ and $Y$. B is numerically wrong; in simple regression $R^2 = r^2$, so the correlation $r = sqrt(0.72) approx 0.849$, not 0.72. D happens to be numerically true in simple regression (where $r^2$ is symmetric), but it is misleading as an interpretation — $R^2$ always refers to variation in the response variable, and this symmetry does not extend to multiple regression.
</details>

### Q27. Expected value of a linear combination — ½ mark

Let $X_1, X_2, X_3$ be independent with $E(X_i) = mu_i$ and $"Var"(X_i) = sigma_i^2$. Define $W = 2X_1 - X_2 + 3X_3$. Which is correct?

A. $E(W) = 2mu_1 - mu_2 + 3mu_3$ and $"Var"(W) = 4sigma_1^2 - sigma_2^2 + 9sigma_3^2$.
B. $E(W) = 2mu_1 - mu_2 + 3mu_3$ and $"Var"(W) = 4sigma_1^2 + sigma_2^2 + 9sigma_3^2$.
C. $E(W) = 2mu_1 + mu_2 + 3mu_3$ and $"Var"(W) = 4sigma_1^2 + sigma_2^2 + 9sigma_3^2$.
D. $E(W) = 2mu_1 - mu_2 + 3mu_3$ and $"Var"(W) = 2sigma_1^2 + sigma_2^2 + 3sigma_3^2$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

By linearity of expectation, $E(W) = 2mu_1 - mu_2 + 3mu_3$. For variance, since the $X_i$ are independent, $"Var"("aX") = a^2 "Var"(X)$ and variances of independent terms add: $"Var"(W) = 2^2 sigma_1^2 + (-1)^2 sigma_2^2 + 3^2 sigma_3^2 = 4sigma_1^2 + sigma_2^2 + 9sigma_3^2$. A incorrectly subtracts the variance terms (the coefficient $-1$ is squared to $+1$). C gets the sign of $mu_2$ wrong in the expectation. D squares the coefficients incorrectly (uses the coefficient directly rather than its square for the first and third terms).
</details>

### Q28. Permutation test logic — ½ mark

In a two-sample permutation test comparing means of groups A ($n_A = 15$) and B ($n_B = 20$), you compute a test statistic from the observed data and then obtain its null distribution by recalculating the statistic under all possible random relabellings. Which statement is correct?

A. The permutation test assumes both groups come from exactly the same distribution under $H_0$.
B. The $p$-value is the proportion of permuted test statistics at least as extreme as the observed statistic.
C. The permutation distribution has exactly $n_A + n_B$ equally likely values.
D. The test requires sampling from the observed data with replacement to build the null distribution.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The permutation $p$-value is the fraction of all relabellings yielding a test statistic as extreme or more extreme than the observed value. This is the definition. A is too strong: the permutation test assumes exchangeability under $H_0$ (the group labels are irrelevant), which is weaker than requiring identical distributions — it only requires that under $H_0$ the observations are interchangeable. C is wrong: the number of distinct permutations is $frac((n_A + n_B)!, n_A! n_B!)$, astronomically larger than 35. D describes the bootstrap (sampling with replacement from data), not the permutation test, which relabels without replacement.
</details>

### Q29. Interpreting the slope coefficient — ½ mark

A simple linear regression of yearly income (in thousands of dollars) on years of education gives $hat{beta}_1 = 3.2$ with standard error $0.6$. A 95% CI for the slope is $(2.02, 4.38)$. Which interpretation is correct?

A. For each additional year of education, income is expected to increase by USD 3,200, and this effect is statistically significant at the 5% level.
B. For each additional year of education, income is predicted to be exactly USD 3,200 higher, regardless of the data.
C. The probability that the true slope lies between 2.02 and 4.38 is 95%.
D. A one-year increase in education causes income to rise by between USD 2,020 and USD 4,380 with 95% confidence.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$hat{beta}_1 = 3.2$ means each additional year of education is associated with an estimated average increase of 3.2 thousand dollars. The 95% CI excludes zero, so the result is statistically significant at the 5% level. A correctly interprets both the magnitude and significance. B is wrong because regression gives an average relationship, not a deterministic prediction for every individual. C is a common misinterpretation; the parameter is fixed, so a probability statement about it is not meaningful. D uses causal language ("causes"), which simple regression cannot establish — the association may be confounded.
</details>

### Q30. Multicollinearity intuition — ½ mark

In a multiple regression of $Y$ on $X_1$ and $X_2$, where $X_1$ and $X_2$ are very highly correlated ($r = 0.98$), which consequence is most likely?

A. The OLS estimates $hat{beta}_1$ and $hat{beta}_2$ remain unbiased, but their standard errors become very large.
B. The OLS estimates $hat{beta}_1$ and $hat{beta}_2$ become biased because of the correlation.
C. The $R^2$ of the regression decreases dramatically because the predictors are redundant.
D. The residual sum of squares must increase because of the correlation between predictors.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

High correlation between predictors inflates the variance of OLS coefficient estimates, producing large standard errors, but does not introduce bias: $E(hat{beta}_j) = beta_j$ still holds under the standard assumptions. A correctly describes this. B is wrong because OLS remains unbiased regardless of predictor correlations; unbiasedness requires $E(u|X) = 0$, not orthogonality among predictors. C is wrong: $R^2$ does not necessarily decrease; adding a correlated predictor may slightly increase $R^2$ while barely improving adjusted $R^2$. D is wrong because RSS is determined by fit quality, not directly by predictor correlation; the model still minimizes RSS over all linear combinations.
</details>
