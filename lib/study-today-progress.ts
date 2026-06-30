const progressVersion = 1;
const progressStoragePrefix = "miteee-study-today-v2";

type StudyTodayProgressPayload = {
  version: typeof progressVersion;
  dayKey: string;
  completedTaskIds: string[];
  completedChecklistItemIds?: string[];
  repairDrafts?: Record<string, StudyTodayRepairDraft>;
};

export type StudyTodayRepairDraft = {
  missed: string;
  correction: string;
  catchQuestion: string;
};

export type StudyTodayProgressState = {
  completedTaskIds: string[];
  completedChecklistItemIds: string[];
  repairDrafts: Record<string, StudyTodayRepairDraft>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function uniqueTaskIds(taskIds: string[]) {
  const seen = new Set<string>();
  return taskIds.filter((id) => {
    const cleaned = id.trim();
    if (!cleaned || seen.has(cleaned)) return false;
    seen.add(cleaned);
    return true;
  });
}

function normalizeRepairDrafts(value: unknown): Record<string, StudyTodayRepairDraft> {
  if (!isRecord(value)) return {};

  const drafts: Record<string, StudyTodayRepairDraft> = {};
  for (const [taskId, draft] of Object.entries(value)) {
    const cleanTaskId = taskId.trim();
    if (!cleanTaskId || !isRecord(draft)) continue;
    if (typeof draft.missed !== "string" || typeof draft.correction !== "string" || typeof draft.catchQuestion !== "string") continue;

    drafts[cleanTaskId] = {
      missed: draft.missed,
      correction: draft.correction,
      catchQuestion: draft.catchQuestion
    };
  }
  return drafts;
}

export function studyTodayDayKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function studyTodayProgressStorageKey(dayKey: string) {
  return `${progressStoragePrefix}:${dayKey}`;
}

const emptyProgressState: StudyTodayProgressState = {
  completedTaskIds: [],
  completedChecklistItemIds: [],
  repairDrafts: {}
};

export function serializeStudyTodayProgress(dayKey: string, completedTaskIds: string[], completedChecklistItemIds: string[] = [], repairDrafts: Record<string, StudyTodayRepairDraft> = {}) {
  const payload: StudyTodayProgressPayload = {
    version: progressVersion,
    dayKey,
    completedTaskIds: uniqueTaskIds(completedTaskIds),
    completedChecklistItemIds: uniqueTaskIds(completedChecklistItemIds),
    repairDrafts: normalizeRepairDrafts(repairDrafts)
  };
  return JSON.stringify(payload);
}

export function buildChecklistProgressLabel(taskId: string, checklistLength: number, completedChecklistItemIds: string[]) {
  const total = Math.max(0, Math.floor(checklistLength));
  if (total === 0) return null;

  const prefix = `${taskId}:checklist:`;
  const completedIndexes = new Set<number>();
  for (const itemId of completedChecklistItemIds) {
    if (!itemId.startsWith(prefix)) continue;
    const index = Number(itemId.slice(prefix.length));
    if (Number.isInteger(index) && index >= 0 && index < total) completedIndexes.add(index);
  }

  return `${completedIndexes.size}/${total} repair steps`;
}

export function parseStudyTodayProgressState(value: string | null | undefined, expectedDayKey: string): StudyTodayProgressState {
  if (!value) return emptyProgressState;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return emptyProgressState;
    if (parsed.version !== progressVersion || parsed.dayKey !== expectedDayKey || !Array.isArray(parsed.completedTaskIds)) return emptyProgressState;
    return {
      completedTaskIds: uniqueTaskIds(parsed.completedTaskIds.filter((id): id is string => typeof id === "string")),
      completedChecklistItemIds: Array.isArray(parsed.completedChecklistItemIds)
        ? uniqueTaskIds(parsed.completedChecklistItemIds.filter((id): id is string => typeof id === "string"))
        : [],
      repairDrafts: normalizeRepairDrafts(parsed.repairDrafts)
    };
  } catch {
    return emptyProgressState;
  }
}

export function parseStudyTodayProgress(value: string | null | undefined, expectedDayKey: string) {
  return parseStudyTodayProgressState(value, expectedDayKey).completedTaskIds;
}
