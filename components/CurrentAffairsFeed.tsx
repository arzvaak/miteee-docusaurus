"use client";

import Link from "next/link";
import {
  ArrowDown,
  ChevronDown,
  ExternalLink,
  FileQuestion,
  RotateCcw,
  Sparkles,
  X
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CurrentAffairsHiddenStories,
  CurrentAffairsLensSelector,
  CurrentAffairsStoryActions,
  useCurrentAffairsActions
} from "@/components/CurrentAffairsActions";
import { isCurrentAffairsStoryHidden, type CurrentAffairsStoryIdentity } from "@/lib/current-affairs-actions";
import type {
  CurrentAffairsArchiveDay,
  CurrentAffairsIssue,
  CurrentAffairsStoryRecord,
  CurrentAffairsStudyBrief,
  CurrentAffairsSummaryItem
} from "@/lib/exam-types";
import styles from "@/components/CurrentAffairsFeed.module.css";

type EditionMode = "daily" | "weekly" | "monthly";

type CurrentAffairsFeedProps = {
  archiveDays?: CurrentAffairsArchiveDay[];
  brief: CurrentAffairsStudyBrief;
  canAdmin?: boolean;
  dailyStories: CurrentAffairsStoryRecord[];
  initialEdition?: EditionMode;
  initialStorySlug?: string;
  monthlyIssue: CurrentAffairsIssue | null;
  weeklyIssue: CurrentAffairsIssue | null;
};

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  timeZone: "UTC",
  year: "numeric"
});

const longDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric"
});

function formatDate(value: string) {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00.000Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : longDateFormatter.format(date);
}

