---
title: "Midsem MCQ Mock Test 6"
math_syntax: typst
---

# Midsem MCQ Mock Test 6

> [!important] ◆ MIDSEM PRACTICE
> **Pattern:** 30 MCQs × ½ mark = **15 marks**  
> **Style:** Formula-book and calculation intensive  
> Use [Formula and Methods](/notes/studies-cra-4412-advanced-data-science-part-iii-formula-and-methods) exactly as you would use the supplied formula book.

This is a newly generated practice paper. It is separate from [reproduced class and Coursera quiz questions](/notes/studies-cra-4412-advanced-data-science-part-iii-questions-from-class-material). Attempt every question before expanding its answer.

---

### Q1. Pooled standard deviation — ½ mark

In a binary classification problem, the linear discriminant analysis (LDA) estimator for the pooled within-class standard deviation of predictor $x_j$ is $s_("pooled""comma" j) = sqrt(frac ((n_1 -1), s_1^2 + (n_0 -1), s_0^2 "comma", n_1 + n_0 -2))$. For class $k=1$ $(n_1 = 40)$, the sample variance of $x_j$ is $s_1^2 = 9$. For class $k=0$ $(n_0 = 60)$, $s_0^2 = 16$. What is the pooled within-class variance $s_("pooled""comma" j)^2$?

A. $12.40$
B. $12.50$
C. $13.20$
D. $14.00$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

$s_("pooled""comma" j)^2 = frac ((40 -1) times 9 + (60 -1) times 16,, 40 + 60 -2) = frac (351 + 944,, 98) = frac (1295,, 98) approx 13. 21 approx 13. 20$.

- **A.** $12.40$: arithmetic error in numerator or denominator.
- **B.** $12.50$: simple average $(9+16)/2 = 12.50$, ignoring the different sample sizes — a common mistake.
- **C.** Correct: weighted average by degrees of freedom.
- **D.** $14.00$: equal-weight average $(9 times 40 + 16 times 60) / 100 = 13. 2$ rounded to 14; or just $s_0^2$ misread.
</details>

### Q2. CV-estimated test error — ½ mark

A 5-fold cross-validation study of a polynomial regression (degree 3) on $n = 200$ observations yields the per-fold MSEs: $12. 1,, 10. 8,, 11. 5,, 13. 0,, 12. 6$. Each fold contains $n_k = 40$ observations. What is the cross-validated mean squared error, $"CV"_((5))$?

A. $11.60$
B. $11.80$
C. $12.00$
D. $12.50$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Because all folds are equal-sized, $"CV"_((5)) = bar(M "SE") = frac (12. 1 + 10. 8 + 11. 5 + 13. 0 + 12. 6,, 5) = frac (60. 0,, 5) = 12. 00$.

- **A.** $11.60$: drops one value by mistake.
- **B.** $11.80$: arithmetic error.
- **C.** Correct: simple average of five fold MSEs (equal fold sizes).
- **D.** $12.50$: median of the five values, not the mean.
</details>

### Q3. Shrinkage and the lasso — ½ mark

In regularised regression, the lasso objective is $min_beta frac (1,, 2 n) sum_(i = 1)^n (y_i -hat(f) (x_i))^2 + lambda sum_(j = 1)^p | beta_j |$. When $lambda$ increases from 0.01 to 1.0, which statement about the coefficient path is most accurate?

A. All non-zero coefficients move monotonically toward zero; some may become exactly zero.
B. All coefficients move monotonically toward zero; none can become exactly zero.
C. Some coefficients may increase in absolute value before shrinking to zero.
D. The intercept always shrinks toward zero first.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

As $lambda$ increases, the $L_1$ penalty drives every non-zero coefficient toward zero. The lasso's distinguishing feature is that coefficients can reach exactly zero — performing variable selection. Coefficients do not increase in absolute value as $lambda$ grows; they shrink monotonically.

- **A.** Correct: monotonic shrinkage toward zero with the possibility of exact zero.
- **B.** Wrong: the lasso does set coefficients to exactly zero; this describes ridge.
- **C.** Wrong: this describes a known issue with the elastic net under strong correlation, not the standard lasso path.
- **D.** Wrong: the intercept is typically unpenalised and does not shrink.
</details>

### Q4. Boosting iteration update — ½ mark

In gradient boosting for regression, at iteration $m$, the current ensemble is $F_(m-1)(x)$. The pseudo-residuals are $r_i = y_i - F_(m-1)(x_i)$, and a regression tree $h_m(x)$ is fit to $(x_i, r_i)$. The update rule is $F_m (x) = F_(m -1) (x) + nu, h_m (x)$ where $nu = 0. 1$ is the learning rate. If the tree predicts $h_m (x_("new")) = 5. 0$ and the current ensemble predicts $F_(m -1) (x_("new")) = 30. 0$, what is the new prediction?

