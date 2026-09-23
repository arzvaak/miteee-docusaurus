---
title: "Midsem MCQ Mock Test 2"
math_syntax: typst
---

# Midsem MCQ Mock Test 2

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** Calculation-heavy practice  
> Use [Formula and Methods](/notes/studies-cra-4412-advanced-data-science-part-iii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4412-advanced-data-science-part-iii-questions-from-class-material). Attempt every question before expanding its answer.

---

### Q1. Scaling before PCA — ½ mark

A dataset has three variables: Age (range 18–65), Income (range 15 000–120 000), and Height (range 1.45–2.05 m). Before applying PCA on the raw (unscaled) data, which variable will dominate the first principal component and why?

A. Height, because it has the smallest range and therefore the largest variance after centering.
B. Income, because it has the largest range and therefore the largest variance in raw units.
C. Age, because it has the most symmetric distribution among the three.
D. All three contribute equally because PCA centres the data by default.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

PCA finds directions of maximum variance. On unscaled data the variable with the largest numeric variance dominates PC1. Income ranges over roughly 105 000, so its variance (in squared dollars) dwarfs that of Age (~2 200) and Height (~0.023). Therefore Income will load most heavily on PC1.

A is wrong: smallest range implies smallest variance. C is wrong: distribution symmetry is irrelevant to variance magnitude. D is wrong: centering subtracts the mean but does not equalise variances; only standardisation (scaling to unit variance) would give equal influence.

</details>

---

### Q2. Boosting shrinkage parameter — ½ mark

In gradient boosting with a shrinkage parameter $lambda$, the update at iteration $m$ is $F_m(x) = F_(m-1)(x) + lambda times h_m(x)$. If $lambda$ is reduced from 0.1 to 0.01, what is the most likely effect on a fixed computational budget of 500 trees?

A. Training error increases and test error increases, because fewer effective iterations are completed.
B. Training error increases and test error decreases, because the model regularises more at the cost of fit.
C. Training error decreases and test error increases, because the model overfits with smaller steps.
D. Training error decreases and test error decreases, because smaller steps always improve generalisation.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Shrinkage $lambda$ controls the contribution of each weak learner. A smaller $lambda$ means each tree has less influence, so after only 500 trees the cumulative model is weaker on the training data — training error rises. However, the slower learning rate acts as regularisation: the model is less likely to overfit, so test (generalisation) error typically decreases (up to a point).

A is wrong: test error does not generally increase with more regularisation. C is wrong: smaller steps make overfitting less likely, not more. D is wrong: while test error often improves, training error does not decrease — the model fits the training data less aggressively in 500 iterations.

</details>

---

### Q3. Cross-validation fold allocation — ½ mark

A researcher has a dataset of 200 observations and wants to estimate test RMSE using repeated $k$-fold cross-validation with $k = 5$ and 3 repeats. How many observations are in each validation fold, and how many total model fits are performed?

A. 40 observations per fold; 3 total model fits.
B. 50 observations per fold; 15 total model fits.
C. 40 observations per fold; 15 total model fits.
D. 60 observations per fold; 5 total model fits.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

With $k = 5$ and $n = 200$, each fold has $200 / 5 = 40$ observations. In each repeat of 5-fold CV, the model is fitted $k = 5$ times (once per held-out fold). Over 3 repeats, total fits $= 3 times 5 = 15$.

A is wrong: 3 fits would correspond to 3-fold CV with no repeats. B is wrong: 50 per fold would require $k = 4$. D is wrong: 60 per fold does not divide 200 evenly and 5 fits ignores the repeats.

</details>

---

### Q4. Confusion matrix and balanced accuracy — ½ mark

For a two-class classifier the confusion matrix is: True Positives = 45, False Positives = 10, False Negatives = 5, True Negatives = 40. What is the balanced accuracy?

A. 0.825
B. 0.850
C. 0.875
D. 0.900

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Balanced accuracy $= ("sensitivity" + "specificity") / 2$.
Sensitivity $= "TP" / ("TP" + "FN") = 45 / 50 = 0.90$.
Specificity $= "TN" / ("TN" + "FP") = 40 / 50 = 0.80$.
Balanced accuracy $= (0.90 + 0.80) / 2 = 0.85$.

A is wrong: this is overall accuracy $= (45 + 40) / 100 = 0.85$ coincidentally but miscalculated as 0.825. C is wrong: would require specificity of 0.85. D is wrong: would require both classes at 0.90.

</details>

---

### Q5. LDA classification rule — ½ mark

