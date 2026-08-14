import json
import os
from pathlib import Path


SETTINGS_DIR = Path("/app/data/user/settings")
CATALOG_PATH = SETTINGS_DIR / "model_catalog.json"


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
    api_key = os.environ.get("MISTRAL_API_KEY", "").strip()
    SETTINGS_DIR.mkdir(parents=True, exist_ok=True)
    catalog = read_catalog()
    catalog["version"] = 1
    llm_model = os.environ.get("MISTRAL_MODEL", "mistral-small-latest").strip() or "mistral-small-latest"
    embedding_model = (
        os.environ.get("DEEPTUTOR_EMBEDDING_MODEL", "miteee-all-minilm").strip()
        or "miteee-all-minilm"
    )
    embedding_url = os.environ.get("DEEPTUTOR_EMBEDDING_URL", "http://ollama:11434/api/embed").strip()
    try:
        embedding_dimension = int(os.environ.get("DEEPTUTOR_EMBEDDING_DIMENSION", "384"))
    except ValueError as exc:
        raise SystemExit("DEEPTUTOR_EMBEDDING_DIMENSION must be an integer") from exc

    if api_key:
        upsert_profile(service(catalog, "llm"), {
            "id": "miteee-mistral-llm",
            "name": "MITEEE Mistral",
            "binding": "openai",
            "base_url": "https://api.mistral.ai/v1",
            "api_key": api_key,
            "api_version": "",
            "extra_headers": {},
            "models": [{
                "id": "miteee-mistral-llm-model",
                "name": llm_model,
                "model": llm_model,
                "context_window": 128000
            }]
        }, "miteee-mistral-llm-model")
    else:
        print("DeepTutor bootstrap: MISTRAL_API_KEY is absent; I left the LLM catalog unchanged.")

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
    print(f"DeepTutor bootstrap: configured {llm_model} with local {embedding_model} embeddings.")


if __name__ == "__main__":
    main()
