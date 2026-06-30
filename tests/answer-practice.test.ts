import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnswerPracticePrompt,
  buildAnswerPracticePrompts,
  buildAnswerPracticeRepairInput,
  filterAnswerPracticePrompts,
  getAnswerPracticeLanes,
  selectAnswerPracticePrompt,
  summarizeAnswerPracticeWeakness
} from "../lib/answer-practice";
import type { NoteIndexItem } from "../scripts/build-content-data";

type IndexedNote = Omit<NoteIndexItem, "content">;

function note(overrides: Partial<IndexedNote>): IndexedNote {
  return {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    sidebarLabel: "PYQ Answer Bank",
    sidebarPosition: 1,
    description: "Repeated exam problems.",
    tags: [],
    runnable: false,
    courseCode: "SEM5-EM2",
    courseFolder: "sem5/em2",
    courseName: "Electrical Machines II",
    level: "Semester 5",
    week: null,
    relativePath: "sem5/em2/pyq-answer-bank.md",
    sourcePath: "docs/sem5/em2/pyq-answer-bank.md",
    excerpt: "Questions on induction motors, alternators, and transformers.",
    headings: [{ level: 2, text: "Question Bank" }, { level: 3, text: "Induction Motor Problems" }],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 12,
      details: 4,
      questionBlocks: 24,
      practicePrompts: 0
    },
    ...overrides
  };
}

test("buildAnswerPracticePrompt prefers exam-answer prompts for question-heavy notes", () => {
  const prompt = buildAnswerPracticePrompt(note({}));

  assert.equal(prompt.focus, "Exam answer");
  assert.equal(prompt.id, "answer-practice:sem5-em2-pyq-answer-bank");
  assert.match(prompt.prompt, /exam-style answer/i);
  assert.match(prompt.evidence, /24 question sections/);
  assert.match(prompt.sourceContext, /Electrical Machines II/);
  assert.match(prompt.sourceContext, /Induction Motor Problems/);
});

test("buildAnswerPracticePrompt frames UPSC answer writing from indexed headings and excerpt", () => {
  const prompt = buildAnswerPracticePrompt(note({
    slug: "upsc-polity-federalism",
    title: "Federalism",
    sidebarLabel: "Federalism",
    courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
    courseFolder: "upsc-cse/political-science",
    courseName: "UPSC Political Science NCERT",
    description: "Federalism revision for UPSC answer writing.",
    excerpt: "Mains scaffold: define federalism, add constitutional basis, contrast cooperation and conflict. Prelims trap: do not confuse Union List with Concurrent List. Weakness repair: add one current-affairs example before the conclusion.",
    headings: [
      { level: 2, text: "Mains scaffold" },
      { level: 3, text: "Prelims trap: Union List versus Concurrent List" },
      { level: 3, text: "Weakness repair: add a current-affairs example" }
    ],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 1,
      questionBlocks: 0,
      practicePrompts: 3
    }
  }));

  assert.equal(prompt.lane, "UPSC answer writing");
  assert.equal(prompt.focus, "Exam answer");
  assert.match(prompt.prompt, /UPSC Mains/i);
  assert.match(prompt.framing, /Use the Mains scaffold section as the answer structure/);
  assert.match(prompt.framing, /Prelims trap: Union List versus Concurrent List/);
  assert.match(prompt.framing, /Weakness repair: add a current-affairs example/);
  assert.match(prompt.sourceContext, /Mains scaffold/);
});

test("buildAnswerPracticePrompt falls back to derivation practice for math-heavy notes", () => {
  const prompt = buildAnswerPracticePrompt(note({
    slug: "sem5-em2-synchronous-machine",
    sidebarLabel: "Synchronous Machine",
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 9,
      details: 0,
      questionBlocks: 0,
      practicePrompts: 0
    }
  }));

  assert.equal(prompt.focus, "Derivation");
  assert.match(prompt.prompt, /rebuild one derivation/i);
  assert.match(prompt.evidence, /9 math blocks/);
});

test("buildAnswerPracticePrompts ranks practice-ready notes ahead of plain context notes", () => {
  const prompts = buildAnswerPracticePrompts([
    note({ slug: "plain", sidebarLabel: "Plain Concept", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 0, practicePrompts: 0 } }),
    note({ slug: "question-bank", sidebarLabel: "Question Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 1, questionBlocks: 6, practicePrompts: 0 } }),
    note({ slug: "practice-set", sidebarLabel: "Practice Set", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 1, practicePrompts: 5 } })
  ]);

  assert.equal(prompts[0]?.slug, "practice-set");
  assert.equal(prompts[1]?.slug, "question-bank");
  assert.equal(prompts[2]?.slug, "plain");
});

