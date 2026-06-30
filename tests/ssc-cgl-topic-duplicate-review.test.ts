import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_topic_duplicate_review.py");

test("SSC CGL topic/duplicate helper only prepares an agent review queue", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-topic-review-"));
  const alignedPath = path.join(tempRoot, "aligned-candidates.json");
  const topicRulesPath = path.join(tempRoot, "topic-rules.json");
  const existingPath = path.join(tempRoot, "existing-questions.json");
  const outputRoot = path.join(tempRoot, "topic-review");

  fs.writeFileSync(alignedPath, JSON.stringify([
    {
      id: "candidate-polity",
      sourceId: "fixture-source",
      sourceType: "official_open",
      sourceUrl: "https://ssc.gov.in/example.pdf",
      pageNumber: 1,
      questionNumber: "1",
      stem: "Which article deals with equality before law?",
      options: [
        { id: "a", text: "Article 12" },
        { id: "b", text: "Article 14" },
        { id: "c", text: "Article 19" },
        { id: "d", text: "Article 21" }
      ],
      correctOption: "b",
      explanation: "Article 14 gives equality before law.",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", sourceType: "official_open", pageNumber: 1 }
    },
    {
      id: "candidate-duplicate",
      sourceId: "fixture-source",
      sourceType: "official_open",
      pageNumber: 1,
      questionNumber: "2",
      stem: "Which article deals with equality before law?",
      options: [
        { id: "a", text: "Article 12" },
        { id: "b", text: "Article 14" },
        { id: "c", text: "Article 19" },
        { id: "d", text: "Article 21" }
      ],
      correctOption: "b",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", sourceType: "official_open", pageNumber: 1 }
    },
    {
      id: "candidate-unknown",
      sourceId: "fixture-source",
      sourceType: "official_open",
      pageNumber: 2,
      questionNumber: "3",
      stem: "A vague question without recognizable SSC topic keywords.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "a",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", sourceType: "official_open", pageNumber: 2 }
    }
  ], null, 2));

  fs.writeFileSync(topicRulesPath, JSON.stringify({
    topics: [
      {
        topic: "indian-polity-basics",
        subtopic: "Article 14 and equality",
        section: "general-awareness",
        difficulty: "medium",
        keywords: ["article", "equality before law", "constitution"]
      }
    ]
  }, null, 2));

  fs.writeFileSync(existingPath, JSON.stringify({
    questions: [
      {
        id: "existing-other-question",
        stem: "Which body conducts the SSC CGL exam?"
      }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--aligned", alignedPath,
    "--topic-rules", topicRulesPath,
    "--existing-questions", existingPath,
    "--output-root", outputRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reviewed = JSON.parse(fs.readFileSync(path.join(outputRoot, "topic-duplicate-review-candidates.json"), "utf8")) as Array<{
    id: string;
    suggestedTopic?: string;
    suggestedSection?: string;
    reviewStatus: string;
    suggestedDuplicateOf?: string;
    agentReviewRequired: boolean;
    rankedEligible: boolean;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "topic-duplicate-review-report.json"), "utf8")) as {
    totalCandidates: number;
    topicSuggestions: number;
    duplicateSuggestions: number;
    agentReviewRequired: number;
    rankedEligible: boolean;
  };

  assert.equal(report.totalCandidates, 3);
  assert.equal(report.topicSuggestions, 2);
  assert.equal(report.duplicateSuggestions, 1);
  assert.equal(report.agentReviewRequired, 3);
  assert.equal(report.rankedEligible, false);
  assert.equal(reviewed.find((item) => item.id === "candidate-polity")?.suggestedTopic, "indian-polity-basics");
  assert.equal(reviewed.find((item) => item.id === "candidate-polity")?.reviewStatus, "needs_agent_topic_review");
  assert.equal(reviewed.find((item) => item.id === "candidate-polity")?.agentReviewRequired, true);
  assert.equal(reviewed.find((item) => item.id === "candidate-duplicate")?.reviewStatus, "needs_agent_duplicate_review");
  assert.equal(reviewed.find((item) => item.id === "candidate-duplicate")?.suggestedDuplicateOf, "candidate-polity");
  assert.equal(reviewed.find((item) => item.id === "candidate-unknown")?.reviewStatus, "needs_agent_topic_review");
  assert.equal(reviewed.every((item) => item.rankedEligible === false), true);
});

test("SSC CGL topic/duplicate reviewer remains a review-only stage", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /needs_agent_topic_review/);
  assert.match(script, /needs_agent_duplicate_review/);
  assert.match(script, /agentReviewRequired/);
  assert.match(script, /rankedEligible.*False/s);
  assert.doesNotMatch(script, /reviewStatus.*reviewed/);
});

