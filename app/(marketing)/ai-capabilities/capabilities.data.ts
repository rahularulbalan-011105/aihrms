import type { Stat } from "@/components/marketing/StatsStrip";

export const STATS: Stat[] = [
  { value: "2M+", label: "Candidates Processed", caption: "with AI" },
  { value: "50K+", label: "Recruiters Using", caption: "AI HRMS" },
  { value: "10K+", label: "Agencies Trust", caption: "AI HRMS" },
  { value: "98%", label: "Matching Accuracy", caption: "with AI" },
  { value: "70%", label: "Faster Hiring with", caption: "AI Automation" },
];

export type Tone = "purple" | "blue" | "green" | "orange" | "red";

export type Capability = {
  icon: string;
  tone: Tone;
  title: string;
  body: string;
  /** Key into BLOCKS in components/blocks.tsx. */
  block: string;
};

export const ICON_TONE: Record<Tone, string> = {
  purple: "bg-brand-50 text-brand-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  orange: "bg-orange-50 text-orange-700",
  red: "bg-red-50 text-red-700",
};

export const CAPABILITIES: Capability[] = [
  {
    icon: "match",
    tone: "purple",
    title: "AI Job Matching",
    body: "Matches candidates to the most relevant jobs based on skills, experience and intent.",
    block: "matchBars",
  },
  {
    icon: "parse",
    tone: "blue",
    title: "AI Resume Parsing",
    body: "Extracts and structures information from resumes with high accuracy in seconds.",
    block: "skillsExtracted",
  },
  {
    icon: "search",
    tone: "purple",
    title: "Semantic Search",
    body: "Find the best candidates or jobs using natural language, not just keywords.",
    block: "searchBlock",
  },
  {
    icon: "trophy",
    tone: "green",
    title: "AI Candidate Ranking",
    body: "Ranks candidates by relevance, experience, skills, and potential fit using AI.",
    block: "topCandidate",
  },
  {
    icon: "screen",
    tone: "orange",
    title: "AI Screening & Shortlisting",
    body: "Automatically screens candidates and shortlists the most qualified profiles.",
    block: "screeningTable",
  },
  {
    icon: "shield",
    tone: "red",
    title: "Fake Job Detection",
    body: "Detects scam, expired, misleading and low-quality job postings automatically.",
    block: "riskWarn",
  },
  {
    icon: "duplicate",
    tone: "blue",
    title: "Duplicate Job Detection",
    body: "Identifies and merges duplicate job postings across multiple platforms.",
    block: "duplicateBlock",
  },
  {
    icon: "apply",
    tone: "purple",
    title: "Auto Job Apply",
    body: "Automatically applies to best matching jobs based on your preferences.",
    block: "autoApplyBlock",
  },
  {
    icon: "alert",
    tone: "orange",
    title: "Fake Profile Identification",
    body: "Detects fake resumes, inflated experience, and suspicious candidate profiles.",
    block: "riskGauge",
  },
  {
    icon: "analytics",
    tone: "green",
    title: "Hiring Analytics",
    body: "Provides actionable insights and predictions to improve hiring quality and speed.",
    block: "analyticsBlock",
  },
];
