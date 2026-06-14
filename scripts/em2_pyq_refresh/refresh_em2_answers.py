#!/usr/bin/env python3
"""Regenerate EM-II PYQ answer banks with textbook-style answers.

This script is intentionally conservative: it parses the existing Markdown,
replaces only answer bodies, copies selected textbook OCR images, and leaves
question ordering/frontmatter untouched.
"""

from __future__ import annotations

import base64
import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
FULL_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-answer-bank.md"
UNIQUE_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-unique-question-bank.md"
TEXTBOOK_DIR = Path(r"G:\MIT\EM2_Notes\ocr-output\textbook")
TEXTBOOK_MD = TEXTBOOK_DIR / "108105131.md"
TEXTBOOK_RAW = TEXTBOOK_DIR / "108105131_raw.json"
TEXTBOOK_IMAGES = TEXTBOOK_DIR / "images"
TARGET_IMAGE_DIR = ROOT / "docs" / "sem5" / "em2" / "pyq-assets" / "textbook"
CACHE_DIR = ROOT / ".em2-refresh-cache"

MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
BATCH_SIZE = int(os.environ.get("EM2_REFRESH_BATCH_SIZE", "5"))
CONCURRENCY = int(os.environ.get("EM2_REFRESH_CONCURRENCY", "1"))
MAX_BATCHES = int(os.environ.get("EM2_REFRESH_MAX_BATCHES", "0"))
TEMPERATURE = float(os.environ.get("EM2_REFRESH_TEMPERATURE", "0.15"))


@dataclass
class QuestionBlock:
    number: int
    prefix: str
    question_part: str
    answer_heading: str
    answer_body: str
    suffix: str

    @property
    def full_question_md(self) -> str:
        return (self.question_part or "").strip()

    @property
    def topic_line(self) -> str:
        for line in self.question_part.splitlines():
            if line.startswith("**Topic:**"):
                return line.strip()
        return ""

    @property
    def unique_skill(self) -> str:
        for line in self.question_part.splitlines():
            if line.startswith("**Unique skill:**"):
                return line.strip()
        return ""

    @property
    def question_text(self) -> str:
        lines = []
        for line in self.question_part.splitlines():
            if line.startswith("**Topic:**") or line.startswith("**Unique skill:**"):
                continue
            lines.append(line)
        return "\n".join(lines).strip()

    def render(self, answer_body: str) -> str:
        body = answer_body.strip() + "\n\n"
        return f"{self.prefix}{self.question_part}{self.answer_heading}{body}{self.suffix}"


def normalize_question(text: str) -> str:
    text = re.sub(r"\s+", " ", text.lower())
    text = re.sub(r"[^a-z0-9%°().,+\-=/ ]", "", text)
    return text.strip()


def parse_bank(path: Path) -> tuple[str, list[QuestionBlock]]:
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(r"(?m)^## Question (\d+)\s*$", text))
    if not matches:
        raise ValueError(f"No question headings found in {path}")
    intro = text[: matches[0].start()]
    blocks: list[QuestionBlock] = []
    for idx, match in enumerate(matches):
        start = match.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        raw = text[start:end]
        answer_match = re.search(r"(?m)^### Answer (\d+)\s*$", raw)
        if not answer_match:
            raise ValueError(f"Question {match.group(1)} in {path} has no answer heading")
        number = int(match.group(1))
        answer_number = int(answer_match.group(1))
        if number != answer_number:
            raise ValueError(f"Question/answer mismatch in {path}: {number} vs {answer_number}")
        prefix = raw[:0]
        question_part = raw[: answer_match.end()]  # includes answer heading for now
        question_part = raw[: answer_match.start()]
        answer_heading = raw[answer_match.start() : answer_match.end()] + "\n"
        tail = raw[answer_match.end() :]
        suffix = ""
        suffix_match = re.search(r"\n---\s*$", tail)
        if suffix_match:
            answer_body = tail[: suffix_match.start()]
            suffix = "\n---\n\n"
        else:
            answer_body = tail
        blocks.append(
            QuestionBlock(
                number=number,
                prefix=prefix,
                question_part=question_part,
                answer_heading=answer_heading,
                answer_body=answer_body,
                suffix=suffix,
            )
        )
    return intro, blocks


