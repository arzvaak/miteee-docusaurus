---
title: Probability
description: A concise SSC CGL lesson on sample spaces, complements, addition and multiplication rules, independence, conditional probability, counting, dice, cards, and odds.
tags: [ssc-cgl, quantitative-aptitude, probability]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for probability events, counting, and replacement](/img/ssc-cgl/probability-map.svg)
*Define the sample space, ask whether events overlap or depend, and update the denominator after every draw without replacement.*

Probability is direct when outcomes are equally likely and the event is one clean count. Mark and return when restrictions require several cases or conditional wording changes the sample space more than once.

## 1. Define the Experiment and Sample Space

For equally likely outcomes,

$$P(E)=\frac{|E|}{|S|},\qquad 0\le P(E)\le1.$$

The denominator is the set of possible outcomes under the stated experiment. Ordered outcomes differ from unordered selections.

**Worked example**

A fair die has sample space $\{1,2,3,4,5,6\}$. Event “prime” is $\{2,3,5\}$, so probability is $3/6=1/2$.

**Self-check**

One fair coin is tossed twice. What is the probability of exactly one head?

<details>
<summary>Answer and explanation</summary>

Ordered outcomes are HH, HT, TH, TT. Two of four have exactly one head, so probability is $1/2$.
</details>

## 2. Use the Complement for “At Least One”

$$P(E^c)=1-P(E).$$

For “at least one success,” it is often shorter to subtract “no successes” from 1.

**Worked example**

Two fair dice are rolled. Probability of at least one 6 is

$$1-P(\text{no 6})=1-(5/6)^2=11/36.$$

**Self-check**

Three fair coins are tossed. Find probability of at least one head.

<details>
<summary>Answer and explanation</summary>

$1-P(\text{all tails})=1-(1/2)^3=7/8$.
</details>

## 3. Distinguish Union, Intersection, and Exclusivity

For any events A and B,

$$P(A\cup B)=P(A)+P(B)-P(A\cap B).$$

If they are mutually exclusive, $P(A\cap B)=0$. Mutually exclusive events cannot occur together. Independent events can occur together, with one not changing the probability of the other. Except for zero-probability cases, events cannot be both mutually exclusive and independent.

**Self-check**

From a standard deck, are “card is a king” and “card is a heart” mutually exclusive?

<details>
<summary>Answer and explanation</summary>

No. The king of hearts belongs to both events.
</details>

## 4. Multiply Conditional Probabilities in Sequence

$$P(A\cap B)=P(A)P(B\mid A).$$

Conditional probability is

$$P(B\mid A)=\frac{P(A\cap B)}{P(A)},\qquad P(A)>0.$$

The phrase “given that” replaces the original sample space by outcomes consistent with the condition. Recount before using a numerator.

With replacement, the composition and denominator reset, so repeated draws may be independent. Without replacement, both numerator and denominator can change.

**Worked example**

A bag has 3 red and 2 blue balls. Two are drawn without replacement. Probability both are red is

$$\frac35\times\frac24=\frac3{10}.$$

**Self-check**

For the same bag, if the first ball is replaced, what is probability both draws are red?

<details>
<summary>Answer and explanation</summary>

Replacement restores the bag, so $(3/5)^2=9/25$.
</details>

**Worked example**

A fair die is known to show an even number. The conditional sample space is $\{2,4,6\}$. Probability the result exceeds 3 is $2/3$, not $3/6$.

## 5. Count Arrangements and Selections Correctly

The multiplication principle multiplies the choices at successive stages. For $n$ distinct objects,

$$n!=n(n-1)\cdots1.$$

Ordered selections use permutations:

$$,^nP_r=\frac{n!}{(n-r)!}.$$

Unordered selections use combinations:

$$,^nC_r=\frac{n!}{r!(n-r)!}.$$

If identical objects repeat, divide by factorials of repetition counts.

For restrictions, count the constrained positions first. If a number cannot begin with zero, handle the first digit separately. Complement counting is often shorter for “at least one” restricted object.

**Worked example**

Choose 2 students from 5: $\binom52=10$. Assign president and secretary from 5: $,^5P_2=20$ because roles make order matter.

**Self-check**

How many distinct arrangements does the word LEVEL have?

<details>
<summary>Answer and explanation</summary>

There are 5 letters with L repeated twice and E repeated twice: $5!/(2!2!)=30$.
</details>

## 6. Use Standard Dice, Card, and Odds Facts Carefully

A standard deck has 52 cards: four suits of 13, 26 red and 26 black, 12 face cards (J, Q, K), and 4 aces. A face card does not include an ace.

Two fair dice have 36 ordered outcomes. Sum 7 has six outcomes: $(1,6),(2,5),\ldots,(6,1)$.

If odds in favour of an event are $a:b$, then

$$P(E)=\frac{a}{a+b}.$$

Odds against $a:b$ mean failure:success $=a:b$, so success probability is $b/(a+b)$.

For two dice, sum frequencies rise from 1 way for sum 2 to 6 ways for sum 7, then fall symmetrically. Do not treat the eleven possible sums as equally likely.

**Self-check**

Find the probability of drawing a red face card from a standard deck.

<details>
<summary>Answer and explanation</summary>

Hearts and diamonds each have J, Q, K: 6 cards. Probability $=6/52=3/26$.
</details>

## 7. Mixed Practice and Mastery

### Question 1

A fair die is rolled. Find probability of a number greater than 4.

<details>
<summary>Answer and explanation</summary>

Outcomes 5 and 6: $2/6=1/3$.
</details>

### Question 2

Two fair dice are rolled. Find probability their sum is 7.

<details>
<summary>Answer and explanation</summary>

Six ordered outcomes out of 36, so $1/6$.
</details>

### Question 3

A card is drawn from a standard deck. Find probability it is an ace or a king.

<details>
<summary>Answer and explanation</summary>

The events are disjoint: $(4+4)/52=2/13$.
</details>

### Question 4

A bag has 4 white and 6 black balls. Find probability of white then black without replacement.

<details>
<summary>Answer and explanation</summary>

$4/10\times6/9=4/15$.
</details>

### Question 5

Odds in favour of success are $3:2$. Find probability of success.

<details>
<summary>Answer and explanation</summary>

$3/(3+2)=3/5$.
</details>

Mastery means you can say equally likely, overlapping, independent, or conditional before using a formula. Continue with [Probability focused practice](/exams/ssc-cgl/practice/probability).
