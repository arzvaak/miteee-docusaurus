# R Programming — Course Notes

---

## Overview and History of R

:::info[What is R?]
**R** is a dialect of the **S** language — a statistical computing environment originally developed at Bell Labs. It's free, open-source, and the dominant language for data analysis and statistics.
:::


### History of S

- Developed by John Chambers at **Bell Labs**
- Initiated in **1976** as an internal statistical tool (originally FORTRAN libraries)
- **1988**: Rewritten in C (version 3)
- **1998**: Version 4 — still the foundation today
- Bell Labs → Insightful → Lucent → Alcatel-Lucent
- Won the **ACM Software System Award** in 1998

### History of R

| Year | Event |
|------|-------|
| 1991 | Created in New Zealand by **Ross Ihaka & Robert Gentleman** |
| 1993 | First public announcement |
| 1995 | GNU General Public License adopted (made free) |
| 1996 | Public mailing lists created: `R-help` and `R-devel` |
| 1997 | R Core Group formed |
| 2000 | **R v1.0.0** released |

### R Features

- Runs on any platform (Windows, macOS, Linux)
- Lean core; extended via modular packages
- Sophisticated graphics capabilities
- Powerful for interactive data analysis
- **FREE** — four freedoms:
  1. Freedom to **run** the program
  2. Freedom to **study** and adapt it
  3. Freedom to **redistribute** copies
  4. Freedom to **improve** and share improvements

### R Drawbacks

:::warning[Limitations of R]
- 40-year-old technology at its core
- Limited built-in support for dynamic/3D graphics
- Objects are generally stored in **physical memory** — constrained by RAM
- Functionality is demand-driven, so some areas are poorly covered
:::


### Design of the R System

- Two conceptual parts: **base R** (from CRAN) and everything else
- **Base R** = core functions: `util`, `stats`, `datasets`, `graphics`, ...
- Recommended packages included: `boot`, `KernSmooth`, etc.
- **5000+ packages** available on CRAN alone

---

## Coding Standards

:::tip[Good R Style]
- Always use **plain text files** / a text editor
- **Indent** at least 4 spaces per level
- Limit line width to **80 columns**
- Keep individual **functions short** and focused — one job per function
:::


---

## Workspace and Files

### Navigation

```r
getwd()                                          # Return current working directory
setwd("C:/Users/arzva/Documents/MITEEE")        # Set working directory
ls()                                             # List all objects in workspace
list.files(recursive = TRUE)                     # List all files including subdirs
```

### Directories

```r
dir.create("data/raw", recursive = TRUE)    # Create nested directories
unlink("data/raw", recursive = TRUE)        # Delete directory and contents
```

:::danger[`unlink()` is Permanent]
Like `rm -r` in Bash — there is no undo. Always confirm the path before running.
:::


### File Operations

```r
file.create("notes.txt")                  # Create a new empty file
file.exists("notes.txt")                  # Returns TRUE or FALSE
file.info("notes.txt")                    # Full metadata about the file
file.info("notes.txt")$size               # Access a specific attribute (e.g., size)
file.rename("notes.txt", "final.txt")     # Rename a file
file.copy("final.txt", "backup.txt")      # Copy a file
file.path("folder", "file.txt")           # Construct a file path safely
```

### Getting Help

```r
?read.table           # Open help page for a function
args(read.table)      # Show function arguments only
```

---

## R Console and Evaluation

```r
x <- 42         # Assignment operator (preferred over =)
# This is a comment

print(x)        # Explicit print
x               # Autoprinting — same result when typed at console
```

:::note[Autoprinting]
Simply typing a variable name at the console **automatically prints** its value. Inside functions, you must use `print()` explicitly.
:::


:::info[Output Notation]
The `[1]` at the start of output tells you which **vector index** that line starts at.
```r
1:25
# [1]  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
# [21] 21 22 23 24 25
```
:::


---

## R Objects and Data Structures

### Atomic Classes — 5 Basic Types

| Class | Description | Example |
|-------|-------------|---------|
| `character` | Text strings | `"hello"` |
| `numeric` | Real numbers (double precision) | `3.14`, `42` |
| `integer` | Whole numbers | `5L` |
| `complex` | Complex numbers | `1+2i` |
| `logical` | Boolean values | `TRUE`, `FALSE` |

