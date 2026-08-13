"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Eraser, Maximize2, Send, Sparkles, Square, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { type DeepTutorCapability, type DeepTutorNoteContext } from "@/lib/deeptutor";
import { useDeepTutorModels } from "@/lib/deeptutor-model-client";
import { DeepTutorModelSettings } from "@/components/DeepTutorModelSettings";
import styles from "@/components/DeepTutorDrawer.module.css";

type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type TutorEvent = {
  type?: string;
  content?: string;
  stage?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
};

type StoredTutorState = {
  sessionId: string | null;
  messages: TutorMessage[];
};

const storageKey = "miteee-deeptutor-v1";
const modeOptions: Array<{ value: DeepTutorCapability; label: string }> = [
  { value: "chat", label: "Tutor" },
  { value: "deep_solve", label: "Deep solve" },
  { value: "deep_question", label: "Quiz me" }
];

function messageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentNoteContext(): DeepTutorNoteContext | null {
  const page = document.querySelector<HTMLElement>("[data-tutor-note-slug]");
  if (!page?.dataset.tutorNoteSlug || !page.dataset.tutorNoteTitle) return null;
  return {
    slug: page.dataset.tutorNoteSlug,
    title: page.dataset.tutorNoteTitle,
    courseCode: page.dataset.tutorCourseCode || null,
    courseName: page.dataset.tutorCourseName || null,
    pathname: window.location.pathname
  };
}

function eventSources(event: TutorEvent) {
  const candidates = [event.metadata?.sources, event.metadata?.citations];
  const labels: string[] = [];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    for (const source of candidate) {
      if (typeof source === "string") labels.push(source);
      else if (source && typeof source === "object") {
        const item = source as Record<string, unknown>;
        const label = item.title || item.name || item.filename || item.url;
        if (typeof label === "string") labels.push(label);
      }
    }
  }
  return [...new Set(labels)].slice(0, 8);
}

function loadStoredState(): StoredTutorState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null") as StoredTutorState | null;
    if (!parsed || !Array.isArray(parsed.messages)) throw new Error("invalid state");
    return {
      sessionId: typeof parsed.sessionId === "string" ? parsed.sessionId : null,
      messages: parsed.messages.filter((message) => (
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
      )).slice(-40)
    };
  } catch {
    return { sessionId: null, messages: [] };
  }
}

