import fs from "node:fs";
import path from "node:path";
import type {
  CurrentAffairsBrief,
  CurrentAffairsArchiveDay,
  CurrentAffairsCalendarDigest,
  CurrentAffairsItem,
  CurrentAffairsRawItem,
  CurrentAffairsRecallCard,
  CurrentAffairsRevisionPacket,
  CurrentAffairsRunState,
  CurrentAffairsStaticAnchor,
  CurrentAffairsSourceQuality,
  CurrentAffairsStudyBrief,
  CurrentAffairsSummaryItem,
  CurrentAffairsTimelineEvent
} from "@/lib/exam-types";

type ParseSummaryResult = {
  accepted: boolean;
  reason: string | null;
  brief: CurrentAffairsBrief | null;
};

const currentAffairsRoot = path.join(process.cwd(), "data", "current-affairs", "daily");
const currentAffairsDataRoot = path.join(process.cwd(), "data", "current-affairs");
const officialCurrentAffairsSources = new Set(["PIB", "RBI", "SSC", "PRS"]);
const defaultStaticAnchor: CurrentAffairsStaticAnchor = {
  topicSlug: "current-affairs-static-gk",
  label: "Current Affairs and Static GK",
  href: "/exams/ssc-cgl/topics/current-affairs-static-gk",
  reason: "Convert the news fact into institution, date, place, report, scheme, or appointment recall."
};
const staticAnchorRules: Array<{ pattern: RegExp; anchor: CurrentAffairsStaticAnchor }> = [
  {
    pattern: /\b(economy|banking|finance|fiscal|monetary|liquidity|debt|treasury|rbi|repo|securities|bills?)\b/i,
    anchor: {
      topicSlug: "economics-budget-banking",
      label: "Economics, Budget, and Banking",
      href: "/exams/ssc-cgl/topics/economics-budget-banking",
      reason: "Revise RBI tools, banking terms, budget language, debt instruments, and economy traps."
    }
  },
  {
    pattern: /\b(constitution|article|parliament|election|court|commission|governance|bill|act)\b/i,
    anchor: {
      topicSlug: "indian-polity-basics",
      label: "Indian Polity Basics",
      href: "/exams/ssc-cgl/topics/indian-polity-basics",
      reason: "Attach the news to constitutional body, article, act, appointment, and function recall."
    }
  },
  {
    pattern: /\b(award|honour|sports|tournament|championship|medal|winner)\b/i,
    anchor: {
      topicSlug: "sports-awards",
      label: "Sports, Awards, and Honours",
      href: "/exams/ssc-cgl/topics/sports-awards",
      reason: "Memorize awarding body, field, winner, host, trophy, and common name-confusion traps."
    }
  },
  {
    pattern: /\b(science|technology|space|disease|health|vaccine|environment|climate)\b/i,
    anchor: {
      topicSlug: "science-everyday",
      label: "General Science and Everyday Applications",
      href: "/exams/ssc-cgl/topics/science-everyday",
      reason: "Tie the current fact to everyday science, units, applications, discoveries, and definitions."
    }
  },
  {
    pattern: /\b(geography|river|state|district|crop|mineral|climate|map|border)\b/i,
    anchor: {
      topicSlug: "geography-india-world",
      label: "Geography of India and World",
      href: "/exams/ssc-cgl/topics/geography-india-world",
      reason: "Attach the event to map location, river system, resource, crop, climate, and state ordering."
    }
  }
];

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function getCurrentAffairsIstDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return year && month && day ? `${year}-${month}-${day}` : now.toISOString().slice(0, 10);
}

function normalizeForGrounding(value: string) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function dataRootForDailyRoot(root: string) {
  return path.basename(root) === "daily" ? path.dirname(root) : currentAffairsDataRoot;
}

function parseUtcDateOnly(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return Date.UTC(year, month - 1, day);
}

