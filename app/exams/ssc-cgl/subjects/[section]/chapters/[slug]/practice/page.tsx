import { notFound } from "next/navigation";
import { SscQuantBookPracticeClient } from "@/components/SscQuantBookPracticeClient";
import { getSscQuantBookChapter } from "@/lib/ssc-quant-book";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const chapter = section === "quantitative-aptitude" ? getSscQuantBookChapter(slug) : null;
  return buildPageMetadata({ title: chapter ? `${chapter.title} Practice · SSC CGL Quant` : "SSC CGL Quant Practice", description: chapter ? `Practice the ${chapter.title} chapter with saved progress and answer-key reveals.` : "SSC CGL Quantitative Aptitude chapter practice.", pathname: `/exams/ssc-cgl/subjects/${section}/chapters/${slug}/practice` });
}
export default async function SscQuantBookPracticePage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  if (section !== "quantitative-aptitude") notFound();
  const chapter = getSscQuantBookChapter(slug);
  if (!chapter) notFound();
  return <SscQuantBookPracticeClient chapter={chapter} />;
}
