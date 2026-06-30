import Link from "next/link";
import { ArrowRight, Database, FileCheck2, FileSearch, ShieldAlert } from "lucide-react";
import { getSscImportReviewDashboard, type SscImportReviewSource } from "@/lib/ssc-cgl-import-review";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Source Library",
  description: "Source evidence for SSC CGL uploaded books, official leads, web PDFs, Scribd/reference lanes, and ranked practice coverage.",
  pathname: "/exams/ssc-cgl/import-review"
});

function gateLabel(gate: SscImportReviewSource["nextGate"]) {
  return {
    rights_review: "Rights review",
    download: "Download",
    ocr_or_text_extraction: "OCR/text extraction",
    segmentation_review: "Segmentation review",
    answer_key_review: "Answer-key review",
    topic_duplicate_review: "Topic + duplicate review",
    ready_for_curated_promotion: "Ready for curated promotion",
    blocked_metadata_only: "Metadata only"
  }[gate];
}

function StageMeter({ source }: { source: SscImportReviewSource }) {
  const stages = [
    { label: "Found", done: true },
    { label: "Collected", done: source.acquisitionState === "downloaded" || source.acquisitionState === "quarantined" },
    { label: "Extracted", done: Boolean(source.extraction) },
    { label: "Segmented", done: Boolean(source.segmentation) },
    { label: "Aligned", done: Boolean(source.alignment) },
    { label: "Ranked", done: source.alignment?.rankedEligible === true }
  ];

  return (
    <div className="ssc-review-stage-meter" aria-label={`${source.title} import stages`}>
      {stages.map((stage) => (
        <span className={stage.done ? "done" : ""} key={stage.label}>{stage.label}</span>
      ))}
    </div>
  );
}

