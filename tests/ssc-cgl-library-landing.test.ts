import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getCourseNavigationGroups } from "../lib/content";
import { getSscCglDashboard } from "../lib/ssc-cgl";

const examPageSource = fs.readFileSync("app/exams/ssc-cgl/page.tsx", "utf8");
const legacyCoursePageSource = fs.readFileSync("app/courses/[code]/page.tsx", "utf8");
const landingSource = fs.readFileSync("components/SscCglLibraryLanding.tsx", "utf8");
const landingCss = fs.readFileSync("components/SscCglLibraryLanding.module.css", "utf8");

test("SSC CGL is mounted as an exam overview and the legacy course URL redirects", () => {
  assert.match(examPageSource, /getCourseNavigationGroups\("SSC-CGL"\)/);
  assert.match(examPageSource, /getSscCglDashboard\(\)/);
  assert.match(examPageSource, /<SscCglLibraryLanding/);
  assert.match(examPageSource, /reviewedQuestions: dashboard\.readiness\.reviewedQuestions/);
  assert.match(examPageSource, /fullMocks: dashboard\.readiness\.fullMocks/);
  assert.match(examPageSource, /sectionReadiness\.map/);

  assert.match(
    legacyCoursePageSource,
    /course\.code === "SSC-CGL"[\s\S]*?(?:permanentRedirect|redirect)\("\/exams\/ssc-cgl"\)/
  );
  assert.doesNotMatch(legacyCoursePageSource, /course\.code === "SSC-CGL"[\s\S]*?<SscCglLibraryLanding/);
});

test("SSC CGL exam overview reports live study and practice depth", () => {
  const groups = getCourseNavigationGroups("SSC-CGL");
  const dashboard = getSscCglDashboard();

  assert.equal(groups.length, 4);
  assert.ok(groups.every((group) => group.notes.length > 0));
  assert.ok(dashboard.readiness.reviewedQuestions > 0);
  assert.ok(dashboard.readiness.fullMocks > 0);
  assert.equal(dashboard.readiness.sectionReadiness.length, 4);
  assert.match(landingSource, /corpus\.reviewedQuestions/);
  assert.match(landingSource, /corpus\.fullMocks/);
  assert.match(landingSource, /corpusSection\?\.reviewedQuestions/);
  assert.match(landingSource, /corpusSection\?\.bookBackedQuestions/);
});

test("exam overview links subjects and topics through the canonical exam hierarchy", () => {
  assert.match(landingSource, /<Link href="\/exams">Exams<\/Link>/);
  assert.match(landingSource, /sscCglSubjectHref/);
  assert.match(landingSource, /\/exams\/ssc-cgl\/topics\//);
  assert.doesNotMatch(landingSource, /<Link href="\/courses">Subjects<\/Link>/);
  assert.doesNotMatch(landingSource, /\/notes\//);
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

test("the complete SSC CGL syllabus stays compact and searchable", () => {
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

test("SSC CGL exam overview keeps its main controls accessible", () => {
  assert.match(landingSource, /aria-label="Breadcrumb"/);
  assert.match(landingSource, /aria-labelledby="ssc-library-title"/);
  assert.match(landingSource, /aria-labelledby="ssc-subjects-title"/);
  assert.match(landingSource, /aria-live="polite"/);
  assert.match(landingSource, /aria-label="Search SSC CGL topics"/);
  assert.match(landingCss, /\.heroActions \.primaryAction:hover,[\s\S]*?\.heroActions \.primaryAction:focus-visible\s*\{[^}]*color:\s*var\(--bg\)/s);
  assert.match(landingCss, /:global\(:root\[data-theme="high-contrast"\]\) \.noteLink:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--accent\)/s);
});
