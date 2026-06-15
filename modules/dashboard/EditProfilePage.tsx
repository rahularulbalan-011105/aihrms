"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  fetchFullProfile,
  updateCandidateBasicInfo,
  savePreferences,
  buildPreferencesPayload,
  type FullProfile,
} from "@/modules/auth/services/candidate.service";
import ProfileLeftPanel from "./components/profile/ProfileLeftPanel";
import type {
  Education,
  Experience,
  Skill,
  Certification,
  CandidateRegStep1Data,
} from "@/modules/auth/types/auth.types";
import type { PreferencesData } from "@/modules/auth/components/candidate-reg/shared/types";
import EducationSection from "@/modules/auth/components/candidate-reg/sections/EducationSection";
import CertificationsSection from "@/modules/auth/components/candidate-reg/sections/CertificationsSection";
import PreferencesSection from "@/modules/auth/components/candidate-reg/sections/PreferencesSection";
import UploadResumeBanner from "@/modules/auth/components/candidate-reg/sections/UploadResumeBanner";
import AddExperienceModal from "@/modules/auth/components/candidate-reg/modals/AddExperienceModal";
import AddSkillModal from "@/modules/auth/components/candidate-reg/modals/AddSkillModal";
import { useConfirmDelete } from "@/modules/auth/components/candidate-reg/shared/hooks";
import {
  PersonIcon,
  BriefcaseIcon,
  BriefcaseIconLg,
  EditIcon,
  TrashIcon,
  SpinnerIcon,
  ChevronIcon,
  SkillsIcon,
  SkillsIconLg,
} from "@/modules/auth/components/candidate-reg/shared/icons";
import {
  Tooltip,
  ConfirmDialog,
  SectionHeader,
  EmptyState,
  DotsIndicator,
} from "@/modules/auth/components/candidate-reg/shared/ui";
import {
  deleteWorkExperience,
  deleteCandidateSkill,
} from "@/modules/auth/services/candidate.service";
import {
  PROFICIENCY_DOTS,
  POPULAR_SKILL_COLORS,
} from "@/modules/auth/components/candidate-reg/shared/constants";
import { toLabel } from "@/lib/utils";

/* ── Data mapping helpers ─────────────────────────────────────────────── */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function isoToMMYYYY(iso: string | null | undefined): string {
  if (!iso) return "";
  const [yyyy, mm] = iso.split("-");
  return mm && yyyy ? `${mm}/${yyyy}` : "";
}

function isoToMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  const [yyyy, mm] = iso.split("-");
  if (!mm || !yyyy) return "";
  return `${MONTHS_SHORT[parseInt(mm, 10) - 1]} ${yyyy}`;
}

const PROFICIENCY_REVERSE: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
  MASTER: "Master",
};

function mapToEducation(edu: FullProfile["educations"][0]): Education {
  return {
    id: edu.id,
    degree: edu.degree,
    institution: edu.institution,
    specialization: edu.specialization ?? "",
    location: edu.location ?? "",
    yearOfPassing: edu.yearOfPassing ?? "",
    grade: edu.grade ?? "",
    educationType: edu.educationType ?? "",
    description: "",
    attachmentFileKeys: edu.attachmentFileKeys ?? [],
  };
}

function mapToExperience(exp: FullProfile["workExperiences"][0]): Experience {
  return {
    id: exp.id,
    company: exp.companyName,
    jobTitle: exp.jobTitle,
    employmentType: toLabel(exp.employmentType),
    startDate: isoToMMYYYY(exp.startDate),
    endDate: exp.currentlyWorking ? "" : isoToMMYYYY(exp.endDate),
    isCurrent: exp.currentlyWorking,
    totalExperience: "",
    location: exp.location ?? "",
    noticePeriod: exp.noticePeriod ?? "",
    expanded: false,
    projects: exp.projects.map((p) => ({
      id: p.id,
      title: p.projectName ?? "",
      role: p.roleName ?? "",
      description: p.description ?? "",
      startDate: isoToMMYYYY(p.startDate),
      endDate: isoToMMYYYY(p.endDate),
      teamSize: p.teamSize != null ? String(p.teamSize) : "",
      technologies: p.technologiesUsed
        ? p.technologiesUsed
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    })),
  };
}

