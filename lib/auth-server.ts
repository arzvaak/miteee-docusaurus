import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, ensureAuthMigrations } from "@/lib/auth";

export async function getAuthSession() {
  await ensureAuthMigrations();
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAuthSession(loginPath = "/login?next=/account") {
  const session = await getAuthSession();
  if (!session) redirect(loginPath);
  return session;
}
