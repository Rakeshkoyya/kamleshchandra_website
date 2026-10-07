"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1400;
const nf = new Intl.NumberFormat("en-IN");

type Props = { value: number; suffix?: string };

/*
 * Counts up once when scrolled into view. The final number is in the
 * server HTML, so nothing is wrong or missing without JS / with reduced motion.
 */
export function CountUp({ value, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${nf.format(Math.round(value * eased))}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = `${nf.format(value)}${suffix}`;
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {nf.format(value)}
      {suffix}
    </span>
  );
}
