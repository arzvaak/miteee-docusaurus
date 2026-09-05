import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { normalizeLegacyMathDelimiters } from "../lib/markdown-normalize";

type BuildOptions = {
  docsRoot?: string;
  generatedRoot?: string;
  publicRoot?: string;
  staticRoot?: string;
};

type LinkRewriteOptions = {
  slugByRelativePath?: Map<string, string> | Record<string, string>;
};

export type QuizSet = {
  testName: string;
  count: number;
  typeCounts: Record<string, number>;
  imageCount: number;
  anchorId?: string;
};

export type NoteStats = {
  codeBlocks: number;
  mermaidBlocks: number;
  mathBlocks: number;
  details: number;
  questionBlocks: number;
  practicePrompts?: number;
  quizBlocks?: number;
};

export type Course = {
  code: string;
  folder: string;
  name: string;
  level: string;
  category: string;
  noteCount: number;
  runnableNoteCount: number;
  questionCount: number;
  practicePromptCount?: number;
  syllabusSummary: string[];
  quizSets: QuizSet[];
};

export type NoteIndexItem = {
  slug: string;
  title: string;
  sidebarLabel: string;
  sidebarPosition: number | null;
  description: string;
  tags: string[];
  contentType?: string | null;
  status?: string | null;
  publishedAt?: string | null;
  runnable: boolean;
  courseCode: string | null;
  courseFolder: string | null;
  courseName: string | null;
  level: string | null;
  week: number | null;
  relativePath: string;
  sourcePath: string;
  excerpt: string;
  headings: Array<{ level: number; text: string }>;
  stats: NoteStats;
  quizSets?: QuizSet[];
  content: string;
};

type Catalog = {
  generatedAt: string;
  sourceRoots: { notes: string; assets: string };
  totals: {
    courses: number;
    notes: number;
    runnableNotes: number;
    quizzes: number;
    questions: number;
    practicePrompts?: number;
    mermaidNotes: number;
    mathNotes: number;
  };
  courses: Course[];
};

const courseNames: Record<string, string> = {
  "MITEEE": "MIT EEE",
  "SEM5-DSP": "Digital Signal Processing",
  "SEM5-EM2": "Electrical Machines II",
  "SEM5-EOM": "Essentials of Management",
  "SEM5-MPC": "Design of Modern Power Converters",
  "SEM5-PSA": "Power System Analysis",
  "SEM6-CRA4409": "Data Science",
  "SEM6-EEFM": "EE Financial Management",
  "SEM6-MI": "Measurements & Instrumentation",
  "SEM6-SGT": "Smart Grid Technologies",
  "SEM6-SPM": "Sejarah Pemikiran Modern",
  "SEM7-PSPS": "Power System Protection and Switchgear",
  "SEM7-EA": "Energy Auditing (ELE 4446)",
  "SEM7-QC": "Introduction to Quantum Computing",
  "UPSC-CSE-POLITICAL-SCIENCE": "UPSC Political Science NCERT",
  "SSC-CGL": "SSC CGL Tier-I 200/200 System",
  "CAT": "CAT Quantitative Aptitude",
  "RESEARCH": "Research notes"
};

