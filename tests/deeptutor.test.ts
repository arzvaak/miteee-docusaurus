import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildDeepTutorMessage,
  deepTutorOwnerEmail,
  hasDeepTutorAccess,
  parseDeepTutorTurnRequest
} from "@/lib/deeptutor";

const root = process.cwd();

function source(relativePath: string) {
  return fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
}

test("DeepTutor access always includes the owner and supports a server allowlist", () => {
  assert.equal(deepTutorOwnerEmail, "arzvak@gmail.com");
  assert.equal(hasDeepTutorAccess("arzvak@gmail.com"), true);
  assert.equal(hasDeepTutorAccess("  ARZVAK@gmail.com "), true);
  assert.equal(hasDeepTutorAccess("someone@example.com"), false);
  assert.equal(hasDeepTutorAccess(null), false);

  const route = source("app/api/deeptutor/route.ts");
  const drawer = source("components/DeepTutorDrawer.tsx");
  assert.match(route, /hasDeepTutorAccess\(session\.user\.email\)/);
  assert.match(route, /status: 404/);
  assert.match(drawer, /if \(!hasAccess\) return null/);

  const previousAllowlist = process.env.DEEPTUTOR_ALLOWED_EMAILS;
  process.env.DEEPTUTOR_ALLOWED_EMAILS = "student@example.com, tutor@example.com";
  assert.equal(hasDeepTutorAccess("student@example.com"), true);
  assert.equal(hasDeepTutorAccess("no-access@example.com"), false);
  if (previousAllowlist === undefined) delete process.env.DEEPTUTOR_ALLOWED_EMAILS;
  else process.env.DEEPTUTOR_ALLOWED_EMAILS = previousAllowlist;
});

test("DeepTutor turn requests are bounded and carry note context", () => {
  const request = parseDeepTutorTurnRequest({
    message: "Explain the relay equation",
    sessionId: "session_123",
    capability: "deep_solve",
    note: {
      slug: "sem7-psps-week-1",
      title: "Protection fundamentals",
      courseCode: "SEM7-PSPS",
      courseName: "Power System Protection and Switchgear",
      pathname: "/notes/sem7-psps-week-1"
    },
    model: { profileId: "openai-codex", modelId: "gpt-5" }
  });
  assert.ok(request);
  assert.equal(request.capability, "deep_solve");
  assert.match(buildDeepTutorMessage(request), /Current study context:/);
  assert.match(buildDeepTutorMessage(request), /SEM7-PSPS/);
  assert.match(buildDeepTutorMessage(request), /Explain the relay equation/);
  assert.deepEqual(request.model, { profileId: "openai-codex", modelId: "gpt-5" });
  assert.equal(parseDeepTutorTurnRequest({ message: "", capability: "chat" }), null);
  assert.equal(parseDeepTutorTurnRequest({ message: "hello", sessionId: "bad/session" }), null);
});

test("DeepTutor is isolated, persisted, indexed, and never published directly", () => {
  const compose = source("docker-compose.next.yml");
  const workflow = source(".github/workflows/deploy-netcup.yml");
  const publish = source("ops/netcup/publish-next-app.sh");
  const notePage = source("app/notes/[slug]/page.tsx");
  const nextConfig = source("next.config.mjs");

  assert.match(compose, /ghcr\.io\/hkuds\/deeptutor:1\.5\.9@sha256:/);
  assert.match(compose, /DEEPTUTOR_API_BASE_URL: http:\/\/deeptutor:8001/);
  assert.match(compose, /DEEPTUTOR_WS_URL: ws:\/\/deeptutor:8001\/api\/v1\/ws/);
  assert.match(compose, /\.\/data\/deeptutor:\/app\/data/);
  assert.doesNotMatch(compose, /miteee-generated/);
  assert.doesNotMatch(compose, /miteee-current-affairs/);
  assert.match(compose, /deeptutor-refresh:/);
  assert.match(compose, /DEEPTUTOR_SYNC_INTERVAL_SECONDS:-900/);
  assert.match(compose, /DEEPTUTOR_INDEX_TIMEOUT_SECONDS:-7200/);
  assert.match(compose, /supervisorctl status backend \| grep -q RUNNING/);
  assert.match(compose, /profiles: \["deeptutor-tools"\]/);
  const serviceBlock = compose.slice(compose.indexOf("  deeptutor:"), compose.indexOf("  miteee-next:"));
  assert.doesNotMatch(serviceBlock, /\n\s+ports:/);
  assert.match(workflow, /--exclude 'data\/deeptutor\/'/);
  assert.match(workflow, /DEEPTUTOR_SSH_TARGET: \$\{\{ secrets\.NETCUP_USER \}\}@\$\{\{ secrets\.NETCUP_HOST \}\}/);
  assert.doesNotMatch(workflow, /DEEPTUTOR_SSH_TARGET: .*@note\.arzvak\.com/);
  assert.match(workflow, /tutor_status/);
  assert.match(publish, /--profile deeptutor-tools run --rm deeptutor-sync/);
  assert.match(publish, /miteee-notes knowledge base is not ready/);
  const sync = source("ops/deeptutor/sync_notes.py");
  assert.match(sync, /extensions = \{"\.md", "\.mdx"\}/);
  assert.doesNotMatch(sync, /questions\.json/);
  assert.doesNotMatch(sync, /CURRENT_AFFAIRS_ROOT/);
  assert.match(sync, /fcntl\.LOCK_EX \| fcntl\.LOCK_NB/);
  assert.match(sync, /already indexing; waiting for the existing first build/);
  assert.match(notePage, /data-tutor-note-slug=\{note\.slug\}/);
  assert.match(nextConfig, /"\/api\/deeptutor": authTraceIncludes/);
  assert.match(nextConfig, /"\/api\/deeptutor\/\*": authTraceIncludes/);
  assert.match(nextConfig, /"\/tutor": authTraceExcludes/);
  assert.match(nextConfig, /"\/tutor": authTraceIncludes/);
  assert.match(publish, /openai-codex\/oauth\/status/);
});

