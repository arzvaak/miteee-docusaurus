"""Extract SSC CGL solved-paper HTML into OCR-style review text.

This handles web solved-paper pages separately from PDF OCR. It does not make
ranked questions. The output is only segmentation input for answer, topic,
duplicate, provenance, and agent review gates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "ocr-review"
USER_AGENT = "MITEEE-SSC-CGL-html-extractor/1.0"


@dataclass
class HtmlPageExtraction:
    pageNumber: int
    textPath: str
    charCount: int
    questionSignals: int
    extractionMethod: str


@dataclass
class HtmlExtractionReport:
    sourceId: str
    sourceType: str
    sourceFile: str | None
    sourceUrl: str | None
    sha256: str
    extractedAt: str
    pageCount: int
    extractionStatus: str
    reviewStatus: str
    questionSignals: int
    pages: list[HtmlPageExtraction]
    warnings: list[str]


class MainTextParser(HTMLParser):
    block_tags = {
        "article",
        "blockquote",
        "br",
        "dd",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "li",
        "main",
        "ol",
        "p",
        "section",
        "table",
        "td",
        "th",
        "tr",
        "ul",
    }
    skip_tags = {"aside", "footer", "form", "header", "nav", "noscript", "script", "style", "svg"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in self.skip_tags:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag in self.block_tags:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.skip_tags and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if tag in self.block_tags:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        text = normalize_inline(data)
        if text:
            self.parts.append(text)
            self.parts.append(" ")

    def text(self) -> str:
        return normalize_text("".join(self.parts))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def normalize_inline(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def normalize_text(value: str) -> str:
    value = re.sub(r"[ \t]+", " ", value or "")
    value = re.sub(r"\s*\n\s*", "\n", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def count_question_signals(text: str) -> int:
    patterns = [
        r"\bQ(?:uestion)?\.?\s*\d+",
        r"^\s*\d+\s*[\).]",
        r"\b(?:Answer|Correct\s+Answer)\s*[:\-]",
        r"\([a-dA-D]\)",
    ]
    return sum(len(re.findall(pattern, text, flags=re.IGNORECASE | re.MULTILINE)) for pattern in patterns)


def is_sscportal_model_question_url(source_url: str | None) -> bool:
    if not source_url:
        return False
    return "sscportal.in/cgl/tier-1/model-questions/" in source_url


SSCPORTAL_MODEL_TITLE = re.compile(r"^Model Questions for SSC CGL TIER-1\b", flags=re.IGNORECASE)
SSCPORTAL_FIRST_QUESTION = re.compile(r"^\s*1[\).]\s+")
SSCPORTAL_AD_LINE = re.compile(
    r"^(?:\(E-Book\)|Click Here for Study Material for SSC CGL Exam)",
    flags=re.IGNORECASE,
)
SSCPORTAL_AFTER_ANSWER_STOP = re.compile(
    r"^(?:SSC Combined Graduate Level Exam|Mathematics$|English$|Reasoning$|General Awareness$|Combined Graduate Level Exam|Tier I$|Staff Selection Commission|Daily Questions Challenge|कर्मचारी चयन आयोग|trainee\d*'s blog|SSC CGL EBOOKS|Whats Hot!|Important Links|Downloads|Disclaimer:)",
    flags=re.IGNORECASE,
)


def cleanup_sscportal_model_text(text: str) -> tuple[str, list[str]]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    notes: list[str] = []

    first_question_index = next(
        (index for index, line in enumerate(lines) if SSCPORTAL_FIRST_QUESTION.match(line)),
        None,
    )
    if first_question_index is not None:
        title_indices = [
            index
            for index, line in enumerate(lines[:first_question_index])
            if SSCPORTAL_MODEL_TITLE.match(line)
        ]
        if title_indices:
            start_index = title_indices[-1]
            if start_index > 0:
                notes.append("SSCPortal model-question boilerplate before the article title was removed.")
            lines = lines[start_index:]

    filtered: list[str] = []
    removed_ad_lines = 0
    seen_answer = False
    stopped_after_answer = False
    for line in lines:
        if SSCPORTAL_AD_LINE.match(line):
            removed_ad_lines += 1
            continue
        if seen_answer and SSCPORTAL_AFTER_ANSWER_STOP.match(line):
            stopped_after_answer = True
            break
        filtered.append(line)
        if re.match(r"^Answer\s*:", line, flags=re.IGNORECASE):
            seen_answer = True

    if removed_ad_lines:
        notes.append(f"Removed {removed_ad_lines} SSCPortal in-page ad line(s).")
    if stopped_after_answer:
        notes.append("SSCPortal model-question boilerplate after the answer key was removed.")

    return normalize_text("\n".join(filtered)), notes


def html_to_text(html: str, source_url: str | None = None) -> tuple[str, list[str]]:
    parser = MainTextParser()
    parser.feed(html)
    parser.close()
    text = parser.text()
    text = re.sub(r"(?i)\bCorrect\s+Answer\s*:", "Answer:", text)
    text = normalize_text(text)
    if is_sscportal_model_question_url(source_url):
        return cleanup_sscportal_model_text(text)
    return text, []


def read_source_html(source_file: Path | None, source_url: str | None) -> tuple[str, str | None]:
    if source_file:
        return source_file.read_text(encoding="utf-8", errors="ignore"), str(source_file.resolve())
    if not source_url:
        raise ValueError("either --source-file or --source-url is required")
    try:
        from scrapling.fetchers import Fetcher  # type: ignore
    except Exception as exc:
        raise RuntimeError("scrapling is required for live HTML fetches; install requirements-ssc.txt") from exc

    page = Fetcher.get(source_url, stealthy_headers=True, headers={"User-Agent": USER_AGENT})
    status = int(getattr(page, "status", 0) or 0)
    if status < 200 or status >= 300:
        raise RuntimeError(f"HTML fetch returned {status} for {source_url}")
    body = getattr(page, "body", b"")
    if isinstance(body, bytes):
        return body.decode("utf-8", errors="ignore"), None
    text = getattr(page, "text", None)
    return str(text if text is not None else body), None


def build_report(
    html: str,
    source_file_label: str | None,
    source_id: str,
    source_type: str,
    source_url: str | None,
    output_root: Path,
) -> HtmlExtractionReport:
    source_root = output_root / safe_slug(source_id)
    pages_root = source_root / "pages"
    pages_root.mkdir(parents=True, exist_ok=True)

    text, cleanup_warnings = html_to_text(html, source_url)
    signals = count_question_signals(text)
    text_path = pages_root / "page-001.txt"
    text_path.write_text(text + ("\n" if text else ""), encoding="utf-8")
    extraction_status = "text_extracted" if signals else "no_question_text_found"
    review_status = "needs_segmentation_review" if signals else "needs_html_review"
    warnings = [
        "HTML-extracted text is not a ranked question bank.",
        "Every candidate still needs answer-key, topic, duplicate, provenance, and agent review.",
        *cleanup_warnings,
    ]
    if source_type == "web_pdf_unverified":
        warnings.append("web_pdf_unverified and solved-paper web sources cannot enter ranked tests without rights and provenance review.")
    if not signals:
        warnings.append("No MCQ signals were found; the page may be a navigation shell or login-gated content.")

    return HtmlExtractionReport(
        sourceId=source_id,
        sourceType=source_type,
        sourceFile=source_file_label,
        sourceUrl=source_url,
        sha256=sha256_text(html),
        extractedAt=now_iso(),
        pageCount=1,
        extractionStatus=extraction_status,
        reviewStatus=review_status,
        questionSignals=signals,
        pages=[
            HtmlPageExtraction(
                pageNumber=1,
                textPath=str(text_path.resolve()),
                charCount=len(text),
                questionSignals=signals,
                extractionMethod="html_text",
            )
        ],
        warnings=warnings,
    )


def write_report(report: HtmlExtractionReport, output_root: Path) -> Path:
    source_root = output_root / safe_slug(report.sourceId)
    source_root.mkdir(parents=True, exist_ok=True)
    report_path = source_root / "extraction-report.json"
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report_path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Extract SSC CGL solved-paper HTML for review-only segmentation.")
    parser.add_argument("--source-file", type=Path)
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--source-type", required=True, choices=[
        "official_open",
        "official_login_personal",
        "user_provided",
        "web_pdf_unverified",
        "original_practice",
    ])
    parser.add_argument("--source-url")
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    if args.source_file and not args.source_file.exists():
        parser.error(f"source file not found: {args.source_file}")

    html, source_file_label = read_source_html(args.source_file, args.source_url)
    report = build_report(
        html,
        source_file_label,
        args.source_id,
        args.source_type,
        args.source_url,
        args.output_root,
    )
    report_path = write_report(report, args.output_root)
    print(f"wrote HTML extraction report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
