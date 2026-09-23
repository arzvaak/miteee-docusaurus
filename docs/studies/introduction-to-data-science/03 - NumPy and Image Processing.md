---
title: "03 - NumPy and Image Processing"
math_syntax: typst
---

# Chapter 03 — NumPy and Image Processing

> [!important] ◆ MIDSEM SYLLABUS
> This chapter is inside the immediate midsem boundary.


[← Course home](/notes/studies-introduction-to-data-science-00---course-home) · Previous: [02 - Python Fundamentals](/notes/studies-introduction-to-data-science-02---python-fundamentals) · Next: [04 - Pandas and Matplotlib](/notes/studies-introduction-to-data-science-04---pandas-and-matplotlib)

> [!summary] Topic in one sentence
> NumPy represents numerical data as compact, typed, multidimensional arrays and supports vectorised arithmetic, indexing, reshaping, plotting and image manipulation.

## 1. Why NumPy?

NumPy is short for Numerical Python. Compared with ordinary Python lists:

| Lists | NumPy |
| --- | --- |
| Slower for large element-wise numerical operations | Fast vectorised numerical operations |
| Insertion, deletion, concatenation and similar operations | The same operations plus numerical array operations such as multiplying value pairs |
| More memory requirement | Less memory requirement |

Exact memory use depends on the Python and NumPy build, but NumPy arrays store homogeneous numerical data compactly and support vectorised operations.

```python
import numpy as np
import sys

values = range(1000)
print(sys.getsizeof(values) * len(values))

array = np.arange(1000)
print(array.size * array.itemsize)
```


## 2. Creating arrays and reading their shape

### One-dimensional and two-dimensional arrays

```python
import numpy as np

a = np.array([1, 2, 3])
print(a, type(a), a.shape, type(a[0]))

b = np.array([(1, 2, 3), (4, 5, 6)])
print(b, type(b), b.shape)
```

The first array has rank 1 and shape `(3,)`; the second has rank 2 and shape `(2, 3)`. The exact integer dtype depends on the installed NumPy build.

### ndim, itemsize, dtype, size and shape

```python
a = np.array([1, 2, 3])
print(a.ndim)       # 1
print(a.itemsize)   # bytes per element; depends on dtype and platform
print(a.dtype)      # stored data type
print(a.size)       # number of elements: 3
print(a.shape)      # dimensions: (3,)
```

For a two-dimensional example, a.ndim is 2. A shape describes the length along each axis; size is the product of the shape dimensions.


## 3. Reshaping and slicing

Reshaping changes the shape without changing the number of values. A 2 × 4 array can become a 4 × 2 array because both contain eight elements.

```python
a = np.array([(1, 2, 3, 4), (3, 4, 5, 6)])
print(a)
reshaped = a.reshape(4, 2)
print(reshaped)
```

Two-dimensional indexing selects a row, column or individual element:

```python
a = np.array([(1, 2, 3, 4), (3, 4, 5, 6)])
print(a[0, 2])     # 3
print(a[0:, 3])    # [4 6]
```

The later example uses start-inclusive, end-exclusive slicing:

```python
b = np.array([
    (1, 2, 3, 4),
    (3, 4, 5, 6),
    (7, 8, 9, 10),
])
print(b[0:2, 3])   # [4 6]
```

### Linear spacing and reductions

linspace creates a chosen number of evenly spaced values including the endpoints.

```python
c = np.linspace(1, 3, 10)
print(c)

d = np.array([(1, 2, 3)])
print(d.max(), d.min(), d.sum())  # 3 1 6
```

### Axes

For a two-dimensional array, rows are axis 0 and columns are axis 1. Reducing along axis 0 combines values down the rows, producing one value per column; reducing along axis 1 combines across columns, producing one value per row.

```python
e = np.array([(1, 2, 3), (3, 4, 5)])
print(e.sum(axis=0))  # [4 6 8]
print(e.sum(axis=1))  # [6 12]
```


## 4. Mathematical operations and concatenation

NumPy applies many operations element by element.

```python
e = np.array([(1, 2, 3), (3, 4, 5)])
f = np.array([(1, 2, 3), (3, 4, 5)])

print(e + f)
print(e - f)
print(e * f)
print(e / f)
print(np.sqrt(e))
print(np.std(e))
```

For the arrays below, `e + f` is `[[2, 4, 6], [6, 8, 10]]`, `e - f` is all zeros, `e * f` is `[[1, 4, 9], [9, 16, 25]]`, and `e / f` is all ones. `np.std(e)` is approximately 1.2909944487.

