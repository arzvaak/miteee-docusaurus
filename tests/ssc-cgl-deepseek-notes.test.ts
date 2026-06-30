import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_deepseek_note_author.py");
const percentagesNotePath = path.join(process.cwd(), "docs", "ssc-cgl", "quant", "percentages-ratio.md");
const timeWorkNotePath = path.join(process.cwd(), "docs", "ssc-cgl", "quant", "time-work-pipes.md");
const requiredDeepNotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "number-system.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/number-system/,
    keywordPattern: /divisibility|HCF|LCM|remainder/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "profit-loss-discount.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/profit-loss-discount/,
    keywordPattern: /marked price|discount|successive|cost price/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "time-speed-distance.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/time-speed-distance/,
    keywordPattern: /relative speed|train|boat|stream/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "reading-comprehension.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/reading-comprehension/,
    keywordPattern: /inference|tone|central idea|passage/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "history-freedom-movement.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/history-freedom-movement/,
    keywordPattern: /revolt|congress|gandhi|freedom movement/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "geography-india-world.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/geography-india-world/,
    keywordPattern: /river|monsoon|soil|map/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "science-everyday.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/science-everyday/,
    keywordPattern: /vitamin|force|acid|electricity/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "economics-budget-banking.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/economics-budget-banking/,
    keywordPattern: /RBI|inflation|budget|banking/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "environment-ecology.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/environment-ecology/,
    keywordPattern: /ecosystem|biodiversity|pollution|climate|conservation/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "computer-awareness.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/computer-awareness/,
    keywordPattern: /CPU|RAM|ROM|internet|cyber|browser|spreadsheet/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "ga", "art-culture.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/art-culture/,
    keywordPattern: /classical dance|folk dance|literature|monument|painting|GI/i
  }
];
const requiredQuant50NotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "simple-compound-interest.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/simple-compound-interest/,
    keywordPattern: /simple interest|compound interest|installment|effective rate/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "geometry-mensuration.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/geometry-mensuration/,
    keywordPattern: /triangle|circle|mensuration|surface area|volume/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "data-interpretation.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/data-interpretation/,
    keywordPattern: /table|bar chart|pie chart|caselet|approximation/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "algebra.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/algebra/,
    keywordPattern: /identity|equation|polynomial|factorisation/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "averages-mixtures-alligation.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/averages-mixtures-alligation/,
    keywordPattern: /average|weighted average|mixture|alligation|replacement/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "trigonometry.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/trigonometry/,
    keywordPattern: /sin|cos|tan|identity|height and distance/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "calculation-speed.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/calculation-speed/,
    keywordPattern: /mental calculation|approximation|fraction|option-gap|cancellation/i
  }
];
const requiredQuantRouteNotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "percentages.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/percentages/,
    keywordPattern: /base|percentage change|successive|fraction/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "ratio-proportion.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/ratio-proportion/,
    keywordPattern: /ratio|proportion|partnership|compound ratio/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "quant", "probability.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/probability/,
    keywordPattern: /favorable|total outcomes|replacement|cards|dice/i
  }
];
const requiredReasoning200NotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "series-coding.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/series-coding/,
    keywordPattern: /number series|letter series|coding-decoding|alphabet|analogy/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "syllogism-venn.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/syllogism-venn/,
    keywordPattern: /syllogism|Venn|conclusion|possibility|only a few/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "blood-relation.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/blood-relation/,
    keywordPattern: /uncle|sister|brother|father|mother|grandparent|niece|nephew|cousin|relation/i
  }
];
const requiredReasoningRouteNotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "analogy-classification.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/analogy-classification/,
    keywordPattern: /analogy|classification|odd one out|relation|pair/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "non-verbal-reasoning.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/non-verbal-reasoning/,
    keywordPattern: /mirror|water image|embedded figure|paper folding|dice|rotation/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "mathematical-operations.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/mathematical-operations/,
    keywordPattern: /mathematical operations|symbol substitution|BODMAS|operator|equation/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "direction-distance.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/direction-distance/,
    keywordPattern: /north|south|east|west|left|right|displacement|Pythagoras/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "calendar-clock.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/calendar-clock/,
    keywordPattern: /odd days|leap year|ordinary year|clock angle|hour hand|minute hand/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "statement-conclusion.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/statement-conclusion/,
    keywordPattern: /statement|conclusion|assumption|inference|definitely follows|does not follow/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "seating-arrangement.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/seating-arrangement/,
    keywordPattern: /linear|circular|facing north|facing centre|left|right|arrangement/i
  }
];
const requiredEnglishRouteNotePaths = [
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "grammar-error-spotting.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/grammar-error-spotting/,
    keywordPattern: /subject-verb|tense|article|preposition|modifier|error spotting/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "sentence-improvement.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/sentence-improvement/,
    keywordPattern: /sentence improvement|replacement|concise|parallel|idiomatic/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "fill-in-the-blanks.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/fill-in-the-blanks/,
    keywordPattern: /fill in the blanks|blank|collocation|context|preposition/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "vocabulary-cloze.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/vocabulary-cloze/,
    keywordPattern: /cloze|vocabulary|tone|collocation|context/i
  },
  {
    path: path.join(process.cwd(), "docs", "ssc-cgl", "english", "active-passive-direct-indirect.md"),
    routePattern: /\/exams\/ssc-cgl\/topics\/active-passive-direct-indirect/,
    keywordPattern: /active voice|passive voice|direct speech|indirect speech|reported speech/i
  }
];
const generatorLeakagePattern = /\b(let'?s re-?check|i'?ll\s+(modify|rewrite|adjust|change|correct|adopt)|not in options|option missing|options? (do|does) not (include|match)|that's wrong|re-?evaluate|re-?write example|possibly the problem|maybe (the|i)|wait:)\b/i;
const invalidMermaidEdgePattern = /^```mermaid[\s\S]*?^\s*[A-Za-z0-9_-]+\s+(?:and|or)\s+[A-Za-z0-9_-]+\s*-->/gim;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertDeepSeekNote(note: string, routePattern: RegExp) {
  assert.match(note, /generated_by:\s*deepseek/i);
  assert.match(note, /review_status:\s*ai-authored-needs-agent-review/i);
  assert.doesNotMatch(note, /source_policy:/i);
  assert.doesNotMatch(note, /^> Agent-authored study note:/m);
  assert.match(note, /^## Concept Ladder$/im);
  assert.match(note, /^## Type System$/im);
  assert.match(note, /^## Speed Methods$/im);
  assert.match(note, /^## Trap Table$/im);
  assert.match(note, /^## Flowchart$/im);
  assert.match(note, /```mermaid/);
  assert.match(note, /^## Solved Examples$/im);
  assert.match(note, /^## PYQ Mapping$/im);
  assert.match(note, /^## 200\/200 Drill$/im);
  assert.match(note, routePattern);
  assert.doesNotMatch(note, /^\{"title":/m);
  assert.doesNotMatch(note, generatorLeakagePattern);
  assert.doesNotMatch(note, invalidMermaidEdgePattern);
  assert.doesNotMatch(note, /human review|learner review/i);
  assert.doesNotMatch(note, /[^\x00-\x7F]/);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 10, "DeepSeek topic note should include at least 10 solved examples");
  assert.ok(note.length > 9000, "DeepSeek topic note should be substantially deeper than the seed note");
}

test("SSC CGL percentages ratio note is DeepSeek-authored and exhaustive", () => {
  const note = fs.readFileSync(percentagesNotePath, "utf8");

  assertDeepSeekNote(note, /\/exams\/ssc-cgl\/topics\/percentages|\/exams\/ssc-cgl\/topics\/ratio-proportion/);
});

test("SSC CGL time work pipes note is DeepSeek-authored and exhaustive", () => {
  const note = fs.readFileSync(timeWorkNotePath, "utf8");

  assertDeepSeekNote(note, /\/exams\/ssc-cgl\/topics\/time-work-pipes/);
  assert.match(note, /efficiency/i);
  assert.match(note, /pipes/i);
  assert.match(note, /LCM/i);
});

test("SSC CGL time work pipes note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(timeWorkNotePath, "utf8");

  assert.match(note, /324 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/time-work-pipes-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 50\/50/);
  assert.match(note, /Work and Time[\s\S]*139 promoted questions/);
  assert.match(note, /ssc-maths-6800-mcq-p0341-p0360[\s\S]*112 promoted questions/);
  assert.match(note, /Pipe and Cistern|pipes and cisterns/i);
  assert.match(note, /36[- ]second|36 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL ratio proportion note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "ratio-proportion.md"), "utf8");

  assert.match(note, /287 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/ratio-proportion-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 50\/50/);
  assert.match(note, /ssc-maths-6800-mcq-p0301-p0320[\s\S]*124 promoted questions/);
  assert.match(note, /Ratio and Proportion[\s\S]*77 promoted questions/);
  assert.match(note, /compound ratio|partnership|inverse proportion|ages|mixture/i);
  assert.match(note, /36[- ]second|36 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL percentages note has normalized corpus map and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "percentages.md"), "utf8");

  assert.match(note, /381 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/percentages-map\.svg/);
  assert.doesNotMatch(note, /\/img\/ssc-cgl\/percentage-base-ladder\.svg/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /36-second/);
  assert.match(note, /base|successive|percentage points|fraction conversion|multiplier/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|undefined/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL sports awards note has corpus pressure, visual map, and 25 clean recall drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "sports-awards.md"), "utf8");

  assert.match(note, /353 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/sports-awards-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /pinnacle-ssc-general-studies-p0076-p0100[\s\S]*106 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0101-p0125[\s\S]*78 promoted questions/);
  assert.match(note, /trophy|award|honour|book-author|first Indian/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|assume the question asks|ensure latest|check current affairs/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL economics budget banking note has corpus pressure, visual map, and 25 clean GA drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "economics-budget-banking.md"), "utf8");

  assert.match(note, /302 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/economics-budget-banking-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /pinnacle-ssc-general-studies-p0401-p0425[\s\S]*123 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0426-p0450[\s\S]*24 promoted questions/);
  assert.match(note, /RBI|repo|inflation|budget|banking|GDP|fiscal deficit/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Quit -|as of recent years|update before exam|current repo rate|latest MPC/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL syllogism venn note has corpus pressure, visual map, and 25 clean logic drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "syllogism-venn.md"), "utf8");

  assert.match(note, /301 indexed book-PYQ entries/);
  assert.match(note, /300 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/syllogism-venn-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /Scribd HTML Pages[\s\S]*301 indexed book-PYQ entries/);
  assert.match(note, /All A are B|No A is B|Some A are B|Some A are not B|only a few|possibility|either-or/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|maybe if|assuming real-world/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL non-verbal reasoning note has corpus pressure, visual map, and 25 clean visual drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "non-verbal-reasoning.md"), "utf8");

  assert.match(note, /300 indexed book-PYQ entries/);
  assert.match(note, /298 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/non-verbal-reasoning-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /Scribd HTML Pages[\s\S]*300 indexed book-PYQ entries/);
  assert.match(note, /mirror image|water image|embedded figure|paper folding|dice|cube|rotation|counting shapes/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|SSC CG L/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL mathematical operations note has corpus pressure, visual map, and 25 clean operator drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "mathematical-operations.md"), "utf8");

  assert.match(note, /157 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/mathematical-operations-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*157 promoted questions/);
  assert.match(note, /symbol substitution|operator interchange|coded operation|BODMAS|equation balance/i);
  assert.match(note, /15-minute|36[- ]second|45-second|25-30 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL seating arrangement note has corpus pressure, visual map, and 25 clean placement drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "seating-arrangement.md"), "utf8");

  assert.match(note, /138 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/seating-arrangement-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*138 promoted questions/);
  assert.match(note, /linear|circular|facing north|facing south|floor arrangement|two-row/i);
  assert.match(note, /15-minute|36[- ]second|45-second|25-30 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL blood relation note has corpus pressure, visual map, and 25 clean relation drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "blood-relation.md"), "utf8");

  assert.match(note, /118 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/blood-relation-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*118 promoted questions/);
  assert.match(note, /pointing statement|coded relation|only son|only daughter|in-law|generation/i);
  assert.match(note, /15-minute|36[- ]second|45-second|25-30 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL direction distance note has corpus pressure, visual map, and 25 clean axis drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "direction-distance.md"), "utf8");

  assert.match(note, /38 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/direction-distance-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*38 promoted questions/);
  assert.match(note, /north|south|east|west|left|right|shadow|Pythagoras|shortest distance/i);
  assert.match(note, /36[- ]second|36 seconds|20 seconds|50 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL statement conclusion note has corpus pressure, visual map, and 25 clean inference drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "statement-conclusion.md"), "utf8");

  assert.match(note, /14 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/statement-conclusion-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*14 promoted questions/);
  assert.match(note, /all|some|no|only|unless|possibility|either-or|course of action|cause-effect/i);
  assert.match(note, /36[- ]second|36 seconds|20 seconds|50 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL calendar clock note has corpus pressure, visual map, and 25 clean time drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "calendar-clock.md"), "utf8");

  assert.match(note, /13 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/calendar-clock-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Scribd HTML Pages[\s\S]*13 promoted questions/);
  assert.match(note, /odd days|leap year|century|month code|clock angle|coincide|opposite|straight line/i);
  assert.match(note, /36[- ]second|36 seconds|20 seconds|50 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL calculation speed note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "calculation-speed.md"), "utf8");

  assert.match(note, /208 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/calculation-speed-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 50\/50/);
  assert.match(note, /ssc-maths-6800-mcq-p0041-p0060[\s\S]*79 promoted questions/);
  assert.match(note, /Algebra[\s\S]*50 promoted questions/);
  assert.match(note, /Trigonometry[\s\S]*21 promoted questions/);
  assert.match(note, /option-gap|fraction|cancellation|digital sum|unit digit|approximation|base method/i);
  assert.match(note, /36[- ]second|36 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|fake mock/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL geometry mensuration note has corpus pressure, visual map, and 30 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "geometry-mensuration.md"), "utf8");

  assert.match(note, /1207 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/geometry-mensuration-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 50\/50/);
  assert.match(note, /Mensuration[\s\S]*603 promoted questions/);
  assert.match(note, /Geometry[\s\S]*531 promoted questions/);
  assert.match(note, /ssc-maths-6800-mcq-p0101-p0120[\s\S]*27 promoted questions/);
  assert.match(note, /triangle|circle|tangent|chord|cyclic quadrilateral|similarity|frustum|recasting|dimension change/i);
  assert.match(note, /36[- ]second|36 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|maybe if|Olympiad style rarely/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 30);
});

