import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

type ResourceCandidate = {
  id: string;
  title: string;
  url: string;
  sourceType: string;
  acquisitionPolicy?: string;
  publishPolicy?: string;
  reviewStatus?: string;
  tags?: string[];
  snippet?: string;
};

type ResourceManifest = {
  generatedAt?: string;
  policy?: Record<string, string>;
  candidates?: ResourceCandidate[];
};

type DownloadLedger = {
  generatedAt?: string;
  downloaded?: Array<{
    candidateId: string;
    title: string;
    url: string;
    sourceType: string;
    filePath: string;
    sha256: string;
    bytes: number;
    downloadedAt?: string;
  }>;
  quarantined?: Array<{
    candidateId: string;
    title: string;
    url: string;
    sourceType: string;
    filePath: string;
    sha256: string;
    bytes: number;
    downloadedAt?: string;
    quarantineReason?: string;
    publishPolicy?: string;
  }>;
  skipped?: Array<{
    candidateId: string;
    title: string;
    url: string;
    sourceType: string;
    reason: string;
  }>;
};

type ExtractionReport = {
  sourceId: string;
  sourceType: string;
  sourceFile?: string;
  sourceUrl?: string;
  pageCount: number;
  extractionStatus: string;
  reviewStatus: string;
  ocrRequired: boolean;
  questionSignals: number;
  pages?: Array<{ pageNumber: number; charCount: number; questionSignals: number; extractionMethod: string }>;
};

type SegmentationReport = {
  sourceId: string;
  sourceType: string;
  sourceUrl?: string;
  pageCount: number;
  pagesScanned: number;
  candidateCount: number;
  reviewStatus: string;
  rankedEligible: boolean;
};

type AlignmentReport = {
  answerKeySourceId?: string;
  totalCandidates: number;
  matched: number;
  mismatched: number;
  missing: number;
  rejectedConsensus?: number;
  rankedEligible: boolean;
  issues?: Array<{
    candidateId: string;
    questionNumber: string;
    status: string;
    candidateAnswer: string | null;
    answerKey: string | null;
  }>;
};

type AgentAnswerReport = {
  totalCandidates: number;
  solveItems: number;
  providerCalls: number;
  decisionsAccepted: number;
  decisionsRejected: number;
  consensusAnswers: number;
  rankedEligible: boolean;
};

type AgentReviewReport = {
  totalCandidates: number;
  agentReviewItems: number;
  providerCalls: number;
  decisionsAccepted: number;
  decisionsRejected: number;
  rankedEligible: boolean;
};

type PromotionReport = {
  promotedQuestions: number;
  rankedEligible: boolean;
};

type CuratedQuestion = {
  year?: number;
  section?: string;
  reviewStatus?: string;
  provenance?: {
    sourceId?: string;
    sourceType?: string;
  };
};

type AlignedCandidate = {
  id: string;
  sourceId: string;
  pageNumber: number;
  questionNumber: string;
  stem: string;
  reviewStatus: string;
  rankedEligible: boolean;
  correctOption: string | null;
  alignmentStatus: string;
};

type PyqSourceBacklog = {
  generatedAt?: string;
  target?: {
    startYear?: number;
    endYear?: number;
    targetYears?: number;
    scope?: string;
  };
  totals?: {
    yearsTargeted?: number;
    yearsWithOfficialPaper?: number;
    yearsWithAnyCandidate?: number;
    yearsWithUnverifiedWebLead?: number;
    missingOfficialPaperYears?: number;
    yearsWithCuratedImports?: number;
    rankedEligibleYears?: number;
    rankedEligibleQuestions?: number;
  };
  years?: Array<{
    year: number;
    status: string;
    rankedEligible: boolean;
    rankedEligibleQuestionCount?: number;
    rankedEligibleSourceIds?: string[];
    nextAction: string;
  }>;
};

