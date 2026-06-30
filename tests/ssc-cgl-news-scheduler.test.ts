import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("SSC CGL daily news scheduler is a Netcup Docker cron service, not a Windows task", () => {
  const compose = fs.readFileSync(path.join(root, "docker-compose.ssc-cgl-news.yml"), "utf8");
  const dockerfile = fs.readFileSync(path.join(root, "docker", "ssc-cgl-news.Dockerfile"), "utf8");
  const cron = fs.readFileSync(path.join(root, "ops", "netcup", "ssc-cgl-news.cron"), "utf8");
  const runner = fs.readFileSync(path.join(root, "scripts", "run_ssc_cgl_daily_news_once.sh"), "utf8");

  assert.equal(fs.existsSync(path.join(root, "scripts", "install_ssc_cgl_daily_news_task.ps1")), false);
  assert.equal(fs.existsSync(path.join(root, "scripts", "run_ssc_cgl_daily_news_task.ps1")), false);
  assert.match(compose, /ssc-cgl-news/);
  assert.match(compose, /TZ:\s*Asia\/Kolkata/);
  assert.match(compose, /MISTRAL_API_KEY/);
  assert.match(compose, /data\/current-affairs/);
  assert.doesNotMatch(compose, /schtasks|powershell\.exe/i);
  assert.match(dockerfile, /cron/);
  assert.match(cron, /^0 7 \* \* \*/m);
  assert.match(cron, /run_ssc_cgl_daily_news_once\.sh/);
  assert.match(runner, /daily_news_pipeline\.py/);
  assert.match(runner, /TZ=Asia\/Kolkata date \+%F/);
  assert.match(runner, /--validate-date "\$RUN_DATE"/);
  assert.match(runner, /data\/current-affairs\/logs/);
  assert.match(runner, /MISTRAL_API_KEY/);
});

test("SSC CGL daily news runner writes auditable start and success log markers", () => {
  const runner = fs.readFileSync(path.join(root, "scripts", "run_ssc_cgl_daily_news_once.sh"), "utf8");

  assert.match(runner, /ssc-cgl-news run started/);
  assert.match(runner, /ssc-cgl-news run completed/);
  assert.match(runner, /RUN_DATE/);
  assert.match(runner, /LOG_FILE/);
});

test("SSC CGL daily news runner prevents overlapping cron runs and prunes old logs", () => {
  const runner = fs.readFileSync(path.join(root, "scripts", "run_ssc_cgl_daily_news_once.sh"), "utf8");

  assert.match(runner, /LOCK_FILE=/);
  assert.match(runner, /flock -n 9/);
  assert.match(runner, /ssc-cgl-news run skipped date=\$RUN_DATE reason=lock/);
  assert.match(runner, /CURRENT_AFFAIRS_LOG_RETENTION_DAYS/);
  assert.match(runner, /find "\$LOG_DIR" -type f -name '\*\.log' -mtime \+"\$LOG_RETENTION_DAYS" -delete/);
});

test("SSC CGL local news verifier runs only through Docker and validates throwaway artifacts", () => {
  const verifier = fs.readFileSync(path.join(root, "scripts", "verify_ssc_cgl_daily_news_docker.sh"), "utf8");
  const windowsVerifier = fs.readFileSync(path.join(root, "scripts", "verify_ssc_cgl_daily_news_docker.ps1"), "utf8");
  const docs = fs.readFileSync(path.join(root, "data", "exams", "ssc-cgl", "internal-docs", "current-affairs-pipeline.md"), "utf8");

  assert.match(verifier, /docker build -f docker\/ssc-cgl-news\.Dockerfile/);
  assert.match(verifier, /docker volume create "\$VOLUME_NAME"/);
  assert.match(verifier, /CURRENT_AFFAIRS_DATA_ROOT=\/tmp\/current-affairs/);
  assert.match(verifier, /python scripts\/daily_news_pipeline\.py --date/);
  assert.match(verifier, /python scripts\/daily_news_pipeline\.py --validate-date/);
  assert.match(verifier, /docker volume rm "\$VOLUME_NAME"/);
  assert.match(verifier, /KEEP_VOLUME/);
  assert.doesNotMatch(verifier, /python scripts[\\/]daily_news_pipeline\.py --date "\$RUN_DATE"/);
  assert.match(windowsVerifier, /docker build -f docker\/ssc-cgl-news\.Dockerfile/);
  assert.match(windowsVerifier, /India Standard Time/);
  assert.match(windowsVerifier, /docker volume create \$VolumeName/);
  assert.match(windowsVerifier, /CURRENT_AFFAIRS_DATA_ROOT=\/tmp\/current-affairs/);
  assert.match(windowsVerifier, /python scripts\/daily_news_pipeline\.py --date/);
  assert.match(windowsVerifier, /python scripts\/daily_news_pipeline\.py --validate-date/);
  assert.match(windowsVerifier, /docker volume rm \$VolumeName/);
  assert.doesNotMatch(windowsVerifier, /python\.exe|py\.exe|Start-Process|schtasks/i);
  assert.match(docs, /Local Docker Verification/);
  assert.match(docs, /verify_ssc_cgl_daily_news_docker\.sh/);
  assert.match(docs, /verify_ssc_cgl_daily_news_docker\.ps1/);
  assert.match(docs, /temporary Docker volume/);
});

test("SSC CGL Netcup shell scripts use LF line endings for Linux cron", () => {
  for (const relativePath of [
    "scripts/run_ssc_cgl_daily_news_once.sh",
    "scripts/verify_ssc_cgl_daily_news_docker.sh",
    "ops/netcup/install-ssc-cgl-news.sh",
    "ops/netcup/ssc-cgl-news.cron",
  ]) {
    const content = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert.equal(content.includes("\r\n"), false, `${relativePath} must use LF line endings`);
  }
});
