---
title: "01 - Foundations of Data Science"
math_syntax: typst
---

# Chapter 01 — Foundations of Data Science

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Next: [02 - Python Fundamentals](/notes/studies-introduction-to-data-science-02---python-fundamentals)

> [!summary] Topic in one sentence
> Data science turns raw and often heterogeneous data into useful insight through collection, cleaning, transformation, analysis, visualisation and decision-making.

## 1. Data, data science and data analysis

**Data** is raw information. **Data science** combines programming, statistics and domain knowledge to uncover useful patterns for decision-making. Applications include:

- social-media recommendation;
- early diagnosis of disease;
- e-commerce recommendation and demand forecasting.

**Data analysis** is the process of collecting, cleaning, transforming, analysing and visualising data to extract meaningful insights, draw conclusions and support decisions. It applies statistical, mathematical or computational techniques to find patterns, trends and correlations.

### Data science and data analytics

Data science and data analytics overlap, but their usual emphasis differs:

| Feature | Data science | Data analytics |
| --- | --- | --- |
| Coding language | Python is presented as the most common language, alongside C++, Java, Perl and others. | Knowledge of Python and R is presented as essential. |
| Programming skills | In-depth programming knowledge. | Basic programming skills. |
| Machine learning | Often builds predictive or machine-learning models. | May use machine learning, but frequently focuses on statistical analysis and reporting. |
| Other skills | Data engineering, modelling and experimentation. | Querying, visualisation and business interpretation. |
| Scope | Broad, from collection to deployment. | Focused on answering defined questions from available data. |
| Goals | Discover patterns and build data products or models. | Explain performance and support decisions. |
| Data type | Structured, semi-structured and unstructured data. | Commonly structured data, but not limited to it. |

> [!note] Practical distinction
> Data science usually covers a wider lifecycle; data analytics is usually a more focused investigation. Neither field is defined by a single tool or data type.


## 2. The six-step data-analysis process

The six-step process diagram is shown below. The flow is: collect data, clean it, transform it, analyse it, visualise it, and use the resulting insight to support a decision.

![p006-six-steps-data-analysis](/content-assets/studies/introduction-to-data-science/Assets/Topic%2001/p006-six-steps-data-analysis.jpg)


## 3. Multimedia data

**Multimedia data** combines media types such as text, audio, images, video, graphics and animation to convey information or provide an interactive experience.

| Media type | Common formats/examples |
| --- | --- |
| Text | ASCII or Unicode |
| Image | JPEG, PNG, BMP, TIFF |
| Audio | MP3, WAV, AAC |
| Video | MP4, AVI, MKV |
| Graphics/animation | GIF, SVG, Flash |


## 4. File formats and loading data

File formats store particular kinds of information. The following examples cover CSV, XLSX, ZIP, TXT, JSON, HTML and PDF.

### CSV

Comma-separated values are plain tabular text. The Pandas reader returns a DataFrame.

```python
import pandas as pd

df = pd.read_csv("data/name.csv")
print(df)
```

### XLSX

An XLSX file is a Microsoft Excel Open XML spreadsheet, useful for tabular or financial data and mathematical models.

```python
import pandas as pd

df = pd.read_excel("data/name.xlsx")
print(df)
```

### ZIP

ZIP is a compressed data container. Pandas does not provide a general `read_zip()` reader; open the archive with Python's `zipfile` module, then pass the extracted bytes or path to the appropriate Pandas reader.

```python
from io import BytesIO
from zipfile import ZipFile
import pandas as pd

with ZipFile("data/archive.zip") as archive:
    csv_names = [name for name in archive.namelist() if name.endswith(".csv")]
    if not csv_names:
        raise ValueError("The archive contains no CSV member")
    with archive.open(csv_names[0]) as member:
        df = pd.read_csv(BytesIO(member.read()))

print(df)
```

> [!warning] Choose the inner-file reader
> A ZIP archive is only a container. After opening it, choose the reader that matches the contained file, such as `read_csv()` for CSV data.

### TXT

