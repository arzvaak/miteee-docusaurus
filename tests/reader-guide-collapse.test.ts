import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
const readerControls = fs.readFileSync("components/ReaderControls.tsx", "utf8");
const readerCss = fs.readFileSync("app/study-minimal.css", "utf8");

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

test("reader guide defaults closed so the lesson canvas remains primary", () => {
  assert.match(readerControls, /stored === "true"/);
  assert.match(readerControls, /stored === "false"/);
  assert.match(readerControls, /function readReaderGuideSnapshot\(\)[\s\S]*?return true;/);
});

test("reader guide collapsed state widens the article column on desktop", () => {
  assert.match(readerCss, /\[data-reader-guide-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*var\(--reader-canvas-width\)\) minmax\(220px,\s*260px\);/s);
  assert.match(readerCss, /@media \(min-width:\s*1181px\) and \(max-width:\s*1560px\)\s*\{[\s\S]*?grid-template-columns:\s*56px minmax\(0,\s*var\(--reader-canvas-width\)\) 56px;/s);
  assert.match(readerCss, /\.reader-guide-rail\.collapsed/);
  assert.match(readerCss, /\.reader-guide-body/);
  assert.match(readerCss, /\.reader-guide-toggle/);
});

test("reader tools collapsed state reclaims the right rail width on desktop", () => {
  assert.match(readerControls, /readerToolsStateChangeEvent/);
  assert.match(readerControls, /applyReaderToolsState/);
  assert.match(readerControls, /dataset\.readerToolsCollapsed/);
  assert.match(readerControls, /aria-pressed=\{collapsed\}/);
  assert.match(readerCss, /\[data-reader-tools-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*minmax\(220px,\s*260px\) minmax\(0,\s*var\(--reader-canvas-width\)\) 56px;/s);
  assert.match(readerCss, /\[data-reader-guide-collapsed="true"\]\[data-reader-tools-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*var\(--reader-canvas-width\)\) 56px;/s);
  assert.match(readerCss, /\.reader-tools-panel\.collapsed/);
});
