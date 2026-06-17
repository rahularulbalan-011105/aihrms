"use client";

import { useState } from "react";
import Link from "next/link";

const SEGMENTS = [
  { label: "Skills Match", pct: 45, color: "#22c55e" },
  { label: "Experience Match", pct: 30, color: "#3b82f6" },
  { label: "Education Match", pct: 10, color: "#6d4cff" },
  { label: "Other Factors", pct: 15, color: "#d1d5db" },
];

const KEY_AREAS = [
  {
    key: "skills",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6d4cff"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Skills",
    desc: "Add more relevant skills to match the job requirements.",
    badge: "Low Match",
    badgeColor: "bg-red-100 text-red-600",
    pct: 45,
    suggestions: 4,
    items: [
      "Add TypeScript to your skills",
      "Add React.js proficiency",
      "Add Docker & containerization",
      "Add CI/CD pipeline experience",
    ],
  },
  {
    key: "experience",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    title: "Experience",
    desc: "Highlight more relevant experience and achievements.",
    badge: "Medium Match",
    badgeColor: "bg-yellow-100 text-yellow-700",
    pct: 30,
    suggestions: 3,
    items: [
      "Add quantifiable achievements to your roles",
      "Include project descriptions",
      "Mention team sizes and leadership",
    ],
  },
  {
    key: "education",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Education & Certifications",
    desc: "Add more qualifications to stand out.",
    badge: "Low Match",
    badgeColor: "bg-red-100 text-red-600",
    pct: 10,
    suggestions: 2,
    items: [
      "Add relevant certifications (AWS, GCP, etc.)",
      "Include online courses and training",
    ],
  },
  {
    key: "other",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
    title: "Other Factors",
    desc: "Complete your profile and improve other sections.",
    badge: "Medium Match",
    badgeColor: "bg-yellow-100 text-yellow-700",
    pct: 15,
    suggestions: 5,
    items: [
      "Add a professional profile picture",
      "Write a compelling summary",
      "Add portfolio links",
      "Fill in preferred location",
      "Set job preferences",
    ],
  },
];

const TOP_SKILLS = [
  "TypeScript",
  "React.js",
  "Node.js",
  "Docker",
  "Kubernetes",
  "AWS",
  "CI/CD",
  "System Design",
];

const ACTIONS = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    iconBg: "bg-green-100",
    title: "Add Relevant Skills",
    desc: "Add top skills required in similar jobs.",
    impact: "+15% Potential Increase",
    label: "Add Skills",
    href: "/profile",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    iconBg: "bg-blue-100",
    title: "Add More Experience",
    desc: "Add details of your recent projects or roles.",
    impact: "+20% Potential Increase",
    label: "Add Experience",
    href: "/profile",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    iconBg: "bg-orange-100",
    title: "Add Certifications",
    desc: "Showcase your certifications and training.",
    impact: "+10% Potential Increase",
    label: "Add Certifications",
    href: "/profile",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    iconBg: "bg-purple-100",
    title: "Add Portfolio",
    desc: "Share your work and projects.",
    impact: "+10% Potential Increase",
    label: "Add Portfolio",
    href: "/profile",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
    iconBg: "bg-ink-100",
    title: "Complete Your Profile",
    desc: "Add a profile picture, summary and more.",
    impact: "+5% Potential Increase",
    label: "Update Profile",
    href: "/profile",
  },
];

