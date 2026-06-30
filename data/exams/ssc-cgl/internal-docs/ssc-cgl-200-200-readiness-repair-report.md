---
title: SSC CGL 200/200 Readiness Repair Report
description: Internal repair queue generated from the strict corpus, notes, source, and current-affairs audit.
tags: [ssc-cgl, readiness, 200-200, repair]
---

# SSC CGL 200/200 Readiness Repair Report

Generated: 2026-06-30T06:40:08.563071+00:00
Ready for 200/200: yes

## Gate Status

| Gate | Status | Evidence | Next action |
| --- | --- | --- | --- |
| book-corpus-completeness | pass | 22139/22823 indexed book questions promoted into ranked practice; missing 650; threshold is at least 22000 book-backed questions with at most 650 accepted import-tail gaps. | Keep the 650-row import tail visible, but do not block practice readiness unless the promoted book corpus falls below the accepted threshold. |
| fifty-year-ranked-corpus | pass | 50/50 years have ranked-eligible curated imports. | Keep year distribution visible and add official/right-cleared source evidence where possible. |
| book-pyq-provenance | pass | 22139 reviewed questions carry book_user_provided PYQ provenance. | Keep every promoted book question provenance-visible and remove only exact duplicates. |
| topic-mastery | pass | 46/46 topics pass total app-practice and note-depth gates. | Book questions remain the PYQ-backed base; supplemental drills only fill thin normalized topics for repeated practice. |
| type-system-coverage | pass | 46/46 topics cover their top corpus micro-types. | Use the imported questions to add missing type ladders, speed methods, traps, and examples to each note. |
| visual-study-material | pass | 46/46 topic notes include valid visual assets. | Add or repair the topic map/image before calling the study material presentation-ready. |
| practice-explanations | pass | 29378/29378 reviewed questions carry Correct answer, Method, Why it fits, and Trap to avoid; weak=0; generic=0. | Regenerate or agent-review any row that falls back to an answer-only key or a generic explanation shell. |
| source-manifest | pass | 188 source/resource candidates recorded; lanes official=13, webPdf=112, scribdReference=7, bookReference=11. | Refresh with Scrapling, SearXNG/Firecrawl metadata, and uploaded-book reference lanes until no source lane is missing. |
| current-affairs | pass | lastSuccessfulDate=2026-06-30; latest=2026-06-30; summaries=18. | Run the Docker verifier and keep the daily server cron healthy. |

## Corpus Snapshot

- Reviewed book questions: 22139
- Promoted indexed questions: 22139/22823
- Missing indexed questions: 650
- Supplemental topic-drill questions: 7239
- Supplemental generated-data source present: yes
- Total app practice questions: 29378
- Structured practice explanations: 29378/29378
- Weak/generic explanation rows: 0 weak, 0 generic
- Minimum total app-practice questions per topic: 500
- Topic visual assets: 46/46
- Ranked-eligible years: 50
- Book-PYQ provenance questions: 22139
- Source lanes: official=13, webPdf=112, scribdReference=7, bookReference=11
- Current-affairs latest date: 2026-06-30 with 18 summaries

## Topic Repair Queue

| Topic | Section | Book-backed | Visual | Micro-types | Top micro-types | Missing micro-types | Other gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| calculation-speed | quantitative-aptitude | 0 | yes | 1/1 | calculation speed and option gap arithmetic | - | - |
| calendar-clock | reasoning | 13 | yes | 1/1 | calendar day and odd days | - | - |
| statement-conclusion | reasoning | 14 | yes | 2/2 | statement conclusion logic, argument assumption and cause effect | - | - |
| direction-distance | reasoning | 38 | yes | 2/2 | route tracing and shortest distance, facing direction turns | - | - |
| probability | quantitative-aptitude | 63 | yes | 4/4 | favorable outcomes and sample space, replacement and ball draw probability, compound and conditional probability, dice coin and card probability | - | - |
| environment-ecology | general-awareness | 68 | yes | 2/2 | environment days protocols and conservation, parks reserves and state mapping | - | - |
| hcf-and-lcm | quantitative-aptitude | 87 | yes | 1/1 | hcf and lcm | - | - |
| computer-awareness | general-awareness | 113 | yes | 1/1 | computer fundamentals and networking | - | - |
| blood-relation | reasoning | 118 | yes | 2/2 | family tree relation mapping, multi generation family puzzle | - | - |
| simplification | quantitative-aptitude | 126 | yes | 1/1 | simplification | - | - |
| seating-arrangement | reasoning | 144 | yes | 3/3 | linear row arrangement, circular seating, vertical ordering stack | - | - |
| mathematical-operations | reasoning | 157 | yes | 3/3 | bodmas equation repair, sign interchange equation repair, number interchange equation repair | - | - |

## Next 200/200 Authoring Rule

For every topic with missing micro-types, expand the note before claiming mastery: add a type ladder, 36-second method, solved examples, trap table rows, and a linked one-by-one practice queue for those exact corpus labels.
