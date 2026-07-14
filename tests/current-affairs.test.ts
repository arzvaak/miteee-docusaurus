import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import {
  buildCurrentAffairsRecallCards,
  buildCurrentAffairsStudyBrief,
  getCurrentAffairsArchive,
  getCurrentAffairsStudyBrief,
  getCurrentAffairsBrief,
  getLatestCurrentAffairsDate,
  getCurrentAffairsIstDate,
  getCurrentAffairsRunState,
  isCurrentAffairsStudyPriority,
  normalizeCurrentAffairsItem,
  parseMistralCurrentAffairsSummary
} from "@/lib/current-affairs";

function runPipelineValidation(args: string[], dataRoot: string) {
  const scriptPath = path.join(process.cwd(), "scripts", "daily_news_pipeline.py");
  const pythonCandidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];
  const env = {
    ...process.env,
    CURRENT_AFFAIRS_DATA_ROOT: dataRoot,
  };

  for (const command of pythonCandidates) {
    const result = spawnSync(command, [scriptPath, ...args], {
      encoding: "utf8",
      env,
    });
    if (result.error) {
      const error = result.error as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        continue;
      }
      return result;
    }
    return result;
  }

  throw new Error("Python interpreter not found for daily_news_pipeline validation test.");
}

function runPipelineSnippet(script: string) {
  const pythonCandidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

  for (const command of pythonCandidates) {
    const result = spawnSync(command, ["-c", script], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    if (result.error) {
      const error = result.error as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        continue;
      }
      return result;
    }
    return result;
  }

  throw new Error("Python interpreter not found for daily_news_pipeline snippet test.");
}

function withTempCurrentAffairsRoot<T>(fn: (dataRoot: string) => T) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-current-affairs-"));
  const dataRoot = path.join(base, "data", "current-affairs");
  const rawRoot = path.join(dataRoot, "raw");
  const dailyRoot = path.join(dataRoot, "daily");
  fs.mkdirSync(rawRoot, { recursive: true });
  fs.mkdirSync(dailyRoot, { recursive: true });

  try {
    return fn(dataRoot);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
}

test("getCurrentAffairsBrief returns a safe empty brief when no date exists", () => {
  const brief = getCurrentAffairsBrief("2099-01-01");

  assert.equal(brief.date, "2099-01-01");
  assert.equal(brief.items.length, 0);
  assert.equal(brief.status, "missing");
});

test("current affairs date helper uses IST for the daily SSC brief boundary", () => {
  assert.equal(getCurrentAffairsIstDate(new Date("2026-06-28T18:29:00.000Z")), "2026-06-28");
  assert.equal(getCurrentAffairsIstDate(new Date("2026-06-28T18:30:00.000Z")), "2026-06-29");
});

test("normalizeCurrentAffairsItem strips raw article bodies from stored items", () => {
  const item = normalizeCurrentAffairsItem({
    title: "RBI keeps repo rate unchanged",
    source: "RBI",
    url: "https://example.com/rbi",
    published_at: "2026-06-25T07:00:00+05:30",
    raw_body: "This full article body must not be persisted.",
    raw_excerpt: "Repo rate remained unchanged.",
    tags: ["economy"]
  });

  assert.equal("raw_body" in item, false);
  assert.equal(item.rawExcerpt, "Repo rate remained unchanged.");
});

test("parseMistralCurrentAffairsSummary rejects ungrounded output", () => {
  const parsed = parseMistralCurrentAffairsSummary(
    JSON.stringify({
      date: "2026-06-25",
      items: [{
        title: "Invented award list",
        source: "PIB",
        url: "https://pib.gov.in/example",
        published_at: "2026-06-25T08:00:00+05:30",
        ssc_relevance: "high",
        exam_areas: ["awards"],
        key_points: ["An unsupplied country won an unsupplied prize."],
        why_it_matters_for_ssc_cgl: "This can be asked as a fact.",
        memory_hook: "Prize trap",
        mcq_seed: { question: "Who won it?", answer: "Unknown", trap: "Invented fact" }
      }]
    }),
    [{
      title: "Cabinet approves new scheme",
      source: "PIB",
      url: "https://pib.gov.in/example",
      publishedAt: "2026-06-25T08:00:00+05:30",
      rawExcerpt: "Cabinet approved a new scheme for public infrastructure.",
      tags: ["schemes"]
    }]
  );

  assert.equal(parsed.accepted, false);
});

test("current affairs loader picks the latest local brief for the SSC page", () => {
  const latest = getLatestCurrentAffairsDate();
  const brief = getCurrentAffairsStudyBrief();

  assert.equal(brief.date, latest ?? getCurrentAffairsIstDate());
  assert.ok(brief.sourceQuality.totalItems >= brief.items.length);
  assert.equal(
    brief.recallCards.length,
    brief.items.filter(isCurrentAffairsStudyPriority).length
  );
});

test("current affairs recall cards are deterministic MCQ repair cards", () => {
  const brief = buildCurrentAffairsStudyBrief({
    date: "2026-06-26",
    status: "ready",
    generatedAt: "2026-06-26T01:00:00.000Z",
    items: [{
      title: "RBI conducts VRR auction",
      source: "RBI",
      url: "https://rbi.example/vrr",
      published_at: "2026-06-26T00:00:00.000Z",
      ssc_relevance: "high",
      exam_areas: ["Economy", "Banking"],
      key_points: ["RBI conducts Variable Rate Repo auction."],
      why_it_matters_for_ssc_cgl: "Tests liquidity tools.",
      memory_hook: "VRR means RBI liquidity repo.",
      mcq_seed: {
        question: "Which institution conducts VRR auctions?",
        answer: "RBI",
        trap: "SEBI"
      }
    }]
  });
  const cards = buildCurrentAffairsRecallCards(brief);

  assert.equal(cards.length, 1);
  assert.equal(cards[0]?.id, brief.recallCards[0]?.id);
  assert.equal(cards[0]?.priority, "high");
  assert.equal(cards[0]?.prompt, "Which institution conducts VRR auctions?");
  assert.equal(brief.sourceQuality.officialSourceItems, 1);
  assert.deepEqual(brief.sourceQuality.examAreas, ["Banking", "Economy"]);
});

test("current affairs recall cards exclude low-relevance news trivia", () => {
  const brief = buildCurrentAffairsStudyBrief({
    date: "2026-07-02",
    status: "ready",
    generatedAt: "2026-07-02T01:00:00.000Z",
    items: [
      {
        title: "RBI releases liquidity framework update",
        source: "RBI",
        url: "https://rbi.example/liquidity",
        published_at: "2026-07-02T00:00:00.000Z",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Economy", "Banking"],
        key_points: ["RBI released a liquidity framework update."],
        why_it_matters_for_ssc_cgl: "RBI tools are high-yield for SSC banking and economy recall.",
        why_it_matters_for_upsc_cse: "Links to GS3 monetary policy and financial stability.",
        static_context: "Revise RBI, repo operations, liquidity, CRR, SLR, and monetary policy tools.",
        prelims_facts: ["RBI released the liquidity update."],
        mains_angles: ["Liquidity management affects inflation, credit, growth, and financial stability."],
        memory_hook: "RBI liquidity",
        mcq_seed: {
          question: "Which institution released the liquidity framework update?",
          answer: "RBI",
          trap: "SEBI"
        }
      },
      {
        title: "Routine cricket lineup speculation before a bilateral series",
        source: "Indian Express Sports",
        url: "https://sports.example/lineup",
        published_at: "2026-07-02T00:00:00.000Z",
        ssc_relevance: "low",
        upsc_cse_relevance: "low",
        exam_areas: ["Sports"],
        key_points: ["A player may or may not play in a bilateral series."],
        why_it_matters_for_ssc_cgl: "Not exam-priority.",
        why_it_matters_for_upsc_cse: "Not exam-priority.",
        static_context: "No durable static GK anchor.",
        prelims_facts: ["A player may or may not play."],
        mains_angles: ["No mains angle."],
        memory_hook: "lineup speculation",
        mcq_seed: {
          question: "Which player may return?",
          answer: "A player",
          trap: "Another player"
        }
      }
    ]
  });

  assert.deepEqual(brief.recallCards.map((card) => card.title), ["RBI releases liquidity framework update"]);
  assert.equal(brief.sourceQuality.totalItems, 2);
  assert.equal(brief.sourceQuality.highRelevanceItems, 1);
});

