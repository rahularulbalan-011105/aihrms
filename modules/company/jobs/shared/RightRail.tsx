import type { JobDraft, StepNum } from "./types";

interface Props {
  current: StepNum;
  data: JobDraft;
  tips?: { title: string; tips: string[] };
  showJobSummary?: boolean;
}

const STEPS = [
  { n: 1, label: "Job Details" },
  { n: 2, label: "Requirements" },
  { n: 3, label: "Compensation" },
  { n: 4, label: "Preferences" },
  { n: 5, label: "Review & Publish" },
] as const;

export default function RightRail({ current, data, tips, showJobSummary = true }: Props) {
  return (
    <aside className="w-[280px] shrink-0 flex flex-col gap-3">
      {/* Job Posting Progress */}
      <div className="rounded-xl border border-ink-100 p-4 bg-white">
        <h3 className="font-display font-bold text-[14px] mb-3">Job Posting Progress</h3>
        <ul className="space-y-2.5">
          {STEPS.map((s) => {
            const done   = s.n < current;
            const active = s.n === current;
            return (
              <li key={s.n} className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  done   ? "bg-green-500 text-white" :
                  active ? "bg-brand-600 text-white" :
                            "bg-ink-100 text-ink-400"
                }`}>
                  {done ? "✓" : s.n}
                </span>
                <span className={`text-[12.5px] font-semibold ${active ? "text-brand-700" : done ? "text-ink-900" : "text-ink-400"}`}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tips */}
      {tips && (
        <div className="rounded-xl border border-ink-100 p-4 bg-white">
          <h3 className="font-display font-bold text-[14px] mb-2 inline-flex items-center gap-1.5"><BulbIcon /> {tips.title}</h3>
          <ul className="space-y-1.5">
            {tips.tips.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[12px] text-ink-700">
                <span className="mt-1 text-green-600">✓</span> <span>{t}</span>
              </li>
            ))}
          </ul>
          <a className="mt-2 inline-flex items-center gap-1 text-[12px] text-brand-700 font-semibold">View full guide →</a>
        </div>
      )}

      {/* Job Summary */}
      {showJobSummary && (
        <div className="rounded-xl border border-ink-100 p-4 bg-white">
          <h3 className="font-display font-bold text-[14px] mb-2.5">
            Job Summary <span className="text-[10.5px] font-medium text-ink-500">(Auto-fill)</span>
          </h3>
          <SummaryItem label="Job Title"        value={data.details.title} />
          <SummaryItem label="Location"         value={data.details.workplaceLocation} />
          <SummaryItem label="Employment Type"  value={data.details.employmentType} />
          <SummaryItem label="Experience"       value={data.details.experienceMin && data.details.experienceMax ? `${data.details.experienceMin} - ${data.details.experienceMax} Years` : data.details.experienceRange} />
          <SummaryItem label="Salary Range"     value={data.compensation.annualCtc ? `₹ ${data.compensation.annualCtc}` : ""} />
          <SummaryItem label="Openings"         value={String(data.details.openings ?? "")} />
          {current < 5 && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] text-ink-500">
              <InfoIcon /> Complete all sections to see summary
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1 border-b last:border-0 border-ink-100/60">
      <span className="text-[11.5px] text-ink-500">{label}</span>
      <span className="text-[12px] font-semibold text-ink-900 text-right truncate max-w-[55%]">{value || "-"}</span>
    </div>
  );
}

function BulbIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c1 .6 1.5 1.5 1.5 2.5V17h3v-.5c0-1 .5-1.9 1.5-2.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function InfoIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
