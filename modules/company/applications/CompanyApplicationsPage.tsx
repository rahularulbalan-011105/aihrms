"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { StatCard } from "@/modules/company/jobs/components/StatCard";

/* ─────────────────────────────────────────────────────────────────────────────
 * Applications (agency-wide) — all applications across jobs.
 * Mock data; types shaped for a future GET /company/applications.
 * ───────────────────────────────────────────────────────────────────────────── */
type Stage = "New" | "In Review" | "Shortlisted" | "In Progress" | "Hired" | "Rejected";

interface Application {
  id: string;
  name: string;
  email: string;
  avatarBg: string;
  jobTitle: string;
  jobId: string;
  stage: Stage;
  match: number;
  experience: string;
  appliedDate: string;
  appliedTime: string;
}

const STATS = [
  { key: "total",   label: "Total Applications", value: 248, iconBg: "bg-brand-50 text-brand-600",  icon: <DocIcon /> },
  { key: "new",     label: "New",                value: 142, iconBg: "bg-green-50 text-green-600",  icon: <UsersIcon /> },
  { key: "progress",label: "In Progress",        value: 64,  iconBg: "bg-blue-50 text-blue-600",    icon: <ClipboardIcon /> },
  { key: "short",   label: "Shortlisted",        value: 28,  iconBg: "bg-orange-50 text-orange-600",icon: <UsersIcon /> },
  { key: "hired",   label: "Hired",              value: 14,  iconBg: "bg-brand-50 text-brand-600",  icon: <UserCheckIcon /> },
];