export type SscImportReviewSource = {
  id: string;
  title: string;
  url: string;
  sourceType: string;
  tags: string[];
  reviewStatus: string;
  acquisitionState: "downloaded" | "quarantined" | "skipped" | "metadata_only" | "not_started";
  actionRequired: string;
  publishPolicy: string;
  download?: {
    filePath: string;
    sha256: string;
    bytes: number;
  };
  quarantine?: {
    filePath: string;
    sha256: string;
    bytes: number;
    reason: string;
  };
  extraction?: {
    pageCount: number;
    extractionStatus: string;
    reviewStatus: string;
    ocrRequired: boolean;
    questionSignals: number;
  };
  segmentation?: {
    candidateCount: number;
    reviewStatus: string;
    rankedEligible: boolean;
  };
  alignment?: {
    answerKeySourceId: string | null;
    totalCandidates: number;
    matched: number;
    mismatched: number;
    missing: number;
    rejectedConsensus?: number;
    rankedEligible: boolean;
  };
  agentAnswer?: AgentAnswerReport;
  agentReview?: AgentReviewReport;
  sampleCandidates: Array<{
    id: string;
    pageNumber: number;
    questionNumber: string;
    stem: string;
    alignmentStatus: string;
    rankedEligible: boolean;
  }>;
  nextGate:
    | "rights_review"
    | "download"
    | "ocr_or_text_extraction"
    | "segmentation_review"
    | "answer_key_review"
    | "topic_duplicate_review"
    | "ready_for_curated_promotion"
    | "blocked_metadata_only";
};

export type SscCorpusCoverageYear = {
  year: number;
  questionCount: number;
  sourceCount: number;
  fullMockReady: boolean;
  missingForBalancedMock: number;
  sectionCounts: Record<string, number>;
};

export type SscActiveCorpusAudit = {
  sourceType: "book_user_provided" | "curated_imports";
  label: string;
  promotedQuestions: number;
  rankedUse: "ranked_practice" | "inactive";
  policy: string;
  optionalLeadCandidates: number;
  quarantinedLeadCandidates: number;
  sourceDiscoveryLeads: number;
  metadataOnlySources: number;
  quarantinedFiles: number;
};

export type SscImportReviewDashboard = {
  generatedAt: string;
  policy: Record<string, string>;
  sourceLibrary: {
    sourceTypeCounts: Record<string, number>;
    topTags: Array<{ tag: string; count: number }>;
    officialSources: number;
    webPdfSources: number;
    scribdSources: number;
    bookReferenceSources: number;
    metadataOnlySources: number;
    reviewedSources: number;
  };
  activeCorpus?: SscActiveCorpusAudit;
  pyqBacklog?: {
    startYear: number;
    endYear: number;
    targetYears: number;
    yearsWithOfficialPaper: number;
    yearsWithAnyCandidate: number;
    yearsWithUnverifiedWebLead: number;
    missingOfficialPaperYears: number;
    yearsWithCuratedImports: number;
    rankedEligibleYears: number;
    rankedEligibleQuestions: number;
    nextAction: string;
  };
  corpusCoverage?: {
    fullMockReadyYears: number;
    years: SscCorpusCoverageYear[];
  };
  totals: {
    discoveredSources: number;
    downloadedFiles: number;
    quarantinedFiles: number;
    extractedSources: number;
    segmentedSources: number;
    alignedSources: number;
    alignedCandidates: number;
    agentAnswerConsensus: number;
    agentReviewedItems: number;
    curatedPromotedCandidates: number;
    rankedEligibleCandidates: number;
    quarantinedCandidates: number;
  };
  sources: SscImportReviewSource[];
};

const projectRoot = process.env["MITEEE_PROJECT_ROOT"] ?? process.cwd();
const defaultBaseDir = [projectRoot, "data", "exams", "ssc-cgl"].join(path.sep);
const sscTierOneSections = ["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"];
const balancedMockSectionSize = 25;

function readJsonFile<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function readReportMap<T extends { sourceId: string }>(baseDir: string, root: string, fileName: string): Map<string, T> {
  const reports = new Map<string, T>();
  const dir = path.join(baseDir, root);
  if (!fs.existsSync(dir)) return reports;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const report = readJsonFile<T>(path.join(dir, entry.name, fileName));
    if (report?.sourceId) reports.set(report.sourceId, report);
  }

  return reports;
}

function readAlignmentReportMap(baseDir: string): Map<string, AlignmentReport> {
  const reports = new Map<string, AlignmentReport>();
  const dir = path.join(baseDir, "aligned");
  if (!fs.existsSync(dir)) return reports;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const report = readJsonFile<AlignmentReport>(path.join(dir, entry.name, "alignment-report.json"));
    if (report) reports.set(entry.name, report);
  }

  return reports;
}

