import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const workflowPath = path.join(root, ".github", "workflows", "deploy-netcup.yml");
const newsInstallerPath = path.join(root, "ops", "netcup", "install-ssc-cgl-news.sh");
const newsVerifierPath = path.join(root, "ops", "netcup", "verify-ssc-cgl-news.sh");
const nextPublisherPath = path.join(root, "ops", "netcup", "publish-next-app.sh");
const currentAffairsDocPath = path.join(root, "data", "exams", "ssc-cgl", "internal-docs", "current-affairs-pipeline.md");

test("Netcup workflow deploys the current Next standalone app instead of stale Docusaurus build output", () => {
  const workflow = fs.readFileSync(workflowPath, "utf8");
  const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf8");

  assert.match(workflow, /scripts\/standalone-assets\.mjs/);
  assert.match(workflow, /name: Generate runtime data[\s\S]*?run: npm run build:content/);
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /run: npm run lint/);
  assert.ok(workflow.indexOf("run: npm run build:content") < workflow.indexOf("run: npm test"));
  assert.equal(fs.existsSync(path.join(root, "data", "exams", "ssc-cgl", "resource-candidates.json")), true);
  assert.match(workflow, /npm run verify:ssc-render/);
  assert.match(packageJson, /"verify:ssc-browser":\s*"node scripts\/verify-ssc-browser-smoke\.mjs"/);
  assert.match(packageJson, /"verify:ssc-render":\s*"node --import tsx scripts\/verify-ssc-rendered-output\.ts"/);
  assert.match(workflow, /ops\/netcup\/publish-next-app\.sh/);
  assert.match(workflow, /chmod \+x ops\/netcup\/publish-next-app\.sh/);
  assert.match(workflow, /--exclude 'data\/auth\/'/);
  assert.match(workflow, /--exclude 'data\/current-affairs\/'/);
  assert.match(workflow, /note-arzvak-predeploy-/);
  assert.match(workflow, /note-nginx-predeploy-/);
  assert.match(workflow, /chmod 600 .*note-arzvak-predeploy-/);
  assert.match(workflow, /Refresh Next app after current-affairs artifacts/);
  assert.match(workflow, /test -s data\/current-affairs\/daily\/\\\$RUN_DATE\.json/);
  assert.match(workflow, /echo "CURRENT_AFFAIRS_RUN_DATE=\$RUN_DATE" >> "\$GITHUB_ENV"/);
  assert.match(workflow, /RUN_DATE='\$CURRENT_AFFAIRS_RUN_DATE'/);
  assert.match(workflow, /chmod -R a\+rX data\/current-affairs/);
  assert.match(workflow, /export NEXT_APP_PUBLISHED_PORT=3025/);
  assert.match(workflow, /docker compose -f docker-compose\.next\.yml up -d --no-build/);
  assert.doesNotMatch(workflow, /docker compose -f docker-compose\.next\.yml up -d --no-build --force-recreate/);
  assert.doesNotMatch(workflow, /docker cp data\/current-affairs\/\. miteee-next-app:\/app\/data\/current-affairs\//);
  assert.doesNotMatch(workflow, /docker compose -f docker-compose\.next\.yml restart miteee-next/);
  assert.match(workflow, /ls -lah \/app\/data\/current-affairs\/daily && test -s \/app\/data\/current-affairs\/daily\/\\\$RUN_DATE\.json/);
  assert.match(workflow, /grep -q 'Daily depth, weekly clarity, monthly revision\.'/);
  assert.match(workflow, /http:\/\/127\.0\.0\.1:3025\/exams\/ssc-cgl\/current-affairs/);
  assert.match(workflow, /http:\/\/127\.0\.0\.1:3025\/api\/auth\/get-session/);
  assert.match(workflow, /deployment-auth-probe@invalid\.example/);
  assert.match(workflow, /test "\$auth_status" = "401"/);
  assert.doesNotMatch(workflow, /miteee-next-netcup-ports\.yml/);
  assert.doesNotMatch(workflow, /NETCUP_WEBROOT/);
  assert.doesNotMatch(workflow, /build\/\s*"\$NETCUP_USER@\$NETCUP_HOST:/);
  assert.doesNotMatch(workflow, /grep -q "MIT EEE"/);
  assert.match(workflow, /curl --fail[\s\S]*\/exams\/ssc-cgl/);
  assert.match(workflow, /grep -q "Build each subject\. Then test it\." \/tmp\/ssc-cgl\.html/);
  assert.match(workflow, /grep -q "Four sections, clearly separated\." \/tmp\/ssc-cgl\.html/);
  assert.match(workflow, /Legacy Study Vault label is still present/);
  assert.match(workflow, /\/notes\/research-valorant-preliminary-findings-index/);
  assert.match(workflow, /redirect_status/);
  assert.match(workflow, /\/courses\/RESEARCH/);
  assert.match(workflow, /Work in progress/);
  assert.match(workflow, /not yet tested the final model on a completely untouched future tournament/);
  assert.match(workflow, /Library spaces/);
  assert.match(workflow, /Choose what you want to learn/);
  assert.match(workflow, /Make this study space yours/);
  assert.match(workflow, /Reader layout/);
  assert.match(workflow, /composition-map-feature-audit\.png/);
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  assert.match(workflow, /VERIFY_BASE_URL='http:\/\/127\.0\.0\.1:33025'/);
  assert.match(workflow, /-O forward -L 33025:127\.0\.0\.1:3025/);
  assert.match(workflow, /--noproxy '\*'/);
  assert.match(workflow, /SSC_BROWSER_BASE_URL="\$VERIFY_BASE_URL"/);
});

test("Netcup Next publisher restarts the live nginx-facing app instead of only syncing files", () => {
  const publisher = fs.readFileSync(nextPublisherPath, "utf8");
  const compose = fs.readFileSync(path.join(root, "docker-compose.next.yml"), "utf8");

  assert.match(publisher, /APP_PORT="\$\{NEXT_APP_PORT:-3025\}"/);
  assert.match(compose, /127\.0\.0\.1:\$\{NEXT_APP_PUBLISHED_PORT:-3000\}:3000/);
  assert.match(publisher, /export NEXT_APP_PUBLISHED_PORT="\$APP_PORT"/);
  assert.match(publisher, /chmod 700 "\$AUTH_DATA_DIR"/);
  assert.match(publisher, /find "\$AUTH_DATA_DIR" -maxdepth 1 -type f -exec chmod 600 \{\} \+/);
  assert.doesNotMatch(publisher, /miteee-next-netcup-ports\.yml/);
  assert.match(publisher, /systemctl stop "\$\{SERVICE_NAME\}\.service"/);
  assert.match(publisher, /systemctl disable "\$\{SERVICE_NAME\}\.service"/);
  assert.match(publisher, /\/etc\/systemd\/system\/\$\{SERVICE_NAME\}\.service/);
  assert.match(publisher, /WorkingDirectory=\$APP_DIR\/\.next\/standalone/);
  assert.match(publisher, /ExecStart=\$node_bin server\.js/);
  assert.match(publisher, /systemctl restart "\$\{SERVICE_NAME\}\.service"/);
  assert.match(publisher, /fuser -k "\$\{APP_PORT\}\/tcp"/);
  assert.match(publisher, /docker compose -f docker-compose\.next\.yml up -d --build/);
  assert.match(publisher, /http:\/\/\$\{APP_HOST\}:\$\{APP_PORT\}\/exams\/ssc-cgl/);
  assert.match(publisher, /http:\/\/\$\{APP_HOST\}:\$\{APP_PORT\}\/api\/auth\/get-session/);
  assert.match(publisher, /deployment-auth-probe@invalid\.example/);
  assert.match(publisher, /auth POST probe returned HTTP/);
  assert.match(publisher, /Next app did not become healthy/);
  assert.match(publisher, /refusing to report a stale deploy as successful/);
  assert.match(publisher, /nginx -t/);
  assert.match(publisher, /nginx -s reload/);
});

test("SSC CGL browser smoke verifier covers subjects, exam setup, timed sessions, and endless practice", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "verify-ssc-browser-smoke.mjs"), "utf8");

  assert.match(script, /SSC_BROWSER_BASE_URL/);
  assert.match(script, /\/exams\/ssc-cgl/);
  assert.match(script, /\/exams\/ssc-cgl\/subjects\/reasoning/);
  assert.match(script, /Complete table of contents/);
  assert.match(script, /Build each subject\. Then test it\./);
  assert.match(script, /page\.goto\(`\$\{baseUrl\}\/practice`/);
  assert.match(script, /What do you want to practice\?/);
  assert.match(script, /Quick 10/);
  assert.match(script, /Section Test/);
  assert.match(script, /Full Mock/);
  assert.match(script, /Endless Practice/);
  assert.match(script, /Book \/ PYQ Practice/);
  assert.match(script, /Weakness Repair/);
  assert.match(script, /Configure your session/);
  assert.match(script, /Start Quick 10/);
  assert.match(script, /\/exams\/ssc-cgl\/session\?mode=quick/);
  assert.match(script, /Test sections/);
  assert.match(script, /Question palette/);
  assert.match(script, /Choose one answer/);
  assert.match(script, /Mark for review & next/);
  assert.match(script, /Answers and explanations stay hidden until you submit the test/);
  assert.match(script, /\/exams\/ssc-cgl\/session\?mode=endless/);
  assert.match(script, /No finish line\. Just focused repetitions\./);
  assert.match(script, /Check answer/);
  assert.match(script, /Next question/);
  assert.match(script, /horizontal overflow/);
  assert.match(script, /desktop/);
  assert.match(script, /mobile/);
});

