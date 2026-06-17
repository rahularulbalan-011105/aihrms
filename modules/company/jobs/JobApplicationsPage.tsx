"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────────
 * View Applications — candidates who applied to a single job.
 * Mock data; types shaped for a future GET /company/jobs/{id}/applications.
 * ───────────────────────────────────────────────────────────────────────────── */
type AppStatus = "Applied" | "Shortlisted" | "Interview" | "Offered" | "Rejected";

interface Candidate {
  id: string;
  name: string;
  verified: boolean;
  email: string;
  phone: string;
  avatarBg: string;
  experience: string;
  company: string;
  companyRole: string;
  companyChar: string;
  appliedDate: string;
  appliedTime: string;
  match: number;
  status: AppStatus;
  fake?: boolean;
}

const JOB = {
  title: "Senior Software Engineer",
  company: "Microsoft",
  status: "Active",
  location: "Bangalore, India",
  type: "Full Time",
  experience: "5 – 8 yrs",
  salary: "₹ 18 – 28 LPA",
  skills: ["Java", "Spring Boot", "AWS", "Microservices", "+3"],
  postedOn: "10 Jun 2026",
  applications: 24,
};

const CANDIDATES: Candidate[] = [
  { id: "1", name: "Arjun Mehta", verified: true, email: "arjun.mehta@email.com", phone: "+91 98765 43210", avatarBg: "bg-brand-100", experience: "6.2 yrs", company: "Microsoft", companyRole: "Software Engineer", companyChar: "M", appliedDate: "10 Jun 2026", appliedTime: "2:30 PM", match: 92, status: "Interview" },
  { id: "2", name: "Neha Kulkarni", verified: true, email: "neha.kulkarni@email.com", phone: "+91 91234 56789", avatarBg: "bg-green-100", experience: "5.4 yrs", company: "Google", companyRole: "Software Engineer", companyChar: "G", appliedDate: "10 Jun 2026", appliedTime: "11:15 AM", match: 88, status: "Shortlisted" },
  { id: "3", name: "Rohan Das", verified: true, email: "rohan.das@email.com", phone: "+91 99876 54321", avatarBg: "bg-orange-100", experience: "7.1 yrs", company: "Amazon", companyRole: "Senior Developer", companyChar: "a", appliedDate: "09 Jun 2026", appliedTime: "6:45 PM", match: 85, status: "Shortlisted" },
  { id: "4", name: "Vikram Singh", verified: true, email: "vikram.singh@email.com", phone: "+91 88990 11223", avatarBg: "bg-blue-100", experience: "4.8 yrs", company: "Infosys", companyRole: "Software Engineer", companyChar: "I", appliedDate: "09 Jun 2026", appliedTime: "3:20 PM", match: 78, status: "Applied" },
  { id: "5", name: "Ananya Iyer", verified: true, email: "ananya.iyer@email.com", phone: "+91 77665 44322", avatarBg: "bg-brand-100", experience: "6.5 yrs", company: "TCS", companyRole: "Developer", companyChar: "T", appliedDate: "09 Jun 2026", appliedTime: "10:05 AM", match: 76, status: "Applied" },
  { id: "6", name: "Siddharth Rao", verified: true, email: "siddharth.rao@email.com", phone: "+91 66554 33221", avatarBg: "bg-green-100", experience: "5.9 yrs", company: "Zoho", companyRole: "Software Developer", companyChar: "Z", appliedDate: "08 Jun 2026", appliedTime: "9:40 PM", match: 70, status: "Applied" },
  { id: "7", name: "Karan Verma", verified: false, email: "karan.verma@email.com", phone: "+91 70000 00000", avatarBg: "bg-ink-100", experience: "4.0 yrs", company: "Not Specified", companyRole: "", companyChar: "?", appliedDate: "08 Jun 2026", appliedTime: "5:10 PM", match: 34, status: "Applied", fake: true },
  { id: "8", name: "Pooja Sharma", verified: false, email: "pooja.sharma@email.com", phone: "+91 81111 11111", avatarBg: "bg-ink-100", experience: "3.2 yrs", company: "Not Specified", companyRole: "", companyChar: "?", appliedDate: "07 Jun 2026", appliedTime: "4:35 PM", match: 28, status: "Applied", fake: true },
];

