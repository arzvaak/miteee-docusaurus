---
title: "Extra Practice"
math_syntax: typst
---

# Extra Practice

Newly generated exam-style problems with full worked answers, organised by chapter. For class-origin exercises, see [Questions from Class Material](/notes/studies-introduction-to-data-science-questions-from-class-material).

---

## Chapter 01 — Foundations of Data Science

1. **Data volume, 4 marks.** A network has 250 sensors. Every sensor records two values per minute. Each stored record occupies 16 bytes. Find the number of records and uncompressed storage required for 30 days. If compression is 4:1, find the compressed size.

   > [!success]- Answer
   > Records $= 250 times 2 times 60 times 24 times 30 = 21,600,000$. Uncompressed storage $= 21,600,000 times 16 = 345,600,000$ bytes, or 345.6 MB in decimal units. At 4:1 compression, storage $= 86.4$ MB.

2. **ETL row count, 4 marks.** An extracted table contains 12,000 rows. The transform stage removes 3% exact duplicates. It then removes 5% of the remaining rows because the target field is missing. How many rows reach the load stage?

   > [!success]- Answer
   > Duplicate removal leaves $12,000 times 0.97 = 11,640$ rows. Missing-value removal leaves $11,640 times 0.95 = 11,058$ rows. Percentages are sequential, so subtracting 8% directly would be wrong.

3. **Image storage, 3 marks.** An uncompressed RGB image is 1920 × 1080 pixels with 8 bits per channel. Calculate its size in bytes and MiB.

   > [!success]- Answer
   > Three channels at one byte per channel give $1920 times 1080 times 3 = 6,220,800$ bytes. Dividing by $1024^2$ gives approximately 5.93 MiB.

4. **Transfer time, 2 marks.** A 2 GB CSV file is read at 25 MB/s. Using decimal units, estimate the minimum read time.

   > [!success]- Answer
   > $2000 / 25 = 80$ seconds. Real processing normally takes longer because parsing and type conversion add overhead.

5. **Pipeline design, 6 marks.** A college receives attendance as CSV, student details as XLSX and event logs as JSON. Design an ETL pipeline that produces one analysis-ready table. State one validation at each stage.

   > [!success]- Answer outline
   > Extract each format with the matching reader and preserve untouched raw copies. Transform by standardising student IDs, dates, column names and missing-value codes, then join on the validated student ID. Validate file counts during extraction, uniqueness and types during transformation, and row counts plus referential integrity after loading.

6. **Format choice, 4 marks.** Choose CSV, JSON, XLSX or ZIP for each case and justify it: a flat machine-readable table, nested API data, a workbook with formulas and formatting, and a bundle of 20 related files.

   > [!success]- Answer
   > CSV for the flat table, JSON for nested API data, XLSX for formulas and workbook presentation, and ZIP for bundling/compressing several files. ZIP is a container, not a tabular data format.

---

## Chapter 02 — Python Fundamentals

1. **Assignment trace, 2 marks.** Find the final values of `x` and `y`.

   ```python
   x, y = 4, 9
   x, y = y, x + y
   ```

   > [!success]- Answer
   > The right-hand side is evaluated first, so `x = 9` and `y = 13`.

2. **Loop trace, 3 marks.** Find the printed value.

   ```python
   total = 0
   for value in range(2, 11, 2):
       total += value
   print(total)
   ```

   > [!success]- Answer
   > `range(2, 11, 2)` produces 2, 4, 6, 8, 10, so the program prints `30`.

3. **While loop, 4 marks.** Write a loop that repeatedly adds the digits of a positive integer. For input `5832`, the output must be `18`.

   > [!success]- Answer
   > ```python
   > number = 5832
   > digit_sum = 0
   > while number > 0:
   >     digit_sum += number % 10
   >     number //= 10
   > print(digit_sum)
   > ```

4. **Decision logic, 4 marks.** Write a function that returns `"positive even"`, `"positive odd"`, `"zero"` or `"negative"` for an integer.

   > [!success]- Answer
   > ```python
   > def classify(number):
   >     if number < 0:
   >         return "negative"
   >     if number == 0:
   >         return "zero"
   >     if number % 2 == 0:
   >         return "positive even"
   >     return "positive odd"
   > ```

5. **Collections, 4 marks.** For `values = [4, 2, 4, 7, 2, 9]`, find the number of distinct values, the sorted distinct values and their sum.

   > [!success]- Answer
   > `set(values)` is `{2, 4, 7, 9}`. The count is 4, the sorted list is `[2, 4, 7, 9]`, and the sum is 22.

