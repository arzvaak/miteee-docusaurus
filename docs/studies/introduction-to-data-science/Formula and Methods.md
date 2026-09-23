---
title: "Formula and Methods"
math_syntax: typst
---

# Formula and Methods

Quick reference for every formula, test and method used in this course. For full derivations and worked examples, see the relevant chapter.

## NumPy and arrays

| Concept | Formula / Method | Chapter |
| --- | --- | --- |
| Array rank | `a.ndim` — number of axes | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Array shape | `a.shape` — tuple of axis lengths | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Array size | `a.size` — total element count | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Element size | `a.itemsize` — bytes per element | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Reshape | `a.reshape(new_shape)` — total elements must stay the same | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Linear spacing | `np.linspace(start, stop, num)` — includes endpoints | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Random integers | `np.random.randint(low, high, size)` — high is exclusive | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Axis 0 | rows (combine down columns) | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |
| Axis 1 | columns (combine across rows) | [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing) |

## Pandas

| Concept | Method | Chapter |
| --- | --- | --- |
| Read CSV | `pd.read_csv(path)` | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |
| Read Excel | `pd.read_excel(path)` | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |
| Read JSON | `pd.read_json(path)` | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |
| Read HTML tables | `pd.read_html(url)` — returns list of DataFrames | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |
| DataFrame column sum | `df.sum(axis=0)` | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |
| DataFrame row sum | `df.sum(axis=1)` | [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib) |

## Matplotlib

| Plot type | Function | Key parameters |
| --- | --- | --- |
| Line | `plt.plot(x, y)` | `color`, `linestyle`, `linewidth`, `marker`, `label` |
| Bar | `plt.bar(x, y)` | `color`, `hatch` |
| Scatter | `plt.scatter(x, y)` | `s` (size), `c` (colour), `cmap`, `alpha`, `edgecolors` |
| Histogram | `plt.hist(data, bins)` | `edgecolor` |
| Colour bar | `plt.colorbar()` | `label` |
| Show | `plt.show()` | — |
| Save | `plt.savefig(path, dpi)` | call before `show()` |

## Correlation

| Measure | Formula | Use |
| --- | --- | --- |
| Pearson's $r$ | $r = frac(sum (x_i - bar(x))(y_i - bar(y)), (n - 1) s_x s_y)$ | Linear association between two continuous variables |
| Spearman's $r_s$ | $r_s = 1 - frac(6 sum d_i^2, n(n^2 - 1))$ | Monotonic association; ordinal data or outliers |
| Coefficient of determination | $r^2$ | Proportion of variance linearly associated |
| Descriptive guide | $\|r\|$: 0.00–0.19 very weak, 0.20–0.39 weak, 0.40–0.59 moderate, 0.60–0.79 strong, 0.80–1.00 very strong | Context-dependent |

## Descriptive statistics

| Measure | Formula | Notes |
| --- | --- | --- |
| Population mean | $mu = frac(sum x_i, N)$ | $N$ = population size |
| Sample mean | $bar(x) = frac(sum x_i, n)$ | $n$ = sample size |
| Median position | $frac(n + 1, 2)$ for odd $n$ | For even $n$, average positions $n/2$ and $n/2 + 1$ |
| Mode | Most frequent value | May be none, uni-, bi-, or multimodal |
| Range | $x_(max) - x_(min)$ | Simplest dispersion measure |
| Population variance | $sigma^2 = frac(sum (x_i - mu)^2, N)$ | Divides by $N$ |
| Sample variance | $s^2 = frac(sum (x_i - bar(x))^2, n - 1)$ | Bessel's correction: divides by $n - 1$ |
| Population std dev | $sigma = sqrt(sigma^2)$ | |
| Sample std dev | $s = sqrt(s^2)$ | |
| Coefficient of variation | $"CV" = frac(s, bar(x)) times 100%$ | Relative dispersion; lower = more consistent |
| Weighted mean | $bar(x)_w = frac(sum w_i x_i, sum w_i)$ | $w_i$ = weight for observation $i$ |
| Combined mean | $bar(x)_c = frac(n_1 bar(x)_1 + n_2 bar(x)_2, n_1 + n_2)$ | For two groups |

### Skewness

| Measure | Formula | Interpretation |
| --- | --- | --- |
| Pearson first | $S_k = frac(bar(x) - M_o, s)$ | When mode is well defined |
| Pearson second | $S_k = frac(3(bar(x) - M_d), s)$ | When mode is not well defined |
| Interpretation | −0.5 to 0.5 nearly symmetrical; outside = skewed | Positive: mean > median > mode; Negative: mode > median > mean |

### Kurtosis

| Measure | Formula | Interpretation |
| --- | --- | --- |
| Pearson kurtosis | $beta_2 = frac(mu_4, mu_2^2)$ | 3 = mesokurtic (normal) |
| Excess kurtosis | $gamma_2 = beta_2 - 3$ | 0 = mesokurtic |
| Leptokurtic | $beta_2 > 3$ | Heavy tails, more outliers |
| Platykurtic | $beta_2 < 3$ | Light tails, fewer outliers |

