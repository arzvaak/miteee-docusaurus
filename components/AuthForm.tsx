"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import styles from "@/components/AuthForm.module.css";

const genericLoginError = "We could not sign you in with those details.";
const genericRegistrationError = "We could not create that account. Check the fields or try another email.";

type AuthFormProps = {
  mode: "login" | "register";
  nextPath: string;
};

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const isRegistration = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmPassword") ?? "");

    if (!email || password.length < 12 || password.length > 128) {
      setError(isRegistration ? genericRegistrationError : genericLoginError);
      return;
    }
    if (isRegistration && (name.length < 2 || name.length > 80 || password !== confirmation)) {
      setError(genericRegistrationError);
      return;
    }

    setPending(true);
    setError("");

    try {
      const result = isRegistration
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password, rememberMe: true });

      if (result.error) {
        setError(isRegistration ? genericRegistrationError : genericLoginError);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError(isRegistration ? genericRegistrationError : genericLoginError);
    } finally {
      setPending(false);
    }
  }

  const alternateHref = isRegistration
    ? `/login?next=${encodeURIComponent(nextPath)}`
    : `/register?next=${encodeURIComponent(nextPath)}`;

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {isRegistration ? (
        <label className={styles.field}>
          <span>Name</span>
          <span className={styles.inputShell}>
            <UserRound size={17} aria-hidden="true" />
            <input
              autoComplete="name"
              maxLength={80}
              minLength={2}
              name="name"
              placeholder="Your name"
              required
              type="text"
            />
          </span>
        </label>
      ) : null}

      <label className={styles.field}>
        <span>Email</span>
        <span className={styles.inputShell}>
          <Mail size={17} aria-hidden="true" />
          <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
        </span>
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <span className={styles.inputShell}>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            aria-describedby={isRegistration ? "password-guidance" : undefined}
            autoComplete={isRegistration ? "new-password" : "current-password"}
            maxLength={128}
            minLength={12}
            name="password"
            required
            type="password"
          />
        </span>
      </label>

      {isRegistration ? (
        <>
          <p className={styles.guidance} id="password-guidance">Use 12–128 characters. A long, unique passphrase works best.</p>
          <label className={styles.field}>
            <span>Confirm password</span>
            <span className={styles.inputShell}>
              <LockKeyhole size={17} aria-hidden="true" />
              <input autoComplete="new-password" maxLength={128} minLength={12} name="confirmPassword" required type="password" />
            </span>
          </label>
        </>
      ) : null}

      <p className={styles.error} aria-live="polite">{error}</p>

      <button className={styles.submit} disabled={pending} type="submit">
        {pending ? "Working…" : isRegistration ? "Create account" : "Log in"}
        {!pending ? <ArrowRight size={17} aria-hidden="true" /> : null}
      </button>

      <p className={styles.alternate}>
        {isRegistration ? "Already have an account?" : "New to MITEEE?"}{" "}
        <Link href={alternateHref}>{isRegistration ? "Log in" : "Create account"}</Link>
      </p>
    </form>
  );
}
