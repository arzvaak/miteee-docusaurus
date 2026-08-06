import { SscEndlessStatboard } from "@/components/SscEndlessStatboard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "My SSC CGL Statboard",
  description: "Review your endless SSC CGL accuracy, missed questions, and marked repair queue.",
  pathname: "/exams/ssc-cgl/statboard"
});

export default function SscCglStatboardPage() {
  return <SscEndlessStatboard />;
}