test("current affairs study brief hides stale source-name and low-value medium cards", () => {
  const brief = buildCurrentAffairsStudyBrief({
    date: "2026-06-30",
    status: "ready",
    generatedAt: "2026-06-30T01:00:00.000Z",
    items: [
      {
        title: "RBI issues directions for rural co-operative banks",
        source: "RBI",
        url: "https://rbi.example/directions",
        published_at: "2026-06-30T00:00:00.000Z",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Economy", "Banking"],
        key_points: ["RBI issued directions for rural co-operative banks."],
        why_it_matters_for_ssc_cgl: "RBI directions matter for banking and economy recall.",
        why_it_matters_for_upsc_cse: "Links to GS3 banking regulation.",
        static_context: "Revise RBI and co-operative bank regulation.",
        prelims_facts: ["RBI issued directions."],
        mains_angles: ["Banking regulation affects consumer protection."],
        memory_hook: "RBI co-operative banks",
        mcq_seed: {
          question: "Which institution issued the rural co-operative bank directions?",
          answer: "RBI",
          trap: "SEBI"
        }
      },
      {
        title: "A German school and the untold history of Berlin ties with Bombay",
        source: "Indian Express Research",
        url: "https://example.com/german-school",
        published_at: "2026-06-30T00:00:00.000Z",
        ssc_relevance: "medium",
        upsc_cse_relevance: "medium",
        exam_areas: ["Culture"],
        key_points: ["A historical feature described school links."],
        why_it_matters_for_ssc_cgl: "Thin trivia.",
        why_it_matters_for_upsc_cse: "Thin trivia.",
        static_context: "No durable exam anchor.",
        prelims_facts: ["A school existed."],
        mains_angles: ["No usable mains angle."],
        memory_hook: "school feature",
        mcq_seed: {
          question: "Which source reported: A German school and Berlin ties with Bombay?",
          answer: "Indian Express Research",
          trap: "PIB"
        }
      },
      {
        title: "France skydiving plane crash kills 11; investigation underway",
        source: "Indian Express World",
        url: "https://example.com/crash",
        published_at: "2026-06-30T00:00:00.000Z",
        ssc_relevance: "medium",
        upsc_cse_relevance: "medium",
        exam_areas: ["International"],
        key_points: ["A skydiving aircraft crashed in France."],
        why_it_matters_for_ssc_cgl: "Not exam-priority.",
        why_it_matters_for_upsc_cse: "Not exam-priority.",
        static_context: "No durable static GK anchor.",
        prelims_facts: ["A crash happened."],
        mains_angles: ["No mains angle."],
        memory_hook: "plane crash",
        mcq_seed: {
          question: "Which country recently experienced a skydiving aircraft crash killing 11 people?",
          answer: "France",
          trap: "Germany"
        }
      }
    ]
  });

  assert.deepEqual(brief.recallCards.map((card) => card.title), ["RBI issues directions for rural co-operative banks"]);
  assert.deepEqual(brief.revisionPackets.map((packet) => packet.title), ["RBI issues directions for rural co-operative banks"]);
});

test("current affairs study brief builds SSC static-GK revision packets", () => {
  const brief = buildCurrentAffairsStudyBrief({
    date: "2026-06-26",
    status: "ready",
    generatedAt: "2026-06-26T01:00:00.000Z",
    items: [{
      title: "RBI conducts VRR auction",
      source: "RBI",
      url: "https://rbi.example/vrr",
      published_at: "2026-06-26T00:00:00.000Z",
      ssc_relevance: "high",
      exam_areas: ["Economy", "Banking", "Liquidity Management"],
      key_points: ["RBI conducts Variable Rate Repo auction."],
      why_it_matters_for_ssc_cgl: "Tests liquidity tools.",
      memory_hook: "VRR means RBI liquidity repo.",
      mcq_seed: {
        question: "Which institution conducts VRR auctions?",
        answer: "RBI",
        trap: "SEBI"
      }
    }]
  });

  assert.equal(brief.revisionPackets.length, 1);
  assert.equal(brief.revisionPackets[0]?.recallCardId, brief.recallCards[0]?.id);
  assert.ok(brief.revisionPackets[0]?.staticAnchors.some((anchor) => anchor.topicSlug === "economics-budget-banking"));
  assert.ok(brief.revisionPackets[0]?.staticAnchors.some((anchor) => anchor.topicSlug === "current-affairs-static-gk"));
  assert.ok(brief.revisionPackets[0]?.staticAnchors.every((anchor) => anchor.href.startsWith("/exams/ssc-cgl/topics/")));
  assert.equal(brief.revisionPackets[0]?.mcqSeeds.length, 2);
  assert.match(brief.revisionPackets[0]?.mcqSeeds[1]?.question ?? "", /static/i);
  assert.equal(brief.sourceQuality.staticAnchorCount, 2);
});

test("current affairs study brief exposes daily run continuity from the state ledger", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const today = getCurrentAffairsIstDate();
    fs.writeFileSync(path.join(dataRoot, "state.json"), JSON.stringify({
      firstRunDate: "2026-06-28",
      lastRunDate: today,
      lastSuccessfulDate: today,
      lastRunAt: `${today}T01:35:00.000Z`,
      totalRuns: 3,
      successfulRuns: 2,
      sourceCounts: { PIB: 5, RBI: 3, SSC: 2 },
      recentRuns: [
        { date: "2026-06-28", status: "ready", rawItems: 7, summaryItems: 4, sources: ["PIB", "RBI"] },
        { date: "2026-06-29", status: "failed", rawItems: 2, summaryItems: 0, sources: ["PIB"] },
        { date: today, status: "ready", rawItems: 8, summaryItems: 5, sources: ["PIB", "RBI", "SSC"] }
      ]
    }, null, 2));

    const runState = getCurrentAffairsRunState(dataRoot);
    const brief = buildCurrentAffairsStudyBrief({
      date: today,
      status: "ready",
      generatedAt: `${today}T01:36:00.000Z`,
      items: []
    }, runState);

    assert.equal(runState.firstRunDate, "2026-06-28");
    assert.equal(runState.lastSuccessfulDate, today);
    assert.equal(runState.expectedDate, today);
    assert.equal(runState.daysSinceLastSuccess, 0);
    assert.equal(runState.freshnessStatus, "current");
    assert.equal(runState.freshnessLabel, "Fresh for today");
    assert.match(runState.repairAction, /recall cards/i);
    assert.equal(runState.totalRuns, 3);
    assert.equal(runState.successfulRuns, 2);
    assert.equal(runState.reliabilityPercent, 67);
    assert.equal(runState.latestStatus, "ready");
    assert.equal(runState.latestRawItems, 8);
    assert.equal(runState.latestSummaryItems, 5);
    assert.deepEqual(runState.latestSources, ["PIB", "RBI", "SSC"]);
    assert.deepEqual(runState.sourceCounts, { PIB: 5, RBI: 3, SSC: 2 });
    assert.equal(brief.runState?.continuityLabel, "2/3 successful runs");
  });
});

test("current affairs run state warns when the daily server brief is stale or missing", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    fs.writeFileSync(path.join(dataRoot, "state.json"), JSON.stringify({
      firstRunDate: "2026-06-25",
      lastRunDate: "2026-06-28",
      lastSuccessfulDate: "2026-06-28",
      lastRunAt: "2026-06-28T01:35:00.000Z",
      totalRuns: 4,
      successfulRuns: 3,
      recentRuns: [
        { date: "2026-06-28", status: "ready", rawItems: 6, summaryItems: 4, sources: ["PIB", "RBI"] }
      ]
    }, null, 2));

    const staleState = getCurrentAffairsRunState(dataRoot);

    assert.equal(staleState.expectedDate, getCurrentAffairsIstDate());
    assert.equal(staleState.freshnessStatus, "stale");
    assert.ok((staleState.daysSinceLastSuccess ?? 0) >= 1);
    assert.match(staleState.freshnessLabel, /behind/);
    assert.match(staleState.repairAction, /server news job/i);
  });

  withTempCurrentAffairsRoot((dataRoot) => {
    const missingState = getCurrentAffairsRunState(dataRoot);

    assert.equal(missingState.freshnessStatus, "missing");
    assert.equal(missingState.daysSinceLastSuccess, null);
    assert.equal(missingState.freshnessLabel, "No successful run yet");
    assert.match(missingState.repairAction, /Start the server news job/i);
  });
});

test("current affairs archive lists recent daily briefs newest first with SSC stats", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const dailyRoot = path.join(dataRoot, "daily");
    const writeBrief = (date: string, source: string, relevance: "high" | "medium" | "low") => {
      fs.writeFileSync(path.join(dailyRoot, `${date}.json`), JSON.stringify({
        date,
        status: "ready",
        generatedAt: `${date}T01:35:00.000Z`,
        items: [{
          title: `${source} update for ${date}`,
          source,
          url: `https://example.com/${source}/${date}`,
          published_at: `${date}T00:30:00.000Z`,
          ssc_relevance: relevance,
          exam_areas: ["Current Affairs", source],
          key_points: [`${source} released an official update.`],
          why_it_matters_for_ssc_cgl: "Can be converted into a static GK recall prompt.",
          memory_hook: `${source} ${date}`,
          mcq_seed: {
            question: `Which institution released the ${date} update?`,
            answer: source,
            trap: "A non-official source"
          }
        }]
      }, null, 2));
    };

    writeBrief("2026-06-28", "PIB", "high");
    writeBrief("2026-06-29", "RBI", "medium");
    writeBrief("2026-06-30", "SSC", "high");

    const archive = getCurrentAffairsArchive(2, "2026-06-29", dailyRoot);

    assert.deepEqual(archive.map((item) => item.date), ["2026-06-30", "2026-06-29"]);
    assert.equal(archive[0]?.totalItems, 1);
    assert.equal(archive[0]?.officialSourceItems, 1);
    assert.equal(archive[0]?.recallCards, 1);
    assert.equal(archive[0]?.href, "/exams/ssc-cgl/current-affairs?date=2026-06-30");
    assert.equal(archive[0]?.isSelected, false);
    assert.equal(archive[1]?.isSelected, true);
  });
});