function readNamedReportMap<T>(baseDir: string, root: string, fileName: string): Map<string, T> {
  const reports = new Map<string, T>();
  const dir = path.join(baseDir, root);
  if (!fs.existsSync(dir)) return reports;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const report = readJsonFile<T>(path.join(dir, entry.name, fileName));
    if (report) reports.set(entry.name, report);
  }

  return reports;
}

function normalizedReportKey(reportKey: string) {
  return reportKey
    .replace(/-(deepseek-mistral-full|live-sample|agent-consensus)$/i, "")
    .replace(/-(deepseek|mistral|gpt)-full$/i, "");
}

function reportKeyMatchesSource(reportKey: string, sourceId: string) {
  const normalizedKey = normalizedReportKey(reportKey);
  return (
    sourceId.startsWith(reportKey)
    || reportKey.startsWith(sourceId)
    || sourceId.startsWith(normalizedKey)
    || normalizedKey.startsWith(sourceId)
  );
}

function reportForSource<T>(reports: Map<string, T>, sourceId: string, scoreReport?: (report: T) => number): T | undefined {
  const exact = reports.get(sourceId);
  if (!scoreReport && exact) return exact;
  let best: T | undefined = exact;
  let bestScore = exact && scoreReport ? scoreReport(exact) : Number.NEGATIVE_INFINITY;
  for (const [reportKey, report] of reports) {
    if (!reportKeyMatchesSource(reportKey, sourceId)) continue;
    if (!scoreReport) return report;
    const score = scoreReport(report);
    if (!best || score > bestScore) {
      best = report;
      bestScore = score;
    }
  }
  return best;
}

function readAlignedCandidates(baseDir: string): Map<string, AlignedCandidate[]> {
  const bySource = new Map<string, AlignedCandidate[]>();
  const dir = path.join(baseDir, "aligned");
  if (!fs.existsSync(dir)) return bySource;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidates = readJsonFile<AlignedCandidate[]>(path.join(dir, entry.name, "aligned-candidates.json")) ?? [];
    if (candidates.length === 0) continue;
    bySource.set(candidates[0]!.sourceId, candidates);
  }

  return bySource;
}

function readCuratedPromotion(baseDir: string, allowedSourceIds?: string[]) {
  const bookImportQuestionsPath = path.join(baseDir, "book-imports", "questions.json");
  const importRoot = fs.existsSync(bookImportQuestionsPath) ? "book-imports" : "curated-imports";
  const repoReportPath = path.join(baseDir, importRoot, "promotion-report.json");
  const reportPath = repoReportPath;
  const questionsPath = importRoot === "book-imports" ? bookImportQuestionsPath : path.join(baseDir, importRoot, "questions.json");
  const report = readJsonFile<PromotionReport>(reportPath);
  const generatedIndexPath = path.join(projectRoot, "data", "generated", "exams", "ssc-cgl", "index.json");
  const generatedIndex = path.resolve(baseDir) === path.resolve(defaultBaseDir)
    ? readJsonFile<{ questions?: CuratedQuestion[] }>(generatedIndexPath)
    : null;
  const allQuestions = importRoot === "book-imports" && generatedIndex?.questions
    ? generatedIndex.questions.filter((question) => question.provenance?.sourceType === "book_user_provided")
    : readJsonFile<CuratedQuestion[]>(questionsPath) ?? [];
  const questions = allowedSourceIds
    ? allQuestions.filter((question) => allowedSourceIds.some((sourceId) => reportKeyMatchesSource(question.provenance?.sourceId ?? "", sourceId)))
    : allQuestions;
  const promotedQuestions = questions.length > 0
    ? questions.filter((question) => question.reviewStatus === "reviewed").length
    : report?.rankedEligible ? report.promotedQuestions : 0;
  const years = new Set(questions
    .filter((question) => question.reviewStatus === "reviewed" && typeof question.year === "number")
    .map((question) => question.year as number));
  const sourceType: SscActiveCorpusAudit["sourceType"] = importRoot === "book-imports" ? "book_user_provided" : "curated_imports";
  return {
    promotedQuestions,
    rankedEligibleYears: years.size,
    coverageYears: buildCorpusCoverageYears(questions),
    sourceType
  };
}

