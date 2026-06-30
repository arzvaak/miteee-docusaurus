export type SscCglSectionId = "reasoning" | "general-awareness" | "quantitative-aptitude" | "english-comprehension";

export type SscCglSourceType =
  | "official_open"
  | "official_login_personal"
  | "user_provided"
  | "book_user_provided"
  | "web_pdf_unverified"
  | "original_practice";

export type SscCglReviewStatus = "reviewed" | "needs_review" | "rejected";

export type SscCglOptionId = "a" | "b" | "c" | "d";

export type SscCglOption = {
  id: SscCglOptionId;
  text: string;
};

export type SscCglProvenance = {
  sourceId: string;
  sourceType: SscCglSourceType;
  title: string;
  url?: string;
  file?: string;
  pageNumber?: number;
  bbox?: [number, number, number, number];
  licenseNote: string;
};

export type SscCglQuestion = {
  id: string;
  exam: "SSC-CGL";
  tier: "Tier-I";
  year: number;
  shift: string;
  source: "PYQ" | "Original practice" | "Imported PDF";
  section: SscCglSectionId;
  topic: string;
  subtopic: string;
  difficulty: "easy" | "medium" | "hard";
  language: "en" | "hi" | "bilingual";
  stem: string;
  options: SscCglOption[];
  correctOption: SscCglOptionId;
  explanation: string;
  marksCorrect: 2;
  marksWrong: -0.5;
  marksUnattempted: 0;
  timerSeconds: 900;
  ocrConfidence: number;
  reviewStatus: SscCglReviewStatus;
  conceptTags: string[];
  provenance: SscCglProvenance;
};

export type SscCglTopic = {
  slug: string;
  title: string;
  subject: string;
  section: SscCglSectionId;
  priority: "foundation" | "high-yield" | "speed" | "revision";
  study: {
    summary: string;
    sections: Array<{ title: string; body: string }>;
    formulaTable: Array<{ cue: string; rule: string; trap: string }>;
    flowchart: string;
  };
  practice: {
    questionIds: string[];
    pyqQuestionIds: string[];
    bookQuestionIds: string[];
    gapRepairQuestionIds: string[];
    sourceBreakdown: {
      bookUserProvided: number;
      originalPractice: number;
      otherReviewed: number;
    };
    drillPrompt: string;
  };
};

export type SscCglExamPattern = {
  totalQuestions: 100;
  totalMarks: 200;
  negativeMarks: -0.5;
  sections: Array<{
    id: SscCglSectionId;
    title: string;
    questionCount: 25;
    marks: 50;
    timerSeconds: 900;
    scribeTimerSeconds: 1200;
  }>;
};

export type SscCglTestMode = "full_mock" | "pyq_shift" | "topic_drill" | "weak_topic" | "speed_sprint";

export type SscCglTestSummary = {
  id: string;
  title: string;
  mode: SscCglTestMode;
  questionCount: number;
  maxScore: number;
  durationSeconds: number;
  sourceType: SscCglSourceType | "mixed_reviewed";
  reviewStatus: SscCglReviewStatus;
  description: string;
};

export type SscCglTestSection = {
  id: SscCglSectionId;
  title: string;
  timerSeconds: number;
  questions: SscCglQuestion[];
};

export type SscCglTestDetail = SscCglTestSummary & {
  sections: SscCglTestSection[];
};

export type SscCglAttemptInput = {
  attemptId: string;
  startedAt: string;
  submittedAt: string;
  answers: Record<string, SscCglOptionId | "z" | null | undefined>;
  sectionTimeSpentSeconds: Record<string, number>;
};

export type SscCglSectionResult = {
  sectionId: SscCglSectionId;
  title: string;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  timeSpentSeconds: number;
  targetScore: number;
  marksLost: number;
  attempted: number;
  accuracy: number;
  targetSecondsPerQuestion: number;
  averageSecondsPerQuestion: number;
  paceDeltaSecondsPerQuestion: number;
  pacingStatus: "on-pace" | "slow" | "rushed" | "no-timing";
  targetStatus: "perfect" | "repair-marks" | "repair-speed" | "repair-both";
  recommendedAction: string;
};

export type SscCglWeakTopic = {
  slug: string;
  title: string;
  misses: number;
  section: SscCglSectionId;
};

export type SscCglRepairQueueItem = {
  slug: string;
  title: string;
  section: SscCglSectionId;
  wrong: number;
  unattempted: number;
  totalRepair: number;
  href: string;
  recommendedAction: string;
};

export type SscCglAttemptResult = {
  attemptId: string;
  testId: string;
  score: number;
  maxScore: number;
  marksLost: number;
  scoreGapTo200: number;
  correct: number;
  wrong: number;
  unattempted: number;
  accuracy: number;
  totalTimeSeconds: number;
  targetSecondsPerQuestion: number;
  averageSecondsPerQuestion: number;
  pacingStatus: "on-pace" | "slow" | "rushed" | "no-timing";
  nextBestAction: string;
  sectionResults: SscCglSectionResult[];
  weakTopics: SscCglWeakTopic[];
  repairQueue: SscCglRepairQueueItem[];
  rank: SscCglRankSnapshot;
};

