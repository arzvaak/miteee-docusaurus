---
title: "03 - Trees, Bagging and Random Forests"
math_syntax: typst
---

# Trees, Bagging and Random Forests

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Practical Machine Learning — Week 3

---

## First, read the notation in words

A **tree split** asks a yes/no question about one feature, sending cases into branches. A **leaf** supplies the final prediction. **Impurity** measures how mixed the classes are in a node; a good split reduces it. Bagging trains trees on bootstrap samples and averages their predictions. A random forest also offers only a random subset of features at each split, making trees less alike. **Out-of-bag** cases are rows absent from a particular tree’s bootstrap sample.

> [!question] Try to recall
> If all trees make the same error, will averaging help much? Then explain why random feature selection might help.

---

## 1. Predicting with Regression

Regression models predict an outcome by fitting a linear function to the data.

### The Model

The linear regression model predicts the response as a linear combination of predictors.

$$
Y_i = beta_0 + beta_1 X_(1i) + beta_2 X_(2i) + dots.h + beta_p X_(p i) + epsilon_i
$$

where:
- $beta_0$ is the intercept
- $beta_1, dots.h, beta_p$ are coefficients
- $X_(1i), dots.h, X_(p i)$ are predictors
- $epsilon_i$ is the error term

**Prediction**:

$$
hat(Y)_i = hat(beta)_0 + hat(beta)_1 X_(1i) + dots.h + hat(beta)_p X_(p i)
$$

### R Implementation

```r
library(caret)
data(faithful)
inTrain <- createDataPartition(y = faithful$waiting, p = 0.5, list = FALSE)
trainFaith <- faithful[inTrain, ]; testFaith <- faithful[-inTrain, ]

# Fit model
lm1 <- lm(eruptions ~ waiting, data = trainFaith)
summary(lm1)

# Predict
predict(lm1, newdata = data.frame(waiting = 80))

# Plot training and test fits
par(mfrow = c(1, 2))
plot(trainFaith$waiting, trainFaith$eruptions, pch = 19, col = "blue", main = "Train")
lines(trainFaith$waiting, predict(lm1), lwd = 3)
plot(testFaith$waiting, testFaith$eruptions, pch = 19, col = "blue", main = "Test")
lines(testFaith$waiting, predict(lm1, newdata = testFaith), lwd = 3)

# RMSE comparison
c(trainRMSE = sqrt(mean((lm1$fitted - trainFaith$eruptions)^2)),
  testRMSE  = sqrt(mean((predict(lm1, newdata = testFaith) - testFaith$eruptions)^2)))
```

> [!note] $"RMSE"_("test")$ (out-of-sample) is often greater than $"RMSE"_("train")$ (in-sample), but a particular split can reverse that ordering. Compare both on the same error definition.

### Prediction Intervals

Prediction intervals provide a range for future observations with a specified confidence level.

```r
pred1 <- predict(lm1, newdata = testFaith, interval = "prediction")
# Returns: fit (prediction), lwr (lower bound), upr (upper bound)
plot(testFaith$waiting, testFaith$eruptions, pch = 19, col = "blue")
matlines(testFaith$waiting, pred1, type = "l", col = c(1, 2, 2), lty = c(1, 1, 1), lwd = 3)
```

### Diagnostic Plots

Diagnostic plots assess the assumptions of linear regression.

```r
modFit <- train(wage ~ age + jobclass + education, method = "lm", data = training)
par(mfrow = c(2, 2))
plot(modFit$finalModel, pch = 19, cex = 0.5, col = "#00000010")
```

Four diagnostics: Residuals vs Fitted, Normal Q-Q, Scale-Location, Residuals vs Leverage. If residuals show a trend when plotted against an omitted variable, that variable should be added to the model.

---

## 2. Prediction with Trees

Classification and regression trees iteratively split the data into increasingly homogeneous groups.

### Process

Tree-building recursively partitions the data by selecting the best predictor split at each node to maximize homogeneity.

1. Start with all observations in one group
2. Find the variable that best splits outcomes into two groups
3. Divide data into two **leaves** based on the split at a **node**
4. Within each leaf, find the best next split
5. Continue until groups are sufficiently small or pure

### Advantages

- Easy to interpret
- Handles non-linear relationships naturally
- Less sensitive to monotone transformations (e.g. $log$)
- Can be used for both classification and regression

