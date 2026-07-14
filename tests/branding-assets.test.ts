import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { resolvedThemes } from "../lib/themes";

type WebManifest = {
  name: string;
  short_name: string;
  icons: Array<{ src: string; sizes: string; type: string; purpose?: string }>;
  shortcuts?: Array<{ name: string; url: string; icons?: Array<{ src: string }> }>;
  screenshots?: Array<{ src: string; sizes: string; form_factor?: string }>;
};

function publicPath(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

function cssBlock(css: string, selector: string) {
  const selectorIndex = css.indexOf(selector);
  assert.notEqual(selectorIndex, -1, `${selector} should exist`);
  const openBrace = css.indexOf("{", selectorIndex);
  const closeBrace = css.indexOf("}", openBrace);
  return css.slice(openBrace + 1, closeBrace);
}

function hexToken(block: string, token: string) {
  const match = new RegExp(`--${token}:\\s*(#[0-9a-f]{6})`, "i").exec(block);
  assert.ok(match, `--${token} should be a six-digit hex color`);
  return match[1]!;
}

function contrastRatio(foreground: string, background: string) {
  function luminance(hex: string) {
    const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const linear = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
  }

  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

test("web app manifest exposes the generated brand assets and study shortcuts", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "site.webmanifest"), "utf8")) as WebManifest;

  assert.equal(manifest.name, "MITEEE");
  assert.equal(manifest.short_name, "MITEEE");
  assert.ok(manifest.icons.some((icon) => icon.src === "/img/icons/icon-192.png" && icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.src === "/img/app-icon.png" && icon.purpose?.includes("maskable")));
  assert.ok(manifest.shortcuts?.some((shortcut) => shortcut.name === "Revision Queue" && shortcut.url === "/revision"));
  assert.ok(manifest.shortcuts?.some((shortcut) => shortcut.name === "Subject Library" && shortcut.url === "/courses"));
  assert.ok(manifest.screenshots?.some((screenshot) => screenshot.src === "/img/miteee-social-card.png" && screenshot.form_factor === "wide"));
  assert.ok(manifest.screenshots?.some((screenshot) => screenshot.src === "/img/miteee-splash-portrait.jpg" && screenshot.form_factor === "narrow"));

  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(publicPath(icon.src)), `${icon.src} should exist`);
  }
  for (const screenshot of manifest.screenshots ?? []) {
    assert.ok(fs.existsSync(publicPath(screenshot.src)), `${screenshot.src} should exist`);
  }
  assert.ok(fs.existsSync(publicPath("/img/logo.svg")), "vector logo should exist");
});

test("public image directory does not ship legacy Docusaurus marketing assets", () => {
  const imageNames = fs.readdirSync(path.join(process.cwd(), "public", "img"));
  const legacyNames = imageNames.filter((name) => /docusaurus|undraw/i.test(name));

  assert.deepEqual(legacyNames, []);
});

test("homepage uses graphite study cards instead of a flat library index", () => {
  const dashboard = fs.readFileSync(path.join(process.cwd(), "components", "StudyDashboard.tsx"), "utf8");
  const css = fs.readFileSync(path.join(process.cwd(), "components", "StudyDashboard.module.css"), "utf8");

  assert.match(dashboard, /Make room for what matters now\./);
  assert.match(dashboard, /Subject Spaces/);
  assert.match(dashboard, /studySpaceStatusOptions\.map/);
  assert.doesNotMatch(dashboard, /home-hero|study desk/i);
  assert.match(css, /\.dashboardGrid\s*\{/);
  assert.match(css, /\.spaceCard\s*\{/);
  assert.doesNotMatch(css, /miteee-hero-bg/);
});

test("homepage uses a dark-safe palette with an explicit light alternative", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "app", "study-minimal.css"), "utf8");
  const dashboardCss = fs.readFileSync(path.join(process.cwd(), "components", "StudyDashboard.module.css"), "utf8");
  assert.match(css, /:root,[\s\S]*?--bg:\s*#090c11/);
  assert.match(css, /--surface:\s*#10151d/);
  assert.match(css, /:root\[data-theme="light"\][\s\S]*?--bg:\s*#f7f8fa/);
  assert.match(dashboardCss, /--dashboard-panel:\s*#0e1621/);
  assert.match(dashboardCss, /:global\(:root\[data-theme="light"\]\) \.dashboard/);
});

test("appearance themes include warm paper and high-contrast palettes", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

  assert.match(css, /:root\[data-theme="paper"\][\s\S]*?--bg:\s*#f4efe5/);
  assert.match(css, /:root\[data-theme="high-contrast"\][\s\S]*?--bg:\s*#000000/);
  assert.match(css, /:root\[data-theme="high-contrast"\][\s\S]*?:focus-visible/);
});

test("light and paper muted text tokens retain small-text contrast on muted surfaces", () => {
  const globalCss = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const minimalCss = fs.readFileSync(path.join(process.cwd(), "app", "study-minimal.css"), "utf8");
  const globalLight = cssBlock(globalCss, ':root[data-theme="light"]');
  const finalLight = cssBlock(minimalCss, ':root[data-theme="light"]');
  const paper = cssBlock(globalCss, ':root[data-theme="paper"]');

  assert.equal(hexToken(globalLight, "muted"), hexToken(finalLight, "muted"));
  assert.ok(contrastRatio(hexToken(finalLight, "muted"), hexToken(finalLight, "surface-muted")) >= 4.5);
  assert.ok(contrastRatio(hexToken(paper, "muted"), hexToken(paper, "surface-muted")) >= 4.5);
});

test("every registered palette has readable semantic tokens", () => {
  const globalCss = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const minimalCss = fs.readFileSync(path.join(process.cwd(), "app", "study-minimal.css"), "utf8");

  for (const theme of resolvedThemes) {
    const selector = `:root[data-theme="${theme.value}"]`;
    const source = theme.value === "dark" || theme.value === "light" ? minimalCss : globalCss;
    const block = cssBlock(source, selector);

    for (const token of ["bg", "surface", "surface-muted", "text", "text-soft", "muted", "accent", "accent-strong"]) {
      assert.match(block, new RegExp(`--${token}:`), `${theme.label} should define --${token}`);
    }

    assert.ok(
      contrastRatio(hexToken(block, "text"), hexToken(block, "surface")) >= 4.5,
      `${theme.label} text should meet WCAG AA on its surface`
    );
    assert.ok(
      contrastRatio(hexToken(block, "muted"), hexToken(block, "surface-muted")) >= 4.5,
      `${theme.label} muted text should meet WCAG AA on muted surfaces`
    );
    assert.ok(
      contrastRatio(hexToken(block, "accent-strong"), hexToken(block, "bg")) >= 4.5,
      `${theme.label} accent text should meet WCAG AA on the page background`
    );
  }
});

test("homepage surfaces inherit the active palette instead of resetting to graphite", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

  assert.doesNotMatch(css, /\.public-home-page\s*\{\s*--bg:/);
  assert.match(css, /:root\[data-theme\] \.public-home-page\s*\{[\s\S]*?--dashboard-panel:\s*var\(--surface\)/);
  assert.match(css, /--dashboard-text:\s*var\(--text\)/);
  assert.match(css, /--dashboard-muted:\s*var\(--muted\)/);
});
