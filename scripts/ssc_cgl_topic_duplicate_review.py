"""Prepare SSC CGL topic and duplicate candidates for agent review.

This helper only prepares evidence and suggestions. DeepSeek/Mistral/GPT-style
review agents must make the final topic, duplicate, and provenance decisions
before any question can enter curated ranked practice.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ALIGNED = ROOT / "data" / "exams" / "ssc-cgl" / "aligned" / "official-ssc-2026-cgl-notice" / "aligned-candidates.json"
DEFAULT_TOPIC_RULES = ROOT / "data" / "exams" / "ssc-cgl" / "topic-rules.json"
DEFAULT_EXISTING_QUESTIONS = ROOT / "data" / "generated" / "exams" / "ssc-cgl" / "index.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "topic-review" / "official-ssc-2026-cgl-notice"


@dataclass
class TopicDuplicateReviewReport:
    generatedAt: str
    totalCandidates: int
    topicSuggestions: int
    duplicateSuggestions: int
    agentReviewRequired: int
    quarantined: int
    rankedEligible: bool
    outputPath: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_text(value: object) -> str:
    text = str(value or "").lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def text_hash(value: object) -> str:
    return hashlib.sha1(normalize_text(value).encode("utf-8")).hexdigest()


def load_existing_hashes(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    payload = load_json(path)
    questions = payload.get("questions", payload) if isinstance(payload, dict) else payload
    hashes: dict[str, str] = {}
    if isinstance(questions, list):
        for question in questions:
            stem = question.get("stem") if isinstance(question, dict) else None
            question_id = str(question.get("id") or "existing-question") if isinstance(question, dict) else "existing-question"
            if stem:
                hashes[text_hash(stem)] = question_id
    return hashes


def load_topic_rules(path: Path) -> list[dict]:
    payload = load_json(path)
    topics = payload.get("topics", payload) if isinstance(payload, dict) else payload
    if not isinstance(topics, list):
        return []
    return [topic for topic in topics if isinstance(topic, dict)]


def candidate_chapter_slugs(candidate: dict) -> set[str]:
    slugs = {
        normalize_text(candidate.get("chapterSlug")),
        normalize_text(candidate.get("chapterTitle")),
    }
    provenance = candidate.get("provenance")
    if isinstance(provenance, dict):
        slugs.add(normalize_text(provenance.get("chapterSlug")))
        slugs.add(normalize_text(provenance.get("chapterTitle")))
    return {slug for slug in slugs if slug}


def score_rule(candidate_text: str, candidate: dict, rule: dict) -> int:
    score = 0
    candidate_chapters = candidate_chapter_slugs(candidate)
    for chapter_slug in rule.get("chapterSlugs", []):
        normalized_chapter_slug = normalize_text(chapter_slug)
        if normalized_chapter_slug and normalized_chapter_slug in candidate_chapters:
            score += 100
    for keyword in rule.get("keywords", []):
        normalized_keyword = normalize_text(keyword)
        if normalized_keyword and normalized_keyword in candidate_text:
            score += max(1, len(normalized_keyword.split()))
    return score


def infer_topic(candidate: dict, rules: list[dict]) -> dict | None:
    candidate_text = normalize_text(" ".join([
        str(candidate.get("stem") or ""),
        " ".join(str(option.get("text") or "") for option in candidate.get("options", []) if isinstance(option, dict)),
    ]))
    scored = [(score_rule(candidate_text, candidate, rule), rule) for rule in rules]
    scored = [(score, rule) for score, rule in scored if score > 0]
    if not scored:
        return None
    scored.sort(key=lambda item: item[0], reverse=True)
    return scored[0][1]


def review_candidates(candidates: list[dict], topic_rules: list[dict], existing_hashes: dict[str, str]) -> list[dict]:
    reviewed: list[dict] = []
    seen_hashes = dict(existing_hashes)

    for candidate in candidates:
        item = dict(candidate)
        item["rankedEligible"] = False
        item["agentReviewRequired"] = False
        if item.get("alignmentStatus") not in {"matched", "agent_consensus_matched"} or item.get("reviewStatus") != "needs_topic_duplicate_review":
            item["reviewStatus"] = item.get("reviewStatus") or "quarantined_before_topic_review"
            reviewed.append(item)
            continue

        stem_hash = text_hash(item.get("stem"))
        topic = infer_topic(item, topic_rules)
        if topic:
            item["suggestedSection"] = topic.get("section")
            item["suggestedTopic"] = topic.get("topic")
            item["suggestedSubtopic"] = topic.get("subtopic") or topic.get("title") or topic.get("topic")
            item["suggestedDifficulty"] = topic.get("difficulty") or "medium"
            item["topicRuleId"] = topic.get("id") or topic.get("topic")

        duplicate_of = seen_hashes.get(stem_hash)
        if duplicate_of:
            item["suggestedDuplicateOf"] = duplicate_of
            item["reviewStatus"] = "needs_agent_duplicate_review"
            item["agentReviewRequired"] = True
            reviewed.append(item)
            continue

        item["reviewStatus"] = "needs_agent_topic_review"
        item["agentReviewRequired"] = True
        seen_hashes[stem_hash] = str(item.get("id"))
        reviewed.append(item)

    return reviewed


def write_outputs(reviewed: list[dict], output_root: Path) -> TopicDuplicateReviewReport:
    output_root.mkdir(parents=True, exist_ok=True)
    output_path = output_root / "topic-duplicate-review-candidates.json"
    output_path.write_text(json.dumps(reviewed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    topic_suggestions = sum(1 for item in reviewed if item.get("suggestedTopic"))
    duplicate_suggestions = sum(1 for item in reviewed if item.get("suggestedDuplicateOf"))
    agent_review_required = sum(1 for item in reviewed if item.get("agentReviewRequired"))
    quarantined = sum(1 for item in reviewed if not item.get("agentReviewRequired"))

    report = TopicDuplicateReviewReport(
        generatedAt=now_iso(),
        totalCandidates=len(reviewed),
        topicSuggestions=topic_suggestions,
        duplicateSuggestions=duplicate_suggestions,
        agentReviewRequired=agent_review_required,
        quarantined=quarantined,
        rankedEligible=False,
        outputPath=str(output_path.resolve()),
        warnings=[
            "Topic/duplicate helper output is not ranked promotion.",
            "DeepSeek/Mistral/GPT-style agent reviewers must decide topic, duplicate, and provenance before curated data promotion.",
            "Duplicates, unknown topics, answer-key mismatches, and missing keys remain non-ranked until agent review and provenance gates pass.",
        ],
    )
    (output_root / "topic-duplicate-review-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Topic-tag and duplicate-check aligned SSC CGL candidates.")
    parser.add_argument("--aligned", type=Path, default=DEFAULT_ALIGNED)
    parser.add_argument("--topic-rules", type=Path, default=DEFAULT_TOPIC_RULES)
    parser.add_argument("--existing-questions", type=Path, default=DEFAULT_EXISTING_QUESTIONS)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    if not args.aligned.exists():
        parser.error(f"aligned candidates not found: {args.aligned}")
    if not args.topic_rules.exists():
        parser.error(f"topic rules not found: {args.topic_rules}")

    candidates = load_json(args.aligned)
    if not isinstance(candidates, list):
        parser.error("aligned candidates file must contain a JSON array")

    topic_rules = load_topic_rules(args.topic_rules)
    existing_hashes = load_existing_hashes(args.existing_questions)
    reviewed = review_candidates(candidates, topic_rules, existing_hashes)
    report = write_outputs(reviewed, args.output_root)
    print(
        f"topic suggestions {report.topicSuggestions}/{report.totalCandidates}; "
        f"duplicate suggestions {report.duplicateSuggestions}; "
        f"agent-review required {report.agentReviewRequired}; "
        f"quarantined {report.quarantined}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
