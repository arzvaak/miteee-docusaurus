import assert from "node:assert/strict";
import test from "node:test";
import {
  createDefaultStudyPlanPreferences,
  parseStudyPlanPreferences,
  reconcileStudyPlanSubjects,
  serializeStudyPlanPreferences,
  setStudyPlanDailyMinutes,
  setStudyPlanEnabled,
  setStudyPlanSubjects,
  toggleStudyPlanDay,
  type StudyPlanPreferences
} from "../lib/study-plan-preferences";

test("study plans are disabled by default and start with a useful weekday rhythm", () => {
  assert.deepEqual(createDefaultStudyPlanPreferences(), {
    version: 1,
    enabled: false,
    subjectCodes: [],
    dailyMinutes: 45,
    studyDays: ["mon", "tue", "wed", "thu", "fri"]
  });
});

test("study plan storage normalizes subjects, minutes, and days", () => {
  const parsed = parseStudyPlanPreferences(JSON.stringify({
    version: 1,
    enabled: true,
    subjectCodes: [" sem5-dsp ", "SEM5-DSP", "ssc-cgl", 12],
    dailyMinutes: 900,
    studyDays: ["sun", "sun", "bad"]
  }));

  assert.deepEqual(parsed, {
    version: 1,
    enabled: true,
    subjectCodes: ["SEM5-DSP", "SSC-CGL"],
    dailyMinutes: 300,
    studyDays: ["sun"]
  });
  assert.deepEqual(parseStudyPlanPreferences(serializeStudyPlanPreferences(parsed)), parsed);
});

test("plan helpers enforce minute bounds and at least one study day", () => {
  const initial = setStudyPlanEnabled(createDefaultStudyPlanPreferences(), true);
  assert.equal(setStudyPlanDailyMinutes(initial, 2).dailyMinutes, 10);
  assert.equal(setStudyPlanDailyMinutes(initial, 72.7).dailyMinutes, 73);

  const sundayOnly: StudyPlanPreferences = { ...initial, studyDays: ["sun"] };
  assert.deepEqual(toggleStudyPlanDay(sundayOnly, "sun").studyDays, ["sun"]);
  assert.deepEqual(toggleStudyPlanDay(sundayOnly, "mon").studyDays, ["mon", "sun"]);
});

test("plan subjects are pruned to the active subject set", () => {
  const plan = setStudyPlanSubjects(createDefaultStudyPlanPreferences(), ["SEM5-DSP", "SEM5-EM2", "SSC-CGL"]);
  assert.deepEqual(reconcileStudyPlanSubjects(plan, ["sem5-em2", "ssc-cgl"]).subjectCodes, ["SEM5-EM2", "SSC-CGL"]);
});

test("malformed and future study plan payloads return safe defaults", () => {
  assert.deepEqual(parseStudyPlanPreferences("{bad"), createDefaultStudyPlanPreferences());
  assert.deepEqual(parseStudyPlanPreferences(JSON.stringify({ version: 2, enabled: true })), createDefaultStudyPlanPreferences());
});
