"use client";

import { useState } from "react";
import type { CandidateRegStep2Data, Education, Experience, Project } from "../../types/auth.types";

interface Props {
  data: CandidateRegStep2Data;
  onChange: (data: CandidateRegStep2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_EDUCATION: Education[] = [
  { id: "1", degree: "B.Tech", institution: "Indian Institute of Technology, Delhi", specialization: "Computer Science", yearOfPassing: "2018" },
  { id: "2", degree: "12th (Science)", institution: "DAV Public School", specialization: "PCM", yearOfPassing: "2014" },
];

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: "1", company: "Tata Consultancy Services", employmentType: "Full Time",
    startDate: "Jan 2021", endDate: "Present", isCurrent: true, totalExperience: "3 Yrs 6 Mos",
    jobTitle: "Software Engineer", location: "Bangalore, India", noticePeriod: "30 Days",
    expanded: true,
    projects: [
      { id: "p1", title: "AIHRMS Platform Development", description: "Developed core modules for candidate matching, resume parsing and job recommendation.", role: "Backend Developer", startDate: "Jan 2021", endDate: "Dec 2022", teamSize: "6", technologies: ["Java", "Spring Boot", "MySQL", "AWS", "Docker", "Redis"] },
      { id: "p2", title: "Resume Parser Service", description: "Built AI based resume parser to extract structured data from resumes.", role: "Developer", startDate: "Jan 2021", endDate: "Jun 2021", teamSize: "4", technologies: ["Python", "NLTK", "AWS S3", "PostgreSQL"] },
    ],
  },
  {
    id: "2", company: "Infosys Limited", employmentType: "Full Time",
    startDate: "Jun 2018", endDate: "Dec 2020", isCurrent: false, totalExperience: "2 Yrs 6 Mos",
    jobTitle: "Systems Engineer", location: "Pune, India", noticePeriod: "60 Days",
    expanded: false, projects: [],
  },
];

