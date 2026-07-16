import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { courseDisplaySummary, type Course } from "../lib/content";

const coursePage = fs.readFileSync("app/courses/[code]/page.tsx", "utf8");
const homePage = fs.readFileSync("app/page.tsx", "utf8");
const courseOutline = fs.existsSync("components/CourseOutline.tsx") ? fs.readFileSync("components/CourseOutline.tsx", "utf8") : "";
const studyDashboard = fs.readFileSync("components/StudyDashboard.tsx", "utf8");
const studyDashboardCss = fs.readFileSync("components/StudyDashboard.module.css", "utf8");
const studyToday = fs.readFileSync("components/StudyToday.tsx", "utf8");
const answerPracticeLab = fs.existsSync("components/AnswerPracticeLab.tsx") ? fs.readFileSync("components/AnswerPracticeLab.tsx", "utf8") : "";
const coursePracticeSection = fs.readFileSync("components/CoursePracticeSection.tsx", "utf8");
const courseResumePanel = fs.existsSync("components/CourseResumePanel.tsx") ? fs.readFileSync("components/CourseResumePanel.tsx", "utf8") : "";
const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
const previewLink = fs.readFileSync("components/PreviewLink.tsx", "utf8");
const readerControls = fs.readFileSync("components/ReaderControls.tsx", "utf8");
const css = `${fs.readFileSync("app/globals.css", "utf8")}\n${fs.readFileSync("app/study-minimal.css", "utf8")}`;

