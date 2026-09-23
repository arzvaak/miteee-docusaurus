---
title: "Midsem MCQ Mock Test 1"
math_syntax: typst
---

# Midsem MCQ Mock Test 1

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** Balanced syllabus coverage  
> Use [Formula and Methods](/notes/studies-cra-4412-advanced-data-science-part-iii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4412-advanced-data-science-part-iii-questions-from-class-material). Attempt every question before expanding its answer.

---

### Q1. Bias–variance trade-off — ½ mark

A regression model is trained on a dataset where the true relationship is linear. You fit a very flexible method and observe training MSE of $0.5$ but test MSE of $12.3$. A simple linear regression gives training MSE of $3.8$ and test MSE of $4.1$. What is the primary reason the flexible model has higher test MSE despite lower training MSE?

A. The flexible model suffers from high variance due to overfitting the training noise.
B. The flexible model has high bias because it cannot capture the true linear form.
C. The flexible model was trained on fewer observations than the linear model.
D. The flexible model requires regularisation which was not applied.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The true relationship is linear, but the flexible method fits the training noise, achieving very low training MSE ($0.5$) yet poor generalisation (test MSE $12.3$). This is classic overfitting: the model has low bias but high variance. The linear model achieves test MSE $4.1$ — close to its training MSE — indicating it generalises well because it matches the true form.

- A: correct — overfitting produces high variance and a large train–test gap.
- B: incorrect — the flexible model has *low* bias (it can represent linear functions), but high variance.
- C: nothing in the scenario states different sample sizes; both use the same data.
- D: regularisation could help, but the *primary* reason for the gap is overfitting (variance), not the absence of regularisation per se.
</details>

---

### Q2. Confusion matrix — ½ mark

A medical test for a rare disease (prevalence $2 %$) has sensitivity $0.95$ and specificity $0.90$. If $1000$ people are tested, how many are expected to receive a **false positive** result?

A. $2$
B. $18$
C. $98$
D. $19$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

With $1000$ people and $2 %$ prevalence: $20$ are truly diseased, $980$ are healthy. False positives $= (1 - 0.90) times 980 = 0.10 times 980 = 98$.

- A ($2$): confusion with false negatives ($0.05 times 20 = 1$) or disease count.
- B ($18$): likely a miscalculation using 80% specificity or wrong prevalence.
- C ($98$): correct — $0.10 times 980 = 98$.
- D ($19$): off-by-one arithmetic error or prevalence confusion.
</details>

---

### Q3. k-fold cross-validation — ½ mark

You run 10-fold cross-validation on a dataset of $n = 500$ observations. Each fold holds out $50$ observations for testing and trains on $450$. If you instead use 5-fold CV, how many observations does each fold train on?

A. $100$
B. $400$
C. $450$
D. $250$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

With 5-fold CV on $500$ observations, each fold holds out $500 / 5 = 100$ for testing and trains on $500 - 100 = 400$.

- A ($100$): this is the test set size per fold, not the training size.
- B ($400$): correct — $n - n/k = 500 - 100 = 400$.
- C ($450$): this is the training size under 10-fold CV, not 5-fold.
- D ($250$): confusion with half the data.
</details>

---

### Q4. Preprocessing — ½ mark

You are building a model using predictors measured on different scales: income ($"USD" 20{,}000$–$"USD" 150{,}000$), age ($18$–$80$), and cholesterol ($120$–$320$). Which preprocessing step is most critical before applying $k$-nearest neighbours?

A. Log-transform all predictors to reduce skewness.
B. Standardise all predictors to have mean $0$ and standard deviation $1$.
C. Apply PCA to reduce the three predictors to one component.
D. Convert all predictors to ranks.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$k$-NN uses Euclidean distance, so predictors with larger scales dominate the distance calculation. Income ranges over $130{,}000$ while age ranges over $62$ — without standardisation, income would overwhelmingly drive neighbour selection. Standardising ensures each predictor contributes equally to the distance metric.

- A: log-transforms address skewness but do not equalise scales across predictors.
- B: correct — standardisation is essential for distance-based methods.
- C: PCA reduces dimensionality but changes interpretability; standardisation is the more fundamental fix.
- D: rank transformation is non-parametric and loses magnitude information; standardisation is preferred.
</details>

---

### Q5. PCA interpretation — ½ mark

You perform PCA on a dataset with 5 predictors. The first two principal components have loadings as shown:

| Predictor | PC1 loading | PC2 loading |
|-----------|-------------|-------------|
| $X_1$ | $0.48$ | $-0.12$ |
| $X_2$ | $0.47$ | $-0.15$ |
| $X_3$ | $0.46$ | $-0.10$ |
| $X_4$ | $0.05$ | $0.68$ |
| $X_5$ | $0.03$ | $0.69$ |

