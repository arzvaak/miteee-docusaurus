import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
const readerControls = fs.readFileSync("components/ReaderControls.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("note page wraps the left reader rail in a collapsible guide component", () => {
  assert.match(notePage, /ReaderGuideRail/);
  assert.match(notePage, /<ReaderGuideRail>/);
  assert.match(notePage, /<\/ReaderGuideRail>/);
});

test("reader guide collapse state is persistent and applied to the document root", () => {
  assert.match(readerControls, /miteee-reader-guide-collapsed/);
  assert.match(readerControls, /dataset\.readerGuideCollapsed/);
  assert.match(readerControls, /aria-pressed/);
  assert.match(readerControls, /reader-guide-toggle/);
  assert.ok(readerControls.includes('readerGuideCompactQuery = "(max-width: 1360px)"'));
  assert.match(readerControls, /matchMedia\(readerGuideCompactQuery\)/);
  assert.match(readerControls, /stored === "false"/);
});

test("reader guide defaults closed on medium desktop to prioritize the lesson canvas", () => {
  assert.match(readerControls, /stored === "true"/);
  assert.match(readerControls, /stored === "false"/);
  assert.match(readerControls, /return window\.matchMedia\(readerGuideCompactQuery\)\.matches/);
});

test("reader guide collapsed state widens the article column on desktop", () => {
  assert.match(css, /\[data-reader-guide-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*1fr\) minmax\(220px,\s*260px\);/s);
  assert.match(css, /@media \(max-width:\s*1500px\) and \(min-width:\s*1181px\)\s*\{[\s\S]*?\[data-reader-guide-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*1fr\);/s);
  assert.match(css, /\.reader-guide-rail\.collapsed/);
  assert.match(css, /\.reader-guide-body/);
  assert.match(css, /\.reader-guide-toggle/);
});

test("reader tools collapsed state reclaims the right rail width on desktop", () => {
  assert.match(readerControls, /readerToolsStateChangeEvent/);
  assert.match(readerControls, /applyReaderToolsState/);
  assert.match(readerControls, /dataset\.readerToolsCollapsed/);
  assert.match(readerControls, /aria-pressed=\{collapsed\}/);
  assert.match(css, /\[data-reader-tools-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*minmax\(220px,\s*260px\) minmax\(0,\s*1fr\) 56px;/s);
  assert.match(css, /\[data-reader-guide-collapsed="true"\]\[data-reader-tools-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*1fr\) 56px;/s);
  assert.match(css, /\.reader-tools-panel\.collapsed/);
});
