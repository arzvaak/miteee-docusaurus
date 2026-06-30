import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync("app/globals.css", "utf8");
const readerControlsSource = fs.readFileSync("components/ReaderControls.tsx", "utf8");

function ruleBodies(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Array.from(css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gm"))).map((match) => match[1] ?? "");
}

function hasRule(selector: string, pattern: RegExp) {
  return ruleBodies(selector).some((body) => pattern.test(body));
}

function baseRuleBody(selector: string) {
  return ruleBodies(selector)[0] ?? "";
}

test("mobile note reader keeps recall and practice controls before the article", () => {
  assert.equal(hasRule(".reader-layout .reader-rail:not(.left)", /order:\s*2;/), true);
  assert.equal(hasRule(".reader-layout .article", /order:\s*3;/), true);
});

test("mobile note reader signal stats stay compact", () => {
  assert.equal(hasRule(".reader-signal-grid", /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/), true);
  assert.equal(hasRule(".reader-signal-grid .signal-card", /min-height:\s*68px;/), true);
});

test("mobile reader keeps navigation reachable without desktop shortcut overlap", () => {
  assert.equal(hasRule(".bottom-nav", /position:\s*fixed;/), true);
  assert.equal(hasRule(".bottom-nav", /inset:\s*auto 10px 10px;/), true);
  assert.equal(hasRule(".main-content", /padding:\s*14px 12px 92px;/), true);
  assert.equal(hasRule(".keyboard-shortcut-hint", /display:\s*none;/), true);
  assert.equal(hasRule(".course-map-jump", /flex-wrap:\s*wrap;/), true);
  assert.equal(hasRule(".course-map-jump", /overflow-x:\s*visible;/), true);
  assert.equal(hasRule(".course-map-jump button", /white-space:\s*normal;/), true);
});

test("lesson sequence destination titles wrap instead of truncating", () => {
  assert.equal(hasRule(".lesson-step small", /white-space:\s*nowrap;/), true);
  assert.equal(hasRule(".lesson-step small", /text-overflow:\s*ellipsis;/), true);
  assert.equal(hasRule(".lesson-step strong", /white-space:\s*normal;/), true);
  assert.equal(hasRule(".lesson-step strong", /overflow-wrap:\s*anywhere;/), true);
  assert.equal(hasRule(".lesson-step strong", /text-overflow:\s*clip;/), true);
});

test("mobile shell clips page-level horizontal overflow", () => {
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?html,\s*body\s*\{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*clip;/s);
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?\.app-shell\s*\{[^}]*max-width:\s*100vw;[^}]*overflow-x:\s*clip;/s);
});

test("desktop note reader keeps a wide content canvas", () => {
  assert.match(css, /--content-max:\s*1720px;/);
  assert.equal(hasRule(".reader-layout", /grid-template-columns:\s*minmax\(220px,\s*260px\)\s+minmax\(0,\s*1fr\)\s+minmax\(220px,\s*260px\);/), true);
  assert.equal(hasRule(".article :where(p, ul, ol, blockquote)", /max-width:\s*1060px;/), true);
  assert.equal(hasRule(".article :where(table, .katex-display, .code-block-shell, .mermaid-shell, img)", /max-width:\s*100%;/), true);
});

test("desktop course map jump buttons wrap inside the reader rail", () => {
  assert.match(baseRuleBody(".course-map-jump"), /flex-wrap:\s*wrap;/);
  assert.match(baseRuleBody(".course-map-jump"), /overflow-x:\s*visible;/);
  assert.match(baseRuleBody(".course-map-jump button"), /flex:\s*1 1 min\(120px,\s*100%\);/);
  assert.match(baseRuleBody(".course-map-jump button"), /white-space:\s*normal;/);
  assert.match(baseRuleBody(".course-map-jump button"), /overflow-wrap:\s*anywhere;/);
});

test("reader outline links wrap long headings instead of clipping navigation labels", () => {
  const outlineLink = baseRuleBody(".reader-outline-link");
  assert.doesNotMatch(outlineLink, /overflow:\s*hidden;/);
  assert.match(outlineLink, /overflow-wrap:\s*anywhere;/);
  assert.match(outlineLink, /text-overflow:\s*clip;/);
  assert.match(outlineLink, /white-space:\s*normal;/);
});

test("reader course navigator labels wrap instead of clipping long lesson names", () => {
  const groupLabel = baseRuleBody(".course-navigator-group-toggle span");
  const lessonLabel = baseRuleBody(".course-navigator-link span");

  for (const body of [groupLabel, lessonLabel]) {
    assert.doesNotMatch(body, /overflow:\s*hidden;/);
    assert.doesNotMatch(body, /text-overflow:\s*ellipsis;/);
    assert.doesNotMatch(body, /white-space:\s*nowrap;/);
    assert.match(body, /overflow-wrap:\s*anywhere;/);
    assert.match(body, /text-overflow:\s*clip;/);
    assert.match(body, /white-space:\s*normal;/);
  }
});