test("current affairs study brief reads the run-state ledger beside a custom daily root", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const dailyRoot = path.join(dataRoot, "daily");
    fs.writeFileSync(path.join(dataRoot, "state.json"), JSON.stringify({
      firstRunDate: "2026-06-29",
      lastRunDate: "2026-06-29",
      lastSuccessfulDate: "2026-06-29",
      lastRunAt: "2026-06-29T01:35:00.000Z",
      totalRuns: 1,
      successfulRuns: 1,
      sourceCounts: { PIB: 1 },
      recentRuns: [
        { date: "2026-06-29", status: "ready", rawItems: 4, summaryItems: 1, sources: ["PIB"] }
      ]
    }, null, 2));
    fs.writeFileSync(path.join(dailyRoot, "2026-06-29.json"), JSON.stringify({
      date: "2026-06-29",
      status: "ready",
      generatedAt: "2026-06-29T01:36:00.000Z",
      items: [{
        title: "PIB scheme update",
        source: "PIB",
        url: "https://pib.example/scheme",
        published_at: "2026-06-29T01:00:00.000Z",
        ssc_relevance: "high",
        exam_areas: ["Schemes"],
        key_points: ["PIB published a scheme update."],
        why_it_matters_for_ssc_cgl: "Scheme facts are useful for GA recall.",
        memory_hook: "PIB scheme",
        mcq_seed: { question: "Which source published the scheme update?", answer: "PIB", trap: "RBI" }
      }]
    }, null, 2));

    const brief = getCurrentAffairsStudyBrief(undefined, dailyRoot);

    assert.equal(brief.date, "2026-06-29");
    assert.equal(brief.runState.lastSuccessfulDate, "2026-06-29");
    assert.equal(brief.runState.latestRawItems, 4);
    assert.deepEqual(brief.runState.latestSources, ["PIB"]);
  });
});

test("current affairs magazine keeps operational telemetry out of the learner reader", () => {
  const component = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsFeed.tsx"), "utf8");
  const types = fs.readFileSync(path.join(process.cwd(), "lib", "exam-types.ts"), "utf8");

  assert.match(component, /Daily depth, weekly clarity, monthly revision/);
  assert.match(component, /stories in today’s complete edition/);
  assert.match(component, /return rankStories\(dailyStories\)/);
  assert.doesNotMatch(component, /Daily reliability|brief\.runState|repairAction|latestRawItems/);
  assert.match(types, /freshnessStatus: "current" \| "stale" \| "missing"/);
});

test("current affairs page expands a detailed story reader without navigation", () => {
  const component = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsFeed.tsx"), "utf8");
  const actions = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsActions.tsx"), "utf8");
  const css = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsFeed.module.css"), "utf8");

  assert.match(component, /function selectStory/);
  assert.match(component, /useState<string \| null>/);
  assert.match(component, /selectedSlug === null/);
  assert.match(component, /selectedStory\?\.slug === story\.slug/);
  assert.match(component, /function pushStorySelection/);
  assert.match(component, /url\.searchParams\.set\("date", story\.date\)/);
  assert.match(component, /url\.searchParams\.set\("story", story\.slug\)/);
  assert.match(component, /url\.searchParams\.delete\("story"\)/);
  assert.match(component, /currentAffairsStory: story\?\.slug \?\? null/);
  assert.match(component, /window\.history\.pushState/);
  assert.doesNotMatch(component, /pushState\([\s\S]{0,180}story\.href/);
  assert.match(component, /aria-expanded=\{selected\}/);
  assert.match(component, /ExpandedStory/);
  assert.match(component, /What happened/);
  assert.match(component, /Background/);
  assert.match(component, /Why it matters/);
  assert.match(component, /At a glance/);
  assert.match(component, /Key facts/);
  assert.match(component, /Source detail pending/);
  assert.match(component, /No title-based summary has been shown/);
  assert.match(component, /Article body parsed/);
  assert.match(component, /body characters captured via/);
  assert.match(component, /Article body not verified/);
  assert.match(component, /CurrentAffairsStoryActions/);
  assert.match(actions, /Save for revision/);
  assert.match(actions, /Hide/);
  assert.match(css, /\.reader/);
  assert.match(css, /\.storyRow/);
  assert.match(css, /\.contextRail/);
  assert.match(css, /max-height: min\(680px, calc\(100vh - 150px\)\)/);
  assert.doesNotMatch(component, /Memory hook|Check your recall|Reveal answer/);
  assert.doesNotMatch(component, /pipeline|Netcup|Mistral|OCR|raw items/i);
});

test("current affairs page exposes daily, weekly, and monthly editions on one screen", () => {
  const page = fs.readFileSync(path.join(process.cwd(), "app", "exams", "ssc-cgl", "current-affairs", "page.tsx"), "utf8");
  const component = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsFeed.tsx"), "utf8");
  const css = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsFeed.module.css"), "utf8");

  assert.match(page, /searchParams/);
  assert.match(page, /getCurrentAffairsArchive/);
  assert.match(page, /getCurrentAffairsWeeklyIssue/);
  assert.match(page, /getCurrentAffairsMonthlyIssue/);
  assert.match(page, /buildCurrentAffairsStoryRecords/);
  assert.match(component, /archiveDays/);
  assert.match(component, /day\.isSelected/);
  assert.match(component, /day\.href/);
  assert.match(component, /Weekly digests/);
  assert.match(component, /Monthly magazine/);
  assert.match(component, /condensed for revision/);
  assert.match(component, /repetition removed/);
  assert.match(component, /CurrentAffairsLensSelector/);
  assert.match(css, /\.issueRail/);
  assert.match(css, /\.modeSwitch/);
  assert.match(css, /\.storyStream/);
});

test("daily news pipeline uses Scrapling selector API compatible with installed runtime", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "daily_news_pipeline.py"), "utf8");

  assert.match(script, /def selector_texts/);
  assert.doesNotMatch(script, /page\.css\([^)]+\)\.get_all\(/);
});

test("daily news pipeline keeps PIB on the English RSS source", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "daily_news_pipeline.py"), "utf8");

  assert.match(script, /archive\.pib\.gov\.in\/newsite\/rssenglish\.aspx/);
  assert.match(script, /rssenglish_fea\.aspx/);
  assert.doesNotMatch(script, /ViewRss\.aspx\?lang=1&reg=1/);
});

test("daily news pipeline includes broad SSC and UPSC source lanes", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "daily_news_pipeline.py"), "utf8");

  assert.match(script, /indianexpress\.com\/section\/upsc-current-affairs\/feed/);
  assert.match(script, /indianexpress\.com\/section\/explained\/feed/);
  assert.match(script, /indianexpress\.com\/section\/world\/feed/);
  assert.match(script, /thehindu\.com\/news\/national\/feeder\/default\.rss/);
  assert.match(script, /thehindu\.com\/sci-tech\/feeder\/default\.rss/);
  assert.match(script, /thehindu\.com\/sci-tech\/energy-and-environment\/feeder\/default\.rss/);
  assert.match(script, /thehindu\.com\/education\/feeder\/default\.rss/);
  assert.match(script, /indianexpress\.com\/section\/education\/feed/);
  assert.match(script, /upsc-gs2/);
  assert.match(script, /upsc-gs3/);
});

test("daily news pipeline reads SSC notice rows from the public English API", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

payload = {
    "statusCode": "200",
    "data": [{
        "id": "notice123",
        "headline": "Combined Graduate Level Examination, 2026 notice",
        "examYear": "2026",
        "contentType": "notice-boards",
        "language": "english",
        "createdAt": "2026-06-27T07:00:00.000Z",
        "attachments": [{
            "path": "uploads\\masterData\\NoticeBoards\\Notice_of_adv_cgl_2026.pdf"
        }]
    }]
}

def fake_fetch_url(url):
    assert "language=english" in url
    return json.dumps(payload).encode("utf-8")

module.fetch_url = fake_fetch_url
items = module.parse_ssc_api(module.Source("ssc", "SSC", "Staff Selection Commission", module.SSC_NOTICE_BOARDS_API, ("ssc", "exam-notice"), 1.0, "ssc_api"))
print(json.dumps({
    "count": len(items),
    "title": items[0].title,
    "url": items[0].url,
    "excerpt": items[0].raw_excerpt,
    "tags": items[0].tags
}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    count: 1,
    title: "Combined Graduate Level Examination, 2026 notice",
    url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
    excerpt: "Combined Graduate Level Examination, 2026 notice Exam year: 2026. Content type: notice-boards.",
    tags: ["ssc", "exam-notice"]
  });
});