test("DeepTutor drawer supports streamed study modes and conversation controls", () => {
  const drawer = source("components/DeepTutorDrawer.tsx");
  assert.match(drawer, /deep_solve/);
  assert.match(drawer, /deep_question/);
  assert.match(drawer, /response\.body\.getReader\(\)/);
  assert.match(drawer, /ReactMarkdown/);
  assert.match(drawer, /rehypeKatex/);
  assert.match(drawer, /stopTurn/);
  assert.match(drawer, /clearConversation/);
  assert.match(drawer, /eventSources/);
  assert.match(drawer, /Open full DeepTutor chat/);
  assert.match(drawer, /onClick=\{\(\) => setOpen\(false\)\}/);
  assert.match(drawer, /DeepTutorModelSettings/);
  assert.match(drawer, /model: models\.selected/);
});

test("DeepTutor has a private full-page chat sharing the drawer conversation", () => {
  const page = source("app/tutor/page.tsx");
  const chat = source("components/DeepTutorChat.tsx");

  assert.match(page, /requireAuthSession/);
  assert.match(page, /encodeURIComponent\(tutorPath\)/);
  assert.match(page, /hasDeepTutorAccess\(session\.user\.email\)/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /noIndex: true/);
  assert.match(chat, /miteee-deeptutor-v1/);
  assert.match(chat, /deep_solve/);
  assert.match(chat, /deep_question/);
  assert.match(chat, /response\.body\.getReader\(\)/);
  assert.match(chat, /New conversation/);
  assert.match(chat, /initialNote/);
  assert.match(chat, /DeepTutorModelSettings/);
  assert.match(chat, /model: models\.selected/);
});

test("DeepTutor model controls support ChatGPT OAuth and server-held DeepSeek credentials", () => {
  const modelRoute = source("app/api/deeptutor/models/route.ts");
  const callbackRoute = source("app/api/v1/auth/openai-codex/callback/route.ts");
  const settings = source("components/DeepTutorModelSettings.tsx");
  const modelClient = source("lib/deeptutor-model-client.ts");
  const tutorRoute = source("app/api/deeptutor/route.ts");

  assert.match(modelRoute, /hasDeepTutorAccess\(session\.user\.email\)/);
  assert.match(modelRoute, /status: 404/);
  assert.match(modelRoute, /openai-codex\/oauth\/start/);
  assert.match(modelRoute, /configure_deepseek/);
  assert.match(modelRoute, /https:\/\/api\.deepseek\.com/);
  assert.doesNotMatch(modelRoute, /localStorage/);
  assert.match(callbackRoute, /\["code", "state", "error"\]/);
  assert.match(settings, /Sign in with ChatGPT/);
  assert.match(settings, /Same API credential OpenCode uses/);
  assert.match(settings, /type="password"/);
  assert.match(modelClient, /miteee-deeptutor-model-v1/);
  assert.doesNotMatch(modelClient, /apiKey|deepSeekKey/);
  assert.match(tutorRoute, /llm_selection/);
  assert.match(tutorRoute, /profile_id: parsed\.model\.profileId/);
});

test("authorized users get a Tutor tab in desktop and mobile navigation", () => {
  const shell = source("components/AppShell.tsx");
  const accessHook = source("lib/use-deeptutor-access.ts");

  assert.match(shell, /href: "\/tutor"/);
  assert.match(shell, /label: "Tutor"/);
  assert.match(shell, /tutorAccess\.hasAccess \? \[\.\.\.navItems, tutorNavItem\] : navItems/);
  assert.match(shell, /bottomNavWithTutor/);
  assert.match(accessHook, /fetch\("\/api\/deeptutor"/);
  assert.match(accessHook, /payload\.enabled === true/);
});
