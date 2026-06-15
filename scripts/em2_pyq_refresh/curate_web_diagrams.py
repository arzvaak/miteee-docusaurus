#!/usr/bin/env python3
"""Curate EM2 diagrams through local SearxNG + Firecrawl and update banks."""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "scripts" / "em2_pyq_refresh" / "web_diagrams.json"
CACHE = ROOT / ".em2-diagram-search-cache"
FULL_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-answer-bank.md"
UNIQUE_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-unique-question-bank.md"

SEARXNG_URL = os.environ.get("SEARXNG_URL", "http://localhost:8888").rstrip("/")
FIRECRAWL_URL = os.environ.get("FIRECRAWL_URL", "http://localhost:3002").rstrip("/")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")


@dataclass(frozen=True)
class Topic:
    id: str
    title: str
    queries: tuple[str, ...]
    keywords: tuple[str, ...]


TOPICS = (
    Topic("induction_equivalent_circuit", "Induction motor equivalent circuit", ("induction motor equivalent circuit diagram per phase", "three phase induction motor exact equivalent circuit diagram", "approximate equivalent circuit induction motor diagram"), ("induction", "equivalent", "circuit", "rotor", "stator", "slip")),
    Topic("induction_circle_diagram", "Induction motor circle diagram", ("induction motor circle diagram output line torque line", "circle diagram of induction motor full load slip efficiency", "induction motor circle diagram construction diagram"), ("circle", "diagram", "induction", "output", "torque", "slip")),
    Topic("single_phase_capacitor_motor", "Capacitor-start single-phase induction motor circuit", ("capacitor start single phase induction motor circuit diagram", "single phase induction motor capacitor start auxiliary winding circuit diagram"), ("single-phase", "capacitor", "start", "auxiliary", "winding")),
    Topic("synchronous_machine_construction", "Synchronous machine construction diagram", ("synchronous machine construction diagram stator rotor field winding", "salient pole synchronous machine stator rotor construction diagram"), ("synchronous", "machine", "construction", "stator", "rotor", "field")),
    Topic("synchronous_v_curve", "V-curves of synchronous motor", ("synchronous motor V curves inverted V curves diagram", "V curves of synchronous motor armature current field current power factor"), ("v-curve", "synchronous", "motor", "field", "current", "power factor")),
    Topic("alternator_phasor_lagging", "Alternator phasor diagram for lagging power factor", ("alternator phasor diagram lagging power factor", "synchronous generator phasor diagram lagging power factor", "emf method alternator phasor diagram lagging load"), ("alternator", "phasor", "lagging", "power factor", "generator")),
    Topic("armature_reaction_phasor", "Alternator armature reaction phasor diagram", ("alternator armature reaction phasor diagram lagging leading unity power factor", "synchronous generator armature reaction phasor diagram"), ("armature", "reaction", "phasor", "alternator", "leading", "lagging")),
    Topic("salient_pole_generator", "Salient-pole rotor with direct and quadrature axes", ("salient pole synchronous generator direct axis quadrature axis diagram", "salient pole rotor d axis q axis diagram"), ("salient", "pole", "direct", "quadrature", "axis", "rotor")),
    Topic("salient_pole_phasor", "Salient-pole alternator Blondel phasor diagram", ("salient pole alternator phasor diagram Blondel two reaction theory", "Blondel two reaction theory phasor diagram salient pole alternator"), ("salient", "pole", "phasor", "Blondel", "direct", "quadrature")),
)

BAD_DOMAINS = (
    "pinterest.",
    "pinimg.com",
    "scribd.com",
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "quora.com",
    "researchgate.net",
    "unsplash.com",
    "pexels.com",
    "artic.edu",
    "cdn.jsdelivr.net",
)


def host(url: str) -> str:
    return urllib.parse.urlparse(url).netloc.lower()


def request_json(url: str, *, method: str = "GET", body: dict[str, Any] | None = None, timeout: int = 60) -> Any:
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json", "User-Agent": "MITEEE-EM2-diagram-curator/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_images(query: str) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({"q": query, "categories": "images", "format": "json", "safesearch": "0", "language": "en-US"})
    return list(request_json(f"{SEARXNG_URL}/search?{params}", timeout=90).get("results", []))


