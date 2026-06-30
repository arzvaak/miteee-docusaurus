export const learnerMemoryVersion = 1;

export type MemoryNoteRef = {
  slug: string;
  title: string;
  courseCode: string | null;
  courseName: string | null;
};

export type MemoryNoteProgress = MemoryNoteRef & {
  readCount: number;
  lastReadAt: string;
};

export type MistakeEntry = MemoryNoteRef & {
  id: string;
  createdAt: string;
  mistake: string;
  correction: string;
  catchQuestion: string | null;
  resolvedAt: string | null;
};

export type RevisionCard = MemoryNoteRef & {
  id: string;
  source: "note" | "mistake";
  prompt: string;
  dueAt: string;
  intervalDays: number;
  repetitions: number;
  lastReviewedAt: string | null;
  createdAt: string;
  mistakeId: string | null;
};

export type RevisionAttempt = MemoryNoteRef & {
  id: string;
  cardId: string;
  source: RevisionCard["source"];
  prompt: string;
  attempt: string;
  grade: RecallGrade;
  reviewedAt: string;
};

export type StudyTaskActivity = {
  id: string;
  taskId: string;
  title: string;
  method: "retrieval" | "spacing" | "interleaving" | "self-explanation";
  minutes: number;
  completedAt: string;
  note: MemoryNoteRef | null;
};

export type StudyTaskActivityInput = {
  id: string;
  title: string;
  method: StudyTaskActivity["method"];
  minutes: number;
  note?: MemoryNoteRef | null;
};

export type RecallGrade = "again" | "hard" | "good" | "easy";

export type LearnerMemory = {
  version: typeof learnerMemoryVersion;
  notes: Record<string, MemoryNoteProgress>;
  mistakes: MistakeEntry[];
  revisionCards: Record<string, RevisionCard>;
  revisionAttempts: RevisionAttempt[];
  studyActivity: StudyTaskActivity[];
};

export type LearnerMemoryBackup = {
  kind: "miteee-learner-memory-backup";
  version: typeof learnerMemoryVersion;
  exportedAt: string;
  memory: LearnerMemory;
};

export type MistakeInput = {
  id: string;
  createdAt: string;
  mistake: string;
  correction: string;
  catchQuestion?: string;
};

export type LearnerMemoryStats = {
  readNotes: number;
  totalReads: number;
  mistakes: number;
  openMistakes: number;
  weakRevisionAttempts: number;
  dueCards: number;
  completedStudyBlocks: number;
  completedStudyMinutes: number;
  lastStudyAt: string | null;
};

export type LearnerMemoryPriority = {
  dueCards: RevisionCard[];
  openMistakes: MistakeEntry[];
  weakAttempts: RevisionAttempt[];
  summary: LearnerMemoryStats;
};

export type WeaknessTheme =
  | "Formula selection"
  | "Definition recall"
  | "Unit conversion"
  | "Concept separation"
  | "Procedure setup"
  | "Recall accuracy";

export type LearnerWeaknessCourseInsight = {
  courseCode: string | null;
  courseName: string | null;
  label: string;
  score: number;
  openMistakes: number;
  weakAttempts: number;
  dueCards: number;
};

export type LearnerWeaknessThemeInsight = {
  theme: WeaknessTheme;
  count: number;
  courseCount: number;
  examples: string[];
};

export type LearnerWeaknessInsight = {
  hasSignals: boolean;
  topCourse: LearnerWeaknessCourseInsight | null;
  topTheme: LearnerWeaknessThemeInsight | null;
  nextAction: string;
  courseInsights: LearnerWeaknessCourseInsight[];
  themeInsights: LearnerWeaknessThemeInsight[];
};

export type StudyMomentum = {
  todayMinutes: number;
  weekMinutes: number;
  currentStreakDays: number;
  recentActivity: StudyTaskActivity[];
  methodMinutes: Record<StudyTaskActivity["method"], number>;
};

export type StudyMethodBalanceItem = {
  method: StudyTaskActivity["method"];
  label: string;
  minutes: number;
  percent: number;
  targetPercent: number;
  status: "empty" | "low" | "on-track";
  guidance: string;
};

export type StudyMethodBalance = {
  weekMinutes: number;
  nextMethod: StudyTaskActivity["method"];
  summary: string;
  items: StudyMethodBalanceItem[];
};

