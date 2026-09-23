---
title: "07 - Hypothesis Testing"
math_syntax: typst
---

# Chapter 07 — Hypothesis Testing

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [06 - Basic Statistics](/notes/studies-introduction-to-data-science-06---basic-statistics) · Next: [08 - Two-Way ANOVA](/notes/studies-introduction-to-data-science-08---two-way-anova)

> [!summary] Core workflow
> State H₀ and H₁, choose a test that matches the data/design, calculate a statistic, compare it with a critical value (or p-value), and report a decision in the context of the question.

> [!important] Decision language
> A test result either **rejects** the null hypothesis or **fails to reject** it. Failing to reject does not prove that the null hypothesis is true.

## 0. Hypothesis-testing fundamentals

A hypothesis test uses sample evidence to evaluate a claim about a population.

- **Null hypothesis, H₀:** the default claim, usually no effect, no difference or no association.
- **Alternative hypothesis, H₁:** the effect, difference or association being investigated.
- **Significance level, $alpha$:** the maximum probability of a Type I error chosen before analysing the data. Common choices are 0.05 and 0.01.
- **Test statistic:** a standardised measure of how far the sample result is from what H₀ predicts.
- **p-value:** assuming H₀ is true, the probability of a test statistic at least as extreme as the observed value.
- **Degrees of freedom, df:** the number of independent pieces of information available for estimating variability or referencing a test distribution.

Decision rule:

$$
p <= alpha arrow "reject H"_0 quad p > alpha arrow "fail to reject H"_0
$$

### Errors and power

| Reality and decision | Result |
| --- | --- |
| H₀ true, but reject H₀ | Type I error; probability $alpha$ |
| H₀ false, but fail to reject H₀ | Type II error; probability $beta$ |
| H₀ false, and reject H₀ | Correct detection; power $= 1 - beta$ |

### One-sided and two-sided alternatives

- Use a **two-sided** alternative when any difference matters: H₁ uses `≠`.
- Use a **right-sided** alternative when only an increase matters: H₁ uses `>`.
- Use a **left-sided** alternative when only a decrease matters: H₁ uses `<`.

Choose the direction before examining the results. Also check independence, measurement scale, distributional assumptions and whether observations are paired or independent.

## 1. Chi-square test of association

The first problem asks whether gender and ice-cream flavour preference are associated.

**Question:** “To investigate if there is an association between gender (Male, Female) and preference for a type of ice cream flavor (Vanilla, Chocolate).”

### Observed frequencies

| Gender | Vanilla | Chocolate | Total |
| --- | ---: | ---: | ---: |
| Male | 10 | 20 | 30 |
| Female | 20 | 10 | 30 |
| Total | 30 | 30 | 60 |

### Hypotheses

- H₀: no association; gender and flavour preference are independent.
- H₁: an association exists; they are not independent.

### Expected frequencies

For each cell:

$$
E = frac("row total" times "column total", "grand total")
$$

Here $E$ is the expected frequency for one cell under the assumption that the two categorical variables are independent.

Every expected cell is 15:

| Gender | Vanilla | Chocolate | Total |
| --- | ---: | ---: | ---: |
| Male | 15 | 15 | 30 |
| Female | 15 | 15 | 30 |
| Total | 30 | 30 | 60 |

### Statistic and decision

$$
chi^2 = sum frac((O - E)^2, E)
$$

Here $O$ is an observed cell frequency, $E$ is its expected frequency, and the sum runs over every cell in the contingency table.

Each cell contributes 25/15 = 1.6667, so $chi^2 = 6.6667$. Degrees of freedom:

$$
"df" = (r - 1)(c - 1) = (2 - 1)(2 - 1) = 1
$$

Here $r$ is the number of rows and $c$ is the number of columns, excluding totals. At $alpha = 0.05$, the critical value is 3.841. Since 6.6667 > 3.841, reject H₀. The p-value is approximately 0.0098.

