#!/usr/bin/env python3
"""Build the zero-fabrication GATE EE/DA practice source.

The source archive is deliberately outside this repository.  This adapter reads
the immutable canonical candidates, official final-key rows, the two reviewed
pilot classification passes, and the pilot visual-audit ledger.  Only records
that pass all of those gates are promoted into ``data/exams/gate/questions.json``.
Everything else is written to an external, resumable Luna-high queue.

No model is called by this script.  The queue is an explicit hand-off for the
owner's Luna-high classification run; lexical shortlists are never admissions.
"""

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import math
import re
import shutil
from pathlib import Path
from typing import Any

from gate_explanations import EXPLANATIONS


DEFAULT_SOURCE_ROOT = Path("/home/sushi/MITEEE_LOCAL_ARTIFACTS/gate-2027-books")
DEFAULT_OUTPUT = Path("data/exams/gate/questions.json")
DEFAULT_TOPICS = Path("data/exams/gate/topics.json")
DEFAULT_ASSET_ROOT = Path("public/content-assets/gate")
DEFAULT_DURABLE_ASSET_ROOT = Path("data/exams/gate/assets")
DEFAULT_AUDIT = DEFAULT_SOURCE_ROOT / "audits/gate-import-audit.json"
DEFAULT_QUEUE = DEFAULT_SOURCE_ROOT / "classification/gate-luna-high-queue.json"
PAPERS = ("EE", "DA")
YEARS = (2024, 2025, 2026)

# Source-checked reconstruction for a native text layer whose stacked
# fractions were emitted out of reading order. The original PDF remains the
# provenance authority; this override changes no mathematical content.
STATEMENT_OVERRIDES = {
    "GATE-2025-DA-S5-Q31-69ba28fc60e6": (
        "There are three boxes containing white balls and black balls. Box-1 contains "
        "2 black and 1 white balls. Box-2 contains 1 black and 2 white balls. Box-3 "
        "contains 3 black and 3 white balls. In a random experiment, one of these boxes "
        "is selected, where the probability of choosing Box-1 is 1/2, Box-2 is 1/6, "
        "and Box-3 is 1/3. A ball is drawn at random from the selected box. Given that "
        "the ball drawn is white, the probability that it is drawn from Box-2 is _____. "
        "(Round off to two decimal places.)"
    ),
}

# Source-checked cleanup for an option whose native text extraction absorbed
# the first word of the following question. The official page reads simply
# "(D) 21"; no mathematical content is inferred here.
OPTION_OVERRIDES = {
    "GATE-2026-DA-S8-Q44-4adb2f713433": [
        {"label": "A", "text": "100"},
        {"label": "B", "text": "90"},
        {"label": "C", "text": "49"},
        {"label": "D", "text": "21"},
    ],
}