function ruleBodies(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Array.from(css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gm"))).map((match) => match[1] ?? "");
}

function hasRule(selector: string, pattern: RegExp) {
  return ruleBodies(selector).some((body) => pattern.test(body));
}

test("dense note lists do not prefetch every heavyweight note page", () => {
  assert.match(courseOutline, /<Link\s+prefetch=\{false\}\s+className="course-outline-note"/);
  assert.match(studyDashboard, /<Link\s+prefetch=\{false\}\s+className=\{styles\.cardAction\}\s+href=\{activity\?\.href/);
  assert.match(coursePracticeSection, /<Link\s+prefetch=\{false\}\s+href=\{`\/notes\/\$\{drill\.slug\}`\}/);
  assert.match(readerControls, /<Link\s+prefetch=\{false\}\s+aria-current=\{item\.current/);
  assert.match(previewLink, /<Link\s+prefetch=\{false\}\s+href=\{`\/notes\/\$\{preview\.slug\}`\}/);
  assert.match(answerPracticeLab, /<Link\s+prefetch=\{false\}\s+className="button ghost"\s+href=\{`\/notes\/\$\{selected\.slug\}`\}/);
  assert.match(notePage, /<Link\s+prefetch=\{false\}\s+className="lesson-step previous"/);
  assert.match(notePage, /<Link\s+prefetch=\{false\}\s+className="lesson-step next"/);
});

test("heavy note and SSC test routes render on demand instead of bloating standalone output", () => {
  const noteRoute = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
  const sscTestRoute = fs.readFileSync("app/exams/ssc-cgl/tests/[testId]/page.tsx", "utf8");

  assert.doesNotMatch(noteRoute, /generateStaticParams/);
  assert.doesNotMatch(noteRoute, /getNotesIndex\(\)\.map/);
  assert.doesNotMatch(sscTestRoute, /generateStaticParams/);
  assert.doesNotMatch(sscTestRoute, /getSscCglTests\(\)\.map/);
});

test("course detail pages expose grouped table of contents navigation", () => {
  assert.match(coursePage, /getCourseNavigationGroups/);
  assert.match(coursePage, /CourseResumePanel/);
  assert.match(coursePage, /<CourseOutline/);
  assert.match(courseOutline, /course-outline-panel/);
  assert.match(courseOutline, /id="course-map"/);
  assert.match(courseOutline, /<details className="course-outline-tools">/);
  assert.match(courseOutline, /course-outline-jump/);
  assert.match(courseOutline, /course-outline-group/);
  assert.match(courseOutline, /course-outline-search/);
  assert.match(courseOutline, /filterCourseNavigationGroups/);
  assert.match(courseOutline, /<Link\s+prefetch=\{false\}\s+className="course-outline-note"/);
  assert.equal(hasRule(".course-outline-grid", /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/), true);
  assert.equal(hasRule(".course-outline-grid", /grid-template-columns:\s*1fr;/), true);
});

test("course detail first viewport stays calm while keeping primary course actions", () => {
  assert.match(coursePage, /className="course-header-copy"/);
  assert.match(coursePage, /className="course-header-actions"/);
  assert.match(coursePage, /href="#course-resume"/);
  assert.match(coursePage, /href="#course-map"/);
  assert.match(coursePage, /href=\{upscDrills\.length > 0 \|\| coursePracticeDrills\.length > 0 \? "#course-practice" : "#course-map"\}/);
  assert.match(coursePage, /<Link className="button ghost" href="\/courses">All courses<\/Link>/);
  assert.match(coursePage, /<details className="course-detail-metrics">/);
  assert.match(coursePage, /<summary>Course numbers<\/summary>/);
  assert.match(coursePage, /<div id="course-resume">/);
  assert.match(coursePage, /<div id="course-practice" className="course-practice-anchor">/);
  assert.equal(hasRule(".course-page-header", /box-shadow:\s*none;/), true);
  assert.equal(hasRule(".course-page-header", /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(220px,\s*0\.28fr\);/), true);
  assert.equal(hasRule(".course-page-header h1", /font-size:\s*clamp\(30px,\s*3\.2vw,\s*44px\);/), true);
  assert.equal(hasRule(".course-detail-metrics .stats-grid", /grid-template-columns:\s*1fr;/), true);
  assert.equal(hasRule(".course-header-actions", /flex-wrap:\s*wrap;/), true);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.course-detail-metrics\s*\{[^}]*width:\s*100%;/s);
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?\.course-header-actions \.button\s*\{[^}]*flex:\s*1 1 min\(150px,\s*100%\);/s);
});

test("course map dense controls are progressively disclosed", () => {
  const toolsIndex = courseOutline.indexOf('<details className="course-outline-tools">');
  const gridIndex = courseOutline.indexOf('<div className="course-outline-grid" id="course-full-outline">');

  assert.ok(toolsIndex > 0);
  assert.ok(gridIndex > toolsIndex);
  assert.match(courseOutline, /Find in course map/);
  assert.match(courseOutline, /Search lessons and jump to sections/);
  assert.match(courseOutline, /<label className="course-outline-search">/);
  assert.match(courseOutline, /<nav className="course-outline-jump" aria-label="Jump to course section">/);
  assert.equal(hasRule(".course-outline-tools", /border:\s*1px solid var\(--border\);/), true);
  assert.equal(hasRule(".course-outline-tools > summary", /cursor:\s*pointer;/), true);
  assert.equal(hasRule(".course-outline-tool-body", /display:\s*grid;/), true);
  assert.equal(hasRule(".course-outline-grid", /scroll-margin-top:\s*84px;/), true);
});

test("course map lesson labels wrap instead of clipping dense navigation", () => {
  const lessonTitleRules = ruleBodies(".course-outline-note strong").join("\n");

  assert.doesNotMatch(lessonTitleRules, /white-space:\s*nowrap;/);
  assert.doesNotMatch(lessonTitleRules, /text-overflow:\s*ellipsis;/);
  assert.match(lessonTitleRules, /white-space:\s*normal;/);
  assert.match(lessonTitleRules, /text-overflow:\s*clip;/);
  assert.match(lessonTitleRules, /overflow-wrap:\s*anywhere;/);
});

test("course detail pages surface unfinished reading progress before the outline", () => {
  const resumeIndex = coursePage.indexOf("<CourseResumePanel");
  const outlineIndex = coursePage.indexOf("<CourseOutline");

  assert.ok(resumeIndex > 0);
  assert.ok(outlineIndex > resumeIndex);
  assert.match(coursePage, /<CourseResumePanel courseCode=\{course\.code\} courseName=\{course\.name\} \/>/);
  assert.match(courseResumePanel, /selectCourseResumableReaderProgress\(store,\s*courseCode,\s*3\)/);
  assert.match(courseResumePanel, /readerProgressResumeHref\(entry\)/);
  assert.match(courseResumePanel, /className="course-resume-panel panel"/);
  assert.match(courseResumePanel, /aria-label="Resume this course"/);
  assert.match(css, /\.course-resume-panel/);
  assert.match(css, /\.course-resume-list/);
  assert.match(css, /\.course-resume-row/);
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?\.course-resume-list\s*\{[^}]*grid-template-columns:\s*1fr;/s);
});

