import { CatQuantLanding } from "@/components/CatQuantLanding";
import { getCatQuantQuestions, getCatQuantTopics } from "@/lib/cat";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "CAT Quantitative Aptitude",
  description: "Study CAT Quant chapter notes and practice the complete reviewed Quantum CAT question bank.",
  pathname: "/exams/cat/quant"
});

export default function CatQuantPage() {
  return <CatQuantLanding topics={getCatQuantTopics()} questionCount={getCatQuantQuestions().length} />;
}
