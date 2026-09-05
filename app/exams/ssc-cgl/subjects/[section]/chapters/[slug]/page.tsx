import { notFound } from "next/navigation";
import { SscQuantBookChapterReader } from "@/components/SscQuantBookChapterReader";
import { getSscQuantBookChapter, getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getSscQuantBookChapters().map((chapter) => ({ section: "quantitative-aptitude", slug: chapter.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const chapter = section === "quantitative-aptitude" ? getSscQuantBookChapter(slug) : null;
  return buildPageMetadata({ title: chapter ? `${chapter.title} · SSC CGL Quant` : "SSC CGL Quant Chapter", description: chapter ? `Study ${chapter.title} for SSC CGL Quantitative Aptitude.` : "SSC CGL Quantitative Aptitude chapter notes.", pathname: `/exams/ssc-cgl/subjects/${section}/chapters/${slug}` });
}

export default async function SscQuantBookChapterPage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  if (section !== "quantitative-aptitude") notFound();
  const chapters = getSscQuantBookChapters();
  const chapter = getSscQuantBookChapter(slug);
  if (!chapter) notFound();
  const index = chapters.findIndex((item) => item.slug === slug);
  return <SscQuantBookChapterReader chapter={chapter} previousSlug={chapters[index - 1]?.slug} nextSlug={chapters[index + 1]?.slug} />;
}
