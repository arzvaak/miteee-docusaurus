import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync("app/study-minimal.css", "utf8");
const diagramCss = fs.readFileSync("components/MermaidDiagram.module.css", "utf8");
const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");

test("reader uses a stable wide article canvas and one focused navigation rail", () => {
  assert.match(css, /--content-max:\s*1688px;/);
  assert.match(css, /--reader-canvas-width:\s*1120px;/);
  assert.match(css, /\.reader-layout\s*\{[^}]*--reader-prose-width:\s*74ch;/s);
  assert.match(css, /grid-template-columns:\s*minmax\(220px, 260px\) minmax\(0, var\(--reader-canvas-width\)\) minmax\(220px, 260px\);/);
  assert.match(css, /\.reader-layout > \.article\s*\{[^}]*grid-column:\s*2;/s);
  assert.match(css, /\.article \.markdown-body :where\(p, ul, ol, blockquote\)\s*\{[^}]*max-width:\s*var\(--reader-prose-width\);/s);
  assert.match(css, /\.article \.markdown-body :where\(table, \.katex-display, \.code-block-shell, \.mermaid-shell\)\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*var\(--reader-canvas-width\);/s);
});

test("reader rails reclaim compact desktop space without narrowing the article", () => {
  assert.match(css, /\[data-reader-guide-collapsed="true"\]\[data-reader-tools-collapsed="true"\] \.reader-layout\s*\{[^}]*grid-template-columns:\s*48px minmax\(0, var\(--reader-canvas-width\)\) 56px;/s);
  assert.match(css, /@media \(min-width:\s*1181px\) and \(max-width:\s*1560px\)[\s\S]*?\.reader-tools-panel:not\(\.left\):not\(\.collapsed\)\s*\{[^}]*position:\s*fixed;/s);
});

test("research prose and evidence share one left edge", () => {
  assert.match(css, /\.research-note-page,[\s\S]*?--research-wide:\s*980px;[^}]*--research-prose:\s*720px;/s);
  assert.match(css, /\.research-note-article\.article \.markdown-body > :where\(p, ul, ol, blockquote, h2, h3, h4, hr\)\s*\{[^}]*max-width:\s*var\(--research-prose\);[^}]*margin-left:\s*0;/s);
  assert.match(css, /\.research-note-article \.markdown-body > :where\(table,[\s\S]*?max-width:\s*var\(--research-wide\);[^}]*margin-left:\s*0;/s);
  assert.match(css, /\.research-note-article \.markdown-body > p:has\(> img\)[\s\S]*?max-width:\s*var\(--research-wide\);/s);
});

test("wide inline diagrams stay within a scrollable full-width canvas", () => {
  assert.match(diagramCss, /\.inlineViewport\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;[^}]*overflow:\s*auto;/s);
  assert.match(diagramCss, /\.inlineSvg :global\(svg\)\s*\{[^}]*width:\s*100% !important;[^}]*max-width:\s*none !important;/s);
  assert.match(diagramCss, /\.stage\s*\{[^}]*overflow:\s*hidden;/s);
});

test("note page keeps dense question banks discoverable without crowding the reading rail", () => {
  assert.match(notePage, /buildHeadingAnchors\(note\.headings, 48\)/);
  assert.match(notePage, /buildQuestionAnchors\(note\.headings, 400\)/);
  assert.ok(notePage.indexOf("<ReaderQuestionNavigator") < notePage.indexOf("<ReaderCourseNavigator"));
  assert.ok(notePage.indexOf("<ReaderOutlineNav") < notePage.indexOf("<ReaderCourseNavigator"));
  assert.ok(notePage.indexOf("<ReaderToolsPanel>") < notePage.indexOf("<ReaderProgressPanel"));
});
