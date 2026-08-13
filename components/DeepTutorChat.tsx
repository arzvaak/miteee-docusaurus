"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, BrainCircuit, Eraser, Send, Sparkles, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { type DeepTutorCapability, type DeepTutorNoteContext } from "@/lib/deeptutor";
import { useDeepTutorModels } from "@/lib/deeptutor-model-client";
import { DeepTutorModelSettings } from "@/components/DeepTutorModelSettings";
import styles from "@/components/DeepTutorChat.module.css";

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
const modes: Array<{ value: DeepTutorCapability; label: string; description: string }> = [
  { value: "chat", label: "Tutor", description: "Explain, connect, and plan" },
  { value: "deep_solve", label: "Deep solve", description: "Work through hard problems" },
  { value: "deep_question", label: "Quiz me", description: "Test recall and reasoning" }
];

function messageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStoredState(): StoredTutorState {
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

export function DeepTutorChat({ initialNote }: { initialNote: DeepTutorNoteContext | null }) {
  const models = useDeepTutorModels();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [mode, setMode] = useState<DeepTutorCapability>("chat");
  const [note, setNote] = useState(initialNote);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredState();
      setMessages(stored.messages);
      setSessionId(stored.sessionId);
      setStorageReady(true);
      composerRef.current?.focus();
    }, 0);
    fetch("/api/deeptutor", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { available?: boolean } | null) => setAvailable(Boolean(payload?.available)))
      .catch(() => setAvailable(false));
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages: messages.slice(-40) }));
    } catch {}
  }, [messages, sessionId, storageReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, stage]);

  const prompts = useMemo(() => note ? [
    "Teach me the central idea in this note",
    "Give me a difficult problem from this note",
    "Quiz me until I can recall the key formulas"
  ] : [
    "Build my study plan for today",
    "Find connections across my notes",
    "Quiz me on a weak topic",
    "Explain something I am likely to misunderstand"
  ], [note]);

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
          if (event.type === "stage_end" || event.type === "done") setStage("");
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

  return (
    <div className={styles.page}>
      <aside className={styles.rail}>
        <Link className={styles.back} href="/"><ArrowLeft size={15} /> Dashboard</Link>
        <div className={styles.identity}>
          <span className={styles.mark}><BrainCircuit size={23} /></span>
          <div><span>Private workspace</span><strong>DeepTutor</strong></div>
        </div>
        <div className={styles.status}>
          <span className={available === false ? styles.offline : styles.online} />
          {available === false ? "Service unavailable" : available ? "Tutor online" : "Checking tutor"}
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
        <div className={styles.modeList} aria-label="Tutor mode">
          {modes.map((option) => (
            <button
              className={mode === option.value ? styles.activeMode : ""}
              type="button"
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              key={option.value}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
        {note ? (
          <div className={styles.context}>
            <BookOpen size={16} />
            <div><span>{note.courseCode || "MITEEE"}</span><strong>{note.title}</strong></div>
            <button type="button" onClick={() => setNote(null)}>Detach</button>
          </div>
        ) : (
          <div className={styles.libraryNote}><BookOpen size={16} /><span>Searching all indexed MITEEE notes</span></div>
        )}
        <button className={styles.clear} type="button" onClick={clearConversation}><Eraser size={15} /> New conversation</button>
      </aside>

      <section className={styles.chat} aria-label="DeepTutor chat">
        <header className={styles.mobileHeader}>
          <div><span>Private chat</span><strong>DeepTutor</strong></div>
          <button type="button" onClick={clearConversation} aria-label="New tutor conversation"><Eraser size={17} /></button>
        </header>

        <div className={styles.messages} aria-live="polite" aria-busy={streaming}>
          {messages.length === 0 ? (
            <div className={styles.welcome}>
              <span className={styles.welcomeIcon}><Sparkles size={26} /></span>
              <p>DeepTutor chat</p>
              <h1>What do you want to understand?</h1>
              <span className={styles.lede}>Work through a hard derivation, connect ideas across the library, or turn the notes into a proper oral exam.</span>
              <div className={styles.prompts}>
                {prompts.map((prompt) => <button type="button" onClick={() => askTutor(prompt)} key={prompt}>{prompt}</button>)}
              </div>
            </div>
          ) : messages.map((message) => (
            <article className={message.role === "user" ? styles.userMessage : styles.assistantMessage} key={message.id}>
              <span className={styles.speaker}>{message.role === "user" ? "You" : "DeepTutor"}</span>
              {message.content ? (
                <div className={styles.markdown}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
                    components={{ a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a> }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : <span className={styles.thinking}>Thinking through your notes…</span>}
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

        <form className={styles.composerWrap} onSubmit={(event) => { event.preventDefault(); askTutor(); }}>
          <div className={styles.composer}>
            <textarea
              ref={composerRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  askTutor();
                }
              }}
              placeholder={note ? `Ask about ${note.title}…` : "Ask anything from your study library…"}
              maxLength={8000}
              rows={2}
            />
            {streaming ? (
              <button className={styles.stop} type="button" onClick={stopTurn} aria-label="Stop tutor"><Square size={15} fill="currentColor" /></button>
            ) : (
              <button className={styles.send} type="submit" disabled={!input.trim()} aria-label="Send to DeepTutor"><Send size={18} /></button>
            )}
          </div>
          <small>DeepTutor uses the private MITEEE knowledge base · Enter to send</small>
        </form>
      </section>
    </div>
  );
}
