import { JsonLd } from "@/components/JsonLd";
import { SscCglLibraryLanding } from "@/components/SscCglLibraryLanding";
import type { CourseNavigationGroup } from "@/lib/content";
import { getSscCglDashboard, getSscTopics } from "@/lib/ssc-cgl";
import { getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import { sscCglSubjectDefinitions } from "@/lib/ssc-cgl-subjects";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Tier-I",
  description: "Practice SSC CGL by subject, study the new Quant chapter course, and move into topic drills or full tests.",
  pathname: "/exams/ssc-cgl"
});

export default function SscCglPage() {
  const dashboard = getSscCglDashboard();
  const quantChapters = getSscQuantBookChapters();
  const groups: CourseNavigationGroup[] = sscCglSubjectDefinitions.map((subject) => {
    const notes = subject.section === "quantitative-aptitude"
      ? quantChapters.map((chapter) => ({
          slug: `ssc-quant-book-${chapter.slug}`,
          title: chapter.title,
          label: chapter.title,
          aliases: [],
          headings: chapter.sections.map((section) => section.title),
          courseCode: "SSC-CGL",
          courseName: "SSC CGL Tier-I",
          week: null,
          excerpt: `${chapter.examples.length} worked examples and ${chapter.exercises.length} source-book exercises.`,
          runnable: false,
          stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: chapter.examples.length, questionBlocks: chapter.exercises.length },
          current: false
        }))
      : getSscTopics()
          .filter((topic) => topic.section === subject.section)
          .map((topic) => ({
            slug: `${subject.notePrefix}${topic.slug}`,
            title: topic.title,
            label: topic.title,
            aliases: [],
            headings: [],
            courseCode: "SSC-CGL",
            courseName: "SSC CGL Tier-I",
            week: null,
            excerpt: topic.study.summary,
            runnable: false,
            stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: topic.practice.questionIds.length },
            current: false
          }));
    return { key: subject.groupKey, label: subject.shortTitle, notes };
  });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", pathname: "/" },
          { name: "Exams", pathname: "/exams" },
          { name: "SSC CGL", pathname: "/exams/ssc-cgl" }
        ])}
      />
      <SscCglLibraryLanding
        groups={groups}
        corpus={{
          reviewedQuestions: dashboard.readiness.reviewedQuestions,
          fullMocks: dashboard.readiness.fullMocks,
          sections: dashboard.readiness.sectionReadiness.map((section) => ({
            section: section.section,
            title: section.title,
            reviewedQuestions: section.reviewedQuestions,
            bookBackedQuestions: section.bookBackedQuestions,
            drillHref: section.drillHref
          }))
        }}
      />
    </>
  );
}
