---
title: "01 - Probability and Expected Values"
math_syntax: typst
---

# 01 — Probability and Expected Values

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.

Statistical inference is the process of drawing conclusions about a population from a sample. Before we can infer anything, we need the language of probability and the tools that describe random quantities. This chapter builds that foundation from scratch.

---

## First, read the notation in words

Think of a random variable as a number you do not know yet. $X$ names that number; an observed result is a particular value of $X$. $P(A)$ means the chance that event $A$ occurs. $P(A | B)$ means the chance of $A$ **among cases where $B$ already happened**. The bar is read “given,” not division. $E[X]$ is the long-run probability-weighted average, which need not be one of the outcomes. $mu$ (μ) names the population mean; $sigma$ (σ) names the population standard deviation. These are properties of the population model, not the small sample in hand.

> [!question] Try to recall
> Say aloud: “probability of disease given positive test.” Then reverse the condition. Would you expect the two numbers to match? Usually they do not.

---

## What is statistical inference?

**Statistical inference** = generating conclusions about a population from a noisy sample.

- The **goal** is to extend results beyond the data in hand to the wider population.
- A **statistic** is any number computed from a sample; statistics are used to infer population properties.
- A **random variable** is the numeric outcome of an experiment. Applying deterministic operations (like the mean or variance) to random variables produces new random variables with their own distributions.

There are two broad paradigms of inference:

- **Frequentist**: the probability of an event is its long-run relative frequency across repeated, independent, identically distributed experiments. This course is frequentist in orientation.
- **Bayesian**: the probability estimate for a hypothesis is updated as additional evidence is acquired.

---

## Probability

**Probability** is the study of quantifying the likelihood of particular events. Given a random experiment, probability is a population quantity that summarises the randomness — it is not a property of the data at hand but a conceptual quantity we want to estimate.

### Kolmogorov axioms

The axioms of probability, discovered by Andrey Kolmogorov, form the foundational rules for any probability model. Let $Omega$ be the **sample space** (the set of all possible outcomes) and $P(E)$ denote the **probability** of an event $E$ (a subset of $Omega$). The axioms state:

1. $P(E) >= 0$ for any event $E$.
2. $P(Omega) = 1$ (some outcome in the sample space occurs).
3. For any countable collection of disjoint events, the probability of their union is the sum of their probabilities. For two **mutually exclusive** events $A$ and $B$, this gives:

$$
P(A union B) = P(A) + P(B)
$$

These axioms also imply $P(emptyset) = 0$ and $P(E) <= 1$.

### General probability rules

From the axioms, we derive useful rules. The **complement** of an event $E$, denoted $E^c$, is the event that $E$ does not occur. The probability of the complement is:

$$
P(E^c) = 1 - P(E)
$$

If event $A$ is a subset of event $B$ (meaning every outcome in $A$ is also in $B$), then $P(A) <= P(B)$.

For any two events $A$ and $B$, the probability that at least one occurs is given by **inclusion–exclusion**:

$$
P(A union B) = P(A) + P(B) - P(A ∩ B)
$$

Here, $P(A ∩ B)$ is the probability that both $A$ and $B$ occur.

Events $A$ and $B$ are **independent** if the occurrence of one does not affect the probability of the other. Mathematically, this means:

$$
P(A ∩ B) = P(A) P(B)
$$

### Conditional probability

**Conditional probability** quantifies the likelihood of an event when we know another event has occurred. For an event $B$ with $P(B) > 0$, the **conditional probability** of $A$ given $B$ is:

$$
P(A | B) = frac(P(A ∩ B), P(B))
$$

If $A$ and $B$ are independent, then $P(A ∩ B) = P(A) P(B)$, and the formula simplifies to $P(A | B) = P(A)$. Knowing $B$ occurred gives no information about $A$.

> **Worked example.** Roll a fair die. Let $A$ be the event the roll is a 1, and $B$ be the event the roll is odd. Since $P(A) = 1/6$ and $P(B) = 1/2$, the probability of a 1 given the roll is odd is:
> $$
> P(1 | "Odd") = P(A | B) = frac(P(A ∩ B), P(B)) = frac(P(A), P(B)) = frac(1/6, 1/2) = 1/3
> $$

