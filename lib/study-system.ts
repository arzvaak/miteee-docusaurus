import type { Course, NoteIndexItem } from "@/scripts/build-content-data";
import { cleanInlineMarkdown } from "@/lib/content";
import { truncateText } from "@/lib/text";

export type StudyNoteRef = {
  slug: string;
  title: string;
  label: string;
  courseCode: string | null;
  courseName: string | null;
  week: number | null;
  stats: NoteIndexItem["stats"];
  excerpt: string;
};

export type StudyTask = {
  id: string;
  title: string;
  method: "retrieval" | "spacing" | "interleaving" | "self-explanation";
  minutes: number;
  prompt: string;
  why: string;
  checklist?: string[];
  note: StudyNoteRef | null;
  course: {
    code: string;
    name: string;
  } | null;
};

export type StudyProtocol = {
  method: StudyTask["method"];
  label: string;
  action: string;
  avoid: string;
  evidence: string;
  source: {
    label: string;
    href: string;
  };
};

export type StudyTodayPlan = {
  totalMinutes: number;
  summary: string;
  focusMix: string[];
  tasks: StudyTask[];
  protocols: StudyProtocol[];
  sources: Array<{
    label: string;
    claim: string;
    href: string;
  }>;
};

type IndexedNote = Omit<NoteIndexItem, "content">;

const studySources: StudyTodayPlan["sources"] = [
  {
    label: "Practice testing",
    claim: "Use closed-book recall before reading notes.",
    href: "https://pubmed.ncbi.nlm.nih.gov/16507066/"
  },
  {
    label: "Distributed practice",
    claim: "Come back to older material instead of rereading one block.",
    href: "https://www.wku.edu/senate/documents/improving_student_learning_dunlosky_2013.pdf"
  },
  {
    label: "Spaced repetition",
    claim: "Spacing helps memory, problem solving, and transfer.",
    href: "https://journals.sagepub.com/doi/abs/10.1177/2372732215624708"
  },
  {
    label: "Successive relearning",
    claim: "Pair spacing with repeated retrieval until answers are stable.",
    href: "https://www.apa.org/pubs/journals/features/stl-0000024.pdf"
  }
];

const studyProtocols: StudyProtocol[] = [
  {
    method: "retrieval",
    label: "Recall before review",
    action: "Close the note first, write the answer from memory, then reopen the source and mark the exact missing step.",
    avoid: "Do not start by rereading highlighted material; it feels smooth while hiding the retrieval gap.",
    evidence: "Testing improves later retention instead of only measuring what is already known.",
    source: {
      label: "Roediger & Karpicke, 2006",
      href: "https://pubmed.ncbi.nlm.nih.gov/16507066/"
    }
  },
  {
    method: "spacing",
    label: "Revisit after delay",
    action: "Pull one older formula, derivation, or polity concept back into today's loop before new reading.",
    avoid: "Do not let the whole session sit inside one fresh chapter; massed review inflates confidence.",
    evidence: "Distributed practice is one of the highest-utility learning techniques across many materials.",
    source: {
      label: "Dunlosky et al., 2013",
      href: "https://pubmed.ncbi.nlm.nih.gov/26173288/"
    }
  },
  {
    method: "interleaving",
    label: "Mix problem families",
    action: "Alternate technical problems with UPSC concepts so each block forces a fresh method choice.",
    avoid: "Do not batch only one problem type until the pattern becomes automatic and untested.",
    evidence: "Interleaved mathematics practice improves later selection of the right solution method.",
    source: {
      label: "Taylor & Rohrer, 2010",
      href: "https://doi.org/10.1002/acp.1598"
    }
  },
  {
    method: "self-explanation",
    label: "Turn misses into rules",
    action: "For every miss, write the wrong rule, the corrected rule, and tomorrow's catch question.",
    avoid: "Do not log vague weakness labels like careless mistake without the rule that would prevent it.",
    evidence: "Self-explanation has useful effects when it is targeted at reasoning steps and conditions.",
    source: {
      label: "Dunlosky et al., 2013",
      href: "https://pubmed.ncbi.nlm.nih.gov/26173288/"
    }
  }
];

function noteRef(note: IndexedNote | null | undefined): StudyNoteRef | null {
  if (!note) return null;
  return {
    slug: note.slug,
    title: note.title,
    label: note.sidebarLabel || note.title,
    courseCode: note.courseCode,
    courseName: note.courseName,
    week: note.week,
    stats: note.stats,
    excerpt: truncateText(cleanInlineMarkdown(note.excerpt || note.description), 150)
  };
}

