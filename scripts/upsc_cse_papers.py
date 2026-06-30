from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import sys
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


SOURCE_PAGES = [
    "https://www.upsc.gov.in/examinations/previous-question-papers",
    "https://www.upsc.gov.in/examinations/previous-question-papers/archives",
]

DEFAULT_OUTPUT = Path("output/upsc_cse_papers")
MISTRAL_OCR_URL = "https://api.mistral.ai/v1/ocr"


@dataclass(frozen=True)
class Paper:
    id: str
    year: int
    exam_stage: str
    exam_name: str
    paper_title: str
    source_name: str
    source_url: str
    source_page: str
    raw_path: str
    ocr_json_path: str
    images_dir: str


def slugify(value: str) -> str:
    value = value.lower()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")[:120] or "paper"


def parse_year(text: str) -> int:
    match = re.search(r"(20\d{2}|19\d{2})", text)
    if not match:
        raise ValueError(f"Could not parse year from {text!r}")
    return int(match.group(1))


def paper_stage(exam_name: str) -> str:
    if "Preliminary" in exam_name:
        return "prelims"
    if "Main" in exam_name:
        return "mains"
    raise ValueError(f"Unexpected exam stage in {exam_name!r}")


def clean_paper_title(li_text: str) -> str:
    return re.sub(r"\s*\([^)]*(?:KB|MB)\)\s*$", "", li_text, flags=re.I).strip()


def build_paths(output_dir: Path, exam_stage: str, year: int, paper_title: str, source_url: str) -> tuple[str, str, str]:
    parsed = urlparse(source_url)
    ext = Path(parsed.path).suffix.lower() or ".pdf"
    url_hash = hashlib.sha1(source_url.encode("utf-8")).hexdigest()[:10]
    base_name = f"{year}-{slugify(paper_title)}-{url_hash}"
    raw_path = output_dir / "raw" / exam_stage / str(year) / f"{base_name}{ext}"
    ocr_path = output_dir / "ocr" / exam_stage / str(year) / f"{base_name}.json"
    images_dir = output_dir / "images" / exam_stage / str(year) / base_name
    return str(raw_path), str(ocr_path), str(images_dir)


def make_paper(
    output_dir: Path,
    *,
    year: int,
    exam_stage: str,
    exam_name: str,
    paper_title: str,
    source_name: str,
    source_url: str,
    source_page: str,
) -> Paper:
    raw_path, ocr_path, images_dir = build_paths(output_dir, exam_stage, year, paper_title, source_url)
    paper_id = f"upsc-cse-{exam_stage}-{year}-{slugify(paper_title)}-{hashlib.sha1(source_url.encode('utf-8')).hexdigest()[:10]}"
    return Paper(
        id=paper_id,
        year=year,
        exam_stage=exam_stage,
        exam_name=exam_name,
        paper_title=paper_title,
        source_name=source_name,
        source_url=source_url,
        source_page=source_page,
        raw_path=raw_path,
        ocr_json_path=ocr_path,
        images_dir=images_dir,
    )


