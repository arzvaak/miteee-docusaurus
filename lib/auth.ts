import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";

const minimumSecretBytes = 32;
const defaultAuthBaseUrl = process.env.NODE_ENV === "production"
  ? "https://note.arzvak.com"
  : "http://localhost:3000";
const authBaseUrl = process.env.BETTER_AUTH_URL?.trim() || defaultAuthBaseUrl;
const authBaseOrigin = new URL(authBaseUrl).origin;

export const authDatabasePath = path.resolve(
  process.env.AUTH_DB_PATH?.trim()
    || path.join(os.tmpdir(), "miteee-study-os", "auth", "miteee-auth.sqlite")
);

export const authSecretFilePath = path.resolve(
  process.env.BETTER_AUTH_SECRET_FILE?.trim()
    || path.join(path.dirname(authDatabasePath), ".better-auth-secret")
);

function isStrongSecret(value: string) {
  return Buffer.byteLength(value, "utf8") >= minimumSecretBytes;
}

function readSecretFile(filePath: string) {
  const secret = fs.readFileSync(filePath, "utf8").trim();
  if (!isStrongSecret(secret)) {
    throw new Error(`The Better Auth secret file at ${filePath} must contain at least ${minimumSecretBytes} bytes.`);
  }
  return secret;
}

function createSecretFile(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const secret = randomBytes(48).toString("base64url");

  try {
    const descriptor = fs.openSync(filePath, "wx", 0o600);
    try {
      fs.writeFileSync(descriptor, `${secret}\n`, "utf8");
    } finally {
      fs.closeSync(descriptor);
    }
    return secret;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return readSecretFile(filePath);
    throw error;
  }
}

function resolveAuthSecret() {
  const configured = process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  if (configured) {
    if (!isStrongSecret(configured)) {
      throw new Error(`BETTER_AUTH_SECRET must contain at least ${minimumSecretBytes} bytes.`);
    }
    return configured;
  }

  return fs.existsSync(authSecretFilePath)
    ? readSecretFile(authSecretFilePath)
    : createSecretFile(authSecretFilePath);
}

function createAuthRuntime() {
  fs.mkdirSync(path.dirname(authDatabasePath), { recursive: true });
  const database = new Database(authDatabasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");

  const auth = betterAuth({
    appName: "MITEEE",
    baseURL: authBaseUrl,
    secret: resolveAuthSecret(),
    database,
    trustedOrigins: [
      authBaseOrigin,
      "https://note.arzvak.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ].filter((origin, index, origins) => origins.indexOf(origin) === index),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 12,
      maxPasswordLength: 128
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24
    },
    advanced: {
      cookiePrefix: "miteee"
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100
    }
  });

  return { auth, database, migrationPromise: undefined as Promise<void> | undefined };
}

type AuthRuntime = ReturnType<typeof createAuthRuntime>;

const authGlobal = globalThis as typeof globalThis & {
  __miteeeAuthRuntime?: AuthRuntime;
};

const runtime = authGlobal.__miteeeAuthRuntime ?? createAuthRuntime();
authGlobal.__miteeeAuthRuntime = runtime;

export const auth = runtime.auth;

export function ensureAuthMigrations() {
  if (!runtime.migrationPromise) {
    runtime.migrationPromise = (async () => {
      const { runMigrations } = await getMigrations(auth.options);
      await runMigrations();
    })().catch((error) => {
      runtime.migrationPromise = undefined;
      throw error;
    });
  }

  return runtime.migrationPromise;
}
