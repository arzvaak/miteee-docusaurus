---
title: "05 - Shiny Applications"
math_syntax: typst
---

# Shiny Applications

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Developing Data Products — Week 1

---

## First, read the notation in words

Shiny separates the **UI** (controls and places to display results) from **server** logic (what to compute). An `input` value changes when the user moves a control. A **reactive expression** computes a reusable value when a dependent output needs it; an **observer** performs a side effect such as saving or printing. `renderPlot()` produces an output for `plotOutput()` in the UI. Think of arrows from changing inputs through reactive calculations to visible outputs.

> [!question] Try to recall
> Trace one slider change through input → reactive calculation → plot. Which piece should you use if you want to save a file on button click?

---

## 1. What Is Shiny?

Shiny is an R package for building interactive web applications with dynamic inputs and outputs, requiring minimal web development knowledge.

Shiny is an R package by RStudio for building **interactive web applications** powered by R. It allows users to vary inputs and see updated outputs in real time, all within a web browser.

**Helpful background** (not required): HTML (page structure), CSS (styling), JavaScript (interactivity).

**Capabilities**: file upload/download, tabbed panels, editable data tables, dynamic UI, user-defined inputs/outputs, submit buttons.

```r
install.packages("shiny")
library(shiny)
```

**OpenCPU** (by Jeroen Ooms) extends Shiny with an API for more complex R/web applications.

---

## 2. Structure of a Shiny App

A Shiny app typically consists of a `ui.R` for layout and a `server.R` for logic, run together with `runApp()`.

A Shiny project lives in a single directory and contains **two scripts**:

| File | Purpose |
|------|---------|
| `ui.R` | Controls appearance and layout |
| `server.R` | Controls functions and computation |

Alternatively, a `www/index.html` file can replace `ui.R` for full HTML control (with CSS classes `shiny-text-output`, `shiny-plot-output`, or `shiny-html-output` for rendering).

Run with: `runApp()`

Show code alongside the app: `runApp(display.mode = "showcase")`

> [!warning] Commas must appear **only between** sibling objects/functions on the same level. Missing or extra commas are the most common source of errors.

---

## 3. ui.R — The User Interface

### Basic Layout

```r
library(shiny)
shinyUI(pageWithSidebar(
  headerPanel("My App Title"),
  sidebarPanel(
    # inputs go here
  ),
  mainPanel(
    # outputs go here
  )
))
```

### Fluid Layout (More Control)

```r
shinyUI(fluidPage(
  fluidRow(
    column(4, ...),   # 4 out of 12 columns
    column(8, ...)
  )
))
```

`fluidRow()` creates a row of width 12 that can be subdivided into columns.

### Absolute (Floating) Panels

```r
absolutePanel(
  top = 50, left = 0, right = 0,
  fixed = TRUE,        # stays in place when scrolling
  draggable = TRUE,    # user can drag it
  style = "opacity: 0.92; z-index = 100",
  ...
)
```

### Content Elements

Shiny provides content elements like headings, paragraphs, and code, along with LaTeX rendering support via `withMathJax()`.

| Function | Purpose |
|----------|---------|
| `h1()` / `h2()` / `h3()` | Headings |
| `p("text")` | Paragraph |
| `code("code")` | Inline code |
| `br()` | Line break |
| `tags$hr()` | Horizontal rule |
| `tags$ol()` / `tags$ul()` | Ordered / unordered list |
| `div(..., style = "CSS")` | Block-level styled container |
| `span(..., style = "CSS")` | Inline styled container |
| `withMathJax()` | Enable LaTeX rendering |
| `\\(expression\\)` | Inline LaTeX |
| `$$expression$$` | Block LaTeX |

### Input Widgets

| Widget | Syntax |
|--------|--------|
| Text | `textInput("id", "label")` |
| Numeric | `numericInput("id", "label", value = 0, min = 0, max = 10, step = 1)` |
| Checkboxes | `checkboxGroupInput("id", "label", choices = c("A" = "1", "B" = "2"), selected = "1")` |
| Date picker | `dateInput("id", "label")` |
| Slider | `sliderInput("id", "label", value = 70, min = 62, max = 74, step = 0.05)` |
| Submit button | `submitButton("Submit")` |
| Action button | `actionButton("goButton", "Click Me")` |

### Output Placeholders

Every output must have a matching render function in `server.R`:

| Output | Purpose |
|--------|---------|
| `textOutput("id")` | Text output (block) |
| `verbatimTextOutput("id")` | Text output (verbatim/code) |
| `plotOutput("id")` | Plot output |
| `htmlOutput("id")` | HTML output |

---

## 4. server.R — The Server Logic

The server function takes `input` and `output` objects and defines how to compute outputs from inputs.

### Reactive Expressions

Reactive expressions are functions that depend on inputs and re-evaluate only when those inputs change, ensuring efficient updates.

