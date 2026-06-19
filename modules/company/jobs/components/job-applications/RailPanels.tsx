import { ArrowRightLong, BoltIcon, CalendarIcon, CompareIcon, DownloadIcon, KebabIcon, RefreshIcon, ShareIcon, ShieldIcon } from "../../shared/icons";
import { Donut } from "../Donut";
import { DISTRIBUTION, SUMMARY } from "./data";

export function MatchDistributionPanel() {
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

export function ApplicationSummaryPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Application Summary</h3>
        <button className="text-ink-300" aria-label="More"><KebabIcon /></button>
      </div>
      <Donut segments={SUMMARY} centerLabel="Total" centerValue={24} />
    </div>
  );
}

export function FakeProfilesPanel() {
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
        View Flagged Profiles <ArrowRightLong size={13} />
      </a>
    </div>
  );
}

const QUICK_ACTIONS = [
  { icon: <DownloadIcon />, title: "Download Applications", sub: "Export all applications as CSV" },
  { icon: <ShareIcon />, title: "Share Job Link", sub: "Share this job with your network" },
  { icon: <CompareIcon />, title: "Create Comparison", sub: "Compare up to 4 candidates" },
  { icon: <RefreshIcon />, title: "Bulk Update Status", sub: "Update status for multiple applicants" },
  { icon: <CalendarIcon size={15} />, title: "Schedule Interview", sub: "Schedule interview for selected candidates" },
];

export function QuickActionsPanel() {
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
