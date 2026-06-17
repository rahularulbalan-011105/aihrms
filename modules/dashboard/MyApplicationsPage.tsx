"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * Types — shaped to match a future backend response so wiring is a drop-in swap.
 * ───────────────────────────────────────────────────────────────────────────── */
type ApplicationStatus =
  | "Application Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  verified: boolean;
  logoBg: string;          // tailwind bg class for the logo tile
  logoChar: string;        // placeholder glyph (company initial)
  location: string;
  type: string;
  experience: string;
  appliedOn: string;       // display string (ISO when backed)
  lastActivity: string;
  recruiterViewed: boolean;
  status: ApplicationStatus;
  matchScore: number;
  bucket: "active" | "closed" | "withdrawn";
}

/* ─── Mock data (replace with GET /applications) ─────────────────────────────── */
const STATS = [
  { key: "applied",  label: "Applied",      value: 12, tint: "blue",   icon: <BriefcaseIcon /> },
  { key: "review",   label: "Under Review", value: 5,  tint: "orange", icon: <ClockIcon /> },
  { key: "interview",label: "Interview",    value: 3,  tint: "purple", icon: <UsersIcon /> },
  { key: "offer",    label: "Offer",        value: 1,  tint: "green",  icon: <EnvelopeIcon /> },
] as const;

const APPLICATIONS: Application[] = [
  {
    id: "1", jobTitle: "Senior Software Engineer", company: "Microsoft", verified: true,
    logoBg: "bg-[#f3f6fb]", logoChar: "M", location: "Bangalore, India", type: "Full Time", experience: "3 – 5 yrs",
    appliedOn: "10 Jun 2026", lastActivity: "Yesterday", recruiterViewed: true,
    status: "Interview Scheduled", matchScore: 92, bucket: "active",
  },
  {
    id: "2", jobTitle: "Backend Developer", company: "Google", verified: true,
    logoBg: "bg-[#f3f6fb]", logoChar: "G", location: "Hyderabad, India", type: "Full Time", experience: "2 – 4 yrs",
    appliedOn: "08 Jun 2026", lastActivity: "3 days ago", recruiterViewed: true,
    status: "Under Review", matchScore: 78, bucket: "active",
  },
  {
    id: "3", jobTitle: "Cloud Engineer", company: "Amazon", verified: true,
    logoBg: "bg-[#fff7ed]", logoChar: "a", location: "Pune, India", type: "Full Time", experience: "3 – 6 yrs",
    appliedOn: "01 Jun 2026", lastActivity: "5 days ago", recruiterViewed: false,
    status: "Application Submitted", matchScore: 85, bucket: "active",
  },
  {
    id: "4", jobTitle: "Software Engineer", company: "Infosys", verified: true,
    logoBg: "bg-[#eef2ff]", logoChar: "I", location: "Chennai, India", type: "Full Time", experience: "2 – 4 yrs",
    appliedOn: "28 May 2026", lastActivity: "1 week ago", recruiterViewed: false,
    status: "Shortlisted", matchScore: 88, bucket: "active",
  },
];