**Answer:** There is statistically significant evidence of an association between gender and ice-cream flavour preference in this sample.

```python
import numpy as np
from scipy.stats import chi2_contingency

observed = np.array([[10, 20], [20, 10]])
chi2, p_value, df, expected = chi2_contingency(observed, correction=False)
print(chi2, p_value, df)
print(expected)
```


## 2. Chi-square worked example: education and job type

**Question:** “Suppose a researcher wants to examine whether there is an association between education level and the type of job a person holds. The researcher collects data from a sample of 200 people. The data is summarized in the contingency table below.”

### Observed table

| Job type | High School | Bachelor’s | Master’s | Ph.D. | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| White-Collar | 30 | 40 | 30 | 10 | 110 |
| Blue-Collar | 50 | 20 | 10 | 10 | 90 |
| Total | 80 | 60 | 40 | 20 | 200 |

H₀ says education and job type are independent; H₁ says they are associated.

### Expected table

Using row total × column total / grand total:

| Job type | High School | Bachelor’s | Master’s | Ph.D. | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| White-Collar | 44 | 33 | 22 | 11 | 110 |
| Blue-Collar | 36 | 27 | 18 | 9 | 90 |
| Total | 80 | 60 | 40 | 20 | 200 |

The eight cell contributions sum to $chi^2 = 19.8653$.

Degrees of freedom:

$$
"df" = (2 - 1)(4 - 1) = 3
$$

At $alpha = 0.05$, the critical value is 7.815. Since 19.8653 > 7.815 (p ≈ 0.00018):

**Answer:** Reject H₀. Education level and job type are significantly associated in this sample.


## 3. Z-tests

A z-test compares a standardised statistic with the standard normal distribution. Use it for a mean when the population standard deviation is known, or for a proportion when the normal approximation is appropriate.

### Single-sample mean

**Question:** “A hospital claims that the average recovery time for a certain surgery is 8 days. A researcher believes this time is longer and takes a sample of 30 patients, finding a mean recovery time of 9 days with a standard deviation of 2 days. At a 0.05 significance level, test whether the average recovery time is different from 8 days.”

Given $mu_0 = 8$, $bar(x) = 9$, $sigma = 2$, $n = 30$ and $alpha = 0.05$. The question asks whether the mean is different, so use a two-sided test:

$$
"H"_0: mu = 8 quad "H"_1: mu != 8
$$

For a z test with a known population standard deviation σ:

$$
z = frac(bar(x) - mu_0, sigma / sqrt(n))
$$

Here $bar(x)$ is the sample mean, $mu_0$ is the null-hypothesis mean, $sigma$ is the known population standard deviation, and $n$ is sample size.

The standard error is $2 / sqrt(30) approx 0.365$, so:

$$
z = frac(9 - 8, 2 / sqrt(30)) approx 2.74
$$

If 2 is only a sample standard deviation rather than a known population value, use a one-sample t-test instead. With $n = 30$, both approaches reject H₀ for these data.

At two-sided α = 0.05, critical values are ±1.96. Since 2.74 > 1.96:

**Answer:** Reject H₀. There is evidence that the average recovery time differs from 8 days; the observed sample mean is higher.

```python
import math

mu0 = 8
x_bar = 9
sigma = 2
n = 30
z = (x_bar - mu0) / (sigma / math.sqrt(n))
print(z)  # about 2.74
```

### Two-sample means

**Question:** “A company wants to compare the average productivity of employees in two different departments. A sample of 35 employees from Department A has a mean productivity score of 75 with a standard deviation of 8. Another sample of 40 employees from Department B has a mean score of 70 with a standard deviation of 7. Is there a significant difference in productivity at a 0.01 significance level?”

Given $bar(x)_1 = 75$, $s_1 = 8$, $n_1 = 35$; $bar(x)_2 = 70$, $s_2 = 7$, $n_2 = 40$; $alpha = 0.01$.

$$
"H"_0: mu_1 = mu_2 quad "H"_1: mu_1 != mu_2
$$

