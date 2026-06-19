"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";

/* ─────────────────────────────────────────────────────────────────────────────
 * Saved Jobs — matches HM_Cand_MySavedJobs reference.
 * Types are shaped for a future GET /saved-jobs response (drop-in swap).
 * ───────────────────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 3;

type MatchLabel = "High Match" | "Good Match" | "Low Match";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  verified: boolean;
  logoBg: string;
  logoChar: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  savedOn: string;
  match: number;
  matchLabel: MatchLabel;
}

/* ─── Mock data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { key: "total",   label: "Total Saved Jobs", value: 24, tint: "purple", icon: <HeartIcon /> },
  { key: "viewed",  label: "Viewed",           value: 12, tint: "blue",   icon: <EyeIcon /> },
  { key: "recent",  label: "Recently Added",   value: 6,  tint: "orange", icon: <ClockIcon /> },
  { key: "expiring",label: "Expiring Soon",    value: 3,  tint: "green",  icon: <BellIcon /> },
];

const SAVED_JOBS: SavedJob[] = [
  { id: "1", title: "Senior Software Engineer", company: "Microsoft", verified: true, logoBg: "bg-[#f3f6fb]", logoChar: "M", location: "Bangalore, India", type: "Full Time", experience: "3 – 5 yrs", skills: ["Java", "Spring Boot", "AWS", "Microservices", "+2"], savedOn: "10 Jun 2026", match: 92, matchLabel: "High Match" },
  { id: "2", title: "Backend Developer", company: "Google", verified: true, logoBg: "bg-[#f3f6fb]", logoChar: "G", location: "Hyderabad, India", type: "Full Time", experience: "2 – 4 yrs", skills: ["Python", "Django", "SQL", "AWS", "+2"], savedOn: "08 Jun 2026", match: 78, matchLabel: "Good Match" },
  { id: "3", title: "Cloud Engineer", company: "Amazon", verified: true, logoBg: "bg-[#fff7ed]", logoChar: "a", location: "Pune, India", type: "Full Time", experience: "3 – 6 yrs", skills: ["AWS", "Docker", "Kubernetes", "Terraform", "+1"], savedOn: "01 Jun 2026", match: 85, matchLabel: "High Match" },
  { id: "4", title: "Software Engineer", company: "Infosys", verified: true, logoBg: "bg-[#eef2ff]", logoChar: "I", location: "Chennai, India", type: "Full Time", experience: "2 – 4 yrs", skills: ["Java", "SQL", "Hibernate", "REST API", "+1"], savedOn: "28 May 2026", match: 88, matchLabel: "High Match" },
  { id: "5", title: "DevOps Engineer", company: "Dell Technologies", verified: true, logoBg: "bg-[#eff6ff]", logoChar: "D", location: "Bangalore, India", type: "Full Time", experience: "3 – 5 yrs", skills: ["Jenkins", "AWS", "Linux", "Ansible", "+2"], savedOn: "25 May 2026", match: 72, matchLabel: "Good Match" },
];

const INSIGHT_SEGMENTS = [
  { label: "High Match", count: 18, pct: 75, color: "#22c55e" },
  { label: "Good Match", count: 4,  pct: 17, color: "#3b82f6" },
  { label: "Low Match",  count: 2,  pct: 8,  color: "#f97316" },
];

const EXPIRING = [
  { company: "Microsoft", logoChar: "M", title: "Senior Software Engineer", left: "2 days left" },
  { company: "Google",    logoChar: "G", title: "Backend Developer",        left: "5 days left" },
  { company: "Amazon",    logoChar: "a", title: "Cloud Engineer",           left: "7 days left" },
];

const RECOMMENDATIONS = [
  { company: "Flipkart",  logoChar: "F", title: "Frontend Developer", match: 92 },
  { company: "Swiggy",    logoChar: "S", title: "SRE Engineer",       match: 88 },
  { company: "Accenture", logoChar: "A", title: "Cloud Architect",    match: 85 },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SavedJobsPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(SAVED_JOBS.length / PAGE_SIZE);
  const pageJobs = SAVED_JOBS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Centre column ── */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-ink-900 inline-flex items-center gap-2">
              <span className="text-brand-600"><HeartIcon big /></span> Saved Jobs
            </h1>
            <p className="text-[13.5px] text-ink-500 mt-0.5">Jobs you&apos;ve saved for later. Review and apply when you&apos;re ready.</p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
            <UploadIcon /> <span className="hidden sm:inline">Export Saved Jobs</span>
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ key, ...rest }) => <StatTile key={key} {...rest} />)}
        </div>

        {/* Filter bar */}
        <div className="card p-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
            <SearchIcon />
            <input type="text" placeholder="Search by job title, company or keywords" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
          </div>
          <FilterSelect label="Location" options={["All", "Bangalore", "Hyderabad", "Pune", "Chennai"]} />
          <FilterSelect label="Job Function" options={["All", "Engineering", "DevOps", "Cloud"]} />
          <FilterSelect label="Date Saved" icon={<CalendarIcon />} options={["Any time", "Last 7 days", "Last 30 days"]} />
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
            <FunnelIcon /> Filter
          </button>
        </div>

        {/* Sort */}
        <div className="flex justify-end -mb-1">
          <div className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
            Sort by: <span className="font-semibold text-ink-700">Recently Saved</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>

        {/* Saved job list */}
        <div className="space-y-3">
          {pageJobs.map((job) => <SavedJobCard key={job.id} job={job} />)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-1">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* ── Right rail ── */}
      <aside className="w-full lg:w-[300px] shrink-0 space-y-4 hidden lg:block">
        <SavedJobsInsightsPanel />
        <ExpiringSoonPanel />
        <RecommendationsPanel />
      </aside>
    </div>
  );
}

