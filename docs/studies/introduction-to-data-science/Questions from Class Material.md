---
title: "Questions from Class Material"
math_syntax: typst
---

# Questions from Class Material

These questions are drawn directly from the course exercises and worked examples. Each question is followed by its complete worked answer. For the full explanations behind each solution, see the relevant chapter.

---

## Chapter 01 — Foundations of Data Science

1. Create NumPy arrays of rank 1, rank 2 and rank 3, then add 1 to every element of an array.

   > [!success]- Worked answer
   > ```python
   > import numpy as np
   >
   > a = np.array([1, 2, 3])                       # rank 1
   > b = np.array([[1, 2], [3, 4]])                # rank 2
   > c = np.array([[[1], [2]], [[3], [4]]])        # rank 3
   >
   > print(a)
   > print(b)
   > print(c)
   > print("a + 1 =", a + 1)
   > ```
   > The ranks are `a.ndim == 1`, `b.ndim == 2` and `c.ndim == 3`. The expression `a + 1` uses broadcasting, so 1 is added elementwise.

2. Subtract 2 from every element of an array.

   > [!success]- Worked answer
   > ```python
   > import numpy as np
   >
   > b = np.array([[4, 5], [6, 7]])
   > print(b - 2)
   > ```

3. Find the sum of every element in a matrix.

   > [!success]- Worked answer
   > Use `a.sum()` (or `np.sum(a)`).

4. Select the element in the second row and third column of a matrix.

   > [!success]- Worked answer
   > Python indexes from zero, so the second row and third column are `a[1, 2]`.
   > ```python
   > a = np.array([[10, 11, 12], [20, 21, 22]])
   > print(a[1, 2])      # 22
   > ```

5. Read two numbers, then display their sum and difference.

   > [!success]- Worked answer
   > ```python
   > a = float(input("Enter a: "))
   > b = float(input("Enter b: "))
   > print("sum =", a + b)
   > print("difference =", a - b)
   > ```

6. Determine whether an entered integer is even or odd.

   > [!success]- Worked answer
   > ```python
   > a = int(input("Enter an integer: "))
   > if a % 2 == 0:
   >     print("Even")
   > else:
   >     print("Odd")
   > ```

7. Generate the first $n$ terms of the Fibonacci sequence.

   > [!success]- Worked answer
   > ```python
   > n = int(input("How many terms? "))
   > a, b = 0, 1
   > for _ in range(n):
   >     print(a, end=" ")
   >     a, b = b, a + b
   > print()
   > ```

8. Count the vowels in a string.

   > [!success]- Worked answer
   > ```python
   > text = input("Enter a string: ")
   > vowels = sum(character.lower() in "aeiou" for character in text)
   > print("vowels =", vowels)
   > ```

9. Count uppercase and lowercase letters separately.

   > [!success]- Worked answer
   > ```python
   > text = input("Enter a string: ")
   > capital = sum(character.isupper() for character in text)
   > small = sum(character.islower() for character in text)
   > print("capital letters =", capital)
   > print("small letters =", small)
   > ```

10. Build a number-guessing program for a randomly generated number.

    > [!success]- Worked answer
    > ```python
    > import random
    >
    > secret = random.randint(1, 10)
    > while True:
    >     guess = int(input("Guess a number from 1 to 10: "))
    >     if guess == secret:
    >         print("Correct!")
    >         break
    >     if guess < secret:
    >         print("Too low")
    >     else:
    >         print("Too high")
    > ```

---

## Chapter 02 — Python Fundamentals

1. Why does indentation matter in Python?

   > [!success]- Worked answer
   > Indentation defines block structure. A missing or inconsistent indent after `if`, `for`, `while`, `def` or `class` raises a `SyntaxError`.

2. What is the difference between `=` and `==`?

   > [!success]- Worked answer
   > `=` is the assignment operator; `==` tests equality.

3. Which listed collection is mutable and ordered?

   > [!success]- Worked answer
   > A `list`.

4. Which listed collection removes duplicates?

   > [!success]- Worked answer
   > A `set`.

