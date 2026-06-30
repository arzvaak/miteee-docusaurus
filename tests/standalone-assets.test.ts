import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ensureStandaloneAssets } from "../scripts/standalone-assets.mjs";

function seedCurrentAffairsRuntimeData(root: string) {
  fs.mkdirSync(path.join(root, "data", "current-affairs", "daily"), { recursive: true });
  fs.writeFileSync(path.join(root, "data", "current-affairs", "daily", "2026-06-29.json"), JSON.stringify({ date: "2026-06-29", items: [] }));
  fs.writeFileSync(path.join(root, "data", "current-affairs", "state.json"), JSON.stringify({ lastSuccessfulDate: "2026-06-29" }));
}

function seedSscResourceRuntimeData(root: string) {
  fs.mkdirSync(path.join(root, "data", "exams", "ssc-cgl"), { recursive: true });
  fs.writeFileSync(path.join(root, "data", "exams", "ssc-cgl", "resource-candidates.json"), JSON.stringify({
    generatedAt: "2026-06-29T00:00:00Z",
    candidates: [{ id: "book-lane", title: "Book lane", url: "https://example.com", sourceType: "copyright_risk_reference", tags: ["book"] }]
  }));
  fs.writeFileSync(path.join(root, "data", "exams", "ssc-cgl", "source-registry.json"), JSON.stringify({
    officialNoticeUrl: "https://ssc.gov.in",
    sources: [{ id: "official", type: "official_open" }]
  }));
}

test("ensureStandaloneAssets stages public and Next static assets for standalone runtime", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-standalone-"));
  fs.mkdirSync(path.join(root, "public", "img"), { recursive: true });
  fs.writeFileSync(path.join(root, "public", "img", "logo.svg"), "<svg />");
  fs.mkdirSync(path.join(root, ".next", "static", "chunks"), { recursive: true });
  fs.writeFileSync(path.join(root, ".next", "static", "chunks", "app.js"), "console.log('ok');");
  fs.mkdirSync(path.join(root, ".next", "standalone"), { recursive: true });
  seedCurrentAffairsRuntimeData(root);
  seedSscResourceRuntimeData(root);

  ensureStandaloneAssets(root);

  assert.equal(fs.readFileSync(path.join(root, ".next", "standalone", "public", "img", "logo.svg"), "utf8"), "<svg />");
  assert.equal(fs.readFileSync(path.join(root, ".next", "standalone", ".next", "static", "chunks", "app.js"), "utf8"), "console.log('ok');");
  assert.match(fs.readFileSync(path.join(root, ".next", "standalone", "data", "current-affairs", "daily", "2026-06-29.json"), "utf8"), /2026-06-29/);
  assert.match(fs.readFileSync(path.join(root, ".next", "standalone", "data", "current-affairs", "state.json"), "utf8"), /lastSuccessfulDate/);
  assert.match(fs.readFileSync(path.join(root, ".next", "standalone", "data", "exams", "ssc-cgl", "resource-candidates.json"), "utf8"), /book-lane/);
  assert.match(fs.readFileSync(path.join(root, ".next", "standalone", "data", "exams", "ssc-cgl", "source-registry.json"), "utf8"), /official/);
});

test("standalone asset script runs the staging helper when invoked directly", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-standalone-cli-"));
  fs.mkdirSync(path.join(root, "public", "img"), { recursive: true });
  fs.writeFileSync(path.join(root, "public", "img", "logo.svg"), "<svg />");
  fs.mkdirSync(path.join(root, ".next", "static", "chunks"), { recursive: true });
  fs.writeFileSync(path.join(root, ".next", "static", "chunks", "app.js"), "console.log('ok');");
  fs.mkdirSync(path.join(root, ".next", "standalone"), { recursive: true });
  seedCurrentAffairsRuntimeData(root);
  seedSscResourceRuntimeData(root);

  execFileSync(process.execPath, [path.join(process.cwd(), "scripts", "standalone-assets.mjs")], { cwd: root });

  assert.equal(fs.readFileSync(path.join(root, ".next", "standalone", "public", "img", "logo.svg"), "utf8"), "<svg />");
  assert.equal(fs.readFileSync(path.join(root, ".next", "standalone", ".next", "static", "chunks", "app.js"), "utf8"), "console.log('ok');");
});

test("ensureStandaloneAssets removes traced deployment artifacts from standalone runtime", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-standalone-clean-"));
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.mkdirSync(path.join(root, ".next", "static"), { recursive: true });
  fs.mkdirSync(path.join(root, ".next", "standalone", "deploy-artifacts", "release"), { recursive: true });
  fs.writeFileSync(path.join(root, ".next", "standalone", "deploy-artifacts", "release", "server.js"), "stale");
  seedCurrentAffairsRuntimeData(root);
  seedSscResourceRuntimeData(root);

  ensureStandaloneAssets(root);

  assert.equal(fs.existsSync(path.join(root, ".next", "standalone", "deploy-artifacts")), false);
});

test("ensureStandaloneAssets removes traced SSC OCR and review intermediates from standalone runtime", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-standalone-ssc-clean-"));
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.mkdirSync(path.join(root, ".next", "static"), { recursive: true });
  const standaloneRoot = path.join(root, ".next", "standalone");
  const removedPaths = [
    "data/exams/ssc-cgl/book-ocr/source/report.json",
    "data/exams/ssc-cgl/aligned-mistral/source/chunk/aligned-candidates.json",
    "data/exams/ssc-cgl/topic-review-mistral/review.json",
    "data/current-affairs/raw/2026-06-29.jsonl",
    "output/playwright/screenshot.png",
    "work/tmp.txt"
  ];
  const sourceCorpusPath = "data/exams/ssc-cgl/book-imports/questions.json";
  const keptPath = "data/generated/exams/ssc-cgl/questions.json";

  for (const relativePath of [...removedPaths, sourceCorpusPath, keptPath]) {
    const filePath = path.join(standaloneRoot, ...relativePath.split("/"));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "artifact");
  }
  seedCurrentAffairsRuntimeData(root);
  seedSscResourceRuntimeData(root);

  ensureStandaloneAssets(root);

  for (const relativePath of removedPaths) {
    assert.equal(fs.existsSync(path.join(standaloneRoot, ...relativePath.split("/"))), false, `${relativePath} should be stripped`);
  }
  assert.equal(fs.existsSync(path.join(standaloneRoot, ...sourceCorpusPath.split("/"))), false);
  assert.equal(fs.existsSync(path.join(standaloneRoot, ...keptPath.split("/"))), true);
  assert.equal(fs.existsSync(path.join(standaloneRoot, "data", "current-affairs", "daily", "2026-06-29.json")), true);
  assert.equal(fs.existsSync(path.join(standaloneRoot, "data", "exams", "ssc-cgl", "resource-candidates.json")), true);
  assert.equal(fs.existsSync(path.join(standaloneRoot, "data", "exams", "ssc-cgl", "source-registry.json")), true);
});

test("ensureStandaloneAssets fails clearly when the Next static output is missing", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-standalone-missing-static-"));
  fs.mkdirSync(path.join(root, ".next", "standalone"), { recursive: true });

  assert.throws(
    () => ensureStandaloneAssets(root),
    /Missing required standalone asset source: \.next[\\/]static/
  );
});
