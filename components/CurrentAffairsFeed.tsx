import Link from "next/link";
import { Archive, ArrowRight, BookOpenCheck, Brain, CalendarDays, CircleGauge, Newspaper, RefreshCcw, Sparkles, Target } from "lucide-react";
import { CurrentAffairsRecallClient } from "@/components/CurrentAffairsRecallClient";
import { isCurrentAffairsStudyPriority } from "@/lib/current-affairs";
import type { CurrentAffairsArchiveDay, CurrentAffairsStudyBrief } from "@/lib/exam-types";

export function CurrentAffairsFeed({ brief, archiveDays = [] }: { brief: CurrentAffairsStudyBrief; archiveDays?: CurrentAffairsArchiveDay[] }) {
  const studyItems = brief.items.filter(isCurrentAffairsStudyPriority);
  const packetByUrl = new Map(brief.revisionPackets.map((packet) => [packet.url, packet]));
  const staticBridgeCount = new Set(brief.revisionPackets.flatMap((packet) => packet.staticAnchors.map((anchor) => anchor.topicSlug))).size
    || brief.sourceQuality.staticAnchorCount;
  const examAreas = brief.sourceQuality.examAreas.slice(0, 3).join(" · ") || "Current affairs static GK";
  const arrivalItems = (brief.calendar?.as_they_come ?? brief.calendar?.today?.events ?? []).filter(isCurrentAffairsStudyPriority);
  const weeklyDays = brief.calendar?.weekly_by_day ?? brief.calendar?.weekly_calendar ?? brief.calendar?.last_7_days ?? [];
  const monthlyDays = brief.calendar?.monthly_by_day ?? brief.calendar?.monthly_calendar ?? brief.calendar?.last_30_days ?? [];
  const weekItems = brief.calendar?.week_total_items ?? weeklyDays.reduce((sum, day) => sum + day.items, 0);
  const weekHighYield = brief.calendar?.week_high_yield ?? weeklyDays.reduce((sum, day) => sum + day.high_yield, 0);
  const monthItems = brief.calendar?.month_total_items ?? monthlyDays.reduce((sum, day) => sum + day.items, 0);
  const monthHighYield = brief.calendar?.month_high_yield ?? monthlyDays.reduce((sum, day) => sum + day.high_yield, 0);

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">SSC + UPSC current affairs</p>
          <h1>{brief.date}</h1>
          <p>Daily exam-facing briefs with SSC recall, UPSC prelims facts, mains angles, static background, and saved recall cards.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{brief.sourceQuality.totalItems}</strong><small>items</small></span>
          <span><strong>{brief.sourceQuality.highRelevanceItems}</strong><small>high relevance</small></span>
          <span><strong>{brief.sourceQuality.officialSourceItems}</strong><small>official</small></span>
          <span><strong>{brief.recallCards.length}</strong><small>recall cards</small></span>
        </div>
      </header>

      <CurrentAffairsRecallClient cards={brief.recallCards} />

      <section className="panel ssc-current-protocol" aria-label="Daily SSC current affairs recall protocol">
        <div className="ssc-panel-heading">
          <BookOpenCheck size={18} aria-hidden="true" />
          <strong>Daily recall protocol</strong>
        </div>
        <p className="ssc-current-protocol-summary">
          Read fact -&gt; answer MCQ seed -&gt; bridge static GK -&gt; attach UPSC angle -&gt; retest before closing the day.
        </p>
        <div className="ssc-current-protocol-grid">
          <div className="ssc-current-protocol-step">
            <Newspaper size={18} aria-hidden="true" />
            <span>1</span>
            <div>
              <strong>Capture {studyItems.length} facts</strong>
              <p>Read the exam-facing point, prelims fact, and one background link.</p>
            </div>
          </div>
          <div className="ssc-current-protocol-step">
            <Brain size={18} aria-hidden="true" />
            <span>2</span>
            <div>
              <strong>Answer {brief.recallCards.length} recall cards</strong>
              <p>Use the MCQ seed first, then reveal the answer and trap after recall.</p>
            </div>
          </div>
          <div className="ssc-current-protocol-step">
            <Target size={18} aria-hidden="true" />
            <span>3</span>
            <div>
              <strong>Bridge {staticBridgeCount} static GK anchors</strong>
              <p>Revise the linked static topic so the fact becomes reusable for SSC and UPSC.</p>
            </div>
          </div>
          <div className="ssc-current-protocol-step">
            <CircleGauge size={18} aria-hidden="true" />
            <span>4</span>
            <div>
              <strong>Retest GA under 36 seconds</strong>
              <p>Priority areas today: {examAreas}.</p>
            </div>
          </div>
        </div>
        <div className="ssc-current-protocol-actions">
          <Link href="/exams/ssc-cgl/topics/current-affairs-static-gk">Open static GK bridge</Link>
          <Link href="/exams/ssc-cgl/tests?mode=speed_sprint&section=general-awareness">Start GA sprint</Link>
        </div>
      </section>

      <section className="panel ssc-current-archive" aria-label="Daily current affairs archive">
        <div className="ssc-panel-heading">
          <Archive size={18} aria-hidden="true" />
          <strong>Daily brief archive</strong>
        </div>
        {archiveDays.length > 0 ? (
          <div className="ssc-current-archive-list">
            {archiveDays.map((item) => (
              <Link className={item.isSelected ? "active" : ""} href={item.href} key={item.date} aria-current={item.isSelected ? "page" : undefined}>
                <span>
                  <strong>{item.date}</strong>
                  <small>{item.status} · {item.totalItems} items · {item.highRelevanceItems} high-yield</small>
                </span>
                <span>{item.officialSourceItems} official · {item.recallCards} recall</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="ssc-muted">Daily archive will appear after the first successful brief is available.</p>
        )}
      </section>

      {brief.calendar ? (
        <section className="panel ssc-current-calendar" aria-label="Current affairs calendar memory">
          <div className="ssc-panel-heading">
            <CalendarDays size={18} aria-hidden="true" />
            <strong>Calendar memory</strong>
          </div>
          <p className="ssc-current-calendar-intro">
            Use this as the running log: what is happening today, what happened yesterday, and what has accumulated across the current week and month.
          </p>
          {arrivalItems.length > 0 ? (
            <div className="ssc-current-arrival-stream" aria-label="Current affairs as they come today">
              <span>As they come today</span>
              <div>
                {arrivalItems.slice(0, 8).map((event) => (
                  <Link href={event.url} target="_blank" key={`${event.source}-${event.url}`}>
                    <strong>{event.title}</strong>
                    <small>{event.source} · SSC {event.ssc_relevance} · UPSC {event.upsc_cse_relevance ?? "low"} · {event.exam_areas.slice(0, 3).join(", ") || "Current Affairs"}</small>
                    <p>{event.brief}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <div className="ssc-current-calendar-grid">
            {brief.calendar.today ? (
              <div className="ssc-current-calendar-day">
                <span>Today</span>
                <strong>{brief.calendar.today.date}</strong>
                <p>{brief.calendar.today.items} items · {brief.calendar.today.high_yield} high-yield</p>
                <small>{brief.calendar.today.exam_areas.slice(0, 4).join(" · ") || "No areas yet"}</small>
                <ul>{brief.calendar.today.headlines.slice(0, 3).map((headline) => <li key={headline}>{headline}</li>)}</ul>
              </div>
            ) : null}
            {brief.calendar.yesterday ? (
              <div className="ssc-current-calendar-day">
                <span>Yesterday</span>
                <strong>{brief.calendar.yesterday.date}</strong>
                <p>{brief.calendar.yesterday.items} items · {brief.calendar.yesterday.high_yield} high-yield</p>
                <small>{brief.calendar.yesterday.exam_areas.slice(0, 4).join(" · ") || "No areas yet"}</small>
                <ul>{brief.calendar.yesterday.headlines.slice(0, 3).map((headline) => <li key={headline}>{headline}</li>)}</ul>
              </div>
            ) : null}
            <div className="ssc-current-calendar-day">
              <span>Running week</span>
              <strong>{weeklyDays.length} days</strong>
              <p>{weekItems} items · {weekHighYield} high-yield</p>
              <small>{weeklyDays.slice(-3).map((day) => day.date).join(" · ") || "Waiting for more days"}</small>
              <ul>{weeklyDays.flatMap((day) => day.headlines.slice(0, 1).map((headline) => `${day.date}: ${headline}`)).slice(-4).map((headline) => <li key={headline}>{headline}</li>)}</ul>
            </div>
            <div className="ssc-current-calendar-day">
              <span>Running month</span>
              <strong>{monthlyDays.length} days</strong>
              <p>{monthItems} items · {monthHighYield} high-yield</p>
              <small>{monthlyDays.slice(-4).map((day) => day.date).join(" · ") || "Waiting for more days"}</small>
              <ul>{monthlyDays.flatMap((day) => day.headlines.slice(0, 1).map((headline) => `${day.date}: ${headline}`)).slice(-5).map((headline) => <li key={headline}>{headline}</li>)}</ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel ssc-current-run-state" aria-label="Current affairs daily reliability">
        <div className="ssc-panel-heading">
          <Newspaper size={18} aria-hidden="true" />
          <strong>Daily reliability</strong>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{brief.runState.freshnessLabel}</strong><small>freshness</small></span>
          <span><strong>{brief.runState.continuityLabel}</strong><small>daily reliability</small></span>
          <span><strong>{brief.runState.reliabilityPercent}%</strong><small>success rate</small></span>
          <span><strong>{brief.runState.lastSuccessfulDate ?? "Not yet"}</strong><small>last successful</small></span>
          <span><strong>{brief.runState.latestRawItems}</strong><small>latest intake</small></span>
          <span><strong>{brief.runState.latestSummaryItems}</strong><small>latest summaries</small></span>
        </div>
        <div className={`ssc-current-freshness status-${brief.runState.freshnessStatus}`}>
          <RefreshCcw size={16} aria-hidden="true" />
          <span>Expected {brief.runState.expectedDate}</span>
          <p>{brief.runState.repairAction}</p>
        </div>
        <div className="ssc-current-source-health">
          <span>Latest sources</span>
          <p>{brief.runState.latestSources.length ? brief.runState.latestSources.join(" · ") : "Waiting for first successful daily run"}</p>
        </div>
        <div className="ssc-current-source-counts" aria-label="Current affairs source counts">
          {Object.entries(brief.runState.sourceCounts).length > 0 ? Object.entries(brief.runState.sourceCounts).map(([source, count]) => (
            <span key={source}><strong>{source}</strong>{count}</span>
          )) : <span><strong>No source ledger yet</strong>0</span>}
        </div>
      </section>

      <div className="ssc-current-list">
        {studyItems.length === 0 ? (
          <article className="panel ssc-empty-state">
            <Newspaper size={22} aria-hidden="true" />
            <h2>No brief for this date yet</h2>
            <p>Check the latest date or wait for the next official-first daily brief.</p>
          </article>
        ) : studyItems.map((item) => (
          <article className="panel ssc-current-card" key={`${item.source}-${item.url}`}>
            <div className="ssc-panel-heading">
              <Sparkles size={18} aria-hidden="true" />
              <strong>{item.title}</strong>
            </div>
            <p>{item.why_it_matters_for_ssc_cgl}</p>
            <ul>
              {item.key_points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            {item.source_excerpt ? (
              <div className="ssc-current-source-excerpt">
                <span>Source excerpt</span>
                <p>{item.source_excerpt}</p>
              </div>
            ) : null}
            {item.why_it_matters_for_upsc_cse || item.static_context ? (
              <div className="ssc-current-deep-dive">
                {item.why_it_matters_for_upsc_cse ? (
                  <p><strong>UPSC CSE:</strong> {item.why_it_matters_for_upsc_cse}</p>
                ) : null}
                {item.static_context ? (
                  <p><strong>Background:</strong> {item.static_context}</p>
                ) : null}
                {item.prelims_facts?.length ? (
                  <div>
                    <span>Prelims facts</span>
                    <ul>{item.prelims_facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
                  </div>
                ) : null}
                {item.mains_angles?.length ? (
                  <div>
                    <span>Mains angles</span>
                    <ul>{item.mains_angles.map((angle) => <li key={angle}>{angle}</li>)}</ul>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="ssc-current-footer">
              <span>{item.source} · SSC {item.ssc_relevance} · UPSC {item.upsc_cse_relevance ?? "low"} · {item.exam_areas.join(", ")}</span>
              <Link href={item.url} target="_blank">Source</Link>
            </div>
            {packetByUrl.get(item.url) ? (
              <div className="ssc-static-anchors">
                <span>Static GK bridge</span>
                <div>
                  {packetByUrl.get(item.url)!.staticAnchors.map((anchor) => (
                    <Link href={anchor.href} key={anchor.topicSlug}>{anchor.label}</Link>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="ssc-mcq-seed">
              <span>MCQ seed</span>
              <strong>{item.mcq_seed.question}</strong>
              <small>Answer: {item.mcq_seed.answer}. Trap: {item.mcq_seed.trap}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
