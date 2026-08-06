import type {
  SscCglQuestion,
  SscCglSectionId,
  SscCglSourceType,
  SscCglTestDetail,
  SscCglTestMode
} from "@/lib/exam-types";
import { isLearnerGradeSscQuestion } from "@/lib/ssc-cgl-quality";
import { sscCglPattern } from "@/lib/ssc-cgl";

export const sscSessionModes = ["quick", "section", "full", "endless", "pyq", "weak"] as const;
export const sscSessionSections = [
  "all",
  "reasoning",
  "general-awareness",
  "quantitative-aptitude",
  "english-comprehension"
] as const;
export const sscSessionLengths = [10, 25, 50, 100, "endless"] as const;
export const sscSessionTimers = ["exam", "relaxed", "off"] as const;
export const sscSessionSources = ["all", "book", "original"] as const;
export const sscSessionDifficulties = ["all", "easy", "medium", "hard"] as const;
export const sscWeakStatuses = ["all", "wrong", "unattempted", "slow"] as const;

export type SscSessionMode = (typeof sscSessionModes)[number];
export type SscSessionSection = (typeof sscSessionSections)[number];
export type SscSessionLength = (typeof sscSessionLengths)[number];
export type SscSessionTimer = (typeof sscSessionTimers)[number];
export type SscSessionSource = (typeof sscSessionSources)[number];
export type SscSessionDifficulty = (typeof sscSessionDifficulties)[number];
export type SscWeakStatus = (typeof sscWeakStatuses)[number];

export type SscSessionConfig = {
  mode: SscSessionMode;
  section: SscSessionSection;
  length: SscSessionLength;
  timer: SscSessionTimer;
  source: SscSessionSource;
  difficulty: SscSessionDifficulty;
  weakStatus: SscWeakStatus;
  seed: string;
};

export type SscSessionBuild = {
  test: SscCglTestDetail;
  requestedCount: number;
  availableCount: number;
  usedWeaknessFallback: boolean;
};

export type SscEndlessBatch = {
  questions: SscCglQuestion[];
  cursor: number;
  nextCursor: number;
  total: number;
  exhausted: boolean;
};

type SearchValue = string | string[] | undefined;
type SearchParamsLike = Record<string, SearchValue>;

const sectionTitleById = Object.fromEntries(
  sscCglPattern.sections.map((section) => [section.id, section.title])
) as Record<SscCglSectionId, string>;

function firstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends readonly (string | number)[]>(value: string | undefined, values: T, fallback: T[number]): T[number] {
  if (value === undefined) return fallback;
  const match = values.find((item) => String(item) === value);
  return match ?? fallback;
}

function defaultSeed() {
  return `daily-${new Date().toISOString().slice(0, 10)}`;
}

export function parseSscSessionConfig(searchParams: SearchParamsLike): SscSessionConfig {
  const mode = oneOf(firstValue(searchParams.mode), sscSessionModes, "quick");
  const rawLength = oneOf(firstValue(searchParams.length), sscSessionLengths, mode === "full" ? 100 : mode === "endless" ? "endless" : 10);
  const seed = firstValue(searchParams.seed)?.trim().slice(0, 80) || defaultSeed();

  return {
    mode,
    section: mode === "full" ? "all" : oneOf(firstValue(searchParams.section), sscSessionSections, "all"),
    length: mode === "full" ? 100 : mode === "endless" ? "endless" : rawLength === "endless" ? 25 : rawLength,
    timer: mode === "full" ? "exam" : oneOf(firstValue(searchParams.timer), sscSessionTimers, "exam"),
    source: mode === "full" || mode === "pyq" || mode === "endless"
      ? "book"
      : oneOf(firstValue(searchParams.source), sscSessionSources, "book"),
    difficulty: oneOf(firstValue(searchParams.difficulty), sscSessionDifficulties, "all"),
    weakStatus: oneOf(firstValue(searchParams.status), sscWeakStatuses, "all"),
    seed
  };
}