### Disadvantages
- Without cross-validation, easily **over-fitted**
- High variance: results can change substantially between runs
- Harder to estimate uncertainty

### Measures of Impurity

Impurity metrics quantify node homogeneity using class proportions $hat(p)_(m k)$. The Gini Index is defined as $1 - sum_(k=1)^(K) hat(p)_(m k)^2$.

Let $hat(p)_(m k)$ be the proportion of class $k$ observations in group $m$ of size $N_m$.

**Misclassification Error**:

$$
1 - hat(p)_(m, k(m))
$$

where $k(m)$ is the majority class. Ranges from 0 (perfect purity) to 0.5 (no purity — majority class has $<= 50%$).

**Gini Index**:

$$
sum_(k=1)^(K) hat(p)_(m k) (1 - hat(p)_(m k)) = 1 - sum_(k=1)^(K) hat(p)_(m k)^2
$$

Ranges from 0 (perfect purity) to 0.5 (no purity for binary).

**Deviance**:

$$
-sum_(k=1)^(K) hat(p)_(m k) ln(hat(p)_(m k))
$$

Ranges from 0 (perfect purity) to $ln(K)$ for equal class sizes. When $K = 2$, the maximum is $ln(2) approx 0.693$, but is normalised to 1 in many implementations.

**Information Gain**:

$$
-sum_(k=1)^(K) hat(p)_(m k) log_2(hat(p)_(m k))
$$

Same interpretation as deviance but using $log_2$.

### Worked Example

The worked example compares impurity calculations for two nodes in a $4 times 4$ grid, illustrating how split purity affects misclassification, Gini, and information scores.

Consider a $4 times 4$ grid of 16 points:

**Scenario A** (15 blue, 1 red):
- Misclassification: $1/16 = 0.06$
- Gini: $1 - [(1/16)^2 + (15/16)^2] = 0.12$
- Information: $-[1/16 times log_2(1/16) + 15/16 times log_2(15/16)] = 0.34$

**Scenario B** (8 blue, 8 red):
- Misclassification: $8/16 = 0.5$
- Gini: $1 - [(8/16)^2 + (8/16)^2] = 0.5$
- Information: $-[8/16 times log_2(8/16) + 8/16 times log_2(8/16)] = 1$

### Building Trees with caret

The `caret` package automates tree construction using the `rpart` algorithm, providing functions for fitting, visualization, and prediction.

```r
data(iris)
inTrain <- createDataPartition(y = iris$Species, p = 0.7, list = FALSE)
training <- iris[inTrain, ]; testing <- iris[-inTrain, ]

modFit <- train(Species ~ ., method = "rpart", data = training)
print(modFit$finalModel)
rattle::fancyRpartPlot(modFit$finalModel)
predict(modFit, newdata = testing)
```

At each node, "yes" goes left and "no" goes right.

---

## 3. Bagging (Bootstrap Aggregating)

Bagging reduces variance by **averaging multiple complex models**, each fit to a bootstrap sample.

### Key Insight

Bagging reduces variance by averaging many complex models while preserving bias, a key insight for ensemble methods like random forests.

Averaging many complex models retains roughly the **same bias** as a single model but has **reduced variance** due to averaging. Most useful for non-linear models.

### Process

The bagging algorithm repeatedly samples with replacement to train $B$ models, then combines their predictions via averaging or majority vote.

1. Draw a bootstrap sample (with replacement) from the training data
2. Fit a model to this sample
3. Repeat $B$ times
4. Average predictions (regression) or majority vote (classification)

### Worked Example: Loess Smoothing

This example demonstrates bagging with loess smoothing on the ozone dataset, showing how averaging multiple bootstrap fits stabilizes the prediction curve.

```r
library(ElemStatLearn); data(ozone, package = "ElemStatLearn")
ozone <- ozone[order(ozone$ozone), ]
ll <- matrix(NA, nrow = 10, ncol = 155)

for (i in 1:10) {
  ss <- sample(1:dim(ozone)[1], replace = TRUE)
  ozone0 <- ozone[ss, ]; ozone0 <- ozone0[order(ozone0$ozone), ]
  loess0 <- loess(temperature ~ ozone, data = ozone0, span = 0.2)
  ll[i, ] <- predict(loess0, newdata = data.frame(ozone = 1:155))
}

plot(ozone$ozone, ozone$temperature, pch = 19, cex = 0.5)
for (i in 1:10) lines(1:155, ll[i, ], col = "grey", lwd = 2)
lines(1:155, apply(ll, 2, mean), col = "red", lwd = 2)  # bagged average
```

