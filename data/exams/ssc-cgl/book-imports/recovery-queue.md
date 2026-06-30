---
title: SSC CGL Book Corpus Recovery Queue
description: Source-level recovery plan for missing uploaded-book MCQs.
tags: [ssc-cgl, pyq, corpus, recovery]
---

# SSC CGL Book Corpus Recovery Queue

This page tracks the remaining indexed uploaded-book MCQs that are not yet promoted into the practice engine.

| Queued sources | Missing indexed | Missing answers | Mismatches | Post-answer drops |
| --- | --- | --- | --- | --- |
| 5 | 650 | 972 | 5 | 259 |

## Recovery Queue

| Priority | Source | Expected | Segmented | Answer evidence | Promoted | Missing | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5620 | pinnacle-ssc-english | 6125 | 5767 | 5758 | 5688 | 437 | rerun Mistral OCR/segmentation on weak page ranges and compare against index counts; recover answer evidence from answer-key and solution pages; inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine |
| 3418 | pinnacle-ssc-reasoning | 3200 | 4108 | 3307 | 3200 | 0 | recover answer evidence from answer-key and solution pages; inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine |
| 1372 | ssc-maths-6800-mcq | 6472 | 6458 | 6373 | 6372 | 100 | rerun Mistral OCR/segmentation on weak page ranges and compare against index counts; recover answer evidence from answer-key and solution pages; send answer mismatches through DeepSeek/Mistral/GPT consensus; inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine |
| 1211 | pinnacle-ssc-general-studies | 6658 | 6615 | 6615 | 6585 | 73 | rerun Mistral OCR/segmentation on weak page ranges and compare against index counts; recover answer evidence from answer-key and solution pages; inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine |
| 530 | pinnacle-maths-6800-di-qr-english | 368 | 388 | 379 | 328 | 40 | recover answer evidence from answer-key and solution pages; send answer mismatches through DeepSeek/Mistral/GPT consensus; inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine |

## Execution Rule

Run the highest-priority source first. Promote only rows with a valid stem, four options, and recovered answer evidence. Remove only exact duplicate copies with the same normalized stem, options, and answer.
