"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  Check,
  ClipboardList,
  Clock3,
  Crosshair,
  FileText,
  Flag,
  Globe2,
  Home,
  Infinity as InfinityIcon,
  LayoutGrid,
  Newspaper,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Target,
  Trophy
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { parseSscAttemptHistory, sscAttemptHistoryStorageKey } from "@/lib/ssc-cgl-attempt-history";
import { parseSscMistakeBank, sscMistakeBankStorageKey } from "@/lib/ssc-cgl-mistake-bank";
import styles from "@/components/SscExamSetup.module.css";

type SessionMode = "quick" | "section" | "full" | "endless" | "pyq" | "weak";
type SectionId = "all" | "reasoning" | "general-awareness" | "quantitative-aptitude" | "english-comprehension";
type SessionLength = "10" | "25" | "50" | "100" | "endless";
type TimerMode = "exam" | "relaxed" | "off";
type SourceMode = "all" | "book" | "original";
type DifficultyMode = "all" | "easy" | "medium" | "hard";

type ModeCard = {
  id: SessionMode;
  title: string;
  description: string;
  icon: LucideIcon;
  recommended?: boolean;
  preset: Pick<SessionConfig, "section" | "length" | "timer" | "source" | "difficulty">;
};

type SessionConfig = {
  mode: SessionMode;
  section: SectionId;
  length: SessionLength;
  timer: TimerMode;
  source: SourceMode;
  difficulty: DifficultyMode;
};

export type SscExamSetupSection = {
  id: Exclude<SectionId, "all">;
  title: string;
  readinessPercent: number;
  reviewedQuestions: number;
};

export type SscExamSetupProps = {
  reviewedQuestions: number;
  testCount: number;
  topicCount: number;
  fullMockCount: number;
  pyqShiftCount: number;
  sectionSprintCount: number;
  sections: SscExamSetupSection[];
  featuredTest?: { id: string; title: string; questionCount: number; durationMinutes: number };
  overviewHref?: string;
};

const modes: ModeCard[] = [
  {
    id: "quick",
    title: "Quick 10",
    description: "10-question section sprint",
    icon: Timer,
    preset: { section: "reasoning", length: "10", timer: "exam", source: "book", difficulty: "all" }
  },
  {
    id: "section",
    title: "Section Test",
    description: "25 questions · 15 min",
    icon: FileText,
    preset: { section: "reasoning", length: "25", timer: "exam", source: "book", difficulty: "all" }
  },
  {
    id: "full",
    title: "Full Mock",
    description: "100 questions · 60 min",
    icon: Trophy,
    recommended: true,
    preset: { section: "all", length: "100", timer: "exam", source: "book", difficulty: "all" }
  },
  {
    id: "endless",
    title: "Endless Practice",
    description: "No finish line",
    icon: InfinityIcon,
    preset: { section: "all", length: "endless", timer: "off", source: "book", difficulty: "all" }
  },
  {
    id: "pyq",
    title: "Book / PYQ Practice",
    description: "Reviewed past-paper questions",
    icon: ClipboardList,
    preset: { section: "all", length: "25", timer: "exam", source: "book", difficulty: "all" }
  },
  {
    id: "weak",
    title: "Weakness Repair",
    description: "Built from your mistakes",
    icon: Crosshair,
    preset: { section: "all", length: "25", timer: "relaxed", source: "all", difficulty: "all" }
  }
];

const sectionOptions: Array<{ value: SectionId; label: string }> = [
  { value: "all", label: "All four sections" },
  { value: "reasoning", label: "Reasoning" },
  { value: "general-awareness", label: "General Awareness" },
  { value: "quantitative-aptitude", label: "Quantitative Aptitude" },
  { value: "english-comprehension", label: "English Comprehension" }
];

const lengthOptions: Array<{ value: SessionLength; label: string }> = [
  { value: "10", label: "10 Q" },
  { value: "25", label: "25 Q" },
  { value: "50", label: "50 Q" },
  { value: "100", label: "100 Q" },
  { value: "endless", label: "Endless" }
];

