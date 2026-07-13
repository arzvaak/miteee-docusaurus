import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyStudySpacePreferences,
  getStudySpaceStatus,
  parseStudySpacePreferences,
  serializeStudySpacePreferences,
  setStudySpaceStatus,
  studySpacePreferencesStorageKey,
  studySpacePreferencesVersion
} from "../lib/study-space-preferences";

test("study-space preferences use an explicit versioned device-local schema", () => {
  const preferences = createEmptyStudySpacePreferences();

  assert.equal(studySpacePreferencesVersion, 1);
  assert.equal(studySpacePreferencesStorageKey, "miteee-study-space-preferences");
  assert.deepEqual(preferences, { version: 1, statuses: {} });
  assert.equal(getStudySpaceStatus(preferences, "SSC-CGL"), "available");
});

test("study-space preferences retain active and completed states while Available remains the default", () => {
  const active = setStudySpaceStatus(createEmptyStudySpacePreferences(), "ssc-cgl", "active");
  const completed = setStudySpaceStatus(active, "SEM5-DSP", "completed");

  assert.equal(getStudySpaceStatus(completed, "SSC-CGL"), "active");
  assert.equal(getStudySpaceStatus(completed, "sem5-dsp"), "completed");

  const availableAgain = setStudySpaceStatus(completed, "SSC-CGL", "available");
  assert.equal(getStudySpaceStatus(availableAgain, "SSC-CGL"), "available");
  assert.equal("SSC-CGL" in availableAgain.statuses, false);
});

test("study-space preference parsing is defensive and normalizes course codes", () => {
  const parsed = parseStudySpacePreferences(JSON.stringify({
    version: 1,
    statuses: {
      " ssc-cgl ": "active",
      "sem5-dsp": "completed",
      "SEM5-EM2": "available",
      "BAD": "pinned"
    }
  }));

  assert.deepEqual(parsed.statuses, {
    "SSC-CGL": "active",
    "SEM5-DSP": "completed"
  });
  assert.deepEqual(parseStudySpacePreferences("not-json"), createEmptyStudySpacePreferences());
  assert.deepEqual(parseStudySpacePreferences('{"version":2,"statuses":{"SSC-CGL":"active"}}'), createEmptyStudySpacePreferences());
  assert.deepEqual(parseStudySpacePreferences(serializeStudySpacePreferences(parsed)), parsed);
});
