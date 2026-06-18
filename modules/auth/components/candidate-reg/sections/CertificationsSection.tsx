"use client";

import { useState } from "react";
import type { Certification } from "../../../types/auth.types";
import AddCertificationModal from "../modals/AddCertificationModal";
import { deleteCertification } from "../../../services/candidate.service";
import { CertIcon, CertIconLg, EditIcon, TrashIcon, SpinnerIcon } from "../shared/icons";
import { Tooltip, ConfirmDialog } from "../shared/ui";
import { useConfirmDelete } from "../shared/hooks";

interface Props {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export default function CertificationsSection({ certifications, onChange }: Props) {
  const [certModal,      setCertModal]      = useState<{ open: boolean; editCert?: Certification }>({ open: false });
  const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);

  const handleDeleteCert = async (id: string) => {
    resetConfirm();
    setDeletingCertId(id);
    try {
      await deleteCertification(id);
      onChange(certifications.filter(c => c.id !== id));
    } catch { /* silently ignore */ }
    finally { setDeletingCertId(null); }
  };

  return (
    <section className="p-5">
      {confirm.open && (
        <ConfirmDialog label={confirm.label} onConfirm={confirm.onConfirm}
          onCancel={resetConfirm} />
      )}
      {certModal.open && (
        <AddCertificationModal
          existingIds={certifications.map(c => c.id)}
          onClose={() => setCertModal({ open: false })}
          onSaved={cert => {
            onChange(certModal.editCert
              ? certifications.map(c => c.id === cert.id ? cert : c)
              : [...certifications.filter(c => c.id !== cert.id), cert]
            );
            setCertModal({ open: false });
          }}
          editCert={certModal.editCert}
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0"><CertIcon /></div>
          <span className="font-display font-bold text-[15px] text-ink-900">Professional Certifications</span>
        </div>
        <button type="button" onClick={() => setCertModal({ open: true })}
          className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">+ Add Certification</button>
      </div>
      <p className="text-[12px] text-ink-500 mb-3">
        Add your certifications to showcase your credentials and stand out to recruiters.
      </p>

      {certifications.length === 0
        ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white py-6 flex flex-col items-center gap-1 text-center">
            <div className="text-ink-300"><CertIconLg /></div>
            <div className="font-semibold text-[13px] text-ink-500">No certifications added yet.</div>
            <div className="text-[12px] text-ink-400">Click &quot;+ Add Certification&quot; to showcase your achievements.</div>
          </div>
        ) : (
          <div className="rounded-xl border border-ink-200 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr>
                  {["Certification Name","Issuing Institution","Passed Year","Valid Till","Actions"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certifications.map((c, i) => (
                  <tr key={c.id} className={`border-b border-ink-100 last:border-0 ${i % 2 ? "bg-ink-50/20" : "bg-white"}`}>
                    <td className="px-4 py-2.5 font-semibold text-ink-800 max-w-[220px]">
                      <div className="truncate">{c.name}</div>
                      {c.credentialId && <div className="text-[11px] text-ink-400 font-normal">ID: {c.credentialId}</div>}
                    </td>
                    <td className="px-4 py-2.5 text-ink-600">{c.institution}</td>
                    <td className="px-4 py-2.5 text-ink-600">{c.passedYear}</td>
                    <td className="px-4 py-2.5 text-ink-600">
                      {c.doesNotExpire
                        ? <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold border border-green-200">No Expiry</span>
                        : c.validTill
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <Tooltip label="Edit">
                          <button type="button" onClick={() => setCertModal({ open: true, editCert: c })}
                            className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <button type="button"
                            onClick={() => triggerDelete(`Delete "${c.name}"?`, () => handleDeleteCert(c.id))}
                            disabled={deletingCertId === c.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 disabled:opacity-40 transition">
                            {deletingCertId === c.id ? <SpinnerIcon /> : <TrashIcon />}
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </section>
  );
}
