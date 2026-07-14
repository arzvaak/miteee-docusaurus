import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileText, ListChecks, Sigma } from "lucide-react";
import { ActiveRecallPanel } from "@/components/ActiveRecallPanel";
import { JsonLd } from "@/components/JsonLd";
import { MarkdownNote } from "@/components/MarkdownNote";
import { NoteQuizClient } from "@/components/NoteQuizClient";
import { NoteMemoryPanel } from "@/components/NoteMemoryPanel";
import { NotePracticePanel } from "@/components/NotePracticePanel";
import { PreviewCard } from "@/components/PreviewLink";
import { ReaderCourseNavigator, ReaderFocusButton, ReaderGuideRail, ReaderKeyboardShortcuts, ReaderOutlineNav, ReaderQuestionNavigator, ReaderQuickActions, ReaderToolsPanel } from "@/components/ReaderControls";
import { ReaderProgressPanel } from "@/components/ReaderProgressPanel";
import { getNote, getNoteNavigation, getResolvedPreviewsForNote, getSearchCandidates, toNotePreview } from "@/lib/content";
import type { NotePreview } from "@/lib/content";
import { buildHeadingAnchors, buildQuestionAnchors } from "@/lib/heading-anchors";
import { buildFormulaReaderSignal, type FormulaReaderSignal } from "@/lib/note-reader-signals";
import { buildNotePractice } from "@/lib/note-practice";
import { buildBreadcrumbJsonLd, buildNoteJsonLd, buildPageMetadata, noteDescription } from "@/lib/seo";
import type { QuizSet } from "@/scripts/build-content-data";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return buildPageMetadata({
    title: note.sidebarLabel || note.title,
    description: noteDescription(note),
    pathname: `/notes/${note.slug}`
  });
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const related = getResolvedPreviewsForNote(note);
  const navigation = getNoteNavigation(note);
  const previewCandidates = getSearchCandidates();
  const outline = buildHeadingAnchors(note.headings, 48);
  const questionAnchors = buildQuestionAnchors(note.headings, 400);
  const practice = buildNotePractice(note);
  const formulaSignal = buildFormulaReaderSignal(note.stats);
  const isTechnicalNote = note.stats.mathBlocks >= 20 || note.stats.questionBlocks >= 8 || note.stats.codeBlocks >= 4;
  const quizQuestionCount = note.stats.quizBlocks ?? 0;

  return (
    <div className="page note-page">
      <ReaderKeyboardShortcuts previous={navigation.previous} next={navigation.next} />
      <JsonLd
        data={[
          buildNoteJsonLd(note),
          buildBreadcrumbJsonLd([
            { name: "Home", pathname: "/" },
            { name: "Courses", pathname: "/courses" },
            { name: note.courseCode || "Note", pathname: note.courseCode ? `/courses/${note.courseCode}` : "/" },
            { name: note.sidebarLabel || note.title, pathname: `/notes/${note.slug}` }
          ])
        ]}
      />
      <section className="reader-layout">
        <a className="reader-skip-link" href="#lesson-content">
          Read lesson
        </a>
        <ReaderGuideRail>
          <Link className="button ghost back-link" href={note.courseCode ? `/courses/${note.courseCode}` : "/courses"}>
            <ArrowLeft size={15} aria-hidden="true" /> Course
          </Link>
          <div className="reader-meta-card">
            <span className="micro-label">{note.courseCode || "MITEEE"}</span>
            <h2>{note.courseName || "Study note"}</h2>
            <p>{note.excerpt}</p>
          </div>
          <ReaderQuestionNavigator questions={questionAnchors} />
          <ReaderOutlineNav outline={outline} />
          <ReaderCourseNavigator groups={navigation.groups} courseLabel={note.courseName || note.courseCode || "this course"} />
        </ReaderGuideRail>

        <article id="lesson-content" className={isTechnicalNote ? "article technical-article" : "article"}>
          <header className="article-header">
            <ReaderBreadcrumbs courseCode={note.courseCode} courseName={note.courseName} week={note.week} />
            <p className="eyebrow">{note.courseCode || "MITEEE"}{note.week ? ` · Week ${note.week}` : ""}</p>
            <h1>{note.sidebarLabel || note.title}</h1>
            <ReaderFocusButton />
            <ReaderQuickActions />
            <LessonSequence previous={navigation.previous} next={navigation.next} position={navigation.position} total={navigation.total} />
          </header>
          <NoteQuizSetsPanel noteTitle={note.sidebarLabel || note.title} quizSets={note.quizSets || []} />
          <div id="lesson-body" className="lesson-body-anchor" aria-hidden="true" />
          <NoteQuizClient />
          <MarkdownNote content={note.content} previews={previewCandidates} />
          <LessonSequence previous={navigation.previous} next={navigation.next} position={navigation.position} total={navigation.total} footer />
          <ContinueReadingStrip courseCode={note.courseCode} />
          <RelatedLessonsSection previews={related} />
        </article>

        <ReaderToolsPanel>
          <div className="reader-signal-grid" aria-label="Lesson signals">
            <Signal icon={<ListChecks size={16} aria-hidden="true" />} label="Questions" value={note.stats.questionBlocks + quizQuestionCount} />
            <Signal icon={<ClipboardList size={16} aria-hidden="true" />} label="Drills" value={quizQuestionCount} />
            <Signal icon={<Sigma size={16} aria-hidden="true" />} label="Math" value={note.stats.mathBlocks} />
            <Signal icon={<FileText size={16} aria-hidden="true" />} label="Code" value={note.stats.codeBlocks} />
            <Signal icon={<BookOpen size={16} aria-hidden="true" />} label="Headings" value={note.headings.length} />
          </div>
          <FormulaReaderCard signal={formulaSignal} />
          <ReaderProgressPanel note={{ slug: note.slug, title: note.sidebarLabel || note.title, courseCode: note.courseCode, courseName: note.courseName }} />
          <ActiveRecallPanel />
          <NotePracticePanel practice={practice} />
          <NoteMemoryPanel note={{ slug: note.slug, title: note.sidebarLabel || note.title, courseCode: note.courseCode, courseName: note.courseName }} />
          <div className="linked-preview-rail">
            <span className="micro-label">Related notes</span>
            <div className="related-list">
              {related.length > 0 ? related.map((preview) => <PreviewCard key={preview.slug} preview={preview} compact />) : <PreviewCard preview={toNotePreview(note)} compact />}
            </div>
          </div>
        </ReaderToolsPanel>
      </section>
    </div>
  );
}