test("SSC CGL topic/duplicate helper prioritizes uploaded-book chapter slugs over incidental keywords", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-topic-chapter-slug-"));
  const alignedPath = path.join(tempRoot, "aligned-candidates.json");
  const topicRulesPath = path.join(tempRoot, "topic-rules.json");
  const existingPath = path.join(tempRoot, "existing-questions.json");
  const outputRoot = path.join(tempRoot, "topic-review");

  fs.writeFileSync(alignedPath, JSON.stringify([
    {
      id: "candidate-algebra",
      sourceId: "ssc-maths-6800-mcq",
      sourceType: "book_user_provided",
      chapterSlug: "algebra",
      chapterTitle: "Algebra",
      pageNumber: 254,
      questionNumber: "1",
      stem: "Simplify the cubic equation and find the sum of roots.",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" }
      ],
      correctOption: "d",
      alignmentStatus: "agent_consensus_matched",
      reviewStatus: "needs_topic_duplicate_review",
      rankedEligible: false,
      provenance: {
        sourceId: "ssc-maths-6800-mcq",
        sourceType: "book_user_provided",
        chapterSlug: "algebra",
        chapterTitle: "Algebra",
        pageNumber: 254
      }
    }
  ], null, 2));

  fs.writeFileSync(topicRulesPath, JSON.stringify({
    topics: [
      {
        id: "simplification",
        topic: "simplification",
        section: "quantitative-aptitude",
        difficulty: "medium",
        keywords: ["simplify", "value of"]
      },
      {
        id: "algebra",
        topic: "algebra",
        section: "quantitative-aptitude",
        difficulty: "medium",
        chapterSlugs: ["algebra"],
        keywords: ["equation", "root"]
      }
    ]
  }, null, 2));
  fs.writeFileSync(existingPath, JSON.stringify({ questions: [] }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--aligned", alignedPath,
    "--topic-rules", topicRulesPath,
    "--existing-questions", existingPath,
    "--output-root", outputRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reviewed = JSON.parse(fs.readFileSync(path.join(outputRoot, "topic-duplicate-review-candidates.json"), "utf8")) as Array<{
    id: string;
    suggestedTopic?: string;
    topicRuleId?: string;
    rankedEligible: boolean;
  }>;

  assert.equal(reviewed[0]?.suggestedTopic, "algebra");
  assert.equal(reviewed[0]?.topicRuleId, "algebra");
  assert.equal(reviewed[0]?.rankedEligible, false);
});

test("SSC CGL topic rules include Quant Number System for uploaded Maths book imports", () => {
  const topicRules = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "exams", "ssc-cgl", "topic-rules.json"), "utf8")) as {
    topics: Array<{ id?: string; topic?: string; section?: string; keywords?: string[]; chapterSlugs?: string[] }>;
  };
  const numberSystem = topicRules.topics.find((topic) => topic.id === "number-system");

  assert.ok(numberSystem, "number-system topic rule is required for the first uploaded Maths book chapter");
  assert.equal(numberSystem?.section, "quantitative-aptitude");
  assert.ok(numberSystem?.chapterSlugs?.includes("number-system"));
  assert.ok(numberSystem?.keywords?.some((keyword) => /prime/i.test(keyword)));
  assert.ok(numberSystem?.keywords?.some((keyword) => /binary/i.test(keyword)));
});

test("SSC CGL topic rules include the next uploaded Maths book chapters", () => {
  const topicRules = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "exams", "ssc-cgl", "topic-rules.json"), "utf8")) as {
    topics: Array<{ id?: string; section?: string; keywords?: string[]; chapterSlugs?: string[] }>;
  };
  const byId = new Map(topicRules.topics.map((topic) => [topic.id, topic]));

  for (const id of [
    "hcf-and-lcm",
    "simplification",
    "trigonometry",
    "algebra",
    "geometry-mensuration",
    "percentages",
    "ratio-proportion",
    "averages-mixtures-alligation",
    "profit-loss-discount",
    "simple-compound-interest",
    "time-work-pipes",
    "time-speed-distance",
    "data-interpretation",
    "probability"
  ]) {
    assert.equal(byId.get(id)?.section, "quantitative-aptitude");
  }
  assert.ok(byId.get("trigonometry")?.chapterSlugs?.includes("height-and-distance"));
  assert.ok(byId.get("geometry-mensuration")?.chapterSlugs?.includes("mensuration"));
  assert.ok(byId.get("geometry-mensuration")?.chapterSlugs?.includes("geometry"));
  assert.ok(byId.get("algebra")?.chapterSlugs?.includes("algebra"));
  assert.ok(byId.get("percentages")?.chapterSlugs?.includes("percentage"));
  assert.ok(byId.get("ratio-proportion")?.chapterSlugs?.includes("partnership"));
  assert.ok(byId.get("averages-mixtures-alligation")?.chapterSlugs?.includes("mixture-and-alligation"));
  assert.ok(byId.get("averages-mixtures-alligation")?.chapterSlugs?.includes("mean-median-mode"));
  assert.ok(byId.get("profit-loss-discount")?.chapterSlugs?.includes("discount"));
  assert.ok(byId.get("simple-compound-interest")?.chapterSlugs?.includes("installment"));
  assert.ok(byId.get("time-work-pipes")?.chapterSlugs?.includes("pipe-and-cistern"));
  assert.ok(byId.get("time-speed-distance")?.chapterSlugs?.includes("linear-circular-race"));
  assert.ok(byId.get("time-speed-distance")?.chapterSlugs?.includes("boat-and-stream"));
  assert.ok(byId.get("data-interpretation")?.chapterSlugs?.includes("data-interpretation"));
  assert.ok(byId.get("probability")?.chapterSlugs?.includes("probability"));
  assert.ok(byId.get("hcf-and-lcm")?.keywords?.some((keyword) => /lcm/i.test(keyword)));
  assert.ok(byId.get("simplification")?.keywords?.some((keyword) => /bodmas/i.test(keyword)));
  assert.ok(byId.get("trigonometry")?.keywords?.some((keyword) => /sin/i.test(keyword)));
});
