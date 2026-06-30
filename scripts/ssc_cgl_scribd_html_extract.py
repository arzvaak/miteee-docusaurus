"""Extract Scribd-saved SSC book pages into OCR-style review text.

The saved ``.htm`` file is only a shell. Scribd stores the actual page text and
image references in page-level JSONP assets. This extractor keeps only the
English text layer, preserves diagram references, and writes the same
``extraction-report.json`` shape consumed by the existing SSC segmentation
pipeline.
"""

from __future__ import annotations

import argparse
import base64
import gzip
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_FILE = Path(r"G:\SSC BOOKS\PINNACLE SSC REASONING.htm")
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "book-html"
USER_AGENT = "MITEEE-SSC-CGL-scribd-html-extractor/1.0"
DEVANAGARI = re.compile(r"[\u0900-\u097F]")
PRIVATE_USE = re.compile(r"[\uE000-\uF8FF]")
PAGE_URL = re.compile(r"https?:\\?/\\?/[^\"'<>\\\s]+?/pages/(\d{1,4})-[a-z0-9]+\.jsonp", re.IGNORECASE)
QUESTION_SIGNAL = re.compile(
    r"\b(?:Q\.?\s*\d{1,4}|Sol\.?\s*\d{1,4}|Ans\.?|Answer)\b|[\(\[]?[a-dA-D][\)\].]\s+",
    re.IGNORECASE,
)


@dataclass
class PageImage:
    url: str
    localPath: str | None
    markdown: str


@dataclass
class ScribdPageText:
    text: str
    images: list[dict[str, Any]]
    question_signals: int


@dataclass
class PageExtraction:
    pageNumber: int
    textPath: str
    charCount: int
    questionSignals: int
    extractionMethod: str
    images: list[dict[str, Any]]


@dataclass
class ExtractionReport:
    sourceId: str
    sourceType: str
    sourceFile: str
    sourceUrl: str | None
    chapterSlug: str
    chapterTitle: str
    startPage: int
    endPage: int
    pageCount: int
    extractionStatus: str
    reviewStatus: str
    rankedEligible: bool
    extractedAt: str
    extractionMethod: str
    languagePolicy: str
    skippedPages: list[int]
    pages: list[PageExtraction]
    warnings: list[str]