export type StudyNudge = {
  kind: "repair" | "attempt-repair" | "start" | "retrieval" | "upsc-balance" | "technical-balance" | "momentum";
  title: string;
  body: string;
  href: string;
};

export type LearnerMemoryBriefing = {
  tone: "repair" | "mistake" | "attempt" | "start" | "momentum";
  title: string;
  body: string;
  href: string;
  primaryLabel: string;
  stats: {
    dueCards: number;
    openMistakes: number;
    todayMinutes: number;
    weekMinutes: number;
    currentStreakDays: number;
    completedStudyMinutes: number;
  };
};

export type RestoreLearnerMemoryResult =
  | { ok: true; memory: LearnerMemory; exportedAt: string }
  | { ok: false; error: string };

function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function dateKey(value: string) {
  return value.slice(0, 10);
}

function addUtcDays(dayKey: string, days: number) {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isUpscActivity(activity: StudyTaskActivity) {
  const courseCode = activity.note?.courseCode?.toUpperCase() ?? "";
  const courseName = activity.note?.courseName?.toUpperCase() ?? "";
  return courseCode.includes("UPSC") || courseName.includes("UPSC");
}

function courseKey(item: MemoryNoteRef) {
  return item.courseCode || item.courseName || item.slug || "uncategorized";
}

function courseLabel(item: MemoryNoteRef) {
  return item.courseName || item.courseCode || item.title || "Uncategorized";
}

function inferWeaknessTheme(text: string): WeaknessTheme {
  const value = text.toLowerCase();
  if (/\b(formula|equation|substitut|torque|ratio|law)\b/.test(value)) return "Formula selection";
  if (/\b(definition|define|article|who|what|certif|memorize)\b/.test(value)) return "Definition recall";
  if (/\b(unit|convert|conversion|percent|per-unit|numeric|value)\b/.test(value)) return "Unit conversion";
  if (/\b(confus|mixed|separate|difference|inverse|distinguish)\b/.test(value)) return "Concept separation";
  if (/\b(step|setup|method|procedure|identify|before|after)\b/.test(value)) return "Procedure setup";
  return "Recall accuracy";
}

const methodBalanceTargets: Array<{
  method: StudyTaskActivity["method"];
  label: string;
  targetPercent: number;
  guidance: string;
}> = [
  {
    method: "retrieval",
    label: "Practice testing",
    targetPercent: 35,
    guidance: "Close the note and produce the answer before checking."
  },
  {
    method: "spacing",
    label: "Distributed practice",
    targetPercent: 25,
    guidance: "Bring older material back into today's loop."
  },
  {
    method: "interleaving",
    label: "Interleaving",
    targetPercent: 20,
    guidance: "Switch subjects or problem families before the pattern gets automatic."
  },
  {
    method: "self-explanation",
    label: "Self-explanation",
    targetPercent: 20,
    guidance: "Turn misses into corrected rules and catch questions."
  }
];

function copyMemory(memory: LearnerMemory): LearnerMemory {
  return {
    version: learnerMemoryVersion,
    notes: { ...memory.notes },
    mistakes: memory.mistakes.map((mistake) => ({ ...mistake })),
    revisionCards: Object.fromEntries(Object.entries(memory.revisionCards).map(([id, card]) => [id, { ...card }])),
    revisionAttempts: memory.revisionAttempts.map((attempt) => ({ ...attempt })),
    studyActivity: memory.studyActivity.map((activity) => ({ ...activity, note: activity.note ? { ...activity.note } : null }))
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeMistakeEntry(value: MistakeEntry): MistakeEntry {
  const catchQuestion = typeof value.catchQuestion === "string" ? cleanText(value.catchQuestion) : "";
  return {
    ...value,
    catchQuestion: catchQuestion || null
  };
}

export function createEmptyLearnerMemory(): LearnerMemory {
  return {
    version: learnerMemoryVersion,
    notes: {},
    mistakes: [],
    revisionCards: {},
    revisionAttempts: [],
    studyActivity: []
  };
}

export function parseLearnerMemory(value: string | null | undefined): LearnerMemory {
  if (!value) return createEmptyLearnerMemory();
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed) || parsed.version !== learnerMemoryVersion || !isRecord(parsed.notes) || !Array.isArray(parsed.mistakes) || !isRecord(parsed.revisionCards)) {
      return createEmptyLearnerMemory();
    }
    return {
      ...(parsed as Omit<LearnerMemory, "studyActivity" | "revisionAttempts">),
      mistakes: (parsed.mistakes as MistakeEntry[]).map(normalizeMistakeEntry),
      revisionAttempts: Array.isArray(parsed.revisionAttempts) ? parsed.revisionAttempts as RevisionAttempt[] : [],
      studyActivity: Array.isArray(parsed.studyActivity) ? parsed.studyActivity as StudyTaskActivity[] : []
    };
  } catch {
    return createEmptyLearnerMemory();
  }
}

