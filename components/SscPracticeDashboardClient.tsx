"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, RotateCcw, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SscCglPracticeTopicSummary } from "@/lib/ssc-cgl";
import { parseStoredSscTopicPractice, sscTopicPracticeStorageKey } from "@/lib/ssc-cgl-topic-practice-memory";

type PracticeSection = {
  id: string;
  title: string;
  questionCount: number;
  timerSeconds: number;
  topics: SscCglPracticeTopicSummary[];
};

type TopicProgress = {
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  percent: number;
  savedAt: string | null;
  status: "not-started" | "in-progress" | "complete";
};

const numberFormatter = new Intl.NumberFormat("en-US");

function emptyProgress(topic: SscCglPracticeTopicSummary): TopicProgress {
  return {
    answered: 0,
    correct: 0,
    wrong: 0,
    skipped: 0,
    total: topic.totalQuestions,
    percent: 0,
    savedAt: null,
    status: "not-started"
  };
}

function progressLabel(status: TopicProgress["status"]) {
  if (status === "complete") return "Complete";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

function formatProgress(progress: TopicProgress) {
  return `${numberFormatter.format(progress.answered)}/${numberFormatter.format(progress.total)} done`;
}

export function SscPracticeDashboardClient({ sections }: { sections: PracticeSection[] }) {
  const topics = useMemo(() => sections.flatMap((section) => section.topics), [sections]);
  const [hydrated, setHydrated] = useState(false);
  const [progressBySlug, setProgressBySlug] = useState<Record<string, TopicProgress>>({});

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const nextProgress: Record<string, TopicProgress> = {};
      for (const topic of topics) {
        const stored = parseStoredSscTopicPractice(window.localStorage.getItem(sscTopicPracticeStorageKey(topic.slug)));
        if (!stored) {
          nextProgress[topic.slug] = emptyProgress(topic);
          continue;
        }
        const answered = Math.min(Object.keys(stored.answers).length, topic.totalQuestions);
        const correct = Math.min(stored.correct ?? 0, answered);
        const wrong = Math.min(stored.wrong ?? 0, Math.max(0, answered - correct));
        const skipped = Math.min(stored.skipped ?? Object.values(stored.answers).filter((answer) => answer === "z").length, answered);
        const percent = topic.totalQuestions > 0 ? Math.round(answered / topic.totalQuestions * 100) : 0;
        nextProgress[topic.slug] = {
          answered,
          correct,
          wrong,
          skipped,
          total: topic.totalQuestions,
          percent,
          savedAt: stored.savedAt,
          status: answered >= topic.totalQuestions && topic.totalQuestions > 0 ? "complete" : answered > 0 ? "in-progress" : "not-started"
        };
      }
      setProgressBySlug(nextProgress);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [topics]);

  const overall = useMemo(() => {
    const rows = topics.map((topic) => progressBySlug[topic.slug] ?? emptyProgress(topic));
    const total = topics.reduce((sum, topic) => sum + topic.totalQuestions, 0);
    const answered = rows.reduce((sum, row) => sum + row.answered, 0);
    const correct = rows.reduce((sum, row) => sum + row.correct, 0);
    const wrong = rows.reduce((sum, row) => sum + row.wrong, 0);
    const skipped = rows.reduce((sum, row) => sum + row.skipped, 0);
    const completedTopics = rows.filter((row) => row.status === "complete").length;
    return {
      total,
      answered,
      correct,
      wrong,
      skipped,
      completedTopics,
      progress: total > 0 ? Math.round(answered / total * 100) : 0
    };
  }, [progressBySlug, topics]);

  const resumeTopic = useMemo(() => {
    const withProgress = topics
      .map((topic) => ({ topic, progress: progressBySlug[topic.slug] ?? emptyProgress(topic) }))
      .filter((row) => row.progress.status === "in-progress")
      .sort((a, b) => (b.progress.savedAt ?? "").localeCompare(a.progress.savedAt ?? ""));
    return withProgress[0] ?? topics
      .map((topic) => ({ topic, progress: progressBySlug[topic.slug] ?? emptyProgress(topic) }))
      .find((row) => row.progress.status !== "complete") ?? null;
  }, [progressBySlug, topics]);

  return (
    <div className="ssc-practice-dashboard">
      <section className="panel ssc-practice-overview" aria-label="Overall topic queue">
        <div className="ssc-panel-heading">
          <Target size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Overall topic queue</p>
            <strong>{overall.completedTopics}/{topics.length} sublevels complete</strong>
          </div>
        </div>
        <div className="ssc-practice-overview-grid">
          <span><strong>{numberFormatter.format(overall.answered)}</strong><small>answered locally</small></span>
          <span><strong>{overall.progress}%</strong><small>corpus progress</small></span>
          <span><strong>{numberFormatter.format(overall.correct)}</strong><small>correct</small></span>
          <span><strong>{numberFormatter.format(overall.wrong + overall.skipped)}</strong><small>repair rows</small></span>
        </div>
        <div className="ssc-practice-progress-meter" aria-label={`${overall.progress}% local progress`}>
          <i style={{ width: `${overall.progress}%` }} />
        </div>
        <p className="ssc-muted">Local progress is read from this browser. It updates after you answer, skip, or reset a topic.</p>
      </section>

      {resumeTopic ? (
        <Link className="panel ssc-practice-resume-card" href={resumeTopic.topic.href}>
          <RotateCcw size={20} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Resume next unfinished topic</p>
            <strong>{resumeTopic.topic.title}</strong>
            <span>Local progress: {formatProgress(resumeTopic.progress)} · {progressLabel(resumeTopic.progress.status)}</span>
          </div>
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      ) : (
        <section className="panel ssc-practice-resume-card" aria-label="All topic queues complete">
          <BookOpenCheck size={20} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Resume next unfinished topic</p>
            <strong>All topic queues complete</strong>
            <span>Move to mixed timed tests and mistake repair.</span>
          </div>
        </section>
      )}

      <div className="ssc-topic-levels">
        {sections.map((section, index) => {
          const sectionProgress = section.topics.map((topic) => progressBySlug[topic.slug] ?? emptyProgress(topic));
          const sectionAnswered = sectionProgress.reduce((sum, row) => sum + row.answered, 0);
          const sectionTotal = section.topics.reduce((sum, topic) => sum + topic.totalQuestions, 0);
          const sectionPercent = sectionTotal > 0 ? Math.round(sectionAnswered / sectionTotal * 100) : 0;

          return (
            <section className="panel ssc-topic-level" key={section.id}>
              <header>
                <span>Level {index + 1}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{numberFormatter.format(sectionTotal)} practice questions across {section.topics.length} sublevels.</p>
                </div>
                <strong>{section.questionCount} exam questions · {Math.round(section.timerSeconds / section.questionCount)} sec target</strong>
              </header>
              <div className="ssc-practice-section-progress">
                <div className="ssc-practice-progress-meter" aria-label={`${section.title} ${sectionPercent}% local progress`}>
                  <i style={{ width: `${sectionPercent}%` }} />
                </div>
                <span>{hydrated ? `${numberFormatter.format(sectionAnswered)} answered locally` : "Checking local progress"}</span>
              </div>
              <div className="ssc-practice-topic-grid">
                {section.topics.map((topic) => {
                  const progress = progressBySlug[topic.slug] ?? emptyProgress(topic);
                  return (
                    <Link className={`ssc-practice-topic-card status-${progress.status}`} href={topic.href} key={topic.slug}>
                      <BookOpenCheck size={18} aria-hidden="true" />
                      <strong>{topic.title}</strong>
                      <p>{numberFormatter.format(topic.totalQuestions)} total · {numberFormatter.format(topic.bookBackedQuestions)} book-backed · {numberFormatter.format(topic.gapRepairQuestions)} gap-repair</p>
                      <div className="ssc-practice-topic-progress">
                        <span>Local progress</span>
                        <strong>{formatProgress(progress)}</strong>
                        <div className="ssc-practice-progress-meter" aria-hidden="true">
                          <i style={{ width: `${progress.percent}%` }} />
                        </div>
                      </div>
                      <em>{progressLabel(progress.status)}</em>
                      <span>Start one-by-one practice <ArrowRight size={14} aria-hidden="true" /></span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
