import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { prepareMarkdownContent } from "../lib/markdown-normalize";

const css = fs.readFileSync("app/globals.css", "utf8");

function ruleBodies(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Array.from(css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gm"))).map((match) => match[1] ?? "");
}

function hasRule(selector: string, pattern: RegExp) {
  return ruleBodies(selector).some((body) => pattern.test(body));
}

function upscPoliticalScienceDocs() {
  const root = path.join("docs", "upsc-cse", "political-science");
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
    }
  };
  visit(root);
  return files;
}

function sscCglDocs() {
  const root = path.join("docs", "ssc-cgl");
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
    }
  };
  visit(root);
  return files;
}

test("UPSC prelims quiz HTML blocks are separated from following markdown sections", () => {
  const offenders = upscPoliticalScienceDocs().filter((filePath) => {
    const text = fs.readFileSync(filePath, "utf8");
    return /<\/div>\r?\n## Mains Answer Practice/.test(text);
  });

  assert.deepEqual(offenders, []);
});

test("UPSC prelims quiz blocks render as readable cards with stacked options", () => {
  assert.equal(hasRule(".quiz-block", /border:\s*1px solid/), true);
  assert.equal(hasRule(".quiz-block", /background:/), true);
  assert.equal(hasRule(".quiz-options", /display:\s*grid;/), true);
  assert.equal(hasRule(".quiz-options .quiz-option", /display:\s*grid;/), true);
  assert.equal(hasRule(".quiz-options .quiz-option", /grid-template-columns:\s*auto minmax\(0,\s*1fr\);/), true);
  assert.equal(hasRule(".quiz-options label", /display:\s*grid;/), true);
  assert.equal(hasRule(".quiz-options label", /grid-template-columns:\s*auto minmax\(0,\s*1fr\);/), true);
  assert.equal(hasRule(".opt-key", /display:\s*inline-grid;/), true);
  assert.equal(ruleBodies('.quiz-options [role="listitem"] span').length, 0);
  assert.equal(hasRule('.quiz-options [role="listitem"] > span:first-child', /display:\s*grid;/), true);
  assert.equal(hasRule(".quiz-exp", /border:\s*1px solid/), true);
});

