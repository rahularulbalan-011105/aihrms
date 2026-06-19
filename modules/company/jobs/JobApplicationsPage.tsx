"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCompanyName } from "@/lib/api/config";
import { Pagination } from "@/components/ui/Pagination";
import { BriefIcon, Chevron, ChevronDown, ClockIcon, CompareIcon, KebabIcon, PinIcon, RupeeIcon, SearchIcon, VerifiedTick } from "./shared/icons";
import { formatDate, formatExperience, formatSalary } from "./shared/format";
import { FilterSelect } from "./components/FilterSelect";
import { CandidateRow } from "./components/job-applications/CandidateRow";
import { ApplicationSummaryPanel, FakeProfilesPanel, MatchDistributionPanel, QuickActionsPanel } from "./components/job-applications/RailPanels";
import type { AppStatus, Candidate } from "./components/job-applications/data";
import { fetchJobFull, type JobFullDetail } from "./services/job.service";
import {
  fetchApplicationCounts,
  fetchApplications,
  type ApplicationCounts,
  type ApplicationResponse,
  type ApplicationStatusKey,
} from "./services/applications.service";

const PAGE_SIZE = 10;

const STATUS_TABS: { key: string; status?: ApplicationStatusKey }[] = [
  { key: "All" },
  { key: "Applied", status: "APPLIED" },
  { key: "Shortlisted", status: "SHORTLISTED" },
  { key: "Interview", status: "INTERVIEW" },
  { key: "Offered", status: "OFFERED" },
  { key: "Rejected", status: "REJECTED" },
];

const STATUS_LABEL: Record<ApplicationStatusKey, AppStatus> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

const AVATAR_BGS = ["bg-brand-100", "bg-green-100", "bg-orange-100", "bg-blue-100"];

/** Map an API application (+ hydrated candidate) onto the table's view model. */
function toCandidate(application: ApplicationResponse, index: number): Candidate {
  const info = application.candidate;
  const applied = new Date(application.appliedAt);
  const validDate = !Number.isNaN(applied.getTime());
  return {
    id: application.id,
    name: info?.fullName ?? "Unknown Candidate",
    verified: info?.verified ?? false,
    email: info?.email ?? "—",
    phone: info?.phone ?? "—",
    avatarBg: AVATAR_BGS[index % AVATAR_BGS.length],
    experience: info?.experienceYears != null ? `${info.experienceYears} yrs` : "—",
    company: info?.currentCompany ?? "Not Specified",
    companyRole: info?.currentRole ?? "",
    companyChar: (info?.currentCompany ?? "?").charAt(0).toUpperCase(),
    appliedDate: validDate ? applied.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—",
    appliedTime: validDate ? applied.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "",
    match: application.matchScore ?? 0,
    status: STATUS_LABEL[application.status],
  };
}

