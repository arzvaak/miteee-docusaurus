import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";
import test from "node:test";
import type { TimedTestDraft } from "@/components/TimedTestRunner";
import type { SscCglQuestion, SscCglSectionId, SscCglTestDetail } from "@/lib/exam-types";

register(`data:text/javascript,${encodeURIComponent(`
  export async function resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".css")) {
      return { shortCircuit: true, url: new URL(specifier, context.parentURL).href };
    }
    return nextResolve(specifier, context);
  }
  export async function load(url, context, nextLoad) {
    if (url.endsWith(".css")) {
      return {
        format: "module",
        shortCircuit: true,
        source: "export default new Proxy({}, { get: (_target, property) => String(property) });"
      };
    }
    return nextLoad(url, context);
  }
`)}`);

const {
  getQuestionPaletteStatus,
  getSectionTimeoutAction,
  getSectionVisualState,
  isTimedSection,
  parseTimedTestDraft,
  timedTestDraftStorageKey
} = await import("@/components/TimedTestRunner");

const sectionFixtures: Array<{ id: SscCglSectionId; title: string }> = [
  { id: "reasoning", title: "General Intelligence and Reasoning" },
  { id: "general-awareness", title: "General Awareness" },
  { id: "quantitative-aptitude", title: "Quantitative Aptitude" },
  { id: "english-comprehension", title: "English Comprehension" }
];

function fixtureQuestion(section: SscCglSectionId, index: number): SscCglQuestion {
  return {
    id: `${section}-q${index}`,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Runner fixture",
    source: "Original practice",
    section,
    topic: "runner-fixture",
    subtopic: "Runner fixture",
    difficulty: "easy",
    language: "en",
    stem: `Question ${index}`,
    options: [
      { id: "a", text: "Option A" },
      { id: "b", text: "Option B" },
      { id: "c", text: "Option C" },
      { id: "d", text: "Option D" }
    ],
    correctOption: "a",
    explanation: "Shown after submission.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: ["fixture"],
    provenance: {
      sourceId: "runner-fixture",
      sourceType: "original_practice",
      title: "Runner fixture",
      licenseNote: "Fixture"
    }
  };
}

function fixtureTest(untimed = false): SscCglTestDetail {
  const sections = sectionFixtures.map((section, sectionIndex) => ({
    ...section,
    timerSeconds: untimed ? 0 : 900,
    questions: [fixtureQuestion(section.id, sectionIndex * 2 + 1), fixtureQuestion(section.id, sectionIndex * 2 + 2)]
  }));
  return {
    id: untimed ? "runner-untimed" : "runner-timed",
    title: untimed ? "Untimed runner" : "Timed runner",
    mode: "full_mock",
    questionCount: 8,
    maxScore: 16,
    durationSeconds: untimed ? 0 : 3600,
    sourceType: "original_practice",
    reviewStatus: "reviewed",
    description: "Runner behavior fixture",
    sections
  };
}

test("question palette exposes all five response states without relying on color", () => {
  assert.equal(getQuestionPaletteStatus({ answered: false, visited: false, marked: false }), "not-visited");
  assert.equal(getQuestionPaletteStatus({ answered: false, visited: true, marked: false }), "not-answered");
  assert.equal(getQuestionPaletteStatus({ answered: true, visited: true, marked: false }), "answered");
  assert.equal(getQuestionPaletteStatus({ answered: false, visited: true, marked: true }), "marked");
  assert.equal(getQuestionPaletteStatus({ answered: true, visited: true, marked: true }), "answered-marked");
});

test("section rail is one-way: past sections complete, current stays active, and future sections stay locked", () => {
  assert.deepEqual(
    [0, 1, 2, 3].map((index) => getSectionVisualState(index, 1)),
    ["completed", "current", "up-next", "locked"]
  );
});

test("positive timers advance sections and submit only at the final timeout", () => {
  assert.equal(isTimedSection(900), true);
  assert.equal(getSectionTimeoutAction({ timerSeconds: 900, remainingSeconds: 1, sectionIndex: 0, sectionCount: 4 }), "none");
  assert.equal(getSectionTimeoutAction({ timerSeconds: 900, remainingSeconds: 0, sectionIndex: 0, sectionCount: 4 }), "advance");
  assert.equal(getSectionTimeoutAction({ timerSeconds: 900, remainingSeconds: 0, sectionIndex: 3, sectionCount: 4 }), "submit");
});

test("timer=off sections remain untimed and never auto-advance or auto-submit", () => {
  assert.equal(isTimedSection(0), false);
  assert.equal(getSectionTimeoutAction({ timerSeconds: 0, remainingSeconds: 0, sectionIndex: 0, sectionCount: 4 }), "none");
  assert.equal(getSectionTimeoutAction({ timerSeconds: 0, remainingSeconds: 0, sectionIndex: 3, sectionCount: 4 }), "none");
});