$$
z = frac(bar(x)_1 - bar(x)_2, sqrt(s_1^2 / n_1 + s_2^2 / n_2)) approx frac(5, 1.748) approx 2.86
$$

The subscripts identify the two independent groups: $bar(x)_j$ is a group mean, $s_j$ is its standard deviation, and $n_j$ is its sample size.

At two-sided $alpha = 0.01$, the critical z-values are approximately ±2.576. Since 2.86 > 2.576:

**Answer:** Reject H₀; there is significant evidence of a difference in mean productivity.

### Population proportion

**Question:** “A survey indicates that 60% of a town's population prefers public transportation over driving. A sample of 200 people from a nearby town reveals that 120 prefer public transportation. Is there evidence at the 0.05 significance level that the proportion in the nearby town is different from 60%?”

H₀: p = 0.60; H₁: p ≠ 0.60. The sample proportion is $hat(p) = 120/200 = 0.60$.

$$
z = frac(hat(p) - p_0, sqrt(p_0 (1 - p_0) / n)) = frac(0.60 - 0.60, sqrt(0.60(0.40) / 200)) = 0
$$

Here $hat(p)$ is the sample proportion, $p_0$ is the null-hypothesis population proportion, and $n$ is sample size.

With critical values ±1.96, 0 lies inside the non-rejection interval.

**Answer:** Fail to reject H₀. There is not enough evidence that the nearby-town proportion differs from 60%.

### Z-test practice

**Question:** “A school claims that 70% of its students pass the final exam on the first attempt. A random sample of 200 students finds that 130 students passed on the first attempt. Is there evidence to support the school's claim at a 0.05 significance level?”

Using a two-sided proportion z-test:

$$
hat(p) = frac(130, 200) = 0.65 quad z = frac(0.65 - 0.70, sqrt(0.70(0.30) / 200)) approx -1.54
$$

Because |−1.54| < 1.96, fail to reject H₀ at 5%. **Answer:** the sample does not provide sufficient evidence against the 70% claim.

**Question:** “Two teaching methods are tested to see if they result in different average scores. Method 1 is tested on 30 students with an average score of 82 and a standard deviation of 10, while Method 2 is tested on 35 students with an average score of 85 and a standard deviation of 12. Is there a significant difference between the two methods at the 0.05 significance level?”

Using the two-sample large-sample approximation:

$$
z = frac(82 - 85, sqrt(10^2 / 30 + 12^2 / 35)) approx -1.10
$$

Since |−1.10| < 1.96, fail to reject H₀. **Answer:** not significant at 5% under this z-test setup. If the standard deviations are sample estimates, a two-sample t-test is the more appropriate follow-up.


## 4. T-tests

The t-test family includes:

| Aspect | One-sample t | Paired t | Unpaired t |
| --- | --- | --- | --- |
| Purpose | One sample mean vs known value | Two related/matched groups | Two independent groups |
| Null | μ = μ₀ | Mean difference μD = 0 | μA = μB |
| Data | One set | Before/after or matched pairs | Separate groups |
| Degrees of freedom | n − 1 | n − 1 pairs | nA + nB − 2 for pooled version; Welch uses an approximation |

### Paired t-test: teaching method

**Question:** “A researcher wants to know if a new teaching method has an effect on student performance. He records the test scores of 8 students before and after the teaching method was applied.”

Before: 70, 75, 80, 85, 78, 74, 77, 82  
After: 72, 78, 85, 88, 81, 77, 80, 86

Differences (after − before): 2, 3, 5, 3, 3, 3, 3, 4. Therefore $bar(d) = 3.25$ and $s_d approx 0.886$.

$$
t = frac(bar(d), s_d / sqrt(n)) = frac(3.25, 0.886 / sqrt(8)) approx 10.37 quad "df" = 7
$$

Here $d_i$ is an individual paired difference, $bar(d)$ is the mean difference, $s_d$ is the sample standard deviation of the differences, and $n$ is the number of pairs.

