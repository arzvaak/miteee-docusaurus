"use client";

import Link from "next/link";
import { ArrowRight, Crosshair, Flame, Gauge, History } from "lucide-react";
import { useEffect, useState } from "react";
import type { SscCglPracticeTopicSummary } from "@/lib/ssc-cgl";
import {
  parseSscAttemptHistory,
  sscAttemptHistoryStorageKey,
  type SscAttemptHistoryItem
} from "@/lib/ssc-cgl-attempt-history";
import { buildSscDailyCommand } from "@/lib/ssc-cgl-daily-command";
import {
  parseSscMistakeBank,
  sscMistakeBankStorageKey,
  type SscMistakeBankItem
} from "@/lib/ssc-cgl-mistake-bank";
import {
  parseSscTopicPracticeMemory,
  sscTopicPracticeStoragePrefix,
  type SscTopicPracticeMemoryItem
} from "@/lib/ssc-cgl-topic-practice-memory";

function readTopicPractices() {
  const practices: SscTopicPracticeMemoryItem[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(sscTopicPracticeStoragePrefix)) continue;
    const practice = parseSscTopicPracticeMemory(key, window.localStorage.getItem(key));
    if (practice) practices.push(practice);
  }
  return practices;
}

function readLocalCommandData() {
  return {
    attempts: parseSscAttemptHistory(window.localStorage.getItem(sscAttemptHistoryStorageKey)),
    mistakes: parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey)),
    topicPractices: readTopicPractices()
  };
}

export function SscDailyCommand({ practiceTopics = [] }: { practiceTopics?: SscCglPracticeTopicSummary[] }) {
  const [attempts, setAttempts] = useState<SscAttemptHistoryItem[]>([]);
  const [mistakes, setMistakes] = useState<SscMistakeBankItem[]>([]);
  const [topicPractices, setTopicPractices] = useState<SscTopicPracticeMemoryItem[]>([]);

  useEffect(() => {
    function loadCommand() {
      const local = readLocalCommandData();
      setAttempts(local.attempts);
      setMistakes(local.mistakes);
      setTopicPractices(local.topicPractices);
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadCommand();
    });
    window.addEventListener("storage", loadCommand);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", loadCommand);
    };
  }, []);

  const command = buildSscDailyCommand(mistakes, attempts, topicPractices, practiceTopics);

  return (
    <section className={`panel ssc-daily-command action-${command.primary.kind}`} aria-labelledby="ssc-daily-command-title">
      <header className="ssc-panel-heading">
        <Crosshair size={18} aria-hidden="true" />
        <div>
          <p className="panel-kicker">200/200 command</p>
          <h2 id="ssc-daily-command-title">Do this before adding more content.</h2>
        </div>
      </header>

      <Link className="ssc-daily-command-primary" href={command.primary.href}>
        <span>{command.primary.label}</span>
        <strong>{command.primary.title}</strong>
        <p>{command.primary.body}</p>
        <em>Open action <ArrowRight size={15} aria-hidden="true" /></em>
      </Link>

      <div className="ssc-daily-command-metrics" aria-label="Local SSC repair status">
        <span>
          <Flame size={16} aria-hidden="true" />
          <strong>{command.metrics.openMistakes}</strong>
          <small>open mistakes</small>
        </span>
        <span>
          <History size={16} aria-hidden="true" />
          <strong>{command.metrics.openSpeedRepairs}</strong>
          <small>speed repairs</small>
        </span>
        <span>
          <Gauge size={16} aria-hidden="true" />
          <strong>{command.metrics.latestScoreLabel}</strong>
          <small>latest</small>
        </span>
        <span>
          <Crosshair size={16} aria-hidden="true" />
          <strong>{command.metrics.bestScoreLabel}</strong>
          <small>best</small>
        </span>
      </div>
    </section>
  );
}
