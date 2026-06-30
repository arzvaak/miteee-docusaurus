import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Course, NoteIndexItem } from "@/scripts/build-content-data";
import { truncateText } from "@/lib/text";

export type { Course, NoteIndexItem };

const generatedRoot = path.join(process.cwd(), "data/generated");

type Catalog = {
  generatedAt: string;
  sourceRoots: { notes: string; assets: string };
  totals: {
    courses: number;
    notes: number;
    runnableNotes: number;
    quizzes: number;
    questions: number;
    practicePrompts: number;
    mermaidNotes: number;
    mathNotes: number;
  };
  courses: Course[];
};

export type Note = NoteIndexItem;

export type NotePreview = {
  slug: string;
  title: string;
  label: string;
  aliases: string[];
  headings: string[];
  courseCode: string | null;
  courseName: string | null;
  week: number | null;
  excerpt: string;
  runnable: boolean;
  stats: NoteIndexItem["stats"];
};

export type CourseNavigationItem = NotePreview & {
  current: boolean;
};

export type CourseNavigationGroup = {
  key: string;
  label: string;
  notes: CourseNavigationItem[];
};

export type NoteNavigation = {
  previous: NotePreview | null;
  next: NotePreview | null;
  groups: CourseNavigationGroup[];
  position: number;
  total: number;
};

const sscCglSubjectOrder = ["reasoning", "ga", "quant", "english"];
const sscCglSubjectLabels: Record<string, string> = {
  reasoning: "General Intelligence and Reasoning",
  ga: "General Awareness",
  quant: "Quantitative Aptitude",
  english: "English Comprehension"
};

