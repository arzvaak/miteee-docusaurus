import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_200_200_readiness_audit.py");

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function structuredExplanation(answer = "A") {
  return [
    `Correct answer: ${answer} (fixture option).`,
    "Method: classify the SSC item type, apply the topic rule, and compare every option against that same route.",
    "Why it fits: the keyed option follows the reviewed fixture rule after the stem is classified correctly.",
    "Trap to avoid: do not choose from surface familiarity before verifying the full condition in the stem."
  ].join(" ");
}

function sourceCandidateMix() {
  return {
    candidates: [
      {
        id: "ssc-official",
        title: "SSC previous year question paper page",
        sourceType: "official_open",
        url: "https://ssc.gov.in/for-candidates/previous-year-question-paper",
        tags: ["official", "pyq", "paper"]
      },
      {
        id: "ssc-official-notice",
        title: "SSC CGL answer key notice",
        sourceType: "official_notice_metadata",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/example.pdf",
        tags: ["official", "cgl", "answer-key"]
      },
      {
        id: "web-pdf-lead",
        title: "SSC CGL PYQ PDF lead",
        sourceType: "web_pdf_unverified",
        url: "https://example.com/ssc-cgl-pyq.pdf",
        tags: ["pyq", "pdf", "review"]
      },
      {
        id: "scribd-reference",
        title: "Scribd SSC CGL reference search",
        sourceType: "copyright_risk_reference",
        url: "https://www.scribd.com/search?query=SSC%20CGL",
        tags: ["scribd", "book", "reference"]
      },
      {
        id: "pinnacle-book-reference",
        title: "Pinnacle SSC CGL book reference",
        sourceType: "copyright_risk_reference",
        url: "https://books.ssccglpinnacle.com/",
        tags: ["pinnacle", "book", "reference"]
      }
    ]
  };
}

function runPython(args: string[]) {
  const pythonCandidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

  for (const command of pythonCandidates) {
    const result = spawnSync(command, args, {
      cwd: root,
      encoding: "utf8"
    });
    if (result.error) {
      const error = result.error as NodeJS.ErrnoException;
      if (error.code === "ENOENT") continue;
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `${command} exited with ${result.status}`);
    }
    return;
  }

  throw new Error("Python interpreter not found for SSC CGL readiness audit test.");
}

function runAudit(tempRoot: string) {
  const outputPath = path.join(tempRoot, "audit.json");
  const reportPath = path.join(tempRoot, "audit.md");
  runPython([
    scriptPath,
    "--questions-path", path.join(tempRoot, "questions.json"),
    "--docs-root", path.join(tempRoot, "docs"),
    "--topic-rules-path", path.join(tempRoot, "topic-rules.json"),
    "--book-completeness-path", path.join(tempRoot, "corpus-completeness-audit.json"),
    "--ocr-progress-path", path.join(tempRoot, "mistral-ocr-import-progress.json"),
    "--resource-candidates-path", path.join(tempRoot, "resource-candidates.json"),
    "--pyq-backlog-path", path.join(tempRoot, "pyq-source-backlog.json"),
    "--current-affairs-root", path.join(tempRoot, "current-affairs"),
    "--generated-exam-data-path", path.join(tempRoot, "generated-ssc-cgl-index.json"),
    "--output-path", outputPath,
    "--report-path", reportPath
  ]);
  const audit = JSON.parse(fs.readFileSync(outputPath, "utf8")) as {
    readyFor200: boolean;
    gates: Array<{ id: string; status: "pass" | "fail"; evidence: string }>;
    corpus: { segmentedCandidates: number; answerEvidenceRows: number; missingAnswerEvidence: number };
    learnerPractice: {
      usesGeneratedExamData: boolean;
      reviewedQuestions: number;
      gapRepairQuestions: number;
      minimumReviewedPerTopic: number;
    };
    topics: {
      total: number;
      ready: number;
      notReady: number;
      microTypeCoverage: { topicsReady: number; topicsWithGaps: number };
      visualAssetCoverage?: { topicsWithVisuals: number; topicsMissingVisuals: number; missing: string[] };
      weakest: Array<{
        slug: string;
        reviewedQuestions: number;
        bookBackedQuestions: number;
        gaps: string[];
        hasVisualAsset?: boolean;
        visualAssets?: string[];
        missingVisualAssets?: string[];
        microTypes: { total: number; covered: number; missing: string[] };
      }>;
    };
    explanations: {
      reviewedQuestions: number;
      structuredQuestions: number;
      weakExplanations: number;
      genericShellExplanations: number;
    };
    resources: {
      candidates: number;
      rankedEligibleYears: number;
      officialPaperYears: number;
      bookPyqQuestionCount: number;
      sourceTypeCounts?: Record<string, number>;
      sourceLanes?: Record<string, number | boolean>;
      missingSourceLanes?: string[];
    };
    currentAffairs: { latestSummaryItems: number };
  };
  return { audit, report: fs.readFileSync(reportPath, "utf8") };
}