function mapToSkill(s: FullProfile["skills"][0]): Skill {
  const expYears = s.experienceYears ?? 0;
  return {
    id: s.id,
    name: s.skillName,
    proficiency: PROFICIENCY_REVERSE[s.proficiencyLevel] ?? "Intermediate",
    experienceValue: expYears > 0 ? expYears.toString() : "",
    experienceUnit: "Years",
    lastUsed: "",
    highlighted: s.topSkill,
    additionalDetails: "",
  };
}

function mapToCertification(
  c: FullProfile["certifications"][0],
): Certification {
  const validTill = c.doesNotExpire
    ? "Does not expire"
    : c.validTill
      ? isoToMonthYear(c.validTill)
      : "—";
  return {
    id: c.id,
    name: c.certificationName,
    institution: c.issuingInstitution,
    passedYear: c.passedYear?.toString() ?? "",
    validTill,
    doesNotExpire: c.doesNotExpire,
    description: "",
    displayOnProfile: true,
    certificateFileKey: c.certificateFileKey ?? undefined,
  };
}

function mapToPreferences(fp: FullProfile): PreferencesData {
  const prefs = fp.preferences ?? [];
  return {
    noticePeriod: fp.noticePeriod ?? "",
    expectedSalary: fp.expectedSalary ?? "",
    salaryType: fp.salaryType ?? "",
    preferredLocations: fp.preferredLocation ? fp.preferredLocation.split(", ").map(s => s.trim()).filter(Boolean) : [],
    openToRelocate: fp.openToRelocate,
    jobRolePreferences: prefs
      .filter((p) => p.type === "ROLE")
      .map((p) => p.value),
    employmentTypes: prefs
      .filter((p) => p.type === "EMPLOYMENT_TYPE")
      .map((p) => p.value),
    benefits: prefs.filter((p) => p.type === "BENEFIT").map((p) => p.value),
    additionalNotes: fp.additionalPreferences ?? "",
  };
}

/* ── Tabs ─────────────────────────────────────────────────────────────── */

const TABS = [
  { key: "basic", label: "Basic Info" },
  { key: "experience", label: "Experience & Education" },
  { key: "skills", label: "Skills & Certifications" },
  { key: "preferences", label: "Preferences" },
];

/* ── Basic Info tab ───────────────────────────────────────────────────── */