Stacking:

```python
print(np.vstack((e, f)))  # append rows
print(np.hstack((e, f)))  # append columns
print(e.ravel())           # flatten to one row
```

### Sine, cosine, exponential and logarithms

```python
import matplotlib.pyplot as plt

x = np.arange(0, 3 * np.pi, 0.1)
plt.plot(x, np.sin(x), label="sin(x)")
plt.plot(x, np.cos(x), label="cos(x)")
plt.legend()
plt.show()
```

![p010-sine-plot](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p010-sine-plot.jpg)

![p010-cosine-plot](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p010-cosine-plot.jpg)

For an array `ar = [[1, 2, 3]]`:

- exp(ar) ≈ `[[2.71828183, 7.3890561, 20.08553692]]`
- log(ar) ≈ `[[0, 0.69314718, 1.09861229]]`
- log10(ar) ≈ `[[0, 0.30103, 0.47712125]]`

```python
ar = np.array([(1, 2, 3)])
print(np.exp(ar))
print(np.log(ar))
print(np.log10(ar))
```


## 5. Special arrays, lists and dimensions

zeros creates arrays filled with 0.0 by default.

```python
arr_1 = np.zeros(3)
print(arr_1, type(arr_1), type(arr_1[0]))

z = np.zeros(10)
print(z.shape)  # (10,)

print(np.linspace(2, 10, 5))  # [2. 4. 6. 8. 10.]
```

Converting a one-dimensional list inside another list creates a two-dimensional array:

```python
a_list = [2, 4, 6, 8, 10, 12, 14]
z = np.array([a_list])
print(z, z.ndim)  # shape (1, 7), rank 2
```

Compare `np.array([b_list])` with `np.array(b_list)`:

```python
b_list = [
    [1, 3, 5, 7, 9, 4, 5, 6],
    [2, 3, 5, 6, 8, 4, 4, 6],
]

wrapped = np.array([b_list])
plain = np.array(b_list)
print(wrapped.shape, wrapped.ndim)  # (1, 2, 8), 3
print(plain.shape, plain.ndim)      # (2, 8), 2
```

### Shape examples

| Construct | Shape |
| --- | --- |
| np.array([1, 2, 3]) | (3,) |
| np.array([1, 2, 3, 4]) | (4,) |
| np.array([1, 2, 3, 4, 5]) | (5,) |
| `[[1,2,3],[4,5,6]]` | (2, 3) |
| Three rows of three values | (3, 3) |
| Four rows of three values | (4, 3) |
| Two blocks, each 2 × 3 | (2, 2, 3) |
| Three blocks, each 1 × 1 | (3, 1, 1) |


## 6. Reshaping, random integers and dtypes

The function form and method form of reshape are equivalent:

```python
r1d = np.array([1, 2, 3, 4])
r2d = np.reshape(r1d, (2, 2))
r2dnew = r1d.reshape((2, 2))

print(r1d, r1d.shape)
print(r2d, r2d.shape)
print(r2dnew, r2dnew.shape)
```

Twelve values can be reshaped to 2 × 2 × 3:

```python
array1d = np.arange(1, 13)
array1da = array1d.reshape((2, 2, 3))
print(array1da)
```

> [!warning] Reshape rule
> The total number of elements must stay the same. A 12-element array cannot be reshaped to a shape whose product is not 12.

Random integers:

```python
np.random.seed(97)
r1 = np.random.randint(low=1, high=9, size=(3, 4), dtype=int)
print(r1)
```

The high endpoint is exclusive, so values are from 1 through 8. Calling np.random.seed() with no argument makes the sequence nondeterministic; seed 97 makes this example reproducible.

Specify an integer width with dtype:

```python
a = np.array([1, 2, 3, 4], dtype="int16")
b = np.array([1, 2, 3, 4], dtype="int32")
print(a.itemsize, a.size)  # 2, 4
print(b.itemsize)          # 4
```


## 7. Indexing, slicing, changing values and comparisons

The example array is:

```python
a = np.array([
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
])

print(a[1, 6])  # 14
print(a[0, :])  # first row
print(a[:, 2])  # third column: [3 10]
```

The general slice form is [start index : end index : step index]. The end index is excluded.

```python
print(a[0, 1:6:2])   # [2 4 6]
print(a[0, 1:-1:2])  # [2 4 6]
```

Values can be changed by scalar or compatible-array assignment:

```python
a[1, 4] = 97
a[:, 2] = 90
a[:, 4] = [89, 92]
print(a)
```

After the replacements, the matrix is:

```text
[[ 1  2 90  4 89  6  7]
 [ 8  9 90 11 92 13 14]]
```

### Three-dimensional indexing

A valid three-dimensional array is:

```python
b = np.array([
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]],
])

print(b[0, 1, 1])  # 4
print(b[:, 1, :])   # [[3 4], [7 8]]
print(b[:, :, 1])   # [[2 4], [6 8]]

b[:, 1, :] = [[10, 10], [12, 12]]
print(b)
```

### Comparison and where

allclose checks whether corresponding values are within a tolerance.

```python
a = np.array([0.16, 0.26, 0.365])
b = np.array([0.15, 0.25, 0.36])
print(np.allclose(a, b, 0.1))   # True
print(np.allclose(a, b, 0.05))  # False

values = np.array([1, 4, 7, 6, 1, 7, 3, 8, 9])
print(np.where(values < 7))     # (array([0, 1, 3, 4, 6]),)
```


## 8. Initialising arrays of different ranks

```python
print(np.zeros(5))
print(np.zeros((2, 3)))
print(np.zeros((2, 3, 3)))
print(np.zeros((2, 3, 3, 2)))
```

The tuple passed to `zeros` is the desired shape. Practise additional shapes and linear-algebra operations such as matrix multiplication and determinants.

### Self-practice

- Initialise arrays of different types/shapes.
- Try linear algebra operations such as matrix multiplication and determinant.


## 9. Image processing with NumPy

The image-processing section uses a sample image. The image is shown below:

![p028-source-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p028-source-image.jpg)

Load it with scikit-image and inspect the NumPy array:

```python
import matplotlib.pyplot as plt
import numpy as np
from skimage import io

pic = io.imread("testcricket3.jpg")
print(pic.shape)       # source: (433, 770, 3)
print(type(pic))       # numpy.ndarray
plt.imshow(pic)
plt.show()
```

![p029-loaded-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p029-loaded-image.jpg)

The shape is height × width × colour channels. The final dimension of 3 represents red, green and blue (RGB).

### RGB colour table

| Colour | HTML/CSS name | Hex code | Decimal (R,G,B) |
| --- | --- | --- | --- |
| Black | Black | #000000 | (0,0,0) |
| White | White | #FFFFFF | (255,255,255) |
| Red | Red | #FF0000 | (255,0,0) |
| Lime | Lime | #00FF00 | (0,255,0) |
| Blue | Blue | #0000FF | (0,0,255) |
| Yellow | Yellow | #FFFF00 | (255,255,0) |
| Cyan/Aqua | Cyan / Aqua | #00FFFF | (0,255,255) |
| Magenta/Fuchsia | Magenta / Fuchsia | #FF00FF | (255,0,255) |


### Reverse the image

Reversing the first axis flips the image vertically:

```python
plt.imshow(pic[::-1])
plt.show()
```

![p031-reversed-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p031-reversed-image.jpg)

### Reverse only the columns

Slicing all rows and reversing the second axis mirrors the image horizontally:

```python
plt.imshow(pic[:, ::-1])
plt.show()
```

![p032-reversed-columns](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p032-reversed-columns.jpg)

![p032-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p032-original-image.jpg)

### Crop

This crop keeps rows 50 through 399 and columns 50 through 499:

```python
plt.imshow(pic[50:400, 50:500])
plt.show()
```

![p033-cropped-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p033-cropped-image.jpg)

![p033-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p033-original-image.jpg)

### Half the size

Step 2 on both spatial axes takes every other row and column:

```python
plt.imshow(pic[::2, ::2])
plt.show()
```

![p034-half-size-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p034-half-size-image.jpg)

![p034-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p034-original-image.jpg)

### Add filters with where

NumPy's `where` chooses values elementwise. Three useful transformations are:

```python
plt.imshow(np.where(pic > 100, 200, 50))
plt.show()

pic_masked = np.where(pic > 100, 255, 0)
plt.imshow(pic_masked)
plt.show()

plt.imshow(np.where(pic > 25, 255, 0))
plt.show()
```

These operations threshold every RGB channel independently, so they are simple demonstrations rather than colour-aware image segmentation.

![p035-filter-100-200-50](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p035-filter-100-200-50.jpg)

![p035-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p035-original-image.jpg)

![p036-filter-255-0](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p036-filter-255-0.jpg)

