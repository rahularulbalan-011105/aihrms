"use client";

import { useState, useEffect } from "react";
import {
  fetchDegreeCourses,
  fetchEducationTypes,
  addEducation,
  updateEducation,
  type DegreeCourse,
  type EducationTypeItem,
} from "../../../services/candidate.service";
import type { Education } from "../../../types/auth.types";
import type { EducationFormData } from "../shared/types";
import { ChevronDownIcon, CalendarIcon, UploadCloudIcon, SpinnerIcon } from "../shared/icons";

interface Props {
  onClose: () => void;
  onSaved: (education: Education) => void;
  editId?: string;
  initialData?: Partial<EducationFormData>;
}

const EMPTY: EducationFormData = {
  degree: "", specialization: "", institution: "", location: "",
  yearOfPassing: "", grade: "", educationType: "", description: "",
};

export default function AddEducationModal({ onClose, onSaved, editId, initialData }: Props) {
  const [form, setForm]         = useState<EducationFormData>({ ...EMPTY, ...initialData });
  const [errors, setErrors]     = useState<Partial<Record<keyof EducationFormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [degrees, setDegrees]         = useState<DegreeCourse[]>([]);
  const [eduTypes, setEduTypes]       = useState<EducationTypeItem[]>([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  const isEdit = Boolean(editId);

  useEffect(() => {
    Promise.all([fetchDegreeCourses(), fetchEducationTypes()])
      .then(([deg, types]) => {
        setDegrees(deg);
        setEduTypes(types);
        if (types.length && !initialData?.educationType)
          setForm((f) => ({ ...f, educationType: types[0].name }));
      })
      .finally(() => setLoadingMaster(false));
  }, []);

  const set = <K extends keyof EducationFormData>(k: K, v: EducationFormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof EducationFormData, string>> = {};
    if (!form.degree) errs.degree = "Degree / Course is required";
    if (!form.institution.trim()) errs.institution = "Institute / University is required";
    if (!form.location.trim()) errs.location = "Location is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    const payload = {
      degree:         form.degree,
      institution:    form.institution.trim(),
      specialization: form.specialization.trim() || undefined,
      location:       form.location.trim(),
      yearOfPassing:  form.yearOfPassing.trim() || undefined,
      grade:          form.grade.trim() || undefined,
      educationType:  form.educationType || undefined,
      description:    form.description.trim() || undefined,
    };
    try {
      let backendId: string;
      if (isEdit && editId) {
        await updateEducation(editId, payload);
        backendId = editId;
      } else {
        backendId = await addEducation(payload);
      }
      onSaved({
        id:            backendId,
        degree:        form.degree,
        institution:   form.institution.trim(),
        specialization: form.specialization.trim(),
        location:      form.location.trim(),
        yearOfPassing: form.yearOfPassing.trim(),
        grade:         form.grade.trim(),
        educationType: form.educationType,
        description:   form.description.trim(),
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save education");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-ink-100">
          <div>
            <h2 className="font-display font-extrabold text-[20px] text-ink-900">{isEdit ? "Edit Education" : "Add Education"}</h2>
            <p className="text-[13px] text-ink-500 mt-0.5">Add your educational qualification details</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center text-ink-600 transition shrink-0 mt-0.5">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {apiError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">{apiError}</div>
          )}

          {/* Row 1 — Degree + Specialization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Degree / Course <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.degree} onChange={(e) => set("degree", e.target.value)} disabled={loadingMaster}
                  className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] text-ink-700 bg-white outline-none appearance-none transition ${errors.degree ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`}>
                  <option value="">Select degree or course</option>
                  {degrees.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
              </div>
              {errors.degree && <p className="mt-1 text-[12px] text-red-600">{errors.degree}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Specialization <span className="text-ink-400 font-normal">(Optional)</span></label>
              <input value={form.specialization} onChange={(e) => set("specialization", e.target.value)}
                placeholder="e.g., Computer Science, Finance"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          </div>

          {/* Row 2 — Institute + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Institute / University <span className="text-red-500">*</span></label>
              <input value={form.institution} onChange={(e) => set("institution", e.target.value)}
                placeholder="Enter institute or university name"
                className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition ${errors.institution ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              {errors.institution && <p className="mt-1 text-[12px] text-red-600">{errors.institution}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Location <span className="text-red-500">*</span></label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder="City, State, Country"
                className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition ${errors.location ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              {errors.location && <p className="mt-1 text-[12px] text-red-600">{errors.location}</p>}
            </div>
          </div>

          {/* Row 3 — Year of Passing + Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Year of Passing</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><CalendarIcon /></span>
                <input value={form.yearOfPassing} onChange={(e) => set("yearOfPassing", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="e.g., 2023" maxLength={4}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
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
              {loadingMaster
                ? <span className="text-[13px] text-ink-400">Loading…</span>
                : eduTypes.map((t) => (
                  <label key={t.name} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="eduType" value={t.name} checked={form.educationType === t.name}
                      onChange={() => set("educationType", t.name)} className="accent-brand-600 w-4 h-4" />
                    <span className="text-[13px] text-ink-700">{t.name}</span>
                  </label>
                ))
              }
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Description <span className="text-ink-400 font-normal">(Optional)</span></label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value.slice(0, 1000))}
              placeholder="Add any relevant details about your education" rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none transition" />
            <div className="text-right text-[11px] text-ink-400 mt-0.5">{form.description.length} / 1000</div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">Attachments <span className="text-ink-400 font-normal">(Optional)</span></label>
            <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50/40 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-brand-50/30 hover:border-brand-300 transition">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0"><UploadCloudIcon /></div>
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
          <button type="button" onClick={handleSave} disabled={isSaving || loadingMaster}
            className="px-8 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 flex items-center gap-2 transition"
            style={{ background: "var(--gradient-brand)" }}>
            {isSaving ? <><SpinnerIcon /> Saving…</> : isEdit ? "Update Education" : "Save Education"}
          </button>
        </div>
      </div>
    </div>
  );
}
