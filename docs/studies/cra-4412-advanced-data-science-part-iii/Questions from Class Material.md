---
title: "Questions from Class Material"
math_syntax: typst
---

# Questions from Class Material

> Reproduced Coursera quiz questions are kept here. Newly generated questions are in [Extra Practice](/notes/studies-cra-4412-advanced-data-science-part-iii-extra-practice) and [Midsem MCQ Mock Tests](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-tests).

---

## Developing Data Products — Week 1 Quiz

### Question 1: Shiny File Requirements

**Which of the following must a Shiny application contain?** (True/False for each)

| Statement | Answer |
|-----------|--------|
| A `server.R` file containing a call to `shinyServer()` | **True** |
| A `ui.R` file containing a call to `shinyUI()` | **True** |

**Explanation:** A standard two-file Shiny application places `ui.R` and `server.R` in the same directory. The former defines the interface and the latter defines server behavior.

### Question 2: Debugging Shiny UI Errors

**A Shiny app throws an error when rendered. Looking at the `ui.R` code, the following statement is true:**

| Statement | Answer |
|-----------|--------|
| There is a missing comma in the sidebar panel | **True** |

**Explanation:** Arguments representing sibling UI elements must be separated by commas. A missing comma can prevent the interface expression from being parsed.

### Question 3: Shiny Function Arguments

**Consider the supplied Shiny function definition. What is true about it?**

| Statement | Answer |
|-----------|--------|
| No arguments are defined for `pickXY()` | **True** |

**Explanation:** A function declared with empty parentheses has no formal arguments. It may still obtain values from its enclosing environment.

### Question 4: Shiny Gadgets

**Which statements about Shiny Gadgets are true?** (Select all that apply)

| Statement | Answer |
|-----------|--------|
| They are designed for R users during data analysis | **True** |
| They generally use a compact interface that fits on one page | **True** |

**Explanation:** A Shiny Gadget is a compact interactive tool intended to support an analyst inside an R workflow.
