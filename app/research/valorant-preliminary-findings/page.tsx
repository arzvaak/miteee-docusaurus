import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MarkdownNote } from "@/components/MarkdownNote";
import { getNote } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

const reportSlug = "research-valorant-preliminary-findings-index";
const reportPath = "/research/valorant-preliminary-findings";

export const metadata = buildPageMetadata({
  title: "Preliminary VALORANT research findings",
  description: "Exploratory findings on whether team strength, agent composition, and patch changes improve pre-match prediction in professional VALORANT.",
  pathname: reportPath
});

export default function ValorantPreliminaryFindingsPage() {
  const report = getNote(reportSlug);
  if (!report) notFound();

  return (
    <div className="page research-publication">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", pathname: "/" },
          { name: "Research", pathname: reportPath },
          { name: "VALORANT preliminary findings", pathname: reportPath }
        ])}
      />
      <header className="research-publication-header">
        <Link className="research-back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Home
        </Link>
        <p className="eyebrow">Research · Preliminary exploratory findings</p>
        <h1>Pre-match outcome prediction in professional VALORANT</h1>
        <p className="research-publication-deck">Team strength, agent composition and patch changes across 1,684 professional maps.</p>
        <p className="research-publication-meta">
          <span>Progress report</span>
          <span>13 July 2026</span>
          <span>Developmental analysis</span>
        </p>
      </header>

      <aside className="research-status-note" aria-label="Research status">
        <strong>How to read this:</strong> these are exploratory findings, not final confirmation. The current maps were used during model development; a separate future tournament is still needed for the final test.
      </aside>

      <article className="article research-report-body">
        <MarkdownNote content={report.content} sectionName="VALORANT preliminary research progress report" />
      </article>
    </div>
  );
}
