import type { NoteIndexItem } from "@/scripts/build-content-data";
import type { MistakeInput, MemoryNoteRef } from "@/lib/learner-memory";
import type { StudyCoachDiagnosisResponse } from "@/lib/study-coach";
import { truncateText } from "@/lib/text";

type IndexedNote = Omit<NoteIndexItem, "content">;

export type AnswerPracticeFocus = "Exam answer" | "Derivation" | "Diagram explanation" | "Concept recall";
export type AnswerPracticeLane = "All practice" | "UPSC answer writing" | "Exam practice" | "Formula practice" | "Diagram practice" | "Concept recall";

export type AnswerPracticePrompt = {
  id: string;
  slug: string;
  title: string;
  noteLabel: string;
  courseCode: string | null;
  courseName: string | null;
  focus: AnswerPracticeFocus;
  lane: Exclude<AnswerPracticeLane, "All practice">;
  prompt: string;
  framing: string;
  sourceContext: string;
  evidence: string;
  score: number;
};

export type AnswerPracticeSelection = {
  selected: AnswerPracticePrompt | null;
  prompts: AnswerPracticePrompt[];
};

export type AnswerPracticeRepairInput = {
  note: MemoryNoteRef;
  mistake: MistakeInput;
};

export type AnswerPracticeWeaknessCategory =
  | "definition gap"
  | "evidence/source gap"
  | "structure gap"
  | "concept confusion"
  | "conversion/procedure gap"
  | "conclusion gap";

export type AnswerPracticeWeaknessSummary = {
  tag: string;
  category: AnswerPracticeWeaknessCategory;
  label: string;
};

const weaknessPatterns: Array<{
  tag: string;
  category: AnswerPracticeWeaknessCategory;
  label: string;
  pattern: RegExp;
}> = [
  {
    tag: "definition-gap",
    category: "definition gap",
    label: "Definition gap",
    pattern: /\b(defin(?:e|ition)|meaning|rule|principle|article|term|memor(?:y|ize)|name the)\b/i
  },
  {
    tag: "evidence-source-gap",
    category: "evidence/source gap",
    label: "Evidence/source gap",
    pattern: /\b(evidence|source|example|case|data|fact|current[-\s]?affairs|ground(?:ed|ing)|from the note|quote|support)\b/i
  },
  {
    tag: "structure-gap",
    category: "structure gap",
    label: "Structure gap",
    pattern: /\b(structure|intro(?:duction)?|body|scaffold|sequence|flow|organ(?:ize|ised|ized)|link(?:ed)? points?|too thin|direct rule)\b/i
  },
  {
    tag: "concept-confusion",
    category: "concept confusion",
    label: "Concept confusion",
    pattern: /\b(confus(?:e|ed|ion)|mix(?:ed)?|distinguish|difference|differentiate|separate|versus| vs\.? |inverse|contrast)\b/i
  },
  {
    tag: "conversion-procedure-gap",
    category: "conversion/procedure gap",
    label: "Conversion/procedure gap",
    pattern: /\b(convert|conversion|unit|per[-\s]?unit|percent|slip|substitut(?:e|ion)|procedure|method|step|setup|formula|equation|calculate|working)\b/i
  },
  {
    tag: "conclusion-gap",
    category: "conclusion gap",
    label: "Conclusion gap",
    pattern: /\b(conclusion|conclude|closing|final answer|final value|result|inference|therefore)\b/i
  }
];

function labelForNote(note: IndexedNote) {
  return note.sidebarLabel || note.title;
}

