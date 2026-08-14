import fs from "node:fs";
import path from "node:path";
import type { CatQuantQuestion, CatQuantTopic } from "@/lib/exam-types";

export type GeneratedCatData = {
  generatedAt: string;
  exam: {
    code: "CAT";
    activeSection: "quantitative-aptitude";
    sourceTitle: string;
  };
  questions: CatQuantQuestion[];
  topics: CatQuantTopic[];
};

const generatedPath = path.join(process.cwd(), "data", "generated", "exams", "cat", "index.json");
let generatedDataCache: GeneratedCatData | null = null;
let generatedDataFingerprint: string | null = null;

function readData(): GeneratedCatData {
  try {
    return JSON.parse(fs.readFileSync(generatedPath, "utf8")) as GeneratedCatData;
  } catch {
    return {
      generatedAt: "",
      exam: {
        code: "CAT",
        activeSection: "quantitative-aptitude",
        sourceTitle: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
      },
      questions: [],
      topics: []
    };
  }
}

export function validateCatQuantData(data: GeneratedCatData, root = process.cwd()) {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const question of data.questions) {
    if (ids.has(question.id)) errors.push(`Duplicate CAT question id: ${question.id}`);
    ids.add(question.id);
    if (question.exam !== "CAT" || question.section !== "quantitative-aptitude") errors.push(`Invalid CAT identity: ${question.id}`);
    if (question.questionType === "mcq" && (question.options?.length !== 4 || !question.correctOption)) errors.push(`Invalid CAT MCQ: ${question.id}`);
    if (question.questionType === "tita" && !question.correctAnswer) errors.push(`Invalid CAT TITA: ${question.id}`);
    if (question.stimulus?.type === "image" && (!question.stimulus.alt.trim() || !question.stimulus.src.startsWith("/content-assets/cat/quant/"))) {
      errors.push(`Invalid CAT image stimulus: ${question.id}`);
    }
    if (question.stimulus?.type === "image" && !fs.existsSync(path.join(root, "public", ...question.stimulus.src.split("/").filter(Boolean)))) {
      errors.push(`Missing CAT image stimulus asset: ${question.id}`);
    }
    if (!question.explanation.trim()) errors.push(`Missing CAT explanation: ${question.id}`);
  }
  const knownTopics = new Set(data.topics.map((topic) => topic.slug));
  for (const topic of data.topics) {
    for (const id of topic.questionIds) if (!ids.has(id)) errors.push(`Unknown CAT question ${id} in ${topic.slug}`);
  }
  for (const question of data.questions.filter((item) => item.reviewStatus === "reviewed")) {
    if (!knownTopics.has(question.topic) && !data.topics.some((topic) => topic.chapterNumber === question.chapterNumber)) {
      errors.push(`CAT question ${question.id} has no topic`);
    }
  }
  return { ok: errors.length === 0, errors, questions: data.questions.length, topics: data.topics.length };
}

export function getCatData() {
  let fingerprint: string | null = null;
  try {
    const stats = fs.statSync(generatedPath);
    fingerprint = `${stats.size}:${stats.mtimeMs}`;
  } catch {
    // I keep the explicit empty fallback available before the first content build.
  }
  if (!generatedDataCache || (fingerprint !== null && fingerprint !== generatedDataFingerprint)) {
    generatedDataCache = readData();
    generatedDataFingerprint = fingerprint;
  }
  return generatedDataCache;
}

export function getCatQuantQuestions() {
  return getCatData().questions.filter((question) => question.reviewStatus === "reviewed");
}

export function getCatQuantTopics() {
  return getCatData().topics;
}

export function getCatQuantTopic(slug: string) {
  return getCatQuantTopics().find((topic) => topic.slug === slug) ?? null;
}

export function getCatQuantPracticeSet(slug: string) {
  const data = getCatData();
  const topic = data.topics.find((item) => item.slug === slug);
  if (!topic) return null;
  const questionIds = new Set(topic.questionIds);
  const questions = data.questions.filter((question) => question.reviewStatus === "reviewed" && questionIds.has(question.id));
  const index = data.topics.findIndex((item) => item.slug === slug);
  return {
    topic,
    questions,
    previousTopic: index > 0 ? data.topics[index - 1] ?? null : null,
    nextTopic: index >= 0 && index < data.topics.length - 1 ? data.topics[index + 1] ?? null : null
  };
}
