import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const testsRoot = path.join(process.cwd(), "tests");

function commandExists(command) {
  const result = spawnSync(command, ["--version"], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe"
  });
  return !result.error && result.status === 0;
}

function buildPythonShimEnv() {
  if (commandExists("python")) return process.env;

  const fallback = process.platform === "win32"
    ? commandExists("py") ? "py -3" : ""
    : commandExists("python3") ? "python3" : "";
  if (!fallback) return process.env;

  const shimRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-python-shim-"));
  if (process.platform === "win32") {
    fs.writeFileSync(path.join(shimRoot, "python.cmd"), `@echo off\r\n${fallback} %*\r\n`, "utf8");
  } else {
    const shimPath = path.join(shimRoot, "python");
    fs.writeFileSync(shimPath, `#!/bin/sh\nexec ${fallback} "$@"\n`, "utf8");
    fs.chmodSync(shimPath, 0o755);
  }

  return {
    ...process.env,
    PATH: `${shimRoot}${path.delimiter}${process.env.PATH ?? ""}`
  };
}

function collectTestFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }
    if (/\.test\.tsx?$/.test(entry.name)) files.push(fullPath);
  }

  return files;
}

const testFiles = collectTestFiles(testsRoot).sort();

if (testFiles.length === 0) {
  console.error("No test files found under tests/.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [
  "--import",
  "tsx",
  "--test",
  "--test-concurrency=1",
  ...testFiles
], {
  cwd: process.cwd(),
  env: buildPythonShimEnv(),
  stdio: "inherit"
});

process.exit(result.status ?? 1);