class ScribdPageParser(HTMLParser):
    skip_tags = {"script", "style", "svg"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.image_urls: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in self.skip_tags:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag in {"div", "p", "br", "span", "li", "tr", "td"}:
            self.parts.append("\n")
        if tag == "img":
            attr_map = {key.lower(): value for key, value in attrs if value}
            url = attr_map.get("orig") or attr_map.get("src") or attr_map.get("data-src")
            if url:
                self.image_urls.append(unescape(url))

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.skip_tags and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if tag in {"div", "p", "span", "li", "tr", "td"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        text = normalize_inline(data)
        if text:
            self.parts.append(text)
            self.parts.append("\n")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_inline(value: str) -> str:
    value = unescape(value or "")
    value = PRIVATE_USE.sub("", value)
    value = value.replace("\u00a0", " ")
    return re.sub(r"\s+", " ", value).strip()


def normalize_text(value: str) -> str:
    value = re.sub(r"[ \t]+", " ", value or "")
    value = re.sub(r"\s*\n\s*", "\n", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90] or "source"


def cache_name(url: str) -> str:
    return base64.urlsafe_b64encode(url.encode("utf-8")).decode("ascii").rstrip("=") + ".jsonp"


def request_bytes(url: str, timeout: int = 45) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def decode_page_bytes(data: bytes) -> str:
    if data.startswith(b"\x1f\x8b"):
        data = gzip.decompress(data)
    return data.decode("utf-8", errors="ignore")


def normalize_page_url(raw_url: str) -> str:
    return raw_url.replace("\\/", "/").replace("\\u0026", "&")


def discover_page_urls(shell_html: str) -> list[tuple[int, str]]:
    found: dict[int, str] = {}
    for match in PAGE_URL.finditer(shell_html):
        page_number = int(match.group(1))
        found.setdefault(page_number, normalize_page_url(match.group(0)))
    return sorted(found.items())


def extract_page_html_from_jsonp(jsonp: str) -> str:
    match = re.search(r"\(\s*(\[.*\])\s*\)\s*;?\s*$", jsonp.strip(), flags=re.DOTALL)
    if not match:
        raise ValueError("Scribd page JSONP payload did not contain a JSON string array")
    payload = json.loads(match.group(1))
    if not isinstance(payload, list):
        raise ValueError("Scribd page JSONP payload was not a list")
    return "".join(str(part) for part in payload)


def is_english_content_line(line: str) -> bool:
    if not line:
        return False
    if DEVANAGARI.search(line):
        return False
    if PRIVATE_USE.search(line):
        return False
    ascii_like = sum(1 for char in line if char.isascii())
    return ascii_like >= max(1, int(len(line) * 0.6))


def count_question_signals(text: str) -> int:
    return len(QUESTION_SIGNAL.findall(text))


def extension_from_url(url: str) -> str:
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        return suffix
    return ".webp"


def maybe_download_image(url: str, page_number: int, image_index: int, image_root: Path | None) -> tuple[str | None, str]:
    if image_root is None:
        return None, url
    image_root.mkdir(parents=True, exist_ok=True)
    image_path = image_root / f"page-{page_number:03d}-image-{image_index}{extension_from_url(url)}"
    if not image_path.exists():
        try:
            image_path.write_bytes(request_bytes(url))
            time.sleep(0.05)
        except Exception:
            return None, url
    return str(image_path.resolve()), f"../assets/images/{image_path.name}"


def chunk_root_for(output_root: Path, source_id: str, start_page: int, end_page: int, flat_output: bool) -> Path:
    chunk_name = f"scribd-html-p{start_page:03d}-p{end_page:03d}"
    if flat_output:
        return output_root / f"{safe_slug(source_id)}-{chunk_name}"
    return output_root / safe_slug(source_id) / chunk_name


def scribd_page_html_to_text(
    page_html: str,
    page_number: int,
    image_root: Path | None,
    source_url: str | None = None,
) -> ScribdPageText:
    parser = ScribdPageParser()
    parser.feed(page_html)
    parser.close()
    lines = [
        normalize_inline(line)
        for line in "".join(parser.parts).splitlines()
    ]
    english_lines = [line for line in lines if is_english_content_line(line)]

    images: list[dict[str, Any]] = []
    image_markdown: list[str] = []
    for index, url in enumerate(dict.fromkeys(parser.image_urls), start=1):
        local_path, markdown_url = maybe_download_image(url, page_number, index, image_root)
        markdown = f"![page-{page_number:03d}-image-{index}]({markdown_url})"
        images.append(asdict(PageImage(url=url, localPath=local_path, markdown=markdown)))
        image_markdown.append(markdown)

    text = normalize_text("\n".join([*english_lines, *image_markdown]))
    return ScribdPageText(
        text=text,
        images=images,
        question_signals=count_question_signals(text),
    )


def read_page_jsonp(page_url: str, cache_root: Path) -> str:
    cache_root.mkdir(parents=True, exist_ok=True)
    cache_path = cache_root / cache_name(page_url)
    if cache_path.exists():
        return decode_page_bytes(cache_path.read_bytes())
    data = request_bytes(page_url)
    cache_path.write_bytes(data)
    time.sleep(0.08)
    return decode_page_bytes(data)


def build_report(
    source_file: Path,
    source_id: str,
    start_page: int,
    end_page: int,
    output_root: Path,
    cache_root: Path,
    flat_output: bool = False,
) -> ExtractionReport:
    shell_html = source_file.read_text(encoding="utf-8", errors="ignore")
    page_urls = {
        page_number: page_url
        for page_number, page_url in discover_page_urls(shell_html)
        if start_page <= page_number <= end_page
    }
    missing = [page_number for page_number in range(start_page, end_page + 1) if page_number not in page_urls]
    if len(missing) == (end_page - start_page + 1):
        raise RuntimeError(f"no Scribd JSONP URLs found for page range {start_page}-{end_page}")

    chunk_root = chunk_root_for(output_root, source_id, start_page, end_page, flat_output)
    pages_root = chunk_root / "pages"
    image_root = chunk_root / "assets" / "images"
    pages_root.mkdir(parents=True, exist_ok=True)

    page_reports: list[PageExtraction] = []
    for page_number in range(start_page, end_page + 1):
        if page_number not in page_urls:
            continue
        page_url = page_urls[page_number]
        jsonp = read_page_jsonp(page_url, cache_root)
        page_html = extract_page_html_from_jsonp(jsonp)
        extracted = scribd_page_html_to_text(page_html, page_number, image_root=image_root, source_url=page_url)
        text_path = pages_root / f"page-{page_number:03d}.txt"
        text_path.write_text(extracted.text + ("\n" if extracted.text else ""), encoding="utf-8")
        page_reports.append(
            PageExtraction(
                pageNumber=page_number,
                textPath=str(text_path.resolve()),
                charCount=len(extracted.text),
                questionSignals=extracted.question_signals,
                extractionMethod="scribd_html_jsonp",
                images=extracted.images,
            )
        )

    question_signal_count = sum(page.questionSignals for page in page_reports)
    extraction_status = "text_extracted" if question_signal_count else "no_question_text_found"
    review_status = "needs_segmentation_review" if question_signal_count else "needs_html_review"
    return ExtractionReport(
        sourceId=source_id,
        sourceType="book_user_provided",
        sourceFile=str(source_file.resolve()),
        sourceUrl=None,
        chapterSlug="scribd-html",
        chapterTitle="Scribd HTML Pages",
        startPage=start_page,
        endPage=end_page,
        pageCount=len(page_reports),
        extractionStatus=extraction_status,
        reviewStatus=review_status,
        rankedEligible=False,
        extractedAt=now_iso(),
        extractionMethod="scribd_html_jsonp",
        languagePolicy="english_only",
        skippedPages=missing,
        pages=page_reports,
        warnings=[
            "Scribd HTML extraction is English-only and drops Devanagari text-layer lines.",
            "Extracted book candidates are review-only until answer alignment, duplicate checks, and agent review finish.",
            "Diagram references are preserved as markdown image links and local image downloads when available.",
            *(["Some shell pages had no Scribd JSONP text asset and were skipped."] if missing else []),
        ],
    )


def write_report(report: ExtractionReport, output_root: Path, flat_output: bool = False) -> Path:
    chunk_root = chunk_root_for(output_root, report.sourceId, report.startPage, report.endPage, flat_output)
    chunk_root.mkdir(parents=True, exist_ok=True)
    report_path = chunk_root / "extraction-report.json"
    report_path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report_path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Extract Scribd HTML book pages into SSC CGL OCR-style text.")
    parser.add_argument("--source-file", type=Path, default=DEFAULT_SOURCE_FILE)
    parser.add_argument("--source-id", default="pinnacle-ssc-reasoning")
    parser.add_argument("--start-page", type=int, default=1)
    parser.add_argument("--end-page", type=int, default=25)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--cache-root", type=Path)
    parser.add_argument("--flat-output", action="store_true", help="write chunk directories directly under --output-root")
    args = parser.parse_args()

    if not args.source_file.exists():
        parser.error(f"source file not found: {args.source_file}")
    if args.end_page < args.start_page:
        parser.error("--end-page must be greater than or equal to --start-page")
    cache_root = args.cache_root or (args.output_root / safe_slug(args.source_id) / "jsonp-cache")
    report = build_report(
        source_file=args.source_file,
        source_id=args.source_id,
        start_page=args.start_page,
        end_page=args.end_page,
        output_root=args.output_root,
        cache_root=cache_root,
        flat_output=args.flat_output,
    )
    report_path = write_report(report, args.output_root, flat_output=args.flat_output)
    print(f"wrote Scribd HTML extraction report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