6. **Function arguments, 3 marks.** What does this call return, and what type is `numbers` inside the function?

   ```python
   def average(*numbers):
       return sum(numbers) / len(numbers)

   result = average(6, 8, 10, 12)
   ```

   > [!success]- Answer
   > `numbers` is the tuple `(6, 8, 10, 12)` and `result` is `9.0`.

7. **Dictionary accumulation, 5 marks.** Count the frequency of every character in `"data"` without using `collections.Counter`.

   > [!success]- Answer
   > ```python
   > counts = {}
   > for character in "data":
   >     counts[character] = counts.get(character, 0) + 1
   > print(counts)  # {'d': 1, 'a': 2, 't': 1}
   > ```

8. **Debugging, 3 marks.** Explain why the following loop never terminates and correct it.

   ```python
   counter = 5
   while counter > 0:
       print(counter)
   ```

   > [!success]- Answer
   > `counter` never changes. Add `counter -= 1` inside the loop after `print(counter)`.

---

## Chapter 03 — NumPy and Image Processing

1. **Array properties, 4 marks.** An `int64` array contains the integers 1 through 12 and is reshaped to `(3, 4)`. Find `ndim`, `size`, `itemsize` and `nbytes`.

   > [!success]- Answer
   > `ndim = 2`, `size = 12`, `itemsize = 8` bytes and `nbytes = 12 times 8 = 96` bytes.

2. **Indexing, 4 marks.** Let `a = np.arange(1, 13).reshape(3, 4)`. Find `a[::2, 1:4:2]`.

   > [!success]- Answer
   > Rows 0 and 2 and columns 1 and 3 are selected, giving `[[2, 4], [10, 12]]`.

3. **Axis reductions, 4 marks.** For $A = ((2, 4, 6), (1, 3, 5))$, find `A.sum(axis=0)` and `A.sum(axis=1)`.

   > [!success]- Answer
   > Column sums are `[3, 7, 11]`; row sums are `[12, 9]`. Axis 0 collapses rows, while axis 1 collapses columns.

4. **Matrix operations, 6 marks.** For $A = ((1, 2), (3, 4))$ and $B = ((2, 0), (1, 2))$, calculate the elementwise product, $A B$ and $det(A)$.

   > [!success]- Answer
   > Elementwise product: `[[2, 0], [3, 8]]`. Matrix product: `[[4, 4], [10, 8]]`. $det(A) = 1 times 4 - 2 times 3 = -2$.

5. **Image slicing, 4 marks.** An RGB image has shape `(480, 640, 3)`. Find the shapes produced by `pic[40:440, 80:560]` and `pic[::2, ::2]`.

   > [!success]- Answer
   > The crop has 400 rows and 480 columns, so its shape is `(400, 480, 3)`. Taking every second row and column gives `(240, 320, 3)`.

6. **Thresholding, 4 marks.** Apply `np.where(a > 100, 255, 0)` to `a = [[40, 120, 200], [99, 100, 101]]`. Give the result and the number of white entries.

   > [!success]- Answer
   > The result is `[[0, 255, 255], [0, 0, 255]]`; three entries become 255. The value 100 remains 0 because the condition is strictly greater than 100.

7. **Memory, 3 marks.** A grayscale `int16` image has shape `(1000, 800)`. Calculate its storage requirement before compression.

   > [!success]- Answer
   > There are 800,000 elements at 2 bytes each, so storage is 1,600,000 bytes, approximately 1.60 MB or 1.53 MiB.

8. **Reshape validity, 3 marks.** Which target shapes are valid for an array of size 24: `(4, 6)`, `(2, 3, 4)`, `(5, -1)` and `(2, 2, 5)`?

   > [!success]- Answer
   > `(4, 6)` and `(2, 3, 4)` are valid because their products are 24. `(5, -1)` is invalid because 24 is not divisible by 5. `(2, 2, 5)` is invalid because its product is 20.

---

## Chapter 04 — Pandas and Matplotlib

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

---

## Chapter 05 — Correlation