test("SSC CGL current affairs static GK note has corpus pressure, learner-facing daily brief flow, and 25 clean fact drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "current-affairs-static-gk.md"), "utf8");

  assert.match(note, /2810 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/current-affairs-static-gk-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /pinnacle-ssc-general-studies-p0176-p0200[\s\S]*204 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0201-p0225[\s\S]*194 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0101-p0125[\s\S]*188 promoted questions/);
  assert.match(note, /PIB|RBI|PRS|SSC notice|daily brief|official-source|static anchor/i);
  assert.match(note, /scheme|report|appointment|publisher|ministry|rank|static anchor|MCQ seed/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|random social media|unattributed coaching screenshot|End of note/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL computer awareness note has corpus pressure, visual map, and 25 clean fact drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "computer-awareness.md"), "utf8");

  assert.match(note, /113 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/computer-awareness-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0126-p0150[\s\S]*93 promoted questions/);
  assert.match(note, /CPU|RAM|ROM|internet|cyber|browser|spreadsheet|protocol/i);
  assert.match(note, /15-minute|36[- ]second|45-second|20-25 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL environment ecology note has corpus pressure, visual map, and 25 clean fact drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "environment-ecology.md"), "utf8");

  assert.match(note, /68 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/environment-ecology-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0351-p0375[\s\S]*24 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0376-p0400[\s\S]*12 promoted questions/);
  assert.match(note, /ecosystem|biodiversity|pollution|climate|conservation|Ramsar|Montreal|Kyoto/i);
  assert.match(note, /15-minute|36[- ]second|45-second|20-25 seconds|10-12 sec/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Goal|Final Check|but note:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL analogy classification note has corpus pressure, visual map, and 25 clean relation drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "analogy-classification.md"), "utf8");

  assert.match(note, /1285 promoted questions/);
  assert.match(note, /1285 indexed book-PYQ entries/);
  assert.match(note, /\/img\/ssc-cgl\/analogy-classification-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /Scribd HTML Pages[\s\S]*1285 indexed book-PYQ entries/);
  assert.match(note, /tool-action|part-whole|class-member|cause-effect|synonym|antonym|digit sum|opposite alphabet|odd one out/i);
  assert.match(note, /15-minute|36[- ]second|45-second|20-25 second/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|maybe if|broadly related/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL vocabulary cloze note has corpus pressure, visual map, and 25 clean cloze drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "vocabulary-cloze.md"), "utf8");

  assert.match(note, /893 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/vocabulary-cloze-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /pinnacle-ssc-english-p0326-p0350[\s\S]*365 promoted questions/);
  assert.match(note, /pinnacle-ssc-english-p0301-p0325[\s\S]*333 promoted questions/);
  assert.match(note, /pinnacle-ssc-english-p0276-p0300[\s\S]*195 promoted questions/);
  assert.match(note, /Cloze Passage Scan|Blank Prediction Rule|collocation|connector|tone|register|root|prefix|suffix/i);
  assert.match(note, /15-minute|45-second|2 minutes 30 seconds|25-30 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|maybe if|The Hindu|The Economist|Final Goal/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL core topic expansion adds DeepSeek-authored 200/200 notes", () => {
  for (const requiredNote of requiredDeepNotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
  }
});

