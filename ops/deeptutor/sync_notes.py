import hashlib
import json
import os
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

import requests


API_BASE = os.environ.get("DEEPTUTOR_API_BASE_URL", "http://deeptutor:8001").rstrip("/")
KB_NAME = os.environ.get("DEEPTUTOR_KB_NAME", "miteee-notes").strip() or "miteee-notes"
DOCS_ROOT = Path("/app/miteee-docs")
MANIFEST_PATH = Path("/app/data/miteee-notes-manifest.json")
SYNC_LOCK_PATH = Path("/app/data/miteee-corpus-sync.lock")


@dataclass(frozen=True)
class CorpusDocument:
    path: Path
    relative_path: str


def public_notes():
    extensions = {".md", ".mdx"}
    if not DOCS_ROOT.exists():
        return []
    return [
        CorpusDocument(path, f"notes/{path.relative_to(DOCS_ROOT).as_posix()}")
        for path in sorted(DOCS_ROOT.rglob("*"))
        if path.is_file() and path.suffix.lower() in extensions
    ]


def corpus_documents():
    return sorted(public_notes(), key=lambda document: document.relative_path)


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
    timeout_seconds = max(60, int(os.environ.get("DEEPTUTOR_INDEX_TIMEOUT_SECONDS", "7200")))
    for _ in range(timeout_seconds // 2):
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


def write_manifest(documents, digest):
    MANIFEST_PATH.write_text(json.dumps({
        "knowledge_base": KB_NAME,
        "sha256": digest,
        "documents": len(documents),
        "sources": {"notes": len(documents)},
        "synced_at": int(time.time())
    }, indent=2) + "\n", encoding="utf-8")


def rebuild(documents, digest):
    existing = next((item for item in knowledge_bases() if item.get("name") == KB_NAME), None)
    if existing and str(existing.get("status", "")).lower() == "processing" and not MANIFEST_PATH.exists():
        print(f"DeepTutor corpus {KB_NAME} is already indexing; waiting for the existing first build.", flush=True)
        wait_for_index()
        write_manifest(documents, digest)
        return
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
    write_manifest(documents, digest)


def main():
    import fcntl

    SYNC_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SYNC_LOCK_PATH.open("a+", encoding="utf-8") as sync_lock:
        try:
            fcntl.flock(sync_lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print("DeepTutor sync: another corpus refresh is already running; I skipped this check.")
            return

        documents = corpus_documents()
        if not documents:
            raise RuntimeError("I found no Markdown notes to index.")
        digest = corpus_digest(documents)
        wait_for_api()
        existing = any(item.get("name") == KB_NAME for item in knowledge_bases())
        if existing and stored_digest() == digest:
            print(f"DeepTutor sync: {len(documents)} Markdown notes are already current.")
            return
        rebuild(documents, digest)
        print(f"DeepTutor sync: indexed {len(documents)} Markdown notes into {KB_NAME}.")


if __name__ == "__main__":
    main()
