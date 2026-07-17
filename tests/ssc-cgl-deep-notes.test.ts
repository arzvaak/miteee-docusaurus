import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getSscCglBookQuestionsPath } from "@/lib/ssc-cgl-corpus-paths";
import { getSscTopics } from "@/lib/ssc-cgl";

const root = process.cwd();
const blueprintScriptPath = path.join(root, "scripts", "ssc_cgl_book_corpus_blueprint.py");
const noteAuthorScriptPath = path.join(root, "scripts", "ssc_cgl_deepseek_note_author.py");

function collectMarkdown(root: string): string[] {
  const absoluteRoot = path.join(process.cwd(), root);
  const output: string[] = [];
  for (const entry of fs.readdirSync(absoluteRoot, { withFileTypes: true })) {
    const fullPath = path.join(absoluteRoot, entry.name);
    if (entry.isDirectory()) output.push(...collectMarkdown(path.join(root, entry.name)));
    if (entry.isFile() && entry.name.endsWith(".md")) output.push(fullPath);
  }
  return output;
}

const sectionNoteFolders: Record<string, string> = {
  reasoning: "reasoning",
  "general-awareness": "ga",
  "quantitative-aptitude": "quant",
  "english-comprehension": "english"
};

test("SSC CGL deep notes cover every Tier-I subject with 200/200 artifacts", () => {
  const files = collectMarkdown("docs/ssc-cgl");
  const combined = files.map((file) => fs.readFileSync(file, "utf8")).join("\n\n");

  assert.ok(files.length >= 10, `expected at least 10 SSC CGL notes, got ${files.length}`);
  for (const subject of ["Reasoning", "General Awareness", "Quantitative[ -]Aptitude", "English"]) {
    assert.match(combined, new RegExp(subject, "i"));
  }
  for (const phrase of ["200/200 Drill", "PYQ Link Queue", "Trap Table", "Flowchart", "Solved Example"]) {
    assert.match(combined, new RegExp(phrase.replace("/", "\\/"), "i"), `missing ${phrase}`);
  }
});

test("SSC CGL deep notes link study material back to generated exam routes", () => {
  const combined = collectMarkdown("docs/ssc-cgl")
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n\n");

  assert.match(combined, /\/exams\/ssc-cgl\/tests/);
  assert.match(combined, /\/exams\/ssc-cgl\/topics\/percentages/);
  assert.match(combined, /\/exams\/ssc-cgl\/topics\/grammar-error-spotting/);
  assert.match(combined, /\/exams\/ssc-cgl\/current-affairs/);
});

test("SSC CGL topic notes end with a direct next step into focused practice", () => {
  const missingPracticeClosers = getSscTopics()
    .map((topic) => {
      const notePath = path.join(
        root,
        "docs",
        "ssc-cgl",
        sectionNoteFolders[topic.section] ?? topic.section,
        `${topic.slug}.md`
      );
      const note = fs.readFileSync(notePath, "utf8");
      const tail = note.slice(-3500);
      const hasPracticeLink = tail.includes(`/exams/ssc-cgl/practice/${topic.slug}`);
      return {
        slug: topic.slug,
        hasClosingPractice:
          /Final Practice Queue|Practice Queue|Drill Queue/i.test(tail)
          || (hasPracticeLink && /^##\s+(?:\d+\.\s+)?(?:Mixed (?:Exam )?Practice|Mastery(?: Check)?)(?:\s+.*)?$/im.test(tail)),
        hasPracticeLink
      };
    })
    .filter((topic) => !topic.hasClosingPractice || !topic.hasPracticeLink);

  assert.deepEqual(missingPracticeClosers, []);
});

test("SSC CGL topic notes include their visual map assets", () => {
  const missingVisualMaps = getSscTopics()
    .map((topic) => {
      const notePath = path.join(
        root,
        "docs",
        "ssc-cgl",
        sectionNoteFolders[topic.section] ?? topic.section,
        `${topic.slug}.md`
      );
      const imagePath = `/img/ssc-cgl/${topic.slug}-map.svg`;
      const assetPath = path.join(root, "public", "img", "ssc-cgl", `${topic.slug}-map.svg`);
      const note = fs.readFileSync(notePath, "utf8");

      return {
        slug: topic.slug,
        hasImageReference: note.includes(imagePath),
        assetExists: fs.existsSync(assetPath)
      };
    })
    .filter((topic) => !topic.hasImageReference || !topic.assetExists);

  assert.deepEqual(missingVisualMaps, []);
});

test("SSC CGL book-PYQ corpus blueprint summarizes promoted books by section and topic", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-blueprint-"));
  const outputJson = path.join(tempRoot, "corpus-blueprint.json");
  const outputMd = path.join(tempRoot, "book-corpus-blueprint.md");

  execFileSync("python", [
    blueprintScriptPath,
    "--questions-path",
    getSscCglBookQuestionsPath(root),
    "--output-json",
    outputJson,
    "--output-md",
    outputMd,
  ], { cwd: root, stdio: "pipe" });

  const blueprint = JSON.parse(fs.readFileSync(outputJson, "utf8")) as {
    totalQuestions: number;
    expectedQuestionCount: number;
    promotedDeficit: number;
    sourceType: string;
    sources: Array<{ sourceId: string; questionCount: number; expectedQuestionCount: number; promotedDeficit: number }>;
    sections: Array<{ section: string; questionCount: number; topicCount: number; fullSectionSets: number }>;
    topics: Array<{ slug: string; section: string; questionCount: number; notePriority: string }>;
  };
  const markdown = fs.readFileSync(outputMd, "utf8");

  assert.equal(blueprint.sourceType, "book_pyq_corpus");
  assert.ok(blueprint.totalQuestions >= 14000);
  assert.equal(
    blueprint.expectedQuestionCount,
    blueprint.sources.reduce((total, source) => total + source.expectedQuestionCount, 0)
  );
  assert.equal(blueprint.promotedDeficit, blueprint.expectedQuestionCount - blueprint.totalQuestions);
  assert.equal(blueprint.sources.length, 5);
  assert.ok(blueprint.sources.some((source) => (
    source.sourceId === "ssc-maths-6800-mcq"
    && source.expectedQuestionCount === 6472
    && source.promotedDeficit > 0
    && source.promotedDeficit < 200
  )));
  assert.ok(blueprint.sources.some((source) => (
    source.sourceId === "pinnacle-maths-6800-di-qr-english"
    && source.expectedQuestionCount === 368
    && source.questionCount === 328
    && source.promotedDeficit === 40
  )));
  assert.ok(blueprint.sources.some((source) => (
    source.sourceId === "pinnacle-ssc-reasoning"
    && source.questionCount === source.expectedQuestionCount
    && source.promotedDeficit === 0
  )));
  assert.deepEqual(blueprint.sections.map((section) => section.section).sort(), [
    "english-comprehension",
    "general-awareness",
    "quantitative-aptitude",
    "reasoning",
  ]);
  assert.ok(blueprint.sections.every((section) => section.fullSectionSets >= 1));
  assert.ok(blueprint.topics.some((topic) => topic.slug === "number-system" && topic.questionCount >= 600));
  assert.ok(blueprint.topics.some((topic) => topic.slug === "probability" && topic.notePriority === "200-200-coverage-gap"));
  assert.match(markdown, /Book PYQ Corpus Blueprint/);
  assert.match(markdown, /Expected indexed MCQs/);
  assert.match(markdown, /Recovery deficit/);
  assert.match(markdown, /36-second Quant/);
  assert.match(markdown, /200\/200 authoring priority/);
});

