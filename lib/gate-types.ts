/**
 * Data contracts for the GATE practice corpus.
 *
 * GATE has three answer modes and the answer key is part of the question
 * record rather than being inferred by a renderer.  Keeping these as a
 * discriminated union makes it difficult to accidentally apply MCQ negative
 * marking to MSQ or NAT questions.
 */

export const GATE_SUBJECTS = ["EE", "DA"] as const;
export type GateSubject = (typeof GATE_SUBJECTS)[number];

export const GATE_QUESTION_TYPES = ["mcq", "msq", "nat"] as const;
export type GateQuestionType = (typeof GATE_QUESTION_TYPES)[number];

/** Official-syllabus section slugs used by the selector even before data is generated. */
export const GATE_SECTION_CATALOG = {
  EE: [
    "engineering-mathematics",
    "electric-circuits",
    "electromagnetic-fields",
    "signals-and-systems",
    "electrical-machines",
    "power-systems",
    "control-systems",
    "electrical-measurements",
    "analog-and-digital-electronics",
    "power-electronics"
  ],
  DA: [
    "probability-and-statistics",
    "linear-algebra",
    "calculus-and-optimization",
    "programming-and-data-structures",
    "algorithms",
    "database-and-warehousing",
    "machine-learning",
    "artificial-intelligence"
  ]
} as const;

export type GateOption = {
  id: string;
  text: string;
};

export type GateNatRange = {
  /** Inclusive lower bound from the official answer key. */
  min: number;
  /** Inclusive upper bound from the official answer key. */
  max: number;
};

export type GateMcqAnswer = {
  type: "mcq";
  correctOption: string;
};

export type GateMsqAnswer = {
  type: "msq";
  correctOptions: string[];
};

export type GateNatAnswer = {
  type: "nat";
  /** Optional representative key value for answer-review displays. */
  value?: number;
  /** Exact inclusive accepted interval, not a display-only approximation. */
  acceptedRange?: GateNatRange;
  /** JSON import alias; `acceptedRange` remains the canonical field. */
  range?: GateNatRange;
};

export type GateAnswer = GateMcqAnswer | GateMsqAnswer | GateNatAnswer;

export type GateOfficialKeyProvenance = {
  sourceId: string;
  title: string;
  url?: string;
  year: number;
  paper?: string;
  questionNumber?: string | number;
};

export type GateProvenance = {
  /** `official-key` is the normal source for a keyed PYQ. */
  sourceType: "official-key" | "official-paper" | "original-practice" | "other";
  sourceId: string;
  title: string;
  url?: string;
  officialKey?: GateOfficialKeyProvenance;
  licenseNote?: string;
  questionSource?: string;
  questionPages?: number[];
  answerKeySource?: string;
  answerKeyPage?: number;
  answerKeyRow?: string;
  questionSourceSha256?: string;
  answerKeySha256?: string;
};

export type GateStimulus = {
  kind: "image" | "table" | "figure";
  path?: string;
  alt?: string;
  caption?: string;
};

export type GateQuestion = {
  id: string;
  exam: "GATE";
  subject: GateSubject;
  /** Stable section slug, e.g. `power-systems` or `machine-learning`. */
  section: string;
  sectionTitle?: string;
  /** Stable fine-grained topic slug within a section. */
  topic: string;
  topicTitle?: string;
  subtopic?: string;
  year?: number;
  stem: string;
  options?: GateOption[];
  type: GateQuestionType;
  /** Alias accepted while migrating generated corpora from CAT-style fields. */
  questionType?: GateQuestionType;
  answer: GateAnswer;
  stimulus?: GateStimulus;
  marks: 1 | 2;
  explanation?: string;
  provenance: GateProvenance;
  conceptTags?: string[];
};

export type GateTopic = {
  slug: string;
  title: string;
  subject: GateSubject;
  section: string;
  sectionTitle?: string;
  questionIds: string[];
  questionCount?: number;
};

export type GateSection = {
  slug: string;
  title: string;
  subject: GateSubject;
  topicSlugs?: string[];
};

export type GateExamData = {
  generatedAt: string;
  exam: {
    code: "GATE";
    title: string;
    subjects: GateSubject[];
  };
  sections?: GateSection[];
  topics: GateTopic[];
  questions: GateQuestion[];
};

export type GateQuestionResponse =
  | null
  | undefined
  | string
  | string[]
  | number
  | { type: "mcq"; option: string | null }
  | { type: "msq"; options: string[] }
  | { type: "nat"; value: number | null };

export type GateAnswerState = "correct" | "wrong" | "unattempted";

export type GateQuestionScore = {
  state: GateAnswerState;
  score: number;
  maxScore: number;
};

export type GateTestFilters = {
  subject?: GateSubject | string;
  subjects?: Array<GateSubject | string>;
  section?: string;
  sections?: string[];
  topic?: string;
  topics?: string[];
  year?: number;
  years?: number[];
  type?: GateQuestionType;
  types?: GateQuestionType[];
  /** Number of questions or `"all"`; omitted means all matching questions. */
  count?: number | "all" | string;
  questionCount?: number | "all" | string;
  /** Stable shuffle seed. Same seed + corpus + filters gives same order. */
  seed?: string | number;
};

export type GatePaper = {
  exam: GateExamData["exam"];
  subject: GateSubject | "mixed";
  sections: GateSection[];
  topics: GateTopic[];
  questions: GateQuestion[];
};

export type GateCustomTest = {
  id: string;
  title: string;
  subject: GateSubject | "mixed";
  filters: GateTestFilters;
  seed: string;
  questionCount: number;
  maxScore: number;
  questions: GateQuestion[];
};

export type GateValidationReport = {
  ok: boolean;
  errors: string[];
  duplicateQuestionIds: string[];
  questions: number;
  topics: number;
};
