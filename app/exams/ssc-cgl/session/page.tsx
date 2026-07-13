import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { SscEndlessRunner } from "@/components/SscEndlessRunner";
import { SscWeakSessionLoader } from "@/components/SscWeakSessionLoader";
import { TimedTestRunner } from "@/components/TimedTestRunner";
import { getSscQuestions } from "@/lib/ssc-cgl";
import {
  buildSscEndlessBatch,
  buildSscSessionTest,
  parseSscSessionConfig
} from "@/lib/ssc-cgl-session";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/components/SscSession.module.css";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "SSC CGL Test Session",
  description: "A configurable SSC CGL Tier-I MCQ session with official marking, section timing, and endless practice.",
  pathname: "/exams/ssc-cgl/session"
});

type SessionSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SscCglSessionPage({ searchParams }: { searchParams: SessionSearchParams }) {
  const config = parseSscSessionConfig(await searchParams);
  const questions = getSscQuestions();

  if (config.mode === "endless") {
    const initialBatch = buildSscEndlessBatch(questions, config, 0, 20);
    if (initialBatch.total === 0) return <NoMatchingQuestions />;
    return <SscEndlessRunner config={config} initialBatch={initialBatch} />;
  }

  const session = buildSscSessionTest(questions, config);
  if (session.test.questionCount === 0) return <NoMatchingQuestions />;

  if (config.mode === "weak") {
    return <SscWeakSessionLoader config={config} fallbackSession={session} />;
  }

  return <TimedTestRunner test={session.test} />;
}

function NoMatchingQuestions() {
  return (
    <section className={styles.emptyState}>
      <span><SlidersHorizontal size={20} aria-hidden="true" /></span>
      <p>That combination is too narrow.</p>
      <h1>No reviewed questions match these filters yet.</h1>
      <p>Keep the exam mode, then widen source or difficulty to “All”.</p>
      <Link href="/exams/ssc-cgl">
        <ArrowLeft size={16} aria-hidden="true" /> Change test setup
      </Link>
    </section>
  );
}
