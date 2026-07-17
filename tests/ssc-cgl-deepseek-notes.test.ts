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

function isAgentReviewedTopicNote(note: string) {
  return /review_status:\s*agent-reviewed/i.test(note);
}

function assertTopicStudyNote(note: string, routePattern: RegExp) {
  if (!isAgentReviewedTopicNote(note)) {
    assertDeepSeekNote(note, routePattern);
    return;
  }

  assert.match(note, /content_quality:\s*manually-curated/i);
  assert.doesNotMatch(note, /generated_by:\s*deepseek|ai-authored-needs-agent-review/i);
  assert.doesNotMatch(note, /corpus pressure|indexed book-PYQ|200\/200 system/i);
  assert.ok((note.match(/^##\s+/gm) ?? []).length >= 6, "Curated topic note should have a purposeful learning sequence");
  assert.ok((note.match(/^\*\*(?:Worked example|Self-check)\*\*|^###\s+Question\s+\d+/gim) ?? []).length >= 10, "Curated topic note should interleave examples and self-checks");
  assert.match(note, /\/exams\/ssc-cgl\/practice\//);
  assert.ok(note.length > 6000, "Curated topic note should explain the full method without padding");
}

function assertReviewedReasoningNote(note: string, slug: string, keywordPattern: RegExp) {
  assertTopicStudyNote(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, new RegExp(`/img/ssc-cgl/${escapeRegExp(slug)}-map\\.svg`));
  assert.match(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, keywordPattern);
  assert.doesNotMatch(note, /Corpus Pressure|Scribd HTML Pages|promoted questions?|indexed book-PYQ|Final Practice Queue|200\/200 Drill/i);
}

function assertReviewedGeneralAwarenessNote(note: string, slug: string, keywordPattern: RegExp) {
  assertTopicStudyNote(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, new RegExp(`/img/ssc-cgl/${escapeRegExp(slug)}-map\\.svg`));
  assert.match(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, keywordPattern);
  assert.doesNotMatch(note, /Corpus Pressure|Scribd HTML Pages|promoted questions?|indexed book-PYQ|Final Practice Queue|200\/200 Drill|Full Type Tree/i);
}

function assertReviewedQuantitativeAptitudeNote(note: string, slug: string, keywordPattern: RegExp) {
  assertTopicStudyNote(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, new RegExp(`/img/ssc-cgl/${escapeRegExp(slug)}-map\\.svg`));
  assert.match(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, keywordPattern);
  assert.match(note, /Direct[\s\S]*mark[- ]and[- ]return|mark[- ]and[- ]return[\s\S]*Direct/i);
  assert.doesNotMatch(note, /Corpus Pressure|Scribd HTML Pages|promoted questions?|indexed book-PYQ|Final Practice Queue|\b200\/200\b|Full Type Tree|\b50\/50\b/i);
}

function assertReviewedEnglishComprehensionNote(note: string, slug: string, keywordPattern: RegExp) {
  assertTopicStudyNote(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, new RegExp(`/img/ssc-cgl/${escapeRegExp(slug)}-map\\.svg`));
  assert.match(note, new RegExp(`/exams/ssc-cgl/practice/${escapeRegExp(slug)}`));
  assert.match(note, keywordPattern);
  assert.match(note, /Direct[\s\S]*mark[- ]and[- ]return|mark[- ]and[- ]return[\s\S]*Direct/i);
  assert.doesNotMatch(note, /Corpus Pressure|Scribd HTML Pages|promoted questions?|indexed book-PYQ|Final Practice Queue|\b200\/200\b|Full Type Tree|25-question|vocabulary bank/i);
}

test("SSC CGL percentages ratio note is DeepSeek-authored and exhaustive", () => {
  const note = fs.readFileSync(percentagesNotePath, "utf8");

  assertDeepSeekNote(note, /\/exams\/ssc-cgl\/topics\/percentages|\/exams\/ssc-cgl\/topics\/ratio-proportion/);
});

test("SSC CGL time work pipes note is a reviewed rate-based learner chapter", () => {
  const note = fs.readFileSync(timeWorkNotePath, "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "time-work-pipes", /efficiency|work rate|pipes|leak|LCM|wages/i);
});

test("SSC CGL ratio proportion note is a reviewed unit-safe learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "ratio-proportion.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "ratio-proportion", /ratio|proportion|partnership|inverse|ages|units/i);
});

test("SSC CGL percentages note is a reviewed base-first learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "percentages.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "percentages", /base|successive|percentage points|fraction|multiplier/i);
});

test("SSC CGL sports awards note is a reviewed learner chapter with dated-fact safeguards", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "sports-awards.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "sports-awards", /trophy|award|honour|book|historic first|edition|current-affairs/i);
});

test("SSC CGL economics budget banking note is a reviewed concept-first learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "economics-budget-banking.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "economics-budget-banking", /RBI|repo|inflation|Budget|banking|GDP|fiscal deficit/i);
});

test("SSC CGL syllogism venn note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "syllogism-venn.md"), "utf8");

  assertReviewedReasoningNote(note, "syllogism-venn", /All A are B|No A is B|Some A are B|Some A are not B|only a few|possibility|either-or/i);
});