const TABS = [
  { key: "All", count: 24 },
  { key: "Applied", count: 12 },
  { key: "Shortlisted", count: 6 },
  { key: "Interview", count: 4 },
  { key: "Offered", count: 1 },
  { key: "Rejected", count: 1 },
] as const;

export default function JobApplicationsPage({ jobId }: { jobId: string }) {
  const [tab, setTab] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visible = CANDIDATES.filter((c) => tab === "All" || c.status === tab);
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-500 mb-3">
        <Link href="/company/jobs" className="hover:text-ink-800">Jobs</Link>
        <Chevron />
        <span className="text-ink-700">{JOB.title}</span>
        <Chevron />
        <span className="text-brand-700 font-semibold">View Applications</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Job header */}
          <div className="card p-5">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon big /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-[18px] font-extrabold text-ink-900">{JOB.title}</h1>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">{JOB.status}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[13px] text-ink-600 font-medium">{JOB.company}</span>
                  <VerifiedTick />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
                  <span className="flex items-center gap-1"><PinIcon />{JOB.location}</span>
                  <span className="flex items-center gap-1"><BriefIcon />{JOB.type}</span>
                  <span className="flex items-center gap-1"><ClockIcon />{JOB.experience}</span>
                  <span className="flex items-center gap-1"><RupeeIcon />{JOB.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {JOB.skills.map((s) => <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>)}
                </div>
              </div>
              <div className="flex items-start gap-4 shrink-0">
                <div className="text-[12px]">
                  <div className="text-ink-400">Posted on</div>
                  <div className="font-semibold text-ink-700">{JOB.postedOn}</div>
                  <div className="text-ink-400 mt-2">Applications</div>
                  <div className="font-display font-extrabold text-[18px] text-ink-900 leading-none mt-0.5">{JOB.applications}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors">Edit Job</button>
                  <button className="text-ink-300 hover:text-ink-600" aria-label="More options"><KebabIcon /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Compare */}
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
                  {t.key} ({t.count})
                </button>
              ))}
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition-colors" title="Compare up to 4 candidates">
              <CompareIcon /> Compare{selected.size > 0 ? ` (${selected.size})` : ""}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input type="text" placeholder="Search by name, skills, or email" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
            </div>
            <FilterSelect label="Experience" options={["Any", "0 – 3 yrs", "3 – 6 yrs", "6+ yrs"]} />
            <FilterSelect label="Current Location" options={["All", "Bangalore", "Hyderabad", "Pune"]} />
            <FilterSelect label="Notice Period" options={["Any", "Immediate", "30 Days", "60 Days"]} />
            <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[12.5px] text-ink-500">
              Sort by: <span className="font-semibold text-ink-700">Newest First</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>

          {/* Candidate table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead>
                  <tr className="text-[11.5px] font-semibold text-ink-500 border-b border-ink-100">
                    <th className="pl-4 pr-2 py-3 w-9"><input type="checkbox" className="accent-brand-600 w-4 h-4" aria-label="Select all" /></th>
                    <th className="px-2 py-3">Candidate</th>
                    <th className="px-2 py-3">Experience</th>
                    <th className="px-2 py-3">Current Company</th>
                    <th className="px-2 py-3">Applied On</th>
                    <th className="px-2 py-3">Match Score</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {visible.map((c) => <CandidateRow key={c.id} c={c} selected={selected.has(c.id)} onToggle={() => toggle(c.id)} />)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12.5px] text-ink-500">Showing 1 to {visible.length} of {JOB.applications} applications</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <PagerBtn><ArrowLeft /></PagerBtn>
                <button className="w-8 h-8 rounded-lg text-[13px] font-semibold bg-brand-600 text-white">1</button>
                <button className="w-8 h-8 rounded-lg text-[13px] font-semibold text-ink-600 hover:bg-ink-100">2</button>
                <button className="w-8 h-8 rounded-lg text-[13px] font-semibold text-ink-600 hover:bg-ink-100">3</button>
                <PagerBtn><ArrowRight /></PagerBtn>
              </div>
              <select className="px-3 py-1.5 rounded-lg border border-ink-200 text-[12.5px] text-ink-600 bg-white outline-none cursor-pointer" defaultValue="10">
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full xl:w-[300px] shrink-0 space-y-4 hidden xl:block">
          <MatchDistributionPanel />
          <ApplicationSummaryPanel />
          <FakeProfilesPanel />
          <QuickActionsPanel />
        </aside>
      </div>
    </div>
  );
}

/* ─── Candidate row ──────────────────────────────────────────────────────────── */
function matchMeta(pct: number): { color: string; label: string } {
  if (pct >= 85) return { color: "text-green-600", label: "Excellent Match" };
  if (pct >= 75) return { color: "text-orange-500", label: "Good Match" };
  if (pct >= 60) return { color: "text-orange-500", label: "Average Match" };
  return { color: "text-red-500", label: "Low Match" };
}

const STATUS_STYLE: Record<AppStatus, string> = {
  Applied: "bg-blue-50 text-blue-600 border-blue-200",
  Shortlisted: "bg-green-50 text-green-700 border-green-200",
  Interview: "bg-brand-50 text-brand-700 border-brand-200",
  Offered: "bg-orange-50 text-orange-600 border-orange-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
};

function CandidateRow({ c, selected, onToggle }: { c: Candidate; selected: boolean; onToggle: () => void }) {
  const m = matchMeta(c.match);
  return (
    <tr className="text-[13px] hover:bg-ink-100/30 transition-colors">
      <td className="pl-4 pr-2 py-3 align-top"><input type="checkbox" checked={selected} onChange={onToggle} className="accent-brand-600 w-4 h-4 mt-1" aria-label={`Select ${c.name}`} /></td>
      <td className="px-2 py-3">
        <div className="flex items-start gap-2.5">
          <span className={`w-9 h-9 rounded-full ${c.avatarBg} text-ink-600 flex items-center justify-center text-[12px] font-bold shrink-0`}>{c.name.split(" ").map((w) => w[0]).join("")}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-ink-900">{c.name}</span>
              {c.verified && <VerifiedTick />}
              {c.fake && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full"><WarnIcon /> Suspected Fake Profile</span>}
            </div>
            <div className="text-[11.5px] text-ink-500">{c.email}</div>
            <div className="text-[11.5px] text-ink-400">{c.phone}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-ink-700 align-top">{c.experience}</td>
      <td className="px-2 py-3 align-top">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-ink-100 flex items-center justify-center text-[11px] font-bold text-ink-500 shrink-0">{c.companyChar}</span>
          <div className="leading-tight">
            <div className="font-medium text-ink-800">{c.company}</div>
            {c.companyRole && <div className="text-[11px] text-ink-400">{c.companyRole}</div>}
          </div>
        </div>
      </td>
      <td className="px-2 py-3 align-top text-ink-700">
        <div>{c.appliedDate}</div>
        <div className="text-[11px] text-ink-400">{c.appliedTime}</div>
      </td>
      <td className="px-2 py-3 align-top">
        <div className={`font-display font-extrabold text-[15px] ${m.color}`}>{c.match}%</div>
        <div className={`text-[11px] font-semibold ${m.color}`}>{m.label}</div>
      </td>
      <td className="px-2 py-3 align-top"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[c.status]}`}>{c.status}</span></td>
      <td className="px-2 py-3 align-top pr-4">
        <div className="flex items-center gap-1.5 justify-end">
          <button className="text-[12px] font-semibold text-brand-600 border border-brand-300 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors whitespace-nowrap">View Profile</button>
          <button className="text-ink-300 hover:text-ink-600" aria-label="More options"><KebabIcon /></button>
        </div>
      </td>
    </tr>
  );
}

function PagerBtn({ children }: { children: React.ReactNode }) {
  return <button className="w-8 h-8 rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-100 flex items-center justify-center">{children}</button>;
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select className="appearance-none pl-3 pr-8 py-2 bg-white border border-ink-200 rounded-xl text-[13px] text-ink-600 outline-none cursor-pointer" defaultValue="">
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

/* ─── Right-rail panels ──────────────────────────────────────────────────────── */
const DISTRIBUTION = [
  { label: "Less than 60%", count: 3,  pct: 13, color: "#ef4444" },
  { label: "60% – 75%",     count: 7,  pct: 29, color: "#f97316" },
  { label: "75% – 89%",     count: 10, pct: 42, color: "#22c55e" },
  { label: "Above 90%",     count: 4,  pct: 16, color: "#3b82f6" },
];

function MatchDistributionPanel() {
  const max = Math.max(...DISTRIBUTION.map((d) => d.count));
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-1.5">Candidate Match Distribution</h3>
        <button className="text-ink-300" aria-label="More"><KebabIcon /></button>
      </div>
      <p className="text-[11.5px] text-ink-400 mt-0.5 mb-3">See how candidates match with this job&apos;s requirements.</p>
      <ul className="space-y-2.5">
        {DISTRIBUTION.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="text-[11px] text-ink-600 w-20 shrink-0">{d.label}</span>
            <div className="flex-1 h-3 rounded bg-ink-100 overflow-hidden">
              <div className="h-full rounded" style={{ width: `${(d.count / max) * 100}%`, background: d.color }} />
            </div>
            <span className="text-[11px] font-semibold text-ink-700 w-12 text-right shrink-0">{d.count} ({d.pct}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SUMMARY = [
  { label: "Applied", count: 12, pct: 50, color: "#3b82f6" },
  { label: "Shortlisted", count: 6, pct: 25, color: "#22c55e" },
  { label: "Interview", count: 4, pct: 17, color: "#6d4cff" },
  { label: "Offered", count: 1, pct: 4, color: "#f97316" },
  { label: "Rejected", count: 1, pct: 4, color: "#ef4444" },
];

function ApplicationSummaryPanel() {
  let acc = 0;
  const stops = SUMMARY.map((s) => {
    const start = acc; acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Application Summary</h3>
        <button className="text-ink-300" aria-label="More"><KebabIcon /></button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
          <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
            <span className="text-[9px] text-ink-500 font-medium">Total</span>
            <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">24</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {SUMMARY.map(({ label, count, pct, color }) => (
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
    </div>
  );
}

function FakeProfilesPanel() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-2"><ShieldIcon /> Detect Fake Profiles</h3>
      <p className="text-[11.5px] text-ink-500 mt-1.5 leading-snug">Our system uses AI to detect suspicious profiles based on resume patterns, contact info, and data verification.</p>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5">
        <span className="font-display font-extrabold text-[20px] text-red-600 leading-none">2</span>
        <div className="leading-tight">
          <div className="text-[12px] font-semibold text-red-600">Suspected Fake Profiles</div>
          <div className="text-[11px] text-ink-500">Flagged in this list</div>
        </div>
      </div>
      <a className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 cursor-pointer">
        View Flagged Profiles
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  );
}

const QUICK_ACTIONS = [
  { icon: <DownloadIcon />, title: "Download Applications", sub: "Export all applications as CSV" },
  { icon: <ShareIcon />, title: "Share Job Link", sub: "Share this job with your network" },
  { icon: <CompareIcon />, title: "Create Comparison", sub: "Compare up to 4 candidates" },
  { icon: <RefreshIcon />, title: "Bulk Update Status", sub: "Update status for multiple applicants" },
  { icon: <CalendarIcon />, title: "Schedule Interview", sub: "Schedule interview for selected candidates" },
];

function QuickActionsPanel() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900 inline-flex items-center gap-2 mb-3"><BoltIcon /> Quick Actions</h3>
      <ul className="space-y-1">
        {QUICK_ACTIONS.map((a) => (
          <li key={a.title}>
            <button className="w-full flex items-start gap-2.5 text-left rounded-lg px-2 py-2 hover:bg-ink-100/60 transition-colors">
              <span className="w-8 h-8 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">{a.icon}</span>
              <div className="leading-tight">
                <div className="text-[12.5px] font-semibold text-ink-900">{a.title}</div>
                <div className="text-[11px] text-ink-500">{a.sub}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function BriefIcon({ big }: { big?: boolean }) { const s = big ? 22 : 12; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>); }
function PinIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>); }
function ClockIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>); }
function RupeeIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12M6 8h12M9 4c4 0 6 3 6 6s-2 6-6 6h-3l6 6" /></svg>); }
function VerifiedTick() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" className="shrink-0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>); }
function WarnIcon() { return (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function KebabIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>); }
function CompareIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h7M3 12h7M3 18h7M17 4v16M14 7l3-3 3 3M14 17l3 3 3-3" /></svg>); }
function Chevron() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>); }
function ArrowLeft() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>); }
function ArrowRight() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>); }
function ShieldIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>); }
function DownloadIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>); }
function ShareIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></svg>); }
function RefreshIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>); }
function CalendarIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function BoltIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>); }
