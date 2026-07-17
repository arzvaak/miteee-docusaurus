import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getCourseNavigationGroups } from "../lib/content";
import { getSscCglTopicCoverageMap, getSscTopics } from "../lib/ssc-cgl";
import {
  sscCglSubjectDefinitions,
  sscCglSubjectHref,
  sscCglTopicSlugFromNote
} from "../lib/ssc-cgl-subjects";

const librarySource = fs.readFileSync("components/SscCglLibraryLanding.tsx", "utf8");
const subjectCardSource = librarySource.slice(librarySource.indexOf("function SubjectCard"));
const routePath = "app/exams/ssc-cgl/subjects/[section]/page.tsx";
const routeSource = fs.existsSync(routePath) ? fs.readFileSync(routePath, "utf8") : "";
const subjectLandingSource = fs.readFileSync("components/SscCglSubjectLanding.tsx", "utf8");
const subjectLandingCss = fs.readFileSync("components/SscCglSubjectLanding.module.css", "utf8");
const sitemapSource = fs.readFileSync("app/sitemap.ts", "utf8");

test("SSC CGL subject definitions expose four canonical exam-subject routes", () => {
  assert.deepEqual(
    sscCglSubjectDefinitions.map((subject) => subject.section),
    ["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"]
  );
  assert.deepEqual(
    sscCglSubjectDefinitions.map((subject) => sscCglSubjectHref(subject.section)),
    [
      "/exams/ssc-cgl/subjects/reasoning",
      "/exams/ssc-cgl/subjects/general-awareness",
      "/exams/ssc-cgl/subjects/quantitative-aptitude",
      "/exams/ssc-cgl/subjects/english-comprehension"
    ]
  );
  assert.match(sitemapSource, /sscCglSubjectDefinitions\.map/);
  assert.match(sitemapSource, /sscCglSubjectHref\(subject\.section\)/);
});

test("every canonical SSC CGL topic has a study source inside its exam subject", () => {
  const groups = getCourseNavigationGroups("SSC-CGL");
  const topics = getSscTopics();
  const coverage = getSscCglTopicCoverageMap();

  for (const subject of sscCglSubjectDefinitions) {
    const group = groups.find((item) => item.key === subject.groupKey);
    const subjectTopics = topics.filter((topic) => topic.section === subject.section);
    const coverageSection = coverage.sections.find((item) => item.section === subject.section);
    assert.ok(group, subject.shortTitle + " navigation group should exist");
    assert.ok(coverageSection, subject.shortTitle + " coverage should exist");
    assert.ok(subjectTopics.length > 0, subject.shortTitle + " should have canonical topics");
    assert.ok(coverageSection.reviewedQuestions > 0);
    assert.ok(coverageSection.bookBackedQuestions > 0);

    const noteTopicSlugs = new Set(group.notes.map((note) => sscCglTopicSlugFromNote(subject, note.slug)));
    for (const topic of subjectTopics) {
      assert.equal(
        noteTopicSlugs.has(topic.slug),
        true,
        subject.shortTitle + ": " + topic.slug + " should have a Markdown study source"
      );
    }
  }
});

test("exam overview subject cards open canonical subject homes", () => {
  assert.match(librarySource, /sscCglSubjectDefinitions/);
  assert.match(librarySource, /sscCglSubjectHref/);
  assert.match(librarySource, /definition\.cardDescription/);
  assert.match(subjectCardSource, /const subjectHref = sscCglSubjectHref\(subject\.definition\.section\)/);
  assert.match(subjectCardSource, /className=\{styles\.subjectMainLink\} href=\{subjectHref\}/);
  assert.match(subjectCardSource, /className=\{styles\.openSubject\} href=\{subjectHref\}>Open subject/);
  assert.doesNotMatch(subjectCardSource, /firstNote/);
  assert.doesNotMatch(subjectCardSource, /\/courses\/SSC-CGL/);
});

test("canonical SSC CGL subject route joins study topics and practice", () => {
  assert.ok(fs.existsSync(routePath), routePath + " should exist");
  assert.match(routeSource, /generateStaticParams/);
  assert.match(routeSource, /sscCglSubjectDefinitions/);
  assert.match(routeSource, /getCourseNavigationGroups\("SSC-CGL"\)/);
  assert.match(routeSource, /getSscCglTopicCoverageMap\(\)/);
  assert.match(routeSource, /getSscCglPracticeTopics\(\)/);
  assert.match(routeSource, /getSscTopics\(\)/);
  assert.match(routeSource, /stage: "guide"/);
  assert.match(routeSource, /\/exams\/ssc-cgl\/topics\//);
  assert.match(routeSource, /practiceHref: practice\?\.href/);
  assert.match(routeSource, /drillHref: row\?\.drillHref/);
  assert.match(routeSource, /<SscCglSubjectLanding/);
});

test("subject landing exposes a staged topic TOC and canonical exam breadcrumbs", () => {
  assert.match(subjectLandingSource, /<Link href="\/exams">Exams<\/Link>/);
  assert.match(subjectLandingSource, /<Link href="\/exams\/ssc-cgl">SSC CGL<\/Link>/);
  assert.match(subjectLandingSource, /Complete table of contents/);
  assert.match(subjectLandingSource, /Choose exactly what to study next/);
  assert.match(subjectLandingSource, /id: "guide"/);
  assert.match(subjectLandingSource, /id: "foundation"/);
  assert.match(subjectLandingSource, /id: "high-yield"/);
  assert.match(subjectLandingSource, /id: "speed"/);
  assert.match(subjectLandingSource, /id: "revision"/);
  assert.match(subjectLandingSource, /readerProgressStorageKey/);
  assert.match(subjectLandingSource, /parseReaderProgressStore/);
  assert.match(subjectLandingSource, /Search .* topics and headings/);
  assert.match(subjectLandingSource, /Filter by reading status/);
  assert.match(subjectLandingSource, /Not started/);
  assert.match(subjectLandingSource, /In progress/);
  assert.match(subjectLandingSource, /Completed/);
  assert.match(subjectLandingSource, /subject\.cockpitHref/);
  assert.match(subjectLandingSource, /note\.studyHref/);
  assert.match(subjectLandingSource, /note\.practiceHref/);
  assert.match(subjectLandingSource, /note\.drillHref/);
  assert.doesNotMatch(subjectLandingSource, /\/courses\/SSC-CGL/);
});

test("subject topic TOC remains readable across themes and narrow screens", () => {
  assert.match(subjectLandingCss, /\.topicGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(subjectLandingCss, /var\(--subject-accent\)/);
  assert.match(subjectLandingCss, /var\(--surface\)/);
  assert.match(subjectLandingCss, /:global\(:root\[data-theme="high-contrast"\]\)/);
  assert.match(subjectLandingCss, /@media \(max-width: 860px\)[\s\S]*?\.topicGrid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(subjectLandingCss, /@media \(max-width: 620px\)/);
});
