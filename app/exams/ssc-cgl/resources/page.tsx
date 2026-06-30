import Link from "next/link";
import { ArrowRight, BookOpenCheck, ExternalLink, FileText, Gauge, Landmark, LibraryBig, Newspaper, SearchCheck, Sparkles } from "lucide-react";
import { getSscCglResources, type SscCglResourceLane } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Resource Map",
  description: "Clean learner-facing SSC CGL resource map for the book-PYQ practice pool, official SSC anchors, model practice lanes, and outside source leads.",
  pathname: "/exams/ssc-cgl/resources"
});

const laneIcons = {
  "book-pyq": LibraryBig,
  official: Landmark,
  "web-pdf": FileText,
  "scribd-reference": SearchCheck,
  "model-practice": Sparkles,
  "discovery-tooling": Gauge,
  other: BookOpenCheck
} satisfies Record<SscCglResourceLane["id"], typeof LibraryBig>;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function ResourceLaneCard({ lane }: { lane: SscCglResourceLane }) {
  const Icon = laneIcons[lane.id];

  return (
    <article className={`ssc-resource-lane-card lane-${lane.id}`}>
      <div>
        <Icon size={20} aria-hidden="true" />
        <span>{formatNumber(lane.count)} leads</span>
      </div>
      <strong>{lane.label}</strong>
      <p>{lane.description}</p>
      <small>{lane.nextUse}</small>
    </article>
  );
}

export default function SscCglResourcesPage() {
  const resources = getSscCglResources();
  const primaryLanes = resources.lanes.filter((lane) => lane.count > 0);

  return (
    <section className="page ssc-page ssc-resource-page">
      <header className="panel ssc-hero ssc-resource-hero">
        <div>
          <p className="panel-kicker">SSC resource map</p>
          <h1>Sources organized for practice, not clutter.</h1>
          <p>The active study base is the book-backed question bank. This page keeps official anchors, outside resource leads, model-practice lanes, and discovery tools visible without mixing them into daily drills.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{formatNumber(resources.activePracticeQuestions)}</strong><small>active practice</small></span>
          <span><strong>{formatNumber(resources.bookBackedQuestions)}</strong><small>book-backed</small></span>
          <span><strong>{formatNumber(resources.totalCandidates)}</strong><small>resource leads</small></span>
          <span><strong>{resources.sourceRegistryCount}</strong><small>source lanes</small></span>
        </div>
      </header>

      <div className="ssc-action-grid ssc-resource-actions">
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/practice">
          <Gauge size={22} aria-hidden="true" />
          <strong>Practice every question</strong>
          <p>Use the book-backed bank topic by topic, one question at a time.</p>
          <span>Open bank <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/topics">
          <BookOpenCheck size={22} aria-hidden="true" />
          <strong>Read by sublevel</strong>
          <p>Jump from each topic note into its own practice queue.</p>
          <span>Open notes <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/current-affairs">
          <Newspaper size={22} aria-hidden="true" />
          <strong>Daily GA brief</strong>
          <p>Official-first facts converted into recall and MCQ seeds.</p>
          <span>Open brief <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
      </div>

      <section className="panel ssc-resource-priority">
        <div className="ssc-panel-heading">
          <LibraryBig size={18} aria-hidden="true" />
          <span className="micro-label">Primary lane</span>
          <strong>Daily study should start from the active question bank.</strong>
        </div>
        <div className="ssc-resource-priority-grid">
          <span><strong>{formatNumber(resources.bookBackedQuestions)}</strong><small>book-PYQ questions</small></span>
          <span><strong>46/46</strong><small>topic queues</small></span>
          <span><strong>36 sec</strong><small>target pace</small></span>
          <span><strong>200/200</strong><small>scoring target</small></span>
        </div>
        <p className="ssc-muted">Outside links are useful for expansion and checking coverage, but the actual score-building loop is: topic note, one-by-one practice, timed sprint, mistake repair, full mock.</p>
      </section>

      <section className="panel ssc-resource-lanes" aria-labelledby="ssc-resource-lanes-heading">
        <div className="ssc-panel-heading">
          <SearchCheck size={18} aria-hidden="true" />
          <span className="micro-label">Source lanes</span>
          <strong id="ssc-resource-lanes-heading">Where every resource belongs</strong>
        </div>
        <div className="ssc-resource-lane-grid">
          {primaryLanes.map((lane) => (
            <ResourceLaneCard lane={lane} key={lane.id} />
          ))}
        </div>
      </section>

      <section className="panel ssc-resource-list-panel" aria-labelledby="ssc-resource-list-heading">
        <div className="ssc-panel-heading">
          <FileText size={18} aria-hidden="true" />
          <span className="micro-label">Mapped leads</span>
          <strong id="ssc-resource-list-heading">Useful source links, grouped by study role</strong>
        </div>
        <div className="ssc-resource-lead-list">
          {primaryLanes.map((lane) => (
            <section className="ssc-resource-lead-group" key={lane.id} aria-labelledby={`lane-${lane.id}`}>
              <header>
                <strong id={`lane-${lane.id}`}>{lane.label}</strong>
                <span>{formatNumber(lane.count)} mapped</span>
              </header>
              <div>
                {lane.candidates.slice(0, 8).map((candidate) => (
                  <article className="ssc-resource-lead-card" key={candidate.id}>
                    <div>
                      <span>{candidate.statusLabel}</span>
                      <strong>{candidate.title}</strong>
                      <p>{candidate.snippet}</p>
                    </div>
                    <div className="ssc-resource-tags">
                      {candidate.tags.slice(0, 5).map((tag) => (
                        <em key={tag}>{tag}</em>
                      ))}
                    </div>
                    <a href={candidate.url} target="_blank" rel="noreferrer">
                      Open source <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="panel ssc-resource-footer">
        <span>Last resource map refresh: {resources.generatedAt}</span>
        <a href={resources.officialNoticeUrl} target="_blank" rel="noreferrer">Official SSC notice <ExternalLink size={14} aria-hidden="true" /></a>
        <Link href="/exams/ssc-cgl">Back to SSC command center <ArrowRight size={14} aria-hidden="true" /></Link>
      </footer>
    </section>
  );
}