function readJson<T>(relativePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(generatedRoot, relativePath), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export const getCatalog = cache(() =>
  readJson<Catalog>("catalog.json", {
    generatedAt: "",
    sourceRoots: { notes: "docs", assets: "public/content-assets" },
    totals: {
      courses: 0,
      notes: 0,
      runnableNotes: 0,
      quizzes: 0,
      questions: 0,
      practicePrompts: 0,
      mermaidNotes: 0,
      mathNotes: 0
    },
    courses: []
  })
);

export const getNotesIndex = cache(() => readJson<Omit<NoteIndexItem, "content">[]>("notes-index.json", []));

export function getCourse(code: string) {
  return getCatalog().courses.find((course) => course.code.toLowerCase() === code.toLowerCase()) ?? null;
}

export function getAllCourses() {
  return [...getCatalog().courses].sort((a, b) => {
    const category = a.category.localeCompare(b.category);
    if (category !== 0) return category;
    return a.code.localeCompare(b.code);
  });
}

export function getCourseNotes(code: string) {
  return getNotesIndex()
    .filter((note) => note.courseCode === code && !isCourseSupportNote(note))
    .sort(compareCourseNotes);
}

export function getCourseNavigationGroups(code: string, currentSlug: string | null = null) {
  const groups: CourseNavigationGroup[] = [];
  const groupCounts = new Map<string, number>();
  let activeBaseKey: string | null = null;

  for (const item of getCourseNotes(code)) {
    const baseKey = groupKey(item);
    let group = groups.at(-1);
    if (!group || activeBaseKey !== baseKey) {
      const count = groupCounts.get(baseKey) || 0;
      groupCounts.set(baseKey, count + 1);
      group = {
        key: count === 0 ? baseKey : `${baseKey}-${count + 1}`,
        label: groupLabel(item),
        notes: []
      };
      groups.push(group);
      activeBaseKey = baseKey;
    }
    group.notes.push({ ...toNotePreview(item), current: item.slug === currentSlug });
  }

  return withUniqueCourseGroupLabels(groups);
}

function withUniqueCourseGroupLabels(groups: CourseNavigationGroup[]) {
  const labelCounts = new Map<string, number>();
  for (const group of groups) labelCounts.set(group.label, (labelCounts.get(group.label) || 0) + 1);

  return groups.map((group) => {
    if ((labelCounts.get(group.label) || 0) <= 1) return group;
    return { ...group, label: detailedGroupLabel(group) };
  });
}

function detailedGroupLabel(group: CourseNavigationGroup) {
  const first = group.notes[0]?.label || group.label;
  const last = group.notes.at(-1)?.label || first;
  const detail = first === last ? first : `${first} - ${last}`;
  return `${group.label}: ${truncateText(cleanInlineMarkdown(detail), 68)}`;
}

function groupLabel(note: Omit<NoteIndexItem, "content">) {
  if (note.courseCode === "SSC-CGL") return sscCglSubjectLabel(note);
  if (note.week) return `Week ${note.week}`;
  const structuredLabel = structuredPathGroupLabel(note);
  if (structuredLabel) return structuredLabel;
  const labelSource = `${note.sidebarLabel} ${note.title} ${note.relativePath}`;
  if (/tutorial/i.test(labelSource)) return "Tutorials";
  if (/question|pyq|bank|drill|revision|overview|summary|strategy|reference/i.test(labelSource)) return "Reference";
  return "Lessons";
}

function groupKey(note: Omit<NoteIndexItem, "content">) {
  if (note.courseCode === "SSC-CGL") return `ssc-cgl-${sscCglSubjectKey(note)}`;
  if (note.week) return `week-${String(note.week).padStart(2, "0")}`;
  const structuredKey = structuredPathGroupKey(note);
  return structuredKey || groupLabel(note).toLowerCase();
}

function compareCourseNotes(a: Omit<NoteIndexItem, "content">, b: Omit<NoteIndexItem, "content">) {
  if (a.courseCode === "SSC-CGL" || b.courseCode === "SSC-CGL") {
    const subjectOrder = sscCglSubjectRank(a) - sscCglSubjectRank(b);
    if (subjectOrder !== 0) return subjectOrder;
    const pathOrder = compareRelativePaths(a.relativePath, b.relativePath, a.courseFolder || b.courseFolder || null);
    if (pathOrder !== 0) return pathOrder;
  }

  if (usesStructuredPathOrder(a) || usesStructuredPathOrder(b)) {
    const pathOrder = compareRelativePaths(a.relativePath, b.relativePath, a.courseFolder || b.courseFolder || null);
    if (pathOrder !== 0) return pathOrder;
  }

  const introOrder = readingIntroRank(a) - readingIntroRank(b);
  if (introOrder !== 0) return introOrder;

  if (usesNumberedPathOrder(a) || usesNumberedPathOrder(b)) {
    const pathOrder = compareRelativePaths(a.relativePath, b.relativePath, a.courseFolder || b.courseFolder || null);
    if (pathOrder !== 0) return pathOrder;
  }

  if (usesWeekFirstOrder(a) || usesWeekFirstOrder(b)) {
    const weekA = a.week;
    const weekB = b.week;
    if (weekA !== null || weekB !== null) {
      if (weekA !== null && weekB !== null && weekA !== weekB) return weekA - weekB;
      if (weekA !== null && weekB === null) return -1;
      if (weekA === null && weekB !== null) return 1;
    }
  }

  const positionOrder = (a.sidebarPosition ?? 9999) - (b.sidebarPosition ?? 9999);
  if (positionOrder !== 0) return positionOrder;
  return compareRelativePaths(a.relativePath, b.relativePath, a.courseFolder || b.courseFolder || null);
}

function sscCglSubjectKey(note: Omit<NoteIndexItem, "content">) {
  return coursePathSegments(note.relativePath, note.courseFolder)[0] || "misc";
}

function sscCglSubjectRank(note: Omit<NoteIndexItem, "content">) {
  const index = sscCglSubjectOrder.indexOf(sscCglSubjectKey(note));
  return index === -1 ? 99 : index;
}

function sscCglSubjectLabel(note: Omit<NoteIndexItem, "content">) {
  const key = sscCglSubjectKey(note);
  return sscCglSubjectLabels[key] || titleFromPathSegment(key);
}

function isCourseSupportNote(note: Omit<NoteIndexItem, "content">) {
  const segments = coursePathSegments(note.relativePath, note.courseFolder);
  return segments.some((segment) => /^(diagram_sources|assets?|images?|img|downloads?)$/i.test(segment)) && /^readme\.mdx?$/i.test(segments.at(-1) || "");
}

function usesStructuredPathOrder(note: Omit<NoteIndexItem, "content">) {
  return note.relativePath.split("/").some((segment) => /^class-\d+$/i.test(segment));
}

function readingIntroRank(note: Omit<NoteIndexItem, "content">) {
  const segments = coursePathSegments(note.relativePath, note.courseFolder);
  const fileName = segments.at(-1) || "";
  if (segments.length === 1 && /^(overview|index)\.mdx?$/i.test(fileName)) return 0;
  if (segments.length === 1 && (/^00[-_]/.test(fileName) || /master[-_]summary/i.test(fileName))) return 1;
  return 10;
}

function usesNumberedPathOrder(note: Omit<NoteIndexItem, "content">) {
  return coursePathSegments(note.relativePath, note.courseFolder).some((segment) => /^\d+[-_]/.test(segment) || /^00[-_]/.test(segment));
}

function usesWeekFirstOrder(note: Omit<NoteIndexItem, "content">) {
  return coursePathSegments(note.relativePath, note.courseFolder).some((segment) => /^week[-_\s]?\d+/i.test(segment));
}

function compareRelativePaths(aPath: string, bPath: string, courseFolder: string | null) {
  const aSegments = coursePathSegments(aPath, courseFolder);
  const bSegments = coursePathSegments(bPath, courseFolder);
  const length = Math.max(aSegments.length, bSegments.length);

  for (let index = 0; index < length; index += 1) {
    const aSegment = aSegments[index];
    const bSegment = bSegments[index];
    if (aSegment === undefined) return -1;
    if (bSegment === undefined) return 1;
    const order = comparePathSegment(aSegment, bSegment);
    if (order !== 0) return order;
  }

  return 0;
}

function coursePathSegments(relativePath: string, courseFolder: string | null) {
  const normalizedFolder = courseFolder ? `${courseFolder.replace(/\\/g, "/").replace(/\/$/, "")}/` : "";
  const coursePath = normalizedFolder && relativePath.startsWith(normalizedFolder) ? relativePath.slice(normalizedFolder.length) : relativePath;
  return coursePath.split("/");
}

function comparePathSegment(aSegment: string, bSegment: string) {
  const priority = segmentPriority(aSegment) - segmentPriority(bSegment);
  if (priority !== 0) return priority;
  return naturalCompare(aSegment, bSegment);
}

function segmentPriority(segment: string) {
  if (/^overview\.mdx?$/i.test(segment)) return -2;
  if (/^index\.mdx?$/i.test(segment)) return -1;
  return 0;
}

function naturalCompare(aValue: string, bValue: string) {
  const aParts = aValue.toLowerCase().match(/\d+|\D+/g) || [aValue.toLowerCase()];
  const bParts = bValue.toLowerCase().match(/\d+|\D+/g) || [bValue.toLowerCase()];
  const length = Math.max(aParts.length, bParts.length);

  for (let index = 0; index < length; index += 1) {
    const aPart = aParts[index];
    const bPart = bParts[index];
    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;

    const aNumber = /^\d+$/.test(aPart) ? Number(aPart) : null;
    const bNumber = /^\d+$/.test(bPart) ? Number(bPart) : null;
    if (aNumber !== null && bNumber !== null && aNumber !== bNumber) return aNumber - bNumber;
    if (aPart !== bPart) return aPart.localeCompare(bPart);
  }

  return 0;
}

function structuredPathGroupKey(note: Omit<NoteIndexItem, "content">) {
  const segments = coursePathSegments(note.relativePath, note.courseFolder);
  const classIndex = segments.findIndex((segment) => /^class-\d+$/i.test(segment));
  if (classIndex < 0) return null;
  const book = segments[classIndex + 1];
  if (!book) return segments[classIndex]!;
  return `${segments[classIndex]}/${book}`;
}

function structuredPathGroupLabel(note: Omit<NoteIndexItem, "content">) {
  const key = structuredPathGroupKey(note);
  if (!key) return null;
  return key.split("/").map(titleFromPathSegment).join(" · ");
}

function titleFromPathSegment(segment: string) {
  return segment
    .replace(/\.(md|mdx)$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part, index) => {
      if (/^\d+$/.test(part)) return part;
      if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(part)) return part.toUpperCase();
      if (index > 0 && /^(a|an|and|at|for|in|of|on|or|the|to)$/i.test(part)) return part.toLowerCase();
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}

export function getNoteNavigation(note: Note | Omit<NoteIndexItem, "content">): NoteNavigation {
  const courseNotes = note.courseCode ? getCourseNotes(note.courseCode) : getNotesIndex();
  const currentIndex = courseNotes.findIndex((item) => item.slug === note.slug);
  const position = currentIndex >= 0 ? currentIndex + 1 : 1;
  const previous = currentIndex > 0 ? toNotePreview(courseNotes[currentIndex - 1]!) : null;
  const next = currentIndex >= 0 && currentIndex < courseNotes.length - 1 ? toNotePreview(courseNotes[currentIndex + 1]!) : null;
  const groups = note.courseCode ? getCourseNavigationGroups(note.courseCode, note.slug) : [];

  return {
    previous,
    next,
    groups,
    position,
    total: courseNotes.length
  };
}

export function getNote(slug: string) {
  return readJson<Note | null>(`notes/${slug}.json`, null);
}

export function toNotePreview(note: Omit<NoteIndexItem, "content">): NotePreview {
  return {
    slug: note.slug,
    title: note.title,
    label: note.sidebarLabel || note.title,
    aliases: [note.relativePath, note.sourcePath, path.basename(note.relativePath, path.extname(note.relativePath))].filter(Boolean),
    headings: note.headings.map((heading) => heading.text),
    courseCode: note.courseCode,
    courseName: note.courseName,
    week: note.week,
    excerpt: truncateText(cleanInlineMarkdown(note.excerpt || note.description), 190),
    runnable: note.runnable,
    stats: note.stats
  };
}

export function getPreviewCandidates(limit = 32) {
  const notes = getNotesIndex();
  const questionHeavy = notes.filter((note) => note.stats.questionBlocks > 0).slice(0, Math.ceil(limit / 3));
  const mathHeavy = notes.filter((note) => note.stats.mathBlocks > 0).slice(0, Math.ceil(limit / 3));
  const diagrams = notes.filter((note) => note.stats.mermaidBlocks > 0).slice(0, Math.ceil(limit / 3));
  const merged = [...questionHeavy, ...mathHeavy, ...diagrams, ...notes];
  const seen = new Set<string>();

  return merged
    .filter((note) => {
      if (seen.has(note.slug)) return false;
      seen.add(note.slug);
      return true;
    })
    .slice(0, limit)
    .map(toNotePreview);
}

export function getSearchCandidates() {
  return getNotesIndex().map(toNotePreview);
}

export function getResolvedPreviewsForNote(note: Note) {
  const sameCourse = getNotesIndex()
    .filter((item) => item.courseCode === note.courseCode && item.slug !== note.slug)
    .sort((a, b) => Math.abs((a.week ?? 99) - (note.week ?? 99)) - Math.abs((b.week ?? 99) - (note.week ?? 99)))
    .slice(0, 8)
    .map(toNotePreview);

  return sameCourse;
}

export function getFeaturedCourses() {
  return [...getCatalog().courses]
    .sort((a, b) => b.questionCount + (b.practicePromptCount ?? 0) + b.noteCount * 10 + b.runnableNoteCount * 4 - (a.questionCount + (a.practicePromptCount ?? 0) + a.noteCount * 10 + a.runnableNoteCount * 4))
    .slice(0, 8);
}

export function courseDisplaySummary(course: Course) {
  const practiceCount = course.questionCount + (course.practicePromptCount ?? 0);
  const practiceLabel = (course.practicePromptCount ?? 0) > 0 ? "practice prompts" : "question sections";
  const codeLabel = course.runnableNoteCount === 1 ? "code note" : "code notes";
  const scope = [course.level, course.category].filter((item, index, items) => item && items.indexOf(item) === index).join(" ");
  const metrics = [
    `${formatNumber(course.noteCount)} notes`,
    `${formatNumber(practiceCount)} ${practiceLabel}`,
    course.runnableNoteCount > 0 ? `${formatNumber(course.runnableNoteCount)} ${codeLabel}` : ""
  ].filter(Boolean).join(", ");

  return `${course.name} study dashboard with ${metrics}${scope ? ` for ${scope}` : ""}. Use the reading order, course map, and practice panels to move through the material without losing your place.`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\|/g, " ")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
