#!/usr/bin/env python3
"""Summarize SSC CGL uploaded-book Mistral OCR import progress."""

from __future__ import annotations

import argparse
import json
import os
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


MCQ_ROLES = {"mcq_bank", "mcq_practice_bank"}


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def book_questions_path(data_dir: Path) -> Path:
    explicit_path = os.environ.get("SSC_CGL_BOOK_QUESTIONS_PATH", "").strip()
    if explicit_path:
        return Path(explicit_path)
    explicit_root = os.environ.get("SSC_CGL_BOOK_IMPORTS_ROOT", "").strip()
    if explicit_root:
        return Path(explicit_root) / "questions.json"
    artifacts_root = os.environ.get("MITEEE_LOCAL_ARTIFACTS", "").strip()
    candidates: list[Path] = []
    if artifacts_root:
        candidates.append(Path(artifacts_root) / "ssc-cgl-corpus" / "book-imports" / "questions.json")
    candidates.extend([
        Path(Path.cwd().anchor) / "MITEEE_LOCAL_ARTIFACTS" / "ssc-cgl-corpus" / "book-imports" / "questions.json",
        data_dir / "book-imports" / "questions.json",
    ])
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[-1]


def source_from_nested_path(path: Path, root: Path) -> tuple[str, str]:
    relative = path.relative_to(root)
    return relative.parts[0], relative.parts[1]


