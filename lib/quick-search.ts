import type { NotePreview } from "@/lib/content";

export type QuickSearchField = "title" | "label" | "course" | "heading" | "alias" | "excerpt";

export type QuickSearchResult = {
  preview: NotePreview;
  score: number;
  matchedFields: QuickSearchField[];
  groupLabel: string;
  signalLabel: string;
};

const fieldOrder: QuickSearchField[] = ["title", "label", "course", "heading", "alias", "excerpt"];
const fieldWeights: Record<QuickSearchField, number> = {
  title: 120,
  label: 110,
  course: 90,
  heading: 64,
  alias: 42,
  excerpt: 24
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function queryTokens(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

const intentTokenGroups: Record<string, string[]> = {
  upsc: ["upsc", "cse", "political", "science", "polity", "prelims", "mains"],
  em2: ["em2", "electrical", "machines", "sem5"],
  practice: ["practice", "question", "questions", "pyq", "drill", "quiz", "recall", "bank"],
  answer: ["answer", "answers", "mains", "writing", "solution"],
  framework: ["framework", "structure", "writing", "approach", "outline"],
  federalism: ["federalism", "federal", "centre", "center", "state", "states", "union"]
};

function expandedTokenGroups(tokens: string[]) {
  return tokens.map((token) => intentTokenGroups[token] || [token]);
}

function fieldsForPreview(preview: NotePreview): Record<QuickSearchField, string> {
  return {
    title: preview.title,
    label: preview.label,
    course: [preview.courseCode, preview.courseName].filter(Boolean).join(" "),
    heading: preview.headings.join(" "),
    alias: preview.aliases.join(" "),
    excerpt: preview.excerpt
  };
}

function fieldContainsTokenGroup(fields: Record<QuickSearchField, string>, field: QuickSearchField, tokenGroup: string[]) {
  const value = normalize(fields[field]);
  return tokenGroup.some((token) => value.includes(token));
}

function fieldMatchesIntent(fields: Record<QuickSearchField, string>, field: QuickSearchField, tokenGroups: string[][]) {
  return tokenGroups.some((group) => fieldContainsTokenGroup(fields, field, group));
}

function groupLabelForPreview(preview: NotePreview) {
  const courseText = normalize(`${preview.courseCode || ""} ${preview.courseName || ""}`);
  if (courseText.includes("upsc")) return "UPSC CSE";
  if (courseText.includes("em2") || courseText.includes("electrical machines ii")) return "Electrical Machines II";
  return preview.courseName || preview.courseCode || "MITEEE";
}

function signalLabelForPreview(preview: NotePreview, matchedFields: QuickSearchField[], query: string) {
  const text = normalize(`${preview.title} ${preview.label} ${preview.courseCode || ""} ${preview.courseName || ""} ${preview.headings.join(" ")} ${preview.excerpt}`);
  const normalizedQuery = normalize(query);

  if (/\banswer\b/.test(normalizedQuery) && /\bframework\b/.test(normalizedQuery)) return "Answer framework";
  if (/\bpractice\b/.test(normalizedQuery) || /\b(pyq|question bank|drill|quiz|recall)\b/.test(text)) return "Practice set";
  if (/\bem2\b|\bsem5\b|\bupsc\b/.test(normalizedQuery) && matchedFields.includes("course")) return "Course code match";
  if (matchedFields.includes("title") || matchedFields.includes("label")) return "Title match";
  if (matchedFields.includes("heading")) return "Heading match";
  if (matchedFields.includes("course")) return "Course match";
  if (matchedFields.includes("alias")) return "Path match";
  if (matchedFields.includes("excerpt")) return "Preview match";
  if (preview.stats.questionBlocks > 0) return "Practice set";
  if (preview.stats.mathBlocks > 0) return "Formula-heavy";
  return "Suggested start";
}

function scoreField(value: string, query: string, tokens: string[], weight: number) {
  const normalized = normalize(value);
  if (!normalized) return 0;

  let score = 0;
  if (normalized === query) score += weight * 3;
  else if (normalized.startsWith(query)) score += weight * 2;
  else if (normalized.includes(query)) score += weight;

  for (const token of tokens) {
    if (normalized === token) score += weight;
    else if (normalized.startsWith(token)) score += Math.round(weight * 0.64);
    else if (normalized.includes(token)) score += Math.round(weight * 0.36);
  }

  return score;
}

function defaultSuggestionScore(preview: NotePreview, index: number, total: number) {
  const primaryText = normalize(`${preview.title} ${preview.label} ${preview.courseCode || ""} ${preview.courseName || ""} ${preview.aliases.join(" ")}`);
  const questionScore = Math.min(preview.stats.questionBlocks, 16) * 42;
  const mathScore = Math.min(preview.stats.mathBlocks, 24) * 18;
  const upscScore = /upsc|political science|polity|prelims|mains/.test(primaryText) ? 1200 : 0;
  const bankScore = /question bank|pyq|drill|practice|formula|revision/.test(primaryText) ? 220 : 0;
  const overviewPenalty = /overview|index|master summary|study vault/.test(primaryText) ? 820 : 0;
  return upscScore + bankScore + questionScore + mathScore - overviewPenalty + Math.max(0, total - index) / 1000;
}

function selectBalancedDefaultSuggestions(results: QuickSearchResult[], limit: number) {
  const selected: QuickSearchResult[] = [];
  const selectedSlugs = new Set<string>();
  const selectedCourses = new Set<string>();

  for (const result of results) {
    const courseKey = result.preview.courseCode || result.preview.courseName || "uncategorized";
    if (selectedCourses.has(courseKey)) continue;
    selected.push(result);
    selectedSlugs.add(result.preview.slug);
    selectedCourses.add(courseKey);
    if (selected.length === limit) return selected;
  }

  for (const result of results) {
    if (selectedSlugs.has(result.preview.slug)) continue;
    selected.push(result);
    if (selected.length === limit) return selected;
  }

  return selected;
}

export function selectQuickSearchResults(previews: NotePreview[], query: string, limit = 8): QuickSearchResult[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    const ranked = previews
      .map((preview, index) => ({
        preview,
        score: defaultSuggestionScore(preview, index, previews.length),
        matchedFields: [],
        groupLabel: groupLabelForPreview(preview),
        signalLabel: signalLabelForPreview(preview, [], "")
      }))
      .sort((a, b) => b.score - a.score);
    return selectBalancedDefaultSuggestions(ranked, limit);
  }

  const tokens = queryTokens(query);
  const tokenGroups = expandedTokenGroups(tokens);

  return previews
    .map((preview, index) => {
      const fields = fieldsForPreview(preview);
      const normalizedFields = fieldOrder.map((field) => normalize(fields[field]));
      const allText = normalizedFields.join(" ");

      if (!tokenGroups.every((group) => group.some((token) => allText.includes(token)))) return null;

      const matchedFields = fieldOrder.filter((field) => {
        const value = normalize(fields[field]);
        return value.includes(normalizedQuery) || tokens.some((token) => value.includes(token)) || fieldMatchesIntent(fields, field, tokenGroups);
      });
      const directScore = fieldOrder.reduce((sum, field) => sum + scoreField(fields[field], normalizedQuery, tokens, fieldWeights[field]), 0);
      const intentScore = fieldOrder.reduce((sum, field) => {
        const value = normalize(fields[field]);
        const groupScore = tokenGroups.reduce((fieldSum, group) => {
          if (!group.some((token) => value.includes(token))) return fieldSum;
          return fieldSum + Math.round(fieldWeights[field] * 0.42);
        }, 0);
        return sum + groupScore;
      }, 0);

      return {
        preview,
        score: directScore + intentScore + Math.max(0, previews.length - index) / 1000,
        matchedFields,
        groupLabel: groupLabelForPreview(preview),
        signalLabel: signalLabelForPreview(preview, matchedFields, query)
      };
    })
    .filter((result): result is QuickSearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