def scrape_source(url: str) -> dict[str, str]:
    key = re.sub(r"[^A-Za-z0-9_.-]+", "_", url)[:120] + ".json"
    path = CACHE / "scrape" / key
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        data = request_json(f"{FIRECRAWL_URL}/v1/scrape", method="POST", body={"url": url, "formats": ["markdown"], "onlyMainContent": True}, timeout=90)
        payload = data.get("data", {}) if data.get("success") else {}
        result = {"title": str(payload.get("metadata", {}).get("title") or ""), "markdown": str(payload.get("markdown") or payload.get("content") or "")[:2200]}
    except Exception as exc:  # noqa: BLE001
        result = {"title": "", "markdown": f"SCRAPE_ERROR: {exc}"}
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


def image_ok(url: str) -> tuple[bool, str]:
    if not url.startswith(("http://", "https://")) or any(bad in host(url) for bad in BAD_DOMAINS):
        return False, "rejected"
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            ctype = resp.headers.get("Content-Type", "")
            clen = resp.headers.get("Content-Length", "")
            if "image" in ctype.lower() or re.search(r"\.(png|jpe?g|webp|svg)(?:[?#]|$)", url, re.I):
                return True, f"{ctype}; {clen}"
            return False, f"content-type={ctype}"
    except Exception:
        return (True, "extension-only") if re.search(r"\.(png|jpe?g|webp|svg)(?:[?#]|$)", url, re.I) else (False, "head-failed")


def collect_candidates() -> dict[str, list[dict[str, Any]]]:
    cache = CACHE / "candidates.json"
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    CACHE.mkdir(exist_ok=True)
    result: dict[str, list[dict[str, Any]]] = {}
    for topic in TOPICS:
        seen: set[str] = set()
        candidates: list[dict[str, Any]] = []
        for query in topic.queries:
            for item in search_images(query)[:14]:
                image_url = str(item.get("img_src") or item.get("thumbnail") or "").strip()
                source_url = str(item.get("url") or "").strip()
                if not image_url or image_url in seen or any(bad in host(source_url) for bad in BAD_DOMAINS):
                    continue
                ok, note = image_ok(image_url)
                if not ok:
                    continue
                scraped = scrape_source(source_url) if source_url else {"title": "", "markdown": ""}
                candidates.append({
                    "title": str(item.get("title") or scraped.get("title") or topic.title),
                    "image_url": image_url,
                    "source_url": source_url,
                    "source_host": host(source_url),
                    "engine": str(item.get("engine") or ""),
                    "image_check": note,
                    "query": query,
                    "source_excerpt": scraped.get("markdown", "")[:800],
                })
                seen.add(image_url)
                if len(candidates) >= 10:
                    break
            time.sleep(0.4)
        result[topic.id] = candidates
        print(f"[SEARCH] {topic.id}: {len(candidates)} candidates")
    cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


