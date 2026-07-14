import { redirect } from "next/navigation";
import { AuthPage } from "@/components/AuthPage";
import { safeAuthRedirect } from "@/lib/auth-navigation";
import { getAuthSession } from "@/lib/auth-server";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "Create account",
  description: "Create a secure MITEEE account.",
  pathname: "/register",
  noIndex: true
});

type RegisterSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RegisterPage({ searchParams }: { searchParams: RegisterSearchParams }) {
  const nextPath = safeAuthRedirect((await searchParams).next);
  if (await getAuthSession()) redirect(nextPath);
  return <AuthPage mode="register" nextPath={nextPath} />;
}