function currentAffairsFreshness(lastSuccessfulDate: string | null, expectedDate = getCurrentAffairsIstDate()) {
  const expectedTime = parseUtcDateOnly(expectedDate);
  const successTime = parseUtcDateOnly(lastSuccessfulDate);
  const daysSinceLastSuccess = expectedTime !== null && successTime !== null
    ? Math.max(0, Math.floor((expectedTime - successTime) / 86_400_000))
    : null;
  const freshnessStatus: CurrentAffairsRunState["freshnessStatus"] = lastSuccessfulDate === null
    ? "missing"
    : daysSinceLastSuccess === 0
      ? "current"
      : "stale";
  const freshnessLabel = freshnessStatus === "current"
    ? "Fresh for today"
    : freshnessStatus === "stale"
      ? `${daysSinceLastSuccess} day${daysSinceLastSuccess === 1 ? "" : "s"} behind`
      : "No successful run yet";
  const repairAction = freshnessStatus === "current"
    ? "Do the recall cards and static GK bridge."
    : freshnessStatus === "stale"
      ? "Run the server news job before relying on today's GA brief."
      : "Start the server news job, then verify the daily brief.";

  return {
    expectedDate,
    daysSinceLastSuccess,
    freshnessStatus,
    freshnessLabel,
    repairAction
  };
}

function emptyRunState(): CurrentAffairsRunState {
  const freshness = currentAffairsFreshness(null);
  return {
    firstRunDate: null,
    lastRunDate: null,
    lastSuccessfulDate: null,
    lastRunAt: null,
    ...freshness,
    totalRuns: 0,
    successfulRuns: 0,
    reliabilityPercent: 0,
    continuityLabel: "No daily runs yet",
    latestStatus: "missing",
    latestRawItems: 0,
    latestSummaryItems: 0,
    latestSources: [],
    sourceCounts: {}
  };
}

function numericField(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getCurrentAffairsRunState(root = currentAffairsDataRoot): CurrentAffairsRunState {
  try {
    const payload = JSON.parse(fs.readFileSync(path.join(root, "state.json"), "utf8")) as Record<string, unknown>;
    const totalRuns = numericField(payload.totalRuns);
    const successfulRuns = numericField(payload.successfulRuns);
    const recentRuns = Array.isArray(payload.recentRuns) ? payload.recentRuns.filter((run): run is Record<string, unknown> => Boolean(run && typeof run === "object")) : [];
    const latestRun = recentRuns.at(-1) ?? {};
    const rawSourceCounts = payload.sourceCounts && typeof payload.sourceCounts === "object" && !Array.isArray(payload.sourceCounts)
      ? payload.sourceCounts as Record<string, unknown>
      : {};
    const sourceCounts = Object.fromEntries(
      Object.entries(rawSourceCounts)
        .filter(([source, count]) => source.trim() && typeof count === "number" && Number.isFinite(count))
        .sort(([a], [b]) => a.localeCompare(b))
    ) as Record<string, number>;
    const latestSources = Array.isArray(latestRun.sources)
      ? latestRun.sources.map((source) => cleanText(String(source))).filter(Boolean)
      : [];
    const lastSuccessfulDate = stringField(payload.lastSuccessfulDate);

    return {
      firstRunDate: stringField(payload.firstRunDate),
      lastRunDate: stringField(payload.lastRunDate),
      lastSuccessfulDate,
      lastRunAt: stringField(payload.lastRunAt),
      ...currentAffairsFreshness(lastSuccessfulDate),
      totalRuns,
      successfulRuns,
      reliabilityPercent: totalRuns > 0 ? Math.round(successfulRuns / totalRuns * 100) : 0,
      continuityLabel: totalRuns > 0 ? `${successfulRuns}/${totalRuns} successful runs` : "No daily runs yet",
      latestStatus: stringField(latestRun.status) ?? "missing",
      latestRawItems: numericField(latestRun.rawItems),
      latestSummaryItems: numericField(latestRun.summaryItems),
      latestSources,
      sourceCounts
    };
  } catch {
    return emptyRunState();
  }
}

export function normalizeCurrentAffairsItem(input: CurrentAffairsRawItem): CurrentAffairsItem {
  return {
    title: cleanText(input.title),
    source: cleanText(input.source),
    url: input.url.trim(),
    publishedAt: cleanText(input.publishedAt || input.published_at || new Date().toISOString()),
    ...(input.fetched_at ? { fetchedAt: cleanText(input.fetched_at) } : {}),
    rawExcerpt: cleanText(input.rawExcerpt || input.raw_excerpt || ""),
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => cleanText(String(tag))).filter(Boolean) : []
  };
}

