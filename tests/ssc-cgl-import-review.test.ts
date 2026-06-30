import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("SSC CGL source-library route exists but is not advertised on the learner dashboard", () => {
  const routePath = path.join(root, "app", "exams", "ssc-cgl", "import-review", "page.tsx");
  const routeSource = fs.readFileSync(routePath, "utf8");
  const dashboardSource = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "page.tsx"), "utf8");

  assert.ok(fs.existsSync(routePath), "import-review page route should exist");
  assert.doesNotMatch(dashboardSource, /\/exams\/ssc-cgl\/import-review/);
  assert.doesNotMatch(dashboardSource, /Import review|OCR\/PDF|review queue/i);
  assert.match(routeSource, /Source library/);
  assert.match(routeSource, /SSC CGL source evidence/);
  assert.match(routeSource, /book\/reference lanes/);
  assert.match(routeSource, /web PDF leads/);
  assert.match(routeSource, /Scribd lanes/);
  assert.match(routeSource, /curated years/);
  assert.match(routeSource, /ranked PYQs/);
  assert.match(routeSource, /Active uploaded-book corpus/);
  assert.match(routeSource, /Optional source-discovery leads/);
  assert.match(routeSource, /activeCorpus/);
  assert.match(routeSource, /sourceLibrary/);
  assert.match(routeSource, /Ranked corpus by year/);
  assert.match(routeSource, /full-mock ready/);
});

test("SSC CGL import-review loader avoids external corpus path discovery in the server route", () => {
  const loaderSource = fs.readFileSync(path.join(root, "lib", "ssc-cgl-import-review.ts"), "utf8");

  assert.doesNotMatch(loaderSource, /ssc-cgl-corpus-paths/);
  assert.doesNotMatch(loaderSource, /getSscCglBookImportFile|getSscCglBookQuestionsPath/);
});

test("SSC CGL import-review summarizes promoted corpus coverage by year and section", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-coverage-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  fs.mkdirSync(path.join(tempDataDir, "curated-imports"), { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-26T00:00:00+00:00",
    candidates: [
      {
        id: "balanced-source-2024",
        title: "Balanced promoted source 2024",
        url: "https://example.test/2024",
        sourceType: "user_provided",
        reviewStatus: "reviewed",
        tags: ["2024"]
      },
      {
        id: "incomplete-source-2022",
        title: "Incomplete promoted source 2022",
        url: "https://example.test/2022",
        sourceType: "user_provided",
        reviewStatus: "reviewed",
        tags: ["2022"]
      }
    ]
  }, null, 2) + "\n", "utf8");

  const sections = ["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"];
  const reviewedQuestions = [
    ...sections.flatMap((section) => Array.from({ length: 25 }, (_, index) => ({
      id: `q-2024-${section}-${index}`,
      year: 2024,
      section,
      reviewStatus: "reviewed",
      provenance: { sourceId: "balanced-source-2024" }
    }))),
    ...Array.from({ length: 40 }, (_, index) => ({
      id: `q-2022-${index}`,
      year: 2022,
      section: index < 20 ? "reasoning" : "general-awareness",
      reviewStatus: "reviewed",
      provenance: { sourceId: "incomplete-source-2022" }
    })),
    {
      id: "q-2025-draft",
      year: 2025,
      section: "reasoning",
      reviewStatus: "needs_review",
      provenance: { sourceId: "balanced-source-2024" }
    }
  ];
  fs.writeFileSync(path.join(tempDataDir, "curated-imports", "questions.json"), JSON.stringify(reviewedQuestions, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);

  assert.equal(dashboard.totals.curatedPromotedCandidates, 140);
  assert.equal(dashboard.corpusCoverage?.fullMockReadyYears, 1);
  assert.equal(dashboard.corpusCoverage?.years.length, 2);

  const y2024 = dashboard.corpusCoverage?.years.find((year) => year.year === 2024);
  assert.equal(y2024?.questionCount, 100);
  assert.equal(y2024?.sourceCount, 1);
  assert.equal(y2024?.fullMockReady, true);
  assert.equal(y2024?.missingForBalancedMock, 0);
  assert.deepEqual(y2024?.sectionCounts, {
    reasoning: 25,
    "general-awareness": 25,
    "quantitative-aptitude": 25,
    "english-comprehension": 25
  });

  const y2022 = dashboard.corpusCoverage?.years.find((year) => year.year === 2022);
  assert.equal(y2022?.questionCount, 40);
  assert.equal(y2022?.sourceCount, 1);
  assert.equal(y2022?.fullMockReady, false);
  assert.equal(y2022?.missingForBalancedMock, 60);
  assert.deepEqual(y2022?.sectionCounts, {
    reasoning: 20,
    "general-awareness": 20,
    "quantitative-aptitude": 0,
    "english-comprehension": 0
  });
});

