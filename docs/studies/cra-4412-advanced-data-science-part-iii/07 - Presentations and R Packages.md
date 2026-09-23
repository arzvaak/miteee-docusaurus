---
title: "07 - Presentations and R Packages"
math_syntax: typst
---

# Presentations and R Packages

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Developing Data Products — Week 3

---

## First, read the notation in words

A presentation tells a reader what question was asked, how it was answered, what the graph shows, and what remains uncertain. An R **package** bundles reusable functions with metadata, documentation and checks. A function is source code; a package organizes and distributes it; a slide communicates a result produced with it. `DESCRIPTION` describes the package; `NAMESPACE` governs exports/imports; documentation explains the function interface.

> [!question] Try to recall
> If the numerical output is wrong in three reports, find the shared function and fix it there before updating slides.

---

## 1. Data Analysis Report Structure

A data analysis report (blog post or formal report) should contain:

| Component | Contents |
|-----------|----------|
| **Prompt file** | The analysis question (not always available) |
| **Data folder** | Raw data + report files; always track data provenance |
| **Code folder** | Raw code (exploratory `.Rmd`) vs final code (shareable `.Rmd`) |
| **Figures folder** | Final, publication-ready plots |
| **Writing folder** | Report (title, introduction, methods, results, conclusions, references) + figure captions |

---

## 2. Slidify

Slidify, by Ramnath Vaidyanathan, creates data-centric **HTML5 presentations** from R Markdown. It combines knitr, Markdown, and JavaScript libraries.

### Installation

```r
install.packages("devtools")
install_github("slidify", "ramnathv")
install_github("slidifyLibraries", "ramnathv")
library(slidify)
```

### Creating a Presentation

```r
setwd("~/project")
author("title")  # creates directory, assets/, and index.Rmd
slidify("index.Rmd")  # renders to HTML
library(knitr); browseURL("index.html")
```

The `author()` function creates:
- A directory named `title/`
- An `assets/` subdirectory with `css/`, `img/`, `js/`, `layouts/`
- An `index.Rmd` file

### YAML Header

```yaml
---
title       : My Presentation
subtitle    : Subtitle Here
author      : Your Name
job         : Your Role
framework   : io2012        # {io2012, html5slides, dzslides, deck.js, ...}
highlighter : highlight.js   # {highlight.js, prettify}
hitheme     : tomorrow
widgets     : [mathjax]      # {mathjax, quiz, bootstrap}
mode        : selfcontained  # {standalone, draft}
---
```

- `standalone`: saves JS libraries locally (works offline)
- `selfcontained`: loads JS at presentation time (needs Internet)
- `widgets`: `mathjax` for LaTeX, `quiz` for interactive questions, `bootstrap` for Twitter-style CSS

### Slide Structure

- `##` = slide title (equivalent to `h1`)
- `---` = marks the end of a slide
- `.class #id` = CSS class and ID for the slide

### Interactive Quiz Slides

```markdown
--- &radio

## What is 1 + 1?

1. 1
2. _2_
3. 3
4. 4

*** .hint
This is a hint.

*** .explanation
2 is the correct answer because 1 + 1 = 2.
```

Correct answers are wrapped in underscores (`_2_`).

### Publishing

```r
publish_github("username", "repo")
```

---

## 3. RStudio Presentations

RStudio has a built-in presentation tool (`.Rpres` files → `.md` → `.html`).

### Creating

File → New File → R Presentation (`Alt-F` → `F` → `P`)

### Features

| Feature | Syntax / Notes |
|---------|---------------|
| Slide-specific CSS | `class: classname` |
| External CSS | `css: file.css` |
| Transitions | `transition: linear` or `transition: rotate` |
| Slide types | `type: section`, `type: sub-section`, `type: prompt`, `type: alert` |
| Two-column layout | Place `***` between two sections; use `left: 70%` / `right: 30%` |
| Custom fonts | `font-family: fontname`, `font-import: <url>` |

### Viewer Controls

- Left/right arrows for navigation
- **Notepad** icon: shows code for current slide
- **More** button: Clear Cache, View in Browser, Save as Web Page, Publish to RPubs
- **Zoom**: opens in new window

### Slidify vs RStudio Presenter

| Feature | Slidify | RStudio Presenter |
|---------|---------|-------------------|
| Control | Full control from `.Rmd` | GUI-oriented |
| Learning curve | Steeper | Easier |
| Styles | Many defaults | Smaller set, looks nice |
| Community | Large (StackOverflow) | Smaller |
| Flexibility | Very high | Equal with CSS/HTML knowledge |

---

## 4. R Packages

R packages are collections of functions and data objects that extend R's base functionality.

