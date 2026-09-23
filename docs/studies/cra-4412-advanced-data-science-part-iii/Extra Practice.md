---
title: "Extra Practice"
math_syntax: typst
---

# Extra Practice

> Generated practice questions covering the full CRA 4412 syllabus. Not sourced from any official examination.

---

## Practical Machine Learning — Practice Questions

---

### P1. Prediction Pipeline

**In what order should the following steps be performed when building a prediction model?**

A. Evaluate on test set
B. Define the error rate
C. Pick features from training set
D. Split data into training and test
E. Pick prediction function on training set

**Answer**: B → D → C → E → A

**Explanation**: First define what "error" means (B), then split data so the test set is protected (D), then select features using only training data (C), then choose and fit the model (E), and finally evaluate once on the test set (A).

---

### P2. Error Types

A medical test for a rare disease (1% prevalence) has 95% sensitivity and 95% specificity. A randomly selected person tests positive. What is the approximate probability they actually have the disease?

**Answer**:

Using Bayes' theorem:

$$
P("disease" | +) = frac(P(+ | "disease") times P("disease"), P(+))
$$

$$
P(+) = 0.95 times 0.01 + 0.05 times 0.99 = 0.0095 + 0.0495 = 0.059
$$

$$
P("disease" | +) = 0.0095 / 0.059 approx 0.161
$$

**Probability ≈ 16.1%**. Despite high sensitivity and specificity, the low prevalence means most positives are false positives.

---

### P3. Cross-Validation

You have a dataset with 1000 observations. You perform 10-fold cross-validation. How many observations are in each test fold, and how many unique observations serve as test data across all folds?

**Answer**: Each fold has approximately $1000/10 = 100$ test observations. Across all 10 folds, every observation appears in exactly one test fold, so 1000 unique observations serve as test data. The total number of test observations across all folds is also 1000.

---

### P4. Preprocessing

Why must the mean and standard deviation from the **training set** be used to normalise the test set, rather than the test set's own mean and SD?

**Answer**: If you normalise the test set using its own statistics, you are leaking information from the test set into the model-building process. The model must be evaluated as if the test data were truly "new" — unseen during training. Using training-set statistics ensures the preprocessing is consistent and the test evaluation is honest.

---

### P5. PCA

You perform PCA on a dataset with 50 predictors. The first 5 principal components explain 85% of the variance. Should you use all 50 predictors or just the first 5 PCs in your model? Discuss the trade-off.

**Answer**: Using just 5 PCs reduces dimensionality from 50 to 5, retaining 85% of the information. Benefits: reduced computation, less noise (averaging effect), lower over-fitting risk. Trade-offs: 15% of variance is lost (potentially important signal), and the PCs are linear combinations of all original variables — making interpretation harder. For prediction-focused tasks, 5 PCs are usually sufficient. For tasks requiring interpretability of individual variables, PCA may not be ideal.

---

### P6. Ridge vs Lasso

You have a dataset with 200 predictors but only 50 observations. Which would you prefer: ridge or lasso? Why?

**Answer**: **Lasso** is generally preferred here because:
1. With $p > n$ (200 > 50), ordinary regression cannot be fit — lasso's $L_1$ penalty makes the problem solvable and performs variable selection.
2. Lasso can zero out coefficients, automatically selecting a subset of the 200 predictors — producing a sparse, interpretable model.
3. Ridge would keep all 200 predictors (with shrunken coefficients), resulting in a less interpretable model with potential over-fitting.

However, if many of the 200 predictors are correlated (grouped), ridge may perform better because it keeps all correlated variables rather than arbitrarily selecting one.

---

### P7. Random Forests

Explain why random forests often outperform a single decision tree, and why they use random variable selection at each split rather than considering all variables.

**Answer**: A single decision tree has **high variance** — small changes in the training data can produce very different trees. Random forests reduce variance by averaging many trees (bagging). However, if the same strong predictor dominates every split, all trees will be similar (correlated), limiting the variance reduction from averaging. By randomly selecting only $m$ of $p$ predictors at each split, random forests **decorrelate** the trees — forcing the algorithm to consider weaker predictors, which diversifies the ensemble and further reduces variance.

---

### P8. Model-Based Prediction

Under what assumptions does LDA produce linear decision boundaries, and how does QDA differ?

**Answer**: LDA assumes:
1. Each class-conditional density $f_k(x)$ is **multivariate Gaussian**
2. All classes share a **common covariance matrix** $Sigma$

