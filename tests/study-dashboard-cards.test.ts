import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const dashboard = fs.readFileSync("components/StudyDashboard.tsx", "utf8");
const dashboardCss = fs.readFileSync("components/StudyDashboard.module.css", "utf8");

test("homepage keeps every course in visible grouped library cards", () => {
  assert.match(dashboard, /Library spaces/);
  assert.match(dashboard, /courseGroups\.map/);
  assert.match(dashboard, /group\.courses\.map/);
  assert.match(dashboard, /studySpaceStatusOptions\.map/);
  assert.match(dashboard, /Available/);
  assert.match(dashboard, /Studying now/);
  assert.match(dashboard, /Completed/);
  assert.match(dashboardCss, /\.spaceGrid\s*\{[\s\S]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(250px,\s*1fr\)\)/);
  assert.match(dashboardCss, /\.spaceCard\s*\{/);
});

test("homepage active area is grounded in explicit status and real local activity", () => {
  assert.match(dashboard, /What you need to do/);
  assert.match(dashboard, /getCourseStatus\(course\.code\) === "active"/);
  assert.match(dashboard, /latestActivityForCourse\(memory, course\)/);
  assert.match(dashboard, /No study activity has been recorded/);
  assert.match(dashboard, /Create a study plan/);
  assert.match(dashboard, /useStudyPlanPreferences/);
  assert.doesNotMatch(dashboard, /Recent score|Weak topics|Next full mock|Your progress|Resume study/);
});

test("SSC CGL opens the exam dashboard and opening a course never changes its status", () => {
  assert.match(dashboard, /course\.code === "SSC-CGL" \? "\/exams\/ssc-cgl"/);
  assert.match(dashboard, /onClick=\{\(\) => onStatusChange\(option\.value\)\}/);
  assert.doesNotMatch(dashboard, /<Link[^>]+onClick=\{[^}]*updateCourseStatus/);
});
