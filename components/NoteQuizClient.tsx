"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NoteQuizClient() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const initialized = new WeakSet<Element>();

    const setupBlock = (block: Element) => {
      if (initialized.has(block)) return;
      initialized.add(block);
      const correct = block.getAttribute("data-answer")?.toLowerCase();
      const options = block.querySelectorAll<HTMLElement>(".quiz-option[data-opt]");
      const details = block.querySelector<HTMLDetailsElement>(".quiz-exp");
      const summary = details?.querySelector("summary");

      block.classList.remove("answered");
      if (details) details.open = false;
      options.forEach((option) => {
        option.classList.remove("q-correct", "q-wrong");
        option.removeAttribute("data-correct");
      });

      if (!correct) return;

      const blockSummaryUntilAnswered = (event: Event) => {
        if (block.classList.contains("answered")) return;
        if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
      };

      if (summary) {
        summary.setAttribute("aria-disabled", "true");
        summary.addEventListener("click", blockSummaryUntilAnswered);
        summary.addEventListener("keydown", blockSummaryUntilAnswered);
        cleanups.push(() => {
          summary.removeEventListener("click", blockSummaryUntilAnswered);
          summary.removeEventListener("keydown", blockSummaryUntilAnswered);
        });
      }

      options.forEach((option) => {
        const optionKey = option.getAttribute("data-opt")?.toLowerCase();
        if (!optionKey) return;

        option.setAttribute("tabindex", "0");
        option.setAttribute("role", "button");
        option.setAttribute("aria-label", `Choose option ${optionKey.toUpperCase()}`);

        const reveal = () => {
          if (block.classList.contains("answered")) return;
          block.classList.add("answered");
          if (summary) summary.setAttribute("aria-disabled", "false");
          options.forEach((item) => {
            const itemKey = item.getAttribute("data-opt")?.toLowerCase();
            if (itemKey === correct) item.classList.add("q-correct");
            else if (item === option) item.classList.add("q-wrong");
          });
          if (details) details.open = true;
        };

        const onClick = () => reveal();
        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          reveal();
        };

        option.addEventListener("click", onClick);
        option.addEventListener("keydown", onKeyDown);
        cleanups.push(() => {
          option.removeEventListener("click", onClick);
          option.removeEventListener("keydown", onKeyDown);
        });
      });
    };

    const setupAllBlocks = () => {
      document.querySelectorAll(".note-quiz-block").forEach(setupBlock);
    };

    setupAllBlocks();

    const observer = new MutationObserver(() => setupAllBlocks());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
