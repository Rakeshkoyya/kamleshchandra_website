"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { dateParts, formatDate, formatInr } from "@/lib/format";

type Point = { date: string; inr: number };

const HEIGHT = 220;
const PAD = { top: 26, right: 8, bottom: 26, left: 44 };
const MAX_BAR = 24;
const RADIUS = 4;

function niceMax(v: number): { max: number; step: number } {
  const step = v > 20000 ? 10000 : 5000;
  return { max: Math.ceil(v / step) * step, step };
}

/** Column with 4px rounded data-end, square at the baseline. */
function barPath(x: number, y: number, w: number, base: number): string {
  const r = Math.min(RADIUS, w / 2, base - y);
  return `M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${base} Z`;
}

const compact = (v: number) => (v === 0 ? "0" : `₹${v / 1000}k`);

/*
 * 14-day revenue, single series (violet) with the best day highlighted in
 * marigold and labelled. Hover or arrow keys show a tooltip; the sr-only
 * table carries every value without hovering.
 */
export function RevenueChart({ data }: { data: Point[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = data.reduce((s, d) => s + d.inr, 0);
  const peakIndex = data.reduce((best, d, i) => (d.inr > data[best].inr ? i : best), 0);
  const peak = data[peakIndex];
  const { max, step } = niceMax(peak?.inr ?? 1);
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);

  const plotW = width - PAD.left - PAD.right;
  const base = HEIGHT - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.min(MAX_BAR, slot * 0.62);
  const y = (v: number) => base - (v / max) * (base - PAD.top);
  const xCenter = (i: number) => PAD.left + slot * i + slot / 2;
  const labelEvery = width < 480 ? 3 : 2;

  const summary = `Daily revenue, ${formatDate(data[0].date)} to ${formatDate(data[data.length - 1].date)}: ${formatInr(total)} in total. Best day ${formatDate(peak.date)} at ${formatInr(peak.inr)}.`;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    setActive((a) => (a === null ? (dir > 0 ? 0 : data.length - 1) : (a + dir + data.length) % data.length));
  }

  const tip = active !== null ? data[active] : null;

  return (
    <figure>
      <div
        ref={wrapRef}
        className="relative"
        tabIndex={0}
        aria-label="Revenue chart. Use left and right arrow keys to read each day."
        onKeyDown={handleKeyDown}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
      >
        <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} role="img" aria-label={summary} className="block h-auto max-w-full">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--color-border)" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px] tabular-nums">
                {compact(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const isPeak = i === peakIndex;
            const x = xCenter(i) - barW / 2;
            const { day, month } = dateParts(d.date);
            return (
              <g key={d.date}>
                <path
                  d={barPath(x, y(d.inr), barW, base)}
                  fill={isPeak ? "var(--color-recall)" : "var(--color-brand)"}
                  opacity={active === null || active === i ? 1 : 0.45}
                  className="transition-opacity duration-[var(--dur-fast)]"
                />
                {i % labelEvery === (data.length - 1) % labelEvery ? (
                  <text x={xCenter(i)} y={HEIGHT - 8} textAnchor="middle" className="fill-muted text-[11px]">
                    {day} {month}
                  </text>
                ) : null}
                <rect
                  x={PAD.left + slot * i}
                  y={PAD.top - 20}
                  width={slot}
                  height={base - PAD.top + 20}
                  fill="transparent"
                  onPointerEnter={() => setActive(i)}
                />
              </g>
            );
          })}
          {peak ? (
            <text x={xCenter(peakIndex)} y={y(peak.inr) - 8} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
              {formatInr(peak.inr)}
            </text>
          ) : null}
        </svg>
        {tip && active !== null ? (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md bg-surface px-3 py-2 text-center shadow-2 ring-1 ring-line"
            style={{ left: Math.min(Math.max(xCenter(active), 60), width - 60) }}
            aria-live="polite"
          >
            <p className="text-sm font-semibold tabular-nums">{formatInr(tip.inr)}</p>
            <p className="text-xs text-muted">{formatDate(tip.date)}</p>
          </div>
        ) : null}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" aria-hidden="true" /> Daily revenue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-recall" aria-hidden="true" /> Best day
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>Daily revenue, last 14 days</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <th scope="row">{formatDate(d.date)}</th>
              <td>{formatInr(d.inr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