test("SSC CGL non-verbal reasoning note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "non-verbal-reasoning.md"), "utf8");

  assertReviewedReasoningNote(note, "non-verbal-reasoning", /mirror image|water image|embedded figure|paper folding|dice|cube|rotation|counting/i);
});

test("SSC CGL mathematical operations note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "mathematical-operations.md"), "utf8");

  assertReviewedReasoningNote(note, "mathematical-operations", /symbol substitution|operator interchange|coded operation|BODMAS|equation/i);
});

test("SSC CGL seating arrangement note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "seating-arrangement.md"), "utf8");

  assertReviewedReasoningNote(note, "seating-arrangement", /linear|circular|facing north|facing south|two facing rows|rank/i);
});

test("SSC CGL blood relation note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "blood-relation.md"), "utf8");

  assertReviewedReasoningNote(note, "blood-relation", /pointing|coded relation|only son|only daughter|generation|uncle|niece|nephew/i);
});

test("SSC CGL direction distance note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "direction-distance.md"), "utf8");

  assertReviewedReasoningNote(note, "direction-distance", /north|south|east|west|left|right|displacement|Pythagoras|shortest distance/i);
});

test("SSC CGL statement conclusion note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "statement-conclusion.md"), "utf8");

  assertReviewedReasoningNote(note, "statement-conclusion", /statement|conclusion|quantifier|inference|does not follow|causation/i);
});

test("SSC CGL calendar clock note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "calendar-clock.md"), "utf8");

  assertReviewedReasoningNote(note, "calendar-clock", /odd days|leap year|century|clock angle|coincide|opposite|straight line/i);
});

test("SSC CGL calculation speed note is a reviewed safe-shortcut learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "calculation-speed.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "calculation-speed", /fraction|cancellation|unit digit|approximation|near-base|option/i);
});

test("SSC CGL geometry mensuration note is a reviewed diagram-and-units learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "geometry-mensuration.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "geometry-mensuration", /triangle|circle|similarity|surface area|volume|recasting|scale/i);
});

test("SSC CGL current affairs static GK note is a reviewed source-safe learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "current-affairs-static-gk.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "current-affairs-static-gk", /PIB|RBI|SSC notice|official source|static anchor|as-of date|reference date/i);
});

test("SSC CGL computer awareness note is a reviewed concept-first learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "computer-awareness.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "computer-awareness", /CPU|RAM|ROM|internet|cyber|browser|spreadsheet|protocol/i);
});

test("SSC CGL environment ecology note is a reviewed principle-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "environment-ecology.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "environment-ecology", /ecosystem|biodiversity|pollution|climate|conservation|Ramsar|Montreal|Kyoto/i);
});

