import type { Course, CourseNavigationGroup, CourseNavigationItem } from "@/lib/content";

export type CourseDiscoveryFilterId =
  | "all"
  | "practice-heavy"
  | "exam-ready"
  | "code-ready"
  | "semester-5"
  | "semester-6"
  | "upsc";

export type CourseDiscoveryFilter = {
  id: CourseDiscoveryFilterId;
  label: string;
  count: number;
};

export type CourseDiscoveryGroup = {
  key: string;
  label: string;
  summary: string;
  courses: Course[];
};

export type CourseStudyPath = {
  start: CourseNavigationItem | null;
  highYield: CourseNavigationItem[];
  practiceHeavy: CourseNavigationItem[];
  groupCount: number;
  noteCount: number;
};

function normalizeCourseOutlineText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function noteSearchText(note: CourseNavigationGroup["notes"][number]) {
  return normalizeCourseOutlineText([
    note.label,
    note.title,
    note.courseCode || "",
    note.courseName || "",
    note.aliases.join(" "),
    note.headings.join(" "),
    note.excerpt
  ].join(" "));
}

export function filterCourseNavigationGroups(groups: CourseNavigationGroup[], query: string) {
  const normalizedQuery = normalizeCourseOutlineText(query);
  if (!normalizedQuery) return groups;

  return groups
    .map((group) => {
      if (normalizeCourseOutlineText(group.label).includes(normalizedQuery)) return group;
      return {
        ...group,
        notes: group.notes.filter((note) => noteSearchText(note).includes(normalizedQuery))
      };
    })
    .filter((group) => group.notes.length > 0);
}

export function buildCourseDiscoveryGroups(courses: Course[]) {
  const sortedCourses = [...courses].sort(compareDiscoveryCourses);
  const groupMap = new Map<string, CourseDiscoveryGroup>();

  for (const course of sortedCourses) {
    const label = courseDiscoveryGroupLabel(course);
    const key = normalizeCourseOutlineText(label).replace(/\s+/g, "-") || "courses";
    const group = groupMap.get(key) || {
      key,
      label,
      summary: courseDiscoveryGroupSummary(label),
      courses: []
    };
    group.courses.push(course);
    groupMap.set(key, group);
  }

  const groups = [...groupMap.values()].sort(compareDiscoveryGroups);
  return {
    filters: buildCourseDiscoveryFilters(courses),
    groups
  };
}

export function filterCourseDiscoveryGroups(groups: CourseDiscoveryGroup[], filterId: CourseDiscoveryFilterId, query: string) {
  const normalizedQuery = normalizeCourseOutlineText(query);

  return groups
    .map((group) => ({
      ...group,
      courses: group.courses.filter((course) => matchesCourseDiscoveryFilter(course, filterId) && matchesCourseDiscoveryQuery(course, normalizedQuery))
    }))
    .filter((group) => group.courses.length > 0);
}

export function buildCourseStudyPath(groups: CourseNavigationGroup[]): CourseStudyPath {
  const notes = groups.flatMap((group) => group.notes);
  const start = notes[0] ?? null;
  const highYield = [...notes]
    .filter((note) => note !== start && highYieldScore(note) > 0)
    .sort((a, b) => highYieldScore(b) - highYieldScore(a))
    .slice(0, 3);
  const practiceHeavy = [...notes]
    .filter((note) => note.stats.questionBlocks > 0)
    .sort((a, b) => b.stats.questionBlocks - a.stats.questionBlocks || highYieldScore(b) - highYieldScore(a))
    .slice(0, 3);

  return {
    start,
    highYield,
    practiceHeavy,
    groupCount: groups.length,
    noteCount: notes.length
  };
}

