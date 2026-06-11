"use client";

import { useState } from "react";
import type { Education } from "../../../types/auth.types";
import AddEducationModal from "../modals/AddEducationModal";
import { deleteEducation } from "../../../services/candidate.service";
import { GradIcon, GradIconLg, EditIcon, TrashIcon, SpinnerIcon } from "../shared/icons";
import { Tooltip, ConfirmDialog, SectionHeader, EmptyState } from "../shared/ui";
import type { EduModalState } from "../shared/types";

interface Props {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationSection({ education, onChange }: Props) {
  const [eduModal, setEduModal]       = useState<EduModalState>({ open: false });
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [confirm, setConfirm]         = useState<{ open: boolean; label: string; id: string }>({ open: false, label: "", id: "" });

  const handleDelete = async () => {
    setConfirm((prev) => ({ ...prev, open: false }));
    setDeletingId(confirm.id);
    try {
      await deleteEducation(confirm.id);
      onChange(education.filter((e) => e.id !== confirm.id));
    } catch {
      // silently ignore — user can retry
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      {confirm.open && (
        <ConfirmDialog
          label={confirm.label}
          onConfirm={handleDelete}
          onCancel={() => setConfirm({ open: false, label: "", id: "" })}
        />
      )}
      {eduModal.open && (
        <AddEducationModal
          onClose={() => setEduModal({ open: false })}
          onSaved={(edu) => {
            onChange(
              eduModal.editId
                ? education.map((e) => (e.id === edu.id ? edu : e))
                : [...education.filter((e) => e.id !== edu.id), edu],
            );
            setEduModal({ open: false });
          }}
          editId={eduModal.editId}
          initialData={eduModal.initialData}
          existingAttachments={eduModal.existingAttachments}
        />
      )}

      <SectionHeader
        icon={<GradIcon />}
        title="Education Details"
        addLabel="+ Add Education"
        onAdd={() => setEduModal({ open: true })}
      />

      {education.length === 0 ? (
        <EmptyState
          icon={<GradIconLg />}
          message="No education added yet."
          hint='Click "Add Education" to include your educational background.'
        />
      ) : (
        <div className="rounded-xl border border-ink-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-ink-50/60 border-b border-ink-200">
              <tr>
                {["Degree / Course", "Institute / University", "Specialization", "Year of Passing", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((edu, i) => (
                <tr key={edu.id} className={`border-b border-ink-100 last:border-0 ${i % 2 ? "bg-ink-50/20" : "bg-white"}`}>
                  <td className="px-4 py-2.5 font-semibold text-ink-800">{edu.degree}</td>
                  <td className="px-4 py-2.5 text-ink-700">{edu.institution}</td>
                  <td className="px-4 py-2.5 text-ink-600">{edu.specialization || "—"}</td>
                  <td className="px-4 py-2.5 text-ink-600 whitespace-nowrap">{edu.yearOfPassing || "—"}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <Tooltip label="Edit">
                        <button type="button"
                          onClick={() => setEduModal({
                            open: true, editId: edu.id,
                            initialData: {
                              degree: edu.degree, institution: edu.institution,
                              specialization: edu.specialization, location: edu.location,
                              yearOfPassing: edu.yearOfPassing, grade: edu.grade,
                              educationType: edu.educationType, description: edu.description,
                            },
                            existingAttachments: edu.attachmentFileKeys ?? [],
                          })}
                          className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition">
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <button type="button"
                          onClick={() => setConfirm({ open: true, label: `Delete "${edu.degree}" from ${edu.institution}?`, id: edu.id })}
                          disabled={deletingId === edu.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 disabled:opacity-40 transition">
                          {deletingId === edu.id ? <SpinnerIcon /> : <TrashIcon />}
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
