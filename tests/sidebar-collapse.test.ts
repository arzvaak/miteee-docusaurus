import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appShell = fs.readFileSync("components/AppShell.tsx", "utf8");
const shellCss = fs.readFileSync("components/AppShell.module.css", "utf8");
const themeToggle = fs.readFileSync("components/ThemeToggle.tsx", "utf8");

test("app shell renders a persistent global study navigation", () => {
  assert.match(appShell, /aria-label="Primary navigation"/);
  assert.match(appShell, /Dashboard/);
  assert.match(appShell, /Library/);
  assert.match(appShell, /Exams/);
  assert.match(appShell, /Practice/);
  assert.match(appShell, /Revision/);
  assert.match(appShell, /QuickFind/);
  assert.match(appShell, /aria-current=\{active \? "page" : undefined\}/);
});

test("focused SSC test routes remove duplicate application chrome", () => {
  assert.match(appShell, /pathname\.startsWith\("\/exams\/ssc-cgl\/session"\)/);
  assert.match(appShell, /\/\^\\\/exams\\\/ssc-cgl\\\/tests/);
  assert.match(appShell, /!focusedExamSession/);
  assert.match(shellCss, /\.focusMain\s*\{[^}]*padding:\s*0;/s);
});

test("mobile navigation remains reachable above page content", () => {
  assert.match(appShell, /aria-label="Mobile navigation"/);
  assert.match(shellCss, /@media \(max-width:\s*700px\)[\s\S]*?\.bottomNav\s*\{[^}]*position:\s*fixed;[^}]*grid-template-columns:\s*repeat\(5,/s);
  assert.match(shellCss, /@media \(max-width:\s*700px\)[\s\S]*?\.main\s*\{[^}]*padding:\s*22px 14px 90px;/s);
});

test("theme toggle keeps an accessible label in the compact header", () => {
  assert.match(themeToggle, /aria-label=\{theme === "dark" \? "Switch to light mode" : "Switch to dark mode"\}/);
  assert.match(themeToggle, /title=\{theme === "dark" \? "Switch to light mode" : "Switch to dark mode"\}/);
});