Which interpretation is most appropriate?

A. PC1 contrasts $X_4, X_5$ against $X_1, X_2, X_3$; PC2 is a contrast within $X_4$ and $X_5$.
B. PC1 represents an average of the first three predictors; PC2 primarily captures $X_4$ and $X_5$.
C. PC1 is dominated by $X_1$–$X_3$; PC2 contrasts $X_4$ against $X_5$.
D. PC1 and PC2 together explain less than $50 %$ of the variance.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

PC1 has large, similar positive loadings on $X_1$, $X_2$, $X_3$ ($0.48$, $0.47$, $0.46$) and near-zero loadings on $X_4$, $X_5$. This makes PC1 roughly a weighted average of the first three predictors. PC2 has large positive loadings on $X_4$ ($0.68$) and $X_5$ ($0.69$) with small loadings on the rest, so it primarily captures variation in $X_4$ and $X_5$.

- A: PC1 does not contrast — all three loadings are positive, not mixed signs.
- B: correct — PC1 is an average of $X_1$–$X_3$; PC2 captures $X_4$/$X_5$.
- C: PC2 loadings on $X_4$ and $X_5$ are both positive ($0.68$, $0.69$), not a contrast.
- D: we cannot determine variance explained from loadings alone; eigenvalues are needed.
</details>

---

### Q6. Bagging vs random forests — ½ mark

You train a bagged tree ensemble and a random forest (with $m = sqrt(p)$) on the same dataset. Both use $500$ bootstrap trees. Which statement is **true**?

A. Random forests have lower variance than bagging because tree correlation is reduced by random predictor subsetting.
B. Random forests have higher bias than bagging because considering fewer predictors at each split weakens each tree.
C. Bagging has lower variance than random forests because each tree is trained on the full predictor set.
D. Both methods produce identical predictions because they both use bootstrap aggregation.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Bagging builds decorrelated trees via bootstrap sampling, but each split still considers all $p$ predictors, so trees remain correlated. Random forests add random predictor subsetting at each split, which further decorrelates the trees. Since ensemble variance depends on both individual tree variance and inter-tree correlation, reducing correlation lowers overall variance.

- A: correct — random subsetting decorrelates trees, reducing ensemble variance.
- B: random forests do not have higher bias; the bias is similar to bagging.
- C: bagging has *higher* variance precisely because all predictors are available, keeping trees more correlated.
- D: the two methods produce different predictions due to the random subsetting step.
</details>

---

### Q7. Boosting — ½ mark

In gradient boosting, you fit trees sequentially where each new tree is trained on the residuals of the current ensemble. You notice that as the number of trees increases from $50$ to $5000$, the training error continues to decrease but the test error starts increasing after $200$ trees. What should you do?

A. Increase the learning rate $"eta"$ to allow each tree to contribute more.
B. Increase the depth of each tree to capture more complex patterns.
C. Use early stopping or shrinkage (smaller $"eta"$ with more trees) to prevent overfitting.
D. Switch to a single large tree to avoid the sequential overfitting problem.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

The pattern of decreasing training error but increasing test error after $200$ trees is textbook overfitting in boosting. Early stopping (halting at $200$ trees) prevents the model from fitting noise. Alternatively, using a smaller learning rate with more trees (shrinkage) allows finer adjustments without overshooting.

- A: a larger $"eta"$ would make each tree contribute more aggressively, worsening overfitting.
- B: deeper trees increase model complexity, exacerbating the overfitting problem.
- C: correct — early stopping or shrinkage addresses overfitting directly.
- D: a single tree is an underfit; boosting's power lies in sequential combination.
</details>

---

### Q8. LDA vs naive Bayes — ½ mark

Both LDA and naive Bayes assume Gaussian class-conditional densities. What is the key structural difference between the two methods?

A. LDA assumes a shared covariance matrix across classes; naive Bayes assumes diagonal class-specific covariance matrices.
B. LDA assumes diagonal covariance; naive Bayes assumes full covariance.
C. LDA assumes equal class priors; naive Bayes estimates priors from the data.
D. LDA is a generative method; naive Bayes is a discriminative method.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

LDA models each class as Gaussian with a **common full** covariance matrix $"Sigma"$ shared across all $K$ classes. Naive Bayes models each class as Gaussian with a **diagonal** covariance matrix, and these diagonals can differ across classes. LDA captures correlations between features (via full $"Sigma"$) but assumes they are the same everywhere; naive Bayes ignores feature correlations entirely but allows per-class variances.

