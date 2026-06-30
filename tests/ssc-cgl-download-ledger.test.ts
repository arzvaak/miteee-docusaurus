import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_download_resources.py");

test("SSC CGL downloader saves only official-open PDFs and records skipped restricted sources", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-download-"));
  const sourcePdf = path.join(tempRoot, "official.pdf");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% test pdf\n");

  const manifestPath = path.join(tempRoot, "resource-candidates.json");
  const outputRoot = path.join(tempRoot, "downloads");
  fs.writeFileSync(manifestPath, JSON.stringify({
    generatedAt: "2026-06-25T00:00:00.000Z",
    candidates: [
      {
        id: "official-test-pdf",
        title: "Official SSC CGL Test PDF",
        url: `file://${sourcePdf.replace(/\\/g, "/")}`,
        sourceType: "official_open",
        acquisitionPolicy: "download public official PDF",
        publishPolicy: "official public file can enter import review",
        reviewStatus: "needs_review"
      },
      {
        id: "scribd-test",
        title: "Scribd restricted reference",
        url: "https://www.scribd.com/document/example",
        sourceType: "copyright_risk_reference",
        acquisitionPolicy: "metadata only",
        publishPolicy: "do not copy paid or login-gated text",
        reviewStatus: "metadata_only"
      }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--manifest", manifestPath,
    "--output-root", outputRoot,
    "--limit", "10"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const ledger = JSON.parse(fs.readFileSync(path.join(outputRoot, "download-ledger.json"), "utf8")) as {
    downloaded: Array<{ candidateId: string; sha256: string; filePath: string; bytes: number }>;
    skipped: Array<{ candidateId: string; reason: string }>;
  };

  assert.equal(ledger.downloaded.length, 1);
  assert.equal(ledger.downloaded[0]?.candidateId, "official-test-pdf");
  assert.ok(ledger.downloaded[0]?.sha256);
  assert.ok(ledger.downloaded[0]?.bytes > 0);
  assert.ok(fs.existsSync(ledger.downloaded[0]!.filePath));
  assert.ok(ledger.skipped.some((item) => item.candidateId === "scribd-test" && /copyright/i.test(item.reason)));
});

test("SSC CGL downloader quarantines unverified web PDFs only when explicitly enabled", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-web-pdf-"));
  const sourcePdf = path.join(tempRoot, "drishti.pdf");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% test web pdf\n");

  const manifestPath = path.join(tempRoot, "resource-candidates.json");
  const outputRoot = path.join(tempRoot, "downloads");
  fs.writeFileSync(manifestPath, JSON.stringify({
    generatedAt: "2026-06-25T00:00:00.000Z",
    candidates: [
      {
        id: "drishti-cgl-2025-shift-2",
        title: "SSC CGL Tier 1 Question Paper Bilingual 24 September 2025 Shift 2",
        url: `file://${sourcePdf.replace(/\\/g, "/")}`,
        sourceType: "web_pdf_unverified",
        acquisitionPolicy: "quarantine public web PDF with provenance",
        publishPolicy: "needs model-agent review; never rank directly from web source",
        reviewStatus: "needs_review",
        sourceId: "drishti-ssc-cgl-pyq-pdf"
      }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--manifest", manifestPath,
    "--output-root", outputRoot,
    "--limit", "10"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const defaultLedger = JSON.parse(fs.readFileSync(path.join(outputRoot, "download-ledger.json"), "utf8")) as {
    downloaded: Array<{ candidateId: string }>;
    quarantined: Array<{ candidateId: string }>;
    skipped: Array<{ candidateId: string; reason: string }>;
  };

  assert.equal(defaultLedger.downloaded.length, 0);
  assert.equal(defaultLedger.quarantined.length, 0);
  assert.ok(defaultLedger.skipped.some((item) => item.candidateId === "drishti-cgl-2025-shift-2" && /unverified web PDF/i.test(item.reason)));

  execFileSync("python", [
    scriptPath,
    "--manifest", manifestPath,
    "--output-root", outputRoot,
    "--limit", "10",
    "--allow-web-pdf-quarantine",
    "--source-id", "drishti-ssc-cgl-pyq-pdf"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const quarantineLedger = JSON.parse(fs.readFileSync(path.join(outputRoot, "download-ledger.json"), "utf8")) as {
    downloaded: Array<{ candidateId: string }>;
    quarantined: Array<{
      candidateId: string;
      filePath: string;
      quarantineReason: string;
      publishPolicy: string;
      sha256: string;
      bytes: number;
    }>;
    skipped: Array<{ candidateId: string; reason: string }>;
  };

  assert.equal(quarantineLedger.downloaded.length, 0);
  assert.equal(quarantineLedger.quarantined.length, 1);
  assert.equal(quarantineLedger.quarantined[0]?.candidateId, "drishti-cgl-2025-shift-2");
  assert.match(quarantineLedger.quarantined[0]?.quarantineReason ?? "", /unverified web PDF/i);
  assert.match(quarantineLedger.quarantined[0]?.publishPolicy ?? "", /never rank/i);
  assert.ok(quarantineLedger.quarantined[0]?.sha256);
  assert.ok(quarantineLedger.quarantined[0]?.bytes > 0);
  assert.ok(quarantineLedger.quarantined[0]?.filePath.includes(`${path.sep}quarantine${path.sep}files${path.sep}`));
  assert.ok(fs.existsSync(quarantineLedger.quarantined[0]!.filePath));
});