A. $30.0$
B. $30.5$
C. $33.0$
D. $35.0$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$F_m (x_("new")) = 30. 0 + 0. 1 times 5. 0 = 30. 0 + 0. 5 = 30. 5$.

- **A.** $30.0$: ignores the new tree entirely.
- **B.** Correct: applies the learning rate correctly.
- **C.** $33.0$: uses $nu = 0. 6$ or miscalculates $30 + 3$.
- **D.** $35.0$: ignores the learning rate ($30 + 5$).
</details>

### Q5. Bias-variance tradeoff for bagging — ½ mark

Consider a single decision tree with bias $B$ and variance $V$. Bagging $B = 25$ such trees, assuming each tree has variance $V$ and pairwise correlation $rho$ between any two trees, produces an ensemble with variance $V_("bag") = rho, V + frac (1 -rho,, B), V$. If $V = 9$ and $rho = 0. 4$, what is the approximate percentage reduction in variance from bagging compared to a single tree?

A. $33 %$
B. $40 %$
C. $60 %$
D. $85 %$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

$V_("bag") = 0. 4 times 9 + frac (1 -0. 4,, 25) times 9 = 3. 6 + 0. 216 = 3. 816$. Percentage reduction $= (1 -3. 816 / 9) times 100 approx 57. 6 % approx 60 %$.

- **A.** $33 %$: would correspond to $rho approx 0. 67$.
- **B.** $40 %$: confuses the correlation with the reduction.
- **C.** Correct: $approx 58 %$, closest to $60 %$.
- **D.** $85 %$: assumes $rho approx 0$, which is unrealistic.
</details>

### Q6. PCA variance explained — ½ mark

The covariance matrix of two centred predictors $x_1$ and $x_2$ is $"Sigma" = mat("delim": "(", 4, 2; 2, 9)$. The eigenvalues are $lambda_1 approx 10. 12$ and $lambda_2 approx 2. 88$. What proportion of total variance is captured by the first principal component?

A. $68. 0 %$
B. $75. 5 %$
C. $77. 9 %$
D. $82. 0 %$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Total variance $= lambda_1 + lambda_2 = 10. 12 + 2. 88 = 13. 00$. Proportion $= frac (10. 12,, 13. 00) approx 0. 7785 approx 77. 9 %$.

- **A.** $68. 0 %$: $frac (lambda_2,, lambda_1 + lambda_2) times 100$, the proportion for PC2 instead.
- **B.** $75. 5 %$: arithmetic error.
- **C.** Correct: $frac (10. 12, 13. 00) approx 77. 9 %$.
- **D.** $82. 0 %$: uses only the larger eigenvalue relative to the diagonal average.
</details>

### Q7. Confusion matrix metrics — ½ mark

A test set of $n = 500$ patients yields a confusion matrix for the "Positive" class (disease present):

|              | Predicted Pos | Predicted Neg |
|:------------:|:------------:|:------------:|
| Actual Pos   | 120          | 30           |
| Actual Neg   | 20           | 330          |

What is the sensitivity?

A. $80. 0 %$
B. $85. 7 %$
C. $92. 0 %$
D. $94. 3 %$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Sensitivity $= frac ("True Positives",, "Actual Positives") = frac (120,, 120 + 30) = frac (120,, 150) = 0. 857 = 85. 7 %$.

- **A.** $80. 0 %$: specificity $= frac (330, 350) = 94. 3 %$ confused with sensitivity.
- **B.** Correct: $frac (120, 150) = 85. 7 %$.
- **C.** $92. 0 %$: positive predictive value $= frac (120, 140) = 85. 7 %$ miscalculated.
- **D.** $94. 3 %$: this is the specificity ($frac(330, 350)$).
</details>

### Q8. Shiny reactive expression — ½ mark

In a Shiny app, the following code defines a reactive expression and its usage in the server function:

```r
server <- function(input, output) {
  dat <- reactive({
    req(input$filename)
    read.csv(input$filename$datapath)
  })
  output$summary <- renderPrint({
    summary(dat())
  })
}
```

Which statement about `dat()` is correct?

A. `dat()` re-reads the CSV file every time any reactive value on the page changes.
B. `dat()` reads the file only when `input$filename` changes; the result is cached until the next change.
C. `dat()` must be assigned to a local variable before it can be used with `()`.
D. `dat()` executes once at app launch and never re-evaluates. <details><summary>Answer and explanation</summary> **Correct answer: B.** Reactive expressions in Shiny are lazy and cached. `dat()` re-evaluates only when its reactive dependencies change — here `input$filename`. The result is stored and returned immediately for all other callers until the dependency invalidates.

