"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlignLeft, Check, Focus, Minus, Plus } from "lucide-react";
import styles from "./SscBookReader.module.css";

type Item = { id: string; title: string; kind: string };
export function SscBookReadingShell({ children, outline, slug }: { children: ReactNode; outline: Item[]; slug: string }) {
  const [active, setActive] = useState(outline[0]?.id || "");
  const [size, setSize] = useState(18);
  const [focus, setFocus] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-100px 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("[data-reading-section]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [slug]);
  useEffect(() => {
    try { if (localStorage.getItem(`ssc-book-read:${slug}`) === "true") queueMicrotask(() => setCompleted(true)); } catch { /* Reading works without storage. */ }
  }, [slug]);
  function toggleComplete() {
    const next = !completed; setCompleted(next);
    try { localStorage.setItem(`ssc-book-read:${slug}`, String(next)); } catch { /* Keep the session state. */ }
  }
  return <div className={`${styles.shell} ${focus ? styles.focused : ""}`} style={{ "--book-font-size": `${size}px` } as React.CSSProperties}>
    <div className={styles.toolbar}><button type="button" onClick={() => setContentsOpen(!contentsOpen)} aria-expanded={contentsOpen} aria-controls="book-contents"><AlignLeft size={16} /> Contents</button><div><button type="button" aria-label="Decrease text size" disabled={size <= 16} onClick={() => setSize(size - 1)}><Minus size={15} /></button><span aria-live="polite">{size}px</span><button type="button" aria-label="Increase text size" disabled={size >= 23} onClick={() => setSize(size + 1)}><Plus size={15} /></button><button type="button" aria-pressed={focus} onClick={() => setFocus(!focus)}><Focus size={16} /><span>Focus</span></button></div></div>
    <aside className={`${styles.outline} ${contentsOpen ? styles.contentsOpen : ""}`} id="book-contents" aria-label="Chapter contents"><p className={styles.eyebrow}>IN THIS CHAPTER</p><nav>{outline.map(item => <a href={`#${item.id}`} key={item.id} aria-current={active === item.id ? "location" : undefined} className={item.kind === "example" ? styles.exampleLink : ""} onClick={(event) => { event.preventDefault(); setActive(item.id); setContentsOpen(false); requestAnimationFrame(() => { document.getElementById(item.id)?.scrollIntoView({ block: "start" }); history.replaceState(null, "", `#${item.id}`); }); }}>{item.title}</a>)}</nav><button className={styles.complete} type="button" onClick={toggleComplete} aria-pressed={completed}><Check size={16} /> {completed ? "Chapter read" : "Mark as read"}</button></aside>
    {children}
  </div>;
}
