"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { initTextHighlight } from "@/components/story/text-highlight.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { children: ReactNode; className?: string };

/* Words brighten as they're read. Plain, fully visible text without JS or with reduced motion. */
export function TextHighlight({ children, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(() => {
    if (!ref.current) return undefined;
    return initTextHighlight(ref.current, { gsap, ScrollTrigger, language: "organic", dim: 0.2 });
  });
  return (
    <p ref={ref} className={`th ${className}`}>
      {children}
    </p>
  );
}