function ReaderBreadcrumbs({ courseCode, courseName, week }: { courseCode: string | null; courseName: string | null; week: number | null }) {
  return (
    <nav className="reader-breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      <Link href="/courses">Library</Link>
      {courseCode && (
        <>
          <span>/</span>
          <Link href={`/courses/${courseCode}`}>{courseName || courseCode}</Link>
        </>
      )}
      {week && (
        <>
          <span>/</span>
          <span>Week {week}</span>
        </>
      )}
    </nav>
  );
}

function LessonSequence({
  previous,
  next,
  position,
  total,
  footer = false
}: {
  previous: NotePreview | null;
  next: NotePreview | null;
  position: number;
  total: number;
  footer?: boolean;
}) {
  return (
    <nav className={footer ? "lesson-sequence footer" : "lesson-sequence"} aria-label="Lesson sequence">
      <span className="lesson-count">{position} / {total}</span>
      {previous ? (
        <Link
          prefetch={false}
          className="lesson-step previous"
          href={`/notes/${previous.slug}`}
          aria-label={`Previous lesson: ${previous.label}`}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="lesson-step-copy">
            <small>Previous lesson</small>
            <span className="lesson-step-title">
              <span className="sr-only">: </span>
              <span className="lesson-step-separator" aria-hidden="true"></span>
              <strong>{previous.label}</strong>
            </span>
          </span>
        </Link>
      ) : (
        <span className="lesson-step disabled previous">
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="lesson-step-copy">
            <small>Previous lesson</small>
            <span className="lesson-step-title">
              <span className="sr-only">: </span>
              <span className="lesson-step-separator" aria-hidden="true"></span>
              <strong>Start of course</strong>
            </span>
          </span>
        </span>
      )}
      {next ? (
        <Link
          prefetch={false}
          className="lesson-step next"
          href={`/notes/${next.slug}`}
          aria-label={`Next lesson: ${next.label}`}
        >
          <span className="lesson-step-copy">
            <small>Next lesson</small>
            <span className="lesson-step-title">
              <span className="sr-only">: </span>
              <strong>{next.label}</strong>
              <span className="lesson-step-separator" aria-hidden="true"></span>
            </span>
          </span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      ) : (
        <span className="lesson-step disabled next">
          <span className="lesson-step-copy">
            <small>Next lesson</small>
            <span className="lesson-step-title">
              <span className="sr-only">: </span>
              <strong>End of course</strong>
              <span className="lesson-step-separator" aria-hidden="true"></span>
            </span>
          </span>
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

function ContinueReadingStrip({ courseCode }: { courseCode: string | null }) {
  return (
    <nav className="continue-strip" aria-label="Continue reading">
      <span className="continue-strip-copy">
        <small>Course map</small>
        <strong>Zoom out and choose your next lesson</strong>
      </span>
      <Link className="button primary" href={courseCode ? `/courses/${courseCode}` : "/courses"}>
        Open {courseCode || "course"} index <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </nav>
  );
}

function RelatedLessonsSection({ previews }: { previews: NotePreview[] }) {
  if (previews.length === 0) return null;

  return (
    <section className="related-lessons-section" aria-label="Related lessons">
      <div className="related-lessons-heading">
        <div>
          <span className="micro-label">Related lessons</span>
          <h2>Keep the momentum going</h2>
        </div>
        <p>Nearby lessons, stripped down to the signals that help you choose quickly.</p>
      </div>
      <div className="related-lesson-grid">
        {previews.slice(0, 3).map((preview, index) => {
          const signals = [
            { count: preview.stats.mathBlocks, label: "formulas", icon: <Sigma size={13} aria-hidden="true" /> },
            { count: preview.stats.questionBlocks, label: "questions", icon: <ClipboardList size={13} aria-hidden="true" /> },
            { count: preview.stats.codeBlocks, label: "code blocks", icon: <FileText size={13} aria-hidden="true" /> }
          ].filter((signal) => signal.count > 0).slice(0, 2);

          return (
            <Link
              prefetch={false}
              className="related-lesson-link"
              data-tone={["blue", "amber", "violet"][index]}
              href={`/notes/${preview.slug}`}
              aria-label={`Open related lesson: ${preview.label}`}
              key={preview.slug}
            >
              <span className="related-lesson-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="related-lesson-copy">
                <span className="related-lesson-kicker">
                  <span>{preview.courseCode || "MITEEE"}</span>
                  {preview.week ? <span>Week {preview.week}</span> : null}
                </span>
                <strong>{preview.label}</strong>
                <span className="related-lesson-meta">
                  {signals.length > 0 ? signals.map((signal) => (
                    <span key={signal.label}>{signal.icon}{signal.count} {signal.label}</span>
                  )) : <span><BookOpen size={13} aria-hidden="true" />Reading note</span>}
                </span>
              </span>
              <span className="related-lesson-open" aria-hidden="true"><ArrowUpRight size={17} /></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Signal({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="signal-card">
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function NoteQuizSetsPanel({ noteTitle, quizSets }: { noteTitle: string; quizSets: QuizSet[] }) {
  if (quizSets.length === 0) return null;

  const totalQuestions = quizSets.reduce((sum, quizSet) => sum + quizSet.count, 0);
  const mcqCount = quizSets.reduce((sum, quizSet) => sum + (quizSet.typeCounts.mcq || 0), 0);
  const promptCount = quizSets.reduce((sum, quizSet) => sum + (quizSet.typeCounts.prompt || 0), 0);

  return (
    <section className="note-quiz-card" aria-label={`${noteTitle} quiz blocks`}>
      <div className="reader-memory-heading">
        <span className="home-small-icon"><ClipboardList size={16} aria-hidden="true" /></span>
        <div>
          <span className="micro-label">Quiz blocks</span>
          <strong>{totalQuestions} timed practice items</strong>
        </div>
      </div>

      <div className="note-quiz-summary-grid" aria-label="Quiz block mix">
        <span><strong>{quizSets.length}</strong> sets</span>
        <span><strong>{mcqCount}</strong> MCQs</span>
        <span><strong>{promptCount}</strong> drills</span>
      </div>

      <div className="note-quiz-set-list">
        {quizSets.slice(0, 4).map((quizSet) => (
          <a className="note-quiz-set" href={`#${quizSet.anchorId || quizAnchorId(quizSet.testName)}`} key={`${quizSet.testName}-${quizSet.count}`}>
            <span>
              <strong>{quizSet.testName}</strong>
              <small>{quizSet.count} items{quizSet.imageCount ? ` · ${quizSet.imageCount} image` : ""}</small>
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function quizAnchorId(testName: string) {
  return testName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "quiz";
}

function FormulaReaderCard({ signal }: { signal: FormulaReaderSignal | null }) {
  if (!signal) return null;

  return (
    <div className={`reader-formula-card tone-${signal.tone}`} aria-label="Formula study loop">
      <span className="micro-label"><Sigma size={13} aria-hidden="true" /> Formula loop</span>
      <strong>{signal.title}</strong>
      <p>{signal.summary}</p>
      <ol>
        {signal.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </div>
  );
}
