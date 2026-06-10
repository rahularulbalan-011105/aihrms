"use client";

import { useState } from "react";
import type { CandidateRegStep2Data, Experience } from "../../../types/auth.types";
import AddExperienceModal from "../modals/AddExperienceModal";
import EducationSection from "../sections/EducationSection";
import StepActions from "../StepActions";
import UploadResumeBanner from "../sections/UploadResumeBanner";
import { deleteWorkExperience } from "../../../services/candidate.service";
import {
  BriefcaseIcon, BriefcaseIconLg, EditIcon, TrashIcon, SpinnerIcon, ChevronIcon,
} from "../shared/icons";
import { Tooltip, ConfirmDialog, SectionHeader, EmptyState } from "../shared/ui";
import { useConfirmDelete } from "../shared/hooks";

interface Props {
  data: CandidateRegStep2Data;
  onChange: (data: CandidateRegStep2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExpModalState {
  open: boolean;
  initialExperience?: Experience;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(mmYYYY: string): string {
  if (!mmYYYY || mmYYYY === "Present") return mmYYYY;
  const [mm, yyyy] = mmYYYY.split("/");
  return mm && yyyy ? `${MONTHS[parseInt(mm, 10) - 1]} ${yyyy}` : mmYYYY;
}

export default function Step2Professional({ data, onChange, onNext, onBack }: Props) {
  const [education, setEducation]     = useState(data.education);
  const [experience, setExperience]   = useState<Experience[]>(data.experience);
  const [expandedExp, setExpandedExp] = useState<Set<string>>(new Set(data.experience.map((e) => e.id)));
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null);
  const [expModal, setExpModal]       = useState<ExpModalState>({ open: false });
  const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();

  const handleNext = () => { onChange({ education, experience }); onNext(); };
  const handleBack = () => { onChange({ education, experience }); onBack(); };

  const handleDeleteExperience = async (id: string) => {
    resetConfirm();
    setDeletingExpId(id);
    try {
      await deleteWorkExperience(id);
      setExperience((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // silently ignore — user can retry
    } finally {
      setDeletingExpId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedExp((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
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

      {/* ── Education Details ── */}
      <EducationSection education={education} onChange={setEducation} />

      {/* ── Professional Experience ── */}
      <section>
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
            hint='Click "Add Experience" to include your professional experience.'
          />
        ) : (
          <div className="space-y-3">
            {experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                expanded={expandedExp.has(exp.id)}
                onToggle={() => toggleExpand(exp.id)}
                onEdit={() => setExpModal({ open: true, initialExperience: exp })}
                onDelete={() => triggerDelete(`Delete experience at "${exp.company}"?`, () => handleDeleteExperience(exp.id))}
                isDeleting={deletingExpId === exp.id}
                onDeleteProject={(projId) => {
                  setExperience((prev) =>
                    prev.map((e) =>
                      e.id === exp.id
                        ? { ...e, projects: e.projects.filter((p) => p.id !== projId) }
                        : e,
                    ),
                  );
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Upload Resume Banner ── */}
      <UploadResumeBanner />

      {/* ── Actions ── */}
      <StepActions onBack={handleBack} onNext={handleNext} />
    </div>
  );
}

/* ── Experience Card ── */
function ExperienceCard({ exp, expanded, onToggle, onEdit, onDelete, isDeleting, onDeleteProject }: {
  exp: Experience; expanded: boolean; isDeleting: boolean;
  onToggle: () => void; onEdit: () => void; onDelete: () => void;
  onDeleteProject: (projId: string) => void;
}) {
  const duration = `${fmtDate(exp.startDate)} – ${fmtDate(exp.endDate)}`;
  const noticePeriodDisplay = exp.noticePeriod
    ? isNaN(Number(exp.noticePeriod)) ? exp.noticePeriod : `${exp.noticePeriod} Days`
    : "—";

  return (
    <div className="rounded-xl border border-ink-200 bg-white">
      {/* Row 1: Company | Employment Type | Duration | Total Experience | Actions */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-x-4 px-4 pt-3 pb-2 items-start">
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Company</div>
          <div className="font-bold text-[13.5px] text-ink-900">{exp.company}</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Employment Type</div>
          <div className="font-semibold text-[13px] text-ink-700">{exp.employmentType || "—"}</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Duration</div>
          <div className="font-semibold text-[13px] text-ink-700">{duration}</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Total Experience</div>
          <div className="font-semibold text-[13px] text-ink-700">
            {exp.totalExperience ? `${exp.totalExperience} Yrs` : "—"}
          </div>
        </div>
        <div className="flex items-center gap-1 pt-3.5">
          <Tooltip label="Edit">
            <button type="button" onClick={onEdit} aria-label="Edit experience"
              className="p-1.5 rounded-lg hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
          </Tooltip>
          <Tooltip label="Delete">
            <button type="button" onClick={onDelete} disabled={isDeleting} aria-label="Delete experience"
              className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 disabled:opacity-40 transition">
              {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
            </button>
          </Tooltip>
          <Tooltip label={expanded ? "Collapse" : "Expand"}>
            <button type="button" onClick={onToggle} aria-label={expanded ? "Collapse projects" : "Expand projects"}
              className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition">
              <ChevronIcon expanded={expanded} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Row 2: Job Title | Location | Notice Period */}
      <div className="grid grid-cols-3 gap-x-4 px-4 pb-3 border-b border-ink-100">
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Job Title</div>
          <div className="font-semibold text-[13px] text-ink-700">{exp.jobTitle || "—"}</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Location</div>
          <div className="font-semibold text-[13px] text-ink-700">{exp.location || "—"}</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-400 mb-0.5">Notice Period</div>
          <div className="font-semibold text-[13px] text-ink-700">{noticePeriodDisplay}</div>
        </div>
      </div>

      {/* Projects — only shown when expanded */}
      {expanded && (
        <div className="rounded-b-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="font-semibold text-[13.5px] text-brand-700">
              Projects{exp.projects.length > 0 && <span className="ml-1">({exp.projects.length})</span>}
            </span>
            <button type="button" onClick={onEdit}
              className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 transition">
              + Add Project
            </button>
          </div>

          {exp.projects.length === 0 ? (
            <div className="px-4 pb-3 text-[12px] text-ink-400">No projects added.</div>
          ) : (
            <table className="w-full text-[12.5px] border-t border-ink-100">
              <thead className="bg-ink-50/60">
                <tr>
                  {["Project Details","Role & Duration","Team Size","Technologies Used","Actions"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[11.5px] font-semibold text-ink-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exp.projects.map((proj) => {
                  const techs = typeof proj.technologies === "string"
                    ? (proj.technologies as string).split(",").map((t) => t.trim()).filter(Boolean)
                    : proj.technologies;
                  return (
                    <tr key={proj.id} className="border-t border-ink-100 align-top">
                      <td className="px-4 py-2.5 max-w-[220px]">
                        <div className="font-semibold text-ink-800">{proj.title}</div>
                        {proj.description && (
                          <div className="text-ink-500 text-[11.5px] mt-0.5 line-clamp-2">{proj.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {proj.role && <div className="text-ink-700"><span className="text-ink-400">Role:</span> {proj.role}</div>}
                        <div className="text-ink-500 text-[11.5px] mt-0.5">{fmtDate(proj.startDate)} – {fmtDate(proj.endDate)}</div>
                      </td>
                      <td className="px-4 py-2.5 text-center text-ink-600">{proj.teamSize || "—"}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {techs.map((t, ti) => (
                            <span key={`${proj.id}_${ti}_${t}`}
                              className="px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded text-[11px] font-medium">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <Tooltip label="Edit experience">
                            <button type="button" onClick={onEdit} aria-label="Edit experience to manage projects"
                              className="p-1 rounded hover:bg-brand-50 text-ink-400 hover:text-brand-600 transition"><EditIcon /></button>
                          </Tooltip>
                          <Tooltip label="Remove project">
                            <button type="button" onClick={() => onDeleteProject(proj.id)} aria-label="Remove project"
                              className="p-1 rounded hover:bg-red-50 text-ink-400 hover:text-red-500 transition"><TrashIcon /></button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
