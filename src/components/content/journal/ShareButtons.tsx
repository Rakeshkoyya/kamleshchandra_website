"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";

type Props = {
  title: string;
  /** Site-relative path of the page being shared, e.g. "/journal/why-we-forget". */
  path: string;
};

const FEEDBACK_MS = 2400;

function whatsappHref(title: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
}

export function ShareButtons({ title, path }: Props) {
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function announce(message: string) {
    setStatus(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(""), FEEDBACK_MS);
  }

  async function handleCopy() {
    const url = window.location.origin + path;
    try {
      await navigator.clipboard.writeText(url);
      announce("Link copied");
    } catch {
      announce("Couldn’t copy — select the address bar instead");
    }
  }

  function handleWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
    // Swap the relative fallback for the absolute URL of this page.
    event.currentTarget.href = whatsappHref(title, window.location.origin + path);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-ink">Share</span>
      <button type="button" onClick={handleCopy} className={buttonClass("secondary", "sm", "min-h-10")}>
        Copy link
      </button>
      <a
        href={whatsappHref(title, path)}
        onClick={handleWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("secondary", "sm", "min-h-10")}
      >
        WhatsApp<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span role="status" aria-live="polite" className="text-sm font-semibold text-success">
        {status}
      </span>
    </div>
  );
}