test("SSC CGL analogy classification note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "analogy-classification.md"), "utf8");

  assert.match(note, /review_status:\s*agent-reviewed/i);
  assert.match(note, /content_quality:\s*manually-curated/i);
  assert.match(note, /\/img\/ssc-cgl\/analogy-classification-map\.svg/);
  assert.match(note, /exact-relation method|word relations|number relations|letter relations|odd one out/i);
  assert.match(note, /36[- ]second/i);
  assert.doesNotMatch(note, /corpus pressure|promoted questions|indexed book-PYQ|Scribd|Full Type Tree|200\/200 Drill/i);
  assert.ok((note.match(/^\*\*(?:Worked example|Self-check)\*\*|^###\s+Question\s+\d+/gim) ?? []).length >= 10);
});

test("SSC CGL vocabulary cloze note is a reviewed passage-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "vocabulary-cloze.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "vocabulary-cloze", /passage|grammar|collocation|cohesion|connotation|register|connector/i);
});

test("SSC CGL core topic expansion adds DeepSeek-authored 200/200 notes", () => {
  for (const requiredNote of requiredDeepNotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertTopicStudyNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
  }
});

test("SSC CGL art culture note is a reviewed association-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "art-culture.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "art-culture", /classical dance|folk|literature|monument|painting|instrument|GI/i);
});

test("SSC CGL science everyday note is a reviewed principle-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "science-everyday.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "science-everyday", /vitamin|hormone|acid|electricity|pressure cooker|barometer/i);
});

test("SSC CGL history freedom movement note is a reviewed chronological learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "history-freedom-movement.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "history-freedom-movement", /timeline|Revolt of 1857|Congress|Gandhian|Government of India Act/i);
});

test("SSC CGL indian polity note is a reviewed provision-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "indian-polity-basics.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "indian-polity-basics", /Article|Constitutional Bod|writ|Schedule|amendment|Money Bill/i);
});

test("SSC CGL geography note is a reviewed map-and-process learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "ga", "geography-india-world.md"), "utf8");

  assertReviewedGeneralAwarenessNote(note, "geography-india-world", /river|monsoon|soil|latitude|longitude|mineral|mangrove/i);
});

test("SSC CGL series coding note is a reviewed learner chapter with placed practice", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "series-coding.md"), "utf8");

  assertReviewedReasoningNote(
    note,
    "series-coding",
    /number series|letter series|coding-decoding|alphabet|alternating|position/i
  );
});

test("SSC CGL number system note is a reviewed divisibility-and-remainders learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "number-system.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "number-system", /divisibility|remainder|unit digit|divisor|factorial|trailing zero/i);
});

test("SSC CGL profit loss discount note is a reviewed base-and-multiplier learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "profit-loss-discount.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "profit-loss-discount", /cost price|selling price|marked price|successive discount|false weight/i);
});

test("SSC CGL averages mixtures alligation note is a reviewed weighted-total learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "averages-mixtures-alligation.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "averages-mixtures-alligation", /average|weighted|mixture|alligation|replacement|concentration/i);
});

test("SSC CGL algebra note is a reviewed domain-and-sign-safe learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "algebra.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "algebra", /identity|linear equation|quadratic|factor|remainder|inequality|progression/i);
});

test("SSC CGL data interpretation note is a reviewed display-audit learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "data-interpretation.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "data-interpretation", /table|bar chart|pie chart|weighted average|missing value|approximation/i);
});

test("SSC CGL trigonometry note is a reviewed ratio-and-domain learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "trigonometry.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "trigonometry", /standard values|identity|quadrant|height|distance|undefined/i);
});

test("SSC CGL time speed distance note is a reviewed units-and-relative-speed learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "time-speed-distance.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "time-speed-distance", /relative speed|train|boat|stream|race|km\/h|m\/s/i);
});

test("SSC CGL simple compound interest note is a reviewed growth-factor learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "simple-compound-interest.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "simple-compound-interest", /simple interest|compound interest|effective rate|depreciation|compounding/i);
});

