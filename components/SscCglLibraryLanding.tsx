"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Globe2,
  Languages,
  LibraryBig,
  Newspaper,
  Search,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CourseNavigationGroup, CourseNavigationItem } from "@/lib/content";
import {
  parseReaderProgressStore,
  readerProgressStorageKey,
  type ReaderProgressEntry,
  type ReaderProgressStore
} from "@/lib/reader-progress";
import {
  sscCglSubjectDefinitions,
  sscCglSubjectHref,
  sscCglTopicSlugFromNote,
  type SscCglSubjectDefinition
} from "@/lib/ssc-cgl-subjects";
import styles from "@/components/SscCglLibraryLanding.module.css";

type CorpusSection = {
  section: string;
  title: string;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  drillHref: string;
};

type SscCglLibraryLandingProps = {
  groups: CourseNavigationGroup[];
  corpus: {
    reviewedQuestions: number;
    fullMocks: number;
    sections: CorpusSection[];
  };
};

type SubjectDefinition = {
  section: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  tone: "blue" | "amber" | "violet" | "green";
};

const subjectIcons: Record<SscCglSubjectDefinition["section"], LucideIcon> = {
  reasoning: BrainCircuit,
  "general-awareness": Globe2,
  "quantitative-aptitude": Calculator,
  "english-comprehension": Languages
};
const subjectDefinitions = Object.fromEntries(sscCglSubjectDefinitions.map((definition) => [
  definition.groupKey,
  {
    section: definition.section,
    shortTitle: definition.shortTitle,
    description: definition.cardDescription,
    icon: subjectIcons[definition.section],
    tone: definition.tone
  }
])) as Record<string, SubjectDefinition>;

function fallbackSubjectDefinition(group: CourseNavigationGroup): SubjectDefinition {
  return {
    section: group.key.replace(/^ssc-cgl-/, ""),
    shortTitle: group.label,
    description: "Study notes and exam-focused practice for this SSC CGL section.",
    icon: BookOpen,
    tone: "blue"
  };
}

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

