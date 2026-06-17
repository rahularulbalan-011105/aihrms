"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listJobs, type JobApiResponse } from "./services/job.service";

type StatusTab = "ALL" | "PUBLISHED" | "DRAFT";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PUBLISHED", label: "Published" },
  { key: "DRAFT", label: "Drafts" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export default function JobsList() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [jobs, setJobs] = useState<JobApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const status = tab === "ALL" ? undefined : tab;
    listJobs(status)
      .then(({ content }) => {
        if (active) setJobs(content);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load jobs");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab]);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight">My Jobs</h1>
          <p className="text-ink-500 text-[13px] mt-0.5">Manage and track all your job postings.</p>
        </div>
        <Link
          href="/company/jobs/new"
          className="px-4 py-2.5 rounded-lg text-white text-[13.5px] font-semibold inline-flex items-center gap-2 shrink-0"
          style={{ background: "var(--gradient-brand)" }}
        >
          <span className="text-[14px]">+</span> Post New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-ink-100 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-500 hover:text-ink-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-ink-400 text-[13px]">Loading jobs…</div>
      ) : error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-ink-100 rounded-xl p-10 flex flex-col items-center text-center">
          <h2 className="font-display text-[16px] font-extrabold">No jobs here yet</h2>
          <p className="text-ink-500 text-[12.5px] mt-1 mb-4">
            {tab === "DRAFT" ? "You have no draft jobs." : "Post your first job to start attracting candidates."}
          </p>
          <Link
            href="/company/jobs/new"
            className="px-5 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            <span>+</span> Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-100/40 text-[11.5px] font-semibold text-ink-500 uppercase tracking-wide">
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-center">Openings</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {jobs.map((job) => (
                <tr key={job.id} className="text-[13px] hover:bg-ink-100/30 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-ink-900">{job.title}</div>
                    {job.department && <div className="text-[11.5px] text-ink-500">{job.department}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">
                    {job.workplaceLocation || "—"}
                    {job.workMode && <span className="text-ink-400"> · {job.workMode}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">{job.employmentType || "—"}</td>
                  <td className="px-5 py-3.5 text-center text-ink-700">{job.openings}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={job.status} /></td>
                  <td className="px-5 py-3.5 text-ink-600">{formatDate(job.publishedAt ?? job.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: JobApiResponse["status"] }) {
  const styles: Record<JobApiResponse["status"], { label: string; cls: string }> = {
    PUBLISHED: { label: "Live", cls: "bg-green-50 text-green-700" },
    DRAFT: { label: "Draft", cls: "bg-ink-100 text-ink-600" },
    CLOSED: { label: "Closed", cls: "bg-red-50 text-red-600" },
    EXPIRED: { label: "Expired", cls: "bg-orange-50 text-orange-700" },
  };
  const s = styles[status];
  return <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${s.cls}`}>{s.label}</span>;
}
