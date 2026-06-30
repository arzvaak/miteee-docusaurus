import assert from "node:assert/strict";
import test from "node:test";
import { selectQuickSearchResults } from "../lib/quick-search";
import type { NotePreview } from "../lib/content";

function preview(overrides: Partial<NotePreview>): NotePreview {
  return {
    slug: "note",
    title: "Note",
    label: "Note",
    aliases: [],
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II",
    week: null,
    excerpt: "Imported study note",
    headings: [],
    runnable: false,
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 0,
      questionBlocks: 0
    },
    ...overrides
  };
}

test("quick search ranks exact title matches above incidental excerpt matches", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "torque", label: "Torque Slip Formula", title: "Torque Slip Formula", excerpt: "Core derivation page" }),
      preview({ slug: "mixed", label: "Weekly Revision", title: "Weekly Revision", excerpt: "Mentions torque slip formula in passing" })
    ],
    "torque slip"
  );

  assert.equal(results[0]?.preview.slug, "torque");
  assert.deepEqual(results[0]?.matchedFields.slice(0, 2), ["title", "label"]);
});

test("quick search accepts course codes and aliases as first-class matches", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "mi", label: "Bridges", courseCode: "SEM6-MI", courseName: "Measurements & Instrumentation", aliases: ["sem6/mi/tutorial-1.md"] }),
      preview({ slug: "em2", label: "Bridges", courseCode: "SEM5-EM2", courseName: "Electrical Machines II" })
    ],
    "sem6 mi"
  );

  assert.equal(results[0]?.preview.slug, "mi");
  assert.ok(results[0]?.matchedFields.includes("course"));
  assert.ok(results[0]?.matchedFields.includes("alias"));
});

test("quick search expands learner shorthand for EM2 and UPSC discovery", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "machines", label: "Transformer Tests", courseCode: "SEM5-EM2", courseName: "Electrical Machines II" }),
      preview({ slug: "polity", label: "Federalism", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT" }),
      preview({ slug: "measurements", label: "Bridge Measurements", courseCode: "SEM6-MI", courseName: "Measurements & Instrumentation" })
    ],
    "em2",
    2
  );

  assert.equal(results[0]?.preview.slug, "machines");
  assert.equal(results[0]?.groupLabel, "Electrical Machines II");
  assert.equal(results[0]?.signalLabel, "Course code match");

  const upscResults = selectQuickSearchResults(
    [
      preview({ slug: "machines", label: "Transformer Tests", courseCode: "SEM5-EM2", courseName: "Electrical Machines II" }),
      preview({ slug: "polity", label: "Federalism", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT" })
    ],
    "upsc",
    2
  );

  assert.equal(upscResults[0]?.preview.slug, "polity");
  assert.equal(upscResults[0]?.groupLabel, "UPSC CSE");
});

test("quick search maps practice and answer framework intent to useful study material", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "overview", label: "Course Overview", title: "Course Overview", excerpt: "Passive overview" }),
      preview({ slug: "framework", label: "Mains Answer Writing Framework", title: "Mains Answer Writing Framework", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", headings: ["Federalism answer structure"], stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 2 } }),
      preview({ slug: "pyq-bank", label: "EM2 PYQ Answer Bank", title: "PYQ Answer Bank", excerpt: "Practice previous year questions", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 12, details: 0, questionBlocks: 18 } })
    ],
    "answer framework",
    3
  );

  assert.equal(results[0]?.preview.slug, "framework");
  assert.equal(results[0]?.signalLabel, "Answer framework");

  const practiceResults = selectQuickSearchResults(
    [
      preview({ slug: "overview", label: "Course Overview", title: "Course Overview", excerpt: "Passive overview" }),
      preview({ slug: "pyq-bank", label: "EM2 PYQ Answer Bank", title: "PYQ Answer Bank", excerpt: "Previous year question bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 12, details: 0, questionBlocks: 18 } })
    ],
    "practice",
    2
  );

  assert.equal(practiceResults[0]?.preview.slug, "pyq-bank");
  assert.equal(practiceResults[0]?.signalLabel, "Practice set");
});

test("quick search searches headings for formula and method terms", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "starter", label: "Induction Motor Starters", headings: ["No-load test", "Blocked rotor method"] }),
      preview({ slug: "generic", label: "Induction Motor", excerpt: "General theory" })
    ],
    "blocked rotor"
  );

  assert.equal(results[0]?.preview.slug, "starter");
  assert.ok(results[0]?.matchedFields.includes("heading"));
});

test("quick search requires every query token and respects result limits", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "right", label: "Synchronous Motor Power Factor", courseCode: "SEM5-EM2" }),
      preview({ slug: "partial", label: "Synchronous Motor", courseCode: "SEM6-MI" }),
      preview({ slug: "wrong", label: "Power Factor", courseCode: "SEM6-MI" })
    ],
    "sem5 power factor",
    1
  );

  assert.deepEqual(results.map((result) => result.preview.slug), ["right"]);
});

test("quick search blank suggestions prioritize useful study launch points", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "overview", label: "Course Overview", title: "Course Overview", excerpt: "Passive overview" }),
      preview({ slug: "formula-bank", label: "Formula Bank", title: "Formula Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 22, details: 0, questionBlocks: 0 } }),
      preview({ slug: "upsc-prelims", label: "Federalism", title: "Federalism", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 6 } }),
      preview({ slug: "question-bank", label: "Question Bank", title: "Question Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 12 } })
    ],
    "",
    3
  );

  assert.deepEqual(results.map((result) => result.preview.slug), ["upsc-prelims", "question-bank", "formula-bank"]);
  assert.deepEqual(results.map((result) => result.matchedFields), [[], [], []]);
});

test("quick search blank suggestions keep the launcher balanced across courses", () => {
  const results = selectQuickSearchResults(
    [
      preview({ slug: "em2-a", label: "EM2 PYQ A", courseCode: "SEM5-EM2", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 20, details: 0, questionBlocks: 20 } }),
      preview({ slug: "em2-b", label: "EM2 PYQ B", courseCode: "SEM5-EM2", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 18, details: 0, questionBlocks: 18 } }),
      preview({ slug: "em2-c", label: "EM2 PYQ C", courseCode: "SEM5-EM2", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 16, details: 0, questionBlocks: 16 } }),
      preview({ slug: "mi", label: "MI Tutorial", courseCode: "SEM6-MI", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 8, details: 0, questionBlocks: 8 } }),
      preview({ slug: "upsc", label: "Federalism", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 4 } })
    ],
    "",
    4
  );

  assert.deepEqual(results.map((result) => result.preview.slug), ["upsc", "em2-a", "mi", "em2-b"]);
});