function subjectProgress(group: CourseNavigationGroup, progressStore: ReaderProgressStore) {
  const entries = group.notes
    .map((note) => progressStore[note.slug])
    .filter((entry): entry is ReaderProgressEntry => Boolean(entry));
  const started = entries.filter((entry) => entry.progress > 0).length;
  const completed = entries.filter((entry) => entry.progress >= 99).length;
  const readingPercent = group.notes.length > 0
    ? Math.round(entries.reduce((total, entry) => total + entry.progress, 0) / group.notes.length)
    : 0;
  const lastUpdatedAt = entries.reduce((latest, entry) => {
    const timestamp = Date.parse(entry.updatedAt);
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, 0);

  return { started, completed, readingPercent, lastUpdatedAt, active: started > 0 };
}

function featuredNotes(group: CourseNavigationGroup, progressStore: ReaderProgressStore) {
  return [...group.notes]
    .sort((a, b) => {
      const aUpdated = Date.parse(progressStore[a.slug]?.updatedAt || "") || 0;
      const bUpdated = Date.parse(progressStore[b.slug]?.updatedAt || "") || 0;
      return bUpdated - aUpdated;
    })
    .slice(0, 3);
}

function studyHrefForNote(groupKey: string, noteSlug: string) {
  const subject = sscCglSubjectDefinitions.find((definition) => definition.groupKey === groupKey);
  if (!subject) return "/exams/ssc-cgl";
  const topicSlug = sscCglTopicSlugFromNote(subject, noteSlug);
  return topicSlug ? `/exams/ssc-cgl/topics/${topicSlug}` : sscCglSubjectHref(subject.section);
}

export function SscCglLibraryLanding({ groups, corpus }: SscCglLibraryLandingProps) {
  const [progressStore, setProgressStore] = useState<ReaderProgressStore>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [query, setQuery] = useState("");

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

  const subjects = useMemo(() => groups.map((group, index) => {
    const definition = subjectDefinitions[group.key] || fallbackSubjectDefinition(group);
    const progress = subjectProgress(group, progressStore);
    const corpusSection = corpus.sections.find((section) => section.section === definition.section);
    return {
      group,
      definition,
      progress,
      corpusSection,
      featuredNotes: featuredNotes(group, progressStore),
      originalIndex: index
    };
  }).sort((a, b) => {
    if (a.progress.active !== b.progress.active) return a.progress.active ? -1 : 1;
    if (a.progress.lastUpdatedAt !== b.progress.lastUpdatedAt) return b.progress.lastUpdatedAt - a.progress.lastUpdatedAt;
    return a.originalIndex - b.originalIndex;
  }), [corpus.sections, groups, progressStore]);

  const courseSlugs = useMemo(() => new Set(groups.flatMap((group) => group.notes.map((note) => note.slug))), [groups]);
  const resumeEntry = useMemo(() => Object.values(progressStore)
    .filter((entry) => courseSlugs.has(entry.slug) && entry.progress >= 2 && entry.progress < 99)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] || null, [courseSlugs, progressStore]);
  const activeSubjectCount = subjects.filter((subject) => subject.progress.active).length;
  const totalNotes = groups.reduce((total, group) => total + group.notes.length, 0);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSubjects = subjects.map((subject) => {
    if (!normalizedQuery || subject.group.label.toLowerCase().includes(normalizedQuery)) return subject;
    return {
      ...subject,
      group: {
        ...subject.group,
        notes: subject.group.notes.filter((note) => `${note.label} ${note.title} ${note.headings.join(" ")}`.toLowerCase().includes(normalizedQuery))
      }
    };
  }).filter((subject) => subject.group.notes.length > 0);
  const visibleNoteCount = visibleSubjects.reduce((total, subject) => total + subject.group.notes.length, 0);
  const firstSubject = subjects[0] ?? null;
  const firstNote = firstSubject?.group.notes[0] || null;
  const firstNoteHref = firstSubject && firstNote ? studyHrefForNote(firstSubject.group.key, firstNote.slug) : null;
  const resumeGroup = resumeEntry ? groups.find((group) => group.notes.some((note) => note.slug === resumeEntry.slug)) : null;
  const resumeHref = resumeEntry && resumeGroup ? `${studyHrefForNote(resumeGroup.key, resumeEntry.slug)}?resume=1` : null;

  return (
    <div className={styles.page} data-ssc-library-landing="true">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/exams">Exams</Link>
        <span aria-hidden="true">/</span>
        <span>SSC CGL</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ssc-library-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>SSC CGL Tier-I exam</span>
          <h1 id="ssc-library-title">Build each subject. Then test it.</h1>
          <p>Choose one of the four Tier-I subjects, learn a focused topic, then practise it at exam pace. Your lessons and tests stay separate, but always connected.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/exams/ssc-cgl/tests">
              <ClipboardCheck size={17} aria-hidden="true" /> Start a test <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} href="/exams/ssc-cgl/practice">
              <LibraryBig size={17} aria-hidden="true" /> Question bank
            </Link>
            <Link className={styles.secondaryAction} href="/exams/ssc-cgl/current-affairs">
              <Newspaper size={17} aria-hidden="true" /> Current affairs
            </Link>
            <Link className={styles.secondaryAction} href="/exams/ssc-cgl/statboard">
              <BarChart3 size={17} aria-hidden="true" /> My statboard
            </Link>
          </div>
        </div>

        <aside className={styles.continueCard} aria-label="Reading status">
          {resumeEntry && resumeHref ? (
            <>
              <span>Continue reading</span>
              <strong>{resumeEntry.title}</strong>
              <div className={styles.continueProgress}>
                <span aria-hidden="true"><i style={{ width: `${resumeEntry.progress}%` }} /></span>
                <small>{resumeEntry.progress}% read</small>
              </div>
              <Link href={resumeHref}>Resume topic <ArrowRight size={15} aria-hidden="true" /></Link>
            </>
          ) : (
            <>
              <span>Start studying</span>
              <strong>{firstNote?.label || "Choose your first subject"}</strong>
              <p>Your reading progress begins only after you open a topic. Nothing is marked complete in advance.</p>
              {firstNote && firstNoteHref ? <Link href={firstNoteHref}>Open first topic <ArrowRight size={15} aria-hidden="true" /></Link> : null}
            </>
          )}
        </aside>

        <div className={styles.corpusStrip} aria-label="SSC CGL library facts">
          <span><strong>{formatNumber(totalNotes)}</strong><small>Study topics</small></span>
          <span><strong>{formatNumber(corpus.reviewedQuestions)}</strong><small>Practice questions</small></span>
          <span><strong>{formatNumber(groups.length)}</strong><small>Tier-I subjects</small></span>
          <span><strong>{formatNumber(corpus.fullMocks)}</strong><small>Full mocks</small></span>
        </div>
      </section>

      <section className={styles.subjectSection} aria-labelledby="ssc-subjects-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Your subjects</span>
            <h2 id="ssc-subjects-title">Four sections, clearly separated.</h2>
            <p>Each subject keeps its topics, progress, and practice routes together.</p>
          </div>
          <div className={styles.activeNotice} aria-live="polite">
            <Sparkles size={16} aria-hidden="true" />
            {!progressLoaded
              ? "Loading saved progress"
              : activeSubjectCount > 0
                ? `${activeSubjectCount} active ${activeSubjectCount === 1 ? "subject" : "subjects"} shown first`
                : "No subject started yet"}
          </div>
        </div>

        <div className={styles.subjectGrid}>
          {subjects.map((subject) => (
            <SubjectCard key={subject.group.key} progressStore={progressStore} subject={subject} />
          ))}
        </div>
      </section>

      <section className={styles.syllabusSection} aria-labelledby="ssc-syllabus-title" id="ssc-syllabus">
        <div className={styles.syllabusHeader}>
          <div>
            <span className={styles.eyebrow}>Browse all</span>
            <h2 id="ssc-syllabus-title">The complete syllabus, folded neatly.</h2>
            <p>Open only the subject you need. Search expands matching topics automatically.</p>
          </div>
          <label className={styles.searchBox}>
            <Search size={17} aria-hidden="true" />
            <span className={styles.srOnly}>Search SSC CGL topics</span>
            <input
              aria-label="Search SSC CGL topics"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all topics"
              type="search"
              value={query}
            />
            <small>{visibleNoteCount} of {totalNotes}</small>
          </label>
        </div>

        {visibleSubjects.length > 0 ? (
          <div className={styles.syllabusList}>
            {visibleSubjects.map((subject) => {
              const Icon = subject.definition.icon;
              return (
                <details
                  className={`${styles.syllabusGroup} ${styles[subject.definition.tone]}`}
                  id={`ssc-subject-${subject.definition.section}`}
                  key={subject.group.key}
                  open={normalizedQuery ? true : undefined}
                >
                  <summary>
                    <span className={styles.subjectIcon}><Icon size={19} aria-hidden="true" /></span>
                    <span><strong>{subject.group.label}</strong><small>{subject.group.notes.length} notes · {subject.progress.started} started</small></span>
                    <ChevronDown size={17} aria-hidden="true" />
                  </summary>
                  <div className={styles.noteGrid}>
                    {subject.group.notes.map((note) => (
                      <SyllabusNote groupKey={subject.group.key} key={note.slug} note={note} progress={progressStore[note.slug]?.progress} />
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>No SSC CGL topic matches “{query.trim()}”.</div>
        )}
      </section>
    </div>
  );
}

type SubjectRow = {
  group: CourseNavigationGroup;
  definition: SubjectDefinition;
  progress: ReturnType<typeof subjectProgress>;
  corpusSection: CorpusSection | undefined;
  featuredNotes: CourseNavigationItem[];
  originalIndex: number;
};

function SubjectCard({ progressStore, subject }: { progressStore: ReaderProgressStore; subject: SubjectRow }) {
  const Icon = subject.definition.icon;
  const subjectHref = sscCglSubjectHref(subject.definition.section);
  const progressLabel = subject.progress.active
    ? `${subject.progress.started} started · ${subject.progress.completed} finished`
    : "Not started";

  return (
    <article className={`${styles.subjectCard} ${styles[subject.definition.tone]} ${subject.progress.active ? styles.activeCard : ""}`}>
      <Link className={styles.subjectMainLink} href={subjectHref} aria-label={`Open ${subject.definition.shortTitle} subject home`}>
        <div className={styles.subjectCardTop}>
          <span className={styles.subjectIcon}><Icon size={23} aria-hidden="true" /></span>
          <span className={styles.subjectIndex}>{String(subject.originalIndex + 1).padStart(2, "0")}</span>
        </div>
        <div className={styles.subjectTitleRow}>
          <div>
            <span>{subject.progress.active ? "In progress" : "Tier-I subject"}</span>
            <h3>{subject.definition.shortTitle}</h3>
          </div>
          {subject.progress.completed > 0 ? <CheckCircle2 size={18} aria-label={`${subject.progress.completed} notes finished`} /> : null}
        </div>
        <p>{subject.definition.description}</p>

        <div className={styles.subjectFacts}>
          <span><strong>{subject.group.notes.length}</strong><small>Study topics</small></span>
          <span><strong>{formatNumber(subject.corpusSection?.reviewedQuestions || 0)}</strong><small>Practice questions</small></span>
          <span><strong>{formatNumber(subject.corpusSection?.bookBackedQuestions || 0)}</strong><small>Source-backed</small></span>
        </div>
      </Link>

      <div className={styles.readingProgress} aria-label={`Saved reading progress: ${subject.progress.readingPercent}%`}>
        <div><span>Saved reading progress</span><strong>{subject.progress.readingPercent}%</strong></div>
        <span className={styles.progressTrack} aria-hidden="true"><i style={{ width: `${subject.progress.readingPercent}%` }} /></span>
        <small>{progressLabel}</small>
      </div>

      <div className={styles.featuredTopics}>
        <span>{subject.progress.active ? "Continue in this subject" : "Start with"}</span>
        {subject.featuredNotes.map((note) => (
          <Link href={studyHrefForNote(subject.group.key, note.slug)} key={note.slug}>
            <span>{note.label}</span>
            {progressStore[note.slug]?.progress ? <small>{progressStore[note.slug]!.progress}%</small> : <ArrowRight size={13} aria-hidden="true" />}
          </Link>
        ))}
      </div>

      <div className={styles.cardActions}>
        <Link className={styles.openSubject} href={subjectHref}>Open subject <ArrowRight size={14} aria-hidden="true" /></Link>
        {subject.corpusSection ? <Link href={subject.corpusSection.drillHref}>Practice section</Link> : null}
      </div>
    </article>
  );
}

function SyllabusNote({ groupKey, note, progress }: { groupKey: string; note: CourseNavigationItem; progress?: number }) {
  return (
    <Link className={styles.noteLink} href={studyHrefForNote(groupKey, note.slug)}>
      <span>
        <strong>{note.label}</strong>
        <small>{progress ? `${progress}% read` : "Topic guide"}</small>
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </Link>
  );
}
