---
title: "02 - Cross-Validation and caret"
math_syntax: typst
---

# Cross-Validation and the caret Package

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


> Practical Machine Learning — Week 2

---

## First, read the notation in words

A **fold** is one partition of the training data. In k-fold cross-validation, fit k models; each turn holds out one fold and trains on the others. The score is the average of the k held-out scores. `caret::train()` can automate this with `trainControl()`. **Preprocessing** means operations such as centering, scaling and PCA; fit those operations within each training fold so held-out rows do not leak into training.

> [!question] Try to recall
> Draw five boxes. Circle a different box for validation in each of five turns; every box should be circled exactly once.

---

## 1. Cross-Validation

Cross-validation provides an honest estimate of out-of-sample error by repeatedly splitting the training data into sub-training and sub-test sets.

### General Procedure

Cross-validation estimates out-of-sample error by repeatedly splitting the training set.

1. Split the training set into sub-training / sub-test portions
2. Build the model on the sub-training set
3. Evaluate on the sub-test set
4. Repeat and average the estimated errors

The original test set remains **completely untouched**, so the final model evaluation is unbiased.

### Three Approaches

Common resampling methods include random subsampling, k-fold cross-validation, and leave-one-out cross-validation (LOOCV).

#### Random Subsampling

- Randomly partition the training set into train and test portions **without replacement**
- Repeat multiple times and average the error
- **Caveat**: sampling *with* replacement is bootstrap, which **underestimates** error (corrected by the 0.632 bootstrap, though it is complicated)

#### K-Fold Cross-Validation

- Divide the training set into $K$ equal folds
- For each fold $k$: train on the other $K-1$ folds, test on fold $k$
- Average the $K$ error estimates

| K value | Bias | Variance |
|---------|------|----------|
| Large $K$ | Less bias | More variance |
| Small $K$ | More bias | Less variance |

Typical choice: $K = 10$.

#### Leave-One-Out Cross-Validation (LOOCV)

- Leave out exactly one observation, train on the rest, predict the left-out observation
- Repeat for every observation
- **Pros**: nearly unbiased (uses almost all data for training each time)
- **Cons**: computationally expensive, high variance because training sets are nearly identical

### Time Series Considerations

For time-dependent data, use time-based splits to preserve temporal order.

For time-dependent data, do **not** use random splits. Instead, use time-based chunks (known as **backtesting** in finance), where the training set always precedes the test set chronologically.

---

## 2. The `caret` Package

The `caret` (Classification And REgression Training) package provides a **uniform framework** for:

- Preprocessing/cleaning: `preProcess()`
- Data splitting: `createDataPartition()`, `createFolds()`, `createResample()`, `createTimeSlices()`
- Training: `train()`, `predict()`
- Evaluation: `confusionMatrix()`

Supported algorithms include linear discriminant analysis, regression, naive Bayes, support vector machines, classification/regression trees, random forests, and boosting.

### Data Slicing Functions

The caret package provides functions for splitting data into training and test sets, creating folds, and generating time slices.

#### `createDataPartition`

```r
inTrain <- createDataPartition(y = spam$type, p = 0.75, list = FALSE)
training <- spam[inTrain, ]
testing  <- spam[-inTrain, ]
```

- `y` — outcome variable (used for stratified splitting)
- `p` — fraction for training (0.75 = 75%)
- `list = FALSE` — returns a matrix of indices (easier to subset with)

#### `createFolds`

```r
folds <- createFolds(y = spam$type, k = 10, list = TRUE, returnTrain = TRUE)
```

- `k = 10` — creates 10 folds; each training set has ~90% of data
- `returnTrain = TRUE` — returns training indices; `FALSE` returns test indices
- When `list = FALSE`, returns a vector indicating which fold each observation belongs to

#### `createResample`

```r
resamples <- createResample(y = spam$type, times = 10, list = TRUE)
```

Creates 10 bootstrap samples (with replacement). Each vector is the same length as the original data, with repeated indices.

#### `createTimeSlices`

```r
folds <- createTimeSlices(y = 1:1000, initialWindow = 20, horizon = 10)
folds$train[[1]]  # first training set (observations 1–20)
folds$test[[1]]   # first test set (observations 21–30)
```

- `initialWindow` — number of consecutive values in each training slice
- `horizon` — number of consecutive values in each test slice
- `fixedWindow = FALSE` — training set always starts at observation 1

### Training Options

The `train()` function is the core of `caret`:

```r
modFit <- train(outcome ~ ., data = training, method = "glm")
```

