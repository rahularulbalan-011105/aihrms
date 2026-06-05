"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onSave: (data: EducationFormData) => void;
}

interface EducationFormData {
  degree: string;
  specialization: string;
  institution: string;
  location: string;
  yearOfPassing: string;
  grade: string;
  educationType: string;
  description: string;
}

const DEGREES = [
  "B.Tech / B.E.", "M.Tech / M.E.", "BCA", "MCA", "B.Sc", "M.Sc",
  "MBA", "BBA", "B.Com", "M.Com", "BA", "MA", "Ph.D", "Diploma", "12th (Science)",
  "12th (Commerce)", "12th (Arts)", "10th", "Other",
];

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

const EDU_TYPES = ["Full Time", "Part Time", "Distance Learning", "Online"];

const EMPTY: EducationFormData = {
  degree: "", specialization: "", institution: "", location: "",
  yearOfPassing: "", grade: "", educationType: "Full Time", description: "",
};

export default function AddEducationModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<EducationFormData>(EMPTY);
  const set = <K extends keyof EducationFormData>(k: K, v: EducationFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-ink-100">
          <div>
            <h2 className="font-display font-extrabold text-[20px] text-ink-900">Add Education</h2>
            <p className="text-[13px] text-ink-500 mt-0.5">Add your educational qualification details</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center text-ink-600 transition shrink-0 mt-0.5">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Degree / Course <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.degree}
                  onChange={(e) => set("degree", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 appearance-none transition">
                  <option value="">Select degree or course</option>
                  {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Specialization <span className="text-ink-400 font-normal">(Optional)</span></label>
              <input value={form.specialization} onChange={(e) => set("specialization", e.target.value)}
                placeholder="e.g., Computer Science, Finance"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Institute / University <span className="text-red-500">*</span>
              </label>
              <input value={form.institution} onChange={(e) => set("institution", e.target.value)}
                placeholder="Enter institute or university name"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder="Enter city"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
              <p className="mt-1 text-[11.5px] text-ink-400">City, State, Country</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Year of Passing <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><CalendarIcon /></span>
                <select
                  value={form.yearOfPassing}
                  onChange={(e) => set("yearOfPassing", e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-ink-200 text-[13.5px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 appearance-none transition">
                  <option value="">Select year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Grade / Percentage <span className="text-ink-400 font-normal">(Optional)</span></label>
              <input value={form.grade} onChange={(e) => set("grade", e.target.value)}
                placeholder="e.g., 8.5 CGPA or 75%"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          </div>

          {/* Education Type */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-2">Education Type</label>
            <div className="flex flex-wrap gap-4">
              {EDU_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="eduType" value={t} checked={form.educationType === t}
                    onChange={() => set("educationType", t)}
                    className="accent-brand-600 w-4 h-4" />
                  <span className="text-[13px] text-ink-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Description <span className="text-ink-400 font-normal">(Optional)</span></label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value.slice(0, 500))}
              placeholder="Add any relevant details about your education"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none transition"
            />
            <div className="text-right text-[11px] text-ink-400 mt-0.5">{form.description.length} / 500</div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Attachments <span className="text-ink-400 font-normal">(Optional)</span></label>
            <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50/40 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-brand-50/30 hover:border-brand-300 transition">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                <UploadCloudIcon />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ink-700">Upload supporting documents (Marksheet, Certificate, etc.)</div>
                <div className="text-[11.5px] text-ink-400 mt-0.5">PDF, DOC, DOCX only &nbsp;•&nbsp; Max size: 5MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink-100">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(form)}
            className="px-8 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 transition"
            style={{ background: "var(--gradient-brand)" }}>
            Save Education
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Icons ── */
function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function CalendarIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function UploadCloudIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="16 16 12 12 8 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
