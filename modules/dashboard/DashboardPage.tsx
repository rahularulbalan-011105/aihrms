"use client";

import { useState } from "react";
import StatCard from "./components/StatCard";
import JobCard, { Job } from "./components/JobCard";
import MatchInsightsPanel from "./components/MatchInsightsPanel";
import JobAlertsPanel from "./components/JobAlertsPanel";
import CareerTipsPanel from "./components/CareerTipsPanel";

// ─── Static mock data ────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Recommended Jobs", value: "18", sub: "New",
    iconBg: "bg-green-50",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Application Status", value: "12", sub: "Applied", href: "/applications",
    iconBg: "bg-blue-50",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Application Pre-Selected", value: "56", sub: "This week",
    iconBg: "bg-brand-50",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Interview Invites", value: "3", sub: "Pending",
    iconBg: "bg-orange-50",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

const ALL_JOBS: Job[] = [
  {
    id: "1", title: "Software Engineer", company: "Microsoft", verified: true,
    location: "Bangalore, India", experience: "3 – 5 yrs", type: "Full Time",
    skills: ["Java", "Spring Boot", "AWS", "Microservices", "+3"],
    match: 92, matchLabel: "High Match", postedAt: "Posted 2h ago",
  },
  {
    id: "2", title: "Backend Developer", company: "Google", verified: true,
    location: "Hyderabad, India", experience: "2 – 4 yrs", type: "Full Time",
    skills: ["Python", "Django", "SQL", "AWS", "+2"],
    match: 78, matchLabel: "Medium Match", postedAt: "Posted 1d ago",
  },
  {
    id: "3", title: "Senior Software Developer", company: "Tech Innovate Solutions", verified: false,
    location: "Noida, India", experience: "4 – 7 yrs", type: "Full Time",
    skills: ["Java", "Spring", "Hibernate", "SQL"],
    match: 24, matchLabel: "Low Match", postedAt: "Posted 2d ago",
    warning: { kind: "fake", text: "This job posting has been flagged as potentially fake." },
  },
  {
    id: "4", title: "Full Stack Developer", company: "InnovateX Systems", verified: false,
    location: "Pune, India", experience: "3 – 6 yrs", type: "Full Time",
    skills: ["React.js", "Node.js", "MongoDB", "Express", "+2"],
    match: 35, matchLabel: "Low Match", postedAt: "Posted 5d ago",
    warning: { kind: "ghost", text: "This job may be inactive or not actively hiring." },
  },
];

const TABS = [
  { key: "all",     label: "All Jobs",   count: 18 },
  { key: "high",    label: "High Match", count: 6  },
  { key: "applied", label: "Applied",    count: 3  },
];

function filterJobs(tab: string, jobs: Job[]) {
  if (tab === "high")    return jobs.filter((j) => j.match >= 80);
  if (tab === "applied") return jobs.slice(0, 0); // no applied in mock
  return jobs;
}

// ─── Page component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const visibleJobs = filterJobs(activeTab, ALL_JOBS);

  return (
    <div className="flex gap-6 items-start">
      {/* ── Centre column ── */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} sub={stat.sub} icon={stat.icon} iconBg={stat.iconBg} href={"href" in stat ? stat.href : undefined} />
          ))}
        </div>

        {/* Job search bar */}
        <div className="card p-3 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[160px] px-3 py-2 bg-ink-100/60 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Job title, keywords or company" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[120px] px-3 py-2 bg-ink-100/60 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <input type="text" placeholder="Location" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
          </div>
          <select className="flex-1 min-w-[140px] px-3 py-2 bg-ink-100/60 rounded-xl text-[13.5px] text-ink-600 outline-none border-0 cursor-pointer">
            <option>Experience Level</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
          <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity whitespace-nowrap">
            Search Jobs
          </button>
        </div>

        {/* Recommended jobs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-[16px] text-ink-900">Recommended Jobs for You</h2>
            <button className="text-[13px] text-brand-600 font-semibold hover:text-brand-800 transition-colors">See all</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "bg-brand-100 text-brand-700 border border-brand-300"
                    : "text-ink-500 border border-ink-200 hover:bg-ink-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div className="space-y-3">
            {visibleJobs.length === 0 ? (
              <p className="text-center text-ink-400 text-[13px] py-8">No jobs in this category yet.</p>
            ) : (
              visibleJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>

          {/* Load more */}
          <div className="mt-5 text-center">
            <button className="text-[13.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors flex items-center gap-1.5 mx-auto">
              View more jobs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <aside className="w-[300px] shrink-0 space-y-4 hidden lg:block">
        <MatchInsightsPanel />
        <JobAlertsPanel />
        <CareerTipsPanel />
      </aside>
    </div>
  );
}
