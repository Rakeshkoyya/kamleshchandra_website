/*
 * Facts about Kamlesh Chandra — taken from his profile sheet (docs/profile.jpeg).
 * Everything here is real per the client's documents. Do not add numbers,
 * awards or quotes that are not in those documents.
 */

export const person = {
  name: "Kamlesh Chandra",
  shortName: "KC",
  roles: [
    "Director – Academics",
    "Cognitive Learning Strategist",
    "Life Design Coach",
    "Career Architect",
    "Neuroeducation Consultant",
    "Instructional Systems Designer",
    "Transformational Learning Specialist",
    "Applied Spiritual Educator",
  ],
  phones: ["9829058584", "9166022555"],
  email: "learn@kamleshchandra.com",
  website: "https://www.eshana.in",
  school: {
    name: "SHANA International — The Future School",
    city: "Bikaner, Rajasthan",
    url: "https://www.shanainternational.com",
    recognition: "Awarded as the Most Innovative School of India",
  },
  classesFormUrl: "https://forms.gle/mL14JuQdT4vRMziu9",
  portrait: "/images/kamlesh-portrait.jpg",
} as const;

export const mantra = {
  line: "Always remember, you are so unique and so special — even one of your assets, your brain, is worth $10 trillion.",
  practice:
    "I am a divine being of rare brilliance — unique, extraordinary, and born for greatness. My $10-trillion brain is a sacred engine of creation. Every sunrise awakens deeper wisdom within me. Every step aligns me with my highest purpose. I move with courage, clarity, and cosmic grace. I am limitless. I am radiant. I am becoming who I was always meant to be.",
  invite: "You're invited to grow with us — Be Better Everyday.",
} as const;

export const proof = [
  { value: 20, suffix: "+", label: "years in education", detail: "An academic career spanning more than two decades" },
  { value: 15, suffix: "+", label: "years as Director – Academics", detail: "At SHANA International School, Bikaner" },
  { value: 3000, suffix: "+", label: "training sessions mentored", detail: "For schools, teachers and parents" },
  { value: 3000, suffix: "+", label: "educators", detail: "Supported in their own evolution as teachers" },
  { value: 1000000, suffix: "", label: "learners reached", detail: "10,00,000 students and counting" },
] as const;

export const press = ["The Teacher (Australia)", "Brainfeed", "Consilience USA"] as const;

export const frameworks = [
  {
    name: "Scientific Retention Management",
    short: "SRM",
    line: "Keeping what you learn — by design, not by luck.",
    body: "A framework that raises learner efficacy by working with how memory actually forms: metacognitive strategies, deliberate recall, and neuro-associative encoding.",
  },
  {
    name: "Quantum Learning Mechanism",
    short: "QLM",
    line: "Learning that multiplies instead of adds.",
    body: "Connects new knowledge to what a learner already knows and feels, so every idea becomes a hook for the next — a mechanism for exponential, not linear, growth.",
  },
] as const;

export const competencies = [
  {
    title: "Curriculum Innovation & Design Thinking",
    body: "Constructivist, inquiry-led, NEP 2020-compliant learning frameworks across K-12, focused on 21st-century competencies and holistic development.",
  },
  {
    title: "Teacher Development & Instructional Leadership",
    body: "Capacity-building programmes on andragogy, differentiated instruction, cognitive load management, classroom neuropsychology and learner-centred teaching.",
  },
  {
    title: "Parent Engagement & Psychosocial Seminars",
    body: "Parental sensitisation workshops on neuroplasticity, behaviour modulation and performance scaffolding — building home-school partnerships.",
  },
  {
    title: "Student Performance Engineering",
    body: "High-impact interventions rooted in schema theory, cognitive apprenticeship and behavioural mastery, turning potential into measurable achievement.",
  },
  {
    title: "Spiritual Psychology & Transformative Coaching",
    body: "Ancient Vedantic wisdom with contemporary psychological tools, for inner growth, emotional regulation and a sense of purpose.",
  },
] as const;

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" },
  { href: "/journal", label: "Journal" },
] as const;
