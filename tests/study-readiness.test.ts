import assert from "node:assert/strict";
import test from "node:test";
import { buildStudyReadinessMap } from "../lib/study-readiness";
import type { Course } from "../scripts/build-content-data";

function course(overrides: Partial<Course>): Course {
  return {
    code: "SEM5-EM2",
    folder: "sem5/em2",
    name: "Electrical Machines II",
    level: "Semester 5",
    category: "Semester 5",
    noteCount: 30,
    runnableNoteCount: 6,
    questionCount: 461,
    practicePromptCount: 0,
    syllabusSummary: [],
    quizSets: [],
    ...overrides
  };
}

test("study readiness flags UPSC breadth without active answer practice", () => {
  const readiness = buildStudyReadinessMap([
    course({
      code: "UPSC-CSE-POLITICAL-SCIENCE",
      folder: "upsc-cse/political-science",
      name: "UPSC Political Science NCERT",
      level: "UPSC CSE",
      category: "Civil services",
      noteCount: 58,
      runnableNoteCount: 0,
      questionCount: 0
    }),
    course({})
  ]);

  const upsc = readiness.lanes.find((lane) => lane.code === "UPSC-CSE-POLITICAL-SCIENCE");

  assert.equal(readiness.summary.civilServicesNotes, 58);
  assert.equal(upsc?.track, "civil-services");
  assert.equal(upsc?.status, "answer-practice-debt");
  assert.match(upsc?.nextAction ?? "", /Prelims and Mains/i);
  assert.equal(readiness.priority.code, "UPSC-CSE-POLITICAL-SCIENCE");
});

test("study readiness treats generated UPSC recall prompts as active practice", () => {
  const readiness = buildStudyReadinessMap([
    course({
      code: "UPSC-CSE-POLITICAL-SCIENCE",
      folder: "upsc-cse/political-science",
      name: "UPSC Political Science NCERT",
      level: "UPSC CSE",
      category: "Civil services",
      noteCount: 58,
      runnableNoteCount: 0,
      questionCount: 0,
      practicePromptCount: 116
    }),
    course({})
  ]);

  const upsc = readiness.lanes.find((lane) => lane.code === "UPSC-CSE-POLITICAL-SCIENCE");

  assert.equal(upsc?.track, "civil-services");
  assert.equal(upsc?.status, "practice-anchor");
  assert.equal(upsc?.practicePromptCount, 116);
  assert.match(upsc?.summary ?? "", /116 answer-practice prompts/i);
  assert.equal(readiness.summary.practiceDebtCourses, 0);
});

test("study readiness identifies question-dense technical anchors", () => {
  const readiness = buildStudyReadinessMap([
    course({}),
    course({
      code: "SEM6-MI",
      folder: "sem6/mi",
      name: "Measurements & Instrumentation",
      level: "Semester 6",
      category: "Semester 6",
      noteCount: 11,
      runnableNoteCount: 2,
      questionCount: 85
    })
  ]);

  const em2 = readiness.lanes.find((lane) => lane.code === "SEM5-EM2");

  assert.equal(readiness.summary.technicalQuestions, 546);
  assert.equal(em2?.track, "technical-core");
  assert.equal(em2?.status, "practice-anchor");
  assert.ok((em2?.score ?? 0) >= 80);
  assert.match(em2?.nextAction ?? "", /timed/i);
});
