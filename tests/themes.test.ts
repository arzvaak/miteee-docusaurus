import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeThemePreference,
  resolveThemePreference,
  resolvedThemes,
  themeModeById,
  themeOptions
} from "../lib/themes";

test("theme registry is broad, unique, and includes the requested editor palettes", () => {
  const ids = resolvedThemes.map((theme) => theme.value);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(themeOptions.length >= 14);

  for (const expected of [
    "dark", "light", "paper", "parchment", "night-paper", "monokai", "dracula", "nord", "gruvbox", "solarized-dark",
    "solarized-light", "tokyo-night", "one-dark", "catppuccin", "high-contrast"
  ]) {
    assert.ok(ids.includes(expected as (typeof ids)[number]), `${expected} should be registered`);
  }

  assert.ok(themeOptions.every((theme) => theme.swatch.length === 5), "theme previews should expose the full multi-accent palette");
});

test("theme registry carries the native light and dark mode for every palette", () => {
  assert.equal(themeModeById.paper, "light");
  assert.equal(themeModeById.parchment, "light");
  assert.equal(themeModeById["night-paper"], "dark");
  assert.equal(themeModeById["solarized-light"], "light");
  assert.equal(themeModeById.monokai, "dark");
  assert.equal(themeModeById.dracula, "dark");
  assert.equal(themeModeById["high-contrast"], "dark");
  assert.ok(resolvedThemes.every((theme) => theme.mode === "dark" || theme.mode === "light"));
});

test("theme preferences safely normalize storage and resolve System", () => {
  assert.equal(normalizeThemePreference("monokai"), "monokai");
  assert.equal(normalizeThemePreference("unknown-theme"), "system");
  assert.equal(normalizeThemePreference(null), "system");
  assert.equal(resolveThemePreference("system", true), "dark");
  assert.equal(resolveThemePreference("system", false), "light");
  assert.equal(resolveThemePreference("solarized-light", true), "solarized-light");
});
