#!/usr/bin/env python3
"""Author large Energy Auditing tutorials in bounded Ox Alpha chunks.

The two longest tutorial decks contain many worked examples and image-backed
tables. Keeping each Ox response bounded makes it possible to preserve every
question without relying on a single response to hold an entire deck. Raw
chunk drafts and the compact cross-chunk audit remain under tmp/.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RUNNER_PATH = ROOT / "scripts" / "energy_auditing_opencode.py"
spec = importlib.util.spec_from_file_location("energy_auditing_opencode", RUNNER_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Could not load {RUNNER_PATH}")
runner = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = runner
spec.loader.exec_module(runner)


WINDOWS: dict[str, list[tuple[int, int]]] = {
    # Keep each example's statement/table and answer slide in one request.
    "t03-cumsum-analysis": [(1, 5)],
    "t01-energy-calculations": [(1, 4), (5, 8), (9, 12), (13, 16), (17, 21)],
    "t06-electrical-energy-tariff": [(1, 6), (7, 12), (13, 18), (19, 22)],
}


def window_key(job: Any) -> str:
    """Map the manifest's tutorial-* slug to the bounded-window key."""
    slug = str(job.slug)
    return slug.removeprefix("tutorial-")


def split_source(source: str) -> tuple[str, dict[int, str]]:
    matches = list(re.finditer(r"(?m)^===== SLIDE (\d+) =====\s*$", source))
    if not matches:
        raise ValueError("Compact tutorial source has no slide markers.")
    prefix = source[: matches[0].start()].strip()
    slides: dict[int, str] = {}
    for index, match in enumerate(matches):
        number = int(match.group(1))
        end = matches[index + 1].start() if index + 1 < len(matches) else len(source)
        slides[number] = source[match.start():end].strip()
    return prefix, slides


def chunk_source(source: str, start: int, end: int) -> str:
    prefix, slides = split_source(source)
    selected = [slides[n] for n in sorted(slides) if start <= n <= end]
    if not selected:
        raise ValueError(f"No slides in requested window {start}-{end}.")
    return "\n\n".join([prefix, *selected]) + "\n"


def image_attachments(job: Any, start: int, end: int) -> tuple[Path, ...]:
    paths = []
    for path in job.attachments:
        match = re.search(r"/slide-(\d+)-", path.as_posix())
        if match and start <= int(match.group(1)) <= end:
            paths.append(path)
    return tuple(paths)


def call_with_retry(prompt: str, attachments: tuple[Path, ...], attempts: int = 4) -> tuple[str, dict[str, Any]]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            return runner.run_opencode(prompt, attachments)
        except RuntimeError as exc:
            last_error = exc
            if attempt == attempts:
                raise
            # Console Go can briefly return "Endpoint is unavailable" while
            # another bounded authoring call is finishing. Retry the same
            # source request without changing its evidence.
            wait_seconds = min(45, 10 * attempt)
            print(f"  Ox retry {attempt}/{attempts - 1} after failure; waiting {wait_seconds}s", flush=True)
            time.sleep(wait_seconds)
    raise RuntimeError(str(last_error))


def chunk_prompt(job: Any, source: str, ordinal: int, total: int, start: int, end: int) -> str:
    return f"""{runner.author_instructions(job)}

This is bounded chunk {ordinal} of {total} for the same tutorial. Work only from
slides {start}-{end} in SOURCE, but preserve every explicit question/example
and every legible value in those slides in original order. This chunk will be
assembled with the other chunks, so do not claim that absent slides were
covered. Use ## Question (or ## Example when it is plainly a worked question)
for each source question and include all of these fields for each one:
Source wording, Given and target, Governing relation, Step-by-step solution,
Final answer, Unit or sanity check, and Common trap. If a table or figure is
available only in an attached image, inspect that image and transcribe its
values; if it is genuinely illegible, state that instead of guessing. Return
only the Markdown chunk body without YAML frontmatter or a fenced code block.

NOTE TITLE: {job.title}
SOURCE LABEL: {job.source_label}
CHUNK: {ordinal}/{total}, slides {start}-{end}
PROVENANCE: {json.dumps(job.provenance, ensure_ascii=False, sort_keys=True)}

<SOURCE>
{source}
</SOURCE>
"""