# These are reviewed pilot decisions, made only where the two pilot passes
# identify the same syllabus concept.  Ambiguous labels are resolved by the
# question-level decision below, never by the prefilter shortlist.
LEAF_OVERRIDES: dict[str, tuple[str, tuple[str, ...]]] = {
    # EE: Electric Circuits pilot
    "GATE-2024-EE-S8-Q13-e95a2bbe014d": ("EE-S02-L002", ("EE-S02-L004",)),
    "GATE-2024-EE-S8-Q14-e95a2bbe014d": ("EE-S02-L012", ()),
    "GATE-2024-EE-S8-Q48-e95a2bbe014d": ("EE-S02-L016", ()),
    "GATE-2024-EE-S8-Q49-e95a2bbe014d": ("EE-S02-L008", ("EE-S02-L014", "EE-S02-L003")),
    "GATE-2025-EE-S4-Q18-65d25e29697c": ("EE-S02-L001", ("EE-S02-L004",)),
    "GATE-2025-EE-S4-Q52-65d25e29697c": ("EE-S02-L003", ()),
    "GATE-2025-EE-S4-Q57-65d25e29697c": ("EE-S02-L012", ()),
    "GATE-2026-EE-S5-Q23-4b6702632024": ("EE-S02-L003", ()),
    "GATE-2026-EE-S5-Q24-4b6702632024": ("EE-S02-L008", ()),
    "GATE-2026-EE-S5-Q25-4b6702632024": ("EE-S02-L002", ("EE-S02-L004",)),
    "GATE-2026-EE-S5-Q26-4b6702632024": ("EE-S02-L019", ("EE-S02-L014",)),
    "GATE-2026-EE-S5-Q42-4b6702632024": ("EE-S02-L019", ("EE-S02-L014",)),
    "GATE-2026-EE-S5-Q43-4b6702632024": ("EE-S02-L012", ()),
    "GATE-2026-EE-S5-Q44-4b6702632024": ("EE-S02-L008", ()),
    "GATE-2026-EE-S5-Q60-4b6702632024": ("EE-S02-L016", ()),
    # DA: Probability and Statistics pilot
    "GATE-2024-DA-S1-Q11-8ba7f11014fc": ("DA-S01-L028", ("DA-S01-L030",)),
    "GATE-2024-DA-S1-Q12-8ba7f11014fc": ("DA-S01-L005", ("DA-S01-L004", "DA-S01-L006")),
    "GATE-2024-DA-S1-Q27-8ba7f11014fc": ("DA-S01-L017", ("DA-S01-L030",)),
    "GATE-2024-DA-S1-Q34-8ba7f11014fc": ("DA-S01-L014", ()),
    "GATE-2024-DA-S1-Q36-8ba7f11014fc": ("DA-S01-L012", ()),
    "GATE-2024-DA-S1-Q56-8ba7f11014fc": ("DA-S01-L026", ("DA-S01-L010",)),
    "GATE-2024-DA-S1-Q57-8ba7f11014fc": ("DA-S01-L027", ()),
    "GATE-2024-DA-S1-Q58-8ba7f11014fc": ("DA-S01-L011", ("DA-S01-L009",)),
    "GATE-2024-DA-S1-Q59-8ba7f11014fc": ("DA-S01-L012", ("DA-S01-L034",)),
    "GATE-2024-DA-S1-Q65-8ba7f11014fc": ("DA-S01-L019", ("DA-S01-L018",)),
    "GATE-2025-DA-S5-Q11-69ba28fc60e6": ("DA-S01-L012", ()),
    "GATE-2025-DA-S5-Q19-69ba28fc60e6": ("DA-S01-L033", ()),
    "GATE-2025-DA-S5-Q20-69ba28fc60e6": ("DA-S01-L030", ()),
    "GATE-2025-DA-S5-Q21-69ba28fc60e6": ("DA-S01-L027", ()),
    "GATE-2025-DA-S5-Q31-69ba28fc60e6": ("DA-S01-L011", ()),
    "GATE-2025-DA-S5-Q36-69ba28fc60e6": ("DA-S01-L032", ()),
    "GATE-2025-DA-S5-Q39-69ba28fc60e6": ("DA-S01-L033", ()),
    "GATE-2025-DA-S5-Q40-69ba28fc60e6": ("DA-S01-L035", ()),
    "GATE-2025-DA-S5-Q41-69ba28fc60e6": ("DA-S01-L027", ()),
    "GATE-2025-DA-S5-Q45-69ba28fc60e6": ("DA-S01-L005", ("DA-S01-L006",)),
    "GATE-2025-DA-S5-Q54-69ba28fc60e6": ("DA-S01-L023", ("DA-S01-L017",)),
    "GATE-2025-DA-S5-Q61-69ba28fc60e6": ("DA-S01-L024", ()),
    "GATE-2026-DA-S8-Q19-4adb2f713433": ("DA-S01-L002", ()),
    "GATE-2026-DA-S8-Q20-4adb2f713433": ("DA-S01-L002", ()),
    "GATE-2026-DA-S8-Q28-4adb2f713433": ("DA-S01-L030", ()),
    "GATE-2026-DA-S8-Q33-4adb2f713433": ("DA-S01-L001", ()),
    "GATE-2026-DA-S8-Q34-4adb2f713433": ("DA-S01-L027", ()),
    "GATE-2026-DA-S8-Q44-4adb2f713433": ("DA-S01-L023", ()),
    "GATE-2026-DA-S8-Q45-4adb2f713433": ("DA-S01-L028", ()),
    "GATE-2026-DA-S8-Q53-4adb2f713433": ("DA-S01-L032", ()),
    "GATE-2026-DA-S8-Q54-4adb2f713433": ("DA-S01-L033", ()),
    "GATE-2026-DA-S8-Q57-4adb2f713433": ("DA-S01-L011", ()),
    "GATE-2026-DA-S8-Q62-4adb2f713433": ("DA-S01-L014", ()),
    "GATE-2026-DA-S8-Q63-4adb2f713433": ("DA-S01-L018", ()),
    "GATE-2026-DA-S8-Q64-4adb2f713433": ("DA-S01-L024", ("DA-S01-L006",)),
}