export function serializeLearnerMemory(memory: LearnerMemory) {
  return JSON.stringify(memory);
}

export function buildLearnerMemoryBackup(memory: LearnerMemory, exportedAt: string) {
  const backup: LearnerMemoryBackup = {
    kind: "miteee-learner-memory-backup",
    version: learnerMemoryVersion,
    exportedAt,
    memory: copyMemory(memory)
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreLearnerMemoryBackup(value: string): RestoreLearnerMemoryResult {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return { ok: false, error: "Backup is not a JSON object." };
    if (parsed.kind !== "miteee-learner-memory-backup") return { ok: false, error: "Backup is not a MITEEE learner-memory export." };
    if (parsed.version !== learnerMemoryVersion) return { ok: false, error: "Backup version is not supported." };
    if (typeof parsed.exportedAt !== "string") return { ok: false, error: "Backup is missing an export timestamp." };
    const memory = parseLearnerMemory(JSON.stringify(parsed.memory));
    const hasMemoryData = Object.keys(memory.notes).length > 0 ||
      memory.mistakes.length > 0 ||
      Object.keys(memory.revisionCards).length > 0 ||
      memory.revisionAttempts.length > 0 ||
      memory.studyActivity.length > 0;
    if (!hasMemoryData && JSON.stringify(parsed.memory) !== serializeLearnerMemory(createEmptyLearnerMemory())) {
      return { ok: false, error: "Backup memory payload is invalid." };
    }
    return { ok: true, memory, exportedAt: parsed.exportedAt };
  } catch {
    return { ok: false, error: "Backup is not valid JSON." };
  }
}

export function recordNoteRead(memory: LearnerMemory, note: MemoryNoteRef, readAt: string): LearnerMemory {
  const next = copyMemory(memory);
  const previous = next.notes[note.slug];
  next.notes[note.slug] = {
    ...note,
    readCount: (previous?.readCount ?? 0) + 1,
    lastReadAt: readAt
  };

  const cardId = `note:${note.slug}`;
  const previousCard = next.revisionCards[cardId];
  next.revisionCards[cardId] = {
    ...note,
    id: cardId,
    source: "note",
    prompt: `Recall the key ideas from ${note.title} without opening the note first.`,
    dueAt: previousCard?.dueAt ?? addDays(readAt, 1),
    intervalDays: previousCard?.intervalDays ?? 1,
    repetitions: previousCard?.repetitions ?? 0,
    lastReviewedAt: previousCard?.lastReviewedAt ?? null,
    createdAt: previousCard?.createdAt ?? readAt,
    mistakeId: null
  };

  return next;
}

export function addMistake(memory: LearnerMemory, note: MemoryNoteRef, input: MistakeInput): LearnerMemory {
  const next = copyMemory(memory);
  const catchQuestion = input.catchQuestion ? cleanText(input.catchQuestion) : "";
  const mistake: MistakeEntry = {
    ...note,
    id: input.id,
    createdAt: input.createdAt,
    mistake: cleanText(input.mistake),
    correction: cleanText(input.correction),
    catchQuestion: catchQuestion || null,
    resolvedAt: null
  };

  next.mistakes = [mistake, ...next.mistakes.filter((entry) => entry.id !== input.id)];
  next.revisionCards[`mistake:${input.id}`] = {
    ...note,
    id: `mistake:${input.id}`,
    source: "mistake",
    prompt: `${mistake.mistake} Correct rule: ${mistake.correction}${mistake.catchQuestion ? ` Catch question: ${mistake.catchQuestion}` : ""}`,
    dueAt: input.createdAt,
    intervalDays: 1,
    repetitions: 0,
    lastReviewedAt: null,
    createdAt: input.createdAt,
    mistakeId: input.id
  };

  return next;
}

export function recordStudyTaskCompletion(memory: LearnerMemory, task: StudyTaskActivityInput, completedAt: string): LearnerMemory {
  const next = copyMemory(memory);
  const dayKey = completedAt.slice(0, 10);
  const activityId = `study:${dayKey}:${task.id}`;
  const activity: StudyTaskActivity = {
    id: activityId,
    taskId: task.id,
    title: task.title,
    method: task.method,
    minutes: Math.max(0, Math.round(task.minutes)),
    completedAt,
    note: task.note ? { ...task.note } : null
  };

  next.studyActivity = [
    activity,
    ...next.studyActivity.filter((entry) => entry.id !== activityId)
  ].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));

  return next;
}

