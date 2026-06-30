import { Section50Cockpit } from "@/app/exams/ssc-cgl/Section50Cockpit";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Quant 50/50 Cockpit",
  description: "A 36-second Quant practice cockpit for SSC CGL Tier-I 50/50 scoring.",
  pathname: "/exams/ssc-cgl/quant-50"
});

export default function SscCglQuant50Page() {
  return (
    <Section50Cockpit
      section="quantitative-aptitude"
      eyebrow="Quantitative Aptitude"
      heading="Quant 50/50 cockpit."
      lede="The maths target is not good accuracy. It is 25 questions, 50 marks, 900 seconds, and zero slow leaks."
      speedTitle="Run the 25-question Quant sprint"
      speedBody="900 seconds. No pausing. Every correct-but-slow item becomes a speed repair."
      repairTopicSlug="calculation-speed"
      repairBody="Open Quant topic practice with the speed-repair queue and repeat until the route is automatic."
      depthBody="Work topic-wise, one question at a time, with instant method, trap, source, and saved progress."
      accent="quant"
    />
  );
}