### Bayes' theorem

**Bayes' theorem** relates the probability of an event given another to the reverse conditional probability. For events $A$ and $B$, with $P(A) > 0$:

$$
P(B | A) = frac(P(A | B) P(B), P(A))
$$

The denominator $P(A)$ can be expanded using the law of total probability: $P(A) = P(A | B) P(B) + P(A | B^c) P(B^c)$, where $B^c$ is the complement of $B$. Thus, the full form is:

$$
P(B | A) = frac(P(A | B) P(B), P(A | B) P(B) + P(A | B^c) P(B^c))
$$

> **Worked example — diagnostic test.** Suppose a disease has prevalence $P(D) = 0.001$. A test has sensitivity $P(+ | D) = 0.997$ and specificity $P(- | D^c) = 0.985$. The probability of having the disease given a positive test is:
> $$
> P(D | +) = frac(0.997 times 0.001, 0.997 times 0.001 + (1 - 0.985) times 0.999) approx 0.062
> $$
> Despite near-perfect sensitivity and high specificity, the positive predictive value is only about 6.2% because the disease is rare.

---

## Random variables

A **random variable** is the numeric outcome of an experiment.

- **Discrete** random variables take on countable values (coin flips, die rolls, web traffic counts). Probabilities are assigned to each specific value.
- **Continuous** random variables take on any value within a continuum (BMI, IQ). Probabilities are assigned to ranges.

In R: `rbinom()`, `rnorm()`, `rgamma()`, `rpois()`, `runif()` generate random variables from their respective distributions.

### Probability mass function (PMF)

For a discrete random variable $X$, the **probability mass function** (PMF) gives the probability that $X$ equals a specific value $x$. We write this as $p(x) = P(X = x)$. The PMF has two key properties: $p(x) >= 0$ for all possible $x$, and the sum over all possible values is 1:

$$
sum_x p(x) = 1
$$

**Bernoulli distribution example.** Let $X$ = 1 for heads, $X$ = 0 for tails on a coin with probability of heads $theta$. Its PMF is:

$$
p(x) = theta^x (1 - theta)^{1-x}, quad x in {0, 1}
$$

For a **fair coin**, $theta = 0.5$. We can evaluate the PMF:

- For $x=1$: $p(1) = (0.5)^1 (0.5)^0 = 0.5$.
- For $x=0$: $p(0) = (0.5)^0 (0.5)^1 = 0.5$.

The probabilities sum to 1.

In R, `dbinom(k, n, p)` returns $P(X = k)$ for a Binomial($n$, $p$) variable. For a single trial, `dbinom(1, 1, 0.5)` gives 0.5.

### Probability density function (PDF)

For a continuous random variable $X$, the **probability density function** (PDF) $f(x)$ describes the relative likelihood of $X$ taking a value near $x$. The probability that $X$ falls within an interval $[a, b]$ is the area under the PDF curve between $a$ and $b$:

$$
P(a <= X <= b) = integral_a^b f(x) d x
$$

The PDF must be non-negative everywhere, and the total area under the curve is 1:

$$
integral_(-infinity)^(infinity) f(x) d x = 1
$$

Note that the probability of $X$ being exactly equal to any single value is zero; probability is defined over intervals.

In R, `dnorm()`, `dgamma()`, and `dunif()` return density values. `dpois()` returns a discrete probability mass.

### Cumulative distribution function (CDF)

The **cumulative distribution function** (CDF) applies to any random variable. For a random variable $X$, its CDF evaluated at a value $x$ is the probability that $X$ is less than or equal to $x$:

$$
F(x) = P(X <= x)
$$

For a continuous $X$ with PDF $f(x)$, the CDF is the integral of the PDF: $F(x) = integral_(-infinity)^x f(t) d t$. Where differentiable, the PDF is the derivative of the CDF: $f(x) = frac(d, d x) F(x)$.

In R: `pbinom()`, `pnorm()`, `pgamma()`, `ppois()`, `punif()` return cumulative probabilities.

### Survival function

The **survival function** is simply the complement of the CDF. It gives the probability that $X$ is greater than $x$:

