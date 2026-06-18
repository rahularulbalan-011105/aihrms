"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchSkills, addCandidateSkill, updateCandidateSkill, buildSkillPayload,
  type SkillCatalogItem,
} from "../../../services/candidate.service";
import type { Skill } from "../../../types/auth.types";
import { PROFICIENCY_LEVELS, LAST_USED_OPTIONS } from "../shared/constants";
import { DotsIndicator } from "../shared/ui";
import {
  SkillIcon, InfoIcon, CalendarIcon, ChevronDownIcon, PlusIcon, TrashSmIcon, SpinnerIcon,
} from "../shared/icons";
import SkillLeftPanel from "./SkillLeftPanel";

interface Props {
  onClose: () => void;
  onSaved: (skill: Skill) => void;
  addedSkills: Skill[];
  onDeleteSkill: (id: string) => void;
  editSkill?: Skill;
}

export default function AddSkillModal({ onClose, onSaved, addedSkills, onDeleteSkill, editSkill }: Props) {
  const isEdit = Boolean(editSkill);

  const [selectedName, setSelectedName]   = useState(editSkill?.name ?? "");
  const [proficiency, setProficiency]     = useState(editSkill?.proficiency ?? "Advanced");
  const [expValue, setExpValue]           = useState(editSkill?.experienceValue ?? "");
  const [expUnit, setExpUnit]             = useState(editSkill?.experienceUnit ?? "Years");
  const [lastUsed, setLastUsed]           = useState(editSkill?.lastUsed ?? LAST_USED_OPTIONS[0]);
  const [highlighted, setHighlighted]     = useState(editSkill?.highlighted ?? false);
  const [addDetails, setAddDetails]       = useState(editSkill?.additionalDetails ?? "");
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<SkillCatalogItem[]>([]);
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [isSaving, setIsSaving]           = useState(false);
  const [apiError, setApiError]           = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      const res = await fetchSkills(searchQuery.trim());
      setSearchResults(res.slice(0, 8));
    }, 250);
  }, [searchQuery]);

  const selectSkill = (name: string, color: string) => {
    setSelectedName(name);
    setSelectedColor(color);
    setSearchQuery("");
    setSearchResults([]);
    setErrors(e => ({ ...e, name: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedName.trim()) errs.name = "Please select or search a skill";
    if (!proficiency)          errs.proficiency = "Select proficiency level";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    const skill: Skill = {
      id:               editSkill?.id ?? crypto.randomUUID(),
      name:             selectedName,
      proficiency,
      experienceValue:  expValue,
      experienceUnit:   expUnit,
      lastUsed,
      highlighted,
      additionalDetails: addDetails || undefined,
    };
    try {
      const payload = buildSkillPayload(skill);
      if (isEdit && editSkill) {
        await updateCandidateSkill(editSkill.id, payload);
      } else {
        const backendId = await addCandidateSkill(payload, addedSkills.map(s => s.id));
        skill.id = backendId;
      }
      onSaved(skill);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save skill");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500"><TrashSmIcon /></div>
              <div>
                <div className="font-display font-bold text-[15px] text-ink-900">Confirm Delete</div>
                <div className="text-[13px] text-ink-500 mt-1">Delete skill &quot;{deleteConfirm.name}&quot;?</div>
                <div className="text-[12px] text-ink-400 mt-0.5">This action cannot be undone.</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-50 transition">Cancel</button>
              <button type="button"
                onClick={() => { onDeleteSkill(deleteConfirm.id); setDeleteConfirm(null); }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition">Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[920px] max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <SkillIcon />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[20px] text-ink-900">
                {isEdit ? "Edit Skill" : "Add Skill"}
              </h2>
              <p className="text-[12.5px] text-ink-500 mt-0.5">
                Search and add your skills. Mark your proficiency level and highlight key skills.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-200 flex items-center justify-center text-ink-600 transition shrink-0 mt-0.5">
            ✕
          </button>
        </div>

        {/* Body — two panels */}
        <div className="flex flex-1 min-h-0">

          {/* ── Left Panel ── */}
          <SkillLeftPanel
            selectedName={selectedName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            onSelect={selectSkill}
            addedSkills={addedSkills}
            onDeleteRequest={(id, name) => setDeleteConfirm({ id, name })}
            nameError={errors.name}
          />

          {/* ── Right Panel ── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-[12px] font-bold flex items-center justify-center shrink-0">2</div>
              <span className="font-display font-bold text-[14px] text-ink-900">Skill Details</span>
            </div>

            {/* Skill Name + Proficiency — side by side */}
            <div className="grid grid-cols-2 gap-5">

              {/* Left column: name, experience, lastUsed, slider, top-skill toggle */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                    Skill Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[13.5px] bg-ink-50/40 min-h-[42px] ${
                    errors.name ? "border-red-400" : "border-ink-200"
                  }`}>
                    {selectedName
                      ? <><span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: selectedColor }} />
                          <span className="font-medium text-ink-800">{selectedName}</span></>
                      : <span className="text-ink-400 text-[13px]">Select a skill from the left</span>
                    }
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                    Experience in this skill <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="text" inputMode="numeric" value={expValue}
                      onChange={e => setExpValue(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      placeholder="e.g., 5"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-[13.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
                    <div className="relative w-28">
                      <select value={expUnit} onChange={e => setExpUnit(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-[13px] bg-white outline-none appearance-none focus:border-brand-500 transition">
                        <option>Years</option>
                        <option>Months</option>
                      </select>
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                    Last Used <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><CalendarIcon /></span>
                    <select value={lastUsed} onChange={e => setLastUsed(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-ink-200 text-[13px] bg-white outline-none appearance-none focus:border-brand-500 transition">
                      {LAST_USED_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDownIcon /></span>
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-[15px] shrink-0">⭐</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-ink-800">Highlight as Top Skill</div>
                    <div className="text-[11.5px] text-ink-500">This skill will be shown first to recruiters</div>
                  </div>
                  <input type="checkbox" checked={highlighted} onChange={e => setHighlighted(e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-600 cursor-pointer shrink-0" />
                </label>
              </div>

              {/* Right column: proficiency + additional details */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-[13px] font-semibold text-ink-700">
                    Proficiency Level <span className="text-red-500">*</span>
                  </label>
                  <button type="button" title="Indicates your expertise level in this skill" className="text-ink-400 hover:text-ink-600 transition">
                    <InfoIcon />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {PROFICIENCY_LEVELS.map(level => (
                    <label key={level.label}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border cursor-pointer transition ${
                        proficiency === level.label
                          ? "border-brand-500 bg-brand-50"
                          : "border-ink-200 hover:border-brand-300 hover:bg-ink-50/40"
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <DotsIndicator filled={level.dots} size={10} />
                        <span className="text-[13px] font-medium text-ink-700">{level.label}</span>
                      </div>
                      <input type="radio" name="proficiency" value={level.label}
                        checked={proficiency === level.label}
                        onChange={() => { setProficiency(level.label); setErrors(e => ({ ...e, proficiency: "" })); }}
                        className="accent-brand-600 w-4 h-4" />
                    </label>
                  ))}
                </div>
                {errors.proficiency && <p className="mt-1 text-[12px] text-red-600">{errors.proficiency}</p>}

                <div className="mt-4">
                  <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
                    Additional Details <span className="text-ink-400 font-normal">(Optional)</span>
                  </label>
                  <textarea value={addDetails}
                    onChange={e => setAddDetails(e.target.value.slice(0, 250))}
                    placeholder="Any additional details about your experience in this skill..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none transition" />
                  <div className="text-right text-[11px] text-ink-400">{addDetails.length}/250</div>
                </div>
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
            <button type="button" onClick={onClose} disabled={isSaving}
              className="px-6 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-50 transition">
              Cancel
            </button>
            <button type="button" onClick={handleAdd} disabled={isSaving}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-bold text-[13.5px] hover:opacity-95 disabled:opacity-60 transition"
              style={{ background: "var(--gradient-brand)" }}>
              {isSaving ? <><SpinnerIcon /> Saving…</> : <>{isEdit ? "Update Skill" : "Add Skill"} <PlusIcon /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
