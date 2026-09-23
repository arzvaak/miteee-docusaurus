---
title: "Teacher Mock Questions"
math_syntax: typst
---

# Teacher Mock Questions

> [!important] Teacher-released mock — not a verified past paper
> These questions are transcribed from the teacher-released 2025 mock papers for Introduction to Data Science. They are treated as **mock exam material**, not as verified past exam papers (PYQs). Worked solutions follow standard course conventions.

[← Course home](/notes/studies-introduction-to-data-science-00---course-home)

---

## Conventions

> [!note] Q8 — Quartile computation method
> For odd-sized datasets the median is excluded from both halves when computing Q1 and Q3. Q1 is the median of the lower half (values below the overall median); Q3 is the median of the upper half (values above the overall median).

> [!note] Q10 — Ambiguity in "symmetrical"
> The wording "both contain equal numbers of even and odd numbers" is ambiguous. **Interpretation A:** each list individually has the same count of even numbers as odd numbers (e.g. 3 even and 3 odd). **Interpretation B:** both lists mirror each other's even/odd composition (list 1 has the same even count as list 2, and likewise for odd counts). The solution below uses **Interpretation A** (the more natural reading) and also shows Interpretation B for completeness.

> [!note] Q11 — Skewness and kurtosis formulas
> The question does not specify which convention to use. The solution uses the **sample (Fisher) moment formulas**, consistent with `scipy.stats.skew` and `scipy.stats.kurtosis`. Pearson's second skewness coefficient is also shown as an alternative. For kurtosis, the population central-moment formula ($beta_2 = mu_4 / mu_2^2$) gives a very different result for small $n$; see the note after the solution.

> [!note] Q13 — Given critical value
> The exam supplies the critical value $z_"crit" = -1.643$ for a one-tailed $z$-test at $alpha = 0.05$. Use this value directly rather than looking it up from a table.

---

## Midterm — 30 marks, 90 minutes

### Part A (1 mark each)

**Q1.** What is the correct syntax to print the numbers `[3, 4, 5]` from `arr = np.array([1,2,3,4,5,6,7])`? **(1)**

1. `print(arr[2:5])`  2. `print(arr[2:6])`  3. `print(arr[2:4])`  4. `print(arr[3:6])`

**Q2.** What would be the answer of `np.cumsum(np.array([1,2,3]))`? **(1)**

1. `[1 3 6]`  2. `[3 6 9]`  3. `[9]`  4. `[6]`

**Q3.** How can you merge two DataFrames in Pandas? **(1)**

1. `df.concat()`  2. `df.merge()`  3. `df.join()`  4. `df.combine()`

**Q4.** What is the first step when conducting a hypothesis test? **(1)**

1. Reject or fail to reject the null hypothesis.  2. Choose a significance level.  3. State the null and alternative hypotheses.  4. Find the p-value.

**Q5.** What is the output of the following code? **(1)**

```python
class A:
    def one(self):
        return self.two()
    def two(self):
        return 'A'
class B(A):
    def two(self):
        return 'B'
obj1 = A()
obj2 = B()
print(obj1.two(), obj2.two())
```

### Part B

**Q6.** Calculate the mean, median and mode for the following grouped data. **(4)**

| Class interval | Frequency |
| :--- | ---: |
| 0 – 10 | 8 |
| 10 – 20 | 16 |
| 20 – 30 | 36 |
| 30 – 40 | 34 |
| 40 – 50 | 6 |

**Q7.** List the differences between Data Science and Data Analytics. **(3)**

**Q8.** A teacher wants to compare the marks obtained by students in Mathematics, Science, and English to understand the spread and distribution of scores. Draw a box plot for the data below. **(3)**

- **Mathematics:** 12, 18, 25, 30, 35, 40, 42, 45, 48
- **Science:** 10, 15, 20, 22, 28, 32, 34, 37, 41
- **English:** 5, 10, 18, 22, 27, 29, 33, 36, 40

**Q9.** Given the list `[10, 20, 30, 40, 50, 60]`, write Python/NumPy code to: **(3)**

- (a) Reshape it into a 3 × 2 array.
- (b) Print all elements from index 2 onward.
- (c) Print every second element.
- (d) Print the list in reverse order.