5. What does `range(5)` produce when iterated?

   > [!success]- Worked answer
   > The integers 0, 1, 2, 3, 4.

6. Why must the counter in a while loop change?

   > [!success]- Worked answer
   > If the counter never changes, the condition remains true and the loop never terminates.

7. What kind of object does `*kids` receive inside a function?

   > [!success]- Worked answer
   > A tuple.

---

## Chapter 03 — NumPy and Image Processing

1. Starting from `np.array([1, 2, ..., 12])`, create at least three valid reshapes. For each one, predict and then verify its `shape`. Why must the product of the target dimensions remain 12?

   > [!success]- Worked answer
   > ```python
   > import numpy as np
   > a = np.arange(1, 13)
   > print(a.reshape(3, 4).shape)    # (3, 4)
   > print(a.reshape(4, 3).shape)    # (4, 3)
   > print(a.reshape(2, 6).shape)    # (2, 6)
   > print(a.reshape(2, 2, 3).shape) # (2, 2, 3)
   > ```
   > Reshape cannot change the total number of elements. A 12-element array cannot be reshaped to a shape whose product is not 12.

2. Initialise useful arrays with `zeros`, `ones`, `full`, `eye` and random integers. State the shape and dtype of each result.

   > [!success]- Worked answer
   > ```python
   > print(np.zeros((2, 3)))         # shape (2, 3), dtype float64
   > print(np.ones((3,)))            # shape (3,), dtype float64
   > print(np.full((2, 2), 7))       # shape (2, 2), filled with 7
   > print(np.eye(3))                # 3×3 identity matrix
   > print(np.random.randint(0, 10, (2, 4)))  # shape (2, 4), int values 0–9
   > ```

3. Given two compatible matrices, compute their matrix product and determinant. Explain why `a * b` and `a @ b` mean different things.

   > [!success]- Worked answer
   > `a * b` is elementwise multiplication; `a @ b` is the matrix product. The matrix product requires the number of columns in `a` to equal the number of rows in `b`.

4. Load an RGB image as a NumPy array. Report its height, width, channel count and dtype.

   > [!success]- Worked answer
   > ```python
   > from skimage import io
   > pic = io.imread("testcricket3.jpg")
   > print(pic.shape)       # (height, width, channels)
   > print(type(pic))       # <class 'numpy.ndarray'>
   > ```
   > The shape is `(433, 770, 3)` for a typical RGB image: height × width × colour channels.

5. Use slicing to mirror an image horizontally, reverse it on both spatial axes, crop a rectangular region and downsample it by taking every second row and column.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > plt.imshow(pic[:, ::-1])     # mirror horizontally
   > plt.imshow(pic[::-1])        # reverse both axes
   > plt.imshow(pic[50:400, 50:500])  # crop
   > plt.imshow(pic[::2, ::2])    # downsample
   > plt.show()
   > ```

6. Apply a threshold with `np.where`. Explain why applying the condition independently to RGB channels is not the same as colour-aware segmentation.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > pic_masked = np.where(pic > 100, 255, 0)
   > plt.imshow(pic_masked)
   > plt.show()
   > ```
   > The condition is applied to every RGB channel independently, so a pixel may be partially bright and partially dark. True colour-aware segmentation would operate on hue, saturation or colour-space representations rather than raw channel values.

---

## Chapter 04 — Pandas and Matplotlib

1. Build a labelled line plot with a title, legend, grid, controlled axis limits and custom ticks. Save it before displaying it.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   > import numpy as np
   >
   > x = [1, 3, 5, 7, 9, 11]
   > y = [2, 4, 6, 8, 10, 12]
   >
   > plt.figure(figsize=(6, 4), dpi=100)
   > plt.plot(x, y, label="Output 1", color="green",
   >          linestyle="--", linewidth=3.5, marker="h",
   >          markersize=12, markeredgecolor="black")
   > plt.title("Basic Line Graph")
   > plt.xlabel("Input")
   > plt.ylabel("Output")
   > plt.legend()
   > plt.grid(True, alpha=0.3)
   > plt.savefig("BasicLineGraphTut1.png", dpi=300)
   > plt.show()
   > ```

2. Construct a bar chart from paired category and value lists. Add labels and choose a colour that keeps every bar readable.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > grades = ["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF"]
   > student_count = [4, 12, 24, 28, 18, 10, 4, 2]
   >
   > bars = plt.bar(grades, student_count)
   > patterns = ["*", "/", "o", "0", "\\", "-", "*", "."]
   > for bar, pattern in zip(bars, patterns):
   >     bar.set_hatch(pattern)
   >
   > plt.xlabel("Grade")
   > plt.ylabel("Student count")
   > plt.title("Students by grade")
   > plt.show()
   > ```