test("SSC CGL art culture note has corpus pressure, visual map, and enough examples", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "art-culture.md"), "utf8");

  assert.match(note, /870 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/art-culture-map\.svg/);
  assert.match(note, /Fact Pair Unit/);
  assert.match(note, /Full Type Tree for 200\/200/);
  assert.match(note, /A\["Start art-culture question"\]/);
  assert.doesNotMatch(note, /C and D -->/);
  assert.doesNotMatch(note, /colonical/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL science everyday note has corpus pressure, visual map, and clean fact drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "science-everyday.md"), "utf8");

  assert.match(note, /489 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/science-everyday-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0526-p0550`, which contributes \*\*92 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-general-studies-p0501-p0525`, which contributes \*\*85 promoted questions\*\*/);
  assert.match(note, /High-Frequency Static Science Bank/);
  assert.match(note, /vitamin|hormone|acid|electricity/i);
  assert.match(note, /pressure cooker|blood group|barometer/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL history freedom movement note has corpus pressure, visual map, and clean timeline drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "history-freedom-movement.md"), "utf8");

  assert.match(note, /683 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/history-freedom-movement-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0226-p0250`, which contributes \*\*84 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-general-studies-p0476-p0500`, which contributes \*\*58 promoted questions\*\*/);
  assert.match(note, /Timeline Spine/);
  assert.match(note, /Governor-General and Viceroy Ladder/);
  assert.match(note, /Revolt centre|Congress session|Act-year/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|but note:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL indian polity note has corpus pressure, visual map, and clean article drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "indian-polity-basics.md"), "utf8");

  assert.match(note, /539 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/indian-polity-basics-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0251-p0275[\s\S]*190 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0276-p0300[\s\S]*180 promoted questions/);
  assert.match(note, /Article Range|Constitutional Body|Writ|Schedule|Amendment/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Clarify:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL geography note has corpus pressure, visual map, and clean map drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "geography-india-world.md"), "utf8");

  assert.match(note, /358 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/geography-india-world-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-general-studies-p0326-p0350[\s\S]*127 promoted questions/);
  assert.match(note, /pinnacle-ssc-general-studies-p0301-p0325[\s\S]*56 promoted questions/);
  assert.match(note, /river|monsoon|soil|latitude|longitude|mineral|national park/i);
  assert.match(note, /15-minute|36[- ]second|45-second/i);
  assert.doesNotMatch(note, /84'N|376'N|687'E|9725'E|8230'E|Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Clarify:|standalone study chapter/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL series coding note has corpus pressure, visual map, and clean drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "series-coding.md"), "utf8");

  assert.match(note, /836 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/series-coding-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Pattern Priority Ladder/);
  assert.match(note, /Squares 1-30/);
  assert.match(note, /Mirror Alphabet/);
  assert.doesNotMatch(note, /Actually|Better|Good luck|not in options|option missing|review-only|inconsistent|would not match|became A\?/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL number system note has corpus pressure, visual map, and 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "number-system.md"), "utf8");

  assert.match(note, /764 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/number-system-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /36-second Quant scoring bar/);
  assert.match(note, /HCF \/ LCM/);
  assert.match(note, /Trailing Zeroes|trailing zeroes/i);
  assert.doesNotMatch(note, /Actually|Good luck|not in options|option missing|review-only|inconsistent|Correction:|quarantine|quarantined/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL profit loss discount note has corpus pressure, visual map, and 36-second multiplier drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "profit-loss-discount.md"), "utf8");

  assert.match(note, /664 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/profit-loss-discount-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /223 direct Profit and Loss rows/);
  assert.match(note, /36-second Quant scoring bar/);
  assert.match(note, /false weight/i);
  assert.doesNotMatch(note, /Good luck|Actually|not in options|option missing|review-only|inconsistent|Correction:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL averages mixtures alligation note has corpus pressure, visual map, and 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "averages-mixtures-alligation.md"), "utf8");

  assert.match(note, /542 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/averages-mixtures-alligation-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Average direct cluster \(248 questions\)/);
  assert.match(note, /36-second/);
  assert.match(note, /alligation/i);
  assert.match(note, /repeated replacement/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL algebra note has corpus pressure, visual map, and clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "algebra.md"), "utf8");

  assert.match(note, /501 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/algebra-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Algebra direct cluster \(477 questions\)/);
  assert.match(note, /alpha \+ beta = -b\/a/);
  assert.match(note, /36-second/);
  assert.match(note, /reciprocal/i);
  assert.match(note, /factor theorem/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL data interpretation note has corpus pressure, visual map, and clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "data-interpretation.md"), "utf8");

  assert.match(note, /419 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/data-interpretation-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Data Interpretation QR Supplement`, which contributes \*\*328 promoted questions\*\*/);
  assert.match(note, /ssc-maths-6800-mcq-p0601-p0620`, which contributes \*\*35 promoted questions\*\*/);
  assert.match(note, /36-second set selection/i);
  assert.match(note, /table|bar chart|pie chart|caselet|approximation/i);
  assert.match(note, /row-column lock|base discipline|option gap/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL trigonometry note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "trigonometry.md"), "utf8");

  assert.match(note, /561 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/trigonometry-map\.svg/);
  assert.doesNotMatch(note, /\/img\/ssc-cgl\/trig-identity-map\.svg/);
  assert.match(note, /First 5-Second Classification|Full Type Tree for 200\/200/);
  assert.match(note, /direct `Trigonometry` with 487 questions/);
  assert.match(note, /ssc-maths-6800-mcq-p0061-p0080[\s\S]*22/);
  assert.match(note, /36-second/);
  assert.match(note, /standard value|identity|height-distance|triangle reconstruction/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|undefined/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL time speed distance note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "time-speed-distance.md"), "utf8");

  assert.match(note, /415 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/time-speed-distance-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /Time, Speed and Distance[\s\S]*138 promoted questions/);
  assert.match(note, /ssc-maths-6800-mcq-p0421-p0440[\s\S]*109 promoted questions/);
  assert.match(note, /relative speed|train crossing|boat-stream|circular track|race/i);
  assert.match(note, /36-second Quant scoring bar/);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Clarify:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL simple compound interest note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "simple-compound-interest.md"), "utf8");

  assert.match(note, /363 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/simple-compound-interest-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /ssc-maths-6800-mcq-p0541-p0560[\s\S]*184 promoted questions/);
  assert.match(note, /ssc-maths-6800-mcq-p0561-p0580[\s\S]*177 promoted questions/);
  assert.match(note, /simple interest|compound interest|installment|effective rate|depreciation/i);
  assert.match(note, /36-second Quant scoring bar/);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Clarify:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL probability note has corpus pressure, visual map, and 25 clean 36-second drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "probability.md"), "utf8");

  assert.match(note, /64 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/probability-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /ssc-maths-6800-mcq-p0621-p0640[\s\S]*61 promoted questions/);
  assert.match(note, /dice|coin|card|replacement|without replacement|at least|exactly one|complement/i);
  assert.match(note, /36[- ]second|36 seconds|20 seconds|50 seconds/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Clarify:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL idioms phrases note has corpus pressure, visual map, and clean recall drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "idioms-phrases.md"), "utf8");

  assert.match(note, /690 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/idioms-phrases-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /p0451-p0475 has 385 questions/);
  assert.match(note, /p0476-p0500 has 303 questions/);
  assert.match(note, /literal trap/i);
  assert.doesNotMatch(note, /584|Good luck|Actually|not in options|option missing|review-only|inconsistent|Correction:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL spelling one-word note has corpus pressure, visual map, and clean recall drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "spelling-one-word.md"), "utf8");

  assert.match(note, /594 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/spelling-one-word-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /p0551-p0569`, which contributes 318 promoted questions/);
  assert.match(note, /p0426-p0450`, which contributes 270 promoted questions/);
  assert.match(note, /double c and double m/i);
  assert.match(note, /British form/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL sentence improvement note has corpus pressure, visual map, and clean decision drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "sentence-improvement.md"), "utf8");

  assert.match(note, /590 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/sentence-improvement-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /p0101-p0125 cluster \(258 questions\)/);
  assert.match(note, /p0076-p0100 cluster \(230 questions\)/);
  assert.match(note, /No Improvement/);
  assert.match(note, /meaning preservation|preserve meaning/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL grammar error spotting note has corpus pressure, visual map, and clean rule drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "grammar-error-spotting.md"), "utf8");

  assert.match(note, /581 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/grammar-error-spotting-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0026-p0050`, which contributes \*\*235 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0001-p0025`, which contributes \*\*196 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0051-p0075`, which contributes \*\*148 promoted questions\*\*/);
  assert.match(note, /SVA lock|subject-verb/i);
  assert.match(note, /tense marker|article-preposition|pronoun case|parallelism/i);
  assert.match(note, /No Error discipline/);
  assert.doesNotMatch(note, /4223 English questions|12 for grammar-error-spotting|Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:|Answer refined|technically acceptable/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL fill in the blanks note has corpus pressure, visual map, and clean usage drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "fill-in-the-blanks.md"), "utf8");

  assert.match(note, /491 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/fill-in-the-blanks-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0251-p0275`, which contributes \*\*326 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0276-p0300`, which contributes \*\*154 promoted questions\*\*/);
  assert.match(note, /Grammar\s+\| part of speech/);
  assert.match(note, /Meaning\s+\| whether the blank matches/);
  assert.match(note, /Collocation\s+\| natural word pairing/);
  assert.match(note, /pay attention/);
  assert.match(note, /formal usage/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL reading comprehension note has corpus pressure, visual map, and clean passage drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "reading-comprehension.md"), "utf8");

  assert.match(note, /450 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/reading-comprehension-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0401-p0425`, which contributes \*\*232 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0351-p0375`, which contributes \*\*130 promoted questions\*\*/);
  assert.match(note, /Evidence Ladder/);
  assert.match(note, /central idea|inference|tone|vocabulary in context/i);
  assert.match(note, /outside knowledge|half-true|extreme language/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL synonyms antonyms note has corpus pressure, visual map, and clean vocabulary drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "synonyms-antonyms.md"), "utf8");

  assert.match(note, /427 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/synonyms-antonyms-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0526-p0550`, which contributes \*\*245 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0501-p0525`, which contributes \*\*180 promoted questions\*\*/);
  assert.match(note, /High-Frequency Vocabulary Bank/);
  assert.match(note, /connotation|part of speech|root|prefix/i);
  assert.match(note, /benevolent|ameliorate|exacerbate|ephemeral/i);
  assert.doesNotMatch(note, /Good luck|Happy studying|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL active passive direct indirect note has corpus pressure, visual map, and clean transformation drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "active-passive-direct-indirect.md"), "utf8");

  assert.match(note, /785 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/active-passive-direct-indirect-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0201-p0225`, which contributes \*\*199 promoted questions\*\*/);
  assert.match(note, /pinnacle-ssc-english-p0176-p0200`, which contributes \*\*188 promoted questions\*\*/);
  assert.match(note, /voice ladder|narration ladder/i);
  assert.match(note, /SVO lock|reporting verb lock|pronoun owner/i);
  assert.match(note, /universal truth|question order|by-phrase/i);
  assert.doesNotMatch(note, /26 questions|Good luck|Happy studying|Now you are ready|Actually|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Better:/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL para jumbles note has corpus pressure, visual map, and 25 clean ordering drills", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "para-jumbles.md"), "utf8");

  assert.match(note, /187 promoted questions/);
  assert.match(note, /\/img\/ssc-cgl\/para-jumbles-map\.svg/);
  assert.match(note, /First 5-Second Classification/);
  assert.match(note, /pinnacle-ssc-english-p0226-p0250[\s\S]*176 promoted questions/);
  assert.match(note, /opener|mandatory pair|pronoun|connector|chronology|conclusion/i);
  assert.match(note, /15-minute|36-second|25-30 seconds/i);
  assert.doesNotMatch(note, /Actually|Better|Good luck|Happy studying|not in options|option missing|none of the options|review-only|inconsistent|Correction:|wait:|Clarify:|standalone study chapter|Final Note/i);
  assert.ok((note.match(/^\*\*Example\s+\d+/gim) ?? []).length >= 25);
});

test("SSC CGL Quant 50/50 expansion adds 36-second deep math notes", () => {
  for (const requiredNote of requiredQuant50NotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /36[- ]second|36 seconds/i);
    assert.ok(note.length > 14000, "Quant 50/50 notes should be large enough for method, traps, examples, and timed drills");
  }
});

test("SSC CGL every Quant deep note is framed around 36-second scoring", () => {
  const quantRoot = path.join(process.cwd(), "docs", "ssc-cgl", "quant");
  const quantNotes = fs.readdirSync(quantRoot).filter((fileName) => fileName.endsWith(".md"));

  assert.ok(quantNotes.length >= 11);
  for (const fileName of quantNotes) {
    const note = fs.readFileSync(path.join(quantRoot, fileName), "utf8");

    assert.match(note, /36[- ]second|36 seconds/i, `${fileName} must teach the 36-second Quant timing bar`);
    assert.ok(note.length > 14000, `${fileName} must stay large enough for 50/50 method depth`);
  }
});

test("SSC CGL every missing Quant route has a dedicated DeepSeek 50/50 note", () => {
  for (const requiredNote of requiredQuantRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /36[- ]second|36 seconds/i);
    assert.ok(note.length > 14000, "Route-level Quant notes should be full 50/50 notes, not short aliases");
  }
});

test("SSC CGL Reasoning expansion adds dedicated 200/200 speed notes", () => {
  for (const requiredNote of requiredReasoning200NotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    assert.doesNotMatch(note, /practice\.opensyllabus\.org|https:\/\/example\.com/i);
    assert.ok(note.length > 14000, "Reasoning 200/200 notes should be large enough for type coverage, traps, examples, and timed drills");
  }
});

test("SSC CGL missing Reasoning routes have dedicated DeepSeek 200/200 notes", () => {
  for (const requiredNote of requiredReasoningRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    assert.ok(note.length > 14000, "Route-level Reasoning notes should be full 200/200 notes, not aliases");
  }
});

test("SSC CGL core English routes have dedicated DeepSeek 200/200 notes", () => {
  for (const requiredNote of requiredEnglishRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertDeepSeekNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    assert.ok(note.length > 14000, "Route-level English notes should be full 200/200 notes, not aliases");
  }
});

test("SSC CGL every generated topic has a same-slug dedicated DeepSeek note", () => {
  const blueprint = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "exams", "ssc-cgl", "book-imports", "corpus-blueprint.json"), "utf8")
  ) as { topics: Array<{ slug: string }> };
  const subjectDirs = ["english", "ga", "quant", "reasoning"];

  for (const topic of blueprint.topics) {
    const notePath = subjectDirs
      .map((subjectDir) => path.join(process.cwd(), "docs", "ssc-cgl", subjectDir, `${topic.slug}.md`))
      .find((candidatePath) => fs.existsSync(candidatePath));

    assert.ok(notePath, `${topic.slug} must have a dedicated same-slug SSC CGL note`);
    const note = fs.readFileSync(notePath, "utf8");
    assertDeepSeekNote(note, new RegExp(`/exams/ssc-cgl/topics/${escapeRegExp(topic.slug)}`));
    assert.ok(note.length > 9000, `${topic.slug} note must satisfy the exhaustive DeepSeek note contract`);
  }
});

test("SSC CGL DeepSeek note author prepares one-topic dry-run packets", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-deepseek-note-"));
  const outputPath = path.join(tempRoot, "time-work-pipes.md");

  execFileSync("python", [
    scriptPath,
    "--topic", "time-work-pipes",
    "--output", outputPath,
    "--audit-root", tempRoot,
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const prompt = fs.readFileSync(path.join(tempRoot, "time-work-pipes.deepseek-prompt.txt"), "utf8");
  const report = JSON.parse(fs.readFileSync(path.join(tempRoot, "authoring-report.json"), "utf8")) as {
    topic: string;
    provider: string;
    dryRun: boolean;
    wroteNote: boolean;
    outputPath: string;
  };

  assert.equal(report.topic, "time-work-pipes");
  assert.equal(report.provider, "deepseek");
  assert.equal(report.dryRun, true);
  assert.equal(report.wroteNote, false);
  assert.equal(report.outputPath, outputPath);
  assert.match(prompt, /SSC CGL Tier-I 200\/200/i);
  assert.match(prompt, /Do not add source-policy/i);
  assert.match(prompt, /strict markdown/i);
  assert.match(prompt, /Concept Ladder/i);
  assert.match(prompt, /Type System/i);
  assert.match(prompt, /PYQ Mapping/i);
  assert.match(prompt, /efficiency/i);
  assert.match(prompt, /pipes/i);
  assert.equal(fs.existsSync(outputPath), false);
});

test("SSC CGL DeepSeek note author can wrap valid model markdown with canonical frontmatter", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /def canonical_frontmatter/);
  assert.match(script, /def ensure_frontmatter/);
  assert.match(script, /def sanitize_ascii/);
  assert.match(script, /def strip_leading_metadata_object/);
  assert.match(script, /def generator_leakage/);
  assert.match(script, /generated_by: deepseek/);
  assert.doesNotMatch(script, /VISIBLE_SOURCE_POLICY/);
  assert.doesNotMatch(script, /ai-authored-needs-learner-review/);
  assert.doesNotMatch(script, /learner review/);
});
