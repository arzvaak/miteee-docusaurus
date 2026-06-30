"""Discover SSC CGL paper/book/resource candidates with rights-aware metadata.

The script is intentionally metadata-first. Official/open sources can become
download/import candidates. Scribd and other copyright-risk references are
tracked for user review, but the script must not download or copy their content.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.robotparser
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "resource-candidates.json"
PYQ_BACKLOG_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "pyq-source-backlog.json"
SOURCE_EXPANSION_PLAN_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "pyq-source-expansion-plan.json"
CURATED_IMPORTS_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "curated-imports" / "questions.json"


def book_imports_path() -> Path:
    explicit_path = os.environ.get("SSC_CGL_BOOK_QUESTIONS_PATH", "").strip()
    if explicit_path:
        return Path(explicit_path)
    explicit_root = os.environ.get("SSC_CGL_BOOK_IMPORTS_ROOT", "").strip()
    if explicit_root:
        return Path(explicit_root) / "questions.json"
    artifacts_root = os.environ.get("MITEEE_LOCAL_ARTIFACTS", "").strip()
    candidates: list[Path] = []
    if artifacts_root:
        candidates.append(Path(artifacts_root) / "ssc-cgl-corpus" / "book-imports" / "questions.json")
    candidates.extend([
        Path(ROOT.anchor) / "MITEEE_LOCAL_ARTIFACTS" / "ssc-cgl-corpus" / "book-imports" / "questions.json",
        ROOT / "data" / "exams" / "ssc-cgl" / "book-imports" / "questions.json",
    ])
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[-1]


BOOK_IMPORTS_PATH = book_imports_path()
USER_AGENT = "MITEEE-SSC-CGL-resource-discovery/1.0"
TARGET_END_YEAR = 2026
TARGET_START_YEAR = TARGET_END_YEAR - 49
SSC_API_BASE = "https://ssc.gov.in/api"
SSC_MODEL_QUESTIONS_API = (
    f"{SSC_API_BASE}/general-website/portal/records?"
    "page=1&limit=50&contentType=model-questions&key=createdAt&order=DESC"
    "&isAttachment=true"
    "&attributes=id,headline,examId,examYear,contentType,startDate,endDate,language,createdAt"
    "&language=english"
)
SSC_EXAMS_API = f"{SSC_API_BASE}/admin/5.1/allExams"
SSC_RECORD_ATTRIBUTES = "id,headline,examId,examYear,contentType,startDate,endDate,language,createdAt"
SSC_ANSWER_KEY_API = (
    f"{SSC_API_BASE}/general-website/portal/records?"
    f"page=1&limit=50&contentType=answer-key&key=createdAt&order=DESC&isAttachment=true"
    f"&attributes={SSC_RECORD_ATTRIBUTES}&language=english"
)
SSC_NOTICE_BOARDS_API = (
    f"{SSC_API_BASE}/general-website/portal/records?"
    f"page=1&limit=100&contentType=notice-boards&key=createdAt&order=DESC&isAttachment=true"
    f"&attributes={SSC_RECORD_ATTRIBUTES}&language=english"
)
ARCHIVE_ADVANCEDSEARCH_API = (
    "https://archive.org/advancedsearch.php?"
    "q=%28title%3A%22SSC%20CGL%22%20OR%20description%3A%22SSC%20CGL%22%20OR%20subject%3A%22SSC%20CGL%22%29"
    "&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=description&fl%5B%5D=year&fl%5B%5D=date&fl%5B%5D=mediatype"
    "&rows=50&page=1&output=json"
)
DEFAULT_SEARXNG_ENDPOINT = "http://127.0.0.1:8888"
DEFAULT_FIRECRAWL_ENDPOINT = "http://127.0.0.1:3002"
SEARXNG_QUERIES = (
    "SSC CGL previous year question paper PDF Tier 1",
    "SSC CGL 2025 Tier 1 question paper PDF shift",
    "SSC CGL 2024 Tier 1 question paper answer key PDF",
    "SSC CGL previous papers with solutions PDF 2010 2025",
)
YEAR_SCOPED_SEARXNG_QUERIES = (
    "SSC CGL {start}-{end} previous year question paper PDF",
    "SSC CGL Tier-I {start}-{end} PYQ question paper PDF",
    "SSC CGL {year} previous year question paper download PDF",
)
SEARXNG_YEAR_WINDOW_SIZE = 5


def build_searxng_queries() -> tuple[str, ...]:
    queries: list[str] = list(SEARXNG_QUERIES)
    for start in range(TARGET_START_YEAR, TARGET_END_YEAR + 1, SEARXNG_YEAR_WINDOW_SIZE):
        end = min(start + SEARXNG_YEAR_WINDOW_SIZE - 1, TARGET_END_YEAR)
        for template in YEAR_SCOPED_SEARXNG_QUERIES:
            if "{year}" in template:
                center_year = start + (end - start) // 2
                queries.append(template.format(year=center_year, start=start, end=end))
            else:
                queries.append(template.format(year=start, start=start, end=end))
    deduped_queries = []
    seen: set[str] = set()
    for query in queries:
        if query not in seen:
            seen.add(query)
            deduped_queries.append(query)
    return tuple(deduped_queries)


@dataclass(frozen=True)
class DiscoverySource:
    id: str
    title: str
    url: str
    source_type: str
    acquisition_policy: str
    publish_policy: str
    tags: tuple[str, ...]
    delay_seconds: float = 1.0


@dataclass
class ResourceCandidate:
    id: str
    title: str
    url: str
    sourceId: str
    sourceType: str
    acquisitionPolicy: str
    publishPolicy: str
    reviewStatus: str
    tags: list[str]
    discoveredAt: str
    snippet: str = ""


@dataclass
class PyqBacklogYear:
    year: int
    examCycle: str
    tier: str
    status: str
    rankedEligible: bool
    officialCandidateIds: list[str]
    officialPaperCandidateIds: list[str]
    officialAnswerKeyNoticeIds: list[str]
    officialNoticeIds: list[str]
    webCandidateIds: list[str]
    rankedEligibleQuestionCount: int
    rankedEligibleSourceIds: list[str]
    metadataReferenceIds: list[str]
    nextAction: str


SOURCES = [
    DiscoverySource(
        "ssc-official-previous-year-papers",
        "SSC previous year question paper page",
        "https://ssc.gov.in/for-candidates/previous-year-question-paper",
        "official_open",
        "download metadata and public files only when SSC exposes them without login",
        "official public files can enter import review with provenance",
        ("official", "pyq", "paper"),
    ),
    DiscoverySource(
        "ssc-official-answer-keys",
        "SSC answer key page",
        "https://ssc.gov.in/home/answer-key",
        "official_login_personal",
        "metadata only; candidate response sheets require personal login and stay private",
        "do not publish personal response sheets or login-gated answers",
        ("official", "answer-key"),
    ),
    DiscoverySource(
        "scribd-ssc-cgl-reference",
        "Scribd SSC CGL search",
        "https://www.scribd.com/search?query=SSC%20CGL",
        "copyright_risk_reference",
        "metadata and link only; do not download documents from Scribd",
        "do not copy paid, login-gated, or copyright-risk document text",
        ("scribd", "book", "reference"),
        3.0,
    ),
    DiscoverySource(
        "internet-archive-ssc-cgl-reference",
        "Internet Archive SSC CGL search",
        "https://archive.org/search?query=SSC%20CGL",
        "web_pdf_unverified",
        "metadata first; download only public files after license and provenance review",
        "do not copy unreviewed scans into ranked practice",
        ("archive", "pdf", "book", "paper"),
        2.0,
    ),
    DiscoverySource(
        "web-pdf-search-reference",
        "Web PDF discovery query",
        "https://www.google.com/search?q=SSC+CGL+previous+year+question+paper+PDF",
        "web_pdf_unverified",
        "link metadata only from search result pages; import files only after rights review",
        "do not copy coaching-bank or book text without review",
        ("web-pdf", "review"),
        2.0,
    ),
    DiscoverySource(
        "sscportal-cgl-model-questions",
        "SSC Portal CGL Tier-1 model questions",
        "https://sscportal.in/cgl/tier-1/model-questions",
        "original_practice",
        "scrape public link metadata only; copy no page text until rights and attribution review",
        "model-question links can seed original practice review, not ranked PYQ tests",
        ("sscportal", "model-question", "practice", "tier-1"),
        2.0,
    ),
    DiscoverySource(
        "drishti-ssc-cgl-pyq-pdf",
        "Drishti SSC CGL PYQ PDF page",
        "https://www.sscdrishti.com/pyq-pdf/cgl",
        "web_pdf_unverified",
        "collect public PDF link metadata; download only after rights, provenance, OCR, and answer-key review",
        "do not copy unreviewed PDFs into ranked practice; keep every Drishti lead unverified until review",
        ("drishti", "pyq", "pdf", "review"),
        2.0,
    ),
    DiscoverySource(
        "aptidude-practice",
        "AptiDude aptitude practice topics",
        "https://aptidude.in/practice",
        "original_practice",
        "scrape topic link metadata only; use as practice coverage leads after review",
        "practice links can seed topic drills, not SSC PYQ claims",
        ("aptidude", "practice", "topic-drill"),
        2.0,
    ),
    DiscoverySource(
        "oliveboard-ssc-cgl-tier-1-pyps",
        "Oliveboard SSC CGL Tier-1 PYP PDFs",
        "https://www.oliveboard.in/blog/ssc-cgl-tier-1-pyps/",
        "web_pdf_unverified",
        "collect public link/PDF metadata only; download into quarantine only after rights and provenance review",
        "do not copy coaching-bank PDF text into ranked practice; use as source leads until agent-reviewed and provenance-cleared",
        ("oliveboard", "pyq", "pdf", "tier-1", "review"),
        2.0,
    ),
    DiscoverySource(
        "cracku-ssc-cgl-previous-papers",
        "Cracku SSC CGL previous papers",
        "https://cracku.in/ssc-cgl-previous-papers",
        "web_pdf_unverified",
        "collect public previous-paper link metadata only; import files only after rights, answer-key, and provenance review",
        "do not copy solved-paper text into ranked practice from this source without a curated promotion record",
        ("cracku", "pyq", "previous-paper", "review"),
        2.0,
    ),
    DiscoverySource(
        "adda247-ssc-cgl-previous-year-paper",
        "Adda247 SSC CGL previous year question paper",
        "https://www.adda247.com/jobs/ssc-cgl-previous-year-question-paper/",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine direct PDFs only after rights review",
        "do not copy coaching-bank PDF text into public content; use only as provenance-visible review leads",
        ("adda247", "pyq", "pdf", "review"),
        2.0,
    ),
    DiscoverySource(
        "careerpower-ssc-cgl-previous-year-paper",
        "CareerPower SSC CGL previous year question paper",
        "https://www.careerpower.in/ssc-cgl-previous-year-question-paper.html",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine direct PDFs only after rights review",
        "do not copy coaching-bank PDF text into public content; use only as provenance-visible review leads",
        ("careerpower", "pyq", "pdf", "review"),
        2.0,
    ),
    DiscoverySource(
        "testbook-ssc-cgl-previous-year-papers",
        "Testbook SSC CGL previous year papers",
        "https://testbook.com/ssc-cgl-exam/previous-year-papers",
        "web_pdf_unverified",
        "collect public previous-paper link metadata only; keep login-gated material metadata-only",
        "do not copy Testbook question text into ranked practice without rights-cleared import and agent review",
        ("testbook", "pyq", "previous-paper", "review"),
        2.0,
    ),
    DiscoverySource(
        "pw-ssc-cgl-previous-year-papers",
        "PhysicsWallah SSC CGL previous year papers",
        "https://store.pw.live/blogs/ssc-exams/ssc-cgl-previous-year-question-papers-pdfs",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine files only after rights review",
        "do not copy PW article or PDF text into public content; use as source leads until curated",
        ("physicswallah", "pw", "pyq", "pdf", "review"),
        2.0,
    ),
]


OFFLINE_CANDIDATES = [
    ResourceCandidate(
        "official-ssc-previous-year-question-paper-page",
        "SSC previous year question paper page",
        "https://ssc.gov.in/for-candidates/previous-year-question-paper",
        "ssc-official-previous-year-papers",
        "official_open",
        "download metadata and public files only when SSC exposes them without login",
        "official public files can enter import review with provenance",
        "needs_review",
        ["official", "pyq", "paper"],
        "",
        "Official source for open previous-year paper discovery.",
    ),
    ResourceCandidate(
        "official-ssc-answer-key-page",
        "SSC answer key page",
        "https://ssc.gov.in/home/answer-key",
        "ssc-official-answer-keys",
        "official_login_personal",
        "metadata only; candidate response sheets require personal login and stay private",
        "do not publish personal response sheets or login-gated answers",
        "metadata_only",
        ["official", "answer-key"],
        "",
        "Official answer-key discovery surface; login-gated candidate sheets stay private.",
    ),
    ResourceCandidate(
        "scribd-ssc-cgl-reference-search",
        "Scribd SSC CGL reference search",
        "https://www.scribd.com/search?query=SSC%20CGL",
        "scribd-ssc-cgl-reference",
        "copyright_risk_reference",
        "metadata and link only; do not download documents from Scribd",
        "do not copy paid, login-gated, or copyright-risk document text",
        "metadata_only",
        ["scribd", "book", "reference"],
        "",
        "Reference class requested by user; metadata only unless rights are supplied.",
    ),
    ResourceCandidate(
        "archive-ssc-cgl-reference-search",
        "Internet Archive SSC CGL reference search",
        "https://archive.org/search?query=SSC%20CGL",
        "internet-archive-ssc-cgl-reference",
        "web_pdf_unverified",
        "metadata first; download only public files after license and provenance review",
        "do not copy unreviewed scans into ranked practice",
        "needs_review",
        ["archive", "pdf", "book", "paper"],
        "",
        "Public archive candidates still require license, OCR, and answer-key review.",
    ),
    ResourceCandidate(
        "web-pdf-ssc-cgl-pyq-query",
        "Web PDF candidates for SSC CGL PYQ",
        "https://www.google.com/search?q=SSC+CGL+previous+year+question+paper+PDF",
        "web-pdf-search-reference",
        "web_pdf_unverified",
        "link metadata only from search result pages; import files only after rights review",
        "do not copy coaching-bank or book text without review",
        "needs_review",
        ["web-pdf", "review", "pyq"],
        "",
        "Search query seed for finding normal PDFs without treating them as reviewed.",
    ),
    ResourceCandidate(
        "official-ssc-2026-cgl-notice",
        "SSC CGL 2026 notice",
        "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
        "ssc-official-notices",
        "official_notice_metadata",
        "metadata/provenance only; do not treat the notice as a PYQ paper source",
        "official notices can support syllabus and provenance, but cannot enter ranked practice as question papers",
        "metadata_only",
        ["official", "notice", "syllabus", "not-question-paper"],
        "",
        "Official baseline for pattern, syllabus, marks, and timers.",
    ),
    ResourceCandidate(
        "sscportal-cgl-model-questions-page",
        "SSC Portal CGL Tier-1 model questions",
        "https://sscportal.in/cgl/tier-1/model-questions",
        "sscportal-cgl-model-questions",
        "original_practice",
        "scrape public link metadata only; copy no page text until rights and attribution review",
        "model-question links can seed original practice review, not ranked PYQ tests",
        "needs_review",
        ["sscportal", "model-question", "practice", "tier-1"],
        "",
        "User-supplied model-question source; scrape only public link metadata before review.",
    ),
    ResourceCandidate(
        "drishti-ssc-cgl-pyq-pdf-page",
        "Drishti SSC CGL PYQ PDF page",
        "https://www.sscdrishti.com/pyq-pdf/cgl",
        "drishti-ssc-cgl-pyq-pdf",
        "web_pdf_unverified",
        "collect public PDF link metadata; download only after rights, provenance, OCR, and answer-key review",
        "do not copy unreviewed PDFs into ranked practice; keep every Drishti lead unverified until review",
        "needs_review",
        ["drishti", "pyq", "pdf", "review"],
        "",
        "User-supplied PYQ PDF page; candidate links stay unverified until review.",
    ),
    ResourceCandidate(
        "aptidude-practice-page",
        "AptiDude aptitude practice topics",
        "https://aptidude.in/practice",
        "aptidude-practice",
        "original_practice",
        "scrape topic link metadata only; use as practice coverage leads after review",
        "practice links can seed topic drills, not SSC PYQ claims",
        "needs_review",
        ["aptidude", "practice", "topic-drill"],
        "",
        "User-supplied aptitude practice source; topic links are practice leads, not PYQs.",
    ),
    ResourceCandidate(
        "oliveboard-ssc-cgl-tier-1-pyps-page",
        "Oliveboard SSC CGL Tier-1 PYP PDFs",
        "https://www.oliveboard.in/blog/ssc-cgl-tier-1-pyps/",
        "oliveboard-ssc-cgl-tier-1-pyps",
        "web_pdf_unverified",
        "collect public link/PDF metadata only; download into quarantine only after rights and provenance review",
        "do not copy coaching-bank PDF text into ranked practice; use as source leads until agent-reviewed and provenance-cleared",
        "needs_review",
        ["oliveboard", "pyq", "pdf", "tier-1", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "cracku-ssc-cgl-previous-papers-page",
        "Cracku SSC CGL previous papers",
        "https://cracku.in/ssc-cgl-previous-papers",
        "cracku-ssc-cgl-previous-papers",
        "web_pdf_unverified",
        "collect public previous-paper link metadata only; import files only after rights, answer-key, and provenance review",
        "do not copy solved-paper text into ranked practice from this source without a curated promotion record",
        "needs_review",
        ["cracku", "pyq", "previous-paper", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "adda247-ssc-cgl-previous-year-paper-page",
        "Adda247 SSC CGL previous year question paper",
        "https://www.adda247.com/jobs/ssc-cgl-previous-year-question-paper/",
        "adda247-ssc-cgl-previous-year-paper",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine direct PDFs only after rights review",
        "do not copy coaching-bank PDF text into public content; use only as provenance-visible review leads",
        "needs_review",
        ["adda247", "pyq", "pdf", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "careerpower-ssc-cgl-previous-year-paper-page",
        "CareerPower SSC CGL previous year question paper",
        "https://www.careerpower.in/ssc-cgl-previous-year-question-paper.html",
        "careerpower-ssc-cgl-previous-year-paper",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine direct PDFs only after rights review",
        "do not copy coaching-bank PDF text into public content; use only as provenance-visible review leads",
        "needs_review",
        ["careerpower", "pyq", "pdf", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "testbook-ssc-cgl-previous-year-papers-page",
        "Testbook SSC CGL previous year papers",
        "https://testbook.com/ssc-cgl-exam/previous-year-papers",
        "testbook-ssc-cgl-previous-year-papers",
        "web_pdf_unverified",
        "collect public previous-paper link metadata only; keep login-gated material metadata-only",
        "do not copy Testbook question text into ranked practice without rights-cleared import and agent review",
        "needs_review",
        ["testbook", "pyq", "previous-paper", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "pw-ssc-cgl-previous-year-papers-page",
        "PhysicsWallah SSC CGL previous year papers",
        "https://store.pw.live/blogs/ssc-exams/ssc-cgl-previous-year-question-papers-pdfs",
        "pw-ssc-cgl-previous-year-papers",
        "web_pdf_unverified",
        "collect public previous-year paper link metadata only; quarantine files only after rights review",
        "do not copy PW article or PDF text into public content; use as source leads until curated",
        "needs_review",
        ["physicswallah", "pw", "pyq", "pdf", "review"],
        "",
        "Search-discovered PYQ collection; metadata-only until legal/provenance review.",
    ),
    ResourceCandidate(
        "pinnacle-ssc-cgl-book-reference",
        "Pinnacle SSC CGL books and TCS MCQ references",
        "https://books.ssccglpinnacle.com/",
        "book-reference-lanes",
        "copyright_risk_reference",
        "metadata and purchased/user-provided page references only; do not OCR or copy copyrighted books without rights clearance",
        "do not copy book text; use for topic taxonomy and difficulty calibration only, then generate original reviewed practice",
        "metadata_only",
        ["pinnacle", "book", "reference", "taxonomy"],
        "",
        "Book/reference lane for SSC-like topic coverage and TCS-style MCQ taxonomy.",
    ),
    ResourceCandidate(
        "kiran-ssc-cgl-book-reference",
        "Kiran SSC CGL solved papers, eBooks, and practice tests",
        "https://www.kiranprepare.com/CGL/books/sp/kiranprepare/91263/3",
        "book-reference-lanes",
        "copyright_risk_reference",
        "metadata and purchased/user-provided page references only; do not copy paid eBook or book text",
        "do not copy paid eBook or book text; use for coverage planning and source bibliography only, then generate original agent-reviewed items",
        "metadata_only",
        ["kiran", "book", "reference", "solved-paper", "mock-test"],
        "",
        "Book/reference lane for solved-paper coverage and mock-test taxonomy.",
    ),
    ResourceCandidate(
        "disha-ssc-cgl-free-sample-reference",
        "Disha SSC CGL free downloads and book samples",
        "https://freedownloads.dishapublication.com/category/ssc/ssc-cgl/",
        "book-reference-lanes",
        "original_practice",
        "collect public free-sample metadata and permitted sample files only; full books remain copyright-risk references",
        "public samples can inspire original drills after review, but copied sample text does not enter ranked practice",
        "needs_review",
        ["disha", "free-sample", "practice-set", "book-reference"],
        "",
        "Public sample lane for model practice and topic coverage discovery.",
    ),
    ResourceCandidate(
        "arihant-ssc-cgl-pyq-practice-reference",
        "Arihant SSC CGL previous papers and practice references",
        "https://examwitharihant.com/exam/ssc-cgl-t-1-t-2-online-exam/pyqs/",
        "book-reference-lanes",
        "web_pdf_unverified",
        "collect public metadata and links only; login-gated or copyrighted content stays out of import",
        "use as source leads and taxonomy only until rights/provenance gates clear",
        "needs_review",
        ["arihant", "pyq", "practice", "book-reference"],
        "",
        "Reference lane for model papers and previous-paper lead discovery.",
    ),
    ResourceCandidate(
        "rakesh-yadav-ssc-maths-reference",
        "Rakesh Yadav SSC maths question-bank reference",
        "https://www.amazon.in/SSC-Exam-rakesh-yadav-Government-Exams/s?rh=n%3A4149789031%2Cp_lbr_books_authors_browse-bin%3Arakesh%2Byadav",
        "book-reference-lanes",
        "copyright_risk_reference",
        "metadata and purchased/user-provided page references only; do not copy copyrighted question-bank text",
        "do not copy copyrighted question-bank text; use for quant coverage planning only, then generate original reviewed quant practice",
        "metadata_only",
        ["rakesh-yadav", "quant", "book", "reference"],
        "",
        "Book/reference lane for Quant coverage and difficulty calibration.",
    ),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean_text(value: str) -> str:
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value or "")).strip())


def selector_texts(selector) -> list[str]:
    if hasattr(selector, "getall"):
        return selector.getall()
    if hasattr(selector, "get_all"):
        return selector.get_all()
    return []


def stable_id(source_id: str, url: str, title: str) -> str:
    digest = hashlib.sha1(f"{source_id}|{url}|{title}".encode("utf-8")).hexdigest()[:12]
    normalized = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:54] or "resource"
    return f"{source_id}-{normalized}-{digest}"


def filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    return urllib.parse.unquote(path.rsplit("/", 1)[-1])


def readable_title_from_filename(file_name: str) -> str:
    stem = re.sub(r"\.pdf$", "", file_name, flags=re.IGNORECASE)
    stem = re.sub(r"^\d+_", "", stem)
    return clean_text(stem.replace("-", " ").replace("_", " "))


def drishti_pdf_metadata(url: str, title: str) -> tuple[str, list[str], str]:
    file_name = filename_from_url(url)
    derived_title = readable_title_from_filename(file_name)
    final_title = derived_title if title.lower() in {"download pdf", "pdf", "download"} and derived_title else title
    search_text = f"{final_title} {file_name}"
    tags: list[str] = []
    year_match = re.search(r"\b(20[0-2]\d|19[7-9]\d)\b", search_text)
    if year_match:
        tags.append(year_match.group(1))
    shift_match = re.search(r"\bshift[-\s]*(\d+)\b", search_text, re.IGNORECASE)
    if shift_match:
        tags.append(f"shift-{shift_match.group(1)}")
    date_match = re.search(
        r"\b(\d{1,2})[-\s]+(january|february|march|april|may|june|july|august|september|october|november|december)[-\s]+(20[0-2]\d|19[7-9]\d)\b",
        search_text,
        re.IGNORECASE,
    )
    if date_match:
        tags.append("-".join(part.lower() for part in date_match.groups()))
    snippet = f"filename-derived metadata from {file_name}" if final_title != title else ""
    return final_title, tags, snippet


SSCPORTAL_MODEL_SET_RE = re.compile(
    r"Model\s+Questions\s+for\s+SSC\s+CGL\s+TIER-?1\s*\(([^)]+)\)\s*Set\s*-\s*(\d+)",
    re.IGNORECASE,
)


def sscportal_set_tags(title: str) -> list[str]:
    match = SSCPORTAL_MODEL_SET_RE.search(title)
    if not match:
        return []
    subject = re.sub(r"[^a-z0-9]+", "-", match.group(1).lower()).strip("-")
    set_number = match.group(2)
    return [f"set-{set_number}", subject, "model-practice-lead"]


def robots_allows(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    robots_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, "/robots.txt", "", "", ""))
    try:
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(robots_url)
        parser.read()
        return parser.can_fetch(USER_AGENT, url)
    except Exception as exc:
        print(f"warning: robots check skipped for {url}: {exc}", file=sys.stderr)
        return False


def source_specific_link_allowed(source: DiscoverySource, url: str, title: str) -> bool:
    lowered = f"{url} {title}".lower()
    if source.id == "sscportal-cgl-model-questions":
        path = urllib.parse.urlparse(url).path.lower()
        return bool(SSCPORTAL_MODEL_SET_RE.search(title)) or (
            "/cgl/tier-1/model-questions/" in path
            and re.search(r"(reasoning|maths|english|general-knowledge)-set-\d+", path) is not None
        )
    if source.id == "drishti-ssc-cgl-pyq-pdf":
        return (
            "download pdf" in lowered
            and "cgl" in lowered
            and ("question-paper" in lowered or "question paper" in lowered)
        )
    if source.id == "aptidude-practice":
        return "/practice/" in urllib.parse.urlparse(url).path and "aptitude questions" in lowered
    if source.id in {
        "oliveboard-ssc-cgl-tier-1-pyps",
        "cracku-ssc-cgl-previous-papers",
        "adda247-ssc-cgl-previous-year-paper",
        "careerpower-ssc-cgl-previous-year-paper",
        "testbook-ssc-cgl-previous-year-papers",
        "pw-ssc-cgl-previous-year-papers",
    }:
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.lower()
        paper_signal = any(signal in lowered for signal in (
            "ssc cgl",
            "cgl tier",
            "combined graduate",
        ))
        pyq_signal = any(signal in lowered for signal in (
            "previous year",
            "previous-year",
            "previous papers",
            "question paper",
            "download",
            "pdf",
            "pyp",
            "pyq",
            "tier 1",
            "tier-i",
        ))
        blocked_signal = any(signal in lowered for signal in (
            "eligibility",
            "syllabus",
            "salary",
            "admit card",
            "cut off",
            "cut-off",
            "notification",
            "apply online",
        ))
        return not blocked_signal and (
            path.endswith(".pdf")
            or (paper_signal and pyq_signal)
            or ("ssc-cgl" in path and any(token in path for token in ("paper", "papers", "pdf", "previous", "pyp", "pyq")))
        )
    if source.id == "searxng-ssc-cgl-pyq-search":
        parsed = urllib.parse.urlparse(url)
        host = parsed.netloc.lower()
        path = parsed.path.lower()
        if any(blocked in host for blocked in ("reddit.", "quora.", "youtube.", "facebook.", "instagram.", "x.com", "twitter.")):
            return False
        blocked_signal = any(signal in lowered for signal in (
            "how to study",
            "first time appearing",
            "eligibility",
            "syllabus",
            "salary",
            "admit card",
            "cut off",
            "cut-off",
            "vacancy",
            "apply online",
            "notification",
        ))
        paper_signal = any(signal in lowered for signal in (
            "ssc cgl",
            "cgl tier",
            "combined graduate",
        ))
        pyq_signal = any(signal in lowered for signal in (
            "question paper",
            "previous year",
            "previous-year",
            "previous papers",
            "answer key",
            "response sheet",
            "pdf",
            "pyp",
            "pyq",
            "shift",
        ))
        return not blocked_signal and (
            path.endswith(".pdf")
            or (paper_signal and pyq_signal)
            or ("ssc-cgl" in path and any(token in path for token in ("paper", "papers", "pdf", "previous", "pyp", "pyq", "answer-key")))
        )
    return True


def source_from_search_result() -> DiscoverySource:
    return DiscoverySource(
        "searxng-ssc-cgl-pyq-search",
        "SearXNG SSC CGL PYQ search",
        "http://127.0.0.1:8888/search?q=SSC+CGL+previous+year+question+paper+PDF",
        "web_pdf_unverified",
        "local SearXNG metadata only; fetch or download files only after rights and provenance review",
        "search leads are not ranked practice and must remain provenance-visible review candidates",
        ("searxng", "search", "pyq", "review"),
    )


def source_from_firecrawl(url: str) -> DiscoverySource:
    return DiscoverySource(
        "firecrawl-ssc-cgl-source-probe",
        "Firecrawl SSC CGL source probe",
        url,
        "web_pdf_unverified",
        "local Firecrawl metadata and short markdown excerpt only; no full article body is rendered",
        "Firecrawl output can guide source triage but cannot be copied into ranked practice or public notes as source text",
        ("firecrawl", "source-probe", "review"),
    )


def candidate_from_link(source: DiscoverySource, href: str, title: str, snippet: str = "") -> ResourceCandidate | None:
    url = urllib.parse.urljoin(source.url, href)
    if not url.startswith(("http://", "https://")):
        return None
    text = clean_text(title) or url
    if not source_specific_link_allowed(source, url, text):
        return None
    extra_tags: list[str] = []
    derived_snippet = ""
    if source.id == "drishti-ssc-cgl-pyq-pdf":
        text, extra_tags, derived_snippet = drishti_pdf_metadata(url, text)
    if source.id == "sscportal-cgl-model-questions":
        extra_tags.extend(sscportal_set_tags(text))
    lowered = f"{url} {text}".lower()
    if not any(token in lowered for token in ("ssc", "cgl", "combined graduate", "tier", "paper", "question", "pdf", "book")):
        return None

    source_type = source.source_type
    if url.lower().endswith(".pdf") and source_type not in {"official_open", "copyright_risk_reference"}:
        source_type = "web_pdf_unverified"

    return ResourceCandidate(
        id=stable_id(source.id, url, text),
        title=text[:180],
        url=url,
        sourceId=source.id,
        sourceType=source_type,
        acquisitionPolicy=source.acquisition_policy,
        publishPolicy=source.publish_policy,
        reviewStatus="metadata_only" if source_type == "copyright_risk_reference" else "needs_review",
        tags=list(dict.fromkeys([*source.tags, *extra_tags])),
        discoveredAt=now_iso(),
        snippet=clean_text(snippet or derived_snippet)[:240],
    )


def html_anchor_links(html_text: str) -> list[tuple[str, str]]:
    links: list[tuple[str, str]] = []
    for match in re.finditer(r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", html_text, flags=re.IGNORECASE | re.DOTALL):
        links.append((html.unescape(match.group(1)), clean_text(match.group(2))))
    return links


def sscportal_model_question_candidates_from_html(
    html_text: str,
    source: DiscoverySource,
    limit: int = 64,
) -> list[ResourceCandidate]:
    candidates: list[ResourceCandidate] = []
    seen_titles: set[str] = set()

    for href, title in html_anchor_links(html_text):
        candidate = candidate_from_link(source, href, title)
        if not candidate:
            continue
        seen_titles.add(candidate.title.lower())
        candidates.append(candidate)
        if len(candidates) >= limit:
            return candidates

    for match in SSCPORTAL_MODEL_SET_RE.finditer(clean_text(html_text)):
        title = clean_text(match.group(0))
        if title.lower() in seen_titles:
            continue
        href = f"{source.url}#listed-set-{match.group(2)}"
        candidate = candidate_from_link(
            source,
            href,
            title,
            "SSCPortal model-question set listed without a direct link; use the page-level source before extraction review.",
        )
        if not candidate:
            continue
        seen_titles.add(candidate.title.lower())
        candidates.append(candidate)
        if len(candidates) >= limit:
            break

    return candidates


def candidate_from_external_result(
    source: DiscoverySource,
    url: str,
    title: str,
    snippet: str,
    tags: list[str] | None = None,
) -> ResourceCandidate | None:
    candidate = candidate_from_link(source, url, title, snippet)
    if not candidate:
        return None
    candidate.tags = list(dict.fromkeys([*candidate.tags, *(tags or [])]))
    return candidate


def http_json(url: str, *, timeout: int = 30) -> object | None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        print(f"warning: JSON fetch skipped {url}: {exc}", file=sys.stderr)
        return None


def http_json_post(url: str, payload: dict, *, timeout: int = 60) -> object | None:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        print(f"warning: JSON post skipped {url}: {exc}", file=sys.stderr)
        return None


def json_records(payload: object) -> list[dict]:
    if isinstance(payload, dict):
        data = payload.get("data", [])
        return [item for item in data if isinstance(item, dict)]
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    return []


def exam_lookup(exams_payload: object) -> dict[str, dict]:
    return {
        str(item.get("id")): item
        for item in json_records(exams_payload)
        if item.get("id")
    }


def is_cgl_exam(exam: dict | None) -> bool:
    if not exam:
        return False
    text = " ".join(str(exam.get(key, "")) for key in ("examCode", "examName", "description", "hExamName"))
    lowered = text.lower()
    return "cgl" in lowered or "combined graduate level" in lowered


def is_cgl_record(record: dict, exams: dict[str, dict]) -> bool:
    if is_cgl_exam(exams.get(str(record.get("examId")))):
        return True
    headline = str(record.get("headline") or "").lower()
    return "cgl" in headline or "combined graduate level" in headline


def attachment_url(path_value: str) -> str:
    normalized = path_value.replace("\\", "/").lstrip("/")
    if normalized.startswith("api/attachment/"):
        return f"https://ssc.gov.in/{normalized}"
    if normalized.startswith("attachment/"):
        return f"{SSC_API_BASE}/{normalized}"
    return f"{SSC_API_BASE}/attachment/{normalized}"


def is_pdf_attachment(attachment: dict) -> bool:
    file_name = str(attachment.get("fileName") or "")
    path_value = str(attachment.get("path") or "")
    media_type = str(attachment.get("type") or "")
    return bool(path_value) and (file_name.lower().endswith(".pdf") or media_type == "application/pdf")


def matches_official_candidate_class(record: dict, candidate_class: str) -> bool:
    if candidate_class != "official_answer_key_notice":
        return True
    text = clean_text(str(record.get("headline") or "")).lower()
    return any(signal in text for signal in ("answer key", "answer-key", "response sheet", "marks of candidates"))


def candidates_from_official_attachment_records(
    records_payload: object,
    exams_payload: object,
    source_id: str,
    candidate_class: str,
    discovered_at: str | None = None,
) -> list[ResourceCandidate]:
    discovered_at = discovered_at or now_iso()
    records = json_records(records_payload)
    exams = exam_lookup(exams_payload)
    candidates: list[ResourceCandidate] = []

    for record in records:
        if not is_cgl_record(record, exams):
            continue
        if not matches_official_candidate_class(record, candidate_class):
            continue
        exam = exams.get(str(record.get("examId"))) or {}
        attachments = record.get("attachments") if isinstance(record.get("attachments"), list) else []
        for attachment in attachments:
            if not isinstance(attachment, dict) or not is_pdf_attachment(attachment):
                continue

            path_value = str(attachment.get("path") or "")
            file_name = str(attachment.get("fileName") or path_value.rsplit("/", 1)[-1] or "attachment.pdf")
            year = str(record.get("examYear") or "").strip()
            headline = clean_text(str(record.get("headline") or "SSC CGL official attachment"))
            exam_name = clean_text(str(exam.get("examName") or exam.get("examCode") or "SSC CGL"))
            url = attachment_url(path_value)
            tags = [
                "official",
                "official-api",
                "cgl",
                "not-question-paper",
                candidate_class.replace("_", "-"),
            ]
            if year:
                tags.append(year)

            candidates.append(ResourceCandidate(
                id=stable_id(source_id, url, f"{headline} {file_name}"),
                title=" · ".join(part for part in (exam_name, year, headline, file_name) if part)[:180],
                url=url,
                sourceId=source_id,
                sourceType="official_notice_metadata",
                acquisitionPolicy=(
                    "download public SSC CGL answer-key/write-up notice PDFs only; "
                    "candidate response sheets stay login-gated and private"
                ),
                publishPolicy=(
                    "official answer-key/write-up notices can support provenance and alignment review, "
                    "but are not treated as question papers or ranked practice sources"
                ),
                reviewStatus="metadata_only",
                tags=tags,
                discoveredAt=discovered_at,
                snippet=f"{headline}; contentType={record.get('contentType')}; recordId={record.get('id')}; attachmentId={attachment.get('id')}.",
            ))

    return candidates


def candidates_from_model_question_api(
    records_payload: object,
    exams_payload: object,
    discovered_at: str | None = None,
) -> list[ResourceCandidate]:
    discovered_at = discovered_at or now_iso()
    records = json_records(records_payload)
    exams = exam_lookup(exams_payload)
    cgl_records = [record for record in records if is_cgl_exam(exams.get(str(record.get("examId"))))]
    cgl_pdf_attachment_count = sum(
        1
        for record in cgl_records
        for attachment in (record.get("attachments") if isinstance(record.get("attachments"), list) else [])
        if isinstance(attachment, dict) and is_pdf_attachment(attachment)
    )
    candidates: list[ResourceCandidate] = [
        ResourceCandidate(
            "official-ssc-model-questions-api",
            "SSC official model-question API",
            SSC_MODEL_QUESTIONS_API,
            "ssc-official-previous-year-papers",
            "official_open",
            "check public model-question metadata and download only CGL public attachments",
            "official public files can enter import review with provenance; non-CGL records are metadata only",
            "metadata_only",
            ["official", "pyq", "paper", "official-api"],
            discovered_at,
            (
                f"{len(records)} official model-question records checked; "
                f"{len(cgl_records)} CGL records matched by exam metadata; "
                f"{cgl_pdf_attachment_count} importable CGL PDF attachments."
            ),
        )
    ]

    for record in cgl_records:
        exam = exams.get(str(record.get("examId"))) or {}
        attachments = record.get("attachments") if isinstance(record.get("attachments"), list) else []
        for attachment in attachments:
            if not isinstance(attachment, dict):
                continue
            file_name = str(attachment.get("fileName") or "")
            path_value = str(attachment.get("path") or "")
            if not is_pdf_attachment(attachment):
                continue

            year = str(record.get("examYear") or "").strip()
            exam_name = str(exam.get("examName") or exam.get("examCode") or "SSC CGL")
            title_parts = [part for part in (exam_name, year, str(record.get("headline") or ""), file_name) if part]
            url = attachment_url(path_value)
            candidates.append(ResourceCandidate(
                id=stable_id("ssc-official-model-questions-api", url, " ".join(title_parts)),
                title=" · ".join(title_parts)[:180],
                url=url,
                sourceId="ssc-official-previous-year-papers",
                sourceType="official_open",
                acquisitionPolicy="download public SSC CGL model-question PDFs only from the official attachment endpoint",
                publishPolicy="official public files can enter import review with provenance, OCR, answer-key, topic, and duplicate gates",
                reviewStatus="needs_review",
                tags=["official", "official-api", "pyq", "paper", "cgl", year],
                discoveredAt=discovered_at,
                snippet=f"{exam_name}; examYear={year}; recordId={record.get('id')}; attachmentId={attachment.get('id')}.",
            ))

    return candidates


def archive_docs(payload: object) -> list[dict]:
    if not isinstance(payload, dict):
        return []
    response = payload.get("response")
    if not isinstance(response, dict):
        return []
    docs = response.get("docs")
    if not isinstance(docs, list):
        return []
    return [doc for doc in docs if isinstance(doc, dict)]


def candidates_from_archive_api(payload: object, discovered_at: str | None = None) -> list[ResourceCandidate]:
    discovered_at = discovered_at or now_iso()
    candidates: list[ResourceCandidate] = []

    for doc in archive_docs(payload):
        identifier = clean_text(str(doc.get("identifier") or ""))
        title = clean_text(str(doc.get("title") or identifier))
        description = clean_text(str(doc.get("description") or ""))
        year = clean_text(str(doc.get("year") or doc.get("date") or ""))
        mediatype = clean_text(str(doc.get("mediatype") or ""))
        primary_text = f"{identifier} {title}".lower()
        if not identifier or "ssc" not in primary_text or not ("cgl" in primary_text or "combined graduate" in primary_text):
            continue
        if identifier.startswith("youtube-") or (mediatype and mediatype not in {"texts", "collection"}):
            continue

        url = f"https://archive.org/details/{urllib.parse.quote(identifier, safe='')}"
        years = sorted({str(match) for match in re.findall(r"\b(19[7-9]\d|20[0-2]\d)\b", f"{title} {description} {year}")})
        candidates.append(ResourceCandidate(
            id=stable_id("archive-ssc-cgl", url, title),
            title=title[:180],
            url=url,
            sourceId="internet-archive-ssc-cgl-reference",
            sourceType="web_pdf_unverified",
            acquisitionPolicy="metadata first; inspect license, provenance, files, OCR quality, and answer keys before download or import",
            publishPolicy="do not copy unreviewed scans into ranked practice; keep provenance and rights review visible",
            reviewStatus="needs_review",
            tags=["archive", "archive-api", "web-pdf", "review", *years],
            discoveredAt=discovered_at,
            snippet=description[:240],
        ))

    return candidates


def fetch_json_with_scrapling(url: str) -> object | None:
    try:
        from scrapling.fetchers import Fetcher  # type: ignore
    except Exception as exc:
        print(f"warning: scrapling unavailable, skipped API fetch {url}: {exc}", file=sys.stderr)
        return None

    try:
        page = Fetcher.get(url, stealthy_headers=True)
        if getattr(page, "status", 0) != 200:
            print(f"warning: API fetch returned {getattr(page, 'status', 'unknown')} for {url}", file=sys.stderr)
            return None
        return page.json()
    except Exception as exc:
        print(f"warning: API fetch skipped {url}: {exc}", file=sys.stderr)
        return None


def replace_query_param(url: str, key: str, value: str) -> str:
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    query[key] = [value]
    encoded = urllib.parse.urlencode(query, doseq=True)
    return urllib.parse.urlunparse(parsed._replace(query=encoded))


def payload_total_records(payload: object) -> int | None:
    if not isinstance(payload, dict):
        return None
    paginate = payload.get("paginate")
    if not isinstance(paginate, dict):
        return None
    for key in ("totalRecords", "total", "count"):
        value = paginate.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str) and value.isdigit():
            return int(value)
    return None


def url_page_limit(url: str) -> int:
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    value = query.get("limit", ["50"])[0]
    return int(value) if value.isdigit() and int(value) > 0 else 50


def fetch_paginated_official_records(url: str, max_pages: int = 12) -> list[object]:
    limit = url_page_limit(url)
    payloads: list[object] = []
    for page_number in range(1, max_pages + 1):
        page_url = replace_query_param(url, "page", str(page_number))
        payload = fetch_json_with_scrapling(page_url)
        if payload is None:
            break
        payloads.append(payload)
        records = json_records(payload)
        total_records = payload_total_records(payload)
        if not records:
            break
        if total_records is None or page_number * limit >= total_records:
            break
    return payloads


def discover_official_model_question_api() -> list[ResourceCandidate]:
    records = fetch_json_with_scrapling(SSC_MODEL_QUESTIONS_API)
    exams = fetch_json_with_scrapling(SSC_EXAMS_API)
    if records is None or exams is None:
        return []
    return candidates_from_model_question_api(records, exams)


def discover_official_answer_key_notices() -> list[ResourceCandidate]:
    exams = fetch_json_with_scrapling(SSC_EXAMS_API)
    if exams is None:
        return []

    candidates: list[ResourceCandidate] = []
    for url in (SSC_ANSWER_KEY_API, SSC_NOTICE_BOARDS_API):
        for records in fetch_paginated_official_records(url):
            candidates.extend(candidates_from_official_attachment_records(
                records,
                exams,
                source_id="ssc-official-answer-key-notices",
                candidate_class="official_answer_key_notice",
            ))
    return candidates


def discover_internet_archive_api() -> list[ResourceCandidate]:
    payload = fetch_json_with_scrapling(ARCHIVE_ADVANCEDSEARCH_API)
    if payload is None:
        return []
    return candidates_from_archive_api(payload)


def discover_with_searxng(endpoint: str, limit: int) -> list[ResourceCandidate]:
    source = source_from_search_result()
    candidates: list[ResourceCandidate] = []
    seen_urls: set[str] = set()
    base = endpoint.rstrip("/")
    for query in build_searxng_queries():
        params = urllib.parse.urlencode({"q": query, "format": "json"})
        payload = http_json(f"{base}/search?{params}", timeout=45)
        if not isinstance(payload, dict):
            continue
        results = payload.get("results", [])
        if not isinstance(results, list):
            continue
        for result in results:
            if not isinstance(result, dict):
                continue
            url = str(result.get("url") or "").strip()
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)
            title = clean_text(str(result.get("title") or url))
            snippet = clean_text(str(result.get("content") or ""))[:240]
            engine_tags = [
                f"engine-{engine}"
                for engine in result.get("engines", [])
                if isinstance(engine, str) and engine
            ][:4]
            candidate = candidate_from_external_result(
                source,
                url,
                title,
                snippet,
                ["searxng-query", *engine_tags],
            )
            if candidate:
                candidates.append(candidate)
            if len(candidates) >= limit:
                return candidates
    return candidates


def discover_with_firecrawl(endpoint: str, seed_urls: list[str], limit: int) -> list[ResourceCandidate]:
    candidates: list[ResourceCandidate] = []
    base = endpoint.rstrip("/")
    for seed_url in seed_urls[:limit]:
        payload = http_json_post(
            f"{base}/v1/scrape",
            {
                "url": seed_url,
                "formats": ["markdown"],
                "onlyMainContent": True,
            },
            timeout=90,
        )
        if not isinstance(payload, dict) or payload.get("success") is not True:
            continue
        data = payload.get("data")
        if not isinstance(data, dict):
            continue
        metadata = data.get("metadata") if isinstance(data.get("metadata"), dict) else {}
        markdown = clean_text(str(data.get("markdown") or ""))[:240]
        final_url = str(metadata.get("sourceURL") or metadata.get("url") or seed_url)
        title = clean_text(str(metadata.get("title") or final_url))
        source = source_from_firecrawl(final_url)
        candidate = candidate_from_external_result(
            source,
            final_url,
            title,
            markdown,
            ["firecrawl-scrape", f"status-{metadata.get('statusCode', 'unknown')}"],
        )
        if candidate:
            candidate.snippet = clean_text(
                f"Firecrawl metadata/excerpt only: {candidate.snippet or markdown}"
            )[:240]
            candidates.append(candidate)
    return candidates


def discover_with_scrapling(source: DiscoverySource, limit: int) -> list[ResourceCandidate]:
    if not robots_allows(source.url):
        print(f"warning: robots disallowed or could not confirm {source.title}", file=sys.stderr)
        return []

    try:
        from scrapling.fetchers import Fetcher  # type: ignore
    except Exception as exc:
        print(f"warning: scrapling unavailable, skipped {source.title}: {exc}", file=sys.stderr)
        return []

    try:
        page = Fetcher.get(source.url, stealthy_headers=True)
    except Exception as exc:
        print(f"warning: fetch skipped {source.title}: {exc}", file=sys.stderr)
        return []

    body = getattr(page, "body", b"")
    if source.id == "sscportal-cgl-model-questions":
        html_text = body.decode("utf-8", errors="ignore") if isinstance(body, bytes) else str(body)
        extracted = sscportal_model_question_candidates_from_html(html_text, source, max(limit, 64))
        if extracted:
            return extracted[: max(limit, 64)]

    candidates: list[ResourceCandidate] = []
    for link in page.css("a")[: max(limit * 10, 80)]:
        href = link.attrib.get("href") if hasattr(link, "attrib") else None
        title = clean_text(" ".join(selector_texts(link.css("::text"))) if hasattr(link, "css") else "")
        if not href:
            continue
        candidate = candidate_from_link(source, href, title)
        if candidate:
            candidates.append(candidate)
        if len(candidates) >= limit:
            break
    return candidates


def merge_candidates(candidates: list[ResourceCandidate]) -> list[ResourceCandidate]:
    by_key: dict[str, ResourceCandidate] = {}
    for candidate in candidates:
        parsed = urllib.parse.urlparse(candidate.url)
        if candidate.sourceId == "sscportal-cgl-model-questions":
            key = parsed._replace(query="").geturl().lower()
        else:
            key = parsed._replace(query="", fragment="").geturl().lower()
        if key not in by_key:
            by_key[key] = candidate
    return sorted(by_key.values(), key=lambda item: (item.sourceType, item.title.lower()))


def candidate_years(candidate: ResourceCandidate) -> set[int]:
    text = f"{candidate.id} {candidate.title} {candidate.url} {candidate.snippet}"
    years = {int(match) for match in re.findall(r"\b(19[7-9]\d|20[0-2]\d)\b", text)}
    return {year for year in years if TARGET_START_YEAR <= year <= TARGET_END_YEAR}


def is_official_paper_candidate(candidate: ResourceCandidate) -> bool:
    text = f"{candidate.title} {candidate.url} {' '.join(candidate.tags)}".lower()
    return (
        candidate.sourceType == "official_open"
        and any(token in text for token in ("previous-year", "previous year", "question paper", "paper"))
        and "notice" not in text
    )


def is_web_pyq_candidate(candidate: ResourceCandidate) -> bool:
    text = f"{candidate.title} {candidate.url} {candidate.snippet} {' '.join(candidate.tags)}".lower()
    paper_signals = ("previous-year", "previous year", "question paper", "pyq", "tier-i paper", "tier i paper")
    resource_only_signals = ("coaching", "ebook", "book", "course", "classes", "academy")
    return (
        candidate.sourceType == "web_pdf_unverified"
        and any(signal in text for signal in paper_signals)
        and not any(signal in text for signal in resource_only_signals)
    )


def pyq_status(official_paper_ids: list[str], official_metadata_ids: list[str], web_ids: list[str]) -> tuple[str, str]:
    if official_paper_ids:
        return (
            "official_paper_discovered_needs_import",
            "Download official paper, run OCR/text extraction, align answer key, then send to model-agent review.",
        )
    if official_metadata_ids:
        if web_ids:
            return (
                "official_metadata_with_web_pdf_leads",
                "Use the official answer-key/notice metadata as provenance, then rights-review the web paper leads before OCR and agent review.",
            )
        return (
            "official_cycle_metadata_only",
            "Find the official previous-year paper and answer-key evidence for this cycle before importing questions.",
        )
    if web_ids:
        return (
            "web_pdf_candidates_need_rights_review",
            "Check rights and provenance for web PDFs, then import only if legally usable and answer-key aligned.",
        )
    return (
        "missing_source",
        "Find an official previous-year paper or rights-cleared user-provided PDF for this Tier-I cycle.",
    )


def promoted_question_year_summary(promoted_questions: list[dict] | None) -> dict[int, dict[str, object]]:
    summary: dict[int, dict[str, object]] = {}
    for question in promoted_questions or []:
        if not isinstance(question, dict) or question.get("reviewStatus") != "reviewed":
            continue
        raw_year = question.get("year")
        try:
            year = int(raw_year)
        except (TypeError, ValueError):
            continue
        if year < TARGET_START_YEAR or year > TARGET_END_YEAR:
            continue
        provenance = question.get("provenance")
        source_id = ""
        if isinstance(provenance, dict):
            source_id = clean_text(str(provenance.get("sourceId") or ""))
        bucket = summary.setdefault(year, {"count": 0, "sourceIds": set()})
        bucket["count"] = int(bucket["count"]) + 1
        if source_id:
            source_ids = bucket["sourceIds"]
            if isinstance(source_ids, set):
                source_ids.add(source_id)
    return summary


def load_promoted_questions(paths: Path | list[Path] | tuple[Path, ...] | None = None) -> list[dict]:
    selected_paths: list[Path]
    if paths is None:
        selected_paths = [CURATED_IMPORTS_PATH, BOOK_IMPORTS_PATH]
    elif isinstance(paths, Path):
        selected_paths = [paths]
    else:
        selected_paths = list(paths)

    questions: list[dict] = []
    seen_ids: set[str] = set()
    for path in selected_paths:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            continue
        except Exception as exc:
            print(f"warning: promoted import summary skipped {path}: {exc}", file=sys.stderr)
            continue
        if not isinstance(payload, list):
            continue
        for item in payload:
            if not isinstance(item, dict):
                continue
            question_id = str(item.get("id") or "")
            if question_id and question_id in seen_ids:
                continue
            if question_id:
                seen_ids.add(question_id)
            questions.append(item)
    return questions


def build_pyq_backlog(
    candidates: list[ResourceCandidate],
    promoted_questions: list[dict] | None = None,
) -> dict[str, object]:
    merged = merge_candidates(candidates)
    promoted_by_year = promoted_question_year_summary(promoted_questions)
    metadata_reference_ids = sorted({
        candidate.id
        for candidate in merged
        if candidate.sourceType in {"copyright_risk_reference", "official_login_personal"}
    })
    generic_reference_ids = sorted({
        candidate.id
        for candidate in merged
        if candidate.id in {
            "official-ssc-previous-year-question-paper-page",
            "web-pdf-ssc-cgl-pyq-query",
            "archive-ssc-cgl-reference-search",
        }
    })

    years: list[PyqBacklogYear] = []
    for year in range(TARGET_START_YEAR, TARGET_END_YEAR + 1):
        official_ids: list[str] = []
        official_paper_ids: list[str] = []
        official_answer_key_notice_ids: list[str] = []
        official_notice_ids: list[str] = []
        web_ids: list[str] = []
        promoted_summary = promoted_by_year.get(year, {"count": 0, "sourceIds": set()})
        promoted_count = int(promoted_summary.get("count", 0))
        promoted_source_ids_raw = promoted_summary.get("sourceIds", set())
        promoted_source_ids = sorted(promoted_source_ids_raw) if isinstance(promoted_source_ids_raw, set) else []
        for candidate in merged:
            if year not in candidate_years(candidate):
                continue
            if candidate.sourceType == "official_open":
                official_ids.append(candidate.id)
                if is_official_paper_candidate(candidate):
                    official_paper_ids.append(candidate.id)
            elif candidate.sourceType == "official_notice_metadata":
                if "official-answer-key-notice" in candidate.tags:
                    official_answer_key_notice_ids.append(candidate.id)
                else:
                    official_notice_ids.append(candidate.id)
            elif is_web_pyq_candidate(candidate):
                web_ids.append(candidate.id)

        official_metadata_ids = official_ids + official_answer_key_notice_ids + official_notice_ids
        status, next_action = pyq_status(official_paper_ids, official_metadata_ids, web_ids)
        ranked_eligible = promoted_count > 0
        if ranked_eligible:
            status = "ranked_ready_curated_imports"
            next_action = "Continue importing and agent-reviewing remaining shifts for this year while filling older missing source years."
        years.append(PyqBacklogYear(
            year=year,
            examCycle="SSC CGL / predecessor graduate-level cycle",
            tier="Tier-I",
            status=status,
            rankedEligible=ranked_eligible,
            officialCandidateIds=sorted(official_ids),
            officialPaperCandidateIds=sorted(official_paper_ids),
            officialAnswerKeyNoticeIds=sorted(official_answer_key_notice_ids),
            officialNoticeIds=sorted(official_notice_ids),
            webCandidateIds=sorted(web_ids),
            rankedEligibleQuestionCount=promoted_count,
            rankedEligibleSourceIds=promoted_source_ids,
            metadataReferenceIds=sorted(set(metadata_reference_ids + generic_reference_ids)),
            nextAction=next_action,
        ))

    years_with_official_paper = sum(1 for item in years if item.officialPaperCandidateIds)
    years_with_unverified_web_lead = sum(1 for item in years if item.webCandidateIds)
    years_with_curated_imports = sum(1 for item in years if item.rankedEligible)
    ranked_eligible_questions = sum(item.rankedEligibleQuestionCount for item in years)
    years_with_any_candidate = len({
        item.year
        for item in years
        if item.officialPaperCandidateIds or item.rankedEligible
    })
    return {
        "generatedAt": now_iso(),
        "target": {
            "startYear": TARGET_START_YEAR,
            "endYear": TARGET_END_YEAR,
            "targetYears": len(years),
            "scope": "SSC CGL Tier-I and predecessor graduate-level objective papers where legally available.",
            "completionRule": "A year is corpus-ready only after official/right-cleared source, OCR/text extraction, answer-key alignment, topic tagging, duplicate review, and model-agent approval.",
        },
        "policy": {
            "rankedPractice": "No backlog year is ranked-eligible until reviewed question rows are promoted into the curated corpus.",
            "copyright": "Scribd and copyright-risk references remain metadata-only unless rights-cleared files are supplied.",
            "truthfulness": "Missing years stay explicitly missing; do not synthesize PYQs or pretend source coverage.",
        },
        "totals": {
            "yearsTargeted": len(years),
            "yearsWithOfficialPaper": years_with_official_paper,
            "yearsWithAnyCandidate": years_with_any_candidate,
            "yearsWithUnverifiedWebLead": years_with_unverified_web_lead,
            "missingOfficialPaperYears": len(years) - years_with_official_paper,
            "yearsWithCuratedImports": years_with_curated_imports,
            "rankedEligibleYears": sum(1 for item in years if item.rankedEligible),
            "rankedEligibleQuestions": ranked_eligible_questions,
        },
        "years": [asdict(item) for item in years],
    }


def build_year_queries(year: int) -> list[str]:
    band_start = year - 2
    if band_start < TARGET_START_YEAR:
        band_start = TARGET_START_YEAR
    band_end = year + 2
    if band_end > TARGET_END_YEAR:
        band_end = TARGET_END_YEAR
    return [
        f"SSC CGL {year} previous year question paper PDF",
        f"SSC CGL {year} Tier-I PYQ question paper PDF",
        f"SSC CGL {year} answer key pdf",
        f"SSC CGL {band_start}-{band_end} previous year question paper",
    ]


def suggested_source_lanes_for_year(year: int, has_official: bool, has_web: bool) -> list[str]:
    lanes = [
        "searxng-ssc-cgl-pyq-search",
        "internet-archive-ssc-cgl-reference",
    ]
    if year >= 2010:
        lanes.extend([
            "official-ssc-previous-year-question-paper-page",
            "cracku-ssc-cgl-previous-papers",
            "careerpower-ssc-cgl-previous-year-paper",
            "drishti-ssc-cgl-pyq-pdf",
        ])
    if not has_official:
        lanes.insert(0, "official-ssc-previous-year-question-paper-page")
    if not has_web:
        lanes.append("web-pdf-search-reference")
    deduped: list[str] = []
    for lane in lanes:
        if lane not in deduped:
            deduped.append(lane)
    return deduped


def build_source_expansion_plan(backlog: dict[str, object]) -> dict[str, object]:
    years = backlog.get("years")
    if not isinstance(years, list):
        raise ValueError("backlog payload missing years list")

    total_years = len(years)
    total_targeted = len({
        int(item["year"])
        for item in years
        if isinstance(item, dict) and isinstance(item.get("year"), int)
    })

    targets = []
    for item in years:
        if not isinstance(item, dict):
            continue
        year = int(item.get("year", 0))
        has_official = bool(item.get("officialPaperCandidateIds"))
        has_web = bool(item.get("webCandidateIds"))
        has_ranking = bool(item.get("rankedEligible"))
        has_any_official_metadata = bool(item.get("officialCandidateIds") or item.get("officialAnswerKeyNoticeIds") or item.get("officialNoticeIds"))

        priority = (
            (100 - (year - TARGET_START_YEAR))
            + (40 if not has_official else 0)
            + (20 if not has_web else 5)
            + (10 if not has_any_official_metadata else 0)
            + (20 if not has_ranking else 0)
        )
        target = {
            "year": year,
            "status": item.get("status", ""),
            "rankedEligible": has_ranking,
            "priority": priority,
            "hasOfficialPaper": has_official,
            "hasWebLead": has_web,
            "recommendedSourceLanes": suggested_source_lanes_for_year(year, has_official, has_web),
            "recommendedQueries": build_year_queries(year),
            "existingOfficialCandidateIds": item.get("officialCandidateIds", []),
            "existingWebCandidateIds": item.get("webCandidateIds", []),
        }
        targets.append(target)

    targets.sort(
        key=lambda item: (
            -(int(item["priority"]) if isinstance(item["priority"], int) else 0),
            int(item["year"]),
        ),
    )
    top_focus = [entry["year"] for entry in targets if not entry["hasOfficialPaper"]][:12]

    return {
        "generatedAt": now_iso(),
        "target": backlog.get("target", {}),
        "sourceBacklog": {
            "yearsTotal": total_years,
            "targetedYears": total_targeted,
            "yearsRankedReady": len([item for item in years if isinstance(item, dict) and item.get("rankedEligible")]),
            "yearsWithoutOfficialPaper": len([item for item in years if isinstance(item, dict) and not item.get("officialPaperCandidateIds")]),
            "nextFocusYears": top_focus,
        },
        "prioritizedTargets": targets,
    }


def write_pyq_backlog(
    candidates: list[ResourceCandidate],
    backlog_path: Path = PYQ_BACKLOG_PATH,
    plan_path: Path | None = None,
) -> dict[str, object]:
    promoted_questions = None
    if backlog_path.resolve() == PYQ_BACKLOG_PATH.resolve():
        promoted_questions = load_promoted_questions()
    payload = build_pyq_backlog(candidates, promoted_questions=promoted_questions)
    backlog_path.parent.mkdir(parents=True, exist_ok=True)
    backlog_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if plan_path is None:
        plan_path = SOURCE_EXPANSION_PLAN_PATH if backlog_path.resolve() == PYQ_BACKLOG_PATH.resolve() else backlog_path.parent / "pyq-source-expansion-plan.json"
    plan = build_source_expansion_plan(payload)
    plan_path.parent.mkdir(parents=True, exist_ok=True)
    plan_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return payload


def write_candidates(
    candidates: list[ResourceCandidate],
    output_path: Path = OUTPUT_PATH,
    backlog_path: Path = PYQ_BACKLOG_PATH,
    plan_path: Path | None = None,
) -> None:
    generated_at = now_iso()
    for candidate in candidates:
        if not candidate.discoveredAt:
            candidate.discoveredAt = generated_at
    payload = {
        "generatedAt": generated_at,
        "policy": {
            "rankedPractice": "Only reviewed official_open, user_provided, or original_practice items enter ranked tests.",
            "copyrightRisk": "copyright_risk_reference resources are metadata-only; do not download, copy, OCR, or publish source text.",
            "webPdf": "web_pdf_unverified candidates require provenance, OCR, answer-key, and duplicate review before use.",
        },
        "candidates": [asdict(candidate) for candidate in merge_candidates(candidates)],
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_pyq_backlog(candidates, backlog_path=backlog_path, plan_path=plan_path)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Discover SSC CGL PYQ and resource candidates.")
    parser.add_argument("--offline-seed", action="store_true", help="Write the built-in source seeds without network access.")
    parser.add_argument("--limit-per-source", type=int, default=8)
    parser.add_argument("--output-path", type=Path, default=OUTPUT_PATH, help="Resource manifest output path.")
    parser.add_argument("--backlog-path", type=Path, default=PYQ_BACKLOG_PATH, help="50-year PYQ backlog output path.")
    parser.add_argument("--source-expansion-plan-path", type=Path, default=None, help="Path for the generated source expansion plan report.")
    parser.add_argument("--use-searxng", action="store_true", help="Use local Docker SearXNG for additional metadata-only source leads.")
    parser.add_argument("--searxng-endpoint", default=os.environ.get("SEARXNG_ENDPOINT", DEFAULT_SEARXNG_ENDPOINT))
    parser.add_argument("--use-firecrawl", action="store_true", help="Use local Docker Firecrawl to capture metadata/excerpts for selected leads.")
    parser.add_argument("--firecrawl-endpoint", default=os.environ.get("FIRECRAWL_ENDPOINT", DEFAULT_FIRECRAWL_ENDPOINT))
    parser.add_argument("--firecrawl-limit", type=int, default=5)
    args = parser.parse_args()

    candidates = list(OFFLINE_CANDIDATES)
    if not args.offline_seed:
        candidates.extend(discover_official_model_question_api())
        candidates.extend(discover_official_answer_key_notices())
        candidates.extend(discover_internet_archive_api())
        for source in SOURCES:
            candidates.extend(discover_with_scrapling(source, args.limit_per_source))
            time.sleep(source.delay_seconds)
        if args.use_searxng:
            candidates.extend(discover_with_searxng(args.searxng_endpoint, max(args.limit_per_source * 2, 12)))
        if args.use_firecrawl:
            seed_urls = [
                candidate.url
                for candidate in merge_candidates(candidates)
                if candidate.sourceType == "web_pdf_unverified"
                and not candidate.url.lower().endswith(".pdf")
            ][: args.firecrawl_limit]
            candidates.extend(discover_with_firecrawl(args.firecrawl_endpoint, seed_urls, args.firecrawl_limit))

    write_candidates(candidates, args.output_path, args.backlog_path, args.source_expansion_plan_path)
    print(f"wrote {len(merge_candidates(candidates))} SSC CGL resource candidates: {args.output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
