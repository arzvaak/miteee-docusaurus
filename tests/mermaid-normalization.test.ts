import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { normalizeMermaidSource } from "../lib/mermaid-normalize";

test("normalizeMermaidSource removes accidental language headers from code-fence text", () => {
  const source = ["mermaid", "flowchart TD", "A[Start] --> B[End]"].join("\n");

  assert.equal(normalizeMermaidSource(source), ["flowchart TD", "A[\"Start\"] --> B[\"End\"]"].join("\n"));
});

test("normalizeMermaidSource splits combined node edges that Mermaid 11 rejects", () => {
  const source = [
    "flowchart TD",
    "G & M --> N{Time remaining?}",
    "N -->|Under 20s| O[Move to next question]"
  ].join("\n");
  const normalized = normalizeMermaidSource(source);

  assert.match(normalized, /^G --> N\{"Time remaining\?"\}$/m);
  assert.match(normalized, /^M --> N\{"Time remaining\?"\}$/m);
  assert.doesNotMatch(normalized, /G\s*&\s*M\s*-->/);
  assert.match(normalized, /O\["Move to next question"\]/);
});

test("normalizeMermaidSource quotes punctuation-heavy labels in flowchart nodes", () => {
  const source = [
    "flowchart TD",
    "A[Start: Vocabulary Question] --> B{Question Type?}",
    "B -->|Synonym/Antonym| C[Find root meaning & tone]"
  ].join("\n");

  assert.equal(normalizeMermaidSource(source), [
    "flowchart TD",
    "A[\"Start: Vocabulary Question\"] --> B{\"Question Type?\"}",
    "B -->|Synonym/Antonym| C[\"Find root meaning & tone\"]"
  ].join("\n"));
});

test("MermaidDiagram keeps learner-facing fallback instead of exposing raw parser errors", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "components", "MermaidDiagram.tsx"), "utf8");

  assert.match(source, /renderFlowchartFallback/);
  assert.match(source, /diagram-fallback/);
  assert.match(source, /Diagram source preserved/);
  assert.doesNotMatch(source, /<span>\{state\.error\}<\/span>/);
});
