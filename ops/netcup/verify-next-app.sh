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

curl --fail --location --silent --show-error \
  "$base_url/exams/ssc-cgl/subjects/quantitative-aptitude" \
  > "$work_dir/ssc-cgl-quant.html"
grep -q "The Quantitative Aptitude Notebook" "$work_dir/ssc-cgl-quant.html"
grep -Eq "20(.{0,80})chapters" "$work_dir/ssc-cgl-quant.html"

curl --fail --location --silent --show-error \
  "$base_url/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/number-system" \
  > "$work_dir/ssc-cgl-quant-chapter.html"
grep -q "Number System" "$work_dir/ssc-cgl-quant-chapter.html"
grep -q "WORKED EXAMPLE" "$work_dir/ssc-cgl-quant-chapter.html"

curl --fail --location --silent --show-error \
  "$base_url/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/number-system/practice" \
  > "$work_dir/ssc-cgl-quant-practice.html"
grep -q "Number System" "$work_dir/ssc-cgl-quant-practice.html"
grep -q "Reset chapter" "$work_dir/ssc-cgl-quant-practice.html"

legacy_topic_headers="$(curl --silent --show-error --head "$base_url/exams/ssc-cgl/topics/number-system")"
printf '%s' "$legacy_topic_headers" | grep -qi '^location: /exams/ssc-cgl/practice/number-system'

curl --fail --location --silent --show-error \
  "$base_url/api/exams/ssc-cgl/session?mode=endless&section=quantitative-aptitude&length=endless&timer=off&source=book&difficulty=all&seed=deployment-probe&cursor=0&limit=1" \
  > "$work_dir/ssc-cgl-session.json"
node - "$work_dir/ssc-cgl-session.json" <<'NODE'
const fs = require("node:fs");
const payload = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (!Number.isInteger(payload.total) || payload.total < 1) {
  throw new Error(`SSC CGL session corpus is empty (total=${String(payload.total)}).`);
}
if (!Array.isArray(payload.questions) || payload.questions.length !== 1) {
  throw new Error("SSC CGL session probe did not return one question.");
}
NODE

curl --fail --location --silent --show-error "$base_url/exams/cat/quant" > "$work_dir/cat-quant.html"
grep -q "CAT Quant" "$work_dir/cat-quant.html"
grep -q "3,386" "$work_dir/cat-quant.html"

curl --fail --location --silent --show-error "$base_url/exams/gate" > "$work_dir/gate.html"
grep -q "Turn every GATE topic into a practice lane" "$work_dir/gate.html"
grep -q "Electrical Engineering" "$work_dir/gate.html"
grep -q "Data Science &amp; Artificial Intelligence" "$work_dir/gate.html"

curl --fail --location --silent --show-error "$base_url/exams/gate/ee" > "$work_dir/gate-ee.html"
grep -q "Practice all" "$work_dir/gate-ee.html"
grep -q "Electric circuits" "$work_dir/gate-ee.html"

curl --fail --location --silent --show-error \
  "$base_url/exams/gate/ee/practice/EE-S02-L008?length=5&mode=practice" \
  > "$work_dir/gate-ee-practice.html"
grep -q "Mark for review" "$work_dir/gate-ee-practice.html"

curl --fail --location --silent --show-error \
  "$base_url/content-assets/gate/ee/GATE-2024-EE-S8-Q13-e95a2bbe014d.png" \
  > "$work_dir/gate-circuit.png"
test -s "$work_dir/gate-circuit.png"

curl --fail --location --silent --show-error "$base_url/courses/SEM7-EA" > "$work_dir/energy-auditing.html"
grep -q "Energy Auditing (ELE 4446)" "$work_dir/energy-auditing.html"

ea_notes_index="data/generated/notes-index.json"
test -s "$ea_notes_index"
node - "$ea_notes_index" "$work_dir/energy-auditing-routes.tsv" <<'NODE'
const fs = require("node:fs");

const indexPath = process.argv[2];
const outputPath = process.argv[3];
const notes = JSON.parse(fs.readFileSync(indexPath, "utf8"));
if (!Array.isArray(notes)) throw new Error("Generated notes index is not an array.");

const energyNotes = notes.filter((note) => note && note.courseCode === "SEM7-EA");
if (energyNotes.length !== 49) {
  throw new Error(`Energy Auditing note index must contain exactly 49 notes (found ${energyNotes.length}).`);
}
if (new Set(energyNotes.map((note) => note.slug)).size !== energyNotes.length) {
  throw new Error("Energy Auditing note index contains duplicate slugs.");
}

const rows = energyNotes.map((note) => {
  if (typeof note.slug !== "string" || !note.slug || typeof note.title !== "string" || !note.title) {
    throw new Error("Every Energy Auditing index entry needs a slug and title.");
  }
  return `${note.slug}\t${note.title.replace(/[\r\n\t]/g, " ")}`;
});
fs.writeFileSync(outputPath, `${rows.join("\n")}\n`);
NODE

while IFS=$'\t' read -r ea_slug ea_title; do
  test -n "$ea_slug"
  ea_note_status="$(curl --location --silent --show-error --output "$work_dir/energy-auditing-note.html" --write-out '%{http_code}' "$base_url/notes/$ea_slug")"
  test "$ea_note_status" = "200"
  grep -Fq -- "$ea_title" "$work_dir/energy-auditing-note.html"
done < "$work_dir/energy-auditing-routes.tsv"

echo "Production Next app verification passed."
