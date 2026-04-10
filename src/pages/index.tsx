import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const courses = [
  {
    sem: 'Sem 5',
    code: 'MPC',
    title: 'Design of Modern Power Converters',
    description: 'Converter topologies, semiconductor devices, gate drivers, snubbers, thermal design, magnetics, and EMI.',
    meta: '8 weeks · NPTEL DPEC',
    href: '/sem5/mpc/week-1',
    accent: '#cba6f7',
    icon: '⚡',
  },
  {
    sem: 'Sem 5',
    code: 'EOM',
    title: 'Essentials of Management',
    description: 'Management theory, organizational structures, planning, leading, staffing, controlling, and HRM.',
    meta: '9 modules · Exam prep',
    href: '/sem5/eom/notes-l1-15',
    accent: '#a6e3a1',
    icon: '🏢',
  },
  {
    sem: 'Sem 6',
    code: 'SGT',
    title: 'Smart Grid Technologies',
    description: 'Modern grid architectures, distributed energy resources, smart metering, and power system protection.',
    meta: 'Question bank · PYQs',
    href: '/sem6/sgt/question-bank',
    accent: '#89dceb',
    icon: '🔌',
  },
  {
    sem: 'Sem 6',
    code: 'M&I',
    title: 'Measurements & Instrumentation',
    description: 'Sensors, transducers, signal conditioning, measurement systems and calibration techniques.',
    meta: 'Tutorials · Question bank',
    href: '/sem6/mi/question-bank',
    accent: '#fab387',
    icon: '📡',
  },
  {
    sem: 'Sem 6',
    code: 'EEFM',
    title: 'EE Financial Management',
    description: 'Financial analysis, project evaluation, capital budgeting, and management principles for EE.',
    meta: 'PYQs · Question bank',
    href: '/sem6/eefm/question-bank',
    accent: '#f9e2af',
    icon: '💹',
  },
  {
    sem: 'Sem 6',
    code: 'CRA 4409',
    title: 'Data Science',
    description: 'R programming, statistical analysis, data visualisation, and machine learning fundamentals.',
    meta: 'Toolbox · R reference',
    href: '/sem6/cra4409/toolbox',
    accent: '#94e2d5',
    icon: '📊',
  },
];

const stats = [
  { value: '8', label: 'MPC Weeks' },
  { value: '6', label: 'Courses' },
  { value: '2', label: 'Semesters' },
  { value: '∞', label: 'Caffeine' },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description="MIT EEE Study Vault — exam-ready notes for Manipal EEE">
      {/* ── Hero ───────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Manipal Institute of Technology · EEE
          </div>
          <h1 className={styles.heroTitle}>
            MIT EEE<br />
            <span className={styles.heroTitleAccent}>Study Vault</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Exam-focused notes for every subject — with formulas,
            worked examples, and concept breakdowns that actually make sense.
          </p>
          <div className={styles.heroCtas}>
            <Link className={styles.ctaPrimary} to="/sem5/mpc/week-1">
              Sem 5 Notes
            </Link>
            <Link className={styles.ctaSecondary} to="/sem6/sgt/question-bank">
              Sem 6 Notes
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Courses ───────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Courses</h2>
          <p className={styles.sectionSub}>Click any card to jump straight to the notes.</p>
        </div>

        <div className={styles.grid}>
          {courses.map((c) => (
            <Link key={c.code} to={c.href} className={styles.card} style={{ '--accent': c.accent } as React.CSSProperties}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{c.icon}</span>
                <span className={styles.cardSem}>{c.sem}</span>
              </div>
              <div className={styles.cardCode} style={{ color: c.accent }}>{c.code}</div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.description}</p>
              <div className={styles.cardMeta}>{c.meta}</div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
