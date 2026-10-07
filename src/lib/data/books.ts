import type { Book } from "@/lib/types";

/*
 * SAMPLE BOOKS — working titles for the demo. Covers are drawn in code
 * (BookCover component) so no fake cover art is presented as real.
 */
const BOOKS: Book[] = [
  {
    slug: "your-ten-trillion-dollar-brain",
    title: "Your $10 Trillion Brain",
    subtitle: "A practical guide to remembering what matters",
    blurb:
      "The ideas behind Scientific Retention Management, written for anyone who has ever studied hard and forgotten anyway. Short chapters, real exercises, and a revision rhythm you can start tonight.",
    pages: 224,
    language: "English",
    editions: [
      { format: "paperback", priceInr: 399, inStock: true },
      { format: "ebook", priceInr: 199, inStock: true },
    ],
    coverTone: "violet",
    coverLine: "Remember what matters",
    contents: [
      "The most valuable thing you own",
      "Why forgetting is a feature",
      "Encoding with meaning",
      "Recall beats rereading",
      "The rhythm of revision",
      "Memory, emotion and the body",
      "A 30-day retention plan",
    ],
    status: "published",
    isSample: true,
  },
  {
    slug: "learning-is-a-rhythm",
    title: "Learning Is a Rhythm, Not a Race",
    subtitle: "Notes for parents and teachers on raising whole, wise, wondrous children",
    blurb:
      "Drawn from two decades of building a school like a garden: how to protect a child's wonder, teach emotions as a language, and partner with teachers instead of competing with other parents.",
    pages: 188,
    language: "English",
    editions: [
      { format: "paperback", priceInr: 349, inStock: true },
      { format: "ebook", priceInr: 179, inStock: true },
    ],
    coverTone: "marigold",
    coverLine: "Not a race — a rhythm",
    contents: [
      "Every child is born whole",
      "Schools like gardens",
      "Emotions as a language",
      "Parents as partners",
      "For life, not just a livelihood",
    ],
    status: "published",
    isSample: true,
  },
  {
    slug: "be-better-everyday",
    title: "Be Better Everyday",
    subtitle: "365 morning mantras and practices",
    blurb:
      "One page for every morning of the year: a mantra, a question and a two-minute practice, in Hindi and English. Built from the daily reminders Kamlesh Chandra shares with his learners.",
    pages: 380,
    language: "Hindi & English",
    editions: [
      { format: "paperback", priceInr: 449, inStock: false },
      { format: "ebook", priceInr: 249, inStock: true },
    ],
    coverTone: "rose",
    coverLine: "365 mornings",
    contents: ["January — Awareness", "April — Courage", "July — Clarity", "October — Grace"],
    status: "pre-order",
    isSample: true,
  },
];

export async function getBooks(): Promise<Book[]> {
  return BOOKS.filter((b) => b.status !== "draft");
}

export async function getAllBooksForStudio(): Promise<Book[]> {
  return BOOKS;
}

export async function getBook(slug: string): Promise<Book | undefined> {
  return BOOKS.find((b) => b.slug === slug);
}

export function lowestPrice(book: Book): number {
  return Math.min(...book.editions.map((e) => e.priceInr));
}

export const BOOK_FORMAT_LABEL: Record<Book["editions"][number]["format"], string> = {
  paperback: "Paperback",
  ebook: "eBook",
  audiobook: "Audiobook",
};