- A: correct — LDA shares a full covariance; naive Bayes uses diagonal, class-specific covariances.
- B: reversed — LDA uses full covariance; naive Bayes uses diagonal.
- C: both methods estimate priors from data; neither assumes equal priors.
- D: both are generative methods that model $P(X | Y)$.
</details>

---

### Q9. Lasso — ½ mark

You fit a Lasso regression with penalty parameter $lambda$. As $lambda$ increases from $0$ to a very large value, what happens to the number of non-zero coefficients and the training RSS?

A. The number of non-zero coefficients increases; training RSS increases.
B. The number of non-zero coefficients decreases; training RSS increases.
C. The number of non-zero coefficients remains constant; training RSS decreases.
D. The number of non-zero coefficients increases; training RSS decreases.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The Lasso objective minimises $"RSS"/2 + lambda sum_j |hat(beta)_j|$. At $lambda = 0$, this is OLS (maximum non-zero coefficients, minimum RSS). As $lambda$ grows, the $L_1$ penalty shrinks coefficients toward zero and forces some to exactly zero, reducing the number of non-zero coefficients. With fewer active predictors, the model fits the training data less well, so RSS increases.

- A: increasing $lambda$ shrinks, not increases, the number of non-zero coefficients.
- B: correct — more coefficients set to zero, higher training RSS.
- C: Lasso explicitly changes the number of non-zero coefficients as $lambda$ varies.
- D: both claims are backwards — coefficients decrease, RSS increases.
</details>

---

### Q10. Clustering — ½ mark

You run $k$-means with $k = 4$ on a dataset and obtain within-cluster sum of squares (WSS) of $2400$. You then run $k$-means with $k = 5$ and obtain WSS of $1900$. You also run it with $k = 6$ and obtain WSS of $1650$. Using the elbow method, which value of $k$ is the most reasonable choice?

A. $k = 4$, because the WSS is the largest and captures the most variance.
B. $k = 5$, because the marginal decrease from $k = 4$ to $k = 5$ ($500$) is much larger than from $k = 5$ to $k = 6$ ($250$).
C. $k = 6$, because it has the lowest WSS and therefore the best clustering.
D. $k = 5$, because the BIC is minimised at that point.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The elbow method looks for the point where the marginal decrease in WSS slows sharply. From $k = 4$ to $k = 5$, WSS drops by $2400 - 1900 = 500$. From $k = 5$ to $k = 6$, it drops by only $1900 - 1650 = 250$. The "elbow" is at $k = 5$ because adding a fifth cluster yields a large improvement, but a sixth cluster yields diminishing returns.

- A: a larger WSS means worse clustering, not better.
- B: correct — the largest marginal drop occurs at $k = 5$, indicating the elbow.
- C: WSS always decreases with $k$; the lowest WSS does not mean the best balance of fit and parsimony.
- D: $k$-means does not use BIC; the elbow method is based on WSS marginal decreases.
</details>

I cannot write files. I will just output the final Markdown packet directly in my response.

---

### Q11. Stratified partition ratio — ½ mark

A dataset has 300 "Yes" and 100 "No" cases. You call `createDataPartition(y, p = 0.75, list = FALSE)` to form a training set. Approximately how many "Yes" and "No" cases appear in training?

A. 225 Yes, 75 No
B. 300 Yes, 100 No
C. 150 Yes, 50 No
D. 210 Yes, 80 No

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

`createDataPartition` with `p = 0.75` samples approximately 75% from each stratum. Training "Yes": $300 times 0. 75 = 225$. Training "No": $100 times 0. 75 = 75$. The method preserves class proportions (stratified sampling), so each class is reduced by the same fraction.

- **B.** This is the full dataset, not a 75% split.
- **C.** Uses $p = 0.50$ instead of $p = 0.75$.
- **D.** A non-stratified split of the full 400 would give ~300 total, but the class-specific counts 210/80 imply unequal retention, inconsistent with stratified sampling.

</details>

---

### Q12. RMSE vs MAE interpretation — ½ mark

A regression model produces a test set with residuals $r_i = y_i -hat(y)_i$. You compute $"RMSE" = 4.2$ and $"MAE" = 2.8$. What does this gap most likely indicate?

A. The model overfits the training data.
B. There are a few large-error outliers inflating the squared-error metric.
C. The target variable has been log-transformed incorrectly.
D. The model has high bias and low variance.

<details><summary>Answer and explanation</summary>

**Correct answer: B.**

$"RMSE" = sqrt(frac(1, n) sum r_i^2)$ penalises large errors quadratically, while $"MAE" = frac(1, n) sum | r_i |$ treats all errors linearly. When $"RMSE" > "MAE"$, the squared term amplifies a small number of large residuals, pointing to outlier-driven error. The ratio $4.2 / 2.8 = 1.5$ is notably above 1.

