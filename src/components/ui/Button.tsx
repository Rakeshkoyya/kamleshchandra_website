import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "recall";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none whitespace-nowrap " +
  "transition-[transform,background-color,color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-paper hover:bg-brand-hover shadow-1",
  secondary: "bg-surface text-ink ring-1 ring-line-strong hover:ring-brand hover:text-brand",
  ghost: "text-ink hover:bg-brand-soft",
  recall: "bg-recall text-ink hover:brightness-95 shadow-1",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}

export function ButtonLink({ href, children, variant = "primary", size = "md", className = "", external }: ButtonLinkProps) {
  if (external) {
    return (
      <a href={href} className={buttonClass(variant, size, className)} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
