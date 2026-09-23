---
title: "06 - Interactive Graphics with R"
math_syntax: typst
---

# Interactive Graphics with R

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Developing Data Products — Week 2

---

## First, read the notation in words

A static graphic fixes one view of the data. An interactive graphic lets a reader inspect a point, filter a subset, zoom, or change a parameter. A **tooltip** adds detail for one mark. A **filter** changes which cases are shown. A **linked view** updates one chart when another chart’s selection changes. Name the question the interaction answers before choosing a widget.

> [!question] Try to recall
> Ask: “What would I learn by changing this control?” If the answer is nothing, the interaction is decoration.

---

## 1. rCharts

rCharts is a package by Ramnath Vaidyanathan for creating **interactive JavaScript visualisations** from R. It uses a formula interface similar to `lattice`.

### Installation

```r
install.packages("devtools")
require(devtools); install_github("rCharts", "ramnathv")
```

### Supported Libraries

| Library | Function | Chart Type |
|---------|----------|-----------|
| Polychart | `rPlot()` | Paneled scatter plots |
| Morris | `mPlot()` | Time series / stock charts |
| NVD3 | `nPlot()` | Stacked/grouped bar charts |
| xCharts | — | Shaded line graphs |
| HighCharts | — | Stacked scatter/line charts |
| Leaflet | — | Interactive maps |
| Rickshaw | — | Stacked area / time series |

### Usage Pattern

The `nPlot()` function from `rCharts` creates interactive bar charts, with methods for saving, printing, and embedding the output.

```r
require(rCharts)
n1 <- nPlot(Freq ~ Hair, group = "Eye", type = "multiBarChart",
            data = subset(haireye, Sex == "Male"))
n1$show("inline", include_assets = TRUE, cdn = FALSE)
```

Key object methods:
- `n1$html()` — print the HTML
- `n1$save("file.html")` — save to file
- `n1$print()` — print JavaScript
- `n1$show("inline")` — embed in Rmd (HTML output)
- `n1$publish("name", host = "gist")` — publish to RPubs or GitHub Gist

### Embedding in Slidify

Embedding `rCharts` in Slidify involves YAML configuration for external widgets and using iframes to display saved chart files.

Add to YAML: `ext_widgets: {rCharts: ["libraries/nvd3"]}`

Embed saved chart: `cat('<iframe src="map3.html" width=100%, height=600></iframe>')`

---

## 2. ggvis

ggvis combines R's data manipulation with web-based rendering using Vega. It uses the **pipe operator** `%>%` to chain graphing functions.

```r
library(ggvis)
mtcars %>%
  ggvis(~mpg, ~wt, fill = ~as.factor(am)) %>%
  layer_points() %>%
  layer_smooths()
```

For canvas rendering (RStudio viewer): add `%>% set_options(renderer = "canvas")`

**Key advantage**: declarative grammar (like ggplot2) with interactive browser rendering.

---

## 3. googleVis API

googleVis creates **interactive HTML charts** powered by Google Charts.

### Chart Types

| Function | Chart Type |
|----------|-----------|
| `gvisMotionChart()` | Motion chart (animated scatter) |
| `gvisGeoChart()` | Interactive map |
| `gvisTable()` | Interactive table |
| `gvisLineChart()` | Line chart |
| `gvisColumnChart()` | Bar chart |
| `gvisTreeMap()` | Tree map |

### Line Chart Example

The `gvisLineChart()` function creates interactive line charts with customizable options for titles, legends, and styling.

```r
library(googleVis)
op <- options(gvis.plot.tag = "chart")

df <- data.frame(label = c("US", "GB", "BR"), val1 = c(1, 3, 4), val2 = c(23, 12, 32))
Line <- gvisLineChart(df, xvar = "label", yvar = c("val1", "val2"),
  options = list(
    title = "Hello World", legend = "bottom",
    titleTextStyle = "{color:'red', fontSize:18}",
    curveType = "function", width = 500, height = 300
  ))
plot(Line)
```