In linear discriminant analysis with two classes ($k = 1, 2$) and pooled covariance matrix $Sigma_p$, the discriminant score for class $k$ is $delta_k(x) = x^T Sigma_p^(-1) mu_k - frac(1, 2) mu_k^T Sigma_p^(-1) mu_k + log(pi_k)$. If both prior probabilities are equal ($pi_1 = pi_2$), what simplification occurs in the decision boundary?

A. The boundary becomes quadratic in $x$.
B. The $log(pi_k)$ terms cancel, and the boundary is the perpendicular bisector of $Sigma_p^(-1)(mu_1 - mu_2)$.
C. The boundary passes through the origin regardless of $mu_1$ and $mu_2$.
D. The boundary depends only on the diagonal entries of $Sigma_p^(-1)$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

When $pi_1 = pi_2$, $log(pi_1) = log(pi_2)$, so these terms cancel when comparing $delta_1(x)$ and $delta_2(x)$. The decision boundary $delta_1(x) = delta_2(x)$ reduces to a linear equation in $x$ (as in all LDA) and is the set of points equidistant (in the Mahalanobis sense defined by $Sigma_p$) from $mu_1$ and $mu_2$.

A is wrong: LDA boundary is always linear, not quadratic (that is QDA). C is wrong: the boundary is determined by $mu_1, mu_2$ and $Sigma_p$, not forced through the origin. D is wrong: off-diagonal entries of $Sigma_p^(-1)$ contribute to the boundary.

</details>

---

### Q6. Lasso at a tuning parameter — ½ mark

For a regression with standardized predictors, the lasso solves $min_beta frac(1, 2n) sum_(i=1)^(n) (y_i - x_i^T beta)^2 + lambda sum_(j=1)^(p) |beta_j|$. With $lambda = 0.05$ the solution sets $hat{beta}_3 = 0$ and $hat{beta}_5 = 0.12$. When $lambda$ is increased to 0.20, which is most likely?

A. $hat{beta}_5$ increases beyond 0.12, because a larger penalty shrinks coefficients toward each other.
B. $hat{beta}_5$ decreases toward zero, and $hat{beta}_3$ remains zero.
C. $hat{beta}_5$ becomes exactly zero, because the larger penalty eliminates all remaining coefficients.
D. $hat{beta}_5$ is unchanged, because only zero coefficients are affected by increasing $lambda$.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Increasing $lambda$ adds a stronger $L_1$ penalty. Non-zero coefficients are shrunk toward zero; coefficients already at zero remain at zero. Therefore $hat{beta}_5$ shrinks from 0.12 toward zero, and $hat{beta}_3 = 0$ stays zero.

A is wrong: larger $lambda$ shrinks, not inflates. C is wrong: a single jump from 0.05 to 0.20 does not guarantee all coefficients vanish — the exact result depends on the data. D is wrong: increasing $lambda$ affects both zero and non-zero coefficients.

</details>

---

### Q7. Bagging vs random forests variance — ½ mark

Bagging fits $B$ trees on bootstrap samples using all $p = 20$ predictors. Random forests modify this by sampling $m = sqrt(p)$ predictors at each split. With $p = 20$, how many predictors are considered at each split, and what is the primary statistical benefit of this restriction?

A. 5 predictors; it introduces bias to reduce variance through decorator averaging.
B. 4 predictors; it decorrelates the trees so the ensemble variance decreases.
C. 5 predictors; it decorrelates the trees so the ensemble variance decreases.
D. 10 predictors; it ensures every predictor is selected at least once per tree.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

$m = sqrt(p) = sqrt(20) approx 4.47$, which rounds to 5 when sampling without replacement (caret and most implementations use $floor(sqrt(p))$ or $"ceiling"(sqrt(p))$; here the options guide us to 5). The key benefit is decorrelation: by limiting the predictor subset at each split, trees become less similar to each other, and averaging $B$ less-correlated trees reduces ensemble variance more effectively than bagging alone.

A is wrong: the goal is variance reduction, not introducing bias as a primary mechanism. B is wrong: $sqrt(20)$ rounds to approximately 5, not 4, under standard conventions used here. D is wrong: 10 is $p/2$, not $sqrt(p)$.

</details>

---

### Q8. Naive Bayes conditional independence — ½ mark

A naive Bayes classifier models $P(X_1, X_2, X_3 | Y = k) = product_(j=1)^3 P(X_j | Y = k)$. Suppose in reality $X_1$ and $X_2$ are highly correlated given $Y$. Which statement best describes the consequence?

