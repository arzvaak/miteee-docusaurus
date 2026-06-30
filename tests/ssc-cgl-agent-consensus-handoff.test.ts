import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const handoffScript = path.join(process.cwd(), "scripts", "ssc_cgl_apply_agent_answer_consensus.py");

test("SSC CGL agent consensus handoff creates only review-stage aligned candidates", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-agent-consensus-"));
  const candidatesPath = path.join(tempRoot, "question-candidates.json");
  const consensusPath = path.join(tempRoot, "agent-answer-key-consensus.json");
  const outputRoot = path.join(tempRoot, "aligned");

  fs.writeFileSync(candidatesPath, JSON.stringify([
    {
      id: "q1",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      questionNumber: "1",
      stem: "Which article deals with equality before law?",
      options: [
        { id: "a", text: "Article 12" },
        { id: "b", text: "Article 14" },
        { id: "c", text: "Article 19" },
        { id: "d", text: "Article 21" }
      ],
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-paper", pageNumber: 1 }
    },
    {
      id: "q2",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      questionNumber: "2",
      stem: "Low-confidence consensus should not pass.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    },
    {
      id: "q3",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      questionNumber: "3",
      stem: "No agent consensus exists.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    }
  ], null, 2));

  fs.writeFileSync(consensusPath, JSON.stringify([
    {
      questionId: "q1",
      questionNumber: "1",
      correctOption: "b",
      sourceType: "agent_answer_suggestion",
      reviewStatus: "needs_official_or_agent_consensus_review",
      agreementCount: 2,
      averageConfidence: 0.82,
      providers: ["deepseek", "mistral"],
      explanations: [
        { provider: "deepseek", explanation: "Article 14 gives equality before law." },
        { provider: "mistral", explanation: "Article 14 is the equality article." }
      ],
      rankedEligible: false
    },
    {
      questionId: "q2",
      questionNumber: "2",
      correctOption: "c",
      sourceType: "agent_answer_suggestion",
      reviewStatus: "needs_official_or_agent_consensus_review",
      agreementCount: 1,
      averageConfidence: 0.93,
      providers: ["deepseek"],
      rankedEligible: false
    },
    {
      questionId: "missing-candidate",
      questionNumber: "99",
      correctOption: "a",
      sourceType: "agent_answer_suggestion",
      reviewStatus: "needs_official_or_agent_consensus_review",
      agreementCount: 2,
      averageConfidence: 0.9,
      providers: ["deepseek", "mistral"],
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    handoffScript,
    "--candidates", candidatesPath,
    "--consensus", consensusPath,
    "--output-root", outputRoot,
    "--min-agree", "2",
    "--min-confidence", "0.7"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(outputRoot, "aligned-candidates.json"), "utf8")) as Array<{
    id: string;
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
    rankedEligible: boolean;
    answerEvidence?: { sourceType: string; providers: string[]; averageConfidence: number };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "alignment-report.json"), "utf8")) as {
    matched: number;
    missing: number;
    rejectedConsensus: number;
    rankedEligible: boolean;
  };

  assert.equal(report.matched, 1);
  assert.equal(report.missing, 2);
  assert.equal(report.rejectedConsensus, 2);
  assert.equal(report.rankedEligible, false);

  assert.equal(aligned[0]?.correctOption, "b");
  assert.equal(aligned[0]?.alignmentStatus, "agent_consensus_matched");
  assert.equal(aligned[0]?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(aligned[0]?.rankedEligible, false);
  assert.equal(aligned[0]?.answerEvidence?.sourceType, "agent_answer_suggestion");
  assert.deepEqual(aligned[0]?.answerEvidence?.providers, ["deepseek", "mistral"]);
  assert.equal(aligned[1]?.alignmentStatus, "missing_agent_consensus");
  assert.equal(aligned[1]?.correctOption, null);
  assert.equal(aligned[2]?.alignmentStatus, "missing_agent_consensus");
});

test("SSC CGL topic duplicate review accepts agent consensus handoff but not promotion", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_topic_duplicate_review", Path("scripts/ssc_cgl_topic_duplicate_review.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
reviewed = module.review_candidates([{
    "id": "q1",
    "stem": "Find the average of first five natural numbers.",
    "options": [{"id": "a", "text": "2"}, {"id": "b", "text": "3"}, {"id": "c", "text": "4"}, {"id": "d", "text": "5"}],
    "correctOption": "b",
    "alignmentStatus": "agent_consensus_matched",
    "reviewStatus": "needs_topic_duplicate_review",
    "answerEvidence": {"sourceType": "agent_answer_suggestion"},
    "rankedEligible": False
}], [{"id": "averages", "section": "quant", "topic": "Averages", "keywords": ["average"]}], {})
print(json.dumps(reviewed, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const reviewed = JSON.parse(output) as Array<{
    reviewStatus: string;
    agentReviewRequired: boolean;
    rankedEligible: boolean;
    suggestedTopic: string;
  }>;

  assert.equal(reviewed[0]?.reviewStatus, "needs_agent_topic_review");
  assert.equal(reviewed[0]?.agentReviewRequired, true);
  assert.equal(reviewed[0]?.rankedEligible, false);
  assert.equal(reviewed[0]?.suggestedTopic, "Averages");
});
