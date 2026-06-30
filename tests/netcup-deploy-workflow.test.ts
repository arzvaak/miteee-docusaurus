import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const workflowPath = path.join(root, ".github", "workflows", "deploy-netcup.yml");
const newsInstallerPath = path.join(root, "ops", "netcup", "install-ssc-cgl-news.sh");
const newsVerifierPath = path.join(root, "ops", "netcup", "verify-ssc-cgl-news.sh");
const currentAffairsDocPath = path.join(root, "data", "exams", "ssc-cgl", "internal-docs", "current-affairs-pipeline.md");

test("Netcup workflow deploys the current Next standalone app instead of stale Docusaurus build output", () => {
  const workflow = fs.readFileSync(workflowPath, "utf8");
  const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf8");

  assert.match(workflow, /scripts\/standalone-assets\.mjs/);
  assert.match(workflow, /npm run verify:ssc-render/);
  assert.match(packageJson, /"verify:ssc-browser":\s*"node scripts\/verify-ssc-browser-smoke\.mjs"/);
  assert.match(packageJson, /"verify:ssc-render":\s*"node --import tsx scripts\/verify-ssc-rendered-output\.ts"/);
  assert.match(workflow, /\.next\/standalone/);
  assert.doesNotMatch(workflow, /NETCUP_WEBROOT/);
  assert.doesNotMatch(workflow, /build\/\s*"\$NETCUP_USER@\$NETCUP_HOST:/);
  assert.doesNotMatch(workflow, /grep -q "MIT EEE"/);
  assert.match(workflow, /curl --fail[\s\S]*\/exams\/ssc-cgl/);
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  assert.match(workflow, /SSC_BROWSER_BASE_URL=https:\/\/note\.arzvak\.com npm run verify:ssc-browser/);
});

test("SSC CGL browser smoke verifier covers dashboard gates, one-by-one practice, and note quiz reveal", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "verify-ssc-browser-smoke.mjs"), "utf8");

  assert.match(script, /SSC_BROWSER_BASE_URL/);
  assert.match(script, /\/exams\/ssc-cgl/);
  assert.match(script, /Strict 200\/200 gates/);
  assert.match(script, /Start topic queue/);
  assert.match(script, /ssc-strict-gate-card/);
  assert.match(script, /cards !== 9/);
  assert.match(script, /\/exams\/ssc-cgl\/practice\/analogy-classification/);
  assert.match(script, /checkPracticeHub/);
  assert.match(script, /\/exams\/ssc-cgl\/practice/);
  assert.match(script, /Resume next unfinished topic/);
  assert.match(script, /Overall topic queue/);
  assert.match(script, /Local progress/);
  assert.match(script, /In progress/);
  assert.match(script, /ssc-topic-practice-option/);
  assert.match(script, /keyboard option answer/);
  assert.match(script, /page\.keyboard\.press\("2"\)/);
  assert.match(script, /page\.keyboard\.press\("n"\)/);
  assert.match(script, /Pick an option to reveal the answer/);
  assert.match(script, /checkTopicPracticeQueueComplete/);
  assert.match(script, /All questions complete in this queue/);
  assert.match(script, /Switch to all questions/);
  assert.match(script, /Correct answer/);
  assert.match(script, /\/exams\/ssc-cgl\/tests\/ssc-cgl-book-200-mode-mock-01/);
  assert.match(script, /ssc-test-runner/);
  assert.match(script, /ssc-test-timer/);
  assert.match(script, /ssc-section-tab/);
  assert.match(script, /ssc-test-option/);
  assert.match(script, /Lock section/);
  assert.match(script, /Submit/);
  assert.match(script, /checkCurrentAffairs/);
  assert.match(script, /\/exams\/ssc-cgl\/current-affairs/);
  assert.match(script, /Daily recall protocol/);
  assert.match(script, /Recall queue/);
  assert.match(script, /Reveal answer/);
  assert.match(script, /Know it/);
  assert.match(script, /Static GK bridge/);
  assert.match(script, /\/notes\/ssc-cgl-reasoning-analogy-classification/);
  assert.match(script, /Reviewed PYQ-style questions from this topic/);
  assert.match(script, /ssc-topic-quiz-block/);
  assert.match(script, /checkTopicPreviewQuiz/);
  assert.match(script, /Clock : Time :: Thermometer : \?/);
  assert.match(script, /data-correct='true'/);
  assert.match(script, /\.q-correct/);
  assert.match(script, /Answer: B/);
  assert.match(script, /horizontal overflow/);
  assert.match(script, /desktop/);
  assert.match(script, /mobile/);
});

