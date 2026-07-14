"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authReturnPath } from "@/lib/auth-navigation";
import styles from "@/components/AppShell.module.css";

function accountInitial(name: string | null | undefined, email: string | null | undefined) {
  return (name?.trim()[0] || email?.trim()[0] || "A").toUpperCase();
}

export function AuthControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const returnPath = authReturnPath(pathname, searchParams.toString());
  const loginHref = `/login?next=${encodeURIComponent(returnPath)}`;
  const registerHref = `/register?next=${encodeURIComponent(returnPath)}`;

  if (session?.user) {
    return (
      <Link
        href="/account"
        className={styles.accountAvatar}
        aria-label={`Open account for ${session.user.name || session.user.email}`}
        title={session.user.name || session.user.email}
      >
        {accountInitial(session.user.name, session.user.email)}
      </Link>
    );
  }

  return (
    <nav className={styles.authLinks} aria-label="Account access">
      <Link className={styles.loginLink} href={loginHref}>Log in</Link>
      <Link className={styles.registerLink} href={registerHref}>
        <span className={styles.registerLong}>Create account</span>
        <span className={styles.registerShort}>Join</span>
      </Link>
    </nav>
  );
}
