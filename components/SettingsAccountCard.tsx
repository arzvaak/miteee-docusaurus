"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloudOff, LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import styles from "@/components/StudySettings.module.css";

export function SettingsAccountCard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function logOut() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError("We could not log you out. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("We could not log you out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending) {
    return (
      <section className={styles.sideCard} aria-labelledby="account-sync-heading">
        <div className={styles.sideIcon}><ShieldCheck size={20} aria-hidden="true" /></div>
        <span className={styles.eyebrow}>Account</span>
        <h2 id="account-sync-heading">Checking your session…</h2>
      </section>
    );
  }

  if (session?.user) {
    return (
      <section className={styles.sideCard} aria-labelledby="account-sync-heading">
        <div className={styles.sideIcon}><ShieldCheck size={20} aria-hidden="true" /></div>
        <span className={styles.eyebrow}>Account</span>
        <h2 id="account-sync-heading">Signed in as {session.user.name}.</h2>
        <p className={styles.accountEmail}>{session.user.email}</p>
        <p>Your account is connected. Subject status, plans, progress, attempts, and themes still remain on this device and do not sync yet.</p>
        <div className={styles.accountActions}>
          <Link href="/account">Open account</Link>
          <button type="button" onClick={logOut} disabled={loggingOut}>
            <LogOut size={14} aria-hidden="true" /> {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
        <p className={styles.accountError} aria-live="polite">{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.sideCard} aria-labelledby="account-sync-heading">
      <div className={styles.sideIcon}><CloudOff size={20} aria-hidden="true" /></div>
      <span className={styles.eyebrow}>Account</span>
      <h2 id="account-sync-heading">Not signed in.</h2>
      <p>Create an account or log in. Your study data remains in this browser and does not sync across devices yet.</p>
      <div className={styles.accountActions}>
        <Link href="/login?next=%2Fsettings">Log in</Link>
        <Link className={styles.primaryAccountAction} href="/register?next=%2Fsettings">Create account</Link>
      </div>
    </section>
  );
}
