"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock3, FlaskConical, Layers3, Play, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { GateBuildConfig, GateTopic } from "@/components/GateUi";
import styles from "@/components/Gate.module.css";

type GateBuilderProps = {
  paper: string;
  topics: GateTopic[];
  years: number[];
  questionTypes: Array<"mcq" | "msq" | "nat">;
  questionCount: number;
  initial?: Partial<GateBuildConfig>;
  compact?: boolean;
};

const lengths: Array<GateBuildConfig["length"]> = ["5", "10", "20", "30", "all"];
const typeLabels: Record<"mcq" | "msq" | "nat", string> = { mcq: "MCQ", msq: "MSQ", nat: "NAT" };

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function GateBuilder({ paper, topics, years, questionTypes, questionCount, initial, compact = false }: GateBuilderProps) {
  const sections = useMemo(() => unique(topics.map((topic) => topic.section)), [topics]);
  const [section, setSection] = useState(initial?.section ?? "all");
  const [topic, setTopic] = useState(initial?.topic ?? "all");
  const [selectedYears, setSelectedYears] = useState<number[]>(initial?.years ?? []);
  const [selectedTypes, setSelectedTypes] = useState<Array<"mcq" | "msq" | "nat">>(initial?.questionTypes ?? questionTypes);
  const [length, setLength] = useState<GateBuildConfig["length"]>(initial?.length ?? "10");
  const [mode, setMode] = useState<GateBuildConfig["mode"]>(initial?.mode ?? "practice");

  const visibleTopics = section === "all" ? topics : topics.filter((item) => item.section === section);
  const href = useMemo(() => {
    const params = new URLSearchParams({ length: length ?? "10", mode: mode ?? "practice" });
    if (section !== "all") params.set("section", section);
    if (topic !== "all") params.set("topic", topic);
    if (selectedYears.length) params.set("years", selectedYears.join(","));
    if (selectedTypes.length !== questionTypes.length) params.set("types", selectedTypes.join(","));
    return `/exams/gate/${paper}/practice/${topic === "all" ? "all" : topic}?${params.toString()}`;
  }, [length, mode, paper, questionTypes.length, section, selectedTypes, selectedYears, topic]);

  function toggleYear(year: number) {
    setSelectedYears((current) => current.includes(year) ? current.filter((item) => item !== year) : [...current, year].sort((a, b) => b - a));
  }

  function toggleType(type: "mcq" | "msq" | "nat") {
    setSelectedTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  }

  function changeSection(value: string) {
    setSection(value);
    if (value !== "all" && topic !== "all" && !topics.some((item) => item.slug === topic && item.section === value)) setTopic("all");
  }

  return (
    <section className={`${styles.builder} ${compact ? styles.builderCompact : ""}`} aria-labelledby="gate-builder-heading">
      <div className={styles.builderHeading}>
        <div><p className={styles.eyebrow}>Build a set</p><h2 id="gate-builder-heading">Practice exactly what you want.</h2><p>Filter the bank by syllabus, year, and question type. Your answers stay saved on this device.</p></div>
        <span className={styles.builderCount}><strong>{questionCount.toLocaleString("en-IN")}</strong><small>questions available</small></span>
      </div>

      <div className={styles.builderGrid}>
        <label className={styles.field}><span>Section</span><select value={section} onChange={(event) => changeSection(event.target.value)}><option value="all">All sections</option>{sections.map((item) => <option key={item} value={item}>{topics.find((topicItem) => topicItem.section === item)?.sectionTitle ?? item}</option>)}</select></label>
        <label className={styles.field}><span>Topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">All topics</option>{visibleTopics.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      </div>

      <div className={styles.choiceBlock}><span className={styles.choiceLabel}>Years</span><div className={styles.chipRow}><button className={`${styles.choiceChip} ${selectedYears.length === 0 ? styles.choiceChipActive : ""}`} onClick={() => setSelectedYears([])} type="button">All years</button>{years.map((year) => <button className={`${styles.choiceChip} ${selectedYears.includes(year) ? styles.choiceChipActive : ""}`} key={year} onClick={() => toggleYear(year)} type="button" aria-pressed={selectedYears.includes(year)}>{year}</button>)}</div></div>
      <div className={styles.choiceBlock}><span className={styles.choiceLabel}>Question type</span><div className={styles.chipRow}>{questionTypes.map((type) => <button className={`${styles.choiceChip} ${selectedTypes.includes(type) ? styles.choiceChipActive : ""}`} key={type} onClick={() => toggleType(type)} type="button" aria-pressed={selectedTypes.includes(type)}><Check size={13} aria-hidden="true" /> {typeLabels[type]}</button>)}</div></div>
      <div className={styles.builderSplit}>
        <div className={styles.choiceBlock}><span className={styles.choiceLabel}>Set length</span><div className={styles.chipRow}>{lengths.map((value) => <button className={`${styles.choiceChip} ${length === value ? styles.choiceChipActive : ""}`} key={value} onClick={() => setLength(value)} type="button" aria-pressed={length === value}>{value === "all" ? "All" : value} {value === "all" ? "questions" : "Q"}</button>)}</div></div>
        <div className={styles.choiceBlock}><span className={styles.choiceLabel}>Mode</span><div className={styles.modeRow}><button className={`${styles.modeChip} ${mode === "practice" ? styles.modeChipActive : ""}`} onClick={() => setMode("practice")} type="button"><FlaskConical size={15} aria-hidden="true" /><span><strong>Practice</strong><small>Explain as you go</small></span></button><button className={`${styles.modeChip} ${mode === "timed" ? styles.modeChipActive : ""}`} onClick={() => setMode("timed")} type="button"><Clock3 size={15} aria-hidden="true" /><span><strong>Timed test</strong><small>Review after submit</small></span></button></div></div>
      </div>

      <div className={styles.builderFooter}><span><SlidersHorizontal size={15} aria-hidden="true" />{selectedTypes.length === 0 ? "Choose at least one question type" : `${selectedTypes.length} type${selectedTypes.length === 1 ? "" : "s"} selected`}</span><Link className={styles.primaryButton} aria-disabled={selectedTypes.length === 0} href={selectedTypes.length === 0 ? "#gate-builder-heading" : href}><Play size={15} aria-hidden="true" /> Start {mode === "timed" ? "timed test" : "practice"}<ArrowRight size={15} aria-hidden="true" /></Link></div>
    </section>
  );
}
