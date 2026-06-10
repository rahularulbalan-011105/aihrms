"use client";

import { useState } from "react";
import type { Certification } from "../../../types/auth.types";
import { addCertification, updateCertification } from "../../../services/candidate.service";
import type { CertificationFormData } from "../shared/types";
import { MONTHS_LONG, PAST_YEARS, FUTURE_YEARS } from "../shared/constants";
import { CertBadgeIcon, InfoIcon, LinkIcon, CalendarIcon, ChevronDownIcon, UploadCloudIcon, SpinnerIcon } from "../shared/icons";

const EMPTY: CertificationFormData = {
  name: "", institution: "", credentialId: "", certificateUrl: "",
  passedYear: "", validTillMonth: "", validTillYear: "",
  doesNotExpire: false, description: "", displayOnProfile: true,
};

interface Props {
  onClose: () => void;
  onSaved: (cert: Certification) => void;
  editCert?: Certification;
}

export default function AddCertificationModal({ onClose, onSaved, editCert }: Props) {
  const isEdit = Boolean(editCert);

  const [form, setForm] = useState<CertificationFormData>(editCert ? {
    name:            editCert.name,
    institution:     editCert.institution,
    credentialId:    editCert.credentialId   ?? "",
    certificateUrl:  editCert.certificateUrl ?? "",
    passedYear:      editCert.passedYear,
    validTillMonth:  (editCert.doesNotExpire || !editCert.validTill || editCert.validTill === "Does not expire" || editCert.validTill === "—")
      ? "" : editCert.validTill.split(" ")[0] ?? "",
    validTillYear:   (editCert.doesNotExpire || !editCert.validTill || editCert.validTill === "Does not expire" || editCert.validTill === "—")
      ? "" : editCert.validTill.split(" ")[1] ?? "",
    doesNotExpire:   editCert.doesNotExpire ?? false,
    description:     editCert.description   ?? "",
    displayOnProfile: editCert.displayOnProfile ?? true,
  } : EMPTY);

  const [errors, setErrors]     = useState<Partial<Record<keyof CertificationFormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const set = <K extends keyof CertificationFormData>(k: K, v: CertificationFormData[K]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof CertificationFormData, string>> = {};
    if (!form.name.trim())        errs.name        = "Certification Name is required";
    if (!form.institution.trim()) errs.institution  = "Issuing Institution is required";
    if (!form.passedYear)         errs.passedYear   = "Passed Year is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);

    const MONTHS_LONG_MAP: Record<string, string> = {
      January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",
      July:"07",August:"08",September:"09",October:"10",November:"11",December:"12",
    };
    const validTillISO = !form.doesNotExpire && form.validTillYear
      ? `${form.validTillYear}-${MONTHS_LONG_MAP[form.validTillMonth] ?? "01"}-01`
      : undefined;
    const validTillDisplay = form.doesNotExpire
      ? "Does not expire"
      : form.validTillMonth && form.validTillYear
        ? `${form.validTillMonth} ${form.validTillYear}`
        : form.validTillYear || "—";

    const payload = {
      certificationName:  form.name.trim(),
      issuingInstitution: form.institution.trim(),
      credentialId:       form.credentialId.trim()   || undefined,
      certificateUrl:     form.certificateUrl.trim() || undefined,
      passedYear:         form.passedYear ? parseInt(form.passedYear) : undefined,
      validTill:          validTillISO,
      doesNotExpire:      form.doesNotExpire,
      displayOnProfile:   form.displayOnProfile,
      description:        form.description.trim() || undefined,
    };

    try {
      let certId: string;
      if (isEdit && editCert) {
        await updateCertification(editCert.id, payload);
        certId = editCert.id;
      } else {
        certId = await addCertification(payload);
      }
      onSaved({
        id: certId,
        name:            form.name.trim(),
        institution:     form.institution.trim(),
        credentialId:    form.credentialId.trim()   || undefined,
        certificateUrl:  form.certificateUrl.trim() || undefined,
        passedYear:      form.passedYear,
        validTill:       validTillDisplay,
        doesNotExpire:   form.doesNotExpire,
        description:     form.description.trim() || undefined,
        displayOnProfile: form.displayOnProfile,
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save certification");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <CertBadgeIcon />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[20px] text-ink-900">
                {isEdit ? "Edit Certification" : "Add Certification"}
              </h2>
              <p className="text-[12.5px] text-ink-500 mt-0.5">
                Add your professional certifications to showcase your achievements.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center text-ink-600 transition shrink-0 mt-0.5">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Row 1 — Name + Institution */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Certification Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input value={form.name} onChange={e => set("name", e.target.value.slice(0, 120))}
                  placeholder="Enter certification name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                    ${errors.name ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
                <span className="absolute right-3 bottom-2.5 text-[11px] text-ink-400">{form.name.length}/120</span>
              </div>
              {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Issuing Institution / Organization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input value={form.institution} onChange={e => set("institution", e.target.value.slice(0, 120))}
                  placeholder="Enter institution or organization name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-[13.5px] bg-white outline-none transition
                    ${errors.institution ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
                <span className="absolute right-3 bottom-2.5 text-[11px] text-ink-400">{form.institution.length}/120</span>
              </div>
              {errors.institution && <p className="mt-1 text-[12px] text-red-600">{errors.institution}</p>}
            </div>
          </div>

          {/* Row 2 — Credential ID + Certificate URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="text-[13px] font-semibold text-ink-700">Credential ID</label>
                <span className="text-ink-400 font-normal text-[13px]">(Optional)</span>
                <button type="button" title="The unique ID printed on your certificate" className="text-ink-400 hover:text-ink-600 ml-0.5 transition"><InfoIcon /></button>
              </div>
              <input value={form.credentialId} onChange={e => set("credentialId", e.target.value)}
                placeholder="Enter credential ID / license number"
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="text-[13px] font-semibold text-ink-700">Certificate URL</label>
                <span className="text-ink-400 font-normal text-[13px]">(Optional)</span>
                <button type="button" title="Link to verify your certificate online" className="text-ink-400 hover:text-ink-600 ml-0.5 transition"><InfoIcon /></button>
              </div>
              <div className="relative">
                <input value={form.certificateUrl} onChange={e => set("certificateUrl", e.target.value)}
                  placeholder="Enter certificate URL"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"><LinkIcon /></span>
              </div>
            </div>
          </div>

          {/* Row 3 — Passed Year + Valid Till */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Passed Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIcon /></span>
                <select value={form.passedYear} onChange={e => set("passedYear", e.target.value)}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-xl border text-[13px] bg-white outline-none appearance-none transition
                    ${errors.passedYear ? "border-red-400" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`}>
                  <option value="">Select passed year</option>
                  {PAST_YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
              </div>
              {errors.passedYear && <p className="mt-1 text-[12px] text-red-600">{errors.passedYear}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                Valid Till <span className="text-ink-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIcon /></span>
                    <select value={form.validTillMonth} onChange={e => set("validTillMonth", e.target.value)}
                      disabled={form.doesNotExpire}
                      className="w-full pl-8 pr-6 py-2.5 rounded-xl border border-ink-200 text-[12px] bg-white outline-none appearance-none focus:border-brand-500 transition disabled:opacity-40">
                      <option value="">Month</option>
                      {MONTHS_LONG.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
                  </div>
                  <div className="relative">
                    <select value={form.validTillYear} onChange={e => set("validTillYear", e.target.value)}
                      disabled={form.doesNotExpire}
                      className="w-full px-3 pr-6 py-2.5 rounded-xl border border-ink-200 text-[12px] bg-white outline-none appearance-none focus:border-brand-500 transition disabled:opacity-40">
                      <option value="">Year</option>
                      {FUTURE_YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <input type="checkbox" checked={form.doesNotExpire}
                    onChange={e => { set("doesNotExpire", e.target.checked); if (e.target.checked) { set("validTillMonth", ""); set("validTillYear", ""); } }}
                    className="w-4 h-4 rounded accent-brand-600" />
                  <span className="text-[12px] text-ink-600 whitespace-nowrap">Does not expire</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
              Description <span className="text-ink-400 font-normal">(Optional)</span>
            </label>
            <textarea value={form.description}
              onChange={e => set("description", e.target.value.slice(0, 500))}
              placeholder="Add a brief description about this certification"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none transition" />
            <div className="text-right text-[11px] text-ink-400 mt-0.5">{form.description.length}/500</div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
              Certificate <span className="text-ink-400 font-normal">(Optional)</span>
            </label>
            <div className="rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/20 px-6 py-6 flex items-center gap-4 cursor-pointer hover:bg-brand-50/40 hover:border-brand-400 transition group">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-200 transition">
                <UploadCloudIcon />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-ink-700">
                  Drag &amp; drop file here or{" "}
                  <span className="text-brand-600 hover:text-brand-700">browse</span>
                </div>
                <div className="text-[12px] text-ink-500 mt-0.5">Supports PDF, JPG, PNG (Max 5MB)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ink-100">
          {apiError && (
            <div className="mx-6 mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
              {apiError}
            </div>
          )}
          <div className="flex items-center justify-between px-6 py-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.displayOnProfile}
                onChange={e => set("displayOnProfile", e.target.checked)}
                className="w-4 h-4 rounded accent-brand-600" />
              <div>
                <div className="text-[13px] font-semibold text-ink-700">Display on my profile</div>
                <div className="text-[11.5px] text-ink-400">This certification will be visible to recruiters on your profile.</div>
              </div>
            </label>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={onClose} disabled={isSaving}
                className="px-6 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-50 transition">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 transition"
                style={{ background: "var(--gradient-brand)" }}>
                {isSaving ? <><SpinnerIcon /> Saving…</> : isEdit ? "Update Certification" : "Save Certification"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
