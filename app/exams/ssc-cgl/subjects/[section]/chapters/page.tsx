import { notFound } from "next/navigation";
import { SscQuantBookDirectory } from "@/components/SscQuantBookDirectory";
import { getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Quant Chapters",
  description: "Study SSC CGL Quantitative Aptitude chapters from the source PDF and practise each chapter.",
  pathname: "/exams/ssc-cgl/subjects/quantitative-aptitude/chapters"
});

export default async function SscQuantBookChaptersPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section !== "quantitative-aptitude") notFound();
  return <SscQuantBookDirectory chapters={getSscQuantBookChapters()} />;
}
