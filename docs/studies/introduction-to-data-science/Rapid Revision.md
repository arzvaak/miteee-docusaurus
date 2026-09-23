---
title: "Rapid Revision"
math_syntax: typst
---

# Rapid Revision

Concise summary of every topic for quick pre-exam review. For detailed explanations, worked examples and practice, see the individual chapters.

---

## Chapter 01 — Foundations of Data Science

- **Data science** combines programming, statistics and domain knowledge to find patterns. **Data analytics** focuses more on answering defined questions.
- The data lifecycle: collect → clean → transform → analyse → visualise → decide.
- **ETL** (Extract, Transform, Load) merges data from multiple sources into a warehouse.
- **File loading:** `pd.read_csv()`, `pd.read_excel()`, `pd.read_json()`, `pd.read_html()`. PDF and ZIP need special handling.
- **Python ecosystem:** Pandas (tabular), NumPy (arrays), Matplotlib (plots), Scikit-learn (ML), TensorFlow/PyTorch (deep learning).

## Chapter 02 — Python Fundamentals

- **Indentation** defines blocks; a missing indent is a syntax error.
- **Types:** `int`, `float`, `complex`, `str`, `list` (mutable), `tuple` (immutable), `dict` (key-value), `set` (unique), `bool`, `None`.
- `=` assigns; `==` compares.
- **Sequences:** indexing starts at 0; `range(n)` produces $0, 1, \ldots, n-1$.
- **Loops:** `while condition:`, `for item in sequence:`.
- **Functions:** `def name(args):` ... `return value`. Use `*args` for variable positional arguments (received as a tuple).
- **Swap:** `x, y = y, x` evaluates the right side first.

## Chapter 03 — NumPy and Image Processing

- NumPy arrays are faster and more memory-efficient than Python lists for numerical work.
- **Key attributes:** `ndim`, `shape`, `size`, `itemsize`, `dtype`.
- **Reshape** keeps total elements constant: `a.reshape(new_shape)`.
- **Slicing:** `a[start:end:step]` — end is excluded.
- **Axis 0** = rows; **Axis 1** = columns.
- **Stacking:** `np.vstack()` (append rows), `np.hstack()` (append columns), `ravel()` (flatten).
- **Image = 3-D array:** shape is `(height, width, channels)`. Slicing flips/crops/thresholds.
- `np.where(condition, true_value, false_value)` applies elementwise.

## Chapter 04 — Pandas and Matplotlib

- **Series** = one column; **DataFrame** = table; **Panel** = deprecated (use MultiIndex DataFrame).
- `pd.read_csv()`, `pd.read_excel()`, `pd.read_json()`, `pd.read_html()`.
- **Line plot:** `plt.plot(x, y, label, color, linestyle, marker)`.
- **Bar chart:** `plt.bar(categories, values)`.
- **Scatter:** `plt.scatter(x, y, s, c, cmap, alpha)`.
- Always label axes, add a legend, and call `plt.show()` last.
- `plt.savefig()` before `plt.show()`.

## Chapter 05 — Correlation

- **Positive correlation:** variables move in the same direction; **negative:** opposite directions.
- **Linear:** constant change ratio (straight line); **non-linear:** changing ratio (curve).
- **Simple:** 2 variables; **partial:** 2 variables controlling others; **multiple:** 1 vs 2+ variables.
- **Pearson's $r$:** unit-free, ranges −1 to +1, measures linear association. Causation is not implied.
- **Spearman's $r_s$:** rank-based, suitable for ordinal data or outliers. Same range.
- **Interpretation guide:** $|r|$ < 0.2 very weak, 0.2–0.4 weak, 0.4–0.6 moderate, 0.6–0.8 strong, > 0.8 very strong.

## Chapter 06 — Basic Statistics

- **Population** = all items; **parameter** = population measure. **Sample** = subset; **statistic** = sample measure.
- **Central tendency:** mean (average), median (middle), mode (most frequent).
- **Dispersion:** range, variance, standard deviation. Use $N$ for population, $n-1$ for sample.
- **Skewness:** positive skew → mean > median > mode; negative skew → mode > median > mean.
- **Kurtosis:** Pearson $beta_2 = 3$ for normal; excess $gamma_2 = beta_2 - 3$. Leptokurtic = heavy tails; platykurtic = light tails.
- **Parametric tests** assume a distribution (usually normal); **non-parametric** tests do not.
- **Grouped data:** use class midpoints for mean; interpolation formulas for median and mode.

## Chapter 07 — Hypothesis Testing

- $H_0$ = default claim (no effect); $H_1$ = research hypothesis.
- **Reject** $H_0$ if $p <= alpha$; **fail to reject** otherwise. Never "accept" $H_0$.
- **Type I error:** reject true $H_0$ ($alpha$). **Type II error:** fail to reject false $H_0$ ($beta$). Power = $1 - beta$.
- **Chi-square:** $chi^2 = sum (O-E)^2/E$, df = $(r-1)(c-1)$. Tests association between categorical variables.
- **z-test:** population $sigma$ known. $z = (bar(x) - mu_0) / (sigma / sqrt(n))$.
- **t-test:** $sigma$ unknown. One-sample, paired or independent. Check df and test direction.
- **Pooled t:** equal variances assumed. **Welch t:** unequal variances (more robust).
- **One-way ANOVA:** compares $k$ means. $F = "MS"_B / "MS"_W$. Significant $F$ means at least one mean differs.

## Chapter 08 — Two-Way ANOVA (Later Material)

- Tests two factors and their interaction simultaneously.
- **Check the interaction first.** A significant interaction means main effects cannot be interpreted independently.
- $SS_T = SS_A + SS_B + SS_("AB") + SS_E$.
- Each F = effect MS / error MS. df: $A = a-1$, $B = b-1$, interaction = $(a-1)(b-1)$, error = $N - a b$.

---

> [!tip] Revision order
> 1. Read this page.
> 2. Skim the [Formula and Methods](/notes/studies-introduction-to-data-science-formula-and-methods) for any formula you cannot write from memory.
> 3. Attempt 2–3 questions from each chapter's question bank.
> 4. Re-read any chapter where you made errors.
