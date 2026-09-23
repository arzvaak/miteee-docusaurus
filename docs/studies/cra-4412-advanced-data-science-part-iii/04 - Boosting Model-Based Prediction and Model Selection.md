---
title: "04 - Boosting Model-Based Prediction and Model Selection"
math_syntax: typst
---

# Boosting, Model-Based Prediction and Model Selection

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Practical Machine Learning — Week 4

---

## First, read the notation in words

A **weak learner** is a simple model that performs only a modest correction. Boosting adds learners sequentially; each new learner targets remaining error. The **learning rate** scales each correction, so a smaller rate normally needs more rounds. **Regularization** penalizes large or numerous coefficients to reduce overfitting. Lasso can shrink some coefficients to zero; ridge shrinks them toward zero but usually keeps them. Select tuning parameters using validation or cross-validation, then evaluate once on test data.

> [!question] Try to recall
> Explain why training error can improve after validation error has started to worsen.

---

## 1. Boosting

Boosting combines weak classifiers into a strong one by iteratively weighting observations, focusing on misclassified cases in each round.

Boosting combines many **weak classifiers** into a single **strong classifier** by iteratively weighting observations.

### Process

The boosting process builds a weighted sum $f(x) = sum_i alpha_i h_i(x)$ of weak classifiers, iteratively adjusting weights to minimize training error.

1. Start with a set of classifiers $h_1, dots.h, h_K$ (e.g. stumps, shallow trees)
2. Compute a weighted sum as the prediction:

$$
f(x) = sum_i alpha_i h_i(x)
$$

where $alpha_i$ is the weight and $h_i(x)$ is the classifier output.

3. Minimise error on the training set **iteratively**:
   - Select one classifier $h$ at each step
   - Calculate weights based on errors
   - **Up-weight** misclassified observations
   - Select the next $h$ to focus on the hard cases

### Key Insight

A group of weak predictors (e.g. straight-line classifiers) can be combined and weighted to become a much stronger predictor. Each subsequent classifier focuses on what the previous ones got wrong.

### R Implementation

```r
library(ISLR); data(Wage)
Wage <- subset(Wage, select = -c(logwage))
inTrain <- createDataPartition(y = Wage$wage, p = 0.7, list = FALSE)
training <- Wage[inTrain, ]; testing <- Wage[-inTrain, ]

modFit <- train(wage ~ ., method = "gbm", data = training, verbose = FALSE)
print(modFit)
```

Available boosting methods in `caret`:
- `gbm` — gradient boosting with trees
- `mboost` — model-based boosting
- `ada` — statistical boosting (additive logistic regression)
- `gamBoost` — boosting generalized additive models

---

## 2. Model-Based Prediction

Model-based prediction assumes data follow a **probabilistic model** and uses **Bayes' theorem** to find optimal classifiers.

### Bayes' Theorem Approach

Model-based classification uses Bayes' theorem to compute posterior probabilities $P(Y = k | X = x)$ from class-conditional densities and priors.

We want to compute $P(Y = k | X = x)$, the probability that the outcome is class $k$ given the observed predictors $x$.

**Step 1**: Apply Bayes' theorem:

$$
P(Y = k | X = x) = frac(P(X = x | Y = k) P(Y = k), sum_(ell=1)^(K) P(X = x | Y = ell) P(Y = ell))
$$

**Step 2**: Assume $P(X = x | Y = k)$ follows a parametric distribution $f_k(x)$. A common choice is the **Gaussian distribution**:

$$
f_k(x) = 1 / (sigma_k sqrt(2 pi)) exp(-(x - mu_k)^2 / (2 sigma_k^2))
$$

**Step 3**: Let $P(Y = k) = pi_k$ (the **prior probability**, estimated from data).

**Step 4**: Rewrite as:

$$
P(Y = k | X = x) = frac(f_k(x) pi_k, sum_(ell=1)^(K) f_ell(x) pi_ell)
$$

**Step 5**: Estimate parameters ($mu_k$, $sigma_k^2$) from data, then classify to the class with the highest posterior probability.

### Linear Discriminant Analysis (LDA)

LDA assumes class-conditional Gaussian distributions with a common covariance matrix $Sigma$, leading to linear decision boundaries.

LDA assumes $f_k(x)$ is **multivariate Gaussian** with a **common covariance matrix** $Sigma$ across all classes.

