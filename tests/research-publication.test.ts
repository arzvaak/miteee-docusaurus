import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const reportPath = path.join("docs", "research", "valorant-preliminary-findings", "index.md");
const routePath = path.join("app", "research", "valorant-preliminary-findings", "page.tsx");
const dashboardPath = path.join("components", "StudyDashboard.tsx");
const notePagePath = path.join("components", "ResearchNote.tsx");
const collectionPath = path.join("components", "ResearchCollection.tsx");
const contentBuilderPath = path.join("scripts", "build-content-data.ts");

test("VALORANT report is published as a clearly preliminary research page", () => {
  const report = fs.readFileSync(reportPath, "utf8");
  const route = fs.readFileSync(routePath, "utf8");
  const dashboard = fs.readFileSync(dashboardPath, "utf8");
  const notePage = fs.readFileSync(notePagePath, "utf8");
  const collection = fs.readFileSync(collectionPath, "utf8");
  const contentBuilder = fs.readFileSync(contentBuilderPath, "utf8");

  assert.match(route, /permanentRedirect\(`\/notes\/\$\{reportSlug\}`\)/);
  assert.match(notePage, /working note, not a final result/i);
  assert.match(notePage, /future untouched tournament/);
  assert.match(route, /research-valorant-preliminary-findings-index/);
  assert.match(dashboard, /href="\/notes\/research-valorant-preliminary-findings-index"/);
  assert.match(dashboard, /Can agent composition predict a professional VALORANT map\?/);
  assert.match(contentBuilder, /"RESEARCH": "Research notes"/);
  assert.match(contentBuilder, /if \(code === "RESEARCH"\) return "research"/);
  assert.match(collection, /This collection grows without pretending each note is a separate subject/);
  assert.match(report, /content_type: research_note/);
  assert.doesNotMatch(report, /\[Student ID\]|\[Professor's name\]|\[Programme and Department\]|\[Name\]/);
  assert.match(report, /I wanted to see how much that actually helps/);
  assert.match(report, /## Technical note/);
  assert.doesNotMatch(report, /## 1[0-5]\.|## Appendix A\./);
  assert.ok(report.trim().split(/\s+/).length < 4_000, "the public progress report should stay selective rather than reading like an audit log");
});

test("research note uses one editorial alignment system for prose and evidence", () => {
  const css = fs.readFileSync(path.join("app", "study-minimal.css"), "utf8");

  assert.match(css, /\.research-note-article\.article \.markdown-body > :where\(p, ul, ol, blockquote, h2, h3, h4, hr\)\s*\{[^}]*margin-left:\s*0;/s);
  assert.match(css, /\.research-note-article \.markdown-body > :where\(table,[\s\S]*?max-width:\s*var\(--research-wide\);/s);
  assert.match(css, /\.research-note-article \.markdown-body > p:has\(> img\)[\s\S]*?margin-left:\s*0;/s);
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