test("in-progress drafts recover answers, review marks, per-section clocks, and strict locks", () => {
  const paper = fixtureTest();
  const saved: TimedTestDraft = {
    version: 1,
    testId: paper.id,
    answers: {
      "reasoning-q1": "b",
      "quantitative-aptitude-q5": "d"
    },
    visitedQuestionIds: ["reasoning-q1", "quantitative-aptitude-q5"],
    markedQuestionIds: ["quantitative-aptitude-q5"],
    sectionIndex: 2,
    questionIndex: 0,
    lockedSectionIds: ["reasoning", "general-awareness"],
    sectionRemainingSeconds: {
      reasoning: 0,
      "general-awareness": 0,
      "quantitative-aptitude": 611,
      "english-comprehension": 900
    },
    sectionTimeSpentSeconds: {
      reasoning: 900,
      "general-awareness": 900,
      "quantitative-aptitude": 289,
      "english-comprehension": 0
    },
    startedAt: "2026-07-13T10:00:00.000Z",
    savedAt: "2026-07-13T10:34:49.000Z"
  };

  const recovered = parseTimedTestDraft(JSON.stringify(saved), paper);

  assert.ok(recovered);
  assert.equal(timedTestDraftStorageKey(paper.id), `ssc-cgl-draft:${paper.id}`);
  assert.equal(recovered.sectionIndex, 2);
  assert.equal(recovered.questionIndex, 0);
  assert.deepEqual(recovered.lockedSectionIds, ["reasoning", "general-awareness"]);
  assert.equal(recovered.sectionRemainingSeconds["quantitative-aptitude"], 611);
  assert.equal(recovered.sectionTimeSpentSeconds["quantitative-aptitude"], 289);
  assert.equal(recovered.answers["quantitative-aptitude-q5"], "d");
  assert.deepEqual(recovered.markedQuestionIds, ["quantitative-aptitude-q5"]);
});

test("draft recovery rejects stale papers and sanitizes tampered session values", () => {
  const paper = fixtureTest();
  const tampered = {
    version: 1,
    testId: paper.id,
    answers: {
      "reasoning-q1": "c",
      "reasoning-q2": "not-an-option",
      "unknown-question": "a"
    },
    visitedQuestionIds: ["reasoning-q1", "unknown-question"],
    markedQuestionIds: ["reasoning-q1", "unknown-question"],
    sectionIndex: 999,
    questionIndex: 999,
    lockedSectionIds: ["english-comprehension"],
    sectionRemainingSeconds: { reasoning: 99999, "english-comprehension": -1 },
    sectionTimeSpentSeconds: { reasoning: 99999, "english-comprehension": -1 },
    startedAt: "2026-07-13T10:00:00.000Z",
    savedAt: "2026-07-13T10:01:00.000Z"
  };

  const recovered = parseTimedTestDraft(JSON.stringify(tampered), paper);

  assert.ok(recovered);
  assert.equal(recovered.sectionIndex, 3);
  assert.equal(recovered.questionIndex, 1);
  assert.deepEqual(recovered.lockedSectionIds, ["reasoning", "general-awareness", "quantitative-aptitude"]);
  assert.deepEqual(recovered.answers, { "reasoning-q1": "c" });
  assert.deepEqual(recovered.visitedQuestionIds, ["reasoning-q1"]);
  assert.equal(recovered.sectionRemainingSeconds.reasoning, 900);
  assert.equal(recovered.sectionRemainingSeconds["english-comprehension"], 0);
  assert.equal(recovered.sectionTimeSpentSeconds.reasoning, 900);
  assert.equal(recovered.sectionTimeSpentSeconds["english-comprehension"], 0);
  assert.equal(parseTimedTestDraft(JSON.stringify({ ...tampered, testId: "another-paper" }), paper), null);
  assert.equal(parseTimedTestDraft("{bad-json", paper), null);
});

test("untimed drafts preserve zero clocks for timer=off custom sessions", () => {
  const paper = fixtureTest(true);
  const saved = {
    version: 1,
    testId: paper.id,
    answers: {},
    visitedQuestionIds: [],
    markedQuestionIds: [],
    sectionIndex: 0,
    questionIndex: 0,
    lockedSectionIds: [],
    sectionRemainingSeconds: {},
    sectionTimeSpentSeconds: {},
    startedAt: "2026-07-13T10:00:00.000Z",
    savedAt: "2026-07-13T10:01:00.000Z"
  };

  const recovered = parseTimedTestDraft(JSON.stringify(saved), paper);
  assert.ok(recovered);
  assert.deepEqual(recovered.sectionRemainingSeconds, {
    reasoning: 0,
    "general-awareness": 0,
    "quantitative-aptitude": 0,
    "english-comprehension": 0
  });
});

test("runner source includes confirmations, local recovery, non-color cues, and responsive focus styles", () => {
  const component = fs.readFileSync("components/TimedTestRunner.tsx", "utf8");
  const css = fs.readFileSync("components/TimedTestRunner.module.css", "utf8");

  assert.match(component, /role="alertdialog"/);
  assert.match(component, /beforeunload/);
  assert.match(component, /Recovered your attempt/);
  assert.match(component, /Answers and explanations stay hidden until you submit the test/);
  assert.match(component, /Mark for review & next/);
  assert.match(component, /Clear response/);
  assert.match(component, /Save & next/);
  assert.match(component, /window\.localStorage\.removeItem\(draftKey\)/);
  assert.match(css, /\.status-answered-marked/);
  assert.match(css, /\.runner button:focus-visible/);
  assert.match(css, /@media \(max-width: 700px\)/);
});