def summarize(data_dir: Path, manifest_path: Path, output_path: Path) -> dict[str, Any]:
    manifest = read_json(manifest_path)
    sources: dict[str, Counter[str]] = defaultdict(Counter)
    source_meta: dict[str, dict[str, Any]] = {}

    for source in manifest.get("sources", []):
        source_id = source["id"]
        source_meta[source_id] = {
            "sourceId": source_id,
            "title": source.get("title") or source_id,
            "role": source.get("role") or "mcq_bank",
            "section": source.get("section"),
            "file": source.get("file"),
            "pageCount": source.get("pageCount", 0),
        }

    for report_path in (data_dir / "book-ocr").glob("*/mistral-ocr-report.json"):
        report = read_json(report_path)
        source_id = report["sourceId"]
        bucket = sources[source_id]
        bucket["ocrJobs"] += 1
        bucket["ocrPages"] += int(report.get("pageCount", 0))
        bucket["ocrMarkdownChars"] += int(report.get("markdownChars", 0))
        bucket["ocrQuestionSignals"] += int(report.get("questionSignals", 0))

    def add_segment_reports(segment_root: Path, allowed_sources: set[str] | None = None) -> None:
        for report_path in segment_root.glob("*/*/segmentation-report.json"):
            report = read_json(report_path)
            source_id, _chunk = source_from_nested_path(report_path, segment_root)
            if allowed_sources is not None and source_id not in allowed_sources:
                continue
            bucket = sources[source_id]
            bucket["segmentReports"] += 1
            bucket["segmentPages"] += int(report.get("pagesScanned", report.get("pageCount", 0)))
            bucket["segmentedCandidates"] += int(report.get("candidateCount", 0))

    add_segment_reports(data_dir / "book-segments-mistral")
    sources_without_mistral_segments = {
        source_id
        for source_id in source_meta
        if sources[source_id]["segmentReports"] == 0
    }
    add_segment_reports(data_dir / "book-segments", sources_without_mistral_segments)

    for report_path in (data_dir / "aligned-mistral").glob("*/*/ocr-answer-alignment-report.json"):
        report = read_json(report_path)
        source_id, _chunk = source_from_nested_path(report_path, data_dir / "aligned-mistral")
        bucket = sources[source_id]
        bucket["ocrAnswersExtracted"] += int(report.get("extractedAnswers", 0))

    for candidates_path in (data_dir / "aligned-mistral").glob("*/*/aligned-candidates.json"):
        rows = read_json(candidates_path)
        if not isinstance(rows, list):
            continue
        source_id, _chunk = source_from_nested_path(candidates_path, data_dir / "aligned-mistral")
        bucket = sources[source_id]
        for row in rows:
            if not isinstance(row, dict):
                continue
            bucket["ocrAnswerCandidates"] += 1
            status = str(row.get("alignmentStatus") or "")
            if status in {"matched", "agent_consensus_matched"}:
                bucket["ocrAnswerMatched"] += 1
            elif status == "answer_key_mismatch":
                bucket["ocrAnswerMismatched"] += 1
            else:
                bucket["ocrAnswerMissing"] += 1

    for report_path in (data_dir / "topic-review").glob("*/*/topic-duplicate-review-report.json"):
        source_id, chunk = source_from_nested_path(report_path, data_dir / "topic-review")
        if source_id not in source_meta:
            continue
        if not chunk.startswith("ocr-range"):
            continue
        report = read_json(report_path)
        bucket = sources[source_id]
        bucket["topicReviewReports"] += 1
        bucket["topicSuggestions"] += int(report.get("topicSuggestions", 0))
        bucket["duplicateSuggestions"] += int(report.get("duplicateSuggestions", 0))
        bucket["agentReviewRequired"] += int(report.get("agentReviewRequired", 0))
        bucket["topicReviewQuarantined"] += int(report.get("quarantined", 0))

    for report_path in (data_dir / "agent-review").glob("*/*/agent-review-report.json"):
        source_id, chunk = source_from_nested_path(report_path, data_dir / "agent-review")
        if source_id not in source_meta:
            continue
        if not chunk.startswith("ocr-range"):
            continue
        bucket = sources[source_id]
        bucket["agentReviewReports"] += 1

    reviewed_question_ids: dict[str, set[str]] = defaultdict(set)
    for packets_path in (data_dir / "agent-review").glob("*/*/agent-review-packets.json"):
        source_id, chunk = source_from_nested_path(packets_path, data_dir / "agent-review")
        if source_id not in source_meta or not chunk.startswith("ocr-range"):
            continue
        packets = read_json(packets_path)
        if not isinstance(packets, list):
            continue
        bucket = sources[source_id]
        bucket["agentProviderCalls"] += len(packets)
        bucket["agentDecisionsRejected"] += sum(1 for packet in packets if not packet.get("decisionAccepted"))

    for decisions_path in (data_dir / "agent-review").glob("*/*/agent-review-decisions.json"):
        source_id, chunk = source_from_nested_path(decisions_path, data_dir / "agent-review")
        if source_id not in source_meta or not chunk.startswith("ocr-range"):
            continue
        decisions = read_json(decisions_path)
        if not isinstance(decisions, list):
            continue
        bucket = sources[source_id]
        bucket["agentDecisionsAccepted"] += len(decisions)
        for decision in decisions:
            question_id = decision.get("questionId")
            if question_id:
                reviewed_question_ids[source_id].add(str(question_id))

    for source_id, question_ids in reviewed_question_ids.items():
        sources[source_id]["agentReviewItems"] = len(question_ids)

    promoted_path = book_questions_path(data_dir)
    if promoted_path.exists():
        for question in read_json(promoted_path):
            source_id = question.get("provenance", {}).get("sourceId")
            if source_id in source_meta:
                sources[source_id]["promotedQuestions"] += 1

    source_rows = []
    totals = Counter()
    for source_id in sorted(source_meta):
        role = source_meta[source_id]["role"]
        counters = sources[source_id]
        row = {
            **source_meta[source_id],
            "ocrJobs": counters["ocrJobs"],
            "ocrPages": counters["ocrPages"],
            "ocrMarkdownChars": counters["ocrMarkdownChars"],
            "ocrQuestionSignals": counters["ocrQuestionSignals"],
            "segmentReports": counters["segmentReports"],
            "segmentPages": counters["segmentPages"],
            "segmentedCandidates": counters["segmentedCandidates"],
            "ocrAnswerCandidates": counters["ocrAnswerCandidates"],
            "ocrAnswersExtracted": counters["ocrAnswersExtracted"],
            "ocrAnswerMatched": counters["ocrAnswerMatched"],
            "ocrAnswerMismatched": counters["ocrAnswerMismatched"],
            "ocrAnswerMissing": counters["ocrAnswerMissing"],
            "topicReviewReports": counters["topicReviewReports"],
            "topicSuggestions": counters["topicSuggestions"],
            "duplicateSuggestions": counters["duplicateSuggestions"],
            "agentReviewRequired": counters["agentReviewRequired"],
            "topicReviewQuarantined": counters["topicReviewQuarantined"],
            "agentReviewReports": counters["agentReviewReports"],
            "agentReviewItems": counters["agentReviewItems"],
            "agentProviderCalls": counters["agentProviderCalls"],
            "agentDecisionsAccepted": counters["agentDecisionsAccepted"],
            "agentDecisionsRejected": counters["agentDecisionsRejected"],
            "promotedQuestions": counters["promotedQuestions"],
            "rankedEligible": counters["promotedQuestions"] > 0,
        }
        source_rows.append(row)
        totals.update({key: value for key, value in counters.items() if isinstance(value, int)})

    result = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "ocrProvider": "mistral",
        "ocrModel": "mistral-ocr-latest",
        "policy": {
            "rankedTestsUseOnlyPromotedQuestions": True,
            "lucentRole": "static_gk_reference",
            "reviewMode": "agent_review_not_human_review",
        },
        "sources": source_rows,
        "totals": {
            "sourceCount": len(source_rows),
            "ocrJobs": totals["ocrJobs"],
            "ocrPages": totals["ocrPages"],
            "ocrMarkdownChars": totals["ocrMarkdownChars"],
            "ocrQuestionSignals": totals["ocrQuestionSignals"],
            "segmentReports": totals["segmentReports"],
            "segmentPages": totals["segmentPages"],
            "segmentedCandidates": totals["segmentedCandidates"],
            "ocrAnswerCandidates": totals["ocrAnswerCandidates"],
            "ocrAnswersExtracted": totals["ocrAnswersExtracted"],
            "ocrAnswerMatched": totals["ocrAnswerMatched"],
            "ocrAnswerMismatched": totals["ocrAnswerMismatched"],
            "ocrAnswerMissing": totals["ocrAnswerMissing"],
            "topicReviewReports": totals["topicReviewReports"],
            "topicSuggestions": totals["topicSuggestions"],
            "duplicateSuggestions": totals["duplicateSuggestions"],
            "agentReviewRequired": totals["agentReviewRequired"],
            "topicReviewQuarantined": totals["topicReviewQuarantined"],
            "agentReviewReports": totals["agentReviewReports"],
            "agentReviewItems": totals["agentReviewItems"],
            "agentProviderCalls": totals["agentProviderCalls"],
            "agentDecisionsAccepted": totals["agentDecisionsAccepted"],
            "agentDecisionsRejected": totals["agentDecisionsRejected"],
            "promotedQuestions": totals["promotedQuestions"],
        },
        "nextBacklog": {
            "answerAlignedAwaitingAgentReview": max(0, totals["ocrAnswerMatched"] - totals["agentReviewItems"]),
            "agentReviewedAwaitingPromotionOrRejected": max(0, totals["agentReviewItems"] - totals["promotedQuestions"]),
            "ocrRowsMissingSolutionMarker": totals["ocrAnswerMissing"],
        },
    }
    write_json(output_path, result)
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="data/exams/ssc-cgl")
    parser.add_argument("--manifest-path", default="data/exams/ssc-cgl/book-sources/manifest.json")
    parser.add_argument("--output-path", default="data/exams/ssc-cgl/book-sources/mistral-ocr-import-progress.json")
    args = parser.parse_args()

    result = summarize(Path(args.data_dir), Path(args.manifest_path), Path(args.output_path))
    totals = result["totals"]
    print(
        "wrote {output} with {questions} promoted from {candidates} segmented candidates and {matched} OCR answer matches".format(
            output=args.output_path,
            questions=totals["promotedQuestions"],
            candidates=totals["segmentedCandidates"],
            matched=totals["ocrAnswerMatched"],
        )
    )


if __name__ == "__main__":
    main()
