"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────────
 * Edit Job — prefilled form for an existing job.
 * Mock-prefilled; ready to wire to GET/PUT /company/jobs/{id}.
 * ───────────────────────────────────────────────────────────────────────────── */
export default function EditJobPage({ jobId }: { jobId: string }) {
  const [remote, setRemote] = useState("On-site");
  const [visibility, setVisibility] = useState("Public");
  const [emailMatch, setEmailMatch] = useState(true);
  const [feature, setFeature] = useState(false);
  const [skills, setSkills] = useState(["Java", "Spring Boot", "AWS", "Microservices", "SQL", "Docker", "Kubernetes"]);
  const [languages, setLanguages] = useState(["English", "Hindi"]);
  const [benefits, setBenefits] = useState(["Health Insurance", "Annual Bonus", "Flexible Work Hours", "PF", "Gratuity"]);
  const [shortDesc, setShortDesc] = useState("We are looking for a Senior Software Engineer to design, develop and maintain scalable applications and systems.");
  const [detailDesc, setDetailDesc] = useState("As a Senior Software Engineer, you will be responsible for building high-quality software solutions, collaborating with cross-functional teams and ensuring the best performance, quality and responsiveness of applications.");

  const removeFrom = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter((prev) => prev.filter((v) => v !== value));
  const addTo = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter((prev) => (prev.includes(value) ? prev : [...prev, value]));

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-500 mb-3">
        <Link href="/company/jobs" className="hover:text-ink-800">Jobs</Link>
        <Chevron /><span className="text-ink-700">Senior Software Engineer</span>
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
              View Applications (24)
            </Link>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="card p-5 lg:p-6 space-y-8">
            {/* 1 — Job Details */}
            <section>
              <SectionHeader num={1} title="Job Details" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Job Title" required defaultValue="Senior Software Engineer" />
                <Select label="Job Function" required options={["Engineering", "Product", "Design", "Sales"]} value="Engineering" />
                <Select label="Employment Type" required options={["Full Time", "Part Time", "Contract", "Internship"]} value="Full Time" />
                <Select label="Experience Level" required options={["0 - 2 years", "2 - 5 years", "5 - 8 years", "8+ years"]} value="5 - 8 years" />
                <Select label="Notice Period" options={["Immediate", "15 - 30 days", "30 - 60 days", "60+ days"]} value="15 - 30 days" />
                <Field label="Number of Openings" required type="number" defaultValue="2" />
                <Select label="Department" options={["Engineering", "Product", "Design", "Sales", "HR"]} value="Engineering" />
                <Field label="Reports To" defaultValue="Engineering Manager" />
                <Select label="Work Location" required options={["Bangalore, India", "Hyderabad, India", "Pune, India", "Remote"]} value="Bangalore, India" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mt-4 items-start">
                <div>
                  <Label>Remote Option</Label>
                  <div className="flex items-center gap-5 mt-1">
                    {["On-site", "Hybrid", "Remote"].map((m) => (
                      <label key={m} className="inline-flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="remote" checked={remote === m} onChange={() => setRemote(m)} className="accent-brand-600" />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Job Location" required defaultValue="Bangalore, Karnataka, India" icon={<PinIcon />} />
              </div>
            </section>

            {/* 2 — Job Description */}
            <section>
              <SectionHeader num={2} title="Job Description" />
              <div>
                <Label required>Short Description</Label>
                <textarea
                  value={shortDesc} maxLength={200} rows={2}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-700 outline-none focus:border-brand-400 resize-none"
                />
                <div className="text-right text-[11px] text-ink-400">{shortDesc.length}/200</div>
              </div>
              <div className="mt-3">
                <Label required>Detailed Description</Label>
                <RichToolbar />
                <textarea
                  value={detailDesc} maxLength={5000} rows={5}
                  onChange={(e) => setDetailDesc(e.target.value)}
                  className="w-full px-3 py-3 rounded-b-lg border border-t-0 border-ink-200 text-[13.5px] text-ink-700 outline-none focus:border-brand-300 resize-y"
                />
                <div className="text-right text-[11px] text-ink-400">{detailDesc.length}/5000</div>
              </div>
            </section>

            {/* 3 — Requirements */}
            <section>
              <SectionHeader num={3} title="Requirements" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>Skills</Label>
                  <ChipField items={skills} onRemove={(v) => removeFrom(setSkills, v)} onAdd={() => addTo(setSkills, "New Skill")} addLabel="Add Skill" />
                </div>
                <Select label="Education" options={["Bachelor's Degree in Computer Science", "Master's Degree", "Any Graduate"]} value="Bachelor's Degree in Computer Science" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
                <div>
                  <Label required>Experience (Years)</Label>
                  <div className="flex items-center gap-2">
                    <BareSelect options={["0", "1", "2", "3", "5", "8"]} value="5" />
                    <span className="text-ink-500 text-[12px]">to</span>
                    <BareSelect options={["3", "5", "8", "10", "15"]} value="8" />
                    <span className="text-ink-500 text-[12.5px]">Years</span>
                  </div>
                </div>
                <div>
                  <Label>Languages</Label>
                  <ChipField items={languages} onRemove={(v) => removeFrom(setLanguages, v)} onAdd={() => addTo(setLanguages, "New Language")} addLabel="Add Language" />
                </div>
              </div>
            </section>

            {/* 4 — Compensation & Benefits */}
            <section>
              <SectionHeader num={4} title="Compensation & Benefits" />
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 items-end">
                <div>
                  <Label required>Salary Range (₹)</Label>
                  <div className="flex items-center gap-2">
                    <input defaultValue="18,00,000" className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] outline-none focus:border-brand-400" />
                    <span className="text-ink-500 text-[12px]">to</span>
                    <input defaultValue="28,00,000" className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] outline-none focus:border-brand-400" />
                  </div>
                </div>
                <Select label="" options={["Per Annum", "Per Month"]} value="Per Annum" srLabel="Pay period" />
                <Select label="Currency" options={["INR (₹)", "USD ($)", "EUR (€)"]} value="INR (₹)" />
              </div>
              <div className="mt-4">
                <Label>Additional Benefits <span className="font-normal text-ink-400">(Optional)</span></Label>
                <ChipField items={benefits} onRemove={(v) => removeFrom(setBenefits, v)} onAdd={() => addTo(setBenefits, "New Benefit")} addLabel="Add Benefit" />
              </div>
            </section>

            {/* 5 — Additional Settings */}
            <section>
              <SectionHeader num={5} title="Additional Settings" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Application Deadline</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><CalendarIcon /></span>
                    <input type="date" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-500 outline-none focus:border-brand-400" />
                  </div>
                </div>
                <Select label="Priority" options={["Low", "Medium", "High"]} value="Medium" />
                <label className="flex items-center justify-between gap-3 cursor-pointer pt-4">
                  <div className="leading-tight">
                    <div className="text-[13px] font-semibold text-ink-800">Feature this job</div>
                    <div className="text-[11.5px] text-ink-400">Featured jobs get more visibility</div>
                  </div>
                  <button type="button" onClick={() => setFeature((f) => !f)} className={`w-10 h-5.5 rounded-full transition-colors shrink-0 relative ${feature ? "bg-brand-600" : "bg-ink-200"}`} style={{ height: 22, width: 40 }} aria-pressed={feature} aria-label="Feature this job">
                    <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all ${feature ? "left-[20px]" : "left-0.5"}`} />
                  </button>
                </label>
              </div>
            </section>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-ink-100">
              <Link href="/company/jobs" className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition-colors mt-4">Cancel</Link>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity mt-4">Update Job</button>
            </div>
          </form>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full xl:w-[300px] shrink-0 space-y-4 hidden xl:block">
          <JobPreviewPanel />
          <VisibilityPanel visibility={visibility} setVisibility={setVisibility} emailMatch={emailMatch} setEmailMatch={setEmailMatch} />
          <MatchDistributionPanel />
          <QuickActionsPanel />
        </aside>
      </div>
    </div>
  );
}

/* ─── Shared form primitives ─────────────────────────────────────────────────── */
function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[12px] font-bold grid place-items-center">{num}</span>
      <h2 className="font-display text-[16px] font-extrabold text-ink-900">{title}</h2>
    </div>
  );
}
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">{children}{required && <span className="text-red-500"> *</span>}</label>;
}
function Field({ label, required, defaultValue, type = "text", icon }: { label?: string; required?: boolean; defaultValue?: string; type?: string; icon?: React.ReactNode }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input type={type} defaultValue={defaultValue} className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-800 outline-none focus:border-brand-400`} />
      </div>
    </div>
  );
}
function Select({ label, required, options, value, srLabel }: { label?: string; required?: boolean; options: string[]; value: string; srLabel?: string }) {
  return (
    <div>
      {label ? <Label required={required}>{label}</Label> : srLabel ? <span className="sr-only">{srLabel}</span> : null}
      <div className="relative">
        <select defaultValue={value} aria-label={srLabel || label} className="appearance-none w-full pl-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-800 bg-white outline-none focus:border-brand-400 cursor-pointer">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none text-[10px]">▾</span>
      </div>
    </div>
  );
}
function BareSelect({ options, value }: { options: string[]; value: string }) {
  return (
    <div className="relative flex-1">
      <select defaultValue={value} className="appearance-none w-full pl-3 pr-8 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-800 bg-white outline-none focus:border-brand-400 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}
function ChipField({ items, onRemove, onAdd, addLabel }: { items: string[]; onRemove: (v: string) => void; onAdd: () => void; addLabel: string }) {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2.5 rounded-lg border border-ink-200 min-h-[44px]">
      {items.map((it) => (
        <span key={it} className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-700 bg-ink-100 px-2 py-1 rounded-md">
          {it}
          <button type="button" onClick={() => onRemove(it)} className="text-ink-400 hover:text-red-500" aria-label={`Remove ${it}`}>✕</button>
        </span>
      ))}
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 px-2 py-1 hover:text-brand-800">
        + {addLabel}
      </button>
    </div>
  );
}
function RichToolbar() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-2 border border-ink-200 border-b-0 rounded-t-lg bg-ink-100/40 text-ink-500 text-[13px] flex-wrap">
      {["B", "I", "U"].map((c) => <button key={c} type="button" className="w-7 h-7 hover:bg-white rounded font-semibold">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      {["“”", "≣", "•", "1."].map((c, i) => <button key={i} type="button" className="w-7 h-7 hover:bg-white rounded text-[11px]">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      <button type="button" className="w-7 h-7 hover:bg-white rounded">🔗</button>
      <button type="button" className="w-7 h-7 hover:bg-white rounded">🖼</button>
    </div>
  );
}

/* ─── Right-rail panels ──────────────────────────────────────────────────────── */
function JobPreviewPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Job Preview</h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><BriefIcon big /></div>
        <div>
          <div className="font-semibold text-[14px] text-ink-900">Senior Software Engineer</div>
          <div className="flex items-center gap-1 mt-0.5"><span className="text-[12.5px] text-ink-600 font-medium">Microsoft</span><VerifiedTick /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 mt-3 text-[12px] text-ink-500">
        <span className="flex items-center gap-1"><PinIcon /> Bangalore, India</span>
        <span className="flex items-center gap-1"><BriefIcon /> Full Time</span>
        <span className="flex items-center gap-1"><ClockIcon /> 5 - 8 yrs</span>
        <span className="flex items-center gap-1"><RupeeIcon /> ₹ 18 - 28 LPA</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {["Java", "Spring Boot", "AWS", "+4"].map((s) => <span key={s} className="text-[11.5px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-md">{s}</span>)}
      </div>
      <button className="mt-4 w-full py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">View Full Preview</button>
    </div>
  );
}

function VisibilityPanel({ visibility, setVisibility, emailMatch, setEmailMatch }: { visibility: string; setVisibility: (v: string) => void; emailMatch: boolean; setEmailMatch: (v: boolean) => void }) {
  const opts = [
    { key: "Public", sub: "Visible to all candidates on the job portal" },
    { key: "Private", sub: "Only visible to invited candidates" },
    { key: "Internal", sub: "Only visible to your team" },
  ];
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Visibility Settings</h3>
      <div className="space-y-3">
        {opts.map((o) => (
          <label key={o.key} className="flex items-start gap-2.5 cursor-pointer">
            <input type="radio" name="visibility" checked={visibility === o.key} onChange={() => setVisibility(o.key)} className="accent-brand-600 mt-0.5" />
            <div className="leading-snug">
              <div className="text-[13px] font-semibold text-ink-800">{o.key}</div>
              <div className="text-[11.5px] text-ink-500">{o.sub}</div>
            </div>
          </label>
        ))}
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer mt-4 pt-4 border-t border-ink-100">
        <input type="checkbox" checked={emailMatch} onChange={(e) => setEmailMatch(e.target.checked)} className="accent-brand-600 mt-0.5 w-4 h-4" />
        <div className="leading-snug">
          <div className="text-[13px] font-semibold text-ink-800">Send email to matching candidates</div>
          <div className="text-[11.5px] text-ink-500">Recommended to increase applications</div>
        </div>
      </label>
    </div>
  );
}

