"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import styles from "@/app/account/AccountPage.module.css";

export function AccountSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError("We could not log you out. Please try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("We could not log you out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.signOutArea}>
      <button type="button" onClick={signOut} disabled={pending}>
        <LogOut size={16} aria-hidden="true" />
        {pending ? "Logging out…" : "Log out"}
      </button>
      <p aria-live="polite">{error}</p>
    </div>
  );
}
