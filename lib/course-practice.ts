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
  if (stats.questionBlocks > 0) return "Question sprint";
  if (stats.mathBlocks > 0) return "Derivation rebuild";
  if (stats.mermaidBlocks > 0) return "Diagram recall";
  if (note.runnable || stats.codeBlocks > 0) return "Code trace";
  return "Recall outline";
}

function methodForFocus(focus: string): CoursePracticeDrill["method"] {
  if (focus === "Derivation rebuild" || focus === "Code trace") return "self-explanation";
  if (focus === "Diagram recall") return "retrieval";
  if (focus === "Recall outline") return "spacing";
  return "retrieval";
}

function promptForNote(note: IndexedNote, focus: string) {
  const title = noteLabel(note);
  if (focus === "Question sprint") {
    return `Close ${title}, answer one question section from memory, then reopen it and mark the exact missing step or value.`;
  }
  if (focus === "Derivation rebuild") {
    return `Rebuild one formula or derivation from ${title} without looking, then explain the condition where it applies.`;
  }
  if (focus === "Diagram recall") {
    return `Draw the main diagram or flow from ${title} from memory, then compare it with the source and label the missing relationship.`;
  }
  if (focus === "Code trace") {
    return `Trace one code or runnable block from ${title}, predict the output or state change, then verify against the note.`;
  }
  return `Write a closed-book outline for ${title}, then reopen the note and add the three terms you missed.`;
}

function reasonForNote(note: IndexedNote, focus: string) {
  const stats = note.stats;
  if (focus === "Question sprint") return `${stats.questionBlocks} question sections make this a high-yield exam drill.`;
  if (focus === "Derivation rebuild") return `${stats.mathBlocks} math blocks need active reconstruction, not rereading.`;
  if (focus === "Diagram recall") return "The diagram content is useful only if you can redraw the structure from memory.";
  if (focus === "Code trace") return "Executable or code-heavy notes should be predicted before they are run.";
  return truncateText(cleanText(note.excerpt), 110) || "This note keeps the course sequence warm.";
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
        minutes: focus === "Recall outline" ? 15 : 25,
        prompt: promptForNote(note, focus),
        reason: reasonForNote(note, focus),
        checklist: [
          "Produce the answer before opening the note.",
          "Check against the source and mark one concrete gap.",
          "If the gap repeats, add it as a mistake from the note page."
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
