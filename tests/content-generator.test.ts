import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildContentData,
  courseCodeFromSegments,
  rewriteMarkdownAssetLinks,
  slugFromRelativePath
} from "../scripts/build-content-data";

function collectMarkdownFiles(root: string) {
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

test("slugFromRelativePath keeps nested docs addressable", () => {
  assert.equal(slugFromRelativePath("sem6/mi/tutorial-1.md"), "sem6-mi-tutorial-1");
  assert.equal(slugFromRelativePath("sem5/em2/week-01/index.md"), "sem5-em2-week-01-index");
});

test("courseCodeFromSegments maps current MITEEE roots into stable course codes", () => {
  assert.equal(courseCodeFromSegments(["sem5", "em2", "overview.md"]), "SEM5-EM2");
  assert.equal(courseCodeFromSegments(["sem6", "mi", "tutorial-1.md"]), "SEM6-MI");
  assert.equal(courseCodeFromSegments(["upsc-cse", "political-science", "overview.md"]), "UPSC-CSE-POLITICAL-SCIENCE");
  assert.equal(courseCodeFromSegments(["upsc-cse", "political-science", "class-11", "chapter-1.md"]), "UPSC-CSE-POLITICAL-SCIENCE");
  assert.equal(courseCodeFromSegments(["ssc-cgl", "quant", "percentages.md"]), "SSC-CGL");
});

test("rewriteMarkdownAssetLinks rewrites local note-relative assets and keeps external links", () => {
  const input = [
    "![diagram](./images/coil.png)",
    "![local](assets/diagrams/flow.svg)",
    "![remote](https://example.com/a.png)",
    "[download](/downloads/em2/file.pdf)"
  ].join("\n");

  const output = rewriteMarkdownAssetLinks(input, "sem5/em2/week-01/index.md");

  assert.match(output, /\/content-assets\/sem5\/em2\/week-01\/images\/coil\.png/);
  assert.match(output, /\/content-assets\/sem5\/em2\/week-01\/assets\/diagrams\/flow\.svg/);
  assert.match(output, /https:\/\/example\.com\/a\.png/);
  assert.match(output, /\(\/downloads\/em2\/file\.pdf\)/);
});

test("rewriteMarkdownAssetLinks rewrites markdown document links into note routes", () => {
  const input = [
    "[previous](../week-01/index.md)",
    "[overview](../../overview.md#formula-sheet)",
    "![diagram](../assets/coil.png)"
  ].join("\n");

  const output = rewriteMarkdownAssetLinks(input, "sem5/em2/week-02/index.md", {
    slugByRelativePath: {
      "sem5/em2/week-01/index.md": "sem5-em2-week-01-index",
      "sem5/overview.md": "sem5-overview"
    }
  });

  assert.match(output, /\[previous\]\(\/notes\/sem5-em2-week-01-index\)/);
  assert.match(output, /\[overview\]\(\/notes\/sem5-overview#formula-sheet\)/);
  assert.match(output, /!\[diagram\]\(\/content-assets\/sem5\/em2\/assets\/coil\.png\)/);
});

test("rewriteMarkdownAssetLinks resolves extensionless chapter links into note routes", () => {
  const input = [
    "[chapter one](./what-is-democracy-why-democracy)",
    "[book index](../democratic-politics-i/)",
    "[plain asset](./assets/source)"
  ].join("\n");

  const output = rewriteMarkdownAssetLinks(input, "upsc-cse/political-science/class-9/democratic-politics-i/index.md", {
    slugByRelativePath: {
      "upsc-cse/political-science/class-9/democratic-politics-i/what-is-democracy-why-democracy.md": "upsc-cse-political-science-class-9-democratic-politics-i-01-what-is-democracy-why-democracy",
      "upsc-cse/political-science/class-9/democratic-politics-i/index.md": "upsc-cse-political-science-class-9-democratic-politics-i-index"
    }
  });

  assert.match(output, /\[chapter one\]\(\/notes\/upsc-cse-political-science-class-9-democratic-politics-i-01-what-is-democracy-why-democracy\)/);
  assert.match(output, /\[book index\]\(\/notes\/upsc-cse-political-science-class-9-democratic-politics-i-index\)/);
  assert.match(output, /\[plain asset\]\(\/content-assets\/upsc-cse\/political-science\/class-9\/democratic-politics-i\/assets\/source\)/);
});

test("rewriteMarkdownAssetLinks rewrites root-relative docs links into note routes", () => {
  const input = [
    "[polity overview](/upsc-cse/political-science/)",
    "[constitution](/upsc-cse/political-science/class-11/indian-constitution-at-work/)",
    "[download](/downloads/em2/file.pdf)"
  ].join("\n");

  const output = rewriteMarkdownAssetLinks(input, "index.md", {
    slugByRelativePath: {
      "upsc-cse/political-science/overview.md": "upsc-cse-political-science-overview",
      "upsc-cse/political-science/class-11/indian-constitution-at-work/index.md": "upsc-cse-political-science-class-11-index"
    }
  });

  assert.match(output, /\[polity overview\]\(\/notes\/upsc-cse-political-science-overview\)/);
  assert.match(output, /\[constitution\]\(\/notes\/upsc-cse-political-science-class-11-index\)/);
  assert.match(output, /\[download\]\(\/downloads\/em2\/file\.pdf\)/);
});

test("buildContentData indexes docs, copies assets, and writes catalog files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-content-"));
  const docsRoot = path.join(root, "docs");
  const generatedRoot = path.join(root, "data", "generated");
  const publicRoot = path.join(root, "public");
  const noteDir = path.join(docsRoot, "sem6", "mi");
  const examMarker = path.join(generatedRoot, "exams", "ssc-cgl", "index.json");

  fs.mkdirSync(path.join(noteDir, "assets"), { recursive: true });
  fs.mkdirSync(path.dirname(examMarker), { recursive: true });
  fs.writeFileSync(examMarker, "{\"preserved\":true}\n");
  fs.writeFileSync(path.join(noteDir, "assets", "diagram.svg"), "<svg />");
  fs.writeFileSync(
    path.join(noteDir, "tutorial-1.md"),
    [
      "---",
      "title: Tutorial One",
      "description: Measurement systems",
      "---",
      "# Tutorial One",
      "",
      "![Diagram](assets/diagram.svg)",
      "",
      "$$",
      "V = IR",
      "$$"
    ].join("\n")
  );

  const result = buildContentData({ docsRoot, generatedRoot, publicRoot });

  assert.equal(result.catalog.totals.notes, 1);
  assert.equal(result.catalog.totals.courses, 1);
  assert.equal(result.notes[0]?.courseCode, "SEM6-MI");
  assert.match(result.notes[0]?.content || "", /\/content-assets\/sem6\/mi\/assets\/diagram\.svg/);
  assert.doesNotMatch(result.notes[0]?.content || "", /^# Tutorial One/m);
  assert.ok(fs.existsSync(path.join(generatedRoot, "catalog.json")));
  assert.ok(fs.existsSync(path.join(generatedRoot, "notes", "sem6-mi-tutorial-1.json")));
  assert.equal(fs.readFileSync(examMarker, "utf8"), "{\"preserved\":true}\n");
  assert.ok(fs.existsSync(path.join(publicRoot, "content-assets", "sem6", "mi", "assets", "diagram.svg")));
});

test("buildContentData removes generated output with Windows-safe retries", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "scripts", "build-content-data.ts"), "utf8");

  assert.match(source, /maxRetries:\s*\d+/);
  assert.match(source, /retryDelay:\s*\d+/);
});

