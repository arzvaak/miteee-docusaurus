#!/usr/bin/env python3
"""Direct DeepSeek repair pass for EM2 PYQ banks.

This intentionally does not use the old OCR/textbook diagram generator. It:
- parses the current full and unique banks,
- downloads a fixed set of web-sourced diagrams into static assets,
- asks DeepSeek to rewrite full-bank answers in concise exam style,
- rebuilds the unique bank from the matching full-bank answers,
- rejects raw HTML, textbook image paths, unsupported math delimiters, and placeholders.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
FULL_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-answer-bank.md"
UNIQUE_BANK = ROOT / "docs" / "sem5" / "em2" / "pyq-unique-question-bank.md"
MANIFEST = ROOT / "scripts" / "em2_pyq_refresh" / "web_diagrams.json"
CACHE_DIR = ROOT / ".em2-repair-cache"

MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
BATCH_SIZE = int(os.environ.get("EM2_REPAIR_BATCH_SIZE", "3"))
CONCURRENCY = int(os.environ.get("EM2_REPAIR_CONCURRENCY", "8"))
MAX_BATCHES = int(os.environ.get("EM2_REPAIR_MAX_BATCHES", "0"))
TEMPERATURE = float(os.environ.get("EM2_REPAIR_TEMPERATURE", "0.1"))


@dataclass
class QuestionBlock:
    number: int
    question_part: str
    answer_heading: str
    answer_body: str
    suffix: str

    @property
    def topic_line(self) -> str:
        for line in self.question_part.splitlines():
            if line.startswith("**Topic:**") or line.startswith("**Unique skill:**"):
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
        return f"{self.question_part}{self.answer_heading}{answer_body.strip()}\n\n{self.suffix}"


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
            raise ValueError(f"Question/answer mismatch: {number} vs {answer_number}")
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
        blocks.append(QuestionBlock(number, question_part, answer_heading, answer_body, suffix))
    return intro, blocks


def normalize_question(text: str) -> str:
    text = re.sub(r"\s+", " ", text.lower())
    text = re.sub(r"[^a-z0-9%°().,+\-=/ ]", "", text)
    return text.strip()


def safe_filename(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]+", "_", name)


def load_diagrams() -> list[dict[str, Any]]:
    diagrams = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for item in diagrams:
        item["file"] = safe_filename(item["file"])
        item["path"] = item["url"]
    return diagrams


STOPWORDS = {
    "the", "and", "for", "with", "from", "that", "this", "into", "has", "have",
    "are", "was", "were", "will", "find", "calculate", "determine", "explain",
    "phase", "machine", "motor", "generator", "connected", "question", "answer",
    "given", "value", "values", "three", "single", "electrical", "machines",
}


def words(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z][a-z0-9-]{2,}", text.lower()) if w not in STOPWORDS}


def diagram_candidates(block: QuestionBlock, diagrams: list[dict[str, Any]], limit: int = 4) -> list[dict[str, str]]:
    qwords = words(block.topic_line + "\n" + block.question_text)
    scored: list[tuple[int, dict[str, Any]]] = []
    for item in diagrams:
        dwords = set(item.get("keywords", [])) | words(item["title"])
        score = len(qwords & dwords)
        if score:
            scored.append((score, item))
    scored.sort(key=lambda pair: (-pair[0], pair[1]["id"]))
    return [
        {
            "id": item["id"],
            "title": item["title"],
            "path": item["path"],
            "source": item["source"],
        }
        for _, item in scored[:limit]
    ]


SYSTEM_PROMPT = """You are an Electrical Machines II examiner rewriting answers for a Docusaurus notes site.

Return only valid JSON. No Markdown fences.

Style requirements:
- Write like a strong exam answer: concise, neat, stepwise, enough explanation to score marks.
- Do not write textbook dumps. Target 250-550 words for theory answers and 350-750 words for numerical answers.
- Use short sections only when useful: Concept, Given, Solution, Final answer.
- Every answer must end with exactly one blockquote starting: > **Final answer:**

Docusaurus KaTeX requirements:
- Inline math only as $...$.
- Display math only as:
  $$
  \\begin{aligned}
  ...
  \\end{aligned}
  $$
- Never use \\(...\\), \\[...\\], raw HTML, <figure>, <img>, tables inside math, Unicode bullets inside math, or unescaped percent signs inside math.
- Escape percent signs in math as \\%.
- Use \\Omega, \\mu, \\times, \\sqrt{}, \\frac{}{}, \\text{}.
- Avoid unsupported macros and avoid bare text paragraphs inside $$.
- Keep punctuation outside display math where possible.