Key parameters of `trainControl()`:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `method` | `"boot"` | `"boot"`, `"cv"`, `"repeatedcv"`, `"LOOCV"` |
| `number` | 10 (cv) / 25 (boot) | Number of resamples |
| `repeats` | 1 (cv) / 25 (boot) | Number of repetitions |
| `p` | 0.75 | Training fraction |
| `verboseIter` | `FALSE` | Print training logs |
| `seeds` | `NA` | Set seed for reproducibility |
| `allowParallel` | `TRUE` | Enable parallel processing |
| `classProbs` | `FALSE` | Return classification probabilities |

The `metric` argument defaults to `"Accuracy"` for factors and `"RMSE"` for continuous outcomes.

---

## 3. Plotting Predictors

Exploratory visualisation of the training set helps identify outliers, skewness, imbalance, and explainable patterns.

```r
library(ISLR); library(ggplot2)
data(Wage)
inTrain <- createDataPartition(y = Wage$wage, p = 0.7, list = FALSE)
training <- Wage[inTrain, ]

# Pairs plot of predictors vs outcome
featurePlot(x = training[, c("age", "education", "jobclass")],
            y = training$wage, plot = "pairs")

# Scatter with regression line by education
qplot(age, wage, colour = education, data = training) +
  geom_smooth(method = "lm", formula = y ~ x)

# Boxplot with jitter, grouped by wage quantile
library(Hmisc); library(gridExtra)
cutWage <- cut2(training$wage, g = 3)
p1 <- qplot(cutWage, age, data = training, fill = cutWage, geom = "boxplot")
p2 <- qplot(cutWage, age, data = training, fill = cutWage, geom = c("boxplot", "jitter"))
grid.arrange(p1, p2, ncol = 2)

# Density plot
qplot(wage, colour = education, data = training, geom = "density")

# Contingency table
t <- table(cutWage, training$jobclass)
prop.table(t, 1)  # row proportions
```

---

## 4. Preprocessing

Preprocessing transforms predictors to improve model performance, especially for model-based methods (LDA, naive Bayes, linear regression).

### Centering, Scaling, and Normalizing

Preprocessing steps include centering, scaling, and normalizing to standardize predictors.

- **Centering**: subtract the mean from each observation
- **Scaling**: divide by the standard deviation
- **Normalizing** = centering + scaling → each observation becomes the number of standard deviations from the mean (mean 0, SD 1)

> [!warning] If you normalise the training set, the **same transformation parameters** (training mean and SD) must be applied to the test set. The test set's normalised values will **not** have mean 0 and SD 1, but will be close.

```r
# Option 1: preprocessing inside train()
modelFit <- train(type ~ ., data = training, preProcess = c("center", "scale"))

# Option 2: standalone preprocessing
preObj <- preProcess(training[, -58], method = c("center", "scale"))
trainCapAveS <- predict(preObj, training[, -58])$capitalAve
testCapAveS  <- predict(preObj, testing[, -58])$capitalAve
```

### Box-Cox Transformation

The Box-Cox transformation makes continuous data more Gaussian by applying a power transformation.

Applies a power transformation to make continuous variables more Gaussian:

```r
preObj <- preProcess(training[, -58], method = "BoxCox")
trainCapAveS <- predict(preObj, training[, -58])$capitalAve
par(mfrow = c(1, 2))
hist(trainCapAveS); qqnorm(trainCapAveS)
```

> [!note] Box-Cox assumes continuous values and does not handle repeated values.

### KNN Imputation

For missing data, k-nearest-neighbours imputation replaces missing values with the average of the $k$ nearest complete observations:

```r
training$capAve <- training$capitalAve
selectNA <- rbinom(dim(training)[1], size = 1, prob = 0.05) == 1
training$capAve[selectNA] <- NA

preObj <- preProcess(training[, -58], method = "knnImpute")
capAve <- predict(preObj, training[, -58])$capAve
```

---

## 5. Covariate Creation / Feature Extraction

### Level 1: Features from Raw Data

Extract usable metrics from raw data, guided by domain knowledge:

| Data Type | Example Features |
|-----------|-----------------|
| Text | Word frequency, phrase frequency, capital letter frequency |
| Images | Edges, corners, blobs, ridges |
| Web pages | Number/position of images, colours, videos |
| People | Height, weight, hair colour, sex, country |

When in doubt, **include more features** — they can be filtered during model construction.

### Level 2: Transformed Covariates

Construct new features from extracted features (e.g. log transforms, polynomial terms). Primarily useful for methods like regression and SVMs. Only perform transformations on the training set.

### Dummy Variables

Dummy variables convert categorical predictors into binary indicator variables.

Convert factor variables to numeric indicator variables:

```r
dummies <- dummyVars(wage ~ jobclass, data = training)
head(predict(dummies, newdata = training))
```

A factor with $k$ levels produces $k$ columns of 0s and 1s (one-hot encoding).

### Removing Zero-Variance Predictors

```r
nearZeroVar(training, saveMetrics = TRUE)
```

Returns `freqRatio`, `percentUnique`, `zeroVar`, and `nzv` for each predictor. Remove variables where `nzv = TRUE`.

