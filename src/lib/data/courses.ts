import type { Course } from "@/lib/types";

/*
 * SAMPLE CATALOGUE — titles, prices and modules are demo content to show the
 * workflow. Replace with Kamlesh Chandra's real programmes before launch.
 */
const COURSES: Course[] = [
  {
    slug: "memory-mastery-for-students",
    title: "Memory Mastery for Students",
    subtitle: "Study less, remember more — the Scientific Retention Management method for exams and for life.",
    audience: ["students"],
    format: "self-paced",
    level: "Foundation",
    priceInr: 2499,
    compareAtInr: 3999,
    durationLabel: "6 weeks · 18 lessons",
    language: "Hindi & English",
    outcomes: [
      "Understand how memories form, fade and come back",
      "Replace re-reading with recall that actually sticks",
      "Build a weekly revision rhythm around your timetable",
      "Walk into an exam calm, because you know what you know",
    ],
    modules: [
      {
        id: "m1",
        title: "Your $10-trillion brain",
        lessons: [
          { id: "l1", title: "Why we forget (and why that's good news)", minutes: 12, isPreview: true },
          { id: "l2", title: "Encoding: giving an idea somewhere to live", minutes: 15 },
          { id: "l3", title: "Attention, emotion and memory", minutes: 14 },
        ],
      },
      {
        id: "m2",
        title: "Recall, don't reread",
        lessons: [
          { id: "l4", title: "The blank-page test", minutes: 10 },
          { id: "l5", title: "Questions as memory hooks", minutes: 13 },
          { id: "l6", title: "Teaching it back", minutes: 11 },
        ],
      },
      {
        id: "m3",
        title: "The rhythm of revision",
        lessons: [
          { id: "l7", title: "Spacing: day 1, day 7, day 30", minutes: 16 },
          { id: "l8", title: "Designing your revision calendar", minutes: 18 },
          { id: "l9", title: "Exam week without panic", minutes: 12 },
        ],
      },
    ],
    image: "/images/schoolgirls.jpg",
    coverTone: "violet",
    status: "published",
    isSample: true,
  },
  {
    slug: "parenting-the-learning-brain",
    title: "Parenting the Learning Brain",
    subtitle: "Neuroplasticity, behaviour and motivation — how parents become partners in their child's learning.",
    audience: ["parents"],
    format: "live-online",
    level: "Foundation",
    priceInr: 1999,
    durationLabel: "4 live evenings · Saturdays 7 pm IST",
    language: "Hindi & English",
    outcomes: [
      "Read your child's behaviour as information, not defiance",
      "Create a home routine that supports memory and sleep",
      "Praise effort in a way that builds resilience",
      "Talk to teachers as a partner, not a critic",
    ],
    modules: [
      {
        id: "m1",
        title: "The growing brain",
        lessons: [
          { id: "l1", title: "Neuroplasticity for parents", minutes: 60, isPreview: true },
          { id: "l2", title: "Emotions as the gateway to learning", minutes: 60 },
        ],
      },
      {
        id: "m2",
        title: "Home as a learning ecosystem",
        lessons: [
          { id: "l3", title: "Routines, screens and sleep", minutes: 60 },
          { id: "l4", title: "The home-school partnership", minutes: 60 },
        ],
      },
    ],
    image: "/images/parent-child.jpg",
    coverTone: "marigold",
    status: "published",
    isSample: true,
  },
  {
    slug: "neuroeducation-for-teachers",
    title: "Neuroeducation for Teachers",
    subtitle: "Cognitive load, differentiated instruction and classroom neuropsychology — teaching the way brains learn.",
    audience: ["teachers", "schools"],
    format: "live-online",
    level: "Intermediate",
    priceInr: 4999,
    compareAtInr: 6500,
    durationLabel: "8 weeks · certificate",
    language: "English",
    outcomes: [
      "Plan lessons that respect working-memory limits",
      "Build retrieval practice into every period",
      "Differentiate without tripling your workload",
      "Design NEP 2020-aligned, competency-based assessments",
    ],
    modules: [
      {
        id: "m1",
        title: "How learning happens",
        lessons: [
          { id: "l1", title: "Schema theory in the classroom", minutes: 45, isPreview: true },
          { id: "l2", title: "Cognitive load, explained with chalk", minutes: 45 },
        ],
      },
      {
        id: "m2",
        title: "Retention by design",
        lessons: [
          { id: "l3", title: "Retrieval starters and exit tickets", minutes: 45 },
          { id: "l4", title: "Spacing across a term plan", minutes: 45 },
        ],
      },
      {
        id: "m3",
        title: "Every learner, differently",
        lessons: [
          { id: "l5", title: "Differentiated instruction that scales", minutes: 45 },
          { id: "l6", title: "Competency-based assessment under NEP 2020", minutes: 45 },
        ],
      },
    ],
    image: "/images/teacher-training.jpg",
    coverTone: "ink",
    status: "published",
    isSample: true,
  },
  {
    slug: "inner-growth-life-design",
    title: "Inner Growth & Life Design",
    subtitle: "Vedantic wisdom with modern psychology — emotional regulation, purpose and the daily practice of becoming.",
    audience: ["students", "parents", "teachers"],
    format: "self-paced",
    level: "Foundation",
    priceInr: 1499,
    durationLabel: "21 days · 21 short practices",
    language: "Hindi",
    outcomes: [
      "A ten-minute morning practice you will keep",
      "Tools to notice and steady difficult emotions",
      "A written life-design map for the next year",
    ],
    modules: [
      {
        id: "m1",
        title: "Week 1 — Awareness",
        lessons: [
          { id: "l1", title: "The mantra and why it works", minutes: 9, isPreview: true },
          { id: "l2", title: "Breath as an anchor", minutes: 8 },
        ],
      },
      {
        id: "m2",
        title: "Week 2 — Regulation",
        lessons: [
          { id: "l3", title: "Naming what you feel", minutes: 10 },
          { id: "l4", title: "Responding, not reacting", minutes: 10 },
        ],
      },
      {
        id: "m3",
        title: "Week 3 — Purpose",
        lessons: [
          { id: "l5", title: "Your life-design map", minutes: 15 },
          { id: "l6", title: "Becoming who you were meant to be", minutes: 12 },
        ],
      },
    ],
    image: "/images/sunrise.jpg",
    coverTone: "marigold",
    status: "published",
    isSample: true,
  },
];

export async function getCourses(): Promise<Course[]> {
  return COURSES.filter((c) => c.status === "published");
}

export async function getAllCoursesForStudio(): Promise<Course[]> {
  return COURSES;
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  return COURSES.find((c) => c.slug === slug);
}

export function courseLessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export const AUDIENCE_LABEL: Record<Course["audience"][number], string> = {
  students: "Students",
  parents: "Parents",
  teachers: "Teachers",
  schools: "Schools",
};

export const FORMAT_LABEL: Record<Course["format"], string> = {
  "self-paced": "Self-paced",
  "live-online": "Live online",
  "in-person": "In person",
};
