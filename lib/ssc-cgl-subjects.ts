import type { SscCglSectionId } from "@/lib/exam-types";

export type SscCglSubjectTone = "blue" | "amber" | "violet" | "green";
export type SscCglSubjectStage = "guide" | "foundation" | "high-yield" | "speed" | "revision";

export type SscCglSubjectDefinition = {
  section: SscCglSectionId;
  groupKey: string;
  notePrefix: string;
  shortTitle: string;
  title: string;
  cardDescription: string;
  description: string;
  outcome: string;
  tone: SscCglSubjectTone;
  cockpitHref: string;
  focusAreas: string[];
};

export type SscCglSubjectLandingNote = {
  slug: string;
  title: string;
  label: string;
  description: string;
  headings: string[];
  stage: SscCglSubjectStage;
  topicSlug: string | null;
  studyHref: string;
  practiceHref: string | null;
  drillHref: string | null;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  gapRepairQuestions: number;
  readinessPercent: number;
  coverageLabel: string | null;
};

export type SscCglSubjectLandingStats = {
  studyNotes: number;
  canonicalTopics: number;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  gapRepairQuestions: number;
};

export const sscCglSubjectDefinitions: readonly SscCglSubjectDefinition[] = [
  {
    section: "reasoning",
    groupKey: "ssc-cgl-reasoning",
    notePrefix: "ssc-cgl-reasoning-",
    shortTitle: "Reasoning",
    title: "General Intelligence and Reasoning",
    cardDescription: "Patterns, logic, series, relations, and fast diagram decisions.",
    description: "Learn the pattern families first, then make analogy, series, relation, arrangement, and diagram decisions at section pace.",
    outcome: "Recognise the rule quickly, draw only what is necessary, and protect all 50 marks from avoidable logic traps.",
    tone: "blue",
    cockpitHref: "/exams/ssc-cgl/reasoning-50",
    focusAreas: ["Patterns", "Relations", "Arrangements", "Non-verbal logic"]
  },
  {
    section: "general-awareness",
    groupKey: "ssc-cgl-ga",
    notePrefix: "ssc-cgl-ga-",
    shortTitle: "General Awareness",
    title: "General Awareness",
    cardDescription: "Static GK, science, polity, history, geography, and current affairs.",
    description: "Build a connected recall map across polity, history, geography, science, economics, culture, and current affairs.",
    outcome: "Turn isolated facts into durable anchors so the section becomes fast recall rather than uncertain guessing.",
    tone: "amber",
    cockpitHref: "/exams/ssc-cgl/ga-50",
    focusAreas: ["Static GK", "Polity", "Science", "Current affairs"]
  },
  {
    section: "quantitative-aptitude",
    groupKey: "ssc-cgl-quant",
    notePrefix: "ssc-cgl-quant-",
    shortTitle: "Quantitative Aptitude",
    title: "Quantitative Aptitude",
    cardDescription: "Arithmetic speed, algebra, geometry, mensuration, and data interpretation.",
    description: "Build arithmetic fluency, then layer algebra, geometry, mensuration, trigonometry, and data interpretation on top.",
    outcome: "Choose the shortest valid method, control calculation time, and keep every topic inside the 36-second decision system.",
    tone: "violet",
    cockpitHref: "/exams/ssc-cgl/quant-50",
    focusAreas: ["Arithmetic", "Algebra", "Geometry", "Data interpretation"]
  },
  {
    section: "english-comprehension",
    groupKey: "ssc-cgl-english",
    notePrefix: "ssc-cgl-english-",
    shortTitle: "English",
    title: "English Comprehension",
    cardDescription: "Grammar, vocabulary, comprehension, cloze, voice, and narration.",
    description: "Study grammar, vocabulary, cloze, sentence flow, voice, narration, and reading as one rule-first system.",
    outcome: "Identify the tested rule, eliminate precisely, and keep comprehension from consuming the section clock.",
    tone: "green",
    cockpitHref: "/exams/ssc-cgl/english-50",
    focusAreas: ["Grammar", "Vocabulary", "Cloze", "Reading precision"]
  }
];

export function getSscCglSubjectDefinition(section: string) {
  return sscCglSubjectDefinitions.find((subject) => subject.section === section) ?? null;
}

export function sscCglSubjectHref(section: SscCglSectionId | string) {
  return `/courses/SSC-CGL/${section}`;
}

export function sscCglTopicSlugFromNote(subject: SscCglSubjectDefinition, noteSlug: string) {
  return noteSlug.startsWith(subject.notePrefix) ? noteSlug.slice(subject.notePrefix.length) : null;
}
