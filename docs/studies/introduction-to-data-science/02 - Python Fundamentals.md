---
title: "02 - Python Fundamentals"
math_syntax: typst
---

# Chapter 02 — Python Fundamentals

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [01 - Foundations of Data Science](/notes/studies-introduction-to-data-science-01---foundations-of-data-science) · Next: [03 - NumPy and Image Processing](/notes/studies-introduction-to-data-science-03---numpy-and-image-processing)

> [!summary] Topic in one sentence
> Python uses readable syntax, dynamic typing and indentation-based blocks; this topic builds from expressions and data types to collections, control flow and functions.

## 1. What Python is and where it is used

Python is a high-level, interpreted programming language known for readable syntax, a large ecosystem and broad use in automation, web development, data science and machine learning.

Uses listed:

- web development;
- data science;
- machine learning;
- software development;
- game development;
- cryptography;
- user-interface development.

Python is popular in AI and data science because of its large library ecosystem, extensive documentation and integration with common data tools.


## 2. Development platforms and setup

Platforms listed:

- Python IDLE — [python.org](https://www.python.org/)
- Jupyter Notebook — [jupyter.org](https://jupyter.org/)
- Spyder — [spyder-ide.org](https://www.spyder-ide.org/)
- Visual Studio — [visualstudio.microsoft.com](https://visualstudio.microsoft.com/)
- PyCharm — [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)
- Google Colaboratory — [colab.research.google.com](https://colab.research.google.com/)
- Kaggle — [kaggle.com](https://www.kaggle.com/)

A basic local setup sequence is:

1. Visit python.org.
2. Open Downloads and download Python 3.12.
3. Install Python.
4. Run IDLE.

IDLE is described as a Windows-oriented integrated development environment with two main windows: a multi-window text editor and a Python shell.


## 3. Basic syntax and a sample program

This sample demonstrates assignment, arithmetic, strings, floating-point values, printing, a conditional and string concatenation:

```python
x = 34 - 23
y = "Hello"
z = 3.45

print(x)
print(y)
print(z)

if z == 3.45 or y == "Hello":
    x = x + 1
    y = y + " World"

print(x)
print(y)
```

Expected final values are x = 12 and y = Hello World. The condition is true because both comparisons are true in this example.

### Core syntax rules

- Indentation carries meaning and marks a block.
- The first assignment creates a variable.
- Variable types do not need to be declared; Python determines them at runtime.
- Assignment uses =; comparison uses ==.
- Numeric operators +, -, *, / and % behave as expected.
- Plus also concatenates strings.
- Logical operators are words: and, or and not.
- print displays values.

> [!warning] Common mistakes
> A missing indent after if raises a syntax error; using = where a comparison is intended changes the meaning; adding a number to a string is invalid unless the number is converted first.


## 4. Basic data types

### Numeric types

| Type | Meaning | Example |
| --- | --- | --- |
| int | Whole numbers, positive or negative, with arbitrary precision | age = 30 |
| float | Real numbers with decimal points | price = 19.99 |
| complex | Real and imaginary parts, written a + bj | z = 1 + 2j |

### Text and sequence types

| Type | Meaning | Example |
| --- | --- | --- |
| str | Character sequence in single or double quotes | name = "Alice" |
| list | Ordered, mutable collection; duplicates allowed | fruits = ["apple", "banana", "cherry"] |
| tuple | Ordered, immutable collection; duplicates allowed | coordinates = (10, 20) |
| range | Immutable number sequence, often used in loops | numbers = range(5) |

range(5) produces 0, 1, 2, 3, 4 when iterated.

### Mapping, set, Boolean, binary and None

- **dict:** key-value collection; keys are unique and immutable. Example: person = {"name": "Bob", "age": 25}.
- **set:** unordered collection with no duplicate members; its elements must be hashable. Example: unique_numbers = {1, 2, 3}.
- **frozenset:** immutable set.
- **bool:** True or False.
- **bytes:** immutable byte sequence.
- **bytearray:** mutable byte sequence.
- **NoneType:** represents absence of a value; its only value is None.

Use type to inspect an object:

```python
x = 10
print(type(x))
# <class 'int'>
```


## 5. Names, reserved words and assignment

Names are case-sensitive and cannot start with a number. They may contain letters, numbers and underscores. For example, `bob`, `Bob`, `_bob`, `_2_bob_`, `bob_2` and `BoB` are distinct names.

Common reserved words include:

and, assert, break, class, continue, def, del, elif, else, except, exec, finally, for, from, global, if, import, in, is, lambda, not, or, pass, print, raise, return, try, while.

Multiple assignment and swapping:

```python
x, y = 2, 3
print(x)  # 2
print(y)  # 3

x, y = y, x
print(x, y)  # 3 2

a = b = x = 2
print(a, b, x)
```

> [!tip] Naming habit
> Use descriptive lowercase names with underscores for ordinary variables, and remember that a capitalised name is not the same variable as its lowercase spelling.


## 6. Escape sequences

An escape sequence begins with a backslash and represents a character or formatting instruction that would be difficult to type directly.

| Sequence | Meaning | Example result |
| --- | --- | --- |
| newline | Move to the next line | Hello, then World |
| tab | Horizontal tab | Name:    John Doe |
| backslash | Literal backslash | C:\Program Files\MyFolder |
| single quote | Literal single quote | Useful inside a single-quoted string |
| double quote | Literal double quote | Useful inside a double-quoted string |

Runnable examples:

```python
print("Hello\nWorld")
print("Name:\tJohn Doe")
print("C:\\Program Files\\MyFolder")
print("It\'s a beautiful day.")
print('He said, "Hello!"')
```

The visual spacing of a tab depends on the environment; it is not a fixed number of ordinary spaces.


## 7. Data structures

### Sequence structures

| Structure | Description | Example |
| --- | --- | --- |
| Tuple | Immutable ordered sequence; mixed types are allowed | ('Times', 32, 3.2) |
| String | Not directly mutable; conceptually similar to a tuple | "Anirban Dasgupta" |
| List | Mutable ordered sequence of mixed types | [1, 'Delhi', ('up', 'down')] |
| Set | Order is not important; duplicates are removed | {"apple", "banana", "cherry"} |

### Sets

A set is unordered and contains unique elements. Elements can be added or removed after creation, while the elements themselves must be immutable/hashable. Adding the same value more than once keeps one instance.

```python
items = {"apple", "banana", "apple"}
items.add("cherry")
items.remove("banana")
print(items)
```

### Dictionaries

A dictionary stores key-value pairs and is accessed by key, like a hash table:

```python
person = {
    "Name": "Anirban",
    "Lecture": 1,
    "Course": "Python",
}
print(person["Course"])
```

Modern Python preserves dictionary insertion order, but dictionary access remains key-based rather than positional.


## 8. Loops

### while loop

A while loop repeats a block while its condition is true. The counter must change or the loop may never terminate.

```python
count = 0
while count < 3:
    count = count + 1
    print("Hello Class")
```

Output:

```text
Hello Class
Hello Class
Hello Class
```

### for loop

A for loop traverses a sequence. range(0, n) stops before n.

```python
n = 10
for i in range(0, n):
    print(i)
```

This prints 0 through 9.


## 9. Control structures

An if statement executes a block only when its condition is true.

```python
c = 20
if c < 30:
    print("Small Number")
```

An if-else statement supplies the alternative block:

```python
c = 120
if c < 30:
    print("Small Number")
else:
    print("Big Number")
```


## 10. Functions and arguments

A function is a reusable block that runs when called. It can receive parameters/arguments and may return a result.

### Define and call

```python
def my_function():
    print("Hello from a function")

my_function()
```

### Positional arguments

Arguments follow the function name in parentheses. Multiple arguments are comma-separated.

```python
def print_name(first_name, last_name):
    print("Fullname:", first_name, last_name)

print_name("Karan", "Singh")
print_name("David", "Golmes")
print_name("Yousuf", "Khan")
```

### Arbitrary positional arguments

Prefix a parameter with an asterisk when the number of positional arguments is not known. Inside the function, the parameter is a tuple.

```python
def youngest(*kids):
    print("The youngest child is " + kids[2])

youngest("Sushil", "Suhas", "Sagar")
```

This example assumes at least three arguments; with fewer, index 2 raises `IndexError`.

### Keyword arguments

Use key=value syntax so argument order does not matter.

```python
def youngest_named(child3, child2, child1):
    print("The youngest child is " + child3)

youngest_named(child1="Varun", child2="Vivan", child3="Vivek")
```

> [!warning] Argument vocabulary
> A parameter is the name in the function definition; an argument is the value passed at the call. Positional arguments depend on order, whereas keyword arguments identify the parameter explicitly.


## 11. Question bank

### Questions from class material

- Why does indentation matter in Python?
- What is the difference between = and ==?
- Which listed collection is mutable and ordered? (List.)
- Which listed collection removes duplicates? (Set.)
- What does range(5) produce when iterated? (0, 1, 2, 3, 4.)
- Why must the counter in the while example change?
- What kind of object does *kids receive? (A tuple.)

### Extra practice

1. **Assignment trace, 2 marks.** Find the final values of `x` and `y`.

   ```python
   x, y = 4, 9
   x, y = y, x + y
   ```

   > [!success]- Answer
   > The right-hand side is evaluated first, so `x = 9` and `y = 13`.

2. **Loop trace, 3 marks.** Find the printed value.

   ```python
   total = 0
   for value in range(2, 11, 2):
       total += value
   print(total)
   ```

   > [!success]- Answer
   > `range(2, 11, 2)` produces 2, 4, 6, 8, 10, so the program prints `30`.

3. **While loop, 4 marks.** Write a loop that repeatedly adds the digits of a positive integer. For input `5832`, the output must be `18`.

   > [!success]- Answer
   > ```python
   > number = 5832
   > digit_sum = 0
   > while number > 0:
   >     digit_sum += number % 10
   >     number //= 10
   > print(digit_sum)
   > ```

4. **Decision logic, 4 marks.** Write a function that returns `"positive even"`, `"positive odd"`, `"zero"` or `"negative"` for an integer.

   > [!success]- Answer
   > ```python
   > def classify(number):
   >     if number < 0:
   >         return "negative"
   >     if number == 0:
   >         return "zero"
   >     if number % 2 == 0:
   >         return "positive even"
   >     return "positive odd"
   > ```

5. **Collections, 4 marks.** For `values = [4, 2, 4, 7, 2, 9]`, find the number of distinct values, the sorted distinct values and their sum.

   > [!success]- Answer
   > `set(values)` is `{2, 4, 7, 9}`. The count is 4, the sorted list is `[2, 4, 7, 9]`, and the sum is 22.

6. **Function arguments, 3 marks.** What does this call return, and what type is `numbers` inside the function?

   ```python
   def average(*numbers):
       return sum(numbers) / len(numbers)

   result = average(6, 8, 10, 12)
   ```

   > [!success]- Answer
   > `numbers` is the tuple `(6, 8, 10, 12)` and `result` is `9.0`.

7. **Dictionary accumulation, 5 marks.** Count the frequency of every character in `"data"` without using `collections.Counter`.

   > [!success]- Answer
   > ```python
   > counts = {}
   > for character in "data":
   >     counts[character] = counts.get(character, 0) + 1
   > print(counts)  # {'d': 1, 'a': 2, 't': 1}
   > ```

8. **Debugging, 3 marks.** Explain why the following loop never terminates and correct it.

   ```python
   counter = 5
   while counter > 0:
       print(counter)
   ```

   > [!success]- Answer
   > `counter` never changes. Add `counter -= 1` inside the loop after `print(counter)`.
