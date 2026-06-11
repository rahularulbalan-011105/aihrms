"use client";

import JobStepper from "../shared/JobStepper";
import type { JobDraft, PreferencesStepData } from "../shared/types";

interface Props {
  data: JobDraft;
  onChange: (d: JobDraft) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ARRANGEMENTS = [
  { key: "On-site", caption: "Candidate will work from office location.",      icon: <BuildingIcon /> },
  { key: "Remote",  caption: "Candidate can work from any location.",          icon: <GlobeIcon /> },
  { key: "Hybrid",  caption: "Combination of office and remote work.",         icon: <SwitchIcon /> },
] as const;

const SENIORITY = [
  { key: "Entry Level",    years: "0 - 1 Years"  },
  { key: "Early Career",   years: "1 - 3 Years"  },
  { key: "Mid Level",      years: "3 - 6 Years"  },
  { key: "Senior Level",   years: "6 - 10 Years" },
  { key: "Lead / Manager", years: "10+ Years"    },
] as const;

const EMP_TYPES   = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const NOTICE_OPTS = ["Immediate", "15 Days", "30 Days", "60 Days", "90+ Days"];

export default function Step4Preferences({ data, onChange, onBack, onContinue }: Props) {
  const p = data.preferences;
  const set = <K extends keyof PreferencesStepData>(k: K, v: PreferencesStepData[K]) =>
    onChange({ ...data, preferences: { ...p, [k]: v } });

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button onClick={onBack} className="px-3.5 py-2 rounded-lg border border-ink-200 text-ink-700 text-[12.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-1.5">
          <ArrowLeft /> Back to Compensation
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-[22px] font-extrabold">Post a New Job</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-2"><DraftIcon /> Save as Draft</button>
          <button onClick={onContinue} className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
            Next: Review & Publish <ArrowRight />
          </button>
        </div>
      </div>

      <div className="mb-6"><JobStepper current={4} /></div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          {/* Job Preferences card */}
          <Card>
            <Header icon={<SlidersIcon />} title="Job Preferences" subtitle="Set preferences to find the best-fit candidates for this role." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Work Arrangement */}
              <div>
                <h3 className="font-display font-bold text-[13.5px]">Work Arrangement</h3>
                <p className="text-[11.5px] text-ink-500 mb-3">Where and how the candidate will work.</p>
                <div className="grid grid-cols-3 gap-2">
                  {ARRANGEMENTS.map((a) => {
                    const active = p.workArrangement === a.key;
                    return (
                      <button key={a.key} onClick={() => set("workArrangement", a.key)}
                        className={`text-left rounded-lg border p-2.5 transition ${
                          active ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300"
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`w-4 h-4 rounded-full border-2 grid place-items-center ${active ? "border-brand-600" : "border-ink-300"}`}>
                            {active && <span className="w-2 h-2 rounded-full bg-brand-600" />}
                          </span>
                          <span className={`w-7 h-7 rounded-md grid place-items-center ${active ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-700"}`}>{a.icon}</span>
                        </div>
                        <div className={`text-[12px] font-bold ${active ? "text-brand-700" : "text-ink-900"}`}>{a.key}</div>
                        <div className="text-[10.5px] text-ink-500 leading-tight">{a.caption}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Label required>Work Location</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><PinIcon /></span>
                    <input value={p.workLocation} onChange={(e) => set("workLocation", e.target.value)}
                      className="w-full pl-9 pr-16 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400" />
                    <button onClick={() => set("workLocation", "")} className="absolute right-9 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 text-[14px]">✕</button>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
                  </div>
                </div>
              </div>

              {/* Job Shift & Timing */}
              <div>
                <h3 className="font-display font-bold text-[13.5px]">Job Shift & Timing</h3>
                <p className="text-[11.5px] text-ink-500 mb-3">Define the working hours and availability.</p>
                <div className="space-y-3">
                  <Select label="Job Shift" value={p.jobShift} onChange={(v) => set("jobShift", v)} options={["General Shift", "Night Shift", "Rotational"]} />
                  <Select label="Working Hours" value={p.workingHours} onChange={(v) => set("workingHours", v)} options={["9:00 AM - 6:00 PM", "10:00 AM - 7:00 PM", "Flexible"]} />
                  <Select label="Time Zone" value={p.timeZone} onChange={(v) => set("timeZone", v)} options={["(GMT+05:30) India Standard Time (IST)", "(GMT+00:00) UTC", "(GMT-05:00) New York"]} />
                </div>
              </div>
            </div>
          </Card>

          {/* Experience & Seniority Preferences */}
          <Card>
            <h3 className="font-display font-bold text-[14px]">Experience & Seniority Preferences</h3>
            <p className="text-[11.5px] text-ink-500 mb-3">Choose the experience level you are looking for.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {SENIORITY.map((s) => {
                const active = p.seniority === s.key;
                return (
                  <button key={s.key} onClick={() => set("seniority", s.key)}
                    className={`text-left rounded-lg border p-3 transition ${
                      active ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300"
                    }`}>
                    <span className={`w-7 h-7 rounded-full ${active ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-700"} grid place-items-center mb-1.5`}><UserIcon /></span>
                    <div className={`text-[12px] font-bold ${active ? "text-brand-700" : "text-ink-900"}`}>{s.key}</div>
                    <div className="text-[10.5px] text-ink-500">{s.years}</div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {/* Employment Type */}
              <div>
                <h4 className="font-display font-bold text-[13px]">Employment Type</h4>
                <p className="text-[11px] text-ink-500 mb-2">Select the type of employment.</p>
                <ul className="space-y-1.5">
                  {EMP_TYPES.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[12.5px]">
                      <input type="checkbox" className="accent-brand-600 w-4 h-4"
                        checked={p.employmentTypes.includes(t)}
                        onChange={() => set("employmentTypes", toggle(p.employmentTypes, t))} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Notice Period Preference */}
              <div>
                <h4 className="font-display font-bold text-[13px]">Notice Period Preference</h4>
                <p className="text-[11px] text-ink-500 mb-2">Preferred notice period from candidates.</p>
                <ul className="space-y-1.5">
                  {NOTICE_OPTS.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[12.5px]">
                      <input type="checkbox" className="accent-brand-600 w-4 h-4"
                        checked={p.noticePeriods.includes(t)}
                        onChange={() => set("noticePeriods", toggle(p.noticePeriods, t))} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Diversity & Inclusion */}
              <div>
                <h4 className="font-display font-bold text-[13px]">Diversity & Inclusion <span className="text-[11px] font-normal text-ink-500">(Optional)</span></h4>
                <p className="text-[11px] text-ink-500 mb-2">Help us build a more diverse and inclusive workplace.</p>
                <div className="space-y-2.5">
                  <Select label="Gender Preference" value={p.genderPreference} onChange={(v) => set("genderPreference", v)} options={["No Preference", "Female", "Male", "Non-binary"]} />
                  <Select label="Diversity Hiring" value={p.diversityHiring} onChange={(v) => set("diversityHiring", v)} options={["Open to All", "Women Returnees", "PWD", "LGBTQ+"]} />
                  <label className="inline-flex items-center gap-2 text-[12.5px]">
                    <input type="checkbox" className="accent-brand-600 w-4 h-4"
                      checked={p.equalOpportunity} onChange={(e) => set("equalOpportunity", e.target.checked)} />
                    We are an equal opportunity employer
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Preferences */}
          <Card>
            <h3 className="font-display font-bold text-[14px]">Additional Preferences <span className="text-[11.5px] font-normal text-ink-500">(Optional)</span></h3>
            <p className="text-[11.5px] text-ink-500 mb-3">Add any other preferences or expectations for this role.</p>
            <textarea value={p.additionalPreferences} onChange={(e) => set("additionalPreferences", e.target.value)}
              placeholder="E.g., Willing to relocate, Travel required, Language preference, Domain experience, etc."
              maxLength={300}
              className="w-full min-h-[80px] p-3 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-300 placeholder:text-ink-400 resize-y" />
            <div className="text-right text-[11px] text-ink-400">{p.additionalPreferences.length}/300</div>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-2">
              <ArrowLeft /> Back to Compensation
            </button>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-2"><DraftIcon /> Save as Draft</button>
              <button onClick={onContinue} className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
                Next: Review & Publish <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Job Summary + Preferences Tips */}
        <aside className="w-full flex flex-col gap-3">
          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 grid place-items-center"><BriefIcon /></span>
              <h3 className="font-display font-bold text-[14px]">Job Summary</h3>
            </div>
            <Row label="Job Title"        value={data.details.title || "—"} />
            <Row label="Department"       value={data.details.department || "—"} />
            <Row label="Employment Type"  value={data.details.employmentType || "—"} />
            <Row label="Experience"       value={`${data.requirements.minExperience} - ${data.requirements.minExperience + 3} Years`} />
            <Row label="Location"         value={data.details.workplaceLocation || p.workLocation || "—"} />
            <button className="mt-2 text-[12px] text-brand-700 font-semibold inline-flex items-center gap-1"><EditIcon /> Edit Job Details</button>
          </div>

          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] mb-2 inline-flex items-center gap-1.5"><BulbIcon /> Preferences Tips</h3>
            <ul className="space-y-1.5">
              {[
                "Keeping work arrangement flexible increases your talent pool.",
                "Clearly defining shift and working hours helps in better matching.",
                "Consider diversity hiring to build a balanced team.",
                "Notice period flexibility can help you get more relevant candidates.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12px] text-ink-700"><span className="mt-1 text-green-600">✓</span><span>{t}</span></li>
              ))}
            </ul>
            <button className="mt-2.5 w-full px-3 py-2 rounded-md border border-brand-300 text-brand-700 text-[12px] font-semibold hover:bg-brand-50 transition inline-flex items-center justify-center gap-1">
              View Best Practice Guide <ArrowRight />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Primitives */
function Card({ children }: { children: React.ReactNode }) { return <section className="bg-white border border-ink-100 rounded-xl p-5">{children}</section>; }
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
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) { return <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>; }
function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0 border-ink-100/60">
      <span className="text-[11.5px] text-ink-500">{label}</span>
      <span className="text-[12px] font-semibold text-ink-900 text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}

/* Icons */
function SlidersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 17h16M9 7v0a2 2 0 0 0 0 4M15 17v0a2 2 0 0 0 0-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function BuildingIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function GlobeIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function SwitchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9h14m0 0l-4-4m4 4l-4 4M21 15H7m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function PinIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function UserIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function BriefIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function EditIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4-11 11H5v-4L16 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function BulbIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c1 .6 1.5 1.5 1.5 2.5V17h3v-.5c0-1 .5-1.9 1.5-2.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowRight() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ArrowLeft() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function DraftIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