1. **Pearson correlation from raw data, 8 marks.** For $x = (2, 4, 6, 8, 10)$ and $y = (3, 5, 8, 9, 12)$, calculate Pearson's correlation coefficient and interpret it.

   > [!success]- Answer
   > $n = 5$, $sum x = 30$, $sum y = 37$, $sum x^2 = 220$, $sum y^2 = 323$ and $sum x y = 266$.
   >
   > $$
   > r = frac(5(266) - (30)(37), sqrt((5(220) - 30^2)(5(323) - 37^2))) = frac(220, sqrt(49200)) approx 0.9918
   > $$
   >
   > The variables have a very strong positive linear correlation.

2. **Spearman correlation, 7 marks.** Five students have Mathematics scores `(68, 75, 82, 90, 95)` and Programming scores `(72, 70, 88, 85, 96)`. Rank both variables from lowest to highest and calculate Spearman's coefficient.

   > [!success]- Answer
   > Mathematics ranks are `(1, 2, 3, 4, 5)` and Programming ranks are `(2, 1, 4, 3, 5)`. Thus $sum d_i^2 = 4$.
   >
   > $$
   > r_s = 1 - frac(6(4), 5(5^2 - 1)) = 0.8
   > $$
   >
   > The rankings have a strong positive monotonic relationship.

3. **Perfect negative correlation, 3 marks.** Without using software, find the correlation for $x = (1, 2, 3, 4)$ and $y = (20, 15, 10, 5)$.

   > [!success]- Answer
   > Every increase of 1 in x gives a decrease of 5 in y, and all points lie exactly on a descending line. Therefore $r = -1$.

4. **Coefficient of determination, 4 marks.** A study reports $r = -0.72$ between screen time and sleep duration. Find $r^2$ and interpret the sign and squared value.

   > [!success]- Answer
   > $r^2 = (-0.72)^2 = 0.5184$. The negative sign means higher screen time is associated with shorter sleep. About 51.84% of the variation in sleep duration is linearly associated with screen time in the fitted linear relationship; this does not prove causation.

5. **Effect of an outlier, 5 marks.** Dataset A is `x = (1, 2, 3, 4, 5)`, `y = (2, 4, 6, 8, 10)`. Dataset B changes the last y-value to −10. Predict how Pearson's coefficient changes and explain why a scatter plot must accompany it.

   > [!success]- Answer
   > Dataset A has $r = 1$. In Dataset B the high-leverage last point reverses much of the linear trend, producing $r approx -0.4472$. Pearson's coefficient is sensitive to influential observations, while the scatter plot makes the outlier visible.

6. **Tied ranks, 6 marks.** Calculate Spearman's coefficient for `x = (10, 20, 20, 30, 40, 40)` and `y = (1, 2, 3, 3, 5, 6)` using average ranks for ties.

   > [!success]- Answer
   > Average ranks for x are `(1, 2.5, 2.5, 4, 5.5, 5.5)`; for y they are `(1, 2, 3.5, 3.5, 5, 6)`. Pearson correlation of these rank vectors gives $r_s approx 0.9404$.

7. **Interpretation trap, 4 marks.** A dataset has $r = 0.03$, but its scatter plot forms a clear U-shape. What may be concluded?

   > [!success]- Answer
   > There is almost no linear association, but there is a strong non-linear relationship. It is incorrect to say that the variables are unrelated.

---

## Chapter 06 — Basic Statistics

1. **Complete descriptive summary, 10 marks.** For `(12, 15, 15, 18, 20, 20, 20, 24, 26, 30)`, calculate mean, median, mode, range, population variance, sample variance and sample standard deviation.

   > [!success]- Answer
   > Mean = 20, median = 20, mode = 20 and range = 18. The sum of squared deviations from 20 is 270. Population variance $= 270 / 10 = 27$. Sample variance $= 270 / 9 = 30$. Sample standard deviation $= sqrt(30) approx 5.477$.

2. **Missing observation, 3 marks.** Six observations have mean 18. Five values are 12, 15, 17, 20 and 22. Find the missing value.

   > [!success]- Answer
   > Required total $= 6 times 18 = 108$. Known total $= 86$, so the missing value is 22.

3. **Weighted mean, 4 marks.** A student scores 80, 70 and 90 in courses carrying 3, 4 and 2 credits. Find the credit-weighted mean.

   > [!success]- Answer
   > $bar(x)_w = (80(3) + 70(4) + 90(2))/(3 + 4 + 2) = 700/9 approx 77.78$.

4. **Combined mean, 4 marks.** Section A has 40 students with mean 68. Section B has 60 students with mean 72. Find the combined mean.

   > [!success]- Answer
   > Combined mean $= (40(68) + 60(72))/100 = 70.4$.

