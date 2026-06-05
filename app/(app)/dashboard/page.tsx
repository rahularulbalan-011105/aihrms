import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — HireMind",
};

const STATS = [
  { label: "Jobs Applied",    value: "24",  change: "+3 this week",  up: true },
  { label: "Profile Views",   value: "142", change: "+18 this week", up: true },
  { label: "Shortlisted",     value: "8",   change: "+2 this week",  up: true },
  { label: "Match Score",     value: "94%", change: "Excellent",     up: true },
];

const RECOMMENDED_JOBS = [
  { title: "Senior Frontend Developer", company: "TechCorp India", match: 97, location: "Bangalore" },
  { title: "React Engineer",            company: "StartupXYZ",     match: 94, location: "Remote" },
  { title: "Full Stack Developer",      company: "InnovateCo",     match: 91, location: "Hyderabad" },
];

const PROFILE_STEPS = [
  { label: "Basic Info",       done: true  },
  { label: "Upload Resume",    done: false },
  { label: "Add Skills",       done: false },
  { label: "Set Preferences",  done: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div
        className="rounded-2xl px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
        style={{ background: "var(--gradient-brand)" }}
      >
        <div>
          <h1 className="font-display text-[24px] font-extrabold">Welcome back! 👋</h1>
          <p className="mt-1 text-white/75 text-[14px]">
            Here&apos;s what&apos;s happening with your job search today.
          </p>
        </div>
        <Link
          href="/jobs"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-brand-700 text-[13.5px] font-semibold hover:bg-brand-50 transition self-start sm:self-auto"
        >
          Browse Jobs →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-[13px] text-ink-500 font-medium">{s.label}</div>
            <div className="mt-1.5 font-display font-extrabold text-[30px] text-ink-900 leading-none">
              {s.value}
            </div>
            <div className={`mt-1.5 text-[12px] font-semibold ${s.up ? "text-green-600" : "text-red-500"}`}>
              {s.up ? "↑" : "↓"} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        {/* Recommended Jobs */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-[16px] text-ink-900">Recommended Jobs</div>
            <Link href="/jobs" className="text-[13px] text-brand-600 font-semibold hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {RECOMMENDED_JOBS.map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between p-4 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50/30 transition cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-[14px] text-ink-900">{job.title}</div>
                  <div className="text-ink-500 text-[12.5px] mt-0.5">
                    {job.company} · {job.location}
                  </div>
                  <div className="mt-2 text-[11px] text-ink-400 italic">
                    Backend integration pending — demo data
                  </div>
                </div>
                <div className="shrink-0 ml-4 text-center">
                  <span className="text-[12px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                    {job.match}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile completion */}
        <div className="card p-6">
          <div className="font-display font-bold text-[16px] text-ink-900 mb-1">
            Complete your profile
          </div>
          <p className="text-ink-500 text-[12.5px] mb-4">
            A complete profile gets 3× more recruiter views.
          </p>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="text-ink-600 font-medium">25% complete</span>
              <span className="text-brand-600 font-semibold">1 of 4 done</span>
            </div>
            <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full w-1/4" style={{ background: "var(--gradient-brand)" }} />
            </div>
          </div>

          <div className="space-y-1">
            {PROFILE_STEPS.map((step) => (
              <div
                key={step.label}
                className="flex items-center gap-3 py-3 border-b border-ink-100 last:border-0"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] shrink-0 font-bold ${
                  step.done ? "bg-green-100 text-green-600" : "bg-ink-100 text-ink-400"
                }`}>
                  {step.done ? "✓" : "○"}
                </div>
                <span className={`text-[13.5px] ${step.done ? "text-ink-400 line-through" : "text-ink-700 font-medium"}`}>
                  {step.label}
                </span>
                {!step.done && (
                  <Link href="/profile/edit" className="ml-auto text-[12px] text-brand-600 font-semibold hover:text-brand-700">
                    Add →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