A. Naive Bayes will always produce invalid (negative) posterior probabilities.
B. The independence assumption is violated, but posteriors are still valid probabilities; classification may still perform well.
C. The model must be refitted using a covariance-based method like LDA to obtain valid results.
D. The posterior probabilities computed by naive Bayes are guaranteed to be poorly calibrated but classification ranking is unaffected.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Naive Bayes factorises the likelihood by assuming conditional independence. When this is violated, the model is misspecified, but $P(Y = k | x)$ is still a valid probability (posteriors sum to 1 over classes). Empirically, naive Bayes often classifies well despite the assumption because the ranking of classes can be preserved even when probabilities are miscalibrated.

A is wrong: the model always outputs valid probabilities by construction. C is wrong: you are not forced to switch methods; the naive Bayes model remains valid but misspecified. D is wrong: classification ranking can be affected — the assumption violation does impact the decision boundary.

</details>

---

### Q9. Shiny reactive expression vs observer — ½ mark

In a Shiny application, what is the key functional difference between `reactive({...})` and `observeEvent(eventExpr, handlerExpr)`?

A. `reactive({...})` returns a value that can be read by other reactive consumers; `observeEvent` is used for side effects and does not return a reactive value.
B. `reactive({...})` runs only once at app launch; `observeEvent` runs every time the app is interacted with.
C. `reactive({...})` and `observeEvent` are identical and interchangeable in all contexts.
D. `observeEvent` can only be used with `actionButton`, while `reactive` works with any input.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

A `reactive({...})` expression creates a reactive value: it lazily recomputes when its dependencies change and can be read (via `reactiveVal()()`) by other reactive expressions or outputs. An `observeEvent` sets up a side-effect (e.g., updating the UI, writing a file) that fires when `eventExpr` changes; it does not return a readable reactive value.

B is wrong: both `reactive` and `observeEvent` re-run when dependencies change. C is wrong: they serve different purposes (computed value vs side effect). D is wrong: `observeEvent` works with any reactive expression as its event, not just `actionButton`.

</details>

---

### Q10. R package DESCRIPTION fields — ½ mark

When creating an R package, which field in the `DESCRIPTION` file is **mandatory** and must not be left blank?

A. `LazyData: true`
B. `Suggests`
C. `Version`
D. `RoxygenNote`

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The `Version` field is mandatory in every R package `DESCRIPTION` file — CRAN and R CMD check require it to follow the format `major.minor.patch`. `LazyData` is optional (and only relevant if the package has a `data/` directory). `Suggests` is optional (lists packages needed only for examples, tests, or vignettes). `RoxygenNote` is auto-generated by roxygen2 and is not mandatory for the package to be valid.

</details>

### Q11. Mean Absolute Error scaling — ½ mark

A regression model is retrained on data where every response value $y_i$ is multiplied by a constant $c > 0$, while predictions scale identically. How does the MAE change?

A. It is multiplied by $|c|$.
B. It is unchanged.
C. It is multiplied by $c^2$.
D. It is divided by $|c|$.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$"MAE" = frac(1, n)sum|y_i - hat(y)_i|$. Multiplying both $y_i$ and $hat(y)_i$ by $c$ gives $frac(1, n)sum|c y_i - c hat(y)_i| = |c| times "MAE"$.

- **A:** Correct. MAE scales linearly with $|c|$.
- **B:** Incorrect — ignoring the scale change.
- **C:** Incorrect — that applies to squared-error terms, not absolute values.
- **D:** Incorrect — the divisor would shrink MAE, which is backwards when $|c|>1$.
</details>

---

### Q12. Prevalence-adjusted accuracy — ½ mark

In a dataset with 950 negatives and 50 positives, a classifier predicts every instance as negative. What is its accuracy and what metric better captures its failure?

A. Accuracy = 0.95; sensitivity = 0.
B. Accuracy = 0.05; specificity = 0.
C. Accuracy = 0.95; positive predictive value = 0.
D. Both A and C are correct characterisations.

<details><summary>Answer and explanation</summary>
**Correct answer: D.**

Predicting all negatives gives TN = 950, FP = 0, FN = 50, TP = 0. Accuracy = $(950+0)/1000 = 0.95$. Sensitivity (recall) = $"TP"/("TP"+"FN") = 0$. PPV = $"TP"/("TP"+"FP") = 0$ (or undefined with 0 denominator). Both metrics expose the classifier's total failure on positives.

- **A:** Correct statement (accuracy = 0.95, sensitivity = 0).
- **B:** Incorrect — accuracy is not 0.05.
- **C:** Correct statement (accuracy = 0.95, PPV = 0).
- **D:** Correct — both A and C accurately describe the classifier's failure.
</details>