test("UPSC prelims quiz options render as non-form list rows", () => {
  const source = [
    '<div class="quiz-options">',
    '<label data-opt="a"><span class="opt-key">A</span><span class="opt-text">Direct democracy</span></label>',
    '<label data-opt="b"><span class="opt-key">B</span><span class="opt-text">Representative democracy</span></label>',
    "</div>"
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.match(normalized, /<div class="quiz-options" role="list">/);
  assert.match(normalized, /<div class="quiz-option" data-opt="a" role="listitem">/);
  assert.match(normalized, /<div class="quiz-option" data-opt="b" role="listitem">/);
  assert.match(normalized, /<span class="opt-key">A<\/span> <span class="opt-text">Direct democracy<\/span>/);
  assert.doesNotMatch(normalized, /<label data-opt=/);
  assert.doesNotMatch(normalized, /<\/label>/);
});

test("quiz option normalization does not rewrite ordinary labels", () => {
  const source = [
    '<label for="search">Search</label>',
    '<div class="quiz-options">',
    '<label data-opt="a"><span class="opt-key">A</span><span class="opt-text">Direct democracy</span></label>',
    "</div>"
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.match(normalized, /<label for="search">Search<\/label>/);
});

test("SSC solved examples render as learner quiz cards with answers", () => {
  const source = [
    "## Solved Examples",
    "",
    "**Example 1**",
    "A car covers 120 km in 2.5 hours. What is its speed in m/s?",
    "Options: (a) 10 m/s (b) 13.33 m/s (c) 14.67 m/s (d) 16.67 m/s",
    "Solution: Speed = 120/2.5 = 48 km/h. Convert: 48 x 5/18 = 13.33 m/s. Answer: (b)"
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.match(normalized, /<article class="quiz-block note-quiz-block" data-answer="b">/);
  assert.match(normalized, /<div class="quiz-meta">Solved Examples · Example 1<\/div>/);
  assert.match(normalized, /<p class="quiz-q">A car covers 120 km in 2\.5 hours\. What is its speed in m\/s\?<\/p>/);
  assert.match(normalized, /<div class="quiz-options" role="list">/);
  assert.match(normalized, /<div class="quiz-option" data-opt="b" role="listitem">/);
  assert.doesNotMatch(normalized, /data-correct="true"/);
  assert.match(normalized, /<span class="opt-key">B<\/span> <span class="opt-text">13\.33 m\/s<\/span>/);
  assert.match(normalized, /<details class="quiz-exp">/);
  assert.match(normalized, /<summary>Show answer and explanation<\/summary>/);
  assert.doesNotMatch(normalized, /Options: \(a\)/);
});

test("SSC 200/200 drill rows render as compact quiz cards with answer keys", () => {
  const source = [
    "## 200/200 Drill",
    "",
    "**Timed Micro-Drill 1**",
    "1. Clock : Time :: Thermometer : ? (a) Heat (b) Temperature (c) Pressure (d) Speed",
    "2. 8 : 512 :: 6 : ? (a) 216 (b) 36 (c) 72 (d) 128",
    "",
    "**Answers**: 1-b (thermometer measures temperature), 2-a (6 cubed is 216)",
    "",
    "**Timed Micro-Drill 2**",
    "1. 2, 4, 8, 15 (a) 2 (b) 4 (c) 8 (d) 15",
    "**Answers**: 1-d (15 is not a power of 2)"
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.match(normalized, /<article class="quiz-block note-quiz-block" data-answer="b">/);
  assert.doesNotMatch(normalized, /class="quiz-block note-quiz-block answered"/);
  assert.match(normalized, /<div class="quiz-meta">200\/200 Drill · Q1<\/div>/);
  assert.match(normalized, /<p class="quiz-q">Clock : Time :: Thermometer : \?<\/p>/);
  assert.match(normalized, /<div class="quiz-option" data-opt="b" role="listitem">/);
  assert.doesNotMatch(normalized, /data-correct="true"/);
  assert.doesNotMatch(normalized, /q-correct|q-wrong|<details class="quiz-exp" open>/);
  assert.match(normalized, /<span class="opt-key">B<\/span> <span class="opt-text">Temperature<\/span>/);
  assert.match(normalized, /<p><strong>Method:<\/strong> State the exact relation/);
  assert.match(normalized, /<p><strong>Why it fits:<\/strong> Option B \(Temperature\)/);
  assert.match(normalized, /<p><strong>Trap:<\/strong> Do not choose a word that is merely associated/);
  assert.match(normalized, /<article class="quiz-block note-quiz-block" data-answer="a">/);
  assert.match(normalized, /<article class="quiz-block note-quiz-block" data-answer="d">/);
  assert.doesNotMatch(normalized, /\*\*Answers\*\*: 1-b/);
});

test("SSC topic section bodies render 200/200 drills when the heading is supplied by the page", () => {
  const source = [
    "**Timed Micro-Drill 1**",
    "1. Clock : Time :: Thermometer : ? (a) Heat (b) Temperature (c) Pressure (d) Speed",
    "",
    "**Answers**: 1-b (thermometer measures temperature)"
  ].join("\n");
  const normalized = prepareMarkdownContent(source, "200/200 Drill");

  assert.match(normalized, /<article class="quiz-block note-quiz-block" data-answer="b">/);
  assert.match(normalized, /<p class="quiz-q">Clock : Time :: Thermometer : \?<\/p>/);
  assert.match(normalized, /<span class="opt-key">B<\/span> <span class="opt-text">Temperature<\/span>/);
  assert.match(normalized, /<p><strong>Method:<\/strong>/);
  assert.match(normalized, /<p><strong>Why it fits:<\/strong>/);
  assert.match(normalized, /<p><strong>Trap:<\/strong>/);
  assert.doesNotMatch(normalized, /^<h2/m);
});

test("SSC analogy note keeps the thermometer drill keyed to temperature with a method explanation", () => {
  const source = fs.readFileSync(path.join("docs", "ssc-cgl", "reasoning", "analogy-classification.md"), "utf8");
  const normalized = prepareMarkdownContent(source);
  const drillStart = normalized.indexOf('<p class="quiz-q">Clock : Time :: Thermometer : ?</p>');
  assert.ok(drillStart >= 0, "thermometer drill should render as a quiz card");
  const drill = normalized.slice(drillStart, normalized.indexOf("</article>", drillStart));

  assert.match(drill, /data-opt="b" role="listitem"><span class="opt-key">B<\/span> <span class="opt-text">Temperature<\/span>/);
  assert.match(normalized.slice(Math.max(0, drillStart - 200), drillStart), /<article class="quiz-block note-quiz-block" data-answer="b">/);
  assert.match(drill, /<p><strong>Method:<\/strong> State the exact relation/);
  assert.match(drill, /<p><strong>Why it fits:<\/strong> Option B \(Temperature\)/);
  assert.doesNotMatch(drill, /data-answer="d"|Answer:<\/strong> D|q-correct|q-wrong|data-correct="true"|<details class="quiz-exp" open>/);
});

test("SSC 200/200 drill answers expand thin keys into method-level explanations", () => {
  const source = [
    "## 200/200 Drill",
    "",
    "**Timed Micro-Drill 1**",
    "1. Clock : Time :: Thermometer : ? (a) Heat (b) Temperature (c) Pressure (d) Speed",
    "",
    "**Answers**: 1-b (temperature)"
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.match(normalized, /<p><strong>Answer:<\/strong> B<\/p>/);
  assert.match(normalized, /<p><strong>Method:<\/strong>[^<]*relation/i);
  assert.match(normalized, /<p><strong>Why it fits:<\/strong>[^<]*Temperature/i);
  assert.match(normalized, /<p><strong>Trap:<\/strong>[^<]*same relationship/i);
  assert.doesNotMatch(normalized, /<p><strong>Why:<\/strong> temperature<\/p>/);
});

test("SSC note quiz blocks do not ship pre-revealed answers or thin 200/200 explanations", () => {
  const offenders: string[] = [];

  for (const filePath of sscCglDocs()) {
    const source = fs.readFileSync(filePath, "utf8");
    const normalized = prepareMarkdownContent(source);
    if (/q-correct|q-wrong|data-correct="true"|<details class="quiz-exp" open>/.test(normalized)) {
      offenders.push(`${filePath}: pre-revealed quiz marker`);
    }

    for (const match of normalized.matchAll(/<article class="quiz-block note-quiz-block" data-answer="[a-d]">([\s\S]*?)<\/article>/g)) {
      const block = match[0] || "";
      if (!/200\/200 Drill/.test(block)) continue;
      if (!/<p><strong>Method:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${filePath}: missing method in 200/200 drill`);
      if (!/<p><strong>Why it fits:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${filePath}: missing why-it-fits in 200/200 drill`);
      if (!/<p><strong>Trap:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${filePath}: missing trap in 200/200 drill`);
    }
  }

  assert.deepEqual(offenders, []);
});

test("SSC quiz card normalization does not rewrite ordinary numbered prose", () => {
  const source = [
    "## Concepts",
    "",
    "1. Read the question carefully before solving.",
    "2. Eliminate extreme options when the statement asks for a definite conclusion."
  ].join("\n");
  const normalized = prepareMarkdownContent(source);

  assert.doesNotMatch(normalized, /note-quiz-block/);
  assert.match(normalized, /1\. Read the question carefully before solving\./);
});

test("Next note pages hydrate markdown quiz blocks as click-to-reveal practice", () => {
  const notePage = fs.readFileSync(path.join("app", "notes", "[slug]", "page.tsx"), "utf8");
  const quizClientPath = path.join("components", "NoteQuizClient.tsx");
  assert.ok(fs.existsSync(quizClientPath), "NoteQuizClient should exist");

  const quizClient = fs.readFileSync(quizClientPath, "utf8");

  assert.match(notePage, /NoteQuizClient/);
  assert.match(quizClient, /document\.querySelectorAll\(".note-quiz-block"\)/);
  assert.match(quizClient, /usePathname/);
  assert.match(quizClient, /MutationObserver/);
  assert.match(quizClient, /\.quiz-option\[data-opt\]/);
  assert.match(quizClient, /block\.classList\.remove\("answered"\)/);
  assert.match(quizClient, /option\.classList\.remove\("q-correct", "q-wrong"\)/);
  assert.match(quizClient, /option\.removeAttribute\("data-correct"\)/);
  assert.match(quizClient, /details\.open = false/);
  assert.match(quizClient, /event\.preventDefault\(\)/);
  assert.match(quizClient, /aria-disabled/);
  assert.match(quizClient, /q-correct/);
  assert.match(quizClient, /q-wrong/);
  assert.match(quizClient, /details\.open = true/);
  assert.doesNotMatch(quizClient, /setAttribute\("data-correct"|dataset\.correct\s*=/);
  assert.equal(hasRule(".quiz-options .quiz-option.q-correct", /border-color:/), true);
  assert.equal(hasRule(".quiz-options .quiz-option.q-wrong", /border-color:/), true);
});

test("quiz styling does not reveal stale data-correct attributes before learner choice", () => {
  assert.equal(ruleBodies('.quiz-options [role="listitem"][data-correct="true"]').length, 0);
});