def normalize_chunk(text: str) -> str:
    body = runner.strip_markdown_fence(text).strip()
    # Final assembly supplies exactly one title and frontmatter.
    body = re.sub(r"^#\s+[^\n]+\n+", "", body, count=1)
    return body.strip()


def renumber_questions(body: str) -> str:
    counter = 0
    lines: list[str] = []
    for line in body.splitlines():
        match = re.match(r"^(##)\s+(Question|Example)\b\s*(.*)$", line, flags=re.IGNORECASE)
        if match:
            counter += 1
            suffix = match.group(3).strip(" -:")
            # Chunk authors restart their source numbering in each bounded
            # window. Keep meaningful titles, but never repeat that source
            # number after the assembled canonical question number.
            previous = None
            while suffix != previous:
                previous = suffix
                suffix = re.sub(r"^\d+\s*(?:[-–—:]\s*)?", "", suffix).strip()
            line = f"## Question {counter}" + (f" - {suffix}" if suffix else "")
        lines.append(line)
    return "\n".join(lines).strip() + "\n"


def checkpoint_audit(
    checkpoint_dir: Path | None,
    checkpoint_stem: str,
    draft: str,
    history: list[dict[str, Any]],
) -> None:
    """Keep the latest bounded draft and audit evidence if a later call fails."""
    if checkpoint_dir is None:
        return
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    runner.write_atomic(checkpoint_dir / f"{checkpoint_stem}-latest.md", draft.rstrip() + "\n")
    runner.write_atomic(
        checkpoint_dir / f"{checkpoint_stem}-audit-history.json",
        json.dumps(history, ensure_ascii=False, indent=2) + "\n",
    )


def audit_one_chunk(
    job: Any,
    source: str,
    draft: str,
    attachments: tuple[Path, ...],
    checkpoint_dir: Path | None = None,
    checkpoint_stem: str = "chunk",
    initial_history: list[dict[str, Any]] | None = None,
) -> tuple[str, list[dict[str, Any]]]:
    """Audit and, if needed, repair one bounded response in place."""
    history: list[dict[str, Any]] = list(initial_history or [])
    current = draft
    attempt_start = len(history) + 1
    for attempt in range(attempt_start, attempt_start + 2):
        text, meta = call_with_retry(runner.audit_prompt(job, source, current), attachments)
        audit = runner.parse_audit(text)
        history.append({"attempt": attempt, "result": audit, "modelRun": meta})
        checkpoint_audit(checkpoint_dir, checkpoint_stem, current, history)
        if audit["status"] == "pass":
            return normalize_chunk(current), history
        current, repair_meta = call_with_retry(
            runner.repair_prompt(job, source, current, [str(item) for item in audit["issues"]]),
            attachments,
        )
        current = normalize_chunk(current)
        history[-1]["repairModelRun"] = repair_meta
        checkpoint_audit(checkpoint_dir, checkpoint_stem, current, history)
    checkpoint_audit(checkpoint_dir, checkpoint_stem, current, history)
    raise RuntimeError("A bounded tutorial chunk did not pass its Ox Alpha audit after two attempts; latest draft and audit history were checkpointed under tmp/.")


