"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type Props = { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean };

/** Native <dialog> (focus trap, Esc, backdrop) driven by React state. */
export function StudioDialog({ isOpen, onClose, title, children, wide = false }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className={`kc-dialog ${wide ? "md:max-w-[44rem]" : ""}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85svh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[length:var(--text-xl)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl text-muted hover:bg-bg-alt hover:text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {isOpen ? <div className="mt-5">{children}</div> : null}
      </div>
    </dialog>
  );
}
