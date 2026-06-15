"use client";

import { useState, useRef } from "react";
import { fetchSkills, type SkillCatalogItem } from "../../../services/candidate.service";
import type { ProjectForm } from "../shared/types";
import { CalendarIconSm, TrashIcon } from "../shared/icons";

function parseDateInput(val: string): string {
  const cleaned = val.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 6)}`;
}

interface Props {
  projects: ProjectForm[];
  errors: Record<string, string>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, patch: Partial<ProjectForm>) => void;
}

export default function ProjectsSubForm({ projects, errors, onAdd, onRemove, onChange }: Props) {
  const [skillSuggestions, setSkillSuggestions] = useState<Record<number, SkillCatalogItem[]>>({});
  const skillTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const fetchSuggestions = (projectIndex: number, query: string) => {
    clearTimeout(skillTimers.current[projectIndex]);
    if (!query.trim()) { setSkillSuggestions(s => ({ ...s, [projectIndex]: [] })); return; }
    skillTimers.current[projectIndex] = setTimeout(async () => {
      const results = await fetchSkills(query.trim());
      setSkillSuggestions(s => ({ ...s, [projectIndex]: results }));
    }, 250);
  };

  const pickSuggestion = (projectIndex: number, skillName: string) => {
    const proj = projects[projectIndex];
    onChange(projectIndex, proj.skills.includes(skillName)
      ? { skillInput: "" }
      : { skills: [...proj.skills, skillName], skillInput: "" }
    );
    setSkillSuggestions(s => ({ ...s, [projectIndex]: [] }));
  };

  const commitSkill = (projectIndex: number) => {
    const proj = projects[projectIndex];
    const skill = proj.skillInput.replace(/,$/, "").trim();
    if (!skill || proj.skills.includes(skill)) { onChange(projectIndex, { skillInput: "" }); return; }
    onChange(projectIndex, { skills: [...proj.skills, skill], skillInput: "" });
  };

  const removeSkill = (projectIndex: number, skill: string) =>
    onChange(projectIndex, { skills: projects[projectIndex].skills.filter(s => s !== skill) });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-bold text-[15px] text-ink-900">
          Projects{projects.length > 0 && <span className="text-brand-500 ml-1">({projects.length})</span>}
        </span>
        <button type="button" onClick={onAdd}
          className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">
          + Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/30 py-5 text-center text-[13px] text-ink-400">
          No projects added. Click &ldquo;+ Add Project&rdquo; to include your work.
        </div>
      )}

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div key={idx} className="rounded-xl border border-ink-200 bg-ink-50/20 p-4 space-y-3">

            {/* Project header */}
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <button type="button" onClick={() => onRemove(idx)}
                className="flex items-center gap-1 text-[12px] font-semibold text-red-500 hover:text-red-600 transition">
                <TrashIcon /> Remove
              </button>
            </div>

            {/* Row 1 — Title + Role + Team Size + Duration */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input value={proj.title} onChange={e => onChange(idx, { title: e.target.value })}
                  placeholder="Enter project title"
                  className={`w-full px-3 py-2 rounded-lg border text-[13px] bg-white outline-none transition
                    ${errors[`project_${idx}_title`] ? "border-red-400" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
                {errors[`project_${idx}_title`] && <p className="mt-1 text-[11px] text-red-600">{errors[`project_${idx}_title`]}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                  Role in Project <span className="text-red-500">*</span>
                </label>
                <input value={proj.role} onChange={e => onChange(idx, { role: e.target.value })}
                  placeholder="e.g., Developer, Team Lead"
                  className={`w-full px-3 py-2 rounded-lg border text-[13px] bg-white outline-none transition
                    ${errors[`project_${idx}_role`] ? "border-red-400" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
                {errors[`project_${idx}_role`] && <p className="mt-1 text-[11px] text-red-600">{errors[`project_${idx}_role`]}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                  Team Size <span className="text-ink-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number" min="1" max="9999"
                  value={proj.teamSize}
                  onChange={e => onChange(idx, { teamSize: e.target.value.replace(/\D/g, "") })}
                  placeholder="e.g., 5"
                  className="w-full px-3 py-2 rounded-lg border border-ink-200 text-[13px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIconSm /></span>
                    <input value={proj.startDate} onChange={e => onChange(idx, { startDate: parseDateInput(e.target.value) })}
                      placeholder="MM/YYYY" maxLength={7}
                      className="w-full pl-7 pr-2 py-2 rounded-lg border border-ink-200 text-[12px] bg-white outline-none focus:border-brand-500 transition" />
                  </div>
                  <span className="text-ink-400 text-[12px] shrink-0">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIconSm /></span>
                    <input value={proj.endDate} onChange={e => onChange(idx, { endDate: parseDateInput(e.target.value) })}
                      placeholder="MM/YYYY" maxLength={7}
                      className="w-full pl-7 pr-2 py-2 rounded-lg border border-ink-200 text-[12px] bg-white outline-none focus:border-brand-500 transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea value={proj.description}
                onChange={e => onChange(idx, { description: e.target.value.slice(0, 1000) })}
                placeholder="Describe the project, your responsibilities, and the impact you created..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-[13px] bg-white outline-none resize-none transition
                  ${errors[`project_${idx}_description`] ? "border-red-400" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"}`} />
              <div className="flex items-center justify-between mt-0.5">
                {errors[`project_${idx}_description`]
                  ? <p className="text-[11px] text-red-600">{errors[`project_${idx}_description`]}</p>
                  : <span />}
                <span className="text-[11px] text-ink-400">{proj.description.length} / 1000</span>
              </div>
            </div>

            {/* Skills tag input */}
            <div className="relative">
              <label className="block text-[12px] font-semibold text-ink-700 mb-1">
                Skills Used in this Project <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition min-h-[42px]">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {proj.skills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-100 text-brand-700 rounded-md text-[12px] font-medium">
                      {skill}
                      <button type="button" onClick={() => removeSkill(idx, skill)}
                        className="text-brand-500 hover:text-brand-800 leading-none ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <input
                  value={proj.skillInput}
                  onChange={e => {
                    onChange(idx, { skillInput: e.target.value });
                    fetchSuggestions(idx, e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      commitSkill(idx);
                      setSkillSuggestions(s => ({ ...s, [idx]: [] }));
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setSkillSuggestions(s => ({ ...s, [idx]: [] })), 150);
                    if (proj.skillInput.trim()) commitSkill(idx);
                  }}
                  placeholder={proj.skills.length === 0 ? "Search or add skills" : ""}
                  className="w-full text-[13px] text-ink-700 outline-none bg-transparent" />
              </div>
              {(skillSuggestions[idx]?.length ?? 0) > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-ink-200 shadow-lg max-h-44 overflow-y-auto">
                  {skillSuggestions[idx].map(s => (
                    <li key={s.id}>
                      <button type="button" onMouseDown={() => pickSuggestion(idx, s.name)}
                        className="w-full text-left px-3 py-2 text-[13px] text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                        {s.name}
                        {s.category && <span className="text-[11px] text-ink-400 ml-2">{s.category}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[11px] text-ink-400 mt-0.5">Press Enter or comma to add a skill</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