At α = 0.05 two-sided, the df = 7 critical value is 2.365. Since 10.36 > 2.365:

**Answer:** Reject H₀; the teaching method has a statistically significant effect on the recorded scores.

### Unpaired t-test: two groups

**Question:** “A researcher wants to compare the performance of two groups of students, Group A and Group B, on a test. The scores are as follows:

Group A: 85, 78, 90, 83, 76

Group B: 88, 85, 92, 80, 82.”

The sample means are 82.4 and 85.4; the sample standard deviations are approximately 5.595 and 4.775. Welch's statistic is $t approx -0.912$ with about 7.81 degrees of freedom and p ≈ 0.389.

**Answer:** At a two-sided 5% significance level, fail to reject H₀. The sample does not provide evidence of a difference in mean performance.

### Paired t-test: diet

**Question:** “A researcher wants to determine if a new diet has an effect on weight. The weights of 10 participants are recorded before and after the diet. The data is as follows:”

| Participant | Before (kg) | After (kg) |
| ---: | ---: | ---: |
| 1 | 80 | 78 |
| 2 | 85 | 83 |
| 3 | 90 | 89 |
| 4 | 75 | 74 |
| 5 | 88 | 85 |
| 6 | 95 | 92 |
| 7 | 100 | 98 |
| 8 | 77 | 75 |
| 9 | 85 | 82 |
| 10 | 92 | 90 |

Let $B_i$ be a participant's before value and $A_i$ the after value. Define $d_i = B_i - A_i$:

$$
d_i = B_i - A_i quad bar(d) = frac(sum_(i=1)^n d_i, n) quad s_d = sqrt(frac(sum_(i=1)^n (d_i - bar(d))^2, n - 1)) quad t = frac(bar(d), s_d / sqrt(n))
$$

The differences have $bar(d) = 2.1$, $s_d approx 0.738$ and $t approx 9.00$ with df = 9. At $alpha = 0.05$ two-sided, the critical magnitude is 2.262.

**Answer:** Reject H₀; the diet is associated with a statistically significant mean weight change in these participants.

### Unpaired t-test: standardised scores

**Question:** “A researcher wants to compare the test scores of two different groups of students, Group A and Group B, on a standardized test. The test scores are as follows:”

| Group A | Score | Group B | Score |
| --- | ---: | --- | ---: |
| A | 85 | B | 88 |
| A | 87 | B | 85 |
| A | 90 | B | 90 |
| A | 78 | B | 92 |
| A | 82 | B | 87 |
| A | 86 | B | 89 |

The means are 84.67 and 88.50. Welch's test gives $t approx -1.942$, df ≈ 8.03 and p ≈ 0.0879. At a conventional two-sided 5% significance level, fail to reject H₀. If a different significance level or a one-sided alternative is intended, state it before testing.


## 5. One- and two-sample t-test problems

### Battery lifespan

**Question:** “A company claims that its batteries last an average of 100 hours. A sample of 10 batteries is tested, and the following lifespans (in hours) are recorded: 95, 97, 101, 99, 100, 98, 96, 102, 99, 97. At a 5% significance level, can we conclude that the average battery lifespan is different from 100 hours?”

Use H₀: μ = 100 and H₁: μ ≠ 100. From the ten observations:

- $bar(x) = 98.4$;
- $s approx 2.221$;
- $t = (98.4 - 100)/(2.221 / sqrt(10)) approx -2.278$;
- df = 9;
- two-sided p ≈ 0.0487.

**Answer:** Reject H₀ at 5%. The sample provides just enough evidence that mean battery life differs from 100 hours. Because the result is close to the threshold, report the p-value rather than describing it as strongly significant.

### Two study methods

**Question:** “A researcher wants to compare the test scores of two groups of students using different study methods. The scores are as follows:

Group 1 (Method A): 85, 90, 88, 91, 87

Group 2 (Method B): 78, 83, 85, 84, 82

