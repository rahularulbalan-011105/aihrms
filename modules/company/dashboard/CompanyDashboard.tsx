"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCompanyName } from "@/lib/api/config";
import { fetchJobCounts } from "@/modules/company/jobs/services/job.service";

export default function CompanyDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [jobCounts, setJobCounts] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });

  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
  }, []);

  useEffect(() => {
    fetchJobCounts()
      .then(setJobCounts)
      .catch(() => {}); // non-fatal — leave counts at 0 if company_api is unavailable
  }, []);

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-extrabold tracking-tight inline-flex items-center gap-2">
          Welcome back{companyName ? `, ${companyName}` : ""}!{" "}
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-ink-500 text-[13.5px] mt-1">
          Here&apos;s what&apos;s happening with your hiring today.
        </p>
      </div>

      <div className="space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            iconBg="bg-brand-50 text-brand-600"
            icon={<BriefIcon />}
            value={String(jobCounts.published)}
            label="Active Jobs"
            sub={jobCounts.drafts > 0 ? `${jobCounts.drafts} draft${jobCounts.drafts === 1 ? "" : "s"}` : "Published"}
          />
          <StatCard iconBg="bg-green-50 text-green-600" icon={<UserPlusIcon />} value="86" label="Total Candidates" sub="Total" />
          <StatCard iconBg="bg-blue-50 text-blue-600" icon={<DocIcon />} value="28" label="Applications" sub="Received" />
          <StatCard iconBg="bg-orange-50 text-orange-600" icon={<CalendarIcon />} value="8" label="Interviews" sub="Scheduled" />
          <StatCard iconBg="bg-brand-50 text-brand-600" icon={<UserCheckIcon />} value="5" label="Hires" sub="This month" />
        </div>

        <div className="flex gap-6 items-start">
          {/* MAIN — empty state */}
          <div className="flex-1 min-w-0 card p-8 flex flex-col items-center text-center">
            <h2 className="font-display text-[18px] font-extrabold text-ink-900">
              Let&apos;s get you started!
            </h2>
            <p className="text-ink-500 text-[13px] mt-1">
              You haven&apos;t posted any jobs yet.
            </p>

            <ChairIllustration />

            <h3 className="font-display text-[15px] font-extrabold mt-1 text-ink-900">
              Post your first job and find the perfect candidates
            </h3>
            <p className="text-ink-500 text-[12.5px] mt-1 mb-4">
              Reach top talent and build your dream team.
            </p>

            <Link
              href="/company/jobs/new"
              className="px-6 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>+</span> Post Your First Job
            </Link>
          </div>

          {/* RIGHT column */}
          <aside className="w-[300px] shrink-0 space-y-4 hidden lg:block">
            {/* Profile completion */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">
                Profile Completion
              </h3>
              <div className="flex items-center gap-3">
                <Ring percent={85} />
                <div className="leading-snug">
                  <div className="text-[12.5px] font-bold text-ink-900">Almost there!</div>
                  <div className="text-[11.5px] text-ink-500">
                    Complete your profile to unlock more features.
                  </div>
                  <button className="mt-1.5 text-[11.5px] px-2.5 py-1 rounded-md border border-brand-300 text-brand-700 font-semibold hover:bg-brand-50 transition">
                    Complete Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Get Started */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">
                Get Started
              </h3>
              <ul className="space-y-2">
                <GetStarted
                  icon={<BriefIcon />}
                  title="Post a Job"
                  sub="Create your first job post"
                  href="/company/jobs/new"
                />
                <GetStarted
                  icon={<UserPlusIcon />}
                  title="Invite Team Members"
                  sub="Add your team to collaborate"
                />
                <GetStarted
                  icon={<BuildingIcon />}
                  title="Add Clients"
                  sub="Add your clients to start hiring"
                />
                <GetStarted
                  icon={<ChartIcon />}
                  title="View Reports"
                  sub="Track your hiring performance"
                />
              </ul>
            </div>
          </aside>
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-[16px] text-ink-900 inline-flex items-center gap-2">
              <FilterIcon /> Recent Activity
            </h3>
            <a className="text-[13px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1">
              View All <ArrowRight />
            </a>
          </div>
          <ul className="divide-y divide-ink-100">
          <Activity
            icon={<BriefIcon />}
            title="Product Designer"
            detail="has 6 new applications"
            time="2 hours ago"
            right={
              <span className="text-green-600 text-[12px] font-semibold">
                6 New Applications
              </span>
            }
          />
          <Activity
            icon={<UserPlusIcon />}
            title="Rahul Sharma"
            detail="moved to Interview stage"
            time="5 hours ago"
            right={
              <span className="text-blue-600 text-[12px] font-semibold">
                Interview Scheduled
              </span>
            }
          />
          <Activity
            icon={<CalendarIcon />}
            title="Interview scheduled with Ananya Singh"
            detail=""
            time="1 day ago"
            right={
              <span className="text-orange-600 text-[12px] font-semibold">
                Tomorrow, 11:00 AM
              </span>
            }
          />
          <Activity
            icon={<DocIcon />}
            title="Monthly hiring report is ready"
            detail=""
            time="2 days ago"
            right={
              <a className="text-brand-700 text-[12px] font-semibold">
                View Report
              </a>
            }
          />
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Pieces ─── */
function StatCard({
  iconBg,
  icon,
  value,
  label,
  sub,
}: {
  iconBg: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-ink-500 font-medium leading-tight">{label}</div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">{value}</span>
          {sub && <span className="text-[11px] text-ink-400">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
function Ring({ percent }: { percent: number }) {
  return (
    <div
      className="w-[64px] h-[64px] rounded-full grid place-items-center shrink-0"
      style={{
        background: `conic-gradient(#22c55e ${percent * 3.6}deg, #E5E7EB 0deg)`,
      }}
    >
      <div className="w-[50px] h-[50px] rounded-full bg-white grid place-items-center">
        <span className="text-[13px] font-bold text-green-600">{percent}%</span>
      </div>
    </div>
  );
}
function GetStarted({
  icon,
  title,
  sub,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
        {icon}
      </span>
      <div className="flex-1 leading-tight">
        <div className="text-[12.5px] font-bold">{title}</div>
        <div className="text-[10.5px] text-ink-500">{sub}</div>
      </div>
      <span className="text-ink-400">
        <ArrowRight />
      </span>
    </>
  );
  const className =
    "flex items-center gap-2.5 hover:bg-ink-100/50 rounded-md px-1.5 py-1 cursor-pointer";
  return (
    <li>
      {href ? (
        <Link href={href} className={className}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}
function Activity({
  icon,
  title,
  detail,
  time,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  detail?: string;
  time: string;
  right: React.ReactNode;
}) {
  return (
    <li className="py-2.5 flex items-center gap-3">
      <span className="w-9 h-9 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex-1 leading-tight">
        <div className="text-[12.5px]">
          <b>{title}</b>{" "}
          {detail && <span className="text-ink-700">{detail}</span>}
        </div>
        <div className="text-[10.5px] text-ink-500">{time}</div>
      </div>
      <div className="shrink-0">{right}</div>
    </li>
  );
}
function ChairIllustration() {
  return (
    <div className="w-[240px] h-[160px] my-2 grid place-items-center text-brand-300">
      <svg viewBox="0 0 240 160" width="240" height="160" fill="none">
        <rect
          x="50"
          y="25"
          width="120"
          height="70"
          rx="6"
          stroke="#C4B5FD"
          strokeWidth="2"
        />
        <circle cx="62" cy="36" r="2" fill="#C4B5FD" />
        <circle cx="70" cy="36" r="2" fill="#C4B5FD" />
        <circle cx="78" cy="36" r="2" fill="#C4B5FD" />
        <rect x="60" y="48" width="100" height="6" fill="#EDE9FE" />
        <rect x="60" y="58" width="80" height="6" fill="#EDE9FE" />
        <rect x="60" y="68" width="90" height="6" fill="#EDE9FE" />
        <rect x="100" y="95" width="60" height="40" rx="8" fill="#7C3AED" />
        <rect x="118" y="135" width="24" height="14" fill="#7C3AED" />
        <ellipse cx="130" cy="152" rx="50" ry="4" fill="#EDE9FE" />
        <path d="M205 35l3-8 3 8 8 3-8 3-3 8-3-8-8-3z" fill="#A78BFA" />
        <path d="M30 90l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#FCD34D" />
        <circle cx="40" cy="55" r="3" fill="#60A5FA" />
      </svg>
    </div>
  );
}

/* Icons */
function BriefIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5M18 7v4M16 9h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 12h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UserCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5M16 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 16l3-4 3 2 5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 5h18l-7 9v6l-4-2v-4L3 5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L8 3m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
