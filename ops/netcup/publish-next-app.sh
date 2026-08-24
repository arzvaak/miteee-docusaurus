#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:?usage: publish-next-app.sh /path/to/app}"
SERVICE_NAME="note-arzvak-next"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
APP_PORT="${NEXT_APP_PORT:-3025}"
APP_HOST="${NEXT_APP_HOST:-127.0.0.1}"
AUTH_DATA_DIR="$APP_DIR/data/auth"
AUTH_DB_PATH="$AUTH_DATA_DIR/miteee-auth.sqlite"
AUTH_SECRET_PATH="$AUTH_DATA_DIR/.better-auth-secret"
BETTER_AUTH_URL="${BETTER_AUTH_URL:-https://note.arzvak.com}"
OPENCODE_GO_MODEL="${OPENCODE_GO_MODEL:-deepseek-v4-flash}"
DEEPTUTOR_EMBEDDING_MODEL="${DEEPTUTOR_EMBEDDING_MODEL:-miteee-all-minilm}"
DEEPTUTOR_EMBEDDING_BASE_MODEL="${DEEPTUTOR_EMBEDDING_BASE_MODEL:-all-minilm}"
DEEPTUTOR_EMBEDDING_DIMENSION="${DEEPTUTOR_EMBEDDING_DIMENSION:-384}"
DEEPTUTOR_ALLOWED_EMAILS="${DEEPTUTOR_ALLOWED_EMAILS:-}"

cd "$APP_DIR"

mkdir -p "$AUTH_DATA_DIR"
chmod 700 "$AUTH_DATA_DIR"
find "$AUTH_DATA_DIR" -maxdepth 1 -type f -exec chmod 600 {} +

auth_backup_stamp="$(date +%Y%m%d%H%M%S)"
if [ -s "$AUTH_DB_PATH" ]; then
  command -v python3 >/dev/null 2>&1 || {
    echo "error: python3 is required to back up the existing auth database" >&2
    exit 1
  }
  auth_backup="/root/note-arzvak-backups/miteee-auth-${auth_backup_stamp}.sqlite"
  mkdir -p /root/note-arzvak-backups
  python3 - "$AUTH_DB_PATH" "$auth_backup" <<'PY'
import sqlite3
import sys

source_path, backup_path = sys.argv[1:]
source = sqlite3.connect(f"file:{source_path}?mode=ro", uri=True)
backup = sqlite3.connect(backup_path)
try:
    source.backup(backup)
finally:
    backup.close()
    source.close()
PY
  chmod 600 "$auth_backup"
fi

if [ -s "$AUTH_SECRET_PATH" ]; then
  mkdir -p /root/note-arzvak-backups
  install -m 600 "$AUTH_SECRET_PATH" "/root/note-arzvak-backups/miteee-auth-${auth_backup_stamp}.secret"
fi

if command -v chown >/dev/null 2>&1; then
  chown -R 1001:1001 "$AUTH_DATA_DIR" 2>/dev/null || true
fi

export AUTH_DB_PATH BETTER_AUTH_URL OPENCODE_GO_MODEL DEEPTUTOR_EMBEDDING_MODEL DEEPTUTOR_EMBEDDING_BASE_MODEL DEEPTUTOR_EMBEDDING_DIMENSION DEEPTUTOR_ALLOWED_EMAILS

mkdir -p /root/note-arzvak-backups
mkdir -p "$APP_DIR/data/deeptutor"
chmod 700 "$APP_DIR/data/deeptutor"
if [ -d "$APP_DIR/data/deeptutor/user" ]; then
  tar --exclude='deeptutor/knowledge_bases' -C "$APP_DIR/data" -czf "/root/note-arzvak-backups/deeptutor-state-$(date +%Y%m%d%H%M%S).tar.gz" deeptutor 2>/dev/null || true
fi
if [ -d "$APP_DIR/.next/standalone" ]; then
  tar -C "$APP_DIR" -czf "/root/note-arzvak-backups/note-arzvak-next-$(date +%Y%m%d%H%M%S).tar.gz" .next public data/current-affairs 2>/dev/null || true
else
  mkdir -p "$APP_DIR"
fi

test -f "$APP_DIR/.next/standalone/server.js"

restarted=0

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && [ -f "$APP_DIR/docker-compose.next.yml" ]; then
  cd "$APP_DIR"
  if command -v systemctl >/dev/null 2>&1; then
    systemctl stop "${SERVICE_NAME}.service" 2>/dev/null || true
    systemctl disable "${SERVICE_NAME}.service" 2>/dev/null || true
  fi
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${APP_PORT}/tcp" || true
  fi
  export NEXT_APP_PUBLISHED_PORT="$APP_PORT"
  docker compose -f docker-compose.next.yml up -d --build
  docker compose -f docker-compose.next.yml stop deeptutor-refresh
  trap 'docker compose -f docker-compose.next.yml up -d deeptutor-refresh >/dev/null 2>&1 || true' EXIT
  compose_project="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' miteee-deeptutor)"
  active_sync_containers="$(docker ps -q \
    --filter "label=com.docker.compose.project=$compose_project" \
    --filter 'label=com.docker.compose.service=deeptutor-sync')"
  if [ -n "$active_sync_containers" ]; then
    docker stop $active_sync_containers >/dev/null
  fi
  docker compose -f docker-compose.next.yml ps
  docker compose -f docker-compose.next.yml exec -T ollama ollama pull "$DEEPTUTOR_EMBEDDING_BASE_MODEL"
  docker compose -f docker-compose.next.yml exec -T ollama ollama create "$DEEPTUTOR_EMBEDDING_MODEL" -f /opt/miteee/Modelfile.all-minilm
  docker compose -f docker-compose.next.yml up -d --force-recreate deeptutor
  docker compose -f docker-compose.next.yml --profile deeptutor-tools run --rm deeptutor-sync
  docker compose -f docker-compose.next.yml exec -T deeptutor python - <<'PY'
