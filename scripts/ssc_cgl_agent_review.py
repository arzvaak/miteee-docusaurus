"""Run model-agent review over prepared SSC CGL import candidates.

The runner asks configured DeepSeek, Mistral, and GPT-compatible reviewers for
strict JSON decisions. It never promotes questions into ranked practice; it only
writes review packets and accepted reviewer decisions for a later promotion gate.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_QUEUE = ROOT / "data" / "exams" / "ssc-cgl" / "topic-review" / "official-ssc-2026-cgl-notice" / "topic-duplicate-review-candidates.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "agent-review" / "official-ssc-2026-cgl-notice"


@dataclass(frozen=True)
class Provider:
    id: str
    env_key: str
    model_env: str
    default_model: str
    endpoint: str


@dataclass
class AgentReviewReport:
    generatedAt: str
    totalCandidates: int
    agentReviewItems: int
    providersRequested: list[str]
    providerCalls: int
    providerMissing: int
    decisionsAccepted: int
    decisionsRejected: int
    rankedEligible: bool
    outputPath: str
    warnings: list[str]


PROVIDERS = {
    "deepseek": Provider(
        "deepseek",
        "DEEPSEEK_API_KEY",
        "DEEPSEEK_MODEL",
        "deepseek-v4-flash",
        "https://api.deepseek.com/v1/chat/completions",
    ),
    "mistral": Provider(
        "mistral",
        "MISTRAL_API_KEY",
        "MISTRAL_MODEL",
        "mistral-small-latest",
        "https://api.mistral.ai/v1/chat/completions",
    ),
    "gpt": Provider(
        "gpt",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "gpt-4.1-mini",
        "https://api.openai.com/v1/chat/completions",
    ),
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def provider_key(provider: Provider) -> str | None:
    if provider.id == "mistral":
        return os.environ.get("MISTRAL_API_KEY") or os.environ.get("MISTRAK_API_KEY")
    return os.environ.get(provider.env_key)


def provider_model(provider: Provider) -> str:
    return os.environ.get(provider.model_env, provider.default_model)


def parse_providers(value: str) -> list[str]:
    providers = [item.strip().lower() for item in value.split(",") if item.strip()]
    unknown = [item for item in providers if item not in PROVIDERS]
    if unknown:
        raise ValueError(f"unknown providers: {', '.join(unknown)}")
    return providers or ["deepseek", "mistral", "gpt"]


def existing_question_ids(output_root: Path) -> set[str]:
    ids: set[str] = set()
    for filename in ["agent-review-packets.json", "agent-review-decisions.json"]:
        path = output_root / filename
        if not path.exists():
            continue
        try:
            rows = load_json(path)
        except Exception:
            continue
        if not isinstance(rows, list):
            continue
        for row in rows:
            if isinstance(row, dict) and row.get("questionId"):
                ids.add(str(row.get("questionId")))
    return ids


def review_items(
    candidates: list[dict],
    max_items: int,
    start_index: int = 0,
    skip_question_ids: set[str] | None = None,
) -> list[dict]:
    skip_question_ids = skip_question_ids or set()
    items = [
        dict(candidate)
        for candidate in candidates
        if candidate.get("agentReviewRequired")
        and candidate.get("reviewStatus") in {"needs_agent_topic_review", "needs_agent_duplicate_review"}
        and str(candidate.get("id")) not in skip_question_ids
    ]
    if start_index > 0:
        items = items[start_index:]
    return items[:max_items] if max_items > 0 else items


def compact_candidate(candidate: dict) -> dict:
    return {
        "id": candidate.get("id"),
        "stem": candidate.get("stem"),
        "options": candidate.get("options", []),
        "correctOption": candidate.get("correctOption"),
        "reviewStatus": candidate.get("reviewStatus"),
        "suggestedSection": candidate.get("suggestedSection"),
        "suggestedTopic": candidate.get("suggestedTopic"),
        "suggestedSubtopic": candidate.get("suggestedSubtopic"),
        "suggestedDuplicateOf": candidate.get("suggestedDuplicateOf"),
        "sourceType": candidate.get("sourceType"),
        "sourceUrl": candidate.get("sourceUrl"),
        "provenance": candidate.get("provenance", {}),
    }


def build_prompt(candidate: dict, provider_id: str) -> str:
    expected = {
        "questionId": candidate.get("id"),
        "provider": provider_id,
        "finalSection": "one SSC CGL Tier-I section or null",
        "finalTopic": "topic slug or null",
        "finalSubtopic": "subtopic text or null",
        "duplicateDecision": "unique|duplicate|uncertain",
        "duplicateOf": "question id or null",
        "provenanceDecision": "acceptable|needs_source_review|reject",
        "confidence": "number from 0 to 1",
        "reasons": ["short evidence-grounded reason"],
        "flags": ["short issue tags"],
    }
    return "\n".join([
        "You are an SSC CGL Tier-I question curation agent.",
        "Review the supplied evidence only. Do not invent facts, sources, topics, or answer keys.",
        "Return strict JSON only, with no markdown.",
        "Decide whether the suggested topic is valid, whether the item is a duplicate, and whether provenance is acceptable for later ranked practice.",
        "Use null or uncertain when evidence is insufficient. Never mark a question as reviewed or ranked.",
        f"Expected JSON shape: {json.dumps(expected, ensure_ascii=False)}",
        "Candidate evidence:",
        json.dumps(compact_candidate(candidate), ensure_ascii=False),
    ])


def call_chat_completion(provider: Provider, prompt: str) -> tuple[str, str]:
    api_key = provider_key(provider)
    if not api_key:
        return "provider_missing", ""

    body = {
        "model": provider_model(provider),
        "temperature": 0.1,
        "max_tokens": 1200,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "user", "content": prompt}],
    }
    request = urllib.request.Request(
        provider.endpoint,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = json.loads(response.read().decode("utf-8"))
        content = payload.get("choices", [{}])[0].get("message", {}).get("content", "")
        return "completed", str(content or "")
    except Exception as exc:
        return "provider_error", str(exc)


def parse_decision(question_id: str, provider_id: str, content: str) -> dict | None:
    try:
        decision = json.loads(content)
    except Exception:
        return None

    if decision.get("questionId") != question_id or decision.get("provider") != provider_id:
        return None
    if decision.get("duplicateDecision") not in {"unique", "duplicate", "uncertain"}:
        return None
    if decision.get("provenanceDecision") not in {"acceptable", "needs_source_review", "reject"}:
        return None
    confidence = decision.get("confidence")
    if not isinstance(confidence, (int, float)) or confidence < 0 or confidence > 1:
        return None
    decision["rankedEligible"] = False
    decision["acceptedAt"] = now_iso()
    return decision


def run_agent_review(
    candidates: list[dict],
    provider_ids: list[str],
    max_items: int,
    dry_run: bool,
    start_index: int = 0,
    skip_question_ids: set[str] | None = None,
) -> tuple[list[dict], list[dict], AgentReviewReport]:
    items = review_items(candidates, max_items, start_index=start_index, skip_question_ids=skip_question_ids)
    packets: list[dict] = []
    decisions: list[dict] = []
    provider_missing = 0
    rejected = 0

    for item in items:
        for provider_id in provider_ids:
            provider = PROVIDERS[provider_id]
            prompt = build_prompt(item, provider_id)
            packet = {
                "questionId": item.get("id"),
                "provider": provider_id,
                "model": provider_model(provider),
                "reviewStatus": item.get("reviewStatus"),
                "status": "queued_dry_run",
                "prompt": prompt,
                "rankedEligible": False,
            }
            if not dry_run:
                status, content = call_chat_completion(provider, prompt)
                packet["status"] = status
                if status == "provider_missing":
                    provider_missing += 1
                elif status == "completed":
                    decision = parse_decision(str(item.get("id")), provider_id, content)
                    if decision:
                        decisions.append(decision)
                        packet["decisionAccepted"] = True
                    else:
                        rejected += 1
                        packet["decisionAccepted"] = False
                else:
                    rejected += 1
                packet["rawResponse"] = content[:4000]
            packets.append(packet)

    report = AgentReviewReport(
        generatedAt=now_iso(),
        totalCandidates=len(candidates),
        agentReviewItems=len(items),
        providersRequested=provider_ids,
        providerCalls=len(items) * len(provider_ids),
        providerMissing=provider_missing,
        decisionsAccepted=len(decisions),
        decisionsRejected=rejected,
        rankedEligible=False,
        outputPath="",
        warnings=[
            "Agent review decisions are evidence for curation, not ranked promotion.",
            "Promotion must require answer-key, topic, duplicate, provenance, and consensus checks.",
            "No full copyrighted source body is sent; prompts use supplied candidate evidence only.",
        ],
    )
    return packets, decisions, report


def load_json_list(path: Path) -> list[dict]:
    if not path.exists():
        return []
    try:
        data = load_json(path)
    except Exception:
        return []
    return [item for item in data if isinstance(item, dict)] if isinstance(data, list) else []


def merge_rows(existing: list[dict], current: list[dict], key_fields: list[str]) -> list[dict]:
    merged: dict[tuple[str, ...], dict] = {}
    for row in [*existing, *current]:
        key = tuple(str(row.get(field) or "") for field in key_fields)
        if not all(key):
            continue
        merged[key] = row
    return list(merged.values())


def summarize_outputs(packets: list[dict], decisions: list[dict], report: AgentReviewReport) -> None:
    report.agentReviewItems = len({str(packet.get("questionId")) for packet in packets if packet.get("questionId")})
    report.providerCalls = len(packets)
    report.providerMissing = sum(1 for packet in packets if packet.get("status") == "provider_missing")
    report.decisionsAccepted = len(decisions)
    report.decisionsRejected = sum(
        1
        for packet in packets
        if packet.get("status") in {"provider_error", "completed"} and packet.get("decisionAccepted") is False
    )


def write_outputs(
    packets: list[dict],
    decisions: list[dict],
    report: AgentReviewReport,
    output_root: Path,
    merge_existing: bool = False,
) -> AgentReviewReport:
    output_root.mkdir(parents=True, exist_ok=True)
    packets_path = output_root / "agent-review-packets.json"
    decisions_path = output_root / "agent-review-decisions.json"
    report_path = output_root / "agent-review-report.json"
    if merge_existing:
        packets = merge_rows(load_json_list(packets_path), packets, ["questionId", "provider"])
        decisions = merge_rows(load_json_list(decisions_path), decisions, ["questionId", "provider"])
        summarize_outputs(packets, decisions, report)
    packets_path.write_text(json.dumps(packets, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    decisions_path.write_text(json.dumps(decisions, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report.outputPath = str(packets_path.resolve())
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Run DeepSeek/Mistral/GPT-style agent review for SSC CGL question candidates.")
    parser.add_argument("--queue", type=Path, default=DEFAULT_QUEUE)
    parser.add_argument("--providers", default="deepseek,mistral,gpt")
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--max-items", type=int, default=25)
    parser.add_argument("--start-index", type=int, default=0)
    parser.add_argument("--merge-existing", action="store_true")
    parser.add_argument("--skip-existing", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.queue.exists():
        parser.error(f"agent review queue not found: {args.queue}")
    try:
        provider_ids = parse_providers(args.providers)
    except ValueError as exc:
        parser.error(str(exc))

    candidates = load_json(args.queue)
    if not isinstance(candidates, list):
        parser.error("agent review queue must contain a JSON array")
    if args.start_index < 0:
        parser.error("--start-index must be 0 or greater")

    packets, decisions, report = run_agent_review(
        candidates,
        provider_ids,
        args.max_items,
        args.dry_run,
        args.start_index,
        existing_question_ids(args.output_root) if args.skip_existing else None,
    )
    report = write_outputs(packets, decisions, report, args.output_root, merge_existing=args.merge_existing)
    print(
        f"agent items {report.agentReviewItems}/{report.totalCandidates}; "
        f"provider calls {report.providerCalls}; "
        f"accepted {report.decisionsAccepted}; rejected {report.decisionsRejected}; "
        f"missing providers {report.providerMissing}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