5. **Grouped data, 10 marks.** Class intervals 0–10, 10–20, 20–30 and 30–40 have frequencies 3, 7, 8 and 2. Find the grouped mean, median and mode using class width 10.

   > [!success]- Answer
   > Midpoints are 5, 15, 25 and 35, so the mean is $(3(5)+7(15)+8(25)+2(35))/20 = 19.5$. With $N/2 = 10$, the grouped median lies at the 20 boundary, so the interpolation formula gives 20. The modal class is 20–30:
   >
   > $$
   > "Mode" = 20 + frac(8 - 7, 2(8) - 7 - 2)(10) approx 21.43
   > $$

6. **Coefficient of variation, 4 marks.** Series A has mean 50 and standard deviation 5. Series B has mean 80 and standard deviation 12. Which is more consistent?

   > [!success]- Answer
   > $"CV"_A = 5/50 times 100 = 10%$ and $"CV"_B = 12/80 times 100 = 15%$. Series A is more consistent because its relative dispersion is lower.

7. **Pearson skewness, 5 marks.** For `(2, 3, 3, 4, 5, 8, 12)`, use $3(bar(x)-"median")/sigma$ with population standard deviation to estimate skewness.

   > [!success]- Answer
   > $bar(x) = 37/7 approx 5.286$, median = 4 and $sigma approx 3.283$. Pearson's coefficient is approximately $3(5.286-4)/3.283 = 1.175$, indicating positive skew.

8. **Kurtosis, 6 marks.** For `(1, 2, 3, 4, 5)`, calculate $beta_2 = mu_4/mu_2^2$ and excess kurtosis $gamma_2$ using population central moments.

   > [!success]- Answer
   > The mean is 3, $mu_2 = 2$ and $mu_4 = 6.8$. Therefore $beta_2 = 6.8/4 = 1.7$ and $gamma_2 = 1.7 - 3 = -1.3$. The data are platykurtic under this moment measure.

9. **Test selection, 6 marks.** Select a test for each design: two independent skewed groups; before/after measurements on the same people; three independent approximately normal groups; association between two categorical variables.

   > [!success]- Answer
   > Mann–Whitney U; paired t-test if paired differences are approximately normal, otherwise Wilcoxon signed-rank; one-way ANOVA; chi-square test of association, provided expected-count conditions are adequate.

---

## Chapter 07 — Hypothesis Testing

Attempt each problem by writing hypotheses, assumptions, test statistic, degrees of freedom where applicable, decision rule and a conclusion in context.

1. **Chi-square association, 8 marks.** A survey records device preference:

   | Group | Laptop | Tablet |
   | --- | ---: | ---: |
   | Undergraduate | 36 | 24 |
   | Postgraduate | 14 | 26 |

   Test independence at $alpha = 0.05$ without Yates' correction.

   > [!success]- Answer
   > Expected counts are `[[30, 30], [20, 20]]`. The statistic is $chi^2 = 6.00$ with df = 1 and $p approx 0.0143$. Reject $H_0$; device preference and student group are associated in this sample.

2. **One-sample z-test, 6 marks.** A filling machine is set to 500 ml. The known population standard deviation is 40 ml. A sample of 64 bottles has mean 512 ml. Test $H_0: mu = 500$ against $H_1: mu != 500$ at 5%.

   > [!success]- Answer
   > Standard error $= 40/sqrt(64) = 5$. Hence $z = (512-500)/5 = 2.4$ and two-sided $p approx 0.0164$. Reject $H_0$; the mean fill differs significantly from 500 ml.

3. **One-proportion z-test, 7 marks.** A service claims that 60% of users complete onboarding. In a sample of 250 users, 135 complete it. Test the two-sided claim at 5%.

   > [!success]- Answer
   > $hat(p) = 135/250 = 0.54$. Under $H_0$, standard error $= sqrt(0.6(0.4)/250) approx 0.03098$. Thus $z approx -1.9365$ and $p approx 0.0528$. Fail to reject $H_0$ at 5%; the result is close to the threshold but not significant.

4. **Two-sample z-test, 7 marks.** Independent samples have $bar(x)_1 = 52$, $sigma_1 = 6$, $n_1 = 50$ and $bar(x)_2 = 49$, $sigma_2 = 5$, $n_2 = 60$. Test equality of means at 5%.

   > [!success]- Answer
   > $$
   > z = frac(52-49, sqrt(6^2/50 + 5^2/60)) approx 2.8139
   > $$
   >
   > Two-sided $p approx 0.0049$. Reject $H_0$; the population means differ.

