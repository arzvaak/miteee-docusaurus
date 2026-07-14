import { CurrentAffairsFeed } from "@/components/CurrentAffairsFeed";
import {
  buildCurrentAffairsStoryRecords,
  getCurrentAffairsArchive,
  getCurrentAffairsMonthKey,
  getCurrentAffairsMonthlyIssue,
  getCurrentAffairsStudyBrief,
  getCurrentAffairsWeekKey,
  getCurrentAffairsWeeklyIssue
} from "@/lib/current-affairs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Current Affairs",
  description: "Daily SSC CGL current-affairs briefs from official/RSS-first sources.",
  pathname: "/exams/ssc-cgl/current-affairs"
});

export default async function SscCurrentAffairsPage({
  searchParams
}: {
  searchParams?: Promise<{
    date?: string | string[];
    edition?: string | string[];
    period?: string | string[];
    story?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const requestedDate = typeof params?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : undefined;
  const brief = getCurrentAffairsStudyBrief(requestedDate);
  const requestedEdition = params?.edition === "weekly" || params?.edition === "monthly" ? params.edition : "daily";
  const requestedPeriod = typeof params?.period === "string" ? params.period : undefined;
  const weekKey = requestedEdition === "weekly" && requestedPeriod && /^\d{4}-W\d{2}$/.test(requestedPeriod)
    ? requestedPeriod
    : getCurrentAffairsWeekKey(brief.date);
  const monthKey = requestedEdition === "monthly" && requestedPeriod && /^\d{4}-\d{2}$/.test(requestedPeriod)
    ? requestedPeriod
    : getCurrentAffairsMonthKey(brief.date);
  const weeklyIssue = weekKey ? getCurrentAffairsWeeklyIssue(weekKey) : null;
  const monthlyIssue = monthKey ? getCurrentAffairsMonthlyIssue(monthKey) : null;
  const initialStorySlug = typeof params?.story === "string" ? params.story : undefined;

  return (
    <section className="ssc-current-affairs-page" data-shell-full-bleed="true">
      <CurrentAffairsFeed
        archiveDays={getCurrentAffairsArchive(14, brief.date)}
        brief={brief}
        canAdmin
        dailyStories={buildCurrentAffairsStoryRecords(brief)}
        initialEdition={requestedEdition}
        initialStorySlug={initialStorySlug}
        monthlyIssue={monthlyIssue}
        weeklyIssue={weeklyIssue}
      />
    </section>
  );
}
