"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { activeRecallStorageKey, isRecallAnswerText, recallModeLabels } from "@/lib/active-recall";

function clearMaskedNodes(article: Element) {
  article.querySelectorAll(".recall-answer-mask").forEach((node) => node.classList.remove("recall-answer-mask"));
  article.querySelectorAll("[data-recall-sensitive]").forEach((node) => node.removeAttribute("data-recall-sensitive"));
}

function markHeadingSection(heading: Element) {
  heading.setAttribute("data-recall-sensitive", "true");
  heading.classList.add("recall-answer-mask");

  let sibling = heading.nextElementSibling;
  while (sibling && !/^H[234]$/.test(sibling.tagName)) {
    sibling.setAttribute("data-recall-sensitive", "true");
    sibling.classList.add("recall-answer-mask");
    sibling = sibling.nextElementSibling;
  }
}

function markRecallTargets(article: Element) {
  clearMaskedNodes(article);

  for (const quote of Array.from(article.querySelectorAll("blockquote"))) {
    if (isRecallAnswerText(quote.textContent || "")) {
      quote.setAttribute("data-recall-sensitive", "true");
      quote.classList.add("recall-answer-mask");
    }
  }

  for (const heading of Array.from(article.querySelectorAll("h2, h3, h4"))) {
    if (isRecallAnswerText(heading.textContent || "")) markHeadingSection(heading);
  }

  return article.querySelectorAll("[data-recall-sensitive]").length;
}

export function ActiveRecallPanel() {
  const [active, setActive] = useState(false);
  const [maskedCount, setMaskedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        setActive(window.localStorage.getItem(activeRecallStorageKey) === "active");
      } catch {
        setActive(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const article = document.querySelector(".article");
    if (!article) return;
    const count = markRecallTargets(article);
    const frame = requestAnimationFrame(() => setMaskedCount(count));
    article.classList.toggle("article-recall-active", active);
    try {
      window.localStorage.setItem(activeRecallStorageKey, active ? "active" : "review");
    } catch {
      // The control still works for the current page when storage is blocked.
    }

    return () => {
      cancelAnimationFrame(frame);
      article.classList.remove("article-recall-active");
    };
  }, [active]);

  return (
    <div className={`active-recall-card ${active ? "active" : ""}`} aria-label="Active recall mode">
      <div className="reader-memory-heading">
        <span className="home-small-icon">{active ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}</span>
        <div>
          <span className="micro-label">Recall mode</span>
          <strong>{active ? recallModeLabels.active : recallModeLabels.review}</strong>
        </div>
      </div>

      <p>{active ? `${maskedCount} answer region${maskedCount === 1 ? "" : "s"} hidden. Recall first, then reveal.` : "Hide answers and final-answer sections before solving from memory."}</p>

      <div className="active-recall-actions">
        <button className="button primary" type="button" onClick={() => setActive((current) => !current)}>
          {active ? "Reveal answers" : "Hide answers"} {active ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
        </button>
        <button className="button ghost" type="button" onClick={() => setActive(false)}>
          Review <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
