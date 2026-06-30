import { Section50Cockpit } from "@/app/exams/ssc-cgl/Section50Cockpit";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Reasoning 50/50 Cockpit",
  description: "A 15-minute Reasoning practice cockpit for SSC CGL Tier-I 50/50 scoring.",
  pathname: "/exams/ssc-cgl/reasoning-50"
});

export default function SscCglReasoning50Page() {
  return (
    <Section50Cockpit
      section="reasoning"
      eyebrow="General Intelligence and Reasoning"
      heading="Reasoning 50/50 cockpit."
      lede="The reasoning target is clean pattern recognition under the section clock: 25 questions, 50 marks, no ego battles with one trap."
      speedTitle="Run the 25-question Reasoning sprint"
      speedBody="Finish the section inside 15 minutes. Skip any item where the rule is not visible by the 30-second mark."
      repairTopicSlug="analogy-classification"
      repairBody="Open the misses queue, name the exact rule family, and repeat until traps stop looking similar."
      depthBody="Work the largest reasoning queue first, then rotate to arrangements, coding, direction, and conclusion traps."
      accent="reasoning"
    />
  );
}