test("SSC CGL import-review loader summarizes source acquisition and quarantined alignment", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  const officialNoticeId = "official-ssc-2026-cgl-notice";
  const drishtiId = "drishti-ssc-cgl-pyq-pdf-ssc-cgl-tier-1-question-paper-bilingual-23-september-2-e96394e91c86";
  fs.mkdirSync(path.join(tempDataDir, "downloads"), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "ocr-review", officialNoticeId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "segments", officialNoticeId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "aligned", officialNoticeId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "aligned", drishtiId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "book-imports"), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "book-sources"), { recursive: true });

  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    policy: { ranked: "Only reviewed promoted questions enter ranked practice." },
    candidates: [
      {
        id: "test-isolated-import-review-source",
        title: "Test isolated import-review source",
        url: "https://example.test/ssc-cgl-isolated-source",
        sourceId: "test-isolated-import-review",
        sourceType: "copyright_risk_reference",
        acquisitionPolicy: "metadata only in isolated tests",
        publishPolicy: "do not copy",
        reviewStatus: "metadata_only",
        tags: ["test"],
        discoveredAt: "2026-06-25T00:00:00+00:00",
        snippet: "Proves the loader reads the test data directory."
      },
      {
        id: "scribd-ssc-cgl-reference-search",
        title: "Scribd SSC CGL reference search",
        url: "https://www.scribd.com/search?query=ssc%20cgl",
        sourceType: "copyright_risk_reference",
        acquisitionPolicy: "metadata only",
        publishPolicy: "do not copy",
        reviewStatus: "metadata_only",
        tags: ["scribd", "reference"]
      },
      {
        id: officialNoticeId,
        title: "SSC CGL 2026 official notice",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf",
        sourceType: "official_notice_metadata",
        acquisitionPolicy: "metadata only",
        publishPolicy: "official notices are provenance, not question papers",
        reviewStatus: "metadata_only",
        tags: ["official", "notice", "syllabus", "not-question-paper"]
      },
      {
        id: drishtiId,
        title: "SSC CGL Tier 1 Question Paper Bilingual 23 September 2025 Shift 3",
        url: "https://vault.sscdrishti.com/english_file_uploads/1770126209_SSC-CGL-Tier-1-Question-Paper-Bilingual-23-September-2025-Shift-3.pdf",
        sourceId: "drishti-ssc-cgl-pyq-pdf",
        sourceType: "web_pdf_unverified",
        acquisitionPolicy: "quarantine public web PDF with provenance",
        publishPolicy: "do not copy unreviewed PDFs into ranked practice; keep every Drishti lead unverified until review",
        reviewStatus: "needs_review",
        tags: ["drishti", "web-pdf", "unverified", "2025", "shift-3"],
        discoveredAt: "2026-06-25T00:00:00+00:00",
        snippet: "Fixture matching the quarantine ledger."
      },
      {
        id: "official-ssc-model-questions-api",
        title: "Official SSC model-question API scan",
        url: "https://ssc.gov.in/api/general-website/portal/records?contentType=model-questions",
        sourceType: "official_open",
        acquisitionPolicy: "metadata marker only",
        publishPolicy: "No CGL paper attachment was discovered in this API response.",
        reviewStatus: "metadata_only",
        tags: ["official", "api", "cgl-zero-match"]
      },
      {
        id: "archive-ssc-cgl-reference-lead",
        title: "Archive SSC CGL reference lead",
        url: "https://archive.org/details/ssc-cgl-reference",
        sourceType: "web_pdf_unverified",
        acquisitionPolicy: "metadata first",
        publishPolicy: "quarantine before OCR",
        reviewStatus: "needs_review",
        tags: ["archive", "web-pdf"]
      }
    ]
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "pyq-source-backlog.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    target: {
      startYear: 1977,
      endYear: 2026,
      targetYears: 50,
      scope: "SSC CGL Tier-I official previous-year source backlog"
    },
    totals: {
      yearsTargeted: 50,
      yearsWithOfficialPaper: 0,
      yearsWithAnyCandidate: 0,
      yearsWithUnverifiedWebLead: 1,
      missingOfficialPaperYears: 50,
      yearsWithCuratedImports: 0,
      rankedEligibleYears: 0,
      rankedEligibleQuestions: 0
    },
    years: [
      {
        year: 2026,
        status: "missing_official_paper",
        rankedEligible: false,
        nextAction: "Find the official previous-year paper or answer-key release before adding ranked PYQs."
      }
    ]
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "downloads", "download-ledger.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    downloaded: [],
    quarantined: [
      drishtiId,
      ...Array.from({ length: 9 }, (_, index) => `quarantined-web-pdf-${index + 1}`)
    ].map((candidateId, index) => ({
      candidateId,
      title: `Quarantined web PDF ${index + 1}`,
      url: `https://example.test/quarantined-${index + 1}.pdf`,
      sourceType: "web_pdf_unverified",
      filePath: `quarantine/${candidateId}.pdf`,
      sha256: `sha-${index + 1}`,
      bytes: 1024 + index,
      downloadedAt: "2026-06-25T00:00:00+00:00",
      quarantineReason: "web PDF provenance and rights review required",
      publishPolicy: "Quarantine only until OCR, answer-key, duplicate, topic, and provenance review pass."
    })),
    skipped: []
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "ocr-review", officialNoticeId, "extraction-report.json"), JSON.stringify({
    sourceId: officialNoticeId,
    sourceType: "official_notice_metadata",
    sourceUrl: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf",
    pageCount: 132,
    extractionStatus: "text_extracted",
    reviewStatus: "metadata_only",
    ocrRequired: false,
    questionSignals: 10
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "segments", officialNoticeId, "segmentation-report.json"), JSON.stringify({
    sourceId: officialNoticeId,
    sourceType: "official_notice_metadata",
    sourceUrl: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf",
    pageCount: 132,
    pagesScanned: 132,
    candidateCount: 10,
    reviewStatus: "metadata_only",
    rankedEligible: false
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "aligned", officialNoticeId, "alignment-report.json"), JSON.stringify({
    answerKeySourceId: null,
    totalCandidates: 10,
    matched: 0,
    mismatched: 0,
    missing: 10,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "aligned", officialNoticeId, "aligned-candidates.json"), JSON.stringify([
    {
      id: "official-notice-sample-q1",
      sourceId: officialNoticeId,
      pageNumber: 12,
      questionNumber: "1",
      stem: "Sample notice-like candidate that should never become a ranked question.",
      reviewStatus: "needs_answer_key",
      rankedEligible: false,
      correctOption: null,
      alignmentStatus: "missing_answer_key"
    }
  ], null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "aligned", drishtiId, "alignment-report.json"), JSON.stringify({
    answerKeySourceId: "drishti-answer-key",
    totalCandidates: 80,
    matched: 80,
    mismatched: 0,
    missing: 0,
    rankedEligible: true
  }, null, 2) + "\n", "utf8");

  fs.writeFileSync(path.join(tempDataDir, "book-sources", "manifest.json"), JSON.stringify({
    sources: [{ id: "pinnacle-book-source" }]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "book-imports", "questions.json"), JSON.stringify(
    Array.from({ length: 20 }, (_, index) => ({
      id: `curated-book-question-${index + 1}`,
      year: 2024,
      section: ["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"][index % 4],
      reviewStatus: "reviewed",
      provenance: { sourceId: "pinnacle-book-source" }
    })),
    null,
    2
  ) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);

  assert.ok(dashboard.generatedAt);
  assert.equal(dashboard.totals.discoveredSources >= 6, true);
  assert.equal(dashboard.sourceLibrary.scribdSources, 1);
  assert.ok(dashboard.sourceLibrary.webPdfSources >= 2);
  assert.ok(dashboard.sourceLibrary.bookReferenceSources >= 1);
  assert.ok(dashboard.sourceLibrary.metadataOnlySources >= 3);
  assert.ok(dashboard.sourceLibrary.topTags.some((item) => item.tag === "reference"));
  assert.ok(dashboard.sources.some((source) => source.id === "test-isolated-import-review-source"));
  assert.equal(dashboard.totals.downloadedFiles, 0);
  assert.equal(dashboard.totals.quarantinedFiles, 10);
  assert.equal(dashboard.totals.alignedCandidates, 90);
  assert.ok(dashboard.totals.curatedPromotedCandidates > 0);
  assert.equal(dashboard.activeCorpus?.sourceType, "book_user_provided");
  assert.equal(dashboard.activeCorpus?.promotedQuestions, 20);
  assert.equal(dashboard.activeCorpus?.rankedUse, "ranked_practice");
  assert.match(dashboard.activeCorpus?.policy ?? "", /active uploaded-book corpus/i);
  assert.equal(dashboard.activeCorpus?.optionalLeadCandidates, 90);
  assert.equal(dashboard.activeCorpus?.quarantinedLeadCandidates, 90);
  assert.equal(dashboard.totals.rankedEligibleCandidates, dashboard.totals.curatedPromotedCandidates);
  assert.equal(
    dashboard.totals.quarantinedCandidates,
    Math.max(0, dashboard.totals.alignedCandidates - dashboard.totals.curatedPromotedCandidates)
  );
  assert.equal(dashboard.pyqBacklog?.targetYears, 50);
  assert.equal(dashboard.pyqBacklog?.yearsWithOfficialPaper, 0);
  assert.equal(dashboard.pyqBacklog?.yearsWithAnyCandidate, 0);
  assert.ok((dashboard.pyqBacklog?.yearsWithCuratedImports ?? 0) >= 1);
  assert.ok((dashboard.pyqBacklog?.rankedEligibleYears ?? 0) >= 1);
  assert.equal(dashboard.pyqBacklog?.rankedEligibleQuestions, dashboard.totals.curatedPromotedCandidates);
  assert.equal(dashboard.pyqBacklog?.missingOfficialPaperYears, 50);
  assert.match(dashboard.pyqBacklog?.nextAction ?? "", /official previous-year paper/i);

  const scribd = dashboard.sources.find((source) => source.id === "scribd-ssc-cgl-reference-search");
  assert.ok(scribd, "Scribd should be visible as a reference source");
  assert.equal(scribd?.sourceType, "copyright_risk_reference");
  assert.equal(scribd?.acquisitionState, "metadata_only");
  assert.match(scribd?.actionRequired ?? "", /do not download/i);

  const officialNotice = dashboard.sources.find((source) => source.id === "official-ssc-2026-cgl-notice");
  assert.ok(officialNotice, "official notice should be summarized");
  assert.equal(officialNotice?.acquisitionState, "metadata_only");
  assert.equal(officialNotice?.extraction?.pageCount, 132);
  assert.equal(officialNotice?.segmentation?.candidateCount, 10);
  assert.equal(officialNotice?.alignment?.missing, 10);
  assert.equal(officialNotice?.alignment?.rankedEligible, false);
  assert.equal(officialNotice?.nextGate, "blocked_metadata_only");
  assert.match(officialNotice?.actionRequired ?? "", /provenance, not question papers/i);
  assert.ok(officialNotice?.sampleCandidates.some((candidate) => candidate.alignmentStatus === "missing_answer_key"));

  const quarantinedDrishti = dashboard.sources.find((source) => source.id.startsWith("drishti-ssc-cgl-pyq-pdf-ssc-cgl-tier-1-question-paper-bilingual-23-september"));
  assert.ok(quarantinedDrishti, "quarantined Drishti paper should be summarized");
  assert.equal(quarantinedDrishti?.acquisitionState, "quarantined");
  assert.equal(quarantinedDrishti?.sourceType, "web_pdf_unverified");
  assert.equal(quarantinedDrishti?.nextGate, "rights_review");
  assert.ok((quarantinedDrishti?.quarantine?.bytes ?? 0) > 0);
  assert.match(quarantinedDrishti?.actionRequired ?? "", /Quarantined only/i);
});

test("SSC CGL import-review keeps metadata-only official discoveries out of the download queue", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-metadata-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  fs.mkdirSync(tempDataDir, { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    candidates: [
      {
        id: "official-ssc-model-questions-api",
        title: "Official SSC model-question API scan",
        url: "https://ssc.gov.in/api/general-website/portal/records?contentType=model-questions",
        sourceType: "official_open",
        acquisitionPolicy: "metadata marker only",
        publishPolicy: "No CGL paper attachment was discovered in this API response.",
        reviewStatus: "metadata_only",
        tags: ["official", "api", "cgl-zero-match"],
        snippet: "1 official model-question records checked; 0 CGL records matched by exam metadata."
      }
    ]
  }, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);
  const apiMarker = dashboard.sources.find((source) => source.id === "official-ssc-model-questions-api");

  assert.ok(apiMarker, "official API marker should be visible as discovery evidence");
  assert.equal(apiMarker?.acquisitionState, "metadata_only");
  assert.equal(apiMarker?.nextGate, "blocked_metadata_only");
  assert.match(apiMarker?.actionRequired ?? "", /metadata only/i);
  assert.doesNotMatch(apiMarker?.actionRequired ?? "", /download/i);
});

