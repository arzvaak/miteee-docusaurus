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

test("settings is explicit about device-only persistence and unavailable account sync", () => {
  const component = fs.readFileSync(path.join(root, "components", "StudySettings.tsx"), "utf8");
  assert.match(component, /Saved on this device/);
  assert.match(component, /This device only/);
  assert.match(component, /Account &amp; sync/);
  assert.match(component, /Not connected yet/);
  assert.match(component, /do not sync across devices/);
  assert.doesNotMatch(component, /Signed in as/);
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

test("the shell avatar is a truthful settings link", () => {
  const shell = fs.readFileSync(path.join(root, "components", "AppShell.tsx"), "utf8");
  assert.match(shell, /href="\/settings"/);
  assert.match(shell, /aria-label="Open study settings"/);
  assert.doesNotMatch(shell, /Signed in as MITEEE learner/);
});