- **A.** Overfitting manifests as low training error vs. high test error, not as a gap between RMSE and MAE on one test set.
- **C.** An incorrect transformation shifts the error scale but does not selectively inflate RMSE relative to MAE.
- **D.** High bias produces uniformly large errors, yielding a small RMSE–MAE gap; low variance concerns stability across resamples.

</details>

---

### Q13. Confusion matrix sensitivity — ½ mark

A binary classifier yields the following confusion matrix on test data:

|                | Predicted Pos | Predicted Neg |
|----------------|---------------|---------------|
| **Actual Pos** | 40            | 10            |
| **Actual Neg** | 5             | 45            |

What is the sensitivity (recall) and the positive predictive value (precision)?

A. Sensitivity = 0.80, PPV = 0.89
B. Sensitivity = 0.90, PPV = 0.80
C. Sensitivity = 0.89, PPV = 0.80
D. Sensitivity = 0.45, PPV = 0.90

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

Sensitivity = $frac(T P, T P + F N) = frac(40, 40 + 10) = 0. 80$. PPV = $frac(T P, T P + F P) = frac(40, 40 + 5) = frac(40, 45) approx 0. 889$.

- **B.** Swaps sensitivity and PPV — sensitivity uses the actual-positive row, PPV uses the predicted-positive column.
- **C.** Same swap as B with the values reversed.
- **D.** Computes specificity ($45/50 = 0.90$) and NPV, not the requested quantities.

</details>

---

### Q14. K-fold CV average MSE — ½ mark

A 10-fold cross-validation of a linear model reports per-fold test MSE values: 12, 14, 11, 15, 13, 12, 16, 11, 14, 13. What is the CV-estimated MSE and its standard error?

A. $"MSE"_("CV") = 13.1$, $"SE" approx 0. 51$
B. $"MSE"_("CV") = 13.0$, $"SE" approx 0. 45$
C. $"MSE"_("CV") = 13.1$, $"SE" approx 1. 60$
D. $"MSE"_("CV") = 13.5$, $"SE" approx 0. 51$

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

Mean: $bar(e) = frac(131, 10) = 13. 1$. Deviations: $-1.1, 0.9, -2.1, 1.9, -0.1, -1.1, 2.9, -2.1, 0.9, -0.1$. Sum of squared deviations = $24.9$. Sample variance: $s^2 = frac(24. 9, 9) approx 2. 767$. Standard error: $"SE" = frac(s, sqrt(10)) = sqrt(frac(2. 767, 10)) = sqrt(0. 2767) approx 0. 526 approx 0. 51$.

- **B.** Wrong mean — the sum is 131, not 130.
- **C.** Uses $s approx 1. 66$ directly instead of dividing by $sqrt(10)$.
- **D.** Incorrect mean, likely a transcription error from the data.

</details>

---

### Q15. PCA variance explained — ½ mark

A dataset has 5 standardised numeric predictors. PCA yields eigenvalues $lambda_1 = 2. 8$, $lambda_2 = 1. 3$, $lambda_3 = 0. 5$, $lambda_4 = 0. 3$, $lambda_5 = 0. 1$. What proportion of total variance do the first two components capture, and how many components are needed to exceed 80%?

A. 82.0%; need 2 components
B. 72.7%; need 3 components
C. 56.0%; need 4 components
D. 96.0%; need 5 components

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

Total variance = $2.8 + 1.3 + 0.5 + 0.3 + 0.1 = 5.0$. PC1 alone: $frac(2. 8, 5. 0) = 0. 560$. PC1 + PC2: $frac(4. 1, 5. 0) = 0. 820 = 82. 0 %$, which exceeds 80%. Only 2 components needed.

- **B.** 72.7% does not match any cumulative proportion from these eigenvalues.
- **C.** 56.0% is PC1 alone; 4 components far exceeds what is needed.
- **D.** 96.0% would require all 5 components; no proper subset gives this total.

</details>

---

### Q16. Decision tree Gini split — ½ mark

A classification node has 200 cases: 120 Class A, 80 Class B. After a binary split, the left child has 100 cases (80 A, 20 B) and the right child has 100 cases (40 A, 60 B). What is the parent Gini, the weighted child Gini, and the improvement?

A. Parent 0.480; weighted 0.400; improvement 0.080
B. Parent 0.480; weighted 0.320; improvement 0.160
C. Parent 0.500; weighted 0.420; improvement 0.080
D. Parent 0.420; weighted 0.340; improvement 0.080

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

