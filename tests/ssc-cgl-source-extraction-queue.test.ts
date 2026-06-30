import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_source_extraction_queue.py");

test("SSC CGL source extraction queue separates direct HTML jobs from listed-only leads", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-source-queue-"));
  const candidatesPath = path.join(tempRoot, "resource-candidates.json");
  const outputPath = path.join(tempRoot, "queue.json");

  fs.writeFileSync(candidatesPath, JSON.stringify({
    generatedAt: "2026-06-26T00:00:00Z",
    candidates: [
      {
        id: "sscportal-cgl-model-questions-maths-set-3",
        sourceId: "sscportal-cgl-model-questions",
        sourceType: "original_practice",
        title: "Model Questions for SSC CGL Tier-1 Maths Set-3",
        url: "https://sscportal.in/cgl/tier-1/model-questions/maths-set-3",
        tags: ["sscportal", "tier-1", "model-practice-lead", "maths", "set-3"],
        snippet: "Direct HTML set."
      },
      {
        id: "sscportal-cgl-model-questions-maths-set-31",
        sourceId: "sscportal-cgl-model-questions",
        sourceType: "original_practice",
        title: "Model Questions for SSC CGL Tier-1 Maths Set-31",
        url: "https://sscportal.in/cgl/tier-1/model-questions#listed-set-31",
        tags: ["sscportal", "tier-1", "model-practice-lead", "maths", "set-31"],
        snippet: "Listed set without direct link."
      },
      {
        id: "drishti-pdf-2023",
        sourceId: "ssc-drishti-cgl-pyq-pdf",
        sourceType: "web_pdf_unverified",
        title: "SSC CGL 2023 PDF",
        url: "https://www.sscdrishti.com/example.pdf",
        tags: ["pyq", "pdf"]
      },
      {
        id: "sscportal-navigation",
        sourceId: "sscportal-cgl-model-questions",
        sourceType: "original_practice",
        title: "SSC Portal Home",
        url: "https://sscportal.in/",
        tags: ["navigation"]
      }
    ]
  }, null, 2), "utf8");

  execFileSync("python", [
    scriptPath,
    "--candidates-path", candidatesPath,
    "--output-path", outputPath,
    "--output-root", path.join(tempRoot, "ocr-review"),
    "--source-id", "sscportal-cgl-model-questions",
    "--required-tag", "model-practice-lead"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const report = JSON.parse(fs.readFileSync(outputPath, "utf8")) as {
    sourceId: string;
    requiredTag: string;
    totalCandidates: number;
    consideredCandidates: number;
    readyForHtmlExtraction: number;
    listedWithoutDirectUrl: number;
    items: Array<{
      candidateId: string;
      status: string;
      rankedEligible: boolean;
      htmlExtractCommand?: string[];
      segmentCommand?: string[];
      outputReportPath?: string;
    }>;
  };

  assert.equal(report.sourceId, "sscportal-cgl-model-questions");
  assert.equal(report.requiredTag, "model-practice-lead");
  assert.equal(report.totalCandidates, 4);
  assert.equal(report.consideredCandidates, 2);
  assert.equal(report.readyForHtmlExtraction, 1);
  assert.equal(report.listedWithoutDirectUrl, 1);
  assert.equal(report.items.length, 2);

  const direct = report.items.find((item) => item.candidateId === "sscportal-cgl-model-questions-maths-set-3");
  assert.equal(direct?.status, "ready_for_html_extraction");
  assert.equal(direct?.rankedEligible, false);
  assert.deepEqual(direct?.htmlExtractCommand?.slice(0, 2), ["python", "scripts/ssc_cgl_html_extract.py"]);
  assert.match(direct?.htmlExtractCommand?.join(" ") ?? "", /--source-url https:\/\/sscportal\.in\/cgl\/tier-1\/model-questions\/maths-set-3/);
  assert.match(direct?.outputReportPath ?? "", /ocr-review/);
  assert.ok(direct?.segmentCommand?.includes("scripts/ssc_cgl_segment_questions.py"));

  const listed = report.items.find((item) => item.candidateId === "sscportal-cgl-model-questions-maths-set-31");
  assert.equal(listed?.status, "listed_without_direct_url");
  assert.equal(listed?.rankedEligible, false);
  assert.equal(listed?.htmlExtractCommand, undefined);
  assert.equal(listed?.segmentCommand, undefined);
});