Reactive expressions wrap functions that depend on inputs and are re-evaluated when inputs change:

```r
shinyServer(function(input, output) {
  x <- reactive({ as.numeric(input$text1) + 100 })
  output$text1 <- renderText({ x() })
  output$text2 <- renderText({ x() + as.numeric(input$text2) })
})
```

> [!note] The `()` after `x` is required — reactive expressions must be called like functions.

### Render Functions

Render functions like `renderText()` and `renderPlot()` generate outputs in the UI, updating automatically when their dependencies change.

| Function | Purpose |
|----------|---------|
| `renderPrint({ expr })` | Render printed text |
| `renderText({ expr })` | Render text |
| `renderPlot({ code })` | Render a plot |
| `renderGvis({ code })` | Render a GoogleVis object |

### Server Example with googleVis

This server example uses `googleVis` to create an interactive histogram of a reactive population sample, updating with input changes.

```r
library(shiny)
require(googleVis)

shinyServer(function(input, output) {
  pop <- reactive({ sample(1:20, input$population, replace = TRUE) })
  popVar <- reactive({ round(var(pop()), 2) })

  output$biaVar <- renderText({
    sample <- as.data.frame(matrix(
      bootstrapSample(), nrow = input$numSample, ncol = input$sampleSize))
    return(round(mean(rowSums((sample - rowMeans(sample))^2) / input$sampleSize), 2))
  })

  output$popHist <- renderGvis({
    gvisHistogram(data.frame(pop()), options = list(
      height = "300px",
      title = "Population Distribution",
      histogram = "{ hideBucketItems: true, bucketSize: 2 }"
    ))
  })
})
```

---

## 5. Running and Distributing

Running a Shiny app locally requires `runApp()`, while distribution options include sharing the directory or deploying to Shiny Server.

### Running Locally

```r
runApp()                                    # run the app
runApp(display.mode = "showcase")           # show code alongside
```

### Debugging

- `runApp(display.mode = "showcase")` — highlights execution in real time
- `cat()` — print to stdout/R console
- `browser()` — interrupt execution and enter interactive debugging

### Distribution Options

1. **Send the directory** — quickest way to share
2. **R package** — wrap `runApp` in a package function
3. **Shiny Server** — self-hosted server for web deployment

---

## 6. The `manipulate` Package

The `manipulate` package enables quick interactive plots within RStudio using sliders and controls, without building a full Shiny app.

The `manipulate` package creates quick interactive graphics with sliders, checkboxes, and pickers:

```r
library(UsingR)
library(manipulate)

myHist <- function(mu) {
  hist(galton$child, col = "blue", breaks = 100)
  lines(c(mu, mu), c(0, 150), col = "red", lwd = 5)
  mse <- mean((galton$child - mu)^2)
  text(63, 150, paste("mu =", mu))
  text(63, 140, paste("MSE =", round(mse, 2)))
}

manipulate(myHist(mu), mu = slider(62, 74, step = 0.5))
```

The slider lets the user vary $\mu$ in real time, and the histogram, vertical line, and MSE text update interactively.

---

## Key Intuitions

1. A Shiny app = `ui.R` (layout) + `server.R` (logic), run with `runApp()`.
2. **Reactive expressions** ensure outputs update automatically when inputs change.
3. **Commas** between sibling elements are the #1 source of bugs.
4. `manipulate` is a lightweight alternative for quick interactive plots (does not require a full Shiny app).
5. Understanding the input → reactive → output pipeline is the core of Shiny development.

---

## Revision Checklist

- [ ] Can describe the role of `ui.R` and `server.R`
- [ ] Can create basic layouts with `pageWithSidebar`, `fluidPage`, and `column`
- [ ] Can use common input widgets (slider, numeric, text, checkbox, date)
- [ ] Can create output placeholders and match them to server render functions
- [ ] Can write reactive expressions and explain when they re-evaluate
- [ ] Can use `manipulate` for interactive plots
- [ ] Knows how to debug and distribute Shiny apps
---

## Make it click: Trace the reactive dependency

**Work it through.** In a Shiny app, a slider input called `n` changes when the slider moves. A reactive expression computes a value only when needed; a plot output consumes it. An observer tied to a save button instead performs an action, such as saving, when clicked.

**See it.** Draw arrows from the slider input to the computed squares, then to the plot output. Draw a separate arrow from the save button to the save action. The second arrow does not produce a reusable value. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#cv)

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4412-advanced-data-science-part-iii-questions-from-class-material) questions 1–4 cover Shiny files and functions. [Midsem MCQ Mock Test 1](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-test-1) Q28 targets reactive expressions versus observers.

> [!warning] Common trap
> A reactive expression is called with parentheses inside consumers; an observer is for side effects, not a cached value to read.
