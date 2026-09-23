---
title: "01 - Prediction and Study Design"
math_syntax: typst
---

# Prediction and Study Design

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Practical Machine Learning — Week 1

---

## First, read the notation in words

A **feature** is information available when a prediction will actually be made; an **outcome** is what you try to predict. Training data fit model parameters. Validation data guide model choices. Test data give one final estimate of performance on unseen cases. **Bias** means systematic underfitting; **variance** means fitted predictions change a lot across different training samples. A confusion matrix counts true positives, false positives, false negatives and true negatives against a named positive class.

> [!question] Try to recall
> Say which dataset can influence model choice and which must stay untouched until the end.

---

## 1. What Is Prediction?

Prediction involves estimating an unknown outcome for a new observation using a model trained on existing data.

Prediction is the process of using observed data to estimate an unknown outcome for a new observation. The canonical pipeline is:

$$
"population" arrow.r.long "sampling" arrow.r.long "training/test split" arrow.r.long "build model" arrow.r.long "predict" arrow.r.long "evaluate"
$$

> [!note] Choosing the right dataset and framing a **concrete, specific question** are more important than the choice of algorithm. Google Flu Trends famously failed when users' search behaviour shifted — the data no longer matched the question.

### Components of a Predictor

| Step | Description |
|------|-------------|
| **Question** | Must be concrete and specific |
| **Input data** | Must be relevant to the question |
| **Features** | Variables/characteristics extracted from the data |
| **Algorithm** | The modelling procedure applied |
| **Parameters** | Estimates derived from fitting the algorithm |
| **Evaluation** | Quantifying how well the predictor performs |

The **relative order of importance** is:

$$
"question" > "data" > "features" > "algorithms"
$$

### Feature and Data Selection

Selecting appropriate features and relevant data is crucial for building effective predictive models.

- **Good features** lead to data compression, retain relevant information, and are created using domain knowledge.
- **Common mistakes**: automated feature selection (unstable with slightly different data), ignoring skewed data/outliers, discarding information prematurely.
- **More data** generally leads to better models, but only if the data is **relevant**. "Garbage in = garbage out."

### Algorithm Selection

The choice of algorithm involves trade-offs between interpretability, accuracy, and scalability.

Algorithms matter less than one would expect. A sensible approach forms the foundation; more complex algorithms yield only incremental improvements. The ideal algorithm is:

- **Interpretable** — easy to explain how features map to predictions
- **Accurate** — low out-of-sample error
- **Scalable** — runs efficiently on large datasets

Prediction is fundamentally about **trade-offs** between interpretability, accuracy, speed, simplicity, and scalability.

---

## 2. In-Sample vs Out-of-Sample Error

| Error Type | Definition | Also Known As |
|-----------|-----------|---------------|
| **In-sample error** | Error on the data used to build the model | Resubstitution error |
| **Out-of-sample error** | Error on new, unseen data | Generalization error |

**Typical relationship**: Training error is optimistic because the model was fitted on those cases. Out-of-sample error is often higher on average, but one particular test set can score better by chance. Overfitting makes the gap larger.

Data consists of **signal** (the true underlying pattern) and **noise** (random variation). A complex model can fit both signal and noise in the training set, but on new data it captures noise that isn't there — hence worse performance.

> [!tip] It is often better to sacrifice a small amount of training-set accuracy for greater robustness on new data.

### Worked Example: Spam Classification

This example demonstrates overfitting using a spam classification dataset.

Using the `spam` dataset from `kernlab`:

```r
library(kernlab); data(spam); set.seed(333)

# Pick a small subset of 10 observations
smallSpam <- spam[sample(dim(spam)[1], size = 10), ]
spamLabel <- (smallSpam$type == "spam") * 1 + 1
plot(smallSpam$capitalAve, col = spamLabel)

# Rule 1: Complex (over-fits every interval)
rule1 <- function(x) {
  prediction <- rep(NA, length(x))
  prediction[x > 2.7]             <- "spam"
  prediction[x < 2.40]            <- "nonspam"
  prediction[(x >= 2.40 & x <= 2.45)]  <- "spam"
  prediction[(x > 2.45 & x <= 2.70)]   <- "nonspam"
  return(prediction)
}

# Rule 2: Simple threshold at 2.8
rule2 <- function(x) {
  prediction <- rep(NA, length(x))
  prediction[x > 2.8]  <- "spam"
  prediction[x <= 2.8] <- "nonspam"
  return(prediction)
}

# Compare in-sample and out-of-sample accuracy
rbind(
  "Rule 1" = c(Accuracy = mean(rule1(spam$capitalAve) == spam$type)),
  "Rule 2" = c(Accuracy = mean(rule2(spam$capitalAve) == spam$type))
)
```

**Result**: Rule 1 has perfect in-sample accuracy but **worse** out-of-sample accuracy than Rule 2, because it over-fitted the small training sample.

---

## 3. Prediction Study Design

### Step-by-step Procedure

1. **Define the error rate** — decide on Type I / Type II error importance
2. **Split the data** into training, testing, and (optionally) validation sets
3. **Pick features** from the training set using cross-validation
4. **Pick the prediction function** (model) using cross-validation
5. **Apply to test set once** (if no validation set) or refine then apply to validation set once