test("course detail table of contents appears before practice panels", () => {
  const outlineIndex = coursePage.indexOf("<CourseOutline");
  const upscPracticeIndex = coursePage.indexOf("<UpscActiveRecallSection");
  const coursePracticeIndex = coursePage.indexOf("<CoursePracticeSection");

  assert.ok(outlineIndex > 0);
  assert.ok(upscPracticeIndex > outlineIndex);
  assert.ok(coursePracticeIndex > outlineIndex);
});

test("course page header uses a readable product summary instead of SEO-truncated source text", () => {
  const course = {
    code: "UPSC-CSE-POLITICAL-SCIENCE",
    folder: "upsc-cse/political-science",
    name: "UPSC Political Science NCERT",
    level: "UPSC CSE",
    category: "Civil services",
    noteCount: 58,
    runnableNoteCount: 0,
    questionCount: 0,
    practicePromptCount: 102,
    syllabusSummary: ["Power Sharing Class 10 Democratic Politics II Source policy: current official primary Answer note: Prelims explanations and Mains outlines are AI generated st"],
    quizSets: []
  } satisfies Course;

  assert.match(coursePage, /courseDisplaySummary\(course\)/);
  assert.ok(courseDisplaySummary(course).includes("58 notes"));
  assert.ok(courseDisplaySummary(course).includes("102 practice prompts"));
  assert.doesNotMatch(courseDisplaySummary(course), /0 code notes/);
  assert.doesNotMatch(courseDisplaySummary(course), /\bAI generated st\b|\bsour$/i);
});

test("personal briefing body copy stays fully readable on mobile", () => {
  const bodies = ruleBodies(".memory-briefing-main p");

  assert.ok(bodies.length > 0);
  assert.equal(hasRule(".memory-briefing-main p", /-webkit-line-clamp/), false);
  assert.equal(hasRule(".memory-briefing-main p", /overflow:\s*hidden;/), false);
});

test("homepage keeps free exploration while using explicit local study states", () => {
  assert.match(studyDashboard, /Make room for what matters now\./);
  assert.match(studyDashboard, /What you need to do/);
  assert.match(studyDashboard, /Library spaces/);
  assert.match(studyDashboard, /group\.courses\.map/);
  assert.match(studyDashboard, /studySpaceStatusOptions\.map/);
  assert.match(studyDashboard, /Create a study plan/);
  assert.match(studyDashboard, /Device-local/);
  assert.doesNotMatch(studyDashboard, /Recent score|Weak topics|Next full mock|Your progress|Resume study/i);
  assert.match(studyDashboardCss, /\.spaceGrid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(250px,\s*1fr\)\);/);
  assert.match(studyDashboardCss, /\.statusControl\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/);
});

