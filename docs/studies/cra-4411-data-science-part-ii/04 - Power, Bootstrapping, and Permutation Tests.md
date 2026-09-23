---
title: "04 - Power, Bootstrapping, and Permutation Tests"
math_syntax: typst
---

# 04 — Power, Bootstrapping, and Permutation Tests

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


*Statistical Inference, Week 4*

This chapter completes the statistical inference half of the course by deepening the concept of power, then introducing two resampling methods — bootstrapping and permutation tests — that provide inference without relying on parametric distributional assumptions.

---

## First, read the notation in words

$H_0$ names the null hypothesis and $H_1$ an alternative. The significance level $alpha$ is the probability of rejecting a true $H_0$; $beta$ is the probability of failing to reject $H_0$ under a specified alternative. Power is $1 - beta$. A bootstrap resamples observed rows with replacement; a permutation rearranges labels under a null hypothesis that makes those labels exchangeable.

> [!question] Try to recall
> Close the note and say which resampling method estimates uncertainty around an observed statistic, and which builds a null distribution.

---

## Power in depth

Recall that **power** = $1 - beta = P("reject" H_0 | H_0 "is false")$. Power analysis tells us how likely we are to detect a true effect.

### The power curve

The power curve plots power as a function of the true parameter value, showing how power changes with effect size.

For a fixed $alpha$ and sample size, power varies with the true parameter value. Plotting power against the true value of $mu$ (or the effect size) produces the **power curve**:

- At $mu = mu_0$ (the null), power = $alpha$.
- As the true $mu$ moves away from $mu_0$, power increases.
- The power curve is symmetric for two-sided tests.

### Sample size determination

The required sample size for a two-sided test is determined by the desired power, significance level, effect size, and variability, as given by the following formula.

For a one-sample, two-sided $z$-test, a normal-approximation to the sample size for target power $1 - beta$ at significance level $alpha$ is:

$$
n = frac((z_{1 - alpha slash 2} + z_{1 - beta})^2 sigma^2, delta^2)
$$

where $delta = |mu_1 - mu_0|$ is the minimum detectable effect and $sigma$ is the population standard deviation.

> **Worked example.** Detect $delta = 2$ units with 90% power at $alpha = 0.05$, assuming $sigma = 5$:
>
> $$
> n = frac((1.96 + 1.28)^2 times 25, 4) = frac(10.4976 times 25, 4) = frac(262.44, 4) = 65.6
> $$
>
> Round up to $n = 66$ observations for this one-sample approximation. A two-sample comparison needs a different sample-size calculation.

### Equivalence: power, sample size, effect size, and alpha

Power, sample size, effect size, and significance level are interrelated; fixing any three determines the fourth.

Any one of these four quantities is determined by the other three. This means:

- To **increase power**: increase $n$, increase $alpha$, or accept detection of a larger effect.
- To **detect a smaller effect**: you need a larger sample size.

### Sensitivity analysis

A sensitivity analysis examines how power varies across a range of possible effect sizes, helping to determine the detectable effect for a given study design.

In practice, the true $sigma$ and $delta$ are unknown. A **sensitivity analysis** examines how power changes across a range of plausible effect sizes:

```r
# Sensitivity analysis: power vs effect size
effect_sizes <- seq(0.5, 3.0, by = 0.25)
power_values <- sapply(effect_sizes, function(d) {
  power.t.test(n = 30, delta = d, sd = 5, sig.level = 0.05,
               type = "one.sample", alternative = "two.sided")$power
})
plot(effect_sizes, power_values, type = "l", lwd = 2,
     xlab = "True effect size (delta)", ylab = "Power",
     main = "Power curve (n=30, sigma=5, alpha=0.05)")
abline(h = 0.80, lty = 2, col = "red")
```

---

## Bootstrapping

**Bootstrapping** is a resampling method that estimates the sampling distribution of a statistic by repeatedly sampling **with replacement** from the observed data.

### The bootstrap principle

The bootstrap principle approximates the sampling distribution of a statistic by repeatedly resampling with replacement from the observed data.