test("SSC CGL import-review does not count unverified web PDF alignments as ranked eligible", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-unverified-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  fs.mkdirSync(path.join(tempDataDir, "aligned", "archive-unverified-paper"), { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    candidates: [
      {
        id: "archive-unverified-paper",
        title: "Archive SSC CGL Tier I 2019 Question Paper",
        url: "https://archive.org/details/archive-unverified-paper",
        sourceType: "web_pdf_unverified",
        acquisitionPolicy: "metadata first",
        publishPolicy: "do not copy unreviewed scans into ranked practice",
        reviewStatus: "needs_review",
        tags: ["archive", "web-pdf", "review", "2019"]
      }
    ]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "aligned", "archive-unverified-paper", "alignment-report.json"), JSON.stringify({
    answerKeySourceId: "fake-answer-key",
    totalCandidates: 100,
    matched: 100,
    mismatched: 0,
    missing: 0,
    rankedEligible: true
  }, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);
  const source = dashboard.sources.find((item) => item.id === "archive-unverified-paper");

  assert.equal(source?.nextGate, "rights_review");
  assert.equal(source?.alignment?.rankedEligible, true, "fixture proves the accidental downstream report exists");
  assert.equal(dashboard.totals.alignedCandidates, 100);
  assert.equal(dashboard.totals.rankedEligibleCandidates, 0);
  assert.equal(dashboard.totals.quarantinedCandidates, 100);
});