test("homepage has a responsive graphite-card canvas with a light alternative", () => {
  assert.match(css, /--bg:\s*#090c11/);
  assert.match(css, /\.main-content:has\(\.public-home-page\)[\s\S]*?background:\s*var\(--bg\)/);
  assert.match(studyDashboardCss, /--dashboard-panel:\s*#0e1621/);
  assert.match(studyDashboardCss, /:global\(:root\[data-theme="light"\]\) \.dashboard/);
  assert.match(studyDashboardCss, /@media \(max-width:\s*900px\)/);
  assert.match(studyDashboardCss, /\.spaceCardCompleted\s*\{/);
});

test("homepage leaves global search to the shell Quick Find without serializing an index", () => {
  assert.doesNotMatch(homePage, /getSearchCandidates/);
  assert.doesNotMatch(homePage, /searchNotes=/);
  assert.doesNotMatch(studyDashboard, /searchNotes/);
  assert.doesNotMatch(studyDashboard, /selectQuickSearchResults/);
  assert.doesNotMatch(studyDashboard, /\/api\/search/);
  assert.doesNotMatch(studyDashboard, /study-global-search|remoteNoteSearchState/);
});

test("study coach receives synthesized local weakness insight", () => {
  assert.match(studyToday, /buildLearnerWeaknessInsight/);
  assert.match(studyToday, /const weaknessInsight = useMemo/);
  assert.match(studyToday, /weaknessInsight\s*\n\s*\}\), \[memoryPriority, weaknessInsight\]\);/);
});

test("Study Today surfaces weakness repair before asking the coach", () => {
  const weaknessPanelIndex = studyToday.indexOf('className="study-weakness-brief"');
  const coachPanelIndex = studyToday.indexOf('className="study-coach-panel"');

  assert.ok(weaknessPanelIndex > 0);
  assert.ok(coachPanelIndex > weaknessPanelIndex);
  assert.match(studyToday, /weaknessInsight\.hasSignals/);
  assert.match(studyToday, /weaknessInsight\.topCourse\?\.label/);
  assert.match(studyToday, /weaknessInsight\.topTheme\?\.theme/);
  assert.match(studyToday, /weaknessInsight\.nextAction/);
  assert.match(studyToday, /const defaultCoachMode = weaknessInsight\.hasSignals \? "weakness-repair" : "balanced";/);
  assert.match(studyToday, /useState<StudyCoachPlanRequest\["mode"\] \| null>\(null\)/);
  assert.match(studyToday, /const selectedCoachMode = coachModeOverride \?\? defaultCoachMode;/);
  assert.match(studyToday, /mode: selectedCoachMode/);
  assert.match(studyToday, /value=\{selectedCoachMode\}/);
  assert.doesNotMatch(studyToday, /setMode\("weakness-repair"\)/);
  assert.match(studyToday, /className="study-coach-weakness-nudge"/);
  assert.equal(hasRule(".study-layout", /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(300px,\s*0\.34fr\);/), true);
  assert.equal(hasRule(".study-task-list", /grid-row:\s*1\s*\/\s*span\s*2;/), true);
  assert.equal(hasRule(".study-weakness-brief", /grid-template-columns:\s*1fr;/), true);
  assert.equal(hasRule(".study-coach-weakness-nudge", /background:\s*var\(--amber-soft\);/), true);
});

test("answer practice presents diagnosis as part of the primary workflow", () => {
  const workspaceIndex = answerPracticeLab.indexOf('<main className="practice-workspace panel">');
  const diagnosisIndex = answerPracticeLab.indexOf('<section className="practice-diagnosis"');

  assert.ok(workspaceIndex > 0);
  assert.ok(diagnosisIndex > workspaceIndex);
  assert.match(answerPracticeLab, /className="practice-step-strip"/);
  assert.match(answerPracticeLab, /Pick prompt/);
  assert.match(answerPracticeLab, /Write answer/);
  assert.match(answerPracticeLab, /Save repair/);
  assert.match(answerPracticeLab, /className="practice-primary-grid"/);
  assert.match(answerPracticeLab, /className="practice-next-drill"/);
  assert.doesNotMatch(answerPracticeLab, /<aside className="practice-diagnosis panel"/);
  assert.equal(hasRule(".practice-lab", /grid-template-columns:\s*minmax\(260px,\s*0\.36fr\)\s+minmax\(0,\s*1fr\);/), true);
  assert.equal(hasRule(".practice-primary-grid", /grid-template-columns:\s*minmax\(0,\s*1\.05fr\)\s+minmax\(360px,\s*0\.95fr\);/), true);
  assert.equal(hasRule(".practice-next-drill", /order:\s*-1;/), true);
});