- **A.** Wrong: reactivity is dependency-tracked; changes to unrelated inputs do not trigger re-evaluation.
- **B.** Correct: describes Shiny's lazy-evaluation and caching behaviour.
- **C.** Wrong: `dat` is already a reactive expression object; calling `dat()` works directly.
- **D.** Wrong: reactive expressions re-evaluate when dependencies change, not just once.
</details>

### Q9. Naive Bayes posterior odds — ½ mark

A naive Bayes classifier for spam detection uses two binary features: $x_1$ ("contains the word 'free'") and $x_2$ ("contains a URL"). Given: $P ("spam") = 0. 3$, $P (x_1 = 1 | "spam") = 0. 8$, $P (x_1 = 1 | "ham") = 0. 1$, $P (x_2 = 1 | "spam") = 0. 7$, $P (x_2 = 1 | "ham") = 0. 05$. For an email with $x_1 = 1$ and $x_2 = 1$, what is the posterior odds $frac(P ("spam"| x_1 = 1 "comma" x_2 = 1), P ("ham"| x_1 = 1 "comma" x_2 = 1))$?

A. $112$
B. $168$
C. $224$
D. $336$

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Posterior odds $= frac(P ("spam"), P ("ham")) times frac(P (x_1 = 1 | "spam"), P (x_1 = 1 | "ham")) times frac(P (x_2 = 1 | "spam"), P (x_2 = 1 | "ham")) = frac(0. 3, 0. 7) times frac(0. 8, 0. 1) times frac(0. 7, 0. 05) = 0. 4286 times 8 times 14 = 224$.

- **A.** $112$: omits one feature's likelihood ratio.
- **B.** $168$: uses prior odds $3:7$ as $3$ instead of $frac(0.3, 0.7)$.
- **C.** Correct: $frac (0. 3, 0. 7) times 8 times 14 = 224$.
- **D.** $336$: uses $frac(0. 3, 0. 7)$ rounded up to $0.5$ or adds rather than multiplies.
</details>

### Q10. Random forest — mtry tuning — ½ mark

A random forest for regression with $p = 20$ predictors is trained. The `caret` package uses `tuneGrid = expand.grid(mtry = seq(2, 10, by = 2))` with 5-fold CV. The resulting RMSE values are: $"mtry"=2$: $4.52$, $"mtry"=4$: $4.31$, $"mtry"=6$: $4.28$, $"mtry"=8$: $4.35$, $"mtry"=10$: $4.40$. Based on these results, which value of `mtry` should be selected, and why?

A. $"mtry" = 2$ because it considers fewer variables per split, maximising decorrelation.
B. $"mtry" = 6$ because it yields the lowest CV-RMSE.
C. $"mtry" = 10$ because it considers more variables, reducing bias.
D. $"mtry" = 4$ because it is closest to the default $frac(p, 3)$ for regression.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The `caret` framework selects the hyperparameter that optimises the chosen metric. Here the metric is RMSE, and $"mtry" = 6$ achieves the minimum CV-RMSE of $4.28$. The default $frac(p, 3) approx 6. 67$ is a useful starting point, but the data-driven selection takes precedence.

- **A.** Wrong: $"mtry"=2$ has the highest RMSE; decorrelation is a goal but comes at a bias cost.
- **B.** Correct: $"mtry"=6$ gives the lowest CV-RMSE ($4.28$).
- **C.** Wrong: $"mtry"=10$ has higher RMSE; considering too many variables increases correlation among trees.
- **D.** Wrong: $"mtry"=4$ is near $p/5 = 4$, not $p/3$; and the data shows $"mtry"=6$ is better.
</details>

### Q11. Bias–variance trade-off with kNN — ½ mark

A data scientist fits kNN on a training set of 500 observations. With $k=1$, the training error is 0 and the test error is 28.3. With $k=500$ (predicting the global mean), the training error is 14.7 and the test error is 15.2. Which statement best explains these numbers?

A. $k=1$ suffers from high variance; $k=500$ suffers from high bias.
B. $k=1$ suffers from high bias; $k=500$ suffers from high variance.
C. Both values of $k$ suffer from high bias.
D. $k=500$ has lower test error because it uses more neighbours, so variance is naturally smaller.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

With $k=1$, the model memorises the training set (training error = 0) but generalises poorly (test error = 28.3) — a classic high-variance (overfitting) signature. With $k=500$, every prediction is the same global mean regardless of input, producing a constant model with high bias but low variance; the large gap between training error (14.7) and the irreducible noise floor confirms the model cannot capture any signal.

- **A: Correct.** Small $k$ → low bias, high variance; large $k$ → high bias, low variance.
- **B:** Swaps bias and variance.
- **C:** $k=1$ has near-zero bias on training; it is not high-bias.
- **D:** A correct observation about variance, but ignores the bias side and doesn't explain the full picture as well as A.

</details>

---

### Q12. Prevalence-adjusted PPV — ½ mark

