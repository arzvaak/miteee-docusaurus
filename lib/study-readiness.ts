import type { Course } from "@/scripts/build-content-data";

export type StudyReadinessTrack = "civil-services" | "technical-core" | "technical-support" | "general";
export type StudyReadinessStatus = "answer-practice-debt" | "practice-anchor" | "question-bank-ready" | "interactive-review" | "concept-bank";

export type StudyReadinessLane = {
  code: string;
  name: string;
  track: StudyReadinessTrack;
  status: StudyReadinessStatus;
  score: number;
  noteCount: number;
  questionCount: number;
  practicePromptCount: number;
  runnableNoteCount: number;
  summary: string;
  nextAction: string;
  href: string;
};

export type StudyReadinessMap = {
  lanes: StudyReadinessLane[];
  priority: StudyReadinessLane;
  summary: {
    totalCourses: number;
    civilServicesNotes: number;
    technicalQuestions: number;
    civilServicesPracticePrompts: number;
    activePracticeCourses: number;
    practiceDebtCourses: number;
  };
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function trackForCourse(course: Course): StudyReadinessTrack {
  if (course.code.startsWith("UPSC-CSE")) return "civil-services";
  if (course.code.startsWith("SEM") && course.questionCount > 0) return "technical-core";
  if (course.code.startsWith("SEM")) return "technical-support";
  return "general";
}

function statusForCourse(course: Course, track: StudyReadinessTrack, score: number): StudyReadinessStatus {
  const practicePromptCount = course.practicePromptCount ?? 0;
  if (track === "civil-services" && course.noteCount >= 10 && course.questionCount === 0 && practicePromptCount === 0) return "answer-practice-debt";
  if (score >= 75) return "practice-anchor";
  if (course.questionCount > 0 || practicePromptCount > 0) return "question-bank-ready";
  if (course.runnableNoteCount > 0) return "interactive-review";
  return "concept-bank";
}

function summaryForStatus(course: Course, status: StudyReadinessStatus) {
  const practicePromptCount = course.practicePromptCount ?? 0;
  if (status === "answer-practice-debt") {
    return `${course.noteCount} notes are indexed, but active UPSC answer practice is not visible in the question counter.`;
  }
  if (course.code.startsWith("UPSC-CSE") && practicePromptCount > 0) {
    return `${practicePromptCount} answer-practice prompts are ready across ${course.noteCount} UPSC notes.`;
  }
  if (status === "practice-anchor") {
    return `${course.questionCount} question sections make this a strong active-recall anchor.`;
  }
  if (status === "question-bank-ready") {
    return `${course.questionCount} question sections are ready for focused practice.`;
  }
  if (status === "interactive-review") {
    return `${course.runnableNoteCount} runnable notes can be used for quick checks and worked examples.`;
  }
  return `${course.noteCount} notes are available, but the next upgrade is more recall pressure.`;
}

function actionForStatus(status: StudyReadinessStatus) {
  if (status === "answer-practice-debt") return "Add one Prelims and Mains recall drill before more passive UPSC reading.";
  if (status === "practice-anchor") return "Run a timed question block, then log misses with corrected rules and catch questions.";
  if (status === "question-bank-ready") return "Pick one question set and close the answer until recall is written down.";
  if (status === "interactive-review") return "Use a runnable note as a quick check, then turn one result into a revision card.";
  return "Convert one page into closed-book prompts before reading another page.";
}

function scoreCourse(course: Course) {
  const noteBase = Math.max(1, course.noteCount);
  const activePracticeCount = course.questionCount + (course.practicePromptCount ?? 0);
  const questionDensity = Math.min(1, activePracticeCount / (noteBase * 2));
  const runnableDensity = Math.min(1, course.runnableNoteCount / noteBase);
  const breadth = Math.min(1, course.noteCount / 20);
  return clampScore(questionDensity * 70 + runnableDensity * 15 + breadth * 15);
}

function priorityWeight(lane: StudyReadinessLane) {
  if (lane.status === "answer-practice-debt") return 2000 + lane.noteCount;
  if (lane.status === "concept-bank") return 1200 - lane.score + lane.noteCount;
  if (lane.status === "question-bank-ready") return 900 + lane.questionCount + lane.practicePromptCount;
  if (lane.status === "interactive-review") return 700 + lane.runnableNoteCount;
  return 600 + lane.questionCount + lane.practicePromptCount;
}

function buildLane(course: Course): StudyReadinessLane {
  const track = trackForCourse(course);
  const score = scoreCourse(course);
  const status = statusForCourse(course, track, score);

  return {
    code: course.code,
    name: course.name,
    track,
    status,
    score,
    noteCount: course.noteCount,
    questionCount: course.questionCount,
    practicePromptCount: course.practicePromptCount ?? 0,
    runnableNoteCount: course.runnableNoteCount,
    summary: summaryForStatus(course, status),
    nextAction: actionForStatus(status),
    href: `/courses/${course.code}`
  };
}

const emptyLane: StudyReadinessLane = {
  code: "STUDY",
  name: "Study library",
  track: "general",
  status: "concept-bank",
  score: 0,
  noteCount: 0,
  questionCount: 0,
  practicePromptCount: 0,
  runnableNoteCount: 0,
  summary: "No generated courses are available yet.",
  nextAction: "Generate the note catalog, then start with one closed-book recall block.",
  href: "/courses"
};

export function buildStudyReadinessMap(courses: Course[]): StudyReadinessMap {
  const lanes = courses.map(buildLane).sort((a, b) => priorityWeight(b) - priorityWeight(a) || b.score - a.score || a.name.localeCompare(b.name));
  const priority = lanes[0] ?? emptyLane;

  return {
    lanes,
    priority,
    summary: {
      totalCourses: courses.length,
      civilServicesNotes: lanes.filter((lane) => lane.track === "civil-services").reduce((sum, lane) => sum + lane.noteCount, 0),
      technicalQuestions: lanes.filter((lane) => lane.track !== "civil-services").reduce((sum, lane) => sum + lane.questionCount, 0),
      civilServicesPracticePrompts: lanes.filter((lane) => lane.track === "civil-services").reduce((sum, lane) => sum + lane.practicePromptCount, 0),
      activePracticeCourses: lanes.filter((lane) => lane.questionCount > 0 || lane.practicePromptCount > 0 || lane.runnableNoteCount > 0).length,
      practiceDebtCourses: lanes.filter((lane) => lane.status === "answer-practice-debt" || lane.status === "concept-bank").length
    }
  };
}