def load_textbook_pages() -> list[dict[str, Any]]:
    raw = json.loads(TEXTBOOK_RAW.read_text(encoding="utf-8"))
    pages = []
    for page in raw["pages"]:
        index = int(page["index"])
        markdown = page.get("markdown", "") or ""
        image_files = []
        for image in page.get("images", []) or []:
            image_id = image.get("id", "")
            source_name = f"108105131_p{index}_{image_id.replace('.', '_')}.png"
            if (TEXTBOOK_IMAGES / source_name).exists():
                image_files.append(source_name)
        pages.append(
            {
                "page": index,
                "text": markdown,
                "images": image_files,
            }
        )
    return pages


STOPWORDS = {
    "the", "and", "for", "with", "from", "that", "this", "into", "has", "have",
    "are", "was", "were", "will", "find", "calculate", "determine", "explain",
    "phase", "machine", "motor", "generator", "connected", "question", "answer",
    "given", "value", "values", "three", "single", "electrical", "machines",
}


def keywords(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9_'-]{2,}", text.lower())
    return {w.strip("'") for w in words if w not in STOPWORDS}


def rank_pages(question: QuestionBlock, pages: list[dict[str, Any]], limit: int = 5) -> list[dict[str, Any]]:
    qwords = keywords(question.topic_line + "\n" + question.unique_skill + "\n" + question.question_text)
    scored = []
    for page in pages:
        ptext = page["text"]
        pwords = keywords(ptext)
        score = len(qwords & pwords)
        if page["images"]:
            score += 2
        if score:
            scored.append((score, page))
    scored.sort(key=lambda item: (-item[0], item[1]["page"]))
    return [page for _, page in scored[:limit]]


def context_for(question: QuestionBlock, pages: list[dict[str, Any]]) -> tuple[str, list[dict[str, str]]]:
    ranked = rank_pages(question, pages)
    context_parts = []
    diagrams = []
    for page in ranked:
        text = re.sub(r"\s+", " ", page["text"]).strip()
        if len(text) > 1600:
            text = text[:1600] + "..."
        context_parts.append(f"[Textbook page {page['page']}]\n{text}")
        for image_name in page["images"]:
            diagrams.append(
                {
                    "id": image_name,
                    "page": str(page["page"]),
                    "target": f"./pyq-assets/textbook/{image_name}",
                }
            )
    return "\n\n".join(context_parts), diagrams[:8]


SYSTEM_PROMPT = """You are an expert Electrical Machines II professor preparing exam-ready Docusaurus Markdown answers.

Rules:
- Return only valid JSON matching the requested schema. No Markdown fences.
- Answers must be textbook-style, explanatory, and self-contained.
- Preserve the question's final numerical result if it is already correct, but expand the derivation and reasoning.
- Use KaTeX for all formulas. Use $...$ for inline math; never use \\(...\\).
- Use $$...$$ display blocks for derivations; never use \\[...\\]:
  $$
  \\begin{aligned}
  ...
  \\end{aligned}
  $$
- Use only KaTeX commands supported by Docusaurus/rehype-katex. Avoid unsupported macros.
- Do not include placeholders, OCR caveats, or unsupported citations.
- If a useful diagram is available from the provided diagram candidates, include it once using Markdown image syntax and a short HTML caption.
- If no suitable diagram is needed, use no diagram.
- Every answer must end with a blockquote beginning exactly: > **Final answer:**
"""


def normalize_answer_md(answer_md: str) -> str:
    """Normalize model Markdown to the site's KaTeX/ASCII conventions."""
    answer_md = answer_md.replace("\u00a0", " ")
    replacements = {
        "\u2011": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
        "\u2026": "...",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u00d7": r"\times",
    }
    for old, new in replacements.items():
        answer_md = answer_md.replace(old, new)

    answer_md = re.sub(r"\\\[\s*(.*?)\s*\\\]", lambda m: "\n$$\n" + m.group(1).strip() + "\n$$\n", answer_md, flags=re.S)
    answer_md = re.sub(r"\\\((.*?)\\\)", lambda m: "$" + m.group(1).strip() + "$", answer_md, flags=re.S)
    answer_md = re.sub(r"\n{3,}", "\n\n", answer_md)
    return answer_md.strip()


def build_batch_prompt(batch: list[QuestionBlock], pages: list[dict[str, Any]]) -> str:
    payload = []
    for q in batch:
        ctx, diagrams = context_for(q, pages)
        payload.append(
            {
                "number": q.number,
                "topic": q.topic_line,
                "unique_skill": q.unique_skill,
                "question": q.question_text,
                "current_answer": q.answer_body.strip()[:5000],
                "textbook_context": ctx,
                "diagram_candidates": diagrams,
            }
        )
    return json.dumps(
        {
            "task": "Regenerate answer_md for each question. Keep question numbers unchanged.",
            "schema": {
                "answers": [
                    {
                        "number": "integer",
                        "answer_md": "complete Markdown answer body only, without the ### Answer heading",
                        "diagram_ids": ["filenames from diagram_candidates actually used"],
                    }
                ]
            },
            "questions": payload,
        },
        ensure_ascii=False,
    )


def call_deepseek(user_prompt: str) -> dict[str, Any]:
    if not API_KEY:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    body: dict[str, Any] = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": TEMPERATURE,
        "max_tokens": 32768,
        "response_format": {"type": "json_object"},
        "thinking": {"type": "enabled"},
        "reasoning_effort": "max",
    }
    data = json.dumps(body).encode("utf-8")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                f"{BASE_URL.rstrip('/')}/v1/chat/completions",
                data=data,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=600) as resp:
                decoded = json.loads(resp.read().decode("utf-8"))
                content = decoded["choices"][0]["message"]["content"]
                if not content or not content.strip():
                    raise ValueError("DeepSeek returned an empty message content")
                content = content.strip()
                if content.startswith("```"):
                    content = re.sub(r"^```(?:json)?\s*", "", content)
                    content = re.sub(r"\s*```$", "", content)
                return json.loads(content)
        except urllib.error.HTTPError as exc:
            body_text = exc.read().decode("utf-8", errors="replace")
            last_error = RuntimeError(f"HTTP {exc.code}: {body_text[:1000]}")
            if exc.code in {408, 409, 429, 500, 502, 503, 504}:
                time.sleep(min(30 * (attempt + 1), 180))
                continue
            raise last_error
        except Exception as exc:  # noqa: BLE001 - retry network/model JSON hiccups
            last_error = exc
            time.sleep(min(20 * (attempt + 1), 120))
    raise RuntimeError(f"DeepSeek call failed after retries: {last_error}")


