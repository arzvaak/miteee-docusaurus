import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultStudyPlanPreferences, setStudyPlanEnabled, setStudyPlanSubjects } from "../lib/study-plan-preferences";
import { buildStudySettingsBackup, restoreStudySettingsBackup } from "../lib/study-settings-backup";
import { createEmptyStudySpacePreferences, setStudySpaceStatus } from "../lib/study-space-preferences";

test("study settings backup round-trips subject status and optional plan", () => {
  const studySpace = setStudySpaceStatus(
    setStudySpaceStatus(createEmptyStudySpacePreferences(), "SEM5-DSP", "active"),
    "SEM5-EM2",
    "completed"
  );
  const studyPlan = setStudyPlanSubjects(setStudyPlanEnabled(createDefaultStudyPlanPreferences(), true), ["SEM5-DSP"]);
  const restored = restoreStudySettingsBackup(buildStudySettingsBackup(studySpace, studyPlan, "2026-07-13T12:00:00.000Z"));

  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  assert.deepEqual(restored.backup.studySpace, studySpace);
  assert.deepEqual(restored.backup.studyPlan, studyPlan);
  assert.equal(restored.backup.exportedAt, "2026-07-13T12:00:00.000Z");
});

test("study settings backup rejects unrelated and malformed JSON", () => {
  assert.deepEqual(restoreStudySettingsBackup("{bad"), { ok: false, error: "The backup is not valid JSON." });
  assert.deepEqual(restoreStudySettingsBackup(JSON.stringify({ kind: "other", version: 1 })), {
    ok: false,
    error: "This is not a MITEEE study settings backup."
  });
});
