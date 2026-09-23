---
title: "06 - Basic Statistics"
math_syntax: typst
---

# Chapter 06 — Basic Statistics

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [05 - Correlation](/notes/studies-introduction-to-data-science-05---correlation) · Next: [07 - Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing)

> [!summary] Topic in one sentence
> Statistics organises, summarises, analyses and interprets numerical data; this topic moves from descriptive summaries to inferential tests.

## 1. Population, sample, parameter and statistic

### Population

A **population** is the collection of all possible data values/items in the field of study. It includes every element in the data set. A measurable characteristic of a population, such as its mean or standard deviation, is a **parameter**.

A population contains every unit relevant to the study question. A sample is a subset selected from that population.

### Sample

A **sample** is data collected or selected from a population by a defined procedure. A measurable characteristic of a sample is a **statistic**. **Sampling** is the process of selecting that subset.

![p003-population-sample](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p003-population-sample.jpg)


## 2. What statistics does

Statistics is the study and manipulation of data, including collecting, summarising, analysing and interpreting variable numerical data.

### Descriptive statistics

Descriptive statistics organises, represents and explains a data set with charts, graphs and summary measures. It describes the observed data without generalising beyond it.

### Inferential statistics

Inferential statistics uses probability to interpret collected data, test hypotheses, study correlations and predict population sizes. It makes conclusions beyond the immediately observed data.

| Descriptive statistics | Inferential statistics |
| --- | --- |
| Summarises the observed data set | Generalises from a sample to a population |
| Presents data meaningfully | Estimates parameters or tests hypotheses |
| Charts, tables and graphs | Confidence intervals, test statistics and models |
| Describes known observations | Quantifies uncertainty beyond the observed sample |
| Central tendency and spread | Hypothesis testing and analysis of variance |


## 3. Central tendency

Mean, median and mode are measures of central tendency. Variance, standard deviation and range are measures of dispersion.

### Mean

The mean is the arithmetic average: sum of the values divided by the number of values. It is a location parameter representing central tendency.

| Population mean | Sample mean |
| --- | --- |
| $mu = frac(sum_(i=1)^N x_i, N)$ | $bar(x) = frac(sum_(i=1)^n x_i, n)$ |
| $N$ = population size | $n$ = sample size |

In both formulas, $x_i$ is observation $i$. The symbols $mu$ and $bar(x)$ distinguish a population parameter from a sample statistic.

### Median

Sort values in ascending or descending order. The median is the middle value. With an odd number of values it is the single middle observation; with an even number it is the average of the two middle observations.

For an odd number of ordered observations, the median position is:

$$
"Median position" = frac(n + 1, 2)
$$

Here $n$ is the number of observations. For even $n$, average the values at positions $n/2$ and $n/2 + 1$.

### Mode

The mode is the most frequent value. It is useful for categorical data such as car models or favourite coffee.

- one mode: modal/unimodal;
- two modes: bimodal;
- three modes: trimodal;
- four or more: multimodal;
- no value repeated more than another: no mode.


## 4. Dispersion

### Range

Range is the largest value minus the smallest value. It is the simplest measure of variability and dispersion.

![p009-range](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p009-range.jpg)

### Variance

Variance measures how far values lie from the mean. For a population:

$$
sigma^2 = frac(1, N) sum_(i=1)^N (x_i - mu)^2
$$

For a sample:

$$
s^2 = frac(1, n - 1) sum_(i=1)^n (x_i - bar(x))^2
$$

