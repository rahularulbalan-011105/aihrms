export type Category =
  | "all"
  | "general"
  | "seekers"
  | "agencies"
  | "security"
  | "pricing"
  | "integrations"
  | "technical";

export type Q = { q: string; a: string; cat: Exclude<Category, "all"> };

export const QUESTIONS: Q[] = [
  {
    q: "What is HireMind?",
    a: "HireMind is an AI-powered recruitment platform that helps job seekers find the right opportunities and helps agencies streamline hiring with AI-driven matching, automation, and insights.",
    cat: "general",
  },
  {
    q: "How does AI matching work?",
    a: "Our AI analyzes resumes, job descriptions, skills, experience, and intent — then ranks candidates by relevance using semantic similarity and contextual signals, not just keyword overlap.",
    cat: "general",
  },
  {
    q: "Is HireMind suitable for both job seekers and recruitment agencies?",
    a: "Yes. Job seekers get smart matching, auto-apply, and fake-job detection. Agencies get bulk parsing, semantic candidate search, screening automation, and hiring analytics — all from the same platform.",
    cat: "general",
  },
  {
    q: "Can I try HireMind before subscribing?",
    a: "Absolutely — every plan includes a free trial. You can also book a live demo with our team to see how HireMind fits your hiring workflow before you commit.",
    cat: "pricing",
  },
  {
    q: "How secure is my data on HireMind?",
    a: "We use bank-grade encryption (in transit and at rest), role-based access controls, regular security audits, and store your data in compliant regional data centers. Sensitive resume data is never shared with third parties.",
    cat: "security",
  },
  {
    q: "What integrations does HireMind support?",
    a: "HireMind integrates with leading job boards, ATS systems, calendar tools, and communication platforms. Custom integrations are available on Business and Enterprise plans.",
    cat: "integrations",
  },
  {
    q: "How does pricing and billing work?",
    a: "Plans are billed annually for the best rate, with monthly options on the Professional tier and above. Enterprise pricing is custom and tailored to your team size, volume, and integration needs.",
    cat: "pricing",
  },
  {
    q: "Can job seekers create alerts for specific roles?",
    a: "Yes — set keyword, location, and salary filters; HireMind surfaces matching roles in real time.",
    cat: "seekers",
  },
  {
    q: "Do you support resume builder for job seekers?",
    a: "Yes, with AI-assisted suggestions that align your profile to roles you're targeting.",
    cat: "seekers",
  },
  {
    q: "How do agencies manage team permissions?",
    a: "Granular roles let you scope users to specific jobs, candidates, or analytics views.",
    cat: "agencies",
  },
  {
    q: "Is my data deletable on request?",
    a: "Yes — you can request full deletion of your account and associated data at any time.",
    cat: "security",
  },
  {
    q: "Do you provide an API?",
    a: "Yes — API access is included on Business and Enterprise plans.",
    cat: "technical",
  },
];

export const CATEGORIES: { id: Category; title: string; icon: string }[] = [
  { id: "all", title: "All Questions", icon: "▦" },
  { id: "general", title: "General", icon: "ⓘ" },
  { id: "seekers", title: "For Job Seekers", icon: "👤" },
  { id: "agencies", title: "For Agencies / Recruiters", icon: "👥" },
  { id: "security", title: "Security & Privacy", icon: "🛡" },
  { id: "pricing", title: "Pricing & Billing", icon: "💳" },
  { id: "integrations", title: "Integrations", icon: "⚙" },
  { id: "technical", title: "Technical", icon: "✦" },
];

/** Counts derived from QUESTIONS so they never desync when items are added. */
export function countFor(id: Category): number {
  if (id === "all") return QUESTIONS.length;
  return QUESTIONS.filter((question) => question.cat === id).length;
}
