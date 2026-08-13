import hashlib
import json
import os
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

import requests


API_BASE = os.environ.get("DEEPTUTOR_API_BASE_URL", "http://deeptutor:8001").rstrip("/")
KB_NAME = os.environ.get("DEEPTUTOR_KB_NAME", "miteee-notes").strip() or "miteee-notes"
DOCS_ROOT = Path("/app/miteee-docs")
GENERATED_ROOT = Path("/app/miteee-generated")
CURRENT_AFFAIRS_ROOT = Path("/app/miteee-current-affairs")
MANIFEST_PATH = Path("/app/data/miteee-notes-manifest.json")
SYNC_LOCK_PATH = Path("/app/data/miteee-corpus-sync.lock")
QUESTION_CHUNK_BYTES = 750_000


@dataclass(frozen=True)
class CorpusDocument:
    path: Path
    relative_path: str


def public_notes():
    extensions = {".md", ".mdx", ".txt"}
    if not DOCS_ROOT.exists():
        return []
    return [
        CorpusDocument(path, f"notes/{path.relative_to(DOCS_ROOT).as_posix()}")
        for path in sorted(DOCS_ROOT.rglob("*"))
        if path.is_file() and path.suffix.lower() in extensions
    ]


def render_question(question, position):
    if not isinstance(question, dict):
        return f"## Question {position}\n\n{json.dumps(question, ensure_ascii=False)}\n"

    identifier = str(question.get("id") or position)
    heading = str(question.get("stem") or question.get("question") or question.get("prompt") or "Question").strip()
    lines = [f"## Question {position}: {identifier}", "", heading, ""]

    options = question.get("options")
    if isinstance(options, list):
        for index, option in enumerate(options):
            if isinstance(option, dict):
                label = option.get("id") or option.get("label") or chr(65 + index)
                text = option.get("text") or option.get("value") or ""
            else:
                label, text = chr(65 + index), option
            lines.append(f"- {label}: {text}")
        lines.append("")

    answer = question.get("correctOption", question.get("answer"))
    if answer not in (None, ""):
        lines.extend([f"**Answer:** {answer}", ""])
    explanation = question.get("explanation") or question.get("solution")
    if explanation:
        lines.extend([f"**Explanation:** {explanation}", ""])

    metadata_fields = ["exam", "tier", "year", "shift", "section", "topic", "subtopic", "difficulty", "source"]
    metadata = [f"{key}: {question[key]}" for key in metadata_fields if question.get(key) not in (None, "")]
    if metadata:
        lines.extend([f"**Context:** {'; '.join(metadata)}", ""])
    tags = question.get("conceptTags") or question.get("tags")
    if isinstance(tags, list) and tags:
        lines.extend([f"**Concept tags:** {', '.join(map(str, tags))}", ""])
    return "\n".join(lines)


def generated_question_documents(temp_root):
    documents = []
    if not GENERATED_ROOT.exists():
        return documents

    for source_path in sorted(GENERATED_ROOT.glob("exams/**/questions.json")):
        questions = json.loads(source_path.read_text(encoding="utf-8"))
        if not isinstance(questions, list):
            continue
        exam_path = source_path.parent.relative_to(GENERATED_ROOT / "exams").as_posix()
        chunk_parts = [f"# {exam_path} question bank\n"]
        chunk_size = len(chunk_parts[0].encode("utf-8"))
        chunk_number = 1

        def flush():
            nonlocal chunk_parts, chunk_size, chunk_number
            if len(chunk_parts) == 1:
                return
            target = temp_root / "questions" / exam_path / f"questions-{chunk_number:04d}.md"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("\n".join(chunk_parts), encoding="utf-8")
            documents.append(CorpusDocument(target, target.relative_to(temp_root).as_posix()))
            chunk_number += 1
            chunk_parts = [f"# {exam_path} question bank\n"]
            chunk_size = len(chunk_parts[0].encode("utf-8"))

        for position, question in enumerate(questions, start=1):
            rendered = render_question(question, position)
            rendered_size = len(rendered.encode("utf-8"))
            if len(chunk_parts) > 1 and chunk_size + rendered_size > QUESTION_CHUNK_BYTES:
                flush()
            chunk_parts.append(rendered)
            chunk_size += rendered_size
        flush()
    return documents