Parent: $G_p = 1 -(frac(120, 200))^2 -(frac(80, 200))^2 = 1 -0. 36 -0. 16 = 0. 48$. Left child: $G_L = 1 - 0.64 - 0.04 = 0.32$. Right child: $G_R = 1 - 0.16 - 0.36 = 0.48$. Weighted: $frac(100, 200) (0. 32) + frac(100, 200) (0. 48) = 0. 16 + 0. 24 = 0. 40$. Improvement: $0.48 - 0.40 = 0.08$.

- **B.** Weighted Gini of 0.32 matches only the left child, ignoring the right.
- **C.** Parent Gini of 0.50 would require equal class proportions (100/100), not 120/80.
- **D.** Parent Gini of 0.42 does not match the stated class frequencies.

</details>

---

### Q17. Boosting learning rate effect — ½ mark

You train a boosted tree model (`gbm`) with 500 iterations. Doubling the learning rate (shrinkage) from 0.01 to 0.02 while keeping all other parameters fixed, what is the expected effect on bias and variance?

A. Bias decreases, variance increases; risk of overfitting rises.
B. Bias increases, variance decreases; model becomes smoother.
C. Both bias and variance decrease equally.
D. No change — learning rate only affects training speed.

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

The learning rate $lambda$ scales each tree's contribution: $f_m = f_(m -1) + lambda, h_m (x)$. A larger $lambda$ gives each tree more influence, so the ensemble fits the training data more aggressively in the same 500 iterations. This reduces bias (more signal captured) but increases variance (more sensitive to training-set noise). With $lambda = 0. 02$ vs $lambda = 0. 01$, each step takes larger gradient steps, potentially overshooting and overfitting.

- **B.** Opposite — larger $lambda$ does not smooth the model; it makes it more flexible.
- **C.** Bias and variance move in opposite directions with learning rate.
- **D.** Learning rate directly controls model complexity per iteration, not merely speed.

</details>

---

### Q18. Naive Bayes correlation effect — ½ mark

A spam classifier uses Naive Bayes with two features: word count of "free" ($X_1$) and number of links ($X_2$). In reality, emails with more "free" words also tend to have more links. Which statement is correct about the Naive Bayes estimate?

A. The conditional independence violation causes poorly calibrated probabilities, but classification ranking may still be reasonable.
B. Naive Bayes will always misclassify correlated features.
C. The model must drop one of the two features to be valid.
D. Correlated features make the prior probability estimate biased.

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

Naive Bayes assumes $P (X_1, X_2 | Y) = P (X_1 | Y) times P (X_2 | Y)$, violated when $X_1$ and $X_2$ are correlated. The joint likelihood is miscalculated, so posteriors are not well calibrated. However, because the miscalibration tends to affect both classes similarly, the relative ranking of $P (Y = "spam"| X)$ vs $P (Y = "ham"| X)$ is often preserved, and classification accuracy remains competitive.

- **B.** Too strong — correlation degrades calibration but does not guarantee misclassification.
- **C.** Naive Bayes does not require dropping features; it handles correlated inputs, just not optimally.
- **D.** Prior estimation depends on class frequencies, not feature correlations.

</details>

---

### Q19. Regularised regression alpha — ½ mark

In `caret`'s `train()` with `method = "glmnet"`, the `tuneGrid` varies `alpha` from 0 to 1. What do $alpha = 0$ and $alpha = 1$ correspond to, and which produces a sparser model?

A. $alpha = 0$: Ridge; $alpha = 1$: Lasso; Lasso is sparser.
B. $alpha = 0$: Lasso; $alpha = 1$: Ridge; Ridge is sparser.
C. Both produce equally sparse models.
D. $alpha = 0$: Elastic Net with $lambda = 0$; $alpha = 1$: no regularisation.

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

The elastic net penalty is $(1 -alpha) frac(lambda, 2) | beta |_2^2 + alpha lambda | beta |_1$. When $alpha = 0$, only the $L_2$ (Ridge) penalty applies. When $alpha = 1$, only the $L_1$ (Lasso) penalty applies. The $L_1$ penalty drives coefficients to exactly zero, producing sparse models with automatic feature selection; $L_2$ shrinks coefficients toward zero but never sets them exactly to zero.

- **B.** Swaps the definitions of $alpha = 0$ and $alpha = 1$.
- **C.** Lasso is systematically sparser than Ridge due to the $L_1$ geometry.
- **D.** Neither implies $lambda = 0$; $lambda$ is the separate tuning parameter controlling penalty strength.

</details>

---

### Q20. LDA decision boundary direction — ½ mark

Two classes have bivariate features with shared covariance $"Sigma"$ and class means $mu_1 = (2, 3)^T$ and $mu_2 = (6, 1)^T$. With equal priors, the LDA decision boundary satisfies $(mu_1 -mu_2)^T "Sigma"^(-1) x = "const"$. The boundary is perpendicular to which vector?

