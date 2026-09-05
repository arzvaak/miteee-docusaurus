import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getSscCglDashboard, getSscTopics } from "../lib/ssc-cgl";
import { getSscQuantBookChapters } from "../lib/ssc-quant-book";

const examPageSource = fs.readFileSync("app/exams/ssc-cgl/page.tsx", "utf8");
const legacyCoursePageSource = fs.readFileSync("app/courses/[code]/page.tsx", "utf8");
const landingSource = fs.readFileSync("components/SscCglLibraryLanding.tsx", "utf8");
const landingCss = fs.readFileSync("components/SscCglLibraryLanding.module.css", "utf8");

test("SSC CGL is mounted as an exam overview and the legacy course URL redirects", () => {
  assert.match(examPageSource, /getSscTopics\(\)/);
  assert.match(examPageSource, /getSscQuantBookChapters\(\)/);
  assert.match(examPageSource, /<SscCglLibraryLanding/);
  assert.match(legacyCoursePageSource, /course\.code === "SSC-CGL"[\s\S]*?(?:permanentRedirect|redirect)\("\/exams\/ssc-cgl"\)/);
});

test("SSC CGL exam overview keeps all question topics and all 20 Quant chapters", () => {
  const dashboard = getSscCglDashboard();
  assert.equal(getSscTopics().length, 46);
  assert.equal(getSscQuantBookChapters().length, 20);
  assert.ok(dashboard.readiness.reviewedQuestions > 0);
  assert.ok(dashboard.readiness.fullMocks > 0);
  assert.match(landingSource, /ssc-quant-book-/);
  assert.match(landingSource, /\/exams\/ssc-cgl\/practice\//);
  assert.doesNotMatch(landingSource, /\/notes\//);
});

test("the complete SSC CGL syllabus stays compact and searchable", () => {
  assert.match(landingSource, /Search SSC CGL topics/);
  assert.match(landingSource, /<details/);
  assert.match(landingCss, /\.subjectGrid/);
  assert.match(landingCss, /\.syllabusList/);
});

test("SSC CGL exam overview keeps its main controls accessible", () => {
  assert.match(landingSource, /aria-label="Breadcrumb"/);
  assert.match(landingSource, /aria-labelledby="ssc-library-title"/);
  assert.match(landingSource, /aria-live="polite"/);
  assert.match(landingSource, /aria-label="Search SSC CGL topics"/);
});