/* View Applications — candidates who applied to a single job. */
export default function JobApplicationsPage({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobFullDetail | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [counts, setCounts] = useState<ApplicationCounts>({ total: 0, applied: 0, shortlisted: 0, interview: 0, offered: 0, rejected: 0 });
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [tab, setTab] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Job header + counts — fetched once.
  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
    fetchJobFull(jobId).then(setJob).catch(() => {});
    fetchApplicationCounts(jobId).then(setCounts).catch(() => {});
  }, [jobId]);

  // Applications — refetched on tab / page change.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const status = STATUS_TABS.find((t) => t.key === tab)?.status;
    fetchApplications(jobId, status, page - 1, PAGE_SIZE)
      .then(({ content, totalElements: total }) => {
        if (!active) return;
        setApplications(content);
        setTotalElements(total);
      })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Failed to load applications"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [jobId, tab, page]);

  const countFor = (key: string): number => {
    switch (key) {
      case "Applied": return counts.applied;
      case "Shortlisted": return counts.shortlisted;
      case "Interview": return counts.interview;
      case "Offered": return counts.offered;
      case "Rejected": return counts.rejected;
      default: return counts.total;
    }
  };

  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const candidates = applications.map(toCandidate);
  const skills = (job?.skills ?? []).map((s) => s.name);

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
        <span className="text-ink-700">{job?.title ?? "Job"}</span>
        <Chevron />
        <span className="text-brand-700 font-semibold">View Applications</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Job header */}
          <div className="card p-5">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon size={22} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-[18px] font-extrabold text-ink-900">{job?.title ?? "—"}</h1>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${job?.status === "PUBLISHED" ? "bg-green-50 text-green-700 border-green-200" : "bg-ink-100 text-ink-600 border-ink-200"}`}>
                    {job?.status === "PUBLISHED" ? "Active" : (job?.status ?? "—")}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[13px] text-ink-600 font-medium">{companyName || "—"}</span>
                  <VerifiedTick />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
                  <span className="flex items-center gap-1"><PinIcon />{job?.workplaceLocation || "—"}{job?.workMode ? ` · ${job.workMode}` : ""}</span>
                  <span className="flex items-center gap-1"><BriefIcon />{job?.employmentType || "—"}</span>
                  <span className="flex items-center gap-1"><ClockIcon />{formatExperience(job?.experienceMinYears ?? null, job?.experienceMaxYears ?? null)}</span>
                  <span className="flex items-center gap-1"><RupeeIcon />{formatSalary(job?.annualCtc ?? null, job?.currency ?? null)}</span>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {skills.slice(0, 5).map((s) => <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>)}
                    {skills.length > 5 && <span className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">+{skills.length - 5}</span>}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-4 shrink-0">
                <div className="text-[12px]">
                  <div className="text-ink-400">Posted on</div>
                  <div className="font-semibold text-ink-700">{formatDate(job?.publishedAt ?? job?.createdAt ?? null)}</div>
                  <div className="text-ink-400 mt-2">Applications</div>
                  <div className="font-display font-extrabold text-[18px] text-ink-900 leading-none mt-0.5">{counts.total}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/company/jobs/${jobId}/edit`} className="text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors">Edit Job</Link>
                  <button className="text-ink-300 hover:text-ink-600" aria-label="More options"><KebabIcon /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Compare */}
          <div className="flex items-center justify-between gap-4 border-b border-ink-100">
            <div className="flex gap-1 flex-wrap">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setPage(1); }}
                  className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                    tab === t.key ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {t.key} ({countFor(t.key)})
                </button>
              ))}
            </div>
            <Link href={`/company/jobs/${jobId}/compare`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition-colors" title="Compare up to 4 candidates">
              <CompareIcon /> Compare{selected.size > 0 ? ` (${selected.size})` : ""}
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input type="text" placeholder="Search by name, skills, or email" className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
            </div>
            <FilterSelect label="Experience" options={["Any", "0 – 3 yrs", "3 – 6 yrs", "6+ yrs"]} variant="outline" />
            <FilterSelect label="Current Location" options={["All", "Bangalore", "Hyderabad", "Pune"]} variant="outline" />
            <FilterSelect label="Notice Period" options={["Any", "Immediate", "30 Days", "60 Days"]} variant="outline" />
            <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[12.5px] text-ink-500">
              Sort by: <span className="font-semibold text-ink-700">Newest First</span>
              <ChevronDown />
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
                  {candidates.map((c) => <CandidateRow key={c.id} c={c} selected={selected.has(c.id)} onToggle={() => toggle(c.id)} />)}
                </tbody>
              </table>
            </div>
            {loading ? (
              <div className="py-12 text-center text-ink-400 text-[13px]">Loading applications…</div>
            ) : error ? (
              <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
            ) : candidates.length === 0 ? (
              <div className="py-12 text-center text-ink-400 text-[13px]">No applications in this category yet.</div>
            ) : null}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12.5px] text-ink-500">
              Showing {candidates.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {(page - 1) * PAGE_SIZE + candidates.length} of {countFor(tab)} applications
            </span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
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