test("daily news pipeline batches compact model calls without capping the published edition", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "daily_news_pipeline.py"), "utf8");

  assert.match(script, /MISTRAL_SUMMARY_ITEM_LIMIT\s*=\s*18/);
  assert.match(script, /LLM_BATCH_ITEM_LIMIT\s*=\s*MISTRAL_SUMMARY_ITEM_LIMIT/);
  assert.match(script, /MISTRAL_CONTEXT_EXCERPT_CHARS\s*=\s*3200/);
  assert.match(script, /MISTRAL_MAX_TOKENS\s*=\s*12000/);
  assert.match(script, /range\(0, len\(ordered_items\), LLM_BATCH_ITEM_LIMIT\)/);
  assert.match(script, /combined_items\.extend\(candidate\["items"\]\)/);
  assert.match(script, /isolate_untrusted_text\(item\.raw_excerpt\)\[:MISTRAL_CONTEXT_EXCERPT_CHARS\]/);
  assert.doesNotMatch(script, /parsed\["items"\]\[:MISTRAL_SUMMARY_ITEM_LIMIT\]/);
});

test("daily news pipeline calls DeepSeek first with JSON chat completions", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import os
import sys
import urllib.request
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

item = module.RawItem(
    title="RBI releases liquidity framework update",
    source="RBI",
    url="https://rbi.example/liquidity",
    published_at="2026-07-02T07:00:00+05:30",
    fetched_at="2026-07-02T07:00:01+05:30",
    raw_excerpt="RBI releases liquidity framework update for bank liquidity, repo operations, and monetary policy revision.",
    tags=["economy", "banking", "rbi"],
)

summary = {
    "date": "2026-07-02",
    "items": [{
        "title": item.title,
        "source": item.source,
        "url": item.url,
        "published_at": item.published_at,
        "source_excerpt": item.raw_excerpt,
        "ssc_relevance": "high",
        "upsc_cse_relevance": "high",
        "exam_areas": ["economy", "banking", "rbi"],
        "key_points": ["RBI releases liquidity framework update for bank liquidity and repo operations."],
        "why_it_matters_for_ssc_cgl": "RBI liquidity framework is useful for SSC banking and economy terms.",
        "why_it_matters_for_upsc_cse": "RBI liquidity framework links to GS3 monetary policy and financial stability.",
        "static_context": "Revise RBI, repo operations, bank liquidity, monetary policy, CRR, and SLR.",
        "prelims_facts": ["RBI released the liquidity framework update."],
        "mains_angles": ["Liquidity policy affects credit growth, inflation control, and financial stability."],
        "memory_hook": "RBI liquidity framework",
        "mcq_seed": {
            "question": "Which institution released the liquidity framework update?",
            "answer": "RBI",
            "trap": "SEBI"
        }
    }]
}

captured = {}
class FakeResponse:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        return False
    def read(self):
        return json.dumps({"choices": [{"message": {"content": json.dumps(summary)}}]}).encode("utf-8")

def fake_urlopen(request, timeout=45):
    captured["url"] = request.full_url
    captured["headers"] = dict(request.header_items())
    captured["body"] = json.loads(request.data.decode("utf-8"))
    return FakeResponse()

urllib.request.urlopen = fake_urlopen
os.environ["DEEPSEEK_API_KEY"] = "fake-deepseek-key"
os.environ["DEEPSEEK_MODEL"] = "deepseek-v4-pro"
brief = module.call_deepseek_current_affairs("2026-07-02", [item])
print(json.dumps({
    "url": captured.get("url"),
    "authorization": captured.get("headers", {}).get("Authorization"),
    "model": captured.get("body", {}).get("model"),
    "responseFormat": captured.get("body", {}).get("response_format"),
    "question": brief["items"][0]["mcq_seed"]["question"] if brief else None,
}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    url: "https://api.deepseek.com/chat/completions",
    authorization: "Bearer fake-deepseek-key",
    model: "deepseek-v4-pro",
    responseFormat: { type: "json_object" },
    question: "Which institution released the liquidity framework update?"
  });
});

test("daily news pipeline keeps exam-relevant stories and rejects low-value noise", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

def raw(title, source, url, excerpt, tags):
    return module.RawItem(
        title=title,
        source=source,
        url=url,
        published_at="2026-07-02T07:00:00+05:30",
        fetched_at="2026-07-02T07:00:01+05:30",
        raw_excerpt=excerpt,
        tags=tags,
    )

items = [
    raw(
        "Austria urges Europe to host Anthropic following U.S. curbs on AI access",
        "Indian Express World",
        "https://example.com/anthropic",
        "Austria urged Europe to host Anthropic after U.S. curbs on AI access.",
        ["international", "technology"],
    ),
    raw(
        "France skydiving plane crash kills 11; investigation underway",
        "Indian Express World",
        "https://example.com/crash",
        "A skydiving aircraft crash in France killed 11 people.",
        ["international"],
    ),
    raw(
        "Harry Brook says leading England in tests would be a privilege",
        "Indian Express Sports",
        "https://example.com/cricket",
        "Harry Brook discussed captaincy before a bilateral cricket series.",
        ["sports"],
    ),
    raw(
        "Centre plans new levies on tobacco, pan masala as GST compensation cess lapses",
        "Indian Express Economy",
        "https://example.com/gst-cess",
        "Centre plans new levies on tobacco and pan masala as GST compensation cess lapses, raising fiscal and GST Council questions.",
        ["economy", "polity", "upsc-gs3"],
    ),
    raw(
        "RBI issues Responsible Business Conduct directions for rural co-operative banks",
        "RBI",
        "https://example.com/rbi",
        "RBI issued Responsible Business Conduct directions for rural co-operative banks, useful for banking regulation revision.",
        ["economy", "banking", "rbi", "notifications"],
    ),
    raw(
        "UN ocean floor body prepares election amid deep-sea mining debate",
        "The Hindu Environment",
        "https://example.com/un-seabed",
        "The UN-linked ocean floor regulator prepared an election amid debate over deep-sea mining and marine environment governance.",
        ["environment", "international", "upsc-gs3"],
    ),
    raw(
        "World Cup betting market predicts the semifinal winner",
        "Times of India Sports",
        "https://example.com/betting",
        "Bookmakers and betting odds favour one team before the semifinal.",
        ["sports", "awards", "ssc"],
    ),
    raw(
        "Supplementary result released: direct link to download scorecards",
        "Times of India Education",
        "https://example.com/scorecard",
        "Students can use a direct link to download their supplementary result scorecards.",
        ["education", "exam-notice", "governance"],
    ),
    raw(
        "Temple treasurer speaks amid donation theft row",
        "Times of India India",
        "https://example.com/theft-row",
        "A donation theft row prompted personal claims by the temple treasurer.",
        ["national", "polity", "governance"],
    ),
    raw(
        "Scientists explain why dogs are friendly companions",
        "Times of India Science",
        "https://example.com/dogs",
        "Researchers said early ancestors fed salmon to canines 12,000 years ago.",
        ["science", "technology", "upsc-gs3"],
    ),
]

selected = module.filter_study_relevant_items(items)
brief = module.fallback_brief("2026-07-02", selected)
print(json.dumps({
    "selected": [item.title for item in selected],
    "published": [item["title"] for item in brief["items"]],
    "labels": [item["ssc_relevance"] for item in brief["items"]],
}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.selected.length, 3);
  assert.equal(parsed.published.length, 3);
  assert.deepEqual(new Set(parsed.published), new Set(parsed.selected));
  assert.deepEqual(parsed.labels, ["high", "high", "low"]);
});

