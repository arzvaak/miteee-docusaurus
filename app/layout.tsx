import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AppShell } from "@/components/AppShell";
import { JsonLd } from "@/components/JsonLd";
import { buildWebSiteJsonLd, DEFAULT_SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { resolvedThemes, themeStorageKey } from "@/lib/themes";
import "./globals.css";
import "./study-minimal.css";
import "katex/dist/katex.min.css";

const shellThemeModes = Object.fromEntries(resolvedThemes.map((theme) => [theme.value, theme.mode]));

const shellInitScript = `
(() => {
  const themeModes = ${JSON.stringify(shellThemeModes)};
  let preference = "system";
  try {
    const stored = window.localStorage.getItem(${JSON.stringify(themeStorageKey)});
    if (stored === "system" || Object.prototype.hasOwnProperty.call(themeModes, stored)) preference = stored;
  } catch {}

  const resolved = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  const mode = themeModes[resolved] || "dark";
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  root.style.colorScheme = mode;
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/img/miteee-social-card.png", width: 1200, height: 630, alt: `${SITE_NAME} dashboard` }]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    images: ["/img/miteee-social-card.png"]
  },
  icons: {
    icon: [
      { url: "/img/favicon.ico" },
      { url: "/img/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/img/icons/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/img/icons/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/img/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/img/icons/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/img/icons/icon-384.png", sizes: "384x384", type: "image/png" },
      { url: "/img/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: [{ url: "/img/favicon.ico" }],
    apple: [{ url: "/img/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  manifest: "/site.webmanifest",
  category: "education"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080b10" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fa" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="shell-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: shellInitScript }} />
        <JsonLd data={buildWebSiteJsonLd()} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