def audit_assembled(
    job: Any,
    source: str,
    chunks: list[str],
    windows: list[tuple[int, int]],
    attachments: tuple[Path, ...],
    checkpoint_dir: Path | None = None,
) -> tuple[list[str], list[dict[str, Any]]]:
    """Run a JSON-only cross-chunk audit and repair only affected chunks."""
    history: list[dict[str, Any]] = []
    current_chunks = list(chunks)
    for attempt in range(1, 3):
        assembled = renumber_questions("\n\n".join(current_chunks))
        audit_source = "\n\n".join(
            f"<!-- CHUNK {index}: slides {start}-{end} -->\n{chunk}"
            for index, (start, end), chunk in zip(range(1, len(current_chunks) + 1), windows, current_chunks)
        )
        text, meta = call_with_retry(runner.audit_prompt(job, source, audit_source), attachments)
        audit = runner.parse_audit(text)
        history.append({"attempt": attempt, "result": audit, "modelRun": meta})
        checkpoint_audit(checkpoint_dir, "assembled", renumber_questions("\n\n".join(current_chunks)), history)
        if audit["status"] == "pass":
            return current_chunks, history

        issues = [str(item) for item in audit["issues"]]
        target_indices: set[int] = set()
        for issue in issues:
            chunk_matches = re.findall(r"(?:chunk|section)\s*(\d+)", issue, flags=re.IGNORECASE)
            if chunk_matches:
                selected = chunk_matches if re.search(r"collision|duplicate|both", issue, flags=re.IGNORECASE) else chunk_matches[:1]
                target_indices.update(int(match) - 1 for match in selected)
            for match in re.findall(r"slide(?:s)?\s*(\d+)(?:\s*[-–]\s*(\d+))?", issue, flags=re.IGNORECASE):
                start = int(match[0])
                end = int(match[1] or match[0])
                target_indices.update(index for index, (lo, hi) in enumerate(windows) if lo <= end and hi >= start)
        if not target_indices:
            # A cross-chunk issue without a location is still repaired in
            # bounded contexts, never by asking Ox to rewrite the full note.
            target_indices = set(range(len(current_chunks)))
        target_indices = {index for index in target_indices if 0 <= index < len(current_chunks)}
        for index in sorted(target_indices):
            start, end = windows[index]
            local_source = chunk_source(source, start, end)
            globally_repaired, global_repair_meta = call_with_retry(
                runner.repair_prompt(job, local_source, current_chunks[index], issues),
                image_attachments(job, start, end),
            )
            repaired, local_history = audit_one_chunk(
                job,
                local_source,
                normalize_chunk(globally_repaired),
                image_attachments(job, start, end),
                checkpoint_dir=checkpoint_dir,
                checkpoint_stem=f"assembled-repair-chunk-{index + 1:02d}",
            )
            current_chunks[index] = repaired
            history[-1].setdefault("localizedRepairs", []).append(
                {
                    "chunk": index + 1,
                    "slides": [start, end],
                    "globalRepairModelRun": global_repair_meta,
                    "auditHistory": local_history,
                }
            )
            checkpoint_audit(checkpoint_dir, "assembled", renumber_questions("\n\n".join(current_chunks)), history)
    checkpoint_audit(checkpoint_dir, "assembled", renumber_questions("\n\n".join(current_chunks)), history)
    raise RuntimeError(f"{job.slug} assembled cross-chunk audit did not pass after two bounded repair passes.")