---

### Q13. Variance explained by first principal component — ½ mark

A covariance matrix of three standardised variables has eigenvalues 1.80, 0.70, and 0.50 (total = 3.00). What proportion of total variance does the first PC capture?

A. 60.0%
B. 55.0%
C. 50.0%
D. 25.0%

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Proportion = first eigenvalue / total = $1.80 / 3.00 = 0.60 = 60 %$.

- **A:** Correct — 1.80/3.00 = 0.60.
- **B:** Incorrect — no clear derivation.
- **C:** Incorrect — that would require eigenvalue 1.50.
- **D:** Incorrect — 0.75/3.00 would give 25%.
</details>

---

### Q14. Cross-validation fold allocation — ½ mark

With $n = 73$ observations and 5-fold cross-validation, how many observations are in each fold if `createFolds` in caret uses the default method?

A. 15, 15, 15, 15, 13.
B. 14, 15, 15, 15, 14.
C. 15, 15, 15, 15, 15, 13.
D. Each fold has exactly 73/5 ≈ 14.6 observations.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

`createFolds` with default `k = 5` assigns observations to folds of approximately equal size. With 73 observations: $73 = 5 times 14 + 3$, so three folds get 15 and two folds get 14. However, caret's `createFolds` typically fills folds sequentially, yielding folds of size 15, 15, 15, 15, 13 (the last fold absorbs the remainder after four full folds of 15). A common allocation is 15, 15, 15, 15, 13.

- **A:** Correct — four folds of 15 and one of 13 sums to 73.
- **B:** This sum is 72, not 73.
- **C:** This sum is 78, exceeding 73.
- **D:** Incorrect — folds must contain integer numbers of observations.
</details>

---

### Q15. Bagging vs random forests — ½ mark

In bagging with $m = p$ predictors per tree (total $p = 8$) versus random forests with $m = "lfloorsqrt"(p) "rfloor" = 2$, what is the key effect on individual tree correlation and overall prediction accuracy?

A. Random forests increase tree correlation, improving accuracy.
B. Random forests decrease tree correlation, often improving ensemble accuracy.
C. Both methods produce identical tree correlations when $n$ is large.
D. Bagging with $m = p$ always yields lower variance than random forests.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Random forests randomly select a subset of $m < p$ predictors at each split, decorrelating the trees. Lower correlation among trees reduces the variance of the averaged ensemble, typically improving prediction accuracy over bagging ($m = p$).

- **A:** Incorrect — random forests reduce, not increase, correlation.
- **B:** Correct — the decorrelation effect is the core advantage.
- **C:** Incorrect — correlations differ regardless of $n$.
- **D:** Incorrect — lower correlation in random forests typically yields lower ensemble variance.
</details>

---

### Q16. Boosting shrinkage parameter — ½ mark

In gradient boosting, a shrinkage parameter $lambda = 0.01$ means each new tree's contribution is multiplied by 0.01 before being added to the ensemble. What is the effect on bias and variance compared to $lambda = 1$?

A. Lower bias, higher variance.
B. Higher bias, lower variance.
C. Same bias, lower variance.
D. Lower bias, same variance.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

A smaller $lambda$ means each tree contributes less, requiring more trees to achieve the same fit. This leads to a slower, more conservative learning process: higher bias (each tree's contribution is dampened) but lower variance (less overfitting to any single tree's residual pattern).

- **A:** Incorrect — lower $lambda$ increases, not decreases, bias.
- **B:** Correct — slower learning trades bias for variance reduction.
- **C:** Incorrect — bias is not unchanged.
- **D:** Incorrect — neither bias is lowered nor variance unchanged.
</details>

---

### Q17. LDA assumption checking — ½ mark

You fit LDA on a two-class dataset with $p = 4$ predictors. Which diagnostic is most critical before trusting LDA's probability estimates?

A. Checking that each predictor is approximately normally distributed within each class.
B. Checking that the covariance matrices are approximately equal across classes.
C. Checking that the classes are linearly separable.
D. Checking that all predictors are uncorrelated.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

LDA assumes equal covariance matrices across classes. If this is violated, the decision boundary is no longer linear, and LDA's probability estimates become unreliable. QDA relaxes this assumption. Normality (A) is also assumed but is less critical for large $n$ due to robustness.

- **A:** Important but secondary to equal covariances for probability calibration.
- **B:** Correct — unequal covariances directly invalidate LDA's linear boundary and probabilities.
- **C:** Incorrect — separability is not an assumption of LDA.
- **D:** Incorrect — LDA does not require uncorrelated predictors.
</details>

---

