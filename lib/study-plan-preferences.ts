export const studyPlanPreferencesVersion = 1 as const;
export const studyPlanPreferencesStorageKey = "miteee-study-plan-preferences";
export const studyPlanPreferencesChangeEvent = "miteee-study-plan-preferences-change";

export type StudyPlanDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type StudyPlanPreferences = {
  version: typeof studyPlanPreferencesVersion;
  enabled: boolean;
  subjectCodes: string[];
  dailyMinutes: number;
  studyDays: StudyPlanDay[];
};

export const studyPlanDayOptions: ReadonlyArray<{ value: StudyPlanDay; label: string; shortLabel: string }> = [
  { value: "mon", label: "Monday", shortLabel: "Mon" },
  { value: "tue", label: "Tuesday", shortLabel: "Tue" },
  { value: "wed", label: "Wednesday", shortLabel: "Wed" },
  { value: "thu", label: "Thursday", shortLabel: "Thu" },
  { value: "fri", label: "Friday", shortLabel: "Fri" },
  { value: "sat", label: "Saturday", shortLabel: "Sat" },
  { value: "sun", label: "Sunday", shortLabel: "Sun" }
];

const defaultStudyDays: StudyPlanDay[] = ["mon", "tue", "wed", "thu", "fri"];
const validStudyDays = new Set<StudyPlanDay>(studyPlanDayOptions.map((option) => option.value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeSubjectCodes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)));
}

function normalizeMinutes(value: unknown) {
  const minutes = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(minutes)) return 45;
  return Math.min(300, Math.max(10, Math.round(minutes)));
}

function normalizeStudyDays(value: unknown): StudyPlanDay[] {
  if (!Array.isArray(value)) return [...defaultStudyDays];
  const days = Array.from(new Set(value.filter((day): day is StudyPlanDay => validStudyDays.has(day as StudyPlanDay))));
  return days.length > 0 ? days : [...defaultStudyDays];
}

export function createDefaultStudyPlanPreferences(): StudyPlanPreferences {
  return {
    version: studyPlanPreferencesVersion,
    enabled: false,
    subjectCodes: [],
    dailyMinutes: 45,
    studyDays: [...defaultStudyDays]
  };
}

export function parseStudyPlanPreferences(value: string | null | undefined): StudyPlanPreferences {
  if (!value) return createDefaultStudyPlanPreferences();

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed) || parsed.version !== studyPlanPreferencesVersion) {
      return createDefaultStudyPlanPreferences();
    }

    return {
      version: studyPlanPreferencesVersion,
      enabled: parsed.enabled === true,
      subjectCodes: normalizeSubjectCodes(parsed.subjectCodes),
      dailyMinutes: normalizeMinutes(parsed.dailyMinutes),
      studyDays: normalizeStudyDays(parsed.studyDays)
    };
  } catch {
    return createDefaultStudyPlanPreferences();
  }
}

export function serializeStudyPlanPreferences(preferences: StudyPlanPreferences) {
  return JSON.stringify({
    version: studyPlanPreferencesVersion,
    enabled: preferences.enabled,
    subjectCodes: normalizeSubjectCodes(preferences.subjectCodes),
    dailyMinutes: normalizeMinutes(preferences.dailyMinutes),
    studyDays: normalizeStudyDays(preferences.studyDays)
  } satisfies StudyPlanPreferences);
}

export function setStudyPlanEnabled(preferences: StudyPlanPreferences, enabled: boolean): StudyPlanPreferences {
  return { ...preferences, enabled };
}

export function setStudyPlanSubjects(preferences: StudyPlanPreferences, subjectCodes: string[]): StudyPlanPreferences {
  return { ...preferences, subjectCodes: normalizeSubjectCodes(subjectCodes) };
}

export function setStudyPlanDailyMinutes(preferences: StudyPlanPreferences, dailyMinutes: number): StudyPlanPreferences {
  return { ...preferences, dailyMinutes: normalizeMinutes(dailyMinutes) };
}

export function toggleStudyPlanDay(preferences: StudyPlanPreferences, day: StudyPlanDay): StudyPlanPreferences {
  if (!validStudyDays.has(day)) return preferences;
  const selected = preferences.studyDays.includes(day);
  if (selected && preferences.studyDays.length === 1) return preferences;
  return {
    ...preferences,
    studyDays: selected
      ? preferences.studyDays.filter((item) => item !== day)
      : studyPlanDayOptions.map((option) => option.value).filter((item) => item === day || preferences.studyDays.includes(item))
  };
}

export function reconcileStudyPlanSubjects(preferences: StudyPlanPreferences, activeSubjectCodes: string[]): StudyPlanPreferences {
  const active = new Set(normalizeSubjectCodes(activeSubjectCodes));
  const subjectCodes = preferences.subjectCodes.filter((courseCode) => active.has(courseCode));
  if (subjectCodes.length === preferences.subjectCodes.length && subjectCodes.every((code, index) => code === preferences.subjectCodes[index])) {
    return preferences;
  }
  return { ...preferences, subjectCodes };
}
