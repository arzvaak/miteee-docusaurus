"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, BrainCircuit, ClipboardCheck, LayoutDashboard, Newspaper, PenLine, RotateCcw, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { HashScroller } from "@/components/HashScroller";
import { QuickFind } from "@/components/QuickFind";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthControls } from "@/components/AuthControls";
import { DeepTutorDrawer } from "@/components/DeepTutorDrawer";
import { useDeepTutorAccess } from "@/lib/use-deeptutor-access";
import styles from "@/components/AppShell.module.css";

type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
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
  {
    href: "/exams/ssc-cgl/current-affairs",
    label: "Current Affairs",
    shortLabel: "News",
    icon: Newspaper,
    isActive: (pathname) => pathname.startsWith("/exams/ssc-cgl/current-affairs")
  },
  {
    href: "/exams/ssc-cgl",
    label: "Exams",
    icon: ClipboardCheck,
    isActive: (pathname) => pathname.startsWith("/exams") && !pathname.startsWith("/exams/ssc-cgl/current-affairs")
  },
  { href: "/practice", label: "Practice", icon: PenLine, isActive: (pathname) => pathname.startsWith("/practice") },
  { href: "/revision", label: "Revision", icon: RotateCcw, isActive: (pathname) => pathname.startsWith("/revision") }
];

const tutorNavItem: NavItem = {
  href: "/tutor",
  label: "Tutor",
  icon: BrainCircuit,
  isActive: (pathname) => pathname.startsWith("/tutor")
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tutorAccess = useDeepTutorAccess();
  const visibleNavItems = tutorAccess.hasAccess ? [...navItems, tutorNavItem] : navItems;
  const focusedExamSession = pathname.startsWith("/exams/ssc-cgl/session")
    || /^\/exams\/ssc-cgl\/tests\/[^/]+$/.test(pathname);

  return (
    <div className={styles.shell}>
      <HashScroller />

      {!focusedExamSession ? <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="MITEEE dashboard">
          <span className={styles.brandMark}>
            <Image src="/img/icons/icon-64.png" alt="" width={34} height={34} priority />
          </span>
          <span className={styles.brandCopy}>
            <strong>MITEEE</strong>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {visibleNavItems.map((item) => {
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
          <DeepTutorDrawer hasAccess={tutorAccess.hasAccess} available={tutorAccess.available} />
          <Link
            href="/settings"
            className={pathname.startsWith("/settings") ? `${styles.settingsLink} ${styles.settingsActive}` : styles.settingsLink}
            aria-label="Open study settings"
            aria-current={pathname.startsWith("/settings") ? "page" : undefined}
            title="Study settings"
          >
            <Settings size={17} aria-hidden="true" />
          </Link>
          <Suspense fallback={null}>
            <AuthControls />
          </Suspense>
        </div>
      </header> : null}

      <main className={focusedExamSession ? `${styles.main} ${styles.focusMain}` : styles.main}>{children}</main>

      {!focusedExamSession ? <nav className={tutorAccess.hasAccess ? `${styles.bottomNav} ${styles.bottomNavWithTutor}` : styles.bottomNav} aria-label="Mobile navigation">
        {visibleNavItems.map((item) => {
          const active = item.isActive(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? `${styles.bottomLink} ${styles.active}` : styles.bottomLink}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <item.icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.shortLabel ?? item.label}</span>
            </Link>
          );
        })}
      </nav> : null}
    </div>
  );
}
