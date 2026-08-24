import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function copyDirectoryOrCreateEmpty(source, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });
  if (fs.existsSync(source)) {
    fs.cpSync(source, destination, { recursive: true, force: true });
  }
}

function copyFileIfExists(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function removeRelative(root, relativePath) {
  fs.rmSync(path.join(root, ...relativePath.split("/")), { recursive: true, force: true });
}

function requireDirectory(root, relativePath) {
  const directory = path.join(root, ...relativePath.split("/"));
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing required standalone asset source: ${relativePath}. Run \`npm run build\` before staging or starting the standalone server.`);
  }
  return directory;
}

function requireFile(root, relativePath) {
  const filePath = path.join(root, ...relativePath.split("/"));
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`Missing required standalone asset source: ${relativePath}. Run \`npm run build\` before staging or starting the standalone server.`);
  }
  return filePath;
}

function assertLeanStandaloneBundle(standaloneRoot) {
  if (!fs.existsSync(path.join(standaloneRoot, "server.js"))) return;

  const forbiddenWorkspaceEntries = [
    ".github",
    "app",
    "components",
    "design-qa.md",
    "docker",
    "lib",
    "ops",
    "output",
    "src",
    "tests"
  ];
  const leakedEntries = forbiddenWorkspaceEntries.filter((entry) => fs.existsSync(path.join(standaloneRoot, entry)));
  if (leakedEntries.length > 0) {
    throw new Error(`Standalone output contains traced workspace source: ${leakedEntries.join(", ")}. Check outputFileTracingExcludes.`);
  }

  const sqliteAddon = path.join(standaloneRoot, "node_modules", "better-sqlite3", "build", "Release", "better_sqlite3.node");
  if (!fs.existsSync(sqliteAddon)) {
    throw new Error("Standalone output is missing the better-sqlite3 native addon required by account authentication.");
  }
}

export function ensureStandaloneAssets(root = process.cwd()) {
  const standaloneRoot = path.join(root, ".next", "standalone");
  requireDirectory(root, ".next/standalone");
  [
    "deploy-artifacts",
    "output",
    "work",
    "backups",
    "data/auth",
    "data/current-affairs/logs",
    "data/current-affairs/raw",
    "data/exams/ssc-cgl/agent-answer-key",
    "data/exams/ssc-cgl/agent-review",
    "data/exams/ssc-cgl/aligned",
    "data/exams/ssc-cgl/aligned-mistral",
    "data/exams/ssc-cgl/book-imports/questions.json",
    "data/exams/ssc-cgl/book-ocr",
    "data/exams/ssc-cgl/book-review",
    "data/exams/ssc-cgl/book-review-mistral",
    "data/exams/ssc-cgl/book-segments",
    "data/exams/ssc-cgl/book-segments-mistral",
    "data/exams/ssc-cgl/deep-notes",
    "data/exams/ssc-cgl/downloads",
    "data/exams/ssc-cgl/ocr-review",
    "data/exams/ssc-cgl/segments",
    "data/exams/ssc-cgl/topic-review",
    "data/exams/ssc-cgl/topic-review-mistral"
  ].forEach((relativePath) => removeRelative(standaloneRoot, relativePath));
  copyDirectory(path.join(root, "public"), path.join(standaloneRoot, "public"));
  copyDirectory(requireDirectory(root, ".next/static"), path.join(standaloneRoot, ".next", "static"));
  copyDirectory(requireDirectory(root, "data/generated/notes"), path.join(standaloneRoot, "data", "generated", "notes"));
  copyFileIfExists(
    requireFile(root, "data/generated/catalog.json"),
    path.join(standaloneRoot, "data", "generated", "catalog.json")
  );
  copyFileIfExists(
    requireFile(root, "data/generated/notes-index.json"),
    path.join(standaloneRoot, "data", "generated", "notes-index.json")
  );
  copyFileIfExists(
    requireFile(root, "data/generated/exams/ssc-cgl/index.json"),
    path.join(standaloneRoot, "data", "generated", "exams", "ssc-cgl", "index.json")
  );
  copyDirectoryOrCreateEmpty(path.join(root, "data", "current-affairs", "daily"), path.join(standaloneRoot, "data", "current-affairs", "daily"));
  copyFileIfExists(path.join(root, "data", "current-affairs", "state.json"), path.join(standaloneRoot, "data", "current-affairs", "state.json"));
  copyFileIfExists(path.join(root, "data", "exams", "ssc-cgl", "resource-candidates.json"), path.join(standaloneRoot, "data", "exams", "ssc-cgl", "resource-candidates.json"));
  copyFileIfExists(path.join(root, "data", "exams", "ssc-cgl", "source-registry.json"), path.join(standaloneRoot, "data", "exams", "ssc-cgl", "source-registry.json"));
  assertLeanStandaloneBundle(standaloneRoot);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  ensureStandaloneAssets();
}