def load(path: Path) -> Any:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def norm_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip().casefold()


def public_source_ref(value: str | None, source_root: Path) -> str | None:
    """Return a stable corpus-relative reference, never an owner filesystem path."""
    if not value:
        return None
    candidate = Path(value)
    try:
        return candidate.resolve().relative_to(source_root.resolve()).as_posix()
    except (OSError, ValueError):
        return candidate.name or None


def parse_key(value: str, question_type: str) -> dict[str, Any] | None:
    raw = (value or "").strip()
    if question_type == "MCQ":
        labels = re.findall(r"[A-D]", raw.upper())
        if len(labels) == 1:
            return {"kind": "MCQ", "value": labels[0], "raw": raw}
    elif question_type == "MSQ":
        labels = sorted(set(re.findall(r"[A-D]", raw.upper())))
        if labels:
            return {"kind": "MSQ", "value": labels, "raw": raw}
    elif question_type == "NAT":
        if raw.upper() == "MTA":
            return {"kind": "NAT", "value": "MTA", "raw": raw}
        m = re.fullmatch(r"\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*(?:to|[-–])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*", raw, re.I)
        if m:
            lo, hi = float(m.group(1)), float(m.group(2))
            if lo <= hi:
                return {"kind": "NAT", "lower": lo, "upper": hi, "raw": raw}
        m = re.fullmatch(r"-?(?:\d+(?:\.\d*)?|\.\d+)", raw)
        if m:
            n = float(raw)
            return {"kind": "NAT", "lower": n, "upper": n, "raw": raw}
    return None


def identity(record: dict[str, Any]) -> tuple[int, str, str, int]:
    return (int(record["year"]), record["paper"], str(record.get("session_or_set") or "unspecified"), int(record["source_question_number"]))


def best_by_identity(records: list[dict[str, Any]]) -> tuple[dict[tuple[int, str, str, int], dict[str, Any]], dict[tuple[int, str, str, int], list[dict[str, Any]]]]:
    groups: dict[tuple[int, str, str, int], list[dict[str, Any]]] = collections.defaultdict(list)
    for row in records:
        groups[identity(row)].append(row)
    selected: dict[tuple[int, str, str, int], dict[str, Any]] = {}
    for key, rows in groups.items():
        # Prefer a complete extraction, then the canonicalization score.
        selected[key] = sorted(rows, key=lambda r: (bool(r.get("requires_extraction_review")), -float(r.get("canonicalization_score", 0))))[0]
    return selected, groups


def syllabus_leaves(root: Path) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for paper in PAPERS:
        syllabus = load(root / "syllabus-maps" / f"{paper.lower()}-syllabus-map.json")
        for section in syllabus["sections"]:
            for leaf in section["leaves"]:
                out[leaf["leaf_id"]] = {"paper": paper, "section": section["section_number"], "section_title": section["official_name"], "title": leaf["title"]}
    return out


