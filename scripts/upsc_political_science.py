from __future__ import annotations

import argparse
import base64
import html
import json
import os
import re
import sys
import time
from collections import defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
import urllib3
from pypdf import PdfReader


OUTPUT_ROOT = Path("output/upsc_ncert/political_science")
DOCS_ROOT = Path("docs/upsc-cse/political-science")
UPSC_OCR_ROOT = Path("output/upsc_cse_papers/ocr")
MISTRAL_OCR_URL = "https://api.mistral.ai/v1/ocr"
DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL = "deepseek-v4-pro"
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@dataclass(frozen=True)
class NcertSource:
    id: str
    class_level: int
    book_slug: str
    book_title: str
    chapter_number: int
    title: str
    edition_policy: str
    source_name: str
    source_url: str
    source_page: str
    chapter_pdf: bool
    tags: tuple[str, ...]


def slugify(value: str) -> str:
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def ncert_pdf(name: str) -> str:
    return f"https://ncert.nic.in/textbook/pdf/{name}"


DRISHTI_POLITY_PAGE = "https://www.drishtiias.com/free-downloads/ncert-book-polity-download"
DRISHTI_CLASS9 = "https://www.drishtiias.com/images/pdf/social%20science%20demo%20part%201.pdf"
DRISHTI_CLASS10 = "https://www.drishtiias.com/images/pdf/NCERT-Class-10-Political-Science.pdf"
DRISHTI_CLASS11_THEORY = "https://www.drishtiias.com/images/pdf/NCERT-Class-11-Political-Science-Part-2-1.pdf"
DRISHTI_CLASS12_WORLD = "https://www.drishtiias.com/images/pdf/NCERT-Class-12-Political-Science-Part-1.pdf"
DRISHTI_CLASS12_INDIA = "https://www.drishtiias.com/images/pdf/NCERT-Class-12-Political-Science-Part-2.pdf"


def source_id(class_level: int, book_slug: str, chapter_number: int, title: str) -> str:
    return f"class-{class_level}-{book_slug}-{chapter_number:02d}-{slugify(title)}"


def source(
    class_level: int,
    book_slug: str,
    book_title: str,
    chapter_number: int,
    title: str,
    edition_policy: str,
    source_name: str,
    source_url: str,
    source_page: str,
    chapter_pdf: bool,
    tags: tuple[str, ...],
) -> NcertSource:
    return NcertSource(
        id=source_id(class_level, book_slug, chapter_number, title),
        class_level=class_level,
        book_slug=book_slug,
        book_title=book_title,
        chapter_number=chapter_number,
        title=title,
        edition_policy=edition_policy,
        source_name=source_name,
        source_url=source_url,
        source_page=source_page,
        chapter_pdf=chapter_pdf,
        tags=tags,
    )