5. **One-sample t-test, 8 marks.** Test whether the mean of `(48, 52, 51, 49, 50, 47, 53, 52)` differs from 50 at 5%.

   > [!success]- Answer
   > $bar(x)=50.25$, $s approx 2.1213$, $n=8$ and $t=(50.25-50)/(2.1213/sqrt(8)) approx 0.3333$. With df = 7, $p approx 0.7486$. Fail to reject $H_0$.

6. **Paired t-test, 8 marks.** Scores before training are `(62, 68, 70, 75, 71, 69, 73, 66)` and after training are `(66, 70, 74, 78, 72, 72, 77, 69)`. Test for a mean change at 5%.

   > [!success]- Answer
   > Differences after − before are `(4, 2, 4, 3, 1, 3, 4, 3)`. Thus $bar(d)=3$, $s_d approx 1.0690$ and $t approx 7.9373$ with df = 7. Since $p approx 0.000096$, reject $H_0$; training significantly changes the mean score.

7. **Independent pooled t-test, 9 marks.** Compare A = `(18, 20, 17, 21, 19, 22)` and B = `(15, 16, 18, 14, 17, 16)` at 5%, assuming equal variances.

   > [!success]- Answer
   > Means are 19.5 and 16.0; sample standard deviations are approximately 1.8708 and 1.4142. The pooled test gives $t approx 3.6556$, df = 10 and $p approx 0.00442$. Reject $H_0$; the group means differ.

8. **One-way ANOVA, 10 marks.** Compare A = `(8, 9, 7, 10, 9)`, B = `(12, 11, 13, 12, 14)` and C = `(15, 16, 14, 17, 16)` at 5%.

   > [!success]- Answer
   > Group means are 8.6, 12.4 and 15.6. Between-group SS = 122.8 with df = 2; within-group SS = 15.6 with df = 12. Therefore $"MSB" = 61.4$, $"MSW" = 1.3$ and $F approx 47.23$. Since $p approx 0.00000205$, reject $H_0$; at least one mean differs.

9. **Decision wording, 4 marks.** A test returns $p = 0.083$ at $alpha = 0.05$. Write the correct statistical and contextual conclusion.

   > [!success]- Answer
   > Fail to reject $H_0$. The sample does not provide sufficient evidence for the stated alternative at the 5% level. Do not write "accept $H_0$" or claim that the null has been proved.

---

## Chapter 08 — Two-Way ANOVA

1. **Two-way ANOVA, 12 marks.** Plant growth is measured under two fertilizers and two watering levels:

   | Combination | Growth |
   | --- | --- |
   | A, low water | 12, 13, 11 |
   | A, high water | 16, 15, 17 |
   | B, low water | 14, 15, 13 |
   | B, high water | 22, 21, 23 |

   Test both main effects and their interaction at 5%.

   > [!success]- Answer
   > The ANOVA components are: fertilizer SS = 48, water SS = 108, interaction SS = 12 and error SS = 8. Each effect has df = 1 and error has df = 8, so error MS = 1. The F values are 48, 108 and 12, with p-values approximately 0.000121, 0.00000636 and 0.00852. Both main effects and the interaction are significant.

2. **Two-way ANOVA, 10 marks.** Compare Method A/low anxiety = (85, 87, 90), Method A/high = (78, 75, 80), Method B/low = (90, 92, 88) and Method B/high = (80, 82, 85). Test the two main effects and interaction at the 5% level.

   > [!success]- Answer
   > Method SS = 40.333, Anxiety SS = 225.333, Interaction SS = 3.000, Error SS = 46.000. F values are 7.014, 39.188 and 0.522 with df = 1 for effects and df = 8 for error. Method ($p = 0.0293$) and anxiety ($p = 0.00024$) are significant; interaction ($p = 0.4907$) is not.

3. **Two-way ANOVA, 10 marks.** Fertilizer A/once daily = (10, 12, 14), A/twice = (15, 16, 18), B/once = (11, 13, 12) and B/twice = (14, 17, 19). Test fertilizer, watering and their interaction at the 5% level.

   > [!success]- Answer
   > Fertilizer SS = 0.083, Watering SS = 60.750, Interaction SS = 0.083, Error SS = 27.333. Only watering is significant ($p = 0.00293$). Fertilizer and interaction are not significant.
