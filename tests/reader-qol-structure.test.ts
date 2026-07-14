import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const notePage = fs.readFileSync("app/notes/[slug]/page.tsx", "utf8");
const markdownNote = fs.readFileSync("components/MarkdownNote.tsx", "utf8");
const readerControls = fs.readFileSync("components/ReaderControls.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("note page wires the interactive reader controls", () => {
  assert.match(notePage, /ReaderCourseNavigator/);
  assert.match(notePage, /ReaderQuestionNavigator/);
  assert.match(notePage, /ReaderOutlineNav/);
  assert.match(notePage, /ReaderToolsPanel/);
  assert.match(notePage, /ReaderKeyboardShortcuts/);
  assert.match(notePage, /ContinueReadingStrip/);
  assert.match(notePage, /RelatedLessonsSection/);
  assert.match(notePage, /ReaderBreadcrumbs/);
  assert.match(notePage, /buildQuestionAnchors/);
});

test("note page enables automatic technical reading mode", () => {
  assert.match(notePage, /technical-article/);
  assert.match(notePage, /isTechnicalNote/);
});

test("reader CSS supports collapsible maps, active outline, progress states, and shortcuts", () => {
  assert.match(css, /\.course-map-shell/);
  assert.match(css, /\.course-map-jump/);
  assert.match(css, /\.course-map-search/);
  assert.match(css, /max-height:\s*calc\(100vh - 100px\);/);
  assert.match(css, /\.reader-question-navigator/);
  assert.match(css, /\.reader-question-search/);
  assert.match(css, /\.question-jump-link\.active/);
  assert.match(css, /\.reader-outline-link\.active/);
  assert.match(css, /\.course-navigator-link\.read/);
  assert.match(css, /\.course-navigator-link\.in-progress/);
  assert.match(css, /\.reader-tools-panel\.collapsed/);
  assert.match(css, /\.keyboard-shortcut-hint/);
  assert.match(css, /\.continue-strip/);
  assert.match(css, /\.related-lessons-section/);
  assert.match(css, /\.related-lesson-grid/);
  assert.match(css, /\.related-lesson-link/);
  assert.match(css, /\.reader-breadcrumbs/);
  assert.match(css, /\.technical-article/);
  assert.match(css, /:root\[data-theme="high-contrast"\] \.note-page :where\(a, button, input, select, textarea, summary\):focus-visible\s*\{[^}]*outline:\s*3px solid var\(--accent\) !important;/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?scroll-behavior:\s*auto;/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.related-lesson-link:hover\s*\{[^}]*transform:\s*none;/s);
  assert.match(css, /\.article \.markdown-body a,/);
  assert.doesNotMatch(css, /(?:^|\n)\.article a,/);
});

test("note reader keeps related lessons available after the main reading flow", () => {
  assert.match(notePage, /<RelatedLessonsSection previews=\{related\} \/>/);
  assert.match(notePage, /function RelatedLessonsSection\(\{ previews \}: \{ previews: NotePreview\[\] \}\)/);
  assert.match(notePage, /if \(previews\.length === 0\) return null/);
  assert.match(notePage, /className="related-lessons-section"/);
  assert.match(notePage, /aria-label="Related lessons"/);
  assert.match(notePage, /previews\.slice\(0,\s*3\)\.map/);
  assert.match(notePage, /className="related-lesson-link"/);
  assert.match(notePage, /aria-label=\{`Open related lesson: \$\{preview\.label\}`\}/);
  assert.match(css, /\.related-lesson-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/s);
  assert.match(css, /@media \(max-width:\s*1180px\)\s*\{[\s\S]*?\.related-lesson-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
  assert.match(css, /@media \(max-width:\s*820px\)\s*\{[\s\S]*?\.related-lesson-grid\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(markdownNote, /className="markdown-body"/);
  assert.doesNotMatch(notePage, /<PreviewCard preview=\{preview\} compact \/>/);
});

test("reader course map lets large course sections collapse independently", () => {
  assert.match(readerControls, /miteee-reader-course-groups-collapsed/);
  assert.match(readerControls, /miteee-reader-course-groups-state-change/);
  assert.match(readerControls, /toggleCourseGroup/);
  assert.match(readerControls, /useSyncExternalStore\(subscribeCollapsedCourseGroups,\s*readCollapsedCourseGroupsSnapshot/);
  assert.match(readerControls, /parseCollapsedCourseGroupKeys\(collapsedCourseGroupSnapshot\)/);
  assert.match(readerControls, /course-navigator-group-toggle/);
  assert.match(readerControls, /aria-controls=\{listId\}/);
  assert.match(readerControls, /aria-expanded=\{!collapsed\}/);
  assert.match(readerControls, /group\.notes\.some\(\(item\) => item\.current\)/);
  assert.match(css, /\.course-navigator-group-header/);
  assert.match(css, /\.course-navigator-group-toggle/);
  assert.match(css, /\.course-navigator-group\.collapsed/);
  assert.match(css, /\.course-navigator-group-count/);
});

test("reader course map keeps the current lesson easy to find in long sections", () => {
  assert.match(readerControls, /const courseNavigatorRef = useRef<HTMLDivElement \| null>\(null\)/);
  assert.match(readerControls, /const currentCourseLinkRef = useRef<HTMLAnchorElement \| null>\(null\)/);
  assert.match(readerControls, /const navigatorRect = courseNavigatorRef\.current\.getBoundingClientRect\(\)/);
  assert.match(readerControls, /const currentRect = currentCourseLinkRef\.current\.getBoundingClientRect\(\)/);
  assert.match(readerControls, /currentRect\.top - navigatorRect\.top \+ courseNavigatorRef\.current\.scrollTop/);
  assert.match(readerControls, /courseNavigatorRef\.current\.clientHeight/);
  assert.match(readerControls, /courseNavigatorRef\.current\.scrollTo\(\{\s*top:/s);
  assert.match(readerControls, /data-current-course-note=\{item\.current \? "true" : undefined\}/);
  assert.match(readerControls, /ref=\{item\.current \? currentCourseLinkRef : undefined\}/);
});