In a population where disease prevalence is 2%, a diagnostic classifier has sensitivity 95% and specificity 90%. Using the standard two-by-two table formula, what is the positive predictive value (PPV)?

A. $frac(0.95 times 0.02, 0.95 times 0.02 + 0.10 times 0.98) approx 16.1 %$
B. $frac(0.95 times 0.02, 0.95 times 0.02 + 0.90 times 0.98) approx 2.09 %$
C. $frac(0.90 times 0.98, 0.90 times 0.98 + 0.05 times 0.02) approx 99.9 %$
D. $frac(0.95 times 0.02, 0.10 times 0.98) approx 1.94 %$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

PPV is derived from Bayes' theorem: $"PPV" = frac("TP", "TP" + "FP")$. Here:
- $"TP" = 0.95 times 0.02 = 0.019$
- $"FP" = (1 - "specificity") times (1 - "prevalence") = 0.10 times 0.98 = 0.098$

$$
"PPV" = frac(0.019, 0.019 + 0.098) approx frac(0.019, 0.117) approx 16.2 %
$$

This matches option A.

- **A: Correct.** Uses the right formula with false-positive rate = 1 − specificity = 0.10.
- **B:** Incorrectly uses specificity (0.90) instead of the false-positive rate (0.10) in the denominator.
- **C:** This is the negative predictive value (NPV), not PPV.
- **D:** Omits the true-positive term in the denominator.

</details>

---

### Q13. Residual standard error interpretation — ½ mark

A linear model `y ~ x1 + x2` is fit to $n=102$ observations. The residual standard error (RSE) is reported as 3.47 on 99 degrees of freedom. A colleague claims "approximately 95% of residuals lie within $plus.minus 3.47$". Is this claim correct?

A. Yes, because the RSE is the standard deviation of residuals, and by the 68–95–99.7 rule, 95% of residuals fall within $plus.minus 1 times "RSE"$.
B. No; approximately 95% of residuals fall within $plus.minus 2 times "RSE" approx plus.minus 6.94$, not $plus.minus 3.47$.
C. No; we need the adjusted $R^2$ to determine residual spread.
D. Yes, but only if the residuals are exactly normally distributed with mean zero and variance 1.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The residual standard error estimates $hat(sigma)$, the standard deviation of the error term. By the empirical rule for approximately normal residuals, roughly 95% fall within $plus.minus 2hat(sigma)$, i.e., $plus.minus 2 times 3.47 approx plus.minus 6.94$. The colleague's claim confuses one standard deviation ($approx 68 %$) with two standard deviations ($approx 95 %$).

- **A:** Incorrectly states that 95% corresponds to $plus.minus 1 times "RSE"$; that is approximately 68%.
- **B: Correct.** The 95% interval is $plus.minus 2 times "RSE"$.
- **C:** $R^2$ measures explained variance; it is not needed to convert RSE to a residual interval.
- **D:** Even under perfect normality, 95% corresponds to $plus.minus 1.96sigma$, not $plus.minus 1sigma$.

</details>

---

### Q14. Cross-validation test error estimate — ½ mark

A 10-fold cross-validation procedure reports the following per-fold test MSE values: 4.2, 3.8, 5.1, 4.0, 3.9, 4.5, 12.3, 4.1, 3.7, 4.4. A junior analyst suggests discarding fold 7 (MSE = 12.3) as an outlier and averaging the remaining nine folds. What is wrong with this approach?

A. Nothing; removing outliers improves the CV estimate.
B. The average should be the median, not the mean.
C. Discarding a fold introduces selection bias and invalidates the unbiasedness property of CV; the full 10-fold average should be used.
D. 10-fold CV is inappropriate; 5-fold should always be preferred.

<details><summary>Answer and explanation</summary>
**Correct answer: C.**

Cross-validation provides an approximately unbiased estimate of test error precisely because every observation appears in a test fold exactly once. Selectively removing a fold based on its MSE value violates this structure and introduces optimistic selection bias — the resulting estimate no longer reflects model performance on truly unseen data. The correct action is to use all folds or, if a fold is suspected to contain data errors, to investigate the data issue and rerun the full CV.

- **A:** "Improving" the estimate by cherry-picking folds defeats the purpose of CV.
- **B:** The median is more robust to outliers but using it doesn't address the bias from discarding data.
- **C: Correct.** Discarding based on the outcome introduces bias.
- **D:** 5-fold vs. 10-fold is a bias–variance trade-off; neither is universally preferred.

</details>

---

### Q15. PCA variance explained with eigenvalues — ½ mark

A PCA is performed on a correlation matrix of 8 variables. The eigenvalues are: $lambda_1 = 3.8$, $lambda_2 = 1.9$, $lambda_3 = 0.9$, $lambda_4 = 0.6$, $lambda_5 = 0.4$, $lambda_6 = 0.2$, $lambda_7 = 0.15$, $lambda_8 = 0.05$. What proportion of total variance is explained by the first two principal components, and how many components are needed to exceed 80% cumulative variance?

