import { redirect } from "next/navigation";
import { AuthPage } from "@/components/AuthPage";
import { safeAuthRedirect } from "@/lib/auth-navigation";
import { getAuthSession } from "@/lib/auth-server";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to your MITEEE account.",
  pathname: "/login",
  noIndex: true
});

type LoginSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
  const nextPath = safeAuthRedirect((await searchParams).next);
  if (await getAuthSession()) redirect(nextPath);
  return <AuthPage mode="login" nextPath={nextPath} />;
}