At a 5% significance level, can we conclude that the two study methods produce different results?”

With the equal-variance assumption, the means are 88.2 and 82.4. The pooled statistic is $t approx 3.597$ with df = 8 and p ≈ 0.0070.

**Answer:** Reject H₀; the two study methods have significantly different mean scores at the 5% level.

### Training programme (paired)

**Question:** “A company wants to know if a new training program has significantly improved the productivity of its employees. The productivity (measured in units produced per day) of 10 employees was recorded before and after the training program.”

| Employee | Before | After |
| ---: | ---: | ---: |
| 1 | 20 | 22 |
| 2 | 21 | 23 |
| 3 | 19 | 21 |
| 4 | 18 | 19 |
| 5 | 22 | 24 |
| 6 | 20 | 21 |
| 7 | 21 | 22 |
| 8 | 23 | 25 |
| 9 | 19 | 20 |
| 10 | 24 | 26 |

The paired increases are 2, 2, 2, 1, 2, 1, 1, 2, 1, 2. They give $bar(d) = 1.6$, $s_d approx 0.516$, $t approx 9.798$, df = 9 and p < 0.00001.

**Answer:** Reject H₀; the training programme significantly improved mean productivity.

### Practice problems

**Question:** “A factory claims that the average weight of its cement bags is 50 kg. A random sample of 15 bags is taken, and their weights (in kg) are: 49.8, 50.2, 49.6, 50.5, 50.0, 49.9, 50.1, 50.3, 50.2, 50.4, 50.0, 49.7, 49.9, 50.1, 50.2. At a 1% significance level, can we conclude that the average weight is 50 kg?”

The sample gives $bar(x) = 50.06$, $s approx 0.253$, $t approx 0.919$, df = 14 and p ≈ 0.374.

**Answer:** Fail to reject H₀ at 1%; there is not enough evidence that the mean bag weight differs from 50 kg.

**Question:** “Two brands of tires are tested for durability. Brand A has the following lifespans (in miles): 40,000, 42,000, 41,500, 43,000, 39,500. Brand B has the following lifespans (in miles): 38,000, 37,500, 39,000, 38,500, 37,000. At a 5% significance level, can we conclude that the two brands have different average lifespans?”

The sample means are 41,200 miles and 38,000 miles. Under the equal-variance assumption, $t approx 4.355$, df = 8 and p ≈ 0.00243.

**Answer:** Reject H₀; the brands have significantly different mean lifespans at the 5% level.


## 6. One-way ANOVA

ANOVA compares three or more means. H₀ says all group means are equal; H₁ says at least one differs.

### Problem 1 — teaching methods

**Question:** “A researcher wants to determine if there is a significant difference in the average test scores of students taught by three different teaching methods. The test scores are as follows:

Method A: 85, 86, 88, 75, 78

Method B: 79, 81, 82, 83, 87

Method C: 91, 92, 93, 89, 94

Can we conclude at the 5% significance level that there is a difference in the average test scores among the three teaching methods?”

The group means are 82.4, 82.4 and 91.8; the grand mean is 85.533. The between-group sum of squares is 294.533 and the within-group sum of squares is 175.2. Thus $F approx 10.087$ with df₁ = 2 and df₂ = 12; p ≈ 0.00269.

**Answer:** Reject H₀; at least one teaching-method mean differs significantly.

### Problem 2 — training programmes

**Question:** “A company wants to evaluate the effectiveness of three different training programs on employee productivity. Productivity is measured in units produced per week. The data from a sample of employees who completed each training program are as follows: Training Program A: 40, 42, 44, 38, 36. Training Program B: 55, 53, 57, 59, 56. Training Program C: 60, 62, 64, 58, 61. The company wants to test if there is a significant difference in productivity between the three training programs at the 0.01 significance level.”

The group means are 40, 56 and 61; the grand mean is 52.333. The between-group sum of squares is 1203.333 and the within-group sum of squares is 80. This gives $F = 90.25$ with df₁ = 2 and df₂ = 12; p < 0.000001.