export function removeStudyTaskCompletion(memory: LearnerMemory, taskId: string, completedAt: string): LearnerMemory {
  const next = copyMemory(memory);
  const dayKey = completedAt.slice(0, 10);
  const activityId = `study:${dayKey}:${taskId}`;
  next.studyActivity = next.studyActivity.filter((entry) => entry.id !== activityId);
  return next;
}

export function reviewRevisionCard(memory: LearnerMemory, cardId: string, grade: RecallGrade, reviewedAt: string): LearnerMemory {
  const card = memory.revisionCards[cardId];
  if (!card) return memory;

  const next = copyMemory(memory);
  const currentInterval = Math.max(1, card.intervalDays);
  const intervalDays = grade === "again" ? 1 : grade === "hard" ? currentInterval : grade === "good" ? currentInterval * 2 : currentInterval * 3;

  next.revisionCards[cardId] = {
    ...card,
    intervalDays,
    repetitions: card.repetitions + 1,
    lastReviewedAt: reviewedAt,
    dueAt: addDays(reviewedAt, intervalDays)
  };

  if (card.mistakeId && (grade === "good" || grade === "easy")) {
    next.mistakes = next.mistakes.map((mistake) => mistake.id === card.mistakeId ? { ...mistake, resolvedAt: reviewedAt } : mistake);
  }

  return next;
}

export function reviewRevisionCardWithAttempt(memory: LearnerMemory, cardId: string, grade: RecallGrade, attempt: string, reviewedAt: string): LearnerMemory {
  const card = memory.revisionCards[cardId];
  if (!card) return memory;

  const reviewed = reviewRevisionCard(memory, cardId, grade, reviewedAt);
  const next = copyMemory(reviewed);
  const cleanAttempt = cleanText(attempt);
  if (!cleanAttempt) return next;

  const attemptEntry: RevisionAttempt = {
    slug: card.slug,
    title: card.title,
    courseCode: card.courseCode,
    courseName: card.courseName,
    id: `attempt:${reviewedAt}:${cardId}`,
    cardId,
    source: card.source,
    prompt: card.prompt,
    attempt: cleanAttempt,
    grade,
    reviewedAt
  };

  next.revisionAttempts = [
    attemptEntry,
    ...next.revisionAttempts.filter((entry) => entry.id !== attemptEntry.id)
  ]
    .sort((a, b) => Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt))
    .slice(0, 100);

  return next;
}

export function getDueRevisionCards(memory: LearnerMemory, at: string) {
  const timestamp = Date.parse(at);
  return Object.values(memory.revisionCards)
    .filter((card) => Date.parse(card.dueAt) <= timestamp)
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === "mistake" ? -1 : 1;
      return Date.parse(a.dueAt) - Date.parse(b.dueAt);
    });
}

export function getWeakRevisionAttempts(memory: LearnerMemory, at: string, windowDays = 7, limit = 3) {
  const cappedWindowDays = Math.max(1, Math.floor(windowDays));
  const cappedLimit = Math.max(1, Math.floor(limit));
  const todayKey = dateKey(at);
  const startKey = addUtcDays(todayKey, -(cappedWindowDays - 1));
  const timestamp = Date.parse(at);

  return memory.revisionAttempts
    .filter((attempt) => {
      if (attempt.grade !== "again" && attempt.grade !== "hard") return false;
      const reviewedKey = dateKey(attempt.reviewedAt);
      return reviewedKey >= startKey && reviewedKey <= todayKey && Date.parse(attempt.reviewedAt) <= timestamp;
    })
    .sort((a, b) => Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt))
    .slice(0, cappedLimit);
}

