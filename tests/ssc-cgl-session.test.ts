import assert from "node:assert/strict";
import test from "node:test";
import type { SscCglQuestion, SscCglSectionId } from "@/lib/exam-types";
import {
  buildSscEndlessBatch,
  buildSscSessionTest,
  filterSscSessionQuestions,
  parseSscSessionConfig,
  type SscSessionConfig
} from "@/lib/ssc-cgl-session";

const sections: SscCglSectionId[] = [
  "reasoning",
  "general-awareness",
  "quantitative-aptitude",
  "english-comprehension"
];

function question(id: string, section: SscCglSectionId, index: number): SscCglQuestion {
  return {
    id,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Session fixture",
    source: index % 2 === 0 ? "PYQ" : "Original practice",
    section,
    topic: `${section}-topic`,
    subtopic: `${section} subtopic`,
    difficulty: index % 3 === 0 ? "hard" : index % 3 === 1 ? "medium" : "easy",
    language: "en",
    stem: `Question ${id}`,
    options: [
      { id: "a", text: "Answer A" },
      { id: "b", text: "Answer B" },
      { id: "c", text: "Answer C" },
      { id: "d", text: "Answer D" }
    ],
    correctOption: "a",
    explanation: "Correct answer: A. Method: fixture. Why it fits: fixture. Trap to avoid: fixture.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: index % 7 === 0 ? ["gap-repair"] : ["fixture"],
    provenance: {
      sourceId: `source-${id}`,
      sourceType: index % 2 === 0 ? "book_user_provided" : "original_practice",
      title: "Session fixture",
      licenseNote: "Test fixture"
    }
  };
}

const corpus = sections.flatMap((section) => (
  Array.from({ length: 40 }, (_, index) => question(`${section}-${index + 1}`, section, index))
));

function config(overrides: Partial<SscSessionConfig> = {}): SscSessionConfig {
  return {
    mode: "quick",
    section: "all",
    length: 10,
    timer: "exam",
    source: "all",
    difficulty: "all",
    weakStatus: "all",
    seed: "session-test-seed",
    ...overrides
  };
}

test("session configuration normalises full mock and endless invariants", () => {
  const full = parseSscSessionConfig({ mode: "full", section: "reasoning", length: "10", timer: "off", seed: "full" });
  assert.equal(full.section, "all");
  assert.equal(full.length, 100);
  assert.equal(full.timer, "exam");
  assert.equal(full.source, "book");

  const endless = parseSscSessionConfig({ mode: "endless", length: "100", seed: "endless" });
  assert.equal(endless.length, "endless");
});

test("full mock builder selects 25 questions per section with official timing", () => {
  const result = buildSscSessionTest(corpus, config({ mode: "full", length: 100 }));

  assert.equal(result.test.questionCount, 100);
  assert.equal(result.test.maxScore, 200);
  assert.equal(result.test.durationSeconds, 3600);
  assert.deepEqual(result.test.sections.map((section) => [section.id, section.questions.length, section.timerSeconds]), [
    ["reasoning", 25, 900],
    ["general-awareness", 25, 900],
    ["quantitative-aptitude", 25, 900],
    ["english-comprehension", 25, 900]
  ]);
});

test("section and timer choices materially change the generated test", () => {
  const result = buildSscSessionTest(corpus, config({
    mode: "section",
    section: "quantitative-aptitude",
    length: 10,
    timer: "relaxed"
  }));

  assert.equal(result.test.sections.length, 1);
  assert.equal(result.test.sections[0]?.id, "quantitative-aptitude");
  assert.equal(result.test.sections[0]?.questions.length, 10);
  assert.equal(result.test.sections[0]?.timerSeconds, 720);
});

test("source and difficulty filters use reviewed matching questions only", () => {
  const filtered = filterSscSessionQuestions(corpus, config({ source: "book", difficulty: "hard" }));
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((item) => item.provenance.sourceType === "book_user_provided"));
  assert.ok(filtered.every((item) => item.difficulty === "hard"));
});

test("session filters reject broken book-layout and missing-figure questions", () => {
  const brokenImage = question("broken-image", "reasoning", 2);
  brokenImage.stem = "Choose the answer figure ![page scan](../assets/images/page-1.jpg) Pinnacle SSC Reasoning";
  const brokenShiftOption = question("broken-shift", "reasoning", 4);
  brokenShiftOption.options[1]!.text = "CGL 7/3/2020 (Afternoon)";
  const usable = question("usable", "reasoning", 5);

  const filtered = filterSscSessionQuestions([brokenImage, brokenShiftOption, usable], config({ section: "reasoning" }));
  assert.deepEqual(filtered.map((item) => item.id), ["usable"]);
});

test("session questions remove OCR seam markers and trailing paper labels", () => {
  const ocrQuestion = question("ocr-seam", "reasoning", 2);
  ocrQuestion.stem = "Select the related pair. -| Lotus: Flower/: CPO 09/12/2019(Morning)";

  const [normalized] = filterSscSessionQuestions([ocrQuestion], config({ section: "reasoning", source: "book" }));
  assert.equal(normalized?.stem, "Select the related pair. Lotus: Flower");
});

test("weakness sessions prioritise saved question ids and disclose fallback", () => {
  const savedQuestionIds = ["reasoning-1", "reasoning-4"];
  const personalised = buildSscSessionTest(corpus, config({ mode: "weak", section: "reasoning", length: 10 }), savedQuestionIds);
  assert.equal(personalised.usedWeaknessFallback, false);
  const personalisedIds = new Set(personalised.test.sections.flatMap((section) => section.questions.map((item) => item.id)));
  assert.equal(personalised.test.questionCount, 10);
  assert.ok(savedQuestionIds.every((questionId) => personalisedIds.has(questionId)));

  const fallback = buildSscSessionTest(corpus, config({ mode: "weak", section: "reasoning", length: 10 }), ["missing-id"]);
  assert.equal(fallback.usedWeaknessFallback, true);
  assert.ok(fallback.test.questionCount > 0);
  assert.ok(fallback.test.sections.flatMap((section) => section.questions).every((item) => (
    item.difficulty === "hard" || item.conceptTags.includes("gap-repair")
  )));
});

test("PYQ mode enforces its reviewed book source even when the URL asks for original questions", () => {
  const parsed = parseSscSessionConfig({ mode: "pyq", source: "original", length: "25", seed: "pyq" });
  assert.equal(parsed.source, "book");
  const result = buildSscSessionTest(corpus, parsed);
  assert.ok(result.test.questionCount > 0);
  assert.ok(result.test.sections.flatMap((section) => section.questions).every((item) => (
    item.source === "PYQ" || item.provenance.sourceType === "book_user_provided"
  )));
});

test("endless batches are deterministic, paged, and non-overlapping", () => {
  const endlessConfig = config({ mode: "endless", length: "endless" });
  const first = buildSscEndlessBatch(corpus, endlessConfig, 0, 20);
  const firstAgain = buildSscEndlessBatch(corpus, endlessConfig, 0, 20);
  const second = buildSscEndlessBatch(corpus, endlessConfig, first.nextCursor, 20);

  assert.deepEqual(first.questions.map((item) => item.id), firstAgain.questions.map((item) => item.id));
  assert.equal(first.questions.length, 20);
  assert.equal(second.questions.length, 20);
  assert.equal(first.questions.some((item) => second.questions.some((next) => next.id === item.id)), false);
  assert.equal(first.total, corpus.length);
});