**Answer:** Reject H₀ at 1%; at least one training-programme mean differs significantly.

### Generic one-way ANOVA code

```python
import numpy as np
from scipy.stats import f_oneway

method_a = [85, 86, 88, 75, 78]
method_b = [79, 81, 82, 83, 87]
method_c = [91, 92, 93, 89, 94]
result = f_oneway(method_a, method_b, method_c)
print(result.statistic, result.pvalue)
```

## 7. Equal- and unequal-variance two-sample t-tests

### Equal-variance (pooled) t-test

Assume the two populations have equal variance. The pooled variance is:

$$
s_p^2 = frac((n_1 - 1) s_1^2 + (n_2 - 1) s_2^2, n_1 + n_2 - 2)
$$

Here $s_p^2$ is pooled variance, $s_1$ and $s_2$ are sample standard deviations, and $n_1$ and $n_2$ are sample sizes.

and:

$$
t = frac(bar(x)_1 - bar(x)_2, s_p sqrt(1 / n_1 + 1 / n_2)) quad "df" = n_1 + n_2 - 2
$$

The terms $bar(x)_1$ and $bar(x)_2$ are the two sample means.

Use this when equal spread is defensible or an equality-of-variance assessment supports it.

### Unequal-variance (Welch) t-test

Welch’s test does not pool variances:

$$
t = frac(bar(x)_1 - bar(x)_2, sqrt(s_1^2 / n_1 + s_2^2 / n_2))
$$

with Welch–Satterthwaite degrees of freedom:

$$
"df" = frac((s_1^2 / n_1 + s_2^2 / n_2)^2, (s_1^2 / n_1)^2 / (n_1 - 1) + (s_2^2 / n_2)^2 / (n_2 - 1))
$$

Welch's degrees of freedom need not be an integer. Use the computed value when obtaining a p-value; do not round it before the calculation.

Use Welch’s version when spreads differ or equal-variance assumptions are doubtful, especially with unequal sample sizes.

| Difference | Equal variance | Unequal variance/Welch |
| --- | --- | --- |
| Variance assumption | Equal | Not equal |
| Variance in statistic | Pooled | Separate |
| Degrees of freedom | n₁ + n₂ − 2 | Welch approximation, often non-integer |
| Robustness | Less robust if assumption fails | More robust to unequal spread/sample size |

### Practice problems

**Question:** “A researcher is studying the effect of two different diets on weight loss. Group 1 follows Diet A, and Group 2 follows Diet B. The weight loss (in kg) after 8 weeks for each group is recorded as follows:

Group 1 (Diet A): 6.2, 5.8, 7.1, 6.5, 7.3, 6.9, 7.0, 6.8

Group 2 (Diet B): 4.3, 5.0, 4.8, 5.2, 4.7, 4.9, 5.1, 4.6

Is there a significant difference in weight loss between the two diets at a 5% significance level?”

Assuming independent groups and a two-sided test, the means are 6.70 and 4.825. A pooled calculation gives t about 9.14 with df = 14; Welch’s calculation also rejects at 5%.

**Answer (derived):** Reject H₀; the displayed data support a significant difference in mean weight loss. Diet A’s sample mean is higher.

**Question:** “Two different study techniques were tested on two independent groups of students to see which technique was more effective in improving test scores. The test scores are as follows:

Group 1 (Technique A): 78, 82, 85, 90, 88

Group 2 (Technique B): 75, 80, 85, 85, 87

Assume that the variances are equal and determine if there is a significant difference between the two techniques at a 5% significance level.”

Pooled means are 84.6 and 82.4; pooled t about 0.72 with df = 8, below the two-sided 5% critical value 2.306.

**Answer (derived under the stated equal-variance assumption):** Fail to reject H₀; the displayed sample does not show a significant difference.


## 8. Critical-value table excerpts

The rows below contain the critical values used by the worked examples.