### Merging Charts

`gvisMerge()` combines two googleVis charts into a single layout, either horizontally or vertically, for composite visualizations.

```r
G  <- gvisGeoChart(Exports, "Country", "Profit", options = list(width = 200, height = 100))
T1 <- gvisTable(Exports, options = list(width = 200, height = 270))
M  <- gvisMotionChart(Fruits, "Fruit", "Year", options = list(width = 400, height = 370))

GT  <- gvisMerge(G, T1, horizontal = FALSE)
GTM <- gvisMerge(GT, M, horizontal = TRUE,
                 tableOptions = "bgcolor=\"#CCCCCC\" cellspacing = 10")
plot(GTM)
```

> [!note] `gvisMerge()` can only combine **two** charts at a time. Chain calls for more.

### Printing for Slidify/HTML

Setting the `gvis.plot.tag` option to "chart" allows printing only the chart's JavaScript code, useful for embedding in HTML.

```r
print(Line, "chart")  # prints only the chart JavaScript
# or set globally:
op <- options(gvis.plot.tag = "chart")
plot(Line)
```

---

## 4. plotly

plotly enables sharing and editing plots on the web. Every element of a plot can be customised interactively.

### Setup

Plotly enables interactive, shareable plots by converting ggplot2 objects to web-based visualizations with hover tooltips and editing.

```r
install.packages("devtools")
devtools::install_github("ropensci/plotly")
library(plotly)
set_credentials_file("username", "api_key")
```

### ggplot2 Integration

```r
library(plotly); library(ggplot2)
g <- ggplot(myData, aes(y = enrollment, x = class, fill = as.factor(offering))) +
  geom_bar(stat = "identity")
g
py <- plotly()
out <- py$ggplotly(g)
out$response$url  # returns the URL of the plot on plot.ly
```

---

## 5. ShinyApps.io

A platform by RStudio for hosting Shiny apps on the web.

### Deployment Steps

1. Install devtools: `install.packages("devtools")`
2. Install shinyapps: `devtools::install_github("rstudio/shinyapps")`
3. Authenticate via the generated token
4. Deploy: `deployApp()`

Your app will be hosted at `https://youraccount.shinyapps.io/appname`.

---

## Key Intuitions

1. **rCharts** provides a thin R wrapper around many JavaScript charting libraries — great for variety.
2. **ggvis** is ggplot2-like grammar with browser-based interactivity.
3. **googleVis** leverages Google Charts for quick, interactive HTML visualisations.
4. **plotly** adds full interactivity to any ggplot2 plot and enables web-based sharing.
5. **ShinyApps.io** is the simplest way to deploy Shiny apps to the web.

---

## Revision Checklist

- [ ] Can install and use rCharts to create interactive bar/scatter/map charts
- [ ] Can use ggvis pipe-based grammar to create layered interactive plots
- [ ] Can create googleVis charts (line, geo, motion) and merge them
- [ ] Can publish rCharts to RPubs and Shiny apps to ShinyApps.io
- [ ] Understands the differences between rCharts, ggvis, googleVis, and plotly
---

## Make it click: Interaction should answer a question

**Work it through.** Plot car weight against fuel economy using `plot(mtcars$wt, mtcars$mpg)`. A static scatterplot shows the downward association. In an interactive version, hovering can reveal model, weight and mileage; filtering by cylinder count tests whether the pattern remains within subgroups. Interactivity changes the investigation only when a control maps to a meaningful question.

**See it.** Use the other visual lab tabs as examples: each slider changes an assumption and recomputes a quantity. Explain what a tooltip reveals that a label alone would not.

**What the questions are checking.** This chapter is Developing Data Products Week 2. The first mock does not contain a direct interactive-graphics question; use the chapter’s R examples and [Extra Practice](/notes/studies-cra-4412-advanced-data-science-part-iii-extra-practice) instead of forcing an unrelated quiz link.

> [!warning] Common trap
> A plot becoming clickable does not by itself make its statistical message clearer.