function readBookSourceIds(baseDir: string) {
  const manifest = readJsonFile<{ sources?: Array<{ id?: string }> }>(path.join(baseDir, "book-sources", "manifest.json"));
  return (manifest?.sources ?? []).map((source) => source.id).filter((id): id is string => Boolean(id));
}

function buildCorpusCoverageYears(questions: CuratedQuestion[]): SscCorpusCoverageYear[] {
  const byYear = new Map<number, { questionCount: number; sourceIds: Set<string>; sectionCounts: Record<string, number> }>();

  for (const question of questions) {
    if (question.reviewStatus !== "reviewed" || typeof question.year !== "number") continue;
    const year = question.year;
    const bucket = byYear.get(year) ?? {
      questionCount: 0,
      sourceIds: new Set<string>(),
      sectionCounts: Object.fromEntries(sscTierOneSections.map((section) => [section, 0])) as Record<string, number>
    };
    bucket.questionCount += 1;
    if (question.section && question.section in bucket.sectionCounts) {
      bucket.sectionCounts[question.section] += 1;
    }
    const sourceId = question.provenance?.sourceId;
    if (sourceId) bucket.sourceIds.add(sourceId);
    byYear.set(year, bucket);
  }

  return [...byYear.entries()]
    .map(([year, bucket]) => {
      const missingForBalancedMock = sscTierOneSections.reduce(
        (sum, section) => sum + Math.max(0, balancedMockSectionSize - (bucket.sectionCounts[section] ?? 0)),
        0
      );
      return {
        year,
        questionCount: bucket.questionCount,
        sourceCount: bucket.sourceIds.size,
        fullMockReady: missingForBalancedMock === 0,
        missingForBalancedMock,
        sectionCounts: bucket.sectionCounts
      };
    })
    .sort((a, b) => b.year - a.year);
}

function actionFor(candidate: ResourceCandidate, skippedReason?: string, quarantineReason?: string) {
  if (candidate.sourceType === "copyright_risk_reference") return "Metadata only: do not download or copy text without rights.";
  if (candidate.sourceType === "official_login_personal") return "Metadata only: personal response sheets require login and stay private.";
  if (candidate.sourceType === "official_notice_metadata") return "Metadata only: official notices and answer-key write-ups are provenance, not question papers.";
  if (candidate.reviewStatus === "metadata_only") return "Metadata only: keep as discovery evidence until an importable CGL paper attachment is found.";
  if (quarantineReason) return `Quarantined only: ${quarantineReason}. Run OCR, answer-key, duplicate, topic, and model-agent provenance review before any curated use.`;
  if (candidate.sourceType === "web_pdf_unverified") return "Run rights/provenance review before any download or OCR.";
  if (skippedReason) return skippedReason;
  return "Continue through extraction, segmentation, answer-key, topic, duplicate, and provenance review.";
}

const nonQuestionPaperTags = new Set(["not-question-paper", "official-answer-key-notice", "notice", "syllabus"]);

function hasNonQuestionPaperTag(tags: string[] = []) {
  return tags.some((tag) => nonQuestionPaperTags.has(tag));
}

function hasPromotionReadyAlignment(alignment?: AlignmentReport) {
  return Boolean(
    alignment
      && alignment.totalCandidates > 0
      && alignment.matched === alignment.totalCandidates
      && alignment.missing === 0
      && alignment.mismatched === 0
      && alignment.rankedEligible === true
  );
}

function canEnterRankedPractice(
  candidate: ResourceCandidate,
  extraction?: ExtractionReport,
  segmentation?: SegmentationReport,
  alignment?: AlignmentReport
) {
  return Boolean(
    candidate.sourceType === "official_open"
      && candidate.reviewStatus === "reviewed"
      && !hasNonQuestionPaperTag(candidate.tags ?? [])
      && extraction?.reviewStatus === "reviewed"
      && segmentation?.reviewStatus === "reviewed"
      && segmentation?.rankedEligible === true
      && hasPromotionReadyAlignment(alignment)
  );
}

