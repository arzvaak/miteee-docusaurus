import { CurrentAffairsFeed } from "@/components/CurrentAffairsFeed";
import { SscMistakeNotebook } from "@/components/SscMistakeNotebook";
import { getCurrentAffairsArchive, getCurrentAffairsStudyBrief } from "@/lib/current-affairs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Current Affairs",
  description: "Daily SSC CGL current-affairs briefs from official/RSS-first sources.",
  pathname: "/exams/ssc-cgl/current-affairs"
});

export default async function SscCurrentAffairsPage({
  searchParams
}: {
  searchParams?: Promise<{ date?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedDate = typeof params?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : undefined;
  const brief = getCurrentAffairsStudyBrief(requestedDate);
  return (
    <section className="page ssc-page ssc-current-affairs-page">
      <CurrentAffairsFeed brief={brief} archiveDays={getCurrentAffairsArchive(14, brief.date)} />
      <SscMistakeNotebook />
    </section>
  );
}
