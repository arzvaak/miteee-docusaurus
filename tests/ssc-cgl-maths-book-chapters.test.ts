import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const chapterPlanPath = path.join(
  process.cwd(),
  "data",
  "exams",
  "ssc-cgl",
  "book-sources",
  "ssc-maths-6800-chapters.json"
);
const importProgressPath = path.join(
  process.cwd(),
  "data",
  "exams",
  "ssc-cgl",
  "book-sources",
  "ssc-maths-6800-import-progress.json"
);

type PageRange = [number, number];

type MathsChapter = {
  chapterNumber: number;
  slug: string;
  title: string;
  questionCount: number;
  conceptPrintedPages: PageRange;
  questionPrintedPages: PageRange;
  answerKeyPrintedPages: PageRange;
  solutionPrintedPages: PageRange;
};

type MathsChapterPlan = {
  sourceId: string;
  printedToPdfPageOffset: number;
  totalQuestionsListed: number;
  supplementalQuestionSources: Array<{
    title: string;
    questionCount: number;
    sourceId?: string;
    qrDecodedUrl?: string;
    downloadPath?: string;
    sha256?: string;
    status: string;
  }>;
  chapters: MathsChapter[];
};

function loadPlan(): MathsChapterPlan {
  return JSON.parse(fs.readFileSync(chapterPlanPath, "utf8")) as MathsChapterPlan;
}

test("SSC Maths 6800 chapter plan covers the full uploaded Maths book index", () => {
  const plan = loadPlan();
  const chapterQuestions = plan.chapters.reduce((sum, chapter) => sum + chapter.questionCount, 0);
  const supplementalQuestions = plan.supplementalQuestionSources.reduce((sum, source) => sum + source.questionCount, 0);

  assert.equal(plan.sourceId, "ssc-maths-6800-mcq");
  assert.equal(plan.printedToPdfPageOffset, 10);
  assert.equal(plan.chapters.length, 27);
  assert.equal(chapterQuestions, 6472);
  assert.equal(supplementalQuestions, 368);
  assert.equal(chapterQuestions + supplementalQuestions, plan.totalQuestionsListed);
  assert.equal(plan.totalQuestionsListed, 6840);
  assert.equal(plan.supplementalQuestionSources[0]?.sourceId, "pinnacle-maths-6800-di-qr-english");
  assert.equal(plan.supplementalQuestionSources[0]?.qrDecodedUrl, "https://ssccglpinnacle.com/blog/qr-codes");
  assert.equal(plan.supplementalQuestionSources[0]?.status, "downloaded_text_extractable_pending_segmentation");
  assert.match(plan.supplementalQuestionSources[0]?.downloadPath ?? "", /pinnacle-maths-6800-data-interpretation-qr-english\.pdf$/);
  assert.equal(plan.supplementalQuestionSources[0]?.sha256, "834e290118ce7c9973dffeadef4f870eb0a97c9d6b11c79e64e27ab6b681d4af");
});

test("SSC Maths 6800 chapter ranges are ordered and extractable as PDF ranges", () => {
  const plan = loadPlan();

  for (const [index, chapter] of plan.chapters.entries()) {
    assert.equal(chapter.chapterNumber, index + 1);
    assert.ok(chapter.slug.length > 0);
    assert.ok(chapter.title.length > 0);
    assert.ok(chapter.questionCount > 0);
    assert.ok(chapter.conceptPrintedPages[0] <= chapter.conceptPrintedPages[1]);
    assert.ok(chapter.questionPrintedPages[0] <= chapter.questionPrintedPages[1]);
    assert.ok(chapter.answerKeyPrintedPages[0] <= chapter.answerKeyPrintedPages[1]);
    assert.ok(chapter.solutionPrintedPages[0] <= chapter.solutionPrintedPages[1]);
    assert.ok(chapter.conceptPrintedPages[0] <= chapter.questionPrintedPages[0]);
    assert.ok(chapter.questionPrintedPages[0] <= chapter.answerKeyPrintedPages[1]);
    assert.ok(chapter.answerKeyPrintedPages[0] <= chapter.solutionPrintedPages[1]);
    assert.ok(chapter.solutionPrintedPages[1] <= 628);

    const pdfQuestionStart = chapter.questionPrintedPages[0] + plan.printedToPdfPageOffset;
    const pdfQuestionEnd = chapter.questionPrintedPages[1] + plan.printedToPdfPageOffset;
    assert.ok(pdfQuestionStart >= 11);
    assert.ok(pdfQuestionEnd <= 638);
  }
});

