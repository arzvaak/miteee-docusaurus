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
  description: "An undergraduate progress report on whether team composition helps predict professional VALORANT maps before play begins.",
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
        <p className="eyebrow">Undergraduate research · Work in progress</p>
        <h1>Pre-match outcome prediction in professional VALORANT</h1>
        <p className="research-publication-deck">What I found after comparing team strength, agent picks and patch changes across 1,684 professional maps.</p>
        <p className="research-publication-meta">
          <span>Progress report</span>
          <span>13 July 2026</span>
          <span>Developmental analysis</span>
        </p>
      </header>

      <aside className="research-status-note" aria-label="Research status">
        <strong>This is still a progress report.</strong> I used the current maps while building and checking the models, so I still need to test the final version on a future tournament.
      </aside>

      <article className="article research-report-body">
        <MarkdownNote content={report.content} sectionName="VALORANT preliminary research progress report" />
      </article>
    </div>
  );
}