test("daily news editorial gate rejects promotional and evergreen filler without losing real exam developments", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

def raw(title, source, excerpt, tags):
    return module.RawItem(
        title=title,
        source=source,
        url="https://example.com/" + str(abs(hash(title))),
        published_at="2026-07-14T07:00:00+05:30",
        fetched_at="2026-07-14T08:00:00+05:30",
        raw_excerpt=excerpt,
        tags=tags + ["article-excerpt"],
        content_origin="article-page",
        extraction_method="html-paragraphs",
        captured_characters=len(excerpt),
    )

items = [
    raw("BITS Pilani tops Hurun India U30 list with entrepreneur alumni", "Times of India Education", "The private Hurun U30 list profiles young entrepreneur alumni and college prestige.", ["education", "exam-notice", "governance"]),
    raw("India tour of Bangladesh gets closer; Afghanistan T20Is could be pushed back", "Times of India Sports", "Officials discussed a bilateral series fixture and proposed schedule that could be pushed back.", ["sports", "awards", "ssc"]),
    raw("OBC status of 77 castes: government withdraws SC challenge to HC verdict", "Times of India India", "The state government withdrew its Supreme Court challenge to a High Court ruling on OBC reservation for 77 castes.", ["national", "polity", "governance"]),
    raw("Britain bought farmland; four years later beavers are helping it make money", "Times of India World", "A private farmland project used beavers and four years later began making money from visitors.", ["international", "upsc-gs2"]),
    raw("India and China stack gold while trimming US Treasuries", "Times of India Business", "Central bank data show India and China expanded gold reserves while reducing US Treasuries exposure and diversifying foreign exchange reserves.", ["economy", "upsc-gs3"]),
    raw("Europe heatwave death toll tops 10,000", "Times of India Environment", "Scientists attributed the heatwave death toll to human-caused climate change and described the public-health impact.", ["environment", "science", "upsc-gs3"]),
    raw("Rare deep-sea life discovered on Arctic seabed opened for mining", "Times of India Science", "Scientists discovered rare deep-sea life in an Arctic seabed mining zone, raising environmental-impact questions.", ["science", "technology", "upsc-gs3"]),
    raw("Why do antibiotics not work against viruses?", "Times of India Education", "An evergreen classroom explainer describes bacteria, viruses, and antimicrobial resistance without a new report or policy event.", ["education", "exam-notice", "governance"]),
    raw("Can your city make you feel like a failure? IIT graduate's viral take", "Times of India Education", "A viral take starts a conversation about lifestyle and personal feelings in large cities.", ["education", "exam-notice", "governance"]),
    raw("Programming will never go out of scope, industry leaders urge students", "Times of India Education", "Industry leaders urge engineering students to learn programming fundamentals as career advice.", ["education", "exam-notice", "governance"]),
    raw("E Jean Carroll receives $5.6 million after years-long legal battle with Trump", "Times of India World", "A private civil case ended with damages and a payment from escrow after a sexual abuse case and years-long legal battle.", ["international", "upsc-gs2"]),
    raw("NCP rejects leadership challenge to Sunetra Pawar as party chief", "Times of India India", "An internal party leadership challenge concerned who would remain party chief under the party constitution, according to a Supreme Court advocate.", ["national", "polity", "governance"]),
    raw("US stocks today: Wall Street trades in green; stocks steady as inflation data arrives", "Times of India Business", "US stocks traded higher during routine intraday trade as Wall Street weighed inflation and possible central bank rate cuts.", ["economy", "upsc-gs3"]),
    raw("Wildfire southwest of Denver forces thousands to evacuate", "Times of India Environment", "A local wildfire southwest of Denver destroyed structures after dry weather and erratic winds.", ["environment", "science", "upsc-gs3"]),
    raw("Labrador collapses after eating discarded cannabis on Ben Nevis", "Times of India World", "A pet Labrador collapsed on a walk after eating discarded cannabis and later recovered.", ["international", "upsc-gs2"]),
    raw("Scientists race to solve mystery of Poland's Crooked Forest", "Times of India Science", "Scientists examined the mystery of oddly shaped trees in the Crooked Forest before the trees die out.", ["science", "environment", "upsc-gs3"]),
    raw("Florida man files lawsuit over fake 'Muslim city' conspiracy", "Times of India World", "An individual filed a lawsuit over a false online conspiracy about a private development.", ["international", "upsc-gs2"]),
    raw("Several dead in Brussels construction site fire", "Times of India World", "A construction site fire in Brussels caused local casualties while rescue teams searched the site.", ["international", "upsc-gs2"]),
    raw("EC extends deadline for voter verification exercise", "Times of India India", "The Election Commission extends the deadline for a routine SIR exercise and enumeration forms.", ["national", "polity", "governance"]),
    raw("UK inquiry finds billions wasted on Covid PPE", "Times of India World", "A British inquiry found domestic Covid PPE spending was wasted because of procurement flaws.", ["international", "upsc-gs2"]),
    raw("AI economy must protect workers; BMS seeks fairer growth model", "Times of India India", "The trade union BMS sought social security and worker protection as artificial intelligence changes labour markets.", ["national", "polity", "governance"]),
    raw("13 Indians killed, 3 missing in Gulf amid war", "Times of India India", "The government reported Indians killed and missing during the Gulf war and described consular support and evacuation planning.", ["national", "polity", "governance"]),
    raw("Ministry of Education publishes official NIRF methodology", "Indian Express Education", "The Ministry of Education published the National Institutional Ranking Framework methodology as an official report.", ["education"]),
    raw("WHO releases antimicrobial resistance report", "Times of India Science", "A new WHO antimicrobial resistance report records surveillance findings, health risks, and a public-health response.", ["science", "international"]),
    raw("ISRO launches earth observation satellite", "The Hindu Sci-Tech", "ISRO completed a satellite launch for an Indian earth observation space mission.", ["environment", "science", "technology"]),
    raw("Country elects new president in national vote", "Times of India World", "Voters completed a presidential election and the elected head of state will take office next month.", ["international"]),
    raw("DRDO completes missile test", "Times of India India", "DRDO completed an Indian missile test for a new defence system after a technical trial.", ["national", "technology"]),
    raw("New governor appointed", "Times of India India", "The government announced the appointment of a new governor to the constitutional office.", ["national", "polity"]),
    raw("Public scheme helps farmers earn more five years later", "Times of India India", "A government scheme reported that beneficiaries and farmers make money from higher crop yields five years later.", ["national", "government"]),
]

selected = module.filter_study_relevant_items(items)
brief = module.fallback_brief("2026-07-14", selected)
print(json.dumps({
    "selected": [item.title for item in selected],
    "maxDaily": module.MAX_DAILY_SUMMARY_ITEMS,
    "labels": {
        item["title"]: [item["ssc_relevance"], item["upsc_cse_relevance"]]
        for item in brief["items"]
    },
}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout) as { selected: string[]; maxDaily: number; labels: Record<string, [string, string]> };
  assert.equal(parsed.maxDaily, 8);
  assert.deepEqual(new Set(parsed.selected), new Set([
    "OBC status of 77 castes: government withdraws SC challenge to HC verdict",
    "India and China stack gold while trimming US Treasuries",
    "Europe heatwave death toll tops 10,000",
    "Rare deep-sea life discovered on Arctic seabed opened for mining",
    "AI economy must protect workers; BMS seeks fairer growth model",
    "13 Indians killed, 3 missing in Gulf amid war",
    "Ministry of Education publishes official NIRF methodology",
    "WHO releases antimicrobial resistance report",
    "ISRO launches earth observation satellite",
    "Country elects new president in national vote",
    "DRDO completes missile test",
    "New governor appointed",
    "Public scheme helps farmers earn more five years later"
  ]));
  assert.deepEqual(parsed.labels["Europe heatwave death toll tops 10,000"], ["low", "medium"]);
  assert.deepEqual(parsed.labels["Rare deep-sea life discovered on Arctic seabed opened for mining"], ["low", "medium"]);
  assert.deepEqual(parsed.labels["AI economy must protect workers; BMS seeks fairer growth model"], ["low", "medium"]);
  assert.deepEqual(parsed.labels["OBC status of 77 castes: government withdraws SC challenge to HC verdict"], ["high", "high"]);
  assert.deepEqual(parsed.labels["ISRO launches earth observation satellite"], ["high", "medium"]);
  assert.deepEqual(parsed.labels["Country elects new president in national vote"], ["high", "medium"]);
  assert.deepEqual(parsed.labels["DRDO completes missile test"], ["high", "medium"]);
  assert.deepEqual(parsed.labels["New governor appointed"], ["high", "medium"]);
});

test("daily news pipeline rejects source-name recall cards", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

raw_items = [module.RawItem(
    title="RBI releases repo policy update",
    source="RBI",
    url="https://rbi.example/repo",
    published_at="2026-07-02T07:00:00+05:30",
    fetched_at="2026-07-02T07:00:01+05:30",
    raw_excerpt="RBI released a repo policy update for banking revision.",
    tags=["economy", "banking", "rbi"],
)]

payload = {
    "date": "2026-07-02",
    "status": "ready",
    "generatedAt": "2026-07-02T07:05:00+05:30",
    "items": [{
        "title": "RBI releases repo policy update",
        "source": "RBI",
        "url": "https://rbi.example/repo",
        "published_at": "2026-07-02T07:00:00+05:30",
        "source_excerpt": "RBI released a repo policy update for banking revision.",
        "ssc_relevance": "high",
        "upsc_cse_relevance": "high",
        "exam_areas": ["economy", "banking"],
        "key_points": ["RBI released a repo policy update."],
        "why_it_matters_for_ssc_cgl": "RBI repo policy update matters for banking revision.",
        "why_it_matters_for_upsc_cse": "RBI repo policy update links to monetary policy and GS3 economy revision.",
        "static_context": "Revise RBI monetary policy tools, repo rate, liquidity operations, and banking regulation.",
        "prelims_facts": ["RBI released the repo policy update."],
        "mains_angles": ["Monetary policy affects liquidity, credit growth, inflation management, and financial stability."],
        "memory_hook": "RBI repo policy update",
        "mcq_seed": {
            "question": "Which source reported: RBI releases repo policy update?",
            "answer": "RBI",
            "trap": "Do not memorize unsourced summaries."
        }
    }]
}

accepted, reason = module.validate_generated_brief(payload, raw_items, allow_print=False)
print(json.dumps({"accepted": accepted, "reason": reason}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.accepted, false);
  assert.match(parsed.reason, /source-name recall/i);
});