export function DeepTutorDrawer({ hasAccess, available: initialAvailability }: { hasAccess: boolean; available: boolean | null }) {
  const models = useDeepTutorModels(hasAccess);
  const [open, setOpen] = useState(false);
  const [availabilityOverride, setAvailable] = useState<boolean | null>(null);
  const available = availabilityOverride ?? initialAvailability;
  const [mode, setMode] = useState<DeepTutorCapability>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [note, setNote] = useState<DeepTutorNoteContext | null>(null);
  const [stage, setStage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!hasAccess) return;
    const storageTimer = window.setTimeout(() => {
      const stored = loadStoredState();
      setMessages(stored.messages);
      setSessionId(stored.sessionId);
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(storageTimer);
  }, [hasAccess]);

  useEffect(() => {
    if (!hasAccess || !storageReady) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages: messages.slice(-40) }));
    } catch {}
  }, [hasAccess, messages, sessionId, storageReady]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function openDrawer() {
    setNote(currentNoteContext());
    setOpen(true);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, stage]);

  const quickPrompts = useMemo(() => note
    ? ["Explain this note simply", "Test me on the key ideas", "Show the hardest derivation"]
    : ["Plan my next study session", "Quiz me from my notes", "Find a weak topic to revise"], [note]);

  async function askTutor(prompt = input) {
    const message = prompt.trim();
    if (!message || streaming) return;

    const userMessage: TutorMessage = { id: messageId("user"), role: "user", content: message };
    const assistantId = messageId("assistant");
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setStage("Connecting");
    setStreaming(true);
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch("/api/deeptutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId, capability: mode, note, model: models.selected }),
        signal: abortController.signal
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || `Tutor returned ${response.status}`);
      }

      setAvailable(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (!finished) {
        const chunk = await reader.read();
        finished = chunk.done;
        buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !finished });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as TutorEvent;
          const nextSessionId = event.session_id || (typeof event.metadata?.session_id === "string" ? event.metadata.session_id : "");
          if (nextSessionId) setSessionId(nextSessionId);
          if (event.type === "stage_start") setStage(event.stage || "Working");
          if (event.type === "stage_end") setStage("");
          if (event.type === "thinking") setStage("Reasoning");
          if (event.type === "tool_call") setStage("Searching notes");
          if (event.type === "content" && event.content) {
            setMessages((current) => current.map((item) => item.id === assistantId
              ? { ...item, content: `${item.content}${event.content}` }
              : item));
          }
          const sources = eventSources(event);
          if (sources.length) {
            setMessages((current) => current.map((item) => item.id === assistantId
              ? { ...item, sources: [...new Set([...(item.sources || []), ...sources])] }
              : item));
          }
          if (event.type === "error") throw new Error(event.content || "DeepTutor could not complete this turn.");
          if (event.type === "done") setStage("");
        }
      }
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") {
        const messageText = (caught as Error).message || "The tutor could not answer.";
        setError(messageText);
        setMessages((current) => current.map((item) => item.id === assistantId && !item.content
          ? { ...item, content: "I couldn't complete that turn. Check the tutor service and try again." }
          : item));
        setAvailable(false);
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
      setStage("");
    }
  }

  function stopTurn() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    setStage("");
  }

  async function clearConversation() {
    stopTurn();
    const activeSessionId = sessionId;
    setMessages([]);
    setSessionId(null);
    setError("");
    try { window.localStorage.removeItem(storageKey); } catch {}
    if (activeSessionId) {
      await fetch("/api/deeptutor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId })
      }).catch(() => null);
    }
  }

  if (!hasAccess) return null;

  return (
    <>
      <button
        className={styles.launcher}
        type="button"
        onClick={openDrawer}
        aria-label="Open private DeepTutor"
        title="DeepTutor"
      >
        <Sparkles size={17} aria-hidden="true" />
        <span className={available === false ? styles.offlineDot : styles.onlineDot} aria-hidden="true" />
      </button>

      {open ? (
        <div className={styles.backdrop} role="presentation" onPointerDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="deeptutor-title">
            <header className={styles.header}>
              <div className={styles.titleGroup}>
                <span className={styles.mark}><BrainCircuit size={20} aria-hidden="true" /></span>
                <div>
                  <span>Private workspace</span>
                  <strong id="deeptutor-title">DeepTutor</strong>
                </div>
              </div>
              <div className={styles.headerActions}>
                <Link
                  href={note ? `/tutor?note=${encodeURIComponent(note.slug)}` : "/tutor"}
                  onClick={() => setOpen(false)}
                  aria-label="Open full DeepTutor chat"
                  title="Open full chat"
                >
                  <Maximize2 size={16} />
                </Link>
                <button type="button" onClick={clearConversation} aria-label="Clear tutor conversation" title="Clear conversation"><Eraser size={16} /></button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close DeepTutor"><X size={18} /></button>
              </div>
            </header>

            <div className={styles.modeBar} aria-label="Tutor mode">
              {modeOptions.map((option) => (
                <button
                  className={mode === option.value ? styles.activeMode : ""}
                  type="button"
                  onClick={() => setMode(option.value)}
                  aria-pressed={mode === option.value}
                  key={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <DeepTutorModelSettings
              options={models.options}
              selected={models.selected}
              oauth={models.oauth}
              savedSshCommand={models.sshCommand}
              loading={models.loading}
              onSelect={models.select}
              onRefresh={models.refresh}
            />

            {note ? (
              <div className={styles.contextCard}>
                <span>{note.courseCode || "MITEEE"}</span>
                <strong>{note.title}</strong>
                <small>Attached as the current study context</small>
              </div>
            ) : null}

            <div className={styles.messages} aria-live="polite" aria-busy={streaming}>
              {messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <Sparkles size={24} aria-hidden="true" />
                  <h2>Your notes, with a proper tutor attached.</h2>
                  <p>Ask for an explanation, a derivation, a study plan, or a targeted quiz. This drawer and its API are only available to authorized accounts.</p>
                  <div className={styles.quickPrompts}>
                    {quickPrompts.map((prompt) => <button type="button" onClick={() => askTutor(prompt)} key={prompt}>{prompt}</button>)}
                  </div>
                </div>
              ) : messages.map((message) => (
                <article className={message.role === "user" ? styles.userMessage : styles.assistantMessage} key={message.id}>
                  <span>{message.role === "user" ? "You" : "DeepTutor"}</span>
                  {message.content ? (
                    <div className={styles.markdown}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
                        components={{
                          a({ href, children }) {
                            return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : <span className={styles.typing}>Thinking</span>}
                  {message.sources?.length ? (
                    <details className={styles.sources}>
                      <summary>{message.sources.length} note source{message.sources.length === 1 ? "" : "s"}</summary>
                      <ul>{message.sources.map((source) => <li key={source}>{source}</li>)}</ul>
                    </details>
                  ) : null}
                </article>
              ))}
              {stage ? <div className={styles.stage}><span />{stage}</div> : null}
              {error ? <p className={styles.error}>{error}</p> : null}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); askTutor(); }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askTutor();
                  }
                }}
                placeholder={note ? "Ask about this note…" : "Ask your tutor…"}
                maxLength={8000}
                rows={2}
              />
              {streaming ? (
                <button className={styles.stopButton} type="button" onClick={stopTurn} aria-label="Stop tutor"><Square size={15} fill="currentColor" /></button>
              ) : (
                <button className={styles.sendButton} type="submit" disabled={!input.trim()} aria-label="Send to DeepTutor"><Send size={17} /></button>
              )}
              <small>Enter to send · Shift+Enter for a new line</small>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
