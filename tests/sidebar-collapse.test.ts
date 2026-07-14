import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appShell = fs.readFileSync("components/AppShell.tsx", "utf8");
const shellCss = fs.readFileSync("components/AppShell.module.css", "utf8");
const themeToggle = fs.readFileSync("components/ThemeToggle.tsx", "utf8");
const themeRegistry = fs.readFileSync("lib/themes.ts", "utf8");
const rootLayout = fs.readFileSync("app/layout.tsx", "utf8");
const mermaidDiagram = fs.readFileSync("components/MermaidDiagram.tsx", "utf8");
const globalCss = fs.readFileSync("app/globals.css", "utf8");

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
  assert.match(shellCss, /@media \(max-width:\s*1040px\)[\s\S]*?\.desktopNav\s*\{[^}]*display:\s*none;[\s\S]*?\.bottomNav\s*\{[^}]*position:\s*fixed;[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(6,/s);
  assert.match(shellCss, /@media \(max-width:\s*700px\)[\s\S]*?\.main\s*\{[^}]*padding:\s*22px 14px 90px;/s);
});

test("theme picker defaults to system and exposes an accessible compact menu", () => {
  for (const theme of [
    "dark", "light", "paper", "monokai", "dracula", "nord", "gruvbox", "solarized-dark",
    "solarized-light", "tokyo-night", "one-dark", "catppuccin", "high-contrast"
  ]) {
    assert.match(themeRegistry, new RegExp(`value: "${theme}"`));
  }
  assert.match(themeRegistry, /export type ThemePreference = "system" \| ResolvedTheme/);
  assert.match(themeToggle, /themeOptions\.map/);
  assert.match(themeToggle, /aria-haspopup="menu"/);
  assert.match(themeToggle, /aria-label=\{`Theme: \$\{selectedOption\.label\}\. Choose theme`\}/);
  assert.match(themeToggle, /role="menuitemradio"/);
  assert.match(themeToggle, /tabIndex=\{-1\}/);
  assert.match(themeToggle, /event\.key === "ArrowDown"/);
  assert.match(themeToggle, /event\.key === "Home"/);
  assert.match(themeToggle, /optionRefs\.current\[focusIndex\]\?\.focus\(\)/);
  assert.match(themeToggle, /window\.localStorage\.setItem\(themeStorageKey, nextPreference\)/);
  assert.match(themeToggle, /window\.matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(globalCss, /\.theme-menu\s*\{[^}]*max-height:\s*min\(580px, calc\(100dvh - 92px\)\)[^}]*overflow-y:\s*auto/s);
  assert.match(globalCss, /:root\[data-theme="high-contrast"\][\s\S]*?\.theme-menu-option:focus-visible[\s\S]*?outline:\s*3px solid var\(--accent\)/);
});

test("theme registry drives pre-render mode, diagrams, and the Settings gallery", () => {
  assert.match(rootLayout, /import \{ resolvedThemes, themeStorageKey \} from "@\/lib\/themes"/);
  assert.match(rootLayout, /root\.dataset\.themeMode = mode/);
  assert.match(rootLayout, /root\.style\.colorScheme = mode/);
  assert.match(themeToggle, /root\.dataset\.themeMode = definition\.mode/);
  assert.match(themeToggle, /export function ThemeGallery/);
  assert.match(themeToggle, /type="radio"/);
  assert.match(themeToggle, /className="theme-gallery-swatch"/);
  assert.match(mermaidDiagram, /document\.documentElement\.dataset\.themeMode/);
});