function hasGrounding(item: CurrentAffairsSummaryItem, sources: CurrentAffairsItem[]) {
  const source = sources.find((entry) => entry.url === item.url || entry.title === item.title);
  if (!source) return false;
  const sourceText = normalizeForGrounding([source.title, source.source, source.rawExcerpt, ...source.tags].join(" "));
  const generatedText = normalizeForGrounding([
    item.title,
    ...item.key_points,
    item.why_it_matters_for_ssc_cgl,
    item.why_it_matters_for_upsc_cse ?? "",
    item.static_context ?? "",
    ...(item.prelims_facts ?? []),
    ...(item.mains_angles ?? []),
    item.memory_hook
  ].join(" "));
  const sourceTokens = new Set(sourceText.split(" ").filter((token) => token.length >= 5));
  const matched = generatedText.split(" ").filter((token) => sourceTokens.has(token));
  return new Set(matched).size >= 2;
}

function normalizeSummaryItem(item: CurrentAffairsSummaryItem): CurrentAffairsSummaryItem {
  const keyPoints = Array.isArray(item.key_points) ? item.key_points.map((point) => cleanText(String(point))).filter(Boolean).slice(0, 4) : [];
  const sourceExcerpt = cleanText(item.source_excerpt || keyPoints[0] || item.why_it_matters_for_ssc_cgl || "").slice(0, 900);
  return {
    title: cleanText(item.title).slice(0, 160),
    source: cleanText(item.source).slice(0, 80),
    url: item.url.trim(),
    published_at: cleanText(item.published_at),
    source_excerpt: sourceExcerpt,
    ssc_relevance: item.ssc_relevance === "high" || item.ssc_relevance === "medium" ? item.ssc_relevance : "low",
    upsc_cse_relevance: item.upsc_cse_relevance === "high" || item.upsc_cse_relevance === "medium" ? item.upsc_cse_relevance : "low",
    exam_areas: Array.isArray(item.exam_areas) ? item.exam_areas.map((area) => cleanText(String(area))).filter(Boolean).slice(0, 6) : [],
    key_points: keyPoints,
    why_it_matters_for_ssc_cgl: cleanText(item.why_it_matters_for_ssc_cgl || "").slice(0, 220),
    why_it_matters_for_upsc_cse: cleanText(item.why_it_matters_for_upsc_cse || "Connect this update to prelims facts and one mains-ready issue angle.").slice(0, 360),
    static_context: cleanText(item.static_context || "Revise the related static background before attempting recall.").slice(0, 360),
    prelims_facts: Array.isArray(item.prelims_facts) ? item.prelims_facts.map((point) => cleanText(String(point))).filter(Boolean).slice(0, 5) : [],
    mains_angles: Array.isArray(item.mains_angles) ? item.mains_angles.map((point) => cleanText(String(point))).filter(Boolean).slice(0, 5) : [],
    memory_hook: cleanText(item.memory_hook || "").slice(0, 140),
    mcq_seed: {
      question: cleanText(item.mcq_seed?.question || "").slice(0, 220),
      answer: cleanText(item.mcq_seed?.answer || "").slice(0, 120),
      trap: cleanText(item.mcq_seed?.trap || "").slice(0, 160)
    }
  };
}

