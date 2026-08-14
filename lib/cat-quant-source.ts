import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCatQuantQuestionsPath } from "@/lib/cat-corpus-paths";
import type { CatQuantOptionId, CatQuantQuestion, CatQuantQuestionStimulus, CatQuantTopic, SscCglOption } from "@/lib/exam-types";

type UnknownRow = Record<string, unknown>;

const chapters = [
  { slug: "number-system", title: "Number System", topic: "number-system" },
  { slug: "averages", title: "Averages", topic: "averages" },
  { slug: "alligations", title: "Alligations", topic: "mixtures-alligation" },
  { slug: "ratio-proportion-variations", title: "Ratio, Proportion & Variations", topic: "ratio-proportion-variation" },
  { slug: "percentages", title: "Percentages", topic: "percentages" },
  { slug: "profit-loss-discount", title: "Profit, Loss and Discount", topic: "profit-loss-discount" },
  { slug: "ci-si-instalments", title: "CI/SI/Instalments", topic: "simple-compound-interest" },
  { slug: "time-and-work", title: "Time and Work", topic: "time-work" },
  { slug: "time-speed-distance", title: "Time, Speed and Distance", topic: "time-speed-distance" },
  { slug: "mensuration", title: "Mensuration", topic: "mensuration" },
  { slug: "trigonometry", title: "Trigonometry", topic: "trigonometry" },
  { slug: "geometry", title: "Geometry", topic: "geometry" },
  { slug: "elements-of-algebra", title: "Elements of Algebra", topic: "algebra" },
  { slug: "theory-of-equations", title: "Theory of Equations", topic: "equations" },
  { slug: "set-theory", title: "Set Theory", topic: "set-theory" },
  { slug: "logarithm", title: "Logarithm", topic: "logarithms" },
  { slug: "functions-and-graphs", title: "Functions and Graphs", topic: "functions-graphs" },
  { slug: "sequence-series-progressions", title: "Sequence, Series & Progressions", topic: "sequences-series" },
  { slug: "permutations-combinations", title: "Permutations & Combinations", topic: "permutations-combinations" },
  { slug: "probability", title: "Probability", topic: "probability" },
  { slug: "coordinate-geometry", title: "Co-ordinate Geometry", topic: "coordinate-geometry" }
] as const;

export function catQuantSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function object(value: unknown): UnknownRow | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRow : null;
}