function cleanInline(value: string) {
  return value
    .replace(/\|/g, " ")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUpscNote(note: IndexedNote) {
  const values = [
    note.courseCode,
    note.courseName,
    note.courseFolder,
    note.relativePath,
    note.sourcePath,
    note.title,
    note.sidebarLabel
  ].filter(Boolean).join(" ");
  return /\bUPSC\b|upsc-cse|civil services/i.test(values);
}

function practiceScore(note: IndexedNote) {
  return (
    (note.stats.practicePrompts ?? 0) * 8 +
    note.stats.questionBlocks * 6 +
    note.stats.mathBlocks * 2 +
    note.stats.mermaidBlocks * 2 +
    note.stats.details
  );
}

function focusForNote(note: IndexedNote): AnswerPracticeFocus {
  if (isUpscNote(note) && (note.stats.practicePrompts ?? 0) > 0) return "Exam answer";
  if (note.stats.questionBlocks > 0 || (note.stats.practicePrompts ?? 0) > 0) return "Exam answer";
  if (note.stats.mathBlocks > 0) return "Derivation";
  if (note.stats.mermaidBlocks > 0) return "Diagram explanation";
  return "Concept recall";
}

function laneForNote(note: IndexedNote, focus: AnswerPracticeFocus): Exclude<AnswerPracticeLane, "All practice"> {
  if (isUpscNote(note)) return "UPSC answer writing";
  if (focus === "Exam answer") return "Exam practice";
  if (focus === "Derivation") return "Formula practice";
  if (focus === "Diagram explanation") return "Diagram practice";
  return "Concept recall";
}

function matchingHeading(note: IndexedNote, pattern: RegExp) {
  return note.headings
    .filter((heading) => heading.level <= 3)
    .map((heading) => cleanInline(heading.text))
    .find((heading) => pattern.test(heading));
}

function matchingExcerptSentence(note: IndexedNote, pattern: RegExp) {
  const source = cleanInline(note.excerpt || note.description || "");
  return source
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .find((sentence) => pattern.test(sentence));
}

function headingFrame(label: "Mains scaffold" | "Prelims trap" | "Weakness repair", value: string) {
  const cleaned = cleanInline(value);
  const normalized = cleaned.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const labelNormalized = label.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized === labelNormalized) {
    if (label === "Mains scaffold") return "Use the Mains scaffold section as the answer structure.";
    if (label === "Prelims trap") return "Check the Prelims trap section before writing the final answer.";
    return "Use the Weakness repair section as the closing self-check.";
  }
  if (normalized.startsWith(labelNormalized)) return cleaned;
  return `${label}: ${cleaned}`;
}

function upscFramingParts(note: IndexedNote) {
  const mains = matchingHeading(note, /mains|scaffold|answer writing|structure|introduction|conclusion/i)
    || matchingExcerptSentence(note, /mains|scaffold|answer writing|structure|introduction|conclusion/i);
  const prelims = matchingHeading(note, /prelims|trap|confus|eliminat|exception/i)
    || matchingExcerptSentence(note, /prelims|trap|confus|eliminat|exception/i);
  const weakness = matchingHeading(note, /weakness|repair|mistake|improve|missing/i)
    || matchingExcerptSentence(note, /weakness|repair|mistake|improve|missing/i);

  return [
    mains ? headingFrame("Mains scaffold", mains) : "",
    prelims ? headingFrame("Prelims trap", prelims) : "",
    weakness ? headingFrame("Weakness repair", weakness) : ""
  ].filter(Boolean);
}

function framingForNote(note: IndexedNote, focus: AnswerPracticeFocus) {
  if (isUpscNote(note)) {
    const parts = upscFramingParts(note);
    const fallback = [
      (note.stats.practicePrompts ?? 0) > 0 ? "Use one of the answer-practice prompts included in this UPSC note." : "",
      note.headings.length > 0 ? `Use note headings as the answer scaffold: ${note.headings.slice(0, 4).map((heading) => cleanInline(heading.text)).join("; ")}.` : "",
      note.excerpt ? `Anchor the answer in this excerpt: ${truncateText(cleanInline(note.excerpt), 260)}` : ""
    ].filter(Boolean);
    return truncateText([...parts, ...fallback].join(" "), 700);
  }

  if (focus === "Exam answer") return "Answer like a marker will check it: direct rule, key steps, and conclusion.";
  if (focus === "Derivation") return "Rebuild the formula path and define each symbol before using it.";
  if (focus === "Diagram explanation") return "Explain the flow in sequence and name the missing links.";
  return "Recall the idea closed-book, then add one example or contrast from the note.";
}

