import type { NoteIndexItem } from "@/scripts/build-content-data";
import type { StudyTaskActivityInput } from "@/lib/learner-memory";
import { truncateText } from "@/lib/text";

type IndexedNote = Omit<NoteIndexItem, "content">;

export type UpscActiveRecallDrill = {
  slug: string;
  title: string;
  sourceFocus: string;
  prelimsPrompt: string;
  mainsPrompt: string;
  checklist: string[];
};

const drillChecklist = [
  "Write the answer before opening the note.",
  "Mark one missing term, article, institution, or comparison.",
  "Convert the miss into a catch question for tomorrow."
];

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function usefulHeadings(note: IndexedNote) {
  const blocked = new Set(["master summary", "key concepts", "topic notes", "prelims drill", "mains answer practice"]);
  return note.headings
    .filter((heading) => heading.level >= 2 && heading.level <= 3)
    .map((heading) => cleanText(heading.text))
    .filter((heading) => heading && !blocked.has(heading.toLowerCase()))
    .slice(0, 4);
}

function hasHeading(note: IndexedNote, pattern: RegExp) {
  return note.headings.some((heading) => pattern.test(heading.text));
}

function scoreUpscNote(note: IndexedNote) {
  const examHeadingScore =
    (hasHeading(note, /upsc relevance/i) ? 30 : 0) +
    (hasHeading(note, /prelims/i) ? 24 : 0) +
    (hasHeading(note, /mains/i) ? 24 : 0);
  const topicHeadingScore = usefulHeadings(note).length * 6;
  const positionScore = Math.max(0, 20 - (note.sidebarPosition ?? 20));
  return examHeadingScore + topicHeadingScore + positionScore;
}

function focusLine(note: IndexedNote) {
  const headings = usefulHeadings(note);
  const primary = headings.slice(0, 2);
  if (hasHeading(note, /upsc relevance/i)) primary.unshift("UPSC Relevance");
  return Array.from(new Set(primary)).slice(0, 3).join(" -> ") || truncateText(cleanText(note.excerpt), 90) || note.title;
}

function buildPrelimsPrompt(note: IndexedNote, focus: string) {
  return `Prelims: before opening ${note.title}, write five objective facts or distinctions from ${focus}. Include one trap option you might confuse.`;
}

function buildMainsPrompt(note: IndexedNote, focus: string) {
  return `Mains: write a 150-word answer outline on ${note.title}, using ${focus} as the body structure. Add one current-link or Indian polity example after checking.`;
}

export function buildUpscActiveRecallDrills(notes: IndexedNote[], limit = 4): UpscActiveRecallDrill[] {
  return notes
    .filter((note) => note.courseCode === "UPSC-CSE-POLITICAL-SCIENCE")
    .sort((a, b) => scoreUpscNote(b) - scoreUpscNote(a) || (a.sidebarPosition ?? 999) - (b.sidebarPosition ?? 999) || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((note) => {
      const sourceFocus = focusLine(note);
      return {
        slug: note.slug,
        title: note.sidebarLabel || note.title,
        sourceFocus,
        prelimsPrompt: buildPrelimsPrompt(note, sourceFocus),
        mainsPrompt: buildMainsPrompt(note, sourceFocus),
        checklist: drillChecklist
      };
    });
}

export function buildUpscDrillStudyTask(drill: UpscActiveRecallDrill): StudyTaskActivityInput {
  return {
    id: `upsc-drill:${drill.slug}`,
    title: `UPSC drill: ${drill.title}`,
    method: "retrieval",
    minutes: 25,
    note: {
      slug: drill.slug,
      title: drill.title,
      courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
      courseName: "UPSC Political Science NCERT"
    }
  };
}
