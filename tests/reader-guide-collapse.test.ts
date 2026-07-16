import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
const readerControls = fs.readFileSync("components/ReaderControls.tsx", "utf8");
const readerPreferences = fs.readFileSync("lib/reader-layout-preferences.ts", "utf8");
const readerSettings = fs.readFileSync("components/ReaderLayoutSettings.tsx", "utf8");
const readerCss = fs.readFileSync("app/study-minimal.css", "utf8");

test("note page wraps the left reader rail in a collapsible guide component", () => {
  assert.match(notePage, /ReaderGuideRail/);
  assert.match(notePage, /<ReaderGuideRail>/);
  assert.match(notePage, /<\/ReaderGuideRail>/);
});

test("reader guide collapse state is persistent and applied to the document root", () => {
  assert.match(readerPreferences, /miteee-reader-guide-collapsed/);
  assert.match(readerControls, /dataset\.readerGuideCollapsed/);
  assert.match(readerControls, /aria-pressed/);
  assert.match(readerControls, /reader-guide-toggle/);
  assert.match(readerControls, /stored === "false"/);
});

test("reader guide and tools default open", () => {
  assert.match(readerControls, /stored === "true"/);
  assert.match(readerControls, /stored === "false"/);
  assert.match(readerControls, /function readReaderGuideSnapshot\(\)[\s\S]*?return false;/);
  assert.match(readerControls, /function readReaderToolsSnapshot\(\)[\s\S]*?return false;/);
  assert.match(readerPreferences, /guideVisible:\s*true/);
  assert.match(readerPreferences, /toolsVisible:\s*true/);
});

test("settings expose every persistent reader panel combination", () => {
  assert.match(readerSettings, /Guide and tools/);
  assert.match(readerSettings, /Guide only/);
  assert.match(readerSettings, /Tools only/);
  assert.match(readerSettings, /Hide both/);
  assert.match(readerSettings, /saveReaderLayoutPreference/);
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

test("desktop reader guide and collapsed tools follow the viewport while reading", () => {
  assert.match(
    readerCss,
    /@media \(min-width:\s*1181px\)\s*\{[\s\S]*?\.reader-layout > \.reader-guide-rail,[\s\S]*?\.reader-layout > \.reader-tools-panel\.collapsed\s*\{[^}]*position:\s*sticky;[^}]*top:\s*max\(82px, calc\(var\(--topbar-height, 0px\) \+ 12px\)\);[^}]*align-self:\s*start;[^}]*height:\s*max-content;[^}]*overflow:\s*visible;/s
  );
});
