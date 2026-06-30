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

  assert.equal(manifest.name, "MITEEE Personal Study Desk");
  assert.equal(manifest.short_name, "MITEEE Desk");
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

test("homepage hero uses the generated desk artwork as the outer visual surface", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const homeHeroRule = css.match(/\.home-hero\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";
  const homeHeroCopyRule = css.match(/\.home-hero-copy\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";

  assert.match(homeHeroRule, /url\("\/img\/miteee-hero-bg\.jpg"\)/);
  assert.doesNotMatch(homeHeroCopyRule, /url\("\/img\/miteee-hero-bg\.jpg"\)/);
});

test("homepage uses a dark-safe default palette and scopes white surfaces to light mode", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const homePageRule = Array.from(css.matchAll(/\.public-home-page\s*\{(?<body>[^}]*)\}/g)).map((match) => match.groups?.body ?? "").find((body) => body.includes("--bg:")) ?? "";
  const lightHomePageRule = Array.from(css.matchAll(/:root\[data-theme="light"\]\s+\.public-home-page\s*\{(?<body>[^}]*)\}/g)).map((match) => match.groups?.body ?? "").find((body) => body.includes("--bg:")) ?? "";
  const homeMainRule = css.match(/\.main-content:has\(\.public-home-page\)\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";
  const lightHomeMainRule = css.match(/:root\[data-theme="light"\]\s+\.main-content:has\(\.public-home-page\)\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";
  const homeDeskRule = css.match(/\.home-desk\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";
  const lightHomeDeskRule = css.match(/:root\[data-theme="light"\]\s+\.home-desk\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";

  assert.match(homePageRule, /--bg:\s*#0c0d10/);
  assert.match(homePageRule, /--surface:\s*#191b21/);
  assert.doesNotMatch(homePageRule, /--surface:\s*#fbfcfa/);
  assert.match(lightHomePageRule, /--surface:\s*#fbfcfa/);
  assert.match(homeMainRule, /var\(--bg\)/);
  assert.doesNotMatch(homeMainRule, /#fafbf9|#f6f8f5/);
  assert.match(lightHomeMainRule, /#fafbf9/);
  assert.match(homeDeskRule, /rgba\(25,\s*27,\s*33,\s*0\.92\)/);
  assert.doesNotMatch(homeDeskRule, /rgba\(255,\s*255,\s*255,\s*0\.88\)/);
  assert.match(lightHomeDeskRule, /rgba\(255,\s*255,\s*255,\s*0\.88\)/);
});
