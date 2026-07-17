---
title: Analogy and Classification
description: Exam-ready SSC CGL Tier-I Reasoning chapter for word, number, letter, and odd-one-out questions.
tags: [ssc-cgl, reasoning, analogy-classification, agent-reviewed]
review_status: agent-reviewed
content_quality: manually-curated
---

## 1. The Exact-Relation Method

An **analogy** asks you to preserve a relation. **Classification** asks you to find the item that breaks a shared rule. Both become faster when you state the rule before looking for an answer.

![Concept map for solving analogy and classification questions](/img/ssc-cgl/analogy-classification-map.svg)
*Concept map: identify the family, state the exact rule, apply it, and verify every part before marking the answer.*

Use one precise sentence, not a vague thought such as “these are connected.”

- `Pen : Write` means “A pen is used to write.”
- `Page : Book` means “A page is part of a book.”
- `9 : 81` means “The second number is the square of the first.”
- `ACE : BDF` means “Each letter moves one position forward.”

The **36-second framework** is a ceiling, not a target you must fill. Direct word questions should often finish earlier.

| Time | Decision | What you should know |
|---:|---|---|
| 0–5 s | Classify | Analogy or odd one out; word, number, or letter |
| 5–14 s | State the rule | A complete relation sentence or shared property |
| 14–26 s | Apply | Test the rule against the target or options |
| 26–32 s | Verify | Check direction, every letter, or every number |
| 32–36 s | Mark or move | Answer only with an exact rule; otherwise return later |

**Worked example**

`Pen : Write :: Knife : ?`

Options: Cut, Steel, Sharp, Kitchen

The exact sentence is “A pen is used to write.” Applying the same object-to-action relation gives “A knife is used to cut.” The answer is **Cut**.

**Self-check**

`Thermometer : Temperature :: Clock : ?`

Options: Time, Hour, Hand, Alarm

<details>
<summary>Answer and explanation</summary>

**Time.** A thermometer measures temperature; a clock measures time. “Hour” is a unit, while the relation asks for what the instrument measures.

</details>

## 2. Word Relations

For word analogies, turn the pair into a grammatical sentence. Preserve both the **relation** and its **direction**.

| Relation | Exact sentence | Example | Common error |
|---|---|---|---|
| Tool → action | A tool is used to perform an action. | Knife : Cut | Choosing a material or quality |
| Part → whole | The first item is part of the second. | Petal : Flower | Reversing whole and part |
| Member → class | The first item is a type of the second. | Sparrow : Bird | Confusing type with part |
| Person → workplace | The person commonly works at the place. | Judge : Court | Choosing a client or instrument |
| Producer → product | The first produces the second. | Bee : Honey | Reversing product and producer |
| Field → subject | The field studies the subject. | Botany : Plants | Choosing a related tool |
| Cause → effect | The first can directly produce the second. | Fire : Smoke | Choosing a mere association |
| Meaning relation | The words are synonyms, antonyms, or degrees. | Expand : Contract | Mixing opposites with intensity |

When two options seem plausible, prefer the sentence that is **primary, exact, and equally true for both pairs**.

**Worked example**

`Doctor : Hospital :: Judge : ?`

Options: Court, Lawyer, Law, Verdict

“A doctor commonly works in a hospital.” A judge commonly works in a **court**. “Law” and “verdict” are associated with judges, but neither preserves the workplace relation.

**Self-check**

`Bee : Honey :: Cow : ?`

Options: Milk, Grass, Calf, Farm

<details>
<summary>Answer and explanation</summary>

**Milk.** Bees produce honey; cows produce milk. Grass is food, a calf is a young animal, and a farm is a place, so none preserves the producer-to-product relation.

</details>

**Self-check**

`Petal : Flower :: Page : ?`

Options: Paper, Book, Chapter, Ink

<details>
<summary>Answer and explanation</summary>

**Book.** A petal is part of a flower; a page is part of a book. “Paper” describes material, so it changes the relation.

</details>

## 3. Number Relations

