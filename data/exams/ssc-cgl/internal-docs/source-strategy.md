---
title: SSC CGL Source Strategy
description: Corpus plan for the uploaded book-PYQ corpus, model practice, and original SSC-style repair drills.
tags: [ssc-cgl, sources, pyq, practice]
---

# SSC CGL Source Strategy

The active corpus is the uploaded SSC CGL book-PYQ set. For this personal 200/200 system, those reviewed book rows are treated as PYQ practice and drive tests, topic drills, note depth, trap coverage, and the DeepSeek authoring prompts.

## Source Lanes

| Lane | Use | Ranked-test status | Operating Rule |
|---|---|---|---|
| Uploaded book-PYQ corpus | Main PYQ practice pool, full mocks, section tests, topic drills, note planning | Eligible after Mistral OCR, answer evidence, format gate, provenance, and duplicate gate | Treat reviewed book rows as PYQ for this build. |
| Official SSC source | Optional future provenance refresh | Backlog only | Not an active milestone right now. |
| Web/model practice lead | Extra SSC-like exposure | Quarantine/review queue | Use only as optional practice-source leads, not as a replacement for the uploaded book corpus. |
| Public model/practice | Extra SSC-like exposure | Review queue | Use as source leads, coverage maps, and rewrite targets before they enter drills. |
| Original generated practice | High-volume drills, weak-topic repair, speed sets | Eligible after agent review | DeepSeek/Mistral/GPT create original questions from topic specs, then separate agents solve, review, dedupe, and tag. |

## Best Forward Path

1. Use the uploaded book-PYQ corpus as the main source for full mocks, 50/50 section sets, topic drills, and weak-topic repair.
2. Generate `data/exams/ssc-cgl/book-imports/corpus-blueprint.json` before DeepSeek note authoring.
3. Use the blueprint counts to decide 200/200 note depth: repeated topics get exhaustive trap/type systems, and sparse topics get extra examples and drills.
4. Keep optional web/model sources as a separate review lane only when more exposure is useful.
5. Label every question by source lane so the app can show provenance while still treating reviewed uploaded-book rows as PYQ.

## Practice Mix

| Practice type | Share | Purpose |
|---|---:|---|
| Book-PYQ full and section mocks | 50% | Real SSC-style repetition under the official timer. |
| Topic-wise book-PYQ drills | 30% | Learn repeated wording, traps, and chapter patterns. |
| Original generated speed drills | 15% | Patch weak topics and coverage gaps with fresh SSC-style questions. |
| Model/practice-source inspired drills | 0-5% | Broaden exposure only after review. |
| Current affairs MCQ seeds | 5% | Keep GA daily and recall-based. |

## Promotion Checks

- Every imported question needs a stable source lane, topic tag, answer key, and explanation.
- Ranked tests use reviewed questions only.
- Uploaded book rows go through Mistral OCR, answer evidence, format validation, provenance, and duplicate filtering.
- DeepSeek notes focus on concepts, tricks, examples, trap tables, PYQ mapping, and repair drills.
- Firecrawl and SearXNG are optional discovery helpers and should not be left running locally.

## Local Tooling

- Book-PYQ blueprint:

```powershell
python scripts\ssc_cgl_book_corpus_blueprint.py
```