def build(source_root: Path, output: Path, audit_path: Path, queue_path: Path, topics_path: Path = DEFAULT_TOPICS, asset_root: Path = DEFAULT_ASSET_ROOT, durable_asset_root: Path = DEFAULT_DURABLE_ASSET_ROOT) -> dict[str, Any]:
    canonical = load(source_root / "corpus/canonical-question-candidates.json")
    answer_keys = load(source_root / "corpus/official-answer-keys.json")
    accepted: list[dict[str, Any]] = []
    for paper in PAPERS:
        accepted.extend(load(source_root / "pilot" / f"accepted-{paper.lower()}.json"))
    reviewed_ids = {row["stable_id"] for row in accepted}
    crop_audit = {row["stable_id"]: row for row in load(source_root / "audits/pilot-crop-audit.json")}
    leaves = syllabus_leaves(source_root)
    technical = [
        row for row in canonical
        if row.get("paper") in PAPERS and row.get("section") == row.get("paper")
        and row.get("document_type") == "question-paper" and int(row.get("year", 0)) in YEARS
    ]
    selected, groups = best_by_identity(technical)
    keys: dict[tuple[int, str, str, int], list[dict[str, Any]]] = collections.defaultdict(list)
    for row in answer_keys:
        if row.get("paper") in PAPERS and row.get("section") == row.get("paper") and int(row.get("year", 0)) in YEARS:
            keys[(int(row["year"]), row["paper"], str(row.get("session") or "unspecified"), int(row["question_number"]))].append(row)

    admitted: list[dict[str, Any]] = []
    reasons: collections.Counter[str] = collections.Counter()
    held: list[dict[str, Any]] = []
    accepted_by_identity = {(int(row["year"]), row["paper"], str(row.get("session") or "unspecified"), int(row["question_number"])): row for row in accepted}
    for ident, candidate in sorted(selected.items()):
        paper = ident[1]
        pilot = accepted_by_identity.get(ident)
        reason: str | None = None
        key_rows = keys.get(ident, [])
        if pilot is None:
            reason = "pending_luna_high_review"
        elif pilot.get("stable_id") not in LEAF_OVERRIDES:
            reason = "missing_reviewed_granular_leaf"
        elif candidate.get("requires_extraction_review"):
            reason = "damaged_or_incomplete_extraction"
        elif len(key_rows) != 1:
            reason = "official_key_not_unique"
        elif len(pilot.get("classification_passes", [])) != 2:
            reason = "two_pass_classification_missing"
        elif pilot.get("question_type") in ("MCQ", "MSQ") and (not isinstance(candidate.get("options"), list) or len(candidate["options"]) != 4 or {str(option.get("label", "")).upper() for option in candidate["options"]} != {"A", "B", "C", "D"}):
            # Do not rebuild options from prose.  A missing option array is a
            # damaged native record, even when the answer key itself is sound.
            reason = "missing_or_invalid_options"
        elif pilot.get("stable_id") not in EXPLANATIONS:
            reason = "missing_reviewed_explanation"
        elif any(bool(p.get("visual_needed")) for p in pilot.get("classification_passes", [])) and pilot.get("stable_id") not in crop_audit:
            reason = "visual_reconstruction_not_verified"
        elif any(bool(p.get("visual_needed")) for p in pilot.get("classification_passes", [])) and not Path(crop_audit[pilot["stable_id"]].get("crop_path", "")).is_file():
            reason = "verified_visual_crop_missing"
        else:
            parsed = parse_key(str(pilot.get("official_key_or_range", "")), pilot.get("question_type", ""))
            official = parse_key(str(key_rows[0].get("key_or_range", "")), key_rows[0].get("question_type", ""))
            if not parsed or not official or parsed.get("value", parsed.get("lower")) == "MTA" or official.get("value", official.get("lower")) == "MTA":
                reason = "marks_to_all_unscored"
            elif parsed.get("value", parsed.get("lower")) != official.get("value", official.get("lower")) or parsed.get("upper") != official.get("upper"):
                reason = "pilot_key_differs_from_official_final_key"
            elif not candidate.get("raw_normalized_statement") or len(norm_text(candidate["raw_normalized_statement"])) < 20:
                reason = "incomplete_native_statement"
        if reason:
            reasons[reason] += 1
            held.append({"identity": list(ident), "stable_id": pilot.get("stable_id") if pilot else None, "reason": reason, "candidate_stable_id": candidate.get("stable_id"), "source_path": candidate.get("source_path"), "source_pages": candidate.get("source_pages", [])})
            continue
        leaf_id, secondary = LEAF_OVERRIDES[pilot["stable_id"]]
        if leaf_id not in leaves or leaves[leaf_id]["paper"] != paper or any(x not in leaves for x in secondary):
            reasons["reviewed_leaf_not_in_2027_map"] += 1
            held.append({"identity": list(ident), "stable_id": pilot["stable_id"], "reason": "reviewed_leaf_not_in_2027_map", "candidate_stable_id": candidate.get("stable_id")})
            continue
        key_row = keys[ident][0]
        parsed = parse_key(str(key_row.get("key_or_range", "")), key_row.get("question_type", ""))
        visual = any(bool(p.get("visual_needed")) for p in pilot["classification_passes"])
        compact_occurrences = [
            {"sha256": occurrence.get("source_document_sha256"), "path": public_source_ref(occurrence.get("source_path"), source_root), "pages": occurrence.get("source_pages", [])}
            for occurrence in candidate.get("source_occurrences", [])
        ]
        stimulus = None
        if visual:
            target_name = f"{pilot['stable_id']}.png"
            source_crop = Path(crop_audit[pilot["stable_id"]]["crop_path"]).resolve()
            # The explicit source-root boundary prevents an accidental copy of
            # an unrelated local file if a future audit record is malformed.
            source_crop.relative_to(source_root.resolve())
            target = asset_root / paper.lower() / target_name
            durable_target = durable_asset_root / paper.lower() / target_name
            target.parent.mkdir(parents=True, exist_ok=True)
            durable_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source_crop, durable_target)
            shutil.copyfile(durable_target, target)
            stimulus = {"kind": "image", "path": f"/content-assets/gate/{paper.lower()}/{target_name}", "alt": f"Verified source diagram crop for GATE {paper} {ident[0]} session {ident[2]} question {ident[3]}"}
        explanation_concept, explanation_derivation, explanation_final = EXPLANATIONS[pilot["stable_id"]]
        statement = STATEMENT_OVERRIDES.get(pilot["stable_id"], pilot["native_text"]).strip()
        question = {
            "id": pilot["stable_id"], "paper": paper, "year": ident[0], "session": ident[2],
            "question_number": ident[3], "type": pilot["question_type"], "marks": int(key_row["marks"]) if key_row.get("marks") is not None else None,
            "statement": statement, "options": OPTION_OVERRIDES.get(pilot["stable_id"], candidate.get("options", [])), "answer": parsed,
            "primary_leaf_id": leaf_id, "secondary_leaf_ids": list(secondary),
            **({"stimulus": stimulus} if stimulus else {}),
            "explanation": f"{explanation_concept}: {explanation_derivation} Final answer: {explanation_final}",
            "explanation_review": {"status": "independently_checked", "evidence": ["official_final_answer_key", "native_question_statement", "independent_math_and_source_review"] + (["reviewed_statement_reconstruction"] if pilot["stable_id"] in STATEMENT_OVERRIDES else []) + (["reviewed_option_cleanup"] if pilot["stable_id"] in OPTION_OVERRIDES else []) + (["verified_visual_crop"] if visual else [])},
            "mapping_evidence": {"classification_passes": [p.get("confidence") for p in pilot["classification_passes"]], "source": "pilot/two-pass-reviewed", "reviewed_leaf_map": "gate_corpus_import.py:LEAF_OVERRIDES"},
            "provenance": {"question_source_sha256": candidate["source_document_sha256"], "question_source": public_source_ref(candidate.get("source_path"), source_root), "question_pages": candidate.get("source_pages", []), "question_candidate_id": candidate["stable_id"], "question_source_occurrences": compact_occurrences, "answer_key_sha256": key_row["source_document_sha256"], "answer_key_source": public_source_ref(key_row.get("source_path"), source_root), "answer_key_page": key_row.get("source_page"), "answer_key_row": key_row.get("raw_row"), **({"visual_verification": {"audit": "audits/pilot-crop-audit.json", "crop": public_source_ref(crop_audit[pilot["stable_id"]].get("crop_path"), source_root), "method": crop_audit[pilot["stable_id"]].get("method")} } if visual else {})},
        }
        admitted.append(question)
    admitted.sort(key=lambda q: (q["paper"], q["year"], q["session"], q["question_number"]))
    held.sort(key=lambda x: (x["identity"], x.get("candidate_stable_id") or ""))
    topic_rows = []
    question_counts = collections.Counter(q["primary_leaf_id"] for q in admitted)
    for leaf_id, leaf in sorted(leaves.items()):
        topic_rows.append({"id": leaf_id, "paper": leaf["paper"], "section_number": leaf["section"], "section_title": leaf["section_title"], "title": leaf["title"], "question_count": question_counts[leaf_id]})
    topics_path.parent.mkdir(parents=True, exist_ok=True)
    topics_path.write_text(json.dumps({"schema_version": 1, "exam": "GATE", "topics": topic_rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    out = {
        "schema_version": 1, "exam": "GATE", "papers": list(PAPERS), "release": "verified_pilot_independently_reviewed",
        "source_policy": "Official final answer key + native question text + reviewed two-pass map; visual items require pilot crop audit. Explanations were independently checked against the statement, options, key, and verified crop where present. Unreviewed candidates remain held.",
        "source_root": "external-gate-2027-books", "topic_catalog": str(topics_path), "question_count": len(admitted), "questions": admitted,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    queue = {
        "schema_version": 1, "model": "luna-high", "status": "resumable_pending_review", "scope": "GATE EE/DA 2024-2026 native technical question identities",
        "instructions": "Review source text and official key; assign one exact syllabus leaf or hold. Do not use lexical shortlist as admission. Never fabricate missing text, options, diagrams, or keys.",
        "items": held,
    }
    queue_path.parent.mkdir(parents=True, exist_ok=True)
    queue_path.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    audit = {
        "schema_version": 1, "status": "pass" if len(admitted) == len(reviewed_ids) else "pilot_only",
        "inputs": {"canonical_candidates": len(canonical), "technical_candidates_in_scope": len(technical), "technical_unique_identities": len(selected), "candidate_duplicate_occurrences": len(technical) - len(selected), "official_key_rows_in_scope": sum(len(v) for v in keys.values()), "pilot_reviewed_records": len(accepted)},
        "admission": {"admitted": len(admitted), "held": len(held), "by_paper": {p: {"admitted": sum(q["paper"] == p for q in admitted), "held": sum(h["identity"][1] == p for h in held)} for p in PAPERS}},
        "held_reason_counts": dict(sorted(reasons.items())), "visual_audit_records": len(crop_audit), "deduplication": {"identity": "year,paper,session,technical-section-question-number", "duplicate_occurrences_collapsed": len(technical) - len(selected)},
        "content_integrity": {
            "missing_marks": [q["id"] for q in admitted if q.get("marks") is None],
            "missing_or_invalid_options": [q["id"] for q in admitted if q.get("type") in ("MCQ", "MSQ") and {str(o.get("label", "")).upper() for o in q.get("options", [])} != {"A", "B", "C", "D"}],
            "placeholder_explanations": [q["id"] for q in admitted if any(token in json.dumps(q.get("explanation", {}), ensure_ascii=False).casefold() for token in ("todo", "tbd", "lorem ipsum"))],
            "explanations_present": sum(bool(q.get("explanation")) for q in admitted),
            "explanation_policy": "Each admitted row has a concise derivation independently checked against source and key; held rows receive no fabricated explanation.",
        },
        "source_files": ["corpus/canonical-question-candidates.json", "corpus/official-answer-keys.json", "pilot/accepted-ee.json", "pilot/accepted-da.json", "audits/pilot-crop-audit.json", "syllabus-maps/ee-syllabus-map.json", "syllabus-maps/da-syllabus-map.json"],
        "outputs": {"questions": str(output), "topics": str(topics_path), "durable_visual_asset_root": str(durable_asset_root), "visual_asset_root": str(asset_root)},
    }
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return audit


def self_test() -> None:
    assert parse_key("A", "MCQ")["value"] == "A"
    assert parse_key("A; D", "MSQ")["value"] == ["A", "D"]
    assert parse_key("-19.90 to -19.70", "NAT")["lower"] == -19.9
    assert parse_key("MTA", "NAT")["value"] == "MTA"
    assert parse_key("garbage", "MCQ") is None
    sample = [{"year": 2025, "paper": "EE", "session_or_set": "4", "source_question_number": "35", "requires_extraction_review": True, "canonicalization_score": 200}, {"year": 2025, "paper": "EE", "session_or_set": "4", "source_question_number": "35", "requires_extraction_review": False, "canonicalization_score": 100}]
    selected, groups = best_by_identity(sample)
    assert len(groups) == 1 and selected[next(iter(groups))]["requires_extraction_review"] is False
    print("gate_corpus_import self-test: PASS")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--topics", type=Path, default=DEFAULT_TOPICS)
    parser.add_argument("--asset-root", type=Path, default=DEFAULT_ASSET_ROOT)
    parser.add_argument("--durable-asset-root", type=Path, default=DEFAULT_DURABLE_ASSET_ROOT)
    parser.add_argument("--audit", type=Path, default=DEFAULT_AUDIT)
    parser.add_argument("--queue", type=Path, default=DEFAULT_QUEUE)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    audit = build(args.source_root, args.output, args.audit, args.queue, args.topics, args.asset_root, args.durable_asset_root)
    print(json.dumps(audit["admission"], sort_keys=True))
    print(json.dumps(audit["held_reason_counts"], sort_keys=True))


if __name__ == "__main__":
    main()