test("homepage study section progressively discloses dense support controls", () => {
  assert.match(studyToday, /<details className="study-task-workflow-disclosure">/);
  assert.match(studyToday, /Checklist, repair log/);
  assert.match(studyToday, /<details className="study-why-disclosure">/);
  assert.match(studyToday, /Evidence protocol and sources/);
  assert.match(studyToday, /className="study-repair-log"/);
  assert.match(studyToday, /className="study-task-checklist"/);
  assert.match(studyToday, /className="study-coach-panel"/);
  assert.match(css, /\.public-home-page \.study-task-workflow-disclosure summary,[\s\S]*?cursor:\s*pointer;/);
  assert.equal(hasRule(".public-home-page .study-task-card p", /-webkit-line-clamp:\s*2;/), true);
  assert.equal(hasRule(".public-home-page .study-command-row", /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(280px,\s*0\.72fr\);/), true);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.public-home-page \.study-command-row,[\s\S]*?\.study-command-row\s*\{[^}]*grid-template-columns:\s*1fr;/s);
});

test("wide KaTeX displays stay contained on narrow reader screens", () => {
  assert.equal(hasRule(".article .markdown-body .katex-display", /max-width:\s*100%;/), true);
  assert.equal(hasRule(".article .markdown-body .katex-display", /overflow-x:\s*auto;/), true);
  assert.equal(hasRule(".article .markdown-body .katex", /max-width:\s*100%;/), true);
  assert.equal(hasRule(".article .markdown-body .katex", /overflow-x:\s*auto;/), true);
  assert.equal(hasRule(".article .markdown-body .katex-display > .katex", /display:\s*inline-block;/), true);
  assert.equal(hasRule(".article .markdown-body .katex-display > .katex", /min-width:\s*max-content;/), true);
});

