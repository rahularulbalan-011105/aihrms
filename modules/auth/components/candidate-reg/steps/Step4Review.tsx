"use client";

import { useState, useRef } from "react";
import type React from "react";
import type { CandidateRegData } from "../../../types/auth.types";
import { PersonIcon, BriefcaseIcon, EditIcon, ArrowLeftIcon, SpinnerIcon } from "../shared/icons";
import { uploadProfilePicture, submitProfile } from "../../../services/candidate.service";

interface Props {
  data: CandidateRegData;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}

export default function Step4Review({ data, onBack, onEditStep, onSubmit }: Props) {
  const [confirmed, setConfirmed]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [pictureUploading, setPictureUploading] = useState(false);
  const [pictureError, setPictureError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPictureError("Only image files are allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { setPictureError("Image must be under 5 MB"); return; }
    setPictureError(null);
    setPicturePreview(URL.createObjectURL(file));
    setPictureUploading(true);
    try {
      await uploadProfilePicture(file);
    } catch {
      setPictureError("Upload failed. You can retry after registration.");
    } finally {
      setPictureUploading(false);
    }
  };

  const { step1, step2, step3 } = data;

  const fullName = [step1.firstName, step1.lastName].filter(Boolean).join(" ") || "—";
  const email    = step1.email    || "—";
  const phone    = step1.phone    ? `+91 ${step1.phone}` : "—";
  const location = step1.currentLocation || "—";

  const currentExp = step2.experience[0];
  const totalExp   = currentExp?.totalExperience || "—";
  const currRole   = currentExp?.jobTitle         || "—";
  const currComp   = currentExp?.company          || "—";
  const empType    = currentExp?.employmentType   || "—";

  const topSkills    = step3.skills.filter((s) => s.highlighted).slice(0, 4);
  const extraSkills  = Math.max(0, step3.skills.length - topSkills.length);
  const noticePeriod = step3.noticePeriod    || "—";
  const salary       = step3.expectedSalary  || "—";
  const roles        = step3.jobRolePreferences;
  const prefLocation = step3.preferredLocations?.length ? step3.preferredLocations.join(", ") : "—";
  const benefits     = step3.benefits;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitProfile();
      onSubmit();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-ink-500 text-[13.5px] mb-6 -mt-2">
        Please review all your information before submitting your profile.
      </p>

      <div className="space-y-4">
        {/* ── Basic Information ── */}
        <SectionCard icon={<PersonIcon />} iconBg="bg-brand-50" iconColor="text-brand-600"
          title="Basic Information">
          <div className="flex items-start gap-4">
            {/* Avatar + upload */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 rounded-full bg-brand-100 border-2 border-brand-200 overflow-hidden flex items-center justify-center">
                {picturePreview
                  ? <img src={picturePreview} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-brand-600 font-bold text-[22px]">{fullName[0] ?? "?"}</span>
                }
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={pictureUploading}
                className="text-[11.5px] font-semibold text-brand-600 hover:text-brand-800 disabled:opacity-50 transition whitespace-nowrap">
                {pictureUploading ? "Uploading…" : picturePreview ? "Change" : "Upload Photo"}
              </button>
              {pictureError && <p className="text-[11px] text-red-500 text-center max-w-[80px]">{pictureError}</p>}
            </div>
            {/* Details */}
            <div className="space-y-1">
              <p className="font-bold text-[14.5px] text-ink-900">{fullName}</p>
              <p className="text-[13.5px] text-ink-600">{email}</p>
              <p className="text-[13.5px] text-ink-600">{phone}</p>
              <p className="text-[13.5px] text-ink-600">{location}</p>
            </div>
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
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Work Experience ({step2.experience.length})</p>
              <ul className="space-y-1">
                {step2.experience.length > 0 ? step2.experience.map((e) => (
                  <li key={e.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>
                    {e.company} ({e.startDate} – {e.endDate})
                  </li>
                )) : (
                  <li className="text-[13px] text-ink-400 italic">No experience added yet.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Education ({step2.education.length})</p>
              <ul className="space-y-1">
                {step2.education.length > 0 ? step2.education.map((e) => (
                  <li key={e.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>
                    {e.degree}, {e.institution} ({e.yearOfPassing})
                  </li>
                )) : (
                  <li className="text-[13px] text-ink-400 italic">No education added yet.</li>
                )}
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
              {topSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {topSkills.map((s) => (
                    <span key={s.name} className="px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 text-[12.5px] font-semibold border border-ink-200">{s.name}</span>
                  ))}
                  {extraSkills > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[12.5px] font-semibold border border-brand-200">+{extraSkills} more</span>
                  )}
                </div>
              ) : (
                <p className="text-[13px] text-ink-400 italic">No skills added yet.</p>
              )}
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-ink-700 mb-2">Certifications ({step3.certifications.length})</p>
              <ul className="space-y-1">
                {step3.certifications.length > 0 ? step3.certifications.map((c) => (
                  <li key={c.id} className="text-[13px] text-ink-600 flex items-start gap-2">
                    <span className="text-brand-400 mt-1.5 text-[8px]">●</span>{c.name}
                  </li>
                )) : (
                  <li className="text-[13px] text-ink-400 italic">No certifications added yet.</li>
                )}
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
            <SummaryItem label="Role Preferences"      value={roles.length ? roles.join(", ") : "—"} />
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
            {benefits.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {benefits.map((b) => (
                  <span key={b} className="flex items-center gap-1.5 text-[13px] text-ink-600">
                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold">✓</span>
                    {b}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ink-400 italic">No benefits selected.</p>
            )}
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

      {submitError && (
        <p role="alert" className="mt-3 text-[13px] text-red-600 text-right">
          {submitError}
        </p>
      )}
    </div>
  );
}

/* ── Sub-components ── */
function SectionCard({ icon, iconBg, iconColor, title, onEdit, children }: {
  icon: React.ReactNode; iconBg: string; iconColor: string;
  title: string; onEdit?: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>{icon}</div>
          <span className="font-display font-bold text-[15px] text-ink-900">{title}</span>
        </div>
        {onEdit && (
          <button type="button" onClick={onEdit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-ink-200 text-[13px] font-semibold text-ink-600 hover:bg-ink-50 hover:border-brand-300 hover:text-brand-600 transition">
            <EditIcon /> Edit
          </button>
        )}
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