> [!warning] The test/validation set must remain **completely untouched** during model building. Apply the final model to it only once.

### Sample Splitting Guidelines

| Sample Size | Training | Test | Validation |
|------------|----------|------|------------|
| **Large** | 60% | 20% | 20% |
| **Medium** | 60% | 40% | None |
| **Small** | Use cross-validation | Report caveat | None |

### Avoiding Small Sample Problems

Small sample sizes can lead to misleadingly high accuracy by chance.

For a binary outcome (e.g. coin flip):
- $n = 1$: probability of 100% accuracy = 50%
- $n = 10$: probability of 100% accuracy = 0.1%

High accuracy on small samples may be purely by chance. Always use adequately sized datasets.

### Data Selection Principles

- Use **like data** to predict like
- Weight variables by domain understanding
- Avoid predicting on **unrelated data** (the most common mistake)
- For time-dependent data, split training/test by time (**backtesting**)

---

## 4. Types of Errors

For binary classification, predictions fall into four categories:

|  | Actually Positive | Actually Negative |
|--|------------------|-------------------|
| **Predicted Positive** | True Positive (TP) | False Positive (FP) |
| **Predicted Negative** | False Negative (FN) | True Negative (TN) |

### Binary Error Metrics

Binary error metrics include accuracy and Cohen's Kappa, which adjust for chance agreement. Here, TP, FP, FN, and TN denote true positives, false positives, false negatives, and true negatives, respectively.

**Accuracy** — proportion correct, weighting FP and FN equally.

**Cohen's Kappa** (concordance) — adjusts accuracy for chance agreement:

$$
kappa = ("accuracy" - P(e)) / (1 - P(e))
$$

where

$$
P(e) = frac("TP" + "FP", "total") times frac("TP" + "FN", "total") + frac("TN" + "FN", "total") times frac("FP" + "TN", "total")
$$

**Prevalence matters**. If a disease affects 0.1% of the population, even a 99%-sensitive, 99%-specific test will produce many false positives relative to true positives.

### Continuous Error Metrics

Continuous error metrics include mean squared error (MSE), root mean squared error (RMSE), and median absolute deviation.

| Metric | Formula | Notes |
|--------|---------|-------|
| **MSE** | $1/n sum_(i=1)^(n) (hat(Y)_i - Y_i)^2$ | Sensitive to outliers |
| **RMSE** | $sqrt(1/n sum_(i=1)^(n) (hat(Y)_i - Y_i)^2)$ | Same units as $Y$; most common measure |
| **Median Absolute Deviation** | $"median"(|hat(Y)_i - Y_i|)$ | Robust to outliers |

---

## 5. ROC Curves

ROC curves plot sensitivity against 1-specificity for binary classifiers. AUC measures the overall performance.

**Receiver Operating Characteristic (ROC)** curves evaluate binary classifiers across all possible thresholds.

- **x-axis**: $1 - "specificity"$ (false positive rate)
- **y-axis**: $"sensitivity"$ (true positive rate)
- **Area under curve (AUC)**:
  - $0.5$ = random guessing
  - $0.8$ = good classifier
  - $1.0$ = perfect classifier

Each point on the curve corresponds to a different classification threshold. A higher AUC means the classifier can better distinguish between classes regardless of the chosen threshold.

---

## 6. Key Intuitions

1. **Over-fitting** is the fundamental enemy: a model that perfectly fits training data will usually fail on new data.
2. **Cross-validation** provides an honest estimate of out-of-sample performance without wasting data.
3. **Feature quality** and **data quality** dominate algorithm choice.
4. Always ask: "What is the concrete question?" and "Is the data relevant to this question?"
5. ROC curves and confusion matrices give complementary views of classifier performance.

---

## Revision Checklist

- [ ] Can explain the prediction pipeline from population to evaluation
- [ ] Can distinguish in-sample from out-of-sample error and explain over-fitting
- [ ] Can describe appropriate sample-splitting strategies for large, medium, and small datasets
- [ ] Can compute and interpret accuracy, kappa, MSE, RMSE
- [ ] Can read and interpret an ROC curve and explain what AUC measures
- [ ] Understands why the question > data > features > algorithms in importance
- [ ] Knows why test/validation sets must be held out and used only once
---

## Make it click: Choose on unseen error

**Work it through.** Suppose a flexible classifier makes 2 errors in 100 training cases and 24 errors in 100 held-out cases. A simpler rule makes 9 training errors and 12 held-out errors. The simpler rule predicts better on the evidence available. Training error is optimistic because fitting already used those examples.

**See it.** Use the Model complexity tab. Move right until training error falls but validation error starts to rise. Explain why the turning point matters. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#complexity)

**What the questions are checking.** [Midsem MCQ Mock Test 1](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-test-1) Q1/Q23 test the bias–variance trade-off. Q12 contrasts error measures. Identify which dataset produced a reported score before comparing models.

> [!warning] Common trap
> Never keep trying models against the final test set; it then becomes part of model selection.
