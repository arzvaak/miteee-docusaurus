import fs from "node:fs";
import path from "node:path";
import {
  GATE_QUESTION_TYPES,
  GATE_SUBJECTS,
  type GateAnswer,
  type GateAnswerState,
  type GateExamData,
  type GateNatRange,
  type GateQuestion,
  type GateQuestionResponse,
  type GateQuestionScore,
  type GatePaper,
  type GateSubject,
  type GateTestFilters,
  type GateTopic,
  type GateValidationReport
} from "@/lib/gate-types";

export const gateGeneratedPath = path.join(process.cwd(), "data", "generated", "exams", "gate", "index.json");
const gateSourceQuestionsPath = path.join(process.cwd(), "data", "exams", "gate", "questions.json");
const gateSourceTopicsPath = path.join(process.cwd(), "data", "exams", "gate", "topics.json");

export const gateSubjects = GATE_SUBJECTS;

const emptyGateData: GateExamData = {
  generatedAt: "missing-generated-data",
  exam: {
    code: "GATE",
    title: "Graduate Aptitude Test in Engineering",
    subjects: [...GATE_SUBJECTS]
  },
  sections: [],
  topics: [],
  questions: []
};

let dataCache: GateExamData | null = null;
let dataCacheFingerprint: string | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normaliseRange(value: unknown): GateNatRange | null {
  if (!isRecord(value)) return null;
  const min = numberValue(value.min ?? value.lower ?? value.from);
  const max = numberValue(value.max ?? value.upper ?? value.to);
  if (min === null || max === null) return null;
  return { min, max };
}

function normaliseQuestionType(value: unknown) {
  const raw = stringValue(value).toLowerCase();
  return raw === "mcq" || raw === "msq" || raw === "nat" ? raw : "";
}

function isLocalPath(value: string) {
  return value.startsWith("/") || value.startsWith("~") || /^[A-Za-z]:[\\/]/.test(value);
}

/**
 * Provenance is carried through server-to-client props by the runner.  Keep
 * public URLs useful for attribution, but never serialize the workstation's
 * private corpus paths (or arbitrary local asset paths) into that payload.
 */
function publicUrl(value: unknown) {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;
}

function publicGateAssetPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/content-assets/gate/") ? value : undefined;
}

function displayTitle(value: unknown, fallback: string) {
  const title = stringValue(value);
  return title && !isLocalPath(title) ? title : fallback;
}

function stripRepeatedOptionBlock(stem: string, optionCount: number) {
  if (optionCount < 2) return stem.trim();
  return stem.replace(/\n\s*\(\s*A\s*\)\s+[\s\S]*$/i, "").trim();
}

function stripPaperFooter(text: string) {
  return text
    .replace(/\s+(?:Page\s+\d+\s+of\s+\d+|Organizing Institute:|GATE\s+20\d{2})[\s\S]*$/i, "")
    .trim();
}

