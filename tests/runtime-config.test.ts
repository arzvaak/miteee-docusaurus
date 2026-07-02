import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as T;
}

test("Next runtime does not keep a top-level static directory", () => {
  assert.equal(fs.existsSync(path.join(root, "static")), false);
  assert.equal(fs.existsSync(path.join(root, "legacy-docusaurus", "static")), false);
});

test("production start script uses the standalone server wrapper", () => {
  const pkg = readJson<{ scripts: Record<string, string> }>("package.json");
  assert.equal(pkg.scripts.start, "node scripts/start-standalone.mjs");
  assert.match(pkg.scripts["start:next"], /^next start/);
});

test("standalone wrapper runs from the standalone directory", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "start-standalone.mjs"), "utf8");
  assert.match(script, /const standaloneRoot = path\.join\(root, "\.next", "standalone"\)/);
  assert.match(script, /cwd: standaloneRoot/);
});

test("legacy Docusaurus config does not point at removed static assets", () => {
  const config = fs.readFileSync(path.join(root, "docusaurus.config.ts"), "utf8");
  assert.match(config, /staticDirectories:\s*\[\s*\]/);
  assert.doesNotMatch(config, /legacy-docusaurus\/static/);
});

test("local production verification uses the Dockerized Next standalone app", () => {
  const nextConfig = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");
  const dockerfile = fs.readFileSync(path.join(root, "docker", "next-app.Dockerfile"), "utf8");
  const compose = fs.readFileSync(path.join(root, "docker-compose.next.yml"), "utf8");
  const dockerignore = fs.readFileSync(path.join(root, ".dockerignore"), "utf8");

  assert.match(nextConfig, /NEXT_DOCKER_BUILD/);
  assert.match(nextConfig, /staticGenerationMaxConcurrency:\s*1/);
  assert.match(nextConfig, /staticGenerationMinPagesPerWorker:\s*1000/);
  assert.match(dockerfile, /npm run build/);
  assert.match(dockerfile, /NEXT_DOCKER_BUILD=1/);
  assert.match(dockerfile, /\.next\/standalone/);
  assert.match(dockerfile, /CMD \["node", "server\.js"\]/);
  assert.match(compose, /miteee-next/);
  assert.match(compose, /docker\/next-app\.Dockerfile/);
  assert.match(compose, /"3000:3000"/);
  assert.match(compose, /\/exams\/ssc-cgl/);
  assert.match(dockerignore, /node_modules/);
  assert.match(dockerignore, /\.next/);
});

test("README documents Docker production verification and LLM env setup", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");

  assert.match(readme, /docker compose -f docker-compose\.next\.yml up -d --build/);
  assert.match(readme, /http:\/\/127\.0\.0\.1:3000\/exams\/ssc-cgl/);
  assert.match(readme, /http:\/\/127\.0\.0\.1:3000\/robots\.txt/);
  assert.match(readme, /http:\/\/127\.0\.0\.1:3000\/site\.webmanifest/);
  assert.match(readme, /docker compose -f docker-compose\.next\.yml down/);
  assert.match(readme, /DEEPSEEK_API_KEY/);
  assert.match(readme, /DEEPSEEK_MODEL=deepseek-v4-pro/);
  assert.match(readme, /MISTRAL_API_KEY/);
  assert.match(readme, /MISTRAL_MODEL=mistral-small-latest/);
  assert.match(readme, /MISTRAK_API_KEY/);
  assert.match(readme, /compatibility/);
});
