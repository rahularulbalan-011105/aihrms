import Link from "next/link";
import type { JobApiResponse } from "../../services/job.service";
import { formatDate, formatExperience, formatSalary } from "../../shared/format";
import { BriefIcon, ClockIcon, KebabIcon, PinIcon, RupeeIcon } from "../../shared/icons";
import { JobStatusBadge } from "../JobStatusBadge";

/* One job row in the Jobs list. Clicking the card selects it. */
export function JobCard({ job, selected, onSelect }: { job: JobApiResponse; selected?: boolean; onSelect?: () => void }) {
  const skills = job.skills ?? []; // backend may not expose skills until redeployed
  const skillChips = skills.slice(0, 4);
  const extraSkills = skills.length - skillChips.length;
  return (
    <div
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`card p-4 relative overflow-hidden transition-all cursor-pointer ${selected ? "border-brand-500 ring-2 ring-brand-200 bg-brand-50/50 shadow-sm" : "hover:border-brand-300"}`}
    >
      {selected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600" aria-hidden="true" />}
      <button className="absolute top-3.5 right-3.5 text-ink-300 hover:text-ink-600 transition-colors" aria-label="More options">
        <KebabIcon size={18} />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:pr-6">
        {/* Identity */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon size={22} /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[14.5px] text-ink-900">{job.title}</span>
              <JobStatusBadge status={job.status} />
            </div>
            {job.department && <div className="text-[13px] text-ink-600 font-medium mt-0.5">{job.department}</div>}
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><PinIcon />{job.workplaceLocation || "—"}{job.workMode ? ` · ${job.workMode}` : ""}</span>
              <span className="flex items-center gap-1"><BriefIcon />{job.employmentType || "—"}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[12px] text-ink-500 flex-wrap">
              <span className="flex items-center gap-1"><ClockIcon />{formatExperience(job.experienceMinYears, job.experienceMaxYears)}</span>
              <span className="flex items-center gap-1"><RupeeIcon />{formatSalary(job.annualCtc, job.currency)}</span>
            </div>
            {skillChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {skillChips.map((s) => (
                  <span key={s.name} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s.name}</span>
                ))}
                {extraSkills > 0 && (
                  <span className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">+{extraSkills}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Posted + openings */}
        <div className="flex lg:flex-col gap-x-6 gap-y-2 lg:w-[120px] shrink-0 text-[12px]">
          <div><span className="text-ink-400">Posted on</span><div className="font-semibold text-ink-700">{formatDate(job.publishedAt ?? job.createdAt)}</div></div>
          <div><span className="text-ink-400">Openings</span><div className="font-display font-extrabold text-[18px] text-ink-900 leading-none mt-0.5">{job.openings}</div></div>
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 lg:w-[150px] shrink-0">
          <Link href={`/company/jobs/${job.id}/applications`} onClick={(e) => e.stopPropagation()} className="flex-1 text-center text-[12.5px] font-semibold text-brand-600 border border-brand-300 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
            View Applications
          </Link>
          <Link href={`/company/jobs/${job.id}/edit`} onClick={(e) => e.stopPropagation()} className="flex-1 text-center text-[12.5px] font-semibold text-ink-700 border border-ink-200 px-4 py-2 rounded-xl hover:bg-ink-100 transition-colors whitespace-nowrap">
            Edit Job
          </Link>
        </div>
      </div>
    </div>
  );
}