Because $Sigma$ is common, the quadratic terms $x^(T) Sigma^(-1) x$ cancel when computing the log-ratio of posteriors, leaving a linear function of $x$.

QDA relaxes assumption 2 — each class has its **own** covariance matrix $Sigma_k$. The quadratic terms no longer cancel, producing quadratic (curved) decision boundaries. QDA is more flexible but requires estimating more parameters.

---

## Developing Data Products — Practice Questions

---

### P9. Shiny Architecture

What are the two essential files in a Shiny application, and what is the role of each?

**Answer**:
- **`ui.R`**: Defines the user interface — layout, input widgets, output placeholders. Contains a call to `shinyUI()` with layout functions like `pageWithSidebar()`, `fluidPage()`, etc.
- **`server.R`**: Defines the server logic — reactive expressions, render functions. Contains a call to `shinyServer(function(input, output) { ... })`.

---

### P10. Reactive Expressions

What is the difference between a reactive expression and a render function in Shiny?

**Answer**:
- A **reactive expression** (`reactive({...})`) wraps a computation that depends on inputs. It is **cached** — only re-evaluated when its dependencies change. It returns a value that can be used by other reactives or render functions.
- A **render function** (`renderText({...})`, `renderPlot({...})`, etc.) produces the actual output that appears in the UI. It is connected to an output slot in `ui.R` via `output$xxx`.

Reactive expressions are intermediate computations; render functions are terminal outputs.

---

### P11. googleVis

How do you combine two googleVis charts into a single visualisation? What limitation exists?

**Answer**: Use `gvisMerge()`:

```r
M <- gvisMerge(chart1, chart2, horizontal = TRUE)
```

The limitation is that `gvisMerge()` can only combine **two** charts at a time. To combine three or more, chain calls: `gvisMerge(gvisMerge(A, B), C)`.

---

### P12. R Packages

What is the purpose of the `NAMESPACE` file in an R package, and what does `export()` do?

**Answer**: The `NAMESPACE` file defines the package's public API — it controls which functions are visible to users and which internal functions remain hidden. `export("functionName")` makes a function available to users who load the package. Functions not exported are internal implementation details. `importFrom(package, function)` allows using functions from other packages without making those packages appear on the user's search path.

---

### P13. Slidify vs RStudio Presenter

List two advantages of Slidify over RStudio Presenter, and two advantages of RStudio Presenter over Slidify.

**Answer**:

**Slidify advantages**:
1. More flexible control from the `.Rmd` file (full YAML control, multiple framework choices)
2. Larger community and more styles/options available by default

**RStudio Presenter advantages**:
1. Embedded in RStudio — no separate installation needed, GUI-oriented
2. Easier to get started with; default styles look polished out of the box

---

### P14. Data Analysis Report Structure

What are the five components of a well-structured data analysis report, and what does each contain?

**Answer**:
1. **Prompt file**: The analysis question or task being addressed
2. **Data folder**: Raw data files and report files; includes data provenance documentation
3. **Code folder**: Raw code (exploratory, not for sharing) and final code (relevant analyses, shareable)
4. **Figures folder**: Final, publication-ready plots with appropriate formatting
5. **Writing folder**: The final report (title, introduction, methods, results, conclusions, references) and figure captions

---

## Mixed Topics

---

### P15. Ensemble Methods Comparison

Compare bagging, random forests, and boosting in terms of how they reduce prediction error.

| Method | Primary Target | How |
|--------|---------------|-----|
| **Bagging** | Variance | Average $B$ independent models fit to bootstrap samples |
| **Random Forests** | Variance | Bagging + random variable selection at each split (decorrelates trees) |
| **Boosting** | Bias | Sequentially fit models, up-weighting misclassified observations |

**Answer**: Bagging and random forests primarily reduce variance by averaging. Random forests improve on bagging by decorrelating the trees. Boosting primarily reduces bias by iteratively focusing on hard-to-classify observations. All three benefit from cross-validation to tune parameters.

---

### P16. Over-fitting Detection

Describe three strategies to detect and prevent over-fitting.

**Answer**:
1. **Train/test split**: Evaluate the model on data not used for training. A large gap between training and test performance signals over-fitting.
2. **Cross-validation**: Use K-fold CV to get a reliable estimate of test error without wasting data.
3. **Regularisation**: Apply ridge or lasso penalties to constrain coefficient sizes, limiting model complexity.

Additional strategies include early stopping (for iterative methods like boosting), pruning decision trees, and reducing the number of features.
