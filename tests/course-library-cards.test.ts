import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getAllCourses } from "../lib/content";
import { buildCourseDiscoveryGroups, filterCourseDiscoveryGroups } from "../lib/course-outline";

const page = fs.readFileSync("app/courses/page.tsx", "utf8");
const pageCss = fs.readFileSync("app/courses/CoursesPage.module.css", "utf8");
const catalog = fs.readFileSync("components/CourseCatalog.tsx", "utf8");
const catalogCss = fs.readFileSync("components/CourseCatalog.module.css", "utf8");

test("library renders every real subject as a routed card", () => {
  const courses = getAllCourses().filter((course) => !["SSC-CGL", "MITEEE", "SUPERPOWERS"].includes(course.code));

  assert.ok(courses.length >= 10);
  assert.match(page, /!\["SSC-CGL", "MITEEE", "SUPERPOWERS"\]\.includes\(course\.code\)/);
  assert.match(catalog, /group\.courses\.map\(\(course\) =>/);
  assert.match(catalog, /href=\{`\/courses\/\$\{course\.code\}`\}/);
  assert.match(catalog, /className=\{styles\.courseCard\}/);
  assert.match(catalog, /course\.noteCount/);
  assert.match(catalog, /coursePracticeTotal\(course\)/);
  assert.match(catalog, /course\.runnableNoteCount/);
  assert.doesNotMatch(catalog, /study-library-rows/);
});

test("library preserves search and discovery filters", () => {
  const courses = getAllCourses();
  const discovery = buildCourseDiscoveryGroups(courses);
  const em2 = filterCourseDiscoveryGroups(discovery.groups, "all", "Electrical Machines").flatMap((group) => group.courses);
  const semesterFive = filterCourseDiscoveryGroups(discovery.groups, "semester-5", "").flatMap((group) => group.courses);

  assert.equal(em2.some((course) => course.code === "SEM5-EM2"), true);
  assert.ok(semesterFive.length > 0);
  assert.match(catalog, /filterCourseDiscoveryGroups\(discovery\.groups, activeFilter, query\)/);
  assert.match(catalog, /aria-label="Search all collections"/);
  assert.match(catalog, /aria-label="Collection filters"/);
  assert.match(catalog, /Clear collection search/);
  assert.match(catalog, /Show every collection/);
});

test("library masthead uses real totals and full-width collection framing", () => {
  assert.match(page, /Choose a subject, then go deep\./);
  assert.match(page, /courses\.length/);
  assert.match(page, /course\.noteCount/);
  assert.doesNotMatch(page, /Study Vault|exam systems/i);
  assert.match(page, /practiceTotal/);
  assert.match(page, /runnableTotal/);
  assert.match(page, /data-shell-full-bleed="true"/);
  assert.match(pageCss, /\.page\s*\{[\s\S]*?max-width:\s*none/);
});

test("library card grid responds cleanly across themes and narrow screens", () => {
  assert.match(catalogCss, /grid-template-columns:\s*repeat\(auto-fit, minmax\(min\(100%, 290px\), 1fr\)\)/);
  assert.match(catalogCss, /var\(--surface\)/);
  assert.match(catalogCss, /var\(--text\)/);
  assert.match(catalogCss, /var\(--accent\)/);
  assert.match(catalogCss, /data-tone="blue"/);
  assert.match(catalogCss, /data-tone="emerald"/);
  assert.match(catalogCss, /data-tone="rose"/);
  assert.match(catalogCss, /data-tone="violet"/);
  assert.match(catalogCss, /data-tone="amber"/);
  assert.match(catalogCss, /:global\(:root\[data-theme="paper"\]\)/);
  assert.match(catalogCss, /:global\(:root\[data-theme="high-contrast"\]\)/);
  assert.match(catalogCss, /:global\(:root\[data-theme="high-contrast"\]\) \.courseCard:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--accent\)/s);
  assert.match(catalogCss, /@media \(max-width: 760px\)[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(pageCss, /@media \(max-width: 420px\)[\s\S]*?grid-template-columns:\s*1fr/);
});
