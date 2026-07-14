import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getSscCglDashboard, getSscCglTests } from "../lib/ssc-cgl";

const page = fs.readFileSync("app/practice/page.tsx", "utf8");
const setup = fs.readFileSync("components/SscExamSetup.tsx", "utf8");
const css = fs.readFileSync("components/SscExamSetup.module.css", "utf8");

test("practice is an SSC CGL MCQ command center backed by the real corpus", () => {
  const dashboard = getSscCglDashboard();
  const tests = getSscCglTests();

  assert.ok(dashboard.readiness.reviewedQuestions > 20_000);
  assert.ok(tests.some((item) => item.mode === "full_mock"));
  assert.match(page, /getSscCglDashboard, getSscCglTests/);
  assert.match(page, /<SscExamSetup/);
  assert.match(page, /overviewHref="\/practice"/);
  assert.match(page, /reviewedQuestions=\{dashboard\.readiness\.reviewedQuestions\}/);
  assert.match(page, /dashboard\.readiness\.sectionReadiness/);
  assert.match(page, /modeCounts\.pyq_shift/);
  assert.match(page, /modeCounts\.speed_sprint/);
  assert.doesNotMatch(page, /AnswerPracticeLab|buildAnswerPracticePrompts|diagnose weaknesses/);
});

test("practice exposes real MCQ modes, sections, lengths, timers, sources, and difficulty", () => {
  assert.match(setup, /What do you want to practice\?/);
  assert.match(setup, /Full Mock/);
  assert.match(setup, /Quick 10/);
  assert.match(setup, /Section Test/);
  assert.match(setup, /Endless Practice/);
  assert.match(setup, /Book \/ PYQ Practice/);
  assert.match(setup, /Weakness Repair/);
  assert.match(setup, /Section \/ subject/);
  assert.match(setup, /Question length/);
  assert.match(setup, /Timer/);
  assert.match(setup, /Question source/);
  assert.match(setup, /Difficulty/);
  assert.match(setup, /\/exams\/ssc-cgl\/session\?/);
});

test("practice uses only MCQ launches and evidence-backed review lanes", () => {
  assert.match(setup, /Start with a real exam baseline/);
  assert.match(setup, /mode=weak&section=all&length=25/);
  assert.match(setup, /status=wrong/);
  assert.match(setup, /status=unattempted/);
  assert.match(setup, /status=slow/);
  assert.match(setup, /Questions keep coming until you stop/);
  assert.doesNotMatch(setup, /<textarea|Diagram explanation|Formula practice|Write answer/);
});

test("practice mode cards and configuration remain responsive", () => {
  assert.match(setup, /data-shell-full-bleed="true"/);
  assert.match(css, /\.modeGrid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 940px\)[\s\S]*?\.examRail[\s\S]*?overflow-x:\s*auto/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.modeGrid[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /var\(--bg\)|var\(--surface\)|var\(--accent\)/);
});