const timerOptions: Array<{ value: TimerMode; label: string }> = [
  { value: "exam", label: "Exam clock" },
  { value: "relaxed", label: "Relaxed" },
  { value: "off", label: "No timer" }
];

const sourceOptions: Array<{ value: SourceMode; label: string }> = [
  { value: "all", label: "All reviewed" },
  { value: "book", label: "Book / PYQ" },
  { value: "original", label: "Original" }
];

const difficultyOptions: Array<{ value: DifficultyMode; label: string }> = [
  { value: "all", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

const examRailLinks: Array<{ href: string; label: string; icon: LucideIcon; active?: boolean }> = [
  { href: "/exams/ssc-cgl", label: "Overview", icon: Home, active: true },
  { href: "/exams/ssc-cgl/tests", label: "Tests", icon: ClipboardList },
  { href: "/exams/ssc-cgl/practice", label: "Question Bank", icon: BookOpen },
  { href: "/exams/ssc-cgl/topics", label: "Topics", icon: LayoutGrid },
  { href: "/exams/ssc-cgl/current-affairs", label: "Current Affairs", icon: Newspaper },
  { href: "/exams/ssc-cgl/tests#attempt-history", label: "Results", icon: BarChart3 }
];

const subjectIcons: Record<Exclude<SectionId, "all">, LucideIcon> = {
  reasoning: Brain,
  "general-awareness": Globe2,
  "quantitative-aptitude": Calculator,
  "english-comprehension": BookOpen
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function SscExamSetup(props: SscExamSetupProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SessionConfig>({ mode: "full", ...modes[2].preset });
  const [recentAttempt, setRecentAttempt] = useState<ReturnType<typeof parseSscAttemptHistory>[number] | null>(null);
  const [reviewCounts, setReviewCounts] = useState({ wrong: 0, unattempted: 0, slow: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const attempts = parseSscAttemptHistory(window.localStorage.getItem(sscAttemptHistoryStorageKey));
      const mistakes = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
      setRecentAttempt(attempts[0] ?? null);
      setReviewCounts({
        wrong: mistakes.filter((item) => item.status === "wrong").length,
        unattempted: mistakes.filter((item) => item.status === "unattempted").length,
        slow: mistakes.filter((item) => item.status === "slow").length
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const activeMode = modes.find((mode) => mode.id === config.mode) ?? modes[2];
  const locksOfficialPattern = config.mode === "full";
  const locksEndlessLength = config.mode === "endless";
  const locksEndlessSource = config.mode === "endless";
  const locksPyqSource = config.mode === "pyq";
  const visibleLengthOptions = config.mode === "endless"
    ? lengthOptions.filter((option) => option.value === "endless")
    : lengthOptions.filter((option) => option.value !== "endless");
  const sectionLabel = sectionOptions.find((option) => option.value === config.section)?.label ?? "All four sections";
  const lengthLabel = lengthOptions.find((option) => option.value === config.length)?.label ?? config.length;
  const launchHref = useMemo(() => {
    const params = new URLSearchParams({
      mode: config.mode,
      section: config.section,
      length: config.length,
      timer: config.timer,
      source: config.source,
      difficulty: config.difficulty
    });
    return `/exams/ssc-cgl/session?${params.toString()}`;
  }, [config]);

  function chooseMode(mode: ModeCard) {
    setConfig({ mode: mode.id, ...mode.preset });
    window.requestAnimationFrame(() => {
      document.getElementById("ssc-session-config")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function updateConfig<Key extends keyof SessionConfig>(key: Key, value: SessionConfig[Key]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className={styles.page} data-shell-full-bleed="true">
      <aside className={styles.examRail} aria-label="SSC CGL navigation">
        <div className={styles.examIdentity}>
          <strong>SSC CGL Tier I</strong>
          <span>Staff Selection Commission</span>
        </div>

        <nav className={styles.railNav}>
          {examRailLinks.map((item) => (
            <Link
              className={item.active ? `${styles.railLink} ${styles.active}` : styles.railLink}
              href={item.active ? (props.overviewHref ?? item.href) : item.href}
              key={item.href}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.corpusStats} aria-label="SSC CGL corpus summary">
          <span><Target size={19} aria-hidden="true" /><strong>{formatNumber(props.reviewedQuestions)}</strong><small>reviewed questions</small></span>
          <span><ClipboardList size={19} aria-hidden="true" /><strong>{formatNumber(props.testCount)}</strong><small>test sets</small></span>
          <span><LayoutGrid size={19} aria-hidden="true" /><strong>{formatNumber(props.topicCount)}</strong><small>topics</small></span>
        </div>
      </aside>

      <section className={styles.content} aria-labelledby="ssc-practice-title">
        <div className={styles.eyebrow}>SSC CGL Tier I</div>
        <header className={styles.hero}>
          <h1 id="ssc-practice-title">What do you want to practice?</h1>
          <p>Choose a mode, refine your test, and enter a focused exam workspace.</p>
        </header>

        <section className={styles.modeGrid} aria-label="Choose a practice mode">
          {modes.map((mode) => {
            const selected = mode.id === config.mode;
            return (
              <button
                className={`${styles.modeCard} ${selected ? styles.selected : ""} ${mode.recommended ? styles.recommended : ""}`}
                type="button"
                key={mode.id}
                onClick={() => chooseMode(mode)}
                aria-pressed={selected}
              >
                {mode.recommended ? <span className={styles.recommendedFlag}>Recommended</span> : null}
                <mode.icon size={34} strokeWidth={1.7} aria-hidden="true" />
                <strong>{mode.title}</strong>
                <span>{mode.description}</span>
                <i className={styles.cardArrow} aria-hidden="true"><ArrowRight size={21} /></i>
                {selected ? (
                  <em className={styles.selectedLabel}><Check size={13} aria-hidden="true" /> Selected</em>
                ) : null}
              </button>
            );
          })}
        </section>

        <form
          id="ssc-session-config"
          className={styles.configPanel}
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`${launchHref}&seed=${Date.now()}`);
          }}
        >
          <header className={styles.configHeader}>
            <span className={styles.configIcon}><SlidersHorizontal size={20} aria-hidden="true" /></span>
            <div>
              <span>Configure your session</span>
              <h2>{activeMode.title}</h2>
            </div>
            <p>{sectionLabel} · {lengthLabel} · {config.timer === "exam" ? "exam timing" : config.timer === "relaxed" ? "relaxed timing" : "untimed"}</p>
          </header>

          <div className={styles.configGrid}>
            <label className={styles.selectField}>
              <span>Section / subject</span>
              <select disabled={locksOfficialPattern} value={config.section} onChange={(event) => updateConfig("section", event.target.value as SectionId)}>
                {sectionOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className={styles.selectField}>
              <span>Question length</span>
              <select disabled={locksOfficialPattern || locksEndlessLength} value={config.length} onChange={(event) => updateConfig("length", event.target.value as SessionLength)}>
                {visibleLengthOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className={styles.selectField}>
              <span>Timer</span>
              <select disabled={locksOfficialPattern} value={config.timer} onChange={(event) => updateConfig("timer", event.target.value as TimerMode)}>
                {timerOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className={styles.selectField}>
              <span>Question source</span>
              <select disabled={locksOfficialPattern || locksPyqSource || locksEndlessSource} value={config.source} onChange={(event) => updateConfig("source", event.target.value as SourceMode)}>
                {sourceOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className={styles.selectField}>
              <span>Difficulty</span>
              <select disabled={locksOfficialPattern} value={config.difficulty} onChange={(event) => updateConfig("difficulty", event.target.value as DifficultyMode)}>
                {difficultyOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <footer className={styles.configFooter}>
            <div>
              <Sparkles size={17} aria-hidden="true" />
              <span>{config.mode === "endless" ? "Questions keep coming until you stop." : "You can review instructions before the clock begins."}</span>
            </div>
            <button className={styles.launchButton} type="submit">
              Start {activeMode.title}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </footer>
        </form>

        <section className={styles.sectionProgress} aria-labelledby="section-progress-heading">
          <h2 id="section-progress-heading" className="sr-only">Section question-bank readiness</h2>
          {props.sections.map((section) => {
            const Icon = subjectIcons[section.id];
            const shortTitle = section.id === "reasoning"
              ? "Reasoning"
              : section.id === "general-awareness"
                ? "General Awareness"
                : section.id === "quantitative-aptitude"
                  ? "Quant"
                  : "English";
            return (
              <button
                type="button"
                className={styles.subjectProgress}
                key={section.id}
                onClick={() => {
                  setConfig((current) => ({ ...current, mode: "section", section: section.id, length: "25", timer: "exam" }));
                  document.getElementById("ssc-session-config")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                aria-label={`Configure a ${shortTitle} section test. ${section.readinessPercent}% question-bank readiness.`}
              >
                <span className={styles.subjectHeading}><Icon size={23} aria-hidden="true" /><strong>{shortTitle}</strong><em>{section.readinessPercent}%</em></span>
                <span className={styles.progressTrack}><i style={{ width: `${section.readinessPercent}%` }} /></span>
                <small>{formatNumber(section.reviewedQuestions)} reviewed questions</small>
              </button>
            );
          })}
        </section>

        <section className={styles.continueStrip} aria-label={recentAttempt ? "Your latest test" : "Recommended starting point"}>
          <span className={styles.continueIcon}><RotateCcw size={24} aria-hidden="true" /></span>
          <div>
            <strong>{recentAttempt ? "Review your last test" : "Start with a real exam baseline"}</strong>
            <span>
              {recentAttempt
                ? `${recentAttempt.testTitle} · ${recentAttempt.score}/${recentAttempt.maxScore} marks`
                : props.featuredTest
                  ? `${props.featuredTest.title} · ${props.featuredTest.questionCount} questions · ${props.featuredTest.durationMinutes} min`
                  : `${props.fullMockCount} full mocks ready`}
            </span>
          </div>
          <Link
            href={recentAttempt ? `/exams/ssc-cgl/results/${recentAttempt.attemptId}` : launchHref}
            className={styles.resumeButton}
          >
            {recentAttempt ? "Review" : "Begin"} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>

        <section className={styles.reviewSection} aria-labelledby="due-review-heading">
          <header>
            <h2 id="due-review-heading">Due for review</h2>
            <Link href="/exams/ssc-cgl/practice">Open question bank <ArrowRight size={15} aria-hidden="true" /></Link>
          </header>
          <div className={styles.reviewGrid}>
            <Link href="/exams/ssc-cgl/session?mode=weak&section=all&length=25&timer=relaxed&source=all&difficulty=all&status=wrong">
              <span className={styles.red}><Flag size={20} aria-hidden="true" /></span><strong>{reviewCounts.wrong}</strong><small>Incorrect</small><ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/exams/ssc-cgl/session?mode=weak&section=all&length=25&timer=relaxed&source=all&difficulty=all&status=unattempted">
              <span className={styles.amber}><Target size={20} aria-hidden="true" /></span><strong>{reviewCounts.unattempted}</strong><small>Unattempted</small><ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/exams/ssc-cgl/session?mode=weak&section=all&length=25&timer=relaxed&source=all&difficulty=all&status=slow">
              <span className={styles.blue}><Clock3 size={20} aria-hidden="true" /></span><strong>{reviewCounts.slow}</strong><small>Slow answers</small><ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/exams/ssc-cgl/tests?mode=pyq_shift">
              <span className={styles.green}><RotateCcw size={20} aria-hidden="true" /></span><strong>{formatNumber(props.pyqShiftCount)}</strong><small>PYQ shifts</small><ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
