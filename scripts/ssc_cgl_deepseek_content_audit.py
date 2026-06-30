"""Run DeepSeek-led SSC CGL content audit over generated notes/questions.

The script prepares section/topic shards and asks DeepSeek to act as an
orchestrator with multiple flash reviewers: coverage, explanation quality,
duplicate risk, and 200/200 usefulness. It writes auditable packets even in
dry-run mode so missing API keys are visible instead of silently skipped.
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_GENERATED_ROOT = ROOT / "data" / "generated" / "exams" / "ssc-cgl"
DEFAULT_NOTES_ROOT = ROOT / "docs" / "ssc-cgl"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "content-audit"
DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions"


@dataclass
class ContentAuditReport:
    generatedAt: str
    provider: str
    model: str
    dryRun: bool
    shards: int
    completedCalls: int
    providerMissing: int
    outputRoot: str


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def note_samples(notes_root: Path, limit: int) -> list[dict]:
    samples: list[dict] = []
    for path in sorted(notes_root.glob("**/*.md"))[:limit]:
        text = path.read_text(encoding="utf-8", errors="replace")
        samples.append({
            "path": str(path.relative_to(ROOT)),
            "length": len(text),
            "headings": [line.strip("# ").strip() for line in text.splitlines() if line.startswith("## ")][:16],
            "excerpt": text[:2400],
        })
    return samples


def build_shards(generated_root: Path, notes_root: Path, shard_size: int) -> list[dict]:
    questions = load_json(generated_root / "questions.json")
    topics = load_json(generated_root / "topics.json")
    ai_audit = load_json(generated_root / "ai-audit-report.json") if (generated_root / "ai-audit-report.json").exists() else {}
    reviewed = [question for question in questions if question.get("reviewStatus") == "reviewed"]
    shards: list[dict] = []
    for section in sorted({question.get("section") for question in reviewed}):
        section_questions = [question for question in reviewed if question.get("section") == section]
        for offset in range(0, min(len(section_questions), shard_size * 3), shard_size):
            chunk = section_questions[offset:offset + shard_size]
            shards.append({
                "section": section,
                "offset": offset,
                "questions": [
                    {
                        "id": question.get("id"),
                        "topic": question.get("topic"),
                        "stem": question.get("stem"),
                        "options": question.get("options"),
                        "correctOption": question.get("correctOption"),
                        "explanation": question.get("explanation"),
                        "sourceType": question.get("provenance", {}).get("sourceType"),
                    }
                    for question in chunk
                ],
                "topicRows": [topic for topic in topics if topic.get("section") == section][:20],
                "noteSamples": note_samples(notes_root / str(section).replace("general-awareness", "ga").replace("quantitative-aptitude", "quant").replace("english-comprehension", "english"), 3),
                "aiAudit": ai_audit,
            })
    return shards


def build_prompt(shard: dict) -> str:
    expected = {
        "section": shard.get("section"),
        "overallDecision": "pass|repair_needed|blocker",
        "coverageFindings": ["topic/type gaps with evidence"],
        "explanationFindings": ["thin or unclear explanation examples"],
        "duplicateRiskFindings": ["exact or likely duplicate risks"],
        "speedFindings": ["36-second/200-200 usefulness issues"],
        "noteFindings": ["note depth, flow, examples, traps, diagrams"],
        "repairQueue": [{"priority": "P0|P1|P2", "target": "file/topic/question id", "action": "specific repair"}],
    }
    return "\n".join([
        "You are DeepSeek V4 Pro orchestrating SSC CGL 200/200 content review.",
        "Internally use four flash reviewers: coverage, explanation quality, duplicate risk, and 200/200 speed usefulness.",
        "Return strict JSON only. Use only the supplied shard evidence. Do not invent missing books, sources, or question facts.",
        "Be harsh: the learner wants 200/200, so flag shallow explanations, topic gaps, bad drills, and notes that do not teach methods/traps.",
        "Important: this is a sampled shard, not the whole corpus. Say 'not present in this shard' for shard limits; claim a global missing topic only if topicRows or aiAudit prove it.",
        f"Expected JSON shape: {json.dumps(expected, ensure_ascii=False)}",
        "Shard evidence:",
        json.dumps(shard, ensure_ascii=False),
    ])


def call_deepseek(prompt: str, model: str) -> tuple[str, str]:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return "provider_missing", ""
    payload = {
        "model": model,
        "temperature": 0.1,
        "max_tokens": 5000,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "user", "content": prompt}],
    }
    request = urllib.request.Request(
        DEEPSEEK_ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        data = json.loads(response.read().decode("utf-8"))
    return "completed", str(data.get("choices", [{}])[0].get("message", {}).get("content", ""))


def main() -> int:
    parser = argparse.ArgumentParser(description="Run DeepSeek SSC CGL content audit.")
    parser.add_argument("--generated-root", type=Path, default=DEFAULT_GENERATED_ROOT)
    parser.add_argument("--notes-root", type=Path, default=DEFAULT_NOTES_ROOT)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--max-shards", type=int, default=4)
    parser.add_argument("--shard-size", type=int, default=24)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
    args.output_root.mkdir(parents=True, exist_ok=True)
    shards = build_shards(args.generated_root, args.notes_root, args.shard_size)[:args.max_shards]
    completed = 0
    missing = 0
    for index, shard in enumerate(shards, start=1):
        prompt = build_prompt(shard)
        (args.output_root / f"shard-{index:02d}-prompt.txt").write_text(prompt, encoding="utf-8")
        if args.dry_run:
            continue
        status, content = call_deepseek(prompt, model)
        if status == "completed":
            completed += 1
        if status == "provider_missing":
            missing += 1
        (args.output_root / f"shard-{index:02d}-response.json").write_text(content or json.dumps({"status": status}), encoding="utf-8")

    report = ContentAuditReport(
        generatedAt=now_iso(),
        provider="deepseek",
        model=model,
        dryRun=args.dry_run,
        shards=len(shards),
        completedCalls=completed,
        providerMissing=missing,
        outputRoot=str(args.output_root),
    )
    (args.output_root / "content-audit-report.json").write_text(json.dumps(asdict(report), indent=2) + "\n", encoding="utf-8")
    print(f"content audit shards={report.shards} completed={report.completedCalls} missing_provider={report.providerMissing} dry_run={report.dryRun}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
