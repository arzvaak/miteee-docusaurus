import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_agent_review.py");

test("SSC CGL agent review runner prepares provider packets without promoting questions", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-agent-review-"));
  const queuePath = path.join(tempRoot, "topic-duplicate-review-candidates.json");
  const outputRoot = path.join(tempRoot, "agent-review");

  fs.writeFileSync(queuePath, JSON.stringify([
    {
      id: "candidate-polity",
      stem: "Which article deals with equality before law?",
      options: [
        { id: "a", text: "Article 12" },
        { id: "b", text: "Article 14" },
        { id: "c", text: "Article 19" },
        { id: "d", text: "Article 21" }
      ],
      correctOption: "b",
      suggestedSection: "general-awareness",
      suggestedTopic: "indian-polity-basics",
      suggestedSubtopic: "Article 14 and equality",
      reviewStatus: "needs_agent_topic_review",
      agentReviewRequired: true,
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", pageNumber: 1 }
    },
    {
      id: "candidate-quarantined",
      stem: "Unmatched answer-key item.",
      reviewStatus: "missing_answer_key",
      agentReviewRequired: false,
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    scriptPath,
    "--queue", queuePath,
    "--providers", "deepseek,mistral,gpt",
    "--output-root", outputRoot,
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const packets = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-review-packets.json"), "utf8")) as Array<{
    questionId: string;
    provider: string;
    status: string;
    prompt: string;
    rankedEligible: boolean;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-review-report.json"), "utf8")) as {
    totalCandidates: number;
    agentReviewItems: number;
    providersRequested: string[];
    providerCalls: number;
    decisionsAccepted: number;
    rankedEligible: boolean;
  };

  assert.equal(report.totalCandidates, 2);
  assert.equal(report.agentReviewItems, 1);
  assert.deepEqual(report.providersRequested, ["deepseek", "mistral", "gpt"]);
  assert.equal(report.providerCalls, 3);
  assert.equal(report.decisionsAccepted, 0);
  assert.equal(report.rankedEligible, false);
  assert.equal(packets.length, 3);
  assert.equal(packets.every((packet) => packet.questionId === "candidate-polity"), true);
  assert.equal(packets.every((packet) => packet.status === "queued_dry_run"), true);
  assert.equal(packets.every((packet) => packet.rankedEligible === false), true);
  assert.match(packets[0].prompt, /supplied evidence only/i);
  assert.match(packets[0].prompt, /strict JSON/i);
  assert.match(packets[0].prompt, /do not invent/i);
});

test("SSC CGL agent review runner can resume and merge the next unreviewed item", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-agent-review-resume-"));
  const queuePath = path.join(tempRoot, "topic-duplicate-review-candidates.json");
  const outputRoot = path.join(tempRoot, "agent-review");
  fs.mkdirSync(outputRoot, { recursive: true });

  fs.writeFileSync(queuePath, JSON.stringify([
    {
      id: "candidate-one",
      stem: "Previously reviewed question?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "a",
      suggestedSection: "quantitative-aptitude",
      suggestedTopic: "number-system",
      suggestedSubtopic: "basic divisibility",
      reviewStatus: "needs_agent_topic_review",
      agentReviewRequired: true,
      rankedEligible: false
    },
    {
      id: "candidate-two",
      stem: "Next unreviewed question?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "b",
      suggestedSection: "quantitative-aptitude",
      suggestedTopic: "percentages",
      suggestedSubtopic: "successive change",
      reviewStatus: "needs_agent_topic_review",
      agentReviewRequired: true,
      rankedEligible: false
    },
    {
      id: "candidate-three",
      stem: "Later question?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "c",
      suggestedSection: "quantitative-aptitude",
      suggestedTopic: "profit-loss-discount",
      suggestedSubtopic: "marked price",
      reviewStatus: "needs_agent_topic_review",
      agentReviewRequired: true,
      rankedEligible: false
    }
  ], null, 2));

  fs.writeFileSync(path.join(outputRoot, "agent-review-packets.json"), JSON.stringify([
    {
      questionId: "candidate-one",
      provider: "deepseek",
      model: "fixture-model",
      reviewStatus: "needs_agent_topic_review",
      status: "completed",
      prompt: "existing prompt",
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    scriptPath,
    "--queue", queuePath,
    "--providers", "deepseek,mistral",
    "--output-root", outputRoot,
    "--max-items", "1",
    "--merge-existing",
    "--skip-existing",
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const packets = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-review-packets.json"), "utf8")) as Array<{
    questionId: string;
    provider: string;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-review-report.json"), "utf8")) as {
    agentReviewItems: number;
    providerCalls: number;
    decisionsAccepted: number;
  };

  assert.deepEqual(packets.map((packet) => `${packet.questionId}:${packet.provider}`), [
    "candidate-one:deepseek",
    "candidate-two:deepseek",
    "candidate-two:mistral"
  ]);
  assert.equal(report.agentReviewItems, 2);
  assert.equal(report.providerCalls, 3);
  assert.equal(report.decisionsAccepted, 0);
});

test("SSC CGL agent review runner is wired for DeepSeek, Mistral, and GPT keys", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /DEEPSEEK_API_KEY/);
  assert.match(script, /MISTRAL_API_KEY/);
  assert.match(script, /OPENAI_API_KEY/);
  assert.match(script, /needs_agent_topic_review/);
  assert.match(script, /needs_agent_duplicate_review/);
  assert.match(script, /rankedEligible.*False/s);
  assert.doesNotMatch(script, /reviewStatus.*reviewed/);
});