def ask_deepseek_for_topic(topic: Topic, candidates: list[dict[str, Any]]) -> dict[str, Any]:
    if not DEEPSEEK_API_KEY:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    prompt = {
        "task": "Choose the single best diagram image for this Electrical Machines II topic. Prefer clear educational circuit/phasor diagrams from stable source pages. Avoid decorative, stock, irrelevant, unreadable, or thumbnail-only images.",
        "schema": {"id": topic.id, "title": "short title", "url": "candidate image_url", "source_page": "candidate source_url", "source_label": "site/source name", "caption": "concise exam-answer figure caption", "keywords": ["keywords"], "why": "short reason"},
        "topic": {"id": topic.id, "title": topic.title, "keywords": list(topic.keywords)},
        "candidates": candidates[:6],
    }
    body = {
        "model": DEEPSEEK_MODEL,
        "messages": [{"role": "system", "content": "You are an electrical machines lecturer curating diagrams. Return valid JSON only."}, {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)}],
        "temperature": 0.05,
        "max_tokens": 12000,
        "response_format": {"type": "json_object"},
        "thinking": {"type": "enabled"},
        "reasoning_effort": "max",
    }
    req = urllib.request.Request(f"{DEEPSEEK_BASE_URL}/v1/chat/completions", data=json.dumps(body).encode("utf-8"), method="POST", headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = str(data["choices"][0]["message"].get("content") or "").strip()
    raw_path = CACHE / f"deepseek_{topic.id}.raw.json"
    raw_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
    if not content:
        raise RuntimeError(f"DeepSeek returned empty content for {topic.id}; raw saved to {raw_path}")
    payload = json.loads(content)
    payload["id"] = topic.id
    return payload


def call_deepseek(candidates: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    for topic in TOPICS:
        item = ask_deepseek_for_topic(topic, candidates.get(topic.id, []))
        selected.append(item)
        print(f"[DEEPSEEK] {topic.id}: {item.get('source_label')} -> {item.get('url')}")
        time.sleep(0.5)
    (CACHE / "deepseek_selection.json").write_text(json.dumps({"selected": selected}, ensure_ascii=False, indent=2), encoding="utf-8")
    return selected


def manifest_from_selection(selected: list[dict[str, Any]]) -> list[dict[str, Any]]:
    topics = {topic.id: topic for topic in TOPICS}
    manifest: list[dict[str, Any]] = []
    for item in selected:
        topic = topics.get(str(item.get("id")))
        if not topic:
            continue
        source_page = str(item.get("source_page") or item.get("url") or "")
        manifest.append({
            "id": topic.id,
            "title": str(item.get("title") or topic.title),
            "url": str(item.get("url") or ""),
            "source": str(item.get("source_label") or host(source_page) or "source page"),
            "source_page": source_page,
            "caption": str(item.get("caption") or topic.title),
            "keywords": list(item.get("keywords") or topic.keywords),
            "curation_note": str(item.get("why") or ""),
        })
    return manifest


def classify_image_block(block: str) -> str | None:
    low = block.lower()
    if "circle diagram" in low:
        return "induction_circle_diagram"
    if "capacitor-start" in low or "capacitor start" in low:
        return "single_phase_capacitor_motor"
    if "v-curves" in low or "v curves" in low or "inverted v" in low:
        return "synchronous_v_curve"
    if "salient-pole alternator" in low and "phasor" in low:
        return "salient_pole_phasor"
    if "emf-mmf" in low or "armature reaction" in low:
        return "armature_reaction_phasor"
    if "phasor diagram" in low:
        return "alternator_phasor_lagging"
    if "salient-pole generator" in low or "direct and quadrature axes" in low:
        return "salient_pole_generator"
    if "synchronous machine diagram" in low or "cross-section of a salient-pole synchronous machine" in low:
        return "synchronous_machine_construction"
    if "induction motor equivalent circuit" in low or "per-phase equivalent circuit" in low or "approximate equivalent circuit" in low:
        return "induction_equivalent_circuit"
    return None


def replacement(diagram: dict[str, Any], indent: str, alt: str) -> str:
    source_page = diagram.get("source_page") or diagram["url"]
    caption = re.sub(r"^\s*(?:fig(?:ure)?\.?\s*\d*[:.-]?\s*)", "", str(diagram["caption"]), flags=re.I).strip()
    caption = caption.rstrip(" .")
    return f"{indent}![{alt}]({diagram['url']})\n{indent}*Figure: {caption}. Source: [{diagram['source']}]({source_page}).*"


def update_bank(path: Path, diagrams: dict[str, dict[str, Any]]) -> int:
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(r"(?m)^([ \t]*)!\[([^\]]*)]\(([^)]+)\)\n\1\*Figure[^\n]*(?:\n(?!\s*(?:---|##|###|\* |-|\d+\.|>|$)).*)?")
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        topic_id = classify_image_block(match.group(0))
        if not topic_id or topic_id not in diagrams:
            return match.group(0)
        count += 1
        return replacement(diagrams[topic_id], match.group(1), match.group(2))

    path.write_text(pattern.sub(repl, text), encoding="utf-8")
    return count


def main() -> int:
    candidates = collect_candidates()
    selected = call_deepseek(candidates)
    manifest = manifest_from_selection(selected)
    if len(manifest) != len(TOPICS):
        raise RuntimeError(f"DeepSeek selected {len(manifest)} of {len(TOPICS)} diagram topics")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    diagrams = {item["id"]: item for item in manifest}
    print(f"[OK] wrote manifest with {len(manifest)} diagrams")
    print(f"[OK] replaced full={update_bank(FULL_BANK, diagrams)} unique={update_bank(UNIQUE_BANK, diagrams)} image blocks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