const APPLICATIONS: Application[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul.sharma@email.com", avatarBg: "bg-brand-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "New", match: 96, experience: "6.2 yrs", appliedDate: "20 Apr 2024", appliedTime: "10:30 AM" },
  { id: "2", name: "Ananya Patel", email: "ananya.patel@email.com", avatarBg: "bg-blue-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "In Review", match: 94, experience: "5.8 yrs", appliedDate: "19 Apr 2024", appliedTime: "04:15 PM" },
  { id: "3", name: "Sahil Khan", email: "sahil.khan@email.com", avatarBg: "bg-green-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "Shortlisted", match: 91, experience: "5.1 yrs", appliedDate: "21 Apr 2024", appliedTime: "11:20 AM" },
  { id: "4", name: "Neha Prasad", email: "neha.prasad@email.com", avatarBg: "bg-orange-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "In Progress", match: 89, experience: "4.7 yrs", appliedDate: "18 Apr 2024", appliedTime: "09:45 AM" },
  { id: "5", name: "Vikram Mehta", email: "vikram.mehta@email.com", avatarBg: "bg-brand-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "Shortlisted", match: 89, experience: "4.3 yrs", appliedDate: "20 Apr 2024", appliedTime: "02:30 PM" },
  { id: "6", name: "Pooja Kapoor", email: "pooja.kapoor@email.com", avatarBg: "bg-blue-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "In Review", match: 87, experience: "3.9 yrs", appliedDate: "22 Apr 2024", appliedTime: "11:10 AM" },
  { id: "7", name: "Amit Desai", email: "amit.desai@email.com", avatarBg: "bg-green-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "New", match: 86, experience: "4.0 yrs", appliedDate: "19 Apr 2024", appliedTime: "03:50 PM" },
  { id: "8", name: "Jaya Menon", email: "jaya.menon@email.com", avatarBg: "bg-orange-100", jobTitle: "Senior Software Engineer", jobId: "JOB-234536", stage: "Shortlisted", match: 85, experience: "3.6 yrs", appliedDate: "21 Apr 2024", appliedTime: "10:05 AM" },
];

const FILTERS = [
  { label: "Job", options: ["All Jobs", "Senior Software Engineer", "Backend Developer"] },
  { label: "Department", options: ["All Departments", "Engineering", "Design"] },
  { label: "Stage", options: ["All Stages", "New", "In Review", "Shortlisted", "In Progress", "Hired"] },
  { label: "Experience", options: ["All Experience", "0 – 3 yrs", "3 – 6 yrs", "6+ yrs"] },
];

export default function CompanyApplicationsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const allChecked = selected.size === APPLICATIONS.length;
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(APPLICATIONS.map((a) => a.id)));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Applications</h1>
          <p className="text-ink-500 text-[13.5px] mt-1">View and manage all job applications in one place.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors"><DownloadIcon /> <span className="hidden sm:inline">Export</span></button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors"><FunnelIcon /> <span className="hidden sm:inline">Filters</span></button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity"><span className="text-[15px]">+</span> <span className="hidden sm:inline">Add Application</span></button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.key} iconBg={s.iconBg} icon={s.icon} value={String(s.value)} label={s.label} />
        ))}
      </div>

      {/* Search + filters */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-ink-100/60 rounded-xl">
          <SearchIcon />
          <input type="text" placeholder="Search by candidate name, email, job title or skills…" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {FILTERS.map((f) => (
            <LabeledSelect key={f.label} label={f.label} options={f.options} />
          ))}
          <LabeledSelect label="Date Applied" options={["Any time", "Last 7 days", "Last 30 days"]} placeholder="Select Date Range" icon={<CalendarIcon />} />
          <button className="px-4 py-2 rounded-xl border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition-colors">Clear Filters</button>
        </div>
      </div>

      {/* List heading */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display font-bold text-[16px] text-ink-900">All Applications <span className="text-brand-600">({APPLICATIONS.length === 8 ? 248 : APPLICATIONS.length})</span></h2>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[12.5px] text-ink-500">
            Sort by
            <div className="relative inline-flex items-center">
              <select className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-ink-200 rounded-lg text-[12.5px] text-ink-700 font-medium outline-none cursor-pointer">
                <option>Date Applied (Newest)</option>
                <option>Date Applied (Oldest)</option>
                <option>Match Score</option>
              </select>
              <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
            </div>
          </div>
          <button className="w-9 h-9 rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-100 flex items-center justify-center" aria-label="List view"><ListIcon /></button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-[11.5px] font-semibold text-ink-500 border-b border-ink-100">
                <th className="pl-4 pr-2 py-3 w-9"><input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-brand-600 w-4 h-4" aria-label="Select all" /></th>
                <th className="px-2 py-3">Candidate</th>
                <th className="px-2 py-3">Job</th>
                <th className="px-2 py-3">Stage</th>
                <th className="px-2 py-3">Match Score</th>
                <th className="px-2 py-3">Experience</th>
                <th className="px-2 py-3">Date Applied</th>
                <th className="px-2 py-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {APPLICATIONS.map((a) => <Row key={a.id} a={a} selected={selected.has(a.id)} onToggle={() => toggle(a.id)} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12.5px] text-ink-500">Showing 1 to {APPLICATIONS.length} of 248 results</span>
        <Pagination page={page} totalPages={31} onChange={setPage} />
        <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
          Rows per page
          <div className="relative inline-flex items-center">
            <select className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-ink-200 rounded-lg text-[12.5px] text-ink-700 outline-none cursor-pointer" defaultValue="10">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="absolute right-2.5 text-ink-400 pointer-events-none text-[10px]">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Row ────────────────────────────────────────────────────────────────────── */
const STAGE_STYLE: Record<Stage, string> = {
  New:          "bg-blue-50 text-blue-600 border-blue-200",
  "In Review":  "bg-brand-50 text-brand-700 border-brand-200",
  Shortlisted:  "bg-green-50 text-green-700 border-green-200",
  "In Progress":"bg-orange-50 text-orange-600 border-orange-200",
  Hired:        "bg-green-50 text-green-700 border-green-200",
  Rejected:     "bg-red-50 text-red-600 border-red-200",
};

function matchColor(pct: number) {
  if (pct >= 80) return "#22c55e";
  if (pct >= 60) return "#f97316";
  return "#ef4444";
}

function Row({ a, selected, onToggle }: { a: Application; selected: boolean; onToggle: () => void }) {
  return (
    <tr className="text-[13px] hover:bg-ink-100/30 transition-colors">
      <td className="pl-4 pr-2 py-3 align-middle"><input type="checkbox" checked={selected} onChange={onToggle} className="accent-brand-600 w-4 h-4" aria-label={`Select ${a.name}`} /></td>
      <td className="px-2 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-9 h-9 rounded-full ${a.avatarBg} text-ink-600 flex items-center justify-center text-[12px] font-bold shrink-0`}>{a.name.split(" ").map((w) => w[0]).join("")}</span>
          <div className="leading-tight min-w-0">
            <div className="font-semibold text-ink-900">{a.name}</div>
            <div className="text-[11.5px] text-ink-500 truncate">{a.email}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 leading-tight">
        <div className="font-medium text-ink-800">{a.jobTitle}</div>
        <div className="text-[11.5px] text-ink-400">{a.jobId}</div>
      </td>
      <td className="px-2 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STAGE_STYLE[a.stage]}`}>{a.stage}</span></td>
      <td className="px-2 py-3">
        <div className="font-semibold text-ink-900">{a.match}%</div>
        <div className="h-1 w-20 rounded-full bg-ink-100 overflow-hidden mt-1">
          <div className="h-full rounded-full" style={{ width: `${a.match}%`, background: matchColor(a.match) }} />
        </div>
      </td>
      <td className="px-2 py-3 text-ink-700">{a.experience}</td>
      <td className="px-2 py-3 text-ink-700 leading-tight">
        <div>{a.appliedDate}</div>
        <div className="text-[11.5px] text-ink-400">{a.appliedTime}</div>
      </td>
      <td className="px-2 py-3 pr-4">
        <div className="flex items-center gap-1.5 justify-end">
          <IconBtn label="View"><EyeIcon /></IconBtn>
          <IconBtn label="Message"><ChatIcon /></IconBtn>
          <button className="w-8 h-8 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 flex items-center justify-center" aria-label="More options"><KebabIcon /></button>
        </div>
      </td>
    </tr>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return <button className="w-8 h-8 rounded-lg border border-ink-200 text-ink-500 hover:text-brand-600 hover:border-brand-300 flex items-center justify-center transition-colors" aria-label={label}>{children}</button>;
}
function LabeledSelect({ label, options, placeholder, icon }: { label: string; options: string[]; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
      <label className="text-[12px] font-semibold text-ink-700">{label}</label>
      <div className="relative inline-flex items-center">
        {icon && <span className="absolute left-3 text-ink-400 pointer-events-none">{icon}</span>}
        <select className={`appearance-none w-full ${icon ? "pl-9" : "pl-3"} pr-8 py-2 bg-white border border-ink-200 rounded-xl text-[13px] text-ink-600 outline-none cursor-pointer`} defaultValue="">
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
      </div>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function DocIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>); }
function UsersIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>); }
function ClipboardIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>); }
function UserCheckIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function CalendarIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function DownloadIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>); }
function ListIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>); }
function EyeIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>); }
function ChatIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>); }
function KebabIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>); }
