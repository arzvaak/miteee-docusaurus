#!/usr/bin/env bash
# Manual fallback deploy for the centralized MITEEE Docusaurus repo.
set -euo pipefail

APP_DIR="${APP_DIR:-/root/miteee-docusaurus}"
WEBROOT="${WEBROOT:-/var/www/note.arzvak.com}"
BACKUP_DIR="${BACKUP_DIR:-/root/note-arzvak-backups}"

cd "$APP_DIR"

echo "==> Pulling latest source..."
git pull --ff-only

echo "==> Installing dependencies..."
npm ci

echo "==> Type-checking..."
npm run typecheck

echo "==> Building Docusaurus site..."
NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}" npm run build

echo "==> Backing up current webroot..."
mkdir -p "$BACKUP_DIR" "$WEBROOT"
tar -C "$WEBROOT" -czf "$BACKUP_DIR/note-arzvak-$(date +%Y%m%d%H%M%S).tar.gz" .

echo "==> Publishing build..."
rsync -a --delete build/ "$WEBROOT/"
nginx -t
nginx -s reload

echo "==> Done. Site live at https://note.arzvak.com"