test("SSC CGL probability note is a reviewed sample-space learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "probability.md"), "utf8");

  assertReviewedQuantitativeAptitudeNote(note, "probability", /sample space|dice|coin|card|replacement|complement|conditional/i);
});

test("SSC CGL idioms phrases note is a reviewed context-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "idioms-phrases.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "idioms-phrases", /figurative|literal|fixed form|phrasal verb|proverb|register/i);
});

test("SSC CGL spelling one-word note is a reviewed morphology-and-definition learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "spelling-one-word.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "spelling-one-word", /morphology|suffix|doubl|British|confusable|definition|one-word/i);
});

test("SSC CGL sentence improvement note is a reviewed meaning-preserving learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "sentence-improvement.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "sentence-improvement", /agreement|tense|modifier|reference|parallel|concision|No improvement/i);
});

test("SSC CGL grammar error spotting note is a reviewed relationship-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "grammar-error-spotting.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "grammar-error-spotting", /subject|agreement|tense|article|preposition|pronoun|modifier|parallel/i);
});

test("SSC CGL fill in the blanks note is a reviewed grammar-and-collocation learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "fill-in-the-blanks.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "fill-in-the-blanks", /prediction|grammar|article|preposition|collocation|connector|connotation|paired blanks/i);
});

test("SSC CGL reading comprehension note is a reviewed evidence-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "reading-comprehension.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "reading-comprehension", /central idea|detail|inference|tone|purpose|vocabulary|reference|evidence/i);
});

test("SSC CGL synonyms antonyms note is a reviewed contextual-sense learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "synonyms-antonyms.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "synonyms-antonyms", /contextual sense|part of speech|connotation|degree|register|opposition|root/i);
});

test("SSC CGL active passive direct indirect note is a reviewed meaning-preserving learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "active-passive-direct-indirect.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "active-passive-direct-indirect", /active|passive|object|auxiliary|reporting verb|backshift|pronoun|question/i);
});

test("SSC CGL para jumbles note is a reviewed cohesion-led learner chapter", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "english", "para-jumbles.md"), "utf8");

  assertReviewedEnglishComprehensionNote(note, "para-jumbles", /opener|reference|mandatory|connector|chronology|cause|coherence/i);
});

test("SSC CGL Quant expansion keeps complete math notes across authoring generations", () => {
  for (const requiredNote of requiredQuant50NotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");
    const slug = path.basename(requiredNote.path, ".md");

    if (isAgentReviewedTopicNote(note)) {
      assertReviewedQuantitativeAptitudeNote(note, slug, requiredNote.keywordPattern);
    } else {
      assertDeepSeekNote(note, requiredNote.routePattern);
      assert.match(note, requiredNote.keywordPattern);
      assert.match(note, /36[- ]second|36 seconds/i);
    }
    assert.ok(
      note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000),
      "Quant notes should be large enough for methods, conditions, examples, and placed practice"
    );
  }
});

test("SSC CGL every Quant note satisfies its complete topic-study contract", () => {
  const quantRoot = path.join(process.cwd(), "docs", "ssc-cgl", "quant");
  const quantNotes = fs.readdirSync(quantRoot).filter((fileName) => fileName.endsWith(".md"));

  assert.ok(quantNotes.length >= 11);
  for (const fileName of quantNotes) {
    const note = fs.readFileSync(path.join(quantRoot, fileName), "utf8");

    if (isAgentReviewedTopicNote(note)) {
      assertTopicStudyNote(note, /\/exams\/ssc-cgl\/practice\//);
    } else if (/generated_by:\s*deepseek/i.test(note)) {
      assertDeepSeekNote(note, /\/exams\/ssc-cgl\/topics\//);
      assert.match(note, /36[- ]second|36 seconds/i, `${fileName} generated note must retain its timing gate`);
    } else {
      assert.match(note, /36[- ]second|36 seconds/i, `${fileName} legacy section guide must retain its timing gate`);
    }
    assert.ok(
      note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000),
      `${fileName} must stay large enough for its complete topic-study contract`
    );
  }
});

test("SSC CGL every canonical Quant route has a dedicated complete learner note", () => {
  for (const requiredNote of requiredQuantRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");
    const slug = path.basename(requiredNote.path, ".md");

    if (isAgentReviewedTopicNote(note)) {
      assertReviewedQuantitativeAptitudeNote(note, slug, requiredNote.keywordPattern);
    } else {
      assertDeepSeekNote(note, requiredNote.routePattern);
      assert.match(note, requiredNote.keywordPattern);
      assert.match(note, /36[- ]second|36 seconds/i);
    }
    assert.ok(
      note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000),
      "Route-level Quant notes should be complete lessons, not short aliases"
    );
  }
});

