"""Build review-only extraction jobs from SSC CGL source candidates.

This is an orchestration layer, not a corpus importer. It turns vetted source
leads into explicit commands for the existing HTML extraction and segmentation
stages while keeping listed-only leads out of automated extraction.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANDIDATES_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "resource-candidates.json"
DEFAULT_OUTPUT_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "source-extraction-queue" / "sscportal-model-practice.json"
DEFAULT_OCR_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review"
DEFAULT_SEGMENTS_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "segments"


@dataclass
class ExtractionQueueItem:
    candidateId: str
    title: str
    url: str
    sourceId: str
    sourceType: str
    tags: list[str]
    status: str
    action: str
    rankedEligible: bool
    outputReportPath: str | None = None
    htmlExtractCommand: list[str] | None = None
    segmentCommand: list[str] | None = None
    warning: str | None = None


@dataclass
class ExtractionQueueReport:
    generatedAt: str
    sourceId: str
    requiredTag: str
    totalCandidates: int
    consideredCandidates: int
    readyForHtmlExtraction: int
    listedWithoutDirectUrl: int
    outputRoot: str
    segmentsRoot: str
    rankedEligible: bool
    reviewPolicy: str
    items: list[ExtractionQueueItem]
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def load_candidates(path: Path) -> list[dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        return [candidate for candidate in payload if isinstance(candidate, dict)]
    if isinstance(payload, dict) and isinstance(payload.get("candidates"), list):
        return [candidate for candidate in payload["candidates"] if isinstance(candidate, dict)]
    raise ValueError(f"unsupported candidates payload: {path}")


def tags_for(candidate: dict) -> list[str]:
    tags = candidate.get("tags")
    if not isinstance(tags, list):
        return []
    return [str(tag) for tag in tags]


def is_listed_without_direct_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.fragment.startswith("listed-set-")


def is_direct_http_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc) and not is_listed_without_direct_url(url)


def build_item(candidate: dict, output_root: Path, segments_root: Path) -> ExtractionQueueItem:
    candidate_id = str(candidate.get("id") or safe_slug(str(candidate.get("title") or "source")))
    title = str(candidate.get("title") or candidate_id)
    url = str(candidate.get("url") or "")
    source_id = str(candidate.get("sourceId") or "unknown-source")
    source_type = str(candidate.get("sourceType") or "web_pdf_unverified")
    tags = tags_for(candidate)

    if is_direct_http_url(url):
        extraction_report_path = output_root / safe_slug(candidate_id) / "extraction-report.json"
        html_command = [
            "python",
            "scripts/ssc_cgl_html_extract.py",
            "--source-url",
            url,
            "--source-id",
            candidate_id,
            "--source-type",
            source_type,
            "--output-root",
            str(output_root),
        ]
        segment_command = [
            "python",
            "scripts/ssc_cgl_segment_questions.py",
            "--extraction-report",
            str(extraction_report_path),
            "--output-root",
            str(segments_root),
        ]
        return ExtractionQueueItem(
            candidateId=candidate_id,
            title=title,
            url=url,
            sourceId=source_id,
            sourceType=source_type,
            tags=tags,
            status="ready_for_html_extraction",
            action="run_html_extract_then_segment_for_agent_review",
            rankedEligible=False,
            outputReportPath=str(extraction_report_path),
            htmlExtractCommand=html_command,
            segmentCommand=segment_command,
        )

    return ExtractionQueueItem(
        candidateId=candidate_id,
        title=title,
        url=url,
        sourceId=source_id,
        sourceType=source_type,
        tags=tags,
        status="listed_without_direct_url",
        action="find_exact_source_url_or_extract_from_parent_page_before_segmentation",
        rankedEligible=False,
        warning="No direct HTML/PDF URL is available for this listed set.",
    )


def build_queue(
    candidates: list[dict],
    source_id: str,
    required_tag: str,
    output_root: Path,
    segments_root: Path,
    limit: int,
) -> ExtractionQueueReport:
    considered = [
        candidate
        for candidate in candidates
        if str(candidate.get("sourceId") or "") == source_id and required_tag in tags_for(candidate)
    ]
    if limit > 0:
        considered = considered[:limit]

    items = [build_item(candidate, output_root, segments_root) for candidate in considered]
    ready = sum(1 for item in items if item.status == "ready_for_html_extraction")
    listed = sum(1 for item in items if item.status == "listed_without_direct_url")
    return ExtractionQueueReport(
        generatedAt=now_iso(),
        sourceId=source_id,
        requiredTag=required_tag,
        totalCandidates=len(candidates),
        consideredCandidates=len(considered),
        readyForHtmlExtraction=ready,
        listedWithoutDirectUrl=listed,
        outputRoot=str(output_root),
        segmentsRoot=str(segments_root),
        rankedEligible=False,
        reviewPolicy="Queue output is extraction-only. Promotion requires answer-key, topic, duplicate, provenance, and agent review gates.",
        items=items,
        warnings=[
            "Do not import queue items directly into ranked tests.",
            "Fragment-only listed sets need an exact page URL before extraction.",
            "Generated commands create review-only text and candidate segments.",
        ],
    )


def write_report(report: ExtractionQueueReport, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(omit_none(asdict(report)), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def omit_none(value):
    if isinstance(value, dict):
        return {key: omit_none(item) for key, item in value.items() if item is not None}
    if isinstance(value, list):
        return [omit_none(item) for item in value]
    return value


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build SSC CGL review-only source extraction queue.")
    parser.add_argument("--candidates-path", type=Path, default=DEFAULT_CANDIDATES_PATH)
    parser.add_argument("--output-path", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OCR_ROOT)
    parser.add_argument("--segments-root", type=Path, default=DEFAULT_SEGMENTS_ROOT)
    parser.add_argument("--source-id", default="sscportal-cgl-model-questions")
    parser.add_argument("--required-tag", default="model-practice-lead")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    if not args.candidates_path.exists():
        parser.error(f"candidate manifest not found: {args.candidates_path}")

    candidates = load_candidates(args.candidates_path)
    report = build_queue(
        candidates,
        args.source_id,
        args.required_tag,
        args.output_root,
        args.segments_root,
        args.limit,
    )
    write_report(report, args.output_path)
    print(
        "wrote "
        f"{report.consideredCandidates} extraction queue items "
        f"({report.readyForHtmlExtraction} direct, {report.listedWithoutDirectUrl} listed-only)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