A. $"Sigma"^(-1) (mu_1 -mu_2)$
B. $mu_1 -mu_2 = (-4, 2)^T$
C. $"Sigma" (mu_1 + mu_2)$
D. $(mu_1 -mu_2)^T (mu_1 -mu_2)$

<details><summary>Answer and explanation</summary>

**Correct answer: A.**

In LDA the decision boundary satisfies $delta_1 (x) = delta_2 (x)$, which rearranges to $(mu_1 -mu_2)^T "Sigma"^(-1) x = "const"$. This is a linear equation in $x$ with normal vector $w = "Sigma"^(-1) (mu_1 -mu_2)$. The boundary hyperplane is perpendicular to $w$. Unless $"Sigma" = I$, the boundary is **not** perpendicular to $mu_1 -mu_2$ itself.

- **B.** This is $mu_1 -mu_2$ without the $"Sigma"^(-1)$ transformation; only correct when $"Sigma" = I$.
- **C.** The sum of means has no role in the LDA decision boundary.
- **D.** This is a scalar (the squared Mahalanobis-related distance), not a direction vector.

</details>

### Q21. Interpreting a confusion matrix — ½ mark

A binary classifier is evaluated on a test set of 200 instances. The confusion matrix shows: True Positives (TP) = 60, False Positives (FP) = 10, False Negatives (FN) = 30, True Negatives (TN) = 100. What is the **F1 score**?

A. 0.857
B. 0.750
C. 0.667
D. 0.800

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Precision = TP / (TP + FP) = 60 / 70 = 6/7 ≈ 0.857. Recall = TP / (TP + FN) = 60 / 90 = 2/3 ≈ 0.667. F1 = 2 × precision × recall / (precision + recall) = 2 × (6/7) × (2/3) / (6/7 + 2/3) = (24/21) / ((18+14)/21) = (24/21) / (32/21) = 24/32 = 0.750. **Correction: F1 = 0.750.**

**Correct answer: B.**

Working: Precision = 60/70 ≈ 0.857, Recall = 60/90 ≈ 0.667. F1 = 2(0.857)(0.667)/(0.857 + 0.667) = 2(0.572)/(1.524) ≈ 0.750. **B** is correct. **A** equals the precision alone, not F1. **C** equals the recall alone. **D** is an arithmetic misestimate. The F1 score harmonically balances precision and recall, punishing extreme imbalance between them.
</details>

---

### Q22. k-fold cross-validation mean error — ½ mark

In 5-fold cross-validation on a regression problem, the RMSE values for the five folds are: 3.2, 2.8, 4.1, 3.5, and 3.9. What is the **standard deviation** of these fold-level RMSE values (using the sample standard deviation formula, $frac(1,n-1)$)?

A. 0.45
B. 0.40
C. 0.51
D. 0.36

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Mean = (3.2 + 2.8 + 4.1 + 3.5 + 3.9)/5 = 17.5/5 = 3.5. Deviations: −0.3, −0.7, +0.6, 0.0, +0.4. Squared deviations: 0.09, 0.49, 0.36, 0.00, 0.16. Sum = 1.10. Sample variance = 1.10/(5−1) = 0.275. Sample standard deviation = $sqrt(0.275) approx 0.524$. The closest option is **C ≈ 0.51**.

**B** is the population standard deviation ($sqrt(1.10/5) approx 0.469$, closest to 0.45 — option **A**). **A** would be the population $sigma$, not the sample $s$. **B** and **D** correspond to common divisor errors ($n$ instead of $n-1$, or incorrect squared deviations). The sample standard deviation uses $n-1$ to correct for bias when estimating from a finite sample.
</details>

---

### Q23. Bias–variance trade-off for regularisation — ½ mark

When you increase the tuning parameter $lambda$ in ridge regression from 0 to a large value, what happens to the model's **bias** and **variance** on the training data?

A. Bias increases, variance decreases
B. Bias decreases, variance increases
C. Bias decreases, variance decreases
D. Bias increases, variance increases

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

As $lambda$ increases, ridge regression shrinks coefficients $hat(beta)$ toward zero. This constrains the model, reducing its flexibility and thus reducing variance. However, the imposed shrinkage means the model can no longer fit the training data as closely, so bias increases. At $lambda = 0$ (OLS), variance is high and bias is low; as $lambda "rightarrow" "infty"$, all coefficients approach zero (intercept only), bias is maximal and variance approaches zero.

**B** is the opposite of what happens. **C** describes an impossible scenario — reducing both simultaneously is the goal of ensemble methods, not regularisation alone. **D** would mean the model degrades on both fronts, contradicting the purpose of regularisation. The art is finding the $lambda$ that minimises total prediction error = bias² + variance + irreducible noise.
</details>

