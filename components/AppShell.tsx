import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, Gauge, Home, LibraryBig, Newspaper, PenLine, Search, Sigma, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HashScroller } from "@/components/HashScroller";
import { QuickFind } from "@/components/QuickFind";
import { ShellSidebarControls } from "@/components/ShellSidebarControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCatalog, getFeaturedCourses } from "@/lib/content";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tone: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Desk", icon: Home, tone: "cyan" },
  { href: "/courses", label: "Subjects", icon: BookOpen, tone: "emerald" },
  { href: "/exams/ssc-cgl", label: "SSC CGL", icon: Gauge, tone: "blue" },
  { href: "/#recent-notes", label: "Notes", icon: FileText, tone: "blue" },
  { href: "/practice", label: "Practice", icon: PenLine, tone: "violet" },
  { href: "/revision", label: "Revision", icon: Sigma, tone: "amber" }
];

function compactNumber(value: number) {
  if (value >= 100000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
  return String(value);
}

function courseTone(index: number) {
  return ["cyan", "violet", "emerald", "amber", "blue"][index % 5];
}

function sidebarCourseLabel(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC Polity";
  return code.replace("SEM", "S");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const catalog = getCatalog();
  const railCourses = getFeaturedCourses().slice(0, 6);
  const maxNotes = Math.max(...railCourses.map((course) => course.noteCount), 1);

  return (
    <div className="app-shell">
      <HashScroller />
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="MITEEE Personal Study Desk home">
          <span className="brand-mark"><Image src="/img/icons/icon-64.png" alt="" width={30} height={30} priority /></span>
          <span>
            <strong>MITEEE Desk</strong>
            <small>private study OS</small>
          </span>
        </Link>
        <ShellSidebarControls />

        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link nav-${item.tone}`}>
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-section" aria-label="Course shortcuts">
          <p className="sidebar-heading">Pinned subjects</p>
          <div className="sidebar-course-list">
            {railCourses.map((course, index) => {
              const percent = Math.max(8, Math.round((course.noteCount / maxNotes) * 100));
              return (
                <Link className={`sidebar-course accent-${courseTone(index)}`} key={course.code} href={`/courses/${course.code}`}>
                  <span className="course-dot" aria-hidden="true" />
                  <span>{sidebarCourseLabel(course.code)}</span>
                  <small>{compactNumber(course.noteCount)} notes</small>
                  <i style={{ width: `${percent}%` }} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
          <div className="sidebar-corpus">
            <strong>{compactNumber(catalog.totals.notes)}</strong>
            <span>notes in vault</span>
          </div>
        </div>

        <div className="sidebar-section sidebar-tools" aria-label="Study tools">
          <p className="sidebar-heading">Fast lanes</p>
          <div className="sidebar-list">
            <Link className="sidebar-mini-link" href="/courses"><LibraryBig size={16} aria-hidden="true" /><span>Subject library</span></Link>
            <Link className="sidebar-mini-link" href="/#recent-notes"><Search size={16} aria-hidden="true" /><span>Quick search</span></Link>
            <Link className="sidebar-mini-link" href="/exams/ssc-cgl"><Gauge size={16} aria-hidden="true" /><span>SSC CGL</span></Link>
            <Link className="sidebar-mini-link" href="/exams/ssc-cgl/current-affairs"><Newspaper size={16} aria-hidden="true" /><span>Current affairs</span></Link>
            <Link className="sidebar-mini-link" href="/practice"><PenLine size={16} aria-hidden="true" /><span>Answer practice</span></Link>
            <Link className="sidebar-mini-link" href="/revision"><Sparkles size={16} aria-hidden="true" /><span>Revision queue</span></Link>
          </div>
        </div>

        <ThemeToggle />
      </aside>

      <header className="desktop-topbar">
        <div className="desktop-command"><QuickFind /></div>
        <div className="topbar-actions">
          <Link className="button ghost" href="/courses">Subjects <BookOpen size={16} aria-hidden="true" /></Link>
          <Link className="button ghost" href="/exams/ssc-cgl">SSC CGL <Gauge size={16} aria-hidden="true" /></Link>
          <Link className="button ghost" href="/practice">Practice <PenLine size={16} aria-hidden="true" /></Link>
          <Link className="button primary" href="/#recent-notes">Notes <FileText size={16} aria-hidden="true" /></Link>
          <ThemeToggle compact />
        </div>
      </header>

      <header className="mobile-topbar">
        <Link href="/" className="brand compact" aria-label="MITEEE Personal Study Desk home">
          <span className="brand-mark"><Image src="/img/icons/icon-64.png" alt="" width={28} height={28} priority /></span>
          <strong>MITEEE Desk</strong>
        </Link>
        <ThemeToggle compact />
      </header>

      <div className="mobile-command"><QuickFind /></div>
      <main className="main-content">{children}</main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="bottom-link">
            <item.icon size={19} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
