import type { FeatureCardData } from "./components/FeatureCard";

/** Cards in the "For Job Seekers" column. */
export const SEEKER_FEATURES: FeatureCardData[] = [
  {
    icon: "shield",
    title: "Ghost / Fake Job Detection",
    body: "Automatically detects scam, expired, suspicious and misleading job postings.",
    badge: "AI",
    chip: { text: "Verified Opportunity", tone: "green", iconCheck: true },
  },
  {
    icon: "duplicate",
    title: "Duplicate Job Detection",
    body: "Eliminates duplicate jobs posted across multiple platforms.",
    badge: "AI",
    chip: { text: "12 Duplicates Removed", tone: "purple" },
  },
  {
    icon: "robot",
    title: "Auto Job Apply",
    body: "Automatically applies to jobs that match your preferences, skills and experience.",
    badge: "AI",
    chip: { text: "Applied Automatically ✓", tone: "green" },
  },
  {
    icon: "target",
    title: "Smart Job Matching",
    body: "Personalized job recommendations using AI scoring.",
  },
  {
    icon: "bell",
    title: "Smart Job Alerts",
    body: "Get real-time alerts for highly relevant job opportunities.",
  },
  {
    icon: "track",
    title: "Application Status Tracking",
    body: "Track every application stage in real-time.",
    block: "applicationStages",
  },
];

/** Cards in the agencies column's 2-up grid (below the bulk-resume card). */
export const AGENCY_FEATURES_PRIMARY: FeatureCardData[] = [
  {
    icon: "search",
    title: "Semantic Search",
    body: "Search using natural language. Find the best candidates beyond keyword matching.",
    badge: "AI",
    block: "semanticSearch",
  },
  {
    icon: "fakeprofile",
    title: "Fake Profile Identification",
    body: "AI detects and flags fake or misleading profiles to reduce risk.",
    badge: "AI",
    block: "fakeProfile",
  },
];

/** Cards in the agencies column's 3-up grid. */
export const AGENCY_FEATURES_SECONDARY: FeatureCardData[] = [
  {
    icon: "match",
    title: "AI Candidate Matching",
    body: "Automatically match candidates with job requirements.",
    badge: "AI",
  },
  {
    icon: "analytics",
    title: "Hiring Analytics & Reports",
    body: "Get data-driven insights and improve hiring performance.",
    badge: "AI",
  },
  {
    icon: "team",
    title: "Team Collaboration",
    body: "Collaborate with your team, share notes and feedback.",
    badge: "AI",
    block: "teamMembers",
  },
];