The **log-ratio** of posterior probabilities simplifies to:

$$
log (P(Y = k | X = x) / P(Y = j | X = x)) = log (pi_k / pi_j) - 1/2 (mu_k + mu_j)^(T) Sigma^(-1) (mu_k + mu_j) + x^(T) Sigma^(-1) (mu_k - mu_j)
$$

This is a **linear function** of $x$ — hence the decision boundaries are lines (or hyperplanes in higher dimensions).

The **discriminant function** is:

$$
delta_k(x) = x^(T) Sigma^(-1) mu_k - 1/2 mu_k^(T) Sigma^(-1) mu_k + log(pi_k)
$$

Classify to: $hat(Y)(x) = op("argmax", limits: #true)_k delta_k(x)$

```r
data(iris)
inTrain <- createDataPartition(y = iris$Species, p = 0.7, list = FALSE)
training <- iris[inTrain, ]; testing <- iris[-inTrain, ]

lda <- train(Species ~ ., data = training, method = "lda")
pred.lda <- predict(lda, testing)
pred.lda
```

### Quadratic Discriminant Analysis (QDA)

Same as LDA but allows a **different covariance matrix** for each class, producing **quadratic** (curved) decision boundaries. More flexible but requires estimating more parameters.

### Naive Bayes

Naive Bayes assumes predictor independence given the class, simplifying posterior computation to $P(Y = k) product_j P(X_j | Y = k)$.

Naive Bayes assumes all predictor variables are **conditionally independent** given the class:

$$
P(Y = k | X_1, dots.h, X_m) prop pi_k product_(j=1)^(m) P(X_j | Y = k)
$$

This is "naive" because predictors are rarely truly independent, but the simplification:
- Reduces computational complexity dramatically
- Works well with **large numbers of binary/categorical variables** (e.g. text classification)

```r
nb <- train(Species ~ ., data = training, method = "nb")
pred.nb <- predict(nb, testing)
```

### Comparing LDA and Naive Bayes

```r
table(pred.lda, pred.nb)
equalPredictions <- (pred.lda == pred.nb)
qplot(Petal.Width, Sepal.Width, colour = equalPredictions, data = testing)
```

For small datasets, LDA and naive Bayes often produce very similar results.

---

## 3. Model Selection

Model selection balances bias and variance to minimize expected prediction error on unseen data, avoiding both under- and over-fitting.

### Training vs Test Error Behaviour

- As model complexity increases, **training error always decreases**
- **Test error decreases first, then increases** (over-fitting)

The goal is to minimise test error by finding the right balance of complexity.

### Expected Prediction Error Decomposition

The expected prediction error decomposes into irreducible error $sigma^2$, squared bias $"Bias"^2$, and variance $"Var"$.

For model $hat(f)_lambda$ with tuning parameter $lambda$:

$$
"EPE"(lambda) = E[(Y - hat(f)_lambda (X))^2] = underbrace(sigma^2, "Irreducible") + underbrace("Bias"^2 (hat(f)_lambda), "Bias") + underbrace("Var"(hat(f)_lambda), "Variance")
$$

- **Irreducible error** ($sigma^2$): noise in the data — cannot be reduced
- **Bias**: systematic error from wrong model assumptions
- **Variance**: sensitivity to fluctuations in training data

### Regularised Regression

Regularized regression shrinks coefficients via a penalty $P(lambda; beta)$, trading increased bias for reduced variance to prevent over-fitting.

#### The Problem

With highly correlated predictors, unconstrained regression can produce coefficients with very large values (high variance). Regularisation trades a small increase in bias for a large reduction in variance.

#### Penalised Residual Sum of Squares

$$
"PRSS"(beta) = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + P(lambda; beta)
$$

The penalty term $P(lambda; beta)$ shrinks coefficients toward zero.

#### Ridge Regression

The penalty is the $L_2$ norm:

$$
"PRSS"(beta) = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + lambda sum_(j=1)^(p) beta_j^2
$$

- As $lambda -> 0$: approaches ordinary least squares
- As $lambda -> infinity$: all coefficients shrink toward zero
- All predictors **remain in the model** (coefficients shrink but are never exactly zero)
- Makes the problem **non-singular** even when $X^(T) X$ is not invertible (more predictors than observations)

```r
library(MASS)
ridge <- lm.ridge(lpsa ~ ., data = prostate, lambda = 5)
ridge$coef   # shrunken coefficients
ridge$xm     # column means used for centering
ridge$scale  # scaling factors
```

#### Lasso Regression

The penalty is the $L_1$ norm:

$$
"PRSS"(beta) = sum_(i=1)^(n) (Y_i - beta_0 - sum_(j=1)^(p) X_(i j) beta_j)^2 + lambda sum_(j=1)^(p) |beta_j|
$$

Key difference from ridge: lasso can set coefficients **exactly to zero**, performing automatic variable selection.

#### Choosing $lambda$

Use **cross-validation** to select $lambda$ that minimises prediction error. Plot test RSS against $lambda$ and choose the minimum.

### Hard Thresholding

Hard thresholding selects exactly $lambda$ non-zero coefficients, a computationally intensive but effective approach for high-dimensional data.

For high-dimensional data (more predictors than observations):
- Ordinary regression cannot estimate all coefficients
- Fix $lambda$ (number of non-zero coefficients) and try all $binom(p, lambda)$ subsets
- Computationally intensive but effective

---

## 4. Unsupervised Prediction (Clustering + Prediction)

Unsupervised prediction combines clustering (e.g., k-means) to create pseudo-labels with supervised modeling for prediction tasks without outcomes.

When no outcome labels are available:

1. **Cluster** the data (e.g. k-means) to create pseudo-labels
2. Build a supervised prediction model using the cluster assignments as the outcome
3. For new data: predict cluster membership, then apply the supervised model

```r
data(iris)
inTrain <- createDataPartition(y = iris$Species, p = 0.7, list = FALSE)
training <- iris[inTrain, ]; testing <- iris[-inTrain, ]

kMeans1 <- kmeans(subset(training, select = -c(Species)), centers = 3)
training$clusters <- as.factor(kMeans1$cluster)

# Compare clusters to truth
table(kMeans1$cluster, training$Species)

# Build model with clusters as outcome
clustering <- train(clusters ~ ., data = subset(training, select = -c(Species)), method = "rpart")

# Evaluate
table(predict(clustering, training), training$Species)
table(predict(clustering, testing), testing$Species)
```

This is also the basic approach behind **recommendation engines**: cluster existing users, then predict preferences for new users based on their cluster.

---

## Key Intuitions

1. **Boosting** builds strong classifiers from weak ones by iteratively focusing on misclassified observations.
2. **Model-based prediction** uses Bayes' theorem and distributional assumptions to classify — LDA draws lines, QDA draws curves, naive Bayes assumes independence.
3. **Ridge regression** shrinks all coefficients (keeps all predictors); **lasso** can set coefficients to zero (performs variable selection).
4. The **bias–variance decomposition** is the theoretical framework for understanding model selection.
5. **Unsupervised prediction** (clustering + supervised learning) is useful when labels are unavailable.

---

## Revision Checklist

- [ ] Can explain the boosting process and its objective
- [ ] Can derive the LDA discriminant function from Bayes' theorem
- [ ] Can explain the naive Bayes independence assumption and when it works well
- [ ] Can describe the bias–variance–irreducible error decomposition
- [ ] Can distinguish ridge from lasso regression (L2 vs L1 penalty)
- [ ] Can explain how $lambda$ controls the bias–variance trade-off in regularised regression
- [ ] Can describe unsupervised prediction (clustering → supervised model)
- [ ] Can use `train()` with `method = "gbm"`, `method = "lda"`, `method = "nb"`, `method = "ridge"`
---

## Make it click: Slow updates accumulate

**Work it through.** Suppose a weak learner suggests a correction of +4 to a prediction. With learning rate 0.1, the update adds 0.4; with rate 0.01, it adds 0.04. The smaller rate usually needs more rounds. Validation performance must decide when to stop; training error alone can keep improving after generalization worsens.

**See it.** Use the Model complexity tab as a model-selection analogy. Move past the minimum validation error and explain why another fitting round can hurt. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#complexity)

**What the questions are checking.** [Midsem MCQ Mock Test 1](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-test-1) Q7/Q17/Q26 focus on boosting updates; Q8/Q18/Q27 on model assumptions; Q9/Q19 on regularization.

> [!warning] Common trap
> A smaller learning rate is a tuning choice, not a guarantee of better predictions at any fixed number of trees.
