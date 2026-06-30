import assert from "node:assert/strict";
import test from "node:test";
import {
  buildChecklistProgressLabel,
  parseStudyTodayProgressState,
  parseStudyTodayProgress,
  serializeStudyTodayProgress,
  studyTodayDayKey,
  studyTodayProgressStorageKey
} from "../lib/study-today-progress";

test("study today progress keys are scoped to the calendar day", () => {
  assert.equal(studyTodayDayKey("2026-06-24T05:30:00.000Z"), "2026-06-24");
  assert.equal(studyTodayProgressStorageKey("2026-06-24"), "miteee-study-today-v2:2026-06-24");
  assert.notEqual(studyTodayProgressStorageKey("2026-06-24"), studyTodayProgressStorageKey("2026-06-25"));
});

test("study today progress only restores matching-day payloads", () => {
  const stored = serializeStudyTodayProgress("2026-06-24", ["retrieval-sprint", "spaced-review"]);

  assert.deepEqual(parseStudyTodayProgress(stored, "2026-06-24"), ["retrieval-sprint", "spaced-review"]);
  assert.deepEqual(parseStudyTodayProgress(stored, "2026-06-25"), []);
});

test("study today progress stores checklist item ids separately from completed tasks", () => {
  const stored = serializeStudyTodayProgress("2026-06-24", ["attempt-repair"], [
    "attempt-repair:checklist:0",
    "attempt-repair:checklist:0",
    "attempt-repair:checklist:2",
    ""
  ]);

  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-24"), {
    completedTaskIds: ["attempt-repair"],
    completedChecklistItemIds: ["attempt-repair:checklist:0", "attempt-repair:checklist:2"],
    repairDrafts: {}
  });
  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-25"), {
    completedTaskIds: [],
    completedChecklistItemIds: [],
    repairDrafts: {}
  });
  assert.deepEqual(parseStudyTodayProgress(stored, "2026-06-24"), ["attempt-repair"]);
});

test("study today progress persists repair drafts for the current day", () => {
  const stored = serializeStudyTodayProgress("2026-06-24", [], [], {
    "attempt-repair": {
      missed: "Used the percent value directly.",
      correction: "Convert percent values before substituting.",
      catchQuestion: "What conversion happens first?"
    },
    "": {
      missed: "Ignore invalid draft.",
      correction: "Ignore invalid draft.",
      catchQuestion: "Ignore invalid draft."
    }
  });

  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-24"), {
    completedTaskIds: [],
    completedChecklistItemIds: [],
    repairDrafts: {
      "attempt-repair": {
        missed: "Used the percent value directly.",
        correction: "Convert percent values before substituting.",
        catchQuestion: "What conversion happens first?"
      }
    }
  });
  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-25"), {
    completedTaskIds: [],
    completedChecklistItemIds: [],
    repairDrafts: {}
  });
});

test("buildChecklistProgressLabel summarizes only the target task checklist", () => {
  assert.equal(buildChecklistProgressLabel("attempt-repair", 3, [
    "attempt-repair:checklist:0",
    "attempt-repair:checklist:0",
    "attempt-repair:checklist:2",
    "spaced-review:checklist:1",
    "attempt-repair:checklist:9"
  ]), "2/3 repair steps");
  assert.equal(buildChecklistProgressLabel("attempt-repair", 0, ["attempt-repair:checklist:0"]), null);
});

test("study today progress rejects legacy arrays and normalizes duplicate ids", () => {
  assert.deepEqual(parseStudyTodayProgress(JSON.stringify(["retrieval-sprint"]), "2026-06-24"), []);

  const stored = serializeStudyTodayProgress("2026-06-24", ["retrieval-sprint", "retrieval-sprint", "", "spacing"]);
  assert.deepEqual(parseStudyTodayProgress(stored, "2026-06-24"), ["retrieval-sprint", "spacing"]);
  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-24").completedChecklistItemIds, []);
  assert.deepEqual(parseStudyTodayProgressState(stored, "2026-06-24").repairDrafts, {});
});

test("study today progress treats malformed storage as empty", () => {
  assert.deepEqual(parseStudyTodayProgress(null, "2026-06-24"), []);
  assert.deepEqual(parseStudyTodayProgress("{bad json", "2026-06-24"), []);
  assert.deepEqual(parseStudyTodayProgress(JSON.stringify({ version: 1, dayKey: "2026-06-24" }), "2026-06-24"), []);
});
