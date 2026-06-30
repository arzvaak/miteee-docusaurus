import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_align_answer_key.py");

test("SSC CGL answer-key aligner promotes only matched review candidates", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-align-"));
  const candidatesPath = path.join(tempRoot, "question-candidates.json");
  const answerKeyPath = path.join(tempRoot, "answer-key.json");
  const outputRoot = path.join(tempRoot, "aligned");

  fs.writeFileSync(candidatesPath, JSON.stringify([
    {
      id: "candidate-one",
      sourceId: "fixture-source",
      sourceType: "official_open",
      pageNumber: 1,
      questionNumber: "1",
      stem: "Which article deals with equality before law?",
      options: [
        { id: "a", text: "Article 12" },
        { id: "b", text: "Article 14" },
        { id: "c", text: "Article 19" },
        { id: "d", text: "Article 21" }
      ],
      answerKeyCandidate: "b",
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", pageNumber: 1 }
    },
    {
      id: "candidate-two",
      sourceId: "fixture-source",
      sourceType: "official_open",
      pageNumber: 1,
      questionNumber: "2",
      stem: "If 20% of a number is 50, the number is:",
      options: [
        { id: "a", text: "100" },
        { id: "b", text: "150" },
        { id: "c", text: "250" },
        { id: "d", text: "300" }
      ],
      answerKeyCandidate: "c",
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false,
      provenance: { sourceId: "fixture-source", pageNumber: 1 }
    }
  ], null, 2));

  fs.writeFileSync(answerKeyPath, JSON.stringify({
    sourceId: "fixture-source-answer-key",
    answers: [
      { questionNumber: "1", correctOption: "b", explanation: "Article 14 gives equality before law." },
      { questionNumber: "2", correctOption: "d", explanation: "Intentional mismatch for review." }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--candidates", candidatesPath,
    "--answer-key", answerKeyPath,
    "--output-root", outputRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "alignment-report.json"), "utf8")) as {
    totalCandidates: number;
    matched: number;
    mismatched: number;
    missing: number;
    rankedEligible: boolean;
  };
  const aligned = JSON.parse(fs.readFileSync(path.join(outputRoot, "aligned-candidates.json"), "utf8")) as Array<{
    id: string;
    correctOption: string | null;
    reviewStatus: string;
    rankedEligible: boolean;
    alignmentStatus: string;
  }>;

  assert.equal(report.totalCandidates, 2);
  assert.equal(report.matched, 1);
  assert.equal(report.mismatched, 1);
  assert.equal(report.missing, 0);
  assert.equal(report.rankedEligible, false);
  assert.equal(aligned[0]?.correctOption, "b");
  assert.equal(aligned[0]?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(aligned[0]?.rankedEligible, false);
  assert.equal(aligned[0]?.alignmentStatus, "matched");
  assert.equal(aligned[1]?.reviewStatus, "answer_key_mismatch");
  assert.equal(aligned[1]?.rankedEligible, false);
});

test("SSC CGL answer-key aligner stays review-only", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /needs_topic_duplicate_review/);
  assert.match(script, /answer_key_mismatch/);
  assert.match(script, /rankedEligible.*False/s);
});
