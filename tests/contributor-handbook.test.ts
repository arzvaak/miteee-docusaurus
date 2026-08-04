import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import packageJson from "../package.json" with { type: "json" };

const projectRoot = process.cwd();
const handbookFiles = [
  "CONTRIBUTING.md",
  "handbook/README.md",
  "handbook/adding-notes.md",
  "handbook/architecture.md",
  "handbook/adding-features.md",
  "handbook/validation-and-release.md"
];

function localMarkdownLinks(filePath: string) {
  const source = fs
    .readFileSync(path.join(projectRoot, filePath), "utf8")
    .replace(/```[\s\S]*?```/g, "");
  return [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1] || "")
    .filter((target) => target && !/^(?:https?:|mailto:|#)/i.test(target));
}

test("contributor handbook keeps every local Markdown link valid", () => {
  for (const filePath of ["README.md", ...handbookFiles]) {
    assert.ok(fs.existsSync(path.join(projectRoot, filePath)), `${filePath} should exist`);

    for (const target of localMarkdownLinks(filePath)) {
      const cleanTarget = target.split("#")[0] || "";
      const resolved = path.resolve(projectRoot, path.dirname(filePath), cleanTarget);
      assert.ok(fs.existsSync(resolved), `${filePath} links to missing ${target}`);
    }
  }
});

test("documented validation commands are backed by package scripts", () => {
  const scripts = packageJson.scripts as Record<string, string>;
  for (const script of ["dev", "build:content", "test", "lint", "typecheck", "build"]) {
    assert.equal(typeof scripts[script], "string", `npm run ${script} should exist`);
  }
});

test("the note template stays outside the publishable docs tree", () => {
  const templatePath = path.join(projectRoot, "templates", "academic-note.md");
  const docsRoot = path.join(projectRoot, "docs") + path.sep;

  assert.ok(fs.existsSync(templatePath));
  assert.equal(templatePath.startsWith(docsRoot), false);
});

test("architecture guide names the live content and deployment contracts", () => {
  const architecture = fs.readFileSync(path.join(projectRoot, "handbook", "architecture.md"), "utf8");
  const builder = fs.readFileSync(path.join(projectRoot, "scripts", "build-content-data.ts"), "utf8");
  const nextConfig = fs.readFileSync(path.join(projectRoot, "next.config.mjs"), "utf8");

  assert.match(architecture, /docs\/\*\*\/\*\.md/);
  assert.match(architecture, /data\/generated/);
  assert.match(architecture, /Next\.js standalone/i);
  assert.match(builder, /const docsRoot = options\.docsRoot \|\| path\.join\(cwd, "docs"\)/);
  assert.match(nextConfig, /output: "standalone"/);
});