function isUsableQuestion(question: SscCglQuestion) {
  const renderedText = [question.stem, ...question.options.map((option) => option.text)].join("\n");
  const hasBookLayoutSpillover = /!\[[^\]]*\]\(|\.\.\/assets\/|```|#{2,}|<img\b|Pinnacle\s+SSC/i.test(renderedText)
    || question.options.some((option) => /(?:^|\s)CGL\s+\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/i.test(option.text));
  const needsMissingFigure = /answer\s+figures?|question\s+figures?|figure\s+series|following\s+figure/i.test(question.stem);

  return question.reviewStatus === "reviewed"
    && isLearnerGradeSscQuestion(question)
    && question.stem.trim().length > 0
    && question.options.length === 4
    && question.options.every((option) => option.text.trim().length > 0)
    && question.options.some((option) => option.id === question.correctOption)
    && !hasBookLayoutSpillover
    && !needsMissingFigure;
}

function matchesSource(question: SscCglQuestion, config: SscSessionConfig) {
  if (config.mode === "pyq") {
    return question.source === "PYQ" || question.provenance.sourceType === "book_user_provided";
  }
  if (config.source === "book") return question.provenance.sourceType === "book_user_provided";
  if (config.source === "original") return question.provenance.sourceType === "original_practice";
  return true;
}

export function normalizeSscSessionQuestionText(value: string) {
  return value
    .replace(/\s*-\s*\|\s*/g, " ")
    .replace(/\s*\|\s*/g, " ")
    .replace(/\s*[/:;-]*\s*(?:SSC\s+)?(?:CGL|CPO|CHSL|MTS|GD)\b(?:\s+Tier\s+[IVX]+)?(?:\s*[-–:]\s*)?\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*(?:\([^)]{1,30}\))?\s*$/i, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeSscSessionQuestion(question: SscCglQuestion): SscCglQuestion {
  return {
    ...question,
    stem: normalizeSscSessionQuestionText(question.stem),
    options: question.options.map((option) => ({
      ...option,
      text: normalizeSscSessionQuestionText(option.text)
    }))
  };
}

export function filterSscSessionQuestions(
  questions: SscCglQuestion[],
  config: SscSessionConfig,
  preferredQuestionIds: string[] = []
) {
  const preferred = new Set(preferredQuestionIds);
  const base = questions
    .filter((question) => (
      isUsableQuestion(question)
      && (config.section === "all" || question.section === config.section)
      && (config.difficulty === "all" || question.difficulty === config.difficulty)
      && matchesSource(question, config)
    ))
    .map(normalizeSscSessionQuestion);

  if (config.mode !== "weak") return base;

  const learnerWeaknesses = base.filter((question) => preferred.has(question.id));
  if (learnerWeaknesses.length > 0) {
    const weakTopics = new Set(learnerWeaknesses.map((question) => question.topic));
    return [
      ...learnerWeaknesses,
      ...base.filter((question) => !preferred.has(question.id) && weakTopics.has(question.topic))
    ];
  }

  const repairFallback = base.filter((question) => (
    question.difficulty === "hard"
    || question.conceptTags.includes("gap-repair")
  ));
  return repairFallback.length > 0 ? repairFallback : base;
}

function seedHash(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFromSeed(seed: string) {
  let state = seedHash(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicShuffle<T>(items: T[], seed: string) {
  const rows = [...items];
  const random = randomFromSeed(seed);
  for (let index = rows.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [rows[index], rows[target]] = [rows[target]!, rows[index]!];
  }
  return rows;
}

function requestedQuestionCount(config: SscSessionConfig) {
  if (config.mode === "full") return 100;
  if (config.length === "endless") return 25;
  return config.length;
}

function selectBalancedQuestions(questions: SscCglQuestion[], config: SscSessionConfig, count: number) {
  if (config.section !== "all") {
    return deterministicShuffle(questions, `${config.seed}:${config.section}`).slice(0, count);
  }

  const groups = sscCglPattern.sections.map((section) => ({
    id: section.id,
    questions: deterministicShuffle(
      questions.filter((question) => question.section === section.id),
      `${config.seed}:${section.id}`
    )
  }));
  const selected: SscCglQuestion[] = [];

  for (let round = 0; selected.length < count; round += 1) {
    let added = false;
    for (const group of groups) {
      const question = group.questions[round];
      if (!question) continue;
      selected.push(question);
      added = true;
      if (selected.length >= count) break;
    }
    if (!added) break;
  }

  return selected;
}

function timerSecondsFor(questionCount: number, timer: SscSessionTimer) {
  if (timer === "off") return 0;
  return questionCount * (timer === "relaxed" ? 72 : 36);
}

function modeToTestMode(mode: SscSessionMode): SscCglTestMode {
  if (mode === "full") return "full_mock";
  if (mode === "pyq") return "pyq_shift";
  if (mode === "weak") return "weak_topic";
  if (mode === "endless") return "topic_drill";
  return "speed_sprint";
}

function sourceTypeFor(source: SscSessionSource): SscCglSourceType | "mixed_reviewed" {
  if (source === "book") return "book_user_provided";
  if (source === "original") return "original_practice";
  return "mixed_reviewed";
}

function modeTitle(config: SscSessionConfig) {
  const section = config.section === "all" ? "All sections" : sectionTitleById[config.section];
  const labels: Record<SscSessionMode, string> = {
    quick: "Quick Test",
    section: "Section Test",
    full: "SSC CGL Tier-I Full Mock",
    endless: "Endless Practice",
    pyq: "Past Paper Test",
    weak: "Weakness Repair Test"
  };
  return config.mode === "full" ? labels.full : `${labels[config.mode]} · ${section}`;
}

export function buildSscSessionTest(
  questions: SscCglQuestion[],
  config: SscSessionConfig,
  preferredQuestionIds: string[] = []
): SscSessionBuild {
  const filtered = filterSscSessionQuestions(questions, config, preferredQuestionIds);
  const requestedCount = requestedQuestionCount(config);
  const preferred = new Set(preferredQuestionIds);
  const selected = config.mode === "weak" && preferred.size > 0
    ? (() => {
        const saved = deterministicShuffle(
          filtered.filter((question) => preferred.has(question.id)),
          `${config.seed}:saved-weaknesses`
        ).slice(0, requestedCount);
        const fill = selectBalancedQuestions(
          filtered.filter((question) => !preferred.has(question.id)),
          config,
          requestedCount - saved.length
        );
        return [...saved, ...fill];
      })()
    : selectBalancedQuestions(filtered, config, requestedCount);
  const sections = sscCglPattern.sections
    .map((patternSection) => {
      const sectionQuestions = selected.filter((question) => question.section === patternSection.id);
      return {
        id: patternSection.id,
        title: patternSection.title,
        timerSeconds: timerSecondsFor(sectionQuestions.length, config.timer),
        questions: sectionQuestions
      };
    })
    .filter((section) => section.questions.length > 0);
  const questionCount = sections.reduce((total, section) => total + section.questions.length, 0);
  const durationSeconds = sections.reduce((total, section) => total + section.timerSeconds, 0);
  const weakPreferredCount = preferredQuestionIds.length > 0
    ? filtered.filter((question) => preferredQuestionIds.includes(question.id)).length
    : 0;

  return {
    test: {
      id: `ssc-session-${config.mode}-${seedHash(JSON.stringify(config)).toString(36)}`,
      title: modeTitle(config),
      mode: modeToTestMode(config.mode),
      questionCount,
      maxScore: questionCount * 2,
      durationSeconds,
      sourceType: sourceTypeFor(config.source),
      reviewStatus: "reviewed",
      description: `${questionCount} reviewed MCQs · +2 correct · -0.5 wrong${config.timer === "off" ? " · untimed" : ` · ${Math.round(durationSeconds / 60)} min`}.`,
      sections
    },
    requestedCount,
    availableCount: filtered.length,
    usedWeaknessFallback: config.mode === "weak" && weakPreferredCount === 0
  };
}

export function buildSscEndlessBatch(
  questions: SscCglQuestion[],
  config: SscSessionConfig,
  cursor = 0,
  limit = 20
): SscEndlessBatch {
  const filtered = filterSscSessionQuestions(questions, { ...config, mode: "endless", length: "endless" });
  const ordered = deterministicShuffle(filtered, `${config.seed}:endless`);
  const safeCursor = Math.max(0, Math.min(Math.floor(cursor), ordered.length));
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 50));
  const batch = ordered.slice(safeCursor, safeCursor + safeLimit);
  const nextCursor = safeCursor + batch.length;

  return {
    questions: batch,
    cursor: safeCursor,
    nextCursor,
    total: ordered.length,
    exhausted: nextCursor >= ordered.length
  };
}

export function serializeSscSessionConfig(config: SscSessionConfig) {
  return Object.fromEntries(Object.entries(config).map(([key, value]) => [key, String(value)]));
}
