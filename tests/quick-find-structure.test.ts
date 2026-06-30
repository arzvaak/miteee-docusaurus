import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const quickFind = fs.readFileSync("components/QuickFind.tsx", "utf8");
const appShell = fs.readFileSync("components/AppShell.tsx", "utf8");
const searchRoute = fs.readFileSync("app/api/search/route.ts", "utf8");

test("QuickFind opens the active result from keyboard activation", () => {
  assert.match(quickFind, /function openActiveResult/);
  assert.match(quickFind, /setOpen\(false\)/);
  assert.match(quickFind, /window\.location\.href = `\/notes\/\$\{preview\.slug\}`/);
  assert.match(quickFind, /event\.key === "Enter" && activePreview/);
  assert.match(quickFind, /openActiveResult\(activePreview\)/);
});

test("QuickFind global shortcut can open the launcher from any visible app route", () => {
  assert.match(quickFind, /const wantsCommand = \(event\.ctrlKey \|\| event\.metaKey\) && key === "k"/);
  assert.doesNotMatch(quickFind, /offsetParent/);
  assert.doesNotMatch(quickFind, /const isVisible = rootRef\.current/);
});

test("QuickFind presents command-style grouped result signals without preloading notes", () => {
  assert.match(quickFind, /Search UPSC, practice, answer framework, federalism, EM2/);
  assert.match(quickFind, /result\.groupLabel/);
  assert.match(quickFind, /result\.signalLabel/);
  assert.doesNotMatch(quickFind, /prefetch=\{true\}/);
});

test("AppShell does not serialize full QuickFind previews into every route", () => {
  assert.doesNotMatch(appShell, /getSearchCandidates/);
  assert.doesNotMatch(appShell, /<QuickFind previews=\{previews\}/);
  assert.match(appShell, /<QuickFind \/>/);
});

test("QuickFind lazy-loads minimized search results from the API", () => {
  assert.match(quickFind, /\/api\/search/);
  assert.match(quickFind, /fetch\(/);
  assert.doesNotMatch(quickFind, /previews: NotePreview\[\]/);
});

test("search API ranks full candidates server-side but returns only QuickFind fields", () => {
  assert.match(searchRoute, /selectQuickSearchResults\(getSearchCandidates\(\), query, limit\)/);
  assert.match(searchRoute, /slug: result\.preview\.slug/);
  assert.match(searchRoute, /label: result\.preview\.label/);
  assert.match(searchRoute, /stats: result\.preview\.stats/);
  assert.doesNotMatch(searchRoute, /content:/);
  assert.doesNotMatch(searchRoute, /headings: result\.preview\.headings/);
  assert.doesNotMatch(searchRoute, /aliases: result\.preview\.aliases/);
  assert.doesNotMatch(searchRoute, /title: result\.preview\.title/);
});
