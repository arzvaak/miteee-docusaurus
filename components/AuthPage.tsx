import { HardDrive } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import styles from "@/components/AuthForm.module.css";

export function AuthPage({ mode, nextPath }: { mode: "login" | "register"; nextPath: string }) {
  const isRegistration = mode === "register";
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <span className={styles.eyebrow}>{isRegistration ? "Create your account" : "Welcome back"}</span>
        <h1>{isRegistration ? "A calmer place to keep learning." : "Pick up where you left off."}</h1>
        <p>
          {isRegistration
            ? "Create a secure MITEEE account for identity and account access."
            : "Log in to manage your MITEEE account from this browser."}
        </p>
        <div className={styles.localCard}>
          <HardDrive size={19} aria-hidden="true" />
          <div>
            <strong>Your study data remains on this device.</strong>
            <span>Signing in does not yet sync reading progress, plans, attempts, mistakes, or themes across browsers.</span>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="auth-form-heading">
        <header className={styles.panelHeader}>
          <h2 id="auth-form-heading">{isRegistration ? "Create account" : "Log in"}</h2>
          <p>{isRegistration ? "Use an email and a long, unique password." : "Enter the email and password for your account."}</p>
        </header>
        <AuthForm mode={mode} nextPath={nextPath} />
      </section>
    </div>
  );
}