3. Create a scatter plot and control marker size, colour, shape, edge, line width and transparency.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > x = [1, 2, 3, 4, 4, 3, 5, 6, 8, 6, 9, 8, 7, 8, 9, 7, 6, 6, 8]
   > y = [2, 2, 1, 3, 4, 4, 7, 9, 5, 6, 3, 7, 8, 7, 8, 9, 9, 8, 7]
   >
   > plt.scatter(x, y, s=150, c="red", marker="o",
   >             edgecolors="black", linewidths=2, alpha=0.7)
   > plt.xlabel("x")
   > plt.ylabel("y")
   > plt.tight_layout()
   > plt.show()
   > ```

4. Map a third variable to colour and a fourth variable to marker size. Add and label a colour bar, and verify that all input arrays have equal length.

   > [!success]- Worked answer
   > ```python
   > import matplotlib.pyplot as plt
   >
   > x = [1, 2, 3, 4, 4, 3, 5, 6, 8, 6, 9, 8, 7, 8, 9, 7, 6, 6, 8, 5]
   > y = [2, 2, 1, 3, 4, 4, 7, 9, 5, 6, 3, 7, 8, 7, 8, 9, 9, 8, 7, 5]
   > color_ratings = [8, 1, 6, 9, 2, 5, 9, 3, 8, 9, 1, 4, 6, 9, 2, 7, 8, 4, 9, 1]
   > size_ratings = [200, 300, 600, 250, 550, 575, 275, 230, 290, 430,
   >                 470, 520, 560, 370, 330, 480, 390, 290, 400, 450]
   >
   > points = plt.scatter(x, y, s=size_ratings, c=color_ratings, cmap="Reds",
   >                      marker="o", edgecolors="black", linewidths=2, alpha=0.7)
   > colour_bar = plt.colorbar()
   > colour_bar.set_label("Rating level")
   > plt.xlabel("x")
   > plt.ylabel("y")
   > plt.tight_layout()
   > plt.show()
   > ```
   > Verify that `len(x) == len(y) == len(color_ratings) == len(size_ratings)`. A mismatched length raises an error.

---

## Chapter 05 — Correlation

1. Classify a relationship by direction, form, number of variables and strength.

   > [!success]- Worked answer
   > Direction: positive (both increase) or negative (one increases as the other decreases). Form: linear (straight line) or non-linear (curved). Number of variables: simple (2), partial (2 controlling others) or multiple (1 vs 2+). Strength: described by the magnitude of the coefficient (very weak to very strong).

2. Draw scatter diagrams representing strong positive, weak positive, zero, weak negative and strong negative correlation.

   > [!success]- Worked answer
   > - Strong positive: points cluster tightly around an upward-sloping line.
   > - Weak positive: points show a general upward trend but are widely scattered.
   > - Zero: points form a cloud with no visible trend.
   > - Weak negative: points show a general downward trend but are widely scattered.
   > - Strong negative: points cluster tightly around a downward-sloping line.

3. Given paired measurements, compute and interpret Pearson's $r$. State why the result does not establish causation.

   > [!success]- Worked answer
   > ```python
   > import numpy as np
   >
   > x = np.array([10, 15, 20, 22, 25], dtype=float)
   > y = np.array([5, 9, 13, 15, 17], dtype=float)
   >
   > r = np.corrcoef(x, y)[0, 1]
   > print(r)
   > ```
   > Pearson's $r$ measures the strength and direction of linear association. A value near +1 indicates strong positive linear association. The coefficient measures association in the selected data; it does not establish that one variable causes the other.

4. Rank two sets of observations and compute Spearman's $r_s$. State how ties change the method.

   > [!success]- Worked answer
   > ```python
   > from scipy.stats import spearmanr
   >
   > ability_rank = [1, 2, 3, 4, 5]
   > score_rank = [2, 1, 4, 3, 5]
   > result = spearmanr(ability_rank, score_rank)
   > print(result.statistic)
   > ```
   > When ranks are tied, use average ranks for the tied values. The standard formula $r_s = 1 - 6 sum d_i^2 / (n(n^2 - 1))$ assumes no ties; with ties, a tie-corrected implementation should be used.

5. Give one example of a strong non-linear relationship for which Pearson's coefficient can be near zero.

   > [!success]- Worked answer
   > A symmetric U-shape (e.g. $y = (x - 5)^2$ for $x$ evenly spaced around 5) has strong non-linear association but Pearson's $r$ near zero because the positive and negative linear contributions cancel.

---

## Chapter 06 — Basic Statistics

1. Distinguish population, sample, parameter and statistic using one study of your choice.

   > [!success]- Worked answer
   > In a study of exam scores for all 500 students in a year group, the population is all 500 students, a sample is any subset selected from them, a parameter is a population measure (e.g. the population mean score), and a statistic is a sample measure (e.g. the sample mean of the selected students).

2. For a numerical dataset, compute mean, median, mode, range, population variance, sample variance and standard deviation. Explain every denominator.

   > [!success]- Worked answer
   > Use the population denominator $N$ when describing the full population. Use the sample denominator $n - 1$ (Bessel's correction) when estimating population variability from a sample. The sample denominator is larger by 1 to correct the bias that arises because the sample mean is closer to the sample values than the population mean is.

3. Determine the direction of skew from the relative positions of mean, median and mode.

   > [!success]- Worked answer
   > - Positive (right) skew: mean > median > mode.
   > - Negative (left) skew: mode > median > mean.
   > - Symmetric: mean ≈ median ≈ mode.

4. Compute Pearson kurtosis $beta_2$ and excess kurtosis $gamma_2$, then classify the distribution.

   > [!success]- Worked answer
   > $beta_2 = mu_4 / mu_2^2$ where $mu_2$ and $mu_4$ are the second and fourth central moments. Excess kurtosis $gamma_2 = beta_2 - 3$. If $beta_2 = 3$ (or $gamma_2 = 0$), the distribution is mesokurtic (normal-like). If $beta_2 > 3$ it is leptokurtic (heavy tails); if $beta_2 < 3$ it is platykurtic (light tails).

5. For a grouped frequency table, calculate the mean, median and mode, identifying the median and modal classes.

   > [!success]- Worked answer
   > Mean: use class midpoints weighted by frequencies. Median: find the class containing $n/2$ and apply the interpolation formula. Mode: identify the modal class (highest frequency) and apply the interpolation formula using adjacent frequencies.

6. Select a parametric or non-parametric test for a stated design and defend the choice using scale, independence and distributional assumptions.

   > [!success]- Worked answer
   > - Two independent skewed groups → Mann–Whitney U (non-parametric; ordinal or skewed data, no normality assumption).
   > - Before/after on same people → paired t-test if paired differences are approximately normal, otherwise Wilcoxon signed-rank.
   > - Three independent approximately normal groups → one-way ANOVA (parametric; requires normality and approximately equal variances).
   > - Association between two categorical variables → chi-square test of association (non-parametric; requires expected counts ≥ 5).

---

## Chapter 07 — Hypothesis Testing

### Chi-square tests

1. Test whether gender is associated with flavour preference using the observed counts Male: Vanilla 10, Chocolate 20; Female: Vanilla 20, Chocolate 10. Use $alpha = 0.05$.

   > [!success]- Worked solution
   > Expected counts: every cell = 15. Each cell contributes $(O-E)^2/E = 25/15 = 1.6667$, so $chi^2 = 6.6667$. df = $(2-1)(2-1) = 1$. Critical value at $alpha = 0.05$ is 3.841. Since $6.6667 > 3.841$, reject $H_0$. The p-value is approximately 0.0098.
   > ```python
   > import numpy as np
   > from scipy.stats import chi2_contingency
   >
   > observed = np.array([[10, 20], [20, 10]])
   > chi2, p_value, df, expected = chi2_contingency(observed, correction=False)
   > print(chi2, p_value, df)
   > ```
   > There is significant evidence of an association between gender and flavour preference.

2. Test whether education level and job type are associated at $alpha = 0.05$. White-collar counts for High School, Bachelor's, Master's and Ph.D. are 30, 40, 30 and 10; blue-collar counts are 50, 20, 10 and 10.

   > [!success]- Worked solution
   > Expected cells: White-Collar (44, 33, 22, 11); Blue-Collar (36, 27, 18, 9). The eight cell contributions sum to $chi^2 = 19.8653$. df = $(2-1)(4-1) = 3$. Critical value at $alpha = 0.05$ is 7.815. Since $19.8653 > 7.815$ (p ≈ 0.00018), reject $H_0$. Education level and job type are significantly associated.

### Z-tests

3. A hospital claims that mean recovery time is 8 days. A sample of 30 patients has mean 9 days and standard deviation 2 days. At $alpha = 0.05$, test whether the population mean differs from 8 days.

   > [!success]- Worked solution
   > $H_0: mu = 8$, $H_1: mu != 8$. Standard error $= 2/sqrt(30) approx 0.365$. $z = (9-8)/0.365 approx 2.74$. At two-sided $alpha = 0.05$, critical values are $plus.minus 1.96$. Since $2.74 > 1.96$, reject $H_0$.
   > ```python
   > import math
   > z = (9 - 8) / (2 / math.sqrt(30))
   > print(z)  # about 2.74
   > ```

4. Department A has $n_1 = 35$, $bar(x)_1 = 75$, $s_1 = 8$; Department B has $n_2 = 40$, $bar(x)_2 = 70$, $s_2 = 7$. Test for a difference in mean productivity at $alpha = 0.01$.

   > [!success]- Worked solution
   > $H_0: mu_1 = mu_2$, $H_1: mu_1 != mu_2$. $z = (75-70)/sqrt(8^2/35 + 7^2/40) approx 5/1.748 approx 2.86$. At two-sided $alpha = 0.01$, critical z-values are approximately $plus.minus 2.576$. Since $2.86 > 2.576$, reject $H_0$. There is significant evidence of a difference in mean productivity.

5. A town's stated public-transport preference is 60%. In a sample of 200 people, 120 prefer public transport. Test for a difference from 60% at $alpha = 0.05$.

   > [!success]- Worked solution
   > $H_0: p = 0.60$, $H_1: p != 0.60$. Sample proportion $hat(p) = 120/200 = 0.60$. $z = (0.60 - 0.60)/sqrt(0.60 times 0.40 / 200) = 0$. Fail to reject $H_0$. There is no evidence that the nearby-town proportion differs from 60%.

6. A school claims that 70% of students pass on the first attempt; 130 of 200 sampled students passed. Test the claim at $alpha = 0.05$.

   > [!success]- Worked solution
   > $hat(p) = 130/200 = 0.65$. $z = (0.65 - 0.70)/sqrt(0.70 times 0.30 / 200) approx -1.54$. Since $|-1.54| < 1.96$, fail to reject $H_0$. The sample does not provide sufficient evidence against the 70% claim.

7. Method 1 gives $n_1 = 30$, $bar(x)_1 = 82$, $s_1 = 10$; Method 2 gives $n_2 = 35$, $bar(x)_2 = 85$, $s_2 = 12$. Test for a difference at $alpha = 0.05$.

   > [!success]- Worked solution
   > $z = (82-85)/sqrt(10^2/30 + 12^2/35) approx -1.10$. Since $|-1.10| < 1.96$, fail to reject $H_0$. Not significant at 5% under this z-test setup.

### T-tests

8. Use a paired t-test for the scores Before = (70, 75, 80, 85, 78, 74, 77, 82) and After = (72, 78, 85, 88, 81, 77, 80, 86). At the 5% level, did the teaching method change performance?

   > [!success]- Worked solution
   > Differences (after − before): 2, 3, 5, 3, 3, 3, 3, 4. $bar(d) = 3.25$, $s_d approx 0.886$. $t = 3.25/(0.886/sqrt(8)) approx 10.36$, df = 7. Critical value at two-sided $alpha = 0.05$ is 2.365. Since $10.36 > 2.365$, reject $H_0$. The teaching method has a significant effect.

9. Compare independent scores Group A = (85, 78, 90, 83, 76) and Group B = (88, 85, 92, 80, 82) with a two-sided t-test at the 5% level.

   > [!success]- Worked solution
   > Means are 82.4 and 85.4; standard deviations are approximately 5.595 and 4.775. Welch's $t approx -0.912$ with about 7.81 df and p ≈ 0.389. Fail to reject $H_0$. The sample does not provide evidence of a difference in mean performance.

10. Use a paired t-test for weights Before = (80, 85, 90, 75, 88, 95, 100, 77, 85, 92) and After = (78, 83, 89, 74, 85, 92, 98, 75, 82, 90). Did the diet change mean weight at the 5% level?

    > [!success]- Worked solution
    > Differences: 2, 2, 1, 1, 3, 3, 2, 2, 3, 2. $bar(d) = 2.1$, $s_d approx 0.738$. $t approx 9.00$, df = 9. At two-sided $alpha = 0.05$, critical magnitude is 2.262. Since $9.00 > 2.262$, reject $H_0$. The diet is associated with a significant mean weight change.

11. Compare independent standardised-test scores Group A = (85, 87, 90, 78, 82, 86) and Group B = (88, 85, 90, 92, 87, 89) at the 5% level.

    > [!success]- Worked solution
    > Means are 84.67 and 88.50. Welch's $t approx -1.942$, df ≈ 8.03, p ≈ 0.0879. At two-sided $alpha = 0.05$, fail to reject $H_0$.

12. A company claims a mean battery life of 100 hours. Test lifespans (95, 97, 101, 99, 100, 98, 96, 102, 99, 97) at the 5% level.

    > [!success]- Worked solution
    > $bar(x) = 98.4$, $s approx 2.221$. $t = (98.4 - 100)/(2.221/sqrt(10)) approx -2.278$, df = 9, two-sided p ≈ 0.0487. Reject $H_0$ at 5%. Mean battery life differs from 100 hours.

13. At the 5% level, compare Method A = (85, 90, 88, 91, 87) and Method B = (78, 83, 85, 84, 82), assuming equal variances.

    > [!success]- Worked solution
    > Means are 88.2 and 82.4. Pooled $t approx 3.597$, df = 8, p ≈ 0.0070. Reject $H_0$; the two study methods have significantly different mean scores.

14. Use a paired t-test for productivity Before = (20, 21, 19, 18, 22, 20, 21, 23, 19, 24) and After = (22, 23, 21, 19, 24, 21, 22, 25, 20, 26). Did the programme improve productivity?

    > [!success]- Worked solution
    > Paired increases: 2, 2, 2, 1, 2, 1, 1, 2, 1, 2. $bar(d) = 1.6$, $s_d approx 0.516$, $t approx 9.798$, df = 9, p < 0.00001. Reject $H_0$; the training programme significantly improved mean productivity.

15. Test the 50 kg claim at the 1% level using bag weights (49.8, 50.2, 49.6, 50.5, 50.0, 49.9, 50.1, 50.3, 50.2, 50.4, 50.0, 49.7, 49.9, 50.1, 50.2).

    > [!success]- Worked solution
    > $bar(x) = 50.06$, $s approx 0.253$. $t approx 0.919$, df = 14, p ≈ 0.374. Fail to reject $H_0$ at 1%.

16. At the 5% level, compare tyre lifespans Brand A = (40000, 42000, 41500, 43000, 39500) and Brand B = (38000, 37500, 39000, 38500, 37000), assuming equal variances.

    > [!success]- Worked solution
    > Means are 41,200 and 38,000 miles. Pooled $t approx 4.355$, df = 8, p ≈ 0.00243. Reject $H_0$.

17. Compare weight loss Diet A = (6.2, 5.8, 7.1, 6.5, 7.3, 6.9, 7.0, 6.8) and Diet B = (4.3, 5.0, 4.8, 5.2, 4.7, 4.9, 5.1, 4.6) at the 5% level. State and justify whether you use the pooled or Welch form.

    > [!success]- Worked solution
    > Means are 6.70 and 4.825. Both the pooled calculation ($t approx 9.14$, df = 14) and Welch's calculation reject $H_0$. Because the sample sizes are equal and the standard deviations are similar, the pooled form is defensible; Welch's form is also valid and gives the same conclusion.

18. Assuming equal variances, compare Technique A = (78, 82, 85, 90, 88) and Technique B = (75, 80, 85, 85, 87) at the 5% level.

    > [!success]- Worked solution
    > Pooled means are 84.6 and 82.4. Pooled $t approx 0.72$, df = 8, below the two-sided 5% critical value 2.306. Fail to reject $H_0$.

### One-way ANOVA

19. At the 5% level, compare Method A = (85, 86, 88, 75, 78), Method B = (79, 81, 82, 83, 87) and Method C = (91, 92, 93, 89, 94) with one-way ANOVA.

    > [!success]- Worked solution
    > Group means are 82.4, 82.4 and 91.8; grand mean is 85.533. Between-group SS = 294.533, within-group SS = 175.2. $F approx 10.087$ with df₁ = 2, df₂ = 12; p ≈ 0.00269. Reject $H_0$; at least one teaching-method mean differs.
    > ```python
    > import numpy as np
    > from scipy.stats import f_oneway
    >
    > result = f_oneway([85, 86, 88, 75, 78],
    >                   [79, 81, 82, 83, 87],
    >                   [91, 92, 93, 89, 94])
    > print(result.statistic, result.pvalue)
    > ```

20. At the 1% level, compare Programme A = (40, 42, 44, 38, 36), B = (55, 53, 57, 59, 56) and C = (60, 62, 64, 58, 61) with one-way ANOVA.

    > [!success]- Worked solution
    > Group means are 40, 56 and 61; grand mean is 52.333. Between-group SS = 1203.333, within-group SS = 80. $F = 90.25$ with df₁ = 2, df₂ = 12; p < 0.000001. Reject $H_0$ at 1%; at least one training-programme mean differs significantly.

---

## Chapter 08 — Two-Way ANOVA

1. State the three null hypotheses for a two-way ANOVA with Factor A (2 levels) and Factor B (3 levels).

   > [!success]- Worked answer
   > - $H_(0A)$: Factor A has no effect (all $alpha_i = 0$).
   > - $H_(0B)$: Factor B has no effect (all $beta_j = 0$).
   > - $H_(0 "AB")$: There is no interaction between A and B (all $(alpha beta)_(i j) = 0$).

2. A two-way ANOVA has $a = 2$, $b = 3$ and $n = 5$ per cell. What are the df for Factor A, Factor B, interaction and error?

   > [!success]- Worked answer
   > Factor A df = $a - 1 = 1$. Factor B df = $b - 1 = 2$. Interaction df = $(a-1)(b-1) = 2$. Total $N = 2 times 3 times 5 = 30$, so error df = $N - a b = 30 - 6 = 24$.

3. Explain what a significant interaction means in plain language.

   > [!success]- Worked answer
   > A significant interaction means the effect of one factor depends on the level of the other factor. For example, if a teaching method works well for one gender but not the other, the method-by-gender interaction is significant.

4. Describe the difference between a significant main effect and a significant interaction.

   > [!success]- Worked answer
   > A significant main effect means that, averaged over the other factor, the factor has an overall influence on the response. A significant interaction means the factors do not act independently — the effect of one factor changes depending on the level of the other. When an interaction is significant, interpreting main effects alone can be misleading.
