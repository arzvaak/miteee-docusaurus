#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://127.0.0.1:3025}"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

curl --fail --location --silent --show-error "$base_url/" > "$work_dir/note-home.html"
grep -q "Library spaces" "$work_dir/note-home.html"
grep -q "Choose what you want to learn" "$work_dir/note-home.html"
grep -q "/settings" "$work_dir/note-home.html"

curl --fail --location --silent --show-error "$base_url/settings" > "$work_dir/study-settings.html"
grep -q "Make this study space yours" "$work_dir/study-settings.html"
grep -q "Reader layout" "$work_dir/study-settings.html"

curl --fail --location --silent --show-error "$base_url/login" > "$work_dir/login.html"
grep -q "Log in" "$work_dir/login.html"
grep -q 'noindex' "$work_dir/login.html"
curl --fail --location --silent --show-error "$base_url/register" > "$work_dir/register.html"
grep -q "Create account" "$work_dir/register.html"
grep -q 'noindex' "$work_dir/register.html"

auth_status="$(curl --location --silent --show-error --output "$work_dir/auth-probe.json" --write-out '%{http_code}' \
  --request POST \
  --header 'Origin: https://note.arzvak.com' \
  --header 'Content-Type: application/json' \
  --data '{"email":"deployment-auth-probe@invalid.example","password":"deliberately-wrong-password"}' \
  "$base_url/api/auth/sign-in/email")"
test "$auth_status" = "401"

tutor_status="$(curl --silent --show-error --output "$work_dir/deeptutor-probe.json" --write-out '%{http_code}' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"message":"private route probe"}' \
  "$base_url/api/deeptutor")"
test "$tutor_status" = "404"

curl --fail --location --silent --show-error "$base_url/exams/ssc-cgl" > "$work_dir/ssc-cgl.html"
grep -q "Build each subject. Then test it." "$work_dir/ssc-cgl.html"
grep -q "Four sections, clearly separated." "$work_dir/ssc-cgl.html"
if grep -q "Study Vault" "$work_dir/ssc-cgl.html"; then
  echo "Legacy Study Vault label is still present on the SSC CGL landing page" >&2
  exit 1
fi

curl --fail --location --silent --show-error "$base_url/exams/cat/quant" > "$work_dir/cat-quant.html"
grep -q "CAT Quant" "$work_dir/cat-quant.html"
grep -q "3,386" "$work_dir/cat-quant.html"

echo "Production Next app verification passed."
