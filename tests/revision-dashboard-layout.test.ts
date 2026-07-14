import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const dashboardSource = fs.readFileSync("components/RevisionDashboard.tsx", "utf8");
const dashboardCss = fs.readFileSync("components/RevisionDashboard.module.css", "utf8");

test("the recommended revision action follows its title before supporting detail", () => {
  const titleIndex = dashboardSource.indexOf("<h2>{primaryTopic");
  const actionIndex = dashboardSource.indexOf("<Link className={styles.primaryAction}");
  const rationaleIndex = dashboardSource.indexOf("<p>{primaryTopic");

  assert.ok(titleIndex >= 0);
  assert.ok(titleIndex < actionIndex);
  assert.ok(actionIndex < rationaleIndex);
});

test("short desktop viewports retain comfortable spacing while keeping the action above the fold", () => {
  assert.match(dashboardCss, /@media \(min-width: 761px\) and \(max-height: 780px\)/);
  assert.match(dashboardCss, /padding-top:\s*clamp\(22px, 4vh, 34px\)/);
  assert.match(dashboardCss, /\.masthead\s*\{[^}]*padding-bottom:\s*26px/s);
  assert.match(dashboardCss, /\.primaryAction\s*\{[^}]*min-height:\s*44px/s);
});

test("revision surfaces and accents remain theme-token driven", () => {
  assert.doesNotMatch(dashboardCss, /#[0-9a-f]{3,8}|rgba?\(|hsla?\(/i);
  assert.doesNotMatch(dashboardCss, /!important/);
  for (const token of ["--bg", "--surface", "--text", "--text-soft", "--muted", "--border", "--accent"]) {
    assert.match(dashboardCss, new RegExp(`var\\(${token}\\)`));
  }
  assert.match(dashboardCss, /\.primaryAction\s*\{[^}]*color:\s*var\(--bg\)[^}]*background:\s*var\(--accent\)/s);
});

test("revision dashboard retains explicit tablet and mobile layouts", () => {
  assert.match(dashboardCss, /@media \(max-width: 1120px\)/);
  assert.match(dashboardCss, /@media \(max-width: 760px\)/);
  assert.match(dashboardCss, /@media \(max-width: 430px\)/);
  assert.match(dashboardCss, /@media \(max-width: 430px\)[\s\S]*?\.primaryAction\s*\{[^}]*width:\s*100%/);
  assert.match(dashboardCss, /@media \(max-width: 760px\)[\s\S]*?\.subjectGrid,[\s\S]*?grid-template-columns:\s*1fr/);
});