test("Netcup workflow can install the SSC CGL news Docker cron service from the synced repo", () => {
  const workflow = fs.readFileSync(workflowPath, "utf8");

  assert.match(workflow, /ops\/netcup\/install-ssc-cgl-news\.sh/);
  assert.match(workflow, /chmod \+x ops\/netcup\/install-ssc-cgl-news\.sh/);
  assert.match(workflow, /DEEPSEEK_API_KEY/);
  assert.match(workflow, /MISTRAL_API_KEY/);
  assert.match(workflow, /RUN_DATE="\$\(TZ=Asia\/Kolkata date \+%F\)"/);
  assert.match(workflow, /echo "CURRENT_AFFAIRS_RUN_DATE=\$RUN_DATE" >> "\$GITHUB_ENV"/);
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

test("Netcup and Docker mount server-generated current-affairs data instead of baking it into images", () => {
  const dockerignore = fs.readFileSync(path.join(root, ".dockerignore"), "utf8");
  const nextCompose = fs.readFileSync(path.join(root, "docker-compose.next.yml"), "utf8");

  assert.match(dockerignore, /^data\/current-affairs$/m);
  assert.match(nextCompose, /\.\/data\/current-affairs:\/app\/data\/current-affairs:z/);
});

test("Netcup SSC CGL news installer starts cron, runs once, and verifies artifacts", () => {
  const installer = fs.readFileSync(newsInstallerPath, "utf8");
  const compose = fs.readFileSync(path.join(root, "docker-compose.ssc-cgl-news.yml"), "utf8");
  const dockerfile = fs.readFileSync(path.join(root, "docker", "ssc-cgl-news.Dockerfile"), "utf8");

  assert.match(installer, /docker compose -f docker-compose\.ssc-cgl-news\.yml up -d --build/);
  assert.match(installer, /docker compose -f docker-compose\.ssc-cgl-news\.yml exec -T ssc-cgl-news/);
  assert.match(installer, /TZ=Asia\/Kolkata date \+%F/);
  assert.match(installer, /scripts\/run_ssc_cgl_daily_news_once\.sh --date "\$RUN_DATE"/);
  assert.match(installer, /ops\/netcup\/verify-ssc-cgl-news\.sh "\$APP_DIR"/);
  assert.match(installer, /DEEPSEEK_API_KEY/);
  assert.match(installer, /MISTRAL_API_KEY/);
  assert.match(installer, /source \.env/);
  assert.match(installer, /COMPOSE_PROJECT_NAME/);
  assert.match(compose, /\.\/data\/current-affairs:\/app\/data\/current-affairs:z/);
  assert.doesNotMatch(compose, /\.\/:\/app/);
  assert.doesNotMatch(compose, /data\/current-affairs:\/app\/data\/current-affairs:Z/);
  assert.match(dockerfile, /COPY scripts\/daily_news_pipeline\.py scripts\/run_ssc_cgl_daily_news_once\.sh \.\/scripts\//);
  assert.match(dockerfile, /sed -i 's\/\\r\$\/\/' \/etc\/cron\.d\/ssc-cgl-news/);
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
