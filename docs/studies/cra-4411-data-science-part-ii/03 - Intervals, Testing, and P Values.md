---
title: "03 - Intervals, Testing, and P Values"
math_syntax: typst
---

# 03 — Intervals, Testing, and P Values

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


*Statistical Inference, Week 3*

This chapter introduces the two core tools of frequentist inference: confidence intervals and hypothesis tests. Both rely on the sampling distribution of a statistic — usually $bar(X)$ — and the distributional results from Chapter 2.

---

## First, read the notation in words

$mu$ is the fixed but unknown population mean; $bar(X)$ is the mean computed from a sample. $sigma$ is the population standard deviation, and $S$ estimates it from the sample. The chosen Type I error rate is $alpha$, often 0.05. A $1 - alpha$ confidence procedure covers the fixed $mu$ at that rate across repeated samples under its assumptions.

> [!question] Try to recall
> Before reading any interval formula, point to its center, critical multiplier and standard error. Explain each in one sentence.

---

## Confidence intervals

A **confidence interval** (CI) is an interval of plausible values for an unknown population parameter, constructed so that a stated percentage of such intervals would contain the true parameter if the procedure were repeated indefinitely.

### CI for a normal mean (known variance)

If $X_1, dots.h, X_n tilde" IID" N(mu, sigma^2)$ with $sigma$ known, a $(1 - alpha) times 100%$ CI for $mu$ is:

$$
bar(X) plus.minus z_{1 - alpha slash 2} frac(sigma, sqrt(n))
$$

The center is the sample mean $bar(X)$. The standard error $sigma/sqrt(n)$ describes its sample-to-sample variation, and $z_{1 - alpha slash 2}$ is the corresponding standard-normal critical value. For 95% confidence, this multiplier is about 1.96. The resulting interval varies from sample to sample; the unknown $mu$ is fixed.

- For a 95% CI: $z_{0.975} = 1.96$.
- The margin of error is $z_{1 - alpha slash 2} sigma slash sqrt(n)$.

### CI for a normal mean (unknown variance)

When $sigma$ is unknown, we substitute the sample standard deviation $S$ and use the $t$-distribution:

$$
bar(X) plus.minus t_{n-1, 1 - alpha slash 2} frac(S, sqrt(n))
$$

where $t_{n-1, 1 - alpha slash 2}$ is the $(1 - alpha slash 2)$-quantile of the $t$-distribution with $n - 1$ degrees of freedom.

> **Worked example.** A sample of $n = 16$ has $bar(X) = 50$ and $S = 8$. Construct a 95% CI for $mu$:
>
> $$
> 50 plus.minus t_{15, 0.975} times frac(8, sqrt(16)) = 50 plus.minus 2.131 times 2 = 50 plus.minus 4.262
> $$
>
> The 95% CI is $(45.74, 54.26)$.

### What a CI does not mean

- A 95% CI does **not** mean there is a 95% probability that $mu$ lies in this specific interval.
- The parameter $mu$ is fixed; it is the **interval** that varies across samples.
- "95% confidence" means: if we repeated the sampling procedure many times, about 95% of the resulting intervals would contain $mu$.

### Factors affecting CI width

- **Larger $n$** → narrower interval (SE decreases).
- **Larger $sigma$ or $S$** → wider interval.
- **Higher confidence** ($1 - alpha$ larger) → wider interval.

---

## Hypothesis testing

A **hypothesis test** is a formal procedure for deciding whether the data provide enough evidence against a default claim.

### Terminology

- **Null hypothesis** ($H_0$): the default position (e.g., "the treatment has no effect", "$mu = mu_0$").
- **Alternative hypothesis** ($H_a$): the claim we are trying to establish.
- **Test statistic**: a function of the data that summarises evidence against $H_0$.
- **Rejection region**: the set of values of the test statistic that lead to rejecting $H_0$.
- **Significance level** ($alpha$): the maximum probability of rejecting $H_0$ when it is true (Type I error rate).

### The testing framework

1. State $H_0$ and $H_a$.
2. Choose a significance level $alpha$ (commonly 0.05).
3. Compute the test statistic under $H_0$.
4. Determine the p-value or compare the test statistic to a critical value.
5. Make a decision: reject $H_0$ if the p-value $< alpha$.

### Types of errors

