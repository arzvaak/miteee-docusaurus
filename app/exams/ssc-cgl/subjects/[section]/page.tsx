import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SscCglSubjectLanding } from "@/components/SscCglSubjectLanding";
import { getCourseNavigationGroups } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { getSscCglPracticeTopics, getSscCglTopicCoverageMap, getSscTopics } from "@/lib/ssc-cgl";
import {
  getSscCglSubjectDefinition,
  sscCglSubjectDefinitions,
  sscCglSubjectHref,
  sscCglTopicSlugFromNote,
  type SscCglSubjectLandingNote
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
    title: `${subject.shortTitle} Study Map - SSC CGL`,
    description: `${subject.description} Open the complete ${subject.shortTitle} topic map, continue saved reading, and move into focused practice.`,
    pathname: sscCglSubjectHref(subject.section)
  });
}

export default async function SscCglSubjectPage({ params }: SscCglSubjectPageProps) {
  const { section } = await params;
  const subject = getSscCglSubjectDefinition(section);
  if (!subject) notFound();

  const group = getCourseNavigationGroups("SSC-CGL").find((item) => item.key === subject.groupKey);
  if (!group) notFound();

  const subjectTopics = getSscTopics().filter((topic) => topic.section === subject.section);
  const coverage = getSscCglTopicCoverageMap();
  const coverageSection = coverage.sections.find((item) => item.section === subject.section);
  const coverageBySlug = new Map((coverageSection?.rows ?? []).map((row) => [row.slug, row]));
  const practiceBySlug = new Map(
    getSscCglPracticeTopics()
      .filter((topic) => topic.section === subject.section)
      .map((topic) => [topic.slug, topic])
  );
  const canonicalTopicSlugs = new Set(subjectTopics.map((topic) => topic.slug));
  const noteByTopicSlug = new Map(
    group.notes.flatMap((note) => {
      const topicSlug = sscCglTopicSlugFromNote(subject, note.slug);
      return topicSlug && canonicalTopicSlugs.has(topicSlug) ? [[topicSlug, note] as const] : [];
    })
  );

  const guideNotes: SscCglSubjectLandingNote[] = group.notes
    .filter((note) => {
      const topicSlug = sscCglTopicSlugFromNote(subject, note.slug);
      return !topicSlug || !canonicalTopicSlugs.has(topicSlug);
    })
    .map((note) => ({
      slug: note.slug,
      title: note.title,
      label: note.label,
      description: note.excerpt || `A combined ${subject.shortTitle} guide for method, recall, and exam execution.`,
      headings: note.headings.slice(0, 4),
      stage: "guide",
      topicSlug: null,
      studyHref: `/notes/${note.slug}`,
      practiceHref: null,
      drillHref: null,
      reviewedQuestions: 0,
      bookBackedQuestions: 0,
      gapRepairQuestions: 0,
      readinessPercent: 0,
      coverageLabel: null
    }));

  const topicNotes: SscCglSubjectLandingNote[] = subjectTopics.map((topic) => {
    const note = noteByTopicSlug.get(topic.slug);
    const row = coverageBySlug.get(topic.slug);
    const practice = practiceBySlug.get(topic.slug);

    return {
      slug: note?.slug ?? topic.slug,
      title: note?.title ?? topic.title,
      label: note?.label ?? topic.title,
      description: topic.study.summary || note?.excerpt || `Study ${topic.title} for SSC CGL Tier-I.`,
      headings: note?.headings.slice(0, 4) ?? topic.study.sections.slice(0, 4).map((item) => item.title),
      stage: topic.priority,
      topicSlug: topic.slug,
      studyHref: `/exams/ssc-cgl/topics/${topic.slug}`,
      practiceHref: practice?.href ?? `/exams/ssc-cgl/practice/${topic.slug}`,
      drillHref: row?.drillHref ?? `/exams/ssc-cgl/tests?topic=${topic.slug}`,
      reviewedQuestions: row?.reviewedQuestions ?? practice?.reviewedQuestions ?? 0,
      bookBackedQuestions: row?.bookBackedQuestions ?? practice?.bookBackedQuestions ?? 0,
      gapRepairQuestions: row?.gapRepairQuestions ?? practice?.gapRepairQuestions ?? 0,
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
      <SscCglSubjectLanding
        notes={[...guideNotes, ...topicNotes]}
        stats={{
          studyNotes: group.notes.length,
          canonicalTopics: subjectTopics.length,
          reviewedQuestions: coverageSection?.reviewedQuestions ?? 0,
          bookBackedQuestions: coverageSection?.bookBackedQuestions ?? 0,
          gapRepairQuestions: coverageSection?.gapRepairQuestions ?? 0
        }}
        subject={subject}
      />
    </>
  );
}
