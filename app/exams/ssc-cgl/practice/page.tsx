import { Target } from "lucide-react";
import { SscPracticeDashboardClient } from "@/components/SscPracticeDashboardClient";
import { getSscCglPracticeTopics, sscCglPattern } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Topic Practice",
  description: "Practice every usable SSC CGL question one by one, grouped by Tier-I topic.",
  pathname: "/exams/ssc-cgl/practice"
});

export default function SscCglPracticePage() {
  const topics = getSscCglPracticeTopics();
  const totalQuestions = topics.reduce((sum, topic) => sum + topic.totalQuestions, 0);
  const reviewedQuestions = topics.reduce((sum, topic) => sum + topic.reviewedQuestions, 0);
  const bookBackedQuestions = topics.reduce((sum, topic) => sum + topic.bookBackedQuestions, 0);
  const pyqQuestions = topics.reduce((sum, topic) => sum + topic.pyqQuestions, 0);
  const topicsBySection = sscCglPattern.sections.map((section) => ({
    ...section,
    topics: topics.filter((topic) => topic.section === section.id)
  }));

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Topic practice</p>
          <h1>Practice every question, one by one.</h1>
          <p>Pick a topic and work through the whole bank with instant answer reveal, explanation, source, and saved progress.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{totalQuestions}</strong><small>usable questions</small></span>
          <span><strong>{reviewedQuestions}</strong><small>reviewed</small></span>
          <span><strong>{bookBackedQuestions}</strong><small>book-backed</small></span>
          <span><strong>{pyqQuestions}</strong><small>PYQ-style</small></span>
        </div>
      </header>

      <section className="panel ssc-practice-start-panel" aria-label="Practice mode">
        <div className="ssc-panel-heading">
          <Target size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Use this for volume</p>
            <strong>Accuracy bank first, timed tests after.</strong>
          </div>
        </div>
        <p className="ssc-muted">This mode is not a mock. It is for finishing the corpus topic by topic, correcting instantly, and keeping progress locally in this browser.</p>
      </section>

      <SscPracticeDashboardClient sections={topicsBySection} />
    </section>
  );
}