test("SSC CGL 200/200 readiness audit fails explicitly when corpus, notes, resources, or news are incomplete", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-readiness-audit-"));
  writeJson(path.join(tempRoot, "questions.json"), [
    {
      id: "q1",
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "percentages",
      subtopic: "Successive Percentage Change",
      explanation: structuredExplanation("A"),
      year: 2026,
      conceptTags: ["successive-change", "base-change"],
      provenance: { sourceId: "book-a", sourceType: "book_user_provided" }
    },
    {
      id: "q2",
      reviewStatus: "reviewed",
      section: "reasoning",
      topic: "direction-distance",
      stem: "Riya walked 90 m towards the north, took a right turn and walked 60 m, then turned left. What is her shortest distance from the starting point?",
      explanation: "Answer: D",
      year: 2026,
      provenance: { sourceId: "book-a", sourceType: "book_user_provided" }
    },
    {
      id: "q3",
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "percentages",
      subtopic: "pinnacle-ssc-maths-p0001-p0020",
      explanation: structuredExplanation("A"),
      year: 2026,
      conceptTags: ["percentages"],
      provenance: {
        sourceId: "book-a",
        sourceType: "book_user_provided",
        chapterSlug: "ocr-range-p0001-p0020",
        chapterTitle: "pinnacle-ssc-maths-p0001-p0020"
      }
    },
    {
      id: "q4",
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "number-system",
      subtopic: "Number System",
      stem: "Find the HCF and LCM of two numbers whose product is 864.",
      explanation: structuredExplanation("A"),
      year: 2026,
      conceptTags: ["number-system"],
      provenance: { sourceId: "book-a", sourceType: "book_user_provided", chapterSlug: "number-system" }
    },
    {
      id: "q5",
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "calculation-speed",
      subtopic: "Calculation Speed",
      stem: "Simplify the expression using BODMAS and indices.",
      explanation: structuredExplanation("A"),
      year: 2026,
      conceptTags: ["calculation-speed"],
      provenance: { sourceId: "book-a", sourceType: "book_user_provided", chapterSlug: "calculation-speed" }
    }
  ]);
  writeJson(path.join(tempRoot, "topic-rules.json"), {
    topics: [
      { topic: "percentages", section: "quantitative-aptitude" },
      { topic: "hcf-and-lcm", section: "quantitative-aptitude" },
      { topic: "simplification", section: "quantitative-aptitude" }
    ]
  });
  writeText(
    path.join(tempRoot, "docs", "ssc-cgl", "quant", "percentages.md"),
    "# Percentages\n\n**Example 1** Short note.\n"
  );
  writeJson(path.join(tempRoot, "corpus-completeness-audit.json"), {
    totals: { expectedQuestionCount: 10, promotedQuestions: 1, missingFromExpected: 9 }
  });
  writeJson(path.join(tempRoot, "resource-candidates.json"), { candidates: [] });
  writeJson(path.join(tempRoot, "pyq-source-backlog.json"), {
    totals: { rankedEligibleYears: 1, yearsWithOfficialPaper: 0 },
    years: [{ year: 2026 }]
  });
  writeJson(path.join(tempRoot, "current-affairs", "state.json"), {
    lastSuccessfulDate: null,
    totalRuns: 0,
    successfulRuns: 0
  });

  const { audit, report } = runAudit(tempRoot);

  assert.equal(audit.readyFor200, false);
  assert.match(report, /SSC CGL 200\/200 Readiness Repair Report/);
  assert.match(report, /type-system-coverage/);
  assert.match(report, /successive percentage change/);
  assert.match(report, /route tracing and shortest distance/);
  assert.doesNotMatch(report, /ocr range p0001 p0020|pinnacle ssc maths p0001 p0020/);
  assert.ok(audit.topics.total >= 4);
  assert.equal(audit.topics.ready, 0);
  assert.ok(audit.topics.weakest.some((topic) => topic.gaps.some((gap) => /49[0-9] reviewed questions/.test(gap))));
  assert.ok(audit.topics.weakest.some((topic) => topic.slug === "hcf-and-lcm" && topic.bookBackedQuestions === 1));
  assert.ok(audit.topics.weakest.some((topic) => topic.slug === "simplification" && topic.bookBackedQuestions === 1));
  assert.ok(audit.topics.microTypeCoverage.topicsWithGaps >= 2);
  assert.ok(audit.topics.weakest.some((topic) => topic.slug === "percentages" && topic.microTypes.missing.includes("successive percentage change")));
  assert.equal(audit.gates.find((gate) => gate.id === "type-system-coverage")?.status, "fail");
  assert.equal(audit.gates.find((gate) => gate.id === "visual-study-material")?.status, "fail");
  assert.equal(audit.gates.find((gate) => gate.id === "book-corpus-completeness")?.status, "fail");
  assert.equal(audit.gates.find((gate) => gate.id === "book-pyq-provenance")?.status, "pass");
  assert.equal(audit.gates.find((gate) => gate.id === "practice-explanations")?.status, "fail");
  assert.equal(audit.gates.find((gate) => gate.id === "source-manifest")?.status, "fail");
  assert.equal(audit.gates.find((gate) => gate.id === "current-affairs")?.status, "fail");
  assert.equal(audit.explanations.weakExplanations, 1);
  assert.ok(audit.topics.visualAssetCoverage);
  assert.ok(audit.topics.visualAssetCoverage!.topicsMissingVisuals >= 1);
  assert.ok(audit.topics.weakest.some((topic) => topic.slug === "percentages" && topic.gaps.includes("visual asset")));
});

