import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { getCatQuantTopics } from "@/lib/cat";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "CAT Quant Practice",
  description: "Choose a CAT Quant chapter and practice every reviewed question from the provided Quantum CAT book.",
  pathname: "/exams/cat/quant/practice"
});

export default function CatQuantPracticePage() {
  const topics = getCatQuantTopics();
  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero"><div><p className="panel-kicker">CAT Quant practice</p><h1>Finish the question bank chapter by chapter.</h1><p>Progress is saved locally in this browser. Open any chapter to continue from your last position.</p></div></header>
      <div className="ssc-practice-topic-grid">
        {topics.map((topic) => (
          <Link className="ssc-practice-topic-card" href={`/exams/cat/quant/practice/${topic.slug}`} key={topic.slug}>
            <Target size={18} aria-hidden="true" />
            <strong>{topic.title}</strong>
            <p>Chapter {topic.chapterNumber} · {topic.questionCount.toLocaleString("en-IN")} questions</p>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
