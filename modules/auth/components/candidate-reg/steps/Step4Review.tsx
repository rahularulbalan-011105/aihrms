"use client";

import { useState } from "react";
import type React from "react";
import type { CandidateRegData } from "../../../types/auth.types";
import { PersonIcon, BriefcaseIcon, EditIcon, ArrowLeftIcon, SpinnerIcon } from "../shared/icons";

interface Props {
  data: CandidateRegData;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}

export default function Step4Review({ data, onBack, onEditStep, onSubmit }: Props) {
  const [confirmed, setConfirmed]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { step1, step2, step3 } = data;

  const fullName = [step1.firstName, step1.lastName].filter(Boolean).join(" ") || "Rahul Sharma";
  const email    = step1.email    || "rahul.sharma@email.com";
  const phone    = step1.phone    ? `+91 ${step1.phone}` : "+91 98765 43210";
  const location = step1.currentLocation || "Bangalore, Karnataka, India";

  const currentExp = step2.experience[0];
  const totalExp   = currentExp?.totalExperience    || "3 Yrs 6 Mos";
  const currRole   = currentExp?.jobTitle            || "Software Engineer";
  const currComp   = currentExp?.company             || "Tata Consultancy Services";
  const empType    = currentExp?.employmentType      || "Full Time";

  const topSkills    = step3.skills.filter((s) => s.highlighted).slice(0, 4);
  const extraSkills  = Math.max(0, step3.skills.length - topSkills.length);
  const noticePeriod = step3.noticePeriod    || "30 Days";
  const salary       = step3.expectedSalary  || "10 – 15 LPA";
  const roles        = step3.jobRolePreferences.length ? step3.jobRolePreferences : ["Backend Developer", "Software Engineer", "Full Stack Developer"];
  const prefLocation = step3.preferredLocation || "Bangalore";
  const benefits     = step3.benefits.length ? step3.benefits : ["Health Insurance", "Performance Bonus", "Flexible Working Hours", "Work From Home", "Stock Options"];

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div>
      <p className="text-ink-500 text-[13.5px] mb-6 -mt-2">
        Please review all your information before submitting your profile.
      </p>

      <div className="space-y-4">
        {/* ── Basic Information ── */}
        <SectionCard icon={<PersonIcon />} iconBg="bg-brand-50" iconColor="text-brand-600"
          title="Basic Information" onEdit={() => onEditStep(1)}>
          <div className="space-y-1">
            <p className="font-bold text-[14.5px] text-ink-900">{fullName}</p>
            <p className="text-[13.5px] text-ink-600">{email}</p>
            <p className="text-[13.5px] text-ink-600">{phone}</p>
            <p className="text-[13.5px] text-ink-600">{location}</p>
          </div>
        </SectionCard>

        {/* ── Professional Details ── */}
        <SectionCard icon={<BriefcaseIcon />} iconBg="bg-orange-50" iconColor="text-orange-500"
          title="Professional Details" onEdit={() => onEditStep(2)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-4">
            <SummaryItem label="Total Experience" value={totalExp} />
            <SummaryItem label="Current Role"     value={currRole} />
            <SummaryItem label="Current Company"  value={currComp} />
            <SummaryItem label="Employment Type"  value={empType}  />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Work Experience ({step2.experience.length || 2})</p>
              <ul className="space-y-1">
                {(step2.experience.length ? step2.experience
                  : [
                      { id: "1", company: "Tata Consultancy Services", startDate: "Jan 2021", endDate: "Present",  jobTitle: "" },
                      { id: "2", company: "Infosys Limited",           startDate: "Jun 2018", endDate: "Dec 2020", jobTitle: "" },
                    ]
                ).map((e) => (
                  <li key={e.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>
                    {e.company} ({e.startDate} – {e.endDate})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Education ({step2.education.length || 2})</p>
              <ul className="space-y-1">
                {(step2.education.length ? step2.education
                  : [
                      { id: "1", degree: "B.Tech in Computer Science", institution: "IIIT Delhi",       yearOfPassing: "2018", specialization: "" },
                      { id: "2", degree: "12th (Science)",              institution: "DAV Public School", yearOfPassing: "2014", specialization: "" },
                    ]
                ).map((e) => (
                  <li key={e.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>
                    {e.degree}, {e.institution} ({e.yearOfPassing})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* ── Skills & Certifications ── */}
        <SectionCard icon={<StarIcon />} iconBg="bg-yellow-50" iconColor="text-yellow-500"
          title="Skills & Certifications" onEdit={() => onEditStep(3)}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(topSkills.length ? topSkills.map((s) => s.name) : ["Java", "Spring Boot", "SQL", "Microservices"]).map((name) => (
                  <span key={name} className="px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 text-[12.5px] font-semibold border border-ink-200">{name}</span>
                ))}
                {(extraSkills > 0 || !topSkills.length) && (
                  <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[12.5px] font-semibold border border-brand-200">+{extraSkills || 5} more</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Certifications ({step3.certifications.length || 3})</p>
              <ul className="space-y-1">
                {(step3.certifications.length ? step3.certifications
                  : [
                      { id: "1", name: "AWS Certified Solutions Architect – Associate" },
                      { id: "2", name: "Oracle Certified Professional, Java SE 11 Developer" },
                      { id: "3", name: "Google Data Analytics Professional Certificate" },
                    ]
                ).map((c) => (
                  <li key={c.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>{c.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* ── Preferences ── */}
        <SectionCard icon={<HeartIcon />} iconBg="bg-pink-50" iconColor="text-pink-500"
          title="Preferences" onEdit={() => onEditStep(3)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-4">
            <SummaryItem label="Notice Period"         value={noticePeriod} />
            <SummaryItem label="Expected Salary (CTC)" value={salary}       />
            <SummaryItem label="Role Preferences"      value={roles.join(", ")} />
            <div>
              <p className="text-[11.5px] text-ink-400 font-medium mb-1">Preferred Location</p>
              <p className="text-[13.5px] font-bold text-ink-900">{prefLocation}</p>
              {step3.openToRelocate && (
                <p className="text-[11.5px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckSmall /> Open to relocate
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-ink-700 mb-2">Other Benefits</p>
            <div className="flex flex-wrap gap-3">
              {benefits.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-[13px] text-ink-600">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold">✓</span>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Bottom action bar ── */}
      <div className="mt-6 pt-5 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-50 transition self-start sm:self-auto">
          <ArrowLeftIcon /> Back
        </button>

        <label className="flex items-start gap-3 cursor-pointer flex-1 max-w-[440px]">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-brand-600 shrink-0" />
          <span className="text-[12.5px] text-ink-600 leading-relaxed">
            I confirm that all the information provided is true and accurate to the best of my knowledge.
          </span>
        </label>

        <button type="button" onClick={handleSubmit} disabled={!confirmed || submitting}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-[15px] transition hover:opacity-95 disabled:opacity-50 shrink-0 shadow-md"
          style={{ background: "var(--gradient-brand)" }}>
          {submitting ? <><SpinnerIcon /> Submitting...</> : <>Submit Profile <SendIcon /></>}
        </button>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function SectionCard({ icon, iconBg, iconColor, title, onEdit, children }: {
  icon: React.ReactNode; iconBg: string; iconColor: string;
  title: string; onEdit: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>{icon}</div>
          <span className="font-display font-bold text-[15px] text-ink-900">{title}</span>
        </div>
        <button type="button" onClick={onEdit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-ink-200 text-[13px] font-semibold text-ink-600 hover:bg-ink-50 hover:border-brand-300 hover:text-brand-600 transition">
          <EditIcon /> Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11.5px] text-ink-400 font-medium mb-1">{label}</p>
      <p className="text-[13.5px] font-bold text-ink-900 leading-tight">{value || "—"}</p>
    </div>
  );
}

/* ── Local icons not in shared ── */
function StarIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>; }
function HeartIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>; }
function CheckSmall()  { return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function SendIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>; }
