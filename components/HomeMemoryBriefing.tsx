"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Flame, RotateCcw, Sigma, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { buildLearnerMemoryBriefing } from "@/lib/learner-memory";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function HomeMemoryBriefing() {
  const { memory } = useLearnerMemory();
  const [timestamp, setTimestamp] = useState("1970-01-01T00:00:00.000Z");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setTimestamp(new Date().toISOString());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const briefing = useMemo(() => buildLearnerMemoryBriefing(memory, timestamp), [memory, timestamp]);
  const stats = [
    { label: "Due", value: briefing.stats.dueCards, icon: RotateCcw },
    { label: "Mistakes", value: briefing.stats.openMistakes, icon: Sigma },
    { label: "Today", value: `${formatNumber(briefing.stats.todayMinutes)} min`, icon: TimerReset },
    { label: "Streak", value: `${briefing.stats.currentStreakDays}d`, icon: Flame }
  ];

  return (
    <section className={`memory-briefing tone-${briefing.tone}`} aria-label="Personal study briefing">
      <div className="memory-briefing-main">
        <span className="home-icon-badge"><BrainCircuit size={21} aria-hidden="true" /></span>
        <div>
          <span className="micro-label">Personal briefing</span>
          <h2>{briefing.title}</h2>
          <p>{briefing.body}</p>
        </div>
        <Link prefetch={false} className="button primary" href={briefing.href}>{briefing.primaryLabel} <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className="memory-briefing-stats" aria-label="Learner memory summary">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <span key={stat.label}>
              <Icon size={15} aria-hidden="true" />
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </span>
          );
        })}
      </div>
    </section>
  );
}