---

### Q24. Principal component interpretation — ½ mark

You perform PCA on a dataset with four standardised variables. The proportion of variance explained by the first two principal components is 0.55 and 0.25, respectively. The loadings of PC1 on variables X1, X2, X3, X4 are 0.50, 0.50, −0.50, −0.50. Which statement is **most accurate**?

A. PC1 captures a contrast between the group {X1, X2} and {X3, X4}
B. PC1 captures a weighted average of all four variables equally
C. PC2 must capture the remaining contrast between X1 and X2
D. PC1 explains more variance than PC2 because its loadings are larger in magnitude

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

PC1 has positive loadings on X1 and X2 (+0.50 each) and negative loadings on X3 and X4 (−0.50 each). This means PC1 $approx 0.50(X_1 + X_2 - X_3 - X_4)$ after standardisation, which is a contrast between the {X1, X2} group and the {X3, X4} group. High PC1 scores indicate large X1, X2 and small X3, X4.

**B** is incorrect — equal loadings of the same sign would be a weighted average; here the signs differ, indicating a contrast. **C** is speculative — PC2's loadings depend on the data covariance structure and cannot be determined from PC1 alone. **D** confuses the direction of loading signs with magnitude; the explained variance depends on the eigenvalue of the covariance matrix, not the sign pattern of loadings. Both groups of loadings have equal magnitude here.
</details>

---

### Q25. Decision tree splitting criterion — ½ mark

A classification tree considers splitting a node with 40 observations (25 class Yes, 15 class No). After the split, the left child has 20 observations (18 Yes, 2 No) and the right child has 20 observations (7 Yes, 13 No). What is the **reduction in Gini impurity** from this split (rounded to two decimal places)?

A. 0.21
B. 0.15
C. 0.36
D. 0.47

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Gini = $1 - sum p_i^2$. Parent Gini = $1 - ((25/40)^2 + (15/40)^2) = 1 - (0.3906 + 0.1406) = 0.4688$.
Left child Gini = $1 - ((18/20)^2 + (2/20)^2) = 1 - (0.81 + 0.01) = 0.18$.
Right child Gini = $1 - ((7/20)^2 + (13/20)^2) = 1 - (0.1225 + 0.4225) = 0.455$.
Weighted child Gini = $(20/40)(0.18) + (20/40)(0.455) = 0.09 + 0.2275 = 0.3175$.
Reduction = 0.4688 − 0.3175 = **0.1513 ≈ 0.15**.

**Correct answer: B.**

**A** would be the weighted child impurity itself, not the reduction. **C** equals the parent Gini. **D** is unrelated. The Gini split criterion always measures the decrease in weighted impurity relative to the parent, rewarding splits that produce pure child nodes.
</details>

---

### Q26. Boosting learning rate effect — ½ mark

In gradient boosting for regression, the ensemble at step $m$ is $F_m(x) = F_(m-1)(x) + nu "cdot" h_m(x)$, where $nu$ is the learning rate and $h_m$ is the new weak learner fitted to the residuals. If you reduce $nu$ from 0.1 to 0.05 but double the number of boosting rounds, what is the **most likely** effect on test error?

A. Test error increases because each tree contributes less
B. Test error remains roughly the same because the total shrinkage budget is preserved
C. Test error decreases because smaller steps reduce the risk of overfitting
D. Test error becomes exactly equal to the original setting due to linearity

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

A smaller learning rate $nu$ means each weak learner contributes less to the ensemble, making the model more regularised and less prone to overfitting noise. Doubling the rounds compensates partially by allowing more iterations to fit the signal, but the key benefit is that smaller step sizes yield a more refined, generalisable fit. Empirically, reducing $nu$ and increasing $n_("rounds")$ typically improves test performance (at the cost of more computation).

**A** is wrong — contributing less per step is precisely the regularisation benefit. **B** is too simplistic — the total shrinkage is not simply additive in its effect on generalisation; smaller steps interact with the loss landscape differently. **D** is wrong — the relationship is nonlinear, so halving $nu$ and doubling rounds does not produce identical results.
</details>

---

### Q27. Naive Bayes conditional independence — ½ mark

You train a naive Bayes classifier with two features, $X_1$ and $X_2$, for a binary outcome $Y$. In reality, $X_1$ and $X_2$ are strongly correlated ($r = 0.9$). The naive Bayes assumption treats them as conditionally independent given $Y$. Which statement is **true**?

