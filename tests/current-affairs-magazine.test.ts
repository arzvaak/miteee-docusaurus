import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildCurrentAffairsStoryRecords,
  getCurrentAffairsMonthKey,
  getCurrentAffairsMonthlyIssue,
  getCurrentAffairsStoryBySlug,
  getCurrentAffairsWeekKey,
  getCurrentAffairsWeeklyIssue
} from "@/lib/current-affairs";
import type { CurrentAffairsBrief, CurrentAffairsSummaryItem } from "@/lib/exam-types";

function story(overrides: Partial<CurrentAffairsSummaryItem> = {}): CurrentAffairsSummaryItem {
  return {
    title: "RBI publishes a monetary policy update",
    source: "RBI",
    url: "https://example.com/rbi-policy",
    published_at: "2026-06-29T07:00:00.000Z",
    source_excerpt: "The RBI published an update concerning monetary policy and banking liquidity.",
    ssc_relevance: "high",
    upsc_cse_relevance: "medium",
    exam_areas: ["Economy", "Banking"],
    key_points: ["The update concerns monetary policy and banking liquidity."],
    why_it_matters_for_ssc_cgl: "Revise the institution and monetary-policy term.",
    why_it_matters_for_upsc_cse: "Connect the update to monetary-policy transmission.",
    static_context: "The RBI is India's central bank.",
    prelims_facts: ["The RBI conducts monetary policy."],
    mains_angles: ["Monetary-policy transmission affects credit conditions."],
    memory_hook: "RBI policy and liquidity",
    mcq_seed: {
      question: "Which institution issued this monetary-policy update?",
      answer: "RBI",
      trap: "Confusing the RBI with SEBI."
    },
    ...overrides
  };
}

function brief(date: string, items: CurrentAffairsSummaryItem[]): CurrentAffairsBrief {
  return {
    date,
    status: "ready",
    generatedAt: `${date}T08:00:00.000Z`,
    items
  };
}

function withDailyArtifacts<T>(dailyBriefs: CurrentAffairsBrief[], run: (dailyRoot: string) => T) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-current-affairs-magazine-"));
  const dailyRoot = path.join(root, "daily");
  fs.mkdirSync(dailyRoot, { recursive: true });
  for (const payload of dailyBriefs) {
    fs.writeFileSync(path.join(dailyRoot, `${payload.date}.json`), JSON.stringify(payload), "utf8");
  }
  try {
    return run(dailyRoot);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("daily magazine stories get unique deterministic same-screen selection links", () => {
  const daily = brief("2026-06-29", [
    story(),
    story({ url: "https://example.com/rbi-policy-analysis" }),
    story({
      title: "Low-priority context still belongs to the published edition",
      url: "https://example.com/low-priority-context",
      ssc_relevance: "low",
      upsc_cse_relevance: "low"
    })
  ]);

  const first = buildCurrentAffairsStoryRecords(daily);
  const second = buildCurrentAffairsStoryRecords(daily);

  assert.equal(first.length, 3);
  assert.deepEqual(first.map((item) => item.slug), second.map((item) => item.slug));
  assert.equal(new Set(first.map((item) => item.href)).size, first.length);
  assert.ok(first.every((item) => item.href.startsWith("/exams/ssc-cgl/current-affairs?date=2026-06-29&story=")));
  assert.ok(first.every((item) => item.href.endsWith(`#${item.selectionId}`)));
  assert.equal(first.at(-1)?.lenses.ssc, "low");
  assert.equal(first.at(-1)?.lenses.upsc, "low");
});

test("story lookup resolves a stable selection from an existing daily artifact", () => {
  const daily = brief("2026-06-30", [
    story(),
    story({ title: "Second explainer", url: "https://example.com/second-explainer" })
  ]);

  withDailyArtifacts([daily], (dailyRoot) => {
    const records = buildCurrentAffairsStoryRecords(daily);
    const selected = getCurrentAffairsStoryBySlug(daily.date, records[1].slug, dailyRoot);

    assert.equal(selected?.title, "Second explainer");
    assert.equal(selected?.href, records[1].href);
    assert.equal(getCurrentAffairsStoryBySlug(daily.date, "../unsafe", dailyRoot), null);
    assert.equal(getCurrentAffairsStoryBySlug("2026-02-31", records[1].slug, dailyRoot), null);
  });
});

test("weekly and monthly issues group every valid story and link back to its daily edition", () => {
  const dailyBriefs = [
    brief("2026-06-29", [story()]),
    brief("2026-06-30", [story({
      title: "Culture context with low exam relevance",
      url: "https://example.com/culture-context",
      ssc_relevance: "low",
      upsc_cse_relevance: "low",
      exam_areas: ["Culture"]
    })]),
    brief("2026-07-01", [story({
      title: "Science and environment update",
      url: "https://example.com/science-update",
      exam_areas: ["Science"]
    })])
  ];

  withDailyArtifacts(dailyBriefs, (dailyRoot) => {
    const weekKey = getCurrentAffairsWeekKey("2026-06-29");
    assert.equal(weekKey, "2026-W27");
    assert.equal(getCurrentAffairsMonthKey("2026-06-29"), "2026-06");

    const weekly = getCurrentAffairsWeeklyIssue(weekKey!, dailyRoot);
    const monthly = getCurrentAffairsMonthlyIssue("2026-06", dailyRoot);

    assert.equal(weekly?.storyCount, 3);
    assert.deepEqual(weekly?.availableDates, ["2026-06-29", "2026-06-30", "2026-07-01"]);
    assert.deepEqual(weekly?.groups.map((group) => group.label), ["Culture", "Economy", "Science"]);
    assert.equal(new Set(weekly?.stories.map((item) => item.href)).size, 3);
    assert.ok(weekly?.stories.every((item) => item.href.includes(`date=${item.date}&story=`)));
    assert.equal(weekly?.stories.find((item) => item.title.startsWith("Culture"))?.lenses.ssc, "low");

    assert.equal(monthly?.storyCount, 2);
    assert.deepEqual(monthly?.availableDates, ["2026-06-29", "2026-06-30"]);
    assert.ok(monthly?.stories.every((item) => item.date.startsWith("2026-06")));
  });
});
