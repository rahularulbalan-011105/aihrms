"use client";

import { useState } from "react";
import JobStepper from "../shared/JobStepper";
import RightRail from "../shared/RightRail";
import type { JobDraft } from "../shared/types";

interface Props {
  data: JobDraft;
  onBack: () => void;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
  onPublish: () => void;
}

export default function Step5ReviewPublish({ data, onBack, onEdit, onPublish }: Props) {
  const [confirm, setConfirm] = useState(true);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button onClick={onBack} className="px-3.5 py-2 rounded-lg border border-ink-200 text-ink-700 text-[12.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-1.5">
          <ArrowLeft /> Back to Preferences
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-[22px] font-extrabold">Post a New Job</h1>
          <p className="text-ink-500 text-[12.5px]">Review all details before publishing your job.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13px] font-semibold hover:bg-ink-100 transition">Save Draft</button>
          <button onClick={onPublish} disabled={!confirm}
            className={`px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2 ${confirm ? "" : "opacity-50 cursor-not-allowed"}`}
            style={{ background: "var(--gradient-brand)" }}>
            Publish Job <PaperPlane />
          </button>
        </div>
      </div>

      <div className="mb-6"><JobStepper current={5} /></div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          {/* Job Details */}
          <SectionCard icon={<BriefIcon />} title="Job Details" onEdit={() => onEdit(1)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
              <Field label="Job Title"          value={data.details.title || "—"} />
              <Field label="Department"         value={data.details.department || "—"} />
              <Field label="Work Location"      value={`${data.details.workplaceLocation || "—"}${data.details.workMode ? ` (${data.details.workMode})` : ""}`} />
              <Field label="Role / Category"    value={data.details.roleCategory || "—"} />
              <Field label="Employment Type"    value={data.details.employmentType || "—"} />
              <Field label="Number of Openings" value={String(data.details.openings || 1)} />
            </div>
          </SectionCard>

          {/* Job Description */}
          <SectionCard icon={<DocIcon />} title="Job Description" onEdit={() => onEdit(1)}>
            <p className="text-[13px] text-ink-700">
              {data.details.description?.trim() || "Design, develop and maintain scalable web applications..."}
            </p>
            <p className="text-[11.5px] text-ink-400 italic mt-1.5">(Full description will be visible in job post)</p>
          </SectionCard>

          {/* Requirements */}
          <SectionCard icon={<UsersIcon />} title="Requirements" onEdit={() => onEdit(2)} iconBg="bg-green-50 text-green-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
              <Field label="Skills"            value={data.requirements.skills.slice(0, 4).map((s) => s.name).join(", ") || "—"} />
              <Field label="Mandatory Skills"  value={data.requirements.skills.slice(0, 3).map((s) => `${s.name} (${s.years}+ Yrs)`).join(", ") || "—"} />
              <Field label="Preferred Skills"  value="Microservices, Docker, Kubernetes" />
              <Field label="Experience"        value={`${data.requirements.minExperience} - ${data.requirements.minExperience + 3} Years Overall Experience`} />
              <Field label="Education"         value={data.details.educationQualification || "Bachelor's Degree"} />
              <Field label="Certifications"    value="AWS Certified Developer (Preferred)" />
            </div>
          </SectionCard>

          {/* Compensation */}
          <SectionCard icon={<RupeeIcon />} title="Compensation" onEdit={() => onEdit(3)} iconBg="bg-orange-50 text-orange-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
              <Field label="Salary Type"        value={data.compensation.salaryType === "Fixed CTC" ? "Annual (CTC)" : data.compensation.salaryType} />
              <Field label="Salary Range"       value={`₹ ${data.compensation.annualCtc} – ₹ 18,00,000 per annum`} />
              <Field label="Other Components"   value={`Variable Pay (₹ ${data.compensation.variablePay}), Performance Bonus (₹ 50,000)`} />
              <Field label="Currency"           value="INR" />
              <Field label="Total CTC"          value={`₹ ${data.compensation.annualCtc} per annum`} />
              <Field label="Additional Benefits" value="Health Insurance, PF, Flexible Working, Paid Time Off" />
            </div>
          </SectionCard>

          {/* Preferences */}
          <SectionCard icon={<SlidersIcon />} title="Preferences" onEdit={() => onEdit(4)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
              <Field label="Work Mode"         value={data.preferences.workArrangement} />
              <Field label="Notice Period"     value={data.preferences.noticePeriods.join(", ") || "—"} />
              <Field label="Willing to Relocate" value="No" />
              <Field label="Remote Work Policy" value={data.preferences.workArrangement === "Remote" ? "Fully remote" : "Open to remote candidates"} />
              <Field label="Availability / Earliest Joining" value="01 Jul 2024" />
            </div>
          </SectionCard>

          {/* Confirmation */}
          <div className="rounded-xl border border-ink-100 p-4 bg-white flex items-start gap-3">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)}
              className="accent-brand-600 w-4 h-4 mt-0.5" />
            <span className="text-[12.5px] text-ink-700">
              I confirm that all the information provided is accurate and complies with company policies and applicable laws.
            </span>
          </div>

          {/* Bottom buttons */}
          <div className="flex items-center justify-between pt-3">
            <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-2">
              <ArrowLeft /> Previous: Preferences
            </button>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">Save as Draft</button>
              <button onClick={onPublish} disabled={!confirm}
                className={`px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold inline-flex items-center gap-2 ${confirm ? "" : "opacity-50 cursor-not-allowed"}`}
                style={{ background: "var(--gradient-brand)" }}>
                Publish Job <PaperPlane />
              </button>
            </div>
          </div>
        </div>

        <RightRail
          current={5}
          data={data}
          tips={{
            title: "Tips for a great job post",
            tips: ["All details look good!", "Review one last time for accuracy", "An attractive job post gets better candidates"],
          }}
        />
      </div>
    </div>
  );
}

function SectionCard({ icon, iconBg = "bg-brand-50 text-brand-700", title, onEdit, children }: { icon: React.ReactNode; iconBg?: string; title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-ink-100 rounded-xl">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-md grid place-items-center ${iconBg}`}>{icon}</span>
          <h2 className="font-display text-[16px] font-extrabold">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="text-[12.5px] text-brand-700 font-semibold inline-flex items-center gap-1.5">
            <EditIcon /> Edit
          </button>
          <button className="text-ink-400 w-6 h-6 grid place-items-center">▾</button>
        </div>
      </div>
      <div className="px-5 pb-4 pt-3">{children}</div>
    </section>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11.5px] font-semibold text-ink-500">{label}</div>
      <div className="text-[13px] text-ink-900 font-medium mt-0.5">{value}</div>
    </div>
  );
}

/* Icons */
function BriefIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function DocIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function UsersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function RupeeIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4h12M6 8h12M9 4c4 0 6 3 6 6s-2 6-6 6h-3l6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function SlidersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 17h16M9 7v0a2 2 0 0 0 0 4M15 17v0a2 2 0 0 0 0-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function EditIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4-11 11H5v-4L16 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function ArrowLeft() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function PaperPlane() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-8-8 18-3-7-7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
