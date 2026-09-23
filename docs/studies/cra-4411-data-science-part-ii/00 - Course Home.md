---
title: "00 - Course Home"
math_syntax: typst
---

# CRA 4411 — Data Science Part II: Statistical Inference and Regression Models

> [!tip] Midsem syllabus key
> **◆ MIDSEM** — study this for the immediate midsem.  
> **◇ AFTER MIDSEM** — complete-course material retained for later.


These notes are written to be studied from directly. Each chapter explains concepts from first principles, defines notation before using it, provides derivations where relevant, includes worked examples, and flags common mistakes. The material follows the Coursera Data Science Specialisation structure adapted for the CRA 4411 syllabus.

## Start with the picture

![Inference map](/content-assets/studies/cra-4411-data-science-part-ii/Assets/Inference%20map.svg)

The population has an unknown mean **μ** (say “mu”) and standard deviation **σ** (say “sigma”). A sample supplies observed values. Their average, written **X̄** (“X bar”), changes when the sample changes. An interval uses that changing average to try to capture the fixed population mean. A hypothesis test asks how surprising the observed statistic would be under a proposed population value.

Open the [editable Excalidraw inference map](/notes/studies-cra-4411-data-science-part-ii-assets-inference-map-excalidraw) to annotate this flow as you study. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html) to vary base rates and watch repeated confidence intervals. Each chapter now starts with a plain-language notation guide and ends with a worked quiz bridge.

> [!tip] A five-minute way to make it stick
> Before a formula, say what each symbol names in words. Predict what happens when one input rises. Work the example without looking at its answer. Then use the linked mock question and explain why one tempting answer is wrong. Revisit that explanation the next day from memory.

## Course modules at a glance

| Module     | Weeks                    | Topics                                                                           | Deadline           |
| ---------- | ------------------------ | -------------------------------------------------------------------------------- | ------------------ |
| Module I   | SI Weeks 1–3             | Probability, distributions, asymptotics, intervals, testing                      | August 27, 2026    |
| Module II  | SI Week 4 + RM Weeks 1–2 | Power, bootstrapping, permutation tests; least squares; multivariable regression | September 20, 2026 |
| Module III | RM Weeks 3–4             | Residuals, diagnostics, logistic and Poisson regression                          | October 27, 2026   |

> **Midterm boundary.** The current midterm covers **Statistical Inference Weeks 1–4** and **Regression Models Weeks 1–2** (Modules I and II). Regression Models Weeks 3–4 are later material; complete notes are included so you can study them when needed.

## Topic map

### Statistical Inference

| Week | Chapter | Core ideas |
| --- | --- | --- |
| 1 | [01 - Probability and Expected Values](/notes/studies-cra-4411-data-science-part-ii-01---probability-and-expected-values) | Probability rules, conditional probability, Bayes' theorem, random variables, PMF/PDF/CDF, expected value, variance |
| 2 | [02 - Variability, Distributions, and Asymptotics](/notes/studies-cra-4411-data-science-part-ii-02---variability-distributions-and-asymptotics) | Common distributions, the law of large numbers, the central limit theorem, sample means |
| 3 | [03 - Intervals, Testing, and P Values](/notes/studies-cra-4411-data-science-part-ii-03---intervals-testing-and-p-values) | Confidence intervals, hypothesis testing framework, t-tests, z-tests, p-values |
| 4 | [04 - Power, Bootstrapping, and Permutation Tests](/notes/studies-cra-4411-data-science-part-ii-04---power-bootstrapping-and-permutation-tests) | Statistical power, bootstrap confidence intervals, permutation tests |

### Regression Models

| Week | Chapter | Core ideas |
| --- | --- | --- |
| 1 | [05 - Least Squares and Linear Regression](/notes/studies-cra-4411-data-science-part-ii-05---least-squares-and-linear-regression) | Galton's data, regression to the mean, least squares derivation, simple linear regression, residuals, R² |
| 2 | [06 - Linear Regression and Multivariable Regression](/notes/studies-cra-4411-data-science-part-ii-06---linear-regression-and-multivariable-regression) | Interpreting coefficients, omitted variable bias, multivariable model, covariance and correlation |
| 3 ★ | [07 - Multivariable Regression, Residuals, and Diagnostics](/notes/studies-cra-4411-data-science-part-ii-07---multivariable-regression-residuals-and-diagnostics) | Variance inflation, ANOVA model comparison, stepwise selection, residual diagnostics |
| 4 ★ | [08 - Logistic Regression and Poisson Regression](/notes/studies-cra-4411-data-science-part-ii-08---logistic-regression-and-poisson-regression) | Generalised linear models, logistic regression, Poisson regression, log-linear models |

★ = later material, outside midterm scope but included for completeness.

## Reference files

| File | Contents |
| --- | --- |
| [Formula and Methods](/notes/studies-cra-4411-data-science-part-ii-formula-and-methods) | Every key formula, organised by topic, in a quick-reference layout |
| [Midsem MCQ Mock Tests](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-tests) | Six 30-question midsem papers worth 15 marks each |
| [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) | Worked answers drawn from the Coursera quizzes and problem sets, with distractor explanations |
| [Extra Practice](/notes/studies-cra-4411-data-science-part-ii-extra-practice) | Additional problems beyond the class material, with full solutions |
| [Past Paper Questions](/notes/studies-cra-4411-data-science-part-ii-past-paper-questions) | Statement on the absence of verified past paper questions |
| [Rapid Revision](/notes/studies-cra-4411-data-science-part-ii-rapid-revision) | Condensed cheat-sheet for last-minute review |

## How to use these notes

1. Read the chapter explanation before attempting any worked question.
2. Write out derivations by hand — seeing a proof is not the same as being able to reproduce it.
3. For hypothesis tests, always write: hypotheses, assumptions, test statistic, degrees of freedom, p-value, and conclusion.
4. Run the R code examples yourself and vary the inputs to build intuition.
5. Use [Formula and Methods](/notes/studies-cra-4411-data-science-part-ii-formula-and-methods) as a lookup during practice, not as a primary learning tool.

Good luck with the course.