### Numbers

```r
x <- 3.14        # numeric (double by default)
y <- 5L          # integer (L suffix)
z <- Inf         # Infinity — usable in calculations
w <- NaN         # Not a Number (e.g., 0/0)
sqrt(16)         # → 4
1/0              # → Inf
0/0              # → NaN
```

:::note[Integer vs Numeric]
Use the `L` suffix to explicitly create an integer: `5L`. Without it, `5` is stored as a `numeric` (double). This matters for memory and type checks.
:::


---

## Vectors and Lists

### Creating Vectors

```r
c(1, 2, 3, 4)               # Numeric vector
c("a", "b", "c")            # Character vector
c(TRUE, FALSE, TRUE)        # Logical vector
vector("numeric", 5)        # Empty numeric vector of length 5 → 0 0 0 0 0
1:10                         # Integer sequence from 1 to 10
```

### Vector Operations

```r
x <- c(1, 2, 3)
y <- c(10, 20, 30)

x + y           # → 11 22 33 (element-wise)
x * 2           # → 2 4 6 (scalar multiplication)
x == 2          # → FALSE TRUE FALSE
```

:::warning[Vector Recycling]
If two vectors have different lengths, the **shorter one is repeated** to match the longer one — silently!
```r
c(1, 2, 3, 4) + c(10, 20)
# → 11 22 13 24   (c(10,20) recycled to c(10,20,10,20))
```
:::


### Coercion

**Explicit coercion:**

```r
as.numeric("3.14")          # → 3.14
as.logical(0)               # → FALSE
as.character(42)            # → "42"
as.numeric(c("a", "b"))     # → NA NA  (with warning — nonsensical coercion)
```

**Implicit coercion (automatic):**

```r
x <- c(1, 2, "three")      # Mixes numeric and character
class(x)                    # → "character"  (all values coerced to broadest type)
```

:::warning[Implicit Coercion is Silent]
R converts mixed types without warning using the *least common denominator* rule:
`logical` → `integer` → `numeric` → `complex` → `character`
```r
c(TRUE, 1L, 3.14)   # → numeric: 1.00 1.00 3.14
c(TRUE, "hello")    # → character: "TRUE" "hello"
```
:::


### Lists

```r
my_list <- list(name = "Alice", age = 30, scores = c(85, 90, 78))

my_list**1**           # Access 1st element → "Alice"
my_list**"name"**      # Access by name → "Alice"
my_list$name           # Shorthand → "Alice"
my_list[1]             # Returns a LIST containing element 1 (not the value!)
```

:::tip[`[]` vs `[[]]` for Lists]
- `x[1]` → returns a **list** (wrapper included)
- `x**1**` → returns the **actual element** (unwrapped)
:::


### Logical Vectors

```r
x <- c(3, 1, 4, 1, 5, 9)
x > 3          # → FALSE FALSE TRUE FALSE TRUE TRUE
x[x > 3]      # → 4 5 9  (subsetting with a logical vector)
```

### String Operations

```r
LETTERS             # Built-in: "A" "B" ... "Z"
letters             # Built-in: "a" "b" ... "z"

paste(c("x", "y", "z"), collapse = "-")         # → "x-y-z"
paste("Item", 1:3, sep = "_")                   # → "Item_1" "Item_2" "Item_3"
unique(c(1, 2, 2, 3, 1))                        # → 1 2 3
```

---

## Matrices and Data Frames

### Matrices

```r
m <- matrix(1:6, nrow = 2, ncol = 3)
#      [,1] [,2] [,3]
# [1,]    1    3    5
# [2,]    2    4    6
# Note: filled COLUMN-WISE by default

dim(m)                             # → 2 3
rbind(c(1,2), c(3,4))             # Combine rows
cbind(c(1,2), c(3,4))             # Combine columns
m * 2                              # Element-wise multiplication
m %*% t(m)                        # True matrix multiplication
```