### Creating Splines

Splines provide flexible non-linear fits by using basis functions.

Fit polynomial or spline curves through data:

```r
library(splines)
bsBasis <- bs(training$age, df = 3)  # 3 basis functions
lm1 <- lm(wage ~ bsBasis, data = training)

plot(training$age, training$wage, pch = 19, cex = 0.5)
points(training$age, predict(lm1, newdata = training), col = "red", pch = 19, cex = 0.5)
```

The same spline transformation must be applied to the test set via `predict()`.

### Multicore Parallel Processing

```r
library(doMC)
registerDoMC(cores = 4)
```

Enables parallel computation for `caret` training. The number of cores depends on your CPU.

---

## 6. Preprocessing with PCA

**Principal Component Analysis (PCA)** finds a low-dimensional representation that captures the most variance with the fewest variables.

### Mathematical Goal

Principal Component Analysis (PCA) reduces dimensionality by finding uncorrelated linear combinations that maximize variance.

PCA finds new uncorrelated variables (principal components) that are linear combinations of the originals, maximising explained variance. This reduces both dimensionality and noise.

### Using `prcomp`

The `prcomp` function performs principal component analysis on a data matrix.

```r
data(spam)
prComp <- prcomp(log10(spam[, -58] + 1))
head(prComp$rotation[, 1:5], 5)  # eigenvectors

typeColor <- ((spam$type == "spam") * 1 + 1)
plot(prComp$x[, 1], prComp$x[, 2], col = typeColor, xlab = "PC1", ylab = "PC2")
```

> [!tip] Taking `log10(x + 1)` before PCA helps reduce skewness and makes the data more Gaussian. The `+ 1` avoids `log(0)`.

### Using `caret` for PCA

The caret package can perform PCA as part of the preprocessing step.

```r
inTrain <- createDataPartition(y = spam$type, p = 0.75, list = FALSE)
training <- spam[inTrain, ]; testing <- spam[-inTrain, ]

# Method 1: explicit preprocessing then model
preProc <- preProcess(log10(training[, -58] + 1), method = "pca", pcaComp = 2)
trainPC <- predict(preProc, log10(training[, -58] + 1))
modelFit <- train(training$type ~ ., method = "glm", data = trainPC)
testPC <- predict(preProc, log10(testing[, -58] + 1))
confusionMatrix(testing$type, predict(modelFit, testPC))

# Method 2: inline in train()
modelFit <- train(type ~ ., method = "glm", preProcess = "pca", data = training)
confusionMatrix(testing$type, predict(modelFit, testing))
```

Both methods achieve > 90% accuracy with just 2 principal components.

---

## Key Intuitions

1. **Cross-validation** is essential for honest performance estimation — never evaluate on training data alone.
2. The `caret` package provides a **uniform interface** across many algorithms, making model comparison straightforward.
3. **Preprocessing** (centering, scaling, Box-Cox, imputation) can substantially improve model-based methods.
4. **PCA** reduces dimensionality and noise but makes interpretation harder.
5. Always apply the **same transformations** to training and test sets using parameters derived from the training set.

---

## Revision Checklist

- [ ] Can explain random subsampling, K-fold, and LOOCV, including their bias-variance trade-offs
- [ ] Can use `createDataPartition`, `createFolds`, `createResample`, `createTimeSlices`
- [ ] Can configure `train()` and `trainControl()` with appropriate method, metric, and parameters
- [ ] Can perform preprocessing (center, scale, BoxCox, knnImpute) and apply it to test data
- [ ] Can create dummy variables, remove zero-variance predictors, and create spline basis functions
- [ ] Can perform PCA using `prcomp` and `caret` and interpret the results
- [ ] Understands the importance of parallel processing for computationally intensive algorithms
---

## Make it click: Each row gets one validation turn

**Work it through.** With five folds and validation MSEs 0.12, 0.15, 0.11, 0.14 and 0.13, the mean is (0.12 + 0.15 + 0.11 + 0.14 + 0.13)/5 = 0.13. Each fold trains on four fifths and validates on the remaining fifth. If standardization uses all rows before splitting, validation information leaks into training.

**See it.** Use the Cross validation tab and set k = 5. Point to the held-out block in each row. Change k and count how often each observation validates. [Open the interactive visual lab](/content-assets/studies/Study%20Visual%20Lab.html#cv)

**What the questions are checking.** [Midsem MCQ Mock Test 1](/notes/studies-cra-4412-advanced-data-science-part-iii-midsem-mcq-mock-test-1) Q3/Q14/Q22 test fold roles and average error. Q4/Q5 ask about preprocessing and PCA, which must be fit within training folds.

> [!warning] Common trap
> Cross-validation helps select and estimate models on training data; an untouched final test set still answers the final generalization question.