function text(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function number(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOptionId(value: unknown): CatQuantOptionId | null {
  const normalized = String(value ?? "").toLowerCase().replace(/[^a-d]/g, "");
  return normalized === "a" || normalized === "b" || normalized === "c" || normalized === "d" ? normalized : null;
}

function normalizeOptions(value: unknown): SscCglOption[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const options = value.map((item, index) => {
    const row = object(item);
    const id = normalizeOptionId(row?.id) ?? (["a", "b", "c", "d"] as const)[index] ?? null;
    const optionText = text(row?.text ?? item);
    return id && optionText ? { id, text: optionText } : null;
  }).filter((item): item is SscCglOption => Boolean(item));
  return options.length === 4 ? options : undefined;
}

function normalizeStimulus(value: unknown): CatQuantQuestionStimulus | undefined {
  const row = object(value);
  if (row?.type === "image") {
    const src = text(row.src);
    const alt = text(row.alt);
    const safePath = /^\/content-assets\/cat\/quant\/[a-z0-9-]+\/[a-zA-Z0-9._-]+\.(?:png|jpe?g|webp|gif|svg)$/i.test(src) && !src.includes("..");
    if (!safePath || !alt) return undefined;
    return { type: "image", src, alt, caption: text(row.caption) || undefined };
  }
  if (row?.type !== "table" || !Array.isArray(row.columns) || !Array.isArray(row.rows)) return undefined;
  const columns = row.columns.map(String);
  const rows = row.rows.filter(Array.isArray).map((cells) => cells.map(String));
  if (columns.length === 0 || rows.length === 0) return undefined;
  return {
    type: "table",
    columns,
    rows,
    caption: text(row.caption) || undefined,
    reconstructionNote: text(row.reconstructionNote) || undefined
  };
}

function chapterFromRow(row: UnknownRow) {
  const provenance = object(row.provenance);
  const explicit = number(row.chapterNumber ?? provenance?.chapterNumber, 0);
  const rawTitle = text(row.chapterTitle ?? provenance?.chapterTitle ?? row.subtopic ?? row.topic);
  const titleIndex = chapters.findIndex((chapter) => catQuantSlug(chapter.title) === catQuantSlug(rawTitle) || chapter.slug === catQuantSlug(rawTitle) || chapter.topic === catQuantSlug(rawTitle));
  const chapterNumber = explicit >= 1 && explicit <= chapters.length ? explicit : titleIndex + 1;
  const safeNumber = chapterNumber >= 1 ? chapterNumber : 1;
  const chapterTitle = text(provenance?.chapterTitle ?? row.chapterTitle, (chapters[safeNumber - 1]?.title ?? rawTitle) || "Number System");
  return { chapterNumber: safeNumber, chapterTitle };
}

function normalizeQuestion(value: unknown, index: number): CatQuantQuestion | null {
  const row = object(value);
  if (!row) return null;
  const { chapterNumber, chapterTitle } = chapterFromRow(row);
  const provenance = object(row.provenance) ?? {};
  const options = normalizeOptions(row.options);
  const correctOption = normalizeOptionId(row.correctOption ?? row.answerOption ?? row.answer);
  const correctAnswer = text(row.correctAnswer);
  const questionType = row.questionType === "tita" || (!options && correctAnswer) ? "tita" : "mcq";
  const stem = text(row.stem ?? row.question);
  const rawStimulus = object(row.stimulus);
  const stimulus = normalizeStimulus(row.stimulus);
  if (rawStimulus && (rawStimulus.type === "image" || rawStimulus.type === "table") && !stimulus) return null;
  if (!stem || (questionType === "mcq" && (!options || !correctOption)) || (questionType === "tita" && !correctAnswer)) return null;
  const topic = catQuantSlug(text(row.topic, chapterTitle)) || catQuantSlug(chapterTitle);
  const reviewStatus = row.reviewStatus === "needs_review" || row.reviewStatus === "rejected" ? row.reviewStatus : "reviewed";

  return {
    id: text(row.id, `cat-quant-${String(index + 1).padStart(5, "0")}`),
    exam: "CAT",
    section: "quantitative-aptitude",
    topic,
    subtopic: text(row.subtopic, chapterTitle),
    chapterNumber,
    difficulty: row.difficulty === "easy" || row.difficulty === "hard" ? row.difficulty : "medium",
    questionType,
    stem,
    stimulus,
    options,
    correctOption: questionType === "mcq" ? correctOption ?? undefined : undefined,
    correctAnswer: questionType === "tita" ? correctAnswer : undefined,
    explanation: text(row.explanation ?? row.solution, "Solution is pending review."),
    reviewStatus,
    ocrConfidence: Math.max(0, Math.min(1, number(row.ocrConfidence, 1))),
    conceptTags: Array.isArray(row.conceptTags) ? row.conceptTags.map(String) : [topic],
    provenance: {
      sourceId: text(provenance.sourceId, "quantum-cat-sarvesh-k-verma"),
      sourceType: "book_user_provided",
      title: text(provenance.title, "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"),
      file: text(provenance.file) || undefined,
      pageNumber: number(provenance.pageNumber ?? row.pageNumber, 0) || undefined,
      chapterTitle,
      licenseNote: text(provenance.licenseNote, "User-provided study source; access is limited to this site's learning workflow.")
    }
  };
}

export function buildCatQuantQuestions(root = process.cwd()) {
  const filePath = getCatQuantQuestionsPath(root);
  if (!fs.existsSync(filePath)) return [];
  const payload: unknown = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const rows = Array.isArray(payload) ? payload : object(payload)?.questions;
  if (!Array.isArray(rows)) return [];
  const seen = new Set<string>();
  return rows
    .map(normalizeQuestion)
    .filter((question): question is CatQuantQuestion => Boolean(question))
    .filter((question) => {
      if (seen.has(question.id)) return false;
      seen.add(question.id);
      return true;
    });
}

function rewriteCatNoteImageAssets(content: string, noteRelativePath: string) {
  const noteDirectory = path.posix.dirname(noteRelativePath.replace(/\\/g, "/"));
  return content.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix: string, rawTarget: string, suffix: string) => {
    const target = rawTarget.trim();
    if (!target || /^(?:https?:)?\/\//i.test(target) || target.startsWith("/") || target.startsWith("data:") || target.startsWith("#")) return match;
    const targetMatch = target.match(/^([^?#]*)([?#][\s\S]*)?$/);
    const cleanTarget = targetMatch?.[1] || target;
    const targetSuffix = targetMatch?.[2] || "";
    const assetPath = path.posix.normalize(path.posix.join(noteDirectory === "." ? "" : noteDirectory, cleanTarget));
    return `${prefix}/content-assets/${assetPath}${targetSuffix}${suffix}`;
  });
}

function noteForTopic(root: string, slug: string) {
  const notesRoot = path.join(root, "docs", "cat", "quant");
  if (!fs.existsSync(notesRoot)) return { summary: "", noteBody: "" };
  const candidates = fs.readdirSync(notesRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/i.test(entry.name))
    .map((entry) => path.join(notesRoot, entry.name));
  const notePath = candidates.find((candidate) => {
    const fileSlug = catQuantSlug(path.basename(candidate, path.extname(candidate)).replace(/^\d+[-_. ]*/, ""));
    if (fileSlug === slug) return true;
    const metadata = matter(fs.readFileSync(candidate, "utf8")).data;
    return catQuantSlug(text(metadata.slug ?? metadata.topic ?? metadata.title)) === slug;
  });
  if (!notePath) return { summary: "", noteBody: "" };
  const parsed = matter(fs.readFileSync(notePath, "utf8"));
  const noteRelativePath = path.relative(path.join(root, "docs"), notePath);
  return {
    summary: text(parsed.data.description),
    noteBody: rewriteCatNoteImageAssets(parsed.content.replace(/^#\s+[^\n]+\n+/, "").trim(), noteRelativePath)
  };
}

export function buildCatQuantTopics(questions = buildCatQuantQuestions(), root = process.cwd()): CatQuantTopic[] {
  return chapters.map((chapter, index) => {
    const { slug, title } = chapter;
    const topicQuestions = questions.filter((question) => question.chapterNumber === index + 1 || question.topic === chapter.topic || question.topic === slug);
    const note = noteForTopic(root, slug);
    return {
      slug,
      title,
      chapterNumber: index + 1,
      summary: note.summary || `Study ${title} from the Quantum CAT source, then practice every reviewed question from this chapter.`,
      noteBody: note.noteBody,
      questionIds: topicQuestions.filter((question) => question.reviewStatus === "reviewed").map((question) => question.id),
      questionCount: topicQuestions.filter((question) => question.reviewStatus === "reviewed").length
    };
  }).filter((topic) => topic.noteBody || topic.questionCount > 0);
}
