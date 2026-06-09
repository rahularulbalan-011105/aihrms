"use client";

import { useState } from "react";
import type { CandidateRegStep3Data, Skill } from "../../../types/auth.types";
import AddSkillModal from "../modals/AddSkillModal";
import CertificationsSection from "../sections/CertificationsSection";
import PreferencesSection from "../sections/PreferencesSection";
import { deleteCandidateSkill, savePreferences, buildPreferencesPayload } from "../../../services/candidate.service";
import { PROFICIENCY_DOTS, POPULAR_SKILL_COLORS } from "../shared/constants";
import { Tooltip, ConfirmDialog, DotsIndicator } from "../shared/ui";
import {
  SkillsIcon,
  SkillsIconLg,
  EditIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SpinnerIcon,
} from "../shared/icons";
import type { ConfirmState, PreferencesData } from "../shared/types";

interface Props {
  data: CandidateRegStep3Data;
  onChange: (data: CandidateRegStep3Data) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Skills({ data, onChange, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<Skill[]>(data.skills);
  const [certs, setCerts] = useState(data.certifications);
  const [pref, setPref] = useState<PreferencesData>({
    noticePeriod: data.noticePeriod || "30 Days",
    expectedSalary: data.expectedSalary || "10 – 15 LPA",
    salaryType: data.salaryType || "Fixed",
    jobRolePreferences: data.jobRolePreferences.length
      ? data.jobRolePreferences
      : [],
    preferredLocation: data.preferredLocation || "Bangalore",
    openToRelocate: data.openToRelocate,
    employmentTypes: data.employmentTypes.length
      ? data.employmentTypes
      : ["Full Time"],
    benefits: data.benefits.length ? data.benefits : [],
    additionalNotes: data.additionalNotes,
  });

  const [skillModal, setSkillModal] = useState<{
    open: boolean;
    editSkill?: Skill;
  }>({ open: false });
  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    label: "",
    onConfirm: async () => {},
  });
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);
  const [isSaving,        setIsSaving]        = useState(false);
  const [saveError,       setSaveError]       = useState<string | null>(null);

  const confirmDelete = (label: string, action: () => Promise<void>) =>
    setConfirm({ open: true, label, onConfirm: action });

  const handleDeleteSkill = async (id: string) => {
    setConfirm({ open: false, label: "", onConfirm: async () => {} });
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

  const handleNext = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await savePreferences(buildPreferencesPayload(pref));
      onChange({ skills, certifications: certs, ...pref });
      onNext();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => { onChange({ skills, certifications: certs, ...pref }); onBack(); };

  return (
    <div className="space-y-4">
      {confirm.open && (
        <ConfirmDialog
          label={confirm.label}
          onConfirm={confirm.onConfirm}
          onCancel={() =>
            setConfirm({ open: false, label: "", onConfirm: async () => {} })
          }
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

      {/* ── Skills ── */}
      <section className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                <SkillsIcon />
              </div>
              <span className="font-display font-bold text-[15px] text-ink-900">
                Skills
                {skills.length > 0 && (
                  <span className="text-brand-500 ml-1">({skills.length})</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSkillModal({ open: true })}
              className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition"
            >
              + Add Skill
            </button>
          </div>
          <p className="text-[12px] text-ink-500 mb-3">
            Add your skills and highlight the most relevant ones. Top Skills
            appear first to recruiters.
          </p>

          {skills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 bg-white py-6 flex flex-col items-center gap-1 text-center">
              <div className="text-ink-300">
                <SkillsIconLg />
              </div>
              <div className="font-semibold text-[13px] text-ink-500">
                No skills added yet.
              </div>
              <div className="text-[12px] text-ink-400">
                Click &quot;+ Add Skill&quot; to showcase your expertise.
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-ink-200 overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-ink-50/60 border-b border-ink-200">
                  <tr>
                    {[
                      "Skill",
                      "Proficiency",
                      "Experience",
                      "Last Used",
                      "Top Skill",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s, i) => {
                    const dots = PROFICIENCY_DOTS[s.proficiency] ?? 0;
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-ink-100 last:border-0 ${i % 2 ? "bg-ink-50/20" : "bg-white"}`}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  POPULAR_SKILL_COLORS[s.name] ?? "#6366f1",
                              }}
                            />
                            <span className="font-semibold text-ink-800">
                              {s.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <DotsIndicator filled={dots} size={9} />
                            <span className="text-ink-600">
                              {s.proficiency}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">
                          {s.experienceValue
                            ? `${s.experienceValue} ${s.experienceUnit}`
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">
                          {s.lastUsed || "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {s.highlighted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-[11px] font-semibold">
                              ⭐ Top Skill
                            </span>
                          ) : (
                            <span className="text-ink-400 text-[12px]">—</span>
                          )}
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
                                  confirmDelete(
                                    `Delete skill "${s.name}"?`,
                                    () => handleDeleteSkill(s.id),
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
        </section>

      {/* ── Certifications ── */}
      <CertificationsSection certifications={certs} onChange={setCerts} />

      {/* ── Preferences ── */}
      <PreferencesSection data={pref} onChange={setPref} />

      {/* ── Actions ── */}
      {saveError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">{saveError}</div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-ink-100">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-50 transition"
        >
          <ArrowLeftIcon /> Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-[14px] hover:opacity-95 disabled:opacity-60 transition"
          style={{ background: "var(--gradient-brand)" }}
        >
          {isSaving ? <><SpinnerIcon /> Saving…</> : <>Save &amp; Continue <ArrowRightIcon /></>}
        </button>
      </div>
    </div>
  );
}
