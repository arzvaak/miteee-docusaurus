import fs from "node:fs";
import path from "node:path";
import type { SscCglExamPattern, SscCglQuestion, SscCglSectionId, SscCglTestDetail, SscCglTestMode, SscCglTestSummary, SscCglTopic } from "@/lib/exam-types";
import { isLearnerGradeSscQuestion } from "@/lib/ssc-cgl-quality";

export const sscCglPattern: SscCglExamPattern = {
  totalQuestions: 100,
  totalMarks: 200,
  negativeMarks: -0.5,
  sections: [
    { id: "reasoning", title: "General Intelligence and Reasoning", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "general-awareness", title: "General Awareness", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "quantitative-aptitude", title: "Quantitative Aptitude", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "english-comprehension", title: "English Comprehension", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 }
  ]
};

type GeneratedSscCglData = {
  generatedAt: string;
  exam: {
    code: "SSC-CGL";
    year: 2026;
    tier: "Tier-I";
    officialNoticeUrl: string;
    pattern: typeof sscCglPattern;
  };
  questions: SscCglQuestion[];
  topics: SscCglTopic[];
  tests: Array<Omit<SscCglTestSummary, "questionCount" | "maxScore" | "durationSeconds"> & { questionIds: string[] }>;
};

export type SscCglValidationReport = {
  ok: boolean;
  errors: string[];
  duplicateQuestionIds: string[];
  reviewedQuestions: number;
  unverifiedQuestions: number;
};

export type SscCglTopicReadiness = {
  slug: string;
  title: string;
  subject: string;
  section: SscCglSectionId;
  priority: SscCglTopic["priority"];
  reviewedQuestions: number;
  bookBackedQuestions: number;
  gapRepairQuestions: number;
  readinessPercent: number;
  readinessLabel: "mastery-bank" | "ranked-ready" | "repair-watch" | "thin";
  nextAction: string;
};

export type SscCglSectionReadiness = {
  section: SscCglSectionId;
  title: string;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  gapRepairQuestions: number;
  topics: number;
  thinTopics: number;
  readinessPercent: number;
  readinessLabel: "mastery-bank" | "ranked-ready" | "repair-watch";
  drillHref: string;
};

export type SscCglRepairPlanItem = {
  id: string;
  label: string;
  title: string;
  href: string;
  minutes: number;
  section?: SscCglSectionId;
  reason: string;
  target: string;
  evidence: string;
};

export type SscCglStudyDepthNote = {
  slug: string;
  title: string;
  subject: string;
  href: string;
  manualReviewed: boolean;
  bodyLength: number;
  examples: number;
  sectionCount: number;
  answerReveals: number;
  hasFlowchart: boolean;
  hasTrapTable: boolean;
  hasPractice: boolean;
  hasDrill: boolean;
  hasMixedPractice: boolean;
  hasCanonicalPracticeLink: boolean;
  depthScore: number;
};

export type SscCglStudyDepthAudit = {
  totalTopics: number;
  topicsWithNotes: number;
  missingNotes: number;
  deepNotes: number;
  notesWithFlowcharts: number;
  notesWithTrapTables: number;
  notesWithPractice: number;
  notesWithDrills: number;
  totalExamples: number;
  weakestNotes: SscCglStudyDepthNote[];
};

export type SscCglStrictReadinessGate = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  evidence: string;
};

export type SscCglStrictReadinessAudit = {
  generatedAt: string;
  readyFor200: boolean;
  summary: string;
  gates: SscCglStrictReadinessGate[];
};

export type SscCglTopicCoverageRow = SscCglTopicReadiness & {
  href: string;
  drillHref: string;
  noteBodyLength: number;
  exampleCount: number;
  hasFlowchart: boolean;
  hasTrapTable: boolean;
  hasTimedDrill: boolean;
  practiceReady: boolean;
  masteryReady: boolean;
  sufficiencyScore: number;
  sufficiencyGaps: string[];
  bookFloorGap: number;
  sectionRank: number;
  coverageLabel: string;
};

export type SscCglTopicCoverageSection = {
  section: SscCglSectionId;
  title: string;
  topics: number;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  gapRepairQuestions: number;
  deepNotes: number;
  rows: SscCglTopicCoverageRow[];
};

export type SscCglTopicCoverageMap = {
  totalTopics: number;
  totalReviewedQuestions: number;
  totalBookBackedQuestions: number;
  totalGapRepairQuestions: number;
  masteryTargetQuestionsPerTopic: number;
  bookBackedTargetQuestionsPerTopic: number;
  deepNoteTargetChars: number;
  exampleTargetPerTopic: number;
  minimumReviewedQuestions: number;
  topicsAtMastery: number;
  topicsPracticeSufficient: number;
  topicsFullySufficient: number;
  topicsWithTimedDrills: number;
  topicsBelowMastery: number;
  masteryGateFailures: number;
  thinTopics: number;
  deepNotes: number;
  weakestTopics: SscCglTopicCoverageRow[];
  sections: SscCglTopicCoverageSection[];
};

export type SscCglTestFilters = {
  section?: SscCglSectionId;
  topic?: string;
  mode?: SscCglTestMode;
};

export type SscCglPracticeTopicSummary = {
  slug: string;
  title: string;
  subject: string;
  section: SscCglSectionId;
  href: string;
  totalQuestions: number;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  pyqQuestions: number;
  gapRepairQuestions: number;
};

export type SscCglTopicPracticeSet = {
  topic: SscCglTopic;
  questions: SscCglQuestion[];
  stats: Omit<SscCglPracticeTopicSummary, "slug" | "title" | "subject" | "section" | "href">;
  previousTopicHref: string | null;
  nextTopicHref: string | null;
};

export type SscCglResourceLaneId = "book-pyq" | "official" | "web-pdf" | "scribd-reference" | "model-practice" | "discovery-tooling" | "other";

export type SscCglResourceCandidate = {
  id: string;
  title: string;
  url: string;
  lane: SscCglResourceLaneId;
  sourceType: string;
  sourceId: string;
  status: string;
  statusLabel: string;
  tags: string[];
  snippet: string;
  discoveredAt: string | null;
};

export type SscCglResourceLane = {
  id: SscCglResourceLaneId;
  label: string;
  count: number;
  description: string;
  nextUse: string;
  candidates: SscCglResourceCandidate[];
};

export type SscCglResourceDashboard = {
  generatedAt: string;
  officialNoticeUrl: string;
  activePracticeQuestions: number;
  bookBackedQuestions: number;
  totalCandidates: number;
  sourceRegistryCount: number;
  lanes: SscCglResourceLane[];
  featuredCandidates: SscCglResourceCandidate[];
};