test("daily news pipeline fallback creates content-based recall cards", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

items = [module.RawItem(
    title="Centre plans new levies on tobacco, pan masala as GST compensation cess lapses",
    source="Indian Express Economy",
    url="https://example.com/gst-cess",
    published_at="2026-07-02T07:00:00+05:30",
    fetched_at="2026-07-02T07:00:01+05:30",
    raw_excerpt="Centre plans new levies on tobacco and pan masala as GST compensation cess lapses, raising GST Council and fiscal federalism questions.",
    tags=["economy", "polity", "upsc-gs3"],
)]

brief = module.fallback_brief("2026-07-02", items)
seed = brief["items"][0]["mcq_seed"]
print(json.dumps(seed))
`);

  assert.equal(result.status, 0, result.stderr);
  const seed = JSON.parse(result.stdout);
  assert.doesNotMatch(seed.question, /which source|reported|published by/i);
  assert.notEqual(seed.answer, "Indian Express Economy");
  assert.match(`${seed.question} ${seed.answer}`, /GST|cess|levies|tobacco|pan masala/i);
});

test("daily news pipeline can enrich RSS entries with bounded article excerpts", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

source = module.Source("news", "News", "The Indian Express", "https://news.example/feed", ("upsc",), parser="rss")
item = module.RawItem(
    title="Short headline",
    source="News",
    url="https://news.example/story",
    published_at="2026-06-30T07:00:00+05:30",
    fetched_at="2026-06-30T07:00:01+05:30",
    raw_excerpt="Short headline",
    tags=["upsc"],
)

module.robots_allows_url = lambda url: True
module.fetch_url = lambda url: b'''<html><head><meta name='description' content='The government released a detailed policy update with fiscal and governance implications.'><script type='application/ld+json'>{"headline":"Government publishes the complete policy implementation framework"}</script></head><body><p>The update explains institutional background, beneficiaries, implementation timeline, and exam-relevant policy context for learners.</p><p>Advertisement</p></body></html>'''
module.time.sleep = lambda seconds: None
items = module.enrich_raw_items_with_article_excerpts(source, [item])
print(json.dumps({"title": items[0].title, "excerpt": items[0].raw_excerpt, "tags": items[0].tags, "origin": items[0].content_origin, "method": items[0].extraction_method, "characters": items[0].captured_characters}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.title, "Government publishes the complete policy implementation framework");
  assert.match(parsed.excerpt, /institutional background/);
  assert.ok(parsed.excerpt.length <= 1800);
  assert.ok(parsed.tags.includes("article-excerpt"));
  assert.equal(parsed.origin, "article-page");
  assert.equal(parsed.method, "html-paragraphs");
  assert.ok(parsed.characters >= 110);
});

test("daily news pipeline enforces the publisher and domain allowlist", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

publishers = sorted({source.publisher for source in module.SOURCES})
toi_sources = [source.id for source in module.SOURCES if source.publisher == "The Times of India"]
rejected = []
for candidate in [
    module.Source("unknown", "Unknown", "Random Blog", "https://example.com/feed", ("news",), parser="rss"),
    module.Source("spoofed", "Spoofed Hindu", "The Hindu", "https://example.com/feed", ("news",), parser="rss"),
]:
    try:
        module.validate_source_policy([candidate])
    except ValueError as error:
        rejected.append(str(error))

print(json.dumps({"publishers": publishers, "toi_sources": toi_sources, "rejected": rejected}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.deepEqual(parsed.publishers, [
    "PRS Legislative Research",
    "Press Information Bureau",
    "Reserve Bank of India",
    "Staff Selection Commission",
    "The Hindu",
    "The Indian Express",
    "The Times of India"
  ]);
  assert.equal(parsed.toi_sources.length, 7);
  assert.equal(parsed.rejected.length, 2);
  assert.match(parsed.rejected[0], /Unapproved publisher/);
  assert.match(parsed.rejected[1], /domain is not approved/);
});

test("daily news pipeline selects source-diverse items before Mistral summarization", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

def raw(title, source, url, tags):
    return module.RawItem(
        title=title,
        source=source,
        url=url,
        published_at="2026-06-27T07:00:00+05:30",
        fetched_at="2026-06-27T07:00:01+05:30",
        raw_excerpt=title + " official excerpt",
        tags=tags,
    )

items = [
    raw("RBI liquidity item " + str(index), "RBI", "https://rbi.example/" + str(index), ["economy", "rbi"])
    for index in range(10)
]
items += [
    raw("SSC notice", "SSC", "https://ssc.example/notice", ["ssc", "exam-notice"]),
    raw("PIB scheme update", "PIB", "https://pib.example/scheme", ["government", "schemes"]),
    raw("PRS bill note", "PRS", "https://prs.example/bill", ["parliament", "bills"]),
]
selected = module.select_items_for_mistral(items)
print(json.dumps([item.source for item in selected]))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).slice(0, 4), ["SSC", "PIB", "PRS", "RBI"]);
});

test("daily news pipeline completes valid but too-thin Mistral summaries with grounded source-diverse items", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import os
import sys
import urllib.request
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

def raw(title, source, url, tags):
    return module.RawItem(
        title=title,
        source=source,
        url=url,
        published_at="2026-06-27T07:00:00+05:30",
        fetched_at="2026-06-27T07:00:01+05:30",
        raw_excerpt=title + " official source update for SSC revision.",
        tags=tags,
    )

items = [
    raw("SSC releases CGL correction window notice", "SSC", "https://ssc.example/cgl", ["ssc", "exam-notice"]),
    raw("PIB announces national scholarship scheme", "PIB", "https://pib.example/scheme", ["government", "schemes"]),
    raw("PRS publishes bill summary note", "PRS", "https://prs.example/bill", ["parliament", "bills"]),
    raw("RBI releases repo policy update", "RBI", "https://rbi.example/repo", ["economy", "banking", "rbi"]),
]

thin_summary = {
    "date": "2026-06-27",
    "items": [{
        "title": "RBI releases repo policy update",
        "source": "RBI",
        "url": "https://rbi.example/repo",
        "published_at": "2026-06-27T07:00:00+05:30",
        "source_excerpt": "A fictional athlete won an unsupplied award at an imaginary event.",
        "ssc_relevance": "high",
        "upsc_cse_relevance": "high",
        "exam_areas": ["economy", "banking"],
        "key_points": ["RBI releases repo policy update."],
        "why_it_matters_for_ssc_cgl": "RBI repo policy update matters for banking revision.",
        "why_it_matters_for_upsc_cse": "RBI repo policy update links to monetary policy and GS3 economy revision.",
        "static_context": "Revise RBI monetary policy tools, repo rate, liquidity operations, and banking regulation.",
        "prelims_facts": ["RBI released the repo policy update."],
        "mains_angles": ["Monetary policy affects liquidity, credit growth, inflation management, and financial stability."],
        "memory_hook": "RBI repo policy update",
        "mcq_seed": {"question": "Which institution released the repo policy update?", "answer": "RBI", "trap": "SSC"}
    }]
}

class FakeResponse:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        return False
    def read(self):
        return json.dumps({
            "choices": [{
                "message": {
                    "content": json.dumps(thin_summary)
                }
            }]
        }).encode("utf-8")

urllib.request.urlopen = lambda request, timeout=45: FakeResponse()
os.environ["MISTRAL_API_KEY"] = "fake-key"
brief = module.call_mistral("2026-06-27", items)
print(json.dumps({
    "isNone": brief is None,
    "count": 0 if brief is None else len(brief["items"]),
    "sources": [] if brief is None else [item["source"] for item in brief["items"]],
    "minimum": module.minimum_summary_items(items),
}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /Mistral summary too thin/);
  assert.deepEqual(JSON.parse(result.stdout), {
    isNone: false,
    count: 4,
    sources: ["SSC", "PIB", "PRS", "RBI"],
    minimum: 4
  });
});

test("daily news pipeline writes a durable run-state ledger for Netcup continuity", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import os
import sys
import tempfile
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

data_root = Path(tempfile.mkdtemp()) / "current-affairs"
os.environ["CURRENT_AFFAIRS_DATA_ROOT"] = str(data_root)

def fake_discover_items():
    return [
        module.RawItem(
            title="RBI publishes monetary policy update",
            source="RBI",
            url="https://rbi.example/policy",
            published_at="2026-06-28T07:00:00+05:30",
            fetched_at="2026-06-28T07:00:01+05:30",
            raw_excerpt="The Reserve Bank published a monetary policy update describing bank liquidity conditions, repo operations, the effective review period, and reporting responsibilities. The document also names the covered institutions and the schedule for the next policy assessment.",
            tags=["economy", "banking", "rbi"],
        )
    ]

module.discover_items = fake_discover_items
module.call_mistral = lambda date, items: None
sys.argv = ["daily_news_pipeline.py", "--date", "2026-06-28"]
exit_code = module.main()
state = json.loads((data_root / "state.json").read_text(encoding="utf-8"))
print(json.dumps({
    "exitCode": exit_code,
    "firstRunDate": state.get("firstRunDate"),
    "lastRunDate": state.get("lastRunDate"),
    "lastSuccessfulDate": state.get("lastSuccessfulDate"),
    "totalRuns": state.get("totalRuns"),
    "successfulRuns": state.get("successfulRuns"),
    "sourceCounts": state.get("sourceCounts"),
    "recentRun": state.get("recentRuns", [{}])[-1],
}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1) ?? "{}") as {
    exitCode: number;
    firstRunDate: string;
    lastRunDate: string;
    lastSuccessfulDate: string;
    totalRuns: number;
    successfulRuns: number;
    sourceCounts: Record<string, number>;
    recentRun: {
      date: string;
      status: string;
      rawItems: number;
      summaryItems: number;
      sources: string[];
    };
  };

  assert.equal(parsed.exitCode, 0);
  assert.equal(parsed.firstRunDate, "2026-06-28");
  assert.equal(parsed.lastRunDate, "2026-06-28");
  assert.equal(parsed.lastSuccessfulDate, "2026-06-28");
  assert.equal(parsed.totalRuns, 1);
  assert.equal(parsed.successfulRuns, 1);
  assert.equal(parsed.sourceCounts.RBI, 1);
  assert.equal(parsed.recentRun.date, "2026-06-28");
  assert.equal(parsed.recentRun.status, "ready");
  assert.equal(parsed.recentRun.rawItems, 1);
  assert.equal(parsed.recentRun.summaryItems, 1);
  assert.deepEqual(parsed.recentRun.sources, ["RBI"]);
});

test("daily news pipeline rejects generated summaries not grounded in raw excerpts", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

raw_items = [module.RawItem(
    title="RBI releases repo policy update",
    source="RBI",
    url="https://rbi.example/repo",
    published_at="2026-06-27T07:00:00+05:30",
    fetched_at="2026-06-27T07:00:01+05:30",
    raw_excerpt="RBI released a repo policy update for banking revision.",
    tags=["economy", "banking"],
)]

payload = {
    "date": "2026-06-27",
    "status": "ready",
    "generatedAt": "2026-06-27T07:05:00+05:30",
    "items": [{
        "title": "Invented sports award",
        "source": "RBI",
        "url": "https://rbi.example/repo",
        "published_at": "2026-06-27T07:00:00+05:30",
        "source_excerpt": "A fictional athlete won an unsupplied award at an imaginary event.",
        "ssc_relevance": "high",
        "upsc_cse_relevance": "low",
        "exam_areas": ["Sports"],
        "key_points": ["A fictional athlete won an unsupplied award."],
        "why_it_matters_for_ssc_cgl": "This fabricated fact could be asked.",
        "why_it_matters_for_upsc_cse": "This fabricated fact is not supported by the supplied source.",
        "static_context": "No supported static context is present in the supplied source.",
        "prelims_facts": ["A fictional athlete won an unsupplied award."],
        "mains_angles": ["Unsupported award claims must be rejected during current-affairs review."],
        "memory_hook": "Invented athlete award",
        "mcq_seed": {"question": "Who won the award?", "answer": "Invented athlete", "trap": "Another invented athlete"}
    }]
}

accepted, reason = module.validate_generated_brief(payload, raw_items, allow_print=False)
print(json.dumps({"accepted": accepted, "reason": reason}))
`);

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.accepted, false);
  assert.match(parsed.reason, /not grounded/);
});

