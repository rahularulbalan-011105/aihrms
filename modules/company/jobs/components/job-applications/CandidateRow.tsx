import { KebabIcon, VerifiedTick, WarnIcon } from "../../shared/icons";
import type { AppStatus, Candidate } from "./data";

function matchMeta(pct: number): { color: string; label: string } {
  if (pct >= 85) return { color: "text-green-600", label: "Excellent Match" };
  if (pct >= 75) return { color: "text-orange-500", label: "Good Match" };
  if (pct >= 60) return { color: "text-orange-500", label: "Average Match" };
  return { color: "text-red-500", label: "Low Match" };
}

const STATUS_STYLE: Record<AppStatus, string> = {
  Applied: "bg-blue-50 text-blue-600 border-blue-200",
  Shortlisted: "bg-green-50 text-green-700 border-green-200",
  Interview: "bg-brand-50 text-brand-700 border-brand-200",
  Offered: "bg-orange-50 text-orange-600 border-orange-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
};

export function CandidateRow({ c, selected, onToggle }: { c: Candidate; selected: boolean; onToggle: () => void }) {
  const m = matchMeta(c.match);
  return (
    <tr className="text-[13px] hover:bg-ink-100/30 transition-colors">
      <td className="pl-4 pr-2 py-3 align-top"><input type="checkbox" checked={selected} onChange={onToggle} className="accent-brand-600 w-4 h-4 mt-1" aria-label={`Select ${c.name}`} /></td>
      <td className="px-2 py-3">
        <div className="flex items-start gap-2.5">
          <span className={`w-9 h-9 rounded-full ${c.avatarBg} text-ink-600 flex items-center justify-center text-[12px] font-bold shrink-0`}>{c.name.split(" ").map((w) => w[0]).join("")}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-ink-900">{c.name}</span>
              {c.verified && <VerifiedTick />}
              {c.fake && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full"><WarnIcon /> Suspected Fake Profile</span>}
            </div>
            <div className="text-[11.5px] text-ink-500">{c.email}</div>
            <div className="text-[11.5px] text-ink-400">{c.phone}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-ink-700 align-top">{c.experience}</td>
      <td className="px-2 py-3 align-top">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-ink-100 flex items-center justify-center text-[11px] font-bold text-ink-500 shrink-0">{c.companyChar}</span>
          <div className="leading-tight">
            <div className="font-medium text-ink-800">{c.company}</div>
            {c.companyRole && <div className="text-[11px] text-ink-400">{c.companyRole}</div>}
          </div>
        </div>
      </td>
      <td className="px-2 py-3 align-top text-ink-700">
        <div>{c.appliedDate}</div>
        <div className="text-[11px] text-ink-400">{c.appliedTime}</div>
      </td>
      <td className="px-2 py-3 align-top">
        <div className={`font-display font-extrabold text-[15px] ${m.color}`}>{c.match}%</div>
        <div className={`text-[11px] font-semibold ${m.color}`}>{m.label}</div>
      </td>
      <td className="px-2 py-3 align-top"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[c.status]}`}>{c.status}</span></td>
      <td className="px-2 py-3 align-top pr-4">
        <div className="flex items-center gap-1.5 justify-end">
          <button className="text-[12px] font-semibold text-brand-600 border border-brand-300 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors whitespace-nowrap">View Profile</button>
          <button className="text-ink-300 hover:text-ink-600" aria-label="More options"><KebabIcon /></button>
        </div>
      </td>
    </tr>
  );
}
