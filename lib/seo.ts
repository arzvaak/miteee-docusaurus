import type { Metadata } from "next";
import { cleanInlineMarkdown, type Course, type Note } from "@/lib/content";
import { truncateText } from "@/lib/text";

export const SITE_NAME = "MITEEE";
export const SITE_URL = "https://note.arzvak.com";
export const DEFAULT_SITE_DESCRIPTION =
  "A calm MITEEE, SSC CGL, and UPSC study library for notes, formulas, question banks, practice, and revision.";

const DEFAULT_IMAGE = "/img/miteee-social-card.png";

type BreadcrumbItem = {
  name: string;
  pathname: string;
};

type MetadataInput = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(pathname: string) {
  if (!pathname || pathname === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function seoDescription(value: string, fallback = DEFAULT_SITE_DESCRIPTION) {
  const cleaned = cleanInlineMarkdown(value || fallback)
    .replace(/\s*(?:Table of Contents|Quick Navigation):[\s\S]*$/i, "")
    .trim();
  return truncateText(cleaned || fallback, 158);
}

export function courseDescription(course: Course) {
  const summary = course.syllabusSummary.find((item) => item.length > 48);
  const practiceCount = course.questionCount + (course.practicePromptCount ?? 0);
  const practiceLabel = (course.practicePromptCount ?? 0) > 0 ? "practice prompts" : "question sections";
  return seoDescription(
    summary ||
      `${course.name} (${course.code}) dashboard with ${course.noteCount} notes, ${practiceCount} ${practiceLabel}, and exam-focused study material.`
  );
}

export function noteDescription(note: Note | Omit<Note, "content">) {
  const signals = [
    note.stats.questionBlocks > 0 ? `${note.stats.questionBlocks} question sections` : "",
    note.stats.mathBlocks > 0 ? `${note.stats.mathBlocks} math blocks` : "",
    note.stats.mermaidBlocks > 0 ? `${note.stats.mermaidBlocks} diagrams` : ""
  ].filter(Boolean);
  return seoDescription(`${note.title} study note${note.courseName ? ` for ${note.courseName}` : ""}.${signals.length ? ` Includes ${signals.join(", ")}.` : ""}`);
}

export function buildPageMetadata({ title, description, pathname, image = DEFAULT_IMAGE, noIndex = false }: MetadataInput): Metadata {
  const cleanDescription = seoDescription(description);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: cleanDescription,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description: cleanDescription,
      url: pathname,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} dashboard` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [image]
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    category: "education"
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: DEFAULT_SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` }
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/img/app-icon.png")
      }
    ]
  };
}

export function buildCourseListJsonLd(courses: Course[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        url: absoluteUrl(`/courses/${course.code}`),
        name: course.name,
        description: courseDescription(course),
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL }
      }
    }))
  };
}

export function buildCourseJsonLd(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: courseDescription(course),
    url: absoluteUrl(`/courses/${course.code}`),
    courseCode: course.code,
    educationalLevel: course.level,
    provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL }
  };
}

export function buildNoteJsonLd(note: Note) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: note.sidebarLabel || note.title,
    description: noteDescription(note),
    url: absoluteUrl(`/notes/${note.slug}`),
    inLanguage: "en-IN",
    learningResourceType: "Study note",
    about: [note.courseName, note.courseCode, ...note.tags].filter(Boolean),
    isPartOf: {
      "@type": "Course",
      name: note.courseName || note.courseCode || SITE_NAME,
      courseCode: note.courseCode || undefined,
      url: note.courseCode ? absoluteUrl(`/courses/${note.courseCode}`) : SITE_URL
    }
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname)
    }))
  };
}