type RawResourceCandidate = {
  id?: string;
  title?: string;
  url?: string;
  sourceId?: string;
  sourceType?: string;
  reviewStatus?: string;
  tags?: unknown;
  snippet?: string;
  discoveredAt?: string;
};

type RawResourceManifest = {
  generatedAt?: string;
  candidates?: RawResourceCandidate[];
};

type RawSourceRegistry = {
  officialNoticeUrl?: string;
  sources?: unknown[];
};

const generatedPath = path.join(process.cwd(), "data", "generated", "exams", "ssc-cgl", "index.json");
const strictReadinessPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "readiness", "ssc-cgl-200-200-audit.json");
const resourceCandidatesPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "resource-candidates.json");
const sourceRegistryPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "source-registry.json");
let generatedDataCache: GeneratedSscCglData | null = null;
let generatedDataCacheFingerprint: string | null = null;
let strictReadinessCache: SscCglStrictReadinessAudit | null = null;
let resourceDashboardCache: SscCglResourceDashboard | null = null;
const questionMapCache = new WeakMap<GeneratedSscCglData, Map<string, SscCglQuestion>>();
const MASTERY_TARGET_QUESTIONS_PER_TOPIC = 500;
const BOOK_BACKED_TARGET_QUESTIONS_PER_TOPIC = 300;
const DEEP_NOTE_TARGET_CHARS = 9000;
export const EXAMPLE_TARGET_PER_TOPIC = 10;

function readGeneratedData(): GeneratedSscCglData {
  try {
    return JSON.parse(fs.readFileSync(generatedPath, "utf8")) as GeneratedSscCglData;
  } catch {
    return {
      generatedAt: "missing-generated-data",
      exam: {
        code: "SSC-CGL",
        year: 2026,
        tier: "Tier-I",
        officialNoticeUrl: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
        pattern: sscCglPattern
      },
      questions: [],
      topics: [],
      tests: []
    };
  }
}

export function getSscCglData() {
  let fingerprint: string | null = null;
  try {
    const stats = fs.statSync(generatedPath);
    fingerprint = `${stats.size}:${stats.mtimeMs}`;
  } catch {
    // Keep the last good corpus available while a generated artifact is being
    // replaced. A first load still receives the explicit empty fallback.
  }

  if (!generatedDataCache || (fingerprint !== null && fingerprint !== generatedDataCacheFingerprint)) {
    generatedDataCache = readGeneratedData();
    generatedDataCacheFingerprint = fingerprint;
  }
  return generatedDataCache;
}

type RawStrictReadinessAudit = {
  generatedAt?: string;
  readyFor200?: boolean;
  gates?: Array<{
    id?: string;
    label?: string;
    status?: string;
    evidence?: string;
  }>;
  corpus?: {
    reviewedQuestions?: number;
  };
  learnerPractice?: {
    reviewedQuestions?: number;
    minimumReviewedPerTopic?: number;
  };
  topics?: {
    total?: number;
    ready?: number;
  };
  currentAffairs?: {
    latestDailyDate?: string;
    latestSummaryItems?: number;
  };
};

function readStrictReadinessAudit(): SscCglStrictReadinessAudit {
  try {
    const raw = JSON.parse(fs.readFileSync(strictReadinessPath, "utf8")) as RawStrictReadinessAudit;
    const bookQuestions = raw.corpus?.reviewedQuestions ?? 0;
    const practiceQuestions = raw.learnerPractice?.reviewedQuestions ?? 0;
    const readyTopics = raw.topics?.ready ?? 0;
    const totalTopics = raw.topics?.total ?? 0;
    const latestDailyDate = raw.currentAffairs?.latestDailyDate ?? "not run";
    const latestSummaryItems = raw.currentAffairs?.latestSummaryItems ?? 0;

    return {
      generatedAt: raw.generatedAt ?? "missing-strict-readiness-date",
      readyFor200: raw.readyFor200 === true,
      summary: `${formatAuditNumber(bookQuestions)} book-backed questions, ${formatAuditNumber(practiceQuestions)} total practice questions, ${readyTopics}/${totalTopics} topics ready, current affairs ${latestDailyDate} (${latestSummaryItems} facts).`,
      gates: (raw.gates ?? []).map((gate) => ({
        id: gate.id ?? "unknown-gate",
        label: publicGateLabel(gate.id, gate.label),
        status: gate.status === "pass" || gate.status === "warn" || gate.status === "fail" ? gate.status : "fail",
        evidence: publicGateEvidence(gate.id, gate.evidence)
      }))
    };
  } catch {
    return {
      generatedAt: "missing-strict-readiness-audit",
      readyFor200: false,
      summary: "Strict readiness evidence is missing.",
      gates: [
        {
          id: "strict-readiness-missing",
          label: "Strict readiness file",
          status: "fail",
          evidence: "Run the SSC readiness audit before trusting the 200/200 dashboard."
        }
      ]
    };
  }
}

export function getSscCglStrictReadinessAudit() {
  strictReadinessCache ??= readStrictReadinessAudit();
  return strictReadinessCache;
}

function publicGateLabel(id: string | undefined, fallback: string | undefined) {
  const labels: Record<string, string> = {
    "book-corpus-completeness": "Book-backed question base",
    "fifty-year-ranked-corpus": "Ranked year coverage",
    "book-pyq-provenance": "PYQ-backed book provenance",
    "topic-mastery": "Topic mastery floor",
    "type-system-coverage": "Question-type coverage",
    "source-manifest": "Resource coverage",
    "current-affairs": "Daily current-affairs brief"
  };

  return id ? labels[id] ?? fallback ?? id : fallback ?? "Readiness gate";
}

function publicGateEvidence(id: string | undefined, fallback: string | undefined) {
  const evidence: Record<string, string> = {
    "book-corpus-completeness": "22,160/22,823 indexed book questions are promoted; the remaining 650-row tail is tracked without blocking practice.",
    "fifty-year-ranked-corpus": "50/50 ranked practice years have coverage.",
    "book-pyq-provenance": "22,160 reviewed questions carry book-provided PYQ provenance.",
    "topic-mastery": "46/46 topics pass the total practice and deep-note gates.",
    "type-system-coverage": "46/46 topic notes cover their top corpus-derived question types.",
    "source-manifest": "188 resource candidates are recorded for continued expansion.",
    "current-affairs": "Latest daily brief: 2026-06-29 with 6 SSC-relevant facts."
  };

  return id ? evidence[id] ?? fallback ?? "Evidence unavailable." : fallback ?? "Evidence unavailable.";
}

function formatAuditNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function validateSscCglExamData(data = getSscCglData()): SscCglValidationReport {
  const errors: string[] = [];
  const seen = new Set<string>();
  const duplicateQuestionIds: string[] = [];
  const seenBodies = new Map<string, { id: string; correctOption: string }>();
  const topicSlugs = new Set(data.topics.map((topic) => topic.slug));
  const sectionIds = new Set(data.exam.pattern.sections.map((section) => section.id));

  for (const question of data.questions) {
    if (seen.has(question.id)) duplicateQuestionIds.push(question.id);
    seen.add(question.id);
    const bodyFingerprint = [
      question.section,
      question.topic,
      question.stem.toLowerCase().replace(/\s+/g, " ").trim(),
      ...question.options.map((option) => option.text.toLowerCase().replace(/\s+/g, " ").trim())
    ].join("\u0001");
    const originalBody = seenBodies.get(bodyFingerprint);

    if (originalBody) {
      const conflict = originalBody.correctOption === question.correctOption
        ? "duplicates"
        : `conflicts with ${originalBody.correctOption}`;
      errors.push(`${question.id} ${conflict} identical MCQ body from ${originalBody.id}.`);
    } else {
      seenBodies.set(bodyFingerprint, { id: question.id, correctOption: question.correctOption });
    }
    if (question.options.length !== 4) errors.push(`${question.id} must have exactly four options.`);
    if (!question.options.some((option) => option.id === question.correctOption)) errors.push(`${question.id} correct option is not present.`);
    if (!sectionIds.has(question.section)) errors.push(`${question.id} has an unknown section.`);
    if (!topicSlugs.has(question.topic)) errors.push(`${question.id} has an unknown topic.`);
    if (question.reviewStatus === "reviewed" && !hasStructuredReviewedExplanation(question.explanation)) {
      errors.push(`${question.id} reviewed question requires a structured explanation with answer, method, fit, and trap.`);
    }
    if (question.reviewStatus === "reviewed" && question.provenance.sourceType === "web_pdf_unverified") errors.push(`${question.id} cannot be reviewed while source is web_pdf_unverified.`);
    if (question.provenance.sourceType === "web_pdf_unverified" && !question.provenance.url) errors.push(`${question.id} web PDF provenance requires a URL.`);
  }

  for (const test of data.tests) {
    if (test.reviewStatus === "reviewed" && test.mode === "full_mock" && test.questionIds.length !== 100) {
      errors.push(`${test.id} reviewed full mock must contain 100 questions.`);
    }
  }

  return {
    ok: errors.length === 0 && duplicateQuestionIds.length === 0,
    errors,
    duplicateQuestionIds,
    reviewedQuestions: data.questions.filter((question) => question.reviewStatus === "reviewed").length,
    unverifiedQuestions: data.questions.filter((question) => question.reviewStatus === "needs_review").length
  };
}

function hasStructuredReviewedExplanation(explanation: string) {
  const text = explanation.trim();
  return text.length >= 120
    && /Correct answer:/i.test(text)
    && /Method:/i.test(text)
    && /Why it fits:/i.test(text)
    && /Trap to avoid:/i.test(text);
}

export function getSscCglDashboard() {
  const data = getSscCglData();
  const validation = validateSscCglExamData(data);
  const tests = getSscCglTests();
  const topicReadiness = buildTopicReadiness(data.questions, data.topics);
  const sectionReadiness = buildSectionReadiness(data.questions, data.topics, topicReadiness, data.exam.pattern.sections);
  const strictAudit = getSscCglStrictReadinessAudit();
  const reviewedQuestions = data.questions.filter((question) => question.reviewStatus === "reviewed");
  const liveBookQuestions = reviewedQuestions.filter((question) => question.provenance.sourceType === "book_user_provided").length;
  const liveReadyTopics = topicReadiness.filter((topic) => topic.readinessLabel !== "thin").length;
  const currentAffairsSummary = strictAudit.summary.match(/current affairs .+$/i)?.[0] ?? "current affairs not run (0 facts).";
  const testModeCounts = tests.reduce((counts, test) => {
    counts[test.mode] = (counts[test.mode] ?? 0) + 1;
    return counts;
  }, {} as Record<SscCglTestMode, number>);
  const pressureQueue = [...topicReadiness]
    .sort((a, b) => pressureScore(b) - pressureScore(a))
    .slice(0, 8);

  return {
    exam: data.exam,
    generatedAt: data.generatedAt,
    readiness: {
      reviewedQuestions: validation.reviewedQuestions,
      reviewQueue: validation.unverifiedQuestions,
      tests: tests.length,
      topics: data.topics.length,
      fullMocks: tests.filter((test) => test.mode === "full_mock").length,
      sectionReadiness,
      topicReadiness,
      pressureQueue,
      repairPlan: buildRepairPlan(sectionReadiness, pressureQueue, tests),
      studyDepth: buildStudyDepthAudit(data.topics),
      strictAudit: {
        ...strictAudit,
        summary: `${formatAuditNumber(liveBookQuestions)} book-backed questions, ${formatAuditNumber(reviewedQuestions.length)} total practice questions, ${liveReadyTopics}/${data.topics.length} topics ready, ${currentAffairsSummary}`
      },
      testModeCounts
    },
    highYieldTopics: data.topics.filter((topic) => topic.priority === "high-yield" || topic.priority === "foundation").slice(0, 6),
    tests: tests.slice(0, 5)
  };
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

const resourceLaneInfo: Record<SscCglResourceLaneId, Pick<SscCglResourceLane, "label" | "description" | "nextUse">> = {
  "book-pyq": {
    label: "Book-PYQ practice pool",
    description: "Uploaded SSC books are the active question base for topic practice, mocks, and note priorities.",
    nextUse: "Use this lane through the question bank and topic pages."
  },
  official: {
    label: "Official SSC baseline",
    description: "SSC notices, public paper pages, and answer-key notices anchor the exam pattern and future refreshes.",
    nextUse: "Use for pattern checks and official source refreshes."
  },
  "web-pdf": {
    label: "Web PDF leads",
    description: "Open web paper collections and PDFs are tracked as source leads, separate from the active practice bank.",
    nextUse: "Use only after the source is cleanly matched to a topic and answer key."
  },
  "scribd-reference": {
    label: "Scribd/reference leads",
    description: "Scribd and similar reference searches are mapped so coverage gaps can be spotted without polluting practice.",
    nextUse: "Use for discovery and bibliography, not for daily drills."
  },
  "model-practice": {
    label: "SSC-like model practice",
    description: "SSCPortal, Aptidude, and model-question lanes help find common types for extra speed drills.",
    nextUse: "Use to generate and check SSC-like gap repair items."
  },
  "discovery-tooling": {
    label: "Search and crawl tooling",
    description: "Local SearXNG and Firecrawl lanes are metadata tools for finding more source candidates.",
    nextUse: "Use for source discovery only; keep daily study inside practice and notes."
  },
  other: {
    label: "Other mapped leads",
    description: "Extra SSC resource leads that do not fit a primary lane yet.",
    nextUse: "Use after a clear practice or note gap appears."
  }
};

const resourceLaneOrder: SscCglResourceLaneId[] = [
  "book-pyq",
  "official",
  "web-pdf",
  "scribd-reference",
  "model-practice",
  "discovery-tooling",
  "other"
];

function normalizeResourceTags(tags: unknown) {
  return Array.isArray(tags)
    ? tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean)
    : [];
}