import json
import urllib.request

items = json.load(urllib.request.urlopen("http://127.0.0.1:8001/api/v1/knowledge/list", timeout=10))
match = next((item for item in items if item.get("name") == "miteee-notes"), None)
if not match or str(match.get("status", "")).lower() not in {"ready", "completed"}:
    raise SystemExit(f"miteee-notes knowledge base is not ready: {match}")
models = json.load(urllib.request.urlopen("http://127.0.0.1:8001/api/v1/settings/llm-options", timeout=10))
if not isinstance(models.get("options"), list):
    raise SystemExit("DeepTutor model options endpoint is not ready")
oauth = json.load(urllib.request.urlopen("http://127.0.0.1:8001/api/v1/settings/providers/openai-codex/oauth/status", timeout=10))
if oauth.get("connection") not in {"disconnected", "authorizing", "connected", "error"}:
    raise SystemExit(f"DeepTutor ChatGPT OAuth endpoint is not ready: {oauth}")
PY
  docker compose -f docker-compose.next.yml exec -T deeptutor-auth python - <<'PY'
import json
import urllib.request

health = json.load(urllib.request.urlopen("http://127.0.0.1:8002/health", timeout=10))
if health.get("ok") is not True:
    raise SystemExit(f"DeepTutor device-auth helper is not ready: {health}")
PY
  docker compose -f docker-compose.next.yml up -d deeptutor-refresh
  trap - EXIT
  restarted=1
elif command -v systemctl >/dev/null 2>&1 && command -v node >/dev/null 2>&1; then
  node_bin="$(command -v node)"
  cat > "$SERVICE_FILE" <<SERVICE
[Unit]
Description=MITEEE Next standalone app
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR/.next/standalone
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=HOSTNAME=$APP_HOST
Environment=PORT=$APP_PORT
Environment=AUTH_DB_PATH=$AUTH_DB_PATH
Environment=BETTER_AUTH_URL=$BETTER_AUTH_URL
ExecStart=$node_bin server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE
  systemctl daemon-reload
  systemctl enable "${SERVICE_NAME}.service"
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${APP_PORT}/tcp" || true
  fi
  systemctl restart "${SERVICE_NAME}.service"
  systemctl is-active --quiet "${SERVICE_NAME}.service"
  restarted=1
elif command -v pm2 >/dev/null 2>&1; then
  cd "$APP_DIR"
  HOSTNAME="$APP_HOST" PORT="$APP_PORT" NODE_ENV=production pm2 restart "$SERVICE_NAME" --update-env \
    || HOSTNAME="$APP_HOST" PORT="$APP_PORT" NODE_ENV=production pm2 start "$APP_DIR/.next/standalone/server.js" --name "$SERVICE_NAME"
  restarted=1
fi

if [ "$restarted" -ne 1 ]; then
  echo "error: no known Next app process manager found; refusing to report a stale deploy as successful" >&2
  exit 1
fi

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error "http://${APP_HOST}:${APP_PORT}/exams/ssc-cgl" >/dev/null \
    && curl --fail --silent --show-error "http://${APP_HOST}:${APP_PORT}/api/auth/get-session" >/dev/null; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo "error: Next app did not become healthy on ${APP_HOST}:${APP_PORT}" >&2
    if command -v systemctl >/dev/null 2>&1; then
      systemctl --no-pager --full status "${SERVICE_NAME}.service" || true
      journalctl -u "${SERVICE_NAME}.service" --no-pager -n 80 || true
    fi
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && [ -f "$APP_DIR/docker-compose.next.yml" ]; then
      cd "$APP_DIR"
      docker compose -f docker-compose.next.yml ps || true
      docker compose -f docker-compose.next.yml logs --tail 80 miteee-next || true
    fi
    exit 1
  fi
  sleep 2
done

auth_probe_status="$(curl --silent --show-error --output /tmp/miteee-auth-probe.json --write-out '%{http_code}' \
  --request POST \
  --header "Origin: $BETTER_AUTH_URL" \
  --header 'Content-Type: application/json' \
  --data '{"email":"deployment-auth-probe@invalid.example","password":"deliberately-wrong-password"}' \
  "http://${APP_HOST}:${APP_PORT}/api/auth/sign-in/email")"
if [ "$auth_probe_status" != "401" ]; then
  echo "error: auth POST probe returned HTTP $auth_probe_status instead of the expected controlled 401" >&2
  cat /tmp/miteee-auth-probe.json >&2 || true
  exit 1
fi

nginx -t
nginx -s reload
