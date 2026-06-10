"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchFullProfile,
  type FullProfile,
  type WorkExperienceProfile,
  type EducationProfile,
  type SkillProfile,
} from "@/modules/auth/services/candidate.service";
import ProfileLeftPanel    from "./components/profile/ProfileLeftPanel";
import ProfileOverviewCard from "./components/profile/ProfileOverviewCard";
import ProfileRightPanel   from "./components/profile/ProfileRightPanel";
import { toLabel } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(iso: string | null): string {
  if (!iso) return "Present";
  const [yyyy, mm] = iso.split("-");
  return `${MONTHS_SHORT[parseInt(mm, 10) - 1]} ${yyyy}`;
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function ProfessionalSummary() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-[15px] text-ink-900">Professional Summary</h2>
      </div>
      <p className="text-[13.5px] text-ink-600 leading-relaxed">
        Results-driven professional with hands-on experience designing, developing, and deploying
        scalable solutions. Committed to delivering high-quality work and continuous learning.
      </p>
    </div>
  );
}

function ExperienceSection({ experiences }: { experiences: WorkExperienceProfile[] }) {
  if (!experiences.length) return null;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-[15px] text-ink-900">Experience</h2>
      </div>

      <div className="space-y-5">
        {experiences.map(exp => (
          <div key={exp.id} className="border border-ink-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg border border-ink-200 bg-ink-50 flex items-center justify-center shrink-0 text-[10px] font-bold text-brand-600">
                {exp.companyName.slice(0, 3).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[14px] text-ink-900">{exp.jobTitle}</span>
                  {exp.currentlyWorking && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Current</span>
                  )}
                </div>
                <div className="text-[13px] text-brand-600 font-medium mt-0.5">{exp.companyName}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[12px] text-ink-500">
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </span>
              {exp.location && <><span>•</span><span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /></svg>
                {exp.location}
              </span></>}
              {exp.employmentType && <><span>•</span><span>{toLabel(exp.employmentType)}</span></>}
            </div>

            {exp.projects.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {exp.projects.map(p => (
                  <div key={p.id} className="flex items-start gap-2 text-[13px] text-ink-600">
                    <span className="text-ink-400 mt-1 shrink-0">•</span>
                    <span><span className="font-medium text-ink-800">{p.projectName}</span>{p.description ? ` — ${p.description}` : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ educations }: { educations: EducationProfile[] }) {
  if (!educations.length) return null;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-[15px] text-ink-900">Education</h2>
      </div>

      <div className="space-y-3">
        {educations.map(edu => (
          <div key={edu.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center text-[18px] shrink-0">🎓</div>
            <div>
              <div className="font-semibold text-[13.5px] text-ink-900">
                {edu.degree}{edu.specialization ? ` — ${edu.specialization}` : ""}
              </div>
              <div className="text-[12.5px] text-brand-600 font-medium">{edu.institution}</div>
              <div className="text-[12px] text-ink-400 mt-0.5">
                {[edu.yearOfPassing, edu.grade].filter(Boolean).join(" • ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopSkillsSection({ skills }: { skills: SkillProfile[] }) {
  if (!skills.length) return null;
  const topSkills = skills.filter(s => s.topSkill).length ? skills.filter(s => s.topSkill) : skills;
  const displayed = topSkills.slice(0, 12);
  const extra = skills.length - displayed.length;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-[15px] text-ink-900">Top Skills</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayed.map(s => (
          <span key={s.id} className="px-3 py-1.5 rounded-full border border-ink-200 text-[12.5px] text-ink-700 bg-white hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-default">
            {s.skillName}
          </span>
        ))}
        {extra > 0 && (
          <span className="px-3 py-1.5 rounded-full border border-ink-200 text-[12.5px] text-ink-500 bg-white cursor-default">
            +{extra} more
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-ink-100 ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="flex gap-5 items-start">
      <aside className="w-[240px] shrink-0 space-y-4">
        <Pulse className="h-4 w-32" />
        <div className="card p-5 space-y-3 flex flex-col items-center">
          <Pulse className="w-20 h-20 rounded-full" />
          <Pulse className="h-4 w-3/4" />
          <Pulse className="h-3 w-1/2" />
        </div>
        <div className="card p-4"><Pulse className="h-16" /></div>
        <div className="card p-2"><Pulse className="h-48" /></div>
      </aside>
      <div className="flex-1 min-w-0 space-y-4">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-40" />
        <Pulse className="h-24" />
        <Pulse className="h-60" />
      </div>
      <aside className="w-[260px] shrink-0 space-y-4">
        <div className="card p-5"><Pulse className="h-36" /></div>
        <div className="card p-5"><Pulse className="h-36" /></div>
      </aside>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchFullProfile()
      .then(setFullProfile)
      .catch(err => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error)   return <div className="flex items-center justify-center h-64 text-red-600 text-[14px]">{error}</div>;

  return (
    <div className="flex gap-5 items-start">
      {/* Left panel */}
      <ProfileLeftPanel
        fullName={fullProfile?.fullName}
        jobTitle={fullProfile?.currentRole}
        location={fullProfile?.currentLocation}
        email={fullProfile?.email}
        phone={fullProfile?.phoneNumber}
        profileStrength={fullProfile?.profileStrength}
        profilePicture={null}
      />

      {/* Centre */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-ink-900">Profile Overview</h1>
            <p className="text-[13.5px] text-ink-500 mt-0.5">Your professional summary and key highlights.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <ProfileOverviewCard profile={fullProfile} />
        <ProfessionalSummary />

        <div className="grid lg:grid-cols-2 gap-4">
          <ExperienceSection experiences={fullProfile?.workExperiences ?? []} />
          <div className="space-y-4">
            <EducationSection educations={fullProfile?.educations ?? []} />
            <TopSkillsSection skills={fullProfile?.skills ?? []} />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <ProfileRightPanel />
    </div>
  );
}