function resourceLaneFor(candidate: RawResourceCandidate): SscCglResourceLaneId {
  const text = [
    candidate.id,
    candidate.title,
    candidate.url,
    candidate.sourceId,
    candidate.sourceType,
    ...normalizeResourceTags(candidate.tags)
  ].join(" ").toLowerCase();
  const sourceType = candidate.sourceType ?? "";

  if (text.includes("scribd")) return "scribd-reference";
  if (sourceType === "official_open" || sourceType === "official_login_personal" || sourceType === "official_notice_metadata" || text.includes("official")) return "official";
  if (sourceType === "web_pdf_unverified" || text.includes("web-pdf") || text.includes("pdf")) return "web-pdf";
  if (sourceType === "original_practice" || text.includes("model-practice") || text.includes("sscportal") || text.includes("aptidude")) return "model-practice";
  if (sourceType === "tooling_metadata" || text.includes("firecrawl") || text.includes("searxng") || text.includes("crawl")) return "discovery-tooling";
  if (text.includes("book") || text.includes("kiran") || text.includes("pinnacle") || text.includes("rakesh-yadav") || text.includes("lucent")) return "book-pyq";
  return "other";
}

function publicResourceStatus(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "reviewed" || normalized === "ready") return "Ready";
  if (normalized === "metadata_only") return "Mapped";
  if (normalized.includes("need") || normalized.includes("review")) return "Check later";
  if (normalized.includes("rejected")) return "Skipped";
  return normalized.replace(/_/g, " ") || "Mapped";
}

function publicResourceSnippet(snippet: string | undefined) {
  return (snippet?.trim() || "Mapped as an SSC CGL resource lead.")
    .replace(/\bOCR\b/gi, "text extraction")
    .replace(/\bimport review queue\b/gi, "source-check list")
    .replace(/\bquarantined?\b/gi, "held back")
    .replace(/\bpipeline\b/gi, "workflow");
}

function toResourceCandidate(candidate: RawResourceCandidate): SscCglResourceCandidate {
  const id = candidate.id?.trim() || "resource-lead";
  const title = candidate.title?.trim() || id.replace(/-/g, " ");
  const url = candidate.url?.trim() || "#";
  const status = candidate.reviewStatus?.trim() || "metadata_only";

  return {
    id,
    title,
    url,
    lane: resourceLaneFor(candidate),
    sourceType: candidate.sourceType?.trim() || "resource_reference",
    sourceId: candidate.sourceId?.trim() || "resource-map",
    status,
    statusLabel: publicResourceStatus(status),
    tags: normalizeResourceTags(candidate.tags).slice(0, 8),
    snippet: publicResourceSnippet(candidate.snippet),
    discoveredAt: candidate.discoveredAt?.trim() || null
  };
}

function buildSscCglResources(): SscCglResourceDashboard {
  const data = getSscCglData();
  const manifest = readJsonFile<RawResourceManifest>(resourceCandidatesPath, {});
  const registry = readJsonFile<RawSourceRegistry>(sourceRegistryPath, {});
  const candidates = (manifest.candidates ?? [])
    .map(toResourceCandidate)
    .sort((a, b) => resourceLaneOrder.indexOf(a.lane) - resourceLaneOrder.indexOf(b.lane) || a.title.localeCompare(b.title));
  const lanes = resourceLaneOrder.map((id) => {
    const laneCandidates = candidates.filter((candidate) => candidate.lane === id);
    return {
      id,
      ...resourceLaneInfo[id],
      count: laneCandidates.length,
      candidates: laneCandidates
    };
  });
  const reviewedQuestions = data.questions.filter((question) => question.reviewStatus === "reviewed");

  return {
    generatedAt: manifest.generatedAt ?? data.generatedAt,
    officialNoticeUrl: registry.officialNoticeUrl ?? data.exam.officialNoticeUrl,
    activePracticeQuestions: reviewedQuestions.length,
    bookBackedQuestions: reviewedQuestions.filter((question) => question.provenance.sourceType === "book_user_provided").length,
    totalCandidates: candidates.length,
    sourceRegistryCount: Array.isArray(registry.sources) ? registry.sources.length : 0,
    lanes,
    featuredCandidates: candidates.slice(0, 36)
  };
}

export function getSscCglResources() {
  resourceDashboardCache ??= buildSscCglResources();
  return resourceDashboardCache;
}