/** Converts legacy generated keys into the canonical discriminated answer shape. */
export function normaliseGateQuestion(value: unknown): GateQuestion | null {
  if (!isRecord(value)) return null;
  const answerRecord = isRecord(value.answer) ? value.answer : null;
  const rawType = normaliseQuestionType(value.type || value.questionType || answerRecord?.kind);
  const type = GATE_QUESTION_TYPES.includes(rawType as (typeof GATE_QUESTION_TYPES)[number])
    ? rawType as GateQuestion["type"]
    : null;
  if (!type) return null;

  const rawAnswer = answerRecord;
  const paper = stringValue(value.subject ?? value.paper, "GATE");
  const year = numberValue(value.year);
  const friendlyPaperTitle = year === null ? `GATE ${paper} official paper` : `GATE ${year} ${paper} official paper`;
  const friendlyKeyTitle = year === null ? `GATE ${paper} final answer key` : `GATE ${year} ${paper} final answer key`;
  let answer: GateAnswer;
  if (type === "mcq") {
    const correctOption = stringValue(rawAnswer?.correctOption ?? rawAnswer?.value ?? value.correctOption);
    answer = { type, correctOption };
  } else if (type === "msq") {
    const correctOptionsValue = rawAnswer?.correctOptions ?? rawAnswer?.value ?? value.correctOptions ?? value.correctOption;
    const correctOptions = Array.isArray(correctOptionsValue)
      ? correctOptionsValue.filter((item): item is string => typeof item === "string")
      : typeof correctOptionsValue === "string" ? correctOptionsValue.split(/[,|\s]+/).filter(Boolean) : [];
    answer = { type, correctOptions };
  } else {
    const acceptedRange = normaliseRange(
      rawAnswer?.acceptedRange
      ?? rawAnswer?.range
      ?? rawAnswer
      ?? value.acceptedRange
      ?? value.natRange
      ?? value.answerRange
    );
    const exactValue = numberValue(rawAnswer?.value ?? value.correctAnswer);
    const resolvedRange = acceptedRange ?? (exactValue === null ? { min: NaN, max: NaN } : { min: exactValue, max: exactValue });
    answer = { type, value: exactValue ?? (resolvedRange.min === resolvedRange.max ? resolvedRange.min : undefined), acceptedRange: resolvedRange };
  }

  const provenanceValue = isRecord(value.provenance) ? value.provenance : {};
  const sourceType = stringValue(
    provenanceValue.sourceType
      ?? provenanceValue.source
      ?? (provenanceValue.answer_key_source || provenanceValue.answer_key_sha256 ? "official-key" : undefined),
    "other"
  );
  const officialKeyValue = isRecord(provenanceValue.officialKey)
    ? provenanceValue.officialKey
    : provenanceValue.answer_key_source || provenanceValue.answer_key_sha256
      ? {
          sourceId: stringValue(provenanceValue.answer_key_sha256),
          title: friendlyKeyTitle,
          year: year ?? 0,
          ...(typeof provenanceValue.answer_key_source === "string" && /^https?:\/\//.test(provenanceValue.answer_key_source) ? { url: provenanceValue.answer_key_source } : {})
        }
      : undefined;
  const officialKey = officialKeyValue
    ? {
        sourceId: stringValue(officialKeyValue.sourceId ?? officialKeyValue.id),
        title: displayTitle(officialKeyValue.title, friendlyKeyTitle),
        ...(publicUrl(officialKeyValue.url) ? { url: publicUrl(officialKeyValue.url) } : {}),
        year: numberValue(officialKeyValue.year) ?? 0,
        ...(typeof officialKeyValue.paper === "string" ? { paper: officialKeyValue.paper } : {}),
        ...(typeof officialKeyValue.questionNumber === "string" || typeof officialKeyValue.questionNumber === "number"
          ? { questionNumber: officialKeyValue.questionNumber }
          : {})
      }
    : undefined;
  const options = Array.isArray(value.options)
    ? value.options.filter(isRecord).map((option) => ({ id: stringValue(option.id ?? option.label), text: stripPaperFooter(stringValue(option.text ?? option.value)) }))
    : [];
  const stem = stripRepeatedOptionBlock(stringValue(value.stem ?? value.question ?? value.statement), options.length);

  return {
    id: stringValue(value.id),
    exam: "GATE",
    subject: paper as GateQuestion["subject"],
    section: stringValue(value.section ?? value.sectionTitle ?? value.section_title),
    ...(typeof value.sectionTitle === "string" || typeof value.section_title === "string" ? { sectionTitle: stringValue(value.sectionTitle ?? value.section_title) } : {}),
    topic: stringValue(value.topic ?? value.primary_leaf_id),
    ...(typeof value.topicTitle === "string" || typeof value.topic_title === "string" ? { topicTitle: stringValue(value.topicTitle ?? value.topic_title) } : {}),
    ...(typeof value.subtopic === "string" ? { subtopic: value.subtopic } : {}),
    ...(typeof value.year === "number" ? { year: value.year } : {}),
    stem,
    ...(Array.isArray(value.options) ? { options } : {}),
    type,
    questionType: type,
    answer,
    marks: value.marks === 2 ? 2 : 1,
    ...(typeof value.explanation === "string" ? { explanation: value.explanation } : {}),
    provenance: {
      sourceType: sourceType as GateQuestion["provenance"]["sourceType"],
      sourceId: stringValue(provenanceValue.sourceId ?? provenanceValue.id ?? provenanceValue.answer_key_sha256 ?? provenanceValue.question_source_sha256),
      title: displayTitle(provenanceValue.title, provenanceValue.answer_key_source ? friendlyKeyTitle : friendlyPaperTitle),
      ...(typeof provenanceValue.url === "string" && /^https?:\/\//.test(provenanceValue.url) ? { url: provenanceValue.url } : {}),
      ...(officialKey ? { officialKey } : {}),
      ...(typeof provenanceValue.licenseNote === "string" ? { licenseNote: provenanceValue.licenseNote } : {}),
      ...(publicUrl(provenanceValue.question_source) ? { questionSource: publicUrl(provenanceValue.question_source) } : {}),
      ...(Array.isArray(provenanceValue.question_pages) ? { questionPages: provenanceValue.question_pages.filter((page): page is number => typeof page === "number") } : {}),
      ...(publicUrl(provenanceValue.answer_key_source) ? { answerKeySource: publicUrl(provenanceValue.answer_key_source) } : {}),
      ...(typeof provenanceValue.answer_key_page === "number" ? { answerKeyPage: provenanceValue.answer_key_page } : {}),
      ...(typeof provenanceValue.answer_key_row === "string" ? { answerKeyRow: provenanceValue.answer_key_row } : {}),
      ...(typeof provenanceValue.question_source_sha256 === "string" ? { questionSourceSha256: provenanceValue.question_source_sha256 } : {}),
      ...(typeof provenanceValue.answer_key_sha256 === "string" ? { answerKeySha256: provenanceValue.answer_key_sha256 } : {})
    },
    ...(isRecord(value.stimulus) && publicGateAssetPath(value.stimulus.path) ? {
      stimulus: {
        kind: (stringValue(value.stimulus.kind, "figure") as "image" | "table" | "figure"),
        path: publicGateAssetPath(value.stimulus.path),
        ...(typeof value.stimulus.alt === "string" ? { alt: value.stimulus.alt } : {}),
        ...(typeof value.stimulus.caption === "string" ? { caption: value.stimulus.caption } : {})
      }
    } : {}),
    ...(Array.isArray(value.conceptTags) ? { conceptTags: value.conceptTags.filter((tag): tag is string => typeof tag === "string") } : {})
  };
}

export const normalizeGateQuestion = normaliseGateQuestion;

function normaliseData(value: unknown): GateExamData {
  if (!isRecord(value)) return emptyGateData;
  const questions = Array.isArray(value.questions)
    ? value.questions.map(normaliseGateQuestion).filter((question): question is GateQuestion => question !== null)
    : [];
  const topics: GateTopic[] = Array.isArray(value.topics)
    ? value.topics.filter(isRecord).map((topic) => ({
        slug: stringValue(topic.slug),
        title: stringValue(topic.title ?? topic.slug),
        subject: stringValue(topic.subject) as GateTopic["subject"],
        section: stringValue(topic.section),
        ...(typeof topic.sectionTitle === "string" || typeof topic.section_title === "string" ? { sectionTitle: stringValue(topic.sectionTitle ?? topic.section_title) } : {}),
        questionIds: Array.isArray(topic.questionIds) ? topic.questionIds.filter((id): id is string => typeof id === "string") : [],
        ...(typeof topic.questionCount === "number" ? { questionCount: topic.questionCount } : {})
      }))
    : [];
  const sections = Array.isArray(value.sections)
    ? value.sections.filter(isRecord).map((section) => ({
        slug: stringValue(section.slug),
        title: stringValue(section.title ?? section.slug),
        subject: stringValue(section.subject) as GateTopic["subject"],
        ...(Array.isArray(section.topicSlugs) ? { topicSlugs: section.topicSlugs.filter((slug): slug is string => typeof slug === "string") } : {})
      }))
    : [];
  const exam = isRecord(value.exam) ? value.exam : {};
  return {
    generatedAt: stringValue(value.generatedAt, "unknown-generated-data"),
    exam: {
      code: "GATE",
      title: stringValue(exam.title, "Graduate Aptitude Test in Engineering"),
      subjects: Array.isArray(exam.subjects)
        ? exam.subjects.filter((subject): subject is GateQuestion["subject"] => GATE_SUBJECTS.includes(subject as GateQuestion["subject"]))
        : [...GATE_SUBJECTS]
    },
    sections,
    topics,
    questions
  };
}

function sectionSlug(title: string) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Converts the reviewed native source manifest into runtime practice data. */
export function buildGateDataFromSource(questionsValue: unknown, topicsValue: unknown): GateExamData {
  const rawTopics = isRecord(topicsValue) && Array.isArray(topicsValue.topics) ? topicsValue.topics.filter(isRecord) : [];
  const topicRows = rawTopics.map((topic) => {
    const sectionTitle = stringValue(topic.section_title ?? topic.sectionTitle, "General");
    return {
      id: stringValue(topic.id ?? topic.slug),
      slug: stringValue(topic.id ?? topic.slug),
      paper: stringValue(topic.paper ?? topic.subject) as GateSubject,
      subject: stringValue(topic.paper ?? topic.subject) as GateSubject,
      title: stringValue(topic.title ?? topic.name, stringValue(topic.id ?? topic.slug)),
      section: sectionSlug(sectionTitle),
      sectionTitle,
      questionIds: [] as string[]
    };
  });
  const topicMap = new Map(topicRows.map((topic) => [topic.id, topic]));
  const rawQuestions = isRecord(questionsValue) && Array.isArray(questionsValue.questions) ? questionsValue.questions : [];
  const enrichedQuestions = rawQuestions.filter(isRecord).map((question) => {
    const topic = topicMap.get(stringValue(question.primary_leaf_id));
    const id = stringValue(question.id);
    if (topic && id) topic.questionIds.push(id);
    return {
      ...question,
      subject: question.paper,
      section: topic?.section ?? "general",
      sectionTitle: topic?.sectionTitle ?? "General",
      topic: topic?.id ?? stringValue(question.primary_leaf_id, "unclassified"),
      topicTitle: topic?.title ?? "Unclassified",
      stem: question.statement
    };
  });
  const sections = [...new Map(topicRows.map((topic) => [`${topic.paper}:${topic.section}`, {
    slug: topic.section,
    title: topic.sectionTitle,
    subject: topic.paper
  }])).values()];
  return normaliseData({
    generatedAt: isRecord(questionsValue) ? stringValue(questionsValue.generatedAt ?? questionsValue.release, "source-manifest") : "source-manifest",
    exam: { code: "GATE", title: "Graduate Aptitude Test in Engineering", subjects: GATE_SUBJECTS },
    sections,
    topics: topicRows,
    questions: enrichedQuestions
  });
}

function readSourceData() {
  try {
    return buildGateDataFromSource(
      JSON.parse(fs.readFileSync(gateSourceQuestionsPath, "utf8")),
      JSON.parse(fs.readFileSync(gateSourceTopicsPath, "utf8"))
    );
  } catch {
    return emptyGateData;
  }
}

function readGateData() {
  try {
    return normaliseData(JSON.parse(fs.readFileSync(gateGeneratedPath, "utf8")));
  } catch {
    // The generated artifact is preferred, but the reviewed source manifest
    // keeps a fresh checkout usable before the content build has run.
    return readSourceData();
  }
}

export function getGateData() {
  let fingerprint: string | null = null;
  try {
    const stats = fs.statSync(gateGeneratedPath);
    fingerprint = `${stats.size}:${stats.mtimeMs}`;
  } catch {
    // The generated corpus is optional during development and on a clean install.
  }
  if (!dataCache || (fingerprint !== null && fingerprint !== dataCacheFingerprint)) {
    dataCache = readGateData();
    dataCacheFingerprint = fingerprint;
  }
  return dataCache;
}

function matchesGateFilter(question: GateQuestion, filter: GateTestFilters) {
  const subjects = filter.subjects ?? (filter.subject ? [filter.subject] : undefined);
  const sections = filter.sections ?? (filter.section ? [filter.section] : undefined);
  const topics = filter.topics ?? (filter.topic ? [filter.topic] : undefined);
  const years = filter.years ?? (filter.year === undefined ? undefined : [filter.year]);
  const types = filter.types ?? (filter.type ? [filter.type] : undefined);
  return (!subjects || subjects.includes(question.subject))
    && (!sections || sections.includes(question.section))
    && (!topics || topics.includes(question.topic))
    && (!years || (question.year !== undefined && years.includes(question.year)))
    && (!types || types.includes(question.type));
}

export function getGateQuestions(subject?: GateSubject): GateQuestion[];
export function getGateQuestions(filter?: GateTestFilters): GateQuestion[];
export function getGateQuestions(subjectOrFilter?: GateSubject | GateTestFilters) {
  const filter: GateTestFilters = typeof subjectOrFilter === "string" ? { subject: subjectOrFilter } : subjectOrFilter ?? {};
  return getGateData().questions.filter((question) => matchesGateFilter(question, filter));
}

export function getGateTopics(subject?: GateSubject): GateTopic[];
export function getGateTopics(filter?: Pick<GateTestFilters, "subject" | "subjects" | "section" | "sections">): GateTopic[];
export function getGateTopics(subjectOrFilter?: GateSubject | Pick<GateTestFilters, "subject" | "subjects" | "section" | "sections">) {
  const filter = typeof subjectOrFilter === "string" ? { subject: subjectOrFilter } : subjectOrFilter ?? {};
  const subjects = filter.subjects ?? (filter.subject ? [filter.subject] : undefined);
  const sections = filter.sections ?? (filter.section ? [filter.section] : undefined);
  const activeQuestionIds = new Set(getGateData().questions.map((question) => question.id));
  return getGateData().topics.filter((topic) => topic.questionIds.some((id) => activeQuestionIds.has(id)) && (!subjects || subjects.includes(topic.subject)) && (!sections || sections.includes(topic.section)));
}

/** Complete syllabus catalog, including leaves that do not have admitted questions yet. */
export function getGateTopicCatalog(subject?: GateSubject) {
  return getGateData().topics.filter((topic) => !subject || topic.subject === subject);
}

export function getGateQuestion(id: string) {
  return getGateData().questions.find((question) => question.id === id) ?? null;
}

export function getGateTopic(slug: string, subject?: GateSubject): GateTopic | null;
export function getGateTopic(subject: GateSubject, slug: string): GateTopic | null;
export function getGateTopic(paper: GatePaper, slug: string): GateTopic | null;
export function getGateTopic(first: string | GatePaper, second?: string | GateSubject) {
  if (typeof first !== "string") return first.topics.find((topic) => topic.slug === second) ?? null;
  // The old form is (slug, subject).  Also accept the UI-friendly
  // (subject, slug) form when the first token is an unambiguous subject.
  if (first === "EE" || first === "DA") return getGateTopics(first).find((topic) => topic.slug === second) ?? null;
  return getGateTopics(second as GateSubject | undefined).find((topic) => topic.slug === first) ?? null;
}

export function getGateSections(subject?: GateQuestion["subject"]) {
  return (getGateData().sections ?? []).filter((section) => !subject || section.subject === subject);
}

export function getGatePaper(subject?: GateSubject): GatePaper {
  const data = getGateData();
  const activeQuestionIds = new Set(data.questions.map((question) => question.id));
  return {
    exam: data.exam,
    subject: subject ?? "mixed",
    sections: (data.sections ?? []).filter((section) => !subject || section.subject === subject),
    topics: data.topics.filter((topic) => topic.questionIds.some((id) => activeQuestionIds.has(id)) && (!subject || topic.subject === subject)),
    questions: subject ? data.questions.filter((question) => question.subject === subject) : data.questions
  };
}

export function getGateDashboard() {
  const data = getGateData();
  const reviewed = data.questions.filter((question) => question.provenance.sourceType === "official-key" || question.provenance.sourceType === "official-paper");
  const papers = GATE_SUBJECTS.map((subject) => {
    const questions = data.questions.filter((question) => question.subject === subject);
    const topics = data.topics.filter((topic) => topic.subject === subject && topic.questionIds.some((id) => questions.some((question) => question.id === id)));
    const playableSections = new Set(questions.map((question) => question.section));
    return {
      id: subject.toLowerCase(),
      subject,
      title: subject === "EE" ? "Electrical Engineering" : "Data Science & Artificial Intelligence",
      shortTitle: `GATE ${subject}`,
      description: `Topic-wise GATE ${subject} practice with official answer review and worked explanations.`,
      questionCount: questions.length,
      topicCount: topics.length,
      sectionCount: playableSections.size,
      typeCounts: questions.reduce((counts, question) => {
        counts[question.type] += 1;
        return counts;
      }, { mcq: 0, msq: 0, nat: 0 })
    };
  });
  return {
    exam: data.exam,
    generatedAt: data.generatedAt,
    subjects: data.exam.subjects,
    papers,
    questionCount: data.questions.length,
    reviewedQuestionCount: reviewed.length,
    topicCount: data.topics.filter((topic) => topic.questionIds.some((id) => data.questions.some((question) => question.id === id))).length,
    sectionCount: data.sections?.length ?? new Set(data.questions.map((question) => question.section)).size,
    typeCounts: data.questions.reduce((counts, question) => {
      counts[question.type] += 1;
      return counts;
    }, { mcq: 0, msq: 0, nat: 0 }),
    subjectCounts: data.questions.reduce((counts, question) => {
      counts[question.subject] += 1;
      return counts;
    }, { EE: 0, DA: 0 })
  };
}

function answerValue(response: GateQuestionResponse) {
  if (isRecord(response)) {
    if (response.type === "mcq") return response.option;
    if (response.type === "msq") return response.options;
    if (response.type === "nat") return response.value;
  }
  return response;
}

function sameOptionSet(actual: string[], expected: string[]) {
  if (actual.length !== expected.length) return false;
  const actualSet = new Set(actual.map((item) => item.trim().toLowerCase()));
  const expectedSet = new Set(expected.map((item) => item.trim().toLowerCase()));
  return actualSet.size === actual.length && actualSet.size === expectedSet.size && [...expectedSet].every((item) => actualSet.has(item));
}

/** Scores one response using official GATE negative-marking rules. */
export function scoreGateQuestion(question: GateQuestion, response: GateQuestionResponse): GateQuestionScore {
  const value = answerValue(response);
  const unattempted = value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
  if (unattempted) return { state: "unattempted", score: 0, maxScore: question.marks };

  let correct = false;
  if (question.type === "mcq" && question.answer.type === "mcq" && typeof value === "string") {
    correct = value.trim().toLowerCase() === question.answer.correctOption.trim().toLowerCase();
  } else if (question.type === "msq" && question.answer.type === "msq" && Array.isArray(value)) {
    correct = sameOptionSet(value, question.answer.correctOptions);
  } else if (question.type === "nat" && question.answer.type === "nat") {
    const numericValue = typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== "" ? Number(value.trim()) : NaN;
    const range = question.answer.acceptedRange ?? question.answer.range;
    correct = Boolean(range && Number.isFinite(numericValue) && numericValue >= range.min && numericValue <= range.max);
  }

  if (correct) return { state: "correct", score: question.marks, maxScore: question.marks };
  // Only MCQ has negative marking. MSQ and NAT incorrect answers score zero.
  return {
    state: "wrong",
    score: question.type === "mcq" ? -(question.marks / 3) : 0,
    maxScore: question.marks
  };
}

export const scoreGateAnswer = scoreGateQuestion;

export type GateAttemptResult = {
  score: number;
  maxScore: number;
  correct: number;
  wrong: number;
  unattempted: number;
  byQuestion: Record<string, GateQuestionScore>;
};

export function scoreGateAttempt(questions: GateQuestion[], responses: Record<string, GateQuestionResponse> = {}): GateAttemptResult {
  const byQuestion: Record<string, GateQuestionScore> = {};
  for (const question of questions) byQuestion[question.id] = scoreGateQuestion(question, responses[question.id]);
  const rows = Object.values(byQuestion);
  return {
    score: rows.reduce((sum, row) => sum + row.score, 0),
    maxScore: rows.reduce((sum, row) => sum + row.maxScore, 0),
    correct: rows.filter((row) => row.state === "correct").length,
    wrong: rows.filter((row) => row.state === "wrong").length,
    unattempted: rows.filter((row) => row.state === "unattempted").length,
    byQuestion
  };
}

function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateGateQuestion(question: GateQuestion): string[] {
  const errors: string[] = [];
  if (!question.id.trim()) errors.push("question id is required");
  if (question.exam !== "GATE") errors.push(`${question.id} must identify as GATE`);
  if (!GATE_SUBJECTS.includes(question.subject)) errors.push(`${question.id} has an unsupported subject`);
  if (!question.section.trim()) errors.push(`${question.id} section is required`);
  if (!question.topic.trim()) errors.push(`${question.id} topic is required`);
  if (!question.stem.trim()) errors.push(`${question.id} stem is required`);
  if (!GATE_QUESTION_TYPES.includes(question.type)) errors.push(`${question.id} has an unsupported question type`);
  if (question.questionType && question.questionType !== question.type) errors.push(`${question.id} type aliases disagree`);
  if (question.marks !== 1 && question.marks !== 2) errors.push(`${question.id} marks must be 1 or 2`);

  const options = question.options ?? [];
  const optionIds = new Set(options.map((option) => option.id.toLowerCase()));
  if ((question.type === "mcq" || question.type === "msq") && options.length !== 4) errors.push(`${question.id} ${question.type.toUpperCase()} must have four options`);
  if (optionIds.size !== options.length || options.some((option) => !option.id.trim() || !option.text.trim())) errors.push(`${question.id} options must have unique non-empty ids and text`);
  if (question.type === "mcq" && question.answer.type === "mcq" && !optionIds.has(question.answer.correctOption.trim().toLowerCase())) errors.push(`${question.id} MCQ key is not one of the options`);
  if (question.type === "msq" && question.answer.type === "msq" && (!hasStringArray(question.answer.correctOptions) || question.answer.correctOptions.length === 0 || !question.answer.correctOptions.every((id) => optionIds.has(id.trim().toLowerCase())))) {
    errors.push(`${question.id} MSQ key must contain one or more option ids`);
  }
  if (question.type === "nat" && question.answer.type === "nat") {
    const range = question.answer.acceptedRange ?? question.answer.range;
    if (!range || !Number.isFinite(range.min) || !Number.isFinite(range.max) || range.min > range.max) {
    errors.push(`${question.id} NAT key must contain an exact finite range with min <= max`);
    }
  }
  if (question.answer.type !== question.type) errors.push(`${question.id} answer discriminator does not match question type`);
  if (!question.provenance || !question.provenance.sourceId.trim() || !question.provenance.title.trim()) errors.push(`${question.id} provenance requires sourceId and title`);
  if (!["official-key", "official-paper", "original-practice", "other"].includes(question.provenance.sourceType)) errors.push(`${question.id} has an unsupported provenance source type`);
  if (question.provenance.sourceType === "official-key") {
    const key = question.provenance.officialKey;
    if (!key || !key.sourceId.trim() || !key.title.trim() || !Number.isInteger(key.year)) errors.push(`${question.id} official-key provenance is incomplete`);
  }
  return errors;
}

export function validateGateData(data: GateExamData = getGateData()): GateValidationReport {
  const errors: string[] = [];
  const ids = new Set<string>();
  const duplicateQuestionIds: string[] = [];
  const topicMap = new Map(data.topics.map((topic) => [`${topic.subject}:${topic.slug}`, topic]));
  for (const question of data.questions) {
    if (ids.has(question.id)) duplicateQuestionIds.push(question.id);
    ids.add(question.id);
    errors.push(...validateGateQuestion(question).map((error) => error));
    if (!topicMap.has(`${question.subject}:${question.topic}`)) errors.push(`${question.id} references an unknown topic`);
  }
  for (const topic of data.topics) {
    if (!GATE_SUBJECTS.includes(topic.subject)) errors.push(`${topic.slug} has an unsupported subject`);
    for (const id of topic.questionIds) {
      const question = data.questions.find((item) => item.id === id);
      if (!question) errors.push(`${topic.slug} references unknown question ${id}`);
      else if (question.subject !== topic.subject || question.topic !== topic.slug) errors.push(`${topic.slug} has mismatched question ${id}`);
    }
  }
  return { ok: errors.length === 0 && duplicateQuestionIds.length === 0, errors, duplicateQuestionIds, questions: data.questions.length, topics: data.topics.length };
}

export const validateGateExamData = validateGateData;

// Public convenience export: route modules can import the complete GATE data
// surface from one module, while the implementation remains isolated in the
// test-builder file.
export { buildGateTest } from "@/lib/gate-tests";