export function getLearnerMemoryStats(memory: LearnerMemory, at: string): LearnerMemoryStats {
  const notes = Object.values(memory.notes);
  const completedActivity = memory.studyActivity.filter((activity) => Date.parse(activity.completedAt) <= Date.parse(at));
  return {
    readNotes: notes.length,
    totalReads: notes.reduce((sum, note) => sum + note.readCount, 0),
    mistakes: memory.mistakes.length,
    openMistakes: memory.mistakes.filter((mistake) => !mistake.resolvedAt).length,
    weakRevisionAttempts: getWeakRevisionAttempts(memory, at, 7, Number.MAX_SAFE_INTEGER).length,
    dueCards: getDueRevisionCards(memory, at).length,
    completedStudyBlocks: completedActivity.length,
    completedStudyMinutes: completedActivity.reduce((sum, activity) => sum + activity.minutes, 0),
    lastStudyAt: completedActivity[0]?.completedAt ?? null
  };
}

export function getStudyMomentum(memory: LearnerMemory, at: string, windowDays = 7): StudyMomentum {
  const cappedWindowDays = Math.max(1, Math.floor(windowDays));
  const todayKey = dateKey(at);
  const startKey = addUtcDays(todayKey, -(cappedWindowDays - 1));
  const recentActivity = memory.studyActivity
    .filter((activity) => {
      const activityKey = dateKey(activity.completedAt);
      return activityKey >= startKey && activityKey <= todayKey;
    })
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));

  const methodMinutes: StudyMomentum["methodMinutes"] = {
    retrieval: 0,
    spacing: 0,
    interleaving: 0,
    "self-explanation": 0
  };

  for (const activity of recentActivity) {
    methodMinutes[activity.method] += activity.minutes;
  }

  const activeDays = new Set(recentActivity.map((activity) => dateKey(activity.completedAt)));
  let currentStreakDays = 0;
  for (let offset = 0; offset < cappedWindowDays; offset += 1) {
    if (!activeDays.has(addUtcDays(todayKey, -offset))) break;
    currentStreakDays += 1;
  }

  return {
    todayMinutes: recentActivity.filter((activity) => dateKey(activity.completedAt) === todayKey).reduce((sum, activity) => sum + activity.minutes, 0),
    weekMinutes: recentActivity.reduce((sum, activity) => sum + activity.minutes, 0),
    currentStreakDays,
    recentActivity,
    methodMinutes
  };
}

export function getStudyMethodBalance(memory: LearnerMemory, at: string, windowDays = 7): StudyMethodBalance {
  const momentum = getStudyMomentum(memory, at, windowDays);
  const hasStudy = momentum.weekMinutes > 0;
  const items = methodBalanceTargets.map((target) => {
    const minutes = momentum.methodMinutes[target.method];
    const percent = hasStudy ? Math.round((minutes / momentum.weekMinutes) * 100) : 0;
    const status: StudyMethodBalanceItem["status"] = hasStudy
      ? percent >= Math.ceil(target.targetPercent * 0.5) ? "on-track" : "low"
      : "empty";

    return {
      method: target.method,
      label: target.label,
      minutes,
      percent,
      targetPercent: target.targetPercent,
      status,
      guidance: target.guidance
    };
  });

  const next = hasStudy
    ? [...items].sort((a, b) => (a.percent / a.targetPercent) - (b.percent / b.targetPercent))[0]
    : items[0];
  const nextMethod = next?.method ?? "retrieval";
  const nextLabel = next?.label ?? "Practice testing";

  return {
    weekMinutes: momentum.weekMinutes,
    nextMethod,
    summary: hasStudy
      ? `${nextLabel} is the next method to protect this week. Keep the loop balanced instead of drifting into one comfortable mode.`
      : "Start the week with closed-book retrieval before adding review, videos, or passive reading.",
    items
  };
}