Use the simplest operation that explains the **whole given pair**. Do not invent a two-step rule when a standard one-step rule works.

| Test order | Form | Recognition cue | Check |
|---:|---|---|---|
| 1 | $b=a^2$ or $b=a^3$ | Perfect squares or cubes | Test the exact power |
| 2 | $b=ka$ or $b=a/k$ | Clean common factor | Keep the same multiplier |
| 3 | $b=a\pm k$ | Constant difference | Preserve the sign and value |
| 4 | $b=a^2\pm k$ or $b=a^3\pm k$ | Near a perfect power | Power first, adjustment second |
| 5 | Digit sum or product | Small result from a multi-digit input | Test every digit once |
| 6 | Reverse or rearrange | Same digits in a new order | Confirm position, not just total |

For an adjustment rule, write it explicitly. If `5 : 26`, the concise rule is $b=a^2+1$ because $5^2+1=26$.

**Worked example**

`5 : 26 :: 7 : ?`

Options: 48, 49, 50, 51

Apply $b=a^2+1$:

$$
7^2+1=49+1=50
$$

The answer is **50**.

**Self-check**

`6 : 37 :: 8 : ?`

Options: 63, 64, 65, 66

<details>
<summary>Answer and explanation</summary>

**65.** The relation is $b=a^2+1$: $6^2+1=37$, so $8^2+1=65$.

</details>

**Self-check**

`37 : 10 :: 46 : ?`

Options: 8, 9, 10, 24

<details>
<summary>Answer and explanation</summary>

**10.** The output is the digit sum: $3+7=10$ and $4+6=10$. The product $4\times6=24$ is a distractor because it does not explain the given pair.

</details>

## 4. Letter Relations

Convert letters to positions when the pattern is not immediately visible: $A=1, B=2, \ldots, Z=26$. For a uniform shift, every position must obey $p_i'=p_i+k$.

| Pattern | Position rule | Example | Verification |
|---|---|---|---|
| Uniform shift | $p_i'=p_i+k$ | ACE → BDF | Every letter uses the same $k$ |
| Alternating shift | Different fixed shifts by position | ACE → BEF | Check $+1,+2,+1$ separately |
| Reverse | Read positions in reverse order | ABC → CBA | Same letters, reversed order |
| Opposite alphabet | $p+q=27$ | A ↔ Z | Test the sum for every pair |
| Internal gaps | Compare adjacent differences | BDF has $+2,+2$ | Check all gaps, not only the first |

**Worked example**

`ACE : BDF :: GIK : ?`

Options: HJL, HJK, JLM, FIL

The first pair uses a uniform $+1$ shift:

$$
(1,3,5)\rightarrow(2,4,6)
$$

Applying it to $(7,9,11)$ gives $(8,10,12)$, or **HJL**. `HJK` is wrong because the final `K` does not move forward to `L`.

**Self-check**

`A : Z :: D : ?`

Options: V, W, X, Y

<details>
<summary>Answer and explanation</summary>

**W.** Opposite-alphabet positions sum to $27$. Since $D=4$, its partner is $27-4=23$, which is W.

</details>

**Self-check**

`ABC : CBA :: DEF : ?`

Options: FED, EFD, FDE, CBA

<details>
<summary>Answer and explanation</summary>

**FED.** The group is reversed without changing any letter. Apply the same reversal to DEF.

</details>

## 5. Classification: Find the Rule of Three

In an odd-one-out question, look for the **narrowest objective property shared by exactly three items**. Test properties in this order:

1. Semantic category or relation.
2. Prime, composite, square, cube, divisibility, or sequence.
3. Letter position, internal gap, reverse, or shift.
4. Direction of a pair relation.

Avoid labels such as “all are things” or “all are numbers”; they are too broad to separate one option.

**Worked example**

Choose the odd one out: `16, 25, 36, 48`

Options: 16, 25, 36, 48

The first three are perfect squares: $16=4^2$, $25=5^2$, and $36=6^2$. Since 48 is not a perfect square, the answer is **48**.

**Self-check**