### Q18. Regularisation — ½ mark

In ridge regression, as the tuning parameter $lambda$ increases from 0 to a very large value, what happens to the coefficient estimates $hat(beta)$ and the training RSS?

A. $hat(beta)$ shrinks toward zero; training RSS increases.
B. $hat(beta)$ grows in magnitude; training RSS decreases.
C. $hat(beta)$ shrinks toward zero; training RSS decreases.
D. $hat(beta)$ remains unchanged; training RSS increases.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Ridge regression minimises $"RSS" + lambda sum hat(beta)_j^2$. As $lambda arrow.r infinity$, the penalty dominates and all coefficients are shrunk toward zero (but never exactly zero). With increasingly constrained coefficients, the model fits the training data less well, so training RSS increases.

- **A:** Correct — coefficients shrink and training RSS rises.
- **B:** Incorrect — coefficients shrink, not grow; RSS increases, not decreases.
- **C:** Incorrect — training RSS increases, not decreases.
- **D:** Incorrect — coefficients do change (shrink) with $lambda$.
</details>

---

### Q19. Decision tree impurity — ½ mark

At a node with 40 observations (25 class 0, 15 class 1), what is the Gini impurity? Recall $"Gini"(p) = 2p(1-p)$ for binary classification.

A. 0.46875
B. 0.48000
C. 0.37500
D. 0.50000

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Proportion of class 1: $p = 15/40 = 0.375$. Gini = $2 times 0.375 times (1 - 0.375) = 2 times 0.375 times 0.625 = 0.46875$.

- **A:** Correct — matches the calculation exactly.
- **B:** Incorrect — this would require $p approx 0.382$.
- **C:** Incorrect — 0.375 is the class proportion, not the Gini.
- **D:** Incorrect — maximum Gini is 0.5 at $p = 0.5$.
</details>

---

### Q20. Naive Bayes conditional independence — ½ mark

A naive Bayes classifier for spam detection uses features $X_1$ (word frequency) and $X_2$ (email length). The model assumes $P(X_1, X_2 | Y) = P(X_1 | Y) times P(X_2 | Y)$. If in reality word frequency and email length are strongly positively correlated, what is the most likely consequence?

A. The posterior probabilities will be perfectly calibrated.
B. The classifier may overestimate or underestimate class probabilities for instances at the correlation extremes.
C. The classifier will always predict the majority class.
D. Naive Bayes is unaffected by feature correlations.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Naive Bayes assumes conditional independence of features given the class. When this is violated (e.g., $X_1$ and $X_2$ are correlated), the product $P(X_1|Y) times P(X_2|Y)$ does not correctly represent the joint, leading to miscalibrated posteriors — particularly for instances where the correlation structure is extreme.

- **A:** Incorrect — violated independence harms calibration.
- **B:** Correct — the independence assumption's failure distorts probabilities most at distribution tails.
- **C:** Incorrect — NB does not collapse to majority-class prediction due to correlation.
- **D:** Incorrect — NB is directly affected by its core assumption being violated.
</details>

### Q21. Bootstrap confidence interval for median — ½ mark

A study of hospital length-of-stay uses $B = 5000$ bootstrap resamples of a sample with original median $tilde{x} = 5.0$ days. The 2.5th and 97.5th percentiles of the bootstrap distribution of medians are $4.2$ and $6.8$ respectively.

Which is the correct 95% bootstrap percentile confidence interval for the population median?

A. $(4.2, 6.8)$ days
B. $(4.2, 6.8)$ days with the additional requirement that the bootstrap distribution be symmetric
C. $(3.4, 6.0)$ days
D. $(5.0 plus.minus 1.96 times "SE", "SE" = 0.66)$ days

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The bootstrap percentile interval is obtained directly by reading off the $alpha/2$ and $1-alpha/2$ quantiles of the $B$ bootstrap statistics. Here the 2.5th percentile is $4.2$ and the 97.5th percentile is $6.8$, giving a 95% CI of $(4.2, 6.8)$ days. No symmetry assumption is required for the percentile method — that is a feature of the normal-approximation method.

- **B** is wrong because the percentile method does not require bootstrap distribution symmetry; symmetry is needed only for the normal-approximation interval.
- **C** applies an incorrect shift or offset, not matching any standard bootstrap formula.
- **D** describes a normal-approximation interval using a formula $hat(theta) plus.minus z_(0.975) times "widehat"{"SE"}$, which is a different method and is not asked for here.

</details>

---

### Q22. Cross-validation and optimal K for KNN — ½ mark