### Chi-square (upper-tail critical values)

| df | α = 0.05 | α = 0.01 |
| ---: | ---: | ---: |
| 1 | 3.841 | 6.635 |
| 2 | 5.991 | 9.210 |
| 3 | 7.815 | 11.345 |
| 4 | 9.488 | 13.277 |
| 5 | 11.070 | 15.086 |

### t distribution (two-tailed α = 0.05)

| df | Critical | Use in this topic |
| ---: | ---: | --- |
| 7 | ±2.365 | Paired teaching-method example |
| 8 | ±2.306 | Two-sample and tyre examples |
| 9 | ±2.262 | Battery/paired-diet examples |
| 14 | ±2.145 | Two-sided 5% reference; at 1%, use ±2.977 |

For a two-tailed test, α is split between both tails. For a one-tailed test, the full α is placed in the specified tail. Always match the row, tail and significance column before comparing.


## 9. Hypothesis-testing code template

The following template makes the decision rule explicit. Replace the arrays and test with the design in the question.

```python
import numpy as np
from scipy import stats

alpha = 0.05
group_a = np.array([85, 90, 88, 91, 87])
group_b = np.array([78, 83, 85, 84, 82])

# Independent two-sample Welch t-test:
result = stats.ttest_ind(group_a, group_b, equal_var=False)
print("t =", result.statistic)
print("p =", result.pvalue)
print("reject H0 =", result.pvalue < alpha)
```

Common mistakes:

- choosing one- versus two-tailed after looking at the result;
- treating “fail to reject” as proof that H₀ is true;
- using a paired test for independent groups or an unpaired test for matched observations;
- forgetting whether a critical value already splits α across two tails;
- copying a statistic without checking the supplied data and formula;
- calling a p-value the probability that H₀ is true;
- reporting significance without stating α, the test and the direction of H₁.

## 10. Final interpretation checklist

- Define every symbol before substituting numbers.
- State whether the alternative hypothesis is one-sided or two-sided before examining the data.
- Use a z-test for a mean only when the population standard deviation is known; otherwise use a t-test.
- Use a paired test for matched or before/after observations and an independent-samples test for separate groups.
- Report the test statistic, degrees of freedom where applicable, p-value or critical value, and a conclusion in the language of the question.
- Treat “fail to reject H₀” as insufficient evidence against H₀, not proof that H₀ is true.
- For ANOVA, a significant main effect does not imply a significant interaction, and a significant omnibus result does not identify which group means differ.

## 11. Question bank

### Questions from class material

Each prompt below links back to its complete worked solution in this note.

#### Chi-square tests

1. Test whether gender is associated with flavour preference using the observed counts Male: Vanilla 10, Chocolate 20; Female: Vanilla 20, Chocolate 10. Use $alpha = 0.05$. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#1.-chi-square-test-of-association)
2. Test whether education level and job type are associated at $alpha = 0.05$. White-collar counts for High School, Bachelor's, Master's and Ph.D. are 30, 40, 30 and 10; blue-collar counts are 50, 20, 10 and 10. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#2.-chi-square-worked-example%3A-education-and-job-type)

#### Z-tests

3. A hospital claims that mean recovery time is 8 days. A sample of 30 patients has mean 9 days and standard deviation 2 days. At $alpha = 0.05$, test whether the population mean differs from 8 days. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#single-sample-mean)
4. Department A has $n_1 = 35$, $bar(x)_1 = 75$, $s_1 = 8$; Department B has $n_2 = 40$, $bar(x)_2 = 70$, $s_2 = 7$. Test for a difference in mean productivity at $alpha = 0.01$. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#two-sample-means)
5. A town's stated public-transport preference is 60%. In a sample of 200 people, 120 prefer public transport. Test for a difference from 60% at $alpha = 0.05$. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#population-proportion)
6. A school claims that 70% of students pass on the first attempt; 130 of 200 sampled students passed. Test the claim at $alpha = 0.05$. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#z-test-practice)
7. Method 1 gives $n_1 = 30$, $bar(x)_1 = 82$, $s_1 = 10$; Method 2 gives $n_2 = 35$, $bar(x)_2 = 85$, $s_2 = 12$. Test for a difference at $alpha = 0.05$. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#z-test-practice)