**Q10.** Write a Python program that takes two lists of integers from keyboard input and prints `Lists are symmetrical` if both lists contain equal numbers of even and odd numbers. **(3)**

**Q11.** Calculate the skewness and kurtosis of the data set: 26, 12, 16, 56, 112, 24. Comment on the shape of the distribution. **(3)**

**Q12.** Calculate Pearson's correlation coefficient for the following data. **(2)**

| X | 10 | 12 | 14 | 16 | 18 | 20 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Y | 5 | 9 | 11 | 14 | 16 | 17 |

**Q13.** A manufacturer claims that the average lifespan of their light bulbs is 1000 hours. A quality control inspector tests a sample of 30 bulbs and finds that the sample has an average lifespan of 950 hours with a standard deviation of 120 hours. Using a one-sample Z-test at the 5% significance level (one-tailed, critical value = -1.643), test whether the manufacturer's claim can be rejected. **(2)**

**Q14.** Given the list `[5, 10, 15, 20, 25, 30]`: **(2)**

- (a) Square each element and print the result.
- (b) Print only the even elements.

---

## Midterm Worked Solutions

### Q1 (1 mark)

**Array:** `a = np.array([1, 2, 3, 4, 5, 6, 7])`

Index positions:

| Value | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 |

We need values 3, 4, 5 which sit at indices 2, 3, 4.

**Answer:**

```python
a[2:5]
```

The slice `2:5` starts at index 2 (inclusive) and stops at index 5 (exclusive), yielding `[3, 4, 5]`.

---

### Q2 (1 mark)

`np.cumsum` computes the cumulative sum.

$$
"cumsum" = (1, " " 1+2, " " 1+2+3) = (1, " " 3, " " 6)
$$

**Answer:** `[1, 3, 6]`

---

### Q3 (1 mark)

**Answer:** Option 2, `df.merge()`. A DataFrame can also use `join()` for suitable keys or indexes, but the intended method among these options is `merge()`.

---

### Q4 (1 mark)

**Answer:** State the null hypothesis $H_0$ and the alternative hypothesis $H_1$. This defines what is being tested before any data analysis begins.

---

### Q5 (1 mark)

Trace through the code:

- `obj1` is an instance of `A`. Calling `obj1.two()` invokes `A.two()`, which returns `'A'`.
- `obj2` is an instance of `B` (which inherits from `A`). Calling `obj2.two()` invokes `B.two()` due to **method overriding**, which returns `'B'`.

**Answer:** `A B`

> [!tip] Key concept
> Python uses method overriding: `obj2.two()` calls `B.two()` because `obj2` is an instance of `B`. The unused `one()` method would also dispatch `self.two()` according to the object's class.

---

### Q6 (4 marks)

**Data:**

| Class | Midpoint $(x_i)$ | Frequency $(f_i)$ | $f_i x_i$ | Cumulative $f$ |
| :--- | ---: | ---: | ---: | ---: |
| 0 – 10 | 5 | 8 | 40 | 8 |
| 10 – 20 | 15 | 16 | 240 | 24 |
| 20 – 30 | 25 | 36 | 900 | 60 |
| 30 – 40 | 35 | 34 | 1190 | 94 |
| 40 – 50 | 45 | 6 | 270 | 100 |

$$
sum f_i = 100, quad sum f_i x_i = 2640
$$

#### Mean

$$
bar(x) = frac(sum f_i x_i, sum f_i) = frac(2640, 100) = 26.4
$$

#### Median

$$
n = 100, quad n/2 = 50
$$

The median class is 20 – 30 (first class where the cumulative frequency reaches or exceeds 50). Apply the grouped median formula:

$$
M_d = l + frac(frac(n, 2) - C, f_m) h
$$

where $l = 20$, $C = 24$ (cumulative frequency before the median class), $f_m = 36$, $h = 10$.

$$
M_d = 20 + frac(50 - 24, 36) times 10 = 20 + frac(26, 36) times 10 = 20 + 7.22 = 27.22
$$

#### Mode

The modal class is 20 – 30 (highest frequency $f_1 = 36$). Apply the grouped mode formula:

$$
M_o = l + frac(f_1 - f_0, 2 f_1 - f_0 - f_2) h
$$

where $l = 20$, $f_0 = 16$ (preceding frequency), $f_2 = 34$ (succeeding frequency), $h = 10$.

$$
M_o = 20 + frac(36 - 16, 2(36) - 16 - 34) times 10 = 20 + frac(20, 22) times 10 = 20 + 9.09 = 29.09
$$

**Answers:** Mean $= 26.4$, Median $= 27.22$, Mode $= 29.09$

---

### Q7 (3 marks)

| Aspect | Data science | Data analytics |
| :--- | :--- | :--- |
| **Scope** | Covers the full data lifecycle — collection, cleaning, modelling, deployment, and monitoring of predictive systems | Focuses on examining existing datasets to discover patterns, trends, and actionable insights |
| **Techniques** | Machine learning, deep learning, predictive modelling, natural language processing | Statistical analysis, data visualisation, SQL querying, descriptive analytics |
| **Primary goal** | Predict future outcomes and build automated decision systems | Interpret historical and current data to support business decisions |

Additional valid differences include the tools used (Python/R/TensorFlow vs. SQL/Excel/Tableau) and the skill sets required (programming and ML engineering vs. domain expertise and visualisation).

---

### Q8 (3 marks)

All three datasets have $n = 9$ (odd). Using the convention that the median is excluded from both halves:

#### Five-number summaries

**Mathematics** (sorted: 12, 18, 25, 30, **35**, 40, 42, 45, 48)

| Statistic | Value |
| :--- | ---: |
| Minimum | 12 |
| Q1 (median of 12, 18, 25, 30) | $(18 + 25)/2 = 21.5$ |
| Q2 (median) | 35 |
| Q3 (median of 40, 42, 45, 48) | $(42 + 45)/2 = 43.5$ |
| Maximum | 48 |
| IQR | $43.5 - 21.5 = 22.0$ |

**Science** (sorted: 10, 15, 20, 22, **28**, 32, 34, 37, 41)

| Statistic | Value |
| :--- | ---: |
| Minimum | 10 |
| Q1 (median of 10, 15, 20, 22) | $(15 + 20)/2 = 17.5$ |
| Q2 (median) | 28 |
| Q3 (median of 32, 34, 37, 41) | $(34 + 37)/2 = 35.5$ |
| Maximum | 41 |
| IQR | $35.5 - 17.5 = 18.0$ |

**English** (sorted: 5, 10, 18, 22, **27**, 29, 33, 36, 40)

| Statistic | Value |
| :--- | ---: |
| Minimum | 5 |
| Q1 (median of 5, 10, 18, 22) | $(10 + 18)/2 = 14.0$ |
| Q2 (median) | 27 |
| Q3 (median of 29, 33, 36, 40) | $(33 + 36)/2 = 34.5$ |
| Maximum | 40 |
| IQR | $34.5 - 14.0 = 20.5$ |

#### Box-plot comparison

Each box plot has the box spanning Q1 to Q3 with a line at the median. The whiskers extend to the minimum and maximum (no outliers in any subject, since all values fall within $["Q1" - 1.5 times "IQR", " " "Q3" + 1.5 times "IQR"]$).

- **Mathematics** has the highest median (35) and the widest IQR (22), indicating generally higher scores but greater variability in the middle 50%.
- **English** has the lowest median (27) and the lowest minimum (5), showing the widest overall range.
- **Science** has the smallest IQR (18), suggesting the most consistent middle-50% performance.

---

### Q9 (3 marks)

Given: `lst = [10, 20, 30, 40, 50, 60]`

```python
import numpy as np

a = np.array([10, 20, 30, 40, 50, 60])

# (a) Reshape to 3x2
reshaped = a.reshape(3, 2)
print(reshaped)
# Output:
# [[10 20]
#  [30 40]
#  [50 60]]

# (b) Elements from index 2 onward
print(a[2:])
# Output: [30 40 50 60]

# (c) Every second element
print(a[::2])
# Output: [10 30 50]

# (d) Reverse
print(a[::-1])
# Output: [60 50 40 30 20 10]
```

**Explanation:**