test("SSC CGL book-PYQ completeness audit treats missing indexed rows as recovery backlog", () => {
  const auditPath = path.join(root, "data", "exams", "ssc-cgl", "book-imports", "corpus-completeness-audit.json");
  execFileSync("python", [path.join(root, "scripts", "ssc_cgl_book_corpus_audit.py")], { cwd: root, stdio: "pipe" });

  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8")) as {
    policy: { dedupe: string; strictness: string };
    totals: {
      expectedQuestionCount: number;
      promotedQuestions: number;
      missingFromExpected: number;
      notSegmentedOrNotAligned: number;
      missingAnswerEvidence: number;
    };
    sources: Array<{ sourceId: string; missingFromExpected: number; notSegmentedOrNotAligned: number; missingAnswerEvidence: number }>;
  };

  assert.equal(
    audit.totals.expectedQuestionCount,
    audit.sources.reduce((total, source) => total + (source.missingFromExpected || 0), 0) + audit.totals.promotedQuestions
  );
  assert.equal(audit.totals.missingFromExpected, audit.totals.expectedQuestionCount - audit.totals.promotedQuestions);
  assert.match(audit.policy.dedupe, /exact 1:1 copies/i);
  assert.match(audit.policy.strictness, /recovery backlog/i);
  assert.ok(audit.totals.notSegmentedOrNotAligned > 0);
  assert.ok(audit.totals.missingAnswerEvidence > 0);
  assert.ok(audit.sources.some((source) => source.sourceId === "pinnacle-ssc-reasoning" && source.missingFromExpected === 0));
  assert.ok(audit.sources.some((source) => (
    source.sourceId === "ssc-maths-6800-mcq"
    && source.missingAnswerEvidence > 0
    && source.missingAnswerEvidence < 200
  )));
});

test("SSC CGL DeepSeek note dry run includes book-PYQ corpus blueprint context", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-note-blueprint-"));

  execFileSync("python", [
    noteAuthorScriptPath,
    "--topic",
    "percentages-ratio",
    "--audit-root",
    tempRoot,
    "--dry-run",
  ], { cwd: root, stdio: "pipe" });

  const prompt = fs.readFileSync(path.join(tempRoot, "percentages-ratio.deepseek-prompt.txt"), "utf8");

  assert.match(prompt, /Book PYQ corpus blueprint/i);
  assert.match(prompt, /ssc-maths-6800-mcq/i);
  assert.match(prompt, /quantitative-aptitude/i);
  assert.match(prompt, /Use source and PYQ metadata only to choose what deserves emphasis/i);
});