function promptForNote(note: IndexedNote, focus: AnswerPracticeFocus) {
  const label = labelForNote(note);
  if (isUpscNote(note)) {
    return `Write a UPSC Mains answer from ${label}. Frame it with an introduction, 2-3 body points grounded in the note, and a short conclusion. Flag any Prelims-style trap before you start if the note gives one.`;
  }
  if (focus === "Exam answer") {
    return `Write a compact exam-style answer for one likely question from ${label}. Include the rule, the key steps, and the final conclusion.`;
  }
  if (focus === "Derivation") {
    return `Rebuild one derivation or formula from ${label}. State when it applies and define the symbols you use.`;
  }
  if (focus === "Diagram explanation") {
    return `Explain one diagram or flow from ${label} from memory, including the missing links a marker would expect.`;
  }
  return `Write a closed-book answer explaining the core idea of ${label}, then add one example or contrast.`;
}

function sourceContextForNote(note: IndexedNote, framing: string) {
  const headings = note.headings
    .filter((heading) => heading.level <= 3)
    .map((heading) => heading.text)
    .slice(0, 8);
  const parts = [
    note.courseName ? `Course: ${note.courseName}.` : "",
    note.description ? `Description: ${cleanInline(note.description)}.` : "",
    note.excerpt ? `Excerpt: ${cleanInline(note.excerpt)}.` : "",
    framing ? `Answer-writing frame: ${framing}` : "",
    headings.length > 0 ? `Headings: ${headings.map(cleanInline).join("; ")}.` : ""
  ].filter(Boolean);
  return truncateText(parts.join(" "), 1100);
}

function evidenceForNote(note: IndexedNote) {
  if ((note.stats.practicePrompts ?? 0) > 0) return "This note includes ready-made prompts for answer practice.";
  if (note.stats.questionBlocks > 0) return "This note includes questions you can answer and check.";
  if (note.stats.mathBlocks > 0) return "This note includes formulas and worked steps you can explain in your own words.";
  if (note.stats.mermaidBlocks > 0) return "This note includes a diagram you can use to structure your answer.";
  return "This note has enough context for a short closed-book answer.";
}

export function buildAnswerPracticePrompt(note: IndexedNote): AnswerPracticePrompt {
  const focus = focusForNote(note);
  const lane = laneForNote(note, focus);
  const framing = framingForNote(note, focus);
  const noteLabel = labelForNote(note);
  return {
    id: `answer-practice:${note.slug}`,
    slug: note.slug,
    title: note.title,
    noteLabel,
    courseCode: note.courseCode,
    courseName: note.courseName,
    focus,
    lane,
    prompt: promptForNote(note, focus),
    framing,
    sourceContext: sourceContextForNote(note, framing),
    evidence: evidenceForNote(note),
    score: practiceScore(note)
  };
}