1. From the original sample $X_1, dots.h, X_n$, draw a **bootstrap sample** $X_1^*, dots.h, X_n^*$ by sampling with replacement.
2. Compute the statistic of interest on the bootstrap sample: $theta^*$.
3. Repeat steps 1–2 a large number of times ($B$, typically 1000–10000).
4. The collection $theta_1^*, dots.h, theta_B^*$ approximates the sampling distribution of the statistic.

### Why it works

The bootstrap works because the empirical distribution approximates the true population distribution for large samples.

The empirical distribution $hat(F)$ (which places probability $1 slash n$ at each observed value) is a good approximation to the true population distribution $F$ when $n$ is large. Sampling from $hat(F)$ is equivalent to sampling with replacement from the data.

### Bootstrap confidence intervals

Bootstrap confidence intervals are constructed from the bootstrap distribution using methods such as the percentile method or the BCa method.

There are several methods; the most common are:

**Percentile method:** The $(alpha slash 2)$-th and $(1 - alpha slash 2)$-th quantiles of the bootstrap distribution form the "CI".

**BCa (bias-corrected and accelerated) method:** Adjusts the percentile method for bias and skewness. Generally preferred for its accuracy.

> **Worked example.** Estimate the median of a dataset and construct a 95% bootstrap "CI":
>
> ```r
> set.seed(123)
> data <- c(2.3, 3.1, 4.5, 2.8, 5.0, 3.7, 4.1, 3.3, 2.9, 4.8)
>
> # Bootstrap: 5000 resamples
> B <- 5000
> boot_medians <- replicate(B, median(sample(data, replace = TRUE)))
>
> # 95% percentile "CI"
> quantile(boot_medians, c(0.025, 0.975))
>
> # Original median
> median(data)
> ```
>
> The bootstrap "CI" provides an interval estimate for the population median without assuming any particular distribution.

### When to bootstrap

- When the sampling distribution of a statistic is hard to derive analytically.
- When the statistic is not a simple mean (e.g., median, ratio, quantile).
- When you want distribution-free inference.

### Limitations

Bootstrapping has several limitations, including the need for a representative sample and poor performance with non-smooth statistics or very small samples.

- Bootstrap requires the sample to be **representative** of the population. Biased samples produce biased bootstrap distributions.
- It does not work well for statistics that are not **smooth** (e.g., the maximum of the data).
- Very small samples ($n < 10$) may produce unreliable bootstrap CIs.

---

## Permutation tests

A **permutation test** assesses whether two groups come from the same distribution by examining how extreme the observed difference is relative to all possible reassignments of group labels.

### Procedure

The permutation test involves computing the observed test statistic, then randomly permuting group labels and recalculating the statistic many times to approximate the null distribution.

1. Compute the observed test statistic: $T_"obs" = bar(X)_1 - bar(X)_2$ (or any other measure of difference).
2. Pool all data together and randomly assign labels ("group 1" or "group 2") while preserving group sizes.
3. Compute the test statistic on the permuted data: $T^*$.
4. Repeat steps 2–3 many times ($B$ permutations).
5. The p-value is the fraction of permuted statistics at least as extreme as $T_"obs"$:

$$
"p-value" = frac(1, B) sum_(b=1)^B I(|T_b^*| >= |T_"obs"|)
$$

### Why it works

The permutation test works because under the null hypothesis, group labels are arbitrary, so permuting them yields the exact null distribution.

Under $H_0$ (the groups come from the same distribution), the group labels are arbitrary. So reassigning labels produces datasets that are equally likely under $H_0$. The distribution of $T^*$ across all permutations is the exact null distribution.

### Advantages

- **Exact**: no distributional assumptions are needed.
- **Intuitive**: the logic is straightforward — "how unusual is our result if labels don't matter?"
- Works for any test statistic, not just the mean.