function normalizeTimelineEvent(value: unknown): CurrentAffairsTimelineEvent | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<CurrentAffairsTimelineEvent>;
  if (typeof input.title !== "string" || typeof input.source !== "string" || typeof input.url !== "string") return null;
  return {
    title: cleanText(input.title).slice(0, 160),
    source: cleanText(input.source).slice(0, 80),
    url: input.url.trim(),
    published_at: typeof input.published_at === "string" ? cleanText(input.published_at) : "",
    ssc_relevance: input.ssc_relevance === "high" || input.ssc_relevance === "medium" ? input.ssc_relevance : "low",
    upsc_cse_relevance: input.upsc_cse_relevance === "high" || input.upsc_cse_relevance === "medium" ? input.upsc_cse_relevance : "low",
    exam_areas: Array.isArray(input.exam_areas) ? input.exam_areas.map((area) => cleanText(String(area))).filter(Boolean).slice(0, 4) : [],
    brief: typeof input.brief === "string" ? cleanText(input.brief).slice(0, 220) : ""
  };
}

function normalizeCalendarDigest(value: unknown): CurrentAffairsCalendarDigest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<CurrentAffairsCalendarDigest>;
  if (typeof input.date !== "string" || !input.date.trim()) return null;
  const events = Array.isArray(input.events)
    ? input.events.map(normalizeTimelineEvent).filter((item): item is CurrentAffairsTimelineEvent => Boolean(item)).slice(0, 12)
    : [];
  return {
    date: cleanText(input.date),
    items: typeof input.items === "number" && Number.isFinite(input.items) ? input.items : 0,
    high_yield: typeof input.high_yield === "number" && Number.isFinite(input.high_yield) ? input.high_yield : 0,
    sources: Array.isArray(input.sources) ? input.sources.map((source) => cleanText(String(source))).filter(Boolean).slice(0, 10) : [],
    exam_areas: Array.isArray(input.exam_areas) ? input.exam_areas.map((area) => cleanText(String(area))).filter(Boolean).slice(0, 10) : [],
    headlines: Array.isArray(input.headlines) ? input.headlines.map((headline) => cleanText(String(headline))).filter(Boolean).slice(0, 8) : [],
    events
  };
}

function normalizeCalendar(value: unknown): CurrentAffairsBrief["calendar"] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const input = value as NonNullable<CurrentAffairsBrief["calendar"]>;
  const list = (items: unknown) => Array.isArray(items) ? items.map(normalizeCalendarDigest).filter((item): item is CurrentAffairsCalendarDigest => Boolean(item)) : [];
  const events = (items: unknown) => Array.isArray(items) ? items.map(normalizeTimelineEvent).filter((item): item is CurrentAffairsTimelineEvent => Boolean(item)) : [];
  return {
    as_of: typeof input.as_of === "string" ? cleanText(input.as_of) : undefined,
    today: normalizeCalendarDigest(input.today),
    yesterday: normalizeCalendarDigest(input.yesterday),
    as_they_come: events(input.as_they_come),
    last_7_days: list(input.last_7_days),
    last_30_days: list(input.last_30_days),
    weekly_by_day: list(input.weekly_by_day),
    monthly_by_day: list(input.monthly_by_day),
    weekly_calendar: list(input.weekly_calendar),
    monthly_calendar: list(input.monthly_calendar),
    week_total_items: typeof input.week_total_items === "number" && Number.isFinite(input.week_total_items) ? input.week_total_items : undefined,
    week_high_yield: typeof input.week_high_yield === "number" && Number.isFinite(input.week_high_yield) ? input.week_high_yield : undefined,
    month_total_items: typeof input.month_total_items === "number" && Number.isFinite(input.month_total_items) ? input.month_total_items : undefined,
    month_high_yield: typeof input.month_high_yield === "number" && Number.isFinite(input.month_high_yield) ? input.month_high_yield : undefined
  };
}

