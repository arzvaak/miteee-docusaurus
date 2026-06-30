import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calculator, CheckCircle2, Clock3, Gauge, Newspaper, SearchCheck, Target, Trophy } from "lucide-react";
import { SscDailyCommand } from "@/components/SscDailyCommand";
import { SscMistakeNotebook } from "@/components/SscMistakeNotebook";
import { getSscCglDashboard, getSscCglPracticeTopics } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Tier-I 200/200 System",
  description: "Timed SSC CGL Tier-I mocks, four-level topic repair, 200/200 practice, and current-affairs briefs.",
  pathname: "/exams/ssc-cgl"
});

export default function SscCglPage() {
  const dashboard = getSscCglDashboard();
  const practiceTopics = getSscCglPracticeTopics();
  const modeCounts = dashboard.readiness.testModeCounts;
  const levelLabels = ["Level 1", "Level 2", "Level 3", "Level 4"];
  const dailyLoop = dashboard.readiness.repairPlan.slice(0, 5);
  const dailyLoopMinutes = dailyLoop.reduce((total, item) => total + item.minutes, 0);
  const sectionCockpits = [
    {
      href: "/exams/ssc-cgl/reasoning-50",
      icon: <Target size={18} aria-hidden="true" />,
      label: "Level 1",
      title: "Reasoning 50/50",
      body: "Pattern recognition, arrangements, coding, direction, and conclusion traps."
    },
    {
      href: "/exams/ssc-cgl/ga-50",
      icon: <Newspaper size={18} aria-hidden="true" />,
      label: "Level 2",
      title: "GA 50/50",
      body: "Static GK, daily facts, memory hooks, and fact-to-anchor repair."
    },
    {
      href: "/exams/ssc-cgl/quant-50",
      icon: <Calculator size={18} aria-hidden="true" />,
      label: "Level 3",
      title: "Quant 50/50",
      body: "36-second sprint order, calculation speed, and topic-bank depth."
    },
    {
      href: "/exams/ssc-cgl/english-50",
      icon: <BookOpenCheck size={18} aria-hidden="true" />,
      label: "Level 4",
      title: "English 50/50",
      body: "Grammar, vocabulary, cloze, reading, and rule-first elimination."
    }
  ];

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">SSC CGL Tier-I</p>
          <h1>200/200 practice command center.</h1>
          <p>Built on the 2026 Tier-I pattern: 100 questions, 200 marks, four 15-minute sections, and -0.50 negative marking.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{formatNumber(dashboard.readiness.reviewedQuestions)}</strong><small>reviewed questions</small></span>
          <span><strong>{dashboard.readiness.sectionReadiness.length}</strong><small>Tier-I levels</small></span>
          <span><strong>{dashboard.readiness.tests}</strong><small>tests</small></span>
          <span><strong>{dashboard.readiness.topics}</strong><small>sublevels</small></span>
        </div>
      </header>

      <div className="ssc-action-grid">
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/tests">
          <Clock3 size={22} aria-hidden="true" />
          <strong>Timed tests</strong>
          <p>Full mocks, speed sprints, section locking, local result history.</p>
          <span>Start <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/topics">
          <BookOpenCheck size={22} aria-hidden="true" />
          <strong>Four-level map</strong>
          <p>Reasoning, GA, Quant, and English broken into sublevels with 500-question coverage floors.</p>
          <span>Open levels <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/quant-50">
          <Calculator size={22} aria-hidden="true" />
          <strong>Quant 50/50</strong>
          <p>36-second sprint order, speed repairs, and Quant topic banks for full marks.</p>
          <span>Open cockpit <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/current-affairs">
          <Newspaper size={22} aria-hidden="true" />
          <strong>Current affairs</strong>
          <p>Official-first daily facts with SSC relevance and MCQ seeds.</p>
          <span>Brief <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/practice">
          <Gauge size={22} aria-hidden="true" />
          <strong>Question bank</strong>
          <p>All usable questions grouped topic-wise for one-by-one answer practice.</p>
          <span>Open bank <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/resources">
          <SearchCheck size={22} aria-hidden="true" />
          <strong>Resource map</strong>
          <p>Book-PYQ base, official SSC anchors, model lanes, and outside source leads.</p>
          <span>View map <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
        <Link className="panel ssc-action-card" href="/exams/ssc-cgl/readiness">
          <CheckCircle2 size={22} aria-hidden="true" />
          <strong>Readiness proof</strong>
          <p>One clean evidence board for question depth, mocks, notes, resources, and news.</p>
          <span>Review proof <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
      </div>

      <section className="panel ssc-section-cockpit-strip" aria-labelledby="ssc-section-cockpit-heading">
        <div className="ssc-panel-heading">
          <Trophy size={18} aria-hidden="true" />
          <strong id="ssc-section-cockpit-heading">Four 50-mark section cockpits</strong>
        </div>
        <div className="ssc-section-cockpit-grid">
          {sectionCockpits.map((item) => (
            <Link className="ssc-section-cockpit-card" href={item.href} key={item.href}>
              {item.icon}
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <SscDailyCommand practiceTopics={practiceTopics} />

      <section className="panel ssc-daily-loop" aria-labelledby="ssc-daily-loop-heading">
        <div className="ssc-panel-heading">
          <Clock3 size={18} aria-hidden="true" />
          <span className="micro-label">Today 200/200 loop</span>
          <strong id="ssc-daily-loop-heading">No passive reading before timed work.</strong>
        </div>
        <div className="ssc-daily-loop-total">
          <span><strong>{dailyLoopMinutes}</strong><small>minutes if done fully</small></span>
          <span><strong>{dailyLoop.length}</strong><small>ordered blocks</small></span>
          <span><strong>36 sec</strong><small>target pace per question</small></span>
        </div>
        <div className="ssc-daily-loop-grid">
          {dailyLoop.map((item, index) => (
            <Link className="ssc-daily-loop-card" href={item.href} key={item.id}>
              <span>{String(index + 1).padStart(2, "0")} · {item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.target}</p>
              <small>{item.minutes} min · {item.evidence}</small>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <nav className="panel ssc-study-os-strip" aria-label="SSC CGL four-level study operating map">
        <header>
          <span className="micro-label">Study OS map</span>
          <strong>Four levels, topic sublevels, timed repair loops.</strong>
        </header>
        <div>
          {dashboard.readiness.sectionReadiness.map((section, index) => (
            <Link className={`ssc-study-os-node status-${section.readinessLabel}`} href={section.drillHref} key={section.section}>
              <span>{levelLabels[index] ?? `Level ${index + 1}`}</span>
              <strong>{section.title}</strong>
              <small>{section.topics} sublevels · {formatNumber(section.reviewedQuestions)} questions</small>
              <em>{section.readinessLabel.replace("-", " ")}</em>
            </Link>
          ))}
        </div>
      </nav>

      <section className="panel">
        <div className="ssc-panel-heading">
          <Trophy size={18} aria-hidden="true" />
          <span className="micro-label">200/200 readiness</span>
          <strong>Four-level Tier-I map</strong>
        </div>
        <div className="ssc-readiness-grid">
          {dashboard.readiness.sectionReadiness.map((section, index) => (
            <article className={`ssc-readiness-card status-${section.readinessLabel}`} key={section.section}>
              <header>
                <span>{levelLabels[index] ?? `Level ${index + 1}`} · {section.readinessLabel.replace("-", " ")}</span>
                <strong>{section.title}</strong>
              </header>
              <div className="ssc-readiness-meter" aria-label={`${section.readinessPercent}% corpus readiness`}>
                <i style={{ width: `${section.readinessPercent}%` }} />
              </div>
              <dl>
                <div><dt>Questions</dt><dd>{formatNumber(section.reviewedQuestions)}</dd></div>
                <div><dt>Book PYQs</dt><dd>{formatNumber(section.bookBackedQuestions)}</dd></div>
                <div><dt>Sublevels</dt><dd>{section.topics}</dd></div>
                <div><dt>Gap repair</dt><dd>{formatNumber(section.gapRepairQuestions)}</dd></div>
              </dl>
              <Link href={section.drillHref}>Section drills <ArrowRight size={14} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel ssc-strict-gates">
        <div className="ssc-panel-heading">
          <Trophy size={18} aria-hidden="true" />
          <span className="micro-label">{dashboard.readiness.strictAudit.readyFor200 ? "ready" : "needs repair"}</span>
          <strong>Strict 200/200 gates</strong>
        </div>
        <p>{dashboard.readiness.strictAudit.summary}</p>
        <div className="ssc-strict-gate-grid">
          {dashboard.readiness.strictAudit.gates.map((gate) => (
            <article className={`ssc-strict-gate-card status-${gate.status}`} key={gate.id}>
              <span>{gate.status}</span>
              <strong>{gate.label}</strong>
              <p>{gate.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel ssc-mock-inventory">
        <div className="ssc-panel-heading"><Clock3 size={18} aria-hidden="true" /><strong>Mock and drill inventory</strong></div>
        <div className="ssc-inventory-grid">
          <span><strong>{formatNumber(dashboard.readiness.fullMocks)}</strong><small>full 200-mark mocks</small></span>
          <span><strong>{formatNumber(modeCounts.pyq_shift ?? 0)}</strong><small>book-PYQ shifts</small></span>
          <span><strong>{formatNumber(modeCounts.speed_sprint ?? 0)}</strong><small>speed sprints</small></span>
          <span><strong>{formatNumber(modeCounts.topic_drill ?? 0)}</strong><small>topic drills</small></span>
        </div>
      </section>

      <section className="panel">
        <div className="ssc-panel-heading"><BookOpenCheck size={18} aria-hidden="true" /><strong>Study-depth audit</strong></div>
        <div className="ssc-depth-grid">
          <span><strong>{dashboard.readiness.studyDepth.topicsWithNotes}/{dashboard.readiness.studyDepth.totalTopics}</strong><small>topic notes</small></span>
          <span><strong>{dashboard.readiness.studyDepth.deepNotes}</strong><small>deep notes</small></span>
          <span><strong>{dashboard.readiness.studyDepth.notesWithPractice}</strong><small>practice-linked</small></span>
          <span><strong>{formatNumber(dashboard.readiness.studyDepth.totalExamples)}</strong><small>worked examples</small></span>
        </div>
        <div className="ssc-depth-list">
          {dashboard.readiness.studyDepth.weakestNotes.map((note) => (
            <Link href={note.href} key={note.slug}>
              <span>
                <strong>{note.title}</strong>
                <small>{note.subject} · {formatNumber(note.bodyLength)} chars · {note.examples} examples</small>
              </span>
              <em>{note.hasFlowchart ? "flowchart" : "needs flowchart"} · {note.hasTrapTable ? "trap table" : "needs trap table"} · {note.hasPractice ? "practice linked" : "needs practice link"}</em>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="ssc-panel-heading"><Trophy size={18} aria-hidden="true" /><strong>200/200 repair plan</strong></div>
        <div className="ssc-repair-plan">
          {dashboard.readiness.repairPlan.map((item) => (
            <Link className="ssc-repair-item" href={item.href} key={item.id}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.target}</p>
              <small>{item.minutes} min · {item.evidence}</small>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <SscMistakeNotebook />

      <section className="panel">
        <div className="ssc-panel-heading"><Trophy size={18} aria-hidden="true" /><strong>Pressure queue</strong></div>
        <div className="ssc-pressure-list">
          {dashboard.readiness.pressureQueue.map((topic) => (
            <Link href={`/exams/ssc-cgl/practice/${topic.slug}`} key={topic.slug}>
              <span>
                <strong>{topic.title}</strong>
                <small>{topic.subject} · {topic.readinessLabel.replace("-", " ")} · {formatNumber(topic.reviewedQuestions)} questions</small>
              </span>
              <em>{topic.nextAction}</em>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="ssc-panel-heading"><Trophy size={18} aria-hidden="true" /><strong>High-yield queue</strong></div>
        <div className="ssc-topic-list">
          {dashboard.highYieldTopics.map((topic) => (
            <Link href={`/exams/ssc-cgl/practice/${topic.slug}`} key={topic.slug}>
              <strong>{topic.title}</strong>
              <span>{topic.subject} · {topic.priority}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
