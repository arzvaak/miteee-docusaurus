# Data Scientist's Toolbox — Course Notes

---

## CLI (Command Line Interface)

### Special Directories

| Symbol | Meaning |
|--------|---------|
| `/` | Root directory (top of the filesystem) |
| `~` | Home directory (your user folder) |

### Navigation & Info

```bash
pwd        # Print working directory (shows where you are)
clear      # Clear the terminal screen

ls         # List files in current directory
ls -a      # Include hidden files (dotfiles)
ls -l      # Long format — shows permissions, size, date

cd Documents          # Change into a folder
cd ..                 # Go up one level
cd ~                  # Go to home directory
```

### Creating & Removing

```bash
mkdir myFolder                    # Create a directory
touch notes.txt                   # Create an empty file
echo "Hello World"                # Print text to screen
date                              # Print current date and time
```

```bash
rm file.txt                       # Remove a file (no undo!)
rm -r myFolder                    # Remove an entire directory recursively
```

:::danger[`rm -r` is Permanent]
There is **no recycle bin** in the CLI. Deleted files are gone forever. Always double-check before running `rm -r`.
:::


### Copying & Moving

```bash
cp report.txt Backup/             # Copy file into a directory
cp -r ProjectA/ ProjectB/         # Copy entire directory recursively (-r = recursive)

mv report.txt Archive/            # Move file to another directory
mv oldName.txt newName.txt        # Rename a file
```

:::tip[Quick Rename Trick]
`mv` can rename files in-place — just provide the new name as the destination.
```bash
mv draft.md final.md    # Renames draft.md to final.md
```
:::


---

## GitHub

:::info[Git Workflow Overview]
```
1. Make edits in your workspace
2. Stage your changes (git add)
3. Commit to local repository (git commit)
4. Push to remote repository on GitHub (git push)
```
:::


### Staging Changes

```bash
git add .        # Stage all new/modified files
git add -u       # Stage renamed or deleted files
git add -A       # Both — stage everything (most common)
```

### Committing & Syncing

```bash
git commit -m "Add transformer efficiency notes"   # Commit with a message
git push                                           # Push local commits to GitHub
git pull                                           # Pull latest changes from remote
```

### Branching

```bash
git checkout -b feature/new-section    # Create and switch to a new branch
git branch                             # Show current branch
git checkout master                    # Switch back to master branch
```

:::tip[Use Branches for Experiments]
Always create a new branch before making significant changes. This keeps `master` clean and lets you experiment safely.
:::


:::tip[Typical Workflow]
```bash
git checkout -b week3-notes
# ... make edits ...
git add -A
git commit -m "Add Week 3 DSP notes"
git checkout master
git merge week3-notes
git push
```
:::


---

## Markdown

