"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, KeyRound, LoaderCircle, LogOut, RefreshCw, Settings2 } from "lucide-react";
import type { DeepTutorModelOption, DeepTutorModelSelection } from "@/lib/deeptutor";
import styles from "@/components/DeepTutorModelSettings.module.css";

type OauthStatus = {
  connection: "disconnected" | "authorizing" | "connected" | "error";
  operationState: string | null;
  authorizeUrl: string | null;
  expiresIn: number | null;
  callbackPort: number | null;
  modelCount: number;
  activeModel: string | null;
  errorCode: string | null;
} | null;

type Props = {
  options: DeepTutorModelOption[];
  selected: DeepTutorModelSelection | null;
  oauth: OauthStatus;
  savedSshCommand: string | null;
  loading: boolean;
  onSelect: (selection: DeepTutorModelSelection | null) => void;
  onRefresh: () => Promise<unknown>;
};

async function modelAction(body: Record<string, unknown>) {
  const response = await fetch("/api/deeptutor/models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Model connection failed.");
  return payload;
}

export function DeepTutorModelSettings({ options, selected, oauth, savedSshCommand, loading, onSelect, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sshCommand, setSshCommand] = useState("");
  const [authorizeUrl, setAuthorizeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [deepSeekOpen, setDeepSeekOpen] = useState(false);
  const [deepSeekKey, setDeepSeekKey] = useState("");
  const [deepSeekModel, setDeepSeekModel] = useState("deepseek-chat");

  useEffect(() => {
    if (!open || oauth?.connection !== "authorizing") return;
    const interval = window.setInterval(() => {
      onRefresh().catch(() => null);
    }, 1500);
    return () => window.clearInterval(interval);
  }, [oauth?.connection, onRefresh, open]);

  async function run(action: string) {
    setBusy(true);
    setError("");
    try {
      const payload = await modelAction({ action });
      if (typeof payload?.sshCommand === "string") setSshCommand(payload.sshCommand);
      if (typeof payload?.authorizeUrl === "string") setAuthorizeUrl(payload.authorizeUrl);
      await onRefresh();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function connectDeepSeek() {
    setBusy(true);
    setError("");
    try {
      await modelAction({ action: "configure_deepseek", apiKey: deepSeekKey, model: deepSeekModel });
      setDeepSeekKey("");
      setDeepSeekOpen(false);
      await onRefresh();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const selectedValue = selected ? `${selected.profileId}::${selected.modelId}` : "";
  const bridgeCommand = sshCommand || savedSshCommand || "";
  const bridgeAuthorizeUrl = authorizeUrl || oauth?.authorizeUrl || "";

  return (
    <div className={styles.root}>
      <label className={styles.selectorLabel}>
        <span>Model</span>
        <select
          value={selectedValue}
          disabled={loading || options.length === 0}
          onChange={(event) => {
            const option = options.find((item) => `${item.profileId}::${item.modelId}` === event.target.value);
            onSelect(option ? { profileId: option.profileId, modelId: option.modelId } : null);
          }}
        >
          {options.length === 0 ? <option value="">No connected model</option> : null}
          {options.map((option) => <option value={`${option.profileId}::${option.modelId}`} key={`${option.profileId}::${option.modelId}`}>{option.label}</option>)}
        </select>
      </label>

      <button className={styles.manageButton} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <Settings2 size={14} /> Manage models
      </button>

      {open ? (
        <div className={styles.panel}>
          <div className={styles.providerCard}>
            <div className={styles.providerHead}>
              <span className={styles.providerIcon}><KeyRound size={15} /></span>
              <div><strong>ChatGPT</strong><small>{oauth?.connection === "connected" ? `${oauth.modelCount} GPT model${oauth.modelCount === 1 ? "" : "s"}` : "Use your ChatGPT plan"}</small></div>
              {oauth?.connection === "connected" ? <Check className={styles.connected} size={16} /> : null}
            </div>
            {oauth?.connection === "connected" ? (
              <div className={styles.providerActions}>
                <button type="button" disabled={busy} onClick={() => run("oauth_refresh")}><RefreshCw size={13} /> Refresh</button>
                <button type="button" disabled={busy} onClick={() => run("oauth_logout")}><LogOut size={13} /> Sign out</button>
              </div>
            ) : (
              <button className={styles.primary} type="button" disabled={busy} onClick={() => run("oauth_start")}>
                {busy ? <LoaderCircle className={styles.spin} size={14} /> : <ExternalLink size={14} />} Sign in with ChatGPT
              </button>
            )}
            {bridgeCommand && oauth?.connection === "authorizing" ? (
              <div className={styles.bridge}>
                <strong>One-time secure bridge</strong>
                <p>Paste this into PowerShell and leave it open, then continue to ChatGPT.</p>
                <button type="button" onClick={async () => { await navigator.clipboard.writeText(bridgeCommand); setCopied(true); }}><Copy size={13} /> {copied ? "Copied" : "Copy PowerShell command"}</button>
                {bridgeAuthorizeUrl ? <a href={bridgeAuthorizeUrl} target="_blank" rel="noreferrer">Continue to ChatGPT <ExternalLink size={12} /></a> : null}
              </div>
            ) : null}
          </div>

          <div className={styles.providerCard}>
            <div className={styles.providerHead}>
              <span className={styles.providerIcon}>DS</span>
              <div><strong>DeepSeek</strong><small>Same API credential OpenCode uses</small></div>
            </div>
            <button className={styles.secondary} type="button" onClick={() => setDeepSeekOpen((value) => !value)}>{deepSeekOpen ? "Close" : "Connect DeepSeek"}</button>
            {deepSeekOpen ? (
              <div className={styles.deepSeekForm}>
                <label>Model<input value={deepSeekModel} onChange={(event) => setDeepSeekModel(event.target.value)} placeholder="deepseek-chat" /></label>
                <label>API key<input value={deepSeekKey} onChange={(event) => setDeepSeekKey(event.target.value)} type="password" autoComplete="off" placeholder="Stored only on the server" /></label>
                <button className={styles.primary} type="button" disabled={busy || !deepSeekKey.trim() || !deepSeekModel.trim()} onClick={connectDeepSeek}>Save DeepSeek</button>
              </div>
            ) : null}
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
