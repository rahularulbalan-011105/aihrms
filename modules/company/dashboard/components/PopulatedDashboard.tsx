"use client";

import { useMemo } from "react";
import Link from "next/link";
import type {
  CompanyDashboardResponse,
  DashboardJobRow,
  JobCountsResponse,
} from "@/modules/company/jobs/services/job.service";
import { StatCard } from "@/modules/company/jobs/components/StatCard";
import { JobStatusBadge } from "@/modules/company/jobs/components/JobStatusBadge";
import {
  BriefIcon,
  CalendarIcon,
  DocIcon,
  UsersIcon,
  UserCheckIcon,
  ArrowRightLong,
} from "../icons";

interface Aggregate {
  applications: number;
  shortlisted: number;
  interview: number;
  offered: number;
}

const EMPTY_AGG: Aggregate = { applications: 0, shortlisted: 0, interview: 0, offered: 0 };

/* Live company dashboard, shown once the company has at least one job. All its
 * live data — the Active Jobs table rows and the application aggregates
 * (Applications / Shortlisted / Interviews / funnel) — arrives as props from
 * the single dashboard call in CompanyDashboard; this component does no
 * fetching of its own. Total Candidates / Hires, the hiring-overview trend and
 * Upcoming Interviews have no backend domain yet and render as
 * empty/illustrative placeholders. */