### Bagging in caret

The `bag()` function in `caret` implements bagging, allowing specification of base learners, predictors, and aggregation methods.

```r
library(party)
predictors <- data.frame(ozone = ozone$ozone)
temperature <- ozone$temperature

treebag <- bag(predictors, temperature, B = 10,
               bagControl = bagControl(fit = ctreeBag$fit,
                                       predict = ctreeBag$pred,
                                       aggregate = ctreeBag$aggregate))
```

---

## 4. Random Forests

Random forests extend bagging by also **randomly selecting which variables** to consider at each split, decorrelating the trees.

### Process

Random forests extend bagging by randomly selecting $m$ predictors at each split to decorrelate trees, improving ensemble performance.

1. Bootstrap sample from the training data
2. At each node, randomly select $m$ of $p$ predictors as candidates for splitting
3. Find the best split among those $m$ candidates
4. Grow trees to maximum depth (or minimum leaf size)
5. Aggregate: majority vote (classification) or average (regression)

### Advantages

- Among the most accurate off-the-shelf algorithms
- Handles high-dimensional data well
- Provides variable importance measures

### Disadvantages

- Can be slow (many trees, many splits)
- Hard to interpret (hundreds of trees, thousands of splits)
- Risk of over-fitting without proper cross-validation
- Not great for extrapolation beyond training data range

### R Implementation

```r
data(iris)
inTrain <- createDataPartition(y = iris$Species, p = 0.7, list = FALSE)
training <- iris[inTrain, ]; testing <- iris[-inTrain, ]

modFit <- train(Species ~ ., data = training, method = "rf", prox = TRUE)

# Examine a specific tree
head(getTree(modFit$finalModel, k = 2))

# Cluster centres using proximity matrix
irisP <- classCenter(training[, c(3, 4)], training$Species, modFit$finalModel$prox)
irisP <- as.data.frame(irisP); irisP$Species <- rownames(irisP)

p <- qplot(Petal.Width, Petal.Length, col = Species, data = training)
p + geom_point(aes(x = Petal.Width, y = Petal.Length, col = Species),
               size = 5, shape = 4, data = irisP)

# Predict and evaluate
pred <- predict(modFit, testing)
table(pred, testing$Species)
```

> [!warning] Always use cross-validation when running random forests. The out-of-bag error is useful but cross-validation provides additional assurance.

---

## Key Intuitions

1. **Regression** is simple and interpretable but assumes linearity — use it as a baseline and in combination with other methods.
2. **Trees** handle non-linearity naturally but over-fit without pruning/cross-validation.
3. **Bagging** reduces variance by averaging many complex models.
4. **Random forests** further decorrelate trees by random variable selection at each split; compare validation error to bagging on the actual task.
5. The bias–variance trade-off is the central theme: bagging and random forests primarily reduce **variance**.

---

## Revision Checklist

- [ ] Can write the linear regression model and predict new values
- [ ] Can interpret regression diagnostic plots
- [ ] Can explain the tree-building process and the four impurity measures
- [ ] Can build and interpret a classification tree using `caret`
- [ ] Can explain how bagging works and why it reduces variance
- [ ] Can explain how random forests differ from bagging
- [ ] Can use `train()` with `method = "rpart"` and `method = "rf"`
- [ ] Understands the bias–variance trade-off across all these methods
---

## Make it click: Why two tree ensembles differ

**Work it through.** Imagine every bootstrap tree repeatedly chooses the same very strong predictor at its first split. Their errors stay correlated, so averaging is less helpful. Bagging changes the rows for each tree. A random forest also offers each split only a random subset of predictors; some trees must consider alternatives, reducing correlation among trees.

**See it.** Draw three trees with the same first split, then three with different first splits. Which group is likely to make more independent mistakes? [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#complexity)

**What the questions are checking.** [Midsem MCQ Mock Test 1](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-test-1) Q6/Q16/Q25/Q30 distinguish split impurity, bootstrap aggregation, and feature randomness.

> [!warning] Common trap
> Random forest is not just more bagged trees. Its extra randomness is at the predictor selection step for each split.
