---
title: "02 - Variability, Distributions, and Asymptotics"
math_syntax: typst
---

# 02 — Variability, Distributions, and Asymptotics

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


*Statistical Inference, Week 2*

This chapter deepens the study of random variables by examining how they vary, cataloguing the most important probability distributions, and introducing the asymptotic results — the Law of Large Numbers and the Central Limit Theorem — that make statistical inference possible.

---

## First, read the notation in words

A random observation is $X$; $X_i$ is observation $i$ in a sample of size $n$. The sample mean $bar(X)$ estimates the population mean $mu$. The population standard deviation $sigma$ describes individual observations, while the standard error describes how $bar(X)$ varies across repeated samples. Under independent sampling with finite variance, the standard deviation of $bar(X)$ is $sigma / sqrt(n)$.

> [!question] Try to recall
> Picture 100 people’s heights, then picture repeatedly taking groups of 100 and plotting each group average. Which histogram is narrower?

---

## Variability of data

Measures of spread quantify how dispersed data points are around their central value. The key measures are variance, standard deviation, and standard error.

Given data $X_1, X_2, dots.h, X_n$, the key measures of spread are:

### Variance

The sample variance $S^2$ measures the average squared deviation of observations from the sample mean $bar(X)$.

$$
S^2 = frac(1, n-1) sum_(i=1)^n (X_i - bar(X))^2
$$

Here $X_i$ is observation $i$, $bar(X)$ is their sample mean, and the sum includes all $n$ observations. Dividing by $n-1$ corrects the bias from estimating the mean on the same sample: for independent, identically distributed observations with finite variance, $S^2$ is unbiased for the population variance $sigma^2$. Its units are the square of the data's units.

### Standard deviation

The sample standard deviation $S$ is the square root of the sample variance, returning the measure of spread to the original data units.

$$
S = sqrt(S^2)
$$

For example, if $S^2 = 25$ minutes squared, then $S = 5$ minutes. The square root returns spread to the original units.

### Standard error of the mean

The standard error of the mean, $"SE"$, quantifies the variability of the sample mean $bar(X)$ as an estimator of the population mean $mu$.

$$
"SE"(bar(X)) = frac(S, sqrt(n))
$$

Here $S$ estimates the spread of individual observations and $n$ is the sample size. Under independent sampling, the standard error falls in proportion to $1/sqrt(n)$ as the sample grows.

### Quantiles and the empirical CDF

For any distribution, the $alpha$-quantile is the smallest $x_alpha$ with $F(x_alpha) >= alpha$. Equality $F(x_alpha)=alpha$ is guaranteed for a continuous, strictly increasing CDF. The empirical CDF of the observations is:

$$
hat(F)(x) = frac(1, n) sum_(i=1)^n I(X_i <= x)
$$

where $I(dot)$ is the indicator function. Quantiles of the empirical distribution provide non-parametric summaries of the data.

---

## The normal distribution

The **normal (Gaussian) distribution** $X tilde N(mu, sigma^2)$ is the most important continuous distribution. Its PDF is:

$$
f(x) = frac(1, sigma sqrt(2 pi)) exp(frac(-(x - mu)^2, 2 sigma^2))
$$

### Properties

- Symmetric about $mu$.
- Mean = median = mode = $mu$.
- Approximately 68% of the probability lies within $mu plus.minus sigma$; 95% within $mu plus.minus 2 sigma$; 99.7% within $mu plus.minus 3 sigma$ (the **68–95–99.7 rule**).

### Standard normal

Standardization converts a normal random variable to the standard normal distribution $Z = (X - mu) / sigma$.

If $X tilde N(mu, sigma^2)$, the **standardised** variable is:

$$
Z = frac(X - mu, sigma) tilde N(0, 1)
$$

Conversely, if $Z tilde N(0, 1)$, then $X = mu + sigma Z tilde N(mu, sigma^2)$.

### The $chi^2$ distribution

The chi-squared distribution arises from the sum of squares of independent standard normal variables.

If $Z_1, dots.h, Z_n$ are independent standard normals, then:

$$
Q = sum_(i=1)^n Z_i^2 tilde chi^2_n
$$

- Mean = $n$, variance = $2n$.
- As $n$ grows, the $chi^2_n$ distribution becomes approximately $N(n, 2n)$.

### The $t$ distribution