test("SSC CGL 200/200 readiness audit records source/resource evidence when manifests exist", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-readiness-audit-pass-"));
  const questions = Array.from({ length: 22_000 }, (_, index) => ({
    id: `q${index}`,
    reviewStatus: "reviewed",
    section: "quantitative-aptitude",
    topic: "percentages",
    subtopic: index % 2 === 0 ? "Successive Percentage Change" : "Base Change",
    explanation: structuredExplanation("A"),
    conceptTags: index % 2 === 0 ? ["successive-change"] : ["base-change"],
    year: 1977 + (index % 50),
    provenance: {
      sourceId: "book-a",
      sourceType: "book_user_provided",
      chapterSlug: index % 2 === 0 ? "successive-percentage-change" : "base-change"
    }
  }));
  writeJson(path.join(tempRoot, "questions.json"), questions);
  writeJson(path.join(tempRoot, "topic-rules.json"), {
    topics: [{ topic: "percentages", section: "quantitative-aptitude" }]
  });
  writeText(
    path.join(tempRoot, "docs", "ssc-cgl", "quant", "percentages.md"),
    [
      "![Percentages visual map](/img/ssc-cgl/percentages-map.svg)",
      "# Percentages",
      "```mermaid",
      "flowchart TD",
      "```",
      "| Trap | Fix |",
      "| --- | --- |",
      "Successive percentage change and base change are the two micro-types in this corpus slice.",
      ...Array.from({ length: 20 }, (_, index) => `**Example ${index + 1}** Worked example.`),
      "## 200/200 Drill",
      "x".repeat(14_000)
    ].join("\n")
  );
  writeText(path.join(tempRoot, "public", "img", "ssc-cgl", "percentages-map.svg"), "<svg xmlns=\"http://www.w3.org/2000/svg\" />");
  writeJson(path.join(tempRoot, "corpus-completeness-audit.json"), {
    totals: { expectedQuestionCount: 22_000, promotedQuestions: 22_000, missingFromExpected: 0 }
  });
  writeJson(path.join(tempRoot, "mistral-ocr-import-progress.json"), {
    ocrProvider: "mistral",
    ocrModel: "mistral-ocr-latest",
    sources: [{
      sourceId: "book-a",
      segmentedCandidates: 505,
      ocrAnswerMatched: 22_000,
      ocrAnswerMissing: 5,
      promotedQuestions: 22_000
    }],
    totals: {
      segmentedCandidates: 505,
      ocrAnswerMatched: 22_000,
      ocrAnswerMissing: 5,
      promotedQuestions: 22_000
    }
  });
  writeJson(path.join(tempRoot, "resource-candidates.json"), sourceCandidateMix());
  writeJson(path.join(tempRoot, "pyq-source-backlog.json"), {
    totals: { rankedEligibleYears: 50, yearsWithOfficialPaper: 50 },
    years: Array.from({ length: 50 }, (_, index) => ({ year: 1977 + index }))
  });
  writeJson(path.join(tempRoot, "current-affairs", "state.json"), {
    lastSuccessfulDate: "2026-06-28",
    totalRuns: 1,
    successfulRuns: 1
  });
  writeJson(path.join(tempRoot, "current-affairs", "daily", "2026-06-28.json"), {
    items: [1, 2, 3, 4]
  });

  const { audit, report } = runAudit(tempRoot);

  assert.equal(audit.readyFor200, true);
  assert.match(report, /Ready for 200\/200: yes/);
  assert.match(report, /successive percentage change/);
  assert.equal(audit.gates.every((gate) => gate.status === "pass"), true);
  assert.equal(audit.gates.find((gate) => gate.id === "visual-study-material")?.status, "pass");
  assert.equal(audit.explanations.structuredQuestions, 22_000);
  assert.equal(audit.explanations.weakExplanations, 0);
  assert.equal(audit.topics.microTypeCoverage.topicsReady, 1);
  assert.equal(audit.topics.weakest[0]?.microTypes.total, 3);
  assert.equal(audit.topics.weakest[0]?.microTypes.covered, 3);
  assert.equal(audit.resources.candidates, 5);
  assert.equal(audit.resources.sourceLanes?.official, true);
  assert.equal(audit.resources.sourceLanes?.webPdf, true);
  assert.equal(audit.resources.sourceLanes?.scribdReference, true);
  assert.equal(audit.resources.sourceLanes?.bookReference, true);
  assert.deepEqual(audit.resources.missingSourceLanes, []);
  assert.equal(audit.resources.rankedEligibleYears, 50);
  assert.equal(audit.resources.officialPaperYears, 50);
  assert.equal(audit.resources.bookPyqQuestionCount, 22_000);
  assert.equal(audit.currentAffairs.latestSummaryItems, 4);
  assert.equal(audit.corpus.segmentedCandidates, 505);
  assert.equal(audit.corpus.answerEvidenceRows, 22_000);
  assert.equal(audit.corpus.missingAnswerEvidence, 5);
});