A. The posterior probability $P(Y | X_1, X_2)$ will be exactly correct despite the correlation
B. The classifier will always misclassify correlated instances
C. The posterior probabilities may be poorly calibrated even if classification accuracy is acceptable
D. Naive Bayes cannot be applied when features are correlated

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Naive Bayes assumes conditional independence: $P(X_1, X_2 | Y) = P(X_1 | Y) P(X_2 | Y)$. When $X_1$ and $X_2$ are strongly correlated, this assumption is violated, causing the estimated joint likelihood to be incorrect. The posterior $P(Y | X_1, X_2)$ will be miscalibrated (probabilities pushed toward 0 or 1). However, for classification (picking the class with highest posterior), the ranking may still be correct, so accuracy can remain acceptable.

**A** is wrong — the independence assumption directly distorts the posterior calculation. **B** is too strong — correlation doesn't guarantee misclassification; the decision boundary may still be approximately correct. **D** is wrong — naive Bayes can always be *applied*; the assumption is a modelling simplification, not a feasibility requirement. In practice, naive Bayes often works well despite correlated features.
</details>

---

### Q28. Shiny reactive expression vs. observer — ½ mark

In a Shiny application, what is the **key difference** between a `reactive` expression and an `observe` expression?

A. `reactive` expressions are triggered by user input; `observe` expressions run once at startup
B. `reactive` expressions cache their result and re-run only when dependencies change; `observe` expressions execute for their side effects and do not return a value to other reactives
C. `reactive` expressions can only be used in the UI; `observe` expressions only in the server
D. `reactive` expressions are faster because they skip dependency tracking

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

A `reactive` expression caches its computed value and is invalidated only when its reactive dependencies change. Other reactives can read its value. An `observe` expression runs its code block whenever its dependencies change, but it is designed for **side effects** (e.g., writing to a file, printing, updating an external resource) and its return value cannot be accessed by other reactive expressions.

**A** is wrong — both are triggered by dependency changes, not exclusively by user input, and neither runs only once. **C** is wrong — both are server-side constructs. **D** is wrong — both track dependencies equally; reactives are cached, which saves recomputation, but that is not about skipping tracking. Using `observe` for side effects prevents accidental reactive chains that could cause infinite loops.
</details>

---

### Q29. PCA dimensionality reduction before LDA — ½ mark

You have a dataset with 50 features and 3 classes. You apply PCA to reduce to $k$ components, then use LDA for classification. If you set $k = 2$, what is a **potential risk** compared to setting $k = 3$?

A. LDA cannot run with fewer components than classes
B. PCA may discard variance that, while small, is discriminative for separating the three classes
C. The model will overfit because too few features are used
D. LDA assumes PCA components are normally distributed

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

PCA finds directions of **maximum total variance**, not maximum class separation. LDA seeks directions that maximise between-class variance relative to within-class variance. With $k = 2$, PCA retains the top two variance directions, but these may not align with the discriminative directions LDA needs. Some low-variance PCA components might carry class-separating information that gets discarded. With $k = 3$, you retain more of the original feature space, reducing this risk.

**A** is wrong — LDA with 3 classes can work with any number of features (even 1); it produces at most $min(p, C-1)$ discriminant dimensions regardless. **C** is wrong — fewer features typically *reduce* overfitting risk, not increase it. **D** is wrong — LDA assumes class-conditional normality of the *original* (or transformed) features, but PCA itself makes no distributional assumption; LDA's normality assumption applies to whatever features it receives.
</details>

---

### Q30. Bootstrap aggregation variance reduction — ½ mark

Bagging fits $B$ regression trees on $B$ bootstrap samples and averages their predictions. If a single tree has variance $sigma^2$ and the correlation between any two bagged tree predictions is $rho$, what is the **variance of the bagged predictor**?

A. $rho "cdot" sigma^2$
B. $frac(sigma^2, B) + rho "cdot" sigma^2 "cdot" frac(B-1, B)$
C. $frac(sigma^2, B)$
D. $(1 - rho) "cdot" sigma^2$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

For the average of $B$ identically distributed random variables each with variance $sigma^2$ and pairwise correlation $rho$, the variance of the mean is:

$"Var"(frac(1,B) sum_(i=1)^(B) T_i) = frac(sigma^2, B) + rho "cdot" sigma^2 "cdot" frac(B-1, B)$

As $B "rightarrow" "infty"$, this converges to $rho "cdot" sigma^2$, so correlation $rho$ sets a floor on achievable variance reduction. Reducing $rho$ (e.g., by using random forests with feature subsampling) is key to further variance reduction.

**A** is the asymptotic limit as $B "rightarrow" "infty"$, not the finite-$B$ expression. **C** assumes independence ($rho = 0$), which is unrealistic for bagged trees trained on overlapping bootstrap samples. **D** does not follow from the variance-of-a-mean formula. Bagging's power comes from $rho < 1$, but $rho > 0$ for trees on similar data, so variance reduction is bounded.
</details>
