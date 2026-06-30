"use client";

import { Code2, Copy, Maximize2, RefreshCw } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { normalizeMermaidSource } from "@/lib/mermaid-normalize";

type RenderState = {
  error: string;
  svg: string;
};

let mermaidImport: Promise<typeof import("mermaid").default> | null = null;

function mermaidId(id: string) {
  return `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function isDarkTheme() {
  return document.documentElement.dataset.theme !== "light";
}

function loadMermaid() {
  mermaidImport ??= import("mermaid").then((module) => module.default);
  return mermaidImport;
}

function cleanMermaidLabel(value: string) {
  return value
    .replace(/^["']|["']$/g, "")
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function labelFromNodeToken(token: string) {
  const bracket = token.match(/^[A-Za-z][\w-]*[\[{]("?[^\]}]+"?)[\]}]$/);
  if (bracket?.[1]) return cleanMermaidLabel(bracket[1]);
  return cleanMermaidLabel(token.replace(/^[A-Za-z][\w-]*/, ""));
}

function parseFlowchartFallback(source: string) {
  const nodes = new Map<string, string>();
  const steps: Array<{ from: string; label: string; to: string }> = [];

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line || /^(?:flowchart|graph)\b/i.test(line)) continue;
    const edge = line.match(/^([A-Za-z][\w-]*(?:[\[{][^\]}]+[\]}])?)\s*(?:--\s*(?:"([^"]+)"|\|([^|]+)\|)?\s*--?>|-->|---|==>|-\.->)\s*([A-Za-z][\w-]*(?:[\[{][^\]}]+[\]}])?)/);
    if (!edge) continue;

    const fromId = edge[1]?.match(/^([A-Za-z][\w-]*)/)?.[1];
    const toId = edge[4]?.match(/^([A-Za-z][\w-]*)/)?.[1];
    if (!fromId || !toId) continue;
    const fromLabel = labelFromNodeToken(edge[1] || fromId) || fromId;
    const toLabel = labelFromNodeToken(edge[4] || toId) || toId;
    nodes.set(fromId, fromLabel);
    nodes.set(toId, toLabel);
    steps.push({ from: fromId, label: cleanMermaidLabel(edge[2] || edge[3] || ""), to: toId });
  }

  return { nodes, steps: steps.slice(0, 12) };
}

function renderFlowchartFallback(source: string) {
  const fallback = parseFlowchartFallback(source);

  return (
    <div className="diagram-fallback" role="group" aria-label="Diagram source preserved">
      <div className="diagram-fallback-heading">
        <RefreshCw size={15} aria-hidden="true" />
        <span>Diagram source preserved</span>
      </div>
      {fallback.steps.length > 0 ? (
        <ol className="diagram-fallback-steps">
          {fallback.steps.map((step, index) => (
            <li key={`${step.from}-${step.to}-${index}`}>
              <strong>{fallback.nodes.get(step.from) || step.from}</strong>
              {step.label ? <em>{step.label}</em> : <span aria-hidden="true">→</span>}
              <strong>{fallback.nodes.get(step.to) || step.to}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <pre className="mermaid-source compact"><code>{source}</code></pre>
      )}
    </div>
  );
}

export function MermaidDiagram({ source }: { source: string }) {
  const id = useId();
  const diagramId = useMemo(() => mermaidId(id), [id]);
  const normalizedSource = useMemo(() => normalizeMermaidSource(source), [source]);
  const [state, setState] = useState<RenderState>({ error: "", svg: "" });
  const [showSource, setShowSource] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick((tick) => tick + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      setState({ error: "", svg: "" });
      try {
        const mermaid = await loadMermaid();
        const dark = isDarkTheme();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: dark ? "dark" : "default",
          themeVariables: {
            background: "transparent",
            primaryColor: dark ? "#14202c" : "#ffffff",
            primaryTextColor: dark ? "#f3f7fb" : "#17202a",
            primaryBorderColor: dark ? "#2f4055" : "#d6dee8",
            lineColor: dark ? "#8ba4bd" : "#4c5d70",
            fontFamily: "Inter, system-ui, sans-serif"
          }
        });
        const result = await mermaid.render(`${diagramId}-${themeTick}`, normalizedSource);
        if (!cancelled) setState({ error: "", svg: result.svg });
      } catch (error) {
        if (!cancelled) setState({ error: error instanceof Error ? error.message : "Diagram could not be rendered.", svg: "" });
      }
    }

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [diagramId, normalizedSource, themeTick]);

  return (
    <div className={zoomed ? "mermaid-shell zoomed" : "mermaid-shell"}>
      <div className="mermaid-toolbar">
        <span><Maximize2 size={14} aria-hidden="true" /> Diagram</span>
        <span className="code-block-actions">
          <button className="code-tool" type="button" onClick={() => setZoomed((value) => !value)}>{zoomed ? "Fit" : "Zoom"}</button>
          <button className="code-tool" type="button" onClick={() => setShowSource((value) => !value)}><Code2 size={13} aria-hidden="true" /> Source</button>
          <button className="code-tool" type="button" onClick={() => void navigator.clipboard?.writeText(normalizedSource)}><Copy size={13} aria-hidden="true" /> Copy</button>
        </span>
      </div>
      <div className="mermaid-canvas" data-zoomed={zoomed}>
        {state.svg ? (
          <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: state.svg }} />
        ) : state.error ? (
          renderFlowchartFallback(normalizedSource)
        ) : (
          <div className="diagram-loading">Rendering diagram</div>
        )}
      </div>
      {showSource && <pre className="mermaid-source"><code>{normalizedSource}</code></pre>}
    </div>
  );
}
