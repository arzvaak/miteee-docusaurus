"""Ask model agents for review-only SSC CGL answer suggestions.

This is not an official answer-key stage. It solves MCQs from supplied candidate
evidence only and writes consensus suggestions for later review. Nothing from
this stage is ranked-eligible by itself.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from collections import defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANDIDATES = ROOT / "data" / "exams" / "ssc-cgl" / "segments" / "official-ssc-2026-cgl-notice" / "question-candidates.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "agent-answer-key" / "official-ssc-2026-cgl-notice"
VALID_OPTIONS = {"a", "b", "c", "d"}


@dataclass(frozen=True)
class Provider:
    id: str
    env_key: str
    model_env: str
    default_model: str
    endpoint: str


@dataclass
class AgentAnswerReport:
    generatedAt: str
    totalCandidates: int
    solveItems: int
    providersRequested: list[str]
    providerCalls: int
    providerMissing: int
    decisionsAccepted: int
    decisionsRejected: int
    consensusAnswers: int
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
    provider_ids = [item.strip().lower() for item in value.split(",") if item.strip()]
    unknown = [item for item in provider_ids if item not in PROVIDERS]
    if unknown:
        raise ValueError(f"unknown providers: {', '.join(unknown)}")
    return provider_ids or ["deepseek", "mistral", "gpt"]


def candidate_options(candidate: dict) -> list[dict]:
    options = candidate.get("options")
    if not isinstance(options, list):
        return []
    normalized = []
    for option in options:
        if not isinstance(option, dict):
            continue
        option_id = str(option.get("id") or "").strip().lower()
        option_text = str(option.get("text") or "").strip()
        if option_id in VALID_OPTIONS and option_text:
            normalized.append({"id": option_id, "text": option_text})
    return normalized


def existing_question_ids(output_root: Path) -> set[str]:
    ids: set[str] = set()
    for filename in ["agent-answer-key-packets.json", "agent-answer-key-decisions.json"]:
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


def solve_items(
    candidates: list[dict],
    max_items: int,
    start_index: int = 0,
    skip_question_ids: set[str] | None = None,
) -> list[dict]:
    skip_question_ids = skip_question_ids or set()
    items = [
        dict(candidate)
        for candidate in candidates
        if candidate.get("reviewStatus") == "needs_answer_key_review"
        and candidate.get("rankedEligible") is False
        and len(candidate_options(candidate)) == 4
        and str(candidate.get("id")) not in skip_question_ids
    ]
    if start_index > 0:
        items = items[start_index:]
    return items[:max_items] if max_items > 0 else items


def compact_candidate(candidate: dict) -> dict:
    return {
        "id": candidate.get("id"),
        "questionNumber": candidate.get("questionNumber"),
        "stem": candidate.get("stem"),
        "options": candidate_options(candidate),
        "sourceType": candidate.get("sourceType"),
        "sourceUrl": candidate.get("sourceUrl"),
        "provenance": candidate.get("provenance", {}),
    }


def build_prompt(candidate: dict, provider_id: str) -> str:
    expected = {
        "questionId": candidate.get("id"),
        "provider": provider_id,
        "correctOption": "a|b|c|d",
        "confidence": "number from 0 to 1",
        "explanation": "brief evidence-based solution",
        "methodTags": ["topic or method tags"],
        "flags": ["uncertainty or OCR issue tags"],
    }
    return "\n".join([
        "You are an SSC CGL Tier-I answer-review agent.",
        "Solve the MCQ using only the supplied question stem and options.",
        "This is not an official answer key and must not be treated as ranked practice evidence by itself.",
        "Return strict JSON only, with no markdown.",
        "Choose exactly one option a, b, c, or d. If OCR is unclear, still choose your best option but lower confidence and add flags.",
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
        "max_tokens": 900,
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


def normalize_option(value: object) -> str | None:
    if value is None:
        return None
    option = str(value).strip().lower()
    return option if option in VALID_OPTIONS else None


def parse_decision(question_id: str, provider_id: str, content: str) -> dict | None:
    try:
        decision = json.loads(content)
    except Exception:
        return None

    if decision.get("questionId") != question_id or decision.get("provider") != provider_id:
        return None
    correct_option = normalize_option(decision.get("correctOption"))
    if not correct_option:
        return None
    confidence = decision.get("confidence")
    if not isinstance(confidence, (int, float)) or confidence < 0 or confidence > 1:
        return None
    explanation = str(decision.get("explanation") or "").strip()
    if len(explanation) < 8:
        return None

    return {
        "questionId": question_id,
        "provider": provider_id,
        "correctOption": correct_option,
        "confidence": float(confidence),
        "explanation": explanation[:1200],
        "methodTags": [str(tag)[:80] for tag in decision.get("methodTags", []) if isinstance(tag, str)][:8],
        "flags": [str(flag)[:80] for flag in decision.get("flags", []) if isinstance(flag, str)][:8],
        "rankedEligible": False,
        "acceptedAt": now_iso(),
    }


def build_consensus(decisions: list[dict], min_agree: int = 2, min_confidence: float = 0.7) -> list[dict]:
    grouped: dict[str, dict[str, list[dict]]] = defaultdict(lambda: defaultdict(list))
    for decision in decisions:
        grouped[str(decision.get("questionId"))][str(decision.get("correctOption"))].append(decision)

    consensus: list[dict] = []
    for question_id, by_option in grouped.items():
        for option, option_decisions in sorted(by_option.items()):
            confident = [item for item in option_decisions if float(item.get("confidence") or 0) >= min_confidence]
            if len(confident) < min_agree:
                continue
            providers = sorted({str(item.get("provider")) for item in confident})
            avg_confidence = sum(float(item.get("confidence") or 0) for item in confident) / len(confident)
            consensus.append({
                "questionNumber": question_id,
                "questionId": question_id,
                "correctOption": option,
                "sourceId": "agent-answer-consensus",
                "sourceType": "agent_answer_suggestion",
                "reviewStatus": "needs_official_or_agent_consensus_review",
                "rankedEligible": False,
                "providers": providers,
                "agreementCount": len(confident),
                "averageConfidence": round(avg_confidence, 4),
                "explanations": [
                    {
                        "provider": item.get("provider"),
                        "confidence": item.get("confidence"),
                        "explanation": item.get("explanation"),
                        "flags": item.get("flags", []),
                    }
                    for item in confident
                ],
            })
            break
    return consensus


def run_agent_answer_key(
    candidates: list[dict],
    provider_ids: list[str],
    max_items: int,
    dry_run: bool,
    min_agree: int,
    min_confidence: float,
    start_index: int = 0,
    skip_question_ids: set[str] | None = None,
) -> tuple[list[dict], list[dict], list[dict], AgentAnswerReport]:
    items = solve_items(candidates, max_items, start_index=start_index, skip_question_ids=skip_question_ids)
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
                "questionNumber": item.get("questionNumber"),
                "provider": provider_id,
                "model": provider_model(provider),
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
                        decision["questionNumber"] = str(item.get("questionNumber") or "")
                        decision["sourceId"] = item.get("sourceId")
                        decisions.append(decision)
                        packet["decisionAccepted"] = True
                    else:
                        rejected += 1
                        packet["decisionAccepted"] = False
                else:
                    rejected += 1
                packet["rawResponse"] = content[:4000]
            packets.append(packet)

    consensus = build_consensus(decisions, min_agree=min_agree, min_confidence=min_confidence)
    report = AgentAnswerReport(
        generatedAt=now_iso(),
        totalCandidates=len(candidates),
        solveItems=len(items),
        providersRequested=provider_ids,
        providerCalls=len(items) * len(provider_ids),
        providerMissing=provider_missing,
        decisionsAccepted=len(decisions),
        decisionsRejected=rejected,
        consensusAnswers=len(consensus),
        rankedEligible=False,
        outputPath="",
        warnings=[
            "Agent answers are not official answer keys.",
            "Consensus suggestions require official/source review before answer-key alignment.",
            "No agent answer from this stage is ranked-eligible.",
        ],
    )
    return packets, decisions, consensus, report


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


def summarize_outputs(
    packets: list[dict],
    decisions: list[dict],
    consensus: list[dict],
    report: AgentAnswerReport,
) -> None:
    report.solveItems = len({str(packet.get("questionId")) for packet in packets if packet.get("questionId")})
    report.providerCalls = len(packets)
    report.providerMissing = sum(1 for packet in packets if packet.get("status") == "provider_missing")
    report.decisionsAccepted = len(decisions)
    report.decisionsRejected = sum(
        1
        for packet in packets
        if packet.get("status") in {"provider_error", "completed"} and packet.get("decisionAccepted") is False
    )
    report.consensusAnswers = len(consensus)


def write_outputs(
    packets: list[dict],
    decisions: list[dict],
    consensus: list[dict],
    report: AgentAnswerReport,
    output_root: Path,
    merge_existing: bool = False,
    min_agree: int = 2,
    min_confidence: float = 0.7,
) -> AgentAnswerReport:
    output_root.mkdir(parents=True, exist_ok=True)
    packets_path = output_root / "agent-answer-key-packets.json"
    decisions_path = output_root / "agent-answer-key-decisions.json"
    consensus_path = output_root / "agent-answer-key-consensus.json"
    report_path = output_root / "agent-answer-key-report.json"
    if merge_existing:
        packets = merge_rows(load_json_list(packets_path), packets, ["questionId", "provider"])
        decisions = merge_rows(load_json_list(decisions_path), decisions, ["questionId", "provider"])
        consensus = build_consensus(decisions, min_agree=min_agree, min_confidence=min_confidence)
        summarize_outputs(packets, decisions, consensus, report)
    packets_path.write_text(json.dumps(packets, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    decisions_path.write_text(json.dumps(decisions, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    consensus_path.write_text(json.dumps(consensus, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report.outputPath = str(consensus_path.resolve())
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Run review-only model-agent answer suggestions for SSC CGL candidates.")
    parser.add_argument("--candidates", type=Path, default=DEFAULT_CANDIDATES)
    parser.add_argument("--providers", default="deepseek,mistral,gpt")
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--max-items", type=int, default=25)
    parser.add_argument("--start-index", type=int, default=0)
    parser.add_argument("--min-agree", type=int, default=2)
    parser.add_argument("--min-confidence", type=float, default=0.7)
    parser.add_argument("--merge-existing", action="store_true")
    parser.add_argument("--skip-existing", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.candidates.exists():
        parser.error(f"candidate file not found: {args.candidates}")
    try:
        provider_ids = parse_providers(args.providers)
    except ValueError as exc:
        parser.error(str(exc))

    candidates = load_json(args.candidates)
    if not isinstance(candidates, list):
        parser.error("candidate file must contain a JSON array")
    if args.start_index < 0:
        parser.error("--start-index must be 0 or greater")

    packets, decisions, consensus, report = run_agent_answer_key(
        candidates,
        provider_ids,
        args.max_items,
        args.dry_run,
        args.min_agree,
        args.min_confidence,
        args.start_index,
        existing_question_ids(args.output_root) if args.skip_existing else None,
    )
    report = write_outputs(
        packets,
        decisions,
        consensus,
        report,
        args.output_root,
        merge_existing=args.merge_existing,
        min_agree=args.min_agree,
        min_confidence=args.min_confidence,
    )
    print(
        f"agent-answer items {report.solveItems}/{report.totalCandidates}; "
        f"provider calls {report.providerCalls}; accepted {report.decisionsAccepted}; "
        f"consensus {report.consensusAnswers}; missing providers {report.providerMissing}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