def copy_diagrams(answer_md: str) -> None:
    TARGET_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    for image_name in sorted(set(re.findall(r"\./pyq-assets/textbook/([^) \n]+)", answer_md))):
        src = TEXTBOOK_IMAGES / image_name
        dst = TARGET_IMAGE_DIR / image_name
        if src.exists() and not dst.exists():
            shutil.copy2(src, dst)


def cache_path(bank_name: str, start: int, end: int) -> Path:
    return CACHE_DIR / f"{bank_name}_{start:03d}_{end:03d}.json"


def generate_batch(bank_name: str, batch: list[QuestionBlock], pages: list[dict[str, Any]]) -> tuple[Path, dict[str, Any]]:
    cp = cache_path(bank_name, batch[0].number, batch[-1].number)
    prompt = build_batch_prompt(batch, pages)
    data = call_deepseek(prompt)
    answers = data.get("answers", [])
    if len(answers) != len(batch):
        raise ValueError(f"{cp.name} returned {len(answers)} answers for {len(batch)} questions")
    cp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return cp, data


def read_cached_batch(cp: Path, expected_len: int) -> dict[str, Any]:
    data = json.loads(cp.read_text(encoding="utf-8"))
    answers = data.get("answers", [])
    if len(answers) != expected_len:
        raise ValueError(f"{cp.name} contains {len(answers)} answers for {expected_len} questions")
    return data


def add_answers_from_batch(generated: dict[int, str], data: dict[str, Any]) -> None:
    for item in data.get("answers", []):
        number = int(item["number"])
        answer_md = normalize_answer_md(item["answer_md"].strip())
        generated[number] = answer_md
        copy_diagrams(answer_md)


