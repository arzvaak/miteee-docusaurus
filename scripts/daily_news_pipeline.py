"""Daily SSC CGL and UPSC CSE current-affairs fetch and Mistral summary pipeline.

The script is intentionally RSS/official-first. It stores source metadata and
short excerpts, never full third-party article bodies.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT_ENV = "CURRENT_AFFAIRS_DATA_ROOT"
SSC_RECORD_ATTRIBUTES = "id,headline,examId,examYear,contentType,startDate,endDate,language,createdAt"
SSC_NOTICE_BOARDS_API = (
    "https://ssc.gov.in/api/general-website/portal/records?"
    "page=1&limit=25&contentType=notice-boards&key=createdAt&order=DESC&isAttachment=true"
    f"&attributes={SSC_RECORD_ATTRIBUTES}&language=english"
)
MISTRAL_SUMMARY_ITEM_LIMIT = 18
MIN_DAILY_SUMMARY_ITEMS = 12
MISTRAL_CONTEXT_EXCERPT_CHARS = 1200
MISTRAL_MAX_TOKENS = 12000
DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions"
MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MAX_RAW_EXCERPT_CHARS = 2400
MAX_SUMMARY_FIELD_CHARS = 360
MAX_DEEP_DIVE_FIELD_CHARS = 760
MAX_SOURCE_EXCERPT_CHARS = 900
MAX_ENRICHED_ITEMS_PER_SOURCE = 8


@dataclass(frozen=True)
class Source:
    id: str
    name: str
    url: str
    tags: tuple[str, ...]
    delay_seconds: float = 1.0
    parser: str = "scrape"
    obey_robots: bool = True
    crawl_delay_seconds: float | None = None


@dataclass
class RawItem:
    title: str
    source: str
    url: str
    published_at: str
    fetched_at: str
    raw_excerpt: str
    tags: list[str]


SOURCES = [
    Source("pib", "PIB", "https://archive.pib.gov.in/newsite/rssenglish.aspx", ("polity", "schemes", "government", "upsc-gs2"), parser="rss"),
    Source("pib-features", "PIB Features", "https://archive.pib.gov.in/newsite/rssenglish_fea.aspx", ("polity", "schemes", "government", "culture", "upsc-gs1", "upsc-gs2"), parser="rss"),
    Source("rbi-press-releases", "RBI", "https://www.rbi.org.in/pressreleases_rss.xml", ("economy", "banking", "rbi"), parser="rss"),
    Source("rbi-notifications", "RBI", "https://www.rbi.org.in/notifications_rss.xml", ("economy", "banking", "rbi", "notifications", "upsc-gs3"), parser="rss"),
    # PRS has no stable public RSS endpoint in this app, so use Scrapling with robots.txt and a conservative Crawl-delay.
    Source("prs", "PRS", "https://prsindia.org/", ("polity", "parliament", "bills", "governance", "upsc-gs2"), 10.0, "scrape", True, 10.0),
    Source("ssc", "SSC", SSC_NOTICE_BOARDS_API, ("ssc", "exam-notice"), 1.0, "ssc_api"),
    Source("indian-express-upsc", "Indian Express UPSC", "https://indianexpress.com/section/upsc-current-affairs/feed/", ("upsc", "prelims", "mains", "explained"), parser="rss"),
    Source("indian-express-explained", "Indian Express Explained", "https://indianexpress.com/section/explained/feed/", ("explained", "polity", "economy", "science", "international"), parser="rss"),
    Source("indian-express-india", "Indian Express India", "https://indianexpress.com/section/india/feed/", ("national", "polity", "governance"), parser="rss"),
    Source("indian-express-world", "Indian Express World", "https://indianexpress.com/section/world/feed/", ("international", "upsc-gs2"), parser="rss"),
    Source("indian-express-economy", "Indian Express Economy", "https://indianexpress.com/section/business/economy/feed/", ("economy", "upsc-gs3"), parser="rss"),
    Source("indian-express-science", "Indian Express Science", "https://indianexpress.com/section/technology/science/feed/", ("science", "technology", "upsc-gs3"), parser="rss"),
    Source("indian-express-sports", "Indian Express Sports", "https://indianexpress.com/section/sports/feed/", ("sports", "awards", "ssc"), parser="rss"),
    Source("the-hindu-national", "The Hindu National", "https://www.thehindu.com/news/national/feeder/default.rss", ("national", "polity", "governance"), parser="rss"),
    Source("the-hindu-international", "The Hindu International", "https://www.thehindu.com/news/international/feeder/default.rss", ("international", "upsc-gs2"), parser="rss"),
    Source("the-hindu-business", "The Hindu Business", "https://www.thehindu.com/business/feeder/default.rss", ("economy", "upsc-gs3"), parser="rss"),
    Source("the-hindu-sci-tech", "The Hindu Sci-Tech", "https://www.thehindu.com/sci-tech/feeder/default.rss", ("science", "technology", "environment", "upsc-gs3"), parser="rss"),
    Source("the-hindu-sport", "The Hindu Sport", "https://www.thehindu.com/sport/feeder/default.rss", ("sports", "awards", "ssc"), parser="rss"),
    Source("the-hindu-environment", "The Hindu Environment", "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss", ("environment", "science", "upsc-gs3"), parser="rss"),
    Source("the-hindu-education", "The Hindu Education", "https://www.thehindu.com/education/feeder/default.rss", ("education", "schemes", "governance", "upsc-gs2"), parser="rss"),
    Source("indian-express-education", "Indian Express Education", "https://indianexpress.com/section/education/feed/", ("education", "exam-notice", "governance"), parser="rss"),
    Source("indian-express-research", "Indian Express Research", "https://indianexpress.com/section/research/feed/", ("science", "technology", "research", "upsc-gs3"), parser="rss"),
]


def today_key() -> str:
    return datetime.now().astimezone().date().isoformat()


def data_root() -> Path:
    return Path(os.environ.get(DATA_ROOT_ENV, str(ROOT / "data" / "current-affairs"))).expanduser()


def raw_path_for(date: str, root: Path | None = None) -> Path:
    return (root or data_root()) / "raw" / f"{date}.jsonl"


def daily_path_for(date: str, root: Path | None = None) -> Path:
    return (root or data_root()) / "daily" / f"{date}.json"


def state_path_for(root: Path | None = None) -> Path:
    return (root or data_root()) / "state.json"


def clean_text(value: str) -> str:
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value or "")).strip())


def selector_texts(selector) -> list[str]:
    if hasattr(selector, "getall"):
        return selector.getall()
    if hasattr(selector, "get_all"):
        return selector.get_all()
    return []


def parse_date(value: str | None) -> str:
    if not value:
        return datetime.now(timezone.utc).isoformat()
    try:
        return parsedate_to_datetime(value).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()


def canonical_key(item: RawItem) -> str:
    parsed = urllib.parse.urlparse(item.url)
    normalized_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc.lower(), parsed.path.rstrip("/"), "", "", ""))
    normalized_title = re.sub(r"[^a-z0-9]+", " ", item.title.lower()).strip()
    return f"{normalized_url}|{normalized_title}"


def normalize_for_grounding(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", clean_text(value).lower()).strip()


def is_english_text(value: str) -> bool:
    letters = [character for character in value if character.isalpha()]
    if not letters:
        return True
    latin_letters = [character for character in letters if "a" <= character.lower() <= "z"]
    return len(latin_letters) / len(letters) >= 0.8


def valid_raw_item(item: RawItem) -> bool:
    required_values = [item.title, item.source, item.url, item.published_at, item.fetched_at, item.raw_excerpt]
    if any(not isinstance(value, str) or not value.strip() for value in required_values):
        return False
    if not is_english_text(f"{item.title} {item.raw_excerpt}"):
        return False
    if len(item.raw_excerpt) > MAX_RAW_EXCERPT_CHARS:
        item.raw_excerpt = item.raw_excerpt[:MAX_RAW_EXCERPT_CHARS].strip()
    return bool(item.raw_excerpt)


def filter_valid_raw_items(items: list[RawItem]) -> list[RawItem]:
    valid: list[RawItem] = []
    rejected = 0
    seen: set[str] = set()
    for item in items:
        if not valid_raw_item(item):
            rejected += 1
            continue
        key = canonical_key(item)
        if key in seen:
            continue
        seen.add(key)
        valid.append(item)
    if rejected:
        print(f"warning: dropped {rejected} current-affairs raw item(s) with missing required fields", file=sys.stderr)
    return valid


def fetch_url(url: str) -> bytes:
    request = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MITEEE-SSC-UPSC-study-bot/1.0",
        "Accept": "application/rss+xml, application/xml, text/xml, text/html;q=0.8",
    })
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return response.read()
    except Exception as urllib_exc:
        try:
            from scrapling.fetchers import Fetcher  # type: ignore
            page = Fetcher.get(url, timeout=25000)
            body = getattr(page, "body", b"")
            if isinstance(body, bytes) and body.strip():
                return body
            text = str(getattr(page, "text", "") or getattr(page, "html_content", ""))
            if text.strip():
                return text.encode("utf-8")
        except Exception as scrapling_exc:
            raise urllib_exc from scrapling_exc
        raise urllib_exc


def robots_allows_url(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return False
    robots_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, "/robots.txt", "", "", ""))
    try:
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(robots_url)
        parser.read()
        return parser.can_fetch("MITEEE-SSC-UPSC-study-bot/1.0", url)
    except Exception as exc:
        print(f"warning: robots.txt check skipped for article {url}: {exc}", file=sys.stderr)
        return False


def extract_informative_html_excerpt(payload: bytes, fallback: str) -> str:
    text = payload.decode("utf-8", errors="replace")
    meta_matches = re.findall(
        r'<meta[^>]+(?:name|property)=["\'](?:description|og:description|twitter:description)["\'][^>]+content=["\']([^"\']+)["\']',
        text,
        flags=re.IGNORECASE,
    )
    paragraphs = re.findall(r"<p[^>]*>([\s\S]*?)</p>", text, flags=re.IGNORECASE)
    cleaned = [clean_text(value) for value in [*meta_matches, *paragraphs]]
    useful = [
        value
        for value in cleaned
        if len(value) >= 45
        and not re.search(r"\b(advertisement|subscribe|sign in|cookie|newsletter|terms)\b", value, re.IGNORECASE)
    ]
    excerpt = " ".join(useful[:5]) or fallback
    return excerpt[:MAX_RAW_EXCERPT_CHARS].strip()


def enrich_raw_items_with_article_excerpts(source: Source, items: list[RawItem]) -> list[RawItem]:
    if os.environ.get("CURRENT_AFFAIRS_ENRICH_ARTICLES", "1").strip().lower() in {"0", "false", "no"}:
        return items
    enriched: list[RawItem] = []
    for index, item in enumerate(items):
        if index >= MAX_ENRICHED_ITEMS_PER_SOURCE:
            enriched.append(item)
            continue
        if not robots_allows_url(item.url):
            enriched.append(item)
            continue
        try:
            payload = fetch_url(item.url)
            article_excerpt = extract_informative_html_excerpt(payload, item.raw_excerpt)
        except Exception as exc:
            print(f"warning: article enrichment skipped for {source.name}: {exc}", file=sys.stderr)
            enriched.append(item)
            continue
        if len(article_excerpt) > len(item.raw_excerpt):
            item.raw_excerpt = article_excerpt
            if "article-excerpt" not in item.tags:
                item.tags.append("article-excerpt")
        time.sleep(min(2.0, source.crawl_delay_seconds or source.delay_seconds))
        enriched.append(item)
    return enriched


def robots_allows(source: Source) -> bool:
    if not source.obey_robots:
        return True
    parsed = urllib.parse.urlparse(source.url)
    robots_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, "/robots.txt", "", "", ""))
    try:
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(robots_url)
        parser.read()
        return parser.can_fetch("MITEEE-SSC-CGL-study-bot/1.0", source.url)
    except Exception as exc:
        print(f"warning: robots.txt check skipped for {source.name}: {exc}", file=sys.stderr)
        return False


def parse_rss(source: Source) -> list[RawItem]:
    fetched_at = datetime.now(timezone.utc).isoformat()
    payload = fetch_url(source.url)
    root = ET.fromstring(payload)
    items: list[RawItem] = []
    for entry in root.findall(".//item")[:30]:
        title = clean_text(entry.findtext("title") or "")
        link = clean_text(entry.findtext("link") or "")
        excerpt = clean_text(entry.findtext("description") or "")
        if not title or not link:
            continue
        items.append(RawItem(
            title=title,
            source=source.name,
            url=link,
            published_at=parse_date(entry.findtext("pubDate")),
            fetched_at=fetched_at,
            raw_excerpt=(excerpt or title)[:700],
            tags=list(source.tags),
        ))
    return enrich_raw_items_with_article_excerpts(source, items)


def ssc_attachment_url(record: dict) -> str:
    attachments = record.get("attachments")
    if isinstance(attachments, list) and attachments:
        first = attachments[0]
        if isinstance(first, dict) and isinstance(first.get("path"), str) and first["path"].strip():
            normalized_path = first["path"].replace("\\", "/").lstrip("/")
            return f"https://ssc.gov.in/api/attachment/{normalized_path}"
    record_id = str(record.get("id", "")).strip()
    return f"https://ssc.gov.in/?notice={urllib.parse.quote(record_id)}" if record_id else "https://ssc.gov.in/"


def parse_ssc_api(source: Source) -> list[RawItem]:
    fetched_at = datetime.now(timezone.utc).isoformat()
    payload = json.loads(fetch_url(source.url).decode("utf-8"))
    records = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(records, list):
        return []
    items: list[RawItem] = []
    for record in records[:25]:
        if not isinstance(record, dict):
            continue
        title = clean_text(str(record.get("headline") or ""))
        if not title:
            continue
        created_at = clean_text(str(record.get("createdAt") or ""))
        exam_year = clean_text(str(record.get("examYear") or ""))
        excerpt_parts = [title]
        if exam_year:
            excerpt_parts.append(f"Exam year: {exam_year}.")
        if isinstance(record.get("contentType"), str):
            excerpt_parts.append(f"Content type: {record['contentType']}.")
        items.append(RawItem(
            title=title,
            source=source.name,
            url=ssc_attachment_url(record),
            published_at=created_at or datetime.now(timezone.utc).isoformat(),
            fetched_at=fetched_at,
            raw_excerpt=" ".join(excerpt_parts)[:700],
            tags=list(source.tags),
        ))
    return items


def scrape_official_page_with_scrapling(source: Source) -> list[RawItem]:
    if not robots_allows(source):
        print(f"warning: robots.txt disallows or could not confirm Scrapling access for {source.name}", file=sys.stderr)
        return []

    try:
        from scrapling.fetchers import Fetcher  # type: ignore
    except Exception:
        return []

    try:
        page = Fetcher.get(source.url)
        title = clean_text(page.css("title::text").get() or source.name)
        text = clean_text(" ".join(selector_texts(page.css("body *::text"))[:60]))
    except Exception as exc:
        print(f"warning: Scrapling skipped {source.name}: {exc}", file=sys.stderr)
        return []

    return [RawItem(
        title=title,
        source=source.name,
        url=source.url,
        published_at=datetime.now(timezone.utc).isoformat(),
        fetched_at=datetime.now(timezone.utc).isoformat(),
        raw_excerpt=(text or title or source.name)[:700],
        tags=list(source.tags),
    )]


def discover_items() -> list[RawItem]:
    candidates: list[RawItem] = []
    for source in SOURCES:
        try:
            if source.parser == "rss":
                source_items = parse_rss(source)
            elif source.parser == "ssc_api":
                source_items = parse_ssc_api(source)
            else:
                source_items = scrape_official_page_with_scrapling(source)
            candidates.extend(source_items)
            # Honor source-specific Crawl-delay where configured; otherwise use the default inter-source delay.
            time.sleep(source.crawl_delay_seconds or source.delay_seconds)
        except Exception as exc:
            print(f"warning: skipped {source.name}: {exc}", file=sys.stderr)
    return filter_valid_raw_items(candidates)


def item_text(item: RawItem) -> str:
    return clean_text(" ".join([item.title, item.raw_excerpt, item.source, *item.tags])).lower()


def is_routine_sports_or_trivia(item: RawItem, text: str) -> bool:
    if "sports" not in item.tags and "sport" not in text:
        return False
    durable_terms = {
        "award", "awards", "medal", "winner", "wins", "won", "championship", "tournament",
        "world cup", "olympic", "asian games", "commonwealth", "grand slam", "wimbledon",
        "fifa", "icc", "host", "venue", "rankings", "record"
    }
    routine_terms = {
        "says", "privilege", "series loss", "lineup", "squad", "debut delayed", "captaincy",
        "injury", "practice", "selection", "wait", "return after long absences"
    }
    return not any(term in text for term in durable_terms) or any(term in text for term in routine_terms)


def is_low_value_current_affairs(item: RawItem) -> bool:
    text = item_text(item)
    low_value_patterns = [
        r"\banthropic\b.*\b(host|access|curbs?)\b",
        r"\b(openai|chatgpt|google|meta|microsoft|amazon)\b.*\b(host|data center|market access|curbs?)\b",
        r"\bplane crash\b|\baircraft crash\b|\bcrash kills\b",
        r"\bseries loss\b|\bleading england\b|\btest captaincy\b",
        r"\brumours?\b",
    ]
    if any(re.search(pattern, text) for pattern in low_value_patterns):
        keep_context = {
            "government", "parliament", "bill", "act", "court", "constitution",
            "policy", "regulation", "disaster management", "public health", "environment",
            "rbi", "gst", "scheme", "ministry", "un ", "united nations", "treaty"
        }
        if not any(term in text for term in keep_context):
            return True
        if re.search(r"\banthropic\b.*\b(host|access|curbs?)\b", text):
            return True
    if is_routine_sports_or_trivia(item, text):
        return True
    local_crime_terms = {"murder", "robbery", "embezzlement", "probe ordered", "negligence", "arrested"}
    policy_context = {"supreme court", "high court", "constitutional", "digital evidence", "public health", "governance", "rights"}
    if any(term in text for term in local_crime_terms) and not any(term in text for term in policy_context):
        return True
    return False


def study_relevance(item: RawItem) -> str:
    text = item_text(item)
    if is_low_value_current_affairs(item):
        return "low"
    high_tags = {
        "ssc", "exam-notice", "rbi", "banking", "notifications", "schemes", "government",
        "parliament", "bills", "governance", "upsc", "prelims", "mains", "explained",
        "upsc-gs1", "upsc-gs2", "upsc-gs3", "environment"
    }
    high_terms = {
        "rbi", "gst", "compensation cess", "budget", "monetary policy", "repo", "scheme",
        "bill", "act", "parliament", "supreme court", "constitution", "united nations",
        " un ", "deep-sea mining", "ocean floor", "climate", "biodiversity", "report",
        "index", "appointment", "commissioned", "defence", "medical devices rules",
        "digital public infrastructure", "education policy"
    }
    if any(tag in high_tags for tag in item.tags) or any(term in f" {text} " for term in high_terms):
        return "high"
    medium_tags = {"polity", "economy", "science", "technology", "international", "national", "culture", "awards"}
    if any(tag in medium_tags for tag in item.tags):
        return "medium"
    return "low"


def filter_study_relevant_items(items: list[RawItem]) -> list[RawItem]:
    return [item for item in items if study_relevance(item) != "low"]


def select_items_for_llm(items: list[RawItem], limit: int = MISTRAL_SUMMARY_ITEM_LIMIT) -> list[RawItem]:
    items = filter_study_relevant_items(items)
    priority_tags = {
        "ssc": 0,
        "exam-notice": 0,
        "upsc": 0,
        "prelims": 0,
        "mains": 0,
        "explained": 1,
        "schemes": 1,
        "government": 1,
        "polity": 1,
        "parliament": 1,
        "bills": 1,
        "governance": 1,
        "upsc-gs2": 1,
        "economy": 2,
        "banking": 2,
        "rbi": 2,
        "notifications": 2,
        "upsc-gs3": 2,
        "science": 3,
        "technology": 3,
        "environment": 3,
        "international": 3,
        "national": 4,
        "sports": 4,
        "awards": 4,
        "culture": 4,
        "upsc-gs1": 4,
    }

    def item_priority(item: RawItem) -> tuple[int, str, str]:
        best_tag_priority = min((priority_tags.get(tag, 9) for tag in item.tags), default=9)
        return (best_tag_priority, item.source, item.published_at)

    selected: list[RawItem] = []
    seen_sources: set[str] = set()
    for item in sorted(items, key=item_priority):
        if item.source in seen_sources:
            continue
        selected.append(item)
        seen_sources.add(item.source)
        if len(selected) >= limit:
            return selected

    seen_keys = {canonical_key(item) for item in selected}
    for item in sorted(items, key=item_priority):
        key = canonical_key(item)
        if key in seen_keys:
            continue
        selected.append(item)
        seen_keys.add(key)
        if len(selected) >= limit:
            break
    return selected


def select_items_for_mistral(items: list[RawItem], limit: int = MISTRAL_SUMMARY_ITEM_LIMIT) -> list[RawItem]:
    return select_items_for_llm(items, limit)


def minimum_summary_items(items: list[RawItem]) -> int:
    return min(MIN_DAILY_SUMMARY_ITEMS, len(select_items_for_llm(items)))


def write_jsonl(date: str, items: list[RawItem], root: Path | None = None) -> None:
    path = raw_path_for(date, root)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for item in items:
            handle.write(json.dumps(asdict(item), ensure_ascii=False) + "\n")


def fallback_brief(date: str, items: list[RawItem]) -> dict:
    exam_relevant_tags = {
        "schemes",
        "government",
        "ssc",
        "exam-notice",
        "upsc",
        "prelims",
        "mains",
        "explained",
        "economy",
        "banking",
        "rbi",
        "notifications",
        "polity",
        "parliament",
        "bills",
        "governance",
        "science",
        "technology",
        "environment",
        "international",
        "national",
        "sports",
        "awards",
        "culture",
    }
    ranked = [item for item in items if any(tag in exam_relevant_tags for tag in item.tags)]
    ranked = select_items_for_llm(ranked, limit=MISTRAL_SUMMARY_ITEM_LIMIT)
    return {
        "date": date,
        "status": "failed" if items and not ranked else "ready",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "items": [fallback_summary_item(item) for item in ranked],
    }


def build_current_affairs_llm_prompt(date: str, items: list[RawItem], provider_name: str = "DeepSeek") -> str:
    selected_items = select_items_for_llm(items)
    supplied = [
        {
            "title": item.title,
            "source": item.source,
            "url": item.url,
            "published_at": item.published_at,
            "raw_excerpt": item.raw_excerpt[:MISTRAL_CONTEXT_EXCERPT_CHARS],
            "tags": item.tags,
        }
        for item in selected_items
    ]
    return "\n".join([
        f"You are creating a daily SSC CGL + UPSC CSE current-affairs deep-dive with {provider_name} from supplied source metadata and short excerpts only.",
        f"Return JSON only, with 12 to {MISTRAL_SUMMARY_ITEM_LIMIT} items when enough supplied items are available. Prefer source-diverse stronger items over filler, but do not stop at a tiny brief.",
        "Use this shape: {\"date\":\"YYYY-MM-DD\",\"items\":[{\"title\":\"short factual title\",\"source\":\"source\",\"url\":\"https://...\",\"published_at\":\"ISO date\",\"source_excerpt\":\"bounded source excerpt in your own compressed wording from supplied raw_excerpt\",\"ssc_relevance\":\"high|medium|low\",\"upsc_cse_relevance\":\"high|medium|low\",\"exam_areas\":[\"area\"],\"key_points\":[\"grounded fact\"],\"why_it_matters_for_ssc_cgl\":\"SSC angle\",\"why_it_matters_for_upsc_cse\":\"UPSC angle\",\"static_context\":\"background link\",\"prelims_facts\":[\"fact\"],\"mains_angles\":[\"angle\"],\"memory_hook\":\"one recall cue\",\"mcq_seed\":{\"question\":\"question\",\"answer\":\"answer\",\"trap\":\"trap\"}}]}.",
        "For every item, copy the exact source url, source name, and published_at from one supplied item. Keep the title close to the supplied title and use at least two exact important words from the supplied title or excerpt.",
        "Do not invent facts. Do not quote article bodies. Do not use outside knowledge except to name a standard exam bucket such as GS2, GS3, polity, economy, science, geography, environment, IR, sports, awards, or schemes.",
        "Hard relevance rule: do not include routine cricket commentary, random accidents, local crime, company-hosting or AI-business access stories, or source-identification trivia unless the excerpt clearly ties the item to Indian governance, policy, environment, economy, science, constitutional issues, exam notices, or durable static GK.",
        "MCQ rule: the mcq_seed.question must test the actual fact, institution, term, scheme, report, place, date, constitutional link, static GK bridge, or UPSC angle. Never ask 'Which source reported/published...' and never make a news outlet name the answer unless the outlet itself is the exam-relevant institution.",
        "Deep-dive requirements: key_points must have 3-5 informative grounded facts when the excerpt supports them; prelims_facts must be atomic and memorisable; mains_angles must be issue-framing bullets, not invented claims.",
        "Background requirements: static_context should explain the institution, term, scheme background, constitutional link, geography/environment/science concept, or IR context a serious SSC+UPSC learner may miss. Keep it grounded in the excerpt or a standard exam bucket, not speculative.",
        "Calendar/use-now requirements: write each item so it can be read as it arrives today and later revised inside yesterday, running-week, and running-month views.",
        "SSC lens: static GK, one-liner facts, institutions, reports, schemes, appointments, awards, sports, science, geography, economy terms, and exam notices.",
        "UPSC CSE lens: prelims keywords plus mains angles for GS1 culture/geography/history, GS2 polity/governance/IR, GS3 economy/environment/science/security, and essay-ready implications.",
        f"Date: {date}",
        "Supplied items:",
        json.dumps(supplied, ensure_ascii=False),
    ])


def build_mistral_prompt(date: str, items: list[RawItem]) -> str:
    selected_items = select_items_for_mistral(items)
    return build_current_affairs_llm_prompt(date, selected_items, "Mistral")


def excerpt_points(item: RawItem, limit: int) -> list[str]:
    candidates = [
        clean_text(part)
        for part in re.split(r"(?<=[.!?])\s+|;\s+|\|\s+", item.raw_excerpt)
    ]
    points = [
        point[:MAX_SUMMARY_FIELD_CHARS].strip()
        for point in candidates
        if len(point.strip()) >= 25
    ]
    if item.title and all(normalize_for_grounding(item.title) not in normalize_for_grounding(point) for point in points):
        points.insert(0, item.title[:MAX_SUMMARY_FIELD_CHARS].strip())
    return points[:limit] or [item.title[:MAX_SUMMARY_FIELD_CHARS].strip()]


def source_excerpt_for_item(item: RawItem) -> str:
    excerpt = clean_text(item.raw_excerpt)
    if not excerpt:
        excerpt = item.title
    return excerpt[:MAX_SOURCE_EXCERPT_CHARS].strip()


def static_context_fallback(item: RawItem) -> str:
    tags = ", ".join(item.tags[:4]) or item.source
    return (
        f"Revise the static background linked to {tags}: institution or ministry, constitutional or policy link, "
        "location, economic term, science concept, report, scheme, or international body."
    )[:MAX_DEEP_DIVE_FIELD_CHARS]


def mains_angle_fallback(item: RawItem) -> str:
    tags = ", ".join(item.tags[:4]) or item.source
    return f"Frame the update through {tags}: objective, implementation, stakeholders, federalism, economy, environment, science, IR, or governance impact."[:MAX_DEEP_DIVE_FIELD_CHARS]


def content_mcq_seed(item: RawItem) -> dict:
    text = item_text(item)
    title = item.title[:120].strip()
    if "gst compensation cess" in text or ("gst" in text and "cess" in text):
        return {
            "question": "Which GST-linked term should be revised from this tobacco and pan masala levy update?",
            "answer": "GST compensation cess",
            "trap": "Confusing it with ordinary customs duty or income tax surcharge.",
        }
    if "rbi" in item.tags or item.source == "RBI" or "rbi" in text:
        return {
            "question": "Which institution is linked to this banking or monetary-policy update?",
            "answer": "RBI",
            "trap": "Confusing RBI's banking role with SEBI or the Finance Commission.",
        }
    if "ssc" in item.tags or item.source == "SSC":
        return {
            "question": "Which exam body or portal is linked to this notice?",
            "answer": "SSC",
            "trap": "Treating an official SSC notice as a coaching-site update.",
        }
    if "prs" in item.tags or item.source == "PRS" or "bill" in text or "parliament" in text:
        return {
            "question": "Which governance area should be revised from this Parliament or bill update?",
            "answer": "Bills, Parliament, and legislative scrutiny",
            "trap": "Reading it only as a headline without linking it to polity.",
        }
    if "un " in f" {text} " or "united nations" in text or "ocean floor" in text or "deep-sea mining" in text:
        return {
            "question": "Which exam theme is tied to this ocean-floor or UN-linked update?",
            "answer": "Deep-sea mining and marine environment governance",
            "trap": "Treating it as a random foreign event instead of environment and IR.",
        }
    if "scheme" in text or "ministry" in text or "government" in item.tags:
        return {
            "question": "What should be identified first while revising this government update?",
            "answer": "The scheme or ministry, target group, objective, and launch context",
            "trap": "Memorising only the headline without the implementing institution.",
        }
    if "report" in text or "index" in text:
        return {
            "question": "What static-GK detail should be revised from this report or index update?",
            "answer": "The releasing body, theme, rank or finding, and India's position where supplied",
            "trap": "Confusing the report publisher with a news outlet.",
        }
    return {
        "question": f"What exam-relevant fact should be revised from this update: {title}?",
        "answer": excerpt_points(item, 1)[0],
        "trap": "Stopping at the headline instead of extracting the durable fact.",
    }


def fallback_summary_item(item: RawItem) -> dict:
    relevance = study_relevance(item)
    return {
        "title": item.title[:160],
        "source": item.source,
        "url": item.url,
        "published_at": item.published_at,
        "source_excerpt": source_excerpt_for_item(item),
        "ssc_relevance": "high" if relevance == "high" else "medium",
        "upsc_cse_relevance": "high" if any(tag in item.tags for tag in ["upsc", "prelims", "mains", "explained", "upsc-gs1", "upsc-gs2", "upsc-gs3"]) or relevance == "high" else "medium",
        "exam_areas": item.tags[:4] or [item.source],
        "key_points": excerpt_points(item, 3),
        "why_it_matters_for_ssc_cgl": "Convert the source-grounded fact into SSC recall: institution, date, place, report, award, appointment, scheme, or exam notice.",
        "why_it_matters_for_upsc_cse": "Attach the fact to prelims keywords and one mains-ready issue angle before revision.",
        "static_context": static_context_fallback(item),
        "prelims_facts": excerpt_points(item, 2),
        "mains_angles": [mains_angle_fallback(item)],
        "memory_hook": item.title[:90],
        "mcq_seed": content_mcq_seed(item),
    }


def trim_generated_summary_item(item: dict) -> dict:
    for field in ["title", "source", "published_at", "memory_hook", "why_it_matters_for_ssc_cgl"]:
        if isinstance(item.get(field), str):
            item[field] = clean_text(str(item[field]))[:MAX_SUMMARY_FIELD_CHARS]
    if isinstance(item.get("source_excerpt"), str):
        item["source_excerpt"] = clean_text(str(item["source_excerpt"]))[:MAX_SOURCE_EXCERPT_CHARS]
    for field in ["why_it_matters_for_upsc_cse", "static_context"]:
        if isinstance(item.get(field), str):
            item[field] = clean_text(str(item[field]))[:MAX_DEEP_DIVE_FIELD_CHARS]
    for field, limit in [("key_points", MAX_SUMMARY_FIELD_CHARS), ("prelims_facts", MAX_DEEP_DIVE_FIELD_CHARS), ("mains_angles", MAX_DEEP_DIVE_FIELD_CHARS)]:
        if isinstance(item.get(field), list):
            item[field] = [
                clean_text(str(value))[:limit]
                for value in item[field]
                if clean_text(str(value))
            ][:5]
    mcq_seed = item.get("mcq_seed")
    if isinstance(mcq_seed, dict):
        for field in ["question", "answer", "trap"]:
            if isinstance(mcq_seed.get(field), str):
                mcq_seed[field] = clean_text(str(mcq_seed[field]))[:MAX_SUMMARY_FIELD_CHARS]
    return item


SOURCE_NAME_RECALL_PATTERN = re.compile(
    r"\b(which\s+(?:source|outlet|newspaper|publication|website|media)|"
    r"(?:reported|published|carried|covered)\s+by|"
    r"source\s+reported)\b",
    re.IGNORECASE,
)


def is_source_name_recall_card(mcq_seed: object) -> bool:
    if not isinstance(mcq_seed, dict):
        return False
    question = str(mcq_seed.get("question", "")).strip()
    return bool(SOURCE_NAME_RECALL_PATTERN.search(question))


def repair_generated_summary_item(item: dict, raw_item: RawItem | None) -> dict:
    if raw_item is None:
        return trim_generated_summary_item(item)
    tags = raw_item.tags
    if item.get("upsc_cse_relevance") not in {"high", "medium", "low"}:
        item["upsc_cse_relevance"] = "high" if any(tag.startswith("upsc") or tag in {"prelims", "mains", "explained"} for tag in tags) else "medium"
    if item.get("ssc_relevance") not in {"high", "medium", "low"}:
        item["ssc_relevance"] = "high" if "ssc" in tags else "medium"
    for field, fallback in [
        ("title", raw_item.title),
        ("source", raw_item.source),
        ("url", raw_item.url),
        ("published_at", raw_item.published_at),
        ("source_excerpt", source_excerpt_for_item(raw_item)),
        ("memory_hook", raw_item.title[:90]),
    ]:
        if not isinstance(item.get(field), str) or not item[field].strip():
            item[field] = fallback
    if isinstance(item.get("source_excerpt"), str) and len(item["source_excerpt"]) < min(120, len(source_excerpt_for_item(raw_item))):
        item["source_excerpt"] = source_excerpt_for_item(raw_item)
    if not isinstance(item.get("exam_areas"), list) or not item["exam_areas"]:
        item["exam_areas"] = tags[:4] or [raw_item.source]
    if not isinstance(item.get("key_points"), list) or len([point for point in item.get("key_points", []) if str(point).strip()]) < 2:
        item["key_points"] = excerpt_points(raw_item, 3)
    if not isinstance(item.get("why_it_matters_for_ssc_cgl"), str) or not item["why_it_matters_for_ssc_cgl"].strip():
        item["why_it_matters_for_ssc_cgl"] = "Convert the source-grounded fact into SSC recall: institution, date, place, report, award, appointment, scheme, or exam notice."
    if not isinstance(item.get("why_it_matters_for_upsc_cse"), str) or not item["why_it_matters_for_upsc_cse"].strip():
        item["why_it_matters_for_upsc_cse"] = "Use this source-grounded update for prelims keywords and one mains-ready issue angle."
    if not isinstance(item.get("static_context"), str) or not item["static_context"].strip():
        item["static_context"] = static_context_fallback(raw_item)
    if not isinstance(item.get("prelims_facts"), list) or not item["prelims_facts"]:
        item["prelims_facts"] = excerpt_points(raw_item, 2)
    if not isinstance(item.get("mains_angles"), list) or not item["mains_angles"]:
        item["mains_angles"] = [mains_angle_fallback(raw_item)]
    if not isinstance(item.get("mcq_seed"), dict):
        item["mcq_seed"] = {}
    mcq_seed = item["mcq_seed"]
    fallback_seed = content_mcq_seed(raw_item)
    needs_mcq_fallback = is_source_name_recall_card(mcq_seed)
    if not isinstance(mcq_seed.get("question"), str) or not mcq_seed["question"].strip() or needs_mcq_fallback:
        mcq_seed["question"] = fallback_seed["question"]
    if not isinstance(mcq_seed.get("answer"), str) or not mcq_seed["answer"].strip() or needs_mcq_fallback:
        mcq_seed["answer"] = fallback_seed["answer"]
    if not isinstance(mcq_seed.get("trap"), str) or not mcq_seed["trap"].strip() or needs_mcq_fallback:
        mcq_seed["trap"] = fallback_seed["trap"]
    return trim_generated_summary_item(item)


def repair_generated_summary(payload: dict, raw_items: list[RawItem]) -> dict:
    source_lookup = {item.url: item for item in raw_items}
    items = payload.get("items")
    if isinstance(items, list):
        payload["items"] = [
            repair_generated_summary_item(item, source_lookup.get(str(item.get("url", "")).strip()))
            if isinstance(item, dict)
            else item
            for item in items
        ]
    return payload


def complete_generated_summary(payload: dict, raw_items: list[RawItem]) -> dict:
    items = payload.get("items")
    if not isinstance(items, list):
        payload["items"] = []
        items = payload["items"]
    selected = select_items_for_mistral(raw_items)
    seen_urls = {
        str(item.get("url", "")).strip()
        for item in items
        if isinstance(item, dict)
    }
    for raw_item in selected:
        if len(items) >= MISTRAL_SUMMARY_ITEM_LIMIT:
            break
        if raw_item.url in seen_urls:
            continue
        items.append(fallback_summary_item(raw_item))
        seen_urls.add(raw_item.url)
    payload["items"] = items[:MISTRAL_SUMMARY_ITEM_LIMIT]
    return payload


def call_current_affairs_llm(
    *,
    date: str,
    items: list[RawItem],
    provider_name: str,
    api_key: str | None,
    model: str,
    endpoint: str,
    prompt: str,
) -> dict | None:
    if not api_key or not items:
        return None
    payload = {
        "model": model,
        "temperature": 0.2,
        "max_tokens": MISTRAL_MAX_TOKENS,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "user", "content": prompt}],
    }
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        parsed = json.loads(content)
        if parsed.get("date") != date or not isinstance(parsed.get("items"), list):
            return None
        candidate = {
            "date": date,
            "status": "ready",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "items": parsed["items"][:MISTRAL_SUMMARY_ITEM_LIMIT],
        }
        candidate = repair_generated_summary(candidate, items)
        candidate = complete_generated_summary(candidate, items)
        accepted, reason = validate_generated_brief(candidate, items, allow_print=False)
        if not accepted:
            print(f"warning: {provider_name} summary rejected: {reason}", file=sys.stderr)
            return None
        min_items = minimum_summary_items(items)
        if len(candidate["items"]) < min_items:
            if provider_name == "Mistral":
                print(
                    f"warning: Mistral summary too thin: {len(candidate['items'])}/{min_items}; using fallback",
                    file=sys.stderr,
                )
            else:
                print(
                    f"warning: {provider_name} summary too thin: {len(candidate['items'])}/{min_items}; using fallback",
                    file=sys.stderr,
                )
            return None
        return candidate
    except Exception as exc:
        print(f"warning: {provider_name} summary failed: {exc}", file=sys.stderr)
        return None


def call_deepseek_current_affairs(date: str, items: list[RawItem]) -> dict | None:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
    return call_current_affairs_llm(
        date=date,
        items=items,
        provider_name="DeepSeek",
        api_key=api_key,
        model=model,
        endpoint=DEEPSEEK_ENDPOINT,
        prompt=build_current_affairs_llm_prompt(date, items, "DeepSeek"),
    )


def call_mistral(date: str, items: list[RawItem]) -> dict | None:
    api_key = os.environ.get("MISTRAL_API_KEY") or os.environ.get("MISTRAK_API_KEY")
    model = os.environ.get("MISTRAL_MODEL", "mistral-small-latest")
    return call_current_affairs_llm(
        date=date,
        items=items,
        provider_name="Mistral",
        api_key=api_key,
        model=model,
        endpoint=MISTRAL_ENDPOINT,
        prompt=build_mistral_prompt(date, items),
    )


def write_daily(date: str, payload: dict, root: Path | None = None) -> None:
    path = daily_path_for(date, root)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def parse_date_key(value: str) -> datetime | None:
    try:
        return datetime.strptime(value, "%Y-%m-%d")
    except Exception:
        return None


def calendar_event_from_item(item: dict) -> dict | None:
    title = str(item.get("title", "")).strip()
    source = str(item.get("source", "")).strip()
    url = str(item.get("url", "")).strip()
    if not title or not source or not url:
        return None
    key_points = item.get("key_points") if isinstance(item.get("key_points"), list) else []
    exam_areas = item.get("exam_areas") if isinstance(item.get("exam_areas"), list) else []
    return {
        "title": title[:160],
        "source": source[:80],
        "url": url,
        "published_at": str(item.get("published_at", "")).strip(),
        "ssc_relevance": item.get("ssc_relevance") if item.get("ssc_relevance") in {"high", "medium", "low"} else "low",
        "upsc_cse_relevance": item.get("upsc_cse_relevance") if item.get("upsc_cse_relevance") in {"high", "medium", "low"} else "low",
        "exam_areas": [str(area).strip() for area in exam_areas if str(area).strip()][:4],
        "brief": (str(key_points[0]).strip() if key_points else str(item.get("why_it_matters_for_ssc_cgl", "")).strip())[:220],
    }


def brief_calendar_digest(date: str, payload: dict) -> dict:
    items = payload.get("items") if isinstance(payload.get("items"), list) else []
    areas: set[str] = set()
    high_yield = 0
    sources: set[str] = set()
    events: list[dict] = []
    for item in items:
        if isinstance(item, dict):
            if item.get("ssc_relevance") == "high" or item.get("upsc_cse_relevance") == "high":
                high_yield += 1
            if isinstance(item.get("source"), str) and item["source"].strip():
                sources.add(item["source"].strip())
            if isinstance(item.get("exam_areas"), list):
                areas.update(str(area) for area in item.get("exam_areas", []) if str(area).strip())
            event = calendar_event_from_item(item)
            if event:
                events.append(event)
    events.sort(key=lambda event: str(event.get("published_at", "")))
    return {
        "date": date,
        "items": len(items),
        "high_yield": high_yield,
        "sources": sorted(sources)[:10],
        "exam_areas": sorted(areas)[:10],
        "events": events[:12],
        "headlines": [
            str(item.get("title"))
            for item in items
            if isinstance(item, dict) and str(item.get("title", "")).strip()
        ][:8],
    }


def build_calendar_context(date: str, current_brief: dict, root: Path | None = None) -> dict:
    output_root = root or data_root()
    daily_root = output_root / "daily"
    requested = parse_date_key(date)
    if requested is None:
        return {}

    daily_payloads: dict[str, dict] = {date: current_brief}
    if daily_root.exists():
        for path in daily_root.glob("*.json"):
            day = path.stem
            if not parse_date_key(day):
                continue
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if isinstance(payload, dict):
                daily_payloads[day] = payload

    def digest_for(day: str) -> dict | None:
        payload = daily_payloads.get(day)
        return brief_calendar_digest(day, payload) if isinstance(payload, dict) else None

    today = date
    yesterday = (requested - timedelta(days=1)).strftime("%Y-%m-%d")
    last_7_days = [
        (requested - timedelta(days=offset)).strftime("%Y-%m-%d")
        for offset in range(0, 7)
    ]
    last_30_days = [
        (requested - timedelta(days=offset)).strftime("%Y-%m-%d")
        for offset in range(0, 30)
    ]
    weekly_by_day = [digest for day in reversed(last_7_days) if (digest := digest_for(day))]
    monthly_by_day = [digest for day in reversed(last_30_days) if (digest := digest_for(day))]
    today_digest = digest_for(today)
    yesterday_digest = digest_for(yesterday)
    return {
        "as_of": date,
        "today": today_digest,
        "yesterday": yesterday_digest,
        "as_they_come": (today_digest or {}).get("events", []) if isinstance(today_digest, dict) else [],
        "last_7_days": weekly_by_day,
        "last_30_days": monthly_by_day,
        "weekly_by_day": weekly_by_day,
        "monthly_by_day": monthly_by_day,
        "weekly_calendar": weekly_by_day,
        "monthly_calendar": monthly_by_day,
        "week_total_items": sum(day["items"] for day in weekly_by_day),
        "week_high_yield": sum(day["high_yield"] for day in weekly_by_day),
        "month_total_items": sum(day["items"] for day in monthly_by_day),
        "month_high_yield": sum(day["high_yield"] for day in monthly_by_day),
    }


def read_state(root: Path | None = None) -> dict:
    path = state_path_for(root)
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def write_state(payload: dict, root: Path | None = None) -> None:
    path = state_path_for(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def update_run_state(date: str, items: list[RawItem], brief: dict, root: Path | None = None) -> dict:
    state = read_state(root)
    status = str(brief.get("status") or "unknown")
    summary_items = brief.get("items") if isinstance(brief.get("items"), list) else []
    source_counts = state.get("sourceCounts") if isinstance(state.get("sourceCounts"), dict) else {}
    source_counts = {str(source): int(count) for source, count in source_counts.items() if isinstance(count, int)}
    sources = sorted({item.source for item in items})

    for item in items:
        source_counts[item.source] = source_counts.get(item.source, 0) + 1

    recent_runs = state.get("recentRuns") if isinstance(state.get("recentRuns"), list) else []
    recent_runs = recent_runs[-44:] + [{
        "date": date,
        "status": status,
        "rawItems": len(items),
        "summaryItems": len(summary_items),
        "sources": sources,
        "completedAt": datetime.now(timezone.utc).isoformat(),
    }]

    total_runs = int(state.get("totalRuns", 0)) + 1 if isinstance(state.get("totalRuns", 0), int) else 1
    successful_runs = int(state.get("successfulRuns", 0)) if isinstance(state.get("successfulRuns", 0), int) else 0
    if status == "ready":
        successful_runs += 1

    next_state = {
        "firstRunDate": state.get("firstRunDate") or date,
        "lastRunDate": date,
        "lastSuccessfulDate": date if status == "ready" else state.get("lastSuccessfulDate"),
        "lastRunAt": datetime.now(timezone.utc).isoformat(),
        "totalRuns": total_runs,
        "successfulRuns": successful_runs,
        "sourceCounts": dict(sorted(source_counts.items())),
        "recentRuns": recent_runs,
    }
    write_state(next_state, root)
    return next_state


def generated_item_has_grounding(item: dict, source_lookup: dict[str, RawItem]) -> bool:
    source = source_lookup.get(str(item.get("url", "")).strip())
    if source is None:
        return False
    source_text = normalize_for_grounding(" ".join([source.title, source.source, source.raw_excerpt, *source.tags]))
    generated_values = [
        str(item.get("title", "")),
        str(item.get("why_it_matters_for_ssc_cgl", "")),
        str(item.get("why_it_matters_for_upsc_cse", "")),
        str(item.get("static_context", "")),
        str(item.get("memory_hook", "")),
    ]
    key_points = item.get("key_points")
    if isinstance(key_points, list):
        generated_values.extend(str(point) for point in key_points)
    prelims_facts = item.get("prelims_facts")
    if isinstance(prelims_facts, list):
        generated_values.extend(str(point) for point in prelims_facts)
    mains_angles = item.get("mains_angles")
    if isinstance(mains_angles, list):
        generated_values.extend(str(point) for point in mains_angles)
    mcq_seed = item.get("mcq_seed")
    if isinstance(mcq_seed, dict):
        generated_values.extend(str(mcq_seed.get(field, "")) for field in ["question", "answer", "trap"])
    generated_text = normalize_for_grounding(" ".join(generated_values))
    source_tokens = {token for token in source_text.split() if len(token) >= 5}
    matched_tokens = {token for token in generated_text.split() if token in source_tokens}
    return len(matched_tokens) >= 2


def validate_generated_brief(payload: dict, raw_items: list[RawItem], allow_print: bool = True) -> tuple[bool, str | None]:
    if payload.get("status") != "ready":
        return False, "daily status is not ready"
    items = payload.get("items")
    if not isinstance(items, list) or len(items) == 0:
        return False, "daily items is missing or empty"
    source_lookup = {item.url: item for item in raw_items}
    for index, item in enumerate(items, start=1):
        if not validate_summary_item(item, index, daily_path_for(str(payload.get("date", "unknown")))):
            return False, f"summary item {index} has invalid shape"
        if is_source_name_recall_card(item.get("mcq_seed")):
            if allow_print:
                print(f"validation failed: summary item {index} has source-name recall card", file=sys.stderr)
            return False, f"summary item {index} has source-name recall card"
        if not generated_item_has_grounding(item, source_lookup):
            if allow_print:
                print(f"validation failed: summary item {index} is not grounded in raw source excerpts", file=sys.stderr)
            return False, f"summary item {index} is not grounded in raw source excerpts"
    return True, None


def validate_summary_item(item: object, index: int, daily_path: Path) -> bool:
    if not isinstance(item, dict):
        print(f"validation failed: summary item {index} is not an object in {daily_path}", file=sys.stderr)
        return False

    required_strings = [
        "title",
        "source",
        "url",
        "published_at",
        "source_excerpt",
        "why_it_matters_for_ssc_cgl",
        "why_it_matters_for_upsc_cse",
        "static_context",
        "memory_hook",
    ]
    for field in required_strings:
        value = item.get(field)
        if not isinstance(value, str) or not value.strip():
            print(f"validation failed: summary item {index} missing {field} in {daily_path}", file=sys.stderr)
            return False
        limit = (
            MAX_SOURCE_EXCERPT_CHARS
            if field == "source_excerpt"
            else MAX_DEEP_DIVE_FIELD_CHARS
            if field in {"why_it_matters_for_upsc_cse", "static_context"}
            else MAX_SUMMARY_FIELD_CHARS
        )
        if len(value) > limit:
            print(f"validation failed: summary item {index} field {field} is too long in {daily_path}", file=sys.stderr)
            return False

    if item.get("ssc_relevance") not in {"high", "medium", "low"}:
        print(f"validation failed: summary item {index} has invalid ssc_relevance in {daily_path}", file=sys.stderr)
        return False
    if item.get("upsc_cse_relevance") not in {"high", "medium", "low"}:
        print(f"validation failed: summary item {index} has invalid upsc_cse_relevance in {daily_path}", file=sys.stderr)
        return False

    exam_areas = item.get("exam_areas")
    if not isinstance(exam_areas, list) or not exam_areas or not all(isinstance(area, str) and area.strip() for area in exam_areas):
        print(f"validation failed: summary item {index} has invalid exam_areas in {daily_path}", file=sys.stderr)
        return False

    key_points = item.get("key_points")
    if not isinstance(key_points, list) or not key_points:
        print(f"validation failed: summary item {index} has invalid key_points in {daily_path}", file=sys.stderr)
        return False
    for point in key_points:
        if not isinstance(point, str) or not point.strip() or len(point) > MAX_SUMMARY_FIELD_CHARS:
            print(f"validation failed: summary item {index} has unsafe key_points in {daily_path}", file=sys.stderr)
            return False

    for field in ["prelims_facts", "mains_angles"]:
        values = item.get(field)
        if not isinstance(values, list) or not values:
            print(f"validation failed: summary item {index} has invalid {field} in {daily_path}", file=sys.stderr)
            return False
        for value in values:
            if not isinstance(value, str) or not value.strip() or len(value) > MAX_DEEP_DIVE_FIELD_CHARS:
                print(f"validation failed: summary item {index} has unsafe {field} in {daily_path}", file=sys.stderr)
                return False

    mcq_seed = item.get("mcq_seed")
    if not isinstance(mcq_seed, dict):
        print(f"validation failed: summary item {index} has invalid mcq_seed in {daily_path}", file=sys.stderr)
        return False
    for field in ["question", "answer", "trap"]:
        value = mcq_seed.get(field)
        if not isinstance(value, str) or not value.strip() or len(value) > MAX_SUMMARY_FIELD_CHARS:
            print(f"validation failed: summary item {index} has invalid mcq_seed.{field} in {daily_path}", file=sys.stderr)
            return False

    return True


def validate_date_artifacts(date: str, root: Path | None = None) -> bool:
    raw_path = raw_path_for(date, root)
    daily_path = daily_path_for(date, root)

    if not raw_path.exists():
        print(f"validation failed: missing raw file at {raw_path}", file=sys.stderr)
        return False

    raw_items = 0
    raw_context: list[RawItem] = []
    with raw_path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            try:
                payload = json.loads(stripped)
            except Exception:
                print(
                    f"validation failed: raw file has invalid JSON on line {line_number} in {raw_path}",
                    file=sys.stderr
                )
                return False
            if not isinstance(payload, dict):
                print(
                    f"validation failed: raw file has non-object JSON on line {line_number} in {raw_path}",
                    file=sys.stderr
                )
                return False
            if len(payload) == 0:
                print(
                    f"validation failed: raw file has empty JSON object on line {line_number} in {raw_path}",
                    file=sys.stderr
                )
                return False
            if "raw_body" in payload or "body" in payload or "article_body" in payload:
                print(
                    f"validation failed: raw file contains raw_body/full article content on line {line_number} in {raw_path}",
                    file=sys.stderr
                )
                return False
            for field in ["title", "source", "url", "published_at", "fetched_at", "raw_excerpt"]:
                value = payload.get(field)
                if not isinstance(value, str) or not value.strip():
                    print(
                        f"validation failed: raw file missing {field} on line {line_number} in {raw_path}",
                        file=sys.stderr
                    )
                    return False
            if len(str(payload.get("raw_excerpt", ""))) > MAX_RAW_EXCERPT_CHARS:
                print(
                    f"validation failed: raw_excerpt is too long on line {line_number} in {raw_path}",
                    file=sys.stderr
                )
                return False
            raw_context.append(RawItem(
                title=str(payload["title"]),
                source=str(payload["source"]),
                url=str(payload["url"]),
                published_at=str(payload["published_at"]),
                fetched_at=str(payload["fetched_at"]),
                raw_excerpt=str(payload["raw_excerpt"]),
                tags=[str(tag) for tag in payload.get("tags", [])] if isinstance(payload.get("tags"), list) else [],
            ))
            raw_items += 1

    if raw_items == 0:
        print(f"validation failed: no valid raw items in {raw_path}", file=sys.stderr)
        return False

    if not daily_path.exists():
        print(f"validation failed: missing daily file at {daily_path}", file=sys.stderr)
        return False

    try:
        payload = json.loads(daily_path.read_text(encoding="utf-8"))
    except Exception:
        print(f"validation failed: daily file is not valid JSON at {daily_path}", file=sys.stderr)
        return False

    if not isinstance(payload, dict):
        print(f"validation failed: daily file payload must be an object at {daily_path}", file=sys.stderr)
        return False

    if payload.get("date") != date:
        print(
            f"validation failed: daily date {payload.get('date', '<missing>')} does not match requested date {date}",
            file=sys.stderr
        )
        return False

    accepted, reason = validate_generated_brief(payload, raw_context)
    if not accepted:
        print(f"validation failed: {reason} for {date}", file=sys.stderr)
        return False

    print(f"validated current-affairs artifacts for {date}")
    return True


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Fetch daily SSC CGL current affairs.")
    parser.add_argument("--date", default=today_key())
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--validate-date", nargs="?", const="", default=None, help="Validate generated artifacts and exit.")
    args = parser.parse_args()

    if args.validate_date is not None:
        date_to_validate = args.validate_date or args.date
        return 0 if validate_date_artifacts(date_to_validate) else 1

    output_root = data_root()
    items = discover_items()
    if not items:
        print("error: no valid current-affairs raw items discovered; refusing to write empty artifacts", file=sys.stderr)
        return 1
    study_items = filter_study_relevant_items(items)
    brief = call_deepseek_current_affairs(args.date, study_items) or call_mistral(args.date, study_items) or fallback_brief(args.date, study_items)
    brief["calendar"] = build_calendar_context(args.date, brief, output_root)
    if args.dry_run:
      print(json.dumps(brief, indent=2, ensure_ascii=False))
      return 0

    write_jsonl(args.date, items, output_root)
    write_daily(args.date, brief, output_root)
    update_run_state(args.date, items, brief, output_root)
    print(f"wrote {len(items)} raw items and {len(brief['items'])} SSC current-affairs summaries for {args.date}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
