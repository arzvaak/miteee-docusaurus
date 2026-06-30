"use client";

import Link from "next/link";
import { ArrowRight, Gauge, History, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  parseSscAttemptHistory,
  sscAttemptHistoryStorageKey,
  type SscAttemptHistoryItem
} from "@/lib/ssc-cgl-attempt-history";

function formatMarks(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved attempt";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function getBestAttempt(items: SscAttemptHistoryItem[]) {
  return items.reduce<SscAttemptHistoryItem | null>((best, item) => {
    if (!best) return item;
    if (item.score > best.score) return item;
    if (item.score === best.score && item.percentile > best.percentile) return item;
    return best;
  }, null);
}

export function SscAttemptHistory({ title = "Recent attempt history" }: { title?: string }) {
  const [items, setItems] = useState<SscAttemptHistoryItem[]>([]);

  useEffect(() => {
    function loadHistory() {
      setItems(parseSscAttemptHistory(window.localStorage.getItem(sscAttemptHistoryStorageKey)));
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadHistory();
    });
    window.addEventListener("storage", loadHistory);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", loadHistory);
    };
  }, []);

  const bestAttempt = useMemo(() => getBestAttempt(items), [items]);
  const latestAttempt = items[0];
  const openRepairCount = useMemo(() => items.filter((item) => item.topRepairHref).length, [items]);

  if (items.length === 0) {
    return (
      <section className="panel ssc-attempt-history" aria-labelledby="ssc-attempt-history-title">
        <header className="ssc-panel-heading">
          <History size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Local progress</p>
            <h2 id="ssc-attempt-history-title">{title}</h2>
          </div>
        </header>
        <p className="ssc-muted">Submit a timed mock or section sprint on this browser to save score, simulated rank, and the next repair topic here.</p>
        <Link className="button primary" href="#ssc-tests">Start a timed test</Link>
      </section>
    );
  }

  return (
    <section className="panel ssc-attempt-history" aria-labelledby="ssc-attempt-history-title">
      <header className="ssc-panel-heading">
        <History size={18} aria-hidden="true" />
        <div>
          <p className="panel-kicker">Local progress</p>
          <h2 id="ssc-attempt-history-title">{title}</h2>
        </div>
      </header>

      <div className="ssc-history-metrics" aria-label="Attempt history summary">
        <span>
          <Trophy size={16} aria-hidden="true" />
          <strong>{latestAttempt ? `${formatMarks(latestAttempt.score)}/${latestAttempt.maxScore}` : "No attempt"}</strong>
          <small>latest score</small>
        </span>
        <span>
          <Target size={16} aria-hidden="true" />
          <strong>{bestAttempt ? `${formatMarks(bestAttempt.score)}/${bestAttempt.maxScore}` : "No attempt"}</strong>
          <small>best score</small>
        </span>
        <span>
          <Gauge size={16} aria-hidden="true" />
          <strong>{bestAttempt ? `${bestAttempt.percentile}` : "0"}</strong>
          <small>best percentile</small>
        </span>
        <span>
          <ArrowRight size={16} aria-hidden="true" />
          <strong>{openRepairCount}</strong>
          <small>open repair links</small>
        </span>
      </div>

      <div className="ssc-history-list">
        {items.slice(0, 8).map((item) => (
          <article key={item.attemptId} className="ssc-history-item">
            <div>
              <strong>{item.testTitle}</strong>
              <small>{formatDate(item.savedAt)} · {item.rankBucket} · {item.mode.replaceAll("_", " ")}</small>
            </div>
            <div className="ssc-history-score">
              <strong>{formatMarks(item.score)}/{item.maxScore}</strong>
              <small>{formatMarks(item.marksLost)} lost · {item.correct}C/{item.wrong}W/{item.unattempted}L</small>
            </div>
            <div className="ssc-history-actions">
              {item.topRepairHref ? (
                <Link className="button ghost" href={item.topRepairHref}>{item.topRepairTopic ?? "Repair topic"}</Link>
              ) : null}
              <Link className="button primary" href={`/exams/ssc-cgl/results/${item.attemptId}`}>
                Result <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