export type SscCglRankSnapshot = {
  percentile: number;
  rankBucket: string;
  basis: string;
};

export type CurrentAffairsRawItem = {
  title: string;
  source: string;
  url: string;
  published_at?: string;
  publishedAt?: string;
  fetched_at?: string;
  raw_excerpt?: string;
  rawExcerpt?: string;
  raw_body?: string;
  tags?: string[];
};

export type CurrentAffairsItem = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  fetchedAt?: string;
  rawExcerpt: string;
  tags: string[];
};

export type CurrentAffairsSummaryItem = {
  title: string;
  source: string;
  url: string;
  published_at: string;
  source_excerpt?: string;
  ssc_relevance: "high" | "medium" | "low";
  upsc_cse_relevance?: "high" | "medium" | "low";
  exam_areas: string[];
  key_points: string[];
  why_it_matters_for_ssc_cgl: string;
  why_it_matters_for_upsc_cse?: string;
  static_context?: string;
  prelims_facts?: string[];
  mains_angles?: string[];
  memory_hook: string;
  mcq_seed: {
    question: string;
    answer: string;
    trap: string;
  };
};

export type CurrentAffairsBrief = {
  date: string;
  status: "ready" | "missing" | "failed";
  generatedAt: string | null;
  items: CurrentAffairsSummaryItem[];
  calendar?: {
    as_of?: string;
    today?: CurrentAffairsCalendarDigest | null;
    yesterday?: CurrentAffairsCalendarDigest | null;
    as_they_come?: CurrentAffairsTimelineEvent[];
    last_7_days?: CurrentAffairsCalendarDigest[];
    last_30_days?: CurrentAffairsCalendarDigest[];
    weekly_by_day?: CurrentAffairsCalendarDigest[];
    monthly_by_day?: CurrentAffairsCalendarDigest[];
    weekly_calendar?: CurrentAffairsCalendarDigest[];
    monthly_calendar?: CurrentAffairsCalendarDigest[];
    week_total_items?: number;
    week_high_yield?: number;
    month_total_items?: number;
    month_high_yield?: number;
  };
};

export type CurrentAffairsCalendarDigest = {
  date: string;
  items: number;
  high_yield: number;
  sources?: string[];
  exam_areas: string[];
  headlines: string[];
  events?: CurrentAffairsTimelineEvent[];
};

export type CurrentAffairsTimelineEvent = {
  title: string;
  source: string;
  url: string;
  published_at: string;
  ssc_relevance: "high" | "medium" | "low";
  upsc_cse_relevance?: "high" | "medium" | "low";
  exam_areas: string[];
  brief: string;
};

export type CurrentAffairsRecallCard = {
  id: string;
  date: string;
  title: string;
  source: string;
  url: string;
  examAreas: string[];
  prompt: string;
  answer: string;
  trap: string;
  memoryHook: string;
  priority: "high" | "medium" | "low";
};

export type CurrentAffairsStaticAnchor = {
  topicSlug: string;
  label: string;
  href: string;
  reason: string;
};

export type CurrentAffairsRevisionMcqSeed = {
  question: string;
  answer: string;
  trap: string;
  examArea: string;
};

export type CurrentAffairsRevisionPacket = {
  id: string;
  recallCardId: string;
  date: string;
  title: string;
  source: string;
  url: string;
  staticAnchors: CurrentAffairsStaticAnchor[];
  mcqSeeds: CurrentAffairsRevisionMcqSeed[];
};

export type CurrentAffairsSourceQuality = {
  totalItems: number;
  highRelevanceItems: number;
  officialSourceItems: number;
  staticAnchorCount: number;
  examAreas: string[];
  hasMistralSummary: boolean;
};

export type CurrentAffairsRunState = {
  firstRunDate: string | null;
  lastRunDate: string | null;
  lastSuccessfulDate: string | null;
  lastRunAt: string | null;
  expectedDate: string;
  daysSinceLastSuccess: number | null;
  freshnessStatus: "current" | "stale" | "missing";
  freshnessLabel: string;
  repairAction: string;
  totalRuns: number;
  successfulRuns: number;
  reliabilityPercent: number;
  continuityLabel: string;
  latestStatus: string;
  latestRawItems: number;
  latestSummaryItems: number;
  latestSources: string[];
  sourceCounts: Record<string, number>;
};

export type CurrentAffairsStudyBrief = CurrentAffairsBrief & {
  recallCards: CurrentAffairsRecallCard[];
  revisionPackets: CurrentAffairsRevisionPacket[];
  sourceQuality: CurrentAffairsSourceQuality;
  runState: CurrentAffairsRunState;
};

export type CurrentAffairsArchiveDay = {
  date: string;
  status: CurrentAffairsBrief["status"];
  totalItems: number;
  highRelevanceItems: number;
  officialSourceItems: number;
  recallCards: number;
  href: string;
  isSelected: boolean;
};
