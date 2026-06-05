"use client";

import { useState } from "react";
import type { CandidateRegStep3Data, Skill, Certification } from "../../types/auth.types";

interface Props {
  data: CandidateRegStep3Data;
  onChange: (data: CandidateRegStep3Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "Java",          highlighted: true  },
  { id: "2", name: "Spring Boot",   highlighted: true  },
  { id: "3", name: "SQL",           highlighted: true  },
  { id: "4", name: "Microservices", highlighted: false },
  { id: "5", name: "AWS",           highlighted: false },
  { id: "6", name: "Docker",        highlighted: false },
  { id: "7", name: "React.js",      highlighted: false },
  { id: "8", name: "Python",        highlighted: false },
];

const DEFAULT_CERTS: Certification[] = [
  { id: "1", name: "AWS Certified Solutions Architect – Associate", institution: "Amazon Web Services", passedYear: "2022", validTill: "May 2025" },
  { id: "2", name: "Oracle Certified Professional, Java SE 11 Developer", institution: "Oracle", passedYear: "2021", validTill: "-" },
  { id: "3", name: "Google Data Analytics Professional Certificate", institution: "Google", passedYear: "2023", validTill: "-" },
];

const NOTICE_OPTIONS = ["Immediate", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
const SALARY_OPTIONS = ["Below 5 LPA", "5 – 10 LPA", "10 – 15 LPA", "15 – 20 LPA", "20 – 30 LPA", "30+ LPA"];
const SALARY_TYPE = ["Fixed", "Fixed + Variable", "Variable"];
const ROLE_PREFS_OPTIONS = ["Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "Data Engineer", "ML Engineer"];
const LOCATION_OPTIONS = ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Remote"];
const BENEFIT_OPTIONS = ["Health Insurance", "Performance Bonus", "Flexible Working Hours", "Work From Home", "Stock Options", "Other"];

export default function Step3Skills({ data, onChange, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<Skill[]>(data.skills.length ? data.skills : DEFAULT_SKILLS);
  const [certs] = useState<Certification[]>(data.certifications.length ? data.certifications : DEFAULT_CERTS);
  const [pref, setPref] = useState({
    noticePeriod:       data.noticePeriod || "30 Days",
    expectedSalary:     data.expectedSalary || "10 – 15 LPA",
    salaryType:         data.salaryType || "Fixed",
    jobRolePreferences: data.jobRolePreferences.length ? data.jobRolePreferences : ["Backend Developer", "Software Engineer", "Full Stack Developer"],
    preferredLocation:  data.preferredLocation || "Bangalore",
    openToRelocate:     data.openToRelocate,
    employmentTypes:    data.employmentTypes.length ? data.employmentTypes : ["Full Time"],
    benefits:           data.benefits.length ? data.benefits : ["Health Insurance", "Performance Bonus", "Work From Home"],
    additionalNotes:    data.additionalNotes,
  });

  const toggleHighlight = (id: string) =>
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, highlighted: !s.highlighted } : s));

  const togglePref = (field: "employmentTypes" | "benefits", value: string) => {
    setPref((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const removeRole = (role: string) =>
    setPref((prev) => ({ ...prev, jobRolePreferences: prev.jobRolePreferences.filter((r) => r !== role) }));

  const handleNext = () => {
    onChange({ skills, certifications: certs, ...pref });
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* ── Skills ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[13px] font-bold">#</div>
            <span className="font-display font-bold text-[15px] text-ink-900">Skills</span>
          </div>
          <button type="button" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">+ Add Skill</button>
        </div>
        <p className="text-[12.5px] text-ink-500 mb-3">
          Add your skills and highlight the most relevant ones (Top skills will be shown first to recruiters)
        </p>
        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-ink-200 bg-white min-h-[56px]">
          {skills.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleHighlight(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] font-semibold transition ${
                s.highlighted
                  ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                  : "border-ink-200 bg-ink-50 text-ink-700 hover:border-brand-300"
              }`}
            >
              {s.highlighted && <span className="text-[11px]">⭐</span>}
              {s.name}
            </button>
          ))}
          <button type="button" className="p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-brand-600 hover:border-brand-300 transition">
            <EditSmallIcon />
          </button>
        </div>
        <p className="mt-2 text-[11.5px] text-ink-400">
          ⭐ Star the skills you want to highlight. You can reorder by dragging the skills.
        </p>
      </section>

      {/* ── Professional Certifications ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><CertIcon /></div>
            <span className="font-display font-bold text-[15px] text-ink-900">Professional Certifications</span>
          </div>
          <button type="button" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">+ Add Certification</button>
        </div>
        <div className="rounded-xl border border-ink-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-ink-50 border-b border-ink-200">
              <tr>
                {["Certification Name", "Issuing Institution", "Passed Year", "Valid Till", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-ink-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.map((c, i) => (
                <tr key={c.id} className={`border-b border-ink-100 last:border-0 ${i % 2 === 1 ? "bg-ink-50/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-ink-800">{c.name}</td>
                  <td className="px-4 py-3 text-ink-600">{c.institution}</td>
                  <td className="px-4 py-3 text-ink-600">{c.passedYear}</td>
                  <td className="px-4 py-3 text-ink-600">{c.validTill}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
                      <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Preferences ── */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">❤</div>
          <span className="font-display font-bold text-[15px] text-ink-900">Preferences</span>
        </div>
        <p className="text-[12.5px] text-ink-500 -mt-2 mb-4">Tell us your preferences to get better job recommendations</p>

        <div className="space-y-5">
          {/* Row 1: Notice + Salary + Type */}
          <div className="grid md:grid-cols-3 gap-4">
            <SelectField label="Notice Period" required value={pref.noticePeriod} onChange={(v) => setPref((p) => ({ ...p, noticePeriod: v }))} options={NOTICE_OPTIONS} />
            <SelectField label="Expected Salary (Annual CTC)" required value={pref.expectedSalary} onChange={(v) => setPref((p) => ({ ...p, expectedSalary: v }))} options={SALARY_OPTIONS} />
            <SelectField label="Salary Type" value={pref.salaryType} onChange={(v) => setPref((p) => ({ ...p, salaryType: v }))} options={SALARY_TYPE} />
          </div>

          {/* Job Role Preferences */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
              Job Role Preferences <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-ink-200 bg-white min-h-[44px]">
              {pref.jobRolePreferences.map((role) => (
                <span key={role} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[13px] font-semibold border border-brand-200">
                  {role}
                  <button type="button" onClick={() => removeRole(role)} className="text-brand-400 hover:text-brand-700 transition leading-none text-[15px]">×</button>
                </span>
              ))}
              <button type="button" className="px-3 py-1 rounded-full border border-dashed border-ink-300 text-ink-400 text-[12px] hover:border-brand-400 hover:text-brand-600 transition">
                + Add Role
              </button>
            </div>
          </div>

          {/* Location + Relocate */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <SelectField label="Preferred Work Location" required value={pref.preferredLocation} onChange={(v) => setPref((p) => ({ ...p, preferredLocation: v }))} options={LOCATION_OPTIONS} />
            <div className="pt-7">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={pref.openToRelocate} onChange={(e) => setPref((p) => ({ ...p, openToRelocate: e.target.checked }))} className="w-4 h-4 rounded accent-brand-600" />
                <span className="text-[13.5px] font-medium text-ink-700 flex items-center gap-1.5">
                  Open to relocate
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </label>
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-2.5">Preferred Employment Type</label>
            <div className="flex flex-wrap gap-4">
              {["Full Time", "Contract", "Remote", "Hybrid"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pref.employmentTypes.includes(t)} onChange={() => togglePref("employmentTypes", t)} className="w-4 h-4 rounded accent-brand-600" />
                  <span className="text-[13.5px] text-ink-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-2.5">
              Other Benefits You&apos;re Looking For (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-4">
              {BENEFIT_OPTIONS.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pref.benefits.includes(b)} onChange={() => togglePref("benefits", b)} className="w-4 h-4 rounded accent-brand-600" />
                  <span className="text-[13.5px] text-ink-700">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
              Additional Preferences / Notes (Optional)
            </label>
            <textarea
              value={pref.additionalNotes}
              onChange={(e) => setPref((p) => ({ ...p, additionalNotes: e.target.value.slice(0, 250) }))}
              placeholder="Tell us anything else that can help us find the right opportunities for you..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[14px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition resize-none"
            />
            <p className="mt-1 text-right text-[12px] text-ink-400">{pref.additionalNotes.length}/250</p>
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-4 border-t border-ink-100">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <ArrowLeftIcon /> Back
        </button>
        <button type="button" onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-[14px] hover:opacity-95 transition" style={{ background: "var(--gradient-brand)" }}>
          Save &amp; Continue <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

function SelectField({ label, required, value, onChange, options }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[14px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition appearance-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ── Icons ── */
function CertIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="M9 14l-2 7 5-3 5 3-2-7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>; }
function EditSmallIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function EditIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function ArrowLeftIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5M3 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ArrowRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