export function buildAnswerPracticePrompts(notes: IndexedNote[], limit = 18): AnswerPracticePrompt[] {
  const ranked = notes
    .filter((note) => practiceScore(note) > 0 || note.excerpt || note.description)
    .map(buildAnswerPracticePrompt)
    .sort((a, b) => {
      const scoreOrder = b.score - a.score;
      if (scoreOrder !== 0) return scoreOrder;
      return a.noteLabel.localeCompare(b.noteLabel);
    });
  const selected: AnswerPracticePrompt[] = [];
  const seen = new Set<string>();
  const courseKeys = [...new Set(ranked.map((prompt) => prompt.courseCode || prompt.courseName || "Study note"))];

  for (const courseKey of courseKeys) {
    const coursePrompt = ranked.find((prompt) => !seen.has(prompt.id) && (prompt.courseCode || prompt.courseName || "Study note") === courseKey);
    if (!coursePrompt) continue;
    selected.push(coursePrompt);
    seen.add(coursePrompt.id);
    if (selected.length >= limit) return selected;
  }

  for (const prompt of ranked) {
    if (seen.has(prompt.id)) continue;
    selected.push(prompt);
    seen.add(prompt.id);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

const laneOrder: AnswerPracticeLane[] = ["All practice", "UPSC answer writing", "Exam practice", "Formula practice", "Diagram practice", "Concept recall"];

export function getAnswerPracticeLanes(prompts: AnswerPracticePrompt[]): AnswerPracticeLane[] {
  const available = new Set<AnswerPracticeLane>(["All practice"]);
  for (const prompt of prompts) available.add(prompt.lane);
  return laneOrder.filter((lane) => available.has(lane));
}

export function filterAnswerPracticePrompts(prompts: AnswerPracticePrompt[], lane: AnswerPracticeLane): AnswerPracticePrompt[] {
  if (lane === "All practice") return prompts;
  return prompts.filter((prompt) => prompt.lane === lane);
}

export function selectAnswerPracticePrompt(prompts: AnswerPracticePrompt[], requestedIdOrSlug?: string | null): AnswerPracticeSelection {
  if (prompts.length === 0) return { selected: null, prompts: [] };
  const requested = requestedIdOrSlug?.trim();
  const selected = requested
    ? prompts.find((prompt) => prompt.id === requested || prompt.slug === requested) ?? prompts[0]!
    : prompts[0]!;
  return { selected, prompts };
}

export function summarizeAnswerPracticeWeakness(diagnosis: StudyCoachDiagnosisResponse): AnswerPracticeWeaknessSummary {
  const weaknessText = [
    ...diagnosis.diagnosis.weaknesses,
    diagnosis.diagnosis.nextDrill,
    diagnosis.message
  ]
    .map((part) => cleanInline(part).replace(/^Weakness:\s*/i, ""))
    .filter(Boolean)
    .join(" ");

  const match = weaknessPatterns.find((pattern) => pattern.pattern.test(weaknessText)) ?? weaknessPatterns[2]!;
  return {
    tag: match.tag,
    category: match.category,
    label: match.label
  };
}

export function buildAnswerPracticeRepairInput(
  prompt: AnswerPracticePrompt,
  diagnosis: StudyCoachDiagnosisResponse,
  createdAt: string
): AnswerPracticeRepairInput {
  const primaryWeakness = diagnosis.diagnosis.weaknesses[0]?.trim() || diagnosis.message;
  const weaknessPattern = summarizeAnswerPracticeWeakness(diagnosis);
  const weaknessSummary = truncateText(primaryWeakness.replace(/^Weakness:\s*/i, ""), 260);
  const nextDrill = truncateText(diagnosis.diagnosis.nextDrill, 260);
  const promptSummary = truncateText(prompt.prompt, 260);
  const sourceSummary = `${prompt.noteLabel}${prompt.courseName ? ` (${prompt.courseName})` : prompt.courseCode ? ` (${prompt.courseCode})` : ""}`;

  return {
    note: {
      slug: prompt.slug,
      title: prompt.noteLabel || prompt.title,
      courseCode: prompt.courseCode,
      courseName: prompt.courseName
    },
    mistake: {
      id: `answer-practice:${prompt.slug}:${createdAt}`,
      createdAt,
      mistake: `Prompt: ${promptSummary} Weakness pattern: ${weaknessPattern.label} (${weaknessPattern.tag}). Weakness: ${weaknessSummary}`,
      correction: `Repair from ${sourceSummary}: Pattern: ${weaknessPattern.label}. ${nextDrill}`,
      catchQuestion: nextDrill
    }
  };
}