export default function ImproveMatchPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Back link + title */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 hover:text-brand-600 transition-colors mb-3"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-display font-extrabold text-[22px] text-ink-900 flex items-center gap-2">
          Improve Your Match
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6d4cff"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </h1>
        <p className="text-[13.5px] text-ink-500 mt-1">
          Increase your match score and get noticed by top recruiters.
        </p>
      </div>

      {/* Top cards row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall match score */}
        <div className="card p-5 lg:col-span-1">
          <p className="text-[13px] font-semibold text-ink-600 mb-3">
            Your Overall Match Score
          </p>
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(
                  ${SEGMENTS[0].color} 0% 45%,
                  ${SEGMENTS[1].color} 45% 75%,
                  ${SEGMENTS[2].color} 75% 85%,
                  ${SEGMENTS[3].color} 85% 100%
                )`,
                }}
              />
              <div className="absolute inset-[20px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">
                  92%
                </span>
                <span className="text-[9px] text-ink-500 font-medium">
                  High Match
                </span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              {SEGMENTS.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-[11px] text-ink-600">{label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-ink-700">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 15% + "You're in top" */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <p className="font-display font-bold text-[15px] text-ink-900">
              You&apos;re in the top 15% of candidates!
            </p>
            <p className="text-[12.5px] text-ink-500 mt-1">
              Great job! Improve the areas below to increase your chances of
              getting shortlisted.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {SEGMENTS.map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-[130px] shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="text-[11.5px] text-ink-600">{label}</span>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="text-[11.5px] font-semibold text-ink-700 w-8 text-right">
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Potential score + quick tip */}
        <div className="space-y-4">
          {/* Potential match */}
          <div className="card p-4 text-center">
            <p className="text-[13px] font-semibold text-ink-600">
              Potential Match Score
            </p>
            <p className="font-display font-extrabold text-[36px] text-green-600 leading-none mt-1">
              98%
            </p>
            <p className="text-[12px] text-green-600 font-semibold mt-0.5">
              ✦ Excellent Match ✦
            </p>
            <p className="text-[11.5px] text-ink-500 mt-1">
              Keep improving to unlock better opportunities.
            </p>
            <div className="mt-3 flex items-center gap-2 bg-brand-50 rounded-xl p-2.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6d4cff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <p className="text-[11.5px] text-brand-700 font-medium">
                Almost there! Complete the suggested actions to reach 98%
              </p>
            </div>
          </div>
          {/* Quick tip */}
          <div className="card p-4">
            <div className="flex items-start gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6d4cff"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-[13px] font-bold text-brand-700">
                  Quick Tip
                </p>
                <p className="text-[12px] text-ink-600 mt-0.5">
                  Adding more relevant skills and completing your profile can
                  significantly improve your match score.
                </p>
                <p className="text-[12px] text-ink-500 mt-2">
                  Profiles with 100% match score get{" "}
                  <span className="font-bold text-brand-700">
                    3X more chances of callback
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Key areas + top skills */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-display font-bold text-[16px] text-ink-900 mb-4">
              Key Areas to Improve
            </h2>
            <div className="space-y-2">
              {KEY_AREAS.map((area) => (
                <div
                  key={area.key}
                  className="border border-ink-100 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(expanded === area.key ? null : area.key)
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ink-50/60 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center shrink-0">
                      {area.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-ink-800">
                        {area.title}
                      </p>
                      <p className="text-[12px] text-ink-500">{area.desc}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${area.badgeColor}`}
                    >
                      {area.badge}
                    </span>
                    <span className="text-[13px] font-bold text-ink-700 w-8 text-right shrink-0">
                      {area.pct}%
                    </span>
                    <span className="text-[12px] text-ink-400 shrink-0">
                      {area.suggestions} suggestions
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`shrink-0 transition-transform ${expanded === area.key ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {expanded === area.key && (
                    <div className="border-t border-ink-100 bg-ink-50/30 px-4 py-3 space-y-2">
                      {area.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-[13px] text-ink-700"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6d4cff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top skills to add */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-display font-bold text-[16px] text-ink-900">
                  Top Skills to Add
                </h2>
                <p className="text-[12.5px] text-ink-500 mt-0.5 mb-3">
                  These skills are highly relevant to jobs you&apos;re
                  interested in.
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOP_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-[12.5px] font-semibold text-brand-700 hover:bg-brand-100 transition-colors flex items-center gap-1"
                    >
                      {skill}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  ))}
                </div>
                <button className="mt-3 text-[13px] text-brand-600 font-semibold hover:text-brand-800 transition-colors flex items-center gap-1">
                  View all recommended skills
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              {/* Rocket illustration */}
              <svg
                width="72"
                height="80"
                viewBox="0 0 80 90"
                fill="none"
                className="shrink-0 hidden sm:block"
              >
                <ellipse cx="40" cy="75" rx="18" ry="6" fill="#e0e7ff" />
                <path
                  d="M40 10 C20 30 15 55 25 65 L40 75 L55 65 C65 55 60 30 40 10Z"
                  fill="#6d4cff"
                />
                <ellipse cx="40" cy="45" rx="10" ry="13" fill="#a78bfa" />
                <circle cx="40" cy="42" r="7" fill="#ede9fe" />
                <path d="M25 65 L18 78 L30 72Z" fill="#f97316" />
                <path d="M55 65 L62 78 L50 72Z" fill="#f97316" />
                <path d="M34 65 L36 82 L40 75 L44 82 L46 65Z" fill="#fbbf24" />
              </svg>
            </div>
          </div>

          {/* CTA banner */}
          <div className="card p-4 flex items-center gap-3 bg-gradient-to-r from-brand-50 to-green-50">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink-900">
                Take action and improve your match score!
              </p>
              <p className="text-[12.5px] text-ink-500">
                Apply these suggestions to increase your visibility and get more
                interview calls.
              </p>
            </div>
            <Link
              href="/profile"
              className="shrink-0 px-5 py-2.5 rounded-xl text-white text-[13px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: "var(--gradient-brand)" }}
            >
              Update My Profile
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="7 17 17 7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Actions panel */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-[15px] text-ink-900 mb-4">
            Actions to Improve Your Match
          </h2>
          <div className="space-y-4">
            {ACTIONS.map((action) => (
              <div key={action.title} className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink-800">
                    {action.title}
                  </p>
                  <p className="text-[11.5px] text-ink-500">{action.desc}</p>
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                    {action.impact}
                  </p>
                </div>
                <Link
                  href={action.href}
                  className="shrink-0 px-3 py-1.5 rounded-xl border border-brand-200 text-[11.5px] font-semibold text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
                >
                  {action.label}
                </Link>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors flex items-center gap-1">
            View Matching Parameters
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
