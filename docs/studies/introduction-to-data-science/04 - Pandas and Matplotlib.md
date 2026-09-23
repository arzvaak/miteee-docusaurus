---
title: "04 - Pandas and Matplotlib"
math_syntax: typst
---

# Chapter 04 — Pandas and Matplotlib

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) · Next: [05 - Correlation](/notes/studies-introduction-to-data-science-05---correlation)

> [!summary] Topic in one sentence
> Pandas supplies labelled tabular structures; Matplotlib turns numerical data into line, bar and scatter graphics whose labels and visual encodings should match the question.

## 1. Matplotlib

Matplotlib is a free, open-source Python data-visualisation library that works naturally with NumPy arrays and Pandas objects.

The installation route shown is:

1. Open pypi.org.
2. Search for matplotlib.
3. Open the matplotlib 3.7.2 package page.
4. Run pip install matplotlib in Jupyter Notebook.

For a current environment, the version can differ; the learning point is to install the package before importing pyplot.


## 2. Pandas data structures

### Series

A Series is a one-dimensional labelled homogeneous array. It can hold one data type (integer, string, float or Python objects), is size-immutable, and stores/manipulates a sequence of values. One row or one column of a DataFrame is a Series.

### DataFrame

A DataFrame is a two-dimensional labelled table with data aligned in rows and columns. Its columns can have heterogeneous types and its size is mutable. It behaves like a programmable spreadsheet.

### Panel

`Panel` was a three-dimensional labelled container in older Pandas versions. It has been removed; use a MultiIndex DataFrame or `xarray` for modern three-dimensional labelled data.

![p004-pandas-dataframe](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p004-pandas-dataframe.jpg)

![p004-pandas-series](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p004-pandas-series.jpg)


## 3. Loading libraries

Import the libraries with conventional aliases:

```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import math
```

Only pyplot, NumPy and Pandas are used in the later examples; math is listed as an available standard-library module.


## 4. Basic line graph

The first line-graph example creates labelled x/y lists, sets figure size and DPI, then styles a line with colour, dashed linestyle, linewidth, marker, marker size and marker edge colour.

```python
import matplotlib.pyplot as plt
import numpy as np

x = [1, 3, 5, 7, 9, 11]
y = [2, 4, 6, 8, 10, 12]

plt.figure(figsize=(6, 4), dpi=100)
plt.plot(
    x,
    y,
    label="Output 1",
    color="green",
    linestyle="--",
    linewidth=3.5,
    marker="h",
    markersize=12,
    markeredgecolor="black",
)
plt.title("Basic Line Graph", fontdict={"fontname": "DejaVu Sans", "fontsize": 18})
```

The follow-up overlays a second curve, labels axes, controls ticks, adds a legend, saves a high-resolution PNG and displays the figure:

```python
x_new = np.arange(0, 10, 0.5)
plt.plot(x_new, (x_new ** 2) / 10, color="red", label="Output 2")
plt.xlabel("Input", fontdict={"fontname": "DejaVu Sans"})
plt.ylabel("Output")
plt.xticks([0, 1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 10])
plt.yticks([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14])
plt.legend()
plt.savefig("BasicLineGraphTut1.png", dpi=300)
plt.show()
```

![p008-line-graph](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p008-line-graph.jpg)

> [!tip] Plot reading
> The green series is the supplied discrete x/y sequence. The red series samples x²/10 every 0.5 units. A legend and axis labels make those two meanings distinguishable.


## 5. Bar chart

The bar-chart example counts students in grade categories and applies hatching patterns.

```python
import matplotlib.pyplot as plt

grades = ["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF"]
student_count = [4, 12, 24, 28, 18, 10, 4, 2]

bars = plt.bar(grades, student_count)
patterns = ["*", "/", "o", "0", "\\", "-", "*", "."]
for bar, pattern in zip(bars, patterns):
    bar.set_hatch(pattern)

plt.xlabel("Grade")
plt.ylabel("Student count")
plt.title("Students by grade")
plt.show()
```

