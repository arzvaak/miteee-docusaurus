import { Section50Cockpit } from "@/app/exams/ssc-cgl/Section50Cockpit";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL English 50/50 Cockpit",
  description: "An English Comprehension practice cockpit for SSC CGL Tier-I 50/50 scoring.",
  pathname: "/exams/ssc-cgl/english-50"
});

export default function SscCglEnglish50Page() {
  return (
    <Section50Cockpit
      section="english-comprehension"
      eyebrow="English Comprehension"
      heading="English 50/50 cockpit."
      lede="The English target is rule-first elimination and vocabulary recall: 25 questions, 50 marks, no grammar drift."
      speedTitle="Run the 25-question English sprint"
      speedBody="Read for the tested rule, eliminate by grammar or meaning, and keep passage questions from eating the section clock."
      repairTopicSlug="grammar-error-spotting"
      repairBody="Open the misses queue, tag each miss as grammar, vocabulary, spelling, or reading-flow, then repeat the same rule."
      depthBody="Work the highest-volume English queue first, then rotate grammar, vocabulary, cloze, sentence improvement, and reading."
      accent="english"
    />
  );
}
