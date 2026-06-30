import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildRevisionAttemptRepairBrief, buildRevisionRepairSprint } from "../lib/revision-repair";
import { addMistake, createEmptyLearnerMemory, recordNoteRead, reviewRevisionCardWithAttempt, type RevisionAttempt } from "../lib/learner-memory";

const baseAttempt: RevisionAttempt = {
  id: "attempt:1",
  cardId: "mistake:slip",
  source: "mistake",
  slug: "sem5-em2-pyq-answer-bank",
  title: "PYQ Answer Bank",
  courseCode: "SEM5-EM2",
  courseName: "Electrical Machines II",
  prompt: "Forgot slip conversion. Correct rule: Convert percentage slip to per-unit before substitution. Catch question: What must happen before torque substitution?",
  attempt: "Use the percent value directly.",
  grade: "hard",
  reviewedAt: "2026-06-24T06:00:00.000Z"
};

const now = "2026-06-24T06:00:00.000Z";
const note = {
  slug: "sem5-em2-pyq-answer-bank",
  title: "PYQ Answer Bank",
  courseCode: "SEM5-EM2",
  courseName: "Electrical Machines II"
};

test("buildRevisionAttemptRepairBrief turns weak attempts into correction work", () => {
  const brief = buildRevisionAttemptRepairBrief(baseAttempt);

  assert.equal(brief.tone, "repair");
  assert.equal(brief.label, "Repair");
  assert.match(brief.action, /Convert percentage slip to per-unit/);
  assert.match(brief.check, /What must happen before torque substitution/);
});

test("buildRevisionAttemptRepairBrief turns strong attempts into transfer practice", () => {
  const brief = buildRevisionAttemptRepairBrief({
    ...baseAttempt,
    attempt: "Convert percentage slip to per-unit before using the formula.",
    grade: "easy"
  });

  assert.equal(brief.tone, "extend");
  assert.equal(brief.label, "Extend");
  assert.match(brief.action, /new question/i);
  assert.match(brief.check, /without reopening/i);
});

test("buildRevisionRepairSprint leads with the due repair card and explains grading", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, "2026-06-23T06:00:00.000Z");
  const memory = addMistake(withRead, note, {
    id: "slip",
    createdAt: "2026-06-24T05:00:00.000Z",
    mistake: "Used percentage slip directly in the torque formula.",
    correction: "Convert percentage slip to per-unit before substitution.",
    catchQuestion: "What conversion must happen before torque substitution?"
  });

  const sprint = buildRevisionRepairSprint(memory, now);

  assert.equal(sprint.kind, "due-card");
  assert.equal(sprint.title, "Repair now: PYQ Answer Bank");
  assert.equal(sprint.href, "/notes/sem5-em2-pyq-answer-bank");
  assert.match(sprint.body, /Used percentage slip directly/);
  assert.match(sprint.focus, /Electrical Machines II/);
  assert.deepEqual(sprint.plan, [
    "Write the recall attempt before opening the source.",
    "Check the corrected rule or note only after the attempt is written.",
    "Grade honestly: Again or Hard keeps it in repair; Good or Easy moves it forward."
  ]);
  assert.match(sprint.gradingHint, /Again = blank or wrong/);
});

test("buildRevisionRepairSprint falls back to weak attempts before generic starts", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, "2026-06-23T06:00:00.000Z");
  const reviewed = reviewRevisionCardWithAttempt(withRead, `note:${note.slug}`, "hard", "I used the percent value directly.", "2026-06-24T05:00:00.000Z");
  const withoutDueCards = { ...reviewed, revisionCards: {} };

  const sprint = buildRevisionRepairSprint(withoutDueCards, now);

  assert.equal(sprint.kind, "weak-attempt");
  assert.equal(sprint.title, "Repair weak attempt: PYQ Answer Bank");
  assert.equal(sprint.href, "/notes/sem5-em2-pyq-answer-bank");
  assert.match(sprint.plan[0] ?? "", /Compare the old attempt/);
  assert.match(sprint.plan[1] ?? "", /missing rule/);
  assert.match(sprint.gradingHint, /Do not upgrade/);
});

test("revision dashboard keeps the repair sprint and grade guide visible in source", () => {
  const dashboardSource = readFileSync(new URL("../components/RevisionDashboard.tsx", import.meta.url), "utf8");
  const cssSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(dashboardSource, /buildRevisionRepairSprint/);
  assert.match(dashboardSource, /aria-label="Repair sprint priority"/);
  assert.match(dashboardSource, /Again = repair · Hard = unstable · Good\/Easy = move forward/);
  assert.match(cssSource, /\.repair-sprint-card/);
  assert.match(cssSource, /\.repair-grade-hint/);
});