test("buildAnswerPracticePrompts keeps the queue balanced across courses", () => {
  const prompts = buildAnswerPracticePrompts([
    note({ slug: "em2-bank", courseCode: "SEM5-EM2", courseName: "Electrical Machines II", sidebarLabel: "EM2 Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 400, details: 1, questionBlocks: 100, practicePrompts: 0 } }),
    note({ slug: "em2-more", courseCode: "SEM5-EM2", courseName: "Electrical Machines II", sidebarLabel: "EM2 More", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 320, details: 1, questionBlocks: 80, practicePrompts: 0 } }),
    note({ slug: "upsc-federalism", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", sidebarLabel: "Federalism", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 0, practicePrompts: 5 } }),
    note({ slug: "dsp-z", courseCode: "SEM5-DSP", courseName: "Digital Signal Processing", sidebarLabel: "Z Transform", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 40, details: 0, questionBlocks: 0, practicePrompts: 0 } })
  ], 3);

  assert.deepEqual(prompts.map((prompt) => prompt.courseCode), [
    "SEM5-EM2",
    "SEM5-DSP",
    "UPSC-CSE-POLITICAL-SCIENCE"
  ]);
});

test("buildAnswerPracticePrompts gives UPSC a first-class slot before secondary same-course prompts", () => {
  const prompts = buildAnswerPracticePrompts([
    note({ slug: "em2-bank", courseCode: "SEM5-EM2", courseName: "Electrical Machines II", sidebarLabel: "EM2 Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 400, details: 1, questionBlocks: 100, practicePrompts: 0 } }),
    note({ slug: "em2-more", courseCode: "SEM5-EM2", courseName: "Electrical Machines II", sidebarLabel: "EM2 More", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 320, details: 1, questionBlocks: 80, practicePrompts: 0 } }),
    note({ slug: "upsc-polity", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", courseFolder: "upsc-cse/political-science", sidebarLabel: "Federalism", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 0, practicePrompts: 2 } })
  ], 3);

  assert.deepEqual(prompts.map((prompt) => prompt.slug), ["em2-bank", "upsc-polity", "em2-more"]);
});

test("filterAnswerPracticePrompts narrows to UPSC lane without mutating the ranked queue", () => {
  const prompts = buildAnswerPracticePrompts([
    note({ slug: "em2-bank", courseCode: "SEM5-EM2", courseName: "Electrical Machines II", sidebarLabel: "EM2 Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 12, details: 1, questionBlocks: 4, practicePrompts: 0 } }),
    note({ slug: "upsc-polity", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC Political Science NCERT", courseFolder: "upsc-cse/political-science", sidebarLabel: "Federalism", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 0, practicePrompts: 2 } })
  ]);

  assert.deepEqual(getAnswerPracticeLanes(prompts), ["All practice", "UPSC answer writing", "Exam practice"]);
  assert.deepEqual(filterAnswerPracticePrompts(prompts, "UPSC answer writing").map((prompt) => prompt.slug), ["upsc-polity"]);
  assert.deepEqual(prompts.map((prompt) => prompt.slug), ["em2-bank", "upsc-polity"]);
});

test("selectAnswerPracticePrompt accepts ids or slugs and defaults to the first prompt", () => {
  const prompts = buildAnswerPracticePrompts([
    note({ slug: "first", sidebarLabel: "First", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 3, practicePrompts: 0 } }),
    note({ slug: "second", sidebarLabel: "Second", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 8, details: 0, questionBlocks: 0, practicePrompts: 0 } })
  ]);

  assert.equal(selectAnswerPracticePrompt(prompts, "second").selected?.slug, "second");
  assert.equal(selectAnswerPracticePrompt(prompts, "answer-practice:second").selected?.slug, "second");
  assert.equal(selectAnswerPracticePrompt(prompts, "missing").selected?.slug, prompts[0]?.slug);
});

test("summarizeAnswerPracticeWeakness classifies stable weakness patterns from diagnosis text", () => {
  const diagnosis = {
    responseType: "diagnosis" as const,
    aiAvailable: false,
    model: null,
    provider: "local" as const,
    message: "Repair the missing method step.",
    bullets: [],
    diagnosis: {
      strengths: ["The attempt names the topic."],
      weaknesses: [
        "Weakness: the answer directly substitutes percent slip instead of converting it to per-unit slip.",
        "The final value is present but the procedure is not shown."
      ],
      nextDrill: "Answer the same prompt again and state the slip conversion first."
    }
  };

  assert.deepEqual(summarizeAnswerPracticeWeakness(diagnosis), {
    tag: "conversion-procedure-gap",
    category: "conversion/procedure gap",
    label: "Conversion/procedure gap"
  });
});

test("summarizeAnswerPracticeWeakness uses a deterministic fallback for thin diagnoses", () => {
  const diagnosis = {
    responseType: "diagnosis" as const,
    aiAvailable: false,
    model: null,
    provider: "local" as const,
    message: "Needs another attempt.",
    bullets: [],
    diagnosis: {
      strengths: ["Some relevant words are present."],
      weaknesses: [],
      nextDrill: "Try the same prompt again with fuller detail."
    }
  };

  assert.deepEqual(summarizeAnswerPracticeWeakness(diagnosis), {
    tag: "structure-gap",
    category: "structure gap",
    label: "Structure gap"
  });
});

test("buildAnswerPracticeRepairInput preserves prompt weakness drill and source for revision memory", () => {
  const prompt = buildAnswerPracticePrompt(note({}));
  const repair = buildAnswerPracticeRepairInput(prompt, {
    responseType: "diagnosis",
    aiAvailable: false,
    model: null,
    provider: "local",
    message: "Repair the missing method step.",
    bullets: [],
    diagnosis: {
      strengths: ["The attempt names the topic."],
      weaknesses: ["Weakness: the answer misses the slip conversion before substitution."],
      nextDrill: "Answer the same prompt again and state the slip conversion first."
    }
  }, "2026-06-25T08:00:00.000Z");

  assert.deepEqual(repair.note, {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II"
  });
  assert.equal(repair.mistake.id, "answer-practice:sem5-em2-pyq-answer-bank:2026-06-25T08:00:00.000Z");
  assert.match(repair.mistake.mistake, /Prompt: Write a compact exam-style answer/);
  assert.match(repair.mistake.mistake, /Weakness pattern: Conversion\/procedure gap \(conversion-procedure-gap\)/);
  assert.match(repair.mistake.mistake, /misses the slip conversion/);
  assert.match(repair.mistake.correction, /Repair from PYQ Answer Bank \(Electrical Machines II\)/);
  assert.match(repair.mistake.correction, /Pattern: Conversion\/procedure gap/);
  assert.match(repair.mistake.correction, /state the slip conversion first/);
  assert.equal(repair.mistake.catchQuestion, "Answer the same prompt again and state the slip conversion first.");
});
