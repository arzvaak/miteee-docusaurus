---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

> Condensed cheat-sheet for last-minute review. Flip through this before the exam.

---

## Practical Machine Learning

### Prediction Pipeline

$$
"Question" -> "Data" -> "Features" -> "Algorithm" -> "Parameters" -> "Evaluate"
$$

Importance order: **question > data > features > algorithms**

### Error Types

| Metric | Formula | Use Case |
|--------|---------|----------|
| Accuracy | Correct / Total | Balanced classes |
| Kappa ($kappa$) | $("acc" - P(e)) / (1 - P(e))$ | Adjusts for chance |
| MSE | $1/n sum (hat(Y) - Y)^2$ | Continuous outcomes |
| RMSE | $sqrt("MSE")$ | Continuous (same units) |
| AUC | Area under ROC curve | Binary classification |

### Cross-Validation

| Method | Bias | Variance | Cost |
|--------|------|----------|------|
| Small K (e.g. 5) | High | Low | Low |
| Large K (e.g. LOOCV) | Low | High | High |

Always: **test set untouched until final evaluation**.

### Preprocessing

- **Center**: $X - overline(X)$ → mean = 0
- **Scale**: $X / s$ → SD = 1
- **Normalise**: center + scale
- **BoxCox**: power transform toward Gaussian
- **KNN impute**: replace missing with average of $k$ nearest
- **Dummy variables**: factor → 0/1 columns
- **PCA**: reduce to top principal components (max variance, min noise)

### Algorithms at a Glance

| Algorithm | Bias | Variance | Interpretability | Handles Non-linearity |
|-----------|------|----------|-----------------|---------------------|
| Linear regression | May be high | Low | Excellent | No |
| Classification tree | Moderate | High | Good | Yes |
| Bagging | Same as base | Reduced | Reduced | Yes |
| Random forest | Same as base | Further reduced | Poor | Yes |
| Boosting | Reduced | Moderate | Reduced | Yes |
| Ridge | Slightly ↑ | Reduced | Good | No |
| Lasso | Slightly ↑ | Reduced + selection | Good | No |
| LDA | Moderate | Low | Good | No |
| Naive Bayes | Moderate | Low | Good | No |

### Tree Impurity

- **Gini**: $1 - sum hat(p)_k^2$ (0 = pure, 0.5 = impure)
- **Deviance**: $-2 sum hat(p)_k ln hat(p)_k$
- **Misclassification**: $1 - hat(p)_(max)$ (0 = pure, 0.5 = impure)

### Bias–Variance Decomposition

$$
"EPE" = sigma^2 + "Bias"^2 + "Variance"
$$

- **Irreducible** ($sigma^2$): noise — cannot reduce
- **Bias**: from wrong model assumptions — reduce with complexity
- **Variance**: from sensitivity to training data — reduce with simplicity/regularisation

### Ridge vs Lasso

| | Ridge ($L_2$) | Lasso ($L_1$) |
|-|--------------|--------------|
| Penalty | $lambda sum beta_j^2$ | $lambda sum |beta_j|$ |
| Coefficients | Shrink, never zero | Can be exactly zero |
| Variable selection | No | Yes |
| $p > n$ solvable | Yes | Yes |
| Correlated predictors | Keeps all | Picks one |

### Bayes' Theorem

$$
P(Y = k | X = x) = frac(f_k(x) pi_k, sum_ell f_ell(x) pi_ell)
$$

- **LDA**: Gaussian $f_k$, common $Sigma$ → linear boundaries
- **QDA**: Gaussian $f_k$, separate $Sigma_k$ → quadratic boundaries
- **Naive Bayes**: assumes predictor independence → works well for many binary/categorical features

### Boosting

$$
f(x) = sum_i alpha_i h_i(x)
$$

Weak classifiers → weighted sum → iteratively up-weight misclassified observations

---

## Developing Data Products

### Shiny App Structure

```
ui.R  →  shinyUI(pageWithSidebar(
            headerPanel(...),
            sidebarPanel(...inputs...),
            mainPanel(...outputs...)
          ))

server.R → shinyServer(function(input, output) {
              output$x <- renderXxx({ ... input$y ... })
            })
```

**Key rule**: commas only between siblings.

### Common Inputs

| Widget | Function |
|--------|----------|
| Slider | `sliderInput("id", "label", min, max, value)` |
| Numeric | `numericInput("id", "label", value, min, max)` |
| Text | `textInput("id", "label")` |
| Checkbox | `checkboxGroupInput("id", "label", choices)` |
| Date | `dateInput("id", "label")` |
| Submit | `submitButton("label")` |

### Render Functions

| UI placeholder | Server render |
|---------------|--------------|
| `textOutput("id")` | `renderText({...})` |
| `plotOutput("id")` | `renderPlot({...})` |
| `verbatimTextOutput("id")` | `renderPrint({...})` |
| `htmlOutput("id")` | `renderGvis({...})` |

### Interactive Graphics

| Package | Key Function | Use Case |
|---------|-------------|----------|
| rCharts | `nPlot()`, `rPlot()` | JS-based charts (NVD3, Highcharts, Leaflet) |
| ggvis | `ggvis() %>% layer_points()` | ggplot2-like grammar, browser rendering |
| googleVis | `gvisLineChart()`, `gvisGeoChart()` | Google Charts |
| plotly | `py$ggplotly(g)` | Interactive ggplot2 on the web |

### Presentations

| Tool | Format | Key Feature |
|------|--------|-------------|
| Slidify | `.Rmd` → HTML5 | Maximum flexibility, many frameworks |
| RStudio Presenter | `.Rpres` → HTML5 | GUI-oriented, built into RStudio |

### R Packages

| File/Dir | Purpose |
|----------|---------|
| `DESCRIPTION` | Metadata (name, version, author, dependencies) |
| `R/` | Source code |
| `man/` | Documentation |
| `NAMESPACE` | Public API (exports, imports) |

**roxygen2**: write docs inline with `#' @param`, `#' @return`, `#' @export`

### R Classes (S3 vs S4)

| | S3 | S4 |
|--|----|----|
| Style | Informal | Formal |
| Definition | Implicit (class attribute) | `setClass()` |
| Method | `UseMethod()` | `setMethod()` |
| Access | `$` | `@` for slots |
| New projects | Legacy | Recommended |

### Model Deployment (Yhat Pattern)

```r
model.require <- function() { # load dependencies
}
model.transform <- function(df) { # preprocessing
  df
}
model.predict <- function(df) { # prediction logic
  predict(model, newdata = df)
}
yhat.deploy("modelName")
yhat.predict("modelName", newdata)
```

---

## Last-Minute Reminders

1. **Test set is sacred** — touch it only once, at the very end.
2. **Preprocessing** must use training-set parameters applied to test data.
3. **Cross-validation** estimates test error; **test set** confirms it.
4. More features ≠ always better; but including more at extraction is safer.
5. Random forests reduce variance; boosting reduces bias.
6. Lasso zeroes coefficients (selection); ridge shrinks them (retention).
7. In Shiny: commas between siblings, reactive expressions use `()` to call.
8. `gvisMerge` combines only two charts — chain for more.
9. ROC: higher AUC = better classifier; 0.5 = random.
10. $p > n$: use regularised regression (ridge/lasso) or dimensionality reduction.