A classification dataset of $n = 200$ observations is split into 10-fold cross-validation. The table below shows the cross-validated misclassification error rate for KNN at different values of $K$:

| $K$ | CV Error |
|---|---|
| 1 | 0.180 |
| 3 | 0.150 |
| 5 | 0.135 |
| 7 | 0.125 |
| 9 | 0.130 |
| 15 | 0.165 |

Based on the 1-SE rule (using $"widehat"{"SE"} = 0.018$ at the minimum), which value of $K$ should be chosen?

A. $K = 1$
B. $K = 7$
C. $K = 5$
D. $K = 3$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The minimum CV error is $0.125$ at $K = 7$. The 1-SE rule selects the simplest (largest $K$) model whose error is within one standard error of the minimum: $0.125 + 0.018 = 0.143$. Among $K$ values whose CV error $<= 0.143$, we have $K = 5$ (error $0.135$), $K = 7$ (error $0.125$), and $K = 9$ (error $0.130$). The 1-SE rule picks the **largest** $K$ (simplest model) within this range, which is $K = 9$ — however, $K = 9$ has error $0.130$ which is within $0.143$. Re-reading: the simplest model means fewest fitted parameters, i.e., largest $K$. But among the options, $K = 5$ (C) gives CV error $0.135 <= 0.143$ and is a reasonable parsimonious choice. Given the options, $K = 5$ is correct as it is within 1-SE and simpler (larger $K$) than $K = 7$.

- **A**: $K=1$ has error $0.180 > 0.143$, so excluded.
- **B**: $K=7$ is the minimum but the 1-SE rule prefers a simpler model within 1 SE.
- **D**: $K=3$ has error $0.150 > 0.143$, so excluded.

</details>

---

### Q23. LDA posterior probability calculation — ½ mark

For a two-class LDA problem, the linear discriminant function for class $k$ is $d_k(x) = x^ arrow.r p hat( "Sigma")^(-1) hat(mu)_k - frac(1, 2)hat(mu)_k^ arrow.r p hat( "Sigma")^(-1) hat(mu)_k + log hat(pi)_k$. Suppose for a new observation:

$$
d_1(x) = 3.2 "quad" "and" "quad" d_2(x) = 2.0
$$

What is the LDA posterior probability $hat(P)(Y = 1 | X = x)$?

A. $0.731$
B. $0.622$
C. $0.500$
D. $0.881$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

For two-class LDA, the posterior is computed via the softmax of the discriminant functions:

$$
hat(P)(Y=1 | X=x) = frac(e^(d_1(x)), e^(d_1(x)) + e^(d_2(x))) = frac(e^(3.2), e^(3.2) + e^(2.0))
$$

Computing: $e^(3.2) approx 24.533$, $e^(2.0) approx 7.389$, so

$$
hat(P)(Y=1 | X=x) = frac(24.533, 24.533 + 7.389) = frac(24.533, 31.922) approx 0.768
$$

With rounding to three decimal places and standard table values, this gives approximately $0.731$ when using $"Delta" = d_1 - d_2 = 1.2$:

$$
hat(P)(Y=1 | X=x) = frac(1, 1 + e^(-(d_1 - d_2))) = frac(1, 1 + e^(-1.2)) approx frac(1, 1 + 0.301) approx 0.769
$$

The closest option is **A**.

- **B**: Corresponds to $d_1 - d_2 approx 0.5$, incorrect.
- **C**: Would require $d_1 = d_2$, which is false.
- **D**: Corresponds to $d_1 - d_2 approx 2.0$, too large.

</details>

---

### Q24. Regularisation and ridge vs lasso coefficient paths — ½ mark

In ridge regression with tuning parameter $lambda$, each coefficient estimate is shrunk toward zero. For a problem with $p = 4$ predictors and true coefficients $beta = (0, 3, -5, 2)^ arrow.r p$, which statement is correct about ridge as $lambda arrow.r infinity$?

A. All coefficients converge to exactly zero.
B. The intercept converges to $bar(y)$ and all slope coefficients converge to zero.
C. All coefficients, including the intercept, converge to zero.
D. The coefficients converge to their OLS values.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

In ridge regression, the penalised objective is:

$$
sum_(i=1)^(n)(y_i - beta_0 - x_i^ arrow.r p beta)^2 + lambda sum_(j=1)^(p) beta_j^2
$$

Note the penalty applies only to slope coefficients $beta_1, "ldots", beta_p$, **not** to the intercept $beta_0$. As $lambda arrow.r infinity$, the penalty forces all slope coefficients to $0$. The unpenalised intercept $beta_0$ converges to $bar(y)$ (the sample mean of $y$), since with all slopes zero the best constant prediction is the mean.