#### T-tests

8. Use a paired t-test for the scores Before = (70, 75, 80, 85, 78, 74, 77, 82) and After = (72, 78, 85, 88, 81, 77, 80, 86). At the 5% level, did the teaching method change performance? [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#paired-t-test%3A-teaching-method)
9. Compare independent scores Group A = (85, 78, 90, 83, 76) and Group B = (88, 85, 92, 80, 82) with a two-sided t-test at the 5% level. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#unpaired-t-test%3A-two-groups)
10. Use a paired t-test for weights Before = (80, 85, 90, 75, 88, 95, 100, 77, 85, 92) and After = (78, 83, 89, 74, 85, 92, 98, 75, 82, 90). Did the diet change mean weight at the 5% level? [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#paired-t-test%3A-diet)
11. Compare independent standardised-test scores Group A = (85, 87, 90, 78, 82, 86) and Group B = (88, 85, 90, 92, 87, 89) at the 5% level. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#unpaired-t-test%3A-standardised-scores)
12. A company claims a mean battery life of 100 hours. Test lifespans (95, 97, 101, 99, 100, 98, 96, 102, 99, 97) at the 5% level. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#battery-lifespan)
13. At the 5% level, compare Method A = (85, 90, 88, 91, 87) and Method B = (78, 83, 85, 84, 82), assuming equal variances. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#two-study-methods)
14. Use a paired t-test for productivity Before = (20, 21, 19, 18, 22, 20, 21, 23, 19, 24) and After = (22, 23, 21, 19, 24, 21, 22, 25, 20, 26). Did the programme improve productivity? [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#training-programme-%28paired%29)
15. Test the 50 kg claim at the 1% level using bag weights (49.8, 50.2, 49.6, 50.5, 50.0, 49.9, 50.1, 50.3, 50.2, 50.4, 50.0, 49.7, 49.9, 50.1, 50.2). [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#practice-problems)
16. At the 5% level, compare tyre lifespans Brand A = (40000, 42000, 41500, 43000, 39500) and Brand B = (38000, 37500, 39000, 38500, 37000), assuming equal variances. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#practice-problems)
17. Compare weight loss Diet A = (6.2, 5.8, 7.1, 6.5, 7.3, 6.9, 7.0, 6.8) and Diet B = (4.3, 5.0, 4.8, 5.2, 4.7, 4.9, 5.1, 4.6) at the 5% level. State and justify whether you use the pooled or Welch form. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#practice-problems)
18. Assuming equal variances, compare Technique A = (78, 82, 85, 90, 88) and Technique B = (75, 80, 85, 85, 87) at the 5% level. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#practice-problems)

#### One-way ANOVA

19. At the 5% level, compare Method A = (85, 86, 88, 75, 78), Method B = (79, 81, 82, 83, 87) and Method C = (91, 92, 93, 89, 94) with one-way ANOVA. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#problem-1-%E2%80%94-teaching-methods)
20. At the 1% level, compare Programme A = (40, 42, 44, 38, 36), B = (55, 53, 57, 59, 56) and C = (60, 62, 64, 58, 61) with one-way ANOVA. [Worked solution](/notes/studies-introduction-to-data-science-07---hypothesis-testing#problem-2-%E2%80%94-training-programmes)

> [!tip] Two-way ANOVA practice
> Two-way ANOVA questions have been moved to [Chapter 08 — Two-Way ANOVA](/notes/studies-introduction-to-data-science-08---two-way-anova#11.-question-bank).

### Extra practice

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
   > Fail to reject $H_0$. The sample does not provide sufficient evidence for the stated alternative at the 5% level. Do not write “accept $H_0$” or claim that the null has been proved.
