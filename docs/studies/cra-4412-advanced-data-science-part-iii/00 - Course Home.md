---
title: "00 - Course Home"
math_syntax: typst
---

# CRA 4412 — Advanced Data Science Part III

> [!tip] Midsem syllabus key
> **◆ MIDSEM** — study this for the immediate midsem.  
> **◇ AFTER MIDSEM** — complete-course material retained for later.


> Practical Machine Learning (Weeks 1–4) + Developing Data Products (Weeks 1–5)

## Start with the picture

![Prediction map](/content-assets/studies/cra-4412-advanced-data-science-part-iii/Assets/Prediction%20map.svg)

Training data are where the model learns. Within that training portion, cross-validation lets each fold take one turn as held-out data while the other folds fit the model. A final test set stays untouched until choices are fixed. That separation is why a good training score alone is not proof of a useful predictor.

Open the [editable Excalidraw prediction map](/notes/studies-cra-4412-advanced-data-science-part-iii-assets-prediction-map-excalidraw) and [interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html). Change the fold count and model complexity yourself. Each chapter begins by translating its vocabulary into ordinary language and adds a worked bridge to relevant practice.

> [!tip] A five-minute way to make it stick
> Predict what a control or algorithm change will do before seeing the result. Trace where the data go. Then explain the result aloud without the note. Use a linked quiz item to test that explanation, and retry it the next day.

---

## Exam Boundary

> [!important] Immediate Exam Scope
> **Practical Machine Learning** — all four weeks
> **Developing Data Products** — Weeks 1 through 3

Weeks 4–5 of Developing Data Products are included below as complete notes for future reference, but they fall **outside** the current midterm boundary.

---

## Course Map

| Module | Topic | Chapter |
|--------|-------|---------|
| **Practical ML** | Prediction & Study Design | [01 - Prediction and Study Design](/notes/studies-cra-4412-advanced-data-science-part-iii-01---prediction-and-study-design) |
| **Practical ML** | Cross Validation & the `caret` Package | [02 - Cross-Validation and caret](/notes/studies-cra-4412-advanced-data-science-part-iii-02---cross-validation-and-caret) |
| **Practical ML** | Trees, Bagging & Random Forests | [03 - Trees, Bagging and Random Forests](/notes/studies-cra-4412-advanced-data-science-part-iii-03---trees-bagging-and-random-forests) |
| **Practical ML** | Boosting, Model-Based Prediction & Model Selection | [04 - Boosting Model-Based Prediction and Model Selection](/notes/studies-cra-4412-advanced-data-science-part-iii-04---boosting-model-based-prediction-and-model-selection) |
| **DDP** | Building Interactive Shiny Apps | [05 - Shiny Applications](/notes/studies-cra-4412-advanced-data-science-part-iii-05---shiny-applications) |
| **DDP** | manipulate, rCharts, ggvis & googleVis | [06 - Interactive Graphics with R](/notes/studies-cra-4412-advanced-data-science-part-iii-06---interactive-graphics-with-r) |
| **DDP** | Presentations, Slidify & R Packages | [07 - Presentations and R Packages](/notes/studies-cra-4412-advanced-data-science-part-iii-07---presentations-and-r-packages) |
| **DDP** *(later)* | R Classes, Methods & Yhat | [08 - R Classes Methods and Yhat](/notes/studies-cra-4412-advanced-data-science-part-iii-08---r-classes-methods-and-yhat) |

## Reference Files

- [Formula and Methods](/notes/studies-cra-4412-advanced-data-science-part-iii-formula-and-methods) — All key formulas, derivations, and method summaries
- [Midsem MCQ Mock Tests](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-tests) — Six 30-question midsem papers worth 15 marks each
- [Questions from Class Material](/notes/studies-cra-4412-advanced-data-science-part-iii-questions-from-class-material) — Quiz bank with worked explanations
- [Past Paper Questions](/notes/studies-cra-4412-advanced-data-science-part-iii-past-paper-questions) — University past paper availability
- [Extra Practice](/notes/studies-cra-4412-advanced-data-science-part-iii-extra-practice) — Generated practice questions
- [Rapid Revision](/notes/studies-cra-4412-advanced-data-science-part-iii-rapid-revision) — Condensed cheat-sheet for last-minute review

---

## Practical Machine Learning — Overview

This module teaches the **predictive modelling pipeline**: formulating a concrete question, selecting and engineering features, choosing and evaluating algorithms, and understanding the bias–variance trade-off. We cover:

1. **Week 1** — What prediction is, in-sample vs out-of-sample error, study design, error types (ROC, sensitivity, specificity, kappa)
2. **Week 2** — Cross-validation strategies, the `caret` package (data slicing, training options, preprocessing, PCA, dummy variables, splines)
3. **Week 3** — Predicting with regression, classification/regression trees, bagging, random forests
4. **Week 4** — Boosting (gradient boosting), model-based prediction (LDA, naive Bayes, Bayes theorem), model selection (ridge regression, lasso, expected prediction error decomposition), regularisation, unsupervised prediction (clustering + prediction)

## Developing Data Products — Overview

This module teaches how to turn statistical models into **interactive web applications and presentations**:

1. **Week 1** — Shiny framework: `ui.R`, `server.R`, inputs, outputs, reactive expressions, distribution
2. **Week 2** — `manipulate` package, rCharts, ggvis, googleVis API
3. **Week 3** — Slidify presentations, RStudio presentations, R packages, `roxygen2` documentation
4. **Week 4** *(later)* — R classes and methods (S3, S4), object-oriented programming in R
5. **Week 5** *(later)* — Yhat model deployment, API design, hosting predictive models
