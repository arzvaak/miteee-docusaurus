import assert from "node:assert/strict";
import test from "node:test";
import { codeBlockCopyText, normalizeCodeLanguage } from "../lib/code-block";

test("codeBlockCopyText removes the parser-added terminal newline only", () => {
  const output = codeBlockCopyText("const gain = 20;\n\n");

  assert.equal(output, "const gain = 20;\n");
});

test("normalizeCodeLanguage keeps readable labels for copied note blocks", () => {
  assert.equal(normalizeCodeLanguage("language-python"), "python");
  assert.equal(normalizeCodeLanguage("language-cpp extra-token"), "cpp");
  assert.equal(normalizeCodeLanguage(""), "code");
});
