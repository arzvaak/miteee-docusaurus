"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { TimedTestRunner } from "@/components/TimedTestRunner";
import type { SscSessionBuild, SscSessionConfig } from "@/lib/ssc-cgl-session";
import {
  parseSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";
import styles from "@/components/SscSession.module.css";

export function SscWeakSessionLoader({
  config,
  fallbackSession
}: {
  config: SscSessionConfig;
  fallbackSession: SscSessionBuild;
}) {
  const [session, setSession] = useState<SscSessionBuild | null>(null);

  useEffect(() => {
    let cancelled = false;
    const mistakes = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
    const questionIds = mistakes
      .filter((item) => config.weakStatus === "all" || item.status === config.weakStatus)
      .map((item) => item.questionId);

    if (questionIds.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) setSession(fallbackSession);
      });
      return () => {
        cancelled = true;
      };
    }

    void fetch("/api/exams/ssc-cgl/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, questionIds })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to build weakness session");
        return response.json() as Promise<SscSessionBuild>;
      })
      .then((result) => {
        if (!cancelled && result.test.questionCount > 0) setSession(result);
      })
      .catch(() => {
        if (!cancelled) setSession(fallbackSession);
      });

    return () => {
      cancelled = true;
    };
  }, [config, fallbackSession]);

  if (!session) {
    return (
      <section className={styles.loadingState} role="status" aria-live="polite">
        <LoaderCircle size={22} aria-hidden="true" />
        <strong>Building your repair test…</strong>
        <span>Prioritising questions from your local mistake notebook.</span>
      </section>
    );
  }

  return (
    <>
      {session.usedWeaknessFallback ? (
        <p className={styles.fallbackNote}>
          No saved mistakes match these filters, so this set uses reviewed hard and gap-repair questions.
        </p>
      ) : null}
      <TimedTestRunner test={session.test} />
    </>
  );
}