def run_job(job: Any, force: bool, audit_path: Path) -> dict[str, Any]:
    key = window_key(job)
    if key not in WINDOWS:
        raise ValueError(f"No bounded windows configured for {job.slug}.")
    if job.output_path.exists() and not force:
        return {"slug": job.slug, "status": "skipped", "outputPath": str(job.output_path.relative_to(ROOT))}
    source = runner.source_text(job)
    windows = WINDOWS[key]
    chunk_root = ROOT / "tmp" / "energy-auditing" / "tutorial-chunks" / key
    chunk_root.mkdir(parents=True, exist_ok=True)
    chunks: list[str] = []
    chunk_meta: list[dict[str, Any]] = []
    for ordinal, (start, end) in enumerate(windows, start=1):
        print(f"[{ordinal}/{len(windows)}] {job.slug}: slides {start}-{end}", flush=True)
        bounded_source = chunk_source(source, start, end)
        attachments = image_attachments(job, start, end)
        chunk_stem = f"chunk-{ordinal:02d}-slides-{start:02d}-{end:02d}"
        final_chunk_path = chunk_root / f"{chunk_stem}.md"
        history_path = chunk_root / f"{chunk_stem}-audit-history.json"
        latest_path = chunk_root / f"{chunk_stem}-latest.md"
        latest_history_path = chunk_root / f"{chunk_stem}-audit-history.json"
        reused = False
        chunk_audit_history: list[dict[str, Any]]
        if final_chunk_path.exists() and history_path.exists():
            saved_history = json.loads(history_path.read_text(encoding="utf-8"))
            if saved_history and saved_history[-1].get("result", {}).get("status") == "pass":
                normalized = final_chunk_path.read_text(encoding="utf-8").strip()
                chunk_audit_history = saved_history
                model_meta = {"resumed": True, "checkpoint": str(final_chunk_path.relative_to(ROOT))}
                reused = True
        if not reused and latest_path.exists() and latest_history_path.exists():
            saved_history = json.loads(latest_history_path.read_text(encoding="utf-8"))
            if saved_history and saved_history[-1].get("result", {}).get("status") != "pass":
                print(f"  resuming {job.slug} {chunk_stem} from latest bounded audit", flush=True)
                normalized = latest_path.read_text(encoding="utf-8").strip()
                normalized, chunk_audit_history = audit_one_chunk(
                    job,
                    bounded_source,
                    normalized,
                    attachments,
                    checkpoint_dir=chunk_root,
                    checkpoint_stem=chunk_stem,
                    initial_history=saved_history,
                )
                model_meta = {"resumed": True, "checkpoint": str(latest_path.relative_to(ROOT))}
                reused = True
        if not reused:
            draft, model_meta = call_with_retry(
                chunk_prompt(job, bounded_source, ordinal, len(windows), start, end),
                attachments,
            )
            normalized = normalize_chunk(draft)
            normalized, chunk_audit_history = audit_one_chunk(
                job,
                bounded_source,
                normalized,
                attachments,
                checkpoint_dir=chunk_root,
                checkpoint_stem=chunk_stem,
            )
        runner.write_atomic(final_chunk_path, normalized.rstrip() + "\n")
        runner.write_atomic(history_path, json.dumps(chunk_audit_history, ensure_ascii=False, indent=2) + "\n")
        chunks.append(normalized)
        chunk_meta.append({"ordinal": ordinal, "slides": [start, end], "attachments": [str(p.relative_to(ROOT)) for p in attachments], "modelRun": model_meta, "auditHistory": chunk_audit_history, "resumed": reused})

    chunks, audit_history = audit_assembled(job, source, chunks, windows, job.attachments, checkpoint_dir=chunk_root)
    body = renumber_questions("\n\n".join(chunks))
    markdown = runner.frontmatter(job) + f"# {job.title}\n\n" + body
    checks = runner.deterministic_checks(job, markdown)
    if checks:
        raise RuntimeError(f"{job.slug} failed deterministic checks: {', '.join(checks)}")
    runner.write_atomic(job.output_path, markdown)
    return {
        "slug": job.slug,
        "kind": job.kind,
        "status": "authored",
        "sourceLabel": job.source_label,
        "outputPath": str(job.output_path.relative_to(ROOT)),
        "chunkCount": len(windows),
        "chunks": chunk_meta,
        "auditHistory": audit_history,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--jobs", type=Path, default=ROOT / "data/sources/energy-auditing/authoring-jobs.json")
    parser.add_argument("--audit", type=Path, default=ROOT / "data/sources/energy-auditing/authoring-audit-tutorial-chunks.json")
    parser.add_argument("--slug", choices=sorted(WINDOWS), action="append")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    jobs = runner.load_jobs(args.jobs.resolve())
    requested = set(args.slug or WINDOWS)
    selected = [job for job in jobs if window_key(job) in requested]
    if not selected:
        raise SystemExit("No bounded tutorial jobs selected.")
    audit_path = args.audit.resolve()
    existing: dict[str, Any] = {}
    if audit_path.exists():
        payload = json.loads(audit_path.read_text(encoding="utf-8"))
        existing = {str(item.get("slug")): item for item in payload.get("jobs", []) if isinstance(item, dict)}
    for job in selected:
        result = run_job(job, args.force, audit_path)
        if result.get("status") != "skipped" or job.slug not in existing:
            existing[job.slug] = result
        runner.write_atomic(audit_path, json.dumps({"generatedAt": runner.now_iso(), "model": runner.MODEL, "variant": runner.VARIANT, "jobs": [existing[key] for key in sorted(existing)]}, ensure_ascii=False, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
