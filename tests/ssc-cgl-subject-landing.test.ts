import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getSscCglTopicCoverageMap, getSscTopics } from "../lib/ssc-cgl";
import { getSscQuantBookChapters } from "../lib/ssc-quant-book";
import { sscCglSubjectDefinitions, sscCglSubjectHref } from "../lib/ssc-cgl-subjects";

const librarySource = fs.readFileSync("components/SscCglLibraryLanding.tsx", "utf8");
const routeSource = fs.readFileSync("app/exams/ssc-cgl/subjects/[section]/page.tsx", "utf8");
const questionLandingSource = fs.readFileSync("components/SscCglQuestionSubjectLanding.tsx", "utf8");
const questionLandingCss = fs.readFileSync("components/SscCglQuestionSubjectLanding.module.css", "utf8");
const sitemapSource = fs.readFileSync("app/sitemap.ts", "utf8");

test("SSC CGL subject definitions expose four canonical exam-subject routes", () => {
  assert.deepEqual(sscCglSubjectDefinitions.map((subject) => subject.section), ["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"]);
  assert.ok(sscCglSubjectDefinitions.every((subject) => sscCglSubjectHref(subject.section).startsWith("/exams/ssc-cgl/subjects/")));
  assert.match(sitemapSource, /getSscQuantBookChapters/);
});

test("non-Quant SSC subjects are question-only and preserve every topic bank", () => {
  const coverage = getSscCglTopicCoverageMap();
  for (const subject of sscCglSubjectDefinitions.filter((item) => item.section !== "quantitative-aptitude")) {
    const topics = getSscTopics().filter((topic) => topic.section === subject.section);
    const section = coverage.sections.find((item) => item.section === subject.section);
    assert.ok(topics.length > 0);
    assert.ok(section && section.reviewedQuestions > 0 && section.bookBackedQuestions > 0);
    assert.ok(section.rows.every((row) => row.href === `/exams/ssc-cgl/practice/${row.slug}`));
  }
  assert.match(questionLandingSource, /old study notes have been retired/i);
  assert.match(questionLandingSource, /\/exams\/ssc-cgl\/practice\//);
});

test("Quant subject route renders the separate 20-chapter source course", () => {
  assert.equal(getSscQuantBookChapters().length, 20);
  assert.match(routeSource, /subject\.section === "quantitative-aptitude"/);
  assert.match(routeSource, /<SscQuantBookDirectory/);
  assert.match(routeSource, /<SscCglQuestionSubjectLanding/);
  assert.match(routeSource, /getSscCglPracticeTopics\(\)/);
});

test("exam overview and question subject navigation remain accessible", () => {
  assert.match(librarySource, /sscCglSubjectHref/);
  assert.match(questionLandingSource, /aria-label="Breadcrumb"/);
  assert.match(questionLandingSource, /aria-labelledby="question-topics-title"/);
  assert.match(questionLandingCss, /@media \(max-width:/);
});
