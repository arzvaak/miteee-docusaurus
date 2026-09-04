export type GatePaperId = "ee" | "da" | string;

export type GateOption = { id: string; text: string };

export type GateQuestion = {
  id: string;
  paper: GatePaperId;
  section: string;
  topic: string;
  topicTitle: string;
  year?: number;
  questionType: "mcq" | "msq" | "nat";
  stem: string;
  stimulus?: { src: string; alt: string; caption?: string };
  options: GateOption[];
  correctOption?: string;
  correctOptions: string[];
  correctAnswer?: string;
  answerRange?: { min?: number; max?: number };
  explanation: string;
  explanationAvailable: boolean;
  source: string;
  sourcePage?: string;
  officialKeyTitle?: string;
  marks: number;
  negativeMarks: number;
};

export type GateTopic = {
  slug: string;
  title: string;
  section: string;
  sectionTitle: string;
  summary: string;
  questionCount: number;
  years: number[];
};

export type GatePaper = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
  topicCount: number;
  sectionCount: number;
};

export type GateDashboard = {
  papers: GatePaper[];
  questionCount: number;
  topicCount: number;
};

export type GateBuildConfig = {
  paper: string;
  section?: string;
  topic?: string;
  years?: number[];
  questionTypes?: Array<"mcq" | "msq" | "nat">;
  length?: "5" | "10" | "20" | "30" | "all";
  mode?: "practice" | "timed";
  seed?: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : Number(value) || fallback;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function firstString(raw: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = stringValue(raw[key]);
    if (value) return value;
  }
  return fallback;
}

function firstNumber(raw: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "") return numberValue(raw[key], fallback);
  }
  return fallback;
}

export function normalizeGatePapers(value: unknown): GatePaper[] {
  const raw = record(value);
  const source = Array.isArray(value) ? value : arrayValue(raw.papers ?? raw.subjects ?? raw.items);
  return source.map((item) => {
    const row = record(item);
    const id = firstString(row, ["id", "paper", "code", "slug"], "ee");
    return {
      id,
      title: firstString(row, ["title", "name"], id.toUpperCase()),
      shortTitle: firstString(row, ["shortTitle", "short_title", "name", "title"], id.toUpperCase()),
      description: firstString(row, ["description", "summary", "subtitle"], "Topic-wise GATE practice."),
      questionCount: firstNumber(row, ["questionCount", "question_count", "questions", "count"]),
      topicCount: firstNumber(row, ["topicCount", "topic_count", "topics"]),
      sectionCount: firstNumber(row, ["sectionCount", "section_count", "sections"])
    };
  });
}

export function normalizeGateDashboard(value: unknown): GateDashboard {
  const raw = record(value);
  let papers = normalizeGatePapers(value);
  const rawQuestions = arrayValue(raw.questions).map(record);
  const playableTopicsByPaper = (subject: string) => new Set(rawQuestions.filter((question) => firstString(question, ["subject", "paper", "exam"]) === subject).map((question) => firstString(question, ["topic", "topicSlug", "topic_slug"])).filter(Boolean)).size;
  if (!papers.length && (Array.isArray(raw.questions) || Array.isArray(raw.topics) || Array.isArray(record(raw.exam).subjects))) {
    const questions = arrayValue(raw.questions).map(record);
    const topics = arrayValue(raw.topics).map(record);
    const subjects = arrayValue(record(raw.exam).subjects).map((subject) => stringValue(subject)).filter(Boolean);
    papers = (subjects.length ? subjects : ["EE", "DA"]).map((subject) => {
      const questionCount = questions.filter((question) => firstString(question, ["subject", "paper", "exam"]) === subject).length;
      const topicCount = topics.filter((topic) => firstString(topic, ["subject", "paper"]) === subject).length;
      return { id: subject.toLowerCase(), title: subject === "EE" ? "Electrical Engineering" : subject === "DA" ? "Data Science & Artificial Intelligence" : subject, shortTitle: subject, description: `Topic-wise ${subject} GATE practice with official answer review.`, questionCount, topicCount, sectionCount: 0 };
    });
  }
  if (rawQuestions.length) papers = papers.map((paper) => ({ ...paper, topicCount: playableTopicsByPaper(paper.id.toUpperCase()) || paper.topicCount }));
  return {
    papers,
    questionCount: firstNumber(raw, ["questionCount", "question_count", "questions"], papers.reduce((sum, paper) => sum + paper.questionCount, 0)),
    topicCount: rawQuestions.length ? papers.reduce((sum, paper) => sum + paper.topicCount, 0) : firstNumber(raw, ["topicCount", "topic_count", "topics"], papers.reduce((sum, paper) => sum + paper.topicCount, 0))
  };
}

export function normalizeGateTopics(value: unknown, fallbackPaper = "") {
  const raw = record(value);
  const source = Array.isArray(value) ? value : arrayValue(raw.topics ?? raw.items);
  return source.map((item) => {
    const row = record(item);
    const section = firstString(row, ["section", "sectionId", "section_id", "group"], "General");
    const years = arrayValue(row.years ?? row.year).map((year) => numberValue(year)).filter(Boolean);
    return {
      slug: firstString(row, ["slug", "id", "topic"], "topic"),
      title: firstString(row, ["title", "name", "topic"], "Untitled topic"),
      section,
      sectionTitle: firstString(row, ["sectionTitle", "section_title", "sectionName"], section),
      summary: firstString(row, ["summary", "description", "blurb"], "Practice every reviewed question from this topic."),
      questionCount: firstNumber(row, ["questionCount", "question_count", "questions", "count"]),
      years
    } satisfies GateTopic;
  }).map((topic) => ({ ...topic, paper: fallbackPaper }));
}

