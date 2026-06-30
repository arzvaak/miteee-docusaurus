"use client";

import { useMemo, useState } from "react";
import { BookmarkCheck, CheckCircle2, RotateCcw } from "lucide-react";
import type { CurrentAffairsRecallCard } from "@/lib/exam-types";
import {
  buildSscCurrentAffairsMistakeBankItem,
  mergeSscMistakeBank,
  parseSscMistakeBank,
  serializeSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";

type RecallOutcome = "known" | "missed";
type RecallMode = "all" | "due" | "missed" | "known";

type SavedCardState = Record<string, {
  savedAt: string;
  reviewedAt?: string;
  outcome?: RecallOutcome;
  card?: CurrentAffairsRecallCard;
}>;

const storageKey = "ssc-cgl-current-affairs-recall-cards";
const recallModes: Array<{ id: RecallMode; label: string; help: string }> = [
  { id: "all", label: "All cards", help: "Full daily queue" },
  { id: "due", label: "Review backlog", help: "Saved or missed retest" },
  { id: "missed", label: "Missed first", help: "Repair before new facts" },
  { id: "known", label: "Known", help: "Cleared today" }
];
const priorityRank: Record<CurrentAffairsRecallCard["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2
};

function readSavedCards(): SavedCardState {
  if (typeof window === "undefined") return {};
  try {
    const payload = window.localStorage.getItem(storageKey);
    if (!payload) return {};
    const parsed = JSON.parse(payload) as SavedCardState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSavedCards(cards: SavedCardState) {
  window.localStorage.setItem(storageKey, JSON.stringify(cards));
}

function writeCurrentAffairsMistake(card: CurrentAffairsRecallCard, outcome: RecallOutcome, savedAt: string) {
  const existing = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
  const nextItem = outcome === "missed" ? [buildSscCurrentAffairsMistakeBankItem(card, savedAt)] : [];
  const correctedQuestionIds = outcome === "known" ? [card.id] : [];
  const merged = mergeSscMistakeBank(existing, nextItem, correctedQuestionIds);

  window.localStorage.setItem(sscMistakeBankStorageKey, serializeSscMistakeBank(merged));
  window.dispatchEvent(new Event("storage"));
}

export function CurrentAffairsRecallClient({ cards }: { cards: CurrentAffairsRecallCard[] }) {
  const [saved, setSaved] = useState<SavedCardState>(() => readSavedCards());
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [recallMode, setRecallMode] = useState<RecallMode>("all");

  const allRecallCards = useMemo(() => {
    const byId = new Map(cards.map((card) => [card.id, card]));
    for (const state of Object.values(saved)) {
      if (state.card && !byId.has(state.card.id)) byId.set(state.card.id, state.card);
    }
    return [...byId.values()];
  }, [cards, saved]);

  const savedCount = useMemo(() => allRecallCards.filter((card) => saved[card.id]).length, [allRecallCards, saved]);
  const missedCount = useMemo(() => allRecallCards.filter((card) => saved[card.id]?.outcome === "missed").length, [allRecallCards, saved]);
  const knownCount = useMemo(() => allRecallCards.filter((card) => saved[card.id]?.outcome === "known").length, [allRecallCards, saved]);
  const dueCount = useMemo(() => allRecallCards.filter((card) => isDueCard(card, saved)).length, [allRecallCards, saved]);
  const sessionOutcomes = useMemo(() => allRecallCards.map((card) => saved[card.id]?.outcome).filter(Boolean) as RecallOutcome[], [allRecallCards, saved]);
  const sessionAccuracy = sessionOutcomes.length > 0
    ? Math.round(sessionOutcomes.filter((outcome) => outcome === "known").length / sessionOutcomes.length * 100)
    : 0;
  const queueCards = useMemo(() => {
    const modeCards = recallMode === "all" ? cards : allRecallCards;
    return modeCards
    .filter((card) => {
      const state = saved[card.id];
      if (recallMode === "due") return isDueCard(card, saved);
      if (recallMode === "missed") return state?.outcome === "missed";
      if (recallMode === "known") return state?.outcome === "known";
      return true;
    })
    .sort((a, b) => {
      const aState = saved[a.id];
      const bState = saved[b.id];
      const aMissed = aState?.outcome === "missed" ? 0 : 1;
      const bMissed = bState?.outcome === "missed" ? 0 : 1;
      if (aMissed !== bMissed) return aMissed - bMissed;
      const aDue = isDueCard(a, saved) ? 0 : 1;
      const bDue = isDueCard(b, saved) ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      const priorityOrder = priorityRank[a.priority] - priorityRank[b.priority];
      if (priorityOrder !== 0) return priorityOrder;
      return a.title.localeCompare(b.title);
    });
  }, [allRecallCards, cards, recallMode, saved]);

  const modeCounts = useMemo(() => ({
    all: cards.length,
    due: dueCount,
    missed: missedCount,
    known: knownCount
  }), [cards.length, dueCount, knownCount, missedCount]);

  function update(next: SavedCardState) {
    setSaved(next);
    writeSavedCards(next);
  }

  function saveCard(card: CurrentAffairsRecallCard) {
    update({
      ...saved,
      [card.id]: saved[card.id] ?? { savedAt: new Date().toISOString(), card }
    });
  }

  function markReviewed(card: CurrentAffairsRecallCard) {
    update({
      ...saved,
      [card.id]: {
        savedAt: saved[card.id]?.savedAt ?? new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        outcome: saved[card.id]?.outcome,
        card
      }
    });
  }

  function markOutcome(card: CurrentAffairsRecallCard, outcome: RecallOutcome) {
    const now = new Date().toISOString();
    writeCurrentAffairsMistake(card, outcome, now);
    update({
      ...saved,
      [card.id]: {
        savedAt: saved[card.id]?.savedAt ?? now,
        reviewedAt: now,
        outcome,
        card
      }
    });
    setRevealed((current) => ({ ...current, [card.id]: true }));
  }

  function resetCard(card: CurrentAffairsRecallCard) {
    const next = { ...saved };
    delete next[card.id];
    update(next);
    setRevealed((current) => {
      const nextRevealed = { ...current };
      delete nextRevealed[card.id];
      return nextRevealed;
    });
  }

  if (cards.length === 0) return null;

  return (
    <section className="panel ssc-current-recall" aria-label="Current affairs recall cards">
      <div className="ssc-panel-heading">
        <BookmarkCheck size={18} aria-hidden="true" />
        <strong>Recall queue</strong>
      </div>
      <div className="ssc-score-grid">
        <span><strong>{cards.length}</strong><small>cards today</small></span>
        <span><strong>{savedCount}</strong><small>saved</small></span>
        <span><strong>{dueCount}</strong><small>due</small></span>
        <span><strong>{missedCount}</strong><small>missed retest</small></span>
        <span><strong>{sessionAccuracy}%</strong><small>session accuracy</small></span>
      </div>
      <div className="ssc-current-recall-modes" aria-label="Recall queue mode">
        {recallModes.map((mode) => (
          <button
            type="button"
            className={recallMode === mode.id ? "active" : ""}
            onClick={() => setRecallMode(mode.id)}
            aria-pressed={recallMode === mode.id}
            key={mode.id}
          >
            <span>{mode.label}</span>
            <small>{modeCounts[mode.id]} · {mode.help}</small>
          </button>
        ))}
      </div>
      <div className="ssc-current-recall-grid">
        {queueCards.length === 0 ? (
          <article className="ssc-current-recall-empty">
            <strong>No cards in this queue.</strong>
            <p>Switch modes or finish today&apos;s missed repairs before adding more current-affairs facts.</p>
          </article>
        ) : queueCards.map((card) => {
          const state = saved[card.id];
          const reviewed = Boolean(state?.reviewedAt);
          const isRevealed = Boolean(revealed[card.id]);
          return (
            <article className={`ssc-current-recall-card${isRevealed ? " is-revealed" : ""}`} key={card.id}>
              <div>
                <span className={`ssc-status status-${card.priority}`}>{card.priority}</span>
                <h2>{card.prompt}</h2>
                <p>{card.memoryHook}</p>
              </div>
              {isRevealed ? (
                <div className="ssc-current-recall-answer">
                  <span>Answer</span>
                  <p><strong>{card.answer}</strong></p>
                  <small>Trap: {card.trap}</small>
                </div>
              ) : (
                <button className="ssc-current-recall-reveal" type="button" onClick={() => setRevealed((current) => ({ ...current, [card.id]: true }))}>
                  Reveal answer
                </button>
              )}
              <details>
                <summary>Source areas</summary>
                <p><strong>{card.answer}</strong></p>
                <small>{card.examAreas.join(" · ") || "Current affairs"}</small>
              </details>
              <div className="ssc-current-recall-outcomes" aria-label="Recall outcome">
                <button type="button" onClick={() => markOutcome(card, "known")} aria-pressed={state?.outcome === "known"}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>Know it</span>
                </button>
                <button type="button" onClick={() => markOutcome(card, "missed")} aria-pressed={state?.outcome === "missed"}>
                  <BookmarkCheck size={15} aria-hidden="true" />
                  <span>Missed</span>
                </button>
              </div>
              <div className="ssc-current-recall-actions">
                <button type="button" onClick={() => saveCard(card)} disabled={Boolean(state)}>
                  <BookmarkCheck size={15} aria-hidden="true" />
                  <span>{state ? "Saved" : "Save"}</span>
                </button>
                <button type="button" onClick={() => markReviewed(card)} disabled={!state || reviewed}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{reviewed ? "Reviewed" : "Save review"}</span>
                </button>
                <button type="button" onClick={() => resetCard(card)} disabled={!state}>
                  <RotateCcw size={15} aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function isDueCard(card: CurrentAffairsRecallCard, saved: SavedCardState) {
  const state = saved[card.id];
  return Boolean(state && (!state.reviewedAt || state.outcome === "missed"));
}
