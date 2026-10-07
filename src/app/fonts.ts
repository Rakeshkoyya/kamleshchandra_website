import { Kalam, Mukta, Petrona } from "next/font/google";

/* Petrona: warm, slightly rough serif — a teacher's voice on the page. */
export const petrona = Petrona({ subsets: ["latin"], display: "swap", variable: "--font-petrona" });

/* Mukta: humanist sans with Devanagari, ready for Hindi content. */
export const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mukta",
});

/* Kalam: handwriting — only for his signature lines ("Remind yourself everyday…", KC). */
export const kalam = Kalam({ subsets: ["latin", "devanagari"], weight: ["400", "700"], display: "swap", variable: "--font-kalam" });