function cardId(date: string, item: CurrentAffairsSummaryItem) {
  const base = `${date}:${item.source}:${item.url}:${item.mcq_seed.question}`;
  let hash = 0;
  for (let index = 0; index < base.length; index += 1) {
    hash = ((hash << 5) - hash + base.charCodeAt(index)) | 0;
  }
  return `ca:${date}:${Math.abs(hash).toString(36)}`;
}

export function buildCurrentAffairsRecallCards(brief: CurrentAffairsBrief): CurrentAffairsRecallCard[] {
  return brief.items
    .filter((item) => item.mcq_seed.question && item.mcq_seed.answer)
    .map((item) => ({
      id: cardId(brief.date, item),
      date: brief.date,
      title: item.title,
      source: item.source,
      url: item.url,
      examAreas: item.exam_areas,
      prompt: item.mcq_seed.question,
      answer: item.mcq_seed.answer,
      trap: item.mcq_seed.trap,
      memoryHook: item.memory_hook,
      priority: item.ssc_relevance
    }));
}

function staticAnchorsForItem(item: CurrentAffairsSummaryItem): CurrentAffairsStaticAnchor[] {
  const text = [item.title, item.source, ...item.exam_areas, ...item.key_points, item.why_it_matters_for_ssc_cgl, item.memory_hook].join(" ");
  const anchors = [defaultStaticAnchor];
  for (const rule of staticAnchorRules) {
    if (rule.pattern.test(text)) anchors.push(rule.anchor);
  }
  return [...new Map(anchors.map((anchor) => [anchor.topicSlug, anchor])).values()].slice(0, 4);
}

export function buildCurrentAffairsRevisionPackets(brief: CurrentAffairsBrief): CurrentAffairsRevisionPacket[] {
  return brief.items
    .filter((item) => item.mcq_seed.question && item.mcq_seed.answer)
    .map((item) => {
      const anchors = staticAnchorsForItem(item);
      const recallCardId = cardId(brief.date, item);
      return {
        id: `packet:${recallCardId}`,
        recallCardId,
        date: brief.date,
        title: item.title,
        source: item.source,
        url: item.url,
        staticAnchors: anchors,
        mcqSeeds: [
          {
            question: item.mcq_seed.question,
            answer: item.mcq_seed.answer,
            trap: item.mcq_seed.trap,
            examArea: item.exam_areas[0] ?? "Current Affairs"
          },
          {
            question: `Static bridge: which SSC topic should you revise after this ${item.source} item?`,
            answer: anchors.map((anchor) => anchor.label).join(" + "),
            trap: "Reading the news once without linking it to static GK.",
            examArea: "Static GK bridge"
          }
        ]
      };
    });
}

export function summarizeCurrentAffairsSourceQuality(brief: CurrentAffairsBrief): CurrentAffairsSourceQuality {
  const examAreas = new Set<string>();
  const staticAnchorSlugs = new Set<string>();
  for (const item of brief.items) {
    for (const area of item.exam_areas) examAreas.add(area);
    for (const anchor of staticAnchorsForItem(item)) staticAnchorSlugs.add(anchor.topicSlug);
  }
  return {
    totalItems: brief.items.length,
    highRelevanceItems: brief.items.filter((item) => item.ssc_relevance === "high").length,
    officialSourceItems: brief.items.filter((item) => officialCurrentAffairsSources.has(item.source)).length,
    staticAnchorCount: staticAnchorSlugs.size,
    examAreas: [...examAreas].sort().slice(0, 12),
    hasMistralSummary: brief.status === "ready" && brief.items.length > 0 && Boolean(brief.generatedAt)
  };
}

export function buildCurrentAffairsStudyBrief(brief: CurrentAffairsBrief, runState = getCurrentAffairsRunState()): CurrentAffairsStudyBrief {
  return {
    ...brief,
    recallCards: buildCurrentAffairsRecallCards(brief),
    revisionPackets: buildCurrentAffairsRevisionPackets(brief),
    sourceQuality: summarizeCurrentAffairsSourceQuality(brief),
    runState
  };
}

