"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, ClipboardCheck, LayoutDashboard, PenLine, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { HashScroller } from "@/components/HashScroller";
import { QuickFind } from "@/components/QuickFind";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "@/components/AppShell.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, isActive: (pathname) => pathname === "/" },
  {
    href: "/courses",
    label: "Library",
    icon: BookOpen,
    isActive: (pathname) => pathname.startsWith("/courses") || pathname.startsWith("/notes")
  },
  { href: "/exams/ssc-cgl", label: "Exams", icon: ClipboardCheck, isActive: (pathname) => pathname.startsWith("/exams") },
  { href: "/practice", label: "Practice", icon: PenLine, isActive: (pathname) => pathname.startsWith("/practice") },
  { href: "/revision", label: "Revision", icon: RotateCcw, isActive: (pathname) => pathname.startsWith("/revision") }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const focusedExamSession = pathname.startsWith("/exams/ssc-cgl/session")
    || /^\/exams\/ssc-cgl\/tests\/[^/]+$/.test(pathname);

  return (
    <div className={styles.shell}>
      <HashScroller />

      {!focusedExamSession ? <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="MITEEE Study dashboard">
          <span className={styles.brandMark}>
            <Image src="/img/icons/icon-64.png" alt="" width={34} height={34} priority />
          </span>
          <span className={styles.brandCopy}>
            <strong>MITEEE</strong>
            <small>Study</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? `${styles.navLink} ${styles.active}` : styles.navLink}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.searchSlot}>
          <QuickFind />
        </div>

        <div className={styles.actions}>
          <ThemeToggle compact />
          <Link
            href="/settings"
            className={pathname.startsWith("/settings") ? `${styles.avatar} ${styles.avatarActive}` : styles.avatar}
            aria-label="Open study settings"
            aria-current={pathname.startsWith("/settings") ? "page" : undefined}
            title="Study settings"
          >
            M
          </Link>
        </div>
      </header> : null}

      <main className={focusedExamSession ? `${styles.main} ${styles.focusMain}` : styles.main}>{children}</main>

      {!focusedExamSession ? <nav className={styles.bottomNav} aria-label="Mobile navigation">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? `${styles.bottomLink} ${styles.active}` : styles.bottomLink}
              aria-current={active ? "page" : undefined}
            >
              <item.icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav> : null}
    </div>
  );
}