function nextGateFor(
  candidate: ResourceCandidate,
  downloaded: boolean,
  extraction?: ExtractionReport,
  segmentation?: SegmentationReport,
  alignment?: AlignmentReport
): SscImportReviewSource["nextGate"] {
  if (
    candidate.sourceType === "copyright_risk_reference"
      || candidate.sourceType === "official_login_personal"
      || candidate.sourceType === "official_notice_metadata"
  ) return "blocked_metadata_only";
  if (candidate.reviewStatus === "metadata_only") return "blocked_metadata_only";
  if (hasNonQuestionPaperTag(candidate.tags ?? [])) return "blocked_metadata_only";
  if (candidate.sourceType === "web_pdf_unverified") return "rights_review";
  if (!downloaded) return "download";
  if (!extraction) return "ocr_or_text_extraction";
  if (!segmentation) return "segmentation_review";
  if (!hasPromotionReadyAlignment(alignment)) return "answer_key_review";
  if (!canEnterRankedPractice(candidate, extraction, segmentation, alignment)) return "topic_duplicate_review";
  return "ready_for_curated_promotion";
}

function isRankedPracticeSource(source: SscImportReviewSource) {
  return Boolean(
    source.sourceType === "official_open"
      && source.reviewStatus === "reviewed"
      && !hasNonQuestionPaperTag(source.tags)
      && source.nextGate === "ready_for_curated_promotion"
      && source.extraction?.reviewStatus === "reviewed"
      && source.segmentation?.reviewStatus === "reviewed"
      && source.segmentation?.rankedEligible === true
      && source.alignment
      && source.alignment.totalCandidates > 0
      && source.alignment.matched === source.alignment.totalCandidates
      && source.alignment.missing === 0
      && source.alignment.mismatched === 0
  );
}