The $t$-distribution is used when estimating a population mean with an unknown population standard deviation.

If $Z tilde N(0, 1)$ and $V tilde chi^2_n$ are independent, then:

$$
T = frac(Z, sqrt(V slash n)) tilde t_n
$$

- The $t$-distribution has heavier tails than the normal, reflecting additional uncertainty from estimating $sigma$ with $S$.
- As $n -> infinity$, $t_n$ converges to $N(0, 1)$.

### The $F$ distribution

The $F$ distribution is derived from the ratio of two independent chi-squared variables divided by their degrees of freedom.

If $U tilde chi^2_{p_1}$ and $V tilde chi^2_{p_2}$ are independent, then:

$$
F = frac(U slash p_1, V slash p_2) tilde F_{p_1, p_2}
$$

Used extensively in ANOVA and regression model comparison.

---

## Other key distributions

### Binomial

$X tilde "Binom"(n, p)$: the number of successes in $n$ independent Bernoulli($p$) trials.

- PMF: $P(X = x) = binom(n, x) p^x (1-p)^{n-x}$ for $x = 0, 1, dots.h, n$.
- Mean = $n p$, variance = $n p (1 - p)$.
- Normal approximation: for large $n$, $X tilde approx N(n p, n p (1-p))$. A common rule of thumb is $n p > 10$ and $n (1-p) > 10$.

### Poisson

$X tilde "Poisson"(lambda)$: the count of rare events in a fixed interval.

- PMF: $P(X = x) = (lambda^x e^(-lambda)) slash x!$ for $x = 0, 1, 2, dots.h$.
- Mean = variance = $lambda$.
- Arises as the limit of Binomial($n$, $p$) when $n -> infinity$, $p -> 0$, with $n p = lambda$ fixed.

### Exponential

$X tilde "Exp"(lambda)$: the waiting time between events in a Poisson process.

- PDF: $f(x) = lambda e^(-lambda x)$ for $x >= 0$.
- Mean = $1 slash lambda$, variance = $1 slash lambda^2$.
- **Memoryless**: $P(X > s + t | X > s) = P(X > t)$.

### Gamma

$X tilde "Gamma"(alpha, beta)$: the waiting time for the $alpha$-th event.

- Generalises the exponential (Exponential = Gamma(1, $lambda$)).
- Mean = $alpha beta$, variance = $alpha beta^2$.

### Bernoulli

$X tilde "Bernoulli"(theta)$: a single success ($X = 1$) or failure ($X = 0$).

- Mean = $theta$, variance = $theta (1 - theta)$.

### Uniform

$X tilde "Unif"(a, b)$: equal probability over $[a, b]$.

- PDF: $f(x) = 1 slash (b - a)$.
- Mean = $(a + b) slash 2$, variance = $(b - a)^2 slash 12$.

---

## The Law of Large Numbers (LLN)

Let $X_1, X_2, dots.h$ be IID with mean $mu$. The **Strong Law of Large Numbers** states:

$$
P(lim_(n -> infinity) bar(X)_n = mu) = 1
$$

In words: the sample mean converges to the population mean as the sample size grows.

**Intuition**: random fluctuations cancel out when you average many observations. The LLN guarantees that our sample means are getting closer to the truth.

> **Important**: the LLN tells us about *convergence in probability* (or almost sure convergence). It does **not** tell us the *distribution* of $bar(X)$ at finite $n$ — that is the role of the CLT.

---

## The Central Limit Theorem (CLT)

The Central Limit Theorem (CLT) states that the distribution of the sample mean is approximately normal for large sample sizes, regardless of the population distribution.

Let $X_1, X_2, dots.h, X_n$ be IID with mean $mu$ and variance $sigma^2 < infinity$. Then as $n -> infinity$:

$$
frac(bar(X)_n - mu, sigma slash sqrt(n)) tilde approx N(0, 1)
$$

or equivalently:

$$
bar(X)_n tilde approx N(mu, sigma^2 slash n)
$$

### What the CLT says

- No matter what distribution the $X_i$ come from (provided finite mean and variance), the distribution of the **sample mean** approaches a normal distribution.
- The approximation improves as $n$ increases.
- The standard deviation of the limiting distribution is $sigma slash sqrt(n)$ — the **standard error**.

### Practical implications

