import {
  parseStudyPlanPreferences,
  type StudyPlanPreferences
} from "@/lib/study-plan-preferences";
import {
  parseStudySpacePreferences,
  type StudySpacePreferences
} from "@/lib/study-space-preferences";

export const studySettingsBackupVersion = 1 as const;

export type StudySettingsBackup = {
  kind: "miteee-study-settings-backup";
  version: typeof studySettingsBackupVersion;
  exportedAt: string;
  studySpace: StudySpacePreferences;
  studyPlan: StudyPlanPreferences;
};

export type RestoreStudySettingsResult =
  | { ok: true; backup: StudySettingsBackup }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function buildStudySettingsBackup(
  studySpace: StudySpacePreferences,
  studyPlan: StudyPlanPreferences,
  exportedAt: string
) {
  const backup: StudySettingsBackup = {
    kind: "miteee-study-settings-backup",
    version: studySettingsBackupVersion,
    exportedAt,
    studySpace,
    studyPlan
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreStudySettingsBackup(value: string): RestoreStudySettingsResult {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed) || parsed.kind !== "miteee-study-settings-backup" || parsed.version !== studySettingsBackupVersion) {
      return { ok: false, error: "This is not a MITEEE study settings backup." };
    }
    if (!isRecord(parsed.studySpace) || !isRecord(parsed.studyPlan) || typeof parsed.exportedAt !== "string") {
      return { ok: false, error: "The backup is missing study-space or plan settings." };
    }

    return {
      ok: true,
      backup: {
        kind: "miteee-study-settings-backup",
        version: studySettingsBackupVersion,
        exportedAt: parsed.exportedAt,
        studySpace: parseStudySpacePreferences(JSON.stringify(parsed.studySpace)),
        studyPlan: parseStudyPlanPreferences(JSON.stringify(parsed.studyPlan))
      }
    };
  } catch {
    return { ok: false, error: "The backup is not valid JSON." };
  }
}
