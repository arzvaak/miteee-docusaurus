"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type DeepTutorAccess = {
  hasAccess: boolean;
  available: boolean | null;
};

type ResolvedDeepTutorAccess = DeepTutorAccess & { email: string };

export function useDeepTutorAccess(): DeepTutorAccess {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email ?? "";
  const [access, setAccess] = useState<ResolvedDeepTutorAccess | null>(null);

  useEffect(() => {
    if (isPending || !email) return;

    const controller = new AbortController();
    fetch("/api/deeptutor", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return { email, hasAccess: false, available: null };
        const payload = await response.json() as { enabled?: boolean; available?: boolean };
        return {
          email,
          hasAccess: payload.enabled === true,
          available: payload.enabled === true ? Boolean(payload.available) : null
        };
      })
      .then(setAccess)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAccess({ email, hasAccess: false, available: null });
      });

    return () => controller.abort();
  }, [email, isPending]);

  return access?.email === email ? access : { hasAccess: false, available: null };
}
