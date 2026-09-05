import fs from "node:fs";
import path from "node:path";
import type { SscQuantBook, SscQuantBookChapter, SscQuantBookExercise, SscQuantBookOption, SscQuantBookSection, SscQuantBookStimulus, SscQuantWorkedExample } from "@/lib/ssc-quant-book-types";
export type { SscQuantBook, SscQuantBookChapter, SscQuantBookExercise, SscQuantBookOption, SscQuantBookSection, SscQuantBookStimulus, SscQuantWorkedExample } from "@/lib/ssc-quant-book-types";

type UnknownRecord = Record<string, unknown>;

const quantBookPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "quant-book", "index.json");
let cache: SscQuantBook | null = null;
let cacheFingerprint: string | null = null;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {};
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function contentText(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((item) => contentText(item)).filter(Boolean).join("\n\n");
  const row = record(value);
  const nested = row.markdown ?? row.content ?? row.body ?? row.text;
  return nested === value ? fallback : contentText(nested, fallback);
}

function number(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

function provenance(value: unknown) {
  const row = record(value);
  const pages = Array.isArray(row.pdfPages) ? row.pdfPages.map((item) => number(item)).filter((item) => item > 0) : undefined;
  return { sourceId: text(row.sourceId) || undefined, pdfPages: pages?.length ? pages : undefined };
}

function options(value: unknown): SscQuantBookOption[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const parsed = value.map((item, index) => {
    if (typeof item === "string") return { id: String.fromCharCode(97 + index), text: item };
    const row = record(item);
    return { id: text(row.id, String.fromCharCode(97 + index)).trim().toLowerCase(), text: contentText(row.text ?? row.label) };
  }).filter((item) => item.text);
  return parsed.length ? parsed : undefined;
}

function stimulus(value: unknown): SscQuantBookStimulus | undefined {
  const row = record(value);
  const type = text(row.type).toLowerCase();
  if (type === "table" || Array.isArray(row.rows) || Array.isArray(row.headers)) {
    const rows = Array.isArray(row.rows) ? row.rows.map((item) => Array.isArray(item) ? item.map((cell) => text(cell)) : [text(item)]) : [];
    const headers = stringList(row.headers);
    return { type: "table", headers, rows, caption: text(row.caption) || undefined };
  }
  if (type === "image" || row.src) {
    const src = text(row.src ?? row.url);
    if (!src) return undefined;
    return { type: "image", src, alt: text(row.alt, text(row.caption, "Quantitative aptitude stimulus")), caption: text(row.caption) || undefined };
  }
  if (type === "diagram" && Array.isArray(row.nodes) && Array.isArray(row.edges)) {
    const nodes = row.nodes.map((item, index) => {
      const node = record(item);
      return { id: text(node.id, `node-${index + 1}`), label: text(node.label), x: number(node.x), y: number(node.y) };
    }).filter((node) => node.label);
    const edges = row.edges.map((item) => {
      const edge = record(item);
      return { from: text(edge.from), to: text(edge.to), label: text(edge.label) || undefined };
    }).filter((edge) => edge.from && edge.to);
    if (!nodes.length) return undefined;
    return { type: "diagram", nodes, edges, ariaLabel: text(row.ariaLabel, text(row.caption, "Quantitative aptitude diagram")), caption: text(row.caption) || undefined };
  }
  if (type === "chart" || Array.isArray(row.labels) || Array.isArray(row.values)) {
    const values = Array.isArray(row.values) ? row.values.map((item) => number(item)).filter((item) => Number.isFinite(item)) : [];
    const labels = stringList(row.labels);
    const kindText = text(row.kind).toLowerCase();
    const kind = kindText === "line" || kindText === "pie" ? kindText : "bar";
    return { type: "chart", kind, labels, values, ariaLabel: text(row.ariaLabel, text(row.caption, "Quantitative aptitude chart")), caption: text(row.caption) || undefined };
  }
  return undefined;
}

function normalizeSection(value: unknown, index: number): SscQuantBookSection {
  if (typeof value === "string") return { id: `section-${index + 1}`, title: `Section ${index + 1}`, content: value };
  const row = record(value);
  const type = text(row.type).toLowerCase();
  const defaultTitle = type === "notes" ? "Chapter notes" : type === "exercise" ? "Chapter exercises" : type === "answer-key" ? "Printed answer key" : `Section ${index + 1}`;
  return {
    id: text(row.id, type ? `section-${index + 1}-${type}` : `section-${index + 1}`),
    title: text(row.title ?? row.heading, defaultTitle),
    content: contentText(row.content ?? row.body ?? row.text),
    pdfPageStart: number(row.pdfPageStart, 0) || undefined,
    pdfPageEnd: number(row.pdfPageEnd, 0) || undefined,
    stimulus: stimulus(row.stimulus ?? row.visual ?? row.data ?? row)
  };
}

function normalizeExample(value: unknown, index: number): SscQuantWorkedExample {
  const row = record(value);
  const answer = text(row.answer ?? row.correctAnswer ?? row.key);
  const sourceText = contentText(row.text ?? row.content);
  return {
    id: text(row.id, `example-${index + 1}`),
    title: text(row.title ?? row.heading ?? row.label, `Worked example ${index + 1}`),
    prompt: contentText(row.prompt ?? row.question ?? row.stem ?? row.text),
    steps: stringList(row.steps ?? row.solutionSteps ?? row.method),
    answer,
    solution: contentText(row.solution ?? row.explanation ?? row.answerExplanation, sourceText || answer),
    pdfPageStart: number(row.pdfPageStart, 0) || undefined,
    pdfPageEnd: number(row.pdfPageEnd, 0) || undefined,
    provenance: provenance(row.provenance),
    options: options(row.options),
    correctOption: text(row.correctOption ?? row.correct, "").trim().toLowerCase() || undefined,
    stimulus: stimulus(row.stimulus ?? row.visual ?? row.data ?? row)
  };
}

function normalizeExercise(value: unknown, index: number): SscQuantBookExercise {
  const row = record(value);
  return {
    id: text(row.id, `exercise-${index + 1}`),
    prompt: text(row.prompt ?? row.question ?? row.stem),
    options: options(row.options),
    correctOption: text(row.correctOption ?? row.correct, "").trim().toLowerCase() || undefined,
    answer: text(row.answer ?? row.correctAnswer, "") || undefined,
    solution: contentText(row.solution, "") || undefined,
    explanation: contentText(row.explanation, "") || undefined,
    pdfPageStart: number(row.pdfPageStart, 0) || undefined,
    pdfPageEnd: number(row.pdfPageEnd, 0) || undefined,
    provenance: provenance(row.provenance),
    stimulus: stimulus(row.stimulus ?? row.data ?? row)
  };
}

function normalizeChapter(value: unknown, index: number): SscQuantBookChapter {
  const row = record(value);
  const sectionsValue = row.sections ?? row.content;
  const chapterContent = contentText(row.content);
  const examplesValue = row.examples ?? row.workedExamples ?? [];
  const exercisesValue = row.exercises ?? row.practice ?? [];
  const sections = Array.isArray(sectionsValue)
    ? sectionsValue.map((item, sectionIndex) => {
      const normalized = normalizeSection(item, sectionIndex);
      const type = text(record(item).type).toLowerCase();
      return type === "notes" && !normalized.content ? { ...normalized, content: chapterContent } : normalized;
    })
    : [{ id: "section-1", title: "Chapter notes", content: chapterContent || contentText(sectionsValue) }];
  return {
    slug: text(row.slug, `chapter-${index + 1}`),
    title: text(row.title, `Chapter ${index + 1}`),
    chapterNumber: number(row.chapterNumber ?? row.number, index + 1),
    pdfPageStart: number(row.pdfPageStart ?? row.pageStart, 0),
    pdfPageEnd: number(row.pdfPageEnd ?? row.pageEnd, 0),
    sections,
    examples: Array.isArray(examplesValue) ? examplesValue.map(normalizeExample) : [],
    exercises: Array.isArray(exercisesValue) ? exercisesValue.map(normalizeExercise) : []
  };
}

function readBook(): SscQuantBook {
  try {
    const raw = JSON.parse(fs.readFileSync(quantBookPath, "utf8")) as UnknownRecord;
    const chapterValues = Array.isArray(raw.chapters) ? raw.chapters : [];
    return {
      generatedAt: text(raw.generatedAt) || undefined,
      sourceTitle: text(raw.sourceTitle ?? record(raw.source).title) || undefined,
      chapters: chapterValues.map(normalizeChapter).sort((a, b) => a.chapterNumber - b.chapterNumber)
    };
  } catch {
    return { chapters: [] };
  }
}

export function getSscQuantBook(): SscQuantBook {
  let fingerprint: string | null = null;
  try {
    const stats = fs.statSync(quantBookPath);
    fingerprint = `${stats.size}:${stats.mtimeMs}`;
  } catch {
    // The empty state is intentional before the PDF-data worker publishes its index.
  }
  if (!cache || fingerprint !== cacheFingerprint) {
    cache = readBook();
    cacheFingerprint = fingerprint;
  }
  return cache;
}

export function getSscQuantBookChapters() {
  return getSscQuantBook().chapters;
}

export function getSscQuantBookChapter(slug: string) {
  return getSscQuantBookChapters().find((chapter) => chapter.slug === slug) ?? null;
}

export function sscQuantBookChapterHref(slug: string) {
  return `/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${slug}`;
}

export function sscQuantBookPracticeHref(slug: string) {
  return `${sscQuantBookChapterHref(slug)}/practice`;
}