function normalizeQuestionType(value: unknown): GateQuestion["questionType"] {
  const type = stringValue(value).toLowerCase();
  return type === "msq" || type === "multiple" || type === "multiple_select" ? "msq" : type === "nat" || type === "numerical" || type === "numeric" ? "nat" : "mcq";
}

export function normalizeGateQuestions(value: unknown, fallbackPaper = ""): GateQuestion[] {
  const raw = record(value);
  const source = Array.isArray(value) ? value : arrayValue(raw.questions ?? raw.items ?? raw.results);
  return source.map((item, index) => {
    const row = record(item);
    const options = arrayValue(row.options ?? row.choices).map((choice, optionIndex) => {
      const option = record(choice);
      const id = firstString(option, ["id", "key", "label"], String.fromCharCode(65 + optionIndex));
      return { id, text: firstString(option, ["text", "label", "value"], stringValue(choice, id)) };
    });
    const answer = record(row.answer);
    const type = normalizeQuestionType(row.questionType ?? row.question_type ?? row.type ?? answer.type);
    const rawCorrect = row.correctOptions ?? row.correct_options ?? row.correctOption ?? row.correct_option ?? row.answer;
    const canonicalCorrect = type === "mcq" ? answer.correctOption : type === "msq" ? answer.correctOptions : answer.value;
    const correctOptions = arrayValue(rawCorrect).map((item) => stringValue(item)).filter(Boolean).length ? arrayValue(rawCorrect).map((item) => stringValue(item)).filter(Boolean) : arrayValue(canonicalCorrect).map((item) => stringValue(item)).filter(Boolean);
    const singularCorrect = correctOptions[0] ?? stringValue(canonicalCorrect ?? rawCorrect);
    const range = record(row.answerRange ?? row.answer_range ?? row.range ?? answer.acceptedRange);
    const provenance = record(row.provenance);
    const officialKey = record(provenance.officialKey);
    const stimulus = record(row.stimulus);
    return {
      id: firstString(row, ["id", "questionId", "question_id"], `${fallbackPaper}-${index + 1}`),
      paper: firstString(row, ["paper", "exam", "paperId", "subject"], fallbackPaper),
      section: firstString(row, ["section", "sectionId", "section_id"], "General"),
      topic: firstString(row, ["topic", "topicSlug", "topic_slug"], "all"),
      topicTitle: firstString(row, ["topicTitle", "topic_title", "topicName"], "All topics"),
      year: row.year === undefined ? undefined : firstNumber(row, ["year"]),
      questionType: type,
      stem: firstString(row, ["stem", "question", "prompt", "text"], "Question unavailable"),
      stimulus: stringValue(stimulus.src ?? stimulus.path) ? { src: stringValue(stimulus.src ?? stimulus.path), alt: firstString(stimulus, ["alt", "caption"], "Question diagram"), ...(stringValue(stimulus.caption) ? { caption: stringValue(stimulus.caption) } : {}) } : undefined,
      options,
      correctOption: type === "mcq" ? singularCorrect : undefined,
      correctOptions: type === "msq" ? correctOptions : [],
      correctAnswer: type === "nat" ? stringValue(row.correctAnswer ?? row.correct_answer ?? answer.value ?? (range.min !== undefined && range.max !== undefined ? range.min === range.max ? range.min : `${range.min}–${range.max}` : singularCorrect)) : undefined,
      answerRange: type === "nat" && (range.min !== undefined || range.max !== undefined) ? { min: Number(range.min), max: Number(range.max) } : undefined,
      explanation: firstString(row, ["explanation", "solution", "解析"]),
      explanationAvailable: Boolean(firstString(row, ["explanation", "solution", "解析"])),
      source: firstString(row, ["source", "sourceTitle", "source_title", "provenanceSource"], firstString(provenance, ["title", "sourceId"], "GATE reviewed bank")),
      sourcePage: row.sourcePage === undefined && row.source_page === undefined && !provenance.pageNumber && !arrayValue(provenance.questionPages)[0]
        ? undefined
        : stringValue(row.sourcePage ?? row.source_page ?? provenance.pageNumber ?? arrayValue(provenance.questionPages)[0]),
      officialKeyTitle: firstString(officialKey, ["title", "sourceId"]),
      marks: firstNumber(row, ["marks", "positiveMarks", "positive_marks"], 1),
      negativeMarks: firstNumber(row, ["negativeMarks", "negative_marks", "penalty"], type === "mcq" ? firstNumber(row, ["marks", "positiveMarks", "positive_marks"], 1) / 3 : 0)
    } satisfies GateQuestion;
  });
}

export function getBuildQuestions(value: unknown, fallbackPaper: string) {
  const raw = record(value);
  return normalizeGateQuestions(raw.questions ?? value, fallbackPaper);
}

export function formatGateNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function topicFromSlug(topics: GateTopic[], slug: string) {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

/** Attach playable counts to a full syllabus map, dropping zero-question leaves in the UI. */
export function enrichGateTopics(topics: GateTopic[], questions: GateQuestion[]) {
  return topics.map((topic) => {
    const matching = questions.filter((question) => question.topic === topic.slug);
    return { ...topic, questionCount: matching.length || topic.questionCount, years: [...new Set(matching.map((question) => question.year).filter((year): year is number => Boolean(year)))].sort((a, b) => b - a) };
  }).filter((topic) => topic.questionCount > 0);
}