### Package Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Directory | Root | Named after the package |
| `DESCRIPTION` | Root | Metadata (name, version, author, license, dependencies) |
| `R/` | Subdirectory | R source code |
| `man/` | Subdirectory | Documentation (`.Rd` files) |
| `NAMESPACE` | Root | Public API: exports and imports |

### DESCRIPTION File

```
Package: gpclib
Title: General Polygon Clipping Library for R
Description: General polygon clipping routines for R.
Version: 1.5-5
Author: Roger D. Peng
Maintainer: Roger D. Peng <rpeng@jhsph.edu>
License: file LICENSE
Depends: R (>= 2.14.0), methods
Imports: graphics
Date: 2013-04-01
URL: http://github.com/rdpeng/gpclib
```

Optional fields: `Depends`, `Suggests`, `Date`, `URL`.

### NAMESPACE File

The NAMESPACE file defines the public API:

```r
export("read.polyfile", "write.polyfile")
importFrom(graphics, plot)
exportClasses("gpc.poly", "gpc.poly.nohole")
exportMethods("show", "plot", "intersect", "union")
```

- `export()` — makes functions available to users
- `import()` / `importFrom()` — uses other packages without attaching them
- `exportClasses()` — defines S4 classes users can create
- `exportMethods()` — defines methods for those classes

### Documentation with roxygen2

Write documentation directly in R scripts using `#'`:

```r
#' Building a Model with Top Ten Features
#'
#' This function develops a prediction algorithm based on the top 10 features
#' in 'x' that are most predictive of 'y'.
#'
#' @param x a n x p matrix of n observations and p predictors
#' @param y a vector of length n representing the response
#' @return a 'lm' object representing the linear model
#' @author Roger Peng
#' @details This function runs a univariate regression of y on each predictor
#'   and selects the 10 with smallest p-values.
#' @seealso \code{lm}
#' @import stats
#' @export
topten <- function(x, y) {
  p <- ncol(x)
  if (p < 10) stop("there are less than 10 predictors")
  pvalues <- numeric(p)
  for (i in seq_len(p)) {
    fit <- lm(y ~ x[, i])
    pvalues[i] <- summary(fit)$coefficients[2, 4]
  }
  ord <- order(pvalues)
  x10 <- x[, ord]
  fit <- lm(y ~ x10)
  coef(fit)
}
```

### Building and Checking

```r
# From R:
system("R CMD build newpackage")
system("R CMD check newpackage")

# Or use the skeleton generator:
package.skeleton("myPackage")
```

The package must pass **all** `R CMD check` tests for CRAN submission: documentation for all exported functions, no major errors, valid license, working examples.

### Package Creation Checklist

1. Create directory with `R/` and `man/` subdirectories (or use `package.skeleton()`)
2. Write `DESCRIPTION` file
3. Copy R code to `R/`
4. Write documentation in `man/` (or use roxygen2 in `R/`)
5. Write `NAMESPACE` with exports/imports
6. Build and check

---

## Key Intuitions

1. A **data analysis report** separates raw exploration from final, shareable analysis.
2. **Slidify** offers maximum flexibility for HTML5 presentations; RStudio Presenter is simpler for quick presentations.
3. R packages provide a structured way to share reproducible code with documentation.
4. **roxygen2** lets you write documentation inline with code, keeping them in sync.
5. `NAMESPACE` controls the public API — only exported functions are visible to users.

---

## Revision Checklist

- [ ] Can describe the structure of a data analysis report
- [ ] Can create a Slidify presentation with YAML, slides, and embedded code
- [ ] Can create interactive quiz slides in Slidify
- [ ] Can compare Slidify and RStudio Presenter
- [ ] Can describe R package components (DESCRIPTION, R/, man/, NAMESPACE)
- [ ] Can write roxygen2 documentation and understand @param, @return, @export
- [ ] Can explain the role of NAMESPACE in controlling the package API
- [ ] Knows how to build and check an R package
---

## Make it click: A package and a presentation have different jobs

**Work it through.** Imagine a function `rmse(actual, predicted)` used in three analyses. Put the implementation, documentation and checks in a package so the same behavior can be reused. Put a result, graph, assumptions and conclusion in a presentation so an audience can understand the analysis. A slide can call the function, but it is not the implementation’s home.

**See it.** Sketch source function → package → analysis → slide. Trace where an incorrect RMSE formula should be fixed: the source function and its checks.

**What the questions are checking.** This is Developing Data Products Week 3. The current mock’s error-metric questions test RMSE interpretation, not package construction; study this chapter’s code and [Extra Practice](/notes/studies-cra-4412-advanced-data-science-part-iii-extra-practice) for the workflow.

> [!warning] Common trap
> Documentation records what a function does; it does not replace a check that the returned value is correct.
