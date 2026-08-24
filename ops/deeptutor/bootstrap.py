import json
import os
from pathlib import Path


SETTINGS_DIR = Path("/app/data/user/settings")
CATALOG_PATH = SETTINGS_DIR / "model_catalog.json"
LLAMAINDEX_PATH = SETTINGS_DIR / "llamaindex.json"


def read_catalog():
    try:
        value = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def service(catalog, name):
    services = catalog.setdefault("services", {})
    return services.setdefault(name, {"active_profile_id": None, "active_model_id": None, "profiles": []})


def upsert_profile(target, profile, model_id):
    profiles = target.setdefault("profiles", [])
    index = next((index for index, item in enumerate(profiles) if item.get("id") == profile["id"]), None)
    if index is None:
        profiles.append(profile)
    else:
        profiles[index] = profile
    target["active_profile_id"] = profile["id"]
    target["active_model_id"] = model_id


def main():
    SETTINGS_DIR.mkdir(parents=True, exist_ok=True)
    catalog = read_catalog()
    catalog["version"] = 1
    llm_model = os.environ.get("OPENCODE_GO_MODEL", "deepseek-v4-flash").strip() or "deepseek-v4-flash"
    embedding_model = (
        os.environ.get("DEEPTUTOR_EMBEDDING_MODEL", "miteee-all-minilm").strip()
        or "miteee-all-minilm"
    )
    embedding_url = os.environ.get("DEEPTUTOR_EMBEDDING_URL", "http://ollama:11434/api/embed").strip()
    try:
        embedding_dimension = int(os.environ.get("DEEPTUTOR_EMBEDDING_DIMENSION", "384"))
    except ValueError as exc:
        raise SystemExit("DEEPTUTOR_EMBEDDING_DIMENSION must be an integer") from exc

    llm = service(catalog, "llm")
    existing_go = next(
        (profile for profile in llm.get("profiles", []) if profile.get("id") == "miteee-opencode-go"),
        {},
    )
    api_key = os.environ.get("OPENCODE_GO_API_KEY", "").strip() or str(
        existing_go.get("api_key", "")
    ).strip()
    if api_key:
        upsert_profile(llm, {
            "id": "miteee-opencode-go",
            "name": "MITEEE OpenCode Go",
            "binding": "custom",
            "base_url": "https://opencode.ai/zen/go/v1",
            "api_key": api_key,
            "api_version": "",
            "extra_headers": {},
            "models": [{
                "id": "miteee-opencode-go-deepseek-flash",
                "name": llm_model,
                "model": llm_model,
                "context_window": 1000000
            }]
        }, "miteee-opencode-go-deepseek-flash")
        llm["profiles"] = [
            profile for profile in llm.get("profiles", [])
            if profile.get("id") != "miteee-mistral-llm"
        ]
    else:
        llm["profiles"] = [
            profile for profile in llm.get("profiles", [])
            if profile.get("id") != "miteee-mistral-llm"
        ]
        if llm.get("active_profile_id") == "miteee-mistral-llm":
            llm["active_profile_id"] = None
            llm["active_model_id"] = None
        print("DeepTutor bootstrap: the persisted OpenCode Go credential is absent; I disabled the old Mistral default.")

    upsert_profile(service(catalog, "embedding"), {
        "id": "miteee-local-embedding",
        "name": "MITEEE Local Embeddings",
        "binding": "ollama",
        "base_url": embedding_url,
        "api_key": "",
        "api_version": "",
        "extra_headers": {},
        "models": [{
            "id": "miteee-local-embedding-model",
            "name": embedding_model,
            "model": embedding_model,
            "dimension": embedding_dimension
        }]
    }, "miteee-local-embedding-model")

    service(catalog, "search")
    CATALOG_PATH.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")
    CATALOG_PATH.chmod(0o600)

    try:
        llamaindex = json.loads(LLAMAINDEX_PATH.read_text(encoding="utf-8"))
        if not isinstance(llamaindex, dict):
            llamaindex = {}
    except (FileNotFoundError, json.JSONDecodeError):
        llamaindex = {}
    llamaindex.update({"version": 1, "chunk_size": 508, "chunk_overlap": 50})
    LLAMAINDEX_PATH.write_text(json.dumps(llamaindex, indent=2) + "\n", encoding="utf-8")
    LLAMAINDEX_PATH.chmod(0o600)
    provider_message = f"OpenCode Go {llm_model}" if api_key else "no chat provider"
    print(f"DeepTutor bootstrap: configured {provider_message} with local {embedding_model} embeddings.")


if __name__ == "__main__":
    main()
