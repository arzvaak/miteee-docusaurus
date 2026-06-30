"""Apply review-only agent answer consensus to SSC CGL candidates.

This stage converts multi-agent answer suggestions into provisional aligned
candidates for topic and duplicate review. It does not create ranked questions:
agent consensus is evidence for the next review stage, not an official key.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANDIDATES = ROOT / "data" / "exams" / "ssc-cgl" / "segments" / "official-ssc-2026-cgl-notice" / "question-candidates.json"
DEFAULT_CONSENSUS = ROOT / "data" / "exams" / "ssc-cgl" / "agent-answer-key" / "official-ssc-2026-cgl-notice" / "agent-answer-key-consensus.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "aligned" / "agent-consensus"

VALID_OPTIONS = {"a", "b", "c", "d"}


@dataclass
class AgentConsensusAlignmentReport:
    generatedAt: str
    totalCandidates: int
    matched: int
    missing: int
    rejectedConsensus: int
    rankedEligible: bool
    alignedPath: str
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_option(value: object) -> str | None:
    if value is None:
        return None
    match = re.search(r"\b([a-d])\b", str(value).strip().lower())
    return match.group(1) if match else None


def consensus_question_id(entry: dict) -> str:
    return str(entry.get("questionId") or entry.get("questionNumber") or "").strip()


def valid_consensus(entry: dict, min_agree: int, min_confidence: float) -> bool:
    return (
        entry.get("sourceType") == "agent_answer_suggestion"
        and entry.get("reviewStatus") == "needs_official_or_agent_consensus_review"
        and entry.get("rankedEligible") is False
        and normalize_option(entry.get("correctOption")) in VALID_OPTIONS
        and int(entry.get("agreementCount") or 0) >= min_agree
        and float(entry.get("averageConfidence") or 0) >= min_confidence
    )


def index_consensus(consensus: list[dict], min_agree: int, min_confidence: float) -> tuple[dict[str, dict], int]:
    accepted: dict[str, dict] = {}
    rejected = 0
    for entry in consensus:
        if not isinstance(entry, dict):
            rejected += 1
            continue
        question_id = consensus_question_id(entry)
        if not question_id or not valid_consensus(entry, min_agree, min_confidence):
            rejected += 1
            continue
        accepted[question_id] = entry
    return accepted, rejected


def apply_consensus(candidates: list[dict], consensus: list[dict], min_agree: int, min_confidence: float) -> tuple[list[dict], int]:
    consensus_by_id, rejected = index_consensus(consensus, min_agree, min_confidence)
    candidate_ids = {str(candidate.get("id") or "") for candidate in candidates if isinstance(candidate, dict)}
    rejected += sum(1 for question_id in consensus_by_id if question_id not in candidate_ids)

    aligned: list[dict] = []
    for candidate in candidates:
        item = dict(candidate)
        item["rankedEligible"] = False
        question_id = str(item.get("id") or "")
        suggestion = consensus_by_id.get(question_id)
        if not suggestion:
            item["correctOption"] = None
            item["alignmentStatus"] = "missing_agent_consensus"
            item["reviewStatus"] = "missing_agent_consensus"
            aligned.append(item)
            continue

        item["correctOption"] = normalize_option(suggestion.get("correctOption"))
        item["alignmentStatus"] = "agent_consensus_matched"
        item["reviewStatus"] = "needs_topic_duplicate_review"
        item["answerEvidence"] = {
            "sourceType": "agent_answer_suggestion",
            "sourceId": suggestion.get("sourceId") or "agent-answer-consensus",
            "providers": suggestion.get("providers") or [],
            "agreementCount": int(suggestion.get("agreementCount") or 0),
            "averageConfidence": float(suggestion.get("averageConfidence") or 0),
            "explanations": suggestion.get("explanations") or [],
        }
        aligned.append(item)
    return aligned, rejected


def write_outputs(aligned: list[dict], rejected_consensus: int, output_root: Path) -> AgentConsensusAlignmentReport:
    output_root.mkdir(parents=True, exist_ok=True)
    aligned_path = output_root / "aligned-candidates.json"
    aligned_path.write_text(json.dumps(aligned, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    matched = sum(1 for item in aligned if item.get("alignmentStatus") == "agent_consensus_matched")
    missing = sum(1 for item in aligned if item.get("alignmentStatus") == "missing_agent_consensus")
    report = AgentConsensusAlignmentReport(
        generatedAt=now_iso(),
        totalCandidates=len(aligned),
        matched=matched,
        missing=missing,
        rejectedConsensus=rejected_consensus,
        rankedEligible=False,
        alignedPath=str(aligned_path.resolve()),
        warnings=[
            "Agent consensus is not an official answer key.",
            "Agent-consensus aligned candidates remain non-ranked.",
            "Topic, duplicate, provenance, and final agent review are still required before curated practice promotion.",
        ],
    )
    (output_root / "alignment-report.json").write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Apply SSC CGL agent answer consensus to review candidates.")
    parser.add_argument("--candidates", type=Path, default=DEFAULT_CANDIDATES)
    parser.add_argument("--consensus", type=Path, default=DEFAULT_CONSENSUS)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--min-agree", type=int, default=2)
    parser.add_argument("--min-confidence", type=float, default=0.7)
    args = parser.parse_args()

    if not args.candidates.exists():
        parser.error(f"candidate file not found: {args.candidates}")
    if not args.consensus.exists():
        parser.error(f"consensus file not found: {args.consensus}")

    candidates = load_json(args.candidates)
    consensus = load_json(args.consensus)
    if not isinstance(candidates, list):
        parser.error("candidate file must contain a JSON array")
    if not isinstance(consensus, list):
        parser.error("consensus file must contain a JSON array")

    aligned, rejected = apply_consensus(candidates, consensus, args.min_agree, args.min_confidence)
    report = write_outputs(aligned, rejected, args.output_root)
    print(
        f"agent-consensus aligned {report.matched}/{report.totalCandidates}; "
        f"missing {report.missing}; rejected consensus {report.rejectedConsensus}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