test("buildContentData counts generated UPSC practice prompts separately from markdown questions", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-upsc-content-"));
  const docsRoot = path.join(root, "docs");
  const generatedRoot = path.join(root, "data", "generated");
  const publicRoot = path.join(root, "public");
  const noteDir = path.join(docsRoot, "upsc-cse", "political-science", "class-10");

  fs.mkdirSync(noteDir, { recursive: true });
  fs.writeFileSync(
    path.join(noteDir, "power-sharing.md"),
    [
      "---",
      "title: Power Sharing",
      "---",
      "# Power Sharing",
      "",
      "## UPSC Relevance",
      "",
      "Power sharing matters for democracy and federalism.",
      "",
      "## Prelims Drill",
      "",
      "Write five objective facts before opening the answer.",
      "",
      "## Mains Answer Practice",
      "",
      "Write a 150-word answer outline."
    ].join("\n")
  );

  const result = buildContentData({ docsRoot, generatedRoot, publicRoot });
  const upsc = result.catalog.courses.find((course) => course.code === "UPSC-CSE-POLITICAL-SCIENCE");

  assert.equal(upsc?.questionCount, 0);
  assert.equal(upsc?.practicePromptCount, 2);
  assert.equal(result.catalog.totals.practicePrompts, 2);
});

test("buildContentData keeps SSC internal pipeline docs out of public learner notes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-ssc-content-"));
  const docsRoot = path.join(root, "docs");
  const generatedRoot = path.join(root, "data", "generated");
  const publicRoot = path.join(root, "public");
  const sscRoot = path.join(docsRoot, "ssc-cgl");
  const quantRoot = path.join(sscRoot, "quant");

  fs.mkdirSync(quantRoot, { recursive: true });
  fs.writeFileSync(path.join(sscRoot, "current-affairs-pipeline.md"), "# SSC CGL Current Affairs Pipeline\n\nInternal runbook.");
  fs.writeFileSync(path.join(sscRoot, "book-corpus-blueprint.md"), "# Book Corpus Blueprint\n\nInternal import notes.");
  fs.writeFileSync(path.join(quantRoot, "percentages.md"), "# Percentages\n\nLearner-facing quant lesson.");

  const result = buildContentData({ docsRoot, generatedRoot, publicRoot });
  const ssc = result.catalog.courses.find((course) => course.code === "SSC-CGL");

  assert.equal(result.notes.length, 1);
  assert.equal(result.notes[0]?.relativePath, "ssc-cgl/quant/percentages.md");
  assert.equal(ssc?.folder, "ssc-cgl");
  assert.equal(ssc?.level, "SSC CGL Tier-I");
  assert.equal(ssc?.category, "Competitive exams");
  assert.equal(fs.existsSync(path.join(generatedRoot, "notes", "ssc-cgl-current-affairs-pipeline.json")), false);
});