export function parseMistralCurrentAffairsSummary(content: string, sources: CurrentAffairsItem[]): ParseSummaryResult {
  try {
    const parsed = JSON.parse(content) as Partial<{ date: unknown; items: unknown; generatedAt: unknown }>;
    if (typeof parsed.date !== "string" || !Array.isArray(parsed.items)) {
      return { accepted: false, reason: "Mistral did not return the expected daily current-affairs shape.", brief: null };
    }
    const items = parsed.items
      .filter((item): item is CurrentAffairsSummaryItem => Boolean(item && typeof item === "object"))
      .map(normalizeSummaryItem)
      .filter((item) => item.title && item.url && item.key_points.length > 0);
    if (items.length === 0) return { accepted: false, reason: "Mistral returned no usable current-affairs items.", brief: null };
    if (!items.every((item) => hasGrounding(item, sources))) {
      return { accepted: false, reason: "Mistral added facts outside the supplied current-affairs source excerpts.", brief: null };
    }
    return {
      accepted: true,
      reason: null,
      brief: {
        date: parsed.date,
        status: "ready",
        generatedAt: typeof parsed.generatedAt === "string" ? parsed.generatedAt : new Date().toISOString(),
        items
      }
    };
  } catch {
    return { accepted: false, reason: "Mistral returned invalid JSON.", brief: null };
  }
}

export function getCurrentAffairsAvailableDates(root = currentAffairsRoot): string[] {
  try {
    return fs.readdirSync(root)
      .map((file) => file.match(/^(\d{4}-\d{2}-\d{2})\.json$/)?.[1])
      .filter((date): date is string => Boolean(date))
      .sort();
  } catch {
    return [];
  }
}

export function getLatestCurrentAffairsDate(root = currentAffairsRoot): string | null {
  return getCurrentAffairsAvailableDates(root).at(-1) ?? null;
}

export function getCurrentAffairsBrief(date = getCurrentAffairsIstDate(), root = currentAffairsRoot): CurrentAffairsBrief {
  const filePath = path.join(root, `${date}.json`);
  try {
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8")) as CurrentAffairsBrief;
    return {
      date: payload.date || date,
      status: payload.status === "failed" ? "failed" : "ready",
      generatedAt: payload.generatedAt || null,
      items: Array.isArray(payload.items) ? payload.items.map(normalizeSummaryItem) : [],
      calendar: normalizeCalendar(payload.calendar)
    };
  } catch {
    return {
      date,
      status: "missing",
      generatedAt: null,
      items: []
    };
  }
}

export function getCurrentAffairsArchive(
  limit = 14,
  selectedDate: string | undefined = undefined,
  root = currentAffairsRoot
): CurrentAffairsArchiveDay[] {
  const activeDate = selectedDate ?? getLatestCurrentAffairsDate(root) ?? getCurrentAffairsIstDate();
  return [...getCurrentAffairsAvailableDates(root)]
    .reverse()
    .slice(0, limit)
    .map((date) => {
      const brief = getCurrentAffairsBrief(date, root);
      const quality = summarizeCurrentAffairsSourceQuality(brief);
      return {
        date,
        status: brief.status,
        totalItems: quality.totalItems,
        highRelevanceItems: quality.highRelevanceItems,
        officialSourceItems: quality.officialSourceItems,
        recallCards: buildCurrentAffairsRecallCards(brief).length,
        href: `/exams/ssc-cgl/current-affairs?date=${date}`,
        isSelected: date === activeDate
      };
    });
}

export function getCurrentAffairsStudyBrief(
  date: string | undefined = undefined,
  root = currentAffairsRoot
): CurrentAffairsStudyBrief {
  const effectiveDate = date ?? getLatestCurrentAffairsDate(root) ?? getCurrentAffairsIstDate();
  return buildCurrentAffairsStudyBrief(getCurrentAffairsBrief(effectiveDate, root), getCurrentAffairsRunState(dataRootForDailyRoot(root)));
}
