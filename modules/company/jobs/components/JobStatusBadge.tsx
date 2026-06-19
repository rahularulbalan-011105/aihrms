import type { JobApiResponse } from "../services/job.service";

/* Pill showing a job's lifecycle status (Active / Draft / Closed / Expired). */
export function JobStatusBadge({ status }: { status: JobApiResponse["status"] }) {
  const styles: Record<JobApiResponse["status"], { label: string; cls: string }> = {
    PUBLISHED: { label: "Active", cls: "bg-green-50 text-green-700 border-green-200" },
    DRAFT: { label: "Draft", cls: "bg-ink-100 text-ink-600 border-ink-200" },
    CLOSED: { label: "Closed", cls: "bg-red-50 text-red-600 border-red-200" },
    EXPIRED: { label: "Expired", cls: "bg-orange-50 text-orange-600 border-orange-200" },
  };
  const s = styles[status];
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>;
}
