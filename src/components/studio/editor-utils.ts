/* Small pure helpers shared by the studio editors. */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Client-side id for new rows. Call only from event handlers (never during render). */
export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Immutable move of an item up (-1) or down (+1). */
export function move<T>(list: readonly T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return [...list];
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function parseInr(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value.replace(/[,\s₹]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : NaN;
}

/** Returns an error message for a required price field, or undefined. */
export function priceError(value: string, { isRequired = true } = {}): string | undefined {
  const n = parseInr(value);
  if (n === null) return isRequired ? "Enter a price (0 for free)." : undefined;
  if (Number.isNaN(n)) return "Use numbers only, e.g. 2499.";
  return undefined;
}

export type Errors<K extends string> = Partial<Record<K, string>>;

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
