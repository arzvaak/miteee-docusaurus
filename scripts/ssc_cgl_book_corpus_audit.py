"""Audit SSC CGL book-PYQ corpus completeness against indexed book totals."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from ssc_cgl_book_corpus_blueprint import (
    DEFAULT_MANIFEST_PATH,
    DEFAULT_MATHS_CHAPTERS_PATH,
    DEFAULT_QUESTIONS_PATH,
    expected_counts_from_sources,
)


ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = ROOT / "data" / "exams" / "ssc-cgl"
ALIGNED_ROOT = DATA_ROOT / "aligned-mistral"
OUTPUT_JSON = DATA_ROOT / "book-imports" / "corpus-completeness-audit.json"
OUTPUT_MD = DATA_ROOT / "internal-docs" / "book-corpus-completeness-audit.md"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def promoted_counts() -> Counter[str]:
    questions = load_json(DEFAULT_QUESTIONS_PATH)
    counts: Counter[str] = Counter()
    for question in questions:
        if not isinstance(question, dict):
            continue
        provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
        counts[str(provenance.get("sourceId") or "unknown")] += 1
    return counts


def aligned_stage_counts() -> dict[str, Counter[str]]:
    counts: dict[str, Counter[str]] = {}
    for path in ALIGNED_ROOT.glob("**/aligned-candidates.json"):
        source_id = path.relative_to(ALIGNED_ROOT).parts[0]
        source_counts = counts.setdefault(source_id, Counter())
        rows = load_json(path)
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict):
                continue
            source_counts["segmentedCandidates"] += 1
            status = str(row.get("alignmentStatus") or "unknown")
            source_counts[f"alignment:{status}"] += 1
            review_status = str(row.get("reviewStatus") or "unknown")
            source_counts[f"review:{review_status}"] += 1
    return counts


def build_audit() -> dict[str, Any]:
    expected = expected_counts_from_sources(DEFAULT_MANIFEST_PATH, DEFAULT_MATHS_CHAPTERS_PATH)
    promoted = promoted_counts()
    stages = aligned_stage_counts()
    source_ids = sorted(set(expected) | set(promoted))
    sources = []
    for source_id in source_ids:
        expected_count = expected.get(source_id, promoted.get(source_id, 0))
        promoted_count = promoted.get(source_id, 0)
        stage = stages.get(source_id, Counter())
        segmented = stage.get("segmentedCandidates", 0)
        answer_matched = stage.get("alignment:matched", 0) + stage.get("alignment:answer_key_mismatch", 0)
        missing_answer = stage.get("alignment:missing_answer_key", 0)
        if not stage:
            missing_answer = max(0, expected_count - promoted_count)
        source = {
            "sourceId": source_id,
            "expectedQuestionCount": expected_count,
            "segmentedCandidates": segmented,
            "answerEvidenceRows": answer_matched,
            "promotedQuestions": promoted_count,
            "missingFromExpected": max(0, expected_count - promoted_count),
            "notSegmentedOrNotAligned": max(0, expected_count - segmented),
            "missingAnswerEvidence": missing_answer,
            "promotionDropAfterAnswerEvidence": max(0, answer_matched - promoted_count),
        }
        sources.append(source)
    totals = {
        "expectedQuestionCount": sum(source["expectedQuestionCount"] for source in sources),
        "segmentedCandidates": sum(source["segmentedCandidates"] for source in sources),
        "answerEvidenceRows": sum(source["answerEvidenceRows"] for source in sources),
        "promotedQuestions": sum(source["promotedQuestions"] for source in sources),
        "missingFromExpected": sum(source["missingFromExpected"] for source in sources),
        "notSegmentedOrNotAligned": sum(source["notSegmentedOrNotAligned"] for source in sources),
        "missingAnswerEvidence": sum(source["missingAnswerEvidence"] for source in sources),
        "promotionDropAfterAnswerEvidence": sum(source["promotionDropAfterAnswerEvidence"] for source in sources),
    }
    return {
        "generatedAt": now_iso(),
        "policy": {
            "target": "Include every indexed uploaded-book MCQ in the personal SSC CGL corpus.",
            "dedupe": "Remove only exact 1:1 copies with same normalized stem, options, and answer.",
            "strictness": "Any gap from indexed totals is a recovery backlog item, not a quality-filter success.",
        },
        "totals": totals,
        "sources": sources,
    }


def markdown_table(headers: list[str], rows: list[list[object]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(lines)


def render_markdown(audit: dict[str, Any]) -> str:
    totals = audit["totals"]
    sources = audit["sources"]
    return "\n".join([
        "---",
        "title: SSC CGL Book Corpus Completeness Audit",
        "description: Strict expected-vs-promoted audit for the uploaded SSC CGL book-PYQ corpus.",
        "tags: [ssc-cgl, pyq, corpus, audit]",
        "---",
        "",
        "# SSC CGL Book Corpus Completeness Audit",
        "",
        "This is the strict corpus target. The indexed book MCQ total is the target; only exact 1:1 duplicate copies may be removed.",
        "",
        markdown_table(
            ["Expected", "Segmented", "Answer evidence", "Promoted", "Missing"],
            [[
                totals["expectedQuestionCount"],
                totals["segmentedCandidates"],
                totals["answerEvidenceRows"],
                totals["promotedQuestions"],
                totals["missingFromExpected"],
            ]],
        ),
        "",
        "## Source Losses",
        "",
        markdown_table(
            [
                "Source",
                "Expected",
                "Segmented",
                "Answer evidence",
                "Promoted",
                "Missing",
                "Not segmented/aligned",
                "Missing answer evidence",
                "Post-answer drop",
            ],
            [[
                source["sourceId"],
                source["expectedQuestionCount"],
                source["segmentedCandidates"],
                source["answerEvidenceRows"],
                source["promotedQuestions"],
                source["missingFromExpected"],
                source["notSegmentedOrNotAligned"],
                source["missingAnswerEvidence"],
                source["promotionDropAfterAnswerEvidence"],
            ] for source in sources],
        ),
        "",
        "## Recovery Order",
        "",
        "1. Re-segment or re-align Reasoning and Maths first because they have the largest missing counts.",
        "2. Extract missing answer keys from OCR answer-key pages and solution pages instead of dropping rows.",
        "3. Clean malformed option tails and table/image references, then promote all valid four-option MCQs.",
        "4. Remove only exact normalized copies with the same stem, options, and answer.",
    ]) + "\n"


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")


def main() -> int:
    audit = build_audit()
    write_json(OUTPUT_JSON, audit)
    write_text(OUTPUT_MD, render_markdown(audit))
    print(f"wrote strict book corpus audit: {OUTPUT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
