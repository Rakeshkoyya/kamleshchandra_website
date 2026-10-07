import type { Metadata } from "next";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { kalam, mukta, petrona } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kamlesh Chandra — Memory, learning and life design",
    template: "%s · Kamlesh Chandra",
  },
  description:
    "Kamlesh Chandra is a cognitive learning strategist and creator of Scientific Retention Management. Programs, books, events and writing on memory, learning and inner growth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${petrona.variable} ${mukta.variable} ${kalam.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