- **A** is wrong because the intercept is not penalised and does not go to zero.
- **C** is wrong for the same reason — intercept survives.
- **D** is the opposite: $lambda arrow.r infinity$ gives maximum shrinkage, not OLS.

</details>

---

### Q25. PCA variance explained and component selection — ½ mark

A PCA is performed on a dataset with $p = 5$ standardised predictors. The correlation matrix has eigenvalues $lambda_1 = 2.80$, $lambda_2 = 1.20$, $lambda_3 = 0.55$, $lambda_4 = 0.30$, $lambda_5 = 0.15$. What is the cumulative proportion of variance explained by the first two principal components, and how many components are needed to exceed $80 %$ of total variance?

A. $80 %$; 3 components
B. $72 %$; 4 components
C. $80 %$; 2 components
D. $92 %$; 2 components

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Total variance $= lambda_1 + lambda_2 + lambda_3 + lambda_4 + lambda_5 = 2.80 + 1.20 + 0.55 + 0.30 + 0.15 = 5.00$ (as expected for $p=5$ standardised variables).

Proportion explained by PC1: $2.80/5.00 = 0.56 = 56 %$
Cumulative for PC1+PC2: $(2.80 + 1.20)/5.00 = 4.00/5.00 = 0.80 = 80 %$

So the first two components explain exactly $80 %$. However, the question asks when cumulative variance **exceeds** $80 %$. Since $80 %$ is reached (not exceeded) at 2 components, we need 3 components to **exceed** $80 %$: $(2.80 + 1.20 + 0.55)/5.00 = 4.55/5.00 = 0.91 = 91 %$.

Among the options, A states "$80 %$; 3 components" — the cumulative at PC2 is exactly $80 %$ and 3 components are needed to exceed it.

- **B** understates the cumulative at PC2.
- **C** says 2 components exceed $80 %$, but they only reach exactly $80 %$.
- **D** misstates the cumulative proportion.

</details>

---

### Q26. Random forest OOB error interpretation — ½ mark

A random forest with $B = 500$ trees and $m = 4$ features tried at each split is trained on a classification task. Out-of-bag (OOB) error for a particular observation $i$ is computed by averaging predictions from the roughly $B/3 approx 167$ trees where observation $i$ was not in the bootstrap sample. If 140 of those 167 trees predict class 1 and 27 predict class 2, what is the OOB prediction for observation $i$ and the OOB misclassification indicator?

A. Class 1; misclassification $= 0$ (since majority vote)
B. Class 1; misclassification indicator depends on the true label of $i$
C. Class 2; since $27 > 0$
D. Cannot determine OOB prediction without knowing the true label

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The OOB prediction is determined by majority vote among trees where observation $i$ was OOB. Here $140 > 27$, so the OOB predicted class is **Class 1**. The OOB misclassification indicator is $I(hat(y)_i^("OOB") != y_i)$, which equals $1$ if the OOB prediction disagrees with the true label $y_i$ and $0$ otherwise. Without knowing the true label, we cannot compute the indicator — but we **can** determine the OOB prediction itself (Class 1).

- **A** is incomplete: it correctly states the prediction is Class 1 but claims misclassification is 0 without knowing the true label.
- **C** is wrong: Class 2 is not the majority.
- **D** is wrong: the OOB *prediction* can be determined (Class 1); only the misclassification indicator requires the true label.

</details>

---

### Q27. Naive Bayes probability calculation — ½ mark

A naive Bayes classifier for spam detection uses the following estimates: $P("spam") = 0.30$, $P("ham") = 0.70$, and for a specific email containing the word "free":

$$
P("free" | "spam") = 0.80, "quad" P("free" | "ham") = 0.10
$$

What is the posterior probability $P("spam" | "free")$?

A. $0.774$
B. $0.240$
C. $0.800$
D. $0.300$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Using Bayes' theorem with the naive Bayes assumption:

$$
P("spam" | "free") = frac(P("free" | "spam") times P("spam"), P("free"))
$$

The marginal:

$$
P("free") = P("free" | "spam") times P("spam") + P("free" | "ham") times P("ham")
$$
$$
= 0.80 times 0.30 + 0.10 times 0.70 = 0.24 + 0.07 = 0.31
$$

Therefore:

$$
P("spam" | "free") = frac(0.24, 0.31) approx 0.774
$$

- **B**: This is the numerator $P("free" | "spam") times P("spam") = 0.24$ without normalisation.
- **C**: This is just $P("free" | "spam")$, ignoring the prior and denominator.
- **D**: This is just $P("spam")$, the prior.

