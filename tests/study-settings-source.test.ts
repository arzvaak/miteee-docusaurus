import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("settings route passes the complete course catalog to the client settings experience", () => {
  const page = fs.readFileSync(path.join(root, "app", "settings", "page.tsx"), "utf8");
  assert.match(page, /getAllCourses\(\)/);
  assert.match(page, /<StudySettings courses=/);
});

test("settings exposes real account actions while keeping study persistence truthful", () => {
  const component = fs.readFileSync(path.join(root, "components", "StudySettings.tsx"), "utf8");
  const account = fs.readFileSync(path.join(root, "components", "SettingsAccountCard.tsx"), "utf8");
  assert.match(component, /Saved on this device/);
  assert.match(component, /This device/);
  assert.match(component, /<SettingsAccountCard/);
  assert.match(account, /Signed in as/);
  assert.match(account, /href="\/login\?next=%2Fsettings"/);
  assert.match(account, /href="\/register\?next=%2Fsettings"/);
  assert.match(account, /does not sync across devices yet/);
  assert.match(account, /still remain on this device and do not sync yet/);
});

test("settings makes the complete theme gallery discoverable", () => {
  const component = fs.readFileSync(path.join(root, "components", "StudySettings.tsx"), "utf8");
  assert.match(component, /import \{ ThemeGallery \} from "@\/components\/ThemeToggle"/);
  assert.match(component, /aria-label="Appearance settings"/);
  assert.match(component, /<ThemeGallery \/>/);
});

test("settings supports all statuses, an optional constrained plan, and data controls", () => {
  const component = fs.readFileSync(path.join(root, "components", "StudySettings.tsx"), "utf8");
  const contract = fs.readFileSync(path.join(root, "lib", "study-space-preferences.ts"), "utf8");
  assert.match(contract, /label: "Available"/);
  assert.match(contract, /label: "Studying now"/);
  assert.match(contract, /label: "Completed"/);
  assert.match(component, /role="switch"/);
  assert.match(component, /Only subjects marked Studying now can be selected/);
  assert.match(component, /Daily study minutes/);
  assert.match(component, /Study days/);
  assert.match(component, /Export JSON/);
  assert.match(component, /Restore settings/);
  assert.match(component, /Reset device settings/);
});

test("the shell keeps settings visible and exposes account access", () => {
  const shell = fs.readFileSync(path.join(root, "components", "AppShell.tsx"), "utf8");
  const account = fs.readFileSync(path.join(root, "components", "AuthControls.tsx"), "utf8");
  assert.match(shell, /href="\/settings"/);
  assert.match(shell, /aria-label="Open study settings"/);
  assert.match(shell, /<AuthControls/);
  assert.match(account, /href=\{loginHref\}/);
  assert.match(account, /href=\{registerHref\}/);
});