| Syntax | Output |
|--------|--------|
| `# Heading` | H1 — largest |
| `## Heading` | H2 — section heading |
| `### Heading` | H3 — sub-section |
| `**bold**` | **Bold text** |
| `*italic*` | *Italic text* |
| `- item` or `* item` | Bullet list |
| `` `code` `` | Inline code |
| ```` ```r ```` | Fenced code block (R) |

:::note[Obsidian Extras]
Obsidian extends standard Markdown with callouts (`> [!note]`), internal links (`**file**`), and LaTeX math (`$...$`). These don't render on plain GitHub.
:::


---

## R Packages

:::info[Primary Repository]
R packages are hosted on **CRAN** (Comprehensive R Archive Network). It's the official, curated source.
:::


### Discovering Packages

```r
available.packages()         # List all packages available on CRAN
a <- available.packages()
head(rownames(a), 3)         # Show first 3 package names
```

### Installing Packages

```r
install.packages("ggplot2")                          # Install a single package
install.packages(c("dplyr", "tidyr", "ggplot2"))    # Install multiple at once
```

### Bioconductor (Bioinformatics)

```r
source("https://bioconductor.org/biocLite.R")
biocLite()                   # Install Bioconductor core packages
biocLite("GenomicRanges")    # Install a specific Bioconductor package
```

### Loading & Inspecting

```r
library(ggplot2)    # Load package into current session
search()            # See all loaded packages and namespaces
```

:::tip[`library()` vs `require()`]
Prefer `library()` in scripts — it throws an **error** if the package isn't found. `require()` only returns `FALSE`, which can cause silent failures downstream.
:::


---

## Types of Data Science Questions

:::info[Hierarchy — Easiest to Hardest]
**Descriptive → Exploratory → Inferential → Predictive → Causal → Mechanistic**
:::


| Type | Core Idea | Example |
|------|-----------|---------|
| **Descriptive** | Summarise and describe data as-is | Census counts, Google Ngram viewer |
| **Exploratory** | Find patterns; correlation ≠ causation | EDA on survey data |
| **Inferential** | Use a small sample to generalise to a population | Political polling |
| **Predictive** | Use X to predict Y (X predicts ≠ X causes Y) | Spam filter, house price model |
| **Causal** | Does changing X *cause* Y to change? Requires randomised studies. | RCTs in medicine |
| **Mechanistic** | Understand the exact change mechanism via equations | Circuit analysis, fluid dynamics |

:::warning[Correlation ≠ Causation]
Exploratory analysis can reveal associations, but **never implies cause**. Always consider confounding variables before drawing conclusions.
:::


:::tip[Predictive vs. Causal]
A model might show that shoe size **predicts** reading ability in children — but shoe size doesn't **cause** better reading. Age is the confounder.
:::


---

## Data

:::note[Key Definitions]
- **Data** = values of qualitative or quantitative variables, belonging to a set of items (usually a population)
- **Variables** = a measurement or characteristic of an item
- Data comes in many raw formats — it's rarely clean or structured
:::


:::tip[The Right Order]
The most important thing is the **question** — then find the *right* data to answer it. Big data is only useful if it's *relevant* data.
:::


---

## Experimental Design

### Statistical Inference Pipeline

```
Formulate question → Select sample → Run experiment →
Compute descriptive stats → Apply inferential stats → Generalise
```

:::warning[Question First, Always]
Formulate your question **before** collecting or examining data. Looking at data first and then forming a hypothesis is data dredging.
:::


### Inference Considerations

- **Variability** — lower variability + clearer differences → better, more confident decisions
- **Confounding** — a hidden variable causes an observed correlation (spurious correlation)
  - Fix: control the variable | stratify across all options | **randomise** assignment

### Prediction Considerations

- Collect observations across different variable values → build a predictive function
- Effect size matters — it can be hard to tell which distribution an observation comes from
- Similar issues apply: probability, sampling, and confounding

### Prediction Metrics

| Metric | Formula / Definition |
|--------|---------------------|
| **Sensitivity** | $\Pr(\text{positive test} \mid \text{disease})$ |
| **Specificity** | $\Pr(\text{negative test} \mid \text{no disease})$ |
| **PPV** (Positive Predictive Value) | $\Pr(\text{disease} \mid \text{positive test})$ |
| **NPV** (Negative Predictive Value) | $\Pr(\text{no disease} \mid \text{negative test})$ |
| **Accuracy** | $\Pr(\text{correct outcome})$ |

:::tip[TP / FP / FN / TN]
A COVID test result:
- **TP** — Test says positive, person has COVID ✅
- **FP** — Test says positive, person is healthy ❌ (false alarm)
- **FN** — Test says negative, person has COVID ❌ (missed case)
- **TN** — Test says negative, person is healthy ✅
:::


### Experiment Quality Checklist

:::tip[What Makes a Good Experiment]
- [ ] Has **replication** (results can be reproduced)
- [ ] Measures and accounts for **variability**
- [ ] **Generalises** the problem to the population of interest
- [ ] Is fully **transparent** in methods and reporting
:::


:::danger[Data Dredging]
**Data dredging** = mining data until you find *any* significant-looking result, then claiming it as a hypothesis. This inflates false positive rates massively and leads to irreproducible "science".
Prediction is **not** inference — never treat a fitted model as proof of causation.
:::

