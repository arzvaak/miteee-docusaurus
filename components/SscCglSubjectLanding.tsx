"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Clock3,
  Gauge,
  Globe2,
  Languages,
  ListTree,
  Search,
  Sparkles,
  Target,
  X,
  type LucideIcon
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  parseReaderProgressStore,
  readerProgressStorageKey,
  type ReaderProgressEntry,
  type ReaderProgressStore
} from "@/lib/reader-progress";
import type {
  SscCglSubjectDefinition,
  SscCglSubjectLandingNote,
  SscCglSubjectLandingStats,
  SscCglSubjectStage
} from "@/lib/ssc-cgl-subjects";
import styles from "@/components/SscCglSubjectLanding.module.css";

type ReadingStatus = "not-started" | "in-progress" | "complete";
type StatusFilter = "all" | ReadingStatus;

const stageDefinitions: Array<{
  id: SscCglSubjectStage;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    id: "guide",
    eyebrow: "Stage 00",
    title: "Start here and set the method",
    description: "Combined guides, memory maps, and section systems that make the individual topics easier to place."
  },
  {
    id: "foundation",
    eyebrow: "Stage 01",
    title: "Build the foundation",
    description: "Core rules and structures that later topics expect you to recall without hesitation."
  },
  {
    id: "high-yield",
    eyebrow: "Stage 02",
    title: "Secure the score movers",
    description: "High-frequency topics where a clear method protects the largest share of marks."
  },
  {
    id: "speed",
    eyebrow: "Stage 03",
    title: "Convert knowledge into speed",
    description: "Pattern recognition and short methods for decisions that must survive the section clock."
  },
  {
    id: "revision",
    eyebrow: "Stage 04",
    title: "Close the revision loop",
    description: "Recall-heavy and precision topics to rotate after the foundation and high-yield lanes are stable."
  }
];

const subjectIcons = {
  reasoning: BrainCircuit,
  "general-awareness": Globe2,
  "quantitative-aptitude": Calculator,
  "english-comprehension": Languages
} satisfies Record<SscCglSubjectDefinition["section"], LucideIcon>;

const statusOptions: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "All notes" },
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "complete", label: "Completed" }
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function readProgressStore() {
  try {
    return parseReaderProgressStore(window.localStorage.getItem(readerProgressStorageKey));
  } catch {
    return {};
  }
}

function readingStatus(progress: number): ReadingStatus {
  if (progress >= 99) return "complete";
  if (progress > 0) return "in-progress";
  return "not-started";
}