function monthLabel(value: string) {
  const date = new Date(`${value.slice(0, 7)}-01T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? value.slice(0, 7) : monthFormatter.format(date);
}

function storyIdentity(story: CurrentAffairsStoryRecord): CurrentAffairsStoryIdentity {
  return {
    id: story.selectionId,
    title: story.title,
    source: story.source,
    url: story.sourceUrl,
    publishedAt: story.publishedAt
  };
}

const genericFillerPattern = /revise the static background|convert the source-grounded fact|attach (?:the|this) fact to prelims|frame the update through|one mains-ready issue angle|stopping at the headline|should be revised from this update/i;

function comparableText(value: string) {
  return value.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, " ").trim();
}

function looksLikeHeadlineRewrite(value: string, normalizedTitle: string) {
  if (value.length >= 160) return false;
  const titleWords = new Set(normalizedTitle.split(" ").filter((word) => word.length >= 4));
  const valueWords = new Set(comparableText(value).split(" ").filter((word) => word.length >= 4));
  if (titleWords.size === 0 || valueWords.size === 0) return false;
  const shared = [...valueWords].filter((word) => titleWords.has(word)).length;
  return shared / Math.min(titleWords.size, valueWords.size) >= 0.5;
}

function usefulStoryText(values: Array<string | undefined>, title: string) {
  const normalizedTitle = comparableText(title);
  const seen: string[] = [];
  return values.flatMap((value) => {
    const text = value?.trim();
    if (!text || text.length < 45 || genericFillerPattern.test(text)) return [];
    const normalized = comparableText(text);
    if (!normalized || normalized === normalizedTitle || looksLikeHeadlineRewrite(text, normalizedTitle)) return [];
    if (seen.some((existing) => existing === normalized || existing.includes(normalized) || normalized.includes(existing))) return [];
    seen.push(normalized);
    return [text];
  });
}

function storyContent(item: CurrentAffairsSummaryItem, title: string, lens: "ssc" | "upsc") {
  // Prefer the model's distilled points over the often much longer source
  // excerpt. The excerpt remains the fallback when no trustworthy key point
  // was produced.
  const facts = usefulStoryText([...item.key_points, item.source_excerpt], title).slice(0, 4);
  const context = usefulStoryText([item.static_context], title)[0];
  const retainedFacts = usefulStoryText(item.prelims_facts ?? [], title).slice(0, 4);
  const implications = usefulStoryText([
    ...(item.mains_angles ?? []),
    lens === "upsc" ? item.why_it_matters_for_upsc_cse : item.why_it_matters_for_ssc_cgl
  ], title).slice(0, 3);
  return { context, facts, implications, retainedFacts };
}

function contentProof(item: CurrentAffairsSummaryItem) {
  const evidence = item.content_evidence;
  if (!evidence) {
    return { detail: "This legacy brief does not record extraction provenance.", label: "Article body not verified", verified: false };
  }
  const characters = evidence.captured_characters.toLocaleString("en-IN");
  if (evidence.origin === "article-page") {
    const method = evidence.method === "json-ld-articleBody" ? "JSON-LD articleBody" : "HTML article paragraphs";
    return { detail: `${characters} body characters captured via ${method}.`, label: "Article body parsed", verified: true };
  }
  if (evidence.origin === "official-page") {
    return { detail: `${characters} characters captured from the official page.`, label: "Official page parsed", verified: true };
  }
  if (evidence.origin === "official-record") {
    return { detail: `${characters} characters captured from the official record.`, label: "Official record only", verified: false };
  }
  return { detail: `${characters} characters came from feed metadata, not an article body.`, label: "Feed summary only", verified: false };
}

function storyLeadScore(story: CurrentAffairsStoryRecord) {
  const relevanceScore = { high: 4, medium: 2, low: 0 } as const;
  const detailScore = Math.min(story.item.key_points.length, 3)
    + Math.min(story.item.prelims_facts?.length ?? 0, 2)
    + Math.min(story.item.mains_angles?.length ?? 0, 2);
  return relevanceScore[story.lenses.ssc] + relevanceScore[story.lenses.upsc] + detailScore;
}

function leadStory(stories: CurrentAffairsStoryRecord[], state: ReturnType<typeof useCurrentAffairsActions>["state"]) {
  return stories
    .filter((story) => !isCurrentAffairsStoryHidden(state, storyIdentity(story)))
    .reduce<CurrentAffairsStoryRecord | null>((best, story) => {
      if (!best) return story;
      return storyLeadScore(story) > storyLeadScore(best) ? story : best;
    }, null);
}

function rankStories(stories: CurrentAffairsStoryRecord[]) {
  return [...stories].sort((left, right) => storyLeadScore(right) - storyLeadScore(left));
}

function keyDates(item: CurrentAffairsSummaryItem) {
  const seen = new Set<string>();
  const dates = [{ label: formatDate(item.published_at), detail: "Story published or updated" }];
  seen.add(dates[0]!.label);
  const text = [item.source_excerpt, ...item.key_points, ...(item.prelims_facts ?? [])].filter(Boolean).join(" ");
  const matches = text.match(/\b(?:\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi) ?? [];
  for (const match of matches) {
    const label = match.trim();
    if (!seen.has(label)) {
      seen.add(label);
      dates.push({ label, detail: "Date mentioned in the explainer" });
    }
    if (dates.length === 4) break;
  }
  return dates;
}

function editionStories(
  mode: EditionMode,
  dailyStories: CurrentAffairsStoryRecord[],
  weeklyIssue: CurrentAffairsIssue | null,
  monthlyIssue: CurrentAffairsIssue | null
) {
  if (mode === "weekly") return rankStories(weeklyIssue?.stories ?? dailyStories);
  if (mode === "monthly") return rankStories(monthlyIssue?.stories ?? dailyStories);
  return rankStories(dailyStories);
}

function editionSummary(mode: EditionMode, count: number) {
  if (mode === "weekly") return `${count} important developments from this week, condensed for revision. Open any row for the complete daily explainer.`;
  if (mode === "monthly") return `${count} developments organised as a monthly revision issue, with key facts retained and repetition removed.`;
  return `${count} stories in today’s complete edition. Open any headline to read the full explainer here.`;
}

export function CurrentAffairsFeed({
  archiveDays = [],
  brief,
  canAdmin = false,
  dailyStories,
  initialEdition = "daily",
  initialStorySlug,
  monthlyIssue,
  weeklyIssue
}: CurrentAffairsFeedProps) {
  const { state } = useCurrentAffairsActions();
  const [mode, setMode] = useState<EditionMode>(initialEdition);
  // An empty string means "open the best lead", while null is an explicit
  // learner choice to keep every story collapsed.
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => initialStorySlug || "");
  const activeStories = useMemo(
    () => editionStories(mode, dailyStories, weeklyIssue, monthlyIssue),
    [dailyStories, mode, monthlyIssue, weeklyIssue]
  );
  const visibleStories = useMemo(
    () => activeStories.filter((story) => !isCurrentAffairsStoryHidden(state, storyIdentity(story))),
    [activeStories, state]
  );
  const selectedStory = selectedSlug === null
    ? null
    : visibleStories.find((story) => story.slug === selectedSlug) ?? leadStory(activeStories, state);
  const lens = state.lens;
  const issue = mode === "weekly" ? weeklyIssue : mode === "monthly" ? monthlyIssue : null;

  useEffect(() => {
    function syncFromHistory() {
      const url = new URL(window.location.href);
      const edition = url.searchParams.get("edition");
      const story = url.searchParams.get("story");
      const historyStory = window.history.state?.currentAffairsStory;
      setMode(edition === "weekly" || edition === "monthly" ? edition : "daily");
      if (typeof historyStory === "string" || historyStory === null) {
        setSelectedSlug(historyStory);
      } else {
        setSelectedSlug(story || "");
      }
    }
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  function pushStorySelection(story: CurrentAffairsStoryRecord | null) {
    const url = new URL(window.location.href);
    if (story) {
      url.searchParams.set("date", story.date);
      url.searchParams.set("story", story.slug);
    } else url.searchParams.delete("story");
    url.hash = story ? story.selectionId : "";
    window.history.pushState(
      { ...(window.history.state ?? {}), currentAffairsStory: story?.slug ?? null },
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }

  function selectStory(story: CurrentAffairsStoryRecord) {
    if (selectedStory?.slug === story.slug) {
      setSelectedSlug(null);
      pushStorySelection(null);
      return;
    }
    setSelectedSlug(story.slug);
    pushStorySelection(story);
    window.requestAnimationFrame(() => {
      document.getElementById(story.selectionId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function selectMode(nextMode: EditionMode) {
    setMode(nextMode);
    const nextStories = editionStories(nextMode, dailyStories, weeklyIssue, monthlyIssue);
    const nextStory = leadStory(nextStories, state);
    setSelectedSlug(nextStory?.slug ?? "");
    const url = new URL(window.location.href);
    if (nextMode === "daily") {
      url.searchParams.delete("edition");
      url.searchParams.delete("period");
    } else {
      const nextIssue = nextMode === "weekly" ? weeklyIssue : monthlyIssue;
      url.searchParams.set("edition", nextMode);
      if (nextIssue) url.searchParams.set("period", nextIssue.key);
    }
    if (nextStory) url.searchParams.set("story", nextStory.slug);
    else url.searchParams.delete("story");
    if (nextStory) url.searchParams.set("date", nextStory.date);
    url.hash = nextStory ? nextStory.selectionId : "";
    window.history.pushState(
      { ...(window.history.state ?? {}), currentAffairsStory: nextStory?.slug ?? null },
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }

  const issueLabel = mode === "daily"
    ? "Today’s edition"
    : mode === "weekly"
      ? "Weekly revision"
      : "Monthly magazine";

  return (
    <div className={styles.magazine}>
      <aside className={styles.issueRail} aria-label="Current affairs issue navigation">
        <div className={styles.issueMasthead}>
          <strong>{monthLabel(brief.date)}</strong>
          <span aria-hidden="true" />
        </div>

        <nav className={styles.dayIndex} aria-label="Daily editions">
          {archiveDays.slice(0, 7).map((day, index) => (
            <Link
              aria-current={day.isSelected ? "page" : undefined}
              className={day.isSelected ? styles.activeDay : undefined}
              href={day.href}
              key={day.date}
            >
              {index === 0 ? `${formatDate(day.date).replace(/\s+\d{4}$/, "")} · Today` : formatDate(day.date).replace(/\s+\d{4}$/, "")}
            </Link>
          ))}
        </nav>

        <div className={styles.railSection}>
          <span>Weekly digests</span>
          <button aria-pressed={mode === "weekly"} onClick={() => selectMode("weekly")} type="button">
            <strong>
              <span className={styles.railLongTitle}>{weeklyIssue?.title ?? "This week"}</span>
              <span className={styles.railShortTitle}>{weeklyIssue ? `Week ${Number(weeklyIssue.key.split("-W")[1])}` : "This week"}</span>
            </strong>
            <small>{weeklyIssue ? `${weeklyIssue.startDate} – ${weeklyIssue.endDate}` : "Building this issue"}</small>
          </button>
        </div>

        <div className={styles.railSection}>
          <span>Monthly magazine</span>
          <button aria-pressed={mode === "monthly"} onClick={() => selectMode("monthly")} type="button">
            <strong>{monthlyIssue?.title ?? monthLabel(brief.date)}</strong>
            <small>{monthlyIssue ? `${monthlyIssue.storyCount} stories` : "Building this issue"}</small>
          </button>
        </div>

        <details className={styles.hiddenManager}>
          <summary><RotateCcw size={14} aria-hidden="true" /> Hidden stories</summary>
          <CurrentAffairsHiddenStories canAdmin={canAdmin} className={styles.hiddenStories} />
        </details>
      </aside>

      <main className={styles.canvas}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Current Affairs</h1>
            <p>Daily depth, weekly clarity, monthly revision.</p>
          </div>
          <div className={styles.editionControls}>
            <div className={styles.modeSwitch} aria-label="Edition type" role="group">
              {(["daily", "weekly", "monthly"] as const).map((value) => (
                <button aria-pressed={mode === value} key={value} onClick={() => selectMode(value)} type="button">
                  {value[0]!.toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
            <CurrentAffairsLensSelector className={styles.lensSwitch} />
            <Link className={styles.examLink} href="/exams/ssc-cgl/tests?mode=full_mock">
              <FileQuestion size={16} aria-hidden="true" /> Monthly exam
            </Link>
          </div>
        </header>

        <section className={styles.editionIntro}>
          <div>
            <span>{issueLabel}</span>
            <strong>{mode === "daily" ? formatDate(brief.date) : issue?.title ?? formatDate(brief.date)}</strong>
          </div>
          <div className={styles.editionDescription}>
            <p>{editionSummary(mode, visibleStories.length)}</p>
            <small>
              Sources: PIB, RBI, PRS, SSC, The Hindu, The Times of India, and The Indian Express.
              Newspaper stories appear only after the linked article body is parsed.
            </small>
          </div>
        </section>

        {visibleStories.length === 0 ? (
          <section className={styles.emptyState}>
            <Sparkles size={20} aria-hidden="true" />
            <h2>No visible stories in this edition</h2>
            <p>Restore a hidden story from the issue rail, or open another daily edition.</p>
          </section>
        ) : (
          <section className={styles.storyStream} aria-label={`${issueLabel} stories`}>
            {visibleStories.map((story, index) => {
              const selected = selectedStory?.slug === story.slug;
              const nextStory = visibleStories[index + 1] ?? null;
              return (
                <Fragment key={`${story.date}-${story.slug}`}>
                  <button
                    aria-expanded={selected}
                    aria-controls={selected ? `${story.selectionId}-reader` : undefined}
                    className={selected ? `${styles.storyRow} ${styles.selectedRow}` : styles.storyRow}
                    id={story.selectionId}
                    onClick={() => selectStory(story)}
                    type="button"
                  >
                    <span className={styles.storyNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.storyArea}>{story.examAreas[0] || "General"}</span>
                    <span className={styles.storyTitle}>
                      <strong>{story.title}</strong>
                      {mode !== "daily" ? <small>{story.summary}</small> : null}
                    </span>
                    <span className={styles.storyMeta}>{story.date} · {story.lenses[lens]}</span>
                    <ChevronDown className={selected ? styles.openChevron : undefined} size={17} aria-hidden="true" />
                  </button>

                  {selected ? (
                    <ExpandedStory
                      canAdmin={canAdmin}
                      lens={lens}
                      nextStory={nextStory}
                      onClose={() => selectStory(story)}
                      onHidden={() => {
                        const next = visibleStories.find((candidate) => candidate.slug !== story.slug);
                        setSelectedSlug(next?.slug ?? null);
                        pushStorySelection(next ?? null);
                      }}
                      onNext={() => { if (nextStory) selectStory(nextStory); }}
                      story={story}
                      storyNumber={index + 1}
                      storyTotal={visibleStories.length}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function ExpandedStory({
  canAdmin,
  lens,
  nextStory,
  onClose,
  onHidden,
  onNext,
  story,
  storyNumber,
  storyTotal
}: {
  canAdmin: boolean;
  lens: "ssc" | "upsc";
  nextStory: CurrentAffairsStoryRecord | null;
  onClose: () => void;
  onHidden: () => void;
  onNext: () => void;
  story: CurrentAffairsStoryRecord;
  storyNumber: number;
  storyTotal: number;
}) {
  const item = story.item;
  const content = storyContent(item, story.title, lens);
  const proof = contentProof(item);
  const dates = keyDates(item);
  const hasDetail = content.facts.length > 0 || Boolean(content.context) || content.implications.length > 0 || content.retainedFacts.length > 0;

  return (
    <article className={styles.reader} id={`${story.selectionId}-reader`}>
      <header className={styles.readerHeader}>
        <div className={styles.readerTopline}>
          <div className={styles.readerEyebrow}>
            <span>Story {storyNumber} of {storyTotal}</span>
            <span>{story.examAreas.slice(0, 2).join(" · ") || "Current affairs"}</span>
            <span>{formatDate(story.publishedAt)}</span>
          </div>
          <button aria-label="Close story" className={styles.closeStory} onClick={onClose} type="button">
            <X size={16} aria-hidden="true" /> Close
          </button>
        </div>
        <h2>{story.title}</h2>
        {content.facts[0] ? <p className={styles.standfirst}>{content.facts[0]}</p> : null}
        <CurrentAffairsStoryActions
          canAdmin={canAdmin}
          className={styles.storyActions}
          onHiddenChange={(hidden) => { if (hidden) onHidden(); }}
          story={storyIdentity(story)}
        />
      </header>

      <div className={styles.readerGrid}>
        <div className={styles.readerBody}>
          {content.facts.length > 1 ? (
            <section>
              <span className={styles.sectionKicker}>What happened</span>
              <ul>{content.facts.slice(1).map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
          ) : null}

          {content.context ? (
            <section>
              <span className={styles.sectionKicker}>Background</span>
              <p>{content.context}</p>
            </section>
          ) : null}

          {content.implications.length ? (
            <section>
              <span className={styles.sectionKicker}>Why it matters</span>
              <ul>{content.implications.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
          ) : null}

          {!hasDetail ? (
            <section className={styles.detailPending}>
              <span className={styles.sectionKicker}>Source detail pending</span>
              <p>This item does not yet contain enough article-body evidence for a trustworthy explainer. No title-based summary has been shown.</p>
            </section>
          ) : null}

          <footer className={styles.sources}>
            <span>Source</span>
            <Link href={story.sourceUrl} rel="noreferrer" target="_blank">
              {story.source} <ExternalLink size={13} aria-hidden="true" />
            </Link>
            <small>Read the original reporting for the complete article.</small>
          </footer>
        </div>

        <aside className={styles.contextRail} aria-label="Story facts and source details">
          <section>
            <h3>At a glance</h3>
            <div className={proof.verified ? `${styles.contentProof} ${styles.verifiedProof}` : `${styles.contentProof} ${styles.unverifiedProof}`}>
              <strong>{proof.label}</strong>
              <span>{proof.detail}</span>
            </div>
            <ol>
              {dates.map((date) => (
                <li key={`${date.label}-${date.detail}`}><strong>{date.label}</strong><span>{date.detail}</span></li>
              ))}
            </ol>
            <small>{lens.toUpperCase()} relevance · {story.lenses[lens]}</small>
          </section>
          {content.retainedFacts.length ? (
            <section>
              <h3>Key facts</h3>
              <ul>{content.retainedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            </section>
          ) : null}
        </aside>
      </div>

      <footer className={styles.readerHandoff}>
        {nextStory ? (
          <button onClick={onNext} type="button">
            <span>Up next · Story {storyNumber + 1} of {storyTotal}</span>
            <strong>{nextStory.title}</strong>
            <small>Continue to the next explainer <ArrowDown size={14} aria-hidden="true" /></small>
          </button>
        ) : (
          <div>
            <span>Edition complete</span>
            <strong>You’ve reached the end of this issue.</strong>
          </div>
        )}
      </footer>
    </article>
  );
}
