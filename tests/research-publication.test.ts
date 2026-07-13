import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const reportPath = path.join("docs", "research", "valorant-preliminary-findings", "index.md");
const routePath = path.join("app", "research", "valorant-preliminary-findings", "page.tsx");
const dashboardPath = path.join("components", "StudyDashboard.tsx");

test("VALORANT report is published as a clearly preliminary research page", () => {
  const report = fs.readFileSync(reportPath, "utf8");
  const route = fs.readFileSync(routePath, "utf8");
  const dashboard = fs.readFileSync(dashboardPath, "utf8");

  assert.match(route, /Undergraduate research · Work in progress/);
  assert.match(route, /test the final version on a future tournament/);
  assert.match(route, /research-valorant-preliminary-findings-index/);
  assert.match(dashboard, /href="\/research\/valorant-preliminary-findings"/);
  assert.match(dashboard, /Can agent composition predict a professional VALORANT map\?/);
  assert.doesNotMatch(report, /\[Student ID\]|\[Professor's name\]|\[Programme and Department\]|\[Name\]/);
  assert.match(report, /I wanted to see how much that actually helps/);
  assert.match(report, /## Technical note/);
  assert.doesNotMatch(report, /## 1[0-5]\.|## Appendix A\./);
  assert.ok(report.trim().split(/\s+/).length < 4_000, "the public progress report should stay selective rather than reading like an audit log");
});

test("VALORANT report ships every referenced figure inside the site", () => {
  const report = fs.readFileSync(reportPath, "utf8");
  const figureNames = Array.from(report.matchAll(/!\[[^\]]*\]\(\.\/assets\/([^)]+)\)/g), (match) => match[1]);

  assert.equal(figureNames.length, 7);
  for (const figureName of figureNames) {
    const figurePath = path.join("docs", "research", "valorant-preliminary-findings", "assets", figureName);
    assert.equal(fs.existsSync(figurePath), true, `${figureName} should exist`);
    assert.ok(fs.statSync(figurePath).size > 0, `${figureName} should not be empty`);
  }
});