test("buildContentData extracts quiz sets from learner markdown notes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-quiz-content-"));
  const docsRoot = path.join(root, "docs");
  const generatedRoot = path.join(root, "data", "generated");
  const publicRoot = path.join(root, "public");
  const noteDir = path.join(docsRoot, "ssc-cgl", "quant");

  fs.mkdirSync(noteDir, { recursive: true });
  fs.writeFileSync(
    path.join(noteDir, "unit-digit.md"),
    [
      "---",
      "title: Unit Digit",
      "---",
      "# Unit Digit",
      "",
      "Concepts and speed rules.",
      "",
      "## Quiz: Unit Digit Sprint",
      "",
      "1. What is the unit digit of 7^13?",
      "Options: (a) 1 (b) 3 (c) 7 (d) 9",
      "Answer: (c)",
      "",
      "2. What is the unit digit of 2^10?",
      "A. 2  B. 4  C. 6  D. 8",
      "Answer: B",
      "",
      "![cycle](assets/unit-cycle.svg)",
      "",
      "## Traps",
      "",
      "Do not multiply the whole power."
    ].join("\n")
  );

  const result = buildContentData({ docsRoot, generatedRoot, publicRoot });
  const note = result.notes[0];
  const ssc = result.catalog.courses.find((course) => course.code === "SSC-CGL");

  assert.equal(note?.stats.quizBlocks, 2);
  assert.equal(note?.quizSets?.length, 1);
  assert.equal(note?.quizSets?.[0]?.testName, "Unit Digit Sprint");
  assert.equal(note?.quizSets?.[0]?.count, 2);
  assert.equal(note?.quizSets?.[0]?.typeCounts.mcq, 2);
  assert.equal(note?.quizSets?.[0]?.imageCount, 1);
  assert.equal(note?.quizSets?.[0]?.anchorId, "quiz-unit-digit-sprint");
  assert.equal(ssc?.quizSets.length, 1);
  assert.equal(ssc?.quizSets[0]?.testName, "Unit Digit: Unit Digit Sprint");
  assert.equal(result.catalog.totals.quizzes, 1);
});