TXT stores plain text without rich formatting. There is no standard Pandas `read_txt()` method. For delimited text, use `read_csv()` with a separator; for one string per line, use `open()`.

```python
import pandas as pd

# Delimited text:
df = pd.read_csv("data/name.txt", sep="|")
print(df)

# Or plain lines:
with open("data/name.txt", encoding="utf-8") as file:
    lines = [line.rstrip("\n") for line in file]
print(lines)
```

### JSON

JSON (JavaScript Object Notation) is a text-based format for structured data based on JavaScript object syntax.

```python
import pandas as pd

df = pd.read_json("data/name.json")
print(df)
```

### HTML

HTML (HyperText Markup Language) is used to create web pages. read_html extracts tables and returns a list of DataFrames.

```python
import pandas as pd

tables = pd.read_html("data/page.html")
for table in tables:
    print(table)
```

### PDF

PDF (Portable Document Format) preserves a fixed page layout for distribution. `tabula.read_pdf()` can extract tables from suitable PDFs; success depends on the document's text and table structure.

```python
# Requires: pip install tabula-py
import tabula

tables = tabula.read_pdf("data/file.pdf", pages="all")
for table in tables:
    print(table)
```

> [!warning] Common file-loading mistakes
> Check the path and file extension, use the reader that matches the actual format, and inspect the returned object before analysis. A PDF or ZIP is a container; it is not automatically a DataFrame.


## 5. Sources of data

### Internal data

Internal data is captured by organisational processes, including machine-generated data from manufacturing sensors or devices. Examples:

- transactions such as customer purchases and staff pay;
- email-marketing metrics such as opens and click rates;
- customer-profile information;
- customer interactions such as email queries and support calls;
- online activity such as adding an item to a shopping cart.

### Third-party analytics

Third-party web-analytics services collect and analyse website performance over time. Examples include Google Analytics and the more privacy-oriented Piwik PRO Analytics.

### External data

External data may include historical demographics, market prices, weather conditions or social-media trends. Examples include open sources such as data.gov.uk, social-media data (Twitter, Facebook, LinkedIn), and paid sources such as Thomson Reuters or Westlaw.

### Open data

Open data is publicly accessible, usually under a licence that permits reuse. It may be highly summarised, irrelevant to the immediate question, inconveniently formatted or difficult to interpret, so preparation can still require substantial work.

Examples listed:

- government: data.gov (US), data.gov.uk (UK), data.gov.au (Australia);
- health/science: WHO, Nature scientific data, Open Science Data Cloud and Center for Open Science;
- social/search/finance: Google Trends, Yahoo Finance and Twitter data through APIs.


## 6. ETL: extract, transform, load

**ETL** combines data from multiple systems into one database, data store, warehouse or data lake. It is intended to keep warehouse data accurate, complete, current and in a format suitable for data mining and reporting.

![p016-etl-stages](/content-assets/studies/introduction-to-data-science/Assets/Topic%2001/p016-etl-stages.jpg)

### Extract

Read data from transactional systems, spreadsheets and flat files, relational databases, NoSQL systems and XML, then place it in a staging area. Loading directly into the warehouse can damage it and make rollback difficult.

### Transform

Apply rules or functions to create a consistent format. Common transformations include:

- **Filtering:** load only selected attributes.
- **Cleaning:** fill NULL values with defaults.
- **Joining:** combine attributes.
- **Splitting:** split one attribute into several.
- **Sorting:** order tuples by an attribute, usually a key.

### Load

Create the target data structures and load transformed data into the warehouse. Loads may run continuously, frequently or in scheduled batches; pipeline stages can overlap when the architecture supports it.

![p019-etl-pipeline](/content-assets/studies/introduction-to-data-science/Assets/Topic%2001/p019-etl-pipeline.jpg)

### ETL tools and trade-offs

| Category | Items listed |
| --- | --- |
| ETL tools | Hevo, Sybase, Oracle Warehouse Builder, CloverETL, MarkLogic |
| Data warehouses | Snowflake, Redshift, BigQuery, Firebolt |
| Advantages | Improved data quality; better data integration; increased automation |
| Disadvantages | High cost; complexity; limited flexibility |


