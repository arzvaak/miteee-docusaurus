import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, Home, PenLine, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HashScroller } from "@/components/HashScroller";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Library", icon: BookOpen },
  { href: "/#recent-notes", label: "Notes", icon: FileText },
  { href: "/practice", label: "Practice", icon: PenLine },
  { href: "/revision", label: "Revision", icon: RotateCcw }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell study-shell">
      <HashScroller />
      <aside className="sidebar study-sidebar">
        <Link href="/" className="brand study-brand" aria-label="MITEEE Study home">
          <span className="brand-mark"><Image src="/img/icons/icon-64.png" alt="" width={30} height={30} priority /></span>
          <span>
            <strong>MITEEE</strong>
            <small>Study</small>
          </span>
        </Link>

        <nav className="primary-nav study-primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              <item.icon size={19} strokeWidth={1.7} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="study-sidebar-footer">
          <ThemeToggle compact />
        </div>
      </aside>

      <header className="mobile-topbar study-mobile-topbar">
        <Link href="/" className="brand compact" aria-label="MITEEE Study home">
          <span className="brand-mark"><Image src="/img/icons/icon-64.png" alt="" width={28} height={28} priority /></span>
          <strong>MITEEE Study</strong>
        </Link>
        <ThemeToggle compact />
      </header>

      <main className="main-content">{children}</main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="bottom-link">
            <item.icon size={19} strokeWidth={1.7} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
