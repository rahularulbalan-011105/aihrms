"use client";

import { useEffect, useState } from "react";
import JobStepper from "../shared/JobStepper";
import RightRail from "../shared/RightRail";
import { WORKPLACE_LOCATIONS, DEPARTMENTS } from "../shared/constants";
import type { JobDraft, JobDetailsData } from "../shared/types";
import { listClients, type ClientSummaryResponse } from "@/modules/company/clients/services/client.service";

interface Props {
  data: JobDraft;
  onChange: (d: JobDraft) => void;
  onCancel: () => void;
  onContinue: () => void;
}

type FieldErrors = Partial<Record<keyof JobDetailsData, string>>;

export default function Step1JobDetails({ data, onChange, onCancel, onContinue }: Props) {
  const d = data.details;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [clients, setClients] = useState<ClientSummaryResponse[]>([]);

  useEffect(() => {
    listClients(0, 100)
      .then(({ content }) => setClients(content))
      .catch(() => {}); // non-fatal — dropdown stays empty if clients fail to load
  }, []);

  const set = <K extends keyof JobDetailsData>(k: K, v: JobDetailsData[K]) => {
    onChange({ ...data, details: { ...d, [k]: v } });
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!d.title.trim())             next.title = "Job title is required";
    if (!d.clientId)                 next.clientId = "Client is required";
    if (!d.workplaceLocation.trim()) next.workplaceLocation = "Workplace location is required";
    if (!d.description.trim())       next.description = "Job description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleContinue = () => {
    if (validate()) onContinue();
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header strip */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="text-center flex-1">
          <h1 className="font-display text-[22px] font-extrabold">Post a New Job</h1>
          <p className="text-ink-500 text-[12.5px]">Fill in the details to attract the right candidates.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleContinue} className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
            Next: Requirements <ArrowRight />
          </button>
        </div>
      </div>

      <div className="mb-6"><JobStepper current={1} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* MAIN */}
        <div className="space-y-4">
          {/* Job Details */}
          <Card>
            <Header icon={<BriefIcon />} title="Job Details" subtitle="Provide the basic information about the job role." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Job Title" required value={d.title} onChange={(v) => set("title", v)} placeholder="e.g. Senior Software Engineer" error={errors.title} />
              <ClientSelect value={d.clientId} onChange={(v) => set("clientId", v)} clients={clients} error={errors.clientId} />
              <Select label="Job Role / Category (Optional)" value={d.roleCategory} onChange={(v) => set("roleCategory", v)} placeholder="Select role / category" options={["Software Development", "Product", "Design", "Marketing"]} />
              <Select label="Department" value={d.department} onChange={(v) => set("department", v)} placeholder="Select department" options={DEPARTMENTS} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 mt-4 items-end">
              <div>
                <Label required>Employment Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                    <Pill key={t} active={d.employmentType === t} onClick={() => set("employmentType", t)}>{t}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <Label required>Number of Openings</Label>
                <div className="flex items-center justify-between border border-ink-200 rounded-lg px-1">
                  <button onClick={() => set("openings", Math.max(1, d.openings - 1))} className="w-9 h-9 rounded-md hover:bg-ink-100 text-ink-700">−</button>
                  <span className="text-[14px] font-semibold">{d.openings}</span>
                  <button onClick={() => set("openings", d.openings + 1)} className="w-9 h-9 rounded-md hover:bg-ink-100 text-ink-700">+</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select label="Workplace / Office Location" required value={d.workplaceLocation} onChange={(v) => set("workplaceLocation", v)} placeholder="Select city, state or country" options={WORKPLACE_LOCATIONS} error={errors.workplaceLocation} />
              <DateField label="Proposed Starting Date" required value={d.startingDate} onChange={(v) => set("startingDate", v)} />
            </div>

            <div className="mt-3 flex items-center gap-5">
              {(["On-site", "Remote", "Hybrid"] as const).map((m) => (
                <label key={m} className="inline-flex items-center gap-2 text-[12.5px] cursor-pointer">
                  <input type="radio" name="mode" checked={d.workMode === m} onChange={() => set("workMode", m)} className="accent-brand-600" />
                  {m}
                </label>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <Label required>Job Description</Label>
                <button className="text-[11.5px] text-brand-700 font-semibold inline-flex items-center gap-1"><SparkIcon /> Ask AI</button>
              </div>
              <RichTextStub />
              <textarea
                value={d.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the role, responsibilities, expectations, and what makes this role exciting..."
                className="w-full min-h-[110px] mt-0 p-3 rounded-b-lg border border-ink-200 border-t-0 text-[13.5px] focus:outline-none focus:border-brand-300 placeholder:text-ink-400 resize-y"
                maxLength={3000}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.description ? <span role="alert" className="text-[11px] text-red-500">{errors.description}</span> : <span />}
                <span className="text-[11px] text-ink-400">{d.description.length}/3000</span>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <Card>
            <Header icon={<DocIcon />} title="Additional Details" subtitle="Add more information to help candidates understand the role better." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select label="Experience Required" required value={d.experienceRange} onChange={(v) => set("experienceRange", v)} placeholder="Select experience range" options={["Fresher", "1-3 Years", "3-6 Years", "6-10 Years", "10+ Years"]} />
              <div>
                <Label required>Overall Experience (Years)</Label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <Select value={d.experienceMin} onChange={(v) => set("experienceMin", v)} placeholder="Min" options={["0", "1", "2", "3", "5", "8", "10"]} />
                  <span className="text-ink-500 text-[12px]">to</span>
                  <Select value={d.experienceMax} onChange={(v) => set("experienceMax", v)} placeholder="Max" options={["1", "3", "5", "8", "10", "15"]} />
                </div>
              </div>
              <Select label="Notice Period" value={d.noticePeriod} onChange={(v) => set("noticePeriod", v)} placeholder="Select notice period" options={["Immediate", "15 Days", "30 Days", "60 Days", "90+ Days"]} />

              <Select label="Education Qualification" value={d.educationQualification} onChange={(v) => set("educationQualification", v)} placeholder="Select qualification (Optional)" options={["Bachelor's Degree", "Master's Degree", "PhD", "Diploma"]} />
              <Select label="Industry" value={d.industry} onChange={(v) => set("industry", v)} placeholder="Select industry (Optional)" options={["IT Services", "Product", "Banking", "Healthcare", "Education"]} />
              <Select label="Job Shift (Optional)" value={d.jobShift} onChange={(v) => set("jobShift", v)} placeholder="Select shift" options={["General Shift", "Night Shift", "Rotational"]} />

              <DateField label="Application Deadline (Optional)" value={d.applicationDeadline} onChange={(v) => set("applicationDeadline", v)} />
              <DateField label="Job Expiry (Optional)" value={d.jobExpiry} onChange={(v) => set("jobExpiry", v)} />
              <div>
                <Label>Is this a Confidential Job? <Info /></Label>
                <div className="flex gap-2">
                  {(["Yes", "No"] as const).map((y) => (
                    <button key={y} onClick={() => set("confidential", y)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-[12.5px] font-semibold transition ${
                        d.confidential === y ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-700 hover:border-ink-300"
                      }`}>{y}</button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">Cancel</button>
            <button onClick={handleContinue} className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
              Next: Requirements <ArrowRight />
            </button>
          </div>
        </div>

        <RightRail
          current={1}
          data={data}
          showJobSummary={false}
          showProgress={false}
          tips={{
            title: "Tips for a great job post",
            tips: ["Use a clear and specific job title", "Add key skills and experience", "Mention salary range (recommended)", "Highlight growth and benefits", "Keep the description concise and easy to read"],
          }}
        />
      </div>
    </div>
  );
}

/* ─── Shared primitives ─── */
function Card({ children }: { children: React.ReactNode }) {
  return <section className="bg-white border border-ink-100 rounded-xl p-5">{children}</section>;
}
function Header({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="w-9 h-9 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">{icon}</span>
      <div className="leading-tight">
        <h2 className="font-display text-[16px] font-extrabold">{title}</h2>
        {subtitle && <p className="text-ink-500 text-[12.5px] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>;
}
function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <span role="alert" className="block text-[11px] text-red-500 mt-1">{error}</span>;
}
function Field({ label, required, value, onChange, placeholder, error }: { label?: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-lg border text-[13.5px] focus:outline-none placeholder:text-ink-400 ${error ? "border-red-400 focus:border-red-400" : "border-ink-200 focus:border-brand-400"}`} />
      <ErrorText error={error} />
    </div>
  );
}
function Select({ label, required, value, onChange, placeholder, options, error }: { label?: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; options: string[]; error?: string }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 pr-9 py-2.5 rounded-lg border text-[13.5px] bg-white focus:outline-none ${error ? "border-red-400 focus:border-red-400" : "border-ink-200 focus:border-brand-400"} ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
      <ErrorText error={error} />
    </div>
  );
}
function ClientSelect({ value, onChange, clients, error }: { value: string; onChange: (v: string) => void; clients: ClientSummaryResponse[]; error?: string }) {
  return (
    <div>
      <Label required>Client</Label>
      <div className="relative">
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 pr-9 py-2.5 rounded-lg border text-[13.5px] bg-white focus:outline-none ${error ? "border-red-400 focus:border-red-400" : "border-ink-200 focus:border-brand-400"} ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}>
          <option value="" disabled>{clients.length ? "Select client" : "No clients available"}</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.clientName}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
      <ErrorText error={error} />
    </div>
  );
}
function DateField({ label, required, value, onChange }: { label: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <input type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 ${value ? "text-ink-900" : "text-ink-400"}`} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalIcon /></span>
      </div>
    </div>
  );
}
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold border transition ${
      active ? "bg-brand-50 text-brand-700 border-brand-300" : "bg-white text-ink-700 border-ink-200 hover:border-ink-300"
    }`}>{children}</button>
  );
}
function RichTextStub() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-2 border border-ink-200 border-b-0 rounded-t-lg bg-ink-100/40 text-ink-500 text-[13px]">
      {["B", "I", "U", "S"].map((c) => <button key={c} className="w-7 h-7 hover:bg-white rounded font-semibold">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      {["≡", "≣", "⫶", "≣"].map((c, i) => <button key={i} className="w-7 h-7 hover:bg-white rounded">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      {[<LinkIcon key="l"/>, <ImageIcon key="i"/>, <CodeIcon key="c"/>, <ExpandIcon key="e"/>].map((ic, i) => <button key={i} className="w-7 h-7 hover:bg-white rounded grid place-items-center">{ic}</button>)}
    </div>
  );
}

/* Icons */
function BriefIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function DocIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function ArrowRight() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function CalIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function SparkIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function Info() { return (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="inline ml-0.5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
function LinkIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M10 14l4-4M14 7l1.5-1.5a4 4 0 1 1 5.7 5.7L19 13M10 17l-1.5 1.5a4 4 0 1 1-5.7-5.7L5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function ImageIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M21 16l-5-5-10 9" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function CodeIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ExpandIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 15v5h-5M4 15v5h5M20 9V4h-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