test("buildContentData treats SSC solved examples and 200/200 drills as practice sets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-ssc-practice-content-"));
  const docsRoot = path.join(root, "docs");
  const generatedRoot = path.join(root, "data", "generated");
  const publicRoot = path.join(root, "public");
  const noteDir = path.join(docsRoot, "ssc-cgl", "reasoning");

  fs.mkdirSync(noteDir, { recursive: true });
  fs.writeFileSync(
    path.join(noteDir, "analogy.md"),
    [
      "---",
      "title: Analogy",
      "---",
      "# Analogy",
      "",
      "## Solved Examples",
      "",
      "**Example 1: Function Analogy**",
      "Pen is related to Writing in the same way Knife is related to:",
      "Options: (a) Cutting (b) Reading (c) Measuring (d) Painting",
      "**Answer: (a) Cutting**",
      "",
      "**Example 2: Number Analogy**",
      "9 is related to 81 in the same way 12 is related to:",
      "Options: (a) 96 (b) 120 (c) 144 (d) 156",
      "**Answer: (c) 144**",
      "",
      "## 200/200 Drill",
      "",
      "**Timed Micro-Drill 1**",
      "1. Clock : Time :: Thermometer : ? (a) Heat (b) Temperature (c) Pressure (d) Speed",
      "2. 8 : 512 :: 6 : ? (a) 216 (b) 36 (c) 72 (d) 128",
      "",
      "| Drill Type | Questions | Time |",
      "|---|---:|---|",
      "| Relation sentence | 5 | 2 min |"
    ].join("\n")
  );

  const result = buildContentData({ docsRoot, generatedRoot, publicRoot });
  const note = result.notes[0];
  const ssc = result.catalog.courses.find((course) => course.code === "SSC-CGL");

  assert.equal(note?.stats.quizBlocks, 9);
  assert.equal(note?.quizSets?.length, 2);
  assert.equal(note?.quizSets?.[0]?.testName, "Solved Examples");
  assert.equal(note?.quizSets?.[0]?.anchorId, "solved-examples");
  assert.equal(note?.quizSets?.[0]?.count, 2);
  assert.equal(note?.quizSets?.[0]?.typeCounts.mcq, 2);
  assert.equal(note?.quizSets?.[1]?.testName, "200/200 Drill");
  assert.equal(note?.quizSets?.[1]?.anchorId, "200-200-drill");
  assert.equal(note?.quizSets?.[1]?.count, 7);
  assert.equal(ssc?.quizSets.length, 2);
  assert.equal(result.catalog.totals.quizzes, 2);
});

test("SSC learner-note drills do not ship bare answer-only rows", () => {
  const sscRoot = path.join(process.cwd(), "docs", "ssc-cgl");
  const answerOnlyPattern = /^\s*(?:\*\*)?Answer(?:\*\*)?\s*:\s*(?:\(?[a-dA-D]\)?|[a-dA-D]\.?)\s*(?:\*\*)?\s*$/;
  const offenders = collectMarkdownFiles(sscRoot).flatMap((filePath) => {
    const relative = path.relative(process.cwd(), filePath);
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    return lines.flatMap((line, index) => {
      if (!answerOnlyPattern.test(line)) return [];
      const explanationNearby = lines
        .slice(Math.max(0, index - 3), index + 4)
        .map((candidate) => candidate.trim())
        .filter(Boolean)
        .some((candidate) => /^(?:\*\*)?(?:Explanation|Solution|Why it fits|Method)(?:\*\*)?\s*:/i.test(candidate));
      return explanationNearby ? [] : [`${relative}:${index + 1}:${line.trim()}`];
    });
  });

  assert.deepEqual(offenders, []);
});
