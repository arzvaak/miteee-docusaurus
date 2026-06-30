import { notFound } from "next/navigation";
import { SscTopicPracticeClient } from "@/components/SscTopicPracticeClient";
import { getSscCglTopicPracticeSet, getSscTopics } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getSscTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practiceSet = getSscCglTopicPracticeSet(slug);
  return buildPageMetadata({
    title: practiceSet ? `${practiceSet.topic.title} Practice - SSC CGL` : "SSC CGL Topic Practice",
    description: practiceSet
      ? `Practice ${practiceSet.stats.totalQuestions} SSC CGL ${practiceSet.topic.title} questions one by one.`
      : "SSC CGL topic-wise one-by-one practice.",
    pathname: `/exams/ssc-cgl/practice/${slug}`
  });
}

export default async function SscCglTopicPracticePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const mode = Array.isArray(query?.mode) ? query?.mode[0] : query?.mode;
  const practiceSet = getSscCglTopicPracticeSet(slug);
  if (!practiceSet) notFound();

  return (
    <SscTopicPracticeClient
      topic={practiceSet.topic}
      questions={practiceSet.questions}
      previousTopicHref={practiceSet.previousTopicHref}
      nextTopicHref={practiceSet.nextTopicHref}
      initialMode={mode}
    />
  );
}