test("collapsed reader tools width reclaim is limited to desktop layouts", () => {
  assert.match(css, /@media \(min-width:\s*1181px\)\s*\{[\s\S]*?\[data-reader-tools-collapsed="true"\]\s+\.reader-layout\s*\{[^}]*grid-template-columns:\s*minmax\(220px,\s*260px\) minmax\(0,\s*1fr\) 56px;/s);
});

test("mobile collapsed reader controls keep text labels visible", () => {
  const beforeDesktopReaderMedia = css.slice(0, css.indexOf("@media (min-width: 1181px)"));
  assert.match(css, /@media \(min-width:\s*1181px\)\s*\{[\s\S]*?\.reader-guide-rail\.collapsed \.reader-guide-toggle span,[\s\S]*?\.reader-tools-panel\.collapsed \.reader-tools-toggle span[\s\S]*?display:\s*none;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-rail\.collapsed \.reader-guide-toggle,[\s\S]*?\.reader-tools-panel\.collapsed \.reader-tools-toggle\s*\{[^}]*width:\s*auto;[^}]*min-width:\s*84px;/s);
  assert.doesNotMatch(beforeDesktopReaderMedia, /\.reader-guide-rail\.collapsed \.reader-guide-toggle span/);
  assert.doesNotMatch(beforeDesktopReaderMedia, /\.reader-tools-panel\.collapsed \.reader-tools-toggle span/);
});

test("collapsed reader guide advertises the course map on compact screens", () => {
  assert.match(readerControlsSource, /aria-label=\{collapsed \? "Show course map and reader guide" : "Hide reader guide"\}/);
  assert.match(readerControlsSource, /title=\{collapsed \? "Show course map and reader guide" : "Hide reader guide"\}/);
  assert.match(readerControlsSource, /<span>\{collapsed \? "Map" : "Hide guide"\}<\/span>/);
});

test("mobile reader guide and tools controls share one compact row", () => {
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-layout\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-layout \.reader-rail\.left\s*\{[^}]*grid-column:\s*1;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-layout \.reader-rail:not\(\.left\)\s*\{[^}]*grid-column:\s*2;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-layout \.article\s*\{[^}]*grid-column:\s*1 \/ -1;/s);
});

test("mobile expanded reader guide stays scroll bounded before the article", () => {
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-body\s*\{[^}]*max-height:\s*min\(46vh,\s*360px\);/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-body\s*\{[^}]*overflow-y:\s*auto;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-body\s*\{[^}]*overscroll-behavior:\s*contain;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-body\s*\{[^}]*justify-self:\s*start;/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.reader-guide-body\s*\{[^}]*width:\s*calc\(100vw - 24px\);/s);
});

test("reader sidebars persist collapsed panel state", () => {
  assert.match(readerControlsSource, /miteee-reader-tools-collapsed/);
  assert.match(readerControlsSource, /readReaderToolsSnapshot/);
  assert.match(readerControlsSource, /useSyncExternalStore\(subscribeReaderToolsState,\s*readReaderToolsSnapshot/);
  assert.match(readerControlsSource, /window\.localStorage\.setItem\(readerToolsStorageKey,\s*String\(next\)\)/);
  assert.match(readerControlsSource, /miteee-reader-course-map-collapsed/);
  assert.match(readerControlsSource, /window\.localStorage\.setItem\(readerCourseMapStorageKey,\s*String\(!next\)\)/);
});

test("course navigator group toggles expose the actual collapsed list state", () => {
  assert.match(readerControlsSource, /const listId = `reader-course-group-\$\{group\.key\.replace/);
  assert.match(readerControlsSource, /aria-controls=\{listId\}/);
  assert.match(readerControlsSource, /aria-expanded=\{!collapsed\}/);
  assert.match(readerControlsSource, /id=\{listId\}/);
});

test("course navigator supports honest bulk section expand and collapse controls", () => {
  assert.match(readerControlsSource, /function collapseOtherCourseGroups\(\)/);
  assert.match(readerControlsSource, /function expandAllCourseGroups\(\)/);
  assert.match(readerControlsSource, /className="course-map-bulk-actions"/);
  assert.match(readerControlsSource, /aria-label="Collapse other course sections"/);
  assert.match(readerControlsSource, /<span>Collapse others<\/span>/);
  assert.match(readerControlsSource, /aria-label="Expand all course sections"/);
  assert.match(readerControlsSource, /writeCollapsedCourseGroupKeys\(new Set\(collapsibleCourseGroupKeys\)\)/);
  assert.match(css, /\.course-map-bulk-actions/);
  assert.match(css, /\.course-map-bulk-actions button/);
});

test("note previews remain visible on keyboard focus", () => {
  assert.match(css, /\.preview-link-wrap:hover \.hover-preview,/);
  assert.match(css, /\.preview-link-wrap:focus-within \.hover-preview,/);
  assert.equal(hasRule('.preview-link-wrap[data-preview-open="true"] .hover-preview', /display:\s*grid;/), true);
  assert.equal(hasRule(".article", /overflow:\s*visible;/), true);
});

test("mobile note previews stay contained within the viewport", () => {
  assert.match(css, /@media \(max-width:\s*820px\),\s*\(hover:\s*none\)\s*\{[\s\S]*?\.hover-preview\s*\{[^}]*position:\s*fixed;[^}]*left:\s*12px;[^}]*right:\s*12px;[^}]*width:\s*auto;[^}]*max-width:\s*calc\(100vw - 24px\);[^}]*max-height:\s*min\(420px,\s*calc\(100vh - 36px\)\);[^}]*overflow-y:\s*auto;/s);
});
