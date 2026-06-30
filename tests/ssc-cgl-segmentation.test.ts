import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_segment_questions.py");

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

test("SSC CGL segmentation recovers English cloze-set blanks from uploaded books", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-cloze-segment-"));
  const textPath = path.join(tempRoot, "page-320.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Pinnacle SSC English",
    "",
    "# **SET 80. Q(456-460) SSC CPO 24/11/2020(Evening)**",
    "",
    "Alfred Hitchcock was a man with vivid imagination, (456)_____ skills and a passion for life.",
    "With his (457)_____ style and God-gifted wit he produced and directed (458)_____ of the most thrilling films.",
    "",
    "456. (a) leading (b) original (c) clever (d) creative",
    "457. (a) separate (b) unique (c) dull (d) ordinary",
    "458. (a) some (b) any (c) more (d) much",
    "459. (a) through (b) by (c) with (d) of",
    "460. (a) influenced (b) attached (c) altered (d) determined",
    "",
    "# **Solution:-**",
    "",
    "# **SET 80**",
    "Sol:456.(d) Creative is the correct word."
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-english",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "cloze-test",
    chapterTitle: "Cloze Test",
    startPage: 320,
    endPage: 320,
    pageCount: 1,
    pages: [{ pageNumber: 320, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-english", "cloze-test-p320-p320", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 5);
  assert.equal(candidates[0]?.questionNumber, "456");
  assert.match(candidates[0]?.stem ?? "", /Blank 456/);
  assert.match(candidates[0]?.stem ?? "", /Alfred Hitchcock/);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), ["leading", "original", "clever", "creative"]);
});

