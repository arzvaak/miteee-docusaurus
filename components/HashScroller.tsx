"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ block: "start" });
}

export function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(scrollToHash);
    const timer = window.setTimeout(scrollToHash, 140);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
