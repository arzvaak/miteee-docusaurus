import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appShell = fs.readFileSync("components/AppShell.tsx", "utf8");
const sidebarControls = fs.existsSync("components/ShellSidebarControls.tsx")
  ? fs.readFileSync("components/ShellSidebarControls.tsx", "utf8")
  : "";
const themeToggle = fs.readFileSync("components/ThemeToggle.tsx", "utf8");
const layout = fs.readFileSync("app/layout.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

function ruleBodies(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Array.from(css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gm"))).map((match) => match[1] ?? "");
}

function hasRule(selector: string, pattern: RegExp) {
  return ruleBodies(selector).some((body) => pattern.test(body));
}

test("app shell renders a persistent sidebar collapse control", () => {
  assert.match(appShell, /ShellSidebarControls/);
  assert.match(appShell, /<aside className="sidebar">/);
});

test("sidebar collapse state is persisted and applied to the document root", () => {
  assert.match(sidebarControls, /miteee-shell-sidebar-collapsed/);
  assert.match(sidebarControls, /dataset\.sidebarCollapsed/);
  assert.match(sidebarControls, /aria-pressed/);
});

test("saved sidebar collapse state is applied before hydration to avoid layout flash", () => {
  assert.match(layout, /const shellInitScript = `/);
  assert.match(layout, /localStorage\.getItem\("miteee-shell-sidebar-collapsed"\)/);
  assert.match(layout, /document\.documentElement\.dataset\.sidebarCollapsed = "true"/);
  assert.match(layout, /id="shell-init"/);
  assert.match(layout, /strategy="beforeInteractive"/);
});

test("collapsed sidebar CSS narrows the rail and hides text labels on desktop", () => {
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s*\{[^}]*--sidebar:\s*76px;/s);
  assert.match(css, /\.sidebar-collapse-toggle/);
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s+\.sidebar\s+\.nav-link\s+span/);
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s+\.sidebar-course\s+small/);
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s+\.sidebar-corpus/);
});

test("collapsed sidebar keeps the theme toggle inside the narrow rail", () => {
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s+\.sidebar\s*>\s*\.theme-toggle\s*\{[^}]*width:\s*38px;[^}]*min-width:\s*38px;[^}]*padding:\s*0;/s);
  assert.match(css, /\[data-sidebar-collapsed="true"\]\s+\.sidebar\s*>\s*\.theme-toggle\s+span\s*\{[^}]*display:\s*none;/s);
});

test("theme toggle keeps an accessible label when sidebar text is hidden", () => {
  assert.match(themeToggle, /aria-label=\{theme === "dark" \? "Switch to light mode" : "Switch to dark mode"\}/);
  assert.match(themeToggle, /title=\{theme === "dark" \? "Switch to light mode" : "Switch to dark mode"\}/);
});

test("sidebar course progress bars stay inside the shortcut row", () => {
  assert.equal(hasRule(".sidebar-course i", /left:\s*30px;/), true);
  assert.equal(hasRule(".sidebar-course i", /max-width:\s*calc\(100% - 40px\);/), true);
});