![p036-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p036-original-image.jpg)

![p037-filter-25-255](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p037-filter-25-255.jpg)

![p037-original-image](/content-assets/studies/introduction-to-data-science/Assets/Topic%2003/p037-original-image.jpg)


## 10. Common NumPy mistakes

- Mixing up shape and size: shape is a tuple of axis lengths; size is the total count.
- Forgetting that a slice excludes its end index.
- Using a shape whose product differs from the number of values during reshape.
- Treating axis 0 as columns; in the course’s 2-D examples axis 0 is rows and axis 1 is columns.
- Assigning an incompatible array shape to a row/column.
- Assuming random output is repeatable without setting a seed.
- Running the image examples without installing scikit-image or without placing testcricket3.jpg at the requested path.

## 11. Question bank

### Questions from class material

1. Starting from `np.array([1, 2, ..., 12])`, create at least three valid reshapes. For each one, predict and then verify its `shape`. Why must the product of the target dimensions remain 12?
2. Initialise useful arrays with `zeros`, `ones`, `full`, `eye` and random integers. State the shape and dtype of each result.
3. Given two compatible matrices, compute their matrix product and determinant. Explain why `a * b` and `a @ b` mean different things.
4. Load an RGB image as a NumPy array. Report its height, width, channel count and dtype.
5. Use slicing to mirror an image horizontally, reverse it on both spatial axes, crop a rectangular region and downsample it by taking every second row and column.
6. Apply a threshold with `np.where`. Explain why applying the condition independently to RGB channels is not the same as colour-aware segmentation.

### Extra practice

1. **Array properties, 4 marks.** An `int64` array contains the integers 1 through 12 and is reshaped to `(3, 4)`. Find `ndim`, `size`, `itemsize` and `nbytes`.

   > [!success]- Answer
   > `ndim = 2`, `size = 12`, `itemsize = 8` bytes and `nbytes = 12 times 8 = 96` bytes.

2. **Indexing, 4 marks.** Let `a = np.arange(1, 13).reshape(3, 4)`. Find `a[::2, 1:4:2]`.

   > [!success]- Answer
   > Rows 0 and 2 and columns 1 and 3 are selected, giving `[[2, 4], [10, 12]]`.

3. **Axis reductions, 4 marks.** For $A = ((2, 4, 6), (1, 3, 5))$, find `A.sum(axis=0)` and `A.sum(axis=1)`.

   > [!success]- Answer
   > Column sums are `[3, 7, 11]`; row sums are `[12, 9]`. Axis 0 collapses rows, while axis 1 collapses columns.

4. **Matrix operations, 6 marks.** For $A = ((1, 2), (3, 4))$ and $B = ((2, 0), (1, 2))$, calculate the elementwise product, $A B$ and $det(A)$.

   > [!success]- Answer
   > Elementwise product: `[[2, 0], [3, 8]]`. Matrix product: `[[4, 4], [10, 8]]`. $det(A) = 1 times 4 - 2 times 3 = -2$.

5. **Image slicing, 4 marks.** An RGB image has shape `(480, 640, 3)`. Find the shapes produced by `pic[40:440, 80:560]` and `pic[::2, ::2]`.

   > [!success]- Answer
   > The crop has 400 rows and 480 columns, so its shape is `(400, 480, 3)`. Taking every second row and column gives `(240, 320, 3)`.

6. **Thresholding, 4 marks.** Apply `np.where(a > 100, 255, 0)` to `a = [[40, 120, 200], [99, 100, 101]]`. Give the result and the number of white entries.

   > [!success]- Answer
   > The result is `[[0, 255, 255], [0, 0, 255]]`; three entries become 255. The value 100 remains 0 because the condition is strictly greater than 100.

7. **Memory, 3 marks.** A grayscale `int16` image has shape `(1000, 800)`. Calculate its storage requirement before compression.

   > [!success]- Answer
   > There are 800,000 elements at 2 bytes each, so storage is 1,600,000 bytes, approximately 1.60 MB or 1.53 MiB.

8. **Reshape validity, 3 marks.** Which target shapes are valid for an array of size 24: `(4, 6)`, `(2, 3, 4)`, `(5, -1)` and `(2, 2, 5)`?

   > [!success]- Answer
   > `(4, 6)` and `(2, 3, 4)` are valid because their products are 24. `(5, -1)` is invalid because 24 is not divisible by 5. `(2, 2, 5)` is invalid because its product is 20.