test("SSC Maths 6800 chapter plan pins known high-yield extraction ranges", () => {
  const plan = loadPlan();
  const bySlug = new Map(plan.chapters.map((chapter) => [chapter.slug, chapter]));

  assert.deepEqual(bySlug.get("number-system")?.questionPrintedPages, [3, 12]);
  assert.deepEqual(bySlug.get("hcf-and-lcm")?.questionPrintedPages, [27, 30]);
  assert.deepEqual(bySlug.get("simplification")?.questionPrintedPages, [36, 41]);
  assert.deepEqual(bySlug.get("trigonometry")?.questionPrintedPages, [50, 66]);
  assert.deepEqual(bySlug.get("height-and-distance")?.questionPrintedPages, [97, 100]);
  assert.deepEqual(bySlug.get("mensuration")?.questionPrintedPages, [109, 137]);
  assert.deepEqual(bySlug.get("geometry")?.questionPrintedPages, [177, 200]);
  assert.deepEqual(bySlug.get("algebra")?.questionPrintedPages, [242, 259]);
  assert.deepEqual(bySlug.get("ratio-and-proportion")?.questionPrintedPages, [291, 301]);
  assert.deepEqual(bySlug.get("work-and-time")?.questionPrintedPages, [335, 347]);
  assert.deepEqual(bySlug.get("time-speed-and-distance")?.questionPrintedPages, [377, 393]);
  assert.deepEqual(bySlug.get("percentage")?.questionPrintedPages, [430, 447]);
  assert.deepEqual(bySlug.get("profit-and-loss")?.questionPrintedPages, [467, 483]);
  assert.deepEqual(bySlug.get("average")?.questionPrintedPages, [572, 585]);
  assert.deepEqual(bySlug.get("probability")?.questionPrintedPages, [622, 625]);
});

test("SSC Maths 6800 import progress counts only active review-only chunks", () => {
  const progress = JSON.parse(fs.readFileSync(importProgressPath, "utf8")) as {
    activeChunks: Array<{ slug: string; candidateCount: number; rankedEligible: boolean }>;
    supersededChunks: Array<{ slug: string; ignoreForActiveScans?: boolean }>;
    totals: {
      activeChunks: number;
      activeCandidates: number;
      agentAnswerConsensus: number;
      agentReviewAccepted: number;
      rankedEligibleQuestions: number;
    };
  };
  const activeCandidateCount = progress.activeChunks.reduce((sum, chunk) => sum + chunk.candidateCount, 0);
  const segmentsRoot = path.join(
    process.cwd(),
    "data",
    "exams",
    "ssc-cgl",
    "book-segments",
    "ssc-maths-6800-mcq"
  );

  assert.equal(progress.activeChunks.length, progress.totals.activeChunks);
  assert.equal(activeCandidateCount, progress.totals.activeCandidates);
  if (fs.existsSync(segmentsRoot)) {
    for (const chunk of progress.activeChunks) {
      const candidatesPath = path.join(segmentsRoot, chunk.slug, "question-candidates.json");
      const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{ id: string }>;
      assert.equal(candidates.length, chunk.candidateCount);
    }
  } else {
    const gitignore = fs.readFileSync(path.join(process.cwd(), ".gitignore"), "utf8");
    assert.match(gitignore, /data\/exams\/ssc-cgl\/book-segments\//);
  }
  assert.equal(progress.activeChunks.length, 27);
  assert.equal(progress.totals.activeCandidates, 5563);
  assert.equal(progress.totals.agentAnswerConsensus, 88);
  assert.equal(progress.totals.agentReviewAccepted, 173);
  assert.equal(progress.totals.rankedEligibleQuestions, 86);
  assert.ok(progress.activeChunks.some((chunk) => chunk.rankedEligible === true));
  assert.ok(progress.activeChunks.some((chunk) => chunk.rankedEligible === false));
  assert.ok(progress.supersededChunks.some((chunk) => chunk.slug === "number-system-p011-p035"));
  assert.ok(progress.supersededChunks.some((chunk) => chunk.slug === "probability-p632-p635"));
  assert.ok(progress.supersededChunks.every((chunk) => chunk.ignoreForActiveScans === true));
});

test("SSC Maths 6800 active imports are protected from superseded duplicate IDs", () => {
  const progress = JSON.parse(fs.readFileSync(importProgressPath, "utf8")) as {
    activeChunks: Array<{ slug: string }>;
    supersededChunks: Array<{ slug: string; ignoreForActiveScans?: boolean }>;
  };
  const segmentsRoot = path.join(
    process.cwd(),
    "data",
    "exams",
    "ssc-cgl",
    "book-segments",
    "ssc-maths-6800-mcq"
  );
  const activeIds = new Map<string, string>();

  if (fs.existsSync(segmentsRoot)) {
    for (const chunk of progress.activeChunks) {
      const candidatesPath = path.join(segmentsRoot, chunk.slug, "question-candidates.json");
      const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{ id: string }>;

      for (const candidate of candidates) {
        const previousChunk = activeIds.get(candidate.id);
        assert.equal(previousChunk, undefined, `${candidate.id} appears in both ${previousChunk} and ${chunk.slug}`);
        activeIds.set(candidate.id, chunk.slug);
      }
    }
  }

  let overlappingSupersededIds = 0;
  for (const chunk of progress.supersededChunks) {
    assert.equal(chunk.ignoreForActiveScans, true, `${chunk.slug} must be ignored by active filesystem scans`);
    const candidatesPath = path.join(segmentsRoot, chunk.slug, "question-candidates.json");
    if (!fs.existsSync(candidatesPath)) continue;
    const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as Array<{ id: string }>;
    const overlappingIds = candidates.filter((candidate) => activeIds.has(candidate.id));
    overlappingSupersededIds += overlappingIds.length;
  }
  if (fs.existsSync(segmentsRoot)) {
    assert.ok(overlappingSupersededIds > 0, "at least one superseded folder records the original duplicate-ID overlap risk");
  } else {
    assert.ok(progress.supersededChunks.length > 0, "superseded chunk metadata records the duplicate-ID overlap risk after segment folders are externalized");
  }
});