test("Netcup workflow can install the SSC CGL news Docker cron service from the synced repo", () => {
  const workflow = fs.readFileSync(workflowPath, "utf8");

  assert.match(workflow, /ops\/netcup\/install-ssc-cgl-news\.sh/);
  assert.match(workflow, /chmod \+x ops\/netcup\/install-ssc-cgl-news\.sh/);
  assert.match(workflow, /MISTRAL_API_KEY/);
  assert.match(workflow, /RUN_DATE=\\\$\(TZ=Asia\/Kolkata date \+%F\)/);
});

test("Netcup and Docker builds include the promoted SSC CGL book corpus", () => {
  const dockerignore = fs.readFileSync(path.join(root, ".dockerignore"), "utf8");
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  const promotedCorpusPath = path.join(root, "data", "exams", "ssc-cgl", "book-imports", "questions.json");
  const promotedCorpus = fs.statSync(promotedCorpusPath);

  assert.ok(promotedCorpus.size > 50_000_000);
  assert.doesNotMatch(dockerignore, /^data\/exams\/ssc-cgl\/book-imports\/questions\.json$/m);
  assert.doesNotMatch(gitignore, /^data\/exams\/ssc-cgl\/book-imports\/questions\.json$/m);
});

test("Netcup and Docker builds include daily current-affairs summaries without raw source files", () => {
  const dockerignore = fs.readFileSync(path.join(root, ".dockerignore"), "utf8");

  assert.doesNotMatch(dockerignore, /^data\/current-affairs\/daily$/m);
  assert.match(dockerignore, /^data\/current-affairs\/raw$/m);
});

test("Netcup SSC CGL news installer starts cron, runs once, and verifies artifacts", () => {
  const installer = fs.readFileSync(newsInstallerPath, "utf8");
  const compose = fs.readFileSync(path.join(root, "docker-compose.ssc-cgl-news.yml"), "utf8");

  assert.match(installer, /docker compose -f docker-compose\.ssc-cgl-news\.yml up -d --build/);
  assert.match(installer, /docker compose -f docker-compose\.ssc-cgl-news\.yml exec -T ssc-cgl-news/);
  assert.match(installer, /TZ=Asia\/Kolkata date \+%F/);
  assert.match(installer, /scripts\/run_ssc_cgl_daily_news_once\.sh --date "\$RUN_DATE"/);
  assert.match(installer, /ops\/netcup\/verify-ssc-cgl-news\.sh "\$APP_DIR"/);
  assert.match(installer, /MISTRAL_API_KEY/);
  assert.match(installer, /source \.env/);
  assert.match(installer, /COMPOSE_PROJECT_NAME/);
  assert.match(compose, /\.\/:\/app:Z/);
  assert.doesNotMatch(compose, /data\/current-affairs:\/app\/data\/current-affairs:Z/);
  assert.doesNotMatch(installer, /schtasks|powershell\.exe/i);
});

test("Netcup SSC CGL news verifier proves the cron service and latest artifacts", () => {
  const verifier = fs.readFileSync(newsVerifierPath, "utf8");
  const docs = fs.readFileSync(currentAffairsDocPath, "utf8");

  assert.match(verifier, /docker compose -f docker-compose\.ssc-cgl-news\.yml ps --status running ssc-cgl-news/);
  assert.match(verifier, /TZ=Asia\/Kolkata date \+%F/);
  assert.match(verifier, /docker compose -f docker-compose\.ssc-cgl-news\.yml exec -T ssc-cgl-news python scripts\/daily_news_pipeline\.py --validate-date "\$RUN_DATE"/);
  assert.match(verifier, /data\/current-affairs\/raw\/"\$RUN_DATE"\.jsonl/);
  assert.match(verifier, /data\/current-affairs\/daily\/"\$RUN_DATE"\.json/);
  assert.match(verifier, /lastSuccessfulDate/);
  assert.match(verifier, /successfulRuns/);
  assert.match(verifier, /ssc-cgl-news verified/);
  assert.doesNotMatch(verifier, /schtasks|powershell\.exe/i);
  assert.match(docs, /ops\/netcup\/verify-ssc-cgl-news\.sh/);
  assert.match(docs, /07:00 IST job actually ran/);
});