test("daily news pipeline fallback brief preserves source diversity", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

def raw(title, source, url, tags):
    return module.RawItem(
        title=title,
        source=source,
        url=url,
        published_at="2026-06-27T07:00:00+05:30",
        fetched_at="2026-06-27T07:00:01+05:30",
        raw_excerpt=title + " official excerpt for SSC revision.",
        tags=tags,
    )

items = [
    raw("PIB scheme " + str(index), "PIB", "https://pib.example/" + str(index), ["government", "schemes"])
    for index in range(8)
]
items += [
    raw("SSC notice", "SSC", "https://ssc.example/notice", ["ssc", "exam-notice"]),
    raw("PRS bill note", "PRS", "https://prs.example/bill", ["parliament", "bills"]),
    raw("RBI banking update", "RBI", "https://rbi.example/update", ["economy", "banking", "rbi"]),
]

brief = module.fallback_brief("2026-06-27", items)
print(json.dumps({
    "count": len(brief["items"]),
    "firstSources": [item["source"] for item in brief["items"][:4]]
}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    count: 11,
    firstSources: ["SSC", "PIB", "PRS", "RBI"]
  });
});

test("daily news pipeline calendar memory stores today, yesterday, week, month totals, and source spread", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
import tempfile
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

root = Path(tempfile.mkdtemp()) / "current-affairs"
(root / "daily").mkdir(parents=True)

def payload(date, title, source, high=True):
    return {
        "date": date,
        "status": "ready",
        "generatedAt": date + "T07:00:00+05:30",
        "items": [{
            "title": title,
            "source": source,
            "url": "https://example.com/" + date,
            "published_at": date + "T06:00:00+05:30",
            "ssc_relevance": "high" if high else "medium",
            "upsc_cse_relevance": "high" if high else "medium",
            "exam_areas": ["economy", "polity"],
            "key_points": [title],
            "why_it_matters_for_ssc_cgl": title,
            "why_it_matters_for_upsc_cse": title,
            "static_context": title,
            "prelims_facts": [title],
            "mains_angles": [title],
            "memory_hook": title,
            "mcq_seed": {"question": title, "answer": source, "trap": "unsourced"}
        }]
    }

(root / "daily" / "2026-06-29.json").write_text(json.dumps(payload("2026-06-29", "Yesterday policy item", "PIB")), encoding="utf-8")
(root / "daily" / "2026-06-24.json").write_text(json.dumps(payload("2026-06-24", "Week economy item", "RBI", False)), encoding="utf-8")
current = payload("2026-06-30", "Today governance item", "PRS")
calendar = module.build_calendar_context("2026-06-30", current, root)
print(json.dumps(calendar))
`);

  assert.equal(result.status, 0, result.stderr);
  const calendar = JSON.parse(result.stdout);
  assert.equal(calendar.today.date, "2026-06-30");
  assert.equal(calendar.yesterday.date, "2026-06-29");
  assert.equal(calendar.week_total_items, 3);
  assert.equal(calendar.week_high_yield, 2);
  assert.equal(calendar.month_total_items, 3);
  assert.deepEqual(calendar.today.sources, ["PRS"]);
  assert.deepEqual(calendar.weekly_calendar.map((day: { date: string }) => day.date), ["2026-06-24", "2026-06-29", "2026-06-30"]);
  assert.equal(calendar.as_they_come.length, 1);
  assert.equal(calendar.as_they_come[0].title, "Today governance item");
  assert.equal(calendar.today.events[0].source, "PRS");
  assert.deepEqual(calendar.weekly_by_day.map((day: { date: string }) => day.date), ["2026-06-24", "2026-06-29", "2026-06-30"]);
});

test("daily news pipeline drops invalid raw items before writing artifacts", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

items = [
    module.RawItem(
        title="RBI keeps repo rate unchanged",
        source="RBI",
        url="https://rbi.example/policy",
        published_at="2026-06-26T10:00:00+05:30",
        fetched_at="2026-06-26T10:00:01+05:30",
        raw_excerpt="Repo rate remained unchanged.",
        tags=["economy", "banking"],
    ),
    module.RawItem(
        title="SSC notice",
        source="SSC",
        url="https://ssc.example/notice",
        published_at="2026-06-26T10:00:00+05:30",
        fetched_at="2026-06-26T10:00:01+05:30",
        raw_excerpt="",
        tags=["ssc"],
    ),
]

filtered = module.filter_valid_raw_items(items)
print(json.dumps({"count": len(filtered), "titles": [item.title for item in filtered]}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /dropped 1 current-affairs raw item/);
  assert.deepEqual(JSON.parse(result.stdout), {
    count: 1,
    titles: ["RBI keeps repo rate unchanged"]
  });
});

test("daily news pipeline drops non-English raw items for the SSC English feed", () => {
  const result = runPipelineSnippet(String.raw`
import importlib.util
import json
import sys
from pathlib import Path

script_path = Path("scripts/daily_news_pipeline.py").resolve()
spec = importlib.util.spec_from_file_location("daily_news_pipeline", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

items = [
    module.RawItem(
        title="RBI releases banking update",
        source="RBI",
        url="https://rbi.example/update",
        published_at="2026-06-27T10:00:00+05:30",
        fetched_at="2026-06-27T10:00:01+05:30",
        raw_excerpt="RBI released a banking update for revision.",
        tags=["economy", "banking"],
    ),
    module.RawItem(
        title="केंद्रीय मंत्री ने योजना शुरू की",
        source="PIB",
        url="https://pib.example/hindi",
        published_at="2026-06-27T10:00:00+05:30",
        fetched_at="2026-06-27T10:00:01+05:30",
        raw_excerpt="यह हिंदी सामग्री अंग्रेजी फीड में नहीं रहनी चाहिए।",
        tags=["government"],
    ),
]

filtered = module.filter_valid_raw_items(items)
print(json.dumps({"count": len(filtered), "titles": [item.title for item in filtered]}))
`);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    count: 1,
    titles: ["RBI releases banking update"]
  });
});

test("daily news pipeline validation succeeds for valid artifact files", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const date = "2026-06-26";
    const rawPath = path.join(dataRoot, "raw", `${date}.jsonl`);
    const dailyPath = path.join(dataRoot, "daily", `${date}.json`);
    fs.writeFileSync(rawPath, JSON.stringify({
      title: "RBI announces benchmark rates remain unchanged",
      source: "RBI",
      url: "https://rbi.example",
      published_at: "2026-06-26T10:00:00+05:30",
      fetched_at: "2026-06-26T10:00:01+05:30",
      raw_excerpt: "RBI kept repo rates steady.",
      tags: ["economy", "banking"]
    }) + "\n");
    fs.writeFileSync(dailyPath, JSON.stringify({
      date,
      status: "ready",
      generatedAt: "2026-06-26T12:00:00+05:30",
      items: [{
        title: "Repo rates remain unchanged",
        source: "RBI",
        url: "https://rbi.example",
        published_at: "2026-06-26T10:00:00+05:30",
        source_excerpt: "RBI kept repo rates steady and the update is relevant for banking, monetary policy, and macroeconomy revision.",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Banking", "Economy"],
        key_points: ["Repo rates were unchanged this week."],
        why_it_matters_for_ssc_cgl: "Monetary policy update influences macro topics.",
        why_it_matters_for_upsc_cse: "Repo-rate decisions link to GS3 monetary policy and inflation control.",
        static_context: "Revise RBI, Monetary Policy Committee, repo rate, reverse repo, CRR, and SLR.",
        prelims_facts: ["Repo rates were unchanged."],
        mains_angles: ["Monetary-policy choices affect inflation, credit, investment, and growth."],
        memory_hook: "RBI policy recall",
        mcq_seed: { question: "Which institution revised repo rates?", answer: "RBI", trap: "Think of SEC?" }
      }]
    }));

    const result = runPipelineValidation(["--validate-date", date], dataRoot);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /validated current-affairs artifacts/);
  });
});

test("daily news pipeline validation fails for missing or empty artifacts", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const date = "2026-06-26";
    const missingRawPath = path.join(dataRoot, "daily", `${date}.json`);
    fs.writeFileSync(missingRawPath, JSON.stringify({
      date,
      status: "ready",
      generatedAt: "2026-06-26T12:00:00+05:30",
      items: [{
        title: "Placeholder",
        source: "RBI",
        url: "https://rbi.example",
        published_at: "2026-06-26T10:00:00+05:30",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Banking"],
        key_points: ["Repo rates were unchanged."],
        why_it_matters_for_ssc_cgl: "Macro policy update.",
        memory_hook: "RBI",
        mcq_seed: { question: "Which institution set policy?", answer: "RBI", trap: "Think of IRDA." }
      }]
    }));

    const result = runPipelineValidation(["--validate-date", date], dataRoot);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing raw file/);
  });

  withTempCurrentAffairsRoot((dataRoot) => {
    const date = "2026-06-26";
    const rawPath = path.join(dataRoot, "raw", `${date}.jsonl`);
    const dailyPath = path.join(dataRoot, "daily", `${date}.json`);
    fs.writeFileSync(rawPath, JSON.stringify({
      title: "Valid raw entry",
      source: "PIB",
      url: "https://pib.example",
      published_at: "2026-06-26T06:00:00+05:30",
      fetched_at: "2026-06-26T06:00:01+05:30",
      raw_excerpt: "PIB announced a new policy.",
      tags: ["government", "polity"]
    }) + "\n");
    fs.writeFileSync(dailyPath, JSON.stringify({
      date,
      status: "ready",
      generatedAt: "2026-06-26T12:00:00+05:30",
      items: []
    }));

    const result = runPipelineValidation(["--validate-date", date], dataRoot);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /daily items is missing or empty/);
  });
});

test("daily news pipeline validation rejects unsafe raw bodies and malformed summary items", () => {
  withTempCurrentAffairsRoot((dataRoot) => {
    const date = "2026-06-26";
    const rawPath = path.join(dataRoot, "raw", `${date}.jsonl`);
    const dailyPath = path.join(dataRoot, "daily", `${date}.json`);
    fs.writeFileSync(rawPath, JSON.stringify({
      title: "PIB releases scheme update",
      source: "PIB",
      url: "https://pib.example/scheme",
      published_at: "2026-06-26T06:00:00+05:30",
      fetched_at: "2026-06-26T06:00:01+05:30",
      raw_excerpt: "PIB announced a scheme update.",
      raw_body: "This full article body must never be stored in the raw current-affairs artifact.",
      tags: ["government", "schemes"]
    }) + "\n");
    fs.writeFileSync(dailyPath, JSON.stringify({
      date,
      status: "ready",
      generatedAt: "2026-06-26T12:00:00+05:30",
      items: [{
        title: "PIB scheme update",
        source: "PIB",
        url: "https://pib.example/scheme",
        published_at: "2026-06-26T06:00:00+05:30",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Schemes"],
        key_points: ["PIB announced a scheme update."],
        why_it_matters_for_ssc_cgl: "Scheme facts are asked in GA.",
        why_it_matters_for_upsc_cse: "Scheme updates link to GS2 welfare, governance, and implementation issues.",
        static_context: "Revise the ministry, target group, funding pattern, launch year, and objective.",
        prelims_facts: ["PIB announced a scheme update."],
        mains_angles: ["Scheme design can be analysed through inclusion, delivery, federalism, and accountability."],
        memory_hook: "PIB scheme",
        mcq_seed: { question: "Which source announced the scheme update?", answer: "PIB", trap: "RBI" }
      }]
    }));

    const result = runPipelineValidation(["--validate-date", date], dataRoot);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /raw_body/);
  });

  withTempCurrentAffairsRoot((dataRoot) => {
    const date = "2026-06-26";
    const rawPath = path.join(dataRoot, "raw", `${date}.jsonl`);
    const dailyPath = path.join(dataRoot, "daily", `${date}.json`);
    fs.writeFileSync(rawPath, JSON.stringify({
      title: "RBI announces benchmark rates remain unchanged",
      source: "RBI",
      url: "https://rbi.example",
      published_at: "2026-06-26T10:00:00+05:30",
      fetched_at: "2026-06-26T10:00:01+05:30",
      raw_excerpt: "RBI kept repo rates steady.",
      tags: ["economy", "banking"]
    }) + "\n");
    fs.writeFileSync(dailyPath, JSON.stringify({
      date,
      status: "ready",
      generatedAt: "2026-06-26T12:00:00+05:30",
      items: [{
        title: "Repo rates remain unchanged",
        source: "RBI",
        url: "https://rbi.example",
        published_at: "2026-06-26T10:00:00+05:30",
        ssc_relevance: "high",
        upsc_cse_relevance: "high",
        exam_areas: ["Banking", "Economy"],
        key_points: ["Repo rates were unchanged this week.".repeat(40)],
        why_it_matters_for_ssc_cgl: "Monetary policy update influences macro topics.",
        why_it_matters_for_upsc_cse: "Repo-rate decisions link to GS3 monetary policy and inflation control.",
        static_context: "Revise RBI, Monetary Policy Committee, repo rate, reverse repo, CRR, and SLR.",
        prelims_facts: ["Repo rates were unchanged."],
        mains_angles: ["Monetary-policy choices affect inflation, credit, investment, and growth."],
        memory_hook: "RBI policy recall",
        mcq_seed: { question: "", answer: "RBI", trap: "Think of SEC?" }
      }]
    }));

    const result = runPipelineValidation(["--validate-date", date], dataRoot);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /summary item 1/);
  });
});