Choose the odd one out: `Rose, Lotus, Lily, Mango`

<details>
<summary>Answer and explanation</summary>

**Mango.** Rose, lotus, and lily are flowers; mango is a fruit. “Plants” is true of all four and is therefore too broad.

</details>

**Self-check**

Choose the odd one out: `BDF, HJL, NPR, TWZ`

<details>
<summary>Answer and explanation</summary>

**TWZ.** BDF, HJL, and NPR each have internal gaps of $+2,+2$. TWZ has gaps of $+3,+3$.

</details>

## 6. Speed and Trap Control

The fastest safe method is: **classify → state → apply → verify**. Skip only when you still cannot state an exact rule by the final decision window.

| Trap | Warning sign | Repair move | Quick check |
|---|---|---|---|
| Vague association | Your rule is only “related to” | Write a full sentence | Is it equally true for both pairs? |
| Reversed direction | Part and whole swap places | Draw an arrow from first to second | Did the direction stay unchanged? |
| Partial letter rule | Only one or two letters match | Convert every letter to a position | Does every $p_i$ obey the rule? |
| Clever number rule | You started with several operations | Test powers and one-step rules first | Is there a simpler complete rule? |
| Broad classification | The property fits all four | Narrow the property | Does it unite exactly three? |
| Two plausible options | Both are associated with the stem | Prefer the primary exact relation | Can you reject one in a sentence? |

**Worked example**

`Car : Wheel :: Book : ?`

Options: Page, Library, Author, Paper

The direction is **whole → part**: a car contains a wheel, and a book contains a **page**. “Paper” is a material relation and therefore changes the rule.

**Self-check**

At 30 seconds, you have tried three unrelated number rules and none explains the full pair. What should you do?

<details>
<summary>Answer and explanation</summary>

Return once to the standard test order and verify the given pair. If no exact rule is available by 36 seconds, mark it for review and move on. A guessed relation is not a speed method.

</details>

## 7. Mixed Exam Practice and Mastery

Solve each item within 36 seconds. State the relation before opening the explanation.

### Question 1 — Word relation

`Botany : Plants :: Ornithology : ?`

Options: Birds, Insects, Reptiles, Forests

<details>
<summary>Answer and explanation</summary>

**Birds.** Botany is the study of plants; ornithology is the study of birds.

</details>

### Question 2 — Number relation

`8 : 512 :: 6 : ?`

Options: 36, 72, 128, 216

<details>
<summary>Answer and explanation</summary>

**216.** The relation is $b=a^3$: $8^3=512$ and $6^3=216$.

</details>

### Question 3 — Letter relation

`BDF : CEG :: HJL : ?`

Options: IKM, IKL, GIK, JLN

<details>
<summary>Answer and explanation</summary>

**IKM.** Every letter moves forward by one position: BDF becomes CEG, so HJL becomes IKM.

</details>

### Question 4 — Semantic classification

Choose the odd one out: `Copper, Iron, Silver, Wood`

<details>
<summary>Answer and explanation</summary>

**Wood.** Copper, iron, and silver are metals; wood is not.

</details>

### Question 5 — Number classification

Choose the odd one out: `11, 13, 17, 21`

<details>
<summary>Answer and explanation</summary>

**21.** The first three numbers are prime. Since $21=3\times7$, it is composite.

</details>

### Question 6 — Letter classification

Choose the odd one out: `CFI, LOR, PSV, UXB`

<details>
<summary>Answer and explanation</summary>

**UXB.** CFI, LOR, and PSV each use internal gaps of $+3,+3$. UXB moves $+3$ from U to X but $+4$ from X to B when the alphabet wraps, so it breaks the rule.

</details>

### Mastery check

- Complete Questions 1–6 in at most 3 minutes 36 seconds with all six correct.
- For every miss, write the exact relation sentence and the distractor you followed.
- Repeat a fresh set until you can apply the four-step method without prompting.
- Continue with [Analogy and Classification practice](/exams/ssc-cgl/practice/analogy-classification) only after you can explain each answer, not merely recognize it.
