#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:?usage: publish-next-app.sh /path/to/app}"
SERVICE_NAME="note-arzvak-next"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
APP_PORT="${NEXT_APP_PORT:-3025}"
APP_HOST="${NEXT_APP_HOST:-127.0.0.1}"

cd "$APP_DIR"

mkdir -p /root/note-arzvak-backups
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
  cat > /tmp/miteee-next-netcup-ports.yml <<COMPOSE
services:
  miteee-next:
    ports:
      - "${APP_PORT}:3000"
COMPOSE
  docker compose -f docker-compose.next.yml -f /tmp/miteee-next-netcup-ports.yml up -d --build
  docker compose -f docker-compose.next.yml -f /tmp/miteee-next-netcup-ports.yml ps
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
  HOSTNAME="$APP_HOST" PORT="$APP_PORT" NODE_ENV=production pm2 restart "$SERVICE_NAME" \
    || HOSTNAME="$APP_HOST" PORT="$APP_PORT" NODE_ENV=production pm2 start "$APP_DIR/.next/standalone/server.js" --name "$SERVICE_NAME"
  restarted=1
fi

if [ "$restarted" -ne 1 ]; then
  echo "error: no known Next app process manager found; refusing to report a stale deploy as successful" >&2
  exit 1
fi

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error "http://${APP_HOST}:${APP_PORT}/exams/ssc-cgl" >/dev/null; then
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
      docker compose -f docker-compose.next.yml -f /tmp/miteee-next-netcup-ports.yml ps || true
      docker compose -f docker-compose.next.yml -f /tmp/miteee-next-netcup-ports.yml logs --tail 80 miteee-next || true
    fi
    exit 1
  fi
  sleep 2
done

nginx -t
nginx -s reload