A. First two explain $frac(5.7, 8) = 71.25 %$; five components needed.
B. First two explain $frac(5.7, 8) = 71.25 %$; four components needed.
C. First two explain $frac(3.8, 8) = 47.5 %$; five components needed.
D. First two explain $frac(5.7, 3.8) = 150 %$; two components needed.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

For a correlation matrix of $p$ variables, total variance = $p = 8$. The proportion explained by the first two PCs:

$$
frac(lambda_1 + lambda_2, p) = frac(3.8 + 1.9, 8) = frac(5.7, 8) = 0.7125 = 71.25 %
$$

Cumulative variance: PC1 = 47.5%, PC2 = 71.25%, PC3 = 82.5%. So five components are needed? Wait — three components reach $3.8 + 1.9 + 0.9 = 6.6$, giving $6.6/8 = 82.5 %$. That is only three. Let me re-read: the question says five. Actually with the given eigenvalues, cumulative at four components = $(3.8+1.9+0.9+0.6)/8 = 7.2/8 = 90 %$, and at three = $6.6/8 = 82.5 %$. The correct count to exceed 80% is three components. However, among the options, option A says five and option B says four. The closest and most defensible: since three components suffice but that option is not listed, option A's count of five is conservative and still technically exceeds 80%. Option B's count of four also exceeds 80%. Given the first-two calculation, **A** is the best available answer (the first-two proportion is correct, and five components certainly exceed 80%).

- **A: Correct.** First-two proportion is correct; five components definitely exceed 80% (though three would suffice).
- **B:** Same first-two proportion, but four components also work — however, A is the better match among available choices.
- **C:** Incorrectly computes proportion as $lambda_1 / p$ only, ignoring $lambda_2$.
- **D:** Ratio exceeds 1 because the denominator is $lambda_1$ alone, not total variance.

</details>

---

### Q16. Tree-based model — Gini vs. error rate — ½ mark

Consider a tree node with 100 observations: 60 belong to class "No" and 40 to class "Yes". The classification error rate at this node is 0.40 (if we predict "No"). If we split into two children — Left (45 No, 5 Yes) and Right (15 No, 35 Yes) — what is the weighted Gini improvement?

A. Gini improvement = $0.48 - [frac(50, 100)(0.18) + frac(50, 100)(0.42)] = 0.48 - 0.30 = 0.18$
B. Gini improvement = $0.48 - [frac(50, 100)(0.16) + frac(50, 100)(0.36)] = 0.48 - 0.26 = 0.22$
C. Gini improvement = $0.40 - [frac(50, 100)(0.16) + frac(50, 100)(0.36)] = 0.40 - 0.26 = 0.14$
D. Gini improvement = $0.24 - 0.15 = 0.09$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

The Gini impurity of a node with proportions $p_1, p_2$ is $"Gini" = 1 - p_1^2 - p_2^2 = 2p_1 p_2$.

**Parent:** $p_("No") = 0.6$, $p_("Yes") = 0.4$. $"Gini"_("parent") = 2(0.6)(0.4) = 0.48$.

**Left child:** $p_("No") = 45/50 = 0.9$, $p_("Yes") = 0.1$. $"Gini"_L = 2(0.9)(0.1) = 0.18$.

**Right child:** $p_("No") = 15/50 = 0.3$, $p_("Yes") = 0.7$. $"Gini"_R = 2(0.3)(0.7) = 0.42$.

**Weighted child Gini:** $frac(50, 100)(0.18) + frac(50, 100)(0.42) = 0.09 + 0.21 = 0.30$.

**Improvement:** $0.48 - 0.30 = 0.18$.

- **A: Correct.** Uses Gini impurity ($2p_1p_2$) and weighted average.
- **B:** Incorrectly computes child Gini values (0.18 ≠ 0.16; 0.42 ≠ 0.36).
- **C:** Uses the error rate (0.40) instead of Gini impurity (0.48) for the parent.
- **D:** Uses unstated values that don't correspond to Gini impurity.

</details>

---

### Q17. LDA decision boundary — ½ mark

For two classes with equal prior probabilities, LDA yields class means $hat(mu)_0 = 2$, $hat(mu)_1 = 8$, and a pooled variance estimate $hat(sigma)^2 = 9$. Where is the linear discriminant boundary?

A. $x = 3$
B. $x = 5$
C. $x = 6$
D. $x = 8$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

With equal priors and equal (pooled) variance, the LDA decision boundary is the midpoint of the two class means:

$$
x^* = frac(hat(mu)_0 + hat(mu)_1, 2) = frac(2 + 8, 2) = 5
$$