test("SSC CGL Reasoning expansion adds dedicated complete topic notes", () => {
  for (const requiredNote of requiredReasoning200NotePaths) {
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertTopicStudyNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    assert.doesNotMatch(note, /practice\.opensyllabus\.org|https:\/\/example\.com/i);
    assert.ok(
      note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000),
      "Reasoning topic notes should be large enough for type coverage, traps, examples, and timed drills"
    );
  }
});

test("SSC CGL missing Reasoning routes have dedicated complete topic notes", () => {
  for (const requiredNote of requiredReasoningRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");

    assertTopicStudyNote(note, requiredNote.routePattern);
    assert.match(note, requiredNote.keywordPattern);
    assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    assert.ok(note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000), "Route-level Reasoning notes should teach the complete topic, not act as aliases");
  }
});

test("SSC CGL core English routes have dedicated complete learner notes", () => {
  for (const requiredNote of requiredEnglishRouteNotePaths) {
    assert.ok(fs.existsSync(requiredNote.path), `${requiredNote.path} must exist as a route-level note`);
    const note = fs.readFileSync(requiredNote.path, "utf8");
    const slug = path.basename(requiredNote.path, ".md");

    if (isAgentReviewedTopicNote(note)) {
      assertReviewedEnglishComprehensionNote(note, slug, requiredNote.keywordPattern);
    } else {
      assertDeepSeekNote(note, requiredNote.routePattern);
      assert.match(note, requiredNote.keywordPattern);
      assert.match(note, /15-minute|36[- ]second|36 seconds|speed/i);
    }
    assert.ok(
      note.length > (isAgentReviewedTopicNote(note) ? 6000 : 14000),
      "Route-level English notes should be complete lessons, not aliases"
    );
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
    assertTopicStudyNote(note, new RegExp(`/exams/ssc-cgl/topics/${escapeRegExp(topic.slug)}`));
    assert.ok(note.length > 6000, `${topic.slug} note must satisfy the complete topic-study contract`);
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
  assert.match(prompt, /SSC CGL Tier-I topic lesson/i);
  assert.match(prompt, /Do not add source-policy/i);
  assert.match(prompt, /strict markdown/i);
  assert.match(prompt, /6 to 8 purposeful H2 sections/i);
  assert.match(prompt, /no more than 5 tables/i);
  assert.match(prompt, /collapsed <details> blocks/i);
  assert.match(prompt, /efficiency/i);
  assert.match(prompt, /pipes/i);
  assert.equal(fs.existsSync(outputPath), false);
});

test("SSC CGL DeepSeek note author can wrap valid model markdown with canonical frontmatter", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /def canonical_frontmatter/);
  assert.match(script, /def ensure_frontmatter/);
  assert.match(script, /def sanitize_markdown/);
  assert.match(script, /def strip_leading_metadata_object/);
  assert.match(script, /def generator_leakage/);
  assert.match(script, /generated_by: deepseek/);
  assert.doesNotMatch(script, /VISIBLE_SOURCE_POLICY/);
  assert.doesNotMatch(script, /ai-authored-needs-learner-review/);
  assert.doesNotMatch(script, /learner review/);
});