function buildCourseDiscoveryFilters(courses: Course[]): CourseDiscoveryFilter[] {
  const filters: CourseDiscoveryFilter[] = [
    { id: "all", label: "All", count: courses.length },
    { id: "practice-heavy", label: "Practice-heavy", count: courses.filter(isPracticeHeavyCourse).length },
    { id: "exam-ready", label: "Exam-ready", count: courses.filter(isExamReadyCourse).length },
    { id: "code-ready", label: "Code-ready", count: courses.filter((course) => course.runnableNoteCount > 0).length },
    { id: "semester-5", label: "Semester 5", count: courses.filter((course) => /semester\s*5/i.test(course.level)).length },
    { id: "semester-6", label: "Semester 6", count: courses.filter((course) => /semester\s*6/i.test(course.level)).length },
    { id: "upsc", label: "UPSC", count: courses.filter(isUpscCourse).length }
  ];

  return filters.filter((filter) => filter.id === "all" || filter.count > 0);
}

function matchesCourseDiscoveryFilter(course: Course, filterId: CourseDiscoveryFilterId) {
  if (filterId === "practice-heavy") return isPracticeHeavyCourse(course);
  if (filterId === "exam-ready") return isExamReadyCourse(course);
  if (filterId === "code-ready") return course.runnableNoteCount > 0;
  if (filterId === "semester-5") return /semester\s*5/i.test(course.level);
  if (filterId === "semester-6") return /semester\s*6/i.test(course.level);
  if (filterId === "upsc") return isUpscCourse(course);
  return true;
}

function matchesCourseDiscoveryQuery(course: Course, normalizedQuery: string) {
  if (!normalizedQuery) return true;
  return normalizeCourseOutlineText([
    course.code,
    course.name,
    course.level,
    course.category,
    course.syllabusSummary.join(" ")
  ].join(" ")).includes(normalizedQuery);
}

function compareDiscoveryCourses(a: Course, b: Course) {
  const practiceOrder = coursePracticeTotal(b) - coursePracticeTotal(a);
  if (practiceOrder !== 0) return practiceOrder;
  const noteOrder = b.noteCount - a.noteCount;
  if (noteOrder !== 0) return noteOrder;
  return a.code.localeCompare(b.code);
}

function compareDiscoveryGroups(a: CourseDiscoveryGroup, b: CourseDiscoveryGroup) {
  const priority = discoveryGroupPriority(a.label) - discoveryGroupPriority(b.label);
  if (priority !== 0) return priority;
  return a.label.localeCompare(b.label);
}

function discoveryGroupPriority(label: string) {
  if (/civil services|upsc/i.test(label)) return 0;
  if (/semester\s*5/i.test(label)) return 1;
  if (/semester\s*6/i.test(label)) return 2;
  if (/mit eee|general/i.test(label)) return 9;
  return 5;
}

function courseDiscoveryGroupLabel(course: Course) {
  if (isUpscCourse(course)) return "Civil services";
  return course.level || course.category || "Courses";
}

function courseDiscoveryGroupSummary(label: string) {
  if (/civil services/i.test(label)) return "Breadth-first reading with active recall prompts.";
  if (/semester\s*5/i.test(label)) return "Core exam material, solved banks, and technical notes.";
  if (/semester\s*6/i.test(label)) return "Later semester subjects, tutorials, and applied notes.";
  return "General vault references and launch points.";
}

function isUpscCourse(course: Course) {
  return /upsc|civil services/i.test(`${course.code} ${course.name} ${course.level} ${course.category}`);
}

function isPracticeHeavyCourse(course: Course) {
  return coursePracticeTotal(course) >= 20;
}

function isExamReadyCourse(course: Course) {
  return course.noteCount >= 10 && coursePracticeTotal(course) > 0;
}

function coursePracticeTotal(course: Course) {
  return course.questionCount + (course.practicePromptCount ?? 0);
}

function highYieldScore(note: CourseNavigationItem) {
  return note.stats.questionBlocks * 3 + note.stats.mathBlocks + note.stats.mermaidBlocks + (note.runnable ? 2 : 0);
}
