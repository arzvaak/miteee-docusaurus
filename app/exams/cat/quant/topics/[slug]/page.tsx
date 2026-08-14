import { notFound } from "next/navigation";
import { CatTopicStudyPage } from "@/components/CatTopicStudyPage";
import { getCatQuantTopic, getCatQuantTopics } from "@/lib/cat";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCatQuantTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getCatQuantTopic(slug);
  return buildPageMetadata({
    title: topic ? `${topic.title} - CAT Quant` : "CAT Quant Topic",
    description: topic?.summary ?? "CAT Quantitative Aptitude study note.",
    pathname: `/exams/cat/quant/topics/${slug}`
  });
}

export default async function CatQuantTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getCatQuantTopic(slug);
  if (!topic) notFound();
  const topics = getCatQuantTopics();
  const index = topics.findIndex((item) => item.slug === slug);
  return <CatTopicStudyPage topic={topic} previousTopic={index > 0 ? topics[index - 1] ?? null : null} nextTopic={index < topics.length - 1 ? topics[index + 1] ?? null : null} />;
}