export function getStudyNudge(memory: LearnerMemory, at: string): StudyNudge {
  const dueCard = getDueRevisionCards(memory, at)[0];
  if (dueCard) {
    return {
      kind: "repair",
      title: "Repair due recall first.",
      body: `${dueCard.title} is already due. Close that loop before adding new material.`,
      href: "/revision"
    };
  }

  const weakAttempt = getWeakRevisionAttempts(memory, at, 7, 1)[0];
  if (weakAttempt) {
    return {
      kind: "attempt-repair",
      title: "Repair failed recall attempt.",
      body: `${weakAttempt.title}: ${weakAttempt.attempt}`,
      href: `/notes/${weakAttempt.slug}`
    };
  }

  const momentum = getStudyMomentum(memory, at, 7);
  if (momentum.weekMinutes > 0 && momentum.methodMinutes.retrieval === 0) {
    return {
      kind: "retrieval",
      title: "Add retrieval practice next.",
      body: "This week has no retrieval minutes yet. Use closed-book recall before another review block.",
      href: "/#study-today"
    };
  }

  if (momentum.weekMinutes > 0) {
    const upscMinutes = momentum.recentActivity.filter(isUpscActivity).reduce((sum, activity) => sum + activity.minutes, 0);
    const technicalMinutes = momentum.weekMinutes - upscMinutes;
    if (technicalMinutes > 0 && upscMinutes === 0) {
      return {
        kind: "upsc-balance",
        title: "Add one UPSC CSE block.",
        body: "This week is all technical work. Add polity, governance, or essay recall before the balance drifts.",
        href: "/courses/UPSC-CSE-POLITICAL-SCIENCE"
      };
    }
    if (upscMinutes > 0 && technicalMinutes === 0) {
      return {
        kind: "technical-balance",
        title: "Add one MITEEE technical block.",
        body: "This week is all UPSC work. Add one Electrical Machines or instrumentation block to keep the exam track warm.",
        href: "/courses/SEM5-EM2"
      };
    }
  }

  if (momentum.todayMinutes === 0) {
    return {
      kind: "start",
      title: "Start with one closed-book block.",
      body: "Do one 30-minute retrieval sprint before opening new reading or browsing notes.",
      href: "/#study-today"
    };
  }

  return {
    kind: "momentum",
    title: momentum.currentStreakDays >= 2 ? "Protect the streak." : "Build momentum deliberately.",
    body: momentum.currentStreakDays >= 2
      ? `${momentum.currentStreakDays} days are active. Keep it alive with one short recall block.`
      : "Finish one Study Today block, then log the exact gap it exposed.",
    href: "/#study-today"
  };
}

export function buildLearnerWeaknessInsight(memory: LearnerMemory, at: string, limit = 3): LearnerWeaknessInsight {
  const cappedLimit = Math.max(1, Math.floor(limit));
  const timestamp = Date.parse(at);
  const courseMap = new Map<string, LearnerWeaknessCourseInsight>();
  const themeMap = new Map<WeaknessTheme, { count: number; courses: Set<string>; courseCounts: Map<string, number>; examples: string[] }>();

  function ensureCourse(item: MemoryNoteRef) {
    const key = courseKey(item);
    const existing = courseMap.get(key);
    if (existing) return existing;
    const created: LearnerWeaknessCourseInsight = {
      courseCode: item.courseCode,
      courseName: item.courseName,
      label: courseLabel(item),
      score: 0,
      openMistakes: 0,
      weakAttempts: 0,
      dueCards: 0
    };
    courseMap.set(key, created);
    return created;
  }

  function addTheme(item: MemoryNoteRef, text: string) {
    const theme = inferWeaknessTheme(text);
    const key = courseKey(item);
    const existing = themeMap.get(theme) ?? { count: 0, courses: new Set<string>(), courseCounts: new Map<string, number>(), examples: [] };
    existing.count += 1;
    existing.courses.add(key);
    existing.courseCounts.set(key, (existing.courseCounts.get(key) ?? 0) + 1);
    const example = cleanText(text);
    if (example && existing.examples.length < 2) existing.examples.push(example);
    themeMap.set(theme, existing);
  }

  for (const mistake of memory.mistakes) {
    if (mistake.resolvedAt || Date.parse(mistake.createdAt) > timestamp) continue;
    const course = ensureCourse(mistake);
    course.openMistakes += 1;
    course.score += 3;
    addTheme(mistake, `${mistake.mistake} ${mistake.correction} ${mistake.catchQuestion ?? ""}`);
  }

  for (const attempt of getWeakRevisionAttempts(memory, at, 7, Number.MAX_SAFE_INTEGER)) {
    const course = ensureCourse(attempt);
    course.weakAttempts += 1;
    course.score += 2;
    addTheme(attempt, `${attempt.prompt} ${attempt.attempt}`);
  }

  for (const card of getDueRevisionCards(memory, at)) {
    const course = ensureCourse(card);
    course.dueCards += 1;
    course.score += 1;
  }

  const courseInsights = [...courseMap.values()]
    .filter((course) => course.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.weakAttempts !== a.weakAttempts) return b.weakAttempts - a.weakAttempts;
      if (b.openMistakes !== a.openMistakes) return b.openMistakes - a.openMistakes;
      if (b.dueCards !== a.dueCards) return b.dueCards - a.dueCards;
      return a.label.localeCompare(b.label);
    })
    .slice(0, cappedLimit);

  const themeInsights = [...themeMap.entries()]
    .map(([theme, value]) => ({
      theme,
      count: value.count,
      courseCount: value.courses.size,
      examples: value.examples
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (b.courseCount !== a.courseCount) return b.courseCount - a.courseCount;
      return a.theme.localeCompare(b.theme);
    })
    .slice(0, cappedLimit);

  const topCourse = courseInsights[0] ?? null;
  const topTheme = themeInsights[0] ?? null;
  const topCourseKey = topCourse ? topCourse.courseCode || topCourse.courseName || topCourse.label : null;
  const topCourseTheme = topCourse
    ? [...themeMap.entries()]
      .map(([theme, value]) => ({ theme, count: topCourseKey ? value.courseCounts.get(topCourseKey) ?? 0 : 0 }))
      .filter((item) => item.count > 0)
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.theme.localeCompare(b.theme);
      })[0]?.theme ?? topTheme?.theme
    : topTheme?.theme;

  return {
    hasSignals: Boolean(topCourse || topTheme),
    topCourse,
    topTheme,
    nextAction: topCourse && topTheme
      ? `Review ${topCourse.label}: do one closed-book repair focused on ${topCourseTheme}.`
      : topCourse
        ? `Review ${topCourse.label}: clear one due card or open mistake before adding new reading.`
        : "Seed learner memory with one graded recall attempt or logged mistake.",
    courseInsights,
    themeInsights
  };
}