const TABS = [
  { key: "all",       label: "All Applications", count: 21 },
  { key: "active",    label: "Active",           count: 20 },
  { key: "closed",    label: "Closed",           count: 1  },
  { key: "withdrawn", label: "Withdrawn",        count: 0  },
] as const;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("all");

  const visible = APPLICATIONS.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return a.bucket === "active";
    if (activeTab === "closed") return a.bucket === "closed";
    return a.bucket === "withdrawn";
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* ── Centre column ── */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-ink-900">My Applications</h1>
            <p className="text-[13.5px] text-ink-500 mt-0.5">Track and manage all your job applications in one place.</p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
            <UploadIcon /> <span className="hidden sm:inline">Export Applications</span>
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
          <FilterSelect label="Status" options={["All", "Under Review", "Interview Scheduled", "Shortlisted", "Offer"]} />
          <FilterSelect label="Applied Date" icon={<CalendarIcon />} options={["Any time", "Last 7 days", "Last 30 days"]} />
          <FilterSelect label="Company" options={["All", "Microsoft", "Google", "Amazon", "Infosys"]} />
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
            <FunnelIcon /> Filter
          </button>
        </div>

        {/* Tabs + sort */}
        <div className="flex items-center justify-between gap-4 border-b border-ink-100">
          <div className="flex gap-1 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab.key
                    ? "border-brand-600 text-brand-700"
                    : "border-transparent text-ink-500 hover:text-ink-800"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-ink-500 shrink-0">
            Sort by: <span className="font-semibold text-ink-700">Newest</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>

        {/* Application list */}
        <div className="space-y-3">
          {visible.length === 0 ? (
            <p className="text-center text-ink-400 text-[13px] py-12">No applications in this category yet.</p>
          ) : (
            visible.map((app) => <ApplicationCard key={app.id} application={app} />)
          )}
        </div>

        {/* Load more */}
        <div className="text-center pt-1">
          <button className="text-[13.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1.5">
            Load More Applications
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </button>
        </div>

        {/* Secure note */}
        <div className="flex items-center justify-center gap-1.5 text-[12px] text-ink-400 pt-1">
          <LockIcon /> Your data is secure and will not be shared with anyone.
        </div>
      </div>

      {/* ── Right rail ── */}
      <aside className="w-full xl:w-[300px] shrink-0 space-y-4 hidden xl:block">
        <ApplicationInsightsPanel />
        <RecruiterActivityPanel />
        <UpcomingInterviewsPanel />
        <AISuggestionsPanel />
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

/* ─── Application card ───────────────────────────────────────────────────────── */
const STATUS_STYLE: Record<ApplicationStatus, string> = {
  "Application Submitted": "bg-brand-50 text-brand-700 border-brand-200",
  "Under Review":          "bg-orange-50 text-orange-600 border-orange-200",
  "Shortlisted":           "bg-green-50 text-green-700 border-green-200",
  "Interview Scheduled":   "bg-brand-50 text-brand-700 border-brand-200",
  "Offer":                 "bg-green-50 text-green-700 border-green-200",
  "Rejected":              "bg-red-50 text-red-600 border-red-200",
  "Withdrawn":             "bg-ink-100 text-ink-500 border-ink-200",
};

function matchColor(pct: number) {
  if (pct >= 80) return "text-green-600";
  if (pct >= 50) return "text-orange-500";
  return "text-red-500";
}