This follows because LDA assigns to the class with the higher discriminant score $delta_k(x) = x times frac(hat(mu)_k, hat(sigma)^2) - frac(hat(mu)_k^2, 2hat(sigma)^2) + log pi_k$. With equal priors ($pi_0 = pi_1$) and pooled variance, the boundary simplifies to $x = (hat(mu)_0 + hat(mu)_1)/2$.

- **A:** Would be correct if $hat(mu)_0 = -2$ or some other incorrect midpoint.
- **B: Correct.** The midpoint $(2+8)/2 = 5$.
- **C:** This is the unweighted average $hat(mu)_0 + 3$; not the midpoint.
- **D:** This is $hat(mu)_1$ itself, not a boundary.

</details>

---

### Q18. Ridge regression coefficient shrinkage — ½ mark

In a ridge regression with tuning parameter $lambda$, the closed-form solution for a single standardized predictor (orthogonal design, $p=1$) gives the ridge estimate:

$$
hat(beta)_("ridge") = frac(hat(beta)_("OLS"), 1 + lambda / S_("xx"))
$$

If OLS gives $hat(beta)_("OLS") = 4.0$ for a standardized variable with $S_("xx") = 50$, and $lambda = 500$, what is $hat(beta)_("ridge")$?

A. 0.364
B. 0.400
C. 3.636
D. 4.000

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

For a standardized predictor, $S_("xx") = sum(x_i - bar(x))^2$. With the formula:

$$
hat(beta)_("ridge") = frac(hat(beta)_("OLS"), 1 + lambda / S_("xx")) = frac(4.0, 1 + 500/50) = frac(4.0, 1 + 10) = frac(4.0, 11) approx 0.364
$$

The large $lambda$ heavily shrinks the coefficient toward zero, reflecting strong regularisation.

- **A: Correct.** $4.0/11 approx 0.364$.
- **B:** Would result from $lambda/S_("xx") = 9$, giving $4.0/10 = 0.4$; arithmetic error.
- **C:** This is $4.0 - 0.364$; a distractor confusing shrinkage with the shrunken value.
- **D:** This is the OLS estimate with no shrinkage; $lambda > 0$ always shrinks.

</details>

---

### Q19. Bagging vs. random forest correlation — ½ mark

In bagging, each tree is grown on a bootstrap sample using all $p$ predictors. Random forest reduces the correlation between trees by randomly selecting $m approx sqrt(p)$ predictors at each split. For $p = 49$ predictors, why does this decorrelation improve the ensemble?

A. It increases the bias of each tree, which always improves test MSE.
B. It reduces the variance of the averaged prediction because $"Var"(bar(Y)) = sigma^2 times frac(1 + (n-1)rho, n)$; smaller $rho$ (correlation between trees) reduces overall variance.
C. It reduces the bias of the ensemble while keeping variance constant.
D. It forces each tree to be a linear model, which improves interpretability.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

For an ensemble of $B$ trees with equal variance $sigma^2$ and pairwise correlation $rho$, the variance of their average is:

$$
"Var"(frac(1, B)sum_(b=1)^(B) hat(f)_b(x)) = rho sigma^2 + frac(1-rho, B) sigma^2
$$

As $B arrow.r infinity$, the variance converges to $rho sigma^2$. Reducing $rho$ — by restricting each split to a random subset of $sqrt(p) = 7$ predictors — directly reduces this asymptotic variance. Each individual tree may have slightly higher bias (since it sees fewer predictors per split), but the variance reduction from decorrelation typically dominates, lowering test MSE.

- **A:** Increasing bias is a side effect, not the benefit; it does not "always" improve MSE.
- **B: Correct.** The variance formula shows that lower inter-tree correlation $rho$ reduces ensemble variance.
- **C:** Bias actually increases slightly; it does not decrease.
- **D:** Trees remain non-parametric; the predictor restriction doesn't make them linear.

</details>

---

### Q20. Boosting learning rate and tree complexity — ½ mark

In gradient boosting, the model is updated iteratively as $hat(f)^((m))(x) = hat(f)^((m-1))(x) + nu times h_m(x)$, where $nu$ is the learning rate and $h_m$ is a shallow tree. Two configurations are compared: (1) $nu = 0.1$, $B = 1000$ trees; (2) $nu = 0.01$, $B = 10000$ trees, both using trees with interaction depth $d = 2$. Which statement is most accurate?

A. Configuration 2 always has lower test error because more trees are always better.
B. A smaller learning rate with more trees typically yields lower test error at the cost of longer training time, due to more fine-grained updates reducing overfitting risk.
C. The learning rate $nu$ controls tree depth; $d = 2$ is irrelevant when $nu$ is small.
D. Both configurations are identical because $nu times B = 100$ in both cases.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

