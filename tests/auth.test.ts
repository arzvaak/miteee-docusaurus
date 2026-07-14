import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import Database from "better-sqlite3";
import { authReturnPath, safeAuthRedirect } from "@/lib/auth-navigation";

const root = process.cwd();
const authTestRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-auth-test-"));
const databasePath = path.join(authTestRoot, "auth.sqlite");
process.env.AUTH_DB_PATH = databasePath;
process.env.BETTER_AUTH_SECRET = "test-only-miteee-auth-secret-with-more-than-thirty-two-bytes";
process.env.BETTER_AUTH_URL = "http://localhost:3000";

const { auth, ensureAuthMigrations } = await import("@/lib/auth");

function source(relativePath: string) {
  return fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
}

function request(pathname: string, init: RequestInit = {}) {
  return auth.handler(new Request(`http://localhost:3000${pathname}`, {
    ...init,
    headers: {
      origin: "http://localhost:3000",
      "x-forwarded-for": "127.0.0.1",
      ...init.headers
    }
  }));
}

function sessionCookie(response: Response) {
  const header = response.headers.get("set-cookie");
  assert.ok(header, "auth response should set a session cookie");
  return header.split(";", 1)[0];
}

test("auth redirects only accept same-origin relative paths", () => {
  assert.equal(safeAuthRedirect("/revision?from=login"), "/revision?from=login");
  assert.equal(safeAuthRedirect("https://attacker.example"), "/account");
  assert.equal(safeAuthRedirect("//attacker.example"), "/account");
  assert.equal(safeAuthRedirect("/\\attacker.example"), "/account");
  assert.equal(safeAuthRedirect("/revision\u0000"), "/account");
  assert.equal(safeAuthRedirect(undefined), "/account");
  assert.equal(authReturnPath("/exams/ssc-cgl/session", "mode=quick&section=reasoning"), "/exams/ssc-cgl/session?mode=quick&section=reasoning");
  assert.equal(authReturnPath("/revision", ""), "/revision");
  assert.equal(authReturnPath("/login", "next=%2Frevision"), "/account");
});

test("auth routes expose real account access with noindex metadata and generic errors", () => {
  const loginPage = source("app/login/page.tsx");
  const registerPage = source("app/register/page.tsx");
  const accountPage = source("app/account/page.tsx");
  const form = source("components/AuthForm.tsx");
  const shell = source("components/AppShell.tsx");
  const controls = source("components/AuthControls.tsx");

  assert.match(loginPage, /noIndex: true/);
  assert.match(registerPage, /noIndex: true/);
  assert.match(accountPage, /requireAuthSession\(\)/);
  assert.match(form, /genericLoginError/);
  assert.match(form, /genericRegistrationError/);
  assert.doesNotMatch(form, /error\.message/);
  assert.match(form, /minLength=\{12\}/);
  assert.match(shell, /aria-label="Open study settings"/);
  assert.match(controls, /const loginHref = `\/login\?next=\$\{encodeURIComponent\(returnPath\)\}`/);
  assert.match(controls, /const registerHref = `\/register\?next=\$\{encodeURIComponent\(returnPath\)\}`/);
  assert.match(controls, /authReturnPath\(pathname, searchParams\.toString\(\)\)/);
  assert.match(controls, /href=\{loginHref\}/);
  assert.match(controls, /href=\{registerHref\}/);
  assert.match(controls, /Create account/);
});

