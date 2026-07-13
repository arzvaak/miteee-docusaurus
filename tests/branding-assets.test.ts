import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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

test("web app manifest exposes the generated brand assets and study shortcuts", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "site.webmanifest"), "utf8")) as WebManifest;

  assert.equal(manifest.name, "MITEEE Study");
  assert.equal(manifest.short_name, "MITEEE Study");
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
