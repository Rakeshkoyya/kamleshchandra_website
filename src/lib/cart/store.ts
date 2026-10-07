"use client";

/*
 * Cart store — client-only, persisted to localStorage.
 * BACKEND: replace persistence with a server cart (cookie session id) when
 * wiring payments; the hook API (useCart) can stay the same.
 */
import { useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "kc-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.slug === "string" &&
    typeof v.title === "string" &&
    typeof v.unitPriceInr === "number" &&
    typeof v.quantity === "number"
  );
}

function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]): void {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode): the cart still works for this tab.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  hydrate();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function cartItemId(kind: CartItem["kind"], slug: string, variant: string): string {
  return `${kind}:${slug}:${variant}`;
}

export const cartActions = {
  add(item: Omit<CartItem, "id" | "quantity">, quantity = 1): void {
    const id = cartItemId(item.kind, item.slug, item.variant);
    const existing = items.find((i) => i.id === id);
    // Courses are single-seat purchases; books and event seats can stack.
    const cap = item.kind === "course" ? 1 : 20;
    const next = existing
      ? items.map((i) => (i.id === id ? { ...i, quantity: Math.min(cap, i.quantity + quantity) } : i))
      : [...items, { ...item, id, quantity: Math.min(cap, quantity) }];
    commit(next);
  },
  setQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      commit(items.filter((i) => i.id !== id));
      return;
    }
    commit(items.map((i) => (i.id === id ? { ...i, quantity: Math.min(20, quantity) } : i)));
  },
  remove(id: string): void {
    commit(items.filter((i) => i.id !== id));
  },
  clear(): void {
    commit(EMPTY);
  },
};

export interface CartSummary {
  items: CartItem[];
  count: number;
  subtotalInr: number;
}

export function summarise(list: CartItem[]): CartSummary {
  return {
    items: list,
    count: list.reduce((n, i) => n + i.quantity, 0),
    subtotalInr: list.reduce((n, i) => n + i.unitPriceInr * i.quantity, 0),
  };
}

export function useCart(): CartSummary {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return summarise(list);
}

/* Cart drawer open state — shared between header button and add-to-cart buttons */
let drawerOpen = false;
const drawerListeners = new Set<() => void>();

export const cartDrawer = {
  open(): void {
    drawerOpen = true;
    drawerListeners.forEach((l) => l());
  },
  close(): void {
    drawerOpen = false;
    drawerListeners.forEach((l) => l());
  },
};

export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(
    (l) => {
      drawerListeners.add(l);
      return () => drawerListeners.delete(l);
    },
    () => drawerOpen,
    () => false,
  );
}
