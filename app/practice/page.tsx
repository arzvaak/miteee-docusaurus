import { AnswerPracticeLab } from "@/components/AnswerPracticeLab";
import { buildAnswerPracticePrompts } from "@/lib/answer-practice";
import { getNotesIndex } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Answer Practice - MITEEE Study OS",
  description: "Write closed-book answers from indexed MITEEE and UPSC notes, then diagnose weaknesses with the study coach.",
  pathname: "/practice"
});

export default function PracticePage() {
  return <AnswerPracticeLab prompts={buildAnswerPracticePrompts(getNotesIndex(), 20)} />;
}