| Decision | $H_0$ true | $H_0$ false |
| --- | --- | --- |
| Reject $H_0$ | Type I error ($alpha$) | Correct (power = $1 - beta$) |
| Fail to reject $H_0$ | Correct | Type II error ($beta$) |

---

## The $z$-test

When $sigma$ is known and the data are normal (or $n$ is large), the test statistic for $H_0: mu = mu_0$ is:

$$
Z = frac(bar(X) - mu_0, sigma slash sqrt(n))
$$

Under $H_0$, $Z tilde N(0, 1)$.

> **Worked example.** A factory claims $mu = 500$g. A sample of $n = 36$ gives $bar(X) = 505$g with $sigma = 30$g. Test at $alpha = 0.05$.
>
> - $H_0: mu = 500$, $H_a: mu != 500$ (two-sided).
> - $Z = (505 - 500) slash (30 slash sqrt(36)) = 5 slash 5 = 1.00$.
> - Critical values: $plus.minus 1.96$.
> - Decision: $|Z| = 1.00 < 1.96$, so fail to reject $H_0$.

---

## The $t$-test

When $sigma$ is unknown (the realistic case), we use $S$ in place of $sigma$:

$$
T = frac(bar(X) - mu_0, S slash sqrt(n))
$$

Under $H_0$, $T tilde t_{n-1}$.

### One-sample $t$-test

A one-sample $t$-test compares the sample mean to a hypothesized population mean $mu_0$.

Tests $H_0: mu = mu_0$ against $H_a: mu != mu_0$ (two-sided), or $H_a: mu > mu_0$ / $H_a: mu < mu_0$ (one-sided).

### Two-sample $t$-test

A two-sample $t$-test compares the means of two independent populations, $mu_1$ and $mu_2$.

Tests $H_0: mu_1 = mu_2$ using:

$$
T = frac(bar(X)_1 - bar(X)_2, sqrt(S_1^2 slash n_1 + S_2^2 slash n_2))
$$

