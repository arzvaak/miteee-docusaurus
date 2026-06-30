import assert from "node:assert/strict";
import test from "node:test";
import { buildCoursePracticeDrills, buildCoursePracticeStudyTask } from "../lib/course-practice";
import type { Course, NoteIndexItem } from "../scripts/build-content-data";

type IndexedNote = Omit<NoteIndexItem, "content">;

const course: Course = {
  code: "SEM5-EM2",
  folder: "sem5/em2",
  name: "Electrical Machines II",
  level: "Semester 5",
  category: "Semester 5",
  noteCount: 3,
  runnableNoteCount: 0,
  questionCount: 14,
  syllabusSummary: [],
  quizSets: []
};

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
    headings: [
      { level: 2, text: "Questions" },
      { level: 2, text: "Known values" },
      { level: 2, text: "Solution outline" }
    ],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 4,
      details: 12,
      questionBlocks: 14
    },
    ...overrides
  };
}

test("buildCoursePracticeDrills creates logged practice prompts for technical course notes", () => {
  const drills = buildCoursePracticeDrills(course, [
    note({}),
    note({
      slug: "sem5-em2-synchronous-motors",
      title: "Synchronous Motors",
      sidebarLabel: "Synchronous Motors",
      sidebarPosition: 2,
      stats: {
        codeBlocks: 0,
        mermaidBlocks: 1,
        mathBlocks: 8,
        details: 2,
        questionBlocks: 0
      }
    }),
    note({
      slug: "upsc-polity",
      title: "Parliament",
      courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
      courseName: "UPSC Political Science NCERT"
    })
  ], 2);

  assert.equal(drills.length, 2);
  assert.equal(drills[0]?.slug, "sem5-em2-pyq-answer-bank");
  assert.equal(drills[0]?.method, "retrieval");
  assert.equal(drills[0]?.minutes, 25);
  assert.match(drills[0]?.prompt ?? "", /answer one question section/i);
  assert.match(drills[1]?.prompt ?? "", /formula|derivation/i);
  assert.equal(drills.some((drill) => drill.slug === "upsc-polity"), false);
});

test("buildCoursePracticeStudyTask keeps a stable learner-memory task id", () => {
  const drill = buildCoursePracticeDrills(course, [note({})], 1)[0];
  assert.ok(drill);

  const task = buildCoursePracticeStudyTask(drill);

  assert.equal(task.id, "course-practice:SEM5-EM2:sem5-em2-pyq-answer-bank");
  assert.equal(task.title, "Practice: PYQ Answer Bank");
  assert.equal(task.method, "retrieval");
  assert.equal(task.minutes, 25);
  assert.deepEqual(task.note, {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II"
  });
});
