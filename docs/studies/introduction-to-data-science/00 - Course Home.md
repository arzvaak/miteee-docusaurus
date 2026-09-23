---
title: "00 - Course Home"
math_syntax: typst
---

# Introduction to Data Science

> [!tip] Study routes
> **◆ MIDSEM** — Chapters 01–07. Study this for the midterm (30 marks, 90 min).  
> **◇ ENDSEM** — Chapters 01–08 currently available; the teacher mock also tests regression, classification, and trees, for which dedicated chapters are planned (50 marks, 180 min).

> [!summary] Course at a glance
> This course builds from data fundamentals and Python basics through NumPy, pandas, Matplotlib, correlation, descriptive statistics, and hypothesis testing including one-way ANOVA for the midsem. The teacher's endsem mock also tests two-way ANOVA, multiple and logistic regression, decision trees, Random Forests, and model evaluation. Only two-way ANOVA of those added topics currently has a dedicated chapter.

## Topic map

| # | Chapter | Core thread | Skills |
| --- | --- | --- | --- |
| 01 | [Foundations of Data Science](/notes/studies-introduction-to-data-science-01---foundations-of-data-science) | Data lifecycle, data science vs analytics, multimedia, file formats, ETL, Python ecosystem | File loading, small Python exercises |
| 02 | [Python Fundamentals](/notes/studies-introduction-to-data-science-02---python-fundamentals) | Syntax, types, collections, loops, control flow, functions | Core Python expressions, iteration, function arguments |
| 03 | [NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) | Arrays, shape/rank, slicing, vectorised math, image operations | NumPy indexing, reshaping, plots and filters |
| 04 | [Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) | Series, DataFrame, line/bar/scatter visualisation | Build and annotate plots |
| 05 | [Correlation](/notes/studies-introduction-to-data-science-05---correlation) | Direction, linearity, number of variables, degree, coefficients | Scatter diagrams, Pearson and Spearman |
| 06 | [Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics) | Population/sample, central tendency, dispersion, skewness, kurtosis, test families | Summary statistics, grouped data |
| 07 | [Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing) | Chi-square, z-tests, t-tests, one-way ANOVA | Hypothesis workflow, test statistics, decisions |
| 08 | [Two-Way ANOVA](/notes/studies-introduction-to-data-science-08---two-way-anova) | Two-way ANOVA: main effects and interaction | Factorial ANOVA design and interpretation |

> [!note] Planned endsem chapters
> The teacher-released endsem mock also covers these topics, which will be added as dedicated chapters:
> - **09 — Multiple Linear Regression** — model fitting, coefficient interpretation, prediction from small datasets
> - **10 — Logistic Regression and Model Evaluation** — probability, decision thresholds, confusion matrix, accuracy, preprocessing, normalisation
> - **11 — Decision Trees and Random Forests** — Gini impurity, tree construction, ensemble methods vs single trees
> - **12 — Supervised and Unsupervised Learning** — learning types, when to use each

## Midsem study route

> [!info] Scope
> **Chapters 01–07** · 30 marks · 90 minutes · answer all questions

1. Start with [01 - Foundations of Data Science](/notes/studies-introduction-to-data-science-01---foundations-of-data-science) to understand the data lifecycle and data science vs analytics.
2. Complete [02 - Python Fundamentals](/notes/studies-introduction-to-data-science-02---python-fundamentals) before running NumPy, pandas, or plotting examples — method overriding and dynamic dispatch appear in the midsem mock.
3. Follow [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) → [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) → [05 - Correlation](/notes/studies-introduction-to-data-science-05---correlation) for the computational workflow; expect array slicing, reshaping, cumulative sums, DataFrame merges, and Pearson/Spearman calculations.
4. Finish with [06 - Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics) and [07 - Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing); the latter reuses definitions and dispersion measures from Chapter 06. Expect grouped mean/median/mode, box-plot interpretation, skewness, kurtosis, and a one-sample z test.

> [!tip] Midsem mock papers
> After completing the chapters, attempt the midsem section and worked answers in [Teacher Mock Questions](/notes/studies-introduction-to-data-science-teacher-mock-questions) to see the teacher's style.

## Endsem study route

> [!info] Scope
> **Chapters 01–08 currently available** · 50 marks · 180 minutes · answer all questions. The mock shows additional topics listed in the planned chapter note above.

1. Ensure midsem material (Chapters 01–07) is solid — the endsem reuses Python fundamentals, NumPy 2D/3D indexing, descriptive statistics, and the hypothesis-testing workflow heavily.
2. Study [08 - Two-Way ANOVA](/notes/studies-introduction-to-data-science-08---two-way-anova) for factorial experiments with interaction effects; the endsem mock tests this explicitly with a two-factor plant-growth dataset.
3. Review the teacher mock questions for regression, logistic regression and evaluation, decision trees and Random Forests, and learning types. Dedicated chapters on these topics are planned.
4. Review [Formula and Methods](/notes/studies-introduction-to-data-science-formula-and-methods) and [Rapid Revision](/notes/studies-introduction-to-data-science-rapid-revision) for consolidated references across both exams.

> [!tip] Endsem mock papers
> Read the endsem section of [Teacher Mock Questions](/notes/studies-introduction-to-data-science-teacher-mock-questions) to see the teacher's style. Worked endsem answers are still being prepared.

## Question banks

- [Teacher Mock Questions](/notes/studies-introduction-to-data-science-teacher-mock-questions) — teacher-released 2025 mock papers (midterm and endsem); midterm worked solutions are complete and endsem solutions are pending.
- [Questions from Class Material](/notes/studies-introduction-to-data-science-questions-from-class-material) — drills based on the course exercises and worked examples, with full worked answers.
- [Past Paper Questions](/notes/studies-introduction-to-data-science-past-paper-questions) — verified past-paper problems (no verified exact PYQs are currently available).
- [Extra Practice](/notes/studies-introduction-to-data-science-extra-practice) — newly generated exam-style problems with worked answers for further study.

## How to use these notes

- Read the explanation before attempting each worked question.
- Run the Python examples and change the inputs to check your understanding.
- For statistics problems, write the hypotheses, assumptions, test statistic, degrees of freedom and conclusion in that order.
- Use the formula and methods reference for quick lookup: [Formula and Methods](/notes/studies-introduction-to-data-science-formula-and-methods).
- Use the rapid revision guide before an exam: [Rapid Revision](/notes/studies-introduction-to-data-science-rapid-revision).
