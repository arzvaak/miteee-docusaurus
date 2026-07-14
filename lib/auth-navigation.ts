export function safeAuthRedirect(value: string | string[] | null | undefined, fallback = "/account") {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    !candidate
    || !candidate.startsWith("/")
    || candidate.startsWith("//")
    || /[\\\u0000-\u001f\u007f]/.test(candidate)
  ) return fallback;

  try {
    const trustedOrigin = "https://miteee.local";
    const destination = new URL(candidate, trustedOrigin);
    if (destination.origin !== trustedOrigin) return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}

export function authReturnPath(pathname: string, query: string) {
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return "/account";
  return query ? `${pathname}?${query}` : pathname;
}