export default function Step2Professional({ data, onChange, onNext, onBack }: Props) {
  const [education]                   = useState<Education[]>(data.education.length ? data.education : DEFAULT_EDUCATION);
  const [experience, setExperience]   = useState<Experience[]>(data.experience.length ? data.experience : DEFAULT_EXPERIENCE);

  const toggleExpand = (id: string) =>
    setExperience((prev) => prev.map((e) => e.id === id ? { ...e, expanded: !e.expanded } : e));

  const handleNext = () => { onChange({ education, experience }); onNext(); };

  return (
    <div>
      <EducationSection education={education} />
      <ExperienceSection experience={experience} onToggle={toggleExpand} />

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-3 border-t border-ink-100">
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

/* ── Education Section ── */
function EducationSection({ education }: { education: Education[] }) {
  return (
    <section className="mb-5">
      <SectionHeader icon={<GradIcon />} title="Education Details" addLabel="+ Add Education" />
      <div className="overflow-x-auto rounded-xl border border-ink-200">
        <table className="w-full text-[13px]">
          <thead className="bg-ink-50/80 border-b border-ink-200">
            <tr>
              {["Degree / Course", "Institute / University", "Specialization", "Year of Passing", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-ink-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {education.map((edu, i) => (
              <tr key={edu.id} className={`border-b border-ink-100 last:border-0 ${i % 2 === 1 ? "bg-ink-50/30" : "bg-white"}`}>
                <td className="px-4 py-2.5 text-ink-800 font-medium whitespace-nowrap">{edu.degree}</td>
                <td className="px-4 py-2.5 text-ink-600">{edu.institution}</td>
                <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">{edu.specialization}</td>
                <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">{edu.yearOfPassing}</td>
                <td className="px-4 py-2.5">
                  <RowActions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Experience Section ── */
function ExperienceSection({ experience, onToggle }: { experience: Experience[]; onToggle: (id: string) => void }) {
  return (
    <section className="mb-5">
      <SectionHeader icon={<BriefcaseIcon />} title="Professional Experience" addLabel="+ Add Experience" />
      <div className="space-y-3">
        {experience.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} onToggle={() => onToggle(exp.id)} />
        ))}
      </div>
    </section>
  );
}

/* ── Shared: Section Header ── */
function SectionHeader({ icon, title, addLabel }: { icon: React.ReactNode; title: string; addLabel: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="font-display font-bold text-[15px] text-ink-900">{title}</span>
      </div>
      <button type="button" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">
        {addLabel}
      </button>
    </div>
  );
}

/* ── Shared: Edit/Delete row actions ── */
function RowActions() {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
      <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition"><TrashIcon /></button>
    </div>
  );
}

/* ── Experience Card ── */
function ExperienceCard({ exp, onToggle }: { exp: Experience; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-ink-200 overflow-hidden">
      <div className="px-4 py-3 bg-white flex items-start justify-between gap-4">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
          <MetaField label="Company"          value={exp.company} bold />
          <MetaField label="Employment Type"  value={exp.employmentType} />
          <MetaField label="Duration"         value={`${exp.startDate} – ${exp.endDate}`} />
          <MetaField label="Total Experience" value={exp.totalExperience} />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
          <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition"><TrashIcon /></button>
          <button type="button" onClick={onToggle} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 transition">
            {exp.expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
      </div>

      {exp.expanded && (
        <div className="border-t border-ink-100 bg-ink-50/30">
          <div className="px-4 py-2.5 grid grid-cols-3 gap-3 text-[12.5px]">
            <div><span className="text-ink-400">Job Title: </span><span className="font-semibold text-ink-800">{exp.jobTitle}</span></div>
            <div><span className="text-ink-400">Location: </span><span className="font-semibold text-ink-800">{exp.location}</span></div>
            <div><span className="text-ink-400">Notice Period: </span><span className="font-semibold text-ink-800">{exp.noticePeriod}</span></div>
          </div>

          {exp.projects.length > 0 && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-brand-600">Projects ({exp.projects.length})</span>
                <button type="button" className="text-[12px] font-semibold text-brand-600 hover:text-brand-700">+ Add Project</button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink-50 border-b border-ink-200">
                    <tr>
                      {["Project Details", "Role & Duration", "Team Size", "Technologies Used", ""].map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold text-ink-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exp.projects.map((proj) => <ProjectRow key={proj.id} proj={proj} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetaField({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <div className="text-[11px] text-ink-400 font-medium">{label}</div>
      <div className={`text-[13px] mt-0.5 ${bold ? "font-bold text-ink-900" : "font-semibold text-ink-700"}`}>{value}</div>
    </div>
  );
}

function ProjectRow({ proj }: { proj: Project }) {
  return (
    <tr className="border-b border-ink-100 last:border-0">
      <td className="px-3 py-2.5 align-top">
        <div className="font-bold text-ink-800">{proj.title}</div>
        <div className="text-ink-500 text-[11px] mt-0.5 leading-relaxed max-w-[200px]">{proj.description}</div>
      </td>
      <td className="px-3 py-2.5 align-top whitespace-nowrap">
        <div>Role: <span className="font-semibold text-ink-800">{proj.role}</span></div>
        <div className="text-ink-500 text-[11px] mt-0.5">{proj.startDate} – {proj.endDate}</div>
      </td>
      <td className="px-3 py-2.5 text-center font-semibold text-ink-700 align-top">{proj.teamSize}</td>
      <td className="px-3 py-2.5 align-top">
        <div className="flex flex-wrap gap-1">
          {proj.technologies.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-semibold">{t}</span>
          ))}
        </div>
      </td>
      <td className="px-3 py-2.5 align-top"><RowActions /></td>
    </tr>
  );
}

/* ── Icons ── */
function GradIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 10L12 5 2 10l10 5 10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function BriefcaseIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function EditIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>; }
function TrashIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChevronUpIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChevronDownIcon(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ArrowLeftIcon()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5M3 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ArrowRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
