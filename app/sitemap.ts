import type { MetadataRoute } from "next";
import { getAllCourses, getNotesIndex } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { getSscTopics } from "@/lib/ssc-cgl";
import { getCatQuantTopics } from "@/lib/cat";
import { getGateTopics } from "@/lib/gate";
import { getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import { sscCglSubjectDefinitions, sscCglSubjectHref } from "@/lib/ssc-cgl-subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sscTopicNoteSlugs = new Set(
    sscCglSubjectDefinitions.flatMap((subject) =>
      getSscTopics()
        .filter((topic) => topic.section === subject.section)
        .map((topic) => `${subject.notePrefix}${topic.slug}`)
    )
  );
  return [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/courses`, lastModified: now },
    { url: `${SITE_URL}/exams`, lastModified: now },
    { url: `${SITE_URL}/exams/cat`, lastModified: now },
    { url: `${SITE_URL}/exams/cat/quant`, lastModified: now },
    { url: `${SITE_URL}/exams/cat/quant/practice`, lastModified: now },
    { url: `${SITE_URL}/exams/gate`, lastModified: now },
    { url: `${SITE_URL}/exams/gate/ee`, lastModified: now },
    { url: `${SITE_URL}/exams/gate/ee/practice`, lastModified: now },
    { url: `${SITE_URL}/exams/gate/da`, lastModified: now },
    { url: `${SITE_URL}/exams/gate/da/practice`, lastModified: now },
    { url: `${SITE_URL}/exams/ssc-cgl`, lastModified: now },
    { url: `${SITE_URL}/notes/research-valorant-preliminary-findings-index`, lastModified: now },
    ...getAllCourses()
      .filter((course) => !["SSC-CGL", "MITEEE", "SUPERPOWERS"].includes(course.code))
      .map((course) => ({ url: `${SITE_URL}/courses/${course.code}`, lastModified: now })),
    ...sscCglSubjectDefinitions.map((subject) => ({
      url: `${SITE_URL}${sscCglSubjectHref(subject.section)}`,
      lastModified: now
    })),
    ...getSscTopics().map((topic) => ({
      url: `${SITE_URL}/exams/ssc-cgl/practice/${topic.slug}`,
      lastModified: now
    })),
    ...getSscQuantBookChapters().flatMap((chapter) => ([
      {
        url: `${SITE_URL}/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${chapter.slug}`,
        lastModified: now
      },
      {
        url: `${SITE_URL}/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${chapter.slug}/practice`,
        lastModified: now
      }
    ])),
    ...getCatQuantTopics().flatMap((topic) => ([
      { url: `${SITE_URL}/exams/cat/quant/topics/${topic.slug}`, lastModified: now },
      { url: `${SITE_URL}/exams/cat/quant/practice/${topic.slug}`, lastModified: now }
    ])),
    ...(["EE", "DA"] as const).flatMap((subject) =>
      getGateTopics(subject)
        .filter((topic) => (topic.questionCount ?? topic.questionIds.length) > 0)
        .map((topic) => ({
          url: `${SITE_URL}/exams/gate/${subject.toLowerCase()}/practice/${topic.slug}`,
          lastModified: now
        }))
    ),
    ...getNotesIndex()
      .filter((note) => !sscTopicNoteSlugs.has(note.slug))
      .map((note) => ({ url: `${SITE_URL}/notes/${note.slug}`, lastModified: now }))
  ];
}
