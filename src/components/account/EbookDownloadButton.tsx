"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function EbookDownloadButton({ title, format }: { title: string; format: "PDF" | "EPUB" }) {
  const [message, setMessage] = useState("");

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          // BACKEND: GET /api/library/{book}/download?format= → short-lived signed URL, then window.location = url.
          setMessage(`Demo: the ${format} of “${title}” would download now.`);
        }}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {format}
      </Button>
      <span aria-live="polite" className="text-xs text-muted">
        {message}
      </span>
    </span>
  );
}