test("auth deployment keeps the database persistent and out of build artifacts", () => {
  const compose = source("docker-compose.next.yml");
  const dockerignore = source(".dockerignore");
  const gitignore = source(".gitignore");
  const standalone = source("scripts/standalone-assets.mjs");
  const workflow = source(".github/workflows/deploy-netcup.yml");
  const publish = source("ops/netcup/publish-next-app.sh");
  const dockerfile = source("docker/next-app.Dockerfile");
  const nextConfig = source("next.config.mjs");
  const route = source("app/api/auth/[...all]/route.ts");

  assert.match(compose, /\.\/data\/auth:\/app\/data\/auth/);
  assert.match(compose, /AUTH_DB_PATH: \/app\/data\/auth\/miteee-auth\.sqlite/);
  assert.match(compose, /NEXT_APP_PUBLISHED_PORT:-3000/);
  assert.match(compose, /127\.0\.0\.1:\$\{NEXT_APP_PUBLISHED_PORT:-3000\}:3000/);
  assert.match(compose, /BETTER_AUTH_URL: \$\{BETTER_AUTH_URL:-http:\/\/localhost:\$\{NEXT_APP_PUBLISHED_PORT:-3000\}\}/);
  assert.match(compose, /api\/auth\/get-session/);
  assert.match(dockerignore, /^data\/auth$/m);
  assert.match(gitignore, /^data\/auth\/$/m);
  assert.match(standalone, /"data\/auth"/);
  assert.match(workflow, /--exclude 'data\/auth\/'/);
  assert.match(workflow, /chown -R 1001:1001 data\/auth/);
  assert.match(workflow, /chmod 700 data\/auth/);
  assert.doesNotMatch(workflow, /miteee-next-netcup-ports\.yml/);
  assert.ok(publish.indexOf('mkdir -p "$AUTH_DATA_DIR"') < publish.indexOf("docker compose"));
  assert.ok(publish.indexOf('chown -R 1001:1001 "$AUTH_DATA_DIR"') < publish.indexOf("docker compose"));
  assert.ok(publish.indexOf('chmod 700 "$AUTH_DATA_DIR"') < publish.indexOf("docker compose"));
  assert.match(publish, /find "\$AUTH_DATA_DIR" -maxdepth 1 -type f -exec chmod 600 \{\} \+/);
  assert.match(publish, /AUTH_SECRET_PATH="\$AUTH_DATA_DIR\/\.better-auth-secret"/);
  assert.match(publish, /install -m 600 "\$AUTH_SECRET_PATH" "\/root\/note-arzvak-backups\/miteee-auth-\$\{auth_backup_stamp\}\.secret"/);
  assert.match(dockerfile, /chown -R nextjs:nextjs \/app\/data\/auth/);
  assert.match(dockerfile, /chmod 700 \/app\/data\/auth/);
  assert.match(nextConfig, /serverExternalPackages: \["better-sqlite3"\]/);
  assert.match(nextConfig, /outputFileTracingExcludes/);
  assert.match(nextConfig, /"\/api\/auth\/\*": authTraceExcludes/);
  assert.match(nextConfig, /"\/login": authTraceExcludes/);
  assert.match(nextConfig, /"\/register": authTraceExcludes/);
  assert.match(nextConfig, /"\/account": authTraceExcludes/);
  assert.match(nextConfig, /"\.\/tests\/\*\*\/\*"/);
  assert.match(nextConfig, /"\.\/docs\/\*\*\/\*"/);
  assert.match(nextConfig, /outputFileTracingIncludes/);
  assert.match(nextConfig, /"\.\/node_modules\/better-sqlite3\/\*\*\/\*"/);
  assert.match(nextConfig, /"\.\/node_modules\/bindings\/\*\*\/\*"/);
  assert.match(standalone, /Standalone output contains traced workspace source/);
  assert.match(standalone, /better_sqlite3\.node/);
  assert.match(route, /await ensureAuthMigrations\(\)/g);
  assert.match(route, /Cache-Control", "private, no-store"/);
});

test("Better Auth migrates an empty database and completes signup, login, session, and logout", async () => {
  await ensureAuthMigrations();

  const { GET: authRouteGet } = await import("@/app/api/auth/[...all]/route");
  const anonymousSession = await authRouteGet(new Request("http://localhost:3000/api/auth/get-session", {
    headers: { "x-forwarded-for": "127.0.0.1" }
  }));
  assert.equal(anonymousSession.headers.get("cache-control"), "private, no-store");

  const schema = new Database(databasePath, { readonly: true });
  const tables = schema.prepare("select name from sqlite_master where type = 'table'").all() as Array<{ name: string }>;
  assert.ok(tables.some(({ name }) => name === "user"));
  assert.ok(tables.some(({ name }) => name === "session"));
  assert.ok(tables.some(({ name }) => name === "account"));
  schema.close();

  const signup = await request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Auth Test Learner",
      email: "auth-test@example.com",
      password: "correct horse battery staple"
    })
  });
  assert.equal(signup.status, 200);
  const signupCookie = sessionCookie(signup);
  assert.match(signupCookie, /^miteee\.session_token=/);
  assert.match(signup.headers.get("set-cookie") ?? "", /HttpOnly/i);
  assert.match(signup.headers.get("set-cookie") ?? "", /SameSite=Lax/i);

  const storedDatabase = new Database(databasePath, { readonly: true });
  const stored = storedDatabase.prepare("select password from account where providerId = ?").get("credential") as { password: string };
  assert.ok(stored.password);
  assert.notEqual(stored.password, "correct horse battery staple");
  storedDatabase.close();

  const session = await request("/api/auth/get-session", { headers: { cookie: signupCookie } });
  assert.equal(session.status, 200);
  const sessionPayload = await session.json() as { user: { email: string } };
  assert.equal(sessionPayload.user.email, "auth-test@example.com");

  const wrongLogin = await request("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "auth-test@example.com", password: "this password is incorrect" })
  });
  assert.notEqual(wrongLogin.status, 200);
  assert.equal(wrongLogin.headers.get("set-cookie"), null);

  const login = await request("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "auth-test@example.com", password: "correct horse battery staple" })
  });
  assert.equal(login.status, 200);
  const loginCookie = sessionCookie(login);

  const logout = await request("/api/auth/sign-out", { method: "POST", headers: { cookie: loginCookie } });
  assert.equal(logout.status, 200);

  const loggedOutSession = await request("/api/auth/get-session", { headers: { cookie: loginCookie } });
  assert.equal(loggedOutSession.status, 200);
  assert.equal(await loggedOutSession.json(), null);
});
