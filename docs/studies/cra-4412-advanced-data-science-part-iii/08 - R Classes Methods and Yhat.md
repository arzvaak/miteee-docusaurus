---
title: "08 - R Classes Methods and Yhat"
math_syntax: typst
---

# R Classes, Methods and Yhat

> [!note] ◇ AFTER MIDSEM
> This chapter is outside the immediate midsem boundary and is retained for the complete course.


> Developing Data Products — Weeks 4–5 *(later material, outside midterm boundary)*

---

> [!warning] This chapter covers DDP Weeks 4–5, which are **outside the current exam boundary**. Study this material only after you are confident with Weeks 1–3.

---

## First, read the notation in words

An R **class** marks what kind of object you have. A **generic** such as `print()` asks R to choose behavior based on class; a **method** such as `print.forecast()` supplies that behavior. S3 uses class attributes and naming conventions; S4 uses explicit class and method definitions. A prediction API receives a request, validates inputs, invokes a model and returns a result. Keep the model object and the public input/output contract distinct.

> [!question] Try to recall
> One object can be printed and plotted using different methods. What changes: the underlying data or the behavior applied to it?

---

## 1. R Classes and Methods (OOP)

R supports object-oriented programming through two systems: **S3** (informal, old-style) and **S4** (formal, new-style). Both coexist; S4 is encouraged for new projects.

### Key Concepts

| Concept | Definition |
|---------|-----------|
| **Class** | A description of a data type (e.g. `numeric`, `lm`, `data.frame`) |
| **Object** | An instance of a class (created with `new()`) |
| **Method** | A function that operates on objects of a specific class |
| **Generic function** | An R function that dispatches to the appropriate method based on the object's class |

Generic functions themselves perform no computation. When called (e.g. `plot(x)`), R:

1. Checks the class of `x`
2. If a method for that class exists, calls it
3. If not, searches for a default method
4. If no default exists, throws an error

### Inspecting Classes and Methods

```r
# S3
methods("mean")                    # list methods for the 'mean' generic
getS3method("mean", "default")     # view the code for mean.default

# S4
showMethods("show")                # list methods for the 'show' generic
getMethod("show", "numeric")       # view the code for a specific method
```

> [!warning] Never call S3 methods directly (e.g. `mean.default`). Always use the generic (`mean()`).

### Creating a New Class (S4)

```r
library(methods)

# Define a polygon class with x and y slots
setClass("polygon", representation(x = "numeric", y = "numeric"))

# Define a plot method for polygon objects
setMethod("plot", "polygon",
  function(x, y, ...) {
    plot(x@x, x@y, type = "n", ...)
    xp <- c(x@x, x@x[1])  # close the polygon
    yp <- c(x@y, x@y[1])
    lines(xp, yp)
  })

showMethods("plot")
```

When creating a new class, always write methods for `print`/`show`, `summary`, and `plot`.

### Why Create New Classes?

- Represent new data types (gene expression, space-time, sparse matrices)
- Abstract implementation details from users
- Extend R's functionality in domain-specific ways

---

## 2. Yhat — Deploying Models as APIs

Yhat (now largely historical) was a platform for hosting predictive models as web APIs.

### Workflow

1. **Build a model** in R
2. **Write three functions**:
   - `model.require()` — dependencies
   - `model.transform()` — data preprocessing
   - `model.predict()` — prediction logic
3. **Configure credentials** and deploy

### Example: Pollution Model

```r
library(fields)

# Build prediction function
pollutant <- function(df) {
  x <- data.matrix(df[, c("lon", "lat")])
  r <- df$radius
  d <- rdist.earth(monitors, x)
  use <- lapply(seq_len(ncol(d)), function(i) which(d[, i] < r[i]))
  levels <- sapply(use, function(idx) {
    with(pollavg[idx, ], tapply(level, Parameter.Name, mean))
  })
  dlevel <- as.data.frame(t(levels))
  data.frame(df, dlevel)
}

# Deploy to Yhat
library(yhatr)
model.require <- function() { library(fields) }
model.transform <- function(df) { df }
model.predict <- function(df) { pollutant(df) }

yhat.config <- c(
  username = "email@gmail.com",
  apikey = "your-api-key",
  env = "http://sandbox.yhathq.com/"
)
yhat.deploy("pollutant")
```

### Accessing the Model

```r
# From R
df <- data.frame(lon = c(-76.6167, -118.25), lat = c(39.2833, 34.05), radius = 20)
yhat.predict("pollutant", df)

# From command line (curl)
# curl -X POST -H "Content-Type: application/json" \
#   --user email@gmail.com:apikey \
#   --data '{"lon": -76.61, "lat": 39.28, "radius": 50}' \
#   http://cloud.yhathq.com/user/models/pollutant/
```

### Simpler Example: Ozone Prediction

```r
fit <- lm(Ozone ~ Wind + Temp, data = airquality)

model.require <- function() {}
model.transform <- function(df) {
  transform(df, Wind = as.numeric(as.character(Wind)),
            Temp = as.integer(as.character(Temp)))
}
model.predict <- function(df) {
  result <- data.frame(Ozone = predict(fit, newdata = df))
  data.frame(result, Temp = as.character(df$Temp), Wind = as.character(df$Wind))
}

yhat.deploy("ozone")
yhat.predict("ozone", data.frame(Wind = 9.7, Temp = 67))
```

---

## Key Intuitions

1. R's OOP has two systems: **S3** (informal) and **S4** (formal). Both use generic functions to dispatch methods.
2. The `@` operator accesses S4 slots; `$` accesses list elements.
3. Yhat provided a framework for deploying R models as REST APIs.
4. The deployment pattern (require → transform → predict) is common across model-serving platforms.

---

## Revision Checklist

- [ ] Can distinguish S3 and S4 class systems
- [ ] Can define a new S4 class with `setClass()` and method with `setMethod()`
- [ ] Can explain how generic function dispatch works
- [ ] Can describe the Yhat deployment workflow (model.require, model.transform, model.predict)
- [ ] Understands how models can be accessed via API after deployment
---

## Make it click: Objects and methods answer different questions

**Work it through.** An R object can have class `forecast`. A `print.forecast()` method decides how to display it; `plot.forecast()` decides how to visualize it. The underlying forecast data can remain identical. When exposing a prediction through an API, define accepted inputs and validate them before calling the model.

**See it.** Draw one forecast object pointing to print and plot methods. Then add an API request pointing to input validation and prediction.

**What the questions are checking.** This is after the immediate midsem boundary. The current midsem mocks do not directly test S3/S4 dispatch or Yhat deployment.

> [!warning] Common trap
> The class names an object’s type; a method supplies behavior for a generic operation on that type.