Here $N$ is population size, $n$ is sample size, $mu$ is the population mean, $bar(x)$ is the sample mean, and $x_i$ is observation $i$. Population variance divides by $N$; sample variance uses $n - 1$ (Bessel's correction).

### Standard deviation

Standard deviation is the square root of variance and measures variability around the average. Larger dispersion means a larger standard deviation.

Population:

$$
sigma = sqrt(frac(1, N) sum_(i=1)^N (x_i - mu)^2)
$$

Sample:

$$
s = sqrt(frac(1, n - 1) sum_(i=1)^n (x_i - bar(x))^2)
$$

The symbols $sigma$ and $s$ denote population and sample standard deviation respectively.

![p011-standard-deviation](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p011-standard-deviation.jpg)

> [!warning] Population versus sample
> Use the population denominator when the full population is being described. Use the sample denominator n − 1 when estimating population variability from a sample.


## 5. Skewness

Skewness measures asymmetry. For unimodal distributions, the usual ordering is:

- normal: mean = median = mode;
- positive/right skew: mean > median > mode;
- negative/left skew: mode > median > mean.

![p012-normal-distribution-label](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p012-normal-distribution-label.jpg)

![p012-positive-skew](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p012-positive-skew.jpg)

![p012-negative-skew](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p012-negative-skew.jpg)

When the mode is clearly defined, Pearson's first coefficient is:

$$
S_k = frac(bar(x) - M_o, s)
$$

When mode is not well defined, Pearson’s second coefficient is:

$$
S_k = frac(3 (bar(x) - M_d), s)
$$

Here $S_k$ is the skewness coefficient, $bar(x)$ is the mean, $M_o$ is the mode, $M_d$ is the median, and $s$ is the standard deviation.

One common rule-of-thumb interpretation is:

| Coefficient | Interpretation |
| --- | --- |
| −0.5 to 0.5 | Nearly symmetrical |
| −1 to −0.5 | Moderately negatively skewed |
| 0.5 to 1 | Moderately positively skewed |
| Less than −1 | Highly negatively skewed |
| Greater than 1 | Highly positively skewed |

![p013-skewness](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p013-skewness.jpg)


## 6. Kurtosis

Kurtosis primarily describes tail heaviness and the tendency to produce extreme observations:

- high kurtosis: heavy tails/more outliers;
- low kurtosis: light tails/fewer outliers.

The three types are:

| Type | Pearson kurtosis β₂ | Excess kurtosis γ₂ | Shape |
| --- | ---: | ---: | --- |
| Mesokurtic | 3 | 0 | Normal |
| Leptokurtic | >3 | >0 | More peaked, thick tails, more outliers |
| Platykurtic | <3 | <0 | Flatter, fewer outliers |

Using central moments:

$$
beta_2 = frac(mu_4, mu_2^2)
$$

and excess kurtosis as:

$$
gamma_2 = beta_2 - 3
$$

Here $mu_2$ is the second central moment (population variance), $mu_4$ is the fourth central moment, $beta_2$ is Pearson kurtosis, and $gamma_2$ is excess kurtosis.

![p015-kurtosis-types](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p015-kurtosis-types.jpg)

> [!note] Two conventions
> Pearson kurtosis $beta_2$ is 3 for a normal distribution; excess kurtosis $gamma_2$ is 0. SciPy's default kurtosis uses the excess convention.


## 7. Python summary statistics

Python's `statistics` module provides mean, median, mode, sample standard deviation and sample variance. `scipy.stats` provides skewness and kurtosis.

```python
import statistics
from scipy.stats import kurtosis, skew

data = [1, 2, 23, 3, 6, 33, 32, 78, 23, 67]

print("The mean of the list is:", statistics.mean(data))
print("The median of the list is:", statistics.median(data))
print("The mode of the list is:", statistics.mode(data))
print("The standard deviation of the list is:", statistics.stdev(data))
print("The variance of the list is:", statistics.variance(data))
print("The skewness of the list is:", skew(data))
print("The excess kurtosis of the list is:", kurtosis(data))
```

Interpretation:

- statistics.stdev and statistics.variance use sample denominators.
- skew returns a skewness statistic; its sign indicates right/left asymmetry.
- scipy.stats.kurtosis defaults to Fisher/excess kurtosis, so zero corresponds to the mesokurtic normal reference.


## 8. Grouped data

### Grouped-data median

$$
M_d = l + frac(frac(n, 2) - C, f_m) h
$$

Here $M_d$ is the grouped median, $l$ is the lower class boundary of the median class, $n$ is total frequency, $C$ is cumulative frequency before the median class, $f_m$ is median-class frequency, and $h$ is class width.

### Grouped-data mode

$$
M_o = l + frac(f_1 - f_0, 2 f_1 - f_0 - f_2) h
$$

Here $M_o$ is the grouped mode, $l$ is the lower class boundary of the modal class, $h$ is class width, $f_1$ is modal-class frequency, $f_0$ is the preceding-class frequency, and $f_2$ is the succeeding-class frequency.

### Grouped-data mean

For grouped data, use class midpoints and frequencies:

```python
class_intervals = [(10, 20), (20, 30), (30, 40), (40, 50)]
frequencies = [5, 10, 15, 20]

midpoints = [(lower + upper) / 2 for lower, upper in class_intervals]
sum_fx = sum(midpoint * frequency
             for midpoint, frequency in zip(midpoints, frequencies))
total_frequency = sum(frequencies)
mean = sum_fx / total_frequency
print(mean)
```

The method approximates every observation in a class by its midpoint, then computes the weighted average. It is not the same as the raw-data mean when the original individual values are available.


## 9. Choosing an inferential test family

Statistical tests can be grouped into parametric and non-parametric families.

### Parametric tests

Parametric tests generally assume a particular distribution, often normality, and work with parameters such as mean and standard deviation.

| Parametric test | Typical use |
| --- | --- |
| t-test | Compare means |
| ANOVA | Compare means of three or more groups |
| Pearson correlation | Relationship between numerical variables |
| Linear regression | Model relationship between numerical variables |

### Non-parametric tests

Non-parametric tests do not require the same distributional assumptions. They are useful for ordinal/categorical, skewed or outlier-containing data, or when parametric assumptions are not reasonable.

| Non-parametric test | Rough counterpart/use |
| --- | --- |
| Mann–Whitney U | Alternative to independent t-test |
| Wilcoxon signed-rank | Alternative to paired t-test |
| Kruskal–Wallis | Alternative to one-way ANOVA |
| Spearman correlation | Rank-based alternative to Pearson correlation |
| Chi-square | Association between categorical variables |


## 10. Hypothesis-testing overview

The course presents hypothesis testing as using sample evidence to evaluate two mutually exclusive statements about population data. For more than two group means, it points to ANOVA.

A standard workflow is:

1. make an initial null-hypothesis assumption;
2. collect sample evidence;
3. analyse the evidence;
4. reject or fail to reject the null according to the statistic and significance threshold.

Think of H₀ as a default position that requires sufficient sample evidence before it is rejected. This is a decision rule, not a statement that H₀ has been assigned a probability of being true.

Use these selection rules:

- **z-test for a mean:** the population standard deviation is known and the sampling distribution is approximately normal;
- **t-test:** a mean is tested with an unknown population standard deviation; choose one-sample, paired or independent-samples according to the design;
- **chi-square test:** counts are arranged in categorical frequency tables and expected-count conditions are satisfied;
- **ANOVA:** compare three or more means, with a design-specific model and its assumptions.

Sample size alone does not determine the test. Also check independence, measurement scale, distributional assumptions and the study design.

![p023-hypothesis-testing-map](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p023-hypothesis-testing-map.jpg)

### P-value

The p-value is the probability, assuming H₀ is true, of obtaining a test statistic at least as extreme as the observed one. Reject H₀ when the p-value is below the preselected significance level $alpha$.

Do not interpret a p-value as the probability that H₀ is true.

![p027-p-value](/content-assets/studies/introduction-to-data-science/Assets/Topic%2006/p027-p-value.jpg)

### One-tailed and two-tailed tests

| Attribute | One-tailed | Two-tailed |
| --- | --- | --- |
| Alternative | Directional: > or < | Non-directional: ≠ |
| Rejection region | Left or right tail | Both tails |
| Significance level | Entire α in one tail | α split between tails |
| Result | Greater/less than a value | Outside a two-sided range |
| Mean comparison | Tests a specified direction | Tests difference in either direction |

Left-tailed means the parameter is believed to be lower; right-tailed means it is believed higher.


## 11. Study checklist

- Distinguish population parameters from sample statistics.
- State whether a summary is descriptive or inferential.
- Choose mean, median or mode based on the data and question.
- Keep population and sample denominators distinct.
- Interpret skew direction using the order of mean, median and mode.
- State whether kurtosis is Pearson β₂ or excess γ₂.
- Choose test families from the design and assumptions, not only from sample size.
- Interpret a p-value under H₀ and avoid calling it the probability that H₀ is true.

The calculations and worked hypothesis tests continue in [07 - Hypothesis Testing](/notes/studies-introduction-to-data-science-07---hypothesis-testing).

## 12. Question bank

### Questions from class material

The material introduces definitions and formulas rather than a separate exercise set. Practise them with these prompts:

1. Distinguish population, sample, parameter and statistic using one study of your choice.
2. For a numerical dataset, compute mean, median, mode, range, population variance, sample variance and standard deviation. Explain every denominator.
3. Determine the direction of skew from the relative positions of mean, median and mode.
4. Compute Pearson kurtosis $beta_2$ and excess kurtosis $gamma_2$, then classify the distribution.
5. For a grouped frequency table, calculate the mean, median and mode, identifying the median and modal classes.
6. Select a parametric or non-parametric test for a stated design and defend the choice using scale, independence and distributional assumptions.

### Extra practice

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
