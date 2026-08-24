"""Internal device-code bridge for DeepTutor's OpenAI Codex provider.

The browser callback used by DeepTutor is fixed to localhost, which cannot reach
a remote deployment without giving every learner SSH access. This sidecar uses
Codex's official device-code flow and commits the resulting tokens through the
same audited DeepTutor credential store and model-catalog code.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
import time
from typing import Any

from fastapi import FastAPI, HTTPException
import httpx

from deeptutor.services.codex_auth.constants import (
    CODEX_OAUTH_CLIENT_ID,
    CODEX_OAUTH_ISSUER,
)
from deeptutor.services.codex_auth.contracts import CodexAuthError
from deeptutor.services.codex_auth.oauth import CodexOAuthClient
from deeptutor.services.codex_auth.service import (
    get_codex_oauth_service,
    sync_codex_catalog,
)


DEVICE_CODE_TTL_SECONDS = 15 * 60
DEVICE_CODE_REDIRECT_URI = f"{CODEX_OAUTH_ISSUER}/deviceauth/callback"
DEVICE_CODE_URL = f"{CODEX_OAUTH_ISSUER}/codex/device"
USER_CODE_ENDPOINT = f"{CODEX_OAUTH_ISSUER}/api/accounts/deviceauth/usercode"
TOKEN_POLL_ENDPOINT = f"{CODEX_OAUTH_ISSUER}/api/accounts/deviceauth/token"


@dataclass
class DeviceOperation:
    operation_id: str
    device_auth_id: str
    user_code: str
    interval: int
    expected_generation: int
    deadline: float
    state: str = "authorizing"
    error_code: str | None = None
    task: asyncio.Task[None] | None = None


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
operation: DeviceOperation | None = None
operation_lock = asyncio.Lock()


def public_payload(current: DeviceOperation | None) -> dict[str, Any]:
    if current is not None and current.state == "authorizing":
        return {
            "connection": "authorizing",
            "operation_state": current.state,
            "user_code": current.user_code,
            "verification_url": DEVICE_CODE_URL,
            "expires_in": max(0, int(current.deadline - time.monotonic())),
            "error_code": None,
        }

    upstream = get_codex_oauth_service().public_status()
    connection = upstream.get("connection", "disconnected")
    if current is not None and current.state == "failed":
        connection = "error"
    return {
        "connection": connection,
        "operation_state": current.state if current is not None else None,
        "user_code": None,
        "verification_url": None,
        "expires_in": None,
        "error_code": current.error_code if current is not None else upstream.get("error_code"),
    }


async def request_device_code() -> tuple[str, str, int]:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(USER_CODE_ENDPOINT, json={"client_id": CODEX_OAUTH_CLIENT_ID})
    if response.status_code == 404:
        raise HTTPException(503, "ChatGPT device login is not enabled for this account or workspace.")
    if not response.is_success:
        raise HTTPException(502, "ChatGPT could not start device login.")
    try:
        payload = response.json()
        device_auth_id = payload["device_auth_id"]
        user_code = payload.get("user_code") or payload["usercode"]
        interval = int(str(payload.get("interval", "5")).strip())
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(502, "ChatGPT returned an invalid device-login response.") from exc
    if not isinstance(device_auth_id, str) or not device_auth_id:
        raise HTTPException(502, "ChatGPT returned an invalid device-login response.")
    if not isinstance(user_code, str) or not user_code or len(user_code) > 64:
        raise HTTPException(502, "ChatGPT returned an invalid device-login response.")
    return device_auth_id, user_code, min(30, max(1, interval))


async def complete_device_login(current: DeviceOperation) -> None:
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            while time.monotonic() < current.deadline:
                response = await client.post(TOKEN_POLL_ENDPOINT, json={
                    "device_auth_id": current.device_auth_id,
                    "user_code": current.user_code,
                })
                if response.status_code in {403, 404}:
                    await asyncio.sleep(current.interval)
                    continue
                if not response.is_success:
                    raise CodexAuthError("device_poll_failed", "ChatGPT device login failed.", 502)
                payload = response.json()
                code = payload.get("authorization_code")
                verifier = payload.get("code_verifier")
                if not isinstance(code, str) or not code or not isinstance(verifier, str) or not verifier:
                    raise CodexAuthError("device_response_invalid", "ChatGPT returned an invalid device-login response.", 502)

                oauth = CodexOAuthClient(client)
                tokens = await oauth.exchange_code(code, DEVICE_CODE_REDIRECT_URI, verifier)
                service = get_codex_oauth_service()
                credentials = service._credentials_from_payload(  # noqa: SLF001 - pinned DeepTutor integration
                    tokens,
                    expected_generation=current.expected_generation,
                )
                committed = service._store.commit_credentials(  # noqa: SLF001
                    credentials,
                    expected_generation=current.expected_generation,
                )
                await service._catalog.invalidate()  # noqa: SLF001
                snapshot = await service._catalog.get(committed, force=True)  # noqa: SLF001
                sync_codex_catalog(service._model_catalog, snapshot)  # noqa: SLF001
                current.state = "completed"
                return
        current.state = "expired"
        current.error_code = "login_timeout"
    except asyncio.CancelledError:
        current.state = "cancelled"
        current.error_code = "login_cancelled"
    except CodexAuthError as exc:
        current.state = "failed"
        current.error_code = exc.code
    except Exception:
        current.state = "failed"
        current.error_code = "login_failed"


@app.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/status")
async def status() -> dict[str, Any]:
    return public_payload(operation)


@app.post("/start")
async def start() -> dict[str, Any]:
    global operation
    async with operation_lock:
        if operation is not None and operation.state == "authorizing" and operation.task is not None and not operation.task.done():
            return public_payload(operation)
        device_auth_id, user_code, interval = await request_device_code()
        service = get_codex_oauth_service()
        operation = DeviceOperation(
            operation_id=device_auth_id,
            device_auth_id=device_auth_id,
            user_code=user_code,
            interval=interval,
            expected_generation=service._store.current_generation(),  # noqa: SLF001
            deadline=time.monotonic() + DEVICE_CODE_TTL_SECONDS,
        )
        operation.task = asyncio.create_task(complete_device_login(operation))
        return public_payload(operation)


@app.post("/cancel")
async def cancel() -> dict[str, Any]:
    global operation
    async with operation_lock:
        if operation is not None and operation.task is not None and not operation.task.done():
            operation.task.cancel()
            await asyncio.gather(operation.task, return_exceptions=True)
        return public_payload(operation)