def current_affairs_documents(temp_root):
    documents = []
    daily_root = CURRENT_AFFAIRS_ROOT / "daily"
    if not daily_root.exists():
        return documents
    for source_path in sorted(daily_root.glob("*.json")):
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        target = temp_root / "current-affairs" / f"{source_path.stem}.md"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(
            f"# SSC CGL current affairs: {source_path.stem}\n\n"
            f"```json\n{json.dumps(payload, ensure_ascii=False, indent=2)}\n```\n",
            encoding="utf-8"
        )
        documents.append(CorpusDocument(target, target.relative_to(temp_root).as_posix()))
    return documents


def corpus_documents(temp_root):
    return sorted(
        public_notes() + generated_question_documents(temp_root) + current_affairs_documents(temp_root),
        key=lambda document: document.relative_path
    )


def corpus_digest(documents):
    digest = hashlib.sha256()
    for document in documents:
        digest.update(document.relative_path.encode("utf-8"))
        digest.update(b"\0")
        digest.update(document.path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def wait_for_api():
    for _ in range(90):
        try:
            response = requests.get(f"{API_BASE}/api/v1/knowledge/list", timeout=5)
            if response.ok:
                return
        except requests.RequestException:
            pass
        time.sleep(2)
    raise RuntimeError("DeepTutor API did not become ready.")


def knowledge_bases():
    response = requests.get(f"{API_BASE}/api/v1/knowledge/list", timeout=20)
    response.raise_for_status()
    return response.json()


def stored_digest():
    try:
        value = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        return value.get("sha256") if isinstance(value, dict) else None
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def wait_for_absence():
    for _ in range(30):
        if not any(item.get("name") == KB_NAME for item in knowledge_bases()):
            return
        time.sleep(1)
    raise RuntimeError(f"Knowledge base {KB_NAME} was not removed in time.")


def wait_for_index():
    for _ in range(900):
        response = requests.get(f"{API_BASE}/api/v1/knowledge/{quote(KB_NAME)}/progress", timeout=20)
        response.raise_for_status()
        payload = response.json()
        progress = payload.get("progress", payload) if isinstance(payload, dict) else {}
        stage = str(progress.get("stage", "")).lower()
        if stage in {"completed", "complete", "ready"}:
            return
        if stage == "error":
            raise RuntimeError(str(progress.get("message") or progress.get("error") or "DeepTutor indexing failed."))
        time.sleep(2)
    raise RuntimeError("DeepTutor corpus indexing timed out.")


def rebuild(documents, digest):
    existing = any(item.get("name") == KB_NAME for item in knowledge_bases())
    if existing:
        response = requests.delete(f"{API_BASE}/api/v1/knowledge/{quote(KB_NAME)}", timeout=60)
        response.raise_for_status()
        wait_for_absence()

    handles = []
    multipart = []
    form = [("name", KB_NAME), ("rag_provider", "llamaindex")]
    try:
        for document in documents:
            handle = document.path.open("rb")
            handles.append(handle)
            multipart.append(("files", (document.path.name, handle, "text/markdown")))
            form.append(("rel_paths", document.relative_path))
        response = requests.post(
            f"{API_BASE}/api/v1/knowledge/create",
            data=form,
            files=multipart,
            timeout=600
        )
        response.raise_for_status()
    finally:
        for handle in handles:
            handle.close()

    wait_for_index()
    source_counts = {
        "notes": sum(document.relative_path.startswith("notes/") for document in documents),
        "question_chunks": sum(document.relative_path.startswith("questions/") for document in documents),
        "current_affairs": sum(document.relative_path.startswith("current-affairs/") for document in documents)
    }
    MANIFEST_PATH.write_text(json.dumps({
        "knowledge_base": KB_NAME,
        "sha256": digest,
        "documents": len(documents),
        "sources": source_counts,
        "synced_at": int(time.time())
    }, indent=2) + "\n", encoding="utf-8")


def main():
    import fcntl

    SYNC_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SYNC_LOCK_PATH.open("a+", encoding="utf-8") as sync_lock:
        try:
            fcntl.flock(sync_lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print("DeepTutor sync: another corpus refresh is already running; I skipped this check.")
            return

        with tempfile.TemporaryDirectory(prefix="miteee-deeptutor-corpus-") as temporary_directory:
            documents = corpus_documents(Path(temporary_directory))
            if not documents:
                raise RuntimeError("I found no public study material to index.")
            digest = corpus_digest(documents)
            wait_for_api()
            existing = any(item.get("name") == KB_NAME for item in knowledge_bases())
            if existing and stored_digest() == digest:
                print(f"DeepTutor sync: {len(documents)} corpus documents are already current.")
                return
            rebuild(documents, digest)
            print(f"DeepTutor sync: indexed {len(documents)} corpus documents into {KB_NAME}.")


if __name__ == "__main__":
    main()