const DISTRIBUTION = [
  { label: "Less than 60%", count: 3,  pct: 13, color: "#ef4444" },
  { label: "60% - 75%",     count: 7,  pct: 29, color: "#f97316" },
  { label: "75% - 89%",     count: 10, pct: 42, color: "#22c55e" },
  { label: "Above 90%",     count: 4,  pct: 16, color: "#3b82f6" },
];
function MatchDistributionPanel() {
  const max = Math.max(...DISTRIBUTION.map((d) => d.count));
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900">Candidate Match Distribution</h3>
      <p className="text-[11.5px] text-ink-400 mt-0.5 mb-3">Based on current job requirements</p>
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

const QUICK_ACTIONS = [
  { icon: <CopyIcon />, title: "Duplicate Job", sub: "Create a copy of this job", danger: false },
  { icon: <PauseIcon />, title: "Pause Job", sub: "Temporarily stop accepting applications", danger: false },
  { icon: <CloseCircleIcon />, title: "Close Job", sub: "Close this job permanently", danger: false },
  { icon: <TrashIcon />, title: "Delete Job", sub: "Permanently delete this job", danger: true },
];
function QuickActionsPanel() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Quick Actions</h3>
      <ul className="space-y-1">
        {QUICK_ACTIONS.map((a) => (
          <li key={a.title}>
            <button className="w-full flex items-start gap-2.5 text-left rounded-lg px-2 py-2 hover:bg-ink-100/60 transition-colors">
              <span className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${a.danger ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>{a.icon}</span>
              <div className="leading-tight">
                <div className={`text-[12.5px] font-semibold ${a.danger ? "text-red-600" : "text-ink-900"}`}>{a.title}</div>
                <div className="text-[11px] text-ink-500">{a.sub}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function BriefIcon({ big }: { big?: boolean }) { const s = big ? 22 : 12; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>); }
function PinIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>); }
function ClockIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>); }
function RupeeIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12M6 8h12M9 4c4 0 6 3 6 6s-2 6-6 6h-3l6 6" /></svg>); }
function CalendarIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>); }
function VerifiedTick() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" className="shrink-0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>); }
function Chevron() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>); }
function CopyIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>); }
function PauseIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>); }
function CloseCircleIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>); }
function TrashIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m1 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" /></svg>); }
