import Link from "next/link";

export interface Job {
  id: string;
  title: string;
  company: string;
  verified: boolean;
  location: string;
  experience: string;
  type: string;
  skills: string[];
  match: number;
  matchLabel: "High Match" | "Medium Match" | "Low Match";
  postedAt: string;
  warning?: { kind: "fake" | "ghost"; text: string };
}

function matchColor(pct: number) {
  if (pct >= 80) return "text-green-600";
  if (pct >= 50) return "text-orange-500";
  return "text-red-500";
}

function matchBadgeStyle(label: string) {
  if (label === "High Match")   return "bg-green-50 text-green-700 border-green-200";
  if (label === "Medium Match") return "bg-orange-50 text-orange-600 border-orange-200";
  return "bg-red-50 text-red-600 border-red-200";
}

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50/20 transition-colors">
      {/* Company logo placeholder */}
      <div className="w-11 h-11 rounded-xl border border-ink-200 bg-ink-100 flex items-center justify-center shrink-0 text-[11px] font-bold text-ink-500 overflow-hidden">
        {job.company.charAt(0)}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[14px] text-ink-900">{job.title}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${matchBadgeStyle(job.matchLabel)}`}>
                {job.matchLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] text-ink-600 font-medium">{job.company}</span>
              {job.verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" className="shrink-0">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-ink-400">{job.postedAt}</span>
            <Link href="/saved-jobs" className="text-ink-300 hover:text-brand-500 transition-colors" aria-label="Save job">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2 text-[12px] text-ink-500 flex-wrap">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
            {job.experience}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {job.type}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {job.skills.map((skill) => (
            <span key={skill} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{skill}</span>
          ))}
        </div>

        {/* Warning */}
        {job.warning && (
          <div className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium ${
            job.warning.kind === "fake" ? "text-red-500" : "text-orange-500"
          }`}>
            {job.warning.kind === "fake" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            )}
            {job.warning.text}
            <button className="underline hover:no-underline ml-1">Learn more</button>
          </div>
        )}
      </div>

      {/* Match score + action */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="text-center">
          <div className={`font-display font-extrabold text-[20px] leading-none ${matchColor(job.match)}`}>{job.match}%</div>
          <div className={`text-[11px] font-semibold ${matchColor(job.match)}`}>Match</div>
        </div>
        {job.warning && (
          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
            job.warning.kind === "fake"
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-orange-50 text-orange-500 border-orange-200"
          }`}>
            {job.warning.kind === "fake" ? "⚠ Fake Job" : "👻 Ghost Job"}
          </span>
        )}
        <button className="mt-1 text-[12px] font-semibold text-brand-600 border border-brand-300 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
          View Details
        </button>
        <button className="text-[12px] font-semibold text-white px-3 py-1.5 rounded-xl hover:opacity-95 transition-opacity whitespace-nowrap" style={{ background: "var(--gradient-brand)" }}>
          Apply Job
        </button>
      </div>
    </div>
  );
}
