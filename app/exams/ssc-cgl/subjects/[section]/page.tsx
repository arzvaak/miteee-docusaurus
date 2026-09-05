import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SscCglQuestionSubjectLanding } from "@/components/SscCglQuestionSubjectLanding";
import { SscQuantBookDirectory } from "@/components/SscQuantBookDirectory";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { getSscCglPracticeTopics, getSscCglTopicCoverageMap, getSscTopics } from "@/lib/ssc-cgl";
import { getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import {
  getSscCglSubjectDefinition,
  sscCglSubjectDefinitions,
  sscCglSubjectHref
} from "@/lib/ssc-cgl-subjects";

type SscCglSubjectPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return sscCglSubjectDefinitions.map((subject) => ({ section: subject.section }));
}

export async function generateMetadata({ params }: SscCglSubjectPageProps) {
  const { section } = await params;
  const subject = getSscCglSubjectDefinition(section);
  if (!subject) return {};

  return buildPageMetadata({
    title: subject.section === "quantitative-aptitude" ? "Quantitative Aptitude - SSC CGL" : `${subject.shortTitle} Question Bank - SSC CGL`,
    description: subject.section === "quantitative-aptitude"
      ? "Study all 20 Quantitative Aptitude chapters and practise every source-book exercise."
      : `Practise every retained ${subject.shortTitle} question by topic.`,
    pathname: sscCglSubjectHref(subject.section)
  });
}

export default async function SscCglSubjectPage({ params }: SscCglSubjectPageProps) {
  const { section } = await params;
  const subject = getSscCglSubjectDefinition(section);
  if (!subject) notFound();

  if (subject.section === "quantitative-aptitude") {
    return <SscQuantBookDirectory chapters={getSscQuantBookChapters()} />;
  }

  const subjectTopics = getSscTopics().filter((topic) => topic.section === subject.section);
  const coverage = getSscCglTopicCoverageMap();
  const coverageSection = coverage.sections.find((item) => item.section === subject.section);
  const coverageBySlug = new Map((coverageSection?.rows ?? []).map((row) => [row.slug, row]));
  const practiceBySlug = new Map(
    getSscCglPracticeTopics()
      .filter((topic) => topic.section === subject.section)
      .map((topic) => [topic.slug, topic])
  );
  const topics = subjectTopics.map((topic) => {
    const row = coverageBySlug.get(topic.slug);
    const practice = practiceBySlug.get(topic.slug);
    return {
      slug: topic.slug,
      title: topic.title,
      summary: topic.study.summary || `Practise ${topic.title} for SSC CGL Tier-I.`,
      reviewedQuestions: row?.reviewedQuestions ?? practice?.reviewedQuestions ?? 0,
      bookBackedQuestions: row?.bookBackedQuestions ?? practice?.bookBackedQuestions ?? 0,
      readinessPercent: row?.readinessPercent ?? 0,
      coverageLabel: row?.coverageLabel ?? null
    };
  });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", pathname: "/" },
          { name: "Exams", pathname: "/exams" },
          { name: "SSC CGL", pathname: "/exams/ssc-cgl" },
          { name: subject.shortTitle, pathname: sscCglSubjectHref(subject.section) }
        ])}
      />
      <SscCglQuestionSubjectLanding
        bookBackedQuestions={coverageSection?.bookBackedQuestions ?? 0}
        reviewedQuestions={coverageSection?.reviewedQuestions ?? 0}
        subject={subject}
        topics={topics}
      />
    </>
  );
}
