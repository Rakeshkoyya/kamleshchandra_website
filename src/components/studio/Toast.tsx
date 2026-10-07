"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

type Tone = "success" | "info" | "danger";
type ToastItem = { id: number; message: string; tone: Tone };
type ToastFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ToastFn>(() => {});

const TOAST_MS = 3800;

const toneClass: Record<Tone, string> = {
  success: "bg-ink text-paper",
  info: "bg-surface text-ink ring-1 ring-line",
  danger: "bg-danger text-paper",
};

/** Small toast stack for the studio. Announced via a polite live region. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback<ToastFn>(
    (message, tone = "success") => {
      const id = nextId.current++;
      setItems((list) => [...list.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rise-in pointer-events-auto flex max-w-sm items-center gap-3 rounded-md px-4 py-3 text-sm font-medium shadow-2 ${toneClass[t.tone]}`}
          >
            {t.tone === "success" ? <span className="h-2 w-2 shrink-0 rounded-full bg-recall" aria-hidden="true" /> : null}
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="-mr-1 rounded-full px-1.5 opacity-70 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  return useContext(ToastContext);
}