test("SSC CGL 200/200 readiness audit separates book corpus from supplemental topic drills", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-readiness-audit-generated-"));
  writeJson(path.join(tempRoot, "questions.json"), [
    {
      id: "book-q1",
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "percentages",
      subtopic: "Successive Percentage Change",
      explanation: structuredExplanation("A"),
      conceptTags: ["successive-change"],
      year: 2026,
      provenance: {
        sourceId: "book-a",
        sourceType: "book_user_provided",
        chapterSlug: "successive-percentage-change"
      }
    }
  ]);
  writeJson(path.join(tempRoot, "generated-ssc-cgl-index.json"), {
    questions: Array.from({ length: 500 }, (_, index) => ({
      id: index === 0 ? "book-q1" : `repair-q${index}`,
      reviewStatus: "reviewed",
      section: "quantitative-aptitude",
      topic: "percentages",
      subtopic: "Successive Percentage Change",
      explanation: structuredExplanation("A"),
      conceptTags: index === 0 ? ["successive-change"] : ["gap-repair", "200-200-coverage-gap"],
      year: 2026,
      provenance: index === 0
        ? {
          sourceId: "book-a",
          sourceType: "book_user_provided",
          chapterSlug: "successive-percentage-change"
        }
        : {
          sourceId: "repair",
          sourceType: "original_practice",
          chapterSlug: "successive-percentage-change"
        }
    }))
  });
  writeJson(path.join(tempRoot, "topic-rules.json"), {
    topics: [{ topic: "percentages", section: "quantitative-aptitude" }]
  });
  writeText(
    path.join(tempRoot, "docs", "ssc-cgl", "quant", "percentages.md"),
    [
      "![Percentages visual map](/img/ssc-cgl/percentages-map.svg)",
      "# Percentages",
      "```mermaid",
      "flowchart TD",
      "```",
      "| Trap | Fix |",
      "| --- | --- |",
      "Successive percentage change is the corpus micro-type for this generated supplemental-practice test.",
      ...Array.from({ length: 20 }, (_, index) => `**Example ${index + 1}** Worked example.`),
      "## 200/200 Drill",
      "x".repeat(14_000)
    ].join("\n")
  );
  writeText(path.join(tempRoot, "public", "img", "ssc-cgl", "percentages-map.svg"), "<svg xmlns=\"http://www.w3.org/2000/svg\" />");
  writeJson(path.join(tempRoot, "corpus-completeness-audit.json"), {
    totals: { expectedQuestionCount: 1, promotedQuestions: 1, missingFromExpected: 0 }
  });
  writeJson(path.join(tempRoot, "resource-candidates.json"), sourceCandidateMix());
  writeJson(path.join(tempRoot, "pyq-source-backlog.json"), {
    totals: { rankedEligibleYears: 50, yearsWithOfficialPaper: 0 },
    years: Array.from({ length: 50 }, (_, index) => ({ year: 1977 + index }))
  });
  writeJson(path.join(tempRoot, "current-affairs", "state.json"), {
    lastSuccessfulDate: "2026-06-28",
    totalRuns: 1,
    successfulRuns: 1
  });
  writeJson(path.join(tempRoot, "current-affairs", "daily", "2026-06-28.json"), {
    items: [1, 2, 3, 4]
  });

  const { audit, report } = runAudit(tempRoot);

  assert.equal(audit.gates.find((gate) => gate.id === "topic-mastery")?.status, "pass");
  assert.equal(audit.learnerPractice.usesGeneratedExamData, true);
  assert.equal(audit.learnerPractice.reviewedQuestions, 500);
  assert.equal(audit.learnerPractice.gapRepairQuestions, 499);
  assert.equal(audit.learnerPractice.minimumReviewedPerTopic, 500);
  assert.match(report, /Supplemental generated-data source present: yes/);
  assert.match(report, /Total app practice questions: 500/);
});