- `reshape(3, 2)` rearranges the 6 elements into 3 rows and 2 columns. Total elements (6) must remain unchanged.
- `a[2:]` slices from index 2 to the end, giving elements at positions 2, 3, 4, 5.
- `a[::2]` takes every second element starting from index 0 (indices 0, 2, 4).
- `a[::-1]` reverses the array by using a step of −1.

---

### Q10 (3 marks)

```python
list1 = list(map(int, input("Enter first list: ").split()))
list2 = list(map(int, input("Enter second list: ").split()))

even1 = sum(1 for x in list1 if x % 2 == 0)
odd1 = len(list1) - even1
even2 = sum(1 for x in list2 if x % 2 == 0)
odd2 = len(list2) - even2

if even1 == odd1 and even2 == odd2:
    print("Lists are symmetrical")
else:
    print("Lists are not symmetrical")
```

**Explanation (Interpretation A — default):**

The program counts even and odd numbers in each list independently. "Lists are symmetrical" is printed when **each** list has the same number of even values as odd values. For example, `[2, 4, 6, 1, 3, 5]` (3 even, 3 odd) satisfies the condition.

**Interpretation B (alternative):**

If the question instead means both lists mirror each other (same even count and same odd count across the two lists), replace the condition with:

```python
if even1 == even2 and odd1 == odd2:
    print("Lists are symmetrical")
else:
    print("Lists are not symmetrical")
```

---

### Q11 (3 marks)

**Data:** 26, 12, 16, 56, 112, 24 ($n = 6$)

Sorted: 12, 16, 24, 26, 56, 112

#### Step 1 — Mean and standard deviation

$$
bar(x) = frac(12 + 16 + 24 + 26 + 56 + 112, 6) = frac(246, 6) = 41
$$

| $x_i$ | $x_i - bar(x)$ | $(x_i - bar(x))^2$ | $(x_i - bar(x))^3$ | $(x_i - bar(x))^4$ |
| ---: | ---: | ---: | ---: | ---: |
| 12 | −29 | 841 | −24 389 | 707 281 |
| 16 | −25 | 625 | −15 625 | 390 625 |
| 24 | −17 | 289 | −4 913 | 83 521 |
| 26 | −15 | 225 | −3 375 | 50 625 |
| 56 | 15 | 225 | 3 375 | 50 625 |
| 112 | 71 | 5 041 | 357 911 | 25 411 681 |
| **Sum** | | **7 246** | **312 984** | **26 694 358** |