$$
S(x) = P(X > x) = 1 - F(x)
$$

### Quantile

The $alpha$-th **quantile** is the smallest value $x_alpha$ whose cumulative probability is at least $alpha$:

$$
x_alpha = inf {x: F(x) >= alpha}
$$

For a continuous, strictly increasing CDF, this simplifies to $F(x_alpha) = alpha$. For example, a **median** is a 0.5-quantile (50th percentile). The **percentile** is the quantile with $alpha$ expressed as a percentage.

In R: `qbeta(0.25, 2, 1)` returns the 25th percentile of a Beta(2, 1) distribution. `qnorm()`, `qbinom()`, etc., work analogously.

> **Estimand vs estimator.** The population median is an *estimand* (the thing we want to know); the sample median is an *estimator* (our best guess from the data). A probability model connects data to population through assumptions.

### Independence

Two events $A$ and $B$ are **independent** if:

$$
P(A ∩ B) = P(A) P(B)
$$

When $P(B) > 0$, this is equivalent to $P(A | B) = P(A)$.

Two random variables $X$ and $Y$ are independent if, for any two sets $A$ and $B$:

$$
P([X in A] ∩ [Y in B]) = P(X in A) P(Y in B)
$$

A useful property: if $A$ and $B$ are independent, so are $A$ and $B^c$, $A^c$ and $B$, and $A^c$ and $B^c$.

### IID random variables

Random variables are **IID** (independent and identically distributed) if they are statistically unrelated *and* drawn from the same population distribution. IID is the default model for random samples and the starting point of inference.

---

## Expected value and variance

### Expected value

The **expected value** (population mean) of a random variable $X$ is its long-run average value. It is a fixed, population-level quantity.

- For a discrete variable with PMF $p(x)$:

$$
E[X] = sum_x x p(x)
$$

- For a continuous variable with PDF $f(x)$:

$$
E[X] = integral_(-infinity)^(infinity) x f(x) d x
$$

**Properties of expectation:**
- **Linearity:** $E[a X + b] = a E[X] + b$ for constants $a$ and $b$.
- **Additivity:** $E[X + Y] = E[X] + E[Y]$ for any two random variables $X$ and $Y$ (even if they are dependent).

### Variance

The **variance** measures the spread of a distribution around its mean. For a random variable $X$ with mean $mu = E[X]$:

$$
"Var"(X) = E[(X - mu)^2]
$$

This is the expected squared deviation from the mean. A common computational formula is:

$$
"Var"(X) = E[X^2] - (E[X])^2
$$

The **standard deviation** is $sigma = sqrt("Var"(X))$, which is in the same units as $X$.

**Properties of variance:**
- $ "Var"(a X + b) = a^2 "Var"(X) $ for constants $a$ and $b$.
- If $X$ and $Y$ are independent: $ "Var"(X + Y) = "Var"(X) + "Var"(Y) $.
- In general: $ "Var"(X + Y) = "Var"(X) + "Var"(Y) + 2 "Cov"(X, Y) $, where $ "Cov"(X, Y) $ is the covariance.

### Sample mean and sample variance

Given data $X_1, X_2, dots.h, X_n$:

- The **sample mean** is the arithmetic average:

$$
bar(X) = (1/n) sum_(i=1)^n X_i
$$

- The **sample variance** is:

$$
S^2 = (1/(n-1)) sum_(i=1)^n (X_i - bar(X))^2
$$