function BasicInfoTab({ profile }: { profile: FullProfile }) {
  const [firstName, setFirstName] = useState(
    () => profile.fullName?.split(" ")[0] ?? "",
  );
  const [lastName, setLastName] = useState(
    () => profile.fullName?.split(" ").slice(1).join(" ") ?? "",
  );
  const [location, setLocation] = useState(profile.currentLocation ?? "");
  const [linkedin, setLinkedin] = useState(profile.linkedinUrl ?? "");
  const [summary, setSummary] = useState(profile.professionalSummary ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload: CandidateRegStep1Data = {
        firstName,
        lastName,
        email: profile.email ?? "",
        phone: profile.phoneNumber ?? "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        currentLocation: location,
        professionalSummary: summary,
        acceptTerms: true,
      };
      await updateCandidateBasicInfo(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder = "",
  ) => (
    <div>
      <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}
      <div className="card p-5 space-y-4">
        <SectionHeader icon={<PersonIcon />} title="Basic Information" addLabel="" />
        <div className="grid grid-cols-2 gap-4">
          {field("First Name", firstName, setFirstName, "First name")}
          {field("Last Name", lastName, setLastName, "Last name")}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Email</label>
            <input
              value={profile.email ?? ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-ink-50 text-ink-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Phone</label>
            <input
              value={profile.phoneNumber ?? ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-ink-50 text-ink-400 cursor-not-allowed"
            />
          </div>
        </div>
        {field("Current Location", location, setLocation, "City, Country")}
        {field("LinkedIn URL", linkedin, setLinkedin, "https://linkedin.com/in/...")}
        <div>
          <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
            Professional Summary <span className="text-ink-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Briefly describe your professional background, key skills, and career goals..."
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[13.5px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition resize-none"
          />
          <p className="mt-1 text-[11.5px] text-ink-400 text-right">{summary.length}/2000</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 flex items-center gap-2 transition"
          style={{ background: "var(--gradient-brand)" }}
        >
          {isSaving ? <><SpinnerIcon /> Saving…</> : "Save Changes"}
        </button>
        {saved && <span className="text-[13px] text-green-600 font-semibold">✓ Saved</span>}
      </div>
    </div>
  );
}

/* ── Experience section (extracted from Step2Professional) ─────────────── */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function fmtDate(mmYYYY: string): string {
  if (!mmYYYY || mmYYYY === "Present") return mmYYYY || "Present";
  const [mm, yyyy] = mmYYYY.split("/");
  return mm && yyyy ? `${MONTHS[parseInt(mm, 10) - 1]} ${yyyy}` : mmYYYY;
}

function ExperienceCard({
  exp,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  isDeleting,
}: {
  exp: Experience;
  expanded: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-9 h-9 rounded-lg border border-ink-200 bg-ink-50 flex items-center justify-center text-[10px] font-bold text-brand-600 shrink-0">
          {exp.company.slice(0, 3).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-ink-900 truncate">
            {exp.jobTitle}
          </p>
          <p className="text-[12.5px] text-brand-600 truncate">
            {exp.company} · {exp.employmentType}
          </p>
        </div>
        <span className="text-[12px] text-ink-400 shrink-0 hidden sm:block">
          {fmtDate(exp.startDate)} –{" "}
          {exp.isCurrent ? "Present" : fmtDate(exp.endDate)}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip label="Edit">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"
            >
              <EditIcon />
            </button>
          </Tooltip>
          <Tooltip label="Delete">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
              className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 disabled:opacity-40 transition"
            >
              {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
            </button>
          </Tooltip>
          <ChevronIcon expanded={expanded} />
        </div>
      </div>
      {expanded && exp.projects.length > 0 && (
        <div className="border-t border-ink-100 px-4 py-3 space-y-1.5">
          {exp.projects.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2 text-[13px] text-ink-600"
            >
              <span className="text-ink-400 mt-1 shrink-0">•</span>
              <span>
                <span className="font-medium text-ink-800">{p.title}</span>
                {p.description ? ` — ${p.description}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceTab({
  experience,
  setExperience,
  education,
  setEducation,
  resumeFileKey,
  setResumeFileKey,
}: {
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
  resumeFileKey: string;
  setResumeFileKey: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [expandedExp, setExpandedExp] = useState<Set<string>>(
    new Set(experience.map((e) => e.id)),
  );
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null);
  const [expModal, setExpModal] = useState<{
    open: boolean;
    initialExperience?: Experience;
  }>({ open: false });
  const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();

  const handleDeleteExperience = async (id: string) => {
    resetConfirm();
    setDeletingExpId(id);
    try {
      await deleteWorkExperience(id);
      setExperience((prev) => prev.filter((e) => e.id !== id));
    } catch {
      /* silently ignore */
    } finally {
      setDeletingExpId(null);
    }
  };

  return (
    <div className="space-y-4">
      {confirm.open && (
        <ConfirmDialog
          label={confirm.label}
          onConfirm={confirm.onConfirm}
          onCancel={resetConfirm}
        />
      )}
      {expModal.open && (
        <AddExperienceModal
          onClose={() => setExpModal({ open: false })}
          onSaved={(exp) => {
            setExperience((prev) =>
              expModal.initialExperience
                ? prev.map((e) => (e.id === exp.id ? exp : e))
                : [...prev.filter((e) => e.id !== exp.id), exp],
            );
            setExpandedExp((prev) => new Set([...prev, exp.id]));
            setExpModal({ open: false });
          }}
          initialExperience={expModal.initialExperience}
        />
      )}
      <div className="card">
        <EducationSection education={education} onChange={setEducation} />
      </div>
      <div className="card p-5">
        <SectionHeader
          icon={<BriefcaseIcon />}
          title="Professional Experience"
          addLabel="+ Add Experience"
          onAdd={() => setExpModal({ open: true })}
        />
        {experience.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIconLg />}
            message="No experience added yet."
            hint='Click "Add Experience" to add your work history.'
          />
        ) : (
          <div className="space-y-3">
            {experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                expanded={expandedExp.has(exp.id)}
                onToggle={() =>
                  setExpandedExp((prev) => {
                    const n = new Set(prev);
                    n.has(exp.id) ? n.delete(exp.id) : n.add(exp.id);
                    return n;
                  })
                }
                onEdit={() =>
                  setExpModal({ open: true, initialExperience: exp })
                }
                onDelete={() =>
                  triggerDelete(`Delete experience at "${exp.company}"?`, () =>
                    handleDeleteExperience(exp.id),
                  )
                }
                isDeleting={deletingExpId === exp.id}
              />
            ))}
          </div>
        )}
      </div>
      <UploadResumeBanner
        resumeFileKey={resumeFileKey || undefined}
        onUploaded={(_name, key) => setResumeFileKey(key ?? "")}
      />
    </div>
  );
}

/* ── Skills tab (inline skill table) ─────────────────────────────────── */

function SkillsTab({
  skills,
  setSkills,
  certifications,
  setCertifications,
}: {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
}) {
  const [skillModal, setSkillModal] = useState<{
    open: boolean;
    editSkill?: Skill;
  }>({ open: false });
  const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const handleDeleteSkill = async (id: string) => {
    resetConfirm();
    setDeletingSkillId(id);
    try {
      await deleteCandidateSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      /* silently ignore */
    } finally {
      setDeletingSkillId(null);
    }
  };

  return (
    <div className="space-y-4">
      {confirm.open && (
        <ConfirmDialog
          label={confirm.label}
          onConfirm={confirm.onConfirm}
          onCancel={resetConfirm}
        />
      )}
      {skillModal.open && (
        <AddSkillModal
          onClose={() => setSkillModal({ open: false })}
          onSaved={(skill) => {
            setSkills((prev) =>
              skillModal.editSkill
                ? prev.map((s) => (s.id === skill.id ? skill : s))
                : [...prev.filter((s) => s.id !== skill.id), skill],
            );
            setSkillModal({ open: false });
          }}
          addedSkills={skills}
          onDeleteSkill={handleDeleteSkill}
          editSkill={skillModal.editSkill}
        />
      )}
      <div className="card p-5">
        <SectionHeader
          icon={<SkillsIcon />}
          title="Skills"
          addLabel="+ Add Skill"
          onAdd={() => setSkillModal({ open: true })}
        />
        {skills.length === 0 ? (
          <EmptyState
            icon={<SkillsIconLg />}
            message="No skills added yet."
            hint='Click "Add Skill" to showcase your expertise.'
          />
        ) : (
          <div className="rounded-xl border border-ink-200 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr>
                  {["Skill", "Proficiency", "Experience", "Top Skill", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {skills.map((s, i) => {
                  const dotColor =
                    POPULAR_SKILL_COLORS[i % POPULAR_SKILL_COLORS.length];
                  const dots = PROFICIENCY_DOTS[s.proficiency] ?? 1;
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-ink-100 last:border-0 ${i % 2 ? "bg-ink-50/20" : "bg-white"}`}
                    >
                      <td className="px-4 py-2.5 flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: dotColor }}
                        >
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-ink-800">
                          {s.name}
                        </span>
                        {s.highlighted && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-200">
                            Top
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <DotsIndicator filled={dots} />
                      </td>
                      <td className="px-4 py-2.5 text-ink-600">
                        {s.experienceValue
                          ? `${s.experienceValue} ${s.experienceUnit}`
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[12px] font-semibold ${s.highlighted ? "text-amber-600" : "text-ink-300"}`}
                        >
                          {s.highlighted ? "★ Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <Tooltip label="Edit">
                            <button
                              type="button"
                              onClick={() =>
                                setSkillModal({ open: true, editSkill: s })
                              }
                              className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"
                            >
                              <EditIcon />
                            </button>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <button
                              type="button"
                              onClick={() =>
                                triggerDelete(`Delete skill "${s.name}"?`, () =>
                                  handleDeleteSkill(s.id),
                                )
                              }
                              disabled={deletingSkillId === s.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 disabled:opacity-40 transition"
                            >
                              {deletingSkillId === s.id ? (
                                <SpinnerIcon />
                              ) : (
                                <TrashIcon />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <CertificationsSection
          certifications={certifications}
          onChange={setCertifications}
        />
      </div>
    </div>
  );
}

/* ── Preferences tab ─────────────────────────────────────────────────── */

function PreferencesTab({ data }: { data: PreferencesData }) {
  const [pref, setPref] = useState<PreferencesData>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await savePreferences(buildPreferencesPayload(pref));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}
      <div className="card">
        <PreferencesSection data={pref} onChange={setPref} />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 flex items-center gap-2 transition"
          style={{ background: "var(--gradient-brand)" }}
        >
          {isSaving ? (
            <>
              <SpinnerIcon /> Saving…
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-semibold">
            ✓ Saved
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-ink-100 ${className}`} />;
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function EditProfilePage() {
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const fetched = useRef(false);

  // Derived state — initialised once profile loads
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [resumeFileKey, setResumeFileKey] = useState("");
  const [preferences, setPreferences] = useState<PreferencesData | null>(null);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchFullProfile()
      .then((fp) => {
        setFullProfile(fp);
        setEducation(fp.educations.map(mapToEducation));
        setExperience(fp.workExperiences.map(mapToExperience));
        setSkills(fp.skills.map(mapToSkill));
        setCertifications(fp.certifications.map(mapToCertification));
        setResumeFileKey(fp.resumeFileKey ?? "");
        setPreferences(mapToPreferences(fp));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex gap-5 items-start">
        <aside className="w-[240px] shrink-0 space-y-4">
          <div className="card p-5 space-y-3 flex flex-col items-center">
            <Pulse className="w-20 h-20 rounded-full" />
            <Pulse className="h-4 w-3/4" />
            <Pulse className="h-3 w-1/2" />
          </div>
          <div className="card p-4">
            <Pulse className="h-48" />
          </div>
        </aside>
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <Pulse key={t.key} className="h-9 w-32 rounded-xl" />
            ))}
          </div>
          <Pulse className="h-64 rounded-2xl" />
        </div>
      </div>
    );

  if (error || !fullProfile)
    return (
      <div className="flex items-center justify-center h-64 text-red-600 text-[14px]">
        {error ?? "Profile not found"}
      </div>
    );

  return (
    <div className="flex gap-5 items-start">
      {/* Left panel — same as ProfilePage */}
      <ProfileLeftPanel
        fullName={fullProfile.fullName}
        jobTitle={fullProfile.currentRole}
        location={fullProfile.currentLocation}
        email={fullProfile.email}
        phone={fullProfile.phoneNumber}
        profileStrength={fullProfile.profileStrength}
        profilePicture={null}
        backHref="/profile"
        backLabel="Back to Profile"
      />

      {/* Centre — edit tabs */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div>
          <h1 className="font-display font-extrabold text-[22px] text-ink-900">
            Edit Profile
          </h1>
          <p className="text-[13.5px] text-ink-500 mt-0.5">
            Update your professional information.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap border-b border-ink-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "basic" && <BasicInfoTab profile={fullProfile} />}
          {activeTab === "experience" && (
            <ExperienceTab
              experience={experience}
              setExperience={setExperience}
              education={education}
              setEducation={setEducation}
              resumeFileKey={resumeFileKey}
              setResumeFileKey={setResumeFileKey}
            />
          )}
          {activeTab === "skills" && (
            <SkillsTab
              skills={skills}
              setSkills={setSkills}
              certifications={certifications}
              setCertifications={setCertifications}
            />
          )}
          {activeTab === "preferences" && preferences && (
            <PreferencesTab data={preferences} />
          )}
        </div>
      </div>

    </div>
  );
}
