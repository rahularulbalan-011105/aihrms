import type { JobDraft } from "../../shared/types";
import { BriefIcon, ClockIcon, PinIcon, RupeeIcon } from "../../shared/icons";

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  DRAFT: "bg-ink-100 text-ink-600 border-ink-200",
  CLOSED: "bg-red-50 text-red-600 border-red-200",
  EXPIRED: "bg-orange-50 text-orange-600 border-orange-200",
};
const STATUS_LABELS: Record<string, string> = { PUBLISHED: "Active", DRAFT: "Draft", CLOSED: "Closed", EXPIRED: "Expired" };

/* Right-rail live preview of the job being edited. */
export function JobPreviewPanel({ draft, status }: { draft: JobDraft; status: string }) {
  const skills = draft.requirements.skills.map((s) => s.name);
  const shownSkills = skills.slice(0, 3);
  const extra = skills.length - shownSkills.length;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Job Preview</h3>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT}`}>{STATUS_LABELS[status] ?? status}</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon size={22} /></div>
        <div>
          <div className="font-semibold text-[14px] text-ink-900">{draft.details.title || "Untitled Job"}</div>
          {draft.details.department && <div className="text-[12.5px] text-ink-600 font-medium mt-0.5">{draft.details.department}</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 mt-3 text-[12px] text-ink-500">
        <span className="flex items-center gap-1"><PinIcon /> {draft.details.workplaceLocation || "—"}</span>
        <span className="flex items-center gap-1"><BriefIcon /> {draft.details.employmentType || "—"}</span>
        <span className="flex items-center gap-1"><ClockIcon /> {draft.details.experienceMin || "—"}{draft.details.experienceMax ? ` - ${draft.details.experienceMax}` : ""} yrs</span>
        <span className="flex items-center gap-1"><RupeeIcon /> {draft.compensation.annualCtc || "—"}</span>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {shownSkills.map((s) => <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>)}
          {extra > 0 && <span className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">+{extra}</span>}
        </div>
      )}
    </div>
  );
}

/* Decorative rich-text toolbar (visual only — wired editor is future work). */
export function RichToolbar() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-2 border border-ink-200 border-b-0 rounded-t-lg bg-ink-100/40 text-ink-500 text-[13px] flex-wrap">
      {["B", "I", "U"].map((c) => <button key={c} type="button" className="w-7 h-7 hover:bg-white rounded font-semibold">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      {["“”", "≣", "•", "1."].map((c, i) => <button key={i} type="button" className="w-7 h-7 hover:bg-white rounded text-[11px]">{c}</button>)}
    </div>
  );
}
