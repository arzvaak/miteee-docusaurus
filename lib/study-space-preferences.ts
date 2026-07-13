export const studySpacePreferencesVersion = 1 as const;
export const studySpacePreferencesStorageKey = "miteee-study-space-preferences";
export const studySpacePreferencesChangeEvent = "miteee-study-space-preferences-change";

export type StudySpaceStatus = "available" | "active" | "completed";
export type StoredStudySpaceStatus = Exclude<StudySpaceStatus, "available">;

export type StudySpacePreferences = {
  version: typeof studySpacePreferencesVersion;
  statuses: Record<string, StoredStudySpaceStatus>;
};

export const studySpaceStatusOptions: ReadonlyArray<{ value: StudySpaceStatus; label: string }> = [
  { value: "available", label: "Available" },
  { value: "active", label: "Studying now" },
  { value: "completed", label: "Completed" }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeCourseCode(courseCode: string) {
  return courseCode.trim().toUpperCase();
}

export function createEmptyStudySpacePreferences(): StudySpacePreferences {
  return {
    version: studySpacePreferencesVersion,
    statuses: {}
  };
}

export function parseStudySpacePreferences(value: string | null | undefined): StudySpacePreferences {
  if (!value) return createEmptyStudySpacePreferences();

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed) || parsed.version !== studySpacePreferencesVersion || !isRecord(parsed.statuses)) {
      return createEmptyStudySpacePreferences();
    }

    const statuses: Record<string, StoredStudySpaceStatus> = {};
    for (const [rawCourseCode, rawStatus] of Object.entries(parsed.statuses)) {
      const courseCode = normalizeCourseCode(rawCourseCode);
      if (!courseCode || (rawStatus !== "active" && rawStatus !== "completed")) continue;
      statuses[courseCode] = rawStatus;
    }

    return {
      version: studySpacePreferencesVersion,
      statuses
    };
  } catch {
    return createEmptyStudySpacePreferences();
  }
}

export function serializeStudySpacePreferences(preferences: StudySpacePreferences) {
  return JSON.stringify({
    version: studySpacePreferencesVersion,
    statuses: preferences.statuses
  } satisfies StudySpacePreferences);
}

export function getStudySpaceStatus(preferences: StudySpacePreferences, courseCode: string): StudySpaceStatus {
  return preferences.statuses[normalizeCourseCode(courseCode)] ?? "available";
}

export function setStudySpaceStatus(
  preferences: StudySpacePreferences,
  courseCode: string,
  status: StudySpaceStatus
): StudySpacePreferences {
  const normalizedCourseCode = normalizeCourseCode(courseCode);
  if (!normalizedCourseCode) return preferences;

  const statuses = { ...preferences.statuses };
  if (status === "available") delete statuses[normalizedCourseCode];
  else statuses[normalizedCourseCode] = status;

  return {
    version: studySpacePreferencesVersion,
    statuses
  };
}
