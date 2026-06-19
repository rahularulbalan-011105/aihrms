"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchJobFull,
  responseToDraft,
  updateJob,
  type JobFullDetail,
} from "./services/job.service";
import type { JobDraft } from "./shared/types";
import { ChipField, Field, Label, SectionHeader, Select } from "./shared/forms";
import { CalendarIcon, Chevron, PinIcon } from "./shared/icons";
import { JobPreviewPanel, RichToolbar } from "./components/edit-job/JobPreviewPanel";

/* ─────────────────────────────────────────────────────────────────────────────
 * Edit Job — loads GET /company/jobs/{id}, edits a controlled JobDraft, saves
 * via PUT /company/jobs/{id}.
 * ───────────────────────────────────────────────────────────────────────────── */
export default function EditJobPage({ jobId }: { jobId: string }) {
  const router = useRouter();
  const fetched = useRef(false);

  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [status, setStatus] = useState<JobFullDetail["status"]>("DRAFT");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (fetched.current) return; // guard React StrictMode double-invoke
    fetched.current = true;
    fetchJobFull(jobId)
      .then((detail) => {
        setDraft(responseToDraft(detail));
        setStatus(detail.status);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setLoading(false));
  }, [jobId]);

  /* Section updaters — keep state changes localized and readable. */
  const setDetails = (patch: Partial<JobDraft["details"]>) =>
    setDraft((prev) => (prev ? { ...prev, details: { ...prev.details, ...patch } } : prev));
  const setRequirements = (patch: Partial<JobDraft["requirements"]>) =>
    setDraft((prev) => (prev ? { ...prev, requirements: { ...prev.requirements, ...patch } } : prev));
  const setCompensation = (patch: Partial<JobDraft["compensation"]>) =>
    setDraft((prev) => (prev ? { ...prev, compensation: { ...prev.compensation, ...patch } } : prev));

  const addSkill = (name: string) =>
    setRequirements({
      skills: draft && draft.requirements.skills.some((s) => s.name === name)
        ? draft.requirements.skills
        : [...(draft?.requirements.skills ?? []), { id: Date.now().toString(), name, years: 0 }],
    });
  const removeSkill = (name: string) =>
    setRequirements({ skills: (draft?.requirements.skills ?? []).filter((s) => s.name !== name) });
  const addBenefit = (value: string) =>
    setCompensation({
      benefits: draft?.compensation.benefits.includes(value)
        ? draft.compensation.benefits
        : [...(draft?.compensation.benefits ?? []), value],
    });
  const removeBenefit = (value: string) =>
    setCompensation({ benefits: (draft?.compensation.benefits ?? []).filter((b) => b !== value) });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateJob(jobId, draft);
      router.push("/company/jobs");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update job");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="px-4 py-16 text-center text-ink-400 text-[13px]">Loading job…</div>;
  }
  if (loadError || !draft) {
    return (
      <div className="px-4 py-3 max-w-[1400px] mx-auto">
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
          {loadError ?? "Job not found."}
        </div>
        <Link href="/company/jobs" className="inline-block mt-4 text-[13px] font-semibold text-brand-600 hover:text-brand-800">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const skillNames = draft.requirements.skills.map((s) => s.name);

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-500 mb-3">
        <Link href="/company/jobs" className="hover:text-ink-800">Jobs</Link>
        <Chevron /><span className="text-ink-700">{draft.details.title || "Untitled Job"}</span>
        <Chevron /><span className="text-brand-700 font-semibold">Edit Job</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Form column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Edit Job</h1>
              <p className="text-ink-500 text-[13.5px] mt-1">Update your job details and attract the right candidates.</p>
            </div>
            <Link href={`/company/jobs/${jobId}/applications`} className="shrink-0 text-[13px] font-semibold text-brand-600 border border-brand-300 px-4 py-2.5 rounded-xl hover:bg-brand-50 transition-colors">
              View Applications
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="card p-5 lg:p-6 space-y-8">
            {/* 1 — Job Details */}
            <section>
              <SectionHeader num={1} title="Job Details" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Job Title" required value={draft.details.title} onChange={(v) => setDetails({ title: v })} />
                <Select label="Job Function" options={["Engineering", "Product", "Design", "Sales", "Marketing"]} value={draft.details.roleCategory} onChange={(v) => setDetails({ roleCategory: v })} />
                <Select label="Employment Type" required options={["Full-time", "Part-time", "Contract", "Internship", "Freelance"]} value={draft.details.employmentType} onChange={(v) => setDetails({ employmentType: v })} />
                <Select label="Experience Level" options={["Entry Level", "Junior", "Mid Level", "Senior", "Lead"]} value={draft.requirements.experienceLevel} onChange={(v) => setRequirements({ experienceLevel: v })} />
                <Select label="Notice Period" options={["Immediate", "15 Days", "30 Days", "60 Days", "90 Days"]} value={draft.details.noticePeriod} onChange={(v) => setDetails({ noticePeriod: v })} />
                <Field label="Number of Openings" required type="number" value={String(draft.details.openings)} onChange={(v) => setDetails({ openings: Number(v) || 0 })} />
                <Select label="Department" options={["Engineering", "Product", "Design", "Sales", "HR"]} value={draft.details.department} onChange={(v) => setDetails({ department: v })} />
                <Field label="Industry" value={draft.details.industry} onChange={(v) => setDetails({ industry: v })} />
                <Field label="Work Location" required value={draft.details.workplaceLocation} onChange={(v) => setDetails({ workplaceLocation: v })} icon={<PinIcon />} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mt-4 items-start">
                <div>
                  <Label>Remote Option</Label>
                  <div className="flex items-center gap-5 mt-1">
                    {(["On-site", "Hybrid", "Remote"] as const).map((m) => (
                      <label key={m} className="inline-flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="remote" checked={draft.details.workMode === m} onChange={() => setDetails({ workMode: m })} className="accent-brand-600" />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Job Shift" value={draft.details.jobShift} onChange={(v) => setDetails({ jobShift: v })} />
              </div>
            </section>

            {/* 2 — Job Description */}
            <section>
              <SectionHeader num={2} title="Job Description" />
              <div>
                <Label required>Description</Label>
                <RichToolbar />
                <textarea
                  value={draft.details.description} maxLength={5000} rows={6}
                  onChange={(e) => setDetails({ description: e.target.value })}
                  className="w-full px-3 py-3 rounded-b-lg border border-t-0 border-ink-200 text-[13.5px] text-ink-700 outline-none focus:border-brand-300 resize-y"
                />
                <div className="text-right text-[11px] text-ink-400">{draft.details.description.length}/5000</div>
              </div>
              <div className="mt-3">
                <Label>Key Responsibilities</Label>
                <textarea
                  value={draft.requirements.responsibilities} maxLength={3000} rows={4}
                  onChange={(e) => setRequirements({ responsibilities: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-700 outline-none focus:border-brand-400 resize-y"
                />
              </div>
            </section>

            {/* 3 — Requirements */}
            <section>
              <SectionHeader num={3} title="Requirements" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>Skills</Label>
                  <ChipField items={skillNames} onRemove={removeSkill} onAdd={addSkill} placeholder="Add a skill + Enter" />
                </div>
                <Field label="Education" value={draft.details.educationQualification} onChange={(v) => setDetails({ educationQualification: v })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
                <div>
                  <Label>Experience (Years)</Label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={draft.details.experienceMin} onChange={(e) => setDetails({ experienceMin: e.target.value })} aria-label="Minimum experience years" className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] outline-none focus:border-brand-400" />
                    <span className="text-ink-500 text-[12px]">to</span>
                    <input type="number" min={0} value={draft.details.experienceMax} onChange={(e) => setDetails({ experienceMax: e.target.value })} aria-label="Maximum experience years" className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] outline-none focus:border-brand-400" />
                    <span className="text-ink-500 text-[12.5px]">Years</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 — Compensation & Benefits */}
            <section>
              <SectionHeader num={4} title="Compensation & Benefits" />
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 items-end">
                <Field label="Annual CTC (₹)" value={draft.compensation.annualCtc} onChange={(v) => setCompensation({ annualCtc: v })} />
                <Select label="Salary Type" options={["Fixed CTC", "Salary Range"]} value={draft.compensation.salaryType} onChange={(v) => setCompensation({ salaryType: v as JobDraft["compensation"]["salaryType"] })} />
                <Select label="Currency" options={["INR (₹)", "USD ($)", "EUR (€)"]} value={draft.compensation.currency} onChange={(v) => setCompensation({ currency: v })} />
              </div>
              <div className="mt-4">
                <Label>Additional Benefits <span className="font-normal text-ink-400">(Optional)</span></Label>
                <ChipField items={draft.compensation.benefits} onRemove={removeBenefit} onAdd={addBenefit} placeholder="Add a benefit + Enter" />
              </div>
            </section>

            {/* 5 — Additional Settings */}
            <section>
              <SectionHeader num={5} title="Additional Settings" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Application Deadline</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><CalendarIcon size={14} /></span>
                    <input type="date" value={draft.details.applicationDeadline} onChange={(e) => setDetails({ applicationDeadline: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-500 outline-none focus:border-brand-400" />
                  </div>
                </div>
                <div>
                  <Label>Job Expiry</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><CalendarIcon size={14} /></span>
                    <input type="date" value={draft.details.jobExpiry} onChange={(e) => setDetails({ jobExpiry: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-500 outline-none focus:border-brand-400" />
                  </div>
                </div>
                <label className="flex items-center justify-between gap-3 cursor-pointer pt-4">
                  <div className="leading-tight">
                    <div className="text-[13px] font-semibold text-ink-800">Confidential Job</div>
                    <div className="text-[11.5px] text-ink-400">Hide company name from candidates</div>
                  </div>
                  <button type="button" onClick={() => setDetails({ confidential: draft.details.confidential === "Yes" ? "No" : "Yes" })} className={`rounded-full transition-colors shrink-0 relative ${draft.details.confidential === "Yes" ? "bg-brand-600" : "bg-ink-200"}`} style={{ height: 22, width: 40 }} aria-pressed={draft.details.confidential === "Yes"} aria-label="Confidential job">
                    <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all ${draft.details.confidential === "Yes" ? "left-[20px]" : "left-0.5"}`} />
                  </button>
                </label>
              </div>
            </section>

            {saveError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{saveError}</div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-ink-100">
              <Link href="/company/jobs" className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition-colors mt-4">Cancel</Link>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? "Updating…" : "Update Job"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full xl:w-[300px] shrink-0 space-y-4 hidden xl:block">
          <JobPreviewPanel draft={draft} status={status} />
        </aside>
      </div>
    </div>
  );
}