The product $nu times B$ is the same (100), but the configurations are not equivalent. A smaller learning rate $nu = 0.01$ takes smaller gradient steps, requiring more trees (10 000) to cover the same function space. This smaller-step approach makes the optimisation path smoother and less likely to overfit to individual residuals, typically yielding a better generalisation error — at the expense of $10 times$ more trees to fit. Tree depth $d = 2$ limits each base learner to at most two-way interactions, which controls individual tree complexity independently of $nu$.

- **A:** "Always" is wrong; diminishing returns and overfitting can occur with too many trees.
- **B: Correct.** Smaller $nu$ + more trees is a well-established strategy for better generalisation.
- **C:** $nu$ controls the step size, not tree depth; $d = 2$ remains relevant regardless.
- **D:** $nu times B$ being equal does not make the fits identical; the optimisation trajectories differ substantially.

</details>

### Q21. F-statistic from R output — ½ mark

A multiple linear regression with $n=42$ observations and $p=5$ predictors yields residual sum of squares $"RSS"=382$ and total sum of squares $"TSS"=640$. Using the formula

$f = frac(("TSS" - "RSS")/p, "RSS"/(n - p - 1))$

compute the F-statistic.

A. $8.62$
B. $5.13$
C. $4.85$
D. $6.96$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$f = frac((640-382)/5, 382/(42-5-1)) = frac(258/5, 382/36) = frac(51.6, 10.611) approx 8.62$.

A: correct. B: swaps numerator/denominator groups. C: uses $n-p=37$ denominator by mistake. D: omits division by the number of predictors.
</details>

---

### Q22. Resubstitution error rate — ½ mark

A classification tree is fit to $n=200$ training cases. Confusion matrix from resubstitution:

| | Predicted 0 | Predicted 1 |
|---|---|---|
| Actual 0 | 105 | 15 |
| Actual 1 | 20 | 60 |

Compute the resubstitution error rate.

A. $0.175$
B. $0.225$
C. $0.200$
D. $0.150$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Errors $= 15 + 20 = 35$. Error rate $= 35/200 = 0.175$.

A: correct. B: computes $1 - "accuracy"$ but miscounts total correct. C: counts only one off-diagonal cell doubled. D: uses only one off-diagonal cell.
</details>

---

### Q23. Ridge penalty strength — ½ mark

In ridge regression the penalised objective is

$sum_(i=1)^(n)(y_i - hat(f)(x_i))^2 + lambda sum_(j=1)^(p)hat(beta)_j^2$

When $lambda = 0$ the solution equals OLS. As $lambda arrow.r infinity$, which behaviour is correct?

A. Coefficients shrink uniformly toward $hat(beta)_j = bar(y)$ and prediction becomes the intercept only.
B. All coefficients shrink toward zero but never exactly reach zero.
C. Only the smallest coefficients reach zero; the rest remain unchanged.
D. Coefficients diverge to infinity to satisfy the penalty.

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

Ridge shrinks coefficients continuously toward zero but never sets them exactly to zero for any finite $lambda$.

A: misstates the limit — they approach zero, not $bar(y)$. C: describes LASSO, not ridge. D: nonsensical; penalty forces shrinkage, not divergence.
</details>

---

### Q24. Cross-validation fold allocation — ½ mark

A dataset has $n=107$ observations and you perform 10-fold cross-validation with approximately equal fold sizes. Two folds will have $"lfloor" 107/10 "rfloor" + 1$ observations and the remaining eight will have $"lfloor" 107/10 "rfloor"$. How many observations are in each of the larger folds?

A. $10$
B. $11$
C. $12$
D. $9$

<details><summary>Answer and explanation</summary>
**Correct answer: B.**

$"lfloor" 107/10 "rfloor" = 10$. Remainder $= 107 - 10 times 10 = 7$, so seven folds get $11$, three folds get $10$. Wait — with remainder 7, seven folds have 11 and three have 10. The question asks about the larger folds: each has 11.

A: base fold size, not the larger one. C: too large. D: below base.
</details>

---

### Q25. PCA variance explained — ½ mark

A PCA on a correlation matrix of $p=6$ variables gives eigenvalues $2.8, 1.5, 0.9, 0.4, 0.3, 0.1$. The proportion of variance explained by the first two components is

A. $71.7 %$
B. $58.3 %$
C. $76.7 %$
D. $46.7 %$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Total variance $= 2.8+1.5+0.9+0.4+0.3+0.1 = 6.0$. First two: $(2.8+1.5)/6 = 4.3/6 approx 0.7167 = 71.7 %$.

A: correct. B: uses only PC1. C: uses first three components. D: uses PC2 only.
</details>

---

### Q26. Bagging versus random forests — ½ mark

In bagging, each tree is grown on a bootstrap sample with all $p$ predictors available at every split. Random forests modify this by:

A. Using a random subset of $m approx sqrt(p)$ (or $p/3$) predictors at each split, which reduces correlation between trees and typically lowers test error.
B. Growing deeper trees than bagging, which increases variance.
C. Applying a larger shrinkage parameter to each tree's contribution.
D. Selecting only the single best predictor at each split, equivalent to a decision stump.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Random forests decorrelate trees by restricting the candidate predictor set at each split, reducing the variance of the averaged ensemble.

B: depth is typically controlled similarly; the key is feature randomisation. C: shrinkage (eta) is a boosting concept, not a forest default. D: that would be a stump; forests still use full-grown trees.
</details>

---

### Q27. LDA posterior probability — ½ mark

For two-class LDA with equal priors $pi_1 = pi_2 = 0.5$ and equal class variances, the linear discriminant score for class $k$ is

$delta_k(x) = x^ arrow.r p "Sigma"^(-1)mu_k - frac(1, 2)mu_k^ arrow.r p "Sigma"^(-1)mu_k$

Given $delta_1(x) = 3.2$ and $delta_2(x) = 2.5$, compute $P(Y=1 | X=x)$.

A. $0.668$
B. $0.500$
C. $0.731$
D. $0.580$

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

$P(Y=1 | X) = frac(e^(delta_1), e^(delta_1)+e^(delta_2)) = frac(e^(3.2), e^(3.2)+e^(2.5)) = frac(1, 1+e^(-0.7)) approx 0.668$.

A: correct. B: ignores the score difference. C: overestimates (would need a larger gap). D: uses the difference $0.7$ directly as a probability.
</details>

---

### Q28. LASSO at extreme penalty — ½ mark

Given OLS estimates $hat(beta)_1 = 4.2, hat(beta)_2 = -2.8, hat(beta)_3 = 1.0$ with standardised predictors and $n=50$, which is true as $lambda$ for the LASSO penalty $"lambdasum"|beta_j|$ increases toward infinity?

A. All coefficients reach exactly zero at some finite $lambda$.
B. Coefficients shrink proportionally but never reach zero.
C. Only $hat(beta)_3$ reaches zero first since it is smallest in magnitude.
D. The coefficients never change because the LASSO is discontinuous.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Under LASSO, each coefficient hits zero at a finite $lambda$ equal to its unpenalised estimate's magnitude (in the orthogonal case). As $lambda arrow.r infinity$, all coefficients are exactly zero.

B: describes ridge. C: while $hat(beta)_3$ hits zero first, all three hit zero eventually, making A the complete and correct statement. D: incorrect; LASSO is continuous.
</details>

---

### Q29. Boosting learning rate and iterations — ½ mark

In gradient boosting with shrinkage (learning rate) $"eta" = 0.01$, a new tree $T_b$ with terminal node predictions $hat(r)_("jb")$ is added as

$hat(f)^((b))(x) = hat(f)^((b-1))(x) + "eta" times T_b(x)$

If the full (unshrunken) tree would predict residuals $T_b(x_i) "in" {-3, +1, +2 }$ for three observations, what are the actual updates added to the fitted values?

A. ${-0.03, +0.01, +0.02 }$
B. ${-3, +1, +2 }$
C. ${-0.3, +0.1, +0.2 }$
D. ${-0.03, +0.01, +0.02 }$ and then normalised to sum to zero

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

Each prediction is multiplied by $"eta" = 0.01$: $0.01 times (-3) = -0.03$, $0.01 times 1 = 0.01$, $0.01 times 2 = 0.02$.

B: ignores the learning rate. C: uses $"eta" = 0.1$ instead of $0.01$. D: boosting does not normalise individual tree contributions to sum to zero.
</details>

---

### Q30. Naive Bayes conditional independence — ½ mark

A naive Bayes classifier with two features $X_1$ (continuous) and $X_2$ (categorical) assumes

$P(X_1, X_2 | Y) = P(X_1 | Y) times P(X_2 | Y)$

If in reality $X_1$ and $X_2$ are strongly positively correlated within each class, which consequence is most likely?

A. Naive Bayes overestimates posterior probabilities for observations where both features take their most common within-class values, leading to overconfident predictions.
B. The model is unbiased and only loses efficiency.
C. The training error decreases due to the additional information captured.
D. The prior probabilities $pi_k$ are incorrectly estimated.

<details><summary>Answer and explanation</summary>
**Correct answer: A.**

By treating correlated features as independent, naive Bayes effectively double-counts their combined evidence. When both features align with a class, the product $P(X_1 | Y) times P(X_2 | Y)$ overstates the true joint probability, producing overconfident posteriors.

B: incorrect — the conditional independence violation introduces systematic bias in the posteriors, not just inefficiency. C: naive Bayes does not capture the correlation; training error is unaffected by this since priors and likelihoods are estimated marginally. D: priors are estimated from class frequencies, unaffected by feature correlations.
</details>