function readImportReviewDashboard(baseDir = defaultBaseDir): SscImportReviewDashboard {
  const manifest = readJsonFile<ResourceManifest>(path.join(baseDir, "resource-candidates.json")) ?? {};
  const pyqBacklog = readJsonFile<PyqSourceBacklog>(path.join(baseDir, "pyq-source-backlog.json")) ?? {};
  const ledger = readJsonFile<DownloadLedger>(path.join(baseDir, "downloads", "download-ledger.json")) ?? {};
  const extractions = readReportMap<ExtractionReport>(baseDir, "ocr-review", "extraction-report.json");
  const segmentations = readReportMap<SegmentationReport>(baseDir, "segments", "segmentation-report.json");
  const alignments = readAlignmentReportMap(baseDir);
  const alignedCandidates = readAlignedCandidates(baseDir);
  const agentAnswerReports = readNamedReportMap<AgentAnswerReport>(baseDir, "agent-answer-key", "agent-answer-key-report.json");
  const agentReviewReports = readNamedReportMap<AgentReviewReport>(baseDir, "agent-review", "agent-review-report.json");
  const manifestSourceIds = (manifest.candidates ?? []).map((candidate) => candidate.id);
  const bookSourceIds = readBookSourceIds(baseDir);
  const curatedPromotion = readCuratedPromotion(
    baseDir,
    path.resolve(baseDir) === path.resolve(defaultBaseDir) ? undefined : [...manifestSourceIds, ...bookSourceIds]
  );
  const downloadedById = new Map((ledger.downloaded ?? []).map((item) => [item.candidateId, item]));
  const quarantinedById = new Map((ledger.quarantined ?? []).map((item) => [item.candidateId, item]));
  const skippedById = new Map((ledger.skipped ?? []).map((item) => [item.candidateId, item]));

  const sources = (manifest.candidates ?? []).map((candidate): SscImportReviewSource => {
    const download = downloadedById.get(candidate.id);
    const quarantine = quarantinedById.get(candidate.id);
    const skipped = skippedById.get(candidate.id);
    const extraction = extractions.get(candidate.id);
    const segmentation = segmentations.get(candidate.id);
    const alignment = reportForSource(alignments, candidate.id);
    const agentAnswer = reportForSource(
      agentAnswerReports,
      candidate.id,
      (report) => report.consensusAnswers + report.decisionsAccepted
    );
    const agentReview = reportForSource(
      agentReviewReports,
      candidate.id,
      (report) => report.agentReviewItems + report.decisionsAccepted
    );
    const samples = (alignedCandidates.get(candidate.id) ?? []).slice(0, 4);
    const acquisitionState = download
      ? "downloaded"
      : quarantine
        ? "quarantined"
        : candidate.reviewStatus === "metadata_only"
          ? "metadata_only"
          : skipped
            ? "skipped"
            : "not_started";

    return {
      id: candidate.id,
      title: candidate.title,
      url: candidate.url,
      sourceType: candidate.sourceType,
      tags: candidate.tags ?? [],
      reviewStatus: candidate.reviewStatus ?? "unknown",
      acquisitionState,
      actionRequired: actionFor(candidate, skipped?.reason, quarantine?.quarantineReason),
      publishPolicy: quarantine?.publishPolicy ?? candidate.publishPolicy ?? "Review required before use.",
      download: download ? {
        filePath: download.filePath,
        sha256: download.sha256,
        bytes: download.bytes
      } : undefined,
      quarantine: quarantine ? {
        filePath: quarantine.filePath,
        sha256: quarantine.sha256,
        bytes: quarantine.bytes,
        reason: quarantine.quarantineReason ?? "web PDF quarantined for review"
      } : undefined,
      extraction: extraction ? {
        pageCount: extraction.pageCount,
        extractionStatus: extraction.extractionStatus,
        reviewStatus: extraction.reviewStatus,
        ocrRequired: extraction.ocrRequired,
        questionSignals: extraction.questionSignals
      } : undefined,
      segmentation: segmentation ? {
        candidateCount: segmentation.candidateCount,
        reviewStatus: segmentation.reviewStatus,
        rankedEligible: segmentation.rankedEligible
      } : undefined,
      alignment: alignment ? {
        answerKeySourceId: alignment.answerKeySourceId ?? null,
        totalCandidates: alignment.totalCandidates,
        matched: alignment.matched,
        mismatched: alignment.mismatched,
        missing: alignment.missing,
        rejectedConsensus: alignment.rejectedConsensus,
        rankedEligible: alignment.rankedEligible
      } : undefined,
      agentAnswer,
      agentReview,
      sampleCandidates: samples.map((sample) => ({
        id: sample.id,
        pageNumber: sample.pageNumber,
        questionNumber: sample.questionNumber,
        stem: sample.stem,
        alignmentStatus: sample.alignmentStatus,
        rankedEligible: sample.rankedEligible
      })),
      nextGate: nextGateFor(candidate, Boolean(download), extraction, segmentation, alignment)
    };
  });

  const sourceTypeCounts = sources.reduce<Record<string, number>>((counts, source) => {
    counts[source.sourceType] = (counts[source.sourceType] ?? 0) + 1;
    return counts;
  }, {});
  const tagCounts = sources.reduce<Record<string, number>>((counts, source) => {
    for (const tag of source.tags) counts[tag] = (counts[tag] ?? 0) + 1;
    return counts;
  }, {});
  const alignedCandidateCount = sources.reduce((sum, source) => sum + (source.alignment?.totalCandidates ?? 0), 0);
  const agentAnswerConsensusCount = sources.reduce((sum, source) => sum + (source.agentAnswer?.consensusAnswers ?? 0), 0);
  const agentReviewedItemCount = sources.reduce((sum, source) => sum + (source.agentReview?.agentReviewItems ?? 0), 0);
  const rawRankedEligibleCandidateCount = sources.reduce(
    (sum, source) => sum + (isRankedPracticeSource(source) && source.alignment?.rankedEligible ? source.alignment.totalCandidates : 0),
    0
  );
  const rankedEligibleCandidateCount = rawRankedEligibleCandidateCount + curatedPromotion.promotedQuestions;
  const activeCorpus = curatedPromotion.promotedQuestions > 0 ? {
    sourceType: curatedPromotion.sourceType,
    label: curatedPromotion.sourceType === "book_user_provided" ? "Active uploaded-book corpus" : "Active curated corpus",
    promotedQuestions: curatedPromotion.promotedQuestions,
    rankedUse: "ranked_practice" as const,
    policy: curatedPromotion.sourceType === "book_user_provided"
      ? "The active uploaded-book corpus is the ranked PYQ practice base. Optional source-discovery leads stay outside ranked tests until agent review, answer-key alignment, duplicate checks, topic tagging, and provenance pass."
      : "The active curated corpus is the ranked practice base. Optional source-discovery leads stay outside ranked tests until all import gates pass.",
    optionalLeadCandidates: alignedCandidateCount,
    quarantinedLeadCandidates: alignedCandidateCount,
    sourceDiscoveryLeads: sources.length,
    metadataOnlySources: sources.filter((source) => source.acquisitionState === "metadata_only").length,
    quarantinedFiles: ledger.quarantined?.length ?? 0
  } satisfies SscActiveCorpusAudit : undefined;
  const firstOpenBacklogAction = pyqBacklog.years?.find((year) => !year.rankedEligible)?.nextAction;
  const backlogSummary = pyqBacklog.target && pyqBacklog.totals ? {
    startYear: pyqBacklog.target.startYear ?? 0,
    endYear: pyqBacklog.target.endYear ?? 0,
    targetYears: pyqBacklog.target.targetYears ?? pyqBacklog.totals.yearsTargeted ?? 0,
    yearsWithOfficialPaper: pyqBacklog.totals.yearsWithOfficialPaper ?? 0,
    yearsWithAnyCandidate: pyqBacklog.totals.yearsWithAnyCandidate ?? 0,
    yearsWithUnverifiedWebLead: pyqBacklog.totals.yearsWithUnverifiedWebLead ?? 0,
    missingOfficialPaperYears: pyqBacklog.totals.missingOfficialPaperYears ?? 0,
    yearsWithCuratedImports: Math.max(pyqBacklog.totals.yearsWithCuratedImports ?? 0, curatedPromotion.rankedEligibleYears),
    rankedEligibleYears: Math.max(pyqBacklog.totals.rankedEligibleYears ?? 0, curatedPromotion.rankedEligibleYears),
    rankedEligibleQuestions: curatedPromotion.promotedQuestions || (pyqBacklog.totals.rankedEligibleQuestions ?? 0),
    nextAction: firstOpenBacklogAction ?? "Build the 50-year PYQ source backlog."
  } : undefined;

  return {
    generatedAt: manifest.generatedAt ?? pyqBacklog.generatedAt ?? ledger.generatedAt ?? "unknown",
    policy: manifest.policy ?? {},
    sourceLibrary: {
      sourceTypeCounts,
      topTags: Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 12)
        .map(([tag, count]) => ({ tag, count })),
      officialSources: sources.filter((source) => source.sourceType.startsWith("official")).length,
      webPdfSources: sources.filter((source) => source.sourceType === "web_pdf_unverified").length,
      scribdSources: sources.filter((source) => source.tags.some((tag) => /scribd/i.test(tag)) || /scribd/i.test(source.title)).length,
      bookReferenceSources: sources.filter((source) => source.tags.some((tag) => /book|reference/i.test(tag))).length,
      metadataOnlySources: sources.filter((source) => source.acquisitionState === "metadata_only").length,
      reviewedSources: sources.filter((source) => source.reviewStatus === "reviewed").length,
    },
    activeCorpus,
    pyqBacklog: backlogSummary,
    corpusCoverage: curatedPromotion.coverageYears.length > 0 ? {
      fullMockReadyYears: curatedPromotion.coverageYears.filter((year) => year.fullMockReady).length,
      years: curatedPromotion.coverageYears
    } : undefined,
    totals: {
      discoveredSources: sources.length,
      downloadedFiles: ledger.downloaded?.length ?? 0,
      quarantinedFiles: ledger.quarantined?.length ?? 0,
      extractedSources: extractions.size,
      segmentedSources: segmentations.size,
      alignedSources: alignments.size,
      alignedCandidates: alignedCandidateCount,
      agentAnswerConsensus: agentAnswerConsensusCount,
      agentReviewedItems: agentReviewedItemCount,
      curatedPromotedCandidates: curatedPromotion.promotedQuestions,
      rankedEligibleCandidates: rankedEligibleCandidateCount,
      quarantinedCandidates: Math.max(0, alignedCandidateCount - rankedEligibleCandidateCount)
    },
    sources
  };
}

export const getSscImportReviewDashboard = cache(readImportReviewDashboard);
export const getSscImportReviewDashboardForDataDir = readImportReviewDashboard;