NCERT_SOURCES: list[NcertSource] = [
    source(9, "democratic-politics-i", "Democratic Politics-I", 1, "What is Democracy? Why Democracy?", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS9, DRISHTI_POLITY_PAGE, False, ("democracy", "features of democracy", "political theory")),
    source(9, "democratic-politics-i", "Democratic Politics-I", 2, "Constitutional Design", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS9, DRISHTI_POLITY_PAGE, False, ("constitution", "constituent assembly", "south africa")),
    source(9, "democratic-politics-i", "Democratic Politics-I", 3, "Electoral Politics", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS9, DRISHTI_POLITY_PAGE, False, ("elections", "electoral politics", "representation")),
    source(9, "democratic-politics-i", "Democratic Politics-I", 4, "Working of Institutions", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS9, DRISHTI_POLITY_PAGE, False, ("parliament", "executive", "judiciary", "institutions")),
    source(9, "democratic-politics-i", "Democratic Politics-I", 5, "Democratic Rights", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS9, DRISHTI_POLITY_PAGE, False, ("rights", "fundamental rights", "democracy")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 1, "Power Sharing", "current-official-primary", "NCERT", ncert_pdf("jess401.pdf"), "https://ncert.nic.in/textbook.php?jess4=0-5", True, ("power sharing", "belgium", "sri lanka", "federalism")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 2, "Federalism", "current-official-primary", "NCERT", ncert_pdf("jess402.pdf"), "https://ncert.nic.in/textbook.php?jess4=0-5", True, ("federalism", "centre state", "local government")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 3, "Democracy and Diversity", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS10, DRISHTI_POLITY_PAGE, False, ("diversity", "social divisions", "democracy")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 4, "Gender, Religion and Caste", "current-official-primary", "NCERT", ncert_pdf("jess403.pdf"), "https://ncert.nic.in/textbook.php?jess4=0-5", True, ("gender", "religion", "caste", "secularism")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 5, "Popular Struggles and Movements", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS10, DRISHTI_POLITY_PAGE, False, ("movements", "pressure groups", "civil society")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 6, "Political Parties", "current-official-primary", "NCERT", ncert_pdf("jess404.pdf"), "https://ncert.nic.in/textbook.php?jess4=0-5", True, ("political parties", "party system", "election")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 7, "Outcomes of Democracy", "current-official-primary", "NCERT", ncert_pdf("jess405.pdf"), "https://ncert.nic.in/textbook.php?jess4=0-5", True, ("democracy", "accountability", "development", "inequality")),
    source(10, "democratic-politics-ii", "Democratic Politics-II", 8, "Challenges to Democracy", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS10, DRISHTI_POLITY_PAGE, False, ("democratic reforms", "challenges", "political reform")),
    source(11, "political-theory", "Political Theory", 1, "Political Theory: An Introduction", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS11_THEORY, DRISHTI_POLITY_PAGE, False, ("political theory", "politics", "ideas")),
    source(11, "political-theory", "Political Theory", 2, "Freedom", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS11_THEORY, DRISHTI_POLITY_PAGE, False, ("freedom", "liberty", "harm principle")),
    source(11, "political-theory", "Political Theory", 3, "Equality", "current-official-primary", "NCERT", ncert_pdf("keps101.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("equality", "affirmative action", "social justice")),
    source(11, "political-theory", "Political Theory", 4, "Social Justice", "current-official-primary", "NCERT", ncert_pdf("keps103.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("social justice", "distribution", "rawls")),
    source(11, "political-theory", "Political Theory", 5, "Rights", "current-official-primary", "NCERT", ncert_pdf("keps104.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("rights", "human rights", "fundamental rights")),
    source(11, "political-theory", "Political Theory", 6, "Citizenship", "current-official-primary", "NCERT", ncert_pdf("keps105.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("citizenship", "nation", "rights")),
    source(11, "political-theory", "Political Theory", 7, "Nationalism", "current-official-primary", "NCERT", ncert_pdf("keps106.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("nationalism", "nation", "self determination")),
    source(11, "political-theory", "Political Theory", 8, "Secularism", "current-official-primary", "NCERT", ncert_pdf("keps108.pdf"), "https://ncert.nic.in/textbook.php?keps1=0-8", True, ("secularism", "religion", "state")),
    source(11, "political-theory", "Political Theory", 9, "Peace", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS11_THEORY, DRISHTI_POLITY_PAGE, False, ("peace", "violence", "conflict")),
    source(11, "political-theory", "Political Theory", 10, "Development", "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS11_THEORY, DRISHTI_POLITY_PAGE, False, ("development", "environment", "displacement")),
]

for chapter_number, title, tags in [
    (1, "Constitution: Why and How?", ("constitution", "making of constitution", "constituent assembly")),
    (2, "Rights in the Indian Constitution", ("fundamental rights", "directive principles", "constitution")),
    (3, "Election and Representation", ("election", "representation", "electoral system")),
    (4, "Executive", ("executive", "president", "prime minister", "council of ministers")),
    (5, "Legislature", ("parliament", "legislature", "law making")),
    (6, "Judiciary", ("judiciary", "supreme court", "judicial review")),
    (7, "Federalism", ("federalism", "centre state", "constitution")),
    (8, "Local Governments", ("local government", "panchayati raj", "municipalities")),
    (9, "Constitution as a Living Document", ("constitutional amendment", "basic structure", "living constitution")),
    (10, "The Philosophy of the Constitution", ("constitutional philosophy", "liberty", "equality", "justice")),
]:
    NCERT_SOURCES.append(source(11, "indian-constitution-at-work", "Indian Constitution at Work", chapter_number, title, "current-official-primary", "NCERT", ncert_pdf(f"keps2{chapter_number:02d}.pdf"), "https://ncert.nic.in/textbook.php?keps2=0-10", True, tags))

for chapter_number, title, tags in [
    (1, "The Cold War Era", ("cold war", "non alignment", "bipolarity")),
    (2, "The End of Bipolarity", ("end of bipolarity", "soviet union", "post cold war")),
    (3, "US Hegemony in World Politics", ("us hegemony", "world politics", "unipolarity")),
    (4, "Alternative Centres of Power", ("european union", "asean", "china", "centres of power")),
    (5, "Contemporary South Asia", ("south asia", "saarc", "neighbourhood")),
    (6, "International Organisations", ("united nations", "international organisations", "security council")),
    (7, "Security in the Contemporary World", ("security", "human security", "terrorism")),
    (8, "Environment and Natural Resources", ("environment", "climate", "resources")),
    (9, "Globalisation", ("globalisation", "world economy", "culture")),
]:
    NCERT_SOURCES.append(source(12, "contemporary-world-politics", "Contemporary World Politics", chapter_number, title, "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS12_WORLD, DRISHTI_POLITY_PAGE, False, tags))

for chapter_number, title, tags in [
    (1, "Challenges of Nation Building", ("nation building", "partition", "integration")),
    (2, "Era of One Party Dominance", ("congress system", "one party dominance", "elections")),
    (3, "Politics of Planned Development", ("planning", "development", "five year plans")),
    (4, "India's External Relations", ("foreign policy", "non alignment", "external relations")),
    (5, "Challenges to and Restoration of the Congress System", ("congress system", "coalition", "political change")),
    (6, "The Crisis of Democratic Order", ("emergency", "democratic order", "civil liberties")),
    (7, "Rise of Popular Movements", ("popular movements", "farmers movement", "civil society")),
    (8, "Regional Aspirations", ("regional aspirations", "federalism", "identity")),
    (9, "Recent Developments in Indian Politics", ("coalition politics", "mandal", "liberalisation", "ayodhya")),
]:
    NCERT_SOURCES.append(source(12, "politics-in-india-since-independence", "Politics in India since Independence", chapter_number, title, "supplemental-old-upsc-complete", "Drishti IAS", DRISHTI_CLASS12_INDIA, DRISHTI_POLITY_PAGE, False, tags))


def raw_pdf_path(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> Path:
    parsed = Path(urlparse(source.source_url).path)
    suffix = parsed.suffix or ".pdf"
    if source.chapter_pdf:
        name = f"{source.id}{suffix}"
    else:
        name = f"class-{source.class_level}-{source.book_slug}-source{suffix}"
    return output_root / "raw" / f"class-{source.class_level}" / source.book_slug / name


def ocr_json_path(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> Path:
    stem = raw_pdf_path(source, output_root).stem
    return output_root / "ocr" / f"class-{source.class_level}" / source.book_slug / f"{stem}.json"


def generated_json_path(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> Path:
    return output_root / "generated" / f"class-{source.class_level}" / source.book_slug / f"{source.id}.json"


def image_dir(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> Path:
    return output_root / "images" / f"class-{source.class_level}" / source.book_slug / raw_pdf_path(source, output_root).stem


def doc_path(source: NcertSource, docs_root: Path = DOCS_ROOT) -> Path:
    return docs_root / f"class-{source.class_level}" / source.book_slug / f"{source.chapter_number:02d}-{slugify(source.title)}.md"


def book_index_path(class_level: int, book_slug: str, docs_root: Path = DOCS_ROOT) -> Path:
    return docs_root / f"class-{class_level}" / book_slug / "index.md"


def build_manifest(output_root: Path = OUTPUT_ROOT, docs_root: Path = DOCS_ROOT) -> dict[str, Any]:
    return {
        "subject": "Political Science / Polity",
        "section": "UPSC CSE",
        "source_count": len(NCERT_SOURCES),
        "sources": [
            {
                **asdict(source),
                "raw_pdf_path": str(raw_pdf_path(source, output_root)),
                "ocr_json_path": str(ocr_json_path(source, output_root)),
                "image_dir": str(image_dir(source, output_root)),
                "generated_json_path": str(generated_json_path(source, output_root)),
                "doc_path": str(doc_path(source, docs_root)),
            }
            for source in NCERT_SOURCES
        ],
    }


def write_manifest(output_root: Path = OUTPUT_ROOT, docs_root: Path = DOCS_ROOT) -> Path:
    output_root.mkdir(parents=True, exist_ok=True)
    manifest_path = output_root / "manifest.json"
    manifest_path.write_text(json.dumps(build_manifest(output_root, docs_root), indent=2, ensure_ascii=False), encoding="utf-8")
    return manifest_path


def download_sources(force: bool = False, output_root: Path = OUTPUT_ROOT) -> None:
    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 UPSC NCERT collector"})
    seen: set[str] = set()
    for source in NCERT_SOURCES:
        path = raw_pdf_path(source, output_root)
        if str(path) in seen:
            continue
        seen.add(str(path))
        if path.exists() and path.stat().st_size > 0 and not force:
            print(f"skip download {path}")
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(path.suffix + ".part")
        response = None
        for attempt in range(1, 6):
            try:
                response = session.get(
                    source.source_url,
                    stream=True,
                    timeout=180,
                    verify="ncert.nic.in" not in urlparse(source.source_url).netloc,
                )
                response.raise_for_status()
                break
            except requests.RequestException:
                if attempt == 5:
                    raise
                time.sleep(min(30, 2**attempt))
        assert response is not None
        with tmp.open("wb") as handle:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    handle.write(chunk)
        tmp.replace(path)
        print(f"downloaded {path}")


def decode_data_uri(data_uri: str) -> tuple[bytes, str]:
    header, data = data_uri.split(",", 1) if "," in data_uri else ("", data_uri)
    mime = "image/png"
    match = re.search(r"data:([^;]+)", header)
    if match:
        mime = match.group(1).lower()
    ext = {"image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp"}.get(mime, "bin")
    return base64.b64decode(data), ext


def call_mistral_ocr(pdf_path: Path, api_key: str) -> dict[str, Any]:
    encoded = base64.b64encode(pdf_path.read_bytes()).decode("ascii")
    payload = {
        "model": "mistral-ocr-latest",
        "document": {"type": "document_url", "document_url": f"data:application/pdf;base64,{encoded}"},
        "include_image_base64": True,
        "image_min_size": 0,
        "table_format": "markdown",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    for attempt in range(1, 6):
        response = requests.post(MISTRAL_OCR_URL, headers=headers, json=payload, timeout=360)
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 5:
            time.sleep(min(60, 2**attempt))
            continue
        response.raise_for_status()
        return response.json()
    raise RuntimeError("Mistral OCR did not return after retries")


def ocr_sources(force: bool = False, output_root: Path = OUTPUT_ROOT) -> None:
    api_key = os.environ.get("MISTRAL_API_KEY") or os.environ.get("MISTRAL_API_KEY_2")
    if not api_key:
        raise RuntimeError("Set MISTRAL_API_KEY or MISTRAL_API_KEY_2 before running --ocr.")
    seen: set[Path] = set()
    for source in NCERT_SOURCES:
        pdf = raw_pdf_path(source, output_root)
        out = ocr_json_path(source, output_root)
        if out in seen:
            continue
        seen.add(out)
        if out.exists() and out.stat().st_size > 0 and not force:
            print(f"skip ocr {out}")
            continue
        raw = call_mistral_ocr(pdf, api_key)
        pages = raw.get("pages") or []
        img_dir = image_dir(source, output_root)
        img_dir.mkdir(parents=True, exist_ok=True)
        saved_images = []
        normalized_pages = []
        for page_index, page in enumerate(pages):
            page_dict = page if isinstance(page, dict) else dict(page)
            page_dict.setdefault("index", page_index)
            page_images = []
            for img_index, image in enumerate(page_dict.get("images") or []):
                image_copy = {k: v for k, v in image.items() if k != "image_base64"}
                image_data = image.get("image_base64")
                if image_data:
                    data, ext = decode_data_uri(image_data)
                    img_path = img_dir / f"p{page_dict['index']}-img-{img_index}.{ext}"
                    img_path.write_bytes(data)
                    image_copy["path"] = str(img_path)
                    saved_images.append(image_copy)
                page_images.append(image_copy)
            page_dict["images"] = page_images
            normalized_pages.append(page_dict)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({"pages": normalized_pages, "images": saved_images}, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"ocr {out}")


def extract_pdf_pages(pdf_path: Path) -> list[str]:
    reader = PdfReader(str(pdf_path))
    return [page.extract_text() or "" for page in reader.pages]


def normalize_for_match(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def title_tokens(value: str) -> set[str]:
    stop = {"and", "or", "the", "of", "in", "to", "a", "an", "as", "since", "at", "with", "why", "how"}
    return {token for token in normalize_for_match(value).split() if len(token) > 2 and token not in stop}


def split_chapter_text(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> str:
    pages = extract_pdf_pages(raw_pdf_path(source, output_root))
    if source.chapter_pdf:
        return "\n\n".join(pages)

    siblings = [s for s in NCERT_SOURCES if s.source_url == source.source_url and not s.chapter_pdf]
    sibling_starts: dict[str, int] = {}
    for sibling in siblings:
        tokens = title_tokens(sibling.title)
        best_page = 0
        best_score = -1
        for index, text in enumerate(pages):
            if index < 2:
                continue
            normalized = normalize_for_match(text)
            score = sum(1 for token in tokens if token in normalized)
            if normalize_for_match(sibling.title) in normalized:
                score += 10
            if score > best_score:
                best_score = score
                best_page = index
        sibling_starts[sibling.id] = best_page

    ordered = sorted((start, sibling.chapter_number, sibling.id) for sibling in siblings for start in [sibling_starts[sibling.id]])
    start = sibling_starts.get(source.id, 0)
    later = [page for page, _num, sid in ordered if page > start]
    end = later[0] if later else len(pages)
    if end <= start:
        end = min(len(pages), start + 12)
    return "\n\n".join(pages[start:end])


def load_ocr_markdown(source: NcertSource, output_root: Path = OUTPUT_ROOT) -> str:
    path = ocr_json_path(source, output_root)
    if not path.exists():
        return ""
    data = json.loads(path.read_text(encoding="utf-8"))
    return "\n\n".join(page.get("markdown", "") for page in data.get("pages") or [])


def question_corpus(limit_files: int | None = None) -> list[dict[str, Any]]:
    corpus = []
    files = sorted(UPSC_OCR_ROOT.rglob("*.json"))
    if limit_files:
        files = files[:limit_files]
    for path in files:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        metadata = data.get("metadata", {})
        for question in data.get("questions") or []:
            text = question.get("text") or ""
            if len(text) < 20:
                continue
            corpus.append(
                {
                    "year": metadata.get("year"),
                    "stage": metadata.get("exam_stage"),
                    "paper_title": metadata.get("paper_title"),
                    "source_id": metadata.get("id"),
                    "number": question.get("number"),
                    "type": question.get("type"),
                    "text": text,
                    "options": question.get("options") or [],
                }
            )
    return corpus


def score_question(source: NcertSource, question: dict[str, Any]) -> int:
    haystack = normalize_for_match(" ".join([question.get("text", ""), question.get("paper_title", "")]))
    score = 0
    for tag in source.tags:
        tag_norm = normalize_for_match(tag)
        if tag_norm and tag_norm in haystack:
            score += 8
        score += sum(2 for token in title_tokens(tag) if token in haystack)
    score += sum(2 for token in title_tokens(source.title) if token in haystack)
    if "political" in normalize_for_match(question.get("paper_title", "")):
        score += 4
    if "general studies" in normalize_for_match(question.get("paper_title", "")):
        score += 2
    return score


def retrieve_pyqs(source: NcertSource, corpus: list[dict[str, Any]], prelims_count: int = 12, mains_count: int = 5) -> dict[str, list[dict[str, Any]]]:
    ranked = sorted(((score_question(source, q), q) for q in corpus), key=lambda item: item[0], reverse=True)
    prelims = []
    mains = []
    seen = set()
    for score, question in ranked:
        if score <= 0:
            continue
        key = (question.get("stage"), question.get("source_id"), question.get("number"), question.get("text")[:80])
        if key in seen:
            continue
        seen.add(key)
        if question.get("stage") == "prelims" and question.get("options") and len(prelims) < prelims_count:
            prelims.append(question)
        elif question.get("stage") == "mains" and len(mains) < mains_count:
            mains.append(question)
        if len(prelims) >= prelims_count and len(mains) >= mains_count:
            break
    return {"prelims": prelims, "mains": mains}


def fallback_generated_content(source: NcertSource, chapter_text: str, pyqs: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
    clean = re.sub(r"\s+", " ", chapter_text).strip()
    sentences = re.split(r"(?<=[.!?])\s+", clean)
    summary = " ".join(sentences[:4])[:900] or f"{source.title} introduces core Political Science concepts for UPSC CSE."
    concepts = list(source.tags[:6])
    if len(concepts) < 4:
        concepts.extend(list(title_tokens(source.title))[: 4 - len(concepts)])
    prelims = []
    for index, question in enumerate(pyqs["prelims"][:12], start=1):
        options = question.get("options") or []
        answer = options[0]["label"] if options else "a"
        prelims.append(
            {
                "tag": f"UPSC Prelims {question.get('year') or ''}".strip(),
                "source": f"{question.get('year')} {question.get('paper_title')} Q{question.get('number')}",
                "question": question["text"],
                "options": options[:4],
                "answer": answer,
                "explanation": "AI-generated study aid: use the NCERT concept above to verify the option against the official source text and revise the surrounding topic.",
            }
        )
    mains = [
        {
            "tag": f"UPSC Mains {question.get('year') or ''}".strip(),
            "source": f"{question.get('year')} {question.get('paper_title')} Q{question.get('number')}",
            "prompt": question["text"],
            "outline": "AI-generated study aid: define the core concept, connect it to constitutional or democratic principles, add one Indian example, and close with a balanced reform-oriented line.",
        }
        for question in pyqs["mains"][:5]
    ]
    return {
        "generation": {
            "provider": "local-fallback",
            "model": "local-fallback",
            "note": "Generated without DeepSeek because remote JSON generation was unavailable or invalid.",
        },
        "summary": summary,
        "key_concepts": concepts[:8],
        "upsc_relevance": f"This chapter builds the NCERT base for questions around {', '.join(source.tags[:4])}.",
        "topic_notes": [
            {"heading": "Core NCERT Argument", "body": summary},
            {"heading": "UPSC Lens", "body": f"Track definitions, institutions, examples, and constitutional vocabulary linked to {source.title}."},
            {"heading": "Revision Hooks", "body": "Convert every concept into: definition, constitutional basis, example, limitation, and reform point."},
        ],
        "expansion_drills": derived_expansion_drills(source, {"key_concepts": concepts[:8]}),
        "prelims": prelims,
        "mains": mains,
    }


def parse_json_object(content: str) -> dict[str, Any]:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        return json.loads(content[start : end + 1])


def is_fallback_content(content: dict[str, Any]) -> bool:
    generation = content.get("generation") or {}
    if generation.get("provider") == "local-fallback":
        return True
    headings = {str(note.get("heading", "")) for note in content.get("topic_notes") or [] if isinstance(note, dict)}
    return {"Core NCERT Argument", "Revision Hooks"}.issubset(headings)


def ensure_generation_metadata(content: dict[str, Any], provider: str, model: str) -> dict[str, Any]:
    content["generation"] = {
        "provider": provider,
        "model": model,
        "note": "Prelims explanations and Mains outlines are AI-generated study aids, not official UPSC keys.",
    }
    return content


def has_valid_prelim(item: dict[str, Any]) -> bool:
    return bool(
        str(item.get("question") or "").strip()
        and str(item.get("answer") or "").strip()
        and len(item.get("options") or []) >= 2
    )


def pyq_to_prelim(question: dict[str, Any]) -> dict[str, Any]:
    options = question.get("options") or []
    answer = options[0]["label"] if options else "a"
    return {
        "tag": f"UPSC Prelims {question.get('year') or ''}".strip(),
        "source": f"{question.get('year')} {question.get('paper_title')} Q{question.get('number')}",
        "question": question.get("text", ""),
        "options": options[:4],
        "answer": answer,
        "explanation": "AI-generated study aid: revise the linked NCERT concept and verify the final key against official UPSC answer keys.",
    }


def pyq_to_mains(question: dict[str, Any]) -> dict[str, Any]:
    return {
        "tag": f"UPSC Mains {question.get('year') or ''}".strip(),
        "source": f"{question.get('year')} {question.get('paper_title')} Q{question.get('number')}",
        "prompt": question.get("text", ""),
        "outline": "AI-generated study aid: define the core concept, connect it to constitutional or political principles, add one Indian example, and close with a balanced reform-oriented line.",
    }


def list_items(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    items = []
    for item in value:
        if isinstance(item, str) and item.strip():
            items.append(item.strip())
        elif isinstance(item, dict):
            text = item.get("text") or item.get("body") or item.get("point") or item.get("heading")
            if str(text or "").strip():
                items.append(str(text).strip())
    return items


def word_count(value: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", value))


def source_terms(source: NcertSource, content: dict[str, Any], limit: int = 8) -> list[str]:
    terms: list[str] = []
    for value in [*source.tags, *(content.get("key_concepts") or []), *title_tokens(source.title)]:
        term = str(value).strip()
        if term and term.lower() not in {existing.lower() for existing in terms}:
            terms.append(term)
        if len(terms) >= limit:
            break
    return terms


def derived_exam_orientation(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 4)
    term_text = ", ".join(terms) if terms else source.title
    return list_items(content.get("exam_orientation")) or [
        f"Prelims: fix the exact NCERT vocabulary around {term_text}; expect statement-based traps that alter scope, sequence, or institutional roles.",
        f"General Studies II: use the chapter to frame Constitution, governance, democracy, polity, rights, institutions, and social-justice arguments where relevant.",
        f"Essay and interview: convert the chapter's central tension into balanced language: principle, institution, citizen impact, limitation, and reform direction.",
    ]


def derived_high_yield_facts(source: NcertSource, content: dict[str, Any]) -> list[str]:
    existing = list_items(content.get("high_yield_facts"))
    if existing:
        return existing
    facts = [
        f"Source anchor: Class {source.class_level} {source.book_title}, Chapter {source.chapter_number}, {source.title}.",
        f"Edition policy: {source.edition_policy}; revise from the linked source before relying on exact wording in the exam hall.",
    ]
    for term in source_terms(source, content, 6):
        facts.append(f"Keep a one-line definition, NCERT example, and constitutional or political linkage ready for {term}.")
    return facts


def derived_prelims_traps(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 4)
    return list_items(content.get("prelims_traps")) or [
        "Do not treat NCERT examples as exhaustive lists.",
        "Watch qualifiers such as only, always, never, directly, indirectly, constitutional, statutory, formal, and informal.",
        f"Separate the broad idea of {terms[0] if terms else source.title} from adjacent terms; UPSC often swaps related concepts.",
        "When a statement sounds familiar, check whether it matches the NCERT claim or merely uses NCERT vocabulary.",
    ]


def derived_mains_framing(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 5)
    term_text = ", ".join(terms[:3]) if terms else source.title
    return list_items(content.get("mains_framing")) or [
        f"Opening: define the demand using NCERT language from {source.title}, then state why it matters for Indian democracy or governance.",
        f"Body: organise points around {term_text}; add one institution, one citizen-impact angle, and one limitation.",
        "Conclusion: avoid a slogan; close with a constitutional, democratic, or reform-oriented balancing line.",
    ]


def derived_answer_frameworks(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 6)
    lead = terms[0] if terms else source.title
    dimensions = ", ".join(terms[1:4]) if len(terms) > 1 else source.title
    return list_items(content.get("answer_frameworks")) or [
        f"Use when the question asks you to define {lead}: definition, source anchor from Class {source.class_level} {source.book_title}, NCERT example, limitation, and balanced way forward.",
        f"Dimensions to cover: institutional design, citizen impact, democratic accountability, and the link with {dimensions}.",
        f"Contrast frame: distinguish {lead} from adjacent ideas and show the consequence of confusing them in Prelims statements or Mains arguments.",
        "Practice conversion: turn one Prelims trap into a 150-word Mains paragraph with introduction, three analytical points, and a reform-oriented close.",
    ]


def derived_current_affairs_bridge(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 5)
    return list_items(content.get("current_affairs_bridge")) or [
        f"Use news only as an illustration of the static concept: map any report to {', '.join(terms[:3]) if terms else source.title} before writing it in notes.",
        "Record the institution involved, constitutional or political principle, affected group, and policy trade-off without inventing a current fact.",
        "Keep current examples replaceable; the NCERT concept should survive even when the news cycle changes.",
    ]


def derived_revision_ladder(source: NcertSource, content: dict[str, Any]) -> list[str]:
    terms = source_terms(source, content, 5)
    concept_text = ", ".join(terms[:3]) if terms else source.title
    return list_items(content.get("revision_ladder")) or [
        f"Explain the chapter title in two sentences: {source.title}.",
        f"Define and differentiate: {concept_text}.",
        "Attach one NCERT example and one Indian polity or governance linkage to each key concept.",
        "Attempt the Prelims drill without notes, then rewrite every wrong answer as a trap statement.",
        "Write one 150-word Mains answer using definition, dimensions, example, limitation, and way forward.",
    ]


def expansion_drill_items(value: Any) -> list[dict[str, str]]:
    if not isinstance(value, list):
        return []
    drills: list[dict[str, str]] = []
    for item in value:
        if not isinstance(item, dict):
            continue
        heading = str(item.get("heading") or "").strip()
        body = str(item.get("body") or item.get("text") or item.get("point") or "").strip()
        if heading and body:
            drills.append({"heading": heading, "body": body})
    return drills


def derived_expansion_drills(source: NcertSource, content: dict[str, Any]) -> list[dict[str, str]]:
    existing = expansion_drill_items(content.get("expansion_drills"))
    if existing:
        return existing
    terms = source_terms(source, content, 6)
    lead = terms[0] if terms else source.title
    support_terms = ", ".join(terms[1:4]) if len(terms) > 1 else source.book_title
    return [
        {
            "heading": "Mains Answer Scaffold",
            "body": (
                f"For {source.title}, build a 150-250 word answer as: one-line definition of {lead}, NCERT source anchor from "
                f"Class {source.class_level} {source.book_title}, two analytical dimensions linked to {support_terms}, one limitation, "
                "and a balanced constitutional or democratic way forward."
            ),
        },
        {
            "heading": "Prelims Trap Check",
            "body": (
                f"Turn each familiar phrase about {lead} into a true-or-false statement. Test scope words such as only, always, never, "
                "formal, informal, constitutional, statutory, direct, and indirect before accepting the option."
            ),
        },
        {
            "heading": "Key Term Anchors",
            "body": (
                f"Prepare one precise NCERT-style definition, one chapter example, and one Indian polity or governance linkage for: "
                f"{', '.join(terms[:5]) if terms else source.title}."
            ),
        },
        {
            "heading": "Comparison Prompt",
            "body": (
                f"Compare {lead} with the nearest related concept in the chapter by basis, institution involved, citizen impact, "
                "and limitation. This prevents using adjacent terms as synonyms in Prelims or Mains."
            ),
        },
        {
            "heading": "Weakness Repair Drill",
            "body": (
                "After every wrong quiz or weak Mains outline, label the error as definition, scope, example, institution, chronology, "
                "or conclusion; then rewrite the corrected point as one exam-ready sentence."
            ),
        },
    ]


def repair_generated_content(content: dict[str, Any], source: NcertSource, pyqs: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
    content["prelims"] = [item for item in content.get("prelims") or [] if isinstance(item, dict) and has_valid_prelim(item)]
    if not content["prelims"]:
        content["prelims"] = [pyq_to_prelim(question) for question in pyqs["prelims"][:12] if question.get("options")]
    if not content.get("mains"):
        content["mains"] = [pyq_to_mains(question) for question in pyqs["mains"][:5]]
    content["exam_orientation"] = derived_exam_orientation(source, content)
    content["high_yield_facts"] = derived_high_yield_facts(source, content)
    content["prelims_traps"] = derived_prelims_traps(source, content)
    content["mains_framing"] = derived_mains_framing(source, content)
    content["answer_frameworks"] = derived_answer_frameworks(source, content)
    content["current_affairs_bridge"] = derived_current_affairs_bridge(source, content)
    content["revision_ladder"] = derived_revision_ladder(source, content)
    content["expansion_drills"] = derived_expansion_drills(source, content)
    content["metadata"] = asdict(source)
    return content


def call_deepseek(source: NcertSource, chapter_text: str, pyqs: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Set DEEPSEEK_API_KEY before running --generate.")
    compact_pyqs = {
        "prelims": pyqs["prelims"][:12],
        "mains": pyqs["mains"][:5],
    }
    prompt = {
        "task": "Create UPSC CSE mastery notes from this Political Science NCERT chapter.",
        "chapter": asdict(source),
        "requirements": [
            "Return strict JSON only.",
            "Write concise but complete NCERT notes for mastery.",
            "Use the provided UPSC PYQs; keep source/year tags.",
            "For Prelims, choose the best answer and provide a concise explanation marked as an AI-generated study aid.",
            "For Mains, provide an answer-writing outline, not a full model answer.",
        ],
        "json_schema": {
            "summary": "string",
            "key_concepts": ["string"],
            "upsc_relevance": "string",
            "topic_notes": [{"heading": "string", "body": "string"}],
            "expansion_drills": [{"heading": "Mains Answer Scaffold|Prelims Trap Check|Key Term Anchors|Comparison Prompt|Weakness Repair Drill", "body": "string grounded in chapter metadata and NCERT text"}],
            "prelims": [{"tag": "string", "source": "string", "question": "string", "options": [{"label": "a", "text": "string"}], "answer": "a", "explanation": "string"}],
            "mains": [{"tag": "string", "source": "string", "prompt": "string", "outline": "string"}],
        },
        "chapter_text": chapter_text[:28000],
        "retrieved_pyqs": compact_pyqs,
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": "You are building UPSC CSE Political Science NCERT mastery notes. Output one complete valid JSON object only. Do not use Markdown fences."},
            {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)},
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 10000,
        "temperature": 0.1,
    }
    last_error: Exception | None = None
    for attempt in range(2):
        response = requests.post(DEEPSEEK_CHAT_URL, headers=headers, json=payload, timeout=300)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        try:
            return ensure_generation_metadata(parse_json_object(content), "deepseek", DEEPSEEK_MODEL)
        except Exception as exc:
            last_error = exc
            payload["messages"][0]["content"] = (
                "You are building UPSC CSE Political Science NCERT mastery notes. "
                "Your previous response was not parseable JSON. Return one shorter, complete, valid JSON object only."
            )
            payload["max_tokens"] = 12000
            payload["temperature"] = 0
            if attempt == 0:
                time.sleep(2)
    raise RuntimeError(f"DeepSeek returned invalid JSON after retry: {last_error}")


def generate_content(force: bool = False, output_root: Path = OUTPUT_ROOT, use_deepseek: bool = True, retry_fallback: bool = False) -> None:
    corpus = question_corpus()
    for source in NCERT_SOURCES:
        out = generated_json_path(source, output_root)
        if out.exists() and out.stat().st_size > 0 and not force:
            existing = json.loads(out.read_text(encoding="utf-8"))
            pyqs = retrieve_pyqs(source, corpus)
            if "generation" not in existing:
                provider = "local-fallback" if is_fallback_content(existing) else "deepseek"
                model = "local-fallback" if provider == "local-fallback" else DEEPSEEK_MODEL
                ensure_generation_metadata(existing, provider, model)
                if "metadata" not in existing:
                    existing["metadata"] = asdict(source)
            repair_generated_content(existing, source, pyqs)
            out.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
            if not retry_fallback or not is_fallback_content(existing):
                print(f"skip generated {out}")
                continue
        chapter_text = split_chapter_text(source, output_root)
        pyqs = retrieve_pyqs(source, corpus)
        if use_deepseek:
            try:
                content = call_deepseek(source, chapter_text, pyqs)
            except Exception as exc:
                print(f"DeepSeek failed for {source.id}: {exc}", file=sys.stderr)
                content = fallback_generated_content(source, chapter_text, pyqs)
        else:
            content = fallback_generated_content(source, chapter_text, pyqs)
            ensure_generation_metadata(content, "local-fallback", "local-fallback")
        repair_generated_content(content, source, pyqs)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(content, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"generated {out}")


def build_quiz_block(
    number: int,
    tag: str,
    question: str,
    options: list[dict[str, str]],
    answer: str,
    explanation: str,
) -> str:
    answer = (answer or "a").strip().lower()[:1]
    lines = [
        f'<div class="quiz-block mcq arithmatex" data-answer="{html.escape(answer)}">',
        '<div class="quiz-meta">',
        f'<span class="quiz-num">Q{number}</span>',
        f'<span class="quiz-tag">{html.escape(tag)}</span>',
        '<span class="quiz-type">MCQ</span>',
        "</div>",
        f'<p class="quiz-q">{html.escape(question)}</p>',
        '<div class="quiz-options">',
    ]
    for option in options[:4]:
        label = (option.get("label") or "").strip().lower()[:1]
        text = option.get("text") or ""
        if not label:
            continue
        lines.append(f'<label data-opt="{html.escape(label)}"><span class="opt-key">{html.escape(label.upper())}</span><span class="opt-text">{html.escape(text)}</span></label>')
    lines.extend(
        [
            "</div>",
            '<details class="quiz-exp"><summary>Show Answer</summary>',
            f'<div class="quiz-exp-body"><strong>Answer: {html.escape(answer.upper())}.</strong> AI-generated study aid: {html.escape(explanation)}</div>',
            "</details>",
            "</div>",
        ]
    )
    return "\n".join(lines)


def page_frontmatter(title: str, sidebar_position: int, slug: str | None = None) -> str:
    lines = ["---", f"title: {json.dumps(title, ensure_ascii=False)}", f"sidebar_position: {sidebar_position}"]
    if slug:
        lines.append(f"slug: {slug}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def render_chapter_page(source: NcertSource, content: dict[str, Any]) -> str:
    parts = [page_frontmatter(source.title, source.chapter_number)]
    parts.append(f"# {source.title}\n")
    parts.append(f"**Class {source.class_level} - {source.book_title}**  \n")
    parts.append(f"**Source policy:** {source.edition_policy}  \n")
    parts.append("**Answer note:** Prelims explanations and Mains outlines are AI-generated study aids; verify against official UPSC keys and the NCERT source.\n")
    parts.append("## Exam Orientation\n")
    for point in derived_exam_orientation(source, content):
        parts.append(f"- {point}")
    parts.append("")
    parts.append("## Master Summary\n")
    parts.append(str(content.get("summary", "")).strip() + "\n")
    parts.append("## Key Concepts\n")
    for concept in content.get("key_concepts") or []:
        parts.append(f"- {concept}")
    parts.append("\n## UPSC Relevance\n")
    parts.append(str(content.get("upsc_relevance", "")).strip() + "\n")
    parts.append("## High-Yield Facts\n")
    for fact in derived_high_yield_facts(source, content):
        parts.append(f"- {fact}")
    parts.append("")
    parts.append("## Topic Notes\n")
    for note in content.get("topic_notes") or []:
        parts.append(f"### {note.get('heading', 'Topic')}\n")
        parts.append(str(note.get("body", "")).strip() + "\n")
    parts.append("## Prelims Traps\n")
    for trap in derived_prelims_traps(source, content):
        parts.append(f"- {trap}")
    parts.append("")
    parts.append("\n## Mains Framing\n")
    for frame in derived_mains_framing(source, content):
        parts.append(f"- {frame}")
    parts.append("")
    parts.append("\n## Answer Framework Bank\n")
    for framework in derived_answer_frameworks(source, content):
        parts.append(f"- {framework}")
    parts.append("")
    parts.append("\n## UPSC Expansion Drills\n")
    for drill in derived_expansion_drills(source, content):
        parts.append(f"### {drill['heading']}\n")
        parts.append(f"{drill['body']}\n")
    parts.append("\n## Current-Affairs Bridge\n")
    for bridge in derived_current_affairs_bridge(source, content):
        parts.append(f"- {bridge}")
    parts.append("")
    parts.append("\n## Revision Ladder\n")
    for item in derived_revision_ladder(source, content):
        parts.append(f"- [ ] {item}")
    parts.append("")
    parts.append("## Prelims Drill\n")
    prelims = content.get("prelims") or []
    for idx, question in enumerate(prelims, start=1):
        parts.append(build_quiz_block(idx, question.get("tag", "UPSC Prelims"), question.get("question", ""), question.get("options") or [], question.get("answer", "a"), question.get("explanation", "")))
    parts.append("")
    parts.append("## Mains Answer Practice\n")
    for idx, item in enumerate(content.get("mains") or [], start=1):
        parts.append(f"### Mains Prompt {idx}: {item.get('tag', 'UPSC Mains')}\n")
        parts.append(f"> {item.get('prompt', '')}\n")
        parts.append(f"**Source:** {item.get('source', 'UPSC CSE')}  \n")
        parts.append(f"**Outline hint (AI-generated study aid):** {item.get('outline', '')}\n")
    return "\n".join(parts).rstrip() + "\n"


def render_book_index(class_level: int, book_slug: str, sources: list[NcertSource]) -> str:
    book_title = sources[0].book_title
    parts = [page_frontmatter(book_title, class_level * 10)]
    parts.append(f"# {book_title}\n")
    parts.append(f"Class {class_level} Political Science NCERT coverage for UPSC CSE Prelims and Mains.\n")
    parts.append("## Chapters\n")
    for source in sorted(sources, key=lambda s: s.chapter_number):
        parts.append(f"- [{source.chapter_number}. {source.title}](./{source.chapter_number:02d}-{slugify(source.title)})")
    return "\n".join(parts).rstrip() + "\n"


def render_overview() -> str:
    books = defaultdict(list)
    for source in NCERT_SOURCES:
        books[(source.class_level, source.book_slug, source.book_title)].append(source)
    parts = [page_frontmatter("UPSC CSE Political Science NCERT Mastery", 1, "/upsc-cse/political-science/")]
    parts.append("# UPSC CSE Political Science NCERT Mastery\n")
    parts.append("This section turns Political Science NCERTs into UPSC-ready notes, Prelims quizzes, and Mains answer-writing prompts.\n")
    parts.append(":::info Source policy\nCurrent official NCERT PDFs are primary where they retain the relevant UPSC chapter. Older NCERT mirror PDFs fill rationalised gaps so the coverage remains UPSC-complete.\n:::\n")
    parts.append("## What Each Chapter Adds\n")
    parts.append("- Exam orientation for Prelims, General Studies II, essay, and interview use.\n")
    parts.append("- High-yield facts and NCERT anchors that can be revised without leaving the source trail.\n")
    parts.append("- Prelims traps, Mains framing, current-affairs bridges, and a revision ladder for active recall.\n")
    parts.append("- An answer framework bank that turns each chapter into reusable UPSC Mains structures instead of isolated facts.\n")
    parts.append("## Study Path\n")
    for (class_level, book_slug, book_title), sources in sorted(books.items()):
        parts.append(f"- **Class {class_level}:** [{book_title}](./class-{class_level}/{book_slug}/) - {len(sources)} chapters")
    parts.append("\n## How to Use\n")
    parts.append("1. Start with Exam Orientation so the chapter has a UPSC purpose before you read details.\n2. Read the Master Summary, Key Concepts, High-Yield Facts, and Topic Notes together.\n3. Use Prelims Traps before attempting quiz blocks, then open the answer explanation.\n4. Convert the Answer Framework Bank into 150-250 word Mains answers and compare with the outline hint.\n5. Use the Current-Affairs Bridge only to map news to static concepts; do not add unsupported facts.\n6. Finish with the Revision Ladder checklist.\n")
    return "\n".join(parts).rstrip() + "\n"


def write_pages(output_root: Path = OUTPUT_ROOT, docs_root: Path = DOCS_ROOT) -> None:
    docs_root.mkdir(parents=True, exist_ok=True)
    (docs_root / "overview.md").write_text(render_overview(), encoding="utf-8")
    grouped: dict[tuple[int, str], list[NcertSource]] = defaultdict(list)
    for source in NCERT_SOURCES:
        grouped[(source.class_level, source.book_slug)].append(source)
        generated = json.loads(generated_json_path(source, output_root).read_text(encoding="utf-8"))
        path = doc_path(source, docs_root)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(render_chapter_page(source, generated), encoding="utf-8")
    for (class_level, book_slug), sources in grouped.items():
        book_index_path(class_level, book_slug, docs_root).write_text(render_book_index(class_level, book_slug, sources), encoding="utf-8")
    print(f"wrote pages under {docs_root}")


def validate_generated_json(item: dict[str, Any]) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    item_id = str(item.get("id") or "unknown")
    generated_json_path = item.get("generated_json_path")
    if not generated_json_path:
        return issues

    path = Path(generated_json_path)
    if not path.exists() or path.stat().st_size == 0:
        return [{"id": item_id, "issue": "missing generated JSON"}]

    try:
        content = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return [{"id": item_id, "issue": f"invalid generated JSON: {exc}"}]

    generation = content.get("generation") or {}
    if not generation.get("provider") or not generation.get("model"):
        issues.append({"id": item_id, "issue": "missing generation metadata"})
    metadata = content.get("metadata") or {}
    if metadata.get("id") and metadata.get("id") != item_id:
        issues.append({"id": item_id, "issue": "metadata id does not match manifest id"})
    if not str(content.get("summary") or "").strip():
        issues.append({"id": item_id, "issue": "generated JSON has no summary"})
    if not list_items(content.get("key_concepts")):
        issues.append({"id": item_id, "issue": "generated JSON has no key concepts"})
    if not [note for note in content.get("topic_notes") or [] if isinstance(note, dict) and str(note.get("heading") or "").strip() and str(note.get("body") or "").strip()]:
        issues.append({"id": item_id, "issue": "generated JSON has no topic notes"})
    topic_note_words = word_count(" ".join(str(note.get("body") or "") for note in content.get("topic_notes") or [] if isinstance(note, dict)))
    if topic_note_words < 80:
        issues.append({"id": item_id, "issue": "generated JSON topic notes are too thin"})
    if len(list_items(content.get("answer_frameworks"))) < 4:
        issues.append({"id": item_id, "issue": "generated JSON has no answer framework bank"})
    drills = expansion_drill_items(content.get("expansion_drills"))
    required_drill_headings = {"Mains Answer Scaffold", "Prelims Trap Check", "Key Term Anchors", "Comparison Prompt", "Weakness Repair Drill"}
    if len(drills) < 5 or required_drill_headings - {drill["heading"] for drill in drills}:
        issues.append({"id": item_id, "issue": "generated JSON has no expansion drills"})
    elif any(word_count(drill["body"]) < 10 for drill in drills):
        issues.append({"id": item_id, "issue": "generated JSON expansion drills are too thin"})
    if not [item for item in content.get("prelims") or [] if isinstance(item, dict) and has_valid_prelim(item)]:
        issues.append({"id": item_id, "issue": "generated JSON has no valid prelims"})
    if not [item for item in content.get("mains") or [] if isinstance(item, dict) and str(item.get("prompt") or "").strip()]:
        issues.append({"id": item_id, "issue": "generated JSON has no mains prompts"})
    return issues


def validate_generated_section(manifest_path: Path) -> dict[str, Any]:
    manifest = json.loads(Path(manifest_path).read_text(encoding="utf-8"))
    issues = []
    for item in manifest.get("sources", []):
        item_id = str(item.get("id") or "unknown")
        raw = Path(item["raw_pdf_path"]) if item.get("raw_pdf_path") else None
        ocr = Path(item["ocr_json_path"]) if item.get("ocr_json_path") else None
        doc = Path(item["doc_path"]) if item.get("doc_path") else None
        issues.extend(validate_generated_json(item))
        if raw is None:
            issues.append({"id": item_id, "issue": "missing raw PDF path"})
        elif not raw.exists() or raw.stat().st_size == 0:
            issues.append({"id": item["id"], "issue": "missing raw PDF"})
        elif raw.read_bytes()[:5] != b"%PDF-":
            issues.append({"id": item["id"], "issue": "raw PDF signature is not %PDF-"})
        if ocr is None:
            issues.append({"id": item_id, "issue": "missing OCR JSON path"})
        elif not ocr.exists() or ocr.stat().st_size == 0:
            issues.append({"id": item["id"], "issue": "missing OCR JSON"})
        else:
            try:
                ocr_data = json.loads(ocr.read_text(encoding="utf-8"))
                pages = ocr_data.get("pages") or []
                if not pages or not any((page.get("markdown") or "").strip() for page in pages):
                    issues.append({"id": item["id"], "issue": "OCR JSON has no non-empty markdown"})
                for image in ocr_data.get("images") or []:
                    image_path = image.get("path")
                    if image_path and not Path(image_path).exists():
                        issues.append({"id": item["id"], "issue": f"missing saved image {image_path}"})
            except Exception as exc:
                issues.append({"id": item["id"], "issue": f"invalid OCR JSON: {exc}"})
        if doc is None:
            issues.append({"id": item_id, "issue": "missing doc path"})
        elif not doc.exists() or doc.stat().st_size == 0:
            issues.append({"id": item["id"], "issue": "missing generated doc"})
        else:
            text = doc.read_text(encoding="utf-8")
            if word_count(text) < 300:
                issues.append({"id": item["id"], "issue": "generated doc is too short for UPSC mastery notes"})
            if not text.startswith("---"):
                issues.append({"id": item["id"], "issue": "missing front matter"})
            if "## Prelims Drill" not in text or "quiz-block mcq" not in text or "data-answer=" not in text:
                issues.append({"id": item["id"], "issue": "missing valid prelims quiz block"})
            if "## Mains Answer Practice" not in text:
                issues.append({"id": item["id"], "issue": "missing mains practice section"})
            if "AI-generated study aid" not in text:
                issues.append({"id": item["id"], "issue": "missing answer disclaimer"})
            required_sections = [
                "## Exam Orientation",
                "## High-Yield Facts",
                "## Prelims Traps",
                "## Mains Framing",
                "## Answer Framework Bank",
                "## UPSC Expansion Drills",
                "## Current-Affairs Bridge",
                "## Revision Ladder",
            ]
            for section in required_sections:
                if section not in text:
                    issues.append({"id": item["id"], "issue": f"missing {section} section"})
            for drill_heading in ["### Mains Answer Scaffold", "### Prelims Trap Check", "### Key Term Anchors", "### Comparison Prompt", "### Weakness Repair Drill"]:
                if drill_heading not in text:
                    issues.append({"id": item["id"], "issue": f"missing {drill_heading} drill"})
    report = {
        "source_count": len(manifest.get("sources", [])),
        "issue_count": len(issues),
        "issues": issues,
    }
    report_path = Path(manifest_path).with_name("validation_report.json")
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Build UPSC CSE Political Science NCERT mastery pages.")
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--ocr", action="store_true")
    parser.add_argument("--generate", action="store_true")
    parser.add_argument("--write-pages", action="store_true")
    parser.add_argument("--validate", action="store_true")
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force-ocr", action="store_true")
    parser.add_argument("--force-generate", action="store_true")
    parser.add_argument("--retry-fallback", action="store_true")
    parser.add_argument("--no-deepseek", action="store_true")
    args = parser.parse_args()

    manifest_path = write_manifest()
    print(f"manifest {manifest_path}")
    if args.download:
        download_sources(force=args.force_download)
    if args.ocr:
        ocr_sources(force=args.force_ocr)
    if args.generate:
        generate_content(force=args.force_generate, use_deepseek=not args.no_deepseek, retry_fallback=args.retry_fallback)
    if args.write_pages:
        write_pages()
    if args.validate:
        report = validate_generated_section(manifest_path)
        print(f"validation issues {report['issue_count']} / sources {report['source_count']}")
        if report["issue_count"]:
            for issue in report["issues"][:20]:
                print(issue)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