- We can construct confidence intervals for $mu$ using the normal distribution even when the underlying data are not normal.
- The CLT is the reason the normal distribution appears so frequently in statistics.

> **Worked example.** Let $X_i tilde "Poisson"(0.5)$ with $mu = sigma^2 = 0.5$. For $n = 100$:
>
> $$
> bar(X) tilde approx N(0.5, 0.5 slash 100) = N(0.5, 0.005)
> $$
>
> $$
> P(bar(X) < 0.6) = P(Z < (0.6 - 0.5) slash sqrt(0.005)) = P(Z < 1.414) approx 0.921
> $$

### When does the CLT kick in?

- For symmetric distributions: $n >= 10$ may suffice.
- For moderately skewed distributions: $n >= 30$ is a common guideline.
- For heavily skewed or heavy-tailed distributions: $n$ may need to be much larger.

### The CLT is not exact

The CLT is an **approximation**. For small $n$ and non-normal populations, the approximation may be poor. Always check with simulation when possible.

---

## Sample mean distribution

Given $X_1, dots.h, X_n tilde" IID"(mu, sigma^2)$:

- $E[bar(X)] = mu$ (unbiased).
- $"Var"(bar(X)) = sigma^2 slash n$.
- By the CLT, $bar(X) tilde approx N(mu, sigma^2 slash n)$ for large $n$.

The fact that the variance of $bar(X)$ decreases as $1 slash n$ is why larger samples give more precise estimates.

---

## Simulation study

R is ideal for visualising the CLT. The following code demonstrates convergence to normality:

```r
# Set seed for reproducibility
set.seed(42)

# Generate 10000 sample means from Exponential(1) with n=40
sample_means <- replicate(10000, mean(rexp(40, rate = 1)))

# The true mean is 1, true variance is 1/40 = 0.025
# CLT prediction: bar(X) ~ approx N(1, 0.025)
par(mfrow = c(1, 2))
hist(sample_means, breaks = 50, prob = TRUE,
     main = "Distribution of sample means\n(Exponential, n=40)",
     xlab = "Sample mean")
curve(dnorm(x, mean = 1, sd = sqrt(0.025)),
      add = TRUE, col = "red", lwd = 2)

# Q-Q plot to assess normality
qqnorm(sample_means, main = "Q-Q plot of sample means")
qqline(sample_means, col = "red", lwd = 2)
```

- The histogram of sample means closely matches the normal density curve (red line).
- The Q-Q plot falls along the diagonal, confirming approximate normality.

---

## Common mistakes

1. **Confusing the LLN with the CLT.** The LLN says $bar(X) -> mu$; the CLT says the *distribution* of $bar(X)$ is approximately normal.
2. **Using the CLT for individual observations.** The CLT applies to *averages*, not to single data points.
3. **Assuming the CLT makes the data normal.** It only makes the *sample mean* approximately normal.
4. **Using $sigma$ when $sigma$ is unknown.** In practice, we substitute $S$ for $sigma$ and use the $t$-distribution (covered in Week 3).

---

## Revision checklist

- [ ] I can compute the standard error of the mean from sample data.
- [ ] I can state the 68–95–99.7 rule for the normal distribution.
- [ ] I can standardise a normal variable and find probabilities using the $Z$-table.
- [ ] I know the relationships between the normal, $chi^2$, $t$, and $F$ distributions.
- [ ] I can state the Law of Large Numbers and explain its meaning.
- [ ] I can state the Central Limit Theorem and explain its practical implications.
- [ ] I understand when the CLT approximation is reliable and when it breaks down.
- [ ] I can use R to simulate and visualise the CLT.
---

## Make it click: The CLT concerns a statistic across samples

**Work it through.** If individual observations have mean 50 and standard deviation 10, the average of 100 independent observations has mean 50 and standard error 10 / √100 = 1. An individual observation still has standard deviation 10. Imagine repeating the sample many times: the histogram of *sample means* narrows as sample size grows.

**See it.** Use the Confidence intervals tab with sample size 16, then 64. The same 1/√n mechanism narrows both the sampling distribution and a normal confidence interval. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#ci)

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q4 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q3/Q12/Q24 test which distribution is being described. Write “individual X” or “sample mean” beside each number before calculating.

> [!warning] Common trap
> The CLT does not assert that the original population becomes normal; it describes the distribution of standardized averages under its assumptions.