The $n - 1$ denominator (**Bessel's correction**) makes $S^2$ an unbiased estimator of the population variance.

---

## Key distributions

The following table summarizes important probability distributions. The **notation** column shows how we indicate that a random variable $X$ follows a given distribution with specified parameters. The **PMF/PDF** column gives the probability formula.

| Distribution | Notation | PMF / PDF | Mean | Variance | Use case |
| --- | --- | --- | --- | --- | --- |
| Bernoulli | $X tilde "Bernoulli"(theta)$ | $theta^x (1 - theta)^{1-x}, x in {0,1}$ | $theta$ | $theta(1 - theta)$ | Single success/failure |
| Binomial | $X tilde "Binom"(n, p)$ | $binom(n, x) p^x (1-p)^{n-x}$ | $n p$ | $n p (1-p)$ | Count of successes in $n$ trials |
| Poisson | $X tilde "Poisson"(lambda)$ | $(lambda^x e^(-lambda)) slash x!$ | $lambda$ | $lambda$ | Count of rare events |
| Normal | $X tilde N(mu, sigma^2)$ | $(1 slash (sigma sqrt(2 pi))) exp(-(x - mu)^2 slash (2 sigma^2))$ | $mu$ | $sigma^2$ | Default continuous model |
| Exponential | $X tilde "Exp"(lambda)$ | $lambda e^(-lambda x)$ | $1 slash lambda$ | $1 slash lambda^2$ | Time between events |
| Gamma | $X tilde "Gamma"(alpha, beta)$ | $beta^(-alpha) x^(alpha-1) e^(-x slash beta) slash Gamma(alpha)$ | $alpha beta$ | $alpha beta^2$ | Waiting time for $alpha$ events |
| Chi-squared | $X tilde chi^2_n$ | Special case of Gamma($n slash 2$, 2) | $n$ | $2 n$ | Sum of squared standard normals |
| Uniform | $X tilde "Unif"(a, b)$ | $1 slash (b - a)$ | $(a + b) slash 2$ | $(b - a)^2 slash 12$ | Equal probability over $[a, b]$ |

### Relationships between distributions

- A **Binomial**($n$, $p$) variable is the sum of $n$ independent Bernoulli($p$) variables.
- The **Poisson**($lambda$) distribution is the limit of Binomial($n$, $p$) as $n -> infinity$, $p -> 0$, with $n p = lambda$ held fixed.
- The sum of $n$ squared independent standard normals follows a **Chi-squared**($n$) distribution.
- If $X tilde N(mu, sigma^2)$, then standardizing yields a standard normal: $Z = (X - mu) slash sigma tilde N(0, 1)$.

---

## Common mistakes

1. **Confusing $P(A | B)$ with $P(B | A)$.** Bayes' theorem is needed to flip the conditioning.
2. **Forgetting the complement rule.** $P(E) = 1 - P(E^c)$ is often the easiest route when the event is complicated.
3. **Assuming independence without justification.** Independence is a strong assumption; check it, do not default to it.
4. **Using $n$ instead of $n - 1$ for sample variance.** The $n - 1$ correction is essential for unbiasedness.
5. **Thinking $E[X Y] = E[X] E[Y]$ always.** This is only true when $X$ and $Y$ are uncorrelated (a weaker condition than independence for some purposes, but independence implies it).

---

## Revision checklist

- [ ] I can state the Kolmogorov axioms.
- [ ] I can compute conditional probabilities and apply Bayes' theorem.
- [ ] I know the difference between a PMF and a PDF and when each applies.
- [ ] I can write the CDF from a PDF and vice versa.
- [ ] I can compute expected value and variance for common distributions.
- [ ] I can state the properties of expectation and variance (linearity, additivity under independence).
- [ ] I can identify the appropriate distribution for a given scenario.
- [ ] I understand the estimand–estimator distinction.

---

## Make it click: Base rates change the answer

**Work it through.** Suppose 1 in 1,000 people has a condition. Out of 10,000 people, expect 10 to have it. At 99.7% sensitivity, about 9.97 test positive. Of the other 9,990 people, 1.5% test positive falsely: 149.85. Among positive tests, the expected true share is 9.97 / (9.97 + 149.85) ≈ 6.2%. This is a conditional probability with the condition reversed.

**See it.** Change prevalence in the Bayes tab. Predict whether the true share of positive tests rises or falls before moving the slider. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#bayes)

**What the questions are checking.** [Questions from Class Material](/notes/studies-cra-4411-data-science-part-ii-questions-from-class-material) Q2 and [Midsem MCQ Mock Test 1](/notes/studies-cra-4411-data-science-part-ii-midsem-mcq-mock-test-1) Q11/Q22 ask for the probability *given a positive result*. Sensitivity alone answers a different question.

> [!warning] Common trap
> For an expected value question such as mock Q2, multiply each possible value of the requested *function* by its probability; do not merely compute the function of the average.
