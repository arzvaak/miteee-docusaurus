import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildCourseDiscoveryGroups, buildCourseStudyPath, filterCourseDiscoveryGroups, filterCourseNavigationGroups } from "../lib/course-outline";
import type { Course, CourseNavigationGroup, NotePreview } from "../lib/content";

const courseOutlineSource = fs.readFileSync("components/CourseOutline.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

function note(overrides: Partial<NotePreview>): NotePreview {
  return {
    slug: overrides.slug || "note",
    title: overrides.title || overrides.label || "Note",
    label: overrides.label || overrides.title || "Note",
    aliases: overrides.aliases || [],
    headings: overrides.headings || [],
    courseCode: overrides.courseCode ?? "UPSC-CSE-POLITICAL-SCIENCE",
    courseName: overrides.courseName ?? "UPSC Political Science NCERT",
    week: overrides.week ?? null,
    excerpt: overrides.excerpt || "",
    runnable: overrides.runnable ?? false,
    stats: overrides.stats || { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 0 }
  };
}

const groups: CourseNavigationGroup[] = [
  {
    key: "class-9/democratic-politics-i",
    label: "Class 9 · Democratic Politics I",
    notes: [
      { ...note({ slug: "democracy", label: "What is Democracy? Why Democracy?", headings: ["Democracy", "Arguments against democracy"] }), current: false },
      { ...note({ slug: "constitutional-design", label: "Constitutional Design", headings: ["South Africa", "Indian Constitution"] }), current: false }
    ]
  },
  {
    key: "class-10/democratic-politics-ii",
    label: "Class 10 · Democratic Politics II",
    notes: [
      { ...note({ slug: "power-sharing", label: "Power Sharing", headings: ["Belgium", "Sri Lanka"] }), current: false },
      { ...note({ slug: "federalism", label: "Federalism", headings: ["Indian federalism", "Decentralisation"] }), current: false }
    ]
  }
];

test("filterCourseNavigationGroups returns the complete outline for blank search", () => {
  const result = filterCourseNavigationGroups(groups, "   ");

  assert.equal(result.length, 2);
  assert.equal(result[0]?.notes.length, 2);
  assert.equal(result[1]?.notes.length, 2);
});

test("filterCourseNavigationGroups narrows by note title and heading text", () => {
  const byTitle = filterCourseNavigationGroups(groups, "federalism");
  assert.equal(byTitle.length, 1);
  assert.equal(byTitle[0]?.label, "Class 10 · Democratic Politics II");
  assert.deepEqual(byTitle[0]?.notes.map((item) => item.slug), ["federalism"]);

  const byHeading = filterCourseNavigationGroups(groups, "south africa");
  assert.equal(byHeading.length, 1);
  assert.deepEqual(byHeading[0]?.notes.map((item) => item.slug), ["constitutional-design"]);
});

test("filterCourseNavigationGroups keeps a whole section when the group label matches", () => {
  const result = filterCourseNavigationGroups(groups, "class 10");

  assert.equal(result.length, 1);
  assert.equal(result[0]?.label, "Class 10 · Democratic Politics II");
  assert.deepEqual(result[0]?.notes.map((item) => item.slug), ["power-sharing", "federalism"]);
});

function course(overrides: Partial<Course>): Course {
  return {
    code: overrides.code || "SEM5-EM2",
    folder: overrides.folder || "sem5/em2",
    name: overrides.name || "Electrical Machines II",
    level: overrides.level || "Semester 5",
    category: overrides.category || overrides.level || "Semester 5",
    noteCount: overrides.noteCount ?? 24,
    runnableNoteCount: overrides.runnableNoteCount ?? 0,
    questionCount: overrides.questionCount ?? 120,
    practicePromptCount: overrides.practicePromptCount ?? 0,
    syllabusSummary: overrides.syllabusSummary || ["Exam notes and solved questions"],
    quizSets: overrides.quizSets || []
  };
}

test("buildCourseDiscoveryGroups groups courses by study level and exposes compact lanes", () => {
  const discovery = buildCourseDiscoveryGroups([
    course({ code: "SEM5-EM2", level: "Semester 5", questionCount: 461, noteCount: 30 }),
    course({ code: "SEM6-MI", level: "Semester 6", questionCount: 85, noteCount: 11 }),
    course({ code: "UPSC-CSE-POLITICAL-SCIENCE", level: "UPSC CSE", category: "Civil services", practicePromptCount: 102, questionCount: 0, noteCount: 58 }),
    course({ code: "MITEEE", level: "MIT EEE", category: "General", noteCount: 1, questionCount: 0, runnableNoteCount: 1 })
  ]);

  assert.deepEqual(discovery.groups.map((group) => group.label), ["Civil services", "Semester 5", "Semester 6", "MIT EEE"]);
  assert.deepEqual(discovery.filters.map((filter) => filter.id), ["all", "practice-heavy", "exam-ready", "code-ready", "semester-5", "semester-6", "upsc"]);
  assert.equal(discovery.filters.find((filter) => filter.id === "practice-heavy")?.count, 3);
  assert.equal(discovery.filters.find((filter) => filter.id === "exam-ready")?.count, 3);
});

test("filterCourseDiscoveryGroups narrows by selected lane and text query", () => {
  const discovery = buildCourseDiscoveryGroups([
    course({ code: "SEM5-EM2", level: "Semester 5", name: "Electrical Machines II", questionCount: 461 }),
    course({ code: "SEM5-EOM", level: "Semester 5", name: "Essentials of Management", questionCount: 0, runnableNoteCount: 16 }),
    course({ code: "SEM6-MI", level: "Semester 6", name: "Measurements & Instrumentation", questionCount: 85 })
  ]);

  const practiceHeavy = filterCourseDiscoveryGroups(discovery.groups, "practice-heavy", "");
  assert.deepEqual(practiceHeavy.flatMap((group) => group.courses.map((item) => item.code)), ["SEM5-EM2", "SEM6-MI"]);

  const queried = filterCourseDiscoveryGroups(discovery.groups, "all", "management");
  assert.deepEqual(queried.flatMap((group) => group.courses.map((item) => item.code)), ["SEM5-EOM"]);
});

test("buildCourseStudyPath selects start, high-yield, and practice-heavy outline links", () => {
  const result = buildCourseStudyPath([
    {
      key: "week-01",
      label: "Week 1",
      notes: [
        { ...note({ slug: "overview", label: "Overview", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 0 } }), current: false },
        { ...note({ slug: "machines", label: "Machines problems", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 12, details: 0, questionBlocks: 20 } }), current: false }
      ]
    },
    {
      key: "reference",
      label: "Reference",
      notes: [
        { ...note({ slug: "pyq-bank", label: "PYQ bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 0, questionBlocks: 80 } }), current: false }
      ]
    }
  ]);

  assert.equal(result.start?.slug, "overview");
  assert.deepEqual(result.highYield.map((item) => item.slug), ["pyq-bank", "machines"]);
  assert.deepEqual(result.practiceHeavy.map((item) => item.slug), ["pyq-bank", "machines"]);
  assert.equal(result.noteCount, 3);
});

test("course outline sections are independently collapsible", () => {
  assert.match(courseOutlineSource, /collapsedGroupKeys/);
  assert.match(courseOutlineSource, /course-outline-group-toggle/);
  assert.match(courseOutlineSource, /aria-expanded=\{!collapsed\}/);
  assert.match(courseOutlineSource, /const listId = `\$\{courseOutlineId\(group\)\}-notes`/);
  assert.match(courseOutlineSource, /aria-controls=\{listId\}/);
  assert.match(courseOutlineSource, /course-outline-group collapsed/);
  assert.match(courseOutlineSource, /setCollapsedGroupKeys/);
  assert.match(css, /\.course-outline-group-toggle/);
  assert.match(css, /\.course-outline-group\.collapsed/);
  assert.match(css, /\.course-outline-list\[hidden\]/);
});

test("SSC CGL course outline renders as a four-level exam map", () => {
  const coursePage = fs.readFileSync("app/courses/[code]/page.tsx", "utf8");

  assert.match(coursePage, /<CourseOutline groups=\{courseGroups\} courseName=\{course\.name\} courseCode=\{course\.code\} \/>/);
  assert.match(courseOutlineSource, /courseCode/);
  assert.match(courseOutlineSource, /const isSscCgl = courseCode === "SSC-CGL"/);
  assert.match(courseOutlineSource, /SSC Study OS/);
  assert.match(courseOutlineSource, /Tier-I level map/);
  assert.match(courseOutlineSource, /Four-level outline/);
  assert.match(courseOutlineSource, /200\/200 drills/);
  assert.match(courseOutlineSource, /course-ssc-level-strip/);
  assert.match(courseOutlineSource, /course-ssc-level-node/);
  assert.match(courseOutlineSource, /Level \{index \+ 1\}/);
  assert.match(courseOutlineSource, /\{group\.notes\.length\} \{group\.notes\.length === 1 \? "sublevel" : "sublevels"\}/);
  assert.doesNotMatch(courseOutlineSource, /OCR|pipeline|corpus audit|source registry/i);
  assert.match(css, /\.course-outline-panel\.ssc-course-outline/);
  assert.match(css, /\.course-ssc-level-strip/);
  assert.match(css, /\.course-ssc-level-node/);
});