function posixPath(value: string) {
  return value.split(path.sep).join("/");
}

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`|>#~-]/g, " ")
    .replace(/:[a-z-]+:/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromMarkdown(content: string, fallback: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return cleanInlineMarkdown(heading || fallback);
}

function stripLeadingTitleHeading(content: string, title: string) {
  const normalizedTitle = cleanInlineMarkdown(title).toLowerCase();
  return content.replace(/^#\s+(.+?)\s*\r?\n+/, (match, heading: string) => {
    const normalizedHeading = cleanInlineMarkdown(heading).toLowerCase();
    return normalizedHeading === normalizedTitle ? "" : match;
  });
}

export function sentenceExcerpt(content: string, fallback: string) {
  const withoutNonProse = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ");

  const paragraph = withoutNonProse
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter((block) => {
      if (!block || /^(?:#{1,6}\s|>|\|)/.test(block)) return false;
      if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(block)) return false;
      if (/^(?:[-*+]\s|\d+[.)]\s)/.test(block)) return false;
      return true;
    })
    .map((block) => cleanInlineMarkdown(
      block
        .replace(/\$[^$\r\n]+\$/g, " ")
        .replace(/\\\([^\r\n]*?\\\)/g, " ")
    ).replace(/\s+([,.;:!?])/g, "$1"))
    .find((block) => block.length >= 36);

  const plain = paragraph || cleanInlineMarkdown(withoutNonProse.replace(/\$[^$\r\n]+\$/g, " ")) || fallback;
  return truncateAtWordBoundary(plain, 220);
}

function truncateAtWordBoundary(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const characters = Array.from(normalized);
  if (characters.length <= maxLength) return normalized;

  const clipped = characters.slice(0, maxLength + 1).join("");
  const boundary = clipped.lastIndexOf(" ");
  const safe = boundary >= Math.floor(maxLength * 0.72) ? clipped.slice(0, boundary) : characters.slice(0, maxLength).join("");
  return `${safe.replace(/[\s,;:–—-]+$/g, "")}…`;
}

function getMarkdownFiles(root: string) {
  const files: string[] = [];
  if (!fs.existsSync(root)) return files;

  function walk(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(md|mdx)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(root);
  return files.sort((a, b) => a.localeCompare(b));
}

export function slugFromRelativePath(relativePath: string) {
  return posixPath(relativePath)
    .replace(/\.(md|mdx)$/i, "")
    .replace(/\/+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function courseCodeFromSegments(segments: string[]) {
  if (segments.length <= 1) return "MITEEE";
  if (segments[0] === "ssc-cgl") return "SSC-CGL";
  if (segments[0] === "cat") return "CAT";
  if (segments[0] === "upsc-cse" && segments[1] === "political-science") return "UPSC-CSE-POLITICAL-SCIENCE";
  if (segments[0] === "upsc-cse") return segments.slice(0, Math.min(2, segments.length - 1)).join("-").toUpperCase();
  if (segments[0]?.startsWith("sem") && segments[1]) return `${segments[0]}-${segments[1]}`.toUpperCase();
  return segments[0].toUpperCase();
}

function categoryFromSegments(segments: string[]) {
  if (segments[0] === "research") return "Research";
  if (segments[0] === "ssc-cgl") return "Competitive exams";
  if (segments[0] === "cat") return "Competitive exams";
  if (segments[0] === "upsc-cse") return "Civil services";
  if (segments[0]?.startsWith("sem")) return `Semester ${segments[0].replace("sem", "")}`;
  return "General";
}

function levelFromSegments(segments: string[]) {
  if (segments[0] === "research") return "Note collection";
  if (segments[0] === "ssc-cgl") return "SSC CGL Tier-I";
  if (segments[0] === "cat") return "CAT";
  if (segments[0] === "upsc-cse") return "UPSC CSE";
  if (segments[0]?.startsWith("sem")) return `Semester ${segments[0].replace("sem", "")}`;
  return "MIT EEE";
}

function titleCase(value: string) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function courseName(code: string, segments: string[]) {
  return courseNames[code] || titleCase(segments[1] || segments[0] || "MIT EEE");
}

function courseFolderFromSegments(code: string, segments: string[]) {
  if (code === "SSC-CGL") return "ssc-cgl";
  if (code === "CAT") return "cat";
  if (code === "RESEARCH") return "research";
  return segments.slice(0, 2).join("/");
}

function isPublicLearnerNote(relativePath: string) {
  const normalized = posixPath(relativePath);
  if (normalized === "index.md" || normalized === "index.mdx") return false;
  if (normalized.startsWith("superpowers/")) return false;
  if (normalized.startsWith("ssc-cgl/")) return normalized.split("/").length >= 3;
  if (normalized.startsWith("cat/")) return normalized.split("/").length >= 3;
  return true;
}

function parseWeek(relativePath: string, title: string) {
  const source = `${relativePath} ${title}`;
  const match = source.match(/weeks?[-\s]?(\d{1,2})|minggu[-\s]?(\d{1,2})/i);
  const value = match?.[1] || match?.[2];
  return value ? Number(value) : null;
}

function parseHeadings(content: string) {
  return [...content.matchAll(/^(#{1,4})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    text: cleanInlineMarkdown(match[2] || "")
  }));
}

function noteStats(content: string): NoteStats {
  const mathReadyContent = normalizeLegacyMathDelimiters(content);
  const codeBlocks = [...content.matchAll(/```[\s\S]*?```/g)].length;
  const mermaidBlocks = [...content.matchAll(/```mermaid[\s\S]*?```/gi)].length;
  const mathBlocks = [...mathReadyContent.matchAll(/\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]+(?<!\\)\$/g)].length;
  const details = [...content.matchAll(/<details\b|:::(?:note|tip|info|warning|danger|question|exam|summary)/gi)].length;
  const headedQuestionBlocks = [...content.matchAll(/^#{2,4}\s+(?:Question|Q\.?|Soal)\s*\d+/gim)].length;
  const boldQuestionBlocks = [...content.matchAll(/^\s*\*\*(?:Question|Q)\s*\d+[\).:]?/gim)].length;
  const questionBlocks = headedQuestionBlocks + boldQuestionBlocks;
  const practicePrompts = [...content.matchAll(/^#{2,4}\s+(?:Prelims\s+Drill|Mains\s+Answer\s+Practice)\s*$/gim)].length;
  return { codeBlocks, mermaidBlocks, mathBlocks, details, questionBlocks, practicePrompts };
}

function countQuestionTableRows(body: string) {
  const lines = body.split(/\r?\n/);
  let total = 0;

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|/.test(lines[index]) || !/\bQuestions?\b/i.test(lines[index])) continue;
    const headerCells = lines[index].split("|").map((cell) => cleanInlineMarkdown(cell));
    const questionColumn = headerCells.findIndex((cell) => /^Questions?$/i.test(cell));
    if (questionColumn < 0) continue;

    for (let rowIndex = index + 1; rowIndex < lines.length; rowIndex += 1) {
      if (!/^\s*\|/.test(lines[rowIndex])) break;
      if (/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[rowIndex])) continue;
      const rowCells = lines[rowIndex].split("|").map((cell) => cleanInlineMarkdown(cell));
      const value = rowCells[questionColumn]?.match(/\d+/)?.[0];
      if (value) total += Number(value);
    }
  }

  return total;
}

function countQuizQuestions(body: string) {
  const exampleCount = [...body.matchAll(/^\s*\*\*Example\s+\d+\s*:/gim)].length;
  const boldQuestionCount = [...body.matchAll(/^\s*\*\*(?:Question|Q)\s*\d+[\).:]?(?:\*\*)?\s+/gim)].length;
  const questionHeadingCount = [...body.matchAll(/^#{2,4}\s+Question\s+\d+\b/gim)].length;
  const numberedMcqs = [...body.matchAll(/^\s*(?:\d+[\).]|Q\s*\d+[\).:]|-\s*Q\s*\d+[\).:])\s+.*(?:\?|Options?\s*:|\([a-d]\)|\b[A-D][\).]\s+)/gim)].length;
  const tableQuestionCount = countQuestionTableRows(body);
  const drillQuestionCount = [...body.matchAll(/\b(\d+)\s*(?:[- ]?question|questions|items|PYQs?|problems)\b/gi)]
    .reduce((sum, match) => sum + Number(match[1] || 0), 0);

  return exampleCount + boldQuestionCount + questionHeadingCount + numberedMcqs + tableQuestionCount + drillQuestionCount;
}

function parseQuizSets(content: string): QuizSet[] {
  const lines = content.split(/\r?\n/);
  const quizSets: QuizSet[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^(#{2,4})\s+((?:(?:Practice|Prelims|Quick)\s+Quiz|MCQ\s+Drill|Quiz|Solved\s+Examples|200\/200\s+Drill)(?::\s*(.+))?)\s*$/i);
    if (!heading) continue;

    const headingLevel = heading[1].length;
    const headingText = cleanInlineMarkdown(heading[3] || heading[2] || "Practice Quiz").replace(/^Quiz:\s*/i, "") || "Practice Quiz";
    const anchorId = cleanInlineMarkdown(heading[2] || headingText).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "quiz";
    const bodyLines: string[] = [];

    for (let bodyIndex = index + 1; bodyIndex < lines.length; bodyIndex += 1) {
      const nextHeading = lines[bodyIndex].match(/^(#{1,6})\s+/);
      if (nextHeading && nextHeading[1].length <= headingLevel) {
        index = bodyIndex - 1;
        break;
      }
      bodyLines.push(lines[bodyIndex]);
      if (bodyIndex === lines.length - 1) index = bodyIndex;
    }

    const body = bodyLines.join("\n");
    const questionCount = countQuizQuestions(body);
    if (questionCount === 0) continue;

    const imageCount = [...body.matchAll(/!\[[^\]]*\]\([^)]+\)|<img\b/gi)].length;
    const hasOptions = /(?:^|\n)\s*(?:Options?\s*:|\([a-d]\)|[A-D][\).]\s+)/i.test(body);
    const typeCounts: Record<string, number> = hasOptions ? { mcq: questionCount } : { prompt: questionCount };

    quizSets.push({
      testName: headingText,
      count: questionCount,
      typeCounts,
      imageCount,
      anchorId
    });
  }

  return quizSets;
}

function ensureDirectory(directory: string) {
  fs.mkdirSync(directory, { recursive: true });
}

function removeDirectory(directory: string) {
  if (!fs.existsSync(directory)) return;
  fs.rmSync(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}

function isExternalOrAbsoluteUrl(value: string) {
  return /^(?:https?:)?\/\//i.test(value) || value.startsWith("#") || value.startsWith("data:");
}

function publicAssetPath(noteRelativePath: string, rawTarget: string) {
  const { cleanTarget, suffix } = splitTarget(rawTarget);
  if (!cleanTarget || isExternalOrAbsoluteUrl(cleanTarget) || cleanTarget.startsWith("/")) return rawTarget;
  const noteDir = posixPath(path.dirname(noteRelativePath));
  const joined = path.posix.normalize(path.posix.join(noteDir === "." ? "" : noteDir, cleanTarget));
  return `/content-assets/${joined}${suffix}`;
}

function splitTarget(rawTarget: string) {
  const match = rawTarget.match(/^([^?#]*)([?#][\s\S]*)?$/);
  return {
    cleanTarget: match?.[1] || rawTarget,
    suffix: match?.[2] || ""
  };
}

function isMarkdownDocument(value: string) {
  return /\.(md|mdx)$/i.test(value);
}

function isLikelyAsset(value: string) {
  return /\.(avif|bmp|csv|docx?|gif|ico|jpe?g|json|pdf|png|pptx?|svg|webp|xlsx?|zip)$/i.test(value)
    || /(^|\/)(assets?|images?|img|downloads?)\//i.test(value);
}

function lookupSlug(slugByRelativePath: LinkRewriteOptions["slugByRelativePath"], relativePath: string) {
  if (!slugByRelativePath) return null;
  return slugByRelativePath instanceof Map ? slugByRelativePath.get(relativePath) || null : slugByRelativePath[relativePath] || null;
}

function resolveRelativeTarget(noteRelativePath: string, rawTarget: string) {
  const { cleanTarget, suffix } = splitTarget(rawTarget);
  const noteDir = posixPath(path.dirname(noteRelativePath));
  const joined = path.posix.normalize(path.posix.join(noteDir === "." ? "" : noteDir, cleanTarget));
  return { joined, suffix };
}

function noteLinkPath(noteRelativePath: string, rawTarget: string, options: LinkRewriteOptions) {
  const { joined, suffix } = resolveRelativeTarget(noteRelativePath, rawTarget);
  const slug = lookupSlug(options.slugByRelativePath, joined) || slugFromRelativePath(joined);
  return `/notes/${slug}${suffix}`;
}

function relativeNoteLinkPath(noteRelativePath: string, rawTarget: string, options: LinkRewriteOptions) {
  const { joined, suffix } = resolveRelativeTarget(noteRelativePath, rawTarget);
  const normalized = joined.replace(/\/+$/, "");
  const candidates = isMarkdownDocument(normalized)
    ? [normalized]
    : [`${normalized}/index.md`, `${normalized}/overview.md`, `${normalized}.md`];

  for (const candidate of candidates) {
    const slug = lookupSlug(options.slugByRelativePath, candidate);
    if (slug) return `/notes/${slug}${suffix}`;
  }
  return null;
}

function rootRelativeNoteLinkPath(rawTarget: string, options: LinkRewriteOptions) {
  const { cleanTarget, suffix } = splitTarget(rawTarget);
  const rootPath = cleanTarget.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!rootPath) return null;

  const candidates = isMarkdownDocument(rootPath)
    ? [rootPath]
    : [`${rootPath}/index.md`, `${rootPath}/overview.md`, `${rootPath}.md`];
  for (const candidate of candidates) {
    const slug = lookupSlug(options.slugByRelativePath, candidate);
    if (slug) return `/notes/${slug}${suffix}`;
  }
  return null;
}

export function rewriteMarkdownAssetLinks(content: string, noteRelativePath: string, options: LinkRewriteOptions = {}) {
  return content.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix: string, target: string, suffix: string) => {
    const trimmed = target.trim();
    if (isExternalOrAbsoluteUrl(trimmed)) return match;
    if (trimmed.startsWith("/")) {
      const noteRoute = rootRelativeNoteLinkPath(trimmed, options);
      return noteRoute ? `${prefix}${noteRoute}${suffix}` : match;
    }
    const isImage = prefix.startsWith("![");
    const { cleanTarget } = splitTarget(trimmed);
    if (!isImage && isMarkdownDocument(cleanTarget)) return `${prefix}${noteLinkPath(noteRelativePath, trimmed, options)}${suffix}`;
    if (!isImage && !isLikelyAsset(cleanTarget)) {
      const noteRoute = relativeNoteLinkPath(noteRelativePath, trimmed, options);
      if (noteRoute) return `${prefix}${noteRoute}${suffix}`;
    }
    if (isImage || isLikelyAsset(cleanTarget)) return `${prefix}${publicAssetPath(noteRelativePath, trimmed)}${suffix}`;
    return `${prefix}${publicAssetPath(noteRelativePath, trimmed)}${suffix}`;
  });
}

function copyDocAssets(docsRoot: string, publicRoot: string) {
  const outputRoot = path.join(publicRoot, "content-assets");
  removeDirectory(outputRoot);
  ensureDirectory(outputRoot);
  if (!fs.existsSync(docsRoot)) return;

  function walk(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (!/\.(md|mdx)$/i.test(entry.name)) {
        const relative = path.relative(docsRoot, fullPath);
        const destination = path.join(outputRoot, relative);
        ensureDirectory(path.dirname(destination));
        fs.copyFileSync(fullPath, destination);
      }
    }
  }

  walk(docsRoot);
}

function copyStaticAssets(staticRoot: string, publicRoot: string) {
  if (!fs.existsSync(staticRoot)) return;
  ensureDirectory(publicRoot);
  for (const entry of fs.readdirSync(staticRoot, { withFileTypes: true })) {
    const source = path.join(staticRoot, entry.name);
    const destination = path.join(publicRoot, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(source, destination, { recursive: true, force: true });
    } else {
      fs.copyFileSync(source, destination);
    }
  }
}

/** Restore durable GATE question figures after the content asset cleanup. */
function copyGateAssets(cwd: string, publicRoot: string) {
  const source = path.join(cwd, "data", "exams", "gate", "assets");
  if (!fs.existsSync(source)) return;
  const destination = path.join(publicRoot, "content-assets", "gate");
  ensureDirectory(destination);
  fs.cpSync(source, destination, { recursive: true, force: true });
}

/** Restore durable SSC Quant source visuals after the content asset cleanup. */
function copySscQuantAssets(cwd: string, publicRoot: string) {
  const source = path.join(cwd, "data", "exams", "ssc-cgl", "quant-book", "assets");
  if (!fs.existsSync(source)) return;
  const destination = path.join(publicRoot, "content-assets", "ssc-cgl", "quant-book");
  ensureDirectory(destination);
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function buildContentData(options: BuildOptions = {}) {
  const cwd = process.cwd();
  const docsRoot = options.docsRoot || path.join(cwd, "docs");
  const generatedRoot = options.generatedRoot || path.join(cwd, "data", "generated");
  const publicRoot = options.publicRoot || path.join(cwd, "public");
  const staticRoot = options.staticRoot || path.join(cwd, "static");

  ensureDirectory(generatedRoot);
  removeDirectory(path.join(generatedRoot, "catalog.json"));
  removeDirectory(path.join(generatedRoot, "notes-index.json"));
  removeDirectory(path.join(generatedRoot, "notes"));
  copyDocAssets(docsRoot, publicRoot);
  copyStaticAssets(staticRoot, publicRoot);
  copyGateAssets(cwd, publicRoot);
  copySscQuantAssets(cwd, publicRoot);

  const markdownFiles = getMarkdownFiles(docsRoot).filter((filePath) => isPublicLearnerNote(path.relative(docsRoot, filePath)));
  const slugByRelativePath = new Map(
    markdownFiles.map((filePath) => {
      const relativePath = posixPath(path.relative(docsRoot, filePath));
      return [relativePath, slugFromRelativePath(relativePath)] as const;
    })
  );

  const notes = markdownFiles.map((filePath, index) => {
    const relativePath = posixPath(path.relative(docsRoot, filePath));
    const segments = relativePath.split("/");
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    const title = cleanInlineMarkdown(String(parsed.data.title || parsed.data.sidebar_label || titleFromMarkdown(parsed.content, path.basename(relativePath, path.extname(relativePath)))));
    const sidebarLabel = cleanInlineMarkdown(String(parsed.data.sidebar_label || parsed.data.sidebarLabel || title));
    const description = cleanInlineMarkdown(String(parsed.data.description || ""));
    const cleanedContent = stripLeadingTitleHeading(parsed.content.trim(), title);
    const content = rewriteMarkdownAssetLinks(cleanedContent, relativePath, { slugByRelativePath });
    const code = courseCodeFromSegments(segments);
    const stats = noteStats(content);
    const quizSets = parseQuizSets(content);
    stats.quizBlocks = quizSets.reduce((sum, quizSet) => sum + quizSet.count, 0);

    return {
      slug: slugFromRelativePath(relativePath),
      title,
      sidebarLabel,
      sidebarPosition: Number.isFinite(Number(parsed.data.sidebar_position)) ? Number(parsed.data.sidebar_position) : index,
      description,
      tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
      contentType: parsed.data.content_type ? String(parsed.data.content_type) : null,
      status: parsed.data.status ? String(parsed.data.status) : null,
      publishedAt: parsed.data.published ? String(parsed.data.published) : null,
      runnable: stats.codeBlocks > 0,
      courseCode: code,
      courseFolder: courseFolderFromSegments(code, segments),
      courseName: courseName(code, segments),
      level: levelFromSegments(segments),
      week: parseWeek(relativePath, title),
      relativePath,
      sourcePath: path.relative(process.cwd(), filePath),
      excerpt: sentenceExcerpt(parsed.content, description || title),
      headings: parseHeadings(parsed.content),
      stats,
      quizSets,
      content
    } satisfies NoteIndexItem;
  });

  const courses = [...notes.reduce((map, note) => {
    const code = note.courseCode || "MITEEE";
    const segments = note.relativePath.split("/");
    const existing = map.get(code) || {
      code,
      folder: note.courseFolder || "",
      name: note.courseName || courseName(code, segments),
      level: note.level || levelFromSegments(segments),
      category: categoryFromSegments(segments),
      noteCount: 0,
      runnableNoteCount: 0,
      questionCount: 0,
      practicePromptCount: 0,
      syllabusSummary: [] as string[],
      quizSets: []
    };

    existing.noteCount += 1;
    existing.runnableNoteCount += note.runnable ? 1 : 0;
    existing.questionCount += note.stats.questionBlocks;
    existing.practicePromptCount = (existing.practicePromptCount ?? 0) + (note.stats.practicePrompts ?? 0);
    existing.quizSets.push(...(note.quizSets || []).map((quizSet) => ({
      ...quizSet,
      testName: `${note.sidebarLabel}: ${quizSet.testName}`
    })));
    if (existing.syllabusSummary.length < 4 && note.excerpt) existing.syllabusSummary.push(note.excerpt);
    map.set(code, existing);
    return map;
  }, new Map<string, Course>()).values()].sort((a, b) => a.code.localeCompare(b.code));

  const catalog: Catalog = {
    generatedAt: new Date().toISOString(),
    sourceRoots: { notes: posixPath(path.relative(process.cwd(), docsRoot)) || "docs", assets: "public/content-assets" },
    totals: {
      courses: courses.length,
      notes: notes.length,
      runnableNotes: notes.filter((note) => note.runnable).length,
      quizzes: courses.reduce((sum, course) => sum + course.quizSets.length, 0),
      questions: courses.reduce((sum, course) => sum + course.questionCount, 0),
      practicePrompts: courses.reduce((sum, course) => sum + (course.practicePromptCount ?? 0), 0),
      mermaidNotes: notes.filter((note) => note.stats.mermaidBlocks > 0).length,
      mathNotes: notes.filter((note) => note.stats.mathBlocks > 0).length
    },
    courses
  };

  writeJson(path.join(generatedRoot, "catalog.json"), catalog);
  writeJson(path.join(generatedRoot, "notes-index.json"), notes.map(({ content, ...note }) => note));
  for (const note of notes) {
    writeJson(path.join(generatedRoot, "notes", `${note.slug}.json`), note);
  }

  return { catalog, notes };
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const result = buildContentData();
  console.log(`Generated ${result.catalog.totals.notes} notes across ${result.catalog.totals.courses} courses.`);
}