## 7. Popular Python libraries

| Area | Library | Typical role |
| --- | --- | --- |
| Analysis/manipulation | Pandas | Tabular data manipulation and analysis with DataFrames |
| Analysis/manipulation | NumPy | Numerical computing and multidimensional arrays |
| Visualisation | Matplotlib | Line plots, bar charts, scatter plots, histograms and more |
| Visualisation | Seaborn | Statistical visualisation built on Matplotlib |
| Machine learning | Scikit-learn | Classification, regression, clustering and model evaluation |
| Machine learning | TensorFlow | Large-scale deep learning and neural networks |
| Machine learning | PyTorch | Flexible, dynamic deep learning |
| Web development | Flask | Lightweight framework for small apps/APIs |
| Web development | Django | Full-stack framework with admin, ORM and authentication |
| Web scraping | BeautifulSoup | Parse/extract HTML or XML |
| Web scraping | Scrapy | Web crawling and scraping |
| Image processing | OpenCV | Computer vision and image processing |
| Image processing | Pillow | Resizing, cropping and filters |


## 8. Practice exercises

The following prompts are based on the exercises in the course material. The complete worked answers are in [Practice exercises](/notes/studies-introduction-to-data-science-01---foundations-of-data-science#8.-practice-exercises).

### Arrays

**Question:** “Write a python code to perform the following operations: Display an array with rank 1; Display an array with rank 2; Display an array with rank 3; Add 1 to all the elements of an array a.”

```python
import numpy as np

a = np.array([1, 2, 3])                       # rank 1
b = np.array([[1, 2], [3, 4]])                # rank 2
c = np.array([[[1], [2]], [[3], [4]]])        # rank 3

print(a)
print(b)
print(c)
print("a + 1 =", a + 1)
```

The ranks are a.ndim == 1, b.ndim == 2 and c.ndim == 3. The expression a + 1 uses broadcasting, so 1 is added elementwise.

### Arithmetic, indexing and decisions

**Question:** “Subtract 2 from all the elements of an array b.”

**Answer:**

```python
import numpy as np

b = np.array([[4, 5], [6, 7]])
print(b - 2)
```

**Question:** “Sum of all the elements of matrix a.”

**Answer:** use a.sum() (or np.sum(a)).

**Question:** “Identify the 2nd row, 3rd element from the given matrix a.”

**Answer:** Python indexes from zero, so the 2nd row and 3rd element are a[1, 2].

```python
a = np.array([[10, 11, 12], [20, 21, 22]])
print(a.sum())      # all elements
print(a[1, 2])      # 2nd row, 3rd element: 22
```

**Question:** “Take the input a and b from the customer and perform sum and difference of numbers and display the result.”

```python
a = float(input("Enter a: "))
b = float(input("Enter b: "))
print("sum =", a + b)
print("difference =", a - b)
```

**Question:** “Check the number a is even or odd.”

```python
a = int(input("Enter an integer: "))
if a % 2 == 0:
    print("Even")
else:
    print("Odd")
```

### Strings, Fibonacci and guessing

**Question:** “Generate a Fibonacci series upto n:”

```python
n = int(input("How many terms? "))
a, b = 0, 1
for _ in range(n):
    print(a, end=" ")
    a, b = b, a + b
print()
```

**Question:** “Cout [count] the number of vowels in the given string.”

```python
text = input("Enter a string: ")
vowels = sum(character.lower() in "aeiou" for character in text)
print("vowels =", vowels)
```

**Question:** “Count the number of capital letters and small letters in the given string.”

```python
text = input("Enter a string: ")
capital = sum(character.isupper() for character in text)
small = sum(character.islower() for character in text)
print("capital letters =", capital)
print("small letters =", small)
```

**Question:** “Code to Guess the random number generated.”

```python
import random

secret = random.randint(1, 10)
while True:
    guess = int(input("Guess a number from 1 to 10: "))
    if guess == secret:
        print("Correct!")
        break
    if guess < secret:
        print("Too low")
    else:
        print("Too high")
```

> [!tip] Common exercise mistakes
> Keep array indexing zero-based (a[1, 2] for the requested second-row, third-element), use % 2 for parity, and update both Fibonacci variables together so the old value is not lost.

## 9. Important corrections and cautions

- Pandas has no general `read_zip()` or `read_txt()` function. Read the file inside a ZIP archive explicitly, and use `read_csv()` with the correct delimiter for structured text.
- PDF is intended for fixed-layout sharing, but it can still be edited with suitable software; it is not inherently tamper-proof.
- JPEG is the standard image format name.

## 10. Question bank

### Questions from class material

Use these as closed-book coding drills. The complete worked answers are in [Practice exercises](/notes/studies-introduction-to-data-science-01---foundations-of-data-science#8.-practice-exercises).

1. Create NumPy arrays of rank 1, rank 2 and rank 3, then add 1 to every element of an array. [Worked answer](/notes/studies-introduction-to-data-science-01---foundations-of-data-science#arrays)
2. Subtract 2 from every element of an array.
3. Find the sum of every element in a matrix.
4. Select the element in the second row and third column of a matrix.
5. Read two numbers, then display their sum and difference.
6. Determine whether an entered integer is even or odd.
7. Generate the first $n$ terms of the Fibonacci sequence.
8. Count the vowels in a string.
9. Count uppercase and lowercase letters separately.
10. Build a number-guessing program for a randomly generated number. [Worked answers](/notes/studies-introduction-to-data-science-01---foundations-of-data-science#arithmetic%2C-indexing-and-decisions)

### Extra practice

1. **Data volume, 4 marks.** A network has 250 sensors. Every sensor records two values per minute. Each stored record occupies 16 bytes. Find the number of records and uncompressed storage required for 30 days. If compression is 4:1, find the compressed size.

   > [!success]- Answer
   > Records $= 250 times 2 times 60 times 24 times 30 = 21,600,000$. Uncompressed storage $= 21,600,000 times 16 = 345,600,000$ bytes, or 345.6 MB in decimal units. At 4:1 compression, storage $= 86.4$ MB.

2. **ETL row count, 4 marks.** An extracted table contains 12,000 rows. The transform stage removes 3% exact duplicates. It then removes 5% of the remaining rows because the target field is missing. How many rows reach the load stage?

   > [!success]- Answer
   > Duplicate removal leaves $12,000 times 0.97 = 11,640$ rows. Missing-value removal leaves $11,640 times 0.95 = 11,058$ rows. Percentages are sequential, so subtracting 8% directly would be wrong.

3. **Image storage, 3 marks.** An uncompressed RGB image is 1920 × 1080 pixels with 8 bits per channel. Calculate its size in bytes and MiB.

   > [!success]- Answer
   > Three channels at one byte per channel give $1920 times 1080 times 3 = 6,220,800$ bytes. Dividing by $1024^2$ gives approximately 5.93 MiB.

4. **Transfer time, 2 marks.** A 2 GB CSV file is read at 25 MB/s. Using decimal units, estimate the minimum read time.

   > [!success]- Answer
   > $2000 / 25 = 80$ seconds. Real processing normally takes longer because parsing and type conversion add overhead.

5. **Pipeline design, 6 marks.** A college receives attendance as CSV, student details as XLSX and event logs as JSON. Design an ETL pipeline that produces one analysis-ready table. State one validation at each stage.

   > [!success]- Answer outline
   > Extract each format with the matching reader and preserve untouched raw copies. Transform by standardising student IDs, dates, column names and missing-value codes, then join on the validated student ID. Validate file counts during extraction, uniqueness and types during transformation, and row counts plus referential integrity after loading.

6. **Format choice, 4 marks.** Choose CSV, JSON, XLSX or ZIP for each case and justify it: a flat machine-readable table, nested API data, a workbook with formulas and formatting, and a bundle of 20 related files.

   > [!success]- Answer
   > CSV for the flat table, JSON for nested API data, XLSX for formulas and workbook presentation, and ZIP for bundling/compressing several files. ZIP is a container, not a tabular data format.
