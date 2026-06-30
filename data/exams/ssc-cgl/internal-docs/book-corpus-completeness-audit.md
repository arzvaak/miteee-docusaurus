---
title: SSC CGL Book Corpus Completeness Audit
description: Strict expected-vs-promoted audit for the uploaded SSC CGL book-PYQ corpus.
tags: [ssc-cgl, pyq, corpus, audit]
---

# SSC CGL Book Corpus Completeness Audit

This is the strict corpus target. The indexed book MCQ total is the target; only exact 1:1 duplicate copies may be removed.

| Expected | Segmented | Answer evidence | Promoted | Missing |
| --- | --- | --- | --- | --- |
| 22823 | 0 | 0 | 22173 | 650 |

## Source Losses

| Source | Expected | Segmented | Answer evidence | Promoted | Missing | Not segmented/aligned | Missing answer evidence | Post-answer drop |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pinnacle-maths-6800-di-qr-english | 368 | 0 | 0 | 328 | 40 | 368 | 40 | 0 |
| pinnacle-ssc-english | 6125 | 0 | 0 | 5688 | 437 | 6125 | 437 | 0 |
| pinnacle-ssc-general-studies | 6658 | 0 | 0 | 6585 | 73 | 6658 | 73 | 0 |
| pinnacle-ssc-reasoning | 3200 | 0 | 0 | 3200 | 0 | 3200 | 0 | 0 |
| ssc-maths-6800-mcq | 6472 | 0 | 0 | 6372 | 100 | 6472 | 100 | 0 |

## Recovery Order

1. Re-segment or re-align Reasoning and Maths first because they have the largest missing counts.
2. Extract missing answer keys from OCR answer-key pages and solution pages instead of dropping rows.
3. Clean malformed option tails and table/image references, then promote all valid four-option MCQs.
4. Remove only exact normalized copies with the same stem, options, and answer.
