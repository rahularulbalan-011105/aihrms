"use client";

import { useState } from "react";
import type { CandidateRegStep2Data, Education, Experience } from "../../types/auth.types";
import AddEducationModal from "./AddEducationModal";

interface Props {
  data: CandidateRegStep2Data;
  onChange: (data: CandidateRegStep2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Professional({ data, onChange, onNext, onBack }: Props) {
  const [education, setEducation]  = useState<Education[]>(data.education);
  const [experience]               = useState<Experience[]>(data.experience);
  const [showEduModal, setShowEduModal] = useState(false);

  const handleNext = () => { onChange({ education, experience }); onNext(); };

  return (
    <div className="flex flex-col gap-4">
      {showEduModal && (
        <AddEducationModal
          onClose={() => setShowEduModal(false)}
          onSave={(d) => {
            setEducation((prev) => [...prev, { id: String(Date.now()), degree: d.degree, institution: d.institution, specialization: d.specialization, yearOfPassing: d.yearOfPassing }]);
            setShowEduModal(false);
          }}
        />
      )}

      {/* ── Education Details ── */}
      <section>
        <SectionHeader icon={<GradIcon />} title="Education Details" addLabel="+ Add Education" onAdd={() => setShowEduModal(true)} />
        {education.length === 0
          ? <EmptyState icon={<GradIconLg />} message="No education added yet." hint='Click "Add Education" to include your educational background.' />
          : <div className="rounded-xl border border-ink-200 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-ink-50/80 border-b border-ink-200">
                  <tr>{["Degree / Course","Institute / University","Specialization","Year of Passing",""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-ink-600 whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {education.map((edu, i) => (
                    <tr key={edu.id} className={`border-b border-ink-100 last:border-0 ${i % 2 ? "bg-ink-50/30" : "bg-white"}`}>
                      <td className="px-4 py-2.5 font-medium text-ink-800 whitespace-nowrap">{edu.degree}</td>
                      <td className="px-4 py-2.5 text-ink-600">{edu.institution}</td>
                      <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">{edu.specialization}</td>
                      <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">{edu.yearOfPassing}</td>
                      <td className="px-4 py-2.5"><RowActions /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </section>

      {/* ── Professional Experience ── */}
      <section>
        <SectionHeader icon={<BriefcaseIcon />} title="Professional Experience" addLabel="+ Add Experience" />
        {experience.length === 0
          ? <EmptyState icon={<BriefcaseIconLg />} message="No experience added yet." hint='Click "Add Experience" to include your professional experience.' />
          : <div className="space-y-3">
              {experience.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
        }
      </section>

      {/* ── Projects ── */}
      <section>
        <SectionHeader icon={<FolderIcon />} title="Projects" addLabel="+ Add Project" />
        <EmptyState icon={<FolderIconLg />} message="No projects added yet." hint='Click "Add Project" to showcase your work.' />
      </section>

      {/* ── Upload Resume Banner ── */}
      <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 flex items-center justify-center shrink-0 text-brand-600">
          <UploadIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[13.5px] text-brand-700">Upload Your Resume <span className="text-[11px] font-semibold text-brand-500">(Paid Plan Feature)</span></div>
          <div className="text-[12px] text-ink-500 mt-0.5">Stand out to recruiters by uploading your resume.</div>
          <div className="text-[11px] text-ink-400 mt-0.5">Allowed format: PDF, DOCX only &nbsp;•&nbsp; Max size: 5MB</div>
        </div>
        <button type="button" className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-300 bg-white text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition whitespace-nowrap">
          <UploadIcon /> Upload Resume<br /><span className="text-[10px] font-normal text-ink-400">PDF, DOCX only</span>
        </button>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-2 border-t border-ink-100">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <ArrowLeftIcon /> Back
        </button>
        <button type="button" onClick={handleNext}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 transition"
          style={{ background: "var(--gradient-brand)" }}>
          Save &amp; Continue <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, addLabel, onAdd }: { icon: React.ReactNode; title: string; addLabel: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">{icon}</div>
        <span className="font-display font-bold text-[15px] text-ink-900">{title}</span>
      </div>
      <button type="button" onClick={onAdd} className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">{addLabel}</button>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ icon, message, hint }: { icon: React.ReactNode; message: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ink-200 bg-white py-3 flex flex-col items-center justify-center gap-1 text-center">
      <div className="text-ink-300">{icon}</div>
      <div className="font-semibold text-[13px] text-ink-500">{message}</div>
      <div className="text-[12px] text-ink-400">{hint}</div>
    </div>
  );
}

/* ── Row actions ── */
function RowActions() {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
      <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition"><TrashIcon /></button>
    </div>
  );
}

/* ── Experience Card (shown when data exists) ── */
function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="rounded-xl border border-ink-200 px-4 py-3 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[13px]">
        <div><div className="text-[11px] text-ink-400">Company</div><div className="font-bold text-ink-900 mt-0.5">{exp.company}</div></div>
        <div><div className="text-[11px] text-ink-400">Employment Type</div><div className="font-semibold text-ink-700 mt-0.5">{exp.employmentType}</div></div>
        <div><div className="text-[11px] text-ink-400">Duration</div><div className="font-semibold text-ink-700 mt-0.5">{exp.startDate} – {exp.endDate}</div></div>
        <div><div className="text-[11px] text-ink-400">Total Experience</div><div className="font-semibold text-ink-700 mt-0.5">{exp.totalExperience}</div></div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function GradIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 10L12 5 2 10l10 5 10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function BriefcaseIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function FolderIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.6"/></svg>; }
function GradIconLg()      { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M22 10L12 5 2 10l10 5 10-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function BriefcaseIconLg() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function FolderIconLg()    { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.4"/></svg>; }
function UploadIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function EditIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>; }
function TrashIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ArrowLeftIcon()   { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5M3 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ArrowRightIcon()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
