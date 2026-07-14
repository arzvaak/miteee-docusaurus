import Link from "next/link";
import { HardDrive, ShieldCheck } from "lucide-react";
import { AccountSignOut } from "@/components/AccountSignOut";
import { requireAuthSession } from "@/lib/auth-server";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/app/account/AccountPage.module.css";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "Your account",
  description: "Manage your MITEEE account and understand what is stored on this device.",
  pathname: "/account",
  noIndex: true
});

function initial(name: string, email: string) {
  return (name.trim()[0] || email.trim()[0] || "A").toUpperCase();
}

export default async function AccountPage() {
  const session = await requireAuthSession();
  const createdAt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(session.user.createdAt));

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.hero}>
        <span className={styles.avatar} aria-hidden="true">{initial(session.user.name, session.user.email)}</span>
        <div>
          <span className={styles.eyebrow}>Your account</span>
          <h1>{session.user.name}</h1>
          <p>Signed in with {session.user.email}</p>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="identity-heading">
          <span className={styles.cardIcon}><ShieldCheck size={20} aria-hidden="true" /></span>
          <h2 id="identity-heading">Account identity</h2>
          <p>This session is validated against the server before this private page is shown. Your email is currently a sign-in identifier; email ownership verification is not enabled yet.</p>
          <dl className={styles.details}>
            <div><dt>Name</dt><dd>{session.user.name}</dd></div>
            <div><dt>Email</dt><dd>{session.user.email}</dd></div>
            <div><dt>Created</dt><dd>{createdAt}</dd></div>
          </dl>
          <AccountSignOut />
        </section>

        <section className={styles.card} aria-labelledby="storage-heading">
          <span className={styles.cardIcon}><HardDrive size={20} aria-hidden="true" /></span>
          <h2 id="storage-heading">Study data stays local</h2>
          <p>Your reading progress, study plan, attempts, mistakes, saved items, and theme are still stored in this browser. Signing in does not sync or overwrite them.</p>
          <div className={styles.actions}>
            <Link href="/settings">Open study settings</Link>
            <Link href="/">Return to dashboard</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