/* ─── Stat tile ──────────────────────────────────────────────────────────────── */
const TINTS: Record<string, string> = {
  blue:   "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-brand-50 text-brand-600",
  green:  "bg-green-50 text-green-600",
};

function StatTile({ label, value, tint, icon }: { label: string; value: number; tint: string; icon: React.ReactNode }) {
  return (
    <div className="card px-4 py-3.5 flex items-center gap-3">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${TINTS[tint]}`}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[12px] text-ink-500 font-medium">{label}</div>
        <div className="font-display font-extrabold text-[22px] text-ink-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function FilterSelect({ label, options, icon }: { label: string; options: string[]; icon?: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center">
      {icon && <span className="absolute left-3 text-ink-400 pointer-events-none">{icon}</span>}
      <select className={`appearance-none ${icon ? "pl-9" : "pl-3"} pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer`} defaultValue="">
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

/* ─── Saved job card ─────────────────────────────────────────────────────────── */
function matchColor(pct: number) {
  if (pct >= 80) return "text-green-600";
  if (pct >= 50) return "text-orange-500";
  return "text-red-500";
}

function SavedJobCard({ job }: { job: SavedJob }) {
  return (
    <div className="card p-4 relative hover:border-brand-300 transition-colors">
      {/* Bookmark + kebab */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
        <button className="text-ink-300 hover:text-ink-600 transition-colors" aria-label="More options">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </button>
        <button className="text-brand-600 hover:text-brand-800 transition-colors" aria-label="Remove from saved">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:pr-8">
        {/* Identity */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl border border-ink-200 ${job.logoBg} flex items-center justify-center shrink-0 text-[15px] font-bold text-ink-500`}>
            {job.logoChar}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[14.5px] text-ink-900">{job.title}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] text-ink-600 font-medium">{job.company}</span>
              {job.verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" className="shrink-0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><PinIcon />{job.location}</span>
              <span className="flex items-center gap-1"><BriefcaseIcon />{job.type}</span>
              <span className="flex items-center gap-1"><ClockIcon sm />{job.experience}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {job.skills.map((s) => (
                <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Saved on */}
        <div className="md:w-[110px] shrink-0 text-[12px]">
          <div className="text-ink-400">Saved on</div>
          <div className="font-semibold text-ink-700">{job.savedOn}</div>
        </div>

        {/* Match score */}
        <div className="md:w-[110px] shrink-0 text-center">
          <div className="text-[11px] text-ink-400">Match Score</div>
          <div className={`font-display font-extrabold text-[20px] leading-none mt-0.5 ${matchColor(job.match)}`}>{job.match}%</div>
          <div className={`text-[11px] font-semibold mt-0.5 ${matchColor(job.match)}`}>{job.matchLabel}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-2 md:w-[130px] shrink-0">
          <button className="flex-1 text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
            View Job
          </button>
          <button className="flex-1 text-[12.5px] font-semibold text-white px-4 py-2 rounded-xl btn-gradient-brand hover:opacity-90 transition-opacity whitespace-nowrap">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Right-rail panels ──────────────────────────────────────────────────────── */
function SavedJobsInsightsPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-1.5"><SparkleIcon /> Saved Jobs Insights</h3>
        <button className="text-ink-300" aria-label="More"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg></button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="relative w-28 h-28 shrink-0">
          <div className="w-full h-full rounded-full" style={{
            background: `conic-gradient(${INSIGHT_SEGMENTS[0].color} 0% 75%, ${INSIGHT_SEGMENTS[1].color} 75% 92%, ${INSIGHT_SEGMENTS[2].color} 92% 100%)`,
          }} />
          <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
            <span className="font-display font-extrabold text-[17px] text-green-600 leading-none">75%</span>
            <span className="text-[9px] text-ink-500 font-medium">High Match Jobs</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {INSIGHT_SEGMENTS.map(({ label, count, pct, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[11.5px] text-ink-600">{label}</span>
              </div>
              <span className="text-[11.5px] font-semibold text-ink-700">{count} ({pct}%)</span>
            </div>
          ))}
        </div>
      </div>
      <a href="/improve-match" className="mt-4 w-full py-2.5 rounded-xl border border-brand-300 text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors block text-center">
        Improve your matches
      </a>
    </div>
  );
}

function ExpiringSoonPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Expiring Soon</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <p className="text-[11.5px] text-ink-400 mb-3">These jobs may close soon. Don&apos;t miss out!</p>
      <ul className="space-y-3">
        {EXPIRING.map((e) => (
          <li key={e.company} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center text-[12px] font-bold text-ink-500 shrink-0">{e.logoChar}</span>
            <div className="flex-1 leading-snug min-w-0">
              <div className="text-[12.5px] font-semibold text-ink-900 truncate">{e.title}</div>
              <div className="text-[11px] text-ink-500">{e.company}</div>
            </div>
            <span className="text-[11px] font-semibold text-orange-500 shrink-0">{e.left}</span>
          </li>
        ))}
      </ul>
      <a className="mt-3 inline-flex items-center gap-1 text-[12px] text-brand-600 font-semibold hover:text-brand-800 cursor-pointer">
        View all expiring jobs
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  );
}

function RecommendationsPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-1.5"><SparkleIcon /> AI Recommendations</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <p className="text-[11.5px] text-ink-400 mb-3">Based on your saved jobs and profile</p>
      <ul className="space-y-3">
        {RECOMMENDATIONS.map((r) => (
          <li key={r.company} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center text-[12px] font-bold text-ink-500 shrink-0">{r.logoChar}</span>
            <div className="flex-1 leading-snug min-w-0">
              <div className="text-[12.5px] font-semibold text-ink-900 truncate">{r.title}</div>
              <div className="text-[11px] text-ink-500">{r.company}</div>
            </div>
            <span className="text-[11.5px] font-bold text-green-600 shrink-0">{r.match}% Match</span>
          </li>
        ))}
      </ul>
      <a className="mt-3 inline-flex items-center gap-1 text-[12px] text-brand-600 font-semibold hover:text-brand-800 cursor-pointer">
        View more recommendations
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function HeartIcon({ big }: { big?: boolean }) { const s = big ? 22 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>); }
function EyeIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>); }
function ClockIcon({ sm }: { sm?: boolean }) { const s = sm ? 12 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>); }
function BellIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>); }
function BriefcaseIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>); }
function PinIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function CalendarIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function UploadIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>); }
function SparkleIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /></svg>); }
