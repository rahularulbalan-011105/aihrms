"use client";

import { useState, useEffect } from "react";
import type { Experience } from "../../../types/auth.types";
import {
  addWorkExperience,
  updateWorkExperience,
  fetchEmploymentTypes,
  type WorkExperiencePayload,
} from "../../../services/candidate.service";
import type { ExperienceFormData, ProjectForm } from "../shared/types";
import { EMPLOYMENT_TYPE_MAP, EMPLOYMENT_TYPES } from "../shared/constants";
import { ChevronDownIcon, CalendarIcon, SpinnerIcon, BriefcaseIcon } from "../shared/icons";
import { toLabel } from "@/lib/utils";
import { isValidMMYYYY } from "../shared/validators";
import ProjectsSubForm from "./ProjectsSubForm";

/** "MM/YYYY" → "YYYY-MM-01" for LocalDate. Returns undefined for empty or "Present". */
function toLocalDate(mmYYYY: string): string | undefined {
  if (!mmYYYY || mmYYYY === "Present" || !isValidMMYYYY(mmYYYY)) return undefined;
  const [mm, yyyy] = mmYYYY.split("/");
  return `${yyyy}-${mm.padStart(2, "0")}-01`;
}

function parseDateInput(val: string): string {
  const cleaned = val.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 6)}`;
}

const EMPTY_PROJECT: ProjectForm = {
  title: "", role: "", startDate: "", endDate: "", description: "", skills: [], skillInput: "", teamSize: "",
};

const EMPTY: ExperienceFormData = {
  company: "", employmentType: "", totalExperience: "", jobTitle: "", location: "",
  noticePeriod: "", startDate: "", endDate: "", isCurrent: false,
};

interface Props {
  onClose: () => void;
  onSaved: (experience: Experience) => void;
  initialExperience?: Experience;
}

export default function AddExperienceModal({ onClose, onSaved, initialExperience }: Props) {
  const isEdit = Boolean(initialExperience);

  const [form, setForm] = useState<ExperienceFormData>(initialExperience ? {
    company:         initialExperience.company,
    employmentType:  initialExperience.employmentType,
    totalExperience: initialExperience.totalExperience,
    jobTitle:        initialExperience.jobTitle,
    location:        initialExperience.location,
    noticePeriod:    initialExperience.noticePeriod,
    startDate:       initialExperience.startDate,
    endDate:         initialExperience.isCurrent ? "" : initialExperience.endDate,
    isCurrent:       initialExperience.isCurrent,
  } : EMPTY);

  const [projects, setProjects] = useState<ProjectForm[]>(
    initialExperience?.projects.map(p => ({
      title: p.title, role: p.role, startDate: p.startDate,
      endDate: p.endDate, description: p.description,
      skills: p.technologies, skillInput: "",
      teamSize: p.teamSize ?? "",
    })) ?? []
  );

  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Employment types from backend; falls back to hardcoded constants on error
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(EMPLOYMENT_TYPES);
  const [typeMap, setTypeMap] = useState<Record<string, string>>(EMPLOYMENT_TYPE_MAP);

  useEffect(() => {
    fetchEmploymentTypes()
      .then((items) => {
        if (!items.length) return;
        // backend returns e.g. [{ name: "FULL_TIME" }]
        // Convert to display labels: "FULL_TIME" → "Full Time"
        const labels = items.map((i) => toLabel(i.name));
        const map    = Object.fromEntries(items.map((i) => [toLabel(i.name), i.name]));
        setEmploymentTypes(labels);
        setTypeMap(map);
      })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);

  const set = <K extends keyof ExperienceFormData>(k: K, v: ExperienceFormData[K]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const setProject = (index: number, patch: Partial<ProjectForm>) => {
    setProjects(ps => ps.map((p, i) => i === index ? { ...p, ...patch } : p));
    const cleared = Object.fromEntries(Object.keys(patch).map(k => [`project_${index}_${k}`, ""]));
    setErrors(e => ({ ...e, ...cleared }));
  };

  const addProject    = () => setProjects(ps => [...ps, { ...EMPTY_PROJECT }]);
  const removeProject = (index: number) => setProjects(ps => ps.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.company.trim())  errs.company  = "Company Name is required";
    if (!form.jobTitle.trim()) errs.jobTitle = "Job Title is required";
    if (!form.location.trim()) errs.location = "Location is required";

    if (!form.startDate.trim()) {
      errs.startDate = "Start Date is required";
    } else if (!isValidMMYYYY(form.startDate)) {
      errs.startDate = "Enter a valid date (MM/YYYY, month 01–12, year 1950–2100)";
    }

    if (!form.isCurrent) {
      if (!form.endDate.trim()) {
        errs.endDate = "End Date is required";
      } else if (!isValidMMYYYY(form.endDate)) {
        errs.endDate = "Enter a valid date (MM/YYYY, month 01–12, year 1950–2100)";
      } else if (form.startDate && isValidMMYYYY(form.startDate)) {
        if (toLocalDate(form.endDate)! < toLocalDate(form.startDate)!) {
          errs.endDate = "End Date must be after Start Date";
        }
      }
    }

    projects.forEach((p, i) => {
      if (!p.title.trim())       errs[`project_${i}_title`]       = "Project Title is required";
      if (!p.role.trim())        errs[`project_${i}_role`]        = "Role is required";
      if (!p.description.trim()) errs[`project_${i}_description`] = "Description is required";
      if (p.startDate && !isValidMMYYYY(p.startDate)) errs[`project_${i}_startDate`] = "Invalid date";
      if (p.endDate   && !isValidMMYYYY(p.endDate))   errs[`project_${i}_endDate`]   = "Invalid date";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    try {
      const payload: WorkExperiencePayload = {
        companyName:      form.company.trim(),
        jobTitle:         form.jobTitle.trim(),
        employmentType:   typeMap[form.employmentType] ?? "FULL_TIME",
        location:         form.location.trim() || undefined,
        startDate:        toLocalDate(form.startDate) ?? form.startDate,
        endDate:          form.isCurrent ? null : (toLocalDate(form.endDate) ?? undefined),
        currentlyWorking: form.isCurrent,
        noticePeriod:     form.noticePeriod.trim() || undefined,
        projects: projects.map(p => ({
          projectName:      p.title.trim(),
          roleName:         p.role.trim() || undefined,
          description:      p.description.trim() || undefined,
          startDate:        toLocalDate(p.startDate),
          endDate:          toLocalDate(p.endDate),
          teamSize:         p.teamSize ? Number(p.teamSize) : undefined,
          technologiesUsed: p.skills.join(", ") || undefined,
        })),
      };

      let backendId: string;
      if (isEdit && initialExperience) {
        await updateWorkExperience(initialExperience.id, payload);
        backendId = initialExperience.id;
      } else {
        backendId = await addWorkExperience(payload);
      }

      const experience: Experience = {
        id:              backendId,
        company:         form.company.trim(),
        employmentType:  form.employmentType,
        totalExperience: form.totalExperience.trim(),
        jobTitle:        form.jobTitle.trim(),
        location:        form.location.trim(),
        noticePeriod:    form.noticePeriod.trim(),
        startDate:       form.startDate,
        endDate:         form.isCurrent ? "Present" : form.endDate,
        isCurrent:       form.isCurrent,
        expanded:        false,
        projects: projects.map(p => ({
          id:           crypto.randomUUID(),
          title:        p.title.trim(),
          role:         p.role.trim(),
          startDate:    p.startDate,
          endDate:      p.endDate,
          description:  p.description.trim(),
          teamSize:     p.teamSize,
          technologies: p.skills,
        })),
      };
      onSaved(experience);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save experience");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[780px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <BriefcaseIcon />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[20px] text-ink-900">{isEdit ? "Edit Experience" : "Add Experience"}</h2>
              <p className="text-[12.5px] text-ink-500 mt-0.5">Add your work experience and the projects you&apos;ve worked on.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center text-ink-600 transition shrink-0 mt-0.5">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">

          {apiError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">{apiError}</div>
          )}

          {/* Row 1 — Company + Employment Type + Total Experience */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input value={form.company} onChange={e => set("company", e.target.value)}
                placeholder="Enter company name"
                className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                  ${errors.company ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              {errors.company && <p className="mt-1 text-[12px] text-red-600">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Employment Type</label>
              <div className="relative">
                <select value={form.employmentType} onChange={e => set("employmentType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] text-ink-700 bg-white outline-none appearance-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option value="">Select employment type</option>
                  {employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Total Experience at Company <span className="text-red-500">*</span>
              </label>
              <input value={form.totalExperience}
                onChange={e => set("totalExperience", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="e.g., 2.5" maxLength={5}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          </div>

          {/* Row 2 — Job Title + Location + Notice Period */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)}
                placeholder="Enter your job title"
                className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                  ${errors.jobTitle ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              {errors.jobTitle && <p className="mt-1 text-[12px] text-red-600">{errors.jobTitle}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input value={form.location} onChange={e => set("location", e.target.value)}
                placeholder="Enter city"
                className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                  ${errors.location ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              <p className="text-[11px] text-ink-400 mt-0.5">City, State, Country</p>
              {errors.location && <p className="text-[12px] text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Notice Period <span className="text-ink-400 font-normal">(Optional)</span>
              </label>
              <input value={form.noticePeriod}
                onChange={e => set("noticePeriod", e.target.value.replace(/\D/g, ""))}
                placeholder="e.g., 30" maxLength={4}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          </div>

          {/* Row 3 — Start Date + End Date + Currently working */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIcon /></span>
                <input value={form.startDate} onChange={e => set("startDate", parseDateInput(e.target.value))}
                  placeholder="MM / YYYY" maxLength={7}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                    ${errors.startDate ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              </div>
              {errors.startDate && <p className="mt-1 text-[12px] text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                End Date {form.isCurrent
                  ? <span className="text-ink-400 font-normal">(Optional)</span>
                  : <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIcon /></span>
                <input value={form.endDate} onChange={e => set("endDate", parseDateInput(e.target.value))}
                  placeholder="MM / YYYY" maxLength={7} disabled={form.isCurrent}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                    ${form.isCurrent ? "opacity-40 cursor-not-allowed bg-ink-50 border-ink-200"
                      : errors.endDate ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              </div>
              {errors.endDate && <p className="mt-1 text-[12px] text-red-600">{errors.endDate}</p>}
            </div>

            <div className="pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isCurrent}
                  onChange={e => { set("isCurrent", e.target.checked); if (e.target.checked) set("endDate", ""); }}
                  className="w-4 h-4 accent-brand-600" />
                <span className="text-[13px] text-ink-700">I am currently working here</span>
              </label>
            </div>
          </div>

          {/* Projects */}
          <ProjectsSubForm
            projects={projects}
            errors={errors}
            onAdd={addProject}
            onRemove={removeProject}
            onChange={setProject}
          />

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink-100">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isSaving}
            className="px-8 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 flex items-center gap-2 transition"
            style={{ background: "var(--gradient-brand)" }}>
            {isSaving ? <><SpinnerIcon /> Saving…</> : isEdit ? "Update Experience" : "Save Experience"}
          </button>
        </div>

      </div>
    </div>
  );
}
