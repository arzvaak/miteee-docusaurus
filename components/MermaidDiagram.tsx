"use client";

import {
  Code2,
  Copy,
  Focus,
  ListTree,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCcw,
  X
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent
} from "react";
import { createPortal } from "react-dom";
import { normalizeMermaidSource } from "@/lib/mermaid-normalize";
import styles from "./MermaidDiagram.module.css";

type RenderState = {
  error: string;
  svg: string;
};

type DiagramDimensions = {
  height: number;
  width: number;
};

type PanPoint = {
  x: number;
  y: number;
};

const minimumScale = 0.05;
const maximumScale = 6;

let mermaidImport: Promise<typeof import("mermaid").default> | null = null;

function mermaidId(id: string) {
  return `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function isDarkTheme() {
  const mode = document.documentElement.dataset.themeMode;
  if (mode === "dark" || mode === "light") return mode === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function loadMermaid() {
  mermaidImport ??= import("mermaid").then((module) => module.default);
  return mermaidImport;
}

function clampScale(value: number) {
  return Math.min(maximumScale, Math.max(minimumScale, value));
}

function dimensionsFromSvg(svg: string): DiagramDimensions {
  const viewBox = svg.match(/\bviewBox=["']([^"']+)["']/i)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);

  if (viewBox?.length === 4 && viewBox.every(Number.isFinite) && viewBox[2]! > 0 && viewBox[3]! > 0) {
    return { width: viewBox[2]!, height: viewBox[3]! };
  }

  const width = Number(svg.match(/<svg[^>]*\bwidth=["']([\d.]+)/i)?.[1]);
  const height = Number(svg.match(/<svg[^>]*\bheight=["']([\d.]+)/i)?.[1]);
  if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
    return { width, height };
  }

  return { width: 960, height: 540 };
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

  return { nodes, steps: steps.slice(0, 24) };
}

function FlowchartTextFallback({ source }: { source: string }) {
  const fallback = parseFlowchartFallback(source);

  return (
    <div className="diagram-fallback" role="group" aria-label="Ordered text version of diagram">
      <div className="diagram-fallback-heading">
        <ListTree size={15} aria-hidden="true" />
        <span>Diagram as ordered text</span>
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

function renderFlowchartFallback(source: string) {
  return <FlowchartTextFallback source={source} />;
}

export function MermaidDiagram({ source }: { source: string }) {
  const id = useId();
  const diagramId = useMemo(() => mermaidId(id), [id]);
  const dialogTitleId = `${diagramId}-dialog-title`;
  const dialogHelpId = `${diagramId}-dialog-help`;
  const normalizedSource = useMemo(() => normalizeMermaidSource(source), [source]);
  const [state, setState] = useState<RenderState>({ error: "", svg: "" });
  const [showSource, setShowSource] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<PanPoint>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [themeTick, setThemeTick] = useState(0);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const dimensions = useMemo(() => dimensionsFromSvg(state.svg), [state.svg]);
  const isWideDiagram = dimensions.width / dimensions.height > 6;
  const inlineMinimumWidth = isWideDiagram ? Math.min(2200, Math.max(1280, dimensions.width)) : undefined;

  const fitDiagram = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const horizontalRoom = Math.max(120, stage.clientWidth - 64);
    const verticalRoom = Math.max(120, stage.clientHeight - 64);
    const nextScale = clampScale(Math.min(horizontalRoom / dimensions.width, verticalRoom / dimensions.height));
    setScale(nextScale);
    setPan({ x: 0, y: 0 });
  }, [dimensions.height, dimensions.width]);

  const changeZoom = useCallback((factor: number) => {
    setScale((current) => clampScale(current * factor));
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setDragging(false);
    dragRef.current = null;
  }, []);

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

  useEffect(() => {
    if (!isOpen) return;
    const openButton = openButtonRef.current;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const animationFrame = requestAnimationFrame(() => {
      fitDiagram();
      closeButtonRef.current?.focus();
    });

    function handleDialogKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((element) => !element.hasAttribute("hidden"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(1.18);
      } else if (event.key === "-") {
        event.preventDefault();
        changeZoom(1 / 1.18);
      } else if (event.key === "0") {
        event.preventDefault();
        setScale(1);
        setPan({ x: 0, y: 0 });
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        fitDiagram();
      } else if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const distance = event.shiftKey ? 72 : 28;
        setPan((current) => ({
          x: current.x + (event.key === "ArrowLeft" ? distance : event.key === "ArrowRight" ? -distance : 0),
          y: current.y + (event.key === "ArrowUp" ? distance : event.key === "ArrowDown" ? -distance : 0)
        }));
      }
    }

    document.addEventListener("keydown", handleDialogKeyboard);
    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleDialogKeyboard);
      document.body.style.overflow = previousBodyOverflow;
      const restoreTarget = restoreFocusRef.current || openButton;
      requestAnimationFrame(() => restoreTarget?.focus());
    };
  }, [changeZoom, closeDialog, fitDiagram, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const stage = stageRef.current;
    if (!stage) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? 1.12 : 1 / 1.12);
    }

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [changeZoom, isOpen]);

  function openDialog() {
    setShowText(false);
    setShowSource(false);
    setIsOpen(true);
  }

  function resetDiagram() {
    setShowText(false);
    setShowSource(false);
    fitDiagram();
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y
    };
    setDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY
    });
  }

  function finishPointerDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setDragging(false);
  }

  const modal = isOpen && typeof document !== "undefined" ? createPortal(
    <div className={styles.backdrop} onPointerDown={(event) => event.target === event.currentTarget && closeDialog()}>
      <div
        ref={dialogRef}
        aria-describedby={dialogHelpId}
        aria-labelledby={dialogTitleId}
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <header className={styles.dialogHeader}>
          <div>
            <span className={styles.dialogEyebrow}>Interactive diagram</span>
            <h2 id={dialogTitleId}>Diagram viewer</h2>
          </div>
          <div className={styles.dialogActions} aria-label="Diagram view controls">
            <button type="button" onClick={fitDiagram} title="Fit diagram to window (F)">
              <Focus size={16} aria-hidden="true" /> <span>Fit</span>
            </button>
            <button type="button" onClick={() => changeZoom(1 / 1.18)} aria-label="Zoom out" title="Zoom out (-)">
              <Minus size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => changeZoom(1.18)} aria-label="Zoom in" title="Zoom in (+)">
              <Plus size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} aria-label="Set zoom to 100%" title="Show diagram at 100% (0)">
              100%
            </button>
            <output className={styles.zoomReadout} aria-live="polite" aria-label={`Current zoom ${Math.round(scale * 100)}%`}>
              {Math.round(scale * 100)}%
            </output>
            <button type="button" onClick={resetDiagram} title="Reset diagram view">
              <RotateCcw size={15} aria-hidden="true" /> <span>Reset</span>
            </button>
            <button
              type="button"
              aria-pressed={showText}
              onClick={() => { setShowText((value) => !value); setShowSource(false); }}
              title="Show an ordered text version"
            >
              <ListTree size={15} aria-hidden="true" /> <span>Text</span>
            </button>
            <button
              type="button"
              aria-pressed={showSource}
              onClick={() => { setShowSource((value) => !value); setShowText(false); }}
              title="Show diagram source"
            >
              <Code2 size={15} aria-hidden="true" /> <span>Source</span>
            </button>
            <button ref={closeButtonRef} className={styles.closeButton} type="button" onClick={closeDialog} aria-label="Close diagram viewer">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={styles.dialogBody}>
          <div
            ref={stageRef}
            aria-label="Zoomable diagram canvas. Drag to pan or use arrow keys. Use the mouse wheel, plus, or minus to zoom."
            className={`${styles.stage}${dragging ? ` ${styles.dragging}` : ""}`}
            tabIndex={0}
            onDoubleClick={fitDiagram}
            onPointerCancel={finishPointerDrag}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
          >
            <div
              className={styles.modalSurface}
              style={{
                height: `${dimensions.height}px`,
                left: `calc(50% + ${pan.x}px)`,
                top: `calc(50% + ${pan.y}px)`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: `${dimensions.width}px`
              }}
            >
              <div className={styles.modalSvg} dangerouslySetInnerHTML={{ __html: state.svg }} />
            </div>
            <span className={styles.panBadge}><Move size={14} aria-hidden="true" /> Drag to pan</span>
          </div>

          {(showText || showSource) && (
            <aside className={styles.textPanel} aria-label={showText ? "Diagram text version" : "Diagram source"}>
              {showText ? <FlowchartTextFallback source={normalizedSource} /> : <pre className="mermaid-source"><code>{normalizedSource}</code></pre>}
            </aside>
          )}
        </div>

        <p className={styles.dialogHelp} id={dialogHelpId}>
          Wheel or +/− zooms · drag or arrow keys pans · F fits · 0 returns to 100% · Esc closes
        </p>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className={`${styles.shell} mermaid-shell`}>
      <div className={`${styles.toolbar} mermaid-toolbar`}>
        <span><Maximize2 size={14} aria-hidden="true" /> Diagram</span>
        <span className={`${styles.inlineActions} code-block-actions`}>
          <button ref={openButtonRef} className={`${styles.toolButton} code-tool`} type="button" onClick={openDialog} disabled={!state.svg}>
            <Maximize2 size={13} aria-hidden="true" /> Expand
          </button>
          <button className={`${styles.toolButton} code-tool`} type="button" aria-expanded={showSource && !isOpen} onClick={() => setShowSource((value) => !value)}>
            <Code2 size={13} aria-hidden="true" /> Source
          </button>
          <button className={`${styles.toolButton} code-tool`} type="button" onClick={() => void navigator.clipboard?.writeText(normalizedSource)}>
            <Copy size={13} aria-hidden="true" /> Copy
          </button>
        </span>
      </div>
      <div className={`${styles.inlineViewport} mermaid-canvas`}>
        {state.svg ? (
          isOpen ? (
            <div className={styles.inlineOpenNotice} role="status">Diagram opened in the viewer</div>
          ) : (
            <div className={styles.inlineSurface} style={{ minWidth: inlineMinimumWidth ? `${inlineMinimumWidth}px` : undefined }}>
              <div className={`${styles.inlineSvg} mermaid-svg`} dangerouslySetInnerHTML={{ __html: state.svg }} />
            </div>
          )
        ) : state.error ? (
          renderFlowchartFallback(normalizedSource)
        ) : (
          <div className="diagram-loading" role="status">Rendering diagram</div>
        )}
      </div>
      {showSource && !isOpen && <pre className="mermaid-source"><code>{normalizedSource}</code></pre>}
      {modal}
    </div>
  );
}
