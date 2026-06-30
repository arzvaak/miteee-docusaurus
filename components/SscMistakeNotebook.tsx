"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpenCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  parseSscMistakeBank,
  sscMistakeBankStorageKey,
  type SscMistakeBankItem
} from "@/lib/ssc-cgl-mistake-bank";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved mistake";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function SscMistakeNotebook() {
  const [items, setItems] = useState<SscMistakeBankItem[]>([]);

  useEffect(() => {
    function loadMistakes() {
      setItems(parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey)));
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadMistakes();
    });
    window.addEventListener("storage", loadMistakes);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", loadMistakes);
    };
  }, []);

  const topicCount = useMemo(() => new Set(items.map((item) => item.topic)).size, [items]);
  const wrongCount = items.filter((item) => item.status === "wrong").length;
  const unattemptedCount = items.filter((item) => item.status === "unattempted").length;
  const slowCount = items.filter((item) => item.status === "slow").length;

  if (items.length === 0) {
    return (
      <section className="panel ssc-mistake-notebook" aria-label="Mistake notebook">
        <header className="ssc-panel-heading">
          <BookOpenCheck size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Repair memory</p>
            <h2>Mistake notebook</h2>
          </div>
        </header>
        <p className="ssc-muted">Wrong, missed, unattempted, and slow questions from tests, topic practice, and current-affairs recall will appear here for repeat repair.</p>
      </section>
    );
  }

  return (
    <section className="panel ssc-mistake-notebook" aria-label="Mistake notebook">
      <header className="ssc-panel-heading">
        <AlertTriangle size={18} aria-hidden="true" />
        <div>
          <p className="panel-kicker">Repair memory</p>
          <h2>Mistake notebook</h2>
        </div>
      </header>

      <div className="ssc-mistake-metrics">
        <span><strong>{items.length}</strong><small>open mistakes</small></span>
        <span><strong>{wrongCount}</strong><small>wrong</small></span>
        <span><strong>{unattemptedCount}</strong><small>unattempted</small></span>
        <span><strong>{slowCount}</strong><small>speed repairs</small></span>
        <span><strong>{topicCount}</strong><small>topics</small></span>
      </div>

      <div className="ssc-mistake-list">
        {items.slice(0, 8).map((item) => (
          <article className={`ssc-mistake-item status-${item.status}`} key={item.questionId}>
            <div>
              <strong>{item.subtopic}</strong>
              <small>{item.sectionTitle} · {item.status} · {formatDate(item.savedAt)}</small>
            </div>
            <p>{item.stem}</p>
            <div className="ssc-mistake-answer-row">
              <span><small>Your answer</small><strong>{item.chosenOptionText}</strong></span>
              <span><small>Correct</small><strong>{item.correctOptionText}</strong></span>
            </div>
            <div className="ssc-mistake-actions">
              <Link href={item.topicHref}>Repair topic</Link>
              <Link href={item.resultHref}>
                Result <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