> **Worked example.** Compare insect spray counts for sprays B and C:
>
> ```r
> data(InsectSprays)
> subdata <- InsectSprays[InsectSprays$spray %in% c("B", "C"), ]
> y <- subdata$count
> group <- as.character(subdata$spray)
>
> # Observed difference in means
> testStat <- function(w, g) mean(w[g == "B"]) - mean(w[g == "C"])
> observedStat <- testStat(y, group)
>
> # Permutation test: 10000 random label assignments
> permutations <- replicate(10000, testStat(y, sample(group)))
>
> # p-value
> mean(abs(permutations) >= abs(observedStat))
>
> # Visualise the null distribution
> hist(permutations, breaks = 30, col = "lightblue",
>      main = "Permutation distribution",
>      xlab = "Mean difference (B - C)")
> abline(v = observedStat, col = "red", lwd = 2)
> ```
>
> If the observed difference falls far from the centre of the permutation distribution, we reject $H_0$.

### Permutation test vs $t$-test

- The $t$-test assumes normality; the permutation test does not.
- For small samples from non-normal populations, the permutation test can be more reliable.
- When the $t$-test assumptions hold, the $t$-test is slightly more powerful.

---

## Comparing resampling methods

The bootstrap and permutation test are resampling methods with different purposes: the bootstrap estimates sampling distributions and constructs confidence intervals, while the permutation test tests a specific hypothesis.

| Feature | Bootstrap | Permutation test |
| --- | --- | --- |
| Purpose | Estimate sampling distribution / CI | Test a specific hypothesis |
| Resampling method | With replacement | Without replacement (reassign labels) |
| Assumes $H_0$? | No | Yes |
| Produces CI? | Yes | No (produces a p-value) |
| Requires exchangeability? | No | Yes (groups must be interchangeable under $H_0$) |

---

## Simulation-based inference

Both bootstrapping and permutation tests are examples of **simulation-based inference**: instead of deriving formulas, we use computation to approximate the answer. This approach:

- Works for any statistic (mean, median, variance, ratio, etc.).
- Avoids distributional assumptions.
- Scales to complex problems.
- Requires careful attention to the resampling scheme.

### Common simulation pitfalls

1. **Not setting the seed.** Results will differ across runs; set `set.seed()` for reproducibility.
2. **Too few resamples.** Use at least 1000; 10000 is preferred for stable CI boundaries.
3. **Resampling from the wrong population.** Bootstrap resamples from the data; permutation resamples from the pooled data.
4. **Ignoring the structure of the data.** For clustered or hierarchical data, resample at the correct level.

---

## Common mistakes

1. **Using bootstrap for hypothesis testing.** Bootstrap estimates sampling distributions; permutation tests are for testing. (You can build a test from a bootstrap CI, but it is not the primary use.)
2. **Thinking the p-value from a permutation test is exact.** It is exact only if you enumerate all permutations. With a random subset of permutations, it is an approximation.
3. **Forgetting that bootstrap CIs assume the sample is representative.** A biased sample gives a biased bootstrap distribution.
4. **Running too few resamples.** The variability of the bootstrap estimate or p-value should be negligible — use enough resamples.

---

## Revision checklist

- [ ] I can perform a power analysis to determine sample size.
- [ ] I can explain the bootstrap principle and when it applies.
- [ ] I can construct a bootstrap confidence interval.
- [ ] I can carry out a permutation test and interpret the result.
- [ ] I understand when bootstrap vs permutation tests are appropriate.
- [ ] I know the limitations of resampling methods.
---

## Make it click: Resampling has two different questions

**Work it through.** Take two observed groups A = [2, 4, 6] and B = [5, 7, 9]. Their sample mean difference is 3. A bootstrap draws three values *with replacement within each group* to show sampling variation around that estimate. A permutation test pools all six observations and redistributes three labels to show differences compatible with no group effect.

**See it.** Draw one bootstrap sample on paper, then one shuffled-label permutation. Ask whether the procedure preserves the original group distinction. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html)

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q10/Q11 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q8/Q9/Q16/Q28 distinguish power, bootstrap uncertainty, and a permutation null distribution.

> [!warning] Common trap
> Power is the chance of rejecting a false null under a specified alternative. It is not the probability that the null is false after seeing data.
