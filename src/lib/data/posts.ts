import type { Post } from "@/lib/types";

/* SAMPLE JOURNAL POSTS — demo copy written in KC's themes; replace with his own writing. */
const POSTS: Post[] = [
  {
    slug: "why-we-forget",
    title: "Why we forget — and why that is good news",
    excerpt:
      "Forgetting is not a flaw in your child or in you. It is the brain clearing space. The trick is to tell it what to keep.",
    category: "Memory",
    publishedAt: "2026-09-28T07:00:00+05:30",
    readMinutes: 6,
    image: "/images/open-book.jpg",
    body: [
      "Every parent has seen it: a chapter learned perfectly on Sunday night is gone by Thursday's test. We call it carelessness. It is biology.",
      "## The brain is an editor",
      "Your brain receives far more than it could ever store, so it keeps what it is told matters and quietly lets the rest go. In 1885 Hermann Ebbinghaus measured this on himself and drew the first forgetting curve: memory falls steeply at first, then levels off.",
      "> The question is never 'how do I stop forgetting?' It is 'how do I tell my brain this matters?'",
      "## Tell it twice, then again",
      "Each time you pull an idea back out of memory — not re-read it, but recall it — the curve resets higher and falls more slowly. That is the heart of Scientific Retention Management: a rhythm of revisits, timed to the moments just before you would forget.",
      "Start small. Tonight, close the book and write down everything you remember. Tomorrow, do it again before you open it.",
    ],
    status: "published",
    isSample: true,
  },
  {
    slug: "schools-like-gardens",
    title: "We build schools like gardens",
    excerpt: "Every child is born whole, wise and wondrous. A school's first job is to protect that wonder.",
    category: "Teaching",
    publishedAt: "2026-09-14T07:00:00+05:30",
    readMinutes: 5,
    image: "/images/storytelling-circle.jpg",
    body: [
      "A garden does not hurry. It prepares soil, waters, waits, and trusts. A classroom can work the same way.",
      "## Questions as seeds",
      "When a child asks why, they are planting something. Our job is to notice, to water, and not to pull it up to check the roots.",
      "> Learning is not a race, but a rhythm.",
      "Teachers become artists of awakening, parents become partners, and children become co-creators of a wiser world.",
    ],
    status: "published",
    isSample: true,
  },
  {
    slug: "parents-as-partners",
    title: "Three conversations every parent should have this term",
    excerpt: "Not about marks. About sleep, about feelings, and about what your child is curious about.",
    category: "Parenting",
    publishedAt: "2026-08-30T07:00:00+05:30",
    readMinutes: 4,
    image: "/images/parent-child.jpg",
    body: [
      "The most useful thing a parent can do for memory has nothing to do with textbooks.",
      "## 1. Sleep",
      "Memories are consolidated during sleep. A child who revises until midnight and sleeps five hours has studied hard and kept little.",
      "## 2. Feelings",
      "A frightened brain does not learn. Ask how school felt today before you ask what was taught.",
      "## 3. Curiosity",
      "Ask what they wondered about. Curiosity is the strongest memory hook we have.",
    ],
    status: "published",
    isSample: true,
  },
  {
    slug: "the-morning-mantra",
    title: "The morning mantra, and why I ask you to say it aloud",
    excerpt: "Words spoken every morning become the voice you hear when things are hard.",
    category: "Inner growth",
    publishedAt: "2026-08-12T06:30:00+05:30",
    readMinutes: 3,
    image: "/images/sunrise.jpg",
    body: [
      "I am a divine being of rare brilliance. It can feel strange to say. Say it anyway.",
      "## Repetition is how belief is built",
      "The same principle that helps a child remember a formula helps an adult remember their own worth: repeat it, recall it, and revisit it before it fades.",
      "> Every sunrise awakens deeper wisdom within me.",
    ],
    status: "published",
    isSample: true,
  },
];

export async function getPosts(): Promise<Post[]> {
  return POSTS.filter((p) => p.status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getAllPostsForStudio(): Promise<Post[]> {
  return POSTS;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return POSTS.find((p) => p.slug === slug);
}
