import type { Course, NoteIndexItem } from "@/scripts/build-content-data";
import type { StudyTaskActivityInput } from "@/lib/learner-memory";
import { truncateText } from "@/lib/text";

type IndexedNote = Omit<NoteIndexItem, "content">;

export type CoursePracticeDrill = {
  id: string;
  slug: string;
  title: string;
  courseCode: string;
  courseName: string;
  focus: string;
  method: StudyTaskActivityInput["method"];
  minutes: number;
  prompt: string;
  reason: string;
  checklist: string[];
};

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function noteLabel(note: IndexedNote) {
  return note.sidebarLabel || note.title;
}

function scorePracticeNote(note: IndexedNote) {
  const stats = note.stats;
  const activityScore =
    stats.questionBlocks * 24 +
    stats.mathBlocks * 14 +
    stats.details * 5 +
    stats.mermaidBlocks * 4 +
    stats.codeBlocks * 4 +
    (note.runnable ? 10 : 0);
  const positionScore = Math.max(0, 18 - (note.sidebarPosition ?? 18));
  return activityScore + positionScore;
}

function focusForNote(note: IndexedNote) {
  const stats = note.stats;
  if (stats.questionBlocks > 0) return "Question practice";
  if (stats.mathBlocks > 0) return "Formula practice";
  if (stats.mermaidBlocks > 0) return "Diagram practice";
  if (note.runnable || stats.codeBlocks > 0) return "Code walkthrough";
  return "Quick review";
}

function methodForFocus(focus: string): CoursePracticeDrill["method"] {
  if (focus === "Formula practice" || focus === "Code walkthrough") return "self-explanation";
  if (focus === "Diagram practice") return "retrieval";
  if (focus === "Quick review") return "spacing";
  return "retrieval";
}

function promptForNote(note: IndexedNote, focus: string) {
  const title = noteLabel(note);
  if (focus === "Question practice") {
    return `Choose one question from ${title}, solve it without looking at the answer, then check your method.`;
  }
  if (focus === "Formula practice") {
    return `Choose one useful formula from ${title}, write it from memory, and explain when to use it.`;
  }
  if (focus === "Diagram practice") {
    return `Draw one important diagram from ${title} from memory, then compare its labels and connections with the note.`;
  }
  if (focus === "Code walkthrough") {
    return `Work through one example from ${title}, predict what happens at each step, then check it against the note.`;
  }
  return `Write a closed-book outline for ${title}, then reopen the note and add the three terms you missed.`;
}

function reasonForNote(note: IndexedNote, focus: string) {
  if (focus === "Question practice") return "Use this chapter for a focused question-and-solution check.";
  if (focus === "Formula practice") return "Use this chapter to practise recalling formulas and choosing when to apply them.";
  if (focus === "Diagram practice") return "Use this chapter to check whether you can explain the diagram clearly.";
  if (focus === "Code walkthrough") return "Use this chapter to practise following an example step by step.";
  return truncateText(cleanText(note.excerpt), 110) || "Use this note for a short closed-book review.";
}

export function buildCoursePracticeDrills(course: Course, notes: IndexedNote[], limit = 3): CoursePracticeDrill[] {
  return notes
    .filter((note) => note.courseCode === course.code)
    .sort((a, b) => scorePracticeNote(b) - scorePracticeNote(a) || (a.sidebarPosition ?? 999) - (b.sidebarPosition ?? 999) || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((note) => {
      const focus = focusForNote(note);
      const title = noteLabel(note);
      return {
        id: `${course.code}:${note.slug}`,
        slug: note.slug,
        title,
        courseCode: course.code,
        courseName: course.name,
        focus,
        method: methodForFocus(focus),
        minutes: focus === "Quick review" ? 15 : 25,
        prompt: promptForNote(note, focus),
        reason: reasonForNote(note, focus),
        checklist: [
          "Try it before opening the note.",
          "Compare your answer with the note and correct what you missed.",
          "Save any repeated mistake for your next review."
        ]
      };
    });
}

export function buildCoursePracticeStudyTask(drill: CoursePracticeDrill): StudyTaskActivityInput {
  return {
    id: `course-practice:${drill.courseCode}:${drill.slug}`,
    title: `Practice: ${drill.title}`,
    method: drill.method,
    minutes: drill.minutes,
    note: {
      slug: drill.slug,
      title: drill.title,
      courseCode: drill.courseCode,
      courseName: drill.courseName
    }
  };
}