### Grouped data

| Measure | Formula |
| --- | --- |
| Grouped mean | $frac(sum f_i m_i, sum f_i)$ where $m_i$ = class midpoint |
| Grouped median | $l + frac(frac(n, 2) - C, f_m) h$ |
| Grouped mode | $l + frac(f_1 - f_0, 2 f_1 - f_0 - f_2) h$ |

Here $l$ = lower boundary of the class, $C$ = cumulative frequency before the class, $f_m$ = median-class frequency, $f_1$ = modal-class frequency, $f_0$ = preceding-class frequency, $f_2$ = succeeding-class frequency, $h$ = class width.

## Hypothesis testing workflow

1. State $H_0$ and $H_1$.
2. Choose significance level $alpha$ (commonly 0.05).
3. Select the appropriate test.
4. Compute the test statistic and p-value (or compare with the critical value).
5. Decide: reject $H_0$ if $p <= alpha$; otherwise fail to reject $H_0$.
6. State the conclusion in context.

### Test selection guide

| Design | Test | Key assumption |
| --- | --- | --- |
| Categorical counts in a contingency table | Chi-square test of association | Expected counts ≥ 5 |
| Mean, population $sigma$ known | One-sample z-test | Normal sampling distribution |
| Two independent means, population $sigma$ known | Two-sample z-test | Normal sampling distribution |
| Proportion, large sample | One-proportion z-test | $n p_0 >= 5$ and $n(1 - p_0) >= 5$ |
| One sample mean, $sigma$ unknown | One-sample t-test | Approximately normal data |
| Paired before/after | Paired t-test | Differences approximately normal |
| Two independent means, $sigma$ unknown | Independent-samples t-test | Approximately normal; check variance equality |

### t-test formulas

| Test | Statistic | df |
| --- | --- | --- |
| One-sample | $t = frac(bar(x) - mu_0, s / sqrt(n))$ | $n - 1$ |
| Paired | $t = frac(bar(d), s_d / sqrt(n))$ | $n - 1$ pairs |
| Independent (pooled) | $t = frac(bar(x)_1 - bar(x)_2, s_p sqrt(1/n_1 + 1/n_2))$ | $n_1 + n_2 - 2$ |
| Independent (Welch) | $t = frac(bar(x)_1 - bar(x)_2, sqrt(s_1^2/n_1 + s_2^2/n_2))$ | Welch–Satterthwaite |

Pooled variance: $s_p^2 = frac((n_1 - 1) s_1^2 + (n_2 - 1) s_2^2, n_1 + n_2 - 2)$.

Welch df: $frac((s_1^2/n_1 + s_2^2/n_2)^2, (s_1^2/n_1)^2/(n_1 - 1) + (s_2^2/n_2)^2/(n_2 - 1))$.

### Chi-square test

$$
chi^2 = sum frac((O - E)^2, E) quad "df" = (r - 1)(c - 1)
$$

Expected frequency: $E = frac("row total" times "column total", "grand total")$.

### One-way ANOVA

| Source | SS | df | MS | F |
| --- | --- | --- | --- | --- |
| Between groups | $SS_B = sum n_j (bar(x)_j - bar(x))^2$ | $k - 1$ | $"MS"_B = SS_B / (k - 1)$ | $F = "MS"_B / "MS"_W$ |
| Within groups | $SS_W = sum sum (x_(i j) - bar(x)_j)^2$ | $N - k$ | $"MS"_W = SS_W / (N - k)$ | |
| Total | $SS_T = SS_B + SS_W$ | $N - 1$ | | |

Here $k$ = number of groups, $N$ = total observations, $n_j$ = group size, $bar(x)_j$ = group mean, $bar(x)$ = grand mean.

### Two-way ANOVA (later material)

$$
SS_T = SS_A + SS_B + SS_("AB") + SS_E
$$

| Source | df |
| --- | --- |
| Factor A | $a - 1$ |
| Factor B | $b - 1$ |
| Interaction A×B | $(a - 1)(b - 1)$ |
| Error | $N - a b$ |
| Total | $N - 1$ |

Each F statistic is its effect MS divided by the error MS. Check the interaction before interpreting main effects.

## Decision rules and errors

| Decision | $H_0$ true | $H_0$ false |
| --- | --- | --- |
| Reject $H_0$ | Type I error ($alpha$) | Correct (power = $1 - beta$) |
| Fail to reject $H_0$ | Correct | Type II error ($beta$) |

- **Two-sided** alternative: $H_1: mu != mu_0$; reject for large $|z|$ or $|t|$.
- **Right-sided** alternative: $H_1: mu > mu_0$; reject for large positive values.
- **Left-sided** alternative: $H_1: mu < mu_0$; reject for large negative values.