test("SSC CGL segmentation splits compact cloze rows when OCR glues the next blank number", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-compact-cloze-"));
  const textPath = path.join(tempRoot, "page-309.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Cloze Test",
    "",
    "### SET 49. Q(271-280) SSC CGL Tier II 15/11/2020",
    "",
    "Temptations of one kind or another lure everyone. The important thing is (271)_____ them from gaining a foothold in our (272)_____. As soon as we detect the first (273)_____ of temptation.",
    "",
    "271. (a) to preventing (b) prevent",
    "(c) to prevent (d) prevented272. (a) Souls (b) Minds (c) Bodies (d) Eyes",
    "",
    "273. (a) Codes (b) Messages (c) Signs (d) symbols274. (a) turn (b) change (c) twist (d) revolve",
    "275. (a) If (b) Whether (c) Unless (d) Until276. (a) feeble (b) weak (c) burly (d) strong",
    "277. (a) Amount (b) Amounted (c) Amounts (d) Amounting278. (a) object (b) item (c) thing (d) track",
    "279. (a) instead of (b) incase of (c) despite (d) because of280. (a) Might (b) could (c) should (d) would",
    "",
    "# **Solution:-**"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-english",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "cloze-test",
    chapterTitle: "Cloze Test",
    startPage: 309,
    endPage: 309,
    pageCount: 1,
    pages: [{ pageNumber: 309, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-english", "cloze-test-p309-p309", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.deepEqual(candidates.map((candidate) => candidate.questionNumber), ["271", "272", "273", "274", "275", "276", "277", "278", "279", "280"]);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), ["to preventing", "prevent", "to prevent", "prevented"]);
  assert.deepEqual(candidates[1]?.options.map((option) => option.text), ["Souls", "Minds", "Bodies", "Eyes"]);
  assert.deepEqual(candidates[2]?.options.map((option) => option.text), ["Codes", "Messages", "Signs", "symbols"]);
  assert.deepEqual(candidates[9]?.options.map((option) => option.text), ["Might", "could", "should", "would"]);
});

test("SSC CGL segmentation keeps English book questions when bold Q markers omit number delimiters", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-q-marker-segment-"));
  const textPath = path.join(tempRoot, "page-258.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Pinnacle SSC English",
    "",
    "**Q.106** Everything happened so quickly ______ she felt dazed. SSC CGL Tier II - 18/11/2020",
    "(a) that (b) then (c) than (d) since",
    "**Q.107** The hall was spacious ______ to accommodate all the guests. SSC CGL Tier II - 18/11/2020",
    "(a) also (b) enough (c) rather (d) fairly",
    "**Q28** A _____ speech is certainly more effective than one which is verbose. SSC CGL- 11/6/2019 (Noon)",
    "(a) laconic (b) sullen (c) lengthy (d) surly",
    "",
    "**Solution:-**",
    "**Sol:106.(a)** So quickly that is the correct structure."
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-english",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "fill-in-the-blanks",
    chapterTitle: "Fill in the blanks",
    startPage: 258,
    endPage: 258,
    pageCount: 1,
    pages: [{ pageNumber: 258, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-english", "fill-in-the-blanks-p258-p258", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.deepEqual(candidates.map((candidate) => candidate.questionNumber), ["106", "107", "28"]);
  assert.match(candidates[0]?.stem ?? "", /quickly/);
  assert.deepEqual(candidates[1]?.options.map((option) => option.text), ["also", "enough", "rather", "fairly"]);
  assert.deepEqual(candidates[2]?.options.map((option) => option.text), ["laconic", "sullen", "lengthy", "surly"]);
});

test("SSC CGL segmentation keeps image-heavy reasoning questions with OCR option labels", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-segment-"));
  const textPath = path.join(tempRoot, "page-260.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Pinnacle",
    "Embedded Figure",
    "",
    "Q.97.",
    "",
    "![img-235.jpeg](img-235.jpeg)",
    "",
    "(a)",
    "",
    "(b)",
    "",
    "(c)",
    "",
    "(d)",
    "",
    "Q.98.",
    "",
    "![img-238.jpeg](img-238.jpeg)",
    "",
    "TG @Exams_Pdfss",
    "",
    "Search on TG @SSC_PINNACLEE"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "embedded-figure",
    chapterTitle: "Embedded Figure",
    startPage: 260,
    endPage: 260,
    pageCount: 1,
    pages: [{ pageNumber: 260, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "embedded-figure-p260-p260", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 2);
  assert.equal(candidates[0]?.questionNumber, "97");
  assert.match(candidates[0]?.stem ?? "", /img-235/);
  assert.deepEqual(candidates[0]?.options.map((option) => option.id), ["a", "b", "c", "d"]);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), [
    "Option A (see figure)",
    "Option B (see figure)",
    "Option C (see figure)",
    "Option D (see figure)"
  ]);
  assert.equal(candidates[1]?.questionNumber, "98");
  assert.match(candidates[1]?.stem ?? "", /img-238/);
  assert.ok(candidates[1]?.options.every((option) => /see figure/.test(option.text)));
});

test("SSC CGL segmentation keeps figure-option reasoning questions when OCR drops images", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-figure-labels-"));
  const textPath = path.join(tempRoot, "page-254.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Embedded Figure",
    "",
    "Q.22. Select the option figure which is embedded in the given figure.",
    "",
    "(a)",
    "",
    "(b)",
    "",
    "(c)",
    "",
    "(d)"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "embedded-figure",
    chapterTitle: "Embedded Figure",
    startPage: 254,
    endPage: 254,
    pageCount: 1,
    pages: [{ pageNumber: 254, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "embedded-figure-p254-p254", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0]?.questionNumber, "22");
  assert.match(candidates[0]?.stem ?? "", /embedded in the given figure/i);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), [
    "Option A (see figure)",
    "Option B (see figure)",
    "Option C (see figure)",
    "Option D (see figure)"
  ]);
});

test("SSC CGL segmentation keeps inline OCR book questions after previous options", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-inline-"));
  const textPath = path.join(tempRoot, "page-51.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Pinnacle Reasoning CH, EJ, GL, ? SSC CGL 23/09/2025 (Shift 2) (a) KN (b) IM (c) JM (d) IN **Q.171.** Complete the series. 7, 15, 31, 63, ? SSC CGL 23/09/2025 (Shift 2) (a) 125 (b) 126 (c) 127 (d) 128 **Q.172.** What should come at the place of question mark ?: 63, 127, 255, 511, 1023, ? SSC CGL 23/09/2025 (Shift 2) (a) 2047 (b) 2095 (c) 2147 (d) 2067"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "series",
    chapterTitle: "Series",
    startPage: 51,
    endPage: 51,
    pageCount: 1,
    pages: [{ pageNumber: 51, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "series-p051-p051", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 2);
  assert.deepEqual(candidates.map((candidate) => candidate.questionNumber), ["171", "172"]);
  assert.match(candidates[0]?.stem ?? "", /Complete the series/);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), ["125", "126", "127", "128"]);
  assert.match(candidates[1]?.stem ?? "", /63, 127, 255/);
  assert.deepEqual(candidates[1]?.options.map((option) => option.text), ["2047", "2095", "2147", "2067"]);
});

