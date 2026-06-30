import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_agent_answer_key.py");

test("SSC CGL agent answer-key helper prepares review-only solve packets", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-agent-answer-"));
  const candidatesPath = path.join(tempRoot, "question-candidates.json");
  const outputRoot = path.join(tempRoot, "agent-answer-key");

  fs.writeFileSync(candidatesPath, JSON.stringify([
    {
      id: "candidate-one",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 1,
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
      provenance: { sourceId: "fixture-paper", sourceType: "web_pdf_unverified", pageNumber: 1 }
    },
    {
      id: "candidate-two",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 1,
      questionNumber: "2",
      stem: "Incomplete OCR block",
      options: [{ id: "a", text: "Only one option" }],
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    },
    {
      id: "candidate-three",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 2,
      questionNumber: "3",
      stem: "Already aligned elsewhere",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      reviewStatus: "needs_topic_duplicate_review",
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    scriptPath,
    "--candidates", candidatesPath,
    "--providers", "deepseek,mistral,gpt",
    "--output-root", outputRoot,
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const packets = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-answer-key-packets.json"), "utf8")) as Array<{
    questionId: string;
    provider: string;
    status: string;
    prompt: string;
    rankedEligible: boolean;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-answer-key-report.json"), "utf8")) as {
    totalCandidates: number;
    solveItems: number;
    providerCalls: number;
    decisionsAccepted: number;
    consensusAnswers: number;
    rankedEligible: boolean;
  };

  assert.equal(report.totalCandidates, 3);
  assert.equal(report.solveItems, 1);
  assert.equal(report.providerCalls, 3);
  assert.equal(report.decisionsAccepted, 0);
  assert.equal(report.consensusAnswers, 0);
  assert.equal(report.rankedEligible, false);
  assert.equal(packets.length, 3);
  assert.equal(packets.every((packet) => packet.questionId === "candidate-one"), true);
  assert.equal(packets.every((packet) => packet.status === "queued_dry_run"), true);
  assert.equal(packets.every((packet) => packet.rankedEligible === false), true);
  assert.match(packets[0]!.prompt, /solve the MCQ/i);
  assert.match(packets[0]!.prompt, /not an official answer key/i);
  assert.match(packets[0]!.prompt, /strict JSON/i);
});

test("SSC CGL agent answer-key helper accepts only consensus review suggestions", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_agent_answer_key", Path("scripts/ssc_cgl_agent_answer_key.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
decisions = [
    module.parse_decision("q1", "deepseek", json.dumps({
        "questionId": "q1",
        "provider": "deepseek",
        "correctOption": "b",
        "confidence": 0.84,
        "explanation": "Article 14 gives equality before law.",
        "methodTags": ["polity"],
        "flags": []
    })),
    module.parse_decision("q1", "mistral", json.dumps({
        "questionId": "q1",
        "provider": "mistral",
        "correctOption": "b",
        "confidence": 0.81,
        "explanation": "Article 14 is the equality article.",
        "methodTags": ["polity"],
        "flags": []
    })),
    module.parse_decision("q1", "gpt", json.dumps({
        "questionId": "q1",
        "provider": "gpt",
        "correctOption": "c",
        "confidence": 0.42,
        "explanation": "Low confidence.",
        "methodTags": [],
        "flags": ["uncertain"]
    })),
    module.parse_decision("q2", "mistral", json.dumps({
        "questionId": "wrong-id",
        "provider": "mistral",
        "correctOption": "d",
        "confidence": 0.9,
        "explanation": "Invalid because id mismatch.",
        "methodTags": [],
        "flags": []
    }))
]
consensus = module.build_consensus([decision for decision in decisions if decision], min_agree=2, min_confidence=0.7)
print(json.dumps({"decisions": decisions, "consensus": consensus}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    decisions: Array<null | { questionId: string; correctOption: string; rankedEligible: boolean }>;
    consensus: Array<{ questionNumber: string; correctOption: string; sourceType: string; reviewStatus: string; rankedEligible: boolean }>;
  };

  assert.equal(result.decisions.filter(Boolean).length, 3);
  assert.equal(result.decisions[3], null);
  assert.equal(result.consensus.length, 1);
  assert.equal(result.consensus[0]?.questionNumber, "q1");
  assert.equal(result.consensus[0]?.correctOption, "b");
  assert.equal(result.consensus[0]?.sourceType, "agent_answer_suggestion");
  assert.equal(result.consensus[0]?.reviewStatus, "needs_official_or_agent_consensus_review");
  assert.equal(result.consensus[0]?.rankedEligible, false);
});

test("SSC CGL agent answer-key helper can resume and merge the next unsolved item", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-agent-answer-resume-"));
  const candidatesPath = path.join(tempRoot, "question-candidates.json");
  const outputRoot = path.join(tempRoot, "agent-answer-key");
  fs.mkdirSync(outputRoot, { recursive: true });

  fs.writeFileSync(candidatesPath, JSON.stringify([
    {
      id: "candidate-one",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 1,
      questionNumber: "1",
      stem: "First valid solved item?",
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
      id: "candidate-two",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 1,
      questionNumber: "2",
      stem: "Second valid unsolved item?",
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
      id: "candidate-three",
      sourceId: "fixture-paper",
      sourceType: "web_pdf_unverified",
      pageNumber: 2,
      questionNumber: "3",
      stem: "Third valid item should wait?",
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

  fs.writeFileSync(path.join(outputRoot, "agent-answer-key-packets.json"), JSON.stringify([
    {
      questionId: "candidate-one",
      questionNumber: "1",
      provider: "deepseek",
      model: "fixture-model",
      status: "completed",
      prompt: "existing prompt",
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    scriptPath,
    "--candidates", candidatesPath,
    "--providers", "deepseek,mistral",
    "--output-root", outputRoot,
    "--max-items", "1",
    "--merge-existing",
    "--skip-existing",
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const packets = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-answer-key-packets.json"), "utf8")) as Array<{
    questionId: string;
    provider: string;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "agent-answer-key-report.json"), "utf8")) as {
    solveItems: number;
    providerCalls: number;
    consensusAnswers: number;
  };

  assert.deepEqual(packets.map((packet) => `${packet.questionId}:${packet.provider}`), [
    "candidate-one:deepseek",
    "candidate-two:deepseek",
    "candidate-two:mistral"
  ]);
  assert.equal(report.solveItems, 2);
  assert.equal(report.providerCalls, 3);
  assert.equal(report.consensusAnswers, 0);
});

test("SSC CGL agent answer-key helper stays review-only", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /agent_answer_suggestion/);
  assert.match(script, /needs_official_or_agent_consensus_review/);
  assert.match(script, /rankedEligible.*False/s);
  assert.doesNotMatch(script, /reviewStatus.*reviewed/);
});