The zipped version assigns hatch patterns without mutating a list while iterating.

![p010-bar-chart](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p010-bar-chart.jpg)


## 6. Scatter plots

### Basic scatter

The first scatter example supplies paired x/y observations and changes marker size, colour, shape, edge, line width and transparency.

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 4, 3, 5, 6, 8, 6, 9, 8, 7, 8, 9, 7, 6, 6, 8]
y = [2, 2, 1, 3, 4, 4, 7, 9, 5, 6, 3, 7, 8, 7, 8, 9, 9, 8, 7]

plt.scatter(
    x, y, s=150, c="red", marker="o",
    edgecolors="black", linewidths=2, alpha=0.7,
)
plt.xlabel("x")
plt.ylabel("y")
plt.tight_layout()
plt.show()
```

![p012-scatter-basic](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p012-scatter-basic.jpg)

### Scatter with colour and size ratings

The second example maps a separate colour rating and size rating onto each point and adds a colour bar.

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 4, 3, 5, 6, 8, 6, 9, 8, 7, 8, 9, 7, 6, 6, 8, 5]
y = [2, 2, 1, 3, 4, 4, 7, 9, 5, 6, 3, 7, 8, 7, 8, 9, 9, 8, 7, 5]
color_ratings = [8, 1, 6, 9, 2, 5, 9, 3, 8, 9, 1, 4, 6, 9, 2, 7, 8, 4, 9, 1]
size_ratings = [200, 300, 600, 250, 550, 575, 275, 230, 290, 430,
                470, 520, 560, 370, 330, 480, 390, 290, 400, 450]

plt.scatter(
    x, y,
    s=size_ratings,
    c=color_ratings,
    cmap="Reds",
    marker="o",
    edgecolors="black",
    linewidths=2,
    alpha=0.7,
)
colour_bar = plt.colorbar()
colour_bar.set_label("Rating level")
plt.xlabel("x")
plt.ylabel("y")
plt.tight_layout()
plt.show()
```

![p014-scatter-rated](/content-assets/studies/introduction-to-data-science/Assets/Topic%2004/p014-scatter-rated.jpg)

> [!warning] Length matching
> Every x value needs one y value; colour and size arrays also need one entry per point. A mismatched length raises an error or produces an unintended visual mapping.


## 7. Common plotting mistakes

- Calling show before completing labels, legend and colour bar.
- Saving a figure after closing it or before the final artist is added.
- Choosing a font name that is not installed. The examples use DejaVu Sans for portability.
- Treating a scatter marker’s size or colour as decoration when it actually encodes data.
- Using the old style name seaborn on a modern Matplotlib installation. If the old name fails, use seaborn-v0_8 or install Seaborn explicitly.

## 8. Cross-links

- NumPy arrays provide the numerical inputs used by Matplotlib: [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing).
- Correlation is often inspected with a scatter plot: [05 - Correlation](/notes/studies-introduction-to-data-science-05---correlation).
- Summary statistics and test results can be visualised after Chapter 06: [06 - Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics).

## 9. Question bank

### Questions from class material

The plotting tasks below practise the techniques covered in this chapter:

1. Build a labelled line plot with a title, legend, grid, controlled axis limits and custom ticks. Save it before displaying it.
2. Construct a bar chart from paired category and value lists. Add labels and choose a colour that keeps every bar readable.
3. Create a scatter plot and control marker size, colour, shape, edge, line width and transparency.
4. Map a third variable to colour and a fourth variable to marker size. Add and label a colour bar, and verify that all input arrays have equal length.

### Extra practice

Use this table for Questions 1–4.

| Product | January | February | March |
| --- | ---: | ---: | ---: |
| A | 20 | 25 | 30 |
| B | 15 | 18 | 24 |
| C | 12 | 20 | 28 |

