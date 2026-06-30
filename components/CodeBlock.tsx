"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { codeBlockCopyText, normalizeCodeLanguage } from "@/lib/code-block";

type CopyState = "idle" | "copied" | "failed";

export function CodeBlock({ className = "", text }: { className?: string; text: string }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const language = normalizeCodeLanguage(className);
  const copyText = codeBlockCopyText(text);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  return (
    <div className="code-block-shell">
      <div className="code-block-toolbar">
        <span>{language}</span>
        <span className="code-block-actions">
          <button className="code-tool" type="button" onClick={copyCode} data-copy-code>
            {copyState === "copied" ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copyState === "failed" ? "Select code" : copyState === "copied" ? "Copied" : "Copy"}
          </button>
        </span>
      </div>
      <pre><code className={className} data-language={language === "code" ? undefined : language}>{copyText}</code></pre>
    </div>
  );
}
