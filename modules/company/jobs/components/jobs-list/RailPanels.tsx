import type { JobCountsResponse } from "../../services/job.service";
import { KebabIcon } from "../../shared/icons";
import { Donut } from "../Donut";

/* Right-rail panels for the Jobs list. Recommended candidates / top skills are
 * static demo data until those domains exist; Job Insights is live from counts. */

export function JobInsightsPanel({ counts }: { counts: JobCountsResponse }) {
  const closed = Math.max(counts.total - counts.published - counts.drafts, 0);
  const segments = [
    { label: "Active", count: counts.published, color: "#22c55e" },
    { label: "Draft", count: counts.drafts, color: "#3b82f6" },
    { label: "Closed", count: closed, color: "#9ca3af" },
    { label: "Paused", count: 0, color: "#f97316" },
  ];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Job Insights</h3>
        <button className="text-ink-300" aria-label="More"><KebabIcon /></button>
      </div>
      <div className="mt-4">
        <Donut segments={segments} total={counts.total} centerLabel="Total Jobs" centerValue={counts.total} />
      </div>
    </div>
  );
}

const RECOMMENDED = [
  { name: "Arjun Mehta", role: "Senior Software Engineer", match: 92 },
  { name: "Neha Kulkarni", role: "Backend Developer", match: 88 },
  { name: "Rohan Das", role: "Cloud Engineer", match: 85 },
];

export function RecommendedCandidatesPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Recommended Candidates</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      <ul className="space-y-3">
        {RECOMMENDED.map((c) => (
          <li key={c.name} className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[12px] font-bold shrink-0">{c.name.split(" ").map((w) => w[0]).join("")}</span>
            <div className="flex-1 leading-snug min-w-0">
              <div className="text-[12.5px] font-semibold text-ink-900 truncate">{c.name}</div>
              <div className="text-[11px] text-ink-500 truncate">{c.role}</div>
            </div>
            <span className="text-[11.5px] font-bold text-green-600 shrink-0">{c.match}% Match</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface SkillDemand {
  name: string;
  jobs: number;
}

/** Top skills aggregated from the loaded jobs (skill → number of jobs requesting it). */
export function TopSkillsPanel({ skills }: { skills: SkillDemand[] }) {
  const max = skills.length ? Math.max(...skills.map((s) => s.jobs)) : 1;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Top Skills in Demand</h3>
        <button className="text-[12px] text-brand-600 font-semibold hover:text-brand-800">View all</button>
      </div>
      {skills.length === 0 ? (
        <p className="text-[12px] text-ink-400">No skill data for your jobs yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {skills.map((s) => (
            <li key={s.name} className="flex items-center gap-3">
              <span className="text-[12px] text-ink-700 font-medium w-16 shrink-0 truncate">{s.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full rounded-full btn-gradient-brand" style={{ width: `${(s.jobs / max) * 100}%` }} />
              </div>
              <span className="text-[11px] text-ink-500 w-12 text-right shrink-0">{s.jobs} {s.jobs === 1 ? "job" : "jobs"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}