def load_or_generate(bank_name: str, blocks: list[QuestionBlock], pages: list[dict[str, Any]]) -> dict[int, str]:
    CACHE_DIR.mkdir(exist_ok=True)
    generated: dict[int, str] = {}
    pending: list[list[QuestionBlock]] = []
    for i in range(0, len(blocks), BATCH_SIZE):
        batch = blocks[i : i + BATCH_SIZE]
        cp = cache_path(bank_name, batch[0].number, batch[-1].number)
        if cp.exists():
            data = read_cached_batch(cp, len(batch))
            add_answers_from_batch(generated, data)
        else:
            pending.append(batch)

    if MAX_BATCHES:
        pending = pending[:MAX_BATCHES]

    if pending:
        print(f"[INFO] {bank_name}: generating {len(pending)} batches with concurrency={CONCURRENCY}", flush=True)
    if CONCURRENCY <= 1:
        for batch in pending:
            print(f"[GEN] {bank_name} Q{batch[0].number}-Q{batch[-1].number}", flush=True)
            cp, data = generate_batch(bank_name, batch, pages)
            print(f"[OK] {cp.name}", flush=True)
            add_answers_from_batch(generated, data)
    else:
        with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
            future_map = {}
            for batch in pending:
                print(f"[GEN] {bank_name} Q{batch[0].number}-Q{batch[-1].number}", flush=True)
                future = executor.submit(generate_batch, bank_name, batch, pages)
                future_map[future] = batch
            errors: list[str] = []
            for future in as_completed(future_map):
                batch = future_map[future]
                cp = cache_path(bank_name, batch[0].number, batch[-1].number)
                try:
                    written_cp, data = future.result()
                    print(f"[OK] {written_cp.name}", flush=True)
                    add_answers_from_batch(generated, data)
                except Exception as exc:  # noqa: BLE001 - collect all failed batches
                    error_path = cp.with_suffix(".error.txt")
                    error_path.write_text(str(exc), encoding="utf-8")
                    print(f"[ERR] {cp.name}: {exc}", flush=True)
                    errors.append(f"{cp.name}: {exc}")
            if errors:
                raise RuntimeError("Batch generation failed:\n" + "\n".join(errors))
    return generated


def rebuild(path: Path, intro: str, blocks: list[QuestionBlock], answers: dict[int, str]) -> None:
    parts = [intro]
    for block in blocks:
        answer = answers.get(block.number, block.answer_body.strip())
        parts.append(block.render(answer))
    path.write_text("".join(parts).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    if not FULL_BANK.exists() or not UNIQUE_BANK.exists():
        raise FileNotFoundError("Target EM2 bank files are missing")
    pages = load_textbook_pages()
    full_intro, full_blocks = parse_bank(FULL_BANK)
    unique_intro, unique_blocks = parse_bank(UNIQUE_BANK)

    print(f"[INFO] Full bank: {len(full_blocks)} questions")
    print(f"[INFO] Unique bank: {len(unique_blocks)} questions")

    full_answers = load_or_generate("full", full_blocks, pages)
    if len(full_answers) != len(full_blocks):
        raise RuntimeError(f"Generated {len(full_answers)} of {len(full_blocks)} full-bank answers")

    by_question = {normalize_question(q.question_text): full_answers[q.number] for q in full_blocks}
    unique_answers: dict[int, str] = {}
    missing_unique: list[QuestionBlock] = []
    for q in unique_blocks:
        answer = by_question.get(normalize_question(q.question_text))
        if answer:
            unique_answers[q.number] = answer
        else:
            missing_unique.append(q)

    if missing_unique:
        print(f"[INFO] Generating {len(missing_unique)} unique-only answers")
        unique_answers.update(load_or_generate("unique", missing_unique, pages))

    if len(unique_answers) != len(unique_blocks):
        raise RuntimeError(f"Generated {len(unique_answers)} of {len(unique_blocks)} unique-bank answers")

    rebuild(FULL_BANK, full_intro, full_blocks, full_answers)
    rebuild(UNIQUE_BANK, unique_intro, unique_blocks, unique_answers)
    print("[DONE] Rebuilt EM2 answer banks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