test("SSC CGL segmentation keeps label-only non-verbal reasoning OCR blocks", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-label-only-"));
  const textPath = path.join(tempRoot, "page-264.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Q.154.",
    "",
    "(a)",
    "",
    "(b)",
    "",
    "(c)",
    "",
    "(d)"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "non-verbal",
    chapterTitle: "Non-Verbal Reasoning",
    startPage: 264,
    endPage: 264,
    pageCount: 1,
    pages: [{ pageNumber: 264, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "non-verbal-p264-p264", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0]?.questionNumber, "154");
  assert.match(candidates[0]?.stem ?? "", /non-verbal figure question/i);
  assert.deepEqual(candidates[0]?.options.map((option) => option.text), [
    "Option A (see figure)",
    "Option B (see figure)",
    "Option C (see figure)",
    "Option D (see figure)"
  ]);
});

test("SSC CGL segmentation keeps image-option blocks when the first label follows a bare question marker", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-image-options-"));
  const textPath = path.join(tempRoot, "page-266.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Q.188.",
    "",
    "(a)",
    "![img-392.jpeg](img-392.jpeg)",
    "",
    "(b)",
    "![img-393.jpeg](img-393.jpeg)",
    "",
    "(c)",
    "![img-394.jpeg](img-394.jpeg)",
    "",
    "(d)",
    "![img-395.jpeg](img-395.jpeg)"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "non-verbal",
    chapterTitle: "Non-Verbal Reasoning",
    startPage: 266,
    endPage: 266,
    pageCount: 1,
    pages: [{ pageNumber: 266, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "non-verbal-p266-p266", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0]?.questionNumber, "188");
  assert.match(candidates[0]?.stem ?? "", /correct option from the figure/i);
  assert.deepEqual(candidates[0]?.options.map((option) => option.id), ["a", "b", "c", "d"]);
  assert.ok(candidates[0]?.options.every((option) => /img-\d+\.jpeg/.test(option.text)));
});

test("SSC CGL segmentation adds readable prompts to image-only reasoning stems", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-image-stem-"));
  const textPath = path.join(tempRoot, "page-266.txt");
  const reportPath = path.join(tempRoot, "extraction-report.json");
  const outputRoot = path.join(tempRoot, "segments");

  writeText(textPath, [
    "Q.186.",
    "![img-384.jpeg](img-384.jpeg) (X)",
    "",
    "(a)",
    "![img-385.jpeg](img-385.jpeg)",
    "",
    "(b)",
    "![img-386.jpeg](img-386.jpeg)",
    "",
    "(c)",
    "![img-387.jpeg](img-387.jpeg)",
    "",
    "(d)",
    "![img-388.jpeg](img-388.jpeg)"
  ].join("\n"));
  writeJson(reportPath, {
    sourceId: "pinnacle-ssc-reasoning",
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "non-verbal",
    chapterTitle: "Non-Verbal Reasoning",
    startPage: 266,
    endPage: 266,
    pageCount: 1,
    pages: [{ pageNumber: 266, textPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--extraction-report",
    reportPath,
    "--output-root",
    outputRoot
  ], { cwd: root, stdio: "pipe" });

  const candidatesPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "non-verbal-p266-p266", "question-candidates.json");
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(candidates.length, 1);
  assert.match(candidates[0]?.stem ?? "", /Select the correct option from the figure/i);
  assert.match(candidates[0]?.stem ?? "", /img-384/);
});