test("SSC CGL import-review surfaces agent answer and curation review progress without promotion", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-agent-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "web-paper-agent-progressx";
  const reportSourceId = "web-paper-agent-progress";
  fs.mkdirSync(path.join(tempDataDir, "agent-answer-key", reportSourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "agent-answer-key", `${reportSourceId}-deepseek-mistral-full`), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "agent-review", reportSourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "agent-review", `${reportSourceId}-deepseek-mistral-full`), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "aligned", sourceId), { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    candidates: [
      {
        id: sourceId,
        title: "Web paper with agent review progress",
        url: "https://example.test/web-paper-agent-progress.pdf",
        sourceType: "web_pdf_unverified",
        acquisitionPolicy: "quarantine public web PDF with provenance",
        publishPolicy: "do not copy unreviewed PDFs into ranked practice",
        reviewStatus: "needs_review",
        tags: ["web-pdf", "agent-review"]
      }
    ]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "aligned", sourceId, "alignment-report.json"), JSON.stringify({
    totalCandidates: 10,
    matched: 6,
    missing: 4,
    rejectedConsensus: 1,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "agent-answer-key", reportSourceId, "agent-answer-key-report.json"), JSON.stringify({
    totalCandidates: 10,
    solveItems: 10,
    providerCalls: 20,
    decisionsAccepted: 0,
    decisionsRejected: 0,
    consensusAnswers: 0,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "agent-answer-key", `${reportSourceId}-deepseek-mistral-full`, "agent-answer-key-report.json"), JSON.stringify({
    totalCandidates: 10,
    solveItems: 10,
    providerCalls: 20,
    decisionsAccepted: 18,
    decisionsRejected: 2,
    consensusAnswers: 6,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "agent-review", reportSourceId, "agent-review-report.json"), JSON.stringify({
    totalCandidates: 10,
    agentReviewItems: 6,
    providerCalls: 12,
    decisionsAccepted: 0,
    decisionsRejected: 0,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "agent-review", `${reportSourceId}-deepseek-mistral-full`, "agent-review-report.json"), JSON.stringify({
    totalCandidates: 10,
    agentReviewItems: 6,
    providerCalls: 12,
    decisionsAccepted: 11,
    decisionsRejected: 1,
    rankedEligible: false
  }, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);
  const source = dashboard.sources.find((item) => item.id === sourceId);

  assert.equal(source?.agentAnswer?.consensusAnswers, 6);
  assert.equal(source?.agentAnswer?.decisionsAccepted, 18);
  assert.equal(source?.agentReview?.agentReviewItems, 6);
  assert.equal(source?.agentReview?.decisionsAccepted, 11);
  assert.equal(source?.agentReview?.rankedEligible, false);
  assert.equal(dashboard.totals.agentAnswerConsensus, 6);
  assert.equal(dashboard.totals.agentReviewedItems, 6);
  assert.equal(dashboard.totals.rankedEligibleCandidates, 0);
});

test("SSC CGL import-review blocks official non-paper notices even with falsely clean alignment", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-official-notice-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "official-answer-key-notice-clean-alignment";
  fs.mkdirSync(path.join(tempDataDir, "downloads"), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "ocr-review", sourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "segments", sourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "aligned", sourceId), { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-25T00:00:00+00:00",
    candidates: [
      {
        id: sourceId,
        title: "SSC CGL answer-key notice, not a question paper",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/AnswerKeys/final-writeup.pdf",
        sourceType: "official_open",
        acquisitionPolicy: "official public PDF",
        publishPolicy: "not a ranked question paper",
        reviewStatus: "reviewed",
        tags: ["official", "official-answer-key-notice", "not-question-paper", "2025"]
      }
    ]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "downloads", "download-ledger.json"), JSON.stringify({
    downloaded: [
      {
        candidateId: sourceId,
        title: "SSC CGL answer-key notice",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/AnswerKeys/final-writeup.pdf",
        sourceType: "official_open",
        filePath: "G:\\MITEEE\\fake.pdf",
        sha256: "abc",
        bytes: 123
      }
    ]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "ocr-review", sourceId, "extraction-report.json"), JSON.stringify({
    sourceId,
    sourceType: "official_open",
    pageCount: 1,
    extractionStatus: "text_extracted",
    reviewStatus: "reviewed",
    ocrRequired: false,
    questionSignals: 100
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "segments", sourceId, "segmentation-report.json"), JSON.stringify({
    sourceId,
    sourceType: "official_open",
    pageCount: 1,
    pagesScanned: 1,
    candidateCount: 100,
    reviewStatus: "reviewed",
    rankedEligible: true
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "aligned", sourceId, "alignment-report.json"), JSON.stringify({
    answerKeySourceId: "fake-answer-key",
    totalCandidates: 100,
    matched: 100,
    mismatched: 0,
    missing: 0,
    rankedEligible: true
  }, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);
  const source = dashboard.sources.find((item) => item.id === sourceId);

  assert.equal(source?.nextGate, "blocked_metadata_only");
  assert.equal(source?.alignment?.rankedEligible, true, "fixture proves a downstream report can be falsely clean");
  assert.equal(dashboard.totals.rankedEligibleCandidates, 0);
  assert.equal(dashboard.totals.quarantinedCandidates, 100);
});

test("SSC CGL import-review requires non-empty fully matched reviewed official papers for promotion", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-import-review-empty-alignment-"));
  const tempDataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "official-reviewed-paper-empty-alignment";
  fs.mkdirSync(path.join(tempDataDir, "downloads"), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "ocr-review", sourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "segments", sourceId), { recursive: true });
  fs.mkdirSync(path.join(tempDataDir, "aligned", sourceId), { recursive: true });
  fs.writeFileSync(path.join(tempDataDir, "resource-candidates.json"), JSON.stringify({
    candidates: [
      {
        id: sourceId,
        title: "Official SSC CGL Tier I 2024 Question Paper",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/QuestionPapers/cgl-2024.pdf",
        sourceType: "official_open",
        reviewStatus: "reviewed",
        tags: ["official", "question-paper", "2024"]
      }
    ]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "downloads", "download-ledger.json"), JSON.stringify({
    downloaded: [{ candidateId: sourceId, title: "paper", url: "https://ssc.gov.in/paper.pdf", sourceType: "official_open", filePath: "paper.pdf", sha256: "abc", bytes: 1 }]
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "ocr-review", sourceId, "extraction-report.json"), JSON.stringify({
    sourceId,
    sourceType: "official_open",
    pageCount: 1,
    extractionStatus: "text_extracted",
    reviewStatus: "reviewed",
    ocrRequired: false,
    questionSignals: 0
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "segments", sourceId, "segmentation-report.json"), JSON.stringify({
    sourceId,
    sourceType: "official_open",
    pageCount: 1,
    pagesScanned: 1,
    candidateCount: 0,
    reviewStatus: "reviewed",
    rankedEligible: true
  }, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(tempDataDir, "aligned", sourceId, "alignment-report.json"), JSON.stringify({
    answerKeySourceId: "empty-key",
    totalCandidates: 0,
    matched: 0,
    mismatched: 0,
    missing: 0,
    rankedEligible: true
  }, null, 2) + "\n", "utf8");

  const { getSscImportReviewDashboardForDataDir } = await import("../lib/ssc-cgl-import-review");
  const dashboard = getSscImportReviewDashboardForDataDir(tempDataDir);
  const source = dashboard.sources.find((item) => item.id === sourceId);

  assert.equal(source?.nextGate, "answer_key_review");
  assert.equal(dashboard.totals.rankedEligibleCandidates, 0);
});
