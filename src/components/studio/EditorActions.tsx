"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PublishBadge } from "./StatusBadge";

type Props = {
  status: string;
  backHref: string;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishLabel?: string;
  errorSummary?: string;
};

/** Sticky save bar for studio editors. */
export function EditorActions({ status, backHref, onSaveDraft, onPublish, publishLabel = "Publish", errorSummary }: Props) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-10 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <Link href={backHref} className="font-semibold text-muted hover:text-ink">
            ← Back
          </Link>
          <span className="text-muted">Status</span>
          <PublishBadge status={status} />
        </div>
        <p aria-live="polite" className="order-last w-full text-sm font-medium text-danger sm:order-none sm:w-auto">
          {errorSummary}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSaveDraft}>
            Save draft
          </Button>
          <Button onClick={onPublish}>{publishLabel}</Button>
        </div>
      </div>
    </div>
  );
}