test("SSC CGL 200/200 readiness audit trusts generated app topics instead of re-normalizing them", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-readiness-audit-generated-topics-"));
  const generatedQuestions = Array.from({ length: 500 }, (_, index) => ({
    id: `generated-number-system-${index}`,
    reviewStatus: "reviewed",
    section: "quantitative-aptitude",
    topic: "number-system",
    subtopic: "Number System",
    stem: "Find the HCF and LCM of the given numbers in this number system drill.",
    explanation: structuredExplanation("A"),
    conceptTags: ["number-system"],
    year: 2026,
    provenance: {
      sourceId: "book-a",
      sourceType: "book_user_provided",
      chapterSlug: "number-system"
    }
  }));

  writeJson(path.join(tempRoot, "questions.json"), generatedQuestions.slice(0, 1));
  writeJson(path.join(tempRoot, "generated-ssc-cgl-index.json"), {
    questions: generatedQuestions
  });
  writeJson(path.join(tempRoot, "topic-rules.json"), {
    topics: [{ topic: "number-system", section: "quantitative-aptitude" }]
  });
  writeText(
    path.join(tempRoot, "docs", "ssc-cgl", "quant", "number-system.md"),
    [
      "![Number system visual map](/img/ssc-cgl/number-system-map.svg)",
      "# Number System",
      "```mermaid",
      "flowchart TD",
      "```",
      "| Trap | Fix |",
      "| --- | --- |",
      "Divisibility and remainder checks sit inside the number system topic even when a row mentions HCF or LCM.",
      ...Array.from({ length: 20 }, (_, index) => `**Example ${index + 1}** Worked example.`),
      "## 200/200 Drill",
      "x".repeat(14_000)
    ].join("\n")
  );
  writeText(path.join(tempRoot, "public", "img", "ssc-cgl", "number-system-map.svg"), "<svg xmlns=\"http://www.w3.org/2000/svg\" />");
  writeJson(path.join(tempRoot, "corpus-completeness-audit.json"), {
    totals: { expectedQuestionCount: 22_000, promotedQuestions: 22_000, missingFromExpected: 0 }
  });
  writeJson(path.join(tempRoot, "resource-candidates.json"), sourceCandidateMix());
  writeJson(path.join(tempRoot, "pyq-source-backlog.json"), {
    totals: { rankedEligibleYears: 50, yearsWithOfficialPaper: 0 },
    years: Array.from({ length: 50 }, (_, index) => ({ year: 1977 + index }))
  });
  writeJson(path.join(tempRoot, "current-affairs", "state.json"), {
    lastSuccessfulDate: "2026-06-28",
    totalRuns: 1,
    successfulRuns: 1
  });
  writeJson(path.join(tempRoot, "current-affairs", "daily", "2026-06-28.json"), {
    items: [1, 2, 3, 4]
  });

  const { audit } = runAudit(tempRoot);
  const numberSystemRow = audit.topics.weakest.find((topic) => topic.slug === "number-system");

  assert.equal(numberSystemRow?.reviewedQuestions, 500);
  assert.equal(audit.learnerPractice.minimumReviewedPerTopic, 500);
  assert.equal(audit.gates.find((gate) => gate.id === "topic-mastery")?.status, "pass");
});