:::tip[Creating a Matrix from a Vector]
```r
v <- 1:10
dim(v) <- c(2, 5)    # Reshape vector into 2×5 matrix in-place
v
#      [,1] [,2] [,3] [,4] [,5]
# [1,]    1    3    5    7    9
# [2,]    2    4    6    8   10
```
:::


### Data Frames

```r
df <- data.frame(
  name  = c("Alice", "Bob", "Carol"),
  age   = c(25, 30, 22),
  score = c(88.5, 91.0, 79.5)
)

nrow(df)          # → 3
ncol(df)          # → 3
colnames(df)      # → "name" "age" "score"
as.data.frame(m)  # Convert matrix to data frame
data.matrix(df)   # Convert data frame to matrix
colMeans(m)       # Column means
rowMeans(m)       # Row means
```

:::note[Data Frame vs Matrix]
| | Matrix | Data Frame |
|--|--------|-----------|
| Types | **One** type only | **Multiple** types |
| Structure | 2D array | Special list (equal-length columns) |
| Created by | `matrix()` | `data.frame()`, `read.csv()` |
:::


### Arrays

```r
arr <- array(1:24, dim = c(2, 3, 4))    # 4 layers of 2×3 matrices
# dim = c(rows, cols, layers)
```

### Factors

```r
# Unordered factor
status <- factor(c("low", "high", "medium", "high", "low"))
levels(status)           # → "high" "low" "medium"  (alphabetical default)
table(status)            # Count occurrences of each level

# Ordered factor
size <- factor(c("S", "L", "M", "XL"),
               levels = c("S", "M", "L", "XL"),
               ordered = TRUE)
size[1] < size[2]        # → TRUE  (S < L)
```

:::tip[Always Set Levels Explicitly]
Without explicit levels, R uses **alphabetical order** which may not match logical order (e.g., "High" &lt; "Low" alphabetically).
:::


### Attributes

```r
x <- 1:6
names(x) <- c("a", "b", "c", "d", "e", "f")
attributes(x)                            # List all attributes
class(x)                                 # → "integer"
attr(x, "custom") <- "my metadata"      # Set a custom attribute

m <- matrix(1:4, 2, 2)
dimnames(m) <- list(c("r1","r2"), c("c1","c2"))   # Name rows and columns
```

---

## Missing Values

:::note[NA vs NaN]
- **`NA`** = "Not Available" — a general missing value placeholder (statistical sense)
- **`NaN`** = "Not a Number" — result of an undefined mathematical operation
- **`NaN` is a special case of `NA`**, but `NA` is not `NaN`
:::


```r
0/0              # → NaN
sqrt(-1)         # → NaN (with warning)
NA + 5           # → NA  (any operation with NA returns NA)

is.na(c(1, NA, NaN, 3))     # → FALSE TRUE TRUE FALSE
is.nan(c(1, NA, NaN, 3))    # → FALSE FALSE TRUE FALSE
```

