import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { getCatQuantQuestions, getCatQuantTopics } from "@/lib/cat";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "CAT Preparation",
  description: "Study CAT by section, beginning with Quantitative Aptitude notes and book-backed practice.",
  pathname: "/exams/cat"
});

export default function CatPage() {
  const topics = getCatQuantTopics();
  const questions = getCatQuantQuestions();
  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero"><div><p className="panel-kicker">Common Admission Test</p><h1>CAT preparation, one section at a time.</h1><p>Quantitative Aptitude is active now. The notes and practice bank are grounded in the provided Quantum CAT book.</p></div></header>
      <Link className="panel ssc-exam-card" href="/exams/cat/quant">
        <span className="home-icon-badge"><Calculator size={20} aria-hidden="true" /></span>
        <div><strong>Quantitative Aptitude</strong><p>{topics.length} chapter notes and {questions.length.toLocaleString("en-IN")} reviewed practice questions.</p></div>
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