function statusLabel(status: ReadingStatus) {
  if (status === "complete") return "Completed";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

export function SscCglSubjectLanding({
  notes,
  stats,
  subject
}: {
  notes: SscCglSubjectLandingNote[];
  stats: SscCglSubjectLandingStats;
  subject: SscCglSubjectDefinition;
}) {
  const [progressStore, setProgressStore] = useState<ReaderProgressStore>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const Icon = subjectIcons[subject.section];

  useEffect(() => {
    let cancelled = false;

    function syncProgress() {
      const next = readProgressStore();
      if (cancelled) return;
      setProgressStore(next);
      setProgressLoaded(true);
    }

    queueMicrotask(syncProgress);
    window.addEventListener("storage", syncProgress);
    window.addEventListener("reader-progress", syncProgress);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncProgress);
      window.removeEventListener("reader-progress", syncProgress);
    };
  }, []);

  const noteSlugs = useMemo(() => new Set(notes.map((note) => note.slug)), [notes]);
  const subjectProgress = useMemo(() => notes.map((note) => ({
    note,
    entry: progressStore[note.slug],
    progress: progressStore[note.slug]?.progress ?? 0
  })), [notes, progressStore]);
  const completedNotes = subjectProgress.filter((item) => item.progress >= 99).length;
  const startedNotes = subjectProgress.filter((item) => item.progress > 0).length;
  const averageProgress = notes.length > 0
    ? Math.round(subjectProgress.reduce((total, item) => total + item.progress, 0) / notes.length)
    : 0;
  const resumeEntry = useMemo(() => Object.values(progressStore)
    .filter((entry): entry is ReaderProgressEntry => noteSlugs.has(entry.slug) && entry.progress >= 2 && entry.progress < 99)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] ?? null, [noteSlugs, progressStore]);
  const resumeNote = resumeEntry ? notes.find((note) => note.slug === resumeEntry.slug) ?? null : null;
  const firstNote = notes[0] ?? null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    const progress = progressStore[note.slug]?.progress ?? 0;
    const statusMatches = statusFilter === "all" || readingStatus(progress) === statusFilter;
    const searchText = [note.label, note.title, note.description, note.stage, ...note.headings].join(" ").toLowerCase();
    return statusMatches && (!normalizedQuery || searchText.includes(normalizedQuery));
  });
  const visibleStages = stageDefinitions
    .map((stage) => ({ ...stage, notes: filteredNotes.filter((note) => note.stage === stage.id) }))
    .filter((stage) => stage.notes.length > 0);
  const statusCounts = statusOptions.reduce((counts, option) => {
    counts[option.id] = option.id === "all"
      ? notes.length
      : subjectProgress.filter((item) => readingStatus(item.progress) === option.id).length;
    return counts;
  }, {} as Record<StatusFilter, number>);
  const positionBySlug = new Map(notes.map((note, index) => [note.slug, index + 1]));

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  const primaryHref = resumeEntry && resumeNote
    ? `${resumeNote.studyHref}?resume=1`
    : firstNote?.studyHref ?? "/exams/ssc-cgl";
  const primaryLabel = resumeNote ? `Resume ${resumeNote.label}` : "Start the first topic";

  return (
    <div className={`${styles.page} ${styles[subject.tone]}`} data-ssc-subject-landing={subject.section}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/exams">Exams</Link>
        <span aria-hidden="true">/</span>
        <Link href="/exams/ssc-cgl">SSC CGL</Link>
        <span aria-hidden="true">/</span>
        <span>{subject.shortTitle}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ssc-subject-title">
        <div className={styles.heroCopy}>
          <div className={styles.heroIdentity}>
            <span className={styles.subjectIcon}><Icon size={25} aria-hidden="true" /></span>
            <span>
              <small>SSC CGL Tier-I subject</small>
              <strong>{subject.shortTitle}</strong>
            </span>
          </div>
          <h1 id="ssc-subject-title">{subject.title}</h1>
          <p>{subject.description}</p>
          <div className={styles.focusAreas} aria-label={`${subject.shortTitle} focus areas`}>
            {subject.focusAreas.map((focus) => <span key={focus}>{focus}</span>)}
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href={primaryHref}>
              <BookOpen size={17} aria-hidden="true" />
              <span>{primaryLabel}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} href={subject.cockpitHref}>
              <Target size={17} aria-hidden="true" /> 50/50 practice cockpit
            </Link>
            <Link className={styles.secondaryAction} href="/exams/ssc-cgl/practice">
              <Gauge size={17} aria-hidden="true" /> Question bank
            </Link>
          </div>
        </div>

        <aside className={styles.progressCard} aria-label={`${subject.shortTitle} reading progress`}>
          <div className={styles.progressCardHeading}>
            <span className={styles.progressIcon}><Sparkles size={18} aria-hidden="true" /></span>
            <span>
              <small>Saved on this device</small>
              <strong>{progressLoaded ? `${completedNotes}/${notes.length} topics completed` : "Checking reading progress"}</strong>
            </span>
          </div>
          <div className={styles.progressMeter} aria-label={`${averageProgress}% average reading progress`}>
            <i style={{ width: `${averageProgress}%` }} />
          </div>
          <div className={styles.progressFacts}>
            <span><strong>{progressLoaded ? startedNotes : "—"}</strong><small>started</small></span>
            <span><strong>{progressLoaded ? completedNotes : "—"}</strong><small>finished</small></span>
            <span><strong>{progressLoaded ? `${averageProgress}%` : "—"}</strong><small>overall</small></span>
          </div>
          <p>{subject.outcome}</p>
          {resumeEntry && resumeNote ? (
            <Link href={`${resumeNote.studyHref}?resume=1`}>Continue {resumeNote.label} <ArrowRight size={14} aria-hidden="true" /></Link>
          ) : firstNote ? (
            <Link href={firstNote.studyHref}>Begin with {firstNote.label} <ArrowRight size={14} aria-hidden="true" /></Link>
          ) : null}
        </aside>

        <div className={styles.statStrip} aria-label={`${subject.shortTitle} library facts`}>
          <span><strong>{formatNumber(stats.studyNotes)}</strong><small>study guides</small></span>
          <span><strong>{formatNumber(stats.canonicalTopics)}</strong><small>syllabus topics</small></span>
          <span><strong>{formatNumber(stats.reviewedQuestions)}</strong><small>practice questions</small></span>
          <span><strong>{formatNumber(stats.bookBackedQuestions)}</strong><small>source-backed</small></span>
        </div>
      </section>

      <section className={styles.tocSection} aria-labelledby="ssc-subject-toc-title">
        <header className={styles.tocHeader}>
          <div>
            <span className={styles.eyebrow}>Complete table of contents</span>
            <h2 id="ssc-subject-toc-title">Choose exactly what to study next.</h2>
            <p>Every topic is visible below. Search the contents, filter by your saved reading state, then move from study into practice without losing the subject map.</p>
          </div>
          <div className={styles.tocSummary} aria-live="polite">
            <ListTree size={18} aria-hidden="true" />
            <span><strong>{filteredNotes.length}</strong> of {notes.length} topics shown</span>
          </div>
        </header>

        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <Search size={18} aria-hidden="true" />
            <span className={styles.srOnly}>Search this subject</span>
            <input
              aria-label={`Search ${subject.shortTitle} topics`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${subject.shortTitle} topics and headings`}
              type="search"
              value={query}
            />
            {query ? <button aria-label="Clear topic search" onClick={() => setQuery("")} type="button"><X size={15} aria-hidden="true" /></button> : null}
          </label>
          <div className={styles.statusFilters} aria-label="Filter by reading status">
            {statusOptions.map((option) => (
              <button
                aria-pressed={statusFilter === option.id}
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                type="button"
              >
                {option.label} <span>{progressLoaded || option.id === "all" ? statusCounts[option.id] : "—"}</span>
              </button>
            ))}
          </div>
        </div>

        {visibleStages.length > 0 ? (
          <div className={styles.stageList}>
            {visibleStages.map((stage) => (
              <section className={styles.stage} key={stage.id} aria-labelledby={`ssc-stage-${stage.id}`}>
                <header className={styles.stageHeader}>
                  <span>{stage.eyebrow}</span>
                  <div>
                    <h3 id={`ssc-stage-${stage.id}`}>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                  <strong>{stage.notes.length} {stage.notes.length === 1 ? "topic" : "topics"}</strong>
                </header>
                <div className={styles.topicGrid}>
                  {stage.notes.map((note) => (
                    <SubjectTopicCard
                      key={note.slug}
                      note={note}
                      position={positionBySlug.get(note.slug) ?? 0}
                      progress={progressStore[note.slug]?.progress ?? 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={22} aria-hidden="true" />
            <span className={styles.eyebrow}>No matching topic</span>
            <h3>Nothing fits this search and status together.</h3>
            <p>Clear the filters to reopen the complete {subject.shortTitle} table of contents.</p>
            <button onClick={resetFilters} type="button">Show every note</button>
          </div>
        )}
      </section>
    </div>
  );
}

function SubjectTopicCard({ note, position, progress }: { note: SscCglSubjectLandingNote; position: number; progress: number }) {
  const status = readingStatus(progress);
  const compactHeadings = note.headings.filter((heading, index, headings) => heading && headings.indexOf(heading) === index).slice(0, 3);

  return (
    <article className={styles.topicCard} data-reading-status={status}>
      <div className={styles.topicTopline}>
        <span className={styles.topicNumber}>{String(position).padStart(2, "0")}</span>
        <span className={styles.stageBadge}>{note.stage === "guide" ? "Guide" : note.stage.replace("-", " ")}</span>
        <span className={styles.readingStatus}>
          {status === "complete" ? <CheckCircle2 size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}
          {statusLabel(status)}
        </span>
      </div>

      <div className={styles.topicCopy}>
        <Link href={note.studyHref}><h4>{note.label}</h4></Link>
        <p>{note.description}</p>
      </div>

      {compactHeadings.length > 0 ? (
        <div className={styles.headingPreview} aria-label={`${note.label} contents`}>
          <span>Inside</span>
          <div>{compactHeadings.map((heading) => <small key={heading}>{heading}</small>)}</div>
        </div>
      ) : null}

      {note.topicSlug ? (
        <div className={styles.corpusFacts}>
          <span><strong>{formatNumber(note.reviewedQuestions)}</strong><small>reviewed</small></span>
          <span><strong>{formatNumber(note.bookBackedQuestions)}</strong><small>book-backed</small></span>
          <span><strong>{formatNumber(note.gapRepairQuestions)}</strong><small>repair</small></span>
        </div>
      ) : (
        <div className={styles.guideNotice}><BookOpen size={15} aria-hidden="true" /> Combined subject guide</div>
      )}

      <div className={styles.cardProgress} aria-label={`${note.label}: ${progress}% read`}>
        <div><span>Reading progress</span><strong>{progress}%</strong></div>
        <span><i style={{ width: `${progress}%` }} /></span>
      </div>

      <div className={styles.cardActions}>
        <Link className={styles.studyAction} href={note.studyHref}>Study topic <ArrowRight size={14} aria-hidden="true" /></Link>
        {note.practiceHref ? <Link href={note.practiceHref}>Practice</Link> : null}
        {note.drillHref ? <Link href={note.drillHref}>Timed drill</Link> : null}
      </div>
    </article>
  );
}
