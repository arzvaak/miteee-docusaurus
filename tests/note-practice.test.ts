import assert from "node:assert/strict";
import test from "node:test";
import { completeNotePractice, buildNotePractice, buildNotePracticeStudyTask } from "../lib/note-practice";
import { createEmptyLearnerMemory } from "../lib/learner-memory";
import type { NoteIndexItem } from "../scripts/build-content-data";

type IndexedNote = Omit<NoteIndexItem, "content">;

function note(overrides: Partial<IndexedNote>): IndexedNote {
  return {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    sidebarLabel: "PYQ Answer Bank",
    sidebarPosition: 1,
    description: "",
    tags: [],
    runnable: false,
    courseCode: "SEM5-EM2",
    courseFolder: "sem5/em2",
    courseName: "Electrical Machines II",
    level: "Semester 5",
    week: null,
    relativePath: "sem5/em2/pyq-answer-bank.md",
    sourcePath: "docs/sem5/em2/pyq-answer-bank.md",
    excerpt: "Repeated exam problems on induction motors and alternators.",
    headings: [{ level: 2, text: "Questions" }],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 3090,
      details: 120,
      questionBlocks: 141
    },
    ...overrides
  };
}

test("buildNotePractice turns a question-heavy note into a focused retrieval session", () => {
  const practice = buildNotePractice(note({}));

  assert.equal(practice.focus, "Question drill");
  assert.equal(practice.method, "retrieval");
  assert.equal(practice.minutes, 30);
  assert.match(practice.prompt, /solve one question section/i);
  assert.match(practice.evidence, /141 question sections/);
});

test("buildNotePractice treats extracted quiz items as note practice", () => {
  const practice = buildNotePractice(note({
    slug: "ssc-cgl-probability",
    title: "Probability",
    sidebarLabel: "Probability",
    courseCode: "SSC-CGL",
    courseFolder: "ssc-cgl",
    courseName: "SSC CGL Tier-I 200/200 System",
    level: "SSC CGL Tier-I",
    relativePath: "ssc-cgl/quant/probability.md",
    sourcePath: "docs/ssc-cgl/quant/probability.md",
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 1,
      mathBlocks: 3,
      details: 0,
      questionBlocks: 0,
      quizBlocks: 35
    },
    quizSets: [
      { testName: "Solved Examples", count: 25, typeCounts: { mcq: 25 }, imageCount: 0 },
      { testName: "200/200 Drill", count: 10, typeCounts: { prompt: 10 }, imageCount: 0 }
    ]
  }));

  assert.equal(practice.focus, "Question drill");
  assert.equal(practice.method, "retrieval");
  assert.equal(practice.minutes, 30);
  assert.match(practice.prompt, /extracted quiz or 200\/200 drill/i);
  assert.match(practice.evidence, /35 quiz items/);
});

test("buildNotePractice turns a math-heavy note without questions into derivation practice", () => {
  const practice = buildNotePractice(note({
    slug: "sem5-em2-synchronous-motors",
    title: "Synchronous Motors",
    sidebarLabel: "Synchronous Motors",
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 32,
      details: 1,
      questionBlocks: 0
    }
  }));

  assert.equal(practice.focus, "Formula rebuild");
  assert.equal(practice.method, "self-explanation");
  assert.equal(practice.minutes, 20);
  assert.match(practice.prompt, /rebuild one formula/i);
});

test("buildNotePractice turns UPSC expansion sections into direct drill jumps", () => {
  const practice = buildNotePractice(note({
    slug: "upsc-polity-plato",
    title: "Plato",
    sidebarLabel: "Plato",
    courseCode: "UPSC-PSIR",
    courseFolder: "upsc-cse/political-science",
    courseName: "UPSC Political Science",
    level: "Civil Services",
    relativePath: "upsc-cse/political-science/plato.md",
    sourcePath: "docs/upsc-cse/political-science/plato.md",
    headings: [
      { level: 2, text: "Context" },
      { level: 2, text: "UPSC Expansion Drills" },
      { level: 3, text: "Mains Answer Scaffold" },
      { level: 3, text: "Prelims Trap Check" },
      { level: 3, text: "Key Term Anchors" },
      { level: 3, text: "Comparison Prompt" },
      { level: 3, text: "Weakness Repair Drill" }
    ],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 0,
      questionBlocks: 0
    }
  }));

  assert.equal(practice.focus, "UPSC expansion drill");
  assert.equal(practice.method, "retrieval");
  assert.match(practice.prompt, /Mains Answer Scaffold/);
  assert.deepEqual(practice.expansionSections, [
    { level: 2, text: "UPSC Expansion Drills", id: "upsc-expansion-drills" },
    { level: 3, text: "Mains Answer Scaffold", id: "mains-answer-scaffold" },
    { level: 3, text: "Prelims Trap Check", id: "prelims-trap-check" },
    { level: 3, text: "Key Term Anchors", id: "key-term-anchors" },
    { level: 3, text: "Comparison Prompt", id: "comparison-prompt" },
    { level: 3, text: "Weakness Repair Drill", id: "weakness-repair-drill" }
  ]);
  assert.match(practice.checklist.join(" "), /Jump to Mains Answer Scaffold/);
});

test("buildNotePracticeStudyTask keeps note-reader logging stable", () => {
  const practice = buildNotePractice(note({}));
  const task = buildNotePracticeStudyTask(practice);

  assert.equal(task.id, "note-practice:sem5-em2-pyq-answer-bank");
  assert.equal(task.title, "Note practice: PYQ Answer Bank");
  assert.equal(task.method, "retrieval");
  assert.equal(task.minutes, 30);
  assert.deepEqual(task.note, {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II"
  });
});

test("completeNotePractice records study activity and marks the source note read", () => {
  const completedAt = "2026-06-24T06:00:00.000Z";
  const practice = buildNotePractice(note({}));
  const memory = completeNotePractice(createEmptyLearnerMemory(), practice, completedAt);

  assert.equal(memory.studyActivity[0]?.taskId, "note-practice:sem5-em2-pyq-answer-bank");
  assert.equal(memory.studyActivity[0]?.minutes, 30);
  assert.equal(memory.notes["sem5-em2-pyq-answer-bank"]?.readCount, 1);
  assert.equal(memory.notes["sem5-em2-pyq-answer-bank"]?.lastReadAt, completedAt);
  assert.equal(memory.revisionCards["note:sem5-em2-pyq-answer-bank"]?.source, "note");
});
