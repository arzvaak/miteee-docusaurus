"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Gauge, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { MathText } from "@/components/MathText";
import { SscExplanationPanel } from "@/components/SscExplanationPanel";
import type { SscCglAttemptResult, SscCglOptionId, SscCglTestDetail } from "@/lib/exam-types";
import { buildSscAttemptQuestionReview } from "@/lib/ssc-cgl-attempt-review";

type StoredAttempt = {
  test: SscCglTestDetail;
  result: SscCglAttemptResult;
  answers?: Record<string, SscCglOptionId | null>;
  savedAt: string;
};

function formatMarks(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function readablePace(status: SscCglAttemptResult["pacingStatus"] | undefined) {
  if (status === "slow") return "slow";
  if (status === "rushed") return "rushed";
  if (status === "on-pace") return "on pace";
  return "no timing";
}

export function SscAttemptResultClient({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const stored = window.localStorage.getItem(`ssc-cgl-attempt:${attemptId}`);
        setAttempt(stored ? JSON.parse(stored) as StoredAttempt : null);
      } catch {
        setAttempt(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (!attempt) {
    return (
      <section className="page ssc-page">
        <div className="panel ssc-empty-state">
          <AlertTriangle size={22} aria-hidden="true" />
          <h1>Attempt not found</h1>
          <p>This result is stored locally in this browser. Start a test to create a new result.</p>
          <Link className="button primary" href="/exams/ssc-cgl/tests">Open tests</Link>
        </div>
      </section>
    );
  }

  const { result, test } = attempt;
  const marksLost = result.marksLost ?? Math.max(0, result.maxScore - result.score);
  const targetSecondsPerQuestion = result.targetSecondsPerQuestion ?? Math.round(test.durationSeconds / Math.max(1, test.questionCount));
  const averageSecondsPerQuestion = result.averageSecondsPerQuestion ?? Math.round(result.totalTimeSeconds / Math.max(1, test.questionCount));
  const nextBestAction = result.nextBestAction ?? "Open the repair queue, revise the linked topic notes, then redo one timed section.";
  const repairQueue = result.repairQueue ?? result.weakTopics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    section: topic.section,
    wrong: topic.misses,
    unattempted: 0,
    totalRepair: topic.misses,
    href: `/exams/ssc-cgl/topics/${topic.slug}`,
    recommendedAction: "Open the topic note, repair the miss, then redo a timed section set."
  }));
  const questionReview = buildSscAttemptQuestionReview(test, attempt.answers ?? {});
  const firstRepair = repairQueue[0];
  const slowestSection = [...result.sectionResults]
    .sort((a, b) => (b.marksLost ?? 0) - (a.marksLost ?? 0) || (b.averageSecondsPerQuestion ?? 0) - (a.averageSecondsPerQuestion ?? 0))[0];
  const postTestLoop = [
    {
      label: "01 Lost marks",
      title: `${formatMarks(marksLost)} marks to close`,
      body: marksLost <= 0
        ? "No marks lost in this stored attempt. Preserve the same answer order and retest after fatigue."
        : "Write every lost mark as wrong, skipped, or pace leak before opening another paper.",
      href: "#question-review",
      meta: `${result.wrong} wrong · ${result.unattempted} left`
    },
    {
      label: "02 First repair",
      title: firstRepair ? firstRepair.title : "No concept repair queued",
      body: firstRepair ? firstRepair.recommendedAction : "If the score is perfect, use the same section later to prove retention.",
      href: firstRepair ? firstRepair.href : "/exams/ssc-cgl/tests",
      meta: firstRepair ? `${firstRepair.totalRepair} repair items` : "speed retest"
    },
    {
      label: "03 Section lock",
      title: slowestSection ? slowestSection.title : "Timed section lock",
      body: slowestSection?.recommendedAction ?? "Redo the weakest 25-question section under the 15-minute timer.",
      href: "/exams/ssc-cgl/tests?mode=speed_sprint",
      meta: slowestSection
        ? `${formatMarks(slowestSection.score)}/${slowestSection.targetScore ?? 50} · ${slowestSection.averageSecondsPerQuestion ?? 36}s/q`
        : "25 questions · 900 sec"
    },
    {
      label: "04 Retest",
      title: "Retake only after repair",
      body: "Do not start another mock before closing this loop. The next paper should test repairs, not repeat leaks.",
      href: "/exams/ssc-cgl/tests?mode=full_mock",
      meta: result.rank.rankBucket
    }
  ];

  return (
    <section className="page ssc-page">
      <header className="panel ssc-result-hero">
        <div>
          <p className="panel-kicker">SSC CGL result</p>
          <h1>{result.score}/{result.maxScore}</h1>
          <p>{test.title} · {result.rank.rankBucket} · {result.rank.basis}</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{result.correct}</strong><small>correct</small></span>
          <span><strong>{result.wrong}</strong><small>wrong</small></span>
          <span><strong>{result.unattempted}</strong><small>left</small></span>
          <span><strong>{result.rank.percentile}</strong><small>percentile sim</small></span>
        </div>
      </header>

      <section className="panel ssc-target-strip">
        <div>
          <Target size={18} aria-hidden="true" />
          <span>
            <strong>{formatMarks(marksLost)} marks lost</strong>
            <small>{result.maxScore === 200 ? "gap from 200/200" : `gap from ${result.maxScore}/${result.maxScore}`}</small>
          </span>
        </div>
        <div>
          <Gauge size={18} aria-hidden="true" />
          <span>
            <strong>{averageSecondsPerQuestion}s/question</strong>
            <small>{readablePace(result.pacingStatus)} · target {targetSecondsPerQuestion}s</small>
          </span>
        </div>
        <p>{nextBestAction}</p>
      </section>

      <section className="panel ssc-result-loop" aria-labelledby="ssc-result-loop-heading">
        <div className="ssc-panel-heading">
          <Target size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">200/200 post-test loop</p>
            <h2 id="ssc-result-loop-heading">Do not start another mock before closing this loop.</h2>
          </div>
        </div>
        <div className="ssc-result-loop-grid">
          {postTestLoop.map((item) => (
            <Link className="ssc-result-loop-card" href={item.href} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <small>{item.meta}</small>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="ssc-result-grid">
        <section className="panel">
          <div className="ssc-panel-heading"><Trophy size={18} aria-hidden="true" /><strong>Section analysis</strong></div>
          <div className="ssc-section-results">
            {result.sectionResults.map((section) => {
              const targetScore = section.targetScore ?? 50;
              const sectionMarksLost = section.marksLost ?? Math.max(0, targetScore - section.score);
              const sectionAccuracy = section.accuracy ?? (section.correct / Math.max(1, section.correct + section.wrong));
              const sectionAverageSeconds = section.averageSecondsPerQuestion ?? Math.round(section.timeSpentSeconds / Math.max(1, section.correct + section.wrong + section.unattempted));
              const sectionTargetSeconds = section.targetSecondsPerQuestion ?? 36;
              const sectionAction = section.recommendedAction ?? "Repair the missed topics, then redo this section under the timer.";
              return (
              <article key={section.sectionId} className={`status-${section.targetStatus ?? "repair-marks"}`}>
                <header>
                  <strong>{section.title}</strong>
                  <span>{formatMarks(section.score)}/{targetScore}</span>
                </header>
                <dl>
                  <div><dt>Lost</dt><dd>{formatMarks(sectionMarksLost)}</dd></div>
                  <div><dt>Accuracy</dt><dd>{formatPercent(sectionAccuracy)}</dd></div>
                  <div><dt>Pace</dt><dd>{sectionAverageSeconds}s/q</dd></div>
                  <div><dt>Target</dt><dd>{sectionTargetSeconds}s/q</dd></div>
                </dl>
                <p>{section.correct} correct · {section.wrong} wrong · {section.unattempted} left</p>
                <small>{sectionAction}</small>
              </article>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <div className="ssc-panel-heading"><AlertTriangle size={18} aria-hidden="true" /><strong>Repair queue</strong></div>
          {repairQueue.length > 0 ? (
            <div className="ssc-topic-list compact">
              {repairQueue.map((topic) => (
                <Link key={topic.slug} href={topic.href}>
                  <span>
                    <strong>{topic.title}</strong>
                    <small>{topic.recommendedAction}</small>
                  </span>
                  <span>{topic.totalRepair} repair · {topic.wrong} wrong · {topic.unattempted} left</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="ssc-muted">No wrong answers in stored responses. Push speed next.</p>
          )}
        </section>
      </div>

      <section className="panel ssc-answer-review" id="question-review" aria-label="Question-by-question answer review">
        <div className="ssc-panel-heading"><AlertTriangle size={18} aria-hidden="true" /><strong>Question review</strong></div>
        <div className="ssc-answer-review-list">
          {questionReview.map((row) => (
            <article className={`ssc-answer-review-card status-${row.status}`} key={row.questionId}>
              <header>
                <span>Q{row.questionNumber}</span>
                <div>
                  <strong>{row.subtopic}</strong>
                  <small>{row.sectionTitle} · {row.status} · {formatMarks(row.marksImpact)} marks</small>
                </div>
                <Link href={row.topicHref}>Repair topic</Link>
              </header>
              <p><MathText text={row.stem} /></p>
              <div className="ssc-answer-option-grid">
                <span>
                  <small>Your answer</small>
                  <strong>{row.chosenOptionId ? row.chosenOptionId.toUpperCase() : "-"} · <MathText text={row.chosenOptionText} /></strong>
                </span>
                <span>
                  <small>Correct answer</small>
                  <strong>{row.correctOptionId.toUpperCase()} · <MathText text={row.correctOptionText} /></strong>
                </span>
              </div>
              <SscExplanationPanel explanation={row.explanation} className="ssc-answer-explanation" />
              <footer>
                <span>{row.sourceLabel}</span>
                {row.sourceUrl ? <Link href={row.sourceUrl} target="_blank">Provenance</Link> : null}
              </footer>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