1. **Aggregation, 4 marks.** Calculate the total sales for each product and each month.

   > [!success]- Answer
   > Product totals are A = 75, B = 57 and C = 60. Month totals are January = 47, February = 63 and March = 82.

2. **Pandas construction, 5 marks.** Create the table as a DataFrame with products as the index. Add a `Total` column.

   > [!success]- Answer
   > ```python
   > import pandas as pd
   >
   > sales = pd.DataFrame(
   >     {"January": [20, 15, 12], "February": [25, 18, 20], "March": [30, 24, 28]},
   >     index=["A", "B", "C"],
   > )
   > sales["Total"] = sales.sum(axis=1)
   > ```

3. **Line plot, 5 marks.** Plot total monthly sales against month. Add a title, labelled axes, markers and a grid.

   > [!success]- Answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > months = ["January", "February", "March"]
   > monthly_totals = [47, 63, 82]
   > plt.plot(months, monthly_totals, marker="o", label="Total sales")
   > plt.xlabel("Month")
   > plt.ylabel("Units sold")
   > plt.title("Monthly sales")
   > plt.grid(True, alpha=0.3)
   > plt.legend()
   > plt.show()
   > ```

4. **Bar chart, 5 marks.** Plot average monthly sales for each product and annotate every bar. State the three averages.

   > [!success]- Answer
   > Averages are A = 25, B = 19 and C = 20.
   > ```python
   > import matplotlib.pyplot as plt
   >
   > products = ["A", "B", "C"]
   > averages = [25, 19, 20]
   > figure, axis = plt.subplots()
   > bars = axis.bar(products, averages, color=["steelblue", "orange", "seagreen"])
   > axis.set_xlabel("Product")
   > axis.set_ylabel("Average monthly sales")
   > axis.bar_label(bars)
   > plt.show()
   > ```

5. **Scatter plot, 6 marks.** Advertising spend is `(2, 3, 5, 6, 8)` thousand rupees and sales are `(20, 25, 35, 40, 52)` thousand rupees. Plot the relationship, map point colour to store rating `(1, 2, 2, 3, 4)`, add a colour bar and describe the visible relationship.

   > [!success]- Answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > spend = [2, 3, 5, 6, 8]
   > sales = [20, 25, 35, 40, 52]
   > ratings = [1, 2, 2, 3, 4]
   > points = plt.scatter(spend, sales, c=ratings, cmap="viridis", s=100)
   > plt.xlabel("Advertising spend (thousand rupees)")
   > plt.ylabel("Sales (thousand rupees)")
   > plt.title("Advertising spend and sales")
   > plt.colorbar(points, label="Store rating")
   > plt.show()
   > ```
   > Sales rise as advertising spend rises, so the plot shows a strong positive association. The plot alone does not establish causation.

6. **Histogram selection, 5 marks.** Plot a histogram for ages `(18, 19, 20, 20, 21, 22, 24, 25, 27, 29, 31, 34)` using bins `[18, 22, 26, 30, 34, 38]`. Manually find the frequency in each interval, using left-inclusive and right-exclusive bins except the last.

   > [!success]- Answer
   > Frequencies are 5, 3, 2, 1 and 1.
   > ```python
   > import matplotlib.pyplot as plt
   >
   > ages = [18, 19, 20, 20, 21, 22, 24, 25, 27, 29, 31, 34]
   > plt.hist(ages, bins=[18, 22, 26, 30, 34, 38], edgecolor="black")
   > plt.xlabel("Age")
   > plt.ylabel("Frequency")
   > plt.show()
   > ```

7. **Error diagnosis, 3 marks.** Explain the error in `plt.scatter([1, 2, 3], [4, 5], c=[1, 2, 3])` and correct it.

   > [!success]- Answer
   > The x and y arrays describe different numbers of points. Supply three y-values, for example `plt.scatter([1, 2, 3], [4, 5, 6], c=[1, 2, 3])`.