test("previewable note links expose a live-preview affordance", () => {
  assert.match(previewLink, /useId/);
  assert.match(previewLink, /const previewId = useId\(\)/);
  assert.match(previewLink, /useState/);
  assert.match(previewLink, /const \[previewOpen, setPreviewOpen\] = useState\(false\)/);
  assert.match(previewLink, /aria-describedby=\{previewId\}/);
  assert.match(previewLink, /aria-controls=\{previewId\}/);
  assert.match(previewLink, /aria-expanded=\{previewOpen\}/);
  assert.match(previewLink, /data-preview-link="true"/);
  assert.match(previewLink, /data-preview-open=\{previewOpen \? "true" : undefined\}/);
  assert.match(previewLink, /id=\{previewId\}/);
  assert.match(previewLink, /title=\{`Preview: \$\{preview\.label\}`\}/);
  assert.match(previewLink, /className="preview-toggle"/);
  assert.match(previewLink, /setPreviewOpen\(\(open\) => !open\)/);
  assert.equal(hasRule(".preview-inline-link", /background:/), true);
  assert.equal(hasRule(".preview-inline-link", /border-radius:\s*4px;/), true);
  assert.equal(hasRule(".preview-toggle", /display:\s*none;/), true);
  assert.equal(hasRule('.preview-link-wrap[data-preview-open="true"] .hover-preview', /display:\s*grid;/), true);
  assert.match(css, /@media \(max-width:\s*820px\),\s*\(hover:\s*none\)[\s\S]*?\.preview-toggle\s*\{[\s\S]*?display:\s*inline-flex;/);
});

test("lesson sequence links announce clear previous and next destinations", () => {
  assert.match(notePage, /aria-label=\{`Previous lesson: \$\{previous\.label\}`\}/);
  assert.match(notePage, /aria-label=\{`Next lesson: \$\{next\.label\}`\}/);
  assert.match(notePage, /<small>Previous lesson<\/small>/);
  assert.match(notePage, /<small>Next lesson<\/small>/);
  assert.match(notePage, /<span className="lesson-step-separator" aria-hidden="true">/);
  assert.match(notePage, /<span className="sr-only">: <\/span>/);
  assert.equal(hasRule(".lesson-step-separator", /display:\s*inline-flex;/), true);
});

test("note reader exposes a one-click focus action that widens the lesson canvas", () => {
  assert.match(notePage, /ReaderFocusButton/);
  assert.match(notePage, /<ReaderFocusButton \/>/);
  assert.match(readerControls, /export function ReaderFocusButton/);
  assert.match(readerControls, /const shellSidebarStorageKey = "miteee-shell-sidebar-collapsed"/);
  assert.match(readerControls, /const shellSidebarStateChangeEvent = "miteee-shell-sidebar-state-change"/);
  assert.match(readerControls, /window\.localStorage\.setItem\(shellSidebarStorageKey,\s*"true"\)/);
  assert.match(readerControls, /document\.documentElement\.dataset\.sidebarCollapsed = "true"/);
  assert.match(readerControls, /window\.dispatchEvent\(new Event\(shellSidebarStateChangeEvent\)\)/);
  assert.match(readerControls, /window\.localStorage\.setItem\(readerGuideStorageKey,\s*"true"\)/);
  assert.match(readerControls, /window\.localStorage\.setItem\(readerToolsStorageKey,\s*"true"\)/);
  assert.match(readerControls, /applyReaderGuideState\(true\)/);
  assert.match(readerControls, /applyReaderToolsState\(true\)/);
  assert.match(readerControls, /aria-label="Focus lesson content"/);
  assert.equal(hasRule(".reader-focus-button", /justify-self:\s*start;/), true);
});

test("long note reader starts with compact action jumps instead of a dense tool stack", () => {
  assert.match(notePage, /ReaderQuickActions/);
  assert.match(notePage, /<ReaderQuickActions \/>/);
  assert.match(notePage, /id="lesson-body"/);
  assert.match(readerControls, /export function ReaderQuickActions/);
  assert.match(readerControls, /goToReaderTarget\("lesson-body"\)/);
  assert.match(readerControls, /goToReaderTarget\("note-practice",\s*\{ tools: true \}\)/);
  assert.match(readerControls, /goToReaderTarget\("course-map",\s*\{ guide: true, courseMap: true \}\)/);
  assert.match(readerControls, /goToReaderTarget\("reader-tools",\s*\{ tools: true \}\)/);
  assert.match(readerControls, /window\.localStorage\.setItem\(readerToolsStorageKey,\s*"false"\)/);
  assert.match(readerControls, /window\.localStorage\.setItem\(readerGuideStorageKey,\s*"false"\)/);
  assert.match(readerControls, /window\.localStorage\.setItem\(readerCourseMapStorageKey,\s*"false"\)/);
  assert.equal(hasRule(".reader-quick-actions", /display:\s*grid;/), true);
  assert.equal(hasRule(".reader-quick-actions", /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/), true);
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?\.reader-quick-actions\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
});

test("note practice keeps drill detail progressively disclosed for long notes", () => {
  const notePracticePanel = fs.readFileSync("components/NotePracticePanel.tsx", "utf8");

  assert.match(notePracticePanel, /id="note-practice"/);
  assert.match(notePracticePanel, /<details className="note-practice-details">/);
  assert.match(notePracticePanel, /<summary>Practice steps<\/summary>/);
  assert.match(notePracticePanel, /className="note-practice-summary"/);
  assert.equal(hasRule(".note-practice-details", /border:\s*1px solid var\(--border\);/), true);
  assert.equal(hasRule(".note-practice-details > summary", /cursor:\s*pointer;/), true);
  assert.equal(hasRule(".note-practice-summary", /display:\s*grid;/), true);
  assert.equal(hasRule(".note-practice-card", /scroll-margin-top:\s*84px;/), true);
});

test("mobile note reader exposes a direct jump into the lesson content", () => {
  assert.match(notePage, /<a className="reader-skip-link" href="#lesson-content">/);
  assert.match(notePage, /<article id="lesson-content"/);
  assert.equal(hasRule(".reader-skip-link", /display:\s*none;/), true);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-skip-link\s*\{[^}]*display:\s*inline-flex;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-skip-link\s*\{[^}]*grid-column:\s*1 \/ -1;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-skip-link\s*\{[^}]*order:\s*0;/s);
});