Sample variance (Bessel's correction):

$$
s^2 = frac(7246, 5) = 1449.2
$$

$$
s = sqrt(1449.2) approx 38.068
$$

#### Step 2 — Skewness (sample / Fisher)

$$
g_1 = frac(n, (n - 1)(n - 2)) sum_(i=1)^n frac((x_i - bar(x))^3, s^3)
$$

$$
= frac(6, 5 times 4) times frac(312984, 38.068^3) approx 1.702
$$

**Interpretation:** $g_1 approx 1.70 > 1$, so the distribution is **highly positively skewed** (right-skewed). The long right tail is driven by the value 112.

#### Step 3 — Kurtosis (sample excess / Fisher)

$$
g_2 = frac(n(n + 1), (n - 1)(n - 2)(n - 3)) sum_(i=1)^n frac((x_i - bar(x))^4, s^4) - frac(3(n - 1)^2, (n - 2)(n - 3))
$$

$$
= frac(42, 60) times frac(26694358, 2100180.64) - frac(75, 12)
$$

$$
= 0.7 times 12.7105 - 6.25 approx 2.647
$$

**Interpretation:** $g_2 approx 2.65 > 0$, so the distribution has positive excess kurtosis under this sample convention.

> [!note] Alternative skewness (Pearson's second coefficient)
> Since all six values are distinct there is no mode, so Pearson's first coefficient cannot be used. Pearson's second coefficient uses the median instead:
>
> $$S_k = frac(3(bar(x) - M_d), s) = frac(3(41 - 25), 38.068) = frac(48, 38.068) approx 1.26$$
>
> This also indicates positive skewness but is numerically smaller than the Fisher formula because it is a simpler approximation.

> [!warning] Population vs sample kurtosis
> The population central-moment formula $beta_2 = mu_4 / mu_2^2$ (where $mu_k = frac(1,n) sum (x_i - bar(x))^k$) gives $beta_2 approx 3.05$ and excess $gamma_2 approx 0.05$ for this data. The large discrepancy with the sample formula ($g_2 approx 2.65$) arises from correction factors that matter at small $n$. State the convention in an exam answer.

---

### Q12 (2 marks)

| $i$ | $X_i$ | $Y_i$ | $X_i Y_i$ | $X_i^2$ | $Y_i^2$ |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10 | 5 | 50 | 100 | 25 |
| 2 | 12 | 9 | 108 | 144 | 81 |
| 3 | 14 | 11 | 154 | 196 | 121 |
| 4 | 16 | 14 | 224 | 256 | 196 |
| 5 | 18 | 16 | 288 | 324 | 256 |
| 6 | 20 | 17 | 340 | 400 | 289 |
| **Sum** | **90** | **72** | **1164** | **1420** | **968** |

$$
bar(X) = frac(90, 6) = 15, quad bar(Y) = frac(72, 6) = 12
$$

Pearson's correlation coefficient (computational formula):

$$
r = frac(n sum X_i Y_i - (sum X_i)(sum Y_i), sqrt((n sum X_i^2 - (sum X_i)^2)(n sum Y_i^2 - (sum Y_i)^2)))
$$

Substitute:

$$
r = frac(6(1164) - (90)(72), sqrt((6(1420) - 90^2)(6(968) - 72^2)))
$$

$$
= frac(6984 - 6480, sqrt((8520 - 8100)(5808 - 5184)))
$$

$$
= frac(504, sqrt(420 times 624)) = frac(504, sqrt(262080)) = frac(504, 511.94) approx 0.9845
$$

**Answer:** $r approx 0.985$ — a very strong positive linear correlation between X and Y.

---

### Q13 (2 marks)

**Given:** Claimed mean $mu_0 = 1000$, $n = 30$, $bar(x) = 950$, $s = 120$, $alpha = 0.05$, one-tailed (left), critical value $z_"crit" = -1.643$.

#### Step 1 — Hypotheses

$$
H_0: mu = 1000 quad "vs" quad H_1: mu < 1000
$$

#### Step 2 — Test statistic

$$
z = frac(bar(x) - mu_0, s / sqrt(n)) = frac(950 - 1000, 120 / sqrt(30)) = frac(-50, 120 / 5.477) = frac(-50, 21.909) approx -2.282
$$

#### Step 3 — Decision

$$
z = -2.282 < -1.643 = z_"crit"
$$

Since the test statistic falls in the rejection region (left tail), **reject $H_0$**.

**Conclusion:** At the 5% significance level there is sufficient evidence to conclude that the mean life of the light bulbs is **less than 1000 hours**.

---

### Q14 (2 marks)

Given: `lst = [5, 10, 15, 20, 25, 30]`

```python
lst = [5, 10, 15, 20, 25, 30]

# (a) Square each element
squared = [x ** 2 for x in lst]
print(squared)
# Output: [25, 100, 225, 400, 625, 900]

# (b) Print even elements
even = [x for x in lst if x % 2 == 0]
print(even)
# Output: [10, 20, 30]
```

**Explanation:**

- List comprehension `[x ** 2 for x in lst]` applies the squaring operation to every element.
- `[x for x in lst if x % 2 == 0]` filters keeping only elements divisible by 2 (the even numbers).

---

## Endsem — 50 marks, 180 minutes

Five groups Q1–Q5; every group has A (2), B (3), C (5).

### Q1

**Q1A.** Explain the steps involved in data analysis. **(2)**

**Q1B.** Write a Python program that takes inputs `a`, `b`, and `c` and displays `a+b+c`, `a-b-c`, and `a*b*c`. **(3)**

**Q1C.** For the scores `50, 98, 63, 85, 72, 69, 81, 79, 59, 95`, find the mean, median, mode, standard deviation, skewness, and kurtosis. Comment on the shape of the distribution. All scores are distinct. **(5)**

### Q2

**Q2A.** Explain the difference between a string and a tuple with an example. Explain what a docstring is and its purpose. **(2)**

**Q2B.** Write a Python function `convert_temp(c)` that converts a Celsius temperature to Fahrenheit using $F = frac(9C, 5) + 32$. The program should take user input and print the result. **(3)**

**Q2C.** Conduct a two-way ANOVA for plant growth with two factors: fertilizer (Low, High) and watering frequency (Once a day, Thrice a week), with 3 observations per cell. Data: Low/Once `4.1, 4.3, 3.9`; Low/Thrice `3.4, 3.2, 3.5`; High/Once `6.2, 6.5, 6.0`; High/Thrice `5.0, 5.2, 5.3`. Test both main effects and the interaction effect; interpret the results. Supplied: degrees of freedom fertilizer = 1, watering = 1, interaction = 1, error = 8; critical $F = 5.32$ for each test. **(5)**

### Q3

**Q3A.** Perform a chi-square test of independence on the following contingency table. Supplied: critical chi-square value = 3.841 at 5% significance level with $"df" = 1$. **(2)**

| | Vanilla | Chocolate |
| :--- | ---: | ---: |
| Male | 10 | 20 |
| Female | 20 | 10 |

**Q3B.** Given the following NumPy arrays, give the outputs or describe the effects of each operation.

```python
a = np.array([[51, 52, 53, 54, 55, 56, 57],
              [58, 59, 60, 61, 62, 63, 64]])
b = np.array([[[10, 20], [30, 40]],
              [[ 5, 15], [25, 35]]])
```

1. `a[1, 6]`
2. `a[0, :]`
3. `a[:, 2]`
4. `a[0, 1:-1:2]`
5. `a[:, 4] = 55`
6. `b[:, 1, :] = [[10, 11], [12, 13]]`

**(3)**

**Q3C.** Develop a multiple linear regression model $hat(Y) = b_0 + b_1 X_1 + b_2 X_2$ and use it to predict the price. Data (area in sq ft, bedrooms, price): `(800, 2, 50)`, `(1000, 2, 65)`, `(1200, 3, 78)`, `(1500, 3, 90)`, `(1800, 4, 110)`. The original wording does not give a target house's area/bedrooms, so no specific target prediction should be invented. **(5)**

### Q4

**Q4A.** Explain Random Forest and how it differs from a single Decision Tree. What is ensemble learning? **(2)**

**Q4B.** Describe the preprocessing steps in a data science pipeline. Why is normalization important? **(3)**

**Q4C.** Using logistic regression with $P("pass") = frac(1, 1 + exp(-(b_0 + b_1 X_1 + b_2 X_2)))$, where $b_0 = -10$, $b_1 = 1$ (study hours), and $b_2 = 0.1$ (attendance percentage). A threshold of $P \geq 0.5$ predicts pass. Data (hours, attendance, actual outcome): `(2, 60, 0)`, `(3, 65, 0)`, `(5, 80, 1)`, `(6, 75, 1)`, `(7, 85, 1)`, `(4, 70, 0)`. Calculate each prediction, construct the confusion matrix, and compute accuracy. **(5)**

### Q5

**Q5A.** Explain supervised learning versus unsupervised learning. **(2)**

**Q5B.** Calculate the Spearman rank correlation for the following students. **(3)**

| Student | Mathematics | Science |
| :--- | ---: | ---: |
| A | 78 | 85 |
| B | 58 | 60 |
| C | 90 | 92 |
| D | 68 | 70 |
| E | 85 | 80 |
| F | 72 | 75 |
| G | 60 | 65 |
| H | 95 | 98 |

**Q5C.** Construct a decision tree for the "Play" target variable using Gini impurity for root selection. Show all Gini calculations at each split and draw the resulting tree. **(5)**

| Weather | Temperature | Humidity | Play |
| :--- | :--- | :--- | :--- |
| Sunny | Hot | High | No |
| Sunny | Mild | Normal | Yes |
| Cloudy | Cool | Normal | Yes |
| Rainy | Mild | High | No |
| Rainy | Cool | Normal | Yes |

---

> [!note] Endsem solutions
> Worked answers for this section are being prepared. The midterm answers above are complete.
