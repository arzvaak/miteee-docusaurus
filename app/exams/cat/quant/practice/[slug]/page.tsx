import { notFound } from "next/navigation";
import { CatTopicPracticeClient } from "@/components/CatTopicPracticeClient";
import { getCatQuantPracticeSet, getCatQuantTopics } from "@/lib/cat";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCatQuantTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getCatQuantPracticeSet(slug);
  return buildPageMetadata({
    title: practice ? `${practice.topic.title} Practice - CAT Quant` : "CAT Quant Practice",
    description: practice ? `Practice ${practice.questions.length} reviewed ${practice.topic.title} questions.` : "CAT Quantitative Aptitude practice.",
    pathname: `/exams/cat/quant/practice/${slug}`
  });
}

export default async function CatQuantTopicPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getCatQuantPracticeSet(slug);
  if (!practice) notFound();
  return <CatTopicPracticeClient topic={practice.topic} questions={practice.questions} />;
}
