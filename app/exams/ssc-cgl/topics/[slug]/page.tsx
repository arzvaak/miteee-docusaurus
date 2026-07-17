import { notFound } from "next/navigation";
import { SscTopicStudyPage } from "@/components/SscTopicStudyPage";
import { getSscTopic, getSscTopics } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getSscTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getSscTopic(slug);
  return buildPageMetadata({
    title: topic ? topic.title + " - SSC CGL" : "SSC CGL Topic",
    description: topic?.study.summary || "SSC CGL topic study material and drills.",
    pathname: "/exams/ssc-cgl/topics/" + slug
  });
}

export default async function SscCglTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getSscTopic(slug);
  if (!topic) notFound();

  const topicsInSubject = getSscTopics().filter((candidate) => candidate.section === topic.section);
  const topicIndex = topicsInSubject.findIndex((candidate) => candidate.slug === topic.slug);
  const previousTopic = topicIndex > 0 ? topicsInSubject[topicIndex - 1] ?? null : null;
  const nextTopic = topicIndex >= 0 && topicIndex < topicsInSubject.length - 1
    ? topicsInSubject[topicIndex + 1] ?? null
    : null;

  return (
    <SscTopicStudyPage
      nextTopic={nextTopic}
      previousTopic={previousTopic}
      topic={topic}
    />
  );
}