export default function PopulatedDashboard({
  companyName,
  counts,
  activeJobs,
}: {
  companyName: string;
  counts: JobCountsResponse;
  activeJobs: CompanyDashboardResponse["activeJobs"];
}) {
  const rows: DashboardJobRow[] = activeJobs;
  const agg = useMemo<Aggregate>(
    () =>
      rows.reduce<Aggregate>(
        (acc, row) => ({
          applications: acc.applications + row.applications,
          shortlisted: acc.shortlisted + row.shortlisted,
          interview: acc.interview + row.interviews,
          offered: acc.offered + row.offered,
        }),
        EMPTY_AGG,
      ),
    [rows],
  );

  const funnel = [
    { label: "Applications", value: agg.applications, color: "#7c3aed" },
    { label: "Shortlisted", value: agg.shortlisted, color: "#3b82f6" },
    { label: "Interviews", value: agg.interview, color: "#f59e0b" },
    { label: "Offered", value: agg.offered, color: "#22c55e" },
    { label: "Hired", value: 0, color: "#a78bfa" },
  ];
  const conversion =
    agg.applications > 0 ? ((0 / agg.applications) * 100).toFixed(1) : "0.0";

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight inline-flex items-center gap-2">
            Welcome back{companyName ? `, ${companyName}` : ""}!{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="text-ink-500 text-[13.5px] mt-1">
            Here&apos;s what&apos;s happening with your hiring today.
          </p>
        </div>
        <Link
          href="/company/jobs/new"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity"
        >
          <span className="text-[15px]">+</span> Post a New Job
        </Link>
      </div>

      <div className="space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard iconBg="bg-brand-50 text-brand-600" icon={<BriefIcon size={20} />} value={String(counts.published)} label="Active Jobs" />
          <StatCard iconBg="bg-green-50 text-green-600" icon={<UsersIcon size={20} />} value={String(agg.applications)} label="Total Candidates" />
          <StatCard iconBg="bg-blue-50 text-blue-600" icon={<DocIcon size={20} />} value={String(agg.applications)} label="Applications" />
          <StatCard iconBg="bg-orange-50 text-orange-600" icon={<CalendarIcon size={20} />} value={String(agg.interview)} label="Interviews" />
          <StatCard iconBg="bg-brand-50 text-brand-600" icon={<UserCheckIcon size={20} />} value="0" label="Hires" />
        </div>

        {/* Row: Hiring Overview + Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_320px_300px] gap-5 items-start">
          {/* Hiring Overview */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[16px] text-ink-900">Hiring Overview</h2>
              <span className="text-[12px] text-ink-500 border border-ink-200 rounded-lg px-2.5 py-1">This Week</span>
            </div>
            <HiringChart points={[agg.applications]} />
            <div className="grid grid-cols-4 gap-3 mt-4">
              <MiniStat icon={<UsersIcon size={16} />} label="Applications" value={agg.applications} tint="bg-brand-50 text-brand-600" />
              <MiniStat icon={<UserCheckIcon size={16} />} label="Shortlisted" value={agg.shortlisted} tint="bg-green-50 text-green-600" />
              <MiniStat icon={<CalendarIcon size={16} />} label="Interviews" value={agg.interview} tint="bg-orange-50 text-orange-600" />
              <MiniStat icon={<UserCheckIcon size={16} />} label="Hires" value={0} tint="bg-brand-50 text-brand-600" />
            </div>
          </div>

          {/* Recent Activity — derived from live jobs + application counts */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-[15px] text-ink-900">Recent Activity</h3>
              <Link href="/company/applications" className="text-[12.5px] text-brand-600 font-semibold hover:text-brand-800">View all</Link>
            </div>
            {rows.length === 0 ? (
              <div className="py-6 text-center text-ink-400 text-[12.5px]">No recent activity yet.</div>
            ) : (
              <ul className="space-y-3">
                {rows.slice(0, 5).map((row) => (
                  <li key={row.id} className="flex items-start gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                      <BriefIcon size={15} />
                    </span>
                    <div className="leading-tight min-w-0">
                      <div className="text-[12.5px] text-ink-800">
                        <b className="text-ink-900">{row.title}</b>{" "}
                        {row.applications > 0
                          ? `has ${row.applications} application${row.applications === 1 ? "" : "s"}`
                          : "is now live"}
                      </div>
                      <div className="text-[10.5px] text-ink-500">{row.department || "—"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-5 lg:col-span-2 xl:col-span-1">
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickAction href="/company/jobs/new" icon={<BriefIcon size={18} />} title="Post a Job" sub="Create a new job post" />
                <QuickAction href="/company/applications" icon={<UsersIcon size={18} />} title="View Applicants" sub="Review your pipeline" />
                <QuickAction href="/company/clients/new" icon={<UserCheckIcon size={18} />} title="Add Client" sub="Onboard a new client" />
                <QuickAction href="/company/jobs" icon={<DocIcon size={18} />} title="Manage Jobs" sub="View all job posts" />
              </div>
            </div>

            {/* Hiring Funnel */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-4">Hiring Funnel</h3>
              <div className="space-y-3">
                {funnel.map((stage) => {
                  const max = funnel[0].value || 1;
                  const width = Math.max((stage.value / max) * 100, stage.value > 0 ? 6 : 2);
                  return (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <span className="text-ink-600">{stage.label}</span>
                        <span className="font-semibold text-ink-800">{stage.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${width}%`, background: stage.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                <span className="text-[12.5px] font-semibold text-brand-700">Conversion Rate</span>
                <span className="text-[13px] font-extrabold text-green-600">{conversion}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Jobs table */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-[16px] text-ink-900">Active Jobs</h2>
            <Link href="/company/jobs" className="text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 inline-flex items-center gap-1">
              View All Jobs <ArrowRightLong size={13} />
            </Link>
          </div>
          {rows.length === 0 ? (
            <div className="py-10 text-center text-ink-400 text-[13px]">No active jobs to show.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-ink-400 border-b border-ink-100">
                    <th className="py-2.5 pr-4 font-semibold">Job Title</th>
                    <th className="py-2.5 px-3 font-semibold">Department</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Applications</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Shortlisted</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Interviews</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Offered</th>
                    <th className="py-2.5 pl-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.map((row) => (
                    <tr key={row.id} className="text-[13px] hover:bg-ink-100/40 transition-colors">
                      <td className="py-3 pr-4">
                        <Link href={`/company/jobs/${row.id}/applications`} className="font-semibold text-ink-900 hover:text-brand-700">
                          {row.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-ink-600">{row.department || "—"}</td>
                      <td className="py-3 px-3 text-center font-semibold text-ink-800">{row.applications}</td>
                      <td className="py-3 px-3 text-center text-ink-700">{row.shortlisted}</td>
                      <td className="py-3 px-3 text-center text-ink-700">{row.interviews}</td>
                      <td className="py-3 px-3 text-center text-ink-700">{row.offered}</td>
                      <td className="py-3 pl-3"><JobStatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Pieces ─── */
function MiniStat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number; tint: string }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3 flex items-center gap-2.5">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[10.5px] text-ink-500">{label}</div>
        <div className="font-display font-extrabold text-[16px] text-ink-900">{value}</div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, title, sub }: { href: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link href={href} className="rounded-xl border border-ink-100 p-3 hover:border-brand-300 hover:bg-brand-50/40 transition-colors">
      <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-2">{icon}</span>
      <div className="text-[12.5px] font-bold text-ink-900 leading-tight">{title}</div>
      <div className="text-[10.5px] text-ink-500 leading-tight mt-0.5">{sub}</div>
    </Link>
  );
}

/* Lightweight area sparkline. With no time-series API, it draws a single
 * representative curve scaled to the current application volume. */
function HiringChart({ points }: { points: number[] }) {
  const peak = Math.max(points[0] ?? 0, 1);
  // Illustrative weekly shape (0–1), scaled by the live application volume.
  const shape = [0.25, 0.45, 0.55, 0.5, 0.85, 0.7, 0.75];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const w = 520;
  const h = 150;
  const stepX = w / (shape.length - 1);
  const coords = shape.map((value, index) => {
    const x = index * stepX;
    const y = h - value * (h - 20) - 10;
    return [x, y] as const;
  });
  const line = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full h-[150px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hm-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#hm-area)" />
        <path d={line} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="3" fill="#7c3aed" />
        ))}
        {labels.map((label, index) => (
          <text key={label} x={index * stepX} y={h + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">
            {label}
          </text>
        ))}
      </svg>
      <div className="sr-only">Peak applications: {peak}</div>
    </div>
  );
}