function scoreQuestionNote(note: IndexedNote) {
  return note.stats.questionBlocks * 16 + note.stats.mathBlocks * 4 + note.stats.details * 2 + (note.week ?? 0);
}

function scoreMathNote(note: IndexedNote) {
  return note.stats.mathBlocks * 14 + note.stats.questionBlocks * 4 + note.stats.mermaidBlocks * 2 + (note.week ?? 0);
}

function pickNote(notes: IndexedNote[], seen: Set<string>, predicate: (note: IndexedNote) => boolean, score: (note: IndexedNote) => number) {
  const picked = notes
    .filter((note) => !seen.has(note.slug) && predicate(note))
    .sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title))[0];

  if (picked) seen.add(picked.slug);
  return picked ?? null;
}

function pickCourse(courses: Course[], predicate: (course: Course) => boolean) {
  return [...courses]
    .filter(predicate)
    .sort((a, b) => b.questionCount + b.noteCount * 4 - (a.questionCount + a.noteCount * 4))[0] ?? null;
}

function uniqueLabels(labels: Array<string | null | undefined>) {
  return Array.from(new Set(labels.filter((label): label is string => Boolean(label && label.trim()))));
}

export function buildStudyTodayPlan(notes: IndexedNote[], courses: Course[]): StudyTodayPlan {
  const seen = new Set<string>();
  const questionNote = pickNote(notes, seen, (note) => note.stats.questionBlocks > 0, scoreQuestionNote);
  const olderMathNote = pickNote(notes, seen, (note) => note.stats.mathBlocks > 0, scoreMathNote);
  const upscNote = pickNote(notes, seen, (note) => note.courseCode === "UPSC-CSE-POLITICAL-SCIENCE", scoreQuestionNote);
  const mixedTechnicalNote = pickNote(
    notes,
    seen,
    (note) => Boolean(note.courseCode?.startsWith("SEM")) && (note.stats.mathBlocks > 0 || note.stats.questionBlocks > 0 || note.stats.mermaidBlocks > 0),
    (note) => scoreQuestionNote(note) + scoreMathNote(note)
  );
  const fallbackNote = pickNote(notes, seen, () => true, (note) => note.stats.questionBlocks + note.stats.mathBlocks + note.stats.mermaidBlocks);
  const revisionCourse = pickCourse(courses, (course) => course.questionCount > 0) ?? courses[0] ?? null;

  const tasks: StudyTask[] = [
    {
      id: "retrieval-sprint",
      title: "Retrieval sprint",
      method: "retrieval",
      minutes: 30,
      prompt: "Open the note, hide the answer sections, and write what you remember before reading.",
      why: "Recall first. Then check the note and mark the exact gap.",
      note: noteRef(questionNote ?? fallbackNote),
      course: revisionCourse ? { code: revisionCourse.code, name: revisionCourse.name } : null
    },
    {
      id: "spaced-review",
      title: "Spaced review",
      method: "spacing",
      minutes: 20,
      prompt: "Revisit an older formula or derivation page and rebuild the steps without looking.",
      why: "Spacing keeps older material alive and makes final-week review less brutal.",
      note: noteRef(olderMathNote ?? fallbackNote),
      course: null
    },
    {
      id: "interleaving-block",
      title: "Interleaving block",
      method: "interleaving",
      minutes: 30,
      prompt: "Switch between one UPSC concept and one technical EEE page. Explain the difference in task type.",
      why: "Mixing subjects forces the brain to choose the right method instead of cruising on pattern memory.",
      note: noteRef(upscNote ?? mixedTechnicalNote ?? fallbackNote),
      course: null
    },
    {
      id: "error-log",
      title: "Error log",
      method: "self-explanation",
      minutes: 10,
      prompt: "Write one mistake, one corrected rule, and one question that would catch the mistake tomorrow.",
      why: "Self-explanation turns a miss into a reusable rule instead of a vague feeling.",
      note: noteRef(mixedTechnicalNote ?? questionNote ?? fallbackNote),
      course: null
    }
  ];

  return {
    totalMinutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
    summary: "A tight loop for recall, spaced review, mixed practice, and mistake repair.",
    focusMix: uniqueLabels([
      questionNote?.courseName ?? revisionCourse?.name ?? "Question bank",
      olderMathNote?.courseName ?? "Formula review",
      upscNote?.courseName ?? "UPSC CSE Political Science"
    ]),
    tasks,
    protocols: studyProtocols,
    sources: studySources
  };
}