export function buildLearnerMemoryBriefing(memory: LearnerMemory, at: string): LearnerMemoryBriefing {
  const priority = buildLearnerMemoryPriority(memory, at, 1);
  const momentum = getStudyMomentum(memory, at, 7);
  const stats = {
    dueCards: priority.summary.dueCards,
    openMistakes: priority.summary.openMistakes,
    todayMinutes: momentum.todayMinutes,
    weekMinutes: momentum.weekMinutes,
    currentStreakDays: momentum.currentStreakDays,
    completedStudyMinutes: priority.summary.completedStudyMinutes
  };

  const dueCard = priority.dueCards[0];
  if (dueCard) {
    return {
      tone: "repair",
      title: `Repair due recall: ${dueCard.title}`,
      body: dueCard.prompt,
      href: "/revision",
      primaryLabel: "Review now",
      stats
    };
  }

  const openMistake = priority.openMistakes[0];
  if (openMistake) {
    return {
      tone: "mistake",
      title: `Close open mistake: ${openMistake.title}`,
      body: openMistake.catchQuestion ?? openMistake.correction,
      href: `/notes/${openMistake.slug}`,
      primaryLabel: "Repair mistake",
      stats
    };
  }

  const weakAttempt = priority.weakAttempts[0];
  if (weakAttempt) {
    return {
      tone: "attempt",
      title: `Repair failed recall: ${weakAttempt.title}`,
      body: weakAttempt.attempt,
      href: `/notes/${weakAttempt.slug}`,
      primaryLabel: "Repair attempt",
      stats
    };
  }

  if (momentum.todayMinutes === 0) {
    return {
      tone: "start",
      title: "Start with closed-book recall.",
      body: "No study blocks are logged today. Begin with one Study Today task before opening new reading.",
      href: "/#study-today",
      primaryLabel: "Start today",
      stats
    };
  }

  return {
    tone: "momentum",
    title: "Keep today's loop visible.",
    body: `${momentum.todayMinutes} minutes are logged today. Add one repair or recall block before switching context.`,
    href: "/revision",
    primaryLabel: "Review momentum",
    stats
  };
}

export function buildLearnerMemoryPriority(memory: LearnerMemory, at: string, limit = 3): LearnerMemoryPriority {
  const cappedLimit = Math.max(1, Math.floor(limit));
  const openMistakes = memory.mistakes
    .filter((mistake) => !mistake.resolvedAt)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return {
    dueCards: getDueRevisionCards(memory, at).slice(0, cappedLimit),
    openMistakes: openMistakes.slice(0, cappedLimit),
    weakAttempts: getWeakRevisionAttempts(memory, at, 7, cappedLimit),
    summary: getLearnerMemoryStats(memory, at)
  };
}
