"""Build the next SSC CGL uploaded-book corpus recovery queue.

This is a source-level queue for missing indexed MCQs. It does not invent
questions; it records where the next OCR/answer-evidence pass must focus.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = ROOT / "data" / "exams" / "ssc-cgl"
MANIFEST_PATH = DATA_ROOT / "book-sources" / "manifest.json"
PROGRESS_PATH = DATA_ROOT / "book-sources" / "mistral-ocr-import-progress.json"
COMPLETENESS_PATH = DATA_ROOT / "book-imports" / "corpus-completeness-audit.json"
OUTPUT_JSON = DATA_ROOT / "book-imports" / "recovery-queue.json"
OUTPUT_MD = DATA_ROOT / "book-imports" / "recovery-queue.md"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fallback


def text(value: object) -> str:
    return str(value or "").strip()


def priority_for(row: dict[str, Any]) -> int:
    missing = int(row.get("missingFromExpected") or 0)
    answer_missing = int(row.get("ocrAnswerMissing") or row.get("missingAnswerEvidence") or 0)
    not_segmented = int(row.get("notSegmentedOrNotAligned") or 0)
    post_answer_drop = int(row.get("promotionDropAfterAnswerEvidence") or 0)
    return missing * 10 + answer_missing * 4 + not_segmented * 3 + post_answer_drop * 2


def action_for(row: dict[str, Any]) -> list[str]:
    actions: list[str] = []
    not_segmented = int(row.get("notSegmentedOrNotAligned") or 0)
    answer_missing = int(row.get("ocrAnswerMissing") or row.get("missingAnswerEvidence") or 0)
    post_answer_drop = int(row.get("promotionDropAfterAnswerEvidence") or 0)
    mismatched = int(row.get("ocrAnswerMismatched") or 0)
    if not_segmented > 0:
        actions.append("rerun Mistral OCR/segmentation on weak page ranges and compare against index counts")
    if answer_missing > 0:
        actions.append("recover answer evidence from answer-key and solution pages")
    if mismatched > 0:
        actions.append("send answer mismatches through DeepSeek/Mistral/GPT consensus")
    if post_answer_drop > 0:
        actions.append("inspect promoted-drop rows for malformed options, exact duplicates, or topic-review quarantine")
    if not actions:
        actions.append("verify expected count and exact-duplicate policy before changing promoted corpus")
    return actions


def merge_rows() -> list[dict[str, Any]]:
    manifest = load_json(MANIFEST_PATH, {})
    progress = load_json(PROGRESS_PATH, {})
    completeness = load_json(COMPLETENESS_PATH, {})
    manifest_sources = {
        text(source.get("id")): source
        for source in manifest.get("sources", [])
        if isinstance(source, dict) and text(source.get("id"))
    }
    progress_sources = {
        text(source.get("sourceId")): source
        for source in progress.get("sources", [])
        if isinstance(source, dict) and text(source.get("sourceId"))
    }
    completeness_sources = {
        text(source.get("sourceId")): source
        for source in completeness.get("sources", [])
        if isinstance(source, dict) and text(source.get("sourceId"))
    }
    source_ids = sorted(set(manifest_sources) | set(progress_sources) | set(completeness_sources))
    rows: list[dict[str, Any]] = []
    for source_id in source_ids:
        manifest_row = manifest_sources.get(source_id, {})
        progress_row = progress_sources.get(source_id, {})
        completeness_row = completeness_sources.get(source_id, {})
        expected = int(completeness_row.get("expectedQuestionCount") or 0)
        segmented = int(progress_row.get("segmentedCandidates") or completeness_row.get("segmentedCandidates") or 0)
        answer_rows = int(progress_row.get("ocrAnswerMatched") or completeness_row.get("answerEvidenceRows") or 0)
        promoted = int(completeness_row.get("promotedQuestions") or progress_row.get("promotedQuestions") or 0)
        missing_from_expected = int(completeness_row.get("missingFromExpected") or max(0, expected - promoted))
        row = {
            "sourceId": source_id,
            "title": text(manifest_row.get("title") or progress_row.get("title") or source_id),
            "section": text(manifest_row.get("section") or progress_row.get("section")),
            "file": text(manifest_row.get("file") or progress_row.get("file")),
            "role": text(manifest_row.get("role") or progress_row.get("role")),
            "pageCount": int(manifest_row.get("pageCount") or progress_row.get("pageCount") or 0),
            "expectedQuestionCount": expected,
            "segmentedCandidates": segmented,
            "answerEvidenceRows": answer_rows,
            "ocrAnswerMissing": int(progress_row.get("ocrAnswerMissing") or completeness_row.get("missingAnswerEvidence") or 0),
            "ocrAnswerMismatched": int(progress_row.get("ocrAnswerMismatched") or 0),
            "promotedQuestions": promoted,
            "missingFromExpected": missing_from_expected,
            "notSegmentedOrNotAligned": max(0, expected - segmented),
            "promotionDropAfterAnswerEvidence": max(0, answer_rows - promoted),
        }
        row["priorityScore"] = priority_for(row)
        row["nextActions"] = action_for(row)
        row["queued"] = row["missingFromExpected"] > 0 or row["promotionDropAfterAnswerEvidence"] > 0 or row["ocrAnswerMismatched"] > 0
        rows.append(row)
    return sorted(rows, key=lambda item: (-int(item["priorityScore"]), item["sourceId"]))


def build_queue() -> dict[str, Any]:
    rows = merge_rows()
    queued = [row for row in rows if row["queued"]]
    return {
        "generatedAt": now_iso(),
        "policy": {
            "target": "Recover every indexed uploaded-book MCQ unless it is an exact 1:1 duplicate.",
            "review": "Use agent review for answer recovery; no human review gate is required.",
            "storage": "Large OCR artifacts stay outside the repo or in ignored local artifact folders.",
        },
        "totals": {
            "sources": len(rows),
            "queuedSources": len(queued),
            "missingFromExpected": sum(int(row["missingFromExpected"]) for row in rows),
            "ocrAnswerMissing": sum(int(row["ocrAnswerMissing"]) for row in rows),
            "ocrAnswerMismatched": sum(int(row["ocrAnswerMismatched"]) for row in rows),
            "promotionDropAfterAnswerEvidence": sum(int(row["promotionDropAfterAnswerEvidence"]) for row in rows),
        },
        "sources": rows,
        "queue": queued,
    }


def markdown_table(headers: list[str], rows: list[list[object]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(lines)


def render_markdown(queue: dict[str, Any]) -> str:
    rows = queue["queue"]
    return "\n".join([
        "---",
        "title: SSC CGL Book Corpus Recovery Queue",
        "description: Source-level recovery plan for missing uploaded-book MCQs.",
        "tags: [ssc-cgl, pyq, corpus, recovery]",
        "---",
        "",
        "# SSC CGL Book Corpus Recovery Queue",
        "",
        "This page tracks the remaining indexed uploaded-book MCQs that are not yet promoted into the practice engine.",
        "",
        markdown_table(
            ["Queued sources", "Missing indexed", "Missing answers", "Mismatches", "Post-answer drops"],
            [[
                queue["totals"]["queuedSources"],
                queue["totals"]["missingFromExpected"],
                queue["totals"]["ocrAnswerMissing"],
                queue["totals"]["ocrAnswerMismatched"],
                queue["totals"]["promotionDropAfterAnswerEvidence"],
            ]],
        ),
        "",
        "## Recovery Queue",
        "",
        markdown_table(
            ["Priority", "Source", "Expected", "Segmented", "Answer evidence", "Promoted", "Missing", "Next action"],
            [[
                row["priorityScore"],
                row["sourceId"],
                row["expectedQuestionCount"],
                row["segmentedCandidates"],
                row["answerEvidenceRows"],
                row["promotedQuestions"],
                row["missingFromExpected"],
                "; ".join(row["nextActions"]),
            ] for row in rows],
        ),
        "",
        "## Execution Rule",
        "",
        "Run the highest-priority source first. Promote only rows with a valid stem, four options, and recovered answer evidence. Remove only exact duplicate copies with the same normalized stem, options, and answer.",
    ]) + "\n"


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")


def main() -> int:
    queue = build_queue()
    write_json(OUTPUT_JSON, queue)
    write_text(OUTPUT_MD, render_markdown(queue))
    print(f"wrote SSC CGL book recovery queue: {OUTPUT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
