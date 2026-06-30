import type { NoteIndexItem } from "@/scripts/build-content-data";
import { recordNoteRead, recordStudyTaskCompletion, type LearnerMemory, type StudyTaskActivityInput } from "@/lib/learner-memory";
import { uniqueHeadingAnchorId, type HeadingAnchor } from "@/lib/heading-anchors";

type IndexedNote = Omit<NoteIndexItem, "content">;

export type NotePractice = {
  slug: string;
  title: string;
  courseCode: string | null;
  courseName: string | null;
  focus: "UPSC expansion drill" | "Question drill" | "Formula rebuild" | "Diagram redraw" | "Code trace" | "Recall outline";
  method: StudyTaskActivityInput["method"];
  minutes: number;
  prompt: string;
  evidence: string;
  checklist: string[];
  expansionSections?: HeadingAnchor[];
};

function noteTitle(note: IndexedNote) {
  return note.sidebarLabel || note.title;
}

function plural(value: number, singular: string, pluralLabel = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralLabel}`;
}

const upscExpansionSectionLabels = new Set([
  "upsc expansion drills",
  "mains answer scaffold",
  "prelims trap check",
  "key term anchors",
  "comparison prompt",
  "weakness repair drill"
]);

function normalizeHeadingLabel(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildUpscExpansionSections(headings: IndexedNote["headings"]): HeadingAnchor[] {
  const seen = new Map<string, number>();
  const sections: HeadingAnchor[] = [];
  for (const heading of headings) {
    if (heading.level < 2 || heading.level > 4) continue;
    const text = heading.text.trim();
    if (!text) continue;
    const id = uniqueHeadingAnchorId(text, seen);
    if (upscExpansionSectionLabels.has(normalizeHeadingLabel(text))) {
      sections.push({ ...heading, text, id });
    }
  }
  return sections;
}

export function buildNotePractice(note: IndexedNote): NotePractice {
  const title = noteTitle(note);
  const expansionSections = buildUpscExpansionSections(note.headings);
  const practiceSections = expansionSections.filter((section) => section.level > 2);
  const base = {
    slug: note.slug,
    title,
    courseCode: note.courseCode,
    courseName: note.courseName,
    checklist: [
      "Attempt before scrolling through the solution.",
      "Check the source and write one missing step.",
      "Log a mistake here if the same gap appears twice."
    ]
  };

  if (practiceSections.length > 0) {
    const sectionLabels = practiceSections.map((section) => section.text);
    return {
      ...base,
      focus: "UPSC expansion drill",
      method: "retrieval",
      minutes: 25,
      prompt: `Work through ${sectionLabels.slice(0, 3).join(", ")} from ${title} as a closed-book UPSC drill.`,
      evidence: `${plural(expansionSections.length, "UPSC expansion section")} found in this note.`,
      checklist: sectionLabels.slice(0, 3).map((label) => `Jump to ${label} and answer before reading the scaffold.`),
      expansionSections
    };
  }

  const practiceQuestionCount = (note.stats.quizBlocks ?? 0) + note.stats.questionBlocks;

  if (practiceQuestionCount > 0) {
    return {
      ...base,
      focus: "Question drill",
      method: "retrieval",
      minutes: practiceQuestionCount >= 8 ? 30 : 20,
      prompt: note.stats.quizBlocks
        ? `Work one extracted quiz or 200/200 drill from ${title} under timer before reading the explanation.`
        : `Pick and solve one question section from ${title} without reading the answer first.`,
      evidence: note.stats.quizBlocks
        ? `${plural(note.stats.quizBlocks, "quiz item")} from solved examples and timed drills make this note practice-ready.`
        : `${plural(note.stats.questionBlocks, "question section")} make this note practice-ready.`
    };
  }

  if (note.stats.mathBlocks > 0) {
    return {
      ...base,
      focus: "Formula rebuild",
      method: "self-explanation",
      minutes: note.stats.mathBlocks >= 8 ? 20 : 15,
      prompt: `Rebuild one formula or derivation from ${title}, then explain when it applies.`,
      evidence: `${plural(note.stats.mathBlocks, "math block")} should be reconstructed, not reread.`
    };
  }

  if (note.stats.mermaidBlocks > 0) {
    return {
      ...base,
      focus: "Diagram redraw",
      method: "retrieval",
      minutes: 15,
      prompt: `Redraw one diagram or flow from ${title}, then compare labels and missing links.`,
      evidence: `${plural(note.stats.mermaidBlocks, "diagram")} can be turned into visual recall.`
    };
  }

  if (note.runnable || note.stats.codeBlocks > 0) {
    return {
      ...base,
      focus: "Code trace",
      method: "self-explanation",
      minutes: 15,
      prompt: `Trace one code block from ${title}, predict its output or state, then verify it.`,
      evidence: `${plural(note.stats.codeBlocks, "code block")} should be predicted before running or rereading.`
    };
  }

  return {
    ...base,
    focus: "Recall outline",
    method: "spacing",
    minutes: 10,
    prompt: `Write a closed-book outline for ${title}, then add the three terms you missed.`,
    evidence: "This note is best used as a short spaced recall pass."
  };
}

export function buildNotePracticeStudyTask(practice: NotePractice): StudyTaskActivityInput {
  return {
    id: `note-practice:${practice.slug}`,
    title: `Note practice: ${practice.title}`,
    method: practice.method,
    minutes: practice.minutes,
    note: {
      slug: practice.slug,
      title: practice.title,
      courseCode: practice.courseCode,
      courseName: practice.courseName
    }
  };
}

export function completeNotePractice(memory: LearnerMemory, practice: NotePractice, completedAt: string): LearnerMemory {
  const task = buildNotePracticeStudyTask(practice);
  const withActivity = recordStudyTaskCompletion(memory, task, completedAt);
  return recordNoteRead(withActivity, {
    slug: practice.slug,
    title: practice.title,
    courseCode: practice.courseCode,
    courseName: practice.courseName
  }, completedAt);
}