The degrees of freedom are approximated by the Welch–Satterthwaite formula (used by default in R's `t.test()`).

### Paired $t$-test

When data come in matched pairs (before/after), compute the differences $D_i = X_{1i} - X_{2i}$ and perform a one-sample $t$-test on $D_1, dots.h, D_n$.

---

## P-values

The **p-value** is the probability, computed under $H_0$, of obtaining a test statistic as extreme as or more extreme than the one observed.

- Small p-value → strong evidence against $H_0$.
- The p-value is **not** the probability that $H_0$ is true.

### Interpreting p-values

| P-value | Interpretation |
| --- | --- |
| $p < 0.01$ | Very strong evidence against $H_0$ |
| $0.01 <= p < 0.05$ | Strong evidence against $H_0$ |
| $0.05 <= p < 0.10$ | Weak evidence against $H_0$ |
| $p >= 0.10$ | Little or no evidence against $H_0$ |

### P-value for a two-sided test

For a two-sided test with a symmetric reference distribution, the p-value is twice the probability of observing a test statistic as extreme as the absolute value of the observed statistic.

If the test statistic is $T$ and the reference distribution is symmetric (normal or $t$):

$$
"p-value" = 2 times P(T >= |T_"observed"|)
$$

### The p-value and the significance level

The p-value is compared to the pre-specified significance level $alpha$ to make a decision in hypothesis testing.

- Reject $H_0$ if p-value $< alpha$.
- Failing to reject $H_0$ does **not** prove $H_0$ is true — it merely means the evidence is insufficient.

---

## Power

Power is the probability of correctly rejecting a false null hypothesis. The required sample size for a desired power is given by the formula in the worked example.

**Power** = $1 - beta = P("reject" H_0 | H_0 "is false")$.

Power depends on:

1. **Sample size** ($n$): larger $n$ → higher power.
2. **Effect size**: larger true difference from $H_0$ → higher power.
3. **Significance level** ($alpha$): larger $alpha$ → higher power (but more Type I errors).
4. **Variability** ($sigma$): smaller $sigma$ → higher power.

> **Worked example.** To detect a shift of $delta = 0.5 sigma$ with 80% power at $alpha = 0.05$ (two-sided):
>
> $$
> n = frac((z_{1 - alpha slash 2} + z_{1 - beta})^2 sigma^2, delta^2) = frac((1.96 + 0.84)^2 sigma^2, (0.5 sigma)^2) = frac(7.84, 0.25) approx 31.4
> $$
>
> So $n >= 32$ per group is needed.

In R:

```r
# Power calculation for a one-sample t-test
# True mean = 51, H0: mu = 50, sigma = 10, n = 25
power.t.test(n = 25, delta = 1, sd = 10, sig.level = 0.05,
             type = "one.sample", alternative = "two.sided")
```

---

## Diagnostic tests (application of Bayes' rule)

Bayes' rule is used to compute the positive predictive value (PPV) of a diagnostic test, which depends on sensitivity, specificity, and prevalence.

A common application of hypothesis testing and Bayes' rule is in diagnostic medicine.

Let $D$ = disease present, $D^c$ = disease absent, $+$ = positive test, $-$ = negative test.

- **Sensitivity** = $P(+ | D)$ — the true positive rate.
- **Specificity** = $P(- | D^c)$ — the true negative rate.
- **Positive predictive value (PPV)** = $P(D | +)$ — how likely the disease is given a positive test.
- **Negative predictive value (NPV)** = $P(D^c | -)$ — how likely health is given a negative test.
- **Prevalence** = $P(D)$ — marginal probability of disease.

By Bayes' theorem:

$$
P(D | +) = frac(P(+ | D) P(D), P(+ | D) P(D) + P(+ | D^c) P(D^c))
$$

> **Worked example.** Sensitivity = 99.7%, specificity = 98.5%, prevalence = 0.1%.
>
> $$
> P(D | +) = frac(0.997 times 0.001, 0.997 times 0.001 + 0.015 times 0.999) = frac(0.000997, 0.015982) approx 0.062
> $$
>
> The PPV is only 6.2% — a positive test is much more likely to be a false positive than a true positive when prevalence is very low.

### Likelihood ratios

Likelihood ratios quantify the diagnostic value of a test. The positive and negative likelihood ratios are defined in terms of sensitivity and specificity.

- **Positive likelihood ratio**: $"LR"_+ = P(+ | D) slash P(+ | D^c) = "sensitivity" slash (1 - "specificity")$.
- **Negative likelihood ratio**: $"LR"_- = P(- | D) slash P(- | D^c) = (1 - "sensitivity") slash "specificity"$.

These ratios quantify how much a test result shifts the odds.

---

## Key R functions

| Function | Purpose |
| --- | --- |
| `t.test(x, mu = 0)` | One-sample $t$-test |
| `t.test(x, y)` | Two-sample $t$-test (Welch by default) |
| `t.test(x, y, paired = TRUE)` | Paired $t$-test |
| `prop.test(x, n, p = 0.5)` | Test for a proportion |
| `power.t.test(n, delta, sd)` | Power calculations |

---

## Common mistakes

1. **Confusing statistical significance with practical significance.** A tiny effect can be significant with a large enough $n$.
2. **Misinterpreting the p-value.** $P(H_0 | "data")$ is **not** the p-value.
3. **"Accepting" $H_0$.** We never accept the null; we only fail to reject it.
4. **Ignoring assumptions.** Normality, independence, and equal variance must hold for the $t$-test to be valid.
5. **Forgetting to set $alpha$ before looking at the data.** Choosing $alpha$ after seeing the p-value is data dredging.

---

## Revision checklist

- [ ] I can construct and interpret a confidence interval for a population mean.
- [ ] I understand the difference between a confidence interval and a probability statement.
- [ ] I can perform one-sample and two-sample $t$-tests.
- [ ] I can compute and interpret a p-value.
- [ ] I know the definitions of Type I error, Type II error, and power.
- [ ] I can explain how sample size, effect size, $alpha$, and variability affect power.
- [ ] I can apply Bayes' rule to diagnostic test problems.
---

## Make it click: Read an interval as a repeatable procedure

**Work it through.** A 95% interval from a sample of 16 has center 50, known population standard deviation 8, and normal margin 1.96 × 8 / √16 = 3.92. The interval is 46.08 to 53.92. If the sample size rises to 64 with the same center, the margin halves to 1.96.

**See it.** In the Confidence intervals tab, redraw 16 intervals. Watch the fixed mean stay still while sample intervals move. Increase confidence and see intervals widen. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#ci)

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q7/Q9 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q4/Q13/Q21 target interval width and interpretation. For Q4, compare standard errors before computing endpoints.

> [!warning] Common trap
> For one realized interval, the parameter is fixed. “95%” is the long-run coverage rate of the method, not a probability attached to that fixed parameter.
