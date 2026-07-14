import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getCourse, getCourseNavigationGroups } from "../lib/content";
import { getSscCglDashboard } from "../lib/ssc-cgl";

const coursePageSource = fs.readFileSync("app/courses/[code]/page.tsx", "utf8");
const landingSource = fs.readFileSync("components/SscCglLibraryLanding.tsx", "utf8");
const landingCss = fs.readFileSync("components/SscCglLibraryLanding.module.css", "utf8");

test("SSC CGL course route uses the dedicated subject library before the generic course outline", () => {
  assert.match(coursePageSource, /course\.code === "SSC-CGL"/);
  assert.match(coursePageSource, /<SscCglLibraryLanding/);
  assert.match(coursePageSource, /reviewedQuestions: dashboard\.readiness\.reviewedQuestions/);
  assert.match(coursePageSource, /fullMocks: dashboard\.readiness\.fullMocks/);
  assert.match(coursePageSource, /sectionReadiness\.map/);
  assert.ok(coursePageSource.indexOf("<SscCglLibraryLanding") < coursePageSource.indexOf("<CourseResumePanel"));
});

test("SSC CGL landing reports current corpus depth instead of hard-coded totals", () => {
  const course = getCourse("SSC-CGL");
  const groups = getCourseNavigationGroups("SSC-CGL");
  const dashboard = getSscCglDashboard();

  assert.ok(course);
  assert.equal(groups.length, 4);
  assert.equal(groups.reduce((total, group) => total + group.notes.length, 0), course.noteCount);
  assert.ok(dashboard.readiness.reviewedQuestions > 0);
  assert.ok(dashboard.readiness.fullMocks > 0);
  assert.equal(dashboard.readiness.sectionReadiness.length, 4);
  assert.match(landingSource, /corpus\.reviewedQuestions/);
  assert.match(landingSource, /corpus\.fullMocks/);
  assert.match(landingSource, /corpusSection\?\.reviewedQuestions/);
  assert.match(landingSource, /corpusSection\?\.bookBackedQuestions/);
});

test("subject activity and progress come only from saved reader data", () => {
  assert.match(landingSource, /parseReaderProgressStore/);
  assert.match(landingSource, /readerProgressStorageKey/);
  assert.match(landingSource, /subjectProgress\(group, progressStore\)/);
  assert.match(landingSource, /a\.progress\.active !== b\.progress\.active/);
  assert.match(landingSource, /Nothing is marked complete in advance/);
  assert.match(landingSource, /Saved reading progress/);
  assert.doesNotMatch(landingSource, /readinessPercent/);
});

test("the full syllabus stays compact and searchable", () => {
  assert.match(landingSource, /The complete syllabus, folded neatly/);
  assert.match(landingSource, /Search SSC CGL topics/);
  assert.match(landingSource, /<details/);
  assert.match(landingSource, /open=\{normalizedQuery \? true : undefined\}/);
  assert.match(landingCss, /\.subjectGrid\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s);
  assert.match(landingCss, /\.syllabusList/);
  assert.match(landingCss, /\.syllabusGroup/);
  assert.match(landingCss, /grid-template-columns:\s*repeat\(2,/);
  assert.match(landingCss, /grid-template-columns:\s*1fr/);
});

test("SSC CGL subject landing keeps its main controls accessible", () => {
  assert.match(landingSource, /aria-label="Breadcrumb"/);
  assert.match(landingSource, /aria-labelledby="ssc-library-title"/);
  assert.match(landingSource, /aria-labelledby="ssc-subjects-title"/);
  assert.match(landingSource, /aria-live="polite"/);
  assert.match(landingSource, /aria-label="Search SSC CGL topics"/);
  assert.match(landingCss, /\.heroActions \.primaryAction:hover,[\s\S]*?\.heroActions \.primaryAction:focus-visible\s*\{[^}]*color:\s*var\(--bg\)/s);
  assert.match(landingCss, /:global\(:root\[data-theme="high-contrast"\]\) \.noteLink:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--accent\)/s);
});