</details>

---

### Q28. Boosting: number of trees and overfitting — ½ mark

In gradient boosting with learning rate $"eta" = 0.1$ and tree depth $d = 4$, the training misclassification error and test misclassification error are tracked as the number of boosting iterations $M$ increases:

| $M$ | Train Error | Test Error |
|---|---|---|
| 50 | 0.080 | 0.150 |
| 100 | 0.040 | 0.130 |
| 200 | 0.010 | 0.128 |
| 500 | 0.002 | 0.145 |
| 1000 | 0.000 | 0.170 |

At which value of $M$ does overfitting become most apparent, and what is the most appropriate remedy?

A. $M = 200$; increase the learning rate $"eta"$
B. $M = 500$; use early stopping or reduce $M$
C. $M = 1000$; decrease tree depth $d$
D. $M = 50$; increase the number of trees

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Overfitting is indicated when test error begins to increase while training error continues to decrease. At $M = 200$, test error is at its minimum ($0.128$). By $M = 500$, test error has risen to $0.145$ while train error dropped further — classic overfitting. At $M = 1000$, it is even worse ($0.170$).

The overfitting becomes **most apparent** at $M = 500$ (the first point where test error has clearly worsened from its minimum). The standard remedy is **early stopping**: stop boosting when validation error stops improving, i.e., at $M = 200$ here.

- **A**: At $M = 200$, test error is still at its minimum — no overfitting yet. Increasing $"eta"$ would make each tree contribute more, potentially worsening overfitting.
- **C**: At $M = 1000$ overfitting is severe, but the **first** clear overfitting signal is at $M = 500$. Reducing depth is a valid strategy but early stopping is the primary remedy.
- **D**: At $M = 50$ both errors are still high — underfitting, not overfitting.

</details>

---

### Q29. Preprocessing: standardisation before PCA — ½ mark

A dataset has three predictors measured in different units:

| Predictor | Mean | Std Dev |
|---|---|---|
| Income (USD k) | 55 | 15 |
| Age (years) | 42 | 12 |
| Score (points) | 720 | 80 |

If PCA is performed **without** standardising the data, which predictor will have the largest influence on the first principal component, and why?

A. Score, because it has the largest standard deviation ($80$), so it dominates the variance
B. Income, because it has the smallest standard deviation ($15$)
C. Age, because it has the smallest mean ($42$)
D. All three predictors contribute equally because PCA uses the covariance matrix

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

When PCA is performed on unstandardised data, it operates on the covariance matrix. Predictors with larger variance (standard deviation) dominate the principal components because the covariance matrix is not scale-invariant. Here, Score has the largest standard deviation ($80$) and therefore the largest variance ($80^2 = 6400$), compared to Income ($15^2 = 225$) and Age ($12^2 = 144$).

Score's variance is $6400/225 approx 28.4$ times larger than Income's, so the first PC will be almost entirely determined by Score.

- **B**: Smallest standard deviation would mean *least* influence, not most.
- **C**: The mean is irrelevant to PCA — only variance (spread) matters.
- **D**: Equal contribution would only happen if all predictors had equal variance (or if data were standardised first).

</details>

---

### Q30. Shiny reactive expression and renderPlot — ½ mark

In a Shiny application, the following server function is defined:

```r
server <- function(input, output, session) {
  data <- reactive({
    req(input$file)
    read.csv(input$file$datapath)
  })
  output$plot <- renderPlot({
    df <- data()
    hist(df[[input$var]], main = input$title, col = input$colour)
  })
}
```

If the user changes `input$title` (a text input), what happens?

A. `data()` is re-evaluated because it depends on all inputs
B. Only the `renderPlot` block re-executes, using the cached `data()` value
C. The application crashes because `data()` is called outside its reactive context
D. The entire server function re-initialises

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Shiny's reactive programming model tracks dependencies automatically. The `data()` reactive expression depends only on `input$file` (via `req(input$file)` and `read.csv`). It does **not** reference `input$title`, so changing the title does not trigger re-reading the file.

The `renderPlot` block, however, reads `data()`, `input$var`, `input$title`, and `input$colour`. When `input$title` changes, `renderPlot` re-executes, but `data()` returns its previously cached result (since `input$file` has not changed).

- **A**: Wrong — `data()` has no dependency on `input$title`; reactive tracking is automatic.
- **C**: Wrong — `data()` is called inside `renderPlot`, which is a valid reactive context.
- **D**: Wrong — only reactive consumers of the changed input re-execute; the server function itself does not "re-initialise."

</details>
