import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_deepseek_content_audit.py");

test("SSC CGL DeepSeek content audit runner is wired as an orchestrated shard review", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /DeepSeek V4 Pro orchestrating SSC CGL 200\/200 content review/);
  assert.match(script, /flash reviewers: coverage, explanation quality, duplicate risk, and 200\/200 speed usefulness/);
  assert.match(script, /DEEPSEEK_API_KEY/);
  assert.match(script, /deepseek-v4-pro/);
  assert.match(script, /shard-\{index:02d\}-prompt\.txt/);
  assert.match(script, /content-audit-report\.json/);
  assert.match(script, /overallDecision/);
  assert.match(script, /repairQueue/);
});