Diagram requirements:
- Use at most one diagram only when it genuinely helps.
- Use only the provided web_diagram_candidates.
- If using a diagram, insert Markdown exactly like:
  ![short alt text](https://commons.wikimedia.org/wiki/Special:Redirect/file/FILENAME)
  *Figure: one short caption. Source: SOURCE.*
- Do not use textbook/OCR image paths and do not invent image paths.
"""


def normalize_answer_md(text: str) -> str:
    replacements = {
        "\u00a0": " ",
        "\u202f": " ",
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
        "\u03bc": r"\mu",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r"\\\[\s*(.*?)\s*\\\]", lambda m: "\n$$\n" + m.group(1).strip() + "\n$$\n", text, flags=re.S)
    text = re.sub(r"\\\((.*?)\\\)", lambda m: "$" + m.group(1).strip() + "$", text, flags=re.S)
    parts = text.split("$$")
    for i in range(1, len(parts), 2):
        parts[i] = re.sub(r"(?<!\\)%", r"\\%", parts[i])
    text = "$$".join(parts)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def local_validate_answer(answer: str, allowed_paths: set[str]) -> list[str]:
    errors: list[str] = []
    if re.search(r"(?<!\\)\\[()]", answer) or re.search(r"(?<!\\)\\\[", answer) or re.search(r"(?<!\\)\\\]", answer):
        errors.append("contains unsupported math delimiters")
    if "<figure" in answer.lower() or "<img" in answer.lower() or "<table" in answer.lower():
        errors.append("contains raw HTML")
    if "./pyq-assets/textbook/" in answer or "/pyq-assets/textbook/" in answer:
        errors.append("contains textbook/OCR image path")
    if answer.count("$$") % 2:
        errors.append("unbalanced display math delimiters")
    if "> **Final answer:**" not in answer:
        errors.append("missing final answer blockquote")
    if re.search(r"\b(TBD|TODO|placeholder|not available|OCR)\b", answer, flags=re.I):
        errors.append("contains placeholder/OCR wording")
    for path in re.findall(r"!\[[^\]]*]\(([^)]+)\)", answer):
        if path.startswith("https://commons.wikimedia.org/wiki/Special:Redirect/file/") and path not in allowed_paths:
            errors.append(f"unknown diagram path {path}")
        elif not path.startswith("https://commons.wikimedia.org/wiki/Special:Redirect/file/"):
            errors.append(f"invalid image path {path}")
    for block in answer.split("$$")[1::2]:
        if re.search(r"(?<!\\)%", block):
            errors.append("unescaped percent inside display math")
        if "![ " in block or "![" in block or "<" in block:
            errors.append("markup inside display math")
    return errors


def call_deepseek(prompt: str) -> dict[str, Any]:
    if not API_KEY:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": TEMPERATURE,
        "max_tokens": 24000,
        "response_format": {"type": "json_object"},
        "thinking": {"type": "enabled"},
        "reasoning_effort": "max",
    }
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                f"{BASE_URL}/v1/chat/completions",
                data=data,
                headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=600) as resp:
                decoded = json.loads(resp.read().decode("utf-8"))
            content = decoded["choices"][0]["message"]["content"].strip()
            if content.startswith("```"):
                content = re.sub(r"^```(?:json)?\s*", "", content)
                content = re.sub(r"\s*```$", "", content)
            return json.loads(content)
        except urllib.error.HTTPError as exc:
            last_error = RuntimeError(f"HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')[:1000]}")
            if exc.code in {408, 409, 429, 500, 502, 503, 504}:
                time.sleep(min(30 * (attempt + 1), 180))
                continue
            raise last_error
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(min(20 * (attempt + 1), 120))
    raise RuntimeError(f"DeepSeek failed after retries: {last_error}")


def build_prompt(batch: list[QuestionBlock], diagrams: list[dict[str, Any]]) -> str:
    questions = []
    for block in batch:
        questions.append(
            {
                "number": block.number,
                "topic": block.topic_line,
                "question": block.question_text,
                "current_bad_answer": block.answer_body.strip()[:5500],
                "web_diagram_candidates": diagram_candidates(block, diagrams),
            }
        )
    return json.dumps(
        {
            "task": "Rewrite each answer_md from scratch in concise exam style, fixing all Docusaurus KaTeX and replacing bad diagrams with provided web diagrams only.",
            "schema": {
                "answers": [
                    {
                        "number": "integer",
                        "answer_md": "Markdown answer body only, no heading",
                    }
                ]
            },
            "questions": questions,
        },
        ensure_ascii=False,
    )


def cache_key(batch: list[QuestionBlock]) -> str:
    raw = "|".join(f"{b.number}:{hashlib.sha1((b.question_text + b.answer_body).encode('utf-8')).hexdigest()}" for b in batch)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]


def generate_batch(batch: list[QuestionBlock], diagrams: list[dict[str, Any]], allowed_paths: set[str]) -> tuple[Path, dict[int, str]]:
    CACHE_DIR.mkdir(exist_ok=True)
    cp = CACHE_DIR / f"full_{batch[0].number:03d}_{batch[-1].number:03d}_{cache_key(batch)}.json"
    if cp.exists():
        data = json.loads(cp.read_text(encoding="utf-8"))
    else:
        data = call_deepseek(build_prompt(batch, diagrams))
        cp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    answers = data.get("answers", [])
    if len(answers) != len(batch):
        raise ValueError(f"{cp.name}: returned {len(answers)} answers for {len(batch)} questions")
    result: dict[int, str] = {}
    expected = {b.number for b in batch}
    for item in answers:
        number = int(item["number"])
        if number not in expected:
            raise ValueError(f"{cp.name}: unexpected answer number {number}")
        answer = normalize_answer_md(str(item["answer_md"]))
        errors = local_validate_answer(answer, allowed_paths)
        if errors:
            raise ValueError(f"{cp.name} Q{number}: {'; '.join(errors)}")
        result[number] = answer
    return cp, result


def rebuild(path: Path, intro: str, blocks: list[QuestionBlock], answers: dict[int, str]) -> None:
    path.write_text("".join([intro, *[b.render(answers[b.number]) for b in blocks]]).rstrip() + "\n", encoding="utf-8")


def map_unique_answers(full_blocks: list[QuestionBlock], full_answers: dict[int, str], unique_blocks: list[QuestionBlock]) -> dict[int, str]:
    full_norm = [(normalize_question(b.question_text), b.number) for b in full_blocks]
    unique_answers: dict[int, str] = {}
    mappings: list[tuple[int, int, float]] = []
    for ub in unique_blocks:
        uq = normalize_question(ub.question_text)
        best = max(((SequenceMatcher(None, uq, fq).ratio(), fn) for fq, fn in full_norm), default=(0.0, -1))
        if best[0] < 0.72:
            raise RuntimeError(f"No confident full-bank match for unique Q{ub.number}; best full Q{best[1]} score {best[0]:.3f}")
        unique_answers[ub.number] = full_answers[best[1]]
        mappings.append((ub.number, best[1], round(best[0], 3)))
    (CACHE_DIR / "unique_mappings.json").write_text(json.dumps(mappings, indent=2), encoding="utf-8")
    print("[INFO] unique mappings:", mappings, flush=True)
    return unique_answers


def main() -> int:
    full_intro, full_blocks = parse_bank(FULL_BANK)
    unique_intro, unique_blocks = parse_bank(UNIQUE_BANK)
    if len(full_blocks) != 141 or len(unique_blocks) != 52:
        raise RuntimeError(f"Unexpected counts: full={len(full_blocks)} unique={len(unique_blocks)}")
    diagrams = load_diagrams()
    allowed_paths = {item["path"] for item in diagrams}
    print(f"[INFO] full={len(full_blocks)} unique={len(unique_blocks)} diagrams={len(diagrams)}", flush=True)
    batches = [full_blocks[i : i + BATCH_SIZE] for i in range(0, len(full_blocks), BATCH_SIZE)]
    if MAX_BATCHES:
        batches = batches[:MAX_BATCHES]
    full_answers: dict[int, str] = {}
    errors: list[str] = []
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        future_map = {executor.submit(generate_batch, batch, diagrams, allowed_paths): batch for batch in batches}
        for future in as_completed(future_map):
            batch = future_map[future]
            try:
                cp, answers = future.result()
                full_answers.update(answers)
                print(f"[OK] {cp.name}", flush=True)
            except Exception as exc:  # noqa: BLE001
                msg = f"Q{batch[0].number}-{batch[-1].number}: {exc}"
                print(f"[ERR] {msg}", flush=True)
                errors.append(msg)
    if errors:
        raise RuntimeError("Repair generation failed:\n" + "\n".join(errors))
    if len(full_answers) != len(full_blocks):
        raise RuntimeError(f"Only generated {len(full_answers)} of {len(full_blocks)} full answers")
    unique_answers = map_unique_answers(full_blocks, full_answers, unique_blocks)
    rebuild(FULL_BANK, full_intro, full_blocks, full_answers)
    rebuild(UNIQUE_BANK, unique_intro, unique_blocks, unique_answers)
    print("[DONE] direct DeepSeek repair complete", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