function ApplicationCard({ application: a }: { application: Application }) {
  return (
    <div className="card p-4 relative hover:border-brand-300 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:pr-6">
        {/* Left: identity */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-xl border border-ink-200 ${a.logoBg} flex items-center justify-center shrink-0 text-[14px] font-bold text-ink-500`}>
            {a.logoChar}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[14.5px] text-ink-900">{a.jobTitle}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] text-ink-600 font-medium">{a.company}</span>
              {a.verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" className="shrink-0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><PinIcon />{a.location}</span>
              <span className="flex items-center gap-1"><BriefcaseIcon sm />{a.type}</span>
              <span className="flex items-center gap-1"><ClockIcon sm />{a.experience}</span>
            </div>
          </div>
        </div>

        {/* Middle: timeline */}
        <div className="flex md:flex-col gap-x-6 gap-y-1.5 text-[12px] md:w-[150px] shrink-0 border-l border-ink-100 md:pl-4 pl-0">
          <div><span className="text-ink-400">Applied on</span><div className="font-semibold text-ink-700">{a.appliedOn}</div></div>
          <div><span className="text-ink-400">Last Activity</span><div className="font-semibold text-ink-700">{a.lastActivity}</div></div>
          <div>
            <span className="text-ink-400">Recruiter Viewed</span>
            <div className={`font-semibold flex items-center gap-1 ${a.recruiterViewed ? "text-green-600" : "text-ink-500"}`}>
              <EyeIcon /> {a.recruiterViewed ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* Right: status + action */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-[170px] shrink-0">
          <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[a.status]}`}>{a.status}</span>
          <div className="text-center md:text-right">
            <div className="text-[11px] text-ink-400">Match Score</div>
            <div className={`font-display font-extrabold text-[18px] leading-none ${matchColor(a.matchScore)}`}>{a.matchScore}%</div>
          </div>
          <button className="text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-1.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
            View Details
          </button>
        </div>

        {/* Kebab */}
        <button className="absolute top-3 right-3 text-ink-300 hover:text-ink-600 transition-colors hidden md:block" aria-label="More options">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Right-rail panels ──────────────────────────────────────────────────────── */
const INSIGHT_SEGMENTS = [
  { label: "Positive",    pct: 75, color: "#22c55e" },
  { label: "In Review",   pct: 15, color: "#3b82f6" },
  { label: "No Response", pct: 10, color: "#f97316" },
];

function ApplicationInsightsPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-1.5"><SparkleIcon /> Application Insights</h3>
        <button className="text-ink-300" aria-label="More"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg></button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="relative w-28 h-28 shrink-0">
          <div className="w-full h-full rounded-full" style={{
            background: `conic-gradient(${INSIGHT_SEGMENTS[0].color} 0% 75%, ${INSIGHT_SEGMENTS[1].color} 75% 90%, ${INSIGHT_SEGMENTS[2].color} 90% 100%)`,
          }} />
          <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
            <span className="font-display font-extrabold text-[17px] text-green-600 leading-none">75%</span>
            <span className="text-[9px] text-ink-500 font-medium">Response Rate</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {INSIGHT_SEGMENTS.map(({ label, pct, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[11.5px] text-ink-600">{label}</span>
              </div>
              <span className="text-[11.5px] font-semibold text-ink-700">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RECRUITER_ACTIVITY = [
  { company: "Microsoft", logoChar: "M", text: "viewed your profile", time: "2 hours ago" },
  { company: "Google",    logoChar: "G", text: "downloaded your resume", time: "Yesterday" },
  { company: "Infosys",   logoChar: "I", text: "shortlisted your application", time: "2 days ago" },
];

function RecruiterActivityPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Recruiter Activity</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <ul className="space-y-3">
        {RECRUITER_ACTIVITY.map((r) => (
          <li key={r.company + r.text} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center text-[12px] font-bold text-ink-500 shrink-0">{r.logoChar}</span>
            <div className="leading-snug">
              <div className="text-[12.5px] text-ink-700"><b className="text-ink-900">{r.company}</b> {r.text}</div>
              <div className="text-[11px] text-ink-400">{r.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const UPCOMING_INTERVIEWS = [
  { company: "Microsoft", logoChar: "M", role: "Senior Software Engineer", when: "Tomorrow, 10:00 AM", mode: "Online" },
  { company: "Infosys",   logoChar: "I", role: "Software Engineer",        when: "15 Jun 2026, 02:00 PM", mode: "Onsite" },
];

function UpcomingInterviewsPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Upcoming Interviews</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <ul className="space-y-3">
        {UPCOMING_INTERVIEWS.map((iv) => (
          <li key={iv.company} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center text-[12px] font-bold text-ink-500 shrink-0">{iv.logoChar}</span>
            <div className="flex-1 leading-snug">
              <div className="text-[12.5px] font-bold text-ink-900">{iv.company}</div>
              <div className="text-[11.5px] text-ink-500">{iv.role}</div>
              <div className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-1"><CalendarIcon />{iv.when}</div>
            </div>
            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${iv.mode === "Online" ? "bg-brand-50 text-brand-700" : "bg-orange-50 text-orange-600"}`}>{iv.mode}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AISuggestionsPanel() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-1.5 mb-2"><SparkleIcon /> AI Suggestions</h3>
      <div className="flex items-start gap-2.5">
        <span className="text-brand-500 mt-0.5"><SparkleIcon /></span>
        <p className="text-[12.5px] text-ink-600 leading-snug">Add more skills related to Cloud and Kubernetes to increase your match score.</p>
      </div>
      <a href="/profile/edit" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-600 font-semibold hover:text-brand-800">
        Improve Profile
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function BriefcaseIcon({ sm }: { sm?: boolean }) { const s = sm ? 12 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>); }
function ClockIcon({ sm }: { sm?: boolean }) { const s = sm ? 12 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>); }
function UsersIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>); }
function EnvelopeIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>); }
function PinIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>); }
function EyeIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function CalendarIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function UploadIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>); }
function LockIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>); }
function SparkleIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /></svg>); }