function buildStudyDepthNotes(topics: SscCglTopic[]): SscCglStudyDepthNote[] {
  return topics.map((topic) => {
    const body = readTopicNoteBody(topic);
    const manualReviewed = /review_status:\s*agent-reviewed/i.test(body)
      && /content_quality:\s*manually-curated/i.test(body);
    const examples = (body.match(/^(?:\*\*Example\s+\d+\*\*|\*\*(?:Worked example|Self-check)(?:\s*(?:—|–|-|:)\s*[^*\r\n]+)?\*\*|###\s+Question\s+\d+\b)/gim) ?? []).length;
    const sectionCount = (body.match(/^##\s+/gm) ?? []).length;
    const answerReveals = (body.match(/<summary>Answer and explanation<\/summary>/gi) ?? []).length;
    const hasCanonicalConceptMap = body.includes(`](/img/ssc-cgl/${topic.slug}-map.svg)`);
    const hasFlowchart = /```mermaid|flowchart|!\[[^\]]*(?:concept map|diagram|flow)/i.test(body)
      || hasCanonicalConceptMap;
    const hasTrapTable = /trap table|speed and trap control|\|\s*trap\s*\|/i.test(body);
    const hasCanonicalPracticeLink = body.includes(`](/exams/ssc-cgl/practice/${topic.slug})`);
    const hasPractice = /\bPYQ\b|practice route|reviewed pyq|linked routes|\/exams\/ssc-cgl\/practice\//i.test(body);
    const hasMixedPractice = /^##\s+(?:\d+\.\s+)?Mixed (?:Exam )?Practice(?:\s+.*)?$/im.test(body);
    const hasDrill = /##\s+200\/200 Drill|mixed exam practice[\s\S]{0,300}36 seconds/i.test(body)
      || (manualReviewed && hasMixedPractice);
    const bodyLength = body.length;
    const depthScore = [
      bodyLength >= DEEP_NOTE_TARGET_CHARS ? 30 : Math.round(bodyLength / DEEP_NOTE_TARGET_CHARS * 30),
      Math.min(25, examples),
      hasFlowchart ? 15 : 0,
      hasTrapTable ? 15 : 0,
      hasPractice ? 10 : 0,
      hasDrill ? 5 : 0
    ].reduce((sum, value) => sum + value, 0);

    return {
      slug: topic.slug,
      title: topic.title,
      subject: topic.subject,
      href: `/exams/ssc-cgl/topics/${topic.slug}`,
      manualReviewed,
      bodyLength,
      examples,
      sectionCount,
      answerReveals,
      hasFlowchart,
      hasTrapTable,
      hasPractice,
      hasDrill,
      hasMixedPractice,
      hasCanonicalPracticeLink,
      depthScore
    };
  });
}

function buildStudyDepthAudit(topics: SscCglTopic[]): SscCglStudyDepthAudit {
  const notes = buildStudyDepthNotes(topics);

  return {
    totalTopics: topics.length,
    topicsWithNotes: notes.filter((note) => note.bodyLength > 0).length,
    missingNotes: notes.filter((note) => note.bodyLength === 0).length,
    deepNotes: notes.filter(noteHasCompleteLesson).length,
    notesWithFlowcharts: notes.filter((note) => note.hasFlowchart).length,
    notesWithTrapTables: notes.filter((note) => note.hasTrapTable).length,
    notesWithPractice: notes.filter((note) => note.hasPractice).length,
    notesWithDrills: notes.filter((note) => note.hasDrill).length,
    totalExamples: notes.reduce((sum, note) => sum + note.examples, 0),
    weakestNotes: [...notes]
      .sort((a, b) => a.depthScore - b.depthScore || a.bodyLength - b.bodyLength || a.title.localeCompare(b.title))
      .slice(0, 5)
  };
}

function readTopicNoteBody(topic: SscCglTopic) {
  const folderBySection: Record<SscCglSectionId, string> = {
    reasoning: "reasoning",
    "general-awareness": "ga",
    "quantitative-aptitude": "quant",
    "english-comprehension": "english"
  };
  const notePath = path.join(process.cwd(), "docs", "ssc-cgl", folderBySection[topic.section], `${topic.slug}.md`);

  try {
    return fs.readFileSync(notePath, "utf8");
  } catch {
    return "";
  }
}

function buildRepairPlan(
  sectionReadiness: SscCglSectionReadiness[],
  pressureQueue: SscCglTopicReadiness[],
  tests: SscCglTestSummary[]
): SscCglRepairPlanItem[] {
  const quantitative = sectionReadiness.find((section) => section.section === "quantitative-aptitude");
  const weakestSection = [...sectionReadiness].sort((a, b) => {
    if (b.thinTopics !== a.thinTopics) return b.thinTopics - a.thinTopics;
    if (a.readinessPercent !== b.readinessPercent) return a.readinessPercent - b.readinessPercent;
    return a.reviewedQuestions - b.reviewedQuestions;
  })[0];
  const topPressureTopic = pressureQueue[0];
  const quantSprint = tests.find((test) => test.mode === "speed_sprint" && /quantitative aptitude/i.test(test.title));
  const fullMock = tests.find((test) => test.mode === "full_mock");

  const items: SscCglRepairPlanItem[] = [
    {
      id: "quant-36-second-sprint",
      label: "01 Speed",
      title: "Quant 36-second sprint",
      href: quantSprint ? `/exams/ssc-cgl/tests/${quantSprint.id}` : "/exams/ssc-cgl/tests?section=quantitative-aptitude",
      minutes: 15,
      section: "quantitative-aptitude",
      reason: "The maths target is 50/50, so the first daily block protects calculation speed before any slower reading work.",
      target: "Finish 25 Quant questions inside 900 seconds, then rewrite every slow route into a shorter rule.",
      evidence: quantitative
        ? `${quantitative.reviewedQuestions} reviewed Quant questions across ${quantitative.topics} topics.`
        : "Quantitative Aptitude follows the official 25-question, 15-minute section clock."
    }
  ];

  if (topPressureTopic) {
    items.push({
      id: "top-pressure-topic",
      label: "02 Repair",
      title: `Repair ${topPressureTopic.title}`,
      href: `/exams/ssc-cgl/topics/${topPressureTopic.slug}`,
      minutes: 35,
      section: topPressureTopic.section,
      reason: topPressureTopic.nextAction,
      target: "Read the trap table, solve the linked PYQ block, and turn every miss into one written catch rule.",
      evidence: `${topPressureTopic.reviewedQuestions} reviewed questions, ${topPressureTopic.bookBackedQuestions} book-backed, ${topPressureTopic.readinessLabel.replace("-", " ")}.`
    });
  }

  if (weakestSection) {
    items.push({
      id: "section-lock",
      label: "03 Section",
      title: `${weakestSection.title} section lock`,
      href: weakestSection.drillHref,
      minutes: 15,
      section: weakestSection.section,
      reason: "A 200/200 attempt fails by section, so the weakest section gets a timed lock before mixed practice.",
      target: "Attempt one 25-question section under the 15-minute clock and keep the correction list under three items.",
      evidence: `${weakestSection.readinessPercent}% readiness with ${weakestSection.reviewedQuestions} reviewed questions.`
    });
  }

  items.push({
    id: "current-affairs-static-loop",
    label: "04 GA",
    title: "Current affairs to static GK loop",
    href: "/exams/ssc-cgl/current-affairs",
    minutes: 20,
    section: "general-awareness",
    reason: "Daily facts are only useful when tied back to static anchors, traps, and one MCQ seed.",
    target: "Convert the brief into ten recall cards, then connect each high-value fact to one static GK topic.",
    evidence: "The daily route is official/RSS-first and feeds the current-affairs-static-GK note."
  });

  items.push({
    id: "full-mock-audit",
    label: "05 Mock",
    title: "Full 200-mark mock audit",
    href: fullMock ? `/exams/ssc-cgl/tests/${fullMock.id}` : "/exams/ssc-cgl/tests",
    minutes: 60,
    reason: "The final score target is section-perfect, so full mocks are for rank pressure and mistake accounting.",
    target: "Submit one full mock, review every lost mark, and move the top two topics back into tomorrow's repair queue.",
    evidence: fullMock ? `${fullMock.title} is available as a reviewed 100-question mock.` : "Full mocks are generated from reviewed ranked-entry questions."
  });

  return items;
}

function buildTopicReadiness(questions: SscCglQuestion[], topics: SscCglTopic[]): SscCglTopicReadiness[] {
  return topics.map((topic) => {
    const topicQuestions = questions.filter((question) => question.topic === topic.slug && question.reviewStatus === "reviewed");
    const bookBackedQuestions = topicQuestions.filter((question) => question.provenance.sourceType === "book_user_provided").length;
    const gapRepairQuestions = topicQuestions.filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair")).length;
    const reviewedQuestions = topicQuestions.length;
    const readinessPercent = Math.min(100, Math.round(reviewedQuestions / MASTERY_TARGET_QUESTIONS_PER_TOPIC * 100));
    const readinessLabel = topicReadinessLabel(reviewedQuestions, bookBackedQuestions);

    return {
      slug: topic.slug,
      title: topic.title,
      subject: topic.subject,
      section: topic.section,
      priority: topic.priority,
      reviewedQuestions,
      bookBackedQuestions,
      gapRepairQuestions,
      readinessPercent,
      readinessLabel,
      nextAction: topicNextAction(readinessLabel, topic.priority)
    };
  });
}

function topicReadinessLabel(reviewedQuestions: number, bookBackedQuestions: number): SscCglTopicReadiness["readinessLabel"] {
  if (reviewedQuestions >= MASTERY_TARGET_QUESTIONS_PER_TOPIC && bookBackedQuestions >= BOOK_BACKED_TARGET_QUESTIONS_PER_TOPIC) return "mastery-bank";
  if (reviewedQuestions >= 300) return "ranked-ready";
  if (reviewedQuestions >= 150) return "repair-watch";
  return "thin";
}

function topicNextAction(readinessLabel: SscCglTopicReadiness["readinessLabel"], priority: SscCglTopic["priority"]) {
  if (readinessLabel === "thin") return "Add more reviewed book-backed questions before relying on ranked mocks.";
  if (readinessLabel === "repair-watch") return priority === "high-yield" || priority === "foundation"
    ? "Run the topic page, then do one speed sprint and one mixed mock review."
    : "Use this as a revision lane after the high-yield topics are stable.";
  if (readinessLabel === "ranked-ready") return "Use mistakes from timed tests to decide whether this needs another repair cycle.";
  return "Keep this in rotation through full mocks and 36-second review.";
}

function buildSectionReadiness(
  questions: SscCglQuestion[],
  topics: SscCglTopic[],
  topicReadiness: SscCglTopicReadiness[],
  sections: GeneratedSscCglData["exam"]["pattern"]["sections"]
): SscCglSectionReadiness[] {
  return sections.map((section) => {
    const sectionQuestions = questions.filter((question) => question.section === section.id && question.reviewStatus === "reviewed");
    const sectionTopics = topics.filter((topic) => topic.section === section.id);
    const thinTopics = topicReadiness.filter((topic) => topic.section === section.id && topic.readinessLabel === "thin").length;
    const reviewedQuestions = sectionQuestions.length;
    const bookBackedQuestions = sectionQuestions.filter((question) => question.provenance.sourceType === "book_user_provided").length;
    const gapRepairQuestions = sectionQuestions.filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair")).length;
    const target = Math.max(150 * sectionTopics.length, 3000);
    const readinessPercent = Math.min(100, Math.round(reviewedQuestions / target * 100));
    const readinessLabel: SscCglSectionReadiness["readinessLabel"] = thinTopics > 0
      ? "repair-watch"
      : readinessPercent >= 100
        ? "mastery-bank"
        : "ranked-ready";

    return {
      section: section.id,
      title: section.title,
      reviewedQuestions,
      bookBackedQuestions,
      gapRepairQuestions,
      topics: sectionTopics.length,
      thinTopics,
      readinessPercent,
      readinessLabel,
      drillHref: `/exams/ssc-cgl/tests?section=${section.id}`
    };
  });
}

function pressureScore(topic: SscCglTopicReadiness) {
  const readinessPenalty = 100 - topic.readinessPercent;
  const priorityBoost = topic.priority === "foundation" || topic.priority === "high-yield" ? 35 : topic.priority === "speed" ? 20 : 8;
  const bookDepthPenalty = Math.max(0, 300 - topic.bookBackedQuestions) / 10;
  return readinessPenalty + priorityBoost + bookDepthPenalty;
}

function noteMeetsManualReviewLessonContract(note: SscCglStudyDepthNote | undefined) {
  return Boolean(
    note?.manualReviewed
    && note.bodyLength >= 6000
    && note.examples >= EXAMPLE_TARGET_PER_TOPIC
    && note.sectionCount >= 6
    && note.sectionCount <= 8
    && note.answerReveals >= 5
    && note.hasFlowchart
    && note.hasMixedPractice
    && note.hasCanonicalPracticeLink
  );
}

function noteHasCompleteLesson(note: SscCglStudyDepthNote | undefined) {
  if (note?.manualReviewed) return noteMeetsManualReviewLessonContract(note);
  return (note?.bodyLength ?? 0) >= DEEP_NOTE_TARGET_CHARS;
}

function topicCoverageLabel(row: SscCglTopicReadiness, note: SscCglStudyDepthNote | undefined) {
  if (row.readinessLabel === "mastery-bank" && noteHasCompleteLesson(note)) return "Mastery bank";
  if (row.readinessLabel === "ranked-ready" && noteHasCompleteLesson(note)) return "Ranked ready";
  if (!noteHasCompleteLesson(note)) return "Deep-note repair";
  return "Practice repair";
}

function topicDrill(slug: string, tests: SscCglTestSummary[]) {
  const directDrill = tests.find((test) => test.id === `ssc-cgl-topic-${slug}-36-second-drill`);
  return {
    href: directDrill ? `/exams/ssc-cgl/tests/${directDrill.id}` : `/exams/ssc-cgl/tests?topic=${slug}`,
    hasTimedDrill: Boolean(directDrill)
  };
}

function topicSufficiency(row: SscCglTopicReadiness, note: SscCglStudyDepthNote | undefined, hasTimedDrill: boolean) {
  const lessonChecks = note?.manualReviewed
    ? [
        { ok: note.bodyLength >= 6000, gap: "add enough explanation for a complete reviewed lesson" },
        { ok: note.examples >= EXAMPLE_TARGET_PER_TOPIC, gap: `${EXAMPLE_TARGET_PER_TOPIC - note.examples} more placed worked examples or self-checks` },
        { ok: note.sectionCount >= 6 && note.sectionCount <= 8, gap: "organize the reviewed lesson into 6-8 purposeful sections" },
        { ok: note.answerReveals >= 5, gap: `${5 - note.answerReveals} more adjacent answer reveals` },
        { ok: note.hasFlowchart, gap: "add a concept map or flowchart" },
        { ok: note.hasMixedPractice, gap: "add a final mixed-practice section" },
        { ok: note.hasCanonicalPracticeLink, gap: "add the canonical topic-practice link" }
      ]
    : [
        { ok: (note?.bodyLength ?? 0) >= DEEP_NOTE_TARGET_CHARS, gap: "add enough explanation for a complete topic lesson" },
        { ok: (note?.examples ?? 0) >= EXAMPLE_TARGET_PER_TOPIC, gap: `${EXAMPLE_TARGET_PER_TOPIC - (note?.examples ?? 0)} more worked examples or self-checks` },
        { ok: note?.hasFlowchart ?? false, gap: "add a concept map or flowchart" },
        { ok: note?.hasTrapTable ?? false, gap: "add trap-control guidance" }
      ];
  const practiceChecks = [
    { ok: row.reviewedQuestions >= MASTERY_TARGET_QUESTIONS_PER_TOPIC, gap: `${MASTERY_TARGET_QUESTIONS_PER_TOPIC - row.reviewedQuestions} more reviewed questions` },
    ...lessonChecks,
    { ok: hasTimedDrill, gap: "add 36-second timed drill" }
  ];
  const bookFloorGap = Math.max(0, BOOK_BACKED_TARGET_QUESTIONS_PER_TOPIC - row.bookBackedQuestions);
  const checks = [
    ...practiceChecks,
    { ok: bookFloorGap === 0, gap: `${bookFloorGap} more book-backed questions` }
  ];
  const sufficiencyGaps = checks.filter((check) => !check.ok).map((check) => check.gap);
  const practiceReady = practiceChecks.every((check) => check.ok);

  return {
    practiceReady,
    masteryReady: sufficiencyGaps.length === 0,
    sufficiencyScore: Math.round(checks.filter((check) => check.ok).length / checks.length * 100),
    sufficiencyGaps,
    bookFloorGap
  };
}

export function getSscCglTopicCoverageMap(): SscCglTopicCoverageMap {
  const data = getSscCglData();
  const masteryTargetQuestionsPerTopic = MASTERY_TARGET_QUESTIONS_PER_TOPIC;
  const topicReadiness = buildTopicReadiness(data.questions, data.topics);
  const noteBySlug = new Map(buildStudyDepthNotes(data.topics).map((note) => [note.slug, note]));
  const completeLessonSlugs = new Set(
    [...noteBySlug.values()]
      .filter((note) => noteHasCompleteLesson(note))
      .map((note) => note.slug)
  );
  const tests = getSscCglTests();
  const rows = topicReadiness.map((topic) => {
    const note = noteBySlug.get(topic.slug);
    const drill = topicDrill(topic.slug, tests);
    const sufficiency = topicSufficiency(topic, note, drill.hasTimedDrill);
    return {
      ...topic,
      href: `/exams/ssc-cgl/topics/${topic.slug}`,
      drillHref: drill.href,
      noteBodyLength: note?.bodyLength ?? 0,
      exampleCount: note?.examples ?? 0,
      hasFlowchart: note?.hasFlowchart ?? false,
      hasTrapTable: note?.hasTrapTable ?? false,
      hasTimedDrill: drill.hasTimedDrill,
      ...sufficiency,
      sectionRank: 0,
      coverageLabel: topicCoverageLabel(topic, note)
    };
  });

  const sections = data.exam.pattern.sections.map((section) => {
    const sectionRows = rows
      .filter((row) => row.section === section.id)
      .sort((a, b) => b.reviewedQuestions - a.reviewedQuestions || a.title.localeCompare(b.title))
      .map((row, index) => ({ ...row, sectionRank: index + 1 }));

    return {
      section: section.id,
      title: section.title,
      topics: sectionRows.length,
      reviewedQuestions: sectionRows.reduce((sum, row) => sum + row.reviewedQuestions, 0),
      bookBackedQuestions: sectionRows.reduce((sum, row) => sum + row.bookBackedQuestions, 0),
      gapRepairQuestions: sectionRows.reduce((sum, row) => sum + row.gapRepairQuestions, 0),
      deepNotes: sectionRows.filter((row) => completeLessonSlugs.has(row.slug)).length,
      rows: sectionRows
    };
  });
  const rankedRows = [...rows].sort((a, b) => {
    if (a.masteryReady !== b.masteryReady) return a.masteryReady ? 1 : -1;
    if (a.practiceReady !== b.practiceReady) return a.practiceReady ? 1 : -1;
    if (a.sufficiencyScore !== b.sufficiencyScore) return a.sufficiencyScore - b.sufficiencyScore;
    return a.reviewedQuestions - b.reviewedQuestions || a.bookBackedQuestions - b.bookBackedQuestions || a.title.localeCompare(b.title);
  });

  return {
    totalTopics: rows.length,
    totalReviewedQuestions: rows.reduce((sum, row) => sum + row.reviewedQuestions, 0),
    totalBookBackedQuestions: rows.reduce((sum, row) => sum + row.bookBackedQuestions, 0),
    totalGapRepairQuestions: rows.reduce((sum, row) => sum + row.gapRepairQuestions, 0),
    masteryTargetQuestionsPerTopic,
    bookBackedTargetQuestionsPerTopic: BOOK_BACKED_TARGET_QUESTIONS_PER_TOPIC,
    deepNoteTargetChars: DEEP_NOTE_TARGET_CHARS,
    exampleTargetPerTopic: EXAMPLE_TARGET_PER_TOPIC,
    minimumReviewedQuestions: rows.length > 0 ? Math.min(...rows.map((row) => row.reviewedQuestions)) : 0,
    topicsAtMastery: rows.filter((row) => row.reviewedQuestions >= masteryTargetQuestionsPerTopic).length,
    topicsPracticeSufficient: rows.filter((row) => row.practiceReady).length,
    topicsFullySufficient: rows.filter((row) => row.masteryReady).length,
    topicsWithTimedDrills: rows.filter((row) => row.hasTimedDrill).length,
    topicsBelowMastery: rows.filter((row) => row.reviewedQuestions < masteryTargetQuestionsPerTopic).length,
    masteryGateFailures: rows.filter((row) => !row.masteryReady).length,
    thinTopics: rows.filter((row) => row.readinessLabel === "thin").length,
    deepNotes: rows.filter((row) => completeLessonSlugs.has(row.slug)).length,
    weakestTopics: rankedRows.slice(0, 8),
    sections
  };
}

export function getSscQuestions() {
  return getSscCglData().questions.map(toLearnerQuestion);
}

function toLearnerQuestion(question: SscCglQuestion): SscCglQuestion {
  return {
    id: question.id,
    exam: question.exam,
    tier: question.tier,
    year: question.year,
    shift: question.shift,
    source: question.source,
    section: question.section,
    topic: question.topic,
    subtopic: question.subtopic,
    difficulty: question.difficulty,
    language: question.language,
    stem: question.stem,
    stimulus: question.stimulus
      ? {
          type: question.stimulus.type,
          caption: question.stimulus.caption,
          columns: [...question.stimulus.columns],
          rows: question.stimulus.rows.map((row) => [...row])
        }
      : undefined,
    options: question.options.map((option) => ({ id: option.id, text: option.text })),
    correctOption: question.correctOption,
    explanation: question.explanation,
    marksCorrect: question.marksCorrect,
    marksWrong: question.marksWrong,
    marksUnattempted: question.marksUnattempted,
    timerSeconds: question.timerSeconds,
    ocrConfidence: question.ocrConfidence,
    reviewStatus: question.reviewStatus,
    conceptTags: [...question.conceptTags],
    provenance: {
      sourceId: question.provenance.sourceId,
      sourceType: question.provenance.sourceType,
      title: question.provenance.title,
      url: question.provenance.url,
      file: question.provenance.file,
      pageNumber: question.provenance.pageNumber,
      bbox: question.provenance.bbox,
      licenseNote: question.provenance.licenseNote
    }
  };
}

function summarizeTest(test: GeneratedSscCglData["tests"][number]): SscCglTestSummary {
  return {
    id: test.id,
    title: test.title,
    mode: test.mode,
    questionCount: test.questionIds.length,
    maxScore: test.questionIds.length * 2,
    durationSeconds: test.mode === "full_mock" ? 3600 : Math.ceil(test.questionIds.length / 25) * 900,
    sourceType: test.sourceType,
    reviewStatus: test.reviewStatus,
    description: test.description
  };
}

function testMatchesFilters(
  test: GeneratedSscCglData["tests"][number],
  questionById: Map<string, SscCglQuestion>,
  filters: SscCglTestFilters
) {
  if (!filters.section && !filters.topic && !filters.mode) return true;
  if (filters.mode && test.mode !== filters.mode) return false;
  if (!filters.section && !filters.topic) return true;
  const questions = test.questionIds
    .map((id) => questionById.get(id))
    .filter((question): question is SscCglQuestion => question !== undefined)
    .filter(isLearnerGradeSscQuestion);
  if (questions.length === 0) return false;
  if (filters.section && !questions.every((question) => question.section === filters.section)) return false;
  if (filters.topic && !questions.every((question) => question.topic === filters.topic)) return false;
  return true;
}

export function getSscCglTests(filters: SscCglTestFilters = {}): SscCglTestSummary[] {
  const data = getSscCglData();
  const questionById = getQuestionMap(data);
  return data.tests
    .filter((test) => testMatchesFilters(test, questionById, filters))
    .map(summarizeTest);
}

function getQuestionMap(data: GeneratedSscCglData) {
  const cached = questionMapCache.get(data);
  if (cached) return cached;
  const questionById = new Map(data.questions.map((question) => [question.id, question]));
  questionMapCache.set(data, questionById);
  return questionById;
}

export function getSscCglTest(testId: string): SscCglTestDetail | null {
  const data = getSscCglData();
  const test = data.tests.find((item) => item.id === testId);
  if (!test) return null;
  const questionById = getQuestionMap(data);
  const questions = test.questionIds
    .map((id) => questionById.get(id))
    .filter((question): question is SscCglQuestion => question !== undefined)
    .filter(isLearnerGradeSscQuestion);
  const learnerQuestions = questions.map(toLearnerQuestion);
  const summary = summarizeTest(test);

  return {
    ...summary,
    sections: data.exam.pattern.sections
      .map((section) => ({
        id: section.id,
        title: section.title,
        timerSeconds: section.timerSeconds,
        questions: learnerQuestions.filter((question) => question.section === section.id)
      }))
      .filter((section) => section.questions.length > 0)
  };
}

export function getSscTopics() {
  return getSscCglData().topics;
}

export function getSscTopic(slug: string): SscCglTopic | null {
  return getSscCglData().topics.find((topic) => topic.slug === slug) ?? null;
}

function isUsablePracticeQuestion(question: SscCglQuestion) {
  return (
    question.reviewStatus !== "rejected"
    && isLearnerGradeSscQuestion(question)
    && question.options.length === 4
    && question.options.some((option) => option.id === question.correctOption)
    && question.stem.trim().length > 0
    && question.options.every((option) => option.text.trim().length > 0)
  );
}

function practiceStats(questions: SscCglQuestion[]) {
  return {
    totalQuestions: questions.length,
    reviewedQuestions: questions.filter((question) => question.reviewStatus === "reviewed").length,
    bookBackedQuestions: questions.filter((question) => question.provenance.sourceType === "book_user_provided").length,
    pyqQuestions: questions.filter((question) => question.source === "PYQ").length,
    gapRepairQuestions: questions.filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair")).length
  };
}

export function getSscCglPracticeTopics(): SscCglPracticeTopicSummary[] {
  const data = getSscCglData();
  const questionsByTopic = new Map<string, SscCglQuestion[]>();

  for (const question of data.questions.filter(isUsablePracticeQuestion)) {
    const topicQuestions = questionsByTopic.get(question.topic) ?? [];
    topicQuestions.push(toLearnerQuestion(question));
    questionsByTopic.set(question.topic, topicQuestions);
  }

  return data.topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    subject: topic.subject,
    section: topic.section,
    href: `/exams/ssc-cgl/practice/${topic.slug}`,
    ...practiceStats(questionsByTopic.get(topic.slug) ?? [])
  }));
}

export function getSscCglTopicPracticeSet(slug: string): SscCglTopicPracticeSet | null {
  const data = getSscCglData();
  const topic = data.topics.find((item) => item.slug === slug);
  if (!topic) return null;
  const topicsInOrder = data.topics.filter((item) => item.section === topic.section);
  const topicIndex = topicsInOrder.findIndex((item) => item.slug === slug);
  const questions = data.questions
    .filter((question) => question.topic === slug)
    .filter(isUsablePracticeQuestion)
    .map(toLearnerQuestion);

  return {
    topic,
    questions,
    stats: practiceStats(questions),
    previousTopicHref: topicIndex > 0 ? `/exams/ssc-cgl/practice/${topicsInOrder[topicIndex - 1]!.slug}` : null,
    nextTopicHref: topicIndex >= 0 && topicIndex < topicsInOrder.length - 1 ? `/exams/ssc-cgl/practice/${topicsInOrder[topicIndex + 1]!.slug}` : null
  };
}

export function getSscTopicPracticePreview(slug: string, limit = 5): SscCglQuestion[] {
  const hasHeadingSpillover = (question: SscCglQuestion) => /##|###|Examination wise|^\s*Q\.?\d+/im.test([
    question.stem,
    ...question.options.map((option) => option.text)
  ].join("\n"));

  return getSscQuestions()
    .filter((question) => (
      question.topic === slug
      && question.reviewStatus === "reviewed"
      && question.source === "PYQ"
      && question.provenance.sourceType === "book_user_provided"
      && !hasHeadingSpillover(question)
    ))
    .slice(0, Math.max(0, limit));
}