export default function SscCglImportReviewPage() {
  const dashboard = getSscImportReviewDashboard();

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Source library</p>
          <h1>SSC CGL source evidence for the 200/200 bank.</h1>
          <p>The ranked practice base is the uploaded-book PYQ corpus. Official leads, web PDFs, Scribd/reference lanes, and source-discovery records stay visible here so the question bank has provenance without cluttering learner notes.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{dashboard.totals.discoveredSources}</strong><small>sources</small></span>
          <span><strong>{dashboard.sourceLibrary.bookReferenceSources}</strong><small>book/reference lanes</small></span>
          <span><strong>{dashboard.sourceLibrary.webPdfSources}</strong><small>web PDF leads</small></span>
          <span><strong>{dashboard.sourceLibrary.scribdSources}</strong><small>Scribd lanes</small></span>
          <span><strong>{dashboard.totals.downloadedFiles + dashboard.totals.quarantinedFiles}</strong><small>files staged</small></span>
          <span><strong>{dashboard.totals.alignedCandidates}</strong><small>review candidates</small></span>
          <span><strong>{dashboard.totals.agentAnswerConsensus}</strong><small>agent answers</small></span>
          <span><strong>{dashboard.totals.curatedPromotedCandidates.toLocaleString("en-IN")}</strong><small>ranked practice rows</small></span>
          <span><strong>{dashboard.totals.quarantinedCandidates}</strong><small>quarantined</small></span>
        </div>
      </header>

      <section className="panel ssc-review-policy">
        <div className="ssc-panel-heading"><Database size={18} aria-hidden="true" /><strong>Source mix</strong></div>
        <div className="ssc-review-policy-grid">
          <article>
            <strong>Uploaded books</strong>
            <p>{dashboard.activeCorpus?.promotedQuestions.toLocaleString("en-IN") ?? "0"} reviewed book-backed rows power ranked practice.</p>
          </article>
          <article>
            <strong>Official/open leads</strong>
            <p>{dashboard.sourceLibrary.officialSources} official or open-source discovery records are tracked for provenance and future refreshes.</p>
          </article>
          <article>
            <strong>Web PDFs</strong>
            <p>{dashboard.sourceLibrary.webPdfSources} web PDF leads are staged as optional evidence until review gates pass.</p>
          </article>
          <article>
            <strong>Scribd/reference lanes</strong>
            <p>{dashboard.sourceLibrary.scribdSources} Scribd lanes and {dashboard.sourceLibrary.bookReferenceSources} book/reference lanes are recorded for coverage planning.</p>
          </article>
        </div>
        {dashboard.sourceLibrary.topTags.length > 0 ? (
          <div className="ssc-topic-mastery-gates" aria-label="Top source tags">
            {dashboard.sourceLibrary.topTags.map((item) => (
              <span className="status-pass" key={item.tag}>{item.tag} · {item.count}</span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="panel ssc-review-policy">
        <div className="ssc-panel-heading"><ShieldAlert size={18} aria-hidden="true" /><strong>Ranked-entry rules</strong></div>
        <div className="ssc-review-policy-grid">
          {Object.entries(dashboard.policy).map(([key, value]) => (
            <article key={key}>
              <strong>{key}</strong>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      {dashboard.activeCorpus ? (
        <section className="panel ssc-review-policy">
          <div className="ssc-panel-heading"><FileCheck2 size={18} aria-hidden="true" /><strong>Active uploaded-book corpus</strong></div>
          <div className="ssc-score-grid">
            <span><strong>{dashboard.activeCorpus.promotedQuestions.toLocaleString("en-IN")}</strong><small>ranked book PYQs</small></span>
            <span><strong>{dashboard.activeCorpus.sourceType.replace(/_/g, " ")}</strong><small>active source type</small></span>
            <span><strong>{dashboard.activeCorpus.optionalLeadCandidates.toLocaleString("en-IN")}</strong><small>optional lead candidates</small></span>
            <span><strong>{dashboard.activeCorpus.quarantinedLeadCandidates.toLocaleString("en-IN")}</strong><small>outside ranked tests</small></span>
            <span><strong>{dashboard.activeCorpus.metadataOnlySources}</strong><small>metadata-only sources</small></span>
            <span><strong>{dashboard.activeCorpus.quarantinedFiles}</strong><small>quarantined files</small></span>
          </div>
          <p className="ssc-muted">This uploaded-book corpus is the active PYQ-style practice base. Optional discovery leads are visible below for evidence and future expansion, but they do not interrupt topic-wise practice.</p>
        </section>
      ) : null}

      {dashboard.pyqBacklog ? (
        <section className="panel ssc-review-policy">
          <div className="ssc-panel-heading"><Database size={18} aria-hidden="true" /><strong>Optional source-discovery leads</strong></div>
          <div className="ssc-score-grid">
            <span><strong>{dashboard.pyqBacklog.startYear}-{dashboard.pyqBacklog.endYear}</strong><small>target years</small></span>
            <span><strong>{dashboard.pyqBacklog.yearsWithOfficialPaper}</strong><small>official papers found</small></span>
            <span><strong>{dashboard.pyqBacklog.missingOfficialPaperYears}</strong><small>missing official papers</small></span>
            <span><strong>{dashboard.pyqBacklog.yearsWithCuratedImports}</strong><small>curated years</small></span>
            <span><strong>{dashboard.pyqBacklog.rankedEligibleYears}</strong><small>ranked-ready years</small></span>
            <span><strong>{dashboard.pyqBacklog.rankedEligibleQuestions}</strong><small>ranked PYQs</small></span>
          </div>
          <p className="ssc-muted">{dashboard.pyqBacklog.nextAction}</p>
        </section>
      ) : null}

      {dashboard.corpusCoverage ? (
        <section className="panel ssc-review-policy">
          <div className="ssc-panel-heading"><FileCheck2 size={18} aria-hidden="true" /><strong>Ranked corpus by year</strong></div>
          <div className="ssc-score-grid">
            <span><strong>{dashboard.corpusCoverage.years.length}</strong><small>promoted years</small></span>
            <span><strong>{dashboard.corpusCoverage.fullMockReadyYears}</strong><small>full-mock ready</small></span>
          </div>
          <div className="ssc-review-detail-grid">
            {dashboard.corpusCoverage.years.map((year) => (
              <article key={year.year}>
                <strong>{year.year} · {year.questionCount} questions · {year.sourceCount} sources</strong>
                <p>
                  Reasoning {year.sectionCounts.reasoning ?? 0} · GA {year.sectionCounts["general-awareness"] ?? 0} · Quant {year.sectionCounts["quantitative-aptitude"] ?? 0} · English {year.sectionCounts["english-comprehension"] ?? 0}
                </p>
                <small>{year.fullMockReady ? "full-mock ready" : `${year.missingForBalancedMock} more balanced questions needed`}</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="ssc-review-source-list" aria-label="SSC CGL source library evidence">
        {dashboard.sources.map((source) => (
          <article className="panel ssc-review-source-card" key={source.id}>
            <div className="ssc-review-source-head">
              <FileSearch size={20} aria-hidden="true" />
              <div>
                <p className="panel-kicker">{source.sourceType} · {source.reviewStatus}</p>
                <h2>{source.title}</h2>
              </div>
              <span className={`ssc-status status-${source.acquisitionState}`}>{source.acquisitionState.replace(/_/g, " ")}</span>
            </div>

            <StageMeter source={source} />

            <div className="ssc-review-meta-grid">
              <span><Database size={16} aria-hidden="true" /><strong>{gateLabel(source.nextGate)}</strong><small>next gate</small></span>
              <span><FileCheck2 size={16} aria-hidden="true" /><strong>{source.segmentation?.candidateCount ?? 0}</strong><small>candidates</small></span>
              <span><ShieldAlert size={16} aria-hidden="true" /><strong>{source.alignment?.missing ?? 0}</strong><small>missing keys</small></span>
            </div>

            <p className="ssc-muted">{source.actionRequired}</p>
            <p className="ssc-review-policy-note">{source.publishPolicy}</p>

            <div className="ssc-review-detail-grid">
              {source.download ? (
                <article>
                  <strong>Downloaded file</strong>
                  <p>{source.download.bytes.toLocaleString("en-IN")} bytes · SHA-256 {source.download.sha256.slice(0, 12)}...</p>
                </article>
              ) : null}
              {source.quarantine ? (
                <article>
                  <strong>Quarantined file</strong>
                  <p>{source.quarantine.bytes.toLocaleString("en-IN")} bytes · SHA-256 {source.quarantine.sha256.slice(0, 12)}...</p>
                </article>
              ) : null}
              {source.extraction ? (
                <article>
                  <strong>Extraction</strong>
                  <p>{source.extraction.pageCount} pages · {source.extraction.questionSignals} question-like signals · {source.extraction.reviewStatus}</p>
                </article>
              ) : null}
              {source.alignment ? (
                <article>
                  <strong>Answer-key alignment</strong>
                  <p>{source.alignment.matched} matched · {source.alignment.mismatched} mismatched · {source.alignment.missing} missing · rankedEligible: {String(source.alignment.rankedEligible)}</p>
                </article>
              ) : null}
              {source.agentAnswer ? (
                <article>
                  <strong>Agent answer consensus</strong>
                  <p>{source.agentAnswer.consensusAnswers} consensus · {source.agentAnswer.decisionsAccepted} decisions accepted · rankedEligible: {String(source.agentAnswer.rankedEligible)}</p>
                </article>
              ) : null}
              {source.agentReview ? (
                <article>
                  <strong>Agent curation review</strong>
                  <p>{source.agentReview.agentReviewItems} items · {source.agentReview.decisionsAccepted} decisions accepted · rankedEligible: {String(source.agentReview.rankedEligible)}</p>
                </article>
              ) : null}
            </div>

            {source.sampleCandidates.length > 0 ? (
              <details className="ssc-review-candidates">
                <summary>Review sample candidates</summary>
                <div>
                  {source.sampleCandidates.map((candidate) => (
                    <article key={candidate.id}>
                      <strong>Q{candidate.questionNumber} · page {candidate.pageNumber} · {candidate.alignmentStatus}</strong>
                      <p>{candidate.stem}</p>
                      <small>rankedEligible: {String(candidate.rankedEligible)}</small>
                    </article>
                  ))}
                </div>
              </details>
            ) : null}

            <footer className="ssc-current-footer">
              <a href={source.url} target="_blank" rel="noreferrer">Open source <ArrowRight size={14} aria-hidden="true" /></a>
              <span>{source.tags.join(" · ") || "untagged"}</span>
            </footer>
          </article>
        ))}
      </section>

      <Link className="button ghost" href="/exams/ssc-cgl">Back to SSC CGL dashboard</Link>
    </section>
  );
}
