"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listJobs, fetchJobCounts, type JobApiResponse, type JobCountsResponse } from "./services/job.service";

type StatusTab = "ALL" | "PUBLISHED" | "DRAFT" | "CLOSED";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "ALL", label: "All Jobs" },
  { key: "PUBLISHED", label: "Active" },
  { key: "DRAFT", label: "Draft" },
  { key: "CLOSED", label: "Closed" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

/* Demo-only per-job fields the backend does not expose yet
 * (applications, profile match, skills, salary). Cycled by index so cards
 * render fully populated until the API surfaces them. */
const DEMO_META = [
  { applications: 24, match: 85, salary: "₹ 18 – 28 LPA", experience: "5 – 8 yrs", skills: ["Java", "Spring Boot", "AWS", "Microservices", "+3"] },
  { applications: 18, match: 78, salary: "₹ 12 – 20 LPA", experience: "3 – 6 yrs", skills: ["Python", "Django", "SQL", "AWS", "+2"] },
  { applications: 12, match: 72, salary: "₹ 15 – 25 LPA", experience: "4 – 7 yrs", skills: ["AWS", "Docker", "Kubernetes", "Terraform", "+2"] },
  { applications: 10, match: 68, salary: "₹ 6 – 10 LPA", experience: "2 – 4 yrs", skills: ["Java", "SQL", "Hibernate", "REST API", "+2"] },
];

export default function JobsList() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [jobs, setJobs] = useState<JobApiResponse[]>([]);
  const [counts, setCounts] = useState<JobCountsResponse>({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobCounts().then(setCounts).catch(() => {}); // non-fatal
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const status = tab === "ALL" ? undefined : tab;
    listJobs(status)
      .then(({ content }) => { if (active) setJobs(content); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Failed to load jobs"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [tab]);

  const tabCount: Record<StatusTab, number> = {
    ALL: counts.total,
    PUBLISHED: counts.published,
    DRAFT: counts.drafts,
    CLOSED: Math.max(counts.total - counts.published - counts.drafts, 0),
  };

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Jobs</h1>
              <p className="text-ink-500 text-[13.5px] mt-1">Find the right talent by posting jobs or exploring candidates.</p>
            </div>
            <Link
              href="/company/jobs/new"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity"
            >
              <span className="text-[15px]">+</span> Post a New Job
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard iconBg="bg-brand-50 text-brand-600" icon={<BriefIcon />} value={String(counts.published)} label="Active Jobs" delta="6 from last week" />
            <StatCard iconBg="bg-green-50 text-green-600" icon={<UsersIcon />} value={String(counts.drafts)} label="Draft Jobs" delta="3 from last week" />
            <StatCard iconBg="bg-blue-50 text-blue-600" icon={<DocIcon />} value="96" label="Applications" delta="15 from last week" />
            <StatCard iconBg="bg-orange-50 text-orange-600" icon={<CalendarIcon />} value="12" label="Interviews" delta="4 from last week" />
          </div>

          {/* Filter bar */}
          <div className="card p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input type="text" placeholder="Search job title, skills or company" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
            </div>
            <FilterSelect label="All Locations" options={["All Locations", "Bangalore", "Hyderabad", "Pune", "Chennai"]} />
            <FilterSelect label="Job Function" options={["All", "Engineering", "DevOps", "Design"]} />
            <FilterSelect label="Experience Level" options={["All", "Entry", "Mid", "Senior"]} />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
              <FunnelIcon /> More Filters
            </button>
          </div>

          {/* Tabs + sort */}
          <div className="flex items-center justify-between gap-4 border-b border-ink-100">
            <div className="flex gap-1 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                    tab === t.key ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {t.label} ({tabCount[t.key]})
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-ink-500 shrink-0">
              Sort by: <span className="font-semibold text-ink-700">Most Recent</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16 text-center text-ink-400 text-[13px]">Loading jobs…</div>
          ) : error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="card p-10 flex flex-col items-center text-center">
              <h2 className="font-display text-[16px] font-extrabold text-ink-900">No jobs here yet</h2>
              <p className="text-ink-500 text-[12.5px] mt-1 mb-4">
                {tab === "DRAFT" ? "You have no draft jobs." : "Post your first job to start attracting candidates."}
              </p>
              <Link href="/company/jobs/new" className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                <span>+</span> Post a Job
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {jobs.map((job, i) => <JobRow key={job.id} job={job} demo={DEMO_META[i % DEMO_META.length]} />)}
              </div>
              <div className="text-center pt-1">
                <button className="text-[13.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1.5">
                  Load More Jobs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full xl:w-[300px] shrink-0 space-y-4 hidden xl:block">
          <JobInsightsPanel counts={counts} />
          <RecommendedCandidatesPanel />
          <TopSkillsPanel />
          <BoostReachPanel />
        </aside>
      </div>
    </div>
  );
}

/* ─── Job row card ───────────────────────────────────────────────────────────── */
function JobRow({ job, demo }: { job: JobApiResponse; demo: (typeof DEMO_META)[number] }) {
  return (
    <div className="card p-4 relative hover:border-brand-300 transition-colors">
      <button className="absolute top-3.5 right-3.5 text-ink-300 hover:text-ink-600 transition-colors" aria-label="More options">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:pr-6">
        {/* Identity */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon big /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[14.5px] text-ink-900">{job.title}</span>
              <StatusBadge status={job.status} />
            </div>
            {job.department && <div className="text-[13px] text-ink-600 font-medium mt-0.5">{job.department}</div>}
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><PinIcon />{job.workplaceLocation || "—"}{job.workMode ? ` · ${job.workMode}` : ""}</span>
              <span className="flex items-center gap-1"><BriefIcon />{job.employmentType || "—"}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><ClockIcon />{demo.experience}</span>
              <span className="flex items-center gap-1"><RupeeIcon />{demo.salary}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {demo.skills.map((s) => (
                <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Posted + applications */}
        <div className="flex lg:flex-col gap-x-6 gap-y-2 lg:w-[120px] shrink-0 text-[12px]">
          <div><span className="text-ink-400">Posted on</span><div className="font-semibold text-ink-700">{formatDate(job.publishedAt ?? job.createdAt)}</div></div>
          <div><span className="text-ink-400">Applications</span><div className="font-display font-extrabold text-[18px] text-ink-900 leading-none mt-0.5">{demo.applications}</div></div>
        </div>

        {/* Profile match ring */}
        <div className="shrink-0 flex lg:flex-col items-center gap-1">
          <MatchRing pct={demo.match} />
          <span className="text-[11px] font-semibold text-green-600">Profile Match</span>
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 lg:w-[150px] shrink-0">
          <Link href={`/company/jobs/${job.id}/applications`} className="flex-1 text-center text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
            View Applications
          </Link>
          <Link href={`/company/jobs/${job.id}/edit`} className="flex-1 text-center text-[12.5px] font-semibold text-ink-700 border border-ink-200 px-4 py-2 rounded-xl hover:bg-ink-100 transition-colors whitespace-nowrap">
            Edit Job
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: JobApiResponse["status"] }) {
  const styles: Record<JobApiResponse["status"], { label: string; cls: string }> = {
    PUBLISHED: { label: "Active", cls: "bg-green-50 text-green-700 border-green-200" },
    DRAFT: { label: "Draft", cls: "bg-ink-100 text-ink-600 border-ink-200" },
    CLOSED: { label: "Closed", cls: "bg-red-50 text-red-600 border-red-200" },
    EXPIRED: { label: "Expired", cls: "bg-orange-50 text-orange-600 border-orange-200" },
  };
  const s = styles[status];
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>;
}

function MatchRing({ pct }: { pct: number }) {
  const r = 22, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
  return (
    <div className="relative w-[60px] h-[60px]">
      <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle cx="30" cy="30" r={r} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[13px] text-ink-900">{pct}%</span>
    </div>
  );
}

/* ─── Stat card (candidate-dashboard style) ──────────────────────────────────── */
function StatCard({ iconBg, icon, value, label, delta }: { iconBg: string; icon: React.ReactNode; value: string; label: string; delta?: string }) {
  return (
    <div className="card px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</span>
        <div className="leading-tight">
          <div className="font-display font-extrabold text-[22px] text-ink-900">{value}</div>
          <div className="text-[12px] text-ink-600 font-medium">{label}</div>
        </div>
      </div>
      {delta && (
        <div className="mt-1.5 text-[11px] text-green-600 font-semibold flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          {delta}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select className="appearance-none pl-3 pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer" defaultValue="">
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

/* ─── Right-rail panels ──────────────────────────────────────────────────────── */
function JobInsightsPanel({ counts }: { counts: JobCountsResponse }) {
  const closed = Math.max(counts.total - counts.published - counts.drafts, 0);
  const total = counts.total || 1;
  const segs = [
    { label: "Active", count: counts.published, color: "#22c55e" },
    { label: "Draft",  count: counts.drafts,    color: "#3b82f6" },
    { label: "Closed", count: closed,           color: "#9ca3af" },
    { label: "Paused", count: 0,                color: "#f97316" },
  ];
  // build conic-gradient stops
  let acc = 0;
  const stops = segs.map((s) => {
    const start = (acc / total) * 100;
    acc += s.count;
    const end = (acc / total) * 100;
    return `${s.color} ${start}% ${end}%`;
  }).join(", ");

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Job Insights</h3>
        <button className="text-ink-300" aria-label="More"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg></button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="relative w-28 h-28 shrink-0">
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
          <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
            <span className="text-[9px] text-ink-500 font-medium">Total Jobs</span>
            <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">{counts.total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {segs.map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[11.5px] text-ink-600">{label}</span>
              </div>
              <span className="text-[11.5px] font-semibold text-ink-700">{count} ({Math.round((count / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RECOMMENDED = [
  { name: "Arjun Mehta", role: "Senior Software Engineer", match: 92 },
  { name: "Neha Kulkarni", role: "Backend Developer", match: 88 },
  { name: "Rohan Das", role: "Cloud Engineer", match: 85 },
];

function RecommendedCandidatesPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Recommended Candidates</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <ul className="space-y-3">
        {RECOMMENDED.map((c) => (
          <li key={c.name} className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[12px] font-bold shrink-0">{c.name.split(" ").map((w) => w[0]).join("")}</span>
            <div className="flex-1 leading-snug min-w-0">
              <div className="text-[12.5px] font-semibold text-ink-900 truncate">{c.name}</div>
              <div className="text-[11px] text-ink-500 truncate">{c.role}</div>
            </div>
            <span className="text-[11.5px] font-bold text-green-600 shrink-0">{c.match}% Match</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TOP_SKILLS = [
  { name: "React.js", jobs: 32 },
  { name: "AWS", jobs: 28 },
  { name: "Python", jobs: 26 },
  { name: "Node.js", jobs: 21 },
  { name: "SQL", jobs: 18 },
];

function TopSkillsPanel() {
  const max = Math.max(...TOP_SKILLS.map((s) => s.jobs));
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Top Skills in Demand</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <ul className="space-y-2.5">
        {TOP_SKILLS.map((s) => (
          <li key={s.name} className="flex items-center gap-3">
            <span className="text-[12px] text-ink-700 font-medium w-16 shrink-0">{s.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full btn-gradient-brand" style={{ width: `${(s.jobs / max) * 100}%` }} />
            </div>
            <span className="text-[11px] text-ink-500 w-12 text-right shrink-0">{s.jobs} jobs</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BoostReachPanel() {
  return (
    <div className="card p-5 bg-brand-50/50 border-brand-100 relative">
      <button className="absolute top-3 right-3 text-ink-400 hover:text-ink-600" aria-label="Dismiss">✕</button>
      <h3 className="font-display font-bold text-[15px] text-brand-700 inline-flex items-center gap-1.5"><RocketIcon /> Boost Your Job Reach</h3>
      <p className="text-[12px] text-ink-600 mt-1.5 leading-snug">Your jobs will be featured to more relevant candidates.</p>
      <button className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-300 bg-white text-[12.5px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
        Upgrade Plan
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </button>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function BriefIcon({ big }: { big?: boolean }) { const s = big ? 22 : 12; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>); }
function UsersIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>); }
function DocIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>); }
function CalendarIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function PinIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>); }
function ClockIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>); }
function RupeeIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12M6 8h12M9 4c4 0 6 3 6 6s-2 6-6 6h-3l6 6" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function RocketIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /></svg>); }
