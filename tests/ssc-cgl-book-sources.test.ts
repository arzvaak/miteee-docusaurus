import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";
import { getSscCglBookQuestionsPath } from "@/lib/ssc-cgl-corpus-paths";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_book_inventory.py");
const uploadedBooksRoot = process.env.SSC_CGL_BOOKS_ROOT ?? "G:\\SSC BOOKS";

type MinimalBookQuestion = {
  section?: string;
  topic?: string;
  stem?: string;
  options?: Array<{ text?: string }>;
  correctOption?: string;
};

function normalizedMcqBody(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueMcqBodyCount(questions: MinimalBookQuestion[]) {
  const bodies = new Set<string>();

  for (const question of questions) {
    bodies.add([
      question.section ?? "",
      question.topic ?? "",
      normalizedMcqBody(question.stem ?? ""),
      ...(question.options ?? []).map((option) => normalizedMcqBody(option.text ?? ""))
    ].join("\u0001"));
  }

  return bodies.size;
}

test("SSC CGL uploaded books are registered as the authoritative book corpus", { skip: !fs.existsSync(uploadedBooksRoot) }, () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-books-"));
  const manifestPath = path.join(tempRoot, "book-sources.json");
  const queuePath = path.join(tempRoot, "book-ocr-queue.json");

  execFileSync("python", [
    scriptPath,
    "--books-root", uploadedBooksRoot,
    "--manifest-path", manifestPath,
    "--queue-path", queuePath
  ], { cwd: root, stdio: "pipe" });

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    corpusPolicy: { replaceExistingMcqs: boolean; oldCorpusStatus: string };
    sources: Array<{
      id: string;
      sourceType: string;
      role: string;
      section: string | null;
      purpose: string;
      sourceFormat: string;
      file: string;
      pageCount: number;
      textExtractablePagesSampled: number;
      ocrModel: string;
      includeImages: boolean;
    }>;
  };
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8")) as {
    model: string;
    includeImages: boolean;
    jobs: Array<{ sourceId: string; startPage: number; endPage: number; purpose: string; status: string }>;
  };

  assert.equal(manifest.corpusPolicy.replaceExistingMcqs, true);
  assert.equal(manifest.corpusPolicy.oldCorpusStatus, "disabled");
  assert.equal(manifest.sources.length, 5);
  assert.ok(manifest.sources.every((source) => source.sourceType === "book_user_provided"));
  assert.ok(manifest.sources.every((source) => fs.existsSync(source.file)));
  assert.ok(manifest.sources.every((source) => source.pageCount > 0));
  assert.ok(manifest.sources.every((source) => source.ocrModel === "mistral-ocr-latest"));
  assert.ok(manifest.sources.every((source) => source.includeImages === true));
  assert.ok(manifest.sources.some((source) => source.id === "lucent-gk-english" && source.role === "static_gk_reference"));
  assert.ok(!manifest.sources.some((source) => /compressed\.pdf$/i.test(source.file)));
  const reasoning = manifest.sources.find((source) => source.id === "pinnacle-ssc-reasoning");
  assert.equal(reasoning?.section, "reasoning");
  assert.equal(reasoning?.purpose, "html_asset_extraction");
  assert.equal(reasoning?.sourceFormat, "scribd_html");
  assert.match(reasoning?.file ?? "", /PINNACLE SSC REASONING\.htm$/);
  assert.ok((reasoning?.pageCount ?? 0) >= 500);
  assert.ok(manifest.sources.some((source) => source.id === "ssc-maths-6800-mcq" && source.section === "quantitative-aptitude"));

  assert.equal(queue.model, "mistral-ocr-latest");
  assert.equal(queue.includeImages, true);
  assert.ok(queue.jobs.length >= 5);
  assert.ok(queue.jobs.every((job) => job.status === "queued"));
  assert.ok(queue.jobs.some((job) => job.sourceId === "lucent-gk-english" && job.purpose === "deepseek_static_gk_reference"));
  assert.ok(queue.jobs.some((job) => job.sourceId === "ssc-maths-6800-mcq" && job.purpose === "mcq_extraction"));
  assert.ok(queue.jobs.some((job) => job.sourceId === "pinnacle-ssc-reasoning" && job.purpose === "html_asset_extraction"));
});

test("SSC CGL build uses uploaded books plus marked 200/200 gap-repair practice", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-only-build-"));
  const result = buildExamData({ generatedRoot: path.join(tempRoot, "generated") });
  const promotedQuestions = JSON.parse(fs.readFileSync(getSscCglBookQuestionsPath(root), "utf8")) as MinimalBookQuestion[];
  const bookQuestions = result.data.questions.filter((question) => question.provenance.sourceType === "book_user_provided");
  const gapRepairQuestions = result.data.questions.filter((question) => question.provenance.sourceType === "original_practice");
  const uniquePromotedBookBodies = uniqueMcqBodyCount(promotedQuestions);
  const excludedBrokenBookFragments = uniquePromotedBookBodies - bookQuestions.length;

  assert.equal(result.validation.ok, true, result.validation.errors.join("\n"));
  assert.ok(bookQuestions.length > 22_000, "the reviewed uploaded-book corpus should remain the dominant practice source");
  assert.ok(promotedQuestions.length > uniquePromotedBookBodies, "conflicting duplicate book rows should be excluded before ranked practice");
  assert.ok(excludedBrokenBookFragments > 0 && excludedBrokenBookFragments <= 50, "only the small quarantined set of broken source-layout fragments should stay out of tests");
  assert.ok(gapRepairQuestions.length > 0, "topic-depth repair rows should be present and explicitly marked");
  assert.equal(result.data.questions.length, bookQuestions.length + gapRepairQuestions.length);
  assert.deepEqual(
    [...new Set(result.data.questions.map((question) => question.section))].sort(),
    ["english-comprehension", "general-awareness", "quantitative-aptitude", "reasoning"].sort()
  );
  assert.equal(result.data.questions.filter((question) => question.provenance.sourceType === "web_pdf_unverified").length, 0);
  assert.ok(result.data.tests.every((practiceTest) => practiceTest.questionIds.length > 0));
  assert.ok(result.data.topics.length >= 40);
});