def scrape_official_papers(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 UPSC CSE paper collector"})
    papers: list[Paper] = []

    for source_page in SOURCE_PAGES:
        response = session.get(source_page, timeout=60)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for table in soup.select("table.views-table"):
            if not table.caption:
                continue
            exam_name = table.caption.get_text(" ", strip=True)
            if "Civil Services" not in exam_name:
                continue
            if "Preliminary" not in exam_name and "Main" not in exam_name:
                continue

            year = parse_year(exam_name)
            if not (min_year <= year <= max_year):
                continue
            stage = paper_stage(exam_name)
            for li in table.select("li"):
                link = li.find("a", href=True)
                if not link:
                    continue
                href = link["href"].strip()
                if ".pdf" not in href.lower():
                    continue
                paper_title = clean_paper_title(li.get_text(" ", strip=True))
                papers.append(
                    make_paper(
                        output_dir,
                        year=year,
                        exam_stage=stage,
                        exam_name=exam_name,
                        paper_title=paper_title,
                        source_name="UPSC",
                        source_url=href,
                        source_page=source_page,
                    )
                )

    return papers


def roman_to_int(value: str) -> int | None:
    value = value.upper().strip()
    mapping = {"I": 1, "II": 2, "III": 3, "IV": 4}
    if value in mapping:
        return mapping[value]
    if value.isdigit():
        return int(value)
    return None


def normalize_title_for_key(title: str) -> str:
    title = re.sub(r"\bPaper\s*-\s*", "Paper ", title, flags=re.I)
    title = re.sub(r"\bPaper\s+I\b", "Paper 1", title, flags=re.I)
    title = re.sub(r"\bPaper\s+II\b", "Paper 2", title, flags=re.I)
    title = re.sub(r"\bPaper\s+III\b", "Paper 3", title, flags=re.I)
    title = re.sub(r"\bPaper\s+IV\b", "Paper 4", title, flags=re.I)
    return slugify(title)


def merge_papers(primary: list[Paper], secondary: list[Paper]) -> list[Paper]:
    merged: dict[tuple[str, int, str], Paper] = {}
    for paper in primary + secondary:
        key = (paper.exam_stage, paper.year, normalize_title_for_key(paper.paper_title))
        merged.setdefault(key, paper)
    return sorted(merged.values(), key=lambda p: (p.exam_stage, p.year, p.paper_title, p.source_name, p.source_url))


def scrape_catalyst_prelims(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    source_page = "https://catalystias.org.in/english/upsc-prelims-questions.php"
    soup = BeautifulSoup(requests.get(source_page, timeout=60, headers={"User-Agent": "Mozilla/5.0"}).text, "html.parser")
    papers: list[Paper] = []
    for link in soup.find_all("a", href=True):
        text = link.get_text(" ", strip=True)
        if "UPSC GS Paper" not in text:
            continue
        year_match = re.search(r"(20\d{2}|19\d{2})", text)
        if not year_match:
            continue
        year = int(year_match.group(1))
        if not (min_year <= year <= max_year):
            continue
        papers.append(
            make_paper(
                output_dir,
                year=year,
                exam_stage="prelims",
                exam_name=f"Civil Services (Preliminary) Examination, {year}",
                paper_title="General Studies Paper I",
                source_name="Catalyst IAS",
                source_url=urljoin(source_page, link["href"]),
                source_page=source_page,
            )
        )
    return papers


def scrape_catalyst_mains(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    source_page = "https://catalystias.org.in/english/upsc-mains-questions.php"
    soup = BeautifulSoup(requests.get(source_page, timeout=60, headers={"User-Agent": "Mozilla/5.0"}).text, "html.parser")
    papers: list[Paper] = []
    for link in soup.find_all("a", href=True):
        text = link.get_text(" ", strip=True)
        match = re.search(r"Genera(?:l)? Studies\s+Paper\s+([1-4IVX]+)\s*,?\s*(20\d{2}|19\d{2})", text, flags=re.I)
        if not match:
            continue
        paper_no = roman_to_int(match.group(1)) or int(match.group(1))
        year = int(match.group(2))
        if not (min_year <= year <= max_year):
            continue
        papers.append(
            make_paper(
                output_dir,
                year=year,
                exam_stage="mains",
                exam_name=f"Civil Services (Main) Examination, {year}",
                paper_title=f"General Studies Paper {paper_no}",
                source_name="Catalyst IAS",
                source_url=urljoin(source_page, link["href"]),
                source_page=source_page,
            )
        )
    return papers


def title_from_drishti_url(url: str) -> str | None:
    filename = Path(urlparse(url).path).name.lower()
    if "essay" in filename or "eassy" in filename:
        return "Essay"
    if "gs-iv" in filename or "gs_iv" in filename or "gs4" in filename:
        return "General Studies Paper 4"
    if "gs111" in filename or "gs-iii" in filename or "gs_iii" in filename or "gs3" in filename:
        return "General Studies Paper 3"
    if "gs11" in filename or "gs-ii" in filename or "gs_ii" in filename or "gs2" in filename:
        return "General Studies Paper 2"
    if "gs1" in filename or "gs-i" in filename or "gs_i" in filename:
        return "General Studies Paper 1"
    return None


def scrape_drishti_mains(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    papers: list[Paper] = []
    for year in range(max(min_year, 2013), min(max_year, 2025) + 1):
        source_page = f"https://www.drishtiias.com/free-downloads/previous-year-papers-mains-papers-by-year-{year}"
        response = requests.get(source_page, timeout=60, headers={"User-Agent": "Mozilla/5.0"})
        if response.status_code >= 400:
            continue
        soup = BeautifulSoup(response.text, "html.parser")
        for link in soup.find_all("a", href=True):
            href = urljoin(source_page, link["href"])
            if ".pdf" not in href.lower():
                continue
            title = title_from_drishti_url(href)
            if not title:
                continue
            papers.append(
                make_paper(
                    output_dir,
                    year=year,
                    exam_stage="mains",
                    exam_name=f"Civil Services (Main) Examination, {year}",
                    paper_title=title,
                    source_name="Drishti IAS",
                    source_url=href,
                    source_page=source_page,
                )
            )
    return papers


def scrape_educationprovince_csat(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    source_page = "https://educationprovince.com/upsc-prelims-previous-year-question-papers/"
    response = requests.get(source_page, timeout=60, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")
    papers: list[Paper] = []
    for link in soup.find_all("a", href=True):
        text = link.get_text(" ", strip=True)
        match = re.search(r"(20\d{2})\s+Prelims Question Paper CSAT", text, flags=re.I)
        if not match:
            continue
        year = int(match.group(1))
        if not (min_year <= year <= max_year):
            continue
        papers.append(
            make_paper(
                output_dir,
                year=year,
                exam_stage="prelims",
                exam_name=f"Civil Services (Preliminary) Examination, {year}",
                paper_title="General Studies Paper II",
                source_name="Education Province",
                source_url=link["href"],
                source_page=source_page,
            )
        )
    return papers


def scrape_all_papers(output_dir: Path, min_year: int, max_year: int) -> list[Paper]:
    official = scrape_official_papers(output_dir, min_year, max_year)
    supplemental = []
    supplemental.extend(scrape_drishti_mains(output_dir, min_year, max_year))
    supplemental.extend(scrape_catalyst_prelims(output_dir, min_year, max_year))
    supplemental.extend(scrape_catalyst_mains(output_dir, min_year, max_year))
    supplemental.extend(scrape_educationprovince_csat(output_dir, min_year, max_year))
    return merge_papers(official, supplemental)


def write_manifest(output_dir: Path, papers: list[Paper]) -> Path:
    manifest_path = output_dir / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "seed_source_pages": SOURCE_PAGES,
        "source_pages": sorted({paper.source_page for paper in papers}),
        "paper_count": len(papers),
        "papers": [asdict(paper) for paper in papers],
    }
    manifest_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return manifest_path


def download_paper(session: requests.Session, paper: Paper, force: bool = False) -> bool:
    out_path = Path(paper.raw_path)
    if out_path.exists() and out_path.stat().st_size > 0 and not force:
        return False

    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = out_path.with_suffix(out_path.suffix + ".part")
    download_url = google_drive_download_url(paper.source_url)
    with session.get(download_url, stream=True, timeout=120) as response:
        response.raise_for_status()
        with tmp_path.open("wb") as fh:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    fh.write(chunk)
    tmp_path.replace(out_path)
    return True


def google_drive_download_url(url: str) -> str:
    match = re.search(r"drive\.google\.com/(?:file/d/|open\?id=)([-\w]+)", url)
    if not match:
        parsed = urlparse(url)
        if "drive.google.com" in parsed.netloc and "id=" in parsed.query:
            query_match = re.search(r"(?:^|&)id=([^&]+)", parsed.query)
            if query_match:
                return f"https://drive.google.com/uc?export=download&id={query_match.group(1)}"
        return url
    return f"https://drive.google.com/uc?export=download&id={match.group(1)}"


def decode_data_uri(data_uri: str) -> tuple[bytes, str]:
    if "," not in data_uri:
        return base64.b64decode(data_uri), "bin"
    header, data = data_uri.split(",", 1)
    mime_match = re.search(r"data:([^;]+)", header)
    mime = mime_match.group(1) if mime_match else "application/octet-stream"
    ext = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }.get(mime.lower(), "bin")
    return base64.b64decode(data), ext


def extract_questions_from_markdown(markdown_pages: list[dict[str, Any]], stage: str) -> list[dict[str, Any]]:
    text = "\n\n".join(page.get("markdown") or "" for page in markdown_pages)
    if not text.strip():
        return []

    question_pattern = re.compile(r"(?m)^\s*(?:Q\.?\s*)?(\d{1,3})[\).\s]+(.+?)(?=^\s*(?:Q\.?\s*)?\d{1,3}[\).\s]+|\Z)", re.S)
    option_pattern = re.compile(r"(?ms)(?:^|\n)\s*[\(\[]?([a-dA-D])[\)\].]\s+(.+?)(?=(?:\n\s*[\(\[]?[a-dA-D][\)\].]\s+)|\Z)")
    questions: list[dict[str, Any]] = []

    for match in question_pattern.finditer(text):
        number = int(match.group(1))
        body = match.group(2).strip()
        options = [
            {"label": opt.group(1).lower(), "text": re.sub(r"\s+", " ", opt.group(2)).strip()}
            for opt in option_pattern.finditer(body)
        ]
        if options:
            body = option_pattern.split(body, maxsplit=1)[0].strip()
        questions.append(
            {
                "number": number,
                "type": "multiple_choice" if options else "descriptive",
                "text": re.sub(r"\s+", " ", body).strip(),
                "options": options,
                "image_refs": sorted(set(re.findall(r"!\[[^\]]*\]\(([^)]+)\)", body))),
            }
        )

    if stage == "mains" and not questions:
        sections = [s.strip() for s in re.split(r"(?m)^#+\s+", text) if s.strip()]
        questions = [
            {
                "number": idx + 1,
                "type": "descriptive_section",
                "text": re.sub(r"\s+", " ", section).strip(),
                "options": [],
                "image_refs": sorted(set(re.findall(r"!\[[^\]]*\]\(([^)]+)\)", section))),
            }
            for idx, section in enumerate(sections)
        ]

    return questions


def save_mistral_images(paper: Paper, pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    image_records: list[dict[str, Any]] = []
    images_dir = Path(paper.images_dir)
    images_dir.mkdir(parents=True, exist_ok=True)

    for page in pages:
        page_index = page.get("index")
        for image in page.get("images") or []:
            image_id = image.get("id") or f"page-{page_index}-image-{len(image_records)}"
            image_base64 = image.get("image_base64")
            record = {
                "page_index": page_index,
                "id": image_id,
                "top_left_x": image.get("top_left_x"),
                "top_left_y": image.get("top_left_y"),
                "bottom_right_x": image.get("bottom_right_x"),
                "bottom_right_y": image.get("bottom_right_y"),
            }
            if image_base64:
                data, ext = decode_data_uri(image_base64)
                safe_id = slugify(Path(image_id).stem)
                image_path = images_dir / f"p{page_index}-{safe_id}.{ext}"
                image_path.write_bytes(data)
                record["path"] = str(image_path)
            image_records.append(record)
    return image_records


def normalize_ocr_pages(raw_pages: list[Any]) -> list[dict[str, Any]]:
    pages: list[dict[str, Any]] = []
    for idx, page in enumerate(raw_pages):
        if hasattr(page, "model_dump"):
            data = page.model_dump()
        elif isinstance(page, dict):
            data = page
        else:
            data = dict(page)
        data.setdefault("index", idx)
        pages.append(data)
    return pages


def build_mistral_document_payload(paper: Paper, input_mode: str) -> dict[str, str]:
    if input_mode in {"auto", "local"}:
        raw_path = Path(paper.raw_path)
        if raw_path.exists() and raw_path.stat().st_size > 0:
            encoded = base64.b64encode(raw_path.read_bytes()).decode("ascii")
            return {"type": "document_url", "document_url": f"data:application/pdf;base64,{encoded}"}
        if input_mode == "local":
            raise FileNotFoundError(f"Downloaded PDF not found for local OCR: {raw_path}")
    return {"type": "document_url", "document_url": paper.source_url}


def call_mistral_ocr(
    paper: Paper,
    api_key: str,
    force: bool = False,
    sleep_seconds: float = 0.0,
    input_mode: str = "auto",
) -> bool:
    out_path = Path(paper.ocr_json_path)
    if out_path.exists() and out_path.stat().st_size > 0 and not force:
        return False

    payload = {
        "model": "mistral-ocr-latest",
        "document": build_mistral_document_payload(paper, input_mode),
        "include_image_base64": True,
        "image_min_size": 0,
        "table_format": "markdown",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    for attempt in range(1, 6):
        response = requests.post(MISTRAL_OCR_URL, headers=headers, json=payload, timeout=300)
        if response.status_code in {429, 500, 502, 503, 504} and attempt < 5:
            retry_after = response.headers.get("retry-after")
            delay = float(retry_after) if retry_after and retry_after.isdigit() else min(60, 2**attempt)
            time.sleep(delay)
            continue
        response.raise_for_status()
        raw = response.json()
        raw_pages = raw.get("pages") or []
        pages = normalize_ocr_pages(raw_pages)
        image_records = save_mistral_images(paper, pages)
        result = {
            "metadata": asdict(paper),
            "ocr": {
                "provider": "mistral",
                "model": payload["model"],
                "input_mode": input_mode,
                "source_document_url": paper.source_url,
                "page_count": len(pages),
                "pages": [
                    {
                        "index": page.get("index"),
                        "markdown": page.get("markdown") or "",
                        "dimensions": page.get("dimensions"),
                        "images": [
                            {k: v for k, v in image.items() if k != "image_base64"}
                            for image in (page.get("images") or [])
                        ],
                    }
                    for page in pages
                ],
            },
            "images": image_records,
            "questions": extract_questions_from_markdown(pages, paper.exam_stage),
        }
        out_path.parent.mkdir(parents=True, exist_ok=True)
        tmp_path = out_path.with_suffix(out_path.suffix + ".part")
        tmp_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        tmp_path.replace(out_path)
        if sleep_seconds:
            time.sleep(sleep_seconds)
        return True

    return False


def select_papers(papers: list[Paper], args: argparse.Namespace) -> list[Paper]:
    selected = papers
    if args.stage != "all":
        selected = [paper for paper in selected if paper.exam_stage == args.stage]
    if args.year:
        years = {int(year) for year in args.year}
        selected = [paper for paper in selected if paper.year in years]
    if args.title_contains:
        needle = args.title_contains.lower()
        selected = [paper for paper in selected if needle in paper.paper_title.lower()]
    if args.limit:
        selected = selected[: args.limit]
    return selected


def validate_outputs(output_dir: Path, papers: list[Paper]) -> dict[str, Any]:
    report: dict[str, Any] = {
        "paper_count": len(papers),
        "raw_pdf_count": 0,
        "ocr_json_count": 0,
        "bad_pdf_signature": [],
        "missing_raw_pdf": [],
        "missing_ocr_json": [],
        "invalid_json": [],
        "schema_issues": [],
        "missing_saved_images": [],
        "empty_markdown": [],
        "question_stats": {},
        "source_counts": {},
        "stage_counts": {},
        "year_stage_counts": {},
    }

    for paper in papers:
        report["source_counts"][paper.source_name] = report["source_counts"].get(paper.source_name, 0) + 1
        report["stage_counts"][paper.exam_stage] = report["stage_counts"].get(paper.exam_stage, 0) + 1
        year_key = str(paper.year)
        report["year_stage_counts"].setdefault(year_key, {})
        report["year_stage_counts"][year_key][paper.exam_stage] = (
            report["year_stage_counts"][year_key].get(paper.exam_stage, 0) + 1
        )

        raw_path = Path(paper.raw_path)
        if not raw_path.exists() or raw_path.stat().st_size == 0:
            report["missing_raw_pdf"].append(paper.id)
        else:
            report["raw_pdf_count"] += 1
            with raw_path.open("rb") as fh:
                if fh.read(5) != b"%PDF-":
                    report["bad_pdf_signature"].append(paper.id)

        ocr_path = Path(paper.ocr_json_path)
        if not ocr_path.exists() or ocr_path.stat().st_size == 0:
            report["missing_ocr_json"].append(paper.id)
            continue

        report["ocr_json_count"] += 1
        try:
            data = json.loads(ocr_path.read_text(encoding="utf-8"))
        except Exception as exc:
            report["invalid_json"].append({"id": paper.id, "error": str(exc)})
            continue

        for key in ["metadata", "ocr", "images", "questions"]:
            if key not in data:
                report["schema_issues"].append({"id": paper.id, "issue": f"missing top-level key {key}"})
        if not isinstance(data.get("questions"), list):
            report["schema_issues"].append({"id": paper.id, "issue": "questions is not a list"})
            questions: list[dict[str, Any]] = []
        else:
            questions = data["questions"]
        ocr = data.get("ocr") or {}
        pages = ocr.get("pages") or []
        page_count = ocr.get("page_count")
        if page_count != len(pages):
            report["schema_issues"].append(
                {"id": paper.id, "issue": f"page_count {page_count!r} does not match pages length {len(pages)}"}
            )
        if not pages:
            report["schema_issues"].append({"id": paper.id, "issue": "no OCR pages"})
        markdown_chars = sum(len(page.get("markdown") or "") for page in pages if isinstance(page, dict))
        if markdown_chars == 0:
            report["empty_markdown"].append(paper.id)

        for image in data.get("images") or []:
            path = image.get("path") if isinstance(image, dict) else None
            if path and not Path(path).exists():
                report["missing_saved_images"].append({"id": paper.id, "path": path})

        mcq_questions = [q for q in questions if isinstance(q, dict) and q.get("options")]
        options_total = sum(len(q.get("options") or []) for q in mcq_questions)
        report["question_stats"][paper.id] = {
            "year": paper.year,
            "stage": paper.exam_stage,
            "title": paper.paper_title,
            "questions": len(questions),
            "mcq_questions": len(mcq_questions),
            "options": options_total,
            "pages": len(pages),
            "markdown_chars": markdown_chars,
            "images": len(data.get("images") or []),
        }

    report_path = output_dir / "validation_report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Collect official UPSC CSE papers and OCR them with Mistral.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--ocr", action="store_true")
    parser.add_argument("--validate", action="store_true")
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force-ocr", action="store_true")
    parser.add_argument("--stage", choices=["all", "prelims", "mains"], default="all")
    parser.add_argument("--year", action="append")
    parser.add_argument("--from-year", type=int, default=2000)
    parser.add_argument("--to-year", type=int, default=2025)
    parser.add_argument("--title-contains")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--sleep", type=float, default=0.2)
    parser.add_argument("--ocr-input", choices=["auto", "local", "url"], default="auto")
    args = parser.parse_args()

    papers = scrape_all_papers(args.output, args.from_year, args.to_year)
    manifest_path = write_manifest(args.output, papers)
    selected = select_papers(papers, args)
    print(f"Manifest: {manifest_path}")
    print(f"Discovered {len(papers)} UPSC CSE PDFs; selected {len(selected)}.")

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 UPSC CSE paper collector"})

    if args.download:
        downloaded = 0
        for idx, paper in enumerate(selected, start=1):
            try:
                if download_paper(session, paper, force=args.force_download):
                    downloaded += 1
                print(f"[download {idx}/{len(selected)}] {paper.exam_stage} {paper.year} - {paper.paper_title}")
            except Exception as exc:
                print(f"DOWNLOAD_FAILED {paper.id}: {exc}", file=sys.stderr)
        print(f"Downloaded {downloaded}; skipped {len(selected) - downloaded}.")

    if args.ocr:
        api_key = os.environ.get("MISTRAL_API_KEY") or os.environ.get("MISTRAL_API_KEY_2")
        if not api_key:
            raise RuntimeError("Set MISTRAL_API_KEY or MISTRAL_API_KEY_2 before running --ocr.")
        ocr_done = 0
        for idx, paper in enumerate(selected, start=1):
            try:
                if call_mistral_ocr(
                    paper,
                    api_key,
                    force=args.force_ocr,
                    sleep_seconds=args.sleep,
                    input_mode=args.ocr_input,
                ):
                    ocr_done += 1
                print(f"[ocr {idx}/{len(selected)}] {paper.exam_stage} {paper.year} - {paper.paper_title}")
            except Exception as exc:
                print(f"OCR_FAILED {paper.id}: {exc}", file=sys.stderr)
        print(f"OCR written {ocr_done}; skipped {len(selected) - ocr_done}.")

    if args.validate:
        report = validate_outputs(args.output, papers)
        print(f"Validation report: {args.output / 'validation_report.json'}")
        print(f"Papers: {report['paper_count']}")
        print(f"Raw PDFs: {report['raw_pdf_count']}")
        print(f"OCR JSON: {report['ocr_json_count']}")
        issue_counts = {
            key: len(report[key])
            for key in [
                "missing_raw_pdf",
                "bad_pdf_signature",
                "missing_ocr_json",
                "invalid_json",
                "schema_issues",
                "missing_saved_images",
                "empty_markdown",
            ]
        }
        print(f"Issues: {json.dumps(issue_counts, sort_keys=True)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
