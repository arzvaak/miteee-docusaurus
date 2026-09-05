"use client";

import Image from "next/image";
import { useId } from "react";
import styles from "@/components/SscQuantBook.module.css";

type Stimulus =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "chart"; kind?: "bar" | "line" | "pie"; labels: string[]; values: number[]; ariaLabel: string; caption?: string }
  | { type: "diagram"; nodes: Array<{ id: string; label: string; x: number; y: number }>; edges: Array<{ from: string; to: string; label?: string }>; ariaLabel: string; caption?: string };

export function SscQuantBookStimulus({ stimulus }: { stimulus?: Stimulus }) {
  const markerId = useId().replace(/:/g, "");
  if (!stimulus) return null;
  if (stimulus.type === "image") {
    return (
      <figure className={styles.stimulus}>
        <Image className={styles.stimulusImage} alt={stimulus.alt} height={900} src={stimulus.src} unoptimized width={1400} />
        {stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}
      </figure>
    );
  }
  if (stimulus.type === "chart") {
    const max = Math.max(...stimulus.values, 1);
    if (stimulus.kind === "line") {
      const points = stimulus.values.map((value, index) => ({
        x: stimulus.values.length > 1 ? 40 + index * (520 / (stimulus.values.length - 1)) : 300,
        y: 300 - value / max * 240,
        value,
        label: stimulus.labels[index] ?? String(index + 1)
      }));
      return <figure className={styles.stimulus}><svg className={styles.nativeSvg} role="img" aria-label={stimulus.ariaLabel} viewBox="0 0 600 360"><polyline className={styles.linePlot} fill="none" points={points.map((point) => `${point.x},${point.y}`).join(" ")} />{points.map((point) => <g key={`${point.label}-${point.value}`}><circle cx={point.x} cy={point.y} r="5" /><text x={point.x} y="330" textAnchor="middle">{point.label}</text><text x={point.x} y={point.y - 12} textAnchor="middle">{point.value}</text></g>)}</svg>{stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}</figure>;
    }
    if (stimulus.kind === "pie") {
      const total = stimulus.values.reduce((sum, value) => sum + Math.max(0, value), 0) || 1;
      const slices = stimulus.values.reduce<Array<{ value: number; share: number; offset: number }>>((result, value) => {
        const share = Math.max(0, value) / total * 100;
        const offset = result.reduce((sum, slice) => sum + slice.share, 0);
        return [...result, { value, share, offset }];
      }, []);
      return <figure className={styles.stimulus}><div className={styles.pieLayout}><svg className={styles.pieSvg} role="img" aria-label={stimulus.ariaLabel} viewBox="0 0 240 240">{slices.map((slice, index) => <circle className={styles[`pieSlice${index % 6}`]} cx="120" cy="120" fill="none" key={`${stimulus.labels[index]}-${slice.value}`} r="80" strokeDasharray={`${slice.share} ${100 - slice.share}`} strokeDashoffset={-slice.offset} strokeWidth="80" pathLength="100" transform="rotate(-90 120 120)" />)}</svg><ul>{stimulus.values.map((value, index) => <li key={`${stimulus.labels[index]}-legend`}><i className={styles[`pieKey${index % 6}`]} /><span>{stimulus.labels[index] ?? index + 1}: {value}</span></li>)}</ul></div>{stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}</figure>;
    }
    return (
      <figure className={styles.stimulus}>
        <div className={styles.chart} role="img" aria-label={stimulus.ariaLabel}>
          {stimulus.values.map((value, index) => (
            <div className={styles.chartBar} key={`${stimulus.labels[index] ?? index}-${value}`}>
              <span style={{ height: `${Math.max(5, value / max * 100)}%` }} title={`${stimulus.labels[index] ?? "Item"}: ${value}`} />
              <small>{stimulus.labels[index] ?? index + 1}</small>
            </div>
          ))}
        </div>
        {stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}
      </figure>
    );
  }
  if (stimulus.type === "diagram") {
    const nodeById = new Map(stimulus.nodes.map((node) => [node.id, node]));
    return <figure className={styles.stimulus}><svg className={styles.nativeSvg} role="img" aria-label={stimulus.ariaLabel} viewBox="0 0 600 360"><defs><marker id={markerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0,0 L8,4 L0,8 z" /></marker></defs>{stimulus.edges.map((edge, index) => { const from = nodeById.get(edge.from); const to = nodeById.get(edge.to); if (!from || !to) return null; return <g key={`${edge.from}-${edge.to}-${index}`}><line markerEnd={`url(#${markerId})`} x1={from.x} x2={to.x} y1={from.y} y2={to.y} />{edge.label ? <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 7} textAnchor="middle">{edge.label}</text> : null}</g>; })}{stimulus.nodes.map((node) => <g key={node.id}><rect height="48" rx="12" width="140" x={node.x - 70} y={node.y - 24} /><text x={node.x} y={node.y + 5} textAnchor="middle">{node.label}</text></g>)}</svg>{stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}</figure>;
  }
  return (
    <figure className={styles.stimulus}>
      {stimulus.caption ? <figcaption>{stimulus.caption}</figcaption> : null}
      <div className={styles.tableScroll}>
        <table>
          <thead><tr>{stimulus.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
          <tbody>{stimulus.rows.map((row, rowIndex) => <tr key={`${rowIndex}-${row.join("|")}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </figure>
  );
}