:::warning[Don't Use `==` to Test for NA]
```r
x <- NA
x == NA      # → NA   (WRONG — always returns NA, not TRUE/FALSE)
is.na(x)     # → TRUE (CORRECT)
```
:::


### Removing / Filtering NAs

```r
x <- c(1, NA, 3, NA, 5)

x[!is.na(x)]                          # → 1 3 5
complete.cases(x)                     # → TRUE FALSE TRUE FALSE TRUE
df[complete.cases(df), ]              # Keep only rows with no NAs in data frame
```

### Imputing Missing Values

```r
x[is.na(x)] <- mean(x, na.rm = TRUE)    # Replace NAs with column mean
```

---

## Sequences of Numbers

```r
1:20                          # Integers 1 to 20
20:1                          # Descending: 20 down to 1

seq(1, 10, by = 0.5)         # 1.0 1.5 2.0 ... 10.0
seq(0, 1, length = 11)       # 11 equally spaced values between 0 and 1

length(x)                     # Number of elements
seq_along(x)                  # Indices matching x: 1 2 3 ... length(x)
seq_len(5)                    # → 1 2 3 4 5

rep(0, times = 5)             # → 0 0 0 0 0
rep(c(1, 2), times = 3)       # → 1 2 1 2 1 2
rep(c(1, 2), each = 3)        # → 1 1 1 2 2 2
```

:::tip[Prefer `seq_len()` over `1:n` in Loops]
If `n = 0`, `1:n` gives `c(1, 0)` (unexpected!), while `seq_len(0)` gives `integer(0)` (correct empty sequence).
:::


---

## Subsetting

:::info[R Uses 1-Based Indexing]
- `x[0]` returns `numeric(0)` — not an error, just empty
- `x[9999]` returns `NA` if out of bounds — not an error
:::


### Operators

| Operator | Returns | Best for |
|----------|---------|----------|
| `[ ]` | Same class as input; can select **multiple** elements | Vectors, matrices |
| `****` | Single element; returned class may differ | Lists, data frames |
| `$` | Named element by name | Lists, data frames |

### Vectors

```r
x <- c(10, 20, 30, 40, 50)

x[2]              # → 20
x[1:3]            # → 10 20 30
x[c(1, 3, 5)]     # → 10 30 50
x[-c(2, 4)]       # → 10 30 50  (everything EXCEPT 2nd and 4th)
x[x > 25]         # → 30 40 50

# Named vectors
v <- c(a = 1, b = 2, c = 3)
v["b"]            # → 2
identical(v["a"], v["a"])    # → TRUE
```

### Lists

```r
lst <- list(name = "Bob", scores = c(80, 90, 70))

lst[1]            # Returns LIST containing name element
lst**1**          # Returns "Bob" (the value itself)
lst**"name"**     # Returns "Bob"
lst$name          # Returns "Bob"

lst[c(1, 2)]      # Extract multiple elements — returns a LIST
lst**c(1, 2)**    # Nested: 2nd element of 1st element
```

### Matrices

```r
m <- matrix(1:9, 3, 3)

m[1, 2]               # Element at row 1, col 2
m[, 2]                # Entire 2nd column (returned as vector)
m[1, ]                # Entire 1st row (returned as vector)
m[1, 2, drop = FALSE] # Keep as 1×1 matrix instead of scalar
```

### Partial Matching

```r
x <- list(alphabet = letters)

x$alpha              # → matches "alphabet" ($ partial-matches)
x**"alpha"**         # → NULL (strict by default)
x**"alpha", exact = FALSE**  # → matches "alphabet"
```

---

## Logic

```r
# Comparison operators
5 > 3          # TRUE
5 == 5         # TRUE
5 != 4         # TRUE
5 >= 5         # TRUE

# Logical operators
TRUE & FALSE   # FALSE  (AND — evaluates all elements)
TRUE | FALSE   # TRUE   (OR  — evaluates all elements)
!TRUE          # FALSE  (NOT)

# Short-circuit operators (only check first element of vector)
TRUE && FALSE  # FALSE
TRUE || FALSE  # TRUE
```

:::warning[`&` vs `&&`]
- `&` / `|` operate **element-wise** on entire vectors
- `&&` / `||` evaluate **only the first element** — used in `if` conditions
```r
c(TRUE, FALSE) & c(TRUE, TRUE)    # → TRUE FALSE
c(TRUE, FALSE) && c(TRUE, TRUE)   # → TRUE  (only first elements compared)
```
:::


:::note[Operator Precedence]
All `AND` (`&`, `&&`) operators are evaluated **before** `OR` (`|`, `||`).
:::


### Useful Logic Functions

```r
x <- c(3, 1, 4, 1, 5, 9, 2, 6)

which(x > 4)          # → 5 6 8  (indices where condition is TRUE)
any(x > 8)            # → TRUE   (at least one element satisfies)
all(x > 0)            # → TRUE   (all elements satisfy)
isTRUE(1 == 1)        # → TRUE
xor(TRUE, FALSE)      # → TRUE   (exactly one must be TRUE)
```

---

## Understanding Data

```r
class(df)             # Class of object: "data.frame", "matrix", etc.
dim(df)               # Dimensions: rows × columns
nrow(df)              # Number of rows
ncol(df)              # Number of columns
names(df)             # Column names
object.size(df)       # Memory usage

head(df, 10)          # First 10 rows (default: 6)
tail(df, 10)          # Last 10 rows

summary(df)           # Min, max, mean, median for numerics; counts for factors
str(df)               # Compact structure: class, dimensions, variable preview
table(df$category)    # Frequency table for a categorical variable
View(df)              # Open interactive viewer (RStudio)
```

:::tip[EDA Order]
A good exploratory data analysis sequence:
1. `dim()` → how big is it?
2. `str()` → what types are the columns?
3. `summary()` → any unexpected ranges or NAs?
4. `head()` / `tail()` → does it look right?
:::


---

## Split-Apply-Combine Functions

:::info[The Strategy]
Loop functions in R implement the **Split → Apply → Combine** pattern efficiently — avoiding explicit `for` loops.
:::


### `split()`

```r
x <- c(1, 2, 3, 4, 5, 6)
f <- c("a", "b", "a", "b", "a", "b")
split(x, f)
# $a: 1 3 5
# $b: 2 4 6

gl(3, 2)    # Factor with 3 levels, each repeated 2 times: 1 1 2 2 3 3
```

### `apply()`

```r
m <- matrix(1:12, nrow = 3)

apply(m, 1, sum)              # Row sums
apply(m, 2, mean)             # Column means
apply(m, 1, quantile, probs = c(0.25, 0.75))   # Row quartiles
```

### `lapply()` — Always Returns a List

```r
lst <- list(a = 1:5, b = 6:10, c = 11:15)

lapply(lst, mean)                   # Mean of each element → list
lapply(lst, function(x) x[2])      # Anonymous function: extract 2nd element
```

### `sapply()` — Simplifies the Result

```r
sapply(lst, mean)    # → named numeric vector (not a list)
sapply(lst, range)   # → matrix (2 rows: min and max per element)
```

:::tip[`sapply` vs `lapply`]
- `sapply()` = smart simplification of `lapply()` output
- If result has equal-length vectors → **matrix**
- If result has length-1 vectors → **named vector**
- If result is irregular → **list** (same as `lapply`)
:::


### `vapply()` — Type-Safe Apply

```r
vapply(lst, mean, numeric(1))         # Expects a single numeric per element
vapply(df, class, character(1))       # Returns class of each column
```

:::warning[Prefer `vapply()` in Production Code]
Unlike `sapply()`, `vapply()` checks the output type and **errors on mismatch** — making bugs easier to catch.
:::


### `tapply()` — Apply Over Groups

```r
scores <- c(85, 90, 78, 92, 88)
group  <- c("A", "B", "A", "B", "A")

tapply(scores, group, mean)
# A: 83.67   B: 91.00
```

### `mapply()` — Multivariate Apply

```r
mapply(rep, 1:4, 4:1)
# 1 1 1 1 | 2 2 2 | 3 3 | 4
```

### `aggregate()` — Summary by Groups

```r
aggregate(
  list(mean_score = df$score),
  list(group = df$group, gender = df$gender),
  mean, na.rm = TRUE
)
```

---

## Reading Tabular Data

### Reading Functions

```r
read.table("data.txt")          # General text file → data frame
read.csv("data.csv")            # CSV → data frame (sep=",", header=TRUE)
readLines("notes.txt")          # Read lines → character vector
source("script.R")              # Execute R code from file
dget("object.R")                # Reconstruct deparsed R object
load("workspace.RData")         # Load binary saved objects
```

### Writing Functions

```r
write.table(df, "output.txt", sep = "\t")
writeLines(text_vector, "output.txt")
dput(obj, file = "obj.R")       # Serialize one object to R code
dump(c("df", "model"), file = "objects.R")   # Multiple objects
save(df, file = "df.RData")     # Binary save
```

### `read.table()` Arguments

| Argument | Description |
|----------|-------------|
| `file` | File path or connection |
| `header` | Does the first row contain column names? |
| `sep` | Column separator (default: any whitespace) |
| `colClasses` | Character vector specifying column types |
| `nrows` | Number of rows to read |
| `comment.char` | Character marking comment lines (default: `"#"`) |
| `skip` | Lines to skip at the start |
| `stringsAsFactors` | Convert strings to factors? (default: `TRUE` in old R) |

### Reading Large Files Efficiently

```r
# Step 1: Infer column classes from a small sample
initial  <- read.table("big_data.txt", nrows = 100)
classes  <- sapply(initial, class)

# Step 2: Read full file with known classes (much faster)
full_df  <- read.table("big_data.txt", colClasses = classes, comment.char = "")
```

:::tip[Memory Estimate for Large Files]
Required RAM ≈ `numRows × numCols × 8 bytes` → convert to GB → **double it** for overhead.
```
1,500,000 rows × 120 cols × 8 bytes = ~1.34 GB → need ~2.7 GB free RAM
```
:::


### Textual vs Binary Formats

```r
# Textual (human-readable, preserves metadata)
dput(model, file = "model.R")       # Serialize to R code
dget("model.R")                     # Reconstruct from file
dump(c("x", "y"), "vars.R")         # Serialize multiple objects
source("vars.R")                    # Load them back

# Connections
con <- url("https://example.com/data.csv")     # Read from web
con <- file("data.txt.gz")                     # Uncompressed
con <- gzfile("data.txt.gz")                   # gzip compressed
con <- bzfile("data.txt.bz2")                  # bzip2 compressed

download.file(fileURL, destfile = "data.csv", method = "curl")
```

---

## Control Structures

:::info[Control Flow Summary]
| Structure | Use case |
|-----------|---------|
| `if / else` | Branch on a condition |
| `for` | Loop a fixed number of times |
| `while` | Loop while condition holds |
| `repeat` | Infinite loop (needs `break`) |
| `next` | Skip to next iteration |
| `break` | Exit the loop |
| `return` | Exit a function |
:::


:::tip[Prefer Apply Functions for Data]
In R, `apply`, `lapply`, `sapply` etc. are faster and more idiomatic than explicit `for` loops for working over data structures.
:::


### `if / else`

```r
x <- 7

if (x > 10) {
  print("big")
} else if (x > 5) {
  print("medium")
} else {
  print("small")
}
# → "medium"

# Inline assignment
label <- if (x > 5) "high" else "low"
```

### `for`

```r
for (i in 1:5) {
  print(i)
}

# Iterating over a matrix
m <- matrix(1:6, 2, 3)
for (i in seq_len(nrow(m))) {
  for (j in seq_len(ncol(m))) {
    cat("m[", i, ",", j, "] =", m[i, j], "\n")
  }
}
```

### `while`

```r
count <- 0
while (count < 5) {
  cat("count =", count, "\n")
  count <- count + 1
}
```

### `repeat` and `break`

```r
x0 <- 1
tol <- 0.001

repeat {
  x1 <- computeEstimate()
  if (abs(x1 - x0) < tol) {
    break
  }
  x0 <- x1
}
```

:::danger[`repeat` Has No Automatic Exit]
A `repeat` loop will run forever if `break` is never reached. Always add a safeguard like a maximum iteration count.
:::


### `next` — Skip an Iteration

```r
for (i in 1:10) {
  if (i %% 2 == 0) next    # Skip even numbers
  print(i)
}
# → 1 3 5 7 9
```

---

## Functions

```r
power <- function(base, exponent = 2) {
  base ^ exponent     # Returns the last evaluated expression
}

power(3)        # → 9   (uses default exponent = 2)
power(3, 3)     # → 27
power(exponent = 3, base = 2)   # Named arguments (order doesn't matter)
```

:::note[Functions as First-Class Objects]
Functions can be:
- Passed as arguments to other functions
- Returned from functions
- Stored in variables
- Defined anonymously inline (e.g., in `lapply`)
:::


### Argument Matching Order

1. **Exact** name match
2. **Partial** name match
3. **Positional** match

```r
f <- function(alpha, beta, gamma) paste(alpha, beta, gamma)

f(1, g = 3, al = 2)    # → "2 1 3"  (partial match: al→alpha, g→gamma)
```

### Inspecting Functions

```r
formals(lm)     # List of all formal arguments with defaults
args(lm)        # Display argument list (compact)
body(lm)        # Function body
```

### Lazy Evaluation

```r
f <- function(a, b) {
  a ^ 2           # b is never used
}
f(5)             # → 25  (no error, b is never evaluated)
```

:::info[Lazy Evaluation]
R evaluates function arguments **only when they are actually needed**. This enables efficient code and allows default arguments to reference other arguments.
:::


### `...` (Dots) Argument

```r
my_print <- function(x, ...) {
  cat("Value:", x, "\n")
  message(...)        # Pass extras to message()
}

my_print(42, "extra", "info")
```

:::warning[Arguments After `...`]
Any argument after `...` **must be fully named** — they cannot be positionally or partially matched.
```r
paste("a", "b", "c", sep = "-")    # sep comes after ... → must be named
```
:::


---

## Scoping

:::info[Lexical (Static) Scoping]
R uses **lexical scoping**: free variables in a function are looked up in the **environment where the function was defined**, not where it was called.
:::


### Key Terms

- **Free variable** — a variable used in a function body that is not a local variable or argument
- **Environment** — a collection of symbol/value pairs (like a named list)
- **Closure** — a function bundled together with its enclosing environment

### Search Order for Free Variables

```
1. Environment where the function was defined
2. Its parent environment
3. ... (walk up the chain)
4. Global environment (.GlobalEnv)
5. Loaded package namespaces
6. Empty environment → ERROR
```

### R Search Path (for packages)

```r
search()
# [1] ".GlobalEnv"        "package:ggplot2"  "package:stats"
# [2] "package:graphics"  "package:grDevices" "package:utils"
# [3] "package:datasets"  "package:methods"   "Autoloads"
# [4] "package:base"
```

:::note[`library()` inserts a package at **position 2** of the search path, right after `.GlobalEnv`.]
:::


### Lexical vs Dynamic Scoping Example

```r
y <- 10

f <- function(x) {
  y <- 2
  y^2 + g(x)     # g is a free variable — found in global env
}

g <- function(x) {
  x * y          # y is a free variable — found where g was defined (global): y = 10
}

f(3)
# Lexical:  y^2 + g(3) = 4 + 3*10 = 34
# Dynamic would give: 4 + 3*2 = 10 (y from f's environment)
```

---

## Simulation

```r
set.seed(42)                    # Set seed for reproducibility
sample(1:10, 5)                 # Sample 5 values without replacement
sample(1:10, 5, replace = TRUE) # Sample with replacement
sample(letters)                 # Permute/shuffle a vector
```

### Probability Distribution Functions

| Prefix | Purpose | Example |
|--------|---------|---------|
| `r***` | Random sampling | `rnorm(100)` |
| `d***` | Density / PMF | `dnorm(0)` |
| `p***` | CDF (cumulative probability) | `pnorm(1.96)` → ~0.975 |
| `q***` | Quantile (inverse CDF) | `qnorm(0.975)` → ~1.96 |

### Common Distributions

```r
# Normal
rnorm(100, mean = 0, sd = 1)
pnorm(1.96)       # P(X ≤ 1.96) for standard normal → 0.975
qnorm(0.975)      # → 1.96

# Binomial
rbinom(10, size = 20, prob = 0.5)   # 10 trials, n=20, p=0.5
pbinom(8, 20, 0.5)                  # P(X ≤ 8)

# Poisson
rpois(50, lambda = 3)
ppois(2, lambda = 2)                # P(X ≤ 2) → 0.677
```

### Simulating Models

```r
# Linear model: y = 0.5 + 2x + ε
set.seed(20)
x <- rnorm(100)
e <- rnorm(100, mean = 0, sd = 2)
y <- 0.5 + 2*x + e
plot(x, y)

# Poisson model: log(μ) = 0.5 + 0.3x
x <- rnorm(100)
log.mu <- 0.5 + 0.3 * x
y <- rpois(100, exp(log.mu))
```

```r
replicate(5, mean(rnorm(100)))    # Repeat an expression 5 times → vector
```

---

## Dates and Times

| Class | Storage | Use case |
|-------|---------|---------|
| `Date` | Days since 1970-01-01 | Date only |
| `POSIXct` | Seconds since 1970-01-01 | Datetime (compact) |
| `POSIXlt` | Named list (sec, min, hour, ...) | Datetime (decomposed) |

```r
Sys.Date()                           # Today's date
Sys.time()                           # Current datetime (POSIXct)

d <- as.Date("2024-01-15")           # Parse a date string
t <- as.POSIXlt(Sys.time())
t$min                                # Extract minutes (POSIXlt only)

weekdays(d)                          # → "Monday"
months(d)                            # → "January"
quarters(d)                          # → "Q1"

strptime("March 9, 2026 14:30", "%B %d, %Y %H:%M")   # Parse custom format
difftime(as.Date("2026-12-31"), Sys.Date(), units = "days")   # Days remaining
unclass(Sys.Date())                  # Internal integer representation
```

:::tip[Date Arithmetic]
```r
as.Date("2026-12-31") - Sys.Date()    # Returns difftime object
as.Date("2026-01-01") + 30            # Add 30 days
```
:::


---

## Base Graphics

```r
# Load a built-in dataset
data(airquality)

# Scatter plot
plot(airquality$Wind, airquality$Ozone,
     xlab = "Wind Speed",
     ylab = "Ozone Level",
     main = "Wind vs Ozone",
     col  = "steelblue",
     pch  = 19)       # pch: point shape (19 = filled circle)

# Boxplot
boxplot(Ozone ~ Month, data = airquality,
        xlab = "Month", ylab = "Ozone",
        col = "lightblue")

# Histogram
hist(airquality$Temp, breaks = 15,
     xlab = "Temperature", main = "Temp Distribution",
     col = "salmon")
```

:::tip[Common `pch` Values]
`pch = 1` circle | `pch = 2` triangle | `pch = 15` filled square | `pch = 19` filled circle | `pch = 20` small dot
:::


---

## Debugging

| Tool | Type | Effect |
|------|------|--------|
| `message()` | Notification | Prints to stderr; execution continues |
| `warning()` | Warning | Recorded; execution continues |
| `stop()` | Error | Execution halts immediately |
| `invisible(x)` | Suppressor | Returns value without autoprinting |

```r
traceback()          # Print call stack after an error (call immediately after error)
debug(myFunction)    # Step through function line by line
browser()            # Insert a breakpoint — drops into interactive mode
trace(f, at = 3)     # Insert code at line 3 of function f
recover()            # Freeze at error for inspection
options(error = recover)    # Enable globally for all errors
```

:::tip[Debugging Workflow]
1. `traceback()` — where did it fail?
2. `debug(fn)` — step through the function
3. `browser()` — add a breakpoint inside the function
4. `set.seed()` — reproduce random issues
:::


:::warning[Reproducibility with Random Code]
Always use `set.seed()` before any random operation when debugging — otherwise you cannot reproduce the issue.
:::


---

## R Profiler

```r
# Measure total time for an expression
system.time({
  x <- rnorm(1e6)
  mean(x)
})
# user  system elapsed
# 0.12    0.01    0.13
```

:::info[Time Interpretation]
- **User time** = CPU time consumed by R
- **Elapsed time** = real clock time you waited
- `elapsed > user` → CPU waiting on something (e.g., network, disk)
- `elapsed &lt; user` → parallel/multi-core computation
:::


### `Rprof()` — Detailed Profiling

```r
Rprof("profile.out")          # Start profiling (records every 0.02s)
# ... code to profile ...
Rprof(NULL)                   # Stop profiling

summaryRprof("profile.out")
# $by.self      ← shows time per function EXCLUDING sub-calls (most useful)
# $by.total     ← shows time per function INCLUDING sub-calls
# $sample.interval  ← 0.02 seconds
# $sampling.time    ← total time profiled
```

:::warning[Don't Mix `system.time()` and `Rprof()`]
Using both simultaneously gives misleading results. Use one or the other.
:::


:::note[C/Fortran Code is Not Profiled]
`Rprof()` only profiles R-level code. Time spent inside compiled C or Fortran functions shows up as the calling R function's time.
:::


---

## Miscellaneous

```r
unlist(my_list)                    # Flatten a list to a vector
ls("package:stats")                # List all functions in a package
do.call(paste, list("a","b","c"))  # Call a function with a list of args
Reduce("+", 1:5)                   # Fold/accumulate: 1+2+3+4+5 = 15
Filter(function(x) x > 3, 1:6)    # → 4 5 6
Map("+", 1:3, 4:6)                 # → list(5, 7, 9)  (element-wise)
```